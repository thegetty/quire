const EventEmitter = require('events')
const util = require('util')
const fs = require('fs-extra')
const writeFile = util.promisify(fs.writeFile)
const rimraf = require('rimraf')
const sanitizeHtml = require('sanitize-html')
const path = require('path')
const pandocTemplate = require('./templates/epubTemplate')
const cheerio = require('cheerio')

// Helper Functions - Consider moving to utils
const checkFilesCreated = (dir, done) => {
  let results = []
  fs.readdir(dir, (err, list) => {
    if (err) return done(err)
    let pending = list.length
    if (!pending) return done(null, results)
    list.forEach(file => {
      file = path.resolve(dir, file)
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          checkFilesCreated(file, (err, res) => {
            results = results.concat(res)
            if (!--pending) done(null, results)
          });
        } else {
          results.push(file)
          if (!--pending) done(null, results)
        }
      })
    })
  })
}

// Helper Functions - Consider moving to utils
const epubLink = (href, linksTitles) => {
  if (href.match(/^(https|http|www)/)) {
    return href
  }

  if (href.indexOf('#') !== -1) {
    let pageLInk = href.split('#')
    for (let index = 0; index < linksTitles.length; index++) {
      let titleParts = linksTitles[index].link.replace(/[^a-zA-Z0-9 ]/g, '')
      if (pageLInk[0].replace(/[^a-zA-Z0-9 ]/g, '') === titleParts) {
        href = `#${pageLInk[1]}-${linksTitles[index].title}`
        return href
      }
    }
    return href
  }

  for (let index = 0; index < linksTitles.length; index++) {
    let titleParts = linksTitles[index].link;
    if (href === titleParts) {
      href = `#${linksTitles[index].title}`
      return href
    }
  }

  return href
}

// Helper Functions - Consider moving to utils
const sanitizeEpubHtml = (html) => {
  html = sanitizeHtml(html, {
    allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li',
      'b', 'i', 'strong', 'em', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody',
      'tr', 'th', 'td', 'dl', 'dt', 'dd', 'pre', 'html', 'title', 'iframe', 'header', 'footer', 'body',
      'form', 'img', 'meta', 'link', 'strike', 'code', 'main', 'article', 'section', 'aside', 'span', 'figure', 'sup', 'sub', 'figcaption'],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'class', 'id'],
      img: ['src', 'width', 'height', 'class', 'id'],
      iframe: ['src', 'width', 'height', 'class', 'id'],
      div: ['id', 'class'],
      main: ['id', 'class'],
      article: ['id', 'class'],
      ul: ['id', 'class'],
      ol: ['id', 'class'],
      li: ['id', 'class'],
      nav: ['id', 'class'],
      meta: ['name', 'content'],
      link: ['rel', 'href'],
      p: ['id', 'class'],
      h1: ['id', 'class'],
      h2: ['id', 'class'],
      h3: ['id', 'class'],
      h4: ['id', 'class'],
      h5: ['id', 'class'],
      h6: ['id', 'class'],
      span: ['id', 'class'],
      sup: ['id', 'class'],
      sub: ['id', 'class'],
      figure: ['id', 'class'],
      figcaption: ['id', 'class'],
      blockquote: ['id', 'class'],
      table: ['id', 'class'],
      td: ['id', 'class'],
      tr: ['id', 'class'],
      th: ['id', 'class'],
      dl: ['id', 'class'],
      dt: ['id', 'class'],
      dd: ['id', 'class'],
      html: ['id', 'class'],
      body: ['id', 'class'],
      section: ['id', 'class'],
      aside: ['id', 'class']
    },
    selfClosing: ['br', 'hr', 'area', 'base', 'basefont', 'input', 'meta', 'img'],
    allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: [],
    allowProtocolRelative: true,
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
  })
  return html
}

//Error and exit
const errorExit = (m, s) => {
  s.fail([`${m}`])
  process.exit(1)
  removeHTML()
}

class Build extends EventEmitter {

