# is-pkg-changed

> Detects whether package has been changed since last publish

<!--@shields('npm', 'travis')-->
[![npm version](https://img.shields.io/npm/v/is-pkg-changed.svg)](https://www.npmjs.com/package/is-pkg-changed) [![Build Status](https://img.shields.io/travis/zkochan/is-pkg-changed/master.svg)](https://travis-ci.org/zkochan/is-pkg-changed)
<!--/@-->

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

## License

[MIT](./LICENSE) © [Zoltan Kochan](https://www.kochan.io)
