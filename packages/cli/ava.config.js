export default {
  environmentVariables: {
    NODE_ENV: 'test'
  },
  files: [
    'src/commands/**/*.spec.js', // Unit tests
    'src/commands/**/*.test.js', // Integration tests
    'src/helpers/**/*.test.js',  // Integration tests
    'src/lib/**/*.spec.js',      // Lib unit tests
    'src/lib/**/*.test.js',      // Lib integration tests
    'test/e2e/**/*.e2e.js'       // End-to-end tests
  ],
  nodeArguments: [
    '--no-warnings'
  ],
  timeout: '2m',
  verbose: true
}
