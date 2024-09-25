const path = require('path')
const { html } = require('~lib/common-tags')

module.exports = function(eleventyConfig) {

  return function({ id, sequences, startCanvasIndex }, { interactive=true }) {
    const continuous = sequences[0].behavior.includes('continuous')
    const itemUris = sequences[0].items.map(({ uri }) => uri).join(',')
    const reverse = sequences[0].viewingDirection === 'right-to-left' 

    // @todo Why does `html` not serialize boolean values to their string equivalent?
    return html `
      <q-image-sequence 
        continuous="${continuous ? 'true' : 'false'}"
         index="${startCanvasIndex}"
         interactive="${interactive ? 'true' : 'false'}"
         items="${itemUris}"
         reverse="${reverse ? 'true' : 'false'}"
         sequence-id="${id}"
       ></q-image-sequence>
     `   
  }
}
