/**
 * templates/editor/career.js
 * エディタ用キャリア年表テンプレート
 */
(function () {
  // テンプレートマネージャーのチェック
  if (typeof TemplateManager === 'undefined') {
    console.error('TemplateManager が見つかりません。career.js の読み込みに失敗しました。');
    return;
  }

  // キャリア項目フォーム用テンプレート
  TemplateManager.registerTemplate('careerItem', `
<div class="form-group">
  <label>期間</label>
  <div style="display: flex; gap: 10px;">
    <input type="text" class="career-period-from" placeholder="2018年4月" value="{{period.from}}">
    <span style="align-self: center;">～</span>
    <input type="text" class="career-period-to" placeholder="2020年3月" value="{{period.to}}">
  </div>
</div>
<div class="form-group">
  <label>役職</label>
  <input type="text" class="career-role" placeholder="エンジニア" value="{{role}}">
</div>
<div class="form-group">
  <label>会社名</label>
  <input type="text" class="career-company" placeholder="株式会社サンプル" value="{{company}}">
</div>
<div class="form-group">
  <label>説明</label>
  <textarea class="career-description" placeholder="職務内容の説明">{{description}}</textarea>
</div>
<div class="form-group">
  <label>プロジェクト</label>
  <div class="career-projects dynamic-list">
    {{#each projects}}
    <div class="dynamic-item">
      <input type="text" value="{{this}}" class="project-item">
      <button class="remove-btn remove-project">削除</button>
    </div>
    {{/each}}
  </div>
  <button class="add-btn add-project">プロジェクトを追加</button>
</div>
<button class="remove-btn" data-action="remove-container">この職歴を削除</button>
<hr style="margin: 20px 0;">`, 'editor');

  if (Config.DEBUG_MODE) {
    console.log('エディタ用キャリア年表テンプレートを登録しました');
  }
})();
