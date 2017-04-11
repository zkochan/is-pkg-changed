import path = require('upath')
import Git = require('nodegit')
import R = require('ramda')
import mm = require('micromatch')
import readPkg = require('read-pkg')
import findUp = require('find-up')

const DEFAULT_IGNORE = [
  '**/test/**',
  '**/tests/**',
  '**/*.md',
]

export default async function (
  pkgPath: string,
  opts?: {
    ignore: string[],
  }
): Promise<Boolean | undefined> {
  const ignore = opts && opts.ignore || DEFAULT_IGNORE
  pkgPath = path.resolve(pkgPath)
  const pkg = await readPkg(pkgPath, {normalize: false})
  const gitPath = await findUp('.git', {cwd: pkgPath})
  const repo = await Git.Repository.open(gitPath)
  const oid = await getOid(pkg.name, pkg.version, repo)
  if (!oid) {
    return undefined
  }

  const tagCommit = await repo.getCommit(oid)
  const prevTree = await tagCommit.getTree()
  const head = await repo.getHeadCommit()
  const headTree = await head.getTree()
  const diff = await headTree.diff(prevTree)
  const patches = await diff.patches()

  const pkgRelPath = path.relative(path.join(gitPath, '..'), pkgPath)
  const isInPkg = R.partial(pathIsInPkg, [pkgRelPath])
  const isIgnored = R.partialRight(mm.any, [ignore])

  return R.unnest(patches.map(patch => [patch.oldFile().path(), patch.newFile().path()]))
    .some(filePath => isInPkg(filePath) && !isIgnored(filePath))
}

async function getOid(pkgName, pkgVersion, repo) {
  try {
    const tag = await repo.getTagByName(`${pkgName}/${pkgVersion}`)
    return tag.targetId()
  } catch (err) {
    return null
  }
}

function pathIsInPkg(pkgPath, filePath) {
  return filePath.startsWith(pkgPath)
}
