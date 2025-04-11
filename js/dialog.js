// dialog.js
// JSONダイアログを表示する機能

// エディター画面かプレビュー画面かを判定する機能
const isPreviewPage = window.location.pathname.includes('preview.html');

// 通知表示関数（両画面で共通して使う）
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  let notificationEl;
  
  if (!notification) {
    // 通知要素がない場合は作成
    const newNotification = document.createElement('div');
    newNotification.id = 'notification';
    newNotification.className = 'notification';
    newNotification.style.position = 'fixed';
    newNotification.style.top = '20px';
    newNotification.style.right = '20px';
    newNotification.style.padding = '15px 20px';
    newNotification.style.color = 'white';
    newNotification.style.borderRadius = '5px';
    newNotification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    newNotification.style.opacity = '0';
    newNotification.style.transform = 'translateY(-20px)';
    newNotification.style.transition = 'opacity 0.3s, transform 0.3s';
    newNotification.style.zIndex = '1000';
    document.body.appendChild(newNotification);
    notificationEl = newNotification;
  } else {
    notificationEl = notification;
  }
  
  // タイプによってスタイルを変更
  if (type === 'error') {
    notificationEl.style.backgroundColor = '#e74c3c';
  } else {
    notificationEl.style.backgroundColor = '#2ecc71';
  }
  
  // メッセージを設定
  notificationEl.textContent = message;
  notificationEl.classList.add('show');
  
  // アニメーション
  notificationEl.style.opacity = '1';
  notificationEl.style.transform = 'translateY(0)';
  
  // 3秒後に非表示
  setTimeout(() => {
    notificationEl.style.opacity = '0';
    notificationEl.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      notificationEl.classList.remove('show');
    }, 300);
  }, 3000);
}

// エディタページの処理
if (!isPreviewPage) {
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('paste-json').addEventListener('click', function() {
      // 現在のデータをJSON文字列として取得
      const currentData = generateJSON();
      const jsonString = JSON.stringify(currentData, null, 2);
      showJsonInputDialog(jsonString);
    });
    
    // 既存のJSONファイル読み込みボタンを非表示にする
    const loadJsonBtn = document.getElementById('load-json');
    if (loadJsonBtn) {
      loadJsonBtn.parentElement.style.display = 'none';
    }
  });
}

// プレビューページ用のイベントリスナー
if (isPreviewPage) {
  document.addEventListener('DOMContentLoaded', function() {
    // JSONを貼り付けボタンのイベントリスナー
    const pasteJsonBtn = document.getElementById('paste-json-btn');
    if (pasteJsonBtn) {
      pasteJsonBtn.addEventListener('click', function() {
        // window.currentDisplayDataから現在表示されているデータを取得
        if (window.currentDisplayData) {
          const jsonString = JSON.stringify(window.currentDisplayData, null, 2);
          showJsonInputDialog(jsonString);
        } else {
          showJsonInputDialog('');
        }
      });
    }
    
    // 既存のJSONファイル読み込みボタンを非表示にする
    const loadJsonBtn = document.getElementById('load-json-btn');
    if (loadJsonBtn) {
      loadJsonBtn.style.display = 'none';
    }
    
    // JSONファイル入力要素を非表示にする（後で使います）
    const jsonFileInput = document.getElementById('json-file-input');
    if (jsonFileInput) {
      jsonFileInput.style.display = 'none';
    }
  });
}

function showJsonInputDialog(initialJson = '') {
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
  
  dialogFileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          // ファイルの内容をテキストとして読み込み、整形してテキストエリアに表示
          const jsonData = JSON.parse(e.target.result);
          const formattedJson = JSON.stringify(jsonData, null, 2);
          textarea.value = formattedJson;
          showNotification('JSONファイルを読み込みました！');
        } catch (error) {
          console.error('JSON parse error:', error);
          showNotification('JSONの解析に失敗しました。有効なJSONを入力してください。', 'error');
        }
      };
      reader.readAsText(file);
    }
  });
  
  overlay.addEventListener('click', closeDialog);
  document.getElementById('json-input-cancel').addEventListener('click', closeDialog);
  
  document.getElementById('json-input-load').addEventListener('click', function() {
    const jsonText = textarea.value.trim();
    if (!jsonText) {
      showNotification('JSONデータが入力されていません。', 'error');
      return;
    }
    try {
      const data = JSON.parse(jsonText);
      
      // エディタページかプレビューページかで処理を分ける
      if (isPreviewPage) {
        // プレビューページではrenderSlidesを呼び出す
        renderSlides(data);
        showNotification('入力されたJSONデータを読み込みました！');
      } else {
        // エディタページではloadDataIntoFormを呼び出す
        const result = loadDataIntoForm(data);
        if (result) {
          showNotification('入力されたJSONデータを読み込みました！');
        }
      }
      
      closeDialog();
    } catch (error) {
      console.error('JSON parse error:', error);
      showNotification('JSONの解析に失敗しました。有効なJSONを入力してください。', 'error');
    }
  });
  
  document.addEventListener('keydown', function escListener(e) {
    if (e.key === 'Escape') {
      closeDialog();
      document.removeEventListener('keydown', escListener);
    }
  });
}

function closeDialog() {
  const dialog = document.getElementById('json-input-dialog');
  const overlay = document.getElementById('dialog-overlay');
  if (dialog) dialog.remove();
  if (overlay) overlay.remove();
}

// スタイルの追加
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
  
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background-color: #2ecc71;
    color: white;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.3s, transform 0.3s;
    z-index: 1000;
  }
  
  .notification.show {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);