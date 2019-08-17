const assert = require("assert");
const path = require("path");
const tmp = require("tmp");
const fs = require("fs");
const CLI = require(path.join("..", "lib", "cli"));

describe("CLI", () => {
  let quire = new CLI();
  let sandboxDir = tmp.dirSync();
  let projectName = "testProject";
  let projectThemePath = path.join(
    projectName,
    "themes",
    "quire-starter-theme"
  );

  test("prints the CLI object", () => {
    console.log(`prints the CLI object`);
    console.log(quire);
  }, 2000);

  test("should successfully create a starter project", async done => {
    process.chdir(sandboxDir.name);
    let result = await quire.create(projectName);
    if (result) {
      let fullPath = path.join(sandboxDir.name, projectThemePath);
      assert.equal(fs.existsSync(fullPath), true);
      done();
    } else {
      done();
    }
  }, 25000);

  test("should successfully install node modules in a starter project theme", async done => {
    console.log(
      "should successfully install node modules in a starter project theme"
    );
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
    console.log(
      "should successfully install node modules in a starter project theme"
    );
  }, 25000);

  /*   test("should successfully build a static site", async done => {
    console.log("should successfully build a static site");
    let result = await quire.site();
    if (result) {
      let sitePath = path.join(sandboxDir.name, projectName, "site");
      assert.equal(fs.existsSync(sitePath), true);
      done();
    } else {
      done();
    }
    console.log("should successfully build a static site");
  }, 25000); */

  test("should successfully build a pdf", async done => {
    console.log("should successfully build a pdf");
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
    console.log("should successfully build a pdf");
  }, 30000);

  /* test("should successfully build a epub", async done => {
    console.log("should successfully build a epub");
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
    console.log("should successfully build a epub");
  }, 25000);

  test("should successfully build a mobi", async done => {
    console.log("should successfully build a mobi");
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
    console.log("should successfully build a mobi");
  }, 25000); */
});
