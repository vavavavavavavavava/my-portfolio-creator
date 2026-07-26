/**
 * js/editor/ui-controller.js - UIイベント処理（簡潔化版）
 */
const UiController = (function () {

  function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        const newContent = document.getElementById(`${tabId}-section`);
        if (!newContent || tab.classList.contains('active')) return;

        // タブ切り替え
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        newContent.classList.add('active');
      });
    });
  }

  function setupEditorEventListeners() {
    const eventMap = {
      'add-career': () => FormManager.createCareerItem(),
      'add-project': () => FormManager.createProjectItem(),
      'add-category': () => FormManager.createSkillCategory(),
      'add-strength': () => FormManager.createStrengthItem(),
      'add-focus': () => FormManager.addDynamicItem(document.getElementById('future-focus-items'), '', 'focus-item'),
      'add-certification': () => FormManager.addDynamicItem(document.getElementById('certification-items'), '', 'cert-item'),
      'edit-json': () => {
        const data = JsonHandler.generateJSON();
        const jsonString = data ? JSON.stringify(data, null, 2) : '';
        DialogManager.showJsonDialog(jsonString);
      },
      'copy-ai-prompt': () => PromptHandler.copy(),
      'preview-page': () => {
        if (JsonHandler.saveToSessionStorage()) {
          window.location.href = `preview.html?source=editor&v=${Config.APP_VERSION}`;
        } else {
          Notification.error('プレビューの準備に失敗しました');
        }
      }
    };

    // 統一イベント処理
    Object.entries(eventMap).forEach(([id, handler]) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('click', async () => {
          const result = await handler();
          if (result && typeof result.then !== 'function') {
            const containerId = {
              'add-career': 'career-items',
              'add-project': 'project-list',
              'add-category': 'skill-categories',
              'add-strength': 'strengths-items'
            }[id];
            if (containerId) document.getElementById(containerId)?.appendChild(result);
          }
        });
      }
    });
  }

  function setupPreviewEventListeners() {
    const returnToEditorBtn = document.getElementById('return-to-editor-btn');
    const savePdfBtn = document.getElementById('save-pdf-btn');

    if (returnToEditorBtn) {
      returnToEditorBtn.addEventListener('click', () => {
        const cameFromEditor = new URLSearchParams(window.location.search).get('source') === 'editor';
        if (cameFromEditor && window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = 'editor.html';
        }
      });
    }

    if (savePdfBtn && typeof Renderer !== 'undefined') {
      savePdfBtn.addEventListener('click', Renderer.saveToPDF);
    }
  }

  function init() {
    initTabs();

    if (Config.isEditorPage()) {
      FormManager.init();
      setupEditorEventListeners();
    } else if (Config.isPreviewPage()) {
      setupPreviewEventListeners();
    }
  }

  return { init };
})();

window.UiController = UiController;
