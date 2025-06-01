/**
 * templates/preview/technicalcareer/text.js
 * プレビュー用テクニカルキャリアテンプレート（テキスト重視型）
 */
(function () {
  if (typeof TemplateManager === 'undefined') return;
  TemplateManager.registerTemplate('technicalcareer_text', `
<div class="slide">
  <div class="technical-career-slide text-mode">
    <div class="tc-title">{{projectTitle}}</div>
    
    <div class="tc-flow">
      <h3 class="tc-flow-title">{{flowTitle}}</h3>
      <div class="tc-timeline">
        {{#each roleMilestones}}
        <div class="tc-role">
          <div class="tc-role-date">{{date}}</div>
          <div class="tc-role-badge">{{label}}</div>
          <div class="tc-role-name">{{role}}</div>
        </div>
        {{/each}}
      </div>
    </div>
    
    <div class="tc-main">
      <div class="tc-overview">
        <h3>{{overviewTitle}}</h3>
        <p>{{projectBackground}}</p>
      </div>
      <div class="tc-details">
        <div class="tc-detail-block">
          <h4>技術的アプローチ</h4>
          <p>{{technicalApproach}}</p>
        </div>
        <div class="tc-detail-block">
          <h4>実装上の工夫</h4>
          <p>{{implementationDetails}}</p>
        </div>
      </div>
      <div class="tc-achievements">
        <h4>定量的成果</h4>
        <ul>{{#each achievements}}<li>{{this}}</li>{{/each}}</ul>
      </div>
      <div class="tc-challenges">
        <h4>課題・影響・学び</h4>
        <ul>{{#each challenges}}<li>{{this}}</li>{{/each}}</ul>
      </div>
      {{#if businessImpact}}
      <div class="tc-impact">
        <h4>ビジネスインパクト</h4>
        <p>{{businessImpact}}</p>
      </div>
      {{/if}}
    </div>
  </div>
</div>
`, 'preview');

  console.log('プレビュー用テクニカルキャリアテンプレート（テキスト重視型）を登録しました');
})();