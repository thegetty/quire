import { html } from '#lib/common-tags/index.js'

export default function (eleventyConfig) {
  const { enableModal } = eleventyConfig.globalData.config.figures

  return ({ content, id }) => enableModal
    ? html`<a class="q-figure__modal-link" href="#${id}">${content}</a>`
    : content
}
