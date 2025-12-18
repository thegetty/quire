export default {
  environmentVariables: {
    NODE_ENV: 'test'
  },
  files: [
    'src/commands/**/*.spec.js', // Unit tests
    'src/commands/**/*.test.js', // Integration tests
    'test/e2e/**/*.e2e.js'       // End-to-end tests
  ],
  nodeArguments: [
    '--no-warnings'
  ],
  timeout: '2m',
  verbose: true
}
