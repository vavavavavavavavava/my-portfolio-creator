/**
 * js/preview/renderer.js (layoutMode 対応版)
 * プレビューページのレンダリングを担当するモジュール
 */
const Renderer = (function () {
  // ----------------------------------------------------------------------
  // state
  // ----------------------------------------------------------------------
  let currentDisplayData = null;
  let layoutTemplatesLoaded = false;

  // ----------------------------------------------------------------------
  // helpers
  // ----------------------------------------------------------------------
  /**
   * 指定したテンプレートを取得し、必ず "関数" として返すヘルパ。
   * TemplateManager から返却された値が文字列なら Handlebars.compile、
   * すでに関数ならそのまま返す。
   */
  function getCompiledTemplate(name, type = 'preview') {
    const tpl = TemplateManager.getTemplate(name, type);
    if (!tpl) {
      console.error(`Template not found: ${name}`);
      return () => `<div class="slide error">Template &quot;${name}&quot; not found</div>`;
    }
    return typeof tpl === 'function' ? tpl : Handlebars.compile(tpl);
  }

  /**
   * technicalcareer 用レイアウトテンプレート (detail.js / dense.js 等) を
   * 個別ロードする。未ロードの場合のみ実行。
   */
  async function loadLayoutTemplates() {
    if (layoutTemplatesLoaded) return true;

    try {
      const layoutFiles = [
        'templates/preview/technicalcareer/detail.js',
        'templates/preview/technicalcareer/dense.js',
        'templates/preview/technicalcareer/balance.js',
        'templates/preview/technicalcareer/visual.js',
        'templates/preview/technicalcareer/text.js'
      ];

      const results = await Promise.all(
        layoutFiles.map(file =>
          Utils.loadScript(file).catch(err => {
            console.warn(`Failed to load layout template: ${file}`, err);
            return null;
          })
        )
      );

      const failed = results.filter(r => r === null).length;
      if (failed > 0) {
        console.warn(`${failed} layout templates failed to load`);
      }

      layoutTemplatesLoaded = true;
      return true;
    } catch (err) {
      console.error('Error loading layout templates:', err);
      return false;
    }
  }

  // ----------------------------------------------------------------------
  // core
  // ----------------------------------------------------------------------
  /**
   * 全スライドをレンダリングする。
   * @param {Object} [customData] - 表示用データ。省略時は Config.DEFAULT_DATA
   * @return {boolean}
   */
  async function renderSlides(customData = null) {
    try {
      // 1) ベースとなるテンプレート群を読み込む
      await TemplateManager.loadAllTemplates();
      // 2) technicalcareer 用レイアウト群を読み込む
      await loadLayoutTemplates();

      // 3) データセット
      if (!customData) {
        customData = Config.DEFAULT_DATA;
      }
      currentDisplayData = customData;

      // 4) "必ず関数" なテンプレートを用意
      const templates = {
        title: getCompiledTemplate('title'),
        career: getCompiledTemplate('career'),
        technicalcareer: getCompiledTemplate('technicalcareer'),
        skills: getCompiledTemplate('skills'),
        strengths: getCompiledTemplate('strengths')
      };

      // 5) コンテナへ描画
      const container = document.getElementById('slides-container');
      container.innerHTML = '';

      const d = currentDisplayData;
      container.innerHTML += templates.title(d.title);
      container.innerHTML += templates.career(d.career);

      if (Array.isArray(d.technicalcareer)) {
        d.technicalcareer.forEach(proj => {
          container.innerHTML += templates.technicalcareer(proj);
        });
      } else if (d.technicalcareer) {
        container.innerHTML += templates.technicalcareer(d.technicalcareer);
      }

      container.innerHTML += templates.skills(d.skills);
      container.innerHTML += templates.strengths(d.strengths);

      // 6) 外部アクセス用
      window.currentDisplayData = currentDisplayData;
      return true;
    } catch (err) {
      console.error('スライドのレンダリングに失敗しました:', err);
      Notification.error('スライドのレンダリングに失敗しました: ' + err.message);
      return false;
    }
  }

  /**
   * 特定の技術キャリアスライドの layoutMode を変更して再描画。
   * @param {'technicalcareer'} slideType
   * @param {number} slideIndex
   * @param {string} newLayoutType
   */
  function changeSlideLayout(slideType, slideIndex, newLayoutType) {
    if (!currentDisplayData) {
      console.error('No data loaded');
      return false;
    }

    try {
      if (slideType === 'technicalcareer') {
        if (Array.isArray(currentDisplayData.technicalcareer)) {
          const proj = currentDisplayData.technicalcareer[slideIndex];
          if (proj) proj.layoutMode = newLayoutType;
        } else if (currentDisplayData.technicalcareer && slideIndex === 0) {
          currentDisplayData.technicalcareer.layoutMode = newLayoutType;
        }
      }
      return renderSlides(currentDisplayData);
    } catch (err) {
      console.error('Failed to change slide layout:', err);
      return false;
    }
  }

  /**
   * ブラウザ印刷機能で PDF 保存
   */
  function saveToPDF() {
    try {
      window.print();
      return true;
    } catch (err) {
      console.error('PDF 出力に失敗しました:', err);
      Notification.error('PDF 出力に失敗しました: ' + err.message);
      return false;
    }
  }

  /**
   * 現在表示中のデータを取得
   */
  function getCurrentData() {
    return currentDisplayData;
  }

  // ----------------------------------------------------------------------
  // Expose
  // ----------------------------------------------------------------------
  return {
    renderSlides,
    saveToPDF,
    getCurrentData,
    changeSlideLayout
  };
})();

// グローバルエクスポート
window.Renderer = Renderer;
