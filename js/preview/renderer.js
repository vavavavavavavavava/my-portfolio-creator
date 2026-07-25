/**
 * 通常のHTMLファイルを読み込む v2 プレビューレンダラー
 */
const Renderer = (function () {
  const templateFiles = {
    title: 'templates/preview/title.html',
    career: 'templates/preview/career.html',
    project: 'templates/preview/project.html',
    skills: 'templates/preview/skills.html',
    strengths: 'templates/preview/strengths.html'
  };
  let compiledTemplates = null;
  let currentDisplayData = null;

  Handlebars.registerHelper('displayTo', value => value || '現在');
  Handlebars.registerHelper('levelLabel', value => ({
    core: '主力', practical: '実務経験', basic: '基礎学習'
  })[value] || value);

  async function loadTemplates() {
    if (compiledTemplates) return compiledTemplates;
    const entries = await Promise.all(Object.entries(templateFiles).map(async ([name, path]) => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`テンプレートを読み込めません: ${path}`);
      return [name, Handlebars.compile(await response.text())];
    }));
    compiledTemplates = Object.fromEntries(entries);
    return compiledTemplates;
  }

  function pages(items, size) {
    if (!Array.isArray(items)) return [];
    const result = [];
    for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
    return result;
  }

  async function renderSlides(data) {
    if (!data || data.schemaVersion !== 2) throw new Error('schemaVersion 2 のJSONが必要です。');
    const templates = await loadTemplates();
    currentDisplayData = data;
    const output = [templates.title(data.title || {})];

    const careerPages = pages(data.career, 4);
    careerPages.forEach((items, index) => output.push(templates.career({
      items, pageNumber: index + 1, totalPages: careerPages.length
    })));
    (data.projects || []).forEach(project => output.push(templates.project(project)));
    const skillPages = pages(data.skills, 6);
    skillPages.forEach((items, index) => output.push(templates.skills({
      items, pageNumber: index + 1, totalPages: skillPages.length
    })));
    output.push(templates.strengths(data.strengths || {}));
    document.getElementById('slides-container').innerHTML = output.join('');
    window.currentDisplayData = data;
    return true;
  }

  function saveToPDF() {
    window.print();
  }
  function getCurrentData() {
    return currentDisplayData;
  }
  return { renderSlides, saveToPDF, getCurrentData };
})();

window.Renderer = Renderer;
