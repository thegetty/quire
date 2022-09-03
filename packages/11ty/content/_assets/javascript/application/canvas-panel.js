window.onload = function () {
  const canvasPanels = document.getElementsByTagName('canvas-panel')

  /**
   * Handle annotation/choice selection with canvasPanel API
   * {@link https://iiif-canvas-panel.netlify.app/docs/examples/handling-choice}
   */
  for (const canvasPanel of canvasPanels) {
    const figure = canvasPanel.closest('.q-figure')
    if (!figure) return
    const annotationInputs = figure.querySelectorAll('.annotations-ui .annotations-ui__input')
    for (const annotationInput of annotationInputs) {
      const id = annotationInput.getAttribute('id')
      const type = annotationInput.getAttribute('data-annotation-type')
      switch (type) {
        case 'choice':
          annotationInput.addEventListener('click', (event) => {
            canvasPanel.makeChoice(id)
          })
          break
        case 'annotation':
          const toggleAnnotation = (input) => {
            if (input.checked) {
              canvasPanel.applyStyles(id, { opacity: 1 })
            } else {
              canvasPanel.applyStyles(id, { opacity: 0 })
            }
          }
          toggleAnnotation(annotationInput)
          annotationInput.addEventListener('click', ({ target }) => {
            toggleAnnotation(target)
          })
          break
        default:
          console.warn(`Invalid annotation type ${type}`)
          break
      }
    }
  }
}
