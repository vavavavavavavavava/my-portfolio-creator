/**
 * templates/editor/technicalcareer.js
 * エディタ用テクニカルキャリアテンプレート
 */
(function () {
  if (typeof TemplateManager === 'undefined') {
    console.error('TemplateManager が見つかりません。technicalcareer.js の読み込みに失敗しました。');
    return;
  }

  // editor用 テクニカルキャリア（プロジェクト）項目
  TemplateManager.registerTemplate('technicalProjectItem', `
<div class="project-header">
  <h3>プロジェクト詳細</h3>
  <button class="remove-btn" data-action="remove-container">このプロジェクトを削除</button>
</div>
<div class="form-group">
  <label>レイアウトモード</label>
  <select class="layout-mode-selector">
    <option value="detail">詳細重視（標準）</option>
    <option value="dense">密度重視</option>
    <option value="balance">バランス型</option>
    <option value="visual">視覚重視</option>
    <option value="text">テキスト重視</option>
  </select>
</div>

<!-- detail/dense/balance 共通フィールド -->
<div class="project-fields mode-detail mode-dense mode-balance">
  <div class="form-group">
    <label>プロジェクトタイトル</label>
    <input type="text" class="project-title" placeholder="〇〇システムの開発">
  </div>
  <div class="form-group">
    <label>フローセクションタイトル</label>
    <input type="text" class="flow-title" placeholder="役割の変遷">
  </div>
  <div class="form-group">
    <label>役割マイルストーン</label>
    <div class="role-milestones dynamic-list"></div>
    <button class="add-btn add-role-milestone" type="button">役割を追加</button>
  </div>
  <div class="form-group">
    <label>技術スタック</label>
    <div class="tech-stack dynamic-list"></div>
    <button class="add-btn add-tech" type="button">技術を追加</button>
  </div>
  <div class="form-group">
    <label>概要タイトル</label>
    <input type="text" class="overview-title" placeholder="プロジェクト概要">
  </div>
  <div class="form-group">
    <label>概要テキスト</label>
    <textarea class="overview-text" placeholder="プロジェクトの概要説明"></textarea>
  </div>
  <div class="form-group">
    <label>実績一覧</label>
    <div class="achievements dynamic-list"></div>
    <button class="add-btn add-achievement" type="button">実績を追加</button>
  </div>
  <div class="form-group">
    <label>イラスト画像</label>
    <input type="text" class="illustration-image" placeholder="画像URLまたはbase64" style="display: none;">
    <!-- 画像アップローダーはJSで自動追加 -->
  </div>
</div>

<!-- balance専用: チーム構成 -->
<div class="project-fields mode-balance">
  <div class="form-group">
    <label>チーム構成（項目名＋人数を自由に追加）</label>
    <div class="team-info-list dynamic-list"></div>
    <button class="add-btn add-team-info">項目を追加</button>
  </div>
</div>

<!-- visualモード専用 -->
<div class="project-fields mode-visual" style="display: none;">
  <div class="form-group">
    <label>プロジェクトタイトル</label>
    <input type="text" class="project-title" placeholder="〇〇システムの開発">
  </div>
  <div class="form-group">
    <label>フローセクションタイトル</label>
    <input type="text" class="flow-title" placeholder="開発フェーズなど">
  </div>
  <div class="form-group">
    <label>役割マイルストーン</label>
    <div class="role-milestones dynamic-list"></div>
    <button class="add-btn add-role-milestone" type="button">役割を追加</button>
  </div>
  <div class="form-group">
    <label>技術スタック</label>
    <div class="tech-stack dynamic-list"></div>
    <button class="add-btn add-tech" type="button">技術を追加</button>
  </div>
  <div class="form-group">
    <label>概要タイトル</label>
    <input type="text" class="overview-title" placeholder="システム概要">
  </div>
  <div class="form-group">
    <label>概要テキスト</label>
    <textarea class="overview-text" placeholder="プロジェクトの概要"></textarea>
  </div>
  <div class="form-group">
    <label>成果一覧</label>
    <div class="achievements dynamic-list"></div>
    <button class="add-btn add-achievement" type="button">成果を追加</button>
  </div>
  <div class="form-group">
    <label>アーキテクチャ/構成図イメージ</label>
    <input type="text" class="illustration-image" placeholder="画像URLまたはbase64" style="display: none;">
    <!-- 画像アップローダー自動追加 -->
  </div>
  <div class="form-group">
    <label>追加ダイアグラム</label>
    <div class="additional-diagrams dynamic-list"></div>
    <button class="add-btn add-diagram" type="button">ダイアグラム画像を追加</button>
  </div>
</div>

<!-- textモード専用 -->
<div class="project-fields mode-text" style="display: none;">
  <div class="form-group">
    <label>プロジェクトタイトル</label>
    <input type="text" class="project-title" placeholder="〇〇システムの開発">
  </div>
  <div class="form-group">
    <label>フローセクションタイトル</label>
    <input type="text" class="flow-title" placeholder="役割の変遷">
  </div>
  <div class="form-group">
    <label>役割マイルストーン</label>
    <div class="role-milestones dynamic-list"></div>
    <button class="add-btn add-role-milestone" type="button">役割を追加</button>
  </div>
  <div class="form-group">
    <label>技術スタック</label>
    <div class="tech-stack dynamic-list"></div>
    <button class="add-btn add-tech" type="button">技術を追加</button>
  </div>
  <div class="form-group">
    <label>概要タイトル</label>
    <input type="text" class="overview-title" placeholder="システム概要">
  </div>
  <div class="form-group">
    <label>プロジェクト背景</label>
    <textarea class="project-background" placeholder="背景説明"></textarea>
  </div>
  <div class="form-group">
    <label>技術的アプローチ</label>
    <textarea class="technical-approach" placeholder="モノリス→マイクロサービスなど"></textarea>
  </div>
  <div class="form-group">
    <label>実装上の工夫</label>
    <textarea class="implementation-details" placeholder="工夫・ポイント"></textarea>
  </div>
  <div class="form-group">
    <label>実績一覧</label>
    <div class="achievements dynamic-list"></div>
    <button class="add-btn add-achievement" type="button">実績を追加</button>
  </div>
  <div class="form-group">
    <label>課題・影響・学び</label>
    <div class="challenges dynamic-list"></div>
    <button class="add-btn add-challenge" type="button">課題を追加</button>
  </div>
  <div class="form-group">
    <label>ビジネスインパクト（任意）</label>
    <textarea class="business-impact" placeholder="売上貢献・効率化など"></textarea>
  </div>
</div>
`);
})();
