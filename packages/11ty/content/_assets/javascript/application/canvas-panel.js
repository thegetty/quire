window.onload = function () {
  const canvasPanels = document.getElementsByTagName('canvas-panel')

  /**
   * Handle annotation selection with canvasPanel API
   * {@link https://iiif-canvas-panel.netlify.app/docs/examples/handling-choice}
   */
  for (const canvasPanel of canvasPanels) {
    const figure = canvasPanel.closest('.q-figure')
    const annotationInputs = figure.querySelectorAll('.annotations-ui--choices .annotations-ui__input')
    for (const annotationInput of annotationInputs) {
      annotationInput.addEventListener('click', (event) => {
        const choiceId = event.target.getAttribute('id')
        canvasPanel.makeChoice(choiceId)
      })
    }
  }
}
