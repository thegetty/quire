/**
 * @fileOverview CLI class
 * @license MIT
 *
 */
const EventEmitter = require("events");
const chalk = require("chalk");
const execa = require("execa");
const execSync = require("child_process").execSync;
const path = require("path");
const rimraf = require("rimraf");
const spawnSync = require("child_process").spawnSync;
const readline = require("readline");
const fs = require("fs-extra");

import Project from "@src/project";
import { commandMissing, copy } from "@src/utils";

/**
 * CLI class.
 *
 * @extends EventEmitter
 * @description The CLI class is the core of the `quire` program. The class
 * extends Node's [EventEmitter](https://nodejs.org/api/events.html) base class
 * because using an events-based api is useful when respoding to user input --
 * in particular, the user could send a SIGINT signal at any time, and by
 * emitting an event whenever this happens, the Quire instance can make sure
 * to kill any child processes before terminating.
 *
 * Another API which has proven useful in developing this program is the Promise
 * interface. Quire relies on the [execa](https://github.com/sindresorhus/execa)
 * library which provides a promise-based interface to child processes, which
 * makes error-handling and control flow easier to follow.
 */
export default class CLI extends EventEmitter {
  constructor() {
    super();
    // this.currentDir = process.cwd()
    this.on("debug", this.debug);
    this.on("epub", this.epub);
    this.on("error", this.warn);
    this.on("process", this.process);
    this.on("install", this.install);
    this.on("mobi", this.mobi);
    this.on("new", this.create);
    this.on("pdf", this.pdf);
    this.on("preview", this.preview);
    this.once("shutdown", this.shutdown);
    this.on("site", this.site);
    this.on("template", this.template);

    // TODO: handle errors emitted by the Project object here somewhere.
    // project.on('error', this.warn)
    // project.on('info', this.notice)

    this.isVerbose = false;
  }

  /**
   * Create "projectName"
   *
   * @param {string} projectName Name of the local project directory to be created.
   * @description Sets up a new local Quire project in the desired directory. This command
   * is a wrapper for the underlying shell commands (primarily `git`), which
   * are executed in a promise chain. The user must have the `git` shell
   * commands available on their system to create a new project; this method
   * will emit a warning and exit with code 1 if `git` is not available.
   */
  create(projectName) {
    const rootDir = path.resolve(__dirname, "..", "bin");
    const starter= "default";
    const theme = "default";
    const localStarterDir = path.resolve(rootDir, "starters", starter);
    const localThemeDir = path.resolve(rootDir, "themes", theme);

    const projectDir = path.resolve(projectName);
    const projectThemeDir = path.resolve(projectName, "themes", theme);

    return new Promise(async (resolve, reject) => {
      if (commandMissing("git")) {
        this.error("Please install Git before continuing.");
      } else if (fs.existsSync(projectDir)) {
        this.error(
          `${projectDir} directory already exists, please select another project name.`
        );
      } else {
        this.notice("Creating project...");

        // Copy Starter
        this.notice(`Using starter: ${starter}`)
        await copy(localStarterDir, projectDir);

        // Copy Theme
        this.notice(`Using theme: ${theme}`);
        await copy(localThemeDir, projectThemeDir);

        // First Commit
        this.notice("Initializing git in the new project directory...");
        process.chdir(projectDir);

        // Create empty IIIF image directory
        fs.mkdirSync(path.join(localStarterDir, 'static', 'img', 'iiif'), { recursive: true });

        spawnSync("git", ["init"]);
        if (commandMissing("git-lfs")) {
          this.warn(`Warning: Git LFS (Large File Storage) is required to publish repositories with files over 100 MB to GitHub. See documentation for more info and install instructions: https://quire.getty.edu/documentation/github. This message will not impact initialization of new project directory.`);
        } else {
          spawnSync(`git-lfs`, [`track`, `"downloads/**/*"`, `"img/**/*"`]);
        }
        this.notice("Committing starter files...");
        spawnSync("git", ["add", "-A"]);
        spawnSync("git", ["commit", "-m", `Add starter and theme to project`]);

        // Install Dependencies
        this.notice("Installing dependencies. This may take a minute...");
        this.npmInstall(projectThemeDir);

        this.confirm("Theme and dependencies successfully installed.");
        this.notice(
          "Run quire preview in your project folder to view changes locally."
        );
        resolve(true);
        return true;
      }
    });
  }
  /**
   * @description Handler for Quire processes. Calls this.project[option], or logs error if option is invalid.
   * @param {string} option flag passed to `quire process`. Possible values: iiif
   */
  process(option) {
    return new Promise((resolve) => {
      this.project = new Project(this.verbose);
      if (!this.project[option]) {
        this.error(`${option} is not a valid process option.`);
        this.shutdown();
      }
      this.project.on("info", this.notice);
      this.project.on("error", (msg) => {
        this.error(msg);
        this.shutdown();
      });
      this.project[option]();
      resolve(true);
    });
  }

