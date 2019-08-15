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

  beforeAll((done /* call it or remove it*/) => {
    jest.setTimeout(50000);
    console.log(`done`);
    done(); // calling it
  });

  beforeEach(async () => {
    console.log(`before async`);
  });

  beforeEach(() => {
    console.log(`before`);
  });

  it("prints the CLI object ", () => {
    // let quire = new CLI();
    // console.log(quire.create('path'));
  });

  it("should successfully create a starter project", async done => {
    let sandboxDir = tmp.dirSync({ unsafeCleanup: true });
    let projectName = "testProject";
    let projectThemePath = path.join(
      projectName,
      "themes",
      "quire-starter-theme"
    );
    process.chdir(sandboxDir.name);
    let result = await quire.create(projectName);
    console.log(result);
    assert.equal(fs.existsSync(projectThemePath), true);
    quire.shutdown(true);
    done();
  });

  afterEach(() => {
    console.log(`after`);
  });

  afterEach(async () => {
    console.log(`after async`);
  });
});
