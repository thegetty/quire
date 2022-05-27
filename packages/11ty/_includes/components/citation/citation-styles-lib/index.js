const Processor = require("simple-cite");
const chicago = require("style-chicago");
const locale = require("locale-en-us");
const mla = require("style-mla");

/**
 * Adapts Quire publication data to the CSL-JSON "book" type
 * https://docs.citationstyles.org/en/stable/specification.html
 * 
 * @return {Object}                CSL-JSON book
 */
module.exports = function (eleventyConfig) {
  const citationStylesLibPage = eleventyConfig.getFilter("citationStylesLibPage");
  const citationStylesLibPublication = eleventyConfig.getFilter("citationStylesLibPublication");

  return function (params) {
    const { context, type } = params
    let style;

    switch (type) {
      case "chicago":
        style = chicago;
        break;
      case "mla":
        style = mla;
        break;
      default:
        break;
    }

    let items;

    switch (context) {
      case "page":
        items = [citationStylesLibPage(params)]
        break;
      case "publication":
        items = [citationStylesLibPublication(params)]
        break;
      default:
        break;
    }

    const processor = new Processor({ items, style, locale });
    const citation = processor.cite({ citationItems: [{ id: context }] });

    return processor.bibliography().value;
  };
};
