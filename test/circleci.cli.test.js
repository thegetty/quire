const assert = require("assert");
const path = require("path");
const tmp = require("tmp");
const fs = require("fs");
const exec = require("child_process").exec;
import CLI from "../lib/cli";
const timeout = 5e4;
const quire = new CLI();

// static names and paths for quire test
const sandboxDir = tmp.dirSync({
  unsafeCleanup: true
});
const projectName = "quire-project";
const themeName = "quire-starter-theme";
const CONFIG = {
  STARTER_THEME: themeName,
  DEFAULT_PROJECT_NAME: projectName,
  PROJECT_FOLDER: path.join(sandboxDir.name, projectName),
  STATIC_FILES_PATH: path.join(
    sandboxDir.name,
    projectName,
    "static",
    "downloads"
  ),
  THEME_PATH: path.join(sandboxDir.name, projectName, "themes", themeName)
};

describe("CLI", () => {
  process.chdir(sandboxDir.name);

  test(
    "no arguments on quire command should out put help",
    done => {
      exec("quire", function(error, stdout, stderr) {
        if (error) done(error);
        let capturedStdout1 = stdout;
        let helpOutput = "Usage: quire [options] [command]";
        assert.equal(capturedStdout1.indexOf(helpOutput) !== -1, true);
        done();
      });
    },
    timeout
  );

  test(
    "should successfully create a starter project",
    async done => {
      await quire.create(CONFIG.DEFAULT_PROJECT_NAME);
      assert.equal(fs.existsSync(CONFIG.THEME_PATH), true);
      done();
    },
    timeout
  );

  test(
    "should successfully install node modules in a starter project theme",
    async done => {
      await quire.install();
      assert.equal(
        fs.existsSync(path.join(CONFIG.THEME_PATH, "node_modules")),
        true
      );
      done();
    },
    timeout
  );

  test(
    "should successfully build a static site",
    async done => {
      await quire.site();
      assert.equal(
        fs.existsSync(path.join(CONFIG.PROJECT_FOLDER, "site")),
        true
      );
      done();
    },
    timeout
  );

  test(
    "should successfully build a mobi",
    async done => {
      await quire.epub();
      assert.equal(
        fs.existsSync(path.join(CONFIG.STATIC_FILES_PATH, "output.epub")),
        true
      );
      done();
    },
    timeout
  );

  test(
    "should successfully build a epub",
    async done => {
      await quire.mobi();
      assert.equal(
        fs.existsSync(path.join(CONFIG.STATIC_FILES_PATH, "output.mobi")),
        true
      );
      done();
    },
    timeout
  );

  test(
    "should successfully build a pdf",
    async done => {
      await quire.pdf();
      assert.equal(
        fs.existsSync(path.join(CONFIG.STATIC_FILES_PATH, "output.pdf")),
        true
      );
      done();
    },
    timeout
  );
});
