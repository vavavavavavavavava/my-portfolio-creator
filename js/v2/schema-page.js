/**
 * js/v2/schema-page.js
 * Markdown版スキーマガイドの描画と全文コピーを提供する。
 */
(function () {
  'use strict';

  let guideText = '';

  function appendInlineMarkdown(element, text) {
    const parts = text.split(/(`[^`]+`)/g);
    parts.forEach(part => {
      if (part.startsWith('`') && part.endsWith('`')) {
        const code = document.createElement('code');
        code.textContent = part.slice(1, -1);
        element.appendChild(code);
      } else {
        element.appendChild(document.createTextNode(part));
      }
    });
  }

  function renderMarkdown(markdown) {
    const container = document.getElementById('schema-guide');
    const fragment = document.createDocumentFragment();
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    let list = null;
    let paragraph = [];
    let codeLines = [];
    let inCodeBlock = false;

    function flushParagraph() {
      if (!paragraph.length) return;
      const element = document.createElement('p');
      appendInlineMarkdown(element, paragraph.join(' '));
      fragment.appendChild(element);
      paragraph = [];
    }

    function flushList() {
      if (!list) return;
      fragment.appendChild(list);
      list = null;
    }

    lines.forEach(line => {
      if (line.startsWith('```')) {
        flushParagraph();
        flushList();
        if (inCodeBlock) {
          const pre = document.createElement('pre');
          const code = document.createElement('code');
          code.textContent = codeLines.join('\n');
          pre.appendChild(code);
          fragment.appendChild(pre);
          codeLines = [];
        }
        inCodeBlock = !inCodeBlock;
        return;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        flushList();
        const level = Math.min(heading[1].length + 1, 4);
        const element = document.createElement(`h${level}`);
        appendInlineMarkdown(element, heading[2]);
        fragment.appendChild(element);
        return;
      }

      const item = line.match(/^-\s+(.+)$/);
      if (item) {
        flushParagraph();
        if (!list) list = document.createElement('ul');
        const element = document.createElement('li');
        appendInlineMarkdown(element, item[1]);
        list.appendChild(element);
        return;
      }

      if (!line.trim()) {
        flushParagraph();
        flushList();
        return;
      }

      paragraph.push(line.trim());
    });

    flushParagraph();
    flushList();
    container.replaceChildren(fragment);
    container.setAttribute('aria-busy', 'false');
  }

  function showNotification(message, isError = false) {
    const element = document.getElementById('notification');
    element.textContent = message;
    element.classList.toggle('is-error', isError);
    element.classList.add('is-visible');
    window.setTimeout(() => element.classList.remove('is-visible'), 2600);
  }

  async function initialize() {
    try {
      const response = await fetch('docs/schema-v2.md', { cache: 'no-cache' });
      if (!response.ok) throw new Error('スキーマ説明を読み込めませんでした。');
      guideText = await response.text();
      renderMarkdown(guideText);
      document.getElementById('copy-schema-guide').addEventListener('click', async () => {
        await navigator.clipboard.writeText(guideText);
        showNotification('スキーマ説明全文をコピーしました。');
      });
    } catch (error) {
      document.getElementById('schema-guide').textContent = error.message;
      document.getElementById('schema-guide').setAttribute('aria-busy', 'false');
      showNotification(error.message, true);
    }
  }

  document.addEventListener('DOMContentLoaded', initialize);
})();
