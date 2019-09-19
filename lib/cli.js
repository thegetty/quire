/**
 * @fileOverview CLI class
 * @author Eric Gardner / Getty Publications
 * @license MIT
 *
 */
const EventEmitter = require("events");
const chalk = require("chalk");
const execa = require("execa");
const path = require("path");
const rimraf = require("rimraf");
const spawnSync = require("child_process").spawnSync;
const readline = require("readline");

import Project from "./project";
import { commandMissing } from "./utils";

/**
 * Config object.
 * @description Stashing some fixed values as globals here for now.
 */
const CONFIG = {
  STARTER_GIT_REPO: "git@github.com:gettypubs/quire-starter.git",
  STARTER_HTTPS_REPO: "https://github.com/gettypubs/quire-starter.git",
  CURRENT_VERSION: "master",
  STARTER_THEME: "quire-starter-theme",
  DEFAULT_PROJECT_NAME: "quire-project",
  LOCALHOST: "http://localhost:1313"
};

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
    this.on("new", this.create);
    this.on("preview", this.preview);
    this.on("install", this.install);
    this.on("site", this.site);
    this.on("epub", this.epub);
    this.on("template", this.template);
    this.on("mobi", this.mobi);
    this.on("pdf", this.pdf);
    this.on("error", this.warn);
    this.on("debug", this.debug);
    this.once("shutdown", this.shutdown);

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
    async function runGit(gitArgs, themeDir, projectDir, reject, resolve) {
      try {
        const { stdout } = await execa("git", ["ls-remote", "--get-url"], {
          cwd: __dirname
        });
        stdout.indexOf("git@github.com") !== -1
          ? gitArgs.splice(gitArgs.indexOf(CONFIG.STARTER_HTTPS_REPO), 1)
          : gitArgs.splice(gitArgs.indexOf(CONFIG.STARTER_GIT_REPO), 1);
        console.log(gitArgs);
        await execa("git", gitArgs);
        self.notice("Configuring project...");
        process.chdir(projectDir);
        spawnSync("git", ["checkout", "-b", "master"]);
        spawnSync("git", ["remote", "rm", "origin"]);
        spawnSync("git", ["rm", ".gitmodules"]);
        spawnSync("git", [
          "rm",
          "--cached",
          path.join("themes", CONFIG.STARTER_THEME)
        ]);

        self.notice("Setting up theme...");
        process.chdir(themeDir);
        rimraf.sync(".git");

        process.chdir(projectDir);
        spawnSync("git", ["add", "-A"]);
        spawnSync("git", [
          "commit",
          "-m",
          "Add quire-starter-theme to project"
        ]);

        self.notice("Installing dependencies...");
        self.npmInstall(themeDir);
        self.confirm("Theme and dependencies successfully installed.");
        self.notice(
          "Run quire preview in your project folder to view changes locally."
        );
        resolve(true);
        return true;
      } catch (error) {
        self.error(error.message);
        reject(self.error(error.message));
        return false;
      }
    }
    let self = this;
    return new Promise((resolve, reject) => {
      if (commandMissing("git")) {
        reject(self.emit("warning", "Please install Git before continuing."));
        self.emit("warning", "Please install Git before continuing.");
      } else {
        self.notice("Installing starter kit...");

        let projectDir = path.resolve(projectName);
        let themeDir = path.resolve(
          projectName,
          "themes",
          CONFIG.STARTER_THEME
        );
        let gitArgs = [
          "clone",
          "--recursive",
          "--branch",
          CONFIG.CURRENT_VERSION,
          CONFIG.STARTER_GIT_REPO,
          CONFIG.STARTER_HTTPS_REPO,
          projectName
        ];
        runGit(gitArgs, themeDir, projectDir, reject, resolve);
      }
    });
  }

  preview() {
    return new Promise(resolve => {
      this.project = new Project(this.verbose);
      this.project.on("info", this.notice);
      this.project.on("error", msg => {
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
      function(err) {
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

    rl.on("line", input => {
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
