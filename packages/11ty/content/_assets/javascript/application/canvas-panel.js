import Accordion from './accordion'
import { intersectionObserverFactory } from './intersection-observer-factory'
import poll from './poll'
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
 * Get canvas id or info.json from child web component
 * @param  {HTML Element} element
 * @return {String} canvasId
 */
const getServiceId = (element) => {
  if (!element) return

  const canvasPanel = element.querySelector('canvas-panel')
  const imageSequence = element.querySelector('q-image-sequence')
  const imageService = element.querySelector('image-service')

  if (canvasPanel) {
    return canvasPanel.getAttribute('canvas-id')
  } else if (imageService) {
    return imageService.getAttribute('src')
  } else if (imageSequence) {
    return imageSequence.getAttribute('sequence-id')
  } else {
    // console.info(`Hash does not reference a canvas panel or image service component:`, element)
    return
  }
}

/**
 * Parse comma separated region string into target object
 * @param  {String} region @example '100,200,100,100'
 * @return {Object} target
 * @property x {Number} starting x-coordinate
 * @property y {Number} starting y-coordinate
 * @property width {Number}
 * @property height {Number}
 */
const getTarget = (region) => {
  const [x, y, width, height] = region.split(',').map((x) => parseInt(x.trim()))
  return { x, y, width, height }
}

/**
 * Scroll to a figure, or go to figure slide in lightbox
 * Select annotations and/or region, and update the URL
 * @param  {Array}   annotationIds The IIIF ids of the annotations to select
 * @param  {String}  figureId The id of the figure in figures.yaml
 * @param  {String}  historyBehavior replace||push Whether the window history should push to or replace the state
 * @param  {String}  region The canvas region
 * @param  {Object}  sequence Image sequence properties
 * @property  {Integer} index  The sequence index
 */
const goToFigureState = function ({
  annotationIds = [],
  figureId,
  historyBehavior = 'push',
  region,
  sequence = {}
}) {
  if (!figureId) {
    console.error(`goToFigureState called without an undefined figureId`)
    return
  }
  const figureSelector = `#${figureId}`
  const slideSelector = `[slot="slides"][id="${figureId}"]`
  const figure = document.querySelector(figureSelector)
  const figureSlide = document.querySelector(slideSelector)
  const serviceId = getServiceId(figure || figureSlide)

  // Do nothing if the passed figureId isn't on this page
  if (!figure && !figureSlide) return

  const lightbox = figureSlide.closest('q-lightbox')
  lightbox.currentId = figureId

  // Done if there's no service to annotate / target
  if (!serviceId) return

  const inputs = document.querySelectorAll(`#${figureId} .annotations-ui__input, [slot="slides"][id="${figureId}"] .annotations-ui__input`)
  const annotations = [...inputs].map((input) => {
    const id = input.getAttribute('data-annotation-id')
    input.checked = annotationIds.includes(id)
    return annotationData(input)
  })

  /**
   * Open parent accordions if figure is within an accordion
   */
  Accordion.elements.forEach((element) => {
    if (element.contains(figure)) element.setAttribute('open', true)
  })

  /**
   * Update figure state -- wrapped in a timeout to allow for off-page 
   */
  update(serviceId, { annotations, region: region || 'reset', sequence })

  /**
   * Build URL
   */
  const url = new URL(window.location.pathname, window.location.origin)
  url.hash = figureId
  scrollToHash(url.hash)

  /** 
   * Build params
   */
  const params = new URLSearchParams(
    annotationIds.map((id) => ['annotation-id', encodeURIComponent(id)])
  )
  region ? params.set('region', encodeURIComponent(region)) : null
  Number.isInteger(parseInt(sequence.index)) ? params.set('sequence-index', encodeURIComponent(sequence.index)) : null

  const paramsString = params.toString()
  const urlParts = [url.pathname]
  if (paramsString) urlParts.push(paramsString)

  /**
   * Update window.history
   */
  const historyArgs = [{}, '', `${urlParts.join('?')}${url.hash}`]
  if (historyBehavior === 'replace') {
    window.history.replaceState(...historyArgs)
  } else {
    window.history.pushState(...historyArgs)
  }
}

/**
 * Handle UI changes on input select and call `update`
 */
