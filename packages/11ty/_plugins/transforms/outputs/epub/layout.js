export default () => {
  const lang = lang ? `xml:lang="${lang}"` : ''
  const stylesheets = stylesheets.map(
    (href) => `<link rel="stylesheet" type="text/css" href="${href}" />`,
  )
  return `
        <?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" ${lang}>
        <head>
            <meta charset="utf-8" />
            <title>${pageTitle}</title>
            ${stylesheets.join("")}
            $for(header-includes)$ $header-includes$ $endfor$
        </head>
        <body id="${filename}">
            ${content}
        </body>
        </html>
    `
}
