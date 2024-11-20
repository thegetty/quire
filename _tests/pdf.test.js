const test = require('node:test');

import { execa } from 'execa';
import { PDFDocument } from 'pdf-lib';

// Start a new default publication, build it, and make the pdf
var { stderr, stdout } = await execa("npx",["quire","new", "--quire-path", "$(pwd)/packages/11ty", "test-pub"])
// FIXME: Check exit code

process.chdir("test-pub")
var { stderr, stdout } = await execa("npx",["quire","build"])
// FIXME: Check exit code

var { stderr, stdout } = await execa("npx",["quire","pdf"])
// FIXME: Check exit code

// FIXME: - TEST 0: pdf should exist, pdf should have 23 pages