import fs from 'node:fs'
import sitemapPlugin from '@quasibit/eleventy-plugin-sitemap'

/**
 * Quire sitemamp plugin 
 * 
 * Wraps eleventy-plugin-sitemap to make the sitemap file plugin-internal
 **/ 
export default async function (eleventyConfig,collections) {
  eleventyConfig.addPlugin(sitemapPlugin, {
    sitemap: {
        hostname: eleventyConfig.globalData.publication.url
    }
  })

  eleventyConfig.on('eleventy.after', async () => {
	  const sitemapXML = await eleventyConfig.javascript.functions.renderTemplate(`{% sitemap collections.html %}`, 'liquid,md',{ collections })
	  // TODO: Use eleventyConfig.directoryAssignments.output
	  const output = 'public/sitemap.xml'
	  fs.writeFileSync(output,sitemapXML)  	
  })
}