const handleSelect = (element) => {
  const elementId = element.getAttribute('id')
  const serviceId = getServiceId(element.closest('.q-figure, .q-lightbox-slides__slide'))
  const inLightbox = document.querySelector('q-lightbox').contains(element)
  const annotation = annotationData(element)
  const { checked, input, type } = annotation
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
  if (input === 'checkbox' && type === 'choice') {
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
   * Update figure state
   */
  update(serviceId, { annotations: [annotation] })
}

/**
 * Handle annotation/choice selection with canvasPanel API
 * {@link https://iiif-canvas-panel.netlify.app/docs/examples/handling-choice}
 * @param {HTMLElement} element
 */
const selectAnnotation = (canvasPanel, annotation) => {
  const { checked, id, type } = annotation
  /**
   * Update annotation selection
   */
  switch (type) {
    case 'annotation':
      canvasPanel.applyStyles(id, { opacity: Number(!!checked) })
      break
    case 'choice':
      /**
       * `canvasPanel.makeChoice` is defined asynchronously on the web component,
       * and while the event model emits a 'choice' event when a choice is selected, it is noisy,
       * and since there is no 'done' event to indicate when this method is available,
       * we will use polling
       */
      poll({
        callback: () => selectChoice(canvasPanel, annotation),
        validate: () => !!canvasPanel.makeChoice
      })
      break
    default:
      break
  }
}

const selectChoice = (canvasPanel, annotation) => {
  const { checked, id, input } = annotation
  /**
   * Note: It's necessary to update the attribute *and* call `makeChoice`
   * when updating choice and region at the same time
   */
  canvasPanel.setAttribute('choice-id', id)
  canvasPanel.makeChoice(id, {
    deselect: !checked,
    deselectOthers: input === 'radio'
  })
}

/**
 * Add event handlers to Annotations UI links and inputs
 */
const setUpUIEventHandlers = () => {
  /**
   * Add click handlers to ref shortcodes
   */
  const refs = document.querySelectorAll('.ref')
  for (const ref of refs) {
    let annotationIds = ref.getAttribute('data-annotation-ids')
    annotationIds = annotationIds.length ? annotationIds.split(',') : undefined
    const figureId = ref.getAttribute('data-figure-id')
    const sequence = {
      index: parseInt(ref.getAttribute('data-sequence-index')),
      transition: parseInt(ref.getAttribute('data-sequence-transition')),
    }
    /**
     * ref shortcode resets the region if none is provided
     */
    const region = ref.getAttribute('data-region')

    const onscroll = ref.getAttribute('data-on-scroll')
    if (onscroll === 'true') {
      const callback = () =>
        goToFigureState({
          annotationIds,
          figureId,
          historyBehavior: 'replace',
          region,
          sequence
        })
      intersectionObserverFactory(ref, callback)
    } else {
      ref.addEventListener('click', ({ target }) =>
        goToFigureState({ annotationIds, figureId, region, sequence })
      )
    }
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
 * Update canvas panel or image-service properties
 *
 * @param  {String} id Canvas ID or path to image-service info.json
 * @param  {Object} data
 * @property {String} region comma-separated, @example "x,y,width,height"
 * @property {Array<Object>} annotations
 */
const update = (id, data) => {
  const webComponents = document.querySelectorAll(`canvas-panel[canvas-id="${id}"], image-service[src="${id}"], q-image-sequence[sequence-id="${id}"]`)
  if (!webComponents.length) {
    console.error(`Failed to call update on canvas panel or image-service component with id ${id}. Element does not exist.`)
  }
  const { annotations, region } = data
  
  webComponents.forEach((element) => {

    const isImageSequence = element.tagName.toLowerCase() === 'q-image-sequence'

    if (isImageSequence) {
      updateSequenceIndex(element, data)
    }

    if (region && !isImageSequence) {
      const target = region && region !== 'reset'
        ? getTarget(region)
        : getTarget(element.getAttribute('region'))

      const transition =  { easing: element.easingFunctions().easeOutExpo, duration: 2000 }
      const regionTransition = () => {
        element.transition(tm => {
          tm.goToRegion(target, { transition })
        })         
      } 
      setTimeout( regionTransition() ,500)

    }

    if (Array.isArray(annotations)) {
      annotations.forEach((annotation) => selectAnnotation(element, annotation))
    }
  })
}

/**
 * Rotates the image to a the provided index by iterating over each sequence item step
 * and updating the index property on the image sequence element
 * 
 * @param {HTMLElement} element Image sequence element
 * @param {Object} data Property values to update on the image sequence element
 */
const updateSequenceIndex = (element, { sequence={} }) => {
  const { index, transition } = sequence
  const startIndex = parseInt(element.getAttribute('index'))
  const endIndex = parseInt(index)
  if (Number.isInteger(endIndex) && endIndex >= 0 && startIndex !== endIndex) {
    /**
     * Set transition speed from ref property and rotate to index
     */
    if (transition) {
      element.setAttribute('transition', transition)
      element.setAttribute('rotate-to-index', endIndex)
      return
    }
    /**
     * Cancel current animation if one is running and jump to index
     */
    element.setAttribute('rotate-to-index', false)
    element.setAttribute('index', endIndex)
  }
}

export { goToFigureState, setUpUIEventHandlers }
