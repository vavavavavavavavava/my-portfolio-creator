/**
 * js/editor/main.js
 * エディタページのメイン処理を担当するモジュール
 */
(function() {
  /**
   * エディタページの初期化
   */
  async function init() {
    try {
      // テンプレートの読み込み
      await TemplateManager.loadAllTemplates();
      
      // UIコントローラーの初期化
      UiController.init();
      
      // プレビューから戻った場合は編集内容を復元し、初回表示ではサンプルを読み込む
      const savedEditorState = Utils.parseJson(
        sessionStorage.getItem(Config.STORAGE_KEYS.EDITOR_STATE)
      );
      sessionStorage.removeItem(Config.STORAGE_KEYS.EDITOR_STATE);
      await JsonHandler.loadDataIntoForm(
        savedEditorState || DefaultPortfolioData.create(),
        { notify: false }
      );
      
      console.log('エディタページの初期化が完了しました');
    } catch (error) {
      console.error('エディタページの初期化に失敗しました:', error);
      Notification.error('アプリケーションの初期化に失敗しました');
    }
  }
  
  // DOMContentLoaded イベントで初期化
  document.addEventListener('DOMContentLoaded', init);

  // 戻る操作でページがそのまま復元された場合、不要になった退避データを破棄する
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      sessionStorage.removeItem(Config.STORAGE_KEYS.EDITOR_STATE);
    }
  });
})();
