const EventEmitter = require('events')
const util = require('util')
const fs = require('fs')
const writeFile = util.promisify(fs.writeFile)
const rimraf = require('rimraf')
const sanitizeHtml = require('sanitize-html')
const path = require('path')
const pandocTemplate = require('./templates/epubTemplate')


class Build extends EventEmitter {

    constructor(data) {
        super()
        this.data = data
        if (this.data) {
            this.build(this.data)
        }
    }

    makedirectory(filePath) {
        if (fs.existsSync(filePath)) {
            return true;
        }
        fs.mkdirSync(filePath);
    }


    sanitizeEpubHtml(html) {
        html = sanitizeHtml(html, {
            allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li',
                'b', 'i', 'strong', 'em', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody',
                'tr', 'th', 'td', 'dl', 'dt', 'dd', 'pre', 'html', 'title', 'iframe', 'header', 'footer', 'body',
                'form', 'img', 'meta', 'link', 'strike', 'code', 'main', 'article', 'section', 'aside', 'span', 'figure', 'sup', 'sub'],
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

    walk(dir, done) {
        let results = []
        fs.readdir(dir, (err, list) => {
            if (err) return done(err)
            let pending = list.length
            if (!pending) return done(null, results)
            list.forEach(file => {
                file = path.resolve(dir, file)
                fs.stat(file, (err, stat) => {
                    if (stat && stat.isDirectory()) {
                        walk(file, (err, res) => {
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

    buildEpubFiles(arr) {

        this.makedirectory('./html')

        let html = []

        arr.pages.forEach((v) => {
            let body = v.body !== undefined ? v.body : ''
            html.push(body)
        })

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

        if (!fs.existsSync('epub/metadata.yml')) {
            let creators = ``
            arr.creators.forEach((v, i) => {
creators += `
- role: ${v.role}
text: ${v.name}`
            })

let metadataTemplate = `---
title:
- type: main
  text: ${arr.title}
creator:
${creators}
publisher: ${arr.publisher}
rights: ${arr.rights}
language: ${arr.languages}
date: ${arr.date}
...
    `
            writeFile('html/metadata.yml', metadataTemplate)
        } else {
            fs.copyFileSync('epub/metadata.yml', 'html/metadata.yml')
        }

        if (!fs.existsSync('epub/template.xhtml')) {
            writeFile('html/template.xhtml', pandocTemplate.template)
        } else {
            fs.copyFileSync('epub/template.xhtml', 'html/template.xhtml')
        }

        writeFile('html/epub.xhtml', epages)
        return true
    }


    build(data) {
        let dir = 'html/'
        this.buildEpubFiles(data)
        return this.walk(dir, function (err, results) {
            if (err) throw err;
            return true
        })
    }
}

module.exports = Build