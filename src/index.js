const fa = (promise, ..._Errs) => {
  const Errs = Array.isArray(_Errs[0]) ? _Errs[0] : _Errs;
  return promise.then(
    val => [val],
    err => {
      if (Errs.length) {
        for (const [index, Err] of Errs.entries()) {
          if (err instanceof Err) {
            return [...Array.from(Array(index + 1), () => void 0), err];
          }
        }
        throw err;
      } else {
        return [void 0, err];
      }
    }
  );
};

const swallow = (promise, fallbackValue, effect) =>
  promise.then(
    val => val,
    err => {
      typeof effect === 'function' && effect(err);
      return fallbackValue;
    }
  );

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
