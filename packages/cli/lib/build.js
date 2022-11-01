/**
 * @fileOverview Build class
 * @license MIT
 * @description Build and modify the html from hugo to fit epub needs
 *
 */

const EventEmitter = require("events");
const util = require("util");
const fs = require("fs-extra");
const writeFile = util.promisify(fs.writeFile);
const rimraf = require("rimraf");
const sanitizeHtml = require("sanitize-html");
const path = require("path");
const cheerio = require("cheerio");

import pandocTemplate from "@src/epubTemplate";

// Helper Functions - Consider moving to utils
const checkFilesCreated = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(file => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          checkFilesCreated(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

// Helper Functions - Consider moving to utils
const epubLink = (href, linksTitles) => {
  if (href.match(/^(https|http|www)/)) {
    return href;
  }

  if (href.indexOf("#") !== -1) {
    let pageLInk = href.split("#");
    // console.log(pageLInk)
    for (let index = 0; index < linksTitles.length; index++) {
      let titleParts = linksTitles[index].link.replace(/[^a-zA-Z0-9 ]/g, "");
      if (pageLInk[0].replace(/[^a-zA-Z0-9 ]/g, "") === titleParts) {
        href = `#${pageLInk[1]}-${linksTitles[index].title}`;
        return href;
      }
    }
    return href;
  }

  for (let index = 0; index < linksTitles.length; index++) {
    let titleParts = linksTitles[index].link;
    if (href === titleParts) {
      href = `#${linksTitles[index].title}`;
      return href;
    }
  }
  return href;
};

// Helper Functions - Consider moving to utils
const sanitizeEpubHtml = html => {
  html = sanitizeHtml(html, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "p",
      "a",
      "ul",
      "ol",
      "nl",
      "li",
      "b",
      "i",
      "strong",
      "em",
      "hr",
      "br",
      "div",
      "table",
      "thead",
      "caption",
      "tbody",
      "tr",
      "th",
      "td",
      "dl",
      "dt",
      "dd",
      "pre",
      "html",
      "title",
      "iframe",
      "header",
      "footer",
      "body",
      "form",
      "img",
      "meta",
      "link",
      "strike",
      "code",
      "main",
      "article",
      "section",
      "aside",
      "span",
      "figure",
      "sup",
      "sub",
      "figcaption"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "class", "id"],
      img: ["src", "width", "height", "class", "id"],
      iframe: ["src", "width", "height", "class", "id"],
      div: ["id", "class"],
      main: ["id", "class"],
      article: ["id", "class"],
      ul: ["id", "class"],
      ol: ["id", "class"],
      li: ["id", "class"],
      nav: ["id", "class"],
      meta: ["name", "content"],
      link: ["rel", "href"],
      p: ["id", "class"],
      h1: ["id", "class"],
      h2: ["id", "class"],
      h3: ["id", "class"],
      h4: ["id", "class"],
      h5: ["id", "class"],
      h6: ["id", "class"],
      span: ["id", "class"],
      sup: ["id", "class"],
      sub: ["id", "class"],
      figure: ["id", "class"],
      figcaption: ["id", "class"],
      blockquote: ["id", "class"],
      table: ["id", "class"],
      td: ["id", "class"],
      tr: ["id", "class"],
      th: ["id", "class"],
      dl: ["id", "class"],
      dt: ["id", "class"],
      dd: ["id", "class"],
      html: ["id", "class"],
      body: ["id", "class"],
      section: ["id", "class"],
      aside: ["id", "class"]
    },
    selfClosing: [
      "br",
      "hr",
      "area",
      "base",
      "basefont",
      "input",
      "meta",
      "img"
    ],
    allowedSchemes: ["http", "https", "ftp", "mailto"],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: [],
    allowProtocolRelative: true,
    allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"]
  });
  return html;
};

//Error and exit
const errorExit = (message, spinner) => {
  spinner.fail(`${message}`);
  process.exit(1);
  removeHTML();
};

class Build extends EventEmitter {
  constructor(data, spinner) {
    super();
    this.data = data;
    this.spinner = spinner;
    if (this.data) {
      (async () => {
        try {
          await this.buildEpubFiles(this.data);
        } catch (error) {
          errorExit(error, this.spinner);
        }
      })();
    }
  }

