/**
 * @fileOverview Project Class
 * @author Eric Gardner / Getty Publications
 * @license MIT
 *
 */
const EventEmitter = require('events')
const Epub = require('./epub')
const Build = require('./build')
const _ = require('lodash')
const execa = require('execa')
const frontmatter = require('yaml-front-matter')
const fs = require('fs-extra')
const glob = require('glob')
const hugo = require('hugo-bin')
const path = require('path')
const spawn = require('child_process').spawn
const spawnSync = require('child_process').spawnSync
// const execFile = require('child_process').execFile
const execFileSync = require('child_process').execFileSync
const execSync = require('child_process').execSync
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const { URL } = require('url')
const { commandMissing, readYAML, determineBaseURL, deleteFolderRecursive } = require('./utils')
const chalk = require('chalk')
// const EOL = require('os').EOL
// const rimraf = require('rimraf')
// const rimrafp = util.promisify(rimraf)
// const upath = require('upath')
const kindlegen = require('kindlegen')
const ora = require('ora')
const pandocTemplate = require('./templates/epubTemplate')
const yaml = require('js-yaml')



/**
 * Project Class.
 *
 * @extends EventEmitter
 * @description The Project class represents an existing Quire project (i.e. a
 * Hugo project with a few extras like a publication.yml file). Like the CLI
 * class it inherits the EventEmitter API in order to send signals based on
 * certain actions taken by the user (commands, kill signal, etc).
 *
 * Usage: a Project instance is created whenever the user runs any commands that
 * work with an existing site (`quire preview` and `quire pdf` for example, but
 * not `quire new`). The constructor does not take any arguments, but the
 * current working directory is used to determine the value various properties.
 * The constructor method attempts to read values from local YAML files.
 */
class Project extends EventEmitter {
  constructor(verbose) {
    super()
    this.config = this.loadConfig()
    if (!this.config.publishDir) { this.config.publishDir = 'site' }
    this.theme = this.config.theme
    this.chapters = this.chapters()
    this.verbose = verbose
  }

  /**
   * loadConfig
   * @returns {Object} YAML data
   * @description Attempts to read a pass yaml file or `config.yml` file in the current directory
   * inside a try/catch block. If successful, returns a JS object with
   * properties corresponding to the YAML fields.
   */
  loadConfig(path) {
    try {
      return readYAML(path || 'config.yml')
    } catch (e) {
      this.emit('error', e)
    }
  }

  /**
   * loadBookData
   * @returns {Object} YAML data
   * @description Attempts to read a `publication.yml` file in the ./data
   * directory inside a try/catch block. If successful, returns a JS object with
   * properties corresponding to the YAML fields.
   */
  loadBookData() {
    try {
      return readYAML(path.join('data', 'publication.yml'))
    } catch (e) {
      this.emit('error', e)
    }
  }

  /**
   * chapters
   * @returns {Array<String>} Array of chapter paths
   * @description Returns an array of strings which represent relative paths to
   * content files in the project, sorted by weight.
   */
  chapters() {
    let contentFiles = glob.sync(path.join(this.config.contentDir || 'content', '**', '*.md'))
    return _.sortBy(contentFiles, f => { return frontmatter.loadFront(f).weight })
  }

  /**
   * check Operating System
   * @returns {boolean} 
   */
  isWin() {
    return process.platform === 'win32' ? true : false
  }

