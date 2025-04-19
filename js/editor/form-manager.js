/**
 * js/editor/form-manager.js
 * フォーム要素の生成と管理を担当するモジュール
 */
const FormManager = (function() {
  /**
   * 職歴項目の作成
   * @param {Object} data - 初期データ
   * @return {HTMLElement} 生成された職歴項目要素
   */
  async function createCareerItem(data = {}) {
    await TemplateManager.loadAllTemplates();
    
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
    container.innerHTML = TemplateManager.renderTemplate('careerItem', normalizedData, 'editor');
    
    // イベントリスナーの設定
    container.querySelector('.add-project').addEventListener('click', function() {
      const projectsContainer = container.querySelector('.career-projects');
      
      // careerProjectItem テンプレートを使用（キャリア内のプロジェクト項目用）
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = TemplateManager.renderTemplate('careerProjectItem', { value: '' }, 'editor');
      
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
  
  /**
   * テクニカルキャリア（プロジェクト）項目の作成
   * @param {Object} data - 初期データ
   * @return {HTMLElement} 生成されたプロジェクト項目要素
   */
  async function createProjectItem(data = {}) {
    await TemplateManager.loadAllTemplates();
    
    const itemId = Date.now();
    const container = document.createElement('div');
    container.classList.add('project-container');
    container.dataset.id = itemId;
    
    // テクニカルキャリア用プロジェクトテンプレートを使用
    container.innerHTML = TemplateManager.getTemplate('technicalProjectItem', 'editor');
    
    // データがあれば入力欄に設定
    if (data) {
      // 基本情報の設定
      if (data.projectTitle) container.querySelector('.project-title').value = data.projectTitle;
      if (data.flowTitle) container.querySelector('.flow-title').value = data.flowTitle;
      if (data.overviewTitle) container.querySelector('.overview-title').value = data.overviewTitle;
      if (data.overviewText) container.querySelector('.overview-text').value = data.overviewText;
      if (data.illustrationImage) container.querySelector('.illustration-image').value = data.illustrationImage;
      
      // 役割マイルストーンの設定
      if (data.roleMilestones && Array.isArray(data.roleMilestones)) {
        const milestonesContainer = container.querySelector('.role-milestones');
        milestonesContainer.innerHTML = ''; // 既存の項目をクリア
        
        // 各マイルストーンを追加
        data.roleMilestones.forEach(milestone => {
          // HTMLを直接構築
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
      
      // 役割マイルストーン追加処理
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
      
      // 技術スタック追加処理
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
      
      // 実績追加処理
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
    ImageUploader.setup(container);
    
    return container;
  }
  
  /**
   * スキルカテゴリの作成
   * @param {Object} data - 初期データ
   * @return {HTMLElement} 生成されたスキルカテゴリ要素
   */
  async function createSkillCategory(data = {}) {
    await TemplateManager.loadAllTemplates();
    
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
    container.innerHTML = TemplateManager.renderTemplate('skillCategory', templateData, 'editor');
    
    container.querySelector('.add-skill').addEventListener('click', function() {
      const skillsContainer = container.querySelector('.skill-items');
      const skillId = `skill-${categoryId}-${Date.now()}`;
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = TemplateManager.renderTemplate('skillItem', { skillId }, 'editor');
      
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
  
  /**
   * 強み項目の作成
   * @param {Object} data - 初期データ
   * @return {HTMLElement} 生成された強み項目要素
   */
  async function createStrengthItem(data = {}) {
    await TemplateManager.loadAllTemplates();
    
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
    container.innerHTML = TemplateManager.renderTemplate('strengthItem', normalizedData, 'editor');
    
    container.querySelector('.remove-strength').addEventListener('click', () => container.remove());
    return container;
  }
  
  /**
   * 動的項目の追加
   * @param {HTMLElement} container - 追加先のコンテナ要素
   * @param {string} value - 初期値
   * @param {string} className - CSSクラス名
   * @return {HTMLElement} 生成された動的項目要素
   */
  async function addDynamicItem(container, value = '', className = '') {
    await TemplateManager.loadAllTemplates();
    
    // クラス名に基づいて特定のテンプレートを使用
    let templateName = 'dynamicItem';
    if (className === 'focus-item') templateName = 'focusItem';
    else if (className === 'cert-item') templateName = 'certItem';
    else if (className === 'project-item') templateName = 'careerProjectItem';
    else if (className === 'tech-item') templateName = 'techItem';
    else if (className === 'achievement-item') templateName = 'achievementItem';
    
    // 一時的なコンテナを作成してHTMLを挿入
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = TemplateManager.renderTemplate(templateName, { value: value || '', className }, 'editor');
    
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
  
  /**
   * フォームの初期状態を準備
   */
  function initForm() {
    try {
      // 空の職歴項目を1つ追加
      document.getElementById('add-career').click();
      // 空のプロジェクトを1つ追加
      document.getElementById('add-project').click();
      // 空のスキルカテゴリを1つ追加
      document.getElementById('add-category').click();
      // 空の強み項目を1つ追加
      document.getElementById('add-strength').click();
      // 空の注力分野を1つ追加
      document.getElementById('add-focus').click();
      // 空の資格を1つ追加
      document.getElementById('add-certification').click();
    } catch (error) {
      console.error('フォームの初期化に失敗しました:', error);
    }
  }
  
  // 公開API
  return {
    createCareerItem,
    createProjectItem,
    createSkillCategory,
    createStrengthItem,
    addDynamicItem,
    initForm
  };
})();

// グローバルへのエクスポート
window.FormManager = FormManager;
