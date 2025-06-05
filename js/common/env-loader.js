/**
 * js/common/env-loader.js
 * .envファイルを読み込んでwindow.envに設定する
 */
(function() {
  var env = {};
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '.env', false); // 同期リクエスト
    xhr.send(null);
    if (xhr.status === 200) {
      xhr.responseText.split(/\n/).forEach(function(line) {
        var match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (match) {
          var key = match[1];
          var value = match[2].replace(/^['"]|['"]$/g, '');
          env[key] = value;
        }
      });
    }
  } catch (e) {
    console.warn('Could not load .env:', e);
  }
  window.env = env;
})();
