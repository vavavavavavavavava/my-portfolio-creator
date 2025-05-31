/**
 * templates/editor/strengths.js
 * エディタ用強み・今後の展望テンプレート
 */
(function () {
  // テンプレートマネージャーのチェック
  if (typeof TemplateManager === 'undefined') {
    console.error('TemplateManager が見つかりません。strengths.js の読み込みに失敗しました。');
    return;
  }

  // 強み項目フォーム用テンプレート
  TemplateManager.registerTemplate('strengthItem', `
<div class="form-group">
  <label>強みタイトル</label>
  <input type="text" class="strength-title" placeholder="論理的思考力" value="{{title}}">
</div>
<div class="form-group">
  <label>強み説明</label>
  <textarea class="strength-description" placeholder="説明文">{{description}}</textarea>
</div>
<button class="remove-btn" data-action="remove-container">この強みを削除</button>
<hr style="margin: 20px 0;">`, 'editor');

  console.log('エディタ用強み・今後の展望テンプレートを登録しました');
})();
