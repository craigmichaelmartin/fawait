interface faFun { 
  <T>(promise: Promise<T>, ...Errs: ErrorConstructor[]): Promise<(T|undefined|Error)[]>;
}
export default interface faType {
  safe: faFun;
  fp: faFun;
  f: faFun;
}