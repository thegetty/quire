import alias from '@rollup/plugin-alias';
import babel from "rollup-plugin-babel";
import copy from './plugins/rollupCopy';
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";
import multiEntry from "rollup-plugin-multi-entry";
import nodePolyfills from 'rollup-plugin-node-polyfills';
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
    alias({
      entries: [
        { find: '@src', replacement: '../lib' },
      ]
    }),
    babel({
      babelrc: false,
      runtimeHelpers: true,
      exclude: "node_modules/**",
      presets: [["@babel/env", { modules: false }]],
      plugins: ["@babel/transform-runtime"]
    }),
    commonjs({
      include: "node_modules/**"
    }),
    copy([
      { from: "../../starters", to: "./bin/starters" },
      { from: "../../themes", to: "./bin/themes", exclude: ["node_modules"] }
    ]),
    json(),
    multiEntry(),
    nodePolyfills(),
    replace({
      delimiters: ["", ""],
      "#!/usr/bin/env node": ""
    }),
    resolve({
      preferBuiltins: false,
      browser: true
    }),
    uglify()
  ]
};
