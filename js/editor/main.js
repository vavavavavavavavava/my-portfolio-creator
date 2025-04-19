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
      
      // フォームの初期化
      FormManager.initForm();
      
      console.log('エディタページの初期化が完了しました');
    } catch (error) {
      console.error('エディタページの初期化に失敗しました:', error);
      Notification.error('アプリケーションの初期化に失敗しました');
    }
  }
  
  // DOMContentLoaded イベントで初期化
  document.addEventListener('DOMContentLoaded', init);
})();
