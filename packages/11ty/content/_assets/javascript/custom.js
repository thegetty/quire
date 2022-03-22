// Use this file to add custom JavaScript
//
// A number of JavaScript functions and libraries are included with Quire,
// to see which ones, check the files in themes/quire-starter-theme/source/js // and the list of dependencies in themes/quire-starter-theme/package.json

window.onload = function () {
  const canvasPanels = document.getElementsByTagName('canvas-panel');

  console.log('canvas panels', canvasPanels)

  const loadChoices = async function () {
    for (const canvasPanel of canvasPanels) {
      const manifesetId = canvasPanel.getAttribute('manifest-id')
      await canvasPanel.vault.loadManifest(manifesetId);

      canvasPanel.addEventListener('choice', (event) => {
        const choicesEl = document.createElement('span');
        choicesEl.innerHTML ='This manifest has choices';
        event.target.parentNode.insertBefore(choicesEl, event.target);
      });
    }
  };

  loadChoices();
};
