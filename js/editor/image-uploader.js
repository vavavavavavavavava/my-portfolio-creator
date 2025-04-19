/**
 * js/editor/image-uploader.js
 * 画像アップロード機能を提供するモジュール
 */
const ImageUploader = (function() {
  /**
   * 画像アップロード機能を設定
   * @param {HTMLElement} projectContainer - プロジェクトコンテナ要素
   */
  function setup(projectContainer) {
    const illustrationPathInput = projectContainer.querySelector('.illustration-image');
    if (!illustrationPathInput) return; // 対応する要素が見つからない場合は終了
    
    // すでに設定済みの場合は再設定しない（重複防止）
    if (projectContainer.querySelector('.illustration-preview')) return;
    
    const illustrationPreview = document.createElement('div');
    illustrationPreview.className = 'illustration-preview';
    illustrationPreview.style.marginTop = '10px';
    illustrationPreview.style.textAlign = 'center';
    illustrationPreview.style.display = 'none';
    
    // プレビュー画像要素
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
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = `illustration-file-${Date.now()}`;
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    const fileInputLabel = document.createElement('label');
    fileInputLabel.htmlFor = fileInput.id;
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
    
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.id = `illustration-url-${Date.now()}`;
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
    
    // クリアボタン（両方のモードで共有）
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
    
    fileInputContainer.appendChild(fileInput);
    fileInputContainer.appendChild(fileInputLabel);
    fileInputContainer.appendChild(clearButton.cloneNode(true));
    
    urlInputContainer.appendChild(clearButton);
    
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
    
    // すでにデータがある場合はプレビューを表示
    if (illustrationPathInput.value) {
      if (Utils.isBase64Image(illustrationPathInput.value)) {
        // Base64データの場合
        previewImg.src = illustrationPathInput.value;
        illustrationPreview.style.display = 'block';
        fileInputContainer.querySelector('.clear-image-btn').style.display = 'inline-block';
        // ファイルアップロードタブをアクティブに
        showTab('file');
      } else if (Utils.isUrl(illustrationPathInput.value)) {
        // URLの場合
        previewImg.src = illustrationPathInput.value;
        illustrationPreview.style.display = 'block';
        urlInput.value = illustrationPathInput.value;
        urlInputContainer.querySelector('.clear-image-btn').style.display = 'inline-block';
        // URLタブをアクティブに
        showTab('url');
      } else {
        // 従来の画像パスの場合
        noteTextFile.innerHTML += '<br><strong style="color: #e74c3c;">* 以前の形式の画像パスが検出されました。新しいシステムでは画像ファイルを直接選択するか、URLを入力してください。</strong>';
      }
    }
    
    // タブ切り替え関数
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
    
    // タブのクリックイベント
    fileUploadTab.addEventListener('click', () => showTab('file'));
    urlInputTab.addEventListener('click', () => showTab('url'));
    
    // ファイル選択イベントハンドラ
    fileInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          // Base64データをinput要素の値として保存
          illustrationPathInput.value = e.target.result;
          
          // プレビュー表示
          previewImg.src = e.target.result;
          illustrationPreview.style.display = 'block';
          fileInputContainer.querySelector('.clear-image-btn').style.display = 'inline-block';
        };
        reader.readAsDataURL(file);
      }
    });
    
    // URLロードイベントハンドラ
    loadUrlButton.addEventListener('click', function() {
      const url = urlInput.value.trim();
      if (url) {
        // 画像URLの簡易検証（完全ではないが基本的なチェック）
        if (url.match(/^https?:\/\/.*\.(jpe?g|png|gif|bmp|webp|svg)(\?.*)?$/i) || 
            url.match(/^https?:\/\/.*\/image\/.*$/i)) {
          // プレビュー表示
          previewImg.src = url;
          illustrationPreview.style.display = 'block';
          urlInputContainer.querySelector('.clear-image-btn').style.display = 'inline-block';
          
          // input要素の値として保存
          illustrationPathInput.value = url;
        } else {
          Notification.warning('有効な画像URLを入力してください');
        }
      }
    });
    
    // プレビュー画像の読み込みエラーハンドリング
    previewImg.addEventListener('error', function() {
      // src属性が空でない場合のみエラーメッセージを表示（クリア時は表示しない）
      if (urlInputTab.classList.contains('active') && this.getAttribute('src') && this.getAttribute('src') !== '') {
        Notification.error('画像の読み込みに失敗しました。URLが正しいか確認してください。');
        illustrationPreview.style.display = 'none';
      }
    });
    
    // クリアボタンのイベントハンドラ（ファイルモード）
    fileInputContainer.querySelector('.clear-image-btn').addEventListener('click', function() {
      illustrationPathInput.value = '';
      previewImg.src = '';
      illustrationPreview.style.display = 'none';
      this.style.display = 'none';
      fileInput.value = ''; // ファイル選択もリセット
    });
    
    // クリアボタンのイベントハンドラ（URLモード）
    urlInputContainer.querySelector('.clear-image-btn').addEventListener('click', function() {
      illustrationPathInput.value = '';
      previewImg.src = '';
      illustrationPreview.style.display = 'none';
      this.style.display = 'none';
      urlInput.value = ''; // URL入力もリセット
    });
    
    // URLの入力でEnterキーを押した場合、読み込むボタンをクリック
    urlInput.addEventListener('keypress', function(event) {
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
