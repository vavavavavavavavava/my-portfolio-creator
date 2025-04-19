/**
 * js/editor/image-uploader.js
 * 画像アップロード機能を提供するモジュール
 */
const ImageUploader = (function () {
  /**
   * 画像アップロード機能を設定
   * @param {HTMLElement} projectContainer - プロジェクトコンテナ要素
   */
  function setup(projectContainer) {
    // 各プロジェクトにユニークなIDを設定（なければ）
    if (!projectContainer.id) {
      projectContainer.id = `project-container-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    const projectId = projectContainer.id;
    const illustrationPathInput = projectContainer.querySelector('.illustration-image');

    if (!illustrationPathInput) {
      console.warn(`プロジェクト ${projectId} に '.illustration-image' 要素が見つかりません`);
      return; // 対応する要素が見つからない場合は終了
    }

    // すでに設定済みの場合は再設定しない（重複防止）
    if (projectContainer.querySelector('.illustration-preview')) {
      console.log(`プロジェクト ${projectId} は既に画像アップローダーが設定されています`);
      return;
    }

    // 各要素にユニークなIDを生成
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    const uniquePrefix = `proj-${projectId}-${timestamp}-${randomSuffix}`;

    // プレビュー画像要素の作成
    const illustrationPreview = document.createElement('div');
    illustrationPreview.className = 'illustration-preview';
    illustrationPreview.style.marginTop = '10px';
    illustrationPreview.style.textAlign = 'center';
    illustrationPreview.style.display = 'none';

    const previewImg = document.createElement('img');
    previewImg.style.maxWidth = '100%';
    previewImg.style.maxHeight = '200px';
    previewImg.style.border = '1px solid #ddd';
    previewImg.style.borderRadius = '4px';
    previewImg.style.padding = '5px';
    illustrationPreview.appendChild(previewImg);

    // コンテナの作成
    const controlsContainer = document.createElement('div');
    controlsContainer.style.marginTop = '10px';

    // タブ切り替えコンテナ
    const tabContainer = document.createElement('div');
    tabContainer.style.display = 'flex';
    tabContainer.style.marginBottom = '10px';
    tabContainer.style.borderBottom = '1px solid #ddd';

    // ファイルアップロードタブ
    const fileUploadTab = document.createElement('div');
    fileUploadTab.textContent = 'ファイルアップロード';
    fileUploadTab.className = 'image-input-tab active';
    fileUploadTab.style.padding = '8px 15px';
    fileUploadTab.style.cursor = 'pointer';
    fileUploadTab.style.backgroundColor = '#3498db';
    fileUploadTab.style.color = 'white';
    fileUploadTab.style.borderRadius = '4px 4px 0 0';
    fileUploadTab.style.marginRight = '5px';

    // URL入力タブ
    const urlInputTab = document.createElement('div');
    urlInputTab.textContent = 'URLから読み込み';
    urlInputTab.className = 'image-input-tab';
    urlInputTab.style.padding = '8px 15px';
    urlInputTab.style.cursor = 'pointer';
    urlInputTab.style.backgroundColor = '#f8f9fa';
    urlInputTab.style.borderRadius = '4px 4px 0 0';

    tabContainer.appendChild(fileUploadTab);
    tabContainer.appendChild(urlInputTab);

    // ファイル選択コンテナ
    const fileInputContainer = document.createElement('div');
    fileInputContainer.className = 'image-input-container';
    fileInputContainer.style.marginTop = '10px';
    fileInputContainer.style.display = 'flex';
    fileInputContainer.style.alignItems = 'center';
    fileInputContainer.style.gap = '10px';

    const fileInputId = `illustration-file-${uniquePrefix}`;
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = fileInputId;
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    const fileInputLabel = document.createElement('label');
    fileInputLabel.htmlFor = fileInputId;
    fileInputLabel.className = 'file-input-label';
    fileInputLabel.textContent = '画像ファイルを選択';
    fileInputLabel.style.display = 'inline-block';
    fileInputLabel.style.padding = '8px 15px';
    fileInputLabel.style.backgroundColor = '#9b59b6';
    fileInputLabel.style.color = 'white';
    fileInputLabel.style.borderRadius = '4px';
    fileInputLabel.style.cursor = 'pointer';
    fileInputLabel.style.fontSize = '14px';

    // URL入力コンテナ
    const urlInputContainer = document.createElement('div');
    urlInputContainer.className = 'image-input-container';
    urlInputContainer.style.marginTop = '10px';
    urlInputContainer.style.display = 'none'; // 初期状態では非表示

    const urlInputId = `illustration-url-${uniquePrefix}`;
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.id = urlInputId;
    urlInput.placeholder = 'https://example.com/image.jpg';
    urlInput.className = 'url-input';
    urlInput.style.width = '70%';
    urlInput.style.padding = '8px';
    urlInput.style.border = '1px solid #ddd';
    urlInput.style.borderRadius = '4px';
    urlInput.style.marginRight = '10px';

    const loadUrlButton = document.createElement('button');
    loadUrlButton.textContent = '読み込む';
    loadUrlButton.className = 'load-url-btn';
    loadUrlButton.style.padding = '8px 15px';
    loadUrlButton.style.backgroundColor = '#9b59b6';
    loadUrlButton.style.color = 'white';
    loadUrlButton.style.border = 'none';
    loadUrlButton.style.borderRadius = '4px';
    loadUrlButton.style.cursor = 'pointer';
    loadUrlButton.style.fontSize = '14px';

    urlInputContainer.appendChild(urlInput);
    urlInputContainer.appendChild(loadUrlButton);

    // クリアボタンのテンプレート作成
    function createClearButton() {
      const clearButton = document.createElement('button');
      clearButton.type = 'button';
      clearButton.className = 'clear-image-btn';
      clearButton.textContent = '画像をクリア';
      clearButton.style.padding = '8px 15px';
      clearButton.style.backgroundColor = '#e74c3c';
      clearButton.style.color = 'white';
      clearButton.style.border = 'none';
      clearButton.style.borderRadius = '4px';
      clearButton.style.cursor = 'pointer';
      clearButton.style.fontSize = '14px';
      clearButton.style.display = 'none';
      return clearButton;
    }

    // ファイルモード用クリアボタン
    const fileClearButton = createClearButton();
    fileInputContainer.appendChild(fileInput);
    fileInputContainer.appendChild(fileInputLabel);
    fileInputContainer.appendChild(fileClearButton);

    // URLモード用クリアボタン
    const urlClearButton = createClearButton();
    urlInputContainer.appendChild(urlClearButton);

    // コンテナに要素を追加
    controlsContainer.appendChild(tabContainer);
    controlsContainer.appendChild(fileInputContainer);
    controlsContainer.appendChild(urlInputContainer);

    // スタイル注釈の追加
    const noteTextFile = document.createElement('p');
    noteTextFile.className = 'uploader-note file-note';
    noteTextFile.style.fontSize = '12px';
    noteTextFile.style.color = '#7f8c8d';
    noteTextFile.style.marginTop = '5px';
    noteTextFile.innerHTML = '* 画像はBase64形式でJSONに埋め込まれます。PNG/JPG推奨。<br>* 大きなファイルはJSONサイズが膨大になるため、1MB以下を推奨します。';

    const noteTextUrl = document.createElement('p');
    noteTextUrl.className = 'uploader-note url-note';
    noteTextUrl.style.fontSize = '12px';
    noteTextUrl.style.color = '#7f8c8d';
    noteTextUrl.style.marginTop = '5px';
    noteTextUrl.style.display = 'none';
    noteTextUrl.innerHTML = '* 有効な画像URLを入力してください。<br>* 外部URLの場合、インターネット接続時のみ表示されます。';

    // 既存の入力欄を隠す
    illustrationPathInput.style.display = 'none';

    // 既存の入力欄の親要素に、これらの新しい要素を追加
    const parentElement = illustrationPathInput.parentElement;
    parentElement.appendChild(controlsContainer);
    parentElement.appendChild(illustrationPreview);
    parentElement.appendChild(noteTextFile);
    parentElement.appendChild(noteTextUrl);

    // この特定のプロジェクトに対するタブ切り替え関数
    function showTab(tabType) {
      // タブの見た目を更新
      const tabs = tabContainer.querySelectorAll('.image-input-tab');
      tabs.forEach(tab => {
        tab.style.backgroundColor = '#f8f9fa';
        tab.style.color = '#2c3e50';
        tab.classList.remove('active');
      });

      // コンテナの表示を切り替え
      if (tabType === 'file') {
        fileUploadTab.style.backgroundColor = '#3498db';
        fileUploadTab.style.color = 'white';
        fileUploadTab.classList.add('active');
        fileInputContainer.style.display = 'flex';
        urlInputContainer.style.display = 'none';
        noteTextFile.style.display = 'block';
        noteTextUrl.style.display = 'none';
      } else {
        urlInputTab.style.backgroundColor = '#3498db';
        urlInputTab.style.color = 'white';
        urlInputTab.classList.add('active');
        fileInputContainer.style.display = 'none';
        urlInputContainer.style.display = 'flex';
        noteTextFile.style.display = 'none';
        noteTextUrl.style.display = 'block';
      }
    }

    // すでにデータがある場合はプレビューを表示
    if (illustrationPathInput.value) {
      if (Utils.isBase64Image(illustrationPathInput.value)) {
        // Base64データの場合
        previewImg.src = illustrationPathInput.value;
        illustrationPreview.style.display = 'block';
        fileClearButton.style.display = 'inline-block';
        // ファイルアップロードタブをアクティブに
        showTab('file');
      } else if (Utils.isUrl(illustrationPathInput.value)) {
        // URLの場合
        previewImg.src = illustrationPathInput.value;
        illustrationPreview.style.display = 'block';
        urlInput.value = illustrationPathInput.value;
        urlClearButton.style.display = 'inline-block';
        // URLタブをアクティブに
        showTab('url');
      } else {
        // 従来の画像パスの場合
        noteTextFile.innerHTML += '<br><strong style="color: #e74c3c;">* 以前の形式の画像パスが検出されました。新しいシステムでは画像ファイルを直接選択するか、URLを入力してください。</strong>';
      }
    }

    // タブのクリックイベント
    fileUploadTab.addEventListener('click', () => showTab('file'));
    urlInputTab.addEventListener('click', () => showTab('url'));

    // ファイル選択イベントハンドラ - クロージャで必要な変数をキャプチャ
    fileInput.addEventListener('change', function (event) {
      // このクロージャ内でこのプロジェクト固有の変数をキャプチャ
      const thisProjectPathInput = illustrationPathInput;
      const thisProjectPreviewImg = previewImg;
      const thisProjectPreview = illustrationPreview;
      const thisProjectClearBtn = fileClearButton;

      const file = event.target.files[0];
      if (file) {
        // ファイルサイズチェック
        const fileSizeMB = file.size / (1024 * 1024);
        let warningShown = false;

        if (fileSizeMB > 5) {
          Notification.error('画像が大きすぎます（5MB超）。より小さな画像を選択してください。');
          return;
        } else if (fileSizeMB > 2) {
          Notification.warning('大きな画像（2MB超）は自動的に圧縮されます。');
          warningShown = true;
        }

        const reader = new FileReader();
        reader.onload = async function (e) {
          try {
            // 生のデータURLを取得
            const rawDataUrl = e.target.result;

            // 圧縮が必要かチェック
            const needsCompression = fileSizeMB > 0.5; // 500KB以上は圧縮

            // 圧縮処理
            let finalDataUrl;
            if (needsCompression) {
              try {
                // 大きさに応じて品質調整
                let quality = 0.7; // デフォルト品質
                let maxWidth = 1024;
                let maxHeight = 1024;

                if (fileSizeMB > 3) {
                  quality = 0.5;
                  maxWidth = 800;
                  maxHeight = 800;
                } else if (fileSizeMB > 1) {
                  quality = 0.6;
                  maxWidth = 1024;
                  maxHeight = 1024;
                }

                // 圧縮実行
                finalDataUrl = await Utils.compressImage(rawDataUrl, maxWidth, maxHeight, quality);

                if (!warningShown) {
                  Notification.info('画像を圧縮して保存しました');
                }
              } catch (compressionError) {
                console.error('画像圧縮に失敗:', compressionError);
                finalDataUrl = rawDataUrl; // 圧縮失敗時は元のデータを使用
                Notification.warning('画像の圧縮に失敗しました。元のサイズで保存します。');
              }
            } else {
              finalDataUrl = rawDataUrl; // 小さい画像は圧縮なし
            }

            // Base64データをinput要素の値として保存
            thisProjectPathInput.value = finalDataUrl;

            // プレビュー表示
            thisProjectPreviewImg.src = finalDataUrl;
            thisProjectPreview.style.display = 'block';
            thisProjectClearBtn.style.display = 'inline-block';
          } catch (error) {
            console.error('画像処理エラー:', error);
            Notification.error('画像の処理中にエラーが発生しました');
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // プレビュー画像の読み込みエラーハンドリング
    previewImg.addEventListener('error', function () {
      // このクロージャ内でこのプロジェクト固有の変数をキャプチャ
      const thisProjectPreview = illustrationPreview;

      // src属性が空でない場合のみエラーメッセージを表示（クリア時は表示しない）
      if (urlInputTab.classList.contains('active') && this.getAttribute('src') && this.getAttribute('src') !== '') {
        Notification.error('画像の読み込みに失敗しました。URLが正しいか確認してください。');
        thisProjectPreview.style.display = 'none';
      }
    });

    // クリアボタンのイベントハンドラ（ファイルモード）- クロージャで必要な変数をキャプチャ
    fileClearButton.addEventListener('click', function () {
      // このクロージャ内でこのプロジェクト固有の変数をキャプチャ
      const thisProjectPathInput = illustrationPathInput;
      const thisProjectPreviewImg = previewImg;
      const thisProjectPreview = illustrationPreview;
      const thisProjectFileInput = fileInput;

      thisProjectPathInput.value = '';
      thisProjectPreviewImg.src = '';
      thisProjectPreview.style.display = 'none';
      this.style.display = 'none';
      thisProjectFileInput.value = ''; // ファイル選択もリセット
    });

    // クリアボタンのイベントハンドラ（URLモード）- クロージャで必要な変数をキャプチャ
    urlClearButton.addEventListener('click', function () {
      // このクロージャ内でこのプロジェクト固有の変数をキャプチャ
      const thisProjectPathInput = illustrationPathInput;
      const thisProjectPreviewImg = previewImg;
      const thisProjectPreview = illustrationPreview;
      const thisProjectUrlInput = urlInput;

      thisProjectPathInput.value = '';
      thisProjectPreviewImg.src = '';
      thisProjectPreview.style.display = 'none';
      this.style.display = 'none';
      thisProjectUrlInput.value = ''; // URL入力もリセット
    });

    // URLの入力でEnterキーを押した場合、読み込むボタンをクリック
    urlInput.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        loadUrlButton.click();
      }
    });
  }

  /**
   * 既存のプロジェクト要素に画像アップロード機能を追加
   */
  function upgradeExistingProjects() {
    document.querySelectorAll('.project-container').forEach(container => {
      // 各コンテナにユニークなID付与を確実に
      if (!container.id) {
        container.id = `project-container-auto-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
      setup(container);
    });
  }

  // 公開API
  return {
    setup,
    upgradeExistingProjects
  };
})();

// グローバルへのエクスポート
window.ImageUploader = ImageUploader;