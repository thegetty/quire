export default {
  input: {
    include: ["index.js", "lib/*.js"]
  },
  output: {
    file: "./bin/index.js",
    format: "iife",
    name: "bundle"
  },
  plugins: [multiEntry()]
};
