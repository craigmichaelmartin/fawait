const { fa, swallow, tapError } = require('./index');

class NonErrorClass {}
class ErrorSubclass extends Error {}

// ----------------------------------------------------------------------------
// `fa`
// ----------------------------------------------------------------------------

// Resolves -------------------------------------------------------------------

test('`fa` - promise resolves, no errors listed', async () => {
  expect.assertions(2);
  const [data, ...shouldBeEmpty] = await fa(Promise.resolve('foo'));
  expect(data).toEqual('foo');
  expect(shouldBeEmpty).toEqual([]);
});

test('`fa` - promise resolves, one error listed', async () => {
  expect.assertions(2);
  const [data, ...shouldBeEmpty] = await fa(Promise.resolve('foo'), TypeError);
  expect(data).toEqual('foo');
  expect(shouldBeEmpty).toEqual([]);
});

test('`fa` - promise resolves, one error listed [DUPLICATE FOR ARRAY API]', async () => {
  expect.assertions(2);
  const [data, ...shouldBeEmpty] = await fa(Promise.resolve('foo'), [TypeError]);
  expect(data).toEqual('foo');
  expect(shouldBeEmpty).toEqual([]);
});

test('`fa` - promise resolves, three errors listed', async () => {
  expect.assertions(2);
  const [data, ...shouldBeEmpty] = await fa(Promise.resolve('foo'), TypeError, RangeError, SyntaxError);
  expect(data).toEqual('foo');
  expect(shouldBeEmpty).toEqual([]);
});

test('`fa` - promise resolves, three errors listed [DUPLICATE FOR ARRAY API]', async () => {
  expect.assertions(2);
  const [data, ...shouldBeEmpty] = await fa(Promise.resolve('foo'), [TypeError, RangeError, SyntaxError]);
  expect(data).toEqual('foo');
  expect(shouldBeEmpty).toEqual([]);
});


// Rejects --------------------------------------------------------------------

test('`fa` - promise rejects, one error listed but not it', async () => {
  expect.assertions(1);
  try {
    await fa(Promise.resolve().then(() => { throw new TypeError(); }), SyntaxError);
  } catch (err) {
    expect(err).toBeInstanceOf(TypeError);
  }
});

test('`fa` - promise rejects, one error listed but not it [DUPLICATE FOR ARRAY API]', async () => {
  expect.assertions(1);
  try {
    await fa(Promise.resolve().then(() => { throw new TypeError(); }), [SyntaxError]);
  } catch (err) {
    expect(err).toBeInstanceOf(TypeError);
  }
});

test('`fa` - promise rejects, three errors listed but not it', async () => {
  expect.assertions(1);
  try {
    await fa(Promise.resolve().then(() => { throw new TypeError(); }), SyntaxError, RangeError, EvalError);
  } catch (err) {
    expect(err).toBeInstanceOf(TypeError);
  }
});

test('`fa` - promise rejects, three errors listed but not it [DUPLICATE FOR ARRAY API]', async () => {
  expect.assertions(1);
  try {
    await fa(Promise.resolve().then(() => { throw new TypeError(); }), [SyntaxError, RangeError, EvalError]);
  } catch (err) {
    expect(err).toBeInstanceOf(TypeError);
  }
});

test('`fa` - promise rejects with native error, no errors listed so default catches all', async () => {
  expect.assertions(3);
  const [data, error, ...shouldBeEmpty] = await fa(Promise.resolve().then(() => { throw new TypeError(); }));
  expect(data).toBeUndefined();
  expect(error).toBeInstanceOf(TypeError);
  expect(shouldBeEmpty).toEqual([]);
});

test('`fa` - promise rejects with custom object, no errors listed so default catches all', async () => {
  expect.assertions(3);
  const [data, error, ...shouldBeEmpty] = await fa(Promise.resolve().then(() => { throw new NonErrorClass(); }));
  expect(data).toBeUndefined();
  expect(error).toBeInstanceOf(NonErrorClass);
  expect(shouldBeEmpty).toEqual([]);
});

test('`fa` - promise rejects, one error listed and its it', async () => {
  expect.assertions(3);
  const [data, typeError, ...shouldBeEmpty] = await fa(Promise.resolve().then(() => { throw new TypeError(); }), TypeError);
  expect(data).toBeUndefined();
  expect(typeError).toBeInstanceOf(TypeError);
  expect(shouldBeEmpty).toEqual([]);
});

test('`fa` - promise rejects, one error listed and its it [DUPLICATE FOR ARRAY API]', async () => {
  expect.assertions(3);
  const [data, typeError, ...shouldBeEmpty] = await fa(Promise.resolve().then(() => { throw new TypeError(); }), [TypeError]);
  expect(data).toBeUndefined();
  expect(typeError).toBeInstanceOf(TypeError);
  expect(shouldBeEmpty).toEqual([]);
});

test('`fa` - promise rejects, one error listed and its a subclass', async () => {
  expect.assertions(3);
  const [data, typeError, ...shouldBeEmpty] = await fa(Promise.resolve().then(() => { throw new ErrorSubclass(); }), Error);
  expect(data).toBeUndefined();
  expect(typeError).toBeInstanceOf(ErrorSubclass);
  expect(shouldBeEmpty).toEqual([]);
});

