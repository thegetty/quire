const assert = require("assert");
const path = require("path");
const fs = require("fs");
const exec = require("child_process").exec;
import CLI from "@src/cli";
const timeout = 5e4;
const quire = new CLI();
import CONFIG from "../../fixtures/project-config.js";

describe("CLI", () => {
  test(
    "test project exists",
    async (done) => {
      await assert.equal(fs.existsSync(path.join(CONFIG.FIXTURES_DIR, CONFIG.PROJECT_FOLDER)), true);

      process.chdir(path.join(CONFIG.FIXTURES_DIR, CONFIG.PROJECT_FOLDER));

      done();
    },
    timeout
  );

  test(
    "no arguments on quire command should out put help",
    (done) => {
      exec("quire", function (error, stdout, stderr) {
        if (error) done(error);
        const capturedStdout1 = stdout.substring(0, 32);
        const helpOutput = "Usage: quire [options] [command]";
        assert.equal(capturedStdout1, helpOutput);
        done();
      });
    },
    timeout
  );

  /**
   * @todo Mock install
   */
  test(
    "should successfully install node modules in a starter project theme",
    async (done) => {
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
    async (done) => {
      await quire.site();
      assert.equal(
        fs.existsSync(path.join("site")),
        true
      );
      done();
    },
    timeout
  );

  test(
    "should successfully build a epub",
    async (done) => {
      const testFilePath = path.join("static", "downloads", "test");
      await quire.epub(testFilePath);
      assert.equal(fs.existsSync(`${testFilePath}.epub`), true);
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
    async (done) => {
      const testFilePath = path.join("static", "downloads", "test");
      await quire.pdf(testFilePath);
      assert.equal(fs.existsSync(`${testFilePath}.pdf`), true);
      done();
    },
    timeout
  );

  test(
    "quire imageslice should create 'img/iiif/processed' image directory",
    async (done) => {
      await quire.process("iiif");
      assert.equal(
        fs.existsSync(
          path.join(
            "static",
            "img",
            "iiif",
            "processed"
          )
        ),
        true
      );
      done();
    },
    timeout
  );
});
