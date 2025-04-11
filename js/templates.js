// templates.js - インラインテンプレートを使用してフォーム要素を動的に生成する処理

// 画像ファイル選択フィールドを追加し、選択した画像をBase64に変換する関数
function setupImageUploader(projectContainer) {
  const illustrationPathInput = projectContainer.querySelector('.illustration-image');
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
  
  // ファイル選択ボタン作成
  const fileInputContainer = document.createElement('div');
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
  fileInputContainer.appendChild(clearButton);
  
  // スタイル注釈の追加
  const noteText = document.createElement('p');
  noteText.style.fontSize = '12px';
  noteText.style.color = '#7f8c8d';
  noteText.style.marginTop = '5px';
  noteText.innerHTML = '* 画像はBase64形式でJSONに埋め込まれます。PNG/JPG推奨。<br>* 大きなファイルはJSONサイズが膨大になるため、1MB以下を推奨します。';
  
  // 既存の入力欄の親要素に、これらの新しい要素を追加
  const parentElement = illustrationPathInput.parentElement;
  parentElement.appendChild(fileInputContainer);
  parentElement.appendChild(illustrationPreview);
  parentElement.appendChild(noteText);
  
  // すでにBase64データがある場合は表示する
  if (illustrationPathInput.value && illustrationPathInput.value.startsWith('data:image/')) {
    previewImg.src = illustrationPathInput.value;
    illustrationPreview.style.display = 'block';
    clearButton.style.display = 'inline-block';
  }
  
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
        clearButton.style.display = 'inline-block';
      };
      reader.readAsDataURL(file);
    }
  });
  
  // クリアボタンのイベントハンドラ
  clearButton.addEventListener('click', function() {
    illustrationPathInput.value = '';
    previewImg.src = '';
    illustrationPreview.style.display = 'none';
    clearButton.style.display = 'none';
    fileInput.value = ''; // ファイル選択もリセット
  });
}

// 既存のプロジェクト要素に画像アップロード機能を追加する関数
function upgradeExistingProjects() {
  document.querySelectorAll('.project-container').forEach(container => {
    setupImageUploader(container);
  });
}
// テンプレートのローディングが完了したかを確認する関数
async function ensureTemplatesLoaded() {
  // テンプレートローダーがロードされていない場合の対策
  if (!window.loadAllTemplates) {
    console.warn('テンプレートローダーが見つかりません。動的にロードします。');
    try {
      await loadScript('js/inline-templates-loader.js');
      await window.loadAllTemplates();
    } catch (error) {
      console.error('テンプレートローダーの読み込みに失敗しました', error);
      throw error;
    }
  } else if (!window.templatesLoaded) {
    // テンプレートローダーはあるがまだ読み込まれていない場合
    await window.loadAllTemplates();
  }
}

// スクリプトを動的に読み込む補助関数
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
  });
}

// テンプレートを使用してHandlebarsでHTMLを生成する
function renderTemplate(templateName, data = {}) {
  // テンプレートが存在するか確認
  if (!window.inlineTemplates || !window.inlineTemplates.form[templateName]) {
    console.error(`テンプレート '${templateName}' が見つかりません`, window.inlineTemplates);
    return '';
  }
  
  // テンプレートをコンパイルして使用
  const template = Handlebars.compile(window.inlineTemplates.form[templateName]);
  return template(data);
}

// 職歴項目のテンプレート
async function createCareerItem(data = {}) {
  await ensureTemplatesLoaded();
  
  const itemId = Date.now();
  const container = document.createElement('div');
  container.classList.add('career-item');
  container.dataset.id = itemId;
  
  // データを正規化（undefinedやnullを防止）
  const normalizedData = {
    period: {
      from: data?.period?.from || '',
      to: data?.period?.to || ''
    },
    role: data?.role || '',
    company: data?.company || '',
    description: data?.description || '',
    projects: Array.isArray(data?.projects) ? data.projects : []
  };
  
  // HTMLテンプレートを使用してコンテンツを生成
  container.innerHTML = renderTemplate('careerItem', normalizedData);
  
  // イベントリスナーの設定
  container.querySelector('.add-project').addEventListener('click', function() {
    const projectsContainer = container.querySelector('.career-projects');
    
    // careerProjectItem テンプレートを使用（キャリア内のプロジェクト項目用）
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = renderTemplate('careerProjectItem', { value: '' });
    
    const newItem = tempDiv.firstElementChild;
    newItem.querySelector('.remove-project').addEventListener('click', function() {
      this.closest('.dynamic-item').remove();
    });
    
    projectsContainer.appendChild(newItem);
  });
  container.querySelector('.remove-career').addEventListener('click', () => container.remove());
  container.querySelectorAll('.remove-project').forEach(btn => {
    btn.addEventListener('click', function() {
      this.parentElement.remove();
    });
  });
  
  return container;
}

// テクニカルキャリア（プロジェクト）項目のテンプレート
// templates.js の createProjectItem 関数を更新します
// 関数に画像アップロード機能を追加し、以下のように置き換えます

