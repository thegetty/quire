const fs = require("fs-extra");
const exists = require("command-exists").sync;
const yaml = require("js-yaml");
const { URL } = require("url");

export async function copy(source, destination) {
  await fs.ensureDir(destination);

  if (!fs.existsSync(source)) {
    throw new Error(`${source} does not exist`);
  }

  await fs.copy(source, destination);

  return true;
}

export function readYAML(file) {
  const doc = yaml.safeLoad(fs.readFileSync(file, "utf8"));
  return doc;
}

export function removeFile(filepath) {
  if (fs.existsSync(filepath)) {
    return new Promise((resolve) => {
      resolve(fs.unlinkSync(filepath));
    });
  }
}

export function commandMissing(command) {
  return !exists(command);
}

export function determineBaseURL(baseURL) {
  if (typeof baseURL !== "string") {
    return;
  }
  // baseUrl must have a protocol for URL parsing if it has a port
  // otherwise the port is parsed as the pathname.
  // If it is missing, we are going to assume http protocol
  if (baseURL.indexOf("://") === -1 && baseURL.indexOf(":") > -1) {
    baseURL = "http://" + baseURL;
  }
  try {
    return new URL(baseURL).pathname;
  } catch (e) {
    if (e instanceof TypeError) {
      return path.parse(baseURL || "").name;
    }
  }
}

export function deleteFolderRecursive(pth) {
  var files = [];
  if (fs.existsSync(pth)) {
    files = fs.readdirSync(pth);
    files.forEach(function (file, index) {
      var curPath = pth + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(pth);
  }
}
