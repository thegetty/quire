const cheerio = require("cheerio");
const path = require("path");
const upath = require("upath");

/**
 * Epub Chapter Class.
 * @param {String} HTML String
 * @param {Object} Config data
 * @return {Object} Chapter data
 * @description Processes HTML into an Epub-friendly format and returns a data
 * object for use in the Pe-Epub JSON "pages" array.
 */
class Chapter {
  constructor(
    html,
    epubTitle,
    config = { outputDir: "site", imageDir: "img" }
  ) {
    this.config = config;
    this.epubTitle = epubTitle;
    this.$ = cheerio.load(html);
    this.content = this.$("#main") || this.$(".quire__primary__inner");
    this.title = this.determineTitle();
    this.chapterId = this.determineChapterId();
    this.images = this.content.find("img");
    this.links = this.content.find("a");
    this.reformatedHashLinkArr = "";
    this.reformatPage();

    let data = {
      title: this.title,
      body: this.body(),
      reformatedHashLinkArr: this.reformatedHashLinkArr
    };

    if (this.href()) {
      data.linkTitleArr = {};
      data.href = this.href();
      // linkTitleArr = Object that contains the chapter internal link and chapter title
      data.linkTitleArr["link"] = this.santizeUrl(this.href());
      data.linkTitleArr["title"] = this.pandocTitle(this.chapterId);
    }

    return data;
  }

