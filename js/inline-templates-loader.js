// inline-templates-loader.js - インラインテンプレートを一括読み込みするスクリプト

// グローバルテンプレートオブジェクトを初期化
window.inlineTemplates = {
  slide: {},
  form: {}
};

// テンプレートスクリプトの読み込み状態を管理するための変数
window.templatesLoaded = false;

// テンプレートファイルの一覧
const templateFiles = [
  'templates-inline/common-templates.js',
  'templates-inline/title-templates.js',
  'templates-inline/career-templates.js',
  'templates-inline/skills-templates.js',
  'templates-inline/strengths-templates.js',
  'templates-inline/technicalcareer-templates.js'
];

/**
 * スクリプトを非同期に読み込む関数
 * @param {string} url - スクリプトのURL
 * @return {Promise} - スクリプト読み込み用のPromise
 */
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => resolve(url);
    script.onerror = () => {
      console.error(`スクリプトの読み込みに失敗しました: ${url}`);
      reject(new Error(`Failed to load script: ${url}`));
    };
    document.head.appendChild(script);
  });
}

/**
 * すべてのテンプレートスクリプトを読み込む関数
 * @return {Promise} - すべてのスクリプト読み込み完了時に解決されるPromise
 */
function loadAllTemplates() {
  // すでに読み込み済みの場合は即座に解決
  if (window.templatesLoaded) {
    return Promise.resolve();
  }
  
  // すべてのテンプレートファイルを読み込み
  const promises = templateFiles.map(file => loadScript(file));
  
  return Promise.all(promises)
    .then(() => {
      console.log('すべてのインラインテンプレートを読み込みました');
      window.templatesLoaded = true;
    })
    .catch(error => {
      console.error('インラインテンプレートの読み込みに失敗しました', error);
      alert('テンプレートの読み込みに失敗しました。ページを再読み込みしてください。');
    });
}

// DOMContentLoadedイベントで自動的に読み込みを開始
document.addEventListener('DOMContentLoaded', loadAllTemplates);

// 外部から呼び出せるように公開
window.loadAllTemplates = loadAllTemplates;
