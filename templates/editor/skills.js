/**
 * templates/editor/skills.js
 * エディタ用テクニカルスキルテンプレート
 */
(function () {
  // テンプレートマネージャーのチェック
  if (typeof TemplateManager === 'undefined') {
    console.error('TemplateManager が見つかりません。skills.js の読み込みに失敗しました。');
    return;
  }

  // スキルカテゴリフォーム用テンプレート
  TemplateManager.registerTemplate('skillCategory', `
<div class="form-group">
  <label>カテゴリ名</label>
  <input type="text" class="category-name" placeholder="プログラミング言語" value="{{categoryName}}">
</div>
<div class="form-group">
  <label>スキル項目</label>
  <div class="skill-items dynamic-list">
    {{#each items}}
    <div class="skill-item">
      <input type="text" value="{{name}}" class="skill-name" placeholder="Java">
      <div class="level-select">
        <div class="level-option">
          <input type="radio" name="skill-{{@root.skillId}}-{{@index}}" value="1" {{#if (eq level 1)}}checked{{/if}}>
          <div class="level-dot beginner"></div>
        </div>
        <div class="level-option">
          <input type="radio" name="skill-{{@root.skillId}}-{{@index}}" value="2" {{#if (eq level 2)}}checked{{/if}}>
          <div class="level-dot intermediate"></div>
        </div>
        <div class="level-option">
          <input type="radio" name="skill-{{@root.skillId}}-{{@index}}" value="3" {{#if (eq level 3)}}checked{{/if}}>
          <div class="level-dot advanced"></div>
        </div>
      </div>
      <button class="remove-btn remove-skill">削除</button>
    </div>
    {{/each}}
  </div>
  <button class="add-btn add-skill">スキルを追加</button>
</div>
<button class="remove-btn" data-action="remove-container">このカテゴリを削除</button>
<hr style="margin: 20px 0;">`, 'editor');

  // 個別スキル項目追加用テンプレート
  TemplateManager.registerTemplate('skillItem', `
<div class="skill-item">
  <input type="text" value="" class="skill-name" placeholder="Java">
  <div class="level-select">
    <div class="level-option">
      <input type="radio" name="skill-{{skillId}}" value="1" checked>
      <div class="level-dot beginner"></div>
    </div>
    <div class="level-option">
      <input type="radio" name="skill-{{skillId}}" value="2">
      <div class="level-dot intermediate"></div>
    </div>
    <div class="level-option">
      <input type="radio" name="skill-{{skillId}}" value="3">
      <div class="level-dot advanced"></div>
    </div>
  </div>
  <button class="remove-btn" data-action="remove-item">削除</button>
</div>`, 'editor');

  if (Config.DEBUG_MODE) {
    console.log('エディタ用テクニカルスキルテンプレートを登録しました');
  }
})();
