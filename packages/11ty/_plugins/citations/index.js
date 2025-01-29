import { default as formatCitationFn } from './formatCitation.js'

export default function (eleventyConfig, options) {
  formatCitationFn(options).then(fn => eleventyConfig.addJavaScriptFunction('formatCitation', fn))
}
