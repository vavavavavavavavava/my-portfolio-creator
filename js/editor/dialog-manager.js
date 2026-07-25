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
        return overlay;
    }

    function createJsonDialog(initialJson) {
        const dialog = document.createElement('div');
        dialog.id = 'json-input-dialog';
        const isEditor = Config.isEditorPage();

        dialog.innerHTML = `
      <h3>${isEditor ? 'JSONを編集' : 'JSONデータを貼り付け'}</h3>
      <textarea id="json-input">${initialJson}</textarea>
      <div class="dialog-footer">
        <div class="dialog-file-actions">
          <button id="load-from-file-btn">ファイルを読み込む</button>
          ${isEditor ? '<button id="download-json-btn">JSONをダウンロード</button>' : ''}
          <input type="file" id="dialog-file-input" accept=".json">
        </div>
        <div class="dialog-buttons">
          <button id="json-input-cancel">キャンセル</button>
          <button id="json-input-load">${isEditor ? '変更を反映' : '読み込む'}</button>
        </div>
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
        dialog.querySelector('#download-json-btn')?.addEventListener('click', () => {
            JsonHandler.downloadJsonString(dialog.querySelector('#json-input').value);
        });
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
