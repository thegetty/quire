window.onload = function () {
  const canvasPanels = document.getElementsByTagName('canvas-panel')

  /**
   * Handle annotation/choice selection with canvasPanel API
   * {@link https://iiif-canvas-panel.netlify.app/docs/examples/handling-choice}
   */
  for (const canvasPanel of canvasPanels) {
    const figure = canvasPanel.closest('.q-figure, q-lightbox')
    if (!figure) return
    const inputs = figure.querySelectorAll('.annotations-ui .annotations-ui__input')
    for (const input of inputs) {
      const annotationType = input.getAttribute('data-annotation-type')
      const id = input.getAttribute('id')
      const inputType = input.getAttribute('type')
      switch (annotationType) {
        case 'choice':
          const toggleChoice = ({ checked }) => {
            canvasPanel.makeChoice(id, {
              deselect: !checked,
              deselectOthers: inputType === 'radio'
            })
            if (inputType !== 'checkbox') return
            const checkedInputs = figure.querySelectorAll('.annotations-ui__input[checked]')
            if (!checked && checkedInputs.length === 1) {
              checkedInputs[0].setAttribute('disabled', true)
            }
            if (checked) {
              const disabledInput = figure.querySelector('[disabled]')
              disabledInput ? disabledInput.removeAttribute('disabled') : null
            }
          }
          toggleChoice(input)
          input.addEventListener('click', ({ target }) => {
            toggleChoice(target)
          })
          break
        case 'annotation':
          const toggleAnnotation = ({ checked }) => {
            canvasPanel.applyStyles(id, { opacity: Number(!!checked) })
          }
          toggleAnnotation(input)
          input.addEventListener('click', ({ target }) => toggleAnnotation(target));
          break
        default:
          console.warn(`Invalid annotation type ${annotationType}`)
          break
      }
    }
  }
}
