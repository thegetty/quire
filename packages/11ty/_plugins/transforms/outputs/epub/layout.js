const { html } = require('~lib/common-tags')
module.exports = ({ body, language, title }) => {
  const stylesheets = ''

  const titleElement = title ? `<title>${title}</title>` : ''

  return html`
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${language}">
      <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" type="text/css" href="_assets/epub.css" />
        ${titleElement}
        ${stylesheets}
      </head>
      ${body}
    </html>
  `
}
