# `fAwait`

[![Build Status](https://travis-ci.org/craigmichaelmartin/fawait.svg?branch=master)](https://travis-ci.org/craigmichaelmartin/fawait)
[![codecov](https://codecov.io/gh/craigmichaelmartin/fawait/branch/master/graph/badge.svg)](https://codecov.io/gh/craigmichaelmartin/fawait)

## What is `fAwait`?

`fAwait` is a javascript library for working with the `await` syntax in a more functional way. "fAwait" is short for "functional await" 😉

### How To Use It

Wrap your promise with the `fa` function, and provide error types you want to catch (or leave empty to catch all), and you'll receive an array you can unpack to those values. If you do not provide any error types, ALL will be caught. If error types are provided, and the promise rejects with one not specified, it will be thrown.

Read about it: [Making Await More Functional in JavaScript](https://dev.to/craigmichaelmartin/making-await-more-functional-in-javascript-2le4)

### Examples

#### Catching Specified Erros

```javascript
const { fa } = require('fawait');
const [data, typeError, myError] = await fa(promise, TypeError, MyError);
// If the promise resolves, data will be defined.
// If the promise rejects with a TypeError, typeError will be defined.
// If the promise rejects with my own custom error, myError will be defined.
// If the promise rejects with any other error, the await will throw.
```

#### Catching all

This is not really recommended (only handle what you are expecting), but YOLO:

```javascript
const { fa } = require('fawait');
const [data, error] = await fa(promise);
// If the promise resolves, data will be defined.
// If the promise rejects, error will be defined.
// The await will never throw an error.
```

### Alternate API

Error types can also be passed to the `fa` function as an array, rather than as
separate parameters, because, well, its so easy to implement why not?

```javascript
const [data, typeError, myError] = await fa(
  somePromiseReturningFunctionThatIsKindaLong(oh, and, has, some, params),
  [TypeError, MyError]
);
```

## Installation

```bash
npm i fawait
```

## Alternatives / Prior Art

- [`fPromise`](https://github.com/craigmichaelmartin/fpromise) which is a heavier-weight promise solution.
- [`go-for-it`](https://github.com/gunar/go-for-it) and [`safe-await`](https://github.com/DavidWells/safe-await) which convert all non-native errors to this functional form.
- [`await-to-js`](https://github.com/scopsy/await-to-js) which converts all errors to this functional form.
