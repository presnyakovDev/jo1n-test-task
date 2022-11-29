const copyTextToClipBoard = async (text: string) => {
  if (!navigator.clipboard) {
    const copyTextarea = document.createElement('textarea');
    copyTextarea.textContent = text;
    document.body.appendChild(copyTextarea);
    copyTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(copyTextarea);
  } else {
    await navigator.clipboard.writeText(text);
  }
};

export default copyTextToClipBoard;