test('`fa` - promise rejects, one error listed and its a subclass [DUPLICATE FOR ARRAY API]', async () => {
  expect.assertions(3);
  const [data, typeError, ...shouldBeEmpty] = await fa(Promise.resolve().then(() => { throw new ErrorSubclass(); }), [Error]);
  expect(data).toBeUndefined();
  expect(typeError).toBeInstanceOf(ErrorSubclass);
  expect(shouldBeEmpty).toEqual([]);
});

test('`fa` - promise rejects, three errors listed and its first', async () => {
  expect.assertions(5);
  const [data, typeError, rangeError, syntaxError, ...shouldBeEmpty] = await fa(Promise.resolve().then(() => { throw new TypeError(); }), TypeError, RangeError, SyntaxError);
  expect(data).toBeUndefined();
  expect(typeError).toBeInstanceOf(TypeError);
  expect(rangeError).toBeUndefined();
  expect(syntaxError).toBeUndefined();
  expect(shouldBeEmpty).toEqual([]);
});

test('`fa` - promise rejects, three errors listed and its first [DUPLICATE FOR ARRAY API]', async () => {
  expect.assertions(5);
  const [data, typeError, rangeError, syntaxError, ...shouldBeEmpty] = await fa(Promise.resolve().then(() => { throw new TypeError(); }), [TypeError, RangeError, SyntaxError]);
  expect(data).toBeUndefined();
  expect(typeError).toBeInstanceOf(TypeError);
  expect(rangeError).toBeUndefined();
  expect(syntaxError).toBeUndefined();
  expect(shouldBeEmpty).toEqual([]);
});

test('`fa` - promise rejects, three errors listed and its second', async () => {
  expect.assertions(5);
  const [data, typeError, rangeError, syntaxError, ...shouldBeEmpty] = await fa(Promise.resolve().then(() => { throw new RangeError(); }), TypeError, RangeError, SyntaxError);
  expect(data).toBeUndefined();
  expect(typeError).toBeUndefined();
  expect(rangeError).toBeInstanceOf(RangeError);
  expect(syntaxError).toBeUndefined();
  expect(shouldBeEmpty).toEqual([]);
});

test('`fa` - promise rejects, three errors listed and its second [DUPLICATE FOR ARRAY API]', async () => {
  expect.assertions(5);
  const [data, typeError, rangeError, syntaxError, ...shouldBeEmpty] = await fa(Promise.resolve().then(() => { throw new RangeError(); }), [TypeError, RangeError, SyntaxError]);
  expect(data).toBeUndefined();
  expect(typeError).toBeUndefined();
  expect(rangeError).toBeInstanceOf(RangeError);
  expect(syntaxError).toBeUndefined();
  expect(shouldBeEmpty).toEqual([]);
});

test('`fa` - promise rejects, three errors listed and its last', async () => {
  expect.assertions(5);
  const [data, typeError, rangeError, syntaxError, ...shouldBeEmpty] = await fa(Promise.resolve().then(() => { throw new SyntaxError(); }), TypeError, RangeError, SyntaxError);
  expect(data).toBeUndefined();
  expect(typeError).toBeUndefined();
  expect(rangeError).toBeUndefined();
  expect(syntaxError).toBeInstanceOf(SyntaxError);
  expect(shouldBeEmpty).toEqual([]);
});

test('`fa` - promise rejects, three errors listed and its last [DUPLICATE FOR ARRAY API]', async () => {
  expect.assertions(5);
  const [data, typeError, rangeError, syntaxError, ...shouldBeEmpty] = await fa(Promise.resolve().then(() => { throw new SyntaxError(); }), [TypeError, RangeError, SyntaxError]);
  expect(data).toBeUndefined();
  expect(typeError).toBeUndefined();
  expect(rangeError).toBeUndefined();
  expect(syntaxError).toBeInstanceOf(SyntaxError);
  expect(shouldBeEmpty).toEqual([]);
});


// ----------------------------------------------------------------------------
// `swallow`
// ----------------------------------------------------------------------------

// Resolves -------------------------------------------------------------------

test('`swallow` - promise resolves', async () => {
  expect.assertions(1);
  const shouldNotBeCalled = () => { throw 'This should not fire'; };
  const data = await swallow(Promise.resolve('foo'), 'bar', shouldNotBeCalled);
  expect(data).toEqual('foo');
});

// Rejects --------------------------------------------------------------------

test('`swallow` - promise rejects with no effect function', async () => {
  expect.assertions(1);
  const data = await swallow(Promise.reject('foo'), 'bar');
  expect(data).toEqual('bar');
});

test('`swallow` - promise rejects and has effect function', async () => {
  expect.assertions(2);
  const shouldBeCalled = (err) => expect(err).toEqual('foo');
  const data = await swallow(Promise.reject('foo'), 'bar', shouldBeCalled);
  expect(data).toEqual('bar');
});


// ----------------------------------------------------------------------------
// `tapError`
// ----------------------------------------------------------------------------

// Resolves -------------------------------------------------------------------

test('`tapError` - promise resolves', async () => {
  expect.assertions(1);
  const shouldNotBeCalled = () => { throw 'This should not fire'; };
  const data = await tapError(Promise.resolve('foo'), shouldNotBeCalled);
  expect(data).toEqual('foo');
});

// Rejects --------------------------------------------------------------------

test('`tapError` - promise rejects', async () => {
  expect.assertions(3);
  const shouldBeCalled = () => expect('called').toEqual('called');
  let data;
  try {
    data = await tapError(Promise.reject('foo'), shouldBeCalled);
  } catch (err) {
    expect(err).toEqual('foo');
  }
  expect(data).toBeUndefined();
});
