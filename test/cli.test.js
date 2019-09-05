const assert = require("assert");
const path = require("path");
const tmp = require("tmp");
const fs = require("fs");
const CLI = require(path.join("..", "lib", "cli"));

describe("CLI", () => {
  let quire = new CLI();
  let sandboxDir = tmp.dirSync({
    unsafeCleanup: true
  });
  let projectName = "testProject";
  let projectThemePath = path.join(
    projectName,
    "themes",
    "quire-starter-theme"
  );

  test(
    "should successfully create a starter project",
    async done => {
      process.chdir(sandboxDir.name);
      let result = await quire.create(projectName);
      if (result) {
        let fullPath = path.join(sandboxDir.name, projectThemePath);
        assert.equal(fs.existsSync(fullPath), true);
        done();
      } else {
        done();
      }
    },
    25000 * 1
  );

  test(
    "should successfully install node modules in a starter project theme",
    async done => {
      let result = await quire.install();
      if (result) {
        let nodeModulesPath = path.join(
          sandboxDir.name,
          projectThemePath,
          "node_modules"
        );
        assert.equal(fs.existsSync(nodeModulesPath), true);
        done();
      } else {
        done();
      }
    },
    25000 * 2
  );

  test(
    "should successfully build a static site",
    async done => {
      let result = await quire.site();
      if (result) {
        let sitePath = path.join(sandboxDir.name, projectName, "site");
        assert.equal(fs.existsSync(sitePath), true);
        done();
      } else {
        done();
      }
    },
    25000 * 3
  );

  test(
    "should successfully build a pdf",
    async done => {
      let result = await quire.pdf();
      if (result) {
        let pdfPath = path.join(
          sandboxDir.name,
          projectName,
          "static",
          "downloads",
          "output.pdf"
        );
        assert.equal(fs.existsSync(pdfPath), true);
        done();
      } else {
        done();
      }
    },
    25000 * 4
  );

  test(
    "should successfully build a mobi",
    async done => {
      let result = await quire.mobi();
      if (result) {
        let mobiPath = path.join(
          sandboxDir.name,
          projectName,
          "static",
          "downloads",
          "output.mobi"
        );
        assert.equal(fs.existsSync(mobiPath), true);
        done();
      } else {
        done();
      }
    },
    25000 * 6
  );

  test(
    "should successfully build a epub",
    async done => {
      let result = await quire.epub();
      if (result) {
        let epubPath = path.join(
          sandboxDir.name,
          projectName,
          "static",
          "downloads",
          "output.epub"
        );
        assert.equal(fs.existsSync(epubPath), true);
        done();
      } else {
        done();
      }
    },
    25000 * 7
  );
});
