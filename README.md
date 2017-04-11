# is-pkg-changed

> Detects whether package has been changed since last publish

<!--@shields('npm', 'travis')-->
[![npm version](https://img.shields.io/npm/v/is-pkg-changed.svg)](https://www.npmjs.com/package/is-pkg-changed) [![Build Status](https://img.shields.io/travis/zkochan/is-pkg-changed/master.svg)](https://travis-ci.org/zkochan/is-pkg-changed)
<!--/@-->

Great for _monorepos_. Looks up the commit which was used to publish the last version of the package.
The commit has to be marked with a tag in the format `<pkg name>/<pkg version>`. So if the last published package
was `2.0.0` and the package name is `foo`, the `foo/2.0.0` git tag is looked up.

## Installation

```sh
npm i -S is-pkg-changed
```

## Usage

```js
const isPkgChanged = require('is-pkg-changed').default

isPkgChanged('/user/repo/pkg').then(isChanged => console.log(isChanged))
//> true or false or undefined
```

## API

### `isPkgChanged(pkgPath, [options])`

**Arguments:**

- `pkgPath` - _string_ - path to the package.
- `options.ignore` - _string\[]_ - an array of filename patterns to ignore when analyzing the working tree for changes since last publish. The default value has: `**/test/**`, `**/tests/**` and `**/*.md`.

**Returns:**

- `true` - if there were changes in non-ignored files since last publish
- `false` - if there were no changes in non-ignored files since last publish
- `undefined` - if no git tag was found to recognize the publish commit

## License

[MIT](./LICENSE) © [Zoltan Kochan](https://www.kochan.io)
