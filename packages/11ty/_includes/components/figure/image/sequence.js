const path = require('path')
const { html } = require('~lib/common-tags')

module.exports = function(eleventyConfig) {

  return function({ id, sequences, startCanvasIndex }, { interactive=true }) {
    const continuous = sequences[0].behavior.includes('continuous')
    const itemUris = sequences[0].items.map(({ uri }) => uri).join(',')
    const reverse = sequences[0].viewingDirection === 'right-to-left' 

    // TODO: Why is `html` not serializing boolean values to their string equivs?
    return html `<q-image-sequence 
                    continuous="${continuous ? 'true' : 'false'}"
                    index="${startCanvasIndex}"
                    items="${itemUris}"
                    interactive="${ interactive ? 'true' : 'false' }"
                    sequence-id="${id}"
                    reverse="${reverse ? 'true' : 'false' }"                    
                 ></q-image-sequence>`    
  }
}
