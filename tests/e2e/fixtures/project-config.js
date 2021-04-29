/**
 * Define paths for test project
 */
const path = require("path");
const projectName = "project";
const themeName = "default";

module.exports = {
  FULL_PATH: path.join("tests", "e2e", "fixtures", projectName),
  FIXTURES_DIR: path.join("tests", "e2e", "fixtures"),
  STARTER_THEME: themeName,
  PROJECT_FOLDER: projectName,
  THEME_PATH: path.join("themes", themeName),
};
