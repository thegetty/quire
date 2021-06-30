const assert = require("assert");
const path = require("path");
const fs = require("fs");
const exec = require("child_process").exec;
import CLI from "@src/cli";
const timeout = 5e4;
const quire = new CLI();
import CONFIG from "../../fixtures/project-config.js";
let projectPath;

describe("CLI", () => {
  beforeAll(() => {
    projectPath = path.join(CONFIG.FIXTURES_DIR, CONFIG.PROJECT_FOLDER);
    process.chdir(projectPath);
  });

  test("no arguments on quire command should out put help", () => {
    return new Promise((resolve, reject) => {
      exec("quire", function (error, stdout, stderr) {
        if (error) reject();
        const capturedStdout1 = stdout.substring(0, 32);
        const helpOutput = "Usage: quire [options] [command]";
        assert.equal(capturedStdout1, helpOutput);
        resolve();
      });
    });
  }, timeout);

  /**
   * @todo Mock install
   */
  test("should successfully install node modules in a starter project theme", () => {
    return new Promise((resolve) => {
      quire.install().then(() => {
        assert.equal(
          fs.existsSync(path.join(CONFIG.THEME_PATH, "node_modules")),
          true
        );
        resolve();
      });
    });
  }, timeout);

  test("should successfully build a static site", () => {
    return new Promise((resolve) => {
      quire.site().then(() => {
        assert.equal(fs.existsSync(path.join("site")), true);
        resolve();
      });
    });
  }, timeout);

  test("should successfully build a epub", () => {
    const testFilePath = path.join("static", "downloads", "test");
    return new Promise((resolve) => {
      quire.epub(testFilePath).then(() => {
        assert.equal(fs.existsSync(`${testFilePath}.epub`), true);
        resolve();
      });
    });
  }, timeout);

  /**
   * Skip Mobi test on Linux since it requires Kindle Previewer, which is not supported on Linux
   */
  if (process.platform !== "linux") {
    test("should successfully build a mobi", () => {
      const testFilePath = path.join("static", "downloads", "test");
      return new Promise((resolve) => {
        quire.mobi(testFilePath).then(() => {
          assert.equal(fs.existsSync(`${testFilePath}.mobi`), true);
          resolve();
        });
      });
    }, timeout);
  }

  test("should successfully build a pdf", () => {
    const testFilePath = path.join("static", "downloads", "test");
    return new Promise((resolve) => {
      quire.pdf(testFilePath).then(() => {
        assert.equal(fs.existsSync(`${testFilePath}.pdf`), true);
        resolve();
      });
    });
  }, timeout);

  test("quire process --iiif should create 'img/iiif/processed' image directory", () => {
    const processedImgPath = path.join("static", "img", "iiif", "processed");
    quire.process("iiif");
    assert.equal(fs.existsSync(processedImgPath), true);
  });
});
