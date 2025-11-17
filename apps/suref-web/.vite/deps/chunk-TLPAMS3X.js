// ../../node_modules/.bun/@randsum+roller@0.27.0/node_modules/@randsum/roller/dist/index.js
function B(t, { greaterThan: o, lessThan: r, exact: e }) {
  if (e?.includes(t)) return true;
  if (o !== void 0 && t > o) return true;
  if (r !== void 0 && t < r) return true;
  return false;
}
function d(t) {
  if (!t.length) return "";
  if (t.length === 1) return `[${t[0]}]`;
  let o = t.map((e) => `[${e}]`), r = o.pop();
  return `${o.join(" ")} and ${r}`;
}
function D({ greaterThan: t, lessThan: o, exact: r }) {
  let e = [];
  if (r?.length) e.push(d(r));
  if (t !== void 0) e.push(`greater than [${t}]`);
  if (o !== void 0) e.push(`less than [${o}]`);
  return e;
}
function y({ greaterThan: t, lessThan: o, exact: r }) {
  let e = [];
  if (r?.length) e.push(...r.map(String));
  if (t !== void 0) e.push(`>${t}`);
  if (o !== void 0) e.push(`<${o}`);
  return e;
}
function P(t, { greaterThan: o, lessThan: r }, e) {
  let n = t;
  if (o !== void 0 && n > o) n = e ?? o;
  if (r !== void 0 && n < r) n = e ?? r;
  return n;
}
function Y({ highest: t, lowest: o, greaterThan: r, lessThan: e, exact: n }) {
  let i = [];
  if (t) if (t > 1) i.push(`Drop highest ${t}`);
  else i.push("Drop highest");
  if (o) if (o > 1) i.push(`Drop lowest ${o}`);
  else i.push("Drop lowest");
  if (n) i.push(`Drop ${d(n)}`);
  if (r !== void 0) i.push(`Drop greater than [${r}]`);
  if (e !== void 0) i.push(`Drop less than [${e}]`);
  return i;
}
function Z({ exact: t, greaterThan: o, lessThan: r, max: e }) {
  let n = [];
  if (t) t.forEach((c) => n.push(`${c}`));
  let i = [];
  if (o !== void 0) i.push(`greater than [${o}]`);
  if (r !== void 0) i.push(`less than [${r}]`);
  let s = d(n.map(Number)), p = i.join(" and "), m = [s, p].filter(Boolean).join(", ");
  if (!m) return [];
  let a = e !== void 0 ? ` (up to ${e} times)` : "";
  return [`Reroll ${m}${a}`];
}
function v(t) {
  return (Array.isArray(t) ? t : [t]).map(({ from: r, to: e }) => {
    if (typeof r === "object") return `Replace ${D(r).join(" and ")} with [${e}]`;
    return `Replace [${r}] with [${e}]`;
  });
}
var tt = /* @__PURE__ */ new Map([["plus", (t) => [`Add ${t}`]], ["minus", (t) => [`Subtract ${t}`]], ["cap", (t) => D(t).map((o) => `No Rolls ${o}`)], ["drop", (t) => Y(t)], ["reroll", (t) => Z(t)], ["explode", () => ["Exploding Dice"]], ["unique", (t) => {
  if (typeof t === "boolean") return ["No Duplicate Rolls"];
  return [`No Duplicates (except ${d(t.notUnique)})`];
}], ["replace", (t) => v(t)]]);
function W(t, o) {
  if (o === void 0) return;
  let r = tt.get(t);
  return r ? r(o) : void 0;
}
function ot({ highest: t, lowest: o, greaterThan: r, lessThan: e, exact: n }) {
  let i = [];
  if (t) i.push(t === 1 ? "H" : `H${t}`);
  if (o) i.push(o === 1 ? "L" : `L${o}`);
  let s = [];
  if (r !== void 0) s.push(`>${r}`);
  if (e !== void 0) s.push(`<${e}`);
  if (n) n.forEach((p) => s.push(`${p}`));
  if (s.length > 0) i.push(`D{${s.join(",")}}`);
  return i.length ? i.join("") : void 0;
}
function rt(t) {
  let o = y(t);
  if (!o.length) return;
  let r = t.max ? `${t.max}` : "";
  return `R{${o.join(",")}}${r}`;
}
function et(t) {
  let r = (Array.isArray(t) ? t : [t]).map(({ from: e, to: n }) => {
    if (typeof e === "object") return y(e).map((s) => `${s}=${n}`).join(",");
    return `${e}=${n}`;
  });
  return r.length ? `V{${r.join(",")}}` : void 0;
}
var it = /* @__PURE__ */ new Map([["plus", (t) => {
  let o = t;
  if (o < 0) return `-${Math.abs(o)}`;
  return `+${o}`;
}], ["minus", (t) => `-${t}`], ["cap", (t) => {
  let o = y(t);
  return o.length ? `C{${o.join(",")}}` : void 0;
}], ["drop", (t) => ot(t)], ["reroll", (t) => rt(t)], ["explode", () => "!"], ["unique", (t) => {
  if (typeof t === "boolean") return "U";
  return `U{${t.notUnique.join(",")}}`;
}], ["replace", (t) => et(t)]]);
function _(t, o) {
  if (o === void 0) return;
  let r = it.get(t);
  return r ? r(o) : void 0;
}
function nt(t, o) {
  return t.map((r) => P(r, o));
}
function st(t, o) {
  let { highest: r, lowest: e, greaterThan: n, lessThan: i, exact: s } = o, p = s ? new Set(s) : null, m = t.filter((a) => {
    if (n !== void 0 && a > n) return false;
    if (i !== void 0 && a < i) return false;
    if (p?.has(a)) return false;
    return true;
  });
  if (r !== void 0 || e !== void 0) {
    let a = m.map((f, l) => ({ roll: f, index: l }));
    a.sort((f, l) => f.roll - l.roll);
    let c = /* @__PURE__ */ new Set();
    if (e !== void 0) for (let f = 0; f < Math.min(e, a.length); f++) {
      let l = a[f];
      if (l) c.add(l.index);
    }
    if (r !== void 0) for (let f = a.length - 1; f >= Math.max(0, a.length - r); f--) {
      let l = a[f];
      if (l) c.add(l.index);
    }
    if (m = m.filter((f, l) => !c.has(l)), e !== void 0 && r === void 0) m.sort((f, l) => f - l);
  }
  return m;
}
function pt(t, { sides: o }, r) {
  let e = 0;
  for (let i of t) if (i === o) e++;
  if (e === 0) return t;
  let n = [...t];
  for (let i = 0; i < e; i++) n.push(r());
  return n;
}
function mt(t, o) {
  let r = Array.isArray(o) ? o : [o], e = [...t];
  for (let { from: n, to: i } of r) e = e.map((s) => {
    if (typeof n === "object") return P(s, n, i);
    else return s === n ? i : s;
  });
  return e;
}
function at(t, o, r) {
  let { max: e } = o, n = 0;
  return t.map((i) => {
    if (e !== void 0 && n >= e) return i;
    let s = ft(i, o, r);
    if (s !== i) n++;
    return s;
  });
}
function ft(t, o, r, e = 0) {
  if (e >= 99) return t;
  if (B(t, o)) return ft(r(), o, r, e + 1);
  return t;
}
function ct(t, o, { sides: r }, e) {
  if (t.length > r) throw Error("Cannot have more rolls than sides when unique is enabled");
  let n = typeof o === "object" ? o.notUnique : [], i = new Set(n), s = /* @__PURE__ */ new Set(), p = [];
  for (let m of t) if (i.has(m) || !s.has(m)) p.push(m), s.add(m);
  else {
    let a, c = 0, f = r * 10;
    do
      if (a = e(), c++, c > f) {
        a = m;
        break;
      }
    while (s.has(a) && !i.has(a));
    p.push(a), s.add(a);
  }
  return p;
}
function F(t) {
  let o = /* @__PURE__ */ new Map();
  for (let r of t) o.set(r, (o.get(r) ?? 0) + 1);
  return o;
}
function h(t, o, r, e) {
  let n = { modifier: t, options: o };
  if (r === e) return { ...n, added: [], removed: [] };
  if (r.length === 0) return { ...n, added: [...e], removed: [] };
  if (e.length === 0) return { ...n, added: [], removed: [...r] };
  let i = F(r), s = F(e), p = [], m = [], a = /* @__PURE__ */ new Set([...r, ...e]);
  for (let c of a) {
    let f = i.get(c) ?? 0, I = (s.get(c) ?? 0) - f;
    if (I > 0) for (let b = 0; b < I; b++) p.push(c);
    else if (I < 0) for (let b = 0; b < Math.abs(I); b++) m.push(c);
  }
  return { ...n, added: p, removed: m };
}
function O(t, o) {
  return [...t, o];
}
var lt = /* @__PURE__ */ new Map([["plus", (t, o) => ({ rolls: t.rolls, simpleMathModifier: Number(o), logs: t.logs })], ["minus", (t, o) => ({ rolls: t.rolls, simpleMathModifier: -Number(o), logs: t.logs })], ["cap", (t, o) => {
  let r = [...t.rolls], e = nt(t.rolls, o), n = h("cap", o, r, e);
  return { rolls: e, simpleMathModifier: t.simpleMathModifier, logs: O(t.logs, n) };
}], ["drop", (t, o) => {
  let r = [...t.rolls], e = st(t.rolls, o), n = h("drop", o, r, e);
  return { rolls: e, simpleMathModifier: t.simpleMathModifier, logs: O(t.logs, n) };
}], ["reroll", (t, o, r) => {
  if (!r) throw Error("rollOne function required for reroll modifier");
  let e = [...t.rolls], n = at(t.rolls, o, r), i = h("reroll", o, e, n);
  return { rolls: n, simpleMathModifier: t.simpleMathModifier, logs: O(t.logs, i) };
}], ["explode", (t, o, r, e) => {
  if (!r || !e) throw Error("rollOne and context required for explode modifier");
  let n = [...t.rolls], i = pt(t.rolls, e, r), s = h("explode", o, n, i);
  return { rolls: i, simpleMathModifier: t.simpleMathModifier, logs: O(t.logs, s) };
}], ["unique", (t, o, r, e) => {
  if (!r || !e) throw Error("rollOne and context required for unique modifier");
  let n = [...t.rolls], i = ct(t.rolls, o, e, r), s = h("unique", o, n, i);
  return { rolls: i, simpleMathModifier: t.simpleMathModifier, logs: O(t.logs, s) };
}], ["replace", (t, o) => {
  let r = [...t.rolls], e = mt(t.rolls, o), n = h("replace", o, r, e);
  return { rolls: e, simpleMathModifier: t.simpleMathModifier, logs: O(t.logs, n) };
}]]);
function V(t, o, r, e, n) {
  if (o === void 0) return r;
  let i = lt.get(t);
  if (!i) throw Error(`Unknown modifier type: ${t}`);
  return i(r, o, n, e);
}
var R = ["cap", "drop", "replace", "reroll", "explode", "unique", "plus", "minus"];
var T = /[Hh](\d+)?/;
var $ = /[Ll](\d+)?/;
var E = /[Dd]\{([^}]{1,50})\}/;
var C = /!/;
var A = /[Uu](\{([^}]{1,50})\})?/;
var q = /[Vv]\{([^}]{1,50})\}/;
var H = /[Rr]\{([^}]{1,50})\}(\d+)?/;
var L = /[Cc]\{([^}]{1,50})\}/;
var k = /\+(\d+)/;
var j = /-(\d+)/;
function ut(t) {
  let o = {}, r = Array.from(t.matchAll(new RegExp(k.source, "g")));
  if (r.length > 0) {
    let n = r.reduce((i, s) => i + Number(s[1]), 0);
    o.plus = n;
  }
  let e = Array.from(t.matchAll(new RegExp(j.source, "g")));
  if (e.length > 0) {
    let n = e.reduce((i, s) => i + Number(s[1]), 0);
    o.minus = n;
  }
  return o;
}
function dt(t) {
  let o = t.match(L);
  if (!o) return {};
  let r = {}, e = o[1];
  if (!e) return {};
  let n = e.split(",").map((i) => i.trim());
  for (let i of n) if (i.startsWith(">")) r.greaterThan = Number(i.slice(1));
  else if (i.startsWith("<")) r.lessThan = Number(i.slice(1));
  return { cap: r };
}
function Rt(t) {
  let o = {}, r = t.match(T);
  if (r) o.highest = r[1] ? Number(r[1]) : 1;
  let e = t.match($);
  if (e) o.lowest = e[1] ? Number(e[1]) : 1;
  let n = t.match(E);
  if (n) {
    let i = n[1];
    if (i) {
      let s = i.split(",").map((p) => p.trim());
      for (let p of s) if (p.startsWith(">")) o.greaterThan = Number(p.slice(1));
      else if (p.startsWith("<")) o.lessThan = Number(p.slice(1));
      else if (/^\d+$/.test(p)) o.exact ??= [], o.exact.push(Number(p));
    }
  }
  return Object.keys(o).length > 0 ? { drop: o } : {};
}
function gt(t) {
  return C.test(t) ? { explode: true } : {};
}
function yt(t) {
  let o = t.match(q);
  if (!o) return {};
  let r = o[1];
  if (!r) return {};
  return { replace: r.split(",").map((i) => i.trim()).map((i) => {
    let [s, p] = i.split("=");
    if (!s || !p) return { from: 0, to: 0 };
    let m;
    if (s.startsWith(">")) m = { greaterThan: Number(s.slice(1)) };
    else if (s.startsWith("<")) m = { lessThan: Number(s.slice(1)) };
    else m = Number(s);
    return { from: m, to: Number(p) };
  }) };
}
function ht(t) {
  let o = Array.from(t.matchAll(new RegExp(H.source, "g")));
  if (o.length === 0) return {};
  let r = {};
  for (let e of o) {
    let n = e[1], i = e[2] ? Number(e[2]) : void 0;
    if (i) r.max = i;
    if (n) {
      let s = n.split(",").map((p) => p.trim());
      for (let p of s) if (p.startsWith(">")) r.greaterThan = Number(p.slice(1));
      else if (p.startsWith("<")) r.lessThan = Number(p.slice(1));
      else if (/^\d+$/.test(p)) r.exact ??= [], r.exact.push(Number(p));
    }
  }
  return Object.keys(r).length > 0 ? { reroll: r } : {};
}
function Ot(t) {
  let o = t.match(A);
  if (!o) return {};
  if (!o[2]) return { unique: true };
  return { unique: { notUnique: o[2].split(",").map((e) => Number(e.trim())) } };
}
function K(t) {
  return { ...Rt(t), ...gt(t), ...Ot(t), ...yt(t), ...ht(t), ...dt(t), ...ut(t) };
}
function z(t) {
  if (!t) return [];
  return R.map((o) => W(o, t[o])).flat().filter((o) => typeof o === "string").filter((o) => o.length > 0);
}
function G(t) {
  if (!t) return "";
  return R.map((o) => _(o, t[o])).filter((o) => typeof o === "string").join("");
}
function g({ sides: t }) {
  if (Array.isArray(t)) return { sides: t.length, faces: t };
  return { sides: t };
}
function M(t) {
  let { modifiers: o, quantity: r = 1, arithmetic: e } = t, { sides: n, faces: i = [] } = g(t), p = `Roll ${r} ${n}-sided ${r === 1 ? "die" : "dice"}`, m = `Roll ${r} Dice with the following sides: ${i.join(", ")}`, a = z(o), c = e === "subtract" ? "and Subtract the result" : "";
  return [i.length ? m : p, ...a, c].filter(Boolean);
}
var u = /[+-]?\d+[Dd]\d+/;
var Dt = [u.source, T.source, $.source, E.source, C.source, A.source, q.source, H.source, L.source, k.source, j.source].join("|");
var J = new RegExp(Dt, "g");
function x(t) {
  if (typeof t !== "string") return false;
  let o = t.trim();
  if (!u.test(o)) return false;
  return o.replace(/\s/g, "").replaceAll(J, "").length === 0;
}
function N(t) {
  let { modifiers: o, quantity: r = 1, arithmetic: e } = t, { sides: n } = g(t), i = e === "subtract" ? "-" : "", s = G(o), p = `${i}${r}d${n}${s}`;
  if (!x(p)) throw Error(`Invalid notation generated: ${p}`);
  return p;
}
function Q(t, o) {
  let r = [];
  for (let [e, n] of o.entries()) {
    let i = o[e + 1];
    if (n.index === void 0) continue;
    let s;
    if (e === 0) s = 0;
    else {
      let a = o[e - 1], c = a ? Number(a.index) + a[0].length : 0, f = t.slice(c, n.index), l = /([+-])/.exec(f);
      if (l?.[1]) s = c + f.indexOf(l[1]);
      else s = n.index;
    }
    let p = i?.index ?? t.length, m = t.slice(s, p).trim();
    if (m) r.push(m);
  }
  return r;
}
function U(t) {
  let o = t.trim(), r = o.match(u)?.at(0) ?? "", e = o.replace(r, ""), [n, i = ""] = r.split(/[Dd]/), s = { quantity: Math.abs(Number(n)), arithmetic: Number(n) < 0 ? "subtract" : "add", sides: Number(i) };
  if (e.length === 0) return s;
  return { ...s, modifiers: K(e) };
}
var Pt = new RegExp(u.source, "g");
function w(t) {
  let o = Array.from(t.matchAll(Pt));
  if (o.length <= 1) return [U(t)];
  return Q(t, o).map(U);
}
function xt(t) {
  if (x(t)) return [...w(t)];
  if (typeof t === "string" || typeof t === "number") return [{ quantity: 1, sides: Number(t) }];
  return [t];
}
function Mt(t, o) {
  return xt(t).map((e, n) => {
    let i = n === 0 ? "" : `-${n + 1}`, { quantity: s = 1, arithmetic: p = "add", modifiers: m = {}, key: a = `Roll ${o}${i}` } = e;
    return { ...e, ...g(e), key: a, modifiers: m, quantity: s, arithmetic: p, argument: t, notation: N(e), description: M(e) };
  });
}
function S(t) {
  return Math.random() * t | 0;
}
function X(t, o) {
  if (t <= 0) return [];
  return Array.from({ length: t }, () => S(o) + 1);
}
function Nt({ sides: t, quantity: o = 1, modifiers: r = {} }, e) {
  if (!R.some((m) => r[m] !== void 0)) return { total: e.reduce((m, a) => m + a, 0), initialRolls: e, modifiedRolls: e, logs: [] };
  let i = () => S(t), s = { sides: t, quantity: o }, p = { simpleMathModifier: 0, rolls: e, logs: [] };
  for (let m of R) if (r[m]) {
    let a = V(m, r[m], p, s, i);
    p.rolls = a.rolls, p.simpleMathModifier = a.simpleMathModifier, p.logs = a.logs;
  }
  return { modifiedRolls: p.rolls, initialRolls: e, total: p.rolls.reduce((m, a) => m + a, p.simpleMathModifier), logs: p.logs };
}
function bt(t) {
  let { sides: o, quantity: r = 1, faces: e, arithmetic: n, description: i } = t, s = X(r, o), p = n === "subtract", m = e ? { customResults: s.map((c) => e[c - 1]) } : {}, a = Nt(t, s);
  return { ...m, parameters: t, description: i, modifierHistory: a, rolls: a.modifiedRolls, appliedTotal: p ? -a.total : a.total, total: a.total };
}
function Tt(...t) {
  let r = t.flatMap((s, p) => Mt(s, p + 1)).map((s) => bt(s)), e = r.reduce((s, p) => {
    let m = p.parameters.arithmetic === "subtract" ? -1 : 1;
    return s + p.total * m;
  }, 0), n = r.every((s) => s.customResults), i = r.flatMap((s) => n ? s.customResults ?? [] : s.rolls.map(String));
  return { rolls: r, result: i, total: e };
}
function $t(t) {
  if (!x(t)) return { valid: false, argument: t };
  let o = w(t);
  return { valid: true, argument: t, options: o, notation: o.map((r) => N(r)), description: o.map((r) => M(r)) };
}

export {
  g,
  M,
  x,
  N,
  Tt,
  $t
};
//# sourceMappingURL=chunk-TLPAMS3X.js.map
