/**
 * templates/preview/technicalcareer/dense.js
 * プレビュー用テクニカルキャリアテンプレート（密度重視型）
 */
(function () {
    if (typeof TemplateManager === 'undefined') return;
    TemplateManager.registerTemplate('technicalcareer_dense', `
<div class="slide layout-dense">
  <div class="title-header project-header">
    {{projectTitle}}
  </div>
  
  <div class="timeline-section">
    <div class="section-card">
      <div class="section-title">{{flowTitle}}</div>
      <div class="role-timeline">
        {{#each roleMilestones}}
        <div class="role-item">
          <div class="role-badge">{{label}}</div>
          <div class="role-date">{{date}}</div>
          <div class="role-name">{{role}}</div>
        </div>
        {{/each}}
      </div>
    </div>
  </div>

  <div class="tech-section">
    <div class="section-card">
      <div class="section-title">技術スタック</div>
      <div>
        {{#each techStack}}
        <span class="tech-badge">{{this}}</span>
        {{/each}}
      </div>
    </div>
  </div>

  <div class="overview-section">
    <div class="section-card">
      <div class="section-title">{{overviewTitle}}</div>
      <p class="compact-text">
        {{overviewText}}
      </p>
    </div>
  </div>

  <div class="achievements-section">
    <div class="section-card">
      <div class="section-title">主要実績</div>
      <ul class="achievement-list compact-list">
        {{#each achievements}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    </div>
  </div>

  <div class="illustration-section">
    <div class="illustration-placeholder">
      {{#if illustrationImage}}
        <img src="{{illustrationImage}}" alt="システム構成図" style="width: 100%; height: 100%; object-fit: contain;">
      {{else}}
        システム<br>構成図<br>（コンパクト）
      {{/if}}
    </div>
  </div>
</div>
`, 'preview');

    if (Config.DEBUG_MODE) {
      console.log('プレビュー用テクニカルキャリアテンプレート（密度重視型）を登録しました');
    }
})();