// テクニカルキャリア（プロジェクト）項目のテンプレート
async function createProjectItem(data = {}) {
  await ensureTemplatesLoaded();
  
  const itemId = Date.now();
  const container = document.createElement('div');
  container.classList.add('project-container');
  container.dataset.id = itemId;
  
  // テクニカルキャリア用プロジェクトテンプレートを使用
  container.innerHTML = window.inlineTemplates.form.technicalProjectItem;
  
  console.log('プロジェクトデータ読み込み:', data);
  
  // データがあれば入力欄に設定
  if (data) {
    // 基本情報の設定
    if (data.projectTitle) container.querySelector('.project-title').value = data.projectTitle;
    if (data.flowTitle) container.querySelector('.flow-title').value = data.flowTitle;
    if (data.overviewTitle) container.querySelector('.overview-title').value = data.overviewTitle;
    if (data.overviewText) container.querySelector('.overview-text').value = data.overviewText;
    if (data.illustrationImage) container.querySelector('.illustration-image').value = data.illustrationImage;
    
    // 役割マイルストーンの設定 - 修正版
    if (data.roleMilestones && Array.isArray(data.roleMilestones)) {
      console.log('読み込む役割マイルストーン:', data.roleMilestones);
      
      const milestonesContainer = container.querySelector('.role-milestones');
      milestonesContainer.innerHTML = ''; // 既存の項目をクリア
      
      // 各マイルストーンを追加
      data.roleMilestones.forEach(milestone => {
        
        // HTMLを直接構築（renderTemplateを使わない）
        const html = `
        <div class="dynamic-item" style="display: flex; flex-wrap: wrap; gap: 10px;">
          <input type="text" value="${milestone.label || ''}" class="role-label" style="width: 50px;" placeholder="PG">
          <input type="text" value="${milestone.role || ''}" class="role-title" style="flex: 1;" placeholder="プログラマー">
          <input type="text" value="${milestone.date || ''}" class="role-date" style="width: 120px;" placeholder="2021年4月">
          <input type="text" value="${milestone.description || ''}" class="role-description" style="flex: 2;" placeholder="バックエンド開発担当">
          <button class="remove-btn remove-role-milestone">削除</button>
        </div>`;
        
        // 一時的なコンテナに追加してから、firstElementChildを取得
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        const newItem = tempDiv.firstElementChild;
        newItem.querySelector('.remove-role-milestone').addEventListener('click', function() {
          this.closest('.dynamic-item').remove();
        });
        
        milestonesContainer.appendChild(newItem);
      });
    }
    
    // 技術スタックの設定
    if (data.techStack && Array.isArray(data.techStack)) {
      const techContainer = container.querySelector('.tech-stack');
      techContainer.innerHTML = ''; // 既存の項目をクリア
      
      data.techStack.forEach(tech => {
        // HTMLを直接構築
        const html = `
        <div class="dynamic-item">
          <input type="text" value="${tech || ''}" class="tech-item" placeholder="技術名">
          <button class="remove-btn remove-tech">削除</button>
        </div>`;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        const newItem = tempDiv.firstElementChild;
        newItem.querySelector('.remove-tech').addEventListener('click', function() {
          this.closest('.dynamic-item').remove();
        });
        
        techContainer.appendChild(newItem);
      });
    }
    
    // 実績の設定
    if (data.achievements && Array.isArray(data.achievements)) {
      const achievementsContainer = container.querySelector('.achievements');
      achievementsContainer.innerHTML = ''; // 既存の項目をクリア
      
      data.achievements.forEach(achievement => {
        // HTMLを直接構築
        const html = `
        <div class="dynamic-item">
          <input type="text" value="${achievement || ''}" class="achievement-item" placeholder="実績内容">
          <button class="remove-btn remove-achievement">削除</button>
        </div>`;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        const newItem = tempDiv.firstElementChild;
        newItem.querySelector('.remove-achievement').addEventListener('click', function() {
          this.closest('.dynamic-item').remove();
        });
        
        achievementsContainer.appendChild(newItem);
      });
    }
  }
  
  // イベントリスナーの設定
  container.querySelector('.add-role-milestone').addEventListener('click', function() {
    const milestones = container.querySelector('.role-milestones');
    
    // 役割マイルストーン追加処理を修正
    const html = `
    <div class="dynamic-item" style="display: flex; flex-wrap: wrap; gap: 10px;">
      <input type="text" value="" class="role-label" style="width: 50px;" placeholder="PG">
      <input type="text" value="" class="role-title" style="flex: 1;" placeholder="プログラマー">
      <input type="text" value="" class="role-date" style="width: 120px;" placeholder="2021年4月">
      <input type="text" value="" class="role-description" style="flex: 2;" placeholder="バックエンド開発担当">
      <button class="remove-btn remove-role-milestone">削除</button>
    </div>`;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const newItem = tempDiv.firstElementChild;
    newItem.querySelector('.remove-role-milestone').addEventListener('click', function() {
      this.closest('.dynamic-item').remove();
    });
    
    milestones.appendChild(newItem);
  });
  
  container.querySelector('.add-tech').addEventListener('click', function() {
    const techContainer = container.querySelector('.tech-stack');
    
    // 技術スタック追加処理を修正
    const html = `
    <div class="dynamic-item">
      <input type="text" value="" class="tech-item" placeholder="技術名">
      <button class="remove-btn remove-tech">削除</button>
    </div>`;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const newItem = tempDiv.firstElementChild;
    newItem.querySelector('.remove-tech').addEventListener('click', function() {
      this.closest('.dynamic-item').remove();
    });
    
    techContainer.appendChild(newItem);
  });
  
  container.querySelector('.add-achievement').addEventListener('click', function() {
    const achievementsContainer = container.querySelector('.achievements');
    
    // 実績追加処理を修正
    const html = `
    <div class="dynamic-item">
      <input type="text" value="" class="achievement-item" placeholder="実績内容">
      <button class="remove-btn remove-achievement">削除</button>
    </div>`;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const newItem = tempDiv.firstElementChild;
    newItem.querySelector('.remove-achievement').addEventListener('click', function() {
      this.closest('.dynamic-item').remove();
    });
    
    achievementsContainer.appendChild(newItem);
  });
  
  container.querySelector('.remove-project').addEventListener('click', () => container.remove());
  container.querySelectorAll('.remove-role-milestone').forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.dynamic-item').remove();
    });
  });
  container.querySelectorAll('.remove-tech').forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.dynamic-item').remove();
    });
  });
  container.querySelectorAll('.remove-achievement').forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.dynamic-item').remove();
    });
  });
  
  // 画像アップロード機能の追加
  setupImageUploader(container);
  
  return container;
}

