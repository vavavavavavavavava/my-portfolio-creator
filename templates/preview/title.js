/**
 * templates/preview/title.js
 * プレビュー用タイトルスライドテンプレート
 */
(function() {
  // テンプレートマネージャーのチェック
  if (typeof TemplateManager === 'undefined') {
    console.error('TemplateManager が見つかりません。title.js の読み込みに失敗しました。');
    return;
  }
  
  // タイトルスライド用テンプレート
  TemplateManager.registerTemplate('title', `<!-- タイトルスライドテンプレート -->
<div class="slide title-slide">
    <div class="content">
        <div class="slide-title">テクニカルキャリアデータ</div>
        <div class="name">{{name}}</div>
        <div class="name-reading">{{nameReading}}</div>
        <div class="company">{{company}}</div>
    </div>
</div>`, 'preview');

  if (Config.DEBUG_MODE) {
    console.log('プレビュー用タイトルスライドテンプレートを登録しました');
  }
})();
