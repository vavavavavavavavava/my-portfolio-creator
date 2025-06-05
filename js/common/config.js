/**
 * js/common/config.js - アプリケーション設定
 */
const Config = (function () {
  const debugFromEnv =
    window.env && typeof window.env.DEBUG_MODE !== 'undefined'
      ? window.env.DEBUG_MODE.toLowerCase() === 'true'
      : false;
  return {
    APP_VERSION: '1.0.0',
    DEBUG_MODE: debugFromEnv,
    STORAGE_KEYS: {
      PREVIEW_DATA: 'portfolio_preview_data',
      EDITOR_STATE: 'portfolio_editor_state'
    },
    TEMPLATE_FILES: [
      'templates/editor/common.js', 'templates/editor/title.js',
      'templates/editor/career.js', 'templates/editor/skills.js',
      'templates/editor/strengths.js', 'templates/editor/technicalcareer.js',
      'templates/preview/title.js', 'templates/preview/career.js',
      'templates/preview/skills.js', 'templates/preview/strengths.js',
      'templates/preview/technicalcareer.js'
    ],
    isEditorPage: () => window.location.pathname.includes('editor.html'),
    isPreviewPage: () => window.location.pathname.includes('preview.html')
  };
})();

window.Config = Config;
