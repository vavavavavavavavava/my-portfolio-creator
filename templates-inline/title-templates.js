// title-templates.js - タイトルスライド関連のテンプレート

(function() {
  // グローバルテンプレートオブジェクトがなければ作成
  if (!window.inlineTemplates) {
    window.inlineTemplates = {
      slide: {},
      form: {}
    };
  }
  
  // タイトルスライド用テンプレート
  window.inlineTemplates.slide.title = `<!-- タイトルスライドテンプレート -->
<div class="slide title-slide">
    <div class="content">
        <div class="slide-title">テクニカルキャリアデータ</div>
        <div class="name">{{name}}</div>
        <div class="name-reading">{{nameReading}}</div>
        <div class="company">{{company}}</div>
    </div>
</div>`;
  
  // タイトルスライド用フォームテンプレート（エディタ用）
  window.inlineTemplates.form.titleForm = `
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
</div>`;

  console.log('タイトルスライドテンプレートを読み込みました');
})();
