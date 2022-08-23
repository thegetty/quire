window.onload = function () {
  const canvasPanels = document.getElementsByTagName('canvas-panel')

  /**
   * Handle annotation/choice selection with canvasPanel API
   * {@link https://iiif-canvas-panel.netlify.app/docs/examples/handling-choice}
   */
  for (const canvasPanel of canvasPanels) {
    const figure = canvasPanel.closest('.q-figure')
    const annotationInputs = figure.querySelectorAll('.annotations-ui .annotations-ui__input')
    for (const annotationInput of annotationInputs) {
      annotationInput.addEventListener('click', (event) => {
        const id = event.target.getAttribute('id')
        const type = annotationInput.getAttribute('data-annotation-type')
        switch (type) {
          case 'choice':
            canvasPanel.makeChoice(id)
            break
          case 'annotation':
            // @todo select annotation
            break
          default:
            console.warn(`Invalid annotation type ${type}`)
            break
        }
      })
    }
  }
}
