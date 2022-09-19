import scrollToHash from './scroll-to-hash'

/**
 * Handle annotation/choice selection with canvasPanel API
 * {@link https://iiif-canvas-panel.netlify.app/docs/examples/handling-choice}
 * @param {HTMLElement} element
 */
const handleSelect = (element) => {
  const figure = element.closest('.q-figure')
  if (!figure) return
  const canvasPanel = figure.querySelector('canvas-panel')
  const annotationType = element.getAttribute('data-annotation-type')
  const id = element.getAttribute('id')
  const inputType = element.getAttribute('type')

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

  const toggleAnnotation = ({ checked }) => {
    canvasPanel.applyStyles(id, { opacity: Number(!!checked) })
  }

  switch (annotationType) {
    case 'choice':
      toggleChoice(element)
      break
    case 'annotation':
      toggleAnnotation(element)
      break
    default:
      console.warn(`Invalid annotation type ${annotationType}`)
      break
  }
}

/**
 * Scroll to a figure, select annotations and/or region, and update the URL
 * @param  {String} figureId    The id of the figure in figures.yaml
 * @param  {Array} annotationIds  The IIIF ids of the annotations to select
 * @param  {String} region      The canvas region
 */
const goToCanvasState = function ({ figureId, annotationIds=[], region }) {
  const figure = document.querySelector(`#${figureId}`)
  if (!figure) return
  const canvasPanel = figure.querySelector('canvas-panel')

  /**
   * Update Canvas state
   */
  if (region) canvasPanel.setAttribute('region', region)
  annotationIds.forEach((id) => {
    const input = document.getElementById(id)
    if (!input) {
      console.warn(`Invalid annotation id: ${id}`)
      return
    }
    input.checked = true
    handleSelect(input)
  })

  /**
   * Build URL
   */
  const url = new URL(window.location.pathname, window.location.origin)
  url.hash = figureId
  scrollToHash(url.hash)
  const params = new URLSearchParams(
    annotationIds.map((id) => ['annotation-id', encodeURIComponent(id)]),
  )
  region ? params.set('region', encodeURIComponent(region)) : null
  const paramsString = params.toString()
  const urlParts = [url.pathname]
  if (paramsString) urlParts.push(paramsString)
  window.history.pushState({}, '', `${urlParts.join('?')}${url.hash}`)
}

/**
 * Add event handlers to Annotations UI inputs
 */
const setUpUIEventHandlers = function() {
  const inputs = document.querySelectorAll('.annotations-ui__input')
  for (const input of inputs) {
    handleSelect(input)
    input.addEventListener('click', ({ target }) => handleSelect(target))
  }
}

export { goToCanvasState, setUpUIEventHandlers }
