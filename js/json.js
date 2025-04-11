// json.js
// フォームデータからJSONを生成する関数
function generateJSON() {
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
    
    // 役割マイルストーン情報（修正: クラス名の参照を正確に）
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
    
    // デバッグ用：役割マイルストーンが正しく収集されたかを確認
    console.log('役割マイルストーン収集結果:', projectData.roleMilestones);
    
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
}

// データをフォームに読み込む関数
function loadDataIntoForm(data) {
  console.log("Loading data into form:", data);
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
        (async function() {
          for (const item of data.career.careerHistory) {
            const careerItem = await createCareerItem(item);
            careerContainer.appendChild(careerItem);
          }
        })();
      } else {
        console.warn('career.careerHistory は配列ではありません');
      }
    }
    
    // テクニカルキャリアセクション
    if (data.technicalcareer) {
      const projectContainer = document.getElementById('project-list');
      projectContainer.innerHTML = '';
      
      if (Array.isArray(data.technicalcareer)) {
        // 非同期処理を同期的に実行するため、forEach ではなく for...of を使用
        (async function() {
          for (const project of data.technicalcareer) {
            // プロジェクトデータの変換
            const normalizedProject = {...project};
            
            // デバッグ用：プロジェクトデータとミルストーンを確認
            console.log('読み込むプロジェクトデータ:', normalizedProject);
            console.log('役割マイルストーン:', normalizedProject.roleMilestones);
            
            // プロジェクトアイテムを作成
            const projectItem = await createProjectItem(normalizedProject);
            projectContainer.appendChild(projectItem);
          }
        })();
      } else {
        console.warn('technicalcareer は配列ではありません');
        // 後方互換性のため、オブジェクトの場合も対応
        (async function() {
          const projectItem = await createProjectItem(data.technicalcareer);
          projectContainer.appendChild(projectItem);
        })();
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
        
        // 非同期処理を同期的に実行するため、forEach ではなく for...of を使用
        (async function() {
          for (const category of data.skills.categories) {
            const categoryItem = await createSkillCategory(category);
            categoryContainer.appendChild(categoryItem);
          }
        })();
      }
    }
    
    // 強みセクション
    if (data.strengths) {
      // 強み項目
      if (data.strengths.strengths && Array.isArray(data.strengths.strengths)) {
        const strengthsContainer = document.getElementById('strengths-items');
        strengthsContainer.innerHTML = '';
        
        // 非同期処理を同期的に実行するため、forEach ではなく for...of を使用
        (async function() {
          for (const strength of data.strengths.strengths) {
            const strengthItem = await createStrengthItem(strength);
            strengthsContainer.appendChild(strengthItem);
          }
        })();
      }
      
      // 注力分野
      if (data.strengths.futureFocus && Array.isArray(data.strengths.futureFocus)) {
        const focusContainer = document.getElementById('future-focus-items');
        focusContainer.innerHTML = '';
        
        // 非同期処理を同期的に実行
        (async function() {
          for (const focus of data.strengths.futureFocus) {
            await addDynamicItem(focusContainer, focus, 'focus-item');
          }
        })();
      }
      
      // 資格
      if (data.strengths.certifications && Array.isArray(data.strengths.certifications)) {
        const certContainer = document.getElementById('certification-items');
        certContainer.innerHTML = '';
        
        // 非同期処理を同期的に実行
        (async function() {
          for (const cert of data.strengths.certifications) {
            await addDynamicItem(certContainer, cert, 'cert-item');
          }
        })();
      }
    }
    
    return true;
  } catch (error) {
    console.error('データ読み込み中にエラーが発生しました:', error);
    showNotification('データの読み込みに失敗しました', 'error');
    return false;
  }
}

// エラー表示付き通知関数
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  if (!notification) return;
  
  // タイプによってスタイルを変更
  if (type === 'error') {
    notification.style.backgroundColor = '#e74c3c';
  } else {
    notification.style.backgroundColor = '#2ecc71';
  }
  
  notification.textContent = message;
  notification.classList.add('show');
  
  // アニメーション
  notification.style.opacity = '1';
  notification.style.transform = 'translateY(0)';
  
  // 3秒後に非表示
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      notification.classList.remove('show');
    }, 300);
  }, 3000);
}

// ゼロパディング用の関数
function padZero(num) {
  return num.toString().padStart(2, '0');
}