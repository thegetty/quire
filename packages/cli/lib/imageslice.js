const execa = require("execa");
const fs = require("fs-extra");
const ora = require("ora");
const path = require("path");
const rimraf = require("rimraf");
import { isWin32 } from "./utils";

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
    const originalImages = [];
    let imagesSliced = 0;
    const iiifTiler = isWin32()
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
    }

    // Log to spinner the process and then remove config file so only the template remains,
    // Trigger done function
    function resetConfigPath() {
      fs.unlink(__dirname + path.normalize("/go-iiif/config/config.json"));
      done();
    }

    // function to execute the command to slice the images
    async function iiifSlice(imagePath) {
      const configPath = `file://${path.normalize(__dirname)}${path.normalize(iiifConfig)}`;
      const iiifTilerPath = `${path.normalize(__dirname)}${path.normalize(iiifTiler)}`;
      const imageName = path.parse(imagePath).base;
      const tilerCmd = iiifTilerPath;
      const cmdArgs = [
        '-config-source',
        configPath,
        '-quality',
        'default',
        '-verbose',
        '-refresh',
        '-noextension',
        '-scale-factors',
        '32,16,8,4,2,1',
        imageName
      ];
      return await execa(tilerCmd, cmdArgs);
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
      spinner.info("Finding images to process...");
      if (fs.existsSync(iiifSeed)) {
        const files = fs.readdirSync(iiifSeed);
        for (let i = 0; i < files.length; i++) {
          const { ext, name, base } = path.parse(files[i]);
          const filePath = path.join(iiifSeed, files[i]);
          const dest = path.join(iiifProcessed, name);

          const supportedExts = [".jp2", ".jpg", ".jpeg", ".png", ".svg"];
          if (supportedExts.some((supportedExt) => supportedExt === ext)) {
            originalImages.push(filePath);
          } else {
            spinner.fail(`Cannot slice file ${files[i]}. File type must be: ${supportedExts.join(', ')}.`);
          }
          if (fs.existsSync(dest)) {
            const statProcessed = fs.lstatSync(dest);
            if (statProcessed.isDirectory()) {
              spinner.info(
                `IIIF image files already exist for ${base}. They will be removed and rewritten.`
              );
              rimraf.sync(dest);
            }
          }
        }
      } else {
        spinner.fail(`'${iiifSeed}' directory was not found!`);
        throw new error();
      }
    }

    // Slice Images
    function sliceImages() {
      spinner.start('Processing images. This may take a while depending on the image file sizes...');
      let imagesToSlice = originalImages.length;
      if (imagesToSlice === 0) {
        spinner.fail(`No images found in ${iiifSeed}`);
        resetConfigPath();
      }
      for (let i = 0; i < originalImages.length; i++) {
        const image = originalImages[i];
        iiifSlice(image).then(() => {
          imagesSliced++;
          imagesToSlice--;
          if (imagesToSlice === 0) imagesDone();
        }).catch(() => {
          imagesToSlice--;
          if (imagesToSlice === 0) imagesDone();
        });
      }
    }

    // Verify expected images were sliced
    // Log success
    async function imagesDone() {
      spinner.succeed(`Done processing ${imagesSliced} images.`);
      await compareSlicedResults();
      getAllImagesAndRename(path.normalize("static/img/iiif/processed"));
      resetConfigPath();
    }

    // compared the finished folders with the injested results to see which failed/passed
    // subtract the amount failed from the iterations to display the correct amount
    // in imagesDone()
    async function compareSlicedResults() {
      const processedImages = fs.readdirSync(iiifProcessed);
      let failed = [];
      let completed = [];
      for (let i = 0; i < originalImages.length; i++) {
        const originalImageFile = path.parse(originalImages[i]).base;
        const originalImageFileName = path.parse(originalImages[i]).name;
        if (processedImages.includes(originalImageFileName)) {
          completed.push(originalImageFile);
        } else {
          failed.push(originalImageFile);
        }
      }
      if (failed.length) {
        spinner.fail(
          `${failed.length}/${imagesSliced} failed. Ensure these files have proper exif headings: ${['', ...failed].join('\n - ')}`
        )
      }
      if (completed.length) {
        spinner.succeed(
          `${completed.length}/${imagesSliced} succeeded:${['', ...completed].join('\n - ')}`
        );
      }
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

    setTimeout(sliceImages, 10);
  });
}