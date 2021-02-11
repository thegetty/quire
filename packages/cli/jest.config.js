const path = require("path");
const dir = path.join(process.cwd(), "test-results", "jest");

module.exports = {
  "moduleNameMapper": {
    "^@src(.*)$": "<rootDir>/lib$1"
  } ,
  reporters: [
    "default",
    [
      "jest-junit",
      {
        suiteName: "Tests for Quire CLI",
        outputDirectory: dir,
        outputName: "results.xml"
      }
    ]
  ],
  testEnvironment: "node",
  transform: {
    ".*": "<rootDir>/node_modules/babel-jest"
  }
};
