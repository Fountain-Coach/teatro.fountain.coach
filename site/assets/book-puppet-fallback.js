var af = Object.defineProperty;
var cf = (t, e, n) => e in t ? af(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var ie = (t, e, n) => cf(t, typeof e != "symbol" ? e + "" : e, n);
var _a = { exports: {} }, ro = {}, Na = { exports: {} }, U = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Vr = Symbol.for("react.element"), df = Symbol.for("react.portal"), ff = Symbol.for("react.fragment"), hf = Symbol.for("react.strict_mode"), pf = Symbol.for("react.profiler"), mf = Symbol.for("react.provider"), yf = Symbol.for("react.context"), vf = Symbol.for("react.forward_ref"), gf = Symbol.for("react.suspense"), wf = Symbol.for("react.memo"), xf = Symbol.for("react.lazy"), Zl = Symbol.iterator;
function Sf(t) {
  return t === null || typeof t != "object" ? null : (t = Zl && t[Zl] || t["@@iterator"], typeof t == "function" ? t : null);
}
var Pa = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, Ta = Object.assign, Ma = {};
function Xn(t, e, n) {
  this.props = t, this.context = e, this.refs = Ma, this.updater = n || Pa;
}
Xn.prototype.isReactComponent = {};
Xn.prototype.setState = function(t, e) {
  if (typeof t != "object" && typeof t != "function" && t != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, t, e, "setState");
};
Xn.prototype.forceUpdate = function(t) {
  this.updater.enqueueForceUpdate(this, t, "forceUpdate");
};
function Ra() {
}
Ra.prototype = Xn.prototype;
function Ks(t, e, n) {
  this.props = t, this.context = e, this.refs = Ma, this.updater = n || Pa;
}
var Zs = Ks.prototype = new Ra();
Zs.constructor = Ks;
Ta(Zs, Xn.prototype);
Zs.isPureReactComponent = !0;
var Jl = Array.isArray, La = Object.prototype.hasOwnProperty, Js = { current: null }, Ba = { key: !0, ref: !0, __self: !0, __source: !0 };
function Fa(t, e, n) {
  var r, i = {}, o = null, s = null;
  if (e != null) for (r in e.ref !== void 0 && (s = e.ref), e.key !== void 0 && (o = "" + e.key), e) La.call(e, r) && !Ba.hasOwnProperty(r) && (i[r] = e[r]);
  var l = arguments.length - 2;
  if (l === 1) i.children = n;
  else if (1 < l) {
    for (var u = Array(l), a = 0; a < l; a++) u[a] = arguments[a + 2];
    i.children = u;
  }
  if (t && t.defaultProps) for (r in l = t.defaultProps, l) i[r] === void 0 && (i[r] = l[r]);
  return { $$typeof: Vr, type: t, key: o, ref: s, props: i, _owner: Js.current };
}
function Ef(t, e) {
  return { $$typeof: Vr, type: t.type, key: e, ref: t.ref, props: t.props, _owner: t._owner };
}
function bs(t) {
  return typeof t == "object" && t !== null && t.$$typeof === Vr;
}
function zf(t) {
  var e = { "=": "=0", ":": "=2" };
  return "$" + t.replace(/[=:]/g, function(n) {
    return e[n];
  });
}
var bl = /\/+/g;
function zo(t, e) {
  return typeof t == "object" && t !== null && t.key != null ? zf("" + t.key) : e.toString(36);
}
function xi(t, e, n, r, i) {
  var o = typeof t;
  (o === "undefined" || o === "boolean") && (t = null);
  var s = !1;
  if (t === null) s = !0;
  else switch (o) {
    case "string":
    case "number":
      s = !0;
      break;
    case "object":
      switch (t.$$typeof) {
        case Vr:
        case df:
          s = !0;
      }
  }
  if (s) return s = t, i = i(s), t = r === "" ? "." + zo(s, 0) : r, Jl(i) ? (n = "", t != null && (n = t.replace(bl, "$&/") + "/"), xi(i, e, n, "", function(a) {
    return a;
  })) : i != null && (bs(i) && (i = Ef(i, n + (!i.key || s && s.key === i.key ? "" : ("" + i.key).replace(bl, "$&/") + "/") + t)), e.push(i)), 1;
  if (s = 0, r = r === "" ? "." : r + ":", Jl(t)) for (var l = 0; l < t.length; l++) {
    o = t[l];
    var u = r + zo(o, l);
    s += xi(o, e, n, u, i);
  }
  else if (u = Sf(t), typeof u == "function") for (t = u.call(t), l = 0; !(o = t.next()).done; ) o = o.value, u = r + zo(o, l++), s += xi(o, e, n, u, i);
  else if (o === "object") throw e = String(t), Error("Objects are not valid as a React child (found: " + (e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e) + "). If you meant to render a collection of children, use an array instead.");
  return s;
}
function Jr(t, e, n) {
  if (t == null) return t;
  var r = [], i = 0;
  return xi(t, r, "", "", function(o) {
    return e.call(n, o, i++);
  }), r;
}
function Cf(t) {
  if (t._status === -1) {
    var e = t._result;
    e = e(), e.then(function(n) {
      (t._status === 0 || t._status === -1) && (t._status = 1, t._result = n);
    }, function(n) {
      (t._status === 0 || t._status === -1) && (t._status = 2, t._result = n);
    }), t._status === -1 && (t._status = 0, t._result = e);
  }
  if (t._status === 1) return t._result.default;
  throw t._result;
}
var ke = { current: null }, Si = { transition: null }, kf = { ReactCurrentDispatcher: ke, ReactCurrentBatchConfig: Si, ReactCurrentOwner: Js };
function Aa() {
  throw Error("act(...) is not supported in production builds of React.");
}
U.Children = { map: Jr, forEach: function(t, e, n) {
  Jr(t, function() {
    e.apply(this, arguments);
  }, n);
}, count: function(t) {
  var e = 0;
  return Jr(t, function() {
    e++;
  }), e;
}, toArray: function(t) {
  return Jr(t, function(e) {
    return e;
  }) || [];
}, only: function(t) {
  if (!bs(t)) throw Error("React.Children.only expected to receive a single React element child.");
  return t;
} };
U.Component = Xn;
U.Fragment = ff;
U.Profiler = pf;
U.PureComponent = Ks;
U.StrictMode = hf;
U.Suspense = gf;
U.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = kf;
U.act = Aa;
U.cloneElement = function(t, e, n) {
  if (t == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + t + ".");
  var r = Ta({}, t.props), i = t.key, o = t.ref, s = t._owner;
  if (e != null) {
    if (e.ref !== void 0 && (o = e.ref, s = Js.current), e.key !== void 0 && (i = "" + e.key), t.type && t.type.defaultProps) var l = t.type.defaultProps;
    for (u in e) La.call(e, u) && !Ba.hasOwnProperty(u) && (r[u] = e[u] === void 0 && l !== void 0 ? l[u] : e[u]);
  }
  var u = arguments.length - 2;
  if (u === 1) r.children = n;
  else if (1 < u) {
    l = Array(u);
    for (var a = 0; a < u; a++) l[a] = arguments[a + 2];
    r.children = l;
  }
  return { $$typeof: Vr, type: t.type, key: i, ref: o, props: r, _owner: s };
};
U.createContext = function(t) {
  return t = { $$typeof: yf, _currentValue: t, _currentValue2: t, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, t.Provider = { $$typeof: mf, _context: t }, t.Consumer = t;
};
U.createElement = Fa;
U.createFactory = function(t) {
  var e = Fa.bind(null, t);
  return e.type = t, e;
};
U.createRef = function() {
  return { current: null };
};
U.forwardRef = function(t) {
  return { $$typeof: vf, render: t };
};
U.isValidElement = bs;
U.lazy = function(t) {
  return { $$typeof: xf, _payload: { _status: -1, _result: t }, _init: Cf };
};
U.memo = function(t, e) {
  return { $$typeof: wf, type: t, compare: e === void 0 ? null : e };
};
U.startTransition = function(t) {
  var e = Si.transition;
  Si.transition = {};
  try {
    t();
  } finally {
    Si.transition = e;
  }
};
U.unstable_act = Aa;
U.useCallback = function(t, e) {
  return ke.current.useCallback(t, e);
};
U.useContext = function(t) {
  return ke.current.useContext(t);
};
U.useDebugValue = function() {
};
U.useDeferredValue = function(t) {
  return ke.current.useDeferredValue(t);
};
U.useEffect = function(t, e) {
  return ke.current.useEffect(t, e);
};
U.useId = function() {
  return ke.current.useId();
};
U.useImperativeHandle = function(t, e, n) {
  return ke.current.useImperativeHandle(t, e, n);
};
U.useInsertionEffect = function(t, e) {
  return ke.current.useInsertionEffect(t, e);
};
U.useLayoutEffect = function(t, e) {
  return ke.current.useLayoutEffect(t, e);
};
U.useMemo = function(t, e) {
  return ke.current.useMemo(t, e);
};
U.useReducer = function(t, e, n) {
  return ke.current.useReducer(t, e, n);
};
U.useRef = function(t) {
  return ke.current.useRef(t);
};
U.useState = function(t) {
  return ke.current.useState(t);
};
U.useSyncExternalStore = function(t, e, n) {
  return ke.current.useSyncExternalStore(t, e, n);
};
U.useTransition = function() {
  return ke.current.useTransition();
};
U.version = "18.3.1";
Na.exports = U;
var Ot = Na.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var _f = Ot, Nf = Symbol.for("react.element"), Pf = Symbol.for("react.fragment"), Tf = Object.prototype.hasOwnProperty, Mf = _f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Rf = { key: !0, ref: !0, __self: !0, __source: !0 };
function Ia(t, e, n) {
  var r, i = {}, o = null, s = null;
  n !== void 0 && (o = "" + n), e.key !== void 0 && (o = "" + e.key), e.ref !== void 0 && (s = e.ref);
  for (r in e) Tf.call(e, r) && !Rf.hasOwnProperty(r) && (i[r] = e[r]);
  if (t && t.defaultProps) for (r in e = t.defaultProps, e) i[r] === void 0 && (i[r] = e[r]);
  return { $$typeof: Nf, type: t, key: o, ref: s, props: i, _owner: Mf.current };
}
ro.Fragment = Pf;
ro.jsx = Ia;
ro.jsxs = Ia;
_a.exports = ro;
var he = _a.exports, Oa = { exports: {} }, We = {}, ja = { exports: {} }, Da = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(t) {
  function e(_, R) {
    var W = _.length;
    _.push(R);
    e: for (; 0 < W; ) {
      var q = W - 1 >>> 1, F = _[q];
      if (0 < i(F, R)) _[q] = R, _[W] = F, W = q;
      else break e;
    }
  }
  function n(_) {
    return _.length === 0 ? null : _[0];
  }
  function r(_) {
    if (_.length === 0) return null;
    var R = _[0], W = _.pop();
    if (W !== R) {
      _[0] = W;
      e: for (var q = 0, F = _.length, Ae = F >>> 1; q < Ae; ) {
        var Ne = 2 * (q + 1) - 1, ot = _[Ne], Pe = Ne + 1, st = _[Pe];
        if (0 > i(ot, W)) Pe < F && 0 > i(st, ot) ? (_[q] = st, _[Pe] = W, q = Pe) : (_[q] = ot, _[Ne] = W, q = Ne);
        else if (Pe < F && 0 > i(st, W)) _[q] = st, _[Pe] = W, q = Pe;
        else break e;
      }
    }
    return R;
  }
  function i(_, R) {
    var W = _.sortIndex - R.sortIndex;
    return W !== 0 ? W : _.id - R.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var o = performance;
    t.unstable_now = function() {
      return o.now();
    };
  } else {
    var s = Date, l = s.now();
    t.unstable_now = function() {
      return s.now() - l;
    };
  }
  var u = [], a = [], h = 1, p = null, c = 3, y = !1, v = !1, w = !1, S = typeof setTimeout == "function" ? setTimeout : null, m = typeof clearTimeout == "function" ? clearTimeout : null, d = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function g(_) {
    for (var R = n(a); R !== null; ) {
      if (R.callback === null) r(a);
      else if (R.startTime <= _) r(a), R.sortIndex = R.expirationTime, e(u, R);
      else break;
      R = n(a);
    }
  }
  function x(_) {
    if (w = !1, g(_), !v) if (n(u) !== null) v = !0, P(E);
    else {
      var R = n(a);
      R !== null && Y(x, R.startTime - _);
    }
  }
  function E(_, R) {
    v = !1, w && (w = !1, m(k), k = -1), y = !0;
    var W = c;
    try {
      for (g(R), p = n(u); p !== null && (!(p.expirationTime > R) || _ && !D()); ) {
        var q = p.callback;
        if (typeof q == "function") {
          p.callback = null, c = p.priorityLevel;
          var F = q(p.expirationTime <= R);
          R = t.unstable_now(), typeof F == "function" ? p.callback = F : p === n(u) && r(u), g(R);
        } else r(u);
        p = n(u);
      }
      if (p !== null) var Ae = !0;
      else {
        var Ne = n(a);
        Ne !== null && Y(x, Ne.startTime - R), Ae = !1;
      }
      return Ae;
    } finally {
      p = null, c = W, y = !1;
    }
  }
  var z = !1, C = null, k = -1, O = 5, M = -1;
  function D() {
    return !(t.unstable_now() - M < O);
  }
  function V() {
    if (C !== null) {
      var _ = t.unstable_now();
      M = _;
      var R = !0;
      try {
        R = C(!0, _);
      } finally {
        R ? N() : (z = !1, C = null);
      }
    } else z = !1;
  }
  var N;
  if (typeof d == "function") N = function() {
    d(V);
  };
  else if (typeof MessageChannel < "u") {
    var B = new MessageChannel(), L = B.port2;
    B.port1.onmessage = V, N = function() {
      L.postMessage(null);
    };
  } else N = function() {
    S(V, 0);
  };
  function P(_) {
    C = _, z || (z = !0, N());
  }
  function Y(_, R) {
    k = S(function() {
      _(t.unstable_now());
    }, R);
  }
  t.unstable_IdlePriority = 5, t.unstable_ImmediatePriority = 1, t.unstable_LowPriority = 4, t.unstable_NormalPriority = 3, t.unstable_Profiling = null, t.unstable_UserBlockingPriority = 2, t.unstable_cancelCallback = function(_) {
    _.callback = null;
  }, t.unstable_continueExecution = function() {
    v || y || (v = !0, P(E));
  }, t.unstable_forceFrameRate = function(_) {
    0 > _ || 125 < _ ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : O = 0 < _ ? Math.floor(1e3 / _) : 5;
  }, t.unstable_getCurrentPriorityLevel = function() {
    return c;
  }, t.unstable_getFirstCallbackNode = function() {
    return n(u);
  }, t.unstable_next = function(_) {
    switch (c) {
      case 1:
      case 2:
      case 3:
        var R = 3;
        break;
      default:
        R = c;
    }
    var W = c;
    c = R;
    try {
      return _();
    } finally {
      c = W;
    }
  }, t.unstable_pauseExecution = function() {
  }, t.unstable_requestPaint = function() {
  }, t.unstable_runWithPriority = function(_, R) {
    switch (_) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        _ = 3;
    }
    var W = c;
    c = _;
    try {
      return R();
    } finally {
      c = W;
    }
  }, t.unstable_scheduleCallback = function(_, R, W) {
    var q = t.unstable_now();
    switch (typeof W == "object" && W !== null ? (W = W.delay, W = typeof W == "number" && 0 < W ? q + W : q) : W = q, _) {
      case 1:
        var F = -1;
        break;
      case 2:
        F = 250;
        break;
      case 5:
        F = 1073741823;
        break;
      case 4:
        F = 1e4;
        break;
      default:
        F = 5e3;
    }
    return F = W + F, _ = { id: h++, callback: R, priorityLevel: _, startTime: W, expirationTime: F, sortIndex: -1 }, W > q ? (_.sortIndex = W, e(a, _), n(u) === null && _ === n(a) && (w ? (m(k), k = -1) : w = !0, Y(x, W - q))) : (_.sortIndex = F, e(u, _), v || y || (v = !0, P(E))), _;
  }, t.unstable_shouldYield = D, t.unstable_wrapCallback = function(_) {
    var R = c;
    return function() {
      var W = c;
      c = R;
      try {
        return _.apply(this, arguments);
      } finally {
        c = W;
      }
    };
  };
})(Da);
ja.exports = Da;
var Lf = ja.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Bf = Ot, De = Lf;
function T(t) {
  for (var e = "https://reactjs.org/docs/error-decoder.html?invariant=" + t, n = 1; n < arguments.length; n++) e += "&args[]=" + encodeURIComponent(arguments[n]);
  return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var Wa = /* @__PURE__ */ new Set(), Cr = {};
function mn(t, e) {
  Vn(t, e), Vn(t + "Capture", e);
}
function Vn(t, e) {
  for (Cr[t] = e, t = 0; t < e.length; t++) Wa.add(e[t]);
}
var kt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), rs = Object.prototype.hasOwnProperty, Ff = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, eu = {}, tu = {};
function Af(t) {
  return rs.call(tu, t) ? !0 : rs.call(eu, t) ? !1 : Ff.test(t) ? tu[t] = !0 : (eu[t] = !0, !1);
}
function If(t, e, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof e) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r ? !1 : n !== null ? !n.acceptsBooleans : (t = t.toLowerCase().slice(0, 5), t !== "data-" && t !== "aria-");
    default:
      return !1;
  }
}
function Of(t, e, n, r) {
  if (e === null || typeof e > "u" || If(t, e, n, r)) return !0;
  if (r) return !1;
  if (n !== null) switch (n.type) {
    case 3:
      return !e;
    case 4:
      return e === !1;
    case 5:
      return isNaN(e);
    case 6:
      return isNaN(e) || 1 > e;
  }
  return !1;
}
function _e(t, e, n, r, i, o, s) {
  this.acceptsBooleans = e === 2 || e === 3 || e === 4, this.attributeName = r, this.attributeNamespace = i, this.mustUseProperty = n, this.propertyName = t, this.type = e, this.sanitizeURL = o, this.removeEmptyString = s;
}
var ge = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t) {
  ge[t] = new _e(t, 0, !1, t, null, !1, !1);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(t) {
  var e = t[0];
  ge[e] = new _e(e, 1, !1, t[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(t) {
  ge[t] = new _e(t, 2, !1, t.toLowerCase(), null, !1, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(t) {
  ge[t] = new _e(t, 2, !1, t, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t) {
  ge[t] = new _e(t, 3, !1, t.toLowerCase(), null, !1, !1);
});
["checked", "multiple", "muted", "selected"].forEach(function(t) {
  ge[t] = new _e(t, 3, !0, t, null, !1, !1);
});
["capture", "download"].forEach(function(t) {
  ge[t] = new _e(t, 4, !1, t, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function(t) {
  ge[t] = new _e(t, 6, !1, t, null, !1, !1);
});
["rowSpan", "start"].forEach(function(t) {
  ge[t] = new _e(t, 5, !1, t.toLowerCase(), null, !1, !1);
});
var el = /[\-:]([a-z])/g;
function tl(t) {
  return t[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t) {
  var e = t.replace(
    el,
    tl
  );
  ge[e] = new _e(e, 1, !1, t, null, !1, !1);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t) {
  var e = t.replace(el, tl);
  ge[e] = new _e(e, 1, !1, t, "http://www.w3.org/1999/xlink", !1, !1);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(t) {
  var e = t.replace(el, tl);
  ge[e] = new _e(e, 1, !1, t, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function(t) {
  ge[t] = new _e(t, 1, !1, t.toLowerCase(), null, !1, !1);
});
ge.xlinkHref = new _e("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function(t) {
  ge[t] = new _e(t, 1, !1, t.toLowerCase(), null, !0, !0);
});
function nl(t, e, n, r) {
  var i = ge.hasOwnProperty(e) ? ge[e] : null;
  (i !== null ? i.type !== 0 : r || !(2 < e.length) || e[0] !== "o" && e[0] !== "O" || e[1] !== "n" && e[1] !== "N") && (Of(e, n, i, r) && (n = null), r || i === null ? Af(e) && (n === null ? t.removeAttribute(e) : t.setAttribute(e, "" + n)) : i.mustUseProperty ? t[i.propertyName] = n === null ? i.type === 3 ? !1 : "" : n : (e = i.attributeName, r = i.attributeNamespace, n === null ? t.removeAttribute(e) : (i = i.type, n = i === 3 || i === 4 && n === !0 ? "" : "" + n, r ? t.setAttributeNS(r, e, n) : t.setAttribute(e, n))));
}
var Tt = Bf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, br = Symbol.for("react.element"), En = Symbol.for("react.portal"), zn = Symbol.for("react.fragment"), rl = Symbol.for("react.strict_mode"), is = Symbol.for("react.profiler"), Va = Symbol.for("react.provider"), qa = Symbol.for("react.context"), il = Symbol.for("react.forward_ref"), os = Symbol.for("react.suspense"), ss = Symbol.for("react.suspense_list"), ol = Symbol.for("react.memo"), Bt = Symbol.for("react.lazy"), Ua = Symbol.for("react.offscreen"), nu = Symbol.iterator;
function Zn(t) {
  return t === null || typeof t != "object" ? null : (t = nu && t[nu] || t["@@iterator"], typeof t == "function" ? t : null);
}
var ne = Object.assign, Co;
function ar(t) {
  if (Co === void 0) try {
    throw Error();
  } catch (n) {
    var e = n.stack.trim().match(/\n( *(at )?)/);
    Co = e && e[1] || "";
  }
  return `
` + Co + t;
}
var ko = !1;
function _o(t, e) {
  if (!t || ko) return "";
  ko = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (e) if (e = function() {
      throw Error();
    }, Object.defineProperty(e.prototype, "props", { set: function() {
      throw Error();
    } }), typeof Reflect == "object" && Reflect.construct) {
      try {
        Reflect.construct(e, []);
      } catch (a) {
        var r = a;
      }
      Reflect.construct(t, [], e);
    } else {
      try {
        e.call();
      } catch (a) {
        r = a;
      }
      t.call(e.prototype);
    }
    else {
      try {
        throw Error();
      } catch (a) {
        r = a;
      }
      t();
    }
  } catch (a) {
    if (a && r && typeof a.stack == "string") {
      for (var i = a.stack.split(`
`), o = r.stack.split(`
`), s = i.length - 1, l = o.length - 1; 1 <= s && 0 <= l && i[s] !== o[l]; ) l--;
      for (; 1 <= s && 0 <= l; s--, l--) if (i[s] !== o[l]) {
        if (s !== 1 || l !== 1)
          do
            if (s--, l--, 0 > l || i[s] !== o[l]) {
              var u = `
` + i[s].replace(" at new ", " at ");
              return t.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", t.displayName)), u;
            }
          while (1 <= s && 0 <= l);
        break;
      }
    }
  } finally {
    ko = !1, Error.prepareStackTrace = n;
  }
  return (t = t ? t.displayName || t.name : "") ? ar(t) : "";
}
function jf(t) {
  switch (t.tag) {
    case 5:
      return ar(t.type);
    case 16:
      return ar("Lazy");
    case 13:
      return ar("Suspense");
    case 19:
      return ar("SuspenseList");
    case 0:
    case 2:
    case 15:
      return t = _o(t.type, !1), t;
    case 11:
      return t = _o(t.type.render, !1), t;
    case 1:
      return t = _o(t.type, !0), t;
    default:
      return "";
  }
}
function ls(t) {
  if (t == null) return null;
  if (typeof t == "function") return t.displayName || t.name || null;
  if (typeof t == "string") return t;
  switch (t) {
    case zn:
      return "Fragment";
    case En:
      return "Portal";
    case is:
      return "Profiler";
    case rl:
      return "StrictMode";
    case os:
      return "Suspense";
    case ss:
      return "SuspenseList";
  }
  if (typeof t == "object") switch (t.$$typeof) {
    case qa:
      return (t.displayName || "Context") + ".Consumer";
    case Va:
      return (t._context.displayName || "Context") + ".Provider";
    case il:
      var e = t.render;
      return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
    case ol:
      return e = t.displayName || null, e !== null ? e : ls(t.type) || "Memo";
    case Bt:
      e = t._payload, t = t._init;
      try {
        return ls(t(e));
      } catch {
      }
  }
  return null;
}
function Df(t) {
  var e = t.type;
  switch (t.tag) {
    case 24:
      return "Cache";
    case 9:
      return (e.displayName || "Context") + ".Consumer";
    case 10:
      return (e._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return t = e.render, t = t.displayName || t.name || "", e.displayName || (t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return e;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return ls(e);
    case 8:
      return e === rl ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof e == "function") return e.displayName || e.name || null;
      if (typeof e == "string") return e;
  }
  return null;
}
function Xt(t) {
  switch (typeof t) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return t;
    case "object":
      return t;
    default:
      return "";
  }
}
function Ha(t) {
  var e = t.type;
  return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
}
function Wf(t) {
  var e = Ha(t) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(t.constructor.prototype, e), r = "" + t[e];
  if (!t.hasOwnProperty(e) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
    var i = n.get, o = n.set;
    return Object.defineProperty(t, e, { configurable: !0, get: function() {
      return i.call(this);
    }, set: function(s) {
      r = "" + s, o.call(this, s);
    } }), Object.defineProperty(t, e, { enumerable: n.enumerable }), { getValue: function() {
      return r;
    }, setValue: function(s) {
      r = "" + s;
    }, stopTracking: function() {
      t._valueTracker = null, delete t[e];
    } };
  }
}
function ei(t) {
  t._valueTracker || (t._valueTracker = Wf(t));
}
function $a(t) {
  if (!t) return !1;
  var e = t._valueTracker;
  if (!e) return !0;
  var n = e.getValue(), r = "";
  return t && (r = Ha(t) ? t.checked ? "true" : "false" : t.value), t = r, t !== n ? (e.setValue(t), !0) : !1;
}
function Li(t) {
  if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
  try {
    return t.activeElement || t.body;
  } catch {
    return t.body;
  }
}
function us(t, e) {
  var n = e.checked;
  return ne({}, e, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? t._wrapperState.initialChecked });
}
function ru(t, e) {
  var n = e.defaultValue == null ? "" : e.defaultValue, r = e.checked != null ? e.checked : e.defaultChecked;
  n = Xt(e.value != null ? e.value : n), t._wrapperState = { initialChecked: r, initialValue: n, controlled: e.type === "checkbox" || e.type === "radio" ? e.checked != null : e.value != null };
}
function Ga(t, e) {
  e = e.checked, e != null && nl(t, "checked", e, !1);
}
function as(t, e) {
  Ga(t, e);
  var n = Xt(e.value), r = e.type;
  if (n != null) r === "number" ? (n === 0 && t.value === "" || t.value != n) && (t.value = "" + n) : t.value !== "" + n && (t.value = "" + n);
  else if (r === "submit" || r === "reset") {
    t.removeAttribute("value");
    return;
  }
  e.hasOwnProperty("value") ? cs(t, e.type, n) : e.hasOwnProperty("defaultValue") && cs(t, e.type, Xt(e.defaultValue)), e.checked == null && e.defaultChecked != null && (t.defaultChecked = !!e.defaultChecked);
}
function iu(t, e, n) {
  if (e.hasOwnProperty("value") || e.hasOwnProperty("defaultValue")) {
    var r = e.type;
    if (!(r !== "submit" && r !== "reset" || e.value !== void 0 && e.value !== null)) return;
    e = "" + t._wrapperState.initialValue, n || e === t.value || (t.value = e), t.defaultValue = e;
  }
  n = t.name, n !== "" && (t.name = ""), t.defaultChecked = !!t._wrapperState.initialChecked, n !== "" && (t.name = n);
}
function cs(t, e, n) {
  (e !== "number" || Li(t.ownerDocument) !== t) && (n == null ? t.defaultValue = "" + t._wrapperState.initialValue : t.defaultValue !== "" + n && (t.defaultValue = "" + n));
}
var cr = Array.isArray;
function An(t, e, n, r) {
  if (t = t.options, e) {
    e = {};
    for (var i = 0; i < n.length; i++) e["$" + n[i]] = !0;
    for (n = 0; n < t.length; n++) i = e.hasOwnProperty("$" + t[n].value), t[n].selected !== i && (t[n].selected = i), i && r && (t[n].defaultSelected = !0);
  } else {
    for (n = "" + Xt(n), e = null, i = 0; i < t.length; i++) {
      if (t[i].value === n) {
        t[i].selected = !0, r && (t[i].defaultSelected = !0);
        return;
      }
      e !== null || t[i].disabled || (e = t[i]);
    }
    e !== null && (e.selected = !0);
  }
}
function ds(t, e) {
  if (e.dangerouslySetInnerHTML != null) throw Error(T(91));
  return ne({}, e, { value: void 0, defaultValue: void 0, children: "" + t._wrapperState.initialValue });
}
function ou(t, e) {
  var n = e.value;
  if (n == null) {
    if (n = e.children, e = e.defaultValue, n != null) {
      if (e != null) throw Error(T(92));
      if (cr(n)) {
        if (1 < n.length) throw Error(T(93));
        n = n[0];
      }
      e = n;
    }
    e == null && (e = ""), n = e;
  }
  t._wrapperState = { initialValue: Xt(n) };
}
function Ya(t, e) {
  var n = Xt(e.value), r = Xt(e.defaultValue);
  n != null && (n = "" + n, n !== t.value && (t.value = n), e.defaultValue == null && t.defaultValue !== n && (t.defaultValue = n)), r != null && (t.defaultValue = "" + r);
}
function su(t) {
  var e = t.textContent;
  e === t._wrapperState.initialValue && e !== "" && e !== null && (t.value = e);
}
function Xa(t) {
  switch (t) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function fs(t, e) {
  return t == null || t === "http://www.w3.org/1999/xhtml" ? Xa(e) : t === "http://www.w3.org/2000/svg" && e === "foreignObject" ? "http://www.w3.org/1999/xhtml" : t;
}
var ti, Qa = function(t) {
  return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(e, n, r, i) {
    MSApp.execUnsafeLocalFunction(function() {
      return t(e, n, r, i);
    });
  } : t;
}(function(t, e) {
  if (t.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in t) t.innerHTML = e;
  else {
    for (ti = ti || document.createElement("div"), ti.innerHTML = "<svg>" + e.valueOf().toString() + "</svg>", e = ti.firstChild; t.firstChild; ) t.removeChild(t.firstChild);
    for (; e.firstChild; ) t.appendChild(e.firstChild);
  }
});
function kr(t, e) {
  if (e) {
    var n = t.firstChild;
    if (n && n === t.lastChild && n.nodeType === 3) {
      n.nodeValue = e;
      return;
    }
  }
  t.textContent = e;
}
var hr = {
  animationIterationCount: !0,
  aspectRatio: !0,
  borderImageOutset: !0,
  borderImageSlice: !0,
  borderImageWidth: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  columns: !0,
  flex: !0,
  flexGrow: !0,
  flexPositive: !0,
  flexShrink: !0,
  flexNegative: !0,
  flexOrder: !0,
  gridArea: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowSpan: !0,
  gridRowStart: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnSpan: !0,
  gridColumnStart: !0,
  fontWeight: !0,
  lineClamp: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  tabSize: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  fillOpacity: !0,
  floodOpacity: !0,
  stopOpacity: !0,
  strokeDasharray: !0,
  strokeDashoffset: !0,
  strokeMiterlimit: !0,
  strokeOpacity: !0,
  strokeWidth: !0
}, Vf = ["Webkit", "ms", "Moz", "O"];
Object.keys(hr).forEach(function(t) {
  Vf.forEach(function(e) {
    e = e + t.charAt(0).toUpperCase() + t.substring(1), hr[e] = hr[t];
  });
});
function Ka(t, e, n) {
  return e == null || typeof e == "boolean" || e === "" ? "" : n || typeof e != "number" || e === 0 || hr.hasOwnProperty(t) && hr[t] ? ("" + e).trim() : e + "px";
}
function Za(t, e) {
  t = t.style;
  for (var n in e) if (e.hasOwnProperty(n)) {
    var r = n.indexOf("--") === 0, i = Ka(n, e[n], r);
    n === "float" && (n = "cssFloat"), r ? t.setProperty(n, i) : t[n] = i;
  }
}
var qf = ne({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
function hs(t, e) {
  if (e) {
    if (qf[t] && (e.children != null || e.dangerouslySetInnerHTML != null)) throw Error(T(137, t));
    if (e.dangerouslySetInnerHTML != null) {
      if (e.children != null) throw Error(T(60));
      if (typeof e.dangerouslySetInnerHTML != "object" || !("__html" in e.dangerouslySetInnerHTML)) throw Error(T(61));
    }
    if (e.style != null && typeof e.style != "object") throw Error(T(62));
  }
}
function ps(t, e) {
  if (t.indexOf("-") === -1) return typeof e.is == "string";
  switch (t) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var ms = null;
function sl(t) {
  return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
}
var ys = null, In = null, On = null;
function lu(t) {
  if (t = Hr(t)) {
    if (typeof ys != "function") throw Error(T(280));
    var e = t.stateNode;
    e && (e = uo(e), ys(t.stateNode, t.type, e));
  }
}
function Ja(t) {
  In ? On ? On.push(t) : On = [t] : In = t;
}
function ba() {
  if (In) {
    var t = In, e = On;
    if (On = In = null, lu(t), e) for (t = 0; t < e.length; t++) lu(e[t]);
  }
}
function ec(t, e) {
  return t(e);
}
function tc() {
}
var No = !1;
function nc(t, e, n) {
  if (No) return t(e, n);
  No = !0;
  try {
    return ec(t, e, n);
  } finally {
    No = !1, (In !== null || On !== null) && (tc(), ba());
  }
}
function _r(t, e) {
  var n = t.stateNode;
  if (n === null) return null;
  var r = uo(n);
  if (r === null) return null;
  n = r[e];
  e: switch (e) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) || (t = t.type, r = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !r;
      break e;
    default:
      t = !1;
  }
  if (t) return null;
  if (n && typeof n != "function") throw Error(T(231, e, typeof n));
  return n;
}
var vs = !1;
if (kt) try {
  var Jn = {};
  Object.defineProperty(Jn, "passive", { get: function() {
    vs = !0;
  } }), window.addEventListener("test", Jn, Jn), window.removeEventListener("test", Jn, Jn);
} catch {
  vs = !1;
}
function Uf(t, e, n, r, i, o, s, l, u) {
  var a = Array.prototype.slice.call(arguments, 3);
  try {
    e.apply(n, a);
  } catch (h) {
    this.onError(h);
  }
}
var pr = !1, Bi = null, Fi = !1, gs = null, Hf = { onError: function(t) {
  pr = !0, Bi = t;
} };
function $f(t, e, n, r, i, o, s, l, u) {
  pr = !1, Bi = null, Uf.apply(Hf, arguments);
}
function Gf(t, e, n, r, i, o, s, l, u) {
  if ($f.apply(this, arguments), pr) {
    if (pr) {
      var a = Bi;
      pr = !1, Bi = null;
    } else throw Error(T(198));
    Fi || (Fi = !0, gs = a);
  }
}
function yn(t) {
  var e = t, n = t;
  if (t.alternate) for (; e.return; ) e = e.return;
  else {
    t = e;
    do
      e = t, e.flags & 4098 && (n = e.return), t = e.return;
    while (t);
  }
  return e.tag === 3 ? n : null;
}
function rc(t) {
  if (t.tag === 13) {
    var e = t.memoizedState;
    if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
  }
  return null;
}
function uu(t) {
  if (yn(t) !== t) throw Error(T(188));
}
function Yf(t) {
  var e = t.alternate;
  if (!e) {
    if (e = yn(t), e === null) throw Error(T(188));
    return e !== t ? null : t;
  }
  for (var n = t, r = e; ; ) {
    var i = n.return;
    if (i === null) break;
    var o = i.alternate;
    if (o === null) {
      if (r = i.return, r !== null) {
        n = r;
        continue;
      }
      break;
    }
    if (i.child === o.child) {
      for (o = i.child; o; ) {
        if (o === n) return uu(i), t;
        if (o === r) return uu(i), e;
        o = o.sibling;
      }
      throw Error(T(188));
    }
    if (n.return !== r.return) n = i, r = o;
    else {
      for (var s = !1, l = i.child; l; ) {
        if (l === n) {
          s = !0, n = i, r = o;
          break;
        }
        if (l === r) {
          s = !0, r = i, n = o;
          break;
        }
        l = l.sibling;
      }
      if (!s) {
        for (l = o.child; l; ) {
          if (l === n) {
            s = !0, n = o, r = i;
            break;
          }
          if (l === r) {
            s = !0, r = o, n = i;
            break;
          }
          l = l.sibling;
        }
        if (!s) throw Error(T(189));
      }
    }
    if (n.alternate !== r) throw Error(T(190));
  }
  if (n.tag !== 3) throw Error(T(188));
  return n.stateNode.current === n ? t : e;
}
function ic(t) {
  return t = Yf(t), t !== null ? oc(t) : null;
}
function oc(t) {
  if (t.tag === 5 || t.tag === 6) return t;
  for (t = t.child; t !== null; ) {
    var e = oc(t);
    if (e !== null) return e;
    t = t.sibling;
  }
  return null;
}
var sc = De.unstable_scheduleCallback, au = De.unstable_cancelCallback, Xf = De.unstable_shouldYield, Qf = De.unstable_requestPaint, se = De.unstable_now, Kf = De.unstable_getCurrentPriorityLevel, ll = De.unstable_ImmediatePriority, lc = De.unstable_UserBlockingPriority, Ai = De.unstable_NormalPriority, Zf = De.unstable_LowPriority, uc = De.unstable_IdlePriority, io = null, ht = null;
function Jf(t) {
  if (ht && typeof ht.onCommitFiberRoot == "function") try {
    ht.onCommitFiberRoot(io, t, void 0, (t.current.flags & 128) === 128);
  } catch {
  }
}
var nt = Math.clz32 ? Math.clz32 : th, bf = Math.log, eh = Math.LN2;
function th(t) {
  return t >>>= 0, t === 0 ? 32 : 31 - (bf(t) / eh | 0) | 0;
}
var ni = 64, ri = 4194304;
function dr(t) {
  switch (t & -t) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return t & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return t;
  }
}
function Ii(t, e) {
  var n = t.pendingLanes;
  if (n === 0) return 0;
  var r = 0, i = t.suspendedLanes, o = t.pingedLanes, s = n & 268435455;
  if (s !== 0) {
    var l = s & ~i;
    l !== 0 ? r = dr(l) : (o &= s, o !== 0 && (r = dr(o)));
  } else s = n & ~i, s !== 0 ? r = dr(s) : o !== 0 && (r = dr(o));
  if (r === 0) return 0;
  if (e !== 0 && e !== r && !(e & i) && (i = r & -r, o = e & -e, i >= o || i === 16 && (o & 4194240) !== 0)) return e;
  if (r & 4 && (r |= n & 16), e = t.entangledLanes, e !== 0) for (t = t.entanglements, e &= r; 0 < e; ) n = 31 - nt(e), i = 1 << n, r |= t[n], e &= ~i;
  return r;
}
function nh(t, e) {
  switch (t) {
    case 1:
    case 2:
    case 4:
      return e + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function rh(t, e) {
  for (var n = t.suspendedLanes, r = t.pingedLanes, i = t.expirationTimes, o = t.pendingLanes; 0 < o; ) {
    var s = 31 - nt(o), l = 1 << s, u = i[s];
    u === -1 ? (!(l & n) || l & r) && (i[s] = nh(l, e)) : u <= e && (t.expiredLanes |= l), o &= ~l;
  }
}
function ws(t) {
  return t = t.pendingLanes & -1073741825, t !== 0 ? t : t & 1073741824 ? 1073741824 : 0;
}
function ac() {
  var t = ni;
  return ni <<= 1, !(ni & 4194240) && (ni = 64), t;
}
function Po(t) {
  for (var e = [], n = 0; 31 > n; n++) e.push(t);
  return e;
}
function qr(t, e, n) {
  t.pendingLanes |= e, e !== 536870912 && (t.suspendedLanes = 0, t.pingedLanes = 0), t = t.eventTimes, e = 31 - nt(e), t[e] = n;
}
function ih(t, e) {
  var n = t.pendingLanes & ~e;
  t.pendingLanes = e, t.suspendedLanes = 0, t.pingedLanes = 0, t.expiredLanes &= e, t.mutableReadLanes &= e, t.entangledLanes &= e, e = t.entanglements;
  var r = t.eventTimes;
  for (t = t.expirationTimes; 0 < n; ) {
    var i = 31 - nt(n), o = 1 << i;
    e[i] = 0, r[i] = -1, t[i] = -1, n &= ~o;
  }
}
function ul(t, e) {
  var n = t.entangledLanes |= e;
  for (t = t.entanglements; n; ) {
    var r = 31 - nt(n), i = 1 << r;
    i & e | t[r] & e && (t[r] |= e), n &= ~i;
  }
}
var X = 0;
function cc(t) {
  return t &= -t, 1 < t ? 4 < t ? t & 268435455 ? 16 : 536870912 : 4 : 1;
}
var dc, al, fc, hc, pc, xs = !1, ii = [], Wt = null, Vt = null, qt = null, Nr = /* @__PURE__ */ new Map(), Pr = /* @__PURE__ */ new Map(), At = [], oh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function cu(t, e) {
  switch (t) {
    case "focusin":
    case "focusout":
      Wt = null;
      break;
    case "dragenter":
    case "dragleave":
      Vt = null;
      break;
    case "mouseover":
    case "mouseout":
      qt = null;
      break;
    case "pointerover":
    case "pointerout":
      Nr.delete(e.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pr.delete(e.pointerId);
  }
}
function bn(t, e, n, r, i, o) {
  return t === null || t.nativeEvent !== o ? (t = { blockedOn: e, domEventName: n, eventSystemFlags: r, nativeEvent: o, targetContainers: [i] }, e !== null && (e = Hr(e), e !== null && al(e)), t) : (t.eventSystemFlags |= r, e = t.targetContainers, i !== null && e.indexOf(i) === -1 && e.push(i), t);
}
function sh(t, e, n, r, i) {
  switch (e) {
    case "focusin":
      return Wt = bn(Wt, t, e, n, r, i), !0;
    case "dragenter":
      return Vt = bn(Vt, t, e, n, r, i), !0;
    case "mouseover":
      return qt = bn(qt, t, e, n, r, i), !0;
    case "pointerover":
      var o = i.pointerId;
      return Nr.set(o, bn(Nr.get(o) || null, t, e, n, r, i)), !0;
    case "gotpointercapture":
      return o = i.pointerId, Pr.set(o, bn(Pr.get(o) || null, t, e, n, r, i)), !0;
  }
  return !1;
}
function mc(t) {
  var e = rn(t.target);
  if (e !== null) {
    var n = yn(e);
    if (n !== null) {
      if (e = n.tag, e === 13) {
        if (e = rc(n), e !== null) {
          t.blockedOn = e, pc(t.priority, function() {
            fc(n);
          });
          return;
        }
      } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  t.blockedOn = null;
}
function Ei(t) {
  if (t.blockedOn !== null) return !1;
  for (var e = t.targetContainers; 0 < e.length; ) {
    var n = Ss(t.domEventName, t.eventSystemFlags, e[0], t.nativeEvent);
    if (n === null) {
      n = t.nativeEvent;
      var r = new n.constructor(n.type, n);
      ms = r, n.target.dispatchEvent(r), ms = null;
    } else return e = Hr(n), e !== null && al(e), t.blockedOn = n, !1;
    e.shift();
  }
  return !0;
}
function du(t, e, n) {
  Ei(t) && n.delete(e);
}
function lh() {
  xs = !1, Wt !== null && Ei(Wt) && (Wt = null), Vt !== null && Ei(Vt) && (Vt = null), qt !== null && Ei(qt) && (qt = null), Nr.forEach(du), Pr.forEach(du);
}
function er(t, e) {
  t.blockedOn === e && (t.blockedOn = null, xs || (xs = !0, De.unstable_scheduleCallback(De.unstable_NormalPriority, lh)));
}
function Tr(t) {
  function e(i) {
    return er(i, t);
  }
  if (0 < ii.length) {
    er(ii[0], t);
    for (var n = 1; n < ii.length; n++) {
      var r = ii[n];
      r.blockedOn === t && (r.blockedOn = null);
    }
  }
  for (Wt !== null && er(Wt, t), Vt !== null && er(Vt, t), qt !== null && er(qt, t), Nr.forEach(e), Pr.forEach(e), n = 0; n < At.length; n++) r = At[n], r.blockedOn === t && (r.blockedOn = null);
  for (; 0 < At.length && (n = At[0], n.blockedOn === null); ) mc(n), n.blockedOn === null && At.shift();
}
var jn = Tt.ReactCurrentBatchConfig, Oi = !0;
function uh(t, e, n, r) {
  var i = X, o = jn.transition;
  jn.transition = null;
  try {
    X = 1, cl(t, e, n, r);
  } finally {
    X = i, jn.transition = o;
  }
}
function ah(t, e, n, r) {
  var i = X, o = jn.transition;
  jn.transition = null;
  try {
    X = 4, cl(t, e, n, r);
  } finally {
    X = i, jn.transition = o;
  }
}
function cl(t, e, n, r) {
  if (Oi) {
    var i = Ss(t, e, n, r);
    if (i === null) jo(t, e, r, ji, n), cu(t, r);
    else if (sh(i, t, e, n, r)) r.stopPropagation();
    else if (cu(t, r), e & 4 && -1 < oh.indexOf(t)) {
      for (; i !== null; ) {
        var o = Hr(i);
        if (o !== null && dc(o), o = Ss(t, e, n, r), o === null && jo(t, e, r, ji, n), o === i) break;
        i = o;
      }
      i !== null && r.stopPropagation();
    } else jo(t, e, r, null, n);
  }
}
var ji = null;
function Ss(t, e, n, r) {
  if (ji = null, t = sl(r), t = rn(t), t !== null) if (e = yn(t), e === null) t = null;
  else if (n = e.tag, n === 13) {
    if (t = rc(e), t !== null) return t;
    t = null;
  } else if (n === 3) {
    if (e.stateNode.current.memoizedState.isDehydrated) return e.tag === 3 ? e.stateNode.containerInfo : null;
    t = null;
  } else e !== t && (t = null);
  return ji = t, null;
}
function yc(t) {
  switch (t) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (Kf()) {
        case ll:
          return 1;
        case lc:
          return 4;
        case Ai:
        case Zf:
          return 16;
        case uc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var jt = null, dl = null, zi = null;
function vc() {
  if (zi) return zi;
  var t, e = dl, n = e.length, r, i = "value" in jt ? jt.value : jt.textContent, o = i.length;
  for (t = 0; t < n && e[t] === i[t]; t++) ;
  var s = n - t;
  for (r = 1; r <= s && e[n - r] === i[o - r]; r++) ;
  return zi = i.slice(t, 1 < r ? 1 - r : void 0);
}
function Ci(t) {
  var e = t.keyCode;
  return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
}
function oi() {
  return !0;
}
function fu() {
  return !1;
}
function Ve(t) {
  function e(n, r, i, o, s) {
    this._reactName = n, this._targetInst = i, this.type = r, this.nativeEvent = o, this.target = s, this.currentTarget = null;
    for (var l in t) t.hasOwnProperty(l) && (n = t[l], this[l] = n ? n(o) : o[l]);
    return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? oi : fu, this.isPropagationStopped = fu, this;
  }
  return ne(e.prototype, { preventDefault: function() {
    this.defaultPrevented = !0;
    var n = this.nativeEvent;
    n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = oi);
  }, stopPropagation: function() {
    var n = this.nativeEvent;
    n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = oi);
  }, persist: function() {
  }, isPersistent: oi }), e;
}
var Qn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(t) {
  return t.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, fl = Ve(Qn), Ur = ne({}, Qn, { view: 0, detail: 0 }), ch = Ve(Ur), To, Mo, tr, oo = ne({}, Ur, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: hl, button: 0, buttons: 0, relatedTarget: function(t) {
  return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
}, movementX: function(t) {
  return "movementX" in t ? t.movementX : (t !== tr && (tr && t.type === "mousemove" ? (To = t.screenX - tr.screenX, Mo = t.screenY - tr.screenY) : Mo = To = 0, tr = t), To);
}, movementY: function(t) {
  return "movementY" in t ? t.movementY : Mo;
} }), hu = Ve(oo), dh = ne({}, oo, { dataTransfer: 0 }), fh = Ve(dh), hh = ne({}, Ur, { relatedTarget: 0 }), Ro = Ve(hh), ph = ne({}, Qn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), mh = Ve(ph), yh = ne({}, Qn, { clipboardData: function(t) {
  return "clipboardData" in t ? t.clipboardData : window.clipboardData;
} }), vh = Ve(yh), gh = ne({}, Qn, { data: 0 }), pu = Ve(gh), wh = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, xh = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Sh = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Eh(t) {
  var e = this.nativeEvent;
  return e.getModifierState ? e.getModifierState(t) : (t = Sh[t]) ? !!e[t] : !1;
}
function hl() {
  return Eh;
}
var zh = ne({}, Ur, { key: function(t) {
  if (t.key) {
    var e = wh[t.key] || t.key;
    if (e !== "Unidentified") return e;
  }
  return t.type === "keypress" ? (t = Ci(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? xh[t.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: hl, charCode: function(t) {
  return t.type === "keypress" ? Ci(t) : 0;
}, keyCode: function(t) {
  return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
}, which: function(t) {
  return t.type === "keypress" ? Ci(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
} }), Ch = Ve(zh), kh = ne({}, oo, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), mu = Ve(kh), _h = ne({}, Ur, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: hl }), Nh = Ve(_h), Ph = ne({}, Qn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Th = Ve(Ph), Mh = ne({}, oo, {
  deltaX: function(t) {
    return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
  },
  deltaY: function(t) {
    return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Rh = Ve(Mh), Lh = [9, 13, 27, 32], pl = kt && "CompositionEvent" in window, mr = null;
kt && "documentMode" in document && (mr = document.documentMode);
var Bh = kt && "TextEvent" in window && !mr, gc = kt && (!pl || mr && 8 < mr && 11 >= mr), yu = " ", vu = !1;
function wc(t, e) {
  switch (t) {
    case "keyup":
      return Lh.indexOf(e.keyCode) !== -1;
    case "keydown":
      return e.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function xc(t) {
  return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
}
var Cn = !1;
function Fh(t, e) {
  switch (t) {
    case "compositionend":
      return xc(e);
    case "keypress":
      return e.which !== 32 ? null : (vu = !0, yu);
    case "textInput":
      return t = e.data, t === yu && vu ? null : t;
    default:
      return null;
  }
}
function Ah(t, e) {
  if (Cn) return t === "compositionend" || !pl && wc(t, e) ? (t = vc(), zi = dl = jt = null, Cn = !1, t) : null;
  switch (t) {
    case "paste":
      return null;
    case "keypress":
      if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
        if (e.char && 1 < e.char.length) return e.char;
        if (e.which) return String.fromCharCode(e.which);
      }
      return null;
    case "compositionend":
      return gc && e.locale !== "ko" ? null : e.data;
    default:
      return null;
  }
}
var Ih = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
function gu(t) {
  var e = t && t.nodeName && t.nodeName.toLowerCase();
  return e === "input" ? !!Ih[t.type] : e === "textarea";
}
function Sc(t, e, n, r) {
  Ja(r), e = Di(e, "onChange"), 0 < e.length && (n = new fl("onChange", "change", null, n, r), t.push({ event: n, listeners: e }));
}
var yr = null, Mr = null;
function Oh(t) {
  Lc(t, 0);
}
function so(t) {
  var e = Nn(t);
  if ($a(e)) return t;
}
function jh(t, e) {
  if (t === "change") return e;
}
var Ec = !1;
if (kt) {
  var Lo;
  if (kt) {
    var Bo = "oninput" in document;
    if (!Bo) {
      var wu = document.createElement("div");
      wu.setAttribute("oninput", "return;"), Bo = typeof wu.oninput == "function";
    }
    Lo = Bo;
  } else Lo = !1;
  Ec = Lo && (!document.documentMode || 9 < document.documentMode);
}
function xu() {
  yr && (yr.detachEvent("onpropertychange", zc), Mr = yr = null);
}
function zc(t) {
  if (t.propertyName === "value" && so(Mr)) {
    var e = [];
    Sc(e, Mr, t, sl(t)), nc(Oh, e);
  }
}
function Dh(t, e, n) {
  t === "focusin" ? (xu(), yr = e, Mr = n, yr.attachEvent("onpropertychange", zc)) : t === "focusout" && xu();
}
function Wh(t) {
  if (t === "selectionchange" || t === "keyup" || t === "keydown") return so(Mr);
}
function Vh(t, e) {
  if (t === "click") return so(e);
}
function qh(t, e) {
  if (t === "input" || t === "change") return so(e);
}
function Uh(t, e) {
  return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
}
var it = typeof Object.is == "function" ? Object.is : Uh;
function Rr(t, e) {
  if (it(t, e)) return !0;
  if (typeof t != "object" || t === null || typeof e != "object" || e === null) return !1;
  var n = Object.keys(t), r = Object.keys(e);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var i = n[r];
    if (!rs.call(e, i) || !it(t[i], e[i])) return !1;
  }
  return !0;
}
function Su(t) {
  for (; t && t.firstChild; ) t = t.firstChild;
  return t;
}
function Eu(t, e) {
  var n = Su(t);
  t = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (r = t + n.textContent.length, t <= e && r >= e) return { node: n, offset: e - t };
      t = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = Su(n);
  }
}
function Cc(t, e) {
  return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? Cc(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
}
function kc() {
  for (var t = window, e = Li(); e instanceof t.HTMLIFrameElement; ) {
    try {
      var n = typeof e.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) t = e.contentWindow;
    else break;
    e = Li(t.document);
  }
  return e;
}
function ml(t) {
  var e = t && t.nodeName && t.nodeName.toLowerCase();
  return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
}
function Hh(t) {
  var e = kc(), n = t.focusedElem, r = t.selectionRange;
  if (e !== n && n && n.ownerDocument && Cc(n.ownerDocument.documentElement, n)) {
    if (r !== null && ml(n)) {
      if (e = r.start, t = r.end, t === void 0 && (t = e), "selectionStart" in n) n.selectionStart = e, n.selectionEnd = Math.min(t, n.value.length);
      else if (t = (e = n.ownerDocument || document) && e.defaultView || window, t.getSelection) {
        t = t.getSelection();
        var i = n.textContent.length, o = Math.min(r.start, i);
        r = r.end === void 0 ? o : Math.min(r.end, i), !t.extend && o > r && (i = r, r = o, o = i), i = Eu(n, o);
        var s = Eu(
          n,
          r
        );
        i && s && (t.rangeCount !== 1 || t.anchorNode !== i.node || t.anchorOffset !== i.offset || t.focusNode !== s.node || t.focusOffset !== s.offset) && (e = e.createRange(), e.setStart(i.node, i.offset), t.removeAllRanges(), o > r ? (t.addRange(e), t.extend(s.node, s.offset)) : (e.setEnd(s.node, s.offset), t.addRange(e)));
      }
    }
    for (e = [], t = n; t = t.parentNode; ) t.nodeType === 1 && e.push({ element: t, left: t.scrollLeft, top: t.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < e.length; n++) t = e[n], t.element.scrollLeft = t.left, t.element.scrollTop = t.top;
  }
}
var $h = kt && "documentMode" in document && 11 >= document.documentMode, kn = null, Es = null, vr = null, zs = !1;
function zu(t, e, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  zs || kn == null || kn !== Li(r) || (r = kn, "selectionStart" in r && ml(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), vr && Rr(vr, r) || (vr = r, r = Di(Es, "onSelect"), 0 < r.length && (e = new fl("onSelect", "select", null, e, n), t.push({ event: e, listeners: r }), e.target = kn)));
}
function si(t, e) {
  var n = {};
  return n[t.toLowerCase()] = e.toLowerCase(), n["Webkit" + t] = "webkit" + e, n["Moz" + t] = "moz" + e, n;
}
var _n = { animationend: si("Animation", "AnimationEnd"), animationiteration: si("Animation", "AnimationIteration"), animationstart: si("Animation", "AnimationStart"), transitionend: si("Transition", "TransitionEnd") }, Fo = {}, _c = {};
kt && (_c = document.createElement("div").style, "AnimationEvent" in window || (delete _n.animationend.animation, delete _n.animationiteration.animation, delete _n.animationstart.animation), "TransitionEvent" in window || delete _n.transitionend.transition);
function lo(t) {
  if (Fo[t]) return Fo[t];
  if (!_n[t]) return t;
  var e = _n[t], n;
  for (n in e) if (e.hasOwnProperty(n) && n in _c) return Fo[t] = e[n];
  return t;
}
var Nc = lo("animationend"), Pc = lo("animationiteration"), Tc = lo("animationstart"), Mc = lo("transitionend"), Rc = /* @__PURE__ */ new Map(), Cu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function Kt(t, e) {
  Rc.set(t, e), mn(e, [t]);
}
for (var Ao = 0; Ao < Cu.length; Ao++) {
  var Io = Cu[Ao], Gh = Io.toLowerCase(), Yh = Io[0].toUpperCase() + Io.slice(1);
  Kt(Gh, "on" + Yh);
}
Kt(Nc, "onAnimationEnd");
Kt(Pc, "onAnimationIteration");
Kt(Tc, "onAnimationStart");
Kt("dblclick", "onDoubleClick");
Kt("focusin", "onFocus");
Kt("focusout", "onBlur");
Kt(Mc, "onTransitionEnd");
Vn("onMouseEnter", ["mouseout", "mouseover"]);
Vn("onMouseLeave", ["mouseout", "mouseover"]);
Vn("onPointerEnter", ["pointerout", "pointerover"]);
Vn("onPointerLeave", ["pointerout", "pointerover"]);
mn("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
mn("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
mn("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
mn("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
mn("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
mn("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var fr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Xh = new Set("cancel close invalid load scroll toggle".split(" ").concat(fr));
function ku(t, e, n) {
  var r = t.type || "unknown-event";
  t.currentTarget = n, Gf(r, e, void 0, t), t.currentTarget = null;
}
function Lc(t, e) {
  e = (e & 4) !== 0;
  for (var n = 0; n < t.length; n++) {
    var r = t[n], i = r.event;
    r = r.listeners;
    e: {
      var o = void 0;
      if (e) for (var s = r.length - 1; 0 <= s; s--) {
        var l = r[s], u = l.instance, a = l.currentTarget;
        if (l = l.listener, u !== o && i.isPropagationStopped()) break e;
        ku(i, l, a), o = u;
      }
      else for (s = 0; s < r.length; s++) {
        if (l = r[s], u = l.instance, a = l.currentTarget, l = l.listener, u !== o && i.isPropagationStopped()) break e;
        ku(i, l, a), o = u;
      }
    }
  }
  if (Fi) throw t = gs, Fi = !1, gs = null, t;
}
function Z(t, e) {
  var n = e[Ps];
  n === void 0 && (n = e[Ps] = /* @__PURE__ */ new Set());
  var r = t + "__bubble";
  n.has(r) || (Bc(e, t, 2, !1), n.add(r));
}
function Oo(t, e, n) {
  var r = 0;
  e && (r |= 4), Bc(n, t, r, e);
}
var li = "_reactListening" + Math.random().toString(36).slice(2);
function Lr(t) {
  if (!t[li]) {
    t[li] = !0, Wa.forEach(function(n) {
      n !== "selectionchange" && (Xh.has(n) || Oo(n, !1, t), Oo(n, !0, t));
    });
    var e = t.nodeType === 9 ? t : t.ownerDocument;
    e === null || e[li] || (e[li] = !0, Oo("selectionchange", !1, e));
  }
}
function Bc(t, e, n, r) {
  switch (yc(e)) {
    case 1:
      var i = uh;
      break;
    case 4:
      i = ah;
      break;
    default:
      i = cl;
  }
  n = i.bind(null, e, n, t), i = void 0, !vs || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (i = !0), r ? i !== void 0 ? t.addEventListener(e, n, { capture: !0, passive: i }) : t.addEventListener(e, n, !0) : i !== void 0 ? t.addEventListener(e, n, { passive: i }) : t.addEventListener(e, n, !1);
}
function jo(t, e, n, r, i) {
  var o = r;
  if (!(e & 1) && !(e & 2) && r !== null) e: for (; ; ) {
    if (r === null) return;
    var s = r.tag;
    if (s === 3 || s === 4) {
      var l = r.stateNode.containerInfo;
      if (l === i || l.nodeType === 8 && l.parentNode === i) break;
      if (s === 4) for (s = r.return; s !== null; ) {
        var u = s.tag;
        if ((u === 3 || u === 4) && (u = s.stateNode.containerInfo, u === i || u.nodeType === 8 && u.parentNode === i)) return;
        s = s.return;
      }
      for (; l !== null; ) {
        if (s = rn(l), s === null) return;
        if (u = s.tag, u === 5 || u === 6) {
          r = o = s;
          continue e;
        }
        l = l.parentNode;
      }
    }
    r = r.return;
  }
  nc(function() {
    var a = o, h = sl(n), p = [];
    e: {
      var c = Rc.get(t);
      if (c !== void 0) {
        var y = fl, v = t;
        switch (t) {
          case "keypress":
            if (Ci(n) === 0) break e;
          case "keydown":
          case "keyup":
            y = Ch;
            break;
          case "focusin":
            v = "focus", y = Ro;
            break;
          case "focusout":
            v = "blur", y = Ro;
            break;
          case "beforeblur":
          case "afterblur":
            y = Ro;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            y = hu;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            y = fh;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            y = Nh;
            break;
          case Nc:
          case Pc:
          case Tc:
            y = mh;
            break;
          case Mc:
            y = Th;
            break;
          case "scroll":
            y = ch;
            break;
          case "wheel":
            y = Rh;
            break;
          case "copy":
          case "cut":
          case "paste":
            y = vh;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            y = mu;
        }
        var w = (e & 4) !== 0, S = !w && t === "scroll", m = w ? c !== null ? c + "Capture" : null : c;
        w = [];
        for (var d = a, g; d !== null; ) {
          g = d;
          var x = g.stateNode;
          if (g.tag === 5 && x !== null && (g = x, m !== null && (x = _r(d, m), x != null && w.push(Br(d, x, g)))), S) break;
          d = d.return;
        }
        0 < w.length && (c = new y(c, v, null, n, h), p.push({ event: c, listeners: w }));
      }
    }
    if (!(e & 7)) {
      e: {
        if (c = t === "mouseover" || t === "pointerover", y = t === "mouseout" || t === "pointerout", c && n !== ms && (v = n.relatedTarget || n.fromElement) && (rn(v) || v[_t])) break e;
        if ((y || c) && (c = h.window === h ? h : (c = h.ownerDocument) ? c.defaultView || c.parentWindow : window, y ? (v = n.relatedTarget || n.toElement, y = a, v = v ? rn(v) : null, v !== null && (S = yn(v), v !== S || v.tag !== 5 && v.tag !== 6) && (v = null)) : (y = null, v = a), y !== v)) {
          if (w = hu, x = "onMouseLeave", m = "onMouseEnter", d = "mouse", (t === "pointerout" || t === "pointerover") && (w = mu, x = "onPointerLeave", m = "onPointerEnter", d = "pointer"), S = y == null ? c : Nn(y), g = v == null ? c : Nn(v), c = new w(x, d + "leave", y, n, h), c.target = S, c.relatedTarget = g, x = null, rn(h) === a && (w = new w(m, d + "enter", v, n, h), w.target = g, w.relatedTarget = S, x = w), S = x, y && v) t: {
            for (w = y, m = v, d = 0, g = w; g; g = vn(g)) d++;
            for (g = 0, x = m; x; x = vn(x)) g++;
            for (; 0 < d - g; ) w = vn(w), d--;
            for (; 0 < g - d; ) m = vn(m), g--;
            for (; d--; ) {
              if (w === m || m !== null && w === m.alternate) break t;
              w = vn(w), m = vn(m);
            }
            w = null;
          }
          else w = null;
          y !== null && _u(p, c, y, w, !1), v !== null && S !== null && _u(p, S, v, w, !0);
        }
      }
      e: {
        if (c = a ? Nn(a) : window, y = c.nodeName && c.nodeName.toLowerCase(), y === "select" || y === "input" && c.type === "file") var E = jh;
        else if (gu(c)) if (Ec) E = qh;
        else {
          E = Wh;
          var z = Dh;
        }
        else (y = c.nodeName) && y.toLowerCase() === "input" && (c.type === "checkbox" || c.type === "radio") && (E = Vh);
        if (E && (E = E(t, a))) {
          Sc(p, E, n, h);
          break e;
        }
        z && z(t, c, a), t === "focusout" && (z = c._wrapperState) && z.controlled && c.type === "number" && cs(c, "number", c.value);
      }
      switch (z = a ? Nn(a) : window, t) {
        case "focusin":
          (gu(z) || z.contentEditable === "true") && (kn = z, Es = a, vr = null);
          break;
        case "focusout":
          vr = Es = kn = null;
          break;
        case "mousedown":
          zs = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          zs = !1, zu(p, n, h);
          break;
        case "selectionchange":
          if ($h) break;
        case "keydown":
        case "keyup":
          zu(p, n, h);
      }
      var C;
      if (pl) e: {
        switch (t) {
          case "compositionstart":
            var k = "onCompositionStart";
            break e;
          case "compositionend":
            k = "onCompositionEnd";
            break e;
          case "compositionupdate":
            k = "onCompositionUpdate";
            break e;
        }
        k = void 0;
      }
      else Cn ? wc(t, n) && (k = "onCompositionEnd") : t === "keydown" && n.keyCode === 229 && (k = "onCompositionStart");
      k && (gc && n.locale !== "ko" && (Cn || k !== "onCompositionStart" ? k === "onCompositionEnd" && Cn && (C = vc()) : (jt = h, dl = "value" in jt ? jt.value : jt.textContent, Cn = !0)), z = Di(a, k), 0 < z.length && (k = new pu(k, t, null, n, h), p.push({ event: k, listeners: z }), C ? k.data = C : (C = xc(n), C !== null && (k.data = C)))), (C = Bh ? Fh(t, n) : Ah(t, n)) && (a = Di(a, "onBeforeInput"), 0 < a.length && (h = new pu("onBeforeInput", "beforeinput", null, n, h), p.push({ event: h, listeners: a }), h.data = C));
    }
    Lc(p, e);
  });
}
function Br(t, e, n) {
  return { instance: t, listener: e, currentTarget: n };
}
function Di(t, e) {
  for (var n = e + "Capture", r = []; t !== null; ) {
    var i = t, o = i.stateNode;
    i.tag === 5 && o !== null && (i = o, o = _r(t, n), o != null && r.unshift(Br(t, o, i)), o = _r(t, e), o != null && r.push(Br(t, o, i))), t = t.return;
  }
  return r;
}
function vn(t) {
  if (t === null) return null;
  do
    t = t.return;
  while (t && t.tag !== 5);
  return t || null;
}
function _u(t, e, n, r, i) {
  for (var o = e._reactName, s = []; n !== null && n !== r; ) {
    var l = n, u = l.alternate, a = l.stateNode;
    if (u !== null && u === r) break;
    l.tag === 5 && a !== null && (l = a, i ? (u = _r(n, o), u != null && s.unshift(Br(n, u, l))) : i || (u = _r(n, o), u != null && s.push(Br(n, u, l)))), n = n.return;
  }
  s.length !== 0 && t.push({ event: e, listeners: s });
}
var Qh = /\r\n?/g, Kh = /\u0000|\uFFFD/g;
function Nu(t) {
  return (typeof t == "string" ? t : "" + t).replace(Qh, `
`).replace(Kh, "");
}
function ui(t, e, n) {
  if (e = Nu(e), Nu(t) !== e && n) throw Error(T(425));
}
function Wi() {
}
var Cs = null, ks = null;
function _s(t, e) {
  return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
}
var Ns = typeof setTimeout == "function" ? setTimeout : void 0, Zh = typeof clearTimeout == "function" ? clearTimeout : void 0, Pu = typeof Promise == "function" ? Promise : void 0, Jh = typeof queueMicrotask == "function" ? queueMicrotask : typeof Pu < "u" ? function(t) {
  return Pu.resolve(null).then(t).catch(bh);
} : Ns;
function bh(t) {
  setTimeout(function() {
    throw t;
  });
}
function Do(t, e) {
  var n = e, r = 0;
  do {
    var i = n.nextSibling;
    if (t.removeChild(n), i && i.nodeType === 8) if (n = i.data, n === "/$") {
      if (r === 0) {
        t.removeChild(i), Tr(e);
        return;
      }
      r--;
    } else n !== "$" && n !== "$?" && n !== "$!" || r++;
    n = i;
  } while (n);
  Tr(e);
}
function Ut(t) {
  for (; t != null; t = t.nextSibling) {
    var e = t.nodeType;
    if (e === 1 || e === 3) break;
    if (e === 8) {
      if (e = t.data, e === "$" || e === "$!" || e === "$?") break;
      if (e === "/$") return null;
    }
  }
  return t;
}
function Tu(t) {
  t = t.previousSibling;
  for (var e = 0; t; ) {
    if (t.nodeType === 8) {
      var n = t.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (e === 0) return t;
        e--;
      } else n === "/$" && e++;
    }
    t = t.previousSibling;
  }
  return null;
}
var Kn = Math.random().toString(36).slice(2), ft = "__reactFiber$" + Kn, Fr = "__reactProps$" + Kn, _t = "__reactContainer$" + Kn, Ps = "__reactEvents$" + Kn, ep = "__reactListeners$" + Kn, tp = "__reactHandles$" + Kn;
function rn(t) {
  var e = t[ft];
  if (e) return e;
  for (var n = t.parentNode; n; ) {
    if (e = n[_t] || n[ft]) {
      if (n = e.alternate, e.child !== null || n !== null && n.child !== null) for (t = Tu(t); t !== null; ) {
        if (n = t[ft]) return n;
        t = Tu(t);
      }
      return e;
    }
    t = n, n = t.parentNode;
  }
  return null;
}
function Hr(t) {
  return t = t[ft] || t[_t], !t || t.tag !== 5 && t.tag !== 6 && t.tag !== 13 && t.tag !== 3 ? null : t;
}
function Nn(t) {
  if (t.tag === 5 || t.tag === 6) return t.stateNode;
  throw Error(T(33));
}
function uo(t) {
  return t[Fr] || null;
}
var Ts = [], Pn = -1;
function Zt(t) {
  return { current: t };
}
function J(t) {
  0 > Pn || (t.current = Ts[Pn], Ts[Pn] = null, Pn--);
}
function Q(t, e) {
  Pn++, Ts[Pn] = t.current, t.current = e;
}
var Qt = {}, Ee = Zt(Qt), Le = Zt(!1), cn = Qt;
function qn(t, e) {
  var n = t.type.contextTypes;
  if (!n) return Qt;
  var r = t.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === e) return r.__reactInternalMemoizedMaskedChildContext;
  var i = {}, o;
  for (o in n) i[o] = e[o];
  return r && (t = t.stateNode, t.__reactInternalMemoizedUnmaskedChildContext = e, t.__reactInternalMemoizedMaskedChildContext = i), i;
}
function Be(t) {
  return t = t.childContextTypes, t != null;
}
function Vi() {
  J(Le), J(Ee);
}
function Mu(t, e, n) {
  if (Ee.current !== Qt) throw Error(T(168));
  Q(Ee, e), Q(Le, n);
}
function Fc(t, e, n) {
  var r = t.stateNode;
  if (e = e.childContextTypes, typeof r.getChildContext != "function") return n;
  r = r.getChildContext();
  for (var i in r) if (!(i in e)) throw Error(T(108, Df(t) || "Unknown", i));
  return ne({}, n, r);
}
function qi(t) {
  return t = (t = t.stateNode) && t.__reactInternalMemoizedMergedChildContext || Qt, cn = Ee.current, Q(Ee, t), Q(Le, Le.current), !0;
}
function Ru(t, e, n) {
  var r = t.stateNode;
  if (!r) throw Error(T(169));
  n ? (t = Fc(t, e, cn), r.__reactInternalMemoizedMergedChildContext = t, J(Le), J(Ee), Q(Ee, t)) : J(Le), Q(Le, n);
}
var St = null, ao = !1, Wo = !1;
function Ac(t) {
  St === null ? St = [t] : St.push(t);
}
function np(t) {
  ao = !0, Ac(t);
}
function Jt() {
  if (!Wo && St !== null) {
    Wo = !0;
    var t = 0, e = X;
    try {
      var n = St;
      for (X = 1; t < n.length; t++) {
        var r = n[t];
        do
          r = r(!0);
        while (r !== null);
      }
      St = null, ao = !1;
    } catch (i) {
      throw St !== null && (St = St.slice(t + 1)), sc(ll, Jt), i;
    } finally {
      X = e, Wo = !1;
    }
  }
  return null;
}
var Tn = [], Mn = 0, Ui = null, Hi = 0, Ue = [], He = 0, dn = null, Et = 1, zt = "";
function en(t, e) {
  Tn[Mn++] = Hi, Tn[Mn++] = Ui, Ui = t, Hi = e;
}
function Ic(t, e, n) {
  Ue[He++] = Et, Ue[He++] = zt, Ue[He++] = dn, dn = t;
  var r = Et;
  t = zt;
  var i = 32 - nt(r) - 1;
  r &= ~(1 << i), n += 1;
  var o = 32 - nt(e) + i;
  if (30 < o) {
    var s = i - i % 5;
    o = (r & (1 << s) - 1).toString(32), r >>= s, i -= s, Et = 1 << 32 - nt(e) + i | n << i | r, zt = o + t;
  } else Et = 1 << o | n << i | r, zt = t;
}
function yl(t) {
  t.return !== null && (en(t, 1), Ic(t, 1, 0));
}
function vl(t) {
  for (; t === Ui; ) Ui = Tn[--Mn], Tn[Mn] = null, Hi = Tn[--Mn], Tn[Mn] = null;
  for (; t === dn; ) dn = Ue[--He], Ue[He] = null, zt = Ue[--He], Ue[He] = null, Et = Ue[--He], Ue[He] = null;
}
var je = null, Oe = null, b = !1, et = null;
function Oc(t, e) {
  var n = $e(5, null, null, 0);
  n.elementType = "DELETED", n.stateNode = e, n.return = t, e = t.deletions, e === null ? (t.deletions = [n], t.flags |= 16) : e.push(n);
}
function Lu(t, e) {
  switch (t.tag) {
    case 5:
      var n = t.type;
      return e = e.nodeType !== 1 || n.toLowerCase() !== e.nodeName.toLowerCase() ? null : e, e !== null ? (t.stateNode = e, je = t, Oe = Ut(e.firstChild), !0) : !1;
    case 6:
      return e = t.pendingProps === "" || e.nodeType !== 3 ? null : e, e !== null ? (t.stateNode = e, je = t, Oe = null, !0) : !1;
    case 13:
      return e = e.nodeType !== 8 ? null : e, e !== null ? (n = dn !== null ? { id: Et, overflow: zt } : null, t.memoizedState = { dehydrated: e, treeContext: n, retryLane: 1073741824 }, n = $e(18, null, null, 0), n.stateNode = e, n.return = t, t.child = n, je = t, Oe = null, !0) : !1;
    default:
      return !1;
  }
}
function Ms(t) {
  return (t.mode & 1) !== 0 && (t.flags & 128) === 0;
}
function Rs(t) {
  if (b) {
    var e = Oe;
    if (e) {
      var n = e;
      if (!Lu(t, e)) {
        if (Ms(t)) throw Error(T(418));
        e = Ut(n.nextSibling);
        var r = je;
        e && Lu(t, e) ? Oc(r, n) : (t.flags = t.flags & -4097 | 2, b = !1, je = t);
      }
    } else {
      if (Ms(t)) throw Error(T(418));
      t.flags = t.flags & -4097 | 2, b = !1, je = t;
    }
  }
}
function Bu(t) {
  for (t = t.return; t !== null && t.tag !== 5 && t.tag !== 3 && t.tag !== 13; ) t = t.return;
  je = t;
}
function ai(t) {
  if (t !== je) return !1;
  if (!b) return Bu(t), b = !0, !1;
  var e;
  if ((e = t.tag !== 3) && !(e = t.tag !== 5) && (e = t.type, e = e !== "head" && e !== "body" && !_s(t.type, t.memoizedProps)), e && (e = Oe)) {
    if (Ms(t)) throw jc(), Error(T(418));
    for (; e; ) Oc(t, e), e = Ut(e.nextSibling);
  }
  if (Bu(t), t.tag === 13) {
    if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(T(317));
    e: {
      for (t = t.nextSibling, e = 0; t; ) {
        if (t.nodeType === 8) {
          var n = t.data;
          if (n === "/$") {
            if (e === 0) {
              Oe = Ut(t.nextSibling);
              break e;
            }
            e--;
          } else n !== "$" && n !== "$!" && n !== "$?" || e++;
        }
        t = t.nextSibling;
      }
      Oe = null;
    }
  } else Oe = je ? Ut(t.stateNode.nextSibling) : null;
  return !0;
}
function jc() {
  for (var t = Oe; t; ) t = Ut(t.nextSibling);
}
function Un() {
  Oe = je = null, b = !1;
}
function gl(t) {
  et === null ? et = [t] : et.push(t);
}
var rp = Tt.ReactCurrentBatchConfig;
function nr(t, e, n) {
  if (t = n.ref, t !== null && typeof t != "function" && typeof t != "object") {
    if (n._owner) {
      if (n = n._owner, n) {
        if (n.tag !== 1) throw Error(T(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(T(147, t));
      var i = r, o = "" + t;
      return e !== null && e.ref !== null && typeof e.ref == "function" && e.ref._stringRef === o ? e.ref : (e = function(s) {
        var l = i.refs;
        s === null ? delete l[o] : l[o] = s;
      }, e._stringRef = o, e);
    }
    if (typeof t != "string") throw Error(T(284));
    if (!n._owner) throw Error(T(290, t));
  }
  return t;
}
function ci(t, e) {
  throw t = Object.prototype.toString.call(e), Error(T(31, t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t));
}
function Fu(t) {
  var e = t._init;
  return e(t._payload);
}
function Dc(t) {
  function e(m, d) {
    if (t) {
      var g = m.deletions;
      g === null ? (m.deletions = [d], m.flags |= 16) : g.push(d);
    }
  }
  function n(m, d) {
    if (!t) return null;
    for (; d !== null; ) e(m, d), d = d.sibling;
    return null;
  }
  function r(m, d) {
    for (m = /* @__PURE__ */ new Map(); d !== null; ) d.key !== null ? m.set(d.key, d) : m.set(d.index, d), d = d.sibling;
    return m;
  }
  function i(m, d) {
    return m = Yt(m, d), m.index = 0, m.sibling = null, m;
  }
  function o(m, d, g) {
    return m.index = g, t ? (g = m.alternate, g !== null ? (g = g.index, g < d ? (m.flags |= 2, d) : g) : (m.flags |= 2, d)) : (m.flags |= 1048576, d);
  }
  function s(m) {
    return t && m.alternate === null && (m.flags |= 2), m;
  }
  function l(m, d, g, x) {
    return d === null || d.tag !== 6 ? (d = Yo(g, m.mode, x), d.return = m, d) : (d = i(d, g), d.return = m, d);
  }
  function u(m, d, g, x) {
    var E = g.type;
    return E === zn ? h(m, d, g.props.children, x, g.key) : d !== null && (d.elementType === E || typeof E == "object" && E !== null && E.$$typeof === Bt && Fu(E) === d.type) ? (x = i(d, g.props), x.ref = nr(m, d, g), x.return = m, x) : (x = Ri(g.type, g.key, g.props, null, m.mode, x), x.ref = nr(m, d, g), x.return = m, x);
  }
  function a(m, d, g, x) {
    return d === null || d.tag !== 4 || d.stateNode.containerInfo !== g.containerInfo || d.stateNode.implementation !== g.implementation ? (d = Xo(g, m.mode, x), d.return = m, d) : (d = i(d, g.children || []), d.return = m, d);
  }
  function h(m, d, g, x, E) {
    return d === null || d.tag !== 7 ? (d = an(g, m.mode, x, E), d.return = m, d) : (d = i(d, g), d.return = m, d);
  }
  function p(m, d, g) {
    if (typeof d == "string" && d !== "" || typeof d == "number") return d = Yo("" + d, m.mode, g), d.return = m, d;
    if (typeof d == "object" && d !== null) {
      switch (d.$$typeof) {
        case br:
          return g = Ri(d.type, d.key, d.props, null, m.mode, g), g.ref = nr(m, null, d), g.return = m, g;
        case En:
          return d = Xo(d, m.mode, g), d.return = m, d;
        case Bt:
          var x = d._init;
          return p(m, x(d._payload), g);
      }
      if (cr(d) || Zn(d)) return d = an(d, m.mode, g, null), d.return = m, d;
      ci(m, d);
    }
    return null;
  }
  function c(m, d, g, x) {
    var E = d !== null ? d.key : null;
    if (typeof g == "string" && g !== "" || typeof g == "number") return E !== null ? null : l(m, d, "" + g, x);
    if (typeof g == "object" && g !== null) {
      switch (g.$$typeof) {
        case br:
          return g.key === E ? u(m, d, g, x) : null;
        case En:
          return g.key === E ? a(m, d, g, x) : null;
        case Bt:
          return E = g._init, c(
            m,
            d,
            E(g._payload),
            x
          );
      }
      if (cr(g) || Zn(g)) return E !== null ? null : h(m, d, g, x, null);
      ci(m, g);
    }
    return null;
  }
  function y(m, d, g, x, E) {
    if (typeof x == "string" && x !== "" || typeof x == "number") return m = m.get(g) || null, l(d, m, "" + x, E);
    if (typeof x == "object" && x !== null) {
      switch (x.$$typeof) {
        case br:
          return m = m.get(x.key === null ? g : x.key) || null, u(d, m, x, E);
        case En:
          return m = m.get(x.key === null ? g : x.key) || null, a(d, m, x, E);
        case Bt:
          var z = x._init;
          return y(m, d, g, z(x._payload), E);
      }
      if (cr(x) || Zn(x)) return m = m.get(g) || null, h(d, m, x, E, null);
      ci(d, x);
    }
    return null;
  }
  function v(m, d, g, x) {
    for (var E = null, z = null, C = d, k = d = 0, O = null; C !== null && k < g.length; k++) {
      C.index > k ? (O = C, C = null) : O = C.sibling;
      var M = c(m, C, g[k], x);
      if (M === null) {
        C === null && (C = O);
        break;
      }
      t && C && M.alternate === null && e(m, C), d = o(M, d, k), z === null ? E = M : z.sibling = M, z = M, C = O;
    }
    if (k === g.length) return n(m, C), b && en(m, k), E;
    if (C === null) {
      for (; k < g.length; k++) C = p(m, g[k], x), C !== null && (d = o(C, d, k), z === null ? E = C : z.sibling = C, z = C);
      return b && en(m, k), E;
    }
    for (C = r(m, C); k < g.length; k++) O = y(C, m, k, g[k], x), O !== null && (t && O.alternate !== null && C.delete(O.key === null ? k : O.key), d = o(O, d, k), z === null ? E = O : z.sibling = O, z = O);
    return t && C.forEach(function(D) {
      return e(m, D);
    }), b && en(m, k), E;
  }
  function w(m, d, g, x) {
    var E = Zn(g);
    if (typeof E != "function") throw Error(T(150));
    if (g = E.call(g), g == null) throw Error(T(151));
    for (var z = E = null, C = d, k = d = 0, O = null, M = g.next(); C !== null && !M.done; k++, M = g.next()) {
      C.index > k ? (O = C, C = null) : O = C.sibling;
      var D = c(m, C, M.value, x);
      if (D === null) {
        C === null && (C = O);
        break;
      }
      t && C && D.alternate === null && e(m, C), d = o(D, d, k), z === null ? E = D : z.sibling = D, z = D, C = O;
    }
    if (M.done) return n(
      m,
      C
    ), b && en(m, k), E;
    if (C === null) {
      for (; !M.done; k++, M = g.next()) M = p(m, M.value, x), M !== null && (d = o(M, d, k), z === null ? E = M : z.sibling = M, z = M);
      return b && en(m, k), E;
    }
    for (C = r(m, C); !M.done; k++, M = g.next()) M = y(C, m, k, M.value, x), M !== null && (t && M.alternate !== null && C.delete(M.key === null ? k : M.key), d = o(M, d, k), z === null ? E = M : z.sibling = M, z = M);
    return t && C.forEach(function(V) {
      return e(m, V);
    }), b && en(m, k), E;
  }
  function S(m, d, g, x) {
    if (typeof g == "object" && g !== null && g.type === zn && g.key === null && (g = g.props.children), typeof g == "object" && g !== null) {
      switch (g.$$typeof) {
        case br:
          e: {
            for (var E = g.key, z = d; z !== null; ) {
              if (z.key === E) {
                if (E = g.type, E === zn) {
                  if (z.tag === 7) {
                    n(m, z.sibling), d = i(z, g.props.children), d.return = m, m = d;
                    break e;
                  }
                } else if (z.elementType === E || typeof E == "object" && E !== null && E.$$typeof === Bt && Fu(E) === z.type) {
                  n(m, z.sibling), d = i(z, g.props), d.ref = nr(m, z, g), d.return = m, m = d;
                  break e;
                }
                n(m, z);
                break;
              } else e(m, z);
              z = z.sibling;
            }
            g.type === zn ? (d = an(g.props.children, m.mode, x, g.key), d.return = m, m = d) : (x = Ri(g.type, g.key, g.props, null, m.mode, x), x.ref = nr(m, d, g), x.return = m, m = x);
          }
          return s(m);
        case En:
          e: {
            for (z = g.key; d !== null; ) {
              if (d.key === z) if (d.tag === 4 && d.stateNode.containerInfo === g.containerInfo && d.stateNode.implementation === g.implementation) {
                n(m, d.sibling), d = i(d, g.children || []), d.return = m, m = d;
                break e;
              } else {
                n(m, d);
                break;
              }
              else e(m, d);
              d = d.sibling;
            }
            d = Xo(g, m.mode, x), d.return = m, m = d;
          }
          return s(m);
        case Bt:
          return z = g._init, S(m, d, z(g._payload), x);
      }
      if (cr(g)) return v(m, d, g, x);
      if (Zn(g)) return w(m, d, g, x);
      ci(m, g);
    }
    return typeof g == "string" && g !== "" || typeof g == "number" ? (g = "" + g, d !== null && d.tag === 6 ? (n(m, d.sibling), d = i(d, g), d.return = m, m = d) : (n(m, d), d = Yo(g, m.mode, x), d.return = m, m = d), s(m)) : n(m, d);
  }
  return S;
}
var Hn = Dc(!0), Wc = Dc(!1), $i = Zt(null), Gi = null, Rn = null, wl = null;
function xl() {
  wl = Rn = Gi = null;
}
function Sl(t) {
  var e = $i.current;
  J($i), t._currentValue = e;
}
function Ls(t, e, n) {
  for (; t !== null; ) {
    var r = t.alternate;
    if ((t.childLanes & e) !== e ? (t.childLanes |= e, r !== null && (r.childLanes |= e)) : r !== null && (r.childLanes & e) !== e && (r.childLanes |= e), t === n) break;
    t = t.return;
  }
}
function Dn(t, e) {
  Gi = t, wl = Rn = null, t = t.dependencies, t !== null && t.firstContext !== null && (t.lanes & e && (Re = !0), t.firstContext = null);
}
function Ye(t) {
  var e = t._currentValue;
  if (wl !== t) if (t = { context: t, memoizedValue: e, next: null }, Rn === null) {
    if (Gi === null) throw Error(T(308));
    Rn = t, Gi.dependencies = { lanes: 0, firstContext: t };
  } else Rn = Rn.next = t;
  return e;
}
var on = null;
function El(t) {
  on === null ? on = [t] : on.push(t);
}
function Vc(t, e, n, r) {
  var i = e.interleaved;
  return i === null ? (n.next = n, El(e)) : (n.next = i.next, i.next = n), e.interleaved = n, Nt(t, r);
}
function Nt(t, e) {
  t.lanes |= e;
  var n = t.alternate;
  for (n !== null && (n.lanes |= e), n = t, t = t.return; t !== null; ) t.childLanes |= e, n = t.alternate, n !== null && (n.childLanes |= e), n = t, t = t.return;
  return n.tag === 3 ? n.stateNode : null;
}
var Ft = !1;
function zl(t) {
  t.updateQueue = { baseState: t.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function qc(t, e) {
  t = t.updateQueue, e.updateQueue === t && (e.updateQueue = { baseState: t.baseState, firstBaseUpdate: t.firstBaseUpdate, lastBaseUpdate: t.lastBaseUpdate, shared: t.shared, effects: t.effects });
}
function Ct(t, e) {
  return { eventTime: t, lane: e, tag: 0, payload: null, callback: null, next: null };
}
function Ht(t, e, n) {
  var r = t.updateQueue;
  if (r === null) return null;
  if (r = r.shared, $ & 2) {
    var i = r.pending;
    return i === null ? e.next = e : (e.next = i.next, i.next = e), r.pending = e, Nt(t, n);
  }
  return i = r.interleaved, i === null ? (e.next = e, El(r)) : (e.next = i.next, i.next = e), r.interleaved = e, Nt(t, n);
}
function ki(t, e, n) {
  if (e = e.updateQueue, e !== null && (e = e.shared, (n & 4194240) !== 0)) {
    var r = e.lanes;
    r &= t.pendingLanes, n |= r, e.lanes = n, ul(t, n);
  }
}
function Au(t, e) {
  var n = t.updateQueue, r = t.alternate;
  if (r !== null && (r = r.updateQueue, n === r)) {
    var i = null, o = null;
    if (n = n.firstBaseUpdate, n !== null) {
      do {
        var s = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
        o === null ? i = o = s : o = o.next = s, n = n.next;
      } while (n !== null);
      o === null ? i = o = e : o = o.next = e;
    } else i = o = e;
    n = { baseState: r.baseState, firstBaseUpdate: i, lastBaseUpdate: o, shared: r.shared, effects: r.effects }, t.updateQueue = n;
    return;
  }
  t = n.lastBaseUpdate, t === null ? n.firstBaseUpdate = e : t.next = e, n.lastBaseUpdate = e;
}
function Yi(t, e, n, r) {
  var i = t.updateQueue;
  Ft = !1;
  var o = i.firstBaseUpdate, s = i.lastBaseUpdate, l = i.shared.pending;
  if (l !== null) {
    i.shared.pending = null;
    var u = l, a = u.next;
    u.next = null, s === null ? o = a : s.next = a, s = u;
    var h = t.alternate;
    h !== null && (h = h.updateQueue, l = h.lastBaseUpdate, l !== s && (l === null ? h.firstBaseUpdate = a : l.next = a, h.lastBaseUpdate = u));
  }
  if (o !== null) {
    var p = i.baseState;
    s = 0, h = a = u = null, l = o;
    do {
      var c = l.lane, y = l.eventTime;
      if ((r & c) === c) {
        h !== null && (h = h.next = {
          eventTime: y,
          lane: 0,
          tag: l.tag,
          payload: l.payload,
          callback: l.callback,
          next: null
        });
        e: {
          var v = t, w = l;
          switch (c = e, y = n, w.tag) {
            case 1:
              if (v = w.payload, typeof v == "function") {
                p = v.call(y, p, c);
                break e;
              }
              p = v;
              break e;
            case 3:
              v.flags = v.flags & -65537 | 128;
            case 0:
              if (v = w.payload, c = typeof v == "function" ? v.call(y, p, c) : v, c == null) break e;
              p = ne({}, p, c);
              break e;
            case 2:
              Ft = !0;
          }
        }
        l.callback !== null && l.lane !== 0 && (t.flags |= 64, c = i.effects, c === null ? i.effects = [l] : c.push(l));
      } else y = { eventTime: y, lane: c, tag: l.tag, payload: l.payload, callback: l.callback, next: null }, h === null ? (a = h = y, u = p) : h = h.next = y, s |= c;
      if (l = l.next, l === null) {
        if (l = i.shared.pending, l === null) break;
        c = l, l = c.next, c.next = null, i.lastBaseUpdate = c, i.shared.pending = null;
      }
    } while (!0);
    if (h === null && (u = p), i.baseState = u, i.firstBaseUpdate = a, i.lastBaseUpdate = h, e = i.shared.interleaved, e !== null) {
      i = e;
      do
        s |= i.lane, i = i.next;
      while (i !== e);
    } else o === null && (i.shared.lanes = 0);
    hn |= s, t.lanes = s, t.memoizedState = p;
  }
}
function Iu(t, e, n) {
  if (t = e.effects, e.effects = null, t !== null) for (e = 0; e < t.length; e++) {
    var r = t[e], i = r.callback;
    if (i !== null) {
      if (r.callback = null, r = n, typeof i != "function") throw Error(T(191, i));
      i.call(r);
    }
  }
}
var $r = {}, pt = Zt($r), Ar = Zt($r), Ir = Zt($r);
function sn(t) {
  if (t === $r) throw Error(T(174));
  return t;
}
function Cl(t, e) {
  switch (Q(Ir, e), Q(Ar, t), Q(pt, $r), t = e.nodeType, t) {
    case 9:
    case 11:
      e = (e = e.documentElement) ? e.namespaceURI : fs(null, "");
      break;
    default:
      t = t === 8 ? e.parentNode : e, e = t.namespaceURI || null, t = t.tagName, e = fs(e, t);
  }
  J(pt), Q(pt, e);
}
function $n() {
  J(pt), J(Ar), J(Ir);
}
function Uc(t) {
  sn(Ir.current);
  var e = sn(pt.current), n = fs(e, t.type);
  e !== n && (Q(Ar, t), Q(pt, n));
}
function kl(t) {
  Ar.current === t && (J(pt), J(Ar));
}
var ee = Zt(0);
function Xi(t) {
  for (var e = t; e !== null; ) {
    if (e.tag === 13) {
      var n = e.memoizedState;
      if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return e;
    } else if (e.tag === 19 && e.memoizedProps.revealOrder !== void 0) {
      if (e.flags & 128) return e;
    } else if (e.child !== null) {
      e.child.return = e, e = e.child;
      continue;
    }
    if (e === t) break;
    for (; e.sibling === null; ) {
      if (e.return === null || e.return === t) return null;
      e = e.return;
    }
    e.sibling.return = e.return, e = e.sibling;
  }
  return null;
}
var Vo = [];
function _l() {
  for (var t = 0; t < Vo.length; t++) Vo[t]._workInProgressVersionPrimary = null;
  Vo.length = 0;
}
var _i = Tt.ReactCurrentDispatcher, qo = Tt.ReactCurrentBatchConfig, fn = 0, te = null, de = null, pe = null, Qi = !1, gr = !1, Or = 0, ip = 0;
function we() {
  throw Error(T(321));
}
function Nl(t, e) {
  if (e === null) return !1;
  for (var n = 0; n < e.length && n < t.length; n++) if (!it(t[n], e[n])) return !1;
  return !0;
}
function Pl(t, e, n, r, i, o) {
  if (fn = o, te = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, _i.current = t === null || t.memoizedState === null ? up : ap, t = n(r, i), gr) {
    o = 0;
    do {
      if (gr = !1, Or = 0, 25 <= o) throw Error(T(301));
      o += 1, pe = de = null, e.updateQueue = null, _i.current = cp, t = n(r, i);
    } while (gr);
  }
  if (_i.current = Ki, e = de !== null && de.next !== null, fn = 0, pe = de = te = null, Qi = !1, e) throw Error(T(300));
  return t;
}
function Tl() {
  var t = Or !== 0;
  return Or = 0, t;
}
function dt() {
  var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return pe === null ? te.memoizedState = pe = t : pe = pe.next = t, pe;
}
function Xe() {
  if (de === null) {
    var t = te.alternate;
    t = t !== null ? t.memoizedState : null;
  } else t = de.next;
  var e = pe === null ? te.memoizedState : pe.next;
  if (e !== null) pe = e, de = t;
  else {
    if (t === null) throw Error(T(310));
    de = t, t = { memoizedState: de.memoizedState, baseState: de.baseState, baseQueue: de.baseQueue, queue: de.queue, next: null }, pe === null ? te.memoizedState = pe = t : pe = pe.next = t;
  }
  return pe;
}
function jr(t, e) {
  return typeof e == "function" ? e(t) : e;
}
function Uo(t) {
  var e = Xe(), n = e.queue;
  if (n === null) throw Error(T(311));
  n.lastRenderedReducer = t;
  var r = de, i = r.baseQueue, o = n.pending;
  if (o !== null) {
    if (i !== null) {
      var s = i.next;
      i.next = o.next, o.next = s;
    }
    r.baseQueue = i = o, n.pending = null;
  }
  if (i !== null) {
    o = i.next, r = r.baseState;
    var l = s = null, u = null, a = o;
    do {
      var h = a.lane;
      if ((fn & h) === h) u !== null && (u = u.next = { lane: 0, action: a.action, hasEagerState: a.hasEagerState, eagerState: a.eagerState, next: null }), r = a.hasEagerState ? a.eagerState : t(r, a.action);
      else {
        var p = {
          lane: h,
          action: a.action,
          hasEagerState: a.hasEagerState,
          eagerState: a.eagerState,
          next: null
        };
        u === null ? (l = u = p, s = r) : u = u.next = p, te.lanes |= h, hn |= h;
      }
      a = a.next;
    } while (a !== null && a !== o);
    u === null ? s = r : u.next = l, it(r, e.memoizedState) || (Re = !0), e.memoizedState = r, e.baseState = s, e.baseQueue = u, n.lastRenderedState = r;
  }
  if (t = n.interleaved, t !== null) {
    i = t;
    do
      o = i.lane, te.lanes |= o, hn |= o, i = i.next;
    while (i !== t);
  } else i === null && (n.lanes = 0);
  return [e.memoizedState, n.dispatch];
}
function Ho(t) {
  var e = Xe(), n = e.queue;
  if (n === null) throw Error(T(311));
  n.lastRenderedReducer = t;
  var r = n.dispatch, i = n.pending, o = e.memoizedState;
  if (i !== null) {
    n.pending = null;
    var s = i = i.next;
    do
      o = t(o, s.action), s = s.next;
    while (s !== i);
    it(o, e.memoizedState) || (Re = !0), e.memoizedState = o, e.baseQueue === null && (e.baseState = o), n.lastRenderedState = o;
  }
  return [o, r];
}
function Hc() {
}
function $c(t, e) {
  var n = te, r = Xe(), i = e(), o = !it(r.memoizedState, i);
  if (o && (r.memoizedState = i, Re = !0), r = r.queue, Ml(Xc.bind(null, n, r, t), [t]), r.getSnapshot !== e || o || pe !== null && pe.memoizedState.tag & 1) {
    if (n.flags |= 2048, Dr(9, Yc.bind(null, n, r, i, e), void 0, null), me === null) throw Error(T(349));
    fn & 30 || Gc(n, e, i);
  }
  return i;
}
function Gc(t, e, n) {
  t.flags |= 16384, t = { getSnapshot: e, value: n }, e = te.updateQueue, e === null ? (e = { lastEffect: null, stores: null }, te.updateQueue = e, e.stores = [t]) : (n = e.stores, n === null ? e.stores = [t] : n.push(t));
}
function Yc(t, e, n, r) {
  e.value = n, e.getSnapshot = r, Qc(e) && Kc(t);
}
function Xc(t, e, n) {
  return n(function() {
    Qc(e) && Kc(t);
  });
}
function Qc(t) {
  var e = t.getSnapshot;
  t = t.value;
  try {
    var n = e();
    return !it(t, n);
  } catch {
    return !0;
  }
}
function Kc(t) {
  var e = Nt(t, 1);
  e !== null && rt(e, t, 1, -1);
}
function Ou(t) {
  var e = dt();
  return typeof t == "function" && (t = t()), e.memoizedState = e.baseState = t, t = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: jr, lastRenderedState: t }, e.queue = t, t = t.dispatch = lp.bind(null, te, t), [e.memoizedState, t];
}
function Dr(t, e, n, r) {
  return t = { tag: t, create: e, destroy: n, deps: r, next: null }, e = te.updateQueue, e === null ? (e = { lastEffect: null, stores: null }, te.updateQueue = e, e.lastEffect = t.next = t) : (n = e.lastEffect, n === null ? e.lastEffect = t.next = t : (r = n.next, n.next = t, t.next = r, e.lastEffect = t)), t;
}
function Zc() {
  return Xe().memoizedState;
}
function Ni(t, e, n, r) {
  var i = dt();
  te.flags |= t, i.memoizedState = Dr(1 | e, n, void 0, r === void 0 ? null : r);
}
function co(t, e, n, r) {
  var i = Xe();
  r = r === void 0 ? null : r;
  var o = void 0;
  if (de !== null) {
    var s = de.memoizedState;
    if (o = s.destroy, r !== null && Nl(r, s.deps)) {
      i.memoizedState = Dr(e, n, o, r);
      return;
    }
  }
  te.flags |= t, i.memoizedState = Dr(1 | e, n, o, r);
}
function ju(t, e) {
  return Ni(8390656, 8, t, e);
}
function Ml(t, e) {
  return co(2048, 8, t, e);
}
function Jc(t, e) {
  return co(4, 2, t, e);
}
function bc(t, e) {
  return co(4, 4, t, e);
}
function ed(t, e) {
  if (typeof e == "function") return t = t(), e(t), function() {
    e(null);
  };
  if (e != null) return t = t(), e.current = t, function() {
    e.current = null;
  };
}
function td(t, e, n) {
  return n = n != null ? n.concat([t]) : null, co(4, 4, ed.bind(null, e, t), n);
}
function Rl() {
}
function nd(t, e) {
  var n = Xe();
  e = e === void 0 ? null : e;
  var r = n.memoizedState;
  return r !== null && e !== null && Nl(e, r[1]) ? r[0] : (n.memoizedState = [t, e], t);
}
function rd(t, e) {
  var n = Xe();
  e = e === void 0 ? null : e;
  var r = n.memoizedState;
  return r !== null && e !== null && Nl(e, r[1]) ? r[0] : (t = t(), n.memoizedState = [t, e], t);
}
function id(t, e, n) {
  return fn & 21 ? (it(n, e) || (n = ac(), te.lanes |= n, hn |= n, t.baseState = !0), e) : (t.baseState && (t.baseState = !1, Re = !0), t.memoizedState = n);
}
function op(t, e) {
  var n = X;
  X = n !== 0 && 4 > n ? n : 4, t(!0);
  var r = qo.transition;
  qo.transition = {};
  try {
    t(!1), e();
  } finally {
    X = n, qo.transition = r;
  }
}
function od() {
  return Xe().memoizedState;
}
function sp(t, e, n) {
  var r = Gt(t);
  if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, sd(t)) ld(e, n);
  else if (n = Vc(t, e, n, r), n !== null) {
    var i = Ce();
    rt(n, t, r, i), ud(n, e, r);
  }
}
function lp(t, e, n) {
  var r = Gt(t), i = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (sd(t)) ld(e, i);
  else {
    var o = t.alternate;
    if (t.lanes === 0 && (o === null || o.lanes === 0) && (o = e.lastRenderedReducer, o !== null)) try {
      var s = e.lastRenderedState, l = o(s, n);
      if (i.hasEagerState = !0, i.eagerState = l, it(l, s)) {
        var u = e.interleaved;
        u === null ? (i.next = i, El(e)) : (i.next = u.next, u.next = i), e.interleaved = i;
        return;
      }
    } catch {
    } finally {
    }
    n = Vc(t, e, i, r), n !== null && (i = Ce(), rt(n, t, r, i), ud(n, e, r));
  }
}
function sd(t) {
  var e = t.alternate;
  return t === te || e !== null && e === te;
}
function ld(t, e) {
  gr = Qi = !0;
  var n = t.pending;
  n === null ? e.next = e : (e.next = n.next, n.next = e), t.pending = e;
}
function ud(t, e, n) {
  if (n & 4194240) {
    var r = e.lanes;
    r &= t.pendingLanes, n |= r, e.lanes = n, ul(t, n);
  }
}
var Ki = { readContext: Ye, useCallback: we, useContext: we, useEffect: we, useImperativeHandle: we, useInsertionEffect: we, useLayoutEffect: we, useMemo: we, useReducer: we, useRef: we, useState: we, useDebugValue: we, useDeferredValue: we, useTransition: we, useMutableSource: we, useSyncExternalStore: we, useId: we, unstable_isNewReconciler: !1 }, up = { readContext: Ye, useCallback: function(t, e) {
  return dt().memoizedState = [t, e === void 0 ? null : e], t;
}, useContext: Ye, useEffect: ju, useImperativeHandle: function(t, e, n) {
  return n = n != null ? n.concat([t]) : null, Ni(
    4194308,
    4,
    ed.bind(null, e, t),
    n
  );
}, useLayoutEffect: function(t, e) {
  return Ni(4194308, 4, t, e);
}, useInsertionEffect: function(t, e) {
  return Ni(4, 2, t, e);
}, useMemo: function(t, e) {
  var n = dt();
  return e = e === void 0 ? null : e, t = t(), n.memoizedState = [t, e], t;
}, useReducer: function(t, e, n) {
  var r = dt();
  return e = n !== void 0 ? n(e) : e, r.memoizedState = r.baseState = e, t = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: t, lastRenderedState: e }, r.queue = t, t = t.dispatch = sp.bind(null, te, t), [r.memoizedState, t];
}, useRef: function(t) {
  var e = dt();
  return t = { current: t }, e.memoizedState = t;
}, useState: Ou, useDebugValue: Rl, useDeferredValue: function(t) {
  return dt().memoizedState = t;
}, useTransition: function() {
  var t = Ou(!1), e = t[0];
  return t = op.bind(null, t[1]), dt().memoizedState = t, [e, t];
}, useMutableSource: function() {
}, useSyncExternalStore: function(t, e, n) {
  var r = te, i = dt();
  if (b) {
    if (n === void 0) throw Error(T(407));
    n = n();
  } else {
    if (n = e(), me === null) throw Error(T(349));
    fn & 30 || Gc(r, e, n);
  }
  i.memoizedState = n;
  var o = { value: n, getSnapshot: e };
  return i.queue = o, ju(Xc.bind(
    null,
    r,
    o,
    t
  ), [t]), r.flags |= 2048, Dr(9, Yc.bind(null, r, o, n, e), void 0, null), n;
}, useId: function() {
  var t = dt(), e = me.identifierPrefix;
  if (b) {
    var n = zt, r = Et;
    n = (r & ~(1 << 32 - nt(r) - 1)).toString(32) + n, e = ":" + e + "R" + n, n = Or++, 0 < n && (e += "H" + n.toString(32)), e += ":";
  } else n = ip++, e = ":" + e + "r" + n.toString(32) + ":";
  return t.memoizedState = e;
}, unstable_isNewReconciler: !1 }, ap = {
  readContext: Ye,
  useCallback: nd,
  useContext: Ye,
  useEffect: Ml,
  useImperativeHandle: td,
  useInsertionEffect: Jc,
  useLayoutEffect: bc,
  useMemo: rd,
  useReducer: Uo,
  useRef: Zc,
  useState: function() {
    return Uo(jr);
  },
  useDebugValue: Rl,
  useDeferredValue: function(t) {
    var e = Xe();
    return id(e, de.memoizedState, t);
  },
  useTransition: function() {
    var t = Uo(jr)[0], e = Xe().memoizedState;
    return [t, e];
  },
  useMutableSource: Hc,
  useSyncExternalStore: $c,
  useId: od,
  unstable_isNewReconciler: !1
}, cp = { readContext: Ye, useCallback: nd, useContext: Ye, useEffect: Ml, useImperativeHandle: td, useInsertionEffect: Jc, useLayoutEffect: bc, useMemo: rd, useReducer: Ho, useRef: Zc, useState: function() {
  return Ho(jr);
}, useDebugValue: Rl, useDeferredValue: function(t) {
  var e = Xe();
  return de === null ? e.memoizedState = t : id(e, de.memoizedState, t);
}, useTransition: function() {
  var t = Ho(jr)[0], e = Xe().memoizedState;
  return [t, e];
}, useMutableSource: Hc, useSyncExternalStore: $c, useId: od, unstable_isNewReconciler: !1 };
function Je(t, e) {
  if (t && t.defaultProps) {
    e = ne({}, e), t = t.defaultProps;
    for (var n in t) e[n] === void 0 && (e[n] = t[n]);
    return e;
  }
  return e;
}
function Bs(t, e, n, r) {
  e = t.memoizedState, n = n(r, e), n = n == null ? e : ne({}, e, n), t.memoizedState = n, t.lanes === 0 && (t.updateQueue.baseState = n);
}
var fo = { isMounted: function(t) {
  return (t = t._reactInternals) ? yn(t) === t : !1;
}, enqueueSetState: function(t, e, n) {
  t = t._reactInternals;
  var r = Ce(), i = Gt(t), o = Ct(r, i);
  o.payload = e, n != null && (o.callback = n), e = Ht(t, o, i), e !== null && (rt(e, t, i, r), ki(e, t, i));
}, enqueueReplaceState: function(t, e, n) {
  t = t._reactInternals;
  var r = Ce(), i = Gt(t), o = Ct(r, i);
  o.tag = 1, o.payload = e, n != null && (o.callback = n), e = Ht(t, o, i), e !== null && (rt(e, t, i, r), ki(e, t, i));
}, enqueueForceUpdate: function(t, e) {
  t = t._reactInternals;
  var n = Ce(), r = Gt(t), i = Ct(n, r);
  i.tag = 2, e != null && (i.callback = e), e = Ht(t, i, r), e !== null && (rt(e, t, r, n), ki(e, t, r));
} };
function Du(t, e, n, r, i, o, s) {
  return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(r, o, s) : e.prototype && e.prototype.isPureReactComponent ? !Rr(n, r) || !Rr(i, o) : !0;
}
function ad(t, e, n) {
  var r = !1, i = Qt, o = e.contextType;
  return typeof o == "object" && o !== null ? o = Ye(o) : (i = Be(e) ? cn : Ee.current, r = e.contextTypes, o = (r = r != null) ? qn(t, i) : Qt), e = new e(n, o), t.memoizedState = e.state !== null && e.state !== void 0 ? e.state : null, e.updater = fo, t.stateNode = e, e._reactInternals = t, r && (t = t.stateNode, t.__reactInternalMemoizedUnmaskedChildContext = i, t.__reactInternalMemoizedMaskedChildContext = o), e;
}
function Wu(t, e, n, r) {
  t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(n, r), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(n, r), e.state !== t && fo.enqueueReplaceState(e, e.state, null);
}
function Fs(t, e, n, r) {
  var i = t.stateNode;
  i.props = n, i.state = t.memoizedState, i.refs = {}, zl(t);
  var o = e.contextType;
  typeof o == "object" && o !== null ? i.context = Ye(o) : (o = Be(e) ? cn : Ee.current, i.context = qn(t, o)), i.state = t.memoizedState, o = e.getDerivedStateFromProps, typeof o == "function" && (Bs(t, e, o, n), i.state = t.memoizedState), typeof e.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (e = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), e !== i.state && fo.enqueueReplaceState(i, i.state, null), Yi(t, n, i, r), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308);
}
function Gn(t, e) {
  try {
    var n = "", r = e;
    do
      n += jf(r), r = r.return;
    while (r);
    var i = n;
  } catch (o) {
    i = `
Error generating stack: ` + o.message + `
` + o.stack;
  }
  return { value: t, source: e, stack: i, digest: null };
}
function $o(t, e, n) {
  return { value: t, source: null, stack: n ?? null, digest: e ?? null };
}
function As(t, e) {
  try {
    console.error(e.value);
  } catch (n) {
    setTimeout(function() {
      throw n;
    });
  }
}
var dp = typeof WeakMap == "function" ? WeakMap : Map;
function cd(t, e, n) {
  n = Ct(-1, n), n.tag = 3, n.payload = { element: null };
  var r = e.value;
  return n.callback = function() {
    Ji || (Ji = !0, $s = r), As(t, e);
  }, n;
}
function dd(t, e, n) {
  n = Ct(-1, n), n.tag = 3;
  var r = t.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var i = e.value;
    n.payload = function() {
      return r(i);
    }, n.callback = function() {
      As(t, e);
    };
  }
  var o = t.stateNode;
  return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
    As(t, e), typeof r != "function" && ($t === null ? $t = /* @__PURE__ */ new Set([this]) : $t.add(this));
    var s = e.stack;
    this.componentDidCatch(e.value, { componentStack: s !== null ? s : "" });
  }), n;
}
function Vu(t, e, n) {
  var r = t.pingCache;
  if (r === null) {
    r = t.pingCache = new dp();
    var i = /* @__PURE__ */ new Set();
    r.set(e, i);
  } else i = r.get(e), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(e, i));
  i.has(n) || (i.add(n), t = kp.bind(null, t, e, n), e.then(t, t));
}
function qu(t) {
  do {
    var e;
    if ((e = t.tag === 13) && (e = t.memoizedState, e = e !== null ? e.dehydrated !== null : !0), e) return t;
    t = t.return;
  } while (t !== null);
  return null;
}
function Uu(t, e, n, r, i) {
  return t.mode & 1 ? (t.flags |= 65536, t.lanes = i, t) : (t === e ? t.flags |= 65536 : (t.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (e = Ct(-1, 1), e.tag = 2, Ht(n, e, 1))), n.lanes |= 1), t);
}
var fp = Tt.ReactCurrentOwner, Re = !1;
function ze(t, e, n, r) {
  e.child = t === null ? Wc(e, null, n, r) : Hn(e, t.child, n, r);
}
function Hu(t, e, n, r, i) {
  n = n.render;
  var o = e.ref;
  return Dn(e, i), r = Pl(t, e, n, r, o, i), n = Tl(), t !== null && !Re ? (e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~i, Pt(t, e, i)) : (b && n && yl(e), e.flags |= 1, ze(t, e, r, i), e.child);
}
function $u(t, e, n, r, i) {
  if (t === null) {
    var o = n.type;
    return typeof o == "function" && !Dl(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (e.tag = 15, e.type = o, fd(t, e, o, r, i)) : (t = Ri(n.type, null, r, e, e.mode, i), t.ref = e.ref, t.return = e, e.child = t);
  }
  if (o = t.child, !(t.lanes & i)) {
    var s = o.memoizedProps;
    if (n = n.compare, n = n !== null ? n : Rr, n(s, r) && t.ref === e.ref) return Pt(t, e, i);
  }
  return e.flags |= 1, t = Yt(o, r), t.ref = e.ref, t.return = e, e.child = t;
}
function fd(t, e, n, r, i) {
  if (t !== null) {
    var o = t.memoizedProps;
    if (Rr(o, r) && t.ref === e.ref) if (Re = !1, e.pendingProps = r = o, (t.lanes & i) !== 0) t.flags & 131072 && (Re = !0);
    else return e.lanes = t.lanes, Pt(t, e, i);
  }
  return Is(t, e, n, r, i);
}
function hd(t, e, n) {
  var r = e.pendingProps, i = r.children, o = t !== null ? t.memoizedState : null;
  if (r.mode === "hidden") if (!(e.mode & 1)) e.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Q(Bn, Ie), Ie |= n;
  else {
    if (!(n & 1073741824)) return t = o !== null ? o.baseLanes | n : n, e.lanes = e.childLanes = 1073741824, e.memoizedState = { baseLanes: t, cachePool: null, transitions: null }, e.updateQueue = null, Q(Bn, Ie), Ie |= t, null;
    e.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = o !== null ? o.baseLanes : n, Q(Bn, Ie), Ie |= r;
  }
  else o !== null ? (r = o.baseLanes | n, e.memoizedState = null) : r = n, Q(Bn, Ie), Ie |= r;
  return ze(t, e, i, n), e.child;
}
function pd(t, e) {
  var n = e.ref;
  (t === null && n !== null || t !== null && t.ref !== n) && (e.flags |= 512, e.flags |= 2097152);
}
function Is(t, e, n, r, i) {
  var o = Be(n) ? cn : Ee.current;
  return o = qn(e, o), Dn(e, i), n = Pl(t, e, n, r, o, i), r = Tl(), t !== null && !Re ? (e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~i, Pt(t, e, i)) : (b && r && yl(e), e.flags |= 1, ze(t, e, n, i), e.child);
}
function Gu(t, e, n, r, i) {
  if (Be(n)) {
    var o = !0;
    qi(e);
  } else o = !1;
  if (Dn(e, i), e.stateNode === null) Pi(t, e), ad(e, n, r), Fs(e, n, r, i), r = !0;
  else if (t === null) {
    var s = e.stateNode, l = e.memoizedProps;
    s.props = l;
    var u = s.context, a = n.contextType;
    typeof a == "object" && a !== null ? a = Ye(a) : (a = Be(n) ? cn : Ee.current, a = qn(e, a));
    var h = n.getDerivedStateFromProps, p = typeof h == "function" || typeof s.getSnapshotBeforeUpdate == "function";
    p || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (l !== r || u !== a) && Wu(e, s, r, a), Ft = !1;
    var c = e.memoizedState;
    s.state = c, Yi(e, r, s, i), u = e.memoizedState, l !== r || c !== u || Le.current || Ft ? (typeof h == "function" && (Bs(e, n, h, r), u = e.memoizedState), (l = Ft || Du(e, n, l, r, c, u, a)) ? (p || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()), typeof s.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof s.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = r, e.memoizedState = u), s.props = r, s.state = u, s.context = a, r = l) : (typeof s.componentDidMount == "function" && (e.flags |= 4194308), r = !1);
  } else {
    s = e.stateNode, qc(t, e), l = e.memoizedProps, a = e.type === e.elementType ? l : Je(e.type, l), s.props = a, p = e.pendingProps, c = s.context, u = n.contextType, typeof u == "object" && u !== null ? u = Ye(u) : (u = Be(n) ? cn : Ee.current, u = qn(e, u));
    var y = n.getDerivedStateFromProps;
    (h = typeof y == "function" || typeof s.getSnapshotBeforeUpdate == "function") || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (l !== p || c !== u) && Wu(e, s, r, u), Ft = !1, c = e.memoizedState, s.state = c, Yi(e, r, s, i);
    var v = e.memoizedState;
    l !== p || c !== v || Le.current || Ft ? (typeof y == "function" && (Bs(e, n, y, r), v = e.memoizedState), (a = Ft || Du(e, n, a, r, c, v, u) || !1) ? (h || typeof s.UNSAFE_componentWillUpdate != "function" && typeof s.componentWillUpdate != "function" || (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(r, v, u), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(r, v, u)), typeof s.componentDidUpdate == "function" && (e.flags |= 4), typeof s.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof s.componentDidUpdate != "function" || l === t.memoizedProps && c === t.memoizedState || (e.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || l === t.memoizedProps && c === t.memoizedState || (e.flags |= 1024), e.memoizedProps = r, e.memoizedState = v), s.props = r, s.state = v, s.context = u, r = a) : (typeof s.componentDidUpdate != "function" || l === t.memoizedProps && c === t.memoizedState || (e.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || l === t.memoizedProps && c === t.memoizedState || (e.flags |= 1024), r = !1);
  }
  return Os(t, e, n, r, o, i);
}
function Os(t, e, n, r, i, o) {
  pd(t, e);
  var s = (e.flags & 128) !== 0;
  if (!r && !s) return i && Ru(e, n, !1), Pt(t, e, o);
  r = e.stateNode, fp.current = e;
  var l = s && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return e.flags |= 1, t !== null && s ? (e.child = Hn(e, t.child, null, o), e.child = Hn(e, null, l, o)) : ze(t, e, l, o), e.memoizedState = r.state, i && Ru(e, n, !0), e.child;
}
function md(t) {
  var e = t.stateNode;
  e.pendingContext ? Mu(t, e.pendingContext, e.pendingContext !== e.context) : e.context && Mu(t, e.context, !1), Cl(t, e.containerInfo);
}
function Yu(t, e, n, r, i) {
  return Un(), gl(i), e.flags |= 256, ze(t, e, n, r), e.child;
}
var js = { dehydrated: null, treeContext: null, retryLane: 0 };
function Ds(t) {
  return { baseLanes: t, cachePool: null, transitions: null };
}
function yd(t, e, n) {
  var r = e.pendingProps, i = ee.current, o = !1, s = (e.flags & 128) !== 0, l;
  if ((l = s) || (l = t !== null && t.memoizedState === null ? !1 : (i & 2) !== 0), l ? (o = !0, e.flags &= -129) : (t === null || t.memoizedState !== null) && (i |= 1), Q(ee, i & 1), t === null)
    return Rs(e), t = e.memoizedState, t !== null && (t = t.dehydrated, t !== null) ? (e.mode & 1 ? t.data === "$!" ? e.lanes = 8 : e.lanes = 1073741824 : e.lanes = 1, null) : (s = r.children, t = r.fallback, o ? (r = e.mode, o = e.child, s = { mode: "hidden", children: s }, !(r & 1) && o !== null ? (o.childLanes = 0, o.pendingProps = s) : o = mo(s, r, 0, null), t = an(t, r, n, null), o.return = e, t.return = e, o.sibling = t, e.child = o, e.child.memoizedState = Ds(n), e.memoizedState = js, t) : Ll(e, s));
  if (i = t.memoizedState, i !== null && (l = i.dehydrated, l !== null)) return hp(t, e, s, r, l, i, n);
  if (o) {
    o = r.fallback, s = e.mode, i = t.child, l = i.sibling;
    var u = { mode: "hidden", children: r.children };
    return !(s & 1) && e.child !== i ? (r = e.child, r.childLanes = 0, r.pendingProps = u, e.deletions = null) : (r = Yt(i, u), r.subtreeFlags = i.subtreeFlags & 14680064), l !== null ? o = Yt(l, o) : (o = an(o, s, n, null), o.flags |= 2), o.return = e, r.return = e, r.sibling = o, e.child = r, r = o, o = e.child, s = t.child.memoizedState, s = s === null ? Ds(n) : { baseLanes: s.baseLanes | n, cachePool: null, transitions: s.transitions }, o.memoizedState = s, o.childLanes = t.childLanes & ~n, e.memoizedState = js, r;
  }
  return o = t.child, t = o.sibling, r = Yt(o, { mode: "visible", children: r.children }), !(e.mode & 1) && (r.lanes = n), r.return = e, r.sibling = null, t !== null && (n = e.deletions, n === null ? (e.deletions = [t], e.flags |= 16) : n.push(t)), e.child = r, e.memoizedState = null, r;
}
function Ll(t, e) {
  return e = mo({ mode: "visible", children: e }, t.mode, 0, null), e.return = t, t.child = e;
}
function di(t, e, n, r) {
  return r !== null && gl(r), Hn(e, t.child, null, n), t = Ll(e, e.pendingProps.children), t.flags |= 2, e.memoizedState = null, t;
}
function hp(t, e, n, r, i, o, s) {
  if (n)
    return e.flags & 256 ? (e.flags &= -257, r = $o(Error(T(422))), di(t, e, s, r)) : e.memoizedState !== null ? (e.child = t.child, e.flags |= 128, null) : (o = r.fallback, i = e.mode, r = mo({ mode: "visible", children: r.children }, i, 0, null), o = an(o, i, s, null), o.flags |= 2, r.return = e, o.return = e, r.sibling = o, e.child = r, e.mode & 1 && Hn(e, t.child, null, s), e.child.memoizedState = Ds(s), e.memoizedState = js, o);
  if (!(e.mode & 1)) return di(t, e, s, null);
  if (i.data === "$!") {
    if (r = i.nextSibling && i.nextSibling.dataset, r) var l = r.dgst;
    return r = l, o = Error(T(419)), r = $o(o, r, void 0), di(t, e, s, r);
  }
  if (l = (s & t.childLanes) !== 0, Re || l) {
    if (r = me, r !== null) {
      switch (s & -s) {
        case 4:
          i = 2;
          break;
        case 16:
          i = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          i = 32;
          break;
        case 536870912:
          i = 268435456;
          break;
        default:
          i = 0;
      }
      i = i & (r.suspendedLanes | s) ? 0 : i, i !== 0 && i !== o.retryLane && (o.retryLane = i, Nt(t, i), rt(r, t, i, -1));
    }
    return jl(), r = $o(Error(T(421))), di(t, e, s, r);
  }
  return i.data === "$?" ? (e.flags |= 128, e.child = t.child, e = _p.bind(null, t), i._reactRetry = e, null) : (t = o.treeContext, Oe = Ut(i.nextSibling), je = e, b = !0, et = null, t !== null && (Ue[He++] = Et, Ue[He++] = zt, Ue[He++] = dn, Et = t.id, zt = t.overflow, dn = e), e = Ll(e, r.children), e.flags |= 4096, e);
}
function Xu(t, e, n) {
  t.lanes |= e;
  var r = t.alternate;
  r !== null && (r.lanes |= e), Ls(t.return, e, n);
}
function Go(t, e, n, r, i) {
  var o = t.memoizedState;
  o === null ? t.memoizedState = { isBackwards: e, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: i } : (o.isBackwards = e, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i);
}
function vd(t, e, n) {
  var r = e.pendingProps, i = r.revealOrder, o = r.tail;
  if (ze(t, e, r.children, n), r = ee.current, r & 2) r = r & 1 | 2, e.flags |= 128;
  else {
    if (t !== null && t.flags & 128) e: for (t = e.child; t !== null; ) {
      if (t.tag === 13) t.memoizedState !== null && Xu(t, n, e);
      else if (t.tag === 19) Xu(t, n, e);
      else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break e;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) break e;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    r &= 1;
  }
  if (Q(ee, r), !(e.mode & 1)) e.memoizedState = null;
  else switch (i) {
    case "forwards":
      for (n = e.child, i = null; n !== null; ) t = n.alternate, t !== null && Xi(t) === null && (i = n), n = n.sibling;
      n = i, n === null ? (i = e.child, e.child = null) : (i = n.sibling, n.sibling = null), Go(e, !1, i, n, o);
      break;
    case "backwards":
      for (n = null, i = e.child, e.child = null; i !== null; ) {
        if (t = i.alternate, t !== null && Xi(t) === null) {
          e.child = i;
          break;
        }
        t = i.sibling, i.sibling = n, n = i, i = t;
      }
      Go(e, !0, n, null, o);
      break;
    case "together":
      Go(e, !1, null, null, void 0);
      break;
    default:
      e.memoizedState = null;
  }
  return e.child;
}
function Pi(t, e) {
  !(e.mode & 1) && t !== null && (t.alternate = null, e.alternate = null, e.flags |= 2);
}
function Pt(t, e, n) {
  if (t !== null && (e.dependencies = t.dependencies), hn |= e.lanes, !(n & e.childLanes)) return null;
  if (t !== null && e.child !== t.child) throw Error(T(153));
  if (e.child !== null) {
    for (t = e.child, n = Yt(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null; ) t = t.sibling, n = n.sibling = Yt(t, t.pendingProps), n.return = e;
    n.sibling = null;
  }
  return e.child;
}
function pp(t, e, n) {
  switch (e.tag) {
    case 3:
      md(e), Un();
      break;
    case 5:
      Uc(e);
      break;
    case 1:
      Be(e.type) && qi(e);
      break;
    case 4:
      Cl(e, e.stateNode.containerInfo);
      break;
    case 10:
      var r = e.type._context, i = e.memoizedProps.value;
      Q($i, r._currentValue), r._currentValue = i;
      break;
    case 13:
      if (r = e.memoizedState, r !== null)
        return r.dehydrated !== null ? (Q(ee, ee.current & 1), e.flags |= 128, null) : n & e.child.childLanes ? yd(t, e, n) : (Q(ee, ee.current & 1), t = Pt(t, e, n), t !== null ? t.sibling : null);
      Q(ee, ee.current & 1);
      break;
    case 19:
      if (r = (n & e.childLanes) !== 0, t.flags & 128) {
        if (r) return vd(t, e, n);
        e.flags |= 128;
      }
      if (i = e.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Q(ee, ee.current), r) break;
      return null;
    case 22:
    case 23:
      return e.lanes = 0, hd(t, e, n);
  }
  return Pt(t, e, n);
}
var gd, Ws, wd, xd;
gd = function(t, e) {
  for (var n = e.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) t.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      n.child.return = n, n = n.child;
      continue;
    }
    if (n === e) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === e) return;
      n = n.return;
    }
    n.sibling.return = n.return, n = n.sibling;
  }
};
Ws = function() {
};
wd = function(t, e, n, r) {
  var i = t.memoizedProps;
  if (i !== r) {
    t = e.stateNode, sn(pt.current);
    var o = null;
    switch (n) {
      case "input":
        i = us(t, i), r = us(t, r), o = [];
        break;
      case "select":
        i = ne({}, i, { value: void 0 }), r = ne({}, r, { value: void 0 }), o = [];
        break;
      case "textarea":
        i = ds(t, i), r = ds(t, r), o = [];
        break;
      default:
        typeof i.onClick != "function" && typeof r.onClick == "function" && (t.onclick = Wi);
    }
    hs(n, r);
    var s;
    n = null;
    for (a in i) if (!r.hasOwnProperty(a) && i.hasOwnProperty(a) && i[a] != null) if (a === "style") {
      var l = i[a];
      for (s in l) l.hasOwnProperty(s) && (n || (n = {}), n[s] = "");
    } else a !== "dangerouslySetInnerHTML" && a !== "children" && a !== "suppressContentEditableWarning" && a !== "suppressHydrationWarning" && a !== "autoFocus" && (Cr.hasOwnProperty(a) ? o || (o = []) : (o = o || []).push(a, null));
    for (a in r) {
      var u = r[a];
      if (l = i != null ? i[a] : void 0, r.hasOwnProperty(a) && u !== l && (u != null || l != null)) if (a === "style") if (l) {
        for (s in l) !l.hasOwnProperty(s) || u && u.hasOwnProperty(s) || (n || (n = {}), n[s] = "");
        for (s in u) u.hasOwnProperty(s) && l[s] !== u[s] && (n || (n = {}), n[s] = u[s]);
      } else n || (o || (o = []), o.push(
        a,
        n
      )), n = u;
      else a === "dangerouslySetInnerHTML" ? (u = u ? u.__html : void 0, l = l ? l.__html : void 0, u != null && l !== u && (o = o || []).push(a, u)) : a === "children" ? typeof u != "string" && typeof u != "number" || (o = o || []).push(a, "" + u) : a !== "suppressContentEditableWarning" && a !== "suppressHydrationWarning" && (Cr.hasOwnProperty(a) ? (u != null && a === "onScroll" && Z("scroll", t), o || l === u || (o = [])) : (o = o || []).push(a, u));
    }
    n && (o = o || []).push("style", n);
    var a = o;
    (e.updateQueue = a) && (e.flags |= 4);
  }
};
xd = function(t, e, n, r) {
  n !== r && (e.flags |= 4);
};
function rr(t, e) {
  if (!b) switch (t.tailMode) {
    case "hidden":
      e = t.tail;
      for (var n = null; e !== null; ) e.alternate !== null && (n = e), e = e.sibling;
      n === null ? t.tail = null : n.sibling = null;
      break;
    case "collapsed":
      n = t.tail;
      for (var r = null; n !== null; ) n.alternate !== null && (r = n), n = n.sibling;
      r === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : r.sibling = null;
  }
}
function xe(t) {
  var e = t.alternate !== null && t.alternate.child === t.child, n = 0, r = 0;
  if (e) for (var i = t.child; i !== null; ) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 14680064, r |= i.flags & 14680064, i.return = t, i = i.sibling;
  else for (i = t.child; i !== null; ) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = t, i = i.sibling;
  return t.subtreeFlags |= r, t.childLanes = n, e;
}
function mp(t, e, n) {
  var r = e.pendingProps;
  switch (vl(e), e.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return xe(e), null;
    case 1:
      return Be(e.type) && Vi(), xe(e), null;
    case 3:
      return r = e.stateNode, $n(), J(Le), J(Ee), _l(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (t === null || t.child === null) && (ai(e) ? e.flags |= 4 : t === null || t.memoizedState.isDehydrated && !(e.flags & 256) || (e.flags |= 1024, et !== null && (Xs(et), et = null))), Ws(t, e), xe(e), null;
    case 5:
      kl(e);
      var i = sn(Ir.current);
      if (n = e.type, t !== null && e.stateNode != null) wd(t, e, n, r, i), t.ref !== e.ref && (e.flags |= 512, e.flags |= 2097152);
      else {
        if (!r) {
          if (e.stateNode === null) throw Error(T(166));
          return xe(e), null;
        }
        if (t = sn(pt.current), ai(e)) {
          r = e.stateNode, n = e.type;
          var o = e.memoizedProps;
          switch (r[ft] = e, r[Fr] = o, t = (e.mode & 1) !== 0, n) {
            case "dialog":
              Z("cancel", r), Z("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              Z("load", r);
              break;
            case "video":
            case "audio":
              for (i = 0; i < fr.length; i++) Z(fr[i], r);
              break;
            case "source":
              Z("error", r);
              break;
            case "img":
            case "image":
            case "link":
              Z(
                "error",
                r
              ), Z("load", r);
              break;
            case "details":
              Z("toggle", r);
              break;
            case "input":
              ru(r, o), Z("invalid", r);
              break;
            case "select":
              r._wrapperState = { wasMultiple: !!o.multiple }, Z("invalid", r);
              break;
            case "textarea":
              ou(r, o), Z("invalid", r);
          }
          hs(n, o), i = null;
          for (var s in o) if (o.hasOwnProperty(s)) {
            var l = o[s];
            s === "children" ? typeof l == "string" ? r.textContent !== l && (o.suppressHydrationWarning !== !0 && ui(r.textContent, l, t), i = ["children", l]) : typeof l == "number" && r.textContent !== "" + l && (o.suppressHydrationWarning !== !0 && ui(
              r.textContent,
              l,
              t
            ), i = ["children", "" + l]) : Cr.hasOwnProperty(s) && l != null && s === "onScroll" && Z("scroll", r);
          }
          switch (n) {
            case "input":
              ei(r), iu(r, o, !0);
              break;
            case "textarea":
              ei(r), su(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof o.onClick == "function" && (r.onclick = Wi);
          }
          r = i, e.updateQueue = r, r !== null && (e.flags |= 4);
        } else {
          s = i.nodeType === 9 ? i : i.ownerDocument, t === "http://www.w3.org/1999/xhtml" && (t = Xa(n)), t === "http://www.w3.org/1999/xhtml" ? n === "script" ? (t = s.createElement("div"), t.innerHTML = "<script><\/script>", t = t.removeChild(t.firstChild)) : typeof r.is == "string" ? t = s.createElement(n, { is: r.is }) : (t = s.createElement(n), n === "select" && (s = t, r.multiple ? s.multiple = !0 : r.size && (s.size = r.size))) : t = s.createElementNS(t, n), t[ft] = e, t[Fr] = r, gd(t, e, !1, !1), e.stateNode = t;
          e: {
            switch (s = ps(n, r), n) {
              case "dialog":
                Z("cancel", t), Z("close", t), i = r;
                break;
              case "iframe":
              case "object":
              case "embed":
                Z("load", t), i = r;
                break;
              case "video":
              case "audio":
                for (i = 0; i < fr.length; i++) Z(fr[i], t);
                i = r;
                break;
              case "source":
                Z("error", t), i = r;
                break;
              case "img":
              case "image":
              case "link":
                Z(
                  "error",
                  t
                ), Z("load", t), i = r;
                break;
              case "details":
                Z("toggle", t), i = r;
                break;
              case "input":
                ru(t, r), i = us(t, r), Z("invalid", t);
                break;
              case "option":
                i = r;
                break;
              case "select":
                t._wrapperState = { wasMultiple: !!r.multiple }, i = ne({}, r, { value: void 0 }), Z("invalid", t);
                break;
              case "textarea":
                ou(t, r), i = ds(t, r), Z("invalid", t);
                break;
              default:
                i = r;
            }
            hs(n, i), l = i;
            for (o in l) if (l.hasOwnProperty(o)) {
              var u = l[o];
              o === "style" ? Za(t, u) : o === "dangerouslySetInnerHTML" ? (u = u ? u.__html : void 0, u != null && Qa(t, u)) : o === "children" ? typeof u == "string" ? (n !== "textarea" || u !== "") && kr(t, u) : typeof u == "number" && kr(t, "" + u) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (Cr.hasOwnProperty(o) ? u != null && o === "onScroll" && Z("scroll", t) : u != null && nl(t, o, u, s));
            }
            switch (n) {
              case "input":
                ei(t), iu(t, r, !1);
                break;
              case "textarea":
                ei(t), su(t);
                break;
              case "option":
                r.value != null && t.setAttribute("value", "" + Xt(r.value));
                break;
              case "select":
                t.multiple = !!r.multiple, o = r.value, o != null ? An(t, !!r.multiple, o, !1) : r.defaultValue != null && An(
                  t,
                  !!r.multiple,
                  r.defaultValue,
                  !0
                );
                break;
              default:
                typeof i.onClick == "function" && (t.onclick = Wi);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (e.flags |= 4);
        }
        e.ref !== null && (e.flags |= 512, e.flags |= 2097152);
      }
      return xe(e), null;
    case 6:
      if (t && e.stateNode != null) xd(t, e, t.memoizedProps, r);
      else {
        if (typeof r != "string" && e.stateNode === null) throw Error(T(166));
        if (n = sn(Ir.current), sn(pt.current), ai(e)) {
          if (r = e.stateNode, n = e.memoizedProps, r[ft] = e, (o = r.nodeValue !== n) && (t = je, t !== null)) switch (t.tag) {
            case 3:
              ui(r.nodeValue, n, (t.mode & 1) !== 0);
              break;
            case 5:
              t.memoizedProps.suppressHydrationWarning !== !0 && ui(r.nodeValue, n, (t.mode & 1) !== 0);
          }
          o && (e.flags |= 4);
        } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[ft] = e, e.stateNode = r;
      }
      return xe(e), null;
    case 13:
      if (J(ee), r = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
        if (b && Oe !== null && e.mode & 1 && !(e.flags & 128)) jc(), Un(), e.flags |= 98560, o = !1;
        else if (o = ai(e), r !== null && r.dehydrated !== null) {
          if (t === null) {
            if (!o) throw Error(T(318));
            if (o = e.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(T(317));
            o[ft] = e;
          } else Un(), !(e.flags & 128) && (e.memoizedState = null), e.flags |= 4;
          xe(e), o = !1;
        } else et !== null && (Xs(et), et = null), o = !0;
        if (!o) return e.flags & 65536 ? e : null;
      }
      return e.flags & 128 ? (e.lanes = n, e) : (r = r !== null, r !== (t !== null && t.memoizedState !== null) && r && (e.child.flags |= 8192, e.mode & 1 && (t === null || ee.current & 1 ? fe === 0 && (fe = 3) : jl())), e.updateQueue !== null && (e.flags |= 4), xe(e), null);
    case 4:
      return $n(), Ws(t, e), t === null && Lr(e.stateNode.containerInfo), xe(e), null;
    case 10:
      return Sl(e.type._context), xe(e), null;
    case 17:
      return Be(e.type) && Vi(), xe(e), null;
    case 19:
      if (J(ee), o = e.memoizedState, o === null) return xe(e), null;
      if (r = (e.flags & 128) !== 0, s = o.rendering, s === null) if (r) rr(o, !1);
      else {
        if (fe !== 0 || t !== null && t.flags & 128) for (t = e.child; t !== null; ) {
          if (s = Xi(t), s !== null) {
            for (e.flags |= 128, rr(o, !1), r = s.updateQueue, r !== null && (e.updateQueue = r, e.flags |= 4), e.subtreeFlags = 0, r = n, n = e.child; n !== null; ) o = n, t = r, o.flags &= 14680066, s = o.alternate, s === null ? (o.childLanes = 0, o.lanes = t, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = s.childLanes, o.lanes = s.lanes, o.child = s.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = s.memoizedProps, o.memoizedState = s.memoizedState, o.updateQueue = s.updateQueue, o.type = s.type, t = s.dependencies, o.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }), n = n.sibling;
            return Q(ee, ee.current & 1 | 2), e.child;
          }
          t = t.sibling;
        }
        o.tail !== null && se() > Yn && (e.flags |= 128, r = !0, rr(o, !1), e.lanes = 4194304);
      }
      else {
        if (!r) if (t = Xi(s), t !== null) {
          if (e.flags |= 128, r = !0, n = t.updateQueue, n !== null && (e.updateQueue = n, e.flags |= 4), rr(o, !0), o.tail === null && o.tailMode === "hidden" && !s.alternate && !b) return xe(e), null;
        } else 2 * se() - o.renderingStartTime > Yn && n !== 1073741824 && (e.flags |= 128, r = !0, rr(o, !1), e.lanes = 4194304);
        o.isBackwards ? (s.sibling = e.child, e.child = s) : (n = o.last, n !== null ? n.sibling = s : e.child = s, o.last = s);
      }
      return o.tail !== null ? (e = o.tail, o.rendering = e, o.tail = e.sibling, o.renderingStartTime = se(), e.sibling = null, n = ee.current, Q(ee, r ? n & 1 | 2 : n & 1), e) : (xe(e), null);
    case 22:
    case 23:
      return Ol(), r = e.memoizedState !== null, t !== null && t.memoizedState !== null !== r && (e.flags |= 8192), r && e.mode & 1 ? Ie & 1073741824 && (xe(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : xe(e), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(T(156, e.tag));
}
function yp(t, e) {
  switch (vl(e), e.tag) {
    case 1:
      return Be(e.type) && Vi(), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
    case 3:
      return $n(), J(Le), J(Ee), _l(), t = e.flags, t & 65536 && !(t & 128) ? (e.flags = t & -65537 | 128, e) : null;
    case 5:
      return kl(e), null;
    case 13:
      if (J(ee), t = e.memoizedState, t !== null && t.dehydrated !== null) {
        if (e.alternate === null) throw Error(T(340));
        Un();
      }
      return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
    case 19:
      return J(ee), null;
    case 4:
      return $n(), null;
    case 10:
      return Sl(e.type._context), null;
    case 22:
    case 23:
      return Ol(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var fi = !1, Se = !1, vp = typeof WeakSet == "function" ? WeakSet : Set, A = null;
function Ln(t, e) {
  var n = t.ref;
  if (n !== null) if (typeof n == "function") try {
    n(null);
  } catch (r) {
    re(t, e, r);
  }
  else n.current = null;
}
function Vs(t, e, n) {
  try {
    n();
  } catch (r) {
    re(t, e, r);
  }
}
var Qu = !1;
function gp(t, e) {
  if (Cs = Oi, t = kc(), ml(t)) {
    if ("selectionStart" in t) var n = { start: t.selectionStart, end: t.selectionEnd };
    else e: {
      n = (n = t.ownerDocument) && n.defaultView || window;
      var r = n.getSelection && n.getSelection();
      if (r && r.rangeCount !== 0) {
        n = r.anchorNode;
        var i = r.anchorOffset, o = r.focusNode;
        r = r.focusOffset;
        try {
          n.nodeType, o.nodeType;
        } catch {
          n = null;
          break e;
        }
        var s = 0, l = -1, u = -1, a = 0, h = 0, p = t, c = null;
        t: for (; ; ) {
          for (var y; p !== n || i !== 0 && p.nodeType !== 3 || (l = s + i), p !== o || r !== 0 && p.nodeType !== 3 || (u = s + r), p.nodeType === 3 && (s += p.nodeValue.length), (y = p.firstChild) !== null; )
            c = p, p = y;
          for (; ; ) {
            if (p === t) break t;
            if (c === n && ++a === i && (l = s), c === o && ++h === r && (u = s), (y = p.nextSibling) !== null) break;
            p = c, c = p.parentNode;
          }
          p = y;
        }
        n = l === -1 || u === -1 ? null : { start: l, end: u };
      } else n = null;
    }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (ks = { focusedElem: t, selectionRange: n }, Oi = !1, A = e; A !== null; ) if (e = A, t = e.child, (e.subtreeFlags & 1028) !== 0 && t !== null) t.return = e, A = t;
  else for (; A !== null; ) {
    e = A;
    try {
      var v = e.alternate;
      if (e.flags & 1024) switch (e.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (v !== null) {
            var w = v.memoizedProps, S = v.memoizedState, m = e.stateNode, d = m.getSnapshotBeforeUpdate(e.elementType === e.type ? w : Je(e.type, w), S);
            m.__reactInternalSnapshotBeforeUpdate = d;
          }
          break;
        case 3:
          var g = e.stateNode.containerInfo;
          g.nodeType === 1 ? g.textContent = "" : g.nodeType === 9 && g.documentElement && g.removeChild(g.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(T(163));
      }
    } catch (x) {
      re(e, e.return, x);
    }
    if (t = e.sibling, t !== null) {
      t.return = e.return, A = t;
      break;
    }
    A = e.return;
  }
  return v = Qu, Qu = !1, v;
}
function wr(t, e, n) {
  var r = e.updateQueue;
  if (r = r !== null ? r.lastEffect : null, r !== null) {
    var i = r = r.next;
    do {
      if ((i.tag & t) === t) {
        var o = i.destroy;
        i.destroy = void 0, o !== void 0 && Vs(e, n, o);
      }
      i = i.next;
    } while (i !== r);
  }
}
function ho(t, e) {
  if (e = e.updateQueue, e = e !== null ? e.lastEffect : null, e !== null) {
    var n = e = e.next;
    do {
      if ((n.tag & t) === t) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== e);
  }
}
function qs(t) {
  var e = t.ref;
  if (e !== null) {
    var n = t.stateNode;
    switch (t.tag) {
      case 5:
        t = n;
        break;
      default:
        t = n;
    }
    typeof e == "function" ? e(t) : e.current = t;
  }
}
function Sd(t) {
  var e = t.alternate;
  e !== null && (t.alternate = null, Sd(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && (delete e[ft], delete e[Fr], delete e[Ps], delete e[ep], delete e[tp])), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
}
function Ed(t) {
  return t.tag === 5 || t.tag === 3 || t.tag === 4;
}
function Ku(t) {
  e: for (; ; ) {
    for (; t.sibling === null; ) {
      if (t.return === null || Ed(t.return)) return null;
      t = t.return;
    }
    for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
      if (t.flags & 2 || t.child === null || t.tag === 4) continue e;
      t.child.return = t, t = t.child;
    }
    if (!(t.flags & 2)) return t.stateNode;
  }
}
function Us(t, e, n) {
  var r = t.tag;
  if (r === 5 || r === 6) t = t.stateNode, e ? n.nodeType === 8 ? n.parentNode.insertBefore(t, e) : n.insertBefore(t, e) : (n.nodeType === 8 ? (e = n.parentNode, e.insertBefore(t, n)) : (e = n, e.appendChild(t)), n = n._reactRootContainer, n != null || e.onclick !== null || (e.onclick = Wi));
  else if (r !== 4 && (t = t.child, t !== null)) for (Us(t, e, n), t = t.sibling; t !== null; ) Us(t, e, n), t = t.sibling;
}
function Hs(t, e, n) {
  var r = t.tag;
  if (r === 5 || r === 6) t = t.stateNode, e ? n.insertBefore(t, e) : n.appendChild(t);
  else if (r !== 4 && (t = t.child, t !== null)) for (Hs(t, e, n), t = t.sibling; t !== null; ) Hs(t, e, n), t = t.sibling;
}
var ye = null, be = !1;
function Rt(t, e, n) {
  for (n = n.child; n !== null; ) zd(t, e, n), n = n.sibling;
}
function zd(t, e, n) {
  if (ht && typeof ht.onCommitFiberUnmount == "function") try {
    ht.onCommitFiberUnmount(io, n);
  } catch {
  }
  switch (n.tag) {
    case 5:
      Se || Ln(n, e);
    case 6:
      var r = ye, i = be;
      ye = null, Rt(t, e, n), ye = r, be = i, ye !== null && (be ? (t = ye, n = n.stateNode, t.nodeType === 8 ? t.parentNode.removeChild(n) : t.removeChild(n)) : ye.removeChild(n.stateNode));
      break;
    case 18:
      ye !== null && (be ? (t = ye, n = n.stateNode, t.nodeType === 8 ? Do(t.parentNode, n) : t.nodeType === 1 && Do(t, n), Tr(t)) : Do(ye, n.stateNode));
      break;
    case 4:
      r = ye, i = be, ye = n.stateNode.containerInfo, be = !0, Rt(t, e, n), ye = r, be = i;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!Se && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
        i = r = r.next;
        do {
          var o = i, s = o.destroy;
          o = o.tag, s !== void 0 && (o & 2 || o & 4) && Vs(n, e, s), i = i.next;
        } while (i !== r);
      }
      Rt(t, e, n);
      break;
    case 1:
      if (!Se && (Ln(n, e), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
        r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
      } catch (l) {
        re(n, e, l);
      }
      Rt(t, e, n);
      break;
    case 21:
      Rt(t, e, n);
      break;
    case 22:
      n.mode & 1 ? (Se = (r = Se) || n.memoizedState !== null, Rt(t, e, n), Se = r) : Rt(t, e, n);
      break;
    default:
      Rt(t, e, n);
  }
}
function Zu(t) {
  var e = t.updateQueue;
  if (e !== null) {
    t.updateQueue = null;
    var n = t.stateNode;
    n === null && (n = t.stateNode = new vp()), e.forEach(function(r) {
      var i = Np.bind(null, t, r);
      n.has(r) || (n.add(r), r.then(i, i));
    });
  }
}
function Ke(t, e) {
  var n = e.deletions;
  if (n !== null) for (var r = 0; r < n.length; r++) {
    var i = n[r];
    try {
      var o = t, s = e, l = s;
      e: for (; l !== null; ) {
        switch (l.tag) {
          case 5:
            ye = l.stateNode, be = !1;
            break e;
          case 3:
            ye = l.stateNode.containerInfo, be = !0;
            break e;
          case 4:
            ye = l.stateNode.containerInfo, be = !0;
            break e;
        }
        l = l.return;
      }
      if (ye === null) throw Error(T(160));
      zd(o, s, i), ye = null, be = !1;
      var u = i.alternate;
      u !== null && (u.return = null), i.return = null;
    } catch (a) {
      re(i, e, a);
    }
  }
  if (e.subtreeFlags & 12854) for (e = e.child; e !== null; ) Cd(e, t), e = e.sibling;
}
function Cd(t, e) {
  var n = t.alternate, r = t.flags;
  switch (t.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if (Ke(e, t), lt(t), r & 4) {
        try {
          wr(3, t, t.return), ho(3, t);
        } catch (w) {
          re(t, t.return, w);
        }
        try {
          wr(5, t, t.return);
        } catch (w) {
          re(t, t.return, w);
        }
      }
      break;
    case 1:
      Ke(e, t), lt(t), r & 512 && n !== null && Ln(n, n.return);
      break;
    case 5:
      if (Ke(e, t), lt(t), r & 512 && n !== null && Ln(n, n.return), t.flags & 32) {
        var i = t.stateNode;
        try {
          kr(i, "");
        } catch (w) {
          re(t, t.return, w);
        }
      }
      if (r & 4 && (i = t.stateNode, i != null)) {
        var o = t.memoizedProps, s = n !== null ? n.memoizedProps : o, l = t.type, u = t.updateQueue;
        if (t.updateQueue = null, u !== null) try {
          l === "input" && o.type === "radio" && o.name != null && Ga(i, o), ps(l, s);
          var a = ps(l, o);
          for (s = 0; s < u.length; s += 2) {
            var h = u[s], p = u[s + 1];
            h === "style" ? Za(i, p) : h === "dangerouslySetInnerHTML" ? Qa(i, p) : h === "children" ? kr(i, p) : nl(i, h, p, a);
          }
          switch (l) {
            case "input":
              as(i, o);
              break;
            case "textarea":
              Ya(i, o);
              break;
            case "select":
              var c = i._wrapperState.wasMultiple;
              i._wrapperState.wasMultiple = !!o.multiple;
              var y = o.value;
              y != null ? An(i, !!o.multiple, y, !1) : c !== !!o.multiple && (o.defaultValue != null ? An(
                i,
                !!o.multiple,
                o.defaultValue,
                !0
              ) : An(i, !!o.multiple, o.multiple ? [] : "", !1));
          }
          i[Fr] = o;
        } catch (w) {
          re(t, t.return, w);
        }
      }
      break;
    case 6:
      if (Ke(e, t), lt(t), r & 4) {
        if (t.stateNode === null) throw Error(T(162));
        i = t.stateNode, o = t.memoizedProps;
        try {
          i.nodeValue = o;
        } catch (w) {
          re(t, t.return, w);
        }
      }
      break;
    case 3:
      if (Ke(e, t), lt(t), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
        Tr(e.containerInfo);
      } catch (w) {
        re(t, t.return, w);
      }
      break;
    case 4:
      Ke(e, t), lt(t);
      break;
    case 13:
      Ke(e, t), lt(t), i = t.child, i.flags & 8192 && (o = i.memoizedState !== null, i.stateNode.isHidden = o, !o || i.alternate !== null && i.alternate.memoizedState !== null || (Al = se())), r & 4 && Zu(t);
      break;
    case 22:
      if (h = n !== null && n.memoizedState !== null, t.mode & 1 ? (Se = (a = Se) || h, Ke(e, t), Se = a) : Ke(e, t), lt(t), r & 8192) {
        if (a = t.memoizedState !== null, (t.stateNode.isHidden = a) && !h && t.mode & 1) for (A = t, h = t.child; h !== null; ) {
          for (p = A = h; A !== null; ) {
            switch (c = A, y = c.child, c.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                wr(4, c, c.return);
                break;
              case 1:
                Ln(c, c.return);
                var v = c.stateNode;
                if (typeof v.componentWillUnmount == "function") {
                  r = c, n = c.return;
                  try {
                    e = r, v.props = e.memoizedProps, v.state = e.memoizedState, v.componentWillUnmount();
                  } catch (w) {
                    re(r, n, w);
                  }
                }
                break;
              case 5:
                Ln(c, c.return);
                break;
              case 22:
                if (c.memoizedState !== null) {
                  bu(p);
                  continue;
                }
            }
            y !== null ? (y.return = c, A = y) : bu(p);
          }
          h = h.sibling;
        }
        e: for (h = null, p = t; ; ) {
          if (p.tag === 5) {
            if (h === null) {
              h = p;
              try {
                i = p.stateNode, a ? (o = i.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (l = p.stateNode, u = p.memoizedProps.style, s = u != null && u.hasOwnProperty("display") ? u.display : null, l.style.display = Ka("display", s));
              } catch (w) {
                re(t, t.return, w);
              }
            }
          } else if (p.tag === 6) {
            if (h === null) try {
              p.stateNode.nodeValue = a ? "" : p.memoizedProps;
            } catch (w) {
              re(t, t.return, w);
            }
          } else if ((p.tag !== 22 && p.tag !== 23 || p.memoizedState === null || p === t) && p.child !== null) {
            p.child.return = p, p = p.child;
            continue;
          }
          if (p === t) break e;
          for (; p.sibling === null; ) {
            if (p.return === null || p.return === t) break e;
            h === p && (h = null), p = p.return;
          }
          h === p && (h = null), p.sibling.return = p.return, p = p.sibling;
        }
      }
      break;
    case 19:
      Ke(e, t), lt(t), r & 4 && Zu(t);
      break;
    case 21:
      break;
    default:
      Ke(
        e,
        t
      ), lt(t);
  }
}
function lt(t) {
  var e = t.flags;
  if (e & 2) {
    try {
      e: {
        for (var n = t.return; n !== null; ) {
          if (Ed(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(T(160));
      }
      switch (r.tag) {
        case 5:
          var i = r.stateNode;
          r.flags & 32 && (kr(i, ""), r.flags &= -33);
          var o = Ku(t);
          Hs(t, o, i);
          break;
        case 3:
        case 4:
          var s = r.stateNode.containerInfo, l = Ku(t);
          Us(t, l, s);
          break;
        default:
          throw Error(T(161));
      }
    } catch (u) {
      re(t, t.return, u);
    }
    t.flags &= -3;
  }
  e & 4096 && (t.flags &= -4097);
}
function wp(t, e, n) {
  A = t, kd(t);
}
function kd(t, e, n) {
  for (var r = (t.mode & 1) !== 0; A !== null; ) {
    var i = A, o = i.child;
    if (i.tag === 22 && r) {
      var s = i.memoizedState !== null || fi;
      if (!s) {
        var l = i.alternate, u = l !== null && l.memoizedState !== null || Se;
        l = fi;
        var a = Se;
        if (fi = s, (Se = u) && !a) for (A = i; A !== null; ) s = A, u = s.child, s.tag === 22 && s.memoizedState !== null ? ea(i) : u !== null ? (u.return = s, A = u) : ea(i);
        for (; o !== null; ) A = o, kd(o), o = o.sibling;
        A = i, fi = l, Se = a;
      }
      Ju(t);
    } else i.subtreeFlags & 8772 && o !== null ? (o.return = i, A = o) : Ju(t);
  }
}
function Ju(t) {
  for (; A !== null; ) {
    var e = A;
    if (e.flags & 8772) {
      var n = e.alternate;
      try {
        if (e.flags & 8772) switch (e.tag) {
          case 0:
          case 11:
          case 15:
            Se || ho(5, e);
            break;
          case 1:
            var r = e.stateNode;
            if (e.flags & 4 && !Se) if (n === null) r.componentDidMount();
            else {
              var i = e.elementType === e.type ? n.memoizedProps : Je(e.type, n.memoizedProps);
              r.componentDidUpdate(i, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
            }
            var o = e.updateQueue;
            o !== null && Iu(e, o, r);
            break;
          case 3:
            var s = e.updateQueue;
            if (s !== null) {
              if (n = null, e.child !== null) switch (e.child.tag) {
                case 5:
                  n = e.child.stateNode;
                  break;
                case 1:
                  n = e.child.stateNode;
              }
              Iu(e, s, n);
            }
            break;
          case 5:
            var l = e.stateNode;
            if (n === null && e.flags & 4) {
              n = l;
              var u = e.memoizedProps;
              switch (e.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  u.autoFocus && n.focus();
                  break;
                case "img":
                  u.src && (n.src = u.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (e.memoizedState === null) {
              var a = e.alternate;
              if (a !== null) {
                var h = a.memoizedState;
                if (h !== null) {
                  var p = h.dehydrated;
                  p !== null && Tr(p);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(T(163));
        }
        Se || e.flags & 512 && qs(e);
      } catch (c) {
        re(e, e.return, c);
      }
    }
    if (e === t) {
      A = null;
      break;
    }
    if (n = e.sibling, n !== null) {
      n.return = e.return, A = n;
      break;
    }
    A = e.return;
  }
}
function bu(t) {
  for (; A !== null; ) {
    var e = A;
    if (e === t) {
      A = null;
      break;
    }
    var n = e.sibling;
    if (n !== null) {
      n.return = e.return, A = n;
      break;
    }
    A = e.return;
  }
}
function ea(t) {
  for (; A !== null; ) {
    var e = A;
    try {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          var n = e.return;
          try {
            ho(4, e);
          } catch (u) {
            re(e, n, u);
          }
          break;
        case 1:
          var r = e.stateNode;
          if (typeof r.componentDidMount == "function") {
            var i = e.return;
            try {
              r.componentDidMount();
            } catch (u) {
              re(e, i, u);
            }
          }
          var o = e.return;
          try {
            qs(e);
          } catch (u) {
            re(e, o, u);
          }
          break;
        case 5:
          var s = e.return;
          try {
            qs(e);
          } catch (u) {
            re(e, s, u);
          }
      }
    } catch (u) {
      re(e, e.return, u);
    }
    if (e === t) {
      A = null;
      break;
    }
    var l = e.sibling;
    if (l !== null) {
      l.return = e.return, A = l;
      break;
    }
    A = e.return;
  }
}
var xp = Math.ceil, Zi = Tt.ReactCurrentDispatcher, Bl = Tt.ReactCurrentOwner, Ge = Tt.ReactCurrentBatchConfig, $ = 0, me = null, ae = null, ve = 0, Ie = 0, Bn = Zt(0), fe = 0, Wr = null, hn = 0, po = 0, Fl = 0, xr = null, Me = null, Al = 0, Yn = 1 / 0, xt = null, Ji = !1, $s = null, $t = null, hi = !1, Dt = null, bi = 0, Sr = 0, Gs = null, Ti = -1, Mi = 0;
function Ce() {
  return $ & 6 ? se() : Ti !== -1 ? Ti : Ti = se();
}
function Gt(t) {
  return t.mode & 1 ? $ & 2 && ve !== 0 ? ve & -ve : rp.transition !== null ? (Mi === 0 && (Mi = ac()), Mi) : (t = X, t !== 0 || (t = window.event, t = t === void 0 ? 16 : yc(t.type)), t) : 1;
}
function rt(t, e, n, r) {
  if (50 < Sr) throw Sr = 0, Gs = null, Error(T(185));
  qr(t, n, r), (!($ & 2) || t !== me) && (t === me && (!($ & 2) && (po |= n), fe === 4 && It(t, ve)), Fe(t, r), n === 1 && $ === 0 && !(e.mode & 1) && (Yn = se() + 500, ao && Jt()));
}
function Fe(t, e) {
  var n = t.callbackNode;
  rh(t, e);
  var r = Ii(t, t === me ? ve : 0);
  if (r === 0) n !== null && au(n), t.callbackNode = null, t.callbackPriority = 0;
  else if (e = r & -r, t.callbackPriority !== e) {
    if (n != null && au(n), e === 1) t.tag === 0 ? np(ta.bind(null, t)) : Ac(ta.bind(null, t)), Jh(function() {
      !($ & 6) && Jt();
    }), n = null;
    else {
      switch (cc(r)) {
        case 1:
          n = ll;
          break;
        case 4:
          n = lc;
          break;
        case 16:
          n = Ai;
          break;
        case 536870912:
          n = uc;
          break;
        default:
          n = Ai;
      }
      n = Bd(n, _d.bind(null, t));
    }
    t.callbackPriority = e, t.callbackNode = n;
  }
}
function _d(t, e) {
  if (Ti = -1, Mi = 0, $ & 6) throw Error(T(327));
  var n = t.callbackNode;
  if (Wn() && t.callbackNode !== n) return null;
  var r = Ii(t, t === me ? ve : 0);
  if (r === 0) return null;
  if (r & 30 || r & t.expiredLanes || e) e = eo(t, r);
  else {
    e = r;
    var i = $;
    $ |= 2;
    var o = Pd();
    (me !== t || ve !== e) && (xt = null, Yn = se() + 500, un(t, e));
    do
      try {
        zp();
        break;
      } catch (l) {
        Nd(t, l);
      }
    while (!0);
    xl(), Zi.current = o, $ = i, ae !== null ? e = 0 : (me = null, ve = 0, e = fe);
  }
  if (e !== 0) {
    if (e === 2 && (i = ws(t), i !== 0 && (r = i, e = Ys(t, i))), e === 1) throw n = Wr, un(t, 0), It(t, r), Fe(t, se()), n;
    if (e === 6) It(t, r);
    else {
      if (i = t.current.alternate, !(r & 30) && !Sp(i) && (e = eo(t, r), e === 2 && (o = ws(t), o !== 0 && (r = o, e = Ys(t, o))), e === 1)) throw n = Wr, un(t, 0), It(t, r), Fe(t, se()), n;
      switch (t.finishedWork = i, t.finishedLanes = r, e) {
        case 0:
        case 1:
          throw Error(T(345));
        case 2:
          tn(t, Me, xt);
          break;
        case 3:
          if (It(t, r), (r & 130023424) === r && (e = Al + 500 - se(), 10 < e)) {
            if (Ii(t, 0) !== 0) break;
            if (i = t.suspendedLanes, (i & r) !== r) {
              Ce(), t.pingedLanes |= t.suspendedLanes & i;
              break;
            }
            t.timeoutHandle = Ns(tn.bind(null, t, Me, xt), e);
            break;
          }
          tn(t, Me, xt);
          break;
        case 4:
          if (It(t, r), (r & 4194240) === r) break;
          for (e = t.eventTimes, i = -1; 0 < r; ) {
            var s = 31 - nt(r);
            o = 1 << s, s = e[s], s > i && (i = s), r &= ~o;
          }
          if (r = i, r = se() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * xp(r / 1960)) - r, 10 < r) {
            t.timeoutHandle = Ns(tn.bind(null, t, Me, xt), r);
            break;
          }
          tn(t, Me, xt);
          break;
        case 5:
          tn(t, Me, xt);
          break;
        default:
          throw Error(T(329));
      }
    }
  }
  return Fe(t, se()), t.callbackNode === n ? _d.bind(null, t) : null;
}
function Ys(t, e) {
  var n = xr;
  return t.current.memoizedState.isDehydrated && (un(t, e).flags |= 256), t = eo(t, e), t !== 2 && (e = Me, Me = n, e !== null && Xs(e)), t;
}
function Xs(t) {
  Me === null ? Me = t : Me.push.apply(Me, t);
}
function Sp(t) {
  for (var e = t; ; ) {
    if (e.flags & 16384) {
      var n = e.updateQueue;
      if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
        var i = n[r], o = i.getSnapshot;
        i = i.value;
        try {
          if (!it(o(), i)) return !1;
        } catch {
          return !1;
        }
      }
    }
    if (n = e.child, e.subtreeFlags & 16384 && n !== null) n.return = e, e = n;
    else {
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return !0;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
  }
  return !0;
}
function It(t, e) {
  for (e &= ~Fl, e &= ~po, t.suspendedLanes |= e, t.pingedLanes &= ~e, t = t.expirationTimes; 0 < e; ) {
    var n = 31 - nt(e), r = 1 << n;
    t[n] = -1, e &= ~r;
  }
}
function ta(t) {
  if ($ & 6) throw Error(T(327));
  Wn();
  var e = Ii(t, 0);
  if (!(e & 1)) return Fe(t, se()), null;
  var n = eo(t, e);
  if (t.tag !== 0 && n === 2) {
    var r = ws(t);
    r !== 0 && (e = r, n = Ys(t, r));
  }
  if (n === 1) throw n = Wr, un(t, 0), It(t, e), Fe(t, se()), n;
  if (n === 6) throw Error(T(345));
  return t.finishedWork = t.current.alternate, t.finishedLanes = e, tn(t, Me, xt), Fe(t, se()), null;
}
function Il(t, e) {
  var n = $;
  $ |= 1;
  try {
    return t(e);
  } finally {
    $ = n, $ === 0 && (Yn = se() + 500, ao && Jt());
  }
}
function pn(t) {
  Dt !== null && Dt.tag === 0 && !($ & 6) && Wn();
  var e = $;
  $ |= 1;
  var n = Ge.transition, r = X;
  try {
    if (Ge.transition = null, X = 1, t) return t();
  } finally {
    X = r, Ge.transition = n, $ = e, !($ & 6) && Jt();
  }
}
function Ol() {
  Ie = Bn.current, J(Bn);
}
function un(t, e) {
  t.finishedWork = null, t.finishedLanes = 0;
  var n = t.timeoutHandle;
  if (n !== -1 && (t.timeoutHandle = -1, Zh(n)), ae !== null) for (n = ae.return; n !== null; ) {
    var r = n;
    switch (vl(r), r.tag) {
      case 1:
        r = r.type.childContextTypes, r != null && Vi();
        break;
      case 3:
        $n(), J(Le), J(Ee), _l();
        break;
      case 5:
        kl(r);
        break;
      case 4:
        $n();
        break;
      case 13:
        J(ee);
        break;
      case 19:
        J(ee);
        break;
      case 10:
        Sl(r.type._context);
        break;
      case 22:
      case 23:
        Ol();
    }
    n = n.return;
  }
  if (me = t, ae = t = Yt(t.current, null), ve = Ie = e, fe = 0, Wr = null, Fl = po = hn = 0, Me = xr = null, on !== null) {
    for (e = 0; e < on.length; e++) if (n = on[e], r = n.interleaved, r !== null) {
      n.interleaved = null;
      var i = r.next, o = n.pending;
      if (o !== null) {
        var s = o.next;
        o.next = i, r.next = s;
      }
      n.pending = r;
    }
    on = null;
  }
  return t;
}
function Nd(t, e) {
  do {
    var n = ae;
    try {
      if (xl(), _i.current = Ki, Qi) {
        for (var r = te.memoizedState; r !== null; ) {
          var i = r.queue;
          i !== null && (i.pending = null), r = r.next;
        }
        Qi = !1;
      }
      if (fn = 0, pe = de = te = null, gr = !1, Or = 0, Bl.current = null, n === null || n.return === null) {
        fe = 1, Wr = e, ae = null;
        break;
      }
      e: {
        var o = t, s = n.return, l = n, u = e;
        if (e = ve, l.flags |= 32768, u !== null && typeof u == "object" && typeof u.then == "function") {
          var a = u, h = l, p = h.tag;
          if (!(h.mode & 1) && (p === 0 || p === 11 || p === 15)) {
            var c = h.alternate;
            c ? (h.updateQueue = c.updateQueue, h.memoizedState = c.memoizedState, h.lanes = c.lanes) : (h.updateQueue = null, h.memoizedState = null);
          }
          var y = qu(s);
          if (y !== null) {
            y.flags &= -257, Uu(y, s, l, o, e), y.mode & 1 && Vu(o, a, e), e = y, u = a;
            var v = e.updateQueue;
            if (v === null) {
              var w = /* @__PURE__ */ new Set();
              w.add(u), e.updateQueue = w;
            } else v.add(u);
            break e;
          } else {
            if (!(e & 1)) {
              Vu(o, a, e), jl();
              break e;
            }
            u = Error(T(426));
          }
        } else if (b && l.mode & 1) {
          var S = qu(s);
          if (S !== null) {
            !(S.flags & 65536) && (S.flags |= 256), Uu(S, s, l, o, e), gl(Gn(u, l));
            break e;
          }
        }
        o = u = Gn(u, l), fe !== 4 && (fe = 2), xr === null ? xr = [o] : xr.push(o), o = s;
        do {
          switch (o.tag) {
            case 3:
              o.flags |= 65536, e &= -e, o.lanes |= e;
              var m = cd(o, u, e);
              Au(o, m);
              break e;
            case 1:
              l = u;
              var d = o.type, g = o.stateNode;
              if (!(o.flags & 128) && (typeof d.getDerivedStateFromError == "function" || g !== null && typeof g.componentDidCatch == "function" && ($t === null || !$t.has(g)))) {
                o.flags |= 65536, e &= -e, o.lanes |= e;
                var x = dd(o, l, e);
                Au(o, x);
                break e;
              }
          }
          o = o.return;
        } while (o !== null);
      }
      Md(n);
    } catch (E) {
      e = E, ae === n && n !== null && (ae = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function Pd() {
  var t = Zi.current;
  return Zi.current = Ki, t === null ? Ki : t;
}
function jl() {
  (fe === 0 || fe === 3 || fe === 2) && (fe = 4), me === null || !(hn & 268435455) && !(po & 268435455) || It(me, ve);
}
function eo(t, e) {
  var n = $;
  $ |= 2;
  var r = Pd();
  (me !== t || ve !== e) && (xt = null, un(t, e));
  do
    try {
      Ep();
      break;
    } catch (i) {
      Nd(t, i);
    }
  while (!0);
  if (xl(), $ = n, Zi.current = r, ae !== null) throw Error(T(261));
  return me = null, ve = 0, fe;
}
function Ep() {
  for (; ae !== null; ) Td(ae);
}
function zp() {
  for (; ae !== null && !Xf(); ) Td(ae);
}
function Td(t) {
  var e = Ld(t.alternate, t, Ie);
  t.memoizedProps = t.pendingProps, e === null ? Md(t) : ae = e, Bl.current = null;
}
function Md(t) {
  var e = t;
  do {
    var n = e.alternate;
    if (t = e.return, e.flags & 32768) {
      if (n = yp(n, e), n !== null) {
        n.flags &= 32767, ae = n;
        return;
      }
      if (t !== null) t.flags |= 32768, t.subtreeFlags = 0, t.deletions = null;
      else {
        fe = 6, ae = null;
        return;
      }
    } else if (n = mp(n, e, Ie), n !== null) {
      ae = n;
      return;
    }
    if (e = e.sibling, e !== null) {
      ae = e;
      return;
    }
    ae = e = t;
  } while (e !== null);
  fe === 0 && (fe = 5);
}
function tn(t, e, n) {
  var r = X, i = Ge.transition;
  try {
    Ge.transition = null, X = 1, Cp(t, e, n, r);
  } finally {
    Ge.transition = i, X = r;
  }
  return null;
}
function Cp(t, e, n, r) {
  do
    Wn();
  while (Dt !== null);
  if ($ & 6) throw Error(T(327));
  n = t.finishedWork;
  var i = t.finishedLanes;
  if (n === null) return null;
  if (t.finishedWork = null, t.finishedLanes = 0, n === t.current) throw Error(T(177));
  t.callbackNode = null, t.callbackPriority = 0;
  var o = n.lanes | n.childLanes;
  if (ih(t, o), t === me && (ae = me = null, ve = 0), !(n.subtreeFlags & 2064) && !(n.flags & 2064) || hi || (hi = !0, Bd(Ai, function() {
    return Wn(), null;
  })), o = (n.flags & 15990) !== 0, n.subtreeFlags & 15990 || o) {
    o = Ge.transition, Ge.transition = null;
    var s = X;
    X = 1;
    var l = $;
    $ |= 4, Bl.current = null, gp(t, n), Cd(n, t), Hh(ks), Oi = !!Cs, ks = Cs = null, t.current = n, wp(n), Qf(), $ = l, X = s, Ge.transition = o;
  } else t.current = n;
  if (hi && (hi = !1, Dt = t, bi = i), o = t.pendingLanes, o === 0 && ($t = null), Jf(n.stateNode), Fe(t, se()), e !== null) for (r = t.onRecoverableError, n = 0; n < e.length; n++) i = e[n], r(i.value, { componentStack: i.stack, digest: i.digest });
  if (Ji) throw Ji = !1, t = $s, $s = null, t;
  return bi & 1 && t.tag !== 0 && Wn(), o = t.pendingLanes, o & 1 ? t === Gs ? Sr++ : (Sr = 0, Gs = t) : Sr = 0, Jt(), null;
}
function Wn() {
  if (Dt !== null) {
    var t = cc(bi), e = Ge.transition, n = X;
    try {
      if (Ge.transition = null, X = 16 > t ? 16 : t, Dt === null) var r = !1;
      else {
        if (t = Dt, Dt = null, bi = 0, $ & 6) throw Error(T(331));
        var i = $;
        for ($ |= 4, A = t.current; A !== null; ) {
          var o = A, s = o.child;
          if (A.flags & 16) {
            var l = o.deletions;
            if (l !== null) {
              for (var u = 0; u < l.length; u++) {
                var a = l[u];
                for (A = a; A !== null; ) {
                  var h = A;
                  switch (h.tag) {
                    case 0:
                    case 11:
                    case 15:
                      wr(8, h, o);
                  }
                  var p = h.child;
                  if (p !== null) p.return = h, A = p;
                  else for (; A !== null; ) {
                    h = A;
                    var c = h.sibling, y = h.return;
                    if (Sd(h), h === a) {
                      A = null;
                      break;
                    }
                    if (c !== null) {
                      c.return = y, A = c;
                      break;
                    }
                    A = y;
                  }
                }
              }
              var v = o.alternate;
              if (v !== null) {
                var w = v.child;
                if (w !== null) {
                  v.child = null;
                  do {
                    var S = w.sibling;
                    w.sibling = null, w = S;
                  } while (w !== null);
                }
              }
              A = o;
            }
          }
          if (o.subtreeFlags & 2064 && s !== null) s.return = o, A = s;
          else e: for (; A !== null; ) {
            if (o = A, o.flags & 2048) switch (o.tag) {
              case 0:
              case 11:
              case 15:
                wr(9, o, o.return);
            }
            var m = o.sibling;
            if (m !== null) {
              m.return = o.return, A = m;
              break e;
            }
            A = o.return;
          }
        }
        var d = t.current;
        for (A = d; A !== null; ) {
          s = A;
          var g = s.child;
          if (s.subtreeFlags & 2064 && g !== null) g.return = s, A = g;
          else e: for (s = d; A !== null; ) {
            if (l = A, l.flags & 2048) try {
              switch (l.tag) {
                case 0:
                case 11:
                case 15:
                  ho(9, l);
              }
            } catch (E) {
              re(l, l.return, E);
            }
            if (l === s) {
              A = null;
              break e;
            }
            var x = l.sibling;
            if (x !== null) {
              x.return = l.return, A = x;
              break e;
            }
            A = l.return;
          }
        }
        if ($ = i, Jt(), ht && typeof ht.onPostCommitFiberRoot == "function") try {
          ht.onPostCommitFiberRoot(io, t);
        } catch {
        }
        r = !0;
      }
      return r;
    } finally {
      X = n, Ge.transition = e;
    }
  }
  return !1;
}
function na(t, e, n) {
  e = Gn(n, e), e = cd(t, e, 1), t = Ht(t, e, 1), e = Ce(), t !== null && (qr(t, 1, e), Fe(t, e));
}
function re(t, e, n) {
  if (t.tag === 3) na(t, t, n);
  else for (; e !== null; ) {
    if (e.tag === 3) {
      na(e, t, n);
      break;
    } else if (e.tag === 1) {
      var r = e.stateNode;
      if (typeof e.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && ($t === null || !$t.has(r))) {
        t = Gn(n, t), t = dd(e, t, 1), e = Ht(e, t, 1), t = Ce(), e !== null && (qr(e, 1, t), Fe(e, t));
        break;
      }
    }
    e = e.return;
  }
}
function kp(t, e, n) {
  var r = t.pingCache;
  r !== null && r.delete(e), e = Ce(), t.pingedLanes |= t.suspendedLanes & n, me === t && (ve & n) === n && (fe === 4 || fe === 3 && (ve & 130023424) === ve && 500 > se() - Al ? un(t, 0) : Fl |= n), Fe(t, e);
}
function Rd(t, e) {
  e === 0 && (t.mode & 1 ? (e = ri, ri <<= 1, !(ri & 130023424) && (ri = 4194304)) : e = 1);
  var n = Ce();
  t = Nt(t, e), t !== null && (qr(t, e, n), Fe(t, n));
}
function _p(t) {
  var e = t.memoizedState, n = 0;
  e !== null && (n = e.retryLane), Rd(t, n);
}
function Np(t, e) {
  var n = 0;
  switch (t.tag) {
    case 13:
      var r = t.stateNode, i = t.memoizedState;
      i !== null && (n = i.retryLane);
      break;
    case 19:
      r = t.stateNode;
      break;
    default:
      throw Error(T(314));
  }
  r !== null && r.delete(e), Rd(t, n);
}
var Ld;
Ld = function(t, e, n) {
  if (t !== null) if (t.memoizedProps !== e.pendingProps || Le.current) Re = !0;
  else {
    if (!(t.lanes & n) && !(e.flags & 128)) return Re = !1, pp(t, e, n);
    Re = !!(t.flags & 131072);
  }
  else Re = !1, b && e.flags & 1048576 && Ic(e, Hi, e.index);
  switch (e.lanes = 0, e.tag) {
    case 2:
      var r = e.type;
      Pi(t, e), t = e.pendingProps;
      var i = qn(e, Ee.current);
      Dn(e, n), i = Pl(null, e, r, t, i, n);
      var o = Tl();
      return e.flags |= 1, typeof i == "object" && i !== null && typeof i.render == "function" && i.$$typeof === void 0 ? (e.tag = 1, e.memoizedState = null, e.updateQueue = null, Be(r) ? (o = !0, qi(e)) : o = !1, e.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, zl(e), i.updater = fo, e.stateNode = i, i._reactInternals = e, Fs(e, r, t, n), e = Os(null, e, r, !0, o, n)) : (e.tag = 0, b && o && yl(e), ze(null, e, i, n), e = e.child), e;
    case 16:
      r = e.elementType;
      e: {
        switch (Pi(t, e), t = e.pendingProps, i = r._init, r = i(r._payload), e.type = r, i = e.tag = Tp(r), t = Je(r, t), i) {
          case 0:
            e = Is(null, e, r, t, n);
            break e;
          case 1:
            e = Gu(null, e, r, t, n);
            break e;
          case 11:
            e = Hu(null, e, r, t, n);
            break e;
          case 14:
            e = $u(null, e, r, Je(r.type, t), n);
            break e;
        }
        throw Error(T(
          306,
          r,
          ""
        ));
      }
      return e;
    case 0:
      return r = e.type, i = e.pendingProps, i = e.elementType === r ? i : Je(r, i), Is(t, e, r, i, n);
    case 1:
      return r = e.type, i = e.pendingProps, i = e.elementType === r ? i : Je(r, i), Gu(t, e, r, i, n);
    case 3:
      e: {
        if (md(e), t === null) throw Error(T(387));
        r = e.pendingProps, o = e.memoizedState, i = o.element, qc(t, e), Yi(e, r, null, n);
        var s = e.memoizedState;
        if (r = s.element, o.isDehydrated) if (o = { element: r, isDehydrated: !1, cache: s.cache, pendingSuspenseBoundaries: s.pendingSuspenseBoundaries, transitions: s.transitions }, e.updateQueue.baseState = o, e.memoizedState = o, e.flags & 256) {
          i = Gn(Error(T(423)), e), e = Yu(t, e, r, n, i);
          break e;
        } else if (r !== i) {
          i = Gn(Error(T(424)), e), e = Yu(t, e, r, n, i);
          break e;
        } else for (Oe = Ut(e.stateNode.containerInfo.firstChild), je = e, b = !0, et = null, n = Wc(e, null, r, n), e.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
        else {
          if (Un(), r === i) {
            e = Pt(t, e, n);
            break e;
          }
          ze(t, e, r, n);
        }
        e = e.child;
      }
      return e;
    case 5:
      return Uc(e), t === null && Rs(e), r = e.type, i = e.pendingProps, o = t !== null ? t.memoizedProps : null, s = i.children, _s(r, i) ? s = null : o !== null && _s(r, o) && (e.flags |= 32), pd(t, e), ze(t, e, s, n), e.child;
    case 6:
      return t === null && Rs(e), null;
    case 13:
      return yd(t, e, n);
    case 4:
      return Cl(e, e.stateNode.containerInfo), r = e.pendingProps, t === null ? e.child = Hn(e, null, r, n) : ze(t, e, r, n), e.child;
    case 11:
      return r = e.type, i = e.pendingProps, i = e.elementType === r ? i : Je(r, i), Hu(t, e, r, i, n);
    case 7:
      return ze(t, e, e.pendingProps, n), e.child;
    case 8:
      return ze(t, e, e.pendingProps.children, n), e.child;
    case 12:
      return ze(t, e, e.pendingProps.children, n), e.child;
    case 10:
      e: {
        if (r = e.type._context, i = e.pendingProps, o = e.memoizedProps, s = i.value, Q($i, r._currentValue), r._currentValue = s, o !== null) if (it(o.value, s)) {
          if (o.children === i.children && !Le.current) {
            e = Pt(t, e, n);
            break e;
          }
        } else for (o = e.child, o !== null && (o.return = e); o !== null; ) {
          var l = o.dependencies;
          if (l !== null) {
            s = o.child;
            for (var u = l.firstContext; u !== null; ) {
              if (u.context === r) {
                if (o.tag === 1) {
                  u = Ct(-1, n & -n), u.tag = 2;
                  var a = o.updateQueue;
                  if (a !== null) {
                    a = a.shared;
                    var h = a.pending;
                    h === null ? u.next = u : (u.next = h.next, h.next = u), a.pending = u;
                  }
                }
                o.lanes |= n, u = o.alternate, u !== null && (u.lanes |= n), Ls(
                  o.return,
                  n,
                  e
                ), l.lanes |= n;
                break;
              }
              u = u.next;
            }
          } else if (o.tag === 10) s = o.type === e.type ? null : o.child;
          else if (o.tag === 18) {
            if (s = o.return, s === null) throw Error(T(341));
            s.lanes |= n, l = s.alternate, l !== null && (l.lanes |= n), Ls(s, n, e), s = o.sibling;
          } else s = o.child;
          if (s !== null) s.return = o;
          else for (s = o; s !== null; ) {
            if (s === e) {
              s = null;
              break;
            }
            if (o = s.sibling, o !== null) {
              o.return = s.return, s = o;
              break;
            }
            s = s.return;
          }
          o = s;
        }
        ze(t, e, i.children, n), e = e.child;
      }
      return e;
    case 9:
      return i = e.type, r = e.pendingProps.children, Dn(e, n), i = Ye(i), r = r(i), e.flags |= 1, ze(t, e, r, n), e.child;
    case 14:
      return r = e.type, i = Je(r, e.pendingProps), i = Je(r.type, i), $u(t, e, r, i, n);
    case 15:
      return fd(t, e, e.type, e.pendingProps, n);
    case 17:
      return r = e.type, i = e.pendingProps, i = e.elementType === r ? i : Je(r, i), Pi(t, e), e.tag = 1, Be(r) ? (t = !0, qi(e)) : t = !1, Dn(e, n), ad(e, r, i), Fs(e, r, i, n), Os(null, e, r, !0, t, n);
    case 19:
      return vd(t, e, n);
    case 22:
      return hd(t, e, n);
  }
  throw Error(T(156, e.tag));
};
function Bd(t, e) {
  return sc(t, e);
}
function Pp(t, e, n, r) {
  this.tag = t, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function $e(t, e, n, r) {
  return new Pp(t, e, n, r);
}
function Dl(t) {
  return t = t.prototype, !(!t || !t.isReactComponent);
}
function Tp(t) {
  if (typeof t == "function") return Dl(t) ? 1 : 0;
  if (t != null) {
    if (t = t.$$typeof, t === il) return 11;
    if (t === ol) return 14;
  }
  return 2;
}
function Yt(t, e) {
  var n = t.alternate;
  return n === null ? (n = $e(t.tag, e, t.key, t.mode), n.elementType = t.elementType, n.type = t.type, n.stateNode = t.stateNode, n.alternate = t, t.alternate = n) : (n.pendingProps = e, n.type = t.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = t.flags & 14680064, n.childLanes = t.childLanes, n.lanes = t.lanes, n.child = t.child, n.memoizedProps = t.memoizedProps, n.memoizedState = t.memoizedState, n.updateQueue = t.updateQueue, e = t.dependencies, n.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, n.sibling = t.sibling, n.index = t.index, n.ref = t.ref, n;
}
function Ri(t, e, n, r, i, o) {
  var s = 2;
  if (r = t, typeof t == "function") Dl(t) && (s = 1);
  else if (typeof t == "string") s = 5;
  else e: switch (t) {
    case zn:
      return an(n.children, i, o, e);
    case rl:
      s = 8, i |= 8;
      break;
    case is:
      return t = $e(12, n, e, i | 2), t.elementType = is, t.lanes = o, t;
    case os:
      return t = $e(13, n, e, i), t.elementType = os, t.lanes = o, t;
    case ss:
      return t = $e(19, n, e, i), t.elementType = ss, t.lanes = o, t;
    case Ua:
      return mo(n, i, o, e);
    default:
      if (typeof t == "object" && t !== null) switch (t.$$typeof) {
        case Va:
          s = 10;
          break e;
        case qa:
          s = 9;
          break e;
        case il:
          s = 11;
          break e;
        case ol:
          s = 14;
          break e;
        case Bt:
          s = 16, r = null;
          break e;
      }
      throw Error(T(130, t == null ? t : typeof t, ""));
  }
  return e = $e(s, n, e, i), e.elementType = t, e.type = r, e.lanes = o, e;
}
function an(t, e, n, r) {
  return t = $e(7, t, r, e), t.lanes = n, t;
}
function mo(t, e, n, r) {
  return t = $e(22, t, r, e), t.elementType = Ua, t.lanes = n, t.stateNode = { isHidden: !1 }, t;
}
function Yo(t, e, n) {
  return t = $e(6, t, null, e), t.lanes = n, t;
}
function Xo(t, e, n) {
  return e = $e(4, t.children !== null ? t.children : [], t.key, e), e.lanes = n, e.stateNode = { containerInfo: t.containerInfo, pendingChildren: null, implementation: t.implementation }, e;
}
function Mp(t, e, n, r, i) {
  this.tag = e, this.containerInfo = t, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Po(0), this.expirationTimes = Po(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Po(0), this.identifierPrefix = r, this.onRecoverableError = i, this.mutableSourceEagerHydrationData = null;
}
function Wl(t, e, n, r, i, o, s, l, u) {
  return t = new Mp(t, e, n, l, u), e === 1 ? (e = 1, o === !0 && (e |= 8)) : e = 0, o = $e(3, null, null, e), t.current = o, o.stateNode = t, o.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, zl(o), t;
}
function Rp(t, e, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return { $$typeof: En, key: r == null ? null : "" + r, children: t, containerInfo: e, implementation: n };
}
function Fd(t) {
  if (!t) return Qt;
  t = t._reactInternals;
  e: {
    if (yn(t) !== t || t.tag !== 1) throw Error(T(170));
    var e = t;
    do {
      switch (e.tag) {
        case 3:
          e = e.stateNode.context;
          break e;
        case 1:
          if (Be(e.type)) {
            e = e.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      e = e.return;
    } while (e !== null);
    throw Error(T(171));
  }
  if (t.tag === 1) {
    var n = t.type;
    if (Be(n)) return Fc(t, n, e);
  }
  return e;
}
function Ad(t, e, n, r, i, o, s, l, u) {
  return t = Wl(n, r, !0, t, i, o, s, l, u), t.context = Fd(null), n = t.current, r = Ce(), i = Gt(n), o = Ct(r, i), o.callback = e ?? null, Ht(n, o, i), t.current.lanes = i, qr(t, i, r), Fe(t, r), t;
}
function yo(t, e, n, r) {
  var i = e.current, o = Ce(), s = Gt(i);
  return n = Fd(n), e.context === null ? e.context = n : e.pendingContext = n, e = Ct(o, s), e.payload = { element: t }, r = r === void 0 ? null : r, r !== null && (e.callback = r), t = Ht(i, e, s), t !== null && (rt(t, i, s, o), ki(t, i, s)), s;
}
function to(t) {
  if (t = t.current, !t.child) return null;
  switch (t.child.tag) {
    case 5:
      return t.child.stateNode;
    default:
      return t.child.stateNode;
  }
}
function ra(t, e) {
  if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
    var n = t.retryLane;
    t.retryLane = n !== 0 && n < e ? n : e;
  }
}
function Vl(t, e) {
  ra(t, e), (t = t.alternate) && ra(t, e);
}
function Lp() {
  return null;
}
var Id = typeof reportError == "function" ? reportError : function(t) {
  console.error(t);
};
function ql(t) {
  this._internalRoot = t;
}
vo.prototype.render = ql.prototype.render = function(t) {
  var e = this._internalRoot;
  if (e === null) throw Error(T(409));
  yo(t, e, null, null);
};
vo.prototype.unmount = ql.prototype.unmount = function() {
  var t = this._internalRoot;
  if (t !== null) {
    this._internalRoot = null;
    var e = t.containerInfo;
    pn(function() {
      yo(null, t, null, null);
    }), e[_t] = null;
  }
};
function vo(t) {
  this._internalRoot = t;
}
vo.prototype.unstable_scheduleHydration = function(t) {
  if (t) {
    var e = hc();
    t = { blockedOn: null, target: t, priority: e };
    for (var n = 0; n < At.length && e !== 0 && e < At[n].priority; n++) ;
    At.splice(n, 0, t), n === 0 && mc(t);
  }
};
function Ul(t) {
  return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
}
function go(t) {
  return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11 && (t.nodeType !== 8 || t.nodeValue !== " react-mount-point-unstable "));
}
function ia() {
}
function Bp(t, e, n, r, i) {
  if (i) {
    if (typeof r == "function") {
      var o = r;
      r = function() {
        var a = to(s);
        o.call(a);
      };
    }
    var s = Ad(e, r, t, 0, null, !1, !1, "", ia);
    return t._reactRootContainer = s, t[_t] = s.current, Lr(t.nodeType === 8 ? t.parentNode : t), pn(), s;
  }
  for (; i = t.lastChild; ) t.removeChild(i);
  if (typeof r == "function") {
    var l = r;
    r = function() {
      var a = to(u);
      l.call(a);
    };
  }
  var u = Wl(t, 0, !1, null, null, !1, !1, "", ia);
  return t._reactRootContainer = u, t[_t] = u.current, Lr(t.nodeType === 8 ? t.parentNode : t), pn(function() {
    yo(e, u, n, r);
  }), u;
}
function wo(t, e, n, r, i) {
  var o = n._reactRootContainer;
  if (o) {
    var s = o;
    if (typeof i == "function") {
      var l = i;
      i = function() {
        var u = to(s);
        l.call(u);
      };
    }
    yo(e, s, t, i);
  } else s = Bp(n, e, t, i, r);
  return to(s);
}
dc = function(t) {
  switch (t.tag) {
    case 3:
      var e = t.stateNode;
      if (e.current.memoizedState.isDehydrated) {
        var n = dr(e.pendingLanes);
        n !== 0 && (ul(e, n | 1), Fe(e, se()), !($ & 6) && (Yn = se() + 500, Jt()));
      }
      break;
    case 13:
      pn(function() {
        var r = Nt(t, 1);
        if (r !== null) {
          var i = Ce();
          rt(r, t, 1, i);
        }
      }), Vl(t, 1);
  }
};
al = function(t) {
  if (t.tag === 13) {
    var e = Nt(t, 134217728);
    if (e !== null) {
      var n = Ce();
      rt(e, t, 134217728, n);
    }
    Vl(t, 134217728);
  }
};
fc = function(t) {
  if (t.tag === 13) {
    var e = Gt(t), n = Nt(t, e);
    if (n !== null) {
      var r = Ce();
      rt(n, t, e, r);
    }
    Vl(t, e);
  }
};
hc = function() {
  return X;
};
pc = function(t, e) {
  var n = X;
  try {
    return X = t, e();
  } finally {
    X = n;
  }
};
ys = function(t, e, n) {
  switch (e) {
    case "input":
      if (as(t, n), e = n.name, n.type === "radio" && e != null) {
        for (n = t; n.parentNode; ) n = n.parentNode;
        for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + e) + '][type="radio"]'), e = 0; e < n.length; e++) {
          var r = n[e];
          if (r !== t && r.form === t.form) {
            var i = uo(r);
            if (!i) throw Error(T(90));
            $a(r), as(r, i);
          }
        }
      }
      break;
    case "textarea":
      Ya(t, n);
      break;
    case "select":
      e = n.value, e != null && An(t, !!n.multiple, e, !1);
  }
};
ec = Il;
tc = pn;
var Fp = { usingClientEntryPoint: !1, Events: [Hr, Nn, uo, Ja, ba, Il] }, ir = { findFiberByHostInstance: rn, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Ap = { bundleType: ir.bundleType, version: ir.version, rendererPackageName: ir.rendererPackageName, rendererConfig: ir.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Tt.ReactCurrentDispatcher, findHostInstanceByFiber: function(t) {
  return t = ic(t), t === null ? null : t.stateNode;
}, findFiberByHostInstance: ir.findFiberByHostInstance || Lp, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var pi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!pi.isDisabled && pi.supportsFiber) try {
    io = pi.inject(Ap), ht = pi;
  } catch {
  }
}
We.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Fp;
We.createPortal = function(t, e) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Ul(e)) throw Error(T(200));
  return Rp(t, e, null, n);
};
We.createRoot = function(t, e) {
  if (!Ul(t)) throw Error(T(299));
  var n = !1, r = "", i = Id;
  return e != null && (e.unstable_strictMode === !0 && (n = !0), e.identifierPrefix !== void 0 && (r = e.identifierPrefix), e.onRecoverableError !== void 0 && (i = e.onRecoverableError)), e = Wl(t, 1, !1, null, null, n, !1, r, i), t[_t] = e.current, Lr(t.nodeType === 8 ? t.parentNode : t), new ql(e);
};
We.findDOMNode = function(t) {
  if (t == null) return null;
  if (t.nodeType === 1) return t;
  var e = t._reactInternals;
  if (e === void 0)
    throw typeof t.render == "function" ? Error(T(188)) : (t = Object.keys(t).join(","), Error(T(268, t)));
  return t = ic(e), t = t === null ? null : t.stateNode, t;
};
We.flushSync = function(t) {
  return pn(t);
};
We.hydrate = function(t, e, n) {
  if (!go(e)) throw Error(T(200));
  return wo(null, t, e, !0, n);
};
We.hydrateRoot = function(t, e, n) {
  if (!Ul(t)) throw Error(T(405));
  var r = n != null && n.hydratedSources || null, i = !1, o = "", s = Id;
  if (n != null && (n.unstable_strictMode === !0 && (i = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (s = n.onRecoverableError)), e = Ad(e, null, t, 1, n ?? null, i, !1, o, s), t[_t] = e.current, Lr(t), r) for (t = 0; t < r.length; t++) n = r[t], i = n._getVersion, i = i(n._source), e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [n, i] : e.mutableSourceEagerHydrationData.push(
    n,
    i
  );
  return new vo(e);
};
We.render = function(t, e, n) {
  if (!go(e)) throw Error(T(200));
  return wo(null, t, e, !1, n);
};
We.unmountComponentAtNode = function(t) {
  if (!go(t)) throw Error(T(40));
  return t._reactRootContainer ? (pn(function() {
    wo(null, null, t, !1, function() {
      t._reactRootContainer = null, t[_t] = null;
    });
  }), !0) : !1;
};
We.unstable_batchedUpdates = Il;
We.unstable_renderSubtreeIntoContainer = function(t, e, n, r) {
  if (!go(n)) throw Error(T(200));
  if (t == null || t._reactInternals === void 0) throw Error(T(38));
  return wo(t, e, n, !1, r);
};
We.version = "18.3.1-next-f1338f8080-20240426";
function Od() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Od);
    } catch (t) {
      console.error(t);
    }
}
Od(), Oa.exports = We;
var Ip = Oa.exports, jd, oa = Ip;
jd = oa.createRoot, oa.hydrateRoot;
class tt {
  /**
   * A vector of length 9, containing all matrix elements.
   */
  /**
   * @param elements A vector of length 9, containing all matrix elements.
   */
  constructor(e) {
    e === void 0 && (e = [0, 0, 0, 0, 0, 0, 0, 0, 0]), this.elements = e;
  }
  /**
   * Sets the matrix to identity
   * @todo Should perhaps be renamed to `setIdentity()` to be more clear.
   * @todo Create another function that immediately creates an identity matrix eg. `eye()`
   */
  identity() {
    const e = this.elements;
    e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1;
  }
  /**
   * Set all elements to zero
   */
  setZero() {
    const e = this.elements;
    e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 0;
  }
  /**
   * Sets the matrix diagonal elements from a Vec3
   */
  setTrace(e) {
    const n = this.elements;
    n[0] = e.x, n[4] = e.y, n[8] = e.z;
  }
  /**
   * Gets the matrix diagonal elements
   */
  getTrace(e) {
    e === void 0 && (e = new f());
    const n = this.elements;
    return e.x = n[0], e.y = n[4], e.z = n[8], e;
  }
  /**
   * Matrix-Vector multiplication
   * @param v The vector to multiply with
   * @param target Optional, target to save the result in.
   */
  vmult(e, n) {
    n === void 0 && (n = new f());
    const r = this.elements, i = e.x, o = e.y, s = e.z;
    return n.x = r[0] * i + r[1] * o + r[2] * s, n.y = r[3] * i + r[4] * o + r[5] * s, n.z = r[6] * i + r[7] * o + r[8] * s, n;
  }
  /**
   * Matrix-scalar multiplication
   */
  smult(e) {
    for (let n = 0; n < this.elements.length; n++)
      this.elements[n] *= e;
  }
  /**
   * Matrix multiplication
   * @param matrix Matrix to multiply with from left side.
   */
  mmult(e, n) {
    n === void 0 && (n = new tt());
    const r = this.elements, i = e.elements, o = n.elements, s = r[0], l = r[1], u = r[2], a = r[3], h = r[4], p = r[5], c = r[6], y = r[7], v = r[8], w = i[0], S = i[1], m = i[2], d = i[3], g = i[4], x = i[5], E = i[6], z = i[7], C = i[8];
    return o[0] = s * w + l * d + u * E, o[1] = s * S + l * g + u * z, o[2] = s * m + l * x + u * C, o[3] = a * w + h * d + p * E, o[4] = a * S + h * g + p * z, o[5] = a * m + h * x + p * C, o[6] = c * w + y * d + v * E, o[7] = c * S + y * g + v * z, o[8] = c * m + y * x + v * C, n;
  }
  /**
   * Scale each column of the matrix
   */
  scale(e, n) {
    n === void 0 && (n = new tt());
    const r = this.elements, i = n.elements;
    for (let o = 0; o !== 3; o++)
      i[3 * o + 0] = e.x * r[3 * o + 0], i[3 * o + 1] = e.y * r[3 * o + 1], i[3 * o + 2] = e.z * r[3 * o + 2];
    return n;
  }
  /**
   * Solve Ax=b
   * @param b The right hand side
   * @param target Optional. Target vector to save in.
   * @return The solution x
   * @todo should reuse arrays
   */
  solve(e, n) {
    n === void 0 && (n = new f());
    const r = 3, i = 4, o = [];
    let s, l;
    for (s = 0; s < r * i; s++)
      o.push(0);
    for (s = 0; s < 3; s++)
      for (l = 0; l < 3; l++)
        o[s + i * l] = this.elements[s + 3 * l];
    o[3 + 4 * 0] = e.x, o[3 + 4 * 1] = e.y, o[3 + 4 * 2] = e.z;
    let u = 3;
    const a = u;
    let h;
    const p = 4;
    let c;
    do {
      if (s = a - u, o[s + i * s] === 0) {
        for (l = s + 1; l < a; l++)
          if (o[s + i * l] !== 0) {
            h = p;
            do
              c = p - h, o[c + i * s] += o[c + i * l];
            while (--h);
            break;
          }
      }
      if (o[s + i * s] !== 0)
        for (l = s + 1; l < a; l++) {
          const y = o[s + i * l] / o[s + i * s];
          h = p;
          do
            c = p - h, o[c + i * l] = c <= s ? 0 : o[c + i * l] - o[c + i * s] * y;
          while (--h);
        }
    } while (--u);
    if (n.z = o[2 * i + 3] / o[2 * i + 2], n.y = (o[1 * i + 3] - o[1 * i + 2] * n.z) / o[1 * i + 1], n.x = (o[0 * i + 3] - o[0 * i + 2] * n.z - o[0 * i + 1] * n.y) / o[0 * i + 0], isNaN(n.x) || isNaN(n.y) || isNaN(n.z) || n.x === 1 / 0 || n.y === 1 / 0 || n.z === 1 / 0)
      throw `Could not solve equation! Got x=[${n.toString()}], b=[${e.toString()}], A=[${this.toString()}]`;
    return n;
  }
  /**
   * Get an element in the matrix by index. Index starts at 0, not 1!!!
   * @param value If provided, the matrix element will be set to this value.
   */
  e(e, n, r) {
    if (r === void 0)
      return this.elements[n + 3 * e];
    this.elements[n + 3 * e] = r;
  }
  /**
   * Copy another matrix into this matrix object.
   */
  copy(e) {
    for (let n = 0; n < e.elements.length; n++)
      this.elements[n] = e.elements[n];
    return this;
  }
  /**
   * Returns a string representation of the matrix.
   */
  toString() {
    let e = "";
    const n = ",";
    for (let r = 0; r < 9; r++)
      e += this.elements[r] + n;
    return e;
  }
  /**
   * reverse the matrix
   * @param target Target matrix to save in.
   * @return The solution x
   */
  reverse(e) {
    e === void 0 && (e = new tt());
    const n = 3, r = 6, i = Op;
    let o, s;
    for (o = 0; o < 3; o++)
      for (s = 0; s < 3; s++)
        i[o + r * s] = this.elements[o + 3 * s];
    i[3 + 6 * 0] = 1, i[3 + 6 * 1] = 0, i[3 + 6 * 2] = 0, i[4 + 6 * 0] = 0, i[4 + 6 * 1] = 1, i[4 + 6 * 2] = 0, i[5 + 6 * 0] = 0, i[5 + 6 * 1] = 0, i[5 + 6 * 2] = 1;
    let l = 3;
    const u = l;
    let a;
    const h = r;
    let p;
    do {
      if (o = u - l, i[o + r * o] === 0) {
        for (s = o + 1; s < u; s++)
          if (i[o + r * s] !== 0) {
            a = h;
            do
              p = h - a, i[p + r * o] += i[p + r * s];
            while (--a);
            break;
          }
      }
      if (i[o + r * o] !== 0)
        for (s = o + 1; s < u; s++) {
          const c = i[o + r * s] / i[o + r * o];
          a = h;
          do
            p = h - a, i[p + r * s] = p <= o ? 0 : i[p + r * s] - i[p + r * o] * c;
          while (--a);
        }
    } while (--l);
    o = 2;
    do {
      s = o - 1;
      do {
        const c = i[o + r * s] / i[o + r * o];
        a = r;
        do
          p = r - a, i[p + r * s] = i[p + r * s] - i[p + r * o] * c;
        while (--a);
      } while (s--);
    } while (--o);
    o = 2;
    do {
      const c = 1 / i[o + r * o];
      a = r;
      do
        p = r - a, i[p + r * o] = i[p + r * o] * c;
      while (--a);
    } while (o--);
    o = 2;
    do {
      s = 2;
      do {
        if (p = i[n + s + r * o], isNaN(p) || p === 1 / 0)
          throw `Could not reverse! A=[${this.toString()}]`;
        e.e(o, s, p);
      } while (s--);
    } while (o--);
    return e;
  }
  /**
   * Set the matrix from a quaterion
   */
  setRotationFromQuaternion(e) {
    const n = e.x, r = e.y, i = e.z, o = e.w, s = n + n, l = r + r, u = i + i, a = n * s, h = n * l, p = n * u, c = r * l, y = r * u, v = i * u, w = o * s, S = o * l, m = o * u, d = this.elements;
    return d[3 * 0 + 0] = 1 - (c + v), d[3 * 0 + 1] = h - m, d[3 * 0 + 2] = p + S, d[3 * 1 + 0] = h + m, d[3 * 1 + 1] = 1 - (a + v), d[3 * 1 + 2] = y - w, d[3 * 2 + 0] = p - S, d[3 * 2 + 1] = y + w, d[3 * 2 + 2] = 1 - (a + c), this;
  }
  /**
   * Transpose the matrix
   * @param target Optional. Where to store the result.
   * @return The target Mat3, or a new Mat3 if target was omitted.
   */
  transpose(e) {
    e === void 0 && (e = new tt());
    const n = this.elements, r = e.elements;
    let i;
    return r[0] = n[0], r[4] = n[4], r[8] = n[8], i = n[1], r[1] = n[3], r[3] = i, i = n[2], r[2] = n[6], r[6] = i, i = n[5], r[5] = n[7], r[7] = i, e;
  }
}
const Op = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
class f {
  constructor(e, n, r) {
    e === void 0 && (e = 0), n === void 0 && (n = 0), r === void 0 && (r = 0), this.x = e, this.y = n, this.z = r;
  }
  /**
   * Vector cross product
   * @param target Optional target to save in.
   */
  cross(e, n) {
    n === void 0 && (n = new f());
    const r = e.x, i = e.y, o = e.z, s = this.x, l = this.y, u = this.z;
    return n.x = l * o - u * i, n.y = u * r - s * o, n.z = s * i - l * r, n;
  }
  /**
   * Set the vectors' 3 elements
   */
  set(e, n, r) {
    return this.x = e, this.y = n, this.z = r, this;
  }
  /**
   * Set all components of the vector to zero.
   */
  setZero() {
    this.x = this.y = this.z = 0;
  }
  /**
   * Vector addition
   */
  vadd(e, n) {
    if (n)
      n.x = e.x + this.x, n.y = e.y + this.y, n.z = e.z + this.z;
    else
      return new f(this.x + e.x, this.y + e.y, this.z + e.z);
  }
  /**
   * Vector subtraction
   * @param target Optional target to save in.
   */
  vsub(e, n) {
    if (n)
      n.x = this.x - e.x, n.y = this.y - e.y, n.z = this.z - e.z;
    else
      return new f(this.x - e.x, this.y - e.y, this.z - e.z);
  }
  /**
   * Get the cross product matrix a_cross from a vector, such that a x b = a_cross * b = c
   *
   * See {@link https://www8.cs.umu.se/kurser/TDBD24/VT06/lectures/Lecture6.pdf Umeå University Lecture}
   */
  crossmat() {
    return new tt([0, -this.z, this.y, this.z, 0, -this.x, -this.y, this.x, 0]);
  }
  /**
   * Normalize the vector. Note that this changes the values in the vector.
    * @return Returns the norm of the vector
   */
  normalize() {
    const e = this.x, n = this.y, r = this.z, i = Math.sqrt(e * e + n * n + r * r);
    if (i > 0) {
      const o = 1 / i;
      this.x *= o, this.y *= o, this.z *= o;
    } else
      this.x = 0, this.y = 0, this.z = 0;
    return i;
  }
  /**
   * Get the version of this vector that is of length 1.
   * @param target Optional target to save in
   * @return Returns the unit vector
   */
  unit(e) {
    e === void 0 && (e = new f());
    const n = this.x, r = this.y, i = this.z;
    let o = Math.sqrt(n * n + r * r + i * i);
    return o > 0 ? (o = 1 / o, e.x = n * o, e.y = r * o, e.z = i * o) : (e.x = 1, e.y = 0, e.z = 0), e;
  }
  /**
   * Get the length of the vector
   */
  length() {
    const e = this.x, n = this.y, r = this.z;
    return Math.sqrt(e * e + n * n + r * r);
  }
  /**
   * Get the squared length of the vector.
   */
  lengthSquared() {
    return this.dot(this);
  }
  /**
   * Get distance from this point to another point
   */
  distanceTo(e) {
    const n = this.x, r = this.y, i = this.z, o = e.x, s = e.y, l = e.z;
    return Math.sqrt((o - n) * (o - n) + (s - r) * (s - r) + (l - i) * (l - i));
  }
  /**
   * Get squared distance from this point to another point
   */
  distanceSquared(e) {
    const n = this.x, r = this.y, i = this.z, o = e.x, s = e.y, l = e.z;
    return (o - n) * (o - n) + (s - r) * (s - r) + (l - i) * (l - i);
  }
  /**
   * Multiply all the components of the vector with a scalar.
   * @param target The vector to save the result in.
   */
  scale(e, n) {
    n === void 0 && (n = new f());
    const r = this.x, i = this.y, o = this.z;
    return n.x = e * r, n.y = e * i, n.z = e * o, n;
  }
  /**
   * Multiply the vector with an other vector, component-wise.
   * @param target The vector to save the result in.
   */
  vmul(e, n) {
    return n === void 0 && (n = new f()), n.x = e.x * this.x, n.y = e.y * this.y, n.z = e.z * this.z, n;
  }
  /**
   * Scale a vector and add it to this vector. Save the result in "target". (target = this + vector * scalar)
   * @param target The vector to save the result in.
   */
  addScaledVector(e, n, r) {
    return r === void 0 && (r = new f()), r.x = this.x + e * n.x, r.y = this.y + e * n.y, r.z = this.z + e * n.z, r;
  }
  /**
   * Calculate dot product
   * @param vector
   */
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z;
  }
  isZero() {
    return this.x === 0 && this.y === 0 && this.z === 0;
  }
  /**
   * Make the vector point in the opposite direction.
   * @param target Optional target to save in
   */
  negate(e) {
    return e === void 0 && (e = new f()), e.x = -this.x, e.y = -this.y, e.z = -this.z, e;
  }
  /**
   * Compute two artificial tangents to the vector
   * @param t1 Vector object to save the first tangent in
   * @param t2 Vector object to save the second tangent in
   */
  tangents(e, n) {
    const r = this.length();
    if (r > 0) {
      const i = jp, o = 1 / r;
      i.set(this.x * o, this.y * o, this.z * o);
      const s = Dp;
      Math.abs(i.x) < 0.9 ? (s.set(1, 0, 0), i.cross(s, e)) : (s.set(0, 1, 0), i.cross(s, e)), i.cross(e, n);
    } else
      e.set(1, 0, 0), n.set(0, 1, 0);
  }
  /**
   * Converts to a more readable format
   */
  toString() {
    return `${this.x},${this.y},${this.z}`;
  }
  /**
   * Converts to an array
   */
  toArray() {
    return [this.x, this.y, this.z];
  }
  /**
   * Copies value of source to this vector.
   */
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this;
  }
  /**
   * Do a linear interpolation between two vectors
   * @param t A number between 0 and 1. 0 will make this function return u, and 1 will make it return v. Numbers in between will generate a vector in between them.
   */
  lerp(e, n, r) {
    const i = this.x, o = this.y, s = this.z;
    r.x = i + (e.x - i) * n, r.y = o + (e.y - o) * n, r.z = s + (e.z - s) * n;
  }
  /**
   * Check if a vector equals is almost equal to another one.
   */
  almostEquals(e, n) {
    return n === void 0 && (n = 1e-6), !(Math.abs(this.x - e.x) > n || Math.abs(this.y - e.y) > n || Math.abs(this.z - e.z) > n);
  }
  /**
   * Check if a vector is almost zero
   */
  almostZero(e) {
    return e === void 0 && (e = 1e-6), !(Math.abs(this.x) > e || Math.abs(this.y) > e || Math.abs(this.z) > e);
  }
  /**
   * Check if the vector is anti-parallel to another vector.
   * @param precision Set to zero for exact comparisons
   */
  isAntiparallelTo(e, n) {
    return this.negate(sa), sa.almostEquals(e, n);
  }
  /**
   * Clone the vector
   */
  clone() {
    return new f(this.x, this.y, this.z);
  }
}
f.ZERO = new f(0, 0, 0);
f.UNIT_X = new f(1, 0, 0);
f.UNIT_Y = new f(0, 1, 0);
f.UNIT_Z = new f(0, 0, 1);
const jp = new f(), Dp = new f(), sa = new f();
class qe {
  /**
   * The lower bound of the bounding box
   */
  /**
   * The upper bound of the bounding box
   */
  constructor(e) {
    e === void 0 && (e = {}), this.lowerBound = new f(), this.upperBound = new f(), e.lowerBound && this.lowerBound.copy(e.lowerBound), e.upperBound && this.upperBound.copy(e.upperBound);
  }
  /**
   * Set the AABB bounds from a set of points.
   * @param points An array of Vec3's.
   * @return The self object
   */
  setFromPoints(e, n, r, i) {
    const o = this.lowerBound, s = this.upperBound, l = r;
    o.copy(e[0]), l && l.vmult(o, o), s.copy(o);
    for (let u = 1; u < e.length; u++) {
      let a = e[u];
      l && (l.vmult(a, la), a = la), a.x > s.x && (s.x = a.x), a.x < o.x && (o.x = a.x), a.y > s.y && (s.y = a.y), a.y < o.y && (o.y = a.y), a.z > s.z && (s.z = a.z), a.z < o.z && (o.z = a.z);
    }
    return n && (n.vadd(o, o), n.vadd(s, s)), i && (o.x -= i, o.y -= i, o.z -= i, s.x += i, s.y += i, s.z += i), this;
  }
  /**
   * Copy bounds from an AABB to this AABB
   * @param aabb Source to copy from
   * @return The this object, for chainability
   */
  copy(e) {
    return this.lowerBound.copy(e.lowerBound), this.upperBound.copy(e.upperBound), this;
  }
  /**
   * Clone an AABB
   */
  clone() {
    return new qe().copy(this);
  }
  /**
   * Extend this AABB so that it covers the given AABB too.
   */
  extend(e) {
    this.lowerBound.x = Math.min(this.lowerBound.x, e.lowerBound.x), this.upperBound.x = Math.max(this.upperBound.x, e.upperBound.x), this.lowerBound.y = Math.min(this.lowerBound.y, e.lowerBound.y), this.upperBound.y = Math.max(this.upperBound.y, e.upperBound.y), this.lowerBound.z = Math.min(this.lowerBound.z, e.lowerBound.z), this.upperBound.z = Math.max(this.upperBound.z, e.upperBound.z);
  }
  /**
   * Returns true if the given AABB overlaps this AABB.
   */
  overlaps(e) {
    const n = this.lowerBound, r = this.upperBound, i = e.lowerBound, o = e.upperBound, s = i.x <= r.x && r.x <= o.x || n.x <= o.x && o.x <= r.x, l = i.y <= r.y && r.y <= o.y || n.y <= o.y && o.y <= r.y, u = i.z <= r.z && r.z <= o.z || n.z <= o.z && o.z <= r.z;
    return s && l && u;
  }
  // Mostly for debugging
  volume() {
    const e = this.lowerBound, n = this.upperBound;
    return (n.x - e.x) * (n.y - e.y) * (n.z - e.z);
  }
  /**
   * Returns true if the given AABB is fully contained in this AABB.
   */
  contains(e) {
    const n = this.lowerBound, r = this.upperBound, i = e.lowerBound, o = e.upperBound;
    return n.x <= i.x && r.x >= o.x && n.y <= i.y && r.y >= o.y && n.z <= i.z && r.z >= o.z;
  }
  getCorners(e, n, r, i, o, s, l, u) {
    const a = this.lowerBound, h = this.upperBound;
    e.copy(a), n.set(h.x, a.y, a.z), r.set(h.x, h.y, a.z), i.set(a.x, h.y, h.z), o.set(h.x, a.y, h.z), s.set(a.x, h.y, a.z), l.set(a.x, a.y, h.z), u.copy(h);
  }
  /**
   * Get the representation of an AABB in another frame.
   * @return The "target" AABB object.
   */
  toLocalFrame(e, n) {
    const r = ua, i = r[0], o = r[1], s = r[2], l = r[3], u = r[4], a = r[5], h = r[6], p = r[7];
    this.getCorners(i, o, s, l, u, a, h, p);
    for (let c = 0; c !== 8; c++) {
      const y = r[c];
      e.pointToLocal(y, y);
    }
    return n.setFromPoints(r);
  }
  /**
   * Get the representation of an AABB in the global frame.
   * @return The "target" AABB object.
   */
  toWorldFrame(e, n) {
    const r = ua, i = r[0], o = r[1], s = r[2], l = r[3], u = r[4], a = r[5], h = r[6], p = r[7];
    this.getCorners(i, o, s, l, u, a, h, p);
    for (let c = 0; c !== 8; c++) {
      const y = r[c];
      e.pointToWorld(y, y);
    }
    return n.setFromPoints(r);
  }
  /**
   * Check if the AABB is hit by a ray.
   */
  overlapsRay(e) {
    const {
      direction: n,
      from: r
    } = e, i = 1 / n.x, o = 1 / n.y, s = 1 / n.z, l = (this.lowerBound.x - r.x) * i, u = (this.upperBound.x - r.x) * i, a = (this.lowerBound.y - r.y) * o, h = (this.upperBound.y - r.y) * o, p = (this.lowerBound.z - r.z) * s, c = (this.upperBound.z - r.z) * s, y = Math.max(Math.max(Math.min(l, u), Math.min(a, h)), Math.min(p, c)), v = Math.min(Math.min(Math.max(l, u), Math.max(a, h)), Math.max(p, c));
    return !(v < 0 || y > v);
  }
}
const la = new f(), ua = [new f(), new f(), new f(), new f(), new f(), new f(), new f(), new f()];
class aa {
  /**
   * The matrix storage.
   */
  constructor() {
    this.matrix = [];
  }
  /**
   * Get an element
   */
  get(e, n) {
    let {
      index: r
    } = e, {
      index: i
    } = n;
    if (i > r) {
      const o = i;
      i = r, r = o;
    }
    return this.matrix[(r * (r + 1) >> 1) + i - 1];
  }
  /**
   * Set an element
   */
  set(e, n, r) {
    let {
      index: i
    } = e, {
      index: o
    } = n;
    if (o > i) {
      const s = o;
      o = i, i = s;
    }
    this.matrix[(i * (i + 1) >> 1) + o - 1] = r ? 1 : 0;
  }
  /**
   * Sets all elements to zero
   */
  reset() {
    for (let e = 0, n = this.matrix.length; e !== n; e++)
      this.matrix[e] = 0;
  }
  /**
   * Sets the max number of objects
   */
  setNumObjects(e) {
    this.matrix.length = e * (e - 1) >> 1;
  }
}
class Dd {
  /**
   * Add an event listener
   * @return The self object, for chainability.
   */
  addEventListener(e, n) {
    this._listeners === void 0 && (this._listeners = {});
    const r = this._listeners;
    return r[e] === void 0 && (r[e] = []), r[e].includes(n) || r[e].push(n), this;
  }
  /**
   * Check if an event listener is added
   */
  hasEventListener(e, n) {
    if (this._listeners === void 0)
      return !1;
    const r = this._listeners;
    return !!(r[e] !== void 0 && r[e].includes(n));
  }
  /**
   * Check if any event listener of the given type is added
   */
  hasAnyEventListener(e) {
    return this._listeners === void 0 ? !1 : this._listeners[e] !== void 0;
  }
  /**
   * Remove an event listener
   * @return The self object, for chainability.
   */
  removeEventListener(e, n) {
    if (this._listeners === void 0)
      return this;
    const r = this._listeners;
    if (r[e] === void 0)
      return this;
    const i = r[e].indexOf(n);
    return i !== -1 && r[e].splice(i, 1), this;
  }
  /**
   * Emit an event.
   * @return The self object, for chainability.
   */
  dispatchEvent(e) {
    if (this._listeners === void 0)
      return this;
    const r = this._listeners[e.type];
    if (r !== void 0) {
      e.target = this;
      for (let i = 0, o = r.length; i < o; i++)
        r[i].call(this, e);
    }
    return this;
  }
}
class ue {
  constructor(e, n, r, i) {
    e === void 0 && (e = 0), n === void 0 && (n = 0), r === void 0 && (r = 0), i === void 0 && (i = 1), this.x = e, this.y = n, this.z = r, this.w = i;
  }
  /**
   * Set the value of the quaternion.
   */
  set(e, n, r, i) {
    return this.x = e, this.y = n, this.z = r, this.w = i, this;
  }
  /**
   * Convert to a readable format
   * @return "x,y,z,w"
   */
  toString() {
    return `${this.x},${this.y},${this.z},${this.w}`;
  }
  /**
   * Convert to an Array
   * @return [x, y, z, w]
   */
  toArray() {
    return [this.x, this.y, this.z, this.w];
  }
  /**
   * Set the quaternion components given an axis and an angle in radians.
   */
  setFromAxisAngle(e, n) {
    const r = Math.sin(n * 0.5);
    return this.x = e.x * r, this.y = e.y * r, this.z = e.z * r, this.w = Math.cos(n * 0.5), this;
  }
  /**
   * Converts the quaternion to [ axis, angle ] representation.
   * @param targetAxis A vector object to reuse for storing the axis.
   * @return An array, first element is the axis and the second is the angle in radians.
   */
  toAxisAngle(e) {
    e === void 0 && (e = new f()), this.normalize();
    const n = 2 * Math.acos(this.w), r = Math.sqrt(1 - this.w * this.w);
    return r < 1e-3 ? (e.x = this.x, e.y = this.y, e.z = this.z) : (e.x = this.x / r, e.y = this.y / r, e.z = this.z / r), [e, n];
  }
  /**
   * Set the quaternion value given two vectors. The resulting rotation will be the needed rotation to rotate u to v.
   */
  setFromVectors(e, n) {
    if (e.isAntiparallelTo(n)) {
      const r = Wp, i = Vp;
      e.tangents(r, i), this.setFromAxisAngle(r, Math.PI);
    } else {
      const r = e.cross(n);
      this.x = r.x, this.y = r.y, this.z = r.z, this.w = Math.sqrt(e.length() ** 2 * n.length() ** 2) + e.dot(n), this.normalize();
    }
    return this;
  }
  /**
   * Multiply the quaternion with an other quaternion.
   */
  mult(e, n) {
    n === void 0 && (n = new ue());
    const r = this.x, i = this.y, o = this.z, s = this.w, l = e.x, u = e.y, a = e.z, h = e.w;
    return n.x = r * h + s * l + i * a - o * u, n.y = i * h + s * u + o * l - r * a, n.z = o * h + s * a + r * u - i * l, n.w = s * h - r * l - i * u - o * a, n;
  }
  /**
   * Get the inverse quaternion rotation.
   */
  inverse(e) {
    e === void 0 && (e = new ue());
    const n = this.x, r = this.y, i = this.z, o = this.w;
    this.conjugate(e);
    const s = 1 / (n * n + r * r + i * i + o * o);
    return e.x *= s, e.y *= s, e.z *= s, e.w *= s, e;
  }
  /**
   * Get the quaternion conjugate
   */
  conjugate(e) {
    return e === void 0 && (e = new ue()), e.x = -this.x, e.y = -this.y, e.z = -this.z, e.w = this.w, e;
  }
  /**
   * Normalize the quaternion. Note that this changes the values of the quaternion.
   */
  normalize() {
    let e = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    return e === 0 ? (this.x = 0, this.y = 0, this.z = 0, this.w = 0) : (e = 1 / e, this.x *= e, this.y *= e, this.z *= e, this.w *= e), this;
  }
  /**
   * Approximation of quaternion normalization. Works best when quat is already almost-normalized.
   * @author unphased, https://github.com/unphased
   */
  normalizeFast() {
    const e = (3 - (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)) / 2;
    return e === 0 ? (this.x = 0, this.y = 0, this.z = 0, this.w = 0) : (this.x *= e, this.y *= e, this.z *= e, this.w *= e), this;
  }
  /**
   * Multiply the quaternion by a vector
   */
  vmult(e, n) {
    n === void 0 && (n = new f());
    const r = e.x, i = e.y, o = e.z, s = this.x, l = this.y, u = this.z, a = this.w, h = a * r + l * o - u * i, p = a * i + u * r - s * o, c = a * o + s * i - l * r, y = -s * r - l * i - u * o;
    return n.x = h * a + y * -s + p * -u - c * -l, n.y = p * a + y * -l + c * -s - h * -u, n.z = c * a + y * -u + h * -l - p * -s, n;
  }
  /**
   * Copies value of source to this quaternion.
   * @return this
   */
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w, this;
  }
  /**
   * Convert the quaternion to euler angle representation. Order: YZX, as this page describes: https://www.euclideanspace.com/maths/standards/index.htm
   * @param order Three-character string, defaults to "YZX"
   */
  toEuler(e, n) {
    n === void 0 && (n = "YZX");
    let r, i, o;
    const s = this.x, l = this.y, u = this.z, a = this.w;
    switch (n) {
      case "YZX":
        const h = s * l + u * a;
        if (h > 0.499 && (r = 2 * Math.atan2(s, a), i = Math.PI / 2, o = 0), h < -0.499 && (r = -2 * Math.atan2(s, a), i = -Math.PI / 2, o = 0), r === void 0) {
          const p = s * s, c = l * l, y = u * u;
          r = Math.atan2(2 * l * a - 2 * s * u, 1 - 2 * c - 2 * y), i = Math.asin(2 * h), o = Math.atan2(2 * s * a - 2 * l * u, 1 - 2 * p - 2 * y);
        }
        break;
      default:
        throw new Error(`Euler order ${n} not supported yet.`);
    }
    e.y = r, e.z = i, e.x = o;
  }
  /**
   * Set the quaternion components given Euler angle representation.
   *
   * @param order The order to apply angles: 'XYZ' or 'YXZ' or any other combination.
   *
   * See {@link https://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors MathWorks} reference
   */
  setFromEuler(e, n, r, i) {
    i === void 0 && (i = "XYZ");
    const o = Math.cos(e / 2), s = Math.cos(n / 2), l = Math.cos(r / 2), u = Math.sin(e / 2), a = Math.sin(n / 2), h = Math.sin(r / 2);
    return i === "XYZ" ? (this.x = u * s * l + o * a * h, this.y = o * a * l - u * s * h, this.z = o * s * h + u * a * l, this.w = o * s * l - u * a * h) : i === "YXZ" ? (this.x = u * s * l + o * a * h, this.y = o * a * l - u * s * h, this.z = o * s * h - u * a * l, this.w = o * s * l + u * a * h) : i === "ZXY" ? (this.x = u * s * l - o * a * h, this.y = o * a * l + u * s * h, this.z = o * s * h + u * a * l, this.w = o * s * l - u * a * h) : i === "ZYX" ? (this.x = u * s * l - o * a * h, this.y = o * a * l + u * s * h, this.z = o * s * h - u * a * l, this.w = o * s * l + u * a * h) : i === "YZX" ? (this.x = u * s * l + o * a * h, this.y = o * a * l + u * s * h, this.z = o * s * h - u * a * l, this.w = o * s * l - u * a * h) : i === "XZY" && (this.x = u * s * l - o * a * h, this.y = o * a * l - u * s * h, this.z = o * s * h + u * a * l, this.w = o * s * l + u * a * h), this;
  }
  clone() {
    return new ue(this.x, this.y, this.z, this.w);
  }
  /**
   * Performs a spherical linear interpolation between two quat
   *
   * @param toQuat second operand
   * @param t interpolation amount between the self quaternion and toQuat
   * @param target A quaternion to store the result in. If not provided, a new one will be created.
   * @returns {Quaternion} The "target" object
   */
  slerp(e, n, r) {
    r === void 0 && (r = new ue());
    const i = this.x, o = this.y, s = this.z, l = this.w;
    let u = e.x, a = e.y, h = e.z, p = e.w, c, y, v, w, S;
    return y = i * u + o * a + s * h + l * p, y < 0 && (y = -y, u = -u, a = -a, h = -h, p = -p), 1 - y > 1e-6 ? (c = Math.acos(y), v = Math.sin(c), w = Math.sin((1 - n) * c) / v, S = Math.sin(n * c) / v) : (w = 1 - n, S = n), r.x = w * i + S * u, r.y = w * o + S * a, r.z = w * s + S * h, r.w = w * l + S * p, r;
  }
  /**
   * Rotate an absolute orientation quaternion given an angular velocity and a time step.
   */
  integrate(e, n, r, i) {
    i === void 0 && (i = new ue());
    const o = e.x * r.x, s = e.y * r.y, l = e.z * r.z, u = this.x, a = this.y, h = this.z, p = this.w, c = n * 0.5;
    return i.x += c * (o * p + s * h - l * a), i.y += c * (s * p + l * u - o * h), i.z += c * (l * p + o * a - s * u), i.w += c * (-o * u - s * a - l * h), i;
  }
}
const Wp = new f(), Vp = new f(), qp = {
  /** SPHERE */
  SPHERE: 1,
  /** PLANE */
  PLANE: 2,
  /** BOX */
  BOX: 4,
  /** COMPOUND */
  COMPOUND: 8,
  /** CONVEXPOLYHEDRON */
  CONVEXPOLYHEDRON: 16,
  /** HEIGHTFIELD */
  HEIGHTFIELD: 32,
  /** PARTICLE */
  PARTICLE: 64,
  /** CYLINDER */
  CYLINDER: 128,
  /** TRIMESH */
  TRIMESH: 256
};
class j {
  /**
   * Identifier of the Shape.
   */
  /**
   * The type of this shape. Must be set to an int > 0 by subclasses.
   */
  /**
   * The local bounding sphere radius of this shape.
   */
  /**
   * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled.
   * @default true
   */
  /**
   * @default 1
   */
  /**
   * @default -1
   */
  /**
   * Optional material of the shape that regulates contact properties.
   */
  /**
   * The body to which the shape is added to.
   */
  /**
   * All the Shape types.
   */
  constructor(e) {
    e === void 0 && (e = {}), this.id = j.idCounter++, this.type = e.type || 0, this.boundingSphereRadius = 0, this.collisionResponse = e.collisionResponse ? e.collisionResponse : !0, this.collisionFilterGroup = e.collisionFilterGroup !== void 0 ? e.collisionFilterGroup : 1, this.collisionFilterMask = e.collisionFilterMask !== void 0 ? e.collisionFilterMask : -1, this.material = e.material ? e.material : null, this.body = null;
  }
  /**
   * Computes the bounding sphere radius.
   * The result is stored in the property `.boundingSphereRadius`
   */
  updateBoundingSphereRadius() {
    throw `computeBoundingSphereRadius() not implemented for shape type ${this.type}`;
  }
  /**
   * Get the volume of this shape
   */
  volume() {
    throw `volume() not implemented for shape type ${this.type}`;
  }
  /**
   * Calculates the inertia in the local frame for this shape.
   * @see http://en.wikipedia.org/wiki/List_of_moments_of_inertia
   */
  calculateLocalInertia(e, n) {
    throw `calculateLocalInertia() not implemented for shape type ${this.type}`;
  }
  /**
   * @todo use abstract for these kind of methods
   */
  calculateWorldAABB(e, n, r, i) {
    throw `calculateWorldAABB() not implemented for shape type ${this.type}`;
  }
}
j.idCounter = 0;
j.types = qp;
class G {
  /**
   * position
   */
  /**
   * quaternion
   */
  constructor(e) {
    e === void 0 && (e = {}), this.position = new f(), this.quaternion = new ue(), e.position && this.position.copy(e.position), e.quaternion && this.quaternion.copy(e.quaternion);
  }
  /**
   * Get a global point in local transform coordinates.
   */
  pointToLocal(e, n) {
    return G.pointToLocalFrame(this.position, this.quaternion, e, n);
  }
  /**
   * Get a local point in global transform coordinates.
   */
  pointToWorld(e, n) {
    return G.pointToWorldFrame(this.position, this.quaternion, e, n);
  }
  /**
   * vectorToWorldFrame
   */
  vectorToWorldFrame(e, n) {
    return n === void 0 && (n = new f()), this.quaternion.vmult(e, n), n;
  }
  /**
   * pointToLocalFrame
   */
  static pointToLocalFrame(e, n, r, i) {
    return i === void 0 && (i = new f()), r.vsub(e, i), n.conjugate(ca), ca.vmult(i, i), i;
  }
  /**
   * pointToWorldFrame
   */
  static pointToWorldFrame(e, n, r, i) {
    return i === void 0 && (i = new f()), n.vmult(r, i), i.vadd(e, i), i;
  }
  /**
   * vectorToWorldFrame
   */
  static vectorToWorldFrame(e, n, r) {
    return r === void 0 && (r = new f()), e.vmult(n, r), r;
  }
  /**
   * vectorToLocalFrame
   */
  static vectorToLocalFrame(e, n, r, i) {
    return i === void 0 && (i = new f()), n.w *= -1, n.vmult(r, i), n.w *= -1, i;
  }
}
const ca = new ue();
class Er extends j {
  /** vertices */
  /**
   * Array of integer arrays, indicating which vertices each face consists of
   */
  /** faceNormals */
  /** worldVertices */
  /** worldVerticesNeedsUpdate */
  /** worldFaceNormals */
  /** worldFaceNormalsNeedsUpdate */
  /**
   * If given, these locally defined, normalized axes are the only ones being checked when doing separating axis check.
   */
  /** uniqueEdges */
  /**
   * @param vertices An array of Vec3's
   * @param faces Array of integer arrays, describing which vertices that is included in each face.
   */
  constructor(e) {
    e === void 0 && (e = {});
    const {
      vertices: n = [],
      faces: r = [],
      normals: i = [],
      axes: o,
      boundingSphereRadius: s
    } = e;
    super({
      type: j.types.CONVEXPOLYHEDRON
    }), this.vertices = n, this.faces = r, this.faceNormals = i, this.faceNormals.length === 0 && this.computeNormals(), s ? this.boundingSphereRadius = s : this.updateBoundingSphereRadius(), this.worldVertices = [], this.worldVerticesNeedsUpdate = !0, this.worldFaceNormals = [], this.worldFaceNormalsNeedsUpdate = !0, this.uniqueAxes = o ? o.slice() : null, this.uniqueEdges = [], this.computeEdges();
  }
  /**
   * Computes uniqueEdges
   */
  computeEdges() {
    const e = this.faces, n = this.vertices, r = this.uniqueEdges;
    r.length = 0;
    const i = new f();
    for (let o = 0; o !== e.length; o++) {
      const s = e[o], l = s.length;
      for (let u = 0; u !== l; u++) {
        const a = (u + 1) % l;
        n[s[u]].vsub(n[s[a]], i), i.normalize();
        let h = !1;
        for (let p = 0; p !== r.length; p++)
          if (r[p].almostEquals(i) || r[p].almostEquals(i)) {
            h = !0;
            break;
          }
        h || r.push(i.clone());
      }
    }
  }
  /**
   * Compute the normals of the faces.
   * Will reuse existing Vec3 objects in the `faceNormals` array if they exist.
   */
  computeNormals() {
    this.faceNormals.length = this.faces.length;
    for (let e = 0; e < this.faces.length; e++) {
      for (let i = 0; i < this.faces[e].length; i++)
        if (!this.vertices[this.faces[e][i]])
          throw new Error(`Vertex ${this.faces[e][i]} not found!`);
      const n = this.faceNormals[e] || new f();
      this.getFaceNormal(e, n), n.negate(n), this.faceNormals[e] = n;
      const r = this.vertices[this.faces[e][0]];
      if (n.dot(r) < 0) {
        console.error(`.faceNormals[${e}] = Vec3(${n.toString()}) looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.`);
        for (let i = 0; i < this.faces[e].length; i++)
          console.warn(`.vertices[${this.faces[e][i]}] = Vec3(${this.vertices[this.faces[e][i]].toString()})`);
      }
    }
  }
  /**
   * Compute the normal of a face from its vertices
   */
  getFaceNormal(e, n) {
    const r = this.faces[e], i = this.vertices[r[0]], o = this.vertices[r[1]], s = this.vertices[r[2]];
    Er.computeNormal(i, o, s, n);
  }
  /**
   * Get face normal given 3 vertices
   */
  static computeNormal(e, n, r, i) {
    const o = new f(), s = new f();
    n.vsub(e, s), r.vsub(n, o), o.cross(s, i), i.isZero() || i.normalize();
  }
  /**
   * @param minDist Clamp distance
   * @param result The an array of contact point objects, see clipFaceAgainstHull
   */
  clipAgainstHull(e, n, r, i, o, s, l, u, a) {
    const h = new f();
    let p = -1, c = -Number.MAX_VALUE;
    for (let v = 0; v < r.faces.length; v++) {
      h.copy(r.faceNormals[v]), o.vmult(h, h);
      const w = h.dot(s);
      w > c && (c = w, p = v);
    }
    const y = [];
    for (let v = 0; v < r.faces[p].length; v++) {
      const w = r.vertices[r.faces[p][v]], S = new f();
      S.copy(w), o.vmult(S, S), i.vadd(S, S), y.push(S);
    }
    p >= 0 && this.clipFaceAgainstHull(s, e, n, y, l, u, a);
  }
  /**
   * Find the separating axis between this hull and another
   * @param target The target vector to save the axis in
   * @return Returns false if a separation is found, else true
   */
  findSeparatingAxis(e, n, r, i, o, s, l, u) {
    const a = new f(), h = new f(), p = new f(), c = new f(), y = new f(), v = new f();
    let w = Number.MAX_VALUE;
    const S = this;
    if (S.uniqueAxes)
      for (let m = 0; m !== S.uniqueAxes.length; m++) {
        r.vmult(S.uniqueAxes[m], a);
        const d = S.testSepAxis(a, e, n, r, i, o);
        if (d === !1)
          return !1;
        d < w && (w = d, s.copy(a));
      }
    else {
      const m = l ? l.length : S.faces.length;
      for (let d = 0; d < m; d++) {
        const g = l ? l[d] : d;
        a.copy(S.faceNormals[g]), r.vmult(a, a);
        const x = S.testSepAxis(a, e, n, r, i, o);
        if (x === !1)
          return !1;
        x < w && (w = x, s.copy(a));
      }
    }
    if (e.uniqueAxes)
      for (let m = 0; m !== e.uniqueAxes.length; m++) {
        o.vmult(e.uniqueAxes[m], h);
        const d = S.testSepAxis(h, e, n, r, i, o);
        if (d === !1)
          return !1;
        d < w && (w = d, s.copy(h));
      }
    else {
      const m = u ? u.length : e.faces.length;
      for (let d = 0; d < m; d++) {
        const g = u ? u[d] : d;
        h.copy(e.faceNormals[g]), o.vmult(h, h);
        const x = S.testSepAxis(h, e, n, r, i, o);
        if (x === !1)
          return !1;
        x < w && (w = x, s.copy(h));
      }
    }
    for (let m = 0; m !== S.uniqueEdges.length; m++) {
      r.vmult(S.uniqueEdges[m], c);
      for (let d = 0; d !== e.uniqueEdges.length; d++)
        if (o.vmult(e.uniqueEdges[d], y), c.cross(y, v), !v.almostZero()) {
          v.normalize();
          const g = S.testSepAxis(v, e, n, r, i, o);
          if (g === !1)
            return !1;
          g < w && (w = g, s.copy(v));
        }
    }
    return i.vsub(n, p), p.dot(s) > 0 && s.negate(s), !0;
  }
  /**
   * Test separating axis against two hulls. Both hulls are projected onto the axis and the overlap size is returned if there is one.
   * @return The overlap depth, or FALSE if no penetration.
   */
  testSepAxis(e, n, r, i, o, s) {
    const l = this;
    Er.project(l, e, r, i, Qo), Er.project(n, e, o, s, Ko);
    const u = Qo[0], a = Qo[1], h = Ko[0], p = Ko[1];
    if (u < p || h < a)
      return !1;
    const c = u - p, y = h - a;
    return c < y ? c : y;
  }
  /**
   * calculateLocalInertia
   */
  calculateLocalInertia(e, n) {
    const r = new f(), i = new f();
    this.computeLocalAABB(i, r);
    const o = r.x - i.x, s = r.y - i.y, l = r.z - i.z;
    n.x = 1 / 12 * e * (2 * s * 2 * s + 2 * l * 2 * l), n.y = 1 / 12 * e * (2 * o * 2 * o + 2 * l * 2 * l), n.z = 1 / 12 * e * (2 * s * 2 * s + 2 * o * 2 * o);
  }
  /**
   * @param face_i Index of the face
   */
  getPlaneConstantOfFace(e) {
    const n = this.faces[e], r = this.faceNormals[e], i = this.vertices[n[0]];
    return -r.dot(i);
  }
  /**
   * Clip a face against a hull.
   * @param worldVertsB1 An array of Vec3 with vertices in the world frame.
   * @param minDist Distance clamping
   * @param Array result Array to store resulting contact points in. Will be objects with properties: point, depth, normal. These are represented in world coordinates.
   */
  clipFaceAgainstHull(e, n, r, i, o, s, l) {
    const u = new f(), a = new f(), h = new f(), p = new f(), c = new f(), y = new f(), v = new f(), w = new f(), S = this, m = [], d = i, g = m;
    let x = -1, E = Number.MAX_VALUE;
    for (let M = 0; M < S.faces.length; M++) {
      u.copy(S.faceNormals[M]), r.vmult(u, u);
      const D = u.dot(e);
      D < E && (E = D, x = M);
    }
    if (x < 0)
      return;
    const z = S.faces[x];
    z.connectedFaces = [];
    for (let M = 0; M < S.faces.length; M++)
      for (let D = 0; D < S.faces[M].length; D++)
        /* Sharing a vertex*/
        z.indexOf(S.faces[M][D]) !== -1 && /* Not the one we are looking for connections from */
        M !== x && /* Not already added */
        z.connectedFaces.indexOf(M) === -1 && z.connectedFaces.push(M);
    const C = z.length;
    for (let M = 0; M < C; M++) {
      const D = S.vertices[z[M]], V = S.vertices[z[(M + 1) % C]];
      D.vsub(V, a), h.copy(a), r.vmult(h, h), n.vadd(h, h), p.copy(this.faceNormals[x]), r.vmult(p, p), n.vadd(p, p), h.cross(p, c), c.negate(c), y.copy(D), r.vmult(y, y), n.vadd(y, y);
      const N = z.connectedFaces[M];
      v.copy(this.faceNormals[N]);
      const B = this.getPlaneConstantOfFace(N);
      w.copy(v), r.vmult(w, w);
      const L = B - w.dot(n);
      for (this.clipFaceAgainstPlane(d, g, w, L); d.length; )
        d.shift();
      for (; g.length; )
        d.push(g.shift());
    }
    v.copy(this.faceNormals[x]);
    const k = this.getPlaneConstantOfFace(x);
    w.copy(v), r.vmult(w, w);
    const O = k - w.dot(n);
    for (let M = 0; M < d.length; M++) {
      let D = w.dot(d[M]) + O;
      if (D <= o && (console.log(`clamped: depth=${D} to minDist=${o}`), D = o), D <= s) {
        const V = d[M];
        if (D <= 1e-6) {
          const N = {
            point: V,
            normal: w,
            depth: D
          };
          l.push(N);
        }
      }
    }
  }
  /**
   * Clip a face in a hull against the back of a plane.
   * @param planeConstant The constant in the mathematical plane equation
   */
  clipFaceAgainstPlane(e, n, r, i) {
    let o, s;
    const l = e.length;
    if (l < 2)
      return n;
    let u = e[e.length - 1], a = e[0];
    o = r.dot(u) + i;
    for (let h = 0; h < l; h++) {
      if (a = e[h], s = r.dot(a) + i, o < 0)
        if (s < 0) {
          const p = new f();
          p.copy(a), n.push(p);
        } else {
          const p = new f();
          u.lerp(a, o / (o - s), p), n.push(p);
        }
      else if (s < 0) {
        const p = new f();
        u.lerp(a, o / (o - s), p), n.push(p), n.push(a);
      }
      u = a, o = s;
    }
    return n;
  }
  /**
   * Updates `.worldVertices` and sets `.worldVerticesNeedsUpdate` to false.
   */
  computeWorldVertices(e, n) {
    for (; this.worldVertices.length < this.vertices.length; )
      this.worldVertices.push(new f());
    const r = this.vertices, i = this.worldVertices;
    for (let o = 0; o !== this.vertices.length; o++)
      n.vmult(r[o], i[o]), e.vadd(i[o], i[o]);
    this.worldVerticesNeedsUpdate = !1;
  }
  computeLocalAABB(e, n) {
    const r = this.vertices;
    e.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE), n.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    for (let i = 0; i < this.vertices.length; i++) {
      const o = r[i];
      o.x < e.x ? e.x = o.x : o.x > n.x && (n.x = o.x), o.y < e.y ? e.y = o.y : o.y > n.y && (n.y = o.y), o.z < e.z ? e.z = o.z : o.z > n.z && (n.z = o.z);
    }
  }
  /**
   * Updates `worldVertices` and sets `worldVerticesNeedsUpdate` to false.
   */
  computeWorldFaceNormals(e) {
    const n = this.faceNormals.length;
    for (; this.worldFaceNormals.length < n; )
      this.worldFaceNormals.push(new f());
    const r = this.faceNormals, i = this.worldFaceNormals;
    for (let o = 0; o !== n; o++)
      e.vmult(r[o], i[o]);
    this.worldFaceNormalsNeedsUpdate = !1;
  }
  /**
   * updateBoundingSphereRadius
   */
  updateBoundingSphereRadius() {
    let e = 0;
    const n = this.vertices;
    for (let r = 0; r !== n.length; r++) {
      const i = n[r].lengthSquared();
      i > e && (e = i);
    }
    this.boundingSphereRadius = Math.sqrt(e);
  }
  /**
   * calculateWorldAABB
   */
  calculateWorldAABB(e, n, r, i) {
    const o = this.vertices;
    let s, l, u, a, h, p, c = new f();
    for (let y = 0; y < o.length; y++) {
      c.copy(o[y]), n.vmult(c, c), e.vadd(c, c);
      const v = c;
      (s === void 0 || v.x < s) && (s = v.x), (a === void 0 || v.x > a) && (a = v.x), (l === void 0 || v.y < l) && (l = v.y), (h === void 0 || v.y > h) && (h = v.y), (u === void 0 || v.z < u) && (u = v.z), (p === void 0 || v.z > p) && (p = v.z);
    }
    r.set(s, l, u), i.set(a, h, p);
  }
  /**
   * Get approximate convex volume
   */
  volume() {
    return 4 * Math.PI * this.boundingSphereRadius / 3;
  }
  /**
   * Get an average of all the vertices positions
   */
  getAveragePointLocal(e) {
    e === void 0 && (e = new f());
    const n = this.vertices;
    for (let r = 0; r < n.length; r++)
      e.vadd(n[r], e);
    return e.scale(1 / n.length, e), e;
  }
  /**
   * Transform all local points. Will change the .vertices
   */
  transformAllPoints(e, n) {
    const r = this.vertices.length, i = this.vertices;
    if (n) {
      for (let o = 0; o < r; o++) {
        const s = i[o];
        n.vmult(s, s);
      }
      for (let o = 0; o < this.faceNormals.length; o++) {
        const s = this.faceNormals[o];
        n.vmult(s, s);
      }
    }
    if (e)
      for (let o = 0; o < r; o++) {
        const s = i[o];
        s.vadd(e, s);
      }
  }
  /**
   * Checks whether p is inside the polyhedra. Must be in local coords.
   * The point lies outside of the convex hull of the other points if and only if the direction
   * of all the vectors from it to those other points are on less than one half of a sphere around it.
   * @param p A point given in local coordinates
   */
  pointIsInside(e) {
    const n = this.vertices, r = this.faces, i = this.faceNormals, o = new f();
    this.getAveragePointLocal(o);
    for (let s = 0; s < this.faces.length; s++) {
      let l = i[s];
      const u = n[r[s][0]], a = new f();
      e.vsub(u, a);
      const h = l.dot(a), p = new f();
      o.vsub(u, p);
      const c = l.dot(p);
      if (h < 0 && c > 0 || h > 0 && c < 0)
        return !1;
    }
    return -1;
  }
  /**
   * Get max and min dot product of a convex hull at position (pos,quat) projected onto an axis.
   * Results are saved in the array maxmin.
   * @param result result[0] and result[1] will be set to maximum and minimum, respectively.
   */
  static project(e, n, r, i, o) {
    const s = e.vertices.length, l = Up;
    let u = 0, a = 0;
    const h = Hp, p = e.vertices;
    h.setZero(), G.vectorToLocalFrame(r, i, n, l), G.pointToLocalFrame(r, i, h, h);
    const c = h.dot(l);
    a = u = p[0].dot(l);
    for (let y = 1; y < s; y++) {
      const v = p[y].dot(l);
      v > u && (u = v), v < a && (a = v);
    }
    if (a -= c, u -= c, a > u) {
      const y = a;
      a = u, u = y;
    }
    o[0] = u, o[1] = a;
  }
}
const Qo = [], Ko = [];
new f();
const Up = new f(), Hp = new f();
class xo extends j {
  /**
   * The half extents of the box.
   */
  /**
   * Used by the contact generator to make contacts with other convex polyhedra for example.
   */
  constructor(e) {
    super({
      type: j.types.BOX
    }), this.halfExtents = e, this.convexPolyhedronRepresentation = null, this.updateConvexPolyhedronRepresentation(), this.updateBoundingSphereRadius();
  }
  /**
   * Updates the local convex polyhedron representation used for some collisions.
   */
  updateConvexPolyhedronRepresentation() {
    const e = this.halfExtents.x, n = this.halfExtents.y, r = this.halfExtents.z, i = f, o = [new i(-e, -n, -r), new i(e, -n, -r), new i(e, n, -r), new i(-e, n, -r), new i(-e, -n, r), new i(e, -n, r), new i(e, n, r), new i(-e, n, r)], s = [
      [3, 2, 1, 0],
      // -z
      [4, 5, 6, 7],
      // +z
      [5, 4, 0, 1],
      // -y
      [2, 3, 7, 6],
      // +y
      [0, 4, 7, 3],
      // -x
      [1, 2, 6, 5]
      // +x
    ], l = [new i(0, 0, 1), new i(0, 1, 0), new i(1, 0, 0)], u = new Er({
      vertices: o,
      faces: s,
      axes: l
    });
    this.convexPolyhedronRepresentation = u, u.material = this.material;
  }
  /**
   * Calculate the inertia of the box.
   */
  calculateLocalInertia(e, n) {
    return n === void 0 && (n = new f()), xo.calculateInertia(this.halfExtents, e, n), n;
  }
  static calculateInertia(e, n, r) {
    const i = e;
    r.x = 1 / 12 * n * (2 * i.y * 2 * i.y + 2 * i.z * 2 * i.z), r.y = 1 / 12 * n * (2 * i.x * 2 * i.x + 2 * i.z * 2 * i.z), r.z = 1 / 12 * n * (2 * i.y * 2 * i.y + 2 * i.x * 2 * i.x);
  }
  /**
   * Get the box 6 side normals
   * @param sixTargetVectors An array of 6 vectors, to store the resulting side normals in.
   * @param quat Orientation to apply to the normal vectors. If not provided, the vectors will be in respect to the local frame.
   */
  getSideNormals(e, n) {
    const r = e, i = this.halfExtents;
    if (r[0].set(i.x, 0, 0), r[1].set(0, i.y, 0), r[2].set(0, 0, i.z), r[3].set(-i.x, 0, 0), r[4].set(0, -i.y, 0), r[5].set(0, 0, -i.z), n !== void 0)
      for (let o = 0; o !== r.length; o++)
        n.vmult(r[o], r[o]);
    return r;
  }
  /**
   * Returns the volume of the box.
   */
  volume() {
    return 8 * this.halfExtents.x * this.halfExtents.y * this.halfExtents.z;
  }
  /**
   * updateBoundingSphereRadius
   */
  updateBoundingSphereRadius() {
    this.boundingSphereRadius = this.halfExtents.length();
  }
  /**
   * forEachWorldCorner
   */
  forEachWorldCorner(e, n, r) {
    const i = this.halfExtents, o = [[i.x, i.y, i.z], [-i.x, i.y, i.z], [-i.x, -i.y, i.z], [-i.x, -i.y, -i.z], [i.x, -i.y, -i.z], [i.x, i.y, -i.z], [-i.x, i.y, -i.z], [i.x, -i.y, i.z]];
    for (let s = 0; s < o.length; s++)
      Lt.set(o[s][0], o[s][1], o[s][2]), n.vmult(Lt, Lt), e.vadd(Lt, Lt), r(Lt.x, Lt.y, Lt.z);
  }
  /**
   * calculateWorldAABB
   */
  calculateWorldAABB(e, n, r, i) {
    const o = this.halfExtents;
    ut[0].set(o.x, o.y, o.z), ut[1].set(-o.x, o.y, o.z), ut[2].set(-o.x, -o.y, o.z), ut[3].set(-o.x, -o.y, -o.z), ut[4].set(o.x, -o.y, -o.z), ut[5].set(o.x, o.y, -o.z), ut[6].set(-o.x, o.y, -o.z), ut[7].set(o.x, -o.y, o.z);
    const s = ut[0];
    n.vmult(s, s), e.vadd(s, s), i.copy(s), r.copy(s);
    for (let l = 1; l < 8; l++) {
      const u = ut[l];
      n.vmult(u, u), e.vadd(u, u);
      const a = u.x, h = u.y, p = u.z;
      a > i.x && (i.x = a), h > i.y && (i.y = h), p > i.z && (i.z = p), a < r.x && (r.x = a), h < r.y && (r.y = h), p < r.z && (r.z = p);
    }
  }
}
const Lt = new f(), ut = [new f(), new f(), new f(), new f(), new f(), new f(), new f(), new f()], Hl = {
  /** DYNAMIC */
  DYNAMIC: 1,
  /** STATIC */
  STATIC: 2,
  /** KINEMATIC */
  KINEMATIC: 4
}, $l = {
  /** AWAKE */
  AWAKE: 0,
  /** SLEEPY */
  SLEEPY: 1,
  /** SLEEPING */
  SLEEPING: 2
};
class I extends Dd {
  /**
   * Dispatched after two bodies collide. This event is dispatched on each
   * of the two bodies involved in the collision.
   * @event collide
   * @param body The body that was involved in the collision.
   * @param contact The details of the collision.
   */
  /**
   * A dynamic body is fully simulated. Can be moved manually by the user, but normally they move according to forces. A dynamic body can collide with all body types. A dynamic body always has finite, non-zero mass.
   */
  /**
   * A static body does not move during simulation and behaves as if it has infinite mass. Static bodies can be moved manually by setting the position of the body. The velocity of a static body is always zero. Static bodies do not collide with other static or kinematic bodies.
   */
  /**
   * A kinematic body moves under simulation according to its velocity. They do not respond to forces. They can be moved manually, but normally a kinematic body is moved by setting its velocity. A kinematic body behaves as if it has infinite mass. Kinematic bodies do not collide with other static or kinematic bodies.
   */
  /**
   * AWAKE
   */
  /**
   * SLEEPY
   */
  /**
   * SLEEPING
   */
  /**
   * Dispatched after a sleeping body has woken up.
   * @event wakeup
   */
  /**
   * Dispatched after a body has gone in to the sleepy state.
   * @event sleepy
   */
  /**
   * Dispatched after a body has fallen asleep.
   * @event sleep
   */
  constructor(e) {
    e === void 0 && (e = {}), super(), this.id = I.idCounter++, this.index = -1, this.world = null, this.vlambda = new f(), this.collisionFilterGroup = typeof e.collisionFilterGroup == "number" ? e.collisionFilterGroup : 1, this.collisionFilterMask = typeof e.collisionFilterMask == "number" ? e.collisionFilterMask : -1, this.collisionResponse = typeof e.collisionResponse == "boolean" ? e.collisionResponse : !0, this.position = new f(), this.previousPosition = new f(), this.interpolatedPosition = new f(), this.initPosition = new f(), e.position && (this.position.copy(e.position), this.previousPosition.copy(e.position), this.interpolatedPosition.copy(e.position), this.initPosition.copy(e.position)), this.velocity = new f(), e.velocity && this.velocity.copy(e.velocity), this.initVelocity = new f(), this.force = new f();
    const n = typeof e.mass == "number" ? e.mass : 0;
    this.mass = n, this.invMass = n > 0 ? 1 / n : 0, this.material = e.material || null, this.linearDamping = typeof e.linearDamping == "number" ? e.linearDamping : 0.01, this.type = n <= 0 ? I.STATIC : I.DYNAMIC, typeof e.type == typeof I.STATIC && (this.type = e.type), this.allowSleep = typeof e.allowSleep < "u" ? e.allowSleep : !0, this.sleepState = I.AWAKE, this.sleepSpeedLimit = typeof e.sleepSpeedLimit < "u" ? e.sleepSpeedLimit : 0.1, this.sleepTimeLimit = typeof e.sleepTimeLimit < "u" ? e.sleepTimeLimit : 1, this.timeLastSleepy = 0, this.wakeUpAfterNarrowphase = !1, this.torque = new f(), this.quaternion = new ue(), this.initQuaternion = new ue(), this.previousQuaternion = new ue(), this.interpolatedQuaternion = new ue(), e.quaternion && (this.quaternion.copy(e.quaternion), this.initQuaternion.copy(e.quaternion), this.previousQuaternion.copy(e.quaternion), this.interpolatedQuaternion.copy(e.quaternion)), this.angularVelocity = new f(), e.angularVelocity && this.angularVelocity.copy(e.angularVelocity), this.initAngularVelocity = new f(), this.shapes = [], this.shapeOffsets = [], this.shapeOrientations = [], this.inertia = new f(), this.invInertia = new f(), this.invInertiaWorld = new tt(), this.invMassSolve = 0, this.invInertiaSolve = new f(), this.invInertiaWorldSolve = new tt(), this.fixedRotation = typeof e.fixedRotation < "u" ? e.fixedRotation : !1, this.angularDamping = typeof e.angularDamping < "u" ? e.angularDamping : 0.01, this.linearFactor = new f(1, 1, 1), e.linearFactor && this.linearFactor.copy(e.linearFactor), this.angularFactor = new f(1, 1, 1), e.angularFactor && this.angularFactor.copy(e.angularFactor), this.aabb = new qe(), this.aabbNeedsUpdate = !0, this.boundingRadius = 0, this.wlambda = new f(), this.isTrigger = !!e.isTrigger, e.shape && this.addShape(e.shape), this.updateMassProperties();
  }
  /**
   * Wake the body up.
   */
  wakeUp() {
    const e = this.sleepState;
    this.sleepState = I.AWAKE, this.wakeUpAfterNarrowphase = !1, e === I.SLEEPING && this.dispatchEvent(I.wakeupEvent);
  }
  /**
   * Force body sleep
   */
  sleep() {
    this.sleepState = I.SLEEPING, this.velocity.set(0, 0, 0), this.angularVelocity.set(0, 0, 0), this.wakeUpAfterNarrowphase = !1;
  }
  /**
   * Called every timestep to update internal sleep timer and change sleep state if needed.
   * @param time The world time in seconds
   */
  sleepTick(e) {
    if (this.allowSleep) {
      const n = this.sleepState, r = this.velocity.lengthSquared() + this.angularVelocity.lengthSquared(), i = this.sleepSpeedLimit ** 2;
      n === I.AWAKE && r < i ? (this.sleepState = I.SLEEPY, this.timeLastSleepy = e, this.dispatchEvent(I.sleepyEvent)) : n === I.SLEEPY && r > i ? this.wakeUp() : n === I.SLEEPY && e - this.timeLastSleepy > this.sleepTimeLimit && (this.sleep(), this.dispatchEvent(I.sleepEvent));
    }
  }
  /**
   * If the body is sleeping, it should be immovable / have infinite mass during solve. We solve it by having a separate "solve mass".
   */
  updateSolveMassProperties() {
    this.sleepState === I.SLEEPING || this.type === I.KINEMATIC ? (this.invMassSolve = 0, this.invInertiaSolve.setZero(), this.invInertiaWorldSolve.setZero()) : (this.invMassSolve = this.invMass, this.invInertiaSolve.copy(this.invInertia), this.invInertiaWorldSolve.copy(this.invInertiaWorld));
  }
  /**
   * Convert a world point to local body frame.
   */
  pointToLocalFrame(e, n) {
    return n === void 0 && (n = new f()), e.vsub(this.position, n), this.quaternion.conjugate().vmult(n, n), n;
  }
  /**
   * Convert a world vector to local body frame.
   */
  vectorToLocalFrame(e, n) {
    return n === void 0 && (n = new f()), this.quaternion.conjugate().vmult(e, n), n;
  }
  /**
   * Convert a local body point to world frame.
   */
  pointToWorldFrame(e, n) {
    return n === void 0 && (n = new f()), this.quaternion.vmult(e, n), n.vadd(this.position, n), n;
  }
  /**
   * Convert a local body point to world frame.
   */
  vectorToWorldFrame(e, n) {
    return n === void 0 && (n = new f()), this.quaternion.vmult(e, n), n;
  }
  /**
   * Add a shape to the body with a local offset and orientation.
   * @return The body object, for chainability.
   */
  addShape(e, n, r) {
    const i = new f(), o = new ue();
    return n && i.copy(n), r && o.copy(r), this.shapes.push(e), this.shapeOffsets.push(i), this.shapeOrientations.push(o), this.updateMassProperties(), this.updateBoundingRadius(), this.aabbNeedsUpdate = !0, e.body = this, this;
  }
  /**
   * Remove a shape from the body.
   * @return The body object, for chainability.
   */
  removeShape(e) {
    const n = this.shapes.indexOf(e);
    return n === -1 ? (console.warn("Shape does not belong to the body"), this) : (this.shapes.splice(n, 1), this.shapeOffsets.splice(n, 1), this.shapeOrientations.splice(n, 1), this.updateMassProperties(), this.updateBoundingRadius(), this.aabbNeedsUpdate = !0, e.body = null, this);
  }
  /**
   * Update the bounding radius of the body. Should be done if any of the shapes are changed.
   */
  updateBoundingRadius() {
    const e = this.shapes, n = this.shapeOffsets, r = e.length;
    let i = 0;
    for (let o = 0; o !== r; o++) {
      const s = e[o];
      s.updateBoundingSphereRadius();
      const l = n[o].length(), u = s.boundingSphereRadius;
      l + u > i && (i = l + u);
    }
    this.boundingRadius = i;
  }
  /**
   * Updates the .aabb
   */
  updateAABB() {
    const e = this.shapes, n = this.shapeOffsets, r = this.shapeOrientations, i = e.length, o = $p, s = Gp, l = this.quaternion, u = this.aabb, a = Yp;
    for (let h = 0; h !== i; h++) {
      const p = e[h];
      l.vmult(n[h], o), o.vadd(this.position, o), l.mult(r[h], s), p.calculateWorldAABB(o, s, a.lowerBound, a.upperBound), h === 0 ? u.copy(a) : u.extend(a);
    }
    this.aabbNeedsUpdate = !1;
  }
  /**
   * Update `.inertiaWorld` and `.invInertiaWorld`
   */
  updateInertiaWorld(e) {
    const n = this.invInertia;
    if (!(n.x === n.y && n.y === n.z && !e)) {
      const r = Xp, i = Qp;
      r.setRotationFromQuaternion(this.quaternion), r.transpose(i), r.scale(n, r), r.mmult(i, this.invInertiaWorld);
    }
  }
  /**
   * Apply force to a point of the body. This could for example be a point on the Body surface.
   * Applying force this way will add to Body.force and Body.torque.
   * @param force The amount of force to add.
   * @param relativePoint A point relative to the center of mass to apply the force on.
   */
  applyForce(e, n) {
    if (n === void 0 && (n = new f()), this.type !== I.DYNAMIC)
      return;
    this.sleepState === I.SLEEPING && this.wakeUp();
    const r = Kp;
    n.cross(e, r), this.force.vadd(e, this.force), this.torque.vadd(r, this.torque);
  }
  /**
   * Apply force to a local point in the body.
   * @param force The force vector to apply, defined locally in the body frame.
   * @param localPoint A local point in the body to apply the force on.
   */
  applyLocalForce(e, n) {
    if (n === void 0 && (n = new f()), this.type !== I.DYNAMIC)
      return;
    const r = Zp, i = Jp;
    this.vectorToWorldFrame(e, r), this.vectorToWorldFrame(n, i), this.applyForce(r, i);
  }
  /**
   * Apply torque to the body.
   * @param torque The amount of torque to add.
   */
  applyTorque(e) {
    this.type === I.DYNAMIC && (this.sleepState === I.SLEEPING && this.wakeUp(), this.torque.vadd(e, this.torque));
  }
  /**
   * Apply impulse to a point of the body. This could for example be a point on the Body surface.
   * An impulse is a force added to a body during a short period of time (impulse = force * time).
   * Impulses will be added to Body.velocity and Body.angularVelocity.
   * @param impulse The amount of impulse to add.
   * @param relativePoint A point relative to the center of mass to apply the force on.
   */
  applyImpulse(e, n) {
    if (n === void 0 && (n = new f()), this.type !== I.DYNAMIC)
      return;
    this.sleepState === I.SLEEPING && this.wakeUp();
    const r = n, i = bp;
    i.copy(e), i.scale(this.invMass, i), this.velocity.vadd(i, this.velocity);
    const o = em;
    r.cross(e, o), this.invInertiaWorld.vmult(o, o), this.angularVelocity.vadd(o, this.angularVelocity);
  }
  /**
   * Apply locally-defined impulse to a local point in the body.
   * @param force The force vector to apply, defined locally in the body frame.
   * @param localPoint A local point in the body to apply the force on.
   */
  applyLocalImpulse(e, n) {
    if (n === void 0 && (n = new f()), this.type !== I.DYNAMIC)
      return;
    const r = tm, i = nm;
    this.vectorToWorldFrame(e, r), this.vectorToWorldFrame(n, i), this.applyImpulse(r, i);
  }
  /**
   * Should be called whenever you change the body shape or mass.
   */
  updateMassProperties() {
    const e = rm;
    this.invMass = this.mass > 0 ? 1 / this.mass : 0;
    const n = this.inertia, r = this.fixedRotation;
    this.updateAABB(), e.set((this.aabb.upperBound.x - this.aabb.lowerBound.x) / 2, (this.aabb.upperBound.y - this.aabb.lowerBound.y) / 2, (this.aabb.upperBound.z - this.aabb.lowerBound.z) / 2), xo.calculateInertia(e, this.mass, n), this.invInertia.set(n.x > 0 && !r ? 1 / n.x : 0, n.y > 0 && !r ? 1 / n.y : 0, n.z > 0 && !r ? 1 / n.z : 0), this.updateInertiaWorld(!0);
  }
  /**
   * Get world velocity of a point in the body.
   * @param worldPoint
   * @param result
   * @return The result vector.
   */
  getVelocityAtWorldPoint(e, n) {
    const r = new f();
    return e.vsub(this.position, r), this.angularVelocity.cross(r, n), this.velocity.vadd(n, n), n;
  }
  /**
   * Move the body forward in time.
   * @param dt Time step
   * @param quatNormalize Set to true to normalize the body quaternion
   * @param quatNormalizeFast If the quaternion should be normalized using "fast" quaternion normalization
   */
  integrate(e, n, r) {
    if (this.previousPosition.copy(this.position), this.previousQuaternion.copy(this.quaternion), !(this.type === I.DYNAMIC || this.type === I.KINEMATIC) || this.sleepState === I.SLEEPING)
      return;
    const i = this.velocity, o = this.angularVelocity, s = this.position, l = this.force, u = this.torque, a = this.quaternion, h = this.invMass, p = this.invInertiaWorld, c = this.linearFactor, y = h * e;
    i.x += l.x * y * c.x, i.y += l.y * y * c.y, i.z += l.z * y * c.z;
    const v = p.elements, w = this.angularFactor, S = u.x * w.x, m = u.y * w.y, d = u.z * w.z;
    o.x += e * (v[0] * S + v[1] * m + v[2] * d), o.y += e * (v[3] * S + v[4] * m + v[5] * d), o.z += e * (v[6] * S + v[7] * m + v[8] * d), s.x += i.x * e, s.y += i.y * e, s.z += i.z * e, a.integrate(this.angularVelocity, e, this.angularFactor, a), n && (r ? a.normalizeFast() : a.normalize()), this.aabbNeedsUpdate = !0, this.updateInertiaWorld();
  }
}
I.idCounter = 0;
I.COLLIDE_EVENT_NAME = "collide";
I.DYNAMIC = Hl.DYNAMIC;
I.STATIC = Hl.STATIC;
I.KINEMATIC = Hl.KINEMATIC;
I.AWAKE = $l.AWAKE;
I.SLEEPY = $l.SLEEPY;
I.SLEEPING = $l.SLEEPING;
I.wakeupEvent = {
  type: "wakeup"
};
I.sleepyEvent = {
  type: "sleepy"
};
I.sleepEvent = {
  type: "sleep"
};
const $p = new f(), Gp = new ue(), Yp = new qe(), Xp = new tt(), Qp = new tt();
new tt();
const Kp = new f(), Zp = new f(), Jp = new f(), bp = new f(), em = new f(), tm = new f(), nm = new f(), rm = new f();
class im {
  /**
   * The world to search for collisions in.
   */
  /**
   * If set to true, the broadphase uses bounding boxes for intersection tests, else it uses bounding spheres.
   */
  /**
   * Set to true if the objects in the world moved.
   */
  constructor() {
    this.world = null, this.useBoundingBoxes = !1, this.dirty = !0;
  }
  /**
   * Get the collision pairs from the world
   * @param world The world to search in
   * @param p1 Empty array to be filled with body objects
   * @param p2 Empty array to be filled with body objects
   */
  collisionPairs(e, n, r) {
    throw new Error("collisionPairs not implemented for this BroadPhase class!");
  }
  /**
   * Check if a body pair needs to be intersection tested at all.
   */
  needBroadphaseCollision(e, n) {
    return !(!(e.collisionFilterGroup & n.collisionFilterMask) || !(n.collisionFilterGroup & e.collisionFilterMask) || (e.type & I.STATIC || e.sleepState === I.SLEEPING) && (n.type & I.STATIC || n.sleepState === I.SLEEPING));
  }
  /**
   * Check if the bounding volumes of two bodies intersect.
   */
  intersectionTest(e, n, r, i) {
    this.useBoundingBoxes ? this.doBoundingBoxBroadphase(e, n, r, i) : this.doBoundingSphereBroadphase(e, n, r, i);
  }
  /**
   * Check if the bounding spheres of two bodies are intersecting.
   * @param pairs1 bodyA is appended to this array if intersection
   * @param pairs2 bodyB is appended to this array if intersection
   */
  doBoundingSphereBroadphase(e, n, r, i) {
    const o = om;
    n.position.vsub(e.position, o);
    const s = (e.boundingRadius + n.boundingRadius) ** 2;
    o.lengthSquared() < s && (r.push(e), i.push(n));
  }
  /**
   * Check if the bounding boxes of two bodies are intersecting.
   */
  doBoundingBoxBroadphase(e, n, r, i) {
    e.aabbNeedsUpdate && e.updateAABB(), n.aabbNeedsUpdate && n.updateAABB(), e.aabb.overlaps(n.aabb) && (r.push(e), i.push(n));
  }
  /**
   * Removes duplicate pairs from the pair arrays.
   */
  makePairsUnique(e, n) {
    const r = sm, i = lm, o = um, s = e.length;
    for (let l = 0; l !== s; l++)
      i[l] = e[l], o[l] = n[l];
    e.length = 0, n.length = 0;
    for (let l = 0; l !== s; l++) {
      const u = i[l].id, a = o[l].id, h = u < a ? `${u},${a}` : `${a},${u}`;
      r[h] = l, r.keys.push(h);
    }
    for (let l = 0; l !== r.keys.length; l++) {
      const u = r.keys.pop(), a = r[u];
      e.push(i[a]), n.push(o[a]), delete r[u];
    }
  }
  /**
   * To be implemented by subcasses
   */
  setWorld(e) {
  }
  /**
   * Check if the bounding spheres of two bodies overlap.
   */
  static boundingSphereCheck(e, n) {
    const r = new f();
    e.position.vsub(n.position, r);
    const i = e.shapes[0], o = n.shapes[0];
    return Math.pow(i.boundingSphereRadius + o.boundingSphereRadius, 2) > r.lengthSquared();
  }
  /**
   * Returns all the bodies within the AABB.
   */
  aabbQuery(e, n, r) {
    return console.warn(".aabbQuery is not implemented in this Broadphase subclass."), [];
  }
}
const om = new f();
new f();
new ue();
new f();
const sm = {
  keys: []
}, lm = [], um = [];
new f();
new f();
new f();
class Wd extends im {
  /**
   * @todo Remove useless constructor
   */
  constructor() {
    super();
  }
  /**
   * Get all the collision pairs in the physics world
   */
  collisionPairs(e, n, r) {
    const i = e.bodies, o = i.length;
    let s, l;
    for (let u = 0; u !== o; u++)
      for (let a = 0; a !== u; a++)
        s = i[u], l = i[a], this.needBroadphaseCollision(s, l) && this.intersectionTest(s, l, n, r);
  }
  /**
   * Returns all the bodies within an AABB.
   * @param result An array to store resulting bodies in.
   */
  aabbQuery(e, n, r) {
    r === void 0 && (r = []);
    for (let i = 0; i < e.bodies.length; i++) {
      const o = e.bodies[i];
      o.aabbNeedsUpdate && o.updateAABB(), o.aabb.overlaps(n) && r.push(o);
    }
    return r;
  }
}
class no {
  /**
   * rayFromWorld
   */
  /**
   * rayToWorld
   */
  /**
   * hitNormalWorld
   */
  /**
   * hitPointWorld
   */
  /**
   * hasHit
   */
  /**
   * shape
   */
  /**
   * body
   */
  /**
   * The index of the hit triangle, if the hit shape was a trimesh
   */
  /**
   * Distance to the hit. Will be set to -1 if there was no hit
   */
  /**
   * If the ray should stop traversing the bodies
   */
  constructor() {
    this.rayFromWorld = new f(), this.rayToWorld = new f(), this.hitNormalWorld = new f(), this.hitPointWorld = new f(), this.hasHit = !1, this.shape = null, this.body = null, this.hitFaceIndex = -1, this.distance = -1, this.shouldStop = !1;
  }
  /**
   * Reset all result data.
   */
  reset() {
    this.rayFromWorld.setZero(), this.rayToWorld.setZero(), this.hitNormalWorld.setZero(), this.hitPointWorld.setZero(), this.hasHit = !1, this.shape = null, this.body = null, this.hitFaceIndex = -1, this.distance = -1, this.shouldStop = !1;
  }
  /**
   * abort
   */
  abort() {
    this.shouldStop = !0;
  }
  /**
   * Set result data.
   */
  set(e, n, r, i, o, s, l) {
    this.rayFromWorld.copy(e), this.rayToWorld.copy(n), this.hitNormalWorld.copy(r), this.hitPointWorld.copy(i), this.shape = o, this.body = s, this.distance = l;
  }
}
let Vd, qd, Ud, Hd, $d, Gd, Yd;
const Gl = {
  /** CLOSEST */
  CLOSEST: 1,
  /** ANY */
  ANY: 2,
  /** ALL */
  ALL: 4
};
Vd = j.types.SPHERE;
qd = j.types.PLANE;
Ud = j.types.BOX;
Hd = j.types.CYLINDER;
$d = j.types.CONVEXPOLYHEDRON;
Gd = j.types.HEIGHTFIELD;
Yd = j.types.TRIMESH;
class le {
  /**
   * from
   */
  /**
   * to
   */
  /**
   * direction
   */
  /**
   * The precision of the ray. Used when checking parallelity etc.
   * @default 0.0001
   */
  /**
   * Set to `false` if you don't want the Ray to take `collisionResponse` flags into account on bodies and shapes.
   * @default true
   */
  /**
   * If set to `true`, the ray skips any hits with normal.dot(rayDirection) < 0.
   * @default false
   */
  /**
   * collisionFilterMask
   * @default -1
   */
  /**
   * collisionFilterGroup
   * @default -1
   */
  /**
   * The intersection mode. Should be Ray.ANY, Ray.ALL or Ray.CLOSEST.
   * @default RAY.ANY
   */
  /**
   * Current result object.
   */
  /**
   * Will be set to `true` during intersectWorld() if the ray hit anything.
   */
  /**
   * User-provided result callback. Will be used if mode is Ray.ALL.
   */
  /**
   * CLOSEST
   */
  /**
   * ANY
   */
  /**
   * ALL
   */
  get [Vd]() {
    return this._intersectSphere;
  }
  get [qd]() {
    return this._intersectPlane;
  }
  get [Ud]() {
    return this._intersectBox;
  }
  get [Hd]() {
    return this._intersectConvex;
  }
  get [$d]() {
    return this._intersectConvex;
  }
  get [Gd]() {
    return this._intersectHeightfield;
  }
  get [Yd]() {
    return this._intersectTrimesh;
  }
  constructor(e, n) {
    e === void 0 && (e = new f()), n === void 0 && (n = new f()), this.from = e.clone(), this.to = n.clone(), this.direction = new f(), this.precision = 1e-4, this.checkCollisionResponse = !0, this.skipBackfaces = !1, this.collisionFilterMask = -1, this.collisionFilterGroup = -1, this.mode = le.ANY, this.result = new no(), this.hasHit = !1, this.callback = (r) => {
    };
  }
  /**
   * Do itersection against all bodies in the given World.
   * @return True if the ray hit anything, otherwise false.
   */
  intersectWorld(e, n) {
    return this.mode = n.mode || le.ANY, this.result = n.result || new no(), this.skipBackfaces = !!n.skipBackfaces, this.collisionFilterMask = typeof n.collisionFilterMask < "u" ? n.collisionFilterMask : -1, this.collisionFilterGroup = typeof n.collisionFilterGroup < "u" ? n.collisionFilterGroup : -1, this.checkCollisionResponse = typeof n.checkCollisionResponse < "u" ? n.checkCollisionResponse : !0, n.from && this.from.copy(n.from), n.to && this.to.copy(n.to), this.callback = n.callback || (() => {
    }), this.hasHit = !1, this.result.reset(), this.updateDirection(), this.getAABB(da), Zo.length = 0, e.broadphase.aabbQuery(e, da, Zo), this.intersectBodies(Zo), this.hasHit;
  }
  /**
   * Shoot a ray at a body, get back information about the hit.
   * @deprecated @param result set the result property of the Ray instead.
   */
  intersectBody(e, n) {
    n && (this.result = n, this.updateDirection());
    const r = this.checkCollisionResponse;
    if (r && !e.collisionResponse || !(this.collisionFilterGroup & e.collisionFilterMask) || !(e.collisionFilterGroup & this.collisionFilterMask))
      return;
    const i = am, o = cm;
    for (let s = 0, l = e.shapes.length; s < l; s++) {
      const u = e.shapes[s];
      if (!(r && !u.collisionResponse) && (e.quaternion.mult(e.shapeOrientations[s], o), e.quaternion.vmult(e.shapeOffsets[s], i), i.vadd(e.position, i), this.intersectShape(u, o, i, e), this.result.shouldStop))
        break;
    }
  }
  /**
   * Shoot a ray at an array bodies, get back information about the hit.
   * @param bodies An array of Body objects.
   * @deprecated @param result set the result property of the Ray instead.
   *
   */
  intersectBodies(e, n) {
    n && (this.result = n, this.updateDirection());
    for (let r = 0, i = e.length; !this.result.shouldStop && r < i; r++)
      this.intersectBody(e[r]);
  }
  /**
   * Updates the direction vector.
   */
  updateDirection() {
    this.to.vsub(this.from, this.direction), this.direction.normalize();
  }
  intersectShape(e, n, r, i) {
    const o = this.from;
    if (Cm(o, this.direction, r) > e.boundingSphereRadius)
      return;
    const l = this[e.type];
    l && l.call(this, e, n, r, i, e);
  }
  _intersectBox(e, n, r, i, o) {
    return this._intersectConvex(e.convexPolyhedronRepresentation, n, r, i, o);
  }
  _intersectPlane(e, n, r, i, o) {
    const s = this.from, l = this.to, u = this.direction, a = new f(0, 0, 1);
    n.vmult(a, a);
    const h = new f();
    s.vsub(r, h);
    const p = h.dot(a);
    l.vsub(r, h);
    const c = h.dot(a);
    if (p * c > 0 || s.distanceTo(l) < p)
      return;
    const y = a.dot(u);
    if (Math.abs(y) < this.precision)
      return;
    const v = new f(), w = new f(), S = new f();
    s.vsub(r, v);
    const m = -a.dot(v) / y;
    u.scale(m, w), s.vadd(w, S), this.reportIntersection(a, S, o, i, -1);
  }
  /**
   * Get the world AABB of the ray.
   */
  getAABB(e) {
    const {
      lowerBound: n,
      upperBound: r
    } = e, i = this.to, o = this.from;
    n.x = Math.min(i.x, o.x), n.y = Math.min(i.y, o.y), n.z = Math.min(i.z, o.z), r.x = Math.max(i.x, o.x), r.y = Math.max(i.y, o.y), r.z = Math.max(i.z, o.z);
  }
  _intersectHeightfield(e, n, r, i, o) {
    e.data, e.elementSize;
    const s = dm;
    s.from.copy(this.from), s.to.copy(this.to), G.pointToLocalFrame(r, n, s.from, s.from), G.pointToLocalFrame(r, n, s.to, s.to), s.updateDirection();
    const l = fm;
    let u, a, h, p;
    u = a = 0, h = p = e.data.length - 1;
    const c = new qe();
    s.getAABB(c), e.getIndexOfPosition(c.lowerBound.x, c.lowerBound.y, l, !0), u = Math.max(u, l[0]), a = Math.max(a, l[1]), e.getIndexOfPosition(c.upperBound.x, c.upperBound.y, l, !0), h = Math.min(h, l[0] + 1), p = Math.min(p, l[1] + 1);
    for (let y = u; y < h; y++)
      for (let v = a; v < p; v++) {
        if (this.result.shouldStop)
          return;
        if (e.getAabbAtIndex(y, v, c), !!c.overlapsRay(s)) {
          if (e.getConvexTrianglePillar(y, v, !1), G.pointToWorldFrame(r, n, e.pillarOffset, mi), this._intersectConvex(e.pillarConvex, n, mi, i, o, fa), this.result.shouldStop)
            return;
          e.getConvexTrianglePillar(y, v, !0), G.pointToWorldFrame(r, n, e.pillarOffset, mi), this._intersectConvex(e.pillarConvex, n, mi, i, o, fa);
        }
      }
  }
  _intersectSphere(e, n, r, i, o) {
    const s = this.from, l = this.to, u = e.radius, a = (l.x - s.x) ** 2 + (l.y - s.y) ** 2 + (l.z - s.z) ** 2, h = 2 * ((l.x - s.x) * (s.x - r.x) + (l.y - s.y) * (s.y - r.y) + (l.z - s.z) * (s.z - r.z)), p = (s.x - r.x) ** 2 + (s.y - r.y) ** 2 + (s.z - r.z) ** 2 - u ** 2, c = h ** 2 - 4 * a * p, y = hm, v = pm;
    if (!(c < 0))
      if (c === 0)
        s.lerp(l, c, y), y.vsub(r, v), v.normalize(), this.reportIntersection(v, y, o, i, -1);
      else {
        const w = (-h - Math.sqrt(c)) / (2 * a), S = (-h + Math.sqrt(c)) / (2 * a);
        if (w >= 0 && w <= 1 && (s.lerp(l, w, y), y.vsub(r, v), v.normalize(), this.reportIntersection(v, y, o, i, -1)), this.result.shouldStop)
          return;
        S >= 0 && S <= 1 && (s.lerp(l, S, y), y.vsub(r, v), v.normalize(), this.reportIntersection(v, y, o, i, -1));
      }
  }
  _intersectConvex(e, n, r, i, o, s) {
    const l = mm, u = ha, a = s && s.faceList || null, h = e.faces, p = e.vertices, c = e.faceNormals, y = this.direction, v = this.from, w = this.to, S = v.distanceTo(w), m = a ? a.length : h.length, d = this.result;
    for (let g = 0; !d.shouldStop && g < m; g++) {
      const x = a ? a[g] : g, E = h[x], z = c[x], C = n, k = r;
      u.copy(p[E[0]]), C.vmult(u, u), u.vadd(k, u), u.vsub(v, u), C.vmult(z, l);
      const O = y.dot(l);
      if (Math.abs(O) < this.precision)
        continue;
      const M = l.dot(u) / O;
      if (!(M < 0)) {
        y.scale(M, Te), Te.vadd(v, Te), Ze.copy(p[E[0]]), C.vmult(Ze, Ze), k.vadd(Ze, Ze);
        for (let D = 1; !d.shouldStop && D < E.length - 1; D++) {
          at.copy(p[E[D]]), ct.copy(p[E[D + 1]]), C.vmult(at, at), C.vmult(ct, ct), k.vadd(at, at), k.vadd(ct, ct);
          const V = Te.distanceTo(v);
          !(le.pointInTriangle(Te, Ze, at, ct) || le.pointInTriangle(Te, at, Ze, ct)) || V > S || this.reportIntersection(l, Te, o, i, x);
        }
      }
    }
  }
  /**
   * @todo Optimize by transforming the world to local space first.
   * @todo Use Octree lookup
   */
  _intersectTrimesh(e, n, r, i, o, s) {
    const l = ym, u = Em, a = zm, h = ha, p = vm, c = gm, y = wm, v = Sm, w = xm, S = e.indices;
    e.vertices;
    const m = this.from, d = this.to, g = this.direction;
    a.position.copy(r), a.quaternion.copy(n), G.vectorToLocalFrame(r, n, g, p), G.pointToLocalFrame(r, n, m, c), G.pointToLocalFrame(r, n, d, y), y.x *= e.scale.x, y.y *= e.scale.y, y.z *= e.scale.z, c.x *= e.scale.x, c.y *= e.scale.y, c.z *= e.scale.z, y.vsub(c, p), p.normalize();
    const x = c.distanceSquared(y);
    e.tree.rayQuery(this, a, u);
    for (let E = 0, z = u.length; !this.result.shouldStop && E !== z; E++) {
      const C = u[E];
      e.getNormal(C, l), e.getVertex(S[C * 3], Ze), Ze.vsub(c, h);
      const k = p.dot(l), O = l.dot(h) / k;
      if (O < 0)
        continue;
      p.scale(O, Te), Te.vadd(c, Te), e.getVertex(S[C * 3 + 1], at), e.getVertex(S[C * 3 + 2], ct);
      const M = Te.distanceSquared(c);
      !(le.pointInTriangle(Te, at, Ze, ct) || le.pointInTriangle(Te, Ze, at, ct)) || M > x || (G.vectorToWorldFrame(n, l, w), G.pointToWorldFrame(r, n, Te, v), this.reportIntersection(w, v, o, i, C));
    }
    u.length = 0;
  }
  /**
   * @return True if the intersections should continue
   */
  reportIntersection(e, n, r, i, o) {
    const s = this.from, l = this.to, u = s.distanceTo(n), a = this.result;
    if (!(this.skipBackfaces && e.dot(this.direction) > 0))
      switch (a.hitFaceIndex = typeof o < "u" ? o : -1, this.mode) {
        case le.ALL:
          this.hasHit = !0, a.set(s, l, e, n, r, i, u), a.hasHit = !0, this.callback(a);
          break;
        case le.CLOSEST:
          (u < a.distance || !a.hasHit) && (this.hasHit = !0, a.hasHit = !0, a.set(s, l, e, n, r, i, u));
          break;
        case le.ANY:
          this.hasHit = !0, a.hasHit = !0, a.set(s, l, e, n, r, i, u), a.shouldStop = !0;
          break;
      }
  }
  /**
   * As per "Barycentric Technique" as named
   * {@link https://www.blackpawn.com/texts/pointinpoly/default.html here} but without the division
   */
  static pointInTriangle(e, n, r, i) {
    i.vsub(n, nn), r.vsub(n, or), e.vsub(n, Jo);
    const o = nn.dot(nn), s = nn.dot(or), l = nn.dot(Jo), u = or.dot(or), a = or.dot(Jo);
    let h, p;
    return (h = u * l - s * a) >= 0 && (p = o * a - s * l) >= 0 && h + p < o * u - s * s;
  }
}
le.CLOSEST = Gl.CLOSEST;
le.ANY = Gl.ANY;
le.ALL = Gl.ALL;
const da = new qe(), Zo = [], or = new f(), Jo = new f(), am = new f(), cm = new ue(), Te = new f(), Ze = new f(), at = new f(), ct = new f();
new f();
new no();
const fa = {
  faceList: [0]
}, mi = new f(), dm = new le(), fm = [], hm = new f(), pm = new f(), mm = new f();
new f();
new f();
const ha = new f(), ym = new f(), vm = new f(), gm = new f(), wm = new f(), xm = new f(), Sm = new f();
new qe();
const Em = [], zm = new G(), nn = new f(), yi = new f();
function Cm(t, e, n) {
  n.vsub(t, nn);
  const r = nn.dot(e);
  return e.scale(r, yi), yi.vadd(t, yi), n.distanceTo(yi);
}
class Xd {
  /**
   * Extend an options object with default values.
   * @param options The options object. May be falsy: in this case, a new object is created and returned.
   * @param defaults An object containing default values.
   * @return The modified options object.
   */
  static defaults(e, n) {
    e === void 0 && (e = {});
    for (let r in n)
      r in e || (e[r] = n[r]);
    return e;
  }
}
class Gr {
  /**
   * Equations to be solved in this constraint.
   */
  /**
   * Body A.
   */
  /**
   * Body B.
   */
  /**
   * Set to false if you don't want the bodies to collide when they are connected.
   */
  constructor(e, n, r) {
    r === void 0 && (r = {}), r = Xd.defaults(r, {
      collideConnected: !0,
      wakeUpBodies: !0
    }), this.equations = [], this.bodyA = e, this.bodyB = n, this.id = Gr.idCounter++, this.collideConnected = r.collideConnected, r.wakeUpBodies && (e && e.wakeUp(), n && n.wakeUp());
  }
  /**
   * Update all the equations with data.
   */
  update() {
    throw new Error("method update() not implmemented in this Constraint subclass!");
  }
  /**
   * Enables all equations in the constraint.
   */
  enable() {
    const e = this.equations;
    for (let n = 0; n < e.length; n++)
      e[n].enabled = !0;
  }
  /**
   * Disables all equations in the constraint.
   */
  disable() {
    const e = this.equations;
    for (let n = 0; n < e.length; n++)
      e[n].enabled = !1;
  }
}
Gr.idCounter = 0;
class pa {
  /**
   * spatial
   */
  /**
   * rotational
   */
  constructor() {
    this.spatial = new f(), this.rotational = new f();
  }
  /**
   * Multiply with other JacobianElement
   */
  multiplyElement(e) {
    return e.spatial.dot(this.spatial) + e.rotational.dot(this.rotational);
  }
  /**
   * Multiply with two vectors
   */
  multiplyVectors(e, n) {
    return e.dot(this.spatial) + n.dot(this.rotational);
  }
}
class Yr {
  /**
   * Minimum (read: negative max) force to be applied by the constraint.
   */
  /**
   * Maximum (read: positive max) force to be applied by the constraint.
   */
  /**
   * SPOOK parameter
   */
  /**
   * SPOOK parameter
   */
  /**
   * SPOOK parameter
   */
  /**
   * A number, proportional to the force added to the bodies.
   */
  constructor(e, n, r, i) {
    r === void 0 && (r = -1e6), i === void 0 && (i = 1e6), this.id = Yr.idCounter++, this.minForce = r, this.maxForce = i, this.bi = e, this.bj = n, this.a = 0, this.b = 0, this.eps = 0, this.jacobianElementA = new pa(), this.jacobianElementB = new pa(), this.enabled = !0, this.multiplier = 0, this.setSpookParams(1e7, 4, 1 / 60);
  }
  /**
   * Recalculates a, b, and eps.
   *
   * The Equation constructor sets typical SPOOK parameters as such:
   * * `stiffness` = 1e7
   * * `relaxation` = 4
   * * `timeStep`= 1 / 60, _note the hardcoded refresh rate._
   */
  setSpookParams(e, n, r) {
    const i = n, o = e, s = r;
    this.a = 4 / (s * (1 + 4 * i)), this.b = 4 * i / (1 + 4 * i), this.eps = 4 / (s * s * o * (1 + 4 * i));
  }
  /**
   * Computes the right hand side of the SPOOK equation
   */
  computeB(e, n, r) {
    const i = this.computeGW(), o = this.computeGq(), s = this.computeGiMf();
    return -o * e - i * n - s * r;
  }
  /**
   * Computes G*q, where q are the generalized body coordinates
   */
  computeGq() {
    const e = this.jacobianElementA, n = this.jacobianElementB, r = this.bi, i = this.bj, o = r.position, s = i.position;
    return e.spatial.dot(o) + n.spatial.dot(s);
  }
  /**
   * Computes G*W, where W are the body velocities
   */
  computeGW() {
    const e = this.jacobianElementA, n = this.jacobianElementB, r = this.bi, i = this.bj, o = r.velocity, s = i.velocity, l = r.angularVelocity, u = i.angularVelocity;
    return e.multiplyVectors(o, l) + n.multiplyVectors(s, u);
  }
  /**
   * Computes G*Wlambda, where W are the body velocities
   */
  computeGWlambda() {
    const e = this.jacobianElementA, n = this.jacobianElementB, r = this.bi, i = this.bj, o = r.vlambda, s = i.vlambda, l = r.wlambda, u = i.wlambda;
    return e.multiplyVectors(o, l) + n.multiplyVectors(s, u);
  }
  /**
   * Computes G*inv(M)*f, where M is the mass matrix with diagonal blocks for each body, and f are the forces on the bodies.
   */
  computeGiMf() {
    const e = this.jacobianElementA, n = this.jacobianElementB, r = this.bi, i = this.bj, o = r.force, s = r.torque, l = i.force, u = i.torque, a = r.invMassSolve, h = i.invMassSolve;
    return o.scale(a, ma), l.scale(h, ya), r.invInertiaWorldSolve.vmult(s, va), i.invInertiaWorldSolve.vmult(u, ga), e.multiplyVectors(ma, va) + n.multiplyVectors(ya, ga);
  }
  /**
   * Computes G*inv(M)*G'
   */
  computeGiMGt() {
    const e = this.jacobianElementA, n = this.jacobianElementB, r = this.bi, i = this.bj, o = r.invMassSolve, s = i.invMassSolve, l = r.invInertiaWorldSolve, u = i.invInertiaWorldSolve;
    let a = o + s;
    return l.vmult(e.rotational, vi), a += vi.dot(e.rotational), u.vmult(n.rotational, vi), a += vi.dot(n.rotational), a;
  }
  /**
   * Add constraint velocity to the bodies.
   */
  addToWlambda(e) {
    const n = this.jacobianElementA, r = this.jacobianElementB, i = this.bi, o = this.bj, s = km;
    i.vlambda.addScaledVector(i.invMassSolve * e, n.spatial, i.vlambda), o.vlambda.addScaledVector(o.invMassSolve * e, r.spatial, o.vlambda), i.invInertiaWorldSolve.vmult(n.rotational, s), i.wlambda.addScaledVector(e, s, i.wlambda), o.invInertiaWorldSolve.vmult(r.rotational, s), o.wlambda.addScaledVector(e, s, o.wlambda);
  }
  /**
   * Compute the denominator part of the SPOOK equation: C = G*inv(M)*G' + eps
   */
  computeC() {
    return this.computeGiMGt() + this.eps;
  }
}
Yr.idCounter = 0;
const ma = new f(), ya = new f(), va = new f(), ga = new f(), vi = new f(), km = new f();
class zr extends Yr {
  /**
   * "bounciness": u1 = -e*u0
   */
  /**
   * World-oriented vector that goes from the center of bi to the contact point.
   */
  /**
   * World-oriented vector that starts in body j position and goes to the contact point.
   */
  /**
   * Contact normal, pointing out of body i.
   */
  constructor(e, n, r) {
    r === void 0 && (r = 1e6), super(e, n, 0, r), this.restitution = 0, this.ri = new f(), this.rj = new f(), this.ni = new f();
  }
  computeB(e) {
    const n = this.a, r = this.b, i = this.bi, o = this.bj, s = this.ri, l = this.rj, u = _m, a = Nm, h = i.velocity, p = i.angularVelocity;
    i.force, i.torque;
    const c = o.velocity, y = o.angularVelocity;
    o.force, o.torque;
    const v = Pm, w = this.jacobianElementA, S = this.jacobianElementB, m = this.ni;
    s.cross(m, u), l.cross(m, a), m.negate(w.spatial), u.negate(w.rotational), S.spatial.copy(m), S.rotational.copy(a), v.copy(o.position), v.vadd(l, v), v.vsub(i.position, v), v.vsub(s, v);
    const d = m.dot(v), g = this.restitution + 1, x = g * c.dot(m) - g * h.dot(m) + y.dot(a) - p.dot(u), E = this.computeGiMf();
    return -d * n - x * r - e * E;
  }
  /**
   * Get the current relative velocity in the contact point.
   */
  getImpactVelocityAlongNormal() {
    const e = Tm, n = Mm, r = Rm, i = Lm, o = Bm;
    return this.bi.position.vadd(this.ri, r), this.bj.position.vadd(this.rj, i), this.bi.getVelocityAtWorldPoint(r, e), this.bj.getVelocityAtWorldPoint(i, n), e.vsub(n, o), this.ni.dot(o);
  }
}
const _m = new f(), Nm = new f(), Pm = new f(), Tm = new f(), Mm = new f(), Rm = new f(), Lm = new f(), Bm = new f();
class Fm extends Gr {
  /**
   * Pivot, defined locally in bodyA.
   */
  /**
   * Pivot, defined locally in bodyB.
   */
  /**
   * @param pivotA The point relative to the center of mass of bodyA which bodyA is constrained to.
   * @param bodyB Body that will be constrained in a similar way to the same point as bodyA. We will therefore get a link between bodyA and bodyB. If not specified, bodyA will be constrained to a static point.
   * @param pivotB The point relative to the center of mass of bodyB which bodyB is constrained to.
   * @param maxForce The maximum force that should be applied to constrain the bodies.
   */
  constructor(e, n, r, i, o) {
    n === void 0 && (n = new f()), i === void 0 && (i = new f()), o === void 0 && (o = 1e6), super(e, r), this.pivotA = n.clone(), this.pivotB = i.clone();
    const s = this.equationX = new zr(e, r), l = this.equationY = new zr(e, r), u = this.equationZ = new zr(e, r);
    this.equations.push(s, l, u), s.minForce = l.minForce = u.minForce = -o, s.maxForce = l.maxForce = u.maxForce = o, s.ni.set(1, 0, 0), l.ni.set(0, 1, 0), u.ni.set(0, 0, 1);
  }
  update() {
    const e = this.bodyA, n = this.bodyB, r = this.equationX, i = this.equationY, o = this.equationZ;
    e.quaternion.vmult(this.pivotA, r.ri), n.quaternion.vmult(this.pivotB, r.rj), i.ri.copy(r.ri), i.rj.copy(r.rj), o.ri.copy(r.ri), o.rj.copy(r.rj);
  }
}
new f();
new f();
new f();
new f();
new f();
new f();
class Am extends Gr {
  /**
   * The distance to keep. If undefined, it will be set to the current distance between bodyA and bodyB
   */
  /**
   * @param distance The distance to keep. If undefined, it will be set to the current distance between bodyA and bodyB.
   * @param maxForce The maximum force that should be applied to constrain the bodies.
   */
  constructor(e, n, r, i) {
    i === void 0 && (i = 1e6), super(e, n), typeof r > "u" && (r = e.position.distanceTo(n.position)), this.distance = r;
    const o = this.distanceEquation = new zr(e, n);
    this.equations.push(o), o.minForce = -i, o.maxForce = i;
  }
  /**
   * update
   */
  update() {
    const e = this.bodyA, n = this.bodyB, r = this.distanceEquation, i = this.distance * 0.5, o = r.ni;
    n.position.vsub(e.position, o), o.normalize(), o.scale(i, r.ri), o.scale(-i, r.rj);
  }
}
new f();
new f();
new f();
new f();
class wa extends Yr {
  // Tangent
  /**
   * @param slipForce should be +-F_friction = +-mu * F_normal = +-mu * m * g
   */
  constructor(e, n, r) {
    super(e, n, -r, r), this.ri = new f(), this.rj = new f(), this.t = new f();
  }
  computeB(e) {
    this.a;
    const n = this.b;
    this.bi, this.bj;
    const r = this.ri, i = this.rj, o = Im, s = Om, l = this.t;
    r.cross(l, o), i.cross(l, s);
    const u = this.jacobianElementA, a = this.jacobianElementB;
    l.negate(u.spatial), o.negate(u.rotational), a.spatial.copy(l), a.rotational.copy(s);
    const h = this.computeGW(), p = this.computeGiMf();
    return -h * n - e * p;
  }
}
const Im = new f(), Om = new f();
class So {
  /**
   * Identifier of this material.
   */
  /**
   * Participating materials.
   */
  /**
   * Friction coefficient.
   * @default 0.3
   */
  /**
   * Restitution coefficient.
   * @default 0.3
   */
  /**
   * Stiffness of the produced contact equations.
   * @default 1e7
   */
  /**
   * Relaxation time of the produced contact equations.
   * @default 3
   */
  /**
   * Stiffness of the produced friction equations.
   * @default 1e7
   */
  /**
   * Relaxation time of the produced friction equations
   * @default 3
   */
  constructor(e, n, r) {
    r = Xd.defaults(r, {
      friction: 0.3,
      restitution: 0.3,
      contactEquationStiffness: 1e7,
      contactEquationRelaxation: 3,
      frictionEquationStiffness: 1e7,
      frictionEquationRelaxation: 3
    }), this.id = So.idCounter++, this.materials = [e, n], this.friction = r.friction, this.restitution = r.restitution, this.contactEquationStiffness = r.contactEquationStiffness, this.contactEquationRelaxation = r.contactEquationRelaxation, this.frictionEquationStiffness = r.frictionEquationStiffness, this.frictionEquationRelaxation = r.frictionEquationRelaxation;
  }
}
So.idCounter = 0;
class Eo {
  /**
   * Material name.
   * If options is a string, name will be set to that string.
   * @todo Deprecate this
   */
  /** Material id. */
  /**
   * Friction for this material.
   * If non-negative, it will be used instead of the friction given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
   */
  /**
   * Restitution for this material.
   * If non-negative, it will be used instead of the restitution given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
   */
  constructor(e) {
    e === void 0 && (e = {});
    let n = "";
    typeof e == "string" && (n = e, e = {}), this.name = n, this.id = Eo.idCounter++, this.friction = typeof e.friction < "u" ? e.friction : -1, this.restitution = typeof e.restitution < "u" ? e.restitution : -1;
  }
}
Eo.idCounter = 0;
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new le();
new f();
new f();
new f();
new f(1, 0, 0), new f(0, 1, 0), new f(0, 0, 1);
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
class jm extends j {
  /** worldNormal */
  /** worldNormalNeedsUpdate */
  constructor() {
    super({
      type: j.types.PLANE
    }), this.worldNormal = new f(), this.worldNormalNeedsUpdate = !0, this.boundingSphereRadius = Number.MAX_VALUE;
  }
  /** computeWorldNormal */
  computeWorldNormal(e) {
    const n = this.worldNormal;
    n.set(0, 0, 1), e.vmult(n, n), this.worldNormalNeedsUpdate = !1;
  }
  calculateLocalInertia(e, n) {
    return n === void 0 && (n = new f()), n;
  }
  volume() {
    return (
      // The plane is infinite...
      Number.MAX_VALUE
    );
  }
  calculateWorldAABB(e, n, r, i) {
    mt.set(0, 0, 1), n.vmult(mt, mt);
    const o = Number.MAX_VALUE;
    r.set(-o, -o, -o), i.set(o, o, o), mt.x === 1 ? i.x = e.x : mt.x === -1 && (r.x = e.x), mt.y === 1 ? i.y = e.y : mt.y === -1 && (r.y = e.y), mt.z === 1 ? i.z = e.z : mt.z === -1 && (r.z = e.z);
  }
  updateBoundingSphereRadius() {
    this.boundingSphereRadius = Number.MAX_VALUE;
  }
}
const mt = new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new qe();
new f();
new qe();
new f();
new f();
new f();
new f();
new f();
new f();
new f();
new qe();
new f();
new G();
new qe();
class Dm {
  /**
   * All equations to be solved
   */
  /**
   * @todo remove useless constructor
   */
  constructor() {
    this.equations = [];
  }
  /**
   * Should be implemented in subclasses!
   * @todo use abstract
   * @return number of iterations performed
   */
  solve(e, n) {
    return (
      // Should return the number of iterations done!
      0
    );
  }
  /**
   * Add an equation
   */
  addEquation(e) {
    e.enabled && !e.bi.isTrigger && !e.bj.isTrigger && this.equations.push(e);
  }
  /**
   * Remove an equation
   */
  removeEquation(e) {
    const n = this.equations, r = n.indexOf(e);
    r !== -1 && n.splice(r, 1);
  }
  /**
   * Add all equations
   */
  removeAllEquations() {
    this.equations.length = 0;
  }
}
class Wm extends Dm {
  /**
   * The number of solver iterations determines quality of the constraints in the world.
   * The more iterations, the more correct simulation. More iterations need more computations though. If you have a large gravity force in your world, you will need more iterations.
   */
  /**
   * When tolerance is reached, the system is assumed to be converged.
   */
  /**
   * @todo remove useless constructor
   */
  constructor() {
    super(), this.iterations = 10, this.tolerance = 1e-7;
  }
  /**
   * Solve
   * @return number of iterations performed
   */
  solve(e, n) {
    let r = 0;
    const i = this.iterations, o = this.tolerance * this.tolerance, s = this.equations, l = s.length, u = n.bodies, a = u.length, h = e;
    let p, c, y, v, w, S;
    if (l !== 0)
      for (let x = 0; x !== a; x++)
        u[x].updateSolveMassProperties();
    const m = qm, d = Um, g = Vm;
    m.length = l, d.length = l, g.length = l;
    for (let x = 0; x !== l; x++) {
      const E = s[x];
      g[x] = 0, d[x] = E.computeB(h), m[x] = 1 / E.computeC();
    }
    if (l !== 0) {
      for (let z = 0; z !== a; z++) {
        const C = u[z], k = C.vlambda, O = C.wlambda;
        k.set(0, 0, 0), O.set(0, 0, 0);
      }
      for (r = 0; r !== i; r++) {
        v = 0;
        for (let z = 0; z !== l; z++) {
          const C = s[z];
          p = d[z], c = m[z], S = g[z], w = C.computeGWlambda(), y = c * (p - w - C.eps * S), S + y < C.minForce ? y = C.minForce - S : S + y > C.maxForce && (y = C.maxForce - S), g[z] += y, v += y > 0 ? y : -y, C.addToWlambda(y);
        }
        if (v * v < o)
          break;
      }
      for (let z = 0; z !== a; z++) {
        const C = u[z], k = C.velocity, O = C.angularVelocity;
        C.vlambda.vmul(C.linearFactor, C.vlambda), k.vadd(C.vlambda, k), C.wlambda.vmul(C.angularFactor, C.wlambda), O.vadd(C.wlambda, O);
      }
      let x = s.length;
      const E = 1 / h;
      for (; x--; )
        s[x].multiplier = g[x] * E;
    }
    return r;
  }
}
const Vm = [], qm = [], Um = [];
class Hm {
  constructor() {
    this.objects = [], this.type = Object;
  }
  /**
   * Release an object after use
   */
  release() {
    const e = arguments.length;
    for (let n = 0; n !== e; n++)
      this.objects.push(n < 0 || arguments.length <= n ? void 0 : arguments[n]);
    return this;
  }
  /**
   * Get an object
   */
  get() {
    return this.objects.length === 0 ? this.constructObject() : this.objects.pop();
  }
  /**
   * Construct an object. Should be implemented in each subclass.
   */
  constructObject() {
    throw new Error("constructObject() not implemented in this Pool subclass yet!");
  }
  /**
   * @return Self, for chaining
   */
  resize(e) {
    const n = this.objects;
    for (; n.length > e; )
      n.pop();
    for (; n.length < e; )
      n.push(this.constructObject());
    return this;
  }
}
class $m extends Hm {
  constructor() {
    super(...arguments), this.type = f;
  }
  /**
   * Construct a vector
   */
  constructObject() {
    return new f();
  }
}
const K = {
  sphereSphere: j.types.SPHERE,
  spherePlane: j.types.SPHERE | j.types.PLANE,
  boxBox: j.types.BOX | j.types.BOX,
  sphereBox: j.types.SPHERE | j.types.BOX,
  planeBox: j.types.PLANE | j.types.BOX,
  convexConvex: j.types.CONVEXPOLYHEDRON,
  sphereConvex: j.types.SPHERE | j.types.CONVEXPOLYHEDRON,
  planeConvex: j.types.PLANE | j.types.CONVEXPOLYHEDRON,
  boxConvex: j.types.BOX | j.types.CONVEXPOLYHEDRON,
  sphereHeightfield: j.types.SPHERE | j.types.HEIGHTFIELD,
  boxHeightfield: j.types.BOX | j.types.HEIGHTFIELD,
  convexHeightfield: j.types.CONVEXPOLYHEDRON | j.types.HEIGHTFIELD,
  sphereParticle: j.types.PARTICLE | j.types.SPHERE,
  planeParticle: j.types.PLANE | j.types.PARTICLE,
  boxParticle: j.types.BOX | j.types.PARTICLE,
  convexParticle: j.types.PARTICLE | j.types.CONVEXPOLYHEDRON,
  cylinderCylinder: j.types.CYLINDER,
  sphereCylinder: j.types.SPHERE | j.types.CYLINDER,
  planeCylinder: j.types.PLANE | j.types.CYLINDER,
  boxCylinder: j.types.BOX | j.types.CYLINDER,
  convexCylinder: j.types.CONVEXPOLYHEDRON | j.types.CYLINDER,
  heightfieldCylinder: j.types.HEIGHTFIELD | j.types.CYLINDER,
  particleCylinder: j.types.PARTICLE | j.types.CYLINDER,
  sphereTrimesh: j.types.SPHERE | j.types.TRIMESH,
  planeTrimesh: j.types.PLANE | j.types.TRIMESH
};
class Gm {
  /**
   * Internal storage of pooled contact points.
   */
  /**
   * Pooled vectors.
   */
  get [K.sphereSphere]() {
    return this.sphereSphere;
  }
  get [K.spherePlane]() {
    return this.spherePlane;
  }
  get [K.boxBox]() {
    return this.boxBox;
  }
  get [K.sphereBox]() {
    return this.sphereBox;
  }
  get [K.planeBox]() {
    return this.planeBox;
  }
  get [K.convexConvex]() {
    return this.convexConvex;
  }
  get [K.sphereConvex]() {
    return this.sphereConvex;
  }
  get [K.planeConvex]() {
    return this.planeConvex;
  }
  get [K.boxConvex]() {
    return this.boxConvex;
  }
  get [K.sphereHeightfield]() {
    return this.sphereHeightfield;
  }
  get [K.boxHeightfield]() {
    return this.boxHeightfield;
  }
  get [K.convexHeightfield]() {
    return this.convexHeightfield;
  }
  get [K.sphereParticle]() {
    return this.sphereParticle;
  }
  get [K.planeParticle]() {
    return this.planeParticle;
  }
  get [K.boxParticle]() {
    return this.boxParticle;
  }
  get [K.convexParticle]() {
    return this.convexParticle;
  }
  get [K.cylinderCylinder]() {
    return this.convexConvex;
  }
  get [K.sphereCylinder]() {
    return this.sphereConvex;
  }
  get [K.planeCylinder]() {
    return this.planeConvex;
  }
  get [K.boxCylinder]() {
    return this.boxConvex;
  }
  get [K.convexCylinder]() {
    return this.convexConvex;
  }
  get [K.heightfieldCylinder]() {
    return this.heightfieldCylinder;
  }
  get [K.particleCylinder]() {
    return this.particleCylinder;
  }
  get [K.sphereTrimesh]() {
    return this.sphereTrimesh;
  }
  get [K.planeTrimesh]() {
    return this.planeTrimesh;
  }
  // get [COLLISION_TYPES.convexTrimesh]() {
  //   return this.convexTrimesh
  // }
  constructor(e) {
    this.contactPointPool = [], this.frictionEquationPool = [], this.result = [], this.frictionResult = [], this.v3pool = new $m(), this.world = e, this.currentContactMaterial = e.defaultContactMaterial, this.enableFrictionReduction = !1;
  }
  /**
   * Make a contact object, by using the internal pool or creating a new one.
   */
  createContactEquation(e, n, r, i, o, s) {
    let l;
    this.contactPointPool.length ? (l = this.contactPointPool.pop(), l.bi = e, l.bj = n) : l = new zr(e, n), l.enabled = e.collisionResponse && n.collisionResponse && r.collisionResponse && i.collisionResponse;
    const u = this.currentContactMaterial;
    l.restitution = u.restitution, l.setSpookParams(u.contactEquationStiffness, u.contactEquationRelaxation, this.world.dt);
    const a = r.material || e.material, h = i.material || n.material;
    return a && h && a.restitution >= 0 && h.restitution >= 0 && (l.restitution = a.restitution * h.restitution), l.si = o || r, l.sj = s || i, l;
  }
  createFrictionEquationsFromContact(e, n) {
    const r = e.bi, i = e.bj, o = e.si, s = e.sj, l = this.world, u = this.currentContactMaterial;
    let a = u.friction;
    const h = o.material || r.material, p = s.material || i.material;
    if (h && p && h.friction >= 0 && p.friction >= 0 && (a = h.friction * p.friction), a > 0) {
      const c = a * (l.frictionGravity || l.gravity).length();
      let y = r.invMass + i.invMass;
      y > 0 && (y = 1 / y);
      const v = this.frictionEquationPool, w = v.length ? v.pop() : new wa(r, i, c * y), S = v.length ? v.pop() : new wa(r, i, c * y);
      return w.bi = S.bi = r, w.bj = S.bj = i, w.minForce = S.minForce = -c * y, w.maxForce = S.maxForce = c * y, w.ri.copy(e.ri), w.rj.copy(e.rj), S.ri.copy(e.ri), S.rj.copy(e.rj), e.ni.tangents(w.t, S.t), w.setSpookParams(u.frictionEquationStiffness, u.frictionEquationRelaxation, l.dt), S.setSpookParams(u.frictionEquationStiffness, u.frictionEquationRelaxation, l.dt), w.enabled = S.enabled = e.enabled, n.push(w, S), !0;
    }
    return !1;
  }
  /**
   * Take the average N latest contact point on the plane.
   */
  createFrictionFromAverage(e) {
    let n = this.result[this.result.length - 1];
    if (!this.createFrictionEquationsFromContact(n, this.frictionResult) || e === 1)
      return;
    const r = this.frictionResult[this.frictionResult.length - 2], i = this.frictionResult[this.frictionResult.length - 1];
    bt.setZero(), gn.setZero(), wn.setZero();
    const o = n.bi;
    n.bj;
    for (let l = 0; l !== e; l++)
      n = this.result[this.result.length - 1 - l], n.bi !== o ? (bt.vadd(n.ni, bt), gn.vadd(n.ri, gn), wn.vadd(n.rj, wn)) : (bt.vsub(n.ni, bt), gn.vadd(n.rj, gn), wn.vadd(n.ri, wn));
    const s = 1 / e;
    gn.scale(s, r.ri), wn.scale(s, r.rj), i.ri.copy(r.ri), i.rj.copy(r.rj), bt.normalize(), bt.tangents(r.t, i.t);
  }
  /**
   * Generate all contacts between a list of body pairs
   * @param p1 Array of body indices
   * @param p2 Array of body indices
   * @param result Array to store generated contacts
   * @param oldcontacts Optional. Array of reusable contact objects
   */
  getContacts(e, n, r, i, o, s, l) {
    this.contactPointPool = o, this.frictionEquationPool = l, this.result = i, this.frictionResult = s;
    const u = Qm, a = Km, h = Ym, p = Xm;
    for (let c = 0, y = e.length; c !== y; c++) {
      const v = e[c], w = n[c];
      let S = null;
      v.material && w.material && (S = r.getContactMaterial(v.material, w.material) || null);
      const m = v.type & I.KINEMATIC && w.type & I.STATIC || v.type & I.STATIC && w.type & I.KINEMATIC || v.type & I.KINEMATIC && w.type & I.KINEMATIC;
      for (let d = 0; d < v.shapes.length; d++) {
        v.quaternion.mult(v.shapeOrientations[d], u), v.quaternion.vmult(v.shapeOffsets[d], h), h.vadd(v.position, h);
        const g = v.shapes[d];
        for (let x = 0; x < w.shapes.length; x++) {
          w.quaternion.mult(w.shapeOrientations[x], a), w.quaternion.vmult(w.shapeOffsets[x], p), p.vadd(w.position, p);
          const E = w.shapes[x];
          if (!(g.collisionFilterMask & E.collisionFilterGroup && E.collisionFilterMask & g.collisionFilterGroup) || h.distanceTo(p) > g.boundingSphereRadius + E.boundingSphereRadius)
            continue;
          let z = null;
          g.material && E.material && (z = r.getContactMaterial(g.material, E.material) || null), this.currentContactMaterial = z || S || r.defaultContactMaterial;
          const C = g.type | E.type, k = this[C];
          if (k) {
            let O = !1;
            g.type < E.type ? O = k.call(this, g, E, h, p, u, a, v, w, g, E, m) : O = k.call(this, E, g, p, h, a, u, w, v, g, E, m), O && m && (r.shapeOverlapKeeper.set(g.id, E.id), r.bodyOverlapKeeper.set(v.id, w.id));
          }
        }
      }
    }
  }
  sphereSphere(e, n, r, i, o, s, l, u, a, h, p) {
    if (p)
      return r.distanceSquared(i) < (e.radius + n.radius) ** 2;
    const c = this.createContactEquation(l, u, e, n, a, h);
    i.vsub(r, c.ni), c.ni.normalize(), c.ri.copy(c.ni), c.rj.copy(c.ni), c.ri.scale(e.radius, c.ri), c.rj.scale(-n.radius, c.rj), c.ri.vadd(r, c.ri), c.ri.vsub(l.position, c.ri), c.rj.vadd(i, c.rj), c.rj.vsub(u.position, c.rj), this.result.push(c), this.createFrictionEquationsFromContact(c, this.frictionResult);
  }
  spherePlane(e, n, r, i, o, s, l, u, a, h, p) {
    const c = this.createContactEquation(l, u, e, n, a, h);
    if (c.ni.set(0, 0, 1), s.vmult(c.ni, c.ni), c.ni.negate(c.ni), c.ni.normalize(), c.ni.scale(e.radius, c.ri), r.vsub(i, gi), c.ni.scale(c.ni.dot(gi), xa), gi.vsub(xa, c.rj), -gi.dot(c.ni) <= e.radius) {
      if (p)
        return !0;
      const y = c.ri, v = c.rj;
      y.vadd(r, y), y.vsub(l.position, y), v.vadd(i, v), v.vsub(u.position, v), this.result.push(c), this.createFrictionEquationsFromContact(c, this.frictionResult);
    }
  }
  boxBox(e, n, r, i, o, s, l, u, a, h, p) {
    return e.convexPolyhedronRepresentation.material = e.material, n.convexPolyhedronRepresentation.material = n.material, e.convexPolyhedronRepresentation.collisionResponse = e.collisionResponse, n.convexPolyhedronRepresentation.collisionResponse = n.collisionResponse, this.convexConvex(e.convexPolyhedronRepresentation, n.convexPolyhedronRepresentation, r, i, o, s, l, u, e, n, p);
  }
  sphereBox(e, n, r, i, o, s, l, u, a, h, p) {
    const c = this.v3pool, y = Ey;
    r.vsub(i, wi), n.getSideNormals(y, s);
    const v = e.radius;
    let w = !1;
    const S = Cy, m = ky, d = _y;
    let g = null, x = 0, E = 0, z = 0, C = null;
    for (let P = 0, Y = y.length; P !== Y && w === !1; P++) {
      const _ = wy;
      _.copy(y[P]);
      const R = _.length();
      _.normalize();
      const W = wi.dot(_);
      if (W < R + v && W > 0) {
        const q = xy, F = Sy;
        q.copy(y[(P + 1) % 3]), F.copy(y[(P + 2) % 3]);
        const Ae = q.length(), Ne = F.length();
        q.normalize(), F.normalize();
        const ot = wi.dot(q), Pe = wi.dot(F);
        if (ot < Ae && ot > -Ae && Pe < Ne && Pe > -Ne) {
          const st = Math.abs(W - R - v);
          if ((C === null || st < C) && (C = st, E = ot, z = Pe, g = R, S.copy(_), m.copy(q), d.copy(F), x++, p))
            return !0;
        }
      }
    }
    if (x) {
      w = !0;
      const P = this.createContactEquation(l, u, e, n, a, h);
      S.scale(-v, P.ri), P.ni.copy(S), P.ni.negate(P.ni), S.scale(g, S), m.scale(E, m), S.vadd(m, S), d.scale(z, d), S.vadd(d, P.rj), P.ri.vadd(r, P.ri), P.ri.vsub(l.position, P.ri), P.rj.vadd(i, P.rj), P.rj.vsub(u.position, P.rj), this.result.push(P), this.createFrictionEquationsFromContact(P, this.frictionResult);
    }
    let k = c.get();
    const O = zy;
    for (let P = 0; P !== 2 && !w; P++)
      for (let Y = 0; Y !== 2 && !w; Y++)
        for (let _ = 0; _ !== 2 && !w; _++)
          if (k.set(0, 0, 0), P ? k.vadd(y[0], k) : k.vsub(y[0], k), Y ? k.vadd(y[1], k) : k.vsub(y[1], k), _ ? k.vadd(y[2], k) : k.vsub(y[2], k), i.vadd(k, O), O.vsub(r, O), O.lengthSquared() < v * v) {
            if (p)
              return !0;
            w = !0;
            const R = this.createContactEquation(l, u, e, n, a, h);
            R.ri.copy(O), R.ri.normalize(), R.ni.copy(R.ri), R.ri.scale(v, R.ri), R.rj.copy(k), R.ri.vadd(r, R.ri), R.ri.vsub(l.position, R.ri), R.rj.vadd(i, R.rj), R.rj.vsub(u.position, R.rj), this.result.push(R), this.createFrictionEquationsFromContact(R, this.frictionResult);
          }
    c.release(k), k = null;
    const M = c.get(), D = c.get(), V = c.get(), N = c.get(), B = c.get(), L = y.length;
    for (let P = 0; P !== L && !w; P++)
      for (let Y = 0; Y !== L && !w; Y++)
        if (P % 3 !== Y % 3) {
          y[Y].cross(y[P], M), M.normalize(), y[P].vadd(y[Y], D), V.copy(r), V.vsub(D, V), V.vsub(i, V);
          const _ = V.dot(M);
          M.scale(_, N);
          let R = 0;
          for (; R === P % 3 || R === Y % 3; )
            R++;
          B.copy(r), B.vsub(N, B), B.vsub(D, B), B.vsub(i, B);
          const W = Math.abs(_), q = B.length();
          if (W < y[R].length() && q < v) {
            if (p)
              return !0;
            w = !0;
            const F = this.createContactEquation(l, u, e, n, a, h);
            D.vadd(N, F.rj), F.rj.copy(F.rj), B.negate(F.ni), F.ni.normalize(), F.ri.copy(F.rj), F.ri.vadd(i, F.ri), F.ri.vsub(r, F.ri), F.ri.normalize(), F.ri.scale(v, F.ri), F.ri.vadd(r, F.ri), F.ri.vsub(l.position, F.ri), F.rj.vadd(i, F.rj), F.rj.vsub(u.position, F.rj), this.result.push(F), this.createFrictionEquationsFromContact(F, this.frictionResult);
          }
        }
    c.release(M, D, V, N, B);
  }
  planeBox(e, n, r, i, o, s, l, u, a, h, p) {
    return n.convexPolyhedronRepresentation.material = n.material, n.convexPolyhedronRepresentation.collisionResponse = n.collisionResponse, n.convexPolyhedronRepresentation.id = n.id, this.planeConvex(e, n.convexPolyhedronRepresentation, r, i, o, s, l, u, e, n, p);
  }
  convexConvex(e, n, r, i, o, s, l, u, a, h, p, c, y) {
    const v = Vy;
    if (!(r.distanceTo(i) > e.boundingSphereRadius + n.boundingSphereRadius) && e.findSeparatingAxis(n, r, o, i, s, v, c, y)) {
      const w = [], S = qy;
      e.clipAgainstHull(r, o, n, i, s, v, -100, 100, w);
      let m = 0;
      for (let d = 0; d !== w.length; d++) {
        if (p)
          return !0;
        const g = this.createContactEquation(l, u, e, n, a, h), x = g.ri, E = g.rj;
        v.negate(g.ni), w[d].normal.negate(S), S.scale(w[d].depth, S), w[d].point.vadd(S, x), E.copy(w[d].point), x.vsub(r, x), E.vsub(i, E), x.vadd(r, x), x.vsub(l.position, x), E.vadd(i, E), E.vsub(u.position, E), this.result.push(g), m++, this.enableFrictionReduction || this.createFrictionEquationsFromContact(g, this.frictionResult);
      }
      this.enableFrictionReduction && m && this.createFrictionFromAverage(m);
    }
  }
  sphereConvex(e, n, r, i, o, s, l, u, a, h, p) {
    const c = this.v3pool;
    r.vsub(i, Ny);
    const y = n.faceNormals, v = n.faces, w = n.vertices, S = e.radius;
    let m = !1;
    for (let d = 0; d !== w.length; d++) {
      const g = w[d], x = Ry;
      s.vmult(g, x), i.vadd(x, x);
      const E = My;
      if (x.vsub(r, E), E.lengthSquared() < S * S) {
        if (p)
          return !0;
        m = !0;
        const z = this.createContactEquation(l, u, e, n, a, h);
        z.ri.copy(E), z.ri.normalize(), z.ni.copy(z.ri), z.ri.scale(S, z.ri), x.vsub(i, z.rj), z.ri.vadd(r, z.ri), z.ri.vsub(l.position, z.ri), z.rj.vadd(i, z.rj), z.rj.vsub(u.position, z.rj), this.result.push(z), this.createFrictionEquationsFromContact(z, this.frictionResult);
        return;
      }
    }
    for (let d = 0, g = v.length; d !== g && m === !1; d++) {
      const x = y[d], E = v[d], z = Ly;
      s.vmult(x, z);
      const C = By;
      s.vmult(w[E[0]], C), C.vadd(i, C);
      const k = Fy;
      z.scale(-S, k), r.vadd(k, k);
      const O = Ay;
      k.vsub(C, O);
      const M = O.dot(z), D = Iy;
      if (r.vsub(C, D), M < 0 && D.dot(z) > 0) {
        const V = [];
        for (let N = 0, B = E.length; N !== B; N++) {
          const L = c.get();
          s.vmult(w[E[N]], L), i.vadd(L, L), V.push(L);
        }
        if (gy(V, z, r)) {
          if (p)
            return !0;
          m = !0;
          const N = this.createContactEquation(l, u, e, n, a, h);
          z.scale(-S, N.ri), z.negate(N.ni);
          const B = c.get();
          z.scale(-M, B);
          const L = c.get();
          z.scale(-S, L), r.vsub(i, N.rj), N.rj.vadd(L, N.rj), N.rj.vadd(B, N.rj), N.rj.vadd(i, N.rj), N.rj.vsub(u.position, N.rj), N.ri.vadd(r, N.ri), N.ri.vsub(l.position, N.ri), c.release(B), c.release(L), this.result.push(N), this.createFrictionEquationsFromContact(N, this.frictionResult);
          for (let P = 0, Y = V.length; P !== Y; P++)
            c.release(V[P]);
          return;
        } else
          for (let N = 0; N !== E.length; N++) {
            const B = c.get(), L = c.get();
            s.vmult(w[E[(N + 1) % E.length]], B), s.vmult(w[E[(N + 2) % E.length]], L), i.vadd(B, B), i.vadd(L, L);
            const P = Py;
            L.vsub(B, P);
            const Y = Ty;
            P.unit(Y);
            const _ = c.get(), R = c.get();
            r.vsub(B, R);
            const W = R.dot(Y);
            Y.scale(W, _), _.vadd(B, _);
            const q = c.get();
            if (_.vsub(r, q), W > 0 && W * W < P.lengthSquared() && q.lengthSquared() < S * S) {
              if (p)
                return !0;
              const F = this.createContactEquation(l, u, e, n, a, h);
              _.vsub(i, F.rj), _.vsub(r, F.ni), F.ni.normalize(), F.ni.scale(S, F.ri), F.rj.vadd(i, F.rj), F.rj.vsub(u.position, F.rj), F.ri.vadd(r, F.ri), F.ri.vsub(l.position, F.ri), this.result.push(F), this.createFrictionEquationsFromContact(F, this.frictionResult);
              for (let Ae = 0, Ne = V.length; Ae !== Ne; Ae++)
                c.release(V[Ae]);
              c.release(B), c.release(L), c.release(_), c.release(q), c.release(R);
              return;
            }
            c.release(B), c.release(L), c.release(_), c.release(q), c.release(R);
          }
        for (let N = 0, B = V.length; N !== B; N++)
          c.release(V[N]);
      }
    }
  }
  planeConvex(e, n, r, i, o, s, l, u, a, h, p) {
    const c = Oy, y = jy;
    y.set(0, 0, 1), o.vmult(y, y);
    let v = 0;
    const w = Dy;
    for (let S = 0; S !== n.vertices.length; S++)
      if (c.copy(n.vertices[S]), s.vmult(c, c), i.vadd(c, c), c.vsub(r, w), y.dot(w) <= 0) {
        if (p)
          return !0;
        const d = this.createContactEquation(l, u, e, n, a, h), g = Wy;
        y.scale(y.dot(w), g), c.vsub(g, g), g.vsub(r, d.ri), d.ni.copy(y), c.vsub(i, d.rj), d.ri.vadd(r, d.ri), d.ri.vsub(l.position, d.ri), d.rj.vadd(i, d.rj), d.rj.vsub(u.position, d.rj), this.result.push(d), v++, this.enableFrictionReduction || this.createFrictionEquationsFromContact(d, this.frictionResult);
      }
    this.enableFrictionReduction && v && this.createFrictionFromAverage(v);
  }
  boxConvex(e, n, r, i, o, s, l, u, a, h, p) {
    return e.convexPolyhedronRepresentation.material = e.material, e.convexPolyhedronRepresentation.collisionResponse = e.collisionResponse, this.convexConvex(e.convexPolyhedronRepresentation, n, r, i, o, s, l, u, e, n, p);
  }
  sphereHeightfield(e, n, r, i, o, s, l, u, a, h, p) {
    const c = n.data, y = e.radius, v = n.elementSize, w = ev, S = by;
    G.pointToLocalFrame(i, s, r, S);
    let m = Math.floor((S.x - y) / v) - 1, d = Math.ceil((S.x + y) / v) + 1, g = Math.floor((S.y - y) / v) - 1, x = Math.ceil((S.y + y) / v) + 1;
    if (d < 0 || x < 0 || m > c.length || g > c[0].length)
      return;
    m < 0 && (m = 0), d < 0 && (d = 0), g < 0 && (g = 0), x < 0 && (x = 0), m >= c.length && (m = c.length - 1), d >= c.length && (d = c.length - 1), x >= c[0].length && (x = c[0].length - 1), g >= c[0].length && (g = c[0].length - 1);
    const E = [];
    n.getRectMinMax(m, g, d, x, E);
    const z = E[0], C = E[1];
    if (S.z - y > C || S.z + y < z)
      return;
    const k = this.result;
    for (let O = m; O < d; O++)
      for (let M = g; M < x; M++) {
        const D = k.length;
        let V = !1;
        if (n.getConvexTrianglePillar(O, M, !1), G.pointToWorldFrame(i, s, n.pillarOffset, w), r.distanceTo(w) < n.pillarConvex.boundingSphereRadius + e.boundingSphereRadius && (V = this.sphereConvex(e, n.pillarConvex, r, w, o, s, l, u, e, n, p)), p && V || (n.getConvexTrianglePillar(O, M, !0), G.pointToWorldFrame(i, s, n.pillarOffset, w), r.distanceTo(w) < n.pillarConvex.boundingSphereRadius + e.boundingSphereRadius && (V = this.sphereConvex(e, n.pillarConvex, r, w, o, s, l, u, e, n, p)), p && V))
          return !0;
        if (k.length - D > 2)
          return;
      }
  }
  boxHeightfield(e, n, r, i, o, s, l, u, a, h, p) {
    return e.convexPolyhedronRepresentation.material = e.material, e.convexPolyhedronRepresentation.collisionResponse = e.collisionResponse, this.convexHeightfield(e.convexPolyhedronRepresentation, n, r, i, o, s, l, u, e, n, p);
  }
  convexHeightfield(e, n, r, i, o, s, l, u, a, h, p) {
    const c = n.data, y = n.elementSize, v = e.boundingSphereRadius, w = Zy, S = Jy, m = Ky;
    G.pointToLocalFrame(i, s, r, m);
    let d = Math.floor((m.x - v) / y) - 1, g = Math.ceil((m.x + v) / y) + 1, x = Math.floor((m.y - v) / y) - 1, E = Math.ceil((m.y + v) / y) + 1;
    if (g < 0 || E < 0 || d > c.length || x > c[0].length)
      return;
    d < 0 && (d = 0), g < 0 && (g = 0), x < 0 && (x = 0), E < 0 && (E = 0), d >= c.length && (d = c.length - 1), g >= c.length && (g = c.length - 1), E >= c[0].length && (E = c[0].length - 1), x >= c[0].length && (x = c[0].length - 1);
    const z = [];
    n.getRectMinMax(d, x, g, E, z);
    const C = z[0], k = z[1];
    if (!(m.z - v > k || m.z + v < C))
      for (let O = d; O < g; O++)
        for (let M = x; M < E; M++) {
          let D = !1;
          if (n.getConvexTrianglePillar(O, M, !1), G.pointToWorldFrame(i, s, n.pillarOffset, w), r.distanceTo(w) < n.pillarConvex.boundingSphereRadius + e.boundingSphereRadius && (D = this.convexConvex(e, n.pillarConvex, r, w, o, s, l, u, null, null, p, S, null)), p && D || (n.getConvexTrianglePillar(O, M, !0), G.pointToWorldFrame(i, s, n.pillarOffset, w), r.distanceTo(w) < n.pillarConvex.boundingSphereRadius + e.boundingSphereRadius && (D = this.convexConvex(e, n.pillarConvex, r, w, o, s, l, u, null, null, p, S, null)), p && D))
            return !0;
        }
  }
  sphereParticle(e, n, r, i, o, s, l, u, a, h, p) {
    const c = Gy;
    if (c.set(0, 0, 1), i.vsub(r, c), c.lengthSquared() <= e.radius * e.radius) {
      if (p)
        return !0;
      const v = this.createContactEquation(u, l, n, e, a, h);
      c.normalize(), v.rj.copy(c), v.rj.scale(e.radius, v.rj), v.ni.copy(c), v.ni.negate(v.ni), v.ri.set(0, 0, 0), this.result.push(v), this.createFrictionEquationsFromContact(v, this.frictionResult);
    }
  }
  planeParticle(e, n, r, i, o, s, l, u, a, h, p) {
    const c = Uy;
    c.set(0, 0, 1), l.quaternion.vmult(c, c);
    const y = Hy;
    if (i.vsub(l.position, y), c.dot(y) <= 0) {
      if (p)
        return !0;
      const w = this.createContactEquation(u, l, n, e, a, h);
      w.ni.copy(c), w.ni.negate(w.ni), w.ri.set(0, 0, 0);
      const S = $y;
      c.scale(c.dot(i), S), i.vsub(S, S), w.rj.copy(S), this.result.push(w), this.createFrictionEquationsFromContact(w, this.frictionResult);
    }
  }
  boxParticle(e, n, r, i, o, s, l, u, a, h, p) {
    return e.convexPolyhedronRepresentation.material = e.material, e.convexPolyhedronRepresentation.collisionResponse = e.collisionResponse, this.convexParticle(e.convexPolyhedronRepresentation, n, r, i, o, s, l, u, e, n, p);
  }
  convexParticle(e, n, r, i, o, s, l, u, a, h, p) {
    let c = -1;
    const y = Xy, v = Qy;
    let w = null;
    const S = Yy;
    if (S.copy(i), S.vsub(r, S), o.conjugate(Sa), Sa.vmult(S, S), e.pointIsInside(S)) {
      e.worldVerticesNeedsUpdate && e.computeWorldVertices(r, o), e.worldFaceNormalsNeedsUpdate && e.computeWorldFaceNormals(o);
      for (let m = 0, d = e.faces.length; m !== d; m++) {
        const g = [e.worldVertices[e.faces[m][0]]], x = e.worldFaceNormals[m];
        i.vsub(g[0], Ea);
        const E = -x.dot(Ea);
        if (w === null || Math.abs(E) < Math.abs(w)) {
          if (p)
            return !0;
          w = E, c = m, y.copy(x);
        }
      }
      if (c !== -1) {
        const m = this.createContactEquation(u, l, n, e, a, h);
        y.scale(w, v), v.vadd(i, v), v.vsub(r, v), m.rj.copy(v), y.negate(m.ni), m.ri.set(0, 0, 0);
        const d = m.ri, g = m.rj;
        d.vadd(i, d), d.vsub(u.position, d), g.vadd(r, g), g.vsub(l.position, g), this.result.push(m), this.createFrictionEquationsFromContact(m, this.frictionResult);
      } else
        console.warn("Point found inside convex, but did not find penetrating face!");
    }
  }
  heightfieldCylinder(e, n, r, i, o, s, l, u, a, h, p) {
    return this.convexHeightfield(n, e, i, r, s, o, u, l, a, h, p);
  }
  particleCylinder(e, n, r, i, o, s, l, u, a, h, p) {
    return this.convexParticle(n, e, i, r, s, o, u, l, a, h, p);
  }
  sphereTrimesh(e, n, r, i, o, s, l, u, a, h, p) {
    const c = iy, y = oy, v = sy, w = ly, S = uy, m = ay, d = hy, g = ry, x = ty, E = py;
    G.pointToLocalFrame(i, s, r, S);
    const z = e.radius;
    d.lowerBound.set(S.x - z, S.y - z, S.z - z), d.upperBound.set(S.x + z, S.y + z, S.z + z), n.getTrianglesInAABB(d, E);
    const C = ny, k = e.radius * e.radius;
    for (let N = 0; N < E.length; N++)
      for (let B = 0; B < 3; B++)
        if (n.getVertex(n.indices[E[N] * 3 + B], C), C.vsub(S, x), x.lengthSquared() <= k) {
          if (g.copy(C), G.pointToWorldFrame(i, s, g, C), C.vsub(r, x), p)
            return !0;
          let L = this.createContactEquation(l, u, e, n, a, h);
          L.ni.copy(x), L.ni.normalize(), L.ri.copy(L.ni), L.ri.scale(e.radius, L.ri), L.ri.vadd(r, L.ri), L.ri.vsub(l.position, L.ri), L.rj.copy(C), L.rj.vsub(u.position, L.rj), this.result.push(L), this.createFrictionEquationsFromContact(L, this.frictionResult);
        }
    for (let N = 0; N < E.length; N++)
      for (let B = 0; B < 3; B++) {
        n.getVertex(n.indices[E[N] * 3 + B], c), n.getVertex(n.indices[E[N] * 3 + (B + 1) % 3], y), y.vsub(c, v), S.vsub(y, m);
        const L = m.dot(v);
        S.vsub(c, m);
        let P = m.dot(v);
        if (P > 0 && L < 0 && (S.vsub(c, m), w.copy(v), w.normalize(), P = m.dot(w), w.scale(P, m), m.vadd(c, m), m.distanceTo(S) < e.radius)) {
          if (p)
            return !0;
          const _ = this.createContactEquation(l, u, e, n, a, h);
          m.vsub(S, _.ni), _.ni.normalize(), _.ni.scale(e.radius, _.ri), _.ri.vadd(r, _.ri), _.ri.vsub(l.position, _.ri), G.pointToWorldFrame(i, s, m, m), m.vsub(u.position, _.rj), G.vectorToWorldFrame(s, _.ni, _.ni), G.vectorToWorldFrame(s, _.ri, _.ri), this.result.push(_), this.createFrictionEquationsFromContact(_, this.frictionResult);
        }
      }
    const O = cy, M = dy, D = fy, V = ey;
    for (let N = 0, B = E.length; N !== B; N++) {
      n.getTriangleVertices(E[N], O, M, D), n.getNormal(E[N], V), S.vsub(O, m);
      let L = m.dot(V);
      if (V.scale(L, m), S.vsub(m, m), L = m.distanceTo(S), le.pointInTriangle(m, O, M, D) && L < e.radius) {
        if (p)
          return !0;
        let P = this.createContactEquation(l, u, e, n, a, h);
        m.vsub(S, P.ni), P.ni.normalize(), P.ni.scale(e.radius, P.ri), P.ri.vadd(r, P.ri), P.ri.vsub(l.position, P.ri), G.pointToWorldFrame(i, s, m, m), m.vsub(u.position, P.rj), G.vectorToWorldFrame(s, P.ni, P.ni), G.vectorToWorldFrame(s, P.ri, P.ri), this.result.push(P), this.createFrictionEquationsFromContact(P, this.frictionResult);
      }
    }
    E.length = 0;
  }
  planeTrimesh(e, n, r, i, o, s, l, u, a, h, p) {
    const c = new f(), y = Zm;
    y.set(0, 0, 1), o.vmult(y, y);
    for (let v = 0; v < n.vertices.length / 3; v++) {
      n.getVertex(v, c);
      const w = new f();
      w.copy(c), G.pointToWorldFrame(i, s, w, c);
      const S = Jm;
      if (c.vsub(r, S), y.dot(S) <= 0) {
        if (p)
          return !0;
        const d = this.createContactEquation(l, u, e, n, a, h);
        d.ni.copy(y);
        const g = bm;
        y.scale(S.dot(y), g), c.vsub(g, g), d.ri.copy(g), d.ri.vsub(l.position, d.ri), d.rj.copy(c), d.rj.vsub(u.position, d.rj), this.result.push(d), this.createFrictionEquationsFromContact(d, this.frictionResult);
      }
    }
  }
  // convexTrimesh(
  //   si: ConvexPolyhedron, sj: Trimesh, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion,
  //   bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null,
  //   faceListA?: number[] | null, faceListB?: number[] | null,
  // ) {
  //   const sepAxis = convexConvex_sepAxis;
  //   if(xi.distanceTo(xj) > si.boundingSphereRadius + sj.boundingSphereRadius){
  //       return;
  //   }
  //   // Construct a temp hull for each triangle
  //   const hullB = new ConvexPolyhedron();
  //   hullB.faces = [[0,1,2]];
  //   const va = new Vec3();
  //   const vb = new Vec3();
  //   const vc = new Vec3();
  //   hullB.vertices = [
  //       va,
  //       vb,
  //       vc
  //   ];
  //   for (let i = 0; i < sj.indices.length / 3; i++) {
  //       const triangleNormal = new Vec3();
  //       sj.getNormal(i, triangleNormal);
  //       hullB.faceNormals = [triangleNormal];
  //       sj.getTriangleVertices(i, va, vb, vc);
  //       let d = si.testSepAxis(triangleNormal, hullB, xi, qi, xj, qj);
  //       if(!d){
  //           triangleNormal.scale(-1, triangleNormal);
  //           d = si.testSepAxis(triangleNormal, hullB, xi, qi, xj, qj);
  //           if(!d){
  //               continue;
  //           }
  //       }
  //       const res: ConvexPolyhedronContactPoint[] = [];
  //       const q = convexConvex_q;
  //       si.clipAgainstHull(xi,qi,hullB,xj,qj,triangleNormal,-100,100,res);
  //       for(let j = 0; j !== res.length; j++){
  //           const r = this.createContactEquation(bi,bj,si,sj,rsi,rsj),
  //               ri = r.ri,
  //               rj = r.rj;
  //           r.ni.copy(triangleNormal);
  //           r.ni.negate(r.ni);
  //           res[j].normal.negate(q);
  //           q.mult(res[j].depth, q);
  //           res[j].point.vadd(q, ri);
  //           rj.copy(res[j].point);
  //           // Contact points are in world coordinates. Transform back to relative
  //           ri.vsub(xi,ri);
  //           rj.vsub(xj,rj);
  //           // Make relative to bodies
  //           ri.vadd(xi, ri);
  //           ri.vsub(bi.position, ri);
  //           rj.vadd(xj, rj);
  //           rj.vsub(bj.position, rj);
  //           result.push(r);
  //       }
  //   }
  // }
}
const bt = new f(), gn = new f(), wn = new f(), Ym = new f(), Xm = new f(), Qm = new ue(), Km = new ue(), Zm = new f(), Jm = new f(), bm = new f(), ey = new f(), ty = new f();
new f();
const ny = new f(), ry = new f(), iy = new f(), oy = new f(), sy = new f(), ly = new f(), uy = new f(), ay = new f(), cy = new f(), dy = new f(), fy = new f(), hy = new qe(), py = [], gi = new f(), xa = new f(), my = new f(), yy = new f(), vy = new f();
function gy(t, e, n) {
  let r = null;
  const i = t.length;
  for (let o = 0; o !== i; o++) {
    const s = t[o], l = my;
    t[(o + 1) % i].vsub(s, l);
    const u = yy;
    l.cross(e, u);
    const a = vy;
    n.vsub(s, a);
    const h = u.dot(a);
    if (r === null || h > 0 && r === !0 || h <= 0 && r === !1) {
      r === null && (r = h > 0);
      continue;
    } else
      return !1;
  }
  return !0;
}
const wi = new f(), wy = new f(), xy = new f(), Sy = new f(), Ey = [new f(), new f(), new f(), new f(), new f(), new f()], zy = new f(), Cy = new f(), ky = new f(), _y = new f(), Ny = new f(), Py = new f(), Ty = new f(), My = new f(), Ry = new f(), Ly = new f(), By = new f(), Fy = new f(), Ay = new f(), Iy = new f();
new f();
new f();
const Oy = new f(), jy = new f(), Dy = new f(), Wy = new f(), Vy = new f(), qy = new f(), Uy = new f(), Hy = new f(), $y = new f(), Gy = new f(), Sa = new ue(), Yy = new f();
new f();
const Xy = new f(), Ea = new f(), Qy = new f(), Ky = new f(), Zy = new f(), Jy = [0], by = new f(), ev = new f();
class za {
  /**
   * @todo Remove useless constructor
   */
  constructor() {
    this.current = [], this.previous = [];
  }
  /**
   * getKey
   */
  getKey(e, n) {
    if (n < e) {
      const r = n;
      n = e, e = r;
    }
    return e << 16 | n;
  }
  /**
   * set
   */
  set(e, n) {
    const r = this.getKey(e, n), i = this.current;
    let o = 0;
    for (; r > i[o]; )
      o++;
    if (r !== i[o]) {
      for (let s = i.length - 1; s >= o; s--)
        i[s + 1] = i[s];
      i[o] = r;
    }
  }
  /**
   * tick
   */
  tick() {
    const e = this.current;
    this.current = this.previous, this.previous = e, this.current.length = 0;
  }
  /**
   * getDiff
   */
  getDiff(e, n) {
    const r = this.current, i = this.previous, o = r.length, s = i.length;
    let l = 0;
    for (let u = 0; u < o; u++) {
      let a = !1;
      const h = r[u];
      for (; h > i[l]; )
        l++;
      a = h === i[l], a || Ca(e, h);
    }
    l = 0;
    for (let u = 0; u < s; u++) {
      let a = !1;
      const h = i[u];
      for (; h > r[l]; )
        l++;
      a = r[l] === h, a || Ca(n, h);
    }
  }
}
function Ca(t, e) {
  t.push((e & 4294901760) >> 16, e & 65535);
}
const bo = (t, e) => t < e ? `${t}-${e}` : `${e}-${t}`;
class tv {
  constructor() {
    this.data = {
      keys: []
    };
  }
  /** get */
  get(e, n) {
    const r = bo(e, n);
    return this.data[r];
  }
  /** set */
  set(e, n, r) {
    const i = bo(e, n);
    this.get(e, n) || this.data.keys.push(i), this.data[i] = r;
  }
  /** delete */
  delete(e, n) {
    const r = bo(e, n), i = this.data.keys.indexOf(r);
    i !== -1 && this.data.keys.splice(i, 1), delete this.data[r];
  }
  /** reset */
  reset() {
    const e = this.data, n = e.keys;
    for (; n.length > 0; ) {
      const r = n.pop();
      delete e[r];
    }
  }
}
class nv extends Dd {
  /**
   * Currently / last used timestep. Is set to -1 if not available. This value is updated before each internal step, which means that it is "fresh" inside event callbacks.
   */
  /**
   * Makes bodies go to sleep when they've been inactive.
   * @default false
   */
  /**
   * All the current contacts (instances of ContactEquation) in the world.
   */
  /**
   * How often to normalize quaternions. Set to 0 for every step, 1 for every second etc.. A larger value increases performance. If bodies tend to explode, set to a smaller value (zero to be sure nothing can go wrong).
   * @default 0
   */
  /**
   * Set to true to use fast quaternion normalization. It is often enough accurate to use.
   * If bodies tend to explode, set to false.
   * @default false
   */
  /**
   * The wall-clock time since simulation start.
   */
  /**
   * Number of timesteps taken since start.
   */
  /**
   * Default and last timestep sizes.
   */
  /**
   * The gravity of the world.
   */
  /**
   * Gravity to use when approximating the friction max force (mu*mass*gravity).
   * If undefined, global gravity will be used.
   * Use to enable friction in a World with a null gravity vector (no gravity).
   */
  /**
   * The broadphase algorithm to use.
   * @default NaiveBroadphase
   */
  /**
   * All bodies in this world
   */
  /**
   * True if any bodies are not sleeping, false if every body is sleeping.
   */
  /**
   * The solver algorithm to use.
   * @default GSSolver
   */
  /**
   * collisionMatrix
   */
  /**
   * CollisionMatrix from the previous step.
   */
  /**
   * All added contactmaterials.
   */
  /**
   * Used to look up a ContactMaterial given two instances of Material.
   */
  /**
   * The default material of the bodies.
   */
  /**
   * This contact material is used if no suitable contactmaterial is found for a contact.
   */
  /**
   * Time accumulator for interpolation.
   * @see https://gafferongames.com/game-physics/fix-your-timestep/
   */
  /**
   * Dispatched after a body has been added to the world.
   */
  /**
   * Dispatched after a body has been removed from the world.
   */
  constructor(e) {
    e === void 0 && (e = {}), super(), this.dt = -1, this.allowSleep = !!e.allowSleep, this.contacts = [], this.frictionEquations = [], this.quatNormalizeSkip = e.quatNormalizeSkip !== void 0 ? e.quatNormalizeSkip : 0, this.quatNormalizeFast = e.quatNormalizeFast !== void 0 ? e.quatNormalizeFast : !1, this.time = 0, this.stepnumber = 0, this.default_dt = 1 / 60, this.nextId = 0, this.gravity = new f(), e.gravity && this.gravity.copy(e.gravity), e.frictionGravity && (this.frictionGravity = new f(), this.frictionGravity.copy(e.frictionGravity)), this.broadphase = e.broadphase !== void 0 ? e.broadphase : new Wd(), this.bodies = [], this.hasActiveBodies = !1, this.solver = e.solver !== void 0 ? e.solver : new Wm(), this.constraints = [], this.narrowphase = new Gm(this), this.collisionMatrix = new aa(), this.collisionMatrixPrevious = new aa(), this.bodyOverlapKeeper = new za(), this.shapeOverlapKeeper = new za(), this.contactmaterials = [], this.contactMaterialTable = new tv(), this.defaultMaterial = new Eo("default"), this.defaultContactMaterial = new So(this.defaultMaterial, this.defaultMaterial, {
      friction: 0.3,
      restitution: 0
    }), this.doProfiling = !1, this.profile = {
      solve: 0,
      makeContactConstraints: 0,
      broadphase: 0,
      integrate: 0,
      narrowphase: 0
    }, this.accumulator = 0, this.subsystems = [], this.addBodyEvent = {
      type: "addBody",
      body: null
    }, this.removeBodyEvent = {
      type: "removeBody",
      body: null
    }, this.idToBodyMap = {}, this.broadphase.setWorld(this);
  }
  /**
   * Get the contact material between materials m1 and m2
   * @return The contact material if it was found.
   */
  getContactMaterial(e, n) {
    return this.contactMaterialTable.get(e.id, n.id);
  }
  /**
   * Store old collision state info
   */
  collisionMatrixTick() {
    const e = this.collisionMatrixPrevious;
    this.collisionMatrixPrevious = this.collisionMatrix, this.collisionMatrix = e, this.collisionMatrix.reset(), this.bodyOverlapKeeper.tick(), this.shapeOverlapKeeper.tick();
  }
  /**
   * Add a constraint to the simulation.
   */
  addConstraint(e) {
    this.constraints.push(e);
  }
  /**
   * Removes a constraint
   */
  removeConstraint(e) {
    const n = this.constraints.indexOf(e);
    n !== -1 && this.constraints.splice(n, 1);
  }
  /**
   * Raycast test
   * @deprecated Use .raycastAll, .raycastClosest or .raycastAny instead.
   */
  rayTest(e, n, r) {
    r instanceof no ? this.raycastClosest(e, n, {
      skipBackfaces: !0
    }, r) : this.raycastAll(e, n, {
      skipBackfaces: !0
    }, r);
  }
  /**
   * Ray cast against all bodies. The provided callback will be executed for each hit with a RaycastResult as single argument.
   * @return True if any body was hit.
   */
  raycastAll(e, n, r, i) {
    return r === void 0 && (r = {}), r.mode = le.ALL, r.from = e, r.to = n, r.callback = i, es.intersectWorld(this, r);
  }
  /**
   * Ray cast, and stop at the first result. Note that the order is random - but the method is fast.
   * @return True if any body was hit.
   */
  raycastAny(e, n, r, i) {
    return r === void 0 && (r = {}), r.mode = le.ANY, r.from = e, r.to = n, r.result = i, es.intersectWorld(this, r);
  }
  /**
   * Ray cast, and return information of the closest hit.
   * @return True if any body was hit.
   */
  raycastClosest(e, n, r, i) {
    return r === void 0 && (r = {}), r.mode = le.CLOSEST, r.from = e, r.to = n, r.result = i, es.intersectWorld(this, r);
  }
  /**
   * Add a rigid body to the simulation.
   * @todo If the simulation has not yet started, why recrete and copy arrays for each body? Accumulate in dynamic arrays in this case.
   * @todo Adding an array of bodies should be possible. This would save some loops too
   */
  addBody(e) {
    this.bodies.includes(e) || (e.index = this.bodies.length, this.bodies.push(e), e.world = this, e.initPosition.copy(e.position), e.initVelocity.copy(e.velocity), e.timeLastSleepy = this.time, e instanceof I && (e.initAngularVelocity.copy(e.angularVelocity), e.initQuaternion.copy(e.quaternion)), this.collisionMatrix.setNumObjects(this.bodies.length), this.addBodyEvent.body = e, this.idToBodyMap[e.id] = e, this.dispatchEvent(this.addBodyEvent));
  }
  /**
   * Remove a rigid body from the simulation.
   */
  removeBody(e) {
    e.world = null;
    const n = this.bodies.length - 1, r = this.bodies, i = r.indexOf(e);
    if (i !== -1) {
      r.splice(i, 1);
      for (let o = 0; o !== r.length; o++)
        r[o].index = o;
      this.collisionMatrix.setNumObjects(n), this.removeBodyEvent.body = e, delete this.idToBodyMap[e.id], this.dispatchEvent(this.removeBodyEvent);
    }
  }
  getBodyById(e) {
    return this.idToBodyMap[e];
  }
  /**
   * @todo Make a faster map
   */
  getShapeById(e) {
    const n = this.bodies;
    for (let r = 0; r < n.length; r++) {
      const i = n[r].shapes;
      for (let o = 0; o < i.length; o++) {
        const s = i[o];
        if (s.id === e)
          return s;
      }
    }
    return null;
  }
  /**
   * Adds a contact material to the World
   */
  addContactMaterial(e) {
    this.contactmaterials.push(e), this.contactMaterialTable.set(e.materials[0].id, e.materials[1].id, e);
  }
  /**
   * Removes a contact material from the World.
   */
  removeContactMaterial(e) {
    const n = this.contactmaterials.indexOf(e);
    n !== -1 && (this.contactmaterials.splice(n, 1), this.contactMaterialTable.delete(e.materials[0].id, e.materials[1].id));
  }
  /**
   * Step the simulation forward keeping track of last called time
   * to be able to step the world at a fixed rate, independently of framerate.
   *
   * @param dt The fixed time step size to use (default: 1 / 60).
   * @param maxSubSteps Maximum number of fixed steps to take per function call (default: 10).
   * @see https://gafferongames.com/post/fix_your_timestep/
   * @example
   *     // Run the simulation independently of framerate every 1 / 60 ms
   *     world.fixedStep()
   */
  fixedStep(e, n) {
    e === void 0 && (e = 1 / 60), n === void 0 && (n = 10);
    const r = ce.now() / 1e3;
    if (!this.lastCallTime)
      this.step(e, void 0, n);
    else {
      const i = r - this.lastCallTime;
      this.step(e, i, n);
    }
    this.lastCallTime = r;
  }
  /**
   * Step the physics world forward in time.
   *
   * There are two modes. The simple mode is fixed timestepping without interpolation. In this case you only use the first argument. The second case uses interpolation. In that you also provide the time since the function was last used, as well as the maximum fixed timesteps to take.
   *
   * @param dt The fixed time step size to use.
   * @param timeSinceLastCalled The time elapsed since the function was last called.
   * @param maxSubSteps Maximum number of fixed steps to take per function call (default: 10).
   * @see https://web.archive.org/web/20180426154531/http://bulletphysics.org/mediawiki-1.5.8/index.php/Stepping_The_World#What_do_the_parameters_to_btDynamicsWorld::stepSimulation_mean.3F
   * @example
   *     // fixed timestepping without interpolation
   *     world.step(1 / 60)
   */
  step(e, n, r) {
    if (r === void 0 && (r = 10), n === void 0)
      this.internalStep(e), this.time += e;
    else {
      this.accumulator += n;
      const i = ce.now();
      let o = 0;
      for (; this.accumulator >= e && o < r && (this.internalStep(e), this.accumulator -= e, o++, !(ce.now() - i > e * 1e3)); )
        ;
      this.accumulator = this.accumulator % e;
      const s = this.accumulator / e;
      for (let l = 0; l !== this.bodies.length; l++) {
        const u = this.bodies[l];
        u.previousPosition.lerp(u.position, s, u.interpolatedPosition), u.previousQuaternion.slerp(u.quaternion, s, u.interpolatedQuaternion), u.previousQuaternion.normalize();
      }
      this.time += n;
    }
  }
  internalStep(e) {
    this.dt = e;
    const n = this.contacts, r = lv, i = uv, o = this.bodies.length, s = this.bodies, l = this.solver, u = this.gravity, a = this.doProfiling, h = this.profile, p = I.DYNAMIC;
    let c = -1 / 0;
    const y = this.constraints, v = sv;
    u.length();
    const w = u.x, S = u.y, m = u.z;
    let d = 0;
    for (a && (c = ce.now()), d = 0; d !== o; d++) {
      const N = s[d];
      if (N.type === p) {
        const B = N.force, L = N.mass;
        B.x += L * w, B.y += L * S, B.z += L * m;
      }
    }
    for (let N = 0, B = this.subsystems.length; N !== B; N++)
      this.subsystems[N].update();
    a && (c = ce.now()), r.length = 0, i.length = 0, this.broadphase.collisionPairs(this, r, i), a && (h.broadphase = ce.now() - c);
    let g = y.length;
    for (d = 0; d !== g; d++) {
      const N = y[d];
      if (!N.collideConnected)
        for (let B = r.length - 1; B >= 0; B -= 1)
          (N.bodyA === r[B] && N.bodyB === i[B] || N.bodyB === r[B] && N.bodyA === i[B]) && (r.splice(B, 1), i.splice(B, 1));
    }
    this.collisionMatrixTick(), a && (c = ce.now());
    const x = ov, E = n.length;
    for (d = 0; d !== E; d++)
      x.push(n[d]);
    n.length = 0;
    const z = this.frictionEquations.length;
    for (d = 0; d !== z; d++)
      v.push(this.frictionEquations[d]);
    for (this.frictionEquations.length = 0, this.narrowphase.getContacts(
      r,
      i,
      this,
      n,
      x,
      // To be reused
      this.frictionEquations,
      v
    ), a && (h.narrowphase = ce.now() - c), a && (c = ce.now()), d = 0; d < this.frictionEquations.length; d++)
      l.addEquation(this.frictionEquations[d]);
    const C = n.length;
    for (let N = 0; N !== C; N++) {
      const B = n[N], L = B.bi, P = B.bj, Y = B.si, _ = B.sj;
      let R;
      if (L.material && P.material ? R = this.getContactMaterial(L.material, P.material) || this.defaultContactMaterial : R = this.defaultContactMaterial, R.friction, L.material && P.material && (L.material.friction >= 0 && P.material.friction >= 0 && L.material.friction * P.material.friction, L.material.restitution >= 0 && P.material.restitution >= 0 && (B.restitution = L.material.restitution * P.material.restitution)), l.addEquation(B), L.allowSleep && L.type === I.DYNAMIC && L.sleepState === I.SLEEPING && P.sleepState === I.AWAKE && P.type !== I.STATIC) {
        const W = P.velocity.lengthSquared() + P.angularVelocity.lengthSquared(), q = P.sleepSpeedLimit ** 2;
        W >= q * 2 && (L.wakeUpAfterNarrowphase = !0);
      }
      if (P.allowSleep && P.type === I.DYNAMIC && P.sleepState === I.SLEEPING && L.sleepState === I.AWAKE && L.type !== I.STATIC) {
        const W = L.velocity.lengthSquared() + L.angularVelocity.lengthSquared(), q = L.sleepSpeedLimit ** 2;
        W >= q * 2 && (P.wakeUpAfterNarrowphase = !0);
      }
      this.collisionMatrix.set(L, P, !0), this.collisionMatrixPrevious.get(L, P) || (sr.body = P, sr.contact = B, L.dispatchEvent(sr), sr.body = L, P.dispatchEvent(sr)), this.bodyOverlapKeeper.set(L.id, P.id), this.shapeOverlapKeeper.set(Y.id, _.id);
    }
    for (this.emitContactEvents(), a && (h.makeContactConstraints = ce.now() - c, c = ce.now()), d = 0; d !== o; d++) {
      const N = s[d];
      N.wakeUpAfterNarrowphase && (N.wakeUp(), N.wakeUpAfterNarrowphase = !1);
    }
    for (g = y.length, d = 0; d !== g; d++) {
      const N = y[d];
      N.update();
      for (let B = 0, L = N.equations.length; B !== L; B++) {
        const P = N.equations[B];
        l.addEquation(P);
      }
    }
    l.solve(e, this), a && (h.solve = ce.now() - c), l.removeAllEquations();
    const k = Math.pow;
    for (d = 0; d !== o; d++) {
      const N = s[d];
      if (N.type & p) {
        const B = k(1 - N.linearDamping, e), L = N.velocity;
        L.scale(B, L);
        const P = N.angularVelocity;
        if (P) {
          const Y = k(1 - N.angularDamping, e);
          P.scale(Y, P);
        }
      }
    }
    this.dispatchEvent(iv), a && (c = ce.now());
    const M = this.stepnumber % (this.quatNormalizeSkip + 1) === 0, D = this.quatNormalizeFast;
    for (d = 0; d !== o; d++)
      s[d].integrate(e, M, D);
    this.clearForces(), this.broadphase.dirty = !0, a && (h.integrate = ce.now() - c), this.stepnumber += 1, this.dispatchEvent(rv);
    let V = !0;
    if (this.allowSleep)
      for (V = !1, d = 0; d !== o; d++) {
        const N = s[d];
        N.sleepTick(this.time), N.sleepState !== I.SLEEPING && (V = !0);
      }
    this.hasActiveBodies = V;
  }
  emitContactEvents() {
    const e = this.hasAnyEventListener("beginContact"), n = this.hasAnyEventListener("endContact");
    if ((e || n) && this.bodyOverlapKeeper.getDiff(yt, vt), e) {
      for (let o = 0, s = yt.length; o < s; o += 2)
        lr.bodyA = this.getBodyById(yt[o]), lr.bodyB = this.getBodyById(yt[o + 1]), this.dispatchEvent(lr);
      lr.bodyA = lr.bodyB = null;
    }
    if (n) {
      for (let o = 0, s = vt.length; o < s; o += 2)
        ur.bodyA = this.getBodyById(vt[o]), ur.bodyB = this.getBodyById(vt[o + 1]), this.dispatchEvent(ur);
      ur.bodyA = ur.bodyB = null;
    }
    yt.length = vt.length = 0;
    const r = this.hasAnyEventListener("beginShapeContact"), i = this.hasAnyEventListener("endShapeContact");
    if ((r || i) && this.shapeOverlapKeeper.getDiff(yt, vt), r) {
      for (let o = 0, s = yt.length; o < s; o += 2) {
        const l = this.getShapeById(yt[o]), u = this.getShapeById(yt[o + 1]);
        gt.shapeA = l, gt.shapeB = u, l && (gt.bodyA = l.body), u && (gt.bodyB = u.body), this.dispatchEvent(gt);
      }
      gt.bodyA = gt.bodyB = gt.shapeA = gt.shapeB = null;
    }
    if (i) {
      for (let o = 0, s = vt.length; o < s; o += 2) {
        const l = this.getShapeById(vt[o]), u = this.getShapeById(vt[o + 1]);
        wt.shapeA = l, wt.shapeB = u, l && (wt.bodyA = l.body), u && (wt.bodyB = u.body), this.dispatchEvent(wt);
      }
      wt.bodyA = wt.bodyB = wt.shapeA = wt.shapeB = null;
    }
  }
  /**
   * Sets all body forces in the world to zero.
   */
  clearForces() {
    const e = this.bodies, n = e.length;
    for (let r = 0; r !== n; r++) {
      const i = e[r];
      i.force, i.torque, i.force.set(0, 0, 0), i.torque.set(0, 0, 0);
    }
  }
}
new qe();
const es = new le(), ce = globalThis.performance || {};
if (!ce.now) {
  let t = Date.now();
  ce.timing && ce.timing.navigationStart && (t = ce.timing.navigationStart), ce.now = () => Date.now() - t;
}
new f();
const rv = {
  type: "postStep"
}, iv = {
  type: "preStep"
}, sr = {
  type: I.COLLIDE_EVENT_NAME,
  body: null,
  contact: null
}, ov = [], sv = [], lv = [], uv = [], yt = [], vt = [], lr = {
  type: "beginContact",
  bodyA: null,
  bodyB: null
}, ur = {
  type: "endContact",
  bodyA: null,
  bodyB: null
}, gt = {
  type: "beginShapeContact",
  bodyA: null,
  bodyB: null,
  shapeA: null,
  shapeB: null
}, wt = {
  type: "endShapeContact",
  bodyA: null,
  bodyB: null,
  shapeA: null,
  shapeB: null
}, oe = {
  bar: { size: { x: 10, y: 0.2, z: 0.2 }, mass: 0.1, pos: { x: 0, y: 15, z: 0 } },
  torso: { size: { x: 1.6, y: 3, z: 0.8 }, mass: 1, pos: { x: 0, y: 8, z: 0 } },
  head: { size: { x: 1.1, y: 1.1, z: 0.8 }, mass: 0.5, pos: { x: 0, y: 10, z: 0 } },
  handL: { size: { x: 0.4, y: 2, z: 0.4 }, mass: 0.3, pos: { x: -1.8, y: 8, z: 0 } },
  handR: { size: { x: 0.4, y: 2, z: 0.4 }, mass: 0.3, pos: { x: 1.8, y: 8, z: 0 } },
  footL: { size: { x: 0.5, y: 2.2, z: 0.5 }, mass: 0.4, pos: { x: -0.6, y: 5, z: 0 } },
  footR: { size: { x: 0.5, y: 2.2, z: 0.5 }, mass: 0.4, pos: { x: 0.6, y: 5, z: 0 } }
}, xn = {
  barToHead: { a: new f(0, 0, 0), b: new f(0, 0.5, 0) },
  barToHandL: { a: new f(-2.5, 0, 0), b: new f(0, 1, 0) },
  barToHandR: { a: new f(2.5, 0, 0), b: new f(0, 1, 0) }
};
class av {
  constructor() {
    ie(this, "world");
    ie(this, "barBody");
    ie(this, "torsoBody");
    ie(this, "headBody");
    ie(this, "handLBody");
    ie(this, "handRBody");
    ie(this, "footLBody");
    ie(this, "footRBody");
    ie(this, "stringConstraints");
    ie(this, "barBase");
    ie(this, "windStrength", 1);
    ie(this, "swayAmp", 2);
    ie(this, "swayRate", 0.7);
    ie(this, "upDownAmp", 0.5);
    ie(this, "upDownRate", 0.9);
    this.world = new nv(), this.world.broadphase = new Wd(), this.world.gravity.set(0, -9.82, 0), this.world.solver.iterations = 20;
    const e = new I({ mass: 0, shape: new jm() });
    e.quaternion.setFromAxisAngle(new f(1, 0, 0), -Math.PI / 2), this.world.addBody(e);
    const n = (o, s, l) => {
      const u = new xo(new f(o.x / 2, o.y / 2, o.z / 2)), a = new I({ mass: s, shape: u });
      return a.position.set(l.x, l.y, l.z), a.linearDamping = 0.02, this.world.addBody(a), a;
    };
    this.barBody = n(oe.bar.size, oe.bar.mass, oe.bar.pos), this.barBody.type = I.KINEMATIC, this.barBody.updateMassProperties(), this.barBody.allowSleep = !1, this.barBody.angularDamping = 1, this.barBody.linearDamping = 1, this.torsoBody = n(oe.torso.size, oe.torso.mass, oe.torso.pos), this.headBody = n(oe.head.size, oe.head.mass, oe.head.pos), this.handLBody = n(oe.handL.size, oe.handL.mass, oe.handL.pos), this.handRBody = n(oe.handR.size, oe.handR.mass, oe.handR.pos), this.footLBody = n(oe.footL.size, oe.footL.mass, oe.footL.pos), this.footRBody = n(oe.footR.size, oe.footR.mass, oe.footR.pos);
    const r = (o, s, l, u) => {
      const a = new Fm(o, s, l, u, 1e4);
      this.world.addConstraint(a);
    };
    r(this.torsoBody, new f(0, 1.6, 0), this.headBody, new f(0, -0.5, 0)), r(this.torsoBody, new f(-0.8, 1.2, 0), this.handLBody, new f(0, 1, 0)), r(this.torsoBody, new f(0.8, 1.2, 0), this.handRBody, new f(0, 1, 0)), r(this.torsoBody, new f(-0.4, -1.4, 0), this.footLBody, new f(0, 1, 0)), r(this.torsoBody, new f(0.4, -1.4, 0), this.footRBody, new f(0, 1, 0)), this.stringConstraints = [];
    const i = (o, s, l, u) => {
      const a = new Am(o, l, void 0, 5e3);
      a.pivotA = s.clone(), a.pivotB = u.clone(), this.world.addConstraint(a), this.stringConstraints.push(a);
    };
    i(this.barBody, xn.barToHead.a, this.headBody, xn.barToHead.b), i(this.barBody, xn.barToHandL.a, this.handLBody, xn.barToHandL.b), i(this.barBody, xn.barToHandR.a, this.handRBody, xn.barToHandR.b), this.barBase = this.barBody.position.clone();
  }
  step(e, n) {
    if (e <= 0) return;
    const r = Math.sin(n * this.swayRate) * this.swayAmp, i = Math.sin(n * this.upDownRate) * this.upDownAmp;
    this.barBody.position.x = this.barBase.x + r, this.barBody.position.y = this.barBase.y + i, this.barBody.position.z = this.barBase.z, this.barBody.quaternion.set(0, 0, 0, 1), this.barBody.velocity.set(0, 0, 0), this.barBody.angularVelocity.set(0, 0, 0);
    const o = 0.1 + 0.1 * Math.sin(n * 0.02), s = Math.sin(n * 0.11), l = Math.cos(n * 0.07), u = 0.6 * o * this.windStrength, a = new f(u * s, 0, u * l), h = (c) => {
      c.applyForce(a, c.position);
    };
    h(this.torsoBody), h(this.headBody), h(this.handLBody), h(this.handRBody), h(this.footLBody), h(this.footRBody);
    const p = Math.min(e, 1 / 30);
    this.world.step(1 / 60, p, 3);
  }
  snapshot() {
    const e = (r) => ({
      position: { x: r.position.x, y: r.position.y, z: r.position.z },
      quaternion: {
        x: r.quaternion.x,
        y: r.quaternion.y,
        z: r.quaternion.z,
        w: r.quaternion.w
      }
    }), n = this.stringConstraints.map((r) => {
      const i = new f(), o = new f(), s = r.pivotA, l = r.pivotB;
      return r.bodyA.pointToWorldFrame(s, i), r.bodyB.pointToWorldFrame(l, o), {
        a: { x: i.x, y: i.y, z: i.z },
        b: { x: o.x, y: o.y, z: o.z }
      };
    });
    return {
      bar: e(this.barBody),
      torso: e(this.torsoBody),
      head: e(this.headBody),
      handL: e(this.handLBody),
      handR: e(this.handRBody),
      footL: e(this.footLBody),
      footR: e(this.footRBody),
      strings: n,
      windStrength: this.windStrength
    };
  }
  setWindStrength(e) {
    this.windStrength = Math.max(0, e);
  }
  setBarMotion(e) {
    e.swayAmp !== void 0 && (this.swayAmp = Math.max(0, e.swayAmp)), e.swayRate !== void 0 && (this.swayRate = Math.max(0, e.swayRate)), e.upDownAmp !== void 0 && (this.upDownAmp = Math.max(0, e.upDownAmp)), e.upDownRate !== void 0 && (this.upDownRate = Math.max(0, e.upDownRate));
  }
  applyExternalPose(e, n) {
    const r = this.lookupBody(e);
    r && (n.position && n.position.length === 3 && r.position.set(n.position[0], n.position[1], n.position[2]), n.quaternion && n.quaternion.length === 4 && r.quaternion.set(n.quaternion[0], n.quaternion[1], n.quaternion[2], n.quaternion[3]), n.velocity && n.velocity.length === 3 && r.velocity.set(n.velocity[0], n.velocity[1], n.velocity[2]), n.angularVelocity && n.angularVelocity.length === 3 && r.angularVelocity.set(n.angularVelocity[0], n.angularVelocity[1], n.angularVelocity[2]));
  }
  lookupBody(e) {
    switch (e) {
      case "bar":
        return this.barBody;
      case "torso":
        return this.torsoBody;
      case "head":
        return this.headBody;
      case "handL":
        return this.handLBody;
      case "handR":
        return this.handRBody;
      case "footL":
        return this.footLBody;
      case "footR":
        return this.footRBody;
      default:
        return null;
    }
  }
}
class cv {
  constructor() {
    ie(this, "rig");
    ie(this, "timeSeconds", 0);
    ie(this, "windStrength", 1);
    ie(this, "externalScene", null);
    ie(this, "barMotion", {
      swayAmp: 2,
      swayRate: 0.7,
      upDownAmp: 0.5,
      upDownRate: 0.9
    });
    this.rig = new av();
  }
  step(e) {
    if (e <= 0) return;
    const n = Math.min(e, 1 / 30);
    this.timeSeconds += n, this.rig.setBarMotion(this.barMotion), this.rig.step(n, this.timeSeconds);
  }
  snapshot() {
    return {
      time: this.timeSeconds,
      puppet: this.rig.snapshot()
    };
  }
  setWindStrength(e) {
    this.windStrength = Math.max(0, e), this.rig.setWindStrength(this.windStrength);
  }
  setBarMotion(e) {
    this.barMotion = {
      ...this.barMotion,
      ...e
    };
  }
  // Load an externally provided scene/state blob (backplane) for future use.
  loadExternalScene(e) {
    this.externalScene = e;
    const n = e, r = (n == null ? void 0 : n.objects) ?? [], i = (n == null ? void 0 : n.bodies) ?? [], o = (s) => {
      for (const l of s) {
        if (!(l != null && l.id)) continue;
        const u = l.transform || l;
        this.rig.applyExternalPose(l.id, {
          position: u.position,
          quaternion: u.quaternion,
          velocity: u.velocity,
          angularVelocity: u.angularVelocity
        });
      }
    };
    o(r), o(i);
  }
}
const ka = 40, ts = 60, dv = Math.atan(1 / Math.sqrt(2)), Sn = { x: 0, y: 5, z: 0 }, fv = ({ snapshot: t }) => {
  const { puppet: e } = t, [n, r] = Ot.useState(Math.PI / 4), [i, o] = Ot.useState(1), s = Ot.useRef(!1), l = Ot.useRef(0), u = 480, a = 320, h = u / a, p = {
    x: ts * Math.cos(n),
    y: ts * Math.sin(dv),
    z: ts * Math.sin(n)
  }, c = Math.hypot(
    Sn.x - p.x,
    Sn.y - p.y,
    Sn.z - p.z
  ), y = {
    x: (Sn.x - p.x) / c,
    y: (Sn.y - p.y) / c,
    z: (Sn.z - p.z) / c
  }, v = { x: 0, y: 1, z: 0 }, w = {
    x: y.y * v.z - y.z * v.y,
    y: y.z * v.x - y.x * v.z,
    z: y.x * v.y - y.y * v.x
  }, S = Math.hypot(w.x, w.y, w.z) || 1, m = {
    x: w.x / S,
    y: w.y / S,
    z: w.z / S
  }, d = {
    x: m.y * y.z - m.z * y.y,
    y: m.z * y.x - m.x * y.z,
    z: m.x * y.y - m.y * y.x
  }, g = Math.hypot(d.x, d.y, d.z) || 1, x = {
    x: d.x / g,
    y: d.y / g,
    z: d.z / g
  }, E = (H) => {
    const Qe = H.x - p.x, Mt = H.y - p.y, Zr = H.z - p.z, ef = Qe * m.x + Mt * m.y + Zr * m.z, tf = Qe * x.x + Mt * x.y + Zr * x.z, nf = ka / 2 / i, rf = ka * h / 2 / i, of = ef / rf, sf = tf / nf, lf = (of * 0.5 + 0.5) * u, uf = (1 - (sf * 0.5 + 0.5)) * a;
    return { x: lf, y: uf };
  }, z = (H) => {
    s.current = !0, l.current = H.clientX, H.currentTarget.setPointerCapture(H.pointerId);
  }, C = (H) => {
    if (!s.current) return;
    const Qe = H.clientX - l.current;
    l.current = H.clientX, r((Mt) => Mt + Qe * 3e-3);
  }, k = (H) => {
    s.current = !1;
    try {
      H.currentTarget.releasePointerCapture(H.pointerId);
    } catch {
    }
  }, O = (H) => {
    H.preventDefault();
    const Qe = H.deltaY > 0 ? 0.9 : 1.1;
    o((Mt) => {
      const Zr = Mt * Qe;
      return Math.max(0.5, Math.min(3, Zr));
    });
  }, M = [
    { x: -15, y: 0, z: 10 },
    { x: 15, y: 0, z: 10 },
    { x: 15, y: 0, z: -10 },
    { x: -15, y: 0, z: -10 }
  ], D = [
    { x: -15, y: 0, z: -10 },
    { x: 15, y: 0, z: -10 },
    { x: 15, y: 20, z: -10 },
    { x: -15, y: 20, z: -10 }
  ], V = [
    { x: -15, y: 0, z: 10 },
    { x: -15, y: 0, z: -10 },
    { x: -15, y: 20, z: -10 },
    { x: -15, y: 20, z: 10 }
  ], N = [
    { x: 15, y: 0, z: -10 },
    { x: 15, y: 0, z: 10 },
    { x: 15, y: 20, z: 10 },
    { x: 15, y: 20, z: -10 }
  ], B = [
    { x: 15, y: 0, z: -4 },
    { x: 15, y: 0, z: -1 },
    { x: 15, y: 8, z: -1 },
    { x: 15, y: 8, z: -4 }
  ], L = M.map(E), P = D.map(E), Y = V.map(E), _ = N.map(E), R = B.map(E), W = L.map((H) => `${H.x},${H.y}`).join(" "), q = P.map((H) => `${H.x},${H.y}`).join(" "), F = Y.map((H) => `${H.x},${H.y}`).join(" "), Ae = _.map((H) => `${H.x},${H.y}`).join(" "), Ne = R.map((H) => `${H.x},${H.y}`).join(" "), ot = E({
    x: e.torso.position.x,
    y: e.torso.position.y,
    z: e.torso.position.z ?? 0
  }), Pe = E({
    x: e.head.position.x,
    y: e.head.position.y,
    z: e.head.position.z ?? 0
  }), st = E({
    x: e.handL.position.x,
    y: e.handL.position.y,
    z: e.handL.position.z ?? 0
  }), Xl = E({
    x: e.handR.position.x,
    y: e.handR.position.y,
    z: e.handR.position.z ?? 0
  });
  E({
    x: e.footL.position.x,
    y: e.footL.position.y,
    z: e.footL.position.z ?? 0
  }), E({
    x: e.footR.position.x,
    y: e.footR.position.y,
    z: e.footR.position.z ?? 0
  });
  const Xr = E({
    x: e.footL.position.x,
    y: 0,
    z: e.footL.position.z ?? 0
  }), Qr = E({
    x: e.footR.position.x,
    y: 0,
    z: e.footR.position.z ?? 0
  }), Kr = E({
    x: e.bar.position.x,
    y: e.bar.position.y,
    z: e.bar.position.z ?? 0
  }), Kd = (e.strings ?? []).map(({ a: H, b: Qe }) => ({
    a: E(H),
    b: E(Qe)
  })), Ql = 24, Kl = 40, Zd = 10, Jd = ot.y - Kl / 2, bd = ot.x - Ql / 2;
  return /* @__PURE__ */ he.jsxs(
    "svg",
    {
      "data-teatro-puppet-rig": "live",
      role: "img",
      "aria-label": "Moving Teatro puppet suspended from a controller with articulated limbs and strings",
      viewBox: `0 0 ${u} ${a}`,
      width: "100%",
      height: "100%",
      style: { display: "block", cursor: "grab" },
      onPointerDown: z,
      onPointerMove: C,
      onPointerUp: k,
      onPointerLeave: k,
      onWheel: O,
      children: [
        /* @__PURE__ */ he.jsx("rect", { x: 0, y: 0, width: u, height: a, fill: "#f3efe7" }),
        /* @__PURE__ */ he.jsx(
          "polygon",
          {
            points: W,
            fill: "#f3efe7",
            stroke: "#111111",
            strokeWidth: 1
          }
        ),
        /* @__PURE__ */ he.jsx(
          "polygon",
          {
            points: F,
            fill: "#f3efe7",
            stroke: "#111111",
            strokeWidth: 1
          }
        ),
        /* @__PURE__ */ he.jsx(
          "polygon",
          {
            points: Ae,
            fill: "#f3efe7",
            stroke: "#111111",
            strokeWidth: 1
          }
        ),
        /* @__PURE__ */ he.jsx(
          "polygon",
          {
            points: q,
            fill: "#f3efe7",
            stroke: "#111111",
            strokeWidth: 1
          }
        ),
        /* @__PURE__ */ he.jsx(
          "polygon",
          {
            points: Ne,
            fill: "#f3efe7",
            stroke: "#111111",
            strokeWidth: 1
          }
        ),
        Kd.map(({ a: H, b: Qe }, Mt) => /* @__PURE__ */ he.jsx(
          "line",
          {
            x1: H.x,
            y1: H.y,
            x2: Qe.x,
            y2: Qe.y,
            stroke: "#817669",
            strokeWidth: 0.9
          },
          Mt
        )),
        /* @__PURE__ */ he.jsx(
          "line",
          {
            x1: Kr.x - 36,
            y1: Kr.y,
            x2: Kr.x + 36,
            y2: Kr.y,
            stroke: "#292623",
            strokeWidth: 2.8,
            strokeLinecap: "square"
          }
        ),
        /* @__PURE__ */ he.jsx(
          "rect",
          {
            x: bd,
            y: Jd,
            width: Ql,
            height: Kl,
            fill: "#f3efe7",
            stroke: "#111111",
            strokeWidth: 1
          }
        ),
        /* @__PURE__ */ he.jsx(
          "circle",
          {
            cx: Pe.x,
            cy: Pe.y,
            r: Zd,
            fill: "#f3efe7",
            stroke: "#111111",
            strokeWidth: 1
          }
        ),
        /* @__PURE__ */ he.jsx(
          "circle",
          {
            cx: st.x,
            cy: st.y,
            r: 4,
            fill: "#f3efe7",
            stroke: "#111111",
            strokeWidth: 1
          }
        ),
        /* @__PURE__ */ he.jsx(
          "circle",
          {
            cx: Xl.x,
            cy: Xl.y,
            r: 4,
            fill: "#f3efe7",
            stroke: "#111111",
            strokeWidth: 1
          }
        ),
        /* @__PURE__ */ he.jsx(
          "rect",
          {
            x: Xr.x - 6,
            y: Xr.y - 6,
            width: 12,
            height: 6,
            fill: "#f3efe7",
            stroke: "#111111",
            strokeWidth: 1
          }
        ),
        /* @__PURE__ */ he.jsx(
          "rect",
          {
            x: Qr.x - 6,
            y: Qr.y - 6,
            width: 12,
            height: 6,
            fill: "#f3efe7",
            stroke: "#111111",
            strokeWidth: 1
          }
        ),
        /* @__PURE__ */ he.jsx(
          "ellipse",
          {
            cx: (Xr.x + Qr.x) / 2,
            cy: Math.max(Xr.y, Qr.y) + 8,
            rx: 40,
            ry: 10,
            fill: "#f3efe7"
          }
        )
      ]
    }
  );
};
function hv({ engine: t }) {
  const [e, n] = Ot.useState(() => t.snapshot());
  return Ot.useEffect(() => {
    let r = 0, i = performance.now(), o = 0, s = !0;
    const l = (u) => {
      if (!s) return;
      const a = Math.min(0.05, Math.max(0, (u - i) / 1e3));
      i = u, !document.hidden && u - o >= 32 && (t.step(a), n(t.snapshot()), o = u), r = requestAnimationFrame(l);
    };
    return r = requestAnimationFrame(l), () => {
      s = !1, cancelAnimationFrame(r);
    };
  }, [t]), /* @__PURE__ */ he.jsx(fv, { snapshot: e });
}
const pv = "teatro-stage-scene";
let Fn = null, ln = null, ns = 0, Qs = null;
function Qd() {
  Fn == null || Fn.unmount(), Fn = null, ln == null || ln.remove(), ln = null, document.documentElement.dataset.teatroPuppetFallback = "inactive";
}
function mv() {
  Qs = null;
  const t = document.getElementById(pv), e = t == null ? void 0 : t.querySelector(":scope > svg[aria-label^='Empty isometric Teatro stage']"), n = !!(t != null && t.querySelector("canvas"));
  if (!t || !e || n) {
    ln && Qd();
    return;
  }
  if (ln) return;
  if (ns || (ns = performance.now()), performance.now() - ns < 450) {
    Yl();
    return;
  }
  t.style.position = "relative";
  const r = document.createElement("div");
  r.dataset.teatroFallbackPuppet = "active", r.style.cssText = "position:absolute;inset:0;overflow:hidden;background:#f3efe7;touch-action:none", t.append(r);
  const i = new cv();
  i.setWindStrength(0.6), i.setBarMotion({ swayAmp: 2, swayRate: 0.7, upDownAmp: 0.5, upDownRate: 0.9 }), Fn = jd(r), Fn.render(/* @__PURE__ */ he.jsx(hv, { engine: i })), ln = r, document.documentElement.dataset.teatroPuppetFallback = "active";
}
function Yl() {
  Qs === null && (Qs = window.setTimeout(mv, 80));
}
const yv = new MutationObserver(Yl);
yv.observe(document.documentElement, { childList: !0, subtree: !0 });
window.addEventListener("pagehide", Qd);
Yl();