  santizeUrl(url) {
    if (url !== undefined) {
      url = url
        // lowercase string
        .toLowerCase()
        // trim string
        .trim()
        // remove .xhtml
        .replace(".xhtml", "")
        // replace first instance of / with ''
        .replace(/^\//, "")
        // replace last instance of / with ''
        .replace(/\/$/, "")
        // replace all instances of . with ''
        .replace(/\./g, "");
      return url;
    }
  }

  pandocTitle(title) {
    // remove special characters for epub title we need to treat . and ’ characters as special cases for pandoc
    // pandoc removes ’ and keeps . so we have to do the same for internal linking to line up
    title =
      title !== this.epubTitle
        ? title.replace(/[^a-zA-Z0-9 ]/g, " ")
        : title.replace(/\’/g, "").replace(/[^a-zA-Z0-9.]/g, " ");
    let t = title
      // lowercase
      .toLowerCase()
      // replace multiple spaces with a single space
      .replace(/\s\s+/g, " ")
      // trim string
      .trim()
      // replace single space with -
      .replace(/\s/g, "-");
    return t;
  }

  attrMatches(el, attr, regex) {
    return this.$(el)
      .attr(attr)
      .match(regex);
  }

  epubLink(href) {
    // console.log(href)

    // if external link we dont want it
    if (href.match(/^(https|http|www)/)) {
      return href;
    }

    // if internal link we dont want it
    if (href.indexOf("#") !== -1) {
      return href;
    }

    let chapterName = upath
      .normalize(href.replace("localhost:1313", ""))
      // replace first instance of / with ''
      .replace(/^\//, "")
      // replace last instance of / with ''
      .replace(/\/$/, "")
      // replace all instances of . with ''
      .replace(/\./g, "")
      // replace all instances of . with ''
      .replace(/\’/g, "");

    // Add a hash to cover epub title because it falls outside of the conditions below
    chapterName =
      chapterName !== ""
        ? `${chapterName}`
        : `#${this.pandocTitle(this.epubTitle)}`;

    // console.log(chapterName)
    return chapterName;
  }

  determineTitle() {
    let title;
    if (this.content.find("h1")) {
      title = this.content.find("h1").text();
    } else if (this.content.find("h2")) {
      title = this.content.find("h2").text();
    }
    return title || "Cover";
  }

  determineChapterId() {
    let id;

    if (this.content.find(".quire-contents-header > h1")) {
      if (
        this.content.find(".quire-contents-header > h1").attr("id") !==
        undefined
      ) {
        id = this.content.find(".quire-contents-header > h1").attr("id");
      }
    }

    if (this.content.find("h1.quire-page__header__title")) {
      if (
        this.content.find("h1.quire-page__header__title").attr("id") !==
        undefined
      ) {
        id = this.content.find("h1.quire-page__header__title").attr("id");
      }
    }

    return id || this.epubTitle;
  }

  body() {
    return this.$.xml(this.content);
  }

  href() {
    let canonical = this.$('link[rel="canonical"]');
    if (canonical) {
      let url = this.epubLink(canonical.attr("href"));
      return url;
    } else {
      return null;
    }
  }

  reformatPage() {
    let chapter = this;

    // format all
    function reformatIDsForPandoc() {
      chapter.content
        .find("[id]")
        // exclude h1 since they already have chapter id
        .not("h1")
        // to lower case
        .attr("id", (index, id) => {
          return id.toLowerCase();
        })
        // Remove special characters
        .attr("id", (index, id) => {
          return id.replace(/[^a-zA-Z0-9 ]/g, " ");
        })
        // replace multiple spaces with a single space
        .attr("id", (index, id) => {
          return id.replace(/\s\s+/g, " ");
        })
        // Convert any " " characters in anchor links to "-"
        .attr("id", (index, id) => {
          return id.replace(/\s/g, "-");
        })
        // Add chapter
        .attr("id", (index, id) => {
          return `${id}-${chapter.pandocTitle(chapter.chapterId)}`;
        });
    }

    function reformatH1IDsForPandoc() {
      chapter.content.find("h1").each((index, el) => {
        let id = chapter.$(el).attr("id");
        if (id !== undefined) {
          id = id
            .toLowerCase()
            .replace(/[^a-zA-Z0-9 ]/g, " ")
            .replace(/\s\s+/g, " ")
            .replace(/\s/g, "-");
        } else {
          id = "cover";
        }
        return chapter.$(el).attr("id", id);
      });
    }

    function reformatIDsWithColons() {
      chapter.content.find('[id*=":"]').attr("id", (index, id) => {
        return id.replace(":", "-");
      });
    }

    function reformatImgSources() {
      chapter.images.attr("src", (index, src) => {
        let localPath = path
          .resolve(
            path.join(chapter.config.outputDir, chapter.config.imageDir),
            src
          )
          .replace(/\/localhost:1313/, chapter.config.outputDir);
        return "./" + localPath;
      });
    }

    function reformatLinks() {
      let hrefCounts = {};
      let hrefArr = [];

      // Convert cross-refrence links to their proper epub chapter locations
      chapter.links
        .not((index, el) => {
          return chapter.attrMatches(el, "href", /^#/);
        })
        .attr("href", (index, href) => {
          return `${chapter.epubLink(href)}`;
        });

      // This routine deals with internal links that link to another page in the EPUB
      chapter.links
        .filter((index, el) => {
          return (
            chapter
              .$(el)
              .attr("href")
              .indexOf("#") !== -1
          );
        })
        .filter((index, el) => {
          return (
            chapter
              .$(el)
              .attr("href")
              .charAt(0) !== "#"
          );
        })
        // Convert to lowercase
        .attr("href", (index, href) => {
          return href.toLowerCase();
        })
        // Decode
        .attr("href", (index, href) => {
          return decodeURIComponent(href);
        })
        // Decode
        .attr("href", (index, href) => {
          return decodeURI(href);
        })
        .attr("href", (index, href) => {
          // if external link we dont want it
          if (href.match(/^(https|http|www)/)) {
            return href;
          }

          href = href
            .replace("//localhost:1313", "")
            // replace first instance of / with ''
            .replace(/^\//, "")
            // replace last instance of / with ''
            .replace(/\/$/, "")
            // replace : with '-'
            .replace(":", "-")
            // replace : with '-'
            .replace(".", "-")
            // replace any whitespace with -
            .replace(/\s/g, "-");

          hrefArr.push({ internalLinksOtherPage: `#${href}` });
          return `${href}`;
        });

      // Reformat internal links that are linked to the same chapter and deal with the title also
      chapter.links
        .filter((index, el) => {
          // console.log(chapter.$(el).attr('href').indexOf('#') !== -1)
          return chapter.attrMatches(el, "href", /^#/);
        })
        .filter((index, el) => {
          // console.log(chapter.$(el).attr('href').indexOf('#') !== -1)
          return (
            chapter
              .$(el)
              .attr("href")
              .indexOf("/") === -1
          );
        })
        // Convert to lowercase
        .attr("href", (index, href) => {
          return href.toLowerCase();
        })
        // Decode
        .attr("href", (index, href) => {
          return decodeURIComponent(href);
        })
        // Decode
        .attr("href", (index, href) => {
          return decodeURI(href);
        })
        // Convert any "cover" links to what pandoc see it as "official title"
        .attr("href", (index, href) => {
          return href.replace(
            "#cover",
            `#${chapter.pandocTitle(chapter.epubTitle)}`
          );
        })
        // remove special characters except numbers and letters
        .attr("href", (index, href) => {
          if (href !== `#${chapter.pandocTitle(chapter.epubTitle)}`) {
            return href.replace(/[^a-zA-Z0-9 ]/g, " ");
          }
          return href;
        })
        // replace multiple spaces with a single space
        // remove special characters removes hash character so remove the space it occupied
        .attr("href", (index, href) => {
          href = href.substring(1);
          return href.replace(/\s\s+/g, " ");
        })
        // Convert any ":" characters in anchor links to "-"
        .attr("href", (index, href) => {
          return href.replace(":", "-");
        })
        // Convert any " " characters in anchor links to "-"
        // prepend string with missing hash character
        .attr("href", (index, href) => {
          href = href !== `` ? href : `empty`;
          href = href.replace(/\s/g, "-");
          if (href !== `${chapter.pandocTitle(chapter.epubTitle)}`) {
            hrefArr.push({
              internalLinks: `#${href}-${chapter.pandocTitle(
                chapter.chapterId
              )}`,
              mdPage: `${chapter.pandocTitle(chapter.chapterId)}`
            });
            return `#${href}-${chapter.pandocTitle(chapter.chapterId)}`;
          }
          hrefArr.push({ internalLinks: `#${href}` });
          return `#${href}`;
        });

      // Find duplicate hrefs and increment on contents page
      if (chapter.pandocTitle(chapter.title) === `contents`) {
        chapter.links
          .filter((index, el) => {
            return chapter.attrMatches(el, "href", /^#/);
          })
          .attr("href", (index, href) => {
            hrefCounts[href] = (hrefCounts[href] || 0) + 1;
            if (hrefCounts[href] > 1) {
              hrefArr.push({ tocInternalLinks: `${href}-${hrefCounts[href]}` });
              href = `${href}-${hrefCounts[href]}`;
              return href;
            }
            return href;
          });
      }

      // Array of internal links to cross ref in build.js
      chapter.reformatedHashLinkArr = hrefArr;
    }

    reformatIDsWithColons();
    reformatImgSources();
    reformatLinks();
    reformatH1IDsForPandoc();
    reformatIDsForPandoc();
  }
}

module.exports = Chapter;