  /**
   * preview
   * @description runs `webpack --watch` and `hugo server` as child processes.
   */
  preview(webpackConfig) {
    webpackConfig = webpackConfig !== undefined ? webpackConfig : `webpack.config.dev.js`
    webpackConfig = 'webpack/' + webpackConfig
    let stdio = this.verbose ? 'inherit' : ['pipe', 'pipe', process.stderr]
    let cwd = path.join('themes', this.theme)
    let webpackCmd = this.isWin() ? 'webpack.cmd' : 'webpack'
    let webpackBin = path.join('node_modules', '.bin', webpackCmd)
    this.emit('info', 'Launching preview server')
    let spinner = ora({
      text: 'Launching preview server'
    }).start()
    this.webpack = spawn(webpackBin, [`--watch`, '-d', '--progress', '--color', `--config`, webpackConfig], {
      cwd,
      stdio
    })
    this.hugo = this.spawnHugo('server', '--config=config.yml,config/environments/dev.yml', '--watch', '-D')
    spinner.info(['Navigate to http://localhost:1313 to see your changes.'])
    spinner.info(['Press Control+C or type "quire stop" to stop the preview.'])
  }

  /**
   * install
   * @description runs `npm install` in the theme subfolder
   */
  install() {
    let theme = this.config.theme
    let npmCmd = this.isWin() ? 'npm.cmd' : 'npm'
    let spinner = ora({
      text: 'Installing theme dependencies...'
    }).start()
    spawnSync(npmCmd, ['install'], {
      cwd: path.join('themes', theme),
      stdio: 'inherit'
    }, function (err) {
      if (err) this.errorExit(`${err}`, spinner)
    })
    spinner.succeed(['Theme dependencies successfully installed.'])
    spinner.succeed(['Run quire preview to view changes locally.'])
  }

  /**
   * buildTheme
   * @returns {Promise} Webpack child process
   * @description Returns a `child_process` instance enhanced to also be a `Promise`
   * for a result `Object` with `stdout` and `stderr` properties. This process runs
   * `webpack` in the project theme folder. This process also excepts the argument on what 
   *  webpack configuration to use
   */
  buildTheme(webpackConfig) {
    webpackConfig = webpackConfig !== undefined ? webpackConfig : `webpack.config.dev.js`
    webpackConfig = 'webpack/' + webpackConfig
    let stdio = this.verbose ? 'inherit' : ['pipe', 'pipe', process.stderr]
    let webpackCmd = this.isWin() ? `webpack.cmd` : `webpack`
    let webpackBin = path.join('node_modules', '.bin', webpackCmd)
    return execa(webpackBin, ['--config', webpackConfig], {
      cwd: path.join('themes', this.theme),
      stdio: stdio
    })
  }

  /**
   * buildWeb
   * @description builds the theme (using the buildTheme() method above) and
   * runs `hugo` in the current project folder.
   */
  buildWeb(env) {
    let outputDir = this.config.publishDir || 'site'
    let configs = ['config.yml', 'config/site.yml']
    if (env) {
      configs.push(`config/environments/${env}.yml`)
    }
    configs.forEach((c) => {
      let config = this.loadConfig(c);
      this.config = _.merge(this.config, config);
    });
    let spinner = ora({
      text: 'Building theme assets...'
    }).start()
    this.buildTheme(`webpack.config.prod.js`)
      .then(() => {
        execFileSync(hugo, ['--config=' + configs.join(',')], { stdio: 'inherit' })
        spinner.succeed(['Site built successfully'])
        spinner.succeed([`Files output to: ${outputDir}`])
      })
      .catch(e => {
        spinner.fail([`${e.message}`])
      })
  }

  /**
   * getURLforChapter
   * @param {String} chapter path
   * @returns {String} Localhost URL
   * @description When given the relative path for a chapter, returns the
   * appropriate URL to view the content when the preview server is running.
   * index.md files will correctly resolve to their parent directories.
   */
  getURLforChapter(chapter) {
    let contentDir = (this.config.contentDir || 'content')
    let relPath = path.parse(path.relative(contentDir, chapter))
    let baseURL = determineBaseURL(this.config.baseURL)
    let localhost = 'http://localhost:1313'
    if (frontmatter.loadFront(chapter).url) {
      let userDefinedURL = frontmatter.loadFront(chapter).url
      return new URL(path.join(baseURL, userDefinedURL), localhost).href.toLowerCase()
    } else if (frontmatter.loadFront(chapter).slug) {
      let userDefinedURL = frontmatter.loadFront(chapter).slug
      return new URL(path.join(baseURL, relPath.dir, userDefinedURL), localhost).href.toLowerCase()
    } else if (relPath.name === '_index' || relPath.name === 'index') {
      return new URL(path.join(baseURL, relPath.dir), localhost).href.toLowerCase()
    } else {
      return new URL(path.join(baseURL, relPath.dir, relPath.name), localhost).href.toLowerCase()
    }
  }

