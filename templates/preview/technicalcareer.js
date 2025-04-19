/**
 * templates/preview/technicalcareer.js
 * プレビュー用テクニカルキャリアテンプレート
 */
(function() {
  // テンプレートマネージャーのチェック
  if (typeof TemplateManager === 'undefined') {
    console.error('TemplateManager が見つかりません。technicalcareer.js の読み込みに失敗しました。');
    return;
  }
  
  // テクニカルキャリアスライド用テンプレート
  TemplateManager.registerTemplate('technicalcareer', `<div class="slide">
  <div class="technical-career-slide">
    <!-- タイトル部分 -->
    <div class="title">{{projectTitle}}</div>
    
    <!-- 役割変遷エリア -->
    <div class="flow">
      <h3 class="flow-title">{{flowTitle}}</h3>
      
      <div class="timeline-container">
        <div class="timeline">
          {{#each roleMilestones}}
          <div class="role-item">
            <div class="role-date">{{date}}</div>
            <div class="role-icon">{{label}}</div>
            <div class="role-info">
              <div class="role-title">{{role}}</div>
              <div class="role-description">{{description}}</div>
            </div>
          </div>
          {{/each}}
        </div>
      </div>
    </div>
    
    <!-- 技術スタック -->
    <div class="tech-stack">
      <h3>技術スタック</h3>
      <div class="tech-badges">
        {{#each techStack}}
        <div class="tech-badge">{{this}}</div>
        {{/each}}
      </div>
    </div>
    
    <!-- プロジェクト概要と実績 -->
    <div class="main-content">
      <div class="overview">
        <h3>{{overviewTitle}}</h3>
        <p>{{overviewText}}</p>
      </div>
      <div class="achievements">
        <h3>実績一覧</h3>
        <ul>
          {{#each achievements}}
          <li>{{this}}</li>
          {{/each}}
        </ul>
      </div>
    </div>
    
    <!-- イラスト／アーキテクチャ図 -->
    <div class="illustration">
      {{#if illustrationImage}}
        {{#if (startsWith illustrationImage "data:image/")}}
        <img src="{{illustrationImage}}" alt="Illustration">
        {{else}}
        <img src="{{illustrationImage}}" alt="Illustration" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'illustration-placeholder\\'>画像を読み込めませんでした</div>';">
        {{/if}}
      {{else}}
      <div class="illustration-placeholder">
        システムアーキテクチャ図 / イメージ
      </div>
      {{/if}}
    </div>
  </div>
</div>`, 'preview');

  console.log('プレビュー用テクニカルキャリアテンプレートを登録しました');
})();
