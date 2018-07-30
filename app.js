(function () {
	'use strict';

	/*! (c) Andrea Giammarchi (ISC) */var hyperHTML=function(e){var t=document.defaultView,r=/^area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr$/i,l="ownerSVGElement",c="http://www.w3.org/2000/svg",s="connected",f="dis"+s,d=/^style|textarea$/i,b="_hyper: "+(Math.random()*new Date|0)+";",h="\x3c!--"+b+"--\x3e",v=t.Event;try{new v("Event");}catch(e){v=function(e){var t=document.createEvent("Event");return t.initEvent(e,!1,!1),t};}var n,i=t.Map||function(){var n=[],r=[];return {get:function(e){return r[n.indexOf(e)]},set:function(e,t){r[n.push(e)-1]=t;}}},o=0,p=t.WeakMap||function(){var n=b+o++;return {get:function(e){return e[n]},set:function(e,t){Object.defineProperty(e,n,{configurable:!0,value:t});}}},a=t.WeakSet||function(){var t=new p;return {add:function(e){t.set(e,!0);},has:function(e){return !0===t.get(e)}}},m=Array.isArray||(n={}.toString,function(e){return "[object Array]"===n.call(e)}),g=b.trim||function(){return this.replace(/^\s+|\s+$/g,"")};function w(){return this}var u=function(e,t){var n="_"+e+"$";return {get:function(){return this[n]||(this[e]=t.call(this,e))},set:function(e){Object.defineProperty(this,n,{configurable:!0,value:e});}}},y={},N=[],x=y.hasOwnProperty,E=0,C=function(e,t){e in y||(E=N.push(e)),y[e]=t;},j=function(e,t){for(var n=0;n<E;n++){var r=N[n];if(x.call(e,r))return y[r](e[r],t)}},A=function(e,t){return T(e).createElement(t)},T=function(e){return e.ownerDocument||e},S=function(e){return T(e).createDocumentFragment()},L=function(e,t){return T(e).createTextNode(t)},O=" \\f\\n\\r\\t",k="[^ "+O+"\\/>\"'=]+",M="[ "+O+"]+"+k,D="<([A-Za-z]+[A-Za-z0-9:_-]*)((?:",$="(?:=(?:'[^']*?'|\"[^\"]*?\"|<[^>]*?>|"+k+"))?)",P=new RegExp(D+M+$+"+)([ "+O+"]*/?>)","g"),B=new RegExp(D+M+$+"*)([ "+O+"]*/>)","g"),R=S(document),H="append"in R,_="content"in A(document,"template");R.appendChild(L(R,"g")),R.appendChild(L(R,""));var z=1===R.cloneNode(!0).childNodes.length,F="importNode"in document,Z=H?function(e,t){e.append.apply(e,t);}:function(e,t){for(var n=t.length,r=0;r<n;r++)e.appendChild(t[r]);},I=new RegExp("("+M+"=)(['\"]?)"+h+"\\2","gi"),V=function(e,t,n,r){return "<"+t+n.replace(I,W)+r},W=function(e,t,n){return t+(n||'"')+b+(n||'"')},q=function(e,t){return (l in e?Y:X)(e,t.replace(P,V))},G=z?function(e){for(var t=e.cloneNode(),n=e.childNodes||[],r=n.length,i=0;i<r;i++)t.appendChild(G(n[i]));return t}:function(e){return e.cloneNode(!0)},J=F?function(e,t){return e.importNode(t,!0)}:function(e,t){return G(t)},K=[].slice,Q=function(e){return U(e)},U=function(e){if(e.propertyIsEnumerable("raw")||/Firefox\/(\d+)/.test((t.navigator||{}).userAgent)&&parseFloat(RegExp.$1)<55){var n={};U=function(e){var t="^"+e.join("^");return n[t]||(n[t]=e)};}else U=function(e){return e};return U(e)},X=_?function(e,t){var n=A(e,"template");return n.innerHTML=t,n.content}:function(e,t){var n=A(e,"template"),r=S(e);if(/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(t)){var i=RegExp.$1;n.innerHTML="<table>"+t+"</table>",Z(r,K.call(n.querySelectorAll(i)));}else n.innerHTML=t,Z(r,K.call(n.childNodes));return r},Y=_?function(e,t){var n=S(e),r=T(e).createElementNS(c,"svg");return r.innerHTML=t,Z(n,K.call(r.childNodes)),n}:function(e,t){var n=S(e),r=A(e,"div");return r.innerHTML='<svg xmlns="'+c+'">'+t+"</svg>",Z(n,K.call(r.firstChild.childNodes)),n};function ee(e){this.childNodes=e,this.length=e.length,this.first=e[0],this.last=e[this.length-1];}ee.prototype.insert=function(){var e=S(this.first);return Z(e,this.childNodes),e},ee.prototype.remove=function(){var e=this.first,t=this.last;if(2===this.length)t.parentNode.removeChild(t);else{var n=T(e).createRange();n.setStartBefore(this.childNodes[1]),n.setEndAfter(t),n.deleteContents();}return e};var te=function(e,t,n){e.unshift(e.indexOf.call(t.childNodes,n));},ne=function(e,t,n){return {type:e,name:n,node:t,path:function(e){var t=[],n=void 0;switch(e.nodeType){case 1:case 11:n=e;break;case 8:n=e.parentNode,te(t,n,e);break;default:n=e.ownerElement;}for(e=n;n=n.parentNode;e=n)te(t,n,e);return t}(t)}},re=function(e,t){for(var n=t.length,r=0;r<n;r++)e=e.childNodes[t[r]];return e},ie=/acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i,oe=function(o,a){var u=void 0,l=void 0;return function(e){switch(typeof e){case"object":if(e){if("object"===u){if(!a&&l!==e)for(var t in l)t in e||(o[t]="");}else a?o.value="":o.cssText="";var n=a?{}:o;for(var r in e){var i=e[r];n[r]="number"!=typeof i||ie.test(r)?i:i+"px";}u="object",a?o.value=le(l=n):l=e;break}default:l!=e&&(u="string",l=e,a?o.value=e||"":o.cssText=e||"");}}},ae=/([^A-Z])([A-Z]+)/g,ue=function(e,t,n){return t+"-"+n.toLowerCase()},le=function(e){var t=[];for(var n in e)t.push(n.replace(ae,ue),":",e[n],";");return t.join("")},ce=function(e,t){return e==t},se=function(e){return e},fe=function(e,t,n,r){if(null==r)t.removeChild(e(n,-1));else{var i=t.ownerDocument.createRange();i.setStartBefore(e(n,-1)),i.setEndAfter(e(r,-1)),i.deleteContents();}},de=function(e,t,n,r){r||(r={});for(var i=r.compare||ce,o=r.node||se,a=null==r.before?null:o(r.before,0),u=0,l=0,c=t.length-1,s=t[0],f=t[c],d=n.length-1,h=n[0],v=n[d];u<=c&&l<=d;)if(null==s)s=t[++u];else if(null==f)f=t[--c];else if(null==h)h=n[++l];else if(null==v)v=n[--d];else if(i(s,h))s=t[++u],h=n[++l];else if(i(f,v))f=t[--c],v=n[--d];else if(i(s,v))e.insertBefore(o(s,1),o(f,-0).nextSibling),s=t[++u],v=n[--d];else if(i(f,h))e.insertBefore(o(f,1),o(s,0)),f=t[--c],h=n[++l];else{var p=t.indexOf(h);if(p<0)e.insertBefore(o(h,1),o(s,0)),h=n[++l];else{for(var m=p,g=l;m<=c&&g<=d&&t[m]===n[g];)m++,g++;if(1<m-p)--p===u?e.removeChild(o(s,-1)):fe(o,e,s,t[p]),l=g,s=t[u=m],h=n[g];else{var b=t[p];t[p]=null,e.insertBefore(o(b,1),o(s,0)),h=n[++l];}}}if(u<=c||l<=d)if(c<u){var w=n[d+1],y=null==w?a:o(w,0);if(l===d)e.insertBefore(o(n[l],1),y);else{for(var N=e.ownerDocument.createDocumentFragment();l<=d;)N.appendChild(o(n[l++],1));e.insertBefore(N,y);}}else null==t[u]&&u++,u===c?e.removeChild(o(t[u],-1)):fe(o,e,t[u],t[c]);return n},he=new a;function ve(){}ve.prototype=Object.create(null);var pe=function(e){return {html:e}},me=function e(t,n){return "ELEMENT_NODE"in t?t:t.constructor===ee?1/n<0?n?t.remove():t.last:n?t.insert():t.first:e(t.render(),n)},ge=function(e,t,n){for(var r=new ve,i=e.attributes,o=K.call(i),a=[],u=o.length,l=0;l<u;l++){var c=o[l];if(c.value===b){var s=c.name;if(!(s in r)){var f=n.shift().replace(/^(?:|[\S\s]*?\s)(\S+?)=['"]?$/,"$1");r[s]=i[f]||i[f.toLowerCase()],t.push(ne("attr",r[s],f));}a.push(c);}}for(var d=a.length,h=0;h<d;h++){var v=a[h];/^id$/i.test(v.name)?e.removeAttribute(v.name):e.removeAttributeNode(a[h]);}var p=e.nodeName;if(/^script$/i.test(p)){for(var m=document.createElement(p),g=0;g<i.length;g++)m.setAttributeNode(i[g].cloneNode(!0));m.textContent=e.textContent,e.parentNode.replaceChild(m,e);}},be=function(e,t){t(e.placeholder),"text"in e?Promise.resolve(e.text).then(String).then(t):"any"in e?Promise.resolve(e.any).then(t):"html"in e?Promise.resolve(e.html).then(pe).then(t):Promise.resolve(j(e,t)).then(t);},we=function(e){return null!=e&&"then"in e},ye=function(r,i){var o={node:me,before:r},a=!1,u=void 0;return function e(t){switch(typeof t){case"string":case"number":case"boolean":a?u!==t&&(u=t,i[0].textContent=t):(a=!0,u=t,i=de(r.parentNode,i,[L(r,t)],o));break;case"object":case"undefined":if(null==t){a=!1,i=de(r.parentNode,i,[],o);break}default:if(a=!1,m(u=t))if(0===t.length)i.length&&(i=de(r.parentNode,i,[],o));else switch(typeof t[0]){case"string":case"number":case"boolean":e({html:t});break;case"object":if(m(t[0])&&(t=t.concat.apply([],t)),we(t[0])){Promise.all(t).then(e);break}default:i=de(r.parentNode,i,t,o);}else"ELEMENT_NODE"in(n=t)||n instanceof ee||n instanceof w?i=de(r.parentNode,i,11===t.nodeType?K.call(t.childNodes):[t],o):we(t)?t.then(e):"placeholder"in t?be(t,e):"text"in t?e(String(t.text)):"any"in t?e(t.any):"html"in t?i=de(r.parentNode,i,K.call(q(r,[].concat(t.html).join("")).childNodes),o):e("length"in t?K.call(t):j(t,e));}var n;}},Ne=function(t,n,e){var r=l in t,i=void 0;if("style"===n)return function(e,t,n){if(n){var r=t.cloneNode(!0);return r.value="",e.setAttributeNode(r),oe(r,n)}return oe(e.style,n)}(t,e,r);if(/^on/.test(n)){var o=n.slice(2);return o===s||o===f?(Ce&&(Ce=!1,function(){var i=function(e,t){for(var n=new v(t),r=e.length,i=0;i<r;i++){var o=e[i];1===o.nodeType&&a(o,n);}},a=function e(t,n){he.has(t)&&t.dispatchEvent(n);for(var r=t.children||function(e){for(var t=[],n=e.childNodes,r=n.length,i=0;i<r;i++)1===n[i].nodeType&&t.push(n[i]);return t}(t),i=r.length,o=0;o<i;o++)e(r[o],n);};try{new MutationObserver(function(e){for(var t=e.length,n=0;n<t;n++){var r=e[n];i(r.removedNodes,f),i(r.addedNodes,s);}}).observe(document,{subtree:!0,childList:!0});}catch(e){document.addEventListener("DOMNodeRemoved",function(e){i([e.target],f);},!1),document.addEventListener("DOMNodeInserted",function(e){i([e.target],s);},!1);}}()),he.add(t)):n.toLowerCase()in t&&(o=o.toLowerCase()),function(e){i!==e&&(i&&t.removeEventListener(o,i,!1),(i=e)&&t.addEventListener(o,e,!1));}}if("data"===n||!r&&n in t)return function(e){i!==e&&(i=e,t[n]!==e&&null==(t[n]=e)&&t.removeAttribute(n));};var a=!1,u=e.cloneNode(!0);return function(e){i!==e&&(i=e,u.value!==e&&(null==e?(a&&(a=!1,t.removeAttributeNode(u)),u.value=e):(u.value=e,a||(a=!0,t.setAttributeNode(u)))));}},xe=function(n){var r=void 0;return function e(t){r!==t&&("object"==typeof(r=t)&&t?we(t)?t.then(e):"placeholder"in t?be(t,e):e("text"in t?String(t.text):"any"in t?t.any:"html"in t?[].concat(t.html).join(""):"length"in t?K.call(t).join(""):j(t,e)):n.textContent=null==t?"":t);}},Ee={create:function(e,t){for(var n=[],r=t.length,i=0;i<r;i++){var o=t[i],a=re(e,o.path);switch(o.type){case"any":n.push(ye(a,[]));break;case"attr":n.push(Ne(a,o.name,o.node));break;case"text":n.push(xe(a)),a.textContent="";}}return n},find:function e(t,n,r){for(var i=t.childNodes,o=i.length,a=0;a<o;a++){var u=i[a];switch(u.nodeType){case 1:ge(u,n,r),e(u,n,r);break;case 8:u.textContent===b&&(r.shift(),n.push(d.test(t.nodeName)?ne("text",t):ne("any",u)));break;case 3:d.test(t.nodeName)&&g.call(u.textContent)===h&&(r.shift(),n.push(ne("text",t)));}}}},Ce=!0;var je=new p,Ae=function(){try{var e=new p,t=Object.freeze([]);if(e.set(t,!0),!e.get(t))throw t;return e}catch(t){return new i}}();function Te(e){var t=je.get(this);return t&&t.template===Q(e)?Se.apply(t.updates,arguments):function(e){e=Q(e);var t=Ae.get(e)||function(e){var t=[],n=e.join(h).replace(De,$e),r=q(this,n);Ee.find(r,t,e.slice());var i={fragment:r,paths:t};return Ae.set(e,i),i}.call(this,e),n=J(this.ownerDocument,t.fragment),r=Ee.create(n,t.paths);je.set(this,{template:e,updates:r}),Se.apply(r,arguments),this.textContent="",this.appendChild(n);}.apply(this,arguments),this}function Se(){for(var e=arguments.length,t=1;t<e;t++)this[t-1](arguments[t]);}var Le,Oe,ke,Me,De=B,$e=function(e,t,n){return r.test(t)?e:"<"+t+n+"></"+t+">"},Pe=new p,Be=function(n){var r=void 0,i=void 0,o=void 0,a=void 0,u=void 0;return function(e){e=Q(e);var t=a!==e;return t&&(a=e,o=S(document),i="svg"===n?document.createElementNS(c,"svg"):o,u=Te.bind(i)),u.apply(null,arguments),t&&("svg"===n&&Z(o,K.call(i.childNodes)),r=He(o)),r}},Re=function(e,t){var n=t.indexOf(":"),r=Pe.get(e),i=t;return -1<n&&(i=t.slice(n+1),t=t.slice(0,n)||"html"),r||Pe.set(e,r={}),r[i]||(r[i]=Be(t))},He=function(e){for(var t=e.childNodes,n=t.length,r=[],i=0;i<n;i++){var o=t[i];1!==o.nodeType&&0===g.call(o.textContent).length||r.push(o);}return 1===r.length?r[0]:new ee(r)},_e=C;function ze(e){return arguments.length<2?null==e?Be("html"):"string"==typeof e?ze.wire(null,e):"raw"in e?Be("html")(e):"nodeType"in e?ze.bind(e):Re(e,"html"):("raw"in e?Be("html"):ze.wire).apply(null,arguments)}return ze.Component=w,ze.bind=function(e){return Te.bind(e)},ze.define=_e,ze.diff=de,(ze.hyper=ze).wire=function(e,t){return null==e?Be(t||"html"):Re(e,t||"html")},Le=Be,Oe=new p,ke=Object.create,Me=function(e,t){var n={w:null,p:null};return t.set(e,n),n},Object.defineProperties(w,{for:{configurable:!0,value:function(e,t){return function(e,t,n,r){var i,o,a,u=t.get(e)||Me(e,t);switch(typeof r){case"object":case"function":var l=u.w||(u.w=new p);return l.get(r)||(i=l,o=r,a=new e(n),i.set(o,a),a);default:var c=u.p||(u.p=ke(null));return c[r]||(c[r]=new e(n))}}(this,Oe.get(e)||(n=e,r=new i,Oe.set(n,r),r),e,null==t?"default":t);var n,r;}}}),Object.defineProperties(w.prototype,{handleEvent:{value:function(e){var t=e.currentTarget;this["getAttribute"in t&&t.getAttribute("data-call")||"on"+e.type](e);}},html:u("html",Le),svg:u("svg",Le),state:u("state",function(){return this.defaultState}),defaultState:{get:function(){return {}}},setState:{value:function(e,t){var n=this.state,r="function"==typeof e?e.call(this,n):e;for(var i in r)n[i]=r[i];return !1!==t&&this.render(),this}}}),ze}(window);
	const {Component, bind, define, diff, hyper, wire} = hyperHTML;

	function symbolObservablePonyfill(root) {
		var result;
		var Symbol = root.Symbol;

		if (typeof Symbol === 'function') {
			if (Symbol.observable) {
				result = Symbol.observable;
			} else {
				result = Symbol('observable');
				Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}

		return result;
	}

	/* global window */

	var root;

	if (typeof self !== 'undefined') {
	  root = self;
	} else if (typeof window !== 'undefined') {
	  root = window;
	} else if (typeof global !== 'undefined') {
	  root = global;
	} else if (typeof module !== 'undefined') {
	  root = module;
	} else {
	  root = Function('return this')();
	}

	var result = symbolObservablePonyfill(root);

	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = {
	  INIT: '@@redux/INIT' + Math.random().toString(36).substring(7).split('').join('.'),
	  REPLACE: '@@redux/REPLACE' + Math.random().toString(36).substring(7).split('').join('.')
	};

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

	/**
	 * @param {any} obj The object to inspect.
	 * @returns {boolean} True if the argument appears to be a plain object.
	 */
	function isPlainObject(obj) {
	  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj === null) return false;

	  var proto = obj;
	  while (Object.getPrototypeOf(proto) !== null) {
	    proto = Object.getPrototypeOf(proto);
	  }

	  return Object.getPrototypeOf(obj) === proto;
	}

	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [preloadedState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	function createStore(reducer, preloadedState, enhancer) {
	  var _ref2;

	  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
	    enhancer = preloadedState;
	    preloadedState = undefined;
	  }

	  if (typeof enhancer !== 'undefined') {
	    if (typeof enhancer !== 'function') {
	      throw new Error('Expected the enhancer to be a function.');
	    }

	    return enhancer(createStore)(reducer, preloadedState);
	  }

	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }

	  var currentReducer = reducer;
	  var currentState = preloadedState;
	  var currentListeners = [];
	  var nextListeners = currentListeners;
	  var isDispatching = false;

	  function ensureCanMutateNextListeners() {
	    if (nextListeners === currentListeners) {
	      nextListeners = currentListeners.slice();
	    }
	  }

	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    if (isDispatching) {
	      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
	    }

	    return currentState;
	  }

	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * You may call `dispatch()` from a change listener, with the following
	   * caveats:
	   *
	   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
	   * If you subscribe or unsubscribe while the listeners are being invoked, this
	   * will not have any effect on the `dispatch()` that is currently in progress.
	   * However, the next `dispatch()` call, whether nested or not, will use a more
	   * recent snapshot of the subscription list.
	   *
	   * 2. The listener should not expect to see all state changes, as the state
	   * might have been updated multiple times during a nested `dispatch()` before
	   * the listener is called. It is, however, guaranteed that all subscribers
	   * registered before the `dispatch()` started will be called with the latest
	   * state by the time it exits.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('Expected the listener to be a function.');
	    }

	    if (isDispatching) {
	      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
	    }

	    var isSubscribed = true;

	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);

	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }

	      if (isDispatching) {
	        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
	      }

	      isSubscribed = false;

	      ensureCanMutateNextListeners();
	      var index = nextListeners.indexOf(listener);
	      nextListeners.splice(index, 1);
	    };
	  }

	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!isPlainObject(action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }

	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }

	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }

	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }

	    var listeners = currentListeners = nextListeners;
	    for (var i = 0; i < listeners.length; i++) {
	      var listener = listeners[i];
	      listener();
	    }

	    return action;
	  }

	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    if (typeof nextReducer !== 'function') {
	      throw new Error('Expected the nextReducer to be a function.');
	    }

	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.REPLACE });
	  }

	  /**
	   * Interoperability point for observable/reactive libraries.
	   * @returns {observable} A minimal observable of state changes.
	   * For more information, see the observable proposal:
	   * https://github.com/tc39/proposal-observable
	   */
	  function observable() {
	    var _ref;

	    var outerSubscribe = subscribe;
	    return _ref = {
	      /**
	       * The minimal observable subscription method.
	       * @param {Object} observer Any object that can be used as an observer.
	       * The observer object should have a `next` method.
	       * @returns {subscription} An object with an `unsubscribe` method that can
	       * be used to unsubscribe the observable from the store, and prevent further
	       * emission of values from the observable.
	       */
	      subscribe: function subscribe(observer) {
	        if ((typeof observer === 'undefined' ? 'undefined' : _typeof(observer)) !== 'object' || observer === null) {
	          throw new TypeError('Expected the observer to be an object.');
	        }

	        function observeState() {
	          if (observer.next) {
	            observer.next(getState());
	          }
	        }

	        observeState();
	        var unsubscribe = outerSubscribe(observeState);
	        return { unsubscribe: unsubscribe };
	      }
	    }, _ref[result] = function () {
	      return this;
	    }, _ref;
	  }

	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });

	  return _ref2 = {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  }, _ref2[result] = observable, _ref2;
	}

	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionDescription = actionType && 'action "' + String(actionType) + '"' || 'an action';

	  return 'Given ' + actionDescription + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
	}

	function assertReducerShape(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: ActionTypes.INIT });

	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined. If you don\'t want to set a value for this reducer, ' + 'you can use null instead of undefined.');
	    }

	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined, but can be null.');
	    }
	  });
	}

	/**
	 * Turns an object whose values are different reducer functions, into a single
	 * reducer function. It will call every child reducer, and gather their results
	 * into a single state object, whose keys correspond to the keys of the passed
	 * reducer functions.
	 *
	 * @param {Object} reducers An object whose values correspond to different
	 * reducer functions that need to be combined into one. One handy way to obtain
	 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
	 * undefined for any action. Instead, they should return their initial state
	 * if the state passed to them was undefined, and the current state for any
	 * unrecognized action.
	 *
	 * @returns {Function} A reducer function that invokes every reducer inside the
	 * passed object, and builds a state object with the same shape.
	 */
	function combineReducers(reducers) {
	  var reducerKeys = Object.keys(reducers);
	  var finalReducers = {};
	  for (var i = 0; i < reducerKeys.length; i++) {
	    var key = reducerKeys[i];

	    if (typeof reducers[key] === 'function') {
	      finalReducers[key] = reducers[key];
	    }
	  }
	  var finalReducerKeys = Object.keys(finalReducers);

	  var shapeAssertionError = void 0;
	  try {
	    assertReducerShape(finalReducers);
	  } catch (e) {
	    shapeAssertionError = e;
	  }

	  return function combination() {
	    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var action = arguments[1];

	    if (shapeAssertionError) {
	      throw shapeAssertionError;
	    }

	    var hasChanged = false;
	    var nextState = {};
	    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
	      var _key = finalReducerKeys[_i];
	      var reducer = finalReducers[_key];
	      var previousStateForKey = state[_key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(_key, action);
	        throw new Error(errorMessage);
	      }
	      nextState[_key] = nextStateForKey;
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	    }
	    return hasChanged ? nextState : state;
	  };
	}

	/**
	 * Composes single-argument functions from right to left. The rightmost
	 * function can take multiple arguments as it provides the signature for
	 * the resulting composite function.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing the argument functions
	 * from right to left. For example, compose(f, g, h) is identical to doing
	 * (...args) => f(g(h(...args))).
	 */

	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }

	  if (funcs.length === 0) {
	    return function (arg) {
	      return arg;
	    };
	  }

	  if (funcs.length === 1) {
	    return funcs[0];
	  }

	  return funcs.reduce(function (a, b) {
	    return function () {
	      return a(b.apply(undefined, arguments));
	    };
	  });
	}

	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */
	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }

	  return function (createStore) {
	    return function () {
	      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      var store = createStore.apply(undefined, args);
	      var _dispatch = function dispatch() {
	        throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
	      };

	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch() {
	          return _dispatch.apply(undefined, arguments);
	        }
	      };
	      var chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = compose.apply(undefined, chain)(store.dispatch);

	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

	const reducer1 = (state = {text : 'reducer'}, action) => {
	    switch (action.type) {
	        case 1:
	            return Object.assign({}, state, {
	                text: action.text
	            })
	        case 'pending':
	            return Object.assign({}, state, {
	                text: 'Pending'
	            })
	        default:            return state
	    }
	};
	const reducer2 = (state = {}, action) => {
	    switch (action.type) {
	        case 2:
	            return Object.assign({}, state, {
	                text: action.text
	            })
	        default:            return state
	    }
	};

	const apiMiddleware = store => next => action => {
	    if (action.type !== 2) {
	        return next(action);
	    }

	    store.dispatch({type: 1, text: 'pending'});

	    return new Promise(resolver => {
	        setTimeout(() => {
	            resolver(action.text);
	        }, 1000);
	    }).then(d => {
	        store.dispatch({ type: 1, text: d });
	    }).catch(err => {
	        dispatch({ type: 'err', text: 'err' });
	    });
	};

	const store = createStore(combineReducers({ reducer1, reducer2 }), { reducer1: {text: 'front'}}, applyMiddleware(apiMiddleware));


	class Redux extends HTMLElement {
	    static get observedAttributes() {
	        return ['label'];
	    }
	    constructor(...args) {
	        super(...args);
	        this.html = bind(this);
	        window.store = store;
	        this.store = store;
	        this.state = this.store.getState().reducer1;
	        store.subscribe((() => {
	            this.state = store.getState().reducer1;
	            this.render();
	        }));
	    }
	    handleEvent(e) {
	        if (e.type === 'click') {
	            this.onclick(e);
	        }
	    }
	    onclick(e) {
	        this.store.dispatch({ type: 1, text: Math.random() * 2 > 1 ? '2' : 'fff' });
	    }
	    attributeChangedCallback() {
	        this.render();
	    }
	    connectedCallback() {
	        this.render();
	    }
	    render() {
	        return this.html`
            <div class=${"container " + this.state.text} onclick=${this}>
            <div class="f" ><span>front</span></div>
            <div class="b"><span>back</span></div>
            </div>
        `;
	    }
	}

	customElements.define('hyper-redux', Redux);

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function isFunction(x) {
	    return typeof x === 'function';
	}

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var _enable_super_gross_mode_that_will_cause_bad_things = false;
	var config = {
	    Promise: undefined,
	    set useDeprecatedSynchronousErrorHandling(value) {
	        if (value) {
	            var error = /*@__PURE__*/ new Error();
	            /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
	        }
	        else if (_enable_super_gross_mode_that_will_cause_bad_things) {
	            /*@__PURE__*/ console.log('RxJS: Back to a better error behavior. Thank you. <3');
	        }
	        _enable_super_gross_mode_that_will_cause_bad_things = value;
	    },
	    get useDeprecatedSynchronousErrorHandling() {
	        return _enable_super_gross_mode_that_will_cause_bad_things;
	    },
	};

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function hostReportError(err) {
	    setTimeout(function () { throw err; });
	}

	/** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
	var empty = {
	    closed: true,
	    next: function (value) { },
	    error: function (err) {
	        if (config.useDeprecatedSynchronousErrorHandling) {
	            throw err;
	        }
	        else {
	            hostReportError(err);
	        }
	    },
	    complete: function () { }
	};

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function isObject(x) {
	    return x != null && typeof x === 'object';
	}

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var errorObject = { e: {} };

	/** PURE_IMPORTS_START _errorObject PURE_IMPORTS_END */
	var tryCatchTarget;
	function tryCatcher() {
	    try {
	        return tryCatchTarget.apply(this, arguments);
	    }
	    catch (e) {
	        errorObject.e = e;
	        return errorObject;
	    }
	}
	function tryCatch(fn) {
	    tryCatchTarget = fn;
	    return tryCatcher;
	}

	/** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
	var UnsubscriptionError = /*@__PURE__*/ (function (_super) {
	    __extends(UnsubscriptionError, _super);
	    function UnsubscriptionError(errors) {
	        var _this = _super.call(this, errors ?
	            errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '') || this;
	        _this.errors = errors;
	        _this.name = 'UnsubscriptionError';
	        Object.setPrototypeOf(_this, UnsubscriptionError.prototype);
	        return _this;
	    }
	    return UnsubscriptionError;
	}(Error));

	/** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_tryCatch,_util_errorObject,_util_UnsubscriptionError PURE_IMPORTS_END */
	var Subscription = /*@__PURE__*/ (function () {
	    function Subscription(unsubscribe) {
	        this.closed = false;
	        this._parent = null;
	        this._parents = null;
	        this._subscriptions = null;
	        if (unsubscribe) {
	            this._unsubscribe = unsubscribe;
	        }
	    }
	    Subscription.prototype.unsubscribe = function () {
	        var hasErrors = false;
	        var errors;
	        if (this.closed) {
	            return;
	        }
	        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
	        this.closed = true;
	        this._parent = null;
	        this._parents = null;
	        this._subscriptions = null;
	        var index = -1;
	        var len = _parents ? _parents.length : 0;
	        while (_parent) {
	            _parent.remove(this);
	            _parent = ++index < len && _parents[index] || null;
	        }
	        if (isFunction(_unsubscribe)) {
	            var trial = tryCatch(_unsubscribe).call(this);
	            if (trial === errorObject) {
	                hasErrors = true;
	                errors = errors || (errorObject.e instanceof UnsubscriptionError ?
	                    flattenUnsubscriptionErrors(errorObject.e.errors) : [errorObject.e]);
	            }
	        }
	        if (isArray(_subscriptions)) {
	            index = -1;
	            len = _subscriptions.length;
	            while (++index < len) {
	                var sub = _subscriptions[index];
	                if (isObject(sub)) {
	                    var trial = tryCatch(sub.unsubscribe).call(sub);
	                    if (trial === errorObject) {
	                        hasErrors = true;
	                        errors = errors || [];
	                        var err = errorObject.e;
	                        if (err instanceof UnsubscriptionError) {
	                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
	                        }
	                        else {
	                            errors.push(err);
	                        }
	                    }
	                }
	            }
	        }
	        if (hasErrors) {
	            throw new UnsubscriptionError(errors);
	        }
	    };
	    Subscription.prototype.add = function (teardown) {
	        if (!teardown || (teardown === Subscription.EMPTY)) {
	            return Subscription.EMPTY;
	        }
	        if (teardown === this) {
	            return this;
	        }
	        var subscription = teardown;
	        switch (typeof teardown) {
	            case 'function':
	                subscription = new Subscription(teardown);
	            case 'object':
	                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
	                    return subscription;
	                }
	                else if (this.closed) {
	                    subscription.unsubscribe();
	                    return subscription;
	                }
	                else if (typeof subscription._addParent !== 'function') {
	                    var tmp = subscription;
	                    subscription = new Subscription();
	                    subscription._subscriptions = [tmp];
	                }
	                break;
	            default:
	                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
	        }
	        var subscriptions = this._subscriptions || (this._subscriptions = []);
	        subscriptions.push(subscription);
	        subscription._addParent(this);
	        return subscription;
	    };
	    Subscription.prototype.remove = function (subscription) {
	        var subscriptions = this._subscriptions;
	        if (subscriptions) {
	            var subscriptionIndex = subscriptions.indexOf(subscription);
	            if (subscriptionIndex !== -1) {
	                subscriptions.splice(subscriptionIndex, 1);
	            }
	        }
	    };
	    Subscription.prototype._addParent = function (parent) {
	        var _a = this, _parent = _a._parent, _parents = _a._parents;
	        if (!_parent || _parent === parent) {
	            this._parent = parent;
	        }
	        else if (!_parents) {
	            this._parents = [parent];
	        }
	        else if (_parents.indexOf(parent) === -1) {
	            _parents.push(parent);
	        }
	    };
	    Subscription.EMPTY = (function (empty) {
	        empty.closed = true;
	        return empty;
	    }(new Subscription()));
	    return Subscription;
	}());
	function flattenUnsubscriptionErrors(errors) {
	    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
	}

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function')
	    ? /*@__PURE__*/ Symbol.for('rxSubscriber')
	    : '@@rxSubscriber';

	/** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
	var Subscriber = /*@__PURE__*/ (function (_super) {
	    __extends(Subscriber, _super);
	    function Subscriber(destinationOrNext, error, complete) {
	        var _this = _super.call(this) || this;
	        _this.syncErrorValue = null;
	        _this.syncErrorThrown = false;
	        _this.syncErrorThrowable = false;
	        _this.isStopped = false;
	        switch (arguments.length) {
	            case 0:
	                _this.destination = empty;
	                break;
	            case 1:
	                if (!destinationOrNext) {
	                    _this.destination = empty;
	                    break;
	                }
	                if (typeof destinationOrNext === 'object') {
	                    if (isTrustedSubscriber(destinationOrNext)) {
	                        var trustedSubscriber = destinationOrNext[rxSubscriber]();
	                        _this.syncErrorThrowable = trustedSubscriber.syncErrorThrowable;
	                        _this.destination = trustedSubscriber;
	                        trustedSubscriber.add(_this);
	                    }
	                    else {
	                        _this.syncErrorThrowable = true;
	                        _this.destination = new SafeSubscriber(_this, destinationOrNext);
	                    }
	                    break;
	                }
	            default:
	                _this.syncErrorThrowable = true;
	                _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
	                break;
	        }
	        return _this;
	    }
	    Subscriber.prototype[rxSubscriber] = function () { return this; };
	    Subscriber.create = function (next, error, complete) {
	        var subscriber = new Subscriber(next, error, complete);
	        subscriber.syncErrorThrowable = false;
	        return subscriber;
	    };
	    Subscriber.prototype.next = function (value) {
	        if (!this.isStopped) {
	            this._next(value);
	        }
	    };
	    Subscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._error(err);
	        }
	    };
	    Subscriber.prototype.complete = function () {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._complete();
	        }
	    };
	    Subscriber.prototype.unsubscribe = function () {
	        if (this.closed) {
	            return;
	        }
	        this.isStopped = true;
	        _super.prototype.unsubscribe.call(this);
	    };
	    Subscriber.prototype._next = function (value) {
	        this.destination.next(value);
	    };
	    Subscriber.prototype._error = function (err) {
	        this.destination.error(err);
	        this.unsubscribe();
	    };
	    Subscriber.prototype._complete = function () {
	        this.destination.complete();
	        this.unsubscribe();
	    };
	    Subscriber.prototype._unsubscribeAndRecycle = function () {
	        var _a = this, _parent = _a._parent, _parents = _a._parents;
	        this._parent = null;
	        this._parents = null;
	        this.unsubscribe();
	        this.closed = false;
	        this.isStopped = false;
	        this._parent = _parent;
	        this._parents = _parents;
	        return this;
	    };
	    return Subscriber;
	}(Subscription));
	var SafeSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SafeSubscriber, _super);
	    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
	        var _this = _super.call(this) || this;
	        _this._parentSubscriber = _parentSubscriber;
	        var next;
	        var context = _this;
	        if (isFunction(observerOrNext)) {
	            next = observerOrNext;
	        }
	        else if (observerOrNext) {
	            next = observerOrNext.next;
	            error = observerOrNext.error;
	            complete = observerOrNext.complete;
	            if (observerOrNext !== empty) {
	                context = Object.create(observerOrNext);
	                if (isFunction(context.unsubscribe)) {
	                    _this.add(context.unsubscribe.bind(context));
	                }
	                context.unsubscribe = _this.unsubscribe.bind(_this);
	            }
	        }
	        _this._context = context;
	        _this._next = next;
	        _this._error = error;
	        _this._complete = complete;
	        return _this;
	    }
	    SafeSubscriber.prototype.next = function (value) {
	        if (!this.isStopped && this._next) {
	            var _parentSubscriber = this._parentSubscriber;
	            if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
	                this.__tryOrUnsub(this._next, value);
	            }
	            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            var _parentSubscriber = this._parentSubscriber;
	            var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
	            if (this._error) {
	                if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
	                    this.__tryOrUnsub(this._error, err);
	                    this.unsubscribe();
	                }
	                else {
	                    this.__tryOrSetError(_parentSubscriber, this._error, err);
	                    this.unsubscribe();
	                }
	            }
	            else if (!_parentSubscriber.syncErrorThrowable) {
	                this.unsubscribe();
	                if (useDeprecatedSynchronousErrorHandling) {
	                    throw err;
	                }
	                hostReportError(err);
	            }
	            else {
	                if (useDeprecatedSynchronousErrorHandling) {
	                    _parentSubscriber.syncErrorValue = err;
	                    _parentSubscriber.syncErrorThrown = true;
	                }
	                else {
	                    hostReportError(err);
	                }
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.complete = function () {
	        var _this = this;
	        if (!this.isStopped) {
	            var _parentSubscriber = this._parentSubscriber;
	            if (this._complete) {
	                var wrappedComplete = function () { return _this._complete.call(_this._context); };
	                if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
	                    this.__tryOrUnsub(wrappedComplete);
	                    this.unsubscribe();
	                }
	                else {
	                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
	                    this.unsubscribe();
	                }
	            }
	            else {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
	        try {
	            fn.call(this._context, value);
	        }
	        catch (err) {
	            this.unsubscribe();
	            if (config.useDeprecatedSynchronousErrorHandling) {
	                throw err;
	            }
	            else {
	                hostReportError(err);
	            }
	        }
	    };
	    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
	        if (!config.useDeprecatedSynchronousErrorHandling) {
	            throw new Error('bad call');
	        }
	        try {
	            fn.call(this._context, value);
	        }
	        catch (err) {
	            if (config.useDeprecatedSynchronousErrorHandling) {
	                parent.syncErrorValue = err;
	                parent.syncErrorThrown = true;
	                return true;
	            }
	            else {
	                hostReportError(err);
	                return true;
	            }
	        }
	        return false;
	    };
	    SafeSubscriber.prototype._unsubscribe = function () {
	        var _parentSubscriber = this._parentSubscriber;
	        this._context = null;
	        this._parentSubscriber = null;
	        _parentSubscriber.unsubscribe();
	    };
	    return SafeSubscriber;
	}(Subscriber));
	function isTrustedSubscriber(obj) {
	    return obj instanceof Subscriber || ('syncErrorThrowable' in obj && obj[rxSubscriber]);
	}

	/** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
	function toSubscriber(nextOrObserver, error, complete) {
	    if (nextOrObserver) {
	        if (nextOrObserver instanceof Subscriber) {
	            return nextOrObserver;
	        }
	        if (nextOrObserver[rxSubscriber]) {
	            return nextOrObserver[rxSubscriber]();
	        }
	    }
	    if (!nextOrObserver && !error && !complete) {
	        return new Subscriber(empty);
	    }
	    return new Subscriber(nextOrObserver, error, complete);
	}

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var observable = typeof Symbol === 'function' && Symbol.observable || '@@observable';

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function noop() { }

	/** PURE_IMPORTS_START _noop PURE_IMPORTS_END */
	function pipeFromArray(fns) {
	    if (!fns) {
	        return noop;
	    }
	    if (fns.length === 1) {
	        return fns[0];
	    }
	    return function piped(input) {
	        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
	    };
	}

	/** PURE_IMPORTS_START _util_toSubscriber,_internal_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
	var Observable = /*@__PURE__*/ (function () {
	    function Observable(subscribe) {
	        this._isScalar = false;
	        if (subscribe) {
	            this._subscribe = subscribe;
	        }
	    }
	    Observable.prototype.lift = function (operator) {
	        var observable$$1 = new Observable();
	        observable$$1.source = this;
	        observable$$1.operator = operator;
	        return observable$$1;
	    };
	    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
	        var operator = this.operator;
	        var sink = toSubscriber(observerOrNext, error, complete);
	        if (operator) {
	            operator.call(sink, this.source);
	        }
	        else {
	            sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
	                this._subscribe(sink) :
	                this._trySubscribe(sink));
	        }
	        if (config.useDeprecatedSynchronousErrorHandling) {
	            if (sink.syncErrorThrowable) {
	                sink.syncErrorThrowable = false;
	                if (sink.syncErrorThrown) {
	                    throw sink.syncErrorValue;
	                }
	            }
	        }
	        return sink;
	    };
	    Observable.prototype._trySubscribe = function (sink) {
	        try {
	            return this._subscribe(sink);
	        }
	        catch (err) {
	            if (config.useDeprecatedSynchronousErrorHandling) {
	                sink.syncErrorThrown = true;
	                sink.syncErrorValue = err;
	            }
	            sink.error(err);
	        }
	    };
	    Observable.prototype.forEach = function (next, promiseCtor) {
	        var _this = this;
	        promiseCtor = getPromiseCtor(promiseCtor);
	        return new promiseCtor(function (resolve, reject) {
	            var subscription;
	            subscription = _this.subscribe(function (value) {
	                try {
	                    next(value);
	                }
	                catch (err) {
	                    reject(err);
	                    if (subscription) {
	                        subscription.unsubscribe();
	                    }
	                }
	            }, reject, resolve);
	        });
	    };
	    Observable.prototype._subscribe = function (subscriber) {
	        var source = this.source;
	        return source && source.subscribe(subscriber);
	    };
	    Observable.prototype[observable] = function () {
	        return this;
	    };
	    Observable.prototype.pipe = function () {
	        var operations = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            operations[_i] = arguments[_i];
	        }
	        if (operations.length === 0) {
	            return this;
	        }
	        return pipeFromArray(operations)(this);
	    };
	    Observable.prototype.toPromise = function (promiseCtor) {
	        var _this = this;
	        promiseCtor = getPromiseCtor(promiseCtor);
	        return new promiseCtor(function (resolve, reject) {
	            var value;
	            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
	        });
	    };
	    Observable.create = function (subscribe) {
	        return new Observable(subscribe);
	    };
	    return Observable;
	}());
	function getPromiseCtor(promiseCtor) {
	    if (!promiseCtor) {
	        promiseCtor = config.Promise || Promise;
	    }
	    if (!promiseCtor) {
	        throw new Error('no Promise impl found');
	    }
	    return promiseCtor;
	}

	/** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
	var ObjectUnsubscribedError = /*@__PURE__*/ (function (_super) {
	    __extends(ObjectUnsubscribedError, _super);
	    function ObjectUnsubscribedError() {
	        var _this = _super.call(this, 'object unsubscribed') || this;
	        _this.name = 'ObjectUnsubscribedError';
	        Object.setPrototypeOf(_this, ObjectUnsubscribedError.prototype);
	        return _this;
	    }
	    return ObjectUnsubscribedError;
	}(Error));

	/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
	var SubjectSubscription = /*@__PURE__*/ (function (_super) {
	    __extends(SubjectSubscription, _super);
	    function SubjectSubscription(subject, subscriber) {
	        var _this = _super.call(this) || this;
	        _this.subject = subject;
	        _this.subscriber = subscriber;
	        _this.closed = false;
	        return _this;
	    }
	    SubjectSubscription.prototype.unsubscribe = function () {
	        if (this.closed) {
	            return;
	        }
	        this.closed = true;
	        var subject = this.subject;
	        var observers = subject.observers;
	        this.subject = null;
	        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
	            return;
	        }
	        var subscriberIndex = observers.indexOf(this.subscriber);
	        if (subscriberIndex !== -1) {
	            observers.splice(subscriberIndex, 1);
	        }
	    };
	    return SubjectSubscription;
	}(Subscription));

	/** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */
	var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SubjectSubscriber, _super);
	    function SubjectSubscriber(destination) {
	        var _this = _super.call(this, destination) || this;
	        _this.destination = destination;
	        return _this;
	    }
	    return SubjectSubscriber;
	}(Subscriber));
	var Subject = /*@__PURE__*/ (function (_super) {
	    __extends(Subject, _super);
	    function Subject() {
	        var _this = _super.call(this) || this;
	        _this.observers = [];
	        _this.closed = false;
	        _this.isStopped = false;
	        _this.hasError = false;
	        _this.thrownError = null;
	        return _this;
	    }
	    Subject.prototype[rxSubscriber] = function () {
	        return new SubjectSubscriber(this);
	    };
	    Subject.prototype.lift = function (operator) {
	        var subject = new AnonymousSubject(this, this);
	        subject.operator = operator;
	        return subject;
	    };
	    Subject.prototype.next = function (value) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError();
	        }
	        if (!this.isStopped) {
	            var observers = this.observers;
	            var len = observers.length;
	            var copy = observers.slice();
	            for (var i = 0; i < len; i++) {
	                copy[i].next(value);
	            }
	        }
	    };
	    Subject.prototype.error = function (err) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError();
	        }
	        this.hasError = true;
	        this.thrownError = err;
	        this.isStopped = true;
	        var observers = this.observers;
	        var len = observers.length;
	        var copy = observers.slice();
	        for (var i = 0; i < len; i++) {
	            copy[i].error(err);
	        }
	        this.observers.length = 0;
	    };
	    Subject.prototype.complete = function () {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError();
	        }
	        this.isStopped = true;
	        var observers = this.observers;
	        var len = observers.length;
	        var copy = observers.slice();
	        for (var i = 0; i < len; i++) {
	            copy[i].complete();
	        }
	        this.observers.length = 0;
	    };
	    Subject.prototype.unsubscribe = function () {
	        this.isStopped = true;
	        this.closed = true;
	        this.observers = null;
	    };
	    Subject.prototype._trySubscribe = function (subscriber) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError();
	        }
	        else {
	            return _super.prototype._trySubscribe.call(this, subscriber);
	        }
	    };
	    Subject.prototype._subscribe = function (subscriber) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError();
	        }
	        else if (this.hasError) {
	            subscriber.error(this.thrownError);
	            return Subscription.EMPTY;
	        }
	        else if (this.isStopped) {
	            subscriber.complete();
	            return Subscription.EMPTY;
	        }
	        else {
	            this.observers.push(subscriber);
	            return new SubjectSubscription(this, subscriber);
	        }
	    };
	    Subject.prototype.asObservable = function () {
	        var observable = new Observable();
	        observable.source = this;
	        return observable;
	    };
	    Subject.create = function (destination, source) {
	        return new AnonymousSubject(destination, source);
	    };
	    return Subject;
	}(Observable));
	var AnonymousSubject = /*@__PURE__*/ (function (_super) {
	    __extends(AnonymousSubject, _super);
	    function AnonymousSubject(destination, source) {
	        var _this = _super.call(this) || this;
	        _this.destination = destination;
	        _this.source = source;
	        return _this;
	    }
	    AnonymousSubject.prototype.next = function (value) {
	        var destination = this.destination;
	        if (destination && destination.next) {
	            destination.next(value);
	        }
	    };
	    AnonymousSubject.prototype.error = function (err) {
	        var destination = this.destination;
	        if (destination && destination.error) {
	            this.destination.error(err);
	        }
	    };
	    AnonymousSubject.prototype.complete = function () {
	        var destination = this.destination;
	        if (destination && destination.complete) {
	            this.destination.complete();
	        }
	    };
	    AnonymousSubject.prototype._subscribe = function (subscriber) {
	        var source = this.source;
	        if (source) {
	            return this.source.subscribe(subscriber);
	        }
	        else {
	            return Subscription.EMPTY;
	        }
	    };
	    return AnonymousSubject;
	}(Subject));

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	function refCount() {
	    return function refCountOperatorFunction(source) {
	        return source.lift(new RefCountOperator(source));
	    };
	}
	var RefCountOperator = /*@__PURE__*/ (function () {
	    function RefCountOperator(connectable) {
	        this.connectable = connectable;
	    }
	    RefCountOperator.prototype.call = function (subscriber, source) {
	        var connectable = this.connectable;
	        connectable._refCount++;
	        var refCounter = new RefCountSubscriber(subscriber, connectable);
	        var subscription = source.subscribe(refCounter);
	        if (!refCounter.closed) {
	            refCounter.connection = connectable.connect();
	        }
	        return subscription;
	    };
	    return RefCountOperator;
	}());
	var RefCountSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(RefCountSubscriber, _super);
	    function RefCountSubscriber(destination, connectable) {
	        var _this = _super.call(this, destination) || this;
	        _this.connectable = connectable;
	        return _this;
	    }
	    RefCountSubscriber.prototype._unsubscribe = function () {
	        var connectable = this.connectable;
	        if (!connectable) {
	            this.connection = null;
	            return;
	        }
	        this.connectable = null;
	        var refCount = connectable._refCount;
	        if (refCount <= 0) {
	            this.connection = null;
	            return;
	        }
	        connectable._refCount = refCount - 1;
	        if (refCount > 1) {
	            this.connection = null;
	            return;
	        }
	        var connection = this.connection;
	        var sharedConnection = connectable._connection;
	        this.connection = null;
	        if (sharedConnection && (!connection || sharedConnection === connection)) {
	            sharedConnection.unsubscribe();
	        }
	    };
	    return RefCountSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subject,_Observable,_Subscriber,_Subscription,_operators_refCount PURE_IMPORTS_END */
	var ConnectableObservable = /*@__PURE__*/ (function (_super) {
	    __extends(ConnectableObservable, _super);
	    function ConnectableObservable(source, subjectFactory) {
	        var _this = _super.call(this) || this;
	        _this.source = source;
	        _this.subjectFactory = subjectFactory;
	        _this._refCount = 0;
	        _this._isComplete = false;
	        return _this;
	    }
	    ConnectableObservable.prototype._subscribe = function (subscriber) {
	        return this.getSubject().subscribe(subscriber);
	    };
	    ConnectableObservable.prototype.getSubject = function () {
	        var subject = this._subject;
	        if (!subject || subject.isStopped) {
	            this._subject = this.subjectFactory();
	        }
	        return this._subject;
	    };
	    ConnectableObservable.prototype.connect = function () {
	        var connection = this._connection;
	        if (!connection) {
	            this._isComplete = false;
	            connection = this._connection = new Subscription();
	            connection.add(this.source
	                .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
	            if (connection.closed) {
	                this._connection = null;
	                connection = Subscription.EMPTY;
	            }
	            else {
	                this._connection = connection;
	            }
	        }
	        return connection;
	    };
	    ConnectableObservable.prototype.refCount = function () {
	        return refCount()(this);
	    };
	    return ConnectableObservable;
	}(Observable));
	var ConnectableSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(ConnectableSubscriber, _super);
	    function ConnectableSubscriber(destination, connectable) {
	        var _this = _super.call(this, destination) || this;
	        _this.connectable = connectable;
	        return _this;
	    }
	    ConnectableSubscriber.prototype._error = function (err) {
	        this._unsubscribe();
	        _super.prototype._error.call(this, err);
	    };
	    ConnectableSubscriber.prototype._complete = function () {
	        this.connectable._isComplete = true;
	        this._unsubscribe();
	        _super.prototype._complete.call(this);
	    };
	    ConnectableSubscriber.prototype._unsubscribe = function () {
	        var connectable = this.connectable;
	        if (connectable) {
	            this.connectable = null;
	            var connection = connectable._connection;
	            connectable._refCount = 0;
	            connectable._subject = null;
	            connectable._connection = null;
	            if (connection) {
	                connection.unsubscribe();
	            }
	        }
	    };
	    return ConnectableSubscriber;
	}(SubjectSubscriber));
	var RefCountSubscriber$1 = /*@__PURE__*/ (function (_super) {
	    __extends(RefCountSubscriber, _super);
	    function RefCountSubscriber(destination, connectable) {
	        var _this = _super.call(this, destination) || this;
	        _this.connectable = connectable;
	        return _this;
	    }
	    RefCountSubscriber.prototype._unsubscribe = function () {
	        var connectable = this.connectable;
	        if (!connectable) {
	            this.connection = null;
	            return;
	        }
	        this.connectable = null;
	        var refCount$$1 = connectable._refCount;
	        if (refCount$$1 <= 0) {
	            this.connection = null;
	            return;
	        }
	        connectable._refCount = refCount$$1 - 1;
	        if (refCount$$1 > 1) {
	            this.connection = null;
	            return;
	        }
	        var connection = this.connection;
	        var sharedConnection = connectable._connection;
	        this.connection = null;
	        if (sharedConnection && (!connection || sharedConnection === connection)) {
	            sharedConnection.unsubscribe();
	        }
	    };
	    return RefCountSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber,_Subscription,_Observable,_Subject PURE_IMPORTS_END */
	var GroupBySubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(GroupBySubscriber, _super);
	    function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.keySelector = keySelector;
	        _this.elementSelector = elementSelector;
	        _this.durationSelector = durationSelector;
	        _this.subjectSelector = subjectSelector;
	        _this.groups = null;
	        _this.attemptedToUnsubscribe = false;
	        _this.count = 0;
	        return _this;
	    }
	    GroupBySubscriber.prototype._next = function (value) {
	        var key;
	        try {
	            key = this.keySelector(value);
	        }
	        catch (err) {
	            this.error(err);
	            return;
	        }
	        this._group(value, key);
	    };
	    GroupBySubscriber.prototype._group = function (value, key) {
	        var groups = this.groups;
	        if (!groups) {
	            groups = this.groups = new Map();
	        }
	        var group = groups.get(key);
	        var element;
	        if (this.elementSelector) {
	            try {
	                element = this.elementSelector(value);
	            }
	            catch (err) {
	                this.error(err);
	            }
	        }
	        else {
	            element = value;
	        }
	        if (!group) {
	            group = (this.subjectSelector ? this.subjectSelector() : new Subject());
	            groups.set(key, group);
	            var groupedObservable = new GroupedObservable(key, group, this);
	            this.destination.next(groupedObservable);
	            if (this.durationSelector) {
	                var duration = void 0;
	                try {
	                    duration = this.durationSelector(new GroupedObservable(key, group));
	                }
	                catch (err) {
	                    this.error(err);
	                    return;
	                }
	                this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
	            }
	        }
	        if (!group.closed) {
	            group.next(element);
	        }
	    };
	    GroupBySubscriber.prototype._error = function (err) {
	        var groups = this.groups;
	        if (groups) {
	            groups.forEach(function (group, key) {
	                group.error(err);
	            });
	            groups.clear();
	        }
	        this.destination.error(err);
	    };
	    GroupBySubscriber.prototype._complete = function () {
	        var groups = this.groups;
	        if (groups) {
	            groups.forEach(function (group, key) {
	                group.complete();
	            });
	            groups.clear();
	        }
	        this.destination.complete();
	    };
	    GroupBySubscriber.prototype.removeGroup = function (key) {
	        this.groups.delete(key);
	    };
	    GroupBySubscriber.prototype.unsubscribe = function () {
	        if (!this.closed) {
	            this.attemptedToUnsubscribe = true;
	            if (this.count === 0) {
	                _super.prototype.unsubscribe.call(this);
	            }
	        }
	    };
	    return GroupBySubscriber;
	}(Subscriber));
	var GroupDurationSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(GroupDurationSubscriber, _super);
	    function GroupDurationSubscriber(key, group, parent) {
	        var _this = _super.call(this, group) || this;
	        _this.key = key;
	        _this.group = group;
	        _this.parent = parent;
	        return _this;
	    }
	    GroupDurationSubscriber.prototype._next = function (value) {
	        this.complete();
	    };
	    GroupDurationSubscriber.prototype._unsubscribe = function () {
	        var _a = this, parent = _a.parent, key = _a.key;
	        this.key = this.parent = null;
	        if (parent) {
	            parent.removeGroup(key);
	        }
	    };
	    return GroupDurationSubscriber;
	}(Subscriber));
	var GroupedObservable = /*@__PURE__*/ (function (_super) {
	    __extends(GroupedObservable, _super);
	    function GroupedObservable(key, groupSubject, refCountSubscription) {
	        var _this = _super.call(this) || this;
	        _this.key = key;
	        _this.groupSubject = groupSubject;
	        _this.refCountSubscription = refCountSubscription;
	        return _this;
	    }
	    GroupedObservable.prototype._subscribe = function (subscriber) {
	        var subscription = new Subscription();
	        var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
	        if (refCountSubscription && !refCountSubscription.closed) {
	            subscription.add(new InnerRefCountSubscription(refCountSubscription));
	        }
	        subscription.add(groupSubject.subscribe(subscriber));
	        return subscription;
	    };
	    return GroupedObservable;
	}(Observable));
	var InnerRefCountSubscription = /*@__PURE__*/ (function (_super) {
	    __extends(InnerRefCountSubscription, _super);
	    function InnerRefCountSubscription(parent) {
	        var _this = _super.call(this) || this;
	        _this.parent = parent;
	        parent.count++;
	        return _this;
	    }
	    InnerRefCountSubscription.prototype.unsubscribe = function () {
	        var parent = this.parent;
	        if (!parent.closed && !this.closed) {
	            _super.prototype.unsubscribe.call(this);
	            parent.count -= 1;
	            if (parent.count === 0 && parent.attemptedToUnsubscribe) {
	                parent.unsubscribe();
	            }
	        }
	    };
	    return InnerRefCountSubscription;
	}(Subscription));

	/** PURE_IMPORTS_START tslib,_Subject,_util_ObjectUnsubscribedError PURE_IMPORTS_END */
	var BehaviorSubject = /*@__PURE__*/ (function (_super) {
	    __extends(BehaviorSubject, _super);
	    function BehaviorSubject(_value) {
	        var _this = _super.call(this) || this;
	        _this._value = _value;
	        return _this;
	    }
	    Object.defineProperty(BehaviorSubject.prototype, "value", {
	        get: function () {
	            return this.getValue();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    BehaviorSubject.prototype._subscribe = function (subscriber) {
	        var subscription = _super.prototype._subscribe.call(this, subscriber);
	        if (subscription && !subscription.closed) {
	            subscriber.next(this._value);
	        }
	        return subscription;
	    };
	    BehaviorSubject.prototype.getValue = function () {
	        if (this.hasError) {
	            throw this.thrownError;
	        }
	        else if (this.closed) {
	            throw new ObjectUnsubscribedError();
	        }
	        else {
	            return this._value;
	        }
	    };
	    BehaviorSubject.prototype.next = function (value) {
	        _super.prototype.next.call(this, this._value = value);
	    };
	    return BehaviorSubject;
	}(Subject));

	/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
	var Action = /*@__PURE__*/ (function (_super) {
	    __extends(Action, _super);
	    function Action(scheduler, work) {
	        return _super.call(this) || this;
	    }
	    Action.prototype.schedule = function (state, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        return this;
	    };
	    return Action;
	}(Subscription));

	/** PURE_IMPORTS_START tslib,_Action PURE_IMPORTS_END */
	var AsyncAction = /*@__PURE__*/ (function (_super) {
	    __extends(AsyncAction, _super);
	    function AsyncAction(scheduler, work) {
	        var _this = _super.call(this, scheduler, work) || this;
	        _this.scheduler = scheduler;
	        _this.work = work;
	        _this.pending = false;
	        return _this;
	    }
	    AsyncAction.prototype.schedule = function (state, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (this.closed) {
	            return this;
	        }
	        this.state = state;
	        var id = this.id;
	        var scheduler = this.scheduler;
	        if (id != null) {
	            this.id = this.recycleAsyncId(scheduler, id, delay);
	        }
	        this.pending = true;
	        this.delay = delay;
	        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
	        return this;
	    };
	    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        return setInterval(scheduler.flush.bind(scheduler, this), delay);
	    };
	    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (delay !== null && this.delay === delay && this.pending === false) {
	            return id;
	        }
	        return clearInterval(id) && undefined || undefined;
	    };
	    AsyncAction.prototype.execute = function (state, delay) {
	        if (this.closed) {
	            return new Error('executing a cancelled action');
	        }
	        this.pending = false;
	        var error = this._execute(state, delay);
	        if (error) {
	            return error;
	        }
	        else if (this.pending === false && this.id != null) {
	            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
	        }
	    };
	    AsyncAction.prototype._execute = function (state, delay) {
	        var errored = false;
	        var errorValue = undefined;
	        try {
	            this.work(state);
	        }
	        catch (e) {
	            errored = true;
	            errorValue = !!e && e || new Error(e);
	        }
	        if (errored) {
	            this.unsubscribe();
	            return errorValue;
	        }
	    };
	    AsyncAction.prototype._unsubscribe = function () {
	        var id = this.id;
	        var scheduler = this.scheduler;
	        var actions = scheduler.actions;
	        var index = actions.indexOf(this);
	        this.work = null;
	        this.state = null;
	        this.pending = false;
	        this.scheduler = null;
	        if (index !== -1) {
	            actions.splice(index, 1);
	        }
	        if (id != null) {
	            this.id = this.recycleAsyncId(scheduler, id, null);
	        }
	        this.delay = null;
	    };
	    return AsyncAction;
	}(Action));

	/** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
	var QueueAction = /*@__PURE__*/ (function (_super) {
	    __extends(QueueAction, _super);
	    function QueueAction(scheduler, work) {
	        var _this = _super.call(this, scheduler, work) || this;
	        _this.scheduler = scheduler;
	        _this.work = work;
	        return _this;
	    }
	    QueueAction.prototype.schedule = function (state, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (delay > 0) {
	            return _super.prototype.schedule.call(this, state, delay);
	        }
	        this.delay = delay;
	        this.state = state;
	        this.scheduler.flush(this);
	        return this;
	    };
	    QueueAction.prototype.execute = function (state, delay) {
	        return (delay > 0 || this.closed) ?
	            _super.prototype.execute.call(this, state, delay) :
	            this._execute(state, delay);
	    };
	    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
	            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
	        }
	        return scheduler.flush(this);
	    };
	    return QueueAction;
	}(AsyncAction));

	var Scheduler = /*@__PURE__*/ (function () {
	    function Scheduler(SchedulerAction, now) {
	        if (now === void 0) {
	            now = Scheduler.now;
	        }
	        this.SchedulerAction = SchedulerAction;
	        this.now = now;
	    }
	    Scheduler.prototype.schedule = function (work, delay, state) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        return new this.SchedulerAction(this, work).schedule(state, delay);
	    };
	    Scheduler.now = function () { return Date.now(); };
	    return Scheduler;
	}());

	/** PURE_IMPORTS_START tslib,_Scheduler PURE_IMPORTS_END */
	var AsyncScheduler = /*@__PURE__*/ (function (_super) {
	    __extends(AsyncScheduler, _super);
	    function AsyncScheduler(SchedulerAction, now) {
	        if (now === void 0) {
	            now = Scheduler.now;
	        }
	        var _this = _super.call(this, SchedulerAction, function () {
	            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
	                return AsyncScheduler.delegate.now();
	            }
	            else {
	                return now();
	            }
	        }) || this;
	        _this.actions = [];
	        _this.active = false;
	        _this.scheduled = undefined;
	        return _this;
	    }
	    AsyncScheduler.prototype.schedule = function (work, delay, state) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
	            return AsyncScheduler.delegate.schedule(work, delay, state);
	        }
	        else {
	            return _super.prototype.schedule.call(this, work, delay, state);
	        }
	    };
	    AsyncScheduler.prototype.flush = function (action) {
	        var actions = this.actions;
	        if (this.active) {
	            actions.push(action);
	            return;
	        }
	        var error;
	        this.active = true;
	        do {
	            if (error = action.execute(action.state, action.delay)) {
	                break;
	            }
	        } while (action = actions.shift());
	        this.active = false;
	        if (error) {
	            while (action = actions.shift()) {
	                action.unsubscribe();
	            }
	            throw error;
	        }
	    };
	    return AsyncScheduler;
	}(Scheduler));

	/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
	var QueueScheduler = /*@__PURE__*/ (function (_super) {
	    __extends(QueueScheduler, _super);
	    function QueueScheduler() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    return QueueScheduler;
	}(AsyncScheduler));

	/** PURE_IMPORTS_START _QueueAction,_QueueScheduler PURE_IMPORTS_END */
	var queue = /*@__PURE__*/ new QueueScheduler(QueueAction);

	/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
	var EMPTY = /*@__PURE__*/ new Observable(function (subscriber) { return subscriber.complete(); });
	function empty$1(scheduler) {
	    return scheduler ? emptyScheduled(scheduler) : EMPTY;
	}
	function emptyScheduled(scheduler) {
	    return new Observable(function (subscriber) { return scheduler.schedule(function () { return subscriber.complete(); }); });
	}

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function isScheduler(value) {
	    return value && typeof value.schedule === 'function';
	}

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var subscribeToArray = function (array) {
	    return function (subscriber) {
	        for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
	            subscriber.next(array[i]);
	        }
	        if (!subscriber.closed) {
	            subscriber.complete();
	        }
	    };
	};

	/** PURE_IMPORTS_START _Observable,_Subscription,_util_subscribeToArray PURE_IMPORTS_END */
	function fromArray(input, scheduler) {
	    if (!scheduler) {
	        return new Observable(subscribeToArray(input));
	    }
	    else {
	        return new Observable(function (subscriber) {
	            var sub = new Subscription();
	            var i = 0;
	            sub.add(scheduler.schedule(function () {
	                if (i === input.length) {
	                    subscriber.complete();
	                    return;
	                }
	                subscriber.next(input[i++]);
	                if (!subscriber.closed) {
	                    sub.add(this.schedule());
	                }
	            }));
	            return sub;
	        });
	    }
	}

	/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
	function scalar(value) {
	    var result = new Observable(function (subscriber) {
	        subscriber.next(value);
	        subscriber.complete();
	    });
	    result._isScalar = true;
	    result.value = value;
	    return result;
	}

	/** PURE_IMPORTS_START _util_isScheduler,_fromArray,_empty,_scalar PURE_IMPORTS_END */
	function of() {
	    var args = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i] = arguments[_i];
	    }
	    var scheduler = args[args.length - 1];
	    if (isScheduler(scheduler)) {
	        args.pop();
	    }
	    else {
	        scheduler = undefined;
	    }
	    switch (args.length) {
	        case 0:
	            return empty$1(scheduler);
	        case 1:
	            return scheduler ? fromArray(args, scheduler) : scalar(args[0]);
	        default:
	            return fromArray(args, scheduler);
	    }
	}

	/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
	function throwError(error, scheduler) {
	    if (!scheduler) {
	        return new Observable(function (subscriber) { return subscriber.error(error); });
	    }
	    else {
	        return new Observable(function (subscriber) { return scheduler.schedule(dispatch$1, 0, { error: error, subscriber: subscriber }); });
	    }
	}
	function dispatch$1(_a) {
	    var error = _a.error, subscriber = _a.subscriber;
	    subscriber.error(error);
	}

	/** PURE_IMPORTS_START _observable_empty,_observable_of,_observable_throwError PURE_IMPORTS_END */
	var Notification = /*@__PURE__*/ (function () {
	    function Notification(kind, value, error) {
	        this.kind = kind;
	        this.value = value;
	        this.error = error;
	        this.hasValue = kind === 'N';
	    }
	    Notification.prototype.observe = function (observer) {
	        switch (this.kind) {
	            case 'N':
	                return observer.next && observer.next(this.value);
	            case 'E':
	                return observer.error && observer.error(this.error);
	            case 'C':
	                return observer.complete && observer.complete();
	        }
	    };
	    Notification.prototype.do = function (next, error, complete) {
	        var kind = this.kind;
	        switch (kind) {
	            case 'N':
	                return next && next(this.value);
	            case 'E':
	                return error && error(this.error);
	            case 'C':
	                return complete && complete();
	        }
	    };
	    Notification.prototype.accept = function (nextOrObserver, error, complete) {
	        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
	            return this.observe(nextOrObserver);
	        }
	        else {
	            return this.do(nextOrObserver, error, complete);
	        }
	    };
	    Notification.prototype.toObservable = function () {
	        var kind = this.kind;
	        switch (kind) {
	            case 'N':
	                return of(this.value);
	            case 'E':
	                return throwError(this.error);
	            case 'C':
	                return empty$1();
	        }
	        throw new Error('unexpected notification kind value');
	    };
	    Notification.createNext = function (value) {
	        if (typeof value !== 'undefined') {
	            return new Notification('N', value);
	        }
	        return Notification.undefinedValueNotification;
	    };
	    Notification.createError = function (err) {
	        return new Notification('E', undefined, err);
	    };
	    Notification.createComplete = function () {
	        return Notification.completeNotification;
	    };
	    Notification.completeNotification = new Notification('C');
	    Notification.undefinedValueNotification = new Notification('N', undefined);
	    return Notification;
	}());

	/** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */
	var ObserveOnSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(ObserveOnSubscriber, _super);
	    function ObserveOnSubscriber(destination, scheduler, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        var _this = _super.call(this, destination) || this;
	        _this.scheduler = scheduler;
	        _this.delay = delay;
	        return _this;
	    }
	    ObserveOnSubscriber.dispatch = function (arg) {
	        var notification = arg.notification, destination = arg.destination;
	        notification.observe(destination);
	        this.unsubscribe();
	    };
	    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
	        this.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
	    };
	    ObserveOnSubscriber.prototype._next = function (value) {
	        this.scheduleMessage(Notification.createNext(value));
	    };
	    ObserveOnSubscriber.prototype._error = function (err) {
	        this.scheduleMessage(Notification.createError(err));
	    };
	    ObserveOnSubscriber.prototype._complete = function () {
	        this.scheduleMessage(Notification.createComplete());
	    };
	    return ObserveOnSubscriber;
	}(Subscriber));
	var ObserveOnMessage = /*@__PURE__*/ (function () {
	    function ObserveOnMessage(notification, destination) {
	        this.notification = notification;
	        this.destination = destination;
	    }
	    return ObserveOnMessage;
	}());

	/** PURE_IMPORTS_START tslib,_Subject,_scheduler_queue,_Subscription,_operators_observeOn,_util_ObjectUnsubscribedError,_SubjectSubscription PURE_IMPORTS_END */
	var ReplaySubject = /*@__PURE__*/ (function (_super) {
	    __extends(ReplaySubject, _super);
	    function ReplaySubject(bufferSize, windowTime, scheduler) {
	        if (bufferSize === void 0) {
	            bufferSize = Number.POSITIVE_INFINITY;
	        }
	        if (windowTime === void 0) {
	            windowTime = Number.POSITIVE_INFINITY;
	        }
	        var _this = _super.call(this) || this;
	        _this.scheduler = scheduler;
	        _this._events = [];
	        _this._infiniteTimeWindow = false;
	        _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
	        _this._windowTime = windowTime < 1 ? 1 : windowTime;
	        if (windowTime === Number.POSITIVE_INFINITY) {
	            _this._infiniteTimeWindow = true;
	            _this.next = _this.nextInfiniteTimeWindow;
	        }
	        else {
	            _this.next = _this.nextTimeWindow;
	        }
	        return _this;
	    }
	    ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
	        var _events = this._events;
	        _events.push(value);
	        if (_events.length > this._bufferSize) {
	            _events.shift();
	        }
	        _super.prototype.next.call(this, value);
	    };
	    ReplaySubject.prototype.nextTimeWindow = function (value) {
	        this._events.push(new ReplayEvent(this._getNow(), value));
	        this._trimBufferThenGetEvents();
	        _super.prototype.next.call(this, value);
	    };
	    ReplaySubject.prototype._subscribe = function (subscriber) {
	        var _infiniteTimeWindow = this._infiniteTimeWindow;
	        var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
	        var scheduler = this.scheduler;
	        var len = _events.length;
	        var subscription;
	        if (this.closed) {
	            throw new ObjectUnsubscribedError();
	        }
	        else if (this.isStopped || this.hasError) {
	            subscription = Subscription.EMPTY;
	        }
	        else {
	            this.observers.push(subscriber);
	            subscription = new SubjectSubscription(this, subscriber);
	        }
	        if (scheduler) {
	            subscriber.add(subscriber = new ObserveOnSubscriber(subscriber, scheduler));
	        }
	        if (_infiniteTimeWindow) {
	            for (var i = 0; i < len && !subscriber.closed; i++) {
	                subscriber.next(_events[i]);
	            }
	        }
	        else {
	            for (var i = 0; i < len && !subscriber.closed; i++) {
	                subscriber.next(_events[i].value);
	            }
	        }
	        if (this.hasError) {
	            subscriber.error(this.thrownError);
	        }
	        else if (this.isStopped) {
	            subscriber.complete();
	        }
	        return subscription;
	    };
	    ReplaySubject.prototype._getNow = function () {
	        return (this.scheduler || queue).now();
	    };
	    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
	        var now = this._getNow();
	        var _bufferSize = this._bufferSize;
	        var _windowTime = this._windowTime;
	        var _events = this._events;
	        var eventsCount = _events.length;
	        var spliceCount = 0;
	        while (spliceCount < eventsCount) {
	            if ((now - _events[spliceCount].time) < _windowTime) {
	                break;
	            }
	            spliceCount++;
	        }
	        if (eventsCount > _bufferSize) {
	            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
	        }
	        if (spliceCount > 0) {
	            _events.splice(0, spliceCount);
	        }
	        return _events;
	    };
	    return ReplaySubject;
	}(Subject));
	var ReplayEvent = /*@__PURE__*/ (function () {
	    function ReplayEvent(time, value) {
	        this.time = time;
	        this.value = value;
	    }
	    return ReplayEvent;
	}());

	/** PURE_IMPORTS_START tslib,_Subject,_Subscription PURE_IMPORTS_END */
	var AsyncSubject = /*@__PURE__*/ (function (_super) {
	    __extends(AsyncSubject, _super);
	    function AsyncSubject() {
	        var _this = _super !== null && _super.apply(this, arguments) || this;
	        _this.value = null;
	        _this.hasNext = false;
	        _this.hasCompleted = false;
	        return _this;
	    }
	    AsyncSubject.prototype._subscribe = function (subscriber) {
	        if (this.hasError) {
	            subscriber.error(this.thrownError);
	            return Subscription.EMPTY;
	        }
	        else if (this.hasCompleted && this.hasNext) {
	            subscriber.next(this.value);
	            subscriber.complete();
	            return Subscription.EMPTY;
	        }
	        return _super.prototype._subscribe.call(this, subscriber);
	    };
	    AsyncSubject.prototype.next = function (value) {
	        if (!this.hasCompleted) {
	            this.value = value;
	            this.hasNext = true;
	        }
	    };
	    AsyncSubject.prototype.error = function (error) {
	        if (!this.hasCompleted) {
	            _super.prototype.error.call(this, error);
	        }
	    };
	    AsyncSubject.prototype.complete = function () {
	        this.hasCompleted = true;
	        if (this.hasNext) {
	            _super.prototype.next.call(this, this.value);
	        }
	        _super.prototype.complete.call(this);
	    };
	    return AsyncSubject;
	}(Subject));

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var nextHandle = 1;
	var tasksByHandle = {};
	function runIfPresent(handle) {
	    var cb = tasksByHandle[handle];
	    if (cb) {
	        cb();
	    }
	}
	var Immediate = {
	    setImmediate: function (cb) {
	        var handle = nextHandle++;
	        tasksByHandle[handle] = cb;
	        Promise.resolve().then(function () { return runIfPresent(handle); });
	        return handle;
	    },
	    clearImmediate: function (handle) {
	        delete tasksByHandle[handle];
	    },
	};

	/** PURE_IMPORTS_START tslib,_util_Immediate,_AsyncAction PURE_IMPORTS_END */
	var AsapAction = /*@__PURE__*/ (function (_super) {
	    __extends(AsapAction, _super);
	    function AsapAction(scheduler, work) {
	        var _this = _super.call(this, scheduler, work) || this;
	        _this.scheduler = scheduler;
	        _this.work = work;
	        return _this;
	    }
	    AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (delay !== null && delay > 0) {
	            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
	        }
	        scheduler.actions.push(this);
	        return scheduler.scheduled || (scheduler.scheduled = Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
	    };
	    AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
	            return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
	        }
	        if (scheduler.actions.length === 0) {
	            Immediate.clearImmediate(id);
	            scheduler.scheduled = undefined;
	        }
	        return undefined;
	    };
	    return AsapAction;
	}(AsyncAction));

	/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
	var AsapScheduler = /*@__PURE__*/ (function (_super) {
	    __extends(AsapScheduler, _super);
	    function AsapScheduler() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    AsapScheduler.prototype.flush = function (action) {
	        this.active = true;
	        this.scheduled = undefined;
	        var actions = this.actions;
	        var error;
	        var index = -1;
	        var count = actions.length;
	        action = action || actions.shift();
	        do {
	            if (error = action.execute(action.state, action.delay)) {
	                break;
	            }
	        } while (++index < count && (action = actions.shift()));
	        this.active = false;
	        if (error) {
	            while (++index < count && (action = actions.shift())) {
	                action.unsubscribe();
	            }
	            throw error;
	        }
	    };
	    return AsapScheduler;
	}(AsyncScheduler));

	/** PURE_IMPORTS_START _AsapAction,_AsapScheduler PURE_IMPORTS_END */
	var asap = /*@__PURE__*/ new AsapScheduler(AsapAction);

	/** PURE_IMPORTS_START _AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
	var async = /*@__PURE__*/ new AsyncScheduler(AsyncAction);

	/** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
	var AnimationFrameAction = /*@__PURE__*/ (function (_super) {
	    __extends(AnimationFrameAction, _super);
	    function AnimationFrameAction(scheduler, work) {
	        var _this = _super.call(this, scheduler, work) || this;
	        _this.scheduler = scheduler;
	        _this.work = work;
	        return _this;
	    }
	    AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (delay !== null && delay > 0) {
	            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
	        }
	        scheduler.actions.push(this);
	        return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(function () { return scheduler.flush(null); }));
	    };
	    AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
	            return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
	        }
	        if (scheduler.actions.length === 0) {
	            cancelAnimationFrame(id);
	            scheduler.scheduled = undefined;
	        }
	        return undefined;
	    };
	    return AnimationFrameAction;
	}(AsyncAction));

	/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
	var AnimationFrameScheduler = /*@__PURE__*/ (function (_super) {
	    __extends(AnimationFrameScheduler, _super);
	    function AnimationFrameScheduler() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    AnimationFrameScheduler.prototype.flush = function (action) {
	        this.active = true;
	        this.scheduled = undefined;
	        var actions = this.actions;
	        var error;
	        var index = -1;
	        var count = actions.length;
	        action = action || actions.shift();
	        do {
	            if (error = action.execute(action.state, action.delay)) {
	                break;
	            }
	        } while (++index < count && (action = actions.shift()));
	        this.active = false;
	        if (error) {
	            while (++index < count && (action = actions.shift())) {
	                action.unsubscribe();
	            }
	            throw error;
	        }
	    };
	    return AnimationFrameScheduler;
	}(AsyncScheduler));

	/** PURE_IMPORTS_START _AnimationFrameAction,_AnimationFrameScheduler PURE_IMPORTS_END */
	var animationFrame = /*@__PURE__*/ new AnimationFrameScheduler(AnimationFrameAction);

	/** PURE_IMPORTS_START tslib,_AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
	var VirtualTimeScheduler = /*@__PURE__*/ (function (_super) {
	    __extends(VirtualTimeScheduler, _super);
	    function VirtualTimeScheduler(SchedulerAction, maxFrames) {
	        if (SchedulerAction === void 0) {
	            SchedulerAction = VirtualAction;
	        }
	        if (maxFrames === void 0) {
	            maxFrames = Number.POSITIVE_INFINITY;
	        }
	        var _this = _super.call(this, SchedulerAction, function () { return _this.frame; }) || this;
	        _this.maxFrames = maxFrames;
	        _this.frame = 0;
	        _this.index = -1;
	        return _this;
	    }
	    VirtualTimeScheduler.prototype.flush = function () {
	        var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
	        var error, action;
	        while ((action = actions.shift()) && (this.frame = action.delay) <= maxFrames) {
	            if (error = action.execute(action.state, action.delay)) {
	                break;
	            }
	        }
	        if (error) {
	            while (action = actions.shift()) {
	                action.unsubscribe();
	            }
	            throw error;
	        }
	    };
	    VirtualTimeScheduler.frameTimeFactor = 10;
	    return VirtualTimeScheduler;
	}(AsyncScheduler));
	var VirtualAction = /*@__PURE__*/ (function (_super) {
	    __extends(VirtualAction, _super);
	    function VirtualAction(scheduler, work, index) {
	        if (index === void 0) {
	            index = scheduler.index += 1;
	        }
	        var _this = _super.call(this, scheduler, work) || this;
	        _this.scheduler = scheduler;
	        _this.work = work;
	        _this.index = index;
	        _this.active = true;
	        _this.index = scheduler.index = index;
	        return _this;
	    }
	    VirtualAction.prototype.schedule = function (state, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (!this.id) {
	            return _super.prototype.schedule.call(this, state, delay);
	        }
	        this.active = false;
	        var action = new VirtualAction(this.scheduler, this.work);
	        this.add(action);
	        return action.schedule(state, delay);
	    };
	    VirtualAction.prototype.requestAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        this.delay = scheduler.frame + delay;
	        var actions = scheduler.actions;
	        actions.push(this);
	        actions.sort(VirtualAction.sortActions);
	        return true;
	    };
	    VirtualAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        return undefined;
	    };
	    VirtualAction.prototype._execute = function (state, delay) {
	        if (this.active === true) {
	            return _super.prototype._execute.call(this, state, delay);
	        }
	    };
	    VirtualAction.sortActions = function (a, b) {
	        if (a.delay === b.delay) {
	            if (a.index === b.index) {
	                return 0;
	            }
	            else if (a.index > b.index) {
	                return 1;
	            }
	            else {
	                return -1;
	            }
	        }
	        else if (a.delay > b.delay) {
	            return 1;
	        }
	        else {
	            return -1;
	        }
	    };
	    return VirtualAction;
	}(AsyncAction));

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
	var ArgumentOutOfRangeError = /*@__PURE__*/ (function (_super) {
	    __extends(ArgumentOutOfRangeError, _super);
	    function ArgumentOutOfRangeError() {
	        var _this = _super.call(this, 'argument out of range') || this;
	        _this.name = 'ArgumentOutOfRangeError';
	        Object.setPrototypeOf(_this, ArgumentOutOfRangeError.prototype);
	        return _this;
	    }
	    return ArgumentOutOfRangeError;
	}(Error));

	/** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
	var EmptyError = /*@__PURE__*/ (function (_super) {
	    __extends(EmptyError, _super);
	    function EmptyError() {
	        var _this = _super.call(this, 'no elements in sequence') || this;
	        _this.name = 'EmptyError';
	        Object.setPrototypeOf(_this, EmptyError.prototype);
	        return _this;
	    }
	    return EmptyError;
	}(Error));

	/** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
	var TimeoutError = /*@__PURE__*/ (function (_super) {
	    __extends(TimeoutError, _super);
	    function TimeoutError() {
	        var _this = _super.call(this, 'Timeout has occurred') || this;
	        _this.name = 'TimeoutError';
	        Object.setPrototypeOf(_this, TimeoutError.prototype);
	        return _this;
	    }
	    return TimeoutError;
	}(Error));

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	function map(project, thisArg) {
	    return function mapOperation(source) {
	        if (typeof project !== 'function') {
	            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
	        }
	        return source.lift(new MapOperator(project, thisArg));
	    };
	}
	var MapOperator = /*@__PURE__*/ (function () {
	    function MapOperator(project, thisArg) {
	        this.project = project;
	        this.thisArg = thisArg;
	    }
	    MapOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
	    };
	    return MapOperator;
	}());
	var MapSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(MapSubscriber, _super);
	    function MapSubscriber(destination, project, thisArg) {
	        var _this = _super.call(this, destination) || this;
	        _this.project = project;
	        _this.count = 0;
	        _this.thisArg = thisArg || _this;
	        return _this;
	    }
	    MapSubscriber.prototype._next = function (value) {
	        var result;
	        try {
	            result = this.project.call(this.thisArg, value, this.count++);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(result);
	    };
	    return MapSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_isArray,_util_isScheduler PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_isScheduler,_util_isArray PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var OuterSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(OuterSubscriber, _super);
	    function OuterSubscriber() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
	        this.destination.error(error);
	    };
	    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.destination.complete();
	    };
	    return OuterSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var InnerSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(InnerSubscriber, _super);
	    function InnerSubscriber(parent, outerValue, outerIndex) {
	        var _this = _super.call(this) || this;
	        _this.parent = parent;
	        _this.outerValue = outerValue;
	        _this.outerIndex = outerIndex;
	        _this.index = 0;
	        return _this;
	    }
	    InnerSubscriber.prototype._next = function (value) {
	        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
	    };
	    InnerSubscriber.prototype._error = function (error) {
	        this.parent.notifyError(error, this);
	        this.unsubscribe();
	    };
	    InnerSubscriber.prototype._complete = function () {
	        this.parent.notifyComplete(this);
	        this.unsubscribe();
	    };
	    return InnerSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */
	var subscribeToPromise = function (promise) {
	    return function (subscriber) {
	        promise.then(function (value) {
	            if (!subscriber.closed) {
	                subscriber.next(value);
	                subscriber.complete();
	            }
	        }, function (err) { return subscriber.error(err); })
	            .then(null, hostReportError);
	        return subscriber;
	    };
	};

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function getSymbolIterator() {
	    if (typeof Symbol !== 'function' || !Symbol.iterator) {
	        return '@@iterator';
	    }
	    return Symbol.iterator;
	}
	var iterator = /*@__PURE__*/ getSymbolIterator();

	/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
	var subscribeToIterable = function (iterable) {
	    return function (subscriber) {
	        var iterator$$1 = iterable[iterator]();
	        do {
	            var item = iterator$$1.next();
	            if (item.done) {
	                subscriber.complete();
	                break;
	            }
	            subscriber.next(item.value);
	            if (subscriber.closed) {
	                break;
	            }
	        } while (true);
	        if (typeof iterator$$1.return === 'function') {
	            subscriber.add(function () {
	                if (iterator$$1.return) {
	                    iterator$$1.return();
	                }
	            });
	        }
	        return subscriber;
	    };
	};

	/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
	var subscribeToObservable = function (obj) {
	    return function (subscriber) {
	        var obs = obj[observable]();
	        if (typeof obs.subscribe !== 'function') {
	            throw new TypeError('Provided object does not correctly implement Symbol.observable');
	        }
	        else {
	            return obs.subscribe(subscriber);
	        }
	    };
	};

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function isPromise(value) {
	    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
	}

	/** PURE_IMPORTS_START _Observable,_subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */
	var subscribeTo = function (result) {
	    if (result instanceof Observable) {
	        return function (subscriber) {
	            if (result._isScalar) {
	                subscriber.next(result.value);
	                subscriber.complete();
	                return undefined;
	            }
	            else {
	                return result.subscribe(subscriber);
	            }
	        };
	    }
	    else if (result && typeof result[observable] === 'function') {
	        return subscribeToObservable(result);
	    }
	    else if (isArrayLike(result)) {
	        return subscribeToArray(result);
	    }
	    else if (isPromise(result)) {
	        return subscribeToPromise(result);
	    }
	    else if (result && typeof result[iterator] === 'function') {
	        return subscribeToIterable(result);
	    }
	    else {
	        var value = isObject(result) ? 'an invalid object' : "'" + result + "'";
	        var msg = "You provided " + value + " where a stream was expected."
	            + ' You can provide an Observable, Promise, Array, or Iterable.';
	        throw new TypeError(msg);
	    }
	};

	/** PURE_IMPORTS_START _InnerSubscriber,_subscribeTo PURE_IMPORTS_END */
	function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
	    var destination = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
	    return subscribeTo(result)(destination);
	}

	/** PURE_IMPORTS_START tslib,_util_isScheduler,_util_isArray,_OuterSubscriber,_util_subscribeToResult,_fromArray PURE_IMPORTS_END */
	var NONE = {};
	var CombineLatestSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(CombineLatestSubscriber, _super);
	    function CombineLatestSubscriber(destination, resultSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.resultSelector = resultSelector;
	        _this.active = 0;
	        _this.values = [];
	        _this.observables = [];
	        return _this;
	    }
	    CombineLatestSubscriber.prototype._next = function (observable) {
	        this.values.push(NONE);
	        this.observables.push(observable);
	    };
	    CombineLatestSubscriber.prototype._complete = function () {
	        var observables = this.observables;
	        var len = observables.length;
	        if (len === 0) {
	            this.destination.complete();
	        }
	        else {
	            this.active = len;
	            this.toRespond = len;
	            for (var i = 0; i < len; i++) {
	                var observable = observables[i];
	                this.add(subscribeToResult(this, observable, observable, i));
	            }
	        }
	    };
	    CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
	        if ((this.active -= 1) === 0) {
	            this.destination.complete();
	        }
	    };
	    CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        var values = this.values;
	        var oldVal = values[outerIndex];
	        var toRespond = !this.toRespond
	            ? 0
	            : oldVal === NONE ? --this.toRespond : this.toRespond;
	        values[outerIndex] = innerValue;
	        if (toRespond === 0) {
	            if (this.resultSelector) {
	                this._tryResultSelector(values);
	            }
	            else {
	                this.destination.next(values.slice());
	            }
	        }
	    };
	    CombineLatestSubscriber.prototype._tryResultSelector = function (values) {
	        var result;
	        try {
	            result = this.resultSelector.apply(this, values);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(result);
	    };
	    return CombineLatestSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _Observable,_Subscription,_util_subscribeToPromise PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator,_util_subscribeToIterable PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable,_util_subscribeToObservable PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _Observable,_util_isPromise,_util_isArrayLike,_util_isInteropObservable,_util_isIterable,_fromArray,_fromPromise,_fromIterable,_fromObservable,_util_subscribeTo PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_util_subscribeToResult,_OuterSubscriber,_map,_observable_from PURE_IMPORTS_END */
	var MergeMapSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(MergeMapSubscriber, _super);
	    function MergeMapSubscriber(destination, project, concurrent) {
	        if (concurrent === void 0) {
	            concurrent = Number.POSITIVE_INFINITY;
	        }
	        var _this = _super.call(this, destination) || this;
	        _this.project = project;
	        _this.concurrent = concurrent;
	        _this.hasCompleted = false;
	        _this.buffer = [];
	        _this.active = 0;
	        _this.index = 0;
	        return _this;
	    }
	    MergeMapSubscriber.prototype._next = function (value) {
	        if (this.active < this.concurrent) {
	            this._tryNext(value);
	        }
	        else {
	            this.buffer.push(value);
	        }
	    };
	    MergeMapSubscriber.prototype._tryNext = function (value) {
	        var result;
	        var index = this.index++;
	        try {
	            result = this.project(value, index);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.active++;
	        this._innerSub(result, value, index);
	    };
	    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
	        this.add(subscribeToResult(this, ish, value, index));
	    };
	    MergeMapSubscriber.prototype._complete = function () {
	        this.hasCompleted = true;
	        if (this.active === 0 && this.buffer.length === 0) {
	            this.destination.complete();
	        }
	    };
	    MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
	        var buffer = this.buffer;
	        this.remove(innerSub);
	        this.active--;
	        if (buffer.length > 0) {
	            this._next(buffer.shift());
	        }
	        else if (this.active === 0 && this.hasCompleted) {
	            this.destination.complete();
	        }
	    };
	    return MergeMapSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START _mergeMap,_util_identity PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _mergeAll PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _util_isScheduler,_of,_from,_operators_concatAll PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_Observable,_util_isArray,_empty,_util_subscribeToResult,_OuterSubscriber,_operators_map PURE_IMPORTS_END */
	var ForkJoinSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(ForkJoinSubscriber, _super);
	    function ForkJoinSubscriber(destination, sources) {
	        var _this = _super.call(this, destination) || this;
	        _this.sources = sources;
	        _this.completed = 0;
	        _this.haveValues = 0;
	        var len = sources.length;
	        _this.values = new Array(len);
	        for (var i = 0; i < len; i++) {
	            var source = sources[i];
	            var innerSubscription = subscribeToResult(_this, source, null, i);
	            if (innerSubscription) {
	                _this.add(innerSubscription);
	            }
	        }
	        return _this;
	    }
	    ForkJoinSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.values[outerIndex] = innerValue;
	        if (!innerSub._hasValue) {
	            innerSub._hasValue = true;
	            this.haveValues++;
	        }
	    };
	    ForkJoinSubscriber.prototype.notifyComplete = function (innerSub) {
	        var _a = this, destination = _a.destination, haveValues = _a.haveValues, values = _a.values;
	        var len = values.length;
	        if (!innerSub._hasValue) {
	            destination.complete();
	            return;
	        }
	        this.completed++;
	        if (this.completed !== len) {
	            return;
	        }
	        if (haveValues === len) {
	            destination.next(values);
	        }
	        destination.complete();
	    };
	    return ForkJoinSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */
	function fromEvent(target, eventName, options, resultSelector) {
	    if (isFunction(options)) {
	        resultSelector = options;
	        options = undefined;
	    }
	    if (resultSelector) {
	        return fromEvent(target, eventName, options).pipe(map(function (args) { return isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
	    }
	    return new Observable(function (subscriber) {
	        function handler(e) {
	            if (arguments.length > 1) {
	                subscriber.next(Array.prototype.slice.call(arguments));
	            }
	            else {
	                subscriber.next(e);
	            }
	        }
	        setupSubscription(target, eventName, handler, subscriber, options);
	    });
	}
	function setupSubscription(sourceObj, eventName, handler, subscriber, options) {
	    var unsubscribe;
	    if (isEventTarget(sourceObj)) {
	        var source_1 = sourceObj;
	        sourceObj.addEventListener(eventName, handler, options);
	        unsubscribe = function () { return source_1.removeEventListener(eventName, handler, options); };
	    }
	    else if (isJQueryStyleEventEmitter(sourceObj)) {
	        var source_2 = sourceObj;
	        sourceObj.on(eventName, handler);
	        unsubscribe = function () { return source_2.off(eventName, handler); };
	    }
	    else if (isNodeStyleEventEmitter(sourceObj)) {
	        var source_3 = sourceObj;
	        sourceObj.addListener(eventName, handler);
	        unsubscribe = function () { return source_3.removeListener(eventName, handler); };
	    }
	    else if (sourceObj && sourceObj.length) {
	        for (var i = 0, len = sourceObj.length; i < len; i++) {
	            setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
	        }
	    }
	    else {
	        throw new TypeError('Invalid event target');
	    }
	    subscriber.add(unsubscribe);
	}
	function isNodeStyleEventEmitter(sourceObj) {
	    return sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
	}
	function isJQueryStyleEventEmitter(sourceObj) {
	    return sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
	}
	function isEventTarget(sourceObj) {
	    return sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
	}

	/** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _Observable,_util_identity,_util_isScheduler PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _defer,_empty PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _isArray PURE_IMPORTS_END */
	function isNumeric(val) {
	    return !isArray(val) && (val - parseFloat(val) + 1) >= 0;
	}

	/** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _Observable,_util_isScheduler,_operators_mergeAll,_fromArray PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _Observable,_util_noop PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _Observable,_from,_util_isArray,_empty PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_util_isArray,_fromArray,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var RaceSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(RaceSubscriber, _super);
	    function RaceSubscriber(destination) {
	        var _this = _super.call(this, destination) || this;
	        _this.hasFirst = false;
	        _this.observables = [];
	        _this.subscriptions = [];
	        return _this;
	    }
	    RaceSubscriber.prototype._next = function (observable) {
	        this.observables.push(observable);
	    };
	    RaceSubscriber.prototype._complete = function () {
	        var observables = this.observables;
	        var len = observables.length;
	        if (len === 0) {
	            this.destination.complete();
	        }
	        else {
	            for (var i = 0; i < len && !this.hasFirst; i++) {
	                var observable = observables[i];
	                var subscription = subscribeToResult(this, observable, observable, i);
	                if (this.subscriptions) {
	                    this.subscriptions.push(subscription);
	                }
	                this.add(subscription);
	            }
	            this.observables = null;
	        }
	    };
	    RaceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        if (!this.hasFirst) {
	            this.hasFirst = true;
	            for (var i = 0; i < this.subscriptions.length; i++) {
	                if (i !== outerIndex) {
	                    var subscription = this.subscriptions[i];
	                    subscription.unsubscribe();
	                    this.remove(subscription);
	                }
	            }
	            this.subscriptions = null;
	        }
	        this.destination.next(innerValue);
	    };
	    return RaceSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_fromArray,_util_isArray,_Subscriber,_OuterSubscriber,_util_subscribeToResult,_.._internal_symbol_iterator PURE_IMPORTS_END */
	var ZipSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(ZipSubscriber, _super);
	    function ZipSubscriber(destination, resultSelector, values) {
	        if (values === void 0) {
	            values = Object.create(null);
	        }
	        var _this = _super.call(this, destination) || this;
	        _this.iterators = [];
	        _this.active = 0;
	        _this.resultSelector = (typeof resultSelector === 'function') ? resultSelector : null;
	        _this.values = values;
	        return _this;
	    }
	    ZipSubscriber.prototype._next = function (value) {
	        var iterators = this.iterators;
	        if (isArray(value)) {
	            iterators.push(new StaticArrayIterator(value));
	        }
	        else if (typeof value[iterator] === 'function') {
	            iterators.push(new StaticIterator(value[iterator]()));
	        }
	        else {
	            iterators.push(new ZipBufferIterator(this.destination, this, value));
	        }
	    };
	    ZipSubscriber.prototype._complete = function () {
	        var iterators = this.iterators;
	        var len = iterators.length;
	        if (len === 0) {
	            this.destination.complete();
	            return;
	        }
	        this.active = len;
	        for (var i = 0; i < len; i++) {
	            var iterator$$1 = iterators[i];
	            if (iterator$$1.stillUnsubscribed) {
	                this.add(iterator$$1.subscribe(iterator$$1, i));
	            }
	            else {
	                this.active--;
	            }
	        }
	    };
	    ZipSubscriber.prototype.notifyInactive = function () {
	        this.active--;
	        if (this.active === 0) {
	            this.destination.complete();
	        }
	    };
	    ZipSubscriber.prototype.checkIterators = function () {
	        var iterators = this.iterators;
	        var len = iterators.length;
	        var destination = this.destination;
	        for (var i = 0; i < len; i++) {
	            var iterator$$1 = iterators[i];
	            if (typeof iterator$$1.hasValue === 'function' && !iterator$$1.hasValue()) {
	                return;
	            }
	        }
	        var shouldComplete = false;
	        var args = [];
	        for (var i = 0; i < len; i++) {
	            var iterator$$1 = iterators[i];
	            var result = iterator$$1.next();
	            if (iterator$$1.hasCompleted()) {
	                shouldComplete = true;
	            }
	            if (result.done) {
	                destination.complete();
	                return;
	            }
	            args.push(result.value);
	        }
	        if (this.resultSelector) {
	            this._tryresultSelector(args);
	        }
	        else {
	            destination.next(args);
	        }
	        if (shouldComplete) {
	            destination.complete();
	        }
	    };
	    ZipSubscriber.prototype._tryresultSelector = function (args) {
	        var result;
	        try {
	            result = this.resultSelector.apply(this, args);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(result);
	    };
	    return ZipSubscriber;
	}(Subscriber));
	var StaticIterator = /*@__PURE__*/ (function () {
	    function StaticIterator(iterator$$1) {
	        this.iterator = iterator$$1;
	        this.nextResult = iterator$$1.next();
	    }
	    StaticIterator.prototype.hasValue = function () {
	        return true;
	    };
	    StaticIterator.prototype.next = function () {
	        var result = this.nextResult;
	        this.nextResult = this.iterator.next();
	        return result;
	    };
	    StaticIterator.prototype.hasCompleted = function () {
	        var nextResult = this.nextResult;
	        return nextResult && nextResult.done;
	    };
	    return StaticIterator;
	}());
	var StaticArrayIterator = /*@__PURE__*/ (function () {
	    function StaticArrayIterator(array) {
	        this.array = array;
	        this.index = 0;
	        this.length = 0;
	        this.length = array.length;
	    }
	    StaticArrayIterator.prototype[iterator] = function () {
	        return this;
	    };
	    StaticArrayIterator.prototype.next = function (value) {
	        var i = this.index++;
	        var array = this.array;
	        return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
	    };
	    StaticArrayIterator.prototype.hasValue = function () {
	        return this.array.length > this.index;
	    };
	    StaticArrayIterator.prototype.hasCompleted = function () {
	        return this.array.length === this.index;
	    };
	    return StaticArrayIterator;
	}());
	var ZipBufferIterator = /*@__PURE__*/ (function (_super) {
	    __extends(ZipBufferIterator, _super);
	    function ZipBufferIterator(destination, parent, observable) {
	        var _this = _super.call(this, destination) || this;
	        _this.parent = parent;
	        _this.observable = observable;
	        _this.stillUnsubscribed = true;
	        _this.buffer = [];
	        _this.isComplete = false;
	        return _this;
	    }
	    ZipBufferIterator.prototype[iterator] = function () {
	        return this;
	    };
	    ZipBufferIterator.prototype.next = function () {
	        var buffer = this.buffer;
	        if (buffer.length === 0 && this.isComplete) {
	            return { value: null, done: true };
	        }
	        else {
	            return { value: buffer.shift(), done: false };
	        }
	    };
	    ZipBufferIterator.prototype.hasValue = function () {
	        return this.buffer.length > 0;
	    };
	    ZipBufferIterator.prototype.hasCompleted = function () {
	        return this.buffer.length === 0 && this.isComplete;
	    };
	    ZipBufferIterator.prototype.notifyComplete = function () {
	        if (this.buffer.length > 0) {
	            this.isComplete = true;
	            this.parent.notifyInactive();
	        }
	        else {
	            this.destination.complete();
	        }
	    };
	    ZipBufferIterator.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.buffer.push(innerValue);
	        this.parent.checkIterators();
	    };
	    ZipBufferIterator.prototype.subscribe = function (value, index) {
	        return subscribeToResult(this, this.observable, this, index);
	    };
	    return ZipBufferIterator;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var AuditSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(AuditSubscriber, _super);
	    function AuditSubscriber(destination, durationSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.durationSelector = durationSelector;
	        _this.hasValue = false;
	        return _this;
	    }
	    AuditSubscriber.prototype._next = function (value) {
	        this.value = value;
	        this.hasValue = true;
	        if (!this.throttled) {
	            var duration = tryCatch(this.durationSelector)(value);
	            if (duration === errorObject) {
	                this.destination.error(errorObject.e);
	            }
	            else {
	                var innerSubscription = subscribeToResult(this, duration);
	                if (!innerSubscription || innerSubscription.closed) {
	                    this.clearThrottle();
	                }
	                else {
	                    this.add(this.throttled = innerSubscription);
	                }
	            }
	        }
	    };
	    AuditSubscriber.prototype.clearThrottle = function () {
	        var _a = this, value = _a.value, hasValue = _a.hasValue, throttled = _a.throttled;
	        if (throttled) {
	            this.remove(throttled);
	            this.throttled = null;
	            throttled.unsubscribe();
	        }
	        if (hasValue) {
	            this.value = null;
	            this.hasValue = false;
	            this.destination.next(value);
	        }
	    };
	    AuditSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
	        this.clearThrottle();
	    };
	    AuditSubscriber.prototype.notifyComplete = function () {
	        this.clearThrottle();
	    };
	    return AuditSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START _scheduler_async,_audit,_observable_timer PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var BufferSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(BufferSubscriber, _super);
	    function BufferSubscriber(destination, closingNotifier) {
	        var _this = _super.call(this, destination) || this;
	        _this.buffer = [];
	        _this.add(subscribeToResult(_this, closingNotifier));
	        return _this;
	    }
	    BufferSubscriber.prototype._next = function (value) {
	        this.buffer.push(value);
	    };
	    BufferSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        var buffer = this.buffer;
	        this.buffer = [];
	        this.destination.next(buffer);
	    };
	    return BufferSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var BufferCountSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(BufferCountSubscriber, _super);
	    function BufferCountSubscriber(destination, bufferSize) {
	        var _this = _super.call(this, destination) || this;
	        _this.bufferSize = bufferSize;
	        _this.buffer = [];
	        return _this;
	    }
	    BufferCountSubscriber.prototype._next = function (value) {
	        var buffer = this.buffer;
	        buffer.push(value);
	        if (buffer.length == this.bufferSize) {
	            this.destination.next(buffer);
	            this.buffer = [];
	        }
	    };
	    BufferCountSubscriber.prototype._complete = function () {
	        var buffer = this.buffer;
	        if (buffer.length > 0) {
	            this.destination.next(buffer);
	        }
	        _super.prototype._complete.call(this);
	    };
	    return BufferCountSubscriber;
	}(Subscriber));
	var BufferSkipCountSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(BufferSkipCountSubscriber, _super);
	    function BufferSkipCountSubscriber(destination, bufferSize, startBufferEvery) {
	        var _this = _super.call(this, destination) || this;
	        _this.bufferSize = bufferSize;
	        _this.startBufferEvery = startBufferEvery;
	        _this.buffers = [];
	        _this.count = 0;
	        return _this;
	    }
	    BufferSkipCountSubscriber.prototype._next = function (value) {
	        var _a = this, bufferSize = _a.bufferSize, startBufferEvery = _a.startBufferEvery, buffers = _a.buffers, count = _a.count;
	        this.count++;
	        if (count % startBufferEvery === 0) {
	            buffers.push([]);
	        }
	        for (var i = buffers.length; i--;) {
	            var buffer = buffers[i];
	            buffer.push(value);
	            if (buffer.length === bufferSize) {
	                buffers.splice(i, 1);
	                this.destination.next(buffer);
	            }
	        }
	    };
	    BufferSkipCountSubscriber.prototype._complete = function () {
	        var _a = this, buffers = _a.buffers, destination = _a.destination;
	        while (buffers.length > 0) {
	            var buffer = buffers.shift();
	            if (buffer.length > 0) {
	                destination.next(buffer);
	            }
	        }
	        _super.prototype._complete.call(this);
	    };
	    return BufferSkipCountSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_scheduler_async,_Subscriber,_util_isScheduler PURE_IMPORTS_END */
	var Context = /*@__PURE__*/ (function () {
	    function Context() {
	        this.buffer = [];
	    }
	    return Context;
	}());
	var BufferTimeSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(BufferTimeSubscriber, _super);
	    function BufferTimeSubscriber(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.bufferTimeSpan = bufferTimeSpan;
	        _this.bufferCreationInterval = bufferCreationInterval;
	        _this.maxBufferSize = maxBufferSize;
	        _this.scheduler = scheduler;
	        _this.contexts = [];
	        var context = _this.openContext();
	        _this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
	        if (_this.timespanOnly) {
	            var timeSpanOnlyState = { subscriber: _this, context: context, bufferTimeSpan: bufferTimeSpan };
	            _this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
	        }
	        else {
	            var closeState = { subscriber: _this, context: context };
	            var creationState = { bufferTimeSpan: bufferTimeSpan, bufferCreationInterval: bufferCreationInterval, subscriber: _this, scheduler: scheduler };
	            _this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
	            _this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
	        }
	        return _this;
	    }
	    BufferTimeSubscriber.prototype._next = function (value) {
	        var contexts = this.contexts;
	        var len = contexts.length;
	        var filledBufferContext;
	        for (var i = 0; i < len; i++) {
	            var context_1 = contexts[i];
	            var buffer = context_1.buffer;
	            buffer.push(value);
	            if (buffer.length == this.maxBufferSize) {
	                filledBufferContext = context_1;
	            }
	        }
	        if (filledBufferContext) {
	            this.onBufferFull(filledBufferContext);
	        }
	    };
	    BufferTimeSubscriber.prototype._error = function (err) {
	        this.contexts.length = 0;
	        _super.prototype._error.call(this, err);
	    };
	    BufferTimeSubscriber.prototype._complete = function () {
	        var _a = this, contexts = _a.contexts, destination = _a.destination;
	        while (contexts.length > 0) {
	            var context_2 = contexts.shift();
	            destination.next(context_2.buffer);
	        }
	        _super.prototype._complete.call(this);
	    };
	    BufferTimeSubscriber.prototype._unsubscribe = function () {
	        this.contexts = null;
	    };
	    BufferTimeSubscriber.prototype.onBufferFull = function (context) {
	        this.closeContext(context);
	        var closeAction = context.closeAction;
	        closeAction.unsubscribe();
	        this.remove(closeAction);
	        if (!this.closed && this.timespanOnly) {
	            context = this.openContext();
	            var bufferTimeSpan = this.bufferTimeSpan;
	            var timeSpanOnlyState = { subscriber: this, context: context, bufferTimeSpan: bufferTimeSpan };
	            this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
	        }
	    };
	    BufferTimeSubscriber.prototype.openContext = function () {
	        var context = new Context();
	        this.contexts.push(context);
	        return context;
	    };
	    BufferTimeSubscriber.prototype.closeContext = function (context) {
	        this.destination.next(context.buffer);
	        var contexts = this.contexts;
	        var spliceIndex = contexts ? contexts.indexOf(context) : -1;
	        if (spliceIndex >= 0) {
	            contexts.splice(contexts.indexOf(context), 1);
	        }
	    };
	    return BufferTimeSubscriber;
	}(Subscriber));
	function dispatchBufferTimeSpanOnly(state) {
	    var subscriber = state.subscriber;
	    var prevContext = state.context;
	    if (prevContext) {
	        subscriber.closeContext(prevContext);
	    }
	    if (!subscriber.closed) {
	        state.context = subscriber.openContext();
	        state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
	    }
	}
	function dispatchBufferCreation(state) {
	    var bufferCreationInterval = state.bufferCreationInterval, bufferTimeSpan = state.bufferTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler;
	    var context = subscriber.openContext();
	    var action = this;
	    if (!subscriber.closed) {
	        subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, { subscriber: subscriber, context: context }));
	        action.schedule(state, bufferCreationInterval);
	    }
	}
	function dispatchBufferClose(arg) {
	    var subscriber = arg.subscriber, context = arg.context;
	    subscriber.closeContext(context);
	}

	/** PURE_IMPORTS_START tslib,_Subscription,_util_subscribeToResult,_OuterSubscriber PURE_IMPORTS_END */
	var BufferToggleSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(BufferToggleSubscriber, _super);
	    function BufferToggleSubscriber(destination, openings, closingSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.openings = openings;
	        _this.closingSelector = closingSelector;
	        _this.contexts = [];
	        _this.add(subscribeToResult(_this, openings));
	        return _this;
	    }
	    BufferToggleSubscriber.prototype._next = function (value) {
	        var contexts = this.contexts;
	        var len = contexts.length;
	        for (var i = 0; i < len; i++) {
	            contexts[i].buffer.push(value);
	        }
	    };
	    BufferToggleSubscriber.prototype._error = function (err) {
	        var contexts = this.contexts;
	        while (contexts.length > 0) {
	            var context_1 = contexts.shift();
	            context_1.subscription.unsubscribe();
	            context_1.buffer = null;
	            context_1.subscription = null;
	        }
	        this.contexts = null;
	        _super.prototype._error.call(this, err);
	    };
	    BufferToggleSubscriber.prototype._complete = function () {
	        var contexts = this.contexts;
	        while (contexts.length > 0) {
	            var context_2 = contexts.shift();
	            this.destination.next(context_2.buffer);
	            context_2.subscription.unsubscribe();
	            context_2.buffer = null;
	            context_2.subscription = null;
	        }
	        this.contexts = null;
	        _super.prototype._complete.call(this);
	    };
	    BufferToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
	    };
	    BufferToggleSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.closeBuffer(innerSub.context);
	    };
	    BufferToggleSubscriber.prototype.openBuffer = function (value) {
	        try {
	            var closingSelector = this.closingSelector;
	            var closingNotifier = closingSelector.call(this, value);
	            if (closingNotifier) {
	                this.trySubscribe(closingNotifier);
	            }
	        }
	        catch (err) {
	            this._error(err);
	        }
	    };
	    BufferToggleSubscriber.prototype.closeBuffer = function (context) {
	        var contexts = this.contexts;
	        if (contexts && context) {
	            var buffer = context.buffer, subscription = context.subscription;
	            this.destination.next(buffer);
	            contexts.splice(contexts.indexOf(context), 1);
	            this.remove(subscription);
	            subscription.unsubscribe();
	        }
	    };
	    BufferToggleSubscriber.prototype.trySubscribe = function (closingNotifier) {
	        var contexts = this.contexts;
	        var buffer = [];
	        var subscription = new Subscription();
	        var context = { buffer: buffer, subscription: subscription };
	        contexts.push(context);
	        var innerSubscription = subscribeToResult(this, closingNotifier, context);
	        if (!innerSubscription || innerSubscription.closed) {
	            this.closeBuffer(context);
	        }
	        else {
	            innerSubscription.context = context;
	            this.add(innerSubscription);
	            subscription.add(innerSubscription);
	        }
	    };
	    return BufferToggleSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_Subscription,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var BufferWhenSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(BufferWhenSubscriber, _super);
	    function BufferWhenSubscriber(destination, closingSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.closingSelector = closingSelector;
	        _this.subscribing = false;
	        _this.openBuffer();
	        return _this;
	    }
	    BufferWhenSubscriber.prototype._next = function (value) {
	        this.buffer.push(value);
	    };
	    BufferWhenSubscriber.prototype._complete = function () {
	        var buffer = this.buffer;
	        if (buffer) {
	            this.destination.next(buffer);
	        }
	        _super.prototype._complete.call(this);
	    };
	    BufferWhenSubscriber.prototype._unsubscribe = function () {
	        this.buffer = null;
	        this.subscribing = false;
	    };
	    BufferWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.openBuffer();
	    };
	    BufferWhenSubscriber.prototype.notifyComplete = function () {
	        if (this.subscribing) {
	            this.complete();
	        }
	        else {
	            this.openBuffer();
	        }
	    };
	    BufferWhenSubscriber.prototype.openBuffer = function () {
	        var closingSubscription = this.closingSubscription;
	        if (closingSubscription) {
	            this.remove(closingSubscription);
	            closingSubscription.unsubscribe();
	        }
	        var buffer = this.buffer;
	        if (this.buffer) {
	            this.destination.next(buffer);
	        }
	        this.buffer = [];
	        var closingNotifier = tryCatch(this.closingSelector)();
	        if (closingNotifier === errorObject) {
	            this.error(errorObject.e);
	        }
	        else {
	            closingSubscription = new Subscription();
	            this.closingSubscription = closingSubscription;
	            this.add(closingSubscription);
	            this.subscribing = true;
	            closingSubscription.add(subscribeToResult(this, closingNotifier));
	            this.subscribing = false;
	        }
	    };
	    return BufferWhenSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var CatchSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(CatchSubscriber, _super);
	    function CatchSubscriber(destination, selector, caught) {
	        var _this = _super.call(this, destination) || this;
	        _this.selector = selector;
	        _this.caught = caught;
	        return _this;
	    }
	    CatchSubscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            var result = void 0;
	            try {
	                result = this.selector(err, this.caught);
	            }
	            catch (err2) {
	                _super.prototype.error.call(this, err2);
	                return;
	            }
	            this._unsubscribeAndRecycle();
	            this.add(subscribeToResult(this, result));
	        }
	    };
	    return CatchSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START _observable_combineLatest PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _util_isArray,_observable_combineLatest,_observable_from PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _observable_concat PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _mergeMap PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _concatMap PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var CountSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(CountSubscriber, _super);
	    function CountSubscriber(destination, predicate, source) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.source = source;
	        _this.count = 0;
	        _this.index = 0;
	        return _this;
	    }
	    CountSubscriber.prototype._next = function (value) {
	        if (this.predicate) {
	            this._tryPredicate(value);
	        }
	        else {
	            this.count++;
	        }
	    };
	    CountSubscriber.prototype._tryPredicate = function (value) {
	        var result;
	        try {
	            result = this.predicate(value, this.index++, this.source);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        if (result) {
	            this.count++;
	        }
	    };
	    CountSubscriber.prototype._complete = function () {
	        this.destination.next(this.count);
	        this.destination.complete();
	    };
	    return CountSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var DebounceSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(DebounceSubscriber, _super);
	    function DebounceSubscriber(destination, durationSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.durationSelector = durationSelector;
	        _this.hasValue = false;
	        _this.durationSubscription = null;
	        return _this;
	    }
	    DebounceSubscriber.prototype._next = function (value) {
	        try {
	            var result = this.durationSelector.call(this, value);
	            if (result) {
	                this._tryNext(value, result);
	            }
	        }
	        catch (err) {
	            this.destination.error(err);
	        }
	    };
	    DebounceSubscriber.prototype._complete = function () {
	        this.emitValue();
	        this.destination.complete();
	    };
	    DebounceSubscriber.prototype._tryNext = function (value, duration) {
	        var subscription = this.durationSubscription;
	        this.value = value;
	        this.hasValue = true;
	        if (subscription) {
	            subscription.unsubscribe();
	            this.remove(subscription);
	        }
	        subscription = subscribeToResult(this, duration);
	        if (subscription && !subscription.closed) {
	            this.add(this.durationSubscription = subscription);
	        }
	    };
	    DebounceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.emitValue();
	    };
	    DebounceSubscriber.prototype.notifyComplete = function () {
	        this.emitValue();
	    };
	    DebounceSubscriber.prototype.emitValue = function () {
	        if (this.hasValue) {
	            var value = this.value;
	            var subscription = this.durationSubscription;
	            if (subscription) {
	                this.durationSubscription = null;
	                subscription.unsubscribe();
	                this.remove(subscription);
	            }
	            this.value = null;
	            this.hasValue = false;
	            _super.prototype._next.call(this, value);
	        }
	    };
	    return DebounceSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async PURE_IMPORTS_END */
	var DebounceTimeSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(DebounceTimeSubscriber, _super);
	    function DebounceTimeSubscriber(destination, dueTime, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.dueTime = dueTime;
	        _this.scheduler = scheduler;
	        _this.debouncedSubscription = null;
	        _this.lastValue = null;
	        _this.hasValue = false;
	        return _this;
	    }
	    DebounceTimeSubscriber.prototype._next = function (value) {
	        this.clearDebounce();
	        this.lastValue = value;
	        this.hasValue = true;
	        this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext$2, this.dueTime, this));
	    };
	    DebounceTimeSubscriber.prototype._complete = function () {
	        this.debouncedNext();
	        this.destination.complete();
	    };
	    DebounceTimeSubscriber.prototype.debouncedNext = function () {
	        this.clearDebounce();
	        if (this.hasValue) {
	            var lastValue = this.lastValue;
	            this.lastValue = null;
	            this.hasValue = false;
	            this.destination.next(lastValue);
	        }
	    };
	    DebounceTimeSubscriber.prototype.clearDebounce = function () {
	        var debouncedSubscription = this.debouncedSubscription;
	        if (debouncedSubscription !== null) {
	            this.remove(debouncedSubscription);
	            debouncedSubscription.unsubscribe();
	            this.debouncedSubscription = null;
	        }
	    };
	    return DebounceTimeSubscriber;
	}(Subscriber));
	function dispatchNext$2(subscriber) {
	    subscriber.debouncedNext();
	}

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var DefaultIfEmptySubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(DefaultIfEmptySubscriber, _super);
	    function DefaultIfEmptySubscriber(destination, defaultValue) {
	        var _this = _super.call(this, destination) || this;
	        _this.defaultValue = defaultValue;
	        _this.isEmpty = true;
	        return _this;
	    }
	    DefaultIfEmptySubscriber.prototype._next = function (value) {
	        this.isEmpty = false;
	        this.destination.next(value);
	    };
	    DefaultIfEmptySubscriber.prototype._complete = function () {
	        if (this.isEmpty) {
	            this.destination.next(this.defaultValue);
	        }
	        this.destination.complete();
	    };
	    return DefaultIfEmptySubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_scheduler_async,_util_isDate,_Subscriber,_Notification PURE_IMPORTS_END */
	var DelaySubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(DelaySubscriber, _super);
	    function DelaySubscriber(destination, delay, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.delay = delay;
	        _this.scheduler = scheduler;
	        _this.queue = [];
	        _this.active = false;
	        _this.errored = false;
	        return _this;
	    }
	    DelaySubscriber.dispatch = function (state) {
	        var source = state.source;
	        var queue = source.queue;
	        var scheduler = state.scheduler;
	        var destination = state.destination;
	        while (queue.length > 0 && (queue[0].time - scheduler.now()) <= 0) {
	            queue.shift().notification.observe(destination);
	        }
	        if (queue.length > 0) {
	            var delay_1 = Math.max(0, queue[0].time - scheduler.now());
	            this.schedule(state, delay_1);
	        }
	        else {
	            this.unsubscribe();
	            source.active = false;
	        }
	    };
	    DelaySubscriber.prototype._schedule = function (scheduler) {
	        this.active = true;
	        this.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
	            source: this, destination: this.destination, scheduler: scheduler
	        }));
	    };
	    DelaySubscriber.prototype.scheduleNotification = function (notification) {
	        if (this.errored === true) {
	            return;
	        }
	        var scheduler = this.scheduler;
	        var message = new DelayMessage(scheduler.now() + this.delay, notification);
	        this.queue.push(message);
	        if (this.active === false) {
	            this._schedule(scheduler);
	        }
	    };
	    DelaySubscriber.prototype._next = function (value) {
	        this.scheduleNotification(Notification.createNext(value));
	    };
	    DelaySubscriber.prototype._error = function (err) {
	        this.errored = true;
	        this.queue = [];
	        this.destination.error(err);
	    };
	    DelaySubscriber.prototype._complete = function () {
	        this.scheduleNotification(Notification.createComplete());
	    };
	    return DelaySubscriber;
	}(Subscriber));
	var DelayMessage = /*@__PURE__*/ (function () {
	    function DelayMessage(time, notification) {
	        this.time = time;
	        this.notification = notification;
	    }
	    return DelayMessage;
	}());

	/** PURE_IMPORTS_START tslib,_Subscriber,_Observable,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var DelayWhenSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(DelayWhenSubscriber, _super);
	    function DelayWhenSubscriber(destination, delayDurationSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.delayDurationSelector = delayDurationSelector;
	        _this.completed = false;
	        _this.delayNotifierSubscriptions = [];
	        return _this;
	    }
	    DelayWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(outerValue);
	        this.removeSubscription(innerSub);
	        this.tryComplete();
	    };
	    DelayWhenSubscriber.prototype.notifyError = function (error, innerSub) {
	        this._error(error);
	    };
	    DelayWhenSubscriber.prototype.notifyComplete = function (innerSub) {
	        var value = this.removeSubscription(innerSub);
	        if (value) {
	            this.destination.next(value);
	        }
	        this.tryComplete();
	    };
	    DelayWhenSubscriber.prototype._next = function (value) {
	        try {
	            var delayNotifier = this.delayDurationSelector(value);
	            if (delayNotifier) {
	                this.tryDelay(delayNotifier, value);
	            }
	        }
	        catch (err) {
	            this.destination.error(err);
	        }
	    };
	    DelayWhenSubscriber.prototype._complete = function () {
	        this.completed = true;
	        this.tryComplete();
	    };
	    DelayWhenSubscriber.prototype.removeSubscription = function (subscription) {
	        subscription.unsubscribe();
	        var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
	        if (subscriptionIdx !== -1) {
	            this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
	        }
	        return subscription.outerValue;
	    };
	    DelayWhenSubscriber.prototype.tryDelay = function (delayNotifier, value) {
	        var notifierSubscription = subscribeToResult(this, delayNotifier, value);
	        if (notifierSubscription && !notifierSubscription.closed) {
	            this.add(notifierSubscription);
	            this.delayNotifierSubscriptions.push(notifierSubscription);
	        }
	    };
	    DelayWhenSubscriber.prototype.tryComplete = function () {
	        if (this.completed && this.delayNotifierSubscriptions.length === 0) {
	            this.destination.complete();
	        }
	    };
	    return DelayWhenSubscriber;
	}(OuterSubscriber));
	var SubscriptionDelayObservable = /*@__PURE__*/ (function (_super) {
	    __extends(SubscriptionDelayObservable, _super);
	    function SubscriptionDelayObservable(source, subscriptionDelay) {
	        var _this = _super.call(this) || this;
	        _this.source = source;
	        _this.subscriptionDelay = subscriptionDelay;
	        return _this;
	    }
	    SubscriptionDelayObservable.prototype._subscribe = function (subscriber) {
	        this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
	    };
	    return SubscriptionDelayObservable;
	}(Observable));
	var SubscriptionDelaySubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SubscriptionDelaySubscriber, _super);
	    function SubscriptionDelaySubscriber(parent, source) {
	        var _this = _super.call(this) || this;
	        _this.parent = parent;
	        _this.source = source;
	        _this.sourceSubscribed = false;
	        return _this;
	    }
	    SubscriptionDelaySubscriber.prototype._next = function (unused) {
	        this.subscribeToSource();
	    };
	    SubscriptionDelaySubscriber.prototype._error = function (err) {
	        this.unsubscribe();
	        this.parent.error(err);
	    };
	    SubscriptionDelaySubscriber.prototype._complete = function () {
	        this.subscribeToSource();
	    };
	    SubscriptionDelaySubscriber.prototype.subscribeToSource = function () {
	        if (!this.sourceSubscribed) {
	            this.sourceSubscribed = true;
	            this.unsubscribe();
	            this.source.subscribe(this.parent);
	        }
	    };
	    return SubscriptionDelaySubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var DeMaterializeSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(DeMaterializeSubscriber, _super);
	    function DeMaterializeSubscriber(destination) {
	        return _super.call(this, destination) || this;
	    }
	    DeMaterializeSubscriber.prototype._next = function (value) {
	        value.observe(this.destination);
	    };
	    return DeMaterializeSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var DistinctSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(DistinctSubscriber, _super);
	    function DistinctSubscriber(destination, keySelector, flushes) {
	        var _this = _super.call(this, destination) || this;
	        _this.keySelector = keySelector;
	        _this.values = new Set();
	        if (flushes) {
	            _this.add(subscribeToResult(_this, flushes));
	        }
	        return _this;
	    }
	    DistinctSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.values.clear();
	    };
	    DistinctSubscriber.prototype.notifyError = function (error, innerSub) {
	        this._error(error);
	    };
	    DistinctSubscriber.prototype._next = function (value) {
	        if (this.keySelector) {
	            this._useKeySelector(value);
	        }
	        else {
	            this._finalizeNext(value, value);
	        }
	    };
	    DistinctSubscriber.prototype._useKeySelector = function (value) {
	        var key;
	        var destination = this.destination;
	        try {
	            key = this.keySelector(value);
	        }
	        catch (err) {
	            destination.error(err);
	            return;
	        }
	        this._finalizeNext(key, value);
	    };
	    DistinctSubscriber.prototype._finalizeNext = function (key, value) {
	        var values = this.values;
	        if (!values.has(key)) {
	            values.add(key);
	            this.destination.next(value);
	        }
	    };
	    return DistinctSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber,_util_tryCatch,_util_errorObject PURE_IMPORTS_END */
	var DistinctUntilChangedSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(DistinctUntilChangedSubscriber, _super);
	    function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.keySelector = keySelector;
	        _this.hasKey = false;
	        if (typeof compare === 'function') {
	            _this.compare = compare;
	        }
	        return _this;
	    }
	    DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
	        return x === y;
	    };
	    DistinctUntilChangedSubscriber.prototype._next = function (value) {
	        var keySelector = this.keySelector;
	        var key = value;
	        if (keySelector) {
	            key = tryCatch(this.keySelector)(value);
	            if (key === errorObject) {
	                return this.destination.error(errorObject.e);
	            }
	        }
	        var result = false;
	        if (this.hasKey) {
	            result = tryCatch(this.compare)(this.key, key);
	            if (result === errorObject) {
	                return this.destination.error(errorObject.e);
	            }
	        }
	        else {
	            this.hasKey = true;
	        }
	        if (Boolean(result) === false) {
	            this.key = key;
	            this.destination.next(value);
	        }
	    };
	    return DistinctUntilChangedSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START _distinctUntilChanged PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var FilterSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(FilterSubscriber, _super);
	    function FilterSubscriber(destination, predicate, thisArg) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.thisArg = thisArg;
	        _this.count = 0;
	        return _this;
	    }
	    FilterSubscriber.prototype._next = function (value) {
	        var result;
	        try {
	            result = this.predicate.call(this.thisArg, value, this.count++);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        if (result) {
	            this.destination.next(value);
	        }
	    };
	    return FilterSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber,_util_noop,_util_isFunction PURE_IMPORTS_END */
	var TapSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(TapSubscriber, _super);
	    function TapSubscriber(destination, observerOrNext, error, complete) {
	        var _this = _super.call(this, destination) || this;
	        _this._tapNext = noop;
	        _this._tapError = noop;
	        _this._tapComplete = noop;
	        _this._tapError = error || noop;
	        _this._tapComplete = complete || noop;
	        if (isFunction(observerOrNext)) {
	            _this._context = _this;
	            _this._tapNext = observerOrNext;
	        }
	        else if (observerOrNext) {
	            _this._context = observerOrNext;
	            _this._tapNext = observerOrNext.next || noop;
	            _this._tapError = observerOrNext.error || noop;
	            _this._tapComplete = observerOrNext.complete || noop;
	        }
	        return _this;
	    }
	    TapSubscriber.prototype._next = function (value) {
	        try {
	            this._tapNext.call(this._context, value);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(value);
	    };
	    TapSubscriber.prototype._error = function (err) {
	        try {
	            this._tapError.call(this._context, err);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.error(err);
	    };
	    TapSubscriber.prototype._complete = function () {
	        try {
	            this._tapComplete.call(this._context);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        return this.destination.complete();
	    };
	    return TapSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START _tap,_util_EmptyError PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError,_observable_empty PURE_IMPORTS_END */
	var TakeSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(TakeSubscriber, _super);
	    function TakeSubscriber(destination, total) {
	        var _this = _super.call(this, destination) || this;
	        _this.total = total;
	        _this.count = 0;
	        return _this;
	    }
	    TakeSubscriber.prototype._next = function (value) {
	        var total = this.total;
	        var count = ++this.count;
	        if (count <= total) {
	            this.destination.next(value);
	            if (count === total) {
	                this.destination.complete();
	                this.unsubscribe();
	            }
	        }
	    };
	    return TakeSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START _util_ArgumentOutOfRangeError,_filter,_throwIfEmpty,_defaultIfEmpty,_take PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _observable_fromArray,_observable_scalar,_observable_empty,_observable_concat,_util_isScheduler PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var EverySubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(EverySubscriber, _super);
	    function EverySubscriber(destination, predicate, thisArg, source) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.thisArg = thisArg;
	        _this.source = source;
	        _this.index = 0;
	        _this.thisArg = thisArg || _this;
	        return _this;
	    }
	    EverySubscriber.prototype.notifyComplete = function (everyValueMatch) {
	        this.destination.next(everyValueMatch);
	        this.destination.complete();
	    };
	    EverySubscriber.prototype._next = function (value) {
	        var result = false;
	        try {
	            result = this.predicate.call(this.thisArg, value, this.index++, this.source);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        if (!result) {
	            this.notifyComplete(false);
	        }
	    };
	    EverySubscriber.prototype._complete = function () {
	        this.notifyComplete(true);
	    };
	    return EverySubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var SwitchFirstSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SwitchFirstSubscriber, _super);
	    function SwitchFirstSubscriber(destination) {
	        var _this = _super.call(this, destination) || this;
	        _this.hasCompleted = false;
	        _this.hasSubscription = false;
	        return _this;
	    }
	    SwitchFirstSubscriber.prototype._next = function (value) {
	        if (!this.hasSubscription) {
	            this.hasSubscription = true;
	            this.add(subscribeToResult(this, value));
	        }
	    };
	    SwitchFirstSubscriber.prototype._complete = function () {
	        this.hasCompleted = true;
	        if (!this.hasSubscription) {
	            this.destination.complete();
	        }
	    };
	    SwitchFirstSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.remove(innerSub);
	        this.hasSubscription = false;
	        if (this.hasCompleted) {
	            this.destination.complete();
	        }
	    };
	    return SwitchFirstSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult,_map,_observable_from PURE_IMPORTS_END */
	var ExhaustMapSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(ExhaustMapSubscriber, _super);
	    function ExhaustMapSubscriber(destination, project) {
	        var _this = _super.call(this, destination) || this;
	        _this.project = project;
	        _this.hasSubscription = false;
	        _this.hasCompleted = false;
	        _this.index = 0;
	        return _this;
	    }
	    ExhaustMapSubscriber.prototype._next = function (value) {
	        if (!this.hasSubscription) {
	            this.tryNext(value);
	        }
	    };
	    ExhaustMapSubscriber.prototype.tryNext = function (value) {
	        var index = this.index++;
	        var destination = this.destination;
	        try {
	            var result = this.project(value, index);
	            this.hasSubscription = true;
	            this.add(subscribeToResult(this, result, value, index));
	        }
	        catch (err) {
	            destination.error(err);
	        }
	    };
	    ExhaustMapSubscriber.prototype._complete = function () {
	        this.hasCompleted = true;
	        if (!this.hasSubscription) {
	            this.destination.complete();
	        }
	    };
	    ExhaustMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    ExhaustMapSubscriber.prototype.notifyError = function (err) {
	        this.destination.error(err);
	    };
	    ExhaustMapSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.remove(innerSub);
	        this.hasSubscription = false;
	        if (this.hasCompleted) {
	            this.destination.complete();
	        }
	    };
	    return ExhaustMapSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var ExpandSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(ExpandSubscriber, _super);
	    function ExpandSubscriber(destination, project, concurrent, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.project = project;
	        _this.concurrent = concurrent;
	        _this.scheduler = scheduler;
	        _this.index = 0;
	        _this.active = 0;
	        _this.hasCompleted = false;
	        if (concurrent < Number.POSITIVE_INFINITY) {
	            _this.buffer = [];
	        }
	        return _this;
	    }
	    ExpandSubscriber.dispatch = function (arg) {
	        var subscriber = arg.subscriber, result = arg.result, value = arg.value, index = arg.index;
	        subscriber.subscribeToProjection(result, value, index);
	    };
	    ExpandSubscriber.prototype._next = function (value) {
	        var destination = this.destination;
	        if (destination.closed) {
	            this._complete();
	            return;
	        }
	        var index = this.index++;
	        if (this.active < this.concurrent) {
	            destination.next(value);
	            var result = tryCatch(this.project)(value, index);
	            if (result === errorObject) {
	                destination.error(errorObject.e);
	            }
	            else if (!this.scheduler) {
	                this.subscribeToProjection(result, value, index);
	            }
	            else {
	                var state = { subscriber: this, result: result, value: value, index: index };
	                this.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
	            }
	        }
	        else {
	            this.buffer.push(value);
	        }
	    };
	    ExpandSubscriber.prototype.subscribeToProjection = function (result, value, index) {
	        this.active++;
	        this.add(subscribeToResult(this, result, value, index));
	    };
	    ExpandSubscriber.prototype._complete = function () {
	        this.hasCompleted = true;
	        if (this.hasCompleted && this.active === 0) {
	            this.destination.complete();
	        }
	    };
	    ExpandSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this._next(innerValue);
	    };
	    ExpandSubscriber.prototype.notifyComplete = function (innerSub) {
	        var buffer = this.buffer;
	        this.remove(innerSub);
	        this.active--;
	        if (buffer && buffer.length > 0) {
	            this._next(buffer.shift());
	        }
	        if (this.hasCompleted && this.active === 0) {
	            this.destination.complete();
	        }
	    };
	    return ExpandSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber,_Subscription PURE_IMPORTS_END */
	var FinallySubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(FinallySubscriber, _super);
	    function FinallySubscriber(destination, callback) {
	        var _this = _super.call(this, destination) || this;
	        _this.add(new Subscription(callback));
	        return _this;
	    }
	    return FinallySubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var FindValueSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(FindValueSubscriber, _super);
	    function FindValueSubscriber(destination, predicate, source, yieldIndex, thisArg) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.source = source;
	        _this.yieldIndex = yieldIndex;
	        _this.thisArg = thisArg;
	        _this.index = 0;
	        return _this;
	    }
	    FindValueSubscriber.prototype.notifyComplete = function (value) {
	        var destination = this.destination;
	        destination.next(value);
	        destination.complete();
	    };
	    FindValueSubscriber.prototype._next = function (value) {
	        var _a = this, predicate = _a.predicate, thisArg = _a.thisArg;
	        var index = this.index++;
	        try {
	            var result = predicate.call(thisArg || this, value, index, this.source);
	            if (result) {
	                this.notifyComplete(this.yieldIndex ? index : value);
	            }
	        }
	        catch (err) {
	            this.destination.error(err);
	        }
	    };
	    FindValueSubscriber.prototype._complete = function () {
	        this.notifyComplete(this.yieldIndex ? -1 : undefined);
	    };
	    return FindValueSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START _operators_find PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _util_EmptyError,_filter,_take,_defaultIfEmpty,_throwIfEmpty,_util_identity PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var IgnoreElementsSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(IgnoreElementsSubscriber, _super);
	    function IgnoreElementsSubscriber() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    IgnoreElementsSubscriber.prototype._next = function (unused) {
	    };
	    return IgnoreElementsSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var IsEmptySubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(IsEmptySubscriber, _super);
	    function IsEmptySubscriber(destination) {
	        return _super.call(this, destination) || this;
	    }
	    IsEmptySubscriber.prototype.notifyComplete = function (isEmpty) {
	        var destination = this.destination;
	        destination.next(isEmpty);
	        destination.complete();
	    };
	    IsEmptySubscriber.prototype._next = function (value) {
	        this.notifyComplete(false);
	    };
	    IsEmptySubscriber.prototype._complete = function () {
	        this.notifyComplete(true);
	    };
	    return IsEmptySubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError,_observable_empty PURE_IMPORTS_END */
	var TakeLastSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(TakeLastSubscriber, _super);
	    function TakeLastSubscriber(destination, total) {
	        var _this = _super.call(this, destination) || this;
	        _this.total = total;
	        _this.ring = new Array();
	        _this.count = 0;
	        return _this;
	    }
	    TakeLastSubscriber.prototype._next = function (value) {
	        var ring = this.ring;
	        var total = this.total;
	        var count = this.count++;
	        if (ring.length < total) {
	            ring.push(value);
	        }
	        else {
	            var index = count % total;
	            ring[index] = value;
	        }
	    };
	    TakeLastSubscriber.prototype._complete = function () {
	        var destination = this.destination;
	        var count = this.count;
	        if (count > 0) {
	            var total = this.count >= this.total ? this.total : this.count;
	            var ring = this.ring;
	            for (var i = 0; i < total; i++) {
	                var idx = (count++) % total;
	                destination.next(ring[idx]);
	            }
	        }
	        destination.complete();
	    };
	    return TakeLastSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START _util_EmptyError,_filter,_takeLast,_throwIfEmpty,_defaultIfEmpty,_util_identity PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var MapToSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(MapToSubscriber, _super);
	    function MapToSubscriber(destination, value) {
	        var _this = _super.call(this, destination) || this;
	        _this.value = value;
	        return _this;
	    }
	    MapToSubscriber.prototype._next = function (x) {
	        this.destination.next(this.value);
	    };
	    return MapToSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */
	var MaterializeSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(MaterializeSubscriber, _super);
	    function MaterializeSubscriber(destination) {
	        return _super.call(this, destination) || this;
	    }
	    MaterializeSubscriber.prototype._next = function (value) {
	        this.destination.next(Notification.createNext(value));
	    };
	    MaterializeSubscriber.prototype._error = function (err) {
	        var destination = this.destination;
	        destination.next(Notification.createError(err));
	        destination.complete();
	    };
	    MaterializeSubscriber.prototype._complete = function () {
	        var destination = this.destination;
	        destination.next(Notification.createComplete());
	        destination.complete();
	    };
	    return MaterializeSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	function scan(accumulator, seed) {
	    var hasSeed = false;
	    if (arguments.length >= 2) {
	        hasSeed = true;
	    }
	    return function scanOperatorFunction(source) {
	        return source.lift(new ScanOperator(accumulator, seed, hasSeed));
	    };
	}
	var ScanOperator = /*@__PURE__*/ (function () {
	    function ScanOperator(accumulator, seed, hasSeed) {
	        if (hasSeed === void 0) {
	            hasSeed = false;
	        }
	        this.accumulator = accumulator;
	        this.seed = seed;
	        this.hasSeed = hasSeed;
	    }
	    ScanOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed, this.hasSeed));
	    };
	    return ScanOperator;
	}());
	var ScanSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(ScanSubscriber, _super);
	    function ScanSubscriber(destination, accumulator, _seed, hasSeed) {
	        var _this = _super.call(this, destination) || this;
	        _this.accumulator = accumulator;
	        _this._seed = _seed;
	        _this.hasSeed = hasSeed;
	        _this.index = 0;
	        return _this;
	    }
	    Object.defineProperty(ScanSubscriber.prototype, "seed", {
	        get: function () {
	            return this._seed;
	        },
	        set: function (value) {
	            this.hasSeed = true;
	            this._seed = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ScanSubscriber.prototype._next = function (value) {
	        if (!this.hasSeed) {
	            this.seed = value;
	            this.destination.next(value);
	        }
	        else {
	            return this._tryNext(value);
	        }
	    };
	    ScanSubscriber.prototype._tryNext = function (value) {
	        var index = this.index++;
	        var result;
	        try {
	            result = this.accumulator(this.seed, value, index);
	        }
	        catch (err) {
	            this.destination.error(err);
	        }
	        this.seed = result;
	        this.destination.next(result);
	    };
	    return ScanSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START _scan,_takeLast,_defaultIfEmpty,_util_pipe PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _observable_merge PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _mergeMap PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_util_tryCatch,_util_errorObject,_util_subscribeToResult,_OuterSubscriber PURE_IMPORTS_END */
	var MergeScanSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(MergeScanSubscriber, _super);
	    function MergeScanSubscriber(destination, accumulator, acc, concurrent) {
	        var _this = _super.call(this, destination) || this;
	        _this.accumulator = accumulator;
	        _this.acc = acc;
	        _this.concurrent = concurrent;
	        _this.hasValue = false;
	        _this.hasCompleted = false;
	        _this.buffer = [];
	        _this.active = 0;
	        _this.index = 0;
	        return _this;
	    }
	    MergeScanSubscriber.prototype._next = function (value) {
	        if (this.active < this.concurrent) {
	            var index = this.index++;
	            var ish = tryCatch(this.accumulator)(this.acc, value);
	            var destination = this.destination;
	            if (ish === errorObject) {
	                destination.error(errorObject.e);
	            }
	            else {
	                this.active++;
	                this._innerSub(ish, value, index);
	            }
	        }
	        else {
	            this.buffer.push(value);
	        }
	    };
	    MergeScanSubscriber.prototype._innerSub = function (ish, value, index) {
	        this.add(subscribeToResult(this, ish, value, index));
	    };
	    MergeScanSubscriber.prototype._complete = function () {
	        this.hasCompleted = true;
	        if (this.active === 0 && this.buffer.length === 0) {
	            if (this.hasValue === false) {
	                this.destination.next(this.acc);
	            }
	            this.destination.complete();
	        }
	    };
	    MergeScanSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        var destination = this.destination;
	        this.acc = innerValue;
	        this.hasValue = true;
	        destination.next(innerValue);
	    };
	    MergeScanSubscriber.prototype.notifyComplete = function (innerSub) {
	        var buffer = this.buffer;
	        this.remove(innerSub);
	        this.active--;
	        if (buffer.length > 0) {
	            this._next(buffer.shift());
	        }
	        else if (this.active === 0 && this.hasCompleted) {
	            if (this.hasValue === false) {
	                this.destination.next(this.acc);
	            }
	            this.destination.complete();
	        }
	    };
	    return MergeScanSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _observable_ConnectableObservable PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_observable_from,_util_isArray,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var OnErrorResumeNextSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(OnErrorResumeNextSubscriber, _super);
	    function OnErrorResumeNextSubscriber(destination, nextSources) {
	        var _this = _super.call(this, destination) || this;
	        _this.destination = destination;
	        _this.nextSources = nextSources;
	        return _this;
	    }
	    OnErrorResumeNextSubscriber.prototype.notifyError = function (error, innerSub) {
	        this.subscribeToNextSource();
	    };
	    OnErrorResumeNextSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.subscribeToNextSource();
	    };
	    OnErrorResumeNextSubscriber.prototype._error = function (err) {
	        this.subscribeToNextSource();
	    };
	    OnErrorResumeNextSubscriber.prototype._complete = function () {
	        this.subscribeToNextSource();
	    };
	    OnErrorResumeNextSubscriber.prototype.subscribeToNextSource = function () {
	        var next = this.nextSources.shift();
	        if (next) {
	            this.add(subscribeToResult(this, next));
	        }
	        else {
	            this.destination.complete();
	        }
	    };
	    return OnErrorResumeNextSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var PairwiseSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(PairwiseSubscriber, _super);
	    function PairwiseSubscriber(destination) {
	        var _this = _super.call(this, destination) || this;
	        _this.hasPrev = false;
	        return _this;
	    }
	    PairwiseSubscriber.prototype._next = function (value) {
	        if (this.hasPrev) {
	            this.destination.next([this.prev, value]);
	        }
	        else {
	            this.hasPrev = true;
	        }
	        this.prev = value;
	    };
	    return PairwiseSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _util_not,_filter PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _map PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _Subject,_multicast PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _BehaviorSubject,_multicast PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _AsyncSubject,_multicast PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _ReplaySubject,_multicast PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _util_isArray,_observable_race PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_Subscriber,_observable_empty PURE_IMPORTS_END */
	var RepeatSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(RepeatSubscriber, _super);
	    function RepeatSubscriber(destination, count, source) {
	        var _this = _super.call(this, destination) || this;
	        _this.count = count;
	        _this.source = source;
	        return _this;
	    }
	    RepeatSubscriber.prototype.complete = function () {
	        if (!this.isStopped) {
	            var _a = this, source = _a.source, count = _a.count;
	            if (count === 0) {
	                return _super.prototype.complete.call(this);
	            }
	            else if (count > -1) {
	                this.count = count - 1;
	            }
	            source.subscribe(this._unsubscribeAndRecycle());
	        }
	    };
	    return RepeatSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subject,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var RepeatWhenSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(RepeatWhenSubscriber, _super);
	    function RepeatWhenSubscriber(destination, notifier, source) {
	        var _this = _super.call(this, destination) || this;
	        _this.notifier = notifier;
	        _this.source = source;
	        _this.sourceIsBeingSubscribedTo = true;
	        return _this;
	    }
	    RepeatWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.sourceIsBeingSubscribedTo = true;
	        this.source.subscribe(this);
	    };
	    RepeatWhenSubscriber.prototype.notifyComplete = function (innerSub) {
	        if (this.sourceIsBeingSubscribedTo === false) {
	            return _super.prototype.complete.call(this);
	        }
	    };
	    RepeatWhenSubscriber.prototype.complete = function () {
	        this.sourceIsBeingSubscribedTo = false;
	        if (!this.isStopped) {
	            if (!this.retries) {
	                this.subscribeToRetries();
	            }
	            if (!this.retriesSubscription || this.retriesSubscription.closed) {
	                return _super.prototype.complete.call(this);
	            }
	            this._unsubscribeAndRecycle();
	            this.notifications.next();
	        }
	    };
	    RepeatWhenSubscriber.prototype._unsubscribe = function () {
	        var _a = this, notifications = _a.notifications, retriesSubscription = _a.retriesSubscription;
	        if (notifications) {
	            notifications.unsubscribe();
	            this.notifications = null;
	        }
	        if (retriesSubscription) {
	            retriesSubscription.unsubscribe();
	            this.retriesSubscription = null;
	        }
	        this.retries = null;
	    };
	    RepeatWhenSubscriber.prototype._unsubscribeAndRecycle = function () {
	        var _unsubscribe = this._unsubscribe;
	        this._unsubscribe = null;
	        _super.prototype._unsubscribeAndRecycle.call(this);
	        this._unsubscribe = _unsubscribe;
	        return this;
	    };
	    RepeatWhenSubscriber.prototype.subscribeToRetries = function () {
	        this.notifications = new Subject();
	        var retries = tryCatch(this.notifier)(this.notifications);
	        if (retries === errorObject) {
	            return _super.prototype.complete.call(this);
	        }
	        this.retries = retries;
	        this.retriesSubscription = subscribeToResult(this, retries);
	    };
	    return RepeatWhenSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var RetrySubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(RetrySubscriber, _super);
	    function RetrySubscriber(destination, count, source) {
	        var _this = _super.call(this, destination) || this;
	        _this.count = count;
	        _this.source = source;
	        return _this;
	    }
	    RetrySubscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            var _a = this, source = _a.source, count = _a.count;
	            if (count === 0) {
	                return _super.prototype.error.call(this, err);
	            }
	            else if (count > -1) {
	                this.count = count - 1;
	            }
	            source.subscribe(this._unsubscribeAndRecycle());
	        }
	    };
	    return RetrySubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subject,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var RetryWhenSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(RetryWhenSubscriber, _super);
	    function RetryWhenSubscriber(destination, notifier, source) {
	        var _this = _super.call(this, destination) || this;
	        _this.notifier = notifier;
	        _this.source = source;
	        return _this;
	    }
	    RetryWhenSubscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            var errors = this.errors;
	            var retries = this.retries;
	            var retriesSubscription = this.retriesSubscription;
	            if (!retries) {
	                errors = new Subject();
	                retries = tryCatch(this.notifier)(errors);
	                if (retries === errorObject) {
	                    return _super.prototype.error.call(this, errorObject.e);
	                }
	                retriesSubscription = subscribeToResult(this, retries);
	            }
	            else {
	                this.errors = null;
	                this.retriesSubscription = null;
	            }
	            this._unsubscribeAndRecycle();
	            this.errors = errors;
	            this.retries = retries;
	            this.retriesSubscription = retriesSubscription;
	            errors.next(err);
	        }
	    };
	    RetryWhenSubscriber.prototype._unsubscribe = function () {
	        var _a = this, errors = _a.errors, retriesSubscription = _a.retriesSubscription;
	        if (errors) {
	            errors.unsubscribe();
	            this.errors = null;
	        }
	        if (retriesSubscription) {
	            retriesSubscription.unsubscribe();
	            this.retriesSubscription = null;
	        }
	        this.retries = null;
	    };
	    RetryWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        var _unsubscribe = this._unsubscribe;
	        this._unsubscribe = null;
	        this._unsubscribeAndRecycle();
	        this._unsubscribe = _unsubscribe;
	        this.source.subscribe(this);
	    };
	    return RetryWhenSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var SampleSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SampleSubscriber, _super);
	    function SampleSubscriber() {
	        var _this = _super !== null && _super.apply(this, arguments) || this;
	        _this.hasValue = false;
	        return _this;
	    }
	    SampleSubscriber.prototype._next = function (value) {
	        this.value = value;
	        this.hasValue = true;
	    };
	    SampleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.emitValue();
	    };
	    SampleSubscriber.prototype.notifyComplete = function () {
	        this.emitValue();
	    };
	    SampleSubscriber.prototype.emitValue = function () {
	        if (this.hasValue) {
	            this.hasValue = false;
	            this.destination.next(this.value);
	        }
	    };
	    return SampleSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async PURE_IMPORTS_END */
	var SampleTimeSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SampleTimeSubscriber, _super);
	    function SampleTimeSubscriber(destination, period, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.period = period;
	        _this.scheduler = scheduler;
	        _this.hasValue = false;
	        _this.add(scheduler.schedule(dispatchNotification, period, { subscriber: _this, period: period }));
	        return _this;
	    }
	    SampleTimeSubscriber.prototype._next = function (value) {
	        this.lastValue = value;
	        this.hasValue = true;
	    };
	    SampleTimeSubscriber.prototype.notifyNext = function () {
	        if (this.hasValue) {
	            this.hasValue = false;
	            this.destination.next(this.lastValue);
	        }
	    };
	    return SampleTimeSubscriber;
	}(Subscriber));
	function dispatchNotification(state) {
	    var subscriber = state.subscriber, period = state.period;
	    subscriber.notifyNext();
	    this.schedule(state, period);
	}

	/** PURE_IMPORTS_START tslib,_Subscriber,_util_tryCatch,_util_errorObject PURE_IMPORTS_END */
	var SequenceEqualSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SequenceEqualSubscriber, _super);
	    function SequenceEqualSubscriber(destination, compareTo, comparor) {
	        var _this = _super.call(this, destination) || this;
	        _this.compareTo = compareTo;
	        _this.comparor = comparor;
	        _this._a = [];
	        _this._b = [];
	        _this._oneComplete = false;
	        _this.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, _this)));
	        return _this;
	    }
	    SequenceEqualSubscriber.prototype._next = function (value) {
	        if (this._oneComplete && this._b.length === 0) {
	            this.emit(false);
	        }
	        else {
	            this._a.push(value);
	            this.checkValues();
	        }
	    };
	    SequenceEqualSubscriber.prototype._complete = function () {
	        if (this._oneComplete) {
	            this.emit(this._a.length === 0 && this._b.length === 0);
	        }
	        else {
	            this._oneComplete = true;
	        }
	    };
	    SequenceEqualSubscriber.prototype.checkValues = function () {
	        var _c = this, _a = _c._a, _b = _c._b, comparor = _c.comparor;
	        while (_a.length > 0 && _b.length > 0) {
	            var a = _a.shift();
	            var b = _b.shift();
	            var areEqual = false;
	            if (comparor) {
	                areEqual = tryCatch(comparor)(a, b);
	                if (areEqual === errorObject) {
	                    this.destination.error(errorObject.e);
	                }
	            }
	            else {
	                areEqual = a === b;
	            }
	            if (!areEqual) {
	                this.emit(false);
	            }
	        }
	    };
	    SequenceEqualSubscriber.prototype.emit = function (value) {
	        var destination = this.destination;
	        destination.next(value);
	        destination.complete();
	    };
	    SequenceEqualSubscriber.prototype.nextB = function (value) {
	        if (this._oneComplete && this._a.length === 0) {
	            this.emit(false);
	        }
	        else {
	            this._b.push(value);
	            this.checkValues();
	        }
	    };
	    return SequenceEqualSubscriber;
	}(Subscriber));
	var SequenceEqualCompareToSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SequenceEqualCompareToSubscriber, _super);
	    function SequenceEqualCompareToSubscriber(destination, parent) {
	        var _this = _super.call(this, destination) || this;
	        _this.parent = parent;
	        return _this;
	    }
	    SequenceEqualCompareToSubscriber.prototype._next = function (value) {
	        this.parent.nextB(value);
	    };
	    SequenceEqualCompareToSubscriber.prototype._error = function (err) {
	        this.parent.error(err);
	    };
	    SequenceEqualCompareToSubscriber.prototype._complete = function () {
	        this.parent._complete();
	    };
	    return SequenceEqualCompareToSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START _multicast,_refCount,_Subject PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _ReplaySubject PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_Subscriber,_util_EmptyError PURE_IMPORTS_END */
	var SingleSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SingleSubscriber, _super);
	    function SingleSubscriber(destination, predicate, source) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.source = source;
	        _this.seenValue = false;
	        _this.index = 0;
	        return _this;
	    }
	    SingleSubscriber.prototype.applySingleValue = function (value) {
	        if (this.seenValue) {
	            this.destination.error('Sequence contains more than one element');
	        }
	        else {
	            this.seenValue = true;
	            this.singleValue = value;
	        }
	    };
	    SingleSubscriber.prototype._next = function (value) {
	        var index = this.index++;
	        if (this.predicate) {
	            this.tryNext(value, index);
	        }
	        else {
	            this.applySingleValue(value);
	        }
	    };
	    SingleSubscriber.prototype.tryNext = function (value, index) {
	        try {
	            if (this.predicate(value, index, this.source)) {
	                this.applySingleValue(value);
	            }
	        }
	        catch (err) {
	            this.destination.error(err);
	        }
	    };
	    SingleSubscriber.prototype._complete = function () {
	        var destination = this.destination;
	        if (this.index > 0) {
	            destination.next(this.seenValue ? this.singleValue : undefined);
	            destination.complete();
	        }
	        else {
	            destination.error(new EmptyError);
	        }
	    };
	    return SingleSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var SkipSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SkipSubscriber, _super);
	    function SkipSubscriber(destination, total) {
	        var _this = _super.call(this, destination) || this;
	        _this.total = total;
	        _this.count = 0;
	        return _this;
	    }
	    SkipSubscriber.prototype._next = function (x) {
	        if (++this.count > this.total) {
	            this.destination.next(x);
	        }
	    };
	    return SkipSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError PURE_IMPORTS_END */
	var SkipLastSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SkipLastSubscriber, _super);
	    function SkipLastSubscriber(destination, _skipCount) {
	        var _this = _super.call(this, destination) || this;
	        _this._skipCount = _skipCount;
	        _this._count = 0;
	        _this._ring = new Array(_skipCount);
	        return _this;
	    }
	    SkipLastSubscriber.prototype._next = function (value) {
	        var skipCount = this._skipCount;
	        var count = this._count++;
	        if (count < skipCount) {
	            this._ring[count] = value;
	        }
	        else {
	            var currentIndex = count % skipCount;
	            var ring = this._ring;
	            var oldValue = ring[currentIndex];
	            ring[currentIndex] = value;
	            this.destination.next(oldValue);
	        }
	    };
	    return SkipLastSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var SkipUntilSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SkipUntilSubscriber, _super);
	    function SkipUntilSubscriber(destination, notifier) {
	        var _this = _super.call(this, destination) || this;
	        _this.hasValue = false;
	        _this.add(_this.innerSubscription = subscribeToResult(_this, notifier));
	        return _this;
	    }
	    SkipUntilSubscriber.prototype._next = function (value) {
	        if (this.hasValue) {
	            _super.prototype._next.call(this, value);
	        }
	    };
	    SkipUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.hasValue = true;
	        if (this.innerSubscription) {
	            this.innerSubscription.unsubscribe();
	        }
	    };
	    SkipUntilSubscriber.prototype.notifyComplete = function () {
	    };
	    return SkipUntilSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var SkipWhileSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SkipWhileSubscriber, _super);
	    function SkipWhileSubscriber(destination, predicate) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.skipping = true;
	        _this.index = 0;
	        return _this;
	    }
	    SkipWhileSubscriber.prototype._next = function (value) {
	        var destination = this.destination;
	        if (this.skipping) {
	            this.tryCallPredicate(value);
	        }
	        if (!this.skipping) {
	            destination.next(value);
	        }
	    };
	    SkipWhileSubscriber.prototype.tryCallPredicate = function (value) {
	        try {
	            var result = this.predicate(value, this.index++);
	            this.skipping = Boolean(result);
	        }
	        catch (err) {
	            this.destination.error(err);
	        }
	    };
	    return SkipWhileSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START _observable_fromArray,_observable_scalar,_observable_empty,_observable_concat,_util_isScheduler PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_Observable,_scheduler_asap,_util_isNumeric PURE_IMPORTS_END */
	var SubscribeOnObservable = /*@__PURE__*/ (function (_super) {
	    __extends(SubscribeOnObservable, _super);
	    function SubscribeOnObservable(source, delayTime, scheduler) {
	        if (delayTime === void 0) {
	            delayTime = 0;
	        }
	        if (scheduler === void 0) {
	            scheduler = asap;
	        }
	        var _this = _super.call(this) || this;
	        _this.source = source;
	        _this.delayTime = delayTime;
	        _this.scheduler = scheduler;
	        if (!isNumeric(delayTime) || delayTime < 0) {
	            _this.delayTime = 0;
	        }
	        if (!scheduler || typeof scheduler.schedule !== 'function') {
	            _this.scheduler = asap;
	        }
	        return _this;
	    }
	    SubscribeOnObservable.create = function (source, delay, scheduler) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (scheduler === void 0) {
	            scheduler = asap;
	        }
	        return new SubscribeOnObservable(source, delay, scheduler);
	    };
	    SubscribeOnObservable.dispatch = function (arg) {
	        var source = arg.source, subscriber = arg.subscriber;
	        return this.add(source.subscribe(subscriber));
	    };
	    SubscribeOnObservable.prototype._subscribe = function (subscriber) {
	        var delay = this.delayTime;
	        var source = this.source;
	        var scheduler = this.scheduler;
	        return scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
	            source: source, subscriber: subscriber
	        });
	    };
	    return SubscribeOnObservable;
	}(Observable));

	/** PURE_IMPORTS_START _observable_SubscribeOnObservable PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult,_map,_observable_from PURE_IMPORTS_END */
	var SwitchMapSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SwitchMapSubscriber, _super);
	    function SwitchMapSubscriber(destination, project) {
	        var _this = _super.call(this, destination) || this;
	        _this.project = project;
	        _this.index = 0;
	        return _this;
	    }
	    SwitchMapSubscriber.prototype._next = function (value) {
	        var result;
	        var index = this.index++;
	        try {
	            result = this.project(value, index);
	        }
	        catch (error) {
	            this.destination.error(error);
	            return;
	        }
	        this._innerSub(result, value, index);
	    };
	    SwitchMapSubscriber.prototype._innerSub = function (result, value, index) {
	        var innerSubscription = this.innerSubscription;
	        if (innerSubscription) {
	            innerSubscription.unsubscribe();
	        }
	        this.add(this.innerSubscription = subscribeToResult(this, result, value, index));
	    };
	    SwitchMapSubscriber.prototype._complete = function () {
	        var innerSubscription = this.innerSubscription;
	        if (!innerSubscription || innerSubscription.closed) {
	            _super.prototype._complete.call(this);
	        }
	    };
	    SwitchMapSubscriber.prototype._unsubscribe = function () {
	        this.innerSubscription = null;
	    };
	    SwitchMapSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.remove(innerSub);
	        this.innerSubscription = null;
	        if (this.isStopped) {
	            _super.prototype._complete.call(this);
	        }
	    };
	    SwitchMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    return SwitchMapSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START _switchMap,_util_identity PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _switchMap PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var TakeUntilSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(TakeUntilSubscriber, _super);
	    function TakeUntilSubscriber(destination) {
	        return _super.call(this, destination) || this;
	    }
	    TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.complete();
	    };
	    TakeUntilSubscriber.prototype.notifyComplete = function () {
	    };
	    return TakeUntilSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var TakeWhileSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(TakeWhileSubscriber, _super);
	    function TakeWhileSubscriber(destination, predicate) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.index = 0;
	        return _this;
	    }
	    TakeWhileSubscriber.prototype._next = function (value) {
	        var destination = this.destination;
	        var result;
	        try {
	            result = this.predicate(value, this.index++);
	        }
	        catch (err) {
	            destination.error(err);
	            return;
	        }
	        this.nextOrComplete(value, result);
	    };
	    TakeWhileSubscriber.prototype.nextOrComplete = function (value, predicateResult) {
	        var destination = this.destination;
	        if (Boolean(predicateResult)) {
	            destination.next(value);
	        }
	        else {
	            destination.complete();
	        }
	    };
	    return TakeWhileSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var ThrottleSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(ThrottleSubscriber, _super);
	    function ThrottleSubscriber(destination, durationSelector, _leading, _trailing) {
	        var _this = _super.call(this, destination) || this;
	        _this.destination = destination;
	        _this.durationSelector = durationSelector;
	        _this._leading = _leading;
	        _this._trailing = _trailing;
	        _this._hasValue = false;
	        return _this;
	    }
	    ThrottleSubscriber.prototype._next = function (value) {
	        this._hasValue = true;
	        this._sendValue = value;
	        if (!this._throttled) {
	            if (this._leading) {
	                this.send();
	            }
	            else {
	                this.throttle(value);
	            }
	        }
	    };
	    ThrottleSubscriber.prototype.send = function () {
	        var _a = this, _hasValue = _a._hasValue, _sendValue = _a._sendValue;
	        if (_hasValue) {
	            this.destination.next(_sendValue);
	            this.throttle(_sendValue);
	        }
	        this._hasValue = false;
	        this._sendValue = null;
	    };
	    ThrottleSubscriber.prototype.throttle = function (value) {
	        var duration = this.tryDurationSelector(value);
	        if (duration) {
	            this.add(this._throttled = subscribeToResult(this, duration));
	        }
	    };
	    ThrottleSubscriber.prototype.tryDurationSelector = function (value) {
	        try {
	            return this.durationSelector(value);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return null;
	        }
	    };
	    ThrottleSubscriber.prototype.throttlingDone = function () {
	        var _a = this, _throttled = _a._throttled, _trailing = _a._trailing;
	        if (_throttled) {
	            _throttled.unsubscribe();
	        }
	        this._throttled = null;
	        if (_trailing) {
	            this.send();
	        }
	    };
	    ThrottleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.throttlingDone();
	    };
	    ThrottleSubscriber.prototype.notifyComplete = function () {
	        this.throttlingDone();
	    };
	    return ThrottleSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async,_throttle PURE_IMPORTS_END */
	var ThrottleTimeSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(ThrottleTimeSubscriber, _super);
	    function ThrottleTimeSubscriber(destination, duration, scheduler, leading, trailing) {
	        var _this = _super.call(this, destination) || this;
	        _this.duration = duration;
	        _this.scheduler = scheduler;
	        _this.leading = leading;
	        _this.trailing = trailing;
	        _this._hasTrailingValue = false;
	        _this._trailingValue = null;
	        return _this;
	    }
	    ThrottleTimeSubscriber.prototype._next = function (value) {
	        if (this.throttled) {
	            if (this.trailing) {
	                this._trailingValue = value;
	                this._hasTrailingValue = true;
	            }
	        }
	        else {
	            this.add(this.throttled = this.scheduler.schedule(dispatchNext$3, this.duration, { subscriber: this }));
	            if (this.leading) {
	                this.destination.next(value);
	            }
	        }
	    };
	    ThrottleTimeSubscriber.prototype._complete = function () {
	        if (this._hasTrailingValue) {
	            this.destination.next(this._trailingValue);
	            this.destination.complete();
	        }
	        else {
	            this.destination.complete();
	        }
	    };
	    ThrottleTimeSubscriber.prototype.clearThrottle = function () {
	        var throttled = this.throttled;
	        if (throttled) {
	            if (this.trailing && this._hasTrailingValue) {
	                this.destination.next(this._trailingValue);
	                this._trailingValue = null;
	                this._hasTrailingValue = false;
	            }
	            throttled.unsubscribe();
	            this.remove(throttled);
	            this.throttled = null;
	        }
	    };
	    return ThrottleTimeSubscriber;
	}(Subscriber));
	function dispatchNext$3(arg) {
	    var subscriber = arg.subscriber;
	    subscriber.clearThrottle();
	}

	/** PURE_IMPORTS_START _scheduler_async,_scan,_observable_defer,_map PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_scheduler_async,_util_isDate,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var TimeoutWithSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(TimeoutWithSubscriber, _super);
	    function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.absoluteTimeout = absoluteTimeout;
	        _this.waitFor = waitFor;
	        _this.withObservable = withObservable;
	        _this.scheduler = scheduler;
	        _this.action = null;
	        _this.scheduleTimeout();
	        return _this;
	    }
	    TimeoutWithSubscriber.dispatchTimeout = function (subscriber) {
	        var withObservable = subscriber.withObservable;
	        subscriber._unsubscribeAndRecycle();
	        subscriber.add(subscribeToResult(subscriber, withObservable));
	    };
	    TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
	        var action = this.action;
	        if (action) {
	            this.action = action.schedule(this, this.waitFor);
	        }
	        else {
	            this.add(this.action = this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, this));
	        }
	    };
	    TimeoutWithSubscriber.prototype._next = function (value) {
	        if (!this.absoluteTimeout) {
	            this.scheduleTimeout();
	        }
	        _super.prototype._next.call(this, value);
	    };
	    TimeoutWithSubscriber.prototype._unsubscribe = function () {
	        this.action = null;
	        this.scheduler = null;
	        this.withObservable = null;
	    };
	    return TimeoutWithSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START _scheduler_async,_util_TimeoutError,_timeoutWith,_observable_throwError PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _scheduler_async,_map PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */

	/** PURE_IMPORTS_START tslib,_Subject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var WindowSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(WindowSubscriber, _super);
	    function WindowSubscriber(destination) {
	        var _this = _super.call(this, destination) || this;
	        _this.window = new Subject();
	        destination.next(_this.window);
	        return _this;
	    }
	    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.openWindow();
	    };
	    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
	        this._error(error);
	    };
	    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
	        this._complete();
	    };
	    WindowSubscriber.prototype._next = function (value) {
	        this.window.next(value);
	    };
	    WindowSubscriber.prototype._error = function (err) {
	        this.window.error(err);
	        this.destination.error(err);
	    };
	    WindowSubscriber.prototype._complete = function () {
	        this.window.complete();
	        this.destination.complete();
	    };
	    WindowSubscriber.prototype._unsubscribe = function () {
	        this.window = null;
	    };
	    WindowSubscriber.prototype.openWindow = function () {
	        var prevWindow = this.window;
	        if (prevWindow) {
	            prevWindow.complete();
	        }
	        var destination = this.destination;
	        var newWindow = this.window = new Subject();
	        destination.next(newWindow);
	    };
	    return WindowSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber,_Subject PURE_IMPORTS_END */
	var WindowCountSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(WindowCountSubscriber, _super);
	    function WindowCountSubscriber(destination, windowSize, startWindowEvery) {
	        var _this = _super.call(this, destination) || this;
	        _this.destination = destination;
	        _this.windowSize = windowSize;
	        _this.startWindowEvery = startWindowEvery;
	        _this.windows = [new Subject()];
	        _this.count = 0;
	        destination.next(_this.windows[0]);
	        return _this;
	    }
	    WindowCountSubscriber.prototype._next = function (value) {
	        var startWindowEvery = (this.startWindowEvery > 0) ? this.startWindowEvery : this.windowSize;
	        var destination = this.destination;
	        var windowSize = this.windowSize;
	        var windows = this.windows;
	        var len = windows.length;
	        for (var i = 0; i < len && !this.closed; i++) {
	            windows[i].next(value);
	        }
	        var c = this.count - windowSize + 1;
	        if (c >= 0 && c % startWindowEvery === 0 && !this.closed) {
	            windows.shift().complete();
	        }
	        if (++this.count % startWindowEvery === 0 && !this.closed) {
	            var window_1 = new Subject();
	            windows.push(window_1);
	            destination.next(window_1);
	        }
	    };
	    WindowCountSubscriber.prototype._error = function (err) {
	        var windows = this.windows;
	        if (windows) {
	            while (windows.length > 0 && !this.closed) {
	                windows.shift().error(err);
	            }
	        }
	        this.destination.error(err);
	    };
	    WindowCountSubscriber.prototype._complete = function () {
	        var windows = this.windows;
	        if (windows) {
	            while (windows.length > 0 && !this.closed) {
	                windows.shift().complete();
	            }
	        }
	        this.destination.complete();
	    };
	    WindowCountSubscriber.prototype._unsubscribe = function () {
	        this.count = 0;
	        this.windows = null;
	    };
	    return WindowCountSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subject,_scheduler_async,_Subscriber,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */
	var CountedSubject = /*@__PURE__*/ (function (_super) {
	    __extends(CountedSubject, _super);
	    function CountedSubject() {
	        var _this = _super !== null && _super.apply(this, arguments) || this;
	        _this._numberOfNextedValues = 0;
	        return _this;
	    }
	    CountedSubject.prototype.next = function (value) {
	        this._numberOfNextedValues++;
	        _super.prototype.next.call(this, value);
	    };
	    Object.defineProperty(CountedSubject.prototype, "numberOfNextedValues", {
	        get: function () {
	            return this._numberOfNextedValues;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return CountedSubject;
	}(Subject));
	var WindowTimeSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(WindowTimeSubscriber, _super);
	    function WindowTimeSubscriber(destination, windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.destination = destination;
	        _this.windowTimeSpan = windowTimeSpan;
	        _this.windowCreationInterval = windowCreationInterval;
	        _this.maxWindowSize = maxWindowSize;
	        _this.scheduler = scheduler;
	        _this.windows = [];
	        var window = _this.openWindow();
	        if (windowCreationInterval !== null && windowCreationInterval >= 0) {
	            var closeState = { subscriber: _this, window: window, context: null };
	            var creationState = { windowTimeSpan: windowTimeSpan, windowCreationInterval: windowCreationInterval, subscriber: _this, scheduler: scheduler };
	            _this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
	            _this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
	        }
	        else {
	            var timeSpanOnlyState = { subscriber: _this, window: window, windowTimeSpan: windowTimeSpan };
	            _this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
	        }
	        return _this;
	    }
	    WindowTimeSubscriber.prototype._next = function (value) {
	        var windows = this.windows;
	        var len = windows.length;
	        for (var i = 0; i < len; i++) {
	            var window_1 = windows[i];
	            if (!window_1.closed) {
	                window_1.next(value);
	                if (window_1.numberOfNextedValues >= this.maxWindowSize) {
	                    this.closeWindow(window_1);
	                }
	            }
	        }
	    };
	    WindowTimeSubscriber.prototype._error = function (err) {
	        var windows = this.windows;
	        while (windows.length > 0) {
	            windows.shift().error(err);
	        }
	        this.destination.error(err);
	    };
	    WindowTimeSubscriber.prototype._complete = function () {
	        var windows = this.windows;
	        while (windows.length > 0) {
	            var window_2 = windows.shift();
	            if (!window_2.closed) {
	                window_2.complete();
	            }
	        }
	        this.destination.complete();
	    };
	    WindowTimeSubscriber.prototype.openWindow = function () {
	        var window = new CountedSubject();
	        this.windows.push(window);
	        var destination = this.destination;
	        destination.next(window);
	        return window;
	    };
	    WindowTimeSubscriber.prototype.closeWindow = function (window) {
	        window.complete();
	        var windows = this.windows;
	        windows.splice(windows.indexOf(window), 1);
	    };
	    return WindowTimeSubscriber;
	}(Subscriber));
	function dispatchWindowTimeSpanOnly(state) {
	    var subscriber = state.subscriber, windowTimeSpan = state.windowTimeSpan, window = state.window;
	    if (window) {
	        subscriber.closeWindow(window);
	    }
	    state.window = subscriber.openWindow();
	    this.schedule(state, windowTimeSpan);
	}
	function dispatchWindowCreation(state) {
	    var windowTimeSpan = state.windowTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler, windowCreationInterval = state.windowCreationInterval;
	    var window = subscriber.openWindow();
	    var action = this;
	    var context = { action: action, subscription: null };
	    var timeSpanState = { subscriber: subscriber, window: window, context: context };
	    context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
	    action.add(context.subscription);
	    action.schedule(state, windowCreationInterval);
	}
	function dispatchWindowClose(state) {
	    var subscriber = state.subscriber, window = state.window, context = state.context;
	    if (context && context.action && context.subscription) {
	        context.action.remove(context.subscription);
	    }
	    subscriber.closeWindow(window);
	}

	/** PURE_IMPORTS_START tslib,_Subject,_Subscription,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var WindowToggleSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(WindowToggleSubscriber, _super);
	    function WindowToggleSubscriber(destination, openings, closingSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.openings = openings;
	        _this.closingSelector = closingSelector;
	        _this.contexts = [];
	        _this.add(_this.openSubscription = subscribeToResult(_this, openings, openings));
	        return _this;
	    }
	    WindowToggleSubscriber.prototype._next = function (value) {
	        var contexts = this.contexts;
	        if (contexts) {
	            var len = contexts.length;
	            for (var i = 0; i < len; i++) {
	                contexts[i].window.next(value);
	            }
	        }
	    };
	    WindowToggleSubscriber.prototype._error = function (err) {
	        var contexts = this.contexts;
	        this.contexts = null;
	        if (contexts) {
	            var len = contexts.length;
	            var index = -1;
	            while (++index < len) {
	                var context_1 = contexts[index];
	                context_1.window.error(err);
	                context_1.subscription.unsubscribe();
	            }
	        }
	        _super.prototype._error.call(this, err);
	    };
	    WindowToggleSubscriber.prototype._complete = function () {
	        var contexts = this.contexts;
	        this.contexts = null;
	        if (contexts) {
	            var len = contexts.length;
	            var index = -1;
	            while (++index < len) {
	                var context_2 = contexts[index];
	                context_2.window.complete();
	                context_2.subscription.unsubscribe();
	            }
	        }
	        _super.prototype._complete.call(this);
	    };
	    WindowToggleSubscriber.prototype._unsubscribe = function () {
	        var contexts = this.contexts;
	        this.contexts = null;
	        if (contexts) {
	            var len = contexts.length;
	            var index = -1;
	            while (++index < len) {
	                var context_3 = contexts[index];
	                context_3.window.unsubscribe();
	                context_3.subscription.unsubscribe();
	            }
	        }
	    };
	    WindowToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        if (outerValue === this.openings) {
	            var closingSelector = this.closingSelector;
	            var closingNotifier = tryCatch(closingSelector)(innerValue);
	            if (closingNotifier === errorObject) {
	                return this.error(errorObject.e);
	            }
	            else {
	                var window_1 = new Subject();
	                var subscription = new Subscription();
	                var context_4 = { window: window_1, subscription: subscription };
	                this.contexts.push(context_4);
	                var innerSubscription = subscribeToResult(this, closingNotifier, context_4);
	                if (innerSubscription.closed) {
	                    this.closeWindow(this.contexts.length - 1);
	                }
	                else {
	                    innerSubscription.context = context_4;
	                    subscription.add(innerSubscription);
	                }
	                this.destination.next(window_1);
	            }
	        }
	        else {
	            this.closeWindow(this.contexts.indexOf(outerValue));
	        }
	    };
	    WindowToggleSubscriber.prototype.notifyError = function (err) {
	        this.error(err);
	    };
	    WindowToggleSubscriber.prototype.notifyComplete = function (inner) {
	        if (inner !== this.openSubscription) {
	            this.closeWindow(this.contexts.indexOf(inner.context));
	        }
	    };
	    WindowToggleSubscriber.prototype.closeWindow = function (index) {
	        if (index === -1) {
	            return;
	        }
	        var contexts = this.contexts;
	        var context = contexts[index];
	        var window = context.window, subscription = context.subscription;
	        contexts.splice(index, 1);
	        window.complete();
	        subscription.unsubscribe();
	    };
	    return WindowToggleSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_Subject,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var WindowSubscriber$1 = /*@__PURE__*/ (function (_super) {
	    __extends(WindowSubscriber, _super);
	    function WindowSubscriber(destination, closingSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.destination = destination;
	        _this.closingSelector = closingSelector;
	        _this.openWindow();
	        return _this;
	    }
	    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.openWindow(innerSub);
	    };
	    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
	        this._error(error);
	    };
	    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.openWindow(innerSub);
	    };
	    WindowSubscriber.prototype._next = function (value) {
	        this.window.next(value);
	    };
	    WindowSubscriber.prototype._error = function (err) {
	        this.window.error(err);
	        this.destination.error(err);
	        this.unsubscribeClosingNotification();
	    };
	    WindowSubscriber.prototype._complete = function () {
	        this.window.complete();
	        this.destination.complete();
	        this.unsubscribeClosingNotification();
	    };
	    WindowSubscriber.prototype.unsubscribeClosingNotification = function () {
	        if (this.closingNotification) {
	            this.closingNotification.unsubscribe();
	        }
	    };
	    WindowSubscriber.prototype.openWindow = function (innerSub) {
	        if (innerSub === void 0) {
	            innerSub = null;
	        }
	        if (innerSub) {
	            this.remove(innerSub);
	            innerSub.unsubscribe();
	        }
	        var prevWindow = this.window;
	        if (prevWindow) {
	            prevWindow.complete();
	        }
	        var window = this.window = new Subject();
	        this.destination.next(window);
	        var closingNotifier = tryCatch(this.closingSelector)();
	        if (closingNotifier === errorObject) {
	            var err = errorObject.e;
	            this.destination.error(err);
	            this.window.error(err);
	        }
	        else {
	            this.add(this.closingNotification = subscribeToResult(this, closingNotifier));
	        }
	    };
	    return WindowSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	var WithLatestFromSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(WithLatestFromSubscriber, _super);
	    function WithLatestFromSubscriber(destination, observables, project) {
	        var _this = _super.call(this, destination) || this;
	        _this.observables = observables;
	        _this.project = project;
	        _this.toRespond = [];
	        var len = observables.length;
	        _this.values = new Array(len);
	        for (var i = 0; i < len; i++) {
	            _this.toRespond.push(i);
	        }
	        for (var i = 0; i < len; i++) {
	            var observable = observables[i];
	            _this.add(subscribeToResult(_this, observable, observable, i));
	        }
	        return _this;
	    }
	    WithLatestFromSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.values[outerIndex] = innerValue;
	        var toRespond = this.toRespond;
	        if (toRespond.length > 0) {
	            var found = toRespond.indexOf(outerIndex);
	            if (found !== -1) {
	                toRespond.splice(found, 1);
	            }
	        }
	    };
	    WithLatestFromSubscriber.prototype.notifyComplete = function () {
	    };
	    WithLatestFromSubscriber.prototype._next = function (value) {
	        if (this.toRespond.length === 0) {
	            var args = [value].concat(this.values);
	            if (this.project) {
	                this._tryProject(args);
	            }
	            else {
	                this.destination.next(args);
	            }
	        }
	    };
	    WithLatestFromSubscriber.prototype._tryProject = function (args) {
	        var result;
	        try {
	            result = this.project.apply(this, args);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(result);
	    };
	    return WithLatestFromSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START _observable_zip PURE_IMPORTS_END */

	/** PURE_IMPORTS_START _observable_zip PURE_IMPORTS_END */

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */

	const G = document.defaultView;

	// Node.CONSTANTS
	// 'cause some engine has no global Node defined
	// (i.e. Node, NativeScript, basicHTML ... )
	const ELEMENT_NODE = 1;
	const TEXT_NODE = 3;
	const COMMENT_NODE = 8;
	const DOCUMENT_FRAGMENT_NODE = 11;

	// HTML related constants
	const VOID_ELEMENTS = /^area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr$/i;

	// SVG related constants
	const OWNER_SVG_ELEMENT = 'ownerSVGElement';
	const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

	// Custom Elements / MutationObserver constants
	const CONNECTED = 'connected';
	const DISCONNECTED = 'dis' + CONNECTED;

	// hyperHTML related constants
	const EXPANDO = '_hyper: ';
	const SHOULD_USE_TEXT_CONTENT = /^style|textarea$/i;
	const UID = EXPANDO + ((Math.random() * new Date) | 0) + ';';
	const UIDC = '<!--' + UID + '-->';

	// you know that kind of basics you need to cover
	// your use case only but you don't want to bloat the library?
	// There's even a package in here:
	// https://www.npmjs.com/package/poorlyfills

	// used to dispatch simple events
	let Event = G.Event;
	try {
	  new Event('Event');
	} catch(o_O) {
	  Event = function (type) {
	    const e = document.createEvent('Event');
	    e.initEvent(type, false, false);
	    return e;
	  };
	}

	// used to store template literals
	/* istanbul ignore next */
	const Map$1 = G.Map || function Map() {
	  const keys = [], values = [];
	  return {
	    get(obj) {
	      return values[keys.indexOf(obj)];
	    },
	    set(obj, value) {
	      values[keys.push(obj) - 1] = value;
	    }
	  };
	};

	// used to store wired content
	let ID = 0;
	const WeakMap = G.WeakMap || function WeakMap() {
	  const key = UID + ID++;
	  return {
	    get(obj) { return obj[key]; },
	    set(obj, value) {
	      Object.defineProperty(obj, key, {
	        configurable: true,
	        value
	      });
	    }
	  };
	};

	// used to store hyper.Components
	const WeakSet = G.WeakSet || function WeakSet() {
	  const wm = new WeakMap;
	  return {
	    add(obj) { wm.set(obj, true); },
	    has(obj) { return wm.get(obj) === true; }
	  };
	};

	// used to be sure IE9 or older Androids work as expected
	const isArray$1 = Array.isArray || (toString =>
	  arr => toString.call(arr) === '[object Array]'
	)({}.toString);

	const trim = UID.trim || function () {
	  return this.replace(/^\s+|\s+$/g, '');
	};

	// hyperHTML.Component is a very basic class
	// able to create Custom Elements like components
	// including the ability to listen to connect/disconnect
	// events via onconnect/ondisconnect attributes
	// Components can be created imperatively or declaratively.
	// The main difference is that declared components
	// will not automatically render on setState(...)
	// to simplify state handling on render.
	function Component$1() {
	  return this; // this is needed in Edge !!!
	}

	// Component is lazily setup because it needs
	// wire mechanism as lazy content
	function setup(content) {
	  // there are various weakly referenced variables in here
	  // and mostly are to use Component.for(...) static method.
	  const children = new WeakMap;
	  const create = Object.create;
	  const createEntry = (wm, id, component) => {
	    wm.set(id, component);
	    return component;
	  };
	  const get = (Class, info, context, id) => {
	    const relation = info.get(Class) || relate(Class, info);
	    switch (typeof id) {
	      case 'object':
	      case 'function':
	        const wm = relation.w || (relation.w = new WeakMap);
	        return wm.get(id) || createEntry(wm, id, new Class(context));
	      default:
	        const sm = relation.p || (relation.p = create(null));
	        return sm[id] || (sm[id] = new Class(context));
	    }
	  };
	  const relate = (Class, info) => {
	    const relation = {w: null, p: null};
	    info.set(Class, relation);
	    return relation;
	  };
	  const set = context => {
	    const info = new Map$1;
	    children.set(context, info);
	    return info;
	  };
	  // The Component Class
	  Object.defineProperties(
	    Component$1,
	    {
	      // Component.for(context[, id]) is a convenient way
	      // to automatically relate data/context to children components
	      // If not created yet, the new Component(context) is weakly stored
	      // and after that same instance would always be returned.
	      for: {
	        configurable: true,
	        value(context, id) {
	          return get(
	            this,
	            children.get(context) || set(context),
	            context,
	            id == null ?
	              'default' : id
	          );
	        }
	      }
	    }
	  );
	  Object.defineProperties(
	    Component$1.prototype,
	    {
	      // all events are handled with the component as context
	      handleEvent: {value(e) {
	        const ct = e.currentTarget;
	        this[
	          ('getAttribute' in ct && ct.getAttribute('data-call')) ||
	          ('on' + e.type)
	        ](e);
	      }},
	      // components will lazily define html or svg properties
	      // as soon as these are invoked within the .render() method
	      // Such render() method is not provided by the base class
	      // but it must be available through the Component extend.
	      // Declared components could implement a
	      // render(props) method too and use props as needed.
	      html: lazyGetter('html', content),
	      svg: lazyGetter('svg', content),
	      // the state is a very basic/simple mechanism inspired by Preact
	      state: lazyGetter('state', function () { return this.defaultState; }),
	      // it is possible to define a default state that'd be always an object otherwise
	      defaultState: {get() { return {}; }},
	      // setting some property state through a new object
	      // or a callback, triggers also automatically a render
	      // unless explicitly specified to not do so (render === false)
	      setState: {value(state, render) {
	        const target = this.state;
	        const source = typeof state === 'function' ? state.call(this, target) : state;
	        for (const key in source) target[key] = source[key];
	        if (render !== false) this.render();
	        return this;
	      }}
	    }
	  );
	}

	// instead of a secret key I could've used a WeakMap
	// However, attaching a property directly will result
	// into better performance with thousands of components
	// hanging around, and less memory pressure caused by the WeakMap
	const lazyGetter = (type, fn) => {
	  const secret = '_' + type + '$';
	  return {
	    get() {
	      return this[secret] || (this[type] = fn.call(this, type));
	    },
	    set(value) {
	      Object.defineProperty(this, secret, {configurable: true, value});
	    }
	  };
	};

	const intents = {};
	const keys = [];
	const hasOwnProperty = intents.hasOwnProperty;

	let length = 0;

	var Intent = {

	  // hyperHTML.define('intent', (object, update) => {...})
	  // can be used to define a third parts update mechanism
	  // when every other known mechanism failed.
	  // hyper.define('user', info => info.name);
	  // hyper(node)`<p>${{user}}</p>`;
	  define: (intent, callback) => {
	    if (!(intent in intents)) {
	      length = keys.push(intent);
	    }
	    intents[intent] = callback;
	  },

	  // this method is used internally as last resort
	  // to retrieve a value out of an object
	  invoke: (object, callback) => {
	    for (let i = 0; i < length; i++) {
	      let key = keys[i];
	      if (hasOwnProperty.call(object, key)) {
	        return intents[key](object[key], callback);
	      }
	    }
	  }
	};

	// these are tiny helpers to simplify most common operations needed here
	const create = (node, type) => doc(node).createElement(type);
	const doc = node => node.ownerDocument || node;
	const fragment = node => doc(node).createDocumentFragment();
	const text = (node, text) => doc(node).createTextNode(text);

	// TODO:  I'd love to code-cover RegExp too here
	//        these are fundamental for this library

	const spaces = ' \\f\\n\\r\\t';
	const almostEverything = '[^ ' + spaces + '\\/>"\'=]+';
	const attrName = '[ ' + spaces + ']+' + almostEverything;
	const tagName = '<([A-Za-z]+[A-Za-z0-9:_-]*)((?:';
	const attrPartials = '(?:=(?:\'[^\']*?\'|"[^"]*?"|<[^>]*?>|' + almostEverything + '))?)';

	const attrSeeker = new RegExp(
	  tagName + attrName + attrPartials + '+)([ ' + spaces + ']*/?>)',
	  'g'
	);

	const selfClosing = new RegExp(
	  tagName + attrName + attrPartials + '*)([ ' + spaces + ']*/>)',
	  'g'
	);

	const testFragment = fragment(document);

	// DOM4 node.append(...many)
	const hasAppend = 'append' in testFragment;

	// detect old browsers without HTMLTemplateElement content support
	const hasContent = 'content' in create(document, 'template');

	// IE 11 has problems with cloning templates: it "forgets" empty childNodes
	testFragment.appendChild(text(testFragment, 'g'));
	testFragment.appendChild(text(testFragment, ''));
	const hasDoomedCloneNode = testFragment.cloneNode(true).childNodes.length === 1;

	// old browsers need to fallback to cloneNode
	// Custom Elements V0 and V1 will work polyfilled
	// but native implementations need importNode instead
	// (specially Chromium and its old V0 implementation)
	const hasImportNode = 'importNode' in document;

	// appends an array of nodes
	// to a generic node/fragment
	// When available, uses append passing all arguments at once
	// hoping that's somehow faster, even if append has more checks on type
	const append = hasAppend ?
	  (node, childNodes) => {
	    node.append.apply(node, childNodes);
	  } :
	  (node, childNodes) => {
	    const length = childNodes.length;
	    for (let i = 0; i < length; i++) {
	      node.appendChild(childNodes[i]);
	    }
	  };

	const findAttributes = new RegExp('(' + attrName + '=)([\'"]?)' + UIDC + '\\2', 'gi');
	const comments = ($0, $1, $2, $3) =>
	  '<' + $1 + $2.replace(findAttributes, replaceAttributes) + $3;
	const replaceAttributes = ($0, $1, $2) => $1 + ($2 || '"') + UID + ($2 || '"');

	// given a node and a generic HTML content,
	// create either an SVG or an HTML fragment
	// where such content will be injected
	const createFragment = (node, html) =>
	  (OWNER_SVG_ELEMENT in node ?
	    SVGFragment :
	    HTMLFragment
	  )(node, html.replace(attrSeeker, comments));

	// IE/Edge shenanigans proof cloneNode
	// it goes through all nodes manually
	// instead of relying the engine to suddenly
	// merge nodes together
	const cloneNode = hasDoomedCloneNode ?
	  node => {
	    const clone = node.cloneNode();
	    const childNodes = node.childNodes ||
	                      // this is an excess of caution
	                      // but some node, in IE, might not
	                      // have childNodes property.
	                      // The following fallback ensure working code
	                      // in older IE without compromising performance
	                      // or any other browser/engine involved.
	                      /* istanbul ignore next */
	                      [];
	    const length = childNodes.length;
	    for (let i = 0; i < length; i++) {
	      clone.appendChild(cloneNode(childNodes[i]));
	    }
	    return clone;
	  } :
	  // the following ignore is due code-coverage
	  // combination of not having document.importNode
	  // but having a working node.cloneNode.
	  // This shenario is common on older Android/WebKit browsers
	  // but basicHTML here tests just two major cases:
	  // with document.importNode or with broken cloneNode.
	  /* istanbul ignore next */
	  node => node.cloneNode(true);

	// IE and Edge do not support children in SVG nodes
	/* istanbul ignore next */
	const getChildren = node => {
	  const children = [];
	  const childNodes = node.childNodes;
	  const length = childNodes.length;
	  for (let i = 0; i < length; i++) {
	    if (childNodes[i].nodeType === ELEMENT_NODE)
	      children.push(childNodes[i]);
	  }
	  return children;
	};

	// used to import html into fragments
	const importNode = hasImportNode ?
	  (doc$$1, node) => doc$$1.importNode(node, true) :
	  (doc$$1, node) => cloneNode(node);

	// just recycling a one-off array to use slice
	// in every needed place
	const slice = [].slice;

	// lazy evaluated, returns the unique identity
	// of a template literal, as tempalte literal itself.
	// By default, ES2015 template literals are unique
	// tag`a${1}z` === tag`a${2}z`
	// even if interpolated values are different
	// the template chunks are in a frozen Array
	// that is identical each time you use the same
	// literal to represent same static content
	// around its own interpolations.
	const unique = template => TL(template);

	// TL returns a unique version of the template
	// it needs lazy feature detection
	// (cannot trust literals with transpiled code)
	let TL = t => {
	  if (
	    // TypeScript template literals are not standard
	    t.propertyIsEnumerable('raw') ||
	    (
	        // Firefox < 55 has not standard implementation neither
	        /Firefox\/(\d+)/.test((G.navigator || {}).userAgent) &&
	          parseFloat(RegExp.$1) < 55
	        )
	  ) {
	    const T = {};
	    TL = t => {
	      const k = '^' + t.join('^');
	      return T[k] || (T[k] = t);
	    };
	  } else {
	    // make TL an identity like function
	    TL = t => t;
	  }
	  return TL(t);
	};

	// used to store templates objects
	// since neither Map nor WeakMap are safe
	const TemplateMap = () => {
	  try {
	    const wm = new WeakMap;
	    const o_O = Object.freeze([]);
	    wm.set(o_O, true);
	    if (!wm.get(o_O))
	      throw o_O;
	    return wm;
	  } catch(o_O) {
	    // inevitable legacy code leaks due
	    // https://github.com/tc39/ecma262/pull/890
	    return new Map$1;
	  }
	};

	// create document fragments via native template
	// with a fallback for browsers that won't be able
	// to deal with some injected element such <td> or others
	const HTMLFragment = hasContent ?
	  (node, html) => {
	    const container = create(node, 'template');
	    container.innerHTML = html;
	    return container.content;
	  } :
	  (node, html) => {
	    const container = create(node, 'template');
	    const content = fragment(node);
	    if (/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(html)) {
	      const selector = RegExp.$1;
	      container.innerHTML = '<table>' + html + '</table>';
	      append(content, slice.call(container.querySelectorAll(selector)));
	    } else {
	      container.innerHTML = html;
	      append(content, slice.call(container.childNodes));
	    }
	    return content;
	  };

	// creates SVG fragment with a fallback for IE that needs SVG
	// within the HTML content
	const SVGFragment = hasContent ?
	  (node, html) => {
	    const content = fragment(node);
	    const container = doc(node).createElementNS(SVG_NAMESPACE, 'svg');
	    container.innerHTML = html;
	    append(content, slice.call(container.childNodes));
	    return content;
	  } :
	  (node, html) => {
	    const content = fragment(node);
	    const container = create(node, 'div');
	    container.innerHTML = '<svg xmlns="' + SVG_NAMESPACE + '">' + html + '</svg>';
	    append(content, slice.call(container.firstChild.childNodes));
	    return content;
	  };

	function Wire(childNodes) {
	  this.childNodes = childNodes;
	  this.length = childNodes.length;
	  this.first = childNodes[0];
	  this.last = childNodes[this.length - 1];
	}

	// when a wire is inserted, all its nodes will follow
	Wire.prototype.insert = function insert() {
	  const df = fragment(this.first);
	  append(df, this.childNodes);
	  return df;
	};

	// when a wire is removed, all its nodes must be removed as well
	Wire.prototype.remove = function remove() {
	  const first = this.first;
	  const last = this.last;
	  if (this.length === 2) {
	    last.parentNode.removeChild(last);
	  } else {
	    const range = doc(first).createRange();
	    range.setStartBefore(this.childNodes[1]);
	    range.setEndAfter(last);
	    range.deleteContents();
	  }
	  return first;
	};

	// every template literal interpolation indicates
	// a precise target in the DOM the template is representing.
	// `<p id=${'attribute'}>some ${'content'}</p>`
	// hyperHTML finds only once per template literal,
	// hence once per entire application life-cycle,
	// all nodes that are related to interpolations.
	// These nodes are stored as indexes used to retrieve,
	// once per upgrade, nodes that will change on each future update.
	// A path example is [2, 0, 1] representing the operation:
	// node.childNodes[2].childNodes[0].childNodes[1]
	// Attributes are addressed via their owner node and their name.
	const createPath = node => {
	  const path = [];
	  let parentNode;
	  switch (node.nodeType) {
	    case ELEMENT_NODE:
	    case DOCUMENT_FRAGMENT_NODE:
	      parentNode = node;
	      break;
	    case COMMENT_NODE:
	      parentNode = node.parentNode;
	      prepend(path, parentNode, node);
	      break;
	    default:
	      parentNode = node.ownerElement;
	      break;
	  }
	  for (
	    node = parentNode;
	    (parentNode = parentNode.parentNode);
	    node = parentNode
	  ) {
	    prepend(path, parentNode, node);
	  }
	  return path;
	};

	const prepend = (path, parent, node) => {
	  path.unshift(path.indexOf.call(parent.childNodes, node));
	};

	var Path = {
	  create: (type, node, name) => ({type, name, node, path: createPath(node)}),
	  find: (node, path) => {
	    const length = path.length;
	    for (let i = 0; i < length; i++) {
	      node = node.childNodes[path[i]];
	    }
	    return node;
	  }
	}

	// from https://github.com/developit/preact/blob/33fc697ac11762a1cb6e71e9847670d047af7ce5/src/constants.js
	const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

	// style is handled as both string and object
	// even if the target is an SVG element (consistency)
	var Style = (node, original, isSVG) => {
	  if (isSVG) {
	    const style = original.cloneNode(true);
	    style.value = '';
	    node.setAttributeNode(style);
	    return update(style, isSVG);
	  }
	  return update(node.style, isSVG);
	};

	// the update takes care or changing/replacing
	// only properties that are different or
	// in case of string, the whole node
	const update = (style, isSVG) => {
	  let oldType, oldValue;
	  return newValue => {
	    switch (typeof newValue) {
	      case 'object':
	        if (newValue) {
	          if (oldType === 'object') {
	            if (!isSVG) {
	              if (oldValue !== newValue) {
	                for (const key in oldValue) {
	                  if (!(key in newValue)) {
	                    style[key] = '';
	                  }
	                }
	              }
	            }
	          } else {
	            if (isSVG) style.value = '';
	            else style.cssText = '';
	          }
	          const info = isSVG ? {} : style;
	          for (const key in newValue) {
	            const value = newValue[key];
	            info[key] = typeof value === 'number' &&
	                        !IS_NON_DIMENSIONAL.test(key) ?
	                          (value + 'px') : value;
	          }
	          oldType = 'object';
	          if (isSVG) style.value = toStyle((oldValue = info));
	          else oldValue = newValue;
	          break;
	        }
	      default:
	        if (oldValue != newValue) {
	          oldType = 'string';
	          oldValue = newValue;
	          if (isSVG) style.value = newValue || '';
	          else style.cssText = newValue || '';
	        }
	        break;
	    }
	  };
	};

	const hyphen = /([^A-Z])([A-Z]+)/g;
	const ized = ($0, $1, $2) => $1 + '-' + $2.toLowerCase();
	const toStyle = object => {
	  const css = [];
	  for (const key in object) {
	    css.push(key.replace(hyphen, ized), ':', object[key], ';');
	  }
	  return css.join('');
	};

	/* AUTOMATICALLY IMPORTED, DO NOT MODIFY */
	/*! (c) 2017 Andrea Giammarchi (ISC) */

	/**
	 * This code is a revisited port of the snabbdom vDOM diffing logic,
	 * the same that fuels as fork Vue.js or other libraries.
	 * @credits https://github.com/snabbdom/snabbdom
	 */

	const eqeq = (a, b) => a == b;

	const identity$1 = O => O;

	const remove = (get, parentNode, before, after) => {
	  if (after == null) {
	    parentNode.removeChild(get(before, -1));
	  } else {
	    const range = parentNode.ownerDocument.createRange();
	    range.setStartBefore(get(before, -1));
	    range.setEndAfter(get(after, -1));
	    range.deleteContents();
	  }
	};

	const domdiff = (
	  parentNode,     // where changes happen
	  currentNodes,   // Array of current items/nodes
	  futureNodes,    // Array of future items/nodes
	  options         // optional object with one of the following properties
	                  //  before: domNode
	                  //  compare(generic, generic) => true if same generic
	                  //  node(generic) => Node
	) => {
	  if (!options)
	    options = {};
	  const compare = options.compare || eqeq;
	  const get = options.node || identity$1;
	  const before = options.before == null ? null : get(options.before, 0);
	  let currentStart = 0, futureStart = 0;
	  let currentEnd = currentNodes.length - 1;
	  let currentStartNode = currentNodes[0];
	  let currentEndNode = currentNodes[currentEnd];
	  let futureEnd = futureNodes.length - 1;
	  let futureStartNode = futureNodes[0];
	  let futureEndNode = futureNodes[futureEnd];
	  while (currentStart <= currentEnd && futureStart <= futureEnd) {
	    if (currentStartNode == null) {
	      currentStartNode = currentNodes[++currentStart];
	    }
	    else if (currentEndNode == null) {
	      currentEndNode = currentNodes[--currentEnd];
	    }
	    else if (futureStartNode == null) {
	      futureStartNode = futureNodes[++futureStart];
	    }
	    else if (futureEndNode == null) {
	      futureEndNode = futureNodes[--futureEnd];
	    }
	    else if (compare(currentStartNode, futureStartNode)) {
	      currentStartNode = currentNodes[++currentStart];
	      futureStartNode = futureNodes[++futureStart];
	    }
	    else if (compare(currentEndNode, futureEndNode)) {
	      currentEndNode = currentNodes[--currentEnd];
	      futureEndNode = futureNodes[--futureEnd];
	    }
	    else if (compare(currentStartNode, futureEndNode)) {
	      parentNode.insertBefore(
	        get(currentStartNode, 1),
	        get(currentEndNode, -0).nextSibling
	      );
	      currentStartNode = currentNodes[++currentStart];
	      futureEndNode = futureNodes[--futureEnd];
	    }
	    else if (compare(currentEndNode, futureStartNode)) {
	      parentNode.insertBefore(
	        get(currentEndNode, 1),
	        get(currentStartNode, 0)
	      );
	      currentEndNode = currentNodes[--currentEnd];
	      futureStartNode = futureNodes[++futureStart];
	    }
	    else {
	      let index = currentNodes.indexOf(futureStartNode);
	      if (index < 0) {
	        parentNode.insertBefore(
	          get(futureStartNode, 1),
	          get(currentStartNode, 0)
	        );
	        futureStartNode = futureNodes[++futureStart];
	      }
	      else {
	        let i = index;
	        let f = futureStart;
	        while (
	          i <= currentEnd &&
	          f <= futureEnd &&
	          currentNodes[i] === futureNodes[f]
	        ) {
	          i++;
	          f++;
	        }
	        if (1 < (i - index)) {
	          if (--index === currentStart) {
	            parentNode.removeChild(get(currentStartNode, -1));
	          } else {
	            remove(
	              get,
	              parentNode,
	              currentStartNode,
	              currentNodes[index]
	            );
	          }
	          currentStart = i;
	          futureStart = f;
	          currentStartNode = currentNodes[i];
	          futureStartNode = futureNodes[f];
	        } else {
	          const el = currentNodes[index];
	          currentNodes[index] = null;
	          parentNode.insertBefore(get(el, 1), get(currentStartNode, 0));
	          futureStartNode = futureNodes[++futureStart];
	        }
	      }
	    }
	  }
	  if (currentStart <= currentEnd || futureStart <= futureEnd) {
	    if (currentStart > currentEnd) {
	      const pin = futureNodes[futureEnd + 1];
	      const place = pin == null ? before : get(pin, 0);
	      if (futureStart === futureEnd) {
	        parentNode.insertBefore(get(futureNodes[futureStart], 1), place);
	      }
	      else {
	        const fragment = parentNode.ownerDocument.createDocumentFragment();
	        while (futureStart <= futureEnd) {
	          fragment.appendChild(get(futureNodes[futureStart++], 1));
	        }
	        parentNode.insertBefore(fragment, place);
	      }
	    }
	    else {
	      if (currentNodes[currentStart] == null)
	        currentStart++;
	      if (currentStart === currentEnd) {
	        parentNode.removeChild(get(currentNodes[currentStart], -1));
	      }
	      else {
	        remove(
	          get,
	          parentNode,
	          currentNodes[currentStart],
	          currentNodes[currentEnd]
	        );
	      }
	    }
	  }
	  return futureNodes;
	};

	// hyper.Component have a connected/disconnected
	// mechanism provided by MutationObserver
	// This weak set is used to recognize components
	// as DOM node that needs to trigger connected/disconnected events
	const components = new WeakSet;

	// a basic dictionary used to filter already cached attributes
	// while looking for special hyperHTML values.
	function Cache() {}
	Cache.prototype = Object.create(null);

	// returns an intent to explicitly inject content as html
	const asHTML = html => ({html});

	// returns nodes from wires and components
	const asNode = (item, i) => {
	  return 'ELEMENT_NODE' in item ?
	    item :
	    (item.constructor === Wire ?
	      // in the Wire case, the content can be
	      // removed, post-pended, inserted, or pre-pended and
	      // all these cases are handled by domdiff already
	      /* istanbul ignore next */
	      ((1 / i) < 0 ?
	        (i ? item.remove() : item.last) :
	        (i ? item.insert() : item.first)) :
	      asNode(item.render(), i));
	};

	// returns true if domdiff can handle the value
	const canDiff = value =>  'ELEMENT_NODE' in value ||
	value instanceof Wire ||
	value instanceof Component$1;

	// updates are created once per context upgrade
	// within the main render function (../hyper/render.js)
	// These are an Array of callbacks to invoke passing
	// each interpolation value.
	// Updates can be related to any kind of content,
	// attributes, or special text-only cases such <style>
	// elements or <textarea>
	const create$1 = (root, paths) => {
	  const updates = [];
	  const length = paths.length;
	  for (let i = 0; i < length; i++) {
	    const info = paths[i];
	    const node = Path.find(root, info.path);
	    switch (info.type) {
	      case 'any':
	        updates.push(setAnyContent(node, []));
	        break;
	      case 'attr':
	        updates.push(setAttribute(node, info.name, info.node));
	        break;
	      case 'text':
	        updates.push(setTextContent(node));
	        node.textContent = '';
	        break;
	    }
	  }
	  return updates;
	};

	// finding all paths is a one-off operation performed
	// when a new template literal is used.
	// The goal is to map all target nodes that will be
	// used to update content/attributes every time
	// the same template literal is used to create content.
	// The result is a list of paths related to the template
	// with all the necessary info to create updates as
	// list of callbacks that target directly affected nodes.
	const find$1 = (node, paths, parts) => {
	  const childNodes = node.childNodes;
	  const length = childNodes.length;
	  for (let i = 0; i < length; i++) {
	    let child = childNodes[i];
	    switch (child.nodeType) {
	      case ELEMENT_NODE:
	        findAttributes$1(child, paths, parts);
	        find$1(child, paths, parts);
	        break;
	      case COMMENT_NODE:
	        if (child.textContent === UID) {
	          parts.shift();
	          paths.push(
	            // basicHTML or other non standard engines
	            // might end up having comments in nodes
	            // where they shouldn't, hence this check.
	            SHOULD_USE_TEXT_CONTENT.test(node.nodeName) ?
	              Path.create('text', node) :
	              Path.create('any', child)
	          );
	        }
	        break;
	      case TEXT_NODE:
	        // the following ignore is actually covered by browsers
	        // only basicHTML ends up on previous COMMENT_NODE case
	        // instead of TEXT_NODE because it knows nothing about
	        // special style or textarea behavior
	        /* istanbul ignore if */
	        if (
	          SHOULD_USE_TEXT_CONTENT.test(node.nodeName) &&
	          trim.call(child.textContent) === UIDC
	        ) {
	          parts.shift();
	          paths.push(Path.create('text', node));
	        }
	        break;
	    }
	  }
	};

	// attributes are searched via unique hyperHTML id value.
	// Despite HTML being case insensitive, hyperHTML is able
	// to recognize attributes by name in a caseSensitive way.
	// This plays well with Custom Elements definitions
	// and also with XML-like environments, without trusting
	// the resulting DOM but the template literal as the source of truth.
	// IE/Edge has a funny bug with attributes and these might be duplicated.
	// This is why there is a cache in charge of being sure no duplicated
	// attributes are ever considered in future updates.
	const findAttributes$1 = (node, paths, parts) => {
	  const cache = new Cache;
	  const attributes = node.attributes;
	  const array = slice.call(attributes);
	  const remove = [];
	  const length = array.length;
	  for (let i = 0; i < length; i++) {
	    const attribute = array[i];
	    if (attribute.value === UID) {
	      const name = attribute.name;
	      // the following ignore is covered by IE
	      // and the IE9 double viewBox test
	      /* istanbul ignore else */
	      if (!(name in cache)) {
	        const realName = parts.shift().replace(/^(?:|[\S\s]*?\s)(\S+?)=['"]?$/, '$1');
	        cache[name] = attributes[realName] ||
	                      // the following ignore is covered by browsers
	                      // while basicHTML is already case-sensitive
	                      /* istanbul ignore next */
	                      attributes[realName.toLowerCase()];
	        paths.push(Path.create('attr', cache[name], realName));
	      }
	      remove.push(attribute);
	    }
	  }
	  const len = remove.length;
	  for (let i = 0; i < len; i++) {
	    // Edge HTML bug #16878726
	    const attribute = remove[i];
	    if (/^id$/i.test(attribute.name))
	      node.removeAttribute(attribute.name);
	    // standard browsers would work just fine here
	    else
	      node.removeAttributeNode(remove[i]);
	  }

	  // This is a very specific Firefox/Safari issue
	  // but since it should be a not so common pattern,
	  // it's probably worth patching regardless.
	  // Basically, scripts created through strings are death.
	  // You need to create fresh new scripts instead.
	  // TODO: is there any other node that needs such nonsense?
	  const nodeName = node.nodeName;
	  if (/^script$/i.test(nodeName)) {
	    // this used to be like that
	    // const script = createElement(node, nodeName);
	    // then Edge arrived and decided that scripts created
	    // through template documents aren't worth executing
	    // so it became this ... hopefully it won't hurt in the wild
	    const script = document.createElement(nodeName);
	    for (let i = 0; i < attributes.length; i++) {
	      script.setAttributeNode(attributes[i].cloneNode(true));
	    }
	    script.textContent = node.textContent;
	    node.parentNode.replaceChild(script, node);
	  }
	};

	// when a Promise is used as interpolation value
	// its result must be parsed once resolved.
	// This callback is in charge of understanding what to do
	// with a returned value once the promise is resolved.
	const invokeAtDistance = (value, callback) => {
	  callback(value.placeholder);
	  if ('text' in value) {
	    Promise.resolve(value.text).then(String).then(callback);
	  } else if ('any' in value) {
	    Promise.resolve(value.any).then(callback);
	  } else if ('html' in value) {
	    Promise.resolve(value.html).then(asHTML).then(callback);
	  } else {
	    Promise.resolve(Intent.invoke(value, callback)).then(callback);
	  }
	};

	// quick and dirty way to check for Promise/ish values
	const isPromise_ish = value => value != null && 'then' in value;

	// in a hyper(node)`<div>${content}</div>` case
	// everything could happen:
	//  * it's a JS primitive, stored as text
	//  * it's null or undefined, the node should be cleaned
	//  * it's a component, update the content by rendering it
	//  * it's a promise, update the content once resolved
	//  * it's an explicit intent, perform the desired operation
	//  * it's an Array, resolve all values if Promises and/or
	//    update the node with the resulting list of content
	const setAnyContent = (node, childNodes) => {
	  const diffOptions = {node: asNode, before: node};
	  let fastPath = false;
	  let oldValue;
	  const anyContent = value => {
	    switch (typeof value) {
	      case 'string':
	      case 'number':
	      case 'boolean':
	        if (fastPath) {
	          if (oldValue !== value) {
	            oldValue = value;
	            childNodes[0].textContent = value;
	          }
	        } else {
	          fastPath = true;
	          oldValue = value;
	          childNodes = domdiff(
	            node.parentNode,
	            childNodes,
	            [text(node, value)],
	            diffOptions
	          );
	        }
	        break;
	      case 'object':
	      case 'undefined':
	        if (value == null) {
	          fastPath = false;
	          childNodes = domdiff(
	            node.parentNode,
	            childNodes,
	            [],
	            diffOptions
	          );
	          break;
	        }
	      default:
	        fastPath = false;
	        oldValue = value;
	        if (isArray$1(value)) {
	          if (value.length === 0) {
	            if (childNodes.length) {
	              childNodes = domdiff(
	                node.parentNode,
	                childNodes,
	                [],
	                diffOptions
	              );
	            }
	          } else {
	            switch (typeof value[0]) {
	              case 'string':
	              case 'number':
	              case 'boolean':
	                anyContent({html: value});
	                break;
	              case 'object':
	                if (isArray$1(value[0])) {
	                  value = value.concat.apply([], value);
	                }
	                if (isPromise_ish(value[0])) {
	                  Promise.all(value).then(anyContent);
	                  break;
	                }
	              default:
	                childNodes = domdiff(
	                  node.parentNode,
	                  childNodes,
	                  value,
	                  diffOptions
	                );
	                break;
	            }
	          }
	        } else if (canDiff(value)) {
	          childNodes = domdiff(
	            node.parentNode,
	            childNodes,
	            value.nodeType === DOCUMENT_FRAGMENT_NODE ?
	              slice.call(value.childNodes) :
	              [value],
	            diffOptions
	          );
	        } else if (isPromise_ish(value)) {
	          value.then(anyContent);
	        } else if ('placeholder' in value) {
	          invokeAtDistance(value, anyContent);
	        } else if ('text' in value) {
	          anyContent(String(value.text));
	        } else if ('any' in value) {
	          anyContent(value.any);
	        } else if ('html' in value) {
	          childNodes = domdiff(
	            node.parentNode,
	            childNodes,
	            slice.call(
	              createFragment(
	                node,
	                [].concat(value.html).join('')
	              ).childNodes
	            ),
	            diffOptions
	          );
	        } else if ('length' in value) {
	          anyContent(slice.call(value));
	        } else {
	          anyContent(Intent.invoke(value, anyContent));
	        }
	        break;
	    }
	  };
	  return anyContent;
	};

	// there are four kind of attributes, and related behavior:
	//  * events, with a name starting with `on`, to add/remove event listeners
	//  * special, with a name present in their inherited prototype, accessed directly
	//  * regular, accessed through get/setAttribute standard DOM methods
	//  * style, the only regular attribute that also accepts an object as value
	//    so that you can style=${{width: 120}}. In this case, the behavior has been
	//    fully inspired by Preact library and its simplicity.
	const setAttribute = (node, name, original) => {
	  const isSVG = OWNER_SVG_ELEMENT in node;
	  let oldValue;
	  // if the attribute is the style one
	  // handle it differently from others
	  if (name === 'style') {
	    return Style(node, original, isSVG);
	  }
	  // the name is an event one,
	  // add/remove event listeners accordingly
	  else if (/^on/.test(name)) {
	    let type = name.slice(2);
	    if (type === CONNECTED || type === DISCONNECTED) {
	      if (notObserving) {
	        notObserving = false;
	        observe();
	      }
	      components.add(node);
	    }
	    else if (name.toLowerCase() in node) {
	      type = type.toLowerCase();
	    }
	    return newValue => {
	      if (oldValue !== newValue) {
	        if (oldValue) node.removeEventListener(type, oldValue, false);
	        oldValue = newValue;
	        if (newValue) node.addEventListener(type, newValue, false);
	      }
	    };
	  }
	  // the attribute is special ('value' in input)
	  // and it's not SVG *or* the name is exactly data,
	  // in this case assign the value directly
	  else if (name === 'data' || (!isSVG && name in node)) {
	    return newValue => {
	      if (oldValue !== newValue) {
	        oldValue = newValue;
	        if (node[name] !== newValue) {
	          node[name] = newValue;
	          if (newValue == null) {
	            node.removeAttribute(name);
	          }
	        }
	      }
	    };
	  }
	  // in every other case, use the attribute node as it is
	  // update only the value, set it as node only when/if needed
	  else {
	    let owner = false;
	    const attribute = original.cloneNode(true);
	    return newValue => {
	      if (oldValue !== newValue) {
	        oldValue = newValue;
	        if (attribute.value !== newValue) {
	          if (newValue == null) {
	            if (owner) {
	              owner = false;
	              node.removeAttributeNode(attribute);
	            }
	            attribute.value = newValue;
	          } else {
	            attribute.value = newValue;
	            if (!owner) {
	              owner = true;
	              node.setAttributeNode(attribute);
	            }
	          }
	        }
	      }
	    };
	  }
	};

	// style or textareas don't accept HTML as content
	// it's pointless to transform or analyze anything
	// different from text there but it's worth checking
	// for possible defined intents.
	const setTextContent = node => {
	  let oldValue;
	  const textContent = value => {
	    if (oldValue !== value) {
	      oldValue = value;
	      if (typeof value === 'object' && value) {
	        if (isPromise_ish(value)) {
	          value.then(textContent);
	        } else if ('placeholder' in value) {
	          invokeAtDistance(value, textContent);
	        } else if ('text' in value) {
	          textContent(String(value.text));
	        } else if ('any' in value) {
	          textContent(value.any);
	        } else if ('html' in value) {
	          textContent([].concat(value.html).join(''));
	        } else if ('length' in value) {
	          textContent(slice.call(value).join(''));
	        } else {
	          textContent(Intent.invoke(value, textContent));
	        }
	      } else {
	        node.textContent = value == null ? '' : value;
	      }
	    }
	  };
	  return textContent;
	};

	var Updates = {create: create$1, find: find$1};

	// hyper.Components might need connected/disconnected notifications
	// used by components and their onconnect/ondisconnect callbacks.
	// When one of these callbacks is encountered,
	// the document starts being observed.
	let notObserving = true;
	function observe() {

	  // when hyper.Component related DOM nodes
	  // are appended or removed from the live tree
	  // these might listen to connected/disconnected events
	  // This utility is in charge of finding all components
	  // involved in the DOM update/change and dispatch
	  // related information to them
	  const dispatchAll = (nodes, type) => {
	    const event = new Event(type);
	    const length = nodes.length;
	    for (let i = 0; i < length; i++) {
	      let node = nodes[i];
	      if (node.nodeType === ELEMENT_NODE) {
	        dispatchTarget(node, event);
	      }
	    }
	  };

	  // the way it's done is via the components weak set
	  // and recursively looking for nested components too
	  const dispatchTarget = (node, event) => {
	    if (components.has(node)) {
	      node.dispatchEvent(event);
	    }

	    /* istanbul ignore next */
	    const children = node.children || getChildren(node);
	    const length = children.length;
	    for (let i = 0; i < length; i++) {
	      dispatchTarget(children[i], event);
	    }
	  };

	  // The MutationObserver is the best way to implement that
	  // but there is a fallback to deprecated DOMNodeInserted/Removed
	  // so that even older browsers/engines can help components life-cycle
	  try {
	    (new MutationObserver(records => {
	      const length = records.length;
	      for (let i = 0; i < length; i++) {
	        let record = records[i];
	        dispatchAll(record.removedNodes, DISCONNECTED);
	        dispatchAll(record.addedNodes, CONNECTED);
	      }
	    })).observe(document, {subtree: true, childList: true});
	  } catch(o_O) {
	    document.addEventListener('DOMNodeRemoved', event => {
	      dispatchAll([event.target], DISCONNECTED);
	    }, false);
	    document.addEventListener('DOMNodeInserted', event => {
	      dispatchAll([event.target], CONNECTED);
	    }, false);
	  }
	}

	// a weak collection of contexts that
	// are already known to hyperHTML
	const bewitched = new WeakMap;

	// all unique template literals
	const templates = TemplateMap();

	// better known as hyper.bind(node), the render is
	// the main tag function in charge of fully upgrading
	// or simply updating, contexts used as hyperHTML targets.
	// The `this` context is either a regular DOM node or a fragment.
	function render(template) {
	  const wicked = bewitched.get(this);
	  if (wicked && wicked.template === unique(template)) {
	    update$1.apply(wicked.updates, arguments);
	  } else {
	    upgrade.apply(this, arguments);
	  }
	  return this;
	}

	// an upgrade is in charge of collecting template info,
	// parse it once, if unknown, to map all interpolations
	// as single DOM callbacks, relate such template
	// to the current context, and render it after cleaning the context up
	function upgrade(template) {
	  template = unique(template);
	  const info =  templates.get(template) ||
	                createTemplate.call(this, template);
	  const fragment = importNode(this.ownerDocument, info.fragment);
	  const updates = Updates.create(fragment, info.paths);
	  bewitched.set(this, {template, updates});
	  update$1.apply(updates, arguments);
	  this.textContent = '';
	  this.appendChild(fragment);
	}

	// an update simply loops over all mapped DOM operations
	function update$1() {
	  const length = arguments.length;
	  for (let i = 1; i < length; i++) {
	    this[i - 1](arguments[i]);
	  }
	}

	// a template can be used to create a document fragment
	// aware of all interpolations and with a list
	// of paths used to find once those nodes that need updates,
	// no matter if these are attributes, text nodes, or regular one
	function createTemplate(template) {
	  const paths = [];
	  const html = template.join(UIDC).replace(SC_RE, SC_PLACE);
	  const fragment = createFragment(this, html);
	  Updates.find(fragment, paths, template.slice());
	  const info = {fragment, paths};
	  templates.set(template, info);
	  return info;
	}

	// some node could be special though, like a custom element
	// with a self closing tag, which should work through these changes.
	const SC_RE = selfClosing;
	const SC_PLACE = ($0, $1, $2) => {
	  return VOID_ELEMENTS.test($1) ? $0 : ('<' + $1 + $2 + '></' + $1 + '>');
	};

	// all wires used per each context
	const wires = new WeakMap;

	// A wire content is a virtual reference to one or more nodes.
	// It's represented by either a DOM node, or an Array.
	// In both cases, the wire content role is to simply update
	// all nodes through the list of related callbacks.
	// In few words, a wire content is like an invisible parent node
	// in charge of updating its content like a bound element would do.
	const content = type => {
	  let wire, container, content, template, updates;
	  return function (statics) {
	    statics = unique(statics);
	    let setup = template !== statics;
	    if (setup) {
	      template = statics;
	      content = fragment(document);
	      container = type === 'svg' ?
	        document.createElementNS(SVG_NAMESPACE, 'svg') :
	        content;
	      updates = render.bind(container);
	    }
	    updates.apply(null, arguments);
	    if (setup) {
	      if (type === 'svg') {
	        append(content, slice.call(container.childNodes));
	      }
	      wire = wireContent(content);
	    }
	    return wire;
	  };
	};

	// a document fragment loses its nodes as soon
	// as it's appended into another node.
	// This would easily lose wired content
	// so that on a second render call, the parent
	// node wouldn't know which node was there
	// associated to the interpolation.
	// To prevent hyperHTML to forget about wired nodes,
	// these are either returned as Array or, if there's ony one entry,
	// as single referenced node that won't disappear from the fragment.
	// The initial fragment, at this point, would be used as unique reference.
	const wireContent = node => {
	  const childNodes = node.childNodes;
	  const length = childNodes.length;
	  const wireNodes = [];
	  for (let i = 0; i < length; i++) {
	    let child = childNodes[i];
	    if (
	      child.nodeType === ELEMENT_NODE ||
	      trim.call(child.textContent).length !== 0
	    ) {
	      wireNodes.push(child);
	    }
	  }
	  return wireNodes.length === 1 ? wireNodes[0] : new Wire(wireNodes);
	};

	/*! (c) Andrea Giammarchi (ISC) */

	// all functions are self bound to the right context
	// you can do the following
	// const {bind, wire} = hyperHTML;
	// and use them right away: bind(node)`hello!`;
	const bind$1 = context => render.bind(context);

	// the wire content is the lazy defined
	// html or svg property of each hyper.Component
	setup(content);

	class Rxjs extends HTMLElement {
	    static get observedAttributes() {
	        return ['label'];
	    }
	    constructor(...args) {
	        super(...args);
	        this.html = bind$1(this);
	        // rxjs
	        const source$ = fromEvent(this, 'click');
	        source$.pipe(
	            map(e => 1),
	            scan((total, value) => total + value, 10)
	        ).subscribe(this.onclick.bind(this));
	    }
	    handleEvent(e) {
	        if (e.type === 'click') {
	            this.onclick('ci');
	        }
	    }
	    onclick(v) {
	        console.log(v);
	    }
	    attributeChangedCallback() {
	        this.render();
	    }
	    connectedCallback() {
	        this.render();
	    }
	    render() {
	        return this.html`
            <hyper-button label="click me"></hyper-button>
        `;
	    }
	}

	customElements.define('hyper-rxjs', Rxjs);

	class App extends HTMLElement {
	    constructor(...args) {
	        super(...args);
	        this.state = {
	            clock: {
	                stop: false
	            }
	        };
	        this.html = bind(this);
	    }
	    attributeChangedCallback() {
	        this.render();
	    }
	    connectedCallback() {
	        this.render();
	    }
	    handleEvent(e) {
	        console.log(e.target, e.type, this);
	        this.state.clock.stop = !this.state.clock.stop; 
	        this.render();
	    }
	    render() {
	        return this.html`
            <hyper-redux label="redux"></hyper-redux>
            <hyper-rxjs label="rxjs"></hyper-rxjs>
        `;
	    }
	}

	customElements.define("hyper-app", App);

	document.body.innerHTML = '<hyper-app></hyper-app>';

}());