  removeHTML() {
    let dir = "html/";
    rimraf(dir, function() {
      return true;
    });
  }

  createReformatedHashLinkArrAndcreateLinkArr(arr) {
    return new Promise(function(resolve, reject) {
      if (arr === "") {
        reject(new Error("Something went wrong. Please try again."), null);
      } else {
        let reformatedHasLinks = [];
        let link_title_array = [];
        arr.pages.forEach(v => {
          let reformatedHashLinkArr =
            v.reformatedHashLinkArr !== undefined
              ? v.reformatedHashLinkArr
              : "";
          reformatedHasLinks.push(reformatedHashLinkArr);
          let linkTitleArr = v.linkTitleArr !== undefined ? v.linkTitleArr : "";
          link_title_array.push(linkTitleArr);
        });
        resolve([link_title_array, reformatedHasLinks]);
      }
    });
  }

  buildMetadata(arr) {
    return new Promise(function(resolve, reject) {
      if (arr === "") {
        reject(new Error("Something went wrong. Please try again."), null);
      } else if (
        arr["title"] === undefined ||
        arr["title"] === null ||
        arr["title"] === ""
      ) {
        reject(
          new Error(
            "A title for your publication must be specified in the publication.yml file."
          ),
          null
        );
      } else if (
        arr["language"] === undefined ||
        arr["language"] === null ||
        arr["language"] === ""
      ) {
        reject(
          new Error(
            "A language for your publication must be specified in the publication.yml file."
          ),
          null
        );
      } else {
        delete arr.pages;
        let meta = ``;
        for (let key in arr) {
          if (
            arr[key] !== undefined &&
            arr[key] !== null &&
            typeof arr[key] !== "string"
          ) {
            if (arr[key].length > 0) {
              let object = arr[key];
              if (key === "creators") {
                for (let key in object) {
                  if (object.hasOwnProperty(key)) {
                    if (
                      object[key] !== undefined &&
                      object[key] !== null &&
                      object[key] !== ""
                    ) {
                      let prop = object[key];
                      if (prop.fullname === true) {
                        meta += `<dc:creator opf:role="${prop.role}">${prop.name}</dc:creator>`;
                      } else {
                        meta += `<dc:creator opf:file-as="${
                          prop["file-as"]
                        }" opf:role="${prop.role}">${prop.name}</dc:creator>`;
                      }
                    }
                  }
                }
              } else if (key === "contributors") {
                for (let key in object) {
                  if (object.hasOwnProperty(key)) {
                    if (
                      object[key] !== undefined &&
                      object[key] !== null &&
                      object[key] !== ""
                    ) {
                      let prop = object[key];
                      if (prop.fullname === true) {
                        meta += `<dc:contributor opf:role="${prop.role}">${prop.name}</dc:contributor>`;
                      } else {
                        meta += `<dc:contributor opf:file-as="${
                          prop["file-as"]
                        }" opf:role="${prop.role}">${
                          prop.name
                        }</dc:contributor>`;
                      }
                    }
                  }
                }
              } else {
                for (let key in object) {
                  if (object.hasOwnProperty(key)) {
                    if (
                      object[key] !== undefined &&
                      object[key] !== null &&
                      object[key] !== ""
                    ) {
                      meta += `<dc:${key}>${object[key]}</dc:${key}>`;
                    }
                  }
                }
              }
            }
          } else {
            if (key !== "title") {
              if (
                arr[key] !== undefined &&
                arr[key] !== null &&
                arr[key] !== ""
              ) {
                meta += `<dc:${key}>${arr[key]}</dc:${key}>`;
              }
            }
          }
        }
        writeFile("html/dc.xml", meta);
        resolve(meta);
      }
    });
  }

