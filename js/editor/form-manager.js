/**
 * js/editor/form-manager.js
 * フォーム要素の生成と管理を担当するモジュール（統一処理版）
 */
const FormManager = (function () {

  /**
   * 指定コンテナ内のリストが空なら、1つテンプレートで追加する
   * @param {HTMLElement} container - 追加先
   * @param {string} templateName - テンプレート名
   * @param {Object} templateData - テンプレートデータ
   */
  async function ensureListHasAtLeastOne(container, templateName, templateData = {}) {
    await TemplateManager.loadAllTemplates();
    if (container && container.children.length === 0) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = TemplateManager.renderTemplate(templateName, templateData, 'editor');
      container.appendChild(tempDiv.firstElementChild);
    }
  }

  /**
   * 統一削除処理の設定
   */
  function setupUnifiedRemoveHandlers() {
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

    // データを正規化
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

    container.innerHTML = TemplateManager.renderTemplate('careerItem', normalizedData, 'editor');

    // サブリスト：プロジェクトが空なら1つ追加（共通化）
    const projectsContainer = container.querySelector('.career-projects');
    await ensureListHasAtLeastOne(projectsContainer, 'careerProjectItem', { value: '' });

    // プロジェクト追加ボタン
    container.querySelector('.add-project')?.addEventListener('click', function () {
      const projectsContainer = container.querySelector('.career-projects');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = TemplateManager.renderTemplate('careerProjectItem', { value: '' }, 'editor');
      projectsContainer.appendChild(tempDiv.firstElementChild);
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

    container.innerHTML = TemplateManager.getTemplate('technicalProjectItem', 'editor');

    // ▼ レイアウトモードセレクタ
    const selector = container.querySelector('.layout-mode-selector');
    selector.value = data.layoutMode || 'detail';

    // ▼ 各モードごとの初期値設定
    async function populateGroupData(group, mode) {
      const simpleFieldMap = {
        '.project-title': 'projectTitle',
        '.flow-title': 'flowTitle',
        '.overview-title': 'overviewTitle',
        '.overview-text': 'overviewText',
        '.project-background': 'projectBackground',
        '.technical-approach': 'technicalApproach',
        '.implementation-details': 'implementationDetails',
        '.business-impact': 'businessImpact',
        '.illustration-image': 'illustrationImage'
      };

      Object.entries(simpleFieldMap).forEach(([selector, key]) => {
        const field = group.querySelector(selector);
        if (field && data[key] !== undefined) {
          field.value = data[key];
        }
      });

      const milestonesContainer = group.querySelector('.role-milestones');
      if (milestonesContainer) {
        if (Array.isArray(data.roleMilestones) && data.roleMilestones.length > 0) {
          milestonesContainer.innerHTML = '';
          for (const milestone of data.roleMilestones) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = TemplateManager.renderTemplate(
              mode === 'text' ? 'roleMilestoneItemText' : 'roleMilestoneItem',
              milestone,
              'editor'
            );
            milestonesContainer.appendChild(tempDiv.firstElementChild);
          }
        } else {
          await ensureListHasAtLeastOne(
            milestonesContainer,
            mode === 'text' ? 'roleMilestoneItemText' : 'roleMilestoneItem',
            {}
          );
        }
      }

      const techContainer = group.querySelector('.tech-stack');
      if (techContainer) {
        if (Array.isArray(data.techStack) && data.techStack.length > 0) {
          techContainer.innerHTML = '';
          for (const tech of data.techStack) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = TemplateManager.renderTemplate('techItem', { value: tech }, 'editor');
            techContainer.appendChild(tempDiv.firstElementChild);
          }
        } else {
          await ensureListHasAtLeastOne(techContainer, 'techItem', { value: '' });
        }
      }

      const achievementsContainer = group.querySelector('.achievements');
      if (achievementsContainer) {
        if (Array.isArray(data.achievements) && data.achievements.length > 0) {
          achievementsContainer.innerHTML = '';
          for (const achievement of data.achievements) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = TemplateManager.renderTemplate('achievementItem', { value: achievement }, 'editor');
            achievementsContainer.appendChild(tempDiv.firstElementChild);
          }
        } else {
          await ensureListHasAtLeastOne(achievementsContainer, 'achievementItem', { value: '' });
        }
      }

      const teamInfoList = group.querySelector('.team-info-list');
      if (teamInfoList && mode === 'balance') {
        if (Array.isArray(data.teamInfo) && data.teamInfo.length > 0) {
          teamInfoList.innerHTML = '';
          for (const team of data.teamInfo) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = TemplateManager.renderTemplate('teamInfoItem', team, 'editor');
            teamInfoList.appendChild(tempDiv.firstElementChild);
          }
        } else {
          await ensureListHasAtLeastOne(teamInfoList, 'teamInfoItem', {});
        }
      }

      const challengesContainer = group.querySelector('.challenges');
      if (challengesContainer && mode === 'text') {
        if (Array.isArray(data.challenges) && data.challenges.length > 0) {
          challengesContainer.innerHTML = '';
          for (const challenge of data.challenges) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = TemplateManager.renderTemplate('challengeItem', { value: challenge }, 'editor');
            challengesContainer.appendChild(tempDiv.firstElementChild);
          }
        } else {
          await ensureListHasAtLeastOne(challengesContainer, 'challengeItem', { value: '' });
        }
      }

      const diagramContainer = group.querySelector('.additional-diagrams');
      if (diagramContainer && mode === 'visual') {
        if (Array.isArray(data.additionalDiagrams) && data.additionalDiagrams.length > 0) {
          diagramContainer.innerHTML = '';
          for (const diagram of data.additionalDiagrams) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = TemplateManager.renderTemplate('diagramItem', diagram, 'editor');
            diagramContainer.appendChild(tempDiv.firstElementChild);
          }
        } else {
          await ensureListHasAtLeastOne(diagramContainer, 'diagramItem', {});
        }
      }
    }

    async function populateProjectFields() {
      const groups = container.querySelectorAll('.project-fields');
      for (const group of groups) {
        let mode = 'detail';
        if (group.classList.contains('mode-text')) {
          mode = 'text';
        } else if (group.classList.contains('mode-visual')) {
          mode = 'visual';
        } else if (
          group.classList.contains('mode-balance') &&
          !group.classList.contains('mode-detail') &&
          !group.classList.contains('mode-dense')
        ) {
          mode = 'balance';
        }
        await populateGroupData(group, mode);
      }
    }

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

    await populateProjectFields();
    selector.addEventListener('change', updateFieldsByMode);
    updateFieldsByMode();

    // ==== 各mode共通: 動的入力欄追加（テンプレート利用） ====

    container.querySelectorAll('.add-role-milestone').forEach(btn => {
      btn.addEventListener('click', async function () {
        const milestones = btn.closest('.form-group').querySelector('.role-milestones');
        const mode = btn.closest('.project-fields').classList.contains('mode-text') ? 'text' : 'other';
        const templateName = mode === 'text' ? 'roleMilestoneItemText' : 'roleMilestoneItem';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = TemplateManager.renderTemplate(templateName, {}, 'editor');
        milestones.appendChild(tempDiv.firstElementChild);
      });
    });

    container.querySelectorAll('.add-tech').forEach(btn => {
      btn.addEventListener('click', function () {
        const techContainer = btn.closest('.form-group').querySelector('.tech-stack');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = TemplateManager.renderTemplate('techItem', { value: '' }, 'editor');
        techContainer.appendChild(tempDiv.firstElementChild);
      });
    });

    container.querySelectorAll('.add-achievement').forEach(btn => {
      btn.addEventListener('click', function () {
        const achievementsContainer = btn.closest('.form-group').querySelector('.achievements');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = TemplateManager.renderTemplate('achievementItem', { value: '' }, 'editor');
        achievementsContainer.appendChild(tempDiv.firstElementChild);
      });
    });

    container.querySelector('.add-team-info')?.addEventListener('click', function () {
      const teamInfoList = container.querySelector('.team-info-list');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = TemplateManager.renderTemplate('teamInfoItem', {}, 'editor');
      teamInfoList.appendChild(tempDiv.firstElementChild);
    });

    container.querySelector('.add-challenge')?.addEventListener('click', function () {
      const challengesContainer = container.querySelector('.mode-text .challenges');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = TemplateManager.renderTemplate('challengeItem', { value: '' }, 'editor');
      challengesContainer.appendChild(tempDiv.firstElementChild);
    });

    container.querySelector('.add-diagram')?.addEventListener('click', function () {
      const diagramContainer = container.querySelector('.mode-visual .additional-diagrams');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = TemplateManager.renderTemplate('diagramItem', {}, 'editor');
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

    const templateData = {
      categoryName: data?.categoryName || '',
      items: Array.isArray(data?.items) ? data.items.map(item => ({
        name: item?.name || '',
        level: item?.level || 1
      })) : [],
      skillId: categoryId
    };

    container.innerHTML = TemplateManager.renderTemplate('skillCategory', templateData, 'editor');

    // サブリスト：スキルが空なら1つ追加（共通化）
    const skillsContainer = container.querySelector('.skill-items');
    await ensureListHasAtLeastOne(skillsContainer, 'skillItem', { skillId: `skill-${categoryId}-${Date.now()}` });

    container.querySelector('.add-skill')?.addEventListener('click', function () {
      const skillsContainer = container.querySelector('.skill-items');
      const skillId = `skill-${categoryId}-${Date.now()}`;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = TemplateManager.renderTemplate('skillItem', { skillId }, 'editor');
      skillsContainer.appendChild(tempDiv.firstElementChild);
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

    const templateMap = {
      'focus-item': 'focusItem',
      'cert-item': 'certItem',
      'project-item': 'careerProjectItem',
      'tech-item': 'techItem',
      'achievement-item': 'achievementItem'
    };

    const templateName = templateMap[className] || 'dynamicItem';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = TemplateManager.renderTemplate(templateName, { value: value || '', className }, 'editor');
    const newItem = tempDiv.firstElementChild;
    container.appendChild(newItem);
    return newItem;
  }

  /**
   * フォームの初期状態を準備
   */
  function initForm() {
    try {
      document.getElementById('add-career')?.click();
      document.getElementById('add-project')?.click();
      document.getElementById('add-category')?.click();
      document.getElementById('add-strength')?.click();
      document.getElementById('add-focus')?.click();
      document.getElementById('add-certification')?.click();
    } catch (error) {
      console.error('フォームの初期化に失敗しました:', error);
    }
  }

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
    initForm,
    ensureListHasAtLeastOne // 新規追加
  };
})();

// グローバルへのエクスポート
window.FormManager = FormManager;
