/**
 * AI入力用プロンプトのコピー処理
 */
const PromptHandler = (function () {
  function getPrompt() {
    return document.getElementById('ai-prompt')?.textContent.trim() || '';
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    return copied;
  }

  async function copy() {
    const prompt = getPrompt();
    if (!prompt) {
      Notification.error('コピーするプロンプトが見つかりません');
      return false;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(prompt);
      } else if (!fallbackCopy(prompt)) {
        throw new Error('Clipboard API is unavailable');
      }
      Notification.success('AI用プロンプトをコピーしました');
      return true;
    } catch (error) {
      console.error('プロンプトのコピーに失敗しました:', error);
      Notification.error('プロンプトをコピーできませんでした');
      return false;
    }
  }

  return { copy, getPrompt };
})();

window.PromptHandler = PromptHandler;
