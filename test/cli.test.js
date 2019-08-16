const assert = require("assert");
const path = require("path");
const tmp = require("tmp");
const fs = require("fs");
const CLI = require(path.join("..", "lib", "cli"));
const validProjectDir = path.join(
  process.cwd(),
  "test",
  "fixtures",
  "quire-starter"
);

describe("CLI", () => {
  let quire = new CLI();

  test("should successfully create a starter project", async done => {
    let sandboxDir = tmp.dirSync();
    let projectName = "testProject";
    let projectThemePath = path.join(
      projectName,
      "themes",
      "quire-starter-theme"
    );
    process.chdir(sandboxDir.name);
    // console.log("sandboxDir: ", sandboxDir);
    let result = await quire.create(projectName);
    // console.log(result);
    if (result) {
      let fullPath = path.join(sandboxDir.name, projectThemePath);
      // console.log(fs.existsSync(fullPath));
      assert.equal(fs.existsSync(fullPath), true);
      // quire.shutdown(true);
      done();
    } else {
      // quire.shutdown(true);
      done();
    }
  }, 25000);

  test("prints the CLI object", () => {
    console.log(`prints the CLI object`);
    console.log(quire);
  }, 2000);
});
