import scrollToHash from './scroll-to-hash'

/**
 * Get annotation data from annotaitons UI input element
 * @param  {HTML Element} input
 * @return {Object}
 */
const annotationData = (input) => {
  return {
    checked: input.checked,
    id: input.getAttribute('value'),
    input: input.getAttribute('type'),
    type: input.getAttribute('data-annotation-type')
  }
}

/**
 * Get canvas id from child canvas-panel element
 * @param  {HTML Element} element
 * @return {String} canvasId
 */
const getCanvasId = (element) => {
  const canvasPanel = element.querySelector('canvas-panel')
  return canvasPanel && canvasPanel.getAttribute('canvas-id');
}

/**
 * Scroll to a figure, or go to figure slide in lightbox
 * Select annotations and/or region, and update the URL
 * @param  {String} figureId    The id of the figure in figures.yaml
 * @param  {Array} annotationIds  The IIIF ids of the annotations to select
 * @param  {String} region      The canvas region
 */
const goToCanvasState = function ({ annotationIds=[], figureId, region }) {
  if (!figureId) return
  const figureSelector = `#${figureId}`
  const slideSelector = `[data-lightbox-slide-id="${figureId}"]`
  const figure = document.querySelector(figureSelector)
  const figureSlide = document.querySelector(slideSelector)
  if (!figure && !figureSlide) return
  [figure, figureSlide].forEach((element) => {
    if (!element) return
    const canvasPanel = element.querySelector('canvas-panel')
    if (region && canvasPanel.getAttribute('preset') !== 'zoom') {
      console.warn(`Using the "annoref" shortcode to link to a region on a figure without zoom enabled is not supported. Please set the "preset" property to "zoom" on figure id "${figureId}"`)
    }
  })
  const inputs = document.querySelectorAll(`#${figureId} .annotations-ui__input, [data-lightbox-slide-id="${figureId}"] .annotations-ui__input`)
  const annotations = [...inputs].map((input) => {
    const id = input.getAttribute('data-annotation-id')
    input.checked = annotationIds.includes(id)
    return annotationData(input)
  })

  if (figureSlide) {
    const lightbox = figureSlide.closest('q-lightbox')
    lightbox.currentId = figureId
  }

  /**
   * Update Canvas state
   */
  const canvasId = getCanvasId(figure || figureSlide)
  update(canvasId, { annotations, region: region || 'reset' })

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
 * Handle UI changes on input select and call `update`
 */
const handleSelect = (element) => {
  const elementId = element.getAttribute('id')
  const canvasId = getCanvasId(element.closest('.q-figure, .q-lightbox-slides__slide'))
  const inLightbox = document.querySelector('q-lightbox').contains(element)
  const annotation = annotationData(element)
  const { checked, input } = annotation
  /**
   * Two-way data binding for annotaion UI inputs in lightbox and inline
   */
  if (inLightbox) {
    const inlineInput = document.querySelector(`#${elementId.split('lightbox-')[1]}`)
    if (inlineInput) inlineInput.checked = element.checked
  } else {
    const lightboxInput = document.querySelector(`#${['lightbox', elementId].join('-')}`)
    if (lightboxInput) lightboxInput.checked = element.checked
  }
  /**
   * Prevent deselecting all layers if choices and checkboxes are used together
   */
  if (input === 'checkbox') {
    const form = element.closest('form')
    const checkedInputs = form.querySelectorAll('.annotations-ui__input[checked]')
    if (!checked && checkedInputs.length === 1) {
      checkedInputs[0].setAttribute('disabled', true)
    }
    if (checked) {
      const disabledInput = form.querySelector('[disabled]')
      disabledInput ? disabledInput.removeAttribute('disabled') : null
    }
  }
  /**
   * Update canvas panel state
   */
  update(canvasId, { annotations: [annotation] })
}

/**
 * Handle annotation/choice selection with canvasPanel API
 * {@link https://iiif-canvas-panel.netlify.app/docs/examples/handling-choice}
 * @param {HTMLElement} element
 */
const selectAnnotation = (canvasPanel, annotation) => {
  const { checked, id, input, type } = annotation
  /**
   * Update annotation selection
   */
  switch (type) {
    case 'annotation':
      canvasPanel.applyStyles(id, { opacity: Number(!!checked) })
      break
    case 'choice':
      /**
       * Note: It's necessary to update the attribute *and* call `makeChoice`
       * when updating choice and region at the same time
       */
      canvasPanel.setAttribute('choice-id', id)
      canvasPanel.makeChoice(id, {
        deselect: !checked,
        deselectOthers: input === 'radio'
      })
      break
    default:
      break
  }
}

/**
 * Add event handlers to Annotations UI links and inputs
 */
const setUpUIEventHandlers = () => {
  /**
   * Add click handlers to annoRef shortcodes
   */
  const annoRefs = document.querySelectorAll('.annoref')
  for (const annoRef of annoRefs) {
    let annotationIds = annoRef.getAttribute('data-annotation-ids')
    annotationIds = annotationIds.length ? annotationIds.split(',') : undefined
    const figureId = annoRef.getAttribute('data-figure-id')
    /**
     * Annoref shortcode resets the region if none is provided
     */
    const region = annoRef.getAttribute('data-region')
    annoRef.addEventListener('click', ({ target }) =>
      goToCanvasState({ annotationIds, figureId, region })
    )
  }

  /**
   * Add click handlers to UI inputs
   */
  const inputs = document.querySelectorAll('.annotations-ui__input')  
  for (const input of inputs) {
    handleSelect(input)
    input.addEventListener('click', ({ target }) => handleSelect(target))
  }
}

/**
 * Update canvas panel properties
 * 
 * @param  {String} canvas id
 * @param  {Object} data
 * @property {String} region comma-separated, @example "x,y,width,height"
 * @property {Array<Object>} annotations
 */
const update = (canvasId, data) => {
  const canvasPanels = document.querySelectorAll(`[canvas-id="${canvasId}"]`)
  if (!canvasPanels.length) {
    console.error(`Failed to call update on canvas with id ${canvasId}. Canvas does not exist.`)
  }
  const { annotations, region } = data
  canvasPanels.forEach((canvasPanel) => {
    if (region === 'reset') {
      canvasPanel.clearTarget()
    } else if (region) {
      const [x, y, width, height] = region.split(',').map((i) => parseInt(i.trim()))
      const options = { immediate: false }
      canvasPanel.goToTarget({ x, y, width, height }, options)
    }
    annotations.forEach((annotation) => selectAnnotation(canvasPanel, annotation))
  })
}

export { goToCanvasState, setUpUIEventHandlers }
