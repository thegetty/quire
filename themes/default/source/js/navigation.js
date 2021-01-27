import Hammer from 'hammerjs';

class Navigation {
  constructor() {
    this.boundKeyboardListener = this.keyboardListener.bind(this)
    // this.boundSwipeListener = this.swipeListener.bind(this)
    this.addListeners()
  }

  prev() {
    let prevLink = document.getElementById('js-prev')
    prevLink && prevLink.click()
  }

  next() {
    let nextLink = document.getElementById('js-next')
    nextLink && nextLink.click()
  }

  keyboardListener(event) {
    // 37 = left arrow key
    if (event.which == 37) {
      this.prev()
      event.preventDefault()
    }
    // 39 = right arrow key
    if (event.which == 39) {
      this.next()
      event.preventDefault()
    }
  }

  swipeListener(event) {
    if (event.deltaX < 0) {
      this.next()
    } else {
      this.prev()
    }
  }

  addListeners() {
    document.addEventListener('keyup', this.boundKeyboardListener, false)

    let main = document.getElementById('main')
    this.hammer = new Hammer(main)
    this.hammer.on('swipe', this.boundSwipeListener)
  }

  removeListeners() {
    document.removeEventListener('keyup', this.boundKeyboardListener, false)
    this.hammer.destroy()
  }

  teardown() {
    this.removeListeners()
  }
}

export default Navigation
