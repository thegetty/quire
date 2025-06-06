# Quire tests

This directory contains integration and functional browser tests for quire-cli and quire-11ty.

## Integration tests

Integration tests are run in `ava`, see `integration-test.mjs` for an example. Any `.mjs` file in this directory will run in both `npm run test` and `npm run test:integration`.

## Browser tests

Browser tests are run in `playwright`, see `publication-cover.spec.js` for an example. Any `spec.js` file in this directory will run in both `npm run test` and `npm run test:browsers` commands.

These tests expect `npm run test:integration` to have been run before executing! That is, there should be a complete default publication build at `test-publication/_site`.

### Development server

These tests expect that a server is hosting site content at localhost:8080 (a static server established by [`http-server`](https://www.npmjs.com/package/http-server), available on its own via `npm run test:serve`.