const pagefind_version = "1.4.0";
let wasm_bindgen;
(function () {
  const __exports = {};
  let script_src;
  if (typeof document !== "undefined" && document.currentScript !== null) {
    script_src = new URL("UNHANDLED", location.href).toString();
  }
  let wasm = undefined;
  let WASM_VECTOR_LEN = 0;
  let cachedUint8Memory0 = null;
  function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
      cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
  }
  const cachedTextEncoder =
    typeof TextEncoder !== "undefined"
      ? new TextEncoder("utf-8")
      : {
          encode: () => {
            throw Error("TextEncoder not available");
          },
        };
  const encodeString =
    typeof cachedTextEncoder.encodeInto === "function"
      ? function (arg, view) {
          return cachedTextEncoder.encodeInto(arg, view);
        }
      : function (arg, view) {
          const buf = cachedTextEncoder.encode(arg);
          view.set(buf);
          return { read: arg.length, written: buf.length };
        };
  function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
      const buf = cachedTextEncoder.encode(arg);
      const ptr = malloc(buf.length, 1) >>> 0;
      getUint8Memory0()
        .subarray(ptr, ptr + buf.length)
        .set(buf);
      WASM_VECTOR_LEN = buf.length;
      return ptr;
    }
    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;
    const mem = getUint8Memory0();
    let offset = 0;
    for (; offset < len; offset++) {
      const code = arg.charCodeAt(offset);
      if (code > 0x7f) break;
      mem[ptr + offset] = code;
    }
    if (offset !== len) {
      if (offset !== 0) {
        arg = arg.slice(offset);
      }
      ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0;
      const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
      const ret = encodeString(arg, view);
      offset += ret.written;
      ptr = realloc(ptr, len, offset, 1) >>> 0;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
  }
  __exports.set_ranking_weights = function (ptr, weights) {
    const ptr0 = passStringToWasm0(
      weights,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.set_ranking_weights(ptr, ptr0, len0);
    return ret >>> 0;
  };
  function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
  }
  __exports.init_pagefind = function (metadata_bytes) {
    const ptr0 = passArray8ToWasm0(metadata_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.init_pagefind(ptr0, len0);
    return ret >>> 0;
  };
  __exports.load_filter_chunk = function (ptr, chunk_bytes) {
    const ptr0 = passArray8ToWasm0(chunk_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.load_filter_chunk(ptr, ptr0, len0);
    return ret >>> 0;
  };
  let cachedInt32Memory0 = null;
  function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
      cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
  }
  const cachedTextDecoder =
    typeof TextDecoder !== "undefined"
      ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true })
      : {
          decode: () => {
            throw Error("TextDecoder not available");
          },
        };
  if (typeof TextDecoder !== "undefined") {
    cachedTextDecoder.decode();
  }
  function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
  }
  __exports.request_filter_indexes = function (ptr, filters) {
    let deferred2_0;
    let deferred2_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        filters,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.request_filter_indexes(retptr, ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred2_0 = r0;
      deferred2_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  };
  __exports.request_indexes = function (ptr, query) {
    let deferred2_0;
    let deferred2_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        query,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.request_indexes(retptr, ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred2_0 = r0;
      deferred2_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  };
  __exports.request_all_filter_indexes = function (ptr) {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.request_all_filter_indexes(retptr, ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  };
  __exports.filters = function (ptr) {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.filters(retptr, ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  };
  __exports.enter_playground_mode = function (ptr) {
    const ret = wasm.enter_playground_mode(ptr);
    return ret >>> 0;
  };
  __exports.search = function (ptr, query, filter, sort, exact) {
    let deferred4_0;
    let deferred4_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        query,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(
        filter,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len1 = WASM_VECTOR_LEN;
      const ptr2 = passStringToWasm0(
        sort,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len2 = WASM_VECTOR_LEN;
      wasm.search(retptr, ptr, ptr0, len0, ptr1, len1, ptr2, len2, exact);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred4_0 = r0;
      deferred4_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
  };
  __exports.add_synthetic_filter = function (ptr, filter) {
    const ptr0 = passStringToWasm0(
      filter,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.add_synthetic_filter(ptr, ptr0, len0);
    return ret >>> 0;
  };
  __exports.load_index_chunk = function (ptr, chunk_bytes) {
    const ptr0 = passArray8ToWasm0(chunk_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.load_index_chunk(ptr, ptr0, len0);
    return ret >>> 0;
  };
  async function __wbg_load(module, imports) {
    if (typeof Response === "function" && module instanceof Response) {
      if (typeof WebAssembly.instantiateStreaming === "function") {
        try {
          return await WebAssembly.instantiateStreaming(module, imports);
        } catch (e) {
          if (module.headers.get("Content-Type") != "application/wasm") {
            console.warn(
              "`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
              e
            );
          } else {
            throw e;
          }
        }
      }
      const bytes = await module.arrayBuffer();
      return await WebAssembly.instantiate(bytes, imports);
    } else {
      const instance = await WebAssembly.instantiate(module, imports);
      if (instance instanceof WebAssembly.Instance) {
        return { instance, module };
      } else {
        return instance;
      }
    }
  }
  function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    return imports;
  }
  function __wbg_init_memory(imports, maybe_memory) {}
  function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;
    return wasm;
  }
  function initSync(module) {
    if (wasm !== undefined) return wasm;
    const imports = __wbg_get_imports();
    __wbg_init_memory(imports);
    if (!(module instanceof WebAssembly.Module)) {
      module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
  }
  async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;
    if (typeof input === "undefined" && typeof script_src !== "undefined") {
      input = script_src.replace(/\.js$/, "_bg.wasm");
    }
    const imports = __wbg_get_imports();
    if (
      typeof input === "string" ||
      (typeof Request === "function" && input instanceof Request) ||
      (typeof URL === "function" && input instanceof URL)
    ) {
      input = fetch(input);
    }
    __wbg_init_memory(imports);
    const { instance, module } = await __wbg_load(await input, imports);
    return __wbg_finalize_init(instance, module);
  }
  wasm_bindgen = Object.assign(__wbg_init, { initSync }, __exports);
})();
var u8 = Uint8Array;
var u16 = Uint16Array;
var u32 = Uint32Array;
var fleb = new u8([
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5,
  5, 5, 0, 0, 0, 0,
]);
var fdeb = new u8([
  0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11,
  11, 12, 12, 13, 13, 0, 0,
]);
var clim = new u8([
  16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
]);
var freb = function (eb, start) {
  var b = new u16(31);
  for (var i2 = 0; i2 < 31; ++i2) {
    b[i2] = start += 1 << eb[i2 - 1];
  }
  var r = new u32(b[30]);
  for (var i2 = 1; i2 < 30; ++i2) {
    for (var j = b[i2]; j < b[i2 + 1]; ++j) {
      r[j] = ((j - b[i2]) << 5) | i2;
    }
  }
  return [b, r];
};
var _a = freb(fleb, 2);
var fl = _a[0];
var revfl = _a[1];
(fl[28] = 258), (revfl[258] = 28);
var _b = freb(fdeb, 0);
var fd = _b[0];
var revfd = _b[1];
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = ((i & 43690) >>> 1) | ((i & 21845) << 1);
  x = ((x & 52428) >>> 2) | ((x & 13107) << 2);
  x = ((x & 61680) >>> 4) | ((x & 3855) << 4);
  rev[i] = (((x & 65280) >>> 8) | ((x & 255) << 8)) >>> 1;
}
var x;
var i;
var hMap = function (cd, mb, r) {
  var s = cd.length;
  var i2 = 0;
  var l = new u16(mb);
  for (; i2 < s; ++i2) {
    if (cd[i2]) ++l[cd[i2] - 1];
  }
  var le = new u16(mb);
  for (i2 = 0; i2 < mb; ++i2) {
    le[i2] = (le[i2 - 1] + l[i2 - 1]) << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        var sv = (i2 << 4) | cd[i2];
        var r_1 = mb - cd[i2];
        var v = le[cd[i2] - 1]++ << r_1;
        for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
          co[rev[v] >>> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        co[i2] = rev[le[cd[i2] - 1]++] >>> (15 - cd[i2]);
      }
    }
  }
  return co;
};
var flt = new u8(288);
for (i = 0; i < 144; ++i) flt[i] = 8;
var i;
for (i = 144; i < 256; ++i) flt[i] = 9;
var i;
for (i = 256; i < 280; ++i) flt[i] = 7;
var i;
for (i = 280; i < 288; ++i) flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i) fdt[i] = 5;
var i;
var flrm = hMap(flt, 9, 1);
var fdrm = hMap(fdt, 5, 1);
var max = function (a) {
  var m = a[0];
  for (var i2 = 1; i2 < a.length; ++i2) {
    if (a[i2] > m) m = a[i2];
  }
  return m;
};
var bits = function (d, p, m) {
  var o = (p / 8) | 0;
  return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m;
};
var bits16 = function (d, p) {
  var o = (p / 8) | 0;
  return (d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7);
};
var shft = function (p) {
  return ((p + 7) / 8) | 0;
};
var slc = function (v, s, e) {
  if (s == null || s < 0) s = 0;
  if (e == null || e > v.length) e = v.length;
  var n = new (
    v.BYTES_PER_ELEMENT == 2 ? u16 : v.BYTES_PER_ELEMENT == 4 ? u32 : u8
  )(e - s);
  n.set(v.subarray(s, e));
  return n;
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data",
];
var err = function (ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace) Error.captureStackTrace(e, err);
  if (!nt) throw e;
  return e;
};
var inflt = function (dat, buf, st) {
  var sl = dat.length;
  if (!sl || (st && st.f && !st.l)) return buf || new u8(0);
  var noBuf = !buf || st;
  var noSt = !st || st.i;
  if (!st) st = {};
  if (!buf) buf = new u8(sl * 3);
  var cbuf = function (l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0,
    pos = st.p || 0,
    bt = st.b || 0,
    lm = st.l,
    dm = st.d,
    lbt = st.m,
    dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4,
          l = dat[s - 4] | (dat[s - 3] << 8),
          t = s + l;
        if (t > sl) {
          if (noSt) err(0);
          break;
        }
        if (noBuf) cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        (st.b = bt += l), (st.p = pos = t * 8), (st.f = final);
        continue;
      } else if (type == 1) (lm = flrm), (dm = fdrm), (lbt = 9), (dbt = 5);
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257,
          hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i2 = 0; i2 < hcLen; ++i2) {
          clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt),
          clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i2 = 0; i2 < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >>> 4;
          if (s < 16) {
            ldt[i2++] = s;
          } else {
            var c = 0,
              n = 0;
            if (s == 16)
              (n = 3 + bits(dat, pos, 3)), (pos += 2), (c = ldt[i2 - 1]);
            else if (s == 17) (n = 3 + bits(dat, pos, 7)), (pos += 3);
            else if (s == 18) (n = 11 + bits(dat, pos, 127)), (pos += 7);
            while (n--) ldt[i2++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit),
          dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else err(1);
      if (pos > tbts) {
        if (noSt) err(0);
        break;
      }
    }
    if (noBuf) cbuf(bt + 131072);
    var lms = (1 << lbt) - 1,
      dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms],
        sym = c >>> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt) err(0);
        break;
      }
      if (!c) err(2);
      if (sym < 256) buf[bt++] = sym;
      else if (sym == 256) {
        (lpos = pos), (lm = null);
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i2 = sym - 257,
            b = fleb[i2];
          add = bits(dat, pos, (1 << b) - 1) + fl[i2];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms],
          dsym = d >>> 4;
        if (!d) err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          (dt += bits16(dat, pos) & ((1 << b) - 1)), (pos += b);
        }
        if (pos > tbts) {
          if (noSt) err(0);
          break;
        }
        if (noBuf) cbuf(bt + 131072);
        var end = bt + add;
        for (; bt < end; bt += 4) {
          buf[bt] = buf[bt - dt];
          buf[bt + 1] = buf[bt + 1 - dt];
          buf[bt + 2] = buf[bt + 2 - dt];
          buf[bt + 3] = buf[bt + 3 - dt];
        }
        bt = end;
      }
    }
    (st.l = lm), (st.p = lpos), (st.b = bt), (st.f = final);
    if (lm) (final = 1), (st.m = lbt), (st.d = dm), (st.n = dbt);
  } while (!final);
  return bt == buf.length ? buf : slc(buf, 0, bt);
};
var et = new u8(0);
var gzs = function (d) {
  if (d[0] != 31 || d[1] != 139 || d[2] != 8) err(6, "invalid gzip data");
  var flg = d[3];
  var st = 10;
  if (flg & 4) st += d[10] | ((d[11] << 8) + 2);
  for (var zs = ((flg >> 3) & 1) + ((flg >> 4) & 1); zs > 0; zs -= !d[st++]);
  return st + (flg & 2);
};
var gzl = function (d) {
  var l = d.length;
  return (
    (d[l - 4] | (d[l - 3] << 8) | (d[l - 2] << 16) | (d[l - 1] << 24)) >>> 0
  );
};
function gunzipSync(data, out) {
  return inflt(data.subarray(gzs(data), -8), out || new u8(gzl(data)));
}
var td = typeof TextDecoder != "undefined" && new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {}
var gz_default = gunzipSync;
var calculate_excerpt_region = (word_positions, excerpt_length) => {
  if (word_positions.length === 0) {
    return 0;
  }
  let words = [];
  for (const word of word_positions) {
    words[word.location] = words[word.location] || 0;
    words[word.location] += word.balanced_score;
  }
  if (words.length <= excerpt_length) {
    return 0;
  }
  let densest = words
    .slice(0, excerpt_length)
    .reduce((partialSum, a) => partialSum + a, 0);
  let working_sum = densest;
  let densest_at = [0];
  for (let i2 = 0; i2 < words.length; i2++) {
    const boundary = i2 + excerpt_length;
    working_sum += (words[boundary] ?? 0) - (words[i2] ?? 0);
    if (working_sum > densest) {
      densest = working_sum;
      densest_at = [i2];
    } else if (
      working_sum === densest &&
      densest_at[densest_at.length - 1] === i2 - 1
    ) {
      densest_at.push(i2);
    }
  }
  let midpoint = densest_at[Math.floor(densest_at.length / 2)];
  return midpoint;
};
var build_excerpt = (
  content,
  start,
  length,
  locations,
  not_before,
  not_from
) => {
  let is_zws_delimited = content.includes("\u200B");
  let fragment_words = [];
  if (is_zws_delimited) {
    fragment_words = content.split("\u200B");
  } else {
    fragment_words = content.split(/[\r\n\s]+/g);
  }
  for (let word of locations) {
    if (fragment_words[word]?.startsWith(`<mark>`)) {
      continue;
    }
    fragment_words[word] = `<mark>${fragment_words[word]}</mark>`;
  }
  let endcap = not_from ?? fragment_words.length;
  let startcap = not_before ?? 0;
  if (endcap - startcap < length) {
    length = endcap - startcap;
  }
  if (start + length > endcap) {
    start = endcap - length;
  }
  if (start < startcap) {
    start = startcap;
  }
  return fragment_words
    .slice(start, start + length)
    .join(is_zws_delimited ? "" : " ")
    .trim();
};
var calculate_sub_results = (fragment, desired_excerpt_length) => {
  const anchors = fragment.anchors
    .filter(
      (a) => /h\d/i.test(a.element) && a.text?.length && /\S/.test(a.text)
    )
    .sort((a, b) => a.location - b.location);
  const results = [];
  let current_anchor_position = 0;
  let current_anchor = {
    title: fragment.meta["title"],
    url: fragment.url,
    weighted_locations: [],
    locations: [],
    excerpt: "",
  };
  const add_result = (end_range) => {
    if (current_anchor.locations.length) {
      const relative_weighted_locations = current_anchor.weighted_locations.map(
        (l) => {
          return {
            weight: l.weight,
            balanced_score: l.balanced_score,
            location: l.location - current_anchor_position,
          };
        }
      );
      const excerpt_start =
        calculate_excerpt_region(
          relative_weighted_locations,
          desired_excerpt_length
        ) + current_anchor_position;
      const excerpt_length = end_range
        ? Math.min(end_range - excerpt_start, desired_excerpt_length)
        : desired_excerpt_length;
      current_anchor.excerpt = build_excerpt(
        fragment.raw_content ?? "",
        excerpt_start,
        excerpt_length,
        current_anchor.locations,
        current_anchor_position,
        end_range
      );
      results.push(current_anchor);
    }
  };
  for (let word of fragment.weighted_locations) {
    if (!anchors.length || word.location < anchors[0].location) {
      current_anchor.weighted_locations.push(word);
      current_anchor.locations.push(word.location);
    } else {
      let next_anchor = anchors.shift();
      add_result(next_anchor.location);
      while (anchors.length && word.location >= anchors[0].location) {
        next_anchor = anchors.shift();
      }
      let anchored_url = fragment.url;
      try {
        const url_is_fq = /^((https?:)?\/\/)/.test(anchored_url);
        if (url_is_fq) {
          let fq_url = new URL(anchored_url);
          fq_url.hash = next_anchor.id;
          anchored_url = fq_url.toString();
        } else {
          if (!/^\//.test(anchored_url)) {
            anchored_url = `/${anchored_url}`;
          }
          let fq_url = new URL(`https://example.com${anchored_url}`);
          fq_url.hash = next_anchor.id;
          anchored_url = fq_url
            .toString()
            .replace(/^https:\/\/example.com/, "");
        }
      } catch (e) {
        console.error(
          `Pagefind: Couldn't process ${anchored_url} for a search result`
        );
      }
      current_anchor_position = next_anchor.location;
      current_anchor = {
        title: next_anchor.text,
        url: anchored_url,
        anchor: next_anchor,
        weighted_locations: [word],
        locations: [word.location],
        excerpt: "",
      };
    }
  }
  add_result(anchors[0]?.location);
  return results;
};
var asyncSleep = async (ms = 100) => {
  return new Promise((r) => setTimeout(r, ms));
};
var isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";
var PagefindInstance = class {
  constructor(opts = {}) {
    this.version = pagefind_version;
    this.backend = wasm_bindgen;
    this.decoder = new TextDecoder("utf-8");
    this.wasm = null;
    this.basePath = opts.basePath || "/pagefind/";
    this.primary = opts.primary || false;
    if (this.primary && !opts.basePath) {
      this.initPrimary();
    }
    if (/[^\/]$/.test(this.basePath)) {
      this.basePath = `${this.basePath}/`;
    }
    if (
      isBrowser &&
      window?.location?.origin &&
      this.basePath.startsWith(window.location.origin)
    ) {
      this.basePath = this.basePath.replace(window.location.origin, "");
    }
    this.baseUrl = opts.baseUrl || this.defaultBaseUrl();
    if (!/^(\/|https?:\/\/)/.test(this.baseUrl)) {
      this.baseUrl = `/${this.baseUrl}`;
    }
    this.indexWeight = opts.indexWeight ?? 1;
    this.excerptLength = opts.excerptLength ?? 30;
    this.mergeFilter = opts.mergeFilter ?? {};
    this.ranking = opts.ranking;
    this.highlightParam = opts.highlightParam ?? null;
    this.loaded_chunks = {};
    this.loaded_filters = {};
    this.loaded_fragments = {};
    this.raw_ptr = null;
    this.searchMeta = null;
    this.languages = null;
  }
  initPrimary() {
    if (isBrowser && typeof import.meta.url !== "undefined") {
      let derivedBasePath = import.meta.url.match(/^(.*\/)pagefind.js.*$/)?.[1];
      if (derivedBasePath) {
        this.basePath = derivedBasePath;
      } else {
        console.warn(
          [
            "Pagefind couldn't determine the base of the bundle from the import path. Falling back to the default.",
            "Set a basePath option when initialising Pagefind to ignore this message.",
          ].join("\n")
        );
      }
    }
  }
  defaultBaseUrl() {
    let default_base = this.basePath.match(/^(.*\/)_?pagefind/)?.[1];
    return default_base || "/";
  }
  async options(options2) {
    const opts = [
      "basePath",
      "baseUrl",
      "indexWeight",
      "excerptLength",
      "mergeFilter",
      "highlightParam",
      "ranking",
    ];
    for (const [k, v] of Object.entries(options2)) {
      if (k === "mergeFilter") {
        let filters2 = this.stringifyFilters(v);
        let ptr = await this.getPtr();
        this.raw_ptr = this.backend.add_synthetic_filter(ptr, filters2);
      } else if (k === "ranking") {
        await this.set_ranking(options2.ranking);
      } else if (opts.includes(k)) {
        if (k === "basePath" && typeof v === "string") this.basePath = v;
        if (k === "baseUrl" && typeof v === "string") this.baseUrl = v;
        if (k === "indexWeight" && typeof v === "number") this.indexWeight = v;
        if (k === "excerptLength" && typeof v === "number")
          this.excerptLength = v;
        if (k === "mergeFilter" && typeof v === "object") this.mergeFilter = v;
        if (k === "highlightParam" && typeof v === "string")
          this.highlightParam = v;
      } else {
        console.warn(
          `Unknown Pagefind option ${k}. Allowed options: [${opts.join(", ")}]`
        );
      }
    }
  }
  async enterPlaygroundMode() {
    let ptr = await this.getPtr();
    this.raw_ptr = this.backend.enter_playground_mode(ptr);
  }
  decompress(data, file = "unknown file") {
    if (this.decoder.decode(data.slice(0, 12)) === "pagefind_dcd") {
      return data.slice(12);
    }
    data = gz_default(data);
    if (this.decoder.decode(data.slice(0, 12)) !== "pagefind_dcd") {
      console.error(
        `Decompressing ${file} appears to have failed: Missing signature`
      );
      return data;
    }
    return data.slice(12);
  }
  async set_ranking(ranking) {
    if (!ranking) return;
    let rankingWeights = {
      term_similarity: ranking.termSimilarity ?? null,
      page_length: ranking.pageLength ?? null,
      term_saturation: ranking.termSaturation ?? null,
      term_frequency: ranking.termFrequency ?? null,
    };
    let ptr = await this.getPtr();
    this.raw_ptr = this.backend.set_ranking_weights(
      ptr,
      JSON.stringify(rankingWeights)
    );
  }
  async init(language, opts) {
    await this.loadEntry();
    let index = this.findIndex(language);
    let lang_wasm = index.wasm ? index.wasm : "unknown";
    this.loadedLanguage = language;
    let resources = [this.loadMeta(index.hash)];
    if (opts.load_wasm === true) {
      resources.push(this.loadWasm(lang_wasm));
    }
    await Promise.all(resources);
    this.raw_ptr = this.backend.init_pagefind(new Uint8Array(this.searchMeta));
    if (Object.keys(this.mergeFilter)?.length) {
      let filters2 = this.stringifyFilters(this.mergeFilter);
      let ptr = await this.getPtr();
      this.raw_ptr = this.backend.add_synthetic_filter(ptr, filters2);
    }
    if (this.ranking) {
      await this.set_ranking(this.ranking);
    }
  }
  async loadEntry() {
    try {
      let entry_response = await fetch(
        `${this.basePath}pagefind-entry.json?ts=${Date.now()}`
      );
      let entry_json = await entry_response.json();
      this.languages = entry_json.languages;
      this.loadedVersion = entry_json.version;
      this.includeCharacters = entry_json.include_characters ?? [];
      if (entry_json.version !== this.version) {
        if (this.primary) {
          console.warn(
            [
              "Pagefind JS version doesn't match the version in your search index.",
              `Pagefind JS: ${this.version}. Pagefind index: ${entry_json.version}`,
              "If you upgraded Pagefind recently, you likely have a cached pagefind.js file.",
              "If you encounter any search errors, try clearing your cache.",
            ].join("\n")
          );
        } else {
          console.warn(
            [
              "Merging a Pagefind index from a different version than the main Pagefind instance.",
              `Main Pagefind JS: ${this.version}. Merged index (${this.basePath}): ${entry_json.version}`,
              "If you encounter any search errors, make sure that both sites are running the same version of Pagefind.",
            ].join("\n")
          );
        }
      }
    } catch (e) {
      console.error(`Failed to load Pagefind metadata:
${e?.toString()}`);
      throw new Error("Failed to load Pagefind metadata");
    }
  }
  findIndex(language) {
    if (this.languages) {
      let index = this.languages[language];
      if (index) return index;
      index = this.languages[language.split("-")[0]];
      if (index) return index;
      let topLang = Object.values(this.languages).sort(
        (a, b) => b.page_count - a.page_count
      );
      if (topLang[0]) return topLang[0];
    }
    throw new Error("Pagefind Error: No language indexes found.");
  }
  async loadMeta(index) {
    try {
      let compressed_resp = await fetch(
        `${this.basePath}pagefind.${index}.pf_meta`
      );
      let compressed_meta = await compressed_resp.arrayBuffer();
      this.searchMeta = this.decompress(
        new Uint8Array(compressed_meta),
        "Pagefind metadata"
      );
    } catch (e) {
      console.error(`Failed to load the meta index:
${e?.toString()}`);
    }
  }
  async loadWasm(language) {
    try {
      const wasm_url = `${this.basePath}wasm.${language}.pagefind`;
      let compressed_resp = await fetch(wasm_url);
      let compressed_wasm = await compressed_resp.arrayBuffer();
      const final_wasm = this.decompress(
        new Uint8Array(compressed_wasm),
        "Pagefind WebAssembly"
      );
      if (!final_wasm) {
        throw new Error("No WASM after decompression");
      }
      this.wasm = await this.backend(final_wasm);
    } catch (e) {
      console.error(`Failed to load the Pagefind WASM:
${e?.toString()}`);
      throw new Error(`Failed to load the Pagefind WASM:
${e?.toString()}`);
    }
  }
  async _loadGenericChunk(url, method) {
    try {
      let compressed_resp = await fetch(url);
      let compressed_chunk = await compressed_resp.arrayBuffer();
      let chunk = this.decompress(new Uint8Array(compressed_chunk), url);
      let ptr = await this.getPtr();
      this.raw_ptr = this.backend[method](ptr, chunk);
    } catch (e) {
      console.error(`Failed to load the index chunk ${url}:
${e?.toString()}`);
    }
  }
  async loadChunk(hash) {
    if (!this.loaded_chunks[hash]) {
      const url = `${this.basePath}index/${hash}.pf_index`;
      this.loaded_chunks[hash] = this._loadGenericChunk(
        url,
        "load_index_chunk"
      );
    }
    return await this.loaded_chunks[hash];
  }
  async loadFilterChunk(hash) {
    if (!this.loaded_filters[hash]) {
      const url = `${this.basePath}filter/${hash}.pf_filter`;
      this.loaded_filters[hash] = this._loadGenericChunk(
        url,
        "load_filter_chunk"
      );
    }
    return await this.loaded_filters[hash];
  }
  async _loadFragment(hash) {
    let compressed_resp = await fetch(
      `${this.basePath}fragment/${hash}.pf_fragment`
    );
    let compressed_fragment = await compressed_resp.arrayBuffer();
    let fragment = this.decompress(
      new Uint8Array(compressed_fragment),
      `Fragment ${hash}`
    );
    return JSON.parse(new TextDecoder().decode(fragment));
  }
  async loadFragment(hash, weighted_locations = [], search_term) {
    if (!this.loaded_fragments[hash]) {
      this.loaded_fragments[hash] = this._loadFragment(hash);
    }
    let fragment = await this.loaded_fragments[hash];
    fragment.weighted_locations = weighted_locations;
    fragment.locations = weighted_locations.map((l) => l.location);
    if (!fragment.raw_content) {
      fragment.raw_content = fragment.content
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      fragment.content = fragment.content.replace(/\u200B/g, "");
    }
    if (!fragment.raw_url) {
      fragment.raw_url = fragment.url;
    }
    fragment.url = this.processedUrl(fragment.raw_url, search_term);
    const excerpt_start = calculate_excerpt_region(
      weighted_locations,
      this.excerptLength
    );
    fragment.excerpt = build_excerpt(
      fragment.raw_content,
      excerpt_start,
      this.excerptLength,
      fragment.locations
    );
    fragment.sub_results = calculate_sub_results(fragment, this.excerptLength);
    return fragment;
  }
  fullUrl(raw) {
    if (/^(https?:)?\/\//.test(raw)) {
      return raw;
    }
    return `${this.baseUrl}/${raw}`
      .replace(/\/+/g, "/")
      .replace(/^(https?:\/)/, "$1/");
  }
  processedUrl(url, search_term) {
    const normalized = this.fullUrl(url);
    if (this.highlightParam === null) {
      return normalized;
    }
    let individual_terms = search_term.split(/\s+/);
    try {
      let processed = new URL(normalized);
      for (const term of individual_terms) {
        processed.searchParams.append(this.highlightParam, term);
      }
      return processed.toString();
    } catch (e) {
      try {
        let processed = new URL(`https://example.com${normalized}`);
        for (const term of individual_terms) {
          processed.searchParams.append(this.highlightParam, term);
        }
        return processed.toString().replace(/^https:\/\/example\.com/, "");
      } catch (e2) {
        return normalized;
      }
    }
  }
  async getPtr() {
    while (this.raw_ptr === null) {
      await asyncSleep(50);
    }
    if (!this.raw_ptr) {
      console.error("Pagefind: WASM Error (No pointer)");
      throw new Error("Pagefind: WASM Error (No pointer)");
    }
    return this.raw_ptr;
  }
  stringifyFilters(obj = {}) {
    return JSON.stringify(obj);
  }
  stringifySorts(obj = {}) {
    let sorts = Object.entries(obj);
    for (let [sort, direction] of sorts) {
      if (sorts.length > 1) {
        console.warn(
          `Pagefind was provided multiple sort options in this search, but can only operate on one. Using the ${sort} sort.`
        );
      }
      if (direction !== "asc" && direction !== "desc") {
        console.warn(
          `Pagefind was provided a sort with unknown direction ${direction}. Supported: [asc, desc]`
        );
      }
      return `${sort}:${direction}`;
    }
    return ``;
  }
  async filters() {
    let ptr = await this.getPtr();
    let filters2 = this.backend.request_all_filter_indexes(ptr);
    let filter_array = JSON.parse(filters2);
    if (Array.isArray(filter_array)) {
      let filter_chunks = filter_array
        .filter((v) => v)
        .map((chunk) => this.loadFilterChunk(chunk));
      await Promise.all([...filter_chunks]);
    }
    ptr = await this.getPtr();
    let results = this.backend.filters(ptr);
    return JSON.parse(results);
  }
  async preload(term, options2 = {}) {
    await this.search(term, { ...options2, preload: true });
  }
  async search(term, options2 = {}) {
    options2 = { verbose: false, filters: {}, sort: {}, ...options2 };
    const log = (str) => {
      if (options2.verbose) console.log(str);
    };
    log(`Starting search on ${this.basePath}`);
    let start = Date.now();
    let ptr = await this.getPtr();
    let filter_only = term === null;
    term = term ?? "";
    let exact_search = /^\s*".+"\s*$/.test(term);
    if (exact_search) {
      log(`Running an exact search`);
    }
    let trueLanguage = null;
    try {
      trueLanguage = Intl.getCanonicalLocales(this.loadedLanguage)[0];
    } catch (err2) {}
    const term_chunks = [];
    let segments;
    if (trueLanguage && typeof Intl.Segmenter !== "undefined") {
      const segmenter = new Intl.Segmenter(trueLanguage, {
        granularity: "grapheme",
      });
      segments = [...segmenter.segment(term)].map(({ segment }) => segment);
    } else {
      segments = [...term];
    }
    for (const segment of segments) {
      if (this.includeCharacters?.includes(segment)) {
        term_chunks.push(segment);
      } else if (
        !/^\p{Pd}|\p{Pe}|\p{Pf}|\p{Pi}|\p{Po}|\p{Ps}$/u.test(segment)
      ) {
        term_chunks.push(segment.toLocaleLowerCase());
      }
    }
    term = term_chunks
      .join("")
      .replace(/\s{2,}/g, " ")
      .trim();
    log(`Normalized search term to ${term}`);
    if (!term?.length && !filter_only) {
      return {
        results: [],
        unfilteredResultCount: 0,
        filters: {},
        totalFilters: {},
        timings: {
          preload: Date.now() - start,
          search: Date.now() - start,
          total: Date.now() - start,
        },
      };
    }
    let sort_list = this.stringifySorts(options2.sort);
    log(`Stringified sort to ${sort_list}`);
    const filter_list = this.stringifyFilters(options2.filters);
    log(`Stringified filters to ${filter_list}`);
    let index_resp = this.backend.request_indexes(ptr, term);
    let index_array = JSON.parse(index_resp);
    let filter_resp = this.backend.request_filter_indexes(ptr, filter_list);
    let filter_array = JSON.parse(filter_resp);
    let chunks = index_array
      .filter((v) => v)
      .map((chunk) => this.loadChunk(chunk));
    let filter_chunks = filter_array
      .filter((v) => v)
      .map((chunk) => this.loadFilterChunk(chunk));
    await Promise.all([...chunks, ...filter_chunks]);
    log(`Loaded necessary chunks to run search`);
    if (options2.preload) {
      log(`Preload \u2014 bailing out of search operation now.`);
      return null;
    }
    ptr = await this.getPtr();
    let searchStart = Date.now();
    let result = this.backend.search(
      ptr,
      term,
      filter_list,
      sort_list,
      exact_search
    );
    log(`Got the raw search result: ${result}`);
    let {
      filtered_counts,
      total_counts,
      results,
      unfiltered_total,
      search_keywords,
    } = JSON.parse(result);
    let resultsInterface = results.map((result2) => {
      let weighted_locations = result2.l.map((l) => {
        let loc = { weight: l.w / 24, balanced_score: l.s, location: l.l };
        if (l.v) {
          loc.verbose = { word_string: l.v.ws, length_bonus: l.v.lb };
        }
        return loc;
      });
      let locations = weighted_locations.map((l) => l.location);
      let res = {
        id: result2.p,
        score: result2.s * this.indexWeight,
        words: locations,
        data: async () =>
          await this.loadFragment(result2.p, weighted_locations, term),
      };
      if (result2.params) {
        res.params = {
          document_length: result2.params.dl,
          average_page_length: result2.params.apl,
          total_pages: result2.params.tp,
        };
      }
      if (result2.scores) {
        res.scores = result2.scores.map((r) => {
          return {
            search_term: r.w,
            idf: r.idf,
            saturating_tf: r.b_tf,
            raw_tf: r.r_tf,
            pagefind_tf: r.p_tf,
            score: r.s,
            params: {
              weighted_term_frequency: r.params.w_tf,
              pages_containing_term: r.params.pct,
              length_bonus: r.params.lb,
            },
          };
        });
      }
      return res;
    });
    const searchTime = Date.now() - searchStart;
    const realTime = Date.now() - start;
    log(
      `Found ${results.length} result${
        results.length == 1 ? "" : "s"
      } for "${term}" in ${Date.now() - searchStart}ms (${
        Date.now() - start
      }ms realtime)`
    );
    let response = {
      results: resultsInterface,
      unfilteredResultCount: unfiltered_total,
      filters: filtered_counts,
      totalFilters: total_counts,
      timings: {
        preload: realTime - searchTime,
        search: searchTime,
        total: realTime,
      },
    };
    if (search_keywords) {
      response.search_keywords = search_keywords;
    }
    return response;
  }
};
var Pagefind = class {
  constructor(options2 = {}) {
    this.backend = wasm_bindgen;
    this.primaryLanguage = "unknown";
    this.searchID = 0;
    this.primary = new PagefindInstance({ ...options2, primary: true });
    this.instances = [this.primary];
    this.init(options2?.language);
  }
  async options(options2) {
    await this.primary.options(options2);
  }
  async enterPlaygroundMode() {
    await this.primary.enterPlaygroundMode();
  }
  async init(overrideLanguage) {
    if (isBrowser && document?.querySelector) {
      const langCode =
        document.querySelector("html")?.getAttribute("lang") || "unknown";
      this.primaryLanguage = langCode.toLocaleLowerCase();
    }
    await this.primary.init(
      overrideLanguage ? overrideLanguage : this.primaryLanguage,
      { load_wasm: true }
    );
  }
  async mergeIndex(indexPath, options2 = {}) {
    if (this.primary.basePath.startsWith(indexPath)) {
      console.warn(
        `Skipping mergeIndex ${indexPath} that appears to be the same as the primary index (${this.primary.basePath})`
      );
      return;
    }
    let newInstance = new PagefindInstance({
      primary: false,
      basePath: indexPath,
    });
    this.instances.push(newInstance);
    while (this.primary.wasm === null) {
      await asyncSleep(50);
    }
    await newInstance.init(options2.language || this.primaryLanguage, {
      load_wasm: false,
    });
    delete options2["language"];
    await newInstance.options(options2);
  }
  mergeFilters(filters2) {
    const merged = {};
    for (const searchFilter of filters2) {
      for (const [filterKey, values] of Object.entries(searchFilter)) {
        if (!merged[filterKey]) {
          merged[filterKey] = values;
          continue;
        } else {
          const filter = merged[filterKey];
          for (const [valueKey, count] of Object.entries(values)) {
            filter[valueKey] = (filter[valueKey] || 0) + count;
          }
        }
      }
    }
    return merged;
  }
  async filters() {
    let filters2 = await Promise.all(this.instances.map((i2) => i2.filters()));
    return this.mergeFilters(filters2);
  }
  async preload(term, options2 = {}) {
    await Promise.all(this.instances.map((i2) => i2.preload(term, options2)));
  }
  async debouncedSearch(term, options2, debounceTimeoutMs) {
    const thisSearchID = ++this.searchID;
    this.preload(term, options2);
    await asyncSleep(debounceTimeoutMs);
    if (thisSearchID !== this.searchID) {
      return null;
    }
    const searchResult = await this.search(term, options2);
    if (thisSearchID !== this.searchID) {
      return null;
    }
    return searchResult;
  }
  async search(term, options2 = {}) {
    let search2 = await Promise.all(
      this.instances.map((i2) => i2.search(term, options2))
    );
    const filters2 = this.mergeFilters(search2.map((s) => s.filters));
    const totalFilters = this.mergeFilters(search2.map((s) => s.totalFilters));
    const results = search2
      .map((s) => s.results)
      .flat()
      .sort((a, b) => b.score - a.score);
    const timings = search2.map((s) => s.timings);
    const unfilteredResultCount = search2.reduce(
      (sum, s) => sum + s.unfilteredResultCount,
      0
    );
    let response = {
      results,
      unfilteredResultCount,
      filters: filters2,
      totalFilters,
      timings,
    };
    if (search2[0].search_keywords) {
      response.search_keywords = search2[0].search_keywords;
    }
    return response;
  }
};
var pagefind = void 0;
var initial_options = void 0;
var init_pagefind = () => {
  if (!pagefind) {
    pagefind = new Pagefind(initial_options ?? {});
  }
};
var options = async (new_options) => {
  if (pagefind) {
    await pagefind.options(new_options);
  } else {
    initial_options = new_options;
  }
};
var init = async () => {
  init_pagefind();
};
var destroy = async () => {
  pagefind = void 0;
  initial_options = void 0;
};
var mergeIndex = async (indexPath, options2) => {
  init_pagefind();
  return await pagefind.mergeIndex(indexPath, options2);
};
var search = async (term, options2) => {
  init_pagefind();
  return await pagefind.search(term, options2);
};
var debouncedSearch = async (term, options2, debounceTimeoutMs = 300) => {
  init_pagefind();
  return await pagefind.debouncedSearch(term, options2, debounceTimeoutMs);
};
var preload = async (term, options2) => {
  init_pagefind();
  return await pagefind.preload(term, options2);
};
var filters = async () => {
  init_pagefind();
  return await pagefind.filters();
};
export {
  debouncedSearch,
  destroy,
  filters,
  init,
  mergeIndex,
  options,
  preload,
  search,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VmaW5kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHBhZ2VmaW5kX3ZlcnNpb249XCIxLjQuMFwiO2xldCB3YXNtX2JpbmRnZW47KGZ1bmN0aW9uKCl7Y29uc3QgX19leHBvcnRzPXt9O2xldCBzY3JpcHRfc3JjO2lmKHR5cGVvZiBkb2N1bWVudCE9PSd1bmRlZmluZWQnJiZkb2N1bWVudC5jdXJyZW50U2NyaXB0IT09bnVsbCl7c2NyaXB0X3NyYz1uZXcgVVJMKFwiVU5IQU5ETEVEXCIsbG9jYXRpb24uaHJlZikudG9TdHJpbmcoKX1sZXQgd2FzbT11bmRlZmluZWQ7bGV0IFdBU01fVkVDVE9SX0xFTj0wO2xldCBjYWNoZWRVaW50OE1lbW9yeTA9bnVsbDtmdW5jdGlvbiBnZXRVaW50OE1lbW9yeTAoKXtpZihjYWNoZWRVaW50OE1lbW9yeTA9PT1udWxsfHxjYWNoZWRVaW50OE1lbW9yeTAuYnl0ZUxlbmd0aD09PTApe2NhY2hlZFVpbnQ4TWVtb3J5MD1uZXcgVWludDhBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpfXJldHVybiBjYWNoZWRVaW50OE1lbW9yeTB9Y29uc3QgY2FjaGVkVGV4dEVuY29kZXI9KHR5cGVvZiBUZXh0RW5jb2RlciE9PSd1bmRlZmluZWQnP25ldyBUZXh0RW5jb2RlcigndXRmLTgnKTp7ZW5jb2RlOigpPT57dGhyb3cgRXJyb3IoJ1RleHRFbmNvZGVyIG5vdCBhdmFpbGFibGUnKX19KTtjb25zdCBlbmNvZGVTdHJpbmc9KHR5cGVvZiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvPT09J2Z1bmN0aW9uJz9mdW5jdGlvbihhcmcsdmlldyl7cmV0dXJuIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8oYXJnLHZpZXcpfTpmdW5jdGlvbihhcmcsdmlldyl7Y29uc3QgYnVmPWNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO3ZpZXcuc2V0KGJ1Zik7cmV0dXJue3JlYWQ6YXJnLmxlbmd0aCx3cml0dGVuOmJ1Zi5sZW5ndGh9fSk7ZnVuY3Rpb24gcGFzc1N0cmluZ1RvV2FzbTAoYXJnLG1hbGxvYyxyZWFsbG9jKXtpZihyZWFsbG9jPT09dW5kZWZpbmVkKXtjb25zdCBidWY9Y2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlKGFyZyk7Y29uc3QgcHRyPW1hbGxvYyhidWYubGVuZ3RoLDEpPj4+MDtnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIscHRyK2J1Zi5sZW5ndGgpLnNldChidWYpO1dBU01fVkVDVE9SX0xFTj1idWYubGVuZ3RoO3JldHVybiBwdHJ9bGV0IGxlbj1hcmcubGVuZ3RoO2xldCBwdHI9bWFsbG9jKGxlbiwxKT4+PjA7Y29uc3QgbWVtPWdldFVpbnQ4TWVtb3J5MCgpO2xldCBvZmZzZXQ9MDtmb3IoO29mZnNldDxsZW47b2Zmc2V0Kyspe2NvbnN0IGNvZGU9YXJnLmNoYXJDb2RlQXQob2Zmc2V0KTtpZihjb2RlPjB4N0YpYnJlYWs7bWVtW3B0citvZmZzZXRdPWNvZGV9aWYob2Zmc2V0IT09bGVuKXtpZihvZmZzZXQhPT0wKXthcmc9YXJnLnNsaWNlKG9mZnNldCl9cHRyPXJlYWxsb2MocHRyLGxlbixsZW49b2Zmc2V0K2FyZy5sZW5ndGgqMywxKT4+PjA7Y29uc3Qgdmlldz1nZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIrb2Zmc2V0LHB0citsZW4pO2NvbnN0IHJldD1lbmNvZGVTdHJpbmcoYXJnLHZpZXcpO29mZnNldCs9cmV0LndyaXR0ZW47cHRyPXJlYWxsb2MocHRyLGxlbixvZmZzZXQsMSk+Pj4wfVdBU01fVkVDVE9SX0xFTj1vZmZzZXQ7cmV0dXJuIHB0cn1fX2V4cG9ydHMuc2V0X3Jhbmtpbmdfd2VpZ2h0cz1mdW5jdGlvbihwdHIsd2VpZ2h0cyl7Y29uc3QgcHRyMD1wYXNzU3RyaW5nVG9XYXNtMCh3ZWlnaHRzLHdhc20uX193YmluZGdlbl9tYWxsb2Msd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO2NvbnN0IGxlbjA9V0FTTV9WRUNUT1JfTEVOO2NvbnN0IHJldD13YXNtLnNldF9yYW5raW5nX3dlaWdodHMocHRyLHB0cjAsbGVuMCk7cmV0dXJuIHJldD4+PjB9O2Z1bmN0aW9uIHBhc3NBcnJheThUb1dhc20wKGFyZyxtYWxsb2Mpe2NvbnN0IHB0cj1tYWxsb2MoYXJnLmxlbmd0aCoxLDEpPj4+MDtnZXRVaW50OE1lbW9yeTAoKS5zZXQoYXJnLHB0ci8xKTtXQVNNX1ZFQ1RPUl9MRU49YXJnLmxlbmd0aDtyZXR1cm4gcHRyfV9fZXhwb3J0cy5pbml0X3BhZ2VmaW5kPWZ1bmN0aW9uKG1ldGFkYXRhX2J5dGVzKXtjb25zdCBwdHIwPXBhc3NBcnJheThUb1dhc20wKG1ldGFkYXRhX2J5dGVzLHdhc20uX193YmluZGdlbl9tYWxsb2MpO2NvbnN0IGxlbjA9V0FTTV9WRUNUT1JfTEVOO2NvbnN0IHJldD13YXNtLmluaXRfcGFnZWZpbmQocHRyMCxsZW4wKTtyZXR1cm4gcmV0Pj4+MH07X19leHBvcnRzLmxvYWRfZmlsdGVyX2NodW5rPWZ1bmN0aW9uKHB0cixjaHVua19ieXRlcyl7Y29uc3QgcHRyMD1wYXNzQXJyYXk4VG9XYXNtMChjaHVua19ieXRlcyx3YXNtLl9fd2JpbmRnZW5fbWFsbG9jKTtjb25zdCBsZW4wPVdBU01fVkVDVE9SX0xFTjtjb25zdCByZXQ9d2FzbS5sb2FkX2ZpbHRlcl9jaHVuayhwdHIscHRyMCxsZW4wKTtyZXR1cm4gcmV0Pj4+MH07bGV0IGNhY2hlZEludDMyTWVtb3J5MD1udWxsO2Z1bmN0aW9uIGdldEludDMyTWVtb3J5MCgpe2lmKGNhY2hlZEludDMyTWVtb3J5MD09PW51bGx8fGNhY2hlZEludDMyTWVtb3J5MC5ieXRlTGVuZ3RoPT09MCl7Y2FjaGVkSW50MzJNZW1vcnkwPW5ldyBJbnQzMkFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcil9cmV0dXJuIGNhY2hlZEludDMyTWVtb3J5MH1jb25zdCBjYWNoZWRUZXh0RGVjb2Rlcj0odHlwZW9mIFRleHREZWNvZGVyIT09J3VuZGVmaW5lZCc/bmV3IFRleHREZWNvZGVyKCd1dGYtOCcse2lnbm9yZUJPTTp0cnVlLGZhdGFsOnRydWV9KTp7ZGVjb2RlOigpPT57dGhyb3cgRXJyb3IoJ1RleHREZWNvZGVyIG5vdCBhdmFpbGFibGUnKX19KTtpZih0eXBlb2YgVGV4dERlY29kZXIhPT0ndW5kZWZpbmVkJyl7Y2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKCl9O2Z1bmN0aW9uIGdldFN0cmluZ0Zyb21XYXNtMChwdHIsbGVuKXtwdHI9cHRyPj4+MDtyZXR1cm4gY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0cixwdHIrbGVuKSl9X19leHBvcnRzLnJlcXVlc3RfZmlsdGVyX2luZGV4ZXM9ZnVuY3Rpb24ocHRyLGZpbHRlcnMpe2xldCBkZWZlcnJlZDJfMDtsZXQgZGVmZXJyZWQyXzE7dHJ5e2NvbnN0IHJldHB0cj13YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtjb25zdCBwdHIwPXBhc3NTdHJpbmdUb1dhc20wKGZpbHRlcnMsd2FzbS5fX3diaW5kZ2VuX21hbGxvYyx3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7Y29uc3QgbGVuMD1XQVNNX1ZFQ1RPUl9MRU47d2FzbS5yZXF1ZXN0X2ZpbHRlcl9pbmRleGVzKHJldHB0cixwdHIscHRyMCxsZW4wKTt2YXIgcjA9Z2V0SW50MzJNZW1vcnkwKClbcmV0cHRyLzQrMF07dmFyIHIxPWdldEludDMyTWVtb3J5MCgpW3JldHB0ci80KzFdO2RlZmVycmVkMl8wPXIwO2RlZmVycmVkMl8xPXIxO3JldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAscjEpfWZpbmFsbHl7d2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTt3YXNtLl9fd2JpbmRnZW5fZnJlZShkZWZlcnJlZDJfMCxkZWZlcnJlZDJfMSwxKX19O19fZXhwb3J0cy5yZXF1ZXN0X2luZGV4ZXM9ZnVuY3Rpb24ocHRyLHF1ZXJ5KXtsZXQgZGVmZXJyZWQyXzA7bGV0IGRlZmVycmVkMl8xO3RyeXtjb25zdCByZXRwdHI9d2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7Y29uc3QgcHRyMD1wYXNzU3RyaW5nVG9XYXNtMChxdWVyeSx3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtjb25zdCBsZW4wPVdBU01fVkVDVE9SX0xFTjt3YXNtLnJlcXVlc3RfaW5kZXhlcyhyZXRwdHIscHRyLHB0cjAsbGVuMCk7dmFyIHIwPWdldEludDMyTWVtb3J5MCgpW3JldHB0ci80KzBdO3ZhciByMT1nZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIvNCsxXTtkZWZlcnJlZDJfMD1yMDtkZWZlcnJlZDJfMT1yMTtyZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLHIxKX1maW5hbGx5e3dhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7d2FzbS5fX3diaW5kZ2VuX2ZyZWUoZGVmZXJyZWQyXzAsZGVmZXJyZWQyXzEsMSl9fTtfX2V4cG9ydHMucmVxdWVzdF9hbGxfZmlsdGVyX2luZGV4ZXM9ZnVuY3Rpb24ocHRyKXtsZXQgZGVmZXJyZWQxXzA7bGV0IGRlZmVycmVkMV8xO3RyeXtjb25zdCByZXRwdHI9d2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7d2FzbS5yZXF1ZXN0X2FsbF9maWx0ZXJfaW5kZXhlcyhyZXRwdHIscHRyKTt2YXIgcjA9Z2V0SW50MzJNZW1vcnkwKClbcmV0cHRyLzQrMF07dmFyIHIxPWdldEludDMyTWVtb3J5MCgpW3JldHB0ci80KzFdO2RlZmVycmVkMV8wPXIwO2RlZmVycmVkMV8xPXIxO3JldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAscjEpfWZpbmFsbHl7d2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTt3YXNtLl9fd2JpbmRnZW5fZnJlZShkZWZlcnJlZDFfMCxkZWZlcnJlZDFfMSwxKX19O19fZXhwb3J0cy5maWx0ZXJzPWZ1bmN0aW9uKHB0cil7bGV0IGRlZmVycmVkMV8wO2xldCBkZWZlcnJlZDFfMTt0cnl7Y29uc3QgcmV0cHRyPXdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO3dhc20uZmlsdGVycyhyZXRwdHIscHRyKTt2YXIgcjA9Z2V0SW50MzJNZW1vcnkwKClbcmV0cHRyLzQrMF07dmFyIHIxPWdldEludDMyTWVtb3J5MCgpW3JldHB0ci80KzFdO2RlZmVycmVkMV8wPXIwO2RlZmVycmVkMV8xPXIxO3JldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAscjEpfWZpbmFsbHl7d2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTt3YXNtLl9fd2JpbmRnZW5fZnJlZShkZWZlcnJlZDFfMCxkZWZlcnJlZDFfMSwxKX19O19fZXhwb3J0cy5lbnRlcl9wbGF5Z3JvdW5kX21vZGU9ZnVuY3Rpb24ocHRyKXtjb25zdCByZXQ9d2FzbS5lbnRlcl9wbGF5Z3JvdW5kX21vZGUocHRyKTtyZXR1cm4gcmV0Pj4+MH07X19leHBvcnRzLnNlYXJjaD1mdW5jdGlvbihwdHIscXVlcnksZmlsdGVyLHNvcnQsZXhhY3Qpe2xldCBkZWZlcnJlZDRfMDtsZXQgZGVmZXJyZWQ0XzE7dHJ5e2NvbnN0IHJldHB0cj13YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtjb25zdCBwdHIwPXBhc3NTdHJpbmdUb1dhc20wKHF1ZXJ5LHdhc20uX193YmluZGdlbl9tYWxsb2Msd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO2NvbnN0IGxlbjA9V0FTTV9WRUNUT1JfTEVOO2NvbnN0IHB0cjE9cGFzc1N0cmluZ1RvV2FzbTAoZmlsdGVyLHdhc20uX193YmluZGdlbl9tYWxsb2Msd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO2NvbnN0IGxlbjE9V0FTTV9WRUNUT1JfTEVOO2NvbnN0IHB0cjI9cGFzc1N0cmluZ1RvV2FzbTAoc29ydCx3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtjb25zdCBsZW4yPVdBU01fVkVDVE9SX0xFTjt3YXNtLnNlYXJjaChyZXRwdHIscHRyLHB0cjAsbGVuMCxwdHIxLGxlbjEscHRyMixsZW4yLGV4YWN0KTt2YXIgcjA9Z2V0SW50MzJNZW1vcnkwKClbcmV0cHRyLzQrMF07dmFyIHIxPWdldEludDMyTWVtb3J5MCgpW3JldHB0ci80KzFdO2RlZmVycmVkNF8wPXIwO2RlZmVycmVkNF8xPXIxO3JldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAscjEpfWZpbmFsbHl7d2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTt3YXNtLl9fd2JpbmRnZW5fZnJlZShkZWZlcnJlZDRfMCxkZWZlcnJlZDRfMSwxKX19O19fZXhwb3J0cy5hZGRfc3ludGhldGljX2ZpbHRlcj1mdW5jdGlvbihwdHIsZmlsdGVyKXtjb25zdCBwdHIwPXBhc3NTdHJpbmdUb1dhc20wKGZpbHRlcix3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtjb25zdCBsZW4wPVdBU01fVkVDVE9SX0xFTjtjb25zdCByZXQ9d2FzbS5hZGRfc3ludGhldGljX2ZpbHRlcihwdHIscHRyMCxsZW4wKTtyZXR1cm4gcmV0Pj4+MH07X19leHBvcnRzLmxvYWRfaW5kZXhfY2h1bms9ZnVuY3Rpb24ocHRyLGNodW5rX2J5dGVzKXtjb25zdCBwdHIwPXBhc3NBcnJheThUb1dhc20wKGNodW5rX2J5dGVzLHdhc20uX193YmluZGdlbl9tYWxsb2MpO2NvbnN0IGxlbjA9V0FTTV9WRUNUT1JfTEVOO2NvbnN0IHJldD13YXNtLmxvYWRfaW5kZXhfY2h1bmsocHRyLHB0cjAsbGVuMCk7cmV0dXJuIHJldD4+PjB9O2FzeW5jIGZ1bmN0aW9uIF9fd2JnX2xvYWQobW9kdWxlLGltcG9ydHMpe2lmKHR5cGVvZiBSZXNwb25zZT09PSdmdW5jdGlvbicmJm1vZHVsZSBpbnN0YW5jZW9mIFJlc3BvbnNlKXtpZih0eXBlb2YgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGVTdHJlYW1pbmc9PT0nZnVuY3Rpb24nKXt0cnl7cmV0dXJuIGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKG1vZHVsZSxpbXBvcnRzKX1jYXRjaChlKXtpZihtb2R1bGUuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpIT0nYXBwbGljYXRpb24vd2FzbScpe2NvbnNvbGUud2FybihcImBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZVN0cmVhbWluZ2AgZmFpbGVkIGJlY2F1c2UgeW91ciBzZXJ2ZXIgZG9lcyBub3Qgc2VydmUgd2FzbSB3aXRoIGBhcHBsaWNhdGlvbi93YXNtYCBNSU1FIHR5cGUuIEZhbGxpbmcgYmFjayB0byBgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGVgIHdoaWNoIGlzIHNsb3dlci4gT3JpZ2luYWwgZXJyb3I6XFxuXCIsZSl9ZWxzZXt0aHJvdyBlfX19Y29uc3QgYnl0ZXM9YXdhaXQgbW9kdWxlLmFycmF5QnVmZmVyKCk7cmV0dXJuIGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlKGJ5dGVzLGltcG9ydHMpfWVsc2V7Y29uc3QgaW5zdGFuY2U9YXdhaXQgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGUobW9kdWxlLGltcG9ydHMpO2lmKGluc3RhbmNlIGluc3RhbmNlb2YgV2ViQXNzZW1ibHkuSW5zdGFuY2Upe3JldHVybntpbnN0YW5jZSxtb2R1bGV9fWVsc2V7cmV0dXJuIGluc3RhbmNlfX19ZnVuY3Rpb24gX193YmdfZ2V0X2ltcG9ydHMoKXtjb25zdCBpbXBvcnRzPXt9O2ltcG9ydHMud2JnPXt9O3JldHVybiBpbXBvcnRzfWZ1bmN0aW9uIF9fd2JnX2luaXRfbWVtb3J5KGltcG9ydHMsbWF5YmVfbWVtb3J5KXt9ZnVuY3Rpb24gX193YmdfZmluYWxpemVfaW5pdChpbnN0YW5jZSxtb2R1bGUpe3dhc209aW5zdGFuY2UuZXhwb3J0cztfX3diZ19pbml0Ll9fd2JpbmRnZW5fd2FzbV9tb2R1bGU9bW9kdWxlO2NhY2hlZEludDMyTWVtb3J5MD1udWxsO2NhY2hlZFVpbnQ4TWVtb3J5MD1udWxsO3JldHVybiB3YXNtfWZ1bmN0aW9uIGluaXRTeW5jKG1vZHVsZSl7aWYod2FzbSE9PXVuZGVmaW5lZClyZXR1cm4gd2FzbTtjb25zdCBpbXBvcnRzPV9fd2JnX2dldF9pbXBvcnRzKCk7X193YmdfaW5pdF9tZW1vcnkoaW1wb3J0cyk7aWYoIShtb2R1bGUgaW5zdGFuY2VvZiBXZWJBc3NlbWJseS5Nb2R1bGUpKXttb2R1bGU9bmV3IFdlYkFzc2VtYmx5Lk1vZHVsZShtb2R1bGUpfWNvbnN0IGluc3RhbmNlPW5ldyBXZWJBc3NlbWJseS5JbnN0YW5jZShtb2R1bGUsaW1wb3J0cyk7cmV0dXJuIF9fd2JnX2ZpbmFsaXplX2luaXQoaW5zdGFuY2UsbW9kdWxlKX1hc3luYyBmdW5jdGlvbiBfX3diZ19pbml0KGlucHV0KXtpZih3YXNtIT09dW5kZWZpbmVkKXJldHVybiB3YXNtO2lmKHR5cGVvZiBpbnB1dD09PSd1bmRlZmluZWQnJiZ0eXBlb2Ygc2NyaXB0X3NyYyE9PSd1bmRlZmluZWQnKXtpbnB1dD1zY3JpcHRfc3JjLnJlcGxhY2UoL1xcLmpzJC8sJ19iZy53YXNtJyl9Y29uc3QgaW1wb3J0cz1fX3diZ19nZXRfaW1wb3J0cygpO2lmKHR5cGVvZiBpbnB1dD09PSdzdHJpbmcnfHwodHlwZW9mIFJlcXVlc3Q9PT0nZnVuY3Rpb24nJiZpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpfHwodHlwZW9mIFVSTD09PSdmdW5jdGlvbicmJmlucHV0IGluc3RhbmNlb2YgVVJMKSl7aW5wdXQ9ZmV0Y2goaW5wdXQpfV9fd2JnX2luaXRfbWVtb3J5KGltcG9ydHMpO2NvbnN0e2luc3RhbmNlLG1vZHVsZX09YXdhaXQgX193YmdfbG9hZChhd2FpdCBpbnB1dCxpbXBvcnRzKTtyZXR1cm4gX193YmdfZmluYWxpemVfaW5pdChpbnN0YW5jZSxtb2R1bGUpfXdhc21fYmluZGdlbj1PYmplY3QuYXNzaWduKF9fd2JnX2luaXQse2luaXRTeW5jfSxfX2V4cG9ydHMpfSkoKTt2YXIgdTg9VWludDhBcnJheTt2YXIgdTE2PVVpbnQxNkFycmF5O3ZhciB1MzI9VWludDMyQXJyYXk7dmFyIGZsZWI9bmV3IHU4KFswLDAsMCwwLDAsMCwwLDAsMSwxLDEsMSwyLDIsMiwyLDMsMywzLDMsNCw0LDQsNCw1LDUsNSw1LDAsMCwwLDBdKTt2YXIgZmRlYj1uZXcgdTgoWzAsMCwwLDAsMSwxLDIsMiwzLDMsNCw0LDUsNSw2LDYsNyw3LDgsOCw5LDksMTAsMTAsMTEsMTEsMTIsMTIsMTMsMTMsMCwwXSk7dmFyIGNsaW09bmV3IHU4KFsxNiwxNywxOCwwLDgsNyw5LDYsMTAsNSwxMSw0LDEyLDMsMTMsMiwxNCwxLDE1XSk7dmFyIGZyZWI9ZnVuY3Rpb24oZWIsc3RhcnQpe3ZhciBiPW5ldyB1MTYoMzEpO2Zvcih2YXIgaTI9MDtpMjwzMTsrK2kyKXtiW2kyXT1zdGFydCs9MTw8ZWJbaTItMV19dmFyIHI9bmV3IHUzMihiWzMwXSk7Zm9yKHZhciBpMj0xO2kyPDMwOysraTIpe2Zvcih2YXIgaj1iW2kyXTtqPGJbaTIrMV07KytqKXtyW2pdPWotYltpMl08PDV8aTJ9fXJldHVybltiLHJdfTt2YXIgX2E9ZnJlYihmbGViLDIpO3ZhciBmbD1fYVswXTt2YXIgcmV2Zmw9X2FbMV07ZmxbMjhdPTI1OCxyZXZmbFsyNThdPTI4O3ZhciBfYj1mcmViKGZkZWIsMCk7dmFyIGZkPV9iWzBdO3ZhciByZXZmZD1fYlsxXTt2YXIgcmV2PW5ldyB1MTYoMzI3NjgpO2ZvcihpPTA7aTwzMjc2ODsrK2kpe3g9KGkmNDM2OTApPj4+MXwoaSYyMTg0NSk8PDE7eD0oeCY1MjQyOCk+Pj4yfCh4JjEzMTA3KTw8Mjt4PSh4JjYxNjgwKT4+PjR8KHgmMzg1NSk8PDQ7cmV2W2ldPSgoeCY2NTI4MCk+Pj44fCh4JjI1NSk8PDgpPj4+MX12YXIgeDt2YXIgaTt2YXIgaE1hcD1mdW5jdGlvbihjZCxtYixyKXt2YXIgcz1jZC5sZW5ndGg7dmFyIGkyPTA7dmFyIGw9bmV3IHUxNihtYik7Zm9yKDtpMjxzOysraTIpe2lmKGNkW2kyXSkrK2xbY2RbaTJdLTFdfXZhciBsZT1uZXcgdTE2KG1iKTtmb3IoaTI9MDtpMjxtYjsrK2kyKXtsZVtpMl09bGVbaTItMV0rbFtpMi0xXTw8MX12YXIgY287aWYocil7Y289bmV3IHUxNigxPDxtYik7dmFyIHJ2Yj0xNS1tYjtmb3IoaTI9MDtpMjxzOysraTIpe2lmKGNkW2kyXSl7dmFyIHN2PWkyPDw0fGNkW2kyXTt2YXIgcl8xPW1iLWNkW2kyXTt2YXIgdj1sZVtjZFtpMl0tMV0rKzw8cl8xO2Zvcih2YXIgbT12fCgxPDxyXzEpLTE7djw9bTsrK3Ype2NvW3Jldlt2XT4+PnJ2Yl09c3Z9fX19ZWxzZXtjbz1uZXcgdTE2KHMpO2ZvcihpMj0wO2kyPHM7KytpMil7aWYoY2RbaTJdKXtjb1tpMl09cmV2W2xlW2NkW2kyXS0xXSsrXT4+PjE1LWNkW2kyXX19fXJldHVybiBjb307dmFyIGZsdD1uZXcgdTgoMjg4KTtmb3IoaT0wO2k8MTQ0OysraSlmbHRbaV09ODt2YXIgaTtmb3IoaT0xNDQ7aTwyNTY7KytpKWZsdFtpXT05O3ZhciBpO2ZvcihpPTI1NjtpPDI4MDsrK2kpZmx0W2ldPTc7dmFyIGk7Zm9yKGk9MjgwO2k8Mjg4OysraSlmbHRbaV09ODt2YXIgaTt2YXIgZmR0PW5ldyB1OCgzMik7Zm9yKGk9MDtpPDMyOysraSlmZHRbaV09NTt2YXIgaTt2YXIgZmxybT1oTWFwKGZsdCw5LDEpO3ZhciBmZHJtPWhNYXAoZmR0LDUsMSk7dmFyIG1heD1mdW5jdGlvbihhKXt2YXIgbT1hWzBdO2Zvcih2YXIgaTI9MTtpMjxhLmxlbmd0aDsrK2kyKXtpZihhW2kyXT5tKW09YVtpMl19cmV0dXJuIG19O3ZhciBiaXRzPWZ1bmN0aW9uKGQscCxtKXt2YXIgbz1wLzh8MDtyZXR1cm4oZFtvXXxkW28rMV08PDgpPj4ocCY3KSZtfTt2YXIgYml0czE2PWZ1bmN0aW9uKGQscCl7dmFyIG89cC84fDA7cmV0dXJuKGRbb118ZFtvKzFdPDw4fGRbbysyXTw8MTYpPj4ocCY3KX07dmFyIHNoZnQ9ZnVuY3Rpb24ocCl7cmV0dXJuKHArNykvOHwwfTt2YXIgc2xjPWZ1bmN0aW9uKHYscyxlKXtpZihzPT1udWxsfHxzPDApcz0wO2lmKGU9PW51bGx8fGU+di5sZW5ndGgpZT12Lmxlbmd0aDt2YXIgbj1uZXcodi5CWVRFU19QRVJfRUxFTUVOVD09Mj91MTY6di5CWVRFU19QRVJfRUxFTUVOVD09ND91MzI6dTgpKGUtcyk7bi5zZXQodi5zdWJhcnJheShzLGUpKTtyZXR1cm4gbn07dmFyIGVjPVtcInVuZXhwZWN0ZWQgRU9GXCIsXCJpbnZhbGlkIGJsb2NrIHR5cGVcIixcImludmFsaWQgbGVuZ3RoL2xpdGVyYWxcIixcImludmFsaWQgZGlzdGFuY2VcIixcInN0cmVhbSBmaW5pc2hlZFwiLFwibm8gc3RyZWFtIGhhbmRsZXJcIiwsXCJubyBjYWxsYmFja1wiLFwiaW52YWxpZCBVVEYtOCBkYXRhXCIsXCJleHRyYSBmaWVsZCB0b28gbG9uZ1wiLFwiZGF0ZSBub3QgaW4gcmFuZ2UgMTk4MC0yMDk5XCIsXCJmaWxlbmFtZSB0b28gbG9uZ1wiLFwic3RyZWFtIGZpbmlzaGluZ1wiLFwiaW52YWxpZCB6aXAgZGF0YVwiXTt2YXIgZXJyPWZ1bmN0aW9uKGluZCxtc2csbnQpe3ZhciBlPW5ldyBFcnJvcihtc2d8fGVjW2luZF0pO2UuY29kZT1pbmQ7aWYoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UoZSxlcnIpO2lmKCFudCl0aHJvdyBlO3JldHVybiBlfTt2YXIgaW5mbHQ9ZnVuY3Rpb24oZGF0LGJ1ZixzdCl7dmFyIHNsPWRhdC5sZW5ndGg7aWYoIXNsfHxzdCYmc3QuZiYmIXN0LmwpcmV0dXJuIGJ1Znx8bmV3IHU4KDApO3ZhciBub0J1Zj0hYnVmfHxzdDt2YXIgbm9TdD0hc3R8fHN0Lmk7aWYoIXN0KXN0PXt9O2lmKCFidWYpYnVmPW5ldyB1OChzbCozKTt2YXIgY2J1Zj1mdW5jdGlvbihsMil7dmFyIGJsPWJ1Zi5sZW5ndGg7aWYobDI+Ymwpe3ZhciBuYnVmPW5ldyB1OChNYXRoLm1heChibCoyLGwyKSk7bmJ1Zi5zZXQoYnVmKTtidWY9bmJ1Zn19O3ZhciBmaW5hbD1zdC5mfHwwLHBvcz1zdC5wfHwwLGJ0PXN0LmJ8fDAsbG09c3QubCxkbT1zdC5kLGxidD1zdC5tLGRidD1zdC5uO3ZhciB0YnRzPXNsKjg7ZG97aWYoIWxtKXtmaW5hbD1iaXRzKGRhdCxwb3MsMSk7dmFyIHR5cGU9Yml0cyhkYXQscG9zKzEsMyk7cG9zKz0zO2lmKCF0eXBlKXt2YXIgcz1zaGZ0KHBvcykrNCxsPWRhdFtzLTRdfGRhdFtzLTNdPDw4LHQ9cytsO2lmKHQ+c2wpe2lmKG5vU3QpZXJyKDApO2JyZWFrfWlmKG5vQnVmKWNidWYoYnQrbCk7YnVmLnNldChkYXQuc3ViYXJyYXkocyx0KSxidCk7c3QuYj1idCs9bCxzdC5wPXBvcz10Kjgsc3QuZj1maW5hbDtjb250aW51ZX1lbHNlIGlmKHR5cGU9PTEpbG09ZmxybSxkbT1mZHJtLGxidD05LGRidD01O2Vsc2UgaWYodHlwZT09Mil7dmFyIGhMaXQ9Yml0cyhkYXQscG9zLDMxKSsyNTcsaGNMZW49Yml0cyhkYXQscG9zKzEwLDE1KSs0O3ZhciB0bD1oTGl0K2JpdHMoZGF0LHBvcys1LDMxKSsxO3Bvcys9MTQ7dmFyIGxkdD1uZXcgdTgodGwpO3ZhciBjbHQ9bmV3IHU4KDE5KTtmb3IodmFyIGkyPTA7aTI8aGNMZW47KytpMil7Y2x0W2NsaW1baTJdXT1iaXRzKGRhdCxwb3MraTIqMyw3KX1wb3MrPWhjTGVuKjM7dmFyIGNsYj1tYXgoY2x0KSxjbGJtc2s9KDE8PGNsYiktMTt2YXIgY2xtPWhNYXAoY2x0LGNsYiwxKTtmb3IodmFyIGkyPTA7aTI8dGw7KXt2YXIgcj1jbG1bYml0cyhkYXQscG9zLGNsYm1zayldO3Bvcys9ciYxNTt2YXIgcz1yPj4+NDtpZihzPDE2KXtsZHRbaTIrK109c31lbHNle3ZhciBjPTAsbj0wO2lmKHM9PTE2KW49MytiaXRzKGRhdCxwb3MsMykscG9zKz0yLGM9bGR0W2kyLTFdO2Vsc2UgaWYocz09MTcpbj0zK2JpdHMoZGF0LHBvcyw3KSxwb3MrPTM7ZWxzZSBpZihzPT0xOCluPTExK2JpdHMoZGF0LHBvcywxMjcpLHBvcys9Nzt3aGlsZShuLS0pbGR0W2kyKytdPWN9fXZhciBsdD1sZHQuc3ViYXJyYXkoMCxoTGl0KSxkdD1sZHQuc3ViYXJyYXkoaExpdCk7bGJ0PW1heChsdCk7ZGJ0PW1heChkdCk7bG09aE1hcChsdCxsYnQsMSk7ZG09aE1hcChkdCxkYnQsMSl9ZWxzZSBlcnIoMSk7aWYocG9zPnRidHMpe2lmKG5vU3QpZXJyKDApO2JyZWFrfX1pZihub0J1ZiljYnVmKGJ0KzEzMTA3Mik7dmFyIGxtcz0oMTw8bGJ0KS0xLGRtcz0oMTw8ZGJ0KS0xO3ZhciBscG9zPXBvcztmb3IoOztscG9zPXBvcyl7dmFyIGM9bG1bYml0czE2KGRhdCxwb3MpJmxtc10sc3ltPWM+Pj40O3Bvcys9YyYxNTtpZihwb3M+dGJ0cyl7aWYobm9TdCllcnIoMCk7YnJlYWt9aWYoIWMpZXJyKDIpO2lmKHN5bTwyNTYpYnVmW2J0KytdPXN5bTtlbHNlIGlmKHN5bT09MjU2KXtscG9zPXBvcyxsbT1udWxsO2JyZWFrfWVsc2V7dmFyIGFkZD1zeW0tMjU0O2lmKHN5bT4yNjQpe3ZhciBpMj1zeW0tMjU3LGI9ZmxlYltpMl07YWRkPWJpdHMoZGF0LHBvcywoMTw8YiktMSkrZmxbaTJdO3Bvcys9Yn12YXIgZD1kbVtiaXRzMTYoZGF0LHBvcykmZG1zXSxkc3ltPWQ+Pj40O2lmKCFkKWVycigzKTtwb3MrPWQmMTU7dmFyIGR0PWZkW2RzeW1dO2lmKGRzeW0+Myl7dmFyIGI9ZmRlYltkc3ltXTtkdCs9Yml0czE2KGRhdCxwb3MpJigxPDxiKS0xLHBvcys9Yn1pZihwb3M+dGJ0cyl7aWYobm9TdCllcnIoMCk7YnJlYWt9aWYobm9CdWYpY2J1ZihidCsxMzEwNzIpO3ZhciBlbmQ9YnQrYWRkO2Zvcig7YnQ8ZW5kO2J0Kz00KXtidWZbYnRdPWJ1ZltidC1kdF07YnVmW2J0KzFdPWJ1ZltidCsxLWR0XTtidWZbYnQrMl09YnVmW2J0KzItZHRdO2J1ZltidCszXT1idWZbYnQrMy1kdF19YnQ9ZW5kfX1zdC5sPWxtLHN0LnA9bHBvcyxzdC5iPWJ0LHN0LmY9ZmluYWw7aWYobG0pZmluYWw9MSxzdC5tPWxidCxzdC5kPWRtLHN0Lm49ZGJ0fXdoaWxlKCFmaW5hbCk7cmV0dXJuIGJ0PT1idWYubGVuZ3RoP2J1ZjpzbGMoYnVmLDAsYnQpfTt2YXIgZXQ9bmV3IHU4KDApO3ZhciBnenM9ZnVuY3Rpb24oZCl7aWYoZFswXSE9MzF8fGRbMV0hPTEzOXx8ZFsyXSE9OCllcnIoNixcImludmFsaWQgZ3ppcCBkYXRhXCIpO3ZhciBmbGc9ZFszXTt2YXIgc3Q9MTA7aWYoZmxnJjQpc3QrPWRbMTBdfChkWzExXTw8OCkrMjtmb3IodmFyIHpzPShmbGc+PjMmMSkrKGZsZz4+NCYxKTt6cz4wO3pzLT0hZFtzdCsrXSk7cmV0dXJuIHN0KyhmbGcmMil9O3ZhciBnemw9ZnVuY3Rpb24oZCl7dmFyIGw9ZC5sZW5ndGg7cmV0dXJuKGRbbC00XXxkW2wtM108PDh8ZFtsLTJdPDwxNnxkW2wtMV08PDI0KT4+PjB9O2Z1bmN0aW9uIGd1bnppcFN5bmMoZGF0YSxvdXQpe3JldHVybiBpbmZsdChkYXRhLnN1YmFycmF5KGd6cyhkYXRhKSwtOCksb3V0fHxuZXcgdTgoZ3psKGRhdGEpKSl9dmFyIHRkPXR5cGVvZiBUZXh0RGVjb2RlciE9XCJ1bmRlZmluZWRcIiYmbmV3IFRleHREZWNvZGVyKCk7dmFyIHRkcz0wO3RyeXt0ZC5kZWNvZGUoZXQse3N0cmVhbTp0cnVlfSk7dGRzPTF9Y2F0Y2goZSl7fXZhciBnel9kZWZhdWx0PWd1bnppcFN5bmM7dmFyIGNhbGN1bGF0ZV9leGNlcnB0X3JlZ2lvbj0od29yZF9wb3NpdGlvbnMsZXhjZXJwdF9sZW5ndGgpPT57aWYod29yZF9wb3NpdGlvbnMubGVuZ3RoPT09MCl7cmV0dXJuIDB9bGV0IHdvcmRzPVtdO2Zvcihjb25zdCB3b3JkIG9mIHdvcmRfcG9zaXRpb25zKXt3b3Jkc1t3b3JkLmxvY2F0aW9uXT13b3Jkc1t3b3JkLmxvY2F0aW9uXXx8MDt3b3Jkc1t3b3JkLmxvY2F0aW9uXSs9d29yZC5iYWxhbmNlZF9zY29yZX1pZih3b3Jkcy5sZW5ndGg8PWV4Y2VycHRfbGVuZ3RoKXtyZXR1cm4gMH1sZXQgZGVuc2VzdD13b3Jkcy5zbGljZSgwLGV4Y2VycHRfbGVuZ3RoKS5yZWR1Y2UoKHBhcnRpYWxTdW0sYSk9PnBhcnRpYWxTdW0rYSwwKTtsZXQgd29ya2luZ19zdW09ZGVuc2VzdDtsZXQgZGVuc2VzdF9hdD1bMF07Zm9yKGxldCBpMj0wO2kyPHdvcmRzLmxlbmd0aDtpMisrKXtjb25zdCBib3VuZGFyeT1pMitleGNlcnB0X2xlbmd0aDt3b3JraW5nX3N1bSs9KHdvcmRzW2JvdW5kYXJ5XT8/MCktKHdvcmRzW2kyXT8/MCk7aWYod29ya2luZ19zdW0+ZGVuc2VzdCl7ZGVuc2VzdD13b3JraW5nX3N1bTtkZW5zZXN0X2F0PVtpMl19ZWxzZSBpZih3b3JraW5nX3N1bT09PWRlbnNlc3QmJmRlbnNlc3RfYXRbZGVuc2VzdF9hdC5sZW5ndGgtMV09PT1pMi0xKXtkZW5zZXN0X2F0LnB1c2goaTIpfX1sZXQgbWlkcG9pbnQ9ZGVuc2VzdF9hdFtNYXRoLmZsb29yKGRlbnNlc3RfYXQubGVuZ3RoLzIpXTtyZXR1cm4gbWlkcG9pbnR9O3ZhciBidWlsZF9leGNlcnB0PShjb250ZW50LHN0YXJ0LGxlbmd0aCxsb2NhdGlvbnMsbm90X2JlZm9yZSxub3RfZnJvbSk9PntsZXQgaXNfendzX2RlbGltaXRlZD1jb250ZW50LmluY2x1ZGVzKFwiXFx1MjAwQlwiKTtsZXQgZnJhZ21lbnRfd29yZHM9W107aWYoaXNfendzX2RlbGltaXRlZCl7ZnJhZ21lbnRfd29yZHM9Y29udGVudC5zcGxpdChcIlxcdTIwMEJcIil9ZWxzZXtmcmFnbWVudF93b3Jkcz1jb250ZW50LnNwbGl0KC9bXFxyXFxuXFxzXSsvZyl9Zm9yKGxldCB3b3JkIG9mIGxvY2F0aW9ucyl7aWYoZnJhZ21lbnRfd29yZHNbd29yZF0/LnN0YXJ0c1dpdGgoYDxtYXJrPmApKXtjb250aW51ZX1mcmFnbWVudF93b3Jkc1t3b3JkXT1gPG1hcms+JHtmcmFnbWVudF93b3Jkc1t3b3JkXX08L21hcms+YH1sZXQgZW5kY2FwPW5vdF9mcm9tPz9mcmFnbWVudF93b3Jkcy5sZW5ndGg7bGV0IHN0YXJ0Y2FwPW5vdF9iZWZvcmU/PzA7aWYoZW5kY2FwLXN0YXJ0Y2FwPGxlbmd0aCl7bGVuZ3RoPWVuZGNhcC1zdGFydGNhcH1pZihzdGFydCtsZW5ndGg+ZW5kY2FwKXtzdGFydD1lbmRjYXAtbGVuZ3RofWlmKHN0YXJ0PHN0YXJ0Y2FwKXtzdGFydD1zdGFydGNhcH1yZXR1cm4gZnJhZ21lbnRfd29yZHMuc2xpY2Uoc3RhcnQsc3RhcnQrbGVuZ3RoKS5qb2luKGlzX3p3c19kZWxpbWl0ZWQ/XCJcIjpcIiBcIikudHJpbSgpfTt2YXIgY2FsY3VsYXRlX3N1Yl9yZXN1bHRzPShmcmFnbWVudCxkZXNpcmVkX2V4Y2VycHRfbGVuZ3RoKT0+e2NvbnN0IGFuY2hvcnM9ZnJhZ21lbnQuYW5jaG9ycy5maWx0ZXIoKGEpPT4vaFxcZC9pLnRlc3QoYS5lbGVtZW50KSYmYS50ZXh0Py5sZW5ndGgmJi9cXFMvLnRlc3QoYS50ZXh0KSkuc29ydCgoYSxiKT0+YS5sb2NhdGlvbi1iLmxvY2F0aW9uKTtjb25zdCByZXN1bHRzPVtdO2xldCBjdXJyZW50X2FuY2hvcl9wb3NpdGlvbj0wO2xldCBjdXJyZW50X2FuY2hvcj17dGl0bGU6ZnJhZ21lbnQubWV0YVtcInRpdGxlXCJdLHVybDpmcmFnbWVudC51cmwsd2VpZ2h0ZWRfbG9jYXRpb25zOltdLGxvY2F0aW9uczpbXSxleGNlcnB0OlwiXCJ9O2NvbnN0IGFkZF9yZXN1bHQ9KGVuZF9yYW5nZSk9PntpZihjdXJyZW50X2FuY2hvci5sb2NhdGlvbnMubGVuZ3RoKXtjb25zdCByZWxhdGl2ZV93ZWlnaHRlZF9sb2NhdGlvbnM9Y3VycmVudF9hbmNob3Iud2VpZ2h0ZWRfbG9jYXRpb25zLm1hcCgobCk9PntyZXR1cm57d2VpZ2h0Omwud2VpZ2h0LGJhbGFuY2VkX3Njb3JlOmwuYmFsYW5jZWRfc2NvcmUsbG9jYXRpb246bC5sb2NhdGlvbi1jdXJyZW50X2FuY2hvcl9wb3NpdGlvbn19KTtjb25zdCBleGNlcnB0X3N0YXJ0PWNhbGN1bGF0ZV9leGNlcnB0X3JlZ2lvbihyZWxhdGl2ZV93ZWlnaHRlZF9sb2NhdGlvbnMsZGVzaXJlZF9leGNlcnB0X2xlbmd0aCkrY3VycmVudF9hbmNob3JfcG9zaXRpb247Y29uc3QgZXhjZXJwdF9sZW5ndGg9ZW5kX3JhbmdlP01hdGgubWluKGVuZF9yYW5nZS1leGNlcnB0X3N0YXJ0LGRlc2lyZWRfZXhjZXJwdF9sZW5ndGgpOmRlc2lyZWRfZXhjZXJwdF9sZW5ndGg7Y3VycmVudF9hbmNob3IuZXhjZXJwdD1idWlsZF9leGNlcnB0KGZyYWdtZW50LnJhd19jb250ZW50Pz9cIlwiLGV4Y2VycHRfc3RhcnQsZXhjZXJwdF9sZW5ndGgsY3VycmVudF9hbmNob3IubG9jYXRpb25zLGN1cnJlbnRfYW5jaG9yX3Bvc2l0aW9uLGVuZF9yYW5nZSk7cmVzdWx0cy5wdXNoKGN1cnJlbnRfYW5jaG9yKX19O2ZvcihsZXQgd29yZCBvZiBmcmFnbWVudC53ZWlnaHRlZF9sb2NhdGlvbnMpe2lmKCFhbmNob3JzLmxlbmd0aHx8d29yZC5sb2NhdGlvbjxhbmNob3JzWzBdLmxvY2F0aW9uKXtjdXJyZW50X2FuY2hvci53ZWlnaHRlZF9sb2NhdGlvbnMucHVzaCh3b3JkKTtjdXJyZW50X2FuY2hvci5sb2NhdGlvbnMucHVzaCh3b3JkLmxvY2F0aW9uKX1lbHNle2xldCBuZXh0X2FuY2hvcj1hbmNob3JzLnNoaWZ0KCk7YWRkX3Jlc3VsdChuZXh0X2FuY2hvci5sb2NhdGlvbik7d2hpbGUoYW5jaG9ycy5sZW5ndGgmJndvcmQubG9jYXRpb24+PWFuY2hvcnNbMF0ubG9jYXRpb24pe25leHRfYW5jaG9yPWFuY2hvcnMuc2hpZnQoKX1sZXQgYW5jaG9yZWRfdXJsPWZyYWdtZW50LnVybDt0cnl7Y29uc3QgdXJsX2lzX2ZxPS9eKChodHRwcz86KT9cXC9cXC8pLy50ZXN0KGFuY2hvcmVkX3VybCk7aWYodXJsX2lzX2ZxKXtsZXQgZnFfdXJsPW5ldyBVUkwoYW5jaG9yZWRfdXJsKTtmcV91cmwuaGFzaD1uZXh0X2FuY2hvci5pZDthbmNob3JlZF91cmw9ZnFfdXJsLnRvU3RyaW5nKCl9ZWxzZXtpZighL15cXC8vLnRlc3QoYW5jaG9yZWRfdXJsKSl7YW5jaG9yZWRfdXJsPWAvJHthbmNob3JlZF91cmx9YH1sZXQgZnFfdXJsPW5ldyBVUkwoYGh0dHBzOi8vZXhhbXBsZS5jb20ke2FuY2hvcmVkX3VybH1gKTtmcV91cmwuaGFzaD1uZXh0X2FuY2hvci5pZDthbmNob3JlZF91cmw9ZnFfdXJsLnRvU3RyaW5nKCkucmVwbGFjZSgvXmh0dHBzOlxcL1xcL2V4YW1wbGUuY29tLyxcIlwiKX19Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihgUGFnZWZpbmQ6IENvdWxkbid0IHByb2Nlc3MgJHthbmNob3JlZF91cmx9IGZvciBhIHNlYXJjaCByZXN1bHRgKX1jdXJyZW50X2FuY2hvcl9wb3NpdGlvbj1uZXh0X2FuY2hvci5sb2NhdGlvbjtjdXJyZW50X2FuY2hvcj17dGl0bGU6bmV4dF9hbmNob3IudGV4dCx1cmw6YW5jaG9yZWRfdXJsLGFuY2hvcjpuZXh0X2FuY2hvcix3ZWlnaHRlZF9sb2NhdGlvbnM6W3dvcmRdLGxvY2F0aW9uczpbd29yZC5sb2NhdGlvbl0sZXhjZXJwdDpcIlwifX19YWRkX3Jlc3VsdChhbmNob3JzWzBdPy5sb2NhdGlvbik7cmV0dXJuIHJlc3VsdHN9O3ZhciBhc3luY1NsZWVwPWFzeW5jKG1zPTEwMCk9PntyZXR1cm4gbmV3IFByb21pc2UoKHIpPT5zZXRUaW1lb3V0KHIsbXMpKX07dmFyIGlzQnJvd3Nlcj10eXBlb2Ygd2luZG93IT09XCJ1bmRlZmluZWRcIiYmdHlwZW9mIGRvY3VtZW50IT09XCJ1bmRlZmluZWRcIjt2YXIgUGFnZWZpbmRJbnN0YW5jZT1jbGFzc3tjb25zdHJ1Y3RvcihvcHRzPXt9KXt0aGlzLnZlcnNpb249cGFnZWZpbmRfdmVyc2lvbjt0aGlzLmJhY2tlbmQ9d2FzbV9iaW5kZ2VuO3RoaXMuZGVjb2Rlcj1uZXcgVGV4dERlY29kZXIoXCJ1dGYtOFwiKTt0aGlzLndhc209bnVsbDt0aGlzLmJhc2VQYXRoPW9wdHMuYmFzZVBhdGh8fFwiL3BhZ2VmaW5kL1wiO3RoaXMucHJpbWFyeT1vcHRzLnByaW1hcnl8fGZhbHNlO2lmKHRoaXMucHJpbWFyeSYmIW9wdHMuYmFzZVBhdGgpe3RoaXMuaW5pdFByaW1hcnkoKX1pZigvW15cXC9dJC8udGVzdCh0aGlzLmJhc2VQYXRoKSl7dGhpcy5iYXNlUGF0aD1gJHt0aGlzLmJhc2VQYXRofS9gfWlmKGlzQnJvd3NlciYmd2luZG93Py5sb2NhdGlvbj8ub3JpZ2luJiZ0aGlzLmJhc2VQYXRoLnN0YXJ0c1dpdGgod2luZG93LmxvY2F0aW9uLm9yaWdpbikpe3RoaXMuYmFzZVBhdGg9dGhpcy5iYXNlUGF0aC5yZXBsYWNlKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4sXCJcIil9dGhpcy5iYXNlVXJsPW9wdHMuYmFzZVVybHx8dGhpcy5kZWZhdWx0QmFzZVVybCgpO2lmKCEvXihcXC98aHR0cHM/OlxcL1xcLykvLnRlc3QodGhpcy5iYXNlVXJsKSl7dGhpcy5iYXNlVXJsPWAvJHt0aGlzLmJhc2VVcmx9YH10aGlzLmluZGV4V2VpZ2h0PW9wdHMuaW5kZXhXZWlnaHQ/PzE7dGhpcy5leGNlcnB0TGVuZ3RoPW9wdHMuZXhjZXJwdExlbmd0aD8/MzA7dGhpcy5tZXJnZUZpbHRlcj1vcHRzLm1lcmdlRmlsdGVyPz97fTt0aGlzLnJhbmtpbmc9b3B0cy5yYW5raW5nO3RoaXMuaGlnaGxpZ2h0UGFyYW09b3B0cy5oaWdobGlnaHRQYXJhbT8/bnVsbDt0aGlzLmxvYWRlZF9jaHVua3M9e307dGhpcy5sb2FkZWRfZmlsdGVycz17fTt0aGlzLmxvYWRlZF9mcmFnbWVudHM9e307dGhpcy5yYXdfcHRyPW51bGw7dGhpcy5zZWFyY2hNZXRhPW51bGw7dGhpcy5sYW5ndWFnZXM9bnVsbH1pbml0UHJpbWFyeSgpe2lmKGlzQnJvd3NlciYmdHlwZW9mIGltcG9ydC5tZXRhLnVybCE9PVwidW5kZWZpbmVkXCIpe2xldCBkZXJpdmVkQmFzZVBhdGg9aW1wb3J0Lm1ldGEudXJsLm1hdGNoKC9eKC4qXFwvKXBhZ2VmaW5kLmpzLiokLyk/LlsxXTtpZihkZXJpdmVkQmFzZVBhdGgpe3RoaXMuYmFzZVBhdGg9ZGVyaXZlZEJhc2VQYXRofWVsc2V7Y29uc29sZS53YXJuKFtcIlBhZ2VmaW5kIGNvdWxkbid0IGRldGVybWluZSB0aGUgYmFzZSBvZiB0aGUgYnVuZGxlIGZyb20gdGhlIGltcG9ydCBwYXRoLiBGYWxsaW5nIGJhY2sgdG8gdGhlIGRlZmF1bHQuXCIsXCJTZXQgYSBiYXNlUGF0aCBvcHRpb24gd2hlbiBpbml0aWFsaXNpbmcgUGFnZWZpbmQgdG8gaWdub3JlIHRoaXMgbWVzc2FnZS5cIl0uam9pbihcIlxcblwiKSl9fX1kZWZhdWx0QmFzZVVybCgpe2xldCBkZWZhdWx0X2Jhc2U9dGhpcy5iYXNlUGF0aC5tYXRjaCgvXiguKlxcLylfP3BhZ2VmaW5kLyk/LlsxXTtyZXR1cm4gZGVmYXVsdF9iYXNlfHxcIi9cIn1hc3luYyBvcHRpb25zKG9wdGlvbnMyKXtjb25zdCBvcHRzPVtcImJhc2VQYXRoXCIsXCJiYXNlVXJsXCIsXCJpbmRleFdlaWdodFwiLFwiZXhjZXJwdExlbmd0aFwiLFwibWVyZ2VGaWx0ZXJcIixcImhpZ2hsaWdodFBhcmFtXCIsXCJyYW5raW5nXCJdO2Zvcihjb25zdFtrLHZdb2YgT2JqZWN0LmVudHJpZXMob3B0aW9uczIpKXtpZihrPT09XCJtZXJnZUZpbHRlclwiKXtsZXQgZmlsdGVyczI9dGhpcy5zdHJpbmdpZnlGaWx0ZXJzKHYpO2xldCBwdHI9YXdhaXQgdGhpcy5nZXRQdHIoKTt0aGlzLnJhd19wdHI9dGhpcy5iYWNrZW5kLmFkZF9zeW50aGV0aWNfZmlsdGVyKHB0cixmaWx0ZXJzMil9ZWxzZSBpZihrPT09XCJyYW5raW5nXCIpe2F3YWl0IHRoaXMuc2V0X3Jhbmtpbmcob3B0aW9uczIucmFua2luZyl9ZWxzZSBpZihvcHRzLmluY2x1ZGVzKGspKXtpZihrPT09XCJiYXNlUGF0aFwiJiZ0eXBlb2Ygdj09PVwic3RyaW5nXCIpdGhpcy5iYXNlUGF0aD12O2lmKGs9PT1cImJhc2VVcmxcIiYmdHlwZW9mIHY9PT1cInN0cmluZ1wiKXRoaXMuYmFzZVVybD12O2lmKGs9PT1cImluZGV4V2VpZ2h0XCImJnR5cGVvZiB2PT09XCJudW1iZXJcIil0aGlzLmluZGV4V2VpZ2h0PXY7aWYoaz09PVwiZXhjZXJwdExlbmd0aFwiJiZ0eXBlb2Ygdj09PVwibnVtYmVyXCIpdGhpcy5leGNlcnB0TGVuZ3RoPXY7aWYoaz09PVwibWVyZ2VGaWx0ZXJcIiYmdHlwZW9mIHY9PT1cIm9iamVjdFwiKXRoaXMubWVyZ2VGaWx0ZXI9djtpZihrPT09XCJoaWdobGlnaHRQYXJhbVwiJiZ0eXBlb2Ygdj09PVwic3RyaW5nXCIpdGhpcy5oaWdobGlnaHRQYXJhbT12fWVsc2V7Y29uc29sZS53YXJuKGBVbmtub3duIFBhZ2VmaW5kIG9wdGlvbiAke2t9LiBBbGxvd2VkIG9wdGlvbnM6IFske29wdHMuam9pbihcIiwgXCIpfV1gKX19fWFzeW5jIGVudGVyUGxheWdyb3VuZE1vZGUoKXtsZXQgcHRyPWF3YWl0IHRoaXMuZ2V0UHRyKCk7dGhpcy5yYXdfcHRyPXRoaXMuYmFja2VuZC5lbnRlcl9wbGF5Z3JvdW5kX21vZGUocHRyKX1kZWNvbXByZXNzKGRhdGEsZmlsZT1cInVua25vd24gZmlsZVwiKXtpZih0aGlzLmRlY29kZXIuZGVjb2RlKGRhdGEuc2xpY2UoMCwxMikpPT09XCJwYWdlZmluZF9kY2RcIil7cmV0dXJuIGRhdGEuc2xpY2UoMTIpfWRhdGE9Z3pfZGVmYXVsdChkYXRhKTtpZih0aGlzLmRlY29kZXIuZGVjb2RlKGRhdGEuc2xpY2UoMCwxMikpIT09XCJwYWdlZmluZF9kY2RcIil7Y29uc29sZS5lcnJvcihgRGVjb21wcmVzc2luZyAke2ZpbGV9IGFwcGVhcnMgdG8gaGF2ZSBmYWlsZWQ6IE1pc3Npbmcgc2lnbmF0dXJlYCk7cmV0dXJuIGRhdGF9cmV0dXJuIGRhdGEuc2xpY2UoMTIpfWFzeW5jIHNldF9yYW5raW5nKHJhbmtpbmcpe2lmKCFyYW5raW5nKXJldHVybjtsZXQgcmFua2luZ1dlaWdodHM9e3Rlcm1fc2ltaWxhcml0eTpyYW5raW5nLnRlcm1TaW1pbGFyaXR5Pz9udWxsLHBhZ2VfbGVuZ3RoOnJhbmtpbmcucGFnZUxlbmd0aD8/bnVsbCx0ZXJtX3NhdHVyYXRpb246cmFua2luZy50ZXJtU2F0dXJhdGlvbj8/bnVsbCx0ZXJtX2ZyZXF1ZW5jeTpyYW5raW5nLnRlcm1GcmVxdWVuY3k/P251bGx9O2xldCBwdHI9YXdhaXQgdGhpcy5nZXRQdHIoKTt0aGlzLnJhd19wdHI9dGhpcy5iYWNrZW5kLnNldF9yYW5raW5nX3dlaWdodHMocHRyLEpTT04uc3RyaW5naWZ5KHJhbmtpbmdXZWlnaHRzKSl9YXN5bmMgaW5pdChsYW5ndWFnZSxvcHRzKXthd2FpdCB0aGlzLmxvYWRFbnRyeSgpO2xldCBpbmRleD10aGlzLmZpbmRJbmRleChsYW5ndWFnZSk7bGV0IGxhbmdfd2FzbT1pbmRleC53YXNtP2luZGV4Lndhc206XCJ1bmtub3duXCI7dGhpcy5sb2FkZWRMYW5ndWFnZT1sYW5ndWFnZTtsZXQgcmVzb3VyY2VzPVt0aGlzLmxvYWRNZXRhKGluZGV4Lmhhc2gpXTtpZihvcHRzLmxvYWRfd2FzbT09PXRydWUpe3Jlc291cmNlcy5wdXNoKHRoaXMubG9hZFdhc20obGFuZ193YXNtKSl9YXdhaXQgUHJvbWlzZS5hbGwocmVzb3VyY2VzKTt0aGlzLnJhd19wdHI9dGhpcy5iYWNrZW5kLmluaXRfcGFnZWZpbmQobmV3IFVpbnQ4QXJyYXkodGhpcy5zZWFyY2hNZXRhKSk7aWYoT2JqZWN0LmtleXModGhpcy5tZXJnZUZpbHRlcik/Lmxlbmd0aCl7bGV0IGZpbHRlcnMyPXRoaXMuc3RyaW5naWZ5RmlsdGVycyh0aGlzLm1lcmdlRmlsdGVyKTtsZXQgcHRyPWF3YWl0IHRoaXMuZ2V0UHRyKCk7dGhpcy5yYXdfcHRyPXRoaXMuYmFja2VuZC5hZGRfc3ludGhldGljX2ZpbHRlcihwdHIsZmlsdGVyczIpfWlmKHRoaXMucmFua2luZyl7YXdhaXQgdGhpcy5zZXRfcmFua2luZyh0aGlzLnJhbmtpbmcpfX1hc3luYyBsb2FkRW50cnkoKXt0cnl7bGV0IGVudHJ5X3Jlc3BvbnNlPWF3YWl0IGZldGNoKGAke3RoaXMuYmFzZVBhdGh9cGFnZWZpbmQtZW50cnkuanNvbj90cz0ke0RhdGUubm93KCl9YCk7bGV0IGVudHJ5X2pzb249YXdhaXQgZW50cnlfcmVzcG9uc2UuanNvbigpO3RoaXMubGFuZ3VhZ2VzPWVudHJ5X2pzb24ubGFuZ3VhZ2VzO3RoaXMubG9hZGVkVmVyc2lvbj1lbnRyeV9qc29uLnZlcnNpb247dGhpcy5pbmNsdWRlQ2hhcmFjdGVycz1lbnRyeV9qc29uLmluY2x1ZGVfY2hhcmFjdGVycz8/W107aWYoZW50cnlfanNvbi52ZXJzaW9uIT09dGhpcy52ZXJzaW9uKXtpZih0aGlzLnByaW1hcnkpe2NvbnNvbGUud2FybihbXCJQYWdlZmluZCBKUyB2ZXJzaW9uIGRvZXNuJ3QgbWF0Y2ggdGhlIHZlcnNpb24gaW4geW91ciBzZWFyY2ggaW5kZXguXCIsYFBhZ2VmaW5kIEpTOiAke3RoaXMudmVyc2lvbn0uIFBhZ2VmaW5kIGluZGV4OiAke2VudHJ5X2pzb24udmVyc2lvbn1gLFwiSWYgeW91IHVwZ3JhZGVkIFBhZ2VmaW5kIHJlY2VudGx5LCB5b3UgbGlrZWx5IGhhdmUgYSBjYWNoZWQgcGFnZWZpbmQuanMgZmlsZS5cIixcIklmIHlvdSBlbmNvdW50ZXIgYW55IHNlYXJjaCBlcnJvcnMsIHRyeSBjbGVhcmluZyB5b3VyIGNhY2hlLlwiXS5qb2luKFwiXFxuXCIpKX1lbHNle2NvbnNvbGUud2FybihbXCJNZXJnaW5nIGEgUGFnZWZpbmQgaW5kZXggZnJvbSBhIGRpZmZlcmVudCB2ZXJzaW9uIHRoYW4gdGhlIG1haW4gUGFnZWZpbmQgaW5zdGFuY2UuXCIsYE1haW4gUGFnZWZpbmQgSlM6ICR7dGhpcy52ZXJzaW9ufS4gTWVyZ2VkIGluZGV4ICgke3RoaXMuYmFzZVBhdGh9KTogJHtlbnRyeV9qc29uLnZlcnNpb259YCxcIklmIHlvdSBlbmNvdW50ZXIgYW55IHNlYXJjaCBlcnJvcnMsIG1ha2Ugc3VyZSB0aGF0IGJvdGggc2l0ZXMgYXJlIHJ1bm5pbmcgdGhlIHNhbWUgdmVyc2lvbiBvZiBQYWdlZmluZC5cIl0uam9pbihcIlxcblwiKSl9fX1jYXRjaChlKXtjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gbG9hZCBQYWdlZmluZCBtZXRhZGF0YTpcbiR7ZT8udG9TdHJpbmcoKX1gKTt0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gbG9hZCBQYWdlZmluZCBtZXRhZGF0YVwiKX19ZmluZEluZGV4KGxhbmd1YWdlKXtpZih0aGlzLmxhbmd1YWdlcyl7bGV0IGluZGV4PXRoaXMubGFuZ3VhZ2VzW2xhbmd1YWdlXTtpZihpbmRleClyZXR1cm4gaW5kZXg7aW5kZXg9dGhpcy5sYW5ndWFnZXNbbGFuZ3VhZ2Uuc3BsaXQoXCItXCIpWzBdXTtpZihpbmRleClyZXR1cm4gaW5kZXg7bGV0IHRvcExhbmc9T2JqZWN0LnZhbHVlcyh0aGlzLmxhbmd1YWdlcykuc29ydCgoYSxiKT0+Yi5wYWdlX2NvdW50LWEucGFnZV9jb3VudCk7aWYodG9wTGFuZ1swXSlyZXR1cm4gdG9wTGFuZ1swXX10aHJvdyBuZXcgRXJyb3IoXCJQYWdlZmluZCBFcnJvcjogTm8gbGFuZ3VhZ2UgaW5kZXhlcyBmb3VuZC5cIil9YXN5bmMgbG9hZE1ldGEoaW5kZXgpe3RyeXtsZXQgY29tcHJlc3NlZF9yZXNwPWF3YWl0IGZldGNoKGAke3RoaXMuYmFzZVBhdGh9cGFnZWZpbmQuJHtpbmRleH0ucGZfbWV0YWApO2xldCBjb21wcmVzc2VkX21ldGE9YXdhaXQgY29tcHJlc3NlZF9yZXNwLmFycmF5QnVmZmVyKCk7dGhpcy5zZWFyY2hNZXRhPXRoaXMuZGVjb21wcmVzcyhuZXcgVWludDhBcnJheShjb21wcmVzc2VkX21ldGEpLFwiUGFnZWZpbmQgbWV0YWRhdGFcIil9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGxvYWQgdGhlIG1ldGEgaW5kZXg6XG4ke2U/LnRvU3RyaW5nKCl9YCl9fWFzeW5jIGxvYWRXYXNtKGxhbmd1YWdlKXt0cnl7Y29uc3Qgd2FzbV91cmw9YCR7dGhpcy5iYXNlUGF0aH13YXNtLiR7bGFuZ3VhZ2V9LnBhZ2VmaW5kYDtsZXQgY29tcHJlc3NlZF9yZXNwPWF3YWl0IGZldGNoKHdhc21fdXJsKTtsZXQgY29tcHJlc3NlZF93YXNtPWF3YWl0IGNvbXByZXNzZWRfcmVzcC5hcnJheUJ1ZmZlcigpO2NvbnN0IGZpbmFsX3dhc209dGhpcy5kZWNvbXByZXNzKG5ldyBVaW50OEFycmF5KGNvbXByZXNzZWRfd2FzbSksXCJQYWdlZmluZCBXZWJBc3NlbWJseVwiKTtpZighZmluYWxfd2FzbSl7dGhyb3cgbmV3IEVycm9yKFwiTm8gV0FTTSBhZnRlciBkZWNvbXByZXNzaW9uXCIpfXRoaXMud2FzbT1hd2FpdCB0aGlzLmJhY2tlbmQoZmluYWxfd2FzbSl9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGxvYWQgdGhlIFBhZ2VmaW5kIFdBU006XG4ke2U/LnRvU3RyaW5nKCl9YCk7dGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCB0aGUgUGFnZWZpbmQgV0FTTTpcbiR7ZT8udG9TdHJpbmcoKX1gKX19YXN5bmMgX2xvYWRHZW5lcmljQ2h1bmsodXJsLG1ldGhvZCl7dHJ5e2xldCBjb21wcmVzc2VkX3Jlc3A9YXdhaXQgZmV0Y2godXJsKTtsZXQgY29tcHJlc3NlZF9jaHVuaz1hd2FpdCBjb21wcmVzc2VkX3Jlc3AuYXJyYXlCdWZmZXIoKTtsZXQgY2h1bms9dGhpcy5kZWNvbXByZXNzKG5ldyBVaW50OEFycmF5KGNvbXByZXNzZWRfY2h1bmspLHVybCk7bGV0IHB0cj1hd2FpdCB0aGlzLmdldFB0cigpO3RoaXMucmF3X3B0cj10aGlzLmJhY2tlbmRbbWV0aG9kXShwdHIsY2h1bmspfWNhdGNoKGUpe2NvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBsb2FkIHRoZSBpbmRleCBjaHVuayAke3VybH06XG4ke2U/LnRvU3RyaW5nKCl9YCl9fWFzeW5jIGxvYWRDaHVuayhoYXNoKXtpZighdGhpcy5sb2FkZWRfY2h1bmtzW2hhc2hdKXtjb25zdCB1cmw9YCR7dGhpcy5iYXNlUGF0aH1pbmRleC8ke2hhc2h9LnBmX2luZGV4YDt0aGlzLmxvYWRlZF9jaHVua3NbaGFzaF09dGhpcy5fbG9hZEdlbmVyaWNDaHVuayh1cmwsXCJsb2FkX2luZGV4X2NodW5rXCIpfXJldHVybiBhd2FpdCB0aGlzLmxvYWRlZF9jaHVua3NbaGFzaF19YXN5bmMgbG9hZEZpbHRlckNodW5rKGhhc2gpe2lmKCF0aGlzLmxvYWRlZF9maWx0ZXJzW2hhc2hdKXtjb25zdCB1cmw9YCR7dGhpcy5iYXNlUGF0aH1maWx0ZXIvJHtoYXNofS5wZl9maWx0ZXJgO3RoaXMubG9hZGVkX2ZpbHRlcnNbaGFzaF09dGhpcy5fbG9hZEdlbmVyaWNDaHVuayh1cmwsXCJsb2FkX2ZpbHRlcl9jaHVua1wiKX1yZXR1cm4gYXdhaXQgdGhpcy5sb2FkZWRfZmlsdGVyc1toYXNoXX1hc3luYyBfbG9hZEZyYWdtZW50KGhhc2gpe2xldCBjb21wcmVzc2VkX3Jlc3A9YXdhaXQgZmV0Y2goYCR7dGhpcy5iYXNlUGF0aH1mcmFnbWVudC8ke2hhc2h9LnBmX2ZyYWdtZW50YCk7bGV0IGNvbXByZXNzZWRfZnJhZ21lbnQ9YXdhaXQgY29tcHJlc3NlZF9yZXNwLmFycmF5QnVmZmVyKCk7bGV0IGZyYWdtZW50PXRoaXMuZGVjb21wcmVzcyhuZXcgVWludDhBcnJheShjb21wcmVzc2VkX2ZyYWdtZW50KSxgRnJhZ21lbnQgJHtoYXNofWApO3JldHVybiBKU09OLnBhcnNlKG5ldyBUZXh0RGVjb2RlcigpLmRlY29kZShmcmFnbWVudCkpfWFzeW5jIGxvYWRGcmFnbWVudChoYXNoLHdlaWdodGVkX2xvY2F0aW9ucz1bXSxzZWFyY2hfdGVybSl7aWYoIXRoaXMubG9hZGVkX2ZyYWdtZW50c1toYXNoXSl7dGhpcy5sb2FkZWRfZnJhZ21lbnRzW2hhc2hdPXRoaXMuX2xvYWRGcmFnbWVudChoYXNoKX1sZXQgZnJhZ21lbnQ9YXdhaXQgdGhpcy5sb2FkZWRfZnJhZ21lbnRzW2hhc2hdO2ZyYWdtZW50LndlaWdodGVkX2xvY2F0aW9ucz13ZWlnaHRlZF9sb2NhdGlvbnM7ZnJhZ21lbnQubG9jYXRpb25zPXdlaWdodGVkX2xvY2F0aW9ucy5tYXAoKGwpPT5sLmxvY2F0aW9uKTtpZighZnJhZ21lbnQucmF3X2NvbnRlbnQpe2ZyYWdtZW50LnJhd19jb250ZW50PWZyYWdtZW50LmNvbnRlbnQucmVwbGFjZSgvPC9nLFwiJmx0O1wiKS5yZXBsYWNlKC8+L2csXCImZ3Q7XCIpO2ZyYWdtZW50LmNvbnRlbnQ9ZnJhZ21lbnQuY29udGVudC5yZXBsYWNlKC9cXHUyMDBCL2csXCJcIil9aWYoIWZyYWdtZW50LnJhd191cmwpe2ZyYWdtZW50LnJhd191cmw9ZnJhZ21lbnQudXJsfWZyYWdtZW50LnVybD10aGlzLnByb2Nlc3NlZFVybChmcmFnbWVudC5yYXdfdXJsLHNlYXJjaF90ZXJtKTtjb25zdCBleGNlcnB0X3N0YXJ0PWNhbGN1bGF0ZV9leGNlcnB0X3JlZ2lvbih3ZWlnaHRlZF9sb2NhdGlvbnMsdGhpcy5leGNlcnB0TGVuZ3RoKTtmcmFnbWVudC5leGNlcnB0PWJ1aWxkX2V4Y2VycHQoZnJhZ21lbnQucmF3X2NvbnRlbnQsZXhjZXJwdF9zdGFydCx0aGlzLmV4Y2VycHRMZW5ndGgsZnJhZ21lbnQubG9jYXRpb25zKTtmcmFnbWVudC5zdWJfcmVzdWx0cz1jYWxjdWxhdGVfc3ViX3Jlc3VsdHMoZnJhZ21lbnQsdGhpcy5leGNlcnB0TGVuZ3RoKTtyZXR1cm4gZnJhZ21lbnR9ZnVsbFVybChyYXcpe2lmKC9eKGh0dHBzPzopP1xcL1xcLy8udGVzdChyYXcpKXtyZXR1cm4gcmF3fXJldHVybmAke3RoaXMuYmFzZVVybH0vJHtyYXd9YC5yZXBsYWNlKC9cXC8rL2csXCIvXCIpLnJlcGxhY2UoL14oaHR0cHM/OlxcLykvLFwiJDEvXCIpfXByb2Nlc3NlZFVybCh1cmwsc2VhcmNoX3Rlcm0pe2NvbnN0IG5vcm1hbGl6ZWQ9dGhpcy5mdWxsVXJsKHVybCk7aWYodGhpcy5oaWdobGlnaHRQYXJhbT09PW51bGwpe3JldHVybiBub3JtYWxpemVkfWxldCBpbmRpdmlkdWFsX3Rlcm1zPXNlYXJjaF90ZXJtLnNwbGl0KC9cXHMrLyk7dHJ5e2xldCBwcm9jZXNzZWQ9bmV3IFVSTChub3JtYWxpemVkKTtmb3IoY29uc3QgdGVybSBvZiBpbmRpdmlkdWFsX3Rlcm1zKXtwcm9jZXNzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCh0aGlzLmhpZ2hsaWdodFBhcmFtLHRlcm0pfXJldHVybiBwcm9jZXNzZWQudG9TdHJpbmcoKX1jYXRjaChlKXt0cnl7bGV0IHByb2Nlc3NlZD1uZXcgVVJMKGBodHRwczovL2V4YW1wbGUuY29tJHtub3JtYWxpemVkfWApO2Zvcihjb25zdCB0ZXJtIG9mIGluZGl2aWR1YWxfdGVybXMpe3Byb2Nlc3NlZC5zZWFyY2hQYXJhbXMuYXBwZW5kKHRoaXMuaGlnaGxpZ2h0UGFyYW0sdGVybSl9cmV0dXJuIHByb2Nlc3NlZC50b1N0cmluZygpLnJlcGxhY2UoL15odHRwczpcXC9cXC9leGFtcGxlXFwuY29tLyxcIlwiKX1jYXRjaChlMil7cmV0dXJuIG5vcm1hbGl6ZWR9fX1hc3luYyBnZXRQdHIoKXt3aGlsZSh0aGlzLnJhd19wdHI9PT1udWxsKXthd2FpdCBhc3luY1NsZWVwKDUwKX1pZighdGhpcy5yYXdfcHRyKXtjb25zb2xlLmVycm9yKFwiUGFnZWZpbmQ6IFdBU00gRXJyb3IgKE5vIHBvaW50ZXIpXCIpO3Rocm93IG5ldyBFcnJvcihcIlBhZ2VmaW5kOiBXQVNNIEVycm9yIChObyBwb2ludGVyKVwiKX1yZXR1cm4gdGhpcy5yYXdfcHRyfXN0cmluZ2lmeUZpbHRlcnMob2JqPXt9KXtyZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKX1zdHJpbmdpZnlTb3J0cyhvYmo9e30pe2xldCBzb3J0cz1PYmplY3QuZW50cmllcyhvYmopO2ZvcihsZXRbc29ydCxkaXJlY3Rpb25db2Ygc29ydHMpe2lmKHNvcnRzLmxlbmd0aD4xKXtjb25zb2xlLndhcm4oYFBhZ2VmaW5kIHdhcyBwcm92aWRlZCBtdWx0aXBsZSBzb3J0IG9wdGlvbnMgaW4gdGhpcyBzZWFyY2gsIGJ1dCBjYW4gb25seSBvcGVyYXRlIG9uIG9uZS4gVXNpbmcgdGhlICR7c29ydH0gc29ydC5gKX1pZihkaXJlY3Rpb24hPT1cImFzY1wiJiZkaXJlY3Rpb24hPT1cImRlc2NcIil7Y29uc29sZS53YXJuKGBQYWdlZmluZCB3YXMgcHJvdmlkZWQgYSBzb3J0IHdpdGggdW5rbm93biBkaXJlY3Rpb24gJHtkaXJlY3Rpb259LiBTdXBwb3J0ZWQ6IFthc2MsIGRlc2NdYCl9cmV0dXJuYCR7c29ydH06JHtkaXJlY3Rpb259YH1yZXR1cm5gYH1hc3luYyBmaWx0ZXJzKCl7bGV0IHB0cj1hd2FpdCB0aGlzLmdldFB0cigpO2xldCBmaWx0ZXJzMj10aGlzLmJhY2tlbmQucmVxdWVzdF9hbGxfZmlsdGVyX2luZGV4ZXMocHRyKTtsZXQgZmlsdGVyX2FycmF5PUpTT04ucGFyc2UoZmlsdGVyczIpO2lmKEFycmF5LmlzQXJyYXkoZmlsdGVyX2FycmF5KSl7bGV0IGZpbHRlcl9jaHVua3M9ZmlsdGVyX2FycmF5LmZpbHRlcigodik9PnYpLm1hcCgoY2h1bmspPT50aGlzLmxvYWRGaWx0ZXJDaHVuayhjaHVuaykpO2F3YWl0IFByb21pc2UuYWxsKFsuLi5maWx0ZXJfY2h1bmtzXSl9cHRyPWF3YWl0IHRoaXMuZ2V0UHRyKCk7bGV0IHJlc3VsdHM9dGhpcy5iYWNrZW5kLmZpbHRlcnMocHRyKTtyZXR1cm4gSlNPTi5wYXJzZShyZXN1bHRzKX1hc3luYyBwcmVsb2FkKHRlcm0sb3B0aW9uczI9e30pe2F3YWl0IHRoaXMuc2VhcmNoKHRlcm0sey4uLm9wdGlvbnMyLHByZWxvYWQ6dHJ1ZX0pfWFzeW5jIHNlYXJjaCh0ZXJtLG9wdGlvbnMyPXt9KXtvcHRpb25zMj17dmVyYm9zZTpmYWxzZSxmaWx0ZXJzOnt9LHNvcnQ6e30sLi4ub3B0aW9uczJ9O2NvbnN0IGxvZz0oc3RyKT0+e2lmKG9wdGlvbnMyLnZlcmJvc2UpY29uc29sZS5sb2coc3RyKX07bG9nKGBTdGFydGluZyBzZWFyY2ggb24gJHt0aGlzLmJhc2VQYXRofWApO2xldCBzdGFydD1EYXRlLm5vdygpO2xldCBwdHI9YXdhaXQgdGhpcy5nZXRQdHIoKTtsZXQgZmlsdGVyX29ubHk9dGVybT09PW51bGw7dGVybT10ZXJtPz9cIlwiO2xldCBleGFjdF9zZWFyY2g9L15cXHMqXCIuK1wiXFxzKiQvLnRlc3QodGVybSk7aWYoZXhhY3Rfc2VhcmNoKXtsb2coYFJ1bm5pbmcgYW4gZXhhY3Qgc2VhcmNoYCl9bGV0IHRydWVMYW5ndWFnZT1udWxsO3RyeXt0cnVlTGFuZ3VhZ2U9SW50bC5nZXRDYW5vbmljYWxMb2NhbGVzKHRoaXMubG9hZGVkTGFuZ3VhZ2UpWzBdfWNhdGNoKGVycjIpe31jb25zdCB0ZXJtX2NodW5rcz1bXTtsZXQgc2VnbWVudHM7aWYodHJ1ZUxhbmd1YWdlJiZ0eXBlb2YgSW50bC5TZWdtZW50ZXIhPT1cInVuZGVmaW5lZFwiKXtjb25zdCBzZWdtZW50ZXI9bmV3IEludGwuU2VnbWVudGVyKHRydWVMYW5ndWFnZSx7Z3JhbnVsYXJpdHk6XCJncmFwaGVtZVwifSk7c2VnbWVudHM9Wy4uLnNlZ21lbnRlci5zZWdtZW50KHRlcm0pXS5tYXAoKHtzZWdtZW50fSk9PnNlZ21lbnQpfWVsc2V7c2VnbWVudHM9Wy4uLnRlcm1dfWZvcihjb25zdCBzZWdtZW50IG9mIHNlZ21lbnRzKXtpZih0aGlzLmluY2x1ZGVDaGFyYWN0ZXJzPy5pbmNsdWRlcyhzZWdtZW50KSl7dGVybV9jaHVua3MucHVzaChzZWdtZW50KX1lbHNlIGlmKCEvXlxccHtQZH18XFxwe1BlfXxcXHB7UGZ9fFxccHtQaX18XFxwe1BvfXxcXHB7UHN9JC91LnRlc3Qoc2VnbWVudCkpe3Rlcm1fY2h1bmtzLnB1c2goc2VnbWVudC50b0xvY2FsZUxvd2VyQ2FzZSgpKX19dGVybT10ZXJtX2NodW5rcy5qb2luKFwiXCIpLnJlcGxhY2UoL1xcc3syLH0vZyxcIiBcIikudHJpbSgpO2xvZyhgTm9ybWFsaXplZCBzZWFyY2ggdGVybSB0byAke3Rlcm19YCk7aWYoIXRlcm0/Lmxlbmd0aCYmIWZpbHRlcl9vbmx5KXtyZXR1cm57cmVzdWx0czpbXSx1bmZpbHRlcmVkUmVzdWx0Q291bnQ6MCxmaWx0ZXJzOnt9LHRvdGFsRmlsdGVyczp7fSx0aW1pbmdzOntwcmVsb2FkOkRhdGUubm93KCktc3RhcnQsc2VhcmNoOkRhdGUubm93KCktc3RhcnQsdG90YWw6RGF0ZS5ub3coKS1zdGFydH19fWxldCBzb3J0X2xpc3Q9dGhpcy5zdHJpbmdpZnlTb3J0cyhvcHRpb25zMi5zb3J0KTtsb2coYFN0cmluZ2lmaWVkIHNvcnQgdG8gJHtzb3J0X2xpc3R9YCk7Y29uc3QgZmlsdGVyX2xpc3Q9dGhpcy5zdHJpbmdpZnlGaWx0ZXJzKG9wdGlvbnMyLmZpbHRlcnMpO2xvZyhgU3RyaW5naWZpZWQgZmlsdGVycyB0byAke2ZpbHRlcl9saXN0fWApO2xldCBpbmRleF9yZXNwPXRoaXMuYmFja2VuZC5yZXF1ZXN0X2luZGV4ZXMocHRyLHRlcm0pO2xldCBpbmRleF9hcnJheT1KU09OLnBhcnNlKGluZGV4X3Jlc3ApO2xldCBmaWx0ZXJfcmVzcD10aGlzLmJhY2tlbmQucmVxdWVzdF9maWx0ZXJfaW5kZXhlcyhwdHIsZmlsdGVyX2xpc3QpO2xldCBmaWx0ZXJfYXJyYXk9SlNPTi5wYXJzZShmaWx0ZXJfcmVzcCk7bGV0IGNodW5rcz1pbmRleF9hcnJheS5maWx0ZXIoKHYpPT52KS5tYXAoKGNodW5rKT0+dGhpcy5sb2FkQ2h1bmsoY2h1bmspKTtsZXQgZmlsdGVyX2NodW5rcz1maWx0ZXJfYXJyYXkuZmlsdGVyKCh2KT0+dikubWFwKChjaHVuayk9PnRoaXMubG9hZEZpbHRlckNodW5rKGNodW5rKSk7YXdhaXQgUHJvbWlzZS5hbGwoWy4uLmNodW5rcywuLi5maWx0ZXJfY2h1bmtzXSk7bG9nKGBMb2FkZWQgbmVjZXNzYXJ5IGNodW5rcyB0byBydW4gc2VhcmNoYCk7aWYob3B0aW9uczIucHJlbG9hZCl7bG9nKGBQcmVsb2FkIFxcdTIwMTQgYmFpbGluZyBvdXQgb2Ygc2VhcmNoIG9wZXJhdGlvbiBub3cuYCk7cmV0dXJuIG51bGx9cHRyPWF3YWl0IHRoaXMuZ2V0UHRyKCk7bGV0IHNlYXJjaFN0YXJ0PURhdGUubm93KCk7bGV0IHJlc3VsdD10aGlzLmJhY2tlbmQuc2VhcmNoKHB0cix0ZXJtLGZpbHRlcl9saXN0LHNvcnRfbGlzdCxleGFjdF9zZWFyY2gpO2xvZyhgR290IHRoZSByYXcgc2VhcmNoIHJlc3VsdDogJHtyZXN1bHR9YCk7bGV0e2ZpbHRlcmVkX2NvdW50cyx0b3RhbF9jb3VudHMscmVzdWx0cyx1bmZpbHRlcmVkX3RvdGFsLHNlYXJjaF9rZXl3b3Jkc309SlNPTi5wYXJzZShyZXN1bHQpO2xldCByZXN1bHRzSW50ZXJmYWNlPXJlc3VsdHMubWFwKChyZXN1bHQyKT0+e2xldCB3ZWlnaHRlZF9sb2NhdGlvbnM9cmVzdWx0Mi5sLm1hcCgobCk9PntsZXQgbG9jPXt3ZWlnaHQ6bC53LzI0LGJhbGFuY2VkX3Njb3JlOmwucyxsb2NhdGlvbjpsLmx9O2lmKGwudil7bG9jLnZlcmJvc2U9e3dvcmRfc3RyaW5nOmwudi53cyxsZW5ndGhfYm9udXM6bC52LmxifX1yZXR1cm4gbG9jfSk7bGV0IGxvY2F0aW9ucz13ZWlnaHRlZF9sb2NhdGlvbnMubWFwKChsKT0+bC5sb2NhdGlvbik7bGV0IHJlcz17aWQ6cmVzdWx0Mi5wLHNjb3JlOnJlc3VsdDIucyp0aGlzLmluZGV4V2VpZ2h0LHdvcmRzOmxvY2F0aW9ucyxkYXRhOmFzeW5jKCk9PmF3YWl0IHRoaXMubG9hZEZyYWdtZW50KHJlc3VsdDIucCx3ZWlnaHRlZF9sb2NhdGlvbnMsdGVybSl9O2lmKHJlc3VsdDIucGFyYW1zKXtyZXMucGFyYW1zPXtkb2N1bWVudF9sZW5ndGg6cmVzdWx0Mi5wYXJhbXMuZGwsYXZlcmFnZV9wYWdlX2xlbmd0aDpyZXN1bHQyLnBhcmFtcy5hcGwsdG90YWxfcGFnZXM6cmVzdWx0Mi5wYXJhbXMudHB9fWlmKHJlc3VsdDIuc2NvcmVzKXtyZXMuc2NvcmVzPXJlc3VsdDIuc2NvcmVzLm1hcCgocik9PntyZXR1cm57c2VhcmNoX3Rlcm06ci53LGlkZjpyLmlkZixzYXR1cmF0aW5nX3RmOnIuYl90ZixyYXdfdGY6ci5yX3RmLHBhZ2VmaW5kX3RmOnIucF90ZixzY29yZTpyLnMscGFyYW1zOnt3ZWlnaHRlZF90ZXJtX2ZyZXF1ZW5jeTpyLnBhcmFtcy53X3RmLHBhZ2VzX2NvbnRhaW5pbmdfdGVybTpyLnBhcmFtcy5wY3QsbGVuZ3RoX2JvbnVzOnIucGFyYW1zLmxifX19KX1yZXR1cm4gcmVzfSk7Y29uc3Qgc2VhcmNoVGltZT1EYXRlLm5vdygpLXNlYXJjaFN0YXJ0O2NvbnN0IHJlYWxUaW1lPURhdGUubm93KCktc3RhcnQ7bG9nKGBGb3VuZCAke3Jlc3VsdHMubGVuZ3RofSByZXN1bHQke3Jlc3VsdHMubGVuZ3RoID09IDEgPyBcIlwiIDogXCJzXCJ9IGZvciBcIiR7dGVybX1cIiBpbiAke0RhdGUubm93KCkgLSBzZWFyY2hTdGFydH1tcyAoJHtEYXRlLm5vdygpIC0gc3RhcnR9bXMgcmVhbHRpbWUpYCk7bGV0IHJlc3BvbnNlPXtyZXN1bHRzOnJlc3VsdHNJbnRlcmZhY2UsdW5maWx0ZXJlZFJlc3VsdENvdW50OnVuZmlsdGVyZWRfdG90YWwsZmlsdGVyczpmaWx0ZXJlZF9jb3VudHMsdG90YWxGaWx0ZXJzOnRvdGFsX2NvdW50cyx0aW1pbmdzOntwcmVsb2FkOnJlYWxUaW1lLXNlYXJjaFRpbWUsc2VhcmNoOnNlYXJjaFRpbWUsdG90YWw6cmVhbFRpbWV9fTtpZihzZWFyY2hfa2V5d29yZHMpe3Jlc3BvbnNlLnNlYXJjaF9rZXl3b3Jkcz1zZWFyY2hfa2V5d29yZHN9cmV0dXJuIHJlc3BvbnNlfX07dmFyIFBhZ2VmaW5kPWNsYXNze2NvbnN0cnVjdG9yKG9wdGlvbnMyPXt9KXt0aGlzLmJhY2tlbmQ9d2FzbV9iaW5kZ2VuO3RoaXMucHJpbWFyeUxhbmd1YWdlPVwidW5rbm93blwiO3RoaXMuc2VhcmNoSUQ9MDt0aGlzLnByaW1hcnk9bmV3IFBhZ2VmaW5kSW5zdGFuY2Uoey4uLm9wdGlvbnMyLHByaW1hcnk6dHJ1ZX0pO3RoaXMuaW5zdGFuY2VzPVt0aGlzLnByaW1hcnldO3RoaXMuaW5pdChvcHRpb25zMj8ubGFuZ3VhZ2UpfWFzeW5jIG9wdGlvbnMob3B0aW9uczIpe2F3YWl0IHRoaXMucHJpbWFyeS5vcHRpb25zKG9wdGlvbnMyKX1hc3luYyBlbnRlclBsYXlncm91bmRNb2RlKCl7YXdhaXQgdGhpcy5wcmltYXJ5LmVudGVyUGxheWdyb3VuZE1vZGUoKX1hc3luYyBpbml0KG92ZXJyaWRlTGFuZ3VhZ2Upe2lmKGlzQnJvd3NlciYmZG9jdW1lbnQ/LnF1ZXJ5U2VsZWN0b3Ipe2NvbnN0IGxhbmdDb2RlPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJodG1sXCIpPy5nZXRBdHRyaWJ1dGUoXCJsYW5nXCIpfHxcInVua25vd25cIjt0aGlzLnByaW1hcnlMYW5ndWFnZT1sYW5nQ29kZS50b0xvY2FsZUxvd2VyQ2FzZSgpfWF3YWl0IHRoaXMucHJpbWFyeS5pbml0KG92ZXJyaWRlTGFuZ3VhZ2U/b3ZlcnJpZGVMYW5ndWFnZTp0aGlzLnByaW1hcnlMYW5ndWFnZSx7bG9hZF93YXNtOnRydWV9KX1hc3luYyBtZXJnZUluZGV4KGluZGV4UGF0aCxvcHRpb25zMj17fSl7aWYodGhpcy5wcmltYXJ5LmJhc2VQYXRoLnN0YXJ0c1dpdGgoaW5kZXhQYXRoKSl7Y29uc29sZS53YXJuKGBTa2lwcGluZyBtZXJnZUluZGV4ICR7aW5kZXhQYXRofSB0aGF0IGFwcGVhcnMgdG8gYmUgdGhlIHNhbWUgYXMgdGhlIHByaW1hcnkgaW5kZXggKCR7dGhpcy5wcmltYXJ5LmJhc2VQYXRofSlgKTtyZXR1cm59bGV0IG5ld0luc3RhbmNlPW5ldyBQYWdlZmluZEluc3RhbmNlKHtwcmltYXJ5OmZhbHNlLGJhc2VQYXRoOmluZGV4UGF0aH0pO3RoaXMuaW5zdGFuY2VzLnB1c2gobmV3SW5zdGFuY2UpO3doaWxlKHRoaXMucHJpbWFyeS53YXNtPT09bnVsbCl7YXdhaXQgYXN5bmNTbGVlcCg1MCl9YXdhaXQgbmV3SW5zdGFuY2UuaW5pdChvcHRpb25zMi5sYW5ndWFnZXx8dGhpcy5wcmltYXJ5TGFuZ3VhZ2Use2xvYWRfd2FzbTpmYWxzZX0pO2RlbGV0ZSBvcHRpb25zMltcImxhbmd1YWdlXCJdO2F3YWl0IG5ld0luc3RhbmNlLm9wdGlvbnMob3B0aW9uczIpfW1lcmdlRmlsdGVycyhmaWx0ZXJzMil7Y29uc3QgbWVyZ2VkPXt9O2Zvcihjb25zdCBzZWFyY2hGaWx0ZXIgb2YgZmlsdGVyczIpe2Zvcihjb25zdFtmaWx0ZXJLZXksdmFsdWVzXW9mIE9iamVjdC5lbnRyaWVzKHNlYXJjaEZpbHRlcikpe2lmKCFtZXJnZWRbZmlsdGVyS2V5XSl7bWVyZ2VkW2ZpbHRlcktleV09dmFsdWVzO2NvbnRpbnVlfWVsc2V7Y29uc3QgZmlsdGVyPW1lcmdlZFtmaWx0ZXJLZXldO2Zvcihjb25zdFt2YWx1ZUtleSxjb3VudF1vZiBPYmplY3QuZW50cmllcyh2YWx1ZXMpKXtmaWx0ZXJbdmFsdWVLZXldPShmaWx0ZXJbdmFsdWVLZXldfHwwKStjb3VudH19fX1yZXR1cm4gbWVyZ2VkfWFzeW5jIGZpbHRlcnMoKXtsZXQgZmlsdGVyczI9YXdhaXQgUHJvbWlzZS5hbGwodGhpcy5pbnN0YW5jZXMubWFwKChpMik9PmkyLmZpbHRlcnMoKSkpO3JldHVybiB0aGlzLm1lcmdlRmlsdGVycyhmaWx0ZXJzMil9YXN5bmMgcHJlbG9hZCh0ZXJtLG9wdGlvbnMyPXt9KXthd2FpdCBQcm9taXNlLmFsbCh0aGlzLmluc3RhbmNlcy5tYXAoKGkyKT0+aTIucHJlbG9hZCh0ZXJtLG9wdGlvbnMyKSkpfWFzeW5jIGRlYm91bmNlZFNlYXJjaCh0ZXJtLG9wdGlvbnMyLGRlYm91bmNlVGltZW91dE1zKXtjb25zdCB0aGlzU2VhcmNoSUQ9Kyt0aGlzLnNlYXJjaElEO3RoaXMucHJlbG9hZCh0ZXJtLG9wdGlvbnMyKTthd2FpdCBhc3luY1NsZWVwKGRlYm91bmNlVGltZW91dE1zKTtpZih0aGlzU2VhcmNoSUQhPT10aGlzLnNlYXJjaElEKXtyZXR1cm4gbnVsbH1jb25zdCBzZWFyY2hSZXN1bHQ9YXdhaXQgdGhpcy5zZWFyY2godGVybSxvcHRpb25zMik7aWYodGhpc1NlYXJjaElEIT09dGhpcy5zZWFyY2hJRCl7cmV0dXJuIG51bGx9cmV0dXJuIHNlYXJjaFJlc3VsdH1hc3luYyBzZWFyY2godGVybSxvcHRpb25zMj17fSl7bGV0IHNlYXJjaDI9YXdhaXQgUHJvbWlzZS5hbGwodGhpcy5pbnN0YW5jZXMubWFwKChpMik9PmkyLnNlYXJjaCh0ZXJtLG9wdGlvbnMyKSkpO2NvbnN0IGZpbHRlcnMyPXRoaXMubWVyZ2VGaWx0ZXJzKHNlYXJjaDIubWFwKChzKT0+cy5maWx0ZXJzKSk7Y29uc3QgdG90YWxGaWx0ZXJzPXRoaXMubWVyZ2VGaWx0ZXJzKHNlYXJjaDIubWFwKChzKT0+cy50b3RhbEZpbHRlcnMpKTtjb25zdCByZXN1bHRzPXNlYXJjaDIubWFwKChzKT0+cy5yZXN1bHRzKS5mbGF0KCkuc29ydCgoYSxiKT0+Yi5zY29yZS1hLnNjb3JlKTtjb25zdCB0aW1pbmdzPXNlYXJjaDIubWFwKChzKT0+cy50aW1pbmdzKTtjb25zdCB1bmZpbHRlcmVkUmVzdWx0Q291bnQ9c2VhcmNoMi5yZWR1Y2UoKHN1bSxzKT0+c3VtK3MudW5maWx0ZXJlZFJlc3VsdENvdW50LDApO2xldCByZXNwb25zZT17cmVzdWx0cyx1bmZpbHRlcmVkUmVzdWx0Q291bnQsZmlsdGVyczpmaWx0ZXJzMix0b3RhbEZpbHRlcnMsdGltaW5nc307aWYoc2VhcmNoMlswXS5zZWFyY2hfa2V5d29yZHMpe3Jlc3BvbnNlLnNlYXJjaF9rZXl3b3Jkcz1zZWFyY2gyWzBdLnNlYXJjaF9rZXl3b3Jkc31yZXR1cm4gcmVzcG9uc2V9fTt2YXIgcGFnZWZpbmQ9dm9pZCAwO3ZhciBpbml0aWFsX29wdGlvbnM9dm9pZCAwO3ZhciBpbml0X3BhZ2VmaW5kPSgpPT57aWYoIXBhZ2VmaW5kKXtwYWdlZmluZD1uZXcgUGFnZWZpbmQoaW5pdGlhbF9vcHRpb25zPz97fSl9fTt2YXIgb3B0aW9ucz1hc3luYyhuZXdfb3B0aW9ucyk9PntpZihwYWdlZmluZCl7YXdhaXQgcGFnZWZpbmQub3B0aW9ucyhuZXdfb3B0aW9ucyl9ZWxzZXtpbml0aWFsX29wdGlvbnM9bmV3X29wdGlvbnN9fTt2YXIgaW5pdD1hc3luYygpPT57aW5pdF9wYWdlZmluZCgpfTt2YXIgZGVzdHJveT1hc3luYygpPT57cGFnZWZpbmQ9dm9pZCAwO2luaXRpYWxfb3B0aW9ucz12b2lkIDB9O3ZhciBtZXJnZUluZGV4PWFzeW5jKGluZGV4UGF0aCxvcHRpb25zMik9Pntpbml0X3BhZ2VmaW5kKCk7cmV0dXJuIGF3YWl0IHBhZ2VmaW5kLm1lcmdlSW5kZXgoaW5kZXhQYXRoLG9wdGlvbnMyKX07dmFyIHNlYXJjaD1hc3luYyh0ZXJtLG9wdGlvbnMyKT0+e2luaXRfcGFnZWZpbmQoKTtyZXR1cm4gYXdhaXQgcGFnZWZpbmQuc2VhcmNoKHRlcm0sb3B0aW9uczIpfTt2YXIgZGVib3VuY2VkU2VhcmNoPWFzeW5jKHRlcm0sb3B0aW9uczIsZGVib3VuY2VUaW1lb3V0TXM9MzAwKT0+e2luaXRfcGFnZWZpbmQoKTtyZXR1cm4gYXdhaXQgcGFnZWZpbmQuZGVib3VuY2VkU2VhcmNoKHRlcm0sb3B0aW9uczIsZGVib3VuY2VUaW1lb3V0TXMpfTt2YXIgcHJlbG9hZD1hc3luYyh0ZXJtLG9wdGlvbnMyKT0+e2luaXRfcGFnZWZpbmQoKTtyZXR1cm4gYXdhaXQgcGFnZWZpbmQucHJlbG9hZCh0ZXJtLG9wdGlvbnMyKX07dmFyIGZpbHRlcnM9YXN5bmMoKT0+e2luaXRfcGFnZWZpbmQoKTtyZXR1cm4gYXdhaXQgcGFnZWZpbmQuZmlsdGVycygpfTtleHBvcnR7ZGVib3VuY2VkU2VhcmNoLGRlc3Ryb3ksZmlsdGVycyxpbml0LG1lcmdlSW5kZXgsb3B0aW9ucyxwcmVsb2FkLHNlYXJjaH0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLDJCQUEyQixDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsMkJBQTJCLENBQUMsc0JBQXNCLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRO0FBQ3BrcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLO0FBQ25zQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJO0FBQ3ZjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJO0FBQ3BFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUNoVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLHFCQUFxQixDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0ifQ==
