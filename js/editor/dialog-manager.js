/**
 * js/editor/dialog-manager.js - ダイアログ管理モジュール
 */
const DialogManager = (function () {

    function showJsonDialog(initialJson = '') {
        const existingDialog = document.getElementById('json-input-dialog');
        const existingOverlay = document.getElementById('dialog-overlay');
        if (existingDialog) existingDialog.remove();
        if (existingOverlay) existingOverlay.remove();

        const overlay = createOverlay();
        const dialog = createJsonDialog(initialJson);

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        setupDialogEvents(dialog, overlay);
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'dialog-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '999'
        });
        return overlay;
    }

    function createJsonDialog(initialJson) {
        const dialog = document.createElement('div');
        dialog.id = 'json-input-dialog';
        Object.assign(dialog.style, {
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            backgroundColor: 'white', padding: '20px', borderRadius: '5px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)', zIndex: '1000', width: '80%', maxWidth: '600px'
        });

        dialog.innerHTML = `
      <h3>JSONデータを貼り付け</h3>
      <textarea id="json-input" style="width: 100%; height: 200px; margin-bottom: 10px; font-family: monospace;">${initialJson}</textarea>
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <button id="load-from-file-btn" style="padding: 8px 15px; background-color: #9b59b6; color: white; border: none; border-radius: 4px; cursor: pointer;">
          ファイルから読み込み
        </button>
        <input type="file" id="dialog-file-input" accept=".json" style="display: none;">
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button id="json-input-cancel" style="padding: 8px 15px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">キャンセル</button>
        <button id="json-input-load" style="padding: 8px 15px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">読み込む</button>
      </div>
    `;
        return dialog;
    }

    function setupDialogEvents(dialog, overlay) {
        const closeDialog = () => { dialog.remove(); overlay.remove(); };

        overlay.addEventListener('click', closeDialog);
        dialog.querySelector('#json-input-cancel').addEventListener('click', closeDialog);

        // ファイル読み込み処理
        const loadFromFileBtn = dialog.querySelector('#load-from-file-btn');
        const dialogFileInput = dialog.querySelector('#dialog-file-input');

        loadFromFileBtn.addEventListener('click', () => dialogFileInput.click());
        dialogFileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                try {
                    const jsonString = await Utils.readFileAsync(file);
                    const jsonData = Utils.parseJson(jsonString);
                    if (jsonData) {
                        dialog.querySelector('#json-input').value = JSON.stringify(jsonData, null, 2);
                        Notification.success('JSONファイルを読み込みました');
                    } else {
                        throw new Error('JSONの解析に失敗しました');
                    }
                } catch (error) {
                    Notification.error('JSONの解析に失敗しました。有効なJSONを入力してください。');
                }
            }
        });

        // JSON読み込み処理
        dialog.querySelector('#json-input-load').addEventListener('click', async () => {
            const jsonText = dialog.querySelector('#json-input').value.trim();
            if (!jsonText) {
                Notification.error('JSONデータが入力されていません');
                return;
            }

            try {
                if (Config.isPreviewPage() && typeof Renderer !== 'undefined') {
                    const data = Utils.parseJson(jsonText);
                    if (data) {
                        await Renderer.renderSlides(data);
                        Notification.success('JSONデータを読み込みました');
                    }
                } else {
                    await JsonHandler.loadFromJsonString(jsonText);
                }
                closeDialog();
            } catch (error) {
                Notification.error('JSONの処理に失敗しました: ' + error.message);
            }
        });
    }

    return { showJsonDialog };
})();

window.DialogManager = DialogManager;