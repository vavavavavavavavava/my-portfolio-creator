// skills-templates.js - テクニカルスキル関連のテンプレート

(function() {
  // グローバルテンプレートオブジェクトがなければ作成
  if (!window.inlineTemplates) {
    window.inlineTemplates = {
      slide: {},
      form: {}
    };
  }
  
  // テクニカルスキルスライド用テンプレート
  window.inlineTemplates.slide.skills = `<!-- テクニカルスキルスライドテンプレート -->
<div class="slide">
    <div class="title-header">テクニカルスキル</div>
    
    <div class="content" style="padding: 0 30px;">
        {{#each categories}}
        <div class="skill-category">
            <div class="category-title">{{categoryName}}</div>
            <div class="skills-container">
                {{#each items}}
                <div class="skill-item">
                    <div class="skill-name">{{name}}</div>
                    <div class="skill-level-container">
                        <div class="skill-level">
                            {{{skillDots level}}}
                        </div>
                    </div>
                </div>
                {{/each}}
            </div>
        </div>
        {{/each}}
        
        <!-- 凡例 -->
        <div class="legend">
            {{#each skillLevelLabels}}
            <div class="legend-item">
                <div class="level-dot {{legendClass @index}}" style="width: 10px; height: 10px;"></div>
                <div class="legend-label">{{this}}</div>
            </div>
            {{/each}}
        </div>
    </div>
</div>`;
  
  // スキルカテゴリフォーム用テンプレート（エディタ用）
  window.inlineTemplates.form.skillCategory = `
<div class="form-group">
  <label>カテゴリ名</label>
  <input type="text" class="category-name" placeholder="プログラミング言語" value="{{categoryName}}">
</div>
<div class="form-group">
  <label>スキル項目</label>
  <div class="skill-items dynamic-list">
    {{#each items}}
    <div class="skill-item">
      <input type="text" value="{{name}}" class="skill-name" placeholder="Java">
      <div class="level-select">
        <div class="level-option">
          <input type="radio" name="skill-{{@root.skillId}}-{{@index}}" value="1" {{#if (eq level 1)}}checked{{/if}}>
          <div class="level-dot beginner"></div>
        </div>
        <div class="level-option">
          <input type="radio" name="skill-{{@root.skillId}}-{{@index}}" value="2" {{#if (eq level 2)}}checked{{/if}}>
          <div class="level-dot intermediate"></div>
        </div>
        <div class="level-option">
          <input type="radio" name="skill-{{@root.skillId}}-{{@index}}" value="3" {{#if (eq level 3)}}checked{{/if}}>
          <div class="level-dot advanced"></div>
        </div>
      </div>
      <button class="remove-btn remove-skill">削除</button>
    </div>
    {{/each}}
  </div>
  <button class="add-btn add-skill">スキルを追加</button>
</div>
<button class="remove-btn remove-category">このカテゴリを削除</button>
<hr style="margin: 20px 0;">`;

  // 個別スキル項目追加用テンプレート（動的追加用）
  window.inlineTemplates.form.skillItem = `
<div class="skill-item">
  <input type="text" value="" class="skill-name" placeholder="Java">
  <div class="level-select">
    <div class="level-option">
      <input type="radio" name="skill-{{skillId}}" value="1" checked>
      <div class="level-dot beginner"></div>
    </div>
    <div class="level-option">
      <input type="radio" name="skill-{{skillId}}" value="2">
      <div class="level-dot intermediate"></div>
    </div>
    <div class="level-option">
      <input type="radio" name="skill-{{skillId}}" value="3">
      <div class="level-dot advanced"></div>
    </div>
  </div>
  <button class="remove-btn remove-skill">削除</button>
</div>`;

  console.log('テクニカルスキルテンプレートを読み込みました');
})();
