// main.js - スライド表示用メインスクリプト

// カスタムヘルパーの登録
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
      cls = 'filled';  // それ以上は通常の filled で
    }
    output += `<div class="level-dot ${cls}"></div>`;
  }
  return new Handlebars.SafeString(output);
});

Handlebars.registerHelper('inc', function(value) {
  return parseInt(value) + 1;
});

Handlebars.registerHelper('legendClass', function(index) {
  if (index === 0) return "beginner";
  else if (index === 1) return "intermediate";
  else if (index === 2) return "advanced";
  else return "";
});

// 現在表示中のデータを保持する変数
window.currentDisplayData = null;

// テンプレートが読み込まれたことを確認する関数
async function ensureTemplatesLoaded() {
  if (!window.inlineTemplates || Object.keys(window.inlineTemplates.slide).length === 0) {
    console.log('テンプレートがまだ読み込まれていません。読み込みを開始します。');
    
    // inline-templates-loader.jsが読み込まれているか確認
    if (!window.loadAllTemplates) {
      console.warn('テンプレートローダーが見つかりません。スクリプトを動的に読み込みます。');
      await loadScript('js/inline-templates-loader.js');
    }
    
    // テンプレートを読み込む
    await window.loadAllTemplates();
  }
}

// defaultData.jsが読み込まれているか確認する関数
async function ensureDefaultDataLoaded() {
  if (!window.DEFAULT_DATA) {
    console.warn('デフォルトデータが読み込まれていません。スクリプトを動的に読み込みます。');
    await loadScript('js/defaultData.js');
    
    if (!window.DEFAULT_DATA) {
      console.error('デフォルトデータの読み込みに失敗しました。');
      throw new Error('Failed to load default data');
    }
  }
}

// スクリプトを非同期に読み込む関数
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
  });
}

// ファイルからJSONデータを読み込む関数
async function loadDataFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('JSONの解析に失敗しました: ' + error.message));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

// データとテンプレートを読み込み、レンダリングする関数
async function renderSlides(customData = null) {
  try {
    // テンプレートが読み込まれていることを確認
    await ensureTemplatesLoaded();
    
    let data;
    // カスタムデータがある場合はそれを使用し、現在のデータとして記録
    if (customData) {
      data = customData;
      window.currentDisplayData = customData;
    } else {
      // defaultData.jsから読み込む
      await ensureDefaultDataLoaded();
      data = window.DEFAULT_DATA;
      
      // 既にエディタからのデータやカスタムデータがロードされていなければ現在のデータとして記録
      if (!window.currentDisplayData) {
        window.currentDisplayData = data;
      }
    }
    
    // レンダリング結果を挿入するコンテナ
    const container = document.getElementById('slides-container');
    container.innerHTML = ''; // コンテナを一旦クリア
    
    // 各テンプレートをコンパイルしてレンダリング
    const templates = {
      title: Handlebars.compile(window.inlineTemplates.slide.title),
      career: Handlebars.compile(window.inlineTemplates.slide.career),
      technicalcareer: Handlebars.compile(window.inlineTemplates.slide.technicalcareer),
      skills: Handlebars.compile(window.inlineTemplates.slide.skills),
      strengths: Handlebars.compile(window.inlineTemplates.slide.strengths)
    };
    
    // 各テンプレートに対応するデータを渡してレンダリング
    container.innerHTML += templates.title(data.title);
    container.innerHTML += templates.career(data.career);
    
    // 技術キャリアが配列なら各プロジェクトごとにレンダリング
    if (Array.isArray(data.technicalcareer)) {
      data.technicalcareer.forEach(project => {
        container.innerHTML += templates.technicalcareer(project);
      });
    } else {
      // 後方互換性のため、オブジェクトの場合も対応
      container.innerHTML += templates.technicalcareer(data.technicalcareer);
    }
    
    container.innerHTML += templates.skills(data.skills);
    container.innerHTML += templates.strengths(data.strengths);

    return true;
  } catch (error) {
    console.error('スライドのレンダリングに失敗しました:', error);
    alert('スライドのレンダリングに失敗しました: ' + error.message);
    return false;
  }
}

// PDFとして保存する関数（ブラウザの印刷機能を利用）
function saveToPDF() {
  window.print();
}

document.addEventListener('DOMContentLoaded', async () => {
  // テンプレートが読み込まれているか確認
  await ensureTemplatesLoaded();
  
  // URLのクエリパラメータをチェック
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('source');

  // エディタからのデータがあるかチェック
  const previewData = localStorage.getItem('preview_data');
  
  if (source === 'editor' && previewData) {
    try {
      const data = JSON.parse(previewData);
      renderSlides(data); // エディタからのデータでレンダリング
      localStorage.removeItem('preview_data'); // 不要になったので削除
      if (typeof showNotification === 'function') {
        showNotification('エディタからデータを読み込みました');
      }
    } catch (error) {
      console.error('プレビューデータの解析に失敗しました:', error);
      renderSlides(); // エラーの場合はデフォルトデータでレンダリング
    }
  } else {
    // 通常の初期表示
    renderSlides();
  }

  // JSONファイル読み込みボタンのイベントリスナー
  const loadJsonBtn = document.getElementById('load-json-btn');
  const jsonFileInput = document.getElementById('json-file-input');
  
  if (loadJsonBtn && jsonFileInput) {
    loadJsonBtn.addEventListener('click', () => {
      jsonFileInput.click();
    });
    
    jsonFileInput.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const data = await loadDataFromFile(file);
          await renderSlides(data);
          // ファイル入力をリセット（同じファイルを再度選択できるように）
          event.target.value = '';
          if (typeof showNotification === 'function') {
            showNotification('JSONファイルを読み込みました');
          }
        } catch (error) {
          console.error('JSONファイルの読み込みに失敗しました:', error);
          alert('JSONファイルの読み込みに失敗しました: ' + error.message);
        }
      }
    });
  }
  
  // PDF保存ボタンのイベントリスナー
  const savePdfBtn = document.getElementById('save-pdf-btn');
  if (savePdfBtn) {
    savePdfBtn.addEventListener('click', saveToPDF);
  }
});