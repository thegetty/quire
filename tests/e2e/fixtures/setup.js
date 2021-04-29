/**
 * Creates a test project for end to end tests
 */

const spawnSync = require("child_process").spawnSync;
const path = require("path");
const CONFIG = require("./project-config");

console.log("Generating test project, this may take a while...");
spawnSync("quire", [
  "new",
  path.join(CONFIG.FIXTURES_DIR, CONFIG.PROJECT_FOLDER),
]);
console.log("Done creating test project.");
