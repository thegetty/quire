/**
 * Export all component includes
 */
const figureComponents = require('./figure')

module.exports = {
  abstract: require('./abstract.js'),
  analytics: require('./analytics.js'),
  citation: require('./citation/index.js'),
  citeName: require('./citation/name.js'),
  citePage: require('./citation/page.js'),
  citePublication: require('./citation/publication.js'),
  citePublicationSeries: require('./citation/publication-series.js'),
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
  licenseIcons: require('./license-icons.js'),
  lightbox: require('./lightbox/index.js'),
  link: require('./link.js'),
  linkList: require('./link-list.js'),
  menu: require('./menu/index.js'),
  menuHeader: require('./menu/header.js'),
  menuItem: require('./menu/item.js'),
  menuList: require('./menu/list.js'),
  menuResources: require('./menu/resources.js'),
  modal: require('./modal/index.js'),
  navigation: require('./navigation.js'),
  opengraph: require('./head-tags/opengraph.js'),
  pageButtons: require('./page-buttons.js'),
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
  webComponents: require('./head-tags/web-components.js')
}
