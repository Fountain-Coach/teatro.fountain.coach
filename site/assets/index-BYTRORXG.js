var H0=Object.defineProperty;var G0=(n,e,t)=>e in n?H0(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var gt=(n,e,t)=>G0(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function V0(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Bm={exports:{}},Kl={},km={exports:{}},ze={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var na=Symbol.for("react.element"),W0=Symbol.for("react.portal"),X0=Symbol.for("react.fragment"),q0=Symbol.for("react.strict_mode"),j0=Symbol.for("react.profiler"),Y0=Symbol.for("react.provider"),$0=Symbol.for("react.context"),K0=Symbol.for("react.forward_ref"),Z0=Symbol.for("react.suspense"),Q0=Symbol.for("react.memo"),J0=Symbol.for("react.lazy"),Hf=Symbol.iterator;function e_(n){return n===null||typeof n!="object"?null:(n=Hf&&n[Hf]||n["@@iterator"],typeof n=="function"?n:null)}var Hm={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Gm=Object.assign,Vm={};function $s(n,e,t){this.props=n,this.context=e,this.refs=Vm,this.updater=t||Hm}$s.prototype.isReactComponent={};$s.prototype.setState=function(n,e){if(typeof n!="object"&&typeof n!="function"&&n!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,n,e,"setState")};$s.prototype.forceUpdate=function(n){this.updater.enqueueForceUpdate(this,n,"forceUpdate")};function Wm(){}Wm.prototype=$s.prototype;function Fd(n,e,t){this.props=n,this.context=e,this.refs=Vm,this.updater=t||Hm}var zd=Fd.prototype=new Wm;zd.constructor=Fd;Gm(zd,$s.prototype);zd.isPureReactComponent=!0;var Gf=Array.isArray,Xm=Object.prototype.hasOwnProperty,Od={current:null},qm={key:!0,ref:!0,__self:!0,__source:!0};function jm(n,e,t){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)Xm.call(e,i)&&!qm.hasOwnProperty(i)&&(r[i]=e[i]);var a=arguments.length-2;if(a===1)r.children=t;else if(1<a){for(var l=Array(a),c=0;c<a;c++)l[c]=arguments[c+2];r.children=l}if(n&&n.defaultProps)for(i in a=n.defaultProps,a)r[i]===void 0&&(r[i]=a[i]);return{$$typeof:na,type:n,key:s,ref:o,props:r,_owner:Od.current}}function t_(n,e){return{$$typeof:na,type:n.type,key:e,ref:n.ref,props:n.props,_owner:n._owner}}function Bd(n){return typeof n=="object"&&n!==null&&n.$$typeof===na}function n_(n){var e={"=":"=0",":":"=2"};return"$"+n.replace(/[=:]/g,function(t){return e[t]})}var Vf=/\/+/g;function Mc(n,e){return typeof n=="object"&&n!==null&&n.key!=null?n_(""+n.key):e.toString(36)}function cl(n,e,t,i,r){var s=typeof n;(s==="undefined"||s==="boolean")&&(n=null);var o=!1;if(n===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(n.$$typeof){case na:case W0:o=!0}}if(o)return o=n,r=r(o),n=i===""?"."+Mc(o,0):i,Gf(r)?(t="",n!=null&&(t=n.replace(Vf,"$&/")+"/"),cl(r,e,t,"",function(c){return c})):r!=null&&(Bd(r)&&(r=t_(r,t+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(Vf,"$&/")+"/")+n)),e.push(r)),1;if(o=0,i=i===""?".":i+":",Gf(n))for(var a=0;a<n.length;a++){s=n[a];var l=i+Mc(s,a);o+=cl(s,e,t,l,r)}else if(l=e_(n),typeof l=="function")for(n=l.call(n),a=0;!(s=n.next()).done;)s=s.value,l=i+Mc(s,a++),o+=cl(s,e,t,l,r);else if(s==="object")throw e=String(n),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function pa(n,e,t){if(n==null)return n;var i=[],r=0;return cl(n,i,"","",function(s){return e.call(t,s,r++)}),i}function i_(n){if(n._status===-1){var e=n._result;e=e(),e.then(function(t){(n._status===0||n._status===-1)&&(n._status=1,n._result=t)},function(t){(n._status===0||n._status===-1)&&(n._status=2,n._result=t)}),n._status===-1&&(n._status=0,n._result=e)}if(n._status===1)return n._result.default;throw n._result}var Kt={current:null},ul={transition:null},r_={ReactCurrentDispatcher:Kt,ReactCurrentBatchConfig:ul,ReactCurrentOwner:Od};function Ym(){throw Error("act(...) is not supported in production builds of React.")}ze.Children={map:pa,forEach:function(n,e,t){pa(n,function(){e.apply(this,arguments)},t)},count:function(n){var e=0;return pa(n,function(){e++}),e},toArray:function(n){return pa(n,function(e){return e})||[]},only:function(n){if(!Bd(n))throw Error("React.Children.only expected to receive a single React element child.");return n}};ze.Component=$s;ze.Fragment=X0;ze.Profiler=j0;ze.PureComponent=Fd;ze.StrictMode=q0;ze.Suspense=Z0;ze.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=r_;ze.act=Ym;ze.cloneElement=function(n,e,t){if(n==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+n+".");var i=Gm({},n.props),r=n.key,s=n.ref,o=n._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=Od.current),e.key!==void 0&&(r=""+e.key),n.type&&n.type.defaultProps)var a=n.type.defaultProps;for(l in e)Xm.call(e,l)&&!qm.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=t;else if(1<l){a=Array(l);for(var c=0;c<l;c++)a[c]=arguments[c+2];i.children=a}return{$$typeof:na,type:n.type,key:r,ref:s,props:i,_owner:o}};ze.createContext=function(n){return n={$$typeof:$0,_currentValue:n,_currentValue2:n,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},n.Provider={$$typeof:Y0,_context:n},n.Consumer=n};ze.createElement=jm;ze.createFactory=function(n){var e=jm.bind(null,n);return e.type=n,e};ze.createRef=function(){return{current:null}};ze.forwardRef=function(n){return{$$typeof:K0,render:n}};ze.isValidElement=Bd;ze.lazy=function(n){return{$$typeof:J0,_payload:{_status:-1,_result:n},_init:i_}};ze.memo=function(n,e){return{$$typeof:Q0,type:n,compare:e===void 0?null:e}};ze.startTransition=function(n){var e=ul.transition;ul.transition={};try{n()}finally{ul.transition=e}};ze.unstable_act=Ym;ze.useCallback=function(n,e){return Kt.current.useCallback(n,e)};ze.useContext=function(n){return Kt.current.useContext(n)};ze.useDebugValue=function(){};ze.useDeferredValue=function(n){return Kt.current.useDeferredValue(n)};ze.useEffect=function(n,e){return Kt.current.useEffect(n,e)};ze.useId=function(){return Kt.current.useId()};ze.useImperativeHandle=function(n,e,t){return Kt.current.useImperativeHandle(n,e,t)};ze.useInsertionEffect=function(n,e){return Kt.current.useInsertionEffect(n,e)};ze.useLayoutEffect=function(n,e){return Kt.current.useLayoutEffect(n,e)};ze.useMemo=function(n,e){return Kt.current.useMemo(n,e)};ze.useReducer=function(n,e,t){return Kt.current.useReducer(n,e,t)};ze.useRef=function(n){return Kt.current.useRef(n)};ze.useState=function(n){return Kt.current.useState(n)};ze.useSyncExternalStore=function(n,e,t){return Kt.current.useSyncExternalStore(n,e,t)};ze.useTransition=function(){return Kt.current.useTransition()};ze.version="18.3.1";km.exports=ze;var Ne=km.exports;const s_=V0(Ne);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var o_=Ne,a_=Symbol.for("react.element"),l_=Symbol.for("react.fragment"),c_=Object.prototype.hasOwnProperty,u_=o_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,d_={key:!0,ref:!0,__self:!0,__source:!0};function $m(n,e,t){var i,r={},s=null,o=null;t!==void 0&&(s=""+t),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)c_.call(e,i)&&!d_.hasOwnProperty(i)&&(r[i]=e[i]);if(n&&n.defaultProps)for(i in e=n.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:a_,type:n,key:s,ref:o,props:r,_owner:u_.current}}Kl.Fragment=l_;Kl.jsx=$m;Kl.jsxs=$m;Bm.exports=Kl;var dt=Bm.exports,Uu={},Km={exports:{}},Mn={},Zm={exports:{}},Qm={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(n){function e(I,B){var W=I.length;I.push(B);e:for(;0<W;){var ee=W-1>>>1,q=I[ee];if(0<r(q,B))I[ee]=B,I[W]=q,W=ee;else break e}}function t(I){return I.length===0?null:I[0]}function i(I){if(I.length===0)return null;var B=I[0],W=I.pop();if(W!==B){I[0]=W;e:for(var ee=0,q=I.length,H=q>>>1;ee<H;){var Y=2*(ee+1)-1,re=I[Y],oe=Y+1,F=I[oe];if(0>r(re,W))oe<q&&0>r(F,re)?(I[ee]=F,I[oe]=W,ee=oe):(I[ee]=re,I[Y]=W,ee=Y);else if(oe<q&&0>r(F,W))I[ee]=F,I[oe]=W,ee=oe;else break e}}return B}function r(I,B){var W=I.sortIndex-B.sortIndex;return W!==0?W:I.id-B.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;n.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();n.unstable_now=function(){return o.now()-a}}var l=[],c=[],d=1,h=null,u=3,p=!1,v=!1,_=!1,g=typeof setTimeout=="function"?setTimeout:null,f=typeof clearTimeout=="function"?clearTimeout:null,m=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function y(I){for(var B=t(c);B!==null;){if(B.callback===null)i(c);else if(B.startTime<=I)i(c),B.sortIndex=B.expirationTime,e(l,B);else break;B=t(c)}}function x(I){if(_=!1,y(I),!v)if(t(l)!==null)v=!0,U(M);else{var B=t(c);B!==null&&X(x,B.startTime-I)}}function M(I,B){v=!1,_&&(_=!1,f(D),D=-1),p=!0;var W=u;try{for(y(B),h=t(l);h!==null&&(!(h.expirationTime>B)||I&&!V());){var ee=h.callback;if(typeof ee=="function"){h.callback=null,u=h.priorityLevel;var q=ee(h.expirationTime<=B);B=n.unstable_now(),typeof q=="function"?h.callback=q:h===t(l)&&i(l),y(B)}else i(l);h=t(l)}if(h!==null)var H=!0;else{var Y=t(c);Y!==null&&X(x,Y.startTime-B),H=!1}return H}finally{h=null,u=W,p=!1}}var w=!1,R=null,D=-1,E=5,T=-1;function V(){return!(n.unstable_now()-T<E)}function O(){if(R!==null){var I=n.unstable_now();T=I;var B=!0;try{B=R(!0,I)}finally{B?C():(w=!1,R=null)}}else w=!1}var C;if(typeof m=="function")C=function(){m(O)};else if(typeof MessageChannel<"u"){var P=new MessageChannel,N=P.port2;P.port1.onmessage=O,C=function(){N.postMessage(null)}}else C=function(){g(O,0)};function U(I){R=I,w||(w=!0,C())}function X(I,B){D=g(function(){I(n.unstable_now())},B)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(I){I.callback=null},n.unstable_continueExecution=function(){v||p||(v=!0,U(M))},n.unstable_forceFrameRate=function(I){0>I||125<I?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):E=0<I?Math.floor(1e3/I):5},n.unstable_getCurrentPriorityLevel=function(){return u},n.unstable_getFirstCallbackNode=function(){return t(l)},n.unstable_next=function(I){switch(u){case 1:case 2:case 3:var B=3;break;default:B=u}var W=u;u=B;try{return I()}finally{u=W}},n.unstable_pauseExecution=function(){},n.unstable_requestPaint=function(){},n.unstable_runWithPriority=function(I,B){switch(I){case 1:case 2:case 3:case 4:case 5:break;default:I=3}var W=u;u=I;try{return B()}finally{u=W}},n.unstable_scheduleCallback=function(I,B,W){var ee=n.unstable_now();switch(typeof W=="object"&&W!==null?(W=W.delay,W=typeof W=="number"&&0<W?ee+W:ee):W=ee,I){case 1:var q=-1;break;case 2:q=250;break;case 5:q=1073741823;break;case 4:q=1e4;break;default:q=5e3}return q=W+q,I={id:d++,callback:B,priorityLevel:I,startTime:W,expirationTime:q,sortIndex:-1},W>ee?(I.sortIndex=W,e(c,I),t(l)===null&&I===t(c)&&(_?(f(D),D=-1):_=!0,X(x,W-ee))):(I.sortIndex=q,e(l,I),v||p||(v=!0,U(M))),I},n.unstable_shouldYield=V,n.unstable_wrapCallback=function(I){var B=u;return function(){var W=u;u=B;try{return I.apply(this,arguments)}finally{u=W}}}})(Qm);Zm.exports=Qm;var f_=Zm.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var h_=Ne,Sn=f_;function ne(n){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+n,t=1;t<arguments.length;t++)e+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+n+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Jm=new Set,zo={};function qr(n,e){Os(n,e),Os(n+"Capture",e)}function Os(n,e){for(zo[n]=e,n=0;n<e.length;n++)Jm.add(e[n])}var Di=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Fu=Object.prototype.hasOwnProperty,p_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Wf={},Xf={};function m_(n){return Fu.call(Xf,n)?!0:Fu.call(Wf,n)?!1:p_.test(n)?Xf[n]=!0:(Wf[n]=!0,!1)}function g_(n,e,t,i){if(t!==null&&t.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:t!==null?!t.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function v_(n,e,t,i){if(e===null||typeof e>"u"||g_(n,e,t,i))return!0;if(i)return!1;if(t!==null)switch(t.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function Zt(n,e,t,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=t,this.propertyName=n,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Ft={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){Ft[n]=new Zt(n,0,!1,n,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var e=n[0];Ft[e]=new Zt(e,1,!1,n[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(n){Ft[n]=new Zt(n,2,!1,n.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){Ft[n]=new Zt(n,2,!1,n,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){Ft[n]=new Zt(n,3,!1,n.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(n){Ft[n]=new Zt(n,3,!0,n,null,!1,!1)});["capture","download"].forEach(function(n){Ft[n]=new Zt(n,4,!1,n,null,!1,!1)});["cols","rows","size","span"].forEach(function(n){Ft[n]=new Zt(n,6,!1,n,null,!1,!1)});["rowSpan","start"].forEach(function(n){Ft[n]=new Zt(n,5,!1,n.toLowerCase(),null,!1,!1)});var kd=/[\-:]([a-z])/g;function Hd(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var e=n.replace(kd,Hd);Ft[e]=new Zt(e,1,!1,n,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var e=n.replace(kd,Hd);Ft[e]=new Zt(e,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(n){var e=n.replace(kd,Hd);Ft[e]=new Zt(e,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(n){Ft[n]=new Zt(n,1,!1,n.toLowerCase(),null,!1,!1)});Ft.xlinkHref=new Zt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(n){Ft[n]=new Zt(n,1,!1,n.toLowerCase(),null,!0,!0)});function Gd(n,e,t,i){var r=Ft.hasOwnProperty(e)?Ft[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(v_(e,t,r,i)&&(t=null),i||r===null?m_(e)&&(t===null?n.removeAttribute(e):n.setAttribute(e,""+t)):r.mustUseProperty?n[r.propertyName]=t===null?r.type===3?!1:"":t:(e=r.attributeName,i=r.attributeNamespace,t===null?n.removeAttribute(e):(r=r.type,t=r===3||r===4&&t===!0?"":""+t,i?n.setAttributeNS(i,e,t):n.setAttribute(e,t))))}var Fi=h_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ma=Symbol.for("react.element"),gs=Symbol.for("react.portal"),vs=Symbol.for("react.fragment"),Vd=Symbol.for("react.strict_mode"),zu=Symbol.for("react.profiler"),eg=Symbol.for("react.provider"),tg=Symbol.for("react.context"),Wd=Symbol.for("react.forward_ref"),Ou=Symbol.for("react.suspense"),Bu=Symbol.for("react.suspense_list"),Xd=Symbol.for("react.memo"),qi=Symbol.for("react.lazy"),ng=Symbol.for("react.offscreen"),qf=Symbol.iterator;function to(n){return n===null||typeof n!="object"?null:(n=qf&&n[qf]||n["@@iterator"],typeof n=="function"?n:null)}var at=Object.assign,Ec;function _o(n){if(Ec===void 0)try{throw Error()}catch(t){var e=t.stack.trim().match(/\n( *(at )?)/);Ec=e&&e[1]||""}return`
`+Ec+n}var wc=!1;function Tc(n,e){if(!n||wc)return"";wc=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(n,[],e)}else{try{e.call()}catch(c){i=c}n.call(e.prototype)}else{try{throw Error()}catch(c){i=c}n()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,a=s.length-1;1<=o&&0<=a&&r[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==s[a]){var l=`
`+r[o].replace(" at new "," at ");return n.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",n.displayName)),l}while(1<=o&&0<=a);break}}}finally{wc=!1,Error.prepareStackTrace=t}return(n=n?n.displayName||n.name:"")?_o(n):""}function __(n){switch(n.tag){case 5:return _o(n.type);case 16:return _o("Lazy");case 13:return _o("Suspense");case 19:return _o("SuspenseList");case 0:case 2:case 15:return n=Tc(n.type,!1),n;case 11:return n=Tc(n.type.render,!1),n;case 1:return n=Tc(n.type,!0),n;default:return""}}function ku(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case vs:return"Fragment";case gs:return"Portal";case zu:return"Profiler";case Vd:return"StrictMode";case Ou:return"Suspense";case Bu:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case tg:return(n.displayName||"Context")+".Consumer";case eg:return(n._context.displayName||"Context")+".Provider";case Wd:var e=n.render;return n=n.displayName,n||(n=e.displayName||e.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Xd:return e=n.displayName||null,e!==null?e:ku(n.type)||"Memo";case qi:e=n._payload,n=n._init;try{return ku(n(e))}catch{}}return null}function y_(n){var e=n.type;switch(n.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=e.render,n=n.displayName||n.name||"",e.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ku(e);case 8:return e===Vd?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function ar(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function ig(n){var e=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function x_(n){var e=ig(n)?"checked":"value",t=Object.getOwnPropertyDescriptor(n.constructor.prototype,e),i=""+n[e];if(!n.hasOwnProperty(e)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var r=t.get,s=t.set;return Object.defineProperty(n,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(n,e,{enumerable:t.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){n._valueTracker=null,delete n[e]}}}}function ga(n){n._valueTracker||(n._valueTracker=x_(n))}function rg(n){if(!n)return!1;var e=n._valueTracker;if(!e)return!0;var t=e.getValue(),i="";return n&&(i=ig(n)?n.checked?"true":"false":n.value),n=i,n!==t?(e.setValue(n),!0):!1}function wl(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Hu(n,e){var t=e.checked;return at({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??n._wrapperState.initialChecked})}function jf(n,e){var t=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;t=ar(e.value!=null?e.value:t),n._wrapperState={initialChecked:i,initialValue:t,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function sg(n,e){e=e.checked,e!=null&&Gd(n,"checked",e,!1)}function Gu(n,e){sg(n,e);var t=ar(e.value),i=e.type;if(t!=null)i==="number"?(t===0&&n.value===""||n.value!=t)&&(n.value=""+t):n.value!==""+t&&(n.value=""+t);else if(i==="submit"||i==="reset"){n.removeAttribute("value");return}e.hasOwnProperty("value")?Vu(n,e.type,t):e.hasOwnProperty("defaultValue")&&Vu(n,e.type,ar(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(n.defaultChecked=!!e.defaultChecked)}function Yf(n,e,t){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+n._wrapperState.initialValue,t||e===n.value||(n.value=e),n.defaultValue=e}t=n.name,t!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,t!==""&&(n.name=t)}function Vu(n,e,t){(e!=="number"||wl(n.ownerDocument)!==n)&&(t==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+t&&(n.defaultValue=""+t))}var yo=Array.isArray;function bs(n,e,t,i){if(n=n.options,e){e={};for(var r=0;r<t.length;r++)e["$"+t[r]]=!0;for(t=0;t<n.length;t++)r=e.hasOwnProperty("$"+n[t].value),n[t].selected!==r&&(n[t].selected=r),r&&i&&(n[t].defaultSelected=!0)}else{for(t=""+ar(t),e=null,r=0;r<n.length;r++){if(n[r].value===t){n[r].selected=!0,i&&(n[r].defaultSelected=!0);return}e!==null||n[r].disabled||(e=n[r])}e!==null&&(e.selected=!0)}}function Wu(n,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ne(91));return at({},e,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function $f(n,e){var t=e.value;if(t==null){if(t=e.children,e=e.defaultValue,t!=null){if(e!=null)throw Error(ne(92));if(yo(t)){if(1<t.length)throw Error(ne(93));t=t[0]}e=t}e==null&&(e=""),t=e}n._wrapperState={initialValue:ar(t)}}function og(n,e){var t=ar(e.value),i=ar(e.defaultValue);t!=null&&(t=""+t,t!==n.value&&(n.value=t),e.defaultValue==null&&n.defaultValue!==t&&(n.defaultValue=t)),i!=null&&(n.defaultValue=""+i)}function Kf(n){var e=n.textContent;e===n._wrapperState.initialValue&&e!==""&&e!==null&&(n.value=e)}function ag(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Xu(n,e){return n==null||n==="http://www.w3.org/1999/xhtml"?ag(e):n==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var va,lg=function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,t,i,r){MSApp.execUnsafeLocalFunction(function(){return n(e,t,i,r)})}:n}(function(n,e){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=e;else{for(va=va||document.createElement("div"),va.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=va.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;e.firstChild;)n.appendChild(e.firstChild)}});function Oo(n,e){if(e){var t=n.firstChild;if(t&&t===n.lastChild&&t.nodeType===3){t.nodeValue=e;return}}n.textContent=e}var To={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},S_=["Webkit","ms","Moz","O"];Object.keys(To).forEach(function(n){S_.forEach(function(e){e=e+n.charAt(0).toUpperCase()+n.substring(1),To[e]=To[n]})});function cg(n,e,t){return e==null||typeof e=="boolean"||e===""?"":t||typeof e!="number"||e===0||To.hasOwnProperty(n)&&To[n]?(""+e).trim():e+"px"}function ug(n,e){n=n.style;for(var t in e)if(e.hasOwnProperty(t)){var i=t.indexOf("--")===0,r=cg(t,e[t],i);t==="float"&&(t="cssFloat"),i?n.setProperty(t,r):n[t]=r}}var M_=at({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function qu(n,e){if(e){if(M_[n]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ne(137,n));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ne(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ne(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ne(62))}}function ju(n,e){if(n.indexOf("-")===-1)return typeof e.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Yu=null;function qd(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var $u=null,Ls=null,Ps=null;function Zf(n){if(n=sa(n)){if(typeof $u!="function")throw Error(ne(280));var e=n.stateNode;e&&(e=tc(e),$u(n.stateNode,n.type,e))}}function dg(n){Ls?Ps?Ps.push(n):Ps=[n]:Ls=n}function fg(){if(Ls){var n=Ls,e=Ps;if(Ps=Ls=null,Zf(n),e)for(n=0;n<e.length;n++)Zf(e[n])}}function hg(n,e){return n(e)}function pg(){}var Ac=!1;function mg(n,e,t){if(Ac)return n(e,t);Ac=!0;try{return hg(n,e,t)}finally{Ac=!1,(Ls!==null||Ps!==null)&&(pg(),fg())}}function Bo(n,e){var t=n.stateNode;if(t===null)return null;var i=tc(t);if(i===null)return null;t=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(n=n.type,i=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!i;break e;default:n=!1}if(n)return null;if(t&&typeof t!="function")throw Error(ne(231,e,typeof t));return t}var Ku=!1;if(Di)try{var no={};Object.defineProperty(no,"passive",{get:function(){Ku=!0}}),window.addEventListener("test",no,no),window.removeEventListener("test",no,no)}catch{Ku=!1}function E_(n,e,t,i,r,s,o,a,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(t,c)}catch(d){this.onError(d)}}var Ao=!1,Tl=null,Al=!1,Zu=null,w_={onError:function(n){Ao=!0,Tl=n}};function T_(n,e,t,i,r,s,o,a,l){Ao=!1,Tl=null,E_.apply(w_,arguments)}function A_(n,e,t,i,r,s,o,a,l){if(T_.apply(this,arguments),Ao){if(Ao){var c=Tl;Ao=!1,Tl=null}else throw Error(ne(198));Al||(Al=!0,Zu=c)}}function jr(n){var e=n,t=n;if(n.alternate)for(;e.return;)e=e.return;else{n=e;do e=n,e.flags&4098&&(t=e.return),n=e.return;while(n)}return e.tag===3?t:null}function gg(n){if(n.tag===13){var e=n.memoizedState;if(e===null&&(n=n.alternate,n!==null&&(e=n.memoizedState)),e!==null)return e.dehydrated}return null}function Qf(n){if(jr(n)!==n)throw Error(ne(188))}function R_(n){var e=n.alternate;if(!e){if(e=jr(n),e===null)throw Error(ne(188));return e!==n?null:n}for(var t=n,i=e;;){var r=t.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){t=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===t)return Qf(r),n;if(s===i)return Qf(r),e;s=s.sibling}throw Error(ne(188))}if(t.return!==i.return)t=r,i=s;else{for(var o=!1,a=r.child;a;){if(a===t){o=!0,t=r,i=s;break}if(a===i){o=!0,i=r,t=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===t){o=!0,t=s,i=r;break}if(a===i){o=!0,i=s,t=r;break}a=a.sibling}if(!o)throw Error(ne(189))}}if(t.alternate!==i)throw Error(ne(190))}if(t.tag!==3)throw Error(ne(188));return t.stateNode.current===t?n:e}function vg(n){return n=R_(n),n!==null?_g(n):null}function _g(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var e=_g(n);if(e!==null)return e;n=n.sibling}return null}var yg=Sn.unstable_scheduleCallback,Jf=Sn.unstable_cancelCallback,C_=Sn.unstable_shouldYield,b_=Sn.unstable_requestPaint,_t=Sn.unstable_now,L_=Sn.unstable_getCurrentPriorityLevel,jd=Sn.unstable_ImmediatePriority,xg=Sn.unstable_UserBlockingPriority,Rl=Sn.unstable_NormalPriority,P_=Sn.unstable_LowPriority,Sg=Sn.unstable_IdlePriority,Zl=null,ci=null;function D_(n){if(ci&&typeof ci.onCommitFiberRoot=="function")try{ci.onCommitFiberRoot(Zl,n,void 0,(n.current.flags&128)===128)}catch{}}var $n=Math.clz32?Math.clz32:U_,I_=Math.log,N_=Math.LN2;function U_(n){return n>>>=0,n===0?32:31-(I_(n)/N_|0)|0}var _a=64,ya=4194304;function xo(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function Cl(n,e){var t=n.pendingLanes;if(t===0)return 0;var i=0,r=n.suspendedLanes,s=n.pingedLanes,o=t&268435455;if(o!==0){var a=o&~r;a!==0?i=xo(a):(s&=o,s!==0&&(i=xo(s)))}else o=t&~r,o!==0?i=xo(o):s!==0&&(i=xo(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=t&16),e=n.entangledLanes,e!==0)for(n=n.entanglements,e&=i;0<e;)t=31-$n(e),r=1<<t,i|=n[t],e&=~r;return i}function F_(n,e){switch(n){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function z_(n,e){for(var t=n.suspendedLanes,i=n.pingedLanes,r=n.expirationTimes,s=n.pendingLanes;0<s;){var o=31-$n(s),a=1<<o,l=r[o];l===-1?(!(a&t)||a&i)&&(r[o]=F_(a,e)):l<=e&&(n.expiredLanes|=a),s&=~a}}function Qu(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function Mg(){var n=_a;return _a<<=1,!(_a&4194240)&&(_a=64),n}function Rc(n){for(var e=[],t=0;31>t;t++)e.push(n);return e}function ia(n,e,t){n.pendingLanes|=e,e!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,e=31-$n(e),n[e]=t}function O_(n,e){var t=n.pendingLanes&~e;n.pendingLanes=e,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=e,n.mutableReadLanes&=e,n.entangledLanes&=e,e=n.entanglements;var i=n.eventTimes;for(n=n.expirationTimes;0<t;){var r=31-$n(t),s=1<<r;e[r]=0,i[r]=-1,n[r]=-1,t&=~s}}function Yd(n,e){var t=n.entangledLanes|=e;for(n=n.entanglements;t;){var i=31-$n(t),r=1<<i;r&e|n[i]&e&&(n[i]|=e),t&=~r}}var je=0;function Eg(n){return n&=-n,1<n?4<n?n&268435455?16:536870912:4:1}var wg,$d,Tg,Ag,Rg,Ju=!1,xa=[],Qi=null,Ji=null,er=null,ko=new Map,Ho=new Map,Yi=[],B_="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function eh(n,e){switch(n){case"focusin":case"focusout":Qi=null;break;case"dragenter":case"dragleave":Ji=null;break;case"mouseover":case"mouseout":er=null;break;case"pointerover":case"pointerout":ko.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ho.delete(e.pointerId)}}function io(n,e,t,i,r,s){return n===null||n.nativeEvent!==s?(n={blockedOn:e,domEventName:t,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=sa(e),e!==null&&$d(e)),n):(n.eventSystemFlags|=i,e=n.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),n)}function k_(n,e,t,i,r){switch(e){case"focusin":return Qi=io(Qi,n,e,t,i,r),!0;case"dragenter":return Ji=io(Ji,n,e,t,i,r),!0;case"mouseover":return er=io(er,n,e,t,i,r),!0;case"pointerover":var s=r.pointerId;return ko.set(s,io(ko.get(s)||null,n,e,t,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Ho.set(s,io(Ho.get(s)||null,n,e,t,i,r)),!0}return!1}function Cg(n){var e=Rr(n.target);if(e!==null){var t=jr(e);if(t!==null){if(e=t.tag,e===13){if(e=gg(t),e!==null){n.blockedOn=e,Rg(n.priority,function(){Tg(t)});return}}else if(e===3&&t.stateNode.current.memoizedState.isDehydrated){n.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}n.blockedOn=null}function dl(n){if(n.blockedOn!==null)return!1;for(var e=n.targetContainers;0<e.length;){var t=ed(n.domEventName,n.eventSystemFlags,e[0],n.nativeEvent);if(t===null){t=n.nativeEvent;var i=new t.constructor(t.type,t);Yu=i,t.target.dispatchEvent(i),Yu=null}else return e=sa(t),e!==null&&$d(e),n.blockedOn=t,!1;e.shift()}return!0}function th(n,e,t){dl(n)&&t.delete(e)}function H_(){Ju=!1,Qi!==null&&dl(Qi)&&(Qi=null),Ji!==null&&dl(Ji)&&(Ji=null),er!==null&&dl(er)&&(er=null),ko.forEach(th),Ho.forEach(th)}function ro(n,e){n.blockedOn===e&&(n.blockedOn=null,Ju||(Ju=!0,Sn.unstable_scheduleCallback(Sn.unstable_NormalPriority,H_)))}function Go(n){function e(r){return ro(r,n)}if(0<xa.length){ro(xa[0],n);for(var t=1;t<xa.length;t++){var i=xa[t];i.blockedOn===n&&(i.blockedOn=null)}}for(Qi!==null&&ro(Qi,n),Ji!==null&&ro(Ji,n),er!==null&&ro(er,n),ko.forEach(e),Ho.forEach(e),t=0;t<Yi.length;t++)i=Yi[t],i.blockedOn===n&&(i.blockedOn=null);for(;0<Yi.length&&(t=Yi[0],t.blockedOn===null);)Cg(t),t.blockedOn===null&&Yi.shift()}var Ds=Fi.ReactCurrentBatchConfig,bl=!0;function G_(n,e,t,i){var r=je,s=Ds.transition;Ds.transition=null;try{je=1,Kd(n,e,t,i)}finally{je=r,Ds.transition=s}}function V_(n,e,t,i){var r=je,s=Ds.transition;Ds.transition=null;try{je=4,Kd(n,e,t,i)}finally{je=r,Ds.transition=s}}function Kd(n,e,t,i){if(bl){var r=ed(n,e,t,i);if(r===null)zc(n,e,i,Ll,t),eh(n,i);else if(k_(r,n,e,t,i))i.stopPropagation();else if(eh(n,i),e&4&&-1<B_.indexOf(n)){for(;r!==null;){var s=sa(r);if(s!==null&&wg(s),s=ed(n,e,t,i),s===null&&zc(n,e,i,Ll,t),s===r)break;r=s}r!==null&&i.stopPropagation()}else zc(n,e,i,null,t)}}var Ll=null;function ed(n,e,t,i){if(Ll=null,n=qd(i),n=Rr(n),n!==null)if(e=jr(n),e===null)n=null;else if(t=e.tag,t===13){if(n=gg(e),n!==null)return n;n=null}else if(t===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;n=null}else e!==n&&(n=null);return Ll=n,null}function bg(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(L_()){case jd:return 1;case xg:return 4;case Rl:case P_:return 16;case Sg:return 536870912;default:return 16}default:return 16}}var Ki=null,Zd=null,fl=null;function Lg(){if(fl)return fl;var n,e=Zd,t=e.length,i,r="value"in Ki?Ki.value:Ki.textContent,s=r.length;for(n=0;n<t&&e[n]===r[n];n++);var o=t-n;for(i=1;i<=o&&e[t-i]===r[s-i];i++);return fl=r.slice(n,1<i?1-i:void 0)}function hl(n){var e=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&e===13&&(n=13)):n=e,n===10&&(n=13),32<=n||n===13?n:0}function Sa(){return!0}function nh(){return!1}function En(n){function e(t,i,r,s,o){this._reactName=t,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in n)n.hasOwnProperty(a)&&(t=n[a],this[a]=t?t(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Sa:nh,this.isPropagationStopped=nh,this}return at(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=Sa)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=Sa)},persist:function(){},isPersistent:Sa}),e}var Ks={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Qd=En(Ks),ra=at({},Ks,{view:0,detail:0}),W_=En(ra),Cc,bc,so,Ql=at({},ra,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Jd,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==so&&(so&&n.type==="mousemove"?(Cc=n.screenX-so.screenX,bc=n.screenY-so.screenY):bc=Cc=0,so=n),Cc)},movementY:function(n){return"movementY"in n?n.movementY:bc}}),ih=En(Ql),X_=at({},Ql,{dataTransfer:0}),q_=En(X_),j_=at({},ra,{relatedTarget:0}),Lc=En(j_),Y_=at({},Ks,{animationName:0,elapsedTime:0,pseudoElement:0}),$_=En(Y_),K_=at({},Ks,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Z_=En(K_),Q_=at({},Ks,{data:0}),rh=En(Q_),J_={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},ey={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},ty={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function ny(n){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(n):(n=ty[n])?!!e[n]:!1}function Jd(){return ny}var iy=at({},ra,{key:function(n){if(n.key){var e=J_[n.key]||n.key;if(e!=="Unidentified")return e}return n.type==="keypress"?(n=hl(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?ey[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Jd,charCode:function(n){return n.type==="keypress"?hl(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?hl(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),ry=En(iy),sy=at({},Ql,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),sh=En(sy),oy=at({},ra,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Jd}),ay=En(oy),ly=at({},Ks,{propertyName:0,elapsedTime:0,pseudoElement:0}),cy=En(ly),uy=at({},Ql,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),dy=En(uy),fy=[9,13,27,32],ef=Di&&"CompositionEvent"in window,Ro=null;Di&&"documentMode"in document&&(Ro=document.documentMode);var hy=Di&&"TextEvent"in window&&!Ro,Pg=Di&&(!ef||Ro&&8<Ro&&11>=Ro),oh=" ",ah=!1;function Dg(n,e){switch(n){case"keyup":return fy.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ig(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var _s=!1;function py(n,e){switch(n){case"compositionend":return Ig(e);case"keypress":return e.which!==32?null:(ah=!0,oh);case"textInput":return n=e.data,n===oh&&ah?null:n;default:return null}}function my(n,e){if(_s)return n==="compositionend"||!ef&&Dg(n,e)?(n=Lg(),fl=Zd=Ki=null,_s=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Pg&&e.locale!=="ko"?null:e.data;default:return null}}var gy={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function lh(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e==="input"?!!gy[n.type]:e==="textarea"}function Ng(n,e,t,i){dg(i),e=Pl(e,"onChange"),0<e.length&&(t=new Qd("onChange","change",null,t,i),n.push({event:t,listeners:e}))}var Co=null,Vo=null;function vy(n){Xg(n,0)}function Jl(n){var e=Ss(n);if(rg(e))return n}function _y(n,e){if(n==="change")return e}var Ug=!1;if(Di){var Pc;if(Di){var Dc="oninput"in document;if(!Dc){var ch=document.createElement("div");ch.setAttribute("oninput","return;"),Dc=typeof ch.oninput=="function"}Pc=Dc}else Pc=!1;Ug=Pc&&(!document.documentMode||9<document.documentMode)}function uh(){Co&&(Co.detachEvent("onpropertychange",Fg),Vo=Co=null)}function Fg(n){if(n.propertyName==="value"&&Jl(Vo)){var e=[];Ng(e,Vo,n,qd(n)),mg(vy,e)}}function yy(n,e,t){n==="focusin"?(uh(),Co=e,Vo=t,Co.attachEvent("onpropertychange",Fg)):n==="focusout"&&uh()}function xy(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Jl(Vo)}function Sy(n,e){if(n==="click")return Jl(e)}function My(n,e){if(n==="input"||n==="change")return Jl(e)}function Ey(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}var Qn=typeof Object.is=="function"?Object.is:Ey;function Wo(n,e){if(Qn(n,e))return!0;if(typeof n!="object"||n===null||typeof e!="object"||e===null)return!1;var t=Object.keys(n),i=Object.keys(e);if(t.length!==i.length)return!1;for(i=0;i<t.length;i++){var r=t[i];if(!Fu.call(e,r)||!Qn(n[r],e[r]))return!1}return!0}function dh(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function fh(n,e){var t=dh(n);n=0;for(var i;t;){if(t.nodeType===3){if(i=n+t.textContent.length,n<=e&&i>=e)return{node:t,offset:e-n};n=i}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=dh(t)}}function zg(n,e){return n&&e?n===e?!0:n&&n.nodeType===3?!1:e&&e.nodeType===3?zg(n,e.parentNode):"contains"in n?n.contains(e):n.compareDocumentPosition?!!(n.compareDocumentPosition(e)&16):!1:!1}function Og(){for(var n=window,e=wl();e instanceof n.HTMLIFrameElement;){try{var t=typeof e.contentWindow.location.href=="string"}catch{t=!1}if(t)n=e.contentWindow;else break;e=wl(n.document)}return e}function tf(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e&&(e==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||e==="textarea"||n.contentEditable==="true")}function wy(n){var e=Og(),t=n.focusedElem,i=n.selectionRange;if(e!==t&&t&&t.ownerDocument&&zg(t.ownerDocument.documentElement,t)){if(i!==null&&tf(t)){if(e=i.start,n=i.end,n===void 0&&(n=e),"selectionStart"in t)t.selectionStart=e,t.selectionEnd=Math.min(n,t.value.length);else if(n=(e=t.ownerDocument||document)&&e.defaultView||window,n.getSelection){n=n.getSelection();var r=t.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!n.extend&&s>i&&(r=i,i=s,s=r),r=fh(t,s);var o=fh(t,i);r&&o&&(n.rangeCount!==1||n.anchorNode!==r.node||n.anchorOffset!==r.offset||n.focusNode!==o.node||n.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),n.removeAllRanges(),s>i?(n.addRange(e),n.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),n.addRange(e)))}}for(e=[],n=t;n=n.parentNode;)n.nodeType===1&&e.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<e.length;t++)n=e[t],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var Ty=Di&&"documentMode"in document&&11>=document.documentMode,ys=null,td=null,bo=null,nd=!1;function hh(n,e,t){var i=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;nd||ys==null||ys!==wl(i)||(i=ys,"selectionStart"in i&&tf(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),bo&&Wo(bo,i)||(bo=i,i=Pl(td,"onSelect"),0<i.length&&(e=new Qd("onSelect","select",null,e,t),n.push({event:e,listeners:i}),e.target=ys)))}function Ma(n,e){var t={};return t[n.toLowerCase()]=e.toLowerCase(),t["Webkit"+n]="webkit"+e,t["Moz"+n]="moz"+e,t}var xs={animationend:Ma("Animation","AnimationEnd"),animationiteration:Ma("Animation","AnimationIteration"),animationstart:Ma("Animation","AnimationStart"),transitionend:Ma("Transition","TransitionEnd")},Ic={},Bg={};Di&&(Bg=document.createElement("div").style,"AnimationEvent"in window||(delete xs.animationend.animation,delete xs.animationiteration.animation,delete xs.animationstart.animation),"TransitionEvent"in window||delete xs.transitionend.transition);function ec(n){if(Ic[n])return Ic[n];if(!xs[n])return n;var e=xs[n],t;for(t in e)if(e.hasOwnProperty(t)&&t in Bg)return Ic[n]=e[t];return n}var kg=ec("animationend"),Hg=ec("animationiteration"),Gg=ec("animationstart"),Vg=ec("transitionend"),Wg=new Map,ph="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function ur(n,e){Wg.set(n,e),qr(e,[n])}for(var Nc=0;Nc<ph.length;Nc++){var Uc=ph[Nc],Ay=Uc.toLowerCase(),Ry=Uc[0].toUpperCase()+Uc.slice(1);ur(Ay,"on"+Ry)}ur(kg,"onAnimationEnd");ur(Hg,"onAnimationIteration");ur(Gg,"onAnimationStart");ur("dblclick","onDoubleClick");ur("focusin","onFocus");ur("focusout","onBlur");ur(Vg,"onTransitionEnd");Os("onMouseEnter",["mouseout","mouseover"]);Os("onMouseLeave",["mouseout","mouseover"]);Os("onPointerEnter",["pointerout","pointerover"]);Os("onPointerLeave",["pointerout","pointerover"]);qr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));qr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));qr("onBeforeInput",["compositionend","keypress","textInput","paste"]);qr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));qr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));qr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var So="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Cy=new Set("cancel close invalid load scroll toggle".split(" ").concat(So));function mh(n,e,t){var i=n.type||"unknown-event";n.currentTarget=t,A_(i,e,void 0,n),n.currentTarget=null}function Xg(n,e){e=(e&4)!==0;for(var t=0;t<n.length;t++){var i=n[t],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],l=a.instance,c=a.currentTarget;if(a=a.listener,l!==s&&r.isPropagationStopped())break e;mh(r,a,c),s=l}else for(o=0;o<i.length;o++){if(a=i[o],l=a.instance,c=a.currentTarget,a=a.listener,l!==s&&r.isPropagationStopped())break e;mh(r,a,c),s=l}}}if(Al)throw n=Zu,Al=!1,Zu=null,n}function tt(n,e){var t=e[ad];t===void 0&&(t=e[ad]=new Set);var i=n+"__bubble";t.has(i)||(qg(e,n,2,!1),t.add(i))}function Fc(n,e,t){var i=0;e&&(i|=4),qg(t,n,i,e)}var Ea="_reactListening"+Math.random().toString(36).slice(2);function Xo(n){if(!n[Ea]){n[Ea]=!0,Jm.forEach(function(t){t!=="selectionchange"&&(Cy.has(t)||Fc(t,!1,n),Fc(t,!0,n))});var e=n.nodeType===9?n:n.ownerDocument;e===null||e[Ea]||(e[Ea]=!0,Fc("selectionchange",!1,e))}}function qg(n,e,t,i){switch(bg(e)){case 1:var r=G_;break;case 4:r=V_;break;default:r=Kd}t=r.bind(null,e,t,n),r=void 0,!Ku||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?n.addEventListener(e,t,{capture:!0,passive:r}):n.addEventListener(e,t,!0):r!==void 0?n.addEventListener(e,t,{passive:r}):n.addEventListener(e,t,!1)}function zc(n,e,t,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===r||a.nodeType===8&&a.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;a!==null;){if(o=Rr(a),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}a=a.parentNode}}i=i.return}mg(function(){var c=s,d=qd(t),h=[];e:{var u=Wg.get(n);if(u!==void 0){var p=Qd,v=n;switch(n){case"keypress":if(hl(t)===0)break e;case"keydown":case"keyup":p=ry;break;case"focusin":v="focus",p=Lc;break;case"focusout":v="blur",p=Lc;break;case"beforeblur":case"afterblur":p=Lc;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=ih;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=q_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=ay;break;case kg:case Hg:case Gg:p=$_;break;case Vg:p=cy;break;case"scroll":p=W_;break;case"wheel":p=dy;break;case"copy":case"cut":case"paste":p=Z_;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=sh}var _=(e&4)!==0,g=!_&&n==="scroll",f=_?u!==null?u+"Capture":null:u;_=[];for(var m=c,y;m!==null;){y=m;var x=y.stateNode;if(y.tag===5&&x!==null&&(y=x,f!==null&&(x=Bo(m,f),x!=null&&_.push(qo(m,x,y)))),g)break;m=m.return}0<_.length&&(u=new p(u,v,null,t,d),h.push({event:u,listeners:_}))}}if(!(e&7)){e:{if(u=n==="mouseover"||n==="pointerover",p=n==="mouseout"||n==="pointerout",u&&t!==Yu&&(v=t.relatedTarget||t.fromElement)&&(Rr(v)||v[Ii]))break e;if((p||u)&&(u=d.window===d?d:(u=d.ownerDocument)?u.defaultView||u.parentWindow:window,p?(v=t.relatedTarget||t.toElement,p=c,v=v?Rr(v):null,v!==null&&(g=jr(v),v!==g||v.tag!==5&&v.tag!==6)&&(v=null)):(p=null,v=c),p!==v)){if(_=ih,x="onMouseLeave",f="onMouseEnter",m="mouse",(n==="pointerout"||n==="pointerover")&&(_=sh,x="onPointerLeave",f="onPointerEnter",m="pointer"),g=p==null?u:Ss(p),y=v==null?u:Ss(v),u=new _(x,m+"leave",p,t,d),u.target=g,u.relatedTarget=y,x=null,Rr(d)===c&&(_=new _(f,m+"enter",v,t,d),_.target=y,_.relatedTarget=g,x=_),g=x,p&&v)t:{for(_=p,f=v,m=0,y=_;y;y=Yr(y))m++;for(y=0,x=f;x;x=Yr(x))y++;for(;0<m-y;)_=Yr(_),m--;for(;0<y-m;)f=Yr(f),y--;for(;m--;){if(_===f||f!==null&&_===f.alternate)break t;_=Yr(_),f=Yr(f)}_=null}else _=null;p!==null&&gh(h,u,p,_,!1),v!==null&&g!==null&&gh(h,g,v,_,!0)}}e:{if(u=c?Ss(c):window,p=u.nodeName&&u.nodeName.toLowerCase(),p==="select"||p==="input"&&u.type==="file")var M=_y;else if(lh(u))if(Ug)M=My;else{M=xy;var w=yy}else(p=u.nodeName)&&p.toLowerCase()==="input"&&(u.type==="checkbox"||u.type==="radio")&&(M=Sy);if(M&&(M=M(n,c))){Ng(h,M,t,d);break e}w&&w(n,u,c),n==="focusout"&&(w=u._wrapperState)&&w.controlled&&u.type==="number"&&Vu(u,"number",u.value)}switch(w=c?Ss(c):window,n){case"focusin":(lh(w)||w.contentEditable==="true")&&(ys=w,td=c,bo=null);break;case"focusout":bo=td=ys=null;break;case"mousedown":nd=!0;break;case"contextmenu":case"mouseup":case"dragend":nd=!1,hh(h,t,d);break;case"selectionchange":if(Ty)break;case"keydown":case"keyup":hh(h,t,d)}var R;if(ef)e:{switch(n){case"compositionstart":var D="onCompositionStart";break e;case"compositionend":D="onCompositionEnd";break e;case"compositionupdate":D="onCompositionUpdate";break e}D=void 0}else _s?Dg(n,t)&&(D="onCompositionEnd"):n==="keydown"&&t.keyCode===229&&(D="onCompositionStart");D&&(Pg&&t.locale!=="ko"&&(_s||D!=="onCompositionStart"?D==="onCompositionEnd"&&_s&&(R=Lg()):(Ki=d,Zd="value"in Ki?Ki.value:Ki.textContent,_s=!0)),w=Pl(c,D),0<w.length&&(D=new rh(D,n,null,t,d),h.push({event:D,listeners:w}),R?D.data=R:(R=Ig(t),R!==null&&(D.data=R)))),(R=hy?py(n,t):my(n,t))&&(c=Pl(c,"onBeforeInput"),0<c.length&&(d=new rh("onBeforeInput","beforeinput",null,t,d),h.push({event:d,listeners:c}),d.data=R))}Xg(h,e)})}function qo(n,e,t){return{instance:n,listener:e,currentTarget:t}}function Pl(n,e){for(var t=e+"Capture",i=[];n!==null;){var r=n,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Bo(n,t),s!=null&&i.unshift(qo(n,s,r)),s=Bo(n,e),s!=null&&i.push(qo(n,s,r))),n=n.return}return i}function Yr(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function gh(n,e,t,i,r){for(var s=e._reactName,o=[];t!==null&&t!==i;){var a=t,l=a.alternate,c=a.stateNode;if(l!==null&&l===i)break;a.tag===5&&c!==null&&(a=c,r?(l=Bo(t,s),l!=null&&o.unshift(qo(t,l,a))):r||(l=Bo(t,s),l!=null&&o.push(qo(t,l,a)))),t=t.return}o.length!==0&&n.push({event:e,listeners:o})}var by=/\r\n?/g,Ly=/\u0000|\uFFFD/g;function vh(n){return(typeof n=="string"?n:""+n).replace(by,`
`).replace(Ly,"")}function wa(n,e,t){if(e=vh(e),vh(n)!==e&&t)throw Error(ne(425))}function Dl(){}var id=null,rd=null;function sd(n,e){return n==="textarea"||n==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var od=typeof setTimeout=="function"?setTimeout:void 0,Py=typeof clearTimeout=="function"?clearTimeout:void 0,_h=typeof Promise=="function"?Promise:void 0,Dy=typeof queueMicrotask=="function"?queueMicrotask:typeof _h<"u"?function(n){return _h.resolve(null).then(n).catch(Iy)}:od;function Iy(n){setTimeout(function(){throw n})}function Oc(n,e){var t=e,i=0;do{var r=t.nextSibling;if(n.removeChild(t),r&&r.nodeType===8)if(t=r.data,t==="/$"){if(i===0){n.removeChild(r),Go(e);return}i--}else t!=="$"&&t!=="$?"&&t!=="$!"||i++;t=r}while(t);Go(e)}function tr(n){for(;n!=null;n=n.nextSibling){var e=n.nodeType;if(e===1||e===3)break;if(e===8){if(e=n.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return n}function yh(n){n=n.previousSibling;for(var e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="$"||t==="$!"||t==="$?"){if(e===0)return n;e--}else t==="/$"&&e++}n=n.previousSibling}return null}var Zs=Math.random().toString(36).slice(2),li="__reactFiber$"+Zs,jo="__reactProps$"+Zs,Ii="__reactContainer$"+Zs,ad="__reactEvents$"+Zs,Ny="__reactListeners$"+Zs,Uy="__reactHandles$"+Zs;function Rr(n){var e=n[li];if(e)return e;for(var t=n.parentNode;t;){if(e=t[Ii]||t[li]){if(t=e.alternate,e.child!==null||t!==null&&t.child!==null)for(n=yh(n);n!==null;){if(t=n[li])return t;n=yh(n)}return e}n=t,t=n.parentNode}return null}function sa(n){return n=n[li]||n[Ii],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function Ss(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(ne(33))}function tc(n){return n[jo]||null}var ld=[],Ms=-1;function dr(n){return{current:n}}function nt(n){0>Ms||(n.current=ld[Ms],ld[Ms]=null,Ms--)}function Je(n,e){Ms++,ld[Ms]=n.current,n.current=e}var lr={},Vt=dr(lr),sn=dr(!1),zr=lr;function Bs(n,e){var t=n.type.contextTypes;if(!t)return lr;var i=n.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in t)r[s]=e[s];return i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=e,n.__reactInternalMemoizedMaskedChildContext=r),r}function on(n){return n=n.childContextTypes,n!=null}function Il(){nt(sn),nt(Vt)}function xh(n,e,t){if(Vt.current!==lr)throw Error(ne(168));Je(Vt,e),Je(sn,t)}function jg(n,e,t){var i=n.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return t;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ne(108,y_(n)||"Unknown",r));return at({},t,i)}function Nl(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||lr,zr=Vt.current,Je(Vt,n),Je(sn,sn.current),!0}function Sh(n,e,t){var i=n.stateNode;if(!i)throw Error(ne(169));t?(n=jg(n,e,zr),i.__reactInternalMemoizedMergedChildContext=n,nt(sn),nt(Vt),Je(Vt,n)):nt(sn),Je(sn,t)}var Ai=null,nc=!1,Bc=!1;function Yg(n){Ai===null?Ai=[n]:Ai.push(n)}function Fy(n){nc=!0,Yg(n)}function fr(){if(!Bc&&Ai!==null){Bc=!0;var n=0,e=je;try{var t=Ai;for(je=1;n<t.length;n++){var i=t[n];do i=i(!0);while(i!==null)}Ai=null,nc=!1}catch(r){throw Ai!==null&&(Ai=Ai.slice(n+1)),yg(jd,fr),r}finally{je=e,Bc=!1}}return null}var Es=[],ws=0,Ul=null,Fl=0,Rn=[],Cn=0,Or=null,Ci=1,bi="";function xr(n,e){Es[ws++]=Fl,Es[ws++]=Ul,Ul=n,Fl=e}function $g(n,e,t){Rn[Cn++]=Ci,Rn[Cn++]=bi,Rn[Cn++]=Or,Or=n;var i=Ci;n=bi;var r=32-$n(i)-1;i&=~(1<<r),t+=1;var s=32-$n(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,Ci=1<<32-$n(e)+r|t<<r|i,bi=s+n}else Ci=1<<s|t<<r|i,bi=n}function nf(n){n.return!==null&&(xr(n,1),$g(n,1,0))}function rf(n){for(;n===Ul;)Ul=Es[--ws],Es[ws]=null,Fl=Es[--ws],Es[ws]=null;for(;n===Or;)Or=Rn[--Cn],Rn[Cn]=null,bi=Rn[--Cn],Rn[Cn]=null,Ci=Rn[--Cn],Rn[Cn]=null}var yn=null,vn=null,rt=!1,Wn=null;function Kg(n,e){var t=Pn(5,null,null,0);t.elementType="DELETED",t.stateNode=e,t.return=n,e=n.deletions,e===null?(n.deletions=[t],n.flags|=16):e.push(t)}function Mh(n,e){switch(n.tag){case 5:var t=n.type;return e=e.nodeType!==1||t.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(n.stateNode=e,yn=n,vn=tr(e.firstChild),!0):!1;case 6:return e=n.pendingProps===""||e.nodeType!==3?null:e,e!==null?(n.stateNode=e,yn=n,vn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(t=Or!==null?{id:Ci,overflow:bi}:null,n.memoizedState={dehydrated:e,treeContext:t,retryLane:1073741824},t=Pn(18,null,null,0),t.stateNode=e,t.return=n,n.child=t,yn=n,vn=null,!0):!1;default:return!1}}function cd(n){return(n.mode&1)!==0&&(n.flags&128)===0}function ud(n){if(rt){var e=vn;if(e){var t=e;if(!Mh(n,e)){if(cd(n))throw Error(ne(418));e=tr(t.nextSibling);var i=yn;e&&Mh(n,e)?Kg(i,t):(n.flags=n.flags&-4097|2,rt=!1,yn=n)}}else{if(cd(n))throw Error(ne(418));n.flags=n.flags&-4097|2,rt=!1,yn=n}}}function Eh(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;yn=n}function Ta(n){if(n!==yn)return!1;if(!rt)return Eh(n),rt=!0,!1;var e;if((e=n.tag!==3)&&!(e=n.tag!==5)&&(e=n.type,e=e!=="head"&&e!=="body"&&!sd(n.type,n.memoizedProps)),e&&(e=vn)){if(cd(n))throw Zg(),Error(ne(418));for(;e;)Kg(n,e),e=tr(e.nextSibling)}if(Eh(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(ne(317));e:{for(n=n.nextSibling,e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="/$"){if(e===0){vn=tr(n.nextSibling);break e}e--}else t!=="$"&&t!=="$!"&&t!=="$?"||e++}n=n.nextSibling}vn=null}}else vn=yn?tr(n.stateNode.nextSibling):null;return!0}function Zg(){for(var n=vn;n;)n=tr(n.nextSibling)}function ks(){vn=yn=null,rt=!1}function sf(n){Wn===null?Wn=[n]:Wn.push(n)}var zy=Fi.ReactCurrentBatchConfig;function oo(n,e,t){if(n=t.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(ne(309));var i=t.stateNode}if(!i)throw Error(ne(147,n));var r=i,s=""+n;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=r.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof n!="string")throw Error(ne(284));if(!t._owner)throw Error(ne(290,n))}return n}function Aa(n,e){throw n=Object.prototype.toString.call(e),Error(ne(31,n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n))}function wh(n){var e=n._init;return e(n._payload)}function Qg(n){function e(f,m){if(n){var y=f.deletions;y===null?(f.deletions=[m],f.flags|=16):y.push(m)}}function t(f,m){if(!n)return null;for(;m!==null;)e(f,m),m=m.sibling;return null}function i(f,m){for(f=new Map;m!==null;)m.key!==null?f.set(m.key,m):f.set(m.index,m),m=m.sibling;return f}function r(f,m){return f=sr(f,m),f.index=0,f.sibling=null,f}function s(f,m,y){return f.index=y,n?(y=f.alternate,y!==null?(y=y.index,y<m?(f.flags|=2,m):y):(f.flags|=2,m)):(f.flags|=1048576,m)}function o(f){return n&&f.alternate===null&&(f.flags|=2),f}function a(f,m,y,x){return m===null||m.tag!==6?(m=qc(y,f.mode,x),m.return=f,m):(m=r(m,y),m.return=f,m)}function l(f,m,y,x){var M=y.type;return M===vs?d(f,m,y.props.children,x,y.key):m!==null&&(m.elementType===M||typeof M=="object"&&M!==null&&M.$$typeof===qi&&wh(M)===m.type)?(x=r(m,y.props),x.ref=oo(f,m,y),x.return=f,x):(x=xl(y.type,y.key,y.props,null,f.mode,x),x.ref=oo(f,m,y),x.return=f,x)}function c(f,m,y,x){return m===null||m.tag!==4||m.stateNode.containerInfo!==y.containerInfo||m.stateNode.implementation!==y.implementation?(m=jc(y,f.mode,x),m.return=f,m):(m=r(m,y.children||[]),m.return=f,m)}function d(f,m,y,x,M){return m===null||m.tag!==7?(m=Ir(y,f.mode,x,M),m.return=f,m):(m=r(m,y),m.return=f,m)}function h(f,m,y){if(typeof m=="string"&&m!==""||typeof m=="number")return m=qc(""+m,f.mode,y),m.return=f,m;if(typeof m=="object"&&m!==null){switch(m.$$typeof){case ma:return y=xl(m.type,m.key,m.props,null,f.mode,y),y.ref=oo(f,null,m),y.return=f,y;case gs:return m=jc(m,f.mode,y),m.return=f,m;case qi:var x=m._init;return h(f,x(m._payload),y)}if(yo(m)||to(m))return m=Ir(m,f.mode,y,null),m.return=f,m;Aa(f,m)}return null}function u(f,m,y,x){var M=m!==null?m.key:null;if(typeof y=="string"&&y!==""||typeof y=="number")return M!==null?null:a(f,m,""+y,x);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case ma:return y.key===M?l(f,m,y,x):null;case gs:return y.key===M?c(f,m,y,x):null;case qi:return M=y._init,u(f,m,M(y._payload),x)}if(yo(y)||to(y))return M!==null?null:d(f,m,y,x,null);Aa(f,y)}return null}function p(f,m,y,x,M){if(typeof x=="string"&&x!==""||typeof x=="number")return f=f.get(y)||null,a(m,f,""+x,M);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case ma:return f=f.get(x.key===null?y:x.key)||null,l(m,f,x,M);case gs:return f=f.get(x.key===null?y:x.key)||null,c(m,f,x,M);case qi:var w=x._init;return p(f,m,y,w(x._payload),M)}if(yo(x)||to(x))return f=f.get(y)||null,d(m,f,x,M,null);Aa(m,x)}return null}function v(f,m,y,x){for(var M=null,w=null,R=m,D=m=0,E=null;R!==null&&D<y.length;D++){R.index>D?(E=R,R=null):E=R.sibling;var T=u(f,R,y[D],x);if(T===null){R===null&&(R=E);break}n&&R&&T.alternate===null&&e(f,R),m=s(T,m,D),w===null?M=T:w.sibling=T,w=T,R=E}if(D===y.length)return t(f,R),rt&&xr(f,D),M;if(R===null){for(;D<y.length;D++)R=h(f,y[D],x),R!==null&&(m=s(R,m,D),w===null?M=R:w.sibling=R,w=R);return rt&&xr(f,D),M}for(R=i(f,R);D<y.length;D++)E=p(R,f,D,y[D],x),E!==null&&(n&&E.alternate!==null&&R.delete(E.key===null?D:E.key),m=s(E,m,D),w===null?M=E:w.sibling=E,w=E);return n&&R.forEach(function(V){return e(f,V)}),rt&&xr(f,D),M}function _(f,m,y,x){var M=to(y);if(typeof M!="function")throw Error(ne(150));if(y=M.call(y),y==null)throw Error(ne(151));for(var w=M=null,R=m,D=m=0,E=null,T=y.next();R!==null&&!T.done;D++,T=y.next()){R.index>D?(E=R,R=null):E=R.sibling;var V=u(f,R,T.value,x);if(V===null){R===null&&(R=E);break}n&&R&&V.alternate===null&&e(f,R),m=s(V,m,D),w===null?M=V:w.sibling=V,w=V,R=E}if(T.done)return t(f,R),rt&&xr(f,D),M;if(R===null){for(;!T.done;D++,T=y.next())T=h(f,T.value,x),T!==null&&(m=s(T,m,D),w===null?M=T:w.sibling=T,w=T);return rt&&xr(f,D),M}for(R=i(f,R);!T.done;D++,T=y.next())T=p(R,f,D,T.value,x),T!==null&&(n&&T.alternate!==null&&R.delete(T.key===null?D:T.key),m=s(T,m,D),w===null?M=T:w.sibling=T,w=T);return n&&R.forEach(function(O){return e(f,O)}),rt&&xr(f,D),M}function g(f,m,y,x){if(typeof y=="object"&&y!==null&&y.type===vs&&y.key===null&&(y=y.props.children),typeof y=="object"&&y!==null){switch(y.$$typeof){case ma:e:{for(var M=y.key,w=m;w!==null;){if(w.key===M){if(M=y.type,M===vs){if(w.tag===7){t(f,w.sibling),m=r(w,y.props.children),m.return=f,f=m;break e}}else if(w.elementType===M||typeof M=="object"&&M!==null&&M.$$typeof===qi&&wh(M)===w.type){t(f,w.sibling),m=r(w,y.props),m.ref=oo(f,w,y),m.return=f,f=m;break e}t(f,w);break}else e(f,w);w=w.sibling}y.type===vs?(m=Ir(y.props.children,f.mode,x,y.key),m.return=f,f=m):(x=xl(y.type,y.key,y.props,null,f.mode,x),x.ref=oo(f,m,y),x.return=f,f=x)}return o(f);case gs:e:{for(w=y.key;m!==null;){if(m.key===w)if(m.tag===4&&m.stateNode.containerInfo===y.containerInfo&&m.stateNode.implementation===y.implementation){t(f,m.sibling),m=r(m,y.children||[]),m.return=f,f=m;break e}else{t(f,m);break}else e(f,m);m=m.sibling}m=jc(y,f.mode,x),m.return=f,f=m}return o(f);case qi:return w=y._init,g(f,m,w(y._payload),x)}if(yo(y))return v(f,m,y,x);if(to(y))return _(f,m,y,x);Aa(f,y)}return typeof y=="string"&&y!==""||typeof y=="number"?(y=""+y,m!==null&&m.tag===6?(t(f,m.sibling),m=r(m,y),m.return=f,f=m):(t(f,m),m=qc(y,f.mode,x),m.return=f,f=m),o(f)):t(f,m)}return g}var Hs=Qg(!0),Jg=Qg(!1),zl=dr(null),Ol=null,Ts=null,of=null;function af(){of=Ts=Ol=null}function lf(n){var e=zl.current;nt(zl),n._currentValue=e}function dd(n,e,t){for(;n!==null;){var i=n.alternate;if((n.childLanes&e)!==e?(n.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),n===t)break;n=n.return}}function Is(n,e){Ol=n,of=Ts=null,n=n.dependencies,n!==null&&n.firstContext!==null&&(n.lanes&e&&(nn=!0),n.firstContext=null)}function In(n){var e=n._currentValue;if(of!==n)if(n={context:n,memoizedValue:e,next:null},Ts===null){if(Ol===null)throw Error(ne(308));Ts=n,Ol.dependencies={lanes:0,firstContext:n}}else Ts=Ts.next=n;return e}var Cr=null;function cf(n){Cr===null?Cr=[n]:Cr.push(n)}function ev(n,e,t,i){var r=e.interleaved;return r===null?(t.next=t,cf(e)):(t.next=r.next,r.next=t),e.interleaved=t,Ni(n,i)}function Ni(n,e){n.lanes|=e;var t=n.alternate;for(t!==null&&(t.lanes|=e),t=n,n=n.return;n!==null;)n.childLanes|=e,t=n.alternate,t!==null&&(t.childLanes|=e),t=n,n=n.return;return t.tag===3?t.stateNode:null}var ji=!1;function uf(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function tv(n,e){n=n.updateQueue,e.updateQueue===n&&(e.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Li(n,e){return{eventTime:n,lane:e,tag:0,payload:null,callback:null,next:null}}function nr(n,e,t){var i=n.updateQueue;if(i===null)return null;if(i=i.shared,Ge&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ni(n,t)}return r=i.interleaved,r===null?(e.next=e,cf(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ni(n,t)}function pl(n,e,t){if(e=e.updateQueue,e!==null&&(e=e.shared,(t&4194240)!==0)){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,Yd(n,t)}}function Th(n,e){var t=n.updateQueue,i=n.alternate;if(i!==null&&(i=i.updateQueue,t===i)){var r=null,s=null;if(t=t.firstBaseUpdate,t!==null){do{var o={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};s===null?r=s=o:s=s.next=o,t=t.next}while(t!==null);s===null?r=s=e:s=s.next=e}else r=s=e;t={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},n.updateQueue=t;return}n=t.lastBaseUpdate,n===null?t.firstBaseUpdate=e:n.next=e,t.lastBaseUpdate=e}function Bl(n,e,t,i){var r=n.updateQueue;ji=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,a=r.shared.pending;if(a!==null){r.shared.pending=null;var l=a,c=l.next;l.next=null,o===null?s=c:o.next=c,o=l;var d=n.alternate;d!==null&&(d=d.updateQueue,a=d.lastBaseUpdate,a!==o&&(a===null?d.firstBaseUpdate=c:a.next=c,d.lastBaseUpdate=l))}if(s!==null){var h=r.baseState;o=0,d=c=l=null,a=s;do{var u=a.lane,p=a.eventTime;if((i&u)===u){d!==null&&(d=d.next={eventTime:p,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var v=n,_=a;switch(u=e,p=t,_.tag){case 1:if(v=_.payload,typeof v=="function"){h=v.call(p,h,u);break e}h=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=_.payload,u=typeof v=="function"?v.call(p,h,u):v,u==null)break e;h=at({},h,u);break e;case 2:ji=!0}}a.callback!==null&&a.lane!==0&&(n.flags|=64,u=r.effects,u===null?r.effects=[a]:u.push(a))}else p={eventTime:p,lane:u,tag:a.tag,payload:a.payload,callback:a.callback,next:null},d===null?(c=d=p,l=h):d=d.next=p,o|=u;if(a=a.next,a===null){if(a=r.shared.pending,a===null)break;u=a,a=u.next,u.next=null,r.lastBaseUpdate=u,r.shared.pending=null}}while(!0);if(d===null&&(l=h),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=d,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);kr|=o,n.lanes=o,n.memoizedState=h}}function Ah(n,e,t){if(n=e.effects,e.effects=null,n!==null)for(e=0;e<n.length;e++){var i=n[e],r=i.callback;if(r!==null){if(i.callback=null,i=t,typeof r!="function")throw Error(ne(191,r));r.call(i)}}}var oa={},ui=dr(oa),Yo=dr(oa),$o=dr(oa);function br(n){if(n===oa)throw Error(ne(174));return n}function df(n,e){switch(Je($o,e),Je(Yo,n),Je(ui,oa),n=e.nodeType,n){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Xu(null,"");break;default:n=n===8?e.parentNode:e,e=n.namespaceURI||null,n=n.tagName,e=Xu(e,n)}nt(ui),Je(ui,e)}function Gs(){nt(ui),nt(Yo),nt($o)}function nv(n){br($o.current);var e=br(ui.current),t=Xu(e,n.type);e!==t&&(Je(Yo,n),Je(ui,t))}function ff(n){Yo.current===n&&(nt(ui),nt(Yo))}var st=dr(0);function kl(n){for(var e=n;e!==null;){if(e.tag===13){var t=e.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var kc=[];function hf(){for(var n=0;n<kc.length;n++)kc[n]._workInProgressVersionPrimary=null;kc.length=0}var ml=Fi.ReactCurrentDispatcher,Hc=Fi.ReactCurrentBatchConfig,Br=0,ot=null,wt=null,Lt=null,Hl=!1,Lo=!1,Ko=0,Oy=0;function Ot(){throw Error(ne(321))}function pf(n,e){if(e===null)return!1;for(var t=0;t<e.length&&t<n.length;t++)if(!Qn(n[t],e[t]))return!1;return!0}function mf(n,e,t,i,r,s){if(Br=s,ot=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,ml.current=n===null||n.memoizedState===null?Gy:Vy,n=t(i,r),Lo){s=0;do{if(Lo=!1,Ko=0,25<=s)throw Error(ne(301));s+=1,Lt=wt=null,e.updateQueue=null,ml.current=Wy,n=t(i,r)}while(Lo)}if(ml.current=Gl,e=wt!==null&&wt.next!==null,Br=0,Lt=wt=ot=null,Hl=!1,e)throw Error(ne(300));return n}function gf(){var n=Ko!==0;return Ko=0,n}function oi(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Lt===null?ot.memoizedState=Lt=n:Lt=Lt.next=n,Lt}function Nn(){if(wt===null){var n=ot.alternate;n=n!==null?n.memoizedState:null}else n=wt.next;var e=Lt===null?ot.memoizedState:Lt.next;if(e!==null)Lt=e,wt=n;else{if(n===null)throw Error(ne(310));wt=n,n={memoizedState:wt.memoizedState,baseState:wt.baseState,baseQueue:wt.baseQueue,queue:wt.queue,next:null},Lt===null?ot.memoizedState=Lt=n:Lt=Lt.next=n}return Lt}function Zo(n,e){return typeof e=="function"?e(n):e}function Gc(n){var e=Nn(),t=e.queue;if(t===null)throw Error(ne(311));t.lastRenderedReducer=n;var i=wt,r=i.baseQueue,s=t.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,t.pending=null}if(r!==null){s=r.next,i=i.baseState;var a=o=null,l=null,c=s;do{var d=c.lane;if((Br&d)===d)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:n(i,c.action);else{var h={lane:d,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(a=l=h,o=i):l=l.next=h,ot.lanes|=d,kr|=d}c=c.next}while(c!==null&&c!==s);l===null?o=i:l.next=a,Qn(i,e.memoizedState)||(nn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,t.lastRenderedState=i}if(n=t.interleaved,n!==null){r=n;do s=r.lane,ot.lanes|=s,kr|=s,r=r.next;while(r!==n)}else r===null&&(t.lanes=0);return[e.memoizedState,t.dispatch]}function Vc(n){var e=Nn(),t=e.queue;if(t===null)throw Error(ne(311));t.lastRenderedReducer=n;var i=t.dispatch,r=t.pending,s=e.memoizedState;if(r!==null){t.pending=null;var o=r=r.next;do s=n(s,o.action),o=o.next;while(o!==r);Qn(s,e.memoizedState)||(nn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),t.lastRenderedState=s}return[s,i]}function iv(){}function rv(n,e){var t=ot,i=Nn(),r=e(),s=!Qn(i.memoizedState,r);if(s&&(i.memoizedState=r,nn=!0),i=i.queue,vf(av.bind(null,t,i,n),[n]),i.getSnapshot!==e||s||Lt!==null&&Lt.memoizedState.tag&1){if(t.flags|=2048,Qo(9,ov.bind(null,t,i,r,e),void 0,null),Pt===null)throw Error(ne(349));Br&30||sv(t,e,r)}return r}function sv(n,e,t){n.flags|=16384,n={getSnapshot:e,value:t},e=ot.updateQueue,e===null?(e={lastEffect:null,stores:null},ot.updateQueue=e,e.stores=[n]):(t=e.stores,t===null?e.stores=[n]:t.push(n))}function ov(n,e,t,i){e.value=t,e.getSnapshot=i,lv(e)&&cv(n)}function av(n,e,t){return t(function(){lv(e)&&cv(n)})}function lv(n){var e=n.getSnapshot;n=n.value;try{var t=e();return!Qn(n,t)}catch{return!0}}function cv(n){var e=Ni(n,1);e!==null&&Kn(e,n,1,-1)}function Rh(n){var e=oi();return typeof n=="function"&&(n=n()),e.memoizedState=e.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Zo,lastRenderedState:n},e.queue=n,n=n.dispatch=Hy.bind(null,ot,n),[e.memoizedState,n]}function Qo(n,e,t,i){return n={tag:n,create:e,destroy:t,deps:i,next:null},e=ot.updateQueue,e===null?(e={lastEffect:null,stores:null},ot.updateQueue=e,e.lastEffect=n.next=n):(t=e.lastEffect,t===null?e.lastEffect=n.next=n:(i=t.next,t.next=n,n.next=i,e.lastEffect=n)),n}function uv(){return Nn().memoizedState}function gl(n,e,t,i){var r=oi();ot.flags|=n,r.memoizedState=Qo(1|e,t,void 0,i===void 0?null:i)}function ic(n,e,t,i){var r=Nn();i=i===void 0?null:i;var s=void 0;if(wt!==null){var o=wt.memoizedState;if(s=o.destroy,i!==null&&pf(i,o.deps)){r.memoizedState=Qo(e,t,s,i);return}}ot.flags|=n,r.memoizedState=Qo(1|e,t,s,i)}function Ch(n,e){return gl(8390656,8,n,e)}function vf(n,e){return ic(2048,8,n,e)}function dv(n,e){return ic(4,2,n,e)}function fv(n,e){return ic(4,4,n,e)}function hv(n,e){if(typeof e=="function")return n=n(),e(n),function(){e(null)};if(e!=null)return n=n(),e.current=n,function(){e.current=null}}function pv(n,e,t){return t=t!=null?t.concat([n]):null,ic(4,4,hv.bind(null,e,n),t)}function _f(){}function mv(n,e){var t=Nn();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&pf(e,i[1])?i[0]:(t.memoizedState=[n,e],n)}function gv(n,e){var t=Nn();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&pf(e,i[1])?i[0]:(n=n(),t.memoizedState=[n,e],n)}function vv(n,e,t){return Br&21?(Qn(t,e)||(t=Mg(),ot.lanes|=t,kr|=t,n.baseState=!0),e):(n.baseState&&(n.baseState=!1,nn=!0),n.memoizedState=t)}function By(n,e){var t=je;je=t!==0&&4>t?t:4,n(!0);var i=Hc.transition;Hc.transition={};try{n(!1),e()}finally{je=t,Hc.transition=i}}function _v(){return Nn().memoizedState}function ky(n,e,t){var i=rr(n);if(t={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null},yv(n))xv(e,t);else if(t=ev(n,e,t,i),t!==null){var r=$t();Kn(t,n,i,r),Sv(t,e,i)}}function Hy(n,e,t){var i=rr(n),r={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null};if(yv(n))xv(e,r);else{var s=n.alternate;if(n.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,t);if(r.hasEagerState=!0,r.eagerState=a,Qn(a,o)){var l=e.interleaved;l===null?(r.next=r,cf(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}t=ev(n,e,r,i),t!==null&&(r=$t(),Kn(t,n,i,r),Sv(t,e,i))}}function yv(n){var e=n.alternate;return n===ot||e!==null&&e===ot}function xv(n,e){Lo=Hl=!0;var t=n.pending;t===null?e.next=e:(e.next=t.next,t.next=e),n.pending=e}function Sv(n,e,t){if(t&4194240){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,Yd(n,t)}}var Gl={readContext:In,useCallback:Ot,useContext:Ot,useEffect:Ot,useImperativeHandle:Ot,useInsertionEffect:Ot,useLayoutEffect:Ot,useMemo:Ot,useReducer:Ot,useRef:Ot,useState:Ot,useDebugValue:Ot,useDeferredValue:Ot,useTransition:Ot,useMutableSource:Ot,useSyncExternalStore:Ot,useId:Ot,unstable_isNewReconciler:!1},Gy={readContext:In,useCallback:function(n,e){return oi().memoizedState=[n,e===void 0?null:e],n},useContext:In,useEffect:Ch,useImperativeHandle:function(n,e,t){return t=t!=null?t.concat([n]):null,gl(4194308,4,hv.bind(null,e,n),t)},useLayoutEffect:function(n,e){return gl(4194308,4,n,e)},useInsertionEffect:function(n,e){return gl(4,2,n,e)},useMemo:function(n,e){var t=oi();return e=e===void 0?null:e,n=n(),t.memoizedState=[n,e],n},useReducer:function(n,e,t){var i=oi();return e=t!==void 0?t(e):e,i.memoizedState=i.baseState=e,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:e},i.queue=n,n=n.dispatch=ky.bind(null,ot,n),[i.memoizedState,n]},useRef:function(n){var e=oi();return n={current:n},e.memoizedState=n},useState:Rh,useDebugValue:_f,useDeferredValue:function(n){return oi().memoizedState=n},useTransition:function(){var n=Rh(!1),e=n[0];return n=By.bind(null,n[1]),oi().memoizedState=n,[e,n]},useMutableSource:function(){},useSyncExternalStore:function(n,e,t){var i=ot,r=oi();if(rt){if(t===void 0)throw Error(ne(407));t=t()}else{if(t=e(),Pt===null)throw Error(ne(349));Br&30||sv(i,e,t)}r.memoizedState=t;var s={value:t,getSnapshot:e};return r.queue=s,Ch(av.bind(null,i,s,n),[n]),i.flags|=2048,Qo(9,ov.bind(null,i,s,t,e),void 0,null),t},useId:function(){var n=oi(),e=Pt.identifierPrefix;if(rt){var t=bi,i=Ci;t=(i&~(1<<32-$n(i)-1)).toString(32)+t,e=":"+e+"R"+t,t=Ko++,0<t&&(e+="H"+t.toString(32)),e+=":"}else t=Oy++,e=":"+e+"r"+t.toString(32)+":";return n.memoizedState=e},unstable_isNewReconciler:!1},Vy={readContext:In,useCallback:mv,useContext:In,useEffect:vf,useImperativeHandle:pv,useInsertionEffect:dv,useLayoutEffect:fv,useMemo:gv,useReducer:Gc,useRef:uv,useState:function(){return Gc(Zo)},useDebugValue:_f,useDeferredValue:function(n){var e=Nn();return vv(e,wt.memoizedState,n)},useTransition:function(){var n=Gc(Zo)[0],e=Nn().memoizedState;return[n,e]},useMutableSource:iv,useSyncExternalStore:rv,useId:_v,unstable_isNewReconciler:!1},Wy={readContext:In,useCallback:mv,useContext:In,useEffect:vf,useImperativeHandle:pv,useInsertionEffect:dv,useLayoutEffect:fv,useMemo:gv,useReducer:Vc,useRef:uv,useState:function(){return Vc(Zo)},useDebugValue:_f,useDeferredValue:function(n){var e=Nn();return wt===null?e.memoizedState=n:vv(e,wt.memoizedState,n)},useTransition:function(){var n=Vc(Zo)[0],e=Nn().memoizedState;return[n,e]},useMutableSource:iv,useSyncExternalStore:rv,useId:_v,unstable_isNewReconciler:!1};function Gn(n,e){if(n&&n.defaultProps){e=at({},e),n=n.defaultProps;for(var t in n)e[t]===void 0&&(e[t]=n[t]);return e}return e}function fd(n,e,t,i){e=n.memoizedState,t=t(i,e),t=t==null?e:at({},e,t),n.memoizedState=t,n.lanes===0&&(n.updateQueue.baseState=t)}var rc={isMounted:function(n){return(n=n._reactInternals)?jr(n)===n:!1},enqueueSetState:function(n,e,t){n=n._reactInternals;var i=$t(),r=rr(n),s=Li(i,r);s.payload=e,t!=null&&(s.callback=t),e=nr(n,s,r),e!==null&&(Kn(e,n,r,i),pl(e,n,r))},enqueueReplaceState:function(n,e,t){n=n._reactInternals;var i=$t(),r=rr(n),s=Li(i,r);s.tag=1,s.payload=e,t!=null&&(s.callback=t),e=nr(n,s,r),e!==null&&(Kn(e,n,r,i),pl(e,n,r))},enqueueForceUpdate:function(n,e){n=n._reactInternals;var t=$t(),i=rr(n),r=Li(t,i);r.tag=2,e!=null&&(r.callback=e),e=nr(n,r,i),e!==null&&(Kn(e,n,i,t),pl(e,n,i))}};function bh(n,e,t,i,r,s,o){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!Wo(t,i)||!Wo(r,s):!0}function Mv(n,e,t){var i=!1,r=lr,s=e.contextType;return typeof s=="object"&&s!==null?s=In(s):(r=on(e)?zr:Vt.current,i=e.contextTypes,s=(i=i!=null)?Bs(n,r):lr),e=new e(t,s),n.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=rc,n.stateNode=e,e._reactInternals=n,i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=s),e}function Lh(n,e,t,i){n=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(t,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(t,i),e.state!==n&&rc.enqueueReplaceState(e,e.state,null)}function hd(n,e,t,i){var r=n.stateNode;r.props=t,r.state=n.memoizedState,r.refs={},uf(n);var s=e.contextType;typeof s=="object"&&s!==null?r.context=In(s):(s=on(e)?zr:Vt.current,r.context=Bs(n,s)),r.state=n.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(fd(n,e,s,t),r.state=n.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&rc.enqueueReplaceState(r,r.state,null),Bl(n,t,r,i),r.state=n.memoizedState),typeof r.componentDidMount=="function"&&(n.flags|=4194308)}function Vs(n,e){try{var t="",i=e;do t+=__(i),i=i.return;while(i);var r=t}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:n,source:e,stack:r,digest:null}}function Wc(n,e,t){return{value:n,source:null,stack:t??null,digest:e??null}}function pd(n,e){try{console.error(e.value)}catch(t){setTimeout(function(){throw t})}}var Xy=typeof WeakMap=="function"?WeakMap:Map;function Ev(n,e,t){t=Li(-1,t),t.tag=3,t.payload={element:null};var i=e.value;return t.callback=function(){Wl||(Wl=!0,wd=i),pd(n,e)},t}function wv(n,e,t){t=Li(-1,t),t.tag=3;var i=n.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;t.payload=function(){return i(r)},t.callback=function(){pd(n,e)}}var s=n.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){pd(n,e),typeof i!="function"&&(ir===null?ir=new Set([this]):ir.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),t}function Ph(n,e,t){var i=n.pingCache;if(i===null){i=n.pingCache=new Xy;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(t)||(r.add(t),n=sx.bind(null,n,e,t),e.then(n,n))}function Dh(n){do{var e;if((e=n.tag===13)&&(e=n.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return n;n=n.return}while(n!==null);return null}function Ih(n,e,t,i,r){return n.mode&1?(n.flags|=65536,n.lanes=r,n):(n===e?n.flags|=65536:(n.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(e=Li(-1,1),e.tag=2,nr(t,e,1))),t.lanes|=1),n)}var qy=Fi.ReactCurrentOwner,nn=!1;function jt(n,e,t,i){e.child=n===null?Jg(e,null,t,i):Hs(e,n.child,t,i)}function Nh(n,e,t,i,r){t=t.render;var s=e.ref;return Is(e,r),i=mf(n,e,t,i,s,r),t=gf(),n!==null&&!nn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Ui(n,e,r)):(rt&&t&&nf(e),e.flags|=1,jt(n,e,i,r),e.child)}function Uh(n,e,t,i,r){if(n===null){var s=t.type;return typeof s=="function"&&!Af(s)&&s.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(e.tag=15,e.type=s,Tv(n,e,s,i,r)):(n=xl(t.type,null,i,e,e.mode,r),n.ref=e.ref,n.return=e,e.child=n)}if(s=n.child,!(n.lanes&r)){var o=s.memoizedProps;if(t=t.compare,t=t!==null?t:Wo,t(o,i)&&n.ref===e.ref)return Ui(n,e,r)}return e.flags|=1,n=sr(s,i),n.ref=e.ref,n.return=e,e.child=n}function Tv(n,e,t,i,r){if(n!==null){var s=n.memoizedProps;if(Wo(s,i)&&n.ref===e.ref)if(nn=!1,e.pendingProps=i=s,(n.lanes&r)!==0)n.flags&131072&&(nn=!0);else return e.lanes=n.lanes,Ui(n,e,r)}return md(n,e,t,i,r)}function Av(n,e,t){var i=e.pendingProps,r=i.children,s=n!==null?n.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},Je(Rs,pn),pn|=t;else{if(!(t&1073741824))return n=s!==null?s.baseLanes|t:t,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:n,cachePool:null,transitions:null},e.updateQueue=null,Je(Rs,pn),pn|=n,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:t,Je(Rs,pn),pn|=i}else s!==null?(i=s.baseLanes|t,e.memoizedState=null):i=t,Je(Rs,pn),pn|=i;return jt(n,e,r,t),e.child}function Rv(n,e){var t=e.ref;(n===null&&t!==null||n!==null&&n.ref!==t)&&(e.flags|=512,e.flags|=2097152)}function md(n,e,t,i,r){var s=on(t)?zr:Vt.current;return s=Bs(e,s),Is(e,r),t=mf(n,e,t,i,s,r),i=gf(),n!==null&&!nn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Ui(n,e,r)):(rt&&i&&nf(e),e.flags|=1,jt(n,e,t,r),e.child)}function Fh(n,e,t,i,r){if(on(t)){var s=!0;Nl(e)}else s=!1;if(Is(e,r),e.stateNode===null)vl(n,e),Mv(e,t,i),hd(e,t,i,r),i=!0;else if(n===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,c=t.contextType;typeof c=="object"&&c!==null?c=In(c):(c=on(t)?zr:Vt.current,c=Bs(e,c));var d=t.getDerivedStateFromProps,h=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function";h||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||l!==c)&&Lh(e,o,i,c),ji=!1;var u=e.memoizedState;o.state=u,Bl(e,i,o,r),l=e.memoizedState,a!==i||u!==l||sn.current||ji?(typeof d=="function"&&(fd(e,t,d,i),l=e.memoizedState),(a=ji||bh(e,t,a,i,u,l,c))?(h||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=c,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,tv(n,e),a=e.memoizedProps,c=e.type===e.elementType?a:Gn(e.type,a),o.props=c,h=e.pendingProps,u=o.context,l=t.contextType,typeof l=="object"&&l!==null?l=In(l):(l=on(t)?zr:Vt.current,l=Bs(e,l));var p=t.getDerivedStateFromProps;(d=typeof p=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==h||u!==l)&&Lh(e,o,i,l),ji=!1,u=e.memoizedState,o.state=u,Bl(e,i,o,r);var v=e.memoizedState;a!==h||u!==v||sn.current||ji?(typeof p=="function"&&(fd(e,t,p,i),v=e.memoizedState),(c=ji||bh(e,t,c,i,u,v,l)||!1)?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,v,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,v,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&u===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&u===n.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=v),o.props=i,o.state=v,o.context=l,i=c):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&u===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&u===n.memoizedState||(e.flags|=1024),i=!1)}return gd(n,e,t,i,s,r)}function gd(n,e,t,i,r,s){Rv(n,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&Sh(e,t,!1),Ui(n,e,s);i=e.stateNode,qy.current=e;var a=o&&typeof t.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,n!==null&&o?(e.child=Hs(e,n.child,null,s),e.child=Hs(e,null,a,s)):jt(n,e,a,s),e.memoizedState=i.state,r&&Sh(e,t,!0),e.child}function Cv(n){var e=n.stateNode;e.pendingContext?xh(n,e.pendingContext,e.pendingContext!==e.context):e.context&&xh(n,e.context,!1),df(n,e.containerInfo)}function zh(n,e,t,i,r){return ks(),sf(r),e.flags|=256,jt(n,e,t,i),e.child}var vd={dehydrated:null,treeContext:null,retryLane:0};function _d(n){return{baseLanes:n,cachePool:null,transitions:null}}function bv(n,e,t){var i=e.pendingProps,r=st.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=n!==null&&n.memoizedState===null?!1:(r&2)!==0),a?(s=!0,e.flags&=-129):(n===null||n.memoizedState!==null)&&(r|=1),Je(st,r&1),n===null)return ud(e),n=e.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?(e.mode&1?n.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,n=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=ac(o,i,0,null),n=Ir(n,i,t,null),s.return=e,n.return=e,s.sibling=n,e.child=s,e.child.memoizedState=_d(t),e.memoizedState=vd,n):yf(e,o));if(r=n.memoizedState,r!==null&&(a=r.dehydrated,a!==null))return jy(n,e,o,i,a,r,t);if(s){s=i.fallback,o=e.mode,r=n.child,a=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=sr(r,l),i.subtreeFlags=r.subtreeFlags&14680064),a!==null?s=sr(a,s):(s=Ir(s,o,t,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=n.child.memoizedState,o=o===null?_d(t):{baseLanes:o.baseLanes|t,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=n.childLanes&~t,e.memoizedState=vd,i}return s=n.child,n=s.sibling,i=sr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=t),i.return=e,i.sibling=null,n!==null&&(t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)),e.child=i,e.memoizedState=null,i}function yf(n,e){return e=ac({mode:"visible",children:e},n.mode,0,null),e.return=n,n.child=e}function Ra(n,e,t,i){return i!==null&&sf(i),Hs(e,n.child,null,t),n=yf(e,e.pendingProps.children),n.flags|=2,e.memoizedState=null,n}function jy(n,e,t,i,r,s,o){if(t)return e.flags&256?(e.flags&=-257,i=Wc(Error(ne(422))),Ra(n,e,o,i)):e.memoizedState!==null?(e.child=n.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=ac({mode:"visible",children:i.children},r,0,null),s=Ir(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Hs(e,n.child,null,o),e.child.memoizedState=_d(o),e.memoizedState=vd,s);if(!(e.mode&1))return Ra(n,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var a=i.dgst;return i=a,s=Error(ne(419)),i=Wc(s,i,void 0),Ra(n,e,o,i)}if(a=(o&n.childLanes)!==0,nn||a){if(i=Pt,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ni(n,r),Kn(i,n,r,-1))}return Tf(),i=Wc(Error(ne(421))),Ra(n,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=n.child,e=ox.bind(null,n),r._reactRetry=e,null):(n=s.treeContext,vn=tr(r.nextSibling),yn=e,rt=!0,Wn=null,n!==null&&(Rn[Cn++]=Ci,Rn[Cn++]=bi,Rn[Cn++]=Or,Ci=n.id,bi=n.overflow,Or=e),e=yf(e,i.children),e.flags|=4096,e)}function Oh(n,e,t){n.lanes|=e;var i=n.alternate;i!==null&&(i.lanes|=e),dd(n.return,e,t)}function Xc(n,e,t,i,r){var s=n.memoizedState;s===null?n.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:t,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=t,s.tailMode=r)}function Lv(n,e,t){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(jt(n,e,i.children,t),i=st.current,i&2)i=i&1|2,e.flags|=128;else{if(n!==null&&n.flags&128)e:for(n=e.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Oh(n,t,e);else if(n.tag===19)Oh(n,t,e);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break e;for(;n.sibling===null;){if(n.return===null||n.return===e)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}i&=1}if(Je(st,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(t=e.child,r=null;t!==null;)n=t.alternate,n!==null&&kl(n)===null&&(r=t),t=t.sibling;t=r,t===null?(r=e.child,e.child=null):(r=t.sibling,t.sibling=null),Xc(e,!1,r,t,s);break;case"backwards":for(t=null,r=e.child,e.child=null;r!==null;){if(n=r.alternate,n!==null&&kl(n)===null){e.child=r;break}n=r.sibling,r.sibling=t,t=r,r=n}Xc(e,!0,t,null,s);break;case"together":Xc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function vl(n,e){!(e.mode&1)&&n!==null&&(n.alternate=null,e.alternate=null,e.flags|=2)}function Ui(n,e,t){if(n!==null&&(e.dependencies=n.dependencies),kr|=e.lanes,!(t&e.childLanes))return null;if(n!==null&&e.child!==n.child)throw Error(ne(153));if(e.child!==null){for(n=e.child,t=sr(n,n.pendingProps),e.child=t,t.return=e;n.sibling!==null;)n=n.sibling,t=t.sibling=sr(n,n.pendingProps),t.return=e;t.sibling=null}return e.child}function Yy(n,e,t){switch(e.tag){case 3:Cv(e),ks();break;case 5:nv(e);break;case 1:on(e.type)&&Nl(e);break;case 4:df(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;Je(zl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(Je(st,st.current&1),e.flags|=128,null):t&e.child.childLanes?bv(n,e,t):(Je(st,st.current&1),n=Ui(n,e,t),n!==null?n.sibling:null);Je(st,st.current&1);break;case 19:if(i=(t&e.childLanes)!==0,n.flags&128){if(i)return Lv(n,e,t);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),Je(st,st.current),i)break;return null;case 22:case 23:return e.lanes=0,Av(n,e,t)}return Ui(n,e,t)}var Pv,yd,Dv,Iv;Pv=function(n,e){for(var t=e.child;t!==null;){if(t.tag===5||t.tag===6)n.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};yd=function(){};Dv=function(n,e,t,i){var r=n.memoizedProps;if(r!==i){n=e.stateNode,br(ui.current);var s=null;switch(t){case"input":r=Hu(n,r),i=Hu(n,i),s=[];break;case"select":r=at({},r,{value:void 0}),i=at({},i,{value:void 0}),s=[];break;case"textarea":r=Wu(n,r),i=Wu(n,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(n.onclick=Dl)}qu(t,i);var o;t=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var a=r[c];for(o in a)a.hasOwnProperty(o)&&(t||(t={}),t[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(zo.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(a=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==a&&(l!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(t||(t={}),t[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(t||(t={}),t[o]=l[o])}else t||(s||(s=[]),s.push(c,t)),t=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(zo.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&tt("scroll",n),s||a===l||(s=[])):(s=s||[]).push(c,l))}t&&(s=s||[]).push("style",t);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};Iv=function(n,e,t,i){t!==i&&(e.flags|=4)};function ao(n,e){if(!rt)switch(n.tailMode){case"hidden":e=n.tail;for(var t=null;e!==null;)e.alternate!==null&&(t=e),e=e.sibling;t===null?n.tail=null:t.sibling=null;break;case"collapsed":t=n.tail;for(var i=null;t!==null;)t.alternate!==null&&(i=t),t=t.sibling;i===null?e||n.tail===null?n.tail=null:n.tail.sibling=null:i.sibling=null}}function Bt(n){var e=n.alternate!==null&&n.alternate.child===n.child,t=0,i=0;if(e)for(var r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=n,r=r.sibling;else for(r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=n,r=r.sibling;return n.subtreeFlags|=i,n.childLanes=t,e}function $y(n,e,t){var i=e.pendingProps;switch(rf(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Bt(e),null;case 1:return on(e.type)&&Il(),Bt(e),null;case 3:return i=e.stateNode,Gs(),nt(sn),nt(Vt),hf(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(n===null||n.child===null)&&(Ta(e)?e.flags|=4:n===null||n.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Wn!==null&&(Rd(Wn),Wn=null))),yd(n,e),Bt(e),null;case 5:ff(e);var r=br($o.current);if(t=e.type,n!==null&&e.stateNode!=null)Dv(n,e,t,i,r),n.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ne(166));return Bt(e),null}if(n=br(ui.current),Ta(e)){i=e.stateNode,t=e.type;var s=e.memoizedProps;switch(i[li]=e,i[jo]=s,n=(e.mode&1)!==0,t){case"dialog":tt("cancel",i),tt("close",i);break;case"iframe":case"object":case"embed":tt("load",i);break;case"video":case"audio":for(r=0;r<So.length;r++)tt(So[r],i);break;case"source":tt("error",i);break;case"img":case"image":case"link":tt("error",i),tt("load",i);break;case"details":tt("toggle",i);break;case"input":jf(i,s),tt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},tt("invalid",i);break;case"textarea":$f(i,s),tt("invalid",i)}qu(t,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?i.textContent!==a&&(s.suppressHydrationWarning!==!0&&wa(i.textContent,a,n),r=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&wa(i.textContent,a,n),r=["children",""+a]):zo.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&tt("scroll",i)}switch(t){case"input":ga(i),Yf(i,s,!0);break;case"textarea":ga(i),Kf(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=Dl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=ag(t)),n==="http://www.w3.org/1999/xhtml"?t==="script"?(n=o.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof i.is=="string"?n=o.createElement(t,{is:i.is}):(n=o.createElement(t),t==="select"&&(o=n,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):n=o.createElementNS(n,t),n[li]=e,n[jo]=i,Pv(n,e,!1,!1),e.stateNode=n;e:{switch(o=ju(t,i),t){case"dialog":tt("cancel",n),tt("close",n),r=i;break;case"iframe":case"object":case"embed":tt("load",n),r=i;break;case"video":case"audio":for(r=0;r<So.length;r++)tt(So[r],n);r=i;break;case"source":tt("error",n),r=i;break;case"img":case"image":case"link":tt("error",n),tt("load",n),r=i;break;case"details":tt("toggle",n),r=i;break;case"input":jf(n,i),r=Hu(n,i),tt("invalid",n);break;case"option":r=i;break;case"select":n._wrapperState={wasMultiple:!!i.multiple},r=at({},i,{value:void 0}),tt("invalid",n);break;case"textarea":$f(n,i),r=Wu(n,i),tt("invalid",n);break;default:r=i}qu(t,r),a=r;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?ug(n,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&lg(n,l)):s==="children"?typeof l=="string"?(t!=="textarea"||l!=="")&&Oo(n,l):typeof l=="number"&&Oo(n,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(zo.hasOwnProperty(s)?l!=null&&s==="onScroll"&&tt("scroll",n):l!=null&&Gd(n,s,l,o))}switch(t){case"input":ga(n),Yf(n,i,!1);break;case"textarea":ga(n),Kf(n);break;case"option":i.value!=null&&n.setAttribute("value",""+ar(i.value));break;case"select":n.multiple=!!i.multiple,s=i.value,s!=null?bs(n,!!i.multiple,s,!1):i.defaultValue!=null&&bs(n,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(n.onclick=Dl)}switch(t){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Bt(e),null;case 6:if(n&&e.stateNode!=null)Iv(n,e,n.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ne(166));if(t=br($o.current),br(ui.current),Ta(e)){if(i=e.stateNode,t=e.memoizedProps,i[li]=e,(s=i.nodeValue!==t)&&(n=yn,n!==null))switch(n.tag){case 3:wa(i.nodeValue,t,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&wa(i.nodeValue,t,(n.mode&1)!==0)}s&&(e.flags|=4)}else i=(t.nodeType===9?t:t.ownerDocument).createTextNode(i),i[li]=e,e.stateNode=i}return Bt(e),null;case 13:if(nt(st),i=e.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(rt&&vn!==null&&e.mode&1&&!(e.flags&128))Zg(),ks(),e.flags|=98560,s=!1;else if(s=Ta(e),i!==null&&i.dehydrated!==null){if(n===null){if(!s)throw Error(ne(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ne(317));s[li]=e}else ks(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Bt(e),s=!1}else Wn!==null&&(Rd(Wn),Wn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=t,e):(i=i!==null,i!==(n!==null&&n.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(n===null||st.current&1?Tt===0&&(Tt=3):Tf())),e.updateQueue!==null&&(e.flags|=4),Bt(e),null);case 4:return Gs(),yd(n,e),n===null&&Xo(e.stateNode.containerInfo),Bt(e),null;case 10:return lf(e.type._context),Bt(e),null;case 17:return on(e.type)&&Il(),Bt(e),null;case 19:if(nt(st),s=e.memoizedState,s===null)return Bt(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)ao(s,!1);else{if(Tt!==0||n!==null&&n.flags&128)for(n=e.child;n!==null;){if(o=kl(n),o!==null){for(e.flags|=128,ao(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=t,t=e.child;t!==null;)s=t,n=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=n,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,n=o.dependencies,s.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t=t.sibling;return Je(st,st.current&1|2),e.child}n=n.sibling}s.tail!==null&&_t()>Ws&&(e.flags|=128,i=!0,ao(s,!1),e.lanes=4194304)}else{if(!i)if(n=kl(o),n!==null){if(e.flags|=128,i=!0,t=n.updateQueue,t!==null&&(e.updateQueue=t,e.flags|=4),ao(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!rt)return Bt(e),null}else 2*_t()-s.renderingStartTime>Ws&&t!==1073741824&&(e.flags|=128,i=!0,ao(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(t=s.last,t!==null?t.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=_t(),e.sibling=null,t=st.current,Je(st,i?t&1|2:t&1),e):(Bt(e),null);case 22:case 23:return wf(),i=e.memoizedState!==null,n!==null&&n.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?pn&1073741824&&(Bt(e),e.subtreeFlags&6&&(e.flags|=8192)):Bt(e),null;case 24:return null;case 25:return null}throw Error(ne(156,e.tag))}function Ky(n,e){switch(rf(e),e.tag){case 1:return on(e.type)&&Il(),n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 3:return Gs(),nt(sn),nt(Vt),hf(),n=e.flags,n&65536&&!(n&128)?(e.flags=n&-65537|128,e):null;case 5:return ff(e),null;case 13:if(nt(st),n=e.memoizedState,n!==null&&n.dehydrated!==null){if(e.alternate===null)throw Error(ne(340));ks()}return n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 19:return nt(st),null;case 4:return Gs(),null;case 10:return lf(e.type._context),null;case 22:case 23:return wf(),null;case 24:return null;default:return null}}var Ca=!1,Gt=!1,Zy=typeof WeakSet=="function"?WeakSet:Set,de=null;function As(n,e){var t=n.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(i){ft(n,e,i)}else t.current=null}function xd(n,e,t){try{t()}catch(i){ft(n,e,i)}}var Bh=!1;function Qy(n,e){if(id=bl,n=Og(),tf(n)){if("selectionStart"in n)var t={start:n.selectionStart,end:n.selectionEnd};else e:{t=(t=n.ownerDocument)&&t.defaultView||window;var i=t.getSelection&&t.getSelection();if(i&&i.rangeCount!==0){t=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{t.nodeType,s.nodeType}catch{t=null;break e}var o=0,a=-1,l=-1,c=0,d=0,h=n,u=null;t:for(;;){for(var p;h!==t||r!==0&&h.nodeType!==3||(a=o+r),h!==s||i!==0&&h.nodeType!==3||(l=o+i),h.nodeType===3&&(o+=h.nodeValue.length),(p=h.firstChild)!==null;)u=h,h=p;for(;;){if(h===n)break t;if(u===t&&++c===r&&(a=o),u===s&&++d===i&&(l=o),(p=h.nextSibling)!==null)break;h=u,u=h.parentNode}h=p}t=a===-1||l===-1?null:{start:a,end:l}}else t=null}t=t||{start:0,end:0}}else t=null;for(rd={focusedElem:n,selectionRange:t},bl=!1,de=e;de!==null;)if(e=de,n=e.child,(e.subtreeFlags&1028)!==0&&n!==null)n.return=e,de=n;else for(;de!==null;){e=de;try{var v=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var _=v.memoizedProps,g=v.memoizedState,f=e.stateNode,m=f.getSnapshotBeforeUpdate(e.elementType===e.type?_:Gn(e.type,_),g);f.__reactInternalSnapshotBeforeUpdate=m}break;case 3:var y=e.stateNode.containerInfo;y.nodeType===1?y.textContent="":y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ne(163))}}catch(x){ft(e,e.return,x)}if(n=e.sibling,n!==null){n.return=e.return,de=n;break}de=e.return}return v=Bh,Bh=!1,v}function Po(n,e,t){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&n)===n){var s=r.destroy;r.destroy=void 0,s!==void 0&&xd(e,t,s)}r=r.next}while(r!==i)}}function sc(n,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var t=e=e.next;do{if((t.tag&n)===n){var i=t.create;t.destroy=i()}t=t.next}while(t!==e)}}function Sd(n){var e=n.ref;if(e!==null){var t=n.stateNode;switch(n.tag){case 5:n=t;break;default:n=t}typeof e=="function"?e(n):e.current=n}}function Nv(n){var e=n.alternate;e!==null&&(n.alternate=null,Nv(e)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(e=n.stateNode,e!==null&&(delete e[li],delete e[jo],delete e[ad],delete e[Ny],delete e[Uy])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Uv(n){return n.tag===5||n.tag===3||n.tag===4}function kh(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Uv(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function Md(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.nodeType===8?t.parentNode.insertBefore(n,e):t.insertBefore(n,e):(t.nodeType===8?(e=t.parentNode,e.insertBefore(n,t)):(e=t,e.appendChild(n)),t=t._reactRootContainer,t!=null||e.onclick!==null||(e.onclick=Dl));else if(i!==4&&(n=n.child,n!==null))for(Md(n,e,t),n=n.sibling;n!==null;)Md(n,e,t),n=n.sibling}function Ed(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.insertBefore(n,e):t.appendChild(n);else if(i!==4&&(n=n.child,n!==null))for(Ed(n,e,t),n=n.sibling;n!==null;)Ed(n,e,t),n=n.sibling}var It=null,Vn=!1;function Oi(n,e,t){for(t=t.child;t!==null;)Fv(n,e,t),t=t.sibling}function Fv(n,e,t){if(ci&&typeof ci.onCommitFiberUnmount=="function")try{ci.onCommitFiberUnmount(Zl,t)}catch{}switch(t.tag){case 5:Gt||As(t,e);case 6:var i=It,r=Vn;It=null,Oi(n,e,t),It=i,Vn=r,It!==null&&(Vn?(n=It,t=t.stateNode,n.nodeType===8?n.parentNode.removeChild(t):n.removeChild(t)):It.removeChild(t.stateNode));break;case 18:It!==null&&(Vn?(n=It,t=t.stateNode,n.nodeType===8?Oc(n.parentNode,t):n.nodeType===1&&Oc(n,t),Go(n)):Oc(It,t.stateNode));break;case 4:i=It,r=Vn,It=t.stateNode.containerInfo,Vn=!0,Oi(n,e,t),It=i,Vn=r;break;case 0:case 11:case 14:case 15:if(!Gt&&(i=t.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&xd(t,e,o),r=r.next}while(r!==i)}Oi(n,e,t);break;case 1:if(!Gt&&(As(t,e),i=t.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=t.memoizedProps,i.state=t.memoizedState,i.componentWillUnmount()}catch(a){ft(t,e,a)}Oi(n,e,t);break;case 21:Oi(n,e,t);break;case 22:t.mode&1?(Gt=(i=Gt)||t.memoizedState!==null,Oi(n,e,t),Gt=i):Oi(n,e,t);break;default:Oi(n,e,t)}}function Hh(n){var e=n.updateQueue;if(e!==null){n.updateQueue=null;var t=n.stateNode;t===null&&(t=n.stateNode=new Zy),e.forEach(function(i){var r=ax.bind(null,n,i);t.has(i)||(t.add(i),i.then(r,r))})}}function Fn(n,e){var t=e.deletions;if(t!==null)for(var i=0;i<t.length;i++){var r=t[i];try{var s=n,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:It=a.stateNode,Vn=!1;break e;case 3:It=a.stateNode.containerInfo,Vn=!0;break e;case 4:It=a.stateNode.containerInfo,Vn=!0;break e}a=a.return}if(It===null)throw Error(ne(160));Fv(s,o,r),It=null,Vn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){ft(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)zv(e,n),e=e.sibling}function zv(n,e){var t=n.alternate,i=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Fn(e,n),ei(n),i&4){try{Po(3,n,n.return),sc(3,n)}catch(_){ft(n,n.return,_)}try{Po(5,n,n.return)}catch(_){ft(n,n.return,_)}}break;case 1:Fn(e,n),ei(n),i&512&&t!==null&&As(t,t.return);break;case 5:if(Fn(e,n),ei(n),i&512&&t!==null&&As(t,t.return),n.flags&32){var r=n.stateNode;try{Oo(r,"")}catch(_){ft(n,n.return,_)}}if(i&4&&(r=n.stateNode,r!=null)){var s=n.memoizedProps,o=t!==null?t.memoizedProps:s,a=n.type,l=n.updateQueue;if(n.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&sg(r,s),ju(a,o);var c=ju(a,s);for(o=0;o<l.length;o+=2){var d=l[o],h=l[o+1];d==="style"?ug(r,h):d==="dangerouslySetInnerHTML"?lg(r,h):d==="children"?Oo(r,h):Gd(r,d,h,c)}switch(a){case"input":Gu(r,s);break;case"textarea":og(r,s);break;case"select":var u=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?bs(r,!!s.multiple,p,!1):u!==!!s.multiple&&(s.defaultValue!=null?bs(r,!!s.multiple,s.defaultValue,!0):bs(r,!!s.multiple,s.multiple?[]:"",!1))}r[jo]=s}catch(_){ft(n,n.return,_)}}break;case 6:if(Fn(e,n),ei(n),i&4){if(n.stateNode===null)throw Error(ne(162));r=n.stateNode,s=n.memoizedProps;try{r.nodeValue=s}catch(_){ft(n,n.return,_)}}break;case 3:if(Fn(e,n),ei(n),i&4&&t!==null&&t.memoizedState.isDehydrated)try{Go(e.containerInfo)}catch(_){ft(n,n.return,_)}break;case 4:Fn(e,n),ei(n);break;case 13:Fn(e,n),ei(n),r=n.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Mf=_t())),i&4&&Hh(n);break;case 22:if(d=t!==null&&t.memoizedState!==null,n.mode&1?(Gt=(c=Gt)||d,Fn(e,n),Gt=c):Fn(e,n),ei(n),i&8192){if(c=n.memoizedState!==null,(n.stateNode.isHidden=c)&&!d&&n.mode&1)for(de=n,d=n.child;d!==null;){for(h=de=d;de!==null;){switch(u=de,p=u.child,u.tag){case 0:case 11:case 14:case 15:Po(4,u,u.return);break;case 1:As(u,u.return);var v=u.stateNode;if(typeof v.componentWillUnmount=="function"){i=u,t=u.return;try{e=i,v.props=e.memoizedProps,v.state=e.memoizedState,v.componentWillUnmount()}catch(_){ft(i,t,_)}}break;case 5:As(u,u.return);break;case 22:if(u.memoizedState!==null){Vh(h);continue}}p!==null?(p.return=u,de=p):Vh(h)}d=d.sibling}e:for(d=null,h=n;;){if(h.tag===5){if(d===null){d=h;try{r=h.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=h.stateNode,l=h.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=cg("display",o))}catch(_){ft(n,n.return,_)}}}else if(h.tag===6){if(d===null)try{h.stateNode.nodeValue=c?"":h.memoizedProps}catch(_){ft(n,n.return,_)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===n)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===n)break e;for(;h.sibling===null;){if(h.return===null||h.return===n)break e;d===h&&(d=null),h=h.return}d===h&&(d=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:Fn(e,n),ei(n),i&4&&Hh(n);break;case 21:break;default:Fn(e,n),ei(n)}}function ei(n){var e=n.flags;if(e&2){try{e:{for(var t=n.return;t!==null;){if(Uv(t)){var i=t;break e}t=t.return}throw Error(ne(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Oo(r,""),i.flags&=-33);var s=kh(n);Ed(n,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,a=kh(n);Md(n,a,o);break;default:throw Error(ne(161))}}catch(l){ft(n,n.return,l)}n.flags&=-3}e&4096&&(n.flags&=-4097)}function Jy(n,e,t){de=n,Ov(n)}function Ov(n,e,t){for(var i=(n.mode&1)!==0;de!==null;){var r=de,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||Ca;if(!o){var a=r.alternate,l=a!==null&&a.memoizedState!==null||Gt;a=Ca;var c=Gt;if(Ca=o,(Gt=l)&&!c)for(de=r;de!==null;)o=de,l=o.child,o.tag===22&&o.memoizedState!==null?Wh(r):l!==null?(l.return=o,de=l):Wh(r);for(;s!==null;)de=s,Ov(s),s=s.sibling;de=r,Ca=a,Gt=c}Gh(n)}else r.subtreeFlags&8772&&s!==null?(s.return=r,de=s):Gh(n)}}function Gh(n){for(;de!==null;){var e=de;if(e.flags&8772){var t=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Gt||sc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!Gt)if(t===null)i.componentDidMount();else{var r=e.elementType===e.type?t.memoizedProps:Gn(e.type,t.memoizedProps);i.componentDidUpdate(r,t.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Ah(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(t=null,e.child!==null)switch(e.child.tag){case 5:t=e.child.stateNode;break;case 1:t=e.child.stateNode}Ah(e,o,t)}break;case 5:var a=e.stateNode;if(t===null&&e.flags&4){t=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&t.focus();break;case"img":l.src&&(t.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var d=c.memoizedState;if(d!==null){var h=d.dehydrated;h!==null&&Go(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ne(163))}Gt||e.flags&512&&Sd(e)}catch(u){ft(e,e.return,u)}}if(e===n){de=null;break}if(t=e.sibling,t!==null){t.return=e.return,de=t;break}de=e.return}}function Vh(n){for(;de!==null;){var e=de;if(e===n){de=null;break}var t=e.sibling;if(t!==null){t.return=e.return,de=t;break}de=e.return}}function Wh(n){for(;de!==null;){var e=de;try{switch(e.tag){case 0:case 11:case 15:var t=e.return;try{sc(4,e)}catch(l){ft(e,t,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){ft(e,r,l)}}var s=e.return;try{Sd(e)}catch(l){ft(e,s,l)}break;case 5:var o=e.return;try{Sd(e)}catch(l){ft(e,o,l)}}}catch(l){ft(e,e.return,l)}if(e===n){de=null;break}var a=e.sibling;if(a!==null){a.return=e.return,de=a;break}de=e.return}}var ex=Math.ceil,Vl=Fi.ReactCurrentDispatcher,xf=Fi.ReactCurrentOwner,Dn=Fi.ReactCurrentBatchConfig,Ge=0,Pt=null,Mt=null,Ut=0,pn=0,Rs=dr(0),Tt=0,Jo=null,kr=0,oc=0,Sf=0,Do=null,en=null,Mf=0,Ws=1/0,Ti=null,Wl=!1,wd=null,ir=null,ba=!1,Zi=null,Xl=0,Io=0,Td=null,_l=-1,yl=0;function $t(){return Ge&6?_t():_l!==-1?_l:_l=_t()}function rr(n){return n.mode&1?Ge&2&&Ut!==0?Ut&-Ut:zy.transition!==null?(yl===0&&(yl=Mg()),yl):(n=je,n!==0||(n=window.event,n=n===void 0?16:bg(n.type)),n):1}function Kn(n,e,t,i){if(50<Io)throw Io=0,Td=null,Error(ne(185));ia(n,t,i),(!(Ge&2)||n!==Pt)&&(n===Pt&&(!(Ge&2)&&(oc|=t),Tt===4&&$i(n,Ut)),an(n,i),t===1&&Ge===0&&!(e.mode&1)&&(Ws=_t()+500,nc&&fr()))}function an(n,e){var t=n.callbackNode;z_(n,e);var i=Cl(n,n===Pt?Ut:0);if(i===0)t!==null&&Jf(t),n.callbackNode=null,n.callbackPriority=0;else if(e=i&-i,n.callbackPriority!==e){if(t!=null&&Jf(t),e===1)n.tag===0?Fy(Xh.bind(null,n)):Yg(Xh.bind(null,n)),Dy(function(){!(Ge&6)&&fr()}),t=null;else{switch(Eg(i)){case 1:t=jd;break;case 4:t=xg;break;case 16:t=Rl;break;case 536870912:t=Sg;break;default:t=Rl}t=qv(t,Bv.bind(null,n))}n.callbackPriority=e,n.callbackNode=t}}function Bv(n,e){if(_l=-1,yl=0,Ge&6)throw Error(ne(327));var t=n.callbackNode;if(Ns()&&n.callbackNode!==t)return null;var i=Cl(n,n===Pt?Ut:0);if(i===0)return null;if(i&30||i&n.expiredLanes||e)e=ql(n,i);else{e=i;var r=Ge;Ge|=2;var s=Hv();(Pt!==n||Ut!==e)&&(Ti=null,Ws=_t()+500,Dr(n,e));do try{ix();break}catch(a){kv(n,a)}while(!0);af(),Vl.current=s,Ge=r,Mt!==null?e=0:(Pt=null,Ut=0,e=Tt)}if(e!==0){if(e===2&&(r=Qu(n),r!==0&&(i=r,e=Ad(n,r))),e===1)throw t=Jo,Dr(n,0),$i(n,i),an(n,_t()),t;if(e===6)$i(n,i);else{if(r=n.current.alternate,!(i&30)&&!tx(r)&&(e=ql(n,i),e===2&&(s=Qu(n),s!==0&&(i=s,e=Ad(n,s))),e===1))throw t=Jo,Dr(n,0),$i(n,i),an(n,_t()),t;switch(n.finishedWork=r,n.finishedLanes=i,e){case 0:case 1:throw Error(ne(345));case 2:Sr(n,en,Ti);break;case 3:if($i(n,i),(i&130023424)===i&&(e=Mf+500-_t(),10<e)){if(Cl(n,0)!==0)break;if(r=n.suspendedLanes,(r&i)!==i){$t(),n.pingedLanes|=n.suspendedLanes&r;break}n.timeoutHandle=od(Sr.bind(null,n,en,Ti),e);break}Sr(n,en,Ti);break;case 4:if($i(n,i),(i&4194240)===i)break;for(e=n.eventTimes,r=-1;0<i;){var o=31-$n(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=_t()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*ex(i/1960))-i,10<i){n.timeoutHandle=od(Sr.bind(null,n,en,Ti),i);break}Sr(n,en,Ti);break;case 5:Sr(n,en,Ti);break;default:throw Error(ne(329))}}}return an(n,_t()),n.callbackNode===t?Bv.bind(null,n):null}function Ad(n,e){var t=Do;return n.current.memoizedState.isDehydrated&&(Dr(n,e).flags|=256),n=ql(n,e),n!==2&&(e=en,en=t,e!==null&&Rd(e)),n}function Rd(n){en===null?en=n:en.push.apply(en,n)}function tx(n){for(var e=n;;){if(e.flags&16384){var t=e.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var i=0;i<t.length;i++){var r=t[i],s=r.getSnapshot;r=r.value;try{if(!Qn(s(),r))return!1}catch{return!1}}}if(t=e.child,e.subtreeFlags&16384&&t!==null)t.return=e,e=t;else{if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function $i(n,e){for(e&=~Sf,e&=~oc,n.suspendedLanes|=e,n.pingedLanes&=~e,n=n.expirationTimes;0<e;){var t=31-$n(e),i=1<<t;n[t]=-1,e&=~i}}function Xh(n){if(Ge&6)throw Error(ne(327));Ns();var e=Cl(n,0);if(!(e&1))return an(n,_t()),null;var t=ql(n,e);if(n.tag!==0&&t===2){var i=Qu(n);i!==0&&(e=i,t=Ad(n,i))}if(t===1)throw t=Jo,Dr(n,0),$i(n,e),an(n,_t()),t;if(t===6)throw Error(ne(345));return n.finishedWork=n.current.alternate,n.finishedLanes=e,Sr(n,en,Ti),an(n,_t()),null}function Ef(n,e){var t=Ge;Ge|=1;try{return n(e)}finally{Ge=t,Ge===0&&(Ws=_t()+500,nc&&fr())}}function Hr(n){Zi!==null&&Zi.tag===0&&!(Ge&6)&&Ns();var e=Ge;Ge|=1;var t=Dn.transition,i=je;try{if(Dn.transition=null,je=1,n)return n()}finally{je=i,Dn.transition=t,Ge=e,!(Ge&6)&&fr()}}function wf(){pn=Rs.current,nt(Rs)}function Dr(n,e){n.finishedWork=null,n.finishedLanes=0;var t=n.timeoutHandle;if(t!==-1&&(n.timeoutHandle=-1,Py(t)),Mt!==null)for(t=Mt.return;t!==null;){var i=t;switch(rf(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&Il();break;case 3:Gs(),nt(sn),nt(Vt),hf();break;case 5:ff(i);break;case 4:Gs();break;case 13:nt(st);break;case 19:nt(st);break;case 10:lf(i.type._context);break;case 22:case 23:wf()}t=t.return}if(Pt=n,Mt=n=sr(n.current,null),Ut=pn=e,Tt=0,Jo=null,Sf=oc=kr=0,en=Do=null,Cr!==null){for(e=0;e<Cr.length;e++)if(t=Cr[e],i=t.interleaved,i!==null){t.interleaved=null;var r=i.next,s=t.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}t.pending=i}Cr=null}return n}function kv(n,e){do{var t=Mt;try{if(af(),ml.current=Gl,Hl){for(var i=ot.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Hl=!1}if(Br=0,Lt=wt=ot=null,Lo=!1,Ko=0,xf.current=null,t===null||t.return===null){Tt=1,Jo=e,Mt=null;break}e:{var s=n,o=t.return,a=t,l=e;if(e=Ut,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,d=a,h=d.tag;if(!(d.mode&1)&&(h===0||h===11||h===15)){var u=d.alternate;u?(d.updateQueue=u.updateQueue,d.memoizedState=u.memoizedState,d.lanes=u.lanes):(d.updateQueue=null,d.memoizedState=null)}var p=Dh(o);if(p!==null){p.flags&=-257,Ih(p,o,a,s,e),p.mode&1&&Ph(s,c,e),e=p,l=c;var v=e.updateQueue;if(v===null){var _=new Set;_.add(l),e.updateQueue=_}else v.add(l);break e}else{if(!(e&1)){Ph(s,c,e),Tf();break e}l=Error(ne(426))}}else if(rt&&a.mode&1){var g=Dh(o);if(g!==null){!(g.flags&65536)&&(g.flags|=256),Ih(g,o,a,s,e),sf(Vs(l,a));break e}}s=l=Vs(l,a),Tt!==4&&(Tt=2),Do===null?Do=[s]:Do.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var f=Ev(s,l,e);Th(s,f);break e;case 1:a=l;var m=s.type,y=s.stateNode;if(!(s.flags&128)&&(typeof m.getDerivedStateFromError=="function"||y!==null&&typeof y.componentDidCatch=="function"&&(ir===null||!ir.has(y)))){s.flags|=65536,e&=-e,s.lanes|=e;var x=wv(s,a,e);Th(s,x);break e}}s=s.return}while(s!==null)}Vv(t)}catch(M){e=M,Mt===t&&t!==null&&(Mt=t=t.return);continue}break}while(!0)}function Hv(){var n=Vl.current;return Vl.current=Gl,n===null?Gl:n}function Tf(){(Tt===0||Tt===3||Tt===2)&&(Tt=4),Pt===null||!(kr&268435455)&&!(oc&268435455)||$i(Pt,Ut)}function ql(n,e){var t=Ge;Ge|=2;var i=Hv();(Pt!==n||Ut!==e)&&(Ti=null,Dr(n,e));do try{nx();break}catch(r){kv(n,r)}while(!0);if(af(),Ge=t,Vl.current=i,Mt!==null)throw Error(ne(261));return Pt=null,Ut=0,Tt}function nx(){for(;Mt!==null;)Gv(Mt)}function ix(){for(;Mt!==null&&!C_();)Gv(Mt)}function Gv(n){var e=Xv(n.alternate,n,pn);n.memoizedProps=n.pendingProps,e===null?Vv(n):Mt=e,xf.current=null}function Vv(n){var e=n;do{var t=e.alternate;if(n=e.return,e.flags&32768){if(t=Ky(t,e),t!==null){t.flags&=32767,Mt=t;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Tt=6,Mt=null;return}}else if(t=$y(t,e,pn),t!==null){Mt=t;return}if(e=e.sibling,e!==null){Mt=e;return}Mt=e=n}while(e!==null);Tt===0&&(Tt=5)}function Sr(n,e,t){var i=je,r=Dn.transition;try{Dn.transition=null,je=1,rx(n,e,t,i)}finally{Dn.transition=r,je=i}return null}function rx(n,e,t,i){do Ns();while(Zi!==null);if(Ge&6)throw Error(ne(327));t=n.finishedWork;var r=n.finishedLanes;if(t===null)return null;if(n.finishedWork=null,n.finishedLanes=0,t===n.current)throw Error(ne(177));n.callbackNode=null,n.callbackPriority=0;var s=t.lanes|t.childLanes;if(O_(n,s),n===Pt&&(Mt=Pt=null,Ut=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||ba||(ba=!0,qv(Rl,function(){return Ns(),null})),s=(t.flags&15990)!==0,t.subtreeFlags&15990||s){s=Dn.transition,Dn.transition=null;var o=je;je=1;var a=Ge;Ge|=4,xf.current=null,Qy(n,t),zv(t,n),wy(rd),bl=!!id,rd=id=null,n.current=t,Jy(t),b_(),Ge=a,je=o,Dn.transition=s}else n.current=t;if(ba&&(ba=!1,Zi=n,Xl=r),s=n.pendingLanes,s===0&&(ir=null),D_(t.stateNode),an(n,_t()),e!==null)for(i=n.onRecoverableError,t=0;t<e.length;t++)r=e[t],i(r.value,{componentStack:r.stack,digest:r.digest});if(Wl)throw Wl=!1,n=wd,wd=null,n;return Xl&1&&n.tag!==0&&Ns(),s=n.pendingLanes,s&1?n===Td?Io++:(Io=0,Td=n):Io=0,fr(),null}function Ns(){if(Zi!==null){var n=Eg(Xl),e=Dn.transition,t=je;try{if(Dn.transition=null,je=16>n?16:n,Zi===null)var i=!1;else{if(n=Zi,Zi=null,Xl=0,Ge&6)throw Error(ne(331));var r=Ge;for(Ge|=4,de=n.current;de!==null;){var s=de,o=s.child;if(de.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var c=a[l];for(de=c;de!==null;){var d=de;switch(d.tag){case 0:case 11:case 15:Po(8,d,s)}var h=d.child;if(h!==null)h.return=d,de=h;else for(;de!==null;){d=de;var u=d.sibling,p=d.return;if(Nv(d),d===c){de=null;break}if(u!==null){u.return=p,de=u;break}de=p}}}var v=s.alternate;if(v!==null){var _=v.child;if(_!==null){v.child=null;do{var g=_.sibling;_.sibling=null,_=g}while(_!==null)}}de=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,de=o;else e:for(;de!==null;){if(s=de,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Po(9,s,s.return)}var f=s.sibling;if(f!==null){f.return=s.return,de=f;break e}de=s.return}}var m=n.current;for(de=m;de!==null;){o=de;var y=o.child;if(o.subtreeFlags&2064&&y!==null)y.return=o,de=y;else e:for(o=m;de!==null;){if(a=de,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:sc(9,a)}}catch(M){ft(a,a.return,M)}if(a===o){de=null;break e}var x=a.sibling;if(x!==null){x.return=a.return,de=x;break e}de=a.return}}if(Ge=r,fr(),ci&&typeof ci.onPostCommitFiberRoot=="function")try{ci.onPostCommitFiberRoot(Zl,n)}catch{}i=!0}return i}finally{je=t,Dn.transition=e}}return!1}function qh(n,e,t){e=Vs(t,e),e=Ev(n,e,1),n=nr(n,e,1),e=$t(),n!==null&&(ia(n,1,e),an(n,e))}function ft(n,e,t){if(n.tag===3)qh(n,n,t);else for(;e!==null;){if(e.tag===3){qh(e,n,t);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(ir===null||!ir.has(i))){n=Vs(t,n),n=wv(e,n,1),e=nr(e,n,1),n=$t(),e!==null&&(ia(e,1,n),an(e,n));break}}e=e.return}}function sx(n,e,t){var i=n.pingCache;i!==null&&i.delete(e),e=$t(),n.pingedLanes|=n.suspendedLanes&t,Pt===n&&(Ut&t)===t&&(Tt===4||Tt===3&&(Ut&130023424)===Ut&&500>_t()-Mf?Dr(n,0):Sf|=t),an(n,e)}function Wv(n,e){e===0&&(n.mode&1?(e=ya,ya<<=1,!(ya&130023424)&&(ya=4194304)):e=1);var t=$t();n=Ni(n,e),n!==null&&(ia(n,e,t),an(n,t))}function ox(n){var e=n.memoizedState,t=0;e!==null&&(t=e.retryLane),Wv(n,t)}function ax(n,e){var t=0;switch(n.tag){case 13:var i=n.stateNode,r=n.memoizedState;r!==null&&(t=r.retryLane);break;case 19:i=n.stateNode;break;default:throw Error(ne(314))}i!==null&&i.delete(e),Wv(n,t)}var Xv;Xv=function(n,e,t){if(n!==null)if(n.memoizedProps!==e.pendingProps||sn.current)nn=!0;else{if(!(n.lanes&t)&&!(e.flags&128))return nn=!1,Yy(n,e,t);nn=!!(n.flags&131072)}else nn=!1,rt&&e.flags&1048576&&$g(e,Fl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;vl(n,e),n=e.pendingProps;var r=Bs(e,Vt.current);Is(e,t),r=mf(null,e,i,n,r,t);var s=gf();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,on(i)?(s=!0,Nl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,uf(e),r.updater=rc,e.stateNode=r,r._reactInternals=e,hd(e,i,n,t),e=gd(null,e,i,!0,s,t)):(e.tag=0,rt&&s&&nf(e),jt(null,e,r,t),e=e.child),e;case 16:i=e.elementType;e:{switch(vl(n,e),n=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=cx(i),n=Gn(i,n),r){case 0:e=md(null,e,i,n,t);break e;case 1:e=Fh(null,e,i,n,t);break e;case 11:e=Nh(null,e,i,n,t);break e;case 14:e=Uh(null,e,i,Gn(i.type,n),t);break e}throw Error(ne(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Gn(i,r),md(n,e,i,r,t);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Gn(i,r),Fh(n,e,i,r,t);case 3:e:{if(Cv(e),n===null)throw Error(ne(387));i=e.pendingProps,s=e.memoizedState,r=s.element,tv(n,e),Bl(e,i,null,t);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Vs(Error(ne(423)),e),e=zh(n,e,i,t,r);break e}else if(i!==r){r=Vs(Error(ne(424)),e),e=zh(n,e,i,t,r);break e}else for(vn=tr(e.stateNode.containerInfo.firstChild),yn=e,rt=!0,Wn=null,t=Jg(e,null,i,t),e.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(ks(),i===r){e=Ui(n,e,t);break e}jt(n,e,i,t)}e=e.child}return e;case 5:return nv(e),n===null&&ud(e),i=e.type,r=e.pendingProps,s=n!==null?n.memoizedProps:null,o=r.children,sd(i,r)?o=null:s!==null&&sd(i,s)&&(e.flags|=32),Rv(n,e),jt(n,e,o,t),e.child;case 6:return n===null&&ud(e),null;case 13:return bv(n,e,t);case 4:return df(e,e.stateNode.containerInfo),i=e.pendingProps,n===null?e.child=Hs(e,null,i,t):jt(n,e,i,t),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Gn(i,r),Nh(n,e,i,r,t);case 7:return jt(n,e,e.pendingProps,t),e.child;case 8:return jt(n,e,e.pendingProps.children,t),e.child;case 12:return jt(n,e,e.pendingProps.children,t),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,Je(zl,i._currentValue),i._currentValue=o,s!==null)if(Qn(s.value,o)){if(s.children===r.children&&!sn.current){e=Ui(n,e,t);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Li(-1,t&-t),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var d=c.pending;d===null?l.next=l:(l.next=d.next,d.next=l),c.pending=l}}s.lanes|=t,l=s.alternate,l!==null&&(l.lanes|=t),dd(s.return,t,e),a.lanes|=t;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(ne(341));o.lanes|=t,a=o.alternate,a!==null&&(a.lanes|=t),dd(o,t,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}jt(n,e,r.children,t),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Is(e,t),r=In(r),i=i(r),e.flags|=1,jt(n,e,i,t),e.child;case 14:return i=e.type,r=Gn(i,e.pendingProps),r=Gn(i.type,r),Uh(n,e,i,r,t);case 15:return Tv(n,e,e.type,e.pendingProps,t);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Gn(i,r),vl(n,e),e.tag=1,on(i)?(n=!0,Nl(e)):n=!1,Is(e,t),Mv(e,i,r),hd(e,i,r,t),gd(null,e,i,!0,n,t);case 19:return Lv(n,e,t);case 22:return Av(n,e,t)}throw Error(ne(156,e.tag))};function qv(n,e){return yg(n,e)}function lx(n,e,t,i){this.tag=n,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Pn(n,e,t,i){return new lx(n,e,t,i)}function Af(n){return n=n.prototype,!(!n||!n.isReactComponent)}function cx(n){if(typeof n=="function")return Af(n)?1:0;if(n!=null){if(n=n.$$typeof,n===Wd)return 11;if(n===Xd)return 14}return 2}function sr(n,e){var t=n.alternate;return t===null?(t=Pn(n.tag,e,n.key,n.mode),t.elementType=n.elementType,t.type=n.type,t.stateNode=n.stateNode,t.alternate=n,n.alternate=t):(t.pendingProps=e,t.type=n.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=n.flags&14680064,t.childLanes=n.childLanes,t.lanes=n.lanes,t.child=n.child,t.memoizedProps=n.memoizedProps,t.memoizedState=n.memoizedState,t.updateQueue=n.updateQueue,e=n.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},t.sibling=n.sibling,t.index=n.index,t.ref=n.ref,t}function xl(n,e,t,i,r,s){var o=2;if(i=n,typeof n=="function")Af(n)&&(o=1);else if(typeof n=="string")o=5;else e:switch(n){case vs:return Ir(t.children,r,s,e);case Vd:o=8,r|=8;break;case zu:return n=Pn(12,t,e,r|2),n.elementType=zu,n.lanes=s,n;case Ou:return n=Pn(13,t,e,r),n.elementType=Ou,n.lanes=s,n;case Bu:return n=Pn(19,t,e,r),n.elementType=Bu,n.lanes=s,n;case ng:return ac(t,r,s,e);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case eg:o=10;break e;case tg:o=9;break e;case Wd:o=11;break e;case Xd:o=14;break e;case qi:o=16,i=null;break e}throw Error(ne(130,n==null?n:typeof n,""))}return e=Pn(o,t,e,r),e.elementType=n,e.type=i,e.lanes=s,e}function Ir(n,e,t,i){return n=Pn(7,n,i,e),n.lanes=t,n}function ac(n,e,t,i){return n=Pn(22,n,i,e),n.elementType=ng,n.lanes=t,n.stateNode={isHidden:!1},n}function qc(n,e,t){return n=Pn(6,n,null,e),n.lanes=t,n}function jc(n,e,t){return e=Pn(4,n.children!==null?n.children:[],n.key,e),e.lanes=t,e.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},e}function ux(n,e,t,i,r){this.tag=e,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Rc(0),this.expirationTimes=Rc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Rc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Rf(n,e,t,i,r,s,o,a,l){return n=new ux(n,e,t,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Pn(3,null,null,e),n.current=s,s.stateNode=n,s.memoizedState={element:i,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},uf(s),n}function dx(n,e,t){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:gs,key:i==null?null:""+i,children:n,containerInfo:e,implementation:t}}function jv(n){if(!n)return lr;n=n._reactInternals;e:{if(jr(n)!==n||n.tag!==1)throw Error(ne(170));var e=n;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(on(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ne(171))}if(n.tag===1){var t=n.type;if(on(t))return jg(n,t,e)}return e}function Yv(n,e,t,i,r,s,o,a,l){return n=Rf(t,i,!0,n,r,s,o,a,l),n.context=jv(null),t=n.current,i=$t(),r=rr(t),s=Li(i,r),s.callback=e??null,nr(t,s,r),n.current.lanes=r,ia(n,r,i),an(n,i),n}function lc(n,e,t,i){var r=e.current,s=$t(),o=rr(r);return t=jv(t),e.context===null?e.context=t:e.pendingContext=t,e=Li(s,o),e.payload={element:n},i=i===void 0?null:i,i!==null&&(e.callback=i),n=nr(r,e,o),n!==null&&(Kn(n,r,o,s),pl(n,r,o)),o}function jl(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function jh(n,e){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var t=n.retryLane;n.retryLane=t!==0&&t<e?t:e}}function Cf(n,e){jh(n,e),(n=n.alternate)&&jh(n,e)}function fx(){return null}var $v=typeof reportError=="function"?reportError:function(n){console.error(n)};function bf(n){this._internalRoot=n}cc.prototype.render=bf.prototype.render=function(n){var e=this._internalRoot;if(e===null)throw Error(ne(409));lc(n,e,null,null)};cc.prototype.unmount=bf.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var e=n.containerInfo;Hr(function(){lc(null,n,null,null)}),e[Ii]=null}};function cc(n){this._internalRoot=n}cc.prototype.unstable_scheduleHydration=function(n){if(n){var e=Ag();n={blockedOn:null,target:n,priority:e};for(var t=0;t<Yi.length&&e!==0&&e<Yi[t].priority;t++);Yi.splice(t,0,n),t===0&&Cg(n)}};function Lf(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function uc(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Yh(){}function hx(n,e,t,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=jl(o);s.call(c)}}var o=Yv(e,i,n,0,null,!1,!1,"",Yh);return n._reactRootContainer=o,n[Ii]=o.current,Xo(n.nodeType===8?n.parentNode:n),Hr(),o}for(;r=n.lastChild;)n.removeChild(r);if(typeof i=="function"){var a=i;i=function(){var c=jl(l);a.call(c)}}var l=Rf(n,0,!1,null,null,!1,!1,"",Yh);return n._reactRootContainer=l,n[Ii]=l.current,Xo(n.nodeType===8?n.parentNode:n),Hr(function(){lc(e,l,t,i)}),l}function dc(n,e,t,i,r){var s=t._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var a=r;r=function(){var l=jl(o);a.call(l)}}lc(e,o,n,r)}else o=hx(t,e,n,r,i);return jl(o)}wg=function(n){switch(n.tag){case 3:var e=n.stateNode;if(e.current.memoizedState.isDehydrated){var t=xo(e.pendingLanes);t!==0&&(Yd(e,t|1),an(e,_t()),!(Ge&6)&&(Ws=_t()+500,fr()))}break;case 13:Hr(function(){var i=Ni(n,1);if(i!==null){var r=$t();Kn(i,n,1,r)}}),Cf(n,1)}};$d=function(n){if(n.tag===13){var e=Ni(n,134217728);if(e!==null){var t=$t();Kn(e,n,134217728,t)}Cf(n,134217728)}};Tg=function(n){if(n.tag===13){var e=rr(n),t=Ni(n,e);if(t!==null){var i=$t();Kn(t,n,e,i)}Cf(n,e)}};Ag=function(){return je};Rg=function(n,e){var t=je;try{return je=n,e()}finally{je=t}};$u=function(n,e,t){switch(e){case"input":if(Gu(n,t),e=t.name,t.type==="radio"&&e!=null){for(t=n;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<t.length;e++){var i=t[e];if(i!==n&&i.form===n.form){var r=tc(i);if(!r)throw Error(ne(90));rg(i),Gu(i,r)}}}break;case"textarea":og(n,t);break;case"select":e=t.value,e!=null&&bs(n,!!t.multiple,e,!1)}};hg=Ef;pg=Hr;var px={usingClientEntryPoint:!1,Events:[sa,Ss,tc,dg,fg,Ef]},lo={findFiberByHostInstance:Rr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},mx={bundleType:lo.bundleType,version:lo.version,rendererPackageName:lo.rendererPackageName,rendererConfig:lo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Fi.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=vg(n),n===null?null:n.stateNode},findFiberByHostInstance:lo.findFiberByHostInstance||fx,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var La=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!La.isDisabled&&La.supportsFiber)try{Zl=La.inject(mx),ci=La}catch{}}Mn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=px;Mn.createPortal=function(n,e){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Lf(e))throw Error(ne(200));return dx(n,e,null,t)};Mn.createRoot=function(n,e){if(!Lf(n))throw Error(ne(299));var t=!1,i="",r=$v;return e!=null&&(e.unstable_strictMode===!0&&(t=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Rf(n,1,!1,null,null,t,!1,i,r),n[Ii]=e.current,Xo(n.nodeType===8?n.parentNode:n),new bf(e)};Mn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var e=n._reactInternals;if(e===void 0)throw typeof n.render=="function"?Error(ne(188)):(n=Object.keys(n).join(","),Error(ne(268,n)));return n=vg(e),n=n===null?null:n.stateNode,n};Mn.flushSync=function(n){return Hr(n)};Mn.hydrate=function(n,e,t){if(!uc(e))throw Error(ne(200));return dc(null,n,e,!0,t)};Mn.hydrateRoot=function(n,e,t){if(!Lf(n))throw Error(ne(405));var i=t!=null&&t.hydratedSources||null,r=!1,s="",o=$v;if(t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),e=Yv(e,null,n,1,t??null,r,!1,s,o),n[Ii]=e.current,Xo(n),i)for(n=0;n<i.length;n++)t=i[n],r=t._getVersion,r=r(t._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[t,r]:e.mutableSourceEagerHydrationData.push(t,r);return new cc(e)};Mn.render=function(n,e,t){if(!uc(e))throw Error(ne(200));return dc(null,n,e,!1,t)};Mn.unmountComponentAtNode=function(n){if(!uc(n))throw Error(ne(40));return n._reactRootContainer?(Hr(function(){dc(null,null,n,!1,function(){n._reactRootContainer=null,n[Ii]=null})}),!0):!1};Mn.unstable_batchedUpdates=Ef;Mn.unstable_renderSubtreeIntoContainer=function(n,e,t,i){if(!uc(t))throw Error(ne(200));if(n==null||n._reactInternals===void 0)throw Error(ne(38));return dc(n,e,t,!1,i)};Mn.version="18.3.1-next-f1338f8080-20240426";function Kv(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Kv)}catch(n){console.error(n)}}Kv(),Km.exports=Mn;var gx=Km.exports,$h=gx;Uu.createRoot=$h.createRoot,Uu.hydrateRoot=$h.hydrateRoot;class Yn{constructor(e){e===void 0&&(e=[0,0,0,0,0,0,0,0,0]),this.elements=e}identity(){const e=this.elements;e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=0,e[7]=0,e[8]=1}setZero(){const e=this.elements;e[0]=0,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=0,e[6]=0,e[7]=0,e[8]=0}setTrace(e){const t=this.elements;t[0]=e.x,t[4]=e.y,t[8]=e.z}getTrace(e){e===void 0&&(e=new S);const t=this.elements;return e.x=t[0],e.y=t[4],e.z=t[8],e}vmult(e,t){t===void 0&&(t=new S);const i=this.elements,r=e.x,s=e.y,o=e.z;return t.x=i[0]*r+i[1]*s+i[2]*o,t.y=i[3]*r+i[4]*s+i[5]*o,t.z=i[6]*r+i[7]*s+i[8]*o,t}smult(e){for(let t=0;t<this.elements.length;t++)this.elements[t]*=e}mmult(e,t){t===void 0&&(t=new Yn);const i=this.elements,r=e.elements,s=t.elements,o=i[0],a=i[1],l=i[2],c=i[3],d=i[4],h=i[5],u=i[6],p=i[7],v=i[8],_=r[0],g=r[1],f=r[2],m=r[3],y=r[4],x=r[5],M=r[6],w=r[7],R=r[8];return s[0]=o*_+a*m+l*M,s[1]=o*g+a*y+l*w,s[2]=o*f+a*x+l*R,s[3]=c*_+d*m+h*M,s[4]=c*g+d*y+h*w,s[5]=c*f+d*x+h*R,s[6]=u*_+p*m+v*M,s[7]=u*g+p*y+v*w,s[8]=u*f+p*x+v*R,t}scale(e,t){t===void 0&&(t=new Yn);const i=this.elements,r=t.elements;for(let s=0;s!==3;s++)r[3*s+0]=e.x*i[3*s+0],r[3*s+1]=e.y*i[3*s+1],r[3*s+2]=e.z*i[3*s+2];return t}solve(e,t){t===void 0&&(t=new S);const i=3,r=4,s=[];let o,a;for(o=0;o<i*r;o++)s.push(0);for(o=0;o<3;o++)for(a=0;a<3;a++)s[o+r*a]=this.elements[o+3*a];s[3+4*0]=e.x,s[3+4*1]=e.y,s[3+4*2]=e.z;let l=3;const c=l;let d;const h=4;let u;do{if(o=c-l,s[o+r*o]===0){for(a=o+1;a<c;a++)if(s[o+r*a]!==0){d=h;do u=h-d,s[u+r*o]+=s[u+r*a];while(--d);break}}if(s[o+r*o]!==0)for(a=o+1;a<c;a++){const p=s[o+r*a]/s[o+r*o];d=h;do u=h-d,s[u+r*a]=u<=o?0:s[u+r*a]-s[u+r*o]*p;while(--d)}}while(--l);if(t.z=s[2*r+3]/s[2*r+2],t.y=(s[1*r+3]-s[1*r+2]*t.z)/s[1*r+1],t.x=(s[0*r+3]-s[0*r+2]*t.z-s[0*r+1]*t.y)/s[0*r+0],isNaN(t.x)||isNaN(t.y)||isNaN(t.z)||t.x===1/0||t.y===1/0||t.z===1/0)throw`Could not solve equation! Got x=[${t.toString()}], b=[${e.toString()}], A=[${this.toString()}]`;return t}e(e,t,i){if(i===void 0)return this.elements[t+3*e];this.elements[t+3*e]=i}copy(e){for(let t=0;t<e.elements.length;t++)this.elements[t]=e.elements[t];return this}toString(){let e="";const t=",";for(let i=0;i<9;i++)e+=this.elements[i]+t;return e}reverse(e){e===void 0&&(e=new Yn);const t=3,i=6,r=vx;let s,o;for(s=0;s<3;s++)for(o=0;o<3;o++)r[s+i*o]=this.elements[s+3*o];r[3+6*0]=1,r[3+6*1]=0,r[3+6*2]=0,r[4+6*0]=0,r[4+6*1]=1,r[4+6*2]=0,r[5+6*0]=0,r[5+6*1]=0,r[5+6*2]=1;let a=3;const l=a;let c;const d=i;let h;do{if(s=l-a,r[s+i*s]===0){for(o=s+1;o<l;o++)if(r[s+i*o]!==0){c=d;do h=d-c,r[h+i*s]+=r[h+i*o];while(--c);break}}if(r[s+i*s]!==0)for(o=s+1;o<l;o++){const u=r[s+i*o]/r[s+i*s];c=d;do h=d-c,r[h+i*o]=h<=s?0:r[h+i*o]-r[h+i*s]*u;while(--c)}}while(--a);s=2;do{o=s-1;do{const u=r[s+i*o]/r[s+i*s];c=i;do h=i-c,r[h+i*o]=r[h+i*o]-r[h+i*s]*u;while(--c)}while(o--)}while(--s);s=2;do{const u=1/r[s+i*s];c=i;do h=i-c,r[h+i*s]=r[h+i*s]*u;while(--c)}while(s--);s=2;do{o=2;do{if(h=r[t+o+i*s],isNaN(h)||h===1/0)throw`Could not reverse! A=[${this.toString()}]`;e.e(s,o,h)}while(o--)}while(s--);return e}setRotationFromQuaternion(e){const t=e.x,i=e.y,r=e.z,s=e.w,o=t+t,a=i+i,l=r+r,c=t*o,d=t*a,h=t*l,u=i*a,p=i*l,v=r*l,_=s*o,g=s*a,f=s*l,m=this.elements;return m[3*0+0]=1-(u+v),m[3*0+1]=d-f,m[3*0+2]=h+g,m[3*1+0]=d+f,m[3*1+1]=1-(c+v),m[3*1+2]=p-_,m[3*2+0]=h-g,m[3*2+1]=p+_,m[3*2+2]=1-(c+u),this}transpose(e){e===void 0&&(e=new Yn);const t=this.elements,i=e.elements;let r;return i[0]=t[0],i[4]=t[4],i[8]=t[8],r=t[1],i[1]=t[3],i[3]=r,r=t[2],i[2]=t[6],i[6]=r,r=t[5],i[5]=t[7],i[7]=r,e}}const vx=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];class S{constructor(e,t,i){e===void 0&&(e=0),t===void 0&&(t=0),i===void 0&&(i=0),this.x=e,this.y=t,this.z=i}cross(e,t){t===void 0&&(t=new S);const i=e.x,r=e.y,s=e.z,o=this.x,a=this.y,l=this.z;return t.x=a*s-l*r,t.y=l*i-o*s,t.z=o*r-a*i,t}set(e,t,i){return this.x=e,this.y=t,this.z=i,this}setZero(){this.x=this.y=this.z=0}vadd(e,t){if(t)t.x=e.x+this.x,t.y=e.y+this.y,t.z=e.z+this.z;else return new S(this.x+e.x,this.y+e.y,this.z+e.z)}vsub(e,t){if(t)t.x=this.x-e.x,t.y=this.y-e.y,t.z=this.z-e.z;else return new S(this.x-e.x,this.y-e.y,this.z-e.z)}crossmat(){return new Yn([0,-this.z,this.y,this.z,0,-this.x,-this.y,this.x,0])}normalize(){const e=this.x,t=this.y,i=this.z,r=Math.sqrt(e*e+t*t+i*i);if(r>0){const s=1/r;this.x*=s,this.y*=s,this.z*=s}else this.x=0,this.y=0,this.z=0;return r}unit(e){e===void 0&&(e=new S);const t=this.x,i=this.y,r=this.z;let s=Math.sqrt(t*t+i*i+r*r);return s>0?(s=1/s,e.x=t*s,e.y=i*s,e.z=r*s):(e.x=1,e.y=0,e.z=0),e}length(){const e=this.x,t=this.y,i=this.z;return Math.sqrt(e*e+t*t+i*i)}lengthSquared(){return this.dot(this)}distanceTo(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z;return Math.sqrt((s-t)*(s-t)+(o-i)*(o-i)+(a-r)*(a-r))}distanceSquared(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z;return(s-t)*(s-t)+(o-i)*(o-i)+(a-r)*(a-r)}scale(e,t){t===void 0&&(t=new S);const i=this.x,r=this.y,s=this.z;return t.x=e*i,t.y=e*r,t.z=e*s,t}vmul(e,t){return t===void 0&&(t=new S),t.x=e.x*this.x,t.y=e.y*this.y,t.z=e.z*this.z,t}addScaledVector(e,t,i){return i===void 0&&(i=new S),i.x=this.x+e*t.x,i.y=this.y+e*t.y,i.z=this.z+e*t.z,i}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}isZero(){return this.x===0&&this.y===0&&this.z===0}negate(e){return e===void 0&&(e=new S),e.x=-this.x,e.y=-this.y,e.z=-this.z,e}tangents(e,t){const i=this.length();if(i>0){const r=_x,s=1/i;r.set(this.x*s,this.y*s,this.z*s);const o=yx;Math.abs(r.x)<.9?(o.set(1,0,0),r.cross(o,e)):(o.set(0,1,0),r.cross(o,e)),r.cross(e,t)}else e.set(1,0,0),t.set(0,1,0)}toString(){return`${this.x},${this.y},${this.z}`}toArray(){return[this.x,this.y,this.z]}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}lerp(e,t,i){const r=this.x,s=this.y,o=this.z;i.x=r+(e.x-r)*t,i.y=s+(e.y-s)*t,i.z=o+(e.z-o)*t}almostEquals(e,t){return t===void 0&&(t=1e-6),!(Math.abs(this.x-e.x)>t||Math.abs(this.y-e.y)>t||Math.abs(this.z-e.z)>t)}almostZero(e){return e===void 0&&(e=1e-6),!(Math.abs(this.x)>e||Math.abs(this.y)>e||Math.abs(this.z)>e)}isAntiparallelTo(e,t){return this.negate(Kh),Kh.almostEquals(e,t)}clone(){return new S(this.x,this.y,this.z)}}S.ZERO=new S(0,0,0);S.UNIT_X=new S(1,0,0);S.UNIT_Y=new S(0,1,0);S.UNIT_Z=new S(0,0,1);const _x=new S,yx=new S,Kh=new S;class wn{constructor(e){e===void 0&&(e={}),this.lowerBound=new S,this.upperBound=new S,e.lowerBound&&this.lowerBound.copy(e.lowerBound),e.upperBound&&this.upperBound.copy(e.upperBound)}setFromPoints(e,t,i,r){const s=this.lowerBound,o=this.upperBound,a=i;s.copy(e[0]),a&&a.vmult(s,s),o.copy(s);for(let l=1;l<e.length;l++){let c=e[l];a&&(a.vmult(c,Zh),c=Zh),c.x>o.x&&(o.x=c.x),c.x<s.x&&(s.x=c.x),c.y>o.y&&(o.y=c.y),c.y<s.y&&(s.y=c.y),c.z>o.z&&(o.z=c.z),c.z<s.z&&(s.z=c.z)}return t&&(t.vadd(s,s),t.vadd(o,o)),r&&(s.x-=r,s.y-=r,s.z-=r,o.x+=r,o.y+=r,o.z+=r),this}copy(e){return this.lowerBound.copy(e.lowerBound),this.upperBound.copy(e.upperBound),this}clone(){return new wn().copy(this)}extend(e){this.lowerBound.x=Math.min(this.lowerBound.x,e.lowerBound.x),this.upperBound.x=Math.max(this.upperBound.x,e.upperBound.x),this.lowerBound.y=Math.min(this.lowerBound.y,e.lowerBound.y),this.upperBound.y=Math.max(this.upperBound.y,e.upperBound.y),this.lowerBound.z=Math.min(this.lowerBound.z,e.lowerBound.z),this.upperBound.z=Math.max(this.upperBound.z,e.upperBound.z)}overlaps(e){const t=this.lowerBound,i=this.upperBound,r=e.lowerBound,s=e.upperBound,o=r.x<=i.x&&i.x<=s.x||t.x<=s.x&&s.x<=i.x,a=r.y<=i.y&&i.y<=s.y||t.y<=s.y&&s.y<=i.y,l=r.z<=i.z&&i.z<=s.z||t.z<=s.z&&s.z<=i.z;return o&&a&&l}volume(){const e=this.lowerBound,t=this.upperBound;return(t.x-e.x)*(t.y-e.y)*(t.z-e.z)}contains(e){const t=this.lowerBound,i=this.upperBound,r=e.lowerBound,s=e.upperBound;return t.x<=r.x&&i.x>=s.x&&t.y<=r.y&&i.y>=s.y&&t.z<=r.z&&i.z>=s.z}getCorners(e,t,i,r,s,o,a,l){const c=this.lowerBound,d=this.upperBound;e.copy(c),t.set(d.x,c.y,c.z),i.set(d.x,d.y,c.z),r.set(c.x,d.y,d.z),s.set(d.x,c.y,d.z),o.set(c.x,d.y,c.z),a.set(c.x,c.y,d.z),l.copy(d)}toLocalFrame(e,t){const i=Qh,r=i[0],s=i[1],o=i[2],a=i[3],l=i[4],c=i[5],d=i[6],h=i[7];this.getCorners(r,s,o,a,l,c,d,h);for(let u=0;u!==8;u++){const p=i[u];e.pointToLocal(p,p)}return t.setFromPoints(i)}toWorldFrame(e,t){const i=Qh,r=i[0],s=i[1],o=i[2],a=i[3],l=i[4],c=i[5],d=i[6],h=i[7];this.getCorners(r,s,o,a,l,c,d,h);for(let u=0;u!==8;u++){const p=i[u];e.pointToWorld(p,p)}return t.setFromPoints(i)}overlapsRay(e){const{direction:t,from:i}=e,r=1/t.x,s=1/t.y,o=1/t.z,a=(this.lowerBound.x-i.x)*r,l=(this.upperBound.x-i.x)*r,c=(this.lowerBound.y-i.y)*s,d=(this.upperBound.y-i.y)*s,h=(this.lowerBound.z-i.z)*o,u=(this.upperBound.z-i.z)*o,p=Math.max(Math.max(Math.min(a,l),Math.min(c,d)),Math.min(h,u)),v=Math.min(Math.min(Math.max(a,l),Math.max(c,d)),Math.max(h,u));return!(v<0||p>v)}}const Zh=new S,Qh=[new S,new S,new S,new S,new S,new S,new S,new S];class Jh{constructor(){this.matrix=[]}get(e,t){let{index:i}=e,{index:r}=t;if(r>i){const s=r;r=i,i=s}return this.matrix[(i*(i+1)>>1)+r-1]}set(e,t,i){let{index:r}=e,{index:s}=t;if(s>r){const o=s;s=r,r=o}this.matrix[(r*(r+1)>>1)+s-1]=i?1:0}reset(){for(let e=0,t=this.matrix.length;e!==t;e++)this.matrix[e]=0}setNumObjects(e){this.matrix.length=e*(e-1)>>1}}class Zv{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;return i[e]===void 0&&(i[e]=[]),i[e].includes(t)||i[e].push(t),this}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return!!(i[e]!==void 0&&i[e].includes(t))}hasAnyEventListener(e){return this._listeners===void 0?!1:this._listeners[e]!==void 0}removeEventListener(e,t){if(this._listeners===void 0)return this;const i=this._listeners;if(i[e]===void 0)return this;const r=i[e].indexOf(t);return r!==-1&&i[e].splice(r,1),this}dispatchEvent(e){if(this._listeners===void 0)return this;const i=this._listeners[e.type];if(i!==void 0){e.target=this;for(let r=0,s=i.length;r<s;r++)i[r].call(this,e)}return this}}let mn=class Mr{constructor(e,t,i,r){e===void 0&&(e=0),t===void 0&&(t=0),i===void 0&&(i=0),r===void 0&&(r=1),this.x=e,this.y=t,this.z=i,this.w=r}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}toString(){return`${this.x},${this.y},${this.z},${this.w}`}toArray(){return[this.x,this.y,this.z,this.w]}setFromAxisAngle(e,t){const i=Math.sin(t*.5);return this.x=e.x*i,this.y=e.y*i,this.z=e.z*i,this.w=Math.cos(t*.5),this}toAxisAngle(e){e===void 0&&(e=new S),this.normalize();const t=2*Math.acos(this.w),i=Math.sqrt(1-this.w*this.w);return i<.001?(e.x=this.x,e.y=this.y,e.z=this.z):(e.x=this.x/i,e.y=this.y/i,e.z=this.z/i),[e,t]}setFromVectors(e,t){if(e.isAntiparallelTo(t)){const i=xx,r=Sx;e.tangents(i,r),this.setFromAxisAngle(i,Math.PI)}else{const i=e.cross(t);this.x=i.x,this.y=i.y,this.z=i.z,this.w=Math.sqrt(e.length()**2*t.length()**2)+e.dot(t),this.normalize()}return this}mult(e,t){t===void 0&&(t=new Mr);const i=this.x,r=this.y,s=this.z,o=this.w,a=e.x,l=e.y,c=e.z,d=e.w;return t.x=i*d+o*a+r*c-s*l,t.y=r*d+o*l+s*a-i*c,t.z=s*d+o*c+i*l-r*a,t.w=o*d-i*a-r*l-s*c,t}inverse(e){e===void 0&&(e=new Mr);const t=this.x,i=this.y,r=this.z,s=this.w;this.conjugate(e);const o=1/(t*t+i*i+r*r+s*s);return e.x*=o,e.y*=o,e.z*=o,e.w*=o,e}conjugate(e){return e===void 0&&(e=new Mr),e.x=-this.x,e.y=-this.y,e.z=-this.z,e.w=this.w,e}normalize(){let e=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);return e===0?(this.x=0,this.y=0,this.z=0,this.w=0):(e=1/e,this.x*=e,this.y*=e,this.z*=e,this.w*=e),this}normalizeFast(){const e=(3-(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w))/2;return e===0?(this.x=0,this.y=0,this.z=0,this.w=0):(this.x*=e,this.y*=e,this.z*=e,this.w*=e),this}vmult(e,t){t===void 0&&(t=new S);const i=e.x,r=e.y,s=e.z,o=this.x,a=this.y,l=this.z,c=this.w,d=c*i+a*s-l*r,h=c*r+l*i-o*s,u=c*s+o*r-a*i,p=-o*i-a*r-l*s;return t.x=d*c+p*-o+h*-l-u*-a,t.y=h*c+p*-a+u*-o-d*-l,t.z=u*c+p*-l+d*-a-h*-o,t}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w,this}toEuler(e,t){t===void 0&&(t="YZX");let i,r,s;const o=this.x,a=this.y,l=this.z,c=this.w;switch(t){case"YZX":const d=o*a+l*c;if(d>.499&&(i=2*Math.atan2(o,c),r=Math.PI/2,s=0),d<-.499&&(i=-2*Math.atan2(o,c),r=-Math.PI/2,s=0),i===void 0){const h=o*o,u=a*a,p=l*l;i=Math.atan2(2*a*c-2*o*l,1-2*u-2*p),r=Math.asin(2*d),s=Math.atan2(2*o*c-2*a*l,1-2*h-2*p)}break;default:throw new Error(`Euler order ${t} not supported yet.`)}e.y=i,e.z=r,e.x=s}setFromEuler(e,t,i,r){r===void 0&&(r="XYZ");const s=Math.cos(e/2),o=Math.cos(t/2),a=Math.cos(i/2),l=Math.sin(e/2),c=Math.sin(t/2),d=Math.sin(i/2);return r==="XYZ"?(this.x=l*o*a+s*c*d,this.y=s*c*a-l*o*d,this.z=s*o*d+l*c*a,this.w=s*o*a-l*c*d):r==="YXZ"?(this.x=l*o*a+s*c*d,this.y=s*c*a-l*o*d,this.z=s*o*d-l*c*a,this.w=s*o*a+l*c*d):r==="ZXY"?(this.x=l*o*a-s*c*d,this.y=s*c*a+l*o*d,this.z=s*o*d+l*c*a,this.w=s*o*a-l*c*d):r==="ZYX"?(this.x=l*o*a-s*c*d,this.y=s*c*a+l*o*d,this.z=s*o*d-l*c*a,this.w=s*o*a+l*c*d):r==="YZX"?(this.x=l*o*a+s*c*d,this.y=s*c*a+l*o*d,this.z=s*o*d-l*c*a,this.w=s*o*a-l*c*d):r==="XZY"&&(this.x=l*o*a-s*c*d,this.y=s*c*a-l*o*d,this.z=s*o*d+l*c*a,this.w=s*o*a+l*c*d),this}clone(){return new Mr(this.x,this.y,this.z,this.w)}slerp(e,t,i){i===void 0&&(i=new Mr);const r=this.x,s=this.y,o=this.z,a=this.w;let l=e.x,c=e.y,d=e.z,h=e.w,u,p,v,_,g;return p=r*l+s*c+o*d+a*h,p<0&&(p=-p,l=-l,c=-c,d=-d,h=-h),1-p>1e-6?(u=Math.acos(p),v=Math.sin(u),_=Math.sin((1-t)*u)/v,g=Math.sin(t*u)/v):(_=1-t,g=t),i.x=_*r+g*l,i.y=_*s+g*c,i.z=_*o+g*d,i.w=_*a+g*h,i}integrate(e,t,i,r){r===void 0&&(r=new Mr);const s=e.x*i.x,o=e.y*i.y,a=e.z*i.z,l=this.x,c=this.y,d=this.z,h=this.w,u=t*.5;return r.x+=u*(s*h+o*d-a*c),r.y+=u*(o*h+a*l-s*d),r.z+=u*(a*h+s*c-o*l),r.w+=u*(-s*l-o*c-a*d),r}};const xx=new S,Sx=new S,Mx={SPHERE:1,PLANE:2,BOX:4,COMPOUND:8,CONVEXPOLYHEDRON:16,HEIGHTFIELD:32,PARTICLE:64,CYLINDER:128,TRIMESH:256};class he{constructor(e){e===void 0&&(e={}),this.id=he.idCounter++,this.type=e.type||0,this.boundingSphereRadius=0,this.collisionResponse=e.collisionResponse?e.collisionResponse:!0,this.collisionFilterGroup=e.collisionFilterGroup!==void 0?e.collisionFilterGroup:1,this.collisionFilterMask=e.collisionFilterMask!==void 0?e.collisionFilterMask:-1,this.material=e.material?e.material:null,this.body=null}updateBoundingSphereRadius(){throw`computeBoundingSphereRadius() not implemented for shape type ${this.type}`}volume(){throw`volume() not implemented for shape type ${this.type}`}calculateLocalInertia(e,t){throw`calculateLocalInertia() not implemented for shape type ${this.type}`}calculateWorldAABB(e,t,i,r){throw`calculateWorldAABB() not implemented for shape type ${this.type}`}}he.idCounter=0;he.types=Mx;class qe{constructor(e){e===void 0&&(e={}),this.position=new S,this.quaternion=new mn,e.position&&this.position.copy(e.position),e.quaternion&&this.quaternion.copy(e.quaternion)}pointToLocal(e,t){return qe.pointToLocalFrame(this.position,this.quaternion,e,t)}pointToWorld(e,t){return qe.pointToWorldFrame(this.position,this.quaternion,e,t)}vectorToWorldFrame(e,t){return t===void 0&&(t=new S),this.quaternion.vmult(e,t),t}static pointToLocalFrame(e,t,i,r){return r===void 0&&(r=new S),i.vsub(e,r),t.conjugate(ep),ep.vmult(r,r),r}static pointToWorldFrame(e,t,i,r){return r===void 0&&(r=new S),t.vmult(i,r),r.vadd(e,r),r}static vectorToWorldFrame(e,t,i){return i===void 0&&(i=new S),e.vmult(t,i),i}static vectorToLocalFrame(e,t,i,r){return r===void 0&&(r=new S),t.w*=-1,t.vmult(i,r),t.w*=-1,r}}const ep=new mn;class No extends he{constructor(e){e===void 0&&(e={});const{vertices:t=[],faces:i=[],normals:r=[],axes:s,boundingSphereRadius:o}=e;super({type:he.types.CONVEXPOLYHEDRON}),this.vertices=t,this.faces=i,this.faceNormals=r,this.faceNormals.length===0&&this.computeNormals(),o?this.boundingSphereRadius=o:this.updateBoundingSphereRadius(),this.worldVertices=[],this.worldVerticesNeedsUpdate=!0,this.worldFaceNormals=[],this.worldFaceNormalsNeedsUpdate=!0,this.uniqueAxes=s?s.slice():null,this.uniqueEdges=[],this.computeEdges()}computeEdges(){const e=this.faces,t=this.vertices,i=this.uniqueEdges;i.length=0;const r=new S;for(let s=0;s!==e.length;s++){const o=e[s],a=o.length;for(let l=0;l!==a;l++){const c=(l+1)%a;t[o[l]].vsub(t[o[c]],r),r.normalize();let d=!1;for(let h=0;h!==i.length;h++)if(i[h].almostEquals(r)||i[h].almostEquals(r)){d=!0;break}d||i.push(r.clone())}}}computeNormals(){this.faceNormals.length=this.faces.length;for(let e=0;e<this.faces.length;e++){for(let r=0;r<this.faces[e].length;r++)if(!this.vertices[this.faces[e][r]])throw new Error(`Vertex ${this.faces[e][r]} not found!`);const t=this.faceNormals[e]||new S;this.getFaceNormal(e,t),t.negate(t),this.faceNormals[e]=t;const i=this.vertices[this.faces[e][0]];if(t.dot(i)<0){console.error(`.faceNormals[${e}] = Vec3(${t.toString()}) looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.`);for(let r=0;r<this.faces[e].length;r++)console.warn(`.vertices[${this.faces[e][r]}] = Vec3(${this.vertices[this.faces[e][r]].toString()})`)}}}getFaceNormal(e,t){const i=this.faces[e],r=this.vertices[i[0]],s=this.vertices[i[1]],o=this.vertices[i[2]];No.computeNormal(r,s,o,t)}static computeNormal(e,t,i,r){const s=new S,o=new S;t.vsub(e,o),i.vsub(t,s),s.cross(o,r),r.isZero()||r.normalize()}clipAgainstHull(e,t,i,r,s,o,a,l,c){const d=new S;let h=-1,u=-Number.MAX_VALUE;for(let v=0;v<i.faces.length;v++){d.copy(i.faceNormals[v]),s.vmult(d,d);const _=d.dot(o);_>u&&(u=_,h=v)}const p=[];for(let v=0;v<i.faces[h].length;v++){const _=i.vertices[i.faces[h][v]],g=new S;g.copy(_),s.vmult(g,g),r.vadd(g,g),p.push(g)}h>=0&&this.clipFaceAgainstHull(o,e,t,p,a,l,c)}findSeparatingAxis(e,t,i,r,s,o,a,l){const c=new S,d=new S,h=new S,u=new S,p=new S,v=new S;let _=Number.MAX_VALUE;const g=this;if(g.uniqueAxes)for(let f=0;f!==g.uniqueAxes.length;f++){i.vmult(g.uniqueAxes[f],c);const m=g.testSepAxis(c,e,t,i,r,s);if(m===!1)return!1;m<_&&(_=m,o.copy(c))}else{const f=a?a.length:g.faces.length;for(let m=0;m<f;m++){const y=a?a[m]:m;c.copy(g.faceNormals[y]),i.vmult(c,c);const x=g.testSepAxis(c,e,t,i,r,s);if(x===!1)return!1;x<_&&(_=x,o.copy(c))}}if(e.uniqueAxes)for(let f=0;f!==e.uniqueAxes.length;f++){s.vmult(e.uniqueAxes[f],d);const m=g.testSepAxis(d,e,t,i,r,s);if(m===!1)return!1;m<_&&(_=m,o.copy(d))}else{const f=l?l.length:e.faces.length;for(let m=0;m<f;m++){const y=l?l[m]:m;d.copy(e.faceNormals[y]),s.vmult(d,d);const x=g.testSepAxis(d,e,t,i,r,s);if(x===!1)return!1;x<_&&(_=x,o.copy(d))}}for(let f=0;f!==g.uniqueEdges.length;f++){i.vmult(g.uniqueEdges[f],u);for(let m=0;m!==e.uniqueEdges.length;m++)if(s.vmult(e.uniqueEdges[m],p),u.cross(p,v),!v.almostZero()){v.normalize();const y=g.testSepAxis(v,e,t,i,r,s);if(y===!1)return!1;y<_&&(_=y,o.copy(v))}}return r.vsub(t,h),h.dot(o)>0&&o.negate(o),!0}testSepAxis(e,t,i,r,s,o){const a=this;No.project(a,e,i,r,Yc),No.project(t,e,s,o,$c);const l=Yc[0],c=Yc[1],d=$c[0],h=$c[1];if(l<h||d<c)return!1;const u=l-h,p=d-c;return u<p?u:p}calculateLocalInertia(e,t){const i=new S,r=new S;this.computeLocalAABB(r,i);const s=i.x-r.x,o=i.y-r.y,a=i.z-r.z;t.x=1/12*e*(2*o*2*o+2*a*2*a),t.y=1/12*e*(2*s*2*s+2*a*2*a),t.z=1/12*e*(2*o*2*o+2*s*2*s)}getPlaneConstantOfFace(e){const t=this.faces[e],i=this.faceNormals[e],r=this.vertices[t[0]];return-i.dot(r)}clipFaceAgainstHull(e,t,i,r,s,o,a){const l=new S,c=new S,d=new S,h=new S,u=new S,p=new S,v=new S,_=new S,g=this,f=[],m=r,y=f;let x=-1,M=Number.MAX_VALUE;for(let T=0;T<g.faces.length;T++){l.copy(g.faceNormals[T]),i.vmult(l,l);const V=l.dot(e);V<M&&(M=V,x=T)}if(x<0)return;const w=g.faces[x];w.connectedFaces=[];for(let T=0;T<g.faces.length;T++)for(let V=0;V<g.faces[T].length;V++)w.indexOf(g.faces[T][V])!==-1&&T!==x&&w.connectedFaces.indexOf(T)===-1&&w.connectedFaces.push(T);const R=w.length;for(let T=0;T<R;T++){const V=g.vertices[w[T]],O=g.vertices[w[(T+1)%R]];V.vsub(O,c),d.copy(c),i.vmult(d,d),t.vadd(d,d),h.copy(this.faceNormals[x]),i.vmult(h,h),t.vadd(h,h),d.cross(h,u),u.negate(u),p.copy(V),i.vmult(p,p),t.vadd(p,p);const C=w.connectedFaces[T];v.copy(this.faceNormals[C]);const P=this.getPlaneConstantOfFace(C);_.copy(v),i.vmult(_,_);const N=P-_.dot(t);for(this.clipFaceAgainstPlane(m,y,_,N);m.length;)m.shift();for(;y.length;)m.push(y.shift())}v.copy(this.faceNormals[x]);const D=this.getPlaneConstantOfFace(x);_.copy(v),i.vmult(_,_);const E=D-_.dot(t);for(let T=0;T<m.length;T++){let V=_.dot(m[T])+E;if(V<=s&&(console.log(`clamped: depth=${V} to minDist=${s}`),V=s),V<=o){const O=m[T];if(V<=1e-6){const C={point:O,normal:_,depth:V};a.push(C)}}}}clipFaceAgainstPlane(e,t,i,r){let s,o;const a=e.length;if(a<2)return t;let l=e[e.length-1],c=e[0];s=i.dot(l)+r;for(let d=0;d<a;d++){if(c=e[d],o=i.dot(c)+r,s<0)if(o<0){const h=new S;h.copy(c),t.push(h)}else{const h=new S;l.lerp(c,s/(s-o),h),t.push(h)}else if(o<0){const h=new S;l.lerp(c,s/(s-o),h),t.push(h),t.push(c)}l=c,s=o}return t}computeWorldVertices(e,t){for(;this.worldVertices.length<this.vertices.length;)this.worldVertices.push(new S);const i=this.vertices,r=this.worldVertices;for(let s=0;s!==this.vertices.length;s++)t.vmult(i[s],r[s]),e.vadd(r[s],r[s]);this.worldVerticesNeedsUpdate=!1}computeLocalAABB(e,t){const i=this.vertices;e.set(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),t.set(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);for(let r=0;r<this.vertices.length;r++){const s=i[r];s.x<e.x?e.x=s.x:s.x>t.x&&(t.x=s.x),s.y<e.y?e.y=s.y:s.y>t.y&&(t.y=s.y),s.z<e.z?e.z=s.z:s.z>t.z&&(t.z=s.z)}}computeWorldFaceNormals(e){const t=this.faceNormals.length;for(;this.worldFaceNormals.length<t;)this.worldFaceNormals.push(new S);const i=this.faceNormals,r=this.worldFaceNormals;for(let s=0;s!==t;s++)e.vmult(i[s],r[s]);this.worldFaceNormalsNeedsUpdate=!1}updateBoundingSphereRadius(){let e=0;const t=this.vertices;for(let i=0;i!==t.length;i++){const r=t[i].lengthSquared();r>e&&(e=r)}this.boundingSphereRadius=Math.sqrt(e)}calculateWorldAABB(e,t,i,r){const s=this.vertices;let o,a,l,c,d,h,u=new S;for(let p=0;p<s.length;p++){u.copy(s[p]),t.vmult(u,u),e.vadd(u,u);const v=u;(o===void 0||v.x<o)&&(o=v.x),(c===void 0||v.x>c)&&(c=v.x),(a===void 0||v.y<a)&&(a=v.y),(d===void 0||v.y>d)&&(d=v.y),(l===void 0||v.z<l)&&(l=v.z),(h===void 0||v.z>h)&&(h=v.z)}i.set(o,a,l),r.set(c,d,h)}volume(){return 4*Math.PI*this.boundingSphereRadius/3}getAveragePointLocal(e){e===void 0&&(e=new S);const t=this.vertices;for(let i=0;i<t.length;i++)e.vadd(t[i],e);return e.scale(1/t.length,e),e}transformAllPoints(e,t){const i=this.vertices.length,r=this.vertices;if(t){for(let s=0;s<i;s++){const o=r[s];t.vmult(o,o)}for(let s=0;s<this.faceNormals.length;s++){const o=this.faceNormals[s];t.vmult(o,o)}}if(e)for(let s=0;s<i;s++){const o=r[s];o.vadd(e,o)}}pointIsInside(e){const t=this.vertices,i=this.faces,r=this.faceNormals,s=new S;this.getAveragePointLocal(s);for(let o=0;o<this.faces.length;o++){let a=r[o];const l=t[i[o][0]],c=new S;e.vsub(l,c);const d=a.dot(c),h=new S;s.vsub(l,h);const u=a.dot(h);if(d<0&&u>0||d>0&&u<0)return!1}return-1}static project(e,t,i,r,s){const o=e.vertices.length,a=Ex;let l=0,c=0;const d=wx,h=e.vertices;d.setZero(),qe.vectorToLocalFrame(i,r,t,a),qe.pointToLocalFrame(i,r,d,d);const u=d.dot(a);c=l=h[0].dot(a);for(let p=1;p<o;p++){const v=h[p].dot(a);v>l&&(l=v),v<c&&(c=v)}if(c-=u,l-=u,c>l){const p=c;c=l,l=p}s[0]=l,s[1]=c}}const Yc=[],$c=[];new S;const Ex=new S,wx=new S;class fc extends he{constructor(e){super({type:he.types.BOX}),this.halfExtents=e,this.convexPolyhedronRepresentation=null,this.updateConvexPolyhedronRepresentation(),this.updateBoundingSphereRadius()}updateConvexPolyhedronRepresentation(){const e=this.halfExtents.x,t=this.halfExtents.y,i=this.halfExtents.z,r=S,s=[new r(-e,-t,-i),new r(e,-t,-i),new r(e,t,-i),new r(-e,t,-i),new r(-e,-t,i),new r(e,-t,i),new r(e,t,i),new r(-e,t,i)],o=[[3,2,1,0],[4,5,6,7],[5,4,0,1],[2,3,7,6],[0,4,7,3],[1,2,6,5]],a=[new r(0,0,1),new r(0,1,0),new r(1,0,0)],l=new No({vertices:s,faces:o,axes:a});this.convexPolyhedronRepresentation=l,l.material=this.material}calculateLocalInertia(e,t){return t===void 0&&(t=new S),fc.calculateInertia(this.halfExtents,e,t),t}static calculateInertia(e,t,i){const r=e;i.x=1/12*t*(2*r.y*2*r.y+2*r.z*2*r.z),i.y=1/12*t*(2*r.x*2*r.x+2*r.z*2*r.z),i.z=1/12*t*(2*r.y*2*r.y+2*r.x*2*r.x)}getSideNormals(e,t){const i=e,r=this.halfExtents;if(i[0].set(r.x,0,0),i[1].set(0,r.y,0),i[2].set(0,0,r.z),i[3].set(-r.x,0,0),i[4].set(0,-r.y,0),i[5].set(0,0,-r.z),t!==void 0)for(let s=0;s!==i.length;s++)t.vmult(i[s],i[s]);return i}volume(){return 8*this.halfExtents.x*this.halfExtents.y*this.halfExtents.z}updateBoundingSphereRadius(){this.boundingSphereRadius=this.halfExtents.length()}forEachWorldCorner(e,t,i){const r=this.halfExtents,s=[[r.x,r.y,r.z],[-r.x,r.y,r.z],[-r.x,-r.y,r.z],[-r.x,-r.y,-r.z],[r.x,-r.y,-r.z],[r.x,r.y,-r.z],[-r.x,r.y,-r.z],[r.x,-r.y,r.z]];for(let o=0;o<s.length;o++)Bi.set(s[o][0],s[o][1],s[o][2]),t.vmult(Bi,Bi),e.vadd(Bi,Bi),i(Bi.x,Bi.y,Bi.z)}calculateWorldAABB(e,t,i,r){const s=this.halfExtents;ti[0].set(s.x,s.y,s.z),ti[1].set(-s.x,s.y,s.z),ti[2].set(-s.x,-s.y,s.z),ti[3].set(-s.x,-s.y,-s.z),ti[4].set(s.x,-s.y,-s.z),ti[5].set(s.x,s.y,-s.z),ti[6].set(-s.x,s.y,-s.z),ti[7].set(s.x,-s.y,s.z);const o=ti[0];t.vmult(o,o),e.vadd(o,o),r.copy(o),i.copy(o);for(let a=1;a<8;a++){const l=ti[a];t.vmult(l,l),e.vadd(l,l);const c=l.x,d=l.y,h=l.z;c>r.x&&(r.x=c),d>r.y&&(r.y=d),h>r.z&&(r.z=h),c<i.x&&(i.x=c),d<i.y&&(i.y=d),h<i.z&&(i.z=h)}}}const Bi=new S,ti=[new S,new S,new S,new S,new S,new S,new S,new S],Pf={DYNAMIC:1,STATIC:2,KINEMATIC:4},Df={AWAKE:0,SLEEPY:1,SLEEPING:2};class fe extends Zv{constructor(e){e===void 0&&(e={}),super(),this.id=fe.idCounter++,this.index=-1,this.world=null,this.vlambda=new S,this.collisionFilterGroup=typeof e.collisionFilterGroup=="number"?e.collisionFilterGroup:1,this.collisionFilterMask=typeof e.collisionFilterMask=="number"?e.collisionFilterMask:-1,this.collisionResponse=typeof e.collisionResponse=="boolean"?e.collisionResponse:!0,this.position=new S,this.previousPosition=new S,this.interpolatedPosition=new S,this.initPosition=new S,e.position&&(this.position.copy(e.position),this.previousPosition.copy(e.position),this.interpolatedPosition.copy(e.position),this.initPosition.copy(e.position)),this.velocity=new S,e.velocity&&this.velocity.copy(e.velocity),this.initVelocity=new S,this.force=new S;const t=typeof e.mass=="number"?e.mass:0;this.mass=t,this.invMass=t>0?1/t:0,this.material=e.material||null,this.linearDamping=typeof e.linearDamping=="number"?e.linearDamping:.01,this.type=t<=0?fe.STATIC:fe.DYNAMIC,typeof e.type==typeof fe.STATIC&&(this.type=e.type),this.allowSleep=typeof e.allowSleep<"u"?e.allowSleep:!0,this.sleepState=fe.AWAKE,this.sleepSpeedLimit=typeof e.sleepSpeedLimit<"u"?e.sleepSpeedLimit:.1,this.sleepTimeLimit=typeof e.sleepTimeLimit<"u"?e.sleepTimeLimit:1,this.timeLastSleepy=0,this.wakeUpAfterNarrowphase=!1,this.torque=new S,this.quaternion=new mn,this.initQuaternion=new mn,this.previousQuaternion=new mn,this.interpolatedQuaternion=new mn,e.quaternion&&(this.quaternion.copy(e.quaternion),this.initQuaternion.copy(e.quaternion),this.previousQuaternion.copy(e.quaternion),this.interpolatedQuaternion.copy(e.quaternion)),this.angularVelocity=new S,e.angularVelocity&&this.angularVelocity.copy(e.angularVelocity),this.initAngularVelocity=new S,this.shapes=[],this.shapeOffsets=[],this.shapeOrientations=[],this.inertia=new S,this.invInertia=new S,this.invInertiaWorld=new Yn,this.invMassSolve=0,this.invInertiaSolve=new S,this.invInertiaWorldSolve=new Yn,this.fixedRotation=typeof e.fixedRotation<"u"?e.fixedRotation:!1,this.angularDamping=typeof e.angularDamping<"u"?e.angularDamping:.01,this.linearFactor=new S(1,1,1),e.linearFactor&&this.linearFactor.copy(e.linearFactor),this.angularFactor=new S(1,1,1),e.angularFactor&&this.angularFactor.copy(e.angularFactor),this.aabb=new wn,this.aabbNeedsUpdate=!0,this.boundingRadius=0,this.wlambda=new S,this.isTrigger=!!e.isTrigger,e.shape&&this.addShape(e.shape),this.updateMassProperties()}wakeUp(){const e=this.sleepState;this.sleepState=fe.AWAKE,this.wakeUpAfterNarrowphase=!1,e===fe.SLEEPING&&this.dispatchEvent(fe.wakeupEvent)}sleep(){this.sleepState=fe.SLEEPING,this.velocity.set(0,0,0),this.angularVelocity.set(0,0,0),this.wakeUpAfterNarrowphase=!1}sleepTick(e){if(this.allowSleep){const t=this.sleepState,i=this.velocity.lengthSquared()+this.angularVelocity.lengthSquared(),r=this.sleepSpeedLimit**2;t===fe.AWAKE&&i<r?(this.sleepState=fe.SLEEPY,this.timeLastSleepy=e,this.dispatchEvent(fe.sleepyEvent)):t===fe.SLEEPY&&i>r?this.wakeUp():t===fe.SLEEPY&&e-this.timeLastSleepy>this.sleepTimeLimit&&(this.sleep(),this.dispatchEvent(fe.sleepEvent))}}updateSolveMassProperties(){this.sleepState===fe.SLEEPING||this.type===fe.KINEMATIC?(this.invMassSolve=0,this.invInertiaSolve.setZero(),this.invInertiaWorldSolve.setZero()):(this.invMassSolve=this.invMass,this.invInertiaSolve.copy(this.invInertia),this.invInertiaWorldSolve.copy(this.invInertiaWorld))}pointToLocalFrame(e,t){return t===void 0&&(t=new S),e.vsub(this.position,t),this.quaternion.conjugate().vmult(t,t),t}vectorToLocalFrame(e,t){return t===void 0&&(t=new S),this.quaternion.conjugate().vmult(e,t),t}pointToWorldFrame(e,t){return t===void 0&&(t=new S),this.quaternion.vmult(e,t),t.vadd(this.position,t),t}vectorToWorldFrame(e,t){return t===void 0&&(t=new S),this.quaternion.vmult(e,t),t}addShape(e,t,i){const r=new S,s=new mn;return t&&r.copy(t),i&&s.copy(i),this.shapes.push(e),this.shapeOffsets.push(r),this.shapeOrientations.push(s),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,e.body=this,this}removeShape(e){const t=this.shapes.indexOf(e);return t===-1?(console.warn("Shape does not belong to the body"),this):(this.shapes.splice(t,1),this.shapeOffsets.splice(t,1),this.shapeOrientations.splice(t,1),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,e.body=null,this)}updateBoundingRadius(){const e=this.shapes,t=this.shapeOffsets,i=e.length;let r=0;for(let s=0;s!==i;s++){const o=e[s];o.updateBoundingSphereRadius();const a=t[s].length(),l=o.boundingSphereRadius;a+l>r&&(r=a+l)}this.boundingRadius=r}updateAABB(){const e=this.shapes,t=this.shapeOffsets,i=this.shapeOrientations,r=e.length,s=Tx,o=Ax,a=this.quaternion,l=this.aabb,c=Rx;for(let d=0;d!==r;d++){const h=e[d];a.vmult(t[d],s),s.vadd(this.position,s),a.mult(i[d],o),h.calculateWorldAABB(s,o,c.lowerBound,c.upperBound),d===0?l.copy(c):l.extend(c)}this.aabbNeedsUpdate=!1}updateInertiaWorld(e){const t=this.invInertia;if(!(t.x===t.y&&t.y===t.z&&!e)){const i=Cx,r=bx;i.setRotationFromQuaternion(this.quaternion),i.transpose(r),i.scale(t,i),i.mmult(r,this.invInertiaWorld)}}applyForce(e,t){if(t===void 0&&(t=new S),this.type!==fe.DYNAMIC)return;this.sleepState===fe.SLEEPING&&this.wakeUp();const i=Lx;t.cross(e,i),this.force.vadd(e,this.force),this.torque.vadd(i,this.torque)}applyLocalForce(e,t){if(t===void 0&&(t=new S),this.type!==fe.DYNAMIC)return;const i=Px,r=Dx;this.vectorToWorldFrame(e,i),this.vectorToWorldFrame(t,r),this.applyForce(i,r)}applyTorque(e){this.type===fe.DYNAMIC&&(this.sleepState===fe.SLEEPING&&this.wakeUp(),this.torque.vadd(e,this.torque))}applyImpulse(e,t){if(t===void 0&&(t=new S),this.type!==fe.DYNAMIC)return;this.sleepState===fe.SLEEPING&&this.wakeUp();const i=t,r=Ix;r.copy(e),r.scale(this.invMass,r),this.velocity.vadd(r,this.velocity);const s=Nx;i.cross(e,s),this.invInertiaWorld.vmult(s,s),this.angularVelocity.vadd(s,this.angularVelocity)}applyLocalImpulse(e,t){if(t===void 0&&(t=new S),this.type!==fe.DYNAMIC)return;const i=Ux,r=Fx;this.vectorToWorldFrame(e,i),this.vectorToWorldFrame(t,r),this.applyImpulse(i,r)}updateMassProperties(){const e=zx;this.invMass=this.mass>0?1/this.mass:0;const t=this.inertia,i=this.fixedRotation;this.updateAABB(),e.set((this.aabb.upperBound.x-this.aabb.lowerBound.x)/2,(this.aabb.upperBound.y-this.aabb.lowerBound.y)/2,(this.aabb.upperBound.z-this.aabb.lowerBound.z)/2),fc.calculateInertia(e,this.mass,t),this.invInertia.set(t.x>0&&!i?1/t.x:0,t.y>0&&!i?1/t.y:0,t.z>0&&!i?1/t.z:0),this.updateInertiaWorld(!0)}getVelocityAtWorldPoint(e,t){const i=new S;return e.vsub(this.position,i),this.angularVelocity.cross(i,t),this.velocity.vadd(t,t),t}integrate(e,t,i){if(this.previousPosition.copy(this.position),this.previousQuaternion.copy(this.quaternion),!(this.type===fe.DYNAMIC||this.type===fe.KINEMATIC)||this.sleepState===fe.SLEEPING)return;const r=this.velocity,s=this.angularVelocity,o=this.position,a=this.force,l=this.torque,c=this.quaternion,d=this.invMass,h=this.invInertiaWorld,u=this.linearFactor,p=d*e;r.x+=a.x*p*u.x,r.y+=a.y*p*u.y,r.z+=a.z*p*u.z;const v=h.elements,_=this.angularFactor,g=l.x*_.x,f=l.y*_.y,m=l.z*_.z;s.x+=e*(v[0]*g+v[1]*f+v[2]*m),s.y+=e*(v[3]*g+v[4]*f+v[5]*m),s.z+=e*(v[6]*g+v[7]*f+v[8]*m),o.x+=r.x*e,o.y+=r.y*e,o.z+=r.z*e,c.integrate(this.angularVelocity,e,this.angularFactor,c),t&&(i?c.normalizeFast():c.normalize()),this.aabbNeedsUpdate=!0,this.updateInertiaWorld()}}fe.idCounter=0;fe.COLLIDE_EVENT_NAME="collide";fe.DYNAMIC=Pf.DYNAMIC;fe.STATIC=Pf.STATIC;fe.KINEMATIC=Pf.KINEMATIC;fe.AWAKE=Df.AWAKE;fe.SLEEPY=Df.SLEEPY;fe.SLEEPING=Df.SLEEPING;fe.wakeupEvent={type:"wakeup"};fe.sleepyEvent={type:"sleepy"};fe.sleepEvent={type:"sleep"};const Tx=new S,Ax=new mn,Rx=new wn,Cx=new Yn,bx=new Yn;new Yn;const Lx=new S,Px=new S,Dx=new S,Ix=new S,Nx=new S,Ux=new S,Fx=new S,zx=new S;class Ox{constructor(){this.world=null,this.useBoundingBoxes=!1,this.dirty=!0}collisionPairs(e,t,i){throw new Error("collisionPairs not implemented for this BroadPhase class!")}needBroadphaseCollision(e,t){return!(!(e.collisionFilterGroup&t.collisionFilterMask)||!(t.collisionFilterGroup&e.collisionFilterMask)||(e.type&fe.STATIC||e.sleepState===fe.SLEEPING)&&(t.type&fe.STATIC||t.sleepState===fe.SLEEPING))}intersectionTest(e,t,i,r){this.useBoundingBoxes?this.doBoundingBoxBroadphase(e,t,i,r):this.doBoundingSphereBroadphase(e,t,i,r)}doBoundingSphereBroadphase(e,t,i,r){const s=Bx;t.position.vsub(e.position,s);const o=(e.boundingRadius+t.boundingRadius)**2;s.lengthSquared()<o&&(i.push(e),r.push(t))}doBoundingBoxBroadphase(e,t,i,r){e.aabbNeedsUpdate&&e.updateAABB(),t.aabbNeedsUpdate&&t.updateAABB(),e.aabb.overlaps(t.aabb)&&(i.push(e),r.push(t))}makePairsUnique(e,t){const i=kx,r=Hx,s=Gx,o=e.length;for(let a=0;a!==o;a++)r[a]=e[a],s[a]=t[a];e.length=0,t.length=0;for(let a=0;a!==o;a++){const l=r[a].id,c=s[a].id,d=l<c?`${l},${c}`:`${c},${l}`;i[d]=a,i.keys.push(d)}for(let a=0;a!==i.keys.length;a++){const l=i.keys.pop(),c=i[l];e.push(r[c]),t.push(s[c]),delete i[l]}}setWorld(e){}static boundingSphereCheck(e,t){const i=new S;e.position.vsub(t.position,i);const r=e.shapes[0],s=t.shapes[0];return Math.pow(r.boundingSphereRadius+s.boundingSphereRadius,2)>i.lengthSquared()}aabbQuery(e,t,i){return console.warn(".aabbQuery is not implemented in this Broadphase subclass."),[]}}const Bx=new S;new S;new mn;new S;const kx={keys:[]},Hx=[],Gx=[];new S;new S;new S;class Qv extends Ox{constructor(){super()}collisionPairs(e,t,i){const r=e.bodies,s=r.length;let o,a;for(let l=0;l!==s;l++)for(let c=0;c!==l;c++)o=r[l],a=r[c],this.needBroadphaseCollision(o,a)&&this.intersectionTest(o,a,t,i)}aabbQuery(e,t,i){i===void 0&&(i=[]);for(let r=0;r<e.bodies.length;r++){const s=e.bodies[r];s.aabbNeedsUpdate&&s.updateAABB(),s.aabb.overlaps(t)&&i.push(s)}return i}}class Yl{constructor(){this.rayFromWorld=new S,this.rayToWorld=new S,this.hitNormalWorld=new S,this.hitPointWorld=new S,this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}reset(){this.rayFromWorld.setZero(),this.rayToWorld.setZero(),this.hitNormalWorld.setZero(),this.hitPointWorld.setZero(),this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}abort(){this.shouldStop=!0}set(e,t,i,r,s,o,a){this.rayFromWorld.copy(e),this.rayToWorld.copy(t),this.hitNormalWorld.copy(i),this.hitPointWorld.copy(r),this.shape=s,this.body=o,this.distance=a}}let Jv,e0,t0,n0,i0,r0,s0;const If={CLOSEST:1,ANY:2,ALL:4};Jv=he.types.SPHERE;e0=he.types.PLANE;t0=he.types.BOX;n0=he.types.CYLINDER;i0=he.types.CONVEXPOLYHEDRON;r0=he.types.HEIGHTFIELD;s0=he.types.TRIMESH;let di=class si{get[Jv](){return this._intersectSphere}get[e0](){return this._intersectPlane}get[t0](){return this._intersectBox}get[n0](){return this._intersectConvex}get[i0](){return this._intersectConvex}get[r0](){return this._intersectHeightfield}get[s0](){return this._intersectTrimesh}constructor(e,t){e===void 0&&(e=new S),t===void 0&&(t=new S),this.from=e.clone(),this.to=t.clone(),this.direction=new S,this.precision=1e-4,this.checkCollisionResponse=!0,this.skipBackfaces=!1,this.collisionFilterMask=-1,this.collisionFilterGroup=-1,this.mode=si.ANY,this.result=new Yl,this.hasHit=!1,this.callback=i=>{}}intersectWorld(e,t){return this.mode=t.mode||si.ANY,this.result=t.result||new Yl,this.skipBackfaces=!!t.skipBackfaces,this.collisionFilterMask=typeof t.collisionFilterMask<"u"?t.collisionFilterMask:-1,this.collisionFilterGroup=typeof t.collisionFilterGroup<"u"?t.collisionFilterGroup:-1,this.checkCollisionResponse=typeof t.checkCollisionResponse<"u"?t.checkCollisionResponse:!0,t.from&&this.from.copy(t.from),t.to&&this.to.copy(t.to),this.callback=t.callback||(()=>{}),this.hasHit=!1,this.result.reset(),this.updateDirection(),this.getAABB(tp),Kc.length=0,e.broadphase.aabbQuery(e,tp,Kc),this.intersectBodies(Kc),this.hasHit}intersectBody(e,t){t&&(this.result=t,this.updateDirection());const i=this.checkCollisionResponse;if(i&&!e.collisionResponse||!(this.collisionFilterGroup&e.collisionFilterMask)||!(e.collisionFilterGroup&this.collisionFilterMask))return;const r=Vx,s=Wx;for(let o=0,a=e.shapes.length;o<a;o++){const l=e.shapes[o];if(!(i&&!l.collisionResponse)&&(e.quaternion.mult(e.shapeOrientations[o],s),e.quaternion.vmult(e.shapeOffsets[o],r),r.vadd(e.position,r),this.intersectShape(l,s,r,e),this.result.shouldStop))break}}intersectBodies(e,t){t&&(this.result=t,this.updateDirection());for(let i=0,r=e.length;!this.result.shouldStop&&i<r;i++)this.intersectBody(e[i])}updateDirection(){this.to.vsub(this.from,this.direction),this.direction.normalize()}intersectShape(e,t,i,r){const s=this.from;if(rS(s,this.direction,i)>e.boundingSphereRadius)return;const a=this[e.type];a&&a.call(this,e,t,i,r,e)}_intersectBox(e,t,i,r,s){return this._intersectConvex(e.convexPolyhedronRepresentation,t,i,r,s)}_intersectPlane(e,t,i,r,s){const o=this.from,a=this.to,l=this.direction,c=new S(0,0,1);t.vmult(c,c);const d=new S;o.vsub(i,d);const h=d.dot(c);a.vsub(i,d);const u=d.dot(c);if(h*u>0||o.distanceTo(a)<h)return;const p=c.dot(l);if(Math.abs(p)<this.precision)return;const v=new S,_=new S,g=new S;o.vsub(i,v);const f=-c.dot(v)/p;l.scale(f,_),o.vadd(_,g),this.reportIntersection(c,g,s,r,-1)}getAABB(e){const{lowerBound:t,upperBound:i}=e,r=this.to,s=this.from;t.x=Math.min(r.x,s.x),t.y=Math.min(r.y,s.y),t.z=Math.min(r.z,s.z),i.x=Math.max(r.x,s.x),i.y=Math.max(r.y,s.y),i.z=Math.max(r.z,s.z)}_intersectHeightfield(e,t,i,r,s){e.data,e.elementSize;const o=Xx;o.from.copy(this.from),o.to.copy(this.to),qe.pointToLocalFrame(i,t,o.from,o.from),qe.pointToLocalFrame(i,t,o.to,o.to),o.updateDirection();const a=qx;let l,c,d,h;l=c=0,d=h=e.data.length-1;const u=new wn;o.getAABB(u),e.getIndexOfPosition(u.lowerBound.x,u.lowerBound.y,a,!0),l=Math.max(l,a[0]),c=Math.max(c,a[1]),e.getIndexOfPosition(u.upperBound.x,u.upperBound.y,a,!0),d=Math.min(d,a[0]+1),h=Math.min(h,a[1]+1);for(let p=l;p<d;p++)for(let v=c;v<h;v++){if(this.result.shouldStop)return;if(e.getAabbAtIndex(p,v,u),!!u.overlapsRay(o)){if(e.getConvexTrianglePillar(p,v,!1),qe.pointToWorldFrame(i,t,e.pillarOffset,Pa),this._intersectConvex(e.pillarConvex,t,Pa,r,s,np),this.result.shouldStop)return;e.getConvexTrianglePillar(p,v,!0),qe.pointToWorldFrame(i,t,e.pillarOffset,Pa),this._intersectConvex(e.pillarConvex,t,Pa,r,s,np)}}}_intersectSphere(e,t,i,r,s){const o=this.from,a=this.to,l=e.radius,c=(a.x-o.x)**2+(a.y-o.y)**2+(a.z-o.z)**2,d=2*((a.x-o.x)*(o.x-i.x)+(a.y-o.y)*(o.y-i.y)+(a.z-o.z)*(o.z-i.z)),h=(o.x-i.x)**2+(o.y-i.y)**2+(o.z-i.z)**2-l**2,u=d**2-4*c*h,p=jx,v=Yx;if(!(u<0))if(u===0)o.lerp(a,u,p),p.vsub(i,v),v.normalize(),this.reportIntersection(v,p,s,r,-1);else{const _=(-d-Math.sqrt(u))/(2*c),g=(-d+Math.sqrt(u))/(2*c);if(_>=0&&_<=1&&(o.lerp(a,_,p),p.vsub(i,v),v.normalize(),this.reportIntersection(v,p,s,r,-1)),this.result.shouldStop)return;g>=0&&g<=1&&(o.lerp(a,g,p),p.vsub(i,v),v.normalize(),this.reportIntersection(v,p,s,r,-1))}}_intersectConvex(e,t,i,r,s,o){const a=$x,l=ip,c=o&&o.faceList||null,d=e.faces,h=e.vertices,u=e.faceNormals,p=this.direction,v=this.from,_=this.to,g=v.distanceTo(_),f=c?c.length:d.length,m=this.result;for(let y=0;!m.shouldStop&&y<f;y++){const x=c?c[y]:y,M=d[x],w=u[x],R=t,D=i;l.copy(h[M[0]]),R.vmult(l,l),l.vadd(D,l),l.vsub(v,l),R.vmult(w,a);const E=p.dot(a);if(Math.abs(E)<this.precision)continue;const T=a.dot(l)/E;if(!(T<0)){p.scale(T,Qt),Qt.vadd(v,Qt),zn.copy(h[M[0]]),R.vmult(zn,zn),D.vadd(zn,zn);for(let V=1;!m.shouldStop&&V<M.length-1;V++){ni.copy(h[M[V]]),ii.copy(h[M[V+1]]),R.vmult(ni,ni),R.vmult(ii,ii),D.vadd(ni,ni),D.vadd(ii,ii);const O=Qt.distanceTo(v);!(si.pointInTriangle(Qt,zn,ni,ii)||si.pointInTriangle(Qt,ni,zn,ii))||O>g||this.reportIntersection(a,Qt,s,r,x)}}}}_intersectTrimesh(e,t,i,r,s,o){const a=Kx,l=nS,c=iS,d=ip,h=Zx,u=Qx,p=Jx,v=tS,_=eS,g=e.indices;e.vertices;const f=this.from,m=this.to,y=this.direction;c.position.copy(i),c.quaternion.copy(t),qe.vectorToLocalFrame(i,t,y,h),qe.pointToLocalFrame(i,t,f,u),qe.pointToLocalFrame(i,t,m,p),p.x*=e.scale.x,p.y*=e.scale.y,p.z*=e.scale.z,u.x*=e.scale.x,u.y*=e.scale.y,u.z*=e.scale.z,p.vsub(u,h),h.normalize();const x=u.distanceSquared(p);e.tree.rayQuery(this,c,l);for(let M=0,w=l.length;!this.result.shouldStop&&M!==w;M++){const R=l[M];e.getNormal(R,a),e.getVertex(g[R*3],zn),zn.vsub(u,d);const D=h.dot(a),E=a.dot(d)/D;if(E<0)continue;h.scale(E,Qt),Qt.vadd(u,Qt),e.getVertex(g[R*3+1],ni),e.getVertex(g[R*3+2],ii);const T=Qt.distanceSquared(u);!(si.pointInTriangle(Qt,ni,zn,ii)||si.pointInTriangle(Qt,zn,ni,ii))||T>x||(qe.vectorToWorldFrame(t,a,_),qe.pointToWorldFrame(i,t,Qt,v),this.reportIntersection(_,v,s,r,R))}l.length=0}reportIntersection(e,t,i,r,s){const o=this.from,a=this.to,l=o.distanceTo(t),c=this.result;if(!(this.skipBackfaces&&e.dot(this.direction)>0))switch(c.hitFaceIndex=typeof s<"u"?s:-1,this.mode){case si.ALL:this.hasHit=!0,c.set(o,a,e,t,i,r,l),c.hasHit=!0,this.callback(c);break;case si.CLOSEST:(l<c.distance||!c.hasHit)&&(this.hasHit=!0,c.hasHit=!0,c.set(o,a,e,t,i,r,l));break;case si.ANY:this.hasHit=!0,c.hasHit=!0,c.set(o,a,e,t,i,r,l),c.shouldStop=!0;break}}static pointInTriangle(e,t,i,r){r.vsub(t,Tr),i.vsub(t,co),e.vsub(t,Zc);const s=Tr.dot(Tr),o=Tr.dot(co),a=Tr.dot(Zc),l=co.dot(co),c=co.dot(Zc);let d,h;return(d=l*a-o*c)>=0&&(h=s*c-o*a)>=0&&d+h<s*l-o*o}};di.CLOSEST=If.CLOSEST;di.ANY=If.ANY;di.ALL=If.ALL;const tp=new wn,Kc=[],co=new S,Zc=new S,Vx=new S,Wx=new mn,Qt=new S,zn=new S,ni=new S,ii=new S;new S;new Yl;const np={faceList:[0]},Pa=new S,Xx=new di,qx=[],jx=new S,Yx=new S,$x=new S;new S;new S;const ip=new S,Kx=new S,Zx=new S,Qx=new S,Jx=new S,eS=new S,tS=new S;new wn;const nS=[],iS=new qe,Tr=new S,Da=new S;function rS(n,e,t){t.vsub(n,Tr);const i=Tr.dot(e);return e.scale(i,Da),Da.vadd(n,Da),t.distanceTo(Da)}class o0{static defaults(e,t){e===void 0&&(e={});for(let i in t)i in e||(e[i]=t[i]);return e}}class aa{constructor(e,t,i){i===void 0&&(i={}),i=o0.defaults(i,{collideConnected:!0,wakeUpBodies:!0}),this.equations=[],this.bodyA=e,this.bodyB=t,this.id=aa.idCounter++,this.collideConnected=i.collideConnected,i.wakeUpBodies&&(e&&e.wakeUp(),t&&t.wakeUp())}update(){throw new Error("method update() not implmemented in this Constraint subclass!")}enable(){const e=this.equations;for(let t=0;t<e.length;t++)e[t].enabled=!0}disable(){const e=this.equations;for(let t=0;t<e.length;t++)e[t].enabled=!1}}aa.idCounter=0;class rp{constructor(){this.spatial=new S,this.rotational=new S}multiplyElement(e){return e.spatial.dot(this.spatial)+e.rotational.dot(this.rotational)}multiplyVectors(e,t){return e.dot(this.spatial)+t.dot(this.rotational)}}class la{constructor(e,t,i,r){i===void 0&&(i=-1e6),r===void 0&&(r=1e6),this.id=la.idCounter++,this.minForce=i,this.maxForce=r,this.bi=e,this.bj=t,this.a=0,this.b=0,this.eps=0,this.jacobianElementA=new rp,this.jacobianElementB=new rp,this.enabled=!0,this.multiplier=0,this.setSpookParams(1e7,4,1/60)}setSpookParams(e,t,i){const r=t,s=e,o=i;this.a=4/(o*(1+4*r)),this.b=4*r/(1+4*r),this.eps=4/(o*o*s*(1+4*r))}computeB(e,t,i){const r=this.computeGW(),s=this.computeGq(),o=this.computeGiMf();return-s*e-r*t-o*i}computeGq(){const e=this.jacobianElementA,t=this.jacobianElementB,i=this.bi,r=this.bj,s=i.position,o=r.position;return e.spatial.dot(s)+t.spatial.dot(o)}computeGW(){const e=this.jacobianElementA,t=this.jacobianElementB,i=this.bi,r=this.bj,s=i.velocity,o=r.velocity,a=i.angularVelocity,l=r.angularVelocity;return e.multiplyVectors(s,a)+t.multiplyVectors(o,l)}computeGWlambda(){const e=this.jacobianElementA,t=this.jacobianElementB,i=this.bi,r=this.bj,s=i.vlambda,o=r.vlambda,a=i.wlambda,l=r.wlambda;return e.multiplyVectors(s,a)+t.multiplyVectors(o,l)}computeGiMf(){const e=this.jacobianElementA,t=this.jacobianElementB,i=this.bi,r=this.bj,s=i.force,o=i.torque,a=r.force,l=r.torque,c=i.invMassSolve,d=r.invMassSolve;return s.scale(c,sp),a.scale(d,op),i.invInertiaWorldSolve.vmult(o,ap),r.invInertiaWorldSolve.vmult(l,lp),e.multiplyVectors(sp,ap)+t.multiplyVectors(op,lp)}computeGiMGt(){const e=this.jacobianElementA,t=this.jacobianElementB,i=this.bi,r=this.bj,s=i.invMassSolve,o=r.invMassSolve,a=i.invInertiaWorldSolve,l=r.invInertiaWorldSolve;let c=s+o;return a.vmult(e.rotational,Ia),c+=Ia.dot(e.rotational),l.vmult(t.rotational,Ia),c+=Ia.dot(t.rotational),c}addToWlambda(e){const t=this.jacobianElementA,i=this.jacobianElementB,r=this.bi,s=this.bj,o=sS;r.vlambda.addScaledVector(r.invMassSolve*e,t.spatial,r.vlambda),s.vlambda.addScaledVector(s.invMassSolve*e,i.spatial,s.vlambda),r.invInertiaWorldSolve.vmult(t.rotational,o),r.wlambda.addScaledVector(e,o,r.wlambda),s.invInertiaWorldSolve.vmult(i.rotational,o),s.wlambda.addScaledVector(e,o,s.wlambda)}computeC(){return this.computeGiMGt()+this.eps}}la.idCounter=0;const sp=new S,op=new S,ap=new S,lp=new S,Ia=new S,sS=new S;class Uo extends la{constructor(e,t,i){i===void 0&&(i=1e6),super(e,t,0,i),this.restitution=0,this.ri=new S,this.rj=new S,this.ni=new S}computeB(e){const t=this.a,i=this.b,r=this.bi,s=this.bj,o=this.ri,a=this.rj,l=oS,c=aS,d=r.velocity,h=r.angularVelocity;r.force,r.torque;const u=s.velocity,p=s.angularVelocity;s.force,s.torque;const v=lS,_=this.jacobianElementA,g=this.jacobianElementB,f=this.ni;o.cross(f,l),a.cross(f,c),f.negate(_.spatial),l.negate(_.rotational),g.spatial.copy(f),g.rotational.copy(c),v.copy(s.position),v.vadd(a,v),v.vsub(r.position,v),v.vsub(o,v);const m=f.dot(v),y=this.restitution+1,x=y*u.dot(f)-y*d.dot(f)+p.dot(c)-h.dot(l),M=this.computeGiMf();return-m*t-x*i-e*M}getImpactVelocityAlongNormal(){const e=cS,t=uS,i=dS,r=fS,s=hS;return this.bi.position.vadd(this.ri,i),this.bj.position.vadd(this.rj,r),this.bi.getVelocityAtWorldPoint(i,e),this.bj.getVelocityAtWorldPoint(r,t),e.vsub(t,s),this.ni.dot(s)}}const oS=new S,aS=new S,lS=new S,cS=new S,uS=new S,dS=new S,fS=new S,hS=new S;class pS extends aa{constructor(e,t,i,r,s){t===void 0&&(t=new S),r===void 0&&(r=new S),s===void 0&&(s=1e6),super(e,i),this.pivotA=t.clone(),this.pivotB=r.clone();const o=this.equationX=new Uo(e,i),a=this.equationY=new Uo(e,i),l=this.equationZ=new Uo(e,i);this.equations.push(o,a,l),o.minForce=a.minForce=l.minForce=-s,o.maxForce=a.maxForce=l.maxForce=s,o.ni.set(1,0,0),a.ni.set(0,1,0),l.ni.set(0,0,1)}update(){const e=this.bodyA,t=this.bodyB,i=this.equationX,r=this.equationY,s=this.equationZ;e.quaternion.vmult(this.pivotA,i.ri),t.quaternion.vmult(this.pivotB,i.rj),r.ri.copy(i.ri),r.rj.copy(i.rj),s.ri.copy(i.ri),s.rj.copy(i.rj)}}new S;new S;new S;new S;new S;new S;class mS extends aa{constructor(e,t,i,r){r===void 0&&(r=1e6),super(e,t),typeof i>"u"&&(i=e.position.distanceTo(t.position)),this.distance=i;const s=this.distanceEquation=new Uo(e,t);this.equations.push(s),s.minForce=-r,s.maxForce=r}update(){const e=this.bodyA,t=this.bodyB,i=this.distanceEquation,r=this.distance*.5,s=i.ni;t.position.vsub(e.position,s),s.normalize(),s.scale(r,i.ri),s.scale(-r,i.rj)}}new S;new S;new S;new S;class cp extends la{constructor(e,t,i){super(e,t,-i,i),this.ri=new S,this.rj=new S,this.t=new S}computeB(e){this.a;const t=this.b;this.bi,this.bj;const i=this.ri,r=this.rj,s=gS,o=vS,a=this.t;i.cross(a,s),r.cross(a,o);const l=this.jacobianElementA,c=this.jacobianElementB;a.negate(l.spatial),s.negate(l.rotational),c.spatial.copy(a),c.rotational.copy(o);const d=this.computeGW(),h=this.computeGiMf();return-d*t-e*h}}const gS=new S,vS=new S;class hc{constructor(e,t,i){i=o0.defaults(i,{friction:.3,restitution:.3,contactEquationStiffness:1e7,contactEquationRelaxation:3,frictionEquationStiffness:1e7,frictionEquationRelaxation:3}),this.id=hc.idCounter++,this.materials=[e,t],this.friction=i.friction,this.restitution=i.restitution,this.contactEquationStiffness=i.contactEquationStiffness,this.contactEquationRelaxation=i.contactEquationRelaxation,this.frictionEquationStiffness=i.frictionEquationStiffness,this.frictionEquationRelaxation=i.frictionEquationRelaxation}}hc.idCounter=0;let a0=class l0{constructor(e){e===void 0&&(e={});let t="";typeof e=="string"&&(t=e,e={}),this.name=t,this.id=l0.idCounter++,this.friction=typeof e.friction<"u"?e.friction:-1,this.restitution=typeof e.restitution<"u"?e.restitution:-1}};a0.idCounter=0;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new di;new S;new S;new S;new S(1,0,0),new S(0,1,0),new S(0,0,1);new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;let _S=class extends he{constructor(){super({type:he.types.PLANE}),this.worldNormal=new S,this.worldNormalNeedsUpdate=!0,this.boundingSphereRadius=Number.MAX_VALUE}computeWorldNormal(e){const t=this.worldNormal;t.set(0,0,1),e.vmult(t,t),this.worldNormalNeedsUpdate=!1}calculateLocalInertia(e,t){return t===void 0&&(t=new S),t}volume(){return Number.MAX_VALUE}calculateWorldAABB(e,t,i,r){hi.set(0,0,1),t.vmult(hi,hi);const s=Number.MAX_VALUE;i.set(-s,-s,-s),r.set(s,s,s),hi.x===1?r.x=e.x:hi.x===-1&&(i.x=e.x),hi.y===1?r.y=e.y:hi.y===-1&&(i.y=e.y),hi.z===1?r.z=e.z:hi.z===-1&&(i.z=e.z)}updateBoundingSphereRadius(){this.boundingSphereRadius=Number.MAX_VALUE}};const hi=new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new wn;new S;new wn;new S;new S;new S;new S;new S;new S;new S;new wn;new S;new qe;new wn;class yS{constructor(){this.equations=[]}solve(e,t){return 0}addEquation(e){e.enabled&&!e.bi.isTrigger&&!e.bj.isTrigger&&this.equations.push(e)}removeEquation(e){const t=this.equations,i=t.indexOf(e);i!==-1&&t.splice(i,1)}removeAllEquations(){this.equations.length=0}}class xS extends yS{constructor(){super(),this.iterations=10,this.tolerance=1e-7}solve(e,t){let i=0;const r=this.iterations,s=this.tolerance*this.tolerance,o=this.equations,a=o.length,l=t.bodies,c=l.length,d=e;let h,u,p,v,_,g;if(a!==0)for(let x=0;x!==c;x++)l[x].updateSolveMassProperties();const f=MS,m=ES,y=SS;f.length=a,m.length=a,y.length=a;for(let x=0;x!==a;x++){const M=o[x];y[x]=0,m[x]=M.computeB(d),f[x]=1/M.computeC()}if(a!==0){for(let w=0;w!==c;w++){const R=l[w],D=R.vlambda,E=R.wlambda;D.set(0,0,0),E.set(0,0,0)}for(i=0;i!==r;i++){v=0;for(let w=0;w!==a;w++){const R=o[w];h=m[w],u=f[w],g=y[w],_=R.computeGWlambda(),p=u*(h-_-R.eps*g),g+p<R.minForce?p=R.minForce-g:g+p>R.maxForce&&(p=R.maxForce-g),y[w]+=p,v+=p>0?p:-p,R.addToWlambda(p)}if(v*v<s)break}for(let w=0;w!==c;w++){const R=l[w],D=R.velocity,E=R.angularVelocity;R.vlambda.vmul(R.linearFactor,R.vlambda),D.vadd(R.vlambda,D),R.wlambda.vmul(R.angularFactor,R.wlambda),E.vadd(R.wlambda,E)}let x=o.length;const M=1/d;for(;x--;)o[x].multiplier=y[x]*M}return i}}const SS=[],MS=[],ES=[];class wS{constructor(){this.objects=[],this.type=Object}release(){const e=arguments.length;for(let t=0;t!==e;t++)this.objects.push(t<0||arguments.length<=t?void 0:arguments[t]);return this}get(){return this.objects.length===0?this.constructObject():this.objects.pop()}constructObject(){throw new Error("constructObject() not implemented in this Pool subclass yet!")}resize(e){const t=this.objects;for(;t.length>e;)t.pop();for(;t.length<e;)t.push(this.constructObject());return this}}class TS extends wS{constructor(){super(...arguments),this.type=S}constructObject(){return new S}}const et={sphereSphere:he.types.SPHERE,spherePlane:he.types.SPHERE|he.types.PLANE,boxBox:he.types.BOX|he.types.BOX,sphereBox:he.types.SPHERE|he.types.BOX,planeBox:he.types.PLANE|he.types.BOX,convexConvex:he.types.CONVEXPOLYHEDRON,sphereConvex:he.types.SPHERE|he.types.CONVEXPOLYHEDRON,planeConvex:he.types.PLANE|he.types.CONVEXPOLYHEDRON,boxConvex:he.types.BOX|he.types.CONVEXPOLYHEDRON,sphereHeightfield:he.types.SPHERE|he.types.HEIGHTFIELD,boxHeightfield:he.types.BOX|he.types.HEIGHTFIELD,convexHeightfield:he.types.CONVEXPOLYHEDRON|he.types.HEIGHTFIELD,sphereParticle:he.types.PARTICLE|he.types.SPHERE,planeParticle:he.types.PLANE|he.types.PARTICLE,boxParticle:he.types.BOX|he.types.PARTICLE,convexParticle:he.types.PARTICLE|he.types.CONVEXPOLYHEDRON,cylinderCylinder:he.types.CYLINDER,sphereCylinder:he.types.SPHERE|he.types.CYLINDER,planeCylinder:he.types.PLANE|he.types.CYLINDER,boxCylinder:he.types.BOX|he.types.CYLINDER,convexCylinder:he.types.CONVEXPOLYHEDRON|he.types.CYLINDER,heightfieldCylinder:he.types.HEIGHTFIELD|he.types.CYLINDER,particleCylinder:he.types.PARTICLE|he.types.CYLINDER,sphereTrimesh:he.types.SPHERE|he.types.TRIMESH,planeTrimesh:he.types.PLANE|he.types.TRIMESH};class AS{get[et.sphereSphere](){return this.sphereSphere}get[et.spherePlane](){return this.spherePlane}get[et.boxBox](){return this.boxBox}get[et.sphereBox](){return this.sphereBox}get[et.planeBox](){return this.planeBox}get[et.convexConvex](){return this.convexConvex}get[et.sphereConvex](){return this.sphereConvex}get[et.planeConvex](){return this.planeConvex}get[et.boxConvex](){return this.boxConvex}get[et.sphereHeightfield](){return this.sphereHeightfield}get[et.boxHeightfield](){return this.boxHeightfield}get[et.convexHeightfield](){return this.convexHeightfield}get[et.sphereParticle](){return this.sphereParticle}get[et.planeParticle](){return this.planeParticle}get[et.boxParticle](){return this.boxParticle}get[et.convexParticle](){return this.convexParticle}get[et.cylinderCylinder](){return this.convexConvex}get[et.sphereCylinder](){return this.sphereConvex}get[et.planeCylinder](){return this.planeConvex}get[et.boxCylinder](){return this.boxConvex}get[et.convexCylinder](){return this.convexConvex}get[et.heightfieldCylinder](){return this.heightfieldCylinder}get[et.particleCylinder](){return this.particleCylinder}get[et.sphereTrimesh](){return this.sphereTrimesh}get[et.planeTrimesh](){return this.planeTrimesh}constructor(e){this.contactPointPool=[],this.frictionEquationPool=[],this.result=[],this.frictionResult=[],this.v3pool=new TS,this.world=e,this.currentContactMaterial=e.defaultContactMaterial,this.enableFrictionReduction=!1}createContactEquation(e,t,i,r,s,o){let a;this.contactPointPool.length?(a=this.contactPointPool.pop(),a.bi=e,a.bj=t):a=new Uo(e,t),a.enabled=e.collisionResponse&&t.collisionResponse&&i.collisionResponse&&r.collisionResponse;const l=this.currentContactMaterial;a.restitution=l.restitution,a.setSpookParams(l.contactEquationStiffness,l.contactEquationRelaxation,this.world.dt);const c=i.material||e.material,d=r.material||t.material;return c&&d&&c.restitution>=0&&d.restitution>=0&&(a.restitution=c.restitution*d.restitution),a.si=s||i,a.sj=o||r,a}createFrictionEquationsFromContact(e,t){const i=e.bi,r=e.bj,s=e.si,o=e.sj,a=this.world,l=this.currentContactMaterial;let c=l.friction;const d=s.material||i.material,h=o.material||r.material;if(d&&h&&d.friction>=0&&h.friction>=0&&(c=d.friction*h.friction),c>0){const u=c*(a.frictionGravity||a.gravity).length();let p=i.invMass+r.invMass;p>0&&(p=1/p);const v=this.frictionEquationPool,_=v.length?v.pop():new cp(i,r,u*p),g=v.length?v.pop():new cp(i,r,u*p);return _.bi=g.bi=i,_.bj=g.bj=r,_.minForce=g.minForce=-u*p,_.maxForce=g.maxForce=u*p,_.ri.copy(e.ri),_.rj.copy(e.rj),g.ri.copy(e.ri),g.rj.copy(e.rj),e.ni.tangents(_.t,g.t),_.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,a.dt),g.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,a.dt),_.enabled=g.enabled=e.enabled,t.push(_,g),!0}return!1}createFrictionFromAverage(e){let t=this.result[this.result.length-1];if(!this.createFrictionEquationsFromContact(t,this.frictionResult)||e===1)return;const i=this.frictionResult[this.frictionResult.length-2],r=this.frictionResult[this.frictionResult.length-1];gr.setZero(),$r.setZero(),Kr.setZero();const s=t.bi;t.bj;for(let a=0;a!==e;a++)t=this.result[this.result.length-1-a],t.bi!==s?(gr.vadd(t.ni,gr),$r.vadd(t.ri,$r),Kr.vadd(t.rj,Kr)):(gr.vsub(t.ni,gr),$r.vadd(t.rj,$r),Kr.vadd(t.ri,Kr));const o=1/e;$r.scale(o,i.ri),Kr.scale(o,i.rj),r.ri.copy(i.ri),r.rj.copy(i.rj),gr.normalize(),gr.tangents(i.t,r.t)}getContacts(e,t,i,r,s,o,a){this.contactPointPool=s,this.frictionEquationPool=a,this.result=r,this.frictionResult=o;const l=bS,c=LS,d=RS,h=CS;for(let u=0,p=e.length;u!==p;u++){const v=e[u],_=t[u];let g=null;v.material&&_.material&&(g=i.getContactMaterial(v.material,_.material)||null);const f=v.type&fe.KINEMATIC&&_.type&fe.STATIC||v.type&fe.STATIC&&_.type&fe.KINEMATIC||v.type&fe.KINEMATIC&&_.type&fe.KINEMATIC;for(let m=0;m<v.shapes.length;m++){v.quaternion.mult(v.shapeOrientations[m],l),v.quaternion.vmult(v.shapeOffsets[m],d),d.vadd(v.position,d);const y=v.shapes[m];for(let x=0;x<_.shapes.length;x++){_.quaternion.mult(_.shapeOrientations[x],c),_.quaternion.vmult(_.shapeOffsets[x],h),h.vadd(_.position,h);const M=_.shapes[x];if(!(y.collisionFilterMask&M.collisionFilterGroup&&M.collisionFilterMask&y.collisionFilterGroup)||d.distanceTo(h)>y.boundingSphereRadius+M.boundingSphereRadius)continue;let w=null;y.material&&M.material&&(w=i.getContactMaterial(y.material,M.material)||null),this.currentContactMaterial=w||g||i.defaultContactMaterial;const R=y.type|M.type,D=this[R];if(D){let E=!1;y.type<M.type?E=D.call(this,y,M,d,h,l,c,v,_,y,M,f):E=D.call(this,M,y,h,d,c,l,_,v,y,M,f),E&&f&&(i.shapeOverlapKeeper.set(y.id,M.id),i.bodyOverlapKeeper.set(v.id,_.id))}}}}}sphereSphere(e,t,i,r,s,o,a,l,c,d,h){if(h)return i.distanceSquared(r)<(e.radius+t.radius)**2;const u=this.createContactEquation(a,l,e,t,c,d);r.vsub(i,u.ni),u.ni.normalize(),u.ri.copy(u.ni),u.rj.copy(u.ni),u.ri.scale(e.radius,u.ri),u.rj.scale(-t.radius,u.rj),u.ri.vadd(i,u.ri),u.ri.vsub(a.position,u.ri),u.rj.vadd(r,u.rj),u.rj.vsub(l.position,u.rj),this.result.push(u),this.createFrictionEquationsFromContact(u,this.frictionResult)}spherePlane(e,t,i,r,s,o,a,l,c,d,h){const u=this.createContactEquation(a,l,e,t,c,d);if(u.ni.set(0,0,1),o.vmult(u.ni,u.ni),u.ni.negate(u.ni),u.ni.normalize(),u.ni.scale(e.radius,u.ri),i.vsub(r,Na),u.ni.scale(u.ni.dot(Na),up),Na.vsub(up,u.rj),-Na.dot(u.ni)<=e.radius){if(h)return!0;const p=u.ri,v=u.rj;p.vadd(i,p),p.vsub(a.position,p),v.vadd(r,v),v.vsub(l.position,v),this.result.push(u),this.createFrictionEquationsFromContact(u,this.frictionResult)}}boxBox(e,t,i,r,s,o,a,l,c,d,h){return e.convexPolyhedronRepresentation.material=e.material,t.convexPolyhedronRepresentation.material=t.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexConvex(e.convexPolyhedronRepresentation,t.convexPolyhedronRepresentation,i,r,s,o,a,l,e,t,h)}sphereBox(e,t,i,r,s,o,a,l,c,d,h){const u=this.v3pool,p=nM;i.vsub(r,Ua),t.getSideNormals(p,o);const v=e.radius;let _=!1;const g=rM,f=sM,m=oM;let y=null,x=0,M=0,w=0,R=null;for(let U=0,X=p.length;U!==X&&_===!1;U++){const I=JS;I.copy(p[U]);const B=I.length();I.normalize();const W=Ua.dot(I);if(W<B+v&&W>0){const ee=eM,q=tM;ee.copy(p[(U+1)%3]),q.copy(p[(U+2)%3]);const H=ee.length(),Y=q.length();ee.normalize(),q.normalize();const re=Ua.dot(ee),oe=Ua.dot(q);if(re<H&&re>-H&&oe<Y&&oe>-Y){const F=Math.abs(W-B-v);if((R===null||F<R)&&(R=F,M=re,w=oe,y=B,g.copy(I),f.copy(ee),m.copy(q),x++,h))return!0}}}if(x){_=!0;const U=this.createContactEquation(a,l,e,t,c,d);g.scale(-v,U.ri),U.ni.copy(g),U.ni.negate(U.ni),g.scale(y,g),f.scale(M,f),g.vadd(f,g),m.scale(w,m),g.vadd(m,U.rj),U.ri.vadd(i,U.ri),U.ri.vsub(a.position,U.ri),U.rj.vadd(r,U.rj),U.rj.vsub(l.position,U.rj),this.result.push(U),this.createFrictionEquationsFromContact(U,this.frictionResult)}let D=u.get();const E=iM;for(let U=0;U!==2&&!_;U++)for(let X=0;X!==2&&!_;X++)for(let I=0;I!==2&&!_;I++)if(D.set(0,0,0),U?D.vadd(p[0],D):D.vsub(p[0],D),X?D.vadd(p[1],D):D.vsub(p[1],D),I?D.vadd(p[2],D):D.vsub(p[2],D),r.vadd(D,E),E.vsub(i,E),E.lengthSquared()<v*v){if(h)return!0;_=!0;const B=this.createContactEquation(a,l,e,t,c,d);B.ri.copy(E),B.ri.normalize(),B.ni.copy(B.ri),B.ri.scale(v,B.ri),B.rj.copy(D),B.ri.vadd(i,B.ri),B.ri.vsub(a.position,B.ri),B.rj.vadd(r,B.rj),B.rj.vsub(l.position,B.rj),this.result.push(B),this.createFrictionEquationsFromContact(B,this.frictionResult)}u.release(D),D=null;const T=u.get(),V=u.get(),O=u.get(),C=u.get(),P=u.get(),N=p.length;for(let U=0;U!==N&&!_;U++)for(let X=0;X!==N&&!_;X++)if(U%3!==X%3){p[X].cross(p[U],T),T.normalize(),p[U].vadd(p[X],V),O.copy(i),O.vsub(V,O),O.vsub(r,O);const I=O.dot(T);T.scale(I,C);let B=0;for(;B===U%3||B===X%3;)B++;P.copy(i),P.vsub(C,P),P.vsub(V,P),P.vsub(r,P);const W=Math.abs(I),ee=P.length();if(W<p[B].length()&&ee<v){if(h)return!0;_=!0;const q=this.createContactEquation(a,l,e,t,c,d);V.vadd(C,q.rj),q.rj.copy(q.rj),P.negate(q.ni),q.ni.normalize(),q.ri.copy(q.rj),q.ri.vadd(r,q.ri),q.ri.vsub(i,q.ri),q.ri.normalize(),q.ri.scale(v,q.ri),q.ri.vadd(i,q.ri),q.ri.vsub(a.position,q.ri),q.rj.vadd(r,q.rj),q.rj.vsub(l.position,q.rj),this.result.push(q),this.createFrictionEquationsFromContact(q,this.frictionResult)}}u.release(T,V,O,C,P)}planeBox(e,t,i,r,s,o,a,l,c,d,h){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,t.convexPolyhedronRepresentation.id=t.id,this.planeConvex(e,t.convexPolyhedronRepresentation,i,r,s,o,a,l,e,t,h)}convexConvex(e,t,i,r,s,o,a,l,c,d,h,u,p){const v=SM;if(!(i.distanceTo(r)>e.boundingSphereRadius+t.boundingSphereRadius)&&e.findSeparatingAxis(t,i,s,r,o,v,u,p)){const _=[],g=MM;e.clipAgainstHull(i,s,t,r,o,v,-100,100,_);let f=0;for(let m=0;m!==_.length;m++){if(h)return!0;const y=this.createContactEquation(a,l,e,t,c,d),x=y.ri,M=y.rj;v.negate(y.ni),_[m].normal.negate(g),g.scale(_[m].depth,g),_[m].point.vadd(g,x),M.copy(_[m].point),x.vsub(i,x),M.vsub(r,M),x.vadd(i,x),x.vsub(a.position,x),M.vadd(r,M),M.vsub(l.position,M),this.result.push(y),f++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(y,this.frictionResult)}this.enableFrictionReduction&&f&&this.createFrictionFromAverage(f)}}sphereConvex(e,t,i,r,s,o,a,l,c,d,h){const u=this.v3pool;i.vsub(r,aM);const p=t.faceNormals,v=t.faces,_=t.vertices,g=e.radius;let f=!1;for(let m=0;m!==_.length;m++){const y=_[m],x=dM;o.vmult(y,x),r.vadd(x,x);const M=uM;if(x.vsub(i,M),M.lengthSquared()<g*g){if(h)return!0;f=!0;const w=this.createContactEquation(a,l,e,t,c,d);w.ri.copy(M),w.ri.normalize(),w.ni.copy(w.ri),w.ri.scale(g,w.ri),x.vsub(r,w.rj),w.ri.vadd(i,w.ri),w.ri.vsub(a.position,w.ri),w.rj.vadd(r,w.rj),w.rj.vsub(l.position,w.rj),this.result.push(w),this.createFrictionEquationsFromContact(w,this.frictionResult);return}}for(let m=0,y=v.length;m!==y&&f===!1;m++){const x=p[m],M=v[m],w=fM;o.vmult(x,w);const R=hM;o.vmult(_[M[0]],R),R.vadd(r,R);const D=pM;w.scale(-g,D),i.vadd(D,D);const E=mM;D.vsub(R,E);const T=E.dot(w),V=gM;if(i.vsub(R,V),T<0&&V.dot(w)>0){const O=[];for(let C=0,P=M.length;C!==P;C++){const N=u.get();o.vmult(_[M[C]],N),r.vadd(N,N),O.push(N)}if(QS(O,w,i)){if(h)return!0;f=!0;const C=this.createContactEquation(a,l,e,t,c,d);w.scale(-g,C.ri),w.negate(C.ni);const P=u.get();w.scale(-T,P);const N=u.get();w.scale(-g,N),i.vsub(r,C.rj),C.rj.vadd(N,C.rj),C.rj.vadd(P,C.rj),C.rj.vadd(r,C.rj),C.rj.vsub(l.position,C.rj),C.ri.vadd(i,C.ri),C.ri.vsub(a.position,C.ri),u.release(P),u.release(N),this.result.push(C),this.createFrictionEquationsFromContact(C,this.frictionResult);for(let U=0,X=O.length;U!==X;U++)u.release(O[U]);return}else for(let C=0;C!==M.length;C++){const P=u.get(),N=u.get();o.vmult(_[M[(C+1)%M.length]],P),o.vmult(_[M[(C+2)%M.length]],N),r.vadd(P,P),r.vadd(N,N);const U=lM;N.vsub(P,U);const X=cM;U.unit(X);const I=u.get(),B=u.get();i.vsub(P,B);const W=B.dot(X);X.scale(W,I),I.vadd(P,I);const ee=u.get();if(I.vsub(i,ee),W>0&&W*W<U.lengthSquared()&&ee.lengthSquared()<g*g){if(h)return!0;const q=this.createContactEquation(a,l,e,t,c,d);I.vsub(r,q.rj),I.vsub(i,q.ni),q.ni.normalize(),q.ni.scale(g,q.ri),q.rj.vadd(r,q.rj),q.rj.vsub(l.position,q.rj),q.ri.vadd(i,q.ri),q.ri.vsub(a.position,q.ri),this.result.push(q),this.createFrictionEquationsFromContact(q,this.frictionResult);for(let H=0,Y=O.length;H!==Y;H++)u.release(O[H]);u.release(P),u.release(N),u.release(I),u.release(ee),u.release(B);return}u.release(P),u.release(N),u.release(I),u.release(ee),u.release(B)}for(let C=0,P=O.length;C!==P;C++)u.release(O[C])}}}planeConvex(e,t,i,r,s,o,a,l,c,d,h){const u=vM,p=_M;p.set(0,0,1),s.vmult(p,p);let v=0;const _=yM;for(let g=0;g!==t.vertices.length;g++)if(u.copy(t.vertices[g]),o.vmult(u,u),r.vadd(u,u),u.vsub(i,_),p.dot(_)<=0){if(h)return!0;const m=this.createContactEquation(a,l,e,t,c,d),y=xM;p.scale(p.dot(_),y),u.vsub(y,y),y.vsub(i,m.ri),m.ni.copy(p),u.vsub(r,m.rj),m.ri.vadd(i,m.ri),m.ri.vsub(a.position,m.ri),m.rj.vadd(r,m.rj),m.rj.vsub(l.position,m.rj),this.result.push(m),v++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(m,this.frictionResult)}this.enableFrictionReduction&&v&&this.createFrictionFromAverage(v)}boxConvex(e,t,i,r,s,o,a,l,c,d,h){return e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexConvex(e.convexPolyhedronRepresentation,t,i,r,s,o,a,l,e,t,h)}sphereHeightfield(e,t,i,r,s,o,a,l,c,d,h){const u=t.data,p=e.radius,v=t.elementSize,_=NM,g=IM;qe.pointToLocalFrame(r,o,i,g);let f=Math.floor((g.x-p)/v)-1,m=Math.ceil((g.x+p)/v)+1,y=Math.floor((g.y-p)/v)-1,x=Math.ceil((g.y+p)/v)+1;if(m<0||x<0||f>u.length||y>u[0].length)return;f<0&&(f=0),m<0&&(m=0),y<0&&(y=0),x<0&&(x=0),f>=u.length&&(f=u.length-1),m>=u.length&&(m=u.length-1),x>=u[0].length&&(x=u[0].length-1),y>=u[0].length&&(y=u[0].length-1);const M=[];t.getRectMinMax(f,y,m,x,M);const w=M[0],R=M[1];if(g.z-p>R||g.z+p<w)return;const D=this.result;for(let E=f;E<m;E++)for(let T=y;T<x;T++){const V=D.length;let O=!1;if(t.getConvexTrianglePillar(E,T,!1),qe.pointToWorldFrame(r,o,t.pillarOffset,_),i.distanceTo(_)<t.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&(O=this.sphereConvex(e,t.pillarConvex,i,_,s,o,a,l,e,t,h)),h&&O||(t.getConvexTrianglePillar(E,T,!0),qe.pointToWorldFrame(r,o,t.pillarOffset,_),i.distanceTo(_)<t.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&(O=this.sphereConvex(e,t.pillarConvex,i,_,s,o,a,l,e,t,h)),h&&O))return!0;if(D.length-V>2)return}}boxHeightfield(e,t,i,r,s,o,a,l,c,d,h){return e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexHeightfield(e.convexPolyhedronRepresentation,t,i,r,s,o,a,l,e,t,h)}convexHeightfield(e,t,i,r,s,o,a,l,c,d,h){const u=t.data,p=t.elementSize,v=e.boundingSphereRadius,_=PM,g=DM,f=LM;qe.pointToLocalFrame(r,o,i,f);let m=Math.floor((f.x-v)/p)-1,y=Math.ceil((f.x+v)/p)+1,x=Math.floor((f.y-v)/p)-1,M=Math.ceil((f.y+v)/p)+1;if(y<0||M<0||m>u.length||x>u[0].length)return;m<0&&(m=0),y<0&&(y=0),x<0&&(x=0),M<0&&(M=0),m>=u.length&&(m=u.length-1),y>=u.length&&(y=u.length-1),M>=u[0].length&&(M=u[0].length-1),x>=u[0].length&&(x=u[0].length-1);const w=[];t.getRectMinMax(m,x,y,M,w);const R=w[0],D=w[1];if(!(f.z-v>D||f.z+v<R))for(let E=m;E<y;E++)for(let T=x;T<M;T++){let V=!1;if(t.getConvexTrianglePillar(E,T,!1),qe.pointToWorldFrame(r,o,t.pillarOffset,_),i.distanceTo(_)<t.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&(V=this.convexConvex(e,t.pillarConvex,i,_,s,o,a,l,null,null,h,g,null)),h&&V||(t.getConvexTrianglePillar(E,T,!0),qe.pointToWorldFrame(r,o,t.pillarOffset,_),i.distanceTo(_)<t.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&(V=this.convexConvex(e,t.pillarConvex,i,_,s,o,a,l,null,null,h,g,null)),h&&V))return!0}}sphereParticle(e,t,i,r,s,o,a,l,c,d,h){const u=AM;if(u.set(0,0,1),r.vsub(i,u),u.lengthSquared()<=e.radius*e.radius){if(h)return!0;const v=this.createContactEquation(l,a,t,e,c,d);u.normalize(),v.rj.copy(u),v.rj.scale(e.radius,v.rj),v.ni.copy(u),v.ni.negate(v.ni),v.ri.set(0,0,0),this.result.push(v),this.createFrictionEquationsFromContact(v,this.frictionResult)}}planeParticle(e,t,i,r,s,o,a,l,c,d,h){const u=EM;u.set(0,0,1),a.quaternion.vmult(u,u);const p=wM;if(r.vsub(a.position,p),u.dot(p)<=0){if(h)return!0;const _=this.createContactEquation(l,a,t,e,c,d);_.ni.copy(u),_.ni.negate(_.ni),_.ri.set(0,0,0);const g=TM;u.scale(u.dot(r),g),r.vsub(g,g),_.rj.copy(g),this.result.push(_),this.createFrictionEquationsFromContact(_,this.frictionResult)}}boxParticle(e,t,i,r,s,o,a,l,c,d,h){return e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexParticle(e.convexPolyhedronRepresentation,t,i,r,s,o,a,l,e,t,h)}convexParticle(e,t,i,r,s,o,a,l,c,d,h){let u=-1;const p=CM,v=bM;let _=null;const g=RM;if(g.copy(r),g.vsub(i,g),s.conjugate(dp),dp.vmult(g,g),e.pointIsInside(g)){e.worldVerticesNeedsUpdate&&e.computeWorldVertices(i,s),e.worldFaceNormalsNeedsUpdate&&e.computeWorldFaceNormals(s);for(let f=0,m=e.faces.length;f!==m;f++){const y=[e.worldVertices[e.faces[f][0]]],x=e.worldFaceNormals[f];r.vsub(y[0],fp);const M=-x.dot(fp);if(_===null||Math.abs(M)<Math.abs(_)){if(h)return!0;_=M,u=f,p.copy(x)}}if(u!==-1){const f=this.createContactEquation(l,a,t,e,c,d);p.scale(_,v),v.vadd(r,v),v.vsub(i,v),f.rj.copy(v),p.negate(f.ni),f.ri.set(0,0,0);const m=f.ri,y=f.rj;m.vadd(r,m),m.vsub(l.position,m),y.vadd(i,y),y.vsub(a.position,y),this.result.push(f),this.createFrictionEquationsFromContact(f,this.frictionResult)}else console.warn("Point found inside convex, but did not find penetrating face!")}}heightfieldCylinder(e,t,i,r,s,o,a,l,c,d,h){return this.convexHeightfield(t,e,r,i,o,s,l,a,c,d,h)}particleCylinder(e,t,i,r,s,o,a,l,c,d,h){return this.convexParticle(t,e,r,i,o,s,l,a,c,d,h)}sphereTrimesh(e,t,i,r,s,o,a,l,c,d,h){const u=OS,p=BS,v=kS,_=HS,g=GS,f=VS,m=jS,y=zS,x=US,M=YS;qe.pointToLocalFrame(r,o,i,g);const w=e.radius;m.lowerBound.set(g.x-w,g.y-w,g.z-w),m.upperBound.set(g.x+w,g.y+w,g.z+w),t.getTrianglesInAABB(m,M);const R=FS,D=e.radius*e.radius;for(let C=0;C<M.length;C++)for(let P=0;P<3;P++)if(t.getVertex(t.indices[M[C]*3+P],R),R.vsub(g,x),x.lengthSquared()<=D){if(y.copy(R),qe.pointToWorldFrame(r,o,y,R),R.vsub(i,x),h)return!0;let N=this.createContactEquation(a,l,e,t,c,d);N.ni.copy(x),N.ni.normalize(),N.ri.copy(N.ni),N.ri.scale(e.radius,N.ri),N.ri.vadd(i,N.ri),N.ri.vsub(a.position,N.ri),N.rj.copy(R),N.rj.vsub(l.position,N.rj),this.result.push(N),this.createFrictionEquationsFromContact(N,this.frictionResult)}for(let C=0;C<M.length;C++)for(let P=0;P<3;P++){t.getVertex(t.indices[M[C]*3+P],u),t.getVertex(t.indices[M[C]*3+(P+1)%3],p),p.vsub(u,v),g.vsub(p,f);const N=f.dot(v);g.vsub(u,f);let U=f.dot(v);if(U>0&&N<0&&(g.vsub(u,f),_.copy(v),_.normalize(),U=f.dot(_),_.scale(U,f),f.vadd(u,f),f.distanceTo(g)<e.radius)){if(h)return!0;const I=this.createContactEquation(a,l,e,t,c,d);f.vsub(g,I.ni),I.ni.normalize(),I.ni.scale(e.radius,I.ri),I.ri.vadd(i,I.ri),I.ri.vsub(a.position,I.ri),qe.pointToWorldFrame(r,o,f,f),f.vsub(l.position,I.rj),qe.vectorToWorldFrame(o,I.ni,I.ni),qe.vectorToWorldFrame(o,I.ri,I.ri),this.result.push(I),this.createFrictionEquationsFromContact(I,this.frictionResult)}}const E=WS,T=XS,V=qS,O=NS;for(let C=0,P=M.length;C!==P;C++){t.getTriangleVertices(M[C],E,T,V),t.getNormal(M[C],O),g.vsub(E,f);let N=f.dot(O);if(O.scale(N,f),g.vsub(f,f),N=f.distanceTo(g),di.pointInTriangle(f,E,T,V)&&N<e.radius){if(h)return!0;let U=this.createContactEquation(a,l,e,t,c,d);f.vsub(g,U.ni),U.ni.normalize(),U.ni.scale(e.radius,U.ri),U.ri.vadd(i,U.ri),U.ri.vsub(a.position,U.ri),qe.pointToWorldFrame(r,o,f,f),f.vsub(l.position,U.rj),qe.vectorToWorldFrame(o,U.ni,U.ni),qe.vectorToWorldFrame(o,U.ri,U.ri),this.result.push(U),this.createFrictionEquationsFromContact(U,this.frictionResult)}}M.length=0}planeTrimesh(e,t,i,r,s,o,a,l,c,d,h){const u=new S,p=PS;p.set(0,0,1),s.vmult(p,p);for(let v=0;v<t.vertices.length/3;v++){t.getVertex(v,u);const _=new S;_.copy(u),qe.pointToWorldFrame(r,o,_,u);const g=DS;if(u.vsub(i,g),p.dot(g)<=0){if(h)return!0;const m=this.createContactEquation(a,l,e,t,c,d);m.ni.copy(p);const y=IS;p.scale(g.dot(p),y),u.vsub(y,y),m.ri.copy(y),m.ri.vsub(a.position,m.ri),m.rj.copy(u),m.rj.vsub(l.position,m.rj),this.result.push(m),this.createFrictionEquationsFromContact(m,this.frictionResult)}}}}const gr=new S,$r=new S,Kr=new S,RS=new S,CS=new S,bS=new mn,LS=new mn,PS=new S,DS=new S,IS=new S,NS=new S,US=new S;new S;const FS=new S,zS=new S,OS=new S,BS=new S,kS=new S,HS=new S,GS=new S,VS=new S,WS=new S,XS=new S,qS=new S,jS=new wn,YS=[],Na=new S,up=new S,$S=new S,KS=new S,ZS=new S;function QS(n,e,t){let i=null;const r=n.length;for(let s=0;s!==r;s++){const o=n[s],a=$S;n[(s+1)%r].vsub(o,a);const l=KS;a.cross(e,l);const c=ZS;t.vsub(o,c);const d=l.dot(c);if(i===null||d>0&&i===!0||d<=0&&i===!1){i===null&&(i=d>0);continue}else return!1}return!0}const Ua=new S,JS=new S,eM=new S,tM=new S,nM=[new S,new S,new S,new S,new S,new S],iM=new S,rM=new S,sM=new S,oM=new S,aM=new S,lM=new S,cM=new S,uM=new S,dM=new S,fM=new S,hM=new S,pM=new S,mM=new S,gM=new S;new S;new S;const vM=new S,_M=new S,yM=new S,xM=new S,SM=new S,MM=new S,EM=new S,wM=new S,TM=new S,AM=new S,dp=new mn,RM=new S;new S;const CM=new S,fp=new S,bM=new S,LM=new S,PM=new S,DM=[0],IM=new S,NM=new S;class hp{constructor(){this.current=[],this.previous=[]}getKey(e,t){if(t<e){const i=t;t=e,e=i}return e<<16|t}set(e,t){const i=this.getKey(e,t),r=this.current;let s=0;for(;i>r[s];)s++;if(i!==r[s]){for(let o=r.length-1;o>=s;o--)r[o+1]=r[o];r[s]=i}}tick(){const e=this.current;this.current=this.previous,this.previous=e,this.current.length=0}getDiff(e,t){const i=this.current,r=this.previous,s=i.length,o=r.length;let a=0;for(let l=0;l<s;l++){let c=!1;const d=i[l];for(;d>r[a];)a++;c=d===r[a],c||pp(e,d)}a=0;for(let l=0;l<o;l++){let c=!1;const d=r[l];for(;d>i[a];)a++;c=i[a]===d,c||pp(t,d)}}}function pp(n,e){n.push((e&4294901760)>>16,e&65535)}const Qc=(n,e)=>n<e?`${n}-${e}`:`${e}-${n}`;class UM{constructor(){this.data={keys:[]}}get(e,t){const i=Qc(e,t);return this.data[i]}set(e,t,i){const r=Qc(e,t);this.get(e,t)||this.data.keys.push(r),this.data[r]=i}delete(e,t){const i=Qc(e,t),r=this.data.keys.indexOf(i);r!==-1&&this.data.keys.splice(r,1),delete this.data[i]}reset(){const e=this.data,t=e.keys;for(;t.length>0;){const i=t.pop();delete e[i]}}}class FM extends Zv{constructor(e){e===void 0&&(e={}),super(),this.dt=-1,this.allowSleep=!!e.allowSleep,this.contacts=[],this.frictionEquations=[],this.quatNormalizeSkip=e.quatNormalizeSkip!==void 0?e.quatNormalizeSkip:0,this.quatNormalizeFast=e.quatNormalizeFast!==void 0?e.quatNormalizeFast:!1,this.time=0,this.stepnumber=0,this.default_dt=1/60,this.nextId=0,this.gravity=new S,e.gravity&&this.gravity.copy(e.gravity),e.frictionGravity&&(this.frictionGravity=new S,this.frictionGravity.copy(e.frictionGravity)),this.broadphase=e.broadphase!==void 0?e.broadphase:new Qv,this.bodies=[],this.hasActiveBodies=!1,this.solver=e.solver!==void 0?e.solver:new xS,this.constraints=[],this.narrowphase=new AS(this),this.collisionMatrix=new Jh,this.collisionMatrixPrevious=new Jh,this.bodyOverlapKeeper=new hp,this.shapeOverlapKeeper=new hp,this.contactmaterials=[],this.contactMaterialTable=new UM,this.defaultMaterial=new a0("default"),this.defaultContactMaterial=new hc(this.defaultMaterial,this.defaultMaterial,{friction:.3,restitution:0}),this.doProfiling=!1,this.profile={solve:0,makeContactConstraints:0,broadphase:0,integrate:0,narrowphase:0},this.accumulator=0,this.subsystems=[],this.addBodyEvent={type:"addBody",body:null},this.removeBodyEvent={type:"removeBody",body:null},this.idToBodyMap={},this.broadphase.setWorld(this)}getContactMaterial(e,t){return this.contactMaterialTable.get(e.id,t.id)}collisionMatrixTick(){const e=this.collisionMatrixPrevious;this.collisionMatrixPrevious=this.collisionMatrix,this.collisionMatrix=e,this.collisionMatrix.reset(),this.bodyOverlapKeeper.tick(),this.shapeOverlapKeeper.tick()}addConstraint(e){this.constraints.push(e)}removeConstraint(e){const t=this.constraints.indexOf(e);t!==-1&&this.constraints.splice(t,1)}rayTest(e,t,i){i instanceof Yl?this.raycastClosest(e,t,{skipBackfaces:!0},i):this.raycastAll(e,t,{skipBackfaces:!0},i)}raycastAll(e,t,i,r){return i===void 0&&(i={}),i.mode=di.ALL,i.from=e,i.to=t,i.callback=r,Jc.intersectWorld(this,i)}raycastAny(e,t,i,r){return i===void 0&&(i={}),i.mode=di.ANY,i.from=e,i.to=t,i.result=r,Jc.intersectWorld(this,i)}raycastClosest(e,t,i,r){return i===void 0&&(i={}),i.mode=di.CLOSEST,i.from=e,i.to=t,i.result=r,Jc.intersectWorld(this,i)}addBody(e){this.bodies.includes(e)||(e.index=this.bodies.length,this.bodies.push(e),e.world=this,e.initPosition.copy(e.position),e.initVelocity.copy(e.velocity),e.timeLastSleepy=this.time,e instanceof fe&&(e.initAngularVelocity.copy(e.angularVelocity),e.initQuaternion.copy(e.quaternion)),this.collisionMatrix.setNumObjects(this.bodies.length),this.addBodyEvent.body=e,this.idToBodyMap[e.id]=e,this.dispatchEvent(this.addBodyEvent))}removeBody(e){e.world=null;const t=this.bodies.length-1,i=this.bodies,r=i.indexOf(e);if(r!==-1){i.splice(r,1);for(let s=0;s!==i.length;s++)i[s].index=s;this.collisionMatrix.setNumObjects(t),this.removeBodyEvent.body=e,delete this.idToBodyMap[e.id],this.dispatchEvent(this.removeBodyEvent)}}getBodyById(e){return this.idToBodyMap[e]}getShapeById(e){const t=this.bodies;for(let i=0;i<t.length;i++){const r=t[i].shapes;for(let s=0;s<r.length;s++){const o=r[s];if(o.id===e)return o}}return null}addContactMaterial(e){this.contactmaterials.push(e),this.contactMaterialTable.set(e.materials[0].id,e.materials[1].id,e)}removeContactMaterial(e){const t=this.contactmaterials.indexOf(e);t!==-1&&(this.contactmaterials.splice(t,1),this.contactMaterialTable.delete(e.materials[0].id,e.materials[1].id))}fixedStep(e,t){e===void 0&&(e=1/60),t===void 0&&(t=10);const i=Et.now()/1e3;if(!this.lastCallTime)this.step(e,void 0,t);else{const r=i-this.lastCallTime;this.step(e,r,t)}this.lastCallTime=i}step(e,t,i){if(i===void 0&&(i=10),t===void 0)this.internalStep(e),this.time+=e;else{this.accumulator+=t;const r=Et.now();let s=0;for(;this.accumulator>=e&&s<i&&(this.internalStep(e),this.accumulator-=e,s++,!(Et.now()-r>e*1e3)););this.accumulator=this.accumulator%e;const o=this.accumulator/e;for(let a=0;a!==this.bodies.length;a++){const l=this.bodies[a];l.previousPosition.lerp(l.position,o,l.interpolatedPosition),l.previousQuaternion.slerp(l.quaternion,o,l.interpolatedQuaternion),l.previousQuaternion.normalize()}this.time+=t}}internalStep(e){this.dt=e;const t=this.contacts,i=HM,r=GM,s=this.bodies.length,o=this.bodies,a=this.solver,l=this.gravity,c=this.doProfiling,d=this.profile,h=fe.DYNAMIC;let u=-1/0;const p=this.constraints,v=kM;l.length();const _=l.x,g=l.y,f=l.z;let m=0;for(c&&(u=Et.now()),m=0;m!==s;m++){const C=o[m];if(C.type===h){const P=C.force,N=C.mass;P.x+=N*_,P.y+=N*g,P.z+=N*f}}for(let C=0,P=this.subsystems.length;C!==P;C++)this.subsystems[C].update();c&&(u=Et.now()),i.length=0,r.length=0,this.broadphase.collisionPairs(this,i,r),c&&(d.broadphase=Et.now()-u);let y=p.length;for(m=0;m!==y;m++){const C=p[m];if(!C.collideConnected)for(let P=i.length-1;P>=0;P-=1)(C.bodyA===i[P]&&C.bodyB===r[P]||C.bodyB===i[P]&&C.bodyA===r[P])&&(i.splice(P,1),r.splice(P,1))}this.collisionMatrixTick(),c&&(u=Et.now());const x=BM,M=t.length;for(m=0;m!==M;m++)x.push(t[m]);t.length=0;const w=this.frictionEquations.length;for(m=0;m!==w;m++)v.push(this.frictionEquations[m]);for(this.frictionEquations.length=0,this.narrowphase.getContacts(i,r,this,t,x,this.frictionEquations,v),c&&(d.narrowphase=Et.now()-u),c&&(u=Et.now()),m=0;m<this.frictionEquations.length;m++)a.addEquation(this.frictionEquations[m]);const R=t.length;for(let C=0;C!==R;C++){const P=t[C],N=P.bi,U=P.bj,X=P.si,I=P.sj;let B;if(N.material&&U.material?B=this.getContactMaterial(N.material,U.material)||this.defaultContactMaterial:B=this.defaultContactMaterial,B.friction,N.material&&U.material&&(N.material.friction>=0&&U.material.friction>=0&&N.material.friction*U.material.friction,N.material.restitution>=0&&U.material.restitution>=0&&(P.restitution=N.material.restitution*U.material.restitution)),a.addEquation(P),N.allowSleep&&N.type===fe.DYNAMIC&&N.sleepState===fe.SLEEPING&&U.sleepState===fe.AWAKE&&U.type!==fe.STATIC){const W=U.velocity.lengthSquared()+U.angularVelocity.lengthSquared(),ee=U.sleepSpeedLimit**2;W>=ee*2&&(N.wakeUpAfterNarrowphase=!0)}if(U.allowSleep&&U.type===fe.DYNAMIC&&U.sleepState===fe.SLEEPING&&N.sleepState===fe.AWAKE&&N.type!==fe.STATIC){const W=N.velocity.lengthSquared()+N.angularVelocity.lengthSquared(),ee=N.sleepSpeedLimit**2;W>=ee*2&&(U.wakeUpAfterNarrowphase=!0)}this.collisionMatrix.set(N,U,!0),this.collisionMatrixPrevious.get(N,U)||(uo.body=U,uo.contact=P,N.dispatchEvent(uo),uo.body=N,U.dispatchEvent(uo)),this.bodyOverlapKeeper.set(N.id,U.id),this.shapeOverlapKeeper.set(X.id,I.id)}for(this.emitContactEvents(),c&&(d.makeContactConstraints=Et.now()-u,u=Et.now()),m=0;m!==s;m++){const C=o[m];C.wakeUpAfterNarrowphase&&(C.wakeUp(),C.wakeUpAfterNarrowphase=!1)}for(y=p.length,m=0;m!==y;m++){const C=p[m];C.update();for(let P=0,N=C.equations.length;P!==N;P++){const U=C.equations[P];a.addEquation(U)}}a.solve(e,this),c&&(d.solve=Et.now()-u),a.removeAllEquations();const D=Math.pow;for(m=0;m!==s;m++){const C=o[m];if(C.type&h){const P=D(1-C.linearDamping,e),N=C.velocity;N.scale(P,N);const U=C.angularVelocity;if(U){const X=D(1-C.angularDamping,e);U.scale(X,U)}}}this.dispatchEvent(OM),c&&(u=Et.now());const T=this.stepnumber%(this.quatNormalizeSkip+1)===0,V=this.quatNormalizeFast;for(m=0;m!==s;m++)o[m].integrate(e,T,V);this.clearForces(),this.broadphase.dirty=!0,c&&(d.integrate=Et.now()-u),this.stepnumber+=1,this.dispatchEvent(zM);let O=!0;if(this.allowSleep)for(O=!1,m=0;m!==s;m++){const C=o[m];C.sleepTick(this.time),C.sleepState!==fe.SLEEPING&&(O=!0)}this.hasActiveBodies=O}emitContactEvents(){const e=this.hasAnyEventListener("beginContact"),t=this.hasAnyEventListener("endContact");if((e||t)&&this.bodyOverlapKeeper.getDiff(pi,mi),e){for(let s=0,o=pi.length;s<o;s+=2)fo.bodyA=this.getBodyById(pi[s]),fo.bodyB=this.getBodyById(pi[s+1]),this.dispatchEvent(fo);fo.bodyA=fo.bodyB=null}if(t){for(let s=0,o=mi.length;s<o;s+=2)ho.bodyA=this.getBodyById(mi[s]),ho.bodyB=this.getBodyById(mi[s+1]),this.dispatchEvent(ho);ho.bodyA=ho.bodyB=null}pi.length=mi.length=0;const i=this.hasAnyEventListener("beginShapeContact"),r=this.hasAnyEventListener("endShapeContact");if((i||r)&&this.shapeOverlapKeeper.getDiff(pi,mi),i){for(let s=0,o=pi.length;s<o;s+=2){const a=this.getShapeById(pi[s]),l=this.getShapeById(pi[s+1]);gi.shapeA=a,gi.shapeB=l,a&&(gi.bodyA=a.body),l&&(gi.bodyB=l.body),this.dispatchEvent(gi)}gi.bodyA=gi.bodyB=gi.shapeA=gi.shapeB=null}if(r){for(let s=0,o=mi.length;s<o;s+=2){const a=this.getShapeById(mi[s]),l=this.getShapeById(mi[s+1]);vi.shapeA=a,vi.shapeB=l,a&&(vi.bodyA=a.body),l&&(vi.bodyB=l.body),this.dispatchEvent(vi)}vi.bodyA=vi.bodyB=vi.shapeA=vi.shapeB=null}}clearForces(){const e=this.bodies,t=e.length;for(let i=0;i!==t;i++){const r=e[i];r.force,r.torque,r.force.set(0,0,0),r.torque.set(0,0,0)}}}new wn;const Jc=new di,Et=globalThis.performance||{};if(!Et.now){let n=Date.now();Et.timing&&Et.timing.navigationStart&&(n=Et.timing.navigationStart),Et.now=()=>Date.now()-n}new S;const zM={type:"postStep"},OM={type:"preStep"},uo={type:fe.COLLIDE_EVENT_NAME,body:null,contact:null},BM=[],kM=[],HM=[],GM=[],pi=[],mi=[],fo={type:"beginContact",bodyA:null,bodyB:null},ho={type:"endContact",bodyA:null,bodyB:null},gi={type:"beginShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null},vi={type:"endShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null},vt={bar:{size:{x:10,y:.2,z:.2},mass:.1,pos:{x:0,y:15,z:0}},torso:{size:{x:1.6,y:3,z:.8},mass:1,pos:{x:0,y:8,z:0}},head:{size:{x:1.1,y:1.1,z:.8},mass:.5,pos:{x:0,y:10,z:0}},handL:{size:{x:.4,y:2,z:.4},mass:.3,pos:{x:-1.8,y:8,z:0}},handR:{size:{x:.4,y:2,z:.4},mass:.3,pos:{x:1.8,y:8,z:0}},footL:{size:{x:.5,y:2.2,z:.5},mass:.4,pos:{x:-.6,y:5,z:0}},footR:{size:{x:.5,y:2.2,z:.5},mass:.4,pos:{x:.6,y:5,z:0}}},Zr={barToHead:{a:new S(0,0,0),b:new S(0,.5,0)},barToHandL:{a:new S(-2.5,0,0),b:new S(0,1,0)},barToHandR:{a:new S(2.5,0,0),b:new S(0,1,0)}};class VM{constructor(){gt(this,"world");gt(this,"barBody");gt(this,"torsoBody");gt(this,"headBody");gt(this,"handLBody");gt(this,"handRBody");gt(this,"footLBody");gt(this,"footRBody");gt(this,"stringConstraints");gt(this,"barBase");gt(this,"windStrength",1);gt(this,"swayAmp",2);gt(this,"swayRate",.7);gt(this,"upDownAmp",.5);gt(this,"upDownRate",.9);this.world=new FM,this.world.broadphase=new Qv,this.world.gravity.set(0,-9.82,0),this.world.solver.iterations=20;const e=new fe({mass:0,shape:new _S});e.quaternion.setFromAxisAngle(new S(1,0,0),-Math.PI/2),this.world.addBody(e);const t=(s,o,a)=>{const l=new fc(new S(s.x/2,s.y/2,s.z/2)),c=new fe({mass:o,shape:l});return c.position.set(a.x,a.y,a.z),c.linearDamping=.02,this.world.addBody(c),c};this.barBody=t(vt.bar.size,vt.bar.mass,vt.bar.pos),this.barBody.type=fe.KINEMATIC,this.barBody.updateMassProperties(),this.barBody.allowSleep=!1,this.barBody.angularDamping=1,this.barBody.linearDamping=1,this.torsoBody=t(vt.torso.size,vt.torso.mass,vt.torso.pos),this.headBody=t(vt.head.size,vt.head.mass,vt.head.pos),this.handLBody=t(vt.handL.size,vt.handL.mass,vt.handL.pos),this.handRBody=t(vt.handR.size,vt.handR.mass,vt.handR.pos),this.footLBody=t(vt.footL.size,vt.footL.mass,vt.footL.pos),this.footRBody=t(vt.footR.size,vt.footR.mass,vt.footR.pos);const i=(s,o,a,l)=>{const c=new pS(s,o,a,l,1e4);this.world.addConstraint(c)};i(this.torsoBody,new S(0,1.6,0),this.headBody,new S(0,-.5,0)),i(this.torsoBody,new S(-.8,1.2,0),this.handLBody,new S(0,1,0)),i(this.torsoBody,new S(.8,1.2,0),this.handRBody,new S(0,1,0)),i(this.torsoBody,new S(-.4,-1.4,0),this.footLBody,new S(0,1,0)),i(this.torsoBody,new S(.4,-1.4,0),this.footRBody,new S(0,1,0)),this.stringConstraints=[];const r=(s,o,a,l)=>{const c=new mS(s,a,void 0,5e3);c.pivotA=o.clone(),c.pivotB=l.clone(),this.world.addConstraint(c),this.stringConstraints.push(c)};r(this.barBody,Zr.barToHead.a,this.headBody,Zr.barToHead.b),r(this.barBody,Zr.barToHandL.a,this.handLBody,Zr.barToHandL.b),r(this.barBody,Zr.barToHandR.a,this.handRBody,Zr.barToHandR.b),this.barBase=this.barBody.position.clone()}step(e,t){if(e<=0)return;const i=Math.sin(t*this.swayRate)*this.swayAmp,r=Math.sin(t*this.upDownRate)*this.upDownAmp;this.barBody.position.x=this.barBase.x+i,this.barBody.position.y=this.barBase.y+r,this.barBody.position.z=this.barBase.z,this.barBody.quaternion.set(0,0,0,1),this.barBody.velocity.set(0,0,0),this.barBody.angularVelocity.set(0,0,0);const s=.1+.1*Math.sin(t*.02),o=Math.sin(t*.11),a=Math.cos(t*.07),l=.6*s*this.windStrength,c=new S(l*o,0,l*a),d=u=>{u.applyForce(c,u.position)};d(this.torsoBody),d(this.headBody),d(this.handLBody),d(this.handRBody),d(this.footLBody),d(this.footRBody);const h=Math.min(e,1/30);this.world.step(1/60,h,3)}snapshot(){const e=i=>({position:{x:i.position.x,y:i.position.y,z:i.position.z},quaternion:{x:i.quaternion.x,y:i.quaternion.y,z:i.quaternion.z,w:i.quaternion.w}}),t=this.stringConstraints.map(i=>{const r=new S,s=new S,o=i.pivotA,a=i.pivotB;return i.bodyA.pointToWorldFrame(o,r),i.bodyB.pointToWorldFrame(a,s),{a:{x:r.x,y:r.y,z:r.z},b:{x:s.x,y:s.y,z:s.z}}});return{bar:e(this.barBody),torso:e(this.torsoBody),head:e(this.headBody),handL:e(this.handLBody),handR:e(this.handRBody),footL:e(this.footLBody),footR:e(this.footRBody),strings:t,windStrength:this.windStrength}}setWindStrength(e){this.windStrength=Math.max(0,e)}setBarMotion(e){e.swayAmp!==void 0&&(this.swayAmp=Math.max(0,e.swayAmp)),e.swayRate!==void 0&&(this.swayRate=Math.max(0,e.swayRate)),e.upDownAmp!==void 0&&(this.upDownAmp=Math.max(0,e.upDownAmp)),e.upDownRate!==void 0&&(this.upDownRate=Math.max(0,e.upDownRate))}applyExternalPose(e,t){const i=this.lookupBody(e);i&&(t.position&&t.position.length===3&&i.position.set(t.position[0],t.position[1],t.position[2]),t.quaternion&&t.quaternion.length===4&&i.quaternion.set(t.quaternion[0],t.quaternion[1],t.quaternion[2],t.quaternion[3]),t.velocity&&t.velocity.length===3&&i.velocity.set(t.velocity[0],t.velocity[1],t.velocity[2]),t.angularVelocity&&t.angularVelocity.length===3&&i.angularVelocity.set(t.angularVelocity[0],t.angularVelocity[1],t.angularVelocity[2]))}lookupBody(e){switch(e){case"bar":return this.barBody;case"torso":return this.torsoBody;case"head":return this.headBody;case"handL":return this.handLBody;case"handR":return this.handRBody;case"footL":return this.footLBody;case"footR":return this.footRBody;default:return null}}}class WM{constructor(){gt(this,"rig");gt(this,"timeSeconds",0);gt(this,"windStrength",1);gt(this,"externalScene",null);gt(this,"barMotion",{swayAmp:2,swayRate:.7,upDownAmp:.5,upDownRate:.9});this.rig=new VM}step(e){if(e<=0)return;const t=Math.min(e,1/30);this.timeSeconds+=t,this.rig.setBarMotion(this.barMotion),this.rig.step(t,this.timeSeconds)}snapshot(){return{time:this.timeSeconds,puppet:this.rig.snapshot()}}setWindStrength(e){this.windStrength=Math.max(0,e),this.rig.setWindStrength(this.windStrength)}setBarMotion(e){this.barMotion={...this.barMotion,...e}}loadExternalScene(e){this.externalScene=e;const t=e,i=(t==null?void 0:t.objects)??[],r=(t==null?void 0:t.bodies)??[],s=o=>{for(const a of o){if(!(a!=null&&a.id))continue;const l=a.transform||a;this.rig.applyExternalPose(a.id,{position:l.position,quaternion:l.quaternion,velocity:l.velocity,angularVelocity:l.angularVelocity})}};s(i),s(r)}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Nf="152",XM=0,mp=1,qM=2,c0=1,jM=2,wi=3,cr=0,ln=1,Ri=2,or=0,Us=1,gp=2,vp=3,_p=4,YM=5,ms=100,$M=101,KM=102,yp=103,xp=104,ZM=200,QM=201,JM=202,eE=203,u0=204,d0=205,tE=206,nE=207,iE=208,rE=209,sE=210,oE=0,aE=1,lE=2,Cd=3,cE=4,uE=5,dE=6,fE=7,f0=0,hE=1,pE=2,Pi=0,mE=1,gE=2,vE=3,_E=4,yE=5,h0=300,Xs=301,qs=302,bd=303,Ld=304,pc=306,Pd=1e3,qn=1001,Dd=1002,Yt=1003,Sp=1004,eu=1005,bn=1006,xE=1007,ea=1008,Gr=1009,SE=1010,ME=1011,p0=1012,EE=1013,Lr=1014,Pr=1015,ta=1016,wE=1017,TE=1018,Fs=1020,AE=1021,jn=1023,RE=1024,CE=1025,Nr=1026,js=1027,bE=1028,LE=1029,PE=1030,DE=1031,IE=1033,tu=33776,nu=33777,iu=33778,ru=33779,Mp=35840,Ep=35841,wp=35842,Tp=35843,NE=36196,Ap=37492,Rp=37496,Cp=37808,bp=37809,Lp=37810,Pp=37811,Dp=37812,Ip=37813,Np=37814,Up=37815,Fp=37816,zp=37817,Op=37818,Bp=37819,kp=37820,Hp=37821,su=36492,UE=36283,Gp=36284,Vp=36285,Wp=36286,m0=3e3,Ur=3001,FE=3200,zE=3201,OE=0,BE=1,Fr="",Pe="srgb",fi="srgb-linear",g0="display-p3",ou=7680,kE=519,Xp=35044,qp="300 es",Id=1035;class Qs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Sl=Math.PI/180,Nd=180/Math.PI;function ca(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(kt[n&255]+kt[n>>8&255]+kt[n>>16&255]+kt[n>>24&255]+"-"+kt[e&255]+kt[e>>8&255]+"-"+kt[e>>16&15|64]+kt[e>>24&255]+"-"+kt[t&63|128]+kt[t>>8&255]+"-"+kt[t>>16&255]+kt[t>>24&255]+kt[i&255]+kt[i>>8&255]+kt[i>>16&255]+kt[i>>24&255]).toLowerCase()}function tn(n,e,t){return Math.max(e,Math.min(t,n))}function HE(n,e){return(n%e+e)%e}function au(n,e,t){return(1-t)*n+t*e}function jp(n){return(n&n-1)===0&&n!==0}function GE(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Fa(n,e){switch(e.constructor){case Float32Array:return n;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function dn(n,e){switch(e.constructor){case Float32Array:return n;case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class it{constructor(e=0,t=0){it.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(tn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Be{constructor(){Be.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1]}set(e,t,i,r,s,o,a,l,c){const d=this.elements;return d[0]=e,d[1]=r,d[2]=a,d[3]=t,d[4]=s,d[5]=l,d[6]=i,d[7]=o,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],d=i[4],h=i[7],u=i[2],p=i[5],v=i[8],_=r[0],g=r[3],f=r[6],m=r[1],y=r[4],x=r[7],M=r[2],w=r[5],R=r[8];return s[0]=o*_+a*m+l*M,s[3]=o*g+a*y+l*w,s[6]=o*f+a*x+l*R,s[1]=c*_+d*m+h*M,s[4]=c*g+d*y+h*w,s[7]=c*f+d*x+h*R,s[2]=u*_+p*m+v*M,s[5]=u*g+p*y+v*w,s[8]=u*f+p*x+v*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],d=e[8];return t*o*d-t*a*c-i*s*d+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],d=e[8],h=d*o-a*c,u=a*l-d*s,p=c*s-o*l,v=t*h+i*u+r*p;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/v;return e[0]=h*_,e[1]=(r*c-d*i)*_,e[2]=(a*i-r*o)*_,e[3]=u*_,e[4]=(d*t-r*l)*_,e[5]=(r*s-a*t)*_,e[6]=p*_,e[7]=(i*l-c*t)*_,e[8]=(o*t-i*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(lu.makeScale(e,t)),this}rotate(e){return this.premultiply(lu.makeRotation(-e)),this}translate(e,t){return this.premultiply(lu.makeTranslation(e,t)),this}makeTranslation(e,t){return this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const lu=new Be;function v0(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function $l(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}const Yp={};function Fo(n){n in Yp||(Yp[n]=!0,console.warn(n))}function zs(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function cu(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const VE=new Be().fromArray([.8224621,.0331941,.0170827,.177538,.9668058,.0723974,-1e-7,1e-7,.9105199]),WE=new Be().fromArray([1.2249401,-.0420569,-.0196376,-.2249404,1.0420571,-.0786361,1e-7,0,1.0982735]);function XE(n){return n.convertSRGBToLinear().applyMatrix3(WE)}function qE(n){return n.applyMatrix3(VE).convertLinearToSRGB()}const jE={[fi]:n=>n,[Pe]:n=>n.convertSRGBToLinear(),[g0]:XE},YE={[fi]:n=>n,[Pe]:n=>n.convertLinearToSRGB(),[g0]:qE},On={enabled:!0,get legacyMode(){return console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),!this.enabled},set legacyMode(n){console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),this.enabled=!n},get workingColorSpace(){return fi},set workingColorSpace(n){console.warn("THREE.ColorManagement: .workingColorSpace is readonly.")},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;const i=jE[e],r=YE[t];if(i===void 0||r===void 0)throw new Error(`Unsupported color space conversion, "${e}" to "${t}".`);return r(i(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this.workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this.workingColorSpace)}};let Qr;class _0{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Qr===void 0&&(Qr=$l("canvas")),Qr.width=e.width,Qr.height=e.height;const i=Qr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Qr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=$l("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=zs(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(zs(t[i]/255)*255):t[i]=zs(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}class y0{constructor(e=null){this.isSource=!0,this.uuid=ca(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(uu(r[o].image)):s.push(uu(r[o]))}else s=uu(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function uu(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?_0.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let $E=0;class xn extends Qs{constructor(e=xn.DEFAULT_IMAGE,t=xn.DEFAULT_MAPPING,i=qn,r=qn,s=bn,o=ea,a=jn,l=Gr,c=xn.DEFAULT_ANISOTROPY,d=Fr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$E++}),this.uuid=ca(),this.name="",this.source=new y0(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new it(0,0),this.repeat=new it(1,1),this.center=new it(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Be,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof d=="string"?this.colorSpace=d:(Fo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=d===Ur?Pe:Fr),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.5,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==h0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Pd:e.x=e.x-Math.floor(e.x);break;case qn:e.x=e.x<0?0:1;break;case Dd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Pd:e.y=e.y-Math.floor(e.y);break;case qn:e.y=e.y<0?0:1;break;case Dd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Fo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Pe?Ur:m0}set encoding(e){Fo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===Ur?Pe:Fr}}xn.DEFAULT_IMAGE=null;xn.DEFAULT_MAPPING=h0;xn.DEFAULT_ANISOTROPY=1;class Nt{constructor(e=0,t=0,i=0,r=1){Nt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],d=l[4],h=l[8],u=l[1],p=l[5],v=l[9],_=l[2],g=l[6],f=l[10];if(Math.abs(d-u)<.01&&Math.abs(h-_)<.01&&Math.abs(v-g)<.01){if(Math.abs(d+u)<.1&&Math.abs(h+_)<.1&&Math.abs(v+g)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,x=(p+1)/2,M=(f+1)/2,w=(d+u)/4,R=(h+_)/4,D=(v+g)/4;return y>x&&y>M?y<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(y),r=w/i,s=R/i):x>M?x<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(x),i=w/r,s=D/r):M<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(M),i=R/s,r=D/s),this.set(i,r,s,t),this}let m=Math.sqrt((g-v)*(g-v)+(h-_)*(h-_)+(u-d)*(u-d));return Math.abs(m)<.001&&(m=1),this.x=(g-v)/m,this.y=(h-_)/m,this.z=(u-d)/m,this.w=Math.acos((c+p+f-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this.w=this.w<0?Math.ceil(this.w):Math.floor(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Vr extends Qs{constructor(e=1,t=1,i={}){super(),this.isWebGLRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Nt(0,0,e,t),this.scissorTest=!1,this.viewport=new Nt(0,0,e,t);const r={width:e,height:t,depth:1};i.encoding!==void 0&&(Fo("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===Ur?Pe:Fr),this.texture=new xn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps!==void 0?i.generateMipmaps:!1,this.texture.internalFormat=i.internalFormat!==void 0?i.internalFormat:null,this.texture.minFilter=i.minFilter!==void 0?i.minFilter:bn,this.depthBuffer=i.depthBuffer!==void 0?i.depthBuffer:!0,this.stencilBuffer=i.stencilBuffer!==void 0?i.stencilBuffer:!1,this.depthTexture=i.depthTexture!==void 0?i.depthTexture:null,this.samples=i.samples!==void 0?i.samples:0}setSize(e,t,i=1){(this.width!==e||this.height!==t||this.depth!==i)&&(this.width=e,this.height=t,this.depth=i,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new y0(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class x0 extends xn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Yt,this.minFilter=Yt,this.wrapR=qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class KE extends xn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Yt,this.minFilter=Yt,this.wrapR=qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ua{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],d=i[r+2],h=i[r+3];const u=s[o+0],p=s[o+1],v=s[o+2],_=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h;return}if(a===1){e[t+0]=u,e[t+1]=p,e[t+2]=v,e[t+3]=_;return}if(h!==_||l!==u||c!==p||d!==v){let g=1-a;const f=l*u+c*p+d*v+h*_,m=f>=0?1:-1,y=1-f*f;if(y>Number.EPSILON){const M=Math.sqrt(y),w=Math.atan2(M,f*m);g=Math.sin(g*w)/M,a=Math.sin(a*w)/M}const x=a*m;if(l=l*g+u*x,c=c*g+p*x,d=d*g+v*x,h=h*g+_*x,g===1-a){const M=1/Math.sqrt(l*l+c*c+d*d+h*h);l*=M,c*=M,d*=M,h*=M}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],d=i[r+3],h=s[o],u=s[o+1],p=s[o+2],v=s[o+3];return e[t]=a*v+d*h+l*p-c*u,e[t+1]=l*v+d*u+c*h-a*p,e[t+2]=c*v+d*p+a*u-l*h,e[t+3]=d*v-a*h-l*u-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),d=a(r/2),h=a(s/2),u=l(i/2),p=l(r/2),v=l(s/2);switch(o){case"XYZ":this._x=u*d*h+c*p*v,this._y=c*p*h-u*d*v,this._z=c*d*v+u*p*h,this._w=c*d*h-u*p*v;break;case"YXZ":this._x=u*d*h+c*p*v,this._y=c*p*h-u*d*v,this._z=c*d*v-u*p*h,this._w=c*d*h+u*p*v;break;case"ZXY":this._x=u*d*h-c*p*v,this._y=c*p*h+u*d*v,this._z=c*d*v+u*p*h,this._w=c*d*h-u*p*v;break;case"ZYX":this._x=u*d*h-c*p*v,this._y=c*p*h+u*d*v,this._z=c*d*v-u*p*h,this._w=c*d*h+u*p*v;break;case"YZX":this._x=u*d*h+c*p*v,this._y=c*p*h+u*d*v,this._z=c*d*v-u*p*h,this._w=c*d*h-u*p*v;break;case"XZY":this._x=u*d*h-c*p*v,this._y=c*p*h-u*d*v,this._z=c*d*v+u*p*h,this._w=c*d*h+u*p*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],d=t[6],h=t[10],u=i+a+h;if(u>0){const p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(d-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>h){const p=2*Math.sqrt(1+i-a-h);this._w=(d-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>h){const p=2*Math.sqrt(1+a-i-h);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+d)/p}else{const p=2*Math.sqrt(1+h-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(tn(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+o*a+r*c-s*l,this._y=r*d+o*l+s*a-i*c,this._z=s*d+o*c+i*l-r*a,this._w=o*d-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*i+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this._onChangeCallback(),this}const c=Math.sqrt(l),d=Math.atan2(c,a),h=Math.sin((1-t)*d)/c,u=Math.sin(t*d)/c;return this._w=o*h+this._w*u,this._x=i*h+this._x*u,this._y=r*h+this._y*u,this._z=s*h+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=Math.random(),t=Math.sqrt(1-e),i=Math.sqrt(e),r=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(t*Math.cos(r),i*Math.sin(s),i*Math.cos(s),t*Math.sin(r))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class k{constructor(e=0,t=0,i=0){k.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion($p.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion($p.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=l*t+o*r-a*i,d=l*i+a*t-s*r,h=l*r+s*i-o*t,u=-s*t-o*i-a*r;return this.x=c*l+u*-s+d*-a-h*-o,this.y=d*l+u*-o+h*-s-c*-a,this.z=h*l+u*-a+c*-o-d*-s,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return du.copy(this).projectOnVector(e),this.sub(du)}reflect(e){return this.sub(du.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(tn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,i=Math.sqrt(1-e**2);return this.x=i*Math.cos(t),this.y=i*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const du=new k,$p=new ua;class da{constructor(e=new k(1/0,1/0,1/0),t=new k(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(yi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(yi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=yi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){if(e.updateWorldMatrix(!1,!1),e.boundingBox!==void 0)e.boundingBox===null&&e.computeBoundingBox(),Jr.copy(e.boundingBox),Jr.applyMatrix4(e.matrixWorld),this.union(Jr);else{const r=e.geometry;if(r!==void 0)if(t&&r.attributes!==void 0&&r.attributes.position!==void 0){const s=r.attributes.position;for(let o=0,a=s.count;o<a;o++)yi.fromBufferAttribute(s,o).applyMatrix4(e.matrixWorld),this.expandByPoint(yi)}else r.boundingBox===null&&r.computeBoundingBox(),Jr.copy(r.boundingBox),Jr.applyMatrix4(e.matrixWorld),this.union(Jr)}const i=e.children;for(let r=0,s=i.length;r<s;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,yi),yi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(po),za.subVectors(this.max,po),es.subVectors(e.a,po),ts.subVectors(e.b,po),ns.subVectors(e.c,po),ki.subVectors(ts,es),Hi.subVectors(ns,ts),vr.subVectors(es,ns);let t=[0,-ki.z,ki.y,0,-Hi.z,Hi.y,0,-vr.z,vr.y,ki.z,0,-ki.x,Hi.z,0,-Hi.x,vr.z,0,-vr.x,-ki.y,ki.x,0,-Hi.y,Hi.x,0,-vr.y,vr.x,0];return!fu(t,es,ts,ns,za)||(t=[1,0,0,0,1,0,0,0,1],!fu(t,es,ts,ns,za))?!1:(Oa.crossVectors(ki,Hi),t=[Oa.x,Oa.y,Oa.z],fu(t,es,ts,ns,za))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,yi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(yi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(_i[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),_i[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),_i[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),_i[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),_i[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),_i[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),_i[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),_i[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(_i),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const _i=[new k,new k,new k,new k,new k,new k,new k,new k],yi=new k,Jr=new da,es=new k,ts=new k,ns=new k,ki=new k,Hi=new k,vr=new k,po=new k,za=new k,Oa=new k,_r=new k;function fu(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){_r.fromArray(n,s);const a=r.x*Math.abs(_r.x)+r.y*Math.abs(_r.y)+r.z*Math.abs(_r.z),l=e.dot(_r),c=t.dot(_r),d=i.dot(_r);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>a)return!1}return!0}const ZE=new da,mo=new k,hu=new k;class mc{constructor(e=new k,t=-1){this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):ZE.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;mo.subVectors(e,this.center);const t=mo.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(mo,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(hu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(mo.copy(e.center).add(hu)),this.expandByPoint(mo.copy(e.center).sub(hu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const xi=new k,pu=new k,Ba=new k,Gi=new k,mu=new k,ka=new k,gu=new k;class S0{constructor(e=new k,t=new k(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,xi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=xi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(xi.copy(this.origin).addScaledVector(this.direction,t),xi.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){pu.copy(e).add(t).multiplyScalar(.5),Ba.copy(t).sub(e).normalize(),Gi.copy(this.origin).sub(pu);const s=e.distanceTo(t)*.5,o=-this.direction.dot(Ba),a=Gi.dot(this.direction),l=-Gi.dot(Ba),c=Gi.lengthSq(),d=Math.abs(1-o*o);let h,u,p,v;if(d>0)if(h=o*l-a,u=o*a-l,v=s*d,h>=0)if(u>=-v)if(u<=v){const _=1/d;h*=_,u*=_,p=h*(h+o*u+2*a)+u*(o*h+u+2*l)+c}else u=s,h=Math.max(0,-(o*u+a)),p=-h*h+u*(u+2*l)+c;else u=-s,h=Math.max(0,-(o*u+a)),p=-h*h+u*(u+2*l)+c;else u<=-v?(h=Math.max(0,-(-o*s+a)),u=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+u*(u+2*l)+c):u<=v?(h=0,u=Math.min(Math.max(-s,-l),s),p=u*(u+2*l)+c):(h=Math.max(0,-(o*s+a)),u=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+u*(u+2*l)+c);else u=o>0?-s:s,h=Math.max(0,-(o*u+a)),p=-h*h+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(pu).addScaledVector(Ba,u),p}intersectSphere(e,t){xi.subVectors(e.center,this.origin);const i=xi.dot(this.direction),r=xi.dot(xi)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,u=this.origin;return c>=0?(i=(e.min.x-u.x)*c,r=(e.max.x-u.x)*c):(i=(e.max.x-u.x)*c,r=(e.min.x-u.x)*c),d>=0?(s=(e.min.y-u.y)*d,o=(e.max.y-u.y)*d):(s=(e.max.y-u.y)*d,o=(e.min.y-u.y)*d),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-u.z)*h,l=(e.max.z-u.z)*h):(a=(e.max.z-u.z)*h,l=(e.min.z-u.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,xi)!==null}intersectTriangle(e,t,i,r,s){mu.subVectors(t,e),ka.subVectors(i,e),gu.crossVectors(mu,ka);let o=this.direction.dot(gu),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Gi.subVectors(this.origin,e);const l=a*this.direction.dot(ka.crossVectors(Gi,ka));if(l<0)return null;const c=a*this.direction.dot(mu.cross(Gi));if(c<0||l+c>o)return null;const d=-a*Gi.dot(gu);return d<0?null:this.at(d/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Dt{constructor(){Dt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}set(e,t,i,r,s,o,a,l,c,d,h,u,p,v,_,g){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=r,f[1]=s,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=d,f[10]=h,f[14]=u,f[3]=p,f[7]=v,f[11]=_,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Dt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/is.setFromMatrixColumn(e,0).length(),s=1/is.setFromMatrixColumn(e,1).length(),o=1/is.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),d=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const u=o*d,p=o*h,v=a*d,_=a*h;t[0]=l*d,t[4]=-l*h,t[8]=c,t[1]=p+v*c,t[5]=u-_*c,t[9]=-a*l,t[2]=_-u*c,t[6]=v+p*c,t[10]=o*l}else if(e.order==="YXZ"){const u=l*d,p=l*h,v=c*d,_=c*h;t[0]=u+_*a,t[4]=v*a-p,t[8]=o*c,t[1]=o*h,t[5]=o*d,t[9]=-a,t[2]=p*a-v,t[6]=_+u*a,t[10]=o*l}else if(e.order==="ZXY"){const u=l*d,p=l*h,v=c*d,_=c*h;t[0]=u-_*a,t[4]=-o*h,t[8]=v+p*a,t[1]=p+v*a,t[5]=o*d,t[9]=_-u*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const u=o*d,p=o*h,v=a*d,_=a*h;t[0]=l*d,t[4]=v*c-p,t[8]=u*c+_,t[1]=l*h,t[5]=_*c+u,t[9]=p*c-v,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const u=o*l,p=o*c,v=a*l,_=a*c;t[0]=l*d,t[4]=_-u*h,t[8]=v*h+p,t[1]=h,t[5]=o*d,t[9]=-a*d,t[2]=-c*d,t[6]=p*h+v,t[10]=u-_*h}else if(e.order==="XZY"){const u=o*l,p=o*c,v=a*l,_=a*c;t[0]=l*d,t[4]=-h,t[8]=c*d,t[1]=u*h+_,t[5]=o*d,t[9]=p*h-v,t[2]=v*h-p,t[6]=a*d,t[10]=_*h+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(QE,e,JE)}lookAt(e,t,i){const r=this.elements;return fn.subVectors(e,t),fn.lengthSq()===0&&(fn.z=1),fn.normalize(),Vi.crossVectors(i,fn),Vi.lengthSq()===0&&(Math.abs(i.z)===1?fn.x+=1e-4:fn.z+=1e-4,fn.normalize(),Vi.crossVectors(i,fn)),Vi.normalize(),Ha.crossVectors(fn,Vi),r[0]=Vi.x,r[4]=Ha.x,r[8]=fn.x,r[1]=Vi.y,r[5]=Ha.y,r[9]=fn.y,r[2]=Vi.z,r[6]=Ha.z,r[10]=fn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],d=i[1],h=i[5],u=i[9],p=i[13],v=i[2],_=i[6],g=i[10],f=i[14],m=i[3],y=i[7],x=i[11],M=i[15],w=r[0],R=r[4],D=r[8],E=r[12],T=r[1],V=r[5],O=r[9],C=r[13],P=r[2],N=r[6],U=r[10],X=r[14],I=r[3],B=r[7],W=r[11],ee=r[15];return s[0]=o*w+a*T+l*P+c*I,s[4]=o*R+a*V+l*N+c*B,s[8]=o*D+a*O+l*U+c*W,s[12]=o*E+a*C+l*X+c*ee,s[1]=d*w+h*T+u*P+p*I,s[5]=d*R+h*V+u*N+p*B,s[9]=d*D+h*O+u*U+p*W,s[13]=d*E+h*C+u*X+p*ee,s[2]=v*w+_*T+g*P+f*I,s[6]=v*R+_*V+g*N+f*B,s[10]=v*D+_*O+g*U+f*W,s[14]=v*E+_*C+g*X+f*ee,s[3]=m*w+y*T+x*P+M*I,s[7]=m*R+y*V+x*N+M*B,s[11]=m*D+y*O+x*U+M*W,s[15]=m*E+y*C+x*X+M*ee,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],d=e[2],h=e[6],u=e[10],p=e[14],v=e[3],_=e[7],g=e[11],f=e[15];return v*(+s*l*h-r*c*h-s*a*u+i*c*u+r*a*p-i*l*p)+_*(+t*l*p-t*c*u+s*o*u-r*o*p+r*c*d-s*l*d)+g*(+t*c*h-t*a*p-s*o*h+i*o*p+s*a*d-i*c*d)+f*(-r*a*d-t*l*h+t*a*u+r*o*h-i*o*u+i*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],d=e[8],h=e[9],u=e[10],p=e[11],v=e[12],_=e[13],g=e[14],f=e[15],m=h*g*c-_*u*c+_*l*p-a*g*p-h*l*f+a*u*f,y=v*u*c-d*g*c-v*l*p+o*g*p+d*l*f-o*u*f,x=d*_*c-v*h*c+v*a*p-o*_*p-d*a*f+o*h*f,M=v*h*l-d*_*l-v*a*u+o*_*u+d*a*g-o*h*g,w=t*m+i*y+r*x+s*M;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/w;return e[0]=m*R,e[1]=(_*u*s-h*g*s-_*r*p+i*g*p+h*r*f-i*u*f)*R,e[2]=(a*g*s-_*l*s+_*r*c-i*g*c-a*r*f+i*l*f)*R,e[3]=(h*l*s-a*u*s-h*r*c+i*u*c+a*r*p-i*l*p)*R,e[4]=y*R,e[5]=(d*g*s-v*u*s+v*r*p-t*g*p-d*r*f+t*u*f)*R,e[6]=(v*l*s-o*g*s-v*r*c+t*g*c+o*r*f-t*l*f)*R,e[7]=(o*u*s-d*l*s+d*r*c-t*u*c-o*r*p+t*l*p)*R,e[8]=x*R,e[9]=(v*h*s-d*_*s-v*i*p+t*_*p+d*i*f-t*h*f)*R,e[10]=(o*_*s-v*a*s+v*i*c-t*_*c-o*i*f+t*a*f)*R,e[11]=(d*a*s-o*h*s-d*i*c+t*h*c+o*i*p-t*a*p)*R,e[12]=M*R,e[13]=(d*_*r-v*h*r+v*i*u-t*_*u-d*i*g+t*h*g)*R,e[14]=(v*a*r-o*_*r-v*i*l+t*_*l+o*i*g-t*a*g)*R,e[15]=(o*h*r-d*a*r+d*i*l-t*h*l-o*i*u+t*a*u)*R,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,d=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,d*a+i,d*l-r*o,0,c*l-r*a,d*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,d=o+o,h=a+a,u=s*c,p=s*d,v=s*h,_=o*d,g=o*h,f=a*h,m=l*c,y=l*d,x=l*h,M=i.x,w=i.y,R=i.z;return r[0]=(1-(_+f))*M,r[1]=(p+x)*M,r[2]=(v-y)*M,r[3]=0,r[4]=(p-x)*w,r[5]=(1-(u+f))*w,r[6]=(g+m)*w,r[7]=0,r[8]=(v+y)*R,r[9]=(g-m)*R,r[10]=(1-(u+_))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=is.set(r[0],r[1],r[2]).length();const o=is.set(r[4],r[5],r[6]).length(),a=is.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Bn.copy(this);const c=1/s,d=1/o,h=1/a;return Bn.elements[0]*=c,Bn.elements[1]*=c,Bn.elements[2]*=c,Bn.elements[4]*=d,Bn.elements[5]*=d,Bn.elements[6]*=d,Bn.elements[8]*=h,Bn.elements[9]*=h,Bn.elements[10]*=h,t.setFromRotationMatrix(Bn),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o){const a=this.elements,l=2*s/(t-e),c=2*s/(i-r),d=(t+e)/(t-e),h=(i+r)/(i-r),u=-(o+s)/(o-s),p=-2*o*s/(o-s);return a[0]=l,a[4]=0,a[8]=d,a[12]=0,a[1]=0,a[5]=c,a[9]=h,a[13]=0,a[2]=0,a[6]=0,a[10]=u,a[14]=p,a[3]=0,a[7]=0,a[11]=-1,a[15]=0,this}makeOrthographic(e,t,i,r,s,o){const a=this.elements,l=1/(t-e),c=1/(i-r),d=1/(o-s),h=(t+e)*l,u=(i+r)*c,p=(o+s)*d;return a[0]=2*l,a[4]=0,a[8]=0,a[12]=-h,a[1]=0,a[5]=2*c,a[9]=0,a[13]=-u,a[2]=0,a[6]=0,a[10]=-2*d,a[14]=-p,a[3]=0,a[7]=0,a[11]=0,a[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const is=new k,Bn=new Dt,QE=new k(0,0,0),JE=new k(1,1,1),Vi=new k,Ha=new k,fn=new k,Kp=new Dt,Zp=new ua;class gc{constructor(e=0,t=0,i=0,r=gc.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],d=r[9],h=r[2],u=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(tn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-tn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(tn(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-tn(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(tn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-tn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-d,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Kp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Kp,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Zp.setFromEuler(this),this.setFromQuaternion(Zp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}gc.DEFAULT_ORDER="XYZ";class M0{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ew=0;const Qp=new k,rs=new ua,Si=new Dt,Ga=new k,go=new k,tw=new k,nw=new ua,Jp=new k(1,0,0),em=new k(0,1,0),tm=new k(0,0,1),iw={type:"added"},nm={type:"removed"};class cn extends Qs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ew++}),this.uuid=ca(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=cn.DEFAULT_UP.clone();const e=new k,t=new gc,i=new ua,r=new k(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Dt},normalMatrix:{value:new Be}}),this.matrix=new Dt,this.matrixWorld=new Dt,this.matrixAutoUpdate=cn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.matrixWorldAutoUpdate=cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.layers=new M0,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return rs.setFromAxisAngle(e,t),this.quaternion.multiply(rs),this}rotateOnWorldAxis(e,t){return rs.setFromAxisAngle(e,t),this.quaternion.premultiply(rs),this}rotateX(e){return this.rotateOnAxis(Jp,e)}rotateY(e){return this.rotateOnAxis(em,e)}rotateZ(e){return this.rotateOnAxis(tm,e)}translateOnAxis(e,t){return Qp.copy(e).applyQuaternion(this.quaternion),this.position.add(Qp.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Jp,e)}translateY(e){return this.translateOnAxis(em,e)}translateZ(e){return this.translateOnAxis(tm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Si.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ga.copy(e):Ga.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),go.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Si.lookAt(go,Ga,this.up):Si.lookAt(Ga,go,this.up),this.quaternion.setFromRotationMatrix(Si),r&&(Si.extractRotation(r.matrixWorld),rs.setFromRotationMatrix(Si),this.quaternion.premultiply(rs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(iw)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(nm)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){for(let e=0;e<this.children.length;e++){const t=this.children[e];t.parent=null,t.dispatchEvent(nm)}return this.children.length=0,this}attach(e){return this.updateWorldMatrix(!0,!1),Si.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Si.multiply(e.parent.matrixWorld)),e.applyMatrix4(Si),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t){let i=[];this[e]===t&&i.push(this);for(let r=0,s=this.children.length;r<s;r++){const o=this.children[r].getObjectsByProperty(e,t);o.length>0&&(i=i.concat(o))}return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(go,e,tw),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(go,nw,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++){const s=t[i];(s.matrixWorldAutoUpdate===!0||e===!0)&&s.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++){const a=r[s];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.5,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),d=o(e.images),h=o(e.shapes),u=o(e.skeletons),p=o(e.animations),v=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),h.length>0&&(i.shapes=h),u.length>0&&(i.skeletons=u),p.length>0&&(i.animations=p),v.length>0&&(i.nodes=v)}return i.object=r,i;function o(a){const l=[];for(const c in a){const d=a[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations,this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}cn.DEFAULT_UP=new k(0,1,0);cn.DEFAULT_MATRIX_AUTO_UPDATE=!0;cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const kn=new k,Mi=new k,vu=new k,Ei=new k,ss=new k,os=new k,im=new k,_u=new k,yu=new k,xu=new k;let Va=!1;class Ln{constructor(e=new k,t=new k,i=new k){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),kn.subVectors(e,t),r.cross(kn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){kn.subVectors(r,t),Mi.subVectors(i,t),vu.subVectors(e,t);const o=kn.dot(kn),a=kn.dot(Mi),l=kn.dot(vu),c=Mi.dot(Mi),d=Mi.dot(vu),h=o*c-a*a;if(h===0)return s.set(-2,-1,-1);const u=1/h,p=(c*l-a*d)*u,v=(o*d-a*l)*u;return s.set(1-p-v,v,p)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Ei),Ei.x>=0&&Ei.y>=0&&Ei.x+Ei.y<=1}static getUV(e,t,i,r,s,o,a,l){return Va===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Va=!0),this.getInterpolation(e,t,i,r,s,o,a,l)}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,Ei),l.setScalar(0),l.addScaledVector(s,Ei.x),l.addScaledVector(o,Ei.y),l.addScaledVector(a,Ei.z),l}static isFrontFacing(e,t,i,r){return kn.subVectors(i,t),Mi.subVectors(e,t),kn.cross(Mi).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return kn.subVectors(this.c,this.b),Mi.subVectors(this.a,this.b),kn.cross(Mi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ln.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Ln.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,i,r,s){return Va===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Va=!0),Ln.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}getInterpolation(e,t,i,r,s){return Ln.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return Ln.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ln.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;ss.subVectors(r,i),os.subVectors(s,i),_u.subVectors(e,i);const l=ss.dot(_u),c=os.dot(_u);if(l<=0&&c<=0)return t.copy(i);yu.subVectors(e,r);const d=ss.dot(yu),h=os.dot(yu);if(d>=0&&h<=d)return t.copy(r);const u=l*h-d*c;if(u<=0&&l>=0&&d<=0)return o=l/(l-d),t.copy(i).addScaledVector(ss,o);xu.subVectors(e,s);const p=ss.dot(xu),v=os.dot(xu);if(v>=0&&p<=v)return t.copy(s);const _=p*c-l*v;if(_<=0&&c>=0&&v<=0)return a=c/(c-v),t.copy(i).addScaledVector(os,a);const g=d*v-p*h;if(g<=0&&h-d>=0&&p-v>=0)return im.subVectors(s,r),a=(h-d)/(h-d+(p-v)),t.copy(r).addScaledVector(im,a);const f=1/(g+_+u);return o=_*f,a=u*f,t.copy(i).addScaledVector(ss,o).addScaledVector(os,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}let rw=0;class fa extends Qs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:rw++}),this.uuid=ca(),this.name="",this.type="Material",this.blending=Us,this.side=cr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.blendSrc=u0,this.blendDst=d0,this.blendEquation=ms,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=Cd,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=kE,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ou,this.stencilZFail=ou,this.stencilZPass=ou,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.5,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Us&&(i.blending=this.blending),this.side!==cr&&(i.side=this.side),this.vertexColors&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=this.transparent),i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.stencilWrite=this.stencilWrite,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaToCoverage===!0&&(i.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=this.premultipliedAlpha),this.forceSinglePass===!0&&(i.forceSinglePass=this.forceSinglePass),this.wireframe===!0&&(i.wireframe=this.wireframe),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=this.flatShading),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const E0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hn={h:0,s:0,l:0},Wa={h:0,s:0,l:0};function Su(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Qe{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,t===void 0&&i===void 0?this.set(e):this.setRGB(e,t,i)}set(e){return e&&e.isColor?this.copy(e):typeof e=="number"?this.setHex(e):typeof e=="string"&&this.setStyle(e),this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Pe){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,On.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=On.workingColorSpace){return this.r=e,this.g=t,this.b=i,On.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=On.workingColorSpace){if(e=HE(e,1),t=tn(t,0,1),i=tn(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=Su(o,s,e+1/3),this.g=Su(o,s,e),this.b=Su(o,s,e-1/3)}return On.toWorkingColorSpace(this,r),this}setStyle(e,t=Pe){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Pe){const i=E0[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zs(e.r),this.g=zs(e.g),this.b=zs(e.b),this}copyLinearToSRGB(e){return this.r=cu(e.r),this.g=cu(e.g),this.b=cu(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Pe){return On.fromWorkingColorSpace(Ht.copy(this),e),Math.round(tn(Ht.r*255,0,255))*65536+Math.round(tn(Ht.g*255,0,255))*256+Math.round(tn(Ht.b*255,0,255))}getHexString(e=Pe){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=On.workingColorSpace){On.fromWorkingColorSpace(Ht.copy(this),t);const i=Ht.r,r=Ht.g,s=Ht.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const d=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=d<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=On.workingColorSpace){return On.fromWorkingColorSpace(Ht.copy(this),t),e.r=Ht.r,e.g=Ht.g,e.b=Ht.b,e}getStyle(e=Pe){On.fromWorkingColorSpace(Ht.copy(this),e);const t=Ht.r,i=Ht.g,r=Ht.b;return e!==Pe?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Hn),Hn.h+=e,Hn.s+=t,Hn.l+=i,this.setHSL(Hn.h,Hn.s,Hn.l),this}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Hn),e.getHSL(Wa);const i=au(Hn.h,Wa.h,t),r=au(Hn.s,Wa.s,t),s=au(Hn.l,Wa.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ht=new Qe;Qe.NAMES=E0;class Uf extends fa{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=f0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const St=new k,Xa=new it;class Zn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Xp,this.updateRange={offset:0,count:-1},this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Xa.fromBufferAttribute(this,t),Xa.applyMatrix3(e),this.setXY(t,Xa.x,Xa.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.applyMatrix3(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.applyMatrix4(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.applyNormalMatrix(e),this.setXYZ(t,St.x,St.y,St.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.transformDirection(e),this.setXYZ(t,St.x,St.y,St.z);return this}set(e,t=0){return this.array.set(e,t),this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Fa(t,this.array)),t}setX(e,t){return this.normalized&&(t=dn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Fa(t,this.array)),t}setY(e,t){return this.normalized&&(t=dn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Fa(t,this.array)),t}setZ(e,t){return this.normalized&&(t=dn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Fa(t,this.array)),t}setW(e,t){return this.normalized&&(t=dn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=dn(t,this.array),i=dn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=dn(t,this.array),i=dn(i,this.array),r=dn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=dn(t,this.array),i=dn(i,this.array),r=dn(r,this.array),s=dn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Xp&&(e.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(e.updateRange=this.updateRange),e}copyColorsArray(){console.error("THREE.BufferAttribute: copyColorsArray() was removed in r144.")}copyVector2sArray(){console.error("THREE.BufferAttribute: copyVector2sArray() was removed in r144.")}copyVector3sArray(){console.error("THREE.BufferAttribute: copyVector3sArray() was removed in r144.")}copyVector4sArray(){console.error("THREE.BufferAttribute: copyVector4sArray() was removed in r144.")}}class w0 extends Zn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class T0 extends Zn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class rn extends Zn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let sw=0;const An=new Dt,Mu=new cn,as=new k,hn=new da,vo=new da,bt=new k;class _n extends Qs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:sw++}),this.uuid=ca(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(v0(e)?T0:w0)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Be().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return An.makeRotationFromQuaternion(e),this.applyMatrix4(An),this}rotateX(e){return An.makeRotationX(e),this.applyMatrix4(An),this}rotateY(e){return An.makeRotationY(e),this.applyMatrix4(An),this}rotateZ(e){return An.makeRotationZ(e),this.applyMatrix4(An),this}translate(e,t,i){return An.makeTranslation(e,t,i),this.applyMatrix4(An),this}scale(e,t,i){return An.makeScale(e,t,i),this.applyMatrix4(An),this}lookAt(e){return Mu.lookAt(e),Mu.updateMatrix(),this.applyMatrix4(Mu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(as).negate(),this.translate(as.x,as.y,as.z),this}setFromPoints(e){const t=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new rn(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new da);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new k(-1/0,-1/0,-1/0),new k(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];hn.setFromBufferAttribute(s),this.morphTargetsRelative?(bt.addVectors(this.boundingBox.min,hn.min),this.boundingBox.expandByPoint(bt),bt.addVectors(this.boundingBox.max,hn.max),this.boundingBox.expandByPoint(bt)):(this.boundingBox.expandByPoint(hn.min),this.boundingBox.expandByPoint(hn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mc);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new k,1/0);return}if(e){const i=this.boundingSphere.center;if(hn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];vo.setFromBufferAttribute(a),this.morphTargetsRelative?(bt.addVectors(hn.min,vo.min),hn.expandByPoint(bt),bt.addVectors(hn.max,vo.max),hn.expandByPoint(bt)):(hn.expandByPoint(vo.min),hn.expandByPoint(vo.max))}hn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)bt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(bt));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,d=a.count;c<d;c++)bt.fromBufferAttribute(a,c),l&&(as.fromBufferAttribute(e,c),bt.add(as)),r=Math.max(r,i.distanceToSquared(bt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.array,r=t.position.array,s=t.normal.array,o=t.uv.array,a=r.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Zn(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],d=[];for(let T=0;T<a;T++)c[T]=new k,d[T]=new k;const h=new k,u=new k,p=new k,v=new it,_=new it,g=new it,f=new k,m=new k;function y(T,V,O){h.fromArray(r,T*3),u.fromArray(r,V*3),p.fromArray(r,O*3),v.fromArray(o,T*2),_.fromArray(o,V*2),g.fromArray(o,O*2),u.sub(h),p.sub(h),_.sub(v),g.sub(v);const C=1/(_.x*g.y-g.x*_.y);isFinite(C)&&(f.copy(u).multiplyScalar(g.y).addScaledVector(p,-_.y).multiplyScalar(C),m.copy(p).multiplyScalar(_.x).addScaledVector(u,-g.x).multiplyScalar(C),c[T].add(f),c[V].add(f),c[O].add(f),d[T].add(m),d[V].add(m),d[O].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:i.length}]);for(let T=0,V=x.length;T<V;++T){const O=x[T],C=O.start,P=O.count;for(let N=C,U=C+P;N<U;N+=3)y(i[N+0],i[N+1],i[N+2])}const M=new k,w=new k,R=new k,D=new k;function E(T){R.fromArray(s,T*3),D.copy(R);const V=c[T];M.copy(V),M.sub(R.multiplyScalar(R.dot(V))).normalize(),w.crossVectors(D,V);const C=w.dot(d[T])<0?-1:1;l[T*4]=M.x,l[T*4+1]=M.y,l[T*4+2]=M.z,l[T*4+3]=C}for(let T=0,V=x.length;T<V;++T){const O=x[T],C=O.start,P=O.count;for(let N=C,U=C+P;N<U;N+=3)E(i[N+0]),E(i[N+1]),E(i[N+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Zn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,p=i.count;u<p;u++)i.setXYZ(u,0,0,0);const r=new k,s=new k,o=new k,a=new k,l=new k,c=new k,d=new k,h=new k;if(e)for(let u=0,p=e.count;u<p;u+=3){const v=e.getX(u+0),_=e.getX(u+1),g=e.getX(u+2);r.fromBufferAttribute(t,v),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,g),d.subVectors(o,s),h.subVectors(r,s),d.cross(h),a.fromBufferAttribute(i,v),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),a.add(d),l.add(d),c.add(d),i.setXYZ(v,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,p=t.count;u<p;u+=3)r.fromBufferAttribute(t,u+0),s.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),d.subVectors(o,s),h.subVectors(r,s),d.cross(h),i.setXYZ(u+0,d.x,d.y,d.z),i.setXYZ(u+1,d.x,d.y,d.z),i.setXYZ(u+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}merge(){return console.error("THREE.BufferGeometry.merge() has been removed. Use THREE.BufferGeometryUtils.mergeGeometries() instead."),this}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)bt.fromBufferAttribute(e,t),bt.normalize(),e.setXYZ(t,bt.x,bt.y,bt.z)}toNonIndexed(){function e(a,l){const c=a.array,d=a.itemSize,h=a.normalized,u=new c.constructor(l.length*d);let p=0,v=0;for(let _=0,g=l.length;_<g;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*d;for(let f=0;f<d;f++)u[v++]=c[p++]}return new Zn(u,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new _n,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let d=0,h=c.length;d<h;d++){const u=c[d],p=e(u,i);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.5,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let h=0,u=c.length;h<u;h++){const p=c[h];d.push(p.toJSON(e.data))}d.length>0&&(r[l]=d,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const d=r[c];this.setAttribute(c,d.clone(t))}const s=e.morphAttributes;for(const c in s){const d=[],h=s[c];for(let u=0,p=h.length;u<p;u++)d.push(h[u].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,d=o.length;c<d;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const rm=new Dt,ri=new S0,qa=new mc,sm=new k,ls=new k,cs=new k,us=new k,Eu=new k,ja=new k,Ya=new it,$a=new it,Ka=new it,om=new k,am=new k,lm=new k,Za=new k,Qa=new k;class gn extends cn{constructor(e=new _n,t=new Uf){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){ja.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const d=a[l],h=s[l];d!==0&&(Eu.fromBufferAttribute(h,e),o?ja.addScaledVector(Eu,d):ja.addScaledVector(Eu.sub(t),d))}t.add(ja)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),qa.copy(i.boundingSphere),qa.applyMatrix4(s),ri.copy(e.ray).recast(e.near),!(qa.containsPoint(ri.origin)===!1&&(ri.intersectSphere(qa,sm)===null||ri.origin.distanceToSquared(sm)>(e.far-e.near)**2))&&(rm.copy(s).invert(),ri.copy(e.ray).applyMatrix4(rm),!(i.boundingBox!==null&&ri.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t)))}_computeIntersections(e,t){let i;const r=this.geometry,s=this.material,o=r.index,a=r.attributes.position,l=r.attributes.uv,c=r.attributes.uv1,d=r.attributes.normal,h=r.groups,u=r.drawRange;if(o!==null)if(Array.isArray(s))for(let p=0,v=h.length;p<v;p++){const _=h[p],g=s[_.materialIndex],f=Math.max(_.start,u.start),m=Math.min(o.count,Math.min(_.start+_.count,u.start+u.count));for(let y=f,x=m;y<x;y+=3){const M=o.getX(y),w=o.getX(y+1),R=o.getX(y+2);i=Ja(this,g,e,ri,l,c,d,M,w,R),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=_.materialIndex,t.push(i))}}else{const p=Math.max(0,u.start),v=Math.min(o.count,u.start+u.count);for(let _=p,g=v;_<g;_+=3){const f=o.getX(_),m=o.getX(_+1),y=o.getX(_+2);i=Ja(this,s,e,ri,l,c,d,f,m,y),i&&(i.faceIndex=Math.floor(_/3),t.push(i))}}else if(a!==void 0)if(Array.isArray(s))for(let p=0,v=h.length;p<v;p++){const _=h[p],g=s[_.materialIndex],f=Math.max(_.start,u.start),m=Math.min(a.count,Math.min(_.start+_.count,u.start+u.count));for(let y=f,x=m;y<x;y+=3){const M=y,w=y+1,R=y+2;i=Ja(this,g,e,ri,l,c,d,M,w,R),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=_.materialIndex,t.push(i))}}else{const p=Math.max(0,u.start),v=Math.min(a.count,u.start+u.count);for(let _=p,g=v;_<g;_+=3){const f=_,m=_+1,y=_+2;i=Ja(this,s,e,ri,l,c,d,f,m,y),i&&(i.faceIndex=Math.floor(_/3),t.push(i))}}}}function ow(n,e,t,i,r,s,o,a){let l;if(e.side===ln?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===cr,a),l===null)return null;Qa.copy(a),Qa.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Qa);return c<t.near||c>t.far?null:{distance:c,point:Qa.clone(),object:n}}function Ja(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,ls),n.getVertexPosition(l,cs),n.getVertexPosition(c,us);const d=ow(n,e,t,i,ls,cs,us,Za);if(d){r&&(Ya.fromBufferAttribute(r,a),$a.fromBufferAttribute(r,l),Ka.fromBufferAttribute(r,c),d.uv=Ln.getInterpolation(Za,ls,cs,us,Ya,$a,Ka,new it)),s&&(Ya.fromBufferAttribute(s,a),$a.fromBufferAttribute(s,l),Ka.fromBufferAttribute(s,c),d.uv1=Ln.getInterpolation(Za,ls,cs,us,Ya,$a,Ka,new it),d.uv2=d.uv1),o&&(om.fromBufferAttribute(o,a),am.fromBufferAttribute(o,l),lm.fromBufferAttribute(o,c),d.normal=Ln.getInterpolation(Za,ls,cs,us,om,am,lm,new k),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a,b:l,c,normal:new k,materialIndex:0};Ln.getNormal(ls,cs,us,h.normal),d.face=h}return d}class Wr extends _n{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],d=[],h=[];let u=0,p=0;v("z","y","x",-1,-1,i,t,e,o,s,0),v("z","y","x",1,-1,i,t,-e,o,s,1),v("x","z","y",1,1,e,i,t,r,o,2),v("x","z","y",1,-1,e,i,-t,r,o,3),v("x","y","z",1,-1,e,t,i,r,s,4),v("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new rn(c,3)),this.setAttribute("normal",new rn(d,3)),this.setAttribute("uv",new rn(h,2));function v(_,g,f,m,y,x,M,w,R,D,E){const T=x/R,V=M/D,O=x/2,C=M/2,P=w/2,N=R+1,U=D+1;let X=0,I=0;const B=new k;for(let W=0;W<U;W++){const ee=W*V-C;for(let q=0;q<N;q++){const H=q*T-O;B[_]=H*m,B[g]=ee*y,B[f]=P,c.push(B.x,B.y,B.z),B[_]=0,B[g]=0,B[f]=w>0?1:-1,d.push(B.x,B.y,B.z),h.push(q/R),h.push(1-W/D),X+=1}}for(let W=0;W<D;W++)for(let ee=0;ee<R;ee++){const q=u+ee+N*W,H=u+ee+N*(W+1),Y=u+(ee+1)+N*(W+1),re=u+(ee+1)+N*W;l.push(q,H,re),l.push(H,Y,re),I+=6}a.addGroup(p,I,E),p+=I,u+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ys(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function qt(n){const e={};for(let t=0;t<n.length;t++){const i=Ys(n[t]);for(const r in i)e[r]=i[r]}return e}function aw(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function A0(n){return n.getRenderTarget()===null?n.outputColorSpace:fi}const lw={clone:Ys,merge:qt};var cw=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,uw=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Xr extends fa{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=cw,this.fragmentShader=uw,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ys(e.uniforms),this.uniformsGroups=aw(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class R0 extends cn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Dt,this.projectionMatrix=new Dt,this.projectionMatrixInverse=new Dt}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(-t[8],-t[9],-t[10]).normalize()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Xn extends R0{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Nd*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Sl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Nd*2*Math.atan(Math.tan(Sl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Sl*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ds=-90,fs=1;class dw extends cn{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i;const r=new Xn(ds,fs,e,t);r.layers=this.layers,r.up.set(0,1,0),r.lookAt(1,0,0),this.add(r);const s=new Xn(ds,fs,e,t);s.layers=this.layers,s.up.set(0,1,0),s.lookAt(-1,0,0),this.add(s);const o=new Xn(ds,fs,e,t);o.layers=this.layers,o.up.set(0,0,-1),o.lookAt(0,1,0),this.add(o);const a=new Xn(ds,fs,e,t);a.layers=this.layers,a.up.set(0,0,1),a.lookAt(0,-1,0),this.add(a);const l=new Xn(ds,fs,e,t);l.layers=this.layers,l.up.set(0,1,0),l.lookAt(0,0,1),this.add(l);const c=new Xn(ds,fs,e,t);c.layers=this.layers,c.up.set(0,1,0),c.lookAt(0,0,-1),this.add(c)}update(e,t){this.parent===null&&this.updateMatrixWorld();const i=this.renderTarget,[r,s,o,a,l,c]=this.children,d=e.getRenderTarget(),h=e.toneMapping,u=e.xr.enabled;e.toneMapping=Pi,e.xr.enabled=!1;const p=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0),e.render(t,r),e.setRenderTarget(i,1),e.render(t,s),e.setRenderTarget(i,2),e.render(t,o),e.setRenderTarget(i,3),e.render(t,a),e.setRenderTarget(i,4),e.render(t,l),i.texture.generateMipmaps=p,e.setRenderTarget(i,5),e.render(t,c),e.setRenderTarget(d),e.toneMapping=h,e.xr.enabled=u,i.texture.needsPMREMUpdate=!0}}class C0 extends xn{constructor(e,t,i,r,s,o,a,l,c,d){e=e!==void 0?e:[],t=t!==void 0?t:Xs,super(e,t,i,r,s,o,a,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class fw extends Vr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];t.encoding!==void 0&&(Fo("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===Ur?Pe:Fr),this.texture=new C0(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:bn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Wr(5,5,5),s=new Xr({name:"CubemapFromEquirect",uniforms:Ys(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:ln,blending:or});s.uniforms.tEquirect.value=t;const o=new gn(r,s),a=t.minFilter;return t.minFilter===ea&&(t.minFilter=bn),new dw(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}const wu=new k,hw=new k,pw=new Be;class Er{constructor(e=new k(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=wu.subVectors(i,t).cross(hw.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(wu),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||pw.getNormalMatrix(e),r=this.coplanarPoint(wu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const yr=new mc,el=new k;class b0{constructor(e=new Er,t=new Er,i=new Er,r=new Er,s=new Er,o=new Er){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e){const t=this.planes,i=e.elements,r=i[0],s=i[1],o=i[2],a=i[3],l=i[4],c=i[5],d=i[6],h=i[7],u=i[8],p=i[9],v=i[10],_=i[11],g=i[12],f=i[13],m=i[14],y=i[15];return t[0].setComponents(a-r,h-l,_-u,y-g).normalize(),t[1].setComponents(a+r,h+l,_+u,y+g).normalize(),t[2].setComponents(a+s,h+c,_+p,y+f).normalize(),t[3].setComponents(a-s,h-c,_-p,y-f).normalize(),t[4].setComponents(a-o,h-d,_-v,y-m).normalize(),t[5].setComponents(a+o,h+d,_+v,y+m).normalize(),this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),yr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),yr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(yr)}intersectsSprite(e){return yr.center.set(0,0,0),yr.radius=.7071067811865476,yr.applyMatrix4(e.matrixWorld),this.intersectsSphere(yr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(el.x=r.normal.x>0?e.max.x:e.min.x,el.y=r.normal.y>0?e.max.y:e.min.y,el.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(el)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function L0(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function mw(n,e){const t=e.isWebGL2,i=new WeakMap;function r(c,d){const h=c.array,u=c.usage,p=n.createBuffer();n.bindBuffer(d,p),n.bufferData(d,h,u),c.onUploadCallback();let v;if(h instanceof Float32Array)v=n.FLOAT;else if(h instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)v=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)v=n.SHORT;else if(h instanceof Uint32Array)v=n.UNSIGNED_INT;else if(h instanceof Int32Array)v=n.INT;else if(h instanceof Int8Array)v=n.BYTE;else if(h instanceof Uint8Array)v=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)v=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:p,type:v,bytesPerElement:h.BYTES_PER_ELEMENT,version:c.version}}function s(c,d,h){const u=d.array,p=d.updateRange;n.bindBuffer(h,c),p.count===-1?n.bufferSubData(h,0,u):(t?n.bufferSubData(h,p.offset*u.BYTES_PER_ELEMENT,u,p.offset,p.count):n.bufferSubData(h,p.offset*u.BYTES_PER_ELEMENT,u.subarray(p.offset,p.offset+p.count)),p.count=-1),d.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const d=i.get(c);d&&(n.deleteBuffer(d.buffer),i.delete(c))}function l(c,d){if(c.isGLBufferAttribute){const u=i.get(c);(!u||u.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const h=i.get(c);h===void 0?i.set(c,r(c,d)):h.version<c.version&&(s(h.buffer,c,d),h.version=c.version)}return{get:o,remove:a,update:l}}class Ff extends _n{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,d=l+1,h=e/a,u=t/l,p=[],v=[],_=[],g=[];for(let f=0;f<d;f++){const m=f*u-o;for(let y=0;y<c;y++){const x=y*h-s;v.push(x,-m,0),_.push(0,0,1),g.push(y/a),g.push(1-f/l)}}for(let f=0;f<l;f++)for(let m=0;m<a;m++){const y=m+c*f,x=m+c*(f+1),M=m+1+c*(f+1),w=m+1+c*f;p.push(y,x,w),p.push(x,M,w)}this.setIndex(p),this.setAttribute("position",new rn(v,3)),this.setAttribute("normal",new rn(_,3)),this.setAttribute("uv",new rn(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ff(e.width,e.height,e.widthSegments,e.heightSegments)}}var gw=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vw=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_w=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,yw=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,xw=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Sw=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Mw="vec3 transformed = vec3( position );",Ew=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ww=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Tw=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			 return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float R21 = R12;
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Aw=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = dFdx( surf_pos.xyz );
		vec3 vSigmaY = dFdy( surf_pos.xyz );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Rw=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Cw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,bw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Lw=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Pw=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Dw=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Iw=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Nw=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Uw=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal;
#endif
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Fw=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_v0 0.339
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_v1 0.276
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_v4 0.046
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_v5 0.016
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_v6 0.0038
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,zw=`vec3 transformedNormal = objectNormal;
#ifdef USE_INSTANCING
	mat3 m = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
	transformedNormal = m * transformedNormal;
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Ow=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Bw=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,kw=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Hw=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gw="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vw=`vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ww=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Xw=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,qw=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,jw=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Yw=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,$w=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Kw=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zw=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Qw=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Jw=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,eT=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,tT=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,nT=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,iT=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in GeometricContext geometry, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in GeometricContext geometry, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,rT=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
uniform vec3 lightProbe[ 9 ];
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometry.position;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometry.position;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,sT=`#if defined( USE_ENVMAP )
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#if defined( ENVMAP_TYPE_CUBE_UV )
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#if defined( ENVMAP_TYPE_CUBE_UV )
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
#endif`,oT=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,aT=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lT=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,cT=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,uT=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif`,dT=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
};
vec3 clearcoatSpecular = vec3( 0.0 );
vec3 sheenSpecular = vec3( 0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometry.normal;
		vec3 viewDir = geometry.viewDir;
		vec3 position = geometry.position;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecular += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometry.viewDir, geometry.clearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecular += irradiance * BRDF_Sheen( directLight.direction, geometry.viewDir, geometry.normal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.normal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecular += clearcoatRadiance * EnvironmentBRDF( geometry.clearcoatNormal, geometry.viewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecular += irradiance * material.sheenColor * IBLSheenBRDF( geometry.normal, geometry.viewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,fT=`
GeometricContext geometry;
geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
#ifdef USE_CLEARCOAT
	geometry.clearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometry.viewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometry, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,hT=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometry.normal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	radiance += getIBLRadiance( geometry.viewDir, geometry.normal, material.roughness );
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometry.viewDir, geometry.clearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,pT=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
#endif`,mT=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,gT=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vT=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,_T=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,yT=`#ifdef USE_MAP
	diffuseColor *= texture2D( map, vMapUv );
#endif`,xT=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ST=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,MT=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ET=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,wT=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,TT=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,AT=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,RT=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,CT=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,bT=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#ifdef USE_NORMALMAP_TANGENTSPACE
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal, vNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 geometryNormal = normal;`,LT=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,PT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,DT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,IT=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,NT=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,UT=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif`,FT=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,zT=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,OT=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,BT=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha + 0.1;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,kT=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,HT=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,GT=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,VT=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,WT=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,XT=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,qT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,jT=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,YT=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,$T=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,KT=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ZT=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,QT=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	uniform int boneTextureSize;
	mat4 getBoneMatrix( const in float i ) {
		float j = i * 4.0;
		float x = mod( j, float( boneTextureSize ) );
		float y = floor( j / float( boneTextureSize ) );
		float dx = 1.0 / float( boneTextureSize );
		float dy = 1.0 / float( boneTextureSize );
		y = dy * ( y + 0.5 );
		vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
		vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
		vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
		vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
		mat4 bone = mat4( v1, v2, v3, v4 );
		return bone;
	}
#endif`,JT=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,e1=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,t1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,n1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,i1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,r1=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return toneMappingExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,s1=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmission = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmission.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmission.rgb, material.transmission );
#endif`,o1=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 applyVolumeAttenuation( const in vec3 radiance, const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return radiance;
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance * radiance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 attenuatedColor = applyVolumeAttenuation( transmittedLight.rgb, length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );
	}
#endif`,a1=`#ifdef USE_UV
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,l1=`#ifdef USE_UV
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,c1=`#ifdef USE_UV
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,u1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const d1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,f1=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,h1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,p1=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,m1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,g1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,v1=`#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,_1=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,y1=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,x1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,S1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,M1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,E1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,w1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,T1=`#include <common>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,A1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,R1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,C1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,b1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,L1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,P1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,D1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,I1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,N1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,U1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,F1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecular;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + clearcoatSpecular * material.clearcoat;
	#endif
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,z1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,O1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,B1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,k1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,H1=`#include <common>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,G1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,V1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,W1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,Ie={alphamap_fragment:gw,alphamap_pars_fragment:vw,alphatest_fragment:_w,alphatest_pars_fragment:yw,aomap_fragment:xw,aomap_pars_fragment:Sw,begin_vertex:Mw,beginnormal_vertex:Ew,bsdfs:ww,iridescence_fragment:Tw,bumpmap_pars_fragment:Aw,clipping_planes_fragment:Rw,clipping_planes_pars_fragment:Cw,clipping_planes_pars_vertex:bw,clipping_planes_vertex:Lw,color_fragment:Pw,color_pars_fragment:Dw,color_pars_vertex:Iw,color_vertex:Nw,common:Uw,cube_uv_reflection_fragment:Fw,defaultnormal_vertex:zw,displacementmap_pars_vertex:Ow,displacementmap_vertex:Bw,emissivemap_fragment:kw,emissivemap_pars_fragment:Hw,encodings_fragment:Gw,encodings_pars_fragment:Vw,envmap_fragment:Ww,envmap_common_pars_fragment:Xw,envmap_pars_fragment:qw,envmap_pars_vertex:jw,envmap_physical_pars_fragment:sT,envmap_vertex:Yw,fog_vertex:$w,fog_pars_vertex:Kw,fog_fragment:Zw,fog_pars_fragment:Qw,gradientmap_pars_fragment:Jw,lightmap_fragment:eT,lightmap_pars_fragment:tT,lights_lambert_fragment:nT,lights_lambert_pars_fragment:iT,lights_pars_begin:rT,lights_toon_fragment:oT,lights_toon_pars_fragment:aT,lights_phong_fragment:lT,lights_phong_pars_fragment:cT,lights_physical_fragment:uT,lights_physical_pars_fragment:dT,lights_fragment_begin:fT,lights_fragment_maps:hT,lights_fragment_end:pT,logdepthbuf_fragment:mT,logdepthbuf_pars_fragment:gT,logdepthbuf_pars_vertex:vT,logdepthbuf_vertex:_T,map_fragment:yT,map_pars_fragment:xT,map_particle_fragment:ST,map_particle_pars_fragment:MT,metalnessmap_fragment:ET,metalnessmap_pars_fragment:wT,morphcolor_vertex:TT,morphnormal_vertex:AT,morphtarget_pars_vertex:RT,morphtarget_vertex:CT,normal_fragment_begin:bT,normal_fragment_maps:LT,normal_pars_fragment:PT,normal_pars_vertex:DT,normal_vertex:IT,normalmap_pars_fragment:NT,clearcoat_normal_fragment_begin:UT,clearcoat_normal_fragment_maps:FT,clearcoat_pars_fragment:zT,iridescence_pars_fragment:OT,output_fragment:BT,packing:kT,premultiplied_alpha_fragment:HT,project_vertex:GT,dithering_fragment:VT,dithering_pars_fragment:WT,roughnessmap_fragment:XT,roughnessmap_pars_fragment:qT,shadowmap_pars_fragment:jT,shadowmap_pars_vertex:YT,shadowmap_vertex:$T,shadowmask_pars_fragment:KT,skinbase_vertex:ZT,skinning_pars_vertex:QT,skinning_vertex:JT,skinnormal_vertex:e1,specularmap_fragment:t1,specularmap_pars_fragment:n1,tonemapping_fragment:i1,tonemapping_pars_fragment:r1,transmission_fragment:s1,transmission_pars_fragment:o1,uv_pars_fragment:a1,uv_pars_vertex:l1,uv_vertex:c1,worldpos_vertex:u1,background_vert:d1,background_frag:f1,backgroundCube_vert:h1,backgroundCube_frag:p1,cube_vert:m1,cube_frag:g1,depth_vert:v1,depth_frag:_1,distanceRGBA_vert:y1,distanceRGBA_frag:x1,equirect_vert:S1,equirect_frag:M1,linedashed_vert:E1,linedashed_frag:w1,meshbasic_vert:T1,meshbasic_frag:A1,meshlambert_vert:R1,meshlambert_frag:C1,meshmatcap_vert:b1,meshmatcap_frag:L1,meshnormal_vert:P1,meshnormal_frag:D1,meshphong_vert:I1,meshphong_frag:N1,meshphysical_vert:U1,meshphysical_frag:F1,meshtoon_vert:z1,meshtoon_frag:O1,points_vert:B1,points_frag:k1,shadow_vert:H1,shadow_frag:G1,sprite_vert:V1,sprite_frag:W1},le={common:{diffuse:{value:new Qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Be}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Be}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Be}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Be},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Be},normalScale:{value:new it(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Be},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Be}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Be}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Be}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new Be}},sprite:{diffuse:{value:new Qe(16777215)},opacity:{value:1},center:{value:new it(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaTest:{value:0}}},ai={basic:{uniforms:qt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:Ie.meshbasic_vert,fragmentShader:Ie.meshbasic_frag},lambert:{uniforms:qt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Qe(0)}}]),vertexShader:Ie.meshlambert_vert,fragmentShader:Ie.meshlambert_frag},phong:{uniforms:qt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Qe(0)},specular:{value:new Qe(1118481)},shininess:{value:30}}]),vertexShader:Ie.meshphong_vert,fragmentShader:Ie.meshphong_frag},standard:{uniforms:qt([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new Qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ie.meshphysical_vert,fragmentShader:Ie.meshphysical_frag},toon:{uniforms:qt([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new Qe(0)}}]),vertexShader:Ie.meshtoon_vert,fragmentShader:Ie.meshtoon_frag},matcap:{uniforms:qt([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:Ie.meshmatcap_vert,fragmentShader:Ie.meshmatcap_frag},points:{uniforms:qt([le.points,le.fog]),vertexShader:Ie.points_vert,fragmentShader:Ie.points_frag},dashed:{uniforms:qt([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ie.linedashed_vert,fragmentShader:Ie.linedashed_frag},depth:{uniforms:qt([le.common,le.displacementmap]),vertexShader:Ie.depth_vert,fragmentShader:Ie.depth_frag},normal:{uniforms:qt([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:Ie.meshnormal_vert,fragmentShader:Ie.meshnormal_frag},sprite:{uniforms:qt([le.sprite,le.fog]),vertexShader:Ie.sprite_vert,fragmentShader:Ie.sprite_frag},background:{uniforms:{uvTransform:{value:new Be},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ie.background_vert,fragmentShader:Ie.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ie.backgroundCube_vert,fragmentShader:Ie.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ie.cube_vert,fragmentShader:Ie.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ie.equirect_vert,fragmentShader:Ie.equirect_frag},distanceRGBA:{uniforms:qt([le.common,le.displacementmap,{referencePosition:{value:new k},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ie.distanceRGBA_vert,fragmentShader:Ie.distanceRGBA_frag},shadow:{uniforms:qt([le.lights,le.fog,{color:{value:new Qe(0)},opacity:{value:1}}]),vertexShader:Ie.shadow_vert,fragmentShader:Ie.shadow_frag}};ai.physical={uniforms:qt([ai.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Be},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Be},clearcoatNormalScale:{value:new it(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Be},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Be},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Be},sheen:{value:0},sheenColor:{value:new Qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Be},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Be},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Be},transmissionSamplerSize:{value:new it},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Be},attenuationDistance:{value:0},attenuationColor:{value:new Qe(0)},specularColor:{value:new Qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Be},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Be}}]),vertexShader:Ie.meshphysical_vert,fragmentShader:Ie.meshphysical_frag};const tl={r:0,b:0,g:0};function X1(n,e,t,i,r,s,o){const a=new Qe(0);let l=s===!0?0:1,c,d,h=null,u=0,p=null;function v(g,f){let m=!1,y=f.isScene===!0?f.background:null;switch(y&&y.isTexture&&(y=(f.backgroundBlurriness>0?t:e).get(y)),y===null?_(a,l):y&&y.isColor&&(_(y,1),m=!0),n.xr.getEnvironmentBlendMode()){case"opaque":m=!0;break;case"additive":i.buffers.color.setClear(0,0,0,1,o),m=!0;break;case"alpha-blend":i.buffers.color.setClear(0,0,0,0,o),m=!0;break}(n.autoClear||m)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),y&&(y.isCubeTexture||y.mapping===pc)?(d===void 0&&(d=new gn(new Wr(1,1,1),new Xr({name:"BackgroundCubeMaterial",uniforms:Ys(ai.backgroundCube.uniforms),vertexShader:ai.backgroundCube.vertexShader,fragmentShader:ai.backgroundCube.fragmentShader,side:ln,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(w,R,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(d)),d.material.uniforms.envMap.value=y,d.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,d.material.toneMapped=y.colorSpace!==Pe,(h!==y||u!==y.version||p!==n.toneMapping)&&(d.material.needsUpdate=!0,h=y,u=y.version,p=n.toneMapping),d.layers.enableAll(),g.unshift(d,d.geometry,d.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new gn(new Ff(2,2),new Xr({name:"BackgroundMaterial",uniforms:Ys(ai.background.uniforms),vertexShader:ai.background.vertexShader,fragmentShader:ai.background.fragmentShader,side:cr,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,c.material.toneMapped=y.colorSpace!==Pe,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||u!==y.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,h=y,u=y.version,p=n.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null))}function _(g,f){g.getRGB(tl,A0(n)),i.buffers.color.setClear(tl.r,tl.g,tl.b,f,o)}return{getClearColor:function(){return a},setClearColor:function(g,f=1){a.set(g),l=f,_(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,_(a,l)},render:v}}function q1(n,e,t,i){const r=n.getParameter(n.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),o=i.isWebGL2||s!==null,a={},l=g(null);let c=l,d=!1;function h(P,N,U,X,I){let B=!1;if(o){const W=_(X,U,N);c!==W&&(c=W,p(c.object)),B=f(P,X,U,I),B&&m(P,X,U,I)}else{const W=N.wireframe===!0;(c.geometry!==X.id||c.program!==U.id||c.wireframe!==W)&&(c.geometry=X.id,c.program=U.id,c.wireframe=W,B=!0)}I!==null&&t.update(I,n.ELEMENT_ARRAY_BUFFER),(B||d)&&(d=!1,D(P,N,U,X),I!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(I).buffer))}function u(){return i.isWebGL2?n.createVertexArray():s.createVertexArrayOES()}function p(P){return i.isWebGL2?n.bindVertexArray(P):s.bindVertexArrayOES(P)}function v(P){return i.isWebGL2?n.deleteVertexArray(P):s.deleteVertexArrayOES(P)}function _(P,N,U){const X=U.wireframe===!0;let I=a[P.id];I===void 0&&(I={},a[P.id]=I);let B=I[N.id];B===void 0&&(B={},I[N.id]=B);let W=B[X];return W===void 0&&(W=g(u()),B[X]=W),W}function g(P){const N=[],U=[],X=[];for(let I=0;I<r;I++)N[I]=0,U[I]=0,X[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:U,attributeDivisors:X,object:P,attributes:{},index:null}}function f(P,N,U,X){const I=c.attributes,B=N.attributes;let W=0;const ee=U.getAttributes();for(const q in ee)if(ee[q].location>=0){const Y=I[q];let re=B[q];if(re===void 0&&(q==="instanceMatrix"&&P.instanceMatrix&&(re=P.instanceMatrix),q==="instanceColor"&&P.instanceColor&&(re=P.instanceColor)),Y===void 0||Y.attribute!==re||re&&Y.data!==re.data)return!0;W++}return c.attributesNum!==W||c.index!==X}function m(P,N,U,X){const I={},B=N.attributes;let W=0;const ee=U.getAttributes();for(const q in ee)if(ee[q].location>=0){let Y=B[q];Y===void 0&&(q==="instanceMatrix"&&P.instanceMatrix&&(Y=P.instanceMatrix),q==="instanceColor"&&P.instanceColor&&(Y=P.instanceColor));const re={};re.attribute=Y,Y&&Y.data&&(re.data=Y.data),I[q]=re,W++}c.attributes=I,c.attributesNum=W,c.index=X}function y(){const P=c.newAttributes;for(let N=0,U=P.length;N<U;N++)P[N]=0}function x(P){M(P,0)}function M(P,N){const U=c.newAttributes,X=c.enabledAttributes,I=c.attributeDivisors;U[P]=1,X[P]===0&&(n.enableVertexAttribArray(P),X[P]=1),I[P]!==N&&((i.isWebGL2?n:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](P,N),I[P]=N)}function w(){const P=c.newAttributes,N=c.enabledAttributes;for(let U=0,X=N.length;U<X;U++)N[U]!==P[U]&&(n.disableVertexAttribArray(U),N[U]=0)}function R(P,N,U,X,I,B){i.isWebGL2===!0&&(U===n.INT||U===n.UNSIGNED_INT)?n.vertexAttribIPointer(P,N,U,I,B):n.vertexAttribPointer(P,N,U,X,I,B)}function D(P,N,U,X){if(i.isWebGL2===!1&&(P.isInstancedMesh||X.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;y();const I=X.attributes,B=U.getAttributes(),W=N.defaultAttributeValues;for(const ee in B){const q=B[ee];if(q.location>=0){let H=I[ee];if(H===void 0&&(ee==="instanceMatrix"&&P.instanceMatrix&&(H=P.instanceMatrix),ee==="instanceColor"&&P.instanceColor&&(H=P.instanceColor)),H!==void 0){const Y=H.normalized,re=H.itemSize,oe=t.get(H);if(oe===void 0)continue;const F=oe.buffer,Ee=oe.type,we=oe.bytesPerElement;if(H.isInterleavedBufferAttribute){const ae=H.data,xe=ae.stride,We=H.offset;if(ae.isInstancedInterleavedBuffer){for(let ge=0;ge<q.locationSize;ge++)M(q.location+ge,ae.meshPerAttribute);P.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let ge=0;ge<q.locationSize;ge++)x(q.location+ge);n.bindBuffer(n.ARRAY_BUFFER,F);for(let ge=0;ge<q.locationSize;ge++)R(q.location+ge,re/q.locationSize,Ee,Y,xe*we,(We+re/q.locationSize*ge)*we)}else{if(H.isInstancedBufferAttribute){for(let ae=0;ae<q.locationSize;ae++)M(q.location+ae,H.meshPerAttribute);P.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=H.meshPerAttribute*H.count)}else for(let ae=0;ae<q.locationSize;ae++)x(q.location+ae);n.bindBuffer(n.ARRAY_BUFFER,F);for(let ae=0;ae<q.locationSize;ae++)R(q.location+ae,re/q.locationSize,Ee,Y,re*we,re/q.locationSize*ae*we)}}else if(W!==void 0){const Y=W[ee];if(Y!==void 0)switch(Y.length){case 2:n.vertexAttrib2fv(q.location,Y);break;case 3:n.vertexAttrib3fv(q.location,Y);break;case 4:n.vertexAttrib4fv(q.location,Y);break;default:n.vertexAttrib1fv(q.location,Y)}}}}w()}function E(){O();for(const P in a){const N=a[P];for(const U in N){const X=N[U];for(const I in X)v(X[I].object),delete X[I];delete N[U]}delete a[P]}}function T(P){if(a[P.id]===void 0)return;const N=a[P.id];for(const U in N){const X=N[U];for(const I in X)v(X[I].object),delete X[I];delete N[U]}delete a[P.id]}function V(P){for(const N in a){const U=a[N];if(U[P.id]===void 0)continue;const X=U[P.id];for(const I in X)v(X[I].object),delete X[I];delete U[P.id]}}function O(){C(),d=!0,c!==l&&(c=l,p(c.object))}function C(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:h,reset:O,resetDefaultState:C,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:V,initAttributes:y,enableAttribute:x,disableUnusedAttributes:w}}function j1(n,e,t,i){const r=i.isWebGL2;let s;function o(c){s=c}function a(c,d){n.drawArrays(s,c,d),t.update(d,s,1)}function l(c,d,h){if(h===0)return;let u,p;if(r)u=n,p="drawArraysInstanced";else if(u=e.get("ANGLE_instanced_arrays"),p="drawArraysInstancedANGLE",u===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}u[p](s,c,d,h),t.update(d,s,h)}this.setMode=o,this.render=a,this.renderInstances=l}function Y1(n,e,t){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");i=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext";let a=t.precision!==void 0?t.precision:"highp";const l=s(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=o||e.has("WEBGL_draw_buffers"),d=t.logarithmicDepthBuffer===!0,h=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),u=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_TEXTURE_SIZE),v=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),_=n.getParameter(n.MAX_VERTEX_ATTRIBS),g=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),f=n.getParameter(n.MAX_VARYING_VECTORS),m=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),y=u>0,x=o||e.has("OES_texture_float"),M=y&&x,w=o?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:r,getMaxPrecision:s,precision:a,logarithmicDepthBuffer:d,maxTextures:h,maxVertexTextures:u,maxTextureSize:p,maxCubemapSize:v,maxAttributes:_,maxVertexUniforms:g,maxVaryings:f,maxFragmentUniforms:m,vertexTextures:y,floatFragmentTextures:x,floatVertexTextures:M,maxSamples:w}}function $1(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new Er,a=new Be,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){const p=h.length!==0||u||i!==0||r;return r=u,i=h.length,p},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,u){t=d(h,u,0)},this.setState=function(h,u,p){const v=h.clippingPlanes,_=h.clipIntersection,g=h.clipShadows,f=n.get(h);if(!r||v===null||v.length===0||s&&!g)s?d(null):c();else{const m=s?0:i,y=m*4;let x=f.clippingState||null;l.value=x,x=d(v,u,y,p);for(let M=0;M!==y;++M)x[M]=t[M];f.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=m}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(h,u,p,v){const _=h!==null?h.length:0;let g=null;if(_!==0){if(g=l.value,v!==!0||g===null){const f=p+_*4,m=u.matrixWorldInverse;a.getNormalMatrix(m),(g===null||g.length<f)&&(g=new Float32Array(f));for(let y=0,x=p;y!==_;++y,x+=4)o.copy(h[y]).applyMatrix4(m,a),o.normal.toArray(g,x),g[x+3]=o.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}function K1(n){let e=new WeakMap;function t(o,a){return a===bd?o.mapping=Xs:a===Ld&&(o.mapping=qs),o}function i(o){if(o&&o.isTexture&&o.isRenderTargetTexture===!1){const a=o.mapping;if(a===bd||a===Ld)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new fw(l.height/2);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class P0 extends R0{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=d*this.view.offsetY,l=a-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Cs=4,cm=[.125,.215,.35,.446,.526,.582],Ar=20,Tu=new P0,um=new Qe;let Au=null;const wr=(1+Math.sqrt(5))/2,hs=1/wr,dm=[new k(1,1,1),new k(-1,1,1),new k(1,1,-1),new k(-1,1,-1),new k(0,wr,hs),new k(0,wr,-hs),new k(hs,0,wr),new k(-hs,0,wr),new k(wr,hs,0),new k(-wr,hs,0)];class fm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){Au=this._renderer.getRenderTarget(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=mm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=pm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Au),e.scissorTest=!1,nl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Xs||e.mapping===qs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Au=this._renderer.getRenderTarget();const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:bn,minFilter:bn,generateMipmaps:!1,type:ta,format:jn,colorSpace:fi,depthBuffer:!1},r=hm(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=hm(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Z1(s)),this._blurMaterial=Q1(s,e,t)}return r}_compileMaterial(e){const t=new gn(this._lodPlanes[0],e);this._renderer.compile(t,Tu)}_sceneToCubeUV(e,t,i,r){const a=new Xn(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,u=d.toneMapping;d.getClearColor(um),d.toneMapping=Pi,d.autoClear=!1;const p=new Uf({name:"PMREM.Background",side:ln,depthWrite:!1,depthTest:!1}),v=new gn(new Wr,p);let _=!1;const g=e.background;g?g.isColor&&(p.color.copy(g),e.background=null,_=!0):(p.color.copy(um),_=!0);for(let f=0;f<6;f++){const m=f%3;m===0?(a.up.set(0,l[f],0),a.lookAt(c[f],0,0)):m===1?(a.up.set(0,0,l[f]),a.lookAt(0,c[f],0)):(a.up.set(0,l[f],0),a.lookAt(0,0,c[f]));const y=this._cubeSize;nl(r,m*y,f>2?y:0,y,y),d.setRenderTarget(r),_&&d.render(v,a),d.render(e,a)}v.geometry.dispose(),v.material.dispose(),d.toneMapping=u,d.autoClear=h,e.background=g}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Xs||e.mapping===qs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=mm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=pm());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new gn(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;nl(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,Tu)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;for(let r=1;r<this._lodPlanes.length;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=dm[(r-1)%dm.length];this._blur(e,r-1,r,s,o)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,h=new gn(this._lodPlanes[r],c),u=c.uniforms,p=this._sizeLods[i]-1,v=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Ar-1),_=s/v,g=isFinite(s)?1+Math.floor(d*_):Ar;g>Ar&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ar}`);const f=[];let m=0;for(let R=0;R<Ar;++R){const D=R/_,E=Math.exp(-D*D/2);f.push(E),R===0?m+=E:R<g&&(m+=2*E)}for(let R=0;R<f.length;R++)f[R]=f[R]/m;u.envMap.value=e.texture,u.samples.value=g,u.weights.value=f,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:y}=this;u.dTheta.value=v,u.mipInt.value=y-i;const x=this._sizeLods[r],M=3*x*(r>y-Cs?r-y+Cs:0),w=4*(this._cubeSize-x);nl(t,M,w,3*x,2*x),l.setRenderTarget(t),l.render(h,Tu)}}function Z1(n){const e=[],t=[],i=[];let r=n;const s=n-Cs+1+cm.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let l=1/a;o>n-Cs?l=cm[o-n+Cs-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),d=-c,h=1+c,u=[d,d,h,d,h,h,d,d,h,h,d,h],p=6,v=6,_=3,g=2,f=1,m=new Float32Array(_*v*p),y=new Float32Array(g*v*p),x=new Float32Array(f*v*p);for(let w=0;w<p;w++){const R=w%3*2/3-1,D=w>2?0:-1,E=[R,D,0,R+2/3,D,0,R+2/3,D+1,0,R,D,0,R+2/3,D+1,0,R,D+1,0];m.set(E,_*v*w),y.set(u,g*v*w);const T=[w,w,w,w,w,w];x.set(T,f*v*w)}const M=new _n;M.setAttribute("position",new Zn(m,_)),M.setAttribute("uv",new Zn(y,g)),M.setAttribute("faceIndex",new Zn(x,f)),e.push(M),r>Cs&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function hm(n,e,t){const i=new Vr(n,e,t);return i.texture.mapping=pc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function nl(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function Q1(n,e,t){const i=new Float32Array(Ar),r=new k(0,1,0);return new Xr({name:"SphericalGaussianBlur",defines:{n:Ar,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:zf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:or,depthTest:!1,depthWrite:!1})}function pm(){return new Xr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:zf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:or,depthTest:!1,depthWrite:!1})}function mm(){return new Xr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:zf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:or,depthTest:!1,depthWrite:!1})}function zf(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function J1(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===bd||l===Ld,d=l===Xs||l===qs;if(c||d)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let h=e.get(a);return t===null&&(t=new fm(n)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),e.set(a,h),h.texture}else{if(e.has(a))return e.get(a).texture;{const h=a.image;if(c&&h&&h.height>0||d&&h&&r(h)){t===null&&(t=new fm(n));const u=c?t.fromEquirectangular(a):t.fromCubemap(a);return e.set(a,u),a.addEventListener("dispose",s),u.texture}else return null}}}return a}function r(a){let l=0;const c=6;for(let d=0;d<c;d++)a[d]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function eA(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(i){i.isWebGL2?t("EXT_color_buffer_float"):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(i){const r=t(i);return r===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function tA(n,e,t,i){const r={},s=new WeakMap;function o(h){const u=h.target;u.index!==null&&e.remove(u.index);for(const v in u.attributes)e.remove(u.attributes[v]);u.removeEventListener("dispose",o),delete r[u.id];const p=s.get(u);p&&(e.remove(p),s.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function a(h,u){return r[u.id]===!0||(u.addEventListener("dispose",o),r[u.id]=!0,t.memory.geometries++),u}function l(h){const u=h.attributes;for(const v in u)e.update(u[v],n.ARRAY_BUFFER);const p=h.morphAttributes;for(const v in p){const _=p[v];for(let g=0,f=_.length;g<f;g++)e.update(_[g],n.ARRAY_BUFFER)}}function c(h){const u=[],p=h.index,v=h.attributes.position;let _=0;if(p!==null){const m=p.array;_=p.version;for(let y=0,x=m.length;y<x;y+=3){const M=m[y+0],w=m[y+1],R=m[y+2];u.push(M,w,w,R,R,M)}}else{const m=v.array;_=v.version;for(let y=0,x=m.length/3-1;y<x;y+=3){const M=y+0,w=y+1,R=y+2;u.push(M,w,w,R,R,M)}}const g=new(v0(u)?T0:w0)(u,1);g.version=_;const f=s.get(h);f&&e.remove(f),s.set(h,g)}function d(h){const u=s.get(h);if(u){const p=h.index;p!==null&&u.version<p.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:d}}function nA(n,e,t,i){const r=i.isWebGL2;let s;function o(u){s=u}let a,l;function c(u){a=u.type,l=u.bytesPerElement}function d(u,p){n.drawElements(s,p,a,u*l),t.update(p,s,1)}function h(u,p,v){if(v===0)return;let _,g;if(r)_=n,g="drawElementsInstanced";else if(_=e.get("ANGLE_instanced_arrays"),g="drawElementsInstancedANGLE",_===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}_[g](s,p,a,u*l,v),t.update(p,s,v)}this.setMode=o,this.setIndex=c,this.render=d,this.renderInstances=h}function iA(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.frame++,t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function rA(n,e){return n[0]-e[0]}function sA(n,e){return Math.abs(e[1])-Math.abs(n[1])}function oA(n,e,t){const i={},r=new Float32Array(8),s=new WeakMap,o=new Nt,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,d,h){const u=c.morphTargetInfluences;if(e.isWebGL2===!0){const v=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,_=v!==void 0?v.length:0;let g=s.get(d);if(g===void 0||g.count!==_){let N=function(){C.dispose(),s.delete(d),d.removeEventListener("dispose",N)};var p=N;g!==void 0&&g.texture.dispose();const y=d.morphAttributes.position!==void 0,x=d.morphAttributes.normal!==void 0,M=d.morphAttributes.color!==void 0,w=d.morphAttributes.position||[],R=d.morphAttributes.normal||[],D=d.morphAttributes.color||[];let E=0;y===!0&&(E=1),x===!0&&(E=2),M===!0&&(E=3);let T=d.attributes.position.count*E,V=1;T>e.maxTextureSize&&(V=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const O=new Float32Array(T*V*4*_),C=new x0(O,T,V,_);C.type=Pr,C.needsUpdate=!0;const P=E*4;for(let U=0;U<_;U++){const X=w[U],I=R[U],B=D[U],W=T*V*4*U;for(let ee=0;ee<X.count;ee++){const q=ee*P;y===!0&&(o.fromBufferAttribute(X,ee),O[W+q+0]=o.x,O[W+q+1]=o.y,O[W+q+2]=o.z,O[W+q+3]=0),x===!0&&(o.fromBufferAttribute(I,ee),O[W+q+4]=o.x,O[W+q+5]=o.y,O[W+q+6]=o.z,O[W+q+7]=0),M===!0&&(o.fromBufferAttribute(B,ee),O[W+q+8]=o.x,O[W+q+9]=o.y,O[W+q+10]=o.z,O[W+q+11]=B.itemSize===4?o.w:1)}}g={count:_,texture:C,size:new it(T,V)},s.set(d,g),d.addEventListener("dispose",N)}let f=0;for(let y=0;y<u.length;y++)f+=u[y];const m=d.morphTargetsRelative?1:1-f;h.getUniforms().setValue(n,"morphTargetBaseInfluence",m),h.getUniforms().setValue(n,"morphTargetInfluences",u),h.getUniforms().setValue(n,"morphTargetsTexture",g.texture,t),h.getUniforms().setValue(n,"morphTargetsTextureSize",g.size)}else{const v=u===void 0?0:u.length;let _=i[d.id];if(_===void 0||_.length!==v){_=[];for(let x=0;x<v;x++)_[x]=[x,0];i[d.id]=_}for(let x=0;x<v;x++){const M=_[x];M[0]=x,M[1]=u[x]}_.sort(sA);for(let x=0;x<8;x++)x<v&&_[x][1]?(a[x][0]=_[x][0],a[x][1]=_[x][1]):(a[x][0]=Number.MAX_SAFE_INTEGER,a[x][1]=0);a.sort(rA);const g=d.morphAttributes.position,f=d.morphAttributes.normal;let m=0;for(let x=0;x<8;x++){const M=a[x],w=M[0],R=M[1];w!==Number.MAX_SAFE_INTEGER&&R?(g&&d.getAttribute("morphTarget"+x)!==g[w]&&d.setAttribute("morphTarget"+x,g[w]),f&&d.getAttribute("morphNormal"+x)!==f[w]&&d.setAttribute("morphNormal"+x,f[w]),r[x]=R,m+=R):(g&&d.hasAttribute("morphTarget"+x)===!0&&d.deleteAttribute("morphTarget"+x),f&&d.hasAttribute("morphNormal"+x)===!0&&d.deleteAttribute("morphNormal"+x),r[x]=0)}const y=d.morphTargetsRelative?1:1-m;h.getUniforms().setValue(n,"morphTargetBaseInfluence",y),h.getUniforms().setValue(n,"morphTargetInfluences",r)}}return{update:l}}function aA(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,d=l.geometry,h=e.get(l,d);return r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER)),h}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}const D0=new xn,I0=new x0,N0=new KE,U0=new C0,gm=[],vm=[],_m=new Float32Array(16),ym=new Float32Array(9),xm=new Float32Array(4);function Js(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=gm[r];if(s===void 0&&(s=new Float32Array(r),gm[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function At(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Rt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function vc(n,e){let t=vm[e];t===void 0&&(t=new Int32Array(e),vm[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function lA(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function cA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;n.uniform2fv(this.addr,e),Rt(t,e)}}function uA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(At(t,e))return;n.uniform3fv(this.addr,e),Rt(t,e)}}function dA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;n.uniform4fv(this.addr,e),Rt(t,e)}}function fA(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(At(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Rt(t,e)}else{if(At(t,i))return;xm.set(i),n.uniformMatrix2fv(this.addr,!1,xm),Rt(t,i)}}function hA(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(At(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Rt(t,e)}else{if(At(t,i))return;ym.set(i),n.uniformMatrix3fv(this.addr,!1,ym),Rt(t,i)}}function pA(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(At(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Rt(t,e)}else{if(At(t,i))return;_m.set(i),n.uniformMatrix4fv(this.addr,!1,_m),Rt(t,i)}}function mA(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function gA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;n.uniform2iv(this.addr,e),Rt(t,e)}}function vA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;n.uniform3iv(this.addr,e),Rt(t,e)}}function _A(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;n.uniform4iv(this.addr,e),Rt(t,e)}}function yA(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function xA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;n.uniform2uiv(this.addr,e),Rt(t,e)}}function SA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;n.uniform3uiv(this.addr,e),Rt(t,e)}}function MA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;n.uniform4uiv(this.addr,e),Rt(t,e)}}function EA(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2D(e||D0,r)}function wA(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||N0,r)}function TA(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||U0,r)}function AA(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||I0,r)}function RA(n){switch(n){case 5126:return lA;case 35664:return cA;case 35665:return uA;case 35666:return dA;case 35674:return fA;case 35675:return hA;case 35676:return pA;case 5124:case 35670:return mA;case 35667:case 35671:return gA;case 35668:case 35672:return vA;case 35669:case 35673:return _A;case 5125:return yA;case 36294:return xA;case 36295:return SA;case 36296:return MA;case 35678:case 36198:case 36298:case 36306:case 35682:return EA;case 35679:case 36299:case 36307:return wA;case 35680:case 36300:case 36308:case 36293:return TA;case 36289:case 36303:case 36311:case 36292:return AA}}function CA(n,e){n.uniform1fv(this.addr,e)}function bA(n,e){const t=Js(e,this.size,2);n.uniform2fv(this.addr,t)}function LA(n,e){const t=Js(e,this.size,3);n.uniform3fv(this.addr,t)}function PA(n,e){const t=Js(e,this.size,4);n.uniform4fv(this.addr,t)}function DA(n,e){const t=Js(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function IA(n,e){const t=Js(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function NA(n,e){const t=Js(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function UA(n,e){n.uniform1iv(this.addr,e)}function FA(n,e){n.uniform2iv(this.addr,e)}function zA(n,e){n.uniform3iv(this.addr,e)}function OA(n,e){n.uniform4iv(this.addr,e)}function BA(n,e){n.uniform1uiv(this.addr,e)}function kA(n,e){n.uniform2uiv(this.addr,e)}function HA(n,e){n.uniform3uiv(this.addr,e)}function GA(n,e){n.uniform4uiv(this.addr,e)}function VA(n,e,t){const i=this.cache,r=e.length,s=vc(t,r);At(i,s)||(n.uniform1iv(this.addr,s),Rt(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||D0,s[o])}function WA(n,e,t){const i=this.cache,r=e.length,s=vc(t,r);At(i,s)||(n.uniform1iv(this.addr,s),Rt(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||N0,s[o])}function XA(n,e,t){const i=this.cache,r=e.length,s=vc(t,r);At(i,s)||(n.uniform1iv(this.addr,s),Rt(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||U0,s[o])}function qA(n,e,t){const i=this.cache,r=e.length,s=vc(t,r);At(i,s)||(n.uniform1iv(this.addr,s),Rt(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||I0,s[o])}function jA(n){switch(n){case 5126:return CA;case 35664:return bA;case 35665:return LA;case 35666:return PA;case 35674:return DA;case 35675:return IA;case 35676:return NA;case 5124:case 35670:return UA;case 35667:case 35671:return FA;case 35668:case 35672:return zA;case 35669:case 35673:return OA;case 5125:return BA;case 36294:return kA;case 36295:return HA;case 36296:return GA;case 35678:case 36198:case 36298:case 36306:case 35682:return VA;case 35679:case 36299:case 36307:return WA;case 35680:case 36300:case 36308:case 36293:return XA;case 36289:case 36303:case 36311:case 36292:return qA}}class YA{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.setValue=RA(t.type)}}class $A{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.size=t.size,this.setValue=jA(t.type)}}class KA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const Ru=/(\w+)(\])?(\[|\.)?/g;function Sm(n,e){n.seq.push(e),n.map[e.id]=e}function ZA(n,e,t){const i=n.name,r=i.length;for(Ru.lastIndex=0;;){const s=Ru.exec(i),o=Ru.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Sm(t,c===void 0?new YA(a,n,e):new $A(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new KA(a),Sm(t,h)),t=h}}}class Ml{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);ZA(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function Mm(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}let QA=0;function JA(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}function eR(n){switch(n){case fi:return["Linear","( value )"];case Pe:return["sRGB","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),["Linear","( value )"]}}function Em(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+JA(n.getShaderSource(e),o)}else return r}function tR(n,e){const t=eR(e);return"vec4 "+n+"( vec4 value ) { return LinearTo"+t[0]+t[1]+"; }"}function nR(n,e){let t;switch(e){case mE:t="Linear";break;case gE:t="Reinhard";break;case vE:t="OptimizedCineon";break;case _E:t="ACESFilmic";break;case yE:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function iR(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Mo).join(`
`)}function rR(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function sR(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Mo(n){return n!==""}function wm(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Tm(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const oR=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ud(n){return n.replace(oR,aR)}function aR(n,e){const t=Ie[e];if(t===void 0)throw new Error("Can not resolve #include <"+e+">");return Ud(t)}const lR=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Am(n){return n.replace(lR,cR)}function cR(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Rm(n){let e="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function uR(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===c0?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===jM?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===wi&&(e="SHADOWMAP_TYPE_VSM"),e}function dR(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Xs:case qs:e="ENVMAP_TYPE_CUBE";break;case pc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function fR(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case qs:e="ENVMAP_MODE_REFRACTION";break}return e}function hR(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case f0:e="ENVMAP_BLENDING_MULTIPLY";break;case hE:e="ENVMAP_BLENDING_MIX";break;case pE:e="ENVMAP_BLENDING_ADD";break}return e}function pR(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function mR(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=uR(t),c=dR(t),d=fR(t),h=hR(t),u=pR(t),p=t.isWebGL2?"":iR(t),v=rR(s),_=r.createProgram();let g,f,m=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=[v].filter(Mo).join(`
`),g.length>0&&(g+=`
`),f=[p,v].filter(Mo).join(`
`),f.length>0&&(f+=`
`)):(g=[Rm(t),"#define SHADER_NAME "+t.shaderName,v,t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Mo).join(`
`),f=[p,Rm(t),"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Pi?"#define TONE_MAPPING":"",t.toneMapping!==Pi?Ie.tonemapping_pars_fragment:"",t.toneMapping!==Pi?nR("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ie.encodings_pars_fragment,tR("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Mo).join(`
`)),o=Ud(o),o=wm(o,t),o=Tm(o,t),a=Ud(a),a=wm(a,t),a=Tm(a,t),o=Am(o),a=Am(a),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,g=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",t.glslVersion===qp?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===qp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const y=m+g+o,x=m+f+a,M=Mm(r,r.VERTEX_SHADER,y),w=Mm(r,r.FRAGMENT_SHADER,x);if(r.attachShader(_,M),r.attachShader(_,w),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_),n.debug.checkShaderErrors){const E=r.getProgramInfoLog(_).trim(),T=r.getShaderInfoLog(M).trim(),V=r.getShaderInfoLog(w).trim();let O=!0,C=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(O=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,_,M,w);else{const P=Em(r,M,"vertex"),N=Em(r,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Program Info Log: `+E+`
`+P+`
`+N)}else E!==""?console.warn("THREE.WebGLProgram: Program Info Log:",E):(T===""||V==="")&&(C=!1);C&&(this.diagnostics={runnable:O,programLog:E,vertexShader:{log:T,prefix:g},fragmentShader:{log:V,prefix:f}})}r.deleteShader(M),r.deleteShader(w);let R;this.getUniforms=function(){return R===void 0&&(R=new Ml(r,_)),R};let D;return this.getAttributes=function(){return D===void 0&&(D=sR(r,_)),D},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.name=t.shaderName,this.id=QA++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=M,this.fragmentShader=w,this}let gR=0;class vR{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new _R(e),t.set(e,i)),i}}class _R{constructor(e){this.id=gR++,this.code=e,this.usedTimes=0}}function yR(n,e,t,i,r,s,o){const a=new M0,l=new vR,c=[],d=r.isWebGL2,h=r.logarithmicDepthBuffer,u=r.vertexTextures;let p=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(E){return E===1?"uv1":E===2?"uv2":E===3?"uv3":"uv"}function g(E,T,V,O,C){const P=O.fog,N=C.geometry,U=E.isMeshStandardMaterial?O.environment:null,X=(E.isMeshStandardMaterial?t:e).get(E.envMap||U),I=X&&X.mapping===pc?X.image.height:null,B=v[E.type];E.precision!==null&&(p=r.getMaxPrecision(E.precision),p!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",p,"instead."));const W=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,ee=W!==void 0?W.length:0;let q=0;N.morphAttributes.position!==void 0&&(q=1),N.morphAttributes.normal!==void 0&&(q=2),N.morphAttributes.color!==void 0&&(q=3);let H,Y,re,oe;if(B){const Ke=ai[B];H=Ke.vertexShader,Y=Ke.fragmentShader}else H=E.vertexShader,Y=E.fragmentShader,l.update(E),re=l.getVertexShaderID(E),oe=l.getFragmentShaderID(E);const F=n.getRenderTarget(),Ee=C.isInstancedMesh===!0,we=!!E.map,ae=!!E.matcap,xe=!!X,We=!!E.aoMap,ge=!!E.lightMap,Le=!!E.bumpMap,lt=!!E.normalMap,yt=!!E.displacementMap,ht=!!E.emissiveMap,ct=!!E.metalnessMap,Ve=!!E.roughnessMap,Re=E.clearcoat>0,Xe=E.iridescence>0,L=E.sheen>0,A=E.transmission>0,$=Re&&!!E.clearcoatMap,ie=Re&&!!E.clearcoatNormalMap,se=Re&&!!E.clearcoatRoughnessMap,ce=Xe&&!!E.iridescenceMap,Ce=Xe&&!!E.iridescenceThicknessMap,me=L&&!!E.sheenColorMap,Q=L&&!!E.sheenRoughnessMap,_e=!!E.specularMap,Se=!!E.specularColorMap,Te=!!E.specularIntensityMap,pe=A&&!!E.transmissionMap,ye=A&&!!E.thicknessMap,ke=!!E.gradientMap,Ye=!!E.alphaMap,pt=E.alphaTest>0,z=!!E.extensions,K=!!N.attributes.uv1,te=!!N.attributes.uv2,ue=!!N.attributes.uv3;return{isWebGL2:d,shaderID:B,shaderName:E.type,vertexShader:H,fragmentShader:Y,defines:E.defines,customVertexShaderID:re,customFragmentShaderID:oe,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:p,instancing:Ee,instancingColor:Ee&&C.instanceColor!==null,supportsVertexTextures:u,outputColorSpace:F===null?n.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:fi,map:we,matcap:ae,envMap:xe,envMapMode:xe&&X.mapping,envMapCubeUVHeight:I,aoMap:We,lightMap:ge,bumpMap:Le,normalMap:lt,displacementMap:u&&yt,emissiveMap:ht,normalMapObjectSpace:lt&&E.normalMapType===BE,normalMapTangentSpace:lt&&E.normalMapType===OE,metalnessMap:ct,roughnessMap:Ve,clearcoat:Re,clearcoatMap:$,clearcoatNormalMap:ie,clearcoatRoughnessMap:se,iridescence:Xe,iridescenceMap:ce,iridescenceThicknessMap:Ce,sheen:L,sheenColorMap:me,sheenRoughnessMap:Q,specularMap:_e,specularColorMap:Se,specularIntensityMap:Te,transmission:A,transmissionMap:pe,thicknessMap:ye,gradientMap:ke,opaque:E.transparent===!1&&E.blending===Us,alphaMap:Ye,alphaTest:pt,combine:E.combine,mapUv:we&&_(E.map.channel),aoMapUv:We&&_(E.aoMap.channel),lightMapUv:ge&&_(E.lightMap.channel),bumpMapUv:Le&&_(E.bumpMap.channel),normalMapUv:lt&&_(E.normalMap.channel),displacementMapUv:yt&&_(E.displacementMap.channel),emissiveMapUv:ht&&_(E.emissiveMap.channel),metalnessMapUv:ct&&_(E.metalnessMap.channel),roughnessMapUv:Ve&&_(E.roughnessMap.channel),clearcoatMapUv:$&&_(E.clearcoatMap.channel),clearcoatNormalMapUv:ie&&_(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:se&&_(E.clearcoatRoughnessMap.channel),iridescenceMapUv:ce&&_(E.iridescenceMap.channel),iridescenceThicknessMapUv:Ce&&_(E.iridescenceThicknessMap.channel),sheenColorMapUv:me&&_(E.sheenColorMap.channel),sheenRoughnessMapUv:Q&&_(E.sheenRoughnessMap.channel),specularMapUv:_e&&_(E.specularMap.channel),specularColorMapUv:Se&&_(E.specularColorMap.channel),specularIntensityMapUv:Te&&_(E.specularIntensityMap.channel),transmissionMapUv:pe&&_(E.transmissionMap.channel),thicknessMapUv:ye&&_(E.thicknessMap.channel),alphaMapUv:Ye&&_(E.alphaMap.channel),vertexTangents:lt&&!!N.attributes.tangent,vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,vertexUv1s:K,vertexUv2s:te,vertexUv3s:ue,pointsUvs:C.isPoints===!0&&!!N.attributes.uv&&(we||Ye),fog:!!P,useFog:E.fog===!0,fogExp2:P&&P.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:C.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:ee,morphTextureStride:q,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:E.dithering,shadowMapEnabled:n.shadowMap.enabled&&V.length>0,shadowMapType:n.shadowMap.type,toneMapping:E.toneMapped?n.toneMapping:Pi,useLegacyLights:n.useLegacyLights,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===Ri,flipSided:E.side===ln,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionDerivatives:z&&E.extensions.derivatives===!0,extensionFragDepth:z&&E.extensions.fragDepth===!0,extensionDrawBuffers:z&&E.extensions.drawBuffers===!0,extensionShaderTextureLOD:z&&E.extensions.shaderTextureLOD===!0,rendererExtensionFragDepth:d||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:d||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:d||i.has("EXT_shader_texture_lod"),customProgramCacheKey:E.customProgramCacheKey()}}function f(E){const T=[];if(E.shaderID?T.push(E.shaderID):(T.push(E.customVertexShaderID),T.push(E.customFragmentShaderID)),E.defines!==void 0)for(const V in E.defines)T.push(V),T.push(E.defines[V]);return E.isRawShaderMaterial===!1&&(m(T,E),y(T,E),T.push(n.outputColorSpace)),T.push(E.customProgramCacheKey),T.join()}function m(E,T){E.push(T.precision),E.push(T.outputColorSpace),E.push(T.envMapMode),E.push(T.envMapCubeUVHeight),E.push(T.mapUv),E.push(T.alphaMapUv),E.push(T.lightMapUv),E.push(T.aoMapUv),E.push(T.bumpMapUv),E.push(T.normalMapUv),E.push(T.displacementMapUv),E.push(T.emissiveMapUv),E.push(T.metalnessMapUv),E.push(T.roughnessMapUv),E.push(T.clearcoatMapUv),E.push(T.clearcoatNormalMapUv),E.push(T.clearcoatRoughnessMapUv),E.push(T.iridescenceMapUv),E.push(T.iridescenceThicknessMapUv),E.push(T.sheenColorMapUv),E.push(T.sheenRoughnessMapUv),E.push(T.specularMapUv),E.push(T.specularColorMapUv),E.push(T.specularIntensityMapUv),E.push(T.transmissionMapUv),E.push(T.thicknessMapUv),E.push(T.combine),E.push(T.fogExp2),E.push(T.sizeAttenuation),E.push(T.morphTargetsCount),E.push(T.morphAttributeCount),E.push(T.numDirLights),E.push(T.numPointLights),E.push(T.numSpotLights),E.push(T.numSpotLightMaps),E.push(T.numHemiLights),E.push(T.numRectAreaLights),E.push(T.numDirLightShadows),E.push(T.numPointLightShadows),E.push(T.numSpotLightShadows),E.push(T.numSpotLightShadowsWithMaps),E.push(T.shadowMapType),E.push(T.toneMapping),E.push(T.numClippingPlanes),E.push(T.numClipIntersection),E.push(T.depthPacking)}function y(E,T){a.disableAll(),T.isWebGL2&&a.enable(0),T.supportsVertexTextures&&a.enable(1),T.instancing&&a.enable(2),T.instancingColor&&a.enable(3),T.matcap&&a.enable(4),T.envMap&&a.enable(5),T.normalMapObjectSpace&&a.enable(6),T.normalMapTangentSpace&&a.enable(7),T.clearcoat&&a.enable(8),T.iridescence&&a.enable(9),T.alphaTest&&a.enable(10),T.vertexColors&&a.enable(11),T.vertexAlphas&&a.enable(12),T.vertexUv1s&&a.enable(13),T.vertexUv2s&&a.enable(14),T.vertexUv3s&&a.enable(15),T.vertexTangents&&a.enable(16),E.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.skinning&&a.enable(4),T.morphTargets&&a.enable(5),T.morphNormals&&a.enable(6),T.morphColors&&a.enable(7),T.premultipliedAlpha&&a.enable(8),T.shadowMapEnabled&&a.enable(9),T.useLegacyLights&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),E.push(a.mask)}function x(E){const T=v[E.type];let V;if(T){const O=ai[T];V=lw.clone(O.uniforms)}else V=E.uniforms;return V}function M(E,T){let V;for(let O=0,C=c.length;O<C;O++){const P=c[O];if(P.cacheKey===T){V=P,++V.usedTimes;break}}return V===void 0&&(V=new mR(n,T,E,s),c.push(V)),V}function w(E){if(--E.usedTimes===0){const T=c.indexOf(E);c[T]=c[c.length-1],c.pop(),E.destroy()}}function R(E){l.remove(E)}function D(){l.dispose()}return{getParameters:g,getProgramCacheKey:f,getUniforms:x,acquireProgram:M,releaseProgram:w,releaseShaderCache:R,programs:c,dispose:D}}function xR(){let n=new WeakMap;function e(s){let o=n.get(s);return o===void 0&&(o={},n.set(s,o)),o}function t(s){n.delete(s)}function i(s,o,a){n.get(s)[o]=a}function r(){n=new WeakMap}return{get:e,remove:t,update:i,dispose:r}}function SR(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Cm(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function bm(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h,u,p,v,_,g){let f=n[e];return f===void 0?(f={id:h.id,object:h,geometry:u,material:p,groupOrder:v,renderOrder:h.renderOrder,z:_,group:g},n[e]=f):(f.id=h.id,f.object=h,f.geometry=u,f.material=p,f.groupOrder=v,f.renderOrder=h.renderOrder,f.z=_,f.group=g),e++,f}function a(h,u,p,v,_,g){const f=o(h,u,p,v,_,g);p.transmission>0?i.push(f):p.transparent===!0?r.push(f):t.push(f)}function l(h,u,p,v,_,g){const f=o(h,u,p,v,_,g);p.transmission>0?i.unshift(f):p.transparent===!0?r.unshift(f):t.unshift(f)}function c(h,u){t.length>1&&t.sort(h||SR),i.length>1&&i.sort(u||Cm),r.length>1&&r.sort(u||Cm)}function d(){for(let h=e,u=n.length;h<u;h++){const p=n[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:d,sort:c}}function MR(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new bm,n.set(i,[o])):r>=s.length?(o=new bm,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function ER(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new k,color:new Qe};break;case"SpotLight":t={position:new k,direction:new k,color:new Qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new k,color:new Qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new k,skyColor:new Qe,groundColor:new Qe};break;case"RectAreaLight":t={color:new Qe,position:new k,halfWidth:new k,halfHeight:new k};break}return n[e.id]=t,t}}}function wR(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let TR=0;function AR(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function RR(n,e){const t=new ER,i=wR(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0};for(let d=0;d<9;d++)r.probe.push(new k);const s=new k,o=new Dt,a=new Dt;function l(d,h){let u=0,p=0,v=0;for(let V=0;V<9;V++)r.probe[V].set(0,0,0);let _=0,g=0,f=0,m=0,y=0,x=0,M=0,w=0,R=0,D=0;d.sort(AR);const E=h===!0?Math.PI:1;for(let V=0,O=d.length;V<O;V++){const C=d[V],P=C.color,N=C.intensity,U=C.distance,X=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)u+=P.r*N*E,p+=P.g*N*E,v+=P.b*N*E;else if(C.isLightProbe)for(let I=0;I<9;I++)r.probe[I].addScaledVector(C.sh.coefficients[I],N);else if(C.isDirectionalLight){const I=t.get(C);if(I.color.copy(C.color).multiplyScalar(C.intensity*E),C.castShadow){const B=C.shadow,W=i.get(C);W.shadowBias=B.bias,W.shadowNormalBias=B.normalBias,W.shadowRadius=B.radius,W.shadowMapSize=B.mapSize,r.directionalShadow[_]=W,r.directionalShadowMap[_]=X,r.directionalShadowMatrix[_]=C.shadow.matrix,x++}r.directional[_]=I,_++}else if(C.isSpotLight){const I=t.get(C);I.position.setFromMatrixPosition(C.matrixWorld),I.color.copy(P).multiplyScalar(N*E),I.distance=U,I.coneCos=Math.cos(C.angle),I.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),I.decay=C.decay,r.spot[f]=I;const B=C.shadow;if(C.map&&(r.spotLightMap[R]=C.map,R++,B.updateMatrices(C),C.castShadow&&D++),r.spotLightMatrix[f]=B.matrix,C.castShadow){const W=i.get(C);W.shadowBias=B.bias,W.shadowNormalBias=B.normalBias,W.shadowRadius=B.radius,W.shadowMapSize=B.mapSize,r.spotShadow[f]=W,r.spotShadowMap[f]=X,w++}f++}else if(C.isRectAreaLight){const I=t.get(C);I.color.copy(P).multiplyScalar(N),I.halfWidth.set(C.width*.5,0,0),I.halfHeight.set(0,C.height*.5,0),r.rectArea[m]=I,m++}else if(C.isPointLight){const I=t.get(C);if(I.color.copy(C.color).multiplyScalar(C.intensity*E),I.distance=C.distance,I.decay=C.decay,C.castShadow){const B=C.shadow,W=i.get(C);W.shadowBias=B.bias,W.shadowNormalBias=B.normalBias,W.shadowRadius=B.radius,W.shadowMapSize=B.mapSize,W.shadowCameraNear=B.camera.near,W.shadowCameraFar=B.camera.far,r.pointShadow[g]=W,r.pointShadowMap[g]=X,r.pointShadowMatrix[g]=C.shadow.matrix,M++}r.point[g]=I,g++}else if(C.isHemisphereLight){const I=t.get(C);I.skyColor.copy(C.color).multiplyScalar(N*E),I.groundColor.copy(C.groundColor).multiplyScalar(N*E),r.hemi[y]=I,y++}}m>0&&(e.isWebGL2||n.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=le.LTC_FLOAT_1,r.rectAreaLTC2=le.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=le.LTC_HALF_1,r.rectAreaLTC2=le.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=u,r.ambient[1]=p,r.ambient[2]=v;const T=r.hash;(T.directionalLength!==_||T.pointLength!==g||T.spotLength!==f||T.rectAreaLength!==m||T.hemiLength!==y||T.numDirectionalShadows!==x||T.numPointShadows!==M||T.numSpotShadows!==w||T.numSpotMaps!==R)&&(r.directional.length=_,r.spot.length=f,r.rectArea.length=m,r.point.length=g,r.hemi.length=y,r.directionalShadow.length=x,r.directionalShadowMap.length=x,r.pointShadow.length=M,r.pointShadowMap.length=M,r.spotShadow.length=w,r.spotShadowMap.length=w,r.directionalShadowMatrix.length=x,r.pointShadowMatrix.length=M,r.spotLightMatrix.length=w+R-D,r.spotLightMap.length=R,r.numSpotLightShadowsWithMaps=D,T.directionalLength=_,T.pointLength=g,T.spotLength=f,T.rectAreaLength=m,T.hemiLength=y,T.numDirectionalShadows=x,T.numPointShadows=M,T.numSpotShadows=w,T.numSpotMaps=R,r.version=TR++)}function c(d,h){let u=0,p=0,v=0,_=0,g=0;const f=h.matrixWorldInverse;for(let m=0,y=d.length;m<y;m++){const x=d[m];if(x.isDirectionalLight){const M=r.directional[u];M.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(f),u++}else if(x.isSpotLight){const M=r.spot[v];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(f),M.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(f),v++}else if(x.isRectAreaLight){const M=r.rectArea[_];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(f),a.identity(),o.copy(x.matrixWorld),o.premultiply(f),a.extractRotation(o),M.halfWidth.set(x.width*.5,0,0),M.halfHeight.set(0,x.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),_++}else if(x.isPointLight){const M=r.point[p];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(f),p++}else if(x.isHemisphereLight){const M=r.hemi[g];M.direction.setFromMatrixPosition(x.matrixWorld),M.direction.transformDirection(f),g++}}}return{setup:l,setupView:c,state:r}}function Lm(n,e){const t=new RR(n,e),i=[],r=[];function s(){i.length=0,r.length=0}function o(h){i.push(h)}function a(h){r.push(h)}function l(h){t.setup(i,h)}function c(h){t.setupView(i,h)}return{init:s,state:{lightsArray:i,shadowsArray:r,lights:t},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function CR(n,e){let t=new WeakMap;function i(s,o=0){const a=t.get(s);let l;return a===void 0?(l=new Lm(n,e),t.set(s,[l])):o>=a.length?(l=new Lm(n,e),a.push(l)):l=a[o],l}function r(){t=new WeakMap}return{get:i,dispose:r}}class bR extends fa{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=FE,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class LR extends fa{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const PR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,DR=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function IR(n,e,t){let i=new b0;const r=new it,s=new it,o=new Nt,a=new bR({depthPacking:zE}),l=new LR,c={},d=t.maxTextureSize,h={[cr]:ln,[ln]:cr,[Ri]:Ri},u=new Xr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new it},radius:{value:4}},vertexShader:PR,fragmentShader:DR}),p=u.clone();p.defines.HORIZONTAL_PASS=1;const v=new _n;v.setAttribute("position",new Zn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new gn(v,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=c0;let f=this.type;this.render=function(M,w,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||M.length===0)return;const D=n.getRenderTarget(),E=n.getActiveCubeFace(),T=n.getActiveMipmapLevel(),V=n.state;V.setBlending(or),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const O=f!==wi&&this.type===wi,C=f===wi&&this.type!==wi;for(let P=0,N=M.length;P<N;P++){const U=M[P],X=U.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",U,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;r.copy(X.mapSize);const I=X.getFrameExtents();if(r.multiply(I),s.copy(X.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/I.x),r.x=s.x*I.x,X.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/I.y),r.y=s.y*I.y,X.mapSize.y=s.y)),X.map===null||O===!0||C===!0){const W=this.type!==wi?{minFilter:Yt,magFilter:Yt}:{};X.map!==null&&X.map.dispose(),X.map=new Vr(r.x,r.y,W),X.map.texture.name=U.name+".shadowMap",X.camera.updateProjectionMatrix()}n.setRenderTarget(X.map),n.clear();const B=X.getViewportCount();for(let W=0;W<B;W++){const ee=X.getViewport(W);o.set(s.x*ee.x,s.y*ee.y,s.x*ee.z,s.y*ee.w),V.viewport(o),X.updateMatrices(U,W),i=X.getFrustum(),x(w,R,X.camera,U,this.type)}X.isPointLightShadow!==!0&&this.type===wi&&m(X,R),X.needsUpdate=!1}f=this.type,g.needsUpdate=!1,n.setRenderTarget(D,E,T)};function m(M,w){const R=e.update(_);u.defines.VSM_SAMPLES!==M.blurSamples&&(u.defines.VSM_SAMPLES=M.blurSamples,p.defines.VSM_SAMPLES=M.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new Vr(r.x,r.y)),u.uniforms.shadow_pass.value=M.map.texture,u.uniforms.resolution.value=M.mapSize,u.uniforms.radius.value=M.radius,n.setRenderTarget(M.mapPass),n.clear(),n.renderBufferDirect(w,null,R,u,_,null),p.uniforms.shadow_pass.value=M.mapPass.texture,p.uniforms.resolution.value=M.mapSize,p.uniforms.radius.value=M.radius,n.setRenderTarget(M.map),n.clear(),n.renderBufferDirect(w,null,R,p,_,null)}function y(M,w,R,D){let E=null;const T=R.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(T!==void 0)E=T;else if(E=R.isPointLight===!0?l:a,n.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const V=E.uuid,O=w.uuid;let C=c[V];C===void 0&&(C={},c[V]=C);let P=C[O];P===void 0&&(P=E.clone(),C[O]=P),E=P}if(E.visible=w.visible,E.wireframe=w.wireframe,D===wi?E.side=w.shadowSide!==null?w.shadowSide:w.side:E.side=w.shadowSide!==null?w.shadowSide:h[w.side],E.alphaMap=w.alphaMap,E.alphaTest=w.alphaTest,E.map=w.map,E.clipShadows=w.clipShadows,E.clippingPlanes=w.clippingPlanes,E.clipIntersection=w.clipIntersection,E.displacementMap=w.displacementMap,E.displacementScale=w.displacementScale,E.displacementBias=w.displacementBias,E.wireframeLinewidth=w.wireframeLinewidth,E.linewidth=w.linewidth,R.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const V=n.properties.get(E);V.light=R}return E}function x(M,w,R,D,E){if(M.visible===!1)return;if(M.layers.test(w.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&E===wi)&&(!M.frustumCulled||i.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,M.matrixWorld);const O=e.update(M),C=M.material;if(Array.isArray(C)){const P=O.groups;for(let N=0,U=P.length;N<U;N++){const X=P[N],I=C[X.materialIndex];if(I&&I.visible){const B=y(M,I,D,E);n.renderBufferDirect(R,null,O,B,M,X)}}}else if(C.visible){const P=y(M,C,D,E);n.renderBufferDirect(R,null,O,P,M,null)}}const V=M.children;for(let O=0,C=V.length;O<C;O++)x(V[O],w,R,D,E)}}function NR(n,e,t){const i=t.isWebGL2;function r(){let z=!1;const K=new Nt;let te=null;const ue=new Nt(0,0,0,0);return{setMask:function(ve){te!==ve&&!z&&(n.colorMask(ve,ve,ve,ve),te=ve)},setLocked:function(ve){z=ve},setClear:function(ve,Ke,Ze,zt,zi){zi===!0&&(ve*=zt,Ke*=zt,Ze*=zt),K.set(ve,Ke,Ze,zt),ue.equals(K)===!1&&(n.clearColor(ve,Ke,Ze,zt),ue.copy(K))},reset:function(){z=!1,te=null,ue.set(-1,0,0,0)}}}function s(){let z=!1,K=null,te=null,ue=null;return{setTest:function(ve){ve?F(n.DEPTH_TEST):Ee(n.DEPTH_TEST)},setMask:function(ve){K!==ve&&!z&&(n.depthMask(ve),K=ve)},setFunc:function(ve){if(te!==ve){switch(ve){case oE:n.depthFunc(n.NEVER);break;case aE:n.depthFunc(n.ALWAYS);break;case lE:n.depthFunc(n.LESS);break;case Cd:n.depthFunc(n.LEQUAL);break;case cE:n.depthFunc(n.EQUAL);break;case uE:n.depthFunc(n.GEQUAL);break;case dE:n.depthFunc(n.GREATER);break;case fE:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}te=ve}},setLocked:function(ve){z=ve},setClear:function(ve){ue!==ve&&(n.clearDepth(ve),ue=ve)},reset:function(){z=!1,K=null,te=null,ue=null}}}function o(){let z=!1,K=null,te=null,ue=null,ve=null,Ke=null,Ze=null,zt=null,zi=null;return{setTest:function(mt){z||(mt?F(n.STENCIL_TEST):Ee(n.STENCIL_TEST))},setMask:function(mt){K!==mt&&!z&&(n.stencilMask(mt),K=mt)},setFunc:function(mt,Tn,Jn){(te!==mt||ue!==Tn||ve!==Jn)&&(n.stencilFunc(mt,Tn,Jn),te=mt,ue=Tn,ve=Jn)},setOp:function(mt,Tn,Jn){(Ke!==mt||Ze!==Tn||zt!==Jn)&&(n.stencilOp(mt,Tn,Jn),Ke=mt,Ze=Tn,zt=Jn)},setLocked:function(mt){z=mt},setClear:function(mt){zi!==mt&&(n.clearStencil(mt),zi=mt)},reset:function(){z=!1,K=null,te=null,ue=null,ve=null,Ke=null,Ze=null,zt=null,zi=null}}}const a=new r,l=new s,c=new o,d=new WeakMap,h=new WeakMap;let u={},p={},v=new WeakMap,_=[],g=null,f=!1,m=null,y=null,x=null,M=null,w=null,R=null,D=null,E=!1,T=null,V=null,O=null,C=null,P=null;const N=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let U=!1,X=0;const I=n.getParameter(n.VERSION);I.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(I)[1]),U=X>=1):I.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(I)[1]),U=X>=2);let B=null,W={};const ee=n.getParameter(n.SCISSOR_BOX),q=n.getParameter(n.VIEWPORT),H=new Nt().fromArray(ee),Y=new Nt().fromArray(q);function re(z,K,te,ue){const ve=new Uint8Array(4),Ke=n.createTexture();n.bindTexture(z,Ke),n.texParameteri(z,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(z,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ze=0;Ze<te;Ze++)i&&(z===n.TEXTURE_3D||z===n.TEXTURE_2D_ARRAY)?n.texImage3D(K,0,n.RGBA,1,1,ue,0,n.RGBA,n.UNSIGNED_BYTE,ve):n.texImage2D(K+Ze,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ve);return Ke}const oe={};oe[n.TEXTURE_2D]=re(n.TEXTURE_2D,n.TEXTURE_2D,1),oe[n.TEXTURE_CUBE_MAP]=re(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(oe[n.TEXTURE_2D_ARRAY]=re(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),oe[n.TEXTURE_3D]=re(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),F(n.DEPTH_TEST),l.setFunc(Cd),yt(!1),ht(mp),F(n.CULL_FACE),Le(or);function F(z){u[z]!==!0&&(n.enable(z),u[z]=!0)}function Ee(z){u[z]!==!1&&(n.disable(z),u[z]=!1)}function we(z,K){return p[z]!==K?(n.bindFramebuffer(z,K),p[z]=K,i&&(z===n.DRAW_FRAMEBUFFER&&(p[n.FRAMEBUFFER]=K),z===n.FRAMEBUFFER&&(p[n.DRAW_FRAMEBUFFER]=K)),!0):!1}function ae(z,K){let te=_,ue=!1;if(z)if(te=v.get(K),te===void 0&&(te=[],v.set(K,te)),z.isWebGLMultipleRenderTargets){const ve=z.texture;if(te.length!==ve.length||te[0]!==n.COLOR_ATTACHMENT0){for(let Ke=0,Ze=ve.length;Ke<Ze;Ke++)te[Ke]=n.COLOR_ATTACHMENT0+Ke;te.length=ve.length,ue=!0}}else te[0]!==n.COLOR_ATTACHMENT0&&(te[0]=n.COLOR_ATTACHMENT0,ue=!0);else te[0]!==n.BACK&&(te[0]=n.BACK,ue=!0);ue&&(t.isWebGL2?n.drawBuffers(te):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(te))}function xe(z){return g!==z?(n.useProgram(z),g=z,!0):!1}const We={[ms]:n.FUNC_ADD,[$M]:n.FUNC_SUBTRACT,[KM]:n.FUNC_REVERSE_SUBTRACT};if(i)We[yp]=n.MIN,We[xp]=n.MAX;else{const z=e.get("EXT_blend_minmax");z!==null&&(We[yp]=z.MIN_EXT,We[xp]=z.MAX_EXT)}const ge={[ZM]:n.ZERO,[QM]:n.ONE,[JM]:n.SRC_COLOR,[u0]:n.SRC_ALPHA,[sE]:n.SRC_ALPHA_SATURATE,[iE]:n.DST_COLOR,[tE]:n.DST_ALPHA,[eE]:n.ONE_MINUS_SRC_COLOR,[d0]:n.ONE_MINUS_SRC_ALPHA,[rE]:n.ONE_MINUS_DST_COLOR,[nE]:n.ONE_MINUS_DST_ALPHA};function Le(z,K,te,ue,ve,Ke,Ze,zt){if(z===or){f===!0&&(Ee(n.BLEND),f=!1);return}if(f===!1&&(F(n.BLEND),f=!0),z!==YM){if(z!==m||zt!==E){if((y!==ms||w!==ms)&&(n.blendEquation(n.FUNC_ADD),y=ms,w=ms),zt)switch(z){case Us:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case gp:n.blendFunc(n.ONE,n.ONE);break;case vp:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case _p:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case Us:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case gp:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case vp:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case _p:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}x=null,M=null,R=null,D=null,m=z,E=zt}return}ve=ve||K,Ke=Ke||te,Ze=Ze||ue,(K!==y||ve!==w)&&(n.blendEquationSeparate(We[K],We[ve]),y=K,w=ve),(te!==x||ue!==M||Ke!==R||Ze!==D)&&(n.blendFuncSeparate(ge[te],ge[ue],ge[Ke],ge[Ze]),x=te,M=ue,R=Ke,D=Ze),m=z,E=!1}function lt(z,K){z.side===Ri?Ee(n.CULL_FACE):F(n.CULL_FACE);let te=z.side===ln;K&&(te=!te),yt(te),z.blending===Us&&z.transparent===!1?Le(or):Le(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.premultipliedAlpha),l.setFunc(z.depthFunc),l.setTest(z.depthTest),l.setMask(z.depthWrite),a.setMask(z.colorWrite);const ue=z.stencilWrite;c.setTest(ue),ue&&(c.setMask(z.stencilWriteMask),c.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),c.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),Ve(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?F(n.SAMPLE_ALPHA_TO_COVERAGE):Ee(n.SAMPLE_ALPHA_TO_COVERAGE)}function yt(z){T!==z&&(z?n.frontFace(n.CW):n.frontFace(n.CCW),T=z)}function ht(z){z!==XM?(F(n.CULL_FACE),z!==V&&(z===mp?n.cullFace(n.BACK):z===qM?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ee(n.CULL_FACE),V=z}function ct(z){z!==O&&(U&&n.lineWidth(z),O=z)}function Ve(z,K,te){z?(F(n.POLYGON_OFFSET_FILL),(C!==K||P!==te)&&(n.polygonOffset(K,te),C=K,P=te)):Ee(n.POLYGON_OFFSET_FILL)}function Re(z){z?F(n.SCISSOR_TEST):Ee(n.SCISSOR_TEST)}function Xe(z){z===void 0&&(z=n.TEXTURE0+N-1),B!==z&&(n.activeTexture(z),B=z)}function L(z,K,te){te===void 0&&(B===null?te=n.TEXTURE0+N-1:te=B);let ue=W[te];ue===void 0&&(ue={type:void 0,texture:void 0},W[te]=ue),(ue.type!==z||ue.texture!==K)&&(B!==te&&(n.activeTexture(te),B=te),n.bindTexture(z,K||oe[z]),ue.type=z,ue.texture=K)}function A(){const z=W[B];z!==void 0&&z.type!==void 0&&(n.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function $(){try{n.compressedTexImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ie(){try{n.compressedTexImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function se(){try{n.texSubImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ce(){try{n.texSubImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ce(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function me(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Q(){try{n.texStorage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function _e(){try{n.texStorage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Se(){try{n.texImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Te(){try{n.texImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function pe(z){H.equals(z)===!1&&(n.scissor(z.x,z.y,z.z,z.w),H.copy(z))}function ye(z){Y.equals(z)===!1&&(n.viewport(z.x,z.y,z.z,z.w),Y.copy(z))}function ke(z,K){let te=h.get(K);te===void 0&&(te=new WeakMap,h.set(K,te));let ue=te.get(z);ue===void 0&&(ue=n.getUniformBlockIndex(K,z.name),te.set(z,ue))}function Ye(z,K){const ue=h.get(K).get(z);d.get(K)!==ue&&(n.uniformBlockBinding(K,ue,z.__bindingPointIndex),d.set(K,ue))}function pt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},B=null,W={},p={},v=new WeakMap,_=[],g=null,f=!1,m=null,y=null,x=null,M=null,w=null,R=null,D=null,E=!1,T=null,V=null,O=null,C=null,P=null,H.set(0,0,n.canvas.width,n.canvas.height),Y.set(0,0,n.canvas.width,n.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:F,disable:Ee,bindFramebuffer:we,drawBuffers:ae,useProgram:xe,setBlending:Le,setMaterial:lt,setFlipSided:yt,setCullFace:ht,setLineWidth:ct,setPolygonOffset:Ve,setScissorTest:Re,activeTexture:Xe,bindTexture:L,unbindTexture:A,compressedTexImage2D:$,compressedTexImage3D:ie,texImage2D:Se,texImage3D:Te,updateUBOMapping:ke,uniformBlockBinding:Ye,texStorage2D:Q,texStorage3D:_e,texSubImage2D:se,texSubImage3D:ce,compressedTexSubImage2D:Ce,compressedTexSubImage3D:me,scissor:pe,viewport:ye,reset:pt}}function UR(n,e,t,i,r,s,o){const a=r.isWebGL2,l=r.maxTextures,c=r.maxCubemapSize,d=r.maxTextureSize,h=r.maxSamples,u=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),v=new WeakMap;let _;const g=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(L,A){return f?new OffscreenCanvas(L,A):$l("canvas")}function y(L,A,$,ie){let se=1;if((L.width>ie||L.height>ie)&&(se=ie/Math.max(L.width,L.height)),se<1||A===!0)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap){const ce=A?GE:Math.floor,Ce=ce(se*L.width),me=ce(se*L.height);_===void 0&&(_=m(Ce,me));const Q=$?m(Ce,me):_;return Q.width=Ce,Q.height=me,Q.getContext("2d").drawImage(L,0,0,Ce,me),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+L.width+"x"+L.height+") to ("+Ce+"x"+me+")."),Q}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+L.width+"x"+L.height+")."),L;return L}function x(L){return jp(L.width)&&jp(L.height)}function M(L){return a?!1:L.wrapS!==qn||L.wrapT!==qn||L.minFilter!==Yt&&L.minFilter!==bn}function w(L,A){return L.generateMipmaps&&A&&L.minFilter!==Yt&&L.minFilter!==bn}function R(L){n.generateMipmap(L)}function D(L,A,$,ie,se=!1){if(a===!1)return A;if(L!==null){if(n[L]!==void 0)return n[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let ce=A;return A===n.RED&&($===n.FLOAT&&(ce=n.R32F),$===n.HALF_FLOAT&&(ce=n.R16F),$===n.UNSIGNED_BYTE&&(ce=n.R8)),A===n.RG&&($===n.FLOAT&&(ce=n.RG32F),$===n.HALF_FLOAT&&(ce=n.RG16F),$===n.UNSIGNED_BYTE&&(ce=n.RG8)),A===n.RGBA&&($===n.FLOAT&&(ce=n.RGBA32F),$===n.HALF_FLOAT&&(ce=n.RGBA16F),$===n.UNSIGNED_BYTE&&(ce=ie===Pe&&se===!1?n.SRGB8_ALPHA8:n.RGBA8),$===n.UNSIGNED_SHORT_4_4_4_4&&(ce=n.RGBA4),$===n.UNSIGNED_SHORT_5_5_5_1&&(ce=n.RGB5_A1)),(ce===n.R16F||ce===n.R32F||ce===n.RG16F||ce===n.RG32F||ce===n.RGBA16F||ce===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ce}function E(L,A,$){return w(L,$)===!0||L.isFramebufferTexture&&L.minFilter!==Yt&&L.minFilter!==bn?Math.log2(Math.max(A.width,A.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?A.mipmaps.length:1}function T(L){return L===Yt||L===Sp||L===eu?n.NEAREST:n.LINEAR}function V(L){const A=L.target;A.removeEventListener("dispose",V),C(A),A.isVideoTexture&&v.delete(A)}function O(L){const A=L.target;A.removeEventListener("dispose",O),N(A)}function C(L){const A=i.get(L);if(A.__webglInit===void 0)return;const $=L.source,ie=g.get($);if(ie){const se=ie[A.__cacheKey];se.usedTimes--,se.usedTimes===0&&P(L),Object.keys(ie).length===0&&g.delete($)}i.remove(L)}function P(L){const A=i.get(L);n.deleteTexture(A.__webglTexture);const $=L.source,ie=g.get($);delete ie[A.__cacheKey],o.memory.textures--}function N(L){const A=L.texture,$=i.get(L),ie=i.get(A);if(ie.__webglTexture!==void 0&&(n.deleteTexture(ie.__webglTexture),o.memory.textures--),L.depthTexture&&L.depthTexture.dispose(),L.isWebGLCubeRenderTarget)for(let se=0;se<6;se++)n.deleteFramebuffer($.__webglFramebuffer[se]),$.__webglDepthbuffer&&n.deleteRenderbuffer($.__webglDepthbuffer[se]);else{if(n.deleteFramebuffer($.__webglFramebuffer),$.__webglDepthbuffer&&n.deleteRenderbuffer($.__webglDepthbuffer),$.__webglMultisampledFramebuffer&&n.deleteFramebuffer($.__webglMultisampledFramebuffer),$.__webglColorRenderbuffer)for(let se=0;se<$.__webglColorRenderbuffer.length;se++)$.__webglColorRenderbuffer[se]&&n.deleteRenderbuffer($.__webglColorRenderbuffer[se]);$.__webglDepthRenderbuffer&&n.deleteRenderbuffer($.__webglDepthRenderbuffer)}if(L.isWebGLMultipleRenderTargets)for(let se=0,ce=A.length;se<ce;se++){const Ce=i.get(A[se]);Ce.__webglTexture&&(n.deleteTexture(Ce.__webglTexture),o.memory.textures--),i.remove(A[se])}i.remove(A),i.remove(L)}let U=0;function X(){U=0}function I(){const L=U;return L>=l&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+l),U+=1,L}function B(L){const A=[];return A.push(L.wrapS),A.push(L.wrapT),A.push(L.wrapR||0),A.push(L.magFilter),A.push(L.minFilter),A.push(L.anisotropy),A.push(L.internalFormat),A.push(L.format),A.push(L.type),A.push(L.generateMipmaps),A.push(L.premultiplyAlpha),A.push(L.flipY),A.push(L.unpackAlignment),A.push(L.colorSpace),A.join()}function W(L,A){const $=i.get(L);if(L.isVideoTexture&&Re(L),L.isRenderTargetTexture===!1&&L.version>0&&$.__version!==L.version){const ie=L.image;if(ie===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ie.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ee($,L,A);return}}t.bindTexture(n.TEXTURE_2D,$.__webglTexture,n.TEXTURE0+A)}function ee(L,A){const $=i.get(L);if(L.version>0&&$.__version!==L.version){Ee($,L,A);return}t.bindTexture(n.TEXTURE_2D_ARRAY,$.__webglTexture,n.TEXTURE0+A)}function q(L,A){const $=i.get(L);if(L.version>0&&$.__version!==L.version){Ee($,L,A);return}t.bindTexture(n.TEXTURE_3D,$.__webglTexture,n.TEXTURE0+A)}function H(L,A){const $=i.get(L);if(L.version>0&&$.__version!==L.version){we($,L,A);return}t.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture,n.TEXTURE0+A)}const Y={[Pd]:n.REPEAT,[qn]:n.CLAMP_TO_EDGE,[Dd]:n.MIRRORED_REPEAT},re={[Yt]:n.NEAREST,[Sp]:n.NEAREST_MIPMAP_NEAREST,[eu]:n.NEAREST_MIPMAP_LINEAR,[bn]:n.LINEAR,[xE]:n.LINEAR_MIPMAP_NEAREST,[ea]:n.LINEAR_MIPMAP_LINEAR};function oe(L,A,$){if($?(n.texParameteri(L,n.TEXTURE_WRAP_S,Y[A.wrapS]),n.texParameteri(L,n.TEXTURE_WRAP_T,Y[A.wrapT]),(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)&&n.texParameteri(L,n.TEXTURE_WRAP_R,Y[A.wrapR]),n.texParameteri(L,n.TEXTURE_MAG_FILTER,re[A.magFilter]),n.texParameteri(L,n.TEXTURE_MIN_FILTER,re[A.minFilter])):(n.texParameteri(L,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(L,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)&&n.texParameteri(L,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(A.wrapS!==qn||A.wrapT!==qn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(L,n.TEXTURE_MAG_FILTER,T(A.magFilter)),n.texParameteri(L,n.TEXTURE_MIN_FILTER,T(A.minFilter)),A.minFilter!==Yt&&A.minFilter!==bn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),e.has("EXT_texture_filter_anisotropic")===!0){const ie=e.get("EXT_texture_filter_anisotropic");if(A.magFilter===Yt||A.minFilter!==eu&&A.minFilter!==ea||A.type===Pr&&e.has("OES_texture_float_linear")===!1||a===!1&&A.type===ta&&e.has("OES_texture_half_float_linear")===!1)return;(A.anisotropy>1||i.get(A).__currentAnisotropy)&&(n.texParameterf(L,ie.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,r.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy)}}function F(L,A){let $=!1;L.__webglInit===void 0&&(L.__webglInit=!0,A.addEventListener("dispose",V));const ie=A.source;let se=g.get(ie);se===void 0&&(se={},g.set(ie,se));const ce=B(A);if(ce!==L.__cacheKey){se[ce]===void 0&&(se[ce]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,$=!0),se[ce].usedTimes++;const Ce=se[L.__cacheKey];Ce!==void 0&&(se[L.__cacheKey].usedTimes--,Ce.usedTimes===0&&P(A)),L.__cacheKey=ce,L.__webglTexture=se[ce].texture}return $}function Ee(L,A,$){let ie=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ie=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ie=n.TEXTURE_3D);const se=F(L,A),ce=A.source;t.bindTexture(ie,L.__webglTexture,n.TEXTURE0+$);const Ce=i.get(ce);if(ce.version!==Ce.__version||se===!0){t.activeTexture(n.TEXTURE0+$),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.NONE);const me=M(A)&&x(A.image)===!1;let Q=y(A.image,me,!1,d);Q=Xe(A,Q);const _e=x(Q)||a,Se=s.convert(A.format,A.colorSpace);let Te=s.convert(A.type),pe=D(A.internalFormat,Se,Te,A.colorSpace);oe(ie,A,_e);let ye;const ke=A.mipmaps,Ye=a&&A.isVideoTexture!==!0,pt=Ce.__version===void 0||se===!0,z=E(A,Q,_e);if(A.isDepthTexture)pe=n.DEPTH_COMPONENT,a?A.type===Pr?pe=n.DEPTH_COMPONENT32F:A.type===Lr?pe=n.DEPTH_COMPONENT24:A.type===Fs?pe=n.DEPTH24_STENCIL8:pe=n.DEPTH_COMPONENT16:A.type===Pr&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),A.format===Nr&&pe===n.DEPTH_COMPONENT&&A.type!==p0&&A.type!==Lr&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),A.type=Lr,Te=s.convert(A.type)),A.format===js&&pe===n.DEPTH_COMPONENT&&(pe=n.DEPTH_STENCIL,A.type!==Fs&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),A.type=Fs,Te=s.convert(A.type))),pt&&(Ye?t.texStorage2D(n.TEXTURE_2D,1,pe,Q.width,Q.height):t.texImage2D(n.TEXTURE_2D,0,pe,Q.width,Q.height,0,Se,Te,null));else if(A.isDataTexture)if(ke.length>0&&_e){Ye&&pt&&t.texStorage2D(n.TEXTURE_2D,z,pe,ke[0].width,ke[0].height);for(let K=0,te=ke.length;K<te;K++)ye=ke[K],Ye?t.texSubImage2D(n.TEXTURE_2D,K,0,0,ye.width,ye.height,Se,Te,ye.data):t.texImage2D(n.TEXTURE_2D,K,pe,ye.width,ye.height,0,Se,Te,ye.data);A.generateMipmaps=!1}else Ye?(pt&&t.texStorage2D(n.TEXTURE_2D,z,pe,Q.width,Q.height),t.texSubImage2D(n.TEXTURE_2D,0,0,0,Q.width,Q.height,Se,Te,Q.data)):t.texImage2D(n.TEXTURE_2D,0,pe,Q.width,Q.height,0,Se,Te,Q.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Ye&&pt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,z,pe,ke[0].width,ke[0].height,Q.depth);for(let K=0,te=ke.length;K<te;K++)ye=ke[K],A.format!==jn?Se!==null?Ye?t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,ye.width,ye.height,Q.depth,Se,ye.data,0,0):t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,K,pe,ye.width,ye.height,Q.depth,0,ye.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ye?t.texSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,ye.width,ye.height,Q.depth,Se,Te,ye.data):t.texImage3D(n.TEXTURE_2D_ARRAY,K,pe,ye.width,ye.height,Q.depth,0,Se,Te,ye.data)}else{Ye&&pt&&t.texStorage2D(n.TEXTURE_2D,z,pe,ke[0].width,ke[0].height);for(let K=0,te=ke.length;K<te;K++)ye=ke[K],A.format!==jn?Se!==null?Ye?t.compressedTexSubImage2D(n.TEXTURE_2D,K,0,0,ye.width,ye.height,Se,ye.data):t.compressedTexImage2D(n.TEXTURE_2D,K,pe,ye.width,ye.height,0,ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ye?t.texSubImage2D(n.TEXTURE_2D,K,0,0,ye.width,ye.height,Se,Te,ye.data):t.texImage2D(n.TEXTURE_2D,K,pe,ye.width,ye.height,0,Se,Te,ye.data)}else if(A.isDataArrayTexture)Ye?(pt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,z,pe,Q.width,Q.height,Q.depth),t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,Se,Te,Q.data)):t.texImage3D(n.TEXTURE_2D_ARRAY,0,pe,Q.width,Q.height,Q.depth,0,Se,Te,Q.data);else if(A.isData3DTexture)Ye?(pt&&t.texStorage3D(n.TEXTURE_3D,z,pe,Q.width,Q.height,Q.depth),t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,Se,Te,Q.data)):t.texImage3D(n.TEXTURE_3D,0,pe,Q.width,Q.height,Q.depth,0,Se,Te,Q.data);else if(A.isFramebufferTexture){if(pt)if(Ye)t.texStorage2D(n.TEXTURE_2D,z,pe,Q.width,Q.height);else{let K=Q.width,te=Q.height;for(let ue=0;ue<z;ue++)t.texImage2D(n.TEXTURE_2D,ue,pe,K,te,0,Se,Te,null),K>>=1,te>>=1}}else if(ke.length>0&&_e){Ye&&pt&&t.texStorage2D(n.TEXTURE_2D,z,pe,ke[0].width,ke[0].height);for(let K=0,te=ke.length;K<te;K++)ye=ke[K],Ye?t.texSubImage2D(n.TEXTURE_2D,K,0,0,Se,Te,ye):t.texImage2D(n.TEXTURE_2D,K,pe,Se,Te,ye);A.generateMipmaps=!1}else Ye?(pt&&t.texStorage2D(n.TEXTURE_2D,z,pe,Q.width,Q.height),t.texSubImage2D(n.TEXTURE_2D,0,0,0,Se,Te,Q)):t.texImage2D(n.TEXTURE_2D,0,pe,Se,Te,Q);w(A,_e)&&R(ie),Ce.__version=ce.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version}function we(L,A,$){if(A.image.length!==6)return;const ie=F(L,A),se=A.source;t.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+$);const ce=i.get(se);if(se.version!==ce.__version||ie===!0){t.activeTexture(n.TEXTURE0+$),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.NONE);const Ce=A.isCompressedTexture||A.image[0].isCompressedTexture,me=A.image[0]&&A.image[0].isDataTexture,Q=[];for(let K=0;K<6;K++)!Ce&&!me?Q[K]=y(A.image[K],!1,!0,c):Q[K]=me?A.image[K].image:A.image[K],Q[K]=Xe(A,Q[K]);const _e=Q[0],Se=x(_e)||a,Te=s.convert(A.format,A.colorSpace),pe=s.convert(A.type),ye=D(A.internalFormat,Te,pe,A.colorSpace),ke=a&&A.isVideoTexture!==!0,Ye=ce.__version===void 0||ie===!0;let pt=E(A,_e,Se);oe(n.TEXTURE_CUBE_MAP,A,Se);let z;if(Ce){ke&&Ye&&t.texStorage2D(n.TEXTURE_CUBE_MAP,pt,ye,_e.width,_e.height);for(let K=0;K<6;K++){z=Q[K].mipmaps;for(let te=0;te<z.length;te++){const ue=z[te];A.format!==jn?Te!==null?ke?t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,te,0,0,ue.width,ue.height,Te,ue.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,te,ye,ue.width,ue.height,0,ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ke?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,te,0,0,ue.width,ue.height,Te,pe,ue.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,te,ye,ue.width,ue.height,0,Te,pe,ue.data)}}}else{z=A.mipmaps,ke&&Ye&&(z.length>0&&pt++,t.texStorage2D(n.TEXTURE_CUBE_MAP,pt,ye,Q[0].width,Q[0].height));for(let K=0;K<6;K++)if(me){ke?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Q[K].width,Q[K].height,Te,pe,Q[K].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,ye,Q[K].width,Q[K].height,0,Te,pe,Q[K].data);for(let te=0;te<z.length;te++){const ve=z[te].image[K].image;ke?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,te+1,0,0,ve.width,ve.height,Te,pe,ve.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,te+1,ye,ve.width,ve.height,0,Te,pe,ve.data)}}else{ke?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Te,pe,Q[K]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,ye,Te,pe,Q[K]);for(let te=0;te<z.length;te++){const ue=z[te];ke?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,te+1,0,0,Te,pe,ue.image[K]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,te+1,ye,Te,pe,ue.image[K])}}}w(A,Se)&&R(n.TEXTURE_CUBE_MAP),ce.__version=se.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version}function ae(L,A,$,ie,se){const ce=s.convert($.format,$.colorSpace),Ce=s.convert($.type),me=D($.internalFormat,ce,Ce,$.colorSpace);i.get(A).__hasExternalTextures||(se===n.TEXTURE_3D||se===n.TEXTURE_2D_ARRAY?t.texImage3D(se,0,me,A.width,A.height,A.depth,0,ce,Ce,null):t.texImage2D(se,0,me,A.width,A.height,0,ce,Ce,null)),t.bindFramebuffer(n.FRAMEBUFFER,L),Ve(A)?u.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ie,se,i.get($).__webglTexture,0,ct(A)):(se===n.TEXTURE_2D||se>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&se<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ie,se,i.get($).__webglTexture,0),t.bindFramebuffer(n.FRAMEBUFFER,null)}function xe(L,A,$){if(n.bindRenderbuffer(n.RENDERBUFFER,L),A.depthBuffer&&!A.stencilBuffer){let ie=n.DEPTH_COMPONENT16;if($||Ve(A)){const se=A.depthTexture;se&&se.isDepthTexture&&(se.type===Pr?ie=n.DEPTH_COMPONENT32F:se.type===Lr&&(ie=n.DEPTH_COMPONENT24));const ce=ct(A);Ve(A)?u.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ce,ie,A.width,A.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,ce,ie,A.width,A.height)}else n.renderbufferStorage(n.RENDERBUFFER,ie,A.width,A.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,L)}else if(A.depthBuffer&&A.stencilBuffer){const ie=ct(A);$&&Ve(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,ie,n.DEPTH24_STENCIL8,A.width,A.height):Ve(A)?u.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ie,n.DEPTH24_STENCIL8,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,L)}else{const ie=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let se=0;se<ie.length;se++){const ce=ie[se],Ce=s.convert(ce.format,ce.colorSpace),me=s.convert(ce.type),Q=D(ce.internalFormat,Ce,me,ce.colorSpace),_e=ct(A);$&&Ve(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,_e,Q,A.width,A.height):Ve(A)?u.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,_e,Q,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,Q,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function We(L,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,L),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(A.depthTexture).__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),W(A.depthTexture,0);const ie=i.get(A.depthTexture).__webglTexture,se=ct(A);if(A.depthTexture.format===Nr)Ve(A)?u.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ie,0,se):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ie,0);else if(A.depthTexture.format===js)Ve(A)?u.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ie,0,se):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ie,0);else throw new Error("Unknown depthTexture format")}function ge(L){const A=i.get(L),$=L.isWebGLCubeRenderTarget===!0;if(L.depthTexture&&!A.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");We(A.__webglFramebuffer,L)}else if($){A.__webglDepthbuffer=[];for(let ie=0;ie<6;ie++)t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[ie]),A.__webglDepthbuffer[ie]=n.createRenderbuffer(),xe(A.__webglDepthbuffer[ie],L,!1)}else t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer=n.createRenderbuffer(),xe(A.__webglDepthbuffer,L,!1);t.bindFramebuffer(n.FRAMEBUFFER,null)}function Le(L,A,$){const ie=i.get(L);A!==void 0&&ae(ie.__webglFramebuffer,L,L.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D),$!==void 0&&ge(L)}function lt(L){const A=L.texture,$=i.get(L),ie=i.get(A);L.addEventListener("dispose",O),L.isWebGLMultipleRenderTargets!==!0&&(ie.__webglTexture===void 0&&(ie.__webglTexture=n.createTexture()),ie.__version=A.version,o.memory.textures++);const se=L.isWebGLCubeRenderTarget===!0,ce=L.isWebGLMultipleRenderTargets===!0,Ce=x(L)||a;if(se){$.__webglFramebuffer=[];for(let me=0;me<6;me++)$.__webglFramebuffer[me]=n.createFramebuffer()}else{if($.__webglFramebuffer=n.createFramebuffer(),ce)if(r.drawBuffers){const me=L.texture;for(let Q=0,_e=me.length;Q<_e;Q++){const Se=i.get(me[Q]);Se.__webglTexture===void 0&&(Se.__webglTexture=n.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&L.samples>0&&Ve(L)===!1){const me=ce?A:[A];$.__webglMultisampledFramebuffer=n.createFramebuffer(),$.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let Q=0;Q<me.length;Q++){const _e=me[Q];$.__webglColorRenderbuffer[Q]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,$.__webglColorRenderbuffer[Q]);const Se=s.convert(_e.format,_e.colorSpace),Te=s.convert(_e.type),pe=D(_e.internalFormat,Se,Te,_e.colorSpace,L.isXRRenderTarget===!0),ye=ct(L);n.renderbufferStorageMultisample(n.RENDERBUFFER,ye,pe,L.width,L.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Q,n.RENDERBUFFER,$.__webglColorRenderbuffer[Q])}n.bindRenderbuffer(n.RENDERBUFFER,null),L.depthBuffer&&($.__webglDepthRenderbuffer=n.createRenderbuffer(),xe($.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(se){t.bindTexture(n.TEXTURE_CUBE_MAP,ie.__webglTexture),oe(n.TEXTURE_CUBE_MAP,A,Ce);for(let me=0;me<6;me++)ae($.__webglFramebuffer[me],L,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+me);w(A,Ce)&&R(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ce){const me=L.texture;for(let Q=0,_e=me.length;Q<_e;Q++){const Se=me[Q],Te=i.get(Se);t.bindTexture(n.TEXTURE_2D,Te.__webglTexture),oe(n.TEXTURE_2D,Se,Ce),ae($.__webglFramebuffer,L,Se,n.COLOR_ATTACHMENT0+Q,n.TEXTURE_2D),w(Se,Ce)&&R(n.TEXTURE_2D)}t.unbindTexture()}else{let me=n.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(a?me=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(me,ie.__webglTexture),oe(me,A,Ce),ae($.__webglFramebuffer,L,A,n.COLOR_ATTACHMENT0,me),w(A,Ce)&&R(me),t.unbindTexture()}L.depthBuffer&&ge(L)}function yt(L){const A=x(L)||a,$=L.isWebGLMultipleRenderTargets===!0?L.texture:[L.texture];for(let ie=0,se=$.length;ie<se;ie++){const ce=$[ie];if(w(ce,A)){const Ce=L.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,me=i.get(ce).__webglTexture;t.bindTexture(Ce,me),R(Ce),t.unbindTexture()}}}function ht(L){if(a&&L.samples>0&&Ve(L)===!1){const A=L.isWebGLMultipleRenderTargets?L.texture:[L.texture],$=L.width,ie=L.height;let se=n.COLOR_BUFFER_BIT;const ce=[],Ce=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,me=i.get(L),Q=L.isWebGLMultipleRenderTargets===!0;if(Q)for(let _e=0;_e<A.length;_e++)t.bindFramebuffer(n.FRAMEBUFFER,me.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,me.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,me.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,me.__webglFramebuffer);for(let _e=0;_e<A.length;_e++){ce.push(n.COLOR_ATTACHMENT0+_e),L.depthBuffer&&ce.push(Ce);const Se=me.__ignoreDepthValues!==void 0?me.__ignoreDepthValues:!1;if(Se===!1&&(L.depthBuffer&&(se|=n.DEPTH_BUFFER_BIT),L.stencilBuffer&&(se|=n.STENCIL_BUFFER_BIT)),Q&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,me.__webglColorRenderbuffer[_e]),Se===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[Ce]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[Ce])),Q){const Te=i.get(A[_e]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Te,0)}n.blitFramebuffer(0,0,$,ie,0,0,$,ie,se,n.NEAREST),p&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ce)}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Q)for(let _e=0;_e<A.length;_e++){t.bindFramebuffer(n.FRAMEBUFFER,me.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,me.__webglColorRenderbuffer[_e]);const Se=i.get(A[_e]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,me.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,Se,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,me.__webglMultisampledFramebuffer)}}function ct(L){return Math.min(h,L.samples)}function Ve(L){const A=i.get(L);return a&&L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Re(L){const A=o.render.frame;v.get(L)!==A&&(v.set(L,A),L.update())}function Xe(L,A){const $=L.colorSpace,ie=L.format,se=L.type;return L.isCompressedTexture===!0||L.format===Id||$!==fi&&$!==Fr&&($===Pe?a===!1?e.has("EXT_sRGB")===!0&&ie===jn?(L.format=Id,L.minFilter=bn,L.generateMipmaps=!1):A=_0.sRGBToLinear(A):(ie!==jn||se!==Gr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),A}this.allocateTextureUnit=I,this.resetTextureUnits=X,this.setTexture2D=W,this.setTexture2DArray=ee,this.setTexture3D=q,this.setTextureCube=H,this.rebindTextures=Le,this.setupRenderTarget=lt,this.updateRenderTargetMipmap=yt,this.updateMultisampleRenderTarget=ht,this.setupDepthRenderbuffer=ge,this.setupFrameBufferTexture=ae,this.useMultisampledRTT=Ve}function FR(n,e,t){const i=t.isWebGL2;function r(s,o=Fr){let a;if(s===Gr)return n.UNSIGNED_BYTE;if(s===wE)return n.UNSIGNED_SHORT_4_4_4_4;if(s===TE)return n.UNSIGNED_SHORT_5_5_5_1;if(s===SE)return n.BYTE;if(s===ME)return n.SHORT;if(s===p0)return n.UNSIGNED_SHORT;if(s===EE)return n.INT;if(s===Lr)return n.UNSIGNED_INT;if(s===Pr)return n.FLOAT;if(s===ta)return i?n.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(s===AE)return n.ALPHA;if(s===jn)return n.RGBA;if(s===RE)return n.LUMINANCE;if(s===CE)return n.LUMINANCE_ALPHA;if(s===Nr)return n.DEPTH_COMPONENT;if(s===js)return n.DEPTH_STENCIL;if(s===Id)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(s===bE)return n.RED;if(s===LE)return n.RED_INTEGER;if(s===PE)return n.RG;if(s===DE)return n.RG_INTEGER;if(s===IE)return n.RGBA_INTEGER;if(s===tu||s===nu||s===iu||s===ru)if(o===Pe)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(s===tu)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===nu)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===iu)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===ru)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(s===tu)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===nu)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===iu)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===ru)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Mp||s===Ep||s===wp||s===Tp)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(s===Mp)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Ep)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===wp)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===Tp)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===NE)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===Ap||s===Rp)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(s===Ap)return o===Pe?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(s===Rp)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===Cp||s===bp||s===Lp||s===Pp||s===Dp||s===Ip||s===Np||s===Up||s===Fp||s===zp||s===Op||s===Bp||s===kp||s===Hp)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(s===Cp)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===bp)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===Lp)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===Pp)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===Dp)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===Ip)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===Np)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===Up)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===Fp)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===zp)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===Op)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===Bp)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===kp)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===Hp)return o===Pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===su)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(s===su)return o===Pe?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT}else return null;if(s===UE||s===Gp||s===Vp||s===Wp)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(s===su)return a.COMPRESSED_RED_RGTC1_EXT;if(s===Gp)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===Vp)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===Wp)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===Fs?i?n.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):n[s]!==void 0?n[s]:null}return{convert:r}}class zR extends Xn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Eo extends cn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const OR={type:"move"};class Cu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Eo,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Eo,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new k,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new k),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Eo,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new k,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new k),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const g=t.getJointPose(_,i),f=this._getHandJoint(c,_);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}const d=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],u=d.position.distanceTo(h.position),p=.02,v=.005;c.inputState.pinching&&u>p+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=p-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(OR)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Eo;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class BR extends xn{constructor(e,t,i,r,s,o,a,l,c,d){if(d=d!==void 0?d:Nr,d!==Nr&&d!==js)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===Nr&&(i=Lr),i===void 0&&d===js&&(i=Fs),super(null,r,s,o,a,l,d,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Yt,this.minFilter=l!==void 0?l:Yt,this.flipY=!1,this.generateMipmaps=!1}}class kR extends Qs{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,d=null,h=null,u=null,p=null,v=null;const _=t.getContextAttributes();let g=null,f=null;const m=[],y=[],x=new Set,M=new Map,w=new Xn;w.layers.enable(1),w.viewport=new Nt;const R=new Xn;R.layers.enable(2),R.viewport=new Nt;const D=[w,R],E=new zR;E.layers.enable(1),E.layers.enable(2);let T=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let Y=m[H];return Y===void 0&&(Y=new Cu,m[H]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(H){let Y=m[H];return Y===void 0&&(Y=new Cu,m[H]=Y),Y.getGripSpace()},this.getHand=function(H){let Y=m[H];return Y===void 0&&(Y=new Cu,m[H]=Y),Y.getHandSpace()};function O(H){const Y=y.indexOf(H.inputSource);if(Y===-1)return;const re=m[Y];re!==void 0&&(re.update(H.inputSource,H.frame,c||o),re.dispatchEvent({type:H.type,data:H.inputSource}))}function C(){r.removeEventListener("select",O),r.removeEventListener("selectstart",O),r.removeEventListener("selectend",O),r.removeEventListener("squeeze",O),r.removeEventListener("squeezestart",O),r.removeEventListener("squeezeend",O),r.removeEventListener("end",C),r.removeEventListener("inputsourceschange",P);for(let H=0;H<m.length;H++){const Y=y[H];Y!==null&&(y[H]=null,m[H].disconnect(Y))}T=null,V=null,e.setRenderTarget(g),p=null,u=null,h=null,r=null,f=null,q.stop(),i.isPresenting=!1,i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){s=H,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){a=H,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(H){c=H},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return h},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(H){if(r=H,r!==null){if(g=e.getRenderTarget(),r.addEventListener("select",O),r.addEventListener("selectstart",O),r.addEventListener("selectend",O),r.addEventListener("squeeze",O),r.addEventListener("squeezestart",O),r.addEventListener("squeezeend",O),r.addEventListener("end",C),r.addEventListener("inputsourceschange",P),_.xrCompatible!==!0&&await t.makeXRCompatible(),r.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Y={antialias:r.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,Y),r.updateRenderState({baseLayer:p}),f=new Vr(p.framebufferWidth,p.framebufferHeight,{format:jn,type:Gr,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil})}else{let Y=null,re=null,oe=null;_.depth&&(oe=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Y=_.stencil?js:Nr,re=_.stencil?Fs:Lr);const F={colorFormat:t.RGBA8,depthFormat:oe,scaleFactor:s};h=new XRWebGLBinding(r,t),u=h.createProjectionLayer(F),r.updateRenderState({layers:[u]}),f=new Vr(u.textureWidth,u.textureHeight,{format:jn,type:Gr,depthTexture:new BR(u.textureWidth,u.textureHeight,re,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0});const Ee=e.properties.get(f);Ee.__ignoreDepthValues=u.ignoreDepthValues}f.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),q.setContext(r),q.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function P(H){for(let Y=0;Y<H.removed.length;Y++){const re=H.removed[Y],oe=y.indexOf(re);oe>=0&&(y[oe]=null,m[oe].disconnect(re))}for(let Y=0;Y<H.added.length;Y++){const re=H.added[Y];let oe=y.indexOf(re);if(oe===-1){for(let Ee=0;Ee<m.length;Ee++)if(Ee>=y.length){y.push(re),oe=Ee;break}else if(y[Ee]===null){y[Ee]=re,oe=Ee;break}if(oe===-1)break}const F=m[oe];F&&F.connect(re)}}const N=new k,U=new k;function X(H,Y,re){N.setFromMatrixPosition(Y.matrixWorld),U.setFromMatrixPosition(re.matrixWorld);const oe=N.distanceTo(U),F=Y.projectionMatrix.elements,Ee=re.projectionMatrix.elements,we=F[14]/(F[10]-1),ae=F[14]/(F[10]+1),xe=(F[9]+1)/F[5],We=(F[9]-1)/F[5],ge=(F[8]-1)/F[0],Le=(Ee[8]+1)/Ee[0],lt=we*ge,yt=we*Le,ht=oe/(-ge+Le),ct=ht*-ge;Y.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(ct),H.translateZ(ht),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert();const Ve=we+ht,Re=ae+ht,Xe=lt-ct,L=yt+(oe-ct),A=xe*ae/Re*Ve,$=We*ae/Re*Ve;H.projectionMatrix.makePerspective(Xe,L,A,$,Ve,Re),H.projectionMatrixInverse.copy(H.projectionMatrix).invert()}function I(H,Y){Y===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(Y.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(r===null)return;E.near=R.near=w.near=H.near,E.far=R.far=w.far=H.far,(T!==E.near||V!==E.far)&&(r.updateRenderState({depthNear:E.near,depthFar:E.far}),T=E.near,V=E.far);const Y=H.parent,re=E.cameras;I(E,Y);for(let oe=0;oe<re.length;oe++)I(re[oe],Y);re.length===2?X(E,w,R):E.projectionMatrix.copy(w.projectionMatrix),B(H,E,Y)};function B(H,Y,re){re===null?H.matrix.copy(Y.matrixWorld):(H.matrix.copy(re.matrixWorld),H.matrix.invert(),H.matrix.multiply(Y.matrixWorld)),H.matrix.decompose(H.position,H.quaternion,H.scale),H.updateMatrixWorld(!0);const oe=H.children;for(let F=0,Ee=oe.length;F<Ee;F++)oe[F].updateMatrixWorld(!0);H.projectionMatrix.copy(Y.projectionMatrix),H.projectionMatrixInverse.copy(Y.projectionMatrixInverse),H.isPerspectiveCamera&&(H.fov=Nd*2*Math.atan(1/H.projectionMatrix.elements[5]),H.zoom=1)}this.getCamera=function(){return E},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function(H){l=H,u!==null&&(u.fixedFoveation=H),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=H)},this.getPlanes=function(){return x};let W=null;function ee(H,Y){if(d=Y.getViewerPose(c||o),v=Y,d!==null){const re=d.views;p!==null&&(e.setRenderTargetFramebuffer(f,p.framebuffer),e.setRenderTarget(f));let oe=!1;re.length!==E.cameras.length&&(E.cameras.length=0,oe=!0);for(let F=0;F<re.length;F++){const Ee=re[F];let we=null;if(p!==null)we=p.getViewport(Ee);else{const xe=h.getViewSubImage(u,Ee);we=xe.viewport,F===0&&(e.setRenderTargetTextures(f,xe.colorTexture,u.ignoreDepthValues?void 0:xe.depthStencilTexture),e.setRenderTarget(f))}let ae=D[F];ae===void 0&&(ae=new Xn,ae.layers.enable(F),ae.viewport=new Nt,D[F]=ae),ae.matrix.fromArray(Ee.transform.matrix),ae.matrix.decompose(ae.position,ae.quaternion,ae.scale),ae.projectionMatrix.fromArray(Ee.projectionMatrix),ae.projectionMatrixInverse.copy(ae.projectionMatrix).invert(),ae.viewport.set(we.x,we.y,we.width,we.height),F===0&&(E.matrix.copy(ae.matrix),E.matrix.decompose(E.position,E.quaternion,E.scale)),oe===!0&&E.cameras.push(ae)}}for(let re=0;re<m.length;re++){const oe=y[re],F=m[re];oe!==null&&F!==void 0&&F.update(oe,Y,c||o)}if(W&&W(H,Y),Y.detectedPlanes){i.dispatchEvent({type:"planesdetected",data:Y.detectedPlanes});let re=null;for(const oe of x)Y.detectedPlanes.has(oe)||(re===null&&(re=[]),re.push(oe));if(re!==null)for(const oe of re)x.delete(oe),M.delete(oe),i.dispatchEvent({type:"planeremoved",data:oe});for(const oe of Y.detectedPlanes)if(!x.has(oe))x.add(oe),M.set(oe,Y.lastChangedTime),i.dispatchEvent({type:"planeadded",data:oe});else{const F=M.get(oe);oe.lastChangedTime>F&&(M.set(oe,oe.lastChangedTime),i.dispatchEvent({type:"planechanged",data:oe}))}}v=null}const q=new L0;q.setAnimationLoop(ee),this.setAnimationLoop=function(H){W=H},this.dispose=function(){}}}function HR(n,e){function t(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function i(g,f){f.color.getRGB(g.fogColor.value,A0(n)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function r(g,f,m,y,x){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(g,f):f.isMeshToonMaterial?(s(g,f),h(g,f)):f.isMeshPhongMaterial?(s(g,f),d(g,f)):f.isMeshStandardMaterial?(s(g,f),u(g,f),f.isMeshPhysicalMaterial&&p(g,f,x)):f.isMeshMatcapMaterial?(s(g,f),v(g,f)):f.isMeshDepthMaterial?s(g,f):f.isMeshDistanceMaterial?(s(g,f),_(g,f)):f.isMeshNormalMaterial?s(g,f):f.isLineBasicMaterial?(o(g,f),f.isLineDashedMaterial&&a(g,f)):f.isPointsMaterial?l(g,f,m,y):f.isSpriteMaterial?c(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,t(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===ln&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,t(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===ln&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,t(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,t(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);const m=e.get(f).envMap;if(m&&(g.envMap.value=m,g.flipEnvMap.value=m.isCubeTexture&&m.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap){g.lightMap.value=f.lightMap;const y=n.useLegacyLights===!0?Math.PI:1;g.lightMapIntensity.value=f.lightMapIntensity*y,t(f.lightMap,g.lightMapTransform)}f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,g.aoMapTransform))}function o(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform))}function a(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function l(g,f,m,y){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*m,g.scale.value=y*.5,f.map&&(g.map.value=f.map,t(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function c(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function d(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function h(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function u(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,g.roughnessMapTransform)),e.get(f).envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function p(g,f,m){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===ln&&g.clearcoatNormalScale.value.negate())),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=m.texture,g.transmissionSamplerSize.value.set(m.width,m.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,g.specularIntensityMapTransform))}function v(g,f){f.matcap&&(g.matcap.value=f.matcap)}function _(g,f){const m=e.get(f).light;g.referencePosition.value.setFromMatrixPosition(m.matrixWorld),g.nearDistance.value=m.shadow.camera.near,g.farDistance.value=m.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function GR(n,e,t,i){let r={},s={},o=[];const a=t.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(m,y){const x=y.program;i.uniformBlockBinding(m,x)}function c(m,y){let x=r[m.id];x===void 0&&(v(m),x=d(m),r[m.id]=x,m.addEventListener("dispose",g));const M=y.program;i.updateUBOMapping(m,M);const w=e.render.frame;s[m.id]!==w&&(u(m),s[m.id]=w)}function d(m){const y=h();m.__bindingPointIndex=y;const x=n.createBuffer(),M=m.__size,w=m.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,M,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,x),x}function h(){for(let m=0;m<a;m++)if(o.indexOf(m)===-1)return o.push(m),m;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(m){const y=r[m.id],x=m.uniforms,M=m.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let w=0,R=x.length;w<R;w++){const D=x[w];if(p(D,w,M)===!0){const E=D.__offset,T=Array.isArray(D.value)?D.value:[D.value];let V=0;for(let O=0;O<T.length;O++){const C=T[O],P=_(C);typeof C=="number"?(D.__data[0]=C,n.bufferSubData(n.UNIFORM_BUFFER,E+V,D.__data)):C.isMatrix3?(D.__data[0]=C.elements[0],D.__data[1]=C.elements[1],D.__data[2]=C.elements[2],D.__data[3]=C.elements[0],D.__data[4]=C.elements[3],D.__data[5]=C.elements[4],D.__data[6]=C.elements[5],D.__data[7]=C.elements[0],D.__data[8]=C.elements[6],D.__data[9]=C.elements[7],D.__data[10]=C.elements[8],D.__data[11]=C.elements[0]):(C.toArray(D.__data,V),V+=P.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,E,D.__data)}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(m,y,x){const M=m.value;if(x[y]===void 0){if(typeof M=="number")x[y]=M;else{const w=Array.isArray(M)?M:[M],R=[];for(let D=0;D<w.length;D++)R.push(w[D].clone());x[y]=R}return!0}else if(typeof M=="number"){if(x[y]!==M)return x[y]=M,!0}else{const w=Array.isArray(x[y])?x[y]:[x[y]],R=Array.isArray(M)?M:[M];for(let D=0;D<w.length;D++){const E=w[D];if(E.equals(R[D])===!1)return E.copy(R[D]),!0}}return!1}function v(m){const y=m.uniforms;let x=0;const M=16;let w=0;for(let R=0,D=y.length;R<D;R++){const E=y[R],T={boundary:0,storage:0},V=Array.isArray(E.value)?E.value:[E.value];for(let O=0,C=V.length;O<C;O++){const P=V[O],N=_(P);T.boundary+=N.boundary,T.storage+=N.storage}if(E.__data=new Float32Array(T.storage/Float32Array.BYTES_PER_ELEMENT),E.__offset=x,R>0){w=x%M;const O=M-w;w!==0&&O-T.boundary<0&&(x+=M-w,E.__offset=x)}x+=T.storage}return w=x%M,w>0&&(x+=M-w),m.__size=x,m.__cache={},this}function _(m){const y={boundary:0,storage:0};return typeof m=="number"?(y.boundary=4,y.storage=4):m.isVector2?(y.boundary=8,y.storage=8):m.isVector3||m.isColor?(y.boundary=16,y.storage=12):m.isVector4?(y.boundary=16,y.storage=16):m.isMatrix3?(y.boundary=48,y.storage=48):m.isMatrix4?(y.boundary=64,y.storage=64):m.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",m),y}function g(m){const y=m.target;y.removeEventListener("dispose",g);const x=o.indexOf(y.__bindingPointIndex);o.splice(x,1),n.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function f(){for(const m in r)n.deleteBuffer(r[m]);o=[],r={},s={}}return{bind:l,update:c,dispose:f}}function VR(){const n=$l("canvas");return n.style.display="block",n}class F0{constructor(e={}){const{canvas:t=VR(),context:i=null,depth:r=!0,stencil:s=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let u;i!==null?u=i.getContextAttributes().alpha:u=o;let p=null,v=null;const _=[],g=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.outputColorSpace=Pe,this.useLegacyLights=!0,this.toneMapping=Pi,this.toneMappingExposure=1;const f=this;let m=!1,y=0,x=0,M=null,w=-1,R=null;const D=new Nt,E=new Nt;let T=null,V=t.width,O=t.height,C=1,P=null,N=null;const U=new Nt(0,0,V,O),X=new Nt(0,0,V,O);let I=!1;const B=new b0;let W=!1,ee=!1,q=null;const H=new Dt,Y=new k,re={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function oe(){return M===null?C:1}let F=i;function Ee(b,j){for(let Z=0;Z<b.length;Z++){const G=b[Z],J=t.getContext(G,j);if(J!==null)return J}return null}try{const b={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Nf}`),t.addEventListener("webglcontextlost",ye,!1),t.addEventListener("webglcontextrestored",ke,!1),t.addEventListener("webglcontextcreationerror",Ye,!1),F===null){const j=["webgl2","webgl","experimental-webgl"];if(f.isWebGL1Renderer===!0&&j.shift(),F=Ee(j,b),F===null)throw Ee(j)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}F.getShaderPrecisionFormat===void 0&&(F.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let we,ae,xe,We,ge,Le,lt,yt,ht,ct,Ve,Re,Xe,L,A,$,ie,se,ce,Ce,me,Q,_e,Se;function Te(){we=new eA(F),ae=new Y1(F,we,e),we.init(ae),Q=new FR(F,we,ae),xe=new NR(F,we,ae),We=new iA(F),ge=new xR,Le=new UR(F,we,xe,ge,ae,Q,We),lt=new K1(f),yt=new J1(f),ht=new mw(F,ae),_e=new q1(F,we,ht,ae),ct=new tA(F,ht,We,_e),Ve=new aA(F,ct,ht,We),ce=new oA(F,ae,Le),$=new $1(ge),Re=new yR(f,lt,yt,we,ae,_e,$),Xe=new HR(f,ge),L=new MR,A=new CR(we,ae),se=new X1(f,lt,yt,xe,Ve,u,l),ie=new IR(f,Ve,ae),Se=new GR(F,We,ae,xe),Ce=new j1(F,we,We,ae),me=new nA(F,we,We,ae),We.programs=Re.programs,f.capabilities=ae,f.extensions=we,f.properties=ge,f.renderLists=L,f.shadowMap=ie,f.state=xe,f.info=We}Te();const pe=new kR(f,F);this.xr=pe,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const b=we.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=we.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return C},this.setPixelRatio=function(b){b!==void 0&&(C=b,this.setSize(V,O,!1))},this.getSize=function(b){return b.set(V,O)},this.setSize=function(b,j,Z=!0){if(pe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=b,O=j,t.width=Math.floor(b*C),t.height=Math.floor(j*C),Z===!0&&(t.style.width=b+"px",t.style.height=j+"px"),this.setViewport(0,0,b,j)},this.getDrawingBufferSize=function(b){return b.set(V*C,O*C).floor()},this.setDrawingBufferSize=function(b,j,Z){V=b,O=j,C=Z,t.width=Math.floor(b*Z),t.height=Math.floor(j*Z),this.setViewport(0,0,b,j)},this.getCurrentViewport=function(b){return b.copy(D)},this.getViewport=function(b){return b.copy(U)},this.setViewport=function(b,j,Z,G){b.isVector4?U.set(b.x,b.y,b.z,b.w):U.set(b,j,Z,G),xe.viewport(D.copy(U).multiplyScalar(C).floor())},this.getScissor=function(b){return b.copy(X)},this.setScissor=function(b,j,Z,G){b.isVector4?X.set(b.x,b.y,b.z,b.w):X.set(b,j,Z,G),xe.scissor(E.copy(X).multiplyScalar(C).floor())},this.getScissorTest=function(){return I},this.setScissorTest=function(b){xe.setScissorTest(I=b)},this.setOpaqueSort=function(b){P=b},this.setTransparentSort=function(b){N=b},this.getClearColor=function(b){return b.copy(se.getClearColor())},this.setClearColor=function(){se.setClearColor.apply(se,arguments)},this.getClearAlpha=function(){return se.getClearAlpha()},this.setClearAlpha=function(){se.setClearAlpha.apply(se,arguments)},this.clear=function(b=!0,j=!0,Z=!0){let G=0;b&&(G|=F.COLOR_BUFFER_BIT),j&&(G|=F.DEPTH_BUFFER_BIT),Z&&(G|=F.STENCIL_BUFFER_BIT),F.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ye,!1),t.removeEventListener("webglcontextrestored",ke,!1),t.removeEventListener("webglcontextcreationerror",Ye,!1),L.dispose(),A.dispose(),ge.dispose(),lt.dispose(),yt.dispose(),Ve.dispose(),_e.dispose(),Se.dispose(),Re.dispose(),pe.dispose(),pe.removeEventListener("sessionstart",ve),pe.removeEventListener("sessionend",Ke),q&&(q.dispose(),q=null),Ze.stop()};function ye(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),m=!0}function ke(){console.log("THREE.WebGLRenderer: Context Restored."),m=!1;const b=We.autoReset,j=ie.enabled,Z=ie.autoUpdate,G=ie.needsUpdate,J=ie.type;Te(),We.autoReset=b,ie.enabled=j,ie.autoUpdate=Z,ie.needsUpdate=G,ie.type=J}function Ye(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function pt(b){const j=b.target;j.removeEventListener("dispose",pt),z(j)}function z(b){K(b),ge.remove(b)}function K(b){const j=ge.get(b).programs;j!==void 0&&(j.forEach(function(Z){Re.releaseProgram(Z)}),b.isShaderMaterial&&Re.releaseShaderCache(b))}this.renderBufferDirect=function(b,j,Z,G,J,Me){j===null&&(j=re);const Ae=J.isMesh&&J.matrixWorld.determinant()<0,be=z0(b,j,Z,G,J);xe.setMaterial(G,Ae);let De=Z.index,Ue=1;G.wireframe===!0&&(De=ct.getWireframeAttribute(Z),Ue=2);const Fe=Z.drawRange,Oe=Z.attributes.position;let $e=Fe.start*Ue,Wt=(Fe.start+Fe.count)*Ue;Me!==null&&($e=Math.max($e,Me.start*Ue),Wt=Math.min(Wt,(Me.start+Me.count)*Ue)),De!==null?($e=Math.max($e,0),Wt=Math.min(Wt,De.count)):Oe!=null&&($e=Math.max($e,0),Wt=Math.min(Wt,Oe.count));const Un=Wt-$e;if(Un<0||Un===1/0)return;_e.setup(J,G,be,Z,De);let hr,xt=Ce;if(De!==null&&(hr=ht.get(De),xt=me,xt.setIndex(hr)),J.isMesh)G.wireframe===!0?(xe.setLineWidth(G.wireframeLinewidth*oe()),xt.setMode(F.LINES)):xt.setMode(F.TRIANGLES);else if(J.isLine){let He=G.linewidth;He===void 0&&(He=1),xe.setLineWidth(He*oe()),J.isLineSegments?xt.setMode(F.LINES):J.isLineLoop?xt.setMode(F.LINE_LOOP):xt.setMode(F.LINE_STRIP)}else J.isPoints?xt.setMode(F.POINTS):J.isSprite&&xt.setMode(F.TRIANGLES);if(J.isInstancedMesh)xt.renderInstances($e,Un,J.count);else if(Z.isInstancedBufferGeometry){const He=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,_c=Math.min(Z.instanceCount,He);xt.renderInstances($e,Un,_c)}else xt.render($e,Un)},this.compile=function(b,j){function Z(G,J,Me){G.transparent===!0&&G.side===Ri&&G.forceSinglePass===!1?(G.side=ln,G.needsUpdate=!0,ha(G,J,Me),G.side=cr,G.needsUpdate=!0,ha(G,J,Me),G.side=Ri):ha(G,J,Me)}v=A.get(b),v.init(),g.push(v),b.traverseVisible(function(G){G.isLight&&G.layers.test(j.layers)&&(v.pushLight(G),G.castShadow&&v.pushShadow(G))}),v.setupLights(f.useLegacyLights),b.traverse(function(G){const J=G.material;if(J)if(Array.isArray(J))for(let Me=0;Me<J.length;Me++){const Ae=J[Me];Z(Ae,b,G)}else Z(J,b,G)}),g.pop(),v=null};let te=null;function ue(b){te&&te(b)}function ve(){Ze.stop()}function Ke(){Ze.start()}const Ze=new L0;Ze.setAnimationLoop(ue),typeof self<"u"&&Ze.setContext(self),this.setAnimationLoop=function(b){te=b,pe.setAnimationLoop(b),b===null?Ze.stop():Ze.start()},pe.addEventListener("sessionstart",ve),pe.addEventListener("sessionend",Ke),this.render=function(b,j){if(j!==void 0&&j.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(m===!0)return;b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),j.parent===null&&j.matrixWorldAutoUpdate===!0&&j.updateMatrixWorld(),pe.enabled===!0&&pe.isPresenting===!0&&(pe.cameraAutoUpdate===!0&&pe.updateCamera(j),j=pe.getCamera()),b.isScene===!0&&b.onBeforeRender(f,b,j,M),v=A.get(b,g.length),v.init(),g.push(v),H.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),B.setFromProjectionMatrix(H),ee=this.localClippingEnabled,W=$.init(this.clippingPlanes,ee),p=L.get(b,_.length),p.init(),_.push(p),zt(b,j,0,f.sortObjects),p.finish(),f.sortObjects===!0&&p.sort(P,N),W===!0&&$.beginShadows();const Z=v.state.shadowsArray;if(ie.render(Z,b,j),W===!0&&$.endShadows(),this.info.autoReset===!0&&this.info.reset(),se.render(p,b),v.setupLights(f.useLegacyLights),j.isArrayCamera){const G=j.cameras;for(let J=0,Me=G.length;J<Me;J++){const Ae=G[J];zi(p,b,Ae,Ae.viewport)}}else zi(p,b,j);M!==null&&(Le.updateMultisampleRenderTarget(M),Le.updateRenderTargetMipmap(M)),b.isScene===!0&&b.onAfterRender(f,b,j),_e.resetDefaultState(),w=-1,R=null,g.pop(),g.length>0?v=g[g.length-1]:v=null,_.pop(),_.length>0?p=_[_.length-1]:p=null};function zt(b,j,Z,G){if(b.visible===!1)return;if(b.layers.test(j.layers)){if(b.isGroup)Z=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(j);else if(b.isLight)v.pushLight(b),b.castShadow&&v.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||B.intersectsSprite(b)){G&&Y.setFromMatrixPosition(b.matrixWorld).applyMatrix4(H);const Ae=Ve.update(b),be=b.material;be.visible&&p.push(b,Ae,be,Z,Y.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||B.intersectsObject(b))){b.isSkinnedMesh&&b.skeleton.frame!==We.render.frame&&(b.skeleton.update(),b.skeleton.frame=We.render.frame);const Ae=Ve.update(b),be=b.material;if(G&&(Ae.boundingSphere===null&&Ae.computeBoundingSphere(),Y.copy(Ae.boundingSphere.center).applyMatrix4(b.matrixWorld).applyMatrix4(H)),Array.isArray(be)){const De=Ae.groups;for(let Ue=0,Fe=De.length;Ue<Fe;Ue++){const Oe=De[Ue],$e=be[Oe.materialIndex];$e&&$e.visible&&p.push(b,Ae,$e,Z,Y.z,Oe)}}else be.visible&&p.push(b,Ae,be,Z,Y.z,null)}}const Me=b.children;for(let Ae=0,be=Me.length;Ae<be;Ae++)zt(Me[Ae],j,Z,G)}function zi(b,j,Z,G){const J=b.opaque,Me=b.transmissive,Ae=b.transparent;v.setupLightsView(Z),W===!0&&$.setGlobalState(f.clippingPlanes,Z),Me.length>0&&mt(J,Me,j,Z),G&&xe.viewport(D.copy(G)),J.length>0&&Tn(J,j,Z),Me.length>0&&Tn(Me,j,Z),Ae.length>0&&Tn(Ae,j,Z),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function mt(b,j,Z,G){if(q===null){const be=ae.isWebGL2;q=new Vr(1024,1024,{generateMipmaps:!0,type:we.has("EXT_color_buffer_half_float")?ta:Gr,minFilter:ea,samples:be&&a===!0?4:0})}const J=f.getRenderTarget();f.setRenderTarget(q),f.clear();const Me=f.toneMapping;f.toneMapping=Pi,Tn(b,Z,G),Le.updateMultisampleRenderTarget(q),Le.updateRenderTargetMipmap(q);let Ae=!1;for(let be=0,De=j.length;be<De;be++){const Ue=j[be],Fe=Ue.object,Oe=Ue.geometry,$e=Ue.material,Wt=Ue.group;if($e.side===Ri&&Fe.layers.test(G.layers)){const Un=$e.side;$e.side=ln,$e.needsUpdate=!0,Jn(Fe,Z,G,Oe,$e,Wt),$e.side=Un,$e.needsUpdate=!0,Ae=!0}}Ae===!0&&(Le.updateMultisampleRenderTarget(q),Le.updateRenderTargetMipmap(q)),f.setRenderTarget(J),f.toneMapping=Me}function Tn(b,j,Z){const G=j.isScene===!0?j.overrideMaterial:null;for(let J=0,Me=b.length;J<Me;J++){const Ae=b[J],be=Ae.object,De=Ae.geometry,Ue=G===null?Ae.material:G,Fe=Ae.group;be.layers.test(Z.layers)&&Jn(be,j,Z,De,Ue,Fe)}}function Jn(b,j,Z,G,J,Me){b.onBeforeRender(f,j,Z,G,J,Me),b.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),J.onBeforeRender(f,j,Z,G,b,Me),J.transparent===!0&&J.side===Ri&&J.forceSinglePass===!1?(J.side=ln,J.needsUpdate=!0,f.renderBufferDirect(Z,j,G,J,b,Me),J.side=cr,J.needsUpdate=!0,f.renderBufferDirect(Z,j,G,J,b,Me),J.side=Ri):f.renderBufferDirect(Z,j,G,J,b,Me),b.onAfterRender(f,j,Z,G,J,Me)}function ha(b,j,Z){j.isScene!==!0&&(j=re);const G=ge.get(b),J=v.state.lights,Me=v.state.shadowsArray,Ae=J.state.version,be=Re.getParameters(b,J.state,Me,j,Z),De=Re.getProgramCacheKey(be);let Ue=G.programs;G.environment=b.isMeshStandardMaterial?j.environment:null,G.fog=j.fog,G.envMap=(b.isMeshStandardMaterial?yt:lt).get(b.envMap||G.environment),Ue===void 0&&(b.addEventListener("dispose",pt),Ue=new Map,G.programs=Ue);let Fe=Ue.get(De);if(Fe!==void 0){if(G.currentProgram===Fe&&G.lightsStateVersion===Ae)return Of(b,be),Fe}else be.uniforms=Re.getUniforms(b),b.onBuild(Z,be,f),b.onBeforeCompile(be,f),Fe=Re.acquireProgram(be,De),Ue.set(De,Fe),G.uniforms=be.uniforms;const Oe=G.uniforms;(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Oe.clippingPlanes=$.uniform),Of(b,be),G.needsLights=B0(b),G.lightsStateVersion=Ae,G.needsLights&&(Oe.ambientLightColor.value=J.state.ambient,Oe.lightProbe.value=J.state.probe,Oe.directionalLights.value=J.state.directional,Oe.directionalLightShadows.value=J.state.directionalShadow,Oe.spotLights.value=J.state.spot,Oe.spotLightShadows.value=J.state.spotShadow,Oe.rectAreaLights.value=J.state.rectArea,Oe.ltc_1.value=J.state.rectAreaLTC1,Oe.ltc_2.value=J.state.rectAreaLTC2,Oe.pointLights.value=J.state.point,Oe.pointLightShadows.value=J.state.pointShadow,Oe.hemisphereLights.value=J.state.hemi,Oe.directionalShadowMap.value=J.state.directionalShadowMap,Oe.directionalShadowMatrix.value=J.state.directionalShadowMatrix,Oe.spotShadowMap.value=J.state.spotShadowMap,Oe.spotLightMatrix.value=J.state.spotLightMatrix,Oe.spotLightMap.value=J.state.spotLightMap,Oe.pointShadowMap.value=J.state.pointShadowMap,Oe.pointShadowMatrix.value=J.state.pointShadowMatrix);const $e=Fe.getUniforms(),Wt=Ml.seqWithValue($e.seq,Oe);return G.currentProgram=Fe,G.uniformsList=Wt,Fe}function Of(b,j){const Z=ge.get(b);Z.outputColorSpace=j.outputColorSpace,Z.instancing=j.instancing,Z.skinning=j.skinning,Z.morphTargets=j.morphTargets,Z.morphNormals=j.morphNormals,Z.morphColors=j.morphColors,Z.morphTargetsCount=j.morphTargetsCount,Z.numClippingPlanes=j.numClippingPlanes,Z.numIntersection=j.numClipIntersection,Z.vertexAlphas=j.vertexAlphas,Z.vertexTangents=j.vertexTangents,Z.toneMapping=j.toneMapping}function z0(b,j,Z,G,J){j.isScene!==!0&&(j=re),Le.resetTextureUnits();const Me=j.fog,Ae=G.isMeshStandardMaterial?j.environment:null,be=M===null?f.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:fi,De=(G.isMeshStandardMaterial?yt:lt).get(G.envMap||Ae),Ue=G.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,Fe=!!G.normalMap&&!!Z.attributes.tangent,Oe=!!Z.morphAttributes.position,$e=!!Z.morphAttributes.normal,Wt=!!Z.morphAttributes.color,Un=G.toneMapped?f.toneMapping:Pi,hr=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,xt=hr!==void 0?hr.length:0,He=ge.get(G),_c=v.state.lights;if(W===!0&&(ee===!0||b!==R)){const un=b===R&&G.id===w;$.setState(G,b,un)}let Ct=!1;G.version===He.__version?(He.needsLights&&He.lightsStateVersion!==_c.state.version||He.outputColorSpace!==be||J.isInstancedMesh&&He.instancing===!1||!J.isInstancedMesh&&He.instancing===!0||J.isSkinnedMesh&&He.skinning===!1||!J.isSkinnedMesh&&He.skinning===!0||He.envMap!==De||G.fog===!0&&He.fog!==Me||He.numClippingPlanes!==void 0&&(He.numClippingPlanes!==$.numPlanes||He.numIntersection!==$.numIntersection)||He.vertexAlphas!==Ue||He.vertexTangents!==Fe||He.morphTargets!==Oe||He.morphNormals!==$e||He.morphColors!==Wt||He.toneMapping!==Un||ae.isWebGL2===!0&&He.morphTargetsCount!==xt)&&(Ct=!0):(Ct=!0,He.__version=G.version);let pr=He.currentProgram;Ct===!0&&(pr=ha(G,j,J));let Bf=!1,eo=!1,yc=!1;const Xt=pr.getUniforms(),mr=He.uniforms;if(xe.useProgram(pr.program)&&(Bf=!0,eo=!0,yc=!0),G.id!==w&&(w=G.id,eo=!0),Bf||R!==b){if(Xt.setValue(F,"projectionMatrix",b.projectionMatrix),ae.logarithmicDepthBuffer&&Xt.setValue(F,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),R!==b&&(R=b,eo=!0,yc=!0),G.isShaderMaterial||G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshStandardMaterial||G.envMap){const un=Xt.map.cameraPosition;un!==void 0&&un.setValue(F,Y.setFromMatrixPosition(b.matrixWorld))}(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&Xt.setValue(F,"isOrthographic",b.isOrthographicCamera===!0),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial||G.isShadowMaterial||J.isSkinnedMesh)&&Xt.setValue(F,"viewMatrix",b.matrixWorldInverse)}if(J.isSkinnedMesh){Xt.setOptional(F,J,"bindMatrix"),Xt.setOptional(F,J,"bindMatrixInverse");const un=J.skeleton;un&&(ae.floatVertexTextures?(un.boneTexture===null&&un.computeBoneTexture(),Xt.setValue(F,"boneTexture",un.boneTexture,Le),Xt.setValue(F,"boneTextureSize",un.boneTextureSize)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}const xc=Z.morphAttributes;if((xc.position!==void 0||xc.normal!==void 0||xc.color!==void 0&&ae.isWebGL2===!0)&&ce.update(J,Z,pr),(eo||He.receiveShadow!==J.receiveShadow)&&(He.receiveShadow=J.receiveShadow,Xt.setValue(F,"receiveShadow",J.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(mr.envMap.value=De,mr.flipEnvMap.value=De.isCubeTexture&&De.isRenderTargetTexture===!1?-1:1),eo&&(Xt.setValue(F,"toneMappingExposure",f.toneMappingExposure),He.needsLights&&O0(mr,yc),Me&&G.fog===!0&&Xe.refreshFogUniforms(mr,Me),Xe.refreshMaterialUniforms(mr,G,C,O,q),Ml.upload(F,He.uniformsList,mr,Le)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Ml.upload(F,He.uniformsList,mr,Le),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&Xt.setValue(F,"center",J.center),Xt.setValue(F,"modelViewMatrix",J.modelViewMatrix),Xt.setValue(F,"normalMatrix",J.normalMatrix),Xt.setValue(F,"modelMatrix",J.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const un=G.uniformsGroups;for(let Sc=0,k0=un.length;Sc<k0;Sc++)if(ae.isWebGL2){const kf=un[Sc];Se.update(kf,pr),Se.bind(kf,pr)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return pr}function O0(b,j){b.ambientLightColor.needsUpdate=j,b.lightProbe.needsUpdate=j,b.directionalLights.needsUpdate=j,b.directionalLightShadows.needsUpdate=j,b.pointLights.needsUpdate=j,b.pointLightShadows.needsUpdate=j,b.spotLights.needsUpdate=j,b.spotLightShadows.needsUpdate=j,b.rectAreaLights.needsUpdate=j,b.hemisphereLights.needsUpdate=j}function B0(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return y},this.getActiveMipmapLevel=function(){return x},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(b,j,Z){ge.get(b.texture).__webglTexture=j,ge.get(b.depthTexture).__webglTexture=Z;const G=ge.get(b);G.__hasExternalTextures=!0,G.__hasExternalTextures&&(G.__autoAllocateDepthBuffer=Z===void 0,G.__autoAllocateDepthBuffer||we.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(b,j){const Z=ge.get(b);Z.__webglFramebuffer=j,Z.__useDefaultFramebuffer=j===void 0},this.setRenderTarget=function(b,j=0,Z=0){M=b,y=j,x=Z;let G=!0,J=null,Me=!1,Ae=!1;if(b){const De=ge.get(b);De.__useDefaultFramebuffer!==void 0?(xe.bindFramebuffer(F.FRAMEBUFFER,null),G=!1):De.__webglFramebuffer===void 0?Le.setupRenderTarget(b):De.__hasExternalTextures&&Le.rebindTextures(b,ge.get(b.texture).__webglTexture,ge.get(b.depthTexture).__webglTexture);const Ue=b.texture;(Ue.isData3DTexture||Ue.isDataArrayTexture||Ue.isCompressedArrayTexture)&&(Ae=!0);const Fe=ge.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(J=Fe[j],Me=!0):ae.isWebGL2&&b.samples>0&&Le.useMultisampledRTT(b)===!1?J=ge.get(b).__webglMultisampledFramebuffer:J=Fe,D.copy(b.viewport),E.copy(b.scissor),T=b.scissorTest}else D.copy(U).multiplyScalar(C).floor(),E.copy(X).multiplyScalar(C).floor(),T=I;if(xe.bindFramebuffer(F.FRAMEBUFFER,J)&&ae.drawBuffers&&G&&xe.drawBuffers(b,J),xe.viewport(D),xe.scissor(E),xe.setScissorTest(T),Me){const De=ge.get(b.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+j,De.__webglTexture,Z)}else if(Ae){const De=ge.get(b.texture),Ue=j||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,De.__webglTexture,Z||0,Ue)}w=-1},this.readRenderTargetPixels=function(b,j,Z,G,J,Me,Ae){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=ge.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ae!==void 0&&(be=be[Ae]),be){xe.bindFramebuffer(F.FRAMEBUFFER,be);try{const De=b.texture,Ue=De.format,Fe=De.type;if(Ue!==jn&&Q.convert(Ue)!==F.getParameter(F.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Oe=Fe===ta&&(we.has("EXT_color_buffer_half_float")||ae.isWebGL2&&we.has("EXT_color_buffer_float"));if(Fe!==Gr&&Q.convert(Fe)!==F.getParameter(F.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Fe===Pr&&(ae.isWebGL2||we.has("OES_texture_float")||we.has("WEBGL_color_buffer_float")))&&!Oe){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}j>=0&&j<=b.width-G&&Z>=0&&Z<=b.height-J&&F.readPixels(j,Z,G,J,Q.convert(Ue),Q.convert(Fe),Me)}finally{const De=M!==null?ge.get(M).__webglFramebuffer:null;xe.bindFramebuffer(F.FRAMEBUFFER,De)}}},this.copyFramebufferToTexture=function(b,j,Z=0){const G=Math.pow(2,-Z),J=Math.floor(j.image.width*G),Me=Math.floor(j.image.height*G);Le.setTexture2D(j,0),F.copyTexSubImage2D(F.TEXTURE_2D,Z,0,0,b.x,b.y,J,Me),xe.unbindTexture()},this.copyTextureToTexture=function(b,j,Z,G=0){const J=j.image.width,Me=j.image.height,Ae=Q.convert(Z.format),be=Q.convert(Z.type);Le.setTexture2D(Z,0),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,Z.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Z.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,Z.unpackAlignment),j.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,G,b.x,b.y,J,Me,Ae,be,j.image.data):j.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,G,b.x,b.y,j.mipmaps[0].width,j.mipmaps[0].height,Ae,j.mipmaps[0].data):F.texSubImage2D(F.TEXTURE_2D,G,b.x,b.y,Ae,be,j.image),G===0&&Z.generateMipmaps&&F.generateMipmap(F.TEXTURE_2D),xe.unbindTexture()},this.copyTextureToTexture3D=function(b,j,Z,G,J=0){if(f.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Me=b.max.x-b.min.x+1,Ae=b.max.y-b.min.y+1,be=b.max.z-b.min.z+1,De=Q.convert(G.format),Ue=Q.convert(G.type);let Fe;if(G.isData3DTexture)Le.setTexture3D(G,0),Fe=F.TEXTURE_3D;else if(G.isDataArrayTexture)Le.setTexture2DArray(G,0),Fe=F.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,G.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,G.unpackAlignment);const Oe=F.getParameter(F.UNPACK_ROW_LENGTH),$e=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Wt=F.getParameter(F.UNPACK_SKIP_PIXELS),Un=F.getParameter(F.UNPACK_SKIP_ROWS),hr=F.getParameter(F.UNPACK_SKIP_IMAGES),xt=Z.isCompressedTexture?Z.mipmaps[0]:Z.image;F.pixelStorei(F.UNPACK_ROW_LENGTH,xt.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,xt.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,b.min.x),F.pixelStorei(F.UNPACK_SKIP_ROWS,b.min.y),F.pixelStorei(F.UNPACK_SKIP_IMAGES,b.min.z),Z.isDataTexture||Z.isData3DTexture?F.texSubImage3D(Fe,J,j.x,j.y,j.z,Me,Ae,be,De,Ue,xt.data):Z.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),F.compressedTexSubImage3D(Fe,J,j.x,j.y,j.z,Me,Ae,be,De,xt.data)):F.texSubImage3D(Fe,J,j.x,j.y,j.z,Me,Ae,be,De,Ue,xt),F.pixelStorei(F.UNPACK_ROW_LENGTH,Oe),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,$e),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Wt),F.pixelStorei(F.UNPACK_SKIP_ROWS,Un),F.pixelStorei(F.UNPACK_SKIP_IMAGES,hr),J===0&&G.generateMipmaps&&F.generateMipmap(Fe),xe.unbindTexture()},this.initTexture=function(b){b.isCubeTexture?Le.setTextureCube(b,0):b.isData3DTexture?Le.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?Le.setTexture2DArray(b,0):Le.setTexture2D(b,0),xe.unbindTexture()},this.resetState=function(){y=0,x=0,M=null,xe.reset(),_e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get physicallyCorrectLights(){return console.warn("THREE.WebGLRenderer: the property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),!this.useLegacyLights}set physicallyCorrectLights(e){console.warn("THREE.WebGLRenderer: the property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),this.useLegacyLights=!e}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Pe?Ur:m0}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===Ur?Pe:fi}}class WR extends F0{}WR.prototype.isWebGL1Renderer=!0;class XR extends cn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}get autoUpdate(){return console.warn("THREE.Scene: autoUpdate was renamed to matrixWorldAutoUpdate in r144."),this.matrixWorldAutoUpdate}set autoUpdate(e){console.warn("THREE.Scene: autoUpdate was renamed to matrixWorldAutoUpdate in r144."),this.matrixWorldAutoUpdate=e}}class wo extends fa{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Qe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Pm=new k,Dm=new k,Im=new Dt,bu=new S0,il=new mc;class qR extends cn{constructor(e=new _n,t=new wo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)Pm.fromBufferAttribute(t,r-1),Dm.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=Pm.distanceTo(Dm);e.setAttribute("lineDistance",new rn(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),il.copy(i.boundingSphere),il.applyMatrix4(r),il.radius+=s,e.ray.intersectsSphere(il)===!1)return;Im.copy(r).invert(),bu.copy(e.ray).applyMatrix4(Im);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=new k,d=new k,h=new k,u=new k,p=this.isLineSegments?2:1,v=i.index,g=i.attributes.position;if(v!==null){const f=Math.max(0,o.start),m=Math.min(v.count,o.start+o.count);for(let y=f,x=m-1;y<x;y+=p){const M=v.getX(y),w=v.getX(y+1);if(c.fromBufferAttribute(g,M),d.fromBufferAttribute(g,w),bu.distanceSqToSegment(c,d,u,h)>l)continue;u.applyMatrix4(this.matrixWorld);const D=e.ray.origin.distanceTo(u);D<e.near||D>e.far||t.push({distance:D,point:h.clone().applyMatrix4(this.matrixWorld),index:y,face:null,faceIndex:null,object:this})}}else{const f=Math.max(0,o.start),m=Math.min(g.count,o.start+o.count);for(let y=f,x=m-1;y<x;y+=p){if(c.fromBufferAttribute(g,y),d.fromBufferAttribute(g,y+1),bu.distanceSqToSegment(c,d,u,h)>l)continue;u.applyMatrix4(this.matrixWorld);const w=e.ray.origin.distanceTo(u);w<e.near||w>e.far||t.push({distance:w,point:h.clone().applyMatrix4(this.matrixWorld),index:y,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}const Nm=new k,Um=new k;class ps extends qR{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)Nm.fromBufferAttribute(t,r),Um.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Nm.distanceTo(Um);e.setAttribute("lineDistance",new rn(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}const rl=new k,sl=new k,Lu=new k,ol=new Ln;class Fm extends _n{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const r=Math.pow(10,4),s=Math.cos(Sl*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],d=["a","b","c"],h=new Array(3),u={},p=[];for(let v=0;v<l;v+=3){o?(c[0]=o.getX(v),c[1]=o.getX(v+1),c[2]=o.getX(v+2)):(c[0]=v,c[1]=v+1,c[2]=v+2);const{a:_,b:g,c:f}=ol;if(_.fromBufferAttribute(a,c[0]),g.fromBufferAttribute(a,c[1]),f.fromBufferAttribute(a,c[2]),ol.getNormal(Lu),h[0]=`${Math.round(_.x*r)},${Math.round(_.y*r)},${Math.round(_.z*r)}`,h[1]=`${Math.round(g.x*r)},${Math.round(g.y*r)},${Math.round(g.z*r)}`,h[2]=`${Math.round(f.x*r)},${Math.round(f.y*r)},${Math.round(f.z*r)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let m=0;m<3;m++){const y=(m+1)%3,x=h[m],M=h[y],w=ol[d[m]],R=ol[d[y]],D=`${x}_${M}`,E=`${M}_${x}`;E in u&&u[E]?(Lu.dot(u[E].normal)<=s&&(p.push(w.x,w.y,w.z),p.push(R.x,R.y,R.z)),u[E]=null):D in u||(u[D]={index0:c[m],index1:c[y],normal:Lu.clone()})}}for(const v in u)if(u[v]){const{index0:_,index1:g}=u[v];rl.fromBufferAttribute(a,_),sl.fromBufferAttribute(a,g),p.push(rl.x,rl.y,rl.z),p.push(sl.x,sl.y,sl.z)}this.setAttribute("position",new rn(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Nf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Nf);const Jt=15,Wi=10,al=20,zm=0,ll=8,Pu=-4,Du=-1,ut={bar:{size:{x:10,y:.2,z:.2}},torso:{size:{x:1.6,y:3,z:.8}},head:{size:{x:1.1,y:1.1,z:.8}},hand:{size:{x:.4,y:2,z:.4}},foot:{size:{x:.5,y:2.2,z:.5}}},Xi=40,jR=Math.atan(1/Math.sqrt(2)),Iu=60,YR=new k(0,5,0),$R=({snapshot:n,showRestOverlay:e})=>{const t=Ne.useRef(null),i=Ne.useRef(),r=Ne.useRef(),s=Ne.useRef(),o=Ne.useRef(),a=Ne.useRef();return Ne.useEffect(()=>{const l=t.current;if(!l)return;const c=new XR;c.background=new Qe("#f4ead6");const d=l.clientWidth/l.clientHeight,h=new P0(-Xi*d/2,Xi*d/2,Xi/2,-Xi/2,.1,200),u={value:Math.PI/4},p={value:1},v=()=>{h.position.set(Iu*Math.cos(u.value),Iu*Math.sin(jR),Iu*Math.sin(u.value)),h.lookAt(YR),h.zoom=p.value,h.updateProjectionMatrix()};v();const _=new F0({antialias:!0});_.setPixelRatio(window.devicePixelRatio||1),_.setSize(l.clientWidth,l.clientHeight),l.appendChild(_.domElement);const g=new wo({color:1118481,linewidth:1}),f=new _n,m=[],y=(Re,Xe)=>{m.push(Re.x,Re.y,Re.z,Xe.x,Xe.y,Xe.z)},x={fl:new k(-Jt,0,Wi),fr:new k(Jt,0,Wi),br:new k(Jt,0,-Wi),bl:new k(-Jt,0,-Wi),flTop:new k(-Jt,al,Wi),frTop:new k(Jt,al,Wi),brTop:new k(Jt,al,-Wi),blTop:new k(-Jt,al,-Wi)};y(x.fl,x.fr),y(x.fr,x.br),y(x.br,x.bl),y(x.bl,x.fl),y(x.fl,x.flTop),y(x.fr,x.frTop),y(x.br,x.brTop),y(x.bl,x.blTop),y(x.flTop,x.frTop),y(x.frTop,x.brTop),y(x.brTop,x.blTop),y(x.blTop,x.flTop),y(new k(Jt,zm,Pu),new k(Jt,ll,Pu)),y(new k(Jt,ll,Pu),new k(Jt,ll,Du)),y(new k(Jt,ll,Du),new k(Jt,zm,Du)),f.setAttribute("position",new rn(m,3));const M=new ps(f,g);c.add(M);const w=1118481,R=16050902,D=new Uf({color:w,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1}),E=(Re,Xe)=>{const L=new Fm(Re),A=new ps(L,new wo({color:R,linewidth:2,depthTest:!1,depthWrite:!1}));A.renderOrder=1,Xe.add(A)},T=(Re,Xe,L)=>new Wr(Re,Xe,L),V=new gn(T(ut.bar.size.x,ut.bar.size.y,ut.bar.size.z),D);E(V.geometry,V);const O=new gn(T(ut.torso.size.x,ut.torso.size.y,ut.torso.size.z),D);E(O.geometry,O);const C=T(ut.head.size.x,ut.head.size.y,ut.head.size.z),P=new gn(C,D);E(C,P);const N=T(ut.hand.size.x,ut.hand.size.y,ut.hand.size.z),U=new gn(N,D);E(N,U);const X=U.clone(),I=T(ut.foot.size.x,ut.foot.size.y,ut.foot.size.z),B=new gn(I,D);E(I,B);const W=B.clone(),ee=new _n;ee.setAttribute("position",new rn(3*2*3,3));const q=new ps(ee,g);c.add(O,P,V,U,X,B,W,q);const H={controller:new k(0,19,0),bar:new k(0,15,0),torso:new k(0,8,0),head:new k(0,10,0),handL:new k(-1.8,8,0),handR:new k(1.8,8,0),footL:new k(-.6,5,0),footR:new k(.6,5,0)},Y=new Eo,re=new wo({color:1797375,linewidth:2,transparent:!0,opacity:.8}),oe=new wo({color:1797375,linewidth:2,transparent:!0,opacity:.6}),F=(Re,Xe)=>{const L=new Wr(Re.x,Re.y,Re.z),A=new Fm(L),$=new ps(A,re);$.position.copy(Xe),Y.add($)};F(ut.bar.size,H.bar),F(ut.torso.size,H.torso),F(ut.head.size,H.head),F(ut.hand.size,H.handL),F(ut.hand.size,H.handR),F(ut.foot.size,H.footL),F(ut.foot.size,H.footR);const Ee=new _n;Ee.setAttribute("position",new rn([-.8,0,0,.8,0,0,0,-.8,0,0,.8,0],3));const we=new ps(Ee,re);we.position.copy(H.controller),Y.add(we);const ae=new Float32Array([H.controller.x,H.controller.y,H.controller.z,H.bar.x,H.bar.y,H.bar.z,H.controller.x,H.controller.y,H.controller.z,H.handL.x,H.handL.y,H.handL.z,H.controller.x,H.controller.y,H.controller.z,H.handR.x,H.handR.y,H.handR.z,H.bar.x,H.bar.y,H.bar.z,H.head.x,H.head.y,H.head.z]),xe=new _n;xe.setAttribute("position",new Zn(ae,3));const We=new ps(xe,oe);Y.add(We),Y.visible=!1,c.add(Y),o.current=Y,a.current={torso:O,head:P,bar:V,handL:U,handR:X,footL:B,footR:W,strings:q},r.current=c,s.current=h,i.current=_;const ge=()=>{if(!i.current||!s.current||!t.current)return;const{clientWidth:Re,clientHeight:Xe}=t.current,L=Re/Xe,A=s.current;A.left=-Xi*L/2,A.right=Xi*L/2,A.top=Xi/2,A.bottom=-Xi/2,v(),i.current.setSize(Re,Xe)};let Le=!1,lt=0;const yt=Re=>{Le=!0,lt=Re.clientX,_.domElement.setPointerCapture(Re.pointerId)},ht=Re=>{if(!Le)return;const Xe=Re.clientX-lt;lt=Re.clientX,u.value+=Xe*.003,v()},ct=Re=>{Le=!1;try{_.domElement.releasePointerCapture(Re.pointerId)}catch{}},Ve=Re=>{Re.preventDefault();const Xe=Re.deltaY>0?.9:1.1;p.value=Math.max(.5,Math.min(3,p.value*Xe)),v()};return _.domElement.addEventListener("pointerdown",yt,{passive:!1}),_.domElement.addEventListener("pointermove",ht,{passive:!1}),_.domElement.addEventListener("pointerup",ct,{passive:!1}),_.domElement.addEventListener("wheel",Ve,{passive:!1}),window.addEventListener("resize",ge),ge(),()=>{window.removeEventListener("resize",ge),_.domElement.removeEventListener("pointerdown",yt),_.domElement.removeEventListener("pointermove",ht),_.domElement.removeEventListener("pointerup",ct),_.domElement.removeEventListener("wheel",Ve),_.dispose(),l.contains(_.domElement)&&l.removeChild(_.domElement)}},[]),Ne.useEffect(()=>{if(!o.current)return;o.current.visible=!!e;const l=i.current,c=r.current,d=s.current;l&&c&&d&&l.render(c,d)},[e]),Ne.useEffect(()=>{const l=i.current,c=r.current,d=s.current,h=a.current;if(!l||!c||!d||!h)return;const{puppet:u}=n,p=(g,f)=>{g.position.set(f.position.x,f.position.y,f.position.z),g.quaternion.set(f.quaternion.x,f.quaternion.y,f.quaternion.z,f.quaternion.w)};p(h.torso,u.torso),p(h.head,u.head),p(h.bar,u.bar),p(h.handL,u.handL),p(h.handR,u.handR),p(h.footL,u.footL),p(h.footR,u.footR);const v=u.strings??[],_=h.strings.geometry.getAttribute("position");_.count!==v.length*2&&h.strings.geometry.setAttribute("position",new rn(v.length*2*3,3)),v.forEach((g,f)=>{_.setXYZ(f*2+0,g.a.x,g.a.y,g.a.z),_.setXYZ(f*2+1,g.b.x,g.b.y,g.b.z)}),_.needsUpdate=!0,l.render(c,d)},[n]),dt.jsx("div",{ref:t,style:{width:"100%",height:"100%"}})},KR=({snapshot:n,onHide:e})=>{var i;const t=[];if(n){t.push(`t=${n.time.toFixed(3)}`);const r=n.puppet.bar.position;t.push(`bar=(${r.x.toFixed(2)},${r.y.toFixed(2)},${((i=r.z)==null?void 0:i.toFixed(2))??"0"})`)}else t.push("no snapshot");return dt.jsxs("div",{style:{position:"absolute",right:12,top:12,background:"rgba(0,0,0,0.7)",color:"white",padding:12,borderRadius:10,fontFamily:"monospace",fontSize:12,animation:"fadein 0.2s ease-out",pointerEvents:"auto"},onMouseLeave:()=>setTimeout(e,800),children:[t.map((r,s)=>dt.jsx("div",{children:r},s)),dt.jsx("style",{children:"@keyframes fadein { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }"})]})},ZR="fountain.teatro.scenario-projection.v1",QR="teatro.satzfunk-player-ear-wind.01",JR="24abb318154118c6e0bd182fdb1e9ea0260d4c207e51e878efa2143181b670f9",eC="satzfunk-player:satzfunk:shaders:40479:24abb318154118c6",tC="envelope-codec-only; no live discovery or negotiation",nC=n=>typeof n=="string"&&/^[0-9a-f-]{36}$/i.test(n);function iC(n){if(!n||typeof n!="object"||Array.isArray(n))return null;const e=n;return e.type!==ZR||e.source!=="Fountain-Coach/SatzfunkPlayer"||e.scenarioID!==QR||!nC(e.runID)||!["admitted","running","stopped"].includes(String(e.state))||e.sourceIdentity!==eC||e.sourceSHA256!==JR||e.exactPublicAssetBytesVerified!==!0||e.hardwareInteroperability!==!1||e.midiCiStatus!==tC||!Number.isInteger(e.acceptedSoftwareUmpOperations)||e.acceptedSoftwareUmpOperations<0||e.windMix!==null&&(typeof e.windMix!="number"||!Number.isFinite(e.windMix)||e.windMix<.25||e.windMix>1)?null:e}function El(n,e,t){return Math.max(e,Math.min(t,n))}function Nu(n,e,t,i=0){const r=El(t,0,1),s=Math.round(r*127),o=176|i&15;for(const a of n)a.send([o,e&127,s])}function rC(n,e,t){if(!e||t.length===0)return;const i=Math.max(.001,n.time-e.time),r=(n.puppet.bar.position.x-e.puppet.bar.position.x)/i,s=(n.puppet.bar.position.y-e.puppet.bar.position.y)/i,o=Math.sqrt(r*r+s*s),a=El(o/5,0,1);Nu(t,1,a);const l=El((n.puppet.bar.position.y-5)/20,0,1);Nu(t,74,l);const c=["handL","handR","footL","footR"];let d=0;for(const u of c){const p=(n.puppet[u].position.x-e.puppet[u].position.x)/i,v=(n.puppet[u].position.y-e.puppet[u].position.y)/i;d+=Math.sqrt(p*p+v*v)}const h=El(d/10,0,1);Nu(t,7,h)}const sC=()=>{var V;const n=Ne.useRef(null),[e]=Ne.useState("demo"),[t]=Ne.useState("stage-demo"),i=Ne.useRef(null),r=Ne.useRef(null),[s,o]=Ne.useState(null),[a,l]=Ne.useState(null),[c,d]=Ne.useState("pending"),[h,u]=Ne.useState(null),[p,v]=Ne.useState("bridge: idle"),[_,g]=Ne.useState(!0),f=.6,[m,y]=Ne.useState(!1),[x,M]=Ne.useState(!1),w=Ne.useRef([]),R=Ne.useRef({swayAmp:2,swayRate:.7,upDownAmp:.5,upDownRate:.9}),D=Ne.useRef(null),E=Ne.useRef(performance.now());Ne.useEffect(()=>{n.current=new WM,n.current.setWindStrength(f),n.current.setBarMotion(R.current);const O=()=>{const C=performance.now(),P=i.current??C,N=(C-P)/1e3;i.current=C;const U=n.current;if(U&&_){U.step(N);const X=U.snapshot();o(X),rC(X,D.current,w.current),D.current=X}r.current=requestAnimationFrame(O)};return r.current=requestAnimationFrame(O),()=>{r.current!=null&&cancelAnimationFrame(r.current)}},[_]),Ne.useEffect(()=>{const O=C=>{var N;if(C.origin!==window.location.origin||C.source!==window.parent)return;const P=iC(C.data);P&&(l(P),P.windMix!==null&&((N=n.current)==null||N.setWindStrength(P.windMix)))};return window.addEventListener("message",O),()=>window.removeEventListener("message",O)},[]),s==null||s.time,Ne.useEffect(()=>{"requestMIDIAccess"in navigator&&navigator.requestMIDIAccess().then(O=>{w.current=Array.from(O.outputs.values()),O.onstatechange=()=>{w.current=Array.from(O.outputs.values())}}).catch(()=>{w.current=[]})},[]),Ne.useEffect(()=>{let O=!1;return fetch("/midi2/status").then(C=>C.json()).then(C=>{if(O)return;const P=C.ok?`midi2 ok (bundleLoaded=${C.bundleLoaded??!1})`:"midi2 unavailable";d(P)}).catch(()=>{O||d("midi2 unavailable")}),()=>{O=!0}},[]);const T=Ne.useCallback(O=>{var U;if(O.length<3)return;const C=O[0]&240,P=O[1]&127,N=O[2]&127;if(C===176){const X=N/127;P===1&&(R.current.swayAmp=.5+X*4),P===2&&(R.current.swayRate=.2+X*1.5),P===3&&(R.current.upDownAmp=.1+X*2),P===4&&(R.current.upDownRate=.2+X*1.5),(U=n.current)==null||U.setBarMotion(R.current)}C===144&&g(N>0)},[g]);return Ne.useEffect(()=>(window.midi2Schedule=(O,C)=>{T(O)},()=>{delete window.midi2Schedule}),[T]),Ne.useEffect(()=>{const O=window.location.origin;(async()=>{var P;try{const N=await fetch(`${O}/api/bridge`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic:"stage/scene.get",request:{corpusId:t,sceneId:e}})});if(!N.ok)return;const X=(P=(await N.json()).body)==null?void 0:P.scene;X&&n.current&&n.current.loadExternalScene&&n.current.loadExternalScene(X)}catch{}})()},[t,e]),Ne.useEffect(()=>{const O=window.location.origin,C=async()=>{if(!n.current)return;const N=n.current.snapshot(),U={corpusId:t,sceneId:e,frameMs:N.frameMs??void 0,physicsMs:N.physicsMs??void 0,gpuMs:N.gpuMs??void 0,droppedFrames:N.droppedFrames??void 0};try{await fetch(`${O}/api/bridge`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic:"stage/telemetry.emit",request:U})})}catch{}},P=window.setInterval(C,5e3);return()=>window.clearInterval(P)},[t,e]),Ne.useEffect(()=>{const C=`${window.location.protocol==="https:"?"wss":"ws"}://${window.location.host}/midi2/bridge-socket`;let P=null,N=!1,U=null,X=null;const I=()=>{U!=null&&(window.clearTimeout(U),U=null),X!=null&&(window.clearInterval(X),X=null)},B=()=>{N||U!=null||(U=window.setTimeout(()=>{U=null,H()},1e3))},W=()=>{I(),X=window.setInterval(()=>{performance.now()-E.current>8e3&&P&&P.readyState===WebSocket.OPEN&&(v("bridge: stale, reconnecting"),P.close())},2e3)},ee=()=>{E.current=performance.now(),v("bridge: live")},q=Y=>{var F;if(!Y)return;let re;try{re=JSON.parse(Y)}catch{return}re.heartbeatMs!=null&&ee();const oe=Array.isArray(re.events)?re.events:[];for(const Ee of oe){if(!Ee||!Array.isArray(Ee.bytes))continue;const we=Ee.bytes.map(xe=>Number(xe)&255),ae=typeof Ee.ts=="number"?Ee.ts:void 0;(F=window.midi2Schedule)==null||F.call(window,we,ae)}oe.length>0&&ee()},H=()=>{v("bridge: connecting");try{P=new WebSocket(C)}catch{B();return}P.onopen=()=>{ee(),W()},P.onmessage=Y=>{if(!N){if(typeof Y.data=="string"){q(Y.data);return}if(Y.data instanceof Blob){Y.data.text().then(q).catch(()=>{});return}Y.data instanceof ArrayBuffer&&q(new TextDecoder().decode(Y.data))}},P.onerror=()=>{v("bridge: error, retrying"),I(),P==null||P.close()},P.onclose=()=>{N||(v("bridge: reconnecting"),I(),B())}};return H(),()=>{N=!0,I(),P==null||P.close()}},[]),Ne.useEffect(()=>{let O=!1;return fetch("/midi2/capabilities").then(C=>C.json()).then(C=>{if(O)return;const P=C.ok?`caps: scheduler=${C.scheduler??"unknown"} version=${C.version??""}`:"caps unavailable";u(P)}).catch(()=>{O||u("caps unavailable")}),()=>{O=!0}},[]),dt.jsx("div",{style:{display:"flex",flexDirection:"column",height:"100vh",backgroundColor:"#f4ead6"},children:dt.jsx("main",{style:{flex:1,display:"flex",flexDirection:"column"},children:dt.jsxs("div",{style:{flex:1,position:"relative"},children:[s&&dt.jsx($R,{snapshot:s,showRestOverlay:x}),dt.jsxs("div",{style:{position:"absolute",right:12,top:12,display:"flex",gap:8},children:[dt.jsx("button",{type:"button","aria-label":"Toggle rest pose overlay","aria-pressed":x,onClick:()=>M(O=>!O),style:{width:28,height:28,borderRadius:"50%",border:"1px solid rgba(0,0,0,0.3)",background:x?"rgba(30, 136, 229, 0.15)":"rgba(0,0,0,0.05)",cursor:"pointer",fontSize:14,fontWeight:600,color:"#0d47a1"},title:"Rest pose overlay",children:"⧉"}),dt.jsx("div",{style:{padding:"4px 8px",borderRadius:6,background:"rgba(0,0,0,0.05)",border:"1px solid rgba(0,0,0,0.1)",fontSize:12,color:"#0d47a1"},title:"midi2 bridge status",children:c}),dt.jsx("div",{style:{padding:"4px 8px",borderRadius:6,background:"rgba(0,0,0,0.05)",border:"1px solid rgba(0,0,0,0.1)",fontSize:12,color:"#0d47a1"},title:"midi2 bridge",children:p}),h&&dt.jsx("div",{style:{padding:"4px 8px",borderRadius:6,background:"rgba(0,0,0,0.05)",border:"1px solid rgba(0,0,0,0.1)",fontSize:12,color:"#0d47a1"},title:"midi2 capabilities",children:h}),a&&dt.jsxs("div",{role:"status","aria-live":"polite","aria-label":`Teatro Scenario ${a.state}; run ${a.runID}; accepted software UMP operations ${a.acceptedSoftwareUmpOperations}; MIDI-CI ${a.midiCiStatus}; hardware interoperability ${a.hardwareInteroperability?"claimed":"not claimed"}`,"data-teatro-scenario-projection":a.state,"data-teatro-scenario-run-id":a.runID,style:{padding:"4px 8px",borderRadius:6,background:"rgba(0,0,0,0.08)",border:"1px solid rgba(0,0,0,0.16)",fontSize:12,color:"#0d47a1"},children:["Teatro · ",a.state," · wind ",((V=a.windMix)==null?void 0:V.toFixed(2))??"—"," · UMP ",a.acceptedSoftwareUmpOperations]}),dt.jsx("button",{type:"button","aria-label":"Info",onClick:()=>y(!0),style:{width:28,height:28,borderRadius:"50%",border:"1px solid rgba(0,0,0,0.3)",background:"rgba(0,0,0,0.05)",cursor:"pointer",fontSize:14,fontWeight:600},children:"i"})]}),m&&dt.jsx(KR,{snapshot:s,onHide:()=>y(!1)})]})})})};class oC extends s_.Component{constructor(e){super(e),this.state={hasError:!1,message:void 0}}static getDerivedStateFromError(e){return{hasError:!0,message:e==null?void 0:e.message}}componentDidCatch(e,t){console.error("Stage app error",e,t)}render(){return this.state.hasError?dt.jsxs("div",{style:{padding:24,fontFamily:"system-ui, -apple-system, BlinkMacSystemFont, sans-serif",color:"#111",background:"#f4ead6",height:"100vh"},children:[dt.jsx("h3",{children:"Stage app crashed"}),dt.jsx("p",{children:this.state.message??"Unknown error"}),dt.jsx("p",{children:"Reload to retry. If this persists, the build is broken."})]}):this.props.children}}const Om=document.getElementById("root");Om&&Uu.createRoot(Om).render(dt.jsx(oC,{children:dt.jsx(sC,{})}));
