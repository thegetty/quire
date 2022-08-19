window.onload = function () {
  const canvasPanels = document.getElementsByTagName('canvas-panel')

  /**
   * Handle annotation selection with canvasPanel API
   * {@link https://iiif-canvas-panel.netlify.app/docs/examples/handling-choice}
   */
  for (const canvasPanel of canvasPanels) {
    const annotationOptions = canvasPanel.closest('.q-figure').getElementsByClassName('annotation-option')
    for (const annotationOption of annotationOptions) {
      annotationOption.addEventListener('click', (event) => {
        canvasPanel.makeChoice(event.target.value)
      })
    }
  }
}
