if (Paged) {

	/**
	 * @class pageTableMapper
	 * 
	 * Responds to [paged.js afterRender hook](https://pagedjs.org/documentation/10-handlers-hooks-and-custom-javascript/) to map the PDF's page table and store it in window.pageMap
	 * 
	 */
	class pageTableMapper extends Paged.Handler {
	  constructor(chunker, polisher, caller) {
	    super(chunker, polisher, caller);
	  }

	  /**
	   * @function afterRendered - fires after all pages are laid out and PDF data is available
	   * 
	   * @param {Array<Page>} pages - Pages rendered from the document
	   */
	  afterRendered(pages) {
	  	let pageMap = {}
	  	let webpageKey

	  	// Iterate pages, build lookup by finding the website page on each PDF page
	  	for (const p of pages) {
	  		const quirePageElement = p.element.querySelector('.quire-page')

	  		if (!quirePageElement) { continue }
			if (quirePageElement.dataset.pagePdf !== 'true') { continue }

	  		const quirePageId = quirePageElement.dataset.id ?? quirePageElement.id

	  		if (webpageKey !== quirePageId) {
	  			webpageKey = quirePageId

		  		const title = quirePageElement.dataset.pdfCoverPageTitle

	  			let data = { id: webpageKey, 
	  						startPage: p.position, 
							endPage: p.position,
							title, 
	  						}

	  			pageMap[webpageKey] = data

	  		} else {
	  			pageMap[webpageKey].endPage = p.position
	  		}
	  	}

	  	window.pageMap = pageMap

	  }
	}

	Paged.registerHandlers(pageTableMapper)
}