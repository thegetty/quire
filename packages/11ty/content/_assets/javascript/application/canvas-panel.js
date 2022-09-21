import scrollToHash from './scroll-to-hash'

/**
 * Handle annotation/choice selection with canvasPanel API
 * {@link https://iiif-canvas-panel.netlify.app/docs/examples/handling-choice}
 * @param {HTMLElement} element
 */
const handleSelect = (element) => {
  const container = element.closest('.q-figure') || element.closest('.q-lightbox-slides__slide')
  const inLightbox = document.querySelector('q-lightbox').contains(container)
  if (!container) return
  const annotationId = element.getAttribute('value')
  const annotationType = element.getAttribute('data-annotation-type')
  const canvasId = container.querySelector('canvas-panel').getAttribute('canvas-id')
  const canvasPanels = document.querySelectorAll(`[canvas-id="${canvasId}"]`)
  const elementId = element.getAttribute('id')
  const inputType = element.getAttribute('type')

  /**
   * Two-way data binding for annotaion UI inputs
   */
  if (inLightbox) {
    const inlineInput = document.querySelector(`#${elementId.split('lightbox-')[1]}`)
    inlineInput.checked = element.checked
  } else {
    const lightboxInput = document.querySelector(`#${['lightbox', elementId].join('-')}`)
    if (lightboxInput) lightboxInput.checked = element.checked
  }

  const toggleChoice = ({ checked }) => {
    canvasPanels.forEach((canvasPanel) => {
      canvasPanel.makeChoice(annotationId, {
        deselect: !checked,
        deselectOthers: inputType === 'radio'
      })
    })
    if (inputType !== 'checkbox') return
    const checkedInputs = container.querySelectorAll('.annotations-ui__input[checked]')
    if (!checked && checkedInputs.length === 1) {
      checkedInputs[0].setAttribute('disabled', true)
    }
    if (checked) {
      const disabledInput = container.querySelector('[disabled]')
      disabledInput ? disabledInput.removeAttribute('disabled') : null
    }
  }

  const toggleAnnotation = ({ checked }) => {
    canvasPanels.forEach((canvasPanel) => {
      canvasPanel.applyStyles(annotationId, { opacity: Number(!!checked) })
    })
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
const goToCanvasState = function ({ annotationIds=[], figureId, region }) {
  if (!figureId) return
  const figure = document.querySelector(`#${figureId}`)
  if (!figure) return
  const canvasPanel = figure.querySelector('canvas-panel')
  /**
   * Reset inputs
   */
  const inputs = document.querySelectorAll('.annotations-ui__input')
  for (const input of inputs) {
    input.checked = false
    handleSelect(input)
  }
  /**
   * Update Canvas state
   */
  if (region) canvasPanel.setAttribute('region', region)
  annotationIds.forEach((id) => {
    const input = document.querySelector(`input[value="${id}"]`)
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
 * Add event handlers to Annotations UI links and inputs
 */
const setUpUIEventHandlers = function() {
  const annoRefAnchorTags = document.querySelectorAll('.annoref')
  for (const anchorTag of annoRefAnchorTags) {
    let annotationIds = anchorTag.getAttribute('data-annotation-ids')
    annotationIds = annotationIds.split(',')
    const figureId = anchorTag.getAttribute('data-figure-id')
    const region = anchorTag.getAttribute('data-region')
    anchorTag.addEventListener('click', ({ target }) =>
      goToCanvasState({ annotationIds, figureId, region }),
    )
  }
  const inputs = document.querySelectorAll('.annotations-ui__input')
  for (const input of inputs) {
    handleSelect(input)
    input.addEventListener('click', ({ target }) => handleSelect(target))
  }
}

export { goToCanvasState, setUpUIEventHandlers }
