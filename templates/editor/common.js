/**
 * templates/editor/common.js
 * エディタ用共通テンプレート
 */
(function () {
  // テンプレートマネージャーのチェック
  if (typeof TemplateManager === 'undefined') {
    console.error('TemplateManager が見つかりません。common.js の読み込みに失敗しました。');
    return;
  }

  // 統一された動的項目テンプレート
  const createDynamicItemTemplate = (placeholder = '', className = '') => `
    <div class="dynamic-item" data-type="${className}">
      <input type="text" value="{{value}}" class="${className}" placeholder="${placeholder}">
      <button class="remove-btn" data-action="remove-item">削除</button>
    </div>`;

  // 各テンプレートを統一フォーマットで登録
  TemplateManager.registerTemplate('dynamicItem', createDynamicItemTemplate(), 'editor');
  TemplateManager.registerTemplate('focusItem', createDynamicItemTemplate('機械学習', 'focus-item'), 'editor');
  TemplateManager.registerTemplate('certItem', createDynamicItemTemplate('応用情報技術者', 'cert-item'), 'editor');
  TemplateManager.registerTemplate('careerProjectItem', createDynamicItemTemplate('プロジェクト名', 'project-item'), 'editor');
  TemplateManager.registerTemplate('techItem', createDynamicItemTemplate('技術名', 'tech-item'), 'editor');
  TemplateManager.registerTemplate('achievementItem', createDynamicItemTemplate('実績内容', 'achievement-item'), 'editor');

  if (Config.DEBUG_MODE) {
    console.log('エディタ用共通テンプレートを登録しました');
  }
})();
