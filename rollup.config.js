import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";
import multiEntry from "rollup-plugin-multi-entry";
import replace from "rollup-plugin-replace";
import json from "rollup-plugin-json";

export default {
  input: {
    include: ["lib/*.js"]
  },
  output: {
    file: "./bin/index.js",
    format: "iife",
    banner: "#!/usr/bin/env node"
  },
  plugins: [
    commonjs({
      include: "node_modules/**"
    }),
    babel({
      babelrc: false,
      runtimeHelpers: true,
      plugins: [
        "@babel/plugin-transform-async-to-generator",
        "@babel/plugin-transform-runtime"
      ],
      presets: ["@babel/preset-env"]
    }),
    multiEntry(),
    replace({
      delimiters: ["", ""],
      "#!/usr/bin/env node": ""
    }),
    resolve({
      include: /node_modules/,
      preferBuiltins: false,
      browser: true
    }),
    uglify(),
    json()
  ]
};
