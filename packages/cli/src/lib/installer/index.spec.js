import test from 'ava'
import { installer, getVersionFromPath, initStarter, installInProject, latest, versions } from './index.js'

/**
 * Installer Module Unit Tests
 *
 * Tests the installer module interface and API contract.
 * These tests verify the module exports and method signatures
 * without actually executing the installer operations.
 */

// Module export tests
test('installer module exports installer object', (t) => {
  t.truthy(installer, 'installer should be exported')
  t.is(typeof installer, 'object', 'installer should be an object')
})

test('installer module exports initStarter function', (t) => {
  t.truthy(initStarter, 'initStarter should be exported')
  t.is(typeof initStarter, 'function', 'initStarter should be a function')
})

test('installer module exports installInProject function', (t) => {
  t.truthy(installInProject, 'installInProject should be exported')
  t.is(typeof installInProject, 'function', 'installInProject should be a function')
})

test('installer module exports latest function', (t) => {
  t.truthy(latest, 'latest should be exported')
  t.is(typeof latest, 'function', 'latest should be a function')
})

test('installer module exports versions function', (t) => {
  t.truthy(versions, 'versions should be exported')
  t.is(typeof versions, 'function', 'versions should be a function')
})

test('installer module exports getVersionFromPath function', (t) => {
  t.truthy(getVersionFromPath, 'getVersionFromPath should be exported')
  t.is(typeof getVersionFromPath, 'function', 'getVersionFromPath should be a function')
})

// installer object methods tests
test('installer object has initStarter method', (t) => {
  t.is(typeof installer.initStarter, 'function', 'initStarter should be a function')
})

test('installer object has installInProject method', (t) => {
  t.is(typeof installer.installInProject, 'function', 'installInProject should be a function')
})

test('installer object has latest method', (t) => {
  t.is(typeof installer.latest, 'function', 'latest should be a function')
})

test('installer object has versions method', (t) => {
  t.is(typeof installer.versions, 'function', 'versions should be a function')
})

test('installer object has getVersionFromPath method', (t) => {
  t.is(typeof installer.getVersionFromPath, 'function', 'getVersionFromPath should be a function')
})

// Verify exported functions match installer object methods
test('exported initStarter matches installer.initStarter', (t) => {
  t.is(initStarter, installer.initStarter, 'initStarter export should match installer.initStarter')
})

test('exported installInProject matches installer.installInProject', (t) => {
  t.is(installInProject, installer.installInProject, 'installInProject export should match installer.installInProject')
})

test('exported latest matches installer.latest', (t) => {
  t.is(latest, installer.latest, 'latest export should match installer.latest')
})

test('exported versions matches installer.versions', (t) => {
  t.is(versions, installer.versions, 'versions export should match installer.versions')
})

test('exported getVersionFromPath matches installer.getVersionFromPath', (t) => {
  t.is(getVersionFromPath, installer.getVersionFromPath, 'getVersionFromPath export should match installer.getVersionFromPath')
})
