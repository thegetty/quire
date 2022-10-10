module.exports = ({ body, language, title }) => {
  /**
   * @todo include styles, i.e.:
   * <link rel="stylesheet" type="text/css" href="epub.css" />
   */
  const stylesheets = ''
  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${language}">
      <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          ${stylesheets}
      </head>
      ${body}
    </html>
  `
}
