/**
 * schemaVersion 2 の生成・読み込み・保存
 */
const JsonHandler = (function () {
  const nullable = value => value || null;
  const values = (root, selector) =>
    Array.from(root.querySelectorAll(selector)).map(input => input.value).filter(Boolean);

  function generateJSON() {
    try {
      const data = {
        schemaVersion: 2,
        title: {
          name: document.getElementById('title-name').value,
          nameReading: document.getElementById('title-name-reading').value,
          company: document.getElementById('title-company').value,
          headline: document.getElementById('title-headline').value
        },
        career: [],
        projects: [],
        skills: [],
        strengths: { items: [], focusAreas: [], certifications: [] }
      };

      document.querySelectorAll('#career-items .career-item').forEach(item => {
        data.career.push({
          period: {
            from: item.querySelector('.career-period-from').value,
            to: nullable(item.querySelector('.career-period-to').value)
          },
          company: item.querySelector('.career-company').value,
          role: item.querySelector('.career-role').value,
          summary: item.querySelector('.career-summary').value,
          highlights: values(item, '.highlight-item')
        });
      });

      document.querySelectorAll('#project-list .project-container').forEach(item => {
        data.projects.push({
          title: item.querySelector('.project-title').value,
          period: {
            from: item.querySelector('.project-period-from').value,
            to: nullable(item.querySelector('.project-period-to').value)
          },
          role: item.querySelector('.project-role').value,
          overview: item.querySelector('.project-overview').value,
          responsibilities: values(item, '.responsibility-item'),
          achievements: values(item, '.achievement-item'),
          techStack: values(item, '.tech-item'),
          image: item.querySelector('.illustration-image').value
        });
      });

      document.querySelectorAll('#skill-categories .skill-category-item').forEach(category => {
        data.skills.push({
          category: category.querySelector('.category-name').value,
          items: Array.from(category.querySelectorAll('.skill-item')).map(skill => ({
            name: skill.querySelector('.skill-name').value,
            level: skill.querySelector('.skill-level').value
          })).filter(skill => skill.name)
        });
      });

      document.querySelectorAll('#strengths-items .strength-item-container').forEach(item => {
        data.strengths.items.push({
          title: item.querySelector('.strength-title').value,
          description: item.querySelector('.strength-description').value
        });
      });
      data.strengths.focusAreas = values(document, '#future-focus-items .focus-item');
      document.querySelectorAll('#certification-items .cert-item').forEach(item => {
        const name = item.querySelector('.cert-name').value;
        if (name) data.strengths.certifications.push({
          name,
          acquiredAt: item.querySelector('.cert-acquired-at').value
        });
      });
      return data;
    } catch (error) {
      console.error('JSON生成中にエラーが発生しました:', error);
      Notification.error('データの生成に失敗しました');
      return null;
    }
  }

  async function replaceItems(containerId, items, factory) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    for (const item of items || []) container.appendChild(await factory(item));
  }

  async function loadDataIntoForm(data, options = {}) {
    const { notify = true } = options;
    if (!data || (data.schemaVersion != null && data.schemaVersion !== 2)) {
      Notification.error('schemaVersion 2 のJSONを指定してください');
      return false;
    }
    try {
      document.getElementById('title-name').value = data.title?.name || '';
      document.getElementById('title-name-reading').value = data.title?.nameReading || '';
      document.getElementById('title-company').value = data.title?.company || '';
      document.getElementById('title-headline').value = data.title?.headline || '';

      await replaceItems('career-items', data.career, FormManager.createCareerItem);
      await replaceItems('project-list', data.projects, FormManager.createProjectItem);
      await replaceItems('skill-categories', data.skills, FormManager.createSkillCategory);
      await replaceItems('strengths-items', data.strengths?.items, FormManager.createStrengthItem);

      const focus = document.getElementById('future-focus-items');
      focus.innerHTML = '';
      for (const value of data.strengths?.focusAreas || []) await FormManager.addDynamicItem(focus, value, 'focus-item');
      const certs = document.getElementById('certification-items');
      certs.innerHTML = '';
      for (const cert of data.strengths?.certifications || []) await FormManager.addDynamicItem(certs, cert, 'cert-item');
      if (notify) Notification.success('データを読み込みました');
      return true;
    } catch (error) {
      console.error('データ読み込み中にエラーが発生しました:', error);
      Notification.error('データの読み込みに失敗しました');
      return false;
    }
  }

  async function loadFromJsonString(jsonString) {
    const data = Utils.parseJson(jsonString);
    return data ? loadDataIntoForm(data) : false;
  }
  async function loadFromFile(file) {
    return loadFromJsonString(await Utils.readFileAsync(file));
  }
  function downloadJsonString(jsonString) {
    const data = Utils.parseJson(jsonString);
    if (!data) {
      Notification.error('有効なJSONを入力してください');
      return false;
    }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const link = Object.assign(document.createElement('a'), {
      href: url, download: `portfolio_data_${Utils.getTimestamp()}.json`
    });
    link.click();
    URL.revokeObjectURL(url);
    Notification.success(`${link.download} として保存しました`);
    return true;
  }
  function saveToFile() {
    const data = generateJSON();
    return data ? downloadJsonString(JSON.stringify(data)) : false;
  }
  function saveToSessionStorage() {
    const data = generateJSON();
    if (!data) return false;
    sessionStorage.setItem(Config.STORAGE_KEYS.PREVIEW_DATA, JSON.stringify(data));
    return true;
  }
  function loadFromSessionStorage() {
    return Utils.parseJson(sessionStorage.getItem(Config.STORAGE_KEYS.PREVIEW_DATA));
  }
  return {
    generateJSON, loadDataIntoForm, loadFromJsonString, loadFromFile,
    downloadJsonString, saveToFile, saveToSessionStorage, loadFromSessionStorage
  };
})();

window.JsonHandler = JsonHandler;
