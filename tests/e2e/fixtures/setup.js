/**
 * Creates a test project for end to end tests
 */

const exec = require("child_process").exec;
const path = require("path");
const CONFIG = require("./project-config");

console.log("Creating test project, this may take a while...");
const childProcess = exec(`quire new ${CONFIG.PROJECT_FOLDER}`, { cwd: CONFIG.FIXTURES_DIR });
childProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});
childProcess.on('close', () => {
  console.log(`Done creating test project.`)
});

