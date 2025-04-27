import fs from 'node:fs'
import path from 'node:path'
import eleventySitemapPlugin from '@quasibit/eleventy-plugin-sitemap'

/**
 * Eleventy plugin to dynamically generate a sitemap from publication content.
 *
 * @param {Object} eleventyConfig
 * @param {Object} collections
 **/
export default async function (eleventyConfig, collections) {
  const { url: hostname } = eleventyConfig.globalData.publication
  const { outputDir, publicDir } = eleventyConfig.globalData.directoryConfig

  eleventyConfig.addPlugin(eleventySitemapPlugin, {
    sitemap: { hostname }
  })

  eleventyConfig.on('eleventy.after', async () => {
    const sitemap = await eleventyConfig.javascript.functions.renderTemplate('{% sitemap collections.html %}', 'liquid,md', { collections })
    const outputPath = path.join(publicDir || outputDir, 'sitemap.xml')

    fs.writeFileSync(outputPath, sitemap)
  })
}
