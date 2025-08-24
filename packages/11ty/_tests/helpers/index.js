/**
 * @function stubGlobalData
 *
 * @param {Object} eleventyConfig
 *
 * Inserts keys / values into globalData suitable to make Eleventy() init
 *
 **/
const stubGlobalData = (eleventyConfig) => {
  eleventyConfig.addGlobalData('publication', {})

  const config = {
    accordion: {
      copyButton: {}
    },
    epub: {},
    figures: {}
  }
  eleventyConfig.addGlobalData('config', config)

  const figures = { figure_list: [] }
  eleventyConfig.addGlobalData('figures', figures)
}

/**
 * @function initEleventyEnvironment
 *
 * Initializes an Eleventy object suitable for rendering out shortcodes
 *
 **/
const initEleventyEnvironment = async () => {
  const elev = new Eleventy('../', '_site', { config: stubGlobalData })
  await elev.init()

  return elev
}

export { initEleventyEnvironment }