  buildHTML(arr, linksTitles, hashLinks) {
    return new Promise(function(resolve, reject) {
      if (arr === "" || linksTitles === "" || hashLinks === "") {
        reject(new Error("Something went wrong. Please try again."), null);
      } else {
        let html = [];
        // console.log(arr.pages)
        arr.pages.forEach(v => {
          let body = v.body !== undefined ? v.body : "";
          html.push(body);
        });

        let newHtml = html.join(" ");

        newHtml = sanitizeEpubHtml(newHtml);

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
                `;
        const $ = cheerio.load(epages, {
          decodeEntities: false
        });

        const htmlObj = $("html");
        let idCounts = {};

        // increment IDs to remove duplicates
        htmlObj.find("[id]").attr("id", (index, id) => {
          idCounts[id] = (idCounts[id] || 0) + 1;
          if (id.indexOf("fn-") !== -1 || id.indexOf("fnref-") !== -1) {
            return id;
          }
          if (idCounts[id] > 1) {
            id = `${id}-${idCounts[id]}`;
            return id;
          }
          return id;
        });

        // Remove these items before final compile
        htmlObj
          .find(
            ".remove-from-epub, .visually-hidden, .is-screen-only, .is-print-only"
          )
          .remove();

        // Remove wrapper to figure group
        htmlObj.find(".quire-figure--group").each((index, el) => {
          let html = $(el).html();
          return $(el).replaceWith(`${html}`);
        });

        // Move ID from img tag to span tag preceding the figure tag pandoc wont reference img tags
        // It is possible to do but would require a larger install process for the user
        htmlObj.find("figure").each((index, el) => {
          const imgId =
            $(el)
              .find("img")
              .attr("id") !== undefined
              ? $(el)
                  .find("img")
                  .attr("id")
              : "";
          const imgSrc =
            $(el)
              .find("img")
              .attr("src") !== undefined
              ? $(el)
                  .find("img")
                  .attr("src")
              : "";
          let caption;
          const captionEls = $(el).find(`figcaption`);
          if (captionEls.length) {
            caption = $('<figcaption></figcaption>');
            captionEls.each((i, el) => {
              caption.append($(el).html());
              (i < captionEls.length - 1) ? caption.append('<br/>') : null;
            });
          }
          return $(el).replaceWith(
            `<span id="${imgId}"></span><figure><img src="${imgSrc}"/>${caption}</figure>`
          );
        });

        // convert reference links on other pages this returns an updated link tat corresponds to the section ID
        // that pandoc generates. If there is a match in the path then the link is updated to the appropriate internal link
        htmlObj.find("a").attr("href", (index, href) => {
          // console.info(href)
          if (href.indexOf(`empty`) !== -1) {
            let page = href.replace("#empty-", "");
            reject(
              new Error(
                `Fragment identifier on page ${page} of <a href="#"></a> could not be found. Please correct this and try again.`
              ),
              null
            );
          }
          return epubLink(href, linksTitles, hashLinks);
        });

        // in pandoc there is not enough space to add attributes to all elements so the sup loses its ability to accommodate an ID
        // so we move the ID on to a span inside the sup to retain the sup style
        htmlObj.find("sup").each((index, el) => {
          let attrs = $(el).attr();
          let innerHTML = $(el).html();
          let supClass =
            attrs.class !== undefined ? `class="${attrs.class}"` : "";
          let supId = attrs.id !== undefined ? `id="${attrs.id}"` : "";
          return $(el).replaceWith(
            `<sup><span ${supClass} ${supId}>${innerHTML}</span></sup>`
          );
        });

        if (!fs.existsSync("epub/template.xhtml")) {
          writeFile("html/template.xhtml", pandocTemplate);
        } else {
          fs.copyFileSync("epub/template.xhtml", "html/template.xhtml");
        }

        const epubHtml = $("<div>").append(htmlObj.clone()).html();

        writeFile("html/epub.xhtml", epubHtml);

        resolve($.html());
      }
    });
  }

  async buildEpubFiles(arr) {
    try {
      let dir = "./html";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      let result = await this.createReformatedHashLinkArrAndcreateLinkArr(arr);
      await this.buildHTML(arr, result[0], result[1]);
      await this.buildMetadata(arr);
      return new Promise(resolve => resolve(true));
    } catch (error) {
      errorExit(error, this.spinner);
      return new Promise(reject => reject(error));
    }
  }
}

export default Build;