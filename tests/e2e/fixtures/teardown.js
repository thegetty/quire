/**
 * Removes test project after end to end tests have completed
 */

const fs = require("fs");
const path = require("path");
const CONFIG = require("./project-config");
const spawnSync = require("child_process").spawnSync;

console.log("Cleaning up test project...");
spawnSync("PID= ps -ef | grep 'quire preview' | grep -v grep | awk '{print $2}' | xargs kill -INT");
spawnSync("rm", ["-drf", `${path.join(CONFIG.FIXTURES_DIR, CONFIG.PROJECT_FOLDER)}`]);
fs.rmdirSync(path.join(CONFIG.FIXTURES_DIR, CONFIG.PROJECT_FOLDER), { recursive: true });
console.log("Done.");
