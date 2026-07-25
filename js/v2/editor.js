/**
 * js/v2/editor.js
 * Portfolio Schema v2の編集画面を制御する。
 */
(function () {
  'use strict';

  const TEMPLATE_FILES = {
    career: { url: 'templates/editor/templates.html', id: 'career-entry-template' },
    project: { url: 'templates/editor/templates.html', id: 'project-entry-template' },
    skillCategory: { url: 'templates/editor/templates.html', id: 'skill-category-template' },
    skillItem: { url: 'templates/editor/templates.html', id: 'skill-item-template' },
    strength: { url: 'templates/editor/templates.html', id: 'strength-entry-template' },
    certification: { url: 'templates/editor/templates.html', id: 'certification-entry-template' }
  };

  const state = {
    data: PortfolioSchema.createEmpty(),
    saveTimer: null
  };

  function showNotification(message, isError = false) {
    const element = document.getElementById('notification');
    element.textContent = message;
    element.classList.toggle('is-error', isError);
    element.classList.add('is-visible');
    window.setTimeout(() => element.classList.remove('is-visible'), 2600);
  }

  function linesToArray(value) {
    return String(value || '')
      .split(/\r?\n/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  function arrayToLines(value) {
    return Array.isArray(value) ? value.join('\n') : '';
  }

  function parsePipeRows(value, keys) {
    return linesToArray(value).map(line => {
      const parts = line.split('|').map(item => item.trim());
      return keys.reduce((result, key, index) => {
        result[key] = parts[index] || '';
        return result;
      }, {});
    });
  }

  function pipeRowsToText(rows, keys) {
    if (!Array.isArray(rows)) return '';
    return rows.map(row => keys.map(key => row?.[key] || '').join(' | ')).join('\n');
  }

  function getNested(object, path) {
    return path.split('.').reduce((value, key) => value?.[key], object);
  }

  function setNested(object, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key] || typeof current[key] !== 'object') current[key] = {};
      return current[key];
    }, object);
    target[lastKey] = value;
  }

  function setTemplateFields(element, data, transforms = {}) {
    element.querySelectorAll('[data-field]').forEach(field => {
      const path = field.dataset.field;
      const rawValue = getNested(data, path);
      const value = transforms[path] ? transforms[path](rawValue) : rawValue;
      field.value = value ?? '';
    });
  }

  function collectTemplateFields(element, transforms = {}) {
    const result = {};
    element.querySelectorAll('[data-field]').forEach(field => {
      const path = field.dataset.field;
      let value = field.value;
      if (field.type === 'number') value = value === '' ? null : Number(value);
      if (transforms[path]) value = transforms[path](value);
      setNested(result, path, value);
    });
    return result;
  }

  function updateItemTitles(container, label) {
    container.querySelectorAll(':scope > .item-card').forEach((element, index) => {
      const title = element.querySelector('.item-title');
      if (title) title.textContent = `${label} ${index + 1}`;
    });
  }

  function appendCareer(entry = {}) {
    const element = TemplateLoader.clone('career');
    setTemplateFields(element, entry, { highlights: arrayToLines });
    document.getElementById('career-list').appendChild(element);
    updateItemTitles(document.getElementById('career-list'), '職歴');
  }

  function appendProject(project = {}) {
    const element = TemplateLoader.clone('project');
    setTemplateFields(element, project, {
      responsibilities: arrayToLines,
      process: value => pipeRowsToText(value, ['label', 'description']),
      approaches: arrayToLines,
      deliverables: arrayToLines,
      achievements: value => pipeRowsToText(value, ['statement', 'metric', 'evidence']),
      technologies: arrayToLines,
      visuals: value => pipeRowsToText(value, ['title', 'src', 'alt'])
    });
    element.dataset.projectId = project.id || PortfolioSchema.uniqueId('project');
    document.getElementById('project-list').appendChild(element);
    updateItemTitles(document.getElementById('project-list'), 'プロジェクト');
  }

  function appendSkillItem(container, item = {}) {
    const element = TemplateLoader.clone('skillItem');
    setTemplateFields(element, item, {
      contexts: value => Array.isArray(value) ? value.join(', ') : ''
    });
    container.appendChild(element);
  }

  function appendSkillCategory(category = {}) {
    const element = TemplateLoader.clone('skillCategory');
    element.querySelector('[data-field="name"]').value = category.name || '';
    const itemsContainer = element.querySelector('.skill-items');
    const items = Array.isArray(category.items) && category.items.length ? category.items : [{}];
    items.forEach(item => appendSkillItem(itemsContainer, item));
    document.getElementById('skill-category-list').appendChild(element);
  }

  function appendStrength(item = {}) {
    const element = TemplateLoader.clone('strength');
    setTemplateFields(element, item, {
      relatedProjectIds: value => Array.isArray(value) ? value.join(', ') : ''
    });
    document.getElementById('strength-list').appendChild(element);
  }

  function appendCertification(item = {}) {
    const element = TemplateLoader.clone('certification');
    setTemplateFields(element, item);
    document.getElementById('certification-list').appendChild(element);
  }

  function setStaticFields(data) {
    document.querySelectorAll('#portfolio-form [name]').forEach(field => {
      const path = field.name;
      const value = getNested(data, path);
      if (Array.isArray(value)) {
        field.value = arrayToLines(value);
      } else {
        field.value = value ?? '';
      }
    });
  }

  function render(data) {
    state.data = PortfolioSchema.normalize(data);
    setStaticFields(state.data);

    const careerList = document.getElementById('career-list');
    const projectList = document.getElementById('project-list');
    const skillCategoryList = document.getElementById('skill-category-list');
    const strengthList = document.getElementById('strength-list');
    const certificationList = document.getElementById('certification-list');
    [careerList, projectList, skillCategoryList, strengthList, certificationList].forEach(element => {
      element.replaceChildren();
    });

    (state.data.careerEntries.length ? state.data.careerEntries : [{}]).forEach(appendCareer);
    (state.data.projects.length ? state.data.projects : [{}]).forEach(appendProject);
    (state.data.skills.categories.length ? state.data.skills.categories : [{ name: '', items: [{}] }]).forEach(appendSkillCategory);
    (state.data.strengths.length ? state.data.strengths : [{}]).forEach(appendStrength);
    state.data.certifications.forEach(appendCertification);
  }

  function collectStaticFields(data) {
    document.querySelectorAll('#portfolio-form [name]').forEach(field => {
      const path = field.name;
      const isArray = [
        'summary.experienceDomains',
        'summary.coreCapabilities',
        'summary.coreTechnologies',
        'summary.availableRoles',
        'summary.qualificationHighlights',
        'futureInterests'
      ].includes(path);
      setNested(data, path, isArray ? linesToArray(field.value) : field.value.trim());
    });
  }

  function collectCareerEntries() {
    return Array.from(document.querySelectorAll('#career-list .career-entry')).map((element, index) => {
      const entry = collectTemplateFields(element, { highlights: linesToArray });
      entry.id = state.data.careerEntries[index]?.id || PortfolioSchema.uniqueId('career');
      return entry;
    });
  }

  function collectProjects() {
    return Array.from(document.querySelectorAll('#project-list .project-entry')).map(element => {
      const project = collectTemplateFields(element, {
        responsibilities: linesToArray,
        process: value => parsePipeRows(value, ['label', 'description']),
        approaches: linesToArray,
        deliverables: linesToArray,
        achievements: value => parsePipeRows(value, ['statement', 'metric', 'evidence']),
        technologies: linesToArray,
        visuals: value => parsePipeRows(value, ['title', 'src', 'alt']).map(item => ({ type: 'image', ...item }))
      });
      project.id = element.dataset.projectId || PortfolioSchema.uniqueId('project');
      return project;
    });
  }

  function collectSkillCategories() {
    return Array.from(document.querySelectorAll('#skill-category-list .skill-category-entry')).map(categoryElement => {
      const name = categoryElement.querySelector('[data-field="name"]').value.trim();
      const items = Array.from(categoryElement.querySelectorAll('.skill-item-row')).map(itemElement => {
        return collectTemplateFields(itemElement, {
          contexts: value => value.split(',').map(item => item.trim()).filter(Boolean)
        });
      });
      return { name, items };
    });
  }

  function collectStrengths() {
    return Array.from(document.querySelectorAll('#strength-list .strength-entry')).map(element => {
      return collectTemplateFields(element, {
        relatedProjectIds: value => value.split(',').map(item => item.trim()).filter(Boolean)
      });
    });
  }

  function collectCertifications() {
    return Array.from(document.querySelectorAll('#certification-list .certification-entry'))
      .map(element => collectTemplateFields(element));
  }

  function collectData() {
    const data = PortfolioSchema.createEmpty();
    collectStaticFields(data);
    data.careerEntries = collectCareerEntries();
    data.projects = collectProjects();
    data.skills.categories = collectSkillCategories();
    data.strengths = collectStrengths();
    data.certifications = collectCertifications();
    return PortfolioSchema.normalize(data);
  }

  function saveLocal() {
    state.data = collectData();
    localStorage.setItem(PortfolioSchema.STORAGE_KEY, JSON.stringify(state.data));
  }

  function scheduleSave() {
    window.clearTimeout(state.saveTimer);
    state.saveTimer = window.setTimeout(saveLocal, 300);
  }

  function downloadJson() {
    const data = collectData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const safeName = data.profile.name || 'portfolio';
    anchor.href = url;
    anchor.download = `${safeName.replace(/\s+/g, '-')}-career-sheet.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showNotification('編集中のJSONを保存しました。');
  }

  async function copyText(text, successMessage) {
    await navigator.clipboard.writeText(text);
    showNotification(successMessage);
  }

  async function copyAiPrompt() {
    const response = await fetch('ai/prompt-template.txt', { cache: 'no-cache' });
    if (!response.ok) throw new Error('AI用プロンプトを読み込めませんでした。');
    const schemaUrl = new URL('schema.html', window.location.href).href;
    const prompt = (await response.text()).replaceAll('{{SCHEMA_URL}}', schemaUrl);
    await copyText(prompt, 'AI用プロンプトをコピーしました。');
  }

  async function copySampleJson() {
    const response = await fetch('examples/sample-portfolio.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('サンプルJSONを読み込めませんでした。');
    await copyText(await response.text(), 'サンプルJSONをコピーしました。');
  }

  async function loadJsonFile(file) {
    const text = await file.text();
    const parsed = JSON.parse(text);
    render(parsed);
    saveLocal();
    showNotification(parsed.schemaVersion ? 'JSONを読み込みました。' : '旧形式JSONをSchema v2へ変換して読み込みました。');
  }

  function activateTab(name) {
    document.querySelectorAll('.tab-button').forEach(button => {
      button.classList.toggle('is-active', button.dataset.tab === name);
    });
    document.querySelectorAll('.editor-section').forEach(section => {
      section.classList.toggle('is-active', section.dataset.section === name);
    });
    window.scrollTo({ top: document.querySelector('.editor-tabs').offsetTop - 10, behavior: 'smooth' });
  }

  function handleAction(action, target) {
    switch (action) {
      case 'add-career':
        appendCareer({ id: PortfolioSchema.uniqueId('career') });
        break;
      case 'add-project':
        appendProject({ id: PortfolioSchema.uniqueId('project'), layoutHint: 'auto' });
        break;
      case 'add-skill-category':
        appendSkillCategory({ name: '', items: [{}] });
        break;
      case 'add-skill-item':
        appendSkillItem(target.closest('.skill-category-entry').querySelector('.skill-items'), {});
        break;
      case 'add-strength':
        appendStrength({});
        break;
      case 'add-certification':
        appendCertification({});
        break;
      case 'remove-item': {
        const item = target.closest('[data-entry-type]');
        const parent = item?.parentElement;
        item?.remove();
        if (parent?.id === 'career-list') updateItemTitles(parent, '職歴');
        if (parent?.id === 'project-list') updateItemTitles(parent, 'プロジェクト');
        break;
      }
      default:
        return;
    }
    scheduleSave();
  }

  async function initialize() {
    try {
      await TemplateLoader.loadAll(TEMPLATE_FILES);
      const saved = localStorage.getItem(PortfolioSchema.STORAGE_KEY);
      render(saved ? JSON.parse(saved) : PortfolioSchema.createEmpty());

      document.querySelector('.editor-tabs').addEventListener('click', event => {
        const button = event.target.closest('.tab-button');
        if (button) activateTab(button.dataset.tab);
      });

      document.getElementById('portfolio-form').addEventListener('click', event => {
        const actionTarget = event.target.closest('[data-action]');
        if (actionTarget) handleAction(actionTarget.dataset.action, actionTarget);
      });
      document.getElementById('portfolio-form').addEventListener('input', scheduleSave);
      document.getElementById('portfolio-form').addEventListener('change', scheduleSave);

      document.getElementById('copy-ai-prompt').addEventListener('click', () => copyAiPrompt().catch(error => showNotification(error.message, true)));
      document.getElementById('copy-sample-json').addEventListener('click', () => copySampleJson().catch(error => showNotification(error.message, true)));
      document.getElementById('download-json').addEventListener('click', downloadJson);
      document.getElementById('load-json').addEventListener('change', event => {
        const [file] = event.target.files;
        if (file) loadJsonFile(file).catch(error => showNotification(`JSONの読み込みに失敗しました: ${error.message}`, true));
        event.target.value = '';
      });
      document.getElementById('open-preview').addEventListener('click', () => {
        saveLocal();
        window.open('preview.html', '_blank', 'noopener');
      });
    } catch (error) {
      showNotification(`初期化に失敗しました: ${error.message}`, true);
      console.error(error);
    }
  }

  document.addEventListener('DOMContentLoaded', initialize);
})();
