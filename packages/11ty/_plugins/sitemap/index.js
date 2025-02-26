import fs from 'node:fs'
import path from 'node:path'
import sitemapPlugin from '@quasibit/eleventy-plugin-sitemap'

/**
 * Quire sitemamp plugin
 *
 * Wraps eleventy-plugin-sitemap to make the sitemap file plugin-internal
 **/
export default async function (eleventyConfig, collections) {
  const { url: hostname } = eleventyConfig.globalData.publication
  const { inputDir, outputDir, publicDir } = eleventyConfig.globalData.directoryConfig

  eleventyConfig.addPlugin(sitemapPlugin, {
    sitemap: { hostname }
  })

  eleventyConfig.on('eleventy.after', async () => {
    const sitemap = await eleventyConfig.javascript.functions.renderTemplate('{% sitemap collections.html %}', 'liquid,md', { collections })
    
    const directory = publicDir ? publicDir : outputDir
    const outputPath = path.join(directory, 'sitemap.xml')

    fs.writeFileSync(outputPath, sitemap)
  })
}
