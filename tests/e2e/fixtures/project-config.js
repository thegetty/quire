/**
 * Define paths for test project
 */
const path = require("path");
const projectName = "project";
const themeName = "default";

module.exports = {
  FIXTURES_DIR: path.join("tests", "e2e", "fixtures"),
  FULL_PATH: path.join("tests", "e2e", "fixtures", projectName),
  PROJECT_FOLDER: projectName,
  STARTER_THEME: themeName,
  THEME_PATH: path.join("themes", themeName)
};
