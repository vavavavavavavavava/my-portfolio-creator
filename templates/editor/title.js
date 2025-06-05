/**
 * templates/editor/title.js
 * エディタ用タイトルスライドテンプレート
 */
(function() {
  // テンプレートマネージャーのチェック
  if (typeof TemplateManager === 'undefined') {
    console.error('TemplateManager が見つかりません。title.js の読み込みに失敗しました。');
    return;
  }
  
  // タイトルスライド用フォームテンプレート
  TemplateManager.registerTemplate('titleForm', `
<div class="form-group">
  <label for="title-name">名前</label>
  <input type="text" id="title-name" placeholder="山田 太郎" value="{{name}}">
</div>
<div class="form-group">
  <label for="title-name-reading">ふりがな</label>
  <input type="text" id="title-name-reading" placeholder="やまだ たろう" value="{{nameReading}}">
</div>
<div class="form-group">
  <label for="title-company">会社名</label>
  <input type="text" id="title-company" placeholder="株式会社サンプル" value="{{company}}">
</div>`, 'editor');

  if (Config.DEBUG_MODE) {
    console.log('エディタ用タイトルテンプレートを登録しました');
  }
})();
