/**
 * js/v2/schema-page.js
 * Markdown版スキーマガイドの表示と全文コピーを提供する。
 */
(function () {
  'use strict';

  let guideText = '';

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
      document.getElementById('schema-guide').textContent = guideText;
      document.getElementById('copy-schema-guide').addEventListener('click', async () => {
        await navigator.clipboard.writeText(guideText);
        showNotification('スキーマ説明全文をコピーしました。');
      });
    } catch (error) {
      document.getElementById('schema-guide').textContent = error.message;
      showNotification(error.message, true);
    }
  }

  document.addEventListener('DOMContentLoaded', initialize);
})();
