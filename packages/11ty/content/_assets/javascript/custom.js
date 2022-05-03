// Use this file to add custom JavaScript
//
// A number of JavaScript functions and libraries are included with Quire,
// to see which ones, check the files in themes/quire-starter-theme/source/js // and the list of dependencies in themes/quire-starter-theme/package.json

window.onload = function () {
  const canvasPanels = document.getElementsByTagName('canvas-panel');
  // console.log('canvas panels', canvasPanels)
  for (const canvasPanel of canvasPanels) {
    const choiceButtons = canvasPanel.closest('.q-figure').getElementsByClassName('canvas-choice')
    for (const choiceButton of choiceButtons) {
      choiceButton.addEventListener('click', (event) => {
        if (event.target.classList.contains('canvas-choice--active')) return
        for (const item of choiceButtons) {
          if (item.classList.contains('canvas-choice--active') || item === event.target) {
            item.classList.toggle('canvas-choice--active')
          }
        }
        canvasPanel.makeChoice(event.target.value)
      })
    }
  }
};
