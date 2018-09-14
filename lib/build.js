const EventEmitter = require('events')
const util = require('util')
const fs = require('fs-extra')
const writeFile = util.promisify(fs.writeFile)
const rimraf = require('rimraf')
const sanitizeHtml = require('sanitize-html')
const path = require('path')
const pandocTemplate = require('./templates/epubTemplate')
const cheerio = require('cheerio')

// Need to rework this
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

class Build extends EventEmitter {

    constructor(data) {
        super()
        this.data = data
        if (this.data) {
            this.buildEpubFiles(this.data, () => {
                checkFilesCreated('html/', err => {
                    if (err) throw err;
                    return true
                })
            })
        }
    }

    sanitizeEpubHtml(html) {
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

    removeHTML(doc) {
        let dir = 'html/'
        doc = doc !== '' ? doc : 'quire'
        rimraf(dir, function () {
            // console.log(`${doc} done`)
            return true
        })
    }

    makedirectory(filePath) {
        if (fs.existsSync(filePath)) {
            return true;
        }
        fs.mkdirSync(filePath);
    }

    createLinkArr(arr) {
        let link_title_array = []
        arr.pages.forEach((v) => {
            let linkTitleArr = v.linkTitleArr !== undefined ? v.linkTitleArr : ''
            link_title_array.push(linkTitleArr)
        })
        return link_title_array
    }

    createReformatedHashLinkArr(arr) {
        let reformatedHasLinks = []
        arr.pages.forEach((v) => {
            let reformatedHashLinkArr = v.reformatedHashLinkArr !== undefined ? v.reformatedHashLinkArr : ''
            reformatedHasLinks.push(reformatedHashLinkArr)
        })
        return reformatedHasLinks
    }

    epubLink(href, linksTitles) {
        if (href.match(/^(https|http|www)/)) {
            return href
        }
        if (href.indexOf('#') !== -1) {
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

    buildMetadata(arr) {
        delete arr.pages
        let meta = ``
        for (let key in arr) {
            if (arr[key] !== undefined && arr[key] !== null && typeof arr[key] !== 'string') {
                if (arr[key].length > 0) {
                    let object = arr[key]
                    if (key === 'creators') {
                        for (let key in object) {
                            if (object.hasOwnProperty(key)) {
                                const prop = object[key]
                                meta += `<dc:creator opf:file-as="${prop['file-as']}" opf:role="${prop.role}">${prop.name}</dc:creator>`
                            }
                        }
                    } else if (key === 'contributors') {
                        for (let key in object) {
                            if (object.hasOwnProperty(key)) {
                                const prop = object[key]
                                meta += `<dc:contributor opf:file-as="${prop['file-as']}" opf:role="${prop.role}">${prop.name}</dc:contributor>`
                            }
                        }
                    } else {
                        for (let key in object) {
                            if (object.hasOwnProperty(key)) {
                                const prop = object[key];
                                meta += `<dc:${key}>${object[key]}</dc:${key}>`
                            }
                        }
                    }
                }
            } else {
                if (key !== 'title') {
                    meta += `<dc:${key}>${arr[key]}</dc:${key}>`
                }
            }
        }
        writeFile('html/dc.xml', meta)
        return meta
    }

    buildEpubFiles(arr, callback) {

        this.makedirectory('./html')

        let html = []

        let linksTitles = this.createLinkArr(arr)
        let hashLinks = this.createReformatedHashLinkArr(arr)

        arr.pages.forEach((v) => {
            let body = v.body !== undefined ? v.body : ''
            html.push(body)
        })

        // write dc.xml
        this.buildMetadata(arr)

        let newHtml = html.join(' ')

        newHtml = this.sanitizeEpubHtml(newHtml)

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
                if (id.indexOf('fn-') !== -1 || id.indexOf('fnref-') !== -1 || id.match(/^\d/)) {
                    return id
                }
                if (idCounts[id] > 1) {
                    id = `${id}-${idCounts[id]}`
                    return id
                }
                return id
            })

        updateHTML.find('a')
            .not((index, el) => {
                return $(el).attr('href').match(/^#/)
            })
            .attr('href', (index, href) => {
                return this.epubLink(href, linksTitles, hashLinks)
            })

        updateHTML.find('sup')
            .each((index, el) => {
                let attrs = $(el).attr()
                let text = $(el).html()
                return $(el).replaceWith(`<sup><span class="${attrs.class}" id="${attrs.id}">${text}</span></sup>`)
            })

        if (!fs.existsSync('epub/template.xhtml')) {
            writeFile('html/template.xhtml', pandocTemplate.template)
        } else {
            fs.copyFileSync('epub/template.xhtml', 'html/template.xhtml')
        }

        writeFile('html/epub.xhtml', $.html())

        callback()
    }

}

module.exports = Build