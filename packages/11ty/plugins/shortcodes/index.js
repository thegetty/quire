const globalData = require('../globalData')

const backmatter = require('./backmatter.js')
const cite = require('./cite.js')
const contributor = require('./contributor')
const div = require('./div.js')
const figure = require('./figure/index.js')
const figureComponents = require('./figure/components')
const figureGroup = require('./figureGroup.js')
const ref = require('./figureRef.js')
const title = require('./title.js')
const tombstone = require('./tombstone.js')

const liquidArgs = require('liquid-args')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPairedShortcode('backmatter', function(content, ...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return backmatter(context, content, ...args)
  })

  eleventyConfig.addPairedShortcode('class', function(content, ...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return div(context, content, ...args)
  })

  eleventyConfig.addJavaScriptFunction('cite', function(...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return cite(context, ...args)
  })

  eleventyConfig.addLiquidTag('cite', function(liquidEngine) {
    const context = { eleventyConfig, globalData, page: this.page }
    const renderComponent = function(...args) {
      const kwargs = args.find((arg) => arg.__keywords)
      return cite(context, kwargs)
    }
    return {
      parse: function(tagToken) {
        this.args = tagToken.args
      },
      render: async function(scope) {
        const evalValue = (arg) => liquidEngine.evalValue(arg, scope)
        const args = await Promise.all(liquidArgs(this.args, evalValue))
        return renderComponent(...args)
      }
    }
  })


  eleventyConfig.addJavaScriptFunction('contributor', function(...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return contributor(context, ...args)
  })

  eleventyConfig.addLiquidTag('contributor', function(liquidEngine) {
    const context = { eleventyConfig, globalData, page: this.page }
    const renderComponent = function(...args) {
      const kwargs = args.find((arg) => arg.__keywords)
      return contributor(context, kwargs)
    }
    return {
      parse: function(tagToken) {
        this.args = tagToken.args
      },
      render: async function(scope) {
        const evalValue = (arg) => liquidEngine.evalValue(arg, scope)
        const args = await Promise.all(liquidArgs(this.args, evalValue))
        return renderComponent(...args)
      }
    }
  })

  eleventyConfig.addJavaScriptFunction('qicon', function(...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return icon(context, ...args)
  })

  eleventyConfig.addLiquidTag('qicon', function(liquidEngine) {
    const context = { eleventyConfig, globalData, page: this.page }
    const renderComponent = function(...args) {
      const kwargs = args.find((arg) => arg.__keywords)
      return icon(context, kwargs)
    }
    return {
      parse: function(tagToken) {
        this.args = tagToken.args
      },
      render: async function(scope) {
        const evalValue = (arg) => liquidEngine.evalValue(arg, scope)
        const args = await Promise.all(liquidArgs(this.args, evalValue))
        return renderComponent(...args)
      }
    }
  })

  eleventyConfig.addJavaScriptFunction('figure', function(...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return figure(context, ...args)
  })

  eleventyConfig.addLiquidTag('figure', function(liquidEngine) {
    const context = { eleventyConfig, globalData, page: this.page }
    const renderComponent = function(...args) {
      const kwargs = args.find((arg) => arg.__keywords)
      return figure(context, kwargs)
    }
    return {
      parse: function(tagToken) {
        this.args = tagToken.args
      },
      render: async function(scope) {
        const evalValue = (arg) => liquidEngine.evalValue(arg, scope)
        const args = await Promise.all(liquidArgs(this.args, evalValue))
        return renderComponent(...args)
      }
    }
  })

  eleventyConfig.addJavaScriptFunction('figuregroup', function(...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return figureGroup(context, ...args)
  })

  eleventyConfig.addLiquidTag('figuregroup', function(liquidEngine) {
    const context = { eleventyConfig, globalData, page: this.page }
    const renderComponent = function(...args) {
      const kwargs = args.find((arg) => arg.__keywords)
      return figureGroup(context, kwargs)
    }
    return {
      parse: function(tagToken) {
        this.args = tagToken.args
      },
      render: async function(scope) {
        const evalValue = (arg) => liquidEngine.evalValue(arg, scope)
        const args = await Promise.all(liquidArgs(this.args, evalValue))
        return renderComponent(...args)
      }
    }
  })

  eleventyConfig.addShortcode('ref', function(ids) {
    const context = { eleventyConfig, globalData, page: this.page }
    return ref(context, ids)
  })

  eleventyConfig.addShortcode('title', function() {
    const context = { eleventyConfig, globalData, page: this.page }
    return title(context)
  })

  eleventyConfig.addShortcode('tombstone', function(...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return tombstone(context, ...args)
  })

  /**
   * Figure subcomponents
   */
  eleventyConfig.namespace('qfigure', () => {
    Object.keys(figureComponents).forEach((name) => 
      eleventyConfig.addJavaScriptFunction(name, function(...args) {
        const context = { eleventyConfig, globalData, page: this.page }
        return figureComponents[name](context, ...args)
      })
    )
  })
}
