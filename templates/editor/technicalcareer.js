/**
 * v2 プロジェクト入力テンプレート
 */
(function () {
  if (typeof TemplateManager === 'undefined') return;

  TemplateManager.registerTemplate('technicalProjectItem', `
<div class="project-header">
  <h3>プロジェクト詳細</h3>
  <button class="remove-btn" data-action="remove-container">このプロジェクトを削除</button>
</div>
<div class="form-group"><label>プロジェクト名</label><input type="text" class="project-title" value="{{title}}" placeholder="電池評価データ可視化システムの開発"></div>
<div class="form-group"><label>期間</label><div style="display:flex;gap:10px"><input type="text" class="project-period-from" value="{{period.from}}" placeholder="2024-04"><span>〜</span><input type="text" class="project-period-to" value="{{period.to}}" placeholder="2024-10（継続中は空欄）"></div></div>
<div class="form-group"><label>役割</label><input type="text" class="project-role" value="{{role}}" placeholder="アプリケーション開発担当"></div>
<div class="form-group"><label>概要</label><textarea class="project-overview" placeholder="背景・目的・概要">{{overview}}</textarea></div>
<div class="form-group"><label>担当内容</label><div class="responsibilities dynamic-list">{{#each responsibilities}}<div class="dynamic-item"><input type="text" class="responsibility-item" value="{{this}}"><button class="remove-btn" data-action="remove-item">削除</button></div>{{/each}}</div><button class="add-btn add-responsibility" type="button">担当内容を追加</button></div>
<div class="form-group"><label>成果・工夫</label><div class="achievements dynamic-list">{{#each achievements}}<div class="dynamic-item"><input type="text" class="achievement-item" value="{{this}}"><button class="remove-btn" data-action="remove-item">削除</button></div>{{/each}}</div><button class="add-btn add-achievement" type="button">成果を追加</button></div>
<div class="form-group"><label>技術スタック</label><div class="tech-stack dynamic-list">{{#each techStack}}<div class="dynamic-item"><input type="text" class="tech-item" value="{{this}}"><button class="remove-btn" data-action="remove-item">削除</button></div>{{/each}}</div><button class="add-btn add-tech" type="button">技術を追加</button></div>
<div class="form-group"><label>説明用画像</label><input type="text" class="illustration-image" value="{{image}}" style="display:none"></div>
<hr style="margin:20px 0">`, 'editor');
})();