  /**
   * buildPDF
   * @description Checks to ensure `prince` command is available. If so,
   * builds the PDF version of the book by filtering out a subset of all
   * chapters which do not have a `pdf` flag set to false in frontmatter. The
   * order of operations is: 1) run `hugo server` 2) build the theme with
   * webpack, 3) hit each of the PDF chapters with `prince`
   */
  buildPDF(file, env) {
    let princeCmd = this.isWin() ? "C:\\Program Files (x86)\\Prince\\engine\\bin\\prince.exe" : 'prince'
    let spinner = ora('Building PDF').start()

    if (!this.isWin()) {
      this.checkForCommand(princeCmd, spinner)
    }

    let configs = ['config.yml', 'config/epub.yml']
    if (env) {
      configs.push(`config/environments/${env}.yml`)
    }

    configs.forEach((c) => {
      let config = this.loadConfig(c);
      this.config = _.merge(this.config, config);
    })

    let hugoServer = this.spawnHugo('server', '--config=' + configs.join(','))

    let princeArgs = _
      .filter(this.chapters, c => { return frontmatter.loadFront(c).pdf !== false })
      .map(c => { return this.getURLforChapter(c) })

    file = file !== undefined ? file : 'static/downloads/output'
    let fileName = path.basename(file)
    if (fileName.indexOf('.') !== -1) {
      fileName = fileName.split('.')
      filename = fileName[0]
    }
    let filePath = file.substring(0, file.lastIndexOf("/"))
    filePath = filePath !== undefined && filePath !== '' ? filePath : 'static/downloads'
    fileName = fileName !== undefined && fileName !== '' ? fileName : 'output'
    fs.ensureDir(filePath)
      .then(() => { })
      .catch(e => {
        this.errorExit(`${e}`, spinner)
      })

    let fileNamePath = `${filePath}/${fileName}`

    this.buildTheme(`webpack.config.prod.js`)
      .then(() => {
        execSync(`${princeCmd} ${princeArgs.toString().replace(/,/g, ' ')} -o ${fileNamePath}.pdf --no-warn-css-unsupported --no-warn-css-unknown --no-warn-css`)
        hugoServer.kill()
        spinner.succeed([`PDF output to: ${fileNamePath}.pdf`])
      })
      .catch(e => {
        this.errorExit(`${e.message}`, spinner)
      })
  }

