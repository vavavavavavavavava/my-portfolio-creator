/**
 * js/v2/template-loader.js
 * HTMLの<template>を読み込み、DOMとして複製するローダー。
 */
(function () {
  'use strict';

  const templates = new Map();

  function register(name, id, sourceDocument) {
    const template = sourceDocument.getElementById(id);
    if (!(template instanceof HTMLTemplateElement)) {
      throw new Error(`HTMLテンプレートが見つかりません: ${id}`);
    }
    templates.set(name, template);
  }

  async function loadAll(definitions) {
    const grouped = new Map();

    Object.entries(definitions).forEach(([name, definition]) => {
      if (!definition.url) {
        register(name, definition.id, document);
        return;
      }
      if (!grouped.has(definition.url)) grouped.set(definition.url, []);
      grouped.get(definition.url).push({ name, id: definition.id });
    });

    await Promise.all(Array.from(grouped.entries()).map(async ([url, entries]) => {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`テンプレートを読み込めませんでした: ${url}`);

      const html = await response.text();
      const sourceDocument = new DOMParser().parseFromString(html, 'text/html');
      entries.forEach(({ name, id }) => register(name, id, sourceDocument));
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
