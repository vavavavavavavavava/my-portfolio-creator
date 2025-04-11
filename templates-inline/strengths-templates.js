// strengths-templates.js - 強み・今後の展望関連のテンプレート

(function() {
  // グローバルテンプレートオブジェクトがなければ作成
  if (!window.inlineTemplates) {
    window.inlineTemplates = {
      slide: {},
      form: {}
    };
  }
  
  // 強み・今後の展望スライド用テンプレート
  window.inlineTemplates.slide.strengths = `<!-- 強みスライドテンプレート -->
<div class="slide">
    <div class="title-header">強み・今後の展望</div>
    
    <div class="content" style="padding: 0 30px;">
        <div style="margin-bottom: 20px;">
            <div class="section-title" style="font-size: 18px; font-weight: bold; color: #3498db; border-bottom: 2px solid #3498db; padding-bottom: 5px; margin-bottom: 15px;">
                技術的強み・ソフトスキル
            </div>
            <div class="strengths-container">
                {{#each strengths}}
                <div class="strength-item">
                    <div class="strength-icon">{{inc @index}}</div>
                    <div class="strength-content">
                        <div class="strength-title">{{title}}</div>
                        <div class="strength-description">
                            {{description}}
                        </div>
                    </div>
                </div>
                {{/each}}
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="future-focus">
                <div class="future-focus-title">今後の注力分野</div>
                <div class="future-focus-content">
                    テクノロジーの進化に合わせて、以下の分野へのスキルアップを図っていきます。
                </div>
                <div class="focus-highlights">
                    {{#each futureFocus}}
                    <div class="focus-highlight">{{this}}</div>
                    {{/each}}
                </div>
            </div>
            
            <div class="certifications">
                <div class="certifications-title">保有資格</div>
                <div class="certifications-content">
                    これまでに取得した技術関連の資格です。
                </div>
                <div class="cert-list">
                    {{#each certifications}}
                    <div class="cert-item">{{this}}</div>
                    {{/each}}
                </div>
            </div>
        </div>
    </div>
</div>`;
  
  // 強み項目フォーム用テンプレート（エディタ用）
  window.inlineTemplates.form.strengthItem = `
<div class="form-group">
  <label>強みタイトル</label>
  <input type="text" class="strength-title" placeholder="論理的思考力" value="{{title}}">
</div>
<div class="form-group">
  <label>強み説明</label>
  <textarea class="strength-description" placeholder="説明文">{{description}}</textarea>
</div>
<button class="remove-btn remove-strength">この強みを削除</button>
<hr style="margin: 20px 0;">`;

  console.log('強み・今後の展望テンプレートを読み込みました');
})();
