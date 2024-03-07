/**
 * @function generatePageMap()
 * 
 * 
 */
function generatePageMap() {
	const els = document.querySelectorAll('.quire-page[data-page-pdf=true]')
	let pageMap = {}
	for (let i=0;i < els.length;i++) {
		const el = els[i]
		const boxes = el.getPrinceBoxes()

		if (boxes.length < 1) { continue }

		let page = { id: el.getAttribute('data-id') || el.id,
					title: el.getAttribute('data-footer-page-title'), 
					startPage: boxes[0].pageNum - 1, 
					endPage: boxes[boxes.length-1].pageNum - 1,
			  		citation: el.getAttribute('data-cover-page-citation') || ""

				}
		let pageKey = el.getAttribute('data-id') || el.id

		pageMap[pageKey] = page 
	}

	console.log(JSON.stringify(pageMap))

}

if (Prince) {
	
	Prince.trackBoxes = true
	Prince.oncomplete = generatePageMap

}