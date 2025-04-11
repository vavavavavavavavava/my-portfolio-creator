// career-templates.js - キャリア年表関連のテンプレート

(function() {
  // グローバルテンプレートオブジェクトがなければ作成
  if (!window.inlineTemplates) {
    window.inlineTemplates = {
      slide: {},
      form: {}
    };
  }
  
  // キャリア年表スライド用テンプレート
  window.inlineTemplates.slide.career = `<!-- キャリア年表スライドテンプレート（日付カード版） -->
<div class="slide">
    <div class="title-header">キャリア年表</div>
    
    <div class="timeline-container">
        <div class="timeline-line"></div>
        <div class="timeline-entries">
            {{#each careerHistory}}
            <div class="timeline-entry">
                <div class="timeline-date">
                    <div class="date-period">{{period.from}}〜<br>{{period.to}}</div>
                </div>
                <div class="timeline-content">
                    <div class="timeline-role">{{role}}</div>
                    <div class="timeline-company">{{company}}</div>
                    <div class="timeline-description">
                        {{description}}
                    </div>
                    {{#if projects.length}}
                    <div class="timeline-highlights">
                        {{#each projects}}
                        <div class="timeline-highlight">
                            <span class="highlight-title">プロジェクト：</span> {{this}}
                        </div>
                        {{/each}}
                    </div>
                    {{/if}}
                </div>
            </div>
            {{/each}}
        </div>
    </div>
</div>`;
  
  // キャリア項目フォーム用テンプレート（エディタ用）
  window.inlineTemplates.form.careerItem = `
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
<button class="remove-btn remove-career">この職歴を削除</button>
<hr style="margin: 20px 0;">`;

  console.log('キャリア年表テンプレートを読み込みました');
})();
