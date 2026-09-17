import FigureMediaFactory from './figureMedia/factory.js'
import chalkFactory from '#lib/chalk/index.js'
import iiifConfig from './iiif/config.js'
import slugify from '@sindresorhus/slugify'

const logger = chalkFactory('Figures', 'DEBUG')

/**
 * @function prepareAnnexImages
 *
 * @param {Object} eleventyConfig - config from which to extract annex images
 *
 * @returns {Array}
 *
 * Returns annex images from the eleventyConfig mapped to the figure model.
 * for use with the figureMedia factory.
 *
 **/
const prepareAnnexImages = (eleventyConfig) => {
  const { defaultCoverImage } = eleventyConfig.globalData.config.epub
  const { contributor, promo_image: promoImageData, publisher } = eleventyConfig.globalData.publication

  let annexes = []
  if (promoImageData) {
    annexes.push({
      id: 'promo-image',
      media_type: 'annex-image',
      src: promoImageData
    })
  }

  if (defaultCoverImage) {
    annexes.push({
      id: 'epub-default',
      media_type: 'annex-image',
      src: defaultCoverImage
    })
  }

  const contributorAvatars = (contributor ?? []).filter((contrib) => Boolean(contrib.image)).map((contrib) => {
    return {
      id: `contributor-${contrib.id}`,
      media_type: 'annex-image',
      src: contrib.image
    }
  })

  const publisherLogos = (publisher ?? []).filter((publish) => Boolean(publish.logo)).map((publish) => {
    return {
      id: `logo-${slugify(publish.name)}`,
      media_type: 'annex-image',
      src: publish.logo
    }
  })

  annexes = annexes.concat(contributorAvatars, publisherLogos)
  return annexes
}

/**
 * Figures Plugin
 * Uses the FigureFactory to create Figure instances
 * for all figures in `figures.yaml` and updates global data
 */
export default function (eleventyConfig, options) {
  eleventyConfig.on('eleventy.before', async () => {
    const config = iiifConfig(eleventyConfig)
    const figureFactory = new FigureMediaFactory({ ...config, ...options })

    /**
     * Unwrap figure list and annex image data (eg, contributor and promo images)
     **/
    const { figure_list: figureList } = eleventyConfig.globalData.figures

    // Run annex assets through the figure factory
    const annexes = prepareAnnexImages(eleventyConfig)
    const annexFigures = await Promise.all(
      annexes.map((data) => {
        return figureFactory.create(data)
      })
    )

    // Run figures through figure factory
    const figures = await Promise.all(
      figureList.map((data) => {
        return figureFactory.create(data)
      })
    )

    // Combine the lists and check errors
    const allFigures = annexFigures.concat(figures)
    const errors = allFigures.filter(({ errors }) => errors && !!errors.length)

    if (errors.length) {
      logger.error('There were errors processing the following images:')
      console.table(
        errors.map(({ errors, figure }) => {
          return { id: figure.id, errors: errors.join(' ') }
        }),
        ['id', 'errors']
      )
    }

    /**
     * Add IIIFConfig and processed figureMedia to global data
     */
    eleventyConfig.addGlobalData('iiifConfig', config)
    eleventyConfig.addGlobalData('figureMedia', allFigures.map(({ figure }) => figure.media()))

    logger.info('Processing complete')
  })
}
