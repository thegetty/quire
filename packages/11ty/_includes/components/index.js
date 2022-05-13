/**
 * Export all component includes
 */
const figureComponents = require('./figure')
const licenseIcons = require('./license-icons')

module.exports = {
  abstract: require('./abstract.js'),
  analytics: require('./analytics.js'),
  citation: require('./citation/index.js'),
  citationChicagoPage: require('./citation/chicago/page.js'),
  citationChicagoPublication: require ('./citation/chicago/publication.js'),
  citationChicagoPublicationContributors: require ('./citation/chicago/publication-contributors.js'),
  citationChicagoPublishers: require('./citation/chicago/publishers.js'),
  citationChicagoSite: require('./citation/chicago/site.js'),
  citationContributors: require('./citation/contributors.js'),
  citationMLAPage: require('./citation/mla/page.js'),
  citationMLAPublication: require('./citation/mla/publication.js'),
  citationMLAPublicationContributors: require('./citation/mla/publication-contributors.js'),
  citationMLAPublishers: require('./citation/mla/publishers.js'),
  citationMLASite: require('./citation/mla/site.js'),
  citationPubDate: require('./citation/pub-date.js'),
  citationPubSeries: require('./citation/pub-series.js'),
  contributorBio: require('./contributor/bio.js'),
  copyright: require('./copyright/index.js'),
  copyrightLicensing: require('./copyright/licensing.js'),
  dublinCore: require('./head-tags/dublin-core.js'),
  ...figureComponents,
  head: require('./head.js'),
  icon: require('./icon.js'),
  icons: require('./icons.js'),
  iconscc: require('./icons-cc.js'),
  index: require('./index.js'),
  jsonld: require('./head-tags/jsonld.js'),
  ...licenseIcons,
  lightbox: require('./lightbox/index.js'),
  link: require('./link.js'),
  linkList: require('./link-list.js'),
  litElements: require('./head-tags/lit-elements.js'),
  menu: require('./menu/index.js'),
  menuHeader: require('./menu/header.js'),
  menuItem: require('./menu/item.js'),
  menuList: require('./menu/list.js'),
  menuResources: require('./menu/resources.js'),
  modal: require('./modal/index.js'),
  navigation: require('./navigation.js'),
  opengraph: require('./head-tags/opengraph.js'),
  pageButtons: require('./page-buttons.js'),
  pageClass: require('./page-class.js'),
  pageHeader: require('./page-header.js'),
  pageTitle: require('./page-title.js'),
  pdfInfo: require('./pdf/info.js'),
  scripts: require('./scripts.js'),
  siteTitle: require('./site-title.js'),
  tableOfContentsGridItem: require('./table-of-contents/grid-item.js'),
  tableOfContentsImage: require('./table-of-contents/image.js'),
  tableOfContentsItem: require('./table-of-contents/item.js'),
  tableOfContentsList: require('./table-of-contents/list.js'),
  tableOfContentsListItem: require('./table-of-contents/list-item.js'),
  twitterCard: require('./head-tags/twitter-card.js'),
}
