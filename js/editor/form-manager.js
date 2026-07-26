/**
 * v2 スキーマ用フォーム要素管理
 */
const FormManager = (function () {
  async function ensureListHasAtLeastOne(container, templateName, templateData = {}) {
    await TemplateManager.loadAllTemplates();
    if (container && container.children.length === 0) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = TemplateManager.renderTemplate(templateName, templateData, 'editor');
      container.appendChild(wrapper.firstElementChild);
    }
  }

  function appendTemplate(container, name, data = {}) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = TemplateManager.renderTemplate(name, data, 'editor');
    container.appendChild(wrapper.firstElementChild);
  }

  function setupUnifiedRemoveHandlers() {
    document.addEventListener('click', event => {
      if (event.target.matches('[data-action="remove-item"]')) {
        event.target.closest('.dynamic-item')?.remove();
      } else if (event.target.matches('[data-action="remove-container"]')) {
        event.target.closest('[data-container]')?.remove();
      }
    });
  }

  async function createCareerItem(data = {}) {
    await TemplateManager.loadAllTemplates();
    const container = document.createElement('div');
    container.className = 'career-item';
    container.dataset.container = 'career';
    const normalized = {
      period: { from: data.period?.from || '', to: data.period?.to || '' },
      company: data.company || '',
      role: data.role || '',
      summary: data.summary || '',
      highlights: Array.isArray(data.highlights) ? data.highlights : []
    };
    container.innerHTML = TemplateManager.renderTemplate('careerItem', normalized, 'editor');
    const list = container.querySelector('.career-highlights');
    await ensureListHasAtLeastOne(list, 'careerHighlightItem', { value: '' });
    container.querySelector('.add-highlight')?.addEventListener('click', () =>
      appendTemplate(list, 'careerHighlightItem', { value: '' }));
    return container;
  }

  async function createProjectItem(data = {}) {
    await TemplateManager.loadAllTemplates();
    const container = document.createElement('div');
    container.className = 'project-container';
    container.dataset.container = 'project';
    container.innerHTML = TemplateManager.renderTemplate('technicalProjectItem', {
      ...data,
      period: { from: data.period?.from || '', to: data.period?.to || '' }
    }, 'editor');

    const listDefinitions = [
      ['.responsibilities', 'responsibilityItem', '.add-responsibility'],
      ['.achievements', 'achievementItem', '.add-achievement'],
      ['.tech-stack', 'techItem', '.add-tech']
    ];
    for (const [listSelector, template, buttonSelector] of listDefinitions) {
      const list = container.querySelector(listSelector);
      await ensureListHasAtLeastOne(list, template, { value: '' });
      container.querySelector(buttonSelector)?.addEventListener('click', () =>
        appendTemplate(list, template, { value: '' }));
    }
    ImageUploader.setup(container);
    return container;
  }

  async function createSkillCategory(data = {}) {
    await TemplateManager.loadAllTemplates();
    const container = document.createElement('div');
    container.className = 'skill-category-item';
    container.dataset.container = 'skill-category';
    container.innerHTML = TemplateManager.renderTemplate('skillCategory', {
      category: data.category || '',
      items: Array.isArray(data.items) ? data.items : []
    }, 'editor');
    const list = container.querySelector('.skill-items');
    await ensureListHasAtLeastOne(list, 'skillItem', {});
    container.querySelector('.add-skill')?.addEventListener('click', () =>
      appendTemplate(list, 'skillItem', {}));
    return container;
  }

  async function createStrengthItem(data = {}) {
    await TemplateManager.loadAllTemplates();
    const container = document.createElement('div');
    container.className = 'strength-item-container';
    container.dataset.container = 'strength';
    container.innerHTML = TemplateManager.renderTemplate('strengthItem', data, 'editor');
    return container;
  }

  async function addDynamicItem(container, value = '', className = '') {
    await TemplateManager.loadAllTemplates();
    const map = {
      'focus-item': ['focusItem', { value }],
      'cert-item': ['certItem', typeof value === 'object' ? value : { name: value, acquiredAt: '' }]
    };
    const [template, data] = map[className] || ['dynamicItem', { value, className }];
    appendTemplate(container, template, data);
    return container.lastElementChild;
  }

  function initForm() {
    ['add-career', 'add-project', 'add-category', 'add-strength', 'add-focus', 'add-certification']
      .forEach(id => document.getElementById(id)?.click());
  }

  function init() {
    setupUnifiedRemoveHandlers();
  }

  return {
    init, createCareerItem, createProjectItem, createSkillCategory,
    createStrengthItem, addDynamicItem, initForm, ensureListHasAtLeastOne
  };
})();

window.FormManager = FormManager;
