import path = require('path')
import mkdirp = require('mkdirp-promise')
import {Test} from 'tape'
import execa = require('execa')

const tmpPath = path.join(__dirname, '..', '..', '.tmp')

let dirNumber = 0

export default async function prepare (t: Test) {
  dirNumber++
  const dirname = dirNumber.toString()
  const pkgTmpPath = path.join(tmpPath, dirname, 'project')
  await mkdirp(pkgTmpPath)
  process.chdir(pkgTmpPath)
  await execa('git', ['config', 'user.email', 'nobody@example.com'])
  await execa('git', ['config', 'user.name', 'Nobody'])
  await execa('git', ['init'])
  await execa('git', ['config', 'user.email', 'nobody@example.com'])
  await execa('git', ['config', 'user.name', 'Nobody'])
  t.pass(`create testing package ${dirname}`)
}