// スキルカテゴリのテンプレート
async function createSkillCategory(data = {}) {
  await ensureTemplatesLoaded();
  
  const categoryId = Date.now();
  const container = document.createElement('div');
  container.classList.add('skill-category-item');
  container.dataset.id = categoryId;
  
  // データの正規化
  const templateData = { 
    categoryName: data?.categoryName || '',
    items: Array.isArray(data?.items) ? data.items.map(item => ({
      name: item?.name || '',
      level: item?.level || 1
    })) : [],
    skillId: categoryId
  };
  
  // HTMLテンプレートを使用してコンテンツを生成
  container.innerHTML = renderTemplate('skillCategory', templateData);
  
  container.querySelector('.add-skill').addEventListener('click', function() {
    const skillsContainer = container.querySelector('.skill-items');
    const skillId = `skill-${categoryId}-${Date.now()}`;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = renderTemplate('skillItem', { skillId });
    
    // イベントリスナーを追加し、要素を追加
    const newItem = tempDiv.firstElementChild;
    if (newItem.querySelector('.remove-skill')) {
      newItem.querySelector('.remove-skill').addEventListener('click', function() {
        this.closest('.skill-item').remove();
      });
    }
    
    skillsContainer.appendChild(newItem);
  });
  
  container.querySelector('.remove-category').addEventListener('click', () => container.remove());
  container.querySelectorAll('.remove-skill').forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.skill-item').remove();
    });
  });
  
  return container;
}

// 強み項目のテンプレート
async function createStrengthItem(data = {}) {
  await ensureTemplatesLoaded();
  
  const itemId = Date.now();
  const container = document.createElement('div');
  container.classList.add('strength-item-container');
  container.dataset.id = itemId;
  
  // データの正規化
  const normalizedData = {
    title: data?.title || '',
    description: data?.description || ''
  };
  
  // HTMLテンプレートを使用してコンテンツを生成
  container.innerHTML = renderTemplate('strengthItem', normalizedData);
  
  container.querySelector('.remove-strength').addEventListener('click', () => container.remove());
  return container;
}

// 動的項目を追加する関数
async function addDynamicItem(container, value = '', className = '') {
  await ensureTemplatesLoaded();
  
  // クラス名に基づいて特定のテンプレートを使用
  let templateName = 'dynamicItem';
  if (className === 'focus-item') templateName = 'focusItem';
  else if (className === 'cert-item') templateName = 'certItem';
  else if (className === 'project-item') templateName = 'careerProjectItem'; // 名前変更！
  else if (className === 'tech-item') templateName = 'techItem';
  else if (className === 'achievement-item') templateName = 'achievementItem';
  
  // 一時的なコンテナを作成してHTMLを挿入
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = renderTemplate(templateName, { value: value || '', className });
  
  // 新しい要素を取得
  const newItem = tempDiv.firstElementChild;
  
  // 削除ボタンのイベントリスナーを追加
  const removeBtn = newItem.querySelector('.remove-btn');
  if (removeBtn) {
    removeBtn.addEventListener('click', function() {
      this.closest('.dynamic-item').remove();
    });
  }
  
  // 対象コンテナに要素を追加
  container.appendChild(newItem);
  return newItem;
}

// eq ヘルパーの登録（スキルレベルの比較用）
Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

// DOMContentLoadedイベントでテンプレートの読み込みを確認
document.addEventListener('DOMContentLoaded', async function() {
  try {
    await ensureTemplatesLoaded();
    console.log('テンプレートの読み込みが完了しました');
  } catch (error) {
    console.error('テンプレートの読み込みに失敗しました', error);
  }
});