  /**
 * buildEpub
 * @description This function builds html with Hugo. It creates a css file from webpack.
 * The chapter html is mutated then merged then processed through Pandoc. This process 
 * results in an EPUB. The cover image is taken from publication.yml in the main directory.
 * This process has its own webpack configuration in the webpack folder. After the EPUB is 
 * created a number of files and folders that were created are deleted.
 * 
 */
  buildEpub(file, env) {
    let spinner = ora('Building EPUB').start()
    let pub
    this.checkForCommand('pandoc', spinner)
    this.checkForFileRemove(path.join('themes', this.theme, 'static', 'css', 'epub.css'))
    let configs = ['config.yml', 'config/epub.yml']
    if (env) {
      configs.push(`config/environments/${env}.yml`)
    }
    configs.forEach((c) => {
      let config = this.loadConfig(c);
      this.config = _.merge(this.config, config);
    });
    this.hugo = this.spawnHugo('server', '--renderToDisk', '--config=' + configs.join(','));
    try {
      pub = yaml.safeLoad(fs.readFileSync('data/publication.yml', 'utf8'));
    } catch (e) {
      if (e) return this.errorExit(`${e}`, spinner)
    }
    if (pub.title === undefined || pub.title === '' || pub.title === null) {
      this.errorExit('A title for your publication must be specified in the publication.yml file.', spinner)
    }
    if (pub.language === undefined || pub.language === '' || pub.language === null) {
      this.errorExit('A language for your publication must be specified in the publication.yml file.', spinner)
    }
    this.buildTheme(`webpack.config.epub.js`)
      .then(() => {
        return this.hugo.ready
      })
      .then(() => {
        fs.copy(path.join('themes', this.theme, 'static', 'css', 'epub.css'), path.join('site', 'css', 'epub.css'), err => {
          if (err) return this.errorExit(`${err}`, spinner)
        })
      })
      .then((output, server) => {
        let bookData = this.loadBookData()
        let configData = this.config
        bookData.chapters = _
          .filter(this.chapters, c => { return frontmatter.loadFront(c).epub !== false })
          .map(c => this.getURLforChapter(c))
        let ebook = new Epub(bookData, configData)
        return ebook
      })
      .then((ebook) => ebook.generate())
      .then((data) => {
        if (data.language === '' || data.language === undefined) {
          this.errorExit('A language for your publication must be specified in the publication.yml file.', spinner)
        }
        else if (data.title === '' || data.title === undefined) {
          this.errorExit('A title for your publication must be specified in the publication.yml file.', spinner)
        } else {
          let output = new Build(data, spinner)
          return output
        }
      })
      .then((output) => {
        let dir = 'html/'
        let epubfile = file !== undefined ? file : 'static/downloads/output'
        this.checkFolderCreated(dir, err => {
          if (err) throw this.errorExit(`${err}`, spinner)
          let fileName = path.basename(epubfile)
          if (fileName.indexOf('.') !== -1) {
            fileName = fileName.split('.')
            filename = fileName[0]
          }
          let filePath = epubfile.substring(0, epubfile.lastIndexOf("/"))
          filePath = filePath !== undefined && filePath !== '' ? filePath : 'static/downloads'
          fileName = fileName !== undefined && fileName !== '' ? fileName : 'output'
          fs.ensureDir(filePath)
            .then(() => { })
            .catch(e => {
              this.errorExit(`${e}`, spinner)
            })
          let cover = output.data.cover !== undefined ? output.data.cover.replace('http://localhost:1313/img/', '') : ''
          cover = cover !== '' ? `--epub-cover-image=static/img/${cover}` : ''
          let fileNamePath = `${filePath}/${fileName}`
          let args = `-f html-native_divs+native_spans -t epub html/epub.xhtml -o ${fileNamePath}.epub --epub-metadata=html/dc.xml ${cover} --template=html/template.xhtml --css=site/css/epub.css -s`
          execSync(`pandoc ${args}`)
          spinner.succeed([`filepath: ${fileNamePath}.epub`])
        })
      })
      .then(() => this.hugo.kill())
      .then(() => {
        // Remove uneeded files and folders 
        let epub = new Build()
        epub.removeHTML()
        this.checkForFileRemove(`site/source.js`)
        this.checkForFileRemove(path.join('themes', this.theme, 'static', 'source.js'))
      })
      .catch(e => {
        this.errorExit(`${e.message}`, spinner)
      })
  }

