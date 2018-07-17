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
  };

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
			<hyper-redux label="redux"></hyper-redux>
		`;
  	}
  }

  customElements.define("hyper-app", App);

  document.body.innerHTML = '<hyper-app></hyper-app>';

}());
