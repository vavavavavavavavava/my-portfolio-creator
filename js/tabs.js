// tabs.js
// タブ切り替え機能
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      // アクティブなタブの切り替え
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
  
      // 対応するコンテンツの切り替え
      const tabId = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`${tabId}-section`).classList.add('active');
    });
  });
  