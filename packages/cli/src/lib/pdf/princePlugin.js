/**
 * @function generatePageMap()
 * 
 * Walks the PDF-HTML map after printing and serializes the mapped output to STDOUT
 */
function generatePageMap() {
  
  const els = document.querySelectorAll('.quire-page[data-page-pdf=true]')
  let pageMap = {}

  for (let i=0;i < els.length;i++) {
  
    const el = els[i]
    const boxes = el.getPrinceBoxes()

    if (boxes.length < 1) { continue }

    let data = { id: el.getAttribute('data-id') || el.id, title: el.getAttribute('data-footer-page-title'), startPage: boxes[0].pageNum - 1, endPage: boxes[boxes.length-1].pageNum - 1 }

    let pageKey = el.getAttribute('data-id') || el.id

    pageMap[pageKey] = data 

    if ( el.getAttribute('data-pdf-cover-page') !== 'true' ) {
      continue
    }

  }

  console.log(JSON.stringify(pageMap))

}

Prince.trackBoxes = true
Prince.oncomplete = generatePageMap  
