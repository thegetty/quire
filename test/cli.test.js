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
  afterEach(function() {
    //process.chdir(process.cwd());
    // console.log(process.cwd());
  });

  it("prints the CLI object ", () => {
    //process.chdir(validProjectDir);
    let quire = new CLI();
    console.log(quire);
  });

  /** This maybe an issue with my github config */
  it("should successfully create a starter project", () => {
    let sandboxDir = tmp.dirSync({ unsafeCleanup: true });
    let projectName = "testProject";

    process.chdir(sandboxDir.name);
    quire = new CLI();
    quire
      .create(projectName)
      .then(result => {
        console.log(result);
        assert.equal(fs.existsSync(projectName), true);
      })
      .catch(err => {
        console.log(`error`);
        consol.log(err);
      });
  });
});
