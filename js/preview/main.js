/**
 * js/preview/main.js
 * プレビューページのメイン処理を担当するモジュール
 */
(function () {
  /**
   * エラー表示
   */
  function showError(message) {
    const container = document.getElementById('slides-container');
    if (container) {
      container.innerHTML = `
        <div style="padding: 20px; background-color: #f8d7da; color: #721c24; border-radius: 5px; margin: 20px;">
          <h3>エラーが発生しました</h3>
          <p>${message}</p>
          <p><a href="editor.html" style="color: #721c24; font-weight: bold;">エディタページに戻る</a></p>
        </div>
      `;
    }
  }

  /**
   * プレビューページの初期化
   */
  async function init() {
    try {
      await TemplateManager.loadAllTemplates();

      // エディタからのデータ取得
      const urlParams = new URLSearchParams(window.location.search);
      let previewData = null;

      if (urlParams.get('source') === 'editor') {
        const jsonString = sessionStorage.getItem(Config.STORAGE_KEYS.PREVIEW_DATA);
        if (jsonString) {
          previewData = Utils.parseJson(jsonString);
          if (previewData) {
            sessionStorage.removeItem(Config.STORAGE_KEYS.PREVIEW_DATA);
            Notification.success('エディタからデータを読み込みました');
          }
        }
      }

      // データがない場合はエラー
      if (!previewData) {
        throw new Error('プレビューするデータが見つかりません。エディタからデータを送信してください。');
      }

      // レンダリング実行
      await Renderer.renderSlides(previewData);
      UiController.init();

    } catch (error) {
      console.error('プレビューページの初期化に失敗しました:', error);
      showError(error.message || 'プレビューの表示中に問題が発生しました。');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();