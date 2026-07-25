/**
 * js/v2/json-editor.js
 * JSONの直接貼り付け・編集・読込と、サンプルJSONの安全なコピーを提供する。
 */
(function () {
  'use strict';

  const NOTICE_KEY = 'mpc.jsonEditor.notice';
  const SAMPLE_JSON_PATH = 'examples/sample-portfolio.json';

  function showNotification(message, isError = false) {
    const element = document.getElementById('notification');
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('is-error', isError);
    element.classList.add('is-visible');
    window.setTimeout(() => element.classList.remove('is-visible'), 2600);
  }

  function setError(message = '') {
    const element = document.getElementById('json-editor-error');
    if (!element) return;
    element.textContent = message;
    element.hidden = !message;
  }

  function prettyJson(value) {
    return JSON.stringify(value, null, 2);
  }

  function parseJson(text) {
    const value = JSON.parse(text);
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('JSONのルートはオブジェクトにしてください。');
    }
    return value;
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const succeeded = document.execCommand('copy');
    textarea.remove();
    if (!succeeded) throw new Error('クリップボードへコピーできませんでした。');
  }

  function wait(milliseconds) {
    return new Promise(resolve => window.setTimeout(resolve, milliseconds));
  }

  async function openJsonEditor() {
    const dialog = document.getElementById('json-editor-dialog');
    const textarea = document.getElementById('json-editor-textarea');
    const form = document.getElementById('portfolio-form');

    if (!dialog || !textarea) {
      throw new Error('JSONエディターの画面を初期化できませんでした。');
    }

    setError();
    form?.dispatchEvent(new Event('input', { bubbles: true }));
    await wait(360);

    let data = PortfolioSchema.createEmpty();
    const saved = localStorage.getItem(PortfolioSchema.STORAGE_KEY);
    if (saved) {
      try {
        data = JSON.parse(saved);
      } catch (error) {
        console.warn('保存済みJSONを解析できませんでした。', error);
      }
    }

    textarea.value = prettyJson(PortfolioSchema.normalize(data));
    dialog.showModal();
    textarea.focus();
  }

  function closeJsonEditor() {
    document.getElementById('json-editor-dialog')?.close();
    setError();
  }

  function applyJsonEditor() {
    const textarea = document.getElementById('json-editor-textarea');
    try {
      const parsed = parseJson(textarea.value);
      const normalized = PortfolioSchema.normalize(parsed);
      localStorage.setItem(PortfolioSchema.STORAGE_KEY, prettyJson(normalized));
      sessionStorage.setItem(NOTICE_KEY, parsed.schemaVersion
        ? '貼り付けたJSONを読み込みました。'
        : '旧形式JSONをSchema v2へ変換して読み込みました。');
      closeJsonEditor();
      window.location.reload();
    } catch (error) {
      setError(`JSONを読み込めません: ${error.message}`);
      textarea.focus();
    }
  }

  async function copyEditorJson() {
    const textarea = document.getElementById('json-editor-textarea');
    try {
      const parsed = parseJson(textarea.value);
      const formatted = prettyJson(parsed);
      textarea.value = formatted;
      await copyText(formatted);
      setError();
      showNotification('表示中のJSONをコピーしました。');
    } catch (error) {
      setError(`JSONをコピーできません: ${error.message}`);
    }
  }

  async function loadFileIntoEditor(event) {
    event.stopImmediatePropagation();
    const input = event.currentTarget;
    const [file] = input.files;
    if (!file) return;

    const textarea = document.getElementById('json-editor-textarea');
    try {
      const text = await file.text();
      const parsed = parseJson(text);
      textarea.value = prettyJson(parsed);
      setError();
      textarea.focus();
      showNotification('ファイルのJSONをエディターへ読み込みました。');
    } catch (error) {
      setError(`ファイルを読み込めません: ${error.message}`);
    } finally {
      input.value = '';
    }
  }

  async function copySampleJson(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    try {
      const response = await fetch(SAMPLE_JSON_PATH, {
        cache: 'no-cache',
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      let parsed;
      try {
        parsed = parseJson(text);
      } catch (error) {
        throw new Error('JSONではない内容が返されました。HTMLのエラーページはコピーしません。');
      }

      if (contentType && !contentType.includes('json')) {
        throw new Error(`JSONではないContent-Typeが返されました: ${contentType}`);
      }

      await copyText(prettyJson(parsed));
      showNotification('サンプルJSONをコピーしました。');
    } catch (error) {
      showNotification(`サンプルJSONの取得に失敗しました: ${error.message}`, true);
    }
  }

  function initialize() {
    const dialog = document.getElementById('json-editor-dialog');
    const notice = sessionStorage.getItem(NOTICE_KEY);
    if (notice) {
      sessionStorage.removeItem(NOTICE_KEY);
      showNotification(notice);
    }

    const openButton = document.getElementById('open-json-editor');
    if (openButton) {
      openButton.textContent = 'JSONエディターを開く';
      openButton.setAttribute('aria-haspopup', 'dialog');
      openButton.setAttribute('aria-controls', 'json-editor-dialog');
      openButton.title = 'JSONの貼り付け・直接編集・ファイル読込を行います';
      openButton.addEventListener('click', () => {
        openJsonEditor().catch(error => showNotification(`JSONエディターを開けません: ${error.message}`, true));
      });
    }

    document.getElementById('close-json-editor')?.addEventListener('click', closeJsonEditor);
    document.getElementById('apply-json-editor')?.addEventListener('click', applyJsonEditor);
    document.getElementById('copy-json-editor')?.addEventListener('click', () => {
      copyEditorJson().catch(error => showNotification(error.message, true));
    });

    document.getElementById('load-json')?.addEventListener('change', event => {
      loadFileIntoEditor(event).catch(error => setError(`ファイルを読み込めません: ${error.message}`));
    }, true);

    document.getElementById('copy-sample-json')?.addEventListener('click', event => {
      copySampleJson(event).catch(error => showNotification(error.message, true));
    }, true);

    dialog?.addEventListener('click', event => {
      if (event.target === dialog) closeJsonEditor();
    });
  }

  document.addEventListener('DOMContentLoaded', initialize);
})();