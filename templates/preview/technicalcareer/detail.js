/**
 * templates/preview/technicalcareer/detail.js
 * プレビュー用テクニカルキャリアテンプレート（詳細重視型）
 */
(function () {
    if (typeof TemplateManager === 'undefined') return;
    TemplateManager.registerTemplate('technicalcareer_detail', `
<div class="slide layout-detail">
  <div class="title-header project-header">
    {{projectTitle}}
  </div>
  
  <div class="timeline-section">
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

  <div class="main-content">
    <div class="overview-card">
      <h3>{{overviewTitle}}</h3>
      <p>{{overviewText}}</p>
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
    
    <div class="illustration-placeholder">
      {{#if illustrationImage}}
        <img src="{{illustrationImage}}" alt="システム構成図" style="width: 100%; height: 100%; object-fit: contain;">
      {{else}}
        システムアーキテクチャ図<br>
        イラスト配置エリア<br>
        （大きく配置）
      {{/if}}
    </div>
  </div>
</div>
`, 'preview');

    console.log('プレビュー用テクニカルキャリアテンプレート（詳細重視型）を登録しました');
})();