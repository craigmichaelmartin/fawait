# `fAwait`

[![Build Status](https://travis-ci.org/craigmichaelmartin/fawait.svg?branch=master)](https://travis-ci.org/craigmichaelmartin/fawait)
[![codecov](https://codecov.io/gh/craigmichaelmartin/fawait/branch/master/graph/badge.svg)](https://codecov.io/gh/craigmichaelmartin/fawait)

## What is `fAwait`?

`fAwait` is a javascript library for working with the `await` syntax in a more functional way.

## How To Use It

Wrap your promise with the `fa` function, and provide error types you want to catch, and you'll receive an array you can unpack to those values. If error types are provided, and the promise rejects with one not specified, it will be thrown. Error types can be the built-ins, or your own custom error types. If no error types are provided, all will be caught.

```javascript
const { fa } = require('fawait');

const [data, myError] = await fa(promise, MyError);
// If the promise resolves, data will be defined.
// If the promise rejects with my own custom error, myError will be defined.
// If the promise rejects with any other error, the await will throw.

const [data, typeError, myError] = await fa(promise, TypeError, MyError);
// If the promise resolves, data will be defined.
// If the promise rejects with a TypeError, typeError will be defined.
// If the promise rejects with my own custom error, myError will be defined.
// If the promise rejects with any other error, the await will throw.

const [data, error] = await fa(promise);
// If the promise resolves, data will be defined.
// If the promise rejects, error will be defined.
// The await will never throw an error.
```

## Why use `fAwait`?

1. Code using this pattern is more readable.
2. Being forced to specify which types of errors you catch ensures safer code.
3. While the above is always true, it's even more critical in JS async code where most of your program [ends up async](https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/), and the try/catch's are not for little pure leaf-node functions, but for layers and layers of async code (where simple programing mistakes/errors many functions down do not blow up the program as they would in sync code, but get passed along the rejection path) and so neccesitates really strict analysis of these errors. Your intentional business logic errors now live alongside your basic typos.

Read about it: [Making Await More Functional in JavaScript](https://dev.to/craigmichaelmartin/making-await-more-functional-in-javascript-2le4)

TLDR contrived example:

```javascript
const getArticleEndpoint = async (req, res) => {
  // This code is short and readable, and is specific with errors it's catching
  const [article, queryResultError] = await fa(getArticle(slug), QueryResultError);
  if (queryResultsError) {
    return res.sendStatus(404);
  }
  await article.incrementReadCount();
  const json = article.serializeForAPI();
  res.status(200).json(json);;
}
```

Without `fAwait` there may be a temptation to write this:

```javascript
const getArticleEndpoint = async (req, res) => {
  // This code looks short and readable, but is not equivalent.
  try {
    const article = await getArticle(slug);
    await article.incrementReadCount();
    const json = article.serializeForAPI();
    res.status(200).json(json);
  } catch (error) {
    // This is catching too much code. If the increment or serialize methods
    // fail, a 404 is confusingly sent and developer time wasted going down
    // the wrong path of looking into the article and slug and get method,
    // when really it could be the other methods.
    res.sendStatus(404);
  }
}
```

which is catching too much code. And if realized, may then become:

```javascript
const getArticleEndpoint = (req, res) => {
  // This code feels like it is working against the language -
  // declaring a variable ahead of time to escape a scoping issue
  // of having to attempt our function in a try block - but is correct.
  let article;
  try {
    article = await getArticle(slug);
  } catch (error) {
    // This is still too broad, and could errantly send a 404 for other
    // types of errors (for example a simple typo in the getArticle,
    // which if it were sync would blow up right away, but since it
    // is async now bubbles up here) again potentially wasting developer
    // time going down the wrong path of looking into the article and slug.
    return res.sendStatus(404);
  }
  article.incrementReadCount();
  res.send(article.serializeForAPI());
}
```

which is better, but still catching too broadly - and *especially* in the case
of async code (where simple programing typos/mistakes/errors do not blow up the
program, but get passed along with the rejection path and so neccesitates really
strict analysis of these errors).

And so we'd finally get to the equivalent code:

```javascript
const getArticleEndpoint = (req, res) => {
  // This code feels like it is working against the language -
  // declaring a variable ahead of time to escape a scoping issue
  // of having to attempt our function in a try block - but is correct.
  let article;
  try {
    article = getArticle(slug);
  } catch (error) {
    // We remember to check the error
    if (error instanceof QueryResultError) {
      return res.sendStatus(404);
    }
    // and to re-throw the error if not our type
    throw error;
  }
  article.incrementReadCount();
  res.send(article.serializeForAPI());
}
```


## Alternate API

Error types can also be passed to the `fa` function as an array, rather than as
separate parameters. This can make the code look nicer when formatted.

```javascript
const [data, typeError, myError] = await fa(
  somePromiseReturningFunctionThatIsKindaLong(oh, and, has, some, params),
  [TypeError, MyError]
);
```

## Addtional Utility Methods in `fAwait`

In addtion to the `fa` function described above, `fAwait` includes two other utility helpers for working with async code.

### `swallow`

Swallow returns the value the promise resolves to, or else a default value you provide. It will never throw an error. It may also take a function that is called with the error.

```javascript
const { swallow } = require('fawait');
const { logError } = require('./logging');
const greeting = await swallow(getGreeting(), 'Hey There!', logError);
// If the promise resolves, greeting will be the value.
// If the promise rejects, greeting will be "Hey There!" and logError will be called with the error.
// The await will never throw an error.
```

### `tapError`

`tapError` is a function that is called with the error only if the promise rejects. It does not handle the error - the original error is received, but allows some side effect on that error. This is useful when an error traverses through many "layers" in the program (EG, db -> dao -> service -> controller), and each layer may easily perform side-effects regarding what the error means for it without needing to account for its journey.

```javascript
const { tapError } = require('fawait');
const getOne = (data) => tapError(db.one(data), logError);
// If the promise resolves, the value will be returned.
// If the promise rejects, the rejected promise will be returned but with the error already logged.
```

## Installation

```bash
npm i fawait
```

## Alternatives / Prior Art

- [`fPromise`](https://github.com/craigmichaelmartin/fpromise) which is a heavier-weight promise solution.
- [`go-for-it`](https://github.com/gunar/go-for-it) and [`safe-await`](https://github.com/DavidWells/safe-await) which convert all non-native errors to this functional form.
- [`await-to-js`](https://github.com/scopsy/await-to-js) which converts all errors to this functional form.
