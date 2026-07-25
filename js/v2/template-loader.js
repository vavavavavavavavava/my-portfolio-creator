/**
 * js/v2/template-loader.js
 * 外部HTMLテンプレートを読み込み、DOMとして複製するローダー。
 */
(function () {
  'use strict';

  const templates = new Map();

  async function loadAll(definitions) {
    const grouped = new Map();
    Object.entries(definitions).forEach(([name, definition]) => {
      const url = definition.url;
      if (!grouped.has(url)) grouped.set(url, []);
      grouped.get(url).push({ name, id: definition.id });
    });

    await Promise.all(Array.from(grouped.entries()).map(async ([url, entries]) => {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`テンプレートを読み込めませんでした: ${url}`);

      const html = await response.text();
      const documentFragment = new DOMParser().parseFromString(html, 'text/html');
      entries.forEach(({ name, id }) => {
        const template = documentFragment.getElementById(id);
        if (!(template instanceof HTMLTemplateElement)) {
          throw new Error(`HTMLテンプレートが見つかりません: ${id}`);
        }
        templates.set(name, template);
      });
    }));
  }

  function clone(name) {
    const template = templates.get(name);
    if (!template) throw new Error(`未読込のテンプレートです: ${name}`);

    const element = template.content.firstElementChild;
    if (!element) throw new Error(`テンプレートにルート要素がありません: ${name}`);
    return element.cloneNode(true);
  }

  window.TemplateLoader = { loadAll, clone };
})();
