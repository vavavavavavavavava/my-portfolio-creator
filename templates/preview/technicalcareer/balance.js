/**
 * templates/preview/technicalcareer/balance.js
 * プレビュー用テクニカルキャリアテンプレート（バランス型）
 */
(function () {
    if (typeof TemplateManager === 'undefined') return;
    TemplateManager.registerTemplate('technicalcareer_balance', `
<div class="slide layout-balance">
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
          <div class="role-desc">{{description}}</div>
        </div>
        {{/each}}
      </div>
    </div>
  </div>

  <div class="main-content">
    <div class="section-card">
      <div class="section-title">{{overviewTitle}}</div>
      <p class="balanced-text">
        {{overviewText}}
      </p>
    </div>
    
    <div class="section-card">
      <div class="section-title">主要実績</div>
      <ul class="achievement-list">
        {{#each achievements}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    </div>
  </div>

  <div class="sidebar">
    <div class="section-card">
      <div class="section-title">技術スタック</div>
      <div>
        {{#each techStack}}
        <span class="tech-badge">{{this}}</span>
        {{/each}}
      </div>
    </div>
    
    {{#if teamInfo}}
    <div class="section-card">
      <div class="section-title">チーム体制</div>
      <p class="team-info">
        {{#each teamInfo}}
        {{label}}: {{count}}名<br>
        {{/each}}
      </p>
    </div>
    {{/if}}
    
    <div class="illustration-placeholder">
      {{#if illustrationImage}}
        <img src="{{illustrationImage}}" alt="アーキテクチャ図" style="width: 100%; height: 100%; object-fit: contain;">
      {{else}}
        アーキテクチャ図<br>
        配置エリア
      {{/if}}
    </div>
  </div>
</div>
`, 'preview');

    console.log('プレビュー用テクニカルキャリアテンプレート（バランス型）を登録しました');
})();