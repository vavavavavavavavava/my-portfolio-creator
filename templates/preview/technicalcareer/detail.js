(function () {
    if (typeof TemplateManager === 'undefined') return;
    TemplateManager.registerTemplate('technicalcareer_detail', `
<div class="slide technical-career-slide detail-mode">
  <div class="tc-title">{{projectTitle}}</div>
  <div class="tc-flow">
    <h3 class="tc-flow-title">{{flowTitle}}</h3>
    <div class="tc-timeline">
      {{#each roleMilestones}}
      <div class="tc-role">
        <div class="tc-role-badge">{{label}}</div>
        <div class="tc-role-date">{{date}}</div>
        <div class="tc-role-name">{{role}}</div>
        <div class="tc-role-desc">{{description}}</div>
      </div>
      {{/each}}
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
  <div class="tc-sidebar">
    <div class="tc-tech">
      <h3>技術スタック</h3>
      <div>
        {{#each techStack}}<span class="tc-tech-badge">{{this}}</span>{{/each}}
      </div>
    </div>
    {{#if illustrationImage}}
      <img class="tc-illustration" src="{{illustrationImage}}" alt="illustration">
    {{else}}
      <div class="tc-illustration-placeholder">イラスト未設定</div>
    {{/if}}
  </div>
</div>
`, 'preview');
})();