  preview() {
    return new Promise((resolve) => {
      this.project = new Project(this.verbose);
      this.project.on("info", this.notice);
      this.project.on("error", (msg) => {
        this.error(msg);
        this.shutdown();
      });
      this.project.preview();
      this.listen();
      resolve(true);
    });
  }

  async site(env) {
    let project = new Project(this.verbose);
    project.on("info", this.notice);
    project.on("error", this.error);
    try {
      await project.buildWeb(env);
      return true;
    } catch (error) {
      return false;
    }
  }

  /* Old epub command */
  /*
  epub (filePath, env) {
    let project = new Project(this.verbose)
    project.on('info', this.notice)
    project.on('error', this.error)
    project.buildEpub(filePath, env)
  }
  */

  async epub(file, env) {
    let project = new Project(this.verbose);
    project.on("info", this.notice);
    project.on("error", this.error);
    try {
      await project.buildEpub(file, env);
      return true;
    } catch (error) {
      return false;
    }
  }

  template(type) {
    let project = new Project(this.verbose);
    project.on("info", this.notice);
    project.on("error", this.error);
    project.downloadTemplate(type);
  }

  async mobi(file, env) {
    let project = new Project(this.verbose);
    project.on("info", this.notice);
    project.on("error", this.error);
    try {
      await project.buildMobi(file, env);
      return true;
    } catch (error) {
      return false;
    }
  }

  async install() {
    let project = new Project(this.verbose);
    project.on("info", this.notice);
    project.on("error", this.error);
    try {
      await project.install();
      return true;
    } catch (error) {
      return false;
    }
  }

  async pdf(file, env) {
    let project = new Project(this.verbose);
    project.on("info", this.notice);
    project.on("error", this.error);
    try {
      await project.buildPDF(file, env);
      return true;
    } catch (error) {
      return false;
    }
  }

  debug() {
    let project = new Project(this.verbose);
    project.on("info", this.notice);
    project.on("error", this.error);
    console.log(project);
  }

  confirm(msg) {
    console.log(chalk.green(msg));
  }

  error(msg) {
    console.log(chalk.red(msg));
    process.exitCode = 1;
  }

  notice(msg) {
    console.log(msg);
  }

  npmInstall(cwd) {
    cwd = cwd || process.cwd();
    spawnSync(
      "npm",
      ["install"],
      {
        // cwd: cwd, stdio: 'inherit'
        cwd: cwd
      },
      function (err) {
        if (err) this.emit("error", err);
      }
    );
  }

  shutdown(soft) {
    this.notice("Shutting down Quire");
    if (this.project && this.project.hasOwnProperty("hugo")) {
      this.project.hugo && this.project.hugo.kill();
    }
    if (this.project && this.project.hasOwnProperty("webpack")) {
      this.project.webpack && this.project.webpack.kill();
    }
    if (!soft) {
      process.exit();
    }
    process.exit();
  }

  warn(msg) {
    console.log(chalk.yellow(msg));
    process.exitCode = 1;
  }

  listen() {
    // Allow for using `stop` to trigger shutdown
    const rl = readline.createInterface({
      input: process.stdin
    });

    rl.on("line", (input) => {
      let command = input.replace("quire ", "");
      switch (command) {
        case "stop":
          this.shutdown();
          rl.close();
          break;
        default:
          console.log(chalk.yellow(`No method for: ${command}`));
      }
    });
  }

  set verbose(v) {
    this.isVerbose = v;
  }

  get verbose() {
    return this.isVerbose;
  }
}
