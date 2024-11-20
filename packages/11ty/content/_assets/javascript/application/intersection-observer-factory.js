/**
 * Intersection Observer Factory
 * 
 * Registers observer for target element with callback
 * 
 * @param  {HTMLElement}   target  Target element
 * @param  {Function}      fn      Function called when element crosses threshold
 * @param  {Object}        options IntersectionObserver options
 */
const intersectionObserverFactory = (target, fn, options = {}) => {
  const observerOptions = {
    root: document.querySelector('.quire-entry__content'),
    rootMargin: '-50% 0% -50% 0%',
    threshold: 0,
    ...options
  }
  const callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) fn()
    })
  }
  const observer = new IntersectionObserver(callback, observerOptions)
  observer.observe(target)
}
  
export { intersectionObserverFactory }
