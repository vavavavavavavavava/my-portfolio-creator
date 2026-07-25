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
  <input type="text" class="category-name" placeholder="言語・データ処理" value="{{category}}">
</div>
<div class="form-group">
  <label>スキル項目</label>
  <div class="skill-items dynamic-list">
    {{#each items}}
    <div class="skill-item dynamic-item">
      <input type="text" value="{{name}}" class="skill-name" placeholder="Java">
      <select class="skill-level">
        <option value="core" {{#if (eq level "core")}}selected{{/if}}>主力</option>
        <option value="practical" {{#if (eq level "practical")}}selected{{/if}}>実務経験</option>
        <option value="basic" {{#if (eq level "basic")}}selected{{/if}}>基礎学習</option>
      </select>
      <button class="remove-btn" data-action="remove-item">削除</button>
    </div>
    {{/each}}
  </div>
  <button class="add-btn add-skill">スキルを追加</button>
</div>
<button class="remove-btn" data-action="remove-container">このカテゴリを削除</button>
<hr style="margin: 20px 0;">`, 'editor');

  // 個別スキル項目追加用テンプレート
  TemplateManager.registerTemplate('skillItem', `
<div class="skill-item dynamic-item">
  <input type="text" value="" class="skill-name" placeholder="Java">
  <select class="skill-level">
    <option value="core">主力</option>
    <option value="practical">実務経験</option>
    <option value="basic" selected>基礎学習</option>
  </select>
  <button class="remove-btn" data-action="remove-item">削除</button>
</div>`, 'editor');

  if (Config.DEBUG_MODE) {
    console.log('エディタ用テクニカルスキルテンプレートを登録しました');
  }
})();
