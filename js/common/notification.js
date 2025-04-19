/**
 * js/common/notification.js
 * アプリケーション全体で使用する通知システム
 */
const Notification = (function() {
  // 通知タイプの設定
  const TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  };
  
  // タイプごとの背景色
  const TYPE_COLORS = {
    [TYPES.SUCCESS]: '#2ecc71',  // 緑
    [TYPES.ERROR]: '#e74c3c',    // 赤
    [TYPES.WARNING]: '#f39c12',  // オレンジ
    [TYPES.INFO]: '#3498db'      // 青
  };
  
  // 表示時間（ミリ秒）
  const DISPLAY_DURATION = 3000;
  
  /**
   * 通知を表示する
   * @param {string} message - 表示するメッセージ
   * @param {string} type - 通知タイプ（success, error, warning, info）
   * @param {number} duration - 表示時間（ミリ秒）
   */
  function show(message, type = TYPES.SUCCESS, duration = DISPLAY_DURATION) {
    const notification = document.getElementById('notification');
    let notificationEl;
    
    if (!notification) {
      // 通知要素がない場合は作成
      const newNotification = document.createElement('div');
      newNotification.id = 'notification';
      newNotification.className = 'notification';
      newNotification.style.position = 'fixed';
      newNotification.style.top = '20px';
      newNotification.style.right = '20px';
      newNotification.style.padding = '15px 20px';
      newNotification.style.color = 'white';
      newNotification.style.borderRadius = '5px';
      newNotification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      newNotification.style.opacity = '0';
      newNotification.style.transform = 'translateY(-20px)';
      newNotification.style.transition = 'opacity 0.3s, transform 0.3s';
      newNotification.style.zIndex = '1000';
      document.body.appendChild(newNotification);
      notificationEl = newNotification;
    } else {
      notificationEl = notification;
    }
    
    // タイプによってスタイルを変更
    notificationEl.style.backgroundColor = TYPE_COLORS[type] || TYPE_COLORS[TYPES.INFO];
    
    // メッセージを設定
    notificationEl.textContent = message;
    notificationEl.classList.add('show');
    
    // アニメーション
    notificationEl.style.opacity = '1';
    notificationEl.style.transform = 'translateY(0)';
    
    // 指定時間後に非表示
    setTimeout(() => {
      notificationEl.style.opacity = '0';
      notificationEl.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        notificationEl.classList.remove('show');
      }, 300);
    }, duration);
    
    return notificationEl;
  }
  
  /**
   * 成功通知を表示
   * @param {string} message - 表示するメッセージ
   * @param {number} duration - 表示時間（ミリ秒）
   */
  function success(message, duration) {
    return show(message, TYPES.SUCCESS, duration);
  }
  
  /**
   * エラー通知を表示
   * @param {string} message - 表示するメッセージ
   * @param {number} duration - 表示時間（ミリ秒）
   */
  function error(message, duration) {
    return show(message, TYPES.ERROR, duration);
  }
  
  /**
   * 警告通知を表示
   * @param {string} message - 表示するメッセージ
   * @param {number} duration - 表示時間（ミリ秒）
   */
  function warning(message, duration) {
    return show(message, TYPES.WARNING, duration);
  }
  
  /**
   * 情報通知を表示
   * @param {string} message - 表示するメッセージ
   * @param {number} duration - 表示時間（ミリ秒）
   */
  function info(message, duration) {
    return show(message, TYPES.INFO, duration);
  }
  
  // 公開API
  return {
    TYPES,
    show,
    success,
    error,
    warning,
    info
  };
})();

// グローバルへのエクスポート
window.Notification = Notification;
