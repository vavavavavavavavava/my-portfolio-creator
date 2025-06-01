(function () {
    if (typeof TemplateManager === 'undefined') return;
    TemplateManager.registerTemplate('technicalcareer_visual', `
<div class="slide technical-career-slide visual-mode">
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
  <div class="tc-tech">
    <h3>使用技術</h3>
    <div>
      {{#each techStack}}<span class="tc-tech-badge">{{this}}</span>{{/each}}
    </div>
  </div>
  <div class="tc-visual">
    {{#if illustrationImage}}
      <img src="{{illustrationImage}}" alt="illustration">
    {{else}}
      <div class="tc-illustration-placeholder">大きな構成図・イラスト</div>
    {{/if}}
    {{#if additionalDiagrams}}
      <div class="tc-diagrams">
        {{#each additionalDiagrams}}
          <div class="tc-diagram-item"><img src="{{image}}" alt="{{title}}"><div>{{title}}</div></div>
        {{/each}}
      </div>
    {{/if}}
  </div>
  <div class="tc-main">
    <div class="tc-overview">
      <h3>{{overviewTitle}}</h3>
      <p>{{overviewText}}</p>
    </div>
    <div class="tc-achievements">
      <h3>成果</h3>
      <ul>
        {{#each achievements}}<li>{{this}}</li>{{/each}}
      </ul>
    </div>
  </div>
</div>
`, 'preview');
})();
