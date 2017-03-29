#!/usr/bin/env node

/**
 * @fileOverview Quire CLI
 * @author Eric Gardner / Getty Publications
 * @license MIT
 *
 */

const program = require('commander')
const QuireCLI = require('./lib/quire')
const cli = new QuireCLI()

// Version
//
program
  .version('0.1.0')

// quire new
//
// Create a new Quire project in the current directory
// Should run necessary setup scripts after init
//
program
  .command('new <projectName>')
  .description('Create a new Quire project in the current directory.')
  .action(function(projectName) {
    cli.emit('new', projectName)
  })

// quire preview
//
// run the preview server in the current directory
// Pass options to hugo?
//
program
  .command('preview [options]')
  .description('Run the preview server in the current directory')
  .action(function() {
    cli.emit('preview')
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
    build()
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
    pdf()
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
    epub()
  })

// Run the program
//
program.parse(process.argv)
