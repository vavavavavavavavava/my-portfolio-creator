// events.js
// 職歴、プロジェクト、スキルカテゴリ、強み、注力分野、資格追加ボタンのイベント設定
document.getElementById('add-career').addEventListener('click', async function () {
  const careerItem = await createCareerItem();
  document.getElementById('career-items').appendChild(careerItem);
});

document.getElementById('add-project').addEventListener('click', async function () {
  const projectItem = await createProjectItem();
  document.getElementById('project-list').appendChild(projectItem);
});

document.getElementById('add-category').addEventListener('click', async function () {
  const categoryItem = await createSkillCategory();
  document.getElementById('skill-categories').appendChild(categoryItem);
});

document.getElementById('add-strength').addEventListener('click', async function () {
  const strengthItem = await createStrengthItem();
  document.getElementById('strengths-items').appendChild(strengthItem);
});

document.getElementById('add-focus').addEventListener('click', async function () {
  await addDynamicItem(document.getElementById('future-focus-items'), '', 'focus-item');
});

document.getElementById('add-certification').addEventListener('click', async function () {
  await addDynamicItem(document.getElementById('certification-items'), '', 'cert-item');
});

// JSONの保存処理
document.getElementById('save-json').addEventListener('click', function () {
  const data = generateJSON();
  const jsonString = JSON.stringify(data, null, 2);

  const now = new Date();
  const timestamp = now.getFullYear() +
    padZero(now.getMonth() + 1) +
    padZero(now.getDate()) +
    padZero(now.getHours()) +
    padZero(now.getMinutes());

  const fileName = `data_${timestamp}.json`;

  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);

  showNotification(`${fileName} として保存しました！`);
});

// JSONプレビューの処理
document.getElementById('preview-json').addEventListener('click', function () {
  const data = generateJSON();
  const jsonString = JSON.stringify(data, null, 2);
  const previewElement = document.getElementById('json-preview');

  previewElement.textContent = jsonString;
  previewElement.style.display = previewElement.style.display === 'none' ? 'block' : 'none';

  if (previewElement.style.display !== 'none') {
    previewElement.scrollIntoView({ behavior: 'smooth' });
  }
});

// JSONファイル読み込みの処理
document.getElementById('load-json').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        loadDataIntoForm(data);
        showNotification('データを読み込みました！');
      } catch (error) {
        showNotification('JSONの解析に失敗しました。');
        console.error('JSON parse error:', error);
      }
    };
    reader.readAsText(file);
  }
});

// プレビューボタンのイベントリスナー
document.getElementById('preview-page').addEventListener('click', function () {
  // 現在のデータをJSON文字列として取得
  const data = generateJSON();
  const jsonString = JSON.stringify(data);

  // LocalStorageに一時的に保存 (プレビュー用)
  localStorage.setItem('preview_data', jsonString);

  // 新しいタブでpreview.htmlを開く
  window.open('preview.html?source=editor', '_blank');

  showNotification('プレビューページを開きました！');
});