// common-templates.js - 共通項目、動的追加用のテンプレート

(function() {
  // グローバルテンプレートオブジェクトがなければ作成
  if (!window.inlineTemplates) {
    window.inlineTemplates = {
      slide: {},
      form: {}
    };
  }
  
  // 動的項目テンプレート（addDynamicItemで使用）
  window.inlineTemplates.form.dynamicItem = `
<div class="dynamic-item">
  <input type="text" value="{{value}}" class="{{className}}">
  <button class="remove-btn">削除</button>
</div>`;

  // 注力分野項目用テンプレート（エディタ用）
  window.inlineTemplates.form.focusItem = `
<div class="dynamic-item">
  <input type="text" value="{{value}}" class="focus-item" placeholder="機械学習">
  <button class="remove-btn">削除</button>
</div>`;

  // 資格項目用テンプレート（エディタ用）
  window.inlineTemplates.form.certItem = `
<div class="dynamic-item">
  <input type="text" value="{{value}}" class="cert-item" placeholder="応用情報技術者">
  <button class="remove-btn">削除</button>
</div>`;

  // プロジェクト項目用テンプレート（キャリア内で使用）
  window.inlineTemplates.form.careerProjectItem = `
<div class="dynamic-item">
  <input type="text" value="{{value}}" class="project-item" placeholder="プロジェクト名">
  <button class="remove-btn remove-project">削除</button>
</div>`;

  // 注: 以下のテンプレートは現在使用されていないが、互換性のために残しておく
  // 必要なくなったら削除可能

  // 技術スタック項目用テンプレート
  window.inlineTemplates.form.techItem = `
<div class="dynamic-item">
  <input type="text" value="{{value}}" class="tech-item" placeholder="技術名">
  <button class="remove-btn remove-tech">削除</button>
</div>`;

  // 実績項目用テンプレート
  window.inlineTemplates.form.achievementItem = `
<div class="dynamic-item">
  <input type="text" value="{{value}}" class="achievement-item" placeholder="実績内容">
  <button class="remove-btn remove-achievement">削除</button>
</div>`;

  console.log('共通テンプレートを読み込みました');
})();