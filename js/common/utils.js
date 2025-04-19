/**
 * js/common/utils.js
 * 共通のユーティリティ関数を提供するモジュール
 */
const Utils = (function() {
  /**
   * 数値を2桁のゼロ埋め文字列に変換
   * @param {number} num - 変換する数値
   * @return {string} ゼロ埋めされた文字列
   */
  function padZero(num) {
    return num.toString().padStart(2, '0');
  }
  
  /**
   * スクリプトを非同期で読み込む
   * @param {string} url - スクリプトのURL
   * @return {Promise} スクリプト読み込み用のPromise
   */
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve(url);
      script.onerror = () => {
        console.error(`スクリプトの読み込みに失敗しました: ${url}`);
        reject(new Error(`Failed to load script: ${url}`));
      };
      document.head.appendChild(script);
    });
  }
  
  /**
   * 文字列がURLかどうかを判定
   * @param {string} str - 判定する文字列
   * @return {boolean} URLの場合はtrue
   */
  function isUrl(str) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * 文字列がBase64エンコードされた画像データかどうかを判定
   * @param {string} str - 判定する文字列
   * @return {boolean} Base64画像の場合はtrue
   */
  function isBase64Image(str) {
    return str && str.toString().startsWith('data:image/');
  }
  
  /**
   * ファイルを非同期で読み込み、Promiseを返す
   * @param {File} file - 読み込むファイルオブジェクト
   * @param {string} readAs - 読み込み方法 ('text', 'dataURL', 'arrayBuffer')
   * @return {Promise} ファイル内容を含むPromise
   */
  function readFileAsync(file, readAs = 'text') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      
      switch (readAs.toLowerCase()) {
        case 'dataurl':
          reader.readAsDataURL(file);
          break;
        case 'arraybuffer':
          reader.readAsArrayBuffer(file);
          break;
        case 'text':
        default:
          reader.readAsText(file);
      }
    });
  }
  
  /**
   * JSON文字列を安全にパースする
   * @param {string} jsonString - パースするJSON文字列
   * @param {*} defaultValue - パースに失敗した場合のデフォルト値
   * @return {object} パースされたオブジェクト、または失敗時はデフォルト値
   */
  function parseJson(jsonString, defaultValue = null) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('JSONの解析に失敗しました:', error);
      return defaultValue;
    }
  }
  
  /**
   * 現在のタイムスタンプを取得（ファイル名用）
   * @return {string} YYYYMMDD_HHMMSS形式のタイムスタンプ
   */
  function getTimestamp() {
    const now = new Date();
    const date = [
      now.getFullYear(),
      padZero(now.getMonth() + 1),
      padZero(now.getDate())
    ].join('');
    const time = [
      padZero(now.getHours()),
      padZero(now.getMinutes()),
      padZero(now.getSeconds())
    ].join('');
    
    return `${date}_${time}`;
  }

  /**
     * 画像をリサイズ・圧縮する
     * @param {string} dataUrl - 画像のData URL
     * @param {number} maxWidth - 最大幅（デフォルト800px）
     * @param {number} maxHeight - 最大高さ（デフォルト600px）
     * @param {number} quality - JPEG品質（0-1、デフォルト0.7）
     * @return {Promise<string>} 圧縮された画像のData URL
     */
  function compressImage(dataUrl, maxWidth = 800, maxHeight = 600, quality = 0.7) {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.onload = function() {
          // 元の画像サイズを取得
          let width = img.width;
          let height = img.height;
          
          // 最大サイズに合わせてリサイズ
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }
          
          // 描画用のキャンバスを作成
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          // 画像をキャンバスに描画
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // データURIに変換して返す（JPEG形式、指定された品質）
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          
          // 圧縮率をログ出力
          const originalSize = dataUrl.length;
          const compressedSize = compressedDataUrl.length;
          const compressionRatio = (compressedSize / originalSize * 100).toFixed(2);
          console.log(`画像圧縮: ${(originalSize / 1024).toFixed(2)}KB → ${(compressedSize / 1024).toFixed(2)}KB (${compressionRatio}%)`);
          
          resolve(compressedDataUrl);
        };
        
        img.onerror = function() {
          reject(new Error('画像の読み込みに失敗しました'));
        };
        
        img.src = dataUrl;
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * オブジェクトのディープコピーを作成
   * @param {object} obj - コピーするオブジェクト
   * @return {object} コピーされたオブジェクト
   */
  function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  
  // 公開API
  return {
    padZero,
    loadScript,
    isUrl,
    isBase64Image,
    readFileAsync,
    parseJson,
    getTimestamp,
    deepCopy,
    compressImage
  };
})();

// グローバルへのエクスポート
window.Utils = Utils;
