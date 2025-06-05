/**
 * templates/preview/technicalcareer/visual.js
 * プレビュー用テクニカルキャリアテンプレート（視覚重視型）
 */
(function () {
    if (typeof TemplateManager === 'undefined') return;
    TemplateManager.registerTemplate('technicalcareer_visual', `
<div class="slide layout-visual">
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

  <div class="tech-section">
    <div class="section-card">
      <div class="section-title">使用技術</div>
      <div>
        {{#each techStack}}
        <span class="tech-badge">{{this}}</span>
        {{/each}}
      </div>
    </div>
  </div>

  <div class="illustration-section">
    <div class="illustration-placeholder main-visual">
      {{#if illustrationImage}}
        <img src="{{illustrationImage}}" alt="システム構成図" style="width: 100%; height: 100%; object-fit: contain;">
      {{else}}
        <div class="visual-title">
          システム構成図
        </div>
        <div class="visual-diagram">
          IoTセンサー ← MQTT → API Server<br>
          ↓<br>
          Database ← → Web Dashboard<br>
          ↓<br>
          Alert System & Analytics
        </div>
        <div class="visual-note">
          大きなイラスト・図表<br>
          配置エリア<br>
          （メインビジュアル）
        </div>
      {{/if}}
      
      {{#if additionalDiagrams}}
      <div class="additional-diagrams">
        {{#each additionalDiagrams}}
        <div class="diagram-item">
          <img src="{{image}}" alt="{{title}}" style="max-width: 100%; height: auto;">
          <div class="diagram-title">{{title}}</div>
        </div>
        {{/each}}
      </div>
      {{/if}}
    </div>
  </div>

  <div class="content-section">
    <div class="section-card">
      <div class="section-title">{{overviewTitle}}</div>
      <p class="visual-text">
        {{overviewText}}
      </p>
    </div>
    
    <div class="section-card">
      <div class="section-title">成果</div>
      <ul class="achievement-list visual-list">
        {{#each achievements}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    </div>
  </div>
</div>
`, 'preview');

    if (Config.DEBUG_MODE) {
      console.log('プレビュー用テクニカルキャリアテンプレート（視覚重視型）を登録しました');
    }
})();