  constructor(data, spinner) {
    super()
    this.data = data
    this.spinner = spinner
    if (this.data) {
      this.buildEpubFiles(this.data, () => {
        checkFilesCreated('html/', err => {
          if (err) throw this.spinner.fail([`${err}`])
          return true
        })
      })
    }
  }

  removeHTML() {
    let dir = 'html/'
    rimraf(dir, function () {
      return true
    })
  }

  createReformatedHashLinkArrAndcreateLinkArr(arr) {
    return new Promise(function (resolve, reject) {
      if (arr === '') {
        reject(new Error('Something went wrong. Please try again.'), null)
      } else {
        let reformatedHasLinks = []
        let link_title_array = []
        arr.pages.forEach((v) => {
          let reformatedHashLinkArr = v.reformatedHashLinkArr !== undefined ? v.reformatedHashLinkArr : ''
          reformatedHasLinks.push(reformatedHashLinkArr)
          let linkTitleArr = v.linkTitleArr !== undefined ? v.linkTitleArr : ''
          link_title_array.push(linkTitleArr)
        })
        resolve([link_title_array, reformatedHasLinks])
      }
    })
  }

  buildMetadata(arr) {
    return new Promise(function (resolve, reject) {
      if (arr === '') {
        reject(new Error('Something went wrong. Please try again.'), null)
      } else if (arr['title'] === undefined || arr['title'] === null || arr['title'] === '') {
        reject(new Error('A title for your publication must be specified in the publication.yml file.'), null)
      } else if (arr['language'] === undefined || arr['language'] === null || arr['language'] === '') {
        reject(new Error('A language for your publication must be specified in the publication.yml file.'), null)
      } else {
        delete arr.pages
        let meta = ``
        for (let key in arr) {
          if (arr[key] !== undefined && arr[key] !== null && typeof arr[key] !== 'string') {
            if (arr[key].length > 0) {
              let object = arr[key]
              if (key === 'creators') {
                for (let key in object) {
                  if (object.hasOwnProperty(key)) {
                    if (object[key] !== undefined && object[key] !== null && object[key] !== '') {
                      let prop = object[key]
                      if (prop.fullname === true) {
                        meta += `<dc:creator opf:role="${prop.role}">${prop.name}</dc:creator>`
                      } else {
                        meta += `<dc:creator opf:file-as="${prop['file-as']}" opf:role="${prop.role}">${prop.name}</dc:creator>`
                      }
                    }
                  }
                }
              } else if (key === 'contributors') {
                for (let key in object) {
                  if (object.hasOwnProperty(key)) {
                    if (object[key] !== undefined && object[key] !== null && object[key] !== '') {
                      let prop = object[key]
                      if (prop.fullname === true) {
                        meta += `<dc:contributor opf:role="${prop.role}">${prop.name}</dc:contributor>`
                      } else {
                        meta += `<dc:contributor opf:file-as="${prop['file-as']}" opf:role="${prop.role}">${prop.name}</dc:contributor>`
                      }
                    }
                  }
                }
              } else {
                for (let key in object) {
                  if (object.hasOwnProperty(key)) {
                    if (object[key] !== undefined && object[key] !== null && object[key] !== '') {
                      meta += `<dc:${key}>${object[key]}</dc:${key}>`
                    }
                  }
                }
              }
            }
          } else {
            if (key !== 'title') {
              if (arr[key] !== undefined && arr[key] !== null && arr[key] !== '') {
                meta += `<dc:${key}>${arr[key]}</dc:${key}>`
              }
            }
          }
        }
        writeFile('html/dc.xml', meta)
        resolve(meta)
      }
    })
  }

