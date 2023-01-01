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

export let arrUtil = {
  allIndexesOf: (arr = [], num = NaN) => {
    if(arr.length == 0) return [];
    let r = [];
    for(let i = 0; i < arr.length; i++ ) 
      if(arr[i] == num || (isNaN(num) && isNaN(arr[i]))) 
        r.push(i);
    return r;
  },
  merge: (...arrs) => {
    let r = [];
    for(let arr of arrs) 
      if(!(arr instanceof Array)) throw new TypeError(`Found parameter of type '${typeof arr}' where only accepting arrays!`);
      else r = [...r, ...arr];
    return r;
  },
  intersect: (...arrs) => {
    let r = [];
    for(let arr of arrs)
      for(let i = 0; i < r.length; i++)
        if(!arr.contains(r[i])) r.splice(i, 1);
    return r;
  },
  union: (...arrs) => {
    let r = [];
    for(let arr of arrs)
      if(!(arr instanceof Array)) throw new TypeError(`Found parameter of type '${typeof arr}' where only accepting arrays!`);
      else for(let x of arr) 
        if(!r.contains(x)) r.push(x);
    return r;
  },
  difference: (arr1, arr2) => {
    for(let i = 0; i < arr1.length; i++) 
      if(arr2.contains(arr1[i])) arr1.splice(i--, 1)
    return arr1;
  }
}

export const math = Math = merge(Math, {
  ln: x => this.log(x),
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
  acoth: x => this.atanh(1 / x),
  sum: (...nums) => {
    let r = 0;
    for(let num of nums) 
      r += num;
    return r;
  },
  avg: (...nums) => this.sum(...nums) / nums.length,
  mean: (...nums) => this.avg(...nums),
  median: (...nums) => this.avg(...nums),
  mode: (...nums) => {
    let times = [];
    for(let n of nums) times[n]++;
    return arrUtil.allIndexesOf(times, max(...times));
  }
})

export let parseBoolean = x => {
  switch(typeof x) {
    case "boolean": return x;
    case "number":
    case "bigint": return x != 0 && x != 0n;
    case "string": return x.split("true").length > x.split("false").length;
    case "function": return parseBoolean(x());
    default: return x != undefined;
  }
}

export let parseInt = x => {
  switch (typeof x) {
    case "number": return x;
    case "string": return Number.parseFloat(x) || Number.parseInt(x);
    case "boolean": return x ? 1 : 0;
    case "function": return parseInt(x());
    default: return Number(x);
  }
}

export let toJSON = x => JSON.parse(x);

export let parseString = x => {
  if(typeof x === "object") return toJSON(x);
  return `${x}`;
}

export let _window = class {
  #window = new Window();

  get #document() {
    return this.#window.document;
  }

  set #document(v) {
    if(!(v instanceof Document)) throw new TypeError("Paramater 'v' must be of type 'Document'!")
    this.#document = v;
  }
  
  constructor(window) {
    if(!(window instanceof Window)) throw new TypeError("Parameter 'window' must be of type 'Window'!");
    this.#window = window;
  }

  static {
    Object.defineProperties(this.prototype, {
      charset: {
        get: (this) => {
          if(!(this instanceof _window)) throw new TypeError("Getter 'charset' must be run as type '_window'!");
          return this.#document.characterSet;
        },
        set: (this, v) => {
          throw new TypeError(`Property 'charset' is readonly, cannot set it to the value ${v}!`);
        },
        writable: false
      }
    });
  }

  get length() {
    return this.#window.length;
  }

  fullscreen() {
    if(!this.#document.fullscreenEnabled) throw new Error("Fullscreen is not enabled for this document!");
    if(this.#document.fullscreenElement) this.#document.exitFullscreen();
    else this.#document.body.requestFullscreen();
  }

  elFromID(id) {
    return this.#document.getElementById(id);
  }

  elsFromClass(cls) {
    return this.#document.getElementsByClassName(cls);
  }

  elsFromName(name) {
    return this.#document.getElementsByName(name);
  }

  elsFromTag(name) {
    return this.#document.getElementsByTagName(name);
  }

  elsFromTagNS(name) {
    return this.#document.getElementsByTagNameNS(name);
  }

  get title() {
    return this.#document.title;
  }

  set title(v) {
    if(typeof v !== "string") throw new TypeError(`Type '${typeof v}' on parameter 'v' must be of type 'string'!`);
    this.#document.title = v;
  }
}

// UNFINISHED
export let MDToHTML = md => {
  let html = "<html>\n\t<head>\n\t\t\n\t</head>\n\t<body>\n\t\t";
  let add = x => {
    html += x + "\n\t\t";
  }
  for(let line of md.split(/(\r?\n)*/)) {
    if(line.startsWith("### ")) 
      add(`<h3>\n\t\t\t${line.split("### ").slice(1).join("### ").replace(/(\r?\n)*/, "\n\t\t\t")}\n\t\t</h3>`);
    else if(line.startsWith("## "))
      add(`<h2>\n\t\t\t${line.split("### ").slice(1).join("### ").replace(/(\r?\n)*/, "\n\t\t\t")}\n\t\t</h2>`);
    else if(line.startsWith("# "))
      add(`<h1>\n\t\t\t${line.split("### ").slice(1).join("### ").replace(/(\r?\n)*/, "\n\t\t\t")}\n\t\t</h1>`);
  }
}
