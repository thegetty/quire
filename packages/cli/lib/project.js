//@ts-check

/**
 * @fileOverview Project Class
 * @license MIT
 *
 */
const EventEmitter = require("events");
const _ = require("lodash");
const execa = require("execa");
const frontmatter = require("yaml-front-matter");
const fs = require("fs-extra");
const glob = require("glob");
const hugo = require("hugo-bin");
const path = require("path");
const spawn = require("child_process").spawn;
const spawnSync = require("child_process").spawnSync;
const execFileSync = require("child_process").execFileSync;
const execSync = require("child_process").execSync;
const util = require("util");
const writeFile = util.promisify(fs.writeFile);
const { URL } = require("url");
const chalk = require("chalk");
const ora = require("ora");
const yaml = require("js-yaml");
const { performance } = require("perf_hooks");

import Epub from "@src/epub";
import imageslice from "@src/imageslice";
import Build from "@src/build";
import {
  commandMissing,
  isWin32,
  removeFile,
  determineBaseURL,
  readYAML
} from "./utils";

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
    super();
    this.config = this.loadConfig();
    if (!this.config.publishDir) {
      this.config.publishDir = "site";
    }
    this.theme = this.config.theme;
    this.chapters = this.loadChapters();
    this.verbose = verbose;
  }

  /**
  * Runs pandoc command for buildEpub and buildMobi
  * @param {string} the destination for the output file
  * @param {string} the path to the cover image
  */
  runPandoc(outputFile, coverImage) {
    // @see https://pandoc.org/MANUAL.html#general-options
    const args = [
      `--from=html-native_divs+native_spans`,
      `--to=epub ${path.join("html","epub.xhtml")}`,
      `--output=${outputFile}`,
      `--epub-metadata=${path.join("html", "dc.xml")}`,
      `--epub-cover-image=${coverImage}`,
      `--template=${path.join("html", "template.xhtml")}`,
      `--css=${path.join(this.config.publishDir, "css", "epub.css")}`,
      `--standalone`
    ];
    execSync(`pandoc ${args.join(' ')}`);
  }

  /**
   * getBaseUrl
   * @returns {Object} YAML data
   * @description Loop through config file to attempt to get the baseURL path for webpack config
   */
  getBaseUrl(arr) {
    let url = arr
      .map(path => {
        return this.loadConfig(path);
      })
      .filter(c => {
        return c.baseURL !== undefined;
      });
    return url;
  }
  /**
   * iiif
   * @description Tiles images to IIIF specification. Called with `quire process --iiif`.
   */
  async iiif() {
    await imageslice();
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
      return readYAML(path || "config.yml");
    } catch (e) {
      this.emit("error", e);
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
      return readYAML(path.join("data", "publication.yml"));
    } catch (e) {
      this.emit("error", e);
    }
  }

  /**
   * loadChapters
   * @returns {Array} Array of chapter paths
   * @description Returns an array of strings which represent relative paths to
   * content files in the project, sorted by weight.
   */
  loadChapters() {
    let contentFiles = glob.sync(
      path.join(this.config.contentDir || "content", "**", "*.md")
    );
    const newLocalFiles = _.sortBy(contentFiles, f => {
      return frontmatter.loadFront(f).weight;
    });
    return newLocalFiles;
  }

  /**
   * preview
   * @description runs `webpack --watch` and `hugo server` as child processes.
   */
  preview(webpackConfig) {
    webpackConfig =
      webpackConfig !== undefined ? webpackConfig : `webpack.config.dev.js`;
    webpackConfig = path.join("webpack", webpackConfig);
    let stdio = this.verbose ? "inherit" : ["pipe", "pipe", process.stderr];
    let cwd = path.join("themes", this.theme);
    let webpackCmd = isWin32() ? "webpack.cmd" : "webpack";
    let webpackBin = path.join("node_modules", ".bin", webpackCmd);
    console.log(`cwd: ${process.cwd()}`);
    console.log(`webpack: ${webpackBin}`);
    this.emit("info", "Launching preview server");
    let spinner = ora({
      text: "Launching preview server"
    }).start();
    this.webpack = spawn(
      webpackBin,
      [`--watch`, "-d", "--progress", "--color", `--config`, webpackConfig],
      {
        cwd,
        stdio
      }
    );
    this.hugo = this.spawnHugo(
      "server",
      `--config=config.yml,${path.join("config", "environments", "dev.yml")}`,
      "--watch"
    );
    spinner.info("Navigate to http://localhost:1313 to see your changes.");
    spinner.info('Press Control+C or type "quire stop" to stop the preview.');
  }

  /**
   * install
   * @description runs `npm install` in the theme subfolder
   */
  install() {
    return new Promise(resolve => {
      let theme = this.config.theme;
      let npmCmd = isWin32() ? "npm.cmd" : "npm";
      let spinner = ora({
        text: "Installing theme dependencies..."
      }).start();
      spawnSync(npmCmd, ["install"], {
        cwd: path.join("themes", theme),
        stdio: "inherit"
      });
      spinner.succeed("Theme dependencies successfully installed.");
      spinner.succeed("Run quire preview to view changes locally.");
      resolve(true);
    });
  }

  /**
   * buildTheme
   * @returns {Promise} Webpack child process
   * @description Returns a `child_process` instance enhanced to also be a `Promise`
   * for a result `Object` with `stdout` and `stderr` properties. This process runs
   * `webpack` in the project theme folder. This process also excepts the argument on what
   *  webpack configuration to use
   */
  buildTheme(webpackConfig, baseURL) {
    baseURL = baseURL.replace(/\/?$/, "/");
    webpackConfig =
      webpackConfig !== undefined ? webpackConfig : `webpack.config.dev.js`;
    webpackConfig = path.join("webpack", webpackConfig);
    let webpackArguments = ["--config", webpackConfig];
    if (webpackConfig.indexOf("prod") !== -1) {
      webpackArguments.push("--output-public-path");
      webpackArguments.push(baseURL);
    }
    let stdio = this.verbose ? "inherit" : ["pipe", "pipe", process.stderr];
    let webpackCmd = isWin32() ? `webpack.cmd` : `webpack`;
    let webpackBin = path.join("node_modules", ".bin", webpackCmd);
    console.log(`cwd: ${process.cwd()}`);
    console.log(`webpack: ${webpackBin}`);
    return execa(webpackBin, webpackArguments, {
      cwd: path.join("themes", this.theme),
      stdio: stdio
    });
  }

  /**
   * buildWeb
   * @description builds the theme (using the buildTheme() method above) and
   * runs `hugo` in the current project folder.
   */
  async buildWeb(env) {
    let configs = ["config.yml", path.join("config", "site.yml")];
    if (env) {
      configs.push(path.join(`config`, `environments`, `${env}.yml`));
    }
    configs.forEach(c => {
      let config = this.loadConfig(c);
      this.config = _.merge(this.config, config);
    });

    let getURL =
      this.getBaseUrl(configs) !== "" ? this.getBaseUrl(configs) : "/";
    let baseURL =     getURL[0] !== undefined &&
      getURL[0].baseURL !== " " &&
      getURL[0].baseURL !== ""
        ? getURL[0].baseURL
        : "/";

    let spinner = ora({
      text: "Building theme assets..."
    }).start();

    try {
      await this.buildTheme(`webpack.config.prod.js`, baseURL);
      spinner.stopAndPersist({
        symbol: "✔ ",
        text: "Assets built"
      });
      execFileSync(hugo, ["--config=" + configs.join(",")], {
        stdio: "inherit"
      });
      spinner.succeed("Site built successfully");
      spinner.succeed(`Files output to: ${this.config.publishDir}`);
      return new Promise(resolve => {
        resolve(true);
      });
    } catch (error) {
      return new Promise(reject => {
        reject(error);
        this.errorExit(`${error}`, spinner);
      });
    }
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
    let contentDir = this.config.contentDir || "content";
    let relPath = path.parse(path.relative(contentDir, chapter));
    let baseURL = determineBaseURL(this.config.baseURL);
    let localhost = "http://localhost:1313";
    if (frontmatter.loadFront(chapter).url) {
      let userDefinedURL = frontmatter.loadFront(chapter).url;
      return new URL(
        path.join(baseURL, userDefinedURL),
        localhost
      ).href.toLowerCase();
    } else if (frontmatter.loadFront(chapter).slug) {
      let userDefinedURL = frontmatter.loadFront(chapter).slug;
      return new URL(
        path.join(baseURL, relPath.dir, userDefinedURL),
        localhost
      ).href.toLowerCase();
    } else if (relPath.name === "_index" || relPath.name === "index") {
      return new URL(
        path.join(baseURL, relPath.dir),
        localhost
      ).href.toLowerCase();
    } else {
      return new URL(
        path.join(baseURL, relPath.dir, relPath.name),
        localhost
      ).href.toLowerCase();
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
  async buildPDF(file, env) {
    await removeFile(
      path.join("themes", this.theme, "static", "css", "application.css")
    );

    let princeCmd = isWin32()
      ? "C:\\Program Files (x86)\\Prince\\engine\\bin\\prince.exe"
      : "prince";
    let spinner = ora("Building PDF").start();
    let start = performance.now();
    let princeArgs;
    if (!isWin32()) {
      this.checkForCommand(princeCmd, spinner);
    }

    let configs = ["config.yml", path.join("config", "pdf.yml")];
    if (env) {
      configs.push(path.join(`config`, `environments`, `${env}.yml`));
    }

    configs.forEach(c => {
      let config = this.loadConfig(c);
      this.config = _.merge(this.config, config);
    });
    file = file !== undefined ? file : path.join(`static`, `downloads`, `output`);

    let fileName = path.basename(file);

    if (fileName.indexOf(".") !== -1) {
      file = fileName.split(".");
      fileName = file[0];
    }

    let filePath = file.substring(0, file.lastIndexOf("/"));

    try {
      await fs.ensureDir(filePath);
    } catch (error) {
      this.errorExit(`${error}`, spinner);
    }
    filePath =
      filePath !== undefined && filePath !== "" ? filePath : path.join("static", "downloads");
    fileName = fileName !== undefined && fileName !== "" ? fileName : "output";

    const fileNamePath = path.join(filePath, fileName);

    let getURL =
      this.getBaseUrl(configs) !== ""
        ? this.getBaseUrl(configs)
        : "localhost:1313";

    let baseURL =
      getURL[0] !== undefined &&
      getURL[0].baseURL !== " " &&
      getURL[0].baseURL !== ""
        ? getURL[0].baseURL
        : "localhost:1313";

    let prefix = "http://";
    if (baseURL.substr(0, prefix.length) !== prefix) {
      baseURL = prefix + baseURL;
    }
    try {
      await this.buildTheme(`webpack.config.prod.js`, baseURL);
      this.hugo = await this.spawnHugo(
        "server",
        "--config=" + configs.join(",")
      );
      let isReady = await this.hugo.ready;
      if (isReady) {
        let chaptersPDF = this.loadChapters();
        princeArgs = _.filter(chaptersPDF, c => {
          return frontmatter.loadFront(c).pdf !== false;
        }).map(c => {
          return this.getURLforChapter(c);
        });
        fs.existsSync(
          path.join("themes", this.theme, "static", "css", "application.css")
        );
        execSync(
          `${princeCmd} ${princeArgs
            .toString()
            .replace(
              /,/g,
              " "
            )} -o ${fileNamePath}.pdf --no-warn-css-unsupported --no-warn-css-unknown --no-warn-css`
        );
        spinner.succeed(`PDF output to: ${fileNamePath}.pdf`);
        spinner.info(
          `Execution Time: ${((performance.now() - start) / 1000).toFixed(
            3
          )} seconds`
        );
      }
      return new Promise(resolve => {
        resolve(true);
        this.hugo.kill();
      });
    } catch (error) {
      return new Promise(reject => {
        reject(false);
        this.hugo.kill();
        this.errorExit(`${error}`, spinner);
      });
    }
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
  async buildEpub(file, env) {
    let spinner = ora("Building EPUB").start();
    let start = performance.now();
    let pub;

    this.checkForCommand("pandoc", spinner);
    await removeFile(
      path.join("themes", this.theme, "static", "css", "epub.css")
    );
    let configs = ["config.yml", path.join("config", "epub.yml")];
    if (env) {
      configs.push(path.join(`config`, `environments`, `${env}.yml`));
    }
    configs.forEach(c => {
      let config = this.loadConfig(c);
      this.config = _.merge(this.config, config);
    });

    try {
      pub = yaml.safeLoad(fs.readFileSync(path.join("data", "publication.yml"), "utf8"));
    } catch (error) {
      if (error) return this.errorExit(`${error}`, spinner);
    }

    if (pub.title === undefined || pub.title === "" || pub.title === null) {
      this.errorExit(
        "A title for your publication must be specified in the publication.yml file.",
        spinner
      );
    }

    if (
      pub.language === undefined ||
      pub.language === "" ||
      pub.language === null
    ) {
      this.errorExit(
        "A language for your publication must be specified in the publication.yml file.",
        spinner
      );
    }

    let getURL =
      this.getBaseUrl(configs) !== "" ? this.getBaseUrl(configs) : "/";
    let baseURL =
      getURL[0] !== undefined &&
      getURL[0].baseURL !== " " &&
      getURL[0].baseURL !== ""
        ? getURL[0].baseURL
        : "/";

    try {
      this.hugo = await this.spawnHugo(
        "server",
        "--renderToDisk",
        "--config=" + configs.join(",")
      );

      await this.buildTheme(`webpack.config.epub.js`, baseURL);

      let ready = await this.hugo.ready;

      if (ready) {
        await fs.copy(
          path.join("themes", this.theme, "static", "css", "epub.css"),
          path.join(this.config.publishDir, "css", "epub.css")
        );
        let bookData = this.loadBookData();
        let configData = this.config;
        bookData.chapters = this.chapters
          .filter(c => {
            return frontmatter.loadFront(c).epub !== false;
          })
          .map(c => this.getURLforChapter(c));
        let ebook = await new Epub(bookData, configData);
        let data = await ebook.generate();
        let epub = await new Build(data, spinner);
        let dir = "html";
        let dirCreated = fs.existsSync(dir);

        if (dirCreated) {
          const fileNamePath = file !== undefined ? file : path.join("static", "downloads", "output");
          const filePath = path.dirname(fileNamePath);
          const fileName = path.basename(fileNamePath);
          await fs.ensureDir(filePath);
          const coverImage = epub.data.cover
            ? path.join(
                "static",
                "img",
                epub.data.cover.replace("http://localhost:1313/img/", "")
              )
            : "";
          const outputFile = `${fileNamePath}.epub`;
          this.runPandoc(outputFile, coverImage);
          spinner.succeed(`Filepath: ${fileNamePath}.epub`);
          spinner.info(
            `Execution Time: ${((performance.now() - start) / 1000).toFixed(
              3
            )} seconds`
          );
          await removeFile(path.join(`site`, `source.js`));
          await removeFile(
            path.join("themes", this.theme, "static", "source.js")
          );
          return new Promise(resolve => {
            resolve(true);
            this.hugo.kill();
            epub.removeHTML();
          });
        }
      }
    } catch (error) {
      return new Promise(reject => {
        reject(false);
        this.hugo.kill();
        this.errorExit(`${error}`, spinner);
      });
    }
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
  async buildMobi(file, env) {
    let spinner = ora("Building MOBI").start();
    let start = performance.now();
    let pub;

    this.checkForCommand("pandoc", spinner);
    await removeFile(
      path.join("themes", this.theme, "static", "css", "epub.css")
    );
    let configs = ["config.yml", path.join("config", "epub.yml")];
    if (env) {
      configs.push(path.join(`config`, `environments`, `${env}.yml`));
    }
    configs.forEach(c => {
      let config = this.loadConfig(c);
      this.config = _.merge(this.config, config);
    });

    try {
      pub = yaml.safeLoad(fs.readFileSync(path.join("data", "publication.yml"), "utf8"));
    } catch (error) {
      if (error) return this.errorExit(`${error}`, spinner);
    }

    if (pub.title === undefined || pub.title === "" || pub.title === null) {
      this.errorExit(
        "A title for your publication must be specified in the publication.yml file.",
        spinner
      );
    }

    if (
      pub.language === undefined ||
      pub.language === "" ||
      pub.language === null
    ) {
      this.errorExit(
        "A language for your publication must be specified in the publication.yml file.",
        spinner
      );
    }

    let getURL =
      this.getBaseUrl(configs) !== "" ? this.getBaseUrl(configs) : "/";
    let baseURL =
      getURL[0] !== undefined &&
      getURL[0].baseURL !== " " &&
      getURL[0].baseURL !== ""
        ? getURL[0].baseURL
        : "/";

    try {
      this.hugo = await this.spawnHugo(
        "server",
        "--renderToDisk",
        "--config=" + configs.join(",")
      );

      await this.buildTheme(`webpack.config.epub.js`, baseURL);
      let ready = await this.hugo.ready;
      if (ready) {
        await fs.copy(
          path.join("themes", this.theme, "static", "css", "epub.css"),
          path.join(this.config.publishDir, "css", "epub.css")
        );
        let bookData = this.loadBookData();
        let configData = this.config;
        bookData.chapters = this.chapters
          .filter(c => {
            return frontmatter.loadFront(c).epub !== false;
          })
          .map(c => this.getURLforChapter(c));
        let ebook = await new Epub(bookData, configData);
        let data = await ebook.generate();
        let epub = await new Build(data, spinner);
        let dir = "html";
        let dirCreated = fs.existsSync(dir);
        if (dirCreated) {
          const fileNamePath = file !== undefined ? file : path.join("static", "downloads", "output");
          const filePath = path.dirname(fileNamePath);
          const fileName = path.basename(fileNamePath);
          await fs.ensureDir(filePath);
          const coverImage = epub.data.cover
            ? path.join(
                "static",
                "img",
                epub.data.cover.replace("http://localhost:1313/img/", "")
              )
            : "";
          const outputFile = `${fileNamePath}-mobi.epub`;
          this.runPandoc(outputFile, coverImage);
          const kindlegenCmd = isWin32()
            ? "C:\\Program Files (x86)\\Kindle Previewer 3\\lib\\fc\\bin\\kindlegen"
            : "/Applications/Kindle Previewer 3.app/Contents/lib/fc/bin/kindlegen";
          if (!fs.existsSync(kindlegenCmd)) {
            this.errorExit("Warning: Kindle Previewer is required to generate MOBI files. Please visit https://kdp.amazon.com/en_US/help/topic/G202131170 for more info and install instructions.", spinner);
          }
          execSync(`"${kindlegenCmd}" ${fileNamePath}-mobi.epub -o ${fileName}.mobi`);
          spinner.succeed(`Filepath: ${filePath}.mobi`);
          spinner.info(
            `Execution Time: ${((performance.now() - start) / 1000).toFixed(
              3
            )} seconds`
          );

          // Clean up
          await removeFile(outputFile);

          this.hugo.kill();
          epub.removeHTML();

          return new Promise((resolve, reject) => {
            resolve(true);
          });
        }
      }
    } catch (error) {
      return new Promise(reject => {
        reject(false);
        this.hugo.kill();
        this.errorExit(`${error}`, spinner);
      });
    }
  }

  checkForCommand(cmd, spinner) {
    if (commandMissing(cmd)) {
      this.errorExit(`Please install ${cmd} before continuing.`, spinner);
    }
  }

  //Error and exit
  errorExit(m, s) {
    s.fail(m);
    process.exit(1);
  }

  spawnHugo() {
    let errors = "";
    let reject, resolve;
    let hugoServer = spawn(hugo, [...arguments]);

    hugoServer.ready = new Promise((promiseResolve, promiseReject) => {
      resolve = promiseResolve;
      reject = promiseReject;
    });

    // Output Hugo Info
    hugoServer.stdout.on("data", buf => {
      let text = buf.toString();
      let output = chalk.cyan(text);

      if (this.verbose) {
        console.log(output);
      }

      // Server is ready
      if (text.indexOf("Press Ctrl+C to stop") > -1) {
        resolve(text, hugoServer);
      }
    });

    // Gather Hugo Errors
    hugoServer.stderr.on("data", buf => {
      errors += buf.toString();
    });

    // Output Hugo Errors on exit
    hugoServer.on("exit", (code, signal) => {
      if (errors) {
        this.emit("error", errors);
        reject(errors, hugoServer);
      }
    });

    return hugoServer;
  }
}

export default Project;
