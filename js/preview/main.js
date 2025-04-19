/**
 * js/preview/main.js
 * プレビューページのメイン処理を担当するモジュール
 */
(function() {
  /**
   * プレビューページの初期化
   */
  async function init() {
    try {
      // テンプレートが読み込まれているか確認
      await TemplateManager.loadAllTemplates();
      
      // URLのクエリパラメータをチェック
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('source');

      // セッションストレージからデータを取得（エディタからのデータ）
      let previewData = null;
      
      if (source === 'editor') {
        try {
          const jsonString = sessionStorage.getItem(Config.STORAGE_KEYS.PREVIEW_DATA);
          if (jsonString) {
            previewData = Utils.parseJson(jsonString);
            
            if (previewData) {
              // エディタからのデータでレンダリング
              await Renderer.renderSlides(previewData);
              sessionStorage.removeItem(Config.STORAGE_KEYS.PREVIEW_DATA); // 不要になったので削除
              Notification.success('エディタからデータを読み込みました');
            } else {
              throw new Error('セッションストレージからのデータの解析に失敗しました');
            }
          }
        } catch (error) {
          console.error('プレビューデータの解析に失敗しました:', error);
          Notification.error('プレビューデータの解析に失敗しました');
        }
      }
      
      // データが読み込めなかった場合はデフォルトデータでレンダリング
      if (!previewData) {
        await Renderer.renderSlides();
      }
      
      // UIコントローラーの初期化
      UiController.init();
    } catch (error) {
      console.error('プレビューページの初期化に失敗しました:', error);
      
      const container = document.getElementById('slides-container');
      if (container) {
        container.innerHTML = `
          <div style="padding: 20px; background-color: #f8d7da; color: #721c24; border-radius: 5px; margin: 20px;">
            <h3>エラーが発生しました</h3>
            <p>${error.message || 'プレビューの表示中に問題が発生しました。'}</p>
            <p>もう一度試すか、エディタページに戻ってデータを確認してください。</p>
            <p><a href="editor.html" style="color: #721c24; font-weight: bold;">エディタページに戻る</a></p>
          </div>
        `;
      }
    }
  }
  
  // DOMContentLoaded イベントで初期化
  document.addEventListener('DOMContentLoaded', init);
})();
