module.exports = function(eleventyConfig) {
  return function(figure) {
    const { choiceId, choices } = figure.iiif
    if (!choices || !choices.length) return
    return choices.map((item, index) => {
      const classes = ['canvas-choice']
      if (item.id === choiceId) classes.push('canvas-choice--active')
      return `
        <button class="${classes.join(' ')}" type="button" value="${item.id}">
          ${item.label.en ? item.label.en[0] : item.label}
        </button>
      `
    }).join('')
  }
}
