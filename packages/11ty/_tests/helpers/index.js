import Eleventy from '@11ty/eleventy'

/**
 * @function stubGlobalData
 *
 * @param {Object} eleventyConfig
 *
 * Runs at config time to configure the globalData store.
 *
 * @returns {Callable} Function to run at configure time
 *
 **/
const stubGlobalData = (stubData) => {
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
  }
}

/**
 * @function initEleventyEnvironment
 *
 * Initializes an Eleventy object suitable for rendering out shortcodes
 *
 * TODO: Use `globalData` here to pass some params to stubGlobalData or whatever
 **/
const initEleventyEnvironment = async (stub, finalizer) => {
  const elev = new Eleventy('../', '_site', { config: stubGlobalData(stub) })
  await elev.init()

  return elev
}

export { initEleventyEnvironment }
