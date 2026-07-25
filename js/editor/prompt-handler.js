/**
 * AI入力用プロンプトのコピー処理
 */
const PromptHandler = (function () {
  const PROMPT_URL = 'prompts/portfolio-json-generation.txt';
  let cachedPrompt = '';

  async function getPrompt() {
    if (cachedPrompt) return cachedPrompt;

    const response = await fetch(PROMPT_URL);
    if (!response.ok) {
      throw new Error(`Prompt file could not be loaded: ${response.status}`);
    }

    cachedPrompt = (await response.text()).trim();
    return cachedPrompt;
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
    try {
      const prompt = await getPrompt();
      if (!prompt) throw new Error('Prompt file is empty');

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
