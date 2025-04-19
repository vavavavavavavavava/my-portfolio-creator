/**
 * templates/editor/technicalcareer.js
 * エディタ用テクニカルキャリアテンプレート
 */
(function() {
  // テンプレートマネージャーのチェック
  if (typeof TemplateManager === 'undefined') {
    console.error('TemplateManager が見つかりません。technicalcareer.js の読み込みに失敗しました。');
    return;
  }
  
  // プロジェクト項目フォーム用テンプレート
  TemplateManager.registerTemplate('technicalProjectItem', `
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
</div>`, 'editor');

  console.log('エディタ用テクニカルキャリアテンプレートを登録しました');
})();
