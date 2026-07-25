/**
 * js/v2/preview.js
 * Portfolio Schema v2をA4横スライドとして描画する。
 */
(function () {
  'use strict';

  const TEMPLATE_FILES = {
    title: { url: 'templates/preview/templates.html', id: 'title-slide-template' },
    summary: { url: 'templates/preview/templates.html', id: 'summary-slide-template' },
    career: { url: 'templates/preview/templates.html', id: 'career-slide-template' },
    projectFull: { url: 'templates/preview/templates.html', id: 'project-full-slide-template' },
    projectCompact: { url: 'templates/preview/templates.html', id: 'project-compact-slide-template' },
    projectVisual: { url: 'templates/preview/templates.html', id: 'project-visual-slide-template' },
    skills: { url: 'templates/preview/templates.html', id: 'skills-slide-template' },
    strengths: { url: 'templates/preview/templates.html', id: 'strengths-slide-template' },
    direction: { url: 'templates/preview/templates.html', id: 'direction-slide-template' }
  };

  let currentData = PortfolioSchema.createEmpty();

  function showNotification(message, isError = false) {
    const element = document.getElementById('notification');
    element.textContent = message;
    element.classList.toggle('is-error', isError);
    element.classList.add('is-visible');
    window.setTimeout(() => element.classList.remove('is-visible'), 2600);
  }

  function hasText(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function hasContent(value) {
    if (Array.isArray(value)) return value.length > 0;
    return hasText(value);
  }

  function chunk(items, size) {
    const pages = [];
    for (let index = 0; index < items.length; index += size) {
      pages.push(items.slice(index, index + size));
    }
    return pages;
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function bindText(root, name, value) {
    root.querySelectorAll(`[data-bind="${name}"]`).forEach(element => {
      element.textContent = value || '';
      if (!hasText(value)) element.hidden = true;
    });
  }

  function removeEmptyOptionalBlocks(root, data) {
    root.querySelectorAll('[data-optional]').forEach(element => {
      const key = element.dataset.optional;
      if (!hasContent(data[key])) element.remove();
    });
  }

  function addFooter(slide, name) {
    const footer = createElement('footer', 'slide-footer');
    footer.append(createElement('span', '', name || 'Career Sheet'));
    footer.append(createElement('span', 'page-number', ''));
    slide.appendChild(footer);
  }

  function renderTitle(data) {
    const slide = TemplateLoader.clone('title');
    Object.entries(data.profile).forEach(([key, value]) => bindText(slide, key, value));
    return [slide];
  }

  function appendTags(container, items, variant = '') {
    items.forEach(item => {
      container.appendChild(createElement('span', `tag ${variant}`.trim(), item));
    });
  }

  function renderSummary(data) {
    const summary = data.summary;
    const anyContent = hasText(summary.statement) || [
      summary.experienceDomains,
      summary.coreCapabilities,
      summary.coreTechnologies,
      summary.availableRoles,
      summary.qualificationHighlights
    ].some(hasContent);
    if (!anyContent) return [];

    const slide = TemplateLoader.clone('summary');
    bindText(slide, 'statement', summary.statement || '職務要約が入力されていません。');
    const variants = {
      experienceDomains: '',
      coreCapabilities: '',
      coreTechnologies: 'tech',
      availableRoles: '',
      qualificationHighlights: 'accent'
    };
    Object.entries(variants).forEach(([key, variant]) => {
      const container = slide.querySelector(`[data-list="${key}"]`);
      appendTags(container, summary[key] || [], variant);
    });
    removeEmptyOptionalBlocks(slide, summary);
    addFooter(slide, data.profile.name);
    return [slide];
  }

  function formatPeriod(period = {}) {
    const from = period.from || '';
    const to = period.to || '';
    return [from, to].filter(Boolean).join(' – ');
  }

  function createCareerRow(entry) {
    const row = createElement('article', 'career-row');
    row.appendChild(createElement('div', 'career-period', formatPeriod(entry.period) || '期間未入力'));

    const role = createElement('div', 'career-role');
    role.appendChild(createElement('strong', '', entry.role || '役割未入力'));
    role.appendChild(createElement('span', '', entry.organizationLabel || entry.industry || '所属・案件未入力'));
    row.appendChild(role);

    const detail = createElement('div', 'career-detail');
    if (entry.summary) detail.appendChild(createElement('p', '', entry.summary));
    if (entry.highlights?.length) {
      const list = createElement('ul');
      entry.highlights.forEach(item => list.appendChild(createElement('li', '', item)));
      detail.appendChild(list);
    }
    row.appendChild(detail);
    return row;
  }

  function renderCareer(data) {
    if (!data.careerEntries.length) return [];
    return chunk(data.careerEntries, 4).map(entries => {
      const slide = TemplateLoader.clone('career');
      const container = slide.querySelector('[data-list="careerEntries"]');
      entries.forEach(entry => container.appendChild(createCareerRow(entry)));
      addFooter(slide, data.profile.name);
      return slide;
    });
  }

  function projectMeta(project) {
    const values = [
      formatPeriod(project.period),
      project.role,
      project.organizationLabel,
      project.team?.size && `チーム ${project.team.size}`,
      project.team?.position
    ];
    return values.filter(hasText);
  }

  function appendMeta(container, items) {
    items.slice(0, 4).forEach(item => container.appendChild(createElement('span', 'meta-chip', item)));
  }

  function appendSimpleList(container, items) {
    items.forEach(item => container.appendChild(createElement('li', '', item)));
  }

  function appendAchievements(container, achievements) {
    achievements.forEach(achievement => {
      const item = createElement('li');
      const statement = createElement('span', '', achievement.statement || '成果');
      item.appendChild(statement);
      if (achievement.metric) {
        item.appendChild(document.createTextNode(' '));
        item.appendChild(createElement('span', 'metric', achievement.metric));
      }
      if (achievement.evidence) {
        item.appendChild(createElement('small', '', `（根拠：${achievement.evidence}）`));
      }
      container.appendChild(item);
    });
  }

  function appendTechnologies(container, technologies) {
    technologies.forEach(item => container.appendChild(createElement('span', 'tech-item', item)));
  }

  function primaryVisual(project) {
    return project.visuals?.find(visual => visual.src) || null;
  }

  function appendVisual(container, project, placeholder = true) {
    const visual = primaryVisual(project);
    if (!visual) {
      if (placeholder) container.appendChild(createElement('span', '', '画面・構成図を追加できます'));
      return;
    }
    const image = document.createElement('img');
    image.src = visual.src;
    image.alt = visual.alt || visual.title || project.title || 'プロジェクト画像';
    image.referrerPolicy = 'no-referrer';
    image.addEventListener('error', () => {
      container.replaceChildren(createElement('span', '', '画像を読み込めませんでした'));
    });
    container.appendChild(image);
  }

  function populateProjectCommon(slide, project) {
    bindText(slide, 'title', project.title || 'プロジェクト');
    bindText(slide, 'summary', project.summary);
    bindText(slide, 'organizationLabel', project.organizationLabel);
    bindText(slide, 'background', project.background);
    bindText(slide, 'visualCaption', primaryVisual(project)?.title || '');
    appendMeta(slide.querySelector('[data-list="meta"]'), projectMeta(project));

    slide.querySelectorAll('[data-list="responsibilities"]').forEach(container => appendSimpleList(container, project.responsibilities));
    slide.querySelectorAll('[data-list="approaches"]').forEach(container => appendSimpleList(container, project.approaches));
    slide.querySelectorAll('[data-list="deliverables"]').forEach(container => appendSimpleList(container, project.deliverables));
    slide.querySelectorAll('[data-list="achievements"]').forEach(container => appendAchievements(container, project.achievements));
    slide.querySelectorAll('[data-list="technologies"]').forEach(container => appendTechnologies(container, project.technologies));
    slide.querySelectorAll('[data-visual-container]').forEach(container => appendVisual(container, project, true));

    const processContainer = slide.querySelector('[data-list="process"]');
    if (processContainer) {
      const process = project.process.length
        ? project.process
        : project.responsibilities.map(item => ({ label: item, description: '' }));
      process.slice(0, 6).forEach(item => {
        const label = item.description ? `${item.label}：${item.description}` : item.label;
        processContainer.appendChild(createElement('div', 'process-step', label));
      });
    }
    removeEmptyOptionalBlocks(slide, project);
  }

  function renderProjects(data) {
    return data.projects.map(project => {
      const layout = PortfolioSchema.resolveLayout(project);
      const templateName = layout === 'visual'
        ? 'projectVisual'
        : layout === 'full' ? 'projectFull' : 'projectCompact';
      const slide = TemplateLoader.clone(templateName);
      populateProjectCommon(slide, project);
      addFooter(slide, data.profile.name);
      return slide;
    });
  }

  function proficiencyLabel(value) {
    return { core: '主力', working: '実務経験', basic: '基礎・学習' }[value] || '基礎・学習';
  }

  function skillMeta(item) {
    const values = [];
    if (item.experienceYears !== null) values.push(`実務 ${item.experienceYears}年`);
    if (item.lastUsed) values.push(`最終 ${item.lastUsed}`);
    if (item.contexts?.length) values.push(item.contexts.join(' / '));
    return values.join('・');
  }

  function createCoreSkill(item) {
    const card = createElement('article', 'core-skill');
    card.appendChild(createElement('strong', '', item.name));
    card.appendChild(createElement('span', '', skillMeta(item) || '主力として利用'));
    return card;
  }

  function createSkillCategory(category) {
    const card = createElement('article', 'skill-category-card');
    card.appendChild(createElement('h3', '', category.name || 'その他'));
    category.items.forEach(item => {
      const row = createElement('div', 'skill-line');
      const name = createElement('span', '', item.name);
      if (skillMeta(item)) name.title = skillMeta(item);
      row.appendChild(name);
      row.appendChild(createElement('span', `skill-level ${item.proficiency}`, proficiencyLabel(item.proficiency)));
      card.appendChild(row);
    });
    return card;
  }

  function renderSkills(data) {
    const categories = data.skills.categories.filter(category => category.items.length);
    if (!categories.length) return [];
    const coreItems = categories.flatMap(category => category.items).filter(item => item.proficiency === 'core');
    return chunk(categories, 6).map((categoryPage, pageIndex) => {
      const slide = TemplateLoader.clone('skills');
      const coreContainer = slide.querySelector('[data-list="coreSkills"]');
      const pageCoreItems = pageIndex === 0 ? coreItems.slice(0, 4) : [];
      pageCoreItems.forEach(item => coreContainer.appendChild(createCoreSkill(item)));
      if (!pageCoreItems.length) coreContainer.remove();

      const categoryContainer = slide.querySelector('[data-list="skillCategories"]');
      categoryPage.forEach(category => categoryContainer.appendChild(createSkillCategory(category)));
      addFooter(slide, data.profile.name);
      return slide;
    });
  }

  function createStrengthCard(strength) {
    const card = createElement('article', 'strength-card');
    card.appendChild(createElement('h3', '', strength.title || '強み'));
    if (strength.description) card.appendChild(createElement('p', '', strength.description));
    if (strength.evidence) card.appendChild(createElement('p', 'strength-evidence', strength.evidence));
    return card;
  }

  function renderStrengths(data) {
    if (!data.strengths.length) return [];
    return chunk(data.strengths, 4).map(items => {
      const slide = TemplateLoader.clone('strengths');
      const container = slide.querySelector('[data-list="strengths"]');
      items.forEach(item => container.appendChild(createStrengthCard(item)));
      addFooter(slide, data.profile.name);
      return slide;
    });
  }

  function renderDirection(data) {
    if (!data.certifications.length && !data.futureInterests.length) return [];
    const slide = TemplateLoader.clone('direction');
    const certContainer = slide.querySelector('[data-list="certifications"]');
    data.certifications.forEach(item => {
      const row = createElement('div', 'cert-row');
      row.appendChild(createElement('strong', '', item.name));
      const detail = [item.acquiredAt, item.issuer].filter(Boolean).join(' / ');
      if (detail) row.appendChild(createElement('span', '', detail));
      certContainer.appendChild(row);
    });
    if (!data.certifications.length) certContainer.appendChild(createElement('p', 'empty-message', '資格情報は未入力です。'));

    const futureContainer = slide.querySelector('[data-list="futureInterests"]');
    data.futureInterests.forEach(item => futureContainer.appendChild(createElement('div', 'future-row', item)));
    if (!data.futureInterests.length) futureContainer.appendChild(createElement('p', 'empty-message', '今後の注力分野は未入力です。'));
    addFooter(slide, data.profile.name);
    return [slide];
  }

  const sectionRenderers = {
    title: renderTitle,
    summary: renderSummary,
    career: renderCareer,
    projects: renderProjects,
    skills: renderSkills,
    strengths: renderStrengths,
    direction: renderDirection
  };

  function render(data) {
    currentData = PortfolioSchema.normalize(data);
    const container = document.getElementById('slides-container');
    container.replaceChildren();

    currentData.presentation.sectionOrder.forEach(section => {
      const renderer = sectionRenderers[section];
      if (!renderer) return;
      renderer(currentData).forEach(slide => container.appendChild(slide));
    });

    container.querySelectorAll('.slide').forEach((slide, index) => {
      const pageNumber = slide.querySelector('.page-number');
      if (pageNumber) pageNumber.textContent = `${index + 1} / ${container.querySelectorAll('.slide').length}`;
    });
  }

  async function loadJsonFile(file) {
    const parsed = JSON.parse(await file.text());
    const normalized = PortfolioSchema.normalize(parsed);
    localStorage.setItem(PortfolioSchema.STORAGE_KEY, JSON.stringify(normalized));
    render(normalized);
    showNotification(parsed.schemaVersion ? 'JSONを読み込みました。' : '旧形式JSONをSchema v2へ変換しました。');
  }

  async function initialize() {
    try {
      await TemplateLoader.loadAll(TEMPLATE_FILES);
      const saved = localStorage.getItem(PortfolioSchema.STORAGE_KEY);
      render(saved ? JSON.parse(saved) : PortfolioSchema.createEmpty());

      document.getElementById('print-portfolio').addEventListener('click', () => window.print());
      document.getElementById('preview-load-json').addEventListener('change', event => {
        const [file] = event.target.files;
        if (file) loadJsonFile(file).catch(error => showNotification(`JSONの読み込みに失敗しました: ${error.message}`, true));
        event.target.value = '';
      });
    } catch (error) {
      showNotification(`プレビューの初期化に失敗しました: ${error.message}`, true);
      console.error(error);
    }
  }

  document.addEventListener('DOMContentLoaded', initialize);
})();
