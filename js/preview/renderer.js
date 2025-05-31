/**
 * js/preview/renderer.js
 * プレビューページのレンダリングを担当するモジュール
 */
const Renderer = (function () {
  // 現在表示中のデータを保持する変数
  let currentDisplayData = null;

  /**
   * データとテンプレートを読み込み、レンダリングする
   * @param {Object} customData - 表示するカスタムデータ（指定がなければデフォルトデータ）
   * @return {boolean} - レンダリングの成否
   */
  async function renderSlides(customData = null) {
    try {
      await TemplateManager.loadAllTemplates();

      if (!customData) {
        throw new Error('表示するデータが指定されていません');
      }

      const data = customData;
      currentDisplayData = customData;

      // レンダリング結果を挿入するコンテナ
      const container = document.getElementById('slides-container');
      container.innerHTML = ''; // コンテナを一旦クリア

      // 各テンプレートをコンパイルしてレンダリング
      const templates = {
        title: Handlebars.compile(TemplateManager.getTemplate('title', 'preview')),
        career: Handlebars.compile(TemplateManager.getTemplate('career', 'preview')),
        technicalcareer: Handlebars.compile(TemplateManager.getTemplate('technicalcareer', 'preview')),
        skills: Handlebars.compile(TemplateManager.getTemplate('skills', 'preview')),
        strengths: Handlebars.compile(TemplateManager.getTemplate('strengths', 'preview'))
      };

      // 各テンプレートに対応するデータを渡してレンダリング
      container.innerHTML += templates.title(data.title);
      container.innerHTML += templates.career(data.career);

      // 技術キャリアが配列なら各プロジェクトごとにレンダリング
      if (Array.isArray(data.technicalcareer)) {
        data.technicalcareer.forEach(project => {
          container.innerHTML += templates.technicalcareer(project);
        });
      } else {
        // 後方互換性のため、オブジェクトの場合も対応
        container.innerHTML += templates.technicalcareer(data.technicalcareer);
      }

      container.innerHTML += templates.skills(data.skills);
      container.innerHTML += templates.strengths(data.strengths);

      // グローバル変数にも設定（外部からのアクセス用）
      window.currentDisplayData = currentDisplayData;

      return true;
    } catch (error) {
      console.error('スライドのレンダリングに失敗しました:', error);
      Notification.error('スライドのレンダリングに失敗しました: ' + error.message);
      return false;
    }
  }

  /**
   * PDFとして保存する（ブラウザの印刷機能を利用）
   */
  function saveToPDF() {
    try {
      window.print();
      return true;
    } catch (error) {
      console.error('PDF出力に失敗しました:', error);
      Notification.error('PDF出力に失敗しました: ' + error.message);
      return false;
    }
  }

  /**
   * 現在表示中のデータを取得
   * @return {Object} - 現在表示中のデータ
   */
  function getCurrentData() {
    return currentDisplayData;
  }

  // 公開API
  return {
    renderSlides,
    saveToPDF,
    getCurrentData
  };
})();

// グローバルへのエクスポート
window.Renderer = Renderer;
