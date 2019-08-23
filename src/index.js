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

module.exports = {
  // I don't know what alias is short and sweet and that people will want
  safe: fa,
  fp: fa,
  fa
};
