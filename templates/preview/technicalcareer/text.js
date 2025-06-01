/**
 * templates/preview/technicalcareer/text.js
 * プレビュー用テクニカルキャリアテンプレート（テキスト重視型）
 */
(function () {
    if (typeof TemplateManager === 'undefined') return;
    TemplateManager.registerTemplate('technicalcareer_text', `
<div class="slide layout-text">
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

  <div class="overview-section">
    <div class="overview-card">
      <h3>{{overviewTitle}}</h3>
      <p>
        {{projectBackground}}
      </p>
    </div>
  </div>

  <div class="details-section">
    <div class="section-card">
      <div class="section-title">技術的アプローチ</div>
      <p class="detail-text">
        {{technicalApproach}}
      </p>
    </div>
    
    <div class="section-card">
      <div class="section-title">実装上の工夫</div>
      <p class="detail-text">
        {{implementationDetails}}
      </p>
    </div>
  </div>

  <div class="footer-section">
    <div class="section-card">
      <div class="section-title">技術スタック</div>
      <div>
        {{#each techStack}}
        <span class="tech-badge">{{this}}</span>
        {{/each}}
      </div>
    </div>
    
    <div class="section-card">
      <div class="section-title">定量的成果</div>
      <ul class="achievement-list">
        {{#each achievements}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    </div>
    
    {{#if challenges}}
    <div class="section-card">
      <div class="section-title">課題・影響・学び</div>
      <ul class="achievement-list">
        {{#each challenges}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    </div>
    {{/if}}
    
    {{#if businessImpact}}
    <div class="section-card">
      <div class="section-title">ビジネスインパクト</div>
      <p class="detail-text">
        {{businessImpact}}
      </p>
    </div>
    {{/if}}
  </div>
</div>
`, 'preview');

    console.log('プレビュー用テクニカルキャリアテンプレート（テキスト重視型）を登録しました');
})();