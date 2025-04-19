/**
 * js/editor/ui-controller.js
 * UIイベント処理を担当するモジュール
 */
const UiController = (function() {
  /**
   * タブ切り替え機能の初期化
   */
  function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        // アクティブなタブの切り替え
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // 対応するコンテンツの切り替え
        const tabId = tab.getAttribute('data-tab');
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        document.getElementById(`${tabId}-section`).classList.add('active');
      });
    });
  }
  
  /**
   * JSONダイアログを表示
   * @param {string} initialJson - 初期表示するJSON文字列
   */
  function showJsonDialog(initialJson = '') {
    // 既存のダイアログやオーバーレイがあれば削除
    const existingDialog = document.getElementById('json-input-dialog');
    const existingOverlay = document.getElementById('dialog-overlay');
    if (existingDialog) existingDialog.remove();
    if (existingOverlay) existingOverlay.remove();
    
    // オーバーレイの作成
    const overlay = document.createElement('div');
    overlay.id = 'dialog-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '999';
    document.body.appendChild(overlay);
    
    // ダイアログの作成
    const dialog = document.createElement('div');
    dialog.id = 'json-input-dialog';
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.backgroundColor = 'white';
    dialog.style.padding = '20px';
    dialog.style.borderRadius = '5px';
    dialog.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    dialog.style.zIndex = '1000';
    dialog.style.width = '80%';
    dialog.style.maxWidth = '600px';
    
    dialog.innerHTML = `
      <h3>JSONデータを貼り付け</h3>
      <p>以下にJSONデータを貼り付けてください。</p>
      <textarea id="json-input" style="width: 100%; height: 200px; margin-bottom: 10px; font-family: monospace;"></textarea>
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <button id="load-from-file-btn" style="padding: 8px 15px; background-color: #9b59b6; color: white; border: none; border-radius: 4px; cursor: pointer;">
          ファイルから読み込み
        </button>
        <input type="file" id="dialog-file-input" accept=".json" style="display: none;">
        <div></div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button id="json-input-cancel" style="padding: 8px 15px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">キャンセル</button>
        <button id="json-input-load" style="padding: 8px 15px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">読み込む</button>
      </div>
    `;
    document.body.appendChild(dialog);
    
    const textarea = document.getElementById('json-input');
    textarea.value = initialJson;
    textarea.focus();
    if (initialJson) {
      textarea.select();
    }
    
    // ファイル読み込みボタン用のイベントリスナー
    const loadFromFileBtn = document.getElementById('load-from-file-btn');
    const dialogFileInput = document.getElementById('dialog-file-input');
    
    loadFromFileBtn.addEventListener('click', function() {
      dialogFileInput.click();
    });
    
    dialogFileInput.addEventListener('change', async function(event) {
      const file = event.target.files[0];
      if (file) {
        try {
          // ファイルの内容をテキストとして読み込み
          const jsonString = await Utils.readFileAsync(file);
          
          // JSONとして解析してフォーマット
          const jsonData = Utils.parseJson(jsonString);
          if (jsonData) {
            const formattedJson = JSON.stringify(jsonData, null, 2);
            textarea.value = formattedJson;
            Notification.success('JSONファイルを読み込みました');
          } else {
            throw new Error('JSONの解析に失敗しました');
          }
        } catch (error) {
          console.error('JSON解析エラー:', error);
          Notification.error('JSONの解析に失敗しました。有効なJSONを入力してください。');
        }
      }
    });
    
    // ダイアログを閉じる関数
    function closeDialog() {
      dialog.remove();
      overlay.remove();
    }
    
    overlay.addEventListener('click', closeDialog);
    document.getElementById('json-input-cancel').addEventListener('click', closeDialog);
    
    document.getElementById('json-input-load').addEventListener('click', async function() {
      const jsonText = textarea.value.trim();
      if (!jsonText) {
        Notification.error('JSONデータが入力されていません');
        return;
      }
      
      try {
        // エディタページかプレビューページかで処理を分ける
        if (Config.isPreviewPage()) {
          // プレビューページでは表示用の関数を呼び出す
          const data = Utils.parseJson(jsonText);
          if (!data) {
            throw new Error('JSONの解析に失敗しました');
          }
          
          // キャスト
          if (typeof Renderer !== 'undefined' && typeof Renderer.renderSlides === 'function') {
            await Renderer.renderSlides(data);
            Notification.success('JSONデータを読み込みました');
          }
        } else {
          // エディタページではフォームに読み込む
          await JsonHandler.loadFromJsonString(jsonText);
        }
        
        closeDialog();
      } catch (error) {
        console.error('JSON処理エラー:', error);
        Notification.error('JSONの処理に失敗しました: ' + error.message);
      }
    });
    
    // Escキーでダイアログを閉じる
    document.addEventListener('keydown', function escListener(e) {
      if (e.key === 'Escape') {
        closeDialog();
        document.removeEventListener('keydown', escListener);
      }
    });
  }
  
  /**
   * エディタページのイベントリスナーを設定
   */
  function setupEditorEventListeners() {
    // 職歴、プロジェクト、スキルカテゴリ、強み、注力分野、資格追加ボタンのイベント設定
    document.getElementById('add-career').addEventListener('click', async function() {
      const careerItem = await FormManager.createCareerItem();
      document.getElementById('career-items').appendChild(careerItem);
    });
    
    document.getElementById('add-project').addEventListener('click', async function() {
      const projectItem = await FormManager.createProjectItem();
      document.getElementById('project-list').appendChild(projectItem);
    });
    
    document.getElementById('add-category').addEventListener('click', async function() {
      const categoryItem = await FormManager.createSkillCategory();
      document.getElementById('skill-categories').appendChild(categoryItem);
    });
    
    document.getElementById('add-strength').addEventListener('click', async function() {
      const strengthItem = await FormManager.createStrengthItem();
      document.getElementById('strengths-items').appendChild(strengthItem);
    });
    
    document.getElementById('add-focus').addEventListener('click', async function() {
      await FormManager.addDynamicItem(document.getElementById('future-focus-items'), '', 'focus-item');
    });
    
    document.getElementById('add-certification').addEventListener('click', async function() {
      await FormManager.addDynamicItem(document.getElementById('certification-items'), '', 'cert-item');
    });
    
    // JSONの保存処理
    document.getElementById('save-json').addEventListener('click', function() {
      JsonHandler.saveToFile();
    });
    
    // JSONプレビューの処理
    document.getElementById('preview-json').addEventListener('click', function() {
      JsonHandler.toggleJsonPreview();
    });
    
    // JSONファイル読み込みの処理
    const loadJsonInput = document.getElementById('load-json');
    if (loadJsonInput) {
      loadJsonInput.addEventListener('change', async function(event) {
        const file = event.target.files[0];
        if (file) {
          await JsonHandler.loadFromFile(file);
          // ファイル入力をリセット
          event.target.value = '';
        }
      });
    }
    
    // JSONを貼り付けるダイアログを表示
    document.getElementById('paste-json').addEventListener('click', function() {
      // 現在のデータをJSON文字列として取得
      const data = JsonHandler.generateJSON();
      if (data) {
        const jsonString = JSON.stringify(data, null, 2);
        showJsonDialog(jsonString);
      } else {
        showJsonDialog('');
      }
    });
    
    // プレビューボタンのイベントリスナー
    document.getElementById('preview-page').addEventListener('click', function() {
      // セッションストレージにデータを保存
      if (JsonHandler.saveToSessionStorage()) {
        // 新しいタブでpreview.htmlを開く
        window.open('preview.html?source=editor', '_blank');
        Notification.success('プレビューページを開きました');
      } else {
        Notification.error('プレビューの準備に失敗しました');
      }
    });
  }
  
  /**
   * プレビューページのイベントリスナーを設定
   */
  function setupPreviewEventListeners() {
    // JSONを貼り付けボタンのイベントリスナー
    const pasteJsonBtn = document.getElementById('paste-json-btn');
    if (pasteJsonBtn) {
      pasteJsonBtn.addEventListener('click', function() {
        // 現在表示されているデータ
        let currentJsonString = '';
        if (typeof window.currentDisplayData !== 'undefined') {
          currentJsonString = JSON.stringify(window.currentDisplayData, null, 2);
        }
        
        showJsonDialog(currentJsonString);
      });
    }
    
    // PDF保存ボタンのイベントリスナー
    const savePdfBtn = document.getElementById('save-pdf-btn');
    if (savePdfBtn && typeof Renderer !== 'undefined' && typeof Renderer.saveToPDF === 'function') {
      savePdfBtn.addEventListener('click', Renderer.saveToPDF);
    }
  }
  
  /**
   * ダイアログスタイルを追加
   */
  function addDialogStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      #json-input-dialog {
        animation: fadeIn 0.3s;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -60%); }
        to { opacity: 1; transform: translate(-50%, -50%); }
      }
      
      #json-input-cancel:hover {
        background-color: #c0392b;
      }
      
      #json-input-load:hover {
        background-color: #2980b9;
      }
      
      #load-from-file-btn:hover {
        background-color: #8e44ad;
      }
      
      #json-input {
        resize: vertical;
        border: 1px solid #ddd;
        padding: 8px;
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * UIコントローラーの初期化
   */
  function init() {
    // 共通の初期化処理
    addDialogStyles();
    initTabs();
    
    // ページに応じたイベントリスナーの設定
    if (Config.isEditorPage()) {
      setupEditorEventListeners();
    } else if (Config.isPreviewPage()) {
      setupPreviewEventListeners();
    }
  }
  
  // 公開API
  return {
    init,
    initTabs,
    showJsonDialog,
    setupEditorEventListeners,
    setupPreviewEventListeners
  };
})();

// グローバルへのエクスポート
window.UiController = UiController;
