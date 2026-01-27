/**
 * Quire configuration schema
 * @see https://github.com/sindresorhus/conf#schema
 *
 * Nota bene: default values here are overwritten by values in defaults.js
 * @see https://github.com/sindresorhus/conf#defaults
 */
import { schema as epubEngineSchema } from '#lib/epub/schema.js'
import { schema as pdfEngineSchema } from '#lib/pdf/schema.js'

export default {
  debug: {
    type: 'boolean',
    description: 'Enable debug output by default (equivalent to --debug flag)'
  },
  epubEngine: epubEngineSchema,
  pdfEngine: pdfEngineSchema,
  logLevel: {
    type: 'string',
    enum: ['trace', 'debug', 'info', 'warn', 'error', 'silent'],
    description: 'Minimum log level to display (trace, debug, info, warn, error, silent)'
  },
  logPrefix: {
    type: 'string',
    description: 'Prefix text shown before log messages'
  },
  logPrefixStyle: {
    type: 'string',
    enum: ['bracket', 'emoji', 'plain', 'none'],
    description: 'Style for displaying the log prefix (bracket: [quire], emoji: 📖, plain: quire:, none: no prefix)'
  },
  logShowLevel: {
    type: 'boolean',
    description: 'Show log level label (INFO, WARN, etc.) in output'
  },
  logUseColor: {
    type: 'boolean',
    description: 'Use colored output for log messages'
  },
  logColorMessages: {
    type: 'boolean',
    description: 'Color message text by log level (e.g., red for errors). Requires logUseColor'
  },
  projectTemplate: {
    type: 'string',
    format: 'uri',
    description: 'URL of the default project template for quire new'
  },
  quire11tyPath: {
    type: 'string',
    description: 'Path to the quire-11ty package (use "." for local development)'
  },
  staleThreshold: {
    type: 'string',
    enum: ['ZERO', 'SHORT', 'HOURLY', 'DAILY', 'NEVER'],
    description: 'How stale an output must be before doctor warns (ZERO=0m, SHORT=5m, HOURLY=60m, DAILY=12h, NEVER=disabled)'
  },
  quireVersion: {
    type: 'string',
    description: 'Version of quire-11ty to use ("latest" or specific version)'
  },
  updateChannel: {
    type: 'string',
    enum: ['stable', 'rc', 'beta', 'alpha'],
    description: 'Release channel for updates (stable, rc, beta, alpha)'
  },
  updateInterval: {
    type: 'string',
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'NEVER'],
    description: 'How often to check for updates (DAILY, WEEKLY, MONTHLY, NEVER)'
  },
  verbose: {
    type: 'boolean',
    description: 'Enable verbose output by default (equivalent to --verbose flag)'
  },
  versionFile: {
    type: 'string',
    description: 'Filename used to identify Quire projects'
  },
  buildStatus: {
    type: 'object',
    description: 'Per-project build status tracking (internal)',
    additionalProperties: {
      type: 'object',
      properties: {
        projectPath: { type: 'string' },
        build: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ok', 'failed'] },
            timestamp: { type: 'number' },
          },
          required: ['status', 'timestamp'],
        },
        pdf: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ok', 'failed'] },
            timestamp: { type: 'number' },
          },
          required: ['status', 'timestamp'],
        },
        epub: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ok', 'failed'] },
            timestamp: { type: 'number' },
          },
          required: ['status', 'timestamp'],
        },
      },
      required: ['projectPath'],
    },
  },
}
