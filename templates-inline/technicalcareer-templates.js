// technicalcareer-templates.js - テクニカルキャリア関連のテンプレート

(function() {
  // グローバルテンプレートオブジェクトがなければ作成
  if (!window.inlineTemplates) {
    window.inlineTemplates = {
      slide: {},
      form: {}
    };
  }
  
  // テクニカルキャリアスライド用テンプレート
  window.inlineTemplates.slide.technicalcareer = `<div class="slide">
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
</div>`;
  
  // プロジェクト項目フォーム用テンプレート（エディタ用）
  // 注: HTMLは直接構築するようになったが、初期フォーム生成のために残す
  window.inlineTemplates.form.technicalProjectItem = `
<div class="project-header">
  <h3>プロジェクト詳細</h3>
  <button class="remove-btn remove-project">このプロジェクトを削除</button>
</div>
<div class="form-group">
  <label>プロジェクトタイトル</label>
  <input type="text" class="project-title" placeholder="〇〇システムの開発" value="">
</div>
<div class="form-group">
  <label>フローセクションタイトル</label>
  <input type="text" class="flow-title" placeholder="役割の変遷" value="">
</div>
<div class="form-group">
  <label>役割マイルストーン</label>
  <div class="role-milestones dynamic-list">
    <!-- 役割マイルストーンはJSで動的に追加 -->
  </div>
  <button class="add-btn add-role-milestone">役割を追加</button>
</div>
<div class="form-group">
  <label>技術スタック</label>
  <div class="tech-stack dynamic-list">
    <!-- 技術スタックはJSで動的に追加 -->
  </div>
  <button class="add-btn add-tech">技術を追加</button>
</div>
<div class="form-group">
  <label>概要タイトル</label>
  <input type="text" class="overview-title" placeholder="プロジェクト概要" value="">
</div>
<div class="form-group">
  <label>概要テキスト</label>
  <textarea class="overview-text" placeholder="プロジェクトの概要説明"></textarea>
</div>
<div class="form-group">
  <label>実績一覧</label>
  <div class="achievements dynamic-list">
    <!-- 実績はJSで動的に追加 -->
  </div>
  <button class="add-btn add-achievement">実績を追加</button>
</div>
<div class="form-group">
  <label>イラスト画像</label>
  <input type="text" class="illustration-image" placeholder="" value="" style="display: none;">
  <!-- 画像アップローダーはJSで動的に追加 -->
</div>`;

  console.log('テクニカルキャリアテンプレートを読み込みました');
})();