var WebcryptoSocket = (function (exports, protobufjs, fetch, WebSocket) {
  'use strict';

  fetch = fetch && Object.prototype.hasOwnProperty.call(fetch, 'default') ? fetch['default'] : fetch;
  WebSocket = WebSocket && Object.prototype.hasOwnProperty.call(WebSocket, 'default') ? WebSocket['default'] : WebSocket;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function PrepareBuffer(buffer) {
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(buffer)) {
      return new Uint8Array(buffer);
    } else if (ArrayBuffer.isView(buffer)) {
      return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    } else {
      return new Uint8Array(buffer);
    }
  }

  class Convert {
    static ToString(buffer, enc = "utf8") {
      const buf = PrepareBuffer(buffer);

      switch (enc.toLowerCase()) {
        case "utf8":
          return this.ToUtf8String(buf);

        case "binary":
          return this.ToBinary(buf);

        case "hex":
          return this.ToHex(buf);

        case "base64":
          return this.ToBase64(buf);

        case "base64url":
          return this.ToBase64Url(buf);

        default:
          throw new Error(`Unknown type of encoding '${enc}'`);
      }
    }

    static FromString(str, enc = "utf8") {
      switch (enc.toLowerCase()) {
        case "utf8":
          return this.FromUtf8String(str);

        case "binary":
          return this.FromBinary(str);

        case "hex":
          return this.FromHex(str);

        case "base64":
          return this.FromBase64(str);

        case "base64url":
          return this.FromBase64Url(str);

        default:
          throw new Error(`Unknown type of encoding '${enc}'`);
      }
    }

    static ToBase64(buffer) {
      const buf = PrepareBuffer(buffer);

      if (typeof btoa !== "undefined") {
        const binary = this.ToString(buf, "binary");
        return btoa(binary);
      } else {
        return Buffer.from(buf).toString("base64");
      }
    }

    static FromBase64(base64Text) {
      base64Text = base64Text.replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "").replace(/\s/g, "");

      if (typeof atob !== "undefined") {
        return this.FromBinary(atob(base64Text));
      } else {
        return new Uint8Array(Buffer.from(base64Text, "base64")).buffer;
      }
    }

    static FromBase64Url(base64url) {
      return this.FromBase64(this.Base64Padding(base64url.replace(/\-/g, "+").replace(/\_/g, "/")));
    }

    static ToBase64Url(data) {
      return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
    }

    static FromUtf8String(text) {
      const s = unescape(encodeURIComponent(text));
      const uintArray = new Uint8Array(s.length);

      for (let i = 0; i < s.length; i++) {
        uintArray[i] = s.charCodeAt(i);
      }

      return uintArray.buffer;
    }

    static ToUtf8String(buffer) {
      const buf = PrepareBuffer(buffer);
      const encodedString = String.fromCharCode.apply(null, buf);
      const decodedString = decodeURIComponent(escape(encodedString));
      return decodedString;
    }

    static FromBinary(text) {
      const stringLength = text.length;
      const resultView = new Uint8Array(stringLength);

      for (let i = 0; i < stringLength; i++) {
        resultView[i] = text.charCodeAt(i);
      }

      return resultView.buffer;
    }

    static ToBinary(buffer) {
      const buf = PrepareBuffer(buffer);
      let resultString = "";
      const len = buf.length;

      for (let i = 0; i < len; i++) {
        resultString = resultString + String.fromCharCode(buf[i]);
      }

      return resultString;
    }

    static ToHex(buffer) {
      const buf = PrepareBuffer(buffer);
      const splitter = "";
      const res = [];
      const len = buf.length;

      for (let i = 0; i < len; i++) {
        const char = buf[i].toString(16);
        res.push(char.length === 1 ? "0" + char : char);
      }

      return res.join(splitter);
    }

    static FromHex(hexString) {
      const res = new Uint8Array(hexString.length / 2);

      for (let i = 0; i < hexString.length; i = i + 2) {
        const c = hexString.slice(i, i + 2);
        res[i / 2] = parseInt(c, 16);
      }

      return res.buffer;
    }

    static Base64Padding(base64) {
      const padCount = 4 - base64.length % 4;

      if (padCount < 4) {
        for (let i = 0; i < padCount; i++) {
          base64 += "=";
        }
      }

      return base64;
    }

  }

  class BufferSourceConverter {
    static toArrayBuffer(data) {
      const buf = this.toUint8Array(data);

      if (buf.byteOffset || buf.length) {
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
      }

      return buf.buffer;
    }

    static toUint8Array(data) {
      if (typeof Buffer !== "undefined" && Buffer.isBuffer(data)) {
        return new Uint8Array(data);
      }

      if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
      }

      if (data instanceof ArrayBuffer) {
        return new Uint8Array(data);
      }

      throw new TypeError("The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
    }

    static isBufferSource(data) {
      return ArrayBuffer.isView(data) || data instanceof ArrayBuffer;
    }

  }

  function assign(target, ...sources) {
    const res = arguments[0];

    for (let i = 1; i < arguments.length; i++) {
      const obj = arguments[i];

      for (const prop in obj) {
        res[prop] = obj[prop];
      }
    }

    return res;
  }

  function combine(...buf) {
    const totalByteLength = buf.map(item => item.byteLength).reduce((prev, cur) => prev + cur);
    const res = new Uint8Array(totalByteLength);
    let currentPos = 0;
    buf.map(item => new Uint8Array(item)).forEach(arr => {
      for (const item2 of arr) {
        res[currentPos++] = item2;
      }
    });
    return res.buffer;
  }

  function isEqual(bytes1, bytes2) {
    if (!(bytes1 && bytes2)) {
      return false;
    }

    if (bytes1.byteLength !== bytes2.byteLength) {
      return false;
    }

    const b1 = new Uint8Array(bytes1);
    const b2 = new Uint8Array(bytes2);

    for (let i = 0; i < bytes1.byteLength; i++) {
      if (b1[i] !== b2[i]) {
        return false;
      }
    }

    return true;
  }
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */


  function __decorate(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  class ArrayBufferConverter {
    static async set(value) {
      return new Uint8Array(value);
    }

    static async get(value) {
      return new Uint8Array(value).buffer;
    }

  }

  function ProtobufElement(params) {
    return target => {
      const t = target;
      t.localName = params.name || t.name || t.toString().match(/^function\s*([^\s(]+)/)[1];
      t.items = t.items || {};
      t.target = target;
      t.items = assign({}, t.items);
      const scheme = new protobufjs.Type(t.localName);

      for (const key in t.items) {
        const item = t.items[key];
        let rule = void 0;

        if (item.repeated) {
          rule = "repeated";
        } else if (item.required) {
          rule = "required";
        }

        scheme.add(new protobufjs.Field(item.name, item.id, item.type, rule));
      }

      t.protobuf = scheme;
    };
  }

  function defineProperty(target, key, params) {
    const propertyKey = `_${key}`;
    const opt = {
      set: function (v) {
        if (this[propertyKey] !== v) {
          this.raw = null;
          this[propertyKey] = v;
        }
      },
      get: function () {
        if (this[propertyKey] === void 0) {
          let defaultValue = params.defaultValue;

          if (params.parser && !params.repeated) {
            defaultValue = new params.parser();
          }

          this[propertyKey] = defaultValue;
        }

        return this[propertyKey];
      },
      enumerable: true
    };
    Object.defineProperty(target, propertyKey, {
      writable: true,
      enumerable: false
    });
    Object.defineProperty(target, key, opt);
  }

  function ProtobufProperty(params) {
    return (target, propertyKey) => {
      const t = target.constructor;
      const key = propertyKey;
      t.items = t.items || {};

      if (t.target !== t) {
        t.items = assign({}, t.items);
        t.target = t;
      }

      t.items[key] = {
        id: params.id,
        type: params.type || "bytes",
        defaultValue: params.defaultValue,
        converter: params.converter || null,
        parser: params.parser || null
      };
      params.name = params.name || key;
      t.items[key].name = params.name;
      t.items[key].required = params.required || false;
      t.items[key].repeated = params.repeated || false;
      defineProperty(target, key, t.items[key]);
    };
  }

  class ObjectProto {
    static async importProto(data) {
      const res = new this();
      await res.importProto(data);
      return res;
    }

    isEmpty() {
      return this.raw === undefined;
    }

    hasChanged() {
      if (this.raw === null) {
        return true;
      }

      const thisStatic = this.constructor;
      const that = this;

      for (const key in thisStatic.items) {
        const item = thisStatic.items[key];

        if (item.repeated) {
          if (item.parser) {
            return that[key].some(arrayItem => arrayItem.hasChanged());
          }
        } else {
          if (item.parser && that[key] && that[key].hasChanged()) {
            return true;
          }
        }
      }

      return false;
    }

    async importProto(data) {
      const thisStatic = this.constructor;
      const that = this;
      let scheme;
      let raw;

      if (data instanceof ObjectProto) {
        raw = await data.exportProto();
      } else {
        raw = data;
      }

      try {
        scheme = thisStatic.protobuf.decode(new Uint8Array(raw));
      } catch (e) {
        throw new Error(`Error: Cannot decode message for ${thisStatic.localName}.\n$ProtobufError: ${e.message}`);
      }

      for (const key in thisStatic.items) {
        const item = thisStatic.items[key];
        let schemeValues = scheme[item.name];

        if (ArrayBuffer.isView(schemeValues)) {
          schemeValues = new Uint8Array(schemeValues);
        }

        if (!Array.isArray(schemeValues)) {
          if (item.repeated) {
            that[key] = schemeValues = [];
          } else {
            schemeValues = [schemeValues];
          }
        }

        if (item.repeated && !that[key]) {
          that[key] = [];
        }

        for (const schemeValue of schemeValues) {
          if (item.repeated) {
            that[key].push(await this.importItem(item, schemeValue));
          } else {
            that[key] = await this.importItem(item, schemeValue);
          }
        }
      }

      this.raw = raw;
    }

    async exportProto() {
      if (!this.hasChanged()) {
        return this.raw;
      }

      const thisStatic = this.constructor;
      const that = this;
      const protobuf = {};

      for (const key in thisStatic.items) {
        const item = thisStatic.items[key];
        let values = that[key];

        if (!Array.isArray(values)) {
          values = values === void 0 ? [] : [values];
        }

        for (const value of values) {
          const protobufValue = await this.exportItem(item, value);

          if (item.repeated) {
            if (!protobuf[item.name]) {
              protobuf[item.name] = [];
            }

            protobuf[item.name].push(protobufValue);
          } else {
            protobuf[item.name] = protobufValue;
          }
        }
      }

      this.raw = new Uint8Array(thisStatic.protobuf.encode(protobuf).finish()).buffer;
      return this.raw;
    }

    async exportItem(template, value) {
      const thisStatic = this.constructor;
      let result;

      if (template.parser) {
        const obj = value;
        const raw = await obj.exportProto();

        if (template.required && !raw) {
          throw new Error(`Error: Paramter '${template.name}' is required in '${thisStatic.localName}' protobuf message.`);
        }

        if (raw) {
          result = new Uint8Array(raw);
        }
      } else {
        if (template.required && value === void 0) {
          throw new Error(`Error: Paramter '${template.name}' is required in '${thisStatic.localName}' protobuf message.`);
        }

        if (template.converter) {
          if (value) {
            result = await template.converter.set(value);
          }
        } else {
          if (value instanceof ArrayBuffer) {
            value = new Uint8Array(value);
          }

          result = value;
        }
      }

      return result;
    }

    async importItem(template, value) {
      const thisStatic = this.constructor;
      let result;

      if (template.parser) {
        const parser = template.parser;

        if (value && value.byteLength) {
          result = await parser.importProto(new Uint8Array(value).buffer);
        } else if (template.required) {
          throw new Error(`Error: Parameter '${template.name}' is required in '${thisStatic.localName}' protobuf message.`);
        }
      } else if (template.converter) {
        if (value && value.byteLength) {
          result = await template.converter.get(value);
        } else if (template.required) {
          throw new Error(`Error: Parameter '${template.name}' is required in '${thisStatic.localName}' protobuf message.`);
        }
      } else {
        result = value;
      }

      return result;
    }

  }

  var domain;

  function EventHandlers() {}

  EventHandlers.prototype = Object.create(null);

  function EventEmitter() {
    EventEmitter.init.call(this);
  }

  EventEmitter.EventEmitter = EventEmitter;
  EventEmitter.usingDomains = false;
  EventEmitter.prototype.domain = undefined;
  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined;
  EventEmitter.defaultMaxListeners = 10;

  EventEmitter.init = function () {
    this.domain = null;

    if (EventEmitter.usingDomains) {
      if (domain.active) ;
    }

    if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
      this._events = new EventHandlers();
      this._eventsCount = 0;
    }

    this._maxListeners = this._maxListeners || undefined;
  };

  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || isNaN(n)) throw new TypeError('"n" argument must be a positive number');
    this._maxListeners = n;
    return this;
  };

  function $getMaxListeners(that) {
    if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }

  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
  };

  function emitNone(handler, isFn, self) {
    if (isFn) handler.call(self);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) listeners[i].call(self);
    }
  }

  function emitOne(handler, isFn, self, arg1) {
    if (isFn) handler.call(self, arg1);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) listeners[i].call(self, arg1);
    }
  }

  function emitTwo(handler, isFn, self, arg1, arg2) {
    if (isFn) handler.call(self, arg1, arg2);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) listeners[i].call(self, arg1, arg2);
    }
  }

  function emitThree(handler, isFn, self, arg1, arg2, arg3) {
    if (isFn) handler.call(self, arg1, arg2, arg3);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) listeners[i].call(self, arg1, arg2, arg3);
    }
  }

  function emitMany(handler, isFn, self, args) {
    if (isFn) handler.apply(self, args);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) listeners[i].apply(self, args);
    }
  }

  EventEmitter.prototype.emit = function emit(type) {
    var er, handler, len, args, i, events, domain;
    var doError = type === 'error';
    events = this._events;
    if (events) doError = doError && events.error == null;else if (!doError) return false;
    domain = this.domain;

    if (doError) {
      er = arguments[1];

      if (domain) {
        if (!er) er = new Error('Uncaught, unspecified "error" event');
        er.domainEmitter = this;
        er.domain = domain;
        er.domainThrown = false;
        domain.emit('error', er);
      } else if (er instanceof Error) {
        throw er;
      } else {
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }

      return false;
    }

    handler = events[type];
    if (!handler) return false;
    var isFn = typeof handler === 'function';
    len = arguments.length;

    switch (len) {
      case 1:
        emitNone(handler, isFn, this);
        break;

      case 2:
        emitOne(handler, isFn, this, arguments[1]);
        break;

      case 3:
        emitTwo(handler, isFn, this, arguments[1], arguments[2]);
        break;

      case 4:
        emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
        break;

      default:
        args = new Array(len - 1);

        for (i = 1; i < len; i++) args[i - 1] = arguments[i];

        emitMany(handler, isFn, this, args);
    }

    return true;
  };

  function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    events = target._events;

    if (!events) {
      events = target._events = new EventHandlers();
      target._eventsCount = 0;
    } else {
      if (events.newListener) {
        target.emit('newListener', type, listener.listener ? listener.listener : listener);
        events = target._events;
      }

      existing = events[type];
    }

    if (!existing) {
      existing = events[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === 'function') {
        existing = events[type] = prepend ? [listener, existing] : [existing, listener];
      } else {
        if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
      }

      if (!existing.warned) {
        m = $getMaxListeners(target);

        if (m && m > 0 && existing.length > m) {
          existing.warned = true;
          var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + type + ' listeners added. ' + 'Use emitter.setMaxListeners() to increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          emitWarning(w);
        }
      }
    }

    return target;
  }

  function emitWarning(e) {
    typeof console.warn === 'function' ? console.warn(e) : console.log(e);
  }

  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.prependListener = function prependListener(type, listener) {
    return _addListener(this, type, listener, true);
  };

  function _onceWrap(target, type, listener) {
    var fired = false;

    function g() {
      target.removeListener(type, g);

      if (!fired) {
        fired = true;
        listener.apply(target, arguments);
      }
    }

    g.listener = listener;
    return g;
  }

  EventEmitter.prototype.once = function once(type, listener) {
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    this.prependListener(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter.prototype.removeListener = function removeListener(type, listener) {
    var list, events, position, i, originalListener;
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    events = this._events;
    if (!events) return this;
    list = events[type];
    if (!list) return this;

    if (list === listener || list.listener && list.listener === listener) {
      if (--this._eventsCount === 0) this._events = new EventHandlers();else {
        delete events[type];
        if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
      }
    } else if (typeof list !== 'function') {
      position = -1;

      for (i = list.length; i-- > 0;) {
        if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          originalListener = list[i].listener;
          position = i;
          break;
        }
      }

      if (position < 0) return this;

      if (list.length === 1) {
        list[0] = undefined;

        if (--this._eventsCount === 0) {
          this._events = new EventHandlers();
          return this;
        } else {
          delete events[type];
        }
      } else {
        spliceOne(list, position);
      }

      if (events.removeListener) this.emit('removeListener', type, originalListener || listener);
    }

    return this;
  };

  EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
    var listeners, events;
    events = this._events;
    if (!events) return this;

    if (!events.removeListener) {
      if (arguments.length === 0) {
        this._events = new EventHandlers();
        this._eventsCount = 0;
      } else if (events[type]) {
        if (--this._eventsCount === 0) this._events = new EventHandlers();else delete events[type];
      }

      return this;
    }

    if (arguments.length === 0) {
      var keys = Object.keys(events);

      for (var i = 0, key; i < keys.length; ++i) {
        key = keys[i];
        if (key === 'removeListener') continue;
        this.removeAllListeners(key);
      }

      this.removeAllListeners('removeListener');
      this._events = new EventHandlers();
      this._eventsCount = 0;
      return this;
    }

    listeners = events[type];

    if (typeof listeners === 'function') {
      this.removeListener(type, listeners);
    } else if (listeners) {
      do {
        this.removeListener(type, listeners[listeners.length - 1]);
      } while (listeners[0]);
    }

    return this;
  };

  EventEmitter.prototype.listeners = function listeners(type) {
    var evlistener;
    var ret;
    var events = this._events;
    if (!events) ret = [];else {
      evlistener = events[type];
      if (!evlistener) ret = [];else if (typeof evlistener === 'function') ret = [evlistener.listener || evlistener];else ret = unwrapListeners(evlistener);
    }
    return ret;
  };

  EventEmitter.listenerCount = function (emitter, type) {
    if (typeof emitter.listenerCount === 'function') {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };

  EventEmitter.prototype.listenerCount = listenerCount;

  function listenerCount(type) {
    var events = this._events;

    if (events) {
      var evlistener = events[type];

      if (typeof evlistener === 'function') {
        return 1;
      } else if (evlistener) {
        return evlistener.length;
      }
    }

    return 0;
  }

  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  };

  function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) list[i] = list[k];

    list.pop();
  }

  function arrayClone(arr, i) {
    var copy = new Array(i);

    while (i--) copy[i] = arr[i];

    return copy;
  }

  function unwrapListeners(arr) {
    var ret = new Array(arr.length);

    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }

    return ret;
  }

  const SIGN_ALGORITHM_NAME = "ECDSA";
  const DH_ALGORITHM_NAME = "ECDH";
  const SECRET_KEY_NAME = "AES-CBC";
  const HASH_NAME = "SHA-256";
  const HMAC_NAME = "HMAC";
  const MAX_RATCHET_STACK_SIZE = 20;
  const INFO_TEXT = Convert.FromBinary("InfoText");
  const INFO_RATCHET = Convert.FromBinary("InfoRatchet");
  const INFO_MESSAGE_KEYS = Convert.FromBinary("InfoMessageKeys");
  let engine = null;

  if (typeof self !== "undefined") {
    engine = {
      crypto: self.crypto,
      name: "WebCrypto"
    };
  }

  function setEngine(name, crypto) {
    engine = {
      crypto,
      name
    };
  }

  function getEngine() {
    if (!engine) {
      throw new Error("WebCrypto engine is empty. Use setEngine to resolve it.");
    }

    return engine;
  }

  let Curve = (() => {
    class Curve {
      static async generateKeyPair(type, extractable) {
        const name = type;
        const usage = type === "ECDSA" ? ["sign", "verify"] : ["deriveKey", "deriveBits"];
        const keys = await getEngine().crypto.subtle.generateKey({
          name,
          namedCurve: this.NAMED_CURVE
        }, extractable, usage);
        const publicKey = await ECPublicKey.create(keys.publicKey);
        const res = {
          privateKey: keys.privateKey,
          publicKey
        };
        return res;
      }

      static deriveBytes(privateKey, publicKey) {
        return getEngine().crypto.subtle.deriveBits({
          name: "ECDH",
          public: publicKey.key
        }, privateKey, 256);
      }

      static verify(signingKey, message, signature) {
        return getEngine().crypto.subtle.verify({
          name: "ECDSA",
          hash: this.DIGEST_ALGORITHM
        }, signingKey.key, signature, message);
      }

      static async sign(signingKey, message) {
        return getEngine().crypto.subtle.sign({
          name: "ECDSA",
          hash: this.DIGEST_ALGORITHM
        }, signingKey, message);
      }

      static async ecKeyPairToJson(key) {
        return {
          privateKey: key.privateKey,
          publicKey: key.publicKey.key,
          thumbprint: await key.publicKey.thumbprint()
        };
      }

      static async ecKeyPairFromJson(keys) {
        return {
          privateKey: keys.privateKey,
          publicKey: await ECPublicKey.create(keys.publicKey)
        };
      }

    }

    Curve.NAMED_CURVE = "P-256";
    Curve.DIGEST_ALGORITHM = "SHA-512";
    return Curve;
  })();

  const AES_ALGORITHM = {
    name: "AES-CBC",
    length: 256
  };

  class Secret {
    static randomBytes(size) {
      const array = new Uint8Array(size);
      getEngine().crypto.getRandomValues(array);
      return array.buffer;
    }

    static digest(alg, message) {
      return getEngine().crypto.subtle.digest(alg, message);
    }

    static encrypt(key, data, iv) {
      return getEngine().crypto.subtle.encrypt({
        name: SECRET_KEY_NAME,
        iv: new Uint8Array(iv)
      }, key, data);
    }

    static decrypt(key, data, iv) {
      return getEngine().crypto.subtle.decrypt({
        name: SECRET_KEY_NAME,
        iv: new Uint8Array(iv)
      }, key, data);
    }

    static importHMAC(raw) {
      return getEngine().crypto.subtle.importKey("raw", raw, {
        name: HMAC_NAME,
        hash: {
          name: HASH_NAME
        }
      }, false, ["sign", "verify"]);
    }

    static importAES(raw) {
      return getEngine().crypto.subtle.importKey("raw", raw, AES_ALGORITHM, false, ["encrypt", "decrypt"]);
    }

    static async sign(key, data) {
      return await getEngine().crypto.subtle.sign({
        name: HMAC_NAME,
        hash: HASH_NAME
      }, key, data);
    }

    static async HKDF(IKM, keysCount = 1, salt, info = new ArrayBuffer(0)) {
      if (!salt) {
        salt = await this.importHMAC(new Uint8Array(32).buffer);
      }

      const PRKBytes = await this.sign(salt, IKM);
      const infoBuffer = new ArrayBuffer(32 + info.byteLength + 1);
      const PRK = await this.importHMAC(PRKBytes);
      const T = [new ArrayBuffer(0)];

      for (let i = 0; i < keysCount; i++) {
        T[i + 1] = await this.sign(PRK, combine(T[i], info, new Uint8Array([i + 1]).buffer));
      }

      return T.slice(1);
    }

  }

  class ECPublicKey {
    static async create(publicKey) {
      const res = new this();
      const algName = publicKey.algorithm.name.toUpperCase();

      if (!(algName === "ECDH" || algName === "ECDSA")) {
        throw new Error("Error: Unsupported asymmetric key algorithm.");
      }

      if (publicKey.type !== "public") {
        throw new Error("Error: Expected key type to be public but it was not.");
      }

      res.key = publicKey;
      const jwk = await getEngine().crypto.subtle.exportKey("jwk", publicKey);

      if (!(jwk.x && jwk.y)) {
        throw new Error("Wrong JWK data for EC public key. Parameters x and y are required.");
      }

      const x = Convert.FromBase64Url(jwk.x);
      const y = Convert.FromBase64Url(jwk.y);
      const xy = Convert.ToBinary(x) + Convert.ToBinary(y);
      res.serialized = Convert.FromBinary(xy);
      res.id = await res.thumbprint();
      return res;
    }

    static async importKey(bytes, type) {
      const x = Convert.ToBase64Url(bytes.slice(0, 32));
      const y = Convert.ToBase64Url(bytes.slice(32));
      const jwk = {
        crv: Curve.NAMED_CURVE,
        kty: "EC",
        x,
        y
      };
      const usage = type === "ECDSA" ? ["verify"] : [];
      const key = await getEngine().crypto.subtle.importKey("jwk", jwk, {
        name: type,
        namedCurve: Curve.NAMED_CURVE
      }, true, usage);
      const res = await ECPublicKey.create(key);
      return res;
    }

    serialize() {
      return this.serialized;
    }

    async thumbprint() {
      const bytes = await this.serialize();
      const thumbprint = await Secret.digest("SHA-256", bytes);
      return Convert.ToHex(thumbprint);
    }

    async isEqual(other) {
      if (!(other && other instanceof ECPublicKey)) {
        return false;
      }

      return isEqual(this.serialized, other.serialized);
    }

  }

  class Identity {
    constructor(id, signingKey, exchangeKey) {
      this.id = id;
      this.signingKey = signingKey;
      this.exchangeKey = exchangeKey;
      this.preKeys = [];
      this.signedPreKeys = [];
    }

    static async fromJSON(obj) {
      const signingKey = await Curve.ecKeyPairFromJson(obj.signingKey);
      const exchangeKey = await Curve.ecKeyPairFromJson(obj.exchangeKey);
      const res = new this(obj.id, signingKey, exchangeKey);
      res.createdAt = new Date(obj.createdAt);
      await res.fromJSON(obj);
      return res;
    }

    static async create(id, signedPreKeyAmount = 0, preKeyAmount = 0, extractable = false) {
      const signingKey = await Curve.generateKeyPair(SIGN_ALGORITHM_NAME, extractable);
      const exchangeKey = await Curve.generateKeyPair(DH_ALGORITHM_NAME, extractable);
      const res = new Identity(id, signingKey, exchangeKey);
      res.createdAt = new Date();

      for (let i = 0; i < preKeyAmount; i++) {
        res.preKeys.push(await Curve.generateKeyPair("ECDH", extractable));
      }

      for (let i = 0; i < signedPreKeyAmount; i++) {
        res.signedPreKeys.push(await Curve.generateKeyPair("ECDH", extractable));
      }

      return res;
    }

    async toJSON() {
      const preKeys = [];
      const signedPreKeys = [];

      for (const key of this.preKeys) {
        preKeys.push(await Curve.ecKeyPairToJson(key));
      }

      for (const key of this.signedPreKeys) {
        signedPreKeys.push(await Curve.ecKeyPairToJson(key));
      }

      return {
        createdAt: this.createdAt.toISOString(),
        exchangeKey: await Curve.ecKeyPairToJson(this.exchangeKey),
        id: this.id,
        preKeys,
        signedPreKeys,
        signingKey: await Curve.ecKeyPairToJson(this.signingKey)
      };
    }

    async fromJSON(obj) {
      this.id = obj.id;
      this.signingKey = await Curve.ecKeyPairFromJson(obj.signingKey);
      this.exchangeKey = await Curve.ecKeyPairFromJson(obj.exchangeKey);
      this.preKeys = [];

      for (const key of obj.preKeys) {
        this.preKeys.push(await Curve.ecKeyPairFromJson(key));
      }

      this.signedPreKeys = [];

      for (const key of obj.signedPreKeys) {
        this.signedPreKeys.push(await Curve.ecKeyPairFromJson(key));
      }
    }

  }

  class RemoteIdentity {
    static fill(protocol) {
      const res = new RemoteIdentity();
      res.fill(protocol);
      return res;
    }

    static async fromJSON(obj) {
      const res = new this();
      await res.fromJSON(obj);
      return res;
    }

    fill(protocol) {
      this.signingKey = protocol.signingKey;
      this.exchangeKey = protocol.exchangeKey;
      this.signature = protocol.signature;
      this.createdAt = protocol.createdAt;
    }

    verify() {
      return Curve.verify(this.signingKey, this.exchangeKey.serialize(), this.signature);
    }

    async toJSON() {
      return {
        createdAt: this.createdAt.toISOString(),
        exchangeKey: await this.exchangeKey.key,
        id: this.id,
        signature: this.signature,
        signingKey: await this.signingKey.key,
        thumbprint: await this.signingKey.thumbprint()
      };
    }

    async fromJSON(obj) {
      this.id = obj.id;
      this.signature = obj.signature;
      this.signingKey = await ECPublicKey.create(obj.signingKey);
      this.exchangeKey = await ECPublicKey.create(obj.exchangeKey);
      this.createdAt = new Date(obj.createdAt);
      const ok = await this.verify();

      if (!ok) {
        throw new Error("Error: Wrong signature for RemoteIdentity");
      }
    }

  }

  let BaseProtocol = (() => {
    let BaseProtocol = class BaseProtocol extends ObjectProto {};

    __decorate([ProtobufProperty({
      id: 0,
      type: "uint32",
      defaultValue: 1
    })], BaseProtocol.prototype, "version", void 0);

    BaseProtocol = __decorate([ProtobufElement({
      name: "Base"
    })], BaseProtocol);
    return BaseProtocol;
  })();

  class ECDSAPublicKeyConverter {
    static async set(value) {
      return new Uint8Array(value.serialize());
    }

    static async get(value) {
      return ECPublicKey.importKey(value.buffer, "ECDSA");
    }

  }

  class ECDHPublicKeyConverter {
    static async set(value) {
      return new Uint8Array(value.serialize());
    }

    static async get(value) {
      return ECPublicKey.importKey(value.buffer, "ECDH");
    }

  }

  class DateConverter {
    static async set(value) {
      return new Uint8Array(Convert.FromString(value.toISOString()));
    }

    static async get(value) {
      return new Date(Convert.ToString(value));
    }

  }

  let IdentityProtocol = (() => {
    var IdentityProtocol_1;
    let IdentityProtocol = IdentityProtocol_1 = class IdentityProtocol extends BaseProtocol {
      static async fill(identity) {
        const res = new IdentityProtocol_1();
        await res.fill(identity);
        return res;
      }

      async sign(key) {
        this.signature = await Curve.sign(key, this.exchangeKey.serialize());
      }

      async verify() {
        return await Curve.verify(this.signingKey, this.exchangeKey.serialize(), this.signature);
      }

      async fill(identity) {
        this.signingKey = identity.signingKey.publicKey;
        this.exchangeKey = identity.exchangeKey.publicKey;
        this.createdAt = identity.createdAt;
        await this.sign(identity.signingKey.privateKey);
      }

    };

    __decorate([ProtobufProperty({
      id: 1,
      converter: ECDSAPublicKeyConverter
    })], IdentityProtocol.prototype, "signingKey", void 0);

    __decorate([ProtobufProperty({
      id: 2,
      converter: ECDHPublicKeyConverter
    })], IdentityProtocol.prototype, "exchangeKey", void 0);

    __decorate([ProtobufProperty({
      id: 3
    })], IdentityProtocol.prototype, "signature", void 0);

    __decorate([ProtobufProperty({
      id: 4,
      converter: DateConverter
    })], IdentityProtocol.prototype, "createdAt", void 0);

    IdentityProtocol = IdentityProtocol_1 = __decorate([ProtobufElement({
      name: "Identity"
    })], IdentityProtocol);
    return IdentityProtocol;
  })();

  let MessageProtocol = (() => {
    let MessageProtocol = class MessageProtocol extends BaseProtocol {};

    __decorate([ProtobufProperty({
      id: 1,
      converter: ECDHPublicKeyConverter,
      required: true
    })], MessageProtocol.prototype, "senderRatchetKey", void 0);

    __decorate([ProtobufProperty({
      id: 2,
      type: "uint32",
      required: true
    })], MessageProtocol.prototype, "counter", void 0);

    __decorate([ProtobufProperty({
      id: 3,
      type: "uint32",
      required: true
    })], MessageProtocol.prototype, "previousCounter", void 0);

    __decorate([ProtobufProperty({
      id: 4,
      converter: ArrayBufferConverter,
      required: true
    })], MessageProtocol.prototype, "cipherText", void 0);

    MessageProtocol = __decorate([ProtobufElement({
      name: "Message"
    })], MessageProtocol);
    return MessageProtocol;
  })();

  let MessageSignedProtocol = (() => {
    let MessageSignedProtocol = class MessageSignedProtocol extends BaseProtocol {
      async sign(hmacKey) {
        this.signature = await this.signHMAC(hmacKey);
      }

      async verify(hmacKey) {
        const signature = await this.signHMAC(hmacKey);
        return isEqual(signature, this.signature);
      }

      async getSignedRaw() {
        const receiverKey = this.receiverKey.serialize();
        const senderKey = this.senderKey.serialize();
        const message = await this.message.exportProto();
        const data = combine(receiverKey, senderKey, message);
        return data;
      }

      async signHMAC(macKey) {
        const data = await this.getSignedRaw();
        const signature = await Secret.sign(macKey, data);
        return signature;
      }

    };

    __decorate([ProtobufProperty({
      id: 1,
      converter: ECDSAPublicKeyConverter,
      required: true
    })], MessageSignedProtocol.prototype, "senderKey", void 0);

    __decorate([ProtobufProperty({
      id: 2,
      parser: MessageProtocol,
      required: true
    })], MessageSignedProtocol.prototype, "message", void 0);

    __decorate([ProtobufProperty({
      id: 3,
      required: true
    })], MessageSignedProtocol.prototype, "signature", void 0);

    MessageSignedProtocol = __decorate([ProtobufElement({
      name: "MessageSigned"
    })], MessageSignedProtocol);
    return MessageSignedProtocol;
  })();

  let PreKeyMessageProtocol = (() => {
    let PreKeyMessageProtocol = class PreKeyMessageProtocol extends BaseProtocol {};

    __decorate([ProtobufProperty({
      id: 1,
      type: "uint32",
      required: true
    })], PreKeyMessageProtocol.prototype, "registrationId", void 0);

    __decorate([ProtobufProperty({
      id: 2,
      type: "uint32"
    })], PreKeyMessageProtocol.prototype, "preKeyId", void 0);

    __decorate([ProtobufProperty({
      id: 3,
      type: "uint32",
      required: true
    })], PreKeyMessageProtocol.prototype, "preKeySignedId", void 0);

    __decorate([ProtobufProperty({
      id: 4,
      converter: ECDHPublicKeyConverter,
      required: true
    })], PreKeyMessageProtocol.prototype, "baseKey", void 0);

    __decorate([ProtobufProperty({
      id: 5,
      parser: IdentityProtocol,
      required: true
    })], PreKeyMessageProtocol.prototype, "identity", void 0);

    __decorate([ProtobufProperty({
      id: 6,
      parser: MessageSignedProtocol,
      required: true
    })], PreKeyMessageProtocol.prototype, "signedMessage", void 0);

    PreKeyMessageProtocol = __decorate([ProtobufElement({
      name: "PreKeyMessage"
    })], PreKeyMessageProtocol);
    return PreKeyMessageProtocol;
  })();

  let PreKeyProtocol = (() => {
    let PreKeyProtocol = class PreKeyProtocol extends BaseProtocol {};

    __decorate([ProtobufProperty({
      id: 1,
      type: "uint32",
      required: true
    })], PreKeyProtocol.prototype, "id", void 0);

    __decorate([ProtobufProperty({
      id: 2,
      converter: ECDHPublicKeyConverter,
      required: true
    })], PreKeyProtocol.prototype, "key", void 0);

    PreKeyProtocol = __decorate([ProtobufElement({
      name: "PreKey"
    })], PreKeyProtocol);
    return PreKeyProtocol;
  })();

  let PreKeySignedProtocol = (() => {
    let PreKeySignedProtocol = class PreKeySignedProtocol extends PreKeyProtocol {
      async sign(key) {
        this.signature = await Curve.sign(key, this.key.serialize());
      }

      verify(key) {
        return Curve.verify(key, this.key.serialize(), this.signature);
      }

    };

    __decorate([ProtobufProperty({
      id: 3,
      converter: ArrayBufferConverter,
      required: true
    })], PreKeySignedProtocol.prototype, "signature", void 0);

    PreKeySignedProtocol = __decorate([ProtobufElement({
      name: "PreKeySigned"
    })], PreKeySignedProtocol);
    return PreKeySignedProtocol;
  })();

  let PreKeyBundleProtocol = (() => {
    let PreKeyBundleProtocol = class PreKeyBundleProtocol extends BaseProtocol {};

    __decorate([ProtobufProperty({
      id: 1,
      type: "uint32",
      required: true
    })], PreKeyBundleProtocol.prototype, "registrationId", void 0);

    __decorate([ProtobufProperty({
      id: 2,
      parser: IdentityProtocol,
      required: true
    })], PreKeyBundleProtocol.prototype, "identity", void 0);

    __decorate([ProtobufProperty({
      id: 3,
      parser: PreKeyProtocol
    })], PreKeyBundleProtocol.prototype, "preKey", void 0);

    __decorate([ProtobufProperty({
      id: 4,
      parser: PreKeySignedProtocol,
      required: true
    })], PreKeyBundleProtocol.prototype, "preKeySigned", void 0);

    PreKeyBundleProtocol = __decorate([ProtobufElement({
      name: "PreKeyBundle"
    })], PreKeyBundleProtocol);
    return PreKeyBundleProtocol;
  })();

  class Stack {
    constructor(maxSize = 20) {
      this.items = [];
      this.maxSize = maxSize;
    }

    get length() {
      return this.items.length;
    }

    get latest() {
      return this.items[this.length - 1];
    }

    push(item) {
      if (this.length === this.maxSize) {
        this.items = this.items.slice(1);
      }

      this.items.push(item);
    }

    async toJSON() {
      const res = [];

      for (const item of this.items) {
        res.push(await item.toJSON());
      }

      return res;
    }

    async fromJSON(obj) {
      this.items = obj;
    }

  }

  const CIPHER_KEY_KDF_INPUT = new Uint8Array([1]).buffer;
  const ROOT_KEY_KDF_INPUT = new Uint8Array([2]).buffer;

  class SymmetricRatchet {
    constructor(rootKey) {
      this.counter = 0;
      this.rootKey = rootKey;
    }

    static async fromJSON(obj) {
      const res = new this(obj.rootKey);
      res.fromJSON(obj);
      return res;
    }

    async toJSON() {
      return {
        counter: this.counter,
        rootKey: this.rootKey
      };
    }

    async fromJSON(obj) {
      this.counter = obj.counter;
      this.rootKey = obj.rootKey;
    }

    async calculateKey(rootKey) {
      const cipherKeyBytes = await Secret.sign(rootKey, CIPHER_KEY_KDF_INPUT);
      const nextRootKeyBytes = await Secret.sign(rootKey, ROOT_KEY_KDF_INPUT);
      const res = {
        cipher: cipherKeyBytes,
        rootKey: await Secret.importHMAC(nextRootKeyBytes)
      };
      return res;
    }

    async click() {
      const rootKey = this.rootKey;
      const res = await this.calculateKey(rootKey);
      this.rootKey = res.rootKey;
      this.counter++;
      return res.cipher;
    }

  }

  class SendingRatchet extends SymmetricRatchet {
    async encrypt(message) {
      const cipherKey = await this.click();
      const keys = await Secret.HKDF(cipherKey, 3, void 0, INFO_MESSAGE_KEYS);
      const aesKey = await Secret.importAES(keys[0]);
      const hmacKey = await Secret.importHMAC(keys[1]);
      const iv = keys[2].slice(0, 16);
      const cipherText = await Secret.encrypt(aesKey, message, iv);
      return {
        cipherText,
        hmacKey
      };
    }

  }

  class ReceivingRatchet extends SymmetricRatchet {
    constructor() {
      super(...arguments);
      this.keys = [];
    }

    async toJSON() {
      const res = await super.toJSON();
      res.keys = this.keys;
      return res;
    }

    async fromJSON(obj) {
      await super.fromJSON(obj);
      this.keys = obj.keys;
    }

    async decrypt(message, counter) {
      const cipherKey = await this.getKey(counter);
      const keys = await Secret.HKDF(cipherKey, 3, void 0, INFO_MESSAGE_KEYS);
      const aesKey = await Secret.importAES(keys[0]);
      const hmacKey = await Secret.importHMAC(keys[1]);
      const iv = keys[2].slice(0, 16);
      const cipherText = await Secret.decrypt(aesKey, message, iv);
      return {
        cipherText,
        hmacKey
      };
    }

    async getKey(counter) {
      while (this.counter <= counter) {
        const cipherKey = await this.click();
        this.keys.push(cipherKey);
      }

      const key = this.keys[counter];
      return key;
    }

  }

  async function authenticateA(IKa, EKa, IKb, SPKb, OPKb) {
    const DH1 = await Curve.deriveBytes(IKa.exchangeKey.privateKey, SPKb);
    const DH2 = await Curve.deriveBytes(EKa.privateKey, IKb);
    const DH3 = await Curve.deriveBytes(EKa.privateKey, SPKb);
    let DH4 = new ArrayBuffer(0);

    if (OPKb) {
      DH4 = await Curve.deriveBytes(EKa.privateKey, OPKb);
    }

    const _F = new Uint8Array(32);

    for (let i = 0; i < _F.length; i++) {
      _F[i] = 0xff;
    }

    const F = _F.buffer;
    const KM = combine(F, DH1, DH2, DH3, DH4);
    const keys = await Secret.HKDF(KM, 1, void 0, INFO_TEXT);
    return await Secret.importHMAC(keys[0]);
  }

  async function authenticateB(IKb, SPKb, IKa, EKa, OPKb) {
    const DH1 = await Curve.deriveBytes(SPKb.privateKey, IKa);
    const DH2 = await Curve.deriveBytes(IKb.exchangeKey.privateKey, EKa);
    const DH3 = await Curve.deriveBytes(SPKb.privateKey, EKa);
    let DH4 = new ArrayBuffer(0);

    if (OPKb) {
      DH4 = await Curve.deriveBytes(OPKb, EKa);
    }

    const _F = new Uint8Array(32);

    for (let i = 0; i < _F.length; i++) {
      _F[i] = 0xff;
    }

    const F = _F.buffer;
    const KM = combine(F, DH1, DH2, DH3, DH4);
    const keys = await Secret.HKDF(KM, 1, void 0, INFO_TEXT);
    return await Secret.importHMAC(keys[0]);
  }

  class AsymmetricRatchet extends EventEmitter {
    constructor(options = {}) {
      super();
      this.options = options;
      this.counter = 0;
      this.currentStep = new DHRatchetStep();
      this.steps = new DHRatchetStepStack(MAX_RATCHET_STACK_SIZE);
      this.promises = {};
    }

    static async create(identity, protocol, options = {}) {
      let rootKey;
      const ratchet = new AsymmetricRatchet(options);

      if (protocol instanceof PreKeyBundleProtocol) {
        if (!(await protocol.identity.verify())) {
          throw new Error("Error: Remote client's identity key is invalid.");
        }

        if (!(await protocol.preKeySigned.verify(protocol.identity.signingKey))) {
          throw new Error("Error: Remote client's signed prekey is invalid.");
        }

        ratchet.currentRatchetKey = await ratchet.generateRatchetKey();
        ratchet.currentStep.remoteRatchetKey = protocol.preKeySigned.key;
        ratchet.remoteIdentity = RemoteIdentity.fill(protocol.identity);
        ratchet.remoteIdentity.id = protocol.registrationId;
        ratchet.remotePreKeyId = protocol.preKey.id;
        ratchet.remotePreKeySignedId = protocol.preKeySigned.id;
        rootKey = await authenticateA(identity, ratchet.currentRatchetKey, protocol.identity.exchangeKey, protocol.preKeySigned.key, protocol.preKey.key);
      } else {
        if (!(await protocol.identity.verify())) {
          throw new Error("Error: Remote client's identity key is invalid.");
        }

        const signedPreKey = identity.signedPreKeys[protocol.preKeySignedId];

        if (!signedPreKey) {
          throw new Error(`Error: PreKey with id ${protocol.preKeySignedId} not found`);
        }

        let preKey;

        if (protocol.preKeyId !== void 0) {
          preKey = identity.preKeys[protocol.preKeyId];
        }

        ratchet.remoteIdentity = RemoteIdentity.fill(protocol.identity);
        ratchet.currentRatchetKey = signedPreKey;
        rootKey = await authenticateB(identity, ratchet.currentRatchetKey, protocol.identity.exchangeKey, protocol.signedMessage.message.senderRatchetKey, preKey && preKey.privateKey);
      }

      ratchet.identity = identity;
      ratchet.id = identity.id;
      ratchet.rootKey = rootKey;
      return ratchet;
    }

    static async fromJSON(identity, remote, obj) {
      const res = new AsymmetricRatchet();
      res.identity = identity;
      res.remoteIdentity = remote;
      await res.fromJSON(obj);
      return res;
    }

    on(event, listener) {
      return super.on(event, listener);
    }

    once(event, listener) {
      return super.once(event, listener);
    }

    async decrypt(protocol) {
      return this.queuePromise("encrypt", async () => {
        const remoteRatchetKey = protocol.message.senderRatchetKey;
        const message = protocol.message;

        if (protocol.message.previousCounter < this.counter - MAX_RATCHET_STACK_SIZE) {
          throw new Error("Error: Too old message");
        }

        let step = this.steps.getStep(remoteRatchetKey);

        if (!step) {
          const ratchetStep = new DHRatchetStep();
          ratchetStep.remoteRatchetKey = remoteRatchetKey;
          this.steps.push(ratchetStep);
          this.currentStep = ratchetStep;
          step = ratchetStep;
        }

        if (!step.receivingChain) {
          step.receivingChain = await this.createChain(this.currentRatchetKey.privateKey, remoteRatchetKey, ReceivingRatchet);
        }

        const decryptedMessage = await step.receivingChain.decrypt(message.cipherText, message.counter);
        this.update();
        protocol.senderKey = this.remoteIdentity.signingKey;
        protocol.receiverKey = this.identity.signingKey.publicKey;

        if (!(await protocol.verify(decryptedMessage.hmacKey))) {
          throw new Error("Error: The Message did not successfully verify!");
        }

        return decryptedMessage.cipherText;
      });
    }

    async encrypt(message) {
      return this.queuePromise("encrypt", async () => {
        if (this.currentStep.receivingChain && !this.currentStep.sendingChain) {
          this.counter++;
          this.currentRatchetKey = await this.generateRatchetKey();
        }

        if (!this.currentStep.sendingChain) {
          if (!this.currentStep.remoteRatchetKey) {
            throw new Error("currentStep has empty remoteRatchetKey");
          }

          this.currentStep.sendingChain = await this.createChain(this.currentRatchetKey.privateKey, this.currentStep.remoteRatchetKey, SendingRatchet);
        }

        const encryptedMessage = await this.currentStep.sendingChain.encrypt(message);
        this.update();
        let preKeyMessage;

        if (this.steps.length === 0 && !this.currentStep.receivingChain && this.currentStep.sendingChain.counter === 1) {
          preKeyMessage = new PreKeyMessageProtocol();
          preKeyMessage.registrationId = this.identity.id;
          preKeyMessage.preKeyId = this.remotePreKeyId;
          preKeyMessage.preKeySignedId = this.remotePreKeySignedId;
          preKeyMessage.baseKey = this.currentRatchetKey.publicKey;
          await preKeyMessage.identity.fill(this.identity);
        }

        const signedMessage = new MessageSignedProtocol();
        signedMessage.receiverKey = this.remoteIdentity.signingKey;
        signedMessage.senderKey = this.identity.signingKey.publicKey;
        signedMessage.message.cipherText = encryptedMessage.cipherText;
        signedMessage.message.counter = this.currentStep.sendingChain.counter - 1;
        signedMessage.message.previousCounter = this.counter;
        signedMessage.message.senderRatchetKey = this.currentRatchetKey.publicKey;
        await signedMessage.sign(encryptedMessage.hmacKey);

        if (preKeyMessage) {
          preKeyMessage.signedMessage = signedMessage;
          return preKeyMessage;
        } else {
          return signedMessage;
        }
      });
    }

    async hasRatchetKey(key) {
      let ecKey;

      if (!(key instanceof ECPublicKey)) {
        ecKey = await ECPublicKey.create(key);
      } else {
        ecKey = key;
      }

      for (const item of this.steps.items) {
        if (await item.remoteRatchetKey.isEqual(ecKey)) {
          return true;
        }
      }

      return false;
    }

    async toJSON() {
      return {
        counter: this.counter,
        ratchetKey: await Curve.ecKeyPairToJson(this.currentRatchetKey),
        remoteIdentity: await this.remoteIdentity.signingKey.thumbprint(),
        rootKey: this.rootKey,
        steps: await this.steps.toJSON()
      };
    }

    async fromJSON(obj) {
      this.currentRatchetKey = await Curve.ecKeyPairFromJson(obj.ratchetKey);
      this.counter = obj.counter;
      this.rootKey = obj.rootKey;

      for (const step of obj.steps) {
        this.currentStep = await DHRatchetStep.fromJSON(step);
        this.steps.push(this.currentStep);
      }
    }

    update() {
      this.emit("update");
    }

    generateRatchetKey() {
      return Curve.generateKeyPair("ECDH", !!this.options.exportableKeys);
    }

    async createChain(ourRatchetKey, theirRatchetKey, ratchetClass) {
      const derivedBytes = await Curve.deriveBytes(ourRatchetKey, theirRatchetKey);
      const keys = await Secret.HKDF(derivedBytes, 2, this.rootKey, INFO_RATCHET);
      const rootKey = await Secret.importHMAC(keys[0]);
      const chainKey = await Secret.importHMAC(keys[1]);
      const chain = new ratchetClass(chainKey);
      this.rootKey = rootKey;
      return chain;
    }

    queuePromise(key, fn) {
      const prev = this.promises[key] || Promise.resolve();
      const cur = this.promises[key] = prev.then(fn, fn);
      cur.then(() => {
        if (this.promises[key] === cur) {
          delete this.promises[key];
        }
      });
      return cur;
    }

  }

  class DHRatchetStep {
    static async fromJSON(obj) {
      const res = new this();
      await res.fromJSON(obj);
      return res;
    }

    async toJSON() {
      const res = {};

      if (this.remoteRatchetKey) {
        res.remoteRatchetKey = this.remoteRatchetKey.key;
      }

      if (this.sendingChain) {
        res.sendingChain = await this.sendingChain.toJSON();
      }

      if (this.receivingChain) {
        res.receivingChain = await this.receivingChain.toJSON();
      }

      return res;
    }

    async fromJSON(obj) {
      if (obj.remoteRatchetKey) {
        this.remoteRatchetKey = await ECPublicKey.create(obj.remoteRatchetKey);
      }

      if (obj.sendingChain) {
        this.sendingChain = await SendingRatchet.fromJSON(obj.sendingChain);
      }

      if (obj.receivingChain) {
        this.receivingChain = await ReceivingRatchet.fromJSON(obj.receivingChain);
      }
    }

  }

  class DHRatchetStepStack extends Stack {
    getStep(remoteRatchetKey) {
      let found;
      this.items.some(step => {
        if (step.remoteRatchetKey.id === remoteRatchetKey.id) {
          found = step;
        }

        return !!found;
      });
      return found;
    }

  }
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */


  function __decorate$1(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  class DateConverter$1 {
    static async set(value) {
      return new Uint8Array(Convert.FromUtf8String(value.toISOString()));
    }

    static async get(value) {
      return new Date(Convert.ToUtf8String(value));
    }

  }

  class HexStringConverter {
    static async set(value) {
      return new Uint8Array(Convert.FromHex(value));
    }

    static async get(value) {
      return Convert.ToHex(value);
    }

  }

  let BaseProto = (() => {
    var BaseProto_1;
    let BaseProto = BaseProto_1 = class BaseProto extends ObjectProto {};
    BaseProto.INDEX = 1;

    __decorate$1([ProtobufProperty({
      id: BaseProto_1.INDEX++,
      type: "uint32",
      required: true,
      defaultValue: 1
    })], BaseProto.prototype, "version", void 0);

    BaseProto = BaseProto_1 = __decorate$1([ProtobufElement({
      name: "BaseMessage"
    })], BaseProto);
    return BaseProto;
  })();

  let ActionProto = (() => {
    var ActionProto_1;
    let ActionProto = ActionProto_1 = class ActionProto extends BaseProto {
      constructor() {
        super();
        this.action = this.constructor.ACTION;
      }

    };
    ActionProto.INDEX = BaseProto.INDEX;
    ActionProto.ACTION = "action";

    __decorate$1([ProtobufProperty({
      id: ActionProto_1.INDEX++,
      type: "string",
      required: true
    })], ActionProto.prototype, "action", void 0);

    __decorate$1([ProtobufProperty({
      id: ActionProto_1.INDEX++,
      type: "string",
      required: false
    })], ActionProto.prototype, "actionId", void 0);

    ActionProto = ActionProto_1 = __decorate$1([ProtobufElement({
      name: "Action"
    })], ActionProto);
    return ActionProto;
  })();

  let BaseAlgorithmProto = (() => {
    var BaseAlgorithmProto_1;
    let BaseAlgorithmProto = BaseAlgorithmProto_1 = class BaseAlgorithmProto extends BaseProto {
      toAlgorithm() {
        return {
          name: this.name
        };
      }

      fromAlgorithm(alg) {
        this.name = alg.name;
      }

    };
    BaseAlgorithmProto.INDEX = BaseProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: BaseAlgorithmProto_1.INDEX++,
      type: "string",
      required: true
    })], BaseAlgorithmProto.prototype, "name", void 0);

    BaseAlgorithmProto = BaseAlgorithmProto_1 = __decorate$1([ProtobufElement({
      name: "BaseAlgorithm"
    })], BaseAlgorithmProto);
    return BaseAlgorithmProto;
  })();

  let AlgorithmProto = (() => {
    var AlgorithmProto_1;
    let AlgorithmProto = AlgorithmProto_1 = class AlgorithmProto extends BaseAlgorithmProto {
      toAlgorithm() {
        const res = {};
        const thisStatic = this.constructor;

        for (const key in thisStatic.items) {
          if (key === "version") {
            continue;
          }

          const value = this[key];

          if (key === "labelStr") {
            res.label = value;
            continue;
          }

          if (value !== void 0) {
            if (value instanceof BaseAlgorithmProto) {
              if (!value.isEmpty()) {
                res[key] = value.toAlgorithm();
              }
            } else {
              res[key] = value;
            }
          }
        }

        return res;
      }

      fromAlgorithm(alg) {
        if (alg instanceof AlgorithmProto_1) {
          alg = alg.toAlgorithm();
        }

        const thisStatic = this.constructor;

        for (const key in alg) {
          if (!thisStatic.items) {
            continue;
          }

          if (key in thisStatic.items) {
            const item = thisStatic.items[key];

            if (item.parser) {
              switch (item.parser) {
                case BaseAlgorithmProto:
                  {
                    this[key].fromAlgorithm(alg[key]);
                    break;
                  }

                default:
                  throw new Error(`Unsupported parser '${item.parser.name}'`);
              }
            } else {
              if (key === "label" && typeof alg.label === "string") {
                this.labelStr = alg.label;
              } else {
                this[key] = alg[key];
              }
            }
          }
        }
      }

    };
    AlgorithmProto.INDEX = BaseAlgorithmProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: AlgorithmProto_1.INDEX++,
      type: "bytes",
      parser: BaseAlgorithmProto
    })], AlgorithmProto.prototype, "hash", void 0);

    __decorate$1([ProtobufProperty({
      id: AlgorithmProto_1.INDEX++,
      type: "bytes"
    })], AlgorithmProto.prototype, "publicExponent", void 0);

    __decorate$1([ProtobufProperty({
      id: AlgorithmProto_1.INDEX++,
      type: "uint32"
    })], AlgorithmProto.prototype, "modulusLength", void 0);

    __decorate$1([ProtobufProperty({
      id: AlgorithmProto_1.INDEX++,
      type: "uint32"
    })], AlgorithmProto.prototype, "saltLength", void 0);

    __decorate$1([ProtobufProperty({
      id: AlgorithmProto_1.INDEX++,
      type: "bytes"
    })], AlgorithmProto.prototype, "label", void 0);

    __decorate$1([ProtobufProperty({
      id: AlgorithmProto_1.INDEX++,
      type: "string"
    })], AlgorithmProto.prototype, "namedCurve", void 0);

    __decorate$1([ProtobufProperty({
      id: AlgorithmProto_1.INDEX++,
      converter: ArrayBufferConverter
    })], AlgorithmProto.prototype, "public", void 0);

    __decorate$1([ProtobufProperty({
      id: AlgorithmProto_1.INDEX++,
      type: "uint32"
    })], AlgorithmProto.prototype, "length", void 0);

    __decorate$1([ProtobufProperty({
      id: AlgorithmProto_1.INDEX++
    })], AlgorithmProto.prototype, "iv", void 0);

    __decorate$1([ProtobufProperty({
      id: AlgorithmProto_1.INDEX++,
      type: "bool"
    })], AlgorithmProto.prototype, "token", void 0);

    __decorate$1([ProtobufProperty({
      id: AlgorithmProto_1.INDEX++,
      type: "bool"
    })], AlgorithmProto.prototype, "sensitive", void 0);

    __decorate$1([ProtobufProperty({
      id: AlgorithmProto_1.INDEX++,
      type: "string"
    })], AlgorithmProto.prototype, "labelStr", void 0);

    AlgorithmProto = AlgorithmProto_1 = __decorate$1([ProtobufElement({
      name: "Algorithm"
    })], AlgorithmProto);
    return AlgorithmProto;
  })();

  let CryptoItemProto = (() => {
    var CryptoItemProto_1;
    let CryptoItemProto = CryptoItemProto_1 = class CryptoItemProto extends BaseProto {};
    CryptoItemProto.INDEX = BaseProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: CryptoItemProto_1.INDEX++,
      type: "string",
      required: true
    })], CryptoItemProto.prototype, "providerID", void 0);

    __decorate$1([ProtobufProperty({
      id: CryptoItemProto_1.INDEX++,
      type: "bytes",
      required: true,
      converter: HexStringConverter
    })], CryptoItemProto.prototype, "id", void 0);

    __decorate$1([ProtobufProperty({
      id: CryptoItemProto_1.INDEX++,
      type: "string",
      required: true
    })], CryptoItemProto.prototype, "type", void 0);

    CryptoItemProto = CryptoItemProto_1 = __decorate$1([ProtobufElement({
      name: "CryptoItem"
    })], CryptoItemProto);
    return CryptoItemProto;
  })();

  let CryptoKeyProto = (() => {
    var CryptoKeyProto_1;
    let CryptoKeyProto = CryptoKeyProto_1 = class CryptoKeyProto extends CryptoItemProto {};
    CryptoKeyProto.INDEX = CryptoItemProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: CryptoKeyProto_1.INDEX++,
      type: "bytes",
      required: true,
      parser: AlgorithmProto
    })], CryptoKeyProto.prototype, "algorithm", void 0);

    __decorate$1([ProtobufProperty({
      id: CryptoKeyProto_1.INDEX++,
      type: "bool"
    })], CryptoKeyProto.prototype, "extractable", void 0);

    __decorate$1([ProtobufProperty({
      id: CryptoKeyProto_1.INDEX++,
      type: "string",
      repeated: true
    })], CryptoKeyProto.prototype, "usages", void 0);

    CryptoKeyProto = CryptoKeyProto_1 = __decorate$1([ProtobufElement({
      name: "CryptoKey"
    })], CryptoKeyProto);
    return CryptoKeyProto;
  })();

  let CryptoKeyPairProto = (() => {
    var CryptoKeyPairProto_1;
    let CryptoKeyPairProto = CryptoKeyPairProto_1 = class CryptoKeyPairProto extends BaseProto {};
    CryptoKeyPairProto.INDEX = BaseProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: CryptoKeyPairProto_1.INDEX++,
      name: "privateKey",
      type: "bytes",
      parser: CryptoKeyProto
    })], CryptoKeyPairProto.prototype, "privateKey", void 0);

    __decorate$1([ProtobufProperty({
      id: CryptoKeyPairProto_1.INDEX++,
      name: "publicKey",
      type: "bytes",
      parser: CryptoKeyProto
    })], CryptoKeyPairProto.prototype, "publicKey", void 0);

    CryptoKeyPairProto = CryptoKeyPairProto_1 = __decorate$1([ProtobufElement({
      name: "CryptoKeyPair"
    })], CryptoKeyPairProto);
    return CryptoKeyPairProto;
  })();

  let ErrorProto = (() => {
    var ErrorProto_1;
    let ErrorProto = ErrorProto_1 = class ErrorProto extends BaseProto {
      constructor(message, code = 0, type = "error") {
        super();

        if (message) {
          this.message = message;
          this.code = code;
          this.type = type;
        }
      }

    };
    ErrorProto.INDEX = BaseProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: ErrorProto_1.INDEX++,
      type: "uint32",
      defaultValue: 0
    })], ErrorProto.prototype, "code", void 0);

    __decorate$1([ProtobufProperty({
      id: ErrorProto_1.INDEX++,
      type: "string",
      defaultValue: "error"
    })], ErrorProto.prototype, "type", void 0);

    __decorate$1([ProtobufProperty({
      id: ErrorProto_1.INDEX++,
      type: "string",
      defaultValue: ""
    })], ErrorProto.prototype, "message", void 0);

    __decorate$1([ProtobufProperty({
      id: ErrorProto_1.INDEX++,
      type: "string",
      defaultValue: "Error"
    })], ErrorProto.prototype, "name", void 0);

    __decorate$1([ProtobufProperty({
      id: ErrorProto_1.INDEX++,
      type: "string",
      defaultValue: ""
    })], ErrorProto.prototype, "stack", void 0);

    ErrorProto = ErrorProto_1 = __decorate$1([ProtobufElement({
      name: "Error"
    })], ErrorProto);
    return ErrorProto;
  })();

  let ResultProto = (() => {
    var ResultProto_1;
    let ResultProto = ResultProto_1 = class ResultProto extends ActionProto {
      constructor(proto) {
        super();

        if (proto) {
          this.actionId = proto.actionId;
          this.action = proto.action;
        }
      }

    };
    ResultProto.INDEX = ActionProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: ResultProto_1.INDEX++,
      type: "bool",
      defaultValue: false
    })], ResultProto.prototype, "status", void 0);

    __decorate$1([ProtobufProperty({
      id: ResultProto_1.INDEX++,
      type: "bytes",
      parser: ErrorProto
    })], ResultProto.prototype, "error", void 0);

    __decorate$1([ProtobufProperty({
      id: ResultProto_1.INDEX++,
      type: "bytes",
      converter: ArrayBufferConverter
    })], ResultProto.prototype, "data", void 0);

    ResultProto = ResultProto_1 = __decorate$1([ProtobufElement({
      name: "Result"
    })], ResultProto);
    return ResultProto;
  })();

  let AuthRequestProto = (() => {
    let AuthRequestProto = class AuthRequestProto extends ActionProto {};
    AuthRequestProto.INDEX = ActionProto.INDEX;
    AuthRequestProto.ACTION = "auth";
    AuthRequestProto = __decorate$1([ProtobufElement({
      name: "AuthRequest"
    })], AuthRequestProto);
    return AuthRequestProto;
  })();

  let ServerLoginActionProto = (() => {
    let ServerLoginActionProto = class ServerLoginActionProto extends ActionProto {};
    ServerLoginActionProto.INDEX = ActionProto.INDEX;
    ServerLoginActionProto.ACTION = "server/login";
    ServerLoginActionProto = __decorate$1([ProtobufElement({})], ServerLoginActionProto);
    return ServerLoginActionProto;
  })();

  let ServerIsLoggedInActionProto = (() => {
    let ServerIsLoggedInActionProto = class ServerIsLoggedInActionProto extends ActionProto {};
    ServerIsLoggedInActionProto.INDEX = ActionProto.INDEX;
    ServerIsLoggedInActionProto.ACTION = "server/isLoggedIn";
    ServerIsLoggedInActionProto = __decorate$1([ProtobufElement({})], ServerIsLoggedInActionProto);
    return ServerIsLoggedInActionProto;
  })();

  let CardReaderActionProto = (() => {
    let CardReaderActionProto = class CardReaderActionProto extends ActionProto {};
    CardReaderActionProto.INDEX = ActionProto.INDEX;
    CardReaderActionProto.ACTION = "cardReader";
    CardReaderActionProto = __decorate$1([ProtobufElement({})], CardReaderActionProto);
    return CardReaderActionProto;
  })();

  let CardReaderGetReadersActionProto = (() => {
    let CardReaderGetReadersActionProto = class CardReaderGetReadersActionProto extends ActionProto {};
    CardReaderGetReadersActionProto.INDEX = ActionProto.INDEX;
    CardReaderGetReadersActionProto.ACTION = "cardReader/readers";
    CardReaderGetReadersActionProto = __decorate$1([ProtobufElement({})], CardReaderGetReadersActionProto);
    return CardReaderGetReadersActionProto;
  })();

  let CardReaderEventProto = (() => {
    var CardReaderEventProto_1;
    let CardReaderEventProto = CardReaderEventProto_1 = class CardReaderEventProto extends CardReaderActionProto {
      constructor(reader, atr) {
        super();

        if (reader && atr) {
          this.reader = reader;
          this.atr = atr;
        }
      }

    };
    CardReaderEventProto.INDEX = CardReaderActionProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: CardReaderEventProto_1.INDEX++,
      required: true,
      type: "string",
      defaultValue: ""
    })], CardReaderEventProto.prototype, "reader", void 0);

    __decorate$1([ProtobufProperty({
      id: CardReaderEventProto_1.INDEX++,
      required: true,
      converter: HexStringConverter
    })], CardReaderEventProto.prototype, "atr", void 0);

    CardReaderEventProto = CardReaderEventProto_1 = __decorate$1([ProtobufElement({})], CardReaderEventProto);
    return CardReaderEventProto;
  })();

  let CardReaderInsertEventProto = (() => {
    let CardReaderInsertEventProto = class CardReaderInsertEventProto extends CardReaderEventProto {};
    CardReaderInsertEventProto.INDEX = CardReaderEventProto.INDEX;
    CardReaderInsertEventProto.ACTION = CardReaderEventProto.ACTION + "/insert";
    CardReaderInsertEventProto = __decorate$1([ProtobufElement({})], CardReaderInsertEventProto);
    return CardReaderInsertEventProto;
  })();

  let CardReaderRemoveEventProto = (() => {
    let CardReaderRemoveEventProto = class CardReaderRemoveEventProto extends CardReaderEventProto {};
    CardReaderRemoveEventProto.INDEX = CardReaderEventProto.INDEX;
    CardReaderRemoveEventProto.ACTION = CardReaderEventProto.ACTION + "/remove";
    CardReaderRemoveEventProto = __decorate$1([ProtobufElement({})], CardReaderRemoveEventProto);
    return CardReaderRemoveEventProto;
  })();

  let CryptoActionProto = (() => {
    var CryptoActionProto_1;
    let CryptoActionProto = CryptoActionProto_1 = class CryptoActionProto extends ActionProto {};
    CryptoActionProto.INDEX = ActionProto.INDEX;
    CryptoActionProto.ACTION = "crypto";

    __decorate$1([ProtobufProperty({
      id: CryptoActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], CryptoActionProto.prototype, "providerID", void 0);

    CryptoActionProto = CryptoActionProto_1 = __decorate$1([ProtobufElement({})], CryptoActionProto);
    return CryptoActionProto;
  })();

  let LoginActionProto = (() => {
    let LoginActionProto = class LoginActionProto extends CryptoActionProto {};
    LoginActionProto.INDEX = CryptoActionProto.INDEX;
    LoginActionProto.ACTION = "crypto/login";
    LoginActionProto = __decorate$1([ProtobufElement({})], LoginActionProto);
    return LoginActionProto;
  })();

  let LogoutActionProto = (() => {
    let LogoutActionProto = class LogoutActionProto extends CryptoActionProto {};
    LogoutActionProto.INDEX = CryptoActionProto.INDEX;
    LogoutActionProto.ACTION = "crypto/logout";
    LogoutActionProto = __decorate$1([ProtobufElement({})], LogoutActionProto);
    return LogoutActionProto;
  })();

  let IsLoggedInActionProto = (() => {
    let IsLoggedInActionProto = class IsLoggedInActionProto extends CryptoActionProto {};
    IsLoggedInActionProto.INDEX = CryptoActionProto.INDEX;
    IsLoggedInActionProto.ACTION = "crypto/isLoggedIn";
    IsLoggedInActionProto = __decorate$1([ProtobufElement({})], IsLoggedInActionProto);
    return IsLoggedInActionProto;
  })();

  let ResetActionProto = (() => {
    let ResetActionProto = class ResetActionProto extends CryptoActionProto {};
    ResetActionProto.INDEX = CryptoActionProto.INDEX;
    ResetActionProto.ACTION = "crypto/reset";
    ResetActionProto = __decorate$1([ProtobufElement({})], ResetActionProto);
    return ResetActionProto;
  })();

  let CryptoCertificateProto = (() => {
    var CryptoCertificateProto_1;
    let CryptoCertificateProto = CryptoCertificateProto_1 = class CryptoCertificateProto extends CryptoItemProto {
      constructor() {
        super(...arguments);
        this.label = "";
        this.token = false;
        this.sensitive = false;
      }

    };
    CryptoCertificateProto.INDEX = CryptoItemProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: CryptoCertificateProto_1.INDEX++,
      required: true,
      converter: HexStringConverter
    })], CryptoCertificateProto.prototype, "id", void 0);

    __decorate$1([ProtobufProperty({
      id: CryptoCertificateProto_1.INDEX++,
      required: true,
      parser: CryptoKeyProto
    })], CryptoCertificateProto.prototype, "publicKey", void 0);

    __decorate$1([ProtobufProperty({
      id: CryptoCertificateProto_1.INDEX++,
      required: true,
      type: "string"
    })], CryptoCertificateProto.prototype, "type", void 0);

    __decorate$1([ProtobufProperty({
      id: CryptoCertificateProto_1.INDEX++,
      type: "string",
      defaultValue: ""
    })], CryptoCertificateProto.prototype, "label", void 0);

    __decorate$1([ProtobufProperty({
      id: CryptoCertificateProto_1.INDEX++,
      type: "bool",
      defaultValue: false
    })], CryptoCertificateProto.prototype, "token", void 0);

    __decorate$1([ProtobufProperty({
      id: CryptoCertificateProto_1.INDEX++,
      type: "bool",
      defaultValue: false
    })], CryptoCertificateProto.prototype, "sensitive", void 0);

    CryptoCertificateProto = CryptoCertificateProto_1 = __decorate$1([ProtobufElement({})], CryptoCertificateProto);
    return CryptoCertificateProto;
  })();

  let CryptoX509CertificateProto = (() => {
    var CryptoX509CertificateProto_1;
    let CryptoX509CertificateProto = CryptoX509CertificateProto_1 = class CryptoX509CertificateProto extends CryptoCertificateProto {
      constructor() {
        super(...arguments);
        this.type = "x509";
      }

    };
    CryptoX509CertificateProto.INDEX = CryptoCertificateProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: CryptoX509CertificateProto_1.INDEX++,
      required: true,
      converter: HexStringConverter
    })], CryptoX509CertificateProto.prototype, "serialNumber", void 0);

    __decorate$1([ProtobufProperty({
      id: CryptoX509CertificateProto_1.INDEX++,
      required: true,
      type: "string"
    })], CryptoX509CertificateProto.prototype, "issuerName", void 0);

    __decorate$1([ProtobufProperty({
      id: CryptoX509CertificateProto_1.INDEX++,
      required: true,
      type: "string"
    })], CryptoX509CertificateProto.prototype, "subjectName", void 0);

    __decorate$1([ProtobufProperty({
      id: CryptoX509CertificateProto_1.INDEX++,
      required: true,
      converter: DateConverter$1
    })], CryptoX509CertificateProto.prototype, "notBefore", void 0);

    __decorate$1([ProtobufProperty({
      id: CryptoX509CertificateProto_1.INDEX++,
      required: true,
      converter: DateConverter$1
    })], CryptoX509CertificateProto.prototype, "notAfter", void 0);

    CryptoX509CertificateProto = CryptoX509CertificateProto_1 = __decorate$1([ProtobufElement({})], CryptoX509CertificateProto);
    return CryptoX509CertificateProto;
  })();

  let CryptoX509CertificateRequestProto = (() => {
    var CryptoX509CertificateRequestProto_1;
    let CryptoX509CertificateRequestProto = CryptoX509CertificateRequestProto_1 = class CryptoX509CertificateRequestProto extends CryptoCertificateProto {
      constructor() {
        super(...arguments);
        this.type = "request";
      }

    };
    CryptoX509CertificateRequestProto.INDEX = CryptoCertificateProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: CryptoX509CertificateRequestProto_1.INDEX++,
      required: true,
      type: "string"
    })], CryptoX509CertificateRequestProto.prototype, "subjectName", void 0);

    CryptoX509CertificateRequestProto = CryptoX509CertificateRequestProto_1 = __decorate$1([ProtobufElement({})], CryptoX509CertificateRequestProto);
    return CryptoX509CertificateRequestProto;
  })();

  let ChainItemProto = (() => {
    var ChainItemProto_1;
    let ChainItemProto = ChainItemProto_1 = class ChainItemProto extends BaseProto {};
    ChainItemProto.INDEX = BaseProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: ChainItemProto_1.INDEX++,
      required: true,
      type: "string"
    })], ChainItemProto.prototype, "type", void 0);

    __decorate$1([ProtobufProperty({
      id: ChainItemProto_1.INDEX++,
      required: true,
      converter: ArrayBufferConverter
    })], ChainItemProto.prototype, "value", void 0);

    ChainItemProto = ChainItemProto_1 = __decorate$1([ProtobufElement({})], ChainItemProto);
    return ChainItemProto;
  })();

  let CertificateStorageGetChainResultProto = (() => {
    var CertificateStorageGetChainResultProto_1;
    let CertificateStorageGetChainResultProto = CertificateStorageGetChainResultProto_1 = class CertificateStorageGetChainResultProto extends BaseProto {
      constructor() {
        super(...arguments);
        this.items = [];
      }

    };
    CertificateStorageGetChainResultProto.INDEX = BaseProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: CertificateStorageGetChainResultProto_1.INDEX++,
      required: true,
      repeated: true,
      parser: ChainItemProto
    })], CertificateStorageGetChainResultProto.prototype, "items", void 0);

    CertificateStorageGetChainResultProto = CertificateStorageGetChainResultProto_1 = __decorate$1([ProtobufElement({})], CertificateStorageGetChainResultProto);
    return CertificateStorageGetChainResultProto;
  })();

  let CertificateStorageSetItemActionProto = (() => {
    var CertificateStorageSetItemActionProto_1;
    let CertificateStorageSetItemActionProto = CertificateStorageSetItemActionProto_1 = class CertificateStorageSetItemActionProto extends CryptoActionProto {};
    CertificateStorageSetItemActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageSetItemActionProto.ACTION = "crypto/certificateStorage/setItem";

    __decorate$1([ProtobufProperty({
      id: CertificateStorageSetItemActionProto_1.INDEX++,
      required: true,
      parser: CryptoCertificateProto
    })], CertificateStorageSetItemActionProto.prototype, "item", void 0);

    CertificateStorageSetItemActionProto = CertificateStorageSetItemActionProto_1 = __decorate$1([ProtobufElement({})], CertificateStorageSetItemActionProto);
    return CertificateStorageSetItemActionProto;
  })();

  let CertificateStorageGetItemActionProto = (() => {
    var CertificateStorageGetItemActionProto_1;
    let CertificateStorageGetItemActionProto = CertificateStorageGetItemActionProto_1 = class CertificateStorageGetItemActionProto extends CryptoActionProto {};
    CertificateStorageGetItemActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageGetItemActionProto.ACTION = "crypto/certificateStorage/getItem";

    __decorate$1([ProtobufProperty({
      id: CertificateStorageGetItemActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], CertificateStorageGetItemActionProto.prototype, "key", void 0);

    __decorate$1([ProtobufProperty({
      id: CertificateStorageGetItemActionProto_1.INDEX++,
      parser: AlgorithmProto
    })], CertificateStorageGetItemActionProto.prototype, "algorithm", void 0);

    __decorate$1([ProtobufProperty({
      id: CertificateStorageGetItemActionProto_1.INDEX++,
      repeated: true,
      type: "string"
    })], CertificateStorageGetItemActionProto.prototype, "keyUsages", void 0);

    CertificateStorageGetItemActionProto = CertificateStorageGetItemActionProto_1 = __decorate$1([ProtobufElement({})], CertificateStorageGetItemActionProto);
    return CertificateStorageGetItemActionProto;
  })();

  let CertificateStorageKeysActionProto = (() => {
    let CertificateStorageKeysActionProto = class CertificateStorageKeysActionProto extends CryptoActionProto {};
    CertificateStorageKeysActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageKeysActionProto.ACTION = "crypto/certificateStorage/keys";
    CertificateStorageKeysActionProto = __decorate$1([ProtobufElement({})], CertificateStorageKeysActionProto);
    return CertificateStorageKeysActionProto;
  })();

  let CertificateStorageRemoveItemActionProto = (() => {
    var CertificateStorageRemoveItemActionProto_1;
    let CertificateStorageRemoveItemActionProto = CertificateStorageRemoveItemActionProto_1 = class CertificateStorageRemoveItemActionProto extends CryptoActionProto {};
    CertificateStorageRemoveItemActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageRemoveItemActionProto.ACTION = "crypto/certificateStorage/removeItem";

    __decorate$1([ProtobufProperty({
      id: CertificateStorageRemoveItemActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], CertificateStorageRemoveItemActionProto.prototype, "key", void 0);

    CertificateStorageRemoveItemActionProto = CertificateStorageRemoveItemActionProto_1 = __decorate$1([ProtobufElement({})], CertificateStorageRemoveItemActionProto);
    return CertificateStorageRemoveItemActionProto;
  })();

  let CertificateStorageClearActionProto = (() => {
    let CertificateStorageClearActionProto = class CertificateStorageClearActionProto extends CryptoActionProto {};
    CertificateStorageClearActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageClearActionProto.ACTION = "crypto/certificateStorage/clear";
    CertificateStorageClearActionProto = __decorate$1([ProtobufElement({})], CertificateStorageClearActionProto);
    return CertificateStorageClearActionProto;
  })();

  let CertificateStorageImportActionProto = (() => {
    var CertificateStorageImportActionProto_1;
    let CertificateStorageImportActionProto = CertificateStorageImportActionProto_1 = class CertificateStorageImportActionProto extends CryptoActionProto {};
    CertificateStorageImportActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageImportActionProto.ACTION = "crypto/certificateStorage/import";

    __decorate$1([ProtobufProperty({
      id: CertificateStorageImportActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], CertificateStorageImportActionProto.prototype, "format", void 0);

    __decorate$1([ProtobufProperty({
      id: CertificateStorageImportActionProto_1.INDEX++,
      required: true,
      converter: ArrayBufferConverter
    })], CertificateStorageImportActionProto.prototype, "data", void 0);

    __decorate$1([ProtobufProperty({
      id: CertificateStorageImportActionProto_1.INDEX++,
      required: true,
      parser: AlgorithmProto
    })], CertificateStorageImportActionProto.prototype, "algorithm", void 0);

    __decorate$1([ProtobufProperty({
      id: CertificateStorageImportActionProto_1.INDEX++,
      repeated: true,
      type: "string"
    })], CertificateStorageImportActionProto.prototype, "keyUsages", void 0);

    CertificateStorageImportActionProto = CertificateStorageImportActionProto_1 = __decorate$1([ProtobufElement({})], CertificateStorageImportActionProto);
    return CertificateStorageImportActionProto;
  })();

  let CertificateStorageExportActionProto = (() => {
    var CertificateStorageExportActionProto_1;
    let CertificateStorageExportActionProto = CertificateStorageExportActionProto_1 = class CertificateStorageExportActionProto extends CryptoActionProto {};
    CertificateStorageExportActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageExportActionProto.ACTION = "crypto/certificateStorage/export";

    __decorate$1([ProtobufProperty({
      id: CertificateStorageExportActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], CertificateStorageExportActionProto.prototype, "format", void 0);

    __decorate$1([ProtobufProperty({
      id: CertificateStorageExportActionProto_1.INDEX++,
      required: true,
      parser: CryptoCertificateProto
    })], CertificateStorageExportActionProto.prototype, "item", void 0);

    CertificateStorageExportActionProto = CertificateStorageExportActionProto_1 = __decorate$1([ProtobufElement({})], CertificateStorageExportActionProto);
    return CertificateStorageExportActionProto;
  })();

  let CertificateStorageIndexOfActionProto = (() => {
    var CertificateStorageIndexOfActionProto_1;
    let CertificateStorageIndexOfActionProto = CertificateStorageIndexOfActionProto_1 = class CertificateStorageIndexOfActionProto extends CryptoActionProto {};
    CertificateStorageIndexOfActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageIndexOfActionProto.ACTION = "crypto/certificateStorage/indexOf";

    __decorate$1([ProtobufProperty({
      id: CertificateStorageIndexOfActionProto_1.INDEX++,
      required: true,
      parser: CryptoCertificateProto
    })], CertificateStorageIndexOfActionProto.prototype, "item", void 0);

    CertificateStorageIndexOfActionProto = CertificateStorageIndexOfActionProto_1 = __decorate$1([ProtobufElement({})], CertificateStorageIndexOfActionProto);
    return CertificateStorageIndexOfActionProto;
  })();

  let CertificateStorageGetChainActionProto = (() => {
    let CertificateStorageGetChainActionProto = class CertificateStorageGetChainActionProto extends CryptoActionProto {};
    CertificateStorageGetChainActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageGetChainActionProto.ACTION = "crypto/certificateStorage/getChain";

    __decorate$1([ProtobufProperty({
      id: CertificateStorageSetItemActionProto.INDEX++,
      required: true,
      parser: CryptoCertificateProto
    })], CertificateStorageGetChainActionProto.prototype, "item", void 0);

    CertificateStorageGetChainActionProto = __decorate$1([ProtobufElement({})], CertificateStorageGetChainActionProto);
    return CertificateStorageGetChainActionProto;
  })();

  let CertificateStorageGetCRLActionProto = (() => {
    var CertificateStorageGetCRLActionProto_1;
    let CertificateStorageGetCRLActionProto = CertificateStorageGetCRLActionProto_1 = class CertificateStorageGetCRLActionProto extends CryptoActionProto {};
    CertificateStorageGetCRLActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageGetCRLActionProto.ACTION = "crypto/certificateStorage/getCRL";

    __decorate$1([ProtobufProperty({
      id: CertificateStorageGetCRLActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], CertificateStorageGetCRLActionProto.prototype, "url", void 0);

    CertificateStorageGetCRLActionProto = CertificateStorageGetCRLActionProto_1 = __decorate$1([ProtobufElement({})], CertificateStorageGetCRLActionProto);
    return CertificateStorageGetCRLActionProto;
  })();

  let OCSPRequestOptionsProto = (() => {
    var OCSPRequestOptionsProto_1;
    let OCSPRequestOptionsProto = OCSPRequestOptionsProto_1 = class OCSPRequestOptionsProto extends BaseProto {};
    OCSPRequestOptionsProto.INDEX = BaseProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: OCSPRequestOptionsProto_1.INDEX++,
      required: false,
      type: "string",
      defaultValue: "get"
    })], OCSPRequestOptionsProto.prototype, "method", void 0);

    OCSPRequestOptionsProto = OCSPRequestOptionsProto_1 = __decorate$1([ProtobufElement({})], OCSPRequestOptionsProto);
    return OCSPRequestOptionsProto;
  })();

  let CertificateStorageGetOCSPActionProto = (() => {
    var CertificateStorageGetOCSPActionProto_1;
    let CertificateStorageGetOCSPActionProto = CertificateStorageGetOCSPActionProto_1 = class CertificateStorageGetOCSPActionProto extends CryptoActionProto {};
    CertificateStorageGetOCSPActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageGetOCSPActionProto.ACTION = "crypto/certificateStorage/getOCSP";

    __decorate$1([ProtobufProperty({
      id: CertificateStorageGetOCSPActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], CertificateStorageGetOCSPActionProto.prototype, "url", void 0);

    __decorate$1([ProtobufProperty({
      id: CertificateStorageGetOCSPActionProto_1.INDEX++,
      required: true,
      converter: ArrayBufferConverter
    })], CertificateStorageGetOCSPActionProto.prototype, "request", void 0);

    __decorate$1([ProtobufProperty({
      id: CertificateStorageGetOCSPActionProto_1.INDEX++,
      required: false,
      parser: OCSPRequestOptionsProto
    })], CertificateStorageGetOCSPActionProto.prototype, "options", void 0);

    CertificateStorageGetOCSPActionProto = CertificateStorageGetOCSPActionProto_1 = __decorate$1([ProtobufElement({})], CertificateStorageGetOCSPActionProto);
    return CertificateStorageGetOCSPActionProto;
  })();

  let KeyStorageSetItemActionProto = (() => {
    var KeyStorageSetItemActionProto_1;
    let KeyStorageSetItemActionProto = KeyStorageSetItemActionProto_1 = class KeyStorageSetItemActionProto extends CryptoActionProto {};
    KeyStorageSetItemActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageSetItemActionProto.ACTION = "crypto/keyStorage/setItem";

    __decorate$1([ProtobufProperty({
      id: KeyStorageSetItemActionProto_1.INDEX++,
      required: true,
      parser: CryptoKeyProto
    })], KeyStorageSetItemActionProto.prototype, "item", void 0);

    KeyStorageSetItemActionProto = KeyStorageSetItemActionProto_1 = __decorate$1([ProtobufElement({})], KeyStorageSetItemActionProto);
    return KeyStorageSetItemActionProto;
  })();

  let KeyStorageGetItemActionProto = (() => {
    var KeyStorageGetItemActionProto_1;
    let KeyStorageGetItemActionProto = KeyStorageGetItemActionProto_1 = class KeyStorageGetItemActionProto extends CryptoActionProto {};
    KeyStorageGetItemActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageGetItemActionProto.ACTION = "crypto/keyStorage/getItem";

    __decorate$1([ProtobufProperty({
      id: KeyStorageGetItemActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], KeyStorageGetItemActionProto.prototype, "key", void 0);

    __decorate$1([ProtobufProperty({
      id: KeyStorageGetItemActionProto_1.INDEX++,
      parser: AlgorithmProto
    })], KeyStorageGetItemActionProto.prototype, "algorithm", void 0);

    __decorate$1([ProtobufProperty({
      id: KeyStorageGetItemActionProto_1.INDEX++,
      type: "bool"
    })], KeyStorageGetItemActionProto.prototype, "extractable", void 0);

    __decorate$1([ProtobufProperty({
      id: KeyStorageGetItemActionProto_1.INDEX++,
      repeated: true,
      type: "string"
    })], KeyStorageGetItemActionProto.prototype, "keyUsages", void 0);

    KeyStorageGetItemActionProto = KeyStorageGetItemActionProto_1 = __decorate$1([ProtobufElement({})], KeyStorageGetItemActionProto);
    return KeyStorageGetItemActionProto;
  })();

  let KeyStorageKeysActionProto = (() => {
    let KeyStorageKeysActionProto = class KeyStorageKeysActionProto extends CryptoActionProto {};
    KeyStorageKeysActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageKeysActionProto.ACTION = "crypto/keyStorage/keys";
    KeyStorageKeysActionProto = __decorate$1([ProtobufElement({})], KeyStorageKeysActionProto);
    return KeyStorageKeysActionProto;
  })();

  let KeyStorageRemoveItemActionProto = (() => {
    var KeyStorageRemoveItemActionProto_1;
    let KeyStorageRemoveItemActionProto = KeyStorageRemoveItemActionProto_1 = class KeyStorageRemoveItemActionProto extends CryptoActionProto {};
    KeyStorageRemoveItemActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageRemoveItemActionProto.ACTION = "crypto/keyStorage/removeItem";

    __decorate$1([ProtobufProperty({
      id: KeyStorageRemoveItemActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], KeyStorageRemoveItemActionProto.prototype, "key", void 0);

    KeyStorageRemoveItemActionProto = KeyStorageRemoveItemActionProto_1 = __decorate$1([ProtobufElement({})], KeyStorageRemoveItemActionProto);
    return KeyStorageRemoveItemActionProto;
  })();

  let KeyStorageClearActionProto = (() => {
    let KeyStorageClearActionProto = class KeyStorageClearActionProto extends CryptoActionProto {};
    KeyStorageClearActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageClearActionProto.ACTION = "crypto/keyStorage/clear";
    KeyStorageClearActionProto = __decorate$1([ProtobufElement({})], KeyStorageClearActionProto);
    return KeyStorageClearActionProto;
  })();

  let KeyStorageIndexOfActionProto = (() => {
    var KeyStorageIndexOfActionProto_1;
    let KeyStorageIndexOfActionProto = KeyStorageIndexOfActionProto_1 = class KeyStorageIndexOfActionProto extends CryptoActionProto {};
    KeyStorageIndexOfActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageIndexOfActionProto.ACTION = "crypto/keyStorage/indexOf";

    __decorate$1([ProtobufProperty({
      id: KeyStorageIndexOfActionProto_1.INDEX++,
      required: true,
      parser: CryptoKeyProto
    })], KeyStorageIndexOfActionProto.prototype, "item", void 0);

    KeyStorageIndexOfActionProto = KeyStorageIndexOfActionProto_1 = __decorate$1([ProtobufElement({})], KeyStorageIndexOfActionProto);
    return KeyStorageIndexOfActionProto;
  })();

  let ProviderCryptoProto = (() => {
    var ProviderCryptoProto_1;
    let ProviderCryptoProto = ProviderCryptoProto_1 = class ProviderCryptoProto extends BaseProto {
      constructor(data) {
        super();

        if (data) {
          assign(this, data);
        }
      }

    };
    ProviderCryptoProto.INDEX = BaseProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: ProviderCryptoProto_1.INDEX++,
      required: true,
      type: "string"
    })], ProviderCryptoProto.prototype, "id", void 0);

    __decorate$1([ProtobufProperty({
      id: ProviderCryptoProto_1.INDEX++,
      required: true,
      type: "string"
    })], ProviderCryptoProto.prototype, "name", void 0);

    __decorate$1([ProtobufProperty({
      id: ProviderCryptoProto_1.INDEX++,
      type: "bool",
      defaultValue: false
    })], ProviderCryptoProto.prototype, "readOnly", void 0);

    __decorate$1([ProtobufProperty({
      id: ProviderCryptoProto_1.INDEX++,
      repeated: true,
      type: "string"
    })], ProviderCryptoProto.prototype, "algorithms", void 0);

    __decorate$1([ProtobufProperty({
      id: ProviderCryptoProto_1.INDEX++,
      type: "bool",
      defaultValue: false
    })], ProviderCryptoProto.prototype, "isRemovable", void 0);

    __decorate$1([ProtobufProperty({
      id: ProviderCryptoProto_1.INDEX++,
      type: "string"
    })], ProviderCryptoProto.prototype, "atr", void 0);

    __decorate$1([ProtobufProperty({
      id: ProviderCryptoProto_1.INDEX++,
      type: "bool",
      defaultValue: false
    })], ProviderCryptoProto.prototype, "isHardware", void 0);

    ProviderCryptoProto = ProviderCryptoProto_1 = __decorate$1([ProtobufElement({})], ProviderCryptoProto);
    return ProviderCryptoProto;
  })();

  let ProviderInfoProto = (() => {
    var ProviderInfoProto_1;
    let ProviderInfoProto = ProviderInfoProto_1 = class ProviderInfoProto extends BaseProto {};
    ProviderInfoProto.INDEX = BaseProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: ProviderInfoProto_1.INDEX++,
      type: "string",
      required: true
    })], ProviderInfoProto.prototype, "name", void 0);

    __decorate$1([ProtobufProperty({
      id: ProviderInfoProto_1.INDEX++,
      repeated: true,
      parser: ProviderCryptoProto
    })], ProviderInfoProto.prototype, "providers", void 0);

    ProviderInfoProto = ProviderInfoProto_1 = __decorate$1([ProtobufElement({})], ProviderInfoProto);
    return ProviderInfoProto;
  })();

  let ProviderInfoActionProto = (() => {
    let ProviderInfoActionProto = class ProviderInfoActionProto extends ActionProto {};
    ProviderInfoActionProto.INDEX = ActionProto.INDEX;
    ProviderInfoActionProto.ACTION = "provider/action/info";
    ProviderInfoActionProto = __decorate$1([ProtobufElement({})], ProviderInfoActionProto);
    return ProviderInfoActionProto;
  })();

  let ProviderGetCryptoActionProto = (() => {
    var ProviderGetCryptoActionProto_1;
    let ProviderGetCryptoActionProto = ProviderGetCryptoActionProto_1 = class ProviderGetCryptoActionProto extends ActionProto {};
    ProviderGetCryptoActionProto.INDEX = ActionProto.INDEX;
    ProviderGetCryptoActionProto.ACTION = "provider/action/getCrypto";

    __decorate$1([ProtobufProperty({
      id: ProviderGetCryptoActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], ProviderGetCryptoActionProto.prototype, "cryptoID", void 0);

    ProviderGetCryptoActionProto = ProviderGetCryptoActionProto_1 = __decorate$1([ProtobufElement({})], ProviderGetCryptoActionProto);
    return ProviderGetCryptoActionProto;
  })();

  let ProviderAuthorizedEventProto = (() => {
    let ProviderAuthorizedEventProto = class ProviderAuthorizedEventProto extends ActionProto {};
    ProviderAuthorizedEventProto.INDEX = ActionProto.INDEX;
    ProviderAuthorizedEventProto.ACTION = "provider/event/authorized";
    ProviderAuthorizedEventProto = __decorate$1([ProtobufElement({})], ProviderAuthorizedEventProto);
    return ProviderAuthorizedEventProto;
  })();

  let ProviderTokenEventProto = (() => {
    var ProviderTokenEventProto_1;
    let ProviderTokenEventProto = ProviderTokenEventProto_1 = class ProviderTokenEventProto extends ActionProto {
      constructor(data) {
        super();

        if (data) {
          assign(this, data);
        }
      }

    };
    ProviderTokenEventProto.INDEX = ActionProto.INDEX;
    ProviderTokenEventProto.ACTION = "provider/event/token";

    __decorate$1([ProtobufProperty({
      id: ProviderTokenEventProto_1.INDEX++,
      repeated: true,
      parser: ProviderCryptoProto
    })], ProviderTokenEventProto.prototype, "added", void 0);

    __decorate$1([ProtobufProperty({
      id: ProviderTokenEventProto_1.INDEX++,
      repeated: true,
      parser: ProviderCryptoProto
    })], ProviderTokenEventProto.prototype, "removed", void 0);

    __decorate$1([ProtobufProperty({
      id: ProviderTokenEventProto_1.INDEX++,
      type: "bytes",
      parser: ErrorProto
    })], ProviderTokenEventProto.prototype, "error", void 0);

    ProviderTokenEventProto = ProviderTokenEventProto_1 = __decorate$1([ProtobufElement({
      name: "ProviderTokenEvent"
    })], ProviderTokenEventProto);
    return ProviderTokenEventProto;
  })();

  let DigestActionProto = (() => {
    var DigestActionProto_1;
    let DigestActionProto = DigestActionProto_1 = class DigestActionProto extends CryptoActionProto {};
    DigestActionProto.INDEX = CryptoActionProto.INDEX;
    DigestActionProto.ACTION = "crypto/subtle/digest";

    __decorate$1([ProtobufProperty({
      id: DigestActionProto_1.INDEX++,
      required: true,
      parser: AlgorithmProto
    })], DigestActionProto.prototype, "algorithm", void 0);

    __decorate$1([ProtobufProperty({
      id: DigestActionProto_1.INDEX++,
      required: true,
      converter: ArrayBufferConverter
    })], DigestActionProto.prototype, "data", void 0);

    DigestActionProto = DigestActionProto_1 = __decorate$1([ProtobufElement({})], DigestActionProto);
    return DigestActionProto;
  })();

  let GenerateKeyActionProto = (() => {
    var GenerateKeyActionProto_1;
    let GenerateKeyActionProto = GenerateKeyActionProto_1 = class GenerateKeyActionProto extends CryptoActionProto {};
    GenerateKeyActionProto.INDEX = CryptoActionProto.INDEX;
    GenerateKeyActionProto.ACTION = "crypto/subtle/generateKey";

    __decorate$1([ProtobufProperty({
      id: GenerateKeyActionProto_1.INDEX++,
      type: "bytes",
      required: true,
      parser: AlgorithmProto
    })], GenerateKeyActionProto.prototype, "algorithm", void 0);

    __decorate$1([ProtobufProperty({
      id: GenerateKeyActionProto_1.INDEX++,
      type: "bool",
      required: true
    })], GenerateKeyActionProto.prototype, "extractable", void 0);

    __decorate$1([ProtobufProperty({
      id: GenerateKeyActionProto_1.INDEX++,
      type: "string",
      repeated: true
    })], GenerateKeyActionProto.prototype, "usage", void 0);

    GenerateKeyActionProto = GenerateKeyActionProto_1 = __decorate$1([ProtobufElement({})], GenerateKeyActionProto);
    return GenerateKeyActionProto;
  })();

  let SignActionProto = (() => {
    var SignActionProto_1;
    let SignActionProto = SignActionProto_1 = class SignActionProto extends CryptoActionProto {};
    SignActionProto.INDEX = CryptoActionProto.INDEX;
    SignActionProto.ACTION = "crypto/subtle/sign";

    __decorate$1([ProtobufProperty({
      id: SignActionProto_1.INDEX++,
      required: true,
      parser: AlgorithmProto
    })], SignActionProto.prototype, "algorithm", void 0);

    __decorate$1([ProtobufProperty({
      id: SignActionProto_1.INDEX++,
      required: true,
      parser: CryptoKeyProto
    })], SignActionProto.prototype, "key", void 0);

    __decorate$1([ProtobufProperty({
      id: SignActionProto_1.INDEX++,
      required: true,
      converter: ArrayBufferConverter
    })], SignActionProto.prototype, "data", void 0);

    SignActionProto = SignActionProto_1 = __decorate$1([ProtobufElement({})], SignActionProto);
    return SignActionProto;
  })();

  let VerifyActionProto = (() => {
    var VerifyActionProto_1;
    let VerifyActionProto = VerifyActionProto_1 = class VerifyActionProto extends SignActionProto {};
    VerifyActionProto.INDEX = SignActionProto.INDEX;
    VerifyActionProto.ACTION = "crypto/subtle/verify";

    __decorate$1([ProtobufProperty({
      id: VerifyActionProto_1.INDEX++,
      required: true,
      converter: ArrayBufferConverter
    })], VerifyActionProto.prototype, "signature", void 0);

    VerifyActionProto = VerifyActionProto_1 = __decorate$1([ProtobufElement({})], VerifyActionProto);
    return VerifyActionProto;
  })();

  let EncryptActionProto = (() => {
    let EncryptActionProto = class EncryptActionProto extends SignActionProto {};
    EncryptActionProto.INDEX = SignActionProto.INDEX;
    EncryptActionProto.ACTION = "crypto/subtle/encrypt";
    EncryptActionProto = __decorate$1([ProtobufElement({})], EncryptActionProto);
    return EncryptActionProto;
  })();

  let DecryptActionProto = (() => {
    let DecryptActionProto = class DecryptActionProto extends SignActionProto {};
    DecryptActionProto.INDEX = SignActionProto.INDEX;
    DecryptActionProto.ACTION = "crypto/subtle/decrypt";
    DecryptActionProto = __decorate$1([ProtobufElement({})], DecryptActionProto);
    return DecryptActionProto;
  })();

  let DeriveBitsActionProto = (() => {
    var DeriveBitsActionProto_1;
    let DeriveBitsActionProto = DeriveBitsActionProto_1 = class DeriveBitsActionProto extends CryptoActionProto {};
    DeriveBitsActionProto.INDEX = CryptoActionProto.INDEX;
    DeriveBitsActionProto.ACTION = "crypto/subtle/deriveBits";

    __decorate$1([ProtobufProperty({
      id: DeriveBitsActionProto_1.INDEX++,
      required: true,
      parser: AlgorithmProto
    })], DeriveBitsActionProto.prototype, "algorithm", void 0);

    __decorate$1([ProtobufProperty({
      id: DeriveBitsActionProto_1.INDEX++,
      required: true,
      parser: CryptoKeyProto
    })], DeriveBitsActionProto.prototype, "key", void 0);

    __decorate$1([ProtobufProperty({
      id: DeriveBitsActionProto_1.INDEX++,
      required: true,
      type: "uint32"
    })], DeriveBitsActionProto.prototype, "length", void 0);

    DeriveBitsActionProto = DeriveBitsActionProto_1 = __decorate$1([ProtobufElement({})], DeriveBitsActionProto);
    return DeriveBitsActionProto;
  })();

  let DeriveKeyActionProto = (() => {
    var DeriveKeyActionProto_1;
    let DeriveKeyActionProto = DeriveKeyActionProto_1 = class DeriveKeyActionProto extends CryptoActionProto {};
    DeriveKeyActionProto.INDEX = CryptoActionProto.INDEX;
    DeriveKeyActionProto.ACTION = "crypto/subtle/deriveKey";

    __decorate$1([ProtobufProperty({
      id: DeriveKeyActionProto_1.INDEX++,
      required: true,
      parser: AlgorithmProto
    })], DeriveKeyActionProto.prototype, "algorithm", void 0);

    __decorate$1([ProtobufProperty({
      id: DeriveKeyActionProto_1.INDEX++,
      required: true,
      parser: CryptoKeyProto
    })], DeriveKeyActionProto.prototype, "key", void 0);

    __decorate$1([ProtobufProperty({
      id: DeriveKeyActionProto_1.INDEX++,
      required: true,
      parser: AlgorithmProto
    })], DeriveKeyActionProto.prototype, "derivedKeyType", void 0);

    __decorate$1([ProtobufProperty({
      id: DeriveKeyActionProto_1.INDEX++,
      type: "bool"
    })], DeriveKeyActionProto.prototype, "extractable", void 0);

    __decorate$1([ProtobufProperty({
      id: DeriveKeyActionProto_1.INDEX++,
      type: "string",
      repeated: true
    })], DeriveKeyActionProto.prototype, "usage", void 0);

    DeriveKeyActionProto = DeriveKeyActionProto_1 = __decorate$1([ProtobufElement({})], DeriveKeyActionProto);
    return DeriveKeyActionProto;
  })();

  let UnwrapKeyActionProto = (() => {
    var UnwrapKeyActionProto_1;
    let UnwrapKeyActionProto = UnwrapKeyActionProto_1 = class UnwrapKeyActionProto extends CryptoActionProto {};
    UnwrapKeyActionProto.INDEX = CryptoActionProto.INDEX;
    UnwrapKeyActionProto.ACTION = "crypto/subtle/unwrapKey";

    __decorate$1([ProtobufProperty({
      id: UnwrapKeyActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], UnwrapKeyActionProto.prototype, "format", void 0);

    __decorate$1([ProtobufProperty({
      id: UnwrapKeyActionProto_1.INDEX++,
      required: true,
      converter: ArrayBufferConverter
    })], UnwrapKeyActionProto.prototype, "wrappedKey", void 0);

    __decorate$1([ProtobufProperty({
      id: UnwrapKeyActionProto_1.INDEX++,
      required: true,
      parser: CryptoKeyProto
    })], UnwrapKeyActionProto.prototype, "unwrappingKey", void 0);

    __decorate$1([ProtobufProperty({
      id: UnwrapKeyActionProto_1.INDEX++,
      required: true,
      parser: AlgorithmProto
    })], UnwrapKeyActionProto.prototype, "unwrapAlgorithm", void 0);

    __decorate$1([ProtobufProperty({
      id: UnwrapKeyActionProto_1.INDEX++,
      required: true,
      parser: AlgorithmProto
    })], UnwrapKeyActionProto.prototype, "unwrappedKeyAlgorithm", void 0);

    __decorate$1([ProtobufProperty({
      id: UnwrapKeyActionProto_1.INDEX++,
      type: "bool"
    })], UnwrapKeyActionProto.prototype, "extractable", void 0);

    __decorate$1([ProtobufProperty({
      id: UnwrapKeyActionProto_1.INDEX++,
      type: "string",
      repeated: true
    })], UnwrapKeyActionProto.prototype, "keyUsage", void 0);

    UnwrapKeyActionProto = UnwrapKeyActionProto_1 = __decorate$1([ProtobufElement({})], UnwrapKeyActionProto);
    return UnwrapKeyActionProto;
  })();

  let WrapKeyActionProto = (() => {
    var WrapKeyActionProto_1;
    let WrapKeyActionProto = WrapKeyActionProto_1 = class WrapKeyActionProto extends CryptoActionProto {};
    WrapKeyActionProto.INDEX = CryptoActionProto.INDEX;
    WrapKeyActionProto.ACTION = "crypto/subtle/wrapKey";

    __decorate$1([ProtobufProperty({
      id: WrapKeyActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], WrapKeyActionProto.prototype, "format", void 0);

    __decorate$1([ProtobufProperty({
      id: WrapKeyActionProto_1.INDEX++,
      required: true,
      parser: CryptoKeyProto
    })], WrapKeyActionProto.prototype, "key", void 0);

    __decorate$1([ProtobufProperty({
      id: WrapKeyActionProto_1.INDEX++,
      required: true,
      parser: CryptoKeyProto
    })], WrapKeyActionProto.prototype, "wrappingKey", void 0);

    __decorate$1([ProtobufProperty({
      id: WrapKeyActionProto_1.INDEX++,
      required: true,
      parser: AlgorithmProto
    })], WrapKeyActionProto.prototype, "wrapAlgorithm", void 0);

    WrapKeyActionProto = WrapKeyActionProto_1 = __decorate$1([ProtobufElement({})], WrapKeyActionProto);
    return WrapKeyActionProto;
  })();

  let ExportKeyActionProto = (() => {
    var ExportKeyActionProto_1;
    let ExportKeyActionProto = ExportKeyActionProto_1 = class ExportKeyActionProto extends CryptoActionProto {};
    ExportKeyActionProto.INDEX = CryptoActionProto.INDEX;
    ExportKeyActionProto.ACTION = "crypto/subtle/exportKey";

    __decorate$1([ProtobufProperty({
      id: ExportKeyActionProto_1.INDEX++,
      type: "string",
      required: true
    })], ExportKeyActionProto.prototype, "format", void 0);

    __decorate$1([ProtobufProperty({
      id: ExportKeyActionProto_1.INDEX++,
      required: true,
      parser: CryptoKeyProto
    })], ExportKeyActionProto.prototype, "key", void 0);

    ExportKeyActionProto = ExportKeyActionProto_1 = __decorate$1([ProtobufElement({})], ExportKeyActionProto);
    return ExportKeyActionProto;
  })();

  let ImportKeyActionProto = (() => {
    var ImportKeyActionProto_1;
    let ImportKeyActionProto = ImportKeyActionProto_1 = class ImportKeyActionProto extends CryptoActionProto {};
    ImportKeyActionProto.INDEX = CryptoActionProto.INDEX;
    ImportKeyActionProto.ACTION = "crypto/subtle/importKey";

    __decorate$1([ProtobufProperty({
      id: ImportKeyActionProto_1.INDEX++,
      type: "string",
      required: true
    })], ImportKeyActionProto.prototype, "format", void 0);

    __decorate$1([ProtobufProperty({
      id: ImportKeyActionProto_1.INDEX++,
      required: true,
      converter: ArrayBufferConverter
    })], ImportKeyActionProto.prototype, "keyData", void 0);

    __decorate$1([ProtobufProperty({
      id: ImportKeyActionProto_1.INDEX++,
      required: true,
      parser: AlgorithmProto
    })], ImportKeyActionProto.prototype, "algorithm", void 0);

    __decorate$1([ProtobufProperty({
      id: ImportKeyActionProto_1.INDEX++,
      required: true,
      type: "bool"
    })], ImportKeyActionProto.prototype, "extractable", void 0);

    __decorate$1([ProtobufProperty({
      id: ImportKeyActionProto_1.INDEX++,
      type: "string",
      repeated: true
    })], ImportKeyActionProto.prototype, "keyUsages", void 0);

    ImportKeyActionProto = ImportKeyActionProto_1 = __decorate$1([ProtobufElement({})], ImportKeyActionProto);
    return ImportKeyActionProto;
  })();

  class CardReader extends EventEmitter {
    constructor(client) {
      super();
      this.client = client;
      this.onEvent = this.onEvent.bind(this);
      this.client.on("listening", () => {
        this.client.on("event", this.onEvent);
      }).on("close", () => {
        this.client.removeListener("event", this.onEvent);
      });
    }

    async readers() {
      const data = await this.client.send(new CardReaderGetReadersActionProto());
      return JSON.parse(Convert.ToString(data));
    }

    on(event, cb) {
      return super.on(event, cb);
    }

    emit(event, ...args) {
      return super.emit(event, ...args);
    }

    onEvent(actionProto) {
      (async () => {
        switch (actionProto.action) {
          case CardReaderInsertEventProto.ACTION:
            this.onInsert(await CardReaderInsertEventProto.importProto(actionProto));
            break;

          case CardReaderRemoveEventProto.ACTION:
            this.onRemove(await CardReaderRemoveEventProto.importProto(actionProto));
            break;
        }
      })().catch(err => this.emit("error", err));
    }

    onInsert(actionProto) {
      this.emit("insert", actionProto);
    }

    onRemove(actionProto) {
      this.emit("remove", actionProto);
    }

  }

  async function challenge(serverIdentity, clientIdentity) {
    const serverIdentityDigest = await serverIdentity.thumbprint();
    const clientIdentityDigest = await clientIdentity.thumbprint();
    const combinedIdentity = Convert.FromHex(serverIdentityDigest + clientIdentityDigest);
    const digest = await getEngine().crypto.subtle.digest("SHA-256", combinedIdentity);
    return parseInt(Convert.ToHex(digest), 16).toString().substr(2, 6);
  }

  const SERVER_WELL_KNOWN = "/.well-known/webcrypto-socket";

  class Event {
    constructor(target, event) {
      this.target = target;
      this.event = event;
    }

  }

  class CryptoServerError extends Error {
    constructor(error) {
      super(error.message);
      this.name = "CryptoServerError";
      this.code = error.code;
      this.type = error.type;
    }

  }

  class ClientEvent extends Event {}

  class ClientCloseEvent extends ClientEvent {
    constructor(target, remoteAddress, reasonCode, description) {
      super(target, "close");
      this.remoteAddress = remoteAddress;
      this.reasonCode = reasonCode;
      this.description = description;
    }

  }

  class ClientErrorEvent extends ClientEvent {
    constructor(target, error) {
      super(target, "error");
      this.error = error;
    }

  }

  class ClientListeningEvent extends ClientEvent {
    constructor(target, address) {
      super(target, "listening");
      this.address = address;
    }

  }

  function isFirefox() {
    return /firefox/i.test(self.navigator.userAgent);
  }

  function isEdge() {
    return /edge\/([\d\.]+)/i.test(self.navigator.userAgent);
  }

  function isIE() {
    return !!window.document.documentMode;
  }

  const ECDH = {
    name: "ECDH",
    namedCurve: "P-256"
  };
  const ECDSA = {
    name: "ECDSA",
    namedCurve: "P-256"
  };
  const AES_CBC = {
    name: "AES-CBC",
    iv: new ArrayBuffer(16)
  };

  async function createEcPublicKey(publicKey) {
    const algName = publicKey.algorithm.name.toUpperCase();

    if (!(algName === "ECDH" || algName === "ECDSA")) {
      throw new Error("Error: Unsupported asymmetric key algorithm.");
    }

    if (publicKey.type !== "public") {
      throw new Error("Error: Expected key type to be public but it was not.");
    }

    const jwk = await getEngine().crypto.subtle.exportKey("jwk", publicKey);

    if (!(jwk.x && jwk.y)) {
      throw new Error("Wrong JWK data for EC public key. Parameters x and y are required.");
    }

    const x = Convert.FromBase64Url(jwk.x);
    const y = Convert.FromBase64Url(jwk.y);
    const xy = Convert.ToBinary(x) + Convert.ToBinary(y);
    const key = publicKey;
    const serialized = Convert.FromBinary(xy);
    const id = Convert.ToHex(await getEngine().crypto.subtle.digest("SHA-256", serialized));
    return {
      id,
      key,
      serialized
    };
  }

  async function updateEcPublicKey(ecPublicKey, publicKey) {
    const data = await createEcPublicKey(publicKey);
    ecPublicKey.id = data.id;
    ecPublicKey.key = data.key;
    ecPublicKey.serialized = data.serialized;
  }

  var SocketCryptoState;

  (function (SocketCryptoState) {
    SocketCryptoState[SocketCryptoState["connecting"] = 0] = "connecting";
    SocketCryptoState[SocketCryptoState["open"] = 1] = "open";
    SocketCryptoState[SocketCryptoState["closing"] = 2] = "closing";
    SocketCryptoState[SocketCryptoState["closed"] = 3] = "closed";
  })(SocketCryptoState || (SocketCryptoState = {}));

  class Client extends EventEmitter {
    constructor(storage) {
      super();
      this.stack = {};
      this.messageCounter = 0;
      this.storage = storage;
    }

    get state() {
      if (this.socket) {
        return this.socket.readyState;
      } else {
        return SocketCryptoState.closed;
      }
    }

    connect(address, options) {
      this.getServerInfo(address).then(info => {
        this.serviceInfo = info;
        const url = `wss://${address}`;
        this.socket = options ? new WebSocket(url, undefined, options) : new WebSocket(url);
        this.socket.binaryType = "arraybuffer";

        this.socket.onerror = e => {
          this.emit("error", new ClientErrorEvent(this, e.error));
        };

        this.socket.onopen = () => {
          (async () => {
            let identity = await this.storage.loadIdentity();

            if (!identity) {
              identity = await Identity.create(1, 0, 0, isIE() || isEdge() || isFirefox());
              await this.storage.saveIdentity(identity);
            }

            const remoteIdentityId = "0";
            const bundle = await PreKeyBundleProtocol.importProto(Convert.FromBase64(info.preKey));
            this.cipher = await AsymmetricRatchet.create(identity, bundle);
            await this.storage.saveRemoteIdentity(remoteIdentityId, this.cipher.remoteIdentity);
            this.emit("listening", new ClientListeningEvent(this, address));
          })().catch(error => this.emit("error", new ClientErrorEvent(this, error)));
        };

        this.socket.onclose = e => {
          for (const actionId in this.stack) {
            const message = this.stack[actionId];
            message.reject(new Error("Cannot finish operation. Session was closed"));
          }

          this.emit("close", new ClientCloseEvent(this, address, e.code, e.reason));
        };

        this.socket.onmessage = e => {
          if (e.data instanceof ArrayBuffer) {
            MessageSignedProtocol.importProto(e.data).then(proto2 => {
              if (!this.cipher) {
                throw new Error("Client cipher is not initialized");
              }

              return this.cipher.decrypt(proto2);
            }).then(msg => {
              this.onMessage(msg);
            }).catch(err => {
              this.emit("error", new ClientErrorEvent(this, err));
            });
          }
        };
      }).catch(err => {
        this.emit("error", new ClientErrorEvent(this, err));
      });
      return this;
    }

    close() {
      if (this.socket) {
        this.socket.close();
      }
    }

    on(event, listener) {
      return super.on(event, listener);
    }

    once(event, listener) {
      return super.once(event, listener);
    }

    async challenge() {
      if (!this.cipher) {
        throw new Error("Client cipher is not initialized");
      }

      return challenge(this.cipher.remoteIdentity.signingKey, this.cipher.identity.signingKey.publicKey);
    }

    async isLoggedIn() {
      const action = new ServerIsLoggedInActionProto();
      const data = await this.send(action);
      return data ? !!new Uint8Array(data)[0] : false;
    }

    async login() {
      const action = new ServerLoginActionProto();
      await this.send(action);
    }

    send(data) {
      return new Promise((resolve, reject) => {
        this.checkSocketState();

        if (!data) {
          data = new ActionProto();
        }

        data.action = data.action;
        data.actionId = (this.messageCounter++).toString();
        data.exportProto().then(raw => {
          if (!this.cipher) {
            throw new Error("Client cipher is not initialized");
          }

          return this.cipher.encrypt(raw).then(msg => msg.exportProto());
        }).then(raw => {
          if (!this.socket) {
            throw new Error("Client socket is not initialized");
          }

          this.stack[data.actionId] = {
            resolve,
            reject
          };
          this.socket.send(raw);
        }).catch(reject);
      });
    }

    async getServerInfo(address) {
      const url = `https://${address}${SERVER_WELL_KNOWN}`;
      const response = await fetch(url);

      if (response.status !== 200) {
        throw new Error("Cannot get wellknown link");
      } else {
        const json = await response.json();
        return json;
      }
    }

    checkSocketState() {
      if (this.state !== SocketCryptoState.open) {
        throw new Error("Socket connection is not open");
      }
    }

    async onMessage(message) {
      const p = await ActionProto.importProto(message);
      const promise = this.stack[p.actionId];

      if (promise) {
        delete this.stack[p.actionId];
        const messageProto = await ResultProto.importProto(await p.exportProto());

        if (messageProto.error && messageProto.error.message) {
          const errorProto = messageProto.error;
          const error = new CryptoServerError(errorProto);
          promise.reject(error);
        } else {
          promise.resolve(messageProto.data);
        }
      } else {
        this.emit("event", p);
      }
    }

  }
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */


  function __decorate$2(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  function unwrapExports(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
    return module = {
      exports: {}
    }, fn(module, module.exports), module.exports;
  }

  function getUTCDate(date) {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  }

  function getParametersValue(parameters, name, defaultValue) {
    if (parameters instanceof Object === false) return defaultValue;
    if (name in parameters) return parameters[name];
    return defaultValue;
  }

  function bufferToHexCodes(inputBuffer, inputOffset = 0, inputLength = inputBuffer.byteLength - inputOffset, insertSpace = false) {
    let result = "";

    for (const item of new Uint8Array(inputBuffer, inputOffset, inputLength)) {
      const str = item.toString(16).toUpperCase();
      if (str.length === 1) result += "0";
      result += str;
      if (insertSpace) result += " ";
    }

    return result.trim();
  }

  function checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength) {
    if (inputBuffer instanceof ArrayBuffer === false) {
      baseBlock.error = "Wrong parameter: inputBuffer must be \"ArrayBuffer\"";
      return false;
    }

    if (inputBuffer.byteLength === 0) {
      baseBlock.error = "Wrong parameter: inputBuffer has zero length";
      return false;
    }

    if (inputOffset < 0) {
      baseBlock.error = "Wrong parameter: inputOffset less than zero";
      return false;
    }

    if (inputLength < 0) {
      baseBlock.error = "Wrong parameter: inputLength less than zero";
      return false;
    }

    if (inputBuffer.byteLength - inputOffset - inputLength < 0) {
      baseBlock.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
      return false;
    }

    return true;
  }

  function utilFromBase(inputBuffer, inputBase) {
    let result = 0;
    if (inputBuffer.length === 1) return inputBuffer[0];

    for (let i = inputBuffer.length - 1; i >= 0; i--) result += inputBuffer[inputBuffer.length - 1 - i] * Math.pow(2, inputBase * i);

    return result;
  }

  function utilToBase(value, base, reserved = -1) {
    const internalReserved = reserved;
    let internalValue = value;
    let result = 0;
    let biggest = Math.pow(2, base);

    for (let i = 1; i < 8; i++) {
      if (value < biggest) {
        let retBuf;

        if (internalReserved < 0) {
          retBuf = new ArrayBuffer(i);
          result = i;
        } else {
          if (internalReserved < i) return new ArrayBuffer(0);
          retBuf = new ArrayBuffer(internalReserved);
          result = internalReserved;
        }

        const retView = new Uint8Array(retBuf);

        for (let j = i - 1; j >= 0; j--) {
          const basis = Math.pow(2, j * base);
          retView[result - j - 1] = Math.floor(internalValue / basis);
          internalValue -= retView[result - j - 1] * basis;
        }

        return retBuf;
      }

      biggest *= Math.pow(2, base);
    }

    return new ArrayBuffer(0);
  }

  function utilConcatBuf(...buffers) {
    let outputLength = 0;
    let prevLength = 0;

    for (const buffer of buffers) outputLength += buffer.byteLength;

    const retBuf = new ArrayBuffer(outputLength);
    const retView = new Uint8Array(retBuf);

    for (const buffer of buffers) {
      retView.set(new Uint8Array(buffer), prevLength);
      prevLength += buffer.byteLength;
    }

    return retBuf;
  }

  function utilConcatView(...views) {
    let outputLength = 0;
    let prevLength = 0;

    for (const view of views) outputLength += view.length;

    const retBuf = new ArrayBuffer(outputLength);
    const retView = new Uint8Array(retBuf);

    for (const view of views) {
      retView.set(view, prevLength);
      prevLength += view.length;
    }

    return retView;
  }

  function utilDecodeTC() {
    const buf = new Uint8Array(this.valueHex);

    if (this.valueHex.byteLength >= 2) {
      const condition1 = buf[0] === 0xFF && buf[1] & 0x80;
      const condition2 = buf[0] === 0x00 && (buf[1] & 0x80) === 0x00;
      if (condition1 || condition2) this.warnings.push("Needlessly long format");
    }

    const bigIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
    const bigIntView = new Uint8Array(bigIntBuffer);

    for (let i = 0; i < this.valueHex.byteLength; i++) bigIntView[i] = 0;

    bigIntView[0] = buf[0] & 0x80;
    const bigInt = utilFromBase(bigIntView, 8);
    const smallIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
    const smallIntView = new Uint8Array(smallIntBuffer);

    for (let j = 0; j < this.valueHex.byteLength; j++) smallIntView[j] = buf[j];

    smallIntView[0] &= 0x7F;
    const smallInt = utilFromBase(smallIntView, 8);
    return smallInt - bigInt;
  }

  function utilEncodeTC(value) {
    const modValue = value < 0 ? value * -1 : value;
    let bigInt = 128;

    for (let i = 1; i < 8; i++) {
      if (modValue <= bigInt) {
        if (value < 0) {
          const smallInt = bigInt - modValue;
          const retBuf = utilToBase(smallInt, 8, i);
          const retView = new Uint8Array(retBuf);
          retView[0] |= 0x80;
          return retBuf;
        }

        let retBuf = utilToBase(modValue, 8, i);
        let retView = new Uint8Array(retBuf);

        if (retView[0] & 0x80) {
          const tempBuf = retBuf.slice(0);
          const tempView = new Uint8Array(tempBuf);
          retBuf = new ArrayBuffer(retBuf.byteLength + 1);
          retView = new Uint8Array(retBuf);

          for (let k = 0; k < tempBuf.byteLength; k++) retView[k + 1] = tempView[k];

          retView[0] = 0x00;
        }

        return retBuf;
      }

      bigInt *= Math.pow(2, 8);
    }

    return new ArrayBuffer(0);
  }

  function isEqualBuffer(inputBuffer1, inputBuffer2) {
    if (inputBuffer1.byteLength !== inputBuffer2.byteLength) return false;
    const view1 = new Uint8Array(inputBuffer1);
    const view2 = new Uint8Array(inputBuffer2);

    for (let i = 0; i < view1.length; i++) {
      if (view1[i] !== view2[i]) return false;
    }

    return true;
  }

  function padNumber(inputNumber, fullLength) {
    const str = inputNumber.toString(10);
    if (fullLength < str.length) return "";
    const dif = fullLength - str.length;
    const padding = new Array(dif);

    for (let i = 0; i < dif; i++) padding[i] = "0";

    const paddingString = padding.join("");
    return paddingString.concat(str);
  }

  const base64Template = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  const base64UrlTemplate = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";

  function toBase64(input, useUrlTemplate = false, skipPadding = false, skipLeadingZeros = false) {
    let i = 0;
    let flag1 = 0;
    let flag2 = 0;
    let output = "";
    const template = useUrlTemplate ? base64UrlTemplate : base64Template;

    if (skipLeadingZeros) {
      let nonZeroPosition = 0;

      for (let i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) !== 0) {
          nonZeroPosition = i;
          break;
        }
      }

      input = input.slice(nonZeroPosition);
    }

    while (i < input.length) {
      const chr1 = input.charCodeAt(i++);
      if (i >= input.length) flag1 = 1;
      const chr2 = input.charCodeAt(i++);
      if (i >= input.length) flag2 = 1;
      const chr3 = input.charCodeAt(i++);
      const enc1 = chr1 >> 2;
      const enc2 = (chr1 & 0x03) << 4 | chr2 >> 4;
      let enc3 = (chr2 & 0x0F) << 2 | chr3 >> 6;
      let enc4 = chr3 & 0x3F;

      if (flag1 === 1) {
        enc3 = enc4 = 64;
      } else {
        if (flag2 === 1) {
          enc4 = 64;
        }
      }

      if (skipPadding) {
        if (enc3 === 64) output += `${template.charAt(enc1)}${template.charAt(enc2)}`;else {
          if (enc4 === 64) output += `${template.charAt(enc1)}${template.charAt(enc2)}${template.charAt(enc3)}`;else output += `${template.charAt(enc1)}${template.charAt(enc2)}${template.charAt(enc3)}${template.charAt(enc4)}`;
        }
      } else output += `${template.charAt(enc1)}${template.charAt(enc2)}${template.charAt(enc3)}${template.charAt(enc4)}`;
    }

    return output;
  }

  function fromBase64(input, useUrlTemplate = false, cutTailZeros = false) {
    const template = useUrlTemplate ? base64UrlTemplate : base64Template;

    function indexof(toSearch) {
      for (let i = 0; i < 64; i++) {
        if (template.charAt(i) === toSearch) return i;
      }

      return 64;
    }

    function test(incoming) {
      return incoming === 64 ? 0x00 : incoming;
    }

    let i = 0;
    let output = "";

    while (i < input.length) {
      const enc1 = indexof(input.charAt(i++));
      const enc2 = i >= input.length ? 0x00 : indexof(input.charAt(i++));
      const enc3 = i >= input.length ? 0x00 : indexof(input.charAt(i++));
      const enc4 = i >= input.length ? 0x00 : indexof(input.charAt(i++));
      const chr1 = test(enc1) << 2 | test(enc2) >> 4;
      const chr2 = (test(enc2) & 0x0F) << 4 | test(enc3) >> 2;
      const chr3 = (test(enc3) & 0x03) << 6 | test(enc4);
      output += String.fromCharCode(chr1);
      if (enc3 !== 64) output += String.fromCharCode(chr2);
      if (enc4 !== 64) output += String.fromCharCode(chr3);
    }

    if (cutTailZeros) {
      const outputLength = output.length;
      let nonZeroStart = -1;

      for (let i = outputLength - 1; i >= 0; i--) {
        if (output.charCodeAt(i) !== 0) {
          nonZeroStart = i;
          break;
        }
      }

      if (nonZeroStart !== -1) output = output.slice(0, nonZeroStart + 1);else output = "";
    }

    return output;
  }

  function arrayBufferToString(buffer) {
    let resultString = "";
    const view = new Uint8Array(buffer);

    for (const element of view) resultString += String.fromCharCode(element);

    return resultString;
  }

  function stringToArrayBuffer(str) {
    const stringLength = str.length;
    const resultBuffer = new ArrayBuffer(stringLength);
    const resultView = new Uint8Array(resultBuffer);

    for (let i = 0; i < stringLength; i++) resultView[i] = str.charCodeAt(i);

    return resultBuffer;
  }

  const log2 = Math.log(2);

  function nearestPowerOf2(length) {
    const base = Math.log(length) / log2;
    const floor = Math.floor(base);
    const round = Math.round(base);
    return floor === round ? floor : round;
  }

  function clearProps(object, propsArray) {
    for (const prop of propsArray) delete object[prop];
  }

  var utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getUTCDate: getUTCDate,
    getParametersValue: getParametersValue,
    bufferToHexCodes: bufferToHexCodes,
    checkBufferParams: checkBufferParams,
    utilFromBase: utilFromBase,
    utilToBase: utilToBase,
    utilConcatBuf: utilConcatBuf,
    utilConcatView: utilConcatView,
    utilDecodeTC: utilDecodeTC,
    utilEncodeTC: utilEncodeTC,
    isEqualBuffer: isEqualBuffer,
    padNumber: padNumber,
    toBase64: toBase64,
    fromBase64: fromBase64,
    arrayBufferToString: arrayBufferToString,
    stringToArrayBuffer: stringToArrayBuffer,
    nearestPowerOf2: nearestPowerOf2,
    clearProps: clearProps
  });
  var asn1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.fromBER = fromBER;
    exports.compareSchema = compareSchema;
    exports.verifySchema = verifySchema;
    exports.fromJSON = fromJSON;
    exports.RawData = exports.Repeated = exports.Any = exports.Choice = exports.TIME = exports.Duration = exports.DateTime = exports.TimeOfDay = exports.DATE = exports.GeneralizedTime = exports.UTCTime = exports.CharacterString = exports.GeneralString = exports.VisibleString = exports.GraphicString = exports.IA5String = exports.VideotexString = exports.TeletexString = exports.PrintableString = exports.NumericString = exports.UniversalString = exports.BmpString = exports.RelativeObjectIdentifier = exports.Utf8String = exports.ObjectIdentifier = exports.Enumerated = exports.Integer = exports.BitString = exports.OctetString = exports.Null = exports.Set = exports.Sequence = exports.Boolean = exports.EndOfContent = exports.Constructed = exports.Primitive = exports.BaseBlock = exports.ValueBlock = exports.HexBlock = void 0;
    const powers2 = [new Uint8Array([1])];
    const digitsString = "0123456789";

    class LocalBaseBlock {
      constructor(parameters = {}) {
        this.blockLength = (0, utils.getParametersValue)(parameters, "blockLength", 0);
        this.error = (0, utils.getParametersValue)(parameters, "error", "");
        this.warnings = (0, utils.getParametersValue)(parameters, "warnings", []);
        if ("valueBeforeDecode" in parameters) this.valueBeforeDecode = parameters.valueBeforeDecode.slice(0);else this.valueBeforeDecode = new ArrayBuffer(0);
      }

      static blockName() {
        return "baseBlock";
      }

      toJSON() {
        return {
          blockName: this.constructor.blockName(),
          blockLength: this.blockLength,
          error: this.error,
          warnings: this.warnings,
          valueBeforeDecode: (0, utils.bufferToHexCodes)(this.valueBeforeDecode, 0, this.valueBeforeDecode.byteLength)
        };
      }

    }

    const HexBlock = BaseClass => class LocalHexBlockMixin extends BaseClass {
      constructor(parameters = {}) {
        super(parameters);
        this.isHexOnly = (0, utils.getParametersValue)(parameters, "isHexOnly", false);
        if ("valueHex" in parameters) this.valueHex = parameters.valueHex.slice(0);else this.valueHex = new ArrayBuffer(0);
      }

      static blockName() {
        return "hexBlock";
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
        const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);

        if (intBuffer.length === 0) {
          this.warnings.push("Zero buffer length");
          return inputOffset;
        }

        this.valueHex = inputBuffer.slice(inputOffset, inputOffset + inputLength);
        this.blockLength = inputLength;
        return inputOffset + inputLength;
      }

      toBER(sizeOnly = false) {
        if (this.isHexOnly !== true) {
          this.error = "Flag \"isHexOnly\" is not set, abort";
          return new ArrayBuffer(0);
        }

        if (sizeOnly === true) return new ArrayBuffer(this.valueHex.byteLength);
        return this.valueHex.slice(0);
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.blockName = this.constructor.blockName();
        object.isHexOnly = this.isHexOnly;
        object.valueHex = (0, utils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);
        return object;
      }

    };

    exports.HexBlock = HexBlock;

    class LocalIdentificationBlock extends HexBlock(LocalBaseBlock) {
      constructor(parameters = {}) {
        super();

        if ("idBlock" in parameters) {
          this.isHexOnly = (0, utils.getParametersValue)(parameters.idBlock, "isHexOnly", false);
          this.valueHex = (0, utils.getParametersValue)(parameters.idBlock, "valueHex", new ArrayBuffer(0));
          this.tagClass = (0, utils.getParametersValue)(parameters.idBlock, "tagClass", -1);
          this.tagNumber = (0, utils.getParametersValue)(parameters.idBlock, "tagNumber", -1);
          this.isConstructed = (0, utils.getParametersValue)(parameters.idBlock, "isConstructed", false);
        } else {
          this.tagClass = -1;
          this.tagNumber = -1;
          this.isConstructed = false;
        }
      }

      static blockName() {
        return "identificationBlock";
      }

      toBER(sizeOnly = false) {
        let firstOctet = 0;
        let retBuf;
        let retView;

        switch (this.tagClass) {
          case 1:
            firstOctet |= 0x00;
            break;

          case 2:
            firstOctet |= 0x40;
            break;

          case 3:
            firstOctet |= 0x80;
            break;

          case 4:
            firstOctet |= 0xC0;
            break;

          default:
            this.error = "Unknown tag class";
            return new ArrayBuffer(0);
        }

        if (this.isConstructed) firstOctet |= 0x20;

        if (this.tagNumber < 31 && !this.isHexOnly) {
          retBuf = new ArrayBuffer(1);
          retView = new Uint8Array(retBuf);

          if (!sizeOnly) {
            let number = this.tagNumber;
            number &= 0x1F;
            firstOctet |= number;
            retView[0] = firstOctet;
          }

          return retBuf;
        }

        if (this.isHexOnly === false) {
          const encodedBuf = (0, utils.utilToBase)(this.tagNumber, 7);
          const encodedView = new Uint8Array(encodedBuf);
          const size = encodedBuf.byteLength;
          retBuf = new ArrayBuffer(size + 1);
          retView = new Uint8Array(retBuf);
          retView[0] = firstOctet | 0x1F;

          if (!sizeOnly) {
            for (let i = 0; i < size - 1; i++) retView[i + 1] = encodedView[i] | 0x80;

            retView[size] = encodedView[size - 1];
          }

          return retBuf;
        }

        retBuf = new ArrayBuffer(this.valueHex.byteLength + 1);
        retView = new Uint8Array(retBuf);
        retView[0] = firstOctet | 0x1F;

        if (sizeOnly === false) {
          const curView = new Uint8Array(this.valueHex);

          for (let i = 0; i < curView.length - 1; i++) retView[i + 1] = curView[i] | 0x80;

          retView[this.valueHex.byteLength] = curView[curView.length - 1];
        }

        return retBuf;
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
        const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);

        if (intBuffer.length === 0) {
          this.error = "Zero buffer length";
          return -1;
        }

        const tagClassMask = intBuffer[0] & 0xC0;

        switch (tagClassMask) {
          case 0x00:
            this.tagClass = 1;
            break;

          case 0x40:
            this.tagClass = 2;
            break;

          case 0x80:
            this.tagClass = 3;
            break;

          case 0xC0:
            this.tagClass = 4;
            break;

          default:
            this.error = "Unknown tag class";
            return -1;
        }

        this.isConstructed = (intBuffer[0] & 0x20) === 0x20;
        this.isHexOnly = false;
        const tagNumberMask = intBuffer[0] & 0x1F;

        if (tagNumberMask !== 0x1F) {
          this.tagNumber = tagNumberMask;
          this.blockLength = 1;
        } else {
          let count = 1;
          this.valueHex = new ArrayBuffer(255);
          let tagNumberBufferMaxLength = 255;
          let intTagNumberBuffer = new Uint8Array(this.valueHex);

          while (intBuffer[count] & 0x80) {
            intTagNumberBuffer[count - 1] = intBuffer[count] & 0x7F;
            count++;

            if (count >= intBuffer.length) {
              this.error = "End of input reached before message was fully decoded";
              return -1;
            }

            if (count === tagNumberBufferMaxLength) {
              tagNumberBufferMaxLength += 255;
              const tempBuffer = new ArrayBuffer(tagNumberBufferMaxLength);
              const tempBufferView = new Uint8Array(tempBuffer);

              for (let i = 0; i < intTagNumberBuffer.length; i++) tempBufferView[i] = intTagNumberBuffer[i];

              this.valueHex = new ArrayBuffer(tagNumberBufferMaxLength);
              intTagNumberBuffer = new Uint8Array(this.valueHex);
            }
          }

          this.blockLength = count + 1;
          intTagNumberBuffer[count - 1] = intBuffer[count] & 0x7F;
          const tempBuffer = new ArrayBuffer(count);
          const tempBufferView = new Uint8Array(tempBuffer);

          for (let i = 0; i < count; i++) tempBufferView[i] = intTagNumberBuffer[i];

          this.valueHex = new ArrayBuffer(count);
          intTagNumberBuffer = new Uint8Array(this.valueHex);
          intTagNumberBuffer.set(tempBufferView);
          if (this.blockLength <= 9) this.tagNumber = (0, utils.utilFromBase)(intTagNumberBuffer, 7);else {
            this.isHexOnly = true;
            this.warnings.push("Tag too long, represented as hex-coded");
          }
        }

        if (this.tagClass === 1 && this.isConstructed) {
          switch (this.tagNumber) {
            case 1:
            case 2:
            case 5:
            case 6:
            case 9:
            case 13:
            case 14:
            case 23:
            case 24:
            case 31:
            case 32:
            case 33:
            case 34:
              this.error = "Constructed encoding used for primitive type";
              return -1;
          }
        }

        return inputOffset + this.blockLength;
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.blockName = this.constructor.blockName();
        object.tagClass = this.tagClass;
        object.tagNumber = this.tagNumber;
        object.isConstructed = this.isConstructed;
        return object;
      }

    }

    class LocalLengthBlock extends LocalBaseBlock {
      constructor(parameters = {}) {
        super();

        if ("lenBlock" in parameters) {
          this.isIndefiniteForm = (0, utils.getParametersValue)(parameters.lenBlock, "isIndefiniteForm", false);
          this.longFormUsed = (0, utils.getParametersValue)(parameters.lenBlock, "longFormUsed", false);
          this.length = (0, utils.getParametersValue)(parameters.lenBlock, "length", 0);
        } else {
          this.isIndefiniteForm = false;
          this.longFormUsed = false;
          this.length = 0;
        }
      }

      static blockName() {
        return "lengthBlock";
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
        const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);

        if (intBuffer.length === 0) {
          this.error = "Zero buffer length";
          return -1;
        }

        if (intBuffer[0] === 0xFF) {
          this.error = "Length block 0xFF is reserved by standard";
          return -1;
        }

        this.isIndefiniteForm = intBuffer[0] === 0x80;

        if (this.isIndefiniteForm === true) {
          this.blockLength = 1;
          return inputOffset + this.blockLength;
        }

        this.longFormUsed = !!(intBuffer[0] & 0x80);

        if (this.longFormUsed === false) {
          this.length = intBuffer[0];
          this.blockLength = 1;
          return inputOffset + this.blockLength;
        }

        const count = intBuffer[0] & 0x7F;

        if (count > 8) {
          this.error = "Too big integer";
          return -1;
        }

        if (count + 1 > intBuffer.length) {
          this.error = "End of input reached before message was fully decoded";
          return -1;
        }

        const lengthBufferView = new Uint8Array(count);

        for (let i = 0; i < count; i++) lengthBufferView[i] = intBuffer[i + 1];

        if (lengthBufferView[count - 1] === 0x00) this.warnings.push("Needlessly long encoded length");
        this.length = (0, utils.utilFromBase)(lengthBufferView, 8);
        if (this.longFormUsed && this.length <= 127) this.warnings.push("Unneccesary usage of long length form");
        this.blockLength = count + 1;
        return inputOffset + this.blockLength;
      }

      toBER(sizeOnly = false) {
        let retBuf;
        let retView;
        if (this.length > 127) this.longFormUsed = true;

        if (this.isIndefiniteForm) {
          retBuf = new ArrayBuffer(1);

          if (sizeOnly === false) {
            retView = new Uint8Array(retBuf);
            retView[0] = 0x80;
          }

          return retBuf;
        }

        if (this.longFormUsed === true) {
          const encodedBuf = (0, utils.utilToBase)(this.length, 8);

          if (encodedBuf.byteLength > 127) {
            this.error = "Too big length";
            return new ArrayBuffer(0);
          }

          retBuf = new ArrayBuffer(encodedBuf.byteLength + 1);
          if (sizeOnly === true) return retBuf;
          const encodedView = new Uint8Array(encodedBuf);
          retView = new Uint8Array(retBuf);
          retView[0] = encodedBuf.byteLength | 0x80;

          for (let i = 0; i < encodedBuf.byteLength; i++) retView[i + 1] = encodedView[i];

          return retBuf;
        }

        retBuf = new ArrayBuffer(1);

        if (sizeOnly === false) {
          retView = new Uint8Array(retBuf);
          retView[0] = this.length;
        }

        return retBuf;
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.blockName = this.constructor.blockName();
        object.isIndefiniteForm = this.isIndefiniteForm;
        object.longFormUsed = this.longFormUsed;
        object.length = this.length;
        return object;
      }

    }

    class ValueBlock extends LocalBaseBlock {
      constructor(parameters = {}) {
        super(parameters);
      }

      static blockName() {
        return "valueBlock";
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        throw TypeError("User need to make a specific function in a class which extends \"ValueBlock\"");
      }

      toBER(sizeOnly = false) {
        throw TypeError("User need to make a specific function in a class which extends \"ValueBlock\"");
      }

    }

    exports.ValueBlock = ValueBlock;

    class BaseBlock extends LocalBaseBlock {
      constructor(parameters = {}, valueBlockType = ValueBlock) {
        super(parameters);
        if ("name" in parameters) this.name = parameters.name;
        if ("optional" in parameters) this.optional = parameters.optional;
        if ("primitiveSchema" in parameters) this.primitiveSchema = parameters.primitiveSchema;
        this.idBlock = new LocalIdentificationBlock(parameters);
        this.lenBlock = new LocalLengthBlock(parameters);
        this.valueBlock = new valueBlockType(parameters);
      }

      static blockName() {
        return "BaseBlock";
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

        if (resultOffset === -1) {
          this.error = this.valueBlock.error;
          return resultOffset;
        }

        if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
        if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
        if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
        return resultOffset;
      }

      toBER(sizeOnly = false) {
        let retBuf;
        const idBlockBuf = this.idBlock.toBER(sizeOnly);
        const valueBlockSizeBuf = this.valueBlock.toBER(true);
        this.lenBlock.length = valueBlockSizeBuf.byteLength;
        const lenBlockBuf = this.lenBlock.toBER(sizeOnly);
        retBuf = (0, utils.utilConcatBuf)(idBlockBuf, lenBlockBuf);
        let valueBlockBuf;
        if (sizeOnly === false) valueBlockBuf = this.valueBlock.toBER(sizeOnly);else valueBlockBuf = new ArrayBuffer(this.lenBlock.length);
        retBuf = (0, utils.utilConcatBuf)(retBuf, valueBlockBuf);

        if (this.lenBlock.isIndefiniteForm === true) {
          const indefBuf = new ArrayBuffer(2);

          if (sizeOnly === false) {
            const indefView = new Uint8Array(indefBuf);
            indefView[0] = 0x00;
            indefView[1] = 0x00;
          }

          retBuf = (0, utils.utilConcatBuf)(retBuf, indefBuf);
        }

        return retBuf;
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.idBlock = this.idBlock.toJSON();
        object.lenBlock = this.lenBlock.toJSON();
        object.valueBlock = this.valueBlock.toJSON();
        if ("name" in this) object.name = this.name;
        if ("optional" in this) object.optional = this.optional;
        if ("primitiveSchema" in this) object.primitiveSchema = this.primitiveSchema.toJSON();
        return object;
      }

    }

    exports.BaseBlock = BaseBlock;

    class LocalPrimitiveValueBlock extends ValueBlock {
      constructor(parameters = {}) {
        super(parameters);
        if ("valueHex" in parameters) this.valueHex = parameters.valueHex.slice(0);else this.valueHex = new ArrayBuffer(0);
        this.isHexOnly = (0, utils.getParametersValue)(parameters, "isHexOnly", true);
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
        const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);

        if (intBuffer.length === 0) {
          this.warnings.push("Zero buffer length");
          return inputOffset;
        }

        this.valueHex = new ArrayBuffer(intBuffer.length);
        const valueHexView = new Uint8Array(this.valueHex);

        for (let i = 0; i < intBuffer.length; i++) valueHexView[i] = intBuffer[i];

        this.blockLength = inputLength;
        return inputOffset + inputLength;
      }

      toBER(sizeOnly = false) {
        return this.valueHex.slice(0);
      }

      static blockName() {
        return "PrimitiveValueBlock";
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.valueHex = (0, utils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);
        object.isHexOnly = this.isHexOnly;
        return object;
      }

    }

    class Primitive extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalPrimitiveValueBlock);
        this.idBlock.isConstructed = false;
      }

      static blockName() {
        return "PRIMITIVE";
      }

    }

    exports.Primitive = Primitive;

    class LocalConstructedValueBlock extends ValueBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.value = (0, utils.getParametersValue)(parameters, "value", []);
        this.isIndefiniteForm = (0, utils.getParametersValue)(parameters, "isIndefiniteForm", false);
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        const initialOffset = inputOffset;
        const initialLength = inputLength;
        if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
        const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);

        if (intBuffer.length === 0) {
          this.warnings.push("Zero buffer length");
          return inputOffset;
        }

        function checkLen(indefiniteLength, length) {
          if (indefiniteLength === true) return 1;
          return length;
        }

        let currentOffset = inputOffset;

        while (checkLen(this.isIndefiniteForm, inputLength) > 0) {
          const returnObject = LocalFromBER(inputBuffer, currentOffset, inputLength);

          if (returnObject.offset === -1) {
            this.error = returnObject.result.error;
            this.warnings.concat(returnObject.result.warnings);
            return -1;
          }

          currentOffset = returnObject.offset;
          this.blockLength += returnObject.result.blockLength;
          inputLength -= returnObject.result.blockLength;
          this.value.push(returnObject.result);
          if (this.isIndefiniteForm === true && returnObject.result.constructor.blockName() === EndOfContent.blockName()) break;
        }

        if (this.isIndefiniteForm === true) {
          if (this.value[this.value.length - 1].constructor.blockName() === EndOfContent.blockName()) this.value.pop();else this.warnings.push("No EndOfContent block encoded");
        }

        this.valueBeforeDecode = inputBuffer.slice(initialOffset, initialOffset + initialLength);
        return currentOffset;
      }

      toBER(sizeOnly = false) {
        let retBuf = new ArrayBuffer(0);

        for (let i = 0; i < this.value.length; i++) {
          const valueBuf = this.value[i].toBER(sizeOnly);
          retBuf = (0, utils.utilConcatBuf)(retBuf, valueBuf);
        }

        return retBuf;
      }

      static blockName() {
        return "ConstructedValueBlock";
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.isIndefiniteForm = this.isIndefiniteForm;
        object.value = [];

        for (let i = 0; i < this.value.length; i++) object.value.push(this.value[i].toJSON());

        return object;
      }

    }

    class Constructed extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalConstructedValueBlock);
        this.idBlock.isConstructed = true;
      }

      static blockName() {
        return "CONSTRUCTED";
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
        const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

        if (resultOffset === -1) {
          this.error = this.valueBlock.error;
          return resultOffset;
        }

        if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
        if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
        if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
        return resultOffset;
      }

    }

    exports.Constructed = Constructed;

    class LocalEndOfContentValueBlock extends ValueBlock {
      constructor(parameters = {}) {
        super(parameters);
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        return inputOffset;
      }

      toBER(sizeOnly = false) {
        return new ArrayBuffer(0);
      }

      static blockName() {
        return "EndOfContentValueBlock";
      }

    }

    class EndOfContent extends BaseBlock {
      constructor(paramaters = {}) {
        super(paramaters, LocalEndOfContentValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 0;
      }

      static blockName() {
        return "EndOfContent";
      }

    }

    exports.EndOfContent = EndOfContent;

    class LocalBooleanValueBlock extends ValueBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.value = (0, utils.getParametersValue)(parameters, "value", false);
        this.isHexOnly = (0, utils.getParametersValue)(parameters, "isHexOnly", false);
        if ("valueHex" in parameters) this.valueHex = parameters.valueHex.slice(0);else {
          this.valueHex = new ArrayBuffer(1);

          if (this.value === true) {
            const view = new Uint8Array(this.valueHex);
            view[0] = 0xFF;
          }
        }
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
        const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);
        if (inputLength > 1) this.warnings.push("Boolean value encoded in more then 1 octet");
        this.isHexOnly = true;
        this.valueHex = new ArrayBuffer(intBuffer.length);
        const view = new Uint8Array(this.valueHex);

        for (let i = 0; i < intBuffer.length; i++) view[i] = intBuffer[i];

        if (utils.utilDecodeTC.call(this) !== 0) this.value = true;else this.value = false;
        this.blockLength = inputLength;
        return inputOffset + inputLength;
      }

      toBER(sizeOnly = false) {
        return this.valueHex;
      }

      static blockName() {
        return "BooleanValueBlock";
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.value = this.value;
        object.isHexOnly = this.isHexOnly;
        object.valueHex = (0, utils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);
        return object;
      }

    }

    class Boolean extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalBooleanValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 1;
      }

      static blockName() {
        return "Boolean";
      }

    }

    exports.Boolean = Boolean;

    class Sequence extends Constructed {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 16;
      }

      static blockName() {
        return "Sequence";
      }

    }

    exports.Sequence = Sequence;

    class Set extends Constructed {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 17;
      }

      static blockName() {
        return "Set";
      }

    }

    exports.Set = Set;

    class Null extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalBaseBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 5;
      }

      static blockName() {
        return "Null";
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        if (this.lenBlock.length > 0) this.warnings.push("Non-zero length of value block for Null type");
        if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
        if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
        this.blockLength += inputLength;

        if (inputOffset + inputLength > inputBuffer.byteLength) {
          this.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
          return -1;
        }

        return inputOffset + inputLength;
      }

      toBER(sizeOnly = false) {
        const retBuf = new ArrayBuffer(2);
        if (sizeOnly === true) return retBuf;
        const retView = new Uint8Array(retBuf);
        retView[0] = 0x05;
        retView[1] = 0x00;
        return retBuf;
      }

    }

    exports.Null = Null;

    class LocalOctetStringValueBlock extends HexBlock(LocalConstructedValueBlock) {
      constructor(parameters = {}) {
        super(parameters);
        this.isConstructed = (0, utils.getParametersValue)(parameters, "isConstructed", false);
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        let resultOffset = 0;

        if (this.isConstructed === true) {
          this.isHexOnly = false;
          resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
          if (resultOffset === -1) return resultOffset;

          for (let i = 0; i < this.value.length; i++) {
            const currentBlockName = this.value[i].constructor.blockName();

            if (currentBlockName === EndOfContent.blockName()) {
              if (this.isIndefiniteForm === true) break;else {
                this.error = "EndOfContent is unexpected, OCTET STRING may consists of OCTET STRINGs only";
                return -1;
              }
            }

            if (currentBlockName !== OctetString.blockName()) {
              this.error = "OCTET STRING may consists of OCTET STRINGs only";
              return -1;
            }
          }
        } else {
          this.isHexOnly = true;
          resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
          this.blockLength = inputLength;
        }

        return resultOffset;
      }

      toBER(sizeOnly = false) {
        if (this.isConstructed === true) return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly);
        let retBuf = new ArrayBuffer(this.valueHex.byteLength);
        if (sizeOnly === true) return retBuf;
        if (this.valueHex.byteLength === 0) return retBuf;
        retBuf = this.valueHex.slice(0);
        return retBuf;
      }

      static blockName() {
        return "OctetStringValueBlock";
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.isConstructed = this.isConstructed;
        object.isHexOnly = this.isHexOnly;
        object.valueHex = (0, utils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);
        return object;
      }

    }

    class OctetString extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalOctetStringValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 4;
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        this.valueBlock.isConstructed = this.idBlock.isConstructed;
        this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;

        if (inputLength === 0) {
          if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
          if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
          return inputOffset;
        }

        return super.fromBER(inputBuffer, inputOffset, inputLength);
      }

      static blockName() {
        return "OctetString";
      }

      isEqual(octetString) {
        if (octetString instanceof OctetString === false) return false;
        if (JSON.stringify(this) !== JSON.stringify(octetString)) return false;
        return true;
      }

    }

    exports.OctetString = OctetString;

    class LocalBitStringValueBlock extends HexBlock(LocalConstructedValueBlock) {
      constructor(parameters = {}) {
        super(parameters);
        this.unusedBits = (0, utils.getParametersValue)(parameters, "unusedBits", 0);
        this.isConstructed = (0, utils.getParametersValue)(parameters, "isConstructed", false);
        this.blockLength = this.valueHex.byteLength;
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        if (inputLength === 0) return inputOffset;
        let resultOffset = -1;

        if (this.isConstructed === true) {
          resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
          if (resultOffset === -1) return resultOffset;

          for (let i = 0; i < this.value.length; i++) {
            const currentBlockName = this.value[i].constructor.blockName();

            if (currentBlockName === EndOfContent.blockName()) {
              if (this.isIndefiniteForm === true) break;else {
                this.error = "EndOfContent is unexpected, BIT STRING may consists of BIT STRINGs only";
                return -1;
              }
            }

            if (currentBlockName !== BitString.blockName()) {
              this.error = "BIT STRING may consists of BIT STRINGs only";
              return -1;
            }

            if (this.unusedBits > 0 && this.value[i].valueBlock.unusedBits > 0) {
              this.error = "Usign of \"unused bits\" inside constructive BIT STRING allowed for least one only";
              return -1;
            }

            this.unusedBits = this.value[i].valueBlock.unusedBits;

            if (this.unusedBits > 7) {
              this.error = "Unused bits for BitString must be in range 0-7";
              return -1;
            }
          }

          return resultOffset;
        }

        if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
        const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);
        this.unusedBits = intBuffer[0];

        if (this.unusedBits > 7) {
          this.error = "Unused bits for BitString must be in range 0-7";
          return -1;
        }

        this.valueHex = new ArrayBuffer(intBuffer.length - 1);
        const view = new Uint8Array(this.valueHex);

        for (let i = 0; i < inputLength - 1; i++) view[i] = intBuffer[i + 1];

        this.blockLength = intBuffer.length;
        return inputOffset + inputLength;
      }

      toBER(sizeOnly = false) {
        if (this.isConstructed === true) return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly);
        if (sizeOnly === true) return new ArrayBuffer(this.valueHex.byteLength + 1);
        if (this.valueHex.byteLength === 0) return new ArrayBuffer(0);
        const curView = new Uint8Array(this.valueHex);
        const retBuf = new ArrayBuffer(this.valueHex.byteLength + 1);
        const retView = new Uint8Array(retBuf);
        retView[0] = this.unusedBits;

        for (let i = 0; i < this.valueHex.byteLength; i++) retView[i + 1] = curView[i];

        return retBuf;
      }

      static blockName() {
        return "BitStringValueBlock";
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.unusedBits = this.unusedBits;
        object.isConstructed = this.isConstructed;
        object.isHexOnly = this.isHexOnly;
        object.valueHex = (0, utils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);
        return object;
      }

    }

    class BitString extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalBitStringValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 3;
      }

      static blockName() {
        return "BitString";
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        if (inputLength === 0) return inputOffset;
        this.valueBlock.isConstructed = this.idBlock.isConstructed;
        this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
        return super.fromBER(inputBuffer, inputOffset, inputLength);
      }

      isEqual(bitString) {
        if (bitString instanceof BitString === false) return false;
        if (JSON.stringify(this) !== JSON.stringify(bitString)) return false;
        return true;
      }

    }

    exports.BitString = BitString;

    class LocalIntegerValueBlock extends HexBlock(ValueBlock) {
      constructor(parameters = {}) {
        super(parameters);
        if ("value" in parameters) this.valueDec = parameters.value;
      }

      set valueHex(_value) {
        this._valueHex = _value.slice(0);

        if (_value.byteLength >= 4) {
          this.warnings.push("Too big Integer for decoding, hex only");
          this.isHexOnly = true;
          this._valueDec = 0;
        } else {
          this.isHexOnly = false;
          if (_value.byteLength > 0) this._valueDec = utils.utilDecodeTC.call(this);
        }
      }

      get valueHex() {
        return this._valueHex;
      }

      set valueDec(_value) {
        this._valueDec = _value;
        this.isHexOnly = false;
        this._valueHex = (0, utils.utilEncodeTC)(_value);
      }

      get valueDec() {
        return this._valueDec;
      }

      fromDER(inputBuffer, inputOffset, inputLength, expectedLength = 0) {
        const offset = this.fromBER(inputBuffer, inputOffset, inputLength);
        if (offset === -1) return offset;
        const view = new Uint8Array(this._valueHex);

        if (view[0] === 0x00 && (view[1] & 0x80) !== 0) {
          const updatedValueHex = new ArrayBuffer(this._valueHex.byteLength - 1);
          const updatedView = new Uint8Array(updatedValueHex);
          updatedView.set(new Uint8Array(this._valueHex, 1, this._valueHex.byteLength - 1));
          this._valueHex = updatedValueHex.slice(0);
        } else {
          if (expectedLength !== 0) {
            if (this._valueHex.byteLength < expectedLength) {
              if (expectedLength - this._valueHex.byteLength > 1) expectedLength = this._valueHex.byteLength + 1;
              const updatedValueHex = new ArrayBuffer(expectedLength);
              const updatedView = new Uint8Array(updatedValueHex);
              updatedView.set(view, expectedLength - this._valueHex.byteLength);
              this._valueHex = updatedValueHex.slice(0);
            }
          }
        }

        return offset;
      }

      toDER(sizeOnly = false) {
        const view = new Uint8Array(this._valueHex);

        switch (true) {
          case (view[0] & 0x80) !== 0:
            {
              const updatedValueHex = new ArrayBuffer(this._valueHex.byteLength + 1);
              const updatedView = new Uint8Array(updatedValueHex);
              updatedView[0] = 0x00;
              updatedView.set(view, 1);
              this._valueHex = updatedValueHex.slice(0);
            }
            break;

          case view[0] === 0x00 && (view[1] & 0x80) === 0:
            {
              const updatedValueHex = new ArrayBuffer(this._valueHex.byteLength - 1);
              const updatedView = new Uint8Array(updatedValueHex);
              updatedView.set(new Uint8Array(this._valueHex, 1, this._valueHex.byteLength - 1));
              this._valueHex = updatedValueHex.slice(0);
            }
            break;
        }

        return this.toBER(sizeOnly);
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        const resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
        if (resultOffset === -1) return resultOffset;
        this.blockLength = inputLength;
        return inputOffset + inputLength;
      }

      toBER(sizeOnly = false) {
        return this.valueHex.slice(0);
      }

      static blockName() {
        return "IntegerValueBlock";
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.valueDec = this.valueDec;
        return object;
      }

      toString() {
        function viewAdd(first, second) {
          const c = new Uint8Array([0]);
          let firstView = new Uint8Array(first);
          let secondView = new Uint8Array(second);
          let firstViewCopy = firstView.slice(0);
          const firstViewCopyLength = firstViewCopy.length - 1;
          let secondViewCopy = secondView.slice(0);
          const secondViewCopyLength = secondViewCopy.length - 1;
          let value = 0;
          const max = secondViewCopyLength < firstViewCopyLength ? firstViewCopyLength : secondViewCopyLength;
          let counter = 0;

          for (let i = max; i >= 0; i--, counter++) {
            switch (true) {
              case counter < secondViewCopy.length:
                value = firstViewCopy[firstViewCopyLength - counter] + secondViewCopy[secondViewCopyLength - counter] + c[0];
                break;

              default:
                value = firstViewCopy[firstViewCopyLength - counter] + c[0];
            }

            c[0] = value / 10;

            switch (true) {
              case counter >= firstViewCopy.length:
                firstViewCopy = (0, utils.utilConcatView)(new Uint8Array([value % 10]), firstViewCopy);
                break;

              default:
                firstViewCopy[firstViewCopyLength - counter] = value % 10;
            }
          }

          if (c[0] > 0) firstViewCopy = (0, utils.utilConcatView)(c, firstViewCopy);
          return firstViewCopy.slice(0);
        }

        function power2(n) {
          if (n >= powers2.length) {
            for (let p = powers2.length; p <= n; p++) {
              const c = new Uint8Array([0]);
              let digits = powers2[p - 1].slice(0);

              for (let i = digits.length - 1; i >= 0; i--) {
                const newValue = new Uint8Array([(digits[i] << 1) + c[0]]);
                c[0] = newValue[0] / 10;
                digits[i] = newValue[0] % 10;
              }

              if (c[0] > 0) digits = (0, utils.utilConcatView)(c, digits);
              powers2.push(digits);
            }
          }

          return powers2[n];
        }

        function viewSub(first, second) {
          let b = 0;
          let firstView = new Uint8Array(first);
          let secondView = new Uint8Array(second);
          let firstViewCopy = firstView.slice(0);
          const firstViewCopyLength = firstViewCopy.length - 1;
          let secondViewCopy = secondView.slice(0);
          const secondViewCopyLength = secondViewCopy.length - 1;
          let value;
          let counter = 0;

          for (let i = secondViewCopyLength; i >= 0; i--, counter++) {
            value = firstViewCopy[firstViewCopyLength - counter] - secondViewCopy[secondViewCopyLength - counter] - b;

            switch (true) {
              case value < 0:
                b = 1;
                firstViewCopy[firstViewCopyLength - counter] = value + 10;
                break;

              default:
                b = 0;
                firstViewCopy[firstViewCopyLength - counter] = value;
            }
          }

          if (b > 0) {
            for (let i = firstViewCopyLength - secondViewCopyLength + 1; i >= 0; i--, counter++) {
              value = firstViewCopy[firstViewCopyLength - counter] - b;

              if (value < 0) {
                b = 1;
                firstViewCopy[firstViewCopyLength - counter] = value + 10;
              } else {
                b = 0;
                firstViewCopy[firstViewCopyLength - counter] = value;
                break;
              }
            }
          }

          return firstViewCopy.slice();
        }

        const firstBit = this._valueHex.byteLength * 8 - 1;
        let digits = new Uint8Array(this._valueHex.byteLength * 8 / 3);
        let bitNumber = 0;
        let currentByte;
        const asn1View = new Uint8Array(this._valueHex);
        let result = "";
        let flag = false;

        for (let byteNumber = this._valueHex.byteLength - 1; byteNumber >= 0; byteNumber--) {
          currentByte = asn1View[byteNumber];

          for (let i = 0; i < 8; i++) {
            if ((currentByte & 1) === 1) {
              switch (bitNumber) {
                case firstBit:
                  digits = viewSub(power2(bitNumber), digits);
                  result = "-";
                  break;

                default:
                  digits = viewAdd(digits, power2(bitNumber));
              }
            }

            bitNumber++;
            currentByte >>= 1;
          }
        }

        for (let i = 0; i < digits.length; i++) {
          if (digits[i]) flag = true;
          if (flag) result += digitsString.charAt(digits[i]);
        }

        if (flag === false) result += digitsString.charAt(0);
        return result;
      }

    }

    class Integer extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalIntegerValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 2;
      }

      static blockName() {
        return "Integer";
      }

      isEqual(otherValue) {
        if (otherValue instanceof Integer) {
          if (this.valueBlock.isHexOnly && otherValue.valueBlock.isHexOnly) return (0, utils.isEqualBuffer)(this.valueBlock.valueHex, otherValue.valueBlock.valueHex);
          if (this.valueBlock.isHexOnly === otherValue.valueBlock.isHexOnly) return this.valueBlock.valueDec === otherValue.valueBlock.valueDec;
          return false;
        }

        if (otherValue instanceof ArrayBuffer) return (0, utils.isEqualBuffer)(this.valueBlock.valueHex, otherValue);
        return false;
      }

      convertToDER() {
        const integer = new Integer({
          valueHex: this.valueBlock.valueHex
        });
        integer.valueBlock.toDER();
        return integer;
      }

      convertFromDER() {
        const expectedLength = this.valueBlock.valueHex.byteLength % 2 ? this.valueBlock.valueHex.byteLength + 1 : this.valueBlock.valueHex.byteLength;
        const integer = new Integer({
          valueHex: this.valueBlock.valueHex
        });
        integer.valueBlock.fromDER(integer.valueBlock.valueHex, 0, integer.valueBlock.valueHex.byteLength, expectedLength);
        return integer;
      }

    }

    exports.Integer = Integer;

    class Enumerated extends Integer {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 10;
      }

      static blockName() {
        return "Enumerated";
      }

    }

    exports.Enumerated = Enumerated;

    class LocalSidValueBlock extends HexBlock(LocalBaseBlock) {
      constructor(parameters = {}) {
        super(parameters);
        this.valueDec = (0, utils.getParametersValue)(parameters, "valueDec", -1);
        this.isFirstSid = (0, utils.getParametersValue)(parameters, "isFirstSid", false);
      }

      static blockName() {
        return "sidBlock";
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        if (inputLength === 0) return inputOffset;
        if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
        const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);
        this.valueHex = new ArrayBuffer(inputLength);
        let view = new Uint8Array(this.valueHex);

        for (let i = 0; i < inputLength; i++) {
          view[i] = intBuffer[i] & 0x7F;
          this.blockLength++;
          if ((intBuffer[i] & 0x80) === 0x00) break;
        }

        const tempValueHex = new ArrayBuffer(this.blockLength);
        const tempView = new Uint8Array(tempValueHex);

        for (let i = 0; i < this.blockLength; i++) tempView[i] = view[i];

        this.valueHex = tempValueHex.slice(0);
        view = new Uint8Array(this.valueHex);

        if ((intBuffer[this.blockLength - 1] & 0x80) !== 0x00) {
          this.error = "End of input reached before message was fully decoded";
          return -1;
        }

        if (view[0] === 0x00) this.warnings.push("Needlessly long format of SID encoding");
        if (this.blockLength <= 8) this.valueDec = (0, utils.utilFromBase)(view, 7);else {
          this.isHexOnly = true;
          this.warnings.push("Too big SID for decoding, hex only");
        }
        return inputOffset + this.blockLength;
      }

      toBER(sizeOnly = false) {
        let retBuf;
        let retView;

        if (this.isHexOnly) {
          if (sizeOnly === true) return new ArrayBuffer(this.valueHex.byteLength);
          const curView = new Uint8Array(this.valueHex);
          retBuf = new ArrayBuffer(this.blockLength);
          retView = new Uint8Array(retBuf);

          for (let i = 0; i < this.blockLength - 1; i++) retView[i] = curView[i] | 0x80;

          retView[this.blockLength - 1] = curView[this.blockLength - 1];
          return retBuf;
        }

        const encodedBuf = (0, utils.utilToBase)(this.valueDec, 7);

        if (encodedBuf.byteLength === 0) {
          this.error = "Error during encoding SID value";
          return new ArrayBuffer(0);
        }

        retBuf = new ArrayBuffer(encodedBuf.byteLength);

        if (sizeOnly === false) {
          const encodedView = new Uint8Array(encodedBuf);
          retView = new Uint8Array(retBuf);

          for (let i = 0; i < encodedBuf.byteLength - 1; i++) retView[i] = encodedView[i] | 0x80;

          retView[encodedBuf.byteLength - 1] = encodedView[encodedBuf.byteLength - 1];
        }

        return retBuf;
      }

      toString() {
        let result = "";
        if (this.isHexOnly === true) result = (0, utils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);else {
          if (this.isFirstSid) {
            let sidValue = this.valueDec;
            if (this.valueDec <= 39) result = "0.";else {
              if (this.valueDec <= 79) {
                result = "1.";
                sidValue -= 40;
              } else {
                result = "2.";
                sidValue -= 80;
              }
            }
            result += sidValue.toString();
          } else result = this.valueDec.toString();
        }
        return result;
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.valueDec = this.valueDec;
        object.isFirstSid = this.isFirstSid;
        return object;
      }

    }

    class LocalObjectIdentifierValueBlock extends ValueBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.fromString((0, utils.getParametersValue)(parameters, "value", ""));
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        let resultOffset = inputOffset;

        while (inputLength > 0) {
          const sidBlock = new LocalSidValueBlock();
          resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);

          if (resultOffset === -1) {
            this.blockLength = 0;
            this.error = sidBlock.error;
            return resultOffset;
          }

          if (this.value.length === 0) sidBlock.isFirstSid = true;
          this.blockLength += sidBlock.blockLength;
          inputLength -= sidBlock.blockLength;
          this.value.push(sidBlock);
        }

        return resultOffset;
      }

      toBER(sizeOnly = false) {
        let retBuf = new ArrayBuffer(0);

        for (let i = 0; i < this.value.length; i++) {
          const valueBuf = this.value[i].toBER(sizeOnly);

          if (valueBuf.byteLength === 0) {
            this.error = this.value[i].error;
            return new ArrayBuffer(0);
          }

          retBuf = (0, utils.utilConcatBuf)(retBuf, valueBuf);
        }

        return retBuf;
      }

      fromString(string) {
        this.value = [];
        let pos1 = 0;
        let pos2 = 0;
        let sid = "";
        let flag = false;

        do {
          pos2 = string.indexOf(".", pos1);
          if (pos2 === -1) sid = string.substr(pos1);else sid = string.substr(pos1, pos2 - pos1);
          pos1 = pos2 + 1;

          if (flag) {
            const sidBlock = this.value[0];
            let plus = 0;

            switch (sidBlock.valueDec) {
              case 0:
                break;

              case 1:
                plus = 40;
                break;

              case 2:
                plus = 80;
                break;

              default:
                this.value = [];
                return false;
            }

            const parsedSID = parseInt(sid, 10);
            if (isNaN(parsedSID)) return true;
            sidBlock.valueDec = parsedSID + plus;
            flag = false;
          } else {
            const sidBlock = new LocalSidValueBlock();
            sidBlock.valueDec = parseInt(sid, 10);
            if (isNaN(sidBlock.valueDec)) return true;

            if (this.value.length === 0) {
              sidBlock.isFirstSid = true;
              flag = true;
            }

            this.value.push(sidBlock);
          }
        } while (pos2 !== -1);

        return true;
      }

      toString() {
        let result = "";
        let isHexOnly = false;

        for (let i = 0; i < this.value.length; i++) {
          isHexOnly = this.value[i].isHexOnly;
          let sidStr = this.value[i].toString();
          if (i !== 0) result = `${result}.`;

          if (isHexOnly) {
            sidStr = `{${sidStr}}`;
            if (this.value[i].isFirstSid) result = `2.{${sidStr} - 80}`;else result += sidStr;
          } else result += sidStr;
        }

        return result;
      }

      static blockName() {
        return "ObjectIdentifierValueBlock";
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.value = this.toString();
        object.sidArray = [];

        for (let i = 0; i < this.value.length; i++) object.sidArray.push(this.value[i].toJSON());

        return object;
      }

    }

    class ObjectIdentifier extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalObjectIdentifierValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 6;
      }

      static blockName() {
        return "ObjectIdentifier";
      }

    }

    exports.ObjectIdentifier = ObjectIdentifier;

    class LocalUtf8StringValueBlock extends HexBlock(LocalBaseBlock) {
      constructor(parameters = {}) {
        super(parameters);
        this.isHexOnly = true;
        this.value = "";
      }

      static blockName() {
        return "Utf8StringValueBlock";
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.value = this.value;
        return object;
      }

    }

    class Utf8String extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalUtf8StringValueBlock);
        if ("value" in parameters) this.fromString(parameters.value);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 12;
      }

      static blockName() {
        return "Utf8String";
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

        if (resultOffset === -1) {
          this.error = this.valueBlock.error;
          return resultOffset;
        }

        this.fromBuffer(this.valueBlock.valueHex);
        if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
        if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
        if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
        return resultOffset;
      }

      fromBuffer(inputBuffer) {
        this.valueBlock.value = String.fromCharCode.apply(null, new Uint8Array(inputBuffer));

        try {
          this.valueBlock.value = decodeURIComponent(escape(this.valueBlock.value));
        } catch (ex) {
          this.warnings.push(`Error during "decodeURIComponent": ${ex}, using raw string`);
        }
      }

      fromString(inputString) {
        const str = unescape(encodeURIComponent(inputString));
        const strLen = str.length;
        this.valueBlock.valueHex = new ArrayBuffer(strLen);
        const view = new Uint8Array(this.valueBlock.valueHex);

        for (let i = 0; i < strLen; i++) view[i] = str.charCodeAt(i);

        this.valueBlock.value = inputString;
      }

    }

    exports.Utf8String = Utf8String;

    class LocalRelativeSidValueBlock extends HexBlock(LocalBaseBlock) {
      constructor(parameters = {}) {
        super(parameters);
        this.valueDec = (0, utils.getParametersValue)(parameters, "valueDec", -1);
      }

      static blockName() {
        return "relativeSidBlock";
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        if (inputLength === 0) return inputOffset;
        if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
        const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);
        this.valueHex = new ArrayBuffer(inputLength);
        let view = new Uint8Array(this.valueHex);

        for (let i = 0; i < inputLength; i++) {
          view[i] = intBuffer[i] & 0x7F;
          this.blockLength++;
          if ((intBuffer[i] & 0x80) === 0x00) break;
        }

        const tempValueHex = new ArrayBuffer(this.blockLength);
        const tempView = new Uint8Array(tempValueHex);

        for (let i = 0; i < this.blockLength; i++) tempView[i] = view[i];

        this.valueHex = tempValueHex.slice(0);
        view = new Uint8Array(this.valueHex);

        if ((intBuffer[this.blockLength - 1] & 0x80) !== 0x00) {
          this.error = "End of input reached before message was fully decoded";
          return -1;
        }

        if (view[0] === 0x00) this.warnings.push("Needlessly long format of SID encoding");
        if (this.blockLength <= 8) this.valueDec = (0, utils.utilFromBase)(view, 7);else {
          this.isHexOnly = true;
          this.warnings.push("Too big SID for decoding, hex only");
        }
        return inputOffset + this.blockLength;
      }

      toBER(sizeOnly = false) {
        let retBuf;
        let retView;

        if (this.isHexOnly) {
          if (sizeOnly === true) return new ArrayBuffer(this.valueHex.byteLength);
          const curView = new Uint8Array(this.valueHex);
          retBuf = new ArrayBuffer(this.blockLength);
          retView = new Uint8Array(retBuf);

          for (let i = 0; i < this.blockLength - 1; i++) retView[i] = curView[i] | 0x80;

          retView[this.blockLength - 1] = curView[this.blockLength - 1];
          return retBuf;
        }

        const encodedBuf = (0, utils.utilToBase)(this.valueDec, 7);

        if (encodedBuf.byteLength === 0) {
          this.error = "Error during encoding SID value";
          return new ArrayBuffer(0);
        }

        retBuf = new ArrayBuffer(encodedBuf.byteLength);

        if (sizeOnly === false) {
          const encodedView = new Uint8Array(encodedBuf);
          retView = new Uint8Array(retBuf);

          for (let i = 0; i < encodedBuf.byteLength - 1; i++) retView[i] = encodedView[i] | 0x80;

          retView[encodedBuf.byteLength - 1] = encodedView[encodedBuf.byteLength - 1];
        }

        return retBuf;
      }

      toString() {
        let result = "";
        if (this.isHexOnly === true) result = (0, utils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);else {
          result = this.valueDec.toString();
        }
        return result;
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.valueDec = this.valueDec;
        return object;
      }

    }

    class LocalRelativeObjectIdentifierValueBlock extends ValueBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.fromString((0, utils.getParametersValue)(parameters, "value", ""));
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        let resultOffset = inputOffset;

        while (inputLength > 0) {
          const sidBlock = new LocalRelativeSidValueBlock();
          resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);

          if (resultOffset === -1) {
            this.blockLength = 0;
            this.error = sidBlock.error;
            return resultOffset;
          }

          this.blockLength += sidBlock.blockLength;
          inputLength -= sidBlock.blockLength;
          this.value.push(sidBlock);
        }

        return resultOffset;
      }

      toBER(sizeOnly = false) {
        let retBuf = new ArrayBuffer(0);

        for (let i = 0; i < this.value.length; i++) {
          const valueBuf = this.value[i].toBER(sizeOnly);

          if (valueBuf.byteLength === 0) {
            this.error = this.value[i].error;
            return new ArrayBuffer(0);
          }

          retBuf = (0, utils.utilConcatBuf)(retBuf, valueBuf);
        }

        return retBuf;
      }

      fromString(string) {
        this.value = [];
        let pos1 = 0;
        let pos2 = 0;
        let sid = "";

        do {
          pos2 = string.indexOf(".", pos1);
          if (pos2 === -1) sid = string.substr(pos1);else sid = string.substr(pos1, pos2 - pos1);
          pos1 = pos2 + 1;
          const sidBlock = new LocalRelativeSidValueBlock();
          sidBlock.valueDec = parseInt(sid, 10);
          if (isNaN(sidBlock.valueDec)) return true;
          this.value.push(sidBlock);
        } while (pos2 !== -1);

        return true;
      }

      toString() {
        let result = "";
        let isHexOnly = false;

        for (let i = 0; i < this.value.length; i++) {
          isHexOnly = this.value[i].isHexOnly;
          let sidStr = this.value[i].toString();
          if (i !== 0) result = `${result}.`;

          if (isHexOnly) {
            sidStr = `{${sidStr}}`;
            result += sidStr;
          } else result += sidStr;
        }

        return result;
      }

      static blockName() {
        return "RelativeObjectIdentifierValueBlock";
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.value = this.toString();
        object.sidArray = [];

        for (let i = 0; i < this.value.length; i++) object.sidArray.push(this.value[i].toJSON());

        return object;
      }

    }

    class RelativeObjectIdentifier extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalRelativeObjectIdentifierValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 13;
      }

      static blockName() {
        return "RelativeObjectIdentifier";
      }

    }

    exports.RelativeObjectIdentifier = RelativeObjectIdentifier;

    class LocalBmpStringValueBlock extends HexBlock(LocalBaseBlock) {
      constructor(parameters = {}) {
        super(parameters);
        this.isHexOnly = true;
        this.value = "";
      }

      static blockName() {
        return "BmpStringValueBlock";
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.value = this.value;
        return object;
      }

    }

    class BmpString extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalBmpStringValueBlock);
        if ("value" in parameters) this.fromString(parameters.value);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 30;
      }

      static blockName() {
        return "BmpString";
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

        if (resultOffset === -1) {
          this.error = this.valueBlock.error;
          return resultOffset;
        }

        this.fromBuffer(this.valueBlock.valueHex);
        if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
        if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
        if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
        return resultOffset;
      }

      fromBuffer(inputBuffer) {
        const copyBuffer = inputBuffer.slice(0);
        const valueView = new Uint8Array(copyBuffer);

        for (let i = 0; i < valueView.length; i += 2) {
          const temp = valueView[i];
          valueView[i] = valueView[i + 1];
          valueView[i + 1] = temp;
        }

        this.valueBlock.value = String.fromCharCode.apply(null, new Uint16Array(copyBuffer));
      }

      fromString(inputString) {
        const strLength = inputString.length;
        this.valueBlock.valueHex = new ArrayBuffer(strLength * 2);
        const valueHexView = new Uint8Array(this.valueBlock.valueHex);

        for (let i = 0; i < strLength; i++) {
          const codeBuf = (0, utils.utilToBase)(inputString.charCodeAt(i), 8);
          const codeView = new Uint8Array(codeBuf);
          if (codeView.length > 2) continue;
          const dif = 2 - codeView.length;

          for (let j = codeView.length - 1; j >= 0; j--) valueHexView[i * 2 + j + dif] = codeView[j];
        }

        this.valueBlock.value = inputString;
      }

    }

    exports.BmpString = BmpString;

    class LocalUniversalStringValueBlock extends HexBlock(LocalBaseBlock) {
      constructor(parameters = {}) {
        super(parameters);
        this.isHexOnly = true;
        this.value = "";
      }

      static blockName() {
        return "UniversalStringValueBlock";
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.value = this.value;
        return object;
      }

    }

    class UniversalString extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalUniversalStringValueBlock);
        if ("value" in parameters) this.fromString(parameters.value);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 28;
      }

      static blockName() {
        return "UniversalString";
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

        if (resultOffset === -1) {
          this.error = this.valueBlock.error;
          return resultOffset;
        }

        this.fromBuffer(this.valueBlock.valueHex);
        if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
        if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
        if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
        return resultOffset;
      }

      fromBuffer(inputBuffer) {
        const copyBuffer = inputBuffer.slice(0);
        const valueView = new Uint8Array(copyBuffer);

        for (let i = 0; i < valueView.length; i += 4) {
          valueView[i] = valueView[i + 3];
          valueView[i + 1] = valueView[i + 2];
          valueView[i + 2] = 0x00;
          valueView[i + 3] = 0x00;
        }

        this.valueBlock.value = String.fromCharCode.apply(null, new Uint32Array(copyBuffer));
      }

      fromString(inputString) {
        const strLength = inputString.length;
        this.valueBlock.valueHex = new ArrayBuffer(strLength * 4);
        const valueHexView = new Uint8Array(this.valueBlock.valueHex);

        for (let i = 0; i < strLength; i++) {
          const codeBuf = (0, utils.utilToBase)(inputString.charCodeAt(i), 8);
          const codeView = new Uint8Array(codeBuf);
          if (codeView.length > 4) continue;
          const dif = 4 - codeView.length;

          for (let j = codeView.length - 1; j >= 0; j--) valueHexView[i * 4 + j + dif] = codeView[j];
        }

        this.valueBlock.value = inputString;
      }

    }

    exports.UniversalString = UniversalString;

    class LocalSimpleStringValueBlock extends HexBlock(LocalBaseBlock) {
      constructor(parameters = {}) {
        super(parameters);
        this.value = "";
        this.isHexOnly = true;
      }

      static blockName() {
        return "SimpleStringValueBlock";
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.value = this.value;
        return object;
      }

    }

    class LocalSimpleStringBlock extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalSimpleStringValueBlock);
        if ("value" in parameters) this.fromString(parameters.value);
      }

      static blockName() {
        return "SIMPLESTRING";
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

        if (resultOffset === -1) {
          this.error = this.valueBlock.error;
          return resultOffset;
        }

        this.fromBuffer(this.valueBlock.valueHex);
        if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
        if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
        if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
        return resultOffset;
      }

      fromBuffer(inputBuffer) {
        this.valueBlock.value = String.fromCharCode.apply(null, new Uint8Array(inputBuffer));
      }

      fromString(inputString) {
        const strLen = inputString.length;
        this.valueBlock.valueHex = new ArrayBuffer(strLen);
        const view = new Uint8Array(this.valueBlock.valueHex);

        for (let i = 0; i < strLen; i++) view[i] = inputString.charCodeAt(i);

        this.valueBlock.value = inputString;
      }

    }

    class NumericString extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 18;
      }

      static blockName() {
        return "NumericString";
      }

    }

    exports.NumericString = NumericString;

    class PrintableString extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 19;
      }

      static blockName() {
        return "PrintableString";
      }

    }

    exports.PrintableString = PrintableString;

    class TeletexString extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 20;
      }

      static blockName() {
        return "TeletexString";
      }

    }

    exports.TeletexString = TeletexString;

    class VideotexString extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 21;
      }

      static blockName() {
        return "VideotexString";
      }

    }

    exports.VideotexString = VideotexString;

    class IA5String extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 22;
      }

      static blockName() {
        return "IA5String";
      }

    }

    exports.IA5String = IA5String;

    class GraphicString extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 25;
      }

      static blockName() {
        return "GraphicString";
      }

    }

    exports.GraphicString = GraphicString;

    class VisibleString extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 26;
      }

      static blockName() {
        return "VisibleString";
      }

    }

    exports.VisibleString = VisibleString;

    class GeneralString extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 27;
      }

      static blockName() {
        return "GeneralString";
      }

    }

    exports.GeneralString = GeneralString;

    class CharacterString extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 29;
      }

      static blockName() {
        return "CharacterString";
      }

    }

    exports.CharacterString = CharacterString;

    class UTCTime extends VisibleString {
      constructor(parameters = {}) {
        super(parameters);
        this.year = 0;
        this.month = 0;
        this.day = 0;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;

        if ("value" in parameters) {
          this.fromString(parameters.value);
          this.valueBlock.valueHex = new ArrayBuffer(parameters.value.length);
          const view = new Uint8Array(this.valueBlock.valueHex);

          for (let i = 0; i < parameters.value.length; i++) view[i] = parameters.value.charCodeAt(i);
        }

        if ("valueDate" in parameters) {
          this.fromDate(parameters.valueDate);
          this.valueBlock.valueHex = this.toBuffer();
        }

        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 23;
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

        if (resultOffset === -1) {
          this.error = this.valueBlock.error;
          return resultOffset;
        }

        this.fromBuffer(this.valueBlock.valueHex);
        if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
        if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
        if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
        return resultOffset;
      }

      fromBuffer(inputBuffer) {
        this.fromString(String.fromCharCode.apply(null, new Uint8Array(inputBuffer)));
      }

      toBuffer() {
        const str = this.toString();
        const buffer = new ArrayBuffer(str.length);
        const view = new Uint8Array(buffer);

        for (let i = 0; i < str.length; i++) view[i] = str.charCodeAt(i);

        return buffer;
      }

      fromDate(inputDate) {
        this.year = inputDate.getUTCFullYear();
        this.month = inputDate.getUTCMonth() + 1;
        this.day = inputDate.getUTCDate();
        this.hour = inputDate.getUTCHours();
        this.minute = inputDate.getUTCMinutes();
        this.second = inputDate.getUTCSeconds();
      }

      toDate() {
        return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second));
      }

      fromString(inputString) {
        const parser = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/ig;
        const parserArray = parser.exec(inputString);

        if (parserArray === null) {
          this.error = "Wrong input string for convertion";
          return;
        }

        const year = parseInt(parserArray[1], 10);
        if (year >= 50) this.year = 1900 + year;else this.year = 2000 + year;
        this.month = parseInt(parserArray[2], 10);
        this.day = parseInt(parserArray[3], 10);
        this.hour = parseInt(parserArray[4], 10);
        this.minute = parseInt(parserArray[5], 10);
        this.second = parseInt(parserArray[6], 10);
      }

      toString() {
        const outputArray = new Array(7);
        outputArray[0] = (0, utils.padNumber)(this.year < 2000 ? this.year - 1900 : this.year - 2000, 2);
        outputArray[1] = (0, utils.padNumber)(this.month, 2);
        outputArray[2] = (0, utils.padNumber)(this.day, 2);
        outputArray[3] = (0, utils.padNumber)(this.hour, 2);
        outputArray[4] = (0, utils.padNumber)(this.minute, 2);
        outputArray[5] = (0, utils.padNumber)(this.second, 2);
        outputArray[6] = "Z";
        return outputArray.join("");
      }

      static blockName() {
        return "UTCTime";
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.year = this.year;
        object.month = this.month;
        object.day = this.day;
        object.hour = this.hour;
        object.minute = this.minute;
        object.second = this.second;
        return object;
      }

    }

    exports.UTCTime = UTCTime;

    class GeneralizedTime extends VisibleString {
      constructor(parameters = {}) {
        super(parameters);
        this.year = 0;
        this.month = 0;
        this.day = 0;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.millisecond = 0;

        if ("value" in parameters) {
          this.fromString(parameters.value);
          this.valueBlock.valueHex = new ArrayBuffer(parameters.value.length);
          const view = new Uint8Array(this.valueBlock.valueHex);

          for (let i = 0; i < parameters.value.length; i++) view[i] = parameters.value.charCodeAt(i);
        }

        if ("valueDate" in parameters) {
          this.fromDate(parameters.valueDate);
          this.valueBlock.valueHex = this.toBuffer();
        }

        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 24;
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

        if (resultOffset === -1) {
          this.error = this.valueBlock.error;
          return resultOffset;
        }

        this.fromBuffer(this.valueBlock.valueHex);
        if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
        if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
        if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
        return resultOffset;
      }

      fromBuffer(inputBuffer) {
        this.fromString(String.fromCharCode.apply(null, new Uint8Array(inputBuffer)));
      }

      toBuffer() {
        const str = this.toString();
        const buffer = new ArrayBuffer(str.length);
        const view = new Uint8Array(buffer);

        for (let i = 0; i < str.length; i++) view[i] = str.charCodeAt(i);

        return buffer;
      }

      fromDate(inputDate) {
        this.year = inputDate.getUTCFullYear();
        this.month = inputDate.getUTCMonth() + 1;
        this.day = inputDate.getUTCDate();
        this.hour = inputDate.getUTCHours();
        this.minute = inputDate.getUTCMinutes();
        this.second = inputDate.getUTCSeconds();
        this.millisecond = inputDate.getUTCMilliseconds();
      }

      toDate() {
        return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond));
      }

      fromString(inputString) {
        let isUTC = false;
        let timeString = "";
        let dateTimeString = "";
        let fractionPart = 0;
        let parser;
        let hourDifference = 0;
        let minuteDifference = 0;

        if (inputString[inputString.length - 1] === "Z") {
          timeString = inputString.substr(0, inputString.length - 1);
          isUTC = true;
        } else {
          const number = new Number(inputString[inputString.length - 1]);
          if (isNaN(number.valueOf())) throw new Error("Wrong input string for convertion");
          timeString = inputString;
        }

        if (isUTC) {
          if (timeString.indexOf("+") !== -1) throw new Error("Wrong input string for convertion");
          if (timeString.indexOf("-") !== -1) throw new Error("Wrong input string for convertion");
        } else {
          let multiplier = 1;
          let differencePosition = timeString.indexOf("+");
          let differenceString = "";

          if (differencePosition === -1) {
            differencePosition = timeString.indexOf("-");
            multiplier = -1;
          }

          if (differencePosition !== -1) {
            differenceString = timeString.substr(differencePosition + 1);
            timeString = timeString.substr(0, differencePosition);
            if (differenceString.length !== 2 && differenceString.length !== 4) throw new Error("Wrong input string for convertion");
            let number = new Number(differenceString.substr(0, 2));
            if (isNaN(number.valueOf())) throw new Error("Wrong input string for convertion");
            hourDifference = multiplier * number;

            if (differenceString.length === 4) {
              number = new Number(differenceString.substr(2, 2));
              if (isNaN(number.valueOf())) throw new Error("Wrong input string for convertion");
              minuteDifference = multiplier * number;
            }
          }
        }

        let fractionPointPosition = timeString.indexOf(".");
        if (fractionPointPosition === -1) fractionPointPosition = timeString.indexOf(",");

        if (fractionPointPosition !== -1) {
          const fractionPartCheck = new Number(`0${timeString.substr(fractionPointPosition)}`);
          if (isNaN(fractionPartCheck.valueOf())) throw new Error("Wrong input string for convertion");
          fractionPart = fractionPartCheck.valueOf();
          dateTimeString = timeString.substr(0, fractionPointPosition);
        } else dateTimeString = timeString;

        switch (true) {
          case dateTimeString.length === 8:
            parser = /(\d{4})(\d{2})(\d{2})/ig;
            if (fractionPointPosition !== -1) throw new Error("Wrong input string for convertion");
            break;

          case dateTimeString.length === 10:
            parser = /(\d{4})(\d{2})(\d{2})(\d{2})/ig;

            if (fractionPointPosition !== -1) {
              let fractionResult = 60 * fractionPart;
              this.minute = Math.floor(fractionResult);
              fractionResult = 60 * (fractionResult - this.minute);
              this.second = Math.floor(fractionResult);
              fractionResult = 1000 * (fractionResult - this.second);
              this.millisecond = Math.floor(fractionResult);
            }

            break;

          case dateTimeString.length === 12:
            parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/ig;

            if (fractionPointPosition !== -1) {
              let fractionResult = 60 * fractionPart;
              this.second = Math.floor(fractionResult);
              fractionResult = 1000 * (fractionResult - this.second);
              this.millisecond = Math.floor(fractionResult);
            }

            break;

          case dateTimeString.length === 14:
            parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/ig;

            if (fractionPointPosition !== -1) {
              const fractionResult = 1000 * fractionPart;
              this.millisecond = Math.floor(fractionResult);
            }

            break;

          default:
            throw new Error("Wrong input string for convertion");
        }

        const parserArray = parser.exec(dateTimeString);
        if (parserArray === null) throw new Error("Wrong input string for convertion");

        for (let j = 1; j < parserArray.length; j++) {
          switch (j) {
            case 1:
              this.year = parseInt(parserArray[j], 10);
              break;

            case 2:
              this.month = parseInt(parserArray[j], 10);
              break;

            case 3:
              this.day = parseInt(parserArray[j], 10);
              break;

            case 4:
              this.hour = parseInt(parserArray[j], 10) + hourDifference;
              break;

            case 5:
              this.minute = parseInt(parserArray[j], 10) + minuteDifference;
              break;

            case 6:
              this.second = parseInt(parserArray[j], 10);
              break;

            default:
              throw new Error("Wrong input string for convertion");
          }
        }

        if (isUTC === false) {
          const tempDate = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
          this.year = tempDate.getUTCFullYear();
          this.month = tempDate.getUTCMonth();
          this.day = tempDate.getUTCDay();
          this.hour = tempDate.getUTCHours();
          this.minute = tempDate.getUTCMinutes();
          this.second = tempDate.getUTCSeconds();
          this.millisecond = tempDate.getUTCMilliseconds();
        }
      }

      toString() {
        const outputArray = [];
        outputArray.push((0, utils.padNumber)(this.year, 4));
        outputArray.push((0, utils.padNumber)(this.month, 2));
        outputArray.push((0, utils.padNumber)(this.day, 2));
        outputArray.push((0, utils.padNumber)(this.hour, 2));
        outputArray.push((0, utils.padNumber)(this.minute, 2));
        outputArray.push((0, utils.padNumber)(this.second, 2));

        if (this.millisecond !== 0) {
          outputArray.push(".");
          outputArray.push((0, utils.padNumber)(this.millisecond, 3));
        }

        outputArray.push("Z");
        return outputArray.join("");
      }

      static blockName() {
        return "GeneralizedTime";
      }

      toJSON() {
        let object = {};

        try {
          object = super.toJSON();
        } catch (ex) {}

        object.year = this.year;
        object.month = this.month;
        object.day = this.day;
        object.hour = this.hour;
        object.minute = this.minute;
        object.second = this.second;
        object.millisecond = this.millisecond;
        return object;
      }

    }

    exports.GeneralizedTime = GeneralizedTime;

    class DATE extends Utf8String {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 31;
      }

      static blockName() {
        return "DATE";
      }

    }

    exports.DATE = DATE;

    class TimeOfDay extends Utf8String {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 32;
      }

      static blockName() {
        return "TimeOfDay";
      }

    }

    exports.TimeOfDay = TimeOfDay;

    class DateTime extends Utf8String {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 33;
      }

      static blockName() {
        return "DateTime";
      }

    }

    exports.DateTime = DateTime;

    class Duration extends Utf8String {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 34;
      }

      static blockName() {
        return "Duration";
      }

    }

    exports.Duration = Duration;

    class TIME extends Utf8String {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 14;
      }

      static blockName() {
        return "TIME";
      }

    }

    exports.TIME = TIME;

    class Choice {
      constructor(parameters = {}) {
        this.value = (0, utils.getParametersValue)(parameters, "value", []);
        this.optional = (0, utils.getParametersValue)(parameters, "optional", false);
      }

    }

    exports.Choice = Choice;

    class Any {
      constructor(parameters = {}) {
        this.name = (0, utils.getParametersValue)(parameters, "name", "");
        this.optional = (0, utils.getParametersValue)(parameters, "optional", false);
      }

    }

    exports.Any = Any;

    class Repeated {
      constructor(parameters = {}) {
        this.name = (0, utils.getParametersValue)(parameters, "name", "");
        this.optional = (0, utils.getParametersValue)(parameters, "optional", false);
        this.value = (0, utils.getParametersValue)(parameters, "value", new Any());
        this.local = (0, utils.getParametersValue)(parameters, "local", false);
      }

    }

    exports.Repeated = Repeated;

    class RawData {
      constructor(parameters = {}) {
        this.data = (0, utils.getParametersValue)(parameters, "data", new ArrayBuffer(0));
      }

      fromBER(inputBuffer, inputOffset, inputLength) {
        this.data = inputBuffer.slice(inputOffset, inputLength);
        return inputOffset + inputLength;
      }

      toBER(sizeOnly = false) {
        return this.data;
      }

    }

    exports.RawData = RawData;

    function LocalFromBER(inputBuffer, inputOffset, inputLength) {
      const incomingOffset = inputOffset;

      function localChangeType(inputObject, newType) {
        if (inputObject instanceof newType) return inputObject;
        const newObject = new newType();
        newObject.idBlock = inputObject.idBlock;
        newObject.lenBlock = inputObject.lenBlock;
        newObject.warnings = inputObject.warnings;
        newObject.valueBeforeDecode = inputObject.valueBeforeDecode.slice(0);
        return newObject;
      }

      let returnObject = new BaseBlock({}, Object);
      const baseBlock = new LocalBaseBlock();

      if ((0, utils.checkBufferParams)(baseBlock, inputBuffer, inputOffset, inputLength) === false) {
        returnObject.error = baseBlock.error;
        return {
          offset: -1,
          result: returnObject
        };
      }

      const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);

      if (intBuffer.length === 0) {
        this.error = "Zero buffer length";
        return {
          offset: -1,
          result: returnObject
        };
      }

      let resultOffset = returnObject.idBlock.fromBER(inputBuffer, inputOffset, inputLength);
      returnObject.warnings.concat(returnObject.idBlock.warnings);

      if (resultOffset === -1) {
        returnObject.error = returnObject.idBlock.error;
        return {
          offset: -1,
          result: returnObject
        };
      }

      inputOffset = resultOffset;
      inputLength -= returnObject.idBlock.blockLength;
      resultOffset = returnObject.lenBlock.fromBER(inputBuffer, inputOffset, inputLength);
      returnObject.warnings.concat(returnObject.lenBlock.warnings);

      if (resultOffset === -1) {
        returnObject.error = returnObject.lenBlock.error;
        return {
          offset: -1,
          result: returnObject
        };
      }

      inputOffset = resultOffset;
      inputLength -= returnObject.lenBlock.blockLength;

      if (returnObject.idBlock.isConstructed === false && returnObject.lenBlock.isIndefiniteForm === true) {
        returnObject.error = "Indefinite length form used for primitive encoding form";
        return {
          offset: -1,
          result: returnObject
        };
      }

      let newASN1Type = BaseBlock;

      switch (returnObject.idBlock.tagClass) {
        case 1:
          if (returnObject.idBlock.tagNumber >= 37 && returnObject.idBlock.isHexOnly === false) {
            returnObject.error = "UNIVERSAL 37 and upper tags are reserved by ASN.1 standard";
            return {
              offset: -1,
              result: returnObject
            };
          }

          switch (returnObject.idBlock.tagNumber) {
            case 0:
              if (returnObject.idBlock.isConstructed === true && returnObject.lenBlock.length > 0) {
                returnObject.error = "Type [UNIVERSAL 0] is reserved";
                return {
                  offset: -1,
                  result: returnObject
                };
              }

              newASN1Type = EndOfContent;
              break;

            case 1:
              newASN1Type = Boolean;
              break;

            case 2:
              newASN1Type = Integer;
              break;

            case 3:
              newASN1Type = BitString;
              break;

            case 4:
              newASN1Type = OctetString;
              break;

            case 5:
              newASN1Type = Null;
              break;

            case 6:
              newASN1Type = ObjectIdentifier;
              break;

            case 10:
              newASN1Type = Enumerated;
              break;

            case 12:
              newASN1Type = Utf8String;
              break;

            case 13:
              newASN1Type = RelativeObjectIdentifier;
              break;

            case 14:
              newASN1Type = TIME;
              break;

            case 15:
              returnObject.error = "[UNIVERSAL 15] is reserved by ASN.1 standard";
              return {
                offset: -1,
                result: returnObject
              };

            case 16:
              newASN1Type = Sequence;
              break;

            case 17:
              newASN1Type = Set;
              break;

            case 18:
              newASN1Type = NumericString;
              break;

            case 19:
              newASN1Type = PrintableString;
              break;

            case 20:
              newASN1Type = TeletexString;
              break;

            case 21:
              newASN1Type = VideotexString;
              break;

            case 22:
              newASN1Type = IA5String;
              break;

            case 23:
              newASN1Type = UTCTime;
              break;

            case 24:
              newASN1Type = GeneralizedTime;
              break;

            case 25:
              newASN1Type = GraphicString;
              break;

            case 26:
              newASN1Type = VisibleString;
              break;

            case 27:
              newASN1Type = GeneralString;
              break;

            case 28:
              newASN1Type = UniversalString;
              break;

            case 29:
              newASN1Type = CharacterString;
              break;

            case 30:
              newASN1Type = BmpString;
              break;

            case 31:
              newASN1Type = DATE;
              break;

            case 32:
              newASN1Type = TimeOfDay;
              break;

            case 33:
              newASN1Type = DateTime;
              break;

            case 34:
              newASN1Type = Duration;
              break;

            default:
              {
                let newObject;
                if (returnObject.idBlock.isConstructed === true) newObject = new Constructed();else newObject = new Primitive();
                newObject.idBlock = returnObject.idBlock;
                newObject.lenBlock = returnObject.lenBlock;
                newObject.warnings = returnObject.warnings;
                returnObject = newObject;
                resultOffset = returnObject.fromBER(inputBuffer, inputOffset, inputLength);
              }
          }

          break;

        case 2:
        case 3:
        case 4:
        default:
          {
            if (returnObject.idBlock.isConstructed === true) newASN1Type = Constructed;else newASN1Type = Primitive;
          }
      }

      returnObject = localChangeType(returnObject, newASN1Type);
      resultOffset = returnObject.fromBER(inputBuffer, inputOffset, returnObject.lenBlock.isIndefiniteForm === true ? inputLength : returnObject.lenBlock.length);
      returnObject.valueBeforeDecode = inputBuffer.slice(incomingOffset, incomingOffset + returnObject.blockLength);
      return {
        offset: resultOffset,
        result: returnObject
      };
    }

    function fromBER(inputBuffer) {
      if (inputBuffer.byteLength === 0) {
        const result = new BaseBlock({}, Object);
        result.error = "Input buffer has zero length";
        return {
          offset: -1,
          result
        };
      }

      return LocalFromBER(inputBuffer, 0, inputBuffer.byteLength);
    }

    function compareSchema(root, inputData, inputSchema) {
      if (inputSchema instanceof Choice) {
        for (let j = 0; j < inputSchema.value.length; j++) {
          const result = compareSchema(root, inputData, inputSchema.value[j]);

          if (result.verified === true) {
            return {
              verified: true,
              result: root
            };
          }
        }

        {
          const _result = {
            verified: false,
            result: {
              error: "Wrong values for Choice type"
            }
          };
          if (inputSchema.hasOwnProperty("name")) _result.name = inputSchema.name;
          return _result;
        }
      }

      if (inputSchema instanceof Any) {
        if (inputSchema.hasOwnProperty("name")) root[inputSchema.name] = inputData;
        return {
          verified: true,
          result: root
        };
      }

      if (root instanceof Object === false) {
        return {
          verified: false,
          result: {
            error: "Wrong root object"
          }
        };
      }

      if (inputData instanceof Object === false) {
        return {
          verified: false,
          result: {
            error: "Wrong ASN.1 data"
          }
        };
      }

      if (inputSchema instanceof Object === false) {
        return {
          verified: false,
          result: {
            error: "Wrong ASN.1 schema"
          }
        };
      }

      if ("idBlock" in inputSchema === false) {
        return {
          verified: false,
          result: {
            error: "Wrong ASN.1 schema"
          }
        };
      }

      if ("fromBER" in inputSchema.idBlock === false) {
        return {
          verified: false,
          result: {
            error: "Wrong ASN.1 schema"
          }
        };
      }

      if ("toBER" in inputSchema.idBlock === false) {
        return {
          verified: false,
          result: {
            error: "Wrong ASN.1 schema"
          }
        };
      }

      const encodedId = inputSchema.idBlock.toBER(false);

      if (encodedId.byteLength === 0) {
        return {
          verified: false,
          result: {
            error: "Error encoding idBlock for ASN.1 schema"
          }
        };
      }

      const decodedOffset = inputSchema.idBlock.fromBER(encodedId, 0, encodedId.byteLength);

      if (decodedOffset === -1) {
        return {
          verified: false,
          result: {
            error: "Error decoding idBlock for ASN.1 schema"
          }
        };
      }

      if (inputSchema.idBlock.hasOwnProperty("tagClass") === false) {
        return {
          verified: false,
          result: {
            error: "Wrong ASN.1 schema"
          }
        };
      }

      if (inputSchema.idBlock.tagClass !== inputData.idBlock.tagClass) {
        return {
          verified: false,
          result: root
        };
      }

      if (inputSchema.idBlock.hasOwnProperty("tagNumber") === false) {
        return {
          verified: false,
          result: {
            error: "Wrong ASN.1 schema"
          }
        };
      }

      if (inputSchema.idBlock.tagNumber !== inputData.idBlock.tagNumber) {
        return {
          verified: false,
          result: root
        };
      }

      if (inputSchema.idBlock.hasOwnProperty("isConstructed") === false) {
        return {
          verified: false,
          result: {
            error: "Wrong ASN.1 schema"
          }
        };
      }

      if (inputSchema.idBlock.isConstructed !== inputData.idBlock.isConstructed) {
        return {
          verified: false,
          result: root
        };
      }

      if ("isHexOnly" in inputSchema.idBlock === false) {
        return {
          verified: false,
          result: {
            error: "Wrong ASN.1 schema"
          }
        };
      }

      if (inputSchema.idBlock.isHexOnly !== inputData.idBlock.isHexOnly) {
        return {
          verified: false,
          result: root
        };
      }

      if (inputSchema.idBlock.isHexOnly === true) {
        if ("valueHex" in inputSchema.idBlock === false) {
          return {
            verified: false,
            result: {
              error: "Wrong ASN.1 schema"
            }
          };
        }

        const schemaView = new Uint8Array(inputSchema.idBlock.valueHex);
        const asn1View = new Uint8Array(inputData.idBlock.valueHex);

        if (schemaView.length !== asn1View.length) {
          return {
            verified: false,
            result: root
          };
        }

        for (let i = 0; i < schemaView.length; i++) {
          if (schemaView[i] !== asn1View[1]) {
            return {
              verified: false,
              result: root
            };
          }
        }
      }

      if (inputSchema.hasOwnProperty("name")) {
        inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");
        if (inputSchema.name !== "") root[inputSchema.name] = inputData;
      }

      if (inputSchema.idBlock.isConstructed === true) {
        let admission = 0;
        let result = {
          verified: false
        };
        let maxLength = inputSchema.valueBlock.value.length;

        if (maxLength > 0) {
          if (inputSchema.valueBlock.value[0] instanceof Repeated) maxLength = inputData.valueBlock.value.length;
        }

        if (maxLength === 0) {
          return {
            verified: true,
            result: root
          };
        }

        if (inputData.valueBlock.value.length === 0 && inputSchema.valueBlock.value.length !== 0) {
          let _optional = true;

          for (let i = 0; i < inputSchema.valueBlock.value.length; i++) _optional = _optional && (inputSchema.valueBlock.value[i].optional || false);

          if (_optional === true) {
            return {
              verified: true,
              result: root
            };
          }

          if (inputSchema.hasOwnProperty("name")) {
            inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");
            if (inputSchema.name !== "") delete root[inputSchema.name];
          }

          root.error = "Inconsistent object length";
          return {
            verified: false,
            result: root
          };
        }

        for (let i = 0; i < maxLength; i++) {
          if (i - admission >= inputData.valueBlock.value.length) {
            if (inputSchema.valueBlock.value[i].optional === false) {
              const _result = {
                verified: false,
                result: root
              };
              root.error = "Inconsistent length between ASN.1 data and schema";

              if (inputSchema.hasOwnProperty("name")) {
                inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");

                if (inputSchema.name !== "") {
                  delete root[inputSchema.name];
                  _result.name = inputSchema.name;
                }
              }

              return _result;
            }
          } else {
            if (inputSchema.valueBlock.value[0] instanceof Repeated) {
              result = compareSchema(root, inputData.valueBlock.value[i], inputSchema.valueBlock.value[0].value);

              if (result.verified === false) {
                if (inputSchema.valueBlock.value[0].optional === true) admission++;else {
                  if (inputSchema.hasOwnProperty("name")) {
                    inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");
                    if (inputSchema.name !== "") delete root[inputSchema.name];
                  }

                  return result;
                }
              }

              if ("name" in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].name.length > 0) {
                let arrayRoot = {};
                if ("local" in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].local === true) arrayRoot = inputData;else arrayRoot = root;
                if (typeof arrayRoot[inputSchema.valueBlock.value[0].name] === "undefined") arrayRoot[inputSchema.valueBlock.value[0].name] = [];
                arrayRoot[inputSchema.valueBlock.value[0].name].push(inputData.valueBlock.value[i]);
              }
            } else {
              result = compareSchema(root, inputData.valueBlock.value[i - admission], inputSchema.valueBlock.value[i]);

              if (result.verified === false) {
                if (inputSchema.valueBlock.value[i].optional === true) admission++;else {
                  if (inputSchema.hasOwnProperty("name")) {
                    inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");
                    if (inputSchema.name !== "") delete root[inputSchema.name];
                  }

                  return result;
                }
              }
            }
          }
        }

        if (result.verified === false) {
          const _result = {
            verified: false,
            result: root
          };

          if (inputSchema.hasOwnProperty("name")) {
            inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");

            if (inputSchema.name !== "") {
              delete root[inputSchema.name];
              _result.name = inputSchema.name;
            }
          }

          return _result;
        }

        return {
          verified: true,
          result: root
        };
      }

      if ("primitiveSchema" in inputSchema && "valueHex" in inputData.valueBlock) {
        const asn1 = fromBER(inputData.valueBlock.valueHex);

        if (asn1.offset === -1) {
          const _result = {
            verified: false,
            result: asn1.result
          };

          if (inputSchema.hasOwnProperty("name")) {
            inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");

            if (inputSchema.name !== "") {
              delete root[inputSchema.name];
              _result.name = inputSchema.name;
            }
          }

          return _result;
        }

        return compareSchema(root, asn1.result, inputSchema.primitiveSchema);
      }

      return {
        verified: true,
        result: root
      };
    }

    function verifySchema(inputBuffer, inputSchema) {
      if (inputSchema instanceof Object === false) {
        return {
          verified: false,
          result: {
            error: "Wrong ASN.1 schema type"
          }
        };
      }

      const asn1 = fromBER(inputBuffer);

      if (asn1.offset === -1) {
        return {
          verified: false,
          result: asn1.result
        };
      }

      return compareSchema(asn1.result, asn1.result, inputSchema);
    }

    function fromJSON(json) {}
  });
  var asn1$1 = unwrapExports(asn1);
  var asn1_1 = asn1.fromBER;
  var asn1_2 = asn1.compareSchema;
  var asn1_3 = asn1.verifySchema;
  var asn1_4 = asn1.fromJSON;
  var asn1_5 = asn1.RawData;
  var asn1_6 = asn1.Repeated;
  var asn1_7 = asn1.Any;
  var asn1_8 = asn1.Choice;
  var asn1_9 = asn1.TIME;
  var asn1_10 = asn1.Duration;
  var asn1_11 = asn1.DateTime;
  var asn1_12 = asn1.TimeOfDay;
  var asn1_13 = asn1.DATE;
  var asn1_14 = asn1.GeneralizedTime;
  var asn1_15 = asn1.UTCTime;
  var asn1_16 = asn1.CharacterString;
  var asn1_17 = asn1.GeneralString;
  var asn1_18 = asn1.VisibleString;
  var asn1_19 = asn1.GraphicString;
  var asn1_20 = asn1.IA5String;
  var asn1_21 = asn1.VideotexString;
  var asn1_22 = asn1.TeletexString;
  var asn1_23 = asn1.PrintableString;
  var asn1_24 = asn1.NumericString;
  var asn1_25 = asn1.UniversalString;
  var asn1_26 = asn1.BmpString;
  var asn1_27 = asn1.RelativeObjectIdentifier;
  var asn1_28 = asn1.Utf8String;
  var asn1_29 = asn1.ObjectIdentifier;
  var asn1_30 = asn1.Enumerated;
  var asn1_31 = asn1.Integer;
  var asn1_32 = asn1.BitString;
  var asn1_33 = asn1.OctetString;
  var asn1_34 = asn1.Null;
  var asn1_35 = asn1.Set;
  var asn1_36 = asn1.Sequence;
  var asn1_37 = asn1.Boolean;
  var asn1_38 = asn1.EndOfContent;
  var asn1_39 = asn1.Constructed;
  var asn1_40 = asn1.Primitive;
  var asn1_41 = asn1.BaseBlock;
  var asn1_42 = asn1.ValueBlock;
  var asn1_43 = asn1.HexBlock;
  var asn1$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': asn1$1,
    __moduleExports: asn1,
    fromBER: asn1_1,
    compareSchema: asn1_2,
    verifySchema: asn1_3,
    fromJSON: asn1_4,
    RawData: asn1_5,
    Repeated: asn1_6,
    Any: asn1_7,
    Choice: asn1_8,
    TIME: asn1_9,
    Duration: asn1_10,
    DateTime: asn1_11,
    TimeOfDay: asn1_12,
    DATE: asn1_13,
    GeneralizedTime: asn1_14,
    UTCTime: asn1_15,
    CharacterString: asn1_16,
    GeneralString: asn1_17,
    VisibleString: asn1_18,
    GraphicString: asn1_19,
    IA5String: asn1_20,
    VideotexString: asn1_21,
    TeletexString: asn1_22,
    PrintableString: asn1_23,
    NumericString: asn1_24,
    UniversalString: asn1_25,
    BmpString: asn1_26,
    RelativeObjectIdentifier: asn1_27,
    Utf8String: asn1_28,
    ObjectIdentifier: asn1_29,
    Enumerated: asn1_30,
    Integer: asn1_31,
    BitString: asn1_32,
    OctetString: asn1_33,
    Null: asn1_34,
    Set: asn1_35,
    Sequence: asn1_36,
    Boolean: asn1_37,
    EndOfContent: asn1_38,
    Constructed: asn1_39,
    Primitive: asn1_40,
    BaseBlock: asn1_41,
    ValueBlock: asn1_42,
    HexBlock: asn1_43
  });
  const AsnAnyConverter = {
    fromASN: value => value instanceof asn1_34 ? null : value.valueBeforeDecode,
    toASN: value => {
      if (value === null) {
        return new asn1_34();
      }

      const schema = asn1_1(value);

      if (schema.result.error) {
        throw new Error(schema.result.error);
      }

      return schema.result;
    }
  };
  const AsnIntegerConverter = {
    fromASN: value => !value.valueBlock.valueDec && value.valueBlock.valueHex.byteLength > 0 ? value.valueBlock.toString() : value.valueBlock.valueDec,
    toASN: value => new asn1_31({
      value: value
    })
  };
  const AsnEnumeratedConverter = {
    fromASN: value => value.valueBlock.valueDec,
    toASN: value => new asn1_30({
      value
    })
  };
  const AsnIntegerArrayBufferConverter = {
    fromASN: value => value.valueBlock.valueHex,
    toASN: value => new asn1_31({
      valueHex: value
    })
  };
  const AsnBitStringConverter = {
    fromASN: value => value.valueBlock.valueHex,
    toASN: value => new asn1_32({
      valueHex: value
    })
  };
  const AsnObjectIdentifierConverter = {
    fromASN: value => value.valueBlock.toString(),
    toASN: value => new asn1_29({
      value
    })
  };
  const AsnBooleanConverter = {
    fromASN: value => value.valueBlock.value,
    toASN: value => new asn1_37({
      value
    })
  };
  const AsnOctetStringConverter = {
    fromASN: value => value.valueBlock.valueHex,
    toASN: value => new asn1_33({
      valueHex: value
    })
  };

  function createStringConverter(Asn1Type) {
    return {
      fromASN: value => value.valueBlock.value,
      toASN: value => new Asn1Type({
        value
      })
    };
  }

  const AsnUtf8StringConverter = createStringConverter(asn1_28);
  const AsnBmpStringConverter = createStringConverter(asn1_26);
  const AsnUniversalStringConverter = createStringConverter(asn1_25);
  const AsnNumericStringConverter = createStringConverter(asn1_24);
  const AsnPrintableStringConverter = createStringConverter(asn1_23);
  const AsnTeletexStringConverter = createStringConverter(asn1_22);
  const AsnVideotexStringConverter = createStringConverter(asn1_21);
  const AsnIA5StringConverter = createStringConverter(asn1_20);
  const AsnGraphicStringConverter = createStringConverter(asn1_19);
  const AsnVisibleStringConverter = createStringConverter(asn1_18);
  const AsnGeneralStringConverter = createStringConverter(asn1_17);
  const AsnCharacterStringConverter = createStringConverter(asn1_16);
  const AsnUTCTimeConverter = {
    fromASN: value => value.toDate(),
    toASN: value => new asn1_15({
      valueDate: value
    })
  };
  const AsnGeneralizedTimeConverter = {
    fromASN: value => value.toDate(),
    toASN: value => new asn1_14({
      valueDate: value
    })
  };
  const AsnNullConverter = {
    fromASN: value => null,
    toASN: value => {
      return new asn1_34();
    }
  };
  var defaultConverters = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AsnAnyConverter: AsnAnyConverter,
    AsnIntegerConverter: AsnIntegerConverter,
    AsnEnumeratedConverter: AsnEnumeratedConverter,
    AsnIntegerArrayBufferConverter: AsnIntegerArrayBufferConverter,
    AsnBitStringConverter: AsnBitStringConverter,
    AsnObjectIdentifierConverter: AsnObjectIdentifierConverter,
    AsnBooleanConverter: AsnBooleanConverter,
    AsnOctetStringConverter: AsnOctetStringConverter,
    AsnUtf8StringConverter: AsnUtf8StringConverter,
    AsnBmpStringConverter: AsnBmpStringConverter,
    AsnUniversalStringConverter: AsnUniversalStringConverter,
    AsnNumericStringConverter: AsnNumericStringConverter,
    AsnPrintableStringConverter: AsnPrintableStringConverter,
    AsnTeletexStringConverter: AsnTeletexStringConverter,
    AsnVideotexStringConverter: AsnVideotexStringConverter,
    AsnIA5StringConverter: AsnIA5StringConverter,
    AsnGraphicStringConverter: AsnGraphicStringConverter,
    AsnVisibleStringConverter: AsnVisibleStringConverter,
    AsnGeneralStringConverter: AsnGeneralStringConverter,
    AsnCharacterStringConverter: AsnCharacterStringConverter,
    AsnUTCTimeConverter: AsnUTCTimeConverter,
    AsnGeneralizedTimeConverter: AsnGeneralizedTimeConverter,
    AsnNullConverter: AsnNullConverter
  });
  var AsnTypeTypes;

  (function (AsnTypeTypes) {
    AsnTypeTypes[AsnTypeTypes["Sequence"] = 0] = "Sequence";
    AsnTypeTypes[AsnTypeTypes["Set"] = 1] = "Set";
    AsnTypeTypes[AsnTypeTypes["Choice"] = 2] = "Choice";
  })(AsnTypeTypes || (AsnTypeTypes = {}));

  var AsnPropTypes;

  (function (AsnPropTypes) {
    AsnPropTypes[AsnPropTypes["Any"] = 1] = "Any";
    AsnPropTypes[AsnPropTypes["Boolean"] = 2] = "Boolean";
    AsnPropTypes[AsnPropTypes["OctetString"] = 3] = "OctetString";
    AsnPropTypes[AsnPropTypes["BitString"] = 4] = "BitString";
    AsnPropTypes[AsnPropTypes["Integer"] = 5] = "Integer";
    AsnPropTypes[AsnPropTypes["Enumerated"] = 6] = "Enumerated";
    AsnPropTypes[AsnPropTypes["ObjectIdentifier"] = 7] = "ObjectIdentifier";
    AsnPropTypes[AsnPropTypes["Utf8String"] = 8] = "Utf8String";
    AsnPropTypes[AsnPropTypes["BmpString"] = 9] = "BmpString";
    AsnPropTypes[AsnPropTypes["UniversalString"] = 10] = "UniversalString";
    AsnPropTypes[AsnPropTypes["NumericString"] = 11] = "NumericString";
    AsnPropTypes[AsnPropTypes["PrintableString"] = 12] = "PrintableString";
    AsnPropTypes[AsnPropTypes["TeletexString"] = 13] = "TeletexString";
    AsnPropTypes[AsnPropTypes["VideotexString"] = 14] = "VideotexString";
    AsnPropTypes[AsnPropTypes["IA5String"] = 15] = "IA5String";
    AsnPropTypes[AsnPropTypes["GraphicString"] = 16] = "GraphicString";
    AsnPropTypes[AsnPropTypes["VisibleString"] = 17] = "VisibleString";
    AsnPropTypes[AsnPropTypes["GeneralString"] = 18] = "GeneralString";
    AsnPropTypes[AsnPropTypes["CharacterString"] = 19] = "CharacterString";
    AsnPropTypes[AsnPropTypes["UTCTime"] = 20] = "UTCTime";
    AsnPropTypes[AsnPropTypes["GeneralizedTime"] = 21] = "GeneralizedTime";
    AsnPropTypes[AsnPropTypes["DATE"] = 22] = "DATE";
    AsnPropTypes[AsnPropTypes["TimeOfDay"] = 23] = "TimeOfDay";
    AsnPropTypes[AsnPropTypes["DateTime"] = 24] = "DateTime";
    AsnPropTypes[AsnPropTypes["Duration"] = 25] = "Duration";
    AsnPropTypes[AsnPropTypes["TIME"] = 26] = "TIME";
    AsnPropTypes[AsnPropTypes["Null"] = 27] = "Null";
  })(AsnPropTypes || (AsnPropTypes = {}));

  function isConvertible(target) {
    if (target && target.prototype) {
      if (target.prototype.toASN && target.prototype.fromASN) {
        return true;
      } else {
        return isConvertible(target.prototype);
      }
    } else {
      return !!(target && target.toASN && target.fromASN);
    }
  }

  function isArrayEqual(bytes1, bytes2) {
    if (!(bytes1 && bytes2)) {
      return false;
    }

    if (bytes1.byteLength !== bytes2.byteLength) {
      return false;
    }

    const b1 = new Uint8Array(bytes1);
    const b2 = new Uint8Array(bytes2);

    for (let i = 0; i < bytes1.byteLength; i++) {
      if (b1[i] !== b2[i]) {
        return false;
      }
    }

    return true;
  }

  class AsnSchemaStorage {
    constructor() {
      this.items = new WeakMap();
    }

    has(target) {
      return this.items.has(target);
    }

    get(target) {
      var _a, _b, _c, _d;

      const schema = this.items.get(target);

      if (!schema) {
        throw new Error(`Cannot get schema for '${(_d = (_c = (_b = (_a = target) === null || _a === void 0 ? void 0 : _a.prototype) === null || _b === void 0 ? void 0 : _b.constructor) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : target}' target`);
      }

      return schema;
    }

    cache(target) {
      const schema = this.get(target);

      if (!schema.schema) {
        schema.schema = this.create(target, true);
      }
    }

    createDefault(target) {
      const schema = {
        type: AsnTypeTypes.Sequence,
        items: {}
      };
      const parentSchema = this.findParentSchema(target);

      if (parentSchema) {
        Object.assign(schema, parentSchema);
        schema.items = Object.assign({}, schema.items, parentSchema.items);
      }

      return schema;
    }

    create(target, useNames) {
      const schema = this.items.get(target) || this.createDefault(target);
      const asn1Value = [];

      for (const key in schema.items) {
        const item = schema.items[key];
        const name = useNames ? key : "";
        let asn1Item;

        if (typeof item.type === "number") {
          const Asn1TypeName = AsnPropTypes[item.type];
          const Asn1Type = asn1$2[Asn1TypeName];

          if (!Asn1Type) {
            throw new Error(`Cannot get ASN1 class by name '${Asn1TypeName}'`);
          }

          asn1Item = new Asn1Type({
            name
          });
        } else if (isConvertible(item.type)) {
          const instance = new item.type();
          asn1Item = instance.toSchema(name);
        } else {
          asn1Item = new asn1_7({
            name
          });
        }

        const optional = !!item.optional || item.defaultValue !== undefined;

        if (item.repeated) {
          asn1Item.name = "";
          const Container = item.repeated === "set" ? asn1_35 : asn1_36;
          asn1Item = new Container({
            name: "",
            value: [new asn1_6({
              name,
              value: asn1Item
            })]
          });
        }

        if (item.context !== null && item.context !== undefined) {
          if (item.implicit) {
            if (typeof item.type === "number" || isConvertible(item.type)) {
              const Container = item.repeated ? asn1_39 : asn1_40;
              asn1Value.push(new Container({
                name,
                optional,
                idBlock: {
                  tagClass: 3,
                  tagNumber: item.context
                }
              }));
            } else {
              this.cache(item.type);
              const isRepeated = !!item.repeated;
              let value = !isRepeated ? this.get(item.type).schema : asn1Item;
              value = value.valueBlock ? value.valueBlock.value : value.value;
              asn1Value.push(new asn1_39({
                name: !isRepeated ? name : "",
                optional,
                idBlock: {
                  tagClass: 3,
                  tagNumber: item.context
                },
                value
              }));
            }
          } else {
            asn1Value.push(new asn1_39({
              optional,
              idBlock: {
                tagClass: 3,
                tagNumber: item.context
              },
              value: [asn1Item]
            }));
          }
        } else {
          asn1Item.optional = optional;
          asn1Value.push(asn1Item);
        }
      }

      switch (schema.type) {
        case AsnTypeTypes.Sequence:
          return new asn1_36({
            value: asn1Value,
            name: ""
          });

        case AsnTypeTypes.Set:
          return new asn1_35({
            value: asn1Value,
            name: ""
          });

        case AsnTypeTypes.Choice:
          return new asn1_8({
            value: asn1Value,
            name: ""
          });

        default:
          throw new Error(`Unsupported ASN1 type in use`);
      }
    }

    set(target, schema) {
      this.items.set(target, schema);
      return this;
    }

    findParentSchema(target) {
      const parent = target.__proto__;

      if (parent) {
        const schema = this.items.get(parent);
        return schema || this.findParentSchema(parent);
      }

      return null;
    }

  }

  const schemaStorage = new AsnSchemaStorage();

  const AsnType = options => target => {
    let schema;

    if (!schemaStorage.has(target)) {
      schema = schemaStorage.createDefault(target);
      schemaStorage.set(target, schema);
    } else {
      schema = schemaStorage.get(target);
    }

    Object.assign(schema, options);
  };

  const AsnProp = options => (target, propertyKey) => {
    let schema;

    if (!schemaStorage.has(target.constructor)) {
      schema = schemaStorage.createDefault(target.constructor);
      schemaStorage.set(target.constructor, schema);
    } else {
      schema = schemaStorage.get(target.constructor);
    }

    const copyOptions = Object.assign({}, options);

    if (typeof copyOptions.type === "number" && !copyOptions.converter) {
      const converterName = `Asn${AsnPropTypes[options.type]}Converter`;
      const defaultConverter = defaultConverters[converterName];

      if (!defaultConverter) {
        throw new Error(`Cannot get '${converterName}' for property '${propertyKey}' of ${target.constructor.name}`);
      }

      copyOptions.converter = defaultConverter;
    }

    schema.items[propertyKey] = copyOptions;
  };

  class AsnSerializer {
    static serialize(obj) {
      if (obj instanceof asn1_41) {
        return obj.toBER(false);
      }

      return this.toASN(obj).toBER(false);
    }

    static toASN(obj) {
      if (obj && isConvertible(obj.constructor)) {
        return obj.toASN();
      }

      const target = obj.constructor;
      const schema = schemaStorage.get(target);
      schemaStorage.cache(target);
      let asn1Value = [];

      if (schema.itemType) {
        asn1Value = obj.map(o => this.toAsnItem({
          type: schema.itemType
        }, "[]", target, o));
      } else {
        for (const key in schema.items) {
          const schemaItem = schema.items[key];
          const objProp = obj[key];

          if (objProp === undefined || schemaItem.defaultValue === objProp || typeof schemaItem.defaultValue === "object" && typeof objProp === "object" && isArrayEqual(this.serialize(schemaItem.defaultValue), this.serialize(objProp))) {
            continue;
          }

          let asn1Item = AsnSerializer.toAsnItem(schemaItem, key, target, objProp);

          if (typeof schemaItem.context === "number") {
            if (schemaItem.implicit) {
              if (!schemaItem.repeated && (typeof schemaItem.type === "number" || isConvertible(schemaItem.type))) {
                const value = {};
                value.valueHex = asn1Item.valueBlock.toBER();
                asn1Value.push(new asn1_40(Object.assign({
                  optional: schemaItem.optional,
                  idBlock: {
                    tagClass: 3,
                    tagNumber: schemaItem.context
                  }
                }, value)));
              } else {
                asn1Value.push(new asn1_39({
                  optional: schemaItem.optional,
                  idBlock: {
                    tagClass: 3,
                    tagNumber: schemaItem.context
                  },
                  value: asn1Item.valueBlock.value
                }));
              }
            } else {
              asn1Value.push(new asn1_39({
                optional: schemaItem.optional,
                idBlock: {
                  tagClass: 3,
                  tagNumber: schemaItem.context
                },
                value: [asn1Item]
              }));
            }
          } else if (schemaItem.repeated) {
            asn1Value = asn1Value.concat(asn1Item);
          } else {
            asn1Value.push(asn1Item);
          }
        }
      }

      let asnSchema;

      switch (schema.type) {
        case AsnTypeTypes.Sequence:
          asnSchema = new asn1_36({
            value: asn1Value
          });
          break;

        case AsnTypeTypes.Set:
          asnSchema = new asn1_35({
            value: asn1Value
          });
          break;

        case AsnTypeTypes.Choice:
          if (!asn1Value[0]) {
            throw new Error(`Schema '${target.name}' has wrong data. Choice cannot be empty.`);
          }

          asnSchema = asn1Value[0];
          break;
      }

      return asnSchema;
    }

    static toAsnItem(schemaItem, key, target, objProp) {
      let asn1Item;

      if (typeof schemaItem.type === "number") {
        const converter = schemaItem.converter;

        if (!converter) {
          throw new Error(`Property '${key}' doesn't have converter for type ${AsnPropTypes[schemaItem.type]} in schema '${target.name}'`);
        }

        if (schemaItem.repeated) {
          const items = Array.from(objProp, element => converter.toASN(element));
          const Container = schemaItem.repeated === "sequence" ? asn1_36 : asn1_35;
          asn1Item = new Container({
            value: items
          });
        } else {
          asn1Item = converter.toASN(objProp);
        }
      } else {
        if (schemaItem.repeated) {
          const items = Array.from(objProp, element => this.toASN(element));
          const Container = schemaItem.repeated === "sequence" ? asn1_36 : asn1_35;
          asn1Item = new Container({
            value: items
          });
        } else {
          asn1Item = this.toASN(objProp);
        }
      }

      return asn1Item;
    }

  }

  class JsonError extends Error {
    constructor(message, innerError) {
      super(innerError ? `${message}. See the inner exception for more details.` : message);
      this.message = message;
      this.innerError = innerError;
    }

  }

  class ValidationError extends JsonError {}

  var JsonPropTypes;

  (function (JsonPropTypes) {
    JsonPropTypes[JsonPropTypes["Any"] = 0] = "Any";
    JsonPropTypes[JsonPropTypes["Boolean"] = 1] = "Boolean";
    JsonPropTypes[JsonPropTypes["Number"] = 2] = "Number";
    JsonPropTypes[JsonPropTypes["String"] = 3] = "String";
  })(JsonPropTypes || (JsonPropTypes = {}));

  function checkType(value, type) {
    switch (type) {
      case JsonPropTypes.Boolean:
        return typeof value === "boolean";

      case JsonPropTypes.Number:
        return typeof value === "number";

      case JsonPropTypes.String:
        return typeof value === "string";
    }

    return true;
  }

  function throwIfTypeIsWrong(value, type) {
    if (!checkType(value, type)) {
      throw new TypeError(`Value must be ${JsonPropTypes[type]}`);
    }
  }

  function isConvertible$1(target) {
    if (target && target.prototype) {
      if (target.prototype.toJSON && target.prototype.fromJSON) {
        return true;
      } else {
        return isConvertible$1(target.prototype);
      }
    } else {
      return !!(target && target.toJSON && target.fromJSON);
    }
  }

  class JsonSchemaStorage {
    constructor() {
      this.items = new Map();
    }

    has(target) {
      return this.items.has(target) || !!this.findParentSchema(target);
    }

    get(target) {
      const schema = this.items.get(target) || this.findParentSchema(target);

      if (!schema) {
        throw new Error("Cannot get schema for current target");
      }

      return schema;
    }

    create(target) {
      const schema = {
        names: {}
      };
      const parentSchema = this.findParentSchema(target);

      if (parentSchema) {
        Object.assign(schema, parentSchema);
        schema.names = {};

        for (const name in parentSchema.names) {
          schema.names[name] = Object.assign({}, parentSchema.names[name]);
        }
      }

      schema.target = target;
      return schema;
    }

    set(target, schema) {
      this.items.set(target, schema);
      return this;
    }

    findParentSchema(target) {
      const parent = target.__proto__;

      if (parent) {
        const schema = this.items.get(parent);
        return schema || this.findParentSchema(parent);
      }

      return null;
    }

  }

  const DEFAULT_SCHEMA = "default";
  const schemaStorage$1 = new JsonSchemaStorage();

  class PatternValidation {
    constructor(pattern) {
      this.pattern = new RegExp(pattern);
    }

    validate(value) {
      const pattern = new RegExp(this.pattern.source, this.pattern.flags);

      if (typeof value !== "string") {
        throw new ValidationError("Incoming value must be string");
      }

      if (!pattern.exec(value)) {
        throw new ValidationError(`Value doesn't match to pattern '${pattern.toString()}'`);
      }
    }

  }

  class InclusiveValidation {
    constructor(min = Number.MIN_VALUE, max = Number.MAX_VALUE) {
      this.min = min;
      this.max = max;
    }

    validate(value) {
      throwIfTypeIsWrong(value, JsonPropTypes.Number);

      if (!(this.min <= value && value <= this.max)) {
        const min = this.min === Number.MIN_VALUE ? "MIN" : this.min;
        const max = this.max === Number.MAX_VALUE ? "MAX" : this.max;
        throw new ValidationError(`Value doesn't match to diapason [${min},${max}]`);
      }
    }

  }

  class ExclusiveValidation {
    constructor(min = Number.MIN_VALUE, max = Number.MAX_VALUE) {
      this.min = min;
      this.max = max;
    }

    validate(value) {
      throwIfTypeIsWrong(value, JsonPropTypes.Number);

      if (!(this.min < value && value < this.max)) {
        const min = this.min === Number.MIN_VALUE ? "MIN" : this.min;
        const max = this.max === Number.MAX_VALUE ? "MAX" : this.max;
        throw new ValidationError(`Value doesn't match to diapason (${min},${max})`);
      }
    }

  }

  class LengthValidation {
    constructor(length, minLength, maxLength) {
      this.length = length;
      this.minLength = minLength;
      this.maxLength = maxLength;
    }

    validate(value) {
      if (this.length !== undefined) {
        if (value.length !== this.length) {
          throw new ValidationError(`Value length must be exactly ${this.length}.`);
        }

        return;
      }

      if (this.minLength !== undefined) {
        if (value.length < this.minLength) {
          throw new ValidationError(`Value length must be more than ${this.minLength}.`);
        }
      }

      if (this.maxLength !== undefined) {
        if (value.length > this.maxLength) {
          throw new ValidationError(`Value length must be less than ${this.maxLength}.`);
        }
      }
    }

  }

  class EnumerationValidation {
    constructor(enumeration) {
      this.enumeration = enumeration;
    }

    validate(value) {
      throwIfTypeIsWrong(value, JsonPropTypes.String);

      if (!this.enumeration.includes(value)) {
        throw new ValidationError(`Value must be one of ${this.enumeration.map(v => `'${v}'`).join(", ")}`);
      }
    }

  }

  function getValidations(item) {
    const validations = [];

    if (item.pattern) {
      validations.push(new PatternValidation(item.pattern));
    }

    if (item.type === JsonPropTypes.Number || item.type === JsonPropTypes.Any) {
      if (item.minInclusive !== undefined || item.maxInclusive !== undefined) {
        validations.push(new InclusiveValidation(item.minInclusive, item.maxInclusive));
      }

      if (item.minExclusive !== undefined || item.maxExclusive !== undefined) {
        validations.push(new ExclusiveValidation(item.minExclusive, item.maxExclusive));
      }

      if (item.enumeration !== undefined) {
        validations.push(new EnumerationValidation(item.enumeration));
      }
    }

    if (item.type === JsonPropTypes.String || item.repeated || item.type === JsonPropTypes.Any) {
      if (item.length !== undefined || item.minLength !== undefined || item.maxLength !== undefined) {
        validations.push(new LengthValidation(item.length, item.minLength, item.maxLength));
      }
    }

    return validations;
  }

  const JsonProp = (options = {}) => (target, propertyKey) => {
    const errorMessage = `Cannot set type for ${propertyKey} property of ${target.constructor.name} schema`;
    let schema;

    if (!schemaStorage$1.has(target.constructor)) {
      schema = schemaStorage$1.create(target.constructor);
      schemaStorage$1.set(target.constructor, schema);
    } else {
      schema = schemaStorage$1.get(target.constructor);

      if (schema.target !== target.constructor) {
        schema = schemaStorage$1.create(target.constructor);
        schemaStorage$1.set(target.constructor, schema);
      }
    }

    const defaultSchema = {
      type: JsonPropTypes.Any,
      validations: []
    };
    const copyOptions = Object.assign(defaultSchema, options);
    copyOptions.validations = getValidations(copyOptions);

    if (typeof copyOptions.type !== "number") {
      if (!schemaStorage$1.has(copyOptions.type) && !isConvertible$1(copyOptions.type)) {
        throw new Error(`${errorMessage}. Assigning type doesn't have schema.`);
      }
    }

    let schemaNames;

    if (Array.isArray(options.schema)) {
      schemaNames = options.schema;
    } else {
      schemaNames = [options.schema || DEFAULT_SCHEMA];
    }

    for (const schemaName of schemaNames) {
      if (!schema.names[schemaName]) {
        schema.names[schemaName] = {};
      }

      const namedSchema = schema.names[schemaName];
      namedSchema[propertyKey] = copyOptions;
    }
  };

  class CryptoError extends Error {}

  class PemConverter {
    static toArrayBuffer(pem) {
      const base64 = pem.replace(/-{5}(BEGIN|END) .*-{5}/g, "").replace("\r", "").replace("\n", "");
      return Convert.FromBase64(base64);
    }

    static toUint8Array(pem) {
      const bytes = this.toArrayBuffer(pem);
      return new Uint8Array(bytes);
    }

    static fromBufferSource(buffer, tag) {
      const base64 = Convert.ToBase64(buffer);
      let sliced;
      let offset = 0;
      const rows = [];

      while (true) {
        sliced = base64.slice(offset, offset = offset + 64);

        if (sliced.length) {
          rows.push(sliced);

          if (sliced.length < 64) {
            break;
          }
        } else {
          break;
        }
      }

      const upperCaseTag = tag.toUpperCase();
      return `-----BEGIN ${upperCaseTag}-----\n${rows.join("\n")}\n-----END ${upperCaseTag}-----`;
    }

    static isPEM(data) {
      return /-----BEGIN .+-----[A-Za-z0-9+\/\+\=\s\n]+-----END .+-----/i.test(data);
    }

    static getTagName(pem) {
      if (!this.isPEM(pem)) {
        throw new Error("Bad parameter. Incoming data is not right PEM");
      }

      const res = /-----BEGIN (.+)-----/.exec(pem);

      if (!res) {
        throw new Error("Cannot get tag from PEM");
      }

      return res[1];
    }

    static hasTagName(pem, tagName) {
      const tag = this.getTagName(pem);
      return tagName.toLowerCase() === tag.toLowerCase();
    }

    static isCertificate(pem) {
      return this.hasTagName(pem, "certificate");
    }

    static isCertificateRequest(pem) {
      return this.hasTagName(pem, "certificate request");
    }

    static isCRL(pem) {
      return this.hasTagName(pem, "x509 crl");
    }

    static isPublicKey(pem) {
      return this.hasTagName(pem, "public key");
    }

  }

  let ObjectIdentifier = class ObjectIdentifier {
    constructor(value) {
      if (value) {
        this.value = value;
      }
    }

  };

  __decorate$2([AsnProp({
    type: AsnPropTypes.ObjectIdentifier
  })], ObjectIdentifier.prototype, "value", void 0);

  ObjectIdentifier = __decorate$2([AsnType({
    type: AsnTypeTypes.Choice
  })], ObjectIdentifier);

  class AlgorithmIdentifier {
    constructor(params) {
      Object.assign(this, params);
    }

  }

  __decorate$2([AsnProp({
    type: AsnPropTypes.ObjectIdentifier
  })], AlgorithmIdentifier.prototype, "algorithm", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.Any,
    optional: true
  })], AlgorithmIdentifier.prototype, "parameters", void 0);

  class PrivateKeyInfo {
    constructor() {
      this.version = 0;
      this.privateKeyAlgorithm = new AlgorithmIdentifier();
      this.privateKey = new ArrayBuffer(0);
    }

  }

  __decorate$2([AsnProp({
    type: AsnPropTypes.Integer
  })], PrivateKeyInfo.prototype, "version", void 0);

  __decorate$2([AsnProp({
    type: AlgorithmIdentifier
  })], PrivateKeyInfo.prototype, "privateKeyAlgorithm", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.OctetString
  })], PrivateKeyInfo.prototype, "privateKey", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.Any,
    optional: true
  })], PrivateKeyInfo.prototype, "attributes", void 0);

  class PublicKeyInfo {
    constructor() {
      this.publicKeyAlgorithm = new AlgorithmIdentifier();
      this.publicKey = new ArrayBuffer(0);
    }

  }

  __decorate$2([AsnProp({
    type: AlgorithmIdentifier
  })], PublicKeyInfo.prototype, "publicKeyAlgorithm", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.BitString
  })], PublicKeyInfo.prototype, "publicKey", void 0);

  const JsonBase64UrlArrayBufferConverter = {
    fromJSON: value => Convert.FromBase64Url(value),
    toJSON: value => Convert.ToBase64Url(new Uint8Array(value))
  };
  const AsnIntegerArrayBufferConverter$1 = {
    fromASN: value => {
      const valueHex = value.valueBlock.valueHex;
      return !new Uint8Array(valueHex)[0] ? value.valueBlock.valueHex.slice(1) : value.valueBlock.valueHex;
    },
    toASN: value => {
      const valueHex = new Uint8Array(value)[0] > 127 ? Buffer.concat([Buffer.from([0]), Buffer.from(value)]) : Buffer.from(value);
      return new asn1_31({
        valueHex: new Uint8Array(valueHex).buffer
      });
    }
  };
  var index = Object.freeze({
    __proto__: null,
    JsonBase64UrlArrayBufferConverter: JsonBase64UrlArrayBufferConverter,
    AsnIntegerArrayBufferConverter: AsnIntegerArrayBufferConverter$1
  });

  class RsaPrivateKey {
    constructor() {
      this.version = 0;
      this.modulus = new ArrayBuffer(0);
      this.publicExponent = new ArrayBuffer(0);
      this.privateExponent = new ArrayBuffer(0);
      this.prime1 = new ArrayBuffer(0);
      this.prime2 = new ArrayBuffer(0);
      this.exponent1 = new ArrayBuffer(0);
      this.exponent2 = new ArrayBuffer(0);
      this.coefficient = new ArrayBuffer(0);
    }

  }

  __decorate$2([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerConverter
  })], RsaPrivateKey.prototype, "version", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "n",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "modulus", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "e",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "publicExponent", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "d",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "privateExponent", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "p",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "prime1", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "q",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "prime2", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "dp",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "exponent1", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "dq",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "exponent2", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "qi",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "coefficient", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.Any,
    optional: true
  })], RsaPrivateKey.prototype, "otherPrimeInfos", void 0);

  class RsaPublicKey {
    constructor() {
      this.modulus = new ArrayBuffer(0);
      this.publicExponent = new ArrayBuffer(0);
    }

  }

  __decorate$2([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "n",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPublicKey.prototype, "modulus", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "e",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPublicKey.prototype, "publicExponent", void 0);

  let EcPublicKey = class EcPublicKey {
    constructor(value) {
      this.value = new ArrayBuffer(0);

      if (value) {
        this.value = value;
      }
    }

    toJSON() {
      let bytes = new Uint8Array(this.value);

      if (bytes[0] !== 0x04) {
        throw new CryptoError("Wrong ECPoint. Current version supports only Uncompressed (0x04) point");
      }

      bytes = new Uint8Array(this.value.slice(1));
      const size = bytes.length / 2;
      const offset = 0;
      const json = {
        x: Convert.ToBase64Url(bytes.buffer.slice(offset, offset + size)),
        y: Convert.ToBase64Url(bytes.buffer.slice(offset + size, offset + size + size))
      };
      return json;
    }

    fromJSON(json) {
      if (!("x" in json)) {
        throw new Error("x: Missing required property");
      }

      if (!("y" in json)) {
        throw new Error("y: Missing required property");
      }

      const x = Convert.FromBase64Url(json.x);
      const y = Convert.FromBase64Url(json.y);
      const value = Buffer.concat([new Uint8Array([0x04]), new Uint8Array(x), new Uint8Array(y)]);
      this.value = new Uint8Array(value).buffer;
      return this;
    }

  };

  __decorate$2([AsnProp({
    type: AsnPropTypes.OctetString
  })], EcPublicKey.prototype, "value", void 0);

  EcPublicKey = __decorate$2([AsnType({
    type: AsnTypeTypes.Choice
  })], EcPublicKey);

  class EcPrivateKey {
    constructor() {
      this.version = 1;
      this.privateKey = new ArrayBuffer(0);
    }

    fromJSON(json) {
      if (!("d" in json)) {
        throw new Error("d: Missing required property");
      }

      this.privateKey = Convert.FromBase64Url(json.d);

      if ("x" in json) {
        const publicKey = new EcPublicKey();
        publicKey.fromJSON(json);
        this.publicKey = AsnSerializer.toASN(publicKey).valueBlock.valueHex;
      }

      return this;
    }

    toJSON() {
      const jwk = {};
      jwk.d = Convert.ToBase64Url(this.privateKey);

      if (this.publicKey) {
        Object.assign(jwk, new EcPublicKey(this.publicKey).toJSON());
      }

      return jwk;
    }

  }

  __decorate$2([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerConverter
  })], EcPrivateKey.prototype, "version", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.OctetString
  })], EcPrivateKey.prototype, "privateKey", void 0);

  __decorate$2([AsnProp({
    context: 0,
    type: AsnPropTypes.Any,
    optional: true
  })], EcPrivateKey.prototype, "parameters", void 0);

  __decorate$2([AsnProp({
    context: 1,
    type: AsnPropTypes.BitString,
    optional: true
  })], EcPrivateKey.prototype, "publicKey", void 0);

  const AsnIntegerWithoutPaddingConverter = {
    fromASN: value => {
      const bytes = new Uint8Array(value.valueBlock.valueHex);
      return bytes[0] === 0 ? bytes.buffer.slice(1) : bytes.buffer;
    },
    toASN: value => {
      const bytes = new Uint8Array(value);

      if (bytes[0] > 127) {
        const newValue = new Uint8Array(bytes.length + 1);
        newValue.set(bytes, 1);
        return new asn1_31({
          valueHex: newValue.buffer
        });
      }

      return new asn1_31({
        valueHex: value
      });
    }
  };
  var index$1 = Object.freeze({
    __proto__: null,
    AsnIntegerWithoutPaddingConverter: AsnIntegerWithoutPaddingConverter
  });

  class EcDsaSignature {
    constructor() {
      this.r = new ArrayBuffer(0);
      this.s = new ArrayBuffer(0);
    }

    static fromWebCryptoSignature(value) {
      const wcSignature = BufferSourceConverter.toUint8Array(value);
      const pointSize = wcSignature.byteLength / 2;
      const ecSignature = new this();
      ecSignature.r = ecSignature.removePadding(wcSignature.slice(0, pointSize));
      ecSignature.s = ecSignature.removePadding(wcSignature.slice(pointSize, pointSize * 2));
      return ecSignature;
    }

    toWebCryptoSignature(pointSize) {
      pointSize = this.getPointSize();
      const r = this.addPadding(pointSize, BufferSourceConverter.toUint8Array(this.r));
      const s = this.addPadding(pointSize, BufferSourceConverter.toUint8Array(this.s));
      const wcSignature = new Uint8Array(r.byteLength + s.byteLength);
      wcSignature.set(r, 0);
      wcSignature.set(s, r.length);
      return wcSignature.buffer;
    }

    getPointSize() {
      const size = Math.max(this.r.byteLength, this.s.byteLength);

      switch (size) {
        case 31:
        case 32:
          return 32;

        case 47:
        case 48:
          return 48;

        case 65:
        case 66:
          return 66;
      }

      throw new Error("Unsupported EC point size");
    }

    addPadding(pointSize, bytes) {
      const res = new Uint8Array(pointSize);
      const uint8Array = BufferSourceConverter.toUint8Array(bytes);
      res.set(uint8Array, pointSize - uint8Array.length);
      return res;
    }

    removePadding(bytes) {
      const uint8Array = BufferSourceConverter.toUint8Array(bytes);

      for (let i = 0; i < uint8Array.length; i++) {
        if (!uint8Array[i]) {
          continue;
        }

        return uint8Array.slice(i);
      }

      return new Uint8Array(0);
    }

  }

  __decorate$2([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerWithoutPaddingConverter
  })], EcDsaSignature.prototype, "r", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerWithoutPaddingConverter
  })], EcDsaSignature.prototype, "s", void 0);

  var index$2 = Object.freeze({
    __proto__: null,
    converters: index$1,

    get ObjectIdentifier() {
      return ObjectIdentifier;
    },

    AlgorithmIdentifier: AlgorithmIdentifier,
    PrivateKeyInfo: PrivateKeyInfo,
    PublicKeyInfo: PublicKeyInfo,
    RsaPrivateKey: RsaPrivateKey,
    RsaPublicKey: RsaPublicKey,
    EcPrivateKey: EcPrivateKey,

    get EcPublicKey() {
      return EcPublicKey;
    },

    EcDsaSignature: EcDsaSignature
  });
  var index$3 = Object.freeze({
    __proto__: null,
    converters: index
  });

  function Cast(data) {
    return data;
  }

  function isHashedAlgorithm(data) {
    return data instanceof Object && "name" in data && "hash" in data;
  }

  function prepareAlgorithm(algorithm) {
    if (algorithm instanceof AlgorithmProto) {
      return algorithm;
    }

    const algProto = new AlgorithmProto();

    if (typeof algorithm === "string") {
      algProto.fromAlgorithm({
        name: algorithm
      });
    } else if (isHashedAlgorithm(algorithm)) {
      const preparedAlgorithm = _objectSpread2({}, algorithm);

      preparedAlgorithm.hash = prepareAlgorithm(algorithm.hash);
      algProto.fromAlgorithm(preparedAlgorithm);
    } else {
      algProto.fromAlgorithm(_objectSpread2({}, algorithm));
    }

    return algProto;
  }

  function isCryptoKey(data) {
    return data instanceof CryptoKeyProto;
  }

  function isCryptoCertificate(data) {
    return data instanceof CryptoCertificateProto;
  }

  function checkAlgorithm(algorithm, param) {
    if (!(algorithm && (typeof algorithm === "object" || typeof algorithm === "string"))) {
      throw new TypeError(`${param}: Is wrong type. Must be Object or String`);
    }

    if (typeof algorithm === "object" && !("name" in algorithm)) {
      throw new TypeError(`${param}: Required property 'name' is missed`);
    }
  }

  function checkCryptoKey(data, param) {
    if (!isCryptoKey(data)) {
      throw new TypeError(`${param}: Is not type CryptoKey`);
    }
  }

  function checkCryptoCertificate(data, param) {
    if (!isCryptoCertificate(data)) {
      throw new TypeError(`${param}: Is not type CryptoCertificate`);
    }
  }

  function checkBufferSource(data, param) {
    if (!BufferSourceConverter.isBufferSource(data)) {
      throw new TypeError(`${param}: Is wrong type. Must be ArrayBuffer or ArrayBuffer view`);
    }
  }

  function checkArray(data, param) {
    if (!Array.isArray(data)) {
      throw new TypeError(`${param}: Is not type Array`);
    }
  }

  function checkPrimitive(data, type, param) {
    if (typeof data !== type) {
      throw new TypeError(`${param}: Is not type '${type}'`);
    }
  }

  const IMPORT_CERT_FORMATS = ["raw", "pem", "x509", "request"];

  class CertificateStorage {
    constructor(provider) {
      this.provider = provider;
    }

    async indexOf(item) {
      checkCryptoCertificate(item, "item");
      const proto = new CertificateStorageIndexOfActionProto();
      proto.providerID = this.provider.id;
      proto.item = item;
      const result = await this.provider.client.send(proto);
      return result ? Convert.ToUtf8String(result) : null;
    }

    async hasItem(item) {
      const index = await this.indexOf(item);
      return !!index;
    }

    async exportCert(format, item) {
      checkPrimitive(format, "string", "format");
      checkCryptoCertificate(item, "item");
      const proto = new CertificateStorageExportActionProto();
      proto.providerID = this.provider.id;
      proto.format = "raw";
      proto.item = item;
      const result = await this.provider.client.send(proto);

      if (format === "raw") {
        return result;
      } else {
        let header = "";

        switch (item.type) {
          case "x509":
            {
              header = "CERTIFICATE";
              break;
            }

          case "request":
            {
              header = "CERTIFICATE REQUEST";
              break;
            }

          default:
            throw new Error(`Cannot create PEM for unknown type of certificate item`);
        }

        const pem = PemConverter.fromBufferSource(result, header);
        return pem;
      }
    }

    async importCert(format, data, algorithm, keyUsages) {
      checkPrimitive(format, "string", "format");

      if (!~IMPORT_CERT_FORMATS.indexOf(format)) {
        throw new TypeError(`format: Is invalid value. Must be ${IMPORT_CERT_FORMATS.join(", ")}`);
      }

      if (format === "pem") {
        checkPrimitive(data, "string", "data");
      } else {
        checkBufferSource(data, "data");
      }

      checkAlgorithm(algorithm, "algorithm");
      checkArray(keyUsages, "keyUsages");
      const algProto = prepareAlgorithm(algorithm);
      let rawData;

      if (BufferSourceConverter.isBufferSource(data)) {
        rawData = BufferSourceConverter.toArrayBuffer(data);
      } else if (typeof data === "string") {
        rawData = PemConverter.toArrayBuffer(data);
      } else {
        throw new TypeError("data: Is not type String, ArrayBuffer or ArrayBufferView");
      }

      const proto = new CertificateStorageImportActionProto();
      proto.providerID = this.provider.id;
      proto.format = "raw";
      proto.data = rawData;
      proto.algorithm = algProto;
      proto.keyUsages = keyUsages;
      const result = await this.provider.client.send(proto);
      const certItem = await CryptoCertificateProto.importProto(result);

      if ((format === "request" || format === "x509") && certItem.type !== format) {
        throw new TypeError(`Imported item is not ${format}`);
      }

      return this.prepareCertItem(certItem);
    }

    async keys() {
      const proto = new CertificateStorageKeysActionProto();
      proto.providerID = this.provider.id;
      const result = await this.provider.client.send(proto);

      if (result) {
        const keys = Convert.ToUtf8String(result).split(",");
        return keys;
      }

      return [];
    }

    async getItem(key, algorithm, keyUsages) {
      checkPrimitive(key, "string", "key");

      if (algorithm) {
        checkAlgorithm(algorithm, "algorithm");
        checkArray(keyUsages, "keyUsages");
      }

      const proto = new CertificateStorageGetItemActionProto();
      proto.providerID = this.provider.id;
      proto.key = key;

      if (algorithm) {
        proto.algorithm = prepareAlgorithm(algorithm);
        proto.keyUsages = keyUsages;
      }

      const result = await this.provider.client.send(proto);

      if (result && result.byteLength) {
        const certItem = await CryptoCertificateProto.importProto(result);
        return this.prepareCertItem(certItem);
      }

      throw new Error("Cannot get CryptoCertificate from storage by index");
    }

    async setItem(value) {
      checkCryptoCertificate(value, "value");
      const proto = new CertificateStorageSetItemActionProto();
      proto.providerID = this.provider.id;
      proto.item = value;
      const data = await this.provider.client.send(proto);
      return Convert.ToUtf8String(data);
    }

    async removeItem(key) {
      checkPrimitive(key, "string", "key");
      const proto = new CertificateStorageRemoveItemActionProto();
      proto.providerID = this.provider.id;
      proto.key = key;
      await this.provider.client.send(proto);
    }

    async clear() {
      const proto = new CertificateStorageClearActionProto();
      proto.providerID = this.provider.id;
      await this.provider.client.send(proto);
    }

    async getChain(value) {
      checkCryptoCertificate(value, "value");
      const proto = new CertificateStorageGetChainActionProto();
      proto.providerID = this.provider.id;
      proto.item = value;
      const data = await this.provider.client.send(proto);
      const resultProto = await CertificateStorageGetChainResultProto.importProto(data);
      return resultProto.items;
    }

    async getCRL(url) {
      checkPrimitive(url, "string", "url");
      const proto = new CertificateStorageGetCRLActionProto();
      proto.providerID = this.provider.id;
      proto.url = url;
      const data = await this.provider.client.send(proto);
      return data;
    }

    async getOCSP(url, request, options) {
      checkPrimitive(url, "string", "url");
      checkBufferSource(request, "request");
      const proto = new CertificateStorageGetOCSPActionProto();
      proto.providerID = this.provider.id;
      proto.url = url;
      proto.request = BufferSourceConverter.toArrayBuffer(request);

      if (options) {
        for (const key in options) {
          proto.options[key] = options[key];
        }
      }

      const data = await this.provider.client.send(proto);
      return data;
    }

    async prepareCertItem(item) {
      const raw = await item.exportProto();
      let result;

      switch (item.type) {
        case "x509":
          {
            result = await CryptoX509CertificateProto.importProto(raw);
            break;
          }

        case "request":
          {
            result = await CryptoX509CertificateRequestProto.importProto(raw);
            break;
          }

        default:
          throw new Error(`Unsupported CertificateItem type '${item.type}'`);
      }

      result.provider = this.provider;
      return result;
    }

  }

  class KeyStorage {
    constructor(service) {
      this.service = service;
    }

    async keys() {
      const proto = new KeyStorageKeysActionProto();
      proto.providerID = this.service.id;
      const result = await this.service.client.send(proto);

      if (result) {
        const keys = Convert.ToUtf8String(result).split(",");
        return keys;
      }

      return [];
    }

    async indexOf(item) {
      checkCryptoKey(item, "item");
      const proto = new KeyStorageIndexOfActionProto();
      proto.providerID = this.service.id;
      proto.item = item;
      const result = await this.service.client.send(proto);
      return result ? Convert.ToUtf8String(result) : null;
    }

    async hasItem(item) {
      const index = await this.indexOf(item);
      return !!index;
    }

    async getItem(key, algorithm, extractable, usages) {
      checkPrimitive(key, "string", "key");

      if (algorithm) {
        checkAlgorithm(algorithm, "algorithm");
        checkPrimitive(extractable, "boolean", "extractable");
        checkArray(usages, "usages");
      }

      const proto = new KeyStorageGetItemActionProto();
      proto.providerID = this.service.id;
      proto.key = key;

      if (algorithm) {
        proto.algorithm = prepareAlgorithm(algorithm);
        proto.extractable = extractable;
        proto.keyUsages = usages;
      }

      const result = await this.service.client.send(proto);
      let socketKey;

      if (result && result.byteLength) {
        socketKey = await CryptoKeyProto.importProto(result);
      } else {
        throw new Error("Cannot get CryptoKey from key storage by index");
      }

      return socketKey;
    }

    async setItem(value) {
      checkCryptoKey(value, "value");
      const proto = new KeyStorageSetItemActionProto();
      proto.providerID = this.service.id;
      proto.item = value;
      const data = await this.service.client.send(proto);
      return Convert.ToUtf8String(data);
    }

    async removeItem(key) {
      checkPrimitive(key, "string", "key");
      const proto = new KeyStorageRemoveItemActionProto();
      proto.providerID = this.service.id;
      proto.key = key;
      await this.service.client.send(proto);
    }

    async clear() {
      const proto = new KeyStorageClearActionProto();
      proto.providerID = this.service.id;
      await this.service.client.send(proto);
    }

  }

  class SubtleCrypto {
    constructor(crypto) {
      this.service = crypto;
    }

    async encrypt(algorithm, key, data) {
      return this.encryptData(algorithm, key, data, "encrypt");
    }

    async decrypt(algorithm, key, data) {
      return this.encryptData(algorithm, key, data, "decrypt");
    }

    async deriveBits(algorithm, baseKey, length) {
      checkAlgorithm(algorithm, "algorithm");
      checkCryptoKey(baseKey, "baseKey");
      checkPrimitive(length, "number", "length");
      const algProto = prepareAlgorithm(algorithm);
      checkCryptoKey(algProto.public, "algorithm.public");
      algProto.public = await Cast(algProto.public).exportProto();
      const action = new DeriveBitsActionProto();
      action.providerID = this.service.id;
      action.algorithm = algProto;
      action.key = baseKey;
      action.length = length;
      const result = await this.service.client.send(action);
      return result;
    }

    async deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages) {
      checkAlgorithm(algorithm, "algorithm");
      checkCryptoKey(baseKey, "baseKey");
      checkAlgorithm(derivedKeyType, "algorithm");
      checkPrimitive(extractable, "boolean", "extractable");
      checkArray(keyUsages, "keyUsages");
      const algProto = prepareAlgorithm(algorithm);
      checkCryptoKey(algProto.public, "algorithm.public");
      algProto.public = await Cast(algProto.public).exportProto();
      const algKeyType = prepareAlgorithm(derivedKeyType);
      const action = new DeriveKeyActionProto();
      action.providerID = this.service.id;
      action.algorithm = algProto;
      action.derivedKeyType.fromAlgorithm(algKeyType);
      action.key = baseKey;
      action.extractable = extractable;
      action.usage = keyUsages;
      const result = await this.service.client.send(action);
      return await CryptoKeyProto.importProto(result);
    }

    async digest(algorithm, data) {
      return getEngine().crypto.subtle.digest(algorithm, data);
    }

    async generateKey(algorithm, extractable, keyUsages) {
      checkAlgorithm(algorithm, "algorithm");
      checkPrimitive(extractable, "boolean", "extractable");
      checkArray(keyUsages, "keyUsages");
      const algProto = prepareAlgorithm(algorithm);
      const action = new GenerateKeyActionProto();
      action.providerID = this.service.id;
      action.algorithm = algProto;
      action.extractable = extractable;
      action.usage = keyUsages;
      const result = await this.service.client.send(action);

      try {
        const keyPair = await CryptoKeyPairProto.importProto(result);
        return keyPair;
      } catch (e) {
        const key = await CryptoKeyProto.importProto(result);
        return key;
      }
    }

    async exportKey(format, key) {
      checkPrimitive(format, "string", "format");
      checkCryptoKey(key, "key");
      const action = new ExportKeyActionProto();
      action.providerID = this.service.id;
      action.format = format;
      action.key = key;
      const result = await this.service.client.send(action);

      if (format === "jwk") {
        return JSON.parse(Convert.ToBinary(result));
      } else {
        return result;
      }
    }

    async importKey(format, keyData, algorithm, extractable, keyUsages) {
      checkPrimitive(format, "string", "format");
      checkAlgorithm(algorithm, "algorithm");
      checkPrimitive(extractable, "boolean", "extractable");
      checkArray(keyUsages, "keyUsages");
      const algProto = prepareAlgorithm(algorithm);
      let preparedKeyData;

      if (format === "jwk") {
        preparedKeyData = Convert.FromUtf8String(JSON.stringify(keyData));
      } else {
        checkBufferSource(keyData, "keyData");
        preparedKeyData = BufferSourceConverter.toArrayBuffer(keyData);
      }

      const action = new ImportKeyActionProto();
      action.providerID = this.service.id;
      action.algorithm = algProto;
      action.keyData = preparedKeyData;
      action.format = format;
      action.extractable = extractable;
      action.keyUsages = keyUsages;
      const result = await this.service.client.send(action);
      return await CryptoKeyProto.importProto(result);
    }

    async sign(algorithm, key, data) {
      checkAlgorithm(algorithm, "algorithm");
      checkCryptoKey(key, "key");
      checkBufferSource(data, "data");
      const algProto = prepareAlgorithm(algorithm);
      const rawData = BufferSourceConverter.toArrayBuffer(data);
      const action = new SignActionProto();
      action.providerID = this.service.id;
      action.algorithm = algProto;
      action.key = key;
      action.data = rawData;
      const result = await this.service.client.send(action);
      return result;
    }

    async verify(algorithm, key, signature, data) {
      checkAlgorithm(algorithm, "algorithm");
      checkCryptoKey(key, "key");
      checkBufferSource(signature, "signature");
      checkBufferSource(data, "data");
      const algProto = prepareAlgorithm(algorithm);
      const rawSignature = BufferSourceConverter.toArrayBuffer(signature);
      const rawData = BufferSourceConverter.toArrayBuffer(data);
      const action = new VerifyActionProto();
      action.providerID = this.service.id;
      action.algorithm = algProto;
      action.key = key;
      action.data = rawData;
      action.signature = rawSignature;
      const result = await this.service.client.send(action);
      return !!new Uint8Array(result)[0];
    }

    async wrapKey(format, key, wrappingKey, wrapAlgorithm) {
      checkPrimitive(format, "string", "format");
      checkCryptoKey(key, "key");
      checkCryptoKey(wrappingKey, "wrappingKey");
      checkAlgorithm(wrapAlgorithm, "wrapAlgorithm");
      const wrapAlgProto = prepareAlgorithm(wrapAlgorithm);
      const action = new WrapKeyActionProto();
      action.providerID = this.service.id;
      action.wrapAlgorithm = wrapAlgProto;
      action.key = key;
      action.wrappingKey = wrappingKey;
      action.format = format;
      const result = await this.service.client.send(action);
      return result;
    }

    async unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages) {
      checkPrimitive(format, "string", "format");
      checkBufferSource(wrappedKey, "wrappedKey");
      checkCryptoKey(unwrappingKey, "unwrappingKey");
      checkAlgorithm(unwrapAlgorithm, "unwrapAlgorithm");
      checkAlgorithm(unwrappedKeyAlgorithm, "unwrappedKeyAlgorithm");
      checkPrimitive(extractable, "boolean", "extractable");
      checkArray(keyUsages, "keyUsages");
      const unwrapAlgProto = prepareAlgorithm(unwrapAlgorithm);
      const unwrappedKeyAlgProto = prepareAlgorithm(unwrappedKeyAlgorithm);
      const rawWrappedKey = BufferSourceConverter.toArrayBuffer(wrappedKey);
      const action = new UnwrapKeyActionProto();
      action.providerID = this.service.id;
      action.format = format;
      action.unwrapAlgorithm = unwrapAlgProto;
      action.unwrappedKeyAlgorithm = unwrappedKeyAlgProto;
      action.unwrappingKey = unwrappingKey;
      action.wrappedKey = rawWrappedKey;
      action.extractable = extractable;
      action.keyUsage = keyUsages;
      const result = await this.service.client.send(action);
      return await CryptoKeyProto.importProto(result);
    }

    async encryptData(algorithm, key, data, type) {
      checkAlgorithm(algorithm, "algorithm");
      checkCryptoKey(key, "key");
      checkBufferSource(data, "data");
      const algProto = prepareAlgorithm(algorithm);
      const rawData = BufferSourceConverter.toArrayBuffer(data);
      let ActionClass;

      if (type === "encrypt") {
        ActionClass = EncryptActionProto;
      } else {
        ActionClass = DecryptActionProto;
      }

      const action = new ActionClass();
      action.providerID = this.service.id;
      action.algorithm = algProto;
      action.key = key;
      action.data = rawData;
      const result = await this.service.client.send(action);
      return result;
    }

  }

  class SocketCrypto {
    constructor(client, id) {
      this.client = client;
      this.id = id;
      this.subtle = new SubtleCrypto(this);
      this.keyStorage = new KeyStorage(this);
      this.certStorage = new CertificateStorage(this);
    }

    getRandomValues(array) {
      return getEngine().crypto.getRandomValues(array);
    }

    async login() {
      const action = new LoginActionProto();
      action.providerID = this.id;
      return this.client.send(action);
    }

    async logout() {
      const action = new LogoutActionProto();
      action.providerID = this.id;
      return this.client.send(action);
    }

    async reset() {
      const action = new ResetActionProto();
      action.providerID = this.id;
      return this.client.send(action);
    }

    async isLoggedIn() {
      const action = new IsLoggedInActionProto();
      action.providerID = this.id;
      const res = await this.client.send(action);
      return !!new Uint8Array(res)[0];
    }

  }

  class SocketProvider extends EventEmitter {
    constructor(options) {
      super();
      this.client = new Client(options.storage);
      this.cardReader = new CardReader(this.client);
    }

    get state() {
      return this.client.state;
    }

    connect(address, options) {
      this.removeAllListeners();
      this.client.connect(address, options).on("error", e => {
        this.emit("error", e.error);
      }).on("event", proto => {
        (async () => {
          switch (proto.action) {
            case ProviderTokenEventProto.ACTION:
              {
                const tokenProto = await ProviderTokenEventProto.importProto(await proto.exportProto());
                this.emit("token", tokenProto);
              }

            case ProviderAuthorizedEventProto.ACTION:
              {
                const authProto = await ProviderAuthorizedEventProto.importProto(await proto.exportProto());
                this.emit("auth", authProto);
              }
          }
        })();
      }).on("listening", e => {
        this.emit("listening", address);
      }).on("close", e => {
        this.emit("close", e.remoteAddress);
      });
      return this;
    }

    close() {
      this.client.close();
    }

    on(event, listener) {
      console.log("SocketProvider:on", event);
      return super.on(event, listener);
    }

    once(event, listener) {
      return super.once(event, listener);
    }

    async info() {
      const proto = new ProviderInfoActionProto();
      const result = await this.client.send(proto);
      const infoProto = await ProviderInfoProto.importProto(result);
      return infoProto;
    }

    async challenge() {
      return this.client.challenge();
    }

    async isLoggedIn() {
      return this.client.isLoggedIn();
    }

    async login() {
      return this.client.login();
    }

    async getCrypto(cryptoID) {
      const actionProto = new ProviderGetCryptoActionProto();
      actionProto.cryptoID = cryptoID;
      await this.client.send(actionProto);
      return new SocketCrypto(this.client, cryptoID);
    }

  }

  class RatchetStorage {}

  var idb = createCommonjsModule(function (module) {
    (function () {
      function toArray(arr) {
        return Array.prototype.slice.call(arr);
      }

      function promisifyRequest(request) {
        return new Promise(function (resolve, reject) {
          request.onsuccess = function () {
            resolve(request.result);
          };

          request.onerror = function () {
            reject(request.error);
          };
        });
      }

      function promisifyRequestCall(obj, method, args) {
        var request;
        var p = new Promise(function (resolve, reject) {
          request = obj[method].apply(obj, args);
          promisifyRequest(request).then(resolve, reject);
        });
        p.request = request;
        return p;
      }

      function promisifyCursorRequestCall(obj, method, args) {
        var p = promisifyRequestCall(obj, method, args);
        return p.then(function (value) {
          if (!value) return;
          return new Cursor(value, p.request);
        });
      }

      function proxyProperties(ProxyClass, targetProp, properties) {
        properties.forEach(function (prop) {
          Object.defineProperty(ProxyClass.prototype, prop, {
            get: function () {
              return this[targetProp][prop];
            },
            set: function (val) {
              this[targetProp][prop] = val;
            }
          });
        });
      }

      function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
        properties.forEach(function (prop) {
          if (!(prop in Constructor.prototype)) return;

          ProxyClass.prototype[prop] = function () {
            return promisifyRequestCall(this[targetProp], prop, arguments);
          };
        });
      }

      function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
        properties.forEach(function (prop) {
          if (!(prop in Constructor.prototype)) return;

          ProxyClass.prototype[prop] = function () {
            return this[targetProp][prop].apply(this[targetProp], arguments);
          };
        });
      }

      function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
        properties.forEach(function (prop) {
          if (!(prop in Constructor.prototype)) return;

          ProxyClass.prototype[prop] = function () {
            return promisifyCursorRequestCall(this[targetProp], prop, arguments);
          };
        });
      }

      function Index(index) {
        this._index = index;
      }

      proxyProperties(Index, '_index', ['name', 'keyPath', 'multiEntry', 'unique']);
      proxyRequestMethods(Index, '_index', IDBIndex, ['get', 'getKey', 'getAll', 'getAllKeys', 'count']);
      proxyCursorRequestMethods(Index, '_index', IDBIndex, ['openCursor', 'openKeyCursor']);

      function Cursor(cursor, request) {
        this._cursor = cursor;
        this._request = request;
      }

      proxyProperties(Cursor, '_cursor', ['direction', 'key', 'primaryKey', 'value']);
      proxyRequestMethods(Cursor, '_cursor', IDBCursor, ['update', 'delete']);
      ['advance', 'continue', 'continuePrimaryKey'].forEach(function (methodName) {
        if (!(methodName in IDBCursor.prototype)) return;

        Cursor.prototype[methodName] = function () {
          var cursor = this;
          var args = arguments;
          return Promise.resolve().then(function () {
            cursor._cursor[methodName].apply(cursor._cursor, args);

            return promisifyRequest(cursor._request).then(function (value) {
              if (!value) return;
              return new Cursor(value, cursor._request);
            });
          });
        };
      });

      function ObjectStore(store) {
        this._store = store;
      }

      ObjectStore.prototype.createIndex = function () {
        return new Index(this._store.createIndex.apply(this._store, arguments));
      };

      ObjectStore.prototype.index = function () {
        return new Index(this._store.index.apply(this._store, arguments));
      };

      proxyProperties(ObjectStore, '_store', ['name', 'keyPath', 'indexNames', 'autoIncrement']);
      proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, ['put', 'add', 'delete', 'clear', 'get', 'getAll', 'getKey', 'getAllKeys', 'count']);
      proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, ['openCursor', 'openKeyCursor']);
      proxyMethods(ObjectStore, '_store', IDBObjectStore, ['deleteIndex']);

      function Transaction(idbTransaction) {
        this._tx = idbTransaction;
        this.complete = new Promise(function (resolve, reject) {
          idbTransaction.oncomplete = function () {
            resolve();
          };

          idbTransaction.onerror = function () {
            reject(idbTransaction.error);
          };

          idbTransaction.onabort = function () {
            reject(idbTransaction.error);
          };
        });
      }

      Transaction.prototype.objectStore = function () {
        return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
      };

      proxyProperties(Transaction, '_tx', ['objectStoreNames', 'mode']);
      proxyMethods(Transaction, '_tx', IDBTransaction, ['abort']);

      function UpgradeDB(db, oldVersion, transaction) {
        this._db = db;
        this.oldVersion = oldVersion;
        this.transaction = new Transaction(transaction);
      }

      UpgradeDB.prototype.createObjectStore = function () {
        return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
      };

      proxyProperties(UpgradeDB, '_db', ['name', 'version', 'objectStoreNames']);
      proxyMethods(UpgradeDB, '_db', IDBDatabase, ['deleteObjectStore', 'close']);

      function DB(db) {
        this._db = db;
      }

      DB.prototype.transaction = function () {
        return new Transaction(this._db.transaction.apply(this._db, arguments));
      };

      proxyProperties(DB, '_db', ['name', 'version', 'objectStoreNames']);
      proxyMethods(DB, '_db', IDBDatabase, ['close']);
      ['openCursor', 'openKeyCursor'].forEach(function (funcName) {
        [ObjectStore, Index].forEach(function (Constructor) {
          if (!(funcName in Constructor.prototype)) return;

          Constructor.prototype[funcName.replace('open', 'iterate')] = function () {
            var args = toArray(arguments);
            var callback = args[args.length - 1];
            var nativeObject = this._store || this._index;
            var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));

            request.onsuccess = function () {
              callback(request.result);
            };
          };
        });
      });
      [Index, ObjectStore].forEach(function (Constructor) {
        if (Constructor.prototype.getAll) return;

        Constructor.prototype.getAll = function (query, count) {
          var instance = this;
          var items = [];
          return new Promise(function (resolve) {
            instance.iterateCursor(query, function (cursor) {
              if (!cursor) {
                resolve(items);
                return;
              }

              items.push(cursor.value);

              if (count !== undefined && items.length == count) {
                resolve(items);
                return;
              }

              cursor.continue();
            });
          });
        };
      });
      var exp = {
        open: function (name, version, upgradeCallback) {
          var p = promisifyRequestCall(indexedDB, 'open', [name, version]);
          var request = p.request;

          if (request) {
            request.onupgradeneeded = function (event) {
              if (upgradeCallback) {
                upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
              }
            };
          }

          return p.then(function (db) {
            return new DB(db);
          });
        },
        delete: function (name) {
          return promisifyRequestCall(indexedDB, 'deleteDatabase', [name]);
        }
      };
      {
        module.exports = exp;
        module.exports.default = module.exports;
      }
    })();
  });
  var node = createCommonjsModule(function (module) {
    if (typeof indexedDB != 'undefined') {
      module.exports = idb;
    } else {
      module.exports = {
        open: function () {
          return Promise.reject('IDB requires a browser environment');
        },
        delete: function () {
          return Promise.reject('IDB requires a browser environment');
        }
      };
    }
  });
  var node_1 = node.open;

  let BrowserStorage = (() => {
    class BrowserStorage extends RatchetStorage {
      constructor(db) {
        super();
        this.db = db;
      }

      static async create() {
        const db = await node.open(this.STORAGE_NAME, 2, updater => {
          if (updater.oldVersion === 1) {
            updater.deleteObjectStore(this.SESSION_STORAGE);
            updater.deleteObjectStore(this.IDENTITY_STORAGE);
            updater.deleteObjectStore(this.REMOTE_STORAGE);
          }

          updater.createObjectStore(this.SESSION_STORAGE);
          updater.createObjectStore(this.IDENTITY_STORAGE);
          updater.createObjectStore(this.REMOTE_STORAGE);
        });
        return new BrowserStorage(db);
      }

      async loadWrapKey() {
        const wKey = await this.db.transaction(BrowserStorage.IDENTITY_STORAGE).objectStore(BrowserStorage.IDENTITY_STORAGE).get(BrowserStorage.WRAP_KEY);

        if (wKey) {
          AES_CBC.iv = wKey.iv;

          if (wKey.key instanceof ArrayBuffer) {
            const key = await getEngine().crypto.subtle.importKey("raw", wKey.key, {
              name: AES_CBC.name,
              length: 256
            }, true, ["encrypt", "decrypt", "wrapKey", "unwrapKey"]);
            return {
              key,
              iv: wKey.iv
            };
          }

          return {
            key: wKey.key,
            iv: wKey.iv
          };
        }

        return null;
      }

      async saveWrapKey(key) {
        let item;

        if (isEdge() || isIE()) {
          const raw = await getEngine().crypto.subtle.exportKey("raw", key.key);
          item = {
            key: raw,
            iv: key.iv
          };
        } else {
          item = _objectSpread2({}, key);
        }

        await this.db.transaction(BrowserStorage.IDENTITY_STORAGE, "readwrite").objectStore(BrowserStorage.IDENTITY_STORAGE).put(item, BrowserStorage.WRAP_KEY);
      }

      async loadIdentity() {
        const json = await this.db.transaction(BrowserStorage.IDENTITY_STORAGE).objectStore(BrowserStorage.IDENTITY_STORAGE).get(BrowserStorage.IDENTITY);
        let res = null;

        if (json) {
          if (isFirefox() || isEdge() || isIE()) {
            const wKey = await this.loadWrapKey();

            if (!(wKey && wKey.key.usages.some(usage => usage === "encrypt") && json.exchangeKey.privateKey instanceof ArrayBuffer)) {
              return null;
            }

            json.exchangeKey.privateKey = await getEngine().crypto.subtle.unwrapKey("jwk", json.exchangeKey.privateKey, wKey.key, AES_CBC, ECDH, false, ["deriveKey", "deriveBits"]);
            json.signingKey.privateKey = await getEngine().crypto.subtle.unwrapKey("jwk", json.signingKey.privateKey, wKey.key, AES_CBC, ECDSA, false, ["sign"]);
            json.exchangeKey.publicKey = await getEngine().crypto.subtle.unwrapKey("jwk", json.exchangeKey.publicKey, wKey.key, AES_CBC, ECDH, true, []);
            json.signingKey.publicKey = await getEngine().crypto.subtle.unwrapKey("jwk", json.signingKey.publicKey, wKey.key, AES_CBC, ECDSA, true, ["verify"]);
          }

          res = await Identity.fromJSON(json);
        }

        return res;
      }

      async saveIdentity(value) {
        let wKey;

        if (isFirefox() || isEdge() || isIE()) {
          wKey = {
            key: await getEngine().crypto.subtle.generateKey({
              name: AES_CBC.name,
              length: 256
            }, isEdge() || isIE(), ["wrapKey", "unwrapKey", "encrypt", "decrypt"]),
            iv: getEngine().crypto.getRandomValues(new Uint8Array(AES_CBC.iv)).buffer
          };
          await this.saveWrapKey(wKey);
          const exchangeKeyPair = await getEngine().crypto.subtle.generateKey(value.exchangeKey.privateKey.algorithm, true, ["deriveKey", "deriveBits"]);
          value.exchangeKey.privateKey = exchangeKeyPair.privateKey;
          await updateEcPublicKey(value.exchangeKey.publicKey, exchangeKeyPair.publicKey);
          const signingKeyPair = await getEngine().crypto.subtle.generateKey(value.signingKey.privateKey.algorithm, true, ["sign", "verify"]);
          value.signingKey.privateKey = signingKeyPair.privateKey;
          await updateEcPublicKey(value.signingKey.publicKey, signingKeyPair.publicKey);
        }

        const json = await value.toJSON();

        if (wKey) {
          json.exchangeKey.privateKey = await getEngine().crypto.subtle.wrapKey("jwk", value.exchangeKey.privateKey, wKey.key, AES_CBC);
          json.signingKey.privateKey = await getEngine().crypto.subtle.wrapKey("jwk", value.signingKey.privateKey, wKey.key, AES_CBC);
          json.exchangeKey.publicKey = await getEngine().crypto.subtle.wrapKey("jwk", value.exchangeKey.publicKey.key, wKey.key, AES_CBC);
          json.signingKey.publicKey = await getEngine().crypto.subtle.wrapKey("jwk", value.signingKey.publicKey.key, wKey.key, AES_CBC);
        }

        await this.db.transaction(BrowserStorage.IDENTITY_STORAGE, "readwrite").objectStore(BrowserStorage.IDENTITY_STORAGE).put(json, BrowserStorage.IDENTITY);
      }

      async loadRemoteIdentity(key) {
        const json = await this.db.transaction(BrowserStorage.REMOTE_STORAGE).objectStore(BrowserStorage.REMOTE_STORAGE).get(key);
        let res = null;

        if (json) {
          const wKey = await this.loadWrapKey();

          if (wKey) {
            json.exchangeKey = await getEngine().crypto.subtle.unwrapKey("jwk", json.exchangeKey, wKey.key, AES_CBC, ECDH, true, []);
            json.signingKey = await getEngine().crypto.subtle.unwrapKey("jwk", json.signingKey, wKey.key, AES_CBC, ECDSA, true, ["verify"]);
          }

          res = await RemoteIdentity.fromJSON(json);
        }

        return res;
      }

      async saveRemoteIdentity(key, value) {
        const json = await value.toJSON();
        const wKey = await this.loadWrapKey();

        if (wKey) {
          json.exchangeKey = await getEngine().crypto.subtle.wrapKey("jwk", json.exchangeKey, wKey.key, AES_CBC);
          json.signingKey = await getEngine().crypto.subtle.wrapKey("jwk", json.signingKey, wKey.key, AES_CBC);
        }

        await this.db.transaction(BrowserStorage.REMOTE_STORAGE, "readwrite").objectStore(BrowserStorage.REMOTE_STORAGE).put(json, key);
      }

      async loadSession(key) {
        const json = await this.db.transaction(BrowserStorage.SESSION_STORAGE).objectStore(BrowserStorage.SESSION_STORAGE).get(key);
        let res = null;

        if (json) {
          const identity = await this.loadIdentity();

          if (!identity) {
            throw new Error("Identity is empty");
          }

          const remoteIdentity = await this.loadRemoteIdentity(key);

          if (!remoteIdentity) {
            throw new Error("Remote identity is not found");
          }

          res = await AsymmetricRatchet.fromJSON(identity, remoteIdentity, json);
        }

        return res;
      }

      async saveSession(key, value) {
        const json = await value.toJSON();
        await this.db.transaction(BrowserStorage.SESSION_STORAGE, "readwrite").objectStore(BrowserStorage.SESSION_STORAGE).put(json, key);
      }

    }

    BrowserStorage.STORAGE_NAME = "webcrypto-remote";
    BrowserStorage.IDENTITY_STORAGE = "identity";
    BrowserStorage.SESSION_STORAGE = "sessions";
    BrowserStorage.REMOTE_STORAGE = "remoteIdentity";
    BrowserStorage.WRAP_KEY = "wkey";
    BrowserStorage.IDENTITY = "identity";
    return BrowserStorage;
  })();

  class MemoryStorage extends RatchetStorage {
    constructor() {
      super(...arguments);
      this.remoteIdentities = {};
      this.sessions = {};
    }

    async loadIdentity() {
      return this.identity || null;
    }

    async saveIdentity(value) {
      this.identity = value;
    }

    async loadRemoteIdentity(key) {
      return this.remoteIdentities[key] || null;
    }

    async saveRemoteIdentity(key, value) {
      this.remoteIdentities[key] = value;
    }

    async loadSession(key) {
      return this.sessions[key] || null;
    }

    async saveSession(key, value) {
      this.sessions[key] = value;
    }

  }

  exports.BrowserStorage = BrowserStorage;
  exports.CryptoServerError = CryptoServerError;
  exports.MemoryStorage = MemoryStorage;
  exports.RatchetStorage = RatchetStorage;
  exports.SocketCrypto = SocketCrypto;
  exports.SocketProvider = SocketProvider;
  exports.getEngine = getEngine;
  exports.setEngine = setEngine;

  return exports;

}({}, protobuf, fetch, WebSocket));
self.WebcryptoSocket=WebcryptoSocket;