import tape = require('tape')
import promisifyTape from 'tape-promise'
import path = require('path')
import execa = require('execa')
import writePkg = require('write-pkg')
import touch = require('touch')
import fs = require('mz/fs')
import isPkgChanged from '../src'
import prepare from './utils/prepare'

const test = promisifyTape(tape)

const tmpFolder = path.join(__dirname, '.tmp')

test('detects no change', async t => {
  await prepare(t)
  await writePkg('foo', {name: 'foo', version: '1.0.0'})
  await execa('git', ['add', '.'])
  await execa('git', ['commit', '-m', 'Initial commit'])
  await execa('git', ['tag', '-a', 'foo/1.0.0', '-m', ''])

  t.ok(await isPkgChanged('foo') === false, 'no change')
})

test('detects change when file is added', async t => {
  await prepare(t)
  await writePkg('foo', {name: 'foo', version: '1.0.0'})
  await execa('git', ['add', '.'])
  await execa('git', ['commit', '-m', 'Initial commit'])
  await execa('git', ['tag', '-a', 'foo/1.0.0', '-m', ''])

  process.chdir('foo')
  touch.sync('index.js')

  await execa('git', ['add', '.'])
  await execa('git', ['commit', '-m', 'Add file'])

  t.ok(await isPkgChanged('.') === true, 'change')
})

test('detects change when file is deleted', async t => {
  await prepare(t)
  await writePkg('foo', {name: 'foo', version: '1.0.0'})
  process.chdir('foo')
  touch.sync('index.js')
  await execa('git', ['add', '.'])
  await execa('git', ['commit', '-m', 'Initial commit'])
  await execa('git', ['tag', '-a', 'foo/1.0.0', '-m', ''])

  await execa('git', ['rm', 'index.js'])
  await execa('git', ['commit', '-m', 'Remove file'])

  t.ok(await isPkgChanged('.') === true, 'change')
})

test('detects change when file is modified', async t => {
  await prepare(t)
  await writePkg('foo', {name: 'foo', version: '1.0.0'})
  process.chdir('foo')
  touch.sync('index.js')
  await execa('git', ['add', '.'])
  await execa('git', ['commit', '-m', 'Initial commit'])
  await execa('git', ['tag', '-a', 'foo/1.0.0', '-m', ''])

  await fs.writeFile('index.js', 'console.log("hello world")', 'utf8')

  await execa('git', ['add', '.'])
  await execa('git', ['commit', '-m', 'Remove file'])

  t.ok(await isPkgChanged('.') === true, 'change')
})

test('detects nothing when no tags found', async t => {
  await prepare(t)
  await writePkg('foo', {name: 'foo', version: '1.0.0'})
  await execa('git', ['add', '.'])
  await execa('git', ['commit', '-m', 'Initial commit'])

  t.ok(await isPkgChanged('foo') === undefined, 'unknown')
})

test('packages is not changed when only ignored files were modified', async t => {
  await prepare(t)
  await writePkg('foo', {name: 'foo', version: '1.0.0'})
  await execa('git', ['add', '.'])
  await execa('git', ['commit', '-m', 'Initial commit'])
  await execa('git', ['tag', '-a', 'foo/1.0.0', '-m', ''])

  process.chdir('foo')
  touch.sync('README.md')

  await execa('git', ['add', '.'])
  await execa('git', ['commit', '-m', 'Add file'])

  t.ok(await isPkgChanged('.') === false, 'no change')
})

test('packages is not changed when only custom ignored files were modified', async t => {
  await prepare(t)
  await writePkg('foo', {name: 'foo', version: '1.0.0'})
  await execa('git', ['add', '.'])
  await execa('git', ['commit', '-m', 'Initial commit'])
  await execa('git', ['tag', '-a', 'foo/1.0.0', '-m', ''])

  process.chdir('foo')
  touch.sync('foo-bar.js')

  await execa('git', ['add', '.'])
  await execa('git', ['commit', '-m', 'Add file'])

  t.ok(await isPkgChanged('.', {ignore: ['**/foo-bar.js']}) === false, 'no change')
})
