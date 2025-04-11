// init.js
// 初期状態のフォーム準備
function initForm() {
  // 空の職歴項目を1つ追加
  document.getElementById('add-career').click();
  // 空のプロジェクトを1つ追加
  document.getElementById('add-project').click();
  // 空のスキルカテゴリを1つ追加
  document.getElementById('add-category').click();
  // 空の強み項目を1つ追加
  document.getElementById('add-strength').click();
  // 空の注力分野を1つ追加
  document.getElementById('add-focus').click();
  // 空の資格を1つ追加
  document.getElementById('add-certification').click();
  
  // Handlebarsに新しいヘルパーを追加
  Handlebars.registerHelper('startsWith', function(str, prefix) {
    return str && str.toString().startsWith(prefix);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initForm();
  
  // すべてのテンプレート読み込み後、既存のプロジェクト要素に画像アップロード機能を追加
  if (typeof window.loadAllTemplates === 'function') {
    window.loadAllTemplates().then(() => {
      if (typeof upgradeExistingProjects === 'function') {
        upgradeExistingProjects();
      }
    });
  }
});