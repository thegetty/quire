const execa = require("execa");
const fs = require("fs-extra");
const ora = require("ora");
const path = require("path");
const rimraf = require("rimraf");
import { isWin } from "./utils";

/**
 * imageslice
 *
 * @description Tile images to IIIF Image API level 0 specification
 *
 * Images in `static/img/iiif/images` will be tiled and output to `static/img/iiif/processed/{image_filename}`
 * If an existing processed image directory with the same name is found, it will be removed and re-written
 */
export default async function () {
  return new Promise((resolve) => {
    let spinner = ora({
      text: "Creating IIIF images..."
    }).start();
    const iiifSeed = "static/img/iiif/images";
    const iiifProcessed = "static/img/iiif/processed";
    let images = [];
    let finished = false;
    let imageProcessed = false;
    let iterations = 0;
    let requests = 0;
    let iiifTiler = isWin()
      ? "/go-iiif/bin/iiif-tile-seed-win"
      : process.platform === "linux"
      ? "/go-iiif/bin/iiif-tile-seed-linux"
      : "/go-iiif/bin/iiif-tile-seed-macos";
    const iiifConfig = "/go-iiif/config/";

    // check if processed folder exists
    if (!fs.existsSync(iiifProcessed)) {
      fs.mkdirSync(iiifProcessed, { recursive: true });
    }

    // Read the config template and create a local state of the config to overwrite
    // values that will allow it to work per project.  Create file after values set.
    function updateConfigPath() {
      spinner.info("Updating go-iiif config");
      let config = fs.readFileSync(
        __dirname + path.normalize("/go-iiif/config/config.template")
      );
      config = JSON.parse(config);
      config.images.source.path = path.normalize(
        process.cwd() + "/" + iiifSeed
      );
      config.derivatives.cache.path = path.normalize(
        process.cwd() + "/" + iiifProcessed
      );
      config = JSON.stringify(config, null, 2);
      fs.writeFile(
        __dirname + path.normalize("/go-iiif/config/config.json"),
        config,
        "utf8"
      );
      spinner.succeed("go-iiif config created!");
    }

    // Log to spinner the process and then remove config file so only the template remains,
    // Trigger done function
    function resetConfigPath() {
      spinner.info("Cleaning up go-iiif config");
      fs.unlink(__dirname + path.normalize("/go-iiif/config/config.json"));
      spinner.succeed("go-iiif config cleaned up");
      done();
    }

    // function to execute the command to slice the images
    async function iiifSlice(imageUrl) {
      const imageName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
      const cmd = `${path.normalize(__dirname)}${path.normalize(
        iiifTiler
      )} -config-source file://${path.normalize(__dirname)}${path.normalize(
        iiifConfig
      )} -quality default -verbose -refresh -scale-factors 128,64,32,16,8,4,2,1,0 ${imageName}`;

      return new Promise(function (resolve, reject) {
        // execSync(cmd); // alternative command, more console logs
        return execa.commandSync(cmd) ? resolve(true) : reject(true);
      });
    }

    // Get all images in directory recursively, if it happens to detect any files
    // with 'color', it'll rename them to 'default' with the appopriate extension
    async function getAllImagesAndRename(dir) {
      const entryPaths = fs
        .readdirSync(dir)
        .map((entry) => path.join(dir, entry));
      const filePaths = entryPaths.filter((entryPath) =>
        fs.statSync(entryPath).isFile()
      );
      const dirPaths = entryPaths.filter(
        (entryPath) => !filePaths.includes(entryPath)
      );
      const dirFiles = dirPaths.reduce(
        (prev, curr) => prev.concat(getAllImagesAndRename(curr)),
        []
      );

      if (filePaths.length && filePaths[0].includes("color")) {
        const file = filePaths[0];
        const dir = file.substr(0, file.lastIndexOf("/"));
        const newFile = dir + "/default.jpg";
        const fileAttrs = filePaths[1];
        const newAttrsFile = dir + "/default.jpg.attrs";
        fs.renameSync(file, newFile);
        fs.renameSync(fileAttrs, newAttrsFile);
      }
    }

    // check if directories exist and find all images;
    // also check if any images have been processed and 
    // delete them so it can do a fresh slice
    function getAllImages() {
      spinner.info("Getting all images");
      if (fs.existsSync(iiifSeed)) {
        let files = fs.readdirSync(iiifSeed);
        for (let i = 0, len = files.length; i < len; i++) {
          let fullPath = path.join(iiifSeed, files[i]);
          let stat = fs.lstatSync(fullPath);
          let fullProcessPath = path.join(iiifProcessed, files[i]);

          const fileExtensions = [".jpg", ".jpeg", ".png", ".svg", ".jp2"];
          if (stat.isDirectory()) {
            spinner.fail(
              `Directories found! Please delete and move images you'd like to slice to ${iiifSeed}`
            );
            throw new error();
          } else {
            if (fileExtensions.some((extension) => fullPath.toLowerCase().includes(extension))) {
              images.push(fullPath);
            } else {
              spinner.fail(`No images found! Add images in: ${iiifSeed}`);
              throw new error();
            }
          }
          if (fs.existsSync(fullProcessPath)) {
            let statProcessed = fs.lstatSync(fullProcessPath);
            if (statProcessed.isDirectory()) {
              spinner.info(
                "Processed image found; cleaning up processed image directory"
              );
              // execa.commandSync(`rm -rf ${statProcessed}`);
              rimraf.sync(fullProcessPath);
              spinner.succeed(
                `Processed image directory ${fullProcessPath} has been cleared`
              );
            }
          }
        }
      } else {
        spinner.fail(`'${iiifSeed}' directory was not found!`);
        throw new error();
      }
    }

    // parse the images that are found
    function parseImages() {
      try {
        for (let i = 0, len = images.length; i < len; i++) {
          iterations++;
          requests++;
          let image = images[i];
          iiifSlice(image).then(() => {
            imageProcessed = true;
            requests--;
            finished = true;
            if (requests === 0) imagesDone();
          });
        }
        if (images.length === 0) {
          spinner.fail(`No images found in ${iiifSeed}`);
          imagesDone();
        }
        return new Promise((resolve) => {
          resolve(true);
        });
      } catch (error) {
        return new Promise((reject) => {
          reject(true);
          spinner.fail("Image failed to slice!");
        });
      }
    }

    // Display images done or not
    async function imagesDone() {
      if (finished) {
        await compareSlicedResults();
        getAllImagesAndRename(path.normalize("static/img/iiif/processed"));
        if (iterations === 1 && imageProcessed) {
          spinner.succeed(`${iterations} image has been sliced!`);
        } else {
          spinner.succeed(`${iterations} images have been sliced!`);
        }
        spinner.succeed("IIIF manifest and file(s) generated!");
      } else {
        spinner.warn("No sliced images generated");
      }
      resetConfigPath();
    }

    // compared the finished folders with the injested results to see which failed/passed
    // subtract the amount failed from the iterations to display the correct amount
    // in imagesDone()
    async function compareSlicedResults() {
      const files = fs.readdirSync(iiifProcessed);
      let failed = [];
      let completed = [];
      for (let i = 0, len = images.length; i < len; i++) {
        for (let j = 0, flen = files.length; j < flen; j++) {
          images[i].includes(files[j])
            ? completed.push(
                images[i].substring(images[i].lastIndexOf("/") + 1)
              )
            : failed.push(images[i].substring(images[i]));
        }
      }
      failed.length
        ? spinner.warn(`Failed to slice these images: ${failed} | Ensure the seed file has proper exif headings`)
        : spinner.info(`Succeeded in slicing: ${completed}`);
      iterations -= failed.length;
    }

    // done function, trigger finish and resolve true to the Promise
    function done() {
      spinner.succeed("IIIF Process Finished!");
      resolve(true);
    }

    // startup process
    try {
      spinner.info("Starting IIIF Process");
      updateConfigPath();
    } catch (error) {
      return new Promise((reject) => {
        spinner.fail("Failed to generate go-iiif config");
      });
    }

    // check if directories exist and find all images
    try {
      getAllImages();
    } catch (error) {
      return new Promise((reject) => {
        spinner.fail("Failed to slice any images!");
      });
    }

    setTimeout(parseImages, 10);
  });
}