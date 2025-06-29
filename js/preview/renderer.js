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
   * キャリア年表データを適切なページ数に分割する
   * @param {Array} careerHistory - キャリア履歴データ
   * @param {number} maxItemsPerPage - 1ページあたりの最大項目数
   * @return {Array} - 分割されたページ配列
   */
  function splitCareerHistory(careerHistory, maxItemsPerPage = 4) {
    if (!Array.isArray(careerHistory) || careerHistory.length === 0) {
      return [];
    }

    const pages = [];
    for (let i = 0; i < careerHistory.length; i += maxItemsPerPage) {
      pages.push(careerHistory.slice(i, i + maxItemsPerPage));
    }
    return pages;
  }

  /**
   * テクニカルキャリアデータを適切なページ数に分割する
   * @param {Array} technicalCareer - テクニカルキャリアデータ  
   * @param {number} maxItemsPerPage - 1ページあたりの最大項目数
   * @return {Array} - 分割されたページ配列
   */
  function splitTechnicalCareer(technicalCareer, maxItemsPerPage = 2) {
    if (!Array.isArray(technicalCareer) || technicalCareer.length === 0) {
      return [];
    }

    const pages = [];
    for (let i = 0; i < technicalCareer.length; i += maxItemsPerPage) {
      pages.push(technicalCareer.slice(i, i + maxItemsPerPage));
    }
    return pages;
  }

  /**
   * スキルデータを適切なページ数に分割する
   * @param {Object} skillsData - スキルデータ
   * @param {number} maxCategoriesPerPage - 1ページあたりの最大カテゴリ数
   * @return {Array} - 分割されたページ配列
   */
  function splitSkills(skillsData, maxCategoriesPerPage = 6) {
    if (!skillsData || !Array.isArray(skillsData.categories)) {
      return [];
    }

    const categories = skillsData.categories;
    if (categories.length <= maxCategoriesPerPage) {
      return [skillsData];
    }

    const pages = [];
    for (let i = 0; i < categories.length; i += maxCategoriesPerPage) {
      const pageCategories = categories.slice(i, i + maxCategoriesPerPage);
      pages.push({
        ...skillsData,
        categories: pageCategories,
        pageNumber: Math.floor(i / maxCategoriesPerPage) + 1,
        totalPages: Math.ceil(categories.length / maxCategoriesPerPage)
      });
    }
    return pages;
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

      // キャリア年表の複数ページ対応
      if (d.career && Array.isArray(d.career.careerHistory)) {
        const careerPages = splitCareerHistory(d.career.careerHistory);
        careerPages.forEach((pageData, index) => {
          const careerPageData = {
            ...d.career,
            careerHistory: pageData,
            pageNumber: index + 1,
            totalPages: careerPages.length
          };
          container.innerHTML += templates.career(careerPageData);
        });
      } else if (d.career) {
        container.innerHTML += templates.career(d.career);
      }

      // テクニカルキャリアの複数ページ対応
      if (Array.isArray(d.technicalcareer) && d.technicalcareer.length > 0) {
        d.technicalcareer.forEach(proj => {
          container.innerHTML += templates.technicalcareer(proj);
        });
      } else if (d.technicalcareer) {
        container.innerHTML += templates.technicalcareer(d.technicalcareer);
      }

      // スキルの複数ページ対応
      if (d.skills) {
        const skillPages = splitSkills(d.skills);
        skillPages.forEach(pageData => {
          container.innerHTML += templates.skills(pageData);
        });
      }

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
