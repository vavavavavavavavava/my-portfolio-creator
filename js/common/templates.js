/**
 * js/common/templates.js
 * テンプレート管理システム
 */
const TemplateManager = (function() {
  // テンプレートを格納するオブジェクト
  const templates = {
    editor: {},
    preview: {}
  };
  
  // テンプレートが読み込み済みかどうか
  let templatesLoaded = false;
  
  /**
   * テンプレートファイルからテンプレートを読み込む
   * @param {string} templatePath - テンプレートファイルのパス
   * @return {Promise} - テンプレート読み込み完了時に解決されるPromise
   */
  async function loadTemplate(templatePath) {
    try {
      // ファイルパスからカテゴリ（editor/preview）を取得
      const category = templatePath.includes('/editor/') ? 'editor' : 'preview';
      
      // ファイル名からテンプレート名を取得（拡張子なし）
      const templateName = templatePath.split('/').pop().replace('.js', '');
      
      // スクリプトを読み込む
      await Utils.loadScript(templatePath);
      
      if (Config.DEBUG_MODE) {
        console.log(`テンプレート "${templateName}" をカテゴリ "${category}" に読み込みました`);
      }
      
      return { success: true, path: templatePath };
    } catch (error) {
      console.error(`テンプレート "${templatePath}" の読み込みに失敗しました:`, error);
      return { success: false, path: templatePath, error };
    }
  }
  
  /**
   * すべてのテンプレートファイルを読み込む
   * @return {Promise} すべてのテンプレート読み込み完了時に解決されるPromise
   */
  async function loadAllTemplates() {
    if (templatesLoaded) {
      return { success: true, message: 'テンプレートはすでに読み込まれています' };
    }
    
    try {
      const results = await Promise.all(Config.TEMPLATE_FILES.map(loadTemplate));
      
      // すべてのテンプレートが正常に読み込まれたかチェック
      const failed = results.filter(result => !result.success);
      
      if (failed.length > 0) {
        const failedPaths = failed.map(result => result.path).join(', ');
        throw new Error(`一部のテンプレートの読み込みに失敗しました: ${failedPaths}`);
      }
      
      templatesLoaded = true;
      return { success: true, message: 'すべてのテンプレートを読み込みました' };
    } catch (error) {
      console.error('テンプレートの読み込みに失敗しました:', error);
      return { success: false, error };
    }
  }
  
  /**
   * 特定の名前とカテゴリのテンプレートを取得
   * @param {string} name - テンプレート名
   * @param {string} category - カテゴリ（editor/preview）
   * @return {string|null} テンプレート文字列またはnull
   */
  function getTemplate(name, category = 'editor') {
    if (!templates[category] || !templates[category][name]) {
      console.error(`テンプレート "${name}" (${category}) が見つかりません`);
      return null;
    }
    
    return templates[category][name];
  }
  
  /**
   * テンプレートを登録（内部およびテンプレートファイルから呼び出される）
   * @param {string} name - テンプレート名
   * @param {string} html - テンプレートHTML
   * @param {string} category - カテゴリ（editor/preview）
   */
  function registerTemplate(name, html, category = 'editor') {
    if (!templates[category]) {
      templates[category] = {};
    }
    
    templates[category][name] = html;
    
    if (Config.DEBUG_MODE) {
      console.log(`テンプレート "${name}" をカテゴリ "${category}" に登録しました`);
    }
  }
  
  /**
   * テンプレートを渡されたデータでレンダリング
   * @param {string} name - テンプレート名
   * @param {Object} data - レンダリングに使用するデータ
   * @param {string} category - カテゴリ（editor/preview）
   * @return {string} レンダリングされたHTML
   */
  function renderTemplate(name, data = {}, category = 'editor') {
    const templateStr = getTemplate(name, category);
    
    if (!templateStr) {
      return '';
    }
    
    try {
      // テンプレートをHandlebarsでコンパイルしてレンダリング
      const template = Handlebars.compile(templateStr);
      return template(data);
    } catch (error) {
      console.error(`テンプレート "${name}" のレンダリングに失敗しました:`, error);
      return '';
    }
  }
  
  /**
   * テンプレートDOMオブジェクトを生成
   * @param {string} name - テンプレート名
   * @param {Object} data - レンダリングに使用するデータ
   * @param {string} category - カテゴリ（editor/preview）
   * @return {HTMLElement|null} 生成されたDOM要素またはnull
   */
  function createTemplateElement(name, data = {}, category = 'editor') {
    const html = renderTemplate(name, data, category);
    
    if (!html) {
      return null;
    }
    
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = html.trim();
    
    // 最初の子要素を返す
    return tempContainer.firstChild;
  }
  
  // Handlebarsヘルパーの登録
  function registerHandlebarsHelpers() {
    // スキルレベルドットを生成するヘルパー
    Handlebars.registerHelper('skillDots', function(level) {
      let output = '';
      for (let i = 0; i < level; i++) {
        let cls = '';
        if (i === 0) {
          cls = 'beginner';
        } else if (i === 1) {
          cls = 'intermediate';
        } else if (i === 2) {
          cls = 'advanced';
        } else {
          cls = 'filled';
        }
        output += `<div class="level-dot ${cls}"></div>`;
      }
      return new Handlebars.SafeString(output);
    });
    
    // インクリメントヘルパー
    Handlebars.registerHelper('inc', function(value) {
      return parseInt(value) + 1;
    });
    
    // 凡例クラスヘルパー
    Handlebars.registerHelper('legendClass', function(index) {
      if (index === 0) return "beginner";
      else if (index === 1) return "intermediate";
      else if (index === 2) return "advanced";
      else return "";
    });
    
    // 等価比較ヘルパー
    Handlebars.registerHelper('eq', function(a, b) {
      return a === b;
    });
    
    // 文字列前方一致チェックヘルパー
    Handlebars.registerHelper('startsWith', function(str, prefix) {
      return str && str.toString().startsWith(prefix);
    });
  }
  
  // 初期化
  function init() {
    registerHandlebarsHelpers();
  }
  
  // 公開API
  return {
    init,
    loadTemplate,
    loadAllTemplates,
    getTemplate,
    registerTemplate,
    renderTemplate,
    createTemplateElement,
    templates
  };
})();

// 初期化
TemplateManager.init();

// グローバルへのエクスポート
window.TemplateManager = TemplateManager;
