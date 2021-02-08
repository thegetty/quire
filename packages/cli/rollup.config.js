import babel from "rollup-plugin-babel";
import copy from 'rollup-plugin-copy';
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";
import multiEntry from "rollup-plugin-multi-entry";
import replace from "rollup-plugin-replace";
import json from "rollup-plugin-json";
import path from "path";

const onwarn = warning => {
  // Silence circular dependency warning for moment package
  if (
    warning.code === "CIRCULAR_DEPENDENCY" &&
    !warning.importer.indexOf(path.normalize("node_modules/moment/src/lib/"))
  ) {
    return;
  }
  console.warn(`(!) ${warning.message}`);
};

export default {
  onwarn,
  input: {
    include: ["lib/*.js"]
  },
  output: {
    file: "./bin/index.js",
    format: "iife",
    banner: "#!/usr/bin/env node",
    name: "quire"
  },
  plugins: [
    commonjs({
      include: "node_modules/**"
    }),
    copy({
      targets: [
        { src: ['../../starters', '../../themes'], dest: './bin' }
      ]
    }),
    babel({
      babelrc: false,
      runtimeHelpers: true,
      exclude: "node_modules/**",
      presets: [["@babel/env", { modules: false }]],
      plugins: ["@babel/transform-runtime"]
    }),
    multiEntry(),
    replace({
      delimiters: ["", ""],
      "#!/usr/bin/env node": ""
    }),
    resolve({
      preferBuiltins: false,
      browser: true
    }),
    uglify(),
    json()
  ]
};
