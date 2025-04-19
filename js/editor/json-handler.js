/**
 * js/editor/json-handler.js
 * JSONデータの生成、読み込み、保存を処理するモジュール
 */
const JsonHandler = (function() {
  /**
   * フォームデータからJSONオブジェクトを生成
   * @return {Object} 生成されたJSONオブジェクト
   */
  function generateJSON() {
    try {
      const data = {
        title: {
          name: document.getElementById('title-name').value,
          nameReading: document.getElementById('title-name-reading').value,
          company: document.getElementById('title-company').value
        },
        career: {
          careerHistory: []
        },
        technicalcareer: [],
        skills: {
          skillLevelLabels: Array.from(document.querySelectorAll('.skill-level-label')).map(input => input.value),
          categories: []
        },
        strengths: {
          strengths: [],
          futureFocus: [],
          certifications: []
        }
      };
      
      // キャリア年表データ
      document.querySelectorAll('#career-items .career-item').forEach(item => {
        const careerItem = {
          period: {
            from: item.querySelector('.career-period-from').value,
            to: item.querySelector('.career-period-to').value
          },
          role: item.querySelector('.career-role').value,
          company: item.querySelector('.career-company').value,
          description: item.querySelector('.career-description').value,
          projects: Array.from(item.querySelectorAll('.project-item')).map(input => input.value)
        };
        data.career.careerHistory.push(careerItem);
      });
      
      // テクニカルキャリアデータ
      document.querySelectorAll('#project-list .project-container').forEach(project => {
        // プロジェクト基本情報
        const projectData = {
          projectTitle: project.querySelector('.project-title')?.value || '',
          flowTitle: project.querySelector('.flow-title')?.value || '',
          roleMilestones: [],
          techStack: Array.from(project.querySelectorAll('.tech-item')).map(input => input.value),
          overviewTitle: project.querySelector('.overview-title')?.value || '',
          overviewText: project.querySelector('.overview-text')?.value || '',
          achievements: Array.from(project.querySelectorAll('.achievement-item')).map(input => input.value),
          illustrationImage: project.querySelector('.illustration-image')?.value || ''
        };
        
        // 役割マイルストーン情報
        project.querySelectorAll('.role-milestones .dynamic-item').forEach(milestone => {
          const labelElement = milestone.querySelector('.role-label');
          const roleElement = milestone.querySelector('.role-title');
          const dateElement = milestone.querySelector('.role-date');
          const descriptionElement = milestone.querySelector('.role-description');
          
          // 要素が存在する場合のみ値を取得
          projectData.roleMilestones.push({
            label: labelElement ? labelElement.value : '',
            role: roleElement ? roleElement.value : '',
            date: dateElement ? dateElement.value : '',
            description: descriptionElement ? descriptionElement.value : ''
          });
        });
        
        data.technicalcareer.push(projectData);
      });
      
      // テクニカルスキルデータ
      document.querySelectorAll('#skill-categories .skill-category-item').forEach(category => {
        const categoryData = {
          categoryName: category.querySelector('.category-name')?.value || '',
          items: []
        };
        
        category.querySelectorAll('.skill-items .skill-item').forEach(skill => {
          const levelInputs = skill.querySelectorAll('input[type="radio"]');
          let level = 1;
          levelInputs.forEach(input => {
            if (input.checked) {
              level = parseInt(input.value);
            }
          });
          
          categoryData.items.push({
            name: skill.querySelector('.skill-name')?.value || '',
            level: level
          });
        });
        
        data.skills.categories.push(categoryData);
      });
      
      // 強みデータ
      document.querySelectorAll('#strengths-items .strength-item-container').forEach(item => {
        data.strengths.strengths.push({
          title: item.querySelector('.strength-title')?.value || '',
          description: item.querySelector('.strength-description')?.value || ''
        });
      });
      
      // 注力分野
      document.querySelectorAll('#future-focus-items .focus-item').forEach(item => {
        data.strengths.futureFocus.push(item.value || '');
      });
      
      // 資格
      document.querySelectorAll('#certification-items .cert-item').forEach(item => {
        data.strengths.certifications.push(item.value || '');
      });
      
      return data;
    } catch (error) {
      console.error('JSON生成中にエラーが発生しました:', error);
      Notification.error('データの生成に失敗しました');
      return null;
    }
  }
  
  /**
   * JSONデータをフォームに読み込む
   * @param {Object} data - 読み込むJSONデータ
   * @return {boolean} 読み込みの成否
   */
  async function loadDataIntoForm(data) {
    if (!data) {
      Notification.error('有効なデータが指定されていません');
      return false;
    }
    
    try {
      // タイトルセクション
      if (data.title) {
        document.getElementById('title-name').value = data.title.name || '';
        document.getElementById('title-name-reading').value = data.title.nameReading || '';
        document.getElementById('title-company').value = data.title.company || '';
      }
      
      // キャリアセクション
      if (data.career && data.career.careerHistory) {
        const careerContainer = document.getElementById('career-items');
        careerContainer.innerHTML = '';
        
        if (Array.isArray(data.career.careerHistory)) {
          // 非同期処理を同期的に実行するため、forEach ではなく for...of を使用
          for (const item of data.career.careerHistory) {
            const careerItem = await FormManager.createCareerItem(item);
            careerContainer.appendChild(careerItem);
          }
        } else {
          console.warn('career.careerHistory は配列ではありません');
        }
      }
      
      // テクニカルキャリアセクション
      if (data.technicalcareer) {
        const projectContainer = document.getElementById('project-list');
        projectContainer.innerHTML = '';
        
        if (Array.isArray(data.technicalcareer)) {
          for (const project of data.technicalcareer) {
            const projectItem = await FormManager.createProjectItem(project);
            projectContainer.appendChild(projectItem);
          }
        } else {
          console.warn('technicalcareer は配列ではありません');
          // 後方互換性のため、オブジェクトの場合も対応
          const projectItem = await FormManager.createProjectItem(data.technicalcareer);
          projectContainer.appendChild(projectItem);
        }
      }
      
      // スキルセクション
      if (data.skills) {
        // スキルレベルラベル
        if (data.skills.skillLevelLabels && Array.isArray(data.skills.skillLevelLabels)) {
          const labelInputs = document.querySelectorAll('.skill-level-label');
          data.skills.skillLevelLabels.forEach((label, index) => {
            if (index < labelInputs.length) {
              labelInputs[index].value = label || '';
            }
          });
        }
        
        // スキルカテゴリ
        if (data.skills.categories && Array.isArray(data.skills.categories)) {
          const categoryContainer = document.getElementById('skill-categories');
          categoryContainer.innerHTML = '';
          
          for (const category of data.skills.categories) {
            const categoryItem = await FormManager.createSkillCategory(category);
            categoryContainer.appendChild(categoryItem);
          }
        }
      }
      
      // 強みセクション
      if (data.strengths) {
        // 強み項目
        if (data.strengths.strengths && Array.isArray(data.strengths.strengths)) {
          const strengthsContainer = document.getElementById('strengths-items');
          strengthsContainer.innerHTML = '';
          
          for (const strength of data.strengths.strengths) {
            const strengthItem = await FormManager.createStrengthItem(strength);
            strengthsContainer.appendChild(strengthItem);
          }
        }
        
        // 注力分野
        if (data.strengths.futureFocus && Array.isArray(data.strengths.futureFocus)) {
          const focusContainer = document.getElementById('future-focus-items');
          focusContainer.innerHTML = '';
          
          for (const focus of data.strengths.futureFocus) {
            await FormManager.addDynamicItem(focusContainer, focus, 'focus-item');
          }
        }
        
        // 資格
        if (data.strengths.certifications && Array.isArray(data.strengths.certifications)) {
          const certContainer = document.getElementById('certification-items');
          certContainer.innerHTML = '';
          
          for (const cert of data.strengths.certifications) {
            await FormManager.addDynamicItem(certContainer, cert, 'cert-item');
          }
        }
      }
      
      // すべての既存プロジェクトに画像アップロード機能を適用
      ImageUploader.upgradeExistingProjects();
      
      Notification.success('データを読み込みました');
      return true;
    } catch (error) {
      console.error('データ読み込み中にエラーが発生しました:', error);
      Notification.error('データの読み込みに失敗しました');
      return false;
    }
  }
  
  /**
   * JSON文字列からデータを読み込む
   * @param {string} jsonString - JSON文字列
   * @return {boolean} 読み込みの成否
   */
  async function loadFromJsonString(jsonString) {
    try {
      const data = Utils.parseJson(jsonString);
      if (!data) {
        throw new Error('JSONの解析に失敗しました');
      }
      
      return await loadDataIntoForm(data);
    } catch (error) {
      console.error('JSON文字列の読み込みに失敗しました:', error);
      Notification.error('JSONの解析に失敗しました');
      return false;
    }
  }
  
  /**
   * ファイルからJSONデータを読み込む
   * @param {File} file - JSONファイル
   * @return {boolean} 読み込みの成否
   */
  async function loadFromFile(file) {
    try {
      const jsonString = await Utils.readFileAsync(file);
      return await loadFromJsonString(jsonString);
    } catch (error) {
      console.error('ファイルの読み込みに失敗しました:', error);
      Notification.error('ファイルの読み込みに失敗しました');
      return false;
    }
  }
  
  /**
   * 現在のデータをJSONファイルとして保存
   */
  function saveToFile() {
    try {
      const data = generateJSON();
      if (!data) {
        throw new Error('データの生成に失敗しました');
      }
      
      const jsonString = JSON.stringify(data, null, 2);
      const timestamp = Utils.getTimestamp();
      const fileName = `portfolio_data_${timestamp}.json`;
      
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
      
      Notification.success(`${fileName} として保存しました`);
      return true;
    } catch (error) {
      console.error('ファイルの保存に失敗しました:', error);
      Notification.error('ファイルの保存に失敗しました');
      return false;
    }
  }
  
  /**
   * 現在のデータをセッションストレージに一時保存（プレビュー用）
   */
  function saveToSessionStorage() {
    try {
      const data = generateJSON();
      if (!data) {
        throw new Error('データの生成に失敗しました');
      }
      
      const jsonString = JSON.stringify(data);
      sessionStorage.setItem(Config.STORAGE_KEYS.PREVIEW_DATA, jsonString);
      
      return true;
    } catch (error) {
      console.error('セッションストレージへの保存に失敗しました:', error);
      return false;
    }
  }
  
  /**
   * セッションストレージからデータを読み込む
   * @return {Object|null} 読み込んだデータまたはnull
   */
  function loadFromSessionStorage() {
    try {
      const jsonString = sessionStorage.getItem(Config.STORAGE_KEYS.PREVIEW_DATA);
      if (!jsonString) {
        return null;
      }
      
      return Utils.parseJson(jsonString);
    } catch (error) {
      console.error('セッションストレージからの読み込みに失敗しました:', error);
      return null;
    }
  }
  
  /**
   * JSONプレビューを表示/非表示
   */
  function toggleJsonPreview() {
    try {
      const data = generateJSON();
      if (!data) {
        throw new Error('データの生成に失敗しました');
      }
      
      const jsonString = JSON.stringify(data, null, 2);
      const previewElement = document.getElementById('json-preview');
      
      previewElement.textContent = jsonString;
      previewElement.style.display = previewElement.style.display === 'none' ? 'block' : 'none';
      
      if (previewElement.style.display !== 'none') {
        previewElement.scrollIntoView({ behavior: 'smooth' });
      }
      
      return true;
    } catch (error) {
      console.error('JSONプレビューの表示に失敗しました:', error);
      Notification.error('JSONプレビューの表示に失敗しました');
      return false;
    }
  }
  
  // 公開API
  return {
    generateJSON,
    loadDataIntoForm,
    loadFromJsonString,
    loadFromFile,
    saveToFile,
    saveToSessionStorage,
    loadFromSessionStorage,
    toggleJsonPreview
  };
})();

// グローバルへのエクスポート
window.JsonHandler = JsonHandler;
