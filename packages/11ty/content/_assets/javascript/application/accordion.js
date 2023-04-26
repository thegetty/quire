/**
 * Accordion class
 * @param {HTMLElement} element Accordion section element
 */
const Accordion = class {
    constructor(element) {
        this.copyLinkButton = element.querySelector('.accordion-section__copy-link-button')
        this.element = element
        this.id = element.getAttribute('id')
        this.globalExpand = document.querySelector('.global-accordion-expand-all')
        this.globalCollapse = document.querySelector('.global-accordion-collapse-all')
    }

    /**
     * @return {NodeList} All of this accordion's parent accordions, if accordion is nested
     */
    get parentAccordions() {
        const accordions = document.querySelectorAll('.accordion-section')
        return Array.from(accordions).filter(
            (el) => el.contains(this.element) && el != this.element
        )
    }

    /**
     * Set initial UI state on page load and initialize accordions
     */
    static setup() {
        const accordions = document.querySelectorAll('.accordion-section')
        accordions.forEach((element) => {
            const accordion = new Accordion(element)
            accordion.init()
        })
    }

    /**
     * Adds event listeners for:
     * - copy to clipboard
     * - global expand/collapse
     */
    addEventListeners() {
        this.copyLinkButton.addEventListener('click', this.copyLink.bind(this))
        if (this.globalExpand) {
            this.globalExpand.addEventListener('click', this.open.bind(this))
        }
        if (this.globalCollapse) {
            this.globalCollapse.addEventListener('click', this.close.bind(this))
        }
    }

    /**
     * Collapse accordion
     */
    close() {
        this.element.removeAttribute('open')
    }

    /**
     * Copy link to heading to clipboard
     */
    copyLink() {
        const href = this.copyLinkButton.getAttribute('value')
        const { origin, pathname } = window.location
        try {
            const url = new URL(pathname + href, origin)
            navigator.clipboard.writeText(url)
        } catch (error) {
            console.error(`Error copying heading link to clipboard: `, error)
        }
    }

    /**
     * Add event listeners and set initial state
     */
    init() {
        this.addEventListeners()
        this.setStateFromUrl()
    }

    /**
     * Expand accordion
     */
    open() {
        this.element.setAttribute('open', true)
    }

    /**
     * Sets the the initial accordion state if url contains a hash to an accordion id
     * Expands parent accordions if selected accordion is nested
     */
    setStateFromUrl() {
        const hashId = window.location.hash.replace(/^#/, '')
        if (hashId === this.id) {
            this.open()
            if (this.parentAccordions && this.parentAccordions.length) {
                this.parentAccordions.forEach((el) => el.setAttribute('open', true))
            }
        }
    }
}

export default Accordion