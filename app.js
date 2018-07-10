(function () {
  'use strict';

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
  const Map = G.Map || function Map() {
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
  const isArray = Array.isArray || (toString =>
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
  function Component() {
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
      const info = new Map;
      children.set(context, info);
      return info;
    };
    // The Component Class
    Object.defineProperties(
      Component,
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
      Component.prototype,
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
      return new Map;
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
<<<<<<< HEAD
  };
=======
  }
>>>>>>> master

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

  const identity = O => O;

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
    const get = options.node || identity;
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
  value instanceof Component;

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
  const find = (node, paths, parts) => {
    const childNodes = node.childNodes;
    const length = childNodes.length;
    for (let i = 0; i < length; i++) {
      let child = childNodes[i];
      switch (child.nodeType) {
        case ELEMENT_NODE:
          findAttributes$1(child, paths, parts);
          find(child, paths, parts);
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
          if (isArray(value)) {
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
                  if (isArray(value[0])) {
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
<<<<<<< HEAD
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

  var Updates = {create: create$1, find};

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
=======
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
>>>>>>> master
        }
        wire = wireContent(content);
      }
      return wire;
    };
<<<<<<< HEAD
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
  const bind = context => render.bind(context);

  // the wire content is the lazy defined
  // html or svg property of each hyper.Component
  setup(content);

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
=======
    return textContent;
  };

  var Updates = {create: create$1, find};

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
>>>>>>> master
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
<<<<<<< HEAD

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
=======
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

  // A wire is a callback used as tag function
  // to lazily relate a generic object to a template literal.
  // hyper.wire(user)`<div id=user>${user.name}</div>`; => the div#user
  // This provides the ability to have a unique DOM structure
  // related to a unique JS object through a reusable template literal.
  // A wire can specify a type, as svg or html, and also an id
  // via html:id or :id convention. Such :id allows same JS objects
  // to be associated to different DOM structures accordingly with
  // the used template literal without losing previously rendered parts.
  const wire = (obj, type) => obj == null ?
    content(type || 'html') :
    weakly(obj, type || 'html');

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

  // wires are weakly created through objects.
  // Each object can have multiple wires associated
  // and this is thanks to the type + :id feature.
  const weakly = (obj, type) => {
    const i = type.indexOf(':');
    let wire = wires.get(obj);
    let id = type;
    if (-1 < i) {
      id = type.slice(i + 1);
      type = type.slice(0, i) || 'html';
>>>>>>> master
    }
    if (!wire) wires.set(obj, wire = {});
    return wire[id] || (wire[id] = content(type));
  };

<<<<<<< HEAD
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

  const store = createStore(combineReducers({ reducer1, reducer2 }), {}, applyMiddleware(apiMiddleware));


  class Redux extends HTMLElement {
      static get observedAttributes() {
          return ['label'];
      }
      constructor(...args) {
          super(...args);
          this.html = bind(this);
          window.store = store;
          this.state = store.getState().reducer1;
          store.subscribe((() => {
              this.state = store.getState().reducer1;
              this.render();
          }));
      }
      attributeChangedCallback() {
          this.render();
      }
      connectedCallback() {
          this.render();
      }
      render() {
          return this.html`
            <div>${this.state.text}</div>
        `;
      }
  }

  customElements.define('hyper-redux', Redux);

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
		`;
  	}
  }

  customElements.define('hyper-app', App);
=======
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
  const bind = context => render.bind(context);

  // the wire content is the lazy defined
  // html or svg property of each hyper.Component
  setup(content);

  class Clock extends HTMLElement {
      static get observedAttributes() {
          return ["stop"];
      }
      constructor(...args) {
          super(...args);
          this.html = bind(this);
          this.stop = false;
      }
      attributeChangedCallback(attribute, lastValue, currentValue) {
          this.render();
          if (attribute === "stop") {
              console.log(attribute, currentValue);
              this.stop = currentValue;
          }
      }
      connectedCallback() {
          this.timer = setInterval(() => this.tick(), 1000);
          this.render();
      }
      disconnectedCallback() {
          clearInterval(this.timer);
      }
      tick() {
          !this.stop && this.render();
      }
      render() {
          return this.html`
            It is ${new Date().toLocaleTimeString()}. 
        `;
      }
  }

  customElements.define("hyper-clock", Clock);

  class Button extends HTMLElement {
      static get observedAttributes() {
          return ["label"];
      }
      constructor(...args) {
          super(...args);
          this.html = bind(this);
      }
      attributeChangedCallback() {
          this.render();
      }
      connectedCallback() {
          this.render();
      }
      render() {
          return this.html`
            <button>${this.getAttribute("label")}</button>
        `;
      }
  }

  customElements.define("hyper-button", Button);

  class Select extends HTMLElement {
      static get observedAttributes() {
          return ["selected"];
      }
      constructor(...args) {
          super(...args);
          this.html = bind(this);
          this.options = [...this.children].map(o => { return { value: o.value, label: o.label }});
      }
      attributeChangedCallback(attr, lastValue, currentValue) {
          if (attr === 'selected' && (lastValue !== currentValue)) {
              this.render();
          }
      }
      connectedCallback() {
          this.render();
      }
      handleEvent(e) {
          this.setAttribute('selected', e.target.options[e.target.selectedIndex].value);
          this.render();
      }
      render() {
          return this.html`
            <select onchange=${this}>
                ${this.options.map(option => {
                    const w = wire(option);
                    return ((this.getAttribute("selected") === option.value)
                        ? w`<option selected="true" value=${option.value}>${option.label}</option>`
                        : w`<option value=${option.value}>${option.label}</option>`);
                })}
            </select>
        `;
      }
  }

  customElements.define("hyper-select", Select);

  class App extends HTMLElement {
      constructor(...args) {
          super(...args);
          this.state = {
              clock: {
                  stop: false
              },
              select1: {
                  selected: 'o1'
              },
              select2: {
                  selected: 'o4'
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
            <h1>My Hyper HTML Playground</h1>
            <h3>Clock</h3>
            <hyper-clock stop=${this.state.clock.stop} />
            <h3>Button</h3>
            <hyper-button onclick=${this} label=${this.state.clock.stop ? "Resume" : "Stop"}></hyper-button>
            <h3>Select</h3>
            <hyper-select selected=${this.state.select1.selected}>
                <option value="o1">option1</option>
                <option value="o2">option2</option>
            </hyper-select>
            <hyper-select selected=${this.state.select2.selected}>
                <option value="o3">option3</option>
                <option value="o4">option4</option>
            </hyper-select>
            <h3>Grid system</h3>
            <h3>Line chart</h3>
    `;
      }
  }

  customElements.define("hyper-app", App);
>>>>>>> master

  document.body.innerHTML = '<hyper-app></hyper-app>';

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlcyI6WyJub2RlX21vZHVsZXMvaHlwZXJodG1sL2VzbS9zaGFyZWQvY29uc3RhbnRzLmpzIiwibm9kZV9tb2R1bGVzL2h5cGVyaHRtbC9lc20vc2hhcmVkL3Bvb3JseWZpbGxzLmpzIiwibm9kZV9tb2R1bGVzL2h5cGVyaHRtbC9lc20vY2xhc3Nlcy9Db21wb25lbnQuanMiLCJub2RlX21vZHVsZXMvaHlwZXJodG1sL2VzbS9vYmplY3RzL0ludGVudC5qcyIsIm5vZGVfbW9kdWxlcy9oeXBlcmh0bWwvZXNtL3NoYXJlZC9lYXN5LWRvbS5qcyIsIm5vZGVfbW9kdWxlcy9oeXBlcmh0bWwvZXNtL3NoYXJlZC9yZS5qcyIsIm5vZGVfbW9kdWxlcy9oeXBlcmh0bWwvZXNtL3NoYXJlZC9mZWF0dXJlcy1kZXRlY3Rpb24uanMiLCJub2RlX21vZHVsZXMvaHlwZXJodG1sL2VzbS9zaGFyZWQvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvaHlwZXJodG1sL2VzbS9jbGFzc2VzL1dpcmUuanMiLCJub2RlX21vZHVsZXMvaHlwZXJodG1sL2VzbS9vYmplY3RzL1BhdGguanMiLCJub2RlX21vZHVsZXMvaHlwZXJodG1sL2VzbS9vYmplY3RzL1N0eWxlLmpzIiwibm9kZV9tb2R1bGVzL2h5cGVyaHRtbC9lc20vc2hhcmVkL2RvbWRpZmYuanMiLCJub2RlX21vZHVsZXMvaHlwZXJodG1sL2VzbS9vYmplY3RzL1VwZGF0ZXMuanMiLCJub2RlX21vZHVsZXMvaHlwZXJodG1sL2VzbS9oeXBlci9yZW5kZXIuanMiLCJub2RlX21vZHVsZXMvaHlwZXJodG1sL2VzbS9oeXBlci93aXJlLmpzIiwibm9kZV9tb2R1bGVzL2h5cGVyaHRtbC9lc20vaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9DbG9jay5qcyIsInNyYy9jb21wb25lbnRzL0J1dHRvbi5qcyIsInNyYy9jb21wb25lbnRzL1NlbGVjdC5qcyIsInNyYy9hcHAuanMiLCJzcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IEcgPSBkb2N1bWVudC5kZWZhdWx0VmlldztcblxuLy8gTm9kZS5DT05TVEFOVFNcbi8vICdjYXVzZSBzb21lIGVuZ2luZSBoYXMgbm8gZ2xvYmFsIE5vZGUgZGVmaW5lZFxuLy8gKGkuZS4gTm9kZSwgTmF0aXZlU2NyaXB0LCBiYXNpY0hUTUwgLi4uIClcbmV4cG9ydCBjb25zdCBFTEVNRU5UX05PREUgPSAxO1xuZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9OT0RFID0gMjtcbmV4cG9ydCBjb25zdCBURVhUX05PREUgPSAzO1xuZXhwb3J0IGNvbnN0IENPTU1FTlRfTk9ERSA9IDg7XG5leHBvcnQgY29uc3QgRE9DVU1FTlRfRlJBR01FTlRfTk9ERSA9IDExO1xuXG4vLyBIVE1MIHJlbGF0ZWQgY29uc3RhbnRzXG5leHBvcnQgY29uc3QgVk9JRF9FTEVNRU5UUyA9IC9eYXJlYXxiYXNlfGJyfGNvbHxlbWJlZHxocnxpbWd8aW5wdXR8a2V5Z2VufGxpbmt8bWVudWl0ZW18bWV0YXxwYXJhbXxzb3VyY2V8dHJhY2t8d2JyJC9pO1xuXG4vLyBTVkcgcmVsYXRlZCBjb25zdGFudHNcbmV4cG9ydCBjb25zdCBPV05FUl9TVkdfRUxFTUVOVCA9ICdvd25lclNWR0VsZW1lbnQnO1xuZXhwb3J0IGNvbnN0IFNWR19OQU1FU1BBQ0UgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuXG4vLyBDdXN0b20gRWxlbWVudHMgLyBNdXRhdGlvbk9ic2VydmVyIGNvbnN0YW50c1xuZXhwb3J0IGNvbnN0IENPTk5FQ1RFRCA9ICdjb25uZWN0ZWQnO1xuZXhwb3J0IGNvbnN0IERJU0NPTk5FQ1RFRCA9ICdkaXMnICsgQ09OTkVDVEVEO1xuXG4vLyBoeXBlckhUTUwgcmVsYXRlZCBjb25zdGFudHNcbmV4cG9ydCBjb25zdCBFWFBBTkRPID0gJ19oeXBlcjogJztcbmV4cG9ydCBjb25zdCBTSE9VTERfVVNFX1RFWFRfQ09OVEVOVCA9IC9ec3R5bGV8dGV4dGFyZWEkL2k7XG5leHBvcnQgY29uc3QgVUlEID0gRVhQQU5ETyArICgoTWF0aC5yYW5kb20oKSAqIG5ldyBEYXRlKSB8IDApICsgJzsnO1xuZXhwb3J0IGNvbnN0IFVJREMgPSAnPCEtLScgKyBVSUQgKyAnLS0+JztcbiIsImltcG9ydCB7RywgVUlEfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbi8vIHlvdSBrbm93IHRoYXQga2luZCBvZiBiYXNpY3MgeW91IG5lZWQgdG8gY292ZXJcbi8vIHlvdXIgdXNlIGNhc2Ugb25seSBidXQgeW91IGRvbid0IHdhbnQgdG8gYmxvYXQgdGhlIGxpYnJhcnk/XG4vLyBUaGVyZSdzIGV2ZW4gYSBwYWNrYWdlIGluIGhlcmU6XG4vLyBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9wb29ybHlmaWxsc1xuXG4vLyB1c2VkIHRvIGRpc3BhdGNoIHNpbXBsZSBldmVudHNcbmxldCBFdmVudCA9IEcuRXZlbnQ7XG50cnkge1xuICBuZXcgRXZlbnQoJ0V2ZW50Jyk7XG59IGNhdGNoKG9fTykge1xuICBFdmVudCA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgIGUuaW5pdEV2ZW50KHR5cGUsIGZhbHNlLCBmYWxzZSk7XG4gICAgcmV0dXJuIGU7XG4gIH07XG59XG5leHBvcnQge0V2ZW50fTtcblxuLy8gdXNlZCB0byBzdG9yZSB0ZW1wbGF0ZSBsaXRlcmFsc1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmV4cG9ydCBjb25zdCBNYXAgPSBHLk1hcCB8fCBmdW5jdGlvbiBNYXAoKSB7XG4gIGNvbnN0IGtleXMgPSBbXSwgdmFsdWVzID0gW107XG4gIHJldHVybiB7XG4gICAgZ2V0KG9iaikge1xuICAgICAgcmV0dXJuIHZhbHVlc1trZXlzLmluZGV4T2Yob2JqKV07XG4gICAgfSxcbiAgICBzZXQob2JqLCB2YWx1ZSkge1xuICAgICAgdmFsdWVzW2tleXMucHVzaChvYmopIC0gMV0gPSB2YWx1ZTtcbiAgICB9XG4gIH07XG59O1xuXG4vLyB1c2VkIHRvIHN0b3JlIHdpcmVkIGNvbnRlbnRcbmxldCBJRCA9IDA7XG5leHBvcnQgY29uc3QgV2Vha01hcCA9IEcuV2Vha01hcCB8fCBmdW5jdGlvbiBXZWFrTWFwKCkge1xuICBjb25zdCBrZXkgPSBVSUQgKyBJRCsrO1xuICByZXR1cm4ge1xuICAgIGdldChvYmopIHsgcmV0dXJuIG9ialtrZXldOyB9LFxuICAgIHNldChvYmosIHZhbHVlKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufTtcblxuLy8gdXNlZCB0byBzdG9yZSBoeXBlci5Db21wb25lbnRzXG5leHBvcnQgY29uc3QgV2Vha1NldCA9IEcuV2Vha1NldCB8fCBmdW5jdGlvbiBXZWFrU2V0KCkge1xuICBjb25zdCB3bSA9IG5ldyBXZWFrTWFwO1xuICByZXR1cm4ge1xuICAgIGFkZChvYmopIHsgd20uc2V0KG9iaiwgdHJ1ZSk7IH0sXG4gICAgaGFzKG9iaikgeyByZXR1cm4gd20uZ2V0KG9iaikgPT09IHRydWU7IH1cbiAgfTtcbn07XG5cbi8vIHVzZWQgdG8gYmUgc3VyZSBJRTkgb3Igb2xkZXIgQW5kcm9pZHMgd29yayBhcyBleHBlY3RlZFxuZXhwb3J0IGNvbnN0IGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8ICh0b1N0cmluZyA9PlxuICBhcnIgPT4gdG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nXG4pKHt9LnRvU3RyaW5nKTtcblxuZXhwb3J0IGNvbnN0IHRyaW0gPSBVSUQudHJpbSB8fCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbn07XG4iLCJpbXBvcnQgeyBNYXAsIFdlYWtNYXAgfSBmcm9tICcuLi9zaGFyZWQvcG9vcmx5ZmlsbHMuanMnO1xuXG4vLyBoeXBlckhUTUwuQ29tcG9uZW50IGlzIGEgdmVyeSBiYXNpYyBjbGFzc1xuLy8gYWJsZSB0byBjcmVhdGUgQ3VzdG9tIEVsZW1lbnRzIGxpa2UgY29tcG9uZW50c1xuLy8gaW5jbHVkaW5nIHRoZSBhYmlsaXR5IHRvIGxpc3RlbiB0byBjb25uZWN0L2Rpc2Nvbm5lY3Rcbi8vIGV2ZW50cyB2aWEgb25jb25uZWN0L29uZGlzY29ubmVjdCBhdHRyaWJ1dGVzXG4vLyBDb21wb25lbnRzIGNhbiBiZSBjcmVhdGVkIGltcGVyYXRpdmVseSBvciBkZWNsYXJhdGl2ZWx5LlxuLy8gVGhlIG1haW4gZGlmZmVyZW5jZSBpcyB0aGF0IGRlY2xhcmVkIGNvbXBvbmVudHNcbi8vIHdpbGwgbm90IGF1dG9tYXRpY2FsbHkgcmVuZGVyIG9uIHNldFN0YXRlKC4uLilcbi8vIHRvIHNpbXBsaWZ5IHN0YXRlIGhhbmRsaW5nIG9uIHJlbmRlci5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbXBvbmVudCgpIHtcbiAgcmV0dXJuIHRoaXM7IC8vIHRoaXMgaXMgbmVlZGVkIGluIEVkZ2UgISEhXG59XG5cbi8vIENvbXBvbmVudCBpcyBsYXppbHkgc2V0dXAgYmVjYXVzZSBpdCBuZWVkc1xuLy8gd2lyZSBtZWNoYW5pc20gYXMgbGF6eSBjb250ZW50XG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoY29udGVudCkge1xuICAvLyB0aGVyZSBhcmUgdmFyaW91cyB3ZWFrbHkgcmVmZXJlbmNlZCB2YXJpYWJsZXMgaW4gaGVyZVxuICAvLyBhbmQgbW9zdGx5IGFyZSB0byB1c2UgQ29tcG9uZW50LmZvciguLi4pIHN0YXRpYyBtZXRob2QuXG4gIGNvbnN0IGNoaWxkcmVuID0gbmV3IFdlYWtNYXA7XG4gIGNvbnN0IGNyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG4gIGNvbnN0IGNyZWF0ZUVudHJ5ID0gKHdtLCBpZCwgY29tcG9uZW50KSA9PiB7XG4gICAgd20uc2V0KGlkLCBjb21wb25lbnQpO1xuICAgIHJldHVybiBjb21wb25lbnQ7XG4gIH07XG4gIGNvbnN0IGdldCA9IChDbGFzcywgaW5mbywgY29udGV4dCwgaWQpID0+IHtcbiAgICBjb25zdCByZWxhdGlvbiA9IGluZm8uZ2V0KENsYXNzKSB8fCByZWxhdGUoQ2xhc3MsIGluZm8pO1xuICAgIHN3aXRjaCAodHlwZW9mIGlkKSB7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICBjb25zdCB3bSA9IHJlbGF0aW9uLncgfHwgKHJlbGF0aW9uLncgPSBuZXcgV2Vha01hcCk7XG4gICAgICAgIHJldHVybiB3bS5nZXQoaWQpIHx8IGNyZWF0ZUVudHJ5KHdtLCBpZCwgbmV3IENsYXNzKGNvbnRleHQpKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnN0IHNtID0gcmVsYXRpb24ucCB8fCAocmVsYXRpb24ucCA9IGNyZWF0ZShudWxsKSk7XG4gICAgICAgIHJldHVybiBzbVtpZF0gfHwgKHNtW2lkXSA9IG5ldyBDbGFzcyhjb250ZXh0KSk7XG4gICAgfVxuICB9O1xuICBjb25zdCByZWxhdGUgPSAoQ2xhc3MsIGluZm8pID0+IHtcbiAgICBjb25zdCByZWxhdGlvbiA9IHt3OiBudWxsLCBwOiBudWxsfTtcbiAgICBpbmZvLnNldChDbGFzcywgcmVsYXRpb24pO1xuICAgIHJldHVybiByZWxhdGlvbjtcbiAgfTtcbiAgY29uc3Qgc2V0ID0gY29udGV4dCA9PiB7XG4gICAgY29uc3QgaW5mbyA9IG5ldyBNYXA7XG4gICAgY2hpbGRyZW4uc2V0KGNvbnRleHQsIGluZm8pO1xuICAgIHJldHVybiBpbmZvO1xuICB9O1xuICAvLyBUaGUgQ29tcG9uZW50IENsYXNzXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgIENvbXBvbmVudCxcbiAgICB7XG4gICAgICAvLyBDb21wb25lbnQuZm9yKGNvbnRleHRbLCBpZF0pIGlzIGEgY29udmVuaWVudCB3YXlcbiAgICAgIC8vIHRvIGF1dG9tYXRpY2FsbHkgcmVsYXRlIGRhdGEvY29udGV4dCB0byBjaGlsZHJlbiBjb21wb25lbnRzXG4gICAgICAvLyBJZiBub3QgY3JlYXRlZCB5ZXQsIHRoZSBuZXcgQ29tcG9uZW50KGNvbnRleHQpIGlzIHdlYWtseSBzdG9yZWRcbiAgICAgIC8vIGFuZCBhZnRlciB0aGF0IHNhbWUgaW5zdGFuY2Ugd291bGQgYWx3YXlzIGJlIHJldHVybmVkLlxuICAgICAgZm9yOiB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWUoY29udGV4dCwgaWQpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0KFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIGNoaWxkcmVuLmdldChjb250ZXh0KSB8fCBzZXQoY29udGV4dCksXG4gICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgaWQgPT0gbnVsbCA/XG4gICAgICAgICAgICAgICdkZWZhdWx0JyA6IGlkXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgKTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXG4gICAgQ29tcG9uZW50LnByb3RvdHlwZSxcbiAgICB7XG4gICAgICAvLyBhbGwgZXZlbnRzIGFyZSBoYW5kbGVkIHdpdGggdGhlIGNvbXBvbmVudCBhcyBjb250ZXh0XG4gICAgICBoYW5kbGVFdmVudDoge3ZhbHVlKGUpIHtcbiAgICAgICAgY29uc3QgY3QgPSBlLmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIHRoaXNbXG4gICAgICAgICAgKCdnZXRBdHRyaWJ1dGUnIGluIGN0ICYmIGN0LmdldEF0dHJpYnV0ZSgnZGF0YS1jYWxsJykpIHx8XG4gICAgICAgICAgKCdvbicgKyBlLnR5cGUpXG4gICAgICAgIF0oZSk7XG4gICAgICB9fSxcbiAgICAgIC8vIGNvbXBvbmVudHMgd2lsbCBsYXppbHkgZGVmaW5lIGh0bWwgb3Igc3ZnIHByb3BlcnRpZXNcbiAgICAgIC8vIGFzIHNvb24gYXMgdGhlc2UgYXJlIGludm9rZWQgd2l0aGluIHRoZSAucmVuZGVyKCkgbWV0aG9kXG4gICAgICAvLyBTdWNoIHJlbmRlcigpIG1ldGhvZCBpcyBub3QgcHJvdmlkZWQgYnkgdGhlIGJhc2UgY2xhc3NcbiAgICAgIC8vIGJ1dCBpdCBtdXN0IGJlIGF2YWlsYWJsZSB0aHJvdWdoIHRoZSBDb21wb25lbnQgZXh0ZW5kLlxuICAgICAgLy8gRGVjbGFyZWQgY29tcG9uZW50cyBjb3VsZCBpbXBsZW1lbnQgYVxuICAgICAgLy8gcmVuZGVyKHByb3BzKSBtZXRob2QgdG9vIGFuZCB1c2UgcHJvcHMgYXMgbmVlZGVkLlxuICAgICAgaHRtbDogbGF6eUdldHRlcignaHRtbCcsIGNvbnRlbnQpLFxuICAgICAgc3ZnOiBsYXp5R2V0dGVyKCdzdmcnLCBjb250ZW50KSxcbiAgICAgIC8vIHRoZSBzdGF0ZSBpcyBhIHZlcnkgYmFzaWMvc2ltcGxlIG1lY2hhbmlzbSBpbnNwaXJlZCBieSBQcmVhY3RcbiAgICAgIHN0YXRlOiBsYXp5R2V0dGVyKCdzdGF0ZScsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuZGVmYXVsdFN0YXRlOyB9KSxcbiAgICAgIC8vIGl0IGlzIHBvc3NpYmxlIHRvIGRlZmluZSBhIGRlZmF1bHQgc3RhdGUgdGhhdCdkIGJlIGFsd2F5cyBhbiBvYmplY3Qgb3RoZXJ3aXNlXG4gICAgICBkZWZhdWx0U3RhdGU6IHtnZXQoKSB7IHJldHVybiB7fTsgfX0sXG4gICAgICAvLyBzZXR0aW5nIHNvbWUgcHJvcGVydHkgc3RhdGUgdGhyb3VnaCBhIG5ldyBvYmplY3RcbiAgICAgIC8vIG9yIGEgY2FsbGJhY2ssIHRyaWdnZXJzIGFsc28gYXV0b21hdGljYWxseSBhIHJlbmRlclxuICAgICAgLy8gdW5sZXNzIGV4cGxpY2l0bHkgc3BlY2lmaWVkIHRvIG5vdCBkbyBzbyAocmVuZGVyID09PSBmYWxzZSlcbiAgICAgIHNldFN0YXRlOiB7dmFsdWUoc3RhdGUsIHJlbmRlcikge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLnN0YXRlO1xuICAgICAgICBjb25zdCBzb3VyY2UgPSB0eXBlb2Ygc3RhdGUgPT09ICdmdW5jdGlvbicgPyBzdGF0ZS5jYWxsKHRoaXMsIHRhcmdldCkgOiBzdGF0ZTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gc291cmNlKSB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICBpZiAocmVuZGVyICE9PSBmYWxzZSkgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9fVxuICAgIH1cbiAgKTtcbn1cblxuLy8gaW5zdGVhZCBvZiBhIHNlY3JldCBrZXkgSSBjb3VsZCd2ZSB1c2VkIGEgV2Vha01hcFxuLy8gSG93ZXZlciwgYXR0YWNoaW5nIGEgcHJvcGVydHkgZGlyZWN0bHkgd2lsbCByZXN1bHRcbi8vIGludG8gYmV0dGVyIHBlcmZvcm1hbmNlIHdpdGggdGhvdXNhbmRzIG9mIGNvbXBvbmVudHNcbi8vIGhhbmdpbmcgYXJvdW5kLCBhbmQgbGVzcyBtZW1vcnkgcHJlc3N1cmUgY2F1c2VkIGJ5IHRoZSBXZWFrTWFwXG5jb25zdCBsYXp5R2V0dGVyID0gKHR5cGUsIGZuKSA9PiB7XG4gIGNvbnN0IHNlY3JldCA9ICdfJyArIHR5cGUgKyAnJCc7XG4gIHJldHVybiB7XG4gICAgZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXNbc2VjcmV0XSB8fCAodGhpc1t0eXBlXSA9IGZuLmNhbGwodGhpcywgdHlwZSkpO1xuICAgIH0sXG4gICAgc2V0KHZhbHVlKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgc2VjcmV0LCB7Y29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZX0pO1xuICAgIH1cbiAgfTtcbn07XG4iLCJjb25zdCBpbnRlbnRzID0ge307XG5jb25zdCBrZXlzID0gW107XG5jb25zdCBoYXNPd25Qcm9wZXJ0eSA9IGludGVudHMuaGFzT3duUHJvcGVydHk7XG5cbmxldCBsZW5ndGggPSAwO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgLy8gaHlwZXJIVE1MLmRlZmluZSgnaW50ZW50JywgKG9iamVjdCwgdXBkYXRlKSA9PiB7Li4ufSlcbiAgLy8gY2FuIGJlIHVzZWQgdG8gZGVmaW5lIGEgdGhpcmQgcGFydHMgdXBkYXRlIG1lY2hhbmlzbVxuICAvLyB3aGVuIGV2ZXJ5IG90aGVyIGtub3duIG1lY2hhbmlzbSBmYWlsZWQuXG4gIC8vIGh5cGVyLmRlZmluZSgndXNlcicsIGluZm8gPT4gaW5mby5uYW1lKTtcbiAgLy8gaHlwZXIobm9kZSlgPHA+JHt7dXNlcn19PC9wPmA7XG4gIGRlZmluZTogKGludGVudCwgY2FsbGJhY2spID0+IHtcbiAgICBpZiAoIShpbnRlbnQgaW4gaW50ZW50cykpIHtcbiAgICAgIGxlbmd0aCA9IGtleXMucHVzaChpbnRlbnQpO1xuICAgIH1cbiAgICBpbnRlbnRzW2ludGVudF0gPSBjYWxsYmFjaztcbiAgfSxcblxuICAvLyB0aGlzIG1ldGhvZCBpcyB1c2VkIGludGVybmFsbHkgYXMgbGFzdCByZXNvcnRcbiAgLy8gdG8gcmV0cmlldmUgYSB2YWx1ZSBvdXQgb2YgYW4gb2JqZWN0XG4gIGludm9rZTogKG9iamVjdCwgY2FsbGJhY2spID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgICAgICByZXR1cm4gaW50ZW50c1trZXldKG9iamVjdFtrZXldLCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiLy8gdGhlc2UgYXJlIHRpbnkgaGVscGVycyB0byBzaW1wbGlmeSBtb3N0IGNvbW1vbiBvcGVyYXRpb25zIG5lZWRlZCBoZXJlXG5leHBvcnQgY29uc3QgY3JlYXRlID0gKG5vZGUsIHR5cGUpID0+IGRvYyhub2RlKS5jcmVhdGVFbGVtZW50KHR5cGUpO1xuZXhwb3J0IGNvbnN0IGRvYyA9IG5vZGUgPT4gbm9kZS5vd25lckRvY3VtZW50IHx8IG5vZGU7XG5leHBvcnQgY29uc3QgZnJhZ21lbnQgPSBub2RlID0+IGRvYyhub2RlKS5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5leHBvcnQgY29uc3QgdGV4dCA9IChub2RlLCB0ZXh0KSA9PiBkb2Mobm9kZSkuY3JlYXRlVGV4dE5vZGUodGV4dCk7XG4iLCIvLyBUT0RPOiAgSSdkIGxvdmUgdG8gY29kZS1jb3ZlciBSZWdFeHAgdG9vIGhlcmVcbi8vICAgICAgICB0aGVzZSBhcmUgZnVuZGFtZW50YWwgZm9yIHRoaXMgbGlicmFyeVxuXG5jb25zdCBzcGFjZXMgPSAnIFxcXFxmXFxcXG5cXFxcclxcXFx0JztcbmNvbnN0IGFsbW9zdEV2ZXJ5dGhpbmcgPSAnW14gJyArIHNwYWNlcyArICdcXFxcLz5cIlxcJz1dKyc7XG5jb25zdCBhdHRyTmFtZSA9ICdbICcgKyBzcGFjZXMgKyAnXSsnICsgYWxtb3N0RXZlcnl0aGluZztcbmNvbnN0IHRhZ05hbWUgPSAnPChbQS1aYS16XStbQS1aYS16MC05Ol8tXSopKCg/Oic7XG5jb25zdCBhdHRyUGFydGlhbHMgPSAnKD86PSg/OlxcJ1teXFwnXSo/XFwnfFwiW15cIl0qP1wifDxbXj5dKj8+fCcgKyBhbG1vc3RFdmVyeXRoaW5nICsgJykpPyknO1xuXG5jb25zdCBhdHRyU2Vla2VyID0gbmV3IFJlZ0V4cChcbiAgdGFnTmFtZSArIGF0dHJOYW1lICsgYXR0clBhcnRpYWxzICsgJyspKFsgJyArIHNwYWNlcyArICddKi8/PiknLFxuICAnZydcbik7XG5cbmNvbnN0IHNlbGZDbG9zaW5nID0gbmV3IFJlZ0V4cChcbiAgdGFnTmFtZSArIGF0dHJOYW1lICsgYXR0clBhcnRpYWxzICsgJyopKFsgJyArIHNwYWNlcyArICddKi8+KScsXG4gICdnJ1xuKTtcblxuZXhwb3J0IHthdHRyTmFtZSwgYXR0clNlZWtlciwgc2VsZkNsb3Npbmd9O1xuIiwiaW1wb3J0IHtjcmVhdGUsIGZyYWdtZW50LCB0ZXh0fSBmcm9tICcuL2Vhc3ktZG9tLmpzJztcblxuY29uc3QgdGVzdEZyYWdtZW50ID0gZnJhZ21lbnQoZG9jdW1lbnQpO1xuXG4vLyBET000IG5vZGUuYXBwZW5kKC4uLm1hbnkpXG5leHBvcnQgY29uc3QgaGFzQXBwZW5kID0gJ2FwcGVuZCcgaW4gdGVzdEZyYWdtZW50O1xuXG4vLyBkZXRlY3Qgb2xkIGJyb3dzZXJzIHdpdGhvdXQgSFRNTFRlbXBsYXRlRWxlbWVudCBjb250ZW50IHN1cHBvcnRcbmV4cG9ydCBjb25zdCBoYXNDb250ZW50ID0gJ2NvbnRlbnQnIGluIGNyZWF0ZShkb2N1bWVudCwgJ3RlbXBsYXRlJyk7XG5cbi8vIElFIDExIGhhcyBwcm9ibGVtcyB3aXRoIGNsb25pbmcgdGVtcGxhdGVzOiBpdCBcImZvcmdldHNcIiBlbXB0eSBjaGlsZE5vZGVzXG50ZXN0RnJhZ21lbnQuYXBwZW5kQ2hpbGQodGV4dCh0ZXN0RnJhZ21lbnQsICdnJykpO1xudGVzdEZyYWdtZW50LmFwcGVuZENoaWxkKHRleHQodGVzdEZyYWdtZW50LCAnJykpO1xuZXhwb3J0IGNvbnN0IGhhc0Rvb21lZENsb25lTm9kZSA9IHRlc3RGcmFnbWVudC5jbG9uZU5vZGUodHJ1ZSkuY2hpbGROb2Rlcy5sZW5ndGggPT09IDE7XG5cbi8vIG9sZCBicm93c2VycyBuZWVkIHRvIGZhbGxiYWNrIHRvIGNsb25lTm9kZVxuLy8gQ3VzdG9tIEVsZW1lbnRzIFYwIGFuZCBWMSB3aWxsIHdvcmsgcG9seWZpbGxlZFxuLy8gYnV0IG5hdGl2ZSBpbXBsZW1lbnRhdGlvbnMgbmVlZCBpbXBvcnROb2RlIGluc3RlYWRcbi8vIChzcGVjaWFsbHkgQ2hyb21pdW0gYW5kIGl0cyBvbGQgVjAgaW1wbGVtZW50YXRpb24pXG5leHBvcnQgY29uc3QgaGFzSW1wb3J0Tm9kZSA9ICdpbXBvcnROb2RlJyBpbiBkb2N1bWVudDtcbiIsImltcG9ydCB7YXR0ck5hbWUsIGF0dHJTZWVrZXJ9IGZyb20gJy4vcmUuanMnO1xuXG5pbXBvcnQge1xuICBHLFxuICBFTEVNRU5UX05PREUsXG4gIE9XTkVSX1NWR19FTEVNRU5ULFxuICBTVkdfTkFNRVNQQUNFLFxuICBVSUQsXG4gIFVJRENcbn0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuXG5pbXBvcnQge1xuICBoYXNBcHBlbmQsXG4gIGhhc0NvbnRlbnQsXG4gIGhhc0Rvb21lZENsb25lTm9kZSxcbiAgaGFzSW1wb3J0Tm9kZVxufSBmcm9tICcuL2ZlYXR1cmVzLWRldGVjdGlvbi5qcyc7XG5cbmltcG9ydCB7Y3JlYXRlLCBkb2MsIGZyYWdtZW50fSBmcm9tICcuL2Vhc3ktZG9tLmpzJztcblxuaW1wb3J0IHtNYXAsIFdlYWtNYXB9IGZyb20gJy4vcG9vcmx5ZmlsbHMuanMnO1xuXG4vLyBhcHBlbmRzIGFuIGFycmF5IG9mIG5vZGVzXG4vLyB0byBhIGdlbmVyaWMgbm9kZS9mcmFnbWVudFxuLy8gV2hlbiBhdmFpbGFibGUsIHVzZXMgYXBwZW5kIHBhc3NpbmcgYWxsIGFyZ3VtZW50cyBhdCBvbmNlXG4vLyBob3BpbmcgdGhhdCdzIHNvbWVob3cgZmFzdGVyLCBldmVuIGlmIGFwcGVuZCBoYXMgbW9yZSBjaGVja3Mgb24gdHlwZVxuZXhwb3J0IGNvbnN0IGFwcGVuZCA9IGhhc0FwcGVuZCA/XG4gIChub2RlLCBjaGlsZE5vZGVzKSA9PiB7XG4gICAgbm9kZS5hcHBlbmQuYXBwbHkobm9kZSwgY2hpbGROb2Rlcyk7XG4gIH0gOlxuICAobm9kZSwgY2hpbGROb2RlcykgPT4ge1xuICAgIGNvbnN0IGxlbmd0aCA9IGNoaWxkTm9kZXMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoY2hpbGROb2Rlc1tpXSk7XG4gICAgfVxuICB9O1xuXG5jb25zdCBmaW5kQXR0cmlidXRlcyA9IG5ldyBSZWdFeHAoJygnICsgYXR0ck5hbWUgKyAnPSkoW1xcJ1wiXT8pJyArIFVJREMgKyAnXFxcXDInLCAnZ2knKTtcbmNvbnN0IGNvbW1lbnRzID0gKCQwLCAkMSwgJDIsICQzKSA9PlxuICAnPCcgKyAkMSArICQyLnJlcGxhY2UoZmluZEF0dHJpYnV0ZXMsIHJlcGxhY2VBdHRyaWJ1dGVzKSArICQzO1xuY29uc3QgcmVwbGFjZUF0dHJpYnV0ZXMgPSAoJDAsICQxLCAkMikgPT4gJDEgKyAoJDIgfHwgJ1wiJykgKyBVSUQgKyAoJDIgfHwgJ1wiJyk7XG5cbi8vIGdpdmVuIGEgbm9kZSBhbmQgYSBnZW5lcmljIEhUTUwgY29udGVudCxcbi8vIGNyZWF0ZSBlaXRoZXIgYW4gU1ZHIG9yIGFuIEhUTUwgZnJhZ21lbnRcbi8vIHdoZXJlIHN1Y2ggY29udGVudCB3aWxsIGJlIGluamVjdGVkXG5leHBvcnQgY29uc3QgY3JlYXRlRnJhZ21lbnQgPSAobm9kZSwgaHRtbCkgPT5cbiAgKE9XTkVSX1NWR19FTEVNRU5UIGluIG5vZGUgP1xuICAgIFNWR0ZyYWdtZW50IDpcbiAgICBIVE1MRnJhZ21lbnRcbiAgKShub2RlLCBodG1sLnJlcGxhY2UoYXR0clNlZWtlciwgY29tbWVudHMpKTtcblxuLy8gSUUvRWRnZSBzaGVuYW5pZ2FucyBwcm9vZiBjbG9uZU5vZGVcbi8vIGl0IGdvZXMgdGhyb3VnaCBhbGwgbm9kZXMgbWFudWFsbHlcbi8vIGluc3RlYWQgb2YgcmVseWluZyB0aGUgZW5naW5lIHRvIHN1ZGRlbmx5XG4vLyBtZXJnZSBub2RlcyB0b2dldGhlclxuY29uc3QgY2xvbmVOb2RlID0gaGFzRG9vbWVkQ2xvbmVOb2RlID9cbiAgbm9kZSA9PiB7XG4gICAgY29uc3QgY2xvbmUgPSBub2RlLmNsb25lTm9kZSgpO1xuICAgIGNvbnN0IGNoaWxkTm9kZXMgPSBub2RlLmNoaWxkTm9kZXMgfHxcbiAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIGFuIGV4Y2VzcyBvZiBjYXV0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgLy8gYnV0IHNvbWUgbm9kZSwgaW4gSUUsIG1pZ2h0IG5vdFxuICAgICAgICAgICAgICAgICAgICAgIC8vIGhhdmUgY2hpbGROb2RlcyBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGZhbGxiYWNrIGVuc3VyZSB3b3JraW5nIGNvZGVcbiAgICAgICAgICAgICAgICAgICAgICAvLyBpbiBvbGRlciBJRSB3aXRob3V0IGNvbXByb21pc2luZyBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgICAgICAgICAgIC8vIG9yIGFueSBvdGhlciBicm93c2VyL2VuZ2luZSBpbnZvbHZlZC5cbiAgICAgICAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICAgICAgICAgICAgICAgIFtdO1xuICAgIGNvbnN0IGxlbmd0aCA9IGNoaWxkTm9kZXMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNsb25lLmFwcGVuZENoaWxkKGNsb25lTm9kZShjaGlsZE5vZGVzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBjbG9uZTtcbiAgfSA6XG4gIC8vIHRoZSBmb2xsb3dpbmcgaWdub3JlIGlzIGR1ZSBjb2RlLWNvdmVyYWdlXG4gIC8vIGNvbWJpbmF0aW9uIG9mIG5vdCBoYXZpbmcgZG9jdW1lbnQuaW1wb3J0Tm9kZVxuICAvLyBidXQgaGF2aW5nIGEgd29ya2luZyBub2RlLmNsb25lTm9kZS5cbiAgLy8gVGhpcyBzaGVuYXJpbyBpcyBjb21tb24gb24gb2xkZXIgQW5kcm9pZC9XZWJLaXQgYnJvd3NlcnNcbiAgLy8gYnV0IGJhc2ljSFRNTCBoZXJlIHRlc3RzIGp1c3QgdHdvIG1ham9yIGNhc2VzOlxuICAvLyB3aXRoIGRvY3VtZW50LmltcG9ydE5vZGUgb3Igd2l0aCBicm9rZW4gY2xvbmVOb2RlLlxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBub2RlID0+IG5vZGUuY2xvbmVOb2RlKHRydWUpO1xuXG4vLyBJRSBhbmQgRWRnZSBkbyBub3Qgc3VwcG9ydCBjaGlsZHJlbiBpbiBTVkcgbm9kZXNcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5leHBvcnQgY29uc3QgZ2V0Q2hpbGRyZW4gPSBub2RlID0+IHtcbiAgY29uc3QgY2hpbGRyZW4gPSBbXTtcbiAgY29uc3QgY2hpbGROb2RlcyA9IG5vZGUuY2hpbGROb2RlcztcbiAgY29uc3QgbGVuZ3RoID0gY2hpbGROb2Rlcy5sZW5ndGg7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoY2hpbGROb2Rlc1tpXS5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKVxuICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZE5vZGVzW2ldKTtcbiAgfVxuICByZXR1cm4gY2hpbGRyZW47XG59O1xuXG4vLyB1c2VkIHRvIGltcG9ydCBodG1sIGludG8gZnJhZ21lbnRzXG5leHBvcnQgY29uc3QgaW1wb3J0Tm9kZSA9IGhhc0ltcG9ydE5vZGUgP1xuICAoZG9jLCBub2RlKSA9PiBkb2MuaW1wb3J0Tm9kZShub2RlLCB0cnVlKSA6XG4gIChkb2MsIG5vZGUpID0+IGNsb25lTm9kZShub2RlKVxuXG4vLyBqdXN0IHJlY3ljbGluZyBhIG9uZS1vZmYgYXJyYXkgdG8gdXNlIHNsaWNlXG4vLyBpbiBldmVyeSBuZWVkZWQgcGxhY2VcbmV4cG9ydCBjb25zdCBzbGljZSA9IFtdLnNsaWNlO1xuXG4vLyBsYXp5IGV2YWx1YXRlZCwgcmV0dXJucyB0aGUgdW5pcXVlIGlkZW50aXR5XG4vLyBvZiBhIHRlbXBsYXRlIGxpdGVyYWwsIGFzIHRlbXBhbHRlIGxpdGVyYWwgaXRzZWxmLlxuLy8gQnkgZGVmYXVsdCwgRVMyMDE1IHRlbXBsYXRlIGxpdGVyYWxzIGFyZSB1bmlxdWVcbi8vIHRhZ2BhJHsxfXpgID09PSB0YWdgYSR7Mn16YFxuLy8gZXZlbiBpZiBpbnRlcnBvbGF0ZWQgdmFsdWVzIGFyZSBkaWZmZXJlbnRcbi8vIHRoZSB0ZW1wbGF0ZSBjaHVua3MgYXJlIGluIGEgZnJvemVuIEFycmF5XG4vLyB0aGF0IGlzIGlkZW50aWNhbCBlYWNoIHRpbWUgeW91IHVzZSB0aGUgc2FtZVxuLy8gbGl0ZXJhbCB0byByZXByZXNlbnQgc2FtZSBzdGF0aWMgY29udGVudFxuLy8gYXJvdW5kIGl0cyBvd24gaW50ZXJwb2xhdGlvbnMuXG5leHBvcnQgY29uc3QgdW5pcXVlID0gdGVtcGxhdGUgPT4gVEwodGVtcGxhdGUpO1xuXG4vLyBUTCByZXR1cm5zIGEgdW5pcXVlIHZlcnNpb24gb2YgdGhlIHRlbXBsYXRlXG4vLyBpdCBuZWVkcyBsYXp5IGZlYXR1cmUgZGV0ZWN0aW9uXG4vLyAoY2Fubm90IHRydXN0IGxpdGVyYWxzIHdpdGggdHJhbnNwaWxlZCBjb2RlKVxubGV0IFRMID0gdCA9PiB7XG4gIGlmIChcbiAgICAvLyBUeXBlU2NyaXB0IHRlbXBsYXRlIGxpdGVyYWxzIGFyZSBub3Qgc3RhbmRhcmRcbiAgICB0LnByb3BlcnR5SXNFbnVtZXJhYmxlKCdyYXcnKSB8fFxuICAgIChcbiAgICAgICAgLy8gRmlyZWZveCA8IDU1IGhhcyBub3Qgc3RhbmRhcmQgaW1wbGVtZW50YXRpb24gbmVpdGhlclxuICAgICAgICAvRmlyZWZveFxcLyhcXGQrKS8udGVzdCgoRy5uYXZpZ2F0b3IgfHwge30pLnVzZXJBZ2VudCkgJiZcbiAgICAgICAgICBwYXJzZUZsb2F0KFJlZ0V4cC4kMSkgPCA1NVxuICAgICAgICApXG4gICkge1xuICAgIGNvbnN0IFQgPSB7fTtcbiAgICBUTCA9IHQgPT4ge1xuICAgICAgY29uc3QgayA9ICdeJyArIHQuam9pbignXicpO1xuICAgICAgcmV0dXJuIFRba10gfHwgKFRba10gPSB0KTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIC8vIG1ha2UgVEwgYW4gaWRlbnRpdHkgbGlrZSBmdW5jdGlvblxuICAgIFRMID0gdCA9PiB0O1xuICB9XG4gIHJldHVybiBUTCh0KTtcbn07XG5cbi8vIHVzZWQgdG8gc3RvcmUgdGVtcGxhdGVzIG9iamVjdHNcbi8vIHNpbmNlIG5laXRoZXIgTWFwIG5vciBXZWFrTWFwIGFyZSBzYWZlXG5leHBvcnQgY29uc3QgVGVtcGxhdGVNYXAgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgd20gPSBuZXcgV2Vha01hcDtcbiAgICBjb25zdCBvX08gPSBPYmplY3QuZnJlZXplKFtdKTtcbiAgICB3bS5zZXQob19PLCB0cnVlKTtcbiAgICBpZiAoIXdtLmdldChvX08pKVxuICAgICAgdGhyb3cgb19PO1xuICAgIHJldHVybiB3bTtcbiAgfSBjYXRjaChvX08pIHtcbiAgICAvLyBpbmV2aXRhYmxlIGxlZ2FjeSBjb2RlIGxlYWtzIGR1ZVxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L2VjbWEyNjIvcHVsbC84OTBcbiAgICByZXR1cm4gbmV3IE1hcDtcbiAgfVxufTtcblxuLy8gY3JlYXRlIGRvY3VtZW50IGZyYWdtZW50cyB2aWEgbmF0aXZlIHRlbXBsYXRlXG4vLyB3aXRoIGEgZmFsbGJhY2sgZm9yIGJyb3dzZXJzIHRoYXQgd29uJ3QgYmUgYWJsZVxuLy8gdG8gZGVhbCB3aXRoIHNvbWUgaW5qZWN0ZWQgZWxlbWVudCBzdWNoIDx0ZD4gb3Igb3RoZXJzXG5jb25zdCBIVE1MRnJhZ21lbnQgPSBoYXNDb250ZW50ID9cbiAgKG5vZGUsIGh0bWwpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBjcmVhdGUobm9kZSwgJ3RlbXBsYXRlJyk7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IGh0bWw7XG4gICAgcmV0dXJuIGNvbnRhaW5lci5jb250ZW50O1xuICB9IDpcbiAgKG5vZGUsIGh0bWwpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBjcmVhdGUobm9kZSwgJ3RlbXBsYXRlJyk7XG4gICAgY29uc3QgY29udGVudCA9IGZyYWdtZW50KG5vZGUpO1xuICAgIGlmICgvXlteXFxTXSo/PChjb2woPzpncm91cCk/fHQoPzpoZWFkfGJvZHl8Zm9vdHxyfGR8aCkpL2kudGVzdChodG1sKSkge1xuICAgICAgY29uc3Qgc2VsZWN0b3IgPSBSZWdFeHAuJDE7XG4gICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJzx0YWJsZT4nICsgaHRtbCArICc8L3RhYmxlPic7XG4gICAgICBhcHBlbmQoY29udGVudCwgc2xpY2UuY2FsbChjb250YWluZXIucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICBhcHBlbmQoY29udGVudCwgc2xpY2UuY2FsbChjb250YWluZXIuY2hpbGROb2RlcykpO1xuICAgIH1cbiAgICByZXR1cm4gY29udGVudDtcbiAgfTtcblxuLy8gY3JlYXRlcyBTVkcgZnJhZ21lbnQgd2l0aCBhIGZhbGxiYWNrIGZvciBJRSB0aGF0IG5lZWRzIFNWR1xuLy8gd2l0aGluIHRoZSBIVE1MIGNvbnRlbnRcbmNvbnN0IFNWR0ZyYWdtZW50ID0gaGFzQ29udGVudCA/XG4gIChub2RlLCBodG1sKSA9PiB7XG4gICAgY29uc3QgY29udGVudCA9IGZyYWdtZW50KG5vZGUpO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvYyhub2RlKS5jcmVhdGVFbGVtZW50TlMoU1ZHX05BTUVTUEFDRSwgJ3N2ZycpO1xuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBodG1sO1xuICAgIGFwcGVuZChjb250ZW50LCBzbGljZS5jYWxsKGNvbnRhaW5lci5jaGlsZE5vZGVzKSk7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH0gOlxuICAobm9kZSwgaHRtbCkgPT4ge1xuICAgIGNvbnN0IGNvbnRlbnQgPSBmcmFnbWVudChub2RlKTtcbiAgICBjb25zdCBjb250YWluZXIgPSBjcmVhdGUobm9kZSwgJ2RpdicpO1xuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnPHN2ZyB4bWxucz1cIicgKyBTVkdfTkFNRVNQQUNFICsgJ1wiPicgKyBodG1sICsgJzwvc3ZnPic7XG4gICAgYXBwZW5kKGNvbnRlbnQsIHNsaWNlLmNhbGwoY29udGFpbmVyLmZpcnN0Q2hpbGQuY2hpbGROb2RlcykpO1xuICAgIHJldHVybiBjb250ZW50O1xuICB9O1xuIiwiaW1wb3J0IHsgYXBwZW5kIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLmpzJztcbmltcG9ydCB7IGRvYywgZnJhZ21lbnQgfSBmcm9tICcuLi9zaGFyZWQvZWFzeS1kb20uanMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBXaXJlKGNoaWxkTm9kZXMpIHtcbiAgdGhpcy5jaGlsZE5vZGVzID0gY2hpbGROb2RlcztcbiAgdGhpcy5sZW5ndGggPSBjaGlsZE5vZGVzLmxlbmd0aDtcbiAgdGhpcy5maXJzdCA9IGNoaWxkTm9kZXNbMF07XG4gIHRoaXMubGFzdCA9IGNoaWxkTm9kZXNbdGhpcy5sZW5ndGggLSAxXTtcbn1cblxuLy8gd2hlbiBhIHdpcmUgaXMgaW5zZXJ0ZWQsIGFsbCBpdHMgbm9kZXMgd2lsbCBmb2xsb3dcbldpcmUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIGluc2VydCgpIHtcbiAgY29uc3QgZGYgPSBmcmFnbWVudCh0aGlzLmZpcnN0KTtcbiAgYXBwZW5kKGRmLCB0aGlzLmNoaWxkTm9kZXMpO1xuICByZXR1cm4gZGY7XG59O1xuXG4vLyB3aGVuIGEgd2lyZSBpcyByZW1vdmVkLCBhbGwgaXRzIG5vZGVzIG11c3QgYmUgcmVtb3ZlZCBhcyB3ZWxsXG5XaXJlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7XG4gIGNvbnN0IGZpcnN0ID0gdGhpcy5maXJzdDtcbiAgY29uc3QgbGFzdCA9IHRoaXMubGFzdDtcbiAgaWYgKHRoaXMubGVuZ3RoID09PSAyKSB7XG4gICAgbGFzdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGxhc3QpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHJhbmdlID0gZG9jKGZpcnN0KS5jcmVhdGVSYW5nZSgpO1xuICAgIHJhbmdlLnNldFN0YXJ0QmVmb3JlKHRoaXMuY2hpbGROb2Rlc1sxXSk7XG4gICAgcmFuZ2Uuc2V0RW5kQWZ0ZXIobGFzdCk7XG4gICAgcmFuZ2UuZGVsZXRlQ29udGVudHMoKTtcbiAgfVxuICByZXR1cm4gZmlyc3Q7XG59O1xuIiwiaW1wb3J0IHtcbiAgQ09NTUVOVF9OT0RFLFxuICBET0NVTUVOVF9GUkFHTUVOVF9OT0RFLFxuICBFTEVNRU5UX05PREVcbn0gZnJvbSAnLi4vc2hhcmVkL2NvbnN0YW50cy5qcyc7XG5cbi8vIGV2ZXJ5IHRlbXBsYXRlIGxpdGVyYWwgaW50ZXJwb2xhdGlvbiBpbmRpY2F0ZXNcbi8vIGEgcHJlY2lzZSB0YXJnZXQgaW4gdGhlIERPTSB0aGUgdGVtcGxhdGUgaXMgcmVwcmVzZW50aW5nLlxuLy8gYDxwIGlkPSR7J2F0dHJpYnV0ZSd9PnNvbWUgJHsnY29udGVudCd9PC9wPmBcbi8vIGh5cGVySFRNTCBmaW5kcyBvbmx5IG9uY2UgcGVyIHRlbXBsYXRlIGxpdGVyYWwsXG4vLyBoZW5jZSBvbmNlIHBlciBlbnRpcmUgYXBwbGljYXRpb24gbGlmZS1jeWNsZSxcbi8vIGFsbCBub2RlcyB0aGF0IGFyZSByZWxhdGVkIHRvIGludGVycG9sYXRpb25zLlxuLy8gVGhlc2Ugbm9kZXMgYXJlIHN0b3JlZCBhcyBpbmRleGVzIHVzZWQgdG8gcmV0cmlldmUsXG4vLyBvbmNlIHBlciB1cGdyYWRlLCBub2RlcyB0aGF0IHdpbGwgY2hhbmdlIG9uIGVhY2ggZnV0dXJlIHVwZGF0ZS5cbi8vIEEgcGF0aCBleGFtcGxlIGlzIFsyLCAwLCAxXSByZXByZXNlbnRpbmcgdGhlIG9wZXJhdGlvbjpcbi8vIG5vZGUuY2hpbGROb2Rlc1syXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMV1cbi8vIEF0dHJpYnV0ZXMgYXJlIGFkZHJlc3NlZCB2aWEgdGhlaXIgb3duZXIgbm9kZSBhbmQgdGhlaXIgbmFtZS5cbmNvbnN0IGNyZWF0ZVBhdGggPSBub2RlID0+IHtcbiAgY29uc3QgcGF0aCA9IFtdO1xuICBsZXQgcGFyZW50Tm9kZTtcbiAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgY2FzZSBFTEVNRU5UX05PREU6XG4gICAgY2FzZSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFOlxuICAgICAgcGFyZW50Tm9kZSA9IG5vZGU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIENPTU1FTlRfTk9ERTpcbiAgICAgIHBhcmVudE5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICBwcmVwZW5kKHBhdGgsIHBhcmVudE5vZGUsIG5vZGUpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHBhcmVudE5vZGUgPSBub2RlLm93bmVyRWxlbWVudDtcbiAgICAgIGJyZWFrO1xuICB9XG4gIGZvciAoXG4gICAgbm9kZSA9IHBhcmVudE5vZGU7XG4gICAgKHBhcmVudE5vZGUgPSBwYXJlbnROb2RlLnBhcmVudE5vZGUpO1xuICAgIG5vZGUgPSBwYXJlbnROb2RlXG4gICkge1xuICAgIHByZXBlbmQocGF0aCwgcGFyZW50Tm9kZSwgbm9kZSk7XG4gIH1cbiAgcmV0dXJuIHBhdGg7XG59O1xuXG5jb25zdCBwcmVwZW5kID0gKHBhdGgsIHBhcmVudCwgbm9kZSkgPT4ge1xuICBwYXRoLnVuc2hpZnQocGF0aC5pbmRleE9mLmNhbGwocGFyZW50LmNoaWxkTm9kZXMsIG5vZGUpKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY3JlYXRlOiAodHlwZSwgbm9kZSwgbmFtZSkgPT4gKHt0eXBlLCBuYW1lLCBub2RlLCBwYXRoOiBjcmVhdGVQYXRoKG5vZGUpfSksXG4gIGZpbmQ6IChub2RlLCBwYXRoKSA9PiB7XG4gICAgY29uc3QgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgbm9kZSA9IG5vZGUuY2hpbGROb2Rlc1twYXRoW2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbn1cbiIsIi8vIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2RldmVsb3BpdC9wcmVhY3QvYmxvYi8zM2ZjNjk3YWMxMTc2MmExY2I2ZTcxZTk4NDc2NzBkMDQ3YWY3Y2U1L3NyYy9jb25zdGFudHMuanNcbmNvbnN0IElTX05PTl9ESU1FTlNJT05BTCA9IC9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO1xuXG4vLyBzdHlsZSBpcyBoYW5kbGVkIGFzIGJvdGggc3RyaW5nIGFuZCBvYmplY3Rcbi8vIGV2ZW4gaWYgdGhlIHRhcmdldCBpcyBhbiBTVkcgZWxlbWVudCAoY29uc2lzdGVuY3kpXG5leHBvcnQgZGVmYXVsdCAobm9kZSwgb3JpZ2luYWwsIGlzU1ZHKSA9PiB7XG4gIGlmIChpc1NWRykge1xuICAgIGNvbnN0IHN0eWxlID0gb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpO1xuICAgIHN0eWxlLnZhbHVlID0gJyc7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGVOb2RlKHN0eWxlKTtcbiAgICByZXR1cm4gdXBkYXRlKHN0eWxlLCBpc1NWRyk7XG4gIH1cbiAgcmV0dXJuIHVwZGF0ZShub2RlLnN0eWxlLCBpc1NWRyk7XG59O1xuXG4vLyB0aGUgdXBkYXRlIHRha2VzIGNhcmUgb3IgY2hhbmdpbmcvcmVwbGFjaW5nXG4vLyBvbmx5IHByb3BlcnRpZXMgdGhhdCBhcmUgZGlmZmVyZW50IG9yXG4vLyBpbiBjYXNlIG9mIHN0cmluZywgdGhlIHdob2xlIG5vZGVcbmNvbnN0IHVwZGF0ZSA9IChzdHlsZSwgaXNTVkcpID0+IHtcbiAgbGV0IG9sZFR5cGUsIG9sZFZhbHVlO1xuICByZXR1cm4gbmV3VmFsdWUgPT4ge1xuICAgIHN3aXRjaCAodHlwZW9mIG5ld1ZhbHVlKSB7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBpZiAobmV3VmFsdWUpIHtcbiAgICAgICAgICBpZiAob2xkVHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmICghaXNTVkcpIHtcbiAgICAgICAgICAgICAgaWYgKG9sZFZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gbmV3VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlW2tleV0gPSAnJztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzU1ZHKSBzdHlsZS52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgZWxzZSBzdHlsZS5jc3NUZXh0ID0gJyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGluZm8gPSBpc1NWRyA/IHt9IDogc3R5bGU7XG4gICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gbmV3VmFsdWVba2V5XTtcbiAgICAgICAgICAgIGluZm9ba2V5XSA9IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICFJU19OT05fRElNRU5TSU9OQUwudGVzdChrZXkpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbHVlICsgJ3B4JykgOiB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb2xkVHlwZSA9ICdvYmplY3QnO1xuICAgICAgICAgIGlmIChpc1NWRykgc3R5bGUudmFsdWUgPSB0b1N0eWxlKChvbGRWYWx1ZSA9IGluZm8pKTtcbiAgICAgICAgICBlbHNlIG9sZFZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChvbGRWYWx1ZSAhPSBuZXdWYWx1ZSkge1xuICAgICAgICAgIG9sZFR5cGUgPSAnc3RyaW5nJztcbiAgICAgICAgICBvbGRWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgIGlmIChpc1NWRykgc3R5bGUudmFsdWUgPSBuZXdWYWx1ZSB8fCAnJztcbiAgICAgICAgICBlbHNlIHN0eWxlLmNzc1RleHQgPSBuZXdWYWx1ZSB8fCAnJztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH07XG59O1xuXG5jb25zdCBoeXBoZW4gPSAvKFteQS1aXSkoW0EtWl0rKS9nO1xuY29uc3QgaXplZCA9ICgkMCwgJDEsICQyKSA9PiAkMSArICctJyArICQyLnRvTG93ZXJDYXNlKCk7XG5jb25zdCB0b1N0eWxlID0gb2JqZWN0ID0+IHtcbiAgY29uc3QgY3NzID0gW107XG4gIGZvciAoY29uc3Qga2V5IGluIG9iamVjdCkge1xuICAgIGNzcy5wdXNoKGtleS5yZXBsYWNlKGh5cGhlbiwgaXplZCksICc6Jywgb2JqZWN0W2tleV0sICc7Jyk7XG4gIH1cbiAgcmV0dXJuIGNzcy5qb2luKCcnKTtcbn07IiwiLyogQVVUT01BVElDQUxMWSBJTVBPUlRFRCwgRE8gTk9UIE1PRElGWSAqL1xuLyohIChjKSAyMDE3IEFuZHJlYSBHaWFtbWFyY2hpIChJU0MpICovXG5cbi8qKlxuICogVGhpcyBjb2RlIGlzIGEgcmV2aXNpdGVkIHBvcnQgb2YgdGhlIHNuYWJiZG9tIHZET00gZGlmZmluZyBsb2dpYyxcbiAqIHRoZSBzYW1lIHRoYXQgZnVlbHMgYXMgZm9yayBWdWUuanMgb3Igb3RoZXIgbGlicmFyaWVzLlxuICogQGNyZWRpdHMgaHR0cHM6Ly9naXRodWIuY29tL3NuYWJiZG9tL3NuYWJiZG9tXG4gKi9cblxuY29uc3QgZXFlcSA9IChhLCBiKSA9PiBhID09IGI7XG5cbmNvbnN0IGlkZW50aXR5ID0gTyA9PiBPO1xuXG5jb25zdCByZW1vdmUgPSAoZ2V0LCBwYXJlbnROb2RlLCBiZWZvcmUsIGFmdGVyKSA9PiB7XG4gIGlmIChhZnRlciA9PSBudWxsKSB7XG4gICAgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZChnZXQoYmVmb3JlLCAtMSkpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHJhbmdlID0gcGFyZW50Tm9kZS5vd25lckRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG4gICAgcmFuZ2Uuc2V0U3RhcnRCZWZvcmUoZ2V0KGJlZm9yZSwgLTEpKTtcbiAgICByYW5nZS5zZXRFbmRBZnRlcihnZXQoYWZ0ZXIsIC0xKSk7XG4gICAgcmFuZ2UuZGVsZXRlQ29udGVudHMoKTtcbiAgfVxufTtcblxuY29uc3QgZG9tZGlmZiA9IChcbiAgcGFyZW50Tm9kZSwgICAgIC8vIHdoZXJlIGNoYW5nZXMgaGFwcGVuXG4gIGN1cnJlbnROb2RlcywgICAvLyBBcnJheSBvZiBjdXJyZW50IGl0ZW1zL25vZGVzXG4gIGZ1dHVyZU5vZGVzLCAgICAvLyBBcnJheSBvZiBmdXR1cmUgaXRlbXMvbm9kZXNcbiAgb3B0aW9ucyAgICAgICAgIC8vIG9wdGlvbmFsIG9iamVjdCB3aXRoIG9uZSBvZiB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgIC8vICBiZWZvcmU6IGRvbU5vZGVcbiAgICAgICAgICAgICAgICAgIC8vICBjb21wYXJlKGdlbmVyaWMsIGdlbmVyaWMpID0+IHRydWUgaWYgc2FtZSBnZW5lcmljXG4gICAgICAgICAgICAgICAgICAvLyAgbm9kZShnZW5lcmljKSA9PiBOb2RlXG4pID0+IHtcbiAgaWYgKCFvcHRpb25zKVxuICAgIG9wdGlvbnMgPSB7fTtcbiAgY29uc3QgY29tcGFyZSA9IG9wdGlvbnMuY29tcGFyZSB8fCBlcWVxO1xuICBjb25zdCBnZXQgPSBvcHRpb25zLm5vZGUgfHwgaWRlbnRpdHk7XG4gIGNvbnN0IGJlZm9yZSA9IG9wdGlvbnMuYmVmb3JlID09IG51bGwgPyBudWxsIDogZ2V0KG9wdGlvbnMuYmVmb3JlLCAwKTtcbiAgbGV0IGN1cnJlbnRTdGFydCA9IDAsIGZ1dHVyZVN0YXJ0ID0gMDtcbiAgbGV0IGN1cnJlbnRFbmQgPSBjdXJyZW50Tm9kZXMubGVuZ3RoIC0gMTtcbiAgbGV0IGN1cnJlbnRTdGFydE5vZGUgPSBjdXJyZW50Tm9kZXNbMF07XG4gIGxldCBjdXJyZW50RW5kTm9kZSA9IGN1cnJlbnROb2Rlc1tjdXJyZW50RW5kXTtcbiAgbGV0IGZ1dHVyZUVuZCA9IGZ1dHVyZU5vZGVzLmxlbmd0aCAtIDE7XG4gIGxldCBmdXR1cmVTdGFydE5vZGUgPSBmdXR1cmVOb2Rlc1swXTtcbiAgbGV0IGZ1dHVyZUVuZE5vZGUgPSBmdXR1cmVOb2Rlc1tmdXR1cmVFbmRdO1xuICB3aGlsZSAoY3VycmVudFN0YXJ0IDw9IGN1cnJlbnRFbmQgJiYgZnV0dXJlU3RhcnQgPD0gZnV0dXJlRW5kKSB7XG4gICAgaWYgKGN1cnJlbnRTdGFydE5vZGUgPT0gbnVsbCkge1xuICAgICAgY3VycmVudFN0YXJ0Tm9kZSA9IGN1cnJlbnROb2Rlc1srK2N1cnJlbnRTdGFydF07XG4gICAgfVxuICAgIGVsc2UgaWYgKGN1cnJlbnRFbmROb2RlID09IG51bGwpIHtcbiAgICAgIGN1cnJlbnRFbmROb2RlID0gY3VycmVudE5vZGVzWy0tY3VycmVudEVuZF07XG4gICAgfVxuICAgIGVsc2UgaWYgKGZ1dHVyZVN0YXJ0Tm9kZSA9PSBudWxsKSB7XG4gICAgICBmdXR1cmVTdGFydE5vZGUgPSBmdXR1cmVOb2Rlc1srK2Z1dHVyZVN0YXJ0XTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZnV0dXJlRW5kTm9kZSA9PSBudWxsKSB7XG4gICAgICBmdXR1cmVFbmROb2RlID0gZnV0dXJlTm9kZXNbLS1mdXR1cmVFbmRdO1xuICAgIH1cbiAgICBlbHNlIGlmIChjb21wYXJlKGN1cnJlbnRTdGFydE5vZGUsIGZ1dHVyZVN0YXJ0Tm9kZSkpIHtcbiAgICAgIGN1cnJlbnRTdGFydE5vZGUgPSBjdXJyZW50Tm9kZXNbKytjdXJyZW50U3RhcnRdO1xuICAgICAgZnV0dXJlU3RhcnROb2RlID0gZnV0dXJlTm9kZXNbKytmdXR1cmVTdGFydF07XG4gICAgfVxuICAgIGVsc2UgaWYgKGNvbXBhcmUoY3VycmVudEVuZE5vZGUsIGZ1dHVyZUVuZE5vZGUpKSB7XG4gICAgICBjdXJyZW50RW5kTm9kZSA9IGN1cnJlbnROb2Rlc1stLWN1cnJlbnRFbmRdO1xuICAgICAgZnV0dXJlRW5kTm9kZSA9IGZ1dHVyZU5vZGVzWy0tZnV0dXJlRW5kXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY29tcGFyZShjdXJyZW50U3RhcnROb2RlLCBmdXR1cmVFbmROb2RlKSkge1xuICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoXG4gICAgICAgIGdldChjdXJyZW50U3RhcnROb2RlLCAxKSxcbiAgICAgICAgZ2V0KGN1cnJlbnRFbmROb2RlLCAtMCkubmV4dFNpYmxpbmdcbiAgICAgICk7XG4gICAgICBjdXJyZW50U3RhcnROb2RlID0gY3VycmVudE5vZGVzWysrY3VycmVudFN0YXJ0XTtcbiAgICAgIGZ1dHVyZUVuZE5vZGUgPSBmdXR1cmVOb2Rlc1stLWZ1dHVyZUVuZF07XG4gICAgfVxuICAgIGVsc2UgaWYgKGNvbXBhcmUoY3VycmVudEVuZE5vZGUsIGZ1dHVyZVN0YXJ0Tm9kZSkpIHtcbiAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKFxuICAgICAgICBnZXQoY3VycmVudEVuZE5vZGUsIDEpLFxuICAgICAgICBnZXQoY3VycmVudFN0YXJ0Tm9kZSwgMClcbiAgICAgICk7XG4gICAgICBjdXJyZW50RW5kTm9kZSA9IGN1cnJlbnROb2Rlc1stLWN1cnJlbnRFbmRdO1xuICAgICAgZnV0dXJlU3RhcnROb2RlID0gZnV0dXJlTm9kZXNbKytmdXR1cmVTdGFydF07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IGluZGV4ID0gY3VycmVudE5vZGVzLmluZGV4T2YoZnV0dXJlU3RhcnROb2RlKTtcbiAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgZ2V0KGZ1dHVyZVN0YXJ0Tm9kZSwgMSksXG4gICAgICAgICAgZ2V0KGN1cnJlbnRTdGFydE5vZGUsIDApXG4gICAgICAgICk7XG4gICAgICAgIGZ1dHVyZVN0YXJ0Tm9kZSA9IGZ1dHVyZU5vZGVzWysrZnV0dXJlU3RhcnRdO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxldCBpID0gaW5kZXg7XG4gICAgICAgIGxldCBmID0gZnV0dXJlU3RhcnQ7XG4gICAgICAgIHdoaWxlIChcbiAgICAgICAgICBpIDw9IGN1cnJlbnRFbmQgJiZcbiAgICAgICAgICBmIDw9IGZ1dHVyZUVuZCAmJlxuICAgICAgICAgIGN1cnJlbnROb2Rlc1tpXSA9PT0gZnV0dXJlTm9kZXNbZl1cbiAgICAgICAgKSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICAgIGYrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAoMSA8IChpIC0gaW5kZXgpKSB7XG4gICAgICAgICAgaWYgKC0taW5kZXggPT09IGN1cnJlbnRTdGFydCkge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZChnZXQoY3VycmVudFN0YXJ0Tm9kZSwgLTEpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVtb3ZlKFxuICAgICAgICAgICAgICBnZXQsXG4gICAgICAgICAgICAgIHBhcmVudE5vZGUsXG4gICAgICAgICAgICAgIGN1cnJlbnRTdGFydE5vZGUsXG4gICAgICAgICAgICAgIGN1cnJlbnROb2Rlc1tpbmRleF1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRTdGFydCA9IGk7XG4gICAgICAgICAgZnV0dXJlU3RhcnQgPSBmO1xuICAgICAgICAgIGN1cnJlbnRTdGFydE5vZGUgPSBjdXJyZW50Tm9kZXNbaV07XG4gICAgICAgICAgZnV0dXJlU3RhcnROb2RlID0gZnV0dXJlTm9kZXNbZl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgZWwgPSBjdXJyZW50Tm9kZXNbaW5kZXhdO1xuICAgICAgICAgIGN1cnJlbnROb2Rlc1tpbmRleF0gPSBudWxsO1xuICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGdldChlbCwgMSksIGdldChjdXJyZW50U3RhcnROb2RlLCAwKSk7XG4gICAgICAgICAgZnV0dXJlU3RhcnROb2RlID0gZnV0dXJlTm9kZXNbKytmdXR1cmVTdGFydF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKGN1cnJlbnRTdGFydCA8PSBjdXJyZW50RW5kIHx8IGZ1dHVyZVN0YXJ0IDw9IGZ1dHVyZUVuZCkge1xuICAgIGlmIChjdXJyZW50U3RhcnQgPiBjdXJyZW50RW5kKSB7XG4gICAgICBjb25zdCBwaW4gPSBmdXR1cmVOb2Rlc1tmdXR1cmVFbmQgKyAxXTtcbiAgICAgIGNvbnN0IHBsYWNlID0gcGluID09IG51bGwgPyBiZWZvcmUgOiBnZXQocGluLCAwKTtcbiAgICAgIGlmIChmdXR1cmVTdGFydCA9PT0gZnV0dXJlRW5kKSB7XG4gICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGdldChmdXR1cmVOb2Rlc1tmdXR1cmVTdGFydF0sIDEpLCBwbGFjZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgZnJhZ21lbnQgPSBwYXJlbnROb2RlLm93bmVyRG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICB3aGlsZSAoZnV0dXJlU3RhcnQgPD0gZnV0dXJlRW5kKSB7XG4gICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZ2V0KGZ1dHVyZU5vZGVzW2Z1dHVyZVN0YXJ0KytdLCAxKSk7XG4gICAgICAgIH1cbiAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZnJhZ21lbnQsIHBsYWNlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoY3VycmVudE5vZGVzW2N1cnJlbnRTdGFydF0gPT0gbnVsbClcbiAgICAgICAgY3VycmVudFN0YXJ0Kys7XG4gICAgICBpZiAoY3VycmVudFN0YXJ0ID09PSBjdXJyZW50RW5kKSB7XG4gICAgICAgIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZ2V0KGN1cnJlbnROb2Rlc1tjdXJyZW50U3RhcnRdLCAtMSkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlbW92ZShcbiAgICAgICAgICBnZXQsXG4gICAgICAgICAgcGFyZW50Tm9kZSxcbiAgICAgICAgICBjdXJyZW50Tm9kZXNbY3VycmVudFN0YXJ0XSxcbiAgICAgICAgICBjdXJyZW50Tm9kZXNbY3VycmVudEVuZF1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZ1dHVyZU5vZGVzO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZG9tZGlmZjtcbiIsImltcG9ydCB7XG4gIENPTk5FQ1RFRCwgRElTQ09OTkVDVEVELFxuICBDT01NRU5UX05PREUsIERPQ1VNRU5UX0ZSQUdNRU5UX05PREUsIEVMRU1FTlRfTk9ERSwgVEVYVF9OT0RFLFxuICBPV05FUl9TVkdfRUxFTUVOVCxcbiAgU0hPVUxEX1VTRV9URVhUX0NPTlRFTlQsXG4gIFVJRCwgVUlEQ1xufSBmcm9tICcuLi9zaGFyZWQvY29uc3RhbnRzLmpzJztcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jbGFzc2VzL0NvbXBvbmVudC5qcyc7XG5pbXBvcnQgV2lyZSBmcm9tICcuLi9jbGFzc2VzL1dpcmUuanMnO1xuaW1wb3J0IFBhdGggZnJvbSAnLi9QYXRoLmpzJztcbmltcG9ydCBTdHlsZSBmcm9tICcuL1N0eWxlLmpzJztcbmltcG9ydCBJbnRlbnQgZnJvbSAnLi9JbnRlbnQuanMnO1xuaW1wb3J0IGRvbWRpZmYgZnJvbSAnLi4vc2hhcmVkL2RvbWRpZmYuanMnO1xuLy8gc2VlIC9ec2NyaXB0JC9pLnRlc3Qobm9kZU5hbWUpIGJpdCBkb3duIGhlcmVcbi8vIGltcG9ydCB7IGNyZWF0ZSBhcyBjcmVhdGVFbGVtZW50LCB0ZXh0IH0gZnJvbSAnLi4vc2hhcmVkL2Vhc3ktZG9tLmpzJztcbmltcG9ydCB7IHRleHQgfSBmcm9tICcuLi9zaGFyZWQvZWFzeS1kb20uanMnO1xuaW1wb3J0IHsgRXZlbnQsIFdlYWtTZXQsIGlzQXJyYXksIHRyaW0gfSBmcm9tICcuLi9zaGFyZWQvcG9vcmx5ZmlsbHMuanMnO1xuaW1wb3J0IHsgY3JlYXRlRnJhZ21lbnQsIGdldENoaWxkcmVuLCBzbGljZSB9IGZyb20gJy4uL3NoYXJlZC91dGlscy5qcyc7XG5cbi8vIGh5cGVyLkNvbXBvbmVudCBoYXZlIGEgY29ubmVjdGVkL2Rpc2Nvbm5lY3RlZFxuLy8gbWVjaGFuaXNtIHByb3ZpZGVkIGJ5IE11dGF0aW9uT2JzZXJ2ZXJcbi8vIFRoaXMgd2VhayBzZXQgaXMgdXNlZCB0byByZWNvZ25pemUgY29tcG9uZW50c1xuLy8gYXMgRE9NIG5vZGUgdGhhdCBuZWVkcyB0byB0cmlnZ2VyIGNvbm5lY3RlZC9kaXNjb25uZWN0ZWQgZXZlbnRzXG5jb25zdCBjb21wb25lbnRzID0gbmV3IFdlYWtTZXQ7XG5cbi8vIGEgYmFzaWMgZGljdGlvbmFyeSB1c2VkIHRvIGZpbHRlciBhbHJlYWR5IGNhY2hlZCBhdHRyaWJ1dGVzXG4vLyB3aGlsZSBsb29raW5nIGZvciBzcGVjaWFsIGh5cGVySFRNTCB2YWx1ZXMuXG5mdW5jdGlvbiBDYWNoZSgpIHt9XG5DYWNoZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4vLyByZXR1cm5zIGFuIGludGVudCB0byBleHBsaWNpdGx5IGluamVjdCBjb250ZW50IGFzIGh0bWxcbmNvbnN0IGFzSFRNTCA9IGh0bWwgPT4gKHtodG1sfSk7XG5cbi8vIHJldHVybnMgbm9kZXMgZnJvbSB3aXJlcyBhbmQgY29tcG9uZW50c1xuY29uc3QgYXNOb2RlID0gKGl0ZW0sIGkpID0+IHtcbiAgcmV0dXJuICdFTEVNRU5UX05PREUnIGluIGl0ZW0gP1xuICAgIGl0ZW0gOlxuICAgIChpdGVtLmNvbnN0cnVjdG9yID09PSBXaXJlID9cbiAgICAgIC8vIGluIHRoZSBXaXJlIGNhc2UsIHRoZSBjb250ZW50IGNhbiBiZVxuICAgICAgLy8gcmVtb3ZlZCwgcG9zdC1wZW5kZWQsIGluc2VydGVkLCBvciBwcmUtcGVuZGVkIGFuZFxuICAgICAgLy8gYWxsIHRoZXNlIGNhc2VzIGFyZSBoYW5kbGVkIGJ5IGRvbWRpZmYgYWxyZWFkeVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICgoMSAvIGkpIDwgMCA/XG4gICAgICAgIChpID8gaXRlbS5yZW1vdmUoKSA6IGl0ZW0ubGFzdCkgOlxuICAgICAgICAoaSA/IGl0ZW0uaW5zZXJ0KCkgOiBpdGVtLmZpcnN0KSkgOlxuICAgICAgYXNOb2RlKGl0ZW0ucmVuZGVyKCksIGkpKTtcbn1cblxuLy8gcmV0dXJucyB0cnVlIGlmIGRvbWRpZmYgY2FuIGhhbmRsZSB0aGUgdmFsdWVcbmNvbnN0IGNhbkRpZmYgPSB2YWx1ZSA9PiAgJ0VMRU1FTlRfTk9ERScgaW4gdmFsdWUgfHxcbnZhbHVlIGluc3RhbmNlb2YgV2lyZSB8fFxudmFsdWUgaW5zdGFuY2VvZiBDb21wb25lbnQ7XG5cbi8vIHVwZGF0ZXMgYXJlIGNyZWF0ZWQgb25jZSBwZXIgY29udGV4dCB1cGdyYWRlXG4vLyB3aXRoaW4gdGhlIG1haW4gcmVuZGVyIGZ1bmN0aW9uICguLi9oeXBlci9yZW5kZXIuanMpXG4vLyBUaGVzZSBhcmUgYW4gQXJyYXkgb2YgY2FsbGJhY2tzIHRvIGludm9rZSBwYXNzaW5nXG4vLyBlYWNoIGludGVycG9sYXRpb24gdmFsdWUuXG4vLyBVcGRhdGVzIGNhbiBiZSByZWxhdGVkIHRvIGFueSBraW5kIG9mIGNvbnRlbnQsXG4vLyBhdHRyaWJ1dGVzLCBvciBzcGVjaWFsIHRleHQtb25seSBjYXNlcyBzdWNoIDxzdHlsZT5cbi8vIGVsZW1lbnRzIG9yIDx0ZXh0YXJlYT5cbmNvbnN0IGNyZWF0ZSA9IChyb290LCBwYXRocykgPT4ge1xuICBjb25zdCB1cGRhdGVzID0gW107XG4gIGNvbnN0IGxlbmd0aCA9IHBhdGhzLmxlbmd0aDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGluZm8gPSBwYXRoc1tpXTtcbiAgICBjb25zdCBub2RlID0gUGF0aC5maW5kKHJvb3QsIGluZm8ucGF0aCk7XG4gICAgc3dpdGNoIChpbmZvLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2FueSc6XG4gICAgICAgIHVwZGF0ZXMucHVzaChzZXRBbnlDb250ZW50KG5vZGUsIFtdKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYXR0cic6XG4gICAgICAgIHVwZGF0ZXMucHVzaChzZXRBdHRyaWJ1dGUobm9kZSwgaW5mby5uYW1lLCBpbmZvLm5vZGUpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgdXBkYXRlcy5wdXNoKHNldFRleHRDb250ZW50KG5vZGUpKTtcbiAgICAgICAgbm9kZS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVwZGF0ZXM7XG59O1xuXG4vLyBmaW5kaW5nIGFsbCBwYXRocyBpcyBhIG9uZS1vZmYgb3BlcmF0aW9uIHBlcmZvcm1lZFxuLy8gd2hlbiBhIG5ldyB0ZW1wbGF0ZSBsaXRlcmFsIGlzIHVzZWQuXG4vLyBUaGUgZ29hbCBpcyB0byBtYXAgYWxsIHRhcmdldCBub2RlcyB0aGF0IHdpbGwgYmVcbi8vIHVzZWQgdG8gdXBkYXRlIGNvbnRlbnQvYXR0cmlidXRlcyBldmVyeSB0aW1lXG4vLyB0aGUgc2FtZSB0ZW1wbGF0ZSBsaXRlcmFsIGlzIHVzZWQgdG8gY3JlYXRlIGNvbnRlbnQuXG4vLyBUaGUgcmVzdWx0IGlzIGEgbGlzdCBvZiBwYXRocyByZWxhdGVkIHRvIHRoZSB0ZW1wbGF0ZVxuLy8gd2l0aCBhbGwgdGhlIG5lY2Vzc2FyeSBpbmZvIHRvIGNyZWF0ZSB1cGRhdGVzIGFzXG4vLyBsaXN0IG9mIGNhbGxiYWNrcyB0aGF0IHRhcmdldCBkaXJlY3RseSBhZmZlY3RlZCBub2Rlcy5cbmNvbnN0IGZpbmQgPSAobm9kZSwgcGF0aHMsIHBhcnRzKSA9PiB7XG4gIGNvbnN0IGNoaWxkTm9kZXMgPSBub2RlLmNoaWxkTm9kZXM7XG4gIGNvbnN0IGxlbmd0aCA9IGNoaWxkTm9kZXMubGVuZ3RoO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGNoaWxkID0gY2hpbGROb2Rlc1tpXTtcbiAgICBzd2l0Y2ggKGNoaWxkLm5vZGVUeXBlKSB7XG4gICAgICBjYXNlIEVMRU1FTlRfTk9ERTpcbiAgICAgICAgZmluZEF0dHJpYnV0ZXMoY2hpbGQsIHBhdGhzLCBwYXJ0cyk7XG4gICAgICAgIGZpbmQoY2hpbGQsIHBhdGhzLCBwYXJ0cyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDT01NRU5UX05PREU6XG4gICAgICAgIGlmIChjaGlsZC50ZXh0Q29udGVudCA9PT0gVUlEKSB7XG4gICAgICAgICAgcGFydHMuc2hpZnQoKTtcbiAgICAgICAgICBwYXRocy5wdXNoKFxuICAgICAgICAgICAgLy8gYmFzaWNIVE1MIG9yIG90aGVyIG5vbiBzdGFuZGFyZCBlbmdpbmVzXG4gICAgICAgICAgICAvLyBtaWdodCBlbmQgdXAgaGF2aW5nIGNvbW1lbnRzIGluIG5vZGVzXG4gICAgICAgICAgICAvLyB3aGVyZSB0aGV5IHNob3VsZG4ndCwgaGVuY2UgdGhpcyBjaGVjay5cbiAgICAgICAgICAgIFNIT1VMRF9VU0VfVEVYVF9DT05URU5ULnRlc3Qobm9kZS5ub2RlTmFtZSkgP1xuICAgICAgICAgICAgICBQYXRoLmNyZWF0ZSgndGV4dCcsIG5vZGUpIDpcbiAgICAgICAgICAgICAgUGF0aC5jcmVhdGUoJ2FueScsIGNoaWxkKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFRFWFRfTk9ERTpcbiAgICAgICAgLy8gdGhlIGZvbGxvd2luZyBpZ25vcmUgaXMgYWN0dWFsbHkgY292ZXJlZCBieSBicm93c2Vyc1xuICAgICAgICAvLyBvbmx5IGJhc2ljSFRNTCBlbmRzIHVwIG9uIHByZXZpb3VzIENPTU1FTlRfTk9ERSBjYXNlXG4gICAgICAgIC8vIGluc3RlYWQgb2YgVEVYVF9OT0RFIGJlY2F1c2UgaXQga25vd3Mgbm90aGluZyBhYm91dFxuICAgICAgICAvLyBzcGVjaWFsIHN0eWxlIG9yIHRleHRhcmVhIGJlaGF2aW9yXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoXG4gICAgICAgICAgU0hPVUxEX1VTRV9URVhUX0NPTlRFTlQudGVzdChub2RlLm5vZGVOYW1lKSAmJlxuICAgICAgICAgIHRyaW0uY2FsbChjaGlsZC50ZXh0Q29udGVudCkgPT09IFVJRENcbiAgICAgICAgKSB7XG4gICAgICAgICAgcGFydHMuc2hpZnQoKTtcbiAgICAgICAgICBwYXRocy5wdXNoKFBhdGguY3JlYXRlKCd0ZXh0Jywgbm9kZSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufTtcblxuLy8gYXR0cmlidXRlcyBhcmUgc2VhcmNoZWQgdmlhIHVuaXF1ZSBoeXBlckhUTUwgaWQgdmFsdWUuXG4vLyBEZXNwaXRlIEhUTUwgYmVpbmcgY2FzZSBpbnNlbnNpdGl2ZSwgaHlwZXJIVE1MIGlzIGFibGVcbi8vIHRvIHJlY29nbml6ZSBhdHRyaWJ1dGVzIGJ5IG5hbWUgaW4gYSBjYXNlU2Vuc2l0aXZlIHdheS5cbi8vIFRoaXMgcGxheXMgd2VsbCB3aXRoIEN1c3RvbSBFbGVtZW50cyBkZWZpbml0aW9uc1xuLy8gYW5kIGFsc28gd2l0aCBYTUwtbGlrZSBlbnZpcm9ubWVudHMsIHdpdGhvdXQgdHJ1c3Rpbmdcbi8vIHRoZSByZXN1bHRpbmcgRE9NIGJ1dCB0aGUgdGVtcGxhdGUgbGl0ZXJhbCBhcyB0aGUgc291cmNlIG9mIHRydXRoLlxuLy8gSUUvRWRnZSBoYXMgYSBmdW5ueSBidWcgd2l0aCBhdHRyaWJ1dGVzIGFuZCB0aGVzZSBtaWdodCBiZSBkdXBsaWNhdGVkLlxuLy8gVGhpcyBpcyB3aHkgdGhlcmUgaXMgYSBjYWNoZSBpbiBjaGFyZ2Ugb2YgYmVpbmcgc3VyZSBubyBkdXBsaWNhdGVkXG4vLyBhdHRyaWJ1dGVzIGFyZSBldmVyIGNvbnNpZGVyZWQgaW4gZnV0dXJlIHVwZGF0ZXMuXG5jb25zdCBmaW5kQXR0cmlidXRlcyA9IChub2RlLCBwYXRocywgcGFydHMpID0+IHtcbiAgY29uc3QgY2FjaGUgPSBuZXcgQ2FjaGU7XG4gIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XG4gIGNvbnN0IGFycmF5ID0gc2xpY2UuY2FsbChhdHRyaWJ1dGVzKTtcbiAgY29uc3QgcmVtb3ZlID0gW107XG4gIGNvbnN0IGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGFycmF5W2ldO1xuICAgIGlmIChhdHRyaWJ1dGUudmFsdWUgPT09IFVJRCkge1xuICAgICAgY29uc3QgbmFtZSA9IGF0dHJpYnV0ZS5uYW1lO1xuICAgICAgLy8gdGhlIGZvbGxvd2luZyBpZ25vcmUgaXMgY292ZXJlZCBieSBJRVxuICAgICAgLy8gYW5kIHRoZSBJRTkgZG91YmxlIHZpZXdCb3ggdGVzdFxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmICghKG5hbWUgaW4gY2FjaGUpKSB7XG4gICAgICAgIGNvbnN0IHJlYWxOYW1lID0gcGFydHMuc2hpZnQoKS5yZXBsYWNlKC9eKD86fFtcXFNcXHNdKj9cXHMpKFxcUys/KT1bJ1wiXT8kLywgJyQxJyk7XG4gICAgICAgIGNhY2hlW25hbWVdID0gYXR0cmlidXRlc1tyZWFsTmFtZV0gfHxcbiAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgZm9sbG93aW5nIGlnbm9yZSBpcyBjb3ZlcmVkIGJ5IGJyb3dzZXJzXG4gICAgICAgICAgICAgICAgICAgICAgLy8gd2hpbGUgYmFzaWNIVE1MIGlzIGFscmVhZHkgY2FzZS1zZW5zaXRpdmVcbiAgICAgICAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXNbcmVhbE5hbWUudG9Mb3dlckNhc2UoKV07XG4gICAgICAgIHBhdGhzLnB1c2goUGF0aC5jcmVhdGUoJ2F0dHInLCBjYWNoZVtuYW1lXSwgcmVhbE5hbWUpKTtcbiAgICAgIH1cbiAgICAgIHJlbW92ZS5wdXNoKGF0dHJpYnV0ZSk7XG4gICAgfVxuICB9XG4gIGNvbnN0IGxlbiA9IHJlbW92ZS5sZW5ndGg7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAvLyBFZGdlIEhUTUwgYnVnICMxNjg3ODcyNlxuICAgIGNvbnN0IGF0dHJpYnV0ZSA9IHJlbW92ZVtpXTtcbiAgICBpZiAoL15pZCQvaS50ZXN0KGF0dHJpYnV0ZS5uYW1lKSlcbiAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZS5uYW1lKTtcbiAgICAvLyBzdGFuZGFyZCBicm93c2VycyB3b3VsZCB3b3JrIGp1c3QgZmluZSBoZXJlXG4gICAgZWxzZVxuICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGVOb2RlKHJlbW92ZVtpXSk7XG4gIH1cblxuICAvLyBUaGlzIGlzIGEgdmVyeSBzcGVjaWZpYyBGaXJlZm94L1NhZmFyaSBpc3N1ZVxuICAvLyBidXQgc2luY2UgaXQgc2hvdWxkIGJlIGEgbm90IHNvIGNvbW1vbiBwYXR0ZXJuLFxuICAvLyBpdCdzIHByb2JhYmx5IHdvcnRoIHBhdGNoaW5nIHJlZ2FyZGxlc3MuXG4gIC8vIEJhc2ljYWxseSwgc2NyaXB0cyBjcmVhdGVkIHRocm91Z2ggc3RyaW5ncyBhcmUgZGVhdGguXG4gIC8vIFlvdSBuZWVkIHRvIGNyZWF0ZSBmcmVzaCBuZXcgc2NyaXB0cyBpbnN0ZWFkLlxuICAvLyBUT0RPOiBpcyB0aGVyZSBhbnkgb3RoZXIgbm9kZSB0aGF0IG5lZWRzIHN1Y2ggbm9uc2Vuc2U/XG4gIGNvbnN0IG5vZGVOYW1lID0gbm9kZS5ub2RlTmFtZTtcbiAgaWYgKC9ec2NyaXB0JC9pLnRlc3Qobm9kZU5hbWUpKSB7XG4gICAgLy8gdGhpcyB1c2VkIHRvIGJlIGxpa2UgdGhhdFxuICAgIC8vIGNvbnN0IHNjcmlwdCA9IGNyZWF0ZUVsZW1lbnQobm9kZSwgbm9kZU5hbWUpO1xuICAgIC8vIHRoZW4gRWRnZSBhcnJpdmVkIGFuZCBkZWNpZGVkIHRoYXQgc2NyaXB0cyBjcmVhdGVkXG4gICAgLy8gdGhyb3VnaCB0ZW1wbGF0ZSBkb2N1bWVudHMgYXJlbid0IHdvcnRoIGV4ZWN1dGluZ1xuICAgIC8vIHNvIGl0IGJlY2FtZSB0aGlzIC4uLiBob3BlZnVsbHkgaXQgd29uJ3QgaHVydCBpbiB0aGUgd2lsZFxuICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgc2NyaXB0LnNldEF0dHJpYnV0ZU5vZGUoYXR0cmlidXRlc1tpXS5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgIH1cbiAgICBzY3JpcHQudGV4dENvbnRlbnQgPSBub2RlLnRleHRDb250ZW50O1xuICAgIG5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc2NyaXB0LCBub2RlKTtcbiAgfVxufTtcblxuLy8gd2hlbiBhIFByb21pc2UgaXMgdXNlZCBhcyBpbnRlcnBvbGF0aW9uIHZhbHVlXG4vLyBpdHMgcmVzdWx0IG11c3QgYmUgcGFyc2VkIG9uY2UgcmVzb2x2ZWQuXG4vLyBUaGlzIGNhbGxiYWNrIGlzIGluIGNoYXJnZSBvZiB1bmRlcnN0YW5kaW5nIHdoYXQgdG8gZG9cbi8vIHdpdGggYSByZXR1cm5lZCB2YWx1ZSBvbmNlIHRoZSBwcm9taXNlIGlzIHJlc29sdmVkLlxuY29uc3QgaW52b2tlQXREaXN0YW5jZSA9ICh2YWx1ZSwgY2FsbGJhY2spID0+IHtcbiAgY2FsbGJhY2sodmFsdWUucGxhY2Vob2xkZXIpO1xuICBpZiAoJ3RleHQnIGluIHZhbHVlKSB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKHZhbHVlLnRleHQpLnRoZW4oU3RyaW5nKS50aGVuKGNhbGxiYWNrKTtcbiAgfSBlbHNlIGlmICgnYW55JyBpbiB2YWx1ZSkge1xuICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZS5hbnkpLnRoZW4oY2FsbGJhY2spO1xuICB9IGVsc2UgaWYgKCdodG1sJyBpbiB2YWx1ZSkge1xuICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZS5odG1sKS50aGVuKGFzSFRNTCkudGhlbihjYWxsYmFjayk7XG4gIH0gZWxzZSB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKEludGVudC5pbnZva2UodmFsdWUsIGNhbGxiYWNrKSkudGhlbihjYWxsYmFjayk7XG4gIH1cbn07XG5cbi8vIHF1aWNrIGFuZCBkaXJ0eSB3YXkgdG8gY2hlY2sgZm9yIFByb21pc2UvaXNoIHZhbHVlc1xuY29uc3QgaXNQcm9taXNlX2lzaCA9IHZhbHVlID0+IHZhbHVlICE9IG51bGwgJiYgJ3RoZW4nIGluIHZhbHVlO1xuXG4vLyBpbiBhIGh5cGVyKG5vZGUpYDxkaXY+JHtjb250ZW50fTwvZGl2PmAgY2FzZVxuLy8gZXZlcnl0aGluZyBjb3VsZCBoYXBwZW46XG4vLyAgKiBpdCdzIGEgSlMgcHJpbWl0aXZlLCBzdG9yZWQgYXMgdGV4dFxuLy8gICogaXQncyBudWxsIG9yIHVuZGVmaW5lZCwgdGhlIG5vZGUgc2hvdWxkIGJlIGNsZWFuZWRcbi8vICAqIGl0J3MgYSBjb21wb25lbnQsIHVwZGF0ZSB0aGUgY29udGVudCBieSByZW5kZXJpbmcgaXRcbi8vICAqIGl0J3MgYSBwcm9taXNlLCB1cGRhdGUgdGhlIGNvbnRlbnQgb25jZSByZXNvbHZlZFxuLy8gICogaXQncyBhbiBleHBsaWNpdCBpbnRlbnQsIHBlcmZvcm0gdGhlIGRlc2lyZWQgb3BlcmF0aW9uXG4vLyAgKiBpdCdzIGFuIEFycmF5LCByZXNvbHZlIGFsbCB2YWx1ZXMgaWYgUHJvbWlzZXMgYW5kL29yXG4vLyAgICB1cGRhdGUgdGhlIG5vZGUgd2l0aCB0aGUgcmVzdWx0aW5nIGxpc3Qgb2YgY29udGVudFxuY29uc3Qgc2V0QW55Q29udGVudCA9IChub2RlLCBjaGlsZE5vZGVzKSA9PiB7XG4gIGNvbnN0IGRpZmZPcHRpb25zID0ge25vZGU6IGFzTm9kZSwgYmVmb3JlOiBub2RlfTtcbiAgbGV0IGZhc3RQYXRoID0gZmFsc2U7XG4gIGxldCBvbGRWYWx1ZTtcbiAgY29uc3QgYW55Q29udGVudCA9IHZhbHVlID0+IHtcbiAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgaWYgKGZhc3RQYXRoKSB7XG4gICAgICAgICAgaWYgKG9sZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgb2xkVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGNoaWxkTm9kZXNbMF0udGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmFzdFBhdGggPSB0cnVlO1xuICAgICAgICAgIG9sZFZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgY2hpbGROb2RlcyA9IGRvbWRpZmYoXG4gICAgICAgICAgICBub2RlLnBhcmVudE5vZGUsXG4gICAgICAgICAgICBjaGlsZE5vZGVzLFxuICAgICAgICAgICAgW3RleHQobm9kZSwgdmFsdWUpXSxcbiAgICAgICAgICAgIGRpZmZPcHRpb25zXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgIGZhc3RQYXRoID0gZmFsc2U7XG4gICAgICAgICAgY2hpbGROb2RlcyA9IGRvbWRpZmYoXG4gICAgICAgICAgICBub2RlLnBhcmVudE5vZGUsXG4gICAgICAgICAgICBjaGlsZE5vZGVzLFxuICAgICAgICAgICAgW10sXG4gICAgICAgICAgICBkaWZmT3B0aW9uc1xuICAgICAgICAgICk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGZhc3RQYXRoID0gZmFsc2U7XG4gICAgICAgIG9sZFZhbHVlID0gdmFsdWU7XG4gICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICBjaGlsZE5vZGVzID0gZG9tZGlmZihcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudE5vZGUsXG4gICAgICAgICAgICAgICAgY2hpbGROb2RlcyxcbiAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgICBkaWZmT3B0aW9uc1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZVswXSkge1xuICAgICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgICAgICBhbnlDb250ZW50KHtodG1sOiB2YWx1ZX0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgICAgICAgIGlmIChpc0FycmF5KHZhbHVlWzBdKSkge1xuICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5jb25jYXQuYXBwbHkoW10sIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGlzUHJvbWlzZV9pc2godmFsdWVbMF0pKSB7XG4gICAgICAgICAgICAgICAgICBQcm9taXNlLmFsbCh2YWx1ZSkudGhlbihhbnlDb250ZW50KTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjaGlsZE5vZGVzID0gZG9tZGlmZihcbiAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50Tm9kZSxcbiAgICAgICAgICAgICAgICAgIGNoaWxkTm9kZXMsXG4gICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgIGRpZmZPcHRpb25zXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY2FuRGlmZih2YWx1ZSkpIHtcbiAgICAgICAgICBjaGlsZE5vZGVzID0gZG9tZGlmZihcbiAgICAgICAgICAgIG5vZGUucGFyZW50Tm9kZSxcbiAgICAgICAgICAgIGNoaWxkTm9kZXMsXG4gICAgICAgICAgICB2YWx1ZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSA/XG4gICAgICAgICAgICAgIHNsaWNlLmNhbGwodmFsdWUuY2hpbGROb2RlcykgOlxuICAgICAgICAgICAgICBbdmFsdWVdLFxuICAgICAgICAgICAgZGlmZk9wdGlvbnNcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGlzUHJvbWlzZV9pc2godmFsdWUpKSB7XG4gICAgICAgICAgdmFsdWUudGhlbihhbnlDb250ZW50KTtcbiAgICAgICAgfSBlbHNlIGlmICgncGxhY2Vob2xkZXInIGluIHZhbHVlKSB7XG4gICAgICAgICAgaW52b2tlQXREaXN0YW5jZSh2YWx1ZSwgYW55Q29udGVudCk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ3RleHQnIGluIHZhbHVlKSB7XG4gICAgICAgICAgYW55Q29udGVudChTdHJpbmcodmFsdWUudGV4dCkpO1xuICAgICAgICB9IGVsc2UgaWYgKCdhbnknIGluIHZhbHVlKSB7XG4gICAgICAgICAgYW55Q29udGVudCh2YWx1ZS5hbnkpO1xuICAgICAgICB9IGVsc2UgaWYgKCdodG1sJyBpbiB2YWx1ZSkge1xuICAgICAgICAgIGNoaWxkTm9kZXMgPSBkb21kaWZmKFxuICAgICAgICAgICAgbm9kZS5wYXJlbnROb2RlLFxuICAgICAgICAgICAgY2hpbGROb2RlcyxcbiAgICAgICAgICAgIHNsaWNlLmNhbGwoXG4gICAgICAgICAgICAgIGNyZWF0ZUZyYWdtZW50KFxuICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgW10uY29uY2F0KHZhbHVlLmh0bWwpLmpvaW4oJycpXG4gICAgICAgICAgICAgICkuY2hpbGROb2Rlc1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGRpZmZPcHRpb25zXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICgnbGVuZ3RoJyBpbiB2YWx1ZSkge1xuICAgICAgICAgIGFueUNvbnRlbnQoc2xpY2UuY2FsbCh2YWx1ZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFueUNvbnRlbnQoSW50ZW50Lmludm9rZSh2YWx1ZSwgYW55Q29udGVudCkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGFueUNvbnRlbnQ7XG59O1xuXG4vLyB0aGVyZSBhcmUgZm91ciBraW5kIG9mIGF0dHJpYnV0ZXMsIGFuZCByZWxhdGVkIGJlaGF2aW9yOlxuLy8gICogZXZlbnRzLCB3aXRoIGEgbmFtZSBzdGFydGluZyB3aXRoIGBvbmAsIHRvIGFkZC9yZW1vdmUgZXZlbnQgbGlzdGVuZXJzXG4vLyAgKiBzcGVjaWFsLCB3aXRoIGEgbmFtZSBwcmVzZW50IGluIHRoZWlyIGluaGVyaXRlZCBwcm90b3R5cGUsIGFjY2Vzc2VkIGRpcmVjdGx5XG4vLyAgKiByZWd1bGFyLCBhY2Nlc3NlZCB0aHJvdWdoIGdldC9zZXRBdHRyaWJ1dGUgc3RhbmRhcmQgRE9NIG1ldGhvZHNcbi8vICAqIHN0eWxlLCB0aGUgb25seSByZWd1bGFyIGF0dHJpYnV0ZSB0aGF0IGFsc28gYWNjZXB0cyBhbiBvYmplY3QgYXMgdmFsdWVcbi8vICAgIHNvIHRoYXQgeW91IGNhbiBzdHlsZT0ke3t3aWR0aDogMTIwfX0uIEluIHRoaXMgY2FzZSwgdGhlIGJlaGF2aW9yIGhhcyBiZWVuXG4vLyAgICBmdWxseSBpbnNwaXJlZCBieSBQcmVhY3QgbGlicmFyeSBhbmQgaXRzIHNpbXBsaWNpdHkuXG5jb25zdCBzZXRBdHRyaWJ1dGUgPSAobm9kZSwgbmFtZSwgb3JpZ2luYWwpID0+IHtcbiAgY29uc3QgaXNTVkcgPSBPV05FUl9TVkdfRUxFTUVOVCBpbiBub2RlO1xuICBsZXQgb2xkVmFsdWU7XG4gIC8vIGlmIHRoZSBhdHRyaWJ1dGUgaXMgdGhlIHN0eWxlIG9uZVxuICAvLyBoYW5kbGUgaXQgZGlmZmVyZW50bHkgZnJvbSBvdGhlcnNcbiAgaWYgKG5hbWUgPT09ICdzdHlsZScpIHtcbiAgICByZXR1cm4gU3R5bGUobm9kZSwgb3JpZ2luYWwsIGlzU1ZHKTtcbiAgfVxuICAvLyB0aGUgbmFtZSBpcyBhbiBldmVudCBvbmUsXG4gIC8vIGFkZC9yZW1vdmUgZXZlbnQgbGlzdGVuZXJzIGFjY29yZGluZ2x5XG4gIGVsc2UgaWYgKC9eb24vLnRlc3QobmFtZSkpIHtcbiAgICBsZXQgdHlwZSA9IG5hbWUuc2xpY2UoMik7XG4gICAgaWYgKHR5cGUgPT09IENPTk5FQ1RFRCB8fCB0eXBlID09PSBESVNDT05ORUNURUQpIHtcbiAgICAgIGlmIChub3RPYnNlcnZpbmcpIHtcbiAgICAgICAgbm90T2JzZXJ2aW5nID0gZmFsc2U7XG4gICAgICAgIG9ic2VydmUoKTtcbiAgICAgIH1cbiAgICAgIGNvbXBvbmVudHMuYWRkKG5vZGUpO1xuICAgIH1cbiAgICBlbHNlIGlmIChuYW1lLnRvTG93ZXJDYXNlKCkgaW4gbm9kZSkge1xuICAgICAgdHlwZSA9IHR5cGUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld1ZhbHVlID0+IHtcbiAgICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgaWYgKG9sZFZhbHVlKSBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgb2xkVmFsdWUsIGZhbHNlKTtcbiAgICAgICAgb2xkVmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgaWYgKG5ld1ZhbHVlKSBub2RlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbmV3VmFsdWUsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIC8vIHRoZSBhdHRyaWJ1dGUgaXMgc3BlY2lhbCAoJ3ZhbHVlJyBpbiBpbnB1dClcbiAgLy8gYW5kIGl0J3Mgbm90IFNWRyAqb3IqIHRoZSBuYW1lIGlzIGV4YWN0bHkgZGF0YSxcbiAgLy8gaW4gdGhpcyBjYXNlIGFzc2lnbiB0aGUgdmFsdWUgZGlyZWN0bHlcbiAgZWxzZSBpZiAobmFtZSA9PT0gJ2RhdGEnIHx8ICghaXNTVkcgJiYgbmFtZSBpbiBub2RlKSkge1xuICAgIHJldHVybiBuZXdWYWx1ZSA9PiB7XG4gICAgICBpZiAob2xkVmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICAgIG9sZFZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIGlmIChub2RlW25hbWVdICE9PSBuZXdWYWx1ZSkge1xuICAgICAgICAgIG5vZGVbbmFtZV0gPSBuZXdWYWx1ZTtcbiAgICAgICAgICBpZiAobmV3VmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICAvLyBpbiBldmVyeSBvdGhlciBjYXNlLCB1c2UgdGhlIGF0dHJpYnV0ZSBub2RlIGFzIGl0IGlzXG4gIC8vIHVwZGF0ZSBvbmx5IHRoZSB2YWx1ZSwgc2V0IGl0IGFzIG5vZGUgb25seSB3aGVuL2lmIG5lZWRlZFxuICBlbHNlIHtcbiAgICBsZXQgb3duZXIgPSBmYWxzZTtcbiAgICBjb25zdCBhdHRyaWJ1dGUgPSBvcmlnaW5hbC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgcmV0dXJuIG5ld1ZhbHVlID0+IHtcbiAgICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgb2xkVmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICBpZiAobmV3VmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKG93bmVyKSB7XG4gICAgICAgICAgICAgIG93bmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlTm9kZShhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXR0cmlidXRlLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZS52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgaWYgKCFvd25lcikge1xuICAgICAgICAgICAgICBvd25lciA9IHRydWU7XG4gICAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlTm9kZShhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG5cbi8vIHN0eWxlIG9yIHRleHRhcmVhcyBkb24ndCBhY2NlcHQgSFRNTCBhcyBjb250ZW50XG4vLyBpdCdzIHBvaW50bGVzcyB0byB0cmFuc2Zvcm0gb3IgYW5hbHl6ZSBhbnl0aGluZ1xuLy8gZGlmZmVyZW50IGZyb20gdGV4dCB0aGVyZSBidXQgaXQncyB3b3J0aCBjaGVja2luZ1xuLy8gZm9yIHBvc3NpYmxlIGRlZmluZWQgaW50ZW50cy5cbmNvbnN0IHNldFRleHRDb250ZW50ID0gbm9kZSA9PiB7XG4gIGxldCBvbGRWYWx1ZTtcbiAgY29uc3QgdGV4dENvbnRlbnQgPSB2YWx1ZSA9PiB7XG4gICAgaWYgKG9sZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgb2xkVmFsdWUgPSB2YWx1ZTtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlKSB7XG4gICAgICAgIGlmIChpc1Byb21pc2VfaXNoKHZhbHVlKSkge1xuICAgICAgICAgIHZhbHVlLnRoZW4odGV4dENvbnRlbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKCdwbGFjZWhvbGRlcicgaW4gdmFsdWUpIHtcbiAgICAgICAgICBpbnZva2VBdERpc3RhbmNlKHZhbHVlLCB0ZXh0Q29udGVudCk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ3RleHQnIGluIHZhbHVlKSB7XG4gICAgICAgICAgdGV4dENvbnRlbnQoU3RyaW5nKHZhbHVlLnRleHQpKTtcbiAgICAgICAgfSBlbHNlIGlmICgnYW55JyBpbiB2YWx1ZSkge1xuICAgICAgICAgIHRleHRDb250ZW50KHZhbHVlLmFueSk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2h0bWwnIGluIHZhbHVlKSB7XG4gICAgICAgICAgdGV4dENvbnRlbnQoW10uY29uY2F0KHZhbHVlLmh0bWwpLmpvaW4oJycpKTtcbiAgICAgICAgfSBlbHNlIGlmICgnbGVuZ3RoJyBpbiB2YWx1ZSkge1xuICAgICAgICAgIHRleHRDb250ZW50KHNsaWNlLmNhbGwodmFsdWUpLmpvaW4oJycpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXh0Q29udGVudChJbnRlbnQuaW52b2tlKHZhbHVlLCB0ZXh0Q29udGVudCkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlLnRleHRDb250ZW50ID0gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICByZXR1cm4gdGV4dENvbnRlbnQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7Y3JlYXRlLCBmaW5kfTtcblxuLy8gaHlwZXIuQ29tcG9uZW50cyBtaWdodCBuZWVkIGNvbm5lY3RlZC9kaXNjb25uZWN0ZWQgbm90aWZpY2F0aW9uc1xuLy8gdXNlZCBieSBjb21wb25lbnRzIGFuZCB0aGVpciBvbmNvbm5lY3Qvb25kaXNjb25uZWN0IGNhbGxiYWNrcy5cbi8vIFdoZW4gb25lIG9mIHRoZXNlIGNhbGxiYWNrcyBpcyBlbmNvdW50ZXJlZCxcbi8vIHRoZSBkb2N1bWVudCBzdGFydHMgYmVpbmcgb2JzZXJ2ZWQuXG5sZXQgbm90T2JzZXJ2aW5nID0gdHJ1ZTtcbmZ1bmN0aW9uIG9ic2VydmUoKSB7XG5cbiAgLy8gd2hlbiBoeXBlci5Db21wb25lbnQgcmVsYXRlZCBET00gbm9kZXNcbiAgLy8gYXJlIGFwcGVuZGVkIG9yIHJlbW92ZWQgZnJvbSB0aGUgbGl2ZSB0cmVlXG4gIC8vIHRoZXNlIG1pZ2h0IGxpc3RlbiB0byBjb25uZWN0ZWQvZGlzY29ubmVjdGVkIGV2ZW50c1xuICAvLyBUaGlzIHV0aWxpdHkgaXMgaW4gY2hhcmdlIG9mIGZpbmRpbmcgYWxsIGNvbXBvbmVudHNcbiAgLy8gaW52b2x2ZWQgaW4gdGhlIERPTSB1cGRhdGUvY2hhbmdlIGFuZCBkaXNwYXRjaFxuICAvLyByZWxhdGVkIGluZm9ybWF0aW9uIHRvIHRoZW1cbiAgY29uc3QgZGlzcGF0Y2hBbGwgPSAobm9kZXMsIHR5cGUpID0+IHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBFdmVudCh0eXBlKTtcbiAgICBjb25zdCBsZW5ndGggPSBub2Rlcy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgZGlzcGF0Y2hUYXJnZXQobm9kZSwgZXZlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyB0aGUgd2F5IGl0J3MgZG9uZSBpcyB2aWEgdGhlIGNvbXBvbmVudHMgd2VhayBzZXRcbiAgLy8gYW5kIHJlY3Vyc2l2ZWx5IGxvb2tpbmcgZm9yIG5lc3RlZCBjb21wb25lbnRzIHRvb1xuICBjb25zdCBkaXNwYXRjaFRhcmdldCA9IChub2RlLCBldmVudCkgPT4ge1xuICAgIGlmIChjb21wb25lbnRzLmhhcyhub2RlKSkge1xuICAgICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbiB8fCBnZXRDaGlsZHJlbihub2RlKTtcbiAgICBjb25zdCBsZW5ndGggPSBjaGlsZHJlbi5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgZGlzcGF0Y2hUYXJnZXQoY2hpbGRyZW5baV0sIGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBUaGUgTXV0YXRpb25PYnNlcnZlciBpcyB0aGUgYmVzdCB3YXkgdG8gaW1wbGVtZW50IHRoYXRcbiAgLy8gYnV0IHRoZXJlIGlzIGEgZmFsbGJhY2sgdG8gZGVwcmVjYXRlZCBET01Ob2RlSW5zZXJ0ZWQvUmVtb3ZlZFxuICAvLyBzbyB0aGF0IGV2ZW4gb2xkZXIgYnJvd3NlcnMvZW5naW5lcyBjYW4gaGVscCBjb21wb25lbnRzIGxpZmUtY3ljbGVcbiAgdHJ5IHtcbiAgICAobmV3IE11dGF0aW9uT2JzZXJ2ZXIocmVjb3JkcyA9PiB7XG4gICAgICBjb25zdCBsZW5ndGggPSByZWNvcmRzLmxlbmd0aDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHJlY29yZCA9IHJlY29yZHNbaV07XG4gICAgICAgIGRpc3BhdGNoQWxsKHJlY29yZC5yZW1vdmVkTm9kZXMsIERJU0NPTk5FQ1RFRCk7XG4gICAgICAgIGRpc3BhdGNoQWxsKHJlY29yZC5hZGRlZE5vZGVzLCBDT05ORUNURUQpO1xuICAgICAgfVxuICAgIH0pKS5vYnNlcnZlKGRvY3VtZW50LCB7c3VidHJlZTogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlfSk7XG4gIH0gY2F0Y2gob19PKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NTm9kZVJlbW92ZWQnLCBldmVudCA9PiB7XG4gICAgICBkaXNwYXRjaEFsbChbZXZlbnQudGFyZ2V0XSwgRElTQ09OTkVDVEVEKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NTm9kZUluc2VydGVkJywgZXZlbnQgPT4ge1xuICAgICAgZGlzcGF0Y2hBbGwoW2V2ZW50LnRhcmdldF0sIENPTk5FQ1RFRCk7XG4gICAgfSwgZmFsc2UpO1xuICB9XG59XG4iLCJpbXBvcnQge01hcCwgV2Vha01hcH0gZnJvbSAnLi4vc2hhcmVkL3Bvb3JseWZpbGxzLmpzJztcbmltcG9ydCB7RywgVUlEQywgVk9JRF9FTEVNRU5UU30gZnJvbSAnLi4vc2hhcmVkL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgVXBkYXRlcyBmcm9tICcuLi9vYmplY3RzL1VwZGF0ZXMuanMnO1xuaW1wb3J0IHtcbiAgY3JlYXRlRnJhZ21lbnQsXG4gIGltcG9ydE5vZGUsXG4gIHVuaXF1ZSxcbiAgVGVtcGxhdGVNYXBcbn0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzLmpzJztcblxuaW1wb3J0IHtzZWxmQ2xvc2luZ30gZnJvbSAnLi4vc2hhcmVkL3JlLmpzJztcblxuLy8gYSB3ZWFrIGNvbGxlY3Rpb24gb2YgY29udGV4dHMgdGhhdFxuLy8gYXJlIGFscmVhZHkga25vd24gdG8gaHlwZXJIVE1MXG5jb25zdCBiZXdpdGNoZWQgPSBuZXcgV2Vha01hcDtcblxuLy8gYWxsIHVuaXF1ZSB0ZW1wbGF0ZSBsaXRlcmFsc1xuY29uc3QgdGVtcGxhdGVzID0gVGVtcGxhdGVNYXAoKTtcblxuLy8gYmV0dGVyIGtub3duIGFzIGh5cGVyLmJpbmQobm9kZSksIHRoZSByZW5kZXIgaXNcbi8vIHRoZSBtYWluIHRhZyBmdW5jdGlvbiBpbiBjaGFyZ2Ugb2YgZnVsbHkgdXBncmFkaW5nXG4vLyBvciBzaW1wbHkgdXBkYXRpbmcsIGNvbnRleHRzIHVzZWQgYXMgaHlwZXJIVE1MIHRhcmdldHMuXG4vLyBUaGUgYHRoaXNgIGNvbnRleHQgaXMgZWl0aGVyIGEgcmVndWxhciBET00gbm9kZSBvciBhIGZyYWdtZW50LlxuZnVuY3Rpb24gcmVuZGVyKHRlbXBsYXRlKSB7XG4gIGNvbnN0IHdpY2tlZCA9IGJld2l0Y2hlZC5nZXQodGhpcyk7XG4gIGlmICh3aWNrZWQgJiYgd2lja2VkLnRlbXBsYXRlID09PSB1bmlxdWUodGVtcGxhdGUpKSB7XG4gICAgdXBkYXRlLmFwcGx5KHdpY2tlZC51cGRhdGVzLCBhcmd1bWVudHMpO1xuICB9IGVsc2Uge1xuICAgIHVwZ3JhZGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuLy8gYW4gdXBncmFkZSBpcyBpbiBjaGFyZ2Ugb2YgY29sbGVjdGluZyB0ZW1wbGF0ZSBpbmZvLFxuLy8gcGFyc2UgaXQgb25jZSwgaWYgdW5rbm93biwgdG8gbWFwIGFsbCBpbnRlcnBvbGF0aW9uc1xuLy8gYXMgc2luZ2xlIERPTSBjYWxsYmFja3MsIHJlbGF0ZSBzdWNoIHRlbXBsYXRlXG4vLyB0byB0aGUgY3VycmVudCBjb250ZXh0LCBhbmQgcmVuZGVyIGl0IGFmdGVyIGNsZWFuaW5nIHRoZSBjb250ZXh0IHVwXG5mdW5jdGlvbiB1cGdyYWRlKHRlbXBsYXRlKSB7XG4gIHRlbXBsYXRlID0gdW5pcXVlKHRlbXBsYXRlKTtcbiAgY29uc3QgaW5mbyA9ICB0ZW1wbGF0ZXMuZ2V0KHRlbXBsYXRlKSB8fFxuICAgICAgICAgICAgICAgIGNyZWF0ZVRlbXBsYXRlLmNhbGwodGhpcywgdGVtcGxhdGUpO1xuICBjb25zdCBmcmFnbWVudCA9IGltcG9ydE5vZGUodGhpcy5vd25lckRvY3VtZW50LCBpbmZvLmZyYWdtZW50KTtcbiAgY29uc3QgdXBkYXRlcyA9IFVwZGF0ZXMuY3JlYXRlKGZyYWdtZW50LCBpbmZvLnBhdGhzKTtcbiAgYmV3aXRjaGVkLnNldCh0aGlzLCB7dGVtcGxhdGUsIHVwZGF0ZXN9KTtcbiAgdXBkYXRlLmFwcGx5KHVwZGF0ZXMsIGFyZ3VtZW50cyk7XG4gIHRoaXMudGV4dENvbnRlbnQgPSAnJztcbiAgdGhpcy5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG59XG5cbi8vIGFuIHVwZGF0ZSBzaW1wbHkgbG9vcHMgb3ZlciBhbGwgbWFwcGVkIERPTSBvcGVyYXRpb25zXG5mdW5jdGlvbiB1cGRhdGUoKSB7XG4gIGNvbnN0IGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzW2kgLSAxXShhcmd1bWVudHNbaV0pO1xuICB9XG59XG5cbi8vIGEgdGVtcGxhdGUgY2FuIGJlIHVzZWQgdG8gY3JlYXRlIGEgZG9jdW1lbnQgZnJhZ21lbnRcbi8vIGF3YXJlIG9mIGFsbCBpbnRlcnBvbGF0aW9ucyBhbmQgd2l0aCBhIGxpc3Rcbi8vIG9mIHBhdGhzIHVzZWQgdG8gZmluZCBvbmNlIHRob3NlIG5vZGVzIHRoYXQgbmVlZCB1cGRhdGVzLFxuLy8gbm8gbWF0dGVyIGlmIHRoZXNlIGFyZSBhdHRyaWJ1dGVzLCB0ZXh0IG5vZGVzLCBvciByZWd1bGFyIG9uZVxuZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGUodGVtcGxhdGUpIHtcbiAgY29uc3QgcGF0aHMgPSBbXTtcbiAgY29uc3QgaHRtbCA9IHRlbXBsYXRlLmpvaW4oVUlEQykucmVwbGFjZShTQ19SRSwgU0NfUExBQ0UpO1xuICBjb25zdCBmcmFnbWVudCA9IGNyZWF0ZUZyYWdtZW50KHRoaXMsIGh0bWwpO1xuICBVcGRhdGVzLmZpbmQoZnJhZ21lbnQsIHBhdGhzLCB0ZW1wbGF0ZS5zbGljZSgpKTtcbiAgY29uc3QgaW5mbyA9IHtmcmFnbWVudCwgcGF0aHN9O1xuICB0ZW1wbGF0ZXMuc2V0KHRlbXBsYXRlLCBpbmZvKTtcbiAgcmV0dXJuIGluZm87XG59XG5cbi8vIHNvbWUgbm9kZSBjb3VsZCBiZSBzcGVjaWFsIHRob3VnaCwgbGlrZSBhIGN1c3RvbSBlbGVtZW50XG4vLyB3aXRoIGEgc2VsZiBjbG9zaW5nIHRhZywgd2hpY2ggc2hvdWxkIHdvcmsgdGhyb3VnaCB0aGVzZSBjaGFuZ2VzLlxuY29uc3QgU0NfUkUgPSBzZWxmQ2xvc2luZztcbmNvbnN0IFNDX1BMQUNFID0gKCQwLCAkMSwgJDIpID0+IHtcbiAgcmV0dXJuIFZPSURfRUxFTUVOVFMudGVzdCgkMSkgPyAkMCA6ICgnPCcgKyAkMSArICQyICsgJz48LycgKyAkMSArICc+Jyk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCByZW5kZXI7XG4iLCJpbXBvcnQge0VMRU1FTlRfTk9ERSwgU1ZHX05BTUVTUEFDRX0gZnJvbSAnLi4vc2hhcmVkL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQge1dlYWtNYXAsIHRyaW19IGZyb20gJy4uL3NoYXJlZC9wb29ybHlmaWxscy5qcyc7XG5pbXBvcnQge2ZyYWdtZW50fSBmcm9tICcuLi9zaGFyZWQvZWFzeS1kb20uanMnO1xuaW1wb3J0IHthcHBlbmQsIHNsaWNlLCB1bmlxdWV9IGZyb20gJy4uL3NoYXJlZC91dGlscy5qcyc7XG5pbXBvcnQgV2lyZSBmcm9tICcuLi9jbGFzc2VzL1dpcmUuanMnO1xuaW1wb3J0IHJlbmRlciBmcm9tICcuL3JlbmRlci5qcyc7XG5cbi8vIGFsbCB3aXJlcyB1c2VkIHBlciBlYWNoIGNvbnRleHRcbmNvbnN0IHdpcmVzID0gbmV3IFdlYWtNYXA7XG5cbi8vIEEgd2lyZSBpcyBhIGNhbGxiYWNrIHVzZWQgYXMgdGFnIGZ1bmN0aW9uXG4vLyB0byBsYXppbHkgcmVsYXRlIGEgZ2VuZXJpYyBvYmplY3QgdG8gYSB0ZW1wbGF0ZSBsaXRlcmFsLlxuLy8gaHlwZXIud2lyZSh1c2VyKWA8ZGl2IGlkPXVzZXI+JHt1c2VyLm5hbWV9PC9kaXY+YDsgPT4gdGhlIGRpdiN1c2VyXG4vLyBUaGlzIHByb3ZpZGVzIHRoZSBhYmlsaXR5IHRvIGhhdmUgYSB1bmlxdWUgRE9NIHN0cnVjdHVyZVxuLy8gcmVsYXRlZCB0byBhIHVuaXF1ZSBKUyBvYmplY3QgdGhyb3VnaCBhIHJldXNhYmxlIHRlbXBsYXRlIGxpdGVyYWwuXG4vLyBBIHdpcmUgY2FuIHNwZWNpZnkgYSB0eXBlLCBhcyBzdmcgb3IgaHRtbCwgYW5kIGFsc28gYW4gaWRcbi8vIHZpYSBodG1sOmlkIG9yIDppZCBjb252ZW50aW9uLiBTdWNoIDppZCBhbGxvd3Mgc2FtZSBKUyBvYmplY3RzXG4vLyB0byBiZSBhc3NvY2lhdGVkIHRvIGRpZmZlcmVudCBET00gc3RydWN0dXJlcyBhY2NvcmRpbmdseSB3aXRoXG4vLyB0aGUgdXNlZCB0ZW1wbGF0ZSBsaXRlcmFsIHdpdGhvdXQgbG9zaW5nIHByZXZpb3VzbHkgcmVuZGVyZWQgcGFydHMuXG5jb25zdCB3aXJlID0gKG9iaiwgdHlwZSkgPT4gb2JqID09IG51bGwgP1xuICBjb250ZW50KHR5cGUgfHwgJ2h0bWwnKSA6XG4gIHdlYWtseShvYmosIHR5cGUgfHwgJ2h0bWwnKTtcblxuLy8gQSB3aXJlIGNvbnRlbnQgaXMgYSB2aXJ0dWFsIHJlZmVyZW5jZSB0byBvbmUgb3IgbW9yZSBub2Rlcy5cbi8vIEl0J3MgcmVwcmVzZW50ZWQgYnkgZWl0aGVyIGEgRE9NIG5vZGUsIG9yIGFuIEFycmF5LlxuLy8gSW4gYm90aCBjYXNlcywgdGhlIHdpcmUgY29udGVudCByb2xlIGlzIHRvIHNpbXBseSB1cGRhdGVcbi8vIGFsbCBub2RlcyB0aHJvdWdoIHRoZSBsaXN0IG9mIHJlbGF0ZWQgY2FsbGJhY2tzLlxuLy8gSW4gZmV3IHdvcmRzLCBhIHdpcmUgY29udGVudCBpcyBsaWtlIGFuIGludmlzaWJsZSBwYXJlbnQgbm9kZVxuLy8gaW4gY2hhcmdlIG9mIHVwZGF0aW5nIGl0cyBjb250ZW50IGxpa2UgYSBib3VuZCBlbGVtZW50IHdvdWxkIGRvLlxuY29uc3QgY29udGVudCA9IHR5cGUgPT4ge1xuICBsZXQgd2lyZSwgY29udGFpbmVyLCBjb250ZW50LCB0ZW1wbGF0ZSwgdXBkYXRlcztcbiAgcmV0dXJuIGZ1bmN0aW9uIChzdGF0aWNzKSB7XG4gICAgc3RhdGljcyA9IHVuaXF1ZShzdGF0aWNzKTtcbiAgICBsZXQgc2V0dXAgPSB0ZW1wbGF0ZSAhPT0gc3RhdGljcztcbiAgICBpZiAoc2V0dXApIHtcbiAgICAgIHRlbXBsYXRlID0gc3RhdGljcztcbiAgICAgIGNvbnRlbnQgPSBmcmFnbWVudChkb2N1bWVudCk7XG4gICAgICBjb250YWluZXIgPSB0eXBlID09PSAnc3ZnJyA/XG4gICAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdfTkFNRVNQQUNFLCAnc3ZnJykgOlxuICAgICAgICBjb250ZW50O1xuICAgICAgdXBkYXRlcyA9IHJlbmRlci5iaW5kKGNvbnRhaW5lcik7XG4gICAgfVxuICAgIHVwZGF0ZXMuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICBpZiAoc2V0dXApIHtcbiAgICAgIGlmICh0eXBlID09PSAnc3ZnJykge1xuICAgICAgICBhcHBlbmQoY29udGVudCwgc2xpY2UuY2FsbChjb250YWluZXIuY2hpbGROb2RlcykpO1xuICAgICAgfVxuICAgICAgd2lyZSA9IHdpcmVDb250ZW50KGNvbnRlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gd2lyZTtcbiAgfTtcbn07XG5cbi8vIHdpcmVzIGFyZSB3ZWFrbHkgY3JlYXRlZCB0aHJvdWdoIG9iamVjdHMuXG4vLyBFYWNoIG9iamVjdCBjYW4gaGF2ZSBtdWx0aXBsZSB3aXJlcyBhc3NvY2lhdGVkXG4vLyBhbmQgdGhpcyBpcyB0aGFua3MgdG8gdGhlIHR5cGUgKyA6aWQgZmVhdHVyZS5cbmNvbnN0IHdlYWtseSA9IChvYmosIHR5cGUpID0+IHtcbiAgY29uc3QgaSA9IHR5cGUuaW5kZXhPZignOicpO1xuICBsZXQgd2lyZSA9IHdpcmVzLmdldChvYmopO1xuICBsZXQgaWQgPSB0eXBlO1xuICBpZiAoLTEgPCBpKSB7XG4gICAgaWQgPSB0eXBlLnNsaWNlKGkgKyAxKTtcbiAgICB0eXBlID0gdHlwZS5zbGljZSgwLCBpKSB8fCAnaHRtbCc7XG4gIH1cbiAgaWYgKCF3aXJlKSB3aXJlcy5zZXQob2JqLCB3aXJlID0ge30pO1xuICByZXR1cm4gd2lyZVtpZF0gfHwgKHdpcmVbaWRdID0gY29udGVudCh0eXBlKSk7XG59O1xuXG4vLyBhIGRvY3VtZW50IGZyYWdtZW50IGxvc2VzIGl0cyBub2RlcyBhcyBzb29uXG4vLyBhcyBpdCdzIGFwcGVuZGVkIGludG8gYW5vdGhlciBub2RlLlxuLy8gVGhpcyB3b3VsZCBlYXNpbHkgbG9zZSB3aXJlZCBjb250ZW50XG4vLyBzbyB0aGF0IG9uIGEgc2Vjb25kIHJlbmRlciBjYWxsLCB0aGUgcGFyZW50XG4vLyBub2RlIHdvdWxkbid0IGtub3cgd2hpY2ggbm9kZSB3YXMgdGhlcmVcbi8vIGFzc29jaWF0ZWQgdG8gdGhlIGludGVycG9sYXRpb24uXG4vLyBUbyBwcmV2ZW50IGh5cGVySFRNTCB0byBmb3JnZXQgYWJvdXQgd2lyZWQgbm9kZXMsXG4vLyB0aGVzZSBhcmUgZWl0aGVyIHJldHVybmVkIGFzIEFycmF5IG9yLCBpZiB0aGVyZSdzIG9ueSBvbmUgZW50cnksXG4vLyBhcyBzaW5nbGUgcmVmZXJlbmNlZCBub2RlIHRoYXQgd29uJ3QgZGlzYXBwZWFyIGZyb20gdGhlIGZyYWdtZW50LlxuLy8gVGhlIGluaXRpYWwgZnJhZ21lbnQsIGF0IHRoaXMgcG9pbnQsIHdvdWxkIGJlIHVzZWQgYXMgdW5pcXVlIHJlZmVyZW5jZS5cbmNvbnN0IHdpcmVDb250ZW50ID0gbm9kZSA9PiB7XG4gIGNvbnN0IGNoaWxkTm9kZXMgPSBub2RlLmNoaWxkTm9kZXM7XG4gIGNvbnN0IGxlbmd0aCA9IGNoaWxkTm9kZXMubGVuZ3RoO1xuICBjb25zdCB3aXJlTm9kZXMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGxldCBjaGlsZCA9IGNoaWxkTm9kZXNbaV07XG4gICAgaWYgKFxuICAgICAgY2hpbGQubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSB8fFxuICAgICAgdHJpbS5jYWxsKGNoaWxkLnRleHRDb250ZW50KS5sZW5ndGggIT09IDBcbiAgICApIHtcbiAgICAgIHdpcmVOb2Rlcy5wdXNoKGNoaWxkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHdpcmVOb2Rlcy5sZW5ndGggPT09IDEgPyB3aXJlTm9kZXNbMF0gOiBuZXcgV2lyZSh3aXJlTm9kZXMpO1xufTtcblxuZXhwb3J0IHsgY29udGVudCwgd2Vha2x5IH07XG5leHBvcnQgZGVmYXVsdCB3aXJlO1xuIiwiLyohIChjKSBBbmRyZWEgR2lhbW1hcmNoaSAoSVNDKSAqL1xuXG5pbXBvcnQgQ29tcG9uZW50LCB7c2V0dXB9IGZyb20gJy4vY2xhc3Nlcy9Db21wb25lbnQuanMnO1xuaW1wb3J0IEludGVudCBmcm9tICcuL29iamVjdHMvSW50ZW50LmpzJztcbmltcG9ydCB3aXJlLCB7Y29udGVudCwgd2Vha2x5fSBmcm9tICcuL2h5cGVyL3dpcmUuanMnO1xuaW1wb3J0IHJlbmRlciBmcm9tICcuL2h5cGVyL3JlbmRlci5qcyc7XG5pbXBvcnQgZGlmZiBmcm9tICcuL3NoYXJlZC9kb21kaWZmLmpzJztcblxuLy8gYWxsIGZ1bmN0aW9ucyBhcmUgc2VsZiBib3VuZCB0byB0aGUgcmlnaHQgY29udGV4dFxuLy8geW91IGNhbiBkbyB0aGUgZm9sbG93aW5nXG4vLyBjb25zdCB7YmluZCwgd2lyZX0gPSBoeXBlckhUTUw7XG4vLyBhbmQgdXNlIHRoZW0gcmlnaHQgYXdheTogYmluZChub2RlKWBoZWxsbyFgO1xuY29uc3QgYmluZCA9IGNvbnRleHQgPT4gcmVuZGVyLmJpbmQoY29udGV4dCk7XG5jb25zdCBkZWZpbmUgPSBJbnRlbnQuZGVmaW5lO1xuXG5oeXBlci5Db21wb25lbnQgPSBDb21wb25lbnQ7XG5oeXBlci5iaW5kID0gYmluZDtcbmh5cGVyLmRlZmluZSA9IGRlZmluZTtcbmh5cGVyLmRpZmYgPSBkaWZmO1xuaHlwZXIuaHlwZXIgPSBoeXBlcjtcbmh5cGVyLndpcmUgPSB3aXJlO1xuXG4vLyB0aGUgd2lyZSBjb250ZW50IGlzIHRoZSBsYXp5IGRlZmluZWRcbi8vIGh0bWwgb3Igc3ZnIHByb3BlcnR5IG9mIGVhY2ggaHlwZXIuQ29tcG9uZW50XG5zZXR1cChjb250ZW50KTtcblxuLy8gZXZlcnl0aGluZyBpcyBleHBvcnRlZCBkaXJlY3RseSBvciB0aHJvdWdoIHRoZVxuLy8gaHlwZXJIVE1MIGNhbGxiYWNrLCB3aGVuIHVzZWQgYXMgdG9wIGxldmVsIHNjcmlwdFxuZXhwb3J0IHtDb21wb25lbnQsIGJpbmQsIGRlZmluZSwgZGlmZiwgaHlwZXIsIHdpcmV9O1xuXG4vLyBieSBkZWZhdWx0LCBoeXBlckhUTUwgaXMgYSBzbWFydCBmdW5jdGlvblxuLy8gdGhhdCBcIm1hZ2ljYWxseVwiIHVuZGVyc3RhbmRzIHdoYXQncyB0aGUgYmVzdFxuLy8gdGhpbmcgdG8gZG8gd2l0aCBwYXNzZWQgYXJndW1lbnRzXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBoeXBlcihIVE1MKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoIDwgMiA/XG4gICAgKEhUTUwgPT0gbnVsbCA/XG4gICAgICBjb250ZW50KCdodG1sJykgOlxuICAgICAgKHR5cGVvZiBIVE1MID09PSAnc3RyaW5nJyA/XG4gICAgICAgIGh5cGVyLndpcmUobnVsbCwgSFRNTCkgOlxuICAgICAgICAoJ3JhdycgaW4gSFRNTCA/XG4gICAgICAgICAgY29udGVudCgnaHRtbCcpKEhUTUwpIDpcbiAgICAgICAgICAoJ25vZGVUeXBlJyBpbiBIVE1MID9cbiAgICAgICAgICAgIGh5cGVyLmJpbmQoSFRNTCkgOlxuICAgICAgICAgICAgd2Vha2x5KEhUTUwsICdodG1sJylcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICkpIDpcbiAgICAoJ3JhdycgaW4gSFRNTCA/XG4gICAgICBjb250ZW50KCdodG1sJykgOiBoeXBlci53aXJlXG4gICAgKS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xufVxuIiwiaW1wb3J0IHsgaHlwZXIsIHdpcmUsIGJpbmQsIENvbXBvbmVudCB9IGZyb20gXCJoeXBlcmh0bWwvZXNtXCI7XG5cbmNsYXNzIENsb2NrIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuICAgICAgICByZXR1cm4gW1wic3RvcFwiXTtcbiAgICB9XG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICAgICAgdGhpcy5odG1sID0gYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zdG9wID0gZmFsc2U7XG4gICAgfVxuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyaWJ1dGUsIGxhc3RWYWx1ZSwgY3VycmVudFZhbHVlKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGUgPT09IFwic3RvcFwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhdHRyaWJ1dGUsIGN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnN0b3AgPSBjdXJyZW50VmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB0aGlzLnRpY2soKSwgMTAwMCk7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgIH1cbiAgICB0aWNrKCkge1xuICAgICAgICAhdGhpcy5zdG9wICYmIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHRtbGBcbiAgICAgICAgICAgIEl0IGlzICR7bmV3IERhdGUoKS50b0xvY2FsZVRpbWVTdHJpbmcoKX0uIFxuICAgICAgICBgO1xuICAgIH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiaHlwZXItY2xvY2tcIiwgQ2xvY2spO1xuXG5leHBvcnQgeyBDbG9jayB9O1xuIiwiaW1wb3J0IHsgaHlwZXIsIHdpcmUsIGJpbmQsIENvbXBvbmVudCB9IGZyb20gXCJoeXBlcmh0bWwvZXNtXCI7XG5pbXBvcnQgXCIuL0J1dHRvbi5zY3NzXCI7XG5cbmNsYXNzIEJ1dHRvbiBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcbiAgICAgICAgcmV0dXJuIFtcImxhYmVsXCJdO1xuICAgIH1cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICB0aGlzLmh0bWwgPSBiaW5kKHRoaXMpO1xuICAgIH1cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmh0bWxgXG4gICAgICAgICAgICA8YnV0dG9uPiR7dGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKX08L2J1dHRvbj5cbiAgICAgICAgYDtcbiAgICB9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZShcImh5cGVyLWJ1dHRvblwiLCBCdXR0b24pO1xuXG5leHBvcnQgeyBCdXR0b24gfTtcbiIsImltcG9ydCB7IHdpcmUsIGJpbmQgfSBmcm9tIFwiaHlwZXJodG1sL2VzbVwiO1xuXG5jbGFzcyBTZWxlY3QgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHJldHVybiBbXCJzZWxlY3RlZFwiXTtcbiAgICB9XG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICAgICAgdGhpcy5odG1sID0gYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gWy4uLnRoaXMuY2hpbGRyZW5dLm1hcChvID0+IHsgcmV0dXJuIHsgdmFsdWU6IG8udmFsdWUsIGxhYmVsOiBvLmxhYmVsIH19KTtcbiAgICB9XG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHIsIGxhc3RWYWx1ZSwgY3VycmVudFZhbHVlKSB7XG4gICAgICAgIGlmIChhdHRyID09PSAnc2VsZWN0ZWQnICYmIChsYXN0VmFsdWUgIT09IGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICAgIGhhbmRsZUV2ZW50KGUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgZS50YXJnZXQub3B0aW9uc1tlLnRhcmdldC5zZWxlY3RlZEluZGV4XS52YWx1ZSk7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHRtbGBcbiAgICAgICAgICAgIDxzZWxlY3Qgb25jaGFuZ2U9JHt0aGlzfT5cbiAgICAgICAgICAgICAgICAke3RoaXMub3B0aW9ucy5tYXAob3B0aW9uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdyA9IHdpcmUob3B0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgodGhpcy5nZXRBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiKSA9PT0gb3B0aW9uLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyB3YDxvcHRpb24gc2VsZWN0ZWQ9XCJ0cnVlXCIgdmFsdWU9JHtvcHRpb24udmFsdWV9PiR7b3B0aW9uLmxhYmVsfTwvb3B0aW9uPmBcbiAgICAgICAgICAgICAgICAgICAgICAgIDogd2A8b3B0aW9uIHZhbHVlPSR7b3B0aW9uLnZhbHVlfT4ke29wdGlvbi5sYWJlbH08L29wdGlvbj5gKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICBgO1xuICAgIH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiaHlwZXItc2VsZWN0XCIsIFNlbGVjdCk7XG5cbmV4cG9ydCB7IFNlbGVjdCB9O1xuIiwiaW1wb3J0IHsgaHlwZXIsIHdpcmUsIGJpbmQsIENvbXBvbmVudCB9IGZyb20gXCJoeXBlcmh0bWwvZXNtXCI7XG5pbXBvcnQgeyBDbG9jayB9IGZyb20gXCIuL2NvbXBvbmVudHMvQ2xvY2tcIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuL2NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyBTZWxlY3QgfSBmcm9tIFwiLi9jb21wb25lbnRzL1NlbGVjdFwiO1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGNsb2NrOiB7XG4gICAgICAgICAgICAgICAgc3RvcDogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZWxlY3QxOiB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQ6ICdvMSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZWxlY3QyOiB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQ6ICdvNCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5odG1sID0gYmluZCh0aGlzKTtcbiAgICB9XG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gICAgaGFuZGxlRXZlbnQoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlLnRhcmdldCwgZS50eXBlLCB0aGlzKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5jbG9jay5zdG9wID0gIXRoaXMuc3RhdGUuY2xvY2suc3RvcDtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5odG1sYFxuICAgICAgICAgICAgPGgxPk15IEh5cGVyIEhUTUwgUGxheWdyb3VuZDwvaDE+XG4gICAgICAgICAgICA8aDM+Q2xvY2s8L2gzPlxuICAgICAgICAgICAgPGh5cGVyLWNsb2NrIHN0b3A9JHt0aGlzLnN0YXRlLmNsb2NrLnN0b3B9IC8+XG4gICAgICAgICAgICA8aDM+QnV0dG9uPC9oMz5cbiAgICAgICAgICAgIDxoeXBlci1idXR0b24gb25jbGljaz0ke3RoaXN9IGxhYmVsPSR7dGhpcy5zdGF0ZS5jbG9jay5zdG9wID8gXCJSZXN1bWVcIiA6IFwiU3RvcFwifT48L2h5cGVyLWJ1dHRvbj5cbiAgICAgICAgICAgIDxoMz5TZWxlY3Q8L2gzPlxuICAgICAgICAgICAgPGh5cGVyLXNlbGVjdCBzZWxlY3RlZD0ke3RoaXMuc3RhdGUuc2VsZWN0MS5zZWxlY3RlZH0+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm8xXCI+b3B0aW9uMTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJvMlwiPm9wdGlvbjI8L29wdGlvbj5cbiAgICAgICAgICAgIDwvaHlwZXItc2VsZWN0PlxuICAgICAgICAgICAgPGh5cGVyLXNlbGVjdCBzZWxlY3RlZD0ke3RoaXMuc3RhdGUuc2VsZWN0Mi5zZWxlY3RlZH0+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm8zXCI+b3B0aW9uMzwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJvNFwiPm9wdGlvbjQ8L29wdGlvbj5cbiAgICAgICAgICAgIDwvaHlwZXItc2VsZWN0PlxuICAgICAgICAgICAgPGgzPkdyaWQgc3lzdGVtPC9oMz5cbiAgICAgICAgICAgIDxoMz5MaW5lIGNoYXJ0PC9oMz5cbiAgICBgO1xuICAgIH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiaHlwZXItYXBwXCIsIEFwcCk7XG5cbmV4cG9ydCB7IEFwcCB9O1xuIiwiaW1wb3J0IHtoeXBlcn0gZnJvbSAnaHlwZXJodG1sL2VzbSc7XG5pbXBvcnQge0FwcH0gZnJvbSAnLi9hcHAuanMnXG5pbXBvcnQgJy4vcmVzZXQuc2Nzcyc7XG5cbmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gJzxoeXBlci1hcHA+PC9oeXBlci1hcHA+JztcblxuIl0sIm5hbWVzIjpbImRvYyIsImNyZWF0ZSIsImZpbmRBdHRyaWJ1dGVzIiwidXBkYXRlIl0sIm1hcHBpbmdzIjoiOzs7RUFBTyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDOztFQUV0QztFQUNBO0VBQ0E7QUFDQSxFQUFPLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQztBQUM5QixFQUNPLE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQztBQUMzQixFQUFPLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQztBQUM5QixFQUFPLE1BQU0sc0JBQXNCLEdBQUcsRUFBRSxDQUFDOztFQUV6QztBQUNBLEVBQU8sTUFBTSxhQUFhLEdBQUcseUZBQXlGLENBQUM7O0VBRXZIO0FBQ0EsRUFBTyxNQUFNLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO0FBQ25ELEVBQU8sTUFBTSxhQUFhLEdBQUcsNEJBQTRCLENBQUM7O0VBRTFEO0FBQ0EsRUFBTyxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUM7QUFDckMsRUFBTyxNQUFNLFlBQVksR0FBRyxLQUFLLEdBQUcsU0FBUyxDQUFDOztFQUU5QztBQUNBLEVBQU8sTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDO0FBQ2xDLEVBQU8sTUFBTSx1QkFBdUIsR0FBRyxtQkFBbUIsQ0FBQztBQUMzRCxFQUFPLE1BQU0sR0FBRyxHQUFHLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDcEUsRUFBTyxNQUFNLElBQUksR0FBRyxNQUFNLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQzs7RUN4QnpDO0VB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
