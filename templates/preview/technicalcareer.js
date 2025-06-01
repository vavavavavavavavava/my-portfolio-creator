/**
 * templates/preview/technicalcareer.js
 * プレビュー用テクニカルキャリアテンプレート
 */
(function () {
  if (typeof TemplateManager === 'undefined') return;

  TemplateManager.registerTemplate(
    'technicalcareer',
    function (context) {
      const data = Array.isArray(context) ? context[0] : context;
      const mode = data.layoutMode || 'detail';
      const tpl = TemplateManager.getTemplate(`technicalcareer_${mode}`, 'preview');
      // tpl は文字列かもしれないので常に compile
      return Handlebars.compile(tpl)(data);
    },
    'preview'
  );
})();
