# `fAwait`

[![codecov](https://codecov.io/gh/craigmichaelmartin/fawait/branch/master/graph/badge.svg)](https://codecov.io/gh/craigmichaelmartin/fawait)
[![Build Status](https://travis-ci.org/craigmichaelmartin/fawait.svg?branch=master)](https://travis-ci.org/craigmichaelmartin/fawait)
[![Greenkeeper badge](https://badges.greenkeeper.io/craigmichaelmartin/fawait.svg)](https://greenkeeper.io/)

## Installation

```bash
npm install --save fawait
```

## What is `fAwait`?

`fAwait` is a javascript library for working with the `await` syntax for promises.

Wrap your promise in the `fa` function, and provide errors you want to catch, and you'll receive an array you can unpack to those values. Any errors not specified will be thrown.

Read about it: [Making Await More Functional in JavaScript](https://dev.to/craigmichaelmartin/making-await-more-functional-in-javascript-2le4)

```javascript
let [data, typeError, customBadThing] = await fa(promise, TypeError, BadThing);
```

## Alternatives / Prior Art

- [`fPromise`](https://github.com/craigmichaelmartin/fpromise) which is a heavier-weight promise solution.
- [`go-for-it`](https://github.com/gunar/go-for-it) and [`safe-await`](https://github.com/DavidWells/safe-await) which convert all non-native errors to this functional form.
- [`await-to-js`](https://github.com/scopsy/await-to-js) which converts all errors to this functional form.
