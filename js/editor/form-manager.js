/**
 * js/editor/form-manager.js
 * フォーム要素の生成と管理を担当するモジュール（統一処理版）
 */
const FormManager = (function () {

  /**
   * 統一削除処理の設定
   */
  function setupUnifiedRemoveHandlers() {
    // イベント委譲による統一削除処理
    document.addEventListener('click', function (e) {
      if (e.target.matches('[data-action="remove-item"]')) {
        const item = e.target.closest('.dynamic-item');
        if (item) item.remove();
      } else if (e.target.matches('[data-action="remove-container"]')) {
        const container = e.target.closest('[data-container]');
        if (container) container.remove();
      }
    });
  }

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
    container.setAttribute('data-container', 'career');
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

    // プロジェクト追加のイベントリスナー設定（これだけは個別処理）
    container.querySelector('.add-project')?.addEventListener('click', function () {
      const projectsContainer = container.querySelector('.career-projects');

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = TemplateManager.renderTemplate('careerProjectItem', { value: '' }, 'editor');

      const newItem = tempDiv.firstElementChild;
      projectsContainer.appendChild(newItem);
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
    container.setAttribute('data-container', 'project');
    container.dataset.id = itemId;

    // テクニカルキャリア用プロジェクトテンプレートを使用
    container.innerHTML = TemplateManager.getTemplate('technicalProjectItem', 'editor');

    // ▼ レイアウトモードセレクタ
    const selector = container.querySelector('.layout-mode-selector');
    selector.value = data.layoutMode || 'detail';

    // ▼ 表示切り替え関数
    function updateFieldsByMode() {
      const mode = selector.value;
      container.querySelectorAll('.project-fields').forEach(group => {
        if (group.classList.contains('mode-' + mode)) {
          group.style.display = '';
        } else {
          group.style.display = 'none';
        }
      });
    }
    selector.addEventListener('change', updateFieldsByMode);
    updateFieldsByMode();

    // ▼ データがあれば各入力欄に値をセット
    if (data) {
      // ==== 共通フィールド ====
      if (data.projectTitle) container.querySelectorAll('.project-title').forEach(e => e.value = data.projectTitle);
      if (data.flowTitle) container.querySelectorAll('.flow-title').forEach(e => e.value = data.flowTitle);

      // ===== detail/dense/balance 共通 =====
      if (['detail', 'dense', 'balance'].includes(selector.value)) {
        if (data.overviewTitle) container.querySelector('.overview-title').value = data.overviewTitle;
        if (data.overviewText) container.querySelector('.overview-text').value = data.overviewText;
        if (data.illustrationImage) container.querySelector('.illustration-image').value = data.illustrationImage;

        // 役割マイルストーン
        if (Array.isArray(data.roleMilestones)) {
          const milestonesContainer = container.querySelector('.mode-' + selector.value + ' .role-milestones');
          milestonesContainer.innerHTML = '';
          data.roleMilestones.forEach(milestone => {
            const html = `
          <div class="dynamic-item" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <input type="text" value="${milestone.label || ''}" class="role-label" style="width: 50px;" placeholder="PG">
            <input type="text" value="${milestone.role || ''}" class="role-title" style="flex: 1;" placeholder="プログラマー">
            <input type="text" value="${milestone.date || ''}" class="role-date" style="width: 120px;" placeholder="2021年4月">
            <input type="text" value="${milestone.description || ''}" class="role-description" style="flex: 2;" placeholder="バックエンド開発担当">
            <button class="remove-btn" data-action="remove-item">削除</button>
          </div>`;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            milestonesContainer.appendChild(tempDiv.firstElementChild);
          });
        }
        // 技術スタック
        if (Array.isArray(data.techStack)) {
          const techContainer = container.querySelector('.mode-' + selector.value + ' .tech-stack');
          techContainer.innerHTML = '';
          data.techStack.forEach(tech => {
            const html = `
          <div class="dynamic-item">
            <input type="text" value="${tech || ''}" class="tech-item" placeholder="技術名">
            <button class="remove-btn" data-action="remove-item">削除</button>
          </div>`;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            techContainer.appendChild(tempDiv.firstElementChild);
          });
        }
        // 実績
        if (Array.isArray(data.achievements)) {
          const achievementsContainer = container.querySelector('.mode-' + selector.value + ' .achievements');
          achievementsContainer.innerHTML = '';
          data.achievements.forEach(achievement => {
            const html = `
          <div class="dynamic-item">
            <input type="text" value="${achievement || ''}" class="achievement-item" placeholder="実績内容">
            <button class="remove-btn" data-action="remove-item">削除</button>
          </div>`;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            achievementsContainer.appendChild(tempDiv.firstElementChild);
          });
        }
        // balanceのみ
        if (selector.value === 'balance' && Array.isArray(data.teamInfo)) {
          const teamInfoList = container.querySelector('.team-info-list');
          teamInfoList.innerHTML = '';
          data.teamInfo.forEach(item => {
            const html = `
              <div class="dynamic-item" style="display:flex; gap:10px;">
                <input type="text" value="${item.label || ''}" class="team-label" style="width: 120px;" placeholder="例: フロントエンド">
                <input type="number" value="${item.count || ''}" class="team-count" style="width:70px;" min="0" placeholder="人数">
                <button class="remove-btn" data-action="remove-item">削除</button>
              </div>`;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            teamInfoList.appendChild(tempDiv.firstElementChild);
          });
        }
      }

      // ===== visual モード =====
      if (selector.value === 'visual') {
        if (data.overviewTitle) container.querySelector('.overview-title').value = data.overviewTitle;
        if (data.overviewText) container.querySelector('.overview-text').value = data.overviewText;
        if (data.illustrationImage) container.querySelector('.mode-visual .illustration-image').value = data.illustrationImage;
        // 役割マイルストーン
        if (Array.isArray(data.roleMilestones)) {
          const milestonesContainer = container.querySelector('.mode-visual .role-milestones');
          milestonesContainer.innerHTML = '';
          data.roleMilestones.forEach(milestone => {
            const html = `
          <div class="dynamic-item" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <input type="text" value="${milestone.label || ''}" class="role-label" style="width: 50px;" placeholder="PG">
            <input type="text" value="${milestone.role || ''}" class="role-title" style="flex: 1;" placeholder="プログラマー">
            <input type="text" value="${milestone.date || ''}" class="role-date" style="width: 120px;" placeholder="2021年4月">
            <input type="text" value="${milestone.description || ''}" class="role-description" style="flex: 2;" placeholder="バックエンド開発担当">
            <button class="remove-btn" data-action="remove-item">削除</button>
          </div>`;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            milestonesContainer.appendChild(tempDiv.firstElementChild);
          });
        }
        // 技術スタック
        if (Array.isArray(data.techStack)) {
          const techContainer = container.querySelector('.mode-visual .tech-stack');
          techContainer.innerHTML = '';
          data.techStack.forEach(tech => {
            const html = `
          <div class="dynamic-item">
            <input type="text" value="${tech || ''}" class="tech-item" placeholder="技術名">
            <button class="remove-btn" data-action="remove-item">削除</button>
          </div>`;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            techContainer.appendChild(tempDiv.firstElementChild);
          });
        }
        // 成果
        if (Array.isArray(data.achievements)) {
          const achievementsContainer = container.querySelector('.mode-visual .achievements');
          achievementsContainer.innerHTML = '';
          data.achievements.forEach(achievement => {
            const html = `
          <div class="dynamic-item">
            <input type="text" value="${achievement || ''}" class="achievement-item" placeholder="成果内容">
            <button class="remove-btn" data-action="remove-item">削除</button>
          </div>`;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            achievementsContainer.appendChild(tempDiv.firstElementChild);
          });
        }
        // 追加ダイアグラム
        if (Array.isArray(data.additionalDiagrams)) {
          const diagramContainer = container.querySelector('.mode-visual .additional-diagrams');
          diagramContainer.innerHTML = '';
          data.additionalDiagrams.forEach(diagram => {
            const html = `
          <div class="dynamic-item">
            <input type="text" value="${diagram.title || ''}" class="diagram-title" placeholder="図タイトル">
            <input type="text" value="${diagram.image || ''}" class="diagram-image" placeholder="画像URLまたはbase64">
            <button class="remove-btn" data-action="remove-item">削除</button>
          </div>`;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            diagramContainer.appendChild(tempDiv.firstElementChild);
          });
        }
      }

      // ===== text モード =====
      if (selector.value === 'text') {
        if (data.overviewTitle) container.querySelector('.overview-title').value = data.overviewTitle;
        if (data.projectBackground) container.querySelector('.project-background').value = data.projectBackground;
        if (data.technicalApproach) container.querySelector('.technical-approach').value = data.technicalApproach;
        if (data.implementationDetails) container.querySelector('.implementation-details').value = data.implementationDetails;
        if (data.businessImpact) container.querySelector('.business-impact').value = data.businessImpact;
        // 役割マイルストーン
        if (Array.isArray(data.roleMilestones)) {
          const milestonesContainer = container.querySelector('.mode-text .role-milestones');
          milestonesContainer.innerHTML = '';
          data.roleMilestones.forEach(milestone => {
            const html = `
          <div class="dynamic-item" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <input type="text" value="${milestone.label || ''}" class="role-label" style="width: 50px;" placeholder="PG">
            <input type="text" value="${milestone.role || ''}" class="role-title" style="flex: 1;" placeholder="プログラマー">
            <input type="text" value="${milestone.date || ''}" class="role-date" style="width: 120px;" placeholder="2021年4月">
            <button class="remove-btn" data-action="remove-item">削除</button>
          </div>`;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            milestonesContainer.appendChild(tempDiv.firstElementChild);
          });
        }
        // 技術スタック
        if (Array.isArray(data.techStack)) {
          const techContainer = container.querySelector('.mode-text .tech-stack');
          techContainer.innerHTML = '';
          data.techStack.forEach(tech => {
            const html = `
          <div class="dynamic-item">
            <input type="text" value="${tech || ''}" class="tech-item" placeholder="技術名">
            <button class="remove-btn" data-action="remove-item">削除</button>
          </div>`;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            techContainer.appendChild(tempDiv.firstElementChild);
          });
        }
        // 実績
        if (Array.isArray(data.achievements)) {
          const achievementsContainer = container.querySelector('.mode-text .achievements');
          achievementsContainer.innerHTML = '';
          data.achievements.forEach(achievement => {
            const html = `
          <div class="dynamic-item">
            <input type="text" value="${achievement || ''}" class="achievement-item" placeholder="実績内容">
            <button class="remove-btn" data-action="remove-item">削除</button>
          </div>`;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            achievementsContainer.appendChild(tempDiv.firstElementChild);
          });
        }
        // 課題
        if (Array.isArray(data.challenges)) {
          const challengesContainer = container.querySelector('.mode-text .challenges');
          challengesContainer.innerHTML = '';
          data.challenges.forEach(challenge => {
            const html = `
          <div class="dynamic-item">
            <input type="text" value="${challenge || ''}" class="challenge-item" placeholder="課題・学び">
            <button class="remove-btn" data-action="remove-item">削除</button>
          </div>`;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            challengesContainer.appendChild(tempDiv.firstElementChild);
          });
        }
      }
    }

    // ==== 各mode共通: 動的入力欄追加 ====

    // 役割マイルストーン
    container.querySelectorAll('.add-role-milestone').forEach(btn => {
      btn.addEventListener('click', function () {
        const milestones = btn.closest('.form-group').querySelector('.role-milestones');
        const html = `
      <div class="dynamic-item" style="display: flex; flex-wrap: wrap; gap: 10px;">
        <input type="text" value="" class="role-label" style="width: 50px;" placeholder="PG">
        <input type="text" value="" class="role-title" style="flex: 1;" placeholder="プログラマー">
        <input type="text" value="" class="role-date" style="width: 120px;" placeholder="2021年4月">
        ${btn.closest('.project-fields').classList.contains('mode-text') ? '' : '<input type="text" value="" class="role-description" style="flex: 2;" placeholder="バックエンド開発担当">'}
        <button class="remove-btn" data-action="remove-item">削除</button>
      </div>`;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        milestones.appendChild(tempDiv.firstElementChild);
      });
    });

    // 技術スタック
    container.querySelectorAll('.add-tech').forEach(btn => {
      btn.addEventListener('click', function () {
        const techContainer = btn.closest('.form-group').querySelector('.tech-stack');
        const html = `
      <div class="dynamic-item">
        <input type="text" value="" class="tech-item" placeholder="技術名">
        <button class="remove-btn" data-action="remove-item">削除</button>
      </div>`;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        techContainer.appendChild(tempDiv.firstElementChild);
      });
    });

    // 実績
    container.querySelectorAll('.add-achievement').forEach(btn => {
      btn.addEventListener('click', function () {
        const achievementsContainer = btn.closest('.form-group').querySelector('.achievements');
        const html = `
      <div class="dynamic-item">
        <input type="text" value="" class="achievement-item" placeholder="実績内容">
        <button class="remove-btn" data-action="remove-item">削除</button>
      </div>`;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        achievementsContainer.appendChild(tempDiv.firstElementChild);
      });
    });

    // チーム
    container.querySelector('.add-team-info')?.addEventListener('click', function () {
      const teamInfoList = container.querySelector('.team-info-list');
      const html = `
      <div class="dynamic-item" style="display:flex; gap:10px;">
        <input type="text" value="" class="team-label" style="width: 120px;" placeholder="例: フロントエンド">
        <input type="number" value="" class="team-count" style="width:70px;" min="0" placeholder="人数">
        <button class="remove-btn" data-action="remove-item">削除</button>
      </div>`;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      teamInfoList.appendChild(tempDiv.firstElementChild);
    });

    // 課題
    container.querySelector('.add-challenge')?.addEventListener('click', function () {
      const challengesContainer = container.querySelector('.mode-text .challenges');
      const html = `
    <div class="dynamic-item">
      <input type="text" value="" class="challenge-item" placeholder="課題・学び">
      <button class="remove-btn" data-action="remove-item">削除</button>
    </div>`;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      challengesContainer.appendChild(tempDiv.firstElementChild);
    });

    // ダイアグラム（visual専用）
    container.querySelector('.add-diagram')?.addEventListener('click', function () {
      const diagramContainer = container.querySelector('.mode-visual .additional-diagrams');
      const html = `
    <div class="dynamic-item">
      <input type="text" value="" class="diagram-title" placeholder="図タイトル">
      <input type="text" value="" class="diagram-image" placeholder="画像URLまたはbase64">
      <button class="remove-btn" data-action="remove-item">削除</button>
    </div>`;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      diagramContainer.appendChild(tempDiv.firstElementChild);
    });

    // 画像アップロード
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
    container.setAttribute('data-container', 'skill-category');
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

    container.querySelector('.add-skill')?.addEventListener('click', function () {
      const skillsContainer = container.querySelector('.skill-items');
      const skillId = `skill-${categoryId}-${Date.now()}`;

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = TemplateManager.renderTemplate('skillItem', { skillId }, 'editor');

      const newItem = tempDiv.firstElementChild;
      skillsContainer.appendChild(newItem);
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
    container.setAttribute('data-container', 'strength');
    container.dataset.id = itemId;

    // データの正規化
    const normalizedData = {
      title: data?.title || '',
      description: data?.description || ''
    };

    // HTMLテンプレートを使用してコンテンツを生成
    container.innerHTML = TemplateManager.renderTemplate('strengthItem', normalizedData, 'editor');

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
    const templateMap = {
      'focus-item': 'focusItem',
      'cert-item': 'certItem',
      'project-item': 'careerProjectItem',
      'tech-item': 'techItem',
      'achievement-item': 'achievementItem'
    };

    const templateName = templateMap[className] || 'dynamicItem';

    // 一時的なコンテナを作成してHTMLを挿入
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = TemplateManager.renderTemplate(templateName, { value: value || '', className }, 'editor');

    // 新しい要素を取得
    const newItem = tempDiv.firstElementChild;

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
      document.getElementById('add-career')?.click();
      // 空のプロジェクトを1つ追加
      document.getElementById('add-project')?.click();
      // 空のスキルカテゴリを1つ追加
      document.getElementById('add-category')?.click();
      // 空の強み項目を1つ追加
      document.getElementById('add-strength')?.click();
      // 空の注力分野を1つ追加
      document.getElementById('add-focus')?.click();
      // 空の資格を1つ追加
      document.getElementById('add-certification')?.click();
    } catch (error) {
      console.error('フォームの初期化に失敗しました:', error);
    }
  }

  /**
   * 初期化処理
   */
  function init() {
    setupUnifiedRemoveHandlers();
  }

  // 公開API
  return {
    init,
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