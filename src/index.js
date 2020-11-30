const fa = (promise, ...Errs) =>
  promise.then(
    val => [val],
    err => {
      for (const [index, Err] of Errs.entries()) {
        if (err instanceof Err) {
          return [...Array.from(Array(index + 1), () => void 0), err];
        }
      }
      throw err;
    }
  );

const swallow = (promise, fallbackValue) =>
  promise.then(val => val, _err => fallbackValue);

const tapError = (promise, tapFn) =>
  promise.then(
    val => val,
    err => {
      tapFn(err);
      throw err;
    }
  );

module.exports = {
  fa,
  swallow,
  tapError
};