  buildHTML(arr, linksTitles, hashLinks) {
    return new Promise(function (resolve, reject) {
      if (arr === '' || linksTitles === '' || hashLinks === '') {
        reject(new Error('Something went wrong. Please try again.'), null)
      } else {
        let html = []
        // console.log(arr.pages)
        arr.pages.forEach((v) => {
          let body = v.body !== undefined ? v.body : ''
          html.push(body)
        })
        let newHtml = html.join(' ')

        newHtml = sanitizeEpubHtml(newHtml)

        let epages = `
                <!DOCTYPE html>
                <html>
                  <head>
                    <title>${arr.title}</title>
                  </head>
                  <body>
                    <div>
                      ${newHtml}
                    </div>
                  </body>
                </html>
                `
        const $ = cheerio.load(epages, {
          decodeEntities: false
        })
        const updateHTML = $('html')
        let idCounts = {}

        updateHTML.find('[id]')
          .attr('id', (index, id) => {
            idCounts[id] = (idCounts[id] || 0) + 1;
            if (id.indexOf('fn-') !== -1 || id.indexOf('fnref-') !== -1) {
              return id
            }
            if (idCounts[id] > 1) {
              id = `${id}-${idCounts[id]}`
              return id
            }
            return id
          })

        updateHTML.find('.remove-from-epub, .visually-hidden, .is-screen-only, .is-print-only').remove()

        updateHTML.find('a')
          .attr('href', (index, href) => {
            return epubLink(href, linksTitles, hashLinks)
          })

        updateHTML.find('sup')
          .each((index, el) => {
            let attrs = $(el).attr()
            let innerHTML = $(el).html()
            let supClass = attrs.class !== undefined ? `class="${attrs.class}"` : ''
            let supId = attrs.id !== undefined ? `id="${attrs.id}"` : ''
            return $(el).replaceWith(`<sup><span ${supClass} ${supId}>${innerHTML}</span></sup>`)
          })

        updateHTML.find('figure')
          .each((index, el) => {
            let imgClass = $(el).find('img').attr('class') !== undefined ? `class="${$(el).find('img').attr('class')}"` : ''
            let imgId = $(el).find('img').attr('id') !== undefined ? `id="${$(el).find('img').attr('id')}"` : ''
            let imgSrc = $(el).find('img').attr('src') !== undefined ? `src="${$(el).find('img').attr('src')}"` : ''
            let figCaption = $(el).find('figcaption').html() !== null ? `<figcaption>${$(el).find('figcaption').html()}</figcaption>` : ''
            return $(el).replaceWith(`<span ${imgId}></span><figure><img ${imgSrc}/>${figCaption}</figure>`)
          })

        if (!fs.existsSync('epub/template.xhtml')) {
          writeFile('html/template.xhtml', pandocTemplate.template)
        } else {
          fs.copyFileSync('epub/template.xhtml', 'html/template.xhtml')
        }

        writeFile('html/epub.xhtml', $.html())

        resolve($.html())
      }
    })
  }

  buildEpubFiles(arr, callback) {
    //Build Folder
    // Link and Title Array
    // Reformat Hash Links
    // Build HTML and meta for EPUB
    // Callback when done
    fs.ensureDir('./html')
      .then(() => { })
    this.createReformatedHashLinkArrAndcreateLinkArr(arr)
      .then(r => {
        this.buildHTML(arr, r[0], r[1])
          .catch(err => {
            this.spinner.fail([`${err}`])
            process.exit(1)
            removeHTML()
          })
      })
      .then(() => {
        this.buildMetadata(arr)
          .catch(err => {
            this.spinner.fail([`${err}`])
            process.exit(1)
            removeHTML()
          })
      })
      .then(() => {
        callback()
      })
      .catch(err => {
        this.spinner.fail([`${err}`])
        process.exit(1)
        removeHTML()
      })
  }
}

/*
  buildEpubFiles(arr, callback) {
    //Build Folder
    // Link and Title Array
    // Reformat Hash Links
    // Build HTML and meta for EPUB
    // Callback when done
    fs.ensureDir('./html')
      .then(() => {
        console.log(`
        createReformatedHashLinkArrAndcreateLinkArr`)
        let r = this.createReformatedHashLinkArrAndcreateLinkArr(arr)
        return r
      })
      .then((r) => {
        console.log(`buildHTML`)
        return this.buildHTML(arr, r[0], r[1])
      })
      .then(() => {
        console.log(`buildMetadata`)
        return this.buildMetadata(arr)
      })
      .then(() => {
        callback()
      })
      .catch(err => {
        this.spinner.fail([`${err}`])
        process.exit(1)
        this.removeHTML()
      })
  }
}
*/

module.exports = Build
