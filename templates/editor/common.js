/**
 * templates/editor/common.js
 * エディタ用共通テンプレート
 */
(function() {
  // テンプレートマネージャーのチェック
  if (typeof TemplateManager === 'undefined') {
    console.error('TemplateManager が見つかりません。common.js の読み込みに失敗しました。');
    return;
  }
  
  // 動的項目テンプレート
  TemplateManager.registerTemplate('dynamicItem', `
<div class="dynamic-item">
  <input type="text" value="{{value}}" class="{{className}}">
  <button class="remove-btn">削除</button>
</div>`, 'editor');

  // 注力分野項目用テンプレート
  TemplateManager.registerTemplate('focusItem', `
<div class="dynamic-item">
  <input type="text" value="{{value}}" class="focus-item" placeholder="機械学習">
  <button class="remove-btn">削除</button>
</div>`, 'editor');

  // 資格項目用テンプレート
  TemplateManager.registerTemplate('certItem', `
<div class="dynamic-item">
  <input type="text" value="{{value}}" class="cert-item" placeholder="応用情報技術者">
  <button class="remove-btn">削除</button>
</div>`, 'editor');

  // プロジェクト項目用テンプレート（キャリア内で使用）
  TemplateManager.registerTemplate('careerProjectItem', `
<div class="dynamic-item">
  <input type="text" value="{{value}}" class="project-item" placeholder="プロジェクト名">
  <button class="remove-btn remove-project">削除</button>
</div>`, 'editor');

  // 技術スタック項目用テンプレート
  TemplateManager.registerTemplate('techItem', `
<div class="dynamic-item">
  <input type="text" value="{{value}}" class="tech-item" placeholder="技術名">
  <button class="remove-btn remove-tech">削除</button>
</div>`, 'editor');

  // 実績項目用テンプレート
  TemplateManager.registerTemplate('achievementItem', `
<div class="dynamic-item">
  <input type="text" value="{{value}}" class="achievement-item" placeholder="実績内容">
  <button class="remove-btn remove-achievement">削除</button>
</div>`, 'editor');

  console.log('エディタ用共通テンプレートを登録しました');
})();
