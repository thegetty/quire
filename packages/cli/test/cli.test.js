const assert = require("assert");
const path = require("path");
const tmp = require("tmp");
const fs = require("fs");
const exec = require("child_process").exec;
import CLI from "@src/cli";
const timeout = 5e4;
const quire = new CLI();

// static names and paths for quire test
const sandboxDir = tmp.dirSync({
  unsafeCleanup: true
});
const projectName = "quire-starter";
const themeName = "default";
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
        const capturedStdout1 = stdout.substring(0, 32);
        const helpOutput = "Usage: quire [options] [command]";
        assert.equal(capturedStdout1, helpOutput);
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
    "should successfully build a epub",
    async done => {
      const testFilePath = path.join("static", "downloads", "test");
      await quire.epub(testFilePath);
      assert.equal(
        fs.existsSync(`${testFilePath}.epub`),
        true
      );
      done();
    },
    timeout
  );

  /**
  * Skip Mobi test on Linux since it requires Kindle Previewer, which is not supported on Linux
  */
  if (process.platform !== "linux") {
    test(
      "should successfully build a mobi",
      async (done) => {
        const testFilePath = path.join("static", "downloads", "test");
        await quire.mobi(testFilePath);
        assert.equal(fs.existsSync(`${testFilePath}.mobi`), true);
        done();
      },
      timeout
    );
  }

  test(
    "should successfully build a pdf",
    async done => {
      const testFilePath = path.join("static", "downloads", "test");
      await quire.pdf(testFilePath);
      assert.equal(
        fs.existsSync(`${testFilePath}.pdf`),
        true
      );
      done();
    },
    timeout
  );

  test(
    "quire imageslice should create 'img/iiif/processed' image directory",
    async done => {
      await quire.process('iiif');
      assert.equal(
        fs.existsSync(path.join(sandboxDir.name, projectName, "static", "img", "iiif", "processed")),
        true
      );
      done();
    },
    timeout
  );
});
