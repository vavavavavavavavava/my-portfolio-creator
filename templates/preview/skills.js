/**
 * templates/preview/skills.js
 * プレビュー用テクニカルスキルテンプレート
 */
(function() {
  // テンプレートマネージャーのチェック
  if (typeof TemplateManager === 'undefined') {
    console.error('TemplateManager が見つかりません。skills.js の読み込みに失敗しました。');
    return;
  }
  
  // テクニカルスキルスライド用テンプレート
  TemplateManager.registerTemplate('skills', `<!-- テクニカルスキルスライドテンプレート -->
<div class="slide">
    <div class="title-header">
        テクニカルスキル
        {{#if totalPages}}
        {{#if (gt totalPages 1)}}
        <span class="page-indicator">{{pageNumber}}/{{totalPages}}</span>
        {{/if}}
        {{/if}}
    </div>
    
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
</div>`, 'preview');

  if (Config.DEBUG_MODE) {
    console.log('プレビュー用テクニカルスキルテンプレートを登録しました');
  }
})();
