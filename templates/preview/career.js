/**
 * templates/preview/career.js
 * プレビュー用キャリア年表テンプレート
 */
(function() {
  // テンプレートマネージャーのチェック
  if (typeof TemplateManager === 'undefined') {
    console.error('TemplateManager が見つかりません。career.js の読み込みに失敗しました。');
    return;
  }
  
  // キャリア年表スライド用テンプレート
  TemplateManager.registerTemplate('career', `<!-- キャリア年表スライドテンプレート（日付カード版） -->
<div class="slide">
    <div class="title-header">
        キャリア年表
        {{#if totalPages}}
        {{#if (gt totalPages 1)}}
        <span class="page-indicator">{{pageNumber}}/{{totalPages}}</span>
        {{/if}}
        {{/if}}
    </div>
    
    <div class="timeline-container">
        <div class="timeline-line"></div>
        <div class="timeline-entries">
            {{#each careerHistory}}
            <div class="timeline-entry">
                <div class="timeline-date">
                    <div class="date-period">{{period.from}}〜<br>{{period.to}}</div>
                </div>
                <div class="timeline-content">
                    <div class="timeline-role">{{role}}</div>
                    <div class="timeline-company">{{company}}</div>
                    <div class="timeline-description">
                        {{description}}
                    </div>
                    {{#if projects.length}}
                    <div class="timeline-highlights">
                        {{#each projects}}
                        <div class="timeline-highlight">
                            <span class="highlight-title">プロジェクト：</span> {{this}}
                        </div>
                        {{/each}}
                    </div>
                    {{/if}}
                </div>
            </div>
            {{/each}}
        </div>
    </div>
</div>`, 'preview');

  if (Config.DEBUG_MODE) {
    console.log('プレビュー用キャリア年表テンプレートを登録しました');
  }
})();
