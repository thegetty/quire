import Eleventy from '@11ty/eleventy'

/**
 * @function stubGlobalData
 *
 * @param {Object} stubData
 * @param {Callable} finalizer - a function to run after the globalData steps
 *
 * Runs before initialization to setup the globalData store and other config
 *
 * @returns {Callable} Function to run at configure time
 *   @param {Object} eleventyConfig
 *
 **/
const stubGlobalData = (stubData, finalizer) => {
  return (eleventyConfig) => {
    // TODO: Move accordion.copyButton to shortcodes test
    let config = {
      accordion: {
        copyButton: {}
      },
      epub: {},
      figures: { }
    }
    let publication = {}
    const figures = { figure_list: [] }

    // Merge `stubData` with defaults -- NB: merge is shallow!
    Object.entries(stubData).forEach(([key, val]) => {
      switch (key) {
        case 'publication':
          publication = { ...publication, ...val }
          break
        case 'config':
          config = { ...config, ...val }
          break
        case 'figures':
          figures.figure_list = [...figures.figure_list, ...val.figure_list]
          break
        default:
          eleventyConfig.addGlobalData(key, val)
      }
    })

    eleventyConfig.addGlobalData('publication', publication)
    eleventyConfig.addGlobalData('config', config)
    eleventyConfig.addGlobalData('figures', figures)

    if (finalizer) {
      finalizer(eleventyConfig)
    }
  }
}

/**
 * @function initEleventyEnvironment
 *
 * Initializes an Eleventy object suitable for rendering out shortcodes
 *
 **/
const initEleventyEnvironment = async (stub, finalizer) => {
  const elev = new Eleventy('.', '_site', { config: stubGlobalData(stub, finalizer) })
  await elev.init()

  return elev
}

const minimalBuildingData = {
  config: {
    analytics: {
    },
    bibliography: {
      displayOnPage: true,
      displayShort: true,
      heading: 'Bibliography'
    },
    epub: {
      outputDir: '_epub'
    },
    figures: {
      imageDir: '_assets/images/figures'
    },
    pageTitle: {
      labelDivider: '. '
    },
    pdf: {
      pagePDF: true
    }
  },
  publication: {
    contributor: [

    ],
    description: {
      full: 'Publication Description'
    },
    identifier: {
      isbn: ''
    },
    license: {
    },
    resource_link: [],
    revision_history: {
    },
    promo_image: 'image.jpg',
    pub_date: new Date(),
    publisher: [{ name: 'Publisher' }],
    subject: [],
    title: 'Publication',
    url: 'http://localhost:8080'
  }
}
export { initEleventyEnvironment, minimalBuildingData, stubGlobalData }
