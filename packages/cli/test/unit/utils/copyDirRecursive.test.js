import { copyDirRecursive } from "../../../../lib/utils";
import fs from "fs";
import path from "path";

const assert = require("assert");

const data = {
  "name": "test-source",
  "items": [
    "file.txt",
    {
      "name": "child-directory",
      "items": [
        "lorem.txt",
        {
          "name": "child-child-directory",
          "items": ["ipsum.txt"]
        }
      ]
    }
  ]
}

describe("copyDirRecursive", () => {
  const destDir = path.join("temp", "test-destination");

  const createSource = (i, parentDir) => {
    if (typeof i === "object" && i.items) {
      const newParentDir = path.join(parentDir, i.name);
      fs.mkdirSync(newParentDir, { recursive: true });
      i.items.forEach((j) => {
        createSource(j, newParentDir);
      });
    } else if (typeof i === "string") {
      fs.writeFileSync(path.join(parentDir, i), 'lorem ipsum');
    }
  };

  it("copies contents of a directory", () => {
    createSource(data, 'temp');

    const srcPath = path.join("temp", "test-source");
    copyDirRecursive(srcPath, destDir);
    const destFilePath = path.join(destDir, "file.txt");
    const fileExists = fs.existsSync(destFilePath);
    assert.equal(fileExists, true);
  });

  it("copies nested directories", () => {
    createSource(data, 'temp');

    const srcPath = path.join("temp", "test-source");
    copyDirRecursive(srcPath, destDir);
    const destFilePath = path.join(
      destDir, 
      "child-directory", 
      "child-child-directory", 
      "ipsum.txt"
    );
    const fileExists = fs.existsSync(destFilePath);
    assert.equal(fileExists, true);
  });

  it("copies files not matching exclude", () => {
    createSource(data, 'temp');

    const srcPath = path.join("temp", "test-source");
    copyDirRecursive(srcPath, destDir, ["child-directory"]);
    const destFilePath = path.join(destDir, "file.txt");
    const fileExists = fs.existsSync(destFilePath);
    assert.equal(fileExists, true);
  });

  it("does not copy nested directories matching exclude", () => {
    createSource(data, 'temp');

    const srcPath = path.join("temp", "test-source");
    copyDirRecursive(srcPath, destDir, ["child-child-directory"]);
    const destFilePath = path.join(
      destDir, 
      "child-directory", 
      "child-child-directory", 
      "ipsum.txt"
    );
    const fileExists = fs.existsSync(destFilePath);
    assert.equal(fileExists, false);
  });

  it("does not copy files matching exclude", () => {
    createSource(data, 'temp');
    const srcPath = path.join("temp", "test-source");
    copyDirRecursive(srcPath, destDir, ["excluded-directory"]);
    const excludedDirPath = path.join("temp", "excluded-directory")
    const excludedFilePath = path.join(excludedDirPath, "ipsum.txt");
    const dirExists = fs.existsSync(excludedDirPath);
    const fileExists = fs.existsSync(excludedFilePath);
    assert.equal(dirExists, false);
    assert.equal(fileExists, false);
  });

  afterEach(() => {
    fs.rmdirSync('temp', { recursive: true });
  });
});
