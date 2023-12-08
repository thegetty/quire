/**
 * Export all component includes
 */

module.exports = {
  accordionGlobalControls: require('./accordion/global-controls'),
  annotationsUI: require('./figure/annotations-ui'),
  abstract: require('./abstract.js'),
  analytics: require('./analytics.js'),
  canvasPanel: require('./figure/image/canvas-panel'),
  citation: require('./citation/index.js'),
  citeName: require('./citation/name.js'),
  citePage: require('./citation/page.js'),
  citePublication: require('./citation/publication.js'),
  citePublicationSeries: require('./citation/publication-series.js'),
  contributorBio: require('./contributor/bio.js'),
  copyright: require('./copyright/index.js'),
  copyrightLicensing: require('./copyright/licensing.js'),
  dublinCore: require('./head-tags/dublin-core.js'),
  figureCaption: require('./figure/caption'),
  figureImage: require('./figure/image'),
  figureImageElement: require('./figure/image/element'),
  figureImageSequence: require('./figure/image/sequence'),
  figureLabel: require('./figure/label'),
  figureModalLink: require('./figure/modal-link'),
  figureMediaEmbedUrl: require('./figure/media-embed-url'),
  figureOption: require('./figure/annotations-ui/option'),
  figurePlaceholder: require('./figure/placeholder'),
  figureAudio: require('./figure/audio'),
  figureAudioElement: require('./figure/audio/element'),
  figureTable: require('./figure/table'),
  figureTableElement: require('./figure/table/element'),
  figureVideo: require('./figure/video'),
  figureVideoElement: require('./figure/video/element'),
  head: require('./head.js'),
  icon: require('./icon.js'),
  icons: require('./icons.js'),
  iconscc: require('./icons-cc/index.js'),
  imageService: require('./figure/image/image-service'),
  imageTag: require('./figure/image/image-tag'),
  index: require('./index.js'),
  jsonld: require('./head-tags/jsonld.js'),
  licenseIcons: require('./license-icons.js'),
  lightbox: require('./lightbox/index.js'),
  lightboxSlides: require('./lightbox/slides'),
  lightboxUI: require('./lightbox/ui'),
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
  quireData: require('./quire-data.js'),
  search: require('./search.js'),
  scripts: require('./scripts.js'),
  siteTitle: require('./site-title.js'),
  tableOfContents: require('./table-of-contents/index.js'),
  tableOfContentsGridItem: require('./table-of-contents/item/grid.js'),
  tableOfContentsImage: require('./table-of-contents/item/image.js'),
  tableOfContentsItem: require('./table-of-contents/item/index.js'),
  tableOfContentsList: require('./table-of-contents/list/index.js'),
  tableOfContentsListItem: require('./table-of-contents/item/list.js'),
  twitterCard: require('./head-tags/twitter-card.js')
}
