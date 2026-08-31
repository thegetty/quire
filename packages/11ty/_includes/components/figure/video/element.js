import { html } from '#lib/common-tags/index.js'
import chalkFactory from '#lib/chalk/index.js'
import path from 'node:path'

const logger = chalkFactory('Figure Video')

/**
 * Renders a native or embedded video player
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 *
 * @param      {Object}  figure          The figure object
 * @param      {String}  id              The id of the figure
 * @param      {String}  mediaId         An id for a youtube or vimeo embed
 * @param      {String}  mediaType       The type of tag video ('video', 'vimeo' or 'youtube')
 * @param      {String}  poster          Poster image url for a static video file
 * @param      {String}  src             Source url for a static video file
 *
 * @return     {String}  An HTML <video> element
 */
export default function (eleventyConfig) {
  const { pathname } = eleventyConfig.globalData.publication
  const { imageDir } = eleventyConfig.globalData.config.figures

  const videoElements = {
    video ({ derivatives, id }) {
      const { media, staticInlineFigureImage } = derivatives
      if (!media) {
        logger.error(`Cannot render Video without 'src'. Check that figures data for id: ${id} has a valid 'src'`)
        return ''
      }

      if (!staticInlineFigureImage) {
        logger.warn(`Figure '${id}' does not have a 'poster' property. A poster image for id: ${id} will not be rendered`)
      }

      const unsupported = 'Sorry, your browser does not support embedded videos.'
      return html`
        <video
          class="q-figure-video-element"
          controls
          poster="${staticInlineFigureImage?.paths?.internal}"
        >
          <source src="${media.paths.internal}" type="video/mp4"/>
          ${unsupported}
        </video>
      `
    },
    vimeo ({ id, derivatives, lazyLoading }) {
      const { embedUrl } = derivatives.embed

      return html`
        <iframe
          allow="fullscreen; picture-in-picture"
          allowfullscreen
          class="q-figure-video-element q-figure-video-element--embed"
          frameborder="0"
          src="${embedUrl}"
          loading="${lazyLoading ?? 'lazy'}"
        ></iframe>
      `
    },
    youtube ({ id, derivatives, lazyLoading }) {
      const { embedUrl } = derivatives.embed

      return html`
        <iframe
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="q-figure-video-element q-figure-video-element--embed"
          frameborder="0"
          src="${embedUrl}"
          loading="${lazyLoading ?? 'lazy'}"
        ></iframe>
      `
    }
  }

  return function ({
    derivatives,
    id,
    lazyLoading,
    lightbox,
    mediaId,
    mediaType,
    poster,
    src
  }) {
    const assetRoot = lightbox && pathname !== '/' ? path.posix.join(pathname, imageDir) : imageDir

    return videoElements[mediaType]({ derivatives, id, mediaId, mediaType, lazyLoading, src })
  }
}
