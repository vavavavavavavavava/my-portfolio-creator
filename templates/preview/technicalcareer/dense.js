/**
 * templates/preview/technicalcareer/dense.js
 * プレビュー用テクニカルキャリアテンプレート（密度重視型）
 */
(function () {
  if (typeof TemplateManager === 'undefined') return;
  TemplateManager.registerTemplate('technicalcareer_dense', `
<div class="slide">
  <div class="technical-career-slide dense-mode">
    <div class="tc-title">{{projectTitle}}</div>
    
    <div class="tc-flow">
      <h3 class="tc-flow-title">{{flowTitle}}</h3>
      <div class="tc-timeline">
        {{#each roleMilestones}}
        <div class="tc-role">
          <div class="tc-role-date">{{date}}</div>
          <div class="tc-role-badge">{{label}}</div>
          <div class="tc-role-name">{{role}}</div>
          <div class="tc-role-desc">{{description}}</div>
        </div>
        {{/each}}
      </div>
    </div>
    
    <div class="tc-tech">
      <h3>技術スタック</h3>
      <div>
        {{#each techStack}}<span class="tc-tech-badge">{{this}}</span>{{/each}}
      </div>
    </div>
    
    <div class="tc-main">
      <div class="tc-overview">
        <h3>{{overviewTitle}}</h3>
        <p>{{overviewText}}</p>
      </div>
      <div class="tc-achievements">
        <h3>主要実績</h3>
        <ul>
          {{#each achievements}}<li>{{this}}</li>{{/each}}
        </ul>
      </div>
    </div>
    
    <div class="tc-illustration">
      {{#if illustrationImage}}
        <img src="{{illustrationImage}}" alt="illustration">
      {{else}}
        <div class="tc-illustration-placeholder">図・イラスト省略可</div>
      {{/if}}
    </div>
  </div>
</div>
`, 'preview');

  console.log('プレビュー用テクニカルキャリアテンプレート（密度重視型）を登録しました');
})();