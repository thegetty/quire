#!/usr/bin/env node

/**
 * @fileOverview Quire CLI
 * @author Eric Gardner / Getty Publications
 * @license MIT
 */

/**
 * Program
 *
 * @description CLI using the Commander library. Quire supports the following
 * commands:
 *
 * ### new <projectName>
 * Creates a new Quire project in the named directory. Uses `git clone` to grab
 * the Quire starter kit and starter theme from GitHub. Also uses `npm install`
 * to install theme dependencies.
 *
 * ### preview
 * Runs the `hugo server` and `webpack --watch` commands in their appropriate
 * directories at the same time, supporting live-reloading for both content
 * and theme files.
 *
 * ### build
 * Builds the theme using Webpack and then builds the website using Hugo.
 *
 * ### pdf
 * Runs the Hugo preview server, and then uses [Prince](http://www.princexml.com/)
 * to hit all pages that do not have `pdf: false` specified in their frontmatter.
 *
 * ### epub
 * Builds an epub version of the site. To be implemented.
 *
 */
const program = require('commander')

const CLI = require('./lib/cli')
const cli = new CLI()

// Shut down child processes on program exit
process.on('SIGINT', function() { cli.emit('shutdown') })

program
  .version('0.1.0.alpha.8')
  .option('-v, --verbose', 'log verbose output')

program
  .command('new <projectName>')
  .description('Create a new Quire project in the current directory.')
  .action(function(projectName) {
    cli.emit('new', projectName)
  })

program
  .command('preview [options]')
  .description('Run the preview server in the current directory')
  .action(function() {
    cli.verbose = program.verbose
    cli.emit('preview')
  })

program
  .command('install')
  .description('Install this project\'s theme dependencies')
  .action(function() {
    cli.emit('install')
  })

// quire build
//
// run the build command in the current directory
// Pass options to hugo?
//
program
  .command('build [options]')
  .description('Run the build command in the current directory')
  .action(function(options) {
    cli.emit('build')
  })

// quire pdf
//
// run the build command in the current directory
// Pass options to hugo?
//
program
  .command('pdf')
  .description('Generate a PDF version of the current project')
  .action(function() {
    cli.emit('pdf')
  })

// quire epub
//
// run the build command in the current directory
// Pass options to hugo?
//
program
  .command('epub')
  .description('Generate an EPUB version of the current project')
  .action(function() {
    cli.emit('epub')
  })

// quire debug
//
program
  .command('debug')
  .description('Development use only - log info about current project')
  .action(function() {
    cli.emit('debug')
  })

// Run the program
//
program.parse(process.argv)
