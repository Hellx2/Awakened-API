export let range = (start, stop = undefined, step = undefined) => {
  if(!stop) {
    stop = start;
    start = 0;
  }
  step = step || 0;
  if([typeof start, typeof stop, typeof step].map(n => n != "number").contains(true)) throw new TypeError();
  if(step == 0 || (step < 0 && stop - start >= 0) || (stop - start) % step != 0) throw new RangeError();
  let r = [];
  for(let i = start; stop - start < 0 ? i > stop : i < stop; i++)
    r.push(i);
  return r;
}

export let merge = (...objs) => {
  let r = {};
  for(let obj of objs)
    r = { ...r, ...obj };
  return r;
}

export let math = merge(Math, {
  ln: this.log,
  rt: (x, rt) => x ** (1 / rt),
  sec: x => 1 / this.cos(x),
  csc: x => 1 / this.sin(x),
  cot: x => 1 / this.tan(x),
  asec: x => this.acos(1 / x),
  acsc: x => this.asin(1 / x),
  acot: x => this.atan(1 / x),
  sech: x => 1 / this.cosh(x),
  csch: x => 1 / this.sinh(x),
  coth: x => 1 / this.tanh(x),
  asech: x => this.acosh(1 / x),
  acsch: x => this.asinh(1 / x),
  acoth: x => this.atanh(1 / x)
})