  /**
 * buildMobi
 * @description This function builds html with Hugo. It creates a css file from webpack.
 * The chapter html is mutated then merged then processed through Pandoc. This process 
 * results in an EPUB. The cover image is taken from publication.yml in the main directory.
 * This process has its own webpack configuration in the webpack folder. After the EPUB is 
 * created, the EPUB is processed by the kindlegen package https://www.npmjs.com/package/kindlegen. 
 * After the MOBI is created a number of files and folders that were created are deleted.
 * 
 */
  buildMobi(file, env) {
    let spinner = ora('Building MOBI').start()
    let pub
    this.checkForCommand('pandoc', spinner)
    this.checkForFileRemove(path.join('themes', this.theme, 'static', 'css', 'epub.css'))
    let configs = ['config.yml', 'config/epub.yml']
    if (env) {
      configs.push(`config/environments/${env}.yml`)
    }
    configs.forEach((c) => {
      let config = this.loadConfig(c);
      this.config = _.merge(this.config, config);
    });
    try {
      pub = yaml.safeLoad(fs.readFileSync('data/publication.yml', 'utf8'));
    } catch (e) {
      if (e) return this.errorExit(`${e}`, spinner)
    }
    if (pub.title === undefined || pub.title === '' || pub.title === null) {
      this.errorExit('A title for your publication must be specified in the publication.yml file.', spinner)
    }
    if (pub.language === undefined || pub.language === '' || pub.language === null) {
      this.errorExit('A language for your publication must be specified in the publication.yml file.', spinner)
    }
    this.hugo = this.spawnHugo('server', '--renderToDisk', '--config=' + configs.join(','));
    this.buildTheme(`webpack.config.epub.js`)
      .then(() => {
        return this.hugo.ready
      })
      .then(() => {
        fs.copy(path.join('themes', this.theme, 'static', 'css', 'epub.css'), path.join('site', 'css', 'epub.css'), err => {
          if (err) return this.errorExit(`${err}`, spinner)
        })
      })
      .then((output, server) => {
        let bookData = this.loadBookData()
        let configData = this.config
        bookData.chapters = _
          .filter(this.chapters, c => { return frontmatter.loadFront(c).epub !== false })
          .map(c => this.getURLforChapter(c))
        let ebook = new Epub(bookData, configData)
        return ebook
      })
      .then((ebook) => ebook.generate())
      .then((data) => {
        if (data.language === '' || data.language === undefined) {
          this.errorExit('A language for your publication must be specified in the publication.yml file.', spinner)
        }
        else if (data.title === '' || data.title === undefined) {
          this.errorExit('A title for your publication must be specified in the publication.yml file.', spinner)
        } else {
          let output = new Build(data, spinner)
          return output
        }
      })
      .then((output) => {
        let dir = 'html/'
        let epubfile = file !== undefined ? file : 'static/downloads/output'
        this.checkFolderCreated(dir, err => {
          if (err) throw this.errorExit(`${err}`, spinner)
          let fileName = path.basename(epubfile)
          if (fileName.indexOf('.') !== -1) {
            fileName = fileName.split('.')
            filename = fileName[0]
          }
          let filePath = epubfile.substring(0, epubfile.lastIndexOf("/"))
          filePath = filePath !== undefined && filePath !== '' ? filePath : 'static/downloads'
          fileName = fileName !== undefined && fileName !== '' ? fileName : 'output'
          fs.ensureDir(filePath)
            .then(() => { })
            .catch(e => {
              this.errorExit(`${e}`, spinner)
            })
          let cover = output.data.cover !== undefined ? output.data.cover.replace('http://localhost:1313/img/', '') : ''
          cover = cover !== '' ? `--epub-cover-image=static/img/${cover}` : ''
          let fileNamePath = `${filePath}/${fileName}`
          let args = `-f html-native_divs+native_spans -t epub html/epub.xhtml -o ${fileNamePath}-mobi.epub --epub-metadata=html/dc.xml ${cover} --template=html/template.xhtml --css=site/css/epub.css -s`
          execSync(`pandoc ${args}`)
          kindlegen(fs.readFileSync(`${fileNamePath}-mobi.epub`), (error, mobi) => {
            if (error) throw this.errorExit(`${error}`, spinner)
            writeFile(`${fileNamePath}.mobi`, mobi)
            spinner.succeed([`filepath: ${fileNamePath}.mobi`])
            this.checkForFileRemove(`${fileNamePath}-mobi.epub`)
          })
        })
      })
      .then(() => this.hugo.kill())
      .then(() => {
        // Remove uneeded files and folders 
        let epub = new Build()
        epub.removeHTML()
        this.checkForFileRemove(`site/source.js`)
        this.checkForFileRemove(path.join('themes', this.theme, 'static', 'source.js'))
      })
      .catch(e => {
        this.errorExit(`${e.message}`, spinner)
      })
  }

  /**
   * Download Template
   * @description TODO
   */
  downloadTemplate(type) {
    switch (type) {
      case 'epub':
        let spinner = ora('Downloading templates to epub/').start()
        if (fs.existsSync('epub/')) {
          spinner.warn([`Directory and files already exist`])
          return true
        }
        fs.mkdirSync('epub/')
        writeFile(`epub/template.xhtml`, pandocTemplate.template)
        spinner.succeed([`filepath: epub/template.xhtml`])
        break;

      default:
        spinner.succeed([`Please add an argument of type example:epub`])
        break;
    }
  }

  // TODO: move to utils?
  checkFolderCreated(dir, done) {
    let results = []
    fs.readdir(dir, (err, list) => {
      if (err) return done(err)
      let pending = list.length
      if (!pending) return done(null, results)
      list.forEach(file => {
        file = path.resolve(dir, file)
        fs.stat(file, (err, stat) => {
          if (stat && stat.isDirectory()) {
            checkFolderCreated(file, (err, res) => {
              results = results.concat(res)
              if (!--pending) done(null, results)
            });
          } else {
            results.push(file)
            if (!--pending) done(null, results)
          }
        })
      })
    })
  }

  // TODO: move to utils?
  checkForFileRemove(filepath) {
    fs.ensureFile(filepath, err => {
      fs.unlinkSync(filepath)
    })
  }

  // TODO: move to utils?
  checkForCommand(cmd, spinner) {
    if (commandMissing(cmd)) {
      this.errorExit(`Please install ${cmd} before continuing.`, spinner)
    }
  }

  //Error and exit
  errorExit(m, s) {
    s.fail([new Error(m), null])
    process.exit(1)
  }

  // TODO
  // determineBaseURL () {
  //   let baseURL = this.config.baseURL;
  //   // baseUrl must have a protocol for URL parsing if it has a port
  //   // otherwise the port is parsed as the pathname.
  //   // If it is missing, we are going to assume http protocol
  //   if (baseURL.indexOf("://") === -1 &&
  //       baseURL.indexOf(":") > -1) {
  //     baseURL = "http://" + this.config.baseURL;
  //   }
  //   try {
  //     return new URL(baseURL).pathname
  //   } catch (e) {
  //     if (e instanceof TypeError) {
  //       return path.parse(baseURL || '').name
  //     }
  //   }
  // }

  spawnHugo() {
    let errors = ''
    let reject, resolve
    let hugoServer = spawn(hugo, [...arguments])

    hugoServer.ready = new Promise((promiseResolve, promiseReject) => {
      resolve = promiseResolve
      reject = promiseReject
    })

    // Output Hugo Info
    hugoServer.stdout.on('data', (buf) => {
      let text = buf.toString()
      let output = chalk.cyan(text)

      if (this.verbose) {
        console.log(output)
      }

      // Server is ready
      if (text.indexOf("Press Ctrl+C to stop") > -1) {
        resolve(text, hugoServer)
      }
    });

    // Gather Hugo Errors
    hugoServer.stderr.on('data', (buf) => {
      errors += buf.toString()
    });

    // Output Hugo Errors on exit
    hugoServer.on('exit', (code, signal) => {
      if (errors) {
        this.emit('error', errors)
        reject(errors, hugoServer)
      }
    })

    return hugoServer
  }
}

module.exports = Project