/**
 * Overrides for markdown-it-footnote plugin
 * Removes use of state.env, which allows footnotes to render within shortcodes which do not have access to the state
 * 
 * @link https://github.com/markdown-it/markdown-it-footnote/blob/master/dist/markdown-it-footnote.js
 * 
 * @param {*} state 
 * @param {*} silent 
 * @returns 
 */
// Defines footnote_ref footnote reference 
function footnoteRef(state, silent) {
  const max = state.posMax
  const start = state.pos
  let pos

  // should be at least 4 chars - "[^x]"
  if (start + 3 > max) return false

  if (state.src.charCodeAt(start) !== 0x5B/* [ */) return false
  if (state.src.charCodeAt(start + 1) !== 0x5E/* ^ */) return false

  for (pos = start + 2; pos < max; pos++) {
    if (state.src.charCodeAt(pos) === 0x20) return false
    if (state.src.charCodeAt(pos) === 0x0A) return false
    if (state.src.charCodeAt(pos) === 0x5D /* ] */) {
      break
    }
  }

  if (pos === start + 2) return false // no empty footnote labe
  if (pos >= max) return false
  pos++

  const label = state.src.slice(start + 2, pos - 1)
  const id = parseInt(label) - 1

  if (!silent) {
    let token = state.push('footnote_ref', '', 0)
    token.meta = { id, label }
  }

  state.pos = pos
  state.posMax = max
  return true
}

function footnoteTail(state) {
  if (!state.env.footnotes) return

  let current, currentLabel, insideRef, refTokens = {}
  state.tokens = state.tokens.filter(function (tok) {
    if (tok.type === 'footnote_reference_open') {
      insideRef = true
      current = []
      currentLabel = tok.meta.label
      return false
    }
    if (tok.type === 'footnote_reference_close') {
      insideRef = false
      // prepend ':' to avoid conflict with Object.prototype members
      refTokens[':' + currentLabel] = current
      return false
    }
    if (insideRef) { current.push(tok) }
    return !insideRef
  })

  let token = new state.Token('footnote_block_open', '', 1)
  state.tokens.push(token)

  let tokens
  Object.keys(refTokens).forEach((key) => {
    const current = refTokens[key]
    const label = key.replace(/:/, '')
    const id = parseInt(label) - 1
    token = new state.Token('footnote_open', '', 1)
    token.meta = { id, label }

    state.tokens.push(token)
    tokens = current
    let lastParagraph
    if (tokens) state.tokens = state.tokens.concat(tokens)
    if (state.tokens[state.tokens.length - 1].type === 'paragraph_close') {
      lastParagraph = state.tokens.pop()
    } else {
      lastParagraph = null
    }

    token = new state.Token('footnote_anchor', '', 0)
    token.meta = { id, label }
    state.tokens.push(token)

    if (lastParagraph) {
      state.tokens.push(lastParagraph)
    }

    token = new state.Token('footnote_close', '', -1)
    state.tokens.push(token)
  })

  token = new state.Token('footnote_block_close', '', -1)
  state.tokens.push(token)
}

module.exports = { footnoteRef, footnoteTail }
