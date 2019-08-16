const path = require("path");
const assert = require("assert");
const glob = require("glob");
const Project = require(path.join("..", "lib", "project"));
const validProjectDir = path.join(
  process.cwd(),
  "test",
  "fixtures",
  "quire-starter"
);

describe("Project", () => {
  afterEach(function() {
    process.chdir(process.cwd());
  });

  it("print project object", () => {
    process.chdir(validProjectDir);
    let project = new Project();
    // console.group(project);
  });

  it("should successfully read YAML values in config.yml", function() {
    process.chdir(validProjectDir);
    project = new Project();
    project.loadConfig();
    expect(typeof project.config.title).toBe("string");
  });

  it("should successfully read YAML values in publication.yml", function() {
    process.chdir(validProjectDir);
    project = new Project();
    let bookData = project.loadBookData();
    expect(typeof bookData.title).toBe("string");
  });

  it("should return an array of paths to content files", function() {
    process.chdir(validProjectDir);
    project = new Project();
    let contentDocs = glob.sync(path.join("content", "**", "*.md"));
    assert.equal(project.chapters.length, contentDocs.length);
  });
});
