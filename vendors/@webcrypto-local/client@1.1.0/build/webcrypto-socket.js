var WebcryptoSocket = (function (exports, protobufjs, fetch, WebSocket) {
  'use strict';

  fetch = fetch && Object.prototype.hasOwnProperty.call(fetch, 'default') ? fetch['default'] : fetch;
  WebSocket = WebSocket && Object.prototype.hasOwnProperty.call(WebSocket, 'default') ? WebSocket['default'] : WebSocket;

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

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

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function () {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o) {
    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var it,
        normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
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

  var Convert = /*#__PURE__*/function () {
    function Convert() {
      _classCallCheck(this, Convert);
    }

    _createClass(Convert, null, [{
      key: "ToString",
      value: function ToString(buffer) {
        var enc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "utf8";
        var buf = PrepareBuffer(buffer);

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
            throw new Error("Unknown type of encoding '".concat(enc, "'"));
        }
      }
    }, {
      key: "FromString",
      value: function FromString(str) {
        var enc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "utf8";

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
            throw new Error("Unknown type of encoding '".concat(enc, "'"));
        }
      }
    }, {
      key: "ToBase64",
      value: function ToBase64(buffer) {
        var buf = PrepareBuffer(buffer);

        if (typeof btoa !== "undefined") {
          var binary = this.ToString(buf, "binary");
          return btoa(binary);
        } else {
          return Buffer.from(buf).toString("base64");
        }
      }
    }, {
      key: "FromBase64",
      value: function FromBase64(base64Text) {
        base64Text = base64Text.replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "").replace(/\s/g, "");

        if (typeof atob !== "undefined") {
          return this.FromBinary(atob(base64Text));
        } else {
          return new Uint8Array(Buffer.from(base64Text, "base64")).buffer;
        }
      }
    }, {
      key: "FromBase64Url",
      value: function FromBase64Url(base64url) {
        return this.FromBase64(this.Base64Padding(base64url.replace(/\-/g, "+").replace(/\_/g, "/")));
      }
    }, {
      key: "ToBase64Url",
      value: function ToBase64Url(data) {
        return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
      }
    }, {
      key: "FromUtf8String",
      value: function FromUtf8String(text) {
        var s = unescape(encodeURIComponent(text));
        var uintArray = new Uint8Array(s.length);

        for (var i = 0; i < s.length; i++) {
          uintArray[i] = s.charCodeAt(i);
        }

        return uintArray.buffer;
      }
    }, {
      key: "ToUtf8String",
      value: function ToUtf8String(buffer) {
        var buf = PrepareBuffer(buffer);
        var encodedString = String.fromCharCode.apply(null, buf);
        var decodedString = decodeURIComponent(escape(encodedString));
        return decodedString;
      }
    }, {
      key: "FromBinary",
      value: function FromBinary(text) {
        var stringLength = text.length;
        var resultView = new Uint8Array(stringLength);

        for (var i = 0; i < stringLength; i++) {
          resultView[i] = text.charCodeAt(i);
        }

        return resultView.buffer;
      }
    }, {
      key: "ToBinary",
      value: function ToBinary(buffer) {
        var buf = PrepareBuffer(buffer);
        var resultString = "";
        var len = buf.length;

        for (var i = 0; i < len; i++) {
          resultString = resultString + String.fromCharCode(buf[i]);
        }

        return resultString;
      }
    }, {
      key: "ToHex",
      value: function ToHex(buffer) {
        var buf = PrepareBuffer(buffer);
        var splitter = "";
        var res = [];
        var len = buf.length;

        for (var i = 0; i < len; i++) {
          var char = buf[i].toString(16);
          res.push(char.length === 1 ? "0" + char : char);
        }

        return res.join(splitter);
      }
    }, {
      key: "FromHex",
      value: function FromHex(hexString) {
        var res = new Uint8Array(hexString.length / 2);

        for (var i = 0; i < hexString.length; i = i + 2) {
          var c = hexString.slice(i, i + 2);
          res[i / 2] = parseInt(c, 16);
        }

        return res.buffer;
      }
    }, {
      key: "Base64Padding",
      value: function Base64Padding(base64) {
        var padCount = 4 - base64.length % 4;

        if (padCount < 4) {
          for (var i = 0; i < padCount; i++) {
            base64 += "=";
          }
        }

        return base64;
      }
    }]);

    return Convert;
  }();

  var BufferSourceConverter = /*#__PURE__*/function () {
    function BufferSourceConverter() {
      _classCallCheck(this, BufferSourceConverter);
    }

    _createClass(BufferSourceConverter, null, [{
      key: "toArrayBuffer",
      value: function toArrayBuffer(data) {
        var buf = this.toUint8Array(data);

        if (buf.byteOffset || buf.length) {
          return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
        }

        return buf.buffer;
      }
    }, {
      key: "toUint8Array",
      value: function toUint8Array(data) {
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
    }, {
      key: "isBufferSource",
      value: function isBufferSource(data) {
        return ArrayBuffer.isView(data) || data instanceof ArrayBuffer;
      }
    }]);

    return BufferSourceConverter;
  }();

  function assign(target) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    var res = arguments[0];

    for (var i = 1; i < arguments.length; i++) {
      var obj = arguments[i];

      for (var prop in obj) {
        res[prop] = obj[prop];
      }
    }

    return res;
  }

  function combine() {
    for (var _len2 = arguments.length, buf = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      buf[_key2] = arguments[_key2];
    }

    var totalByteLength = buf.map(function (item) {
      return item.byteLength;
    }).reduce(function (prev, cur) {
      return prev + cur;
    });
    var res = new Uint8Array(totalByteLength);
    var currentPos = 0;
    buf.map(function (item) {
      return new Uint8Array(item);
    }).forEach(function (arr) {
      var _iterator = _createForOfIteratorHelper(arr),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item2 = _step.value;
          res[currentPos++] = item2;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });
    return res.buffer;
  }

  function _isEqual(bytes1, bytes2) {
    if (!(bytes1 && bytes2)) {
      return false;
    }

    if (bytes1.byteLength !== bytes2.byteLength) {
      return false;
    }

    var b1 = new Uint8Array(bytes1);
    var b2 = new Uint8Array(bytes2);

    for (var i = 0; i < bytes1.byteLength; i++) {
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
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  var ArrayBufferConverter = /*#__PURE__*/function () {
    function ArrayBufferConverter() {
      _classCallCheck(this, ArrayBufferConverter);
    }

    _createClass(ArrayBufferConverter, null, [{
      key: "set",
      value: function () {
        var _set = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(value) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt("return", new Uint8Array(value));

                case 1:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function set(_x) {
          return _set.apply(this, arguments);
        }

        return set;
      }()
    }, {
      key: "get",
      value: function () {
        var _get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(value) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  return _context2.abrupt("return", new Uint8Array(value).buffer);

                case 1:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function get(_x2) {
          return _get.apply(this, arguments);
        }

        return get;
      }()
    }]);

    return ArrayBufferConverter;
  }();

  function ProtobufElement(params) {
    return function (target) {
      var t = target;
      t.localName = params.name || t.name || t.toString().match(/^function\s*([^\s(]+)/)[1];
      t.items = t.items || {};
      t.target = target;
      t.items = assign({}, t.items);
      var scheme = new protobufjs.Type(t.localName);

      for (var key in t.items) {
        var item = t.items[key];
        var rule = void 0;

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
    var propertyKey = "_".concat(key);
    var opt = {
      set: function set(v) {
        if (this[propertyKey] !== v) {
          this.raw = null;
          this[propertyKey] = v;
        }
      },
      get: function get() {
        if (this[propertyKey] === void 0) {
          var defaultValue = params.defaultValue;

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
    return function (target, propertyKey) {
      var t = target.constructor;
      var key = propertyKey;
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

  var ObjectProto = /*#__PURE__*/function () {
    function ObjectProto() {
      _classCallCheck(this, ObjectProto);
    }

    _createClass(ObjectProto, [{
      key: "isEmpty",
      value: function isEmpty() {
        return this.raw === undefined;
      }
    }, {
      key: "hasChanged",
      value: function hasChanged() {
        if (this.raw === null) {
          return true;
        }

        var thisStatic = this.constructor;
        var that = this;

        for (var key in thisStatic.items) {
          var item = thisStatic.items[key];

          if (item.repeated) {
            if (item.parser) {
              return that[key].some(function (arrayItem) {
                return arrayItem.hasChanged();
              });
            }
          } else {
            if (item.parser && that[key] && that[key].hasChanged()) {
              return true;
            }
          }
        }

        return false;
      }
    }, {
      key: "importProto",
      value: function () {
        var _importProto = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data) {
          var thisStatic, that, scheme, raw, key, item, schemeValues, _iterator2, _step2, schemeValue;

          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  thisStatic = this.constructor;
                  that = this;

                  if (!(data instanceof ObjectProto)) {
                    _context3.next = 8;
                    break;
                  }

                  _context3.next = 5;
                  return data.exportProto();

                case 5:
                  raw = _context3.sent;
                  _context3.next = 9;
                  break;

                case 8:
                  raw = data;

                case 9:
                  _context3.prev = 9;
                  scheme = thisStatic.protobuf.decode(new Uint8Array(raw));
                  _context3.next = 16;
                  break;

                case 13:
                  _context3.prev = 13;
                  _context3.t0 = _context3["catch"](9);
                  throw new Error("Error: Cannot decode message for ".concat(thisStatic.localName, ".\n$ProtobufError: ").concat(_context3.t0.message));

                case 16:
                  _context3.t1 = regeneratorRuntime.keys(thisStatic.items);

                case 17:
                  if ((_context3.t2 = _context3.t1()).done) {
                    _context3.next = 52;
                    break;
                  }

                  key = _context3.t2.value;
                  item = thisStatic.items[key];
                  schemeValues = scheme[item.name];

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

                  _iterator2 = _createForOfIteratorHelper(schemeValues);
                  _context3.prev = 25;

                  _iterator2.s();

                case 27:
                  if ((_step2 = _iterator2.n()).done) {
                    _context3.next = 42;
                    break;
                  }

                  schemeValue = _step2.value;

                  if (!item.repeated) {
                    _context3.next = 37;
                    break;
                  }

                  _context3.t3 = that[key];
                  _context3.next = 33;
                  return this.importItem(item, schemeValue);

                case 33:
                  _context3.t4 = _context3.sent;

                  _context3.t3.push.call(_context3.t3, _context3.t4);

                  _context3.next = 40;
                  break;

                case 37:
                  _context3.next = 39;
                  return this.importItem(item, schemeValue);

                case 39:
                  that[key] = _context3.sent;

                case 40:
                  _context3.next = 27;
                  break;

                case 42:
                  _context3.next = 47;
                  break;

                case 44:
                  _context3.prev = 44;
                  _context3.t5 = _context3["catch"](25);

                  _iterator2.e(_context3.t5);

                case 47:
                  _context3.prev = 47;

                  _iterator2.f();

                  return _context3.finish(47);

                case 50:
                  _context3.next = 17;
                  break;

                case 52:
                  this.raw = raw;

                case 53:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this, [[9, 13], [25, 44, 47, 50]]);
        }));

        function importProto(_x3) {
          return _importProto.apply(this, arguments);
        }

        return importProto;
      }()
    }, {
      key: "exportProto",
      value: function () {
        var _exportProto = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
          var thisStatic, that, protobuf, key, item, values, _iterator3, _step3, value, protobufValue;

          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  if (this.hasChanged()) {
                    _context4.next = 2;
                    break;
                  }

                  return _context4.abrupt("return", this.raw);

                case 2:
                  thisStatic = this.constructor;
                  that = this;
                  protobuf = {};
                  _context4.t0 = regeneratorRuntime.keys(thisStatic.items);

                case 6:
                  if ((_context4.t1 = _context4.t0()).done) {
                    _context4.next = 32;
                    break;
                  }

                  key = _context4.t1.value;
                  item = thisStatic.items[key];
                  values = that[key];

                  if (!Array.isArray(values)) {
                    values = values === void 0 ? [] : [values];
                  }

                  _iterator3 = _createForOfIteratorHelper(values);
                  _context4.prev = 12;

                  _iterator3.s();

                case 14:
                  if ((_step3 = _iterator3.n()).done) {
                    _context4.next = 22;
                    break;
                  }

                  value = _step3.value;
                  _context4.next = 18;
                  return this.exportItem(item, value);

                case 18:
                  protobufValue = _context4.sent;

                  if (item.repeated) {
                    if (!protobuf[item.name]) {
                      protobuf[item.name] = [];
                    }

                    protobuf[item.name].push(protobufValue);
                  } else {
                    protobuf[item.name] = protobufValue;
                  }

                case 20:
                  _context4.next = 14;
                  break;

                case 22:
                  _context4.next = 27;
                  break;

                case 24:
                  _context4.prev = 24;
                  _context4.t2 = _context4["catch"](12);

                  _iterator3.e(_context4.t2);

                case 27:
                  _context4.prev = 27;

                  _iterator3.f();

                  return _context4.finish(27);

                case 30:
                  _context4.next = 6;
                  break;

                case 32:
                  this.raw = new Uint8Array(thisStatic.protobuf.encode(protobuf).finish()).buffer;
                  return _context4.abrupt("return", this.raw);

                case 34:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this, [[12, 24, 27, 30]]);
        }));

        function exportProto() {
          return _exportProto.apply(this, arguments);
        }

        return exportProto;
      }()
    }, {
      key: "exportItem",
      value: function () {
        var _exportItem = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(template, value) {
          var thisStatic, result, obj, raw;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  thisStatic = this.constructor;

                  if (!template.parser) {
                    _context5.next = 11;
                    break;
                  }

                  obj = value;
                  _context5.next = 5;
                  return obj.exportProto();

                case 5:
                  raw = _context5.sent;

                  if (!(template.required && !raw)) {
                    _context5.next = 8;
                    break;
                  }

                  throw new Error("Error: Paramter '".concat(template.name, "' is required in '").concat(thisStatic.localName, "' protobuf message."));

                case 8:
                  if (raw) {
                    result = new Uint8Array(raw);
                  }

                  _context5.next = 22;
                  break;

                case 11:
                  if (!(template.required && value === void 0)) {
                    _context5.next = 13;
                    break;
                  }

                  throw new Error("Error: Paramter '".concat(template.name, "' is required in '").concat(thisStatic.localName, "' protobuf message."));

                case 13:
                  if (!template.converter) {
                    _context5.next = 20;
                    break;
                  }

                  if (!value) {
                    _context5.next = 18;
                    break;
                  }

                  _context5.next = 17;
                  return template.converter.set(value);

                case 17:
                  result = _context5.sent;

                case 18:
                  _context5.next = 22;
                  break;

                case 20:
                  if (value instanceof ArrayBuffer) {
                    value = new Uint8Array(value);
                  }

                  result = value;

                case 22:
                  return _context5.abrupt("return", result);

                case 23:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function exportItem(_x4, _x5) {
          return _exportItem.apply(this, arguments);
        }

        return exportItem;
      }()
    }, {
      key: "importItem",
      value: function () {
        var _importItem = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(template, value) {
          var thisStatic, result, parser;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  thisStatic = this.constructor;

                  if (!template.parser) {
                    _context6.next = 13;
                    break;
                  }

                  parser = template.parser;

                  if (!(value && value.byteLength)) {
                    _context6.next = 9;
                    break;
                  }

                  _context6.next = 6;
                  return parser.importProto(new Uint8Array(value).buffer);

                case 6:
                  result = _context6.sent;
                  _context6.next = 11;
                  break;

                case 9:
                  if (!template.required) {
                    _context6.next = 11;
                    break;
                  }

                  throw new Error("Error: Parameter '".concat(template.name, "' is required in '").concat(thisStatic.localName, "' protobuf message."));

                case 11:
                  _context6.next = 25;
                  break;

                case 13:
                  if (!template.converter) {
                    _context6.next = 24;
                    break;
                  }

                  if (!(value && value.byteLength)) {
                    _context6.next = 20;
                    break;
                  }

                  _context6.next = 17;
                  return template.converter.get(value);

                case 17:
                  result = _context6.sent;
                  _context6.next = 22;
                  break;

                case 20:
                  if (!template.required) {
                    _context6.next = 22;
                    break;
                  }

                  throw new Error("Error: Parameter '".concat(template.name, "' is required in '").concat(thisStatic.localName, "' protobuf message."));

                case 22:
                  _context6.next = 25;
                  break;

                case 24:
                  result = value;

                case 25:
                  return _context6.abrupt("return", result);

                case 26:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));

        function importItem(_x6, _x7) {
          return _importItem.apply(this, arguments);
        }

        return importItem;
      }()
    }], [{
      key: "importProto",
      value: function () {
        var _importProto2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(data) {
          var res;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  res = new this();
                  _context7.next = 3;
                  return res.importProto(data);

                case 3:
                  return _context7.abrupt("return", res);

                case 4:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function importProto(_x8) {
          return _importProto2.apply(this, arguments);
        }

        return importProto;
      }()
    }]);

    return ObjectProto;
  }();

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

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self);
      }
    }
  }

  function emitOne(handler, isFn, self, arg1) {
    if (isFn) handler.call(self, arg1);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self, arg1);
      }
    }
  }

  function emitTwo(handler, isFn, self, arg1, arg2) {
    if (isFn) handler.call(self, arg1, arg2);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self, arg1, arg2);
      }
    }
  }

  function emitThree(handler, isFn, self, arg1, arg2, arg3) {
    if (isFn) handler.call(self, arg1, arg2, arg3);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self, arg1, arg2, arg3);
      }
    }
  }

  function emitMany(handler, isFn, self, args) {
    if (isFn) handler.apply(self, args);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].apply(self, args);
      }
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

        for (i = 1; i < len; i++) {
          args[i - 1] = arguments[i];
        }

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
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
      list[i] = list[k];
    }

    list.pop();
  }

  function arrayClone(arr, i) {
    var copy = new Array(i);

    while (i--) {
      copy[i] = arr[i];
    }

    return copy;
  }

  function unwrapListeners(arr) {
    var ret = new Array(arr.length);

    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }

    return ret;
  }

  var SIGN_ALGORITHM_NAME = "ECDSA";
  var DH_ALGORITHM_NAME = "ECDH";
  var SECRET_KEY_NAME = "AES-CBC";
  var HASH_NAME = "SHA-256";
  var HMAC_NAME = "HMAC";
  var MAX_RATCHET_STACK_SIZE = 20;
  var INFO_TEXT = Convert.FromBinary("InfoText");
  var INFO_RATCHET = Convert.FromBinary("InfoRatchet");
  var INFO_MESSAGE_KEYS = Convert.FromBinary("InfoMessageKeys");
  var engine = null;

  if (typeof self !== "undefined") {
    engine = {
      crypto: self.crypto,
      name: "WebCrypto"
    };
  }

  function setEngine(name, crypto) {
    engine = {
      crypto: crypto,
      name: name
    };
  }

  function getEngine() {
    if (!engine) {
      throw new Error("WebCrypto engine is empty. Use setEngine to resolve it.");
    }

    return engine;
  }

  var Curve = function () {
    var Curve = /*#__PURE__*/function () {
      function Curve() {
        _classCallCheck(this, Curve);
      }

      _createClass(Curve, null, [{
        key: "generateKeyPair",
        value: function () {
          var _generateKeyPair = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(type, extractable) {
            var name, usage, keys, publicKey, res;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    name = type;
                    usage = type === "ECDSA" ? ["sign", "verify"] : ["deriveKey", "deriveBits"];
                    _context8.next = 4;
                    return getEngine().crypto.subtle.generateKey({
                      name: name,
                      namedCurve: this.NAMED_CURVE
                    }, extractable, usage);

                  case 4:
                    keys = _context8.sent;
                    _context8.next = 7;
                    return ECPublicKey.create(keys.publicKey);

                  case 7:
                    publicKey = _context8.sent;
                    res = {
                      privateKey: keys.privateKey,
                      publicKey: publicKey
                    };
                    return _context8.abrupt("return", res);

                  case 10:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _callee8, this);
          }));

          function generateKeyPair(_x9, _x10) {
            return _generateKeyPair.apply(this, arguments);
          }

          return generateKeyPair;
        }()
      }, {
        key: "deriveBytes",
        value: function deriveBytes(privateKey, publicKey) {
          return getEngine().crypto.subtle.deriveBits({
            name: "ECDH",
            public: publicKey.key
          }, privateKey, 256);
        }
      }, {
        key: "verify",
        value: function verify(signingKey, message, signature) {
          return getEngine().crypto.subtle.verify({
            name: "ECDSA",
            hash: this.DIGEST_ALGORITHM
          }, signingKey.key, signature, message);
        }
      }, {
        key: "sign",
        value: function () {
          var _sign = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(signingKey, message) {
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    return _context9.abrupt("return", getEngine().crypto.subtle.sign({
                      name: "ECDSA",
                      hash: this.DIGEST_ALGORITHM
                    }, signingKey, message));

                  case 1:
                  case "end":
                    return _context9.stop();
                }
              }
            }, _callee9, this);
          }));

          function sign(_x11, _x12) {
            return _sign.apply(this, arguments);
          }

          return sign;
        }()
      }, {
        key: "ecKeyPairToJson",
        value: function () {
          var _ecKeyPairToJson = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(key) {
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    _context10.t0 = key.privateKey;
                    _context10.t1 = key.publicKey.key;
                    _context10.next = 4;
                    return key.publicKey.thumbprint();

                  case 4:
                    _context10.t2 = _context10.sent;
                    return _context10.abrupt("return", {
                      privateKey: _context10.t0,
                      publicKey: _context10.t1,
                      thumbprint: _context10.t2
                    });

                  case 6:
                  case "end":
                    return _context10.stop();
                }
              }
            }, _callee10);
          }));

          function ecKeyPairToJson(_x13) {
            return _ecKeyPairToJson.apply(this, arguments);
          }

          return ecKeyPairToJson;
        }()
      }, {
        key: "ecKeyPairFromJson",
        value: function () {
          var _ecKeyPairFromJson = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(keys) {
            return regeneratorRuntime.wrap(function _callee11$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    _context11.t0 = keys.privateKey;
                    _context11.next = 3;
                    return ECPublicKey.create(keys.publicKey);

                  case 3:
                    _context11.t1 = _context11.sent;
                    return _context11.abrupt("return", {
                      privateKey: _context11.t0,
                      publicKey: _context11.t1
                    });

                  case 5:
                  case "end":
                    return _context11.stop();
                }
              }
            }, _callee11);
          }));

          function ecKeyPairFromJson(_x14) {
            return _ecKeyPairFromJson.apply(this, arguments);
          }

          return ecKeyPairFromJson;
        }()
      }]);

      return Curve;
    }();

    Curve.NAMED_CURVE = "P-256";
    Curve.DIGEST_ALGORITHM = "SHA-512";
    return Curve;
  }();

  var AES_ALGORITHM = {
    name: "AES-CBC",
    length: 256
  };

  var Secret = /*#__PURE__*/function () {
    function Secret() {
      _classCallCheck(this, Secret);
    }

    _createClass(Secret, null, [{
      key: "randomBytes",
      value: function randomBytes(size) {
        var array = new Uint8Array(size);
        getEngine().crypto.getRandomValues(array);
        return array.buffer;
      }
    }, {
      key: "digest",
      value: function digest(alg, message) {
        return getEngine().crypto.subtle.digest(alg, message);
      }
    }, {
      key: "encrypt",
      value: function encrypt(key, data, iv) {
        return getEngine().crypto.subtle.encrypt({
          name: SECRET_KEY_NAME,
          iv: new Uint8Array(iv)
        }, key, data);
      }
    }, {
      key: "decrypt",
      value: function decrypt(key, data, iv) {
        return getEngine().crypto.subtle.decrypt({
          name: SECRET_KEY_NAME,
          iv: new Uint8Array(iv)
        }, key, data);
      }
    }, {
      key: "importHMAC",
      value: function importHMAC(raw) {
        return getEngine().crypto.subtle.importKey("raw", raw, {
          name: HMAC_NAME,
          hash: {
            name: HASH_NAME
          }
        }, false, ["sign", "verify"]);
      }
    }, {
      key: "importAES",
      value: function importAES(raw) {
        return getEngine().crypto.subtle.importKey("raw", raw, AES_ALGORITHM, false, ["encrypt", "decrypt"]);
      }
    }, {
      key: "sign",
      value: function () {
        var _sign2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(key, data) {
          return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  _context12.next = 2;
                  return getEngine().crypto.subtle.sign({
                    name: HMAC_NAME,
                    hash: HASH_NAME
                  }, key, data);

                case 2:
                  return _context12.abrupt("return", _context12.sent);

                case 3:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12);
        }));

        function sign(_x15, _x16) {
          return _sign2.apply(this, arguments);
        }

        return sign;
      }()
    }, {
      key: "HKDF",
      value: function () {
        var _HKDF = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(IKM) {
          var keysCount,
              salt,
              info,
              PRKBytes,
              infoBuffer,
              PRK,
              T,
              i,
              _args13 = arguments;
          return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
              switch (_context13.prev = _context13.next) {
                case 0:
                  keysCount = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : 1;
                  salt = _args13.length > 2 ? _args13[2] : undefined;
                  info = _args13.length > 3 && _args13[3] !== undefined ? _args13[3] : new ArrayBuffer(0);

                  if (salt) {
                    _context13.next = 7;
                    break;
                  }

                  _context13.next = 6;
                  return this.importHMAC(new Uint8Array(32).buffer);

                case 6:
                  salt = _context13.sent;

                case 7:
                  _context13.next = 9;
                  return this.sign(salt, IKM);

                case 9:
                  PRKBytes = _context13.sent;
                  infoBuffer = new ArrayBuffer(32 + info.byteLength + 1);
                  _context13.next = 13;
                  return this.importHMAC(PRKBytes);

                case 13:
                  PRK = _context13.sent;
                  T = [new ArrayBuffer(0)];
                  i = 0;

                case 16:
                  if (!(i < keysCount)) {
                    _context13.next = 23;
                    break;
                  }

                  _context13.next = 19;
                  return this.sign(PRK, combine(T[i], info, new Uint8Array([i + 1]).buffer));

                case 19:
                  T[i + 1] = _context13.sent;

                case 20:
                  i++;
                  _context13.next = 16;
                  break;

                case 23:
                  return _context13.abrupt("return", T.slice(1));

                case 24:
                case "end":
                  return _context13.stop();
              }
            }
          }, _callee13, this);
        }));

        function HKDF(_x17) {
          return _HKDF.apply(this, arguments);
        }

        return HKDF;
      }()
    }]);

    return Secret;
  }();

  var ECPublicKey = /*#__PURE__*/function () {
    function ECPublicKey() {
      _classCallCheck(this, ECPublicKey);
    }

    _createClass(ECPublicKey, [{
      key: "serialize",
      value: function serialize() {
        return this.serialized;
      }
    }, {
      key: "thumbprint",
      value: function () {
        var _thumbprint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
          var bytes, thumbprint;
          return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
              switch (_context14.prev = _context14.next) {
                case 0:
                  _context14.next = 2;
                  return this.serialize();

                case 2:
                  bytes = _context14.sent;
                  _context14.next = 5;
                  return Secret.digest("SHA-256", bytes);

                case 5:
                  thumbprint = _context14.sent;
                  return _context14.abrupt("return", Convert.ToHex(thumbprint));

                case 7:
                case "end":
                  return _context14.stop();
              }
            }
          }, _callee14, this);
        }));

        function thumbprint() {
          return _thumbprint.apply(this, arguments);
        }

        return thumbprint;
      }()
    }, {
      key: "isEqual",
      value: function () {
        var _isEqual2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(other) {
          return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
              switch (_context15.prev = _context15.next) {
                case 0:
                  if (other && other instanceof ECPublicKey) {
                    _context15.next = 2;
                    break;
                  }

                  return _context15.abrupt("return", false);

                case 2:
                  return _context15.abrupt("return", _isEqual(this.serialized, other.serialized));

                case 3:
                case "end":
                  return _context15.stop();
              }
            }
          }, _callee15, this);
        }));

        function isEqual(_x18) {
          return _isEqual2.apply(this, arguments);
        }

        return isEqual;
      }()
    }], [{
      key: "create",
      value: function () {
        var _create = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(publicKey) {
          var res, algName, jwk, x, y, xy;
          return regeneratorRuntime.wrap(function _callee16$(_context16) {
            while (1) {
              switch (_context16.prev = _context16.next) {
                case 0:
                  res = new this();
                  algName = publicKey.algorithm.name.toUpperCase();

                  if (algName === "ECDH" || algName === "ECDSA") {
                    _context16.next = 4;
                    break;
                  }

                  throw new Error("Error: Unsupported asymmetric key algorithm.");

                case 4:
                  if (!(publicKey.type !== "public")) {
                    _context16.next = 6;
                    break;
                  }

                  throw new Error("Error: Expected key type to be public but it was not.");

                case 6:
                  res.key = publicKey;
                  _context16.next = 9;
                  return getEngine().crypto.subtle.exportKey("jwk", publicKey);

                case 9:
                  jwk = _context16.sent;

                  if (jwk.x && jwk.y) {
                    _context16.next = 12;
                    break;
                  }

                  throw new Error("Wrong JWK data for EC public key. Parameters x and y are required.");

                case 12:
                  x = Convert.FromBase64Url(jwk.x);
                  y = Convert.FromBase64Url(jwk.y);
                  xy = Convert.ToBinary(x) + Convert.ToBinary(y);
                  res.serialized = Convert.FromBinary(xy);
                  _context16.next = 18;
                  return res.thumbprint();

                case 18:
                  res.id = _context16.sent;
                  return _context16.abrupt("return", res);

                case 20:
                case "end":
                  return _context16.stop();
              }
            }
          }, _callee16, this);
        }));

        function create(_x19) {
          return _create.apply(this, arguments);
        }

        return create;
      }()
    }, {
      key: "importKey",
      value: function () {
        var _importKey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(bytes, type) {
          var x, y, jwk, usage, key, res;
          return regeneratorRuntime.wrap(function _callee17$(_context17) {
            while (1) {
              switch (_context17.prev = _context17.next) {
                case 0:
                  x = Convert.ToBase64Url(bytes.slice(0, 32));
                  y = Convert.ToBase64Url(bytes.slice(32));
                  jwk = {
                    crv: Curve.NAMED_CURVE,
                    kty: "EC",
                    x: x,
                    y: y
                  };
                  usage = type === "ECDSA" ? ["verify"] : [];
                  _context17.next = 6;
                  return getEngine().crypto.subtle.importKey("jwk", jwk, {
                    name: type,
                    namedCurve: Curve.NAMED_CURVE
                  }, true, usage);

                case 6:
                  key = _context17.sent;
                  _context17.next = 9;
                  return ECPublicKey.create(key);

                case 9:
                  res = _context17.sent;
                  return _context17.abrupt("return", res);

                case 11:
                case "end":
                  return _context17.stop();
              }
            }
          }, _callee17);
        }));

        function importKey(_x20, _x21) {
          return _importKey.apply(this, arguments);
        }

        return importKey;
      }()
    }]);

    return ECPublicKey;
  }();

  var Identity = /*#__PURE__*/function () {
    function Identity(id, signingKey, exchangeKey) {
      _classCallCheck(this, Identity);

      this.id = id;
      this.signingKey = signingKey;
      this.exchangeKey = exchangeKey;
      this.preKeys = [];
      this.signedPreKeys = [];
    }

    _createClass(Identity, [{
      key: "toJSON",
      value: function () {
        var _toJSON = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
          var preKeys, signedPreKeys, _iterator4, _step4, key, _iterator5, _step5, _key3;

          return regeneratorRuntime.wrap(function _callee18$(_context18) {
            while (1) {
              switch (_context18.prev = _context18.next) {
                case 0:
                  preKeys = [];
                  signedPreKeys = [];
                  _iterator4 = _createForOfIteratorHelper(this.preKeys);
                  _context18.prev = 3;

                  _iterator4.s();

                case 5:
                  if ((_step4 = _iterator4.n()).done) {
                    _context18.next = 14;
                    break;
                  }

                  key = _step4.value;
                  _context18.t0 = preKeys;
                  _context18.next = 10;
                  return Curve.ecKeyPairToJson(key);

                case 10:
                  _context18.t1 = _context18.sent;

                  _context18.t0.push.call(_context18.t0, _context18.t1);

                case 12:
                  _context18.next = 5;
                  break;

                case 14:
                  _context18.next = 19;
                  break;

                case 16:
                  _context18.prev = 16;
                  _context18.t2 = _context18["catch"](3);

                  _iterator4.e(_context18.t2);

                case 19:
                  _context18.prev = 19;

                  _iterator4.f();

                  return _context18.finish(19);

                case 22:
                  _iterator5 = _createForOfIteratorHelper(this.signedPreKeys);
                  _context18.prev = 23;

                  _iterator5.s();

                case 25:
                  if ((_step5 = _iterator5.n()).done) {
                    _context18.next = 34;
                    break;
                  }

                  _key3 = _step5.value;
                  _context18.t3 = signedPreKeys;
                  _context18.next = 30;
                  return Curve.ecKeyPairToJson(_key3);

                case 30:
                  _context18.t4 = _context18.sent;

                  _context18.t3.push.call(_context18.t3, _context18.t4);

                case 32:
                  _context18.next = 25;
                  break;

                case 34:
                  _context18.next = 39;
                  break;

                case 36:
                  _context18.prev = 36;
                  _context18.t5 = _context18["catch"](23);

                  _iterator5.e(_context18.t5);

                case 39:
                  _context18.prev = 39;

                  _iterator5.f();

                  return _context18.finish(39);

                case 42:
                  _context18.t6 = this.createdAt.toISOString();
                  _context18.next = 45;
                  return Curve.ecKeyPairToJson(this.exchangeKey);

                case 45:
                  _context18.t7 = _context18.sent;
                  _context18.t8 = this.id;
                  _context18.t9 = preKeys;
                  _context18.t10 = signedPreKeys;
                  _context18.next = 51;
                  return Curve.ecKeyPairToJson(this.signingKey);

                case 51:
                  _context18.t11 = _context18.sent;
                  return _context18.abrupt("return", {
                    createdAt: _context18.t6,
                    exchangeKey: _context18.t7,
                    id: _context18.t8,
                    preKeys: _context18.t9,
                    signedPreKeys: _context18.t10,
                    signingKey: _context18.t11
                  });

                case 53:
                case "end":
                  return _context18.stop();
              }
            }
          }, _callee18, this, [[3, 16, 19, 22], [23, 36, 39, 42]]);
        }));

        function toJSON() {
          return _toJSON.apply(this, arguments);
        }

        return toJSON;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(obj) {
          var _iterator6, _step6, key, _iterator7, _step7, _key4;

          return regeneratorRuntime.wrap(function _callee19$(_context19) {
            while (1) {
              switch (_context19.prev = _context19.next) {
                case 0:
                  this.id = obj.id;
                  _context19.next = 3;
                  return Curve.ecKeyPairFromJson(obj.signingKey);

                case 3:
                  this.signingKey = _context19.sent;
                  _context19.next = 6;
                  return Curve.ecKeyPairFromJson(obj.exchangeKey);

                case 6:
                  this.exchangeKey = _context19.sent;
                  this.preKeys = [];
                  _iterator6 = _createForOfIteratorHelper(obj.preKeys);
                  _context19.prev = 9;

                  _iterator6.s();

                case 11:
                  if ((_step6 = _iterator6.n()).done) {
                    _context19.next = 20;
                    break;
                  }

                  key = _step6.value;
                  _context19.t0 = this.preKeys;
                  _context19.next = 16;
                  return Curve.ecKeyPairFromJson(key);

                case 16:
                  _context19.t1 = _context19.sent;

                  _context19.t0.push.call(_context19.t0, _context19.t1);

                case 18:
                  _context19.next = 11;
                  break;

                case 20:
                  _context19.next = 25;
                  break;

                case 22:
                  _context19.prev = 22;
                  _context19.t2 = _context19["catch"](9);

                  _iterator6.e(_context19.t2);

                case 25:
                  _context19.prev = 25;

                  _iterator6.f();

                  return _context19.finish(25);

                case 28:
                  this.signedPreKeys = [];
                  _iterator7 = _createForOfIteratorHelper(obj.signedPreKeys);
                  _context19.prev = 30;

                  _iterator7.s();

                case 32:
                  if ((_step7 = _iterator7.n()).done) {
                    _context19.next = 41;
                    break;
                  }

                  _key4 = _step7.value;
                  _context19.t3 = this.signedPreKeys;
                  _context19.next = 37;
                  return Curve.ecKeyPairFromJson(_key4);

                case 37:
                  _context19.t4 = _context19.sent;

                  _context19.t3.push.call(_context19.t3, _context19.t4);

                case 39:
                  _context19.next = 32;
                  break;

                case 41:
                  _context19.next = 46;
                  break;

                case 43:
                  _context19.prev = 43;
                  _context19.t5 = _context19["catch"](30);

                  _iterator7.e(_context19.t5);

                case 46:
                  _context19.prev = 46;

                  _iterator7.f();

                  return _context19.finish(46);

                case 49:
                case "end":
                  return _context19.stop();
              }
            }
          }, _callee19, this, [[9, 22, 25, 28], [30, 43, 46, 49]]);
        }));

        function fromJSON(_x22) {
          return _fromJSON.apply(this, arguments);
        }

        return fromJSON;
      }()
    }], [{
      key: "fromJSON",
      value: function () {
        var _fromJSON2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(obj) {
          var signingKey, exchangeKey, res;
          return regeneratorRuntime.wrap(function _callee20$(_context20) {
            while (1) {
              switch (_context20.prev = _context20.next) {
                case 0:
                  _context20.next = 2;
                  return Curve.ecKeyPairFromJson(obj.signingKey);

                case 2:
                  signingKey = _context20.sent;
                  _context20.next = 5;
                  return Curve.ecKeyPairFromJson(obj.exchangeKey);

                case 5:
                  exchangeKey = _context20.sent;
                  res = new this(obj.id, signingKey, exchangeKey);
                  res.createdAt = new Date(obj.createdAt);
                  _context20.next = 10;
                  return res.fromJSON(obj);

                case 10:
                  return _context20.abrupt("return", res);

                case 11:
                case "end":
                  return _context20.stop();
              }
            }
          }, _callee20, this);
        }));

        function fromJSON(_x23) {
          return _fromJSON2.apply(this, arguments);
        }

        return fromJSON;
      }()
    }, {
      key: "create",
      value: function () {
        var _create2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(id) {
          var signedPreKeyAmount,
              preKeyAmount,
              extractable,
              signingKey,
              exchangeKey,
              res,
              i,
              _i,
              _args21 = arguments;

          return regeneratorRuntime.wrap(function _callee21$(_context21) {
            while (1) {
              switch (_context21.prev = _context21.next) {
                case 0:
                  signedPreKeyAmount = _args21.length > 1 && _args21[1] !== undefined ? _args21[1] : 0;
                  preKeyAmount = _args21.length > 2 && _args21[2] !== undefined ? _args21[2] : 0;
                  extractable = _args21.length > 3 && _args21[3] !== undefined ? _args21[3] : false;
                  _context21.next = 5;
                  return Curve.generateKeyPair(SIGN_ALGORITHM_NAME, extractable);

                case 5:
                  signingKey = _context21.sent;
                  _context21.next = 8;
                  return Curve.generateKeyPair(DH_ALGORITHM_NAME, extractable);

                case 8:
                  exchangeKey = _context21.sent;
                  res = new Identity(id, signingKey, exchangeKey);
                  res.createdAt = new Date();
                  i = 0;

                case 12:
                  if (!(i < preKeyAmount)) {
                    _context21.next = 21;
                    break;
                  }

                  _context21.t0 = res.preKeys;
                  _context21.next = 16;
                  return Curve.generateKeyPair("ECDH", extractable);

                case 16:
                  _context21.t1 = _context21.sent;

                  _context21.t0.push.call(_context21.t0, _context21.t1);

                case 18:
                  i++;
                  _context21.next = 12;
                  break;

                case 21:
                  _i = 0;

                case 22:
                  if (!(_i < signedPreKeyAmount)) {
                    _context21.next = 31;
                    break;
                  }

                  _context21.t2 = res.signedPreKeys;
                  _context21.next = 26;
                  return Curve.generateKeyPair("ECDH", extractable);

                case 26:
                  _context21.t3 = _context21.sent;

                  _context21.t2.push.call(_context21.t2, _context21.t3);

                case 28:
                  _i++;
                  _context21.next = 22;
                  break;

                case 31:
                  return _context21.abrupt("return", res);

                case 32:
                case "end":
                  return _context21.stop();
              }
            }
          }, _callee21);
        }));

        function create(_x24) {
          return _create2.apply(this, arguments);
        }

        return create;
      }()
    }]);

    return Identity;
  }();

  var RemoteIdentity = /*#__PURE__*/function () {
    function RemoteIdentity() {
      _classCallCheck(this, RemoteIdentity);
    }

    _createClass(RemoteIdentity, [{
      key: "fill",
      value: function fill(protocol) {
        this.signingKey = protocol.signingKey;
        this.exchangeKey = protocol.exchangeKey;
        this.signature = protocol.signature;
        this.createdAt = protocol.createdAt;
      }
    }, {
      key: "verify",
      value: function verify() {
        return Curve.verify(this.signingKey, this.exchangeKey.serialize(), this.signature);
      }
    }, {
      key: "toJSON",
      value: function () {
        var _toJSON2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
          return regeneratorRuntime.wrap(function _callee22$(_context22) {
            while (1) {
              switch (_context22.prev = _context22.next) {
                case 0:
                  _context22.t0 = this.createdAt.toISOString();
                  _context22.next = 3;
                  return this.exchangeKey.key;

                case 3:
                  _context22.t1 = _context22.sent;
                  _context22.t2 = this.id;
                  _context22.t3 = this.signature;
                  _context22.next = 8;
                  return this.signingKey.key;

                case 8:
                  _context22.t4 = _context22.sent;
                  _context22.next = 11;
                  return this.signingKey.thumbprint();

                case 11:
                  _context22.t5 = _context22.sent;
                  return _context22.abrupt("return", {
                    createdAt: _context22.t0,
                    exchangeKey: _context22.t1,
                    id: _context22.t2,
                    signature: _context22.t3,
                    signingKey: _context22.t4,
                    thumbprint: _context22.t5
                  });

                case 13:
                case "end":
                  return _context22.stop();
              }
            }
          }, _callee22, this);
        }));

        function toJSON() {
          return _toJSON2.apply(this, arguments);
        }

        return toJSON;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(obj) {
          var ok;
          return regeneratorRuntime.wrap(function _callee23$(_context23) {
            while (1) {
              switch (_context23.prev = _context23.next) {
                case 0:
                  this.id = obj.id;
                  this.signature = obj.signature;
                  _context23.next = 4;
                  return ECPublicKey.create(obj.signingKey);

                case 4:
                  this.signingKey = _context23.sent;
                  _context23.next = 7;
                  return ECPublicKey.create(obj.exchangeKey);

                case 7:
                  this.exchangeKey = _context23.sent;
                  this.createdAt = new Date(obj.createdAt);
                  _context23.next = 11;
                  return this.verify();

                case 11:
                  ok = _context23.sent;

                  if (ok) {
                    _context23.next = 14;
                    break;
                  }

                  throw new Error("Error: Wrong signature for RemoteIdentity");

                case 14:
                case "end":
                  return _context23.stop();
              }
            }
          }, _callee23, this);
        }));

        function fromJSON(_x25) {
          return _fromJSON3.apply(this, arguments);
        }

        return fromJSON;
      }()
    }], [{
      key: "fill",
      value: function fill(protocol) {
        var res = new RemoteIdentity();
        res.fill(protocol);
        return res;
      }
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(obj) {
          var res;
          return regeneratorRuntime.wrap(function _callee24$(_context24) {
            while (1) {
              switch (_context24.prev = _context24.next) {
                case 0:
                  res = new this();
                  _context24.next = 3;
                  return res.fromJSON(obj);

                case 3:
                  return _context24.abrupt("return", res);

                case 4:
                case "end":
                  return _context24.stop();
              }
            }
          }, _callee24, this);
        }));

        function fromJSON(_x26) {
          return _fromJSON4.apply(this, arguments);
        }

        return fromJSON;
      }()
    }]);

    return RemoteIdentity;
  }();

  var BaseProtocol = function () {
    var BaseProtocol = /*#__PURE__*/function (_ObjectProto) {
      _inherits(BaseProtocol, _ObjectProto);

      var _super = _createSuper(BaseProtocol);

      function BaseProtocol() {
        _classCallCheck(this, BaseProtocol);

        return _super.apply(this, arguments);
      }

      return BaseProtocol;
    }(ObjectProto);

    __decorate([ProtobufProperty({
      id: 0,
      type: "uint32",
      defaultValue: 1
    })], BaseProtocol.prototype, "version", void 0);

    BaseProtocol = __decorate([ProtobufElement({
      name: "Base"
    })], BaseProtocol);
    return BaseProtocol;
  }();

  var ECDSAPublicKeyConverter = /*#__PURE__*/function () {
    function ECDSAPublicKeyConverter() {
      _classCallCheck(this, ECDSAPublicKeyConverter);
    }

    _createClass(ECDSAPublicKeyConverter, null, [{
      key: "set",
      value: function () {
        var _set2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(value) {
          return regeneratorRuntime.wrap(function _callee25$(_context25) {
            while (1) {
              switch (_context25.prev = _context25.next) {
                case 0:
                  return _context25.abrupt("return", new Uint8Array(value.serialize()));

                case 1:
                case "end":
                  return _context25.stop();
              }
            }
          }, _callee25);
        }));

        function set(_x27) {
          return _set2.apply(this, arguments);
        }

        return set;
      }()
    }, {
      key: "get",
      value: function () {
        var _get2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(value) {
          return regeneratorRuntime.wrap(function _callee26$(_context26) {
            while (1) {
              switch (_context26.prev = _context26.next) {
                case 0:
                  return _context26.abrupt("return", ECPublicKey.importKey(value.buffer, "ECDSA"));

                case 1:
                case "end":
                  return _context26.stop();
              }
            }
          }, _callee26);
        }));

        function get(_x28) {
          return _get2.apply(this, arguments);
        }

        return get;
      }()
    }]);

    return ECDSAPublicKeyConverter;
  }();

  var ECDHPublicKeyConverter = /*#__PURE__*/function () {
    function ECDHPublicKeyConverter() {
      _classCallCheck(this, ECDHPublicKeyConverter);
    }

    _createClass(ECDHPublicKeyConverter, null, [{
      key: "set",
      value: function () {
        var _set3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(value) {
          return regeneratorRuntime.wrap(function _callee27$(_context27) {
            while (1) {
              switch (_context27.prev = _context27.next) {
                case 0:
                  return _context27.abrupt("return", new Uint8Array(value.serialize()));

                case 1:
                case "end":
                  return _context27.stop();
              }
            }
          }, _callee27);
        }));

        function set(_x29) {
          return _set3.apply(this, arguments);
        }

        return set;
      }()
    }, {
      key: "get",
      value: function () {
        var _get3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(value) {
          return regeneratorRuntime.wrap(function _callee28$(_context28) {
            while (1) {
              switch (_context28.prev = _context28.next) {
                case 0:
                  return _context28.abrupt("return", ECPublicKey.importKey(value.buffer, "ECDH"));

                case 1:
                case "end":
                  return _context28.stop();
              }
            }
          }, _callee28);
        }));

        function get(_x30) {
          return _get3.apply(this, arguments);
        }

        return get;
      }()
    }]);

    return ECDHPublicKeyConverter;
  }();

  var DateConverter = /*#__PURE__*/function () {
    function DateConverter() {
      _classCallCheck(this, DateConverter);
    }

    _createClass(DateConverter, null, [{
      key: "set",
      value: function () {
        var _set4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29(value) {
          return regeneratorRuntime.wrap(function _callee29$(_context29) {
            while (1) {
              switch (_context29.prev = _context29.next) {
                case 0:
                  return _context29.abrupt("return", new Uint8Array(Convert.FromString(value.toISOString())));

                case 1:
                case "end":
                  return _context29.stop();
              }
            }
          }, _callee29);
        }));

        function set(_x31) {
          return _set4.apply(this, arguments);
        }

        return set;
      }()
    }, {
      key: "get",
      value: function () {
        var _get4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(value) {
          return regeneratorRuntime.wrap(function _callee30$(_context30) {
            while (1) {
              switch (_context30.prev = _context30.next) {
                case 0:
                  return _context30.abrupt("return", new Date(Convert.ToString(value)));

                case 1:
                case "end":
                  return _context30.stop();
              }
            }
          }, _callee30);
        }));

        function get(_x32) {
          return _get4.apply(this, arguments);
        }

        return get;
      }()
    }]);

    return DateConverter;
  }();

  var IdentityProtocol = function () {
    var IdentityProtocol_1;

    var IdentityProtocol = IdentityProtocol_1 = /*#__PURE__*/function (_BaseProtocol) {
      _inherits(IdentityProtocol, _BaseProtocol);

      var _super2 = _createSuper(IdentityProtocol);

      function IdentityProtocol() {
        _classCallCheck(this, IdentityProtocol);

        return _super2.apply(this, arguments);
      }

      _createClass(IdentityProtocol, [{
        key: "sign",
        value: function () {
          var _sign3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31(key) {
            return regeneratorRuntime.wrap(function _callee31$(_context31) {
              while (1) {
                switch (_context31.prev = _context31.next) {
                  case 0:
                    _context31.next = 2;
                    return Curve.sign(key, this.exchangeKey.serialize());

                  case 2:
                    this.signature = _context31.sent;

                  case 3:
                  case "end":
                    return _context31.stop();
                }
              }
            }, _callee31, this);
          }));

          function sign(_x33) {
            return _sign3.apply(this, arguments);
          }

          return sign;
        }()
      }, {
        key: "verify",
        value: function () {
          var _verify = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32() {
            return regeneratorRuntime.wrap(function _callee32$(_context32) {
              while (1) {
                switch (_context32.prev = _context32.next) {
                  case 0:
                    _context32.next = 2;
                    return Curve.verify(this.signingKey, this.exchangeKey.serialize(), this.signature);

                  case 2:
                    return _context32.abrupt("return", _context32.sent);

                  case 3:
                  case "end":
                    return _context32.stop();
                }
              }
            }, _callee32, this);
          }));

          function verify() {
            return _verify.apply(this, arguments);
          }

          return verify;
        }()
      }, {
        key: "fill",
        value: function () {
          var _fill = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33(identity) {
            return regeneratorRuntime.wrap(function _callee33$(_context33) {
              while (1) {
                switch (_context33.prev = _context33.next) {
                  case 0:
                    this.signingKey = identity.signingKey.publicKey;
                    this.exchangeKey = identity.exchangeKey.publicKey;
                    this.createdAt = identity.createdAt;
                    _context33.next = 5;
                    return this.sign(identity.signingKey.privateKey);

                  case 5:
                  case "end":
                    return _context33.stop();
                }
              }
            }, _callee33, this);
          }));

          function fill(_x34) {
            return _fill.apply(this, arguments);
          }

          return fill;
        }()
      }], [{
        key: "fill",
        value: function () {
          var _fill2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee34(identity) {
            var res;
            return regeneratorRuntime.wrap(function _callee34$(_context34) {
              while (1) {
                switch (_context34.prev = _context34.next) {
                  case 0:
                    res = new IdentityProtocol_1();
                    _context34.next = 3;
                    return res.fill(identity);

                  case 3:
                    return _context34.abrupt("return", res);

                  case 4:
                  case "end":
                    return _context34.stop();
                }
              }
            }, _callee34);
          }));

          function fill(_x35) {
            return _fill2.apply(this, arguments);
          }

          return fill;
        }()
      }]);

      return IdentityProtocol;
    }(BaseProtocol);

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
  }();

  var MessageProtocol = function () {
    var MessageProtocol = /*#__PURE__*/function (_BaseProtocol2) {
      _inherits(MessageProtocol, _BaseProtocol2);

      var _super3 = _createSuper(MessageProtocol);

      function MessageProtocol() {
        _classCallCheck(this, MessageProtocol);

        return _super3.apply(this, arguments);
      }

      return MessageProtocol;
    }(BaseProtocol);

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
  }();

  var MessageSignedProtocol = function () {
    var MessageSignedProtocol = /*#__PURE__*/function (_BaseProtocol3) {
      _inherits(MessageSignedProtocol, _BaseProtocol3);

      var _super4 = _createSuper(MessageSignedProtocol);

      function MessageSignedProtocol() {
        _classCallCheck(this, MessageSignedProtocol);

        return _super4.apply(this, arguments);
      }

      _createClass(MessageSignedProtocol, [{
        key: "sign",
        value: function () {
          var _sign4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee35(hmacKey) {
            return regeneratorRuntime.wrap(function _callee35$(_context35) {
              while (1) {
                switch (_context35.prev = _context35.next) {
                  case 0:
                    _context35.next = 2;
                    return this.signHMAC(hmacKey);

                  case 2:
                    this.signature = _context35.sent;

                  case 3:
                  case "end":
                    return _context35.stop();
                }
              }
            }, _callee35, this);
          }));

          function sign(_x36) {
            return _sign4.apply(this, arguments);
          }

          return sign;
        }()
      }, {
        key: "verify",
        value: function () {
          var _verify2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee36(hmacKey) {
            var signature;
            return regeneratorRuntime.wrap(function _callee36$(_context36) {
              while (1) {
                switch (_context36.prev = _context36.next) {
                  case 0:
                    _context36.next = 2;
                    return this.signHMAC(hmacKey);

                  case 2:
                    signature = _context36.sent;
                    return _context36.abrupt("return", _isEqual(signature, this.signature));

                  case 4:
                  case "end":
                    return _context36.stop();
                }
              }
            }, _callee36, this);
          }));

          function verify(_x37) {
            return _verify2.apply(this, arguments);
          }

          return verify;
        }()
      }, {
        key: "getSignedRaw",
        value: function () {
          var _getSignedRaw = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee37() {
            var receiverKey, senderKey, message, data;
            return regeneratorRuntime.wrap(function _callee37$(_context37) {
              while (1) {
                switch (_context37.prev = _context37.next) {
                  case 0:
                    receiverKey = this.receiverKey.serialize();
                    senderKey = this.senderKey.serialize();
                    _context37.next = 4;
                    return this.message.exportProto();

                  case 4:
                    message = _context37.sent;
                    data = combine(receiverKey, senderKey, message);
                    return _context37.abrupt("return", data);

                  case 7:
                  case "end":
                    return _context37.stop();
                }
              }
            }, _callee37, this);
          }));

          function getSignedRaw() {
            return _getSignedRaw.apply(this, arguments);
          }

          return getSignedRaw;
        }()
      }, {
        key: "signHMAC",
        value: function () {
          var _signHMAC = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee38(macKey) {
            var data, signature;
            return regeneratorRuntime.wrap(function _callee38$(_context38) {
              while (1) {
                switch (_context38.prev = _context38.next) {
                  case 0:
                    _context38.next = 2;
                    return this.getSignedRaw();

                  case 2:
                    data = _context38.sent;
                    _context38.next = 5;
                    return Secret.sign(macKey, data);

                  case 5:
                    signature = _context38.sent;
                    return _context38.abrupt("return", signature);

                  case 7:
                  case "end":
                    return _context38.stop();
                }
              }
            }, _callee38, this);
          }));

          function signHMAC(_x38) {
            return _signHMAC.apply(this, arguments);
          }

          return signHMAC;
        }()
      }]);

      return MessageSignedProtocol;
    }(BaseProtocol);

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
  }();

  var PreKeyMessageProtocol = function () {
    var PreKeyMessageProtocol = /*#__PURE__*/function (_BaseProtocol4) {
      _inherits(PreKeyMessageProtocol, _BaseProtocol4);

      var _super5 = _createSuper(PreKeyMessageProtocol);

      function PreKeyMessageProtocol() {
        _classCallCheck(this, PreKeyMessageProtocol);

        return _super5.apply(this, arguments);
      }

      return PreKeyMessageProtocol;
    }(BaseProtocol);

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
  }();

  var PreKeyProtocol = function () {
    var PreKeyProtocol = /*#__PURE__*/function (_BaseProtocol5) {
      _inherits(PreKeyProtocol, _BaseProtocol5);

      var _super6 = _createSuper(PreKeyProtocol);

      function PreKeyProtocol() {
        _classCallCheck(this, PreKeyProtocol);

        return _super6.apply(this, arguments);
      }

      return PreKeyProtocol;
    }(BaseProtocol);

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
  }();

  var PreKeySignedProtocol = function () {
    var PreKeySignedProtocol = /*#__PURE__*/function (_PreKeyProtocol) {
      _inherits(PreKeySignedProtocol, _PreKeyProtocol);

      var _super7 = _createSuper(PreKeySignedProtocol);

      function PreKeySignedProtocol() {
        _classCallCheck(this, PreKeySignedProtocol);

        return _super7.apply(this, arguments);
      }

      _createClass(PreKeySignedProtocol, [{
        key: "sign",
        value: function () {
          var _sign5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee39(key) {
            return regeneratorRuntime.wrap(function _callee39$(_context39) {
              while (1) {
                switch (_context39.prev = _context39.next) {
                  case 0:
                    _context39.next = 2;
                    return Curve.sign(key, this.key.serialize());

                  case 2:
                    this.signature = _context39.sent;

                  case 3:
                  case "end":
                    return _context39.stop();
                }
              }
            }, _callee39, this);
          }));

          function sign(_x39) {
            return _sign5.apply(this, arguments);
          }

          return sign;
        }()
      }, {
        key: "verify",
        value: function verify(key) {
          return Curve.verify(key, this.key.serialize(), this.signature);
        }
      }]);

      return PreKeySignedProtocol;
    }(PreKeyProtocol);

    __decorate([ProtobufProperty({
      id: 3,
      converter: ArrayBufferConverter,
      required: true
    })], PreKeySignedProtocol.prototype, "signature", void 0);

    PreKeySignedProtocol = __decorate([ProtobufElement({
      name: "PreKeySigned"
    })], PreKeySignedProtocol);
    return PreKeySignedProtocol;
  }();

  var PreKeyBundleProtocol = function () {
    var PreKeyBundleProtocol = /*#__PURE__*/function (_BaseProtocol6) {
      _inherits(PreKeyBundleProtocol, _BaseProtocol6);

      var _super8 = _createSuper(PreKeyBundleProtocol);

      function PreKeyBundleProtocol() {
        _classCallCheck(this, PreKeyBundleProtocol);

        return _super8.apply(this, arguments);
      }

      return PreKeyBundleProtocol;
    }(BaseProtocol);

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
  }();

  var Stack = /*#__PURE__*/function () {
    function Stack() {
      var maxSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;

      _classCallCheck(this, Stack);

      this.items = [];
      this.maxSize = maxSize;
    }

    _createClass(Stack, [{
      key: "push",
      value: function push(item) {
        if (this.length === this.maxSize) {
          this.items = this.items.slice(1);
        }

        this.items.push(item);
      }
    }, {
      key: "toJSON",
      value: function () {
        var _toJSON3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee40() {
          var res, _iterator8, _step8, item;

          return regeneratorRuntime.wrap(function _callee40$(_context40) {
            while (1) {
              switch (_context40.prev = _context40.next) {
                case 0:
                  res = [];
                  _iterator8 = _createForOfIteratorHelper(this.items);
                  _context40.prev = 2;

                  _iterator8.s();

                case 4:
                  if ((_step8 = _iterator8.n()).done) {
                    _context40.next = 13;
                    break;
                  }

                  item = _step8.value;
                  _context40.t0 = res;
                  _context40.next = 9;
                  return item.toJSON();

                case 9:
                  _context40.t1 = _context40.sent;

                  _context40.t0.push.call(_context40.t0, _context40.t1);

                case 11:
                  _context40.next = 4;
                  break;

                case 13:
                  _context40.next = 18;
                  break;

                case 15:
                  _context40.prev = 15;
                  _context40.t2 = _context40["catch"](2);

                  _iterator8.e(_context40.t2);

                case 18:
                  _context40.prev = 18;

                  _iterator8.f();

                  return _context40.finish(18);

                case 21:
                  return _context40.abrupt("return", res);

                case 22:
                case "end":
                  return _context40.stop();
              }
            }
          }, _callee40, this, [[2, 15, 18, 21]]);
        }));

        function toJSON() {
          return _toJSON3.apply(this, arguments);
        }

        return toJSON;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee41(obj) {
          return regeneratorRuntime.wrap(function _callee41$(_context41) {
            while (1) {
              switch (_context41.prev = _context41.next) {
                case 0:
                  this.items = obj;

                case 1:
                case "end":
                  return _context41.stop();
              }
            }
          }, _callee41, this);
        }));

        function fromJSON(_x40) {
          return _fromJSON5.apply(this, arguments);
        }

        return fromJSON;
      }()
    }, {
      key: "length",
      get: function get() {
        return this.items.length;
      }
    }, {
      key: "latest",
      get: function get() {
        return this.items[this.length - 1];
      }
    }]);

    return Stack;
  }();

  var CIPHER_KEY_KDF_INPUT = new Uint8Array([1]).buffer;
  var ROOT_KEY_KDF_INPUT = new Uint8Array([2]).buffer;

  var SymmetricRatchet = /*#__PURE__*/function () {
    function SymmetricRatchet(rootKey) {
      _classCallCheck(this, SymmetricRatchet);

      this.counter = 0;
      this.rootKey = rootKey;
    }

    _createClass(SymmetricRatchet, [{
      key: "toJSON",
      value: function () {
        var _toJSON4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee42() {
          return regeneratorRuntime.wrap(function _callee42$(_context42) {
            while (1) {
              switch (_context42.prev = _context42.next) {
                case 0:
                  return _context42.abrupt("return", {
                    counter: this.counter,
                    rootKey: this.rootKey
                  });

                case 1:
                case "end":
                  return _context42.stop();
              }
            }
          }, _callee42, this);
        }));

        function toJSON() {
          return _toJSON4.apply(this, arguments);
        }

        return toJSON;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee43(obj) {
          return regeneratorRuntime.wrap(function _callee43$(_context43) {
            while (1) {
              switch (_context43.prev = _context43.next) {
                case 0:
                  this.counter = obj.counter;
                  this.rootKey = obj.rootKey;

                case 2:
                case "end":
                  return _context43.stop();
              }
            }
          }, _callee43, this);
        }));

        function fromJSON(_x41) {
          return _fromJSON6.apply(this, arguments);
        }

        return fromJSON;
      }()
    }, {
      key: "calculateKey",
      value: function () {
        var _calculateKey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee44(rootKey) {
          var cipherKeyBytes, nextRootKeyBytes, res;
          return regeneratorRuntime.wrap(function _callee44$(_context44) {
            while (1) {
              switch (_context44.prev = _context44.next) {
                case 0:
                  _context44.next = 2;
                  return Secret.sign(rootKey, CIPHER_KEY_KDF_INPUT);

                case 2:
                  cipherKeyBytes = _context44.sent;
                  _context44.next = 5;
                  return Secret.sign(rootKey, ROOT_KEY_KDF_INPUT);

                case 5:
                  nextRootKeyBytes = _context44.sent;
                  _context44.t0 = cipherKeyBytes;
                  _context44.next = 9;
                  return Secret.importHMAC(nextRootKeyBytes);

                case 9:
                  _context44.t1 = _context44.sent;
                  res = {
                    cipher: _context44.t0,
                    rootKey: _context44.t1
                  };
                  return _context44.abrupt("return", res);

                case 12:
                case "end":
                  return _context44.stop();
              }
            }
          }, _callee44);
        }));

        function calculateKey(_x42) {
          return _calculateKey.apply(this, arguments);
        }

        return calculateKey;
      }()
    }, {
      key: "click",
      value: function () {
        var _click = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee45() {
          var rootKey, res;
          return regeneratorRuntime.wrap(function _callee45$(_context45) {
            while (1) {
              switch (_context45.prev = _context45.next) {
                case 0:
                  rootKey = this.rootKey;
                  _context45.next = 3;
                  return this.calculateKey(rootKey);

                case 3:
                  res = _context45.sent;
                  this.rootKey = res.rootKey;
                  this.counter++;
                  return _context45.abrupt("return", res.cipher);

                case 7:
                case "end":
                  return _context45.stop();
              }
            }
          }, _callee45, this);
        }));

        function click() {
          return _click.apply(this, arguments);
        }

        return click;
      }()
    }], [{
      key: "fromJSON",
      value: function () {
        var _fromJSON7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee46(obj) {
          var res;
          return regeneratorRuntime.wrap(function _callee46$(_context46) {
            while (1) {
              switch (_context46.prev = _context46.next) {
                case 0:
                  res = new this(obj.rootKey);
                  res.fromJSON(obj);
                  return _context46.abrupt("return", res);

                case 3:
                case "end":
                  return _context46.stop();
              }
            }
          }, _callee46, this);
        }));

        function fromJSON(_x43) {
          return _fromJSON7.apply(this, arguments);
        }

        return fromJSON;
      }()
    }]);

    return SymmetricRatchet;
  }();

  var SendingRatchet = /*#__PURE__*/function (_SymmetricRatchet) {
    _inherits(SendingRatchet, _SymmetricRatchet);

    var _super9 = _createSuper(SendingRatchet);

    function SendingRatchet() {
      _classCallCheck(this, SendingRatchet);

      return _super9.apply(this, arguments);
    }

    _createClass(SendingRatchet, [{
      key: "encrypt",
      value: function () {
        var _encrypt = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee47(message) {
          var cipherKey, keys, aesKey, hmacKey, iv, cipherText;
          return regeneratorRuntime.wrap(function _callee47$(_context47) {
            while (1) {
              switch (_context47.prev = _context47.next) {
                case 0:
                  _context47.next = 2;
                  return this.click();

                case 2:
                  cipherKey = _context47.sent;
                  _context47.next = 5;
                  return Secret.HKDF(cipherKey, 3, void 0, INFO_MESSAGE_KEYS);

                case 5:
                  keys = _context47.sent;
                  _context47.next = 8;
                  return Secret.importAES(keys[0]);

                case 8:
                  aesKey = _context47.sent;
                  _context47.next = 11;
                  return Secret.importHMAC(keys[1]);

                case 11:
                  hmacKey = _context47.sent;
                  iv = keys[2].slice(0, 16);
                  _context47.next = 15;
                  return Secret.encrypt(aesKey, message, iv);

                case 15:
                  cipherText = _context47.sent;
                  return _context47.abrupt("return", {
                    cipherText: cipherText,
                    hmacKey: hmacKey
                  });

                case 17:
                case "end":
                  return _context47.stop();
              }
            }
          }, _callee47, this);
        }));

        function encrypt(_x44) {
          return _encrypt.apply(this, arguments);
        }

        return encrypt;
      }()
    }]);

    return SendingRatchet;
  }(SymmetricRatchet);

  var ReceivingRatchet = /*#__PURE__*/function (_SymmetricRatchet2) {
    _inherits(ReceivingRatchet, _SymmetricRatchet2);

    var _super10 = _createSuper(ReceivingRatchet);

    function ReceivingRatchet() {
      var _this;

      _classCallCheck(this, ReceivingRatchet);

      _this = _super10.apply(this, arguments);
      _this.keys = [];
      return _this;
    }

    _createClass(ReceivingRatchet, [{
      key: "toJSON",
      value: function () {
        var _toJSON5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee48() {
          var res;
          return regeneratorRuntime.wrap(function _callee48$(_context48) {
            while (1) {
              switch (_context48.prev = _context48.next) {
                case 0:
                  _context48.next = 2;
                  return _get(_getPrototypeOf(ReceivingRatchet.prototype), "toJSON", this).call(this);

                case 2:
                  res = _context48.sent;
                  res.keys = this.keys;
                  return _context48.abrupt("return", res);

                case 5:
                case "end":
                  return _context48.stop();
              }
            }
          }, _callee48, this);
        }));

        function toJSON() {
          return _toJSON5.apply(this, arguments);
        }

        return toJSON;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee49(obj) {
          return regeneratorRuntime.wrap(function _callee49$(_context49) {
            while (1) {
              switch (_context49.prev = _context49.next) {
                case 0:
                  _context49.next = 2;
                  return _get(_getPrototypeOf(ReceivingRatchet.prototype), "fromJSON", this).call(this, obj);

                case 2:
                  this.keys = obj.keys;

                case 3:
                case "end":
                  return _context49.stop();
              }
            }
          }, _callee49, this);
        }));

        function fromJSON(_x45) {
          return _fromJSON8.apply(this, arguments);
        }

        return fromJSON;
      }()
    }, {
      key: "decrypt",
      value: function () {
        var _decrypt = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee50(message, counter) {
          var cipherKey, keys, aesKey, hmacKey, iv, cipherText;
          return regeneratorRuntime.wrap(function _callee50$(_context50) {
            while (1) {
              switch (_context50.prev = _context50.next) {
                case 0:
                  _context50.next = 2;
                  return this.getKey(counter);

                case 2:
                  cipherKey = _context50.sent;
                  _context50.next = 5;
                  return Secret.HKDF(cipherKey, 3, void 0, INFO_MESSAGE_KEYS);

                case 5:
                  keys = _context50.sent;
                  _context50.next = 8;
                  return Secret.importAES(keys[0]);

                case 8:
                  aesKey = _context50.sent;
                  _context50.next = 11;
                  return Secret.importHMAC(keys[1]);

                case 11:
                  hmacKey = _context50.sent;
                  iv = keys[2].slice(0, 16);
                  _context50.next = 15;
                  return Secret.decrypt(aesKey, message, iv);

                case 15:
                  cipherText = _context50.sent;
                  return _context50.abrupt("return", {
                    cipherText: cipherText,
                    hmacKey: hmacKey
                  });

                case 17:
                case "end":
                  return _context50.stop();
              }
            }
          }, _callee50, this);
        }));

        function decrypt(_x46, _x47) {
          return _decrypt.apply(this, arguments);
        }

        return decrypt;
      }()
    }, {
      key: "getKey",
      value: function () {
        var _getKey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee51(counter) {
          var cipherKey, key;
          return regeneratorRuntime.wrap(function _callee51$(_context51) {
            while (1) {
              switch (_context51.prev = _context51.next) {
                case 0:
                  if (!(this.counter <= counter)) {
                    _context51.next = 7;
                    break;
                  }

                  _context51.next = 3;
                  return this.click();

                case 3:
                  cipherKey = _context51.sent;
                  this.keys.push(cipherKey);
                  _context51.next = 0;
                  break;

                case 7:
                  key = this.keys[counter];
                  return _context51.abrupt("return", key);

                case 9:
                case "end":
                  return _context51.stop();
              }
            }
          }, _callee51, this);
        }));

        function getKey(_x48) {
          return _getKey.apply(this, arguments);
        }

        return getKey;
      }()
    }]);

    return ReceivingRatchet;
  }(SymmetricRatchet);

  function authenticateA(_x49, _x50, _x51, _x52, _x53) {
    return _authenticateA.apply(this, arguments);
  }

  function _authenticateA() {
    _authenticateA = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee135(IKa, EKa, IKb, SPKb, OPKb) {
      var DH1, DH2, DH3, DH4, _F, i, F, KM, keys;

      return regeneratorRuntime.wrap(function _callee135$(_context135) {
        while (1) {
          switch (_context135.prev = _context135.next) {
            case 0:
              _context135.next = 2;
              return Curve.deriveBytes(IKa.exchangeKey.privateKey, SPKb);

            case 2:
              DH1 = _context135.sent;
              _context135.next = 5;
              return Curve.deriveBytes(EKa.privateKey, IKb);

            case 5:
              DH2 = _context135.sent;
              _context135.next = 8;
              return Curve.deriveBytes(EKa.privateKey, SPKb);

            case 8:
              DH3 = _context135.sent;
              DH4 = new ArrayBuffer(0);

              if (!OPKb) {
                _context135.next = 14;
                break;
              }

              _context135.next = 13;
              return Curve.deriveBytes(EKa.privateKey, OPKb);

            case 13:
              DH4 = _context135.sent;

            case 14:
              _F = new Uint8Array(32);

              for (i = 0; i < _F.length; i++) {
                _F[i] = 0xff;
              }

              F = _F.buffer;
              KM = combine(F, DH1, DH2, DH3, DH4);
              _context135.next = 20;
              return Secret.HKDF(KM, 1, void 0, INFO_TEXT);

            case 20:
              keys = _context135.sent;
              _context135.next = 23;
              return Secret.importHMAC(keys[0]);

            case 23:
              return _context135.abrupt("return", _context135.sent);

            case 24:
            case "end":
              return _context135.stop();
          }
        }
      }, _callee135);
    }));
    return _authenticateA.apply(this, arguments);
  }

  function authenticateB(_x54, _x55, _x56, _x57, _x58) {
    return _authenticateB.apply(this, arguments);
  }

  function _authenticateB() {
    _authenticateB = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee136(IKb, SPKb, IKa, EKa, OPKb) {
      var DH1, DH2, DH3, DH4, _F, i, F, KM, keys;

      return regeneratorRuntime.wrap(function _callee136$(_context136) {
        while (1) {
          switch (_context136.prev = _context136.next) {
            case 0:
              _context136.next = 2;
              return Curve.deriveBytes(SPKb.privateKey, IKa);

            case 2:
              DH1 = _context136.sent;
              _context136.next = 5;
              return Curve.deriveBytes(IKb.exchangeKey.privateKey, EKa);

            case 5:
              DH2 = _context136.sent;
              _context136.next = 8;
              return Curve.deriveBytes(SPKb.privateKey, EKa);

            case 8:
              DH3 = _context136.sent;
              DH4 = new ArrayBuffer(0);

              if (!OPKb) {
                _context136.next = 14;
                break;
              }

              _context136.next = 13;
              return Curve.deriveBytes(OPKb, EKa);

            case 13:
              DH4 = _context136.sent;

            case 14:
              _F = new Uint8Array(32);

              for (i = 0; i < _F.length; i++) {
                _F[i] = 0xff;
              }

              F = _F.buffer;
              KM = combine(F, DH1, DH2, DH3, DH4);
              _context136.next = 20;
              return Secret.HKDF(KM, 1, void 0, INFO_TEXT);

            case 20:
              keys = _context136.sent;
              _context136.next = 23;
              return Secret.importHMAC(keys[0]);

            case 23:
              return _context136.abrupt("return", _context136.sent);

            case 24:
            case "end":
              return _context136.stop();
          }
        }
      }, _callee136);
    }));
    return _authenticateB.apply(this, arguments);
  }

  var AsymmetricRatchet = /*#__PURE__*/function (_EventEmitter) {
    _inherits(AsymmetricRatchet, _EventEmitter);

    var _super11 = _createSuper(AsymmetricRatchet);

    function AsymmetricRatchet() {
      var _this2;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, AsymmetricRatchet);

      _this2 = _super11.call(this);
      _this2.options = options;
      _this2.counter = 0;
      _this2.currentStep = new DHRatchetStep();
      _this2.steps = new DHRatchetStepStack(MAX_RATCHET_STACK_SIZE);
      _this2.promises = {};
      return _this2;
    }

    _createClass(AsymmetricRatchet, [{
      key: "on",
      value: function on(event, listener) {
        return _get(_getPrototypeOf(AsymmetricRatchet.prototype), "on", this).call(this, event, listener);
      }
    }, {
      key: "once",
      value: function once(event, listener) {
        return _get(_getPrototypeOf(AsymmetricRatchet.prototype), "once", this).call(this, event, listener);
      }
    }, {
      key: "decrypt",
      value: function () {
        var _decrypt2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee53(protocol) {
          var _this3 = this;

          return regeneratorRuntime.wrap(function _callee53$(_context53) {
            while (1) {
              switch (_context53.prev = _context53.next) {
                case 0:
                  return _context53.abrupt("return", this.queuePromise("encrypt", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee52() {
                    var remoteRatchetKey, message, step, ratchetStep, decryptedMessage;
                    return regeneratorRuntime.wrap(function _callee52$(_context52) {
                      while (1) {
                        switch (_context52.prev = _context52.next) {
                          case 0:
                            remoteRatchetKey = protocol.message.senderRatchetKey;
                            message = protocol.message;

                            if (!(protocol.message.previousCounter < _this3.counter - MAX_RATCHET_STACK_SIZE)) {
                              _context52.next = 4;
                              break;
                            }

                            throw new Error("Error: Too old message");

                          case 4:
                            step = _this3.steps.getStep(remoteRatchetKey);

                            if (!step) {
                              ratchetStep = new DHRatchetStep();
                              ratchetStep.remoteRatchetKey = remoteRatchetKey;

                              _this3.steps.push(ratchetStep);

                              _this3.currentStep = ratchetStep;
                              step = ratchetStep;
                            }

                            if (step.receivingChain) {
                              _context52.next = 10;
                              break;
                            }

                            _context52.next = 9;
                            return _this3.createChain(_this3.currentRatchetKey.privateKey, remoteRatchetKey, ReceivingRatchet);

                          case 9:
                            step.receivingChain = _context52.sent;

                          case 10:
                            _context52.next = 12;
                            return step.receivingChain.decrypt(message.cipherText, message.counter);

                          case 12:
                            decryptedMessage = _context52.sent;

                            _this3.update();

                            protocol.senderKey = _this3.remoteIdentity.signingKey;
                            protocol.receiverKey = _this3.identity.signingKey.publicKey;
                            _context52.next = 18;
                            return protocol.verify(decryptedMessage.hmacKey);

                          case 18:
                            if (_context52.sent) {
                              _context52.next = 20;
                              break;
                            }

                            throw new Error("Error: The Message did not successfully verify!");

                          case 20:
                            return _context52.abrupt("return", decryptedMessage.cipherText);

                          case 21:
                          case "end":
                            return _context52.stop();
                        }
                      }
                    }, _callee52);
                  }))));

                case 1:
                case "end":
                  return _context53.stop();
              }
            }
          }, _callee53, this);
        }));

        function decrypt(_x59) {
          return _decrypt2.apply(this, arguments);
        }

        return decrypt;
      }()
    }, {
      key: "encrypt",
      value: function () {
        var _encrypt2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee55(message) {
          var _this4 = this;

          return regeneratorRuntime.wrap(function _callee55$(_context55) {
            while (1) {
              switch (_context55.prev = _context55.next) {
                case 0:
                  return _context55.abrupt("return", this.queuePromise("encrypt", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee54() {
                    var encryptedMessage, preKeyMessage, signedMessage;
                    return regeneratorRuntime.wrap(function _callee54$(_context54) {
                      while (1) {
                        switch (_context54.prev = _context54.next) {
                          case 0:
                            if (!(_this4.currentStep.receivingChain && !_this4.currentStep.sendingChain)) {
                              _context54.next = 5;
                              break;
                            }

                            _this4.counter++;
                            _context54.next = 4;
                            return _this4.generateRatchetKey();

                          case 4:
                            _this4.currentRatchetKey = _context54.sent;

                          case 5:
                            if (_this4.currentStep.sendingChain) {
                              _context54.next = 11;
                              break;
                            }

                            if (_this4.currentStep.remoteRatchetKey) {
                              _context54.next = 8;
                              break;
                            }

                            throw new Error("currentStep has empty remoteRatchetKey");

                          case 8:
                            _context54.next = 10;
                            return _this4.createChain(_this4.currentRatchetKey.privateKey, _this4.currentStep.remoteRatchetKey, SendingRatchet);

                          case 10:
                            _this4.currentStep.sendingChain = _context54.sent;

                          case 11:
                            _context54.next = 13;
                            return _this4.currentStep.sendingChain.encrypt(message);

                          case 13:
                            encryptedMessage = _context54.sent;

                            _this4.update();

                            if (!(_this4.steps.length === 0 && !_this4.currentStep.receivingChain && _this4.currentStep.sendingChain.counter === 1)) {
                              _context54.next = 23;
                              break;
                            }

                            preKeyMessage = new PreKeyMessageProtocol();
                            preKeyMessage.registrationId = _this4.identity.id;
                            preKeyMessage.preKeyId = _this4.remotePreKeyId;
                            preKeyMessage.preKeySignedId = _this4.remotePreKeySignedId;
                            preKeyMessage.baseKey = _this4.currentRatchetKey.publicKey;
                            _context54.next = 23;
                            return preKeyMessage.identity.fill(_this4.identity);

                          case 23:
                            signedMessage = new MessageSignedProtocol();
                            signedMessage.receiverKey = _this4.remoteIdentity.signingKey;
                            signedMessage.senderKey = _this4.identity.signingKey.publicKey;
                            signedMessage.message.cipherText = encryptedMessage.cipherText;
                            signedMessage.message.counter = _this4.currentStep.sendingChain.counter - 1;
                            signedMessage.message.previousCounter = _this4.counter;
                            signedMessage.message.senderRatchetKey = _this4.currentRatchetKey.publicKey;
                            _context54.next = 32;
                            return signedMessage.sign(encryptedMessage.hmacKey);

                          case 32:
                            if (!preKeyMessage) {
                              _context54.next = 37;
                              break;
                            }

                            preKeyMessage.signedMessage = signedMessage;
                            return _context54.abrupt("return", preKeyMessage);

                          case 37:
                            return _context54.abrupt("return", signedMessage);

                          case 38:
                          case "end":
                            return _context54.stop();
                        }
                      }
                    }, _callee54);
                  }))));

                case 1:
                case "end":
                  return _context55.stop();
              }
            }
          }, _callee55, this);
        }));

        function encrypt(_x60) {
          return _encrypt2.apply(this, arguments);
        }

        return encrypt;
      }()
    }, {
      key: "hasRatchetKey",
      value: function () {
        var _hasRatchetKey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee56(key) {
          var ecKey, _iterator9, _step9, item;

          return regeneratorRuntime.wrap(function _callee56$(_context56) {
            while (1) {
              switch (_context56.prev = _context56.next) {
                case 0:
                  if (key instanceof ECPublicKey) {
                    _context56.next = 6;
                    break;
                  }

                  _context56.next = 3;
                  return ECPublicKey.create(key);

                case 3:
                  ecKey = _context56.sent;
                  _context56.next = 7;
                  break;

                case 6:
                  ecKey = key;

                case 7:
                  _iterator9 = _createForOfIteratorHelper(this.steps.items);
                  _context56.prev = 8;

                  _iterator9.s();

                case 10:
                  if ((_step9 = _iterator9.n()).done) {
                    _context56.next = 18;
                    break;
                  }

                  item = _step9.value;
                  _context56.next = 14;
                  return item.remoteRatchetKey.isEqual(ecKey);

                case 14:
                  if (!_context56.sent) {
                    _context56.next = 16;
                    break;
                  }

                  return _context56.abrupt("return", true);

                case 16:
                  _context56.next = 10;
                  break;

                case 18:
                  _context56.next = 23;
                  break;

                case 20:
                  _context56.prev = 20;
                  _context56.t0 = _context56["catch"](8);

                  _iterator9.e(_context56.t0);

                case 23:
                  _context56.prev = 23;

                  _iterator9.f();

                  return _context56.finish(23);

                case 26:
                  return _context56.abrupt("return", false);

                case 27:
                case "end":
                  return _context56.stop();
              }
            }
          }, _callee56, this, [[8, 20, 23, 26]]);
        }));

        function hasRatchetKey(_x61) {
          return _hasRatchetKey.apply(this, arguments);
        }

        return hasRatchetKey;
      }()
    }, {
      key: "toJSON",
      value: function () {
        var _toJSON6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee57() {
          return regeneratorRuntime.wrap(function _callee57$(_context57) {
            while (1) {
              switch (_context57.prev = _context57.next) {
                case 0:
                  _context57.t0 = this.counter;
                  _context57.next = 3;
                  return Curve.ecKeyPairToJson(this.currentRatchetKey);

                case 3:
                  _context57.t1 = _context57.sent;
                  _context57.next = 6;
                  return this.remoteIdentity.signingKey.thumbprint();

                case 6:
                  _context57.t2 = _context57.sent;
                  _context57.t3 = this.rootKey;
                  _context57.next = 10;
                  return this.steps.toJSON();

                case 10:
                  _context57.t4 = _context57.sent;
                  return _context57.abrupt("return", {
                    counter: _context57.t0,
                    ratchetKey: _context57.t1,
                    remoteIdentity: _context57.t2,
                    rootKey: _context57.t3,
                    steps: _context57.t4
                  });

                case 12:
                case "end":
                  return _context57.stop();
              }
            }
          }, _callee57, this);
        }));

        function toJSON() {
          return _toJSON6.apply(this, arguments);
        }

        return toJSON;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee58(obj) {
          var _iterator10, _step10, step;

          return regeneratorRuntime.wrap(function _callee58$(_context58) {
            while (1) {
              switch (_context58.prev = _context58.next) {
                case 0:
                  _context58.next = 2;
                  return Curve.ecKeyPairFromJson(obj.ratchetKey);

                case 2:
                  this.currentRatchetKey = _context58.sent;
                  this.counter = obj.counter;
                  this.rootKey = obj.rootKey;
                  _iterator10 = _createForOfIteratorHelper(obj.steps);
                  _context58.prev = 6;

                  _iterator10.s();

                case 8:
                  if ((_step10 = _iterator10.n()).done) {
                    _context58.next = 16;
                    break;
                  }

                  step = _step10.value;
                  _context58.next = 12;
                  return DHRatchetStep.fromJSON(step);

                case 12:
                  this.currentStep = _context58.sent;
                  this.steps.push(this.currentStep);

                case 14:
                  _context58.next = 8;
                  break;

                case 16:
                  _context58.next = 21;
                  break;

                case 18:
                  _context58.prev = 18;
                  _context58.t0 = _context58["catch"](6);

                  _iterator10.e(_context58.t0);

                case 21:
                  _context58.prev = 21;

                  _iterator10.f();

                  return _context58.finish(21);

                case 24:
                case "end":
                  return _context58.stop();
              }
            }
          }, _callee58, this, [[6, 18, 21, 24]]);
        }));

        function fromJSON(_x62) {
          return _fromJSON9.apply(this, arguments);
        }

        return fromJSON;
      }()
    }, {
      key: "update",
      value: function update() {
        this.emit("update");
      }
    }, {
      key: "generateRatchetKey",
      value: function generateRatchetKey() {
        return Curve.generateKeyPair("ECDH", !!this.options.exportableKeys);
      }
    }, {
      key: "createChain",
      value: function () {
        var _createChain = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee59(ourRatchetKey, theirRatchetKey, ratchetClass) {
          var derivedBytes, keys, rootKey, chainKey, chain;
          return regeneratorRuntime.wrap(function _callee59$(_context59) {
            while (1) {
              switch (_context59.prev = _context59.next) {
                case 0:
                  _context59.next = 2;
                  return Curve.deriveBytes(ourRatchetKey, theirRatchetKey);

                case 2:
                  derivedBytes = _context59.sent;
                  _context59.next = 5;
                  return Secret.HKDF(derivedBytes, 2, this.rootKey, INFO_RATCHET);

                case 5:
                  keys = _context59.sent;
                  _context59.next = 8;
                  return Secret.importHMAC(keys[0]);

                case 8:
                  rootKey = _context59.sent;
                  _context59.next = 11;
                  return Secret.importHMAC(keys[1]);

                case 11:
                  chainKey = _context59.sent;
                  chain = new ratchetClass(chainKey);
                  this.rootKey = rootKey;
                  return _context59.abrupt("return", chain);

                case 15:
                case "end":
                  return _context59.stop();
              }
            }
          }, _callee59, this);
        }));

        function createChain(_x63, _x64, _x65) {
          return _createChain.apply(this, arguments);
        }

        return createChain;
      }()
    }, {
      key: "queuePromise",
      value: function queuePromise(key, fn) {
        var _this5 = this;

        var prev = this.promises[key] || Promise.resolve();
        var cur = this.promises[key] = prev.then(fn, fn);
        cur.then(function () {
          if (_this5.promises[key] === cur) {
            delete _this5.promises[key];
          }
        });
        return cur;
      }
    }], [{
      key: "create",
      value: function () {
        var _create3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee60(identity, protocol) {
          var options,
              rootKey,
              ratchet,
              signedPreKey,
              preKey,
              _args60 = arguments;
          return regeneratorRuntime.wrap(function _callee60$(_context60) {
            while (1) {
              switch (_context60.prev = _context60.next) {
                case 0:
                  options = _args60.length > 2 && _args60[2] !== undefined ? _args60[2] : {};
                  ratchet = new AsymmetricRatchet(options);

                  if (!(protocol instanceof PreKeyBundleProtocol)) {
                    _context60.next = 24;
                    break;
                  }

                  _context60.next = 5;
                  return protocol.identity.verify();

                case 5:
                  if (_context60.sent) {
                    _context60.next = 7;
                    break;
                  }

                  throw new Error("Error: Remote client's identity key is invalid.");

                case 7:
                  _context60.next = 9;
                  return protocol.preKeySigned.verify(protocol.identity.signingKey);

                case 9:
                  if (_context60.sent) {
                    _context60.next = 11;
                    break;
                  }

                  throw new Error("Error: Remote client's signed prekey is invalid.");

                case 11:
                  _context60.next = 13;
                  return ratchet.generateRatchetKey();

                case 13:
                  ratchet.currentRatchetKey = _context60.sent;
                  ratchet.currentStep.remoteRatchetKey = protocol.preKeySigned.key;
                  ratchet.remoteIdentity = RemoteIdentity.fill(protocol.identity);
                  ratchet.remoteIdentity.id = protocol.registrationId;
                  ratchet.remotePreKeyId = protocol.preKey.id;
                  ratchet.remotePreKeySignedId = protocol.preKeySigned.id;
                  _context60.next = 21;
                  return authenticateA(identity, ratchet.currentRatchetKey, protocol.identity.exchangeKey, protocol.preKeySigned.key, protocol.preKey.key);

                case 21:
                  rootKey = _context60.sent;
                  _context60.next = 37;
                  break;

                case 24:
                  _context60.next = 26;
                  return protocol.identity.verify();

                case 26:
                  if (_context60.sent) {
                    _context60.next = 28;
                    break;
                  }

                  throw new Error("Error: Remote client's identity key is invalid.");

                case 28:
                  signedPreKey = identity.signedPreKeys[protocol.preKeySignedId];

                  if (signedPreKey) {
                    _context60.next = 31;
                    break;
                  }

                  throw new Error("Error: PreKey with id ".concat(protocol.preKeySignedId, " not found"));

                case 31:
                  if (protocol.preKeyId !== void 0) {
                    preKey = identity.preKeys[protocol.preKeyId];
                  }

                  ratchet.remoteIdentity = RemoteIdentity.fill(protocol.identity);
                  ratchet.currentRatchetKey = signedPreKey;
                  _context60.next = 36;
                  return authenticateB(identity, ratchet.currentRatchetKey, protocol.identity.exchangeKey, protocol.signedMessage.message.senderRatchetKey, preKey && preKey.privateKey);

                case 36:
                  rootKey = _context60.sent;

                case 37:
                  ratchet.identity = identity;
                  ratchet.id = identity.id;
                  ratchet.rootKey = rootKey;
                  return _context60.abrupt("return", ratchet);

                case 41:
                case "end":
                  return _context60.stop();
              }
            }
          }, _callee60);
        }));

        function create(_x66, _x67) {
          return _create3.apply(this, arguments);
        }

        return create;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee61(identity, remote, obj) {
          var res;
          return regeneratorRuntime.wrap(function _callee61$(_context61) {
            while (1) {
              switch (_context61.prev = _context61.next) {
                case 0:
                  res = new AsymmetricRatchet();
                  res.identity = identity;
                  res.remoteIdentity = remote;
                  _context61.next = 5;
                  return res.fromJSON(obj);

                case 5:
                  return _context61.abrupt("return", res);

                case 6:
                case "end":
                  return _context61.stop();
              }
            }
          }, _callee61);
        }));

        function fromJSON(_x68, _x69, _x70) {
          return _fromJSON10.apply(this, arguments);
        }

        return fromJSON;
      }()
    }]);

    return AsymmetricRatchet;
  }(EventEmitter);

  var DHRatchetStep = /*#__PURE__*/function () {
    function DHRatchetStep() {
      _classCallCheck(this, DHRatchetStep);
    }

    _createClass(DHRatchetStep, [{
      key: "toJSON",
      value: function () {
        var _toJSON7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee62() {
          var res;
          return regeneratorRuntime.wrap(function _callee62$(_context62) {
            while (1) {
              switch (_context62.prev = _context62.next) {
                case 0:
                  res = {};

                  if (this.remoteRatchetKey) {
                    res.remoteRatchetKey = this.remoteRatchetKey.key;
                  }

                  if (!this.sendingChain) {
                    _context62.next = 6;
                    break;
                  }

                  _context62.next = 5;
                  return this.sendingChain.toJSON();

                case 5:
                  res.sendingChain = _context62.sent;

                case 6:
                  if (!this.receivingChain) {
                    _context62.next = 10;
                    break;
                  }

                  _context62.next = 9;
                  return this.receivingChain.toJSON();

                case 9:
                  res.receivingChain = _context62.sent;

                case 10:
                  return _context62.abrupt("return", res);

                case 11:
                case "end":
                  return _context62.stop();
              }
            }
          }, _callee62, this);
        }));

        function toJSON() {
          return _toJSON7.apply(this, arguments);
        }

        return toJSON;
      }()
    }, {
      key: "fromJSON",
      value: function () {
        var _fromJSON11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee63(obj) {
          return regeneratorRuntime.wrap(function _callee63$(_context63) {
            while (1) {
              switch (_context63.prev = _context63.next) {
                case 0:
                  if (!obj.remoteRatchetKey) {
                    _context63.next = 4;
                    break;
                  }

                  _context63.next = 3;
                  return ECPublicKey.create(obj.remoteRatchetKey);

                case 3:
                  this.remoteRatchetKey = _context63.sent;

                case 4:
                  if (!obj.sendingChain) {
                    _context63.next = 8;
                    break;
                  }

                  _context63.next = 7;
                  return SendingRatchet.fromJSON(obj.sendingChain);

                case 7:
                  this.sendingChain = _context63.sent;

                case 8:
                  if (!obj.receivingChain) {
                    _context63.next = 12;
                    break;
                  }

                  _context63.next = 11;
                  return ReceivingRatchet.fromJSON(obj.receivingChain);

                case 11:
                  this.receivingChain = _context63.sent;

                case 12:
                case "end":
                  return _context63.stop();
              }
            }
          }, _callee63, this);
        }));

        function fromJSON(_x71) {
          return _fromJSON11.apply(this, arguments);
        }

        return fromJSON;
      }()
    }], [{
      key: "fromJSON",
      value: function () {
        var _fromJSON12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee64(obj) {
          var res;
          return regeneratorRuntime.wrap(function _callee64$(_context64) {
            while (1) {
              switch (_context64.prev = _context64.next) {
                case 0:
                  res = new this();
                  _context64.next = 3;
                  return res.fromJSON(obj);

                case 3:
                  return _context64.abrupt("return", res);

                case 4:
                case "end":
                  return _context64.stop();
              }
            }
          }, _callee64, this);
        }));

        function fromJSON(_x72) {
          return _fromJSON12.apply(this, arguments);
        }

        return fromJSON;
      }()
    }]);

    return DHRatchetStep;
  }();

  var DHRatchetStepStack = /*#__PURE__*/function (_Stack) {
    _inherits(DHRatchetStepStack, _Stack);

    var _super12 = _createSuper(DHRatchetStepStack);

    function DHRatchetStepStack() {
      _classCallCheck(this, DHRatchetStepStack);

      return _super12.apply(this, arguments);
    }

    _createClass(DHRatchetStepStack, [{
      key: "getStep",
      value: function getStep(remoteRatchetKey) {
        var found;
        this.items.some(function (step) {
          if (step.remoteRatchetKey.id === remoteRatchetKey.id) {
            found = step;
          }

          return !!found;
        });
        return found;
      }
    }]);

    return DHRatchetStepStack;
  }(Stack);
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
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  var DateConverter$1 = /*#__PURE__*/function () {
    function DateConverter$1() {
      _classCallCheck(this, DateConverter$1);
    }

    _createClass(DateConverter$1, null, [{
      key: "set",
      value: function () {
        var _set5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee65(value) {
          return regeneratorRuntime.wrap(function _callee65$(_context65) {
            while (1) {
              switch (_context65.prev = _context65.next) {
                case 0:
                  return _context65.abrupt("return", new Uint8Array(Convert.FromUtf8String(value.toISOString())));

                case 1:
                case "end":
                  return _context65.stop();
              }
            }
          }, _callee65);
        }));

        function set(_x73) {
          return _set5.apply(this, arguments);
        }

        return set;
      }()
    }, {
      key: "get",
      value: function () {
        var _get6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee66(value) {
          return regeneratorRuntime.wrap(function _callee66$(_context66) {
            while (1) {
              switch (_context66.prev = _context66.next) {
                case 0:
                  return _context66.abrupt("return", new Date(Convert.ToUtf8String(value)));

                case 1:
                case "end":
                  return _context66.stop();
              }
            }
          }, _callee66);
        }));

        function get(_x74) {
          return _get6.apply(this, arguments);
        }

        return get;
      }()
    }]);

    return DateConverter$1;
  }();

  var HexStringConverter = /*#__PURE__*/function () {
    function HexStringConverter() {
      _classCallCheck(this, HexStringConverter);
    }

    _createClass(HexStringConverter, null, [{
      key: "set",
      value: function () {
        var _set6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee67(value) {
          return regeneratorRuntime.wrap(function _callee67$(_context67) {
            while (1) {
              switch (_context67.prev = _context67.next) {
                case 0:
                  return _context67.abrupt("return", new Uint8Array(Convert.FromHex(value)));

                case 1:
                case "end":
                  return _context67.stop();
              }
            }
          }, _callee67);
        }));

        function set(_x75) {
          return _set6.apply(this, arguments);
        }

        return set;
      }()
    }, {
      key: "get",
      value: function () {
        var _get7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee68(value) {
          return regeneratorRuntime.wrap(function _callee68$(_context68) {
            while (1) {
              switch (_context68.prev = _context68.next) {
                case 0:
                  return _context68.abrupt("return", Convert.ToHex(value));

                case 1:
                case "end":
                  return _context68.stop();
              }
            }
          }, _callee68);
        }));

        function get(_x76) {
          return _get7.apply(this, arguments);
        }

        return get;
      }()
    }]);

    return HexStringConverter;
  }();

  var BaseProto = function () {
    var BaseProto_1;

    var BaseProto = BaseProto_1 = /*#__PURE__*/function (_ObjectProto2) {
      _inherits(BaseProto, _ObjectProto2);

      var _super13 = _createSuper(BaseProto);

      function BaseProto() {
        _classCallCheck(this, BaseProto);

        return _super13.apply(this, arguments);
      }

      return BaseProto;
    }(ObjectProto);

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
  }();

  var ActionProto = function () {
    var ActionProto_1;

    var ActionProto = ActionProto_1 = /*#__PURE__*/function (_BaseProto) {
      _inherits(ActionProto, _BaseProto);

      var _super14 = _createSuper(ActionProto);

      function ActionProto() {
        var _this6;

        _classCallCheck(this, ActionProto);

        _this6 = _super14.call(this);
        _this6.action = _this6.constructor.ACTION;
        return _this6;
      }

      return ActionProto;
    }(BaseProto);

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
  }();

  var BaseAlgorithmProto = function () {
    var BaseAlgorithmProto_1;

    var BaseAlgorithmProto = BaseAlgorithmProto_1 = /*#__PURE__*/function (_BaseProto2) {
      _inherits(BaseAlgorithmProto, _BaseProto2);

      var _super15 = _createSuper(BaseAlgorithmProto);

      function BaseAlgorithmProto() {
        _classCallCheck(this, BaseAlgorithmProto);

        return _super15.apply(this, arguments);
      }

      _createClass(BaseAlgorithmProto, [{
        key: "toAlgorithm",
        value: function toAlgorithm() {
          return {
            name: this.name
          };
        }
      }, {
        key: "fromAlgorithm",
        value: function fromAlgorithm(alg) {
          this.name = alg.name;
        }
      }]);

      return BaseAlgorithmProto;
    }(BaseProto);

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
  }();

  var AlgorithmProto = function () {
    var AlgorithmProto_1;

    var AlgorithmProto = AlgorithmProto_1 = /*#__PURE__*/function (_BaseAlgorithmProto) {
      _inherits(AlgorithmProto, _BaseAlgorithmProto);

      var _super16 = _createSuper(AlgorithmProto);

      function AlgorithmProto() {
        _classCallCheck(this, AlgorithmProto);

        return _super16.apply(this, arguments);
      }

      _createClass(AlgorithmProto, [{
        key: "toAlgorithm",
        value: function toAlgorithm() {
          var res = {};
          var thisStatic = this.constructor;

          for (var key in thisStatic.items) {
            if (key === "version") {
              continue;
            }

            var value = this[key];

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
      }, {
        key: "fromAlgorithm",
        value: function fromAlgorithm(alg) {
          if (alg instanceof AlgorithmProto_1) {
            alg = alg.toAlgorithm();
          }

          var thisStatic = this.constructor;

          for (var key in alg) {
            if (!thisStatic.items) {
              continue;
            }

            if (key in thisStatic.items) {
              var item = thisStatic.items[key];

              if (item.parser) {
                switch (item.parser) {
                  case BaseAlgorithmProto:
                    {
                      this[key].fromAlgorithm(alg[key]);
                      break;
                    }

                  default:
                    throw new Error("Unsupported parser '".concat(item.parser.name, "'"));
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
      }]);

      return AlgorithmProto;
    }(BaseAlgorithmProto);

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
  }();

  var CryptoItemProto = function () {
    var CryptoItemProto_1;

    var CryptoItemProto = CryptoItemProto_1 = /*#__PURE__*/function (_BaseProto3) {
      _inherits(CryptoItemProto, _BaseProto3);

      var _super17 = _createSuper(CryptoItemProto);

      function CryptoItemProto() {
        _classCallCheck(this, CryptoItemProto);

        return _super17.apply(this, arguments);
      }

      return CryptoItemProto;
    }(BaseProto);

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
  }();

  var CryptoKeyProto = function () {
    var CryptoKeyProto_1;

    var CryptoKeyProto = CryptoKeyProto_1 = /*#__PURE__*/function (_CryptoItemProto) {
      _inherits(CryptoKeyProto, _CryptoItemProto);

      var _super18 = _createSuper(CryptoKeyProto);

      function CryptoKeyProto() {
        _classCallCheck(this, CryptoKeyProto);

        return _super18.apply(this, arguments);
      }

      return CryptoKeyProto;
    }(CryptoItemProto);

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
  }();

  var CryptoKeyPairProto = function () {
    var CryptoKeyPairProto_1;

    var CryptoKeyPairProto = CryptoKeyPairProto_1 = /*#__PURE__*/function (_BaseProto4) {
      _inherits(CryptoKeyPairProto, _BaseProto4);

      var _super19 = _createSuper(CryptoKeyPairProto);

      function CryptoKeyPairProto() {
        _classCallCheck(this, CryptoKeyPairProto);

        return _super19.apply(this, arguments);
      }

      return CryptoKeyPairProto;
    }(BaseProto);

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
  }();

  var ErrorProto = function () {
    var ErrorProto_1;

    var ErrorProto = ErrorProto_1 = /*#__PURE__*/function (_BaseProto5) {
      _inherits(ErrorProto, _BaseProto5);

      var _super20 = _createSuper(ErrorProto);

      function ErrorProto(message) {
        var _this7;

        var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "error";

        _classCallCheck(this, ErrorProto);

        _this7 = _super20.call(this);

        if (message) {
          _this7.message = message;
          _this7.code = code;
          _this7.type = type;
        }

        return _this7;
      }

      return ErrorProto;
    }(BaseProto);

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
  }();

  var ResultProto = function () {
    var ResultProto_1;

    var ResultProto = ResultProto_1 = /*#__PURE__*/function (_ActionProto) {
      _inherits(ResultProto, _ActionProto);

      var _super21 = _createSuper(ResultProto);

      function ResultProto(proto) {
        var _this8;

        _classCallCheck(this, ResultProto);

        _this8 = _super21.call(this);

        if (proto) {
          _this8.actionId = proto.actionId;
          _this8.action = proto.action;
        }

        return _this8;
      }

      return ResultProto;
    }(ActionProto);

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
  }();

  var AuthRequestProto = function () {
    var AuthRequestProto = /*#__PURE__*/function (_ActionProto2) {
      _inherits(AuthRequestProto, _ActionProto2);

      var _super22 = _createSuper(AuthRequestProto);

      function AuthRequestProto() {
        _classCallCheck(this, AuthRequestProto);

        return _super22.apply(this, arguments);
      }

      return AuthRequestProto;
    }(ActionProto);

    AuthRequestProto.INDEX = ActionProto.INDEX;
    AuthRequestProto.ACTION = "auth";
    AuthRequestProto = __decorate$1([ProtobufElement({
      name: "AuthRequest"
    })], AuthRequestProto);
    return AuthRequestProto;
  }();

  var ServerLoginActionProto = function () {
    var ServerLoginActionProto = /*#__PURE__*/function (_ActionProto3) {
      _inherits(ServerLoginActionProto, _ActionProto3);

      var _super23 = _createSuper(ServerLoginActionProto);

      function ServerLoginActionProto() {
        _classCallCheck(this, ServerLoginActionProto);

        return _super23.apply(this, arguments);
      }

      return ServerLoginActionProto;
    }(ActionProto);

    ServerLoginActionProto.INDEX = ActionProto.INDEX;
    ServerLoginActionProto.ACTION = "server/login";
    ServerLoginActionProto = __decorate$1([ProtobufElement({})], ServerLoginActionProto);
    return ServerLoginActionProto;
  }();

  var ServerIsLoggedInActionProto = function () {
    var ServerIsLoggedInActionProto = /*#__PURE__*/function (_ActionProto4) {
      _inherits(ServerIsLoggedInActionProto, _ActionProto4);

      var _super24 = _createSuper(ServerIsLoggedInActionProto);

      function ServerIsLoggedInActionProto() {
        _classCallCheck(this, ServerIsLoggedInActionProto);

        return _super24.apply(this, arguments);
      }

      return ServerIsLoggedInActionProto;
    }(ActionProto);

    ServerIsLoggedInActionProto.INDEX = ActionProto.INDEX;
    ServerIsLoggedInActionProto.ACTION = "server/isLoggedIn";
    ServerIsLoggedInActionProto = __decorate$1([ProtobufElement({})], ServerIsLoggedInActionProto);
    return ServerIsLoggedInActionProto;
  }();

  var CardReaderActionProto = function () {
    var CardReaderActionProto = /*#__PURE__*/function (_ActionProto5) {
      _inherits(CardReaderActionProto, _ActionProto5);

      var _super25 = _createSuper(CardReaderActionProto);

      function CardReaderActionProto() {
        _classCallCheck(this, CardReaderActionProto);

        return _super25.apply(this, arguments);
      }

      return CardReaderActionProto;
    }(ActionProto);

    CardReaderActionProto.INDEX = ActionProto.INDEX;
    CardReaderActionProto.ACTION = "cardReader";
    CardReaderActionProto = __decorate$1([ProtobufElement({})], CardReaderActionProto);
    return CardReaderActionProto;
  }();

  var CardReaderGetReadersActionProto = function () {
    var CardReaderGetReadersActionProto = /*#__PURE__*/function (_ActionProto6) {
      _inherits(CardReaderGetReadersActionProto, _ActionProto6);

      var _super26 = _createSuper(CardReaderGetReadersActionProto);

      function CardReaderGetReadersActionProto() {
        _classCallCheck(this, CardReaderGetReadersActionProto);

        return _super26.apply(this, arguments);
      }

      return CardReaderGetReadersActionProto;
    }(ActionProto);

    CardReaderGetReadersActionProto.INDEX = ActionProto.INDEX;
    CardReaderGetReadersActionProto.ACTION = "cardReader/readers";
    CardReaderGetReadersActionProto = __decorate$1([ProtobufElement({})], CardReaderGetReadersActionProto);
    return CardReaderGetReadersActionProto;
  }();

  var CardReaderEventProto = function () {
    var CardReaderEventProto_1;

    var CardReaderEventProto = CardReaderEventProto_1 = /*#__PURE__*/function (_CardReaderActionProt) {
      _inherits(CardReaderEventProto, _CardReaderActionProt);

      var _super27 = _createSuper(CardReaderEventProto);

      function CardReaderEventProto(reader, atr) {
        var _this9;

        _classCallCheck(this, CardReaderEventProto);

        _this9 = _super27.call(this);

        if (reader && atr) {
          _this9.reader = reader;
          _this9.atr = atr;
        }

        return _this9;
      }

      return CardReaderEventProto;
    }(CardReaderActionProto);

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
  }();

  var CardReaderInsertEventProto = function () {
    var CardReaderInsertEventProto = /*#__PURE__*/function (_CardReaderEventProto) {
      _inherits(CardReaderInsertEventProto, _CardReaderEventProto);

      var _super28 = _createSuper(CardReaderInsertEventProto);

      function CardReaderInsertEventProto() {
        _classCallCheck(this, CardReaderInsertEventProto);

        return _super28.apply(this, arguments);
      }

      return CardReaderInsertEventProto;
    }(CardReaderEventProto);

    CardReaderInsertEventProto.INDEX = CardReaderEventProto.INDEX;
    CardReaderInsertEventProto.ACTION = CardReaderEventProto.ACTION + "/insert";
    CardReaderInsertEventProto = __decorate$1([ProtobufElement({})], CardReaderInsertEventProto);
    return CardReaderInsertEventProto;
  }();

  var CardReaderRemoveEventProto = function () {
    var CardReaderRemoveEventProto = /*#__PURE__*/function (_CardReaderEventProto2) {
      _inherits(CardReaderRemoveEventProto, _CardReaderEventProto2);

      var _super29 = _createSuper(CardReaderRemoveEventProto);

      function CardReaderRemoveEventProto() {
        _classCallCheck(this, CardReaderRemoveEventProto);

        return _super29.apply(this, arguments);
      }

      return CardReaderRemoveEventProto;
    }(CardReaderEventProto);

    CardReaderRemoveEventProto.INDEX = CardReaderEventProto.INDEX;
    CardReaderRemoveEventProto.ACTION = CardReaderEventProto.ACTION + "/remove";
    CardReaderRemoveEventProto = __decorate$1([ProtobufElement({})], CardReaderRemoveEventProto);
    return CardReaderRemoveEventProto;
  }();

  var CryptoActionProto = function () {
    var CryptoActionProto_1;

    var CryptoActionProto = CryptoActionProto_1 = /*#__PURE__*/function (_ActionProto7) {
      _inherits(CryptoActionProto, _ActionProto7);

      var _super30 = _createSuper(CryptoActionProto);

      function CryptoActionProto() {
        _classCallCheck(this, CryptoActionProto);

        return _super30.apply(this, arguments);
      }

      return CryptoActionProto;
    }(ActionProto);

    CryptoActionProto.INDEX = ActionProto.INDEX;
    CryptoActionProto.ACTION = "crypto";

    __decorate$1([ProtobufProperty({
      id: CryptoActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], CryptoActionProto.prototype, "providerID", void 0);

    CryptoActionProto = CryptoActionProto_1 = __decorate$1([ProtobufElement({})], CryptoActionProto);
    return CryptoActionProto;
  }();

  var LoginActionProto = function () {
    var LoginActionProto = /*#__PURE__*/function (_CryptoActionProto) {
      _inherits(LoginActionProto, _CryptoActionProto);

      var _super31 = _createSuper(LoginActionProto);

      function LoginActionProto() {
        _classCallCheck(this, LoginActionProto);

        return _super31.apply(this, arguments);
      }

      return LoginActionProto;
    }(CryptoActionProto);

    LoginActionProto.INDEX = CryptoActionProto.INDEX;
    LoginActionProto.ACTION = "crypto/login";
    LoginActionProto = __decorate$1([ProtobufElement({})], LoginActionProto);
    return LoginActionProto;
  }();

  var LogoutActionProto = function () {
    var LogoutActionProto = /*#__PURE__*/function (_CryptoActionProto2) {
      _inherits(LogoutActionProto, _CryptoActionProto2);

      var _super32 = _createSuper(LogoutActionProto);

      function LogoutActionProto() {
        _classCallCheck(this, LogoutActionProto);

        return _super32.apply(this, arguments);
      }

      return LogoutActionProto;
    }(CryptoActionProto);

    LogoutActionProto.INDEX = CryptoActionProto.INDEX;
    LogoutActionProto.ACTION = "crypto/logout";
    LogoutActionProto = __decorate$1([ProtobufElement({})], LogoutActionProto);
    return LogoutActionProto;
  }();

  var IsLoggedInActionProto = function () {
    var IsLoggedInActionProto = /*#__PURE__*/function (_CryptoActionProto3) {
      _inherits(IsLoggedInActionProto, _CryptoActionProto3);

      var _super33 = _createSuper(IsLoggedInActionProto);

      function IsLoggedInActionProto() {
        _classCallCheck(this, IsLoggedInActionProto);

        return _super33.apply(this, arguments);
      }

      return IsLoggedInActionProto;
    }(CryptoActionProto);

    IsLoggedInActionProto.INDEX = CryptoActionProto.INDEX;
    IsLoggedInActionProto.ACTION = "crypto/isLoggedIn";
    IsLoggedInActionProto = __decorate$1([ProtobufElement({})], IsLoggedInActionProto);
    return IsLoggedInActionProto;
  }();

  var ResetActionProto = function () {
    var ResetActionProto = /*#__PURE__*/function (_CryptoActionProto4) {
      _inherits(ResetActionProto, _CryptoActionProto4);

      var _super34 = _createSuper(ResetActionProto);

      function ResetActionProto() {
        _classCallCheck(this, ResetActionProto);

        return _super34.apply(this, arguments);
      }

      return ResetActionProto;
    }(CryptoActionProto);

    ResetActionProto.INDEX = CryptoActionProto.INDEX;
    ResetActionProto.ACTION = "crypto/reset";
    ResetActionProto = __decorate$1([ProtobufElement({})], ResetActionProto);
    return ResetActionProto;
  }();

  var CryptoCertificateProto = function () {
    var CryptoCertificateProto_1;

    var CryptoCertificateProto = CryptoCertificateProto_1 = /*#__PURE__*/function (_CryptoItemProto2) {
      _inherits(CryptoCertificateProto, _CryptoItemProto2);

      var _super35 = _createSuper(CryptoCertificateProto);

      function CryptoCertificateProto() {
        var _this10;

        _classCallCheck(this, CryptoCertificateProto);

        _this10 = _super35.apply(this, arguments);
        _this10.label = "";
        _this10.token = false;
        _this10.sensitive = false;
        return _this10;
      }

      return CryptoCertificateProto;
    }(CryptoItemProto);

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
  }();

  var CryptoX509CertificateProto = function () {
    var CryptoX509CertificateProto_1;

    var CryptoX509CertificateProto = CryptoX509CertificateProto_1 = /*#__PURE__*/function (_CryptoCertificatePro) {
      _inherits(CryptoX509CertificateProto, _CryptoCertificatePro);

      var _super36 = _createSuper(CryptoX509CertificateProto);

      function CryptoX509CertificateProto() {
        var _this11;

        _classCallCheck(this, CryptoX509CertificateProto);

        _this11 = _super36.apply(this, arguments);
        _this11.type = "x509";
        return _this11;
      }

      return CryptoX509CertificateProto;
    }(CryptoCertificateProto);

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
  }();

  var CryptoX509CertificateRequestProto = function () {
    var CryptoX509CertificateRequestProto_1;

    var CryptoX509CertificateRequestProto = CryptoX509CertificateRequestProto_1 = /*#__PURE__*/function (_CryptoCertificatePro2) {
      _inherits(CryptoX509CertificateRequestProto, _CryptoCertificatePro2);

      var _super37 = _createSuper(CryptoX509CertificateRequestProto);

      function CryptoX509CertificateRequestProto() {
        var _this12;

        _classCallCheck(this, CryptoX509CertificateRequestProto);

        _this12 = _super37.apply(this, arguments);
        _this12.type = "request";
        return _this12;
      }

      return CryptoX509CertificateRequestProto;
    }(CryptoCertificateProto);

    CryptoX509CertificateRequestProto.INDEX = CryptoCertificateProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: CryptoX509CertificateRequestProto_1.INDEX++,
      required: true,
      type: "string"
    })], CryptoX509CertificateRequestProto.prototype, "subjectName", void 0);

    CryptoX509CertificateRequestProto = CryptoX509CertificateRequestProto_1 = __decorate$1([ProtobufElement({})], CryptoX509CertificateRequestProto);
    return CryptoX509CertificateRequestProto;
  }();

  var ChainItemProto = function () {
    var ChainItemProto_1;

    var ChainItemProto = ChainItemProto_1 = /*#__PURE__*/function (_BaseProto6) {
      _inherits(ChainItemProto, _BaseProto6);

      var _super38 = _createSuper(ChainItemProto);

      function ChainItemProto() {
        _classCallCheck(this, ChainItemProto);

        return _super38.apply(this, arguments);
      }

      return ChainItemProto;
    }(BaseProto);

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
  }();

  var CertificateStorageGetChainResultProto = function () {
    var CertificateStorageGetChainResultProto_1;

    var CertificateStorageGetChainResultProto = CertificateStorageGetChainResultProto_1 = /*#__PURE__*/function (_BaseProto7) {
      _inherits(CertificateStorageGetChainResultProto, _BaseProto7);

      var _super39 = _createSuper(CertificateStorageGetChainResultProto);

      function CertificateStorageGetChainResultProto() {
        var _this13;

        _classCallCheck(this, CertificateStorageGetChainResultProto);

        _this13 = _super39.apply(this, arguments);
        _this13.items = [];
        return _this13;
      }

      return CertificateStorageGetChainResultProto;
    }(BaseProto);

    CertificateStorageGetChainResultProto.INDEX = BaseProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: CertificateStorageGetChainResultProto_1.INDEX++,
      required: true,
      repeated: true,
      parser: ChainItemProto
    })], CertificateStorageGetChainResultProto.prototype, "items", void 0);

    CertificateStorageGetChainResultProto = CertificateStorageGetChainResultProto_1 = __decorate$1([ProtobufElement({})], CertificateStorageGetChainResultProto);
    return CertificateStorageGetChainResultProto;
  }();

  var CertificateStorageSetItemActionProto = function () {
    var CertificateStorageSetItemActionProto_1;

    var CertificateStorageSetItemActionProto = CertificateStorageSetItemActionProto_1 = /*#__PURE__*/function (_CryptoActionProto5) {
      _inherits(CertificateStorageSetItemActionProto, _CryptoActionProto5);

      var _super40 = _createSuper(CertificateStorageSetItemActionProto);

      function CertificateStorageSetItemActionProto() {
        _classCallCheck(this, CertificateStorageSetItemActionProto);

        return _super40.apply(this, arguments);
      }

      return CertificateStorageSetItemActionProto;
    }(CryptoActionProto);

    CertificateStorageSetItemActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageSetItemActionProto.ACTION = "crypto/certificateStorage/setItem";

    __decorate$1([ProtobufProperty({
      id: CertificateStorageSetItemActionProto_1.INDEX++,
      required: true,
      parser: CryptoCertificateProto
    })], CertificateStorageSetItemActionProto.prototype, "item", void 0);

    CertificateStorageSetItemActionProto = CertificateStorageSetItemActionProto_1 = __decorate$1([ProtobufElement({})], CertificateStorageSetItemActionProto);
    return CertificateStorageSetItemActionProto;
  }();

  var CertificateStorageGetItemActionProto = function () {
    var CertificateStorageGetItemActionProto_1;

    var CertificateStorageGetItemActionProto = CertificateStorageGetItemActionProto_1 = /*#__PURE__*/function (_CryptoActionProto6) {
      _inherits(CertificateStorageGetItemActionProto, _CryptoActionProto6);

      var _super41 = _createSuper(CertificateStorageGetItemActionProto);

      function CertificateStorageGetItemActionProto() {
        _classCallCheck(this, CertificateStorageGetItemActionProto);

        return _super41.apply(this, arguments);
      }

      return CertificateStorageGetItemActionProto;
    }(CryptoActionProto);

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
  }();

  var CertificateStorageKeysActionProto = function () {
    var CertificateStorageKeysActionProto = /*#__PURE__*/function (_CryptoActionProto7) {
      _inherits(CertificateStorageKeysActionProto, _CryptoActionProto7);

      var _super42 = _createSuper(CertificateStorageKeysActionProto);

      function CertificateStorageKeysActionProto() {
        _classCallCheck(this, CertificateStorageKeysActionProto);

        return _super42.apply(this, arguments);
      }

      return CertificateStorageKeysActionProto;
    }(CryptoActionProto);

    CertificateStorageKeysActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageKeysActionProto.ACTION = "crypto/certificateStorage/keys";
    CertificateStorageKeysActionProto = __decorate$1([ProtobufElement({})], CertificateStorageKeysActionProto);
    return CertificateStorageKeysActionProto;
  }();

  var CertificateStorageRemoveItemActionProto = function () {
    var CertificateStorageRemoveItemActionProto_1;

    var CertificateStorageRemoveItemActionProto = CertificateStorageRemoveItemActionProto_1 = /*#__PURE__*/function (_CryptoActionProto8) {
      _inherits(CertificateStorageRemoveItemActionProto, _CryptoActionProto8);

      var _super43 = _createSuper(CertificateStorageRemoveItemActionProto);

      function CertificateStorageRemoveItemActionProto() {
        _classCallCheck(this, CertificateStorageRemoveItemActionProto);

        return _super43.apply(this, arguments);
      }

      return CertificateStorageRemoveItemActionProto;
    }(CryptoActionProto);

    CertificateStorageRemoveItemActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageRemoveItemActionProto.ACTION = "crypto/certificateStorage/removeItem";

    __decorate$1([ProtobufProperty({
      id: CertificateStorageRemoveItemActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], CertificateStorageRemoveItemActionProto.prototype, "key", void 0);

    CertificateStorageRemoveItemActionProto = CertificateStorageRemoveItemActionProto_1 = __decorate$1([ProtobufElement({})], CertificateStorageRemoveItemActionProto);
    return CertificateStorageRemoveItemActionProto;
  }();

  var CertificateStorageClearActionProto = function () {
    var CertificateStorageClearActionProto = /*#__PURE__*/function (_CryptoActionProto9) {
      _inherits(CertificateStorageClearActionProto, _CryptoActionProto9);

      var _super44 = _createSuper(CertificateStorageClearActionProto);

      function CertificateStorageClearActionProto() {
        _classCallCheck(this, CertificateStorageClearActionProto);

        return _super44.apply(this, arguments);
      }

      return CertificateStorageClearActionProto;
    }(CryptoActionProto);

    CertificateStorageClearActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageClearActionProto.ACTION = "crypto/certificateStorage/clear";
    CertificateStorageClearActionProto = __decorate$1([ProtobufElement({})], CertificateStorageClearActionProto);
    return CertificateStorageClearActionProto;
  }();

  var CertificateStorageImportActionProto = function () {
    var CertificateStorageImportActionProto_1;

    var CertificateStorageImportActionProto = CertificateStorageImportActionProto_1 = /*#__PURE__*/function (_CryptoActionProto10) {
      _inherits(CertificateStorageImportActionProto, _CryptoActionProto10);

      var _super45 = _createSuper(CertificateStorageImportActionProto);

      function CertificateStorageImportActionProto() {
        _classCallCheck(this, CertificateStorageImportActionProto);

        return _super45.apply(this, arguments);
      }

      return CertificateStorageImportActionProto;
    }(CryptoActionProto);

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
  }();

  var CertificateStorageExportActionProto = function () {
    var CertificateStorageExportActionProto_1;

    var CertificateStorageExportActionProto = CertificateStorageExportActionProto_1 = /*#__PURE__*/function (_CryptoActionProto11) {
      _inherits(CertificateStorageExportActionProto, _CryptoActionProto11);

      var _super46 = _createSuper(CertificateStorageExportActionProto);

      function CertificateStorageExportActionProto() {
        _classCallCheck(this, CertificateStorageExportActionProto);

        return _super46.apply(this, arguments);
      }

      return CertificateStorageExportActionProto;
    }(CryptoActionProto);

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
  }();

  var CertificateStorageIndexOfActionProto = function () {
    var CertificateStorageIndexOfActionProto_1;

    var CertificateStorageIndexOfActionProto = CertificateStorageIndexOfActionProto_1 = /*#__PURE__*/function (_CryptoActionProto12) {
      _inherits(CertificateStorageIndexOfActionProto, _CryptoActionProto12);

      var _super47 = _createSuper(CertificateStorageIndexOfActionProto);

      function CertificateStorageIndexOfActionProto() {
        _classCallCheck(this, CertificateStorageIndexOfActionProto);

        return _super47.apply(this, arguments);
      }

      return CertificateStorageIndexOfActionProto;
    }(CryptoActionProto);

    CertificateStorageIndexOfActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageIndexOfActionProto.ACTION = "crypto/certificateStorage/indexOf";

    __decorate$1([ProtobufProperty({
      id: CertificateStorageIndexOfActionProto_1.INDEX++,
      required: true,
      parser: CryptoCertificateProto
    })], CertificateStorageIndexOfActionProto.prototype, "item", void 0);

    CertificateStorageIndexOfActionProto = CertificateStorageIndexOfActionProto_1 = __decorate$1([ProtobufElement({})], CertificateStorageIndexOfActionProto);
    return CertificateStorageIndexOfActionProto;
  }();

  var CertificateStorageGetChainActionProto = function () {
    var CertificateStorageGetChainActionProto = /*#__PURE__*/function (_CryptoActionProto13) {
      _inherits(CertificateStorageGetChainActionProto, _CryptoActionProto13);

      var _super48 = _createSuper(CertificateStorageGetChainActionProto);

      function CertificateStorageGetChainActionProto() {
        _classCallCheck(this, CertificateStorageGetChainActionProto);

        return _super48.apply(this, arguments);
      }

      return CertificateStorageGetChainActionProto;
    }(CryptoActionProto);

    CertificateStorageGetChainActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageGetChainActionProto.ACTION = "crypto/certificateStorage/getChain";

    __decorate$1([ProtobufProperty({
      id: CertificateStorageSetItemActionProto.INDEX++,
      required: true,
      parser: CryptoCertificateProto
    })], CertificateStorageGetChainActionProto.prototype, "item", void 0);

    CertificateStorageGetChainActionProto = __decorate$1([ProtobufElement({})], CertificateStorageGetChainActionProto);
    return CertificateStorageGetChainActionProto;
  }();

  var CertificateStorageGetCRLActionProto = function () {
    var CertificateStorageGetCRLActionProto_1;

    var CertificateStorageGetCRLActionProto = CertificateStorageGetCRLActionProto_1 = /*#__PURE__*/function (_CryptoActionProto14) {
      _inherits(CertificateStorageGetCRLActionProto, _CryptoActionProto14);

      var _super49 = _createSuper(CertificateStorageGetCRLActionProto);

      function CertificateStorageGetCRLActionProto() {
        _classCallCheck(this, CertificateStorageGetCRLActionProto);

        return _super49.apply(this, arguments);
      }

      return CertificateStorageGetCRLActionProto;
    }(CryptoActionProto);

    CertificateStorageGetCRLActionProto.INDEX = CryptoActionProto.INDEX;
    CertificateStorageGetCRLActionProto.ACTION = "crypto/certificateStorage/getCRL";

    __decorate$1([ProtobufProperty({
      id: CertificateStorageGetCRLActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], CertificateStorageGetCRLActionProto.prototype, "url", void 0);

    CertificateStorageGetCRLActionProto = CertificateStorageGetCRLActionProto_1 = __decorate$1([ProtobufElement({})], CertificateStorageGetCRLActionProto);
    return CertificateStorageGetCRLActionProto;
  }();

  var OCSPRequestOptionsProto = function () {
    var OCSPRequestOptionsProto_1;

    var OCSPRequestOptionsProto = OCSPRequestOptionsProto_1 = /*#__PURE__*/function (_BaseProto8) {
      _inherits(OCSPRequestOptionsProto, _BaseProto8);

      var _super50 = _createSuper(OCSPRequestOptionsProto);

      function OCSPRequestOptionsProto() {
        _classCallCheck(this, OCSPRequestOptionsProto);

        return _super50.apply(this, arguments);
      }

      return OCSPRequestOptionsProto;
    }(BaseProto);

    OCSPRequestOptionsProto.INDEX = BaseProto.INDEX;

    __decorate$1([ProtobufProperty({
      id: OCSPRequestOptionsProto_1.INDEX++,
      required: false,
      type: "string",
      defaultValue: "get"
    })], OCSPRequestOptionsProto.prototype, "method", void 0);

    OCSPRequestOptionsProto = OCSPRequestOptionsProto_1 = __decorate$1([ProtobufElement({})], OCSPRequestOptionsProto);
    return OCSPRequestOptionsProto;
  }();

  var CertificateStorageGetOCSPActionProto = function () {
    var CertificateStorageGetOCSPActionProto_1;

    var CertificateStorageGetOCSPActionProto = CertificateStorageGetOCSPActionProto_1 = /*#__PURE__*/function (_CryptoActionProto15) {
      _inherits(CertificateStorageGetOCSPActionProto, _CryptoActionProto15);

      var _super51 = _createSuper(CertificateStorageGetOCSPActionProto);

      function CertificateStorageGetOCSPActionProto() {
        _classCallCheck(this, CertificateStorageGetOCSPActionProto);

        return _super51.apply(this, arguments);
      }

      return CertificateStorageGetOCSPActionProto;
    }(CryptoActionProto);

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
  }();

  var KeyStorageSetItemActionProto = function () {
    var KeyStorageSetItemActionProto_1;

    var KeyStorageSetItemActionProto = KeyStorageSetItemActionProto_1 = /*#__PURE__*/function (_CryptoActionProto16) {
      _inherits(KeyStorageSetItemActionProto, _CryptoActionProto16);

      var _super52 = _createSuper(KeyStorageSetItemActionProto);

      function KeyStorageSetItemActionProto() {
        _classCallCheck(this, KeyStorageSetItemActionProto);

        return _super52.apply(this, arguments);
      }

      return KeyStorageSetItemActionProto;
    }(CryptoActionProto);

    KeyStorageSetItemActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageSetItemActionProto.ACTION = "crypto/keyStorage/setItem";

    __decorate$1([ProtobufProperty({
      id: KeyStorageSetItemActionProto_1.INDEX++,
      required: true,
      parser: CryptoKeyProto
    })], KeyStorageSetItemActionProto.prototype, "item", void 0);

    KeyStorageSetItemActionProto = KeyStorageSetItemActionProto_1 = __decorate$1([ProtobufElement({})], KeyStorageSetItemActionProto);
    return KeyStorageSetItemActionProto;
  }();

  var KeyStorageGetItemActionProto = function () {
    var KeyStorageGetItemActionProto_1;

    var KeyStorageGetItemActionProto = KeyStorageGetItemActionProto_1 = /*#__PURE__*/function (_CryptoActionProto17) {
      _inherits(KeyStorageGetItemActionProto, _CryptoActionProto17);

      var _super53 = _createSuper(KeyStorageGetItemActionProto);

      function KeyStorageGetItemActionProto() {
        _classCallCheck(this, KeyStorageGetItemActionProto);

        return _super53.apply(this, arguments);
      }

      return KeyStorageGetItemActionProto;
    }(CryptoActionProto);

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
  }();

  var KeyStorageKeysActionProto = function () {
    var KeyStorageKeysActionProto = /*#__PURE__*/function (_CryptoActionProto18) {
      _inherits(KeyStorageKeysActionProto, _CryptoActionProto18);

      var _super54 = _createSuper(KeyStorageKeysActionProto);

      function KeyStorageKeysActionProto() {
        _classCallCheck(this, KeyStorageKeysActionProto);

        return _super54.apply(this, arguments);
      }

      return KeyStorageKeysActionProto;
    }(CryptoActionProto);

    KeyStorageKeysActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageKeysActionProto.ACTION = "crypto/keyStorage/keys";
    KeyStorageKeysActionProto = __decorate$1([ProtobufElement({})], KeyStorageKeysActionProto);
    return KeyStorageKeysActionProto;
  }();

  var KeyStorageRemoveItemActionProto = function () {
    var KeyStorageRemoveItemActionProto_1;

    var KeyStorageRemoveItemActionProto = KeyStorageRemoveItemActionProto_1 = /*#__PURE__*/function (_CryptoActionProto19) {
      _inherits(KeyStorageRemoveItemActionProto, _CryptoActionProto19);

      var _super55 = _createSuper(KeyStorageRemoveItemActionProto);

      function KeyStorageRemoveItemActionProto() {
        _classCallCheck(this, KeyStorageRemoveItemActionProto);

        return _super55.apply(this, arguments);
      }

      return KeyStorageRemoveItemActionProto;
    }(CryptoActionProto);

    KeyStorageRemoveItemActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageRemoveItemActionProto.ACTION = "crypto/keyStorage/removeItem";

    __decorate$1([ProtobufProperty({
      id: KeyStorageRemoveItemActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], KeyStorageRemoveItemActionProto.prototype, "key", void 0);

    KeyStorageRemoveItemActionProto = KeyStorageRemoveItemActionProto_1 = __decorate$1([ProtobufElement({})], KeyStorageRemoveItemActionProto);
    return KeyStorageRemoveItemActionProto;
  }();

  var KeyStorageClearActionProto = function () {
    var KeyStorageClearActionProto = /*#__PURE__*/function (_CryptoActionProto20) {
      _inherits(KeyStorageClearActionProto, _CryptoActionProto20);

      var _super56 = _createSuper(KeyStorageClearActionProto);

      function KeyStorageClearActionProto() {
        _classCallCheck(this, KeyStorageClearActionProto);

        return _super56.apply(this, arguments);
      }

      return KeyStorageClearActionProto;
    }(CryptoActionProto);

    KeyStorageClearActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageClearActionProto.ACTION = "crypto/keyStorage/clear";
    KeyStorageClearActionProto = __decorate$1([ProtobufElement({})], KeyStorageClearActionProto);
    return KeyStorageClearActionProto;
  }();

  var KeyStorageIndexOfActionProto = function () {
    var KeyStorageIndexOfActionProto_1;

    var KeyStorageIndexOfActionProto = KeyStorageIndexOfActionProto_1 = /*#__PURE__*/function (_CryptoActionProto21) {
      _inherits(KeyStorageIndexOfActionProto, _CryptoActionProto21);

      var _super57 = _createSuper(KeyStorageIndexOfActionProto);

      function KeyStorageIndexOfActionProto() {
        _classCallCheck(this, KeyStorageIndexOfActionProto);

        return _super57.apply(this, arguments);
      }

      return KeyStorageIndexOfActionProto;
    }(CryptoActionProto);

    KeyStorageIndexOfActionProto.INDEX = CryptoActionProto.INDEX;
    KeyStorageIndexOfActionProto.ACTION = "crypto/keyStorage/indexOf";

    __decorate$1([ProtobufProperty({
      id: KeyStorageIndexOfActionProto_1.INDEX++,
      required: true,
      parser: CryptoKeyProto
    })], KeyStorageIndexOfActionProto.prototype, "item", void 0);

    KeyStorageIndexOfActionProto = KeyStorageIndexOfActionProto_1 = __decorate$1([ProtobufElement({})], KeyStorageIndexOfActionProto);
    return KeyStorageIndexOfActionProto;
  }();

  var ProviderCryptoProto = function () {
    var ProviderCryptoProto_1;

    var ProviderCryptoProto = ProviderCryptoProto_1 = /*#__PURE__*/function (_BaseProto9) {
      _inherits(ProviderCryptoProto, _BaseProto9);

      var _super58 = _createSuper(ProviderCryptoProto);

      function ProviderCryptoProto(data) {
        var _this14;

        _classCallCheck(this, ProviderCryptoProto);

        _this14 = _super58.call(this);

        if (data) {
          assign(_assertThisInitialized(_this14), data);
        }

        return _this14;
      }

      return ProviderCryptoProto;
    }(BaseProto);

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
  }();

  var ProviderInfoProto = function () {
    var ProviderInfoProto_1;

    var ProviderInfoProto = ProviderInfoProto_1 = /*#__PURE__*/function (_BaseProto10) {
      _inherits(ProviderInfoProto, _BaseProto10);

      var _super59 = _createSuper(ProviderInfoProto);

      function ProviderInfoProto() {
        _classCallCheck(this, ProviderInfoProto);

        return _super59.apply(this, arguments);
      }

      return ProviderInfoProto;
    }(BaseProto);

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
  }();

  var ProviderInfoActionProto = function () {
    var ProviderInfoActionProto = /*#__PURE__*/function (_ActionProto8) {
      _inherits(ProviderInfoActionProto, _ActionProto8);

      var _super60 = _createSuper(ProviderInfoActionProto);

      function ProviderInfoActionProto() {
        _classCallCheck(this, ProviderInfoActionProto);

        return _super60.apply(this, arguments);
      }

      return ProviderInfoActionProto;
    }(ActionProto);

    ProviderInfoActionProto.INDEX = ActionProto.INDEX;
    ProviderInfoActionProto.ACTION = "provider/action/info";
    ProviderInfoActionProto = __decorate$1([ProtobufElement({})], ProviderInfoActionProto);
    return ProviderInfoActionProto;
  }();

  var ProviderGetCryptoActionProto = function () {
    var ProviderGetCryptoActionProto_1;

    var ProviderGetCryptoActionProto = ProviderGetCryptoActionProto_1 = /*#__PURE__*/function (_ActionProto9) {
      _inherits(ProviderGetCryptoActionProto, _ActionProto9);

      var _super61 = _createSuper(ProviderGetCryptoActionProto);

      function ProviderGetCryptoActionProto() {
        _classCallCheck(this, ProviderGetCryptoActionProto);

        return _super61.apply(this, arguments);
      }

      return ProviderGetCryptoActionProto;
    }(ActionProto);

    ProviderGetCryptoActionProto.INDEX = ActionProto.INDEX;
    ProviderGetCryptoActionProto.ACTION = "provider/action/getCrypto";

    __decorate$1([ProtobufProperty({
      id: ProviderGetCryptoActionProto_1.INDEX++,
      required: true,
      type: "string"
    })], ProviderGetCryptoActionProto.prototype, "cryptoID", void 0);

    ProviderGetCryptoActionProto = ProviderGetCryptoActionProto_1 = __decorate$1([ProtobufElement({})], ProviderGetCryptoActionProto);
    return ProviderGetCryptoActionProto;
  }();

  var ProviderAuthorizedEventProto = function () {
    var ProviderAuthorizedEventProto = /*#__PURE__*/function (_ActionProto10) {
      _inherits(ProviderAuthorizedEventProto, _ActionProto10);

      var _super62 = _createSuper(ProviderAuthorizedEventProto);

      function ProviderAuthorizedEventProto() {
        _classCallCheck(this, ProviderAuthorizedEventProto);

        return _super62.apply(this, arguments);
      }

      return ProviderAuthorizedEventProto;
    }(ActionProto);

    ProviderAuthorizedEventProto.INDEX = ActionProto.INDEX;
    ProviderAuthorizedEventProto.ACTION = "provider/event/authorized";
    ProviderAuthorizedEventProto = __decorate$1([ProtobufElement({})], ProviderAuthorizedEventProto);
    return ProviderAuthorizedEventProto;
  }();

  var ProviderTokenEventProto = function () {
    var ProviderTokenEventProto_1;

    var ProviderTokenEventProto = ProviderTokenEventProto_1 = /*#__PURE__*/function (_ActionProto11) {
      _inherits(ProviderTokenEventProto, _ActionProto11);

      var _super63 = _createSuper(ProviderTokenEventProto);

      function ProviderTokenEventProto(data) {
        var _this15;

        _classCallCheck(this, ProviderTokenEventProto);

        _this15 = _super63.call(this);

        if (data) {
          assign(_assertThisInitialized(_this15), data);
        }

        return _this15;
      }

      return ProviderTokenEventProto;
    }(ActionProto);

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
  }();

  var DigestActionProto = function () {
    var DigestActionProto_1;

    var DigestActionProto = DigestActionProto_1 = /*#__PURE__*/function (_CryptoActionProto22) {
      _inherits(DigestActionProto, _CryptoActionProto22);

      var _super64 = _createSuper(DigestActionProto);

      function DigestActionProto() {
        _classCallCheck(this, DigestActionProto);

        return _super64.apply(this, arguments);
      }

      return DigestActionProto;
    }(CryptoActionProto);

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
  }();

  var GenerateKeyActionProto = function () {
    var GenerateKeyActionProto_1;

    var GenerateKeyActionProto = GenerateKeyActionProto_1 = /*#__PURE__*/function (_CryptoActionProto23) {
      _inherits(GenerateKeyActionProto, _CryptoActionProto23);

      var _super65 = _createSuper(GenerateKeyActionProto);

      function GenerateKeyActionProto() {
        _classCallCheck(this, GenerateKeyActionProto);

        return _super65.apply(this, arguments);
      }

      return GenerateKeyActionProto;
    }(CryptoActionProto);

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
  }();

  var SignActionProto = function () {
    var SignActionProto_1;

    var SignActionProto = SignActionProto_1 = /*#__PURE__*/function (_CryptoActionProto24) {
      _inherits(SignActionProto, _CryptoActionProto24);

      var _super66 = _createSuper(SignActionProto);

      function SignActionProto() {
        _classCallCheck(this, SignActionProto);

        return _super66.apply(this, arguments);
      }

      return SignActionProto;
    }(CryptoActionProto);

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
  }();

  var VerifyActionProto = function () {
    var VerifyActionProto_1;

    var VerifyActionProto = VerifyActionProto_1 = /*#__PURE__*/function (_SignActionProto) {
      _inherits(VerifyActionProto, _SignActionProto);

      var _super67 = _createSuper(VerifyActionProto);

      function VerifyActionProto() {
        _classCallCheck(this, VerifyActionProto);

        return _super67.apply(this, arguments);
      }

      return VerifyActionProto;
    }(SignActionProto);

    VerifyActionProto.INDEX = SignActionProto.INDEX;
    VerifyActionProto.ACTION = "crypto/subtle/verify";

    __decorate$1([ProtobufProperty({
      id: VerifyActionProto_1.INDEX++,
      required: true,
      converter: ArrayBufferConverter
    })], VerifyActionProto.prototype, "signature", void 0);

    VerifyActionProto = VerifyActionProto_1 = __decorate$1([ProtobufElement({})], VerifyActionProto);
    return VerifyActionProto;
  }();

  var EncryptActionProto = function () {
    var EncryptActionProto = /*#__PURE__*/function (_SignActionProto2) {
      _inherits(EncryptActionProto, _SignActionProto2);

      var _super68 = _createSuper(EncryptActionProto);

      function EncryptActionProto() {
        _classCallCheck(this, EncryptActionProto);

        return _super68.apply(this, arguments);
      }

      return EncryptActionProto;
    }(SignActionProto);

    EncryptActionProto.INDEX = SignActionProto.INDEX;
    EncryptActionProto.ACTION = "crypto/subtle/encrypt";
    EncryptActionProto = __decorate$1([ProtobufElement({})], EncryptActionProto);
    return EncryptActionProto;
  }();

  var DecryptActionProto = function () {
    var DecryptActionProto = /*#__PURE__*/function (_SignActionProto3) {
      _inherits(DecryptActionProto, _SignActionProto3);

      var _super69 = _createSuper(DecryptActionProto);

      function DecryptActionProto() {
        _classCallCheck(this, DecryptActionProto);

        return _super69.apply(this, arguments);
      }

      return DecryptActionProto;
    }(SignActionProto);

    DecryptActionProto.INDEX = SignActionProto.INDEX;
    DecryptActionProto.ACTION = "crypto/subtle/decrypt";
    DecryptActionProto = __decorate$1([ProtobufElement({})], DecryptActionProto);
    return DecryptActionProto;
  }();

  var DeriveBitsActionProto = function () {
    var DeriveBitsActionProto_1;

    var DeriveBitsActionProto = DeriveBitsActionProto_1 = /*#__PURE__*/function (_CryptoActionProto25) {
      _inherits(DeriveBitsActionProto, _CryptoActionProto25);

      var _super70 = _createSuper(DeriveBitsActionProto);

      function DeriveBitsActionProto() {
        _classCallCheck(this, DeriveBitsActionProto);

        return _super70.apply(this, arguments);
      }

      return DeriveBitsActionProto;
    }(CryptoActionProto);

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
  }();

  var DeriveKeyActionProto = function () {
    var DeriveKeyActionProto_1;

    var DeriveKeyActionProto = DeriveKeyActionProto_1 = /*#__PURE__*/function (_CryptoActionProto26) {
      _inherits(DeriveKeyActionProto, _CryptoActionProto26);

      var _super71 = _createSuper(DeriveKeyActionProto);

      function DeriveKeyActionProto() {
        _classCallCheck(this, DeriveKeyActionProto);

        return _super71.apply(this, arguments);
      }

      return DeriveKeyActionProto;
    }(CryptoActionProto);

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
  }();

  var UnwrapKeyActionProto = function () {
    var UnwrapKeyActionProto_1;

    var UnwrapKeyActionProto = UnwrapKeyActionProto_1 = /*#__PURE__*/function (_CryptoActionProto27) {
      _inherits(UnwrapKeyActionProto, _CryptoActionProto27);

      var _super72 = _createSuper(UnwrapKeyActionProto);

      function UnwrapKeyActionProto() {
        _classCallCheck(this, UnwrapKeyActionProto);

        return _super72.apply(this, arguments);
      }

      return UnwrapKeyActionProto;
    }(CryptoActionProto);

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
  }();

  var WrapKeyActionProto = function () {
    var WrapKeyActionProto_1;

    var WrapKeyActionProto = WrapKeyActionProto_1 = /*#__PURE__*/function (_CryptoActionProto28) {
      _inherits(WrapKeyActionProto, _CryptoActionProto28);

      var _super73 = _createSuper(WrapKeyActionProto);

      function WrapKeyActionProto() {
        _classCallCheck(this, WrapKeyActionProto);

        return _super73.apply(this, arguments);
      }

      return WrapKeyActionProto;
    }(CryptoActionProto);

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
  }();

  var ExportKeyActionProto = function () {
    var ExportKeyActionProto_1;

    var ExportKeyActionProto = ExportKeyActionProto_1 = /*#__PURE__*/function (_CryptoActionProto29) {
      _inherits(ExportKeyActionProto, _CryptoActionProto29);

      var _super74 = _createSuper(ExportKeyActionProto);

      function ExportKeyActionProto() {
        _classCallCheck(this, ExportKeyActionProto);

        return _super74.apply(this, arguments);
      }

      return ExportKeyActionProto;
    }(CryptoActionProto);

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
  }();

  var ImportKeyActionProto = function () {
    var ImportKeyActionProto_1;

    var ImportKeyActionProto = ImportKeyActionProto_1 = /*#__PURE__*/function (_CryptoActionProto30) {
      _inherits(ImportKeyActionProto, _CryptoActionProto30);

      var _super75 = _createSuper(ImportKeyActionProto);

      function ImportKeyActionProto() {
        _classCallCheck(this, ImportKeyActionProto);

        return _super75.apply(this, arguments);
      }

      return ImportKeyActionProto;
    }(CryptoActionProto);

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
  }();

  var CardReader = /*#__PURE__*/function (_EventEmitter2) {
    _inherits(CardReader, _EventEmitter2);

    var _super76 = _createSuper(CardReader);

    function CardReader(client) {
      var _this16;

      _classCallCheck(this, CardReader);

      _this16 = _super76.call(this);
      _this16.client = client;
      _this16.onEvent = _this16.onEvent.bind(_assertThisInitialized(_this16));

      _this16.client.on("listening", function () {
        _this16.client.on("event", _this16.onEvent);
      }).on("close", function () {
        _this16.client.removeListener("event", _this16.onEvent);
      });

      return _this16;
    }

    _createClass(CardReader, [{
      key: "readers",
      value: function () {
        var _readers = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee69() {
          var data;
          return regeneratorRuntime.wrap(function _callee69$(_context69) {
            while (1) {
              switch (_context69.prev = _context69.next) {
                case 0:
                  _context69.next = 2;
                  return this.client.send(new CardReaderGetReadersActionProto());

                case 2:
                  data = _context69.sent;
                  return _context69.abrupt("return", JSON.parse(Convert.ToString(data)));

                case 4:
                case "end":
                  return _context69.stop();
              }
            }
          }, _callee69, this);
        }));

        function readers() {
          return _readers.apply(this, arguments);
        }

        return readers;
      }()
    }, {
      key: "on",
      value: function on(event, cb) {
        return _get(_getPrototypeOf(CardReader.prototype), "on", this).call(this, event, cb);
      }
    }, {
      key: "emit",
      value: function emit(event) {
        var _get8;

        for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key5 = 1; _key5 < _len3; _key5++) {
          args[_key5 - 1] = arguments[_key5];
        }

        return (_get8 = _get(_getPrototypeOf(CardReader.prototype), "emit", this)).call.apply(_get8, [this, event].concat(args));
      }
    }, {
      key: "onEvent",
      value: function onEvent(actionProto) {
        var _this17 = this;

        _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee70() {
          return regeneratorRuntime.wrap(function _callee70$(_context70) {
            while (1) {
              switch (_context70.prev = _context70.next) {
                case 0:
                  _context70.t0 = actionProto.action;
                  _context70.next = _context70.t0 === CardReaderInsertEventProto.ACTION ? 3 : _context70.t0 === CardReaderRemoveEventProto.ACTION ? 9 : 15;
                  break;

                case 3:
                  _context70.t1 = _this17;
                  _context70.next = 6;
                  return CardReaderInsertEventProto.importProto(actionProto);

                case 6:
                  _context70.t2 = _context70.sent;

                  _context70.t1.onInsert.call(_context70.t1, _context70.t2);

                  return _context70.abrupt("break", 15);

                case 9:
                  _context70.t3 = _this17;
                  _context70.next = 12;
                  return CardReaderRemoveEventProto.importProto(actionProto);

                case 12:
                  _context70.t4 = _context70.sent;

                  _context70.t3.onRemove.call(_context70.t3, _context70.t4);

                  return _context70.abrupt("break", 15);

                case 15:
                case "end":
                  return _context70.stop();
              }
            }
          }, _callee70);
        }))().catch(function (err) {
          return _this17.emit("error", err);
        });
      }
    }, {
      key: "onInsert",
      value: function onInsert(actionProto) {
        this.emit("insert", actionProto);
      }
    }, {
      key: "onRemove",
      value: function onRemove(actionProto) {
        this.emit("remove", actionProto);
      }
    }]);

    return CardReader;
  }(EventEmitter);

  function _challenge2(_x77, _x78) {
    return _challenge.apply(this, arguments);
  }

  function _challenge() {
    _challenge = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee137(serverIdentity, clientIdentity) {
      var serverIdentityDigest, clientIdentityDigest, combinedIdentity, digest;
      return regeneratorRuntime.wrap(function _callee137$(_context137) {
        while (1) {
          switch (_context137.prev = _context137.next) {
            case 0:
              _context137.next = 2;
              return serverIdentity.thumbprint();

            case 2:
              serverIdentityDigest = _context137.sent;
              _context137.next = 5;
              return clientIdentity.thumbprint();

            case 5:
              clientIdentityDigest = _context137.sent;
              combinedIdentity = Convert.FromHex(serverIdentityDigest + clientIdentityDigest);
              _context137.next = 9;
              return getEngine().crypto.subtle.digest("SHA-256", combinedIdentity);

            case 9:
              digest = _context137.sent;
              return _context137.abrupt("return", parseInt(Convert.ToHex(digest), 16).toString().substr(2, 6));

            case 11:
            case "end":
              return _context137.stop();
          }
        }
      }, _callee137);
    }));
    return _challenge.apply(this, arguments);
  }

  var SERVER_WELL_KNOWN = "/.well-known/webcrypto-socket";

  var Event = function Event(target, event) {
    _classCallCheck(this, Event);

    this.target = target;
    this.event = event;
  };

  var CryptoServerError = /*#__PURE__*/function (_Error) {
    _inherits(CryptoServerError, _Error);

    var _super77 = _createSuper(CryptoServerError);

    function CryptoServerError(error) {
      var _this18;

      _classCallCheck(this, CryptoServerError);

      _this18 = _super77.call(this, error.message);
      _this18.name = "CryptoServerError";
      _this18.code = error.code;
      _this18.type = error.type;
      return _this18;
    }

    return CryptoServerError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  var ClientEvent = /*#__PURE__*/function (_Event) {
    _inherits(ClientEvent, _Event);

    var _super78 = _createSuper(ClientEvent);

    function ClientEvent() {
      _classCallCheck(this, ClientEvent);

      return _super78.apply(this, arguments);
    }

    return ClientEvent;
  }(Event);

  var ClientCloseEvent = /*#__PURE__*/function (_ClientEvent) {
    _inherits(ClientCloseEvent, _ClientEvent);

    var _super79 = _createSuper(ClientCloseEvent);

    function ClientCloseEvent(target, remoteAddress, reasonCode, description) {
      var _this19;

      _classCallCheck(this, ClientCloseEvent);

      _this19 = _super79.call(this, target, "close");
      _this19.remoteAddress = remoteAddress;
      _this19.reasonCode = reasonCode;
      _this19.description = description;
      return _this19;
    }

    return ClientCloseEvent;
  }(ClientEvent);

  var ClientErrorEvent = /*#__PURE__*/function (_ClientEvent2) {
    _inherits(ClientErrorEvent, _ClientEvent2);

    var _super80 = _createSuper(ClientErrorEvent);

    function ClientErrorEvent(target, error) {
      var _this20;

      _classCallCheck(this, ClientErrorEvent);

      _this20 = _super80.call(this, target, "error");
      _this20.error = error;
      return _this20;
    }

    return ClientErrorEvent;
  }(ClientEvent);

  var ClientListeningEvent = /*#__PURE__*/function (_ClientEvent3) {
    _inherits(ClientListeningEvent, _ClientEvent3);

    var _super81 = _createSuper(ClientListeningEvent);

    function ClientListeningEvent(target, address) {
      var _this21;

      _classCallCheck(this, ClientListeningEvent);

      _this21 = _super81.call(this, target, "listening");
      _this21.address = address;
      return _this21;
    }

    return ClientListeningEvent;
  }(ClientEvent);

  function isFirefox() {
    return /firefox/i.test(self.navigator.userAgent);
  }

  function isEdge() {
    return /edge\/([\d\.]+)/i.test(self.navigator.userAgent);
  }

  function isIE() {
    return !!window.document.documentMode;
  }

  var ECDH = {
    name: "ECDH",
    namedCurve: "P-256"
  };
  var ECDSA = {
    name: "ECDSA",
    namedCurve: "P-256"
  };
  var AES_CBC = {
    name: "AES-CBC",
    iv: new ArrayBuffer(16)
  };

  function createEcPublicKey(_x79) {
    return _createEcPublicKey.apply(this, arguments);
  }

  function _createEcPublicKey() {
    _createEcPublicKey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee138(publicKey) {
      var algName, jwk, x, y, xy, key, serialized, id;
      return regeneratorRuntime.wrap(function _callee138$(_context138) {
        while (1) {
          switch (_context138.prev = _context138.next) {
            case 0:
              algName = publicKey.algorithm.name.toUpperCase();

              if (algName === "ECDH" || algName === "ECDSA") {
                _context138.next = 3;
                break;
              }

              throw new Error("Error: Unsupported asymmetric key algorithm.");

            case 3:
              if (!(publicKey.type !== "public")) {
                _context138.next = 5;
                break;
              }

              throw new Error("Error: Expected key type to be public but it was not.");

            case 5:
              _context138.next = 7;
              return getEngine().crypto.subtle.exportKey("jwk", publicKey);

            case 7:
              jwk = _context138.sent;

              if (jwk.x && jwk.y) {
                _context138.next = 10;
                break;
              }

              throw new Error("Wrong JWK data for EC public key. Parameters x and y are required.");

            case 10:
              x = Convert.FromBase64Url(jwk.x);
              y = Convert.FromBase64Url(jwk.y);
              xy = Convert.ToBinary(x) + Convert.ToBinary(y);
              key = publicKey;
              serialized = Convert.FromBinary(xy);
              _context138.t0 = Convert;
              _context138.next = 18;
              return getEngine().crypto.subtle.digest("SHA-256", serialized);

            case 18:
              _context138.t1 = _context138.sent;
              id = _context138.t0.ToHex.call(_context138.t0, _context138.t1);
              return _context138.abrupt("return", {
                id: id,
                key: key,
                serialized: serialized
              });

            case 21:
            case "end":
              return _context138.stop();
          }
        }
      }, _callee138);
    }));
    return _createEcPublicKey.apply(this, arguments);
  }

  function updateEcPublicKey(_x80, _x81) {
    return _updateEcPublicKey.apply(this, arguments);
  }

  function _updateEcPublicKey() {
    _updateEcPublicKey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee139(ecPublicKey, publicKey) {
      var data;
      return regeneratorRuntime.wrap(function _callee139$(_context139) {
        while (1) {
          switch (_context139.prev = _context139.next) {
            case 0:
              _context139.next = 2;
              return createEcPublicKey(publicKey);

            case 2:
              data = _context139.sent;
              ecPublicKey.id = data.id;
              ecPublicKey.key = data.key;
              ecPublicKey.serialized = data.serialized;

            case 6:
            case "end":
              return _context139.stop();
          }
        }
      }, _callee139);
    }));
    return _updateEcPublicKey.apply(this, arguments);
  }

  var SocketCryptoState;

  (function (SocketCryptoState) {
    SocketCryptoState[SocketCryptoState["connecting"] = 0] = "connecting";
    SocketCryptoState[SocketCryptoState["open"] = 1] = "open";
    SocketCryptoState[SocketCryptoState["closing"] = 2] = "closing";
    SocketCryptoState[SocketCryptoState["closed"] = 3] = "closed";
  })(SocketCryptoState || (SocketCryptoState = {}));

  var Client = /*#__PURE__*/function (_EventEmitter3) {
    _inherits(Client, _EventEmitter3);

    var _super82 = _createSuper(Client);

    function Client(storage) {
      var _this22;

      _classCallCheck(this, Client);

      _this22 = _super82.call(this);
      _this22.stack = {};
      _this22.messageCounter = 0;
      _this22.storage = storage;
      return _this22;
    }

    _createClass(Client, [{
      key: "connect",
      value: function connect(address, options) {
        var _this23 = this;

        this.getServerInfo(address).then(function (info) {
          _this23.serviceInfo = info;
          var url = "wss://".concat(address);
          _this23.socket = options ? new WebSocket(url, undefined, options) : new WebSocket(url);
          _this23.socket.binaryType = "arraybuffer";

          _this23.socket.onerror = function (e) {
            _this23.emit("error", new ClientErrorEvent(_this23, e.error));
          };

          _this23.socket.onopen = function () {
            _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee71() {
              var identity, remoteIdentityId, bundle;
              return regeneratorRuntime.wrap(function _callee71$(_context71) {
                while (1) {
                  switch (_context71.prev = _context71.next) {
                    case 0:
                      _context71.next = 2;
                      return _this23.storage.loadIdentity();

                    case 2:
                      identity = _context71.sent;

                      if (identity) {
                        _context71.next = 9;
                        break;
                      }

                      _context71.next = 6;
                      return Identity.create(1, 0, 0, isIE() || isEdge() || isFirefox());

                    case 6:
                      identity = _context71.sent;
                      _context71.next = 9;
                      return _this23.storage.saveIdentity(identity);

                    case 9:
                      remoteIdentityId = "0";
                      _context71.next = 12;
                      return PreKeyBundleProtocol.importProto(Convert.FromBase64(info.preKey));

                    case 12:
                      bundle = _context71.sent;
                      _context71.next = 15;
                      return AsymmetricRatchet.create(identity, bundle);

                    case 15:
                      _this23.cipher = _context71.sent;
                      _context71.next = 18;
                      return _this23.storage.saveRemoteIdentity(remoteIdentityId, _this23.cipher.remoteIdentity);

                    case 18:
                      _this23.emit("listening", new ClientListeningEvent(_this23, address));

                    case 19:
                    case "end":
                      return _context71.stop();
                  }
                }
              }, _callee71);
            }))().catch(function (error) {
              return _this23.emit("error", new ClientErrorEvent(_this23, error));
            });
          };

          _this23.socket.onclose = function (e) {
            for (var actionId in _this23.stack) {
              var message = _this23.stack[actionId];
              message.reject(new Error("Cannot finish operation. Session was closed"));
            }

            _this23.emit("close", new ClientCloseEvent(_this23, address, e.code, e.reason));
          };

          _this23.socket.onmessage = function (e) {
            if (e.data instanceof ArrayBuffer) {
              MessageSignedProtocol.importProto(e.data).then(function (proto2) {
                if (!_this23.cipher) {
                  throw new Error("Client cipher is not initialized");
                }

                return _this23.cipher.decrypt(proto2);
              }).then(function (msg) {
                _this23.onMessage(msg);
              }).catch(function (err) {
                _this23.emit("error", new ClientErrorEvent(_this23, err));
              });
            }
          };
        }).catch(function (err) {
          _this23.emit("error", new ClientErrorEvent(_this23, err));
        });
        return this;
      }
    }, {
      key: "close",
      value: function close() {
        if (this.socket) {
          this.socket.close();
        }
      }
    }, {
      key: "on",
      value: function on(event, listener) {
        return _get(_getPrototypeOf(Client.prototype), "on", this).call(this, event, listener);
      }
    }, {
      key: "once",
      value: function once(event, listener) {
        return _get(_getPrototypeOf(Client.prototype), "once", this).call(this, event, listener);
      }
    }, {
      key: "challenge",
      value: function () {
        var _challenge3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee72() {
          return regeneratorRuntime.wrap(function _callee72$(_context72) {
            while (1) {
              switch (_context72.prev = _context72.next) {
                case 0:
                  if (this.cipher) {
                    _context72.next = 2;
                    break;
                  }

                  throw new Error("Client cipher is not initialized");

                case 2:
                  return _context72.abrupt("return", _challenge2(this.cipher.remoteIdentity.signingKey, this.cipher.identity.signingKey.publicKey));

                case 3:
                case "end":
                  return _context72.stop();
              }
            }
          }, _callee72, this);
        }));

        function challenge() {
          return _challenge3.apply(this, arguments);
        }

        return challenge;
      }()
    }, {
      key: "isLoggedIn",
      value: function () {
        var _isLoggedIn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee73() {
          var action, data;
          return regeneratorRuntime.wrap(function _callee73$(_context73) {
            while (1) {
              switch (_context73.prev = _context73.next) {
                case 0:
                  action = new ServerIsLoggedInActionProto();
                  _context73.next = 3;
                  return this.send(action);

                case 3:
                  data = _context73.sent;
                  return _context73.abrupt("return", data ? !!new Uint8Array(data)[0] : false);

                case 5:
                case "end":
                  return _context73.stop();
              }
            }
          }, _callee73, this);
        }));

        function isLoggedIn() {
          return _isLoggedIn.apply(this, arguments);
        }

        return isLoggedIn;
      }()
    }, {
      key: "login",
      value: function () {
        var _login = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee74() {
          var action;
          return regeneratorRuntime.wrap(function _callee74$(_context74) {
            while (1) {
              switch (_context74.prev = _context74.next) {
                case 0:
                  action = new ServerLoginActionProto();
                  _context74.next = 3;
                  return this.send(action);

                case 3:
                case "end":
                  return _context74.stop();
              }
            }
          }, _callee74, this);
        }));

        function login() {
          return _login.apply(this, arguments);
        }

        return login;
      }()
    }, {
      key: "send",
      value: function send(data) {
        var _this24 = this;

        return new Promise(function (resolve, reject) {
          _this24.checkSocketState();

          if (!data) {
            data = new ActionProto();
          }

          data.action = data.action;
          data.actionId = (_this24.messageCounter++).toString();
          data.exportProto().then(function (raw) {
            if (!_this24.cipher) {
              throw new Error("Client cipher is not initialized");
            }

            return _this24.cipher.encrypt(raw).then(function (msg) {
              return msg.exportProto();
            });
          }).then(function (raw) {
            if (!_this24.socket) {
              throw new Error("Client socket is not initialized");
            }

            _this24.stack[data.actionId] = {
              resolve: resolve,
              reject: reject
            };

            _this24.socket.send(raw);
          }).catch(reject);
        });
      }
    }, {
      key: "getServerInfo",
      value: function () {
        var _getServerInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee75(address) {
          var url, response, json;
          return regeneratorRuntime.wrap(function _callee75$(_context75) {
            while (1) {
              switch (_context75.prev = _context75.next) {
                case 0:
                  url = "https://".concat(address).concat(SERVER_WELL_KNOWN);
                  _context75.next = 3;
                  return fetch(url);

                case 3:
                  response = _context75.sent;

                  if (!(response.status !== 200)) {
                    _context75.next = 8;
                    break;
                  }

                  throw new Error("Cannot get wellknown link");

                case 8:
                  _context75.next = 10;
                  return response.json();

                case 10:
                  json = _context75.sent;
                  return _context75.abrupt("return", json);

                case 12:
                case "end":
                  return _context75.stop();
              }
            }
          }, _callee75);
        }));

        function getServerInfo(_x82) {
          return _getServerInfo.apply(this, arguments);
        }

        return getServerInfo;
      }()
    }, {
      key: "checkSocketState",
      value: function checkSocketState() {
        if (this.state !== SocketCryptoState.open) {
          throw new Error("Socket connection is not open");
        }
      }
    }, {
      key: "onMessage",
      value: function () {
        var _onMessage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee76(message) {
          var p, promise, messageProto, errorProto, error;
          return regeneratorRuntime.wrap(function _callee76$(_context76) {
            while (1) {
              switch (_context76.prev = _context76.next) {
                case 0:
                  _context76.next = 2;
                  return ActionProto.importProto(message);

                case 2:
                  p = _context76.sent;
                  promise = this.stack[p.actionId];

                  if (!promise) {
                    _context76.next = 16;
                    break;
                  }

                  delete this.stack[p.actionId];
                  _context76.t0 = ResultProto;
                  _context76.next = 9;
                  return p.exportProto();

                case 9:
                  _context76.t1 = _context76.sent;
                  _context76.next = 12;
                  return _context76.t0.importProto.call(_context76.t0, _context76.t1);

                case 12:
                  messageProto = _context76.sent;

                  if (messageProto.error && messageProto.error.message) {
                    errorProto = messageProto.error;
                    error = new CryptoServerError(errorProto);
                    promise.reject(error);
                  } else {
                    promise.resolve(messageProto.data);
                  }

                  _context76.next = 17;
                  break;

                case 16:
                  this.emit("event", p);

                case 17:
                case "end":
                  return _context76.stop();
              }
            }
          }, _callee76, this);
        }));

        function onMessage(_x83) {
          return _onMessage.apply(this, arguments);
        }

        return onMessage;
      }()
    }, {
      key: "state",
      get: function get() {
        if (this.socket) {
          return this.socket.readyState;
        } else {
          return SocketCryptoState.closed;
        }
      }
    }]);

    return Client;
  }(EventEmitter);
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
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
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

  function bufferToHexCodes(inputBuffer) {
    var inputOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var inputLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : inputBuffer.byteLength - inputOffset;
    var insertSpace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var result = "";

    var _iterator11 = _createForOfIteratorHelper(new Uint8Array(inputBuffer, inputOffset, inputLength)),
        _step11;

    try {
      for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
        var item = _step11.value;
        var str = item.toString(16).toUpperCase();
        if (str.length === 1) result += "0";
        result += str;
        if (insertSpace) result += " ";
      }
    } catch (err) {
      _iterator11.e(err);
    } finally {
      _iterator11.f();
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
    var result = 0;
    if (inputBuffer.length === 1) return inputBuffer[0];

    for (var i = inputBuffer.length - 1; i >= 0; i--) {
      result += inputBuffer[inputBuffer.length - 1 - i] * Math.pow(2, inputBase * i);
    }

    return result;
  }

  function utilToBase(value, base) {
    var reserved = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
    var internalReserved = reserved;
    var internalValue = value;
    var result = 0;
    var biggest = Math.pow(2, base);

    for (var i = 1; i < 8; i++) {
      if (value < biggest) {
        var retBuf = void 0;

        if (internalReserved < 0) {
          retBuf = new ArrayBuffer(i);
          result = i;
        } else {
          if (internalReserved < i) return new ArrayBuffer(0);
          retBuf = new ArrayBuffer(internalReserved);
          result = internalReserved;
        }

        var retView = new Uint8Array(retBuf);

        for (var j = i - 1; j >= 0; j--) {
          var basis = Math.pow(2, j * base);
          retView[result - j - 1] = Math.floor(internalValue / basis);
          internalValue -= retView[result - j - 1] * basis;
        }

        return retBuf;
      }

      biggest *= Math.pow(2, base);
    }

    return new ArrayBuffer(0);
  }

  function utilConcatBuf() {
    var outputLength = 0;
    var prevLength = 0;

    for (var _len4 = arguments.length, buffers = new Array(_len4), _key6 = 0; _key6 < _len4; _key6++) {
      buffers[_key6] = arguments[_key6];
    }

    for (var _i2 = 0, _buffers = buffers; _i2 < _buffers.length; _i2++) {
      var buffer = _buffers[_i2];
      outputLength += buffer.byteLength;
    }

    var retBuf = new ArrayBuffer(outputLength);
    var retView = new Uint8Array(retBuf);

    for (var _i3 = 0, _buffers2 = buffers; _i3 < _buffers2.length; _i3++) {
      var _buffer = _buffers2[_i3];
      retView.set(new Uint8Array(_buffer), prevLength);
      prevLength += _buffer.byteLength;
    }

    return retBuf;
  }

  function utilConcatView() {
    var outputLength = 0;
    var prevLength = 0;

    for (var _len5 = arguments.length, views = new Array(_len5), _key7 = 0; _key7 < _len5; _key7++) {
      views[_key7] = arguments[_key7];
    }

    for (var _i4 = 0, _views = views; _i4 < _views.length; _i4++) {
      var view = _views[_i4];
      outputLength += view.length;
    }

    var retBuf = new ArrayBuffer(outputLength);
    var retView = new Uint8Array(retBuf);

    for (var _i5 = 0, _views2 = views; _i5 < _views2.length; _i5++) {
      var _view = _views2[_i5];
      retView.set(_view, prevLength);
      prevLength += _view.length;
    }

    return retView;
  }

  function utilDecodeTC() {
    var buf = new Uint8Array(this.valueHex);

    if (this.valueHex.byteLength >= 2) {
      var condition1 = buf[0] === 0xFF && buf[1] & 0x80;
      var condition2 = buf[0] === 0x00 && (buf[1] & 0x80) === 0x00;
      if (condition1 || condition2) this.warnings.push("Needlessly long format");
    }

    var bigIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
    var bigIntView = new Uint8Array(bigIntBuffer);

    for (var i = 0; i < this.valueHex.byteLength; i++) {
      bigIntView[i] = 0;
    }

    bigIntView[0] = buf[0] & 0x80;
    var bigInt = utilFromBase(bigIntView, 8);
    var smallIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
    var smallIntView = new Uint8Array(smallIntBuffer);

    for (var j = 0; j < this.valueHex.byteLength; j++) {
      smallIntView[j] = buf[j];
    }

    smallIntView[0] &= 0x7F;
    var smallInt = utilFromBase(smallIntView, 8);
    return smallInt - bigInt;
  }

  function utilEncodeTC(value) {
    var modValue = value < 0 ? value * -1 : value;
    var bigInt = 128;

    for (var i = 1; i < 8; i++) {
      if (modValue <= bigInt) {
        if (value < 0) {
          var smallInt = bigInt - modValue;

          var _retBuf = utilToBase(smallInt, 8, i);

          var _retView = new Uint8Array(_retBuf);

          _retView[0] |= 0x80;
          return _retBuf;
        }

        var retBuf = utilToBase(modValue, 8, i);
        var retView = new Uint8Array(retBuf);

        if (retView[0] & 0x80) {
          var tempBuf = retBuf.slice(0);
          var tempView = new Uint8Array(tempBuf);
          retBuf = new ArrayBuffer(retBuf.byteLength + 1);
          retView = new Uint8Array(retBuf);

          for (var k = 0; k < tempBuf.byteLength; k++) {
            retView[k + 1] = tempView[k];
          }

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
    var view1 = new Uint8Array(inputBuffer1);
    var view2 = new Uint8Array(inputBuffer2);

    for (var i = 0; i < view1.length; i++) {
      if (view1[i] !== view2[i]) return false;
    }

    return true;
  }

  function padNumber(inputNumber, fullLength) {
    var str = inputNumber.toString(10);
    if (fullLength < str.length) return "";
    var dif = fullLength - str.length;
    var padding = new Array(dif);

    for (var i = 0; i < dif; i++) {
      padding[i] = "0";
    }

    var paddingString = padding.join("");
    return paddingString.concat(str);
  }

  var base64Template = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var base64UrlTemplate = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";

  function toBase64(input) {
    var useUrlTemplate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var skipPadding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var skipLeadingZeros = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var i = 0;
    var flag1 = 0;
    var flag2 = 0;
    var output = "";
    var template = useUrlTemplate ? base64UrlTemplate : base64Template;

    if (skipLeadingZeros) {
      var nonZeroPosition = 0;

      for (var _i6 = 0; _i6 < input.length; _i6++) {
        if (input.charCodeAt(_i6) !== 0) {
          nonZeroPosition = _i6;
          break;
        }
      }

      input = input.slice(nonZeroPosition);
    }

    while (i < input.length) {
      var chr1 = input.charCodeAt(i++);
      if (i >= input.length) flag1 = 1;
      var chr2 = input.charCodeAt(i++);
      if (i >= input.length) flag2 = 1;
      var chr3 = input.charCodeAt(i++);
      var enc1 = chr1 >> 2;
      var enc2 = (chr1 & 0x03) << 4 | chr2 >> 4;
      var enc3 = (chr2 & 0x0F) << 2 | chr3 >> 6;
      var enc4 = chr3 & 0x3F;

      if (flag1 === 1) {
        enc3 = enc4 = 64;
      } else {
        if (flag2 === 1) {
          enc4 = 64;
        }
      }

      if (skipPadding) {
        if (enc3 === 64) output += "".concat(template.charAt(enc1)).concat(template.charAt(enc2));else {
          if (enc4 === 64) output += "".concat(template.charAt(enc1)).concat(template.charAt(enc2)).concat(template.charAt(enc3));else output += "".concat(template.charAt(enc1)).concat(template.charAt(enc2)).concat(template.charAt(enc3)).concat(template.charAt(enc4));
        }
      } else output += "".concat(template.charAt(enc1)).concat(template.charAt(enc2)).concat(template.charAt(enc3)).concat(template.charAt(enc4));
    }

    return output;
  }

  function fromBase64(input) {
    var useUrlTemplate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var cutTailZeros = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var template = useUrlTemplate ? base64UrlTemplate : base64Template;

    function indexof(toSearch) {
      for (var _i7 = 0; _i7 < 64; _i7++) {
        if (template.charAt(_i7) === toSearch) return _i7;
      }

      return 64;
    }

    function test(incoming) {
      return incoming === 64 ? 0x00 : incoming;
    }

    var i = 0;
    var output = "";

    while (i < input.length) {
      var enc1 = indexof(input.charAt(i++));
      var enc2 = i >= input.length ? 0x00 : indexof(input.charAt(i++));
      var enc3 = i >= input.length ? 0x00 : indexof(input.charAt(i++));
      var enc4 = i >= input.length ? 0x00 : indexof(input.charAt(i++));
      var chr1 = test(enc1) << 2 | test(enc2) >> 4;
      var chr2 = (test(enc2) & 0x0F) << 4 | test(enc3) >> 2;
      var chr3 = (test(enc3) & 0x03) << 6 | test(enc4);
      output += String.fromCharCode(chr1);
      if (enc3 !== 64) output += String.fromCharCode(chr2);
      if (enc4 !== 64) output += String.fromCharCode(chr3);
    }

    if (cutTailZeros) {
      var outputLength = output.length;
      var nonZeroStart = -1;

      for (var _i8 = outputLength - 1; _i8 >= 0; _i8--) {
        if (output.charCodeAt(_i8) !== 0) {
          nonZeroStart = _i8;
          break;
        }
      }

      if (nonZeroStart !== -1) output = output.slice(0, nonZeroStart + 1);else output = "";
    }

    return output;
  }

  function arrayBufferToString(buffer) {
    var resultString = "";
    var view = new Uint8Array(buffer);

    var _iterator12 = _createForOfIteratorHelper(view),
        _step12;

    try {
      for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
        var element = _step12.value;
        resultString += String.fromCharCode(element);
      }
    } catch (err) {
      _iterator12.e(err);
    } finally {
      _iterator12.f();
    }

    return resultString;
  }

  function stringToArrayBuffer(str) {
    var stringLength = str.length;
    var resultBuffer = new ArrayBuffer(stringLength);
    var resultView = new Uint8Array(resultBuffer);

    for (var i = 0; i < stringLength; i++) {
      resultView[i] = str.charCodeAt(i);
    }

    return resultBuffer;
  }

  var log2 = Math.log(2);

  function nearestPowerOf2(length) {
    var base = Math.log(length) / log2;
    var floor = Math.floor(base);
    var round = Math.round(base);
    return floor === round ? floor : round;
  }

  function clearProps(object, propsArray) {
    var _iterator13 = _createForOfIteratorHelper(propsArray),
        _step13;

    try {
      for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
        var prop = _step13.value;
        delete object[prop];
      }
    } catch (err) {
      _iterator13.e(err);
    } finally {
      _iterator13.f();
    }
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
    var powers2 = [new Uint8Array([1])];
    var digitsString = "0123456789";

    var LocalBaseBlock = /*#__PURE__*/function () {
      function LocalBaseBlock() {
        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalBaseBlock);

        this.blockLength = (0, utils.getParametersValue)(parameters, "blockLength", 0);
        this.error = (0, utils.getParametersValue)(parameters, "error", "");
        this.warnings = (0, utils.getParametersValue)(parameters, "warnings", []);
        if ("valueBeforeDecode" in parameters) this.valueBeforeDecode = parameters.valueBeforeDecode.slice(0);else this.valueBeforeDecode = new ArrayBuffer(0);
      }

      _createClass(LocalBaseBlock, [{
        key: "toJSON",
        value: function toJSON() {
          return {
            blockName: this.constructor.blockName(),
            blockLength: this.blockLength,
            error: this.error,
            warnings: this.warnings,
            valueBeforeDecode: (0, utils.bufferToHexCodes)(this.valueBeforeDecode, 0, this.valueBeforeDecode.byteLength)
          };
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "baseBlock";
        }
      }]);

      return LocalBaseBlock;
    }();

    var HexBlock = function HexBlock(BaseClass) {
      return /*#__PURE__*/function (_BaseClass) {
        _inherits(LocalHexBlockMixin, _BaseClass);

        var _super83 = _createSuper(LocalHexBlockMixin);

        function LocalHexBlockMixin() {
          var _this25;

          var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          _classCallCheck(this, LocalHexBlockMixin);

          _this25 = _super83.call(this, parameters);
          _this25.isHexOnly = (0, utils.getParametersValue)(parameters, "isHexOnly", false);
          if ("valueHex" in parameters) _this25.valueHex = parameters.valueHex.slice(0);else _this25.valueHex = new ArrayBuffer(0);
          return _this25;
        }

        _createClass(LocalHexBlockMixin, [{
          key: "fromBER",
          value: function fromBER(inputBuffer, inputOffset, inputLength) {
            if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
            var intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);

            if (intBuffer.length === 0) {
              this.warnings.push("Zero buffer length");
              return inputOffset;
            }

            this.valueHex = inputBuffer.slice(inputOffset, inputOffset + inputLength);
            this.blockLength = inputLength;
            return inputOffset + inputLength;
          }
        }, {
          key: "toBER",
          value: function toBER() {
            var sizeOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (this.isHexOnly !== true) {
              this.error = "Flag \"isHexOnly\" is not set, abort";
              return new ArrayBuffer(0);
            }

            if (sizeOnly === true) return new ArrayBuffer(this.valueHex.byteLength);
            return this.valueHex.slice(0);
          }
        }, {
          key: "toJSON",
          value: function toJSON() {
            var object = {};

            try {
              object = _get(_getPrototypeOf(LocalHexBlockMixin.prototype), "toJSON", this).call(this);
            } catch (ex) {}

            object.blockName = this.constructor.blockName();
            object.isHexOnly = this.isHexOnly;
            object.valueHex = (0, utils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);
            return object;
          }
        }], [{
          key: "blockName",
          value: function blockName() {
            return "hexBlock";
          }
        }]);

        return LocalHexBlockMixin;
      }(BaseClass);
    };

    exports.HexBlock = HexBlock;

    var LocalIdentificationBlock = /*#__PURE__*/function (_HexBlock) {
      _inherits(LocalIdentificationBlock, _HexBlock);

      var _super84 = _createSuper(LocalIdentificationBlock);

      function LocalIdentificationBlock() {
        var _this26;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalIdentificationBlock);

        _this26 = _super84.call(this);

        if ("idBlock" in parameters) {
          _this26.isHexOnly = (0, utils.getParametersValue)(parameters.idBlock, "isHexOnly", false);
          _this26.valueHex = (0, utils.getParametersValue)(parameters.idBlock, "valueHex", new ArrayBuffer(0));
          _this26.tagClass = (0, utils.getParametersValue)(parameters.idBlock, "tagClass", -1);
          _this26.tagNumber = (0, utils.getParametersValue)(parameters.idBlock, "tagNumber", -1);
          _this26.isConstructed = (0, utils.getParametersValue)(parameters.idBlock, "isConstructed", false);
        } else {
          _this26.tagClass = -1;
          _this26.tagNumber = -1;
          _this26.isConstructed = false;
        }

        return _this26;
      }

      _createClass(LocalIdentificationBlock, [{
        key: "toBER",
        value: function toBER() {
          var sizeOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var firstOctet = 0;
          var retBuf;
          var retView;

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
              var number = this.tagNumber;
              number &= 0x1F;
              firstOctet |= number;
              retView[0] = firstOctet;
            }

            return retBuf;
          }

          if (this.isHexOnly === false) {
            var encodedBuf = (0, utils.utilToBase)(this.tagNumber, 7);
            var encodedView = new Uint8Array(encodedBuf);
            var size = encodedBuf.byteLength;
            retBuf = new ArrayBuffer(size + 1);
            retView = new Uint8Array(retBuf);
            retView[0] = firstOctet | 0x1F;

            if (!sizeOnly) {
              for (var i = 0; i < size - 1; i++) {
                retView[i + 1] = encodedView[i] | 0x80;
              }

              retView[size] = encodedView[size - 1];
            }

            return retBuf;
          }

          retBuf = new ArrayBuffer(this.valueHex.byteLength + 1);
          retView = new Uint8Array(retBuf);
          retView[0] = firstOctet | 0x1F;

          if (sizeOnly === false) {
            var curView = new Uint8Array(this.valueHex);

            for (var _i9 = 0; _i9 < curView.length - 1; _i9++) {
              retView[_i9 + 1] = curView[_i9] | 0x80;
            }

            retView[this.valueHex.byteLength] = curView[curView.length - 1];
          }

          return retBuf;
        }
      }, {
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
          var intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);

          if (intBuffer.length === 0) {
            this.error = "Zero buffer length";
            return -1;
          }

          var tagClassMask = intBuffer[0] & 0xC0;

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
          var tagNumberMask = intBuffer[0] & 0x1F;

          if (tagNumberMask !== 0x1F) {
            this.tagNumber = tagNumberMask;
            this.blockLength = 1;
          } else {
            var count = 1;
            this.valueHex = new ArrayBuffer(255);
            var tagNumberBufferMaxLength = 255;
            var intTagNumberBuffer = new Uint8Array(this.valueHex);

            while (intBuffer[count] & 0x80) {
              intTagNumberBuffer[count - 1] = intBuffer[count] & 0x7F;
              count++;

              if (count >= intBuffer.length) {
                this.error = "End of input reached before message was fully decoded";
                return -1;
              }

              if (count === tagNumberBufferMaxLength) {
                tagNumberBufferMaxLength += 255;

                var _tempBuffer = new ArrayBuffer(tagNumberBufferMaxLength);

                var _tempBufferView = new Uint8Array(_tempBuffer);

                for (var i = 0; i < intTagNumberBuffer.length; i++) {
                  _tempBufferView[i] = intTagNumberBuffer[i];
                }

                this.valueHex = new ArrayBuffer(tagNumberBufferMaxLength);
                intTagNumberBuffer = new Uint8Array(this.valueHex);
              }
            }

            this.blockLength = count + 1;
            intTagNumberBuffer[count - 1] = intBuffer[count] & 0x7F;
            var tempBuffer = new ArrayBuffer(count);
            var tempBufferView = new Uint8Array(tempBuffer);

            for (var _i10 = 0; _i10 < count; _i10++) {
              tempBufferView[_i10] = intTagNumberBuffer[_i10];
            }

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
      }, {
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalIdentificationBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.blockName = this.constructor.blockName();
          object.tagClass = this.tagClass;
          object.tagNumber = this.tagNumber;
          object.isConstructed = this.isConstructed;
          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "identificationBlock";
        }
      }]);

      return LocalIdentificationBlock;
    }(HexBlock(LocalBaseBlock));

    var LocalLengthBlock = /*#__PURE__*/function (_LocalBaseBlock) {
      _inherits(LocalLengthBlock, _LocalBaseBlock);

      var _super85 = _createSuper(LocalLengthBlock);

      function LocalLengthBlock() {
        var _this27;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalLengthBlock);

        _this27 = _super85.call(this);

        if ("lenBlock" in parameters) {
          _this27.isIndefiniteForm = (0, utils.getParametersValue)(parameters.lenBlock, "isIndefiniteForm", false);
          _this27.longFormUsed = (0, utils.getParametersValue)(parameters.lenBlock, "longFormUsed", false);
          _this27.length = (0, utils.getParametersValue)(parameters.lenBlock, "length", 0);
        } else {
          _this27.isIndefiniteForm = false;
          _this27.longFormUsed = false;
          _this27.length = 0;
        }

        return _this27;
      }

      _createClass(LocalLengthBlock, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
          var intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);

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

          var count = intBuffer[0] & 0x7F;

          if (count > 8) {
            this.error = "Too big integer";
            return -1;
          }

          if (count + 1 > intBuffer.length) {
            this.error = "End of input reached before message was fully decoded";
            return -1;
          }

          var lengthBufferView = new Uint8Array(count);

          for (var i = 0; i < count; i++) {
            lengthBufferView[i] = intBuffer[i + 1];
          }

          if (lengthBufferView[count - 1] === 0x00) this.warnings.push("Needlessly long encoded length");
          this.length = (0, utils.utilFromBase)(lengthBufferView, 8);
          if (this.longFormUsed && this.length <= 127) this.warnings.push("Unneccesary usage of long length form");
          this.blockLength = count + 1;
          return inputOffset + this.blockLength;
        }
      }, {
        key: "toBER",
        value: function toBER() {
          var sizeOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var retBuf;
          var retView;
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
            var encodedBuf = (0, utils.utilToBase)(this.length, 8);

            if (encodedBuf.byteLength > 127) {
              this.error = "Too big length";
              return new ArrayBuffer(0);
            }

            retBuf = new ArrayBuffer(encodedBuf.byteLength + 1);
            if (sizeOnly === true) return retBuf;
            var encodedView = new Uint8Array(encodedBuf);
            retView = new Uint8Array(retBuf);
            retView[0] = encodedBuf.byteLength | 0x80;

            for (var i = 0; i < encodedBuf.byteLength; i++) {
              retView[i + 1] = encodedView[i];
            }

            return retBuf;
          }

          retBuf = new ArrayBuffer(1);

          if (sizeOnly === false) {
            retView = new Uint8Array(retBuf);
            retView[0] = this.length;
          }

          return retBuf;
        }
      }, {
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalLengthBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.blockName = this.constructor.blockName();
          object.isIndefiniteForm = this.isIndefiniteForm;
          object.longFormUsed = this.longFormUsed;
          object.length = this.length;
          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "lengthBlock";
        }
      }]);

      return LocalLengthBlock;
    }(LocalBaseBlock);

    var ValueBlock = /*#__PURE__*/function (_LocalBaseBlock2) {
      _inherits(ValueBlock, _LocalBaseBlock2);

      var _super86 = _createSuper(ValueBlock);

      function ValueBlock() {
        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, ValueBlock);

        return _super86.call(this, parameters);
      }

      _createClass(ValueBlock, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          throw TypeError("User need to make a specific function in a class which extends \"ValueBlock\"");
        }
      }, {
        key: "toBER",
        value: function toBER() {
          throw TypeError("User need to make a specific function in a class which extends \"ValueBlock\"");
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "valueBlock";
        }
      }]);

      return ValueBlock;
    }(LocalBaseBlock);

    exports.ValueBlock = ValueBlock;

    var BaseBlock = /*#__PURE__*/function (_LocalBaseBlock3) {
      _inherits(BaseBlock, _LocalBaseBlock3);

      var _super87 = _createSuper(BaseBlock);

      function BaseBlock() {
        var _this28;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var valueBlockType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ValueBlock;

        _classCallCheck(this, BaseBlock);

        _this28 = _super87.call(this, parameters);
        if ("name" in parameters) _this28.name = parameters.name;
        if ("optional" in parameters) _this28.optional = parameters.optional;
        if ("primitiveSchema" in parameters) _this28.primitiveSchema = parameters.primitiveSchema;
        _this28.idBlock = new LocalIdentificationBlock(parameters);
        _this28.lenBlock = new LocalLengthBlock(parameters);
        _this28.valueBlock = new valueBlockType(parameters);
        return _this28;
      }

      _createClass(BaseBlock, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          var resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

          if (resultOffset === -1) {
            this.error = this.valueBlock.error;
            return resultOffset;
          }

          if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
          if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
          if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
          return resultOffset;
        }
      }, {
        key: "toBER",
        value: function toBER() {
          var sizeOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var retBuf;
          var idBlockBuf = this.idBlock.toBER(sizeOnly);
          var valueBlockSizeBuf = this.valueBlock.toBER(true);
          this.lenBlock.length = valueBlockSizeBuf.byteLength;
          var lenBlockBuf = this.lenBlock.toBER(sizeOnly);
          retBuf = (0, utils.utilConcatBuf)(idBlockBuf, lenBlockBuf);
          var valueBlockBuf;
          if (sizeOnly === false) valueBlockBuf = this.valueBlock.toBER(sizeOnly);else valueBlockBuf = new ArrayBuffer(this.lenBlock.length);
          retBuf = (0, utils.utilConcatBuf)(retBuf, valueBlockBuf);

          if (this.lenBlock.isIndefiniteForm === true) {
            var indefBuf = new ArrayBuffer(2);

            if (sizeOnly === false) {
              var indefView = new Uint8Array(indefBuf);
              indefView[0] = 0x00;
              indefView[1] = 0x00;
            }

            retBuf = (0, utils.utilConcatBuf)(retBuf, indefBuf);
          }

          return retBuf;
        }
      }, {
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(BaseBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.idBlock = this.idBlock.toJSON();
          object.lenBlock = this.lenBlock.toJSON();
          object.valueBlock = this.valueBlock.toJSON();
          if ("name" in this) object.name = this.name;
          if ("optional" in this) object.optional = this.optional;
          if ("primitiveSchema" in this) object.primitiveSchema = this.primitiveSchema.toJSON();
          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "BaseBlock";
        }
      }]);

      return BaseBlock;
    }(LocalBaseBlock);

    exports.BaseBlock = BaseBlock;

    var LocalPrimitiveValueBlock = /*#__PURE__*/function (_ValueBlock) {
      _inherits(LocalPrimitiveValueBlock, _ValueBlock);

      var _super88 = _createSuper(LocalPrimitiveValueBlock);

      function LocalPrimitiveValueBlock() {
        var _this29;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalPrimitiveValueBlock);

        _this29 = _super88.call(this, parameters);
        if ("valueHex" in parameters) _this29.valueHex = parameters.valueHex.slice(0);else _this29.valueHex = new ArrayBuffer(0);
        _this29.isHexOnly = (0, utils.getParametersValue)(parameters, "isHexOnly", true);
        return _this29;
      }

      _createClass(LocalPrimitiveValueBlock, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
          var intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);

          if (intBuffer.length === 0) {
            this.warnings.push("Zero buffer length");
            return inputOffset;
          }

          this.valueHex = new ArrayBuffer(intBuffer.length);
          var valueHexView = new Uint8Array(this.valueHex);

          for (var i = 0; i < intBuffer.length; i++) {
            valueHexView[i] = intBuffer[i];
          }

          this.blockLength = inputLength;
          return inputOffset + inputLength;
        }
      }, {
        key: "toBER",
        value: function toBER() {
          return this.valueHex.slice(0);
        }
      }, {
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalPrimitiveValueBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.valueHex = (0, utils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);
          object.isHexOnly = this.isHexOnly;
          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "PrimitiveValueBlock";
        }
      }]);

      return LocalPrimitiveValueBlock;
    }(ValueBlock);

    var Primitive = /*#__PURE__*/function (_BaseBlock) {
      _inherits(Primitive, _BaseBlock);

      var _super89 = _createSuper(Primitive);

      function Primitive() {
        var _this30;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Primitive);

        _this30 = _super89.call(this, parameters, LocalPrimitiveValueBlock);
        _this30.idBlock.isConstructed = false;
        return _this30;
      }

      _createClass(Primitive, null, [{
        key: "blockName",
        value: function blockName() {
          return "PRIMITIVE";
        }
      }]);

      return Primitive;
    }(BaseBlock);

    exports.Primitive = Primitive;

    var LocalConstructedValueBlock = /*#__PURE__*/function (_ValueBlock2) {
      _inherits(LocalConstructedValueBlock, _ValueBlock2);

      var _super90 = _createSuper(LocalConstructedValueBlock);

      function LocalConstructedValueBlock() {
        var _this31;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalConstructedValueBlock);

        _this31 = _super90.call(this, parameters);
        _this31.value = (0, utils.getParametersValue)(parameters, "value", []);
        _this31.isIndefiniteForm = (0, utils.getParametersValue)(parameters, "isIndefiniteForm", false);
        return _this31;
      }

      _createClass(LocalConstructedValueBlock, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          var initialOffset = inputOffset;
          var initialLength = inputLength;
          if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
          var intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);

          if (intBuffer.length === 0) {
            this.warnings.push("Zero buffer length");
            return inputOffset;
          }

          function checkLen(indefiniteLength, length) {
            if (indefiniteLength === true) return 1;
            return length;
          }

          var currentOffset = inputOffset;

          while (checkLen(this.isIndefiniteForm, inputLength) > 0) {
            var returnObject = LocalFromBER(inputBuffer, currentOffset, inputLength);

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
      }, {
        key: "toBER",
        value: function toBER() {
          var sizeOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var retBuf = new ArrayBuffer(0);

          for (var i = 0; i < this.value.length; i++) {
            var valueBuf = this.value[i].toBER(sizeOnly);
            retBuf = (0, utils.utilConcatBuf)(retBuf, valueBuf);
          }

          return retBuf;
        }
      }, {
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalConstructedValueBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.isIndefiniteForm = this.isIndefiniteForm;
          object.value = [];

          for (var i = 0; i < this.value.length; i++) {
            object.value.push(this.value[i].toJSON());
          }

          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "ConstructedValueBlock";
        }
      }]);

      return LocalConstructedValueBlock;
    }(ValueBlock);

    var Constructed = /*#__PURE__*/function (_BaseBlock2) {
      _inherits(Constructed, _BaseBlock2);

      var _super91 = _createSuper(Constructed);

      function Constructed() {
        var _this32;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Constructed);

        _this32 = _super91.call(this, parameters, LocalConstructedValueBlock);
        _this32.idBlock.isConstructed = true;
        return _this32;
      }

      _createClass(Constructed, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
          var resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

          if (resultOffset === -1) {
            this.error = this.valueBlock.error;
            return resultOffset;
          }

          if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
          if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
          if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
          return resultOffset;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "CONSTRUCTED";
        }
      }]);

      return Constructed;
    }(BaseBlock);

    exports.Constructed = Constructed;

    var LocalEndOfContentValueBlock = /*#__PURE__*/function (_ValueBlock3) {
      _inherits(LocalEndOfContentValueBlock, _ValueBlock3);

      var _super92 = _createSuper(LocalEndOfContentValueBlock);

      function LocalEndOfContentValueBlock() {
        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalEndOfContentValueBlock);

        return _super92.call(this, parameters);
      }

      _createClass(LocalEndOfContentValueBlock, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          return inputOffset;
        }
      }, {
        key: "toBER",
        value: function toBER() {
          return new ArrayBuffer(0);
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "EndOfContentValueBlock";
        }
      }]);

      return LocalEndOfContentValueBlock;
    }(ValueBlock);

    var EndOfContent = /*#__PURE__*/function (_BaseBlock3) {
      _inherits(EndOfContent, _BaseBlock3);

      var _super93 = _createSuper(EndOfContent);

      function EndOfContent() {
        var _this33;

        var paramaters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, EndOfContent);

        _this33 = _super93.call(this, paramaters, LocalEndOfContentValueBlock);
        _this33.idBlock.tagClass = 1;
        _this33.idBlock.tagNumber = 0;
        return _this33;
      }

      _createClass(EndOfContent, null, [{
        key: "blockName",
        value: function blockName() {
          return "EndOfContent";
        }
      }]);

      return EndOfContent;
    }(BaseBlock);

    exports.EndOfContent = EndOfContent;

    var LocalBooleanValueBlock = /*#__PURE__*/function (_ValueBlock4) {
      _inherits(LocalBooleanValueBlock, _ValueBlock4);

      var _super94 = _createSuper(LocalBooleanValueBlock);

      function LocalBooleanValueBlock() {
        var _this34;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalBooleanValueBlock);

        _this34 = _super94.call(this, parameters);
        _this34.value = (0, utils.getParametersValue)(parameters, "value", false);
        _this34.isHexOnly = (0, utils.getParametersValue)(parameters, "isHexOnly", false);
        if ("valueHex" in parameters) _this34.valueHex = parameters.valueHex.slice(0);else {
          _this34.valueHex = new ArrayBuffer(1);

          if (_this34.value === true) {
            var view = new Uint8Array(_this34.valueHex);
            view[0] = 0xFF;
          }
        }
        return _this34;
      }

      _createClass(LocalBooleanValueBlock, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
          var intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);
          if (inputLength > 1) this.warnings.push("Boolean value encoded in more then 1 octet");
          this.isHexOnly = true;
          this.valueHex = new ArrayBuffer(intBuffer.length);
          var view = new Uint8Array(this.valueHex);

          for (var i = 0; i < intBuffer.length; i++) {
            view[i] = intBuffer[i];
          }

          if (utils.utilDecodeTC.call(this) !== 0) this.value = true;else this.value = false;
          this.blockLength = inputLength;
          return inputOffset + inputLength;
        }
      }, {
        key: "toBER",
        value: function toBER() {
          return this.valueHex;
        }
      }, {
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalBooleanValueBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.value = this.value;
          object.isHexOnly = this.isHexOnly;
          object.valueHex = (0, utils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);
          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "BooleanValueBlock";
        }
      }]);

      return LocalBooleanValueBlock;
    }(ValueBlock);

    var Boolean = /*#__PURE__*/function (_BaseBlock4) {
      _inherits(Boolean, _BaseBlock4);

      var _super95 = _createSuper(Boolean);

      function Boolean() {
        var _this35;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Boolean);

        _this35 = _super95.call(this, parameters, LocalBooleanValueBlock);
        _this35.idBlock.tagClass = 1;
        _this35.idBlock.tagNumber = 1;
        return _this35;
      }

      _createClass(Boolean, null, [{
        key: "blockName",
        value: function blockName() {
          return "Boolean";
        }
      }]);

      return Boolean;
    }(BaseBlock);

    exports.Boolean = Boolean;

    var Sequence = /*#__PURE__*/function (_Constructed) {
      _inherits(Sequence, _Constructed);

      var _super96 = _createSuper(Sequence);

      function Sequence() {
        var _this36;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Sequence);

        _this36 = _super96.call(this, parameters);
        _this36.idBlock.tagClass = 1;
        _this36.idBlock.tagNumber = 16;
        return _this36;
      }

      _createClass(Sequence, null, [{
        key: "blockName",
        value: function blockName() {
          return "Sequence";
        }
      }]);

      return Sequence;
    }(Constructed);

    exports.Sequence = Sequence;

    var Set = /*#__PURE__*/function (_Constructed2) {
      _inherits(Set, _Constructed2);

      var _super97 = _createSuper(Set);

      function Set() {
        var _this37;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Set);

        _this37 = _super97.call(this, parameters);
        _this37.idBlock.tagClass = 1;
        _this37.idBlock.tagNumber = 17;
        return _this37;
      }

      _createClass(Set, null, [{
        key: "blockName",
        value: function blockName() {
          return "Set";
        }
      }]);

      return Set;
    }(Constructed);

    exports.Set = Set;

    var Null = /*#__PURE__*/function (_BaseBlock5) {
      _inherits(Null, _BaseBlock5);

      var _super98 = _createSuper(Null);

      function Null() {
        var _this38;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Null);

        _this38 = _super98.call(this, parameters, LocalBaseBlock);
        _this38.idBlock.tagClass = 1;
        _this38.idBlock.tagNumber = 5;
        return _this38;
      }

      _createClass(Null, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
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
      }, {
        key: "toBER",
        value: function toBER() {
          var sizeOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var retBuf = new ArrayBuffer(2);
          if (sizeOnly === true) return retBuf;
          var retView = new Uint8Array(retBuf);
          retView[0] = 0x05;
          retView[1] = 0x00;
          return retBuf;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "Null";
        }
      }]);

      return Null;
    }(BaseBlock);

    exports.Null = Null;

    var LocalOctetStringValueBlock = /*#__PURE__*/function (_HexBlock2) {
      _inherits(LocalOctetStringValueBlock, _HexBlock2);

      var _super99 = _createSuper(LocalOctetStringValueBlock);

      function LocalOctetStringValueBlock() {
        var _this39;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalOctetStringValueBlock);

        _this39 = _super99.call(this, parameters);
        _this39.isConstructed = (0, utils.getParametersValue)(parameters, "isConstructed", false);
        return _this39;
      }

      _createClass(LocalOctetStringValueBlock, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          var resultOffset = 0;

          if (this.isConstructed === true) {
            this.isHexOnly = false;
            resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
            if (resultOffset === -1) return resultOffset;

            for (var i = 0; i < this.value.length; i++) {
              var currentBlockName = this.value[i].constructor.blockName();

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
            resultOffset = _get(_getPrototypeOf(LocalOctetStringValueBlock.prototype), "fromBER", this).call(this, inputBuffer, inputOffset, inputLength);
            this.blockLength = inputLength;
          }

          return resultOffset;
        }
      }, {
        key: "toBER",
        value: function toBER() {
          var sizeOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          if (this.isConstructed === true) return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly);
          var retBuf = new ArrayBuffer(this.valueHex.byteLength);
          if (sizeOnly === true) return retBuf;
          if (this.valueHex.byteLength === 0) return retBuf;
          retBuf = this.valueHex.slice(0);
          return retBuf;
        }
      }, {
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalOctetStringValueBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.isConstructed = this.isConstructed;
          object.isHexOnly = this.isHexOnly;
          object.valueHex = (0, utils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);
          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "OctetStringValueBlock";
        }
      }]);

      return LocalOctetStringValueBlock;
    }(HexBlock(LocalConstructedValueBlock));

    var OctetString = /*#__PURE__*/function (_BaseBlock6) {
      _inherits(OctetString, _BaseBlock6);

      var _super100 = _createSuper(OctetString);

      function OctetString() {
        var _this40;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, OctetString);

        _this40 = _super100.call(this, parameters, LocalOctetStringValueBlock);
        _this40.idBlock.tagClass = 1;
        _this40.idBlock.tagNumber = 4;
        return _this40;
      }

      _createClass(OctetString, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          this.valueBlock.isConstructed = this.idBlock.isConstructed;
          this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;

          if (inputLength === 0) {
            if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
            if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
            return inputOffset;
          }

          return _get(_getPrototypeOf(OctetString.prototype), "fromBER", this).call(this, inputBuffer, inputOffset, inputLength);
        }
      }, {
        key: "isEqual",
        value: function isEqual(octetString) {
          if (octetString instanceof OctetString === false) return false;
          if (JSON.stringify(this) !== JSON.stringify(octetString)) return false;
          return true;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "OctetString";
        }
      }]);

      return OctetString;
    }(BaseBlock);

    exports.OctetString = OctetString;

    var LocalBitStringValueBlock = /*#__PURE__*/function (_HexBlock3) {
      _inherits(LocalBitStringValueBlock, _HexBlock3);

      var _super101 = _createSuper(LocalBitStringValueBlock);

      function LocalBitStringValueBlock() {
        var _this41;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalBitStringValueBlock);

        _this41 = _super101.call(this, parameters);
        _this41.unusedBits = (0, utils.getParametersValue)(parameters, "unusedBits", 0);
        _this41.isConstructed = (0, utils.getParametersValue)(parameters, "isConstructed", false);
        _this41.blockLength = _this41.valueHex.byteLength;
        return _this41;
      }

      _createClass(LocalBitStringValueBlock, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          if (inputLength === 0) return inputOffset;
          var resultOffset = -1;

          if (this.isConstructed === true) {
            resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
            if (resultOffset === -1) return resultOffset;

            for (var i = 0; i < this.value.length; i++) {
              var currentBlockName = this.value[i].constructor.blockName();

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
          var intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);
          this.unusedBits = intBuffer[0];

          if (this.unusedBits > 7) {
            this.error = "Unused bits for BitString must be in range 0-7";
            return -1;
          }

          this.valueHex = new ArrayBuffer(intBuffer.length - 1);
          var view = new Uint8Array(this.valueHex);

          for (var _i11 = 0; _i11 < inputLength - 1; _i11++) {
            view[_i11] = intBuffer[_i11 + 1];
          }

          this.blockLength = intBuffer.length;
          return inputOffset + inputLength;
        }
      }, {
        key: "toBER",
        value: function toBER() {
          var sizeOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          if (this.isConstructed === true) return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly);
          if (sizeOnly === true) return new ArrayBuffer(this.valueHex.byteLength + 1);
          if (this.valueHex.byteLength === 0) return new ArrayBuffer(0);
          var curView = new Uint8Array(this.valueHex);
          var retBuf = new ArrayBuffer(this.valueHex.byteLength + 1);
          var retView = new Uint8Array(retBuf);
          retView[0] = this.unusedBits;

          for (var i = 0; i < this.valueHex.byteLength; i++) {
            retView[i + 1] = curView[i];
          }

          return retBuf;
        }
      }, {
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalBitStringValueBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.unusedBits = this.unusedBits;
          object.isConstructed = this.isConstructed;
          object.isHexOnly = this.isHexOnly;
          object.valueHex = (0, utils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);
          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "BitStringValueBlock";
        }
      }]);

      return LocalBitStringValueBlock;
    }(HexBlock(LocalConstructedValueBlock));

    var BitString = /*#__PURE__*/function (_BaseBlock7) {
      _inherits(BitString, _BaseBlock7);

      var _super102 = _createSuper(BitString);

      function BitString() {
        var _this42;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, BitString);

        _this42 = _super102.call(this, parameters, LocalBitStringValueBlock);
        _this42.idBlock.tagClass = 1;
        _this42.idBlock.tagNumber = 3;
        return _this42;
      }

      _createClass(BitString, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          if (inputLength === 0) return inputOffset;
          this.valueBlock.isConstructed = this.idBlock.isConstructed;
          this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
          return _get(_getPrototypeOf(BitString.prototype), "fromBER", this).call(this, inputBuffer, inputOffset, inputLength);
        }
      }, {
        key: "isEqual",
        value: function isEqual(bitString) {
          if (bitString instanceof BitString === false) return false;
          if (JSON.stringify(this) !== JSON.stringify(bitString)) return false;
          return true;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "BitString";
        }
      }]);

      return BitString;
    }(BaseBlock);

    exports.BitString = BitString;

    var LocalIntegerValueBlock = /*#__PURE__*/function (_HexBlock4) {
      _inherits(LocalIntegerValueBlock, _HexBlock4);

      var _super103 = _createSuper(LocalIntegerValueBlock);

      function LocalIntegerValueBlock() {
        var _this43;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalIntegerValueBlock);

        _this43 = _super103.call(this, parameters);
        if ("value" in parameters) _this43.valueDec = parameters.value;
        return _this43;
      }

      _createClass(LocalIntegerValueBlock, [{
        key: "fromDER",
        value: function fromDER(inputBuffer, inputOffset, inputLength) {
          var expectedLength = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
          var offset = this.fromBER(inputBuffer, inputOffset, inputLength);
          if (offset === -1) return offset;
          var view = new Uint8Array(this._valueHex);

          if (view[0] === 0x00 && (view[1] & 0x80) !== 0) {
            var updatedValueHex = new ArrayBuffer(this._valueHex.byteLength - 1);
            var updatedView = new Uint8Array(updatedValueHex);
            updatedView.set(new Uint8Array(this._valueHex, 1, this._valueHex.byteLength - 1));
            this._valueHex = updatedValueHex.slice(0);
          } else {
            if (expectedLength !== 0) {
              if (this._valueHex.byteLength < expectedLength) {
                if (expectedLength - this._valueHex.byteLength > 1) expectedLength = this._valueHex.byteLength + 1;

                var _updatedValueHex = new ArrayBuffer(expectedLength);

                var _updatedView = new Uint8Array(_updatedValueHex);

                _updatedView.set(view, expectedLength - this._valueHex.byteLength);

                this._valueHex = _updatedValueHex.slice(0);
              }
            }
          }

          return offset;
        }
      }, {
        key: "toDER",
        value: function toDER() {
          var sizeOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var view = new Uint8Array(this._valueHex);

          switch (true) {
            case (view[0] & 0x80) !== 0:
              {
                var updatedValueHex = new ArrayBuffer(this._valueHex.byteLength + 1);
                var updatedView = new Uint8Array(updatedValueHex);
                updatedView[0] = 0x00;
                updatedView.set(view, 1);
                this._valueHex = updatedValueHex.slice(0);
              }
              break;

            case view[0] === 0x00 && (view[1] & 0x80) === 0:
              {
                var _updatedValueHex2 = new ArrayBuffer(this._valueHex.byteLength - 1);

                var _updatedView2 = new Uint8Array(_updatedValueHex2);

                _updatedView2.set(new Uint8Array(this._valueHex, 1, this._valueHex.byteLength - 1));

                this._valueHex = _updatedValueHex2.slice(0);
              }
              break;
          }

          return this.toBER(sizeOnly);
        }
      }, {
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          var resultOffset = _get(_getPrototypeOf(LocalIntegerValueBlock.prototype), "fromBER", this).call(this, inputBuffer, inputOffset, inputLength);

          if (resultOffset === -1) return resultOffset;
          this.blockLength = inputLength;
          return inputOffset + inputLength;
        }
      }, {
        key: "toBER",
        value: function toBER() {
          return this.valueHex.slice(0);
        }
      }, {
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalIntegerValueBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.valueDec = this.valueDec;
          return object;
        }
      }, {
        key: "toString",
        value: function toString() {
          function viewAdd(first, second) {
            var c = new Uint8Array([0]);
            var firstView = new Uint8Array(first);
            var secondView = new Uint8Array(second);
            var firstViewCopy = firstView.slice(0);
            var firstViewCopyLength = firstViewCopy.length - 1;
            var secondViewCopy = secondView.slice(0);
            var secondViewCopyLength = secondViewCopy.length - 1;
            var value = 0;
            var max = secondViewCopyLength < firstViewCopyLength ? firstViewCopyLength : secondViewCopyLength;
            var counter = 0;

            for (var i = max; i >= 0; i--, counter++) {
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
              for (var p = powers2.length; p <= n; p++) {
                var c = new Uint8Array([0]);

                var _digits = powers2[p - 1].slice(0);

                for (var i = _digits.length - 1; i >= 0; i--) {
                  var newValue = new Uint8Array([(_digits[i] << 1) + c[0]]);
                  c[0] = newValue[0] / 10;
                  _digits[i] = newValue[0] % 10;
                }

                if (c[0] > 0) _digits = (0, utils.utilConcatView)(c, _digits);
                powers2.push(_digits);
              }
            }

            return powers2[n];
          }

          function viewSub(first, second) {
            var b = 0;
            var firstView = new Uint8Array(first);
            var secondView = new Uint8Array(second);
            var firstViewCopy = firstView.slice(0);
            var firstViewCopyLength = firstViewCopy.length - 1;
            var secondViewCopy = secondView.slice(0);
            var secondViewCopyLength = secondViewCopy.length - 1;
            var value;
            var counter = 0;

            for (var i = secondViewCopyLength; i >= 0; i--, counter++) {
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
              for (var _i12 = firstViewCopyLength - secondViewCopyLength + 1; _i12 >= 0; _i12--, counter++) {
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

          var firstBit = this._valueHex.byteLength * 8 - 1;
          var digits = new Uint8Array(this._valueHex.byteLength * 8 / 3);
          var bitNumber = 0;
          var currentByte;
          var asn1View = new Uint8Array(this._valueHex);
          var result = "";
          var flag = false;

          for (var byteNumber = this._valueHex.byteLength - 1; byteNumber >= 0; byteNumber--) {
            currentByte = asn1View[byteNumber];

            for (var i = 0; i < 8; i++) {
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

          for (var _i13 = 0; _i13 < digits.length; _i13++) {
            if (digits[_i13]) flag = true;
            if (flag) result += digitsString.charAt(digits[_i13]);
          }

          if (flag === false) result += digitsString.charAt(0);
          return result;
        }
      }, {
        key: "valueHex",
        set: function set(_value) {
          this._valueHex = _value.slice(0);

          if (_value.byteLength >= 4) {
            this.warnings.push("Too big Integer for decoding, hex only");
            this.isHexOnly = true;
            this._valueDec = 0;
          } else {
            this.isHexOnly = false;
            if (_value.byteLength > 0) this._valueDec = utils.utilDecodeTC.call(this);
          }
        },
        get: function get() {
          return this._valueHex;
        }
      }, {
        key: "valueDec",
        set: function set(_value) {
          this._valueDec = _value;
          this.isHexOnly = false;
          this._valueHex = (0, utils.utilEncodeTC)(_value);
        },
        get: function get() {
          return this._valueDec;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "IntegerValueBlock";
        }
      }]);

      return LocalIntegerValueBlock;
    }(HexBlock(ValueBlock));

    var Integer = /*#__PURE__*/function (_BaseBlock8) {
      _inherits(Integer, _BaseBlock8);

      var _super104 = _createSuper(Integer);

      function Integer() {
        var _this44;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Integer);

        _this44 = _super104.call(this, parameters, LocalIntegerValueBlock);
        _this44.idBlock.tagClass = 1;
        _this44.idBlock.tagNumber = 2;
        return _this44;
      }

      _createClass(Integer, [{
        key: "isEqual",
        value: function isEqual(otherValue) {
          if (otherValue instanceof Integer) {
            if (this.valueBlock.isHexOnly && otherValue.valueBlock.isHexOnly) return (0, utils.isEqualBuffer)(this.valueBlock.valueHex, otherValue.valueBlock.valueHex);
            if (this.valueBlock.isHexOnly === otherValue.valueBlock.isHexOnly) return this.valueBlock.valueDec === otherValue.valueBlock.valueDec;
            return false;
          }

          if (otherValue instanceof ArrayBuffer) return (0, utils.isEqualBuffer)(this.valueBlock.valueHex, otherValue);
          return false;
        }
      }, {
        key: "convertToDER",
        value: function convertToDER() {
          var integer = new Integer({
            valueHex: this.valueBlock.valueHex
          });
          integer.valueBlock.toDER();
          return integer;
        }
      }, {
        key: "convertFromDER",
        value: function convertFromDER() {
          var expectedLength = this.valueBlock.valueHex.byteLength % 2 ? this.valueBlock.valueHex.byteLength + 1 : this.valueBlock.valueHex.byteLength;
          var integer = new Integer({
            valueHex: this.valueBlock.valueHex
          });
          integer.valueBlock.fromDER(integer.valueBlock.valueHex, 0, integer.valueBlock.valueHex.byteLength, expectedLength);
          return integer;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "Integer";
        }
      }]);

      return Integer;
    }(BaseBlock);

    exports.Integer = Integer;

    var Enumerated = /*#__PURE__*/function (_Integer) {
      _inherits(Enumerated, _Integer);

      var _super105 = _createSuper(Enumerated);

      function Enumerated() {
        var _this45;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Enumerated);

        _this45 = _super105.call(this, parameters);
        _this45.idBlock.tagClass = 1;
        _this45.idBlock.tagNumber = 10;
        return _this45;
      }

      _createClass(Enumerated, null, [{
        key: "blockName",
        value: function blockName() {
          return "Enumerated";
        }
      }]);

      return Enumerated;
    }(Integer);

    exports.Enumerated = Enumerated;

    var LocalSidValueBlock = /*#__PURE__*/function (_HexBlock5) {
      _inherits(LocalSidValueBlock, _HexBlock5);

      var _super106 = _createSuper(LocalSidValueBlock);

      function LocalSidValueBlock() {
        var _this46;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalSidValueBlock);

        _this46 = _super106.call(this, parameters);
        _this46.valueDec = (0, utils.getParametersValue)(parameters, "valueDec", -1);
        _this46.isFirstSid = (0, utils.getParametersValue)(parameters, "isFirstSid", false);
        return _this46;
      }

      _createClass(LocalSidValueBlock, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          if (inputLength === 0) return inputOffset;
          if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
          var intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);
          this.valueHex = new ArrayBuffer(inputLength);
          var view = new Uint8Array(this.valueHex);

          for (var i = 0; i < inputLength; i++) {
            view[i] = intBuffer[i] & 0x7F;
            this.blockLength++;
            if ((intBuffer[i] & 0x80) === 0x00) break;
          }

          var tempValueHex = new ArrayBuffer(this.blockLength);
          var tempView = new Uint8Array(tempValueHex);

          for (var _i14 = 0; _i14 < this.blockLength; _i14++) {
            tempView[_i14] = view[_i14];
          }

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
      }, {
        key: "toBER",
        value: function toBER() {
          var sizeOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var retBuf;
          var retView;

          if (this.isHexOnly) {
            if (sizeOnly === true) return new ArrayBuffer(this.valueHex.byteLength);
            var curView = new Uint8Array(this.valueHex);
            retBuf = new ArrayBuffer(this.blockLength);
            retView = new Uint8Array(retBuf);

            for (var i = 0; i < this.blockLength - 1; i++) {
              retView[i] = curView[i] | 0x80;
            }

            retView[this.blockLength - 1] = curView[this.blockLength - 1];
            return retBuf;
          }

          var encodedBuf = (0, utils.utilToBase)(this.valueDec, 7);

          if (encodedBuf.byteLength === 0) {
            this.error = "Error during encoding SID value";
            return new ArrayBuffer(0);
          }

          retBuf = new ArrayBuffer(encodedBuf.byteLength);

          if (sizeOnly === false) {
            var encodedView = new Uint8Array(encodedBuf);
            retView = new Uint8Array(retBuf);

            for (var _i15 = 0; _i15 < encodedBuf.byteLength - 1; _i15++) {
              retView[_i15] = encodedView[_i15] | 0x80;
            }

            retView[encodedBuf.byteLength - 1] = encodedView[encodedBuf.byteLength - 1];
          }

          return retBuf;
        }
      }, {
        key: "toString",
        value: function toString() {
          var result = "";
          if (this.isHexOnly === true) result = (0, utils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);else {
            if (this.isFirstSid) {
              var sidValue = this.valueDec;
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
      }, {
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalSidValueBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.valueDec = this.valueDec;
          object.isFirstSid = this.isFirstSid;
          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "sidBlock";
        }
      }]);

      return LocalSidValueBlock;
    }(HexBlock(LocalBaseBlock));

    var LocalObjectIdentifierValueBlock = /*#__PURE__*/function (_ValueBlock5) {
      _inherits(LocalObjectIdentifierValueBlock, _ValueBlock5);

      var _super107 = _createSuper(LocalObjectIdentifierValueBlock);

      function LocalObjectIdentifierValueBlock() {
        var _this47;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalObjectIdentifierValueBlock);

        _this47 = _super107.call(this, parameters);

        _this47.fromString((0, utils.getParametersValue)(parameters, "value", ""));

        return _this47;
      }

      _createClass(LocalObjectIdentifierValueBlock, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          var resultOffset = inputOffset;

          while (inputLength > 0) {
            var sidBlock = new LocalSidValueBlock();
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
      }, {
        key: "toBER",
        value: function toBER() {
          var sizeOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var retBuf = new ArrayBuffer(0);

          for (var i = 0; i < this.value.length; i++) {
            var valueBuf = this.value[i].toBER(sizeOnly);

            if (valueBuf.byteLength === 0) {
              this.error = this.value[i].error;
              return new ArrayBuffer(0);
            }

            retBuf = (0, utils.utilConcatBuf)(retBuf, valueBuf);
          }

          return retBuf;
        }
      }, {
        key: "fromString",
        value: function fromString(string) {
          this.value = [];
          var pos1 = 0;
          var pos2 = 0;
          var sid = "";
          var flag = false;

          do {
            pos2 = string.indexOf(".", pos1);
            if (pos2 === -1) sid = string.substr(pos1);else sid = string.substr(pos1, pos2 - pos1);
            pos1 = pos2 + 1;

            if (flag) {
              var sidBlock = this.value[0];
              var plus = 0;

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

              var parsedSID = parseInt(sid, 10);
              if (isNaN(parsedSID)) return true;
              sidBlock.valueDec = parsedSID + plus;
              flag = false;
            } else {
              var _sidBlock = new LocalSidValueBlock();

              _sidBlock.valueDec = parseInt(sid, 10);
              if (isNaN(_sidBlock.valueDec)) return true;

              if (this.value.length === 0) {
                _sidBlock.isFirstSid = true;
                flag = true;
              }

              this.value.push(_sidBlock);
            }
          } while (pos2 !== -1);

          return true;
        }
      }, {
        key: "toString",
        value: function toString() {
          var result = "";
          var isHexOnly = false;

          for (var i = 0; i < this.value.length; i++) {
            isHexOnly = this.value[i].isHexOnly;
            var sidStr = this.value[i].toString();
            if (i !== 0) result = "".concat(result, ".");

            if (isHexOnly) {
              sidStr = "{".concat(sidStr, "}");
              if (this.value[i].isFirstSid) result = "2.{".concat(sidStr, " - 80}");else result += sidStr;
            } else result += sidStr;
          }

          return result;
        }
      }, {
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalObjectIdentifierValueBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.value = this.toString();
          object.sidArray = [];

          for (var i = 0; i < this.value.length; i++) {
            object.sidArray.push(this.value[i].toJSON());
          }

          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "ObjectIdentifierValueBlock";
        }
      }]);

      return LocalObjectIdentifierValueBlock;
    }(ValueBlock);

    var ObjectIdentifier = /*#__PURE__*/function (_BaseBlock9) {
      _inherits(ObjectIdentifier, _BaseBlock9);

      var _super108 = _createSuper(ObjectIdentifier);

      function ObjectIdentifier() {
        var _this48;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, ObjectIdentifier);

        _this48 = _super108.call(this, parameters, LocalObjectIdentifierValueBlock);
        _this48.idBlock.tagClass = 1;
        _this48.idBlock.tagNumber = 6;
        return _this48;
      }

      _createClass(ObjectIdentifier, null, [{
        key: "blockName",
        value: function blockName() {
          return "ObjectIdentifier";
        }
      }]);

      return ObjectIdentifier;
    }(BaseBlock);

    exports.ObjectIdentifier = ObjectIdentifier;

    var LocalUtf8StringValueBlock = /*#__PURE__*/function (_HexBlock6) {
      _inherits(LocalUtf8StringValueBlock, _HexBlock6);

      var _super109 = _createSuper(LocalUtf8StringValueBlock);

      function LocalUtf8StringValueBlock() {
        var _this49;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalUtf8StringValueBlock);

        _this49 = _super109.call(this, parameters);
        _this49.isHexOnly = true;
        _this49.value = "";
        return _this49;
      }

      _createClass(LocalUtf8StringValueBlock, [{
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalUtf8StringValueBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.value = this.value;
          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "Utf8StringValueBlock";
        }
      }]);

      return LocalUtf8StringValueBlock;
    }(HexBlock(LocalBaseBlock));

    var Utf8String = /*#__PURE__*/function (_BaseBlock10) {
      _inherits(Utf8String, _BaseBlock10);

      var _super110 = _createSuper(Utf8String);

      function Utf8String() {
        var _this50;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Utf8String);

        _this50 = _super110.call(this, parameters, LocalUtf8StringValueBlock);
        if ("value" in parameters) _this50.fromString(parameters.value);
        _this50.idBlock.tagClass = 1;
        _this50.idBlock.tagNumber = 12;
        return _this50;
      }

      _createClass(Utf8String, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          var resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

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
      }, {
        key: "fromBuffer",
        value: function fromBuffer(inputBuffer) {
          this.valueBlock.value = String.fromCharCode.apply(null, new Uint8Array(inputBuffer));

          try {
            this.valueBlock.value = decodeURIComponent(escape(this.valueBlock.value));
          } catch (ex) {
            this.warnings.push("Error during \"decodeURIComponent\": ".concat(ex, ", using raw string"));
          }
        }
      }, {
        key: "fromString",
        value: function fromString(inputString) {
          var str = unescape(encodeURIComponent(inputString));
          var strLen = str.length;
          this.valueBlock.valueHex = new ArrayBuffer(strLen);
          var view = new Uint8Array(this.valueBlock.valueHex);

          for (var i = 0; i < strLen; i++) {
            view[i] = str.charCodeAt(i);
          }

          this.valueBlock.value = inputString;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "Utf8String";
        }
      }]);

      return Utf8String;
    }(BaseBlock);

    exports.Utf8String = Utf8String;

    var LocalRelativeSidValueBlock = /*#__PURE__*/function (_HexBlock7) {
      _inherits(LocalRelativeSidValueBlock, _HexBlock7);

      var _super111 = _createSuper(LocalRelativeSidValueBlock);

      function LocalRelativeSidValueBlock() {
        var _this51;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalRelativeSidValueBlock);

        _this51 = _super111.call(this, parameters);
        _this51.valueDec = (0, utils.getParametersValue)(parameters, "valueDec", -1);
        return _this51;
      }

      _createClass(LocalRelativeSidValueBlock, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          if (inputLength === 0) return inputOffset;
          if ((0, utils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1;
          var intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);
          this.valueHex = new ArrayBuffer(inputLength);
          var view = new Uint8Array(this.valueHex);

          for (var i = 0; i < inputLength; i++) {
            view[i] = intBuffer[i] & 0x7F;
            this.blockLength++;
            if ((intBuffer[i] & 0x80) === 0x00) break;
          }

          var tempValueHex = new ArrayBuffer(this.blockLength);
          var tempView = new Uint8Array(tempValueHex);

          for (var _i16 = 0; _i16 < this.blockLength; _i16++) {
            tempView[_i16] = view[_i16];
          }

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
      }, {
        key: "toBER",
        value: function toBER() {
          var sizeOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var retBuf;
          var retView;

          if (this.isHexOnly) {
            if (sizeOnly === true) return new ArrayBuffer(this.valueHex.byteLength);
            var curView = new Uint8Array(this.valueHex);
            retBuf = new ArrayBuffer(this.blockLength);
            retView = new Uint8Array(retBuf);

            for (var i = 0; i < this.blockLength - 1; i++) {
              retView[i] = curView[i] | 0x80;
            }

            retView[this.blockLength - 1] = curView[this.blockLength - 1];
            return retBuf;
          }

          var encodedBuf = (0, utils.utilToBase)(this.valueDec, 7);

          if (encodedBuf.byteLength === 0) {
            this.error = "Error during encoding SID value";
            return new ArrayBuffer(0);
          }

          retBuf = new ArrayBuffer(encodedBuf.byteLength);

          if (sizeOnly === false) {
            var encodedView = new Uint8Array(encodedBuf);
            retView = new Uint8Array(retBuf);

            for (var _i17 = 0; _i17 < encodedBuf.byteLength - 1; _i17++) {
              retView[_i17] = encodedView[_i17] | 0x80;
            }

            retView[encodedBuf.byteLength - 1] = encodedView[encodedBuf.byteLength - 1];
          }

          return retBuf;
        }
      }, {
        key: "toString",
        value: function toString() {
          var result = "";
          if (this.isHexOnly === true) result = (0, utils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);else {
            result = this.valueDec.toString();
          }
          return result;
        }
      }, {
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalRelativeSidValueBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.valueDec = this.valueDec;
          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "relativeSidBlock";
        }
      }]);

      return LocalRelativeSidValueBlock;
    }(HexBlock(LocalBaseBlock));

    var LocalRelativeObjectIdentifierValueBlock = /*#__PURE__*/function (_ValueBlock6) {
      _inherits(LocalRelativeObjectIdentifierValueBlock, _ValueBlock6);

      var _super112 = _createSuper(LocalRelativeObjectIdentifierValueBlock);

      function LocalRelativeObjectIdentifierValueBlock() {
        var _this52;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalRelativeObjectIdentifierValueBlock);

        _this52 = _super112.call(this, parameters);

        _this52.fromString((0, utils.getParametersValue)(parameters, "value", ""));

        return _this52;
      }

      _createClass(LocalRelativeObjectIdentifierValueBlock, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          var resultOffset = inputOffset;

          while (inputLength > 0) {
            var sidBlock = new LocalRelativeSidValueBlock();
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
      }, {
        key: "toBER",
        value: function toBER() {
          var sizeOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var retBuf = new ArrayBuffer(0);

          for (var i = 0; i < this.value.length; i++) {
            var valueBuf = this.value[i].toBER(sizeOnly);

            if (valueBuf.byteLength === 0) {
              this.error = this.value[i].error;
              return new ArrayBuffer(0);
            }

            retBuf = (0, utils.utilConcatBuf)(retBuf, valueBuf);
          }

          return retBuf;
        }
      }, {
        key: "fromString",
        value: function fromString(string) {
          this.value = [];
          var pos1 = 0;
          var pos2 = 0;
          var sid = "";

          do {
            pos2 = string.indexOf(".", pos1);
            if (pos2 === -1) sid = string.substr(pos1);else sid = string.substr(pos1, pos2 - pos1);
            pos1 = pos2 + 1;
            var sidBlock = new LocalRelativeSidValueBlock();
            sidBlock.valueDec = parseInt(sid, 10);
            if (isNaN(sidBlock.valueDec)) return true;
            this.value.push(sidBlock);
          } while (pos2 !== -1);

          return true;
        }
      }, {
        key: "toString",
        value: function toString() {
          var result = "";
          var isHexOnly = false;

          for (var i = 0; i < this.value.length; i++) {
            isHexOnly = this.value[i].isHexOnly;
            var sidStr = this.value[i].toString();
            if (i !== 0) result = "".concat(result, ".");

            if (isHexOnly) {
              sidStr = "{".concat(sidStr, "}");
              result += sidStr;
            } else result += sidStr;
          }

          return result;
        }
      }, {
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalRelativeObjectIdentifierValueBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.value = this.toString();
          object.sidArray = [];

          for (var i = 0; i < this.value.length; i++) {
            object.sidArray.push(this.value[i].toJSON());
          }

          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "RelativeObjectIdentifierValueBlock";
        }
      }]);

      return LocalRelativeObjectIdentifierValueBlock;
    }(ValueBlock);

    var RelativeObjectIdentifier = /*#__PURE__*/function (_BaseBlock11) {
      _inherits(RelativeObjectIdentifier, _BaseBlock11);

      var _super113 = _createSuper(RelativeObjectIdentifier);

      function RelativeObjectIdentifier() {
        var _this53;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, RelativeObjectIdentifier);

        _this53 = _super113.call(this, parameters, LocalRelativeObjectIdentifierValueBlock);
        _this53.idBlock.tagClass = 1;
        _this53.idBlock.tagNumber = 13;
        return _this53;
      }

      _createClass(RelativeObjectIdentifier, null, [{
        key: "blockName",
        value: function blockName() {
          return "RelativeObjectIdentifier";
        }
      }]);

      return RelativeObjectIdentifier;
    }(BaseBlock);

    exports.RelativeObjectIdentifier = RelativeObjectIdentifier;

    var LocalBmpStringValueBlock = /*#__PURE__*/function (_HexBlock8) {
      _inherits(LocalBmpStringValueBlock, _HexBlock8);

      var _super114 = _createSuper(LocalBmpStringValueBlock);

      function LocalBmpStringValueBlock() {
        var _this54;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalBmpStringValueBlock);

        _this54 = _super114.call(this, parameters);
        _this54.isHexOnly = true;
        _this54.value = "";
        return _this54;
      }

      _createClass(LocalBmpStringValueBlock, [{
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalBmpStringValueBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.value = this.value;
          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "BmpStringValueBlock";
        }
      }]);

      return LocalBmpStringValueBlock;
    }(HexBlock(LocalBaseBlock));

    var BmpString = /*#__PURE__*/function (_BaseBlock12) {
      _inherits(BmpString, _BaseBlock12);

      var _super115 = _createSuper(BmpString);

      function BmpString() {
        var _this55;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, BmpString);

        _this55 = _super115.call(this, parameters, LocalBmpStringValueBlock);
        if ("value" in parameters) _this55.fromString(parameters.value);
        _this55.idBlock.tagClass = 1;
        _this55.idBlock.tagNumber = 30;
        return _this55;
      }

      _createClass(BmpString, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          var resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

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
      }, {
        key: "fromBuffer",
        value: function fromBuffer(inputBuffer) {
          var copyBuffer = inputBuffer.slice(0);
          var valueView = new Uint8Array(copyBuffer);

          for (var i = 0; i < valueView.length; i += 2) {
            var temp = valueView[i];
            valueView[i] = valueView[i + 1];
            valueView[i + 1] = temp;
          }

          this.valueBlock.value = String.fromCharCode.apply(null, new Uint16Array(copyBuffer));
        }
      }, {
        key: "fromString",
        value: function fromString(inputString) {
          var strLength = inputString.length;
          this.valueBlock.valueHex = new ArrayBuffer(strLength * 2);
          var valueHexView = new Uint8Array(this.valueBlock.valueHex);

          for (var i = 0; i < strLength; i++) {
            var codeBuf = (0, utils.utilToBase)(inputString.charCodeAt(i), 8);
            var codeView = new Uint8Array(codeBuf);
            if (codeView.length > 2) continue;
            var dif = 2 - codeView.length;

            for (var j = codeView.length - 1; j >= 0; j--) {
              valueHexView[i * 2 + j + dif] = codeView[j];
            }
          }

          this.valueBlock.value = inputString;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "BmpString";
        }
      }]);

      return BmpString;
    }(BaseBlock);

    exports.BmpString = BmpString;

    var LocalUniversalStringValueBlock = /*#__PURE__*/function (_HexBlock9) {
      _inherits(LocalUniversalStringValueBlock, _HexBlock9);

      var _super116 = _createSuper(LocalUniversalStringValueBlock);

      function LocalUniversalStringValueBlock() {
        var _this56;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalUniversalStringValueBlock);

        _this56 = _super116.call(this, parameters);
        _this56.isHexOnly = true;
        _this56.value = "";
        return _this56;
      }

      _createClass(LocalUniversalStringValueBlock, [{
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalUniversalStringValueBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.value = this.value;
          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "UniversalStringValueBlock";
        }
      }]);

      return LocalUniversalStringValueBlock;
    }(HexBlock(LocalBaseBlock));

    var UniversalString = /*#__PURE__*/function (_BaseBlock13) {
      _inherits(UniversalString, _BaseBlock13);

      var _super117 = _createSuper(UniversalString);

      function UniversalString() {
        var _this57;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, UniversalString);

        _this57 = _super117.call(this, parameters, LocalUniversalStringValueBlock);
        if ("value" in parameters) _this57.fromString(parameters.value);
        _this57.idBlock.tagClass = 1;
        _this57.idBlock.tagNumber = 28;
        return _this57;
      }

      _createClass(UniversalString, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          var resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

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
      }, {
        key: "fromBuffer",
        value: function fromBuffer(inputBuffer) {
          var copyBuffer = inputBuffer.slice(0);
          var valueView = new Uint8Array(copyBuffer);

          for (var i = 0; i < valueView.length; i += 4) {
            valueView[i] = valueView[i + 3];
            valueView[i + 1] = valueView[i + 2];
            valueView[i + 2] = 0x00;
            valueView[i + 3] = 0x00;
          }

          this.valueBlock.value = String.fromCharCode.apply(null, new Uint32Array(copyBuffer));
        }
      }, {
        key: "fromString",
        value: function fromString(inputString) {
          var strLength = inputString.length;
          this.valueBlock.valueHex = new ArrayBuffer(strLength * 4);
          var valueHexView = new Uint8Array(this.valueBlock.valueHex);

          for (var i = 0; i < strLength; i++) {
            var codeBuf = (0, utils.utilToBase)(inputString.charCodeAt(i), 8);
            var codeView = new Uint8Array(codeBuf);
            if (codeView.length > 4) continue;
            var dif = 4 - codeView.length;

            for (var j = codeView.length - 1; j >= 0; j--) {
              valueHexView[i * 4 + j + dif] = codeView[j];
            }
          }

          this.valueBlock.value = inputString;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "UniversalString";
        }
      }]);

      return UniversalString;
    }(BaseBlock);

    exports.UniversalString = UniversalString;

    var LocalSimpleStringValueBlock = /*#__PURE__*/function (_HexBlock10) {
      _inherits(LocalSimpleStringValueBlock, _HexBlock10);

      var _super118 = _createSuper(LocalSimpleStringValueBlock);

      function LocalSimpleStringValueBlock() {
        var _this58;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalSimpleStringValueBlock);

        _this58 = _super118.call(this, parameters);
        _this58.value = "";
        _this58.isHexOnly = true;
        return _this58;
      }

      _createClass(LocalSimpleStringValueBlock, [{
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(LocalSimpleStringValueBlock.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.value = this.value;
          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "SimpleStringValueBlock";
        }
      }]);

      return LocalSimpleStringValueBlock;
    }(HexBlock(LocalBaseBlock));

    var LocalSimpleStringBlock = /*#__PURE__*/function (_BaseBlock14) {
      _inherits(LocalSimpleStringBlock, _BaseBlock14);

      var _super119 = _createSuper(LocalSimpleStringBlock);

      function LocalSimpleStringBlock() {
        var _this59;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalSimpleStringBlock);

        _this59 = _super119.call(this, parameters, LocalSimpleStringValueBlock);
        if ("value" in parameters) _this59.fromString(parameters.value);
        return _this59;
      }

      _createClass(LocalSimpleStringBlock, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          var resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

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
      }, {
        key: "fromBuffer",
        value: function fromBuffer(inputBuffer) {
          this.valueBlock.value = String.fromCharCode.apply(null, new Uint8Array(inputBuffer));
        }
      }, {
        key: "fromString",
        value: function fromString(inputString) {
          var strLen = inputString.length;
          this.valueBlock.valueHex = new ArrayBuffer(strLen);
          var view = new Uint8Array(this.valueBlock.valueHex);

          for (var i = 0; i < strLen; i++) {
            view[i] = inputString.charCodeAt(i);
          }

          this.valueBlock.value = inputString;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "SIMPLESTRING";
        }
      }]);

      return LocalSimpleStringBlock;
    }(BaseBlock);

    var NumericString = /*#__PURE__*/function (_LocalSimpleStringBlo) {
      _inherits(NumericString, _LocalSimpleStringBlo);

      var _super120 = _createSuper(NumericString);

      function NumericString() {
        var _this60;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, NumericString);

        _this60 = _super120.call(this, parameters);
        _this60.idBlock.tagClass = 1;
        _this60.idBlock.tagNumber = 18;
        return _this60;
      }

      _createClass(NumericString, null, [{
        key: "blockName",
        value: function blockName() {
          return "NumericString";
        }
      }]);

      return NumericString;
    }(LocalSimpleStringBlock);

    exports.NumericString = NumericString;

    var PrintableString = /*#__PURE__*/function (_LocalSimpleStringBlo2) {
      _inherits(PrintableString, _LocalSimpleStringBlo2);

      var _super121 = _createSuper(PrintableString);

      function PrintableString() {
        var _this61;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, PrintableString);

        _this61 = _super121.call(this, parameters);
        _this61.idBlock.tagClass = 1;
        _this61.idBlock.tagNumber = 19;
        return _this61;
      }

      _createClass(PrintableString, null, [{
        key: "blockName",
        value: function blockName() {
          return "PrintableString";
        }
      }]);

      return PrintableString;
    }(LocalSimpleStringBlock);

    exports.PrintableString = PrintableString;

    var TeletexString = /*#__PURE__*/function (_LocalSimpleStringBlo3) {
      _inherits(TeletexString, _LocalSimpleStringBlo3);

      var _super122 = _createSuper(TeletexString);

      function TeletexString() {
        var _this62;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, TeletexString);

        _this62 = _super122.call(this, parameters);
        _this62.idBlock.tagClass = 1;
        _this62.idBlock.tagNumber = 20;
        return _this62;
      }

      _createClass(TeletexString, null, [{
        key: "blockName",
        value: function blockName() {
          return "TeletexString";
        }
      }]);

      return TeletexString;
    }(LocalSimpleStringBlock);

    exports.TeletexString = TeletexString;

    var VideotexString = /*#__PURE__*/function (_LocalSimpleStringBlo4) {
      _inherits(VideotexString, _LocalSimpleStringBlo4);

      var _super123 = _createSuper(VideotexString);

      function VideotexString() {
        var _this63;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, VideotexString);

        _this63 = _super123.call(this, parameters);
        _this63.idBlock.tagClass = 1;
        _this63.idBlock.tagNumber = 21;
        return _this63;
      }

      _createClass(VideotexString, null, [{
        key: "blockName",
        value: function blockName() {
          return "VideotexString";
        }
      }]);

      return VideotexString;
    }(LocalSimpleStringBlock);

    exports.VideotexString = VideotexString;

    var IA5String = /*#__PURE__*/function (_LocalSimpleStringBlo5) {
      _inherits(IA5String, _LocalSimpleStringBlo5);

      var _super124 = _createSuper(IA5String);

      function IA5String() {
        var _this64;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, IA5String);

        _this64 = _super124.call(this, parameters);
        _this64.idBlock.tagClass = 1;
        _this64.idBlock.tagNumber = 22;
        return _this64;
      }

      _createClass(IA5String, null, [{
        key: "blockName",
        value: function blockName() {
          return "IA5String";
        }
      }]);

      return IA5String;
    }(LocalSimpleStringBlock);

    exports.IA5String = IA5String;

    var GraphicString = /*#__PURE__*/function (_LocalSimpleStringBlo6) {
      _inherits(GraphicString, _LocalSimpleStringBlo6);

      var _super125 = _createSuper(GraphicString);

      function GraphicString() {
        var _this65;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, GraphicString);

        _this65 = _super125.call(this, parameters);
        _this65.idBlock.tagClass = 1;
        _this65.idBlock.tagNumber = 25;
        return _this65;
      }

      _createClass(GraphicString, null, [{
        key: "blockName",
        value: function blockName() {
          return "GraphicString";
        }
      }]);

      return GraphicString;
    }(LocalSimpleStringBlock);

    exports.GraphicString = GraphicString;

    var VisibleString = /*#__PURE__*/function (_LocalSimpleStringBlo7) {
      _inherits(VisibleString, _LocalSimpleStringBlo7);

      var _super126 = _createSuper(VisibleString);

      function VisibleString() {
        var _this66;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, VisibleString);

        _this66 = _super126.call(this, parameters);
        _this66.idBlock.tagClass = 1;
        _this66.idBlock.tagNumber = 26;
        return _this66;
      }

      _createClass(VisibleString, null, [{
        key: "blockName",
        value: function blockName() {
          return "VisibleString";
        }
      }]);

      return VisibleString;
    }(LocalSimpleStringBlock);

    exports.VisibleString = VisibleString;

    var GeneralString = /*#__PURE__*/function (_LocalSimpleStringBlo8) {
      _inherits(GeneralString, _LocalSimpleStringBlo8);

      var _super127 = _createSuper(GeneralString);

      function GeneralString() {
        var _this67;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, GeneralString);

        _this67 = _super127.call(this, parameters);
        _this67.idBlock.tagClass = 1;
        _this67.idBlock.tagNumber = 27;
        return _this67;
      }

      _createClass(GeneralString, null, [{
        key: "blockName",
        value: function blockName() {
          return "GeneralString";
        }
      }]);

      return GeneralString;
    }(LocalSimpleStringBlock);

    exports.GeneralString = GeneralString;

    var CharacterString = /*#__PURE__*/function (_LocalSimpleStringBlo9) {
      _inherits(CharacterString, _LocalSimpleStringBlo9);

      var _super128 = _createSuper(CharacterString);

      function CharacterString() {
        var _this68;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, CharacterString);

        _this68 = _super128.call(this, parameters);
        _this68.idBlock.tagClass = 1;
        _this68.idBlock.tagNumber = 29;
        return _this68;
      }

      _createClass(CharacterString, null, [{
        key: "blockName",
        value: function blockName() {
          return "CharacterString";
        }
      }]);

      return CharacterString;
    }(LocalSimpleStringBlock);

    exports.CharacterString = CharacterString;

    var UTCTime = /*#__PURE__*/function (_VisibleString) {
      _inherits(UTCTime, _VisibleString);

      var _super129 = _createSuper(UTCTime);

      function UTCTime() {
        var _this69;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, UTCTime);

        _this69 = _super129.call(this, parameters);
        _this69.year = 0;
        _this69.month = 0;
        _this69.day = 0;
        _this69.hour = 0;
        _this69.minute = 0;
        _this69.second = 0;

        if ("value" in parameters) {
          _this69.fromString(parameters.value);

          _this69.valueBlock.valueHex = new ArrayBuffer(parameters.value.length);
          var view = new Uint8Array(_this69.valueBlock.valueHex);

          for (var i = 0; i < parameters.value.length; i++) {
            view[i] = parameters.value.charCodeAt(i);
          }
        }

        if ("valueDate" in parameters) {
          _this69.fromDate(parameters.valueDate);

          _this69.valueBlock.valueHex = _this69.toBuffer();
        }

        _this69.idBlock.tagClass = 1;
        _this69.idBlock.tagNumber = 23;
        return _this69;
      }

      _createClass(UTCTime, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          var resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

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
      }, {
        key: "fromBuffer",
        value: function fromBuffer(inputBuffer) {
          this.fromString(String.fromCharCode.apply(null, new Uint8Array(inputBuffer)));
        }
      }, {
        key: "toBuffer",
        value: function toBuffer() {
          var str = this.toString();
          var buffer = new ArrayBuffer(str.length);
          var view = new Uint8Array(buffer);

          for (var i = 0; i < str.length; i++) {
            view[i] = str.charCodeAt(i);
          }

          return buffer;
        }
      }, {
        key: "fromDate",
        value: function fromDate(inputDate) {
          this.year = inputDate.getUTCFullYear();
          this.month = inputDate.getUTCMonth() + 1;
          this.day = inputDate.getUTCDate();
          this.hour = inputDate.getUTCHours();
          this.minute = inputDate.getUTCMinutes();
          this.second = inputDate.getUTCSeconds();
        }
      }, {
        key: "toDate",
        value: function toDate() {
          return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second));
        }
      }, {
        key: "fromString",
        value: function fromString(inputString) {
          var parser = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/ig;
          var parserArray = parser.exec(inputString);

          if (parserArray === null) {
            this.error = "Wrong input string for convertion";
            return;
          }

          var year = parseInt(parserArray[1], 10);
          if (year >= 50) this.year = 1900 + year;else this.year = 2000 + year;
          this.month = parseInt(parserArray[2], 10);
          this.day = parseInt(parserArray[3], 10);
          this.hour = parseInt(parserArray[4], 10);
          this.minute = parseInt(parserArray[5], 10);
          this.second = parseInt(parserArray[6], 10);
        }
      }, {
        key: "toString",
        value: function toString() {
          var outputArray = new Array(7);
          outputArray[0] = (0, utils.padNumber)(this.year < 2000 ? this.year - 1900 : this.year - 2000, 2);
          outputArray[1] = (0, utils.padNumber)(this.month, 2);
          outputArray[2] = (0, utils.padNumber)(this.day, 2);
          outputArray[3] = (0, utils.padNumber)(this.hour, 2);
          outputArray[4] = (0, utils.padNumber)(this.minute, 2);
          outputArray[5] = (0, utils.padNumber)(this.second, 2);
          outputArray[6] = "Z";
          return outputArray.join("");
        }
      }, {
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(UTCTime.prototype), "toJSON", this).call(this);
          } catch (ex) {}

          object.year = this.year;
          object.month = this.month;
          object.day = this.day;
          object.hour = this.hour;
          object.minute = this.minute;
          object.second = this.second;
          return object;
        }
      }], [{
        key: "blockName",
        value: function blockName() {
          return "UTCTime";
        }
      }]);

      return UTCTime;
    }(VisibleString);

    exports.UTCTime = UTCTime;

    var GeneralizedTime = /*#__PURE__*/function (_VisibleString2) {
      _inherits(GeneralizedTime, _VisibleString2);

      var _super130 = _createSuper(GeneralizedTime);

      function GeneralizedTime() {
        var _this70;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, GeneralizedTime);

        _this70 = _super130.call(this, parameters);
        _this70.year = 0;
        _this70.month = 0;
        _this70.day = 0;
        _this70.hour = 0;
        _this70.minute = 0;
        _this70.second = 0;
        _this70.millisecond = 0;

        if ("value" in parameters) {
          _this70.fromString(parameters.value);

          _this70.valueBlock.valueHex = new ArrayBuffer(parameters.value.length);
          var view = new Uint8Array(_this70.valueBlock.valueHex);

          for (var i = 0; i < parameters.value.length; i++) {
            view[i] = parameters.value.charCodeAt(i);
          }
        }

        if ("valueDate" in parameters) {
          _this70.fromDate(parameters.valueDate);

          _this70.valueBlock.valueHex = _this70.toBuffer();
        }

        _this70.idBlock.tagClass = 1;
        _this70.idBlock.tagNumber = 24;
        return _this70;
      }

      _createClass(GeneralizedTime, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          var resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

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
      }, {
        key: "fromBuffer",
        value: function fromBuffer(inputBuffer) {
          this.fromString(String.fromCharCode.apply(null, new Uint8Array(inputBuffer)));
        }
      }, {
        key: "toBuffer",
        value: function toBuffer() {
          var str = this.toString();
          var buffer = new ArrayBuffer(str.length);
          var view = new Uint8Array(buffer);

          for (var i = 0; i < str.length; i++) {
            view[i] = str.charCodeAt(i);
          }

          return buffer;
        }
      }, {
        key: "fromDate",
        value: function fromDate(inputDate) {
          this.year = inputDate.getUTCFullYear();
          this.month = inputDate.getUTCMonth() + 1;
          this.day = inputDate.getUTCDate();
          this.hour = inputDate.getUTCHours();
          this.minute = inputDate.getUTCMinutes();
          this.second = inputDate.getUTCSeconds();
          this.millisecond = inputDate.getUTCMilliseconds();
        }
      }, {
        key: "toDate",
        value: function toDate() {
          return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond));
        }
      }, {
        key: "fromString",
        value: function fromString(inputString) {
          var isUTC = false;
          var timeString = "";
          var dateTimeString = "";
          var fractionPart = 0;
          var parser;
          var hourDifference = 0;
          var minuteDifference = 0;

          if (inputString[inputString.length - 1] === "Z") {
            timeString = inputString.substr(0, inputString.length - 1);
            isUTC = true;
          } else {
            var number = new Number(inputString[inputString.length - 1]);
            if (isNaN(number.valueOf())) throw new Error("Wrong input string for convertion");
            timeString = inputString;
          }

          if (isUTC) {
            if (timeString.indexOf("+") !== -1) throw new Error("Wrong input string for convertion");
            if (timeString.indexOf("-") !== -1) throw new Error("Wrong input string for convertion");
          } else {
            var multiplier = 1;
            var differencePosition = timeString.indexOf("+");
            var differenceString = "";

            if (differencePosition === -1) {
              differencePosition = timeString.indexOf("-");
              multiplier = -1;
            }

            if (differencePosition !== -1) {
              differenceString = timeString.substr(differencePosition + 1);
              timeString = timeString.substr(0, differencePosition);
              if (differenceString.length !== 2 && differenceString.length !== 4) throw new Error("Wrong input string for convertion");

              var _number = new Number(differenceString.substr(0, 2));

              if (isNaN(_number.valueOf())) throw new Error("Wrong input string for convertion");
              hourDifference = multiplier * _number;

              if (differenceString.length === 4) {
                _number = new Number(differenceString.substr(2, 2));
                if (isNaN(_number.valueOf())) throw new Error("Wrong input string for convertion");
                minuteDifference = multiplier * _number;
              }
            }
          }

          var fractionPointPosition = timeString.indexOf(".");
          if (fractionPointPosition === -1) fractionPointPosition = timeString.indexOf(",");

          if (fractionPointPosition !== -1) {
            var fractionPartCheck = new Number("0".concat(timeString.substr(fractionPointPosition)));
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
                var fractionResult = 60 * fractionPart;
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
                var _fractionResult = 60 * fractionPart;

                this.second = Math.floor(_fractionResult);
                _fractionResult = 1000 * (_fractionResult - this.second);
                this.millisecond = Math.floor(_fractionResult);
              }

              break;

            case dateTimeString.length === 14:
              parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/ig;

              if (fractionPointPosition !== -1) {
                var _fractionResult2 = 1000 * fractionPart;

                this.millisecond = Math.floor(_fractionResult2);
              }

              break;

            default:
              throw new Error("Wrong input string for convertion");
          }

          var parserArray = parser.exec(dateTimeString);
          if (parserArray === null) throw new Error("Wrong input string for convertion");

          for (var j = 1; j < parserArray.length; j++) {
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
            var tempDate = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
            this.year = tempDate.getUTCFullYear();
            this.month = tempDate.getUTCMonth();
            this.day = tempDate.getUTCDay();
            this.hour = tempDate.getUTCHours();
            this.minute = tempDate.getUTCMinutes();
            this.second = tempDate.getUTCSeconds();
            this.millisecond = tempDate.getUTCMilliseconds();
          }
        }
      }, {
        key: "toString",
        value: function toString() {
          var outputArray = [];
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
      }, {
        key: "toJSON",
        value: function toJSON() {
          var object = {};

          try {
            object = _get(_getPrototypeOf(GeneralizedTime.prototype), "toJSON", this).call(this);
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
      }], [{
        key: "blockName",
        value: function blockName() {
          return "GeneralizedTime";
        }
      }]);

      return GeneralizedTime;
    }(VisibleString);

    exports.GeneralizedTime = GeneralizedTime;

    var DATE = /*#__PURE__*/function (_Utf8String) {
      _inherits(DATE, _Utf8String);

      var _super131 = _createSuper(DATE);

      function DATE() {
        var _this71;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, DATE);

        _this71 = _super131.call(this, parameters);
        _this71.idBlock.tagClass = 1;
        _this71.idBlock.tagNumber = 31;
        return _this71;
      }

      _createClass(DATE, null, [{
        key: "blockName",
        value: function blockName() {
          return "DATE";
        }
      }]);

      return DATE;
    }(Utf8String);

    exports.DATE = DATE;

    var TimeOfDay = /*#__PURE__*/function (_Utf8String2) {
      _inherits(TimeOfDay, _Utf8String2);

      var _super132 = _createSuper(TimeOfDay);

      function TimeOfDay() {
        var _this72;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, TimeOfDay);

        _this72 = _super132.call(this, parameters);
        _this72.idBlock.tagClass = 1;
        _this72.idBlock.tagNumber = 32;
        return _this72;
      }

      _createClass(TimeOfDay, null, [{
        key: "blockName",
        value: function blockName() {
          return "TimeOfDay";
        }
      }]);

      return TimeOfDay;
    }(Utf8String);

    exports.TimeOfDay = TimeOfDay;

    var DateTime = /*#__PURE__*/function (_Utf8String3) {
      _inherits(DateTime, _Utf8String3);

      var _super133 = _createSuper(DateTime);

      function DateTime() {
        var _this73;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, DateTime);

        _this73 = _super133.call(this, parameters);
        _this73.idBlock.tagClass = 1;
        _this73.idBlock.tagNumber = 33;
        return _this73;
      }

      _createClass(DateTime, null, [{
        key: "blockName",
        value: function blockName() {
          return "DateTime";
        }
      }]);

      return DateTime;
    }(Utf8String);

    exports.DateTime = DateTime;

    var Duration = /*#__PURE__*/function (_Utf8String4) {
      _inherits(Duration, _Utf8String4);

      var _super134 = _createSuper(Duration);

      function Duration() {
        var _this74;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Duration);

        _this74 = _super134.call(this, parameters);
        _this74.idBlock.tagClass = 1;
        _this74.idBlock.tagNumber = 34;
        return _this74;
      }

      _createClass(Duration, null, [{
        key: "blockName",
        value: function blockName() {
          return "Duration";
        }
      }]);

      return Duration;
    }(Utf8String);

    exports.Duration = Duration;

    var TIME = /*#__PURE__*/function (_Utf8String5) {
      _inherits(TIME, _Utf8String5);

      var _super135 = _createSuper(TIME);

      function TIME() {
        var _this75;

        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, TIME);

        _this75 = _super135.call(this, parameters);
        _this75.idBlock.tagClass = 1;
        _this75.idBlock.tagNumber = 14;
        return _this75;
      }

      _createClass(TIME, null, [{
        key: "blockName",
        value: function blockName() {
          return "TIME";
        }
      }]);

      return TIME;
    }(Utf8String);

    exports.TIME = TIME;

    var Choice = function Choice() {
      var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Choice);

      this.value = (0, utils.getParametersValue)(parameters, "value", []);
      this.optional = (0, utils.getParametersValue)(parameters, "optional", false);
    };

    exports.Choice = Choice;

    var Any = function Any() {
      var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Any);

      this.name = (0, utils.getParametersValue)(parameters, "name", "");
      this.optional = (0, utils.getParametersValue)(parameters, "optional", false);
    };

    exports.Any = Any;

    var Repeated = function Repeated() {
      var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Repeated);

      this.name = (0, utils.getParametersValue)(parameters, "name", "");
      this.optional = (0, utils.getParametersValue)(parameters, "optional", false);
      this.value = (0, utils.getParametersValue)(parameters, "value", new Any());
      this.local = (0, utils.getParametersValue)(parameters, "local", false);
    };

    exports.Repeated = Repeated;

    var RawData = /*#__PURE__*/function () {
      function RawData() {
        var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, RawData);

        this.data = (0, utils.getParametersValue)(parameters, "data", new ArrayBuffer(0));
      }

      _createClass(RawData, [{
        key: "fromBER",
        value: function fromBER(inputBuffer, inputOffset, inputLength) {
          this.data = inputBuffer.slice(inputOffset, inputLength);
          return inputOffset + inputLength;
        }
      }, {
        key: "toBER",
        value: function toBER() {
          return this.data;
        }
      }]);

      return RawData;
    }();

    exports.RawData = RawData;

    function LocalFromBER(inputBuffer, inputOffset, inputLength) {
      var incomingOffset = inputOffset;

      function localChangeType(inputObject, newType) {
        if (inputObject instanceof newType) return inputObject;
        var newObject = new newType();
        newObject.idBlock = inputObject.idBlock;
        newObject.lenBlock = inputObject.lenBlock;
        newObject.warnings = inputObject.warnings;
        newObject.valueBeforeDecode = inputObject.valueBeforeDecode.slice(0);
        return newObject;
      }

      var returnObject = new BaseBlock({}, Object);
      var baseBlock = new LocalBaseBlock();

      if ((0, utils.checkBufferParams)(baseBlock, inputBuffer, inputOffset, inputLength) === false) {
        returnObject.error = baseBlock.error;
        return {
          offset: -1,
          result: returnObject
        };
      }

      var intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);

      if (intBuffer.length === 0) {
        this.error = "Zero buffer length";
        return {
          offset: -1,
          result: returnObject
        };
      }

      var resultOffset = returnObject.idBlock.fromBER(inputBuffer, inputOffset, inputLength);
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

      var newASN1Type = BaseBlock;

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
                var newObject;
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
        var result = new BaseBlock({}, Object);
        result.error = "Input buffer has zero length";
        return {
          offset: -1,
          result: result
        };
      }

      return LocalFromBER(inputBuffer, 0, inputBuffer.byteLength);
    }

    function compareSchema(root, inputData, inputSchema) {
      if (inputSchema instanceof Choice) {
        for (var j = 0; j < inputSchema.value.length; j++) {
          var result = compareSchema(root, inputData, inputSchema.value[j]);

          if (result.verified === true) {
            return {
              verified: true,
              result: root
            };
          }
        }

        {
          var _result = {
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

      var encodedId = inputSchema.idBlock.toBER(false);

      if (encodedId.byteLength === 0) {
        return {
          verified: false,
          result: {
            error: "Error encoding idBlock for ASN.1 schema"
          }
        };
      }

      var decodedOffset = inputSchema.idBlock.fromBER(encodedId, 0, encodedId.byteLength);

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

        var schemaView = new Uint8Array(inputSchema.idBlock.valueHex);
        var asn1View = new Uint8Array(inputData.idBlock.valueHex);

        if (schemaView.length !== asn1View.length) {
          return {
            verified: false,
            result: root
          };
        }

        for (var i = 0; i < schemaView.length; i++) {
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
        var admission = 0;
        var _result2 = {
          verified: false
        };
        var maxLength = inputSchema.valueBlock.value.length;

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
          var _optional = true;

          for (var _i18 = 0; _i18 < inputSchema.valueBlock.value.length; _i18++) {
            _optional = _optional && (inputSchema.valueBlock.value[_i18].optional || false);
          }

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

        for (var _i19 = 0; _i19 < maxLength; _i19++) {
          if (_i19 - admission >= inputData.valueBlock.value.length) {
            if (inputSchema.valueBlock.value[_i19].optional === false) {
              var _result3 = {
                verified: false,
                result: root
              };
              root.error = "Inconsistent length between ASN.1 data and schema";

              if (inputSchema.hasOwnProperty("name")) {
                inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");

                if (inputSchema.name !== "") {
                  delete root[inputSchema.name];
                  _result3.name = inputSchema.name;
                }
              }

              return _result3;
            }
          } else {
            if (inputSchema.valueBlock.value[0] instanceof Repeated) {
              _result2 = compareSchema(root, inputData.valueBlock.value[_i19], inputSchema.valueBlock.value[0].value);

              if (_result2.verified === false) {
                if (inputSchema.valueBlock.value[0].optional === true) admission++;else {
                  if (inputSchema.hasOwnProperty("name")) {
                    inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");
                    if (inputSchema.name !== "") delete root[inputSchema.name];
                  }

                  return _result2;
                }
              }

              if ("name" in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].name.length > 0) {
                var arrayRoot = {};
                if ("local" in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].local === true) arrayRoot = inputData;else arrayRoot = root;
                if (typeof arrayRoot[inputSchema.valueBlock.value[0].name] === "undefined") arrayRoot[inputSchema.valueBlock.value[0].name] = [];
                arrayRoot[inputSchema.valueBlock.value[0].name].push(inputData.valueBlock.value[_i19]);
              }
            } else {
              _result2 = compareSchema(root, inputData.valueBlock.value[_i19 - admission], inputSchema.valueBlock.value[_i19]);

              if (_result2.verified === false) {
                if (inputSchema.valueBlock.value[_i19].optional === true) admission++;else {
                  if (inputSchema.hasOwnProperty("name")) {
                    inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");
                    if (inputSchema.name !== "") delete root[inputSchema.name];
                  }

                  return _result2;
                }
              }
            }
          }
        }

        if (_result2.verified === false) {
          var _result4 = {
            verified: false,
            result: root
          };

          if (inputSchema.hasOwnProperty("name")) {
            inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");

            if (inputSchema.name !== "") {
              delete root[inputSchema.name];
              _result4.name = inputSchema.name;
            }
          }

          return _result4;
        }

        return {
          verified: true,
          result: root
        };
      }

      if ("primitiveSchema" in inputSchema && "valueHex" in inputData.valueBlock) {
        var _asn = fromBER(inputData.valueBlock.valueHex);

        if (_asn.offset === -1) {
          var _result5 = {
            verified: false,
            result: _asn.result
          };

          if (inputSchema.hasOwnProperty("name")) {
            inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");

            if (inputSchema.name !== "") {
              delete root[inputSchema.name];
              _result5.name = inputSchema.name;
            }
          }

          return _result5;
        }

        return compareSchema(root, _asn.result, inputSchema.primitiveSchema);
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

      var asn1 = fromBER(inputBuffer);

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
  var AsnAnyConverter = {
    fromASN: function fromASN(value) {
      return value instanceof asn1_34 ? null : value.valueBeforeDecode;
    },
    toASN: function toASN(value) {
      if (value === null) {
        return new asn1_34();
      }

      var schema = asn1_1(value);

      if (schema.result.error) {
        throw new Error(schema.result.error);
      }

      return schema.result;
    }
  };
  var AsnIntegerConverter = {
    fromASN: function fromASN(value) {
      return !value.valueBlock.valueDec && value.valueBlock.valueHex.byteLength > 0 ? value.valueBlock.toString() : value.valueBlock.valueDec;
    },
    toASN: function toASN(value) {
      return new asn1_31({
        value: value
      });
    }
  };
  var AsnEnumeratedConverter = {
    fromASN: function fromASN(value) {
      return value.valueBlock.valueDec;
    },
    toASN: function toASN(value) {
      return new asn1_30({
        value: value
      });
    }
  };
  var AsnIntegerArrayBufferConverter = {
    fromASN: function fromASN(value) {
      return value.valueBlock.valueHex;
    },
    toASN: function toASN(value) {
      return new asn1_31({
        valueHex: value
      });
    }
  };
  var AsnBitStringConverter = {
    fromASN: function fromASN(value) {
      return value.valueBlock.valueHex;
    },
    toASN: function toASN(value) {
      return new asn1_32({
        valueHex: value
      });
    }
  };
  var AsnObjectIdentifierConverter = {
    fromASN: function fromASN(value) {
      return value.valueBlock.toString();
    },
    toASN: function toASN(value) {
      return new asn1_29({
        value: value
      });
    }
  };
  var AsnBooleanConverter = {
    fromASN: function fromASN(value) {
      return value.valueBlock.value;
    },
    toASN: function toASN(value) {
      return new asn1_37({
        value: value
      });
    }
  };
  var AsnOctetStringConverter = {
    fromASN: function fromASN(value) {
      return value.valueBlock.valueHex;
    },
    toASN: function toASN(value) {
      return new asn1_33({
        valueHex: value
      });
    }
  };

  function createStringConverter(Asn1Type) {
    return {
      fromASN: function fromASN(value) {
        return value.valueBlock.value;
      },
      toASN: function toASN(value) {
        return new Asn1Type({
          value: value
        });
      }
    };
  }

  var AsnUtf8StringConverter = createStringConverter(asn1_28);
  var AsnBmpStringConverter = createStringConverter(asn1_26);
  var AsnUniversalStringConverter = createStringConverter(asn1_25);
  var AsnNumericStringConverter = createStringConverter(asn1_24);
  var AsnPrintableStringConverter = createStringConverter(asn1_23);
  var AsnTeletexStringConverter = createStringConverter(asn1_22);
  var AsnVideotexStringConverter = createStringConverter(asn1_21);
  var AsnIA5StringConverter = createStringConverter(asn1_20);
  var AsnGraphicStringConverter = createStringConverter(asn1_19);
  var AsnVisibleStringConverter = createStringConverter(asn1_18);
  var AsnGeneralStringConverter = createStringConverter(asn1_17);
  var AsnCharacterStringConverter = createStringConverter(asn1_16);
  var AsnUTCTimeConverter = {
    fromASN: function fromASN(value) {
      return value.toDate();
    },
    toASN: function toASN(value) {
      return new asn1_15({
        valueDate: value
      });
    }
  };
  var AsnGeneralizedTimeConverter = {
    fromASN: function fromASN(value) {
      return value.toDate();
    },
    toASN: function toASN(value) {
      return new asn1_14({
        valueDate: value
      });
    }
  };
  var AsnNullConverter = {
    fromASN: function fromASN(value) {
      return null;
    },
    toASN: function toASN(value) {
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

    var b1 = new Uint8Array(bytes1);
    var b2 = new Uint8Array(bytes2);

    for (var i = 0; i < bytes1.byteLength; i++) {
      if (b1[i] !== b2[i]) {
        return false;
      }
    }

    return true;
  }

  var AsnSchemaStorage = /*#__PURE__*/function () {
    function AsnSchemaStorage() {
      _classCallCheck(this, AsnSchemaStorage);

      this.items = new WeakMap();
    }

    _createClass(AsnSchemaStorage, [{
      key: "has",
      value: function has(target) {
        return this.items.has(target);
      }
    }, {
      key: "get",
      value: function get(target) {
        var _a, _b, _c, _d;

        var schema = this.items.get(target);

        if (!schema) {
          throw new Error("Cannot get schema for '".concat((_d = (_c = (_b = (_a = target) === null || _a === void 0 ? void 0 : _a.prototype) === null || _b === void 0 ? void 0 : _b.constructor) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : target, "' target"));
        }

        return schema;
      }
    }, {
      key: "cache",
      value: function cache(target) {
        var schema = this.get(target);

        if (!schema.schema) {
          schema.schema = this.create(target, true);
        }
      }
    }, {
      key: "createDefault",
      value: function createDefault(target) {
        var schema = {
          type: AsnTypeTypes.Sequence,
          items: {}
        };
        var parentSchema = this.findParentSchema(target);

        if (parentSchema) {
          Object.assign(schema, parentSchema);
          schema.items = Object.assign({}, schema.items, parentSchema.items);
        }

        return schema;
      }
    }, {
      key: "create",
      value: function create(target, useNames) {
        var schema = this.items.get(target) || this.createDefault(target);
        var asn1Value = [];

        for (var key in schema.items) {
          var item = schema.items[key];
          var name = useNames ? key : "";
          var asn1Item = void 0;

          if (typeof item.type === "number") {
            var Asn1TypeName = AsnPropTypes[item.type];
            var Asn1Type = asn1$2[Asn1TypeName];

            if (!Asn1Type) {
              throw new Error("Cannot get ASN1 class by name '".concat(Asn1TypeName, "'"));
            }

            asn1Item = new Asn1Type({
              name: name
            });
          } else if (isConvertible(item.type)) {
            var instance = new item.type();
            asn1Item = instance.toSchema(name);
          } else {
            asn1Item = new asn1_7({
              name: name
            });
          }

          var optional = !!item.optional || item.defaultValue !== undefined;

          if (item.repeated) {
            asn1Item.name = "";
            var Container = item.repeated === "set" ? asn1_35 : asn1_36;
            asn1Item = new Container({
              name: "",
              value: [new asn1_6({
                name: name,
                value: asn1Item
              })]
            });
          }

          if (item.context !== null && item.context !== undefined) {
            if (item.implicit) {
              if (typeof item.type === "number" || isConvertible(item.type)) {
                var _Container = item.repeated ? asn1_39 : asn1_40;

                asn1Value.push(new _Container({
                  name: name,
                  optional: optional,
                  idBlock: {
                    tagClass: 3,
                    tagNumber: item.context
                  }
                }));
              } else {
                this.cache(item.type);
                var isRepeated = !!item.repeated;
                var value = !isRepeated ? this.get(item.type).schema : asn1Item;
                value = value.valueBlock ? value.valueBlock.value : value.value;
                asn1Value.push(new asn1_39({
                  name: !isRepeated ? name : "",
                  optional: optional,
                  idBlock: {
                    tagClass: 3,
                    tagNumber: item.context
                  },
                  value: value
                }));
              }
            } else {
              asn1Value.push(new asn1_39({
                optional: optional,
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
            throw new Error("Unsupported ASN1 type in use");
        }
      }
    }, {
      key: "set",
      value: function set(target, schema) {
        this.items.set(target, schema);
        return this;
      }
    }, {
      key: "findParentSchema",
      value: function findParentSchema(target) {
        var parent = target.__proto__;

        if (parent) {
          var schema = this.items.get(parent);
          return schema || this.findParentSchema(parent);
        }

        return null;
      }
    }]);

    return AsnSchemaStorage;
  }();

  var schemaStorage = new AsnSchemaStorage();

  var AsnType = function AsnType(options) {
    return function (target) {
      var schema;

      if (!schemaStorage.has(target)) {
        schema = schemaStorage.createDefault(target);
        schemaStorage.set(target, schema);
      } else {
        schema = schemaStorage.get(target);
      }

      Object.assign(schema, options);
    };
  };

  var AsnProp = function AsnProp(options) {
    return function (target, propertyKey) {
      var schema;

      if (!schemaStorage.has(target.constructor)) {
        schema = schemaStorage.createDefault(target.constructor);
        schemaStorage.set(target.constructor, schema);
      } else {
        schema = schemaStorage.get(target.constructor);
      }

      var copyOptions = Object.assign({}, options);

      if (typeof copyOptions.type === "number" && !copyOptions.converter) {
        var converterName = "Asn".concat(AsnPropTypes[options.type], "Converter");
        var defaultConverter = defaultConverters[converterName];

        if (!defaultConverter) {
          throw new Error("Cannot get '".concat(converterName, "' for property '").concat(propertyKey, "' of ").concat(target.constructor.name));
        }

        copyOptions.converter = defaultConverter;
      }

      schema.items[propertyKey] = copyOptions;
    };
  };

  var AsnSerializer = /*#__PURE__*/function () {
    function AsnSerializer() {
      _classCallCheck(this, AsnSerializer);
    }

    _createClass(AsnSerializer, null, [{
      key: "serialize",
      value: function serialize(obj) {
        if (obj instanceof asn1_41) {
          return obj.toBER(false);
        }

        return this.toASN(obj).toBER(false);
      }
    }, {
      key: "toASN",
      value: function toASN(obj) {
        var _this76 = this;

        if (obj && isConvertible(obj.constructor)) {
          return obj.toASN();
        }

        var target = obj.constructor;
        var schema = schemaStorage.get(target);
        schemaStorage.cache(target);
        var asn1Value = [];

        if (schema.itemType) {
          asn1Value = obj.map(function (o) {
            return _this76.toAsnItem({
              type: schema.itemType
            }, "[]", target, o);
          });
        } else {
          for (var key in schema.items) {
            var schemaItem = schema.items[key];
            var objProp = obj[key];

            if (objProp === undefined || schemaItem.defaultValue === objProp || _typeof(schemaItem.defaultValue) === "object" && _typeof(objProp) === "object" && isArrayEqual(this.serialize(schemaItem.defaultValue), this.serialize(objProp))) {
              continue;
            }

            var asn1Item = AsnSerializer.toAsnItem(schemaItem, key, target, objProp);

            if (typeof schemaItem.context === "number") {
              if (schemaItem.implicit) {
                if (!schemaItem.repeated && (typeof schemaItem.type === "number" || isConvertible(schemaItem.type))) {
                  var value = {};
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

        var asnSchema;

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
              throw new Error("Schema '".concat(target.name, "' has wrong data. Choice cannot be empty."));
            }

            asnSchema = asn1Value[0];
            break;
        }

        return asnSchema;
      }
    }, {
      key: "toAsnItem",
      value: function toAsnItem(schemaItem, key, target, objProp) {
        var _this77 = this;

        var asn1Item;

        if (typeof schemaItem.type === "number") {
          var converter = schemaItem.converter;

          if (!converter) {
            throw new Error("Property '".concat(key, "' doesn't have converter for type ").concat(AsnPropTypes[schemaItem.type], " in schema '").concat(target.name, "'"));
          }

          if (schemaItem.repeated) {
            var items = Array.from(objProp, function (element) {
              return converter.toASN(element);
            });
            var Container = schemaItem.repeated === "sequence" ? asn1_36 : asn1_35;
            asn1Item = new Container({
              value: items
            });
          } else {
            asn1Item = converter.toASN(objProp);
          }
        } else {
          if (schemaItem.repeated) {
            var _items = Array.from(objProp, function (element) {
              return _this77.toASN(element);
            });

            var _Container2 = schemaItem.repeated === "sequence" ? asn1_36 : asn1_35;

            asn1Item = new _Container2({
              value: _items
            });
          } else {
            asn1Item = this.toASN(objProp);
          }
        }

        return asn1Item;
      }
    }]);

    return AsnSerializer;
  }();

  var JsonError = /*#__PURE__*/function (_Error2) {
    _inherits(JsonError, _Error2);

    var _super136 = _createSuper(JsonError);

    function JsonError(message, innerError) {
      var _this78;

      _classCallCheck(this, JsonError);

      _this78 = _super136.call(this, innerError ? "".concat(message, ". See the inner exception for more details.") : message);
      _this78.message = message;
      _this78.innerError = innerError;
      return _this78;
    }

    return JsonError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  var ValidationError = /*#__PURE__*/function (_JsonError) {
    _inherits(ValidationError, _JsonError);

    var _super137 = _createSuper(ValidationError);

    function ValidationError() {
      _classCallCheck(this, ValidationError);

      return _super137.apply(this, arguments);
    }

    return ValidationError;
  }(JsonError);

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
      throw new TypeError("Value must be ".concat(JsonPropTypes[type]));
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

  var JsonSchemaStorage = /*#__PURE__*/function () {
    function JsonSchemaStorage() {
      _classCallCheck(this, JsonSchemaStorage);

      this.items = new Map();
    }

    _createClass(JsonSchemaStorage, [{
      key: "has",
      value: function has(target) {
        return this.items.has(target) || !!this.findParentSchema(target);
      }
    }, {
      key: "get",
      value: function get(target) {
        var schema = this.items.get(target) || this.findParentSchema(target);

        if (!schema) {
          throw new Error("Cannot get schema for current target");
        }

        return schema;
      }
    }, {
      key: "create",
      value: function create(target) {
        var schema = {
          names: {}
        };
        var parentSchema = this.findParentSchema(target);

        if (parentSchema) {
          Object.assign(schema, parentSchema);
          schema.names = {};

          for (var name in parentSchema.names) {
            schema.names[name] = Object.assign({}, parentSchema.names[name]);
          }
        }

        schema.target = target;
        return schema;
      }
    }, {
      key: "set",
      value: function set(target, schema) {
        this.items.set(target, schema);
        return this;
      }
    }, {
      key: "findParentSchema",
      value: function findParentSchema(target) {
        var parent = target.__proto__;

        if (parent) {
          var schema = this.items.get(parent);
          return schema || this.findParentSchema(parent);
        }

        return null;
      }
    }]);

    return JsonSchemaStorage;
  }();

  var DEFAULT_SCHEMA = "default";
  var schemaStorage$1 = new JsonSchemaStorage();

  var PatternValidation = /*#__PURE__*/function () {
    function PatternValidation(pattern) {
      _classCallCheck(this, PatternValidation);

      this.pattern = new RegExp(pattern);
    }

    _createClass(PatternValidation, [{
      key: "validate",
      value: function validate(value) {
        var pattern = new RegExp(this.pattern.source, this.pattern.flags);

        if (typeof value !== "string") {
          throw new ValidationError("Incoming value must be string");
        }

        if (!pattern.exec(value)) {
          throw new ValidationError("Value doesn't match to pattern '".concat(pattern.toString(), "'"));
        }
      }
    }]);

    return PatternValidation;
  }();

  var InclusiveValidation = /*#__PURE__*/function () {
    function InclusiveValidation() {
      var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Number.MIN_VALUE;
      var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.MAX_VALUE;

      _classCallCheck(this, InclusiveValidation);

      this.min = min;
      this.max = max;
    }

    _createClass(InclusiveValidation, [{
      key: "validate",
      value: function validate(value) {
        throwIfTypeIsWrong(value, JsonPropTypes.Number);

        if (!(this.min <= value && value <= this.max)) {
          var min = this.min === Number.MIN_VALUE ? "MIN" : this.min;
          var max = this.max === Number.MAX_VALUE ? "MAX" : this.max;
          throw new ValidationError("Value doesn't match to diapason [".concat(min, ",").concat(max, "]"));
        }
      }
    }]);

    return InclusiveValidation;
  }();

  var ExclusiveValidation = /*#__PURE__*/function () {
    function ExclusiveValidation() {
      var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Number.MIN_VALUE;
      var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.MAX_VALUE;

      _classCallCheck(this, ExclusiveValidation);

      this.min = min;
      this.max = max;
    }

    _createClass(ExclusiveValidation, [{
      key: "validate",
      value: function validate(value) {
        throwIfTypeIsWrong(value, JsonPropTypes.Number);

        if (!(this.min < value && value < this.max)) {
          var min = this.min === Number.MIN_VALUE ? "MIN" : this.min;
          var max = this.max === Number.MAX_VALUE ? "MAX" : this.max;
          throw new ValidationError("Value doesn't match to diapason (".concat(min, ",").concat(max, ")"));
        }
      }
    }]);

    return ExclusiveValidation;
  }();

  var LengthValidation = /*#__PURE__*/function () {
    function LengthValidation(length, minLength, maxLength) {
      _classCallCheck(this, LengthValidation);

      this.length = length;
      this.minLength = minLength;
      this.maxLength = maxLength;
    }

    _createClass(LengthValidation, [{
      key: "validate",
      value: function validate(value) {
        if (this.length !== undefined) {
          if (value.length !== this.length) {
            throw new ValidationError("Value length must be exactly ".concat(this.length, "."));
          }

          return;
        }

        if (this.minLength !== undefined) {
          if (value.length < this.minLength) {
            throw new ValidationError("Value length must be more than ".concat(this.minLength, "."));
          }
        }

        if (this.maxLength !== undefined) {
          if (value.length > this.maxLength) {
            throw new ValidationError("Value length must be less than ".concat(this.maxLength, "."));
          }
        }
      }
    }]);

    return LengthValidation;
  }();

  var EnumerationValidation = /*#__PURE__*/function () {
    function EnumerationValidation(enumeration) {
      _classCallCheck(this, EnumerationValidation);

      this.enumeration = enumeration;
    }

    _createClass(EnumerationValidation, [{
      key: "validate",
      value: function validate(value) {
        throwIfTypeIsWrong(value, JsonPropTypes.String);

        if (!this.enumeration.includes(value)) {
          throw new ValidationError("Value must be one of ".concat(this.enumeration.map(function (v) {
            return "'".concat(v, "'");
          }).join(", ")));
        }
      }
    }]);

    return EnumerationValidation;
  }();

  function getValidations(item) {
    var validations = [];

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

  var JsonProp = function JsonProp() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return function (target, propertyKey) {
      var errorMessage = "Cannot set type for ".concat(propertyKey, " property of ").concat(target.constructor.name, " schema");
      var schema;

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

      var defaultSchema = {
        type: JsonPropTypes.Any,
        validations: []
      };
      var copyOptions = Object.assign(defaultSchema, options);
      copyOptions.validations = getValidations(copyOptions);

      if (typeof copyOptions.type !== "number") {
        if (!schemaStorage$1.has(copyOptions.type) && !isConvertible$1(copyOptions.type)) {
          throw new Error("".concat(errorMessage, ". Assigning type doesn't have schema."));
        }
      }

      var schemaNames;

      if (Array.isArray(options.schema)) {
        schemaNames = options.schema;
      } else {
        schemaNames = [options.schema || DEFAULT_SCHEMA];
      }

      var _iterator14 = _createForOfIteratorHelper(schemaNames),
          _step14;

      try {
        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          var schemaName = _step14.value;

          if (!schema.names[schemaName]) {
            schema.names[schemaName] = {};
          }

          var namedSchema = schema.names[schemaName];
          namedSchema[propertyKey] = copyOptions;
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
      }
    };
  };

  var CryptoError = /*#__PURE__*/function (_Error3) {
    _inherits(CryptoError, _Error3);

    var _super138 = _createSuper(CryptoError);

    function CryptoError() {
      _classCallCheck(this, CryptoError);

      return _super138.apply(this, arguments);
    }

    return CryptoError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  var PemConverter = /*#__PURE__*/function () {
    function PemConverter() {
      _classCallCheck(this, PemConverter);
    }

    _createClass(PemConverter, null, [{
      key: "toArrayBuffer",
      value: function toArrayBuffer(pem) {
        var base64 = pem.replace(/-{5}(BEGIN|END) .*-{5}/g, "").replace("\r", "").replace("\n", "");
        return Convert.FromBase64(base64);
      }
    }, {
      key: "toUint8Array",
      value: function toUint8Array(pem) {
        var bytes = this.toArrayBuffer(pem);
        return new Uint8Array(bytes);
      }
    }, {
      key: "fromBufferSource",
      value: function fromBufferSource(buffer, tag) {
        var base64 = Convert.ToBase64(buffer);
        var sliced;
        var offset = 0;
        var rows = [];

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

        var upperCaseTag = tag.toUpperCase();
        return "-----BEGIN ".concat(upperCaseTag, "-----\n").concat(rows.join("\n"), "\n-----END ").concat(upperCaseTag, "-----");
      }
    }, {
      key: "isPEM",
      value: function isPEM(data) {
        return /-----BEGIN .+-----[A-Za-z0-9+\/\+\=\s\n]+-----END .+-----/i.test(data);
      }
    }, {
      key: "getTagName",
      value: function getTagName(pem) {
        if (!this.isPEM(pem)) {
          throw new Error("Bad parameter. Incoming data is not right PEM");
        }

        var res = /-----BEGIN (.+)-----/.exec(pem);

        if (!res) {
          throw new Error("Cannot get tag from PEM");
        }

        return res[1];
      }
    }, {
      key: "hasTagName",
      value: function hasTagName(pem, tagName) {
        var tag = this.getTagName(pem);
        return tagName.toLowerCase() === tag.toLowerCase();
      }
    }, {
      key: "isCertificate",
      value: function isCertificate(pem) {
        return this.hasTagName(pem, "certificate");
      }
    }, {
      key: "isCertificateRequest",
      value: function isCertificateRequest(pem) {
        return this.hasTagName(pem, "certificate request");
      }
    }, {
      key: "isCRL",
      value: function isCRL(pem) {
        return this.hasTagName(pem, "x509 crl");
      }
    }, {
      key: "isPublicKey",
      value: function isPublicKey(pem) {
        return this.hasTagName(pem, "public key");
      }
    }]);

    return PemConverter;
  }();

  var ObjectIdentifier = function ObjectIdentifier(value) {
    _classCallCheck(this, ObjectIdentifier);

    if (value) {
      this.value = value;
    }
  };

  __decorate$2([AsnProp({
    type: AsnPropTypes.ObjectIdentifier
  })], ObjectIdentifier.prototype, "value", void 0);

  ObjectIdentifier = __decorate$2([AsnType({
    type: AsnTypeTypes.Choice
  })], ObjectIdentifier);

  var AlgorithmIdentifier = function AlgorithmIdentifier(params) {
    _classCallCheck(this, AlgorithmIdentifier);

    Object.assign(this, params);
  };

  __decorate$2([AsnProp({
    type: AsnPropTypes.ObjectIdentifier
  })], AlgorithmIdentifier.prototype, "algorithm", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.Any,
    optional: true
  })], AlgorithmIdentifier.prototype, "parameters", void 0);

  var PrivateKeyInfo = function PrivateKeyInfo() {
    _classCallCheck(this, PrivateKeyInfo);

    this.version = 0;
    this.privateKeyAlgorithm = new AlgorithmIdentifier();
    this.privateKey = new ArrayBuffer(0);
  };

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

  var PublicKeyInfo = function PublicKeyInfo() {
    _classCallCheck(this, PublicKeyInfo);

    this.publicKeyAlgorithm = new AlgorithmIdentifier();
    this.publicKey = new ArrayBuffer(0);
  };

  __decorate$2([AsnProp({
    type: AlgorithmIdentifier
  })], PublicKeyInfo.prototype, "publicKeyAlgorithm", void 0);

  __decorate$2([AsnProp({
    type: AsnPropTypes.BitString
  })], PublicKeyInfo.prototype, "publicKey", void 0);

  var JsonBase64UrlArrayBufferConverter = {
    fromJSON: function fromJSON(value) {
      return Convert.FromBase64Url(value);
    },
    toJSON: function toJSON(value) {
      return Convert.ToBase64Url(new Uint8Array(value));
    }
  };
  var AsnIntegerArrayBufferConverter$1 = {
    fromASN: function fromASN(value) {
      var valueHex = value.valueBlock.valueHex;
      return !new Uint8Array(valueHex)[0] ? value.valueBlock.valueHex.slice(1) : value.valueBlock.valueHex;
    },
    toASN: function toASN(value) {
      var valueHex = new Uint8Array(value)[0] > 127 ? Buffer.concat([Buffer.from([0]), Buffer.from(value)]) : Buffer.from(value);
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

  var RsaPrivateKey = function RsaPrivateKey() {
    _classCallCheck(this, RsaPrivateKey);

    this.version = 0;
    this.modulus = new ArrayBuffer(0);
    this.publicExponent = new ArrayBuffer(0);
    this.privateExponent = new ArrayBuffer(0);
    this.prime1 = new ArrayBuffer(0);
    this.prime2 = new ArrayBuffer(0);
    this.exponent1 = new ArrayBuffer(0);
    this.exponent2 = new ArrayBuffer(0);
    this.coefficient = new ArrayBuffer(0);
  };

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

  var RsaPublicKey = function RsaPublicKey() {
    _classCallCheck(this, RsaPublicKey);

    this.modulus = new ArrayBuffer(0);
    this.publicExponent = new ArrayBuffer(0);
  };

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

  var EcPublicKey = /*#__PURE__*/function () {
    function EcPublicKey(value) {
      _classCallCheck(this, EcPublicKey);

      this.value = new ArrayBuffer(0);

      if (value) {
        this.value = value;
      }
    }

    _createClass(EcPublicKey, [{
      key: "toJSON",
      value: function toJSON() {
        var bytes = new Uint8Array(this.value);

        if (bytes[0] !== 0x04) {
          throw new CryptoError("Wrong ECPoint. Current version supports only Uncompressed (0x04) point");
        }

        bytes = new Uint8Array(this.value.slice(1));
        var size = bytes.length / 2;
        var offset = 0;
        var json = {
          x: Convert.ToBase64Url(bytes.buffer.slice(offset, offset + size)),
          y: Convert.ToBase64Url(bytes.buffer.slice(offset + size, offset + size + size))
        };
        return json;
      }
    }, {
      key: "fromJSON",
      value: function fromJSON(json) {
        if (!("x" in json)) {
          throw new Error("x: Missing required property");
        }

        if (!("y" in json)) {
          throw new Error("y: Missing required property");
        }

        var x = Convert.FromBase64Url(json.x);
        var y = Convert.FromBase64Url(json.y);
        var value = Buffer.concat([new Uint8Array([0x04]), new Uint8Array(x), new Uint8Array(y)]);
        this.value = new Uint8Array(value).buffer;
        return this;
      }
    }]);

    return EcPublicKey;
  }();

  __decorate$2([AsnProp({
    type: AsnPropTypes.OctetString
  })], EcPublicKey.prototype, "value", void 0);

  EcPublicKey = __decorate$2([AsnType({
    type: AsnTypeTypes.Choice
  })], EcPublicKey);

  var EcPrivateKey = /*#__PURE__*/function () {
    function EcPrivateKey() {
      _classCallCheck(this, EcPrivateKey);

      this.version = 1;
      this.privateKey = new ArrayBuffer(0);
    }

    _createClass(EcPrivateKey, [{
      key: "fromJSON",
      value: function fromJSON(json) {
        if (!("d" in json)) {
          throw new Error("d: Missing required property");
        }

        this.privateKey = Convert.FromBase64Url(json.d);

        if ("x" in json) {
          var publicKey = new EcPublicKey();
          publicKey.fromJSON(json);
          this.publicKey = AsnSerializer.toASN(publicKey).valueBlock.valueHex;
        }

        return this;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        var jwk = {};
        jwk.d = Convert.ToBase64Url(this.privateKey);

        if (this.publicKey) {
          Object.assign(jwk, new EcPublicKey(this.publicKey).toJSON());
        }

        return jwk;
      }
    }]);

    return EcPrivateKey;
  }();

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

  var AsnIntegerWithoutPaddingConverter = {
    fromASN: function fromASN(value) {
      var bytes = new Uint8Array(value.valueBlock.valueHex);
      return bytes[0] === 0 ? bytes.buffer.slice(1) : bytes.buffer;
    },
    toASN: function toASN(value) {
      var bytes = new Uint8Array(value);

      if (bytes[0] > 127) {
        var newValue = new Uint8Array(bytes.length + 1);
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

  var EcDsaSignature = /*#__PURE__*/function () {
    function EcDsaSignature() {
      _classCallCheck(this, EcDsaSignature);

      this.r = new ArrayBuffer(0);
      this.s = new ArrayBuffer(0);
    }

    _createClass(EcDsaSignature, [{
      key: "toWebCryptoSignature",
      value: function toWebCryptoSignature(pointSize) {
        pointSize = this.getPointSize();
        var r = this.addPadding(pointSize, BufferSourceConverter.toUint8Array(this.r));
        var s = this.addPadding(pointSize, BufferSourceConverter.toUint8Array(this.s));
        var wcSignature = new Uint8Array(r.byteLength + s.byteLength);
        wcSignature.set(r, 0);
        wcSignature.set(s, r.length);
        return wcSignature.buffer;
      }
    }, {
      key: "getPointSize",
      value: function getPointSize() {
        var size = Math.max(this.r.byteLength, this.s.byteLength);

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
    }, {
      key: "addPadding",
      value: function addPadding(pointSize, bytes) {
        var res = new Uint8Array(pointSize);
        var uint8Array = BufferSourceConverter.toUint8Array(bytes);
        res.set(uint8Array, pointSize - uint8Array.length);
        return res;
      }
    }, {
      key: "removePadding",
      value: function removePadding(bytes) {
        var uint8Array = BufferSourceConverter.toUint8Array(bytes);

        for (var i = 0; i < uint8Array.length; i++) {
          if (!uint8Array[i]) {
            continue;
          }

          return uint8Array.slice(i);
        }

        return new Uint8Array(0);
      }
    }], [{
      key: "fromWebCryptoSignature",
      value: function fromWebCryptoSignature(value) {
        var wcSignature = BufferSourceConverter.toUint8Array(value);
        var pointSize = wcSignature.byteLength / 2;
        var ecSignature = new this();
        ecSignature.r = ecSignature.removePadding(wcSignature.slice(0, pointSize));
        ecSignature.s = ecSignature.removePadding(wcSignature.slice(pointSize, pointSize * 2));
        return ecSignature;
      }
    }]);

    return EcDsaSignature;
  }();

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

    var algProto = new AlgorithmProto();

    if (typeof algorithm === "string") {
      algProto.fromAlgorithm({
        name: algorithm
      });
    } else if (isHashedAlgorithm(algorithm)) {
      var preparedAlgorithm = _objectSpread2({}, algorithm);

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
    if (!(algorithm && (_typeof(algorithm) === "object" || typeof algorithm === "string"))) {
      throw new TypeError("".concat(param, ": Is wrong type. Must be Object or String"));
    }

    if (_typeof(algorithm) === "object" && !("name" in algorithm)) {
      throw new TypeError("".concat(param, ": Required property 'name' is missed"));
    }
  }

  function checkCryptoKey(data, param) {
    if (!isCryptoKey(data)) {
      throw new TypeError("".concat(param, ": Is not type CryptoKey"));
    }
  }

  function checkCryptoCertificate(data, param) {
    if (!isCryptoCertificate(data)) {
      throw new TypeError("".concat(param, ": Is not type CryptoCertificate"));
    }
  }

  function checkBufferSource(data, param) {
    if (!BufferSourceConverter.isBufferSource(data)) {
      throw new TypeError("".concat(param, ": Is wrong type. Must be ArrayBuffer or ArrayBuffer view"));
    }
  }

  function checkArray(data, param) {
    if (!Array.isArray(data)) {
      throw new TypeError("".concat(param, ": Is not type Array"));
    }
  }

  function checkPrimitive(data, type, param) {
    if (_typeof(data) !== type) {
      throw new TypeError("".concat(param, ": Is not type '").concat(type, "'"));
    }
  }

  var IMPORT_CERT_FORMATS = ["raw", "pem", "x509", "request"];

  var CertificateStorage = /*#__PURE__*/function () {
    function CertificateStorage(provider) {
      _classCallCheck(this, CertificateStorage);

      this.provider = provider;
    }

    _createClass(CertificateStorage, [{
      key: "indexOf",
      value: function () {
        var _indexOf = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee77(item) {
          var proto, result;
          return regeneratorRuntime.wrap(function _callee77$(_context77) {
            while (1) {
              switch (_context77.prev = _context77.next) {
                case 0:
                  checkCryptoCertificate(item, "item");
                  proto = new CertificateStorageIndexOfActionProto();
                  proto.providerID = this.provider.id;
                  proto.item = item;
                  _context77.next = 6;
                  return this.provider.client.send(proto);

                case 6:
                  result = _context77.sent;
                  return _context77.abrupt("return", result ? Convert.ToUtf8String(result) : null);

                case 8:
                case "end":
                  return _context77.stop();
              }
            }
          }, _callee77, this);
        }));

        function indexOf(_x84) {
          return _indexOf.apply(this, arguments);
        }

        return indexOf;
      }()
    }, {
      key: "hasItem",
      value: function () {
        var _hasItem = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee78(item) {
          var index;
          return regeneratorRuntime.wrap(function _callee78$(_context78) {
            while (1) {
              switch (_context78.prev = _context78.next) {
                case 0:
                  _context78.next = 2;
                  return this.indexOf(item);

                case 2:
                  index = _context78.sent;
                  return _context78.abrupt("return", !!index);

                case 4:
                case "end":
                  return _context78.stop();
              }
            }
          }, _callee78, this);
        }));

        function hasItem(_x85) {
          return _hasItem.apply(this, arguments);
        }

        return hasItem;
      }()
    }, {
      key: "exportCert",
      value: function () {
        var _exportCert = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee79(format, item) {
          var proto, result, header, pem;
          return regeneratorRuntime.wrap(function _callee79$(_context79) {
            while (1) {
              switch (_context79.prev = _context79.next) {
                case 0:
                  checkPrimitive(format, "string", "format");
                  checkCryptoCertificate(item, "item");
                  proto = new CertificateStorageExportActionProto();
                  proto.providerID = this.provider.id;
                  proto.format = "raw";
                  proto.item = item;
                  _context79.next = 8;
                  return this.provider.client.send(proto);

                case 8:
                  result = _context79.sent;

                  if (!(format === "raw")) {
                    _context79.next = 13;
                    break;
                  }

                  return _context79.abrupt("return", result);

                case 13:
                  header = "";
                  _context79.t0 = item.type;
                  _context79.next = _context79.t0 === "x509" ? 17 : _context79.t0 === "request" ? 19 : 21;
                  break;

                case 17:
                  header = "CERTIFICATE";
                  return _context79.abrupt("break", 22);

                case 19:
                  header = "CERTIFICATE REQUEST";
                  return _context79.abrupt("break", 22);

                case 21:
                  throw new Error("Cannot create PEM for unknown type of certificate item");

                case 22:
                  pem = PemConverter.fromBufferSource(result, header);
                  return _context79.abrupt("return", pem);

                case 24:
                case "end":
                  return _context79.stop();
              }
            }
          }, _callee79, this);
        }));

        function exportCert(_x86, _x87) {
          return _exportCert.apply(this, arguments);
        }

        return exportCert;
      }()
    }, {
      key: "importCert",
      value: function () {
        var _importCert = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee80(format, data, algorithm, keyUsages) {
          var algProto, rawData, proto, result, certItem;
          return regeneratorRuntime.wrap(function _callee80$(_context80) {
            while (1) {
              switch (_context80.prev = _context80.next) {
                case 0:
                  checkPrimitive(format, "string", "format");

                  if (~IMPORT_CERT_FORMATS.indexOf(format)) {
                    _context80.next = 3;
                    break;
                  }

                  throw new TypeError("format: Is invalid value. Must be ".concat(IMPORT_CERT_FORMATS.join(", ")));

                case 3:
                  if (format === "pem") {
                    checkPrimitive(data, "string", "data");
                  } else {
                    checkBufferSource(data, "data");
                  }

                  checkAlgorithm(algorithm, "algorithm");
                  checkArray(keyUsages, "keyUsages");
                  algProto = prepareAlgorithm(algorithm);

                  if (!BufferSourceConverter.isBufferSource(data)) {
                    _context80.next = 11;
                    break;
                  }

                  rawData = BufferSourceConverter.toArrayBuffer(data);
                  _context80.next = 16;
                  break;

                case 11:
                  if (!(typeof data === "string")) {
                    _context80.next = 15;
                    break;
                  }

                  rawData = PemConverter.toArrayBuffer(data);
                  _context80.next = 16;
                  break;

                case 15:
                  throw new TypeError("data: Is not type String, ArrayBuffer or ArrayBufferView");

                case 16:
                  proto = new CertificateStorageImportActionProto();
                  proto.providerID = this.provider.id;
                  proto.format = "raw";
                  proto.data = rawData;
                  proto.algorithm = algProto;
                  proto.keyUsages = keyUsages;
                  _context80.next = 24;
                  return this.provider.client.send(proto);

                case 24:
                  result = _context80.sent;
                  _context80.next = 27;
                  return CryptoCertificateProto.importProto(result);

                case 27:
                  certItem = _context80.sent;

                  if (!((format === "request" || format === "x509") && certItem.type !== format)) {
                    _context80.next = 30;
                    break;
                  }

                  throw new TypeError("Imported item is not ".concat(format));

                case 30:
                  return _context80.abrupt("return", this.prepareCertItem(certItem));

                case 31:
                case "end":
                  return _context80.stop();
              }
            }
          }, _callee80, this);
        }));

        function importCert(_x88, _x89, _x90, _x91) {
          return _importCert.apply(this, arguments);
        }

        return importCert;
      }()
    }, {
      key: "keys",
      value: function () {
        var _keys = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee81() {
          var proto, result, _keys2;

          return regeneratorRuntime.wrap(function _callee81$(_context81) {
            while (1) {
              switch (_context81.prev = _context81.next) {
                case 0:
                  proto = new CertificateStorageKeysActionProto();
                  proto.providerID = this.provider.id;
                  _context81.next = 4;
                  return this.provider.client.send(proto);

                case 4:
                  result = _context81.sent;

                  if (!result) {
                    _context81.next = 8;
                    break;
                  }

                  _keys2 = Convert.ToUtf8String(result).split(",");
                  return _context81.abrupt("return", _keys2);

                case 8:
                  return _context81.abrupt("return", []);

                case 9:
                case "end":
                  return _context81.stop();
              }
            }
          }, _callee81, this);
        }));

        function keys() {
          return _keys.apply(this, arguments);
        }

        return keys;
      }()
    }, {
      key: "getItem",
      value: function () {
        var _getItem = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee82(key, algorithm, keyUsages) {
          var proto, result, certItem;
          return regeneratorRuntime.wrap(function _callee82$(_context82) {
            while (1) {
              switch (_context82.prev = _context82.next) {
                case 0:
                  checkPrimitive(key, "string", "key");

                  if (algorithm) {
                    checkAlgorithm(algorithm, "algorithm");
                    checkArray(keyUsages, "keyUsages");
                  }

                  proto = new CertificateStorageGetItemActionProto();
                  proto.providerID = this.provider.id;
                  proto.key = key;

                  if (algorithm) {
                    proto.algorithm = prepareAlgorithm(algorithm);
                    proto.keyUsages = keyUsages;
                  }

                  _context82.next = 8;
                  return this.provider.client.send(proto);

                case 8:
                  result = _context82.sent;

                  if (!(result && result.byteLength)) {
                    _context82.next = 14;
                    break;
                  }

                  _context82.next = 12;
                  return CryptoCertificateProto.importProto(result);

                case 12:
                  certItem = _context82.sent;
                  return _context82.abrupt("return", this.prepareCertItem(certItem));

                case 14:
                  throw new Error("Cannot get CryptoCertificate from storage by index");

                case 15:
                case "end":
                  return _context82.stop();
              }
            }
          }, _callee82, this);
        }));

        function getItem(_x92, _x93, _x94) {
          return _getItem.apply(this, arguments);
        }

        return getItem;
      }()
    }, {
      key: "setItem",
      value: function () {
        var _setItem = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee83(value) {
          var proto, data;
          return regeneratorRuntime.wrap(function _callee83$(_context83) {
            while (1) {
              switch (_context83.prev = _context83.next) {
                case 0:
                  checkCryptoCertificate(value, "value");
                  proto = new CertificateStorageSetItemActionProto();
                  proto.providerID = this.provider.id;
                  proto.item = value;
                  _context83.next = 6;
                  return this.provider.client.send(proto);

                case 6:
                  data = _context83.sent;
                  return _context83.abrupt("return", Convert.ToUtf8String(data));

                case 8:
                case "end":
                  return _context83.stop();
              }
            }
          }, _callee83, this);
        }));

        function setItem(_x95) {
          return _setItem.apply(this, arguments);
        }

        return setItem;
      }()
    }, {
      key: "removeItem",
      value: function () {
        var _removeItem = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee84(key) {
          var proto;
          return regeneratorRuntime.wrap(function _callee84$(_context84) {
            while (1) {
              switch (_context84.prev = _context84.next) {
                case 0:
                  checkPrimitive(key, "string", "key");
                  proto = new CertificateStorageRemoveItemActionProto();
                  proto.providerID = this.provider.id;
                  proto.key = key;
                  _context84.next = 6;
                  return this.provider.client.send(proto);

                case 6:
                case "end":
                  return _context84.stop();
              }
            }
          }, _callee84, this);
        }));

        function removeItem(_x96) {
          return _removeItem.apply(this, arguments);
        }

        return removeItem;
      }()
    }, {
      key: "clear",
      value: function () {
        var _clear = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee85() {
          var proto;
          return regeneratorRuntime.wrap(function _callee85$(_context85) {
            while (1) {
              switch (_context85.prev = _context85.next) {
                case 0:
                  proto = new CertificateStorageClearActionProto();
                  proto.providerID = this.provider.id;
                  _context85.next = 4;
                  return this.provider.client.send(proto);

                case 4:
                case "end":
                  return _context85.stop();
              }
            }
          }, _callee85, this);
        }));

        function clear() {
          return _clear.apply(this, arguments);
        }

        return clear;
      }()
    }, {
      key: "getChain",
      value: function () {
        var _getChain = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee86(value) {
          var proto, data, resultProto;
          return regeneratorRuntime.wrap(function _callee86$(_context86) {
            while (1) {
              switch (_context86.prev = _context86.next) {
                case 0:
                  checkCryptoCertificate(value, "value");
                  proto = new CertificateStorageGetChainActionProto();
                  proto.providerID = this.provider.id;
                  proto.item = value;
                  _context86.next = 6;
                  return this.provider.client.send(proto);

                case 6:
                  data = _context86.sent;
                  _context86.next = 9;
                  return CertificateStorageGetChainResultProto.importProto(data);

                case 9:
                  resultProto = _context86.sent;
                  return _context86.abrupt("return", resultProto.items);

                case 11:
                case "end":
                  return _context86.stop();
              }
            }
          }, _callee86, this);
        }));

        function getChain(_x97) {
          return _getChain.apply(this, arguments);
        }

        return getChain;
      }()
    }, {
      key: "getCRL",
      value: function () {
        var _getCRL = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee87(url) {
          var proto, data;
          return regeneratorRuntime.wrap(function _callee87$(_context87) {
            while (1) {
              switch (_context87.prev = _context87.next) {
                case 0:
                  checkPrimitive(url, "string", "url");
                  proto = new CertificateStorageGetCRLActionProto();
                  proto.providerID = this.provider.id;
                  proto.url = url;
                  _context87.next = 6;
                  return this.provider.client.send(proto);

                case 6:
                  data = _context87.sent;
                  return _context87.abrupt("return", data);

                case 8:
                case "end":
                  return _context87.stop();
              }
            }
          }, _callee87, this);
        }));

        function getCRL(_x98) {
          return _getCRL.apply(this, arguments);
        }

        return getCRL;
      }()
    }, {
      key: "getOCSP",
      value: function () {
        var _getOCSP = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee88(url, request, options) {
          var proto, key, data;
          return regeneratorRuntime.wrap(function _callee88$(_context88) {
            while (1) {
              switch (_context88.prev = _context88.next) {
                case 0:
                  checkPrimitive(url, "string", "url");
                  checkBufferSource(request, "request");
                  proto = new CertificateStorageGetOCSPActionProto();
                  proto.providerID = this.provider.id;
                  proto.url = url;
                  proto.request = BufferSourceConverter.toArrayBuffer(request);

                  if (options) {
                    for (key in options) {
                      proto.options[key] = options[key];
                    }
                  }

                  _context88.next = 9;
                  return this.provider.client.send(proto);

                case 9:
                  data = _context88.sent;
                  return _context88.abrupt("return", data);

                case 11:
                case "end":
                  return _context88.stop();
              }
            }
          }, _callee88, this);
        }));

        function getOCSP(_x99, _x100, _x101) {
          return _getOCSP.apply(this, arguments);
        }

        return getOCSP;
      }()
    }, {
      key: "prepareCertItem",
      value: function () {
        var _prepareCertItem = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee89(item) {
          var raw, result;
          return regeneratorRuntime.wrap(function _callee89$(_context89) {
            while (1) {
              switch (_context89.prev = _context89.next) {
                case 0:
                  _context89.next = 2;
                  return item.exportProto();

                case 2:
                  raw = _context89.sent;
                  _context89.t0 = item.type;
                  _context89.next = _context89.t0 === "x509" ? 6 : _context89.t0 === "request" ? 10 : 14;
                  break;

                case 6:
                  _context89.next = 8;
                  return CryptoX509CertificateProto.importProto(raw);

                case 8:
                  result = _context89.sent;
                  return _context89.abrupt("break", 15);

                case 10:
                  _context89.next = 12;
                  return CryptoX509CertificateRequestProto.importProto(raw);

                case 12:
                  result = _context89.sent;
                  return _context89.abrupt("break", 15);

                case 14:
                  throw new Error("Unsupported CertificateItem type '".concat(item.type, "'"));

                case 15:
                  result.provider = this.provider;
                  return _context89.abrupt("return", result);

                case 17:
                case "end":
                  return _context89.stop();
              }
            }
          }, _callee89, this);
        }));

        function prepareCertItem(_x102) {
          return _prepareCertItem.apply(this, arguments);
        }

        return prepareCertItem;
      }()
    }]);

    return CertificateStorage;
  }();

  var KeyStorage = /*#__PURE__*/function () {
    function KeyStorage(service) {
      _classCallCheck(this, KeyStorage);

      this.service = service;
    }

    _createClass(KeyStorage, [{
      key: "keys",
      value: function () {
        var _keys3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee90() {
          var proto, result, _keys4;

          return regeneratorRuntime.wrap(function _callee90$(_context90) {
            while (1) {
              switch (_context90.prev = _context90.next) {
                case 0:
                  proto = new KeyStorageKeysActionProto();
                  proto.providerID = this.service.id;
                  _context90.next = 4;
                  return this.service.client.send(proto);

                case 4:
                  result = _context90.sent;

                  if (!result) {
                    _context90.next = 8;
                    break;
                  }

                  _keys4 = Convert.ToUtf8String(result).split(",");
                  return _context90.abrupt("return", _keys4);

                case 8:
                  return _context90.abrupt("return", []);

                case 9:
                case "end":
                  return _context90.stop();
              }
            }
          }, _callee90, this);
        }));

        function keys() {
          return _keys3.apply(this, arguments);
        }

        return keys;
      }()
    }, {
      key: "indexOf",
      value: function () {
        var _indexOf2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee91(item) {
          var proto, result;
          return regeneratorRuntime.wrap(function _callee91$(_context91) {
            while (1) {
              switch (_context91.prev = _context91.next) {
                case 0:
                  checkCryptoKey(item, "item");
                  proto = new KeyStorageIndexOfActionProto();
                  proto.providerID = this.service.id;
                  proto.item = item;
                  _context91.next = 6;
                  return this.service.client.send(proto);

                case 6:
                  result = _context91.sent;
                  return _context91.abrupt("return", result ? Convert.ToUtf8String(result) : null);

                case 8:
                case "end":
                  return _context91.stop();
              }
            }
          }, _callee91, this);
        }));

        function indexOf(_x103) {
          return _indexOf2.apply(this, arguments);
        }

        return indexOf;
      }()
    }, {
      key: "hasItem",
      value: function () {
        var _hasItem2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee92(item) {
          var index;
          return regeneratorRuntime.wrap(function _callee92$(_context92) {
            while (1) {
              switch (_context92.prev = _context92.next) {
                case 0:
                  _context92.next = 2;
                  return this.indexOf(item);

                case 2:
                  index = _context92.sent;
                  return _context92.abrupt("return", !!index);

                case 4:
                case "end":
                  return _context92.stop();
              }
            }
          }, _callee92, this);
        }));

        function hasItem(_x104) {
          return _hasItem2.apply(this, arguments);
        }

        return hasItem;
      }()
    }, {
      key: "getItem",
      value: function () {
        var _getItem2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee93(key, algorithm, extractable, usages) {
          var proto, result, socketKey;
          return regeneratorRuntime.wrap(function _callee93$(_context93) {
            while (1) {
              switch (_context93.prev = _context93.next) {
                case 0:
                  checkPrimitive(key, "string", "key");

                  if (algorithm) {
                    checkAlgorithm(algorithm, "algorithm");
                    checkPrimitive(extractable, "boolean", "extractable");
                    checkArray(usages, "usages");
                  }

                  proto = new KeyStorageGetItemActionProto();
                  proto.providerID = this.service.id;
                  proto.key = key;

                  if (algorithm) {
                    proto.algorithm = prepareAlgorithm(algorithm);
                    proto.extractable = extractable;
                    proto.keyUsages = usages;
                  }

                  _context93.next = 8;
                  return this.service.client.send(proto);

                case 8:
                  result = _context93.sent;

                  if (!(result && result.byteLength)) {
                    _context93.next = 15;
                    break;
                  }

                  _context93.next = 12;
                  return CryptoKeyProto.importProto(result);

                case 12:
                  socketKey = _context93.sent;
                  _context93.next = 16;
                  break;

                case 15:
                  throw new Error("Cannot get CryptoKey from key storage by index");

                case 16:
                  return _context93.abrupt("return", socketKey);

                case 17:
                case "end":
                  return _context93.stop();
              }
            }
          }, _callee93, this);
        }));

        function getItem(_x105, _x106, _x107, _x108) {
          return _getItem2.apply(this, arguments);
        }

        return getItem;
      }()
    }, {
      key: "setItem",
      value: function () {
        var _setItem2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee94(value) {
          var proto, data;
          return regeneratorRuntime.wrap(function _callee94$(_context94) {
            while (1) {
              switch (_context94.prev = _context94.next) {
                case 0:
                  checkCryptoKey(value, "value");
                  proto = new KeyStorageSetItemActionProto();
                  proto.providerID = this.service.id;
                  proto.item = value;
                  _context94.next = 6;
                  return this.service.client.send(proto);

                case 6:
                  data = _context94.sent;
                  return _context94.abrupt("return", Convert.ToUtf8String(data));

                case 8:
                case "end":
                  return _context94.stop();
              }
            }
          }, _callee94, this);
        }));

        function setItem(_x109) {
          return _setItem2.apply(this, arguments);
        }

        return setItem;
      }()
    }, {
      key: "removeItem",
      value: function () {
        var _removeItem2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee95(key) {
          var proto;
          return regeneratorRuntime.wrap(function _callee95$(_context95) {
            while (1) {
              switch (_context95.prev = _context95.next) {
                case 0:
                  checkPrimitive(key, "string", "key");
                  proto = new KeyStorageRemoveItemActionProto();
                  proto.providerID = this.service.id;
                  proto.key = key;
                  _context95.next = 6;
                  return this.service.client.send(proto);

                case 6:
                case "end":
                  return _context95.stop();
              }
            }
          }, _callee95, this);
        }));

        function removeItem(_x110) {
          return _removeItem2.apply(this, arguments);
        }

        return removeItem;
      }()
    }, {
      key: "clear",
      value: function () {
        var _clear2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee96() {
          var proto;
          return regeneratorRuntime.wrap(function _callee96$(_context96) {
            while (1) {
              switch (_context96.prev = _context96.next) {
                case 0:
                  proto = new KeyStorageClearActionProto();
                  proto.providerID = this.service.id;
                  _context96.next = 4;
                  return this.service.client.send(proto);

                case 4:
                case "end":
                  return _context96.stop();
              }
            }
          }, _callee96, this);
        }));

        function clear() {
          return _clear2.apply(this, arguments);
        }

        return clear;
      }()
    }]);

    return KeyStorage;
  }();

  var SubtleCrypto = /*#__PURE__*/function () {
    function SubtleCrypto(crypto) {
      _classCallCheck(this, SubtleCrypto);

      this.service = crypto;
    }

    _createClass(SubtleCrypto, [{
      key: "encrypt",
      value: function () {
        var _encrypt3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee97(algorithm, key, data) {
          return regeneratorRuntime.wrap(function _callee97$(_context97) {
            while (1) {
              switch (_context97.prev = _context97.next) {
                case 0:
                  return _context97.abrupt("return", this.encryptData(algorithm, key, data, "encrypt"));

                case 1:
                case "end":
                  return _context97.stop();
              }
            }
          }, _callee97, this);
        }));

        function encrypt(_x111, _x112, _x113) {
          return _encrypt3.apply(this, arguments);
        }

        return encrypt;
      }()
    }, {
      key: "decrypt",
      value: function () {
        var _decrypt3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee98(algorithm, key, data) {
          return regeneratorRuntime.wrap(function _callee98$(_context98) {
            while (1) {
              switch (_context98.prev = _context98.next) {
                case 0:
                  return _context98.abrupt("return", this.encryptData(algorithm, key, data, "decrypt"));

                case 1:
                case "end":
                  return _context98.stop();
              }
            }
          }, _callee98, this);
        }));

        function decrypt(_x114, _x115, _x116) {
          return _decrypt3.apply(this, arguments);
        }

        return decrypt;
      }()
    }, {
      key: "deriveBits",
      value: function () {
        var _deriveBits = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee99(algorithm, baseKey, length) {
          var algProto, action, result;
          return regeneratorRuntime.wrap(function _callee99$(_context99) {
            while (1) {
              switch (_context99.prev = _context99.next) {
                case 0:
                  checkAlgorithm(algorithm, "algorithm");
                  checkCryptoKey(baseKey, "baseKey");
                  checkPrimitive(length, "number", "length");
                  algProto = prepareAlgorithm(algorithm);
                  checkCryptoKey(algProto.public, "algorithm.public");
                  _context99.next = 7;
                  return Cast(algProto.public).exportProto();

                case 7:
                  algProto.public = _context99.sent;
                  action = new DeriveBitsActionProto();
                  action.providerID = this.service.id;
                  action.algorithm = algProto;
                  action.key = baseKey;
                  action.length = length;
                  _context99.next = 15;
                  return this.service.client.send(action);

                case 15:
                  result = _context99.sent;
                  return _context99.abrupt("return", result);

                case 17:
                case "end":
                  return _context99.stop();
              }
            }
          }, _callee99, this);
        }));

        function deriveBits(_x117, _x118, _x119) {
          return _deriveBits.apply(this, arguments);
        }

        return deriveBits;
      }()
    }, {
      key: "deriveKey",
      value: function () {
        var _deriveKey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee100(algorithm, baseKey, derivedKeyType, extractable, keyUsages) {
          var algProto, algKeyType, action, result;
          return regeneratorRuntime.wrap(function _callee100$(_context100) {
            while (1) {
              switch (_context100.prev = _context100.next) {
                case 0:
                  checkAlgorithm(algorithm, "algorithm");
                  checkCryptoKey(baseKey, "baseKey");
                  checkAlgorithm(derivedKeyType, "algorithm");
                  checkPrimitive(extractable, "boolean", "extractable");
                  checkArray(keyUsages, "keyUsages");
                  algProto = prepareAlgorithm(algorithm);
                  checkCryptoKey(algProto.public, "algorithm.public");
                  _context100.next = 9;
                  return Cast(algProto.public).exportProto();

                case 9:
                  algProto.public = _context100.sent;
                  algKeyType = prepareAlgorithm(derivedKeyType);
                  action = new DeriveKeyActionProto();
                  action.providerID = this.service.id;
                  action.algorithm = algProto;
                  action.derivedKeyType.fromAlgorithm(algKeyType);
                  action.key = baseKey;
                  action.extractable = extractable;
                  action.usage = keyUsages;
                  _context100.next = 20;
                  return this.service.client.send(action);

                case 20:
                  result = _context100.sent;
                  _context100.next = 23;
                  return CryptoKeyProto.importProto(result);

                case 23:
                  return _context100.abrupt("return", _context100.sent);

                case 24:
                case "end":
                  return _context100.stop();
              }
            }
          }, _callee100, this);
        }));

        function deriveKey(_x120, _x121, _x122, _x123, _x124) {
          return _deriveKey.apply(this, arguments);
        }

        return deriveKey;
      }()
    }, {
      key: "digest",
      value: function () {
        var _digest = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee101(algorithm, data) {
          return regeneratorRuntime.wrap(function _callee101$(_context101) {
            while (1) {
              switch (_context101.prev = _context101.next) {
                case 0:
                  return _context101.abrupt("return", getEngine().crypto.subtle.digest(algorithm, data));

                case 1:
                case "end":
                  return _context101.stop();
              }
            }
          }, _callee101);
        }));

        function digest(_x125, _x126) {
          return _digest.apply(this, arguments);
        }

        return digest;
      }()
    }, {
      key: "generateKey",
      value: function () {
        var _generateKey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee102(algorithm, extractable, keyUsages) {
          var algProto, action, result, keyPair, key;
          return regeneratorRuntime.wrap(function _callee102$(_context102) {
            while (1) {
              switch (_context102.prev = _context102.next) {
                case 0:
                  checkAlgorithm(algorithm, "algorithm");
                  checkPrimitive(extractable, "boolean", "extractable");
                  checkArray(keyUsages, "keyUsages");
                  algProto = prepareAlgorithm(algorithm);
                  action = new GenerateKeyActionProto();
                  action.providerID = this.service.id;
                  action.algorithm = algProto;
                  action.extractable = extractable;
                  action.usage = keyUsages;
                  _context102.next = 11;
                  return this.service.client.send(action);

                case 11:
                  result = _context102.sent;
                  _context102.prev = 12;
                  _context102.next = 15;
                  return CryptoKeyPairProto.importProto(result);

                case 15:
                  keyPair = _context102.sent;
                  return _context102.abrupt("return", keyPair);

                case 19:
                  _context102.prev = 19;
                  _context102.t0 = _context102["catch"](12);
                  _context102.next = 23;
                  return CryptoKeyProto.importProto(result);

                case 23:
                  key = _context102.sent;
                  return _context102.abrupt("return", key);

                case 25:
                case "end":
                  return _context102.stop();
              }
            }
          }, _callee102, this, [[12, 19]]);
        }));

        function generateKey(_x127, _x128, _x129) {
          return _generateKey.apply(this, arguments);
        }

        return generateKey;
      }()
    }, {
      key: "exportKey",
      value: function () {
        var _exportKey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee103(format, key) {
          var action, result;
          return regeneratorRuntime.wrap(function _callee103$(_context103) {
            while (1) {
              switch (_context103.prev = _context103.next) {
                case 0:
                  checkPrimitive(format, "string", "format");
                  checkCryptoKey(key, "key");
                  action = new ExportKeyActionProto();
                  action.providerID = this.service.id;
                  action.format = format;
                  action.key = key;
                  _context103.next = 8;
                  return this.service.client.send(action);

                case 8:
                  result = _context103.sent;

                  if (!(format === "jwk")) {
                    _context103.next = 13;
                    break;
                  }

                  return _context103.abrupt("return", JSON.parse(Convert.ToBinary(result)));

                case 13:
                  return _context103.abrupt("return", result);

                case 14:
                case "end":
                  return _context103.stop();
              }
            }
          }, _callee103, this);
        }));

        function exportKey(_x130, _x131) {
          return _exportKey.apply(this, arguments);
        }

        return exportKey;
      }()
    }, {
      key: "importKey",
      value: function () {
        var _importKey2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee104(format, keyData, algorithm, extractable, keyUsages) {
          var algProto, preparedKeyData, action, result;
          return regeneratorRuntime.wrap(function _callee104$(_context104) {
            while (1) {
              switch (_context104.prev = _context104.next) {
                case 0:
                  checkPrimitive(format, "string", "format");
                  checkAlgorithm(algorithm, "algorithm");
                  checkPrimitive(extractable, "boolean", "extractable");
                  checkArray(keyUsages, "keyUsages");
                  algProto = prepareAlgorithm(algorithm);

                  if (format === "jwk") {
                    preparedKeyData = Convert.FromUtf8String(JSON.stringify(keyData));
                  } else {
                    checkBufferSource(keyData, "keyData");
                    preparedKeyData = BufferSourceConverter.toArrayBuffer(keyData);
                  }

                  action = new ImportKeyActionProto();
                  action.providerID = this.service.id;
                  action.algorithm = algProto;
                  action.keyData = preparedKeyData;
                  action.format = format;
                  action.extractable = extractable;
                  action.keyUsages = keyUsages;
                  _context104.next = 15;
                  return this.service.client.send(action);

                case 15:
                  result = _context104.sent;
                  _context104.next = 18;
                  return CryptoKeyProto.importProto(result);

                case 18:
                  return _context104.abrupt("return", _context104.sent);

                case 19:
                case "end":
                  return _context104.stop();
              }
            }
          }, _callee104, this);
        }));

        function importKey(_x132, _x133, _x134, _x135, _x136) {
          return _importKey2.apply(this, arguments);
        }

        return importKey;
      }()
    }, {
      key: "sign",
      value: function () {
        var _sign6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee105(algorithm, key, data) {
          var algProto, rawData, action, result;
          return regeneratorRuntime.wrap(function _callee105$(_context105) {
            while (1) {
              switch (_context105.prev = _context105.next) {
                case 0:
                  checkAlgorithm(algorithm, "algorithm");
                  checkCryptoKey(key, "key");
                  checkBufferSource(data, "data");
                  algProto = prepareAlgorithm(algorithm);
                  rawData = BufferSourceConverter.toArrayBuffer(data);
                  action = new SignActionProto();
                  action.providerID = this.service.id;
                  action.algorithm = algProto;
                  action.key = key;
                  action.data = rawData;
                  _context105.next = 12;
                  return this.service.client.send(action);

                case 12:
                  result = _context105.sent;
                  return _context105.abrupt("return", result);

                case 14:
                case "end":
                  return _context105.stop();
              }
            }
          }, _callee105, this);
        }));

        function sign(_x137, _x138, _x139) {
          return _sign6.apply(this, arguments);
        }

        return sign;
      }()
    }, {
      key: "verify",
      value: function () {
        var _verify3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee106(algorithm, key, signature, data) {
          var algProto, rawSignature, rawData, action, result;
          return regeneratorRuntime.wrap(function _callee106$(_context106) {
            while (1) {
              switch (_context106.prev = _context106.next) {
                case 0:
                  checkAlgorithm(algorithm, "algorithm");
                  checkCryptoKey(key, "key");
                  checkBufferSource(signature, "signature");
                  checkBufferSource(data, "data");
                  algProto = prepareAlgorithm(algorithm);
                  rawSignature = BufferSourceConverter.toArrayBuffer(signature);
                  rawData = BufferSourceConverter.toArrayBuffer(data);
                  action = new VerifyActionProto();
                  action.providerID = this.service.id;
                  action.algorithm = algProto;
                  action.key = key;
                  action.data = rawData;
                  action.signature = rawSignature;
                  _context106.next = 15;
                  return this.service.client.send(action);

                case 15:
                  result = _context106.sent;
                  return _context106.abrupt("return", !!new Uint8Array(result)[0]);

                case 17:
                case "end":
                  return _context106.stop();
              }
            }
          }, _callee106, this);
        }));

        function verify(_x140, _x141, _x142, _x143) {
          return _verify3.apply(this, arguments);
        }

        return verify;
      }()
    }, {
      key: "wrapKey",
      value: function () {
        var _wrapKey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee107(format, key, wrappingKey, wrapAlgorithm) {
          var wrapAlgProto, action, result;
          return regeneratorRuntime.wrap(function _callee107$(_context107) {
            while (1) {
              switch (_context107.prev = _context107.next) {
                case 0:
                  checkPrimitive(format, "string", "format");
                  checkCryptoKey(key, "key");
                  checkCryptoKey(wrappingKey, "wrappingKey");
                  checkAlgorithm(wrapAlgorithm, "wrapAlgorithm");
                  wrapAlgProto = prepareAlgorithm(wrapAlgorithm);
                  action = new WrapKeyActionProto();
                  action.providerID = this.service.id;
                  action.wrapAlgorithm = wrapAlgProto;
                  action.key = key;
                  action.wrappingKey = wrappingKey;
                  action.format = format;
                  _context107.next = 13;
                  return this.service.client.send(action);

                case 13:
                  result = _context107.sent;
                  return _context107.abrupt("return", result);

                case 15:
                case "end":
                  return _context107.stop();
              }
            }
          }, _callee107, this);
        }));

        function wrapKey(_x144, _x145, _x146, _x147) {
          return _wrapKey.apply(this, arguments);
        }

        return wrapKey;
      }()
    }, {
      key: "unwrapKey",
      value: function () {
        var _unwrapKey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee108(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages) {
          var unwrapAlgProto, unwrappedKeyAlgProto, rawWrappedKey, action, result;
          return regeneratorRuntime.wrap(function _callee108$(_context108) {
            while (1) {
              switch (_context108.prev = _context108.next) {
                case 0:
                  checkPrimitive(format, "string", "format");
                  checkBufferSource(wrappedKey, "wrappedKey");
                  checkCryptoKey(unwrappingKey, "unwrappingKey");
                  checkAlgorithm(unwrapAlgorithm, "unwrapAlgorithm");
                  checkAlgorithm(unwrappedKeyAlgorithm, "unwrappedKeyAlgorithm");
                  checkPrimitive(extractable, "boolean", "extractable");
                  checkArray(keyUsages, "keyUsages");
                  unwrapAlgProto = prepareAlgorithm(unwrapAlgorithm);
                  unwrappedKeyAlgProto = prepareAlgorithm(unwrappedKeyAlgorithm);
                  rawWrappedKey = BufferSourceConverter.toArrayBuffer(wrappedKey);
                  action = new UnwrapKeyActionProto();
                  action.providerID = this.service.id;
                  action.format = format;
                  action.unwrapAlgorithm = unwrapAlgProto;
                  action.unwrappedKeyAlgorithm = unwrappedKeyAlgProto;
                  action.unwrappingKey = unwrappingKey;
                  action.wrappedKey = rawWrappedKey;
                  action.extractable = extractable;
                  action.keyUsage = keyUsages;
                  _context108.next = 21;
                  return this.service.client.send(action);

                case 21:
                  result = _context108.sent;
                  _context108.next = 24;
                  return CryptoKeyProto.importProto(result);

                case 24:
                  return _context108.abrupt("return", _context108.sent);

                case 25:
                case "end":
                  return _context108.stop();
              }
            }
          }, _callee108, this);
        }));

        function unwrapKey(_x148, _x149, _x150, _x151, _x152, _x153, _x154) {
          return _unwrapKey.apply(this, arguments);
        }

        return unwrapKey;
      }()
    }, {
      key: "encryptData",
      value: function () {
        var _encryptData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee109(algorithm, key, data, type) {
          var algProto, rawData, ActionClass, action, result;
          return regeneratorRuntime.wrap(function _callee109$(_context109) {
            while (1) {
              switch (_context109.prev = _context109.next) {
                case 0:
                  checkAlgorithm(algorithm, "algorithm");
                  checkCryptoKey(key, "key");
                  checkBufferSource(data, "data");
                  algProto = prepareAlgorithm(algorithm);
                  rawData = BufferSourceConverter.toArrayBuffer(data);

                  if (type === "encrypt") {
                    ActionClass = EncryptActionProto;
                  } else {
                    ActionClass = DecryptActionProto;
                  }

                  action = new ActionClass();
                  action.providerID = this.service.id;
                  action.algorithm = algProto;
                  action.key = key;
                  action.data = rawData;
                  _context109.next = 13;
                  return this.service.client.send(action);

                case 13:
                  result = _context109.sent;
                  return _context109.abrupt("return", result);

                case 15:
                case "end":
                  return _context109.stop();
              }
            }
          }, _callee109, this);
        }));

        function encryptData(_x155, _x156, _x157, _x158) {
          return _encryptData.apply(this, arguments);
        }

        return encryptData;
      }()
    }]);

    return SubtleCrypto;
  }();

  var SocketCrypto = /*#__PURE__*/function () {
    function SocketCrypto(client, id) {
      _classCallCheck(this, SocketCrypto);

      this.client = client;
      this.id = id;
      this.subtle = new SubtleCrypto(this);
      this.keyStorage = new KeyStorage(this);
      this.certStorage = new CertificateStorage(this);
    }

    _createClass(SocketCrypto, [{
      key: "getRandomValues",
      value: function getRandomValues(array) {
        return getEngine().crypto.getRandomValues(array);
      }
    }, {
      key: "login",
      value: function () {
        var _login2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee110() {
          var action;
          return regeneratorRuntime.wrap(function _callee110$(_context110) {
            while (1) {
              switch (_context110.prev = _context110.next) {
                case 0:
                  action = new LoginActionProto();
                  action.providerID = this.id;
                  return _context110.abrupt("return", this.client.send(action));

                case 3:
                case "end":
                  return _context110.stop();
              }
            }
          }, _callee110, this);
        }));

        function login() {
          return _login2.apply(this, arguments);
        }

        return login;
      }()
    }, {
      key: "logout",
      value: function () {
        var _logout = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee111() {
          var action;
          return regeneratorRuntime.wrap(function _callee111$(_context111) {
            while (1) {
              switch (_context111.prev = _context111.next) {
                case 0:
                  action = new LogoutActionProto();
                  action.providerID = this.id;
                  return _context111.abrupt("return", this.client.send(action));

                case 3:
                case "end":
                  return _context111.stop();
              }
            }
          }, _callee111, this);
        }));

        function logout() {
          return _logout.apply(this, arguments);
        }

        return logout;
      }()
    }, {
      key: "reset",
      value: function () {
        var _reset = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee112() {
          var action;
          return regeneratorRuntime.wrap(function _callee112$(_context112) {
            while (1) {
              switch (_context112.prev = _context112.next) {
                case 0:
                  action = new ResetActionProto();
                  action.providerID = this.id;
                  return _context112.abrupt("return", this.client.send(action));

                case 3:
                case "end":
                  return _context112.stop();
              }
            }
          }, _callee112, this);
        }));

        function reset() {
          return _reset.apply(this, arguments);
        }

        return reset;
      }()
    }, {
      key: "isLoggedIn",
      value: function () {
        var _isLoggedIn2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee113() {
          var action, res;
          return regeneratorRuntime.wrap(function _callee113$(_context113) {
            while (1) {
              switch (_context113.prev = _context113.next) {
                case 0:
                  action = new IsLoggedInActionProto();
                  action.providerID = this.id;
                  _context113.next = 4;
                  return this.client.send(action);

                case 4:
                  res = _context113.sent;
                  return _context113.abrupt("return", !!new Uint8Array(res)[0]);

                case 6:
                case "end":
                  return _context113.stop();
              }
            }
          }, _callee113, this);
        }));

        function isLoggedIn() {
          return _isLoggedIn2.apply(this, arguments);
        }

        return isLoggedIn;
      }()
    }]);

    return SocketCrypto;
  }();

  var SocketProvider = /*#__PURE__*/function (_EventEmitter4) {
    _inherits(SocketProvider, _EventEmitter4);

    var _super139 = _createSuper(SocketProvider);

    function SocketProvider(options) {
      var _this79;

      _classCallCheck(this, SocketProvider);

      _this79 = _super139.call(this);
      _this79.client = new Client(options.storage);
      _this79.cardReader = new CardReader(_this79.client);
      return _this79;
    }

    _createClass(SocketProvider, [{
      key: "connect",
      value: function connect(address, options) {
        var _this80 = this;

        this.removeAllListeners();
        this.client.connect(address, options).on("error", function (e) {
          _this80.emit("error", e.error);
        }).on("event", function (proto) {
          _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee114() {
            var tokenProto, authProto;
            return regeneratorRuntime.wrap(function _callee114$(_context114) {
              while (1) {
                switch (_context114.prev = _context114.next) {
                  case 0:
                    _context114.t0 = proto.action;
                    _context114.next = _context114.t0 === ProviderTokenEventProto.ACTION ? 3 : _context114.t0 === ProviderAuthorizedEventProto.ACTION ? 11 : 19;
                    break;

                  case 3:
                    _context114.t1 = ProviderTokenEventProto;
                    _context114.next = 6;
                    return proto.exportProto();

                  case 6:
                    _context114.t2 = _context114.sent;
                    _context114.next = 9;
                    return _context114.t1.importProto.call(_context114.t1, _context114.t2);

                  case 9:
                    tokenProto = _context114.sent;

                    _this80.emit("token", tokenProto);

                  case 11:
                    _context114.t3 = ProviderAuthorizedEventProto;
                    _context114.next = 14;
                    return proto.exportProto();

                  case 14:
                    _context114.t4 = _context114.sent;
                    _context114.next = 17;
                    return _context114.t3.importProto.call(_context114.t3, _context114.t4);

                  case 17:
                    authProto = _context114.sent;

                    _this80.emit("auth", authProto);

                  case 19:
                  case "end":
                    return _context114.stop();
                }
              }
            }, _callee114);
          }))();
        }).on("listening", function (e) {
          _this80.emit("listening", address);
        }).on("close", function (e) {
          _this80.emit("close", e.remoteAddress);
        });
        return this;
      }
    }, {
      key: "close",
      value: function close() {
        this.client.close();
      }
    }, {
      key: "on",
      value: function on(event, listener) {
        console.log("SocketProvider:on", event);
        return _get(_getPrototypeOf(SocketProvider.prototype), "on", this).call(this, event, listener);
      }
    }, {
      key: "once",
      value: function once(event, listener) {
        return _get(_getPrototypeOf(SocketProvider.prototype), "once", this).call(this, event, listener);
      }
    }, {
      key: "info",
      value: function () {
        var _info = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee115() {
          var proto, result, infoProto;
          return regeneratorRuntime.wrap(function _callee115$(_context115) {
            while (1) {
              switch (_context115.prev = _context115.next) {
                case 0:
                  proto = new ProviderInfoActionProto();
                  _context115.next = 3;
                  return this.client.send(proto);

                case 3:
                  result = _context115.sent;
                  _context115.next = 6;
                  return ProviderInfoProto.importProto(result);

                case 6:
                  infoProto = _context115.sent;
                  return _context115.abrupt("return", infoProto);

                case 8:
                case "end":
                  return _context115.stop();
              }
            }
          }, _callee115, this);
        }));

        function info() {
          return _info.apply(this, arguments);
        }

        return info;
      }()
    }, {
      key: "challenge",
      value: function () {
        var _challenge4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee116() {
          return regeneratorRuntime.wrap(function _callee116$(_context116) {
            while (1) {
              switch (_context116.prev = _context116.next) {
                case 0:
                  return _context116.abrupt("return", this.client.challenge());

                case 1:
                case "end":
                  return _context116.stop();
              }
            }
          }, _callee116, this);
        }));

        function challenge() {
          return _challenge4.apply(this, arguments);
        }

        return challenge;
      }()
    }, {
      key: "isLoggedIn",
      value: function () {
        var _isLoggedIn3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee117() {
          return regeneratorRuntime.wrap(function _callee117$(_context117) {
            while (1) {
              switch (_context117.prev = _context117.next) {
                case 0:
                  return _context117.abrupt("return", this.client.isLoggedIn());

                case 1:
                case "end":
                  return _context117.stop();
              }
            }
          }, _callee117, this);
        }));

        function isLoggedIn() {
          return _isLoggedIn3.apply(this, arguments);
        }

        return isLoggedIn;
      }()
    }, {
      key: "login",
      value: function () {
        var _login3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee118() {
          return regeneratorRuntime.wrap(function _callee118$(_context118) {
            while (1) {
              switch (_context118.prev = _context118.next) {
                case 0:
                  return _context118.abrupt("return", this.client.login());

                case 1:
                case "end":
                  return _context118.stop();
              }
            }
          }, _callee118, this);
        }));

        function login() {
          return _login3.apply(this, arguments);
        }

        return login;
      }()
    }, {
      key: "getCrypto",
      value: function () {
        var _getCrypto = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee119(cryptoID) {
          var actionProto;
          return regeneratorRuntime.wrap(function _callee119$(_context119) {
            while (1) {
              switch (_context119.prev = _context119.next) {
                case 0:
                  actionProto = new ProviderGetCryptoActionProto();
                  actionProto.cryptoID = cryptoID;
                  _context119.next = 4;
                  return this.client.send(actionProto);

                case 4:
                  return _context119.abrupt("return", new SocketCrypto(this.client, cryptoID));

                case 5:
                case "end":
                  return _context119.stop();
              }
            }
          }, _callee119, this);
        }));

        function getCrypto(_x159) {
          return _getCrypto.apply(this, arguments);
        }

        return getCrypto;
      }()
    }, {
      key: "state",
      get: function get() {
        return this.client.state;
      }
    }]);

    return SocketProvider;
  }(EventEmitter);

  var RatchetStorage = function RatchetStorage() {
    _classCallCheck(this, RatchetStorage);
  };

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
            get: function get() {
              return this[targetProp][prop];
            },
            set: function set(val) {
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
        open: function open(name, version, upgradeCallback) {
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
        delete: function _delete(name) {
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
        open: function open() {
          return Promise.reject('IDB requires a browser environment');
        },
        delete: function _delete() {
          return Promise.reject('IDB requires a browser environment');
        }
      };
    }
  });
  var node_1 = node.open;

  var BrowserStorage = function () {
    var BrowserStorage = /*#__PURE__*/function (_RatchetStorage) {
      _inherits(BrowserStorage, _RatchetStorage);

      var _super140 = _createSuper(BrowserStorage);

      function BrowserStorage(db) {
        var _this81;

        _classCallCheck(this, BrowserStorage);

        _this81 = _super140.call(this);
        _this81.db = db;
        return _this81;
      }

      _createClass(BrowserStorage, [{
        key: "loadWrapKey",
        value: function () {
          var _loadWrapKey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee120() {
            var wKey, key;
            return regeneratorRuntime.wrap(function _callee120$(_context120) {
              while (1) {
                switch (_context120.prev = _context120.next) {
                  case 0:
                    _context120.next = 2;
                    return this.db.transaction(BrowserStorage.IDENTITY_STORAGE).objectStore(BrowserStorage.IDENTITY_STORAGE).get(BrowserStorage.WRAP_KEY);

                  case 2:
                    wKey = _context120.sent;

                    if (!wKey) {
                      _context120.next = 11;
                      break;
                    }

                    AES_CBC.iv = wKey.iv;

                    if (!(wKey.key instanceof ArrayBuffer)) {
                      _context120.next = 10;
                      break;
                    }

                    _context120.next = 8;
                    return getEngine().crypto.subtle.importKey("raw", wKey.key, {
                      name: AES_CBC.name,
                      length: 256
                    }, true, ["encrypt", "decrypt", "wrapKey", "unwrapKey"]);

                  case 8:
                    key = _context120.sent;
                    return _context120.abrupt("return", {
                      key: key,
                      iv: wKey.iv
                    });

                  case 10:
                    return _context120.abrupt("return", {
                      key: wKey.key,
                      iv: wKey.iv
                    });

                  case 11:
                    return _context120.abrupt("return", null);

                  case 12:
                  case "end":
                    return _context120.stop();
                }
              }
            }, _callee120, this);
          }));

          function loadWrapKey() {
            return _loadWrapKey.apply(this, arguments);
          }

          return loadWrapKey;
        }()
      }, {
        key: "saveWrapKey",
        value: function () {
          var _saveWrapKey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee121(key) {
            var item, raw;
            return regeneratorRuntime.wrap(function _callee121$(_context121) {
              while (1) {
                switch (_context121.prev = _context121.next) {
                  case 0:
                    if (!(isEdge() || isIE())) {
                      _context121.next = 7;
                      break;
                    }

                    _context121.next = 3;
                    return getEngine().crypto.subtle.exportKey("raw", key.key);

                  case 3:
                    raw = _context121.sent;
                    item = {
                      key: raw,
                      iv: key.iv
                    };
                    _context121.next = 8;
                    break;

                  case 7:
                    item = _objectSpread2({}, key);

                  case 8:
                    _context121.next = 10;
                    return this.db.transaction(BrowserStorage.IDENTITY_STORAGE, "readwrite").objectStore(BrowserStorage.IDENTITY_STORAGE).put(item, BrowserStorage.WRAP_KEY);

                  case 10:
                  case "end":
                    return _context121.stop();
                }
              }
            }, _callee121, this);
          }));

          function saveWrapKey(_x160) {
            return _saveWrapKey.apply(this, arguments);
          }

          return saveWrapKey;
        }()
      }, {
        key: "loadIdentity",
        value: function () {
          var _loadIdentity = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee122() {
            var json, res, wKey;
            return regeneratorRuntime.wrap(function _callee122$(_context122) {
              while (1) {
                switch (_context122.prev = _context122.next) {
                  case 0:
                    _context122.next = 2;
                    return this.db.transaction(BrowserStorage.IDENTITY_STORAGE).objectStore(BrowserStorage.IDENTITY_STORAGE).get(BrowserStorage.IDENTITY);

                  case 2:
                    json = _context122.sent;
                    res = null;

                    if (!json) {
                      _context122.next = 26;
                      break;
                    }

                    if (!(isFirefox() || isEdge() || isIE())) {
                      _context122.next = 23;
                      break;
                    }

                    _context122.next = 8;
                    return this.loadWrapKey();

                  case 8:
                    wKey = _context122.sent;

                    if (wKey && wKey.key.usages.some(function (usage) {
                      return usage === "encrypt";
                    }) && json.exchangeKey.privateKey instanceof ArrayBuffer) {
                      _context122.next = 11;
                      break;
                    }

                    return _context122.abrupt("return", null);

                  case 11:
                    _context122.next = 13;
                    return getEngine().crypto.subtle.unwrapKey("jwk", json.exchangeKey.privateKey, wKey.key, AES_CBC, ECDH, false, ["deriveKey", "deriveBits"]);

                  case 13:
                    json.exchangeKey.privateKey = _context122.sent;
                    _context122.next = 16;
                    return getEngine().crypto.subtle.unwrapKey("jwk", json.signingKey.privateKey, wKey.key, AES_CBC, ECDSA, false, ["sign"]);

                  case 16:
                    json.signingKey.privateKey = _context122.sent;
                    _context122.next = 19;
                    return getEngine().crypto.subtle.unwrapKey("jwk", json.exchangeKey.publicKey, wKey.key, AES_CBC, ECDH, true, []);

                  case 19:
                    json.exchangeKey.publicKey = _context122.sent;
                    _context122.next = 22;
                    return getEngine().crypto.subtle.unwrapKey("jwk", json.signingKey.publicKey, wKey.key, AES_CBC, ECDSA, true, ["verify"]);

                  case 22:
                    json.signingKey.publicKey = _context122.sent;

                  case 23:
                    _context122.next = 25;
                    return Identity.fromJSON(json);

                  case 25:
                    res = _context122.sent;

                  case 26:
                    return _context122.abrupt("return", res);

                  case 27:
                  case "end":
                    return _context122.stop();
                }
              }
            }, _callee122, this);
          }));

          function loadIdentity() {
            return _loadIdentity.apply(this, arguments);
          }

          return loadIdentity;
        }()
      }, {
        key: "saveIdentity",
        value: function () {
          var _saveIdentity = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee123(value) {
            var wKey, exchangeKeyPair, signingKeyPair, json;
            return regeneratorRuntime.wrap(function _callee123$(_context123) {
              while (1) {
                switch (_context123.prev = _context123.next) {
                  case 0:
                    if (!(isFirefox() || isEdge() || isIE())) {
                      _context123.next = 20;
                      break;
                    }

                    _context123.next = 3;
                    return getEngine().crypto.subtle.generateKey({
                      name: AES_CBC.name,
                      length: 256
                    }, isEdge() || isIE(), ["wrapKey", "unwrapKey", "encrypt", "decrypt"]);

                  case 3:
                    _context123.t0 = _context123.sent;
                    _context123.t1 = getEngine().crypto.getRandomValues(new Uint8Array(AES_CBC.iv)).buffer;
                    wKey = {
                      key: _context123.t0,
                      iv: _context123.t1
                    };
                    _context123.next = 8;
                    return this.saveWrapKey(wKey);

                  case 8:
                    _context123.next = 10;
                    return getEngine().crypto.subtle.generateKey(value.exchangeKey.privateKey.algorithm, true, ["deriveKey", "deriveBits"]);

                  case 10:
                    exchangeKeyPair = _context123.sent;
                    value.exchangeKey.privateKey = exchangeKeyPair.privateKey;
                    _context123.next = 14;
                    return updateEcPublicKey(value.exchangeKey.publicKey, exchangeKeyPair.publicKey);

                  case 14:
                    _context123.next = 16;
                    return getEngine().crypto.subtle.generateKey(value.signingKey.privateKey.algorithm, true, ["sign", "verify"]);

                  case 16:
                    signingKeyPair = _context123.sent;
                    value.signingKey.privateKey = signingKeyPair.privateKey;
                    _context123.next = 20;
                    return updateEcPublicKey(value.signingKey.publicKey, signingKeyPair.publicKey);

                  case 20:
                    _context123.next = 22;
                    return value.toJSON();

                  case 22:
                    json = _context123.sent;

                    if (!wKey) {
                      _context123.next = 36;
                      break;
                    }

                    _context123.next = 26;
                    return getEngine().crypto.subtle.wrapKey("jwk", value.exchangeKey.privateKey, wKey.key, AES_CBC);

                  case 26:
                    json.exchangeKey.privateKey = _context123.sent;
                    _context123.next = 29;
                    return getEngine().crypto.subtle.wrapKey("jwk", value.signingKey.privateKey, wKey.key, AES_CBC);

                  case 29:
                    json.signingKey.privateKey = _context123.sent;
                    _context123.next = 32;
                    return getEngine().crypto.subtle.wrapKey("jwk", value.exchangeKey.publicKey.key, wKey.key, AES_CBC);

                  case 32:
                    json.exchangeKey.publicKey = _context123.sent;
                    _context123.next = 35;
                    return getEngine().crypto.subtle.wrapKey("jwk", value.signingKey.publicKey.key, wKey.key, AES_CBC);

                  case 35:
                    json.signingKey.publicKey = _context123.sent;

                  case 36:
                    _context123.next = 38;
                    return this.db.transaction(BrowserStorage.IDENTITY_STORAGE, "readwrite").objectStore(BrowserStorage.IDENTITY_STORAGE).put(json, BrowserStorage.IDENTITY);

                  case 38:
                  case "end":
                    return _context123.stop();
                }
              }
            }, _callee123, this);
          }));

          function saveIdentity(_x161) {
            return _saveIdentity.apply(this, arguments);
          }

          return saveIdentity;
        }()
      }, {
        key: "loadRemoteIdentity",
        value: function () {
          var _loadRemoteIdentity = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee124(key) {
            var json, res, wKey;
            return regeneratorRuntime.wrap(function _callee124$(_context124) {
              while (1) {
                switch (_context124.prev = _context124.next) {
                  case 0:
                    _context124.next = 2;
                    return this.db.transaction(BrowserStorage.REMOTE_STORAGE).objectStore(BrowserStorage.REMOTE_STORAGE).get(key);

                  case 2:
                    json = _context124.sent;
                    res = null;

                    if (!json) {
                      _context124.next = 18;
                      break;
                    }

                    _context124.next = 7;
                    return this.loadWrapKey();

                  case 7:
                    wKey = _context124.sent;

                    if (!wKey) {
                      _context124.next = 15;
                      break;
                    }

                    _context124.next = 11;
                    return getEngine().crypto.subtle.unwrapKey("jwk", json.exchangeKey, wKey.key, AES_CBC, ECDH, true, []);

                  case 11:
                    json.exchangeKey = _context124.sent;
                    _context124.next = 14;
                    return getEngine().crypto.subtle.unwrapKey("jwk", json.signingKey, wKey.key, AES_CBC, ECDSA, true, ["verify"]);

                  case 14:
                    json.signingKey = _context124.sent;

                  case 15:
                    _context124.next = 17;
                    return RemoteIdentity.fromJSON(json);

                  case 17:
                    res = _context124.sent;

                  case 18:
                    return _context124.abrupt("return", res);

                  case 19:
                  case "end":
                    return _context124.stop();
                }
              }
            }, _callee124, this);
          }));

          function loadRemoteIdentity(_x162) {
            return _loadRemoteIdentity.apply(this, arguments);
          }

          return loadRemoteIdentity;
        }()
      }, {
        key: "saveRemoteIdentity",
        value: function () {
          var _saveRemoteIdentity = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee125(key, value) {
            var json, wKey;
            return regeneratorRuntime.wrap(function _callee125$(_context125) {
              while (1) {
                switch (_context125.prev = _context125.next) {
                  case 0:
                    _context125.next = 2;
                    return value.toJSON();

                  case 2:
                    json = _context125.sent;
                    _context125.next = 5;
                    return this.loadWrapKey();

                  case 5:
                    wKey = _context125.sent;

                    if (!wKey) {
                      _context125.next = 13;
                      break;
                    }

                    _context125.next = 9;
                    return getEngine().crypto.subtle.wrapKey("jwk", json.exchangeKey, wKey.key, AES_CBC);

                  case 9:
                    json.exchangeKey = _context125.sent;
                    _context125.next = 12;
                    return getEngine().crypto.subtle.wrapKey("jwk", json.signingKey, wKey.key, AES_CBC);

                  case 12:
                    json.signingKey = _context125.sent;

                  case 13:
                    _context125.next = 15;
                    return this.db.transaction(BrowserStorage.REMOTE_STORAGE, "readwrite").objectStore(BrowserStorage.REMOTE_STORAGE).put(json, key);

                  case 15:
                  case "end":
                    return _context125.stop();
                }
              }
            }, _callee125, this);
          }));

          function saveRemoteIdentity(_x163, _x164) {
            return _saveRemoteIdentity.apply(this, arguments);
          }

          return saveRemoteIdentity;
        }()
      }, {
        key: "loadSession",
        value: function () {
          var _loadSession = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee126(key) {
            var json, res, identity, remoteIdentity;
            return regeneratorRuntime.wrap(function _callee126$(_context126) {
              while (1) {
                switch (_context126.prev = _context126.next) {
                  case 0:
                    _context126.next = 2;
                    return this.db.transaction(BrowserStorage.SESSION_STORAGE).objectStore(BrowserStorage.SESSION_STORAGE).get(key);

                  case 2:
                    json = _context126.sent;
                    res = null;

                    if (!json) {
                      _context126.next = 18;
                      break;
                    }

                    _context126.next = 7;
                    return this.loadIdentity();

                  case 7:
                    identity = _context126.sent;

                    if (identity) {
                      _context126.next = 10;
                      break;
                    }

                    throw new Error("Identity is empty");

                  case 10:
                    _context126.next = 12;
                    return this.loadRemoteIdentity(key);

                  case 12:
                    remoteIdentity = _context126.sent;

                    if (remoteIdentity) {
                      _context126.next = 15;
                      break;
                    }

                    throw new Error("Remote identity is not found");

                  case 15:
                    _context126.next = 17;
                    return AsymmetricRatchet.fromJSON(identity, remoteIdentity, json);

                  case 17:
                    res = _context126.sent;

                  case 18:
                    return _context126.abrupt("return", res);

                  case 19:
                  case "end":
                    return _context126.stop();
                }
              }
            }, _callee126, this);
          }));

          function loadSession(_x165) {
            return _loadSession.apply(this, arguments);
          }

          return loadSession;
        }()
      }, {
        key: "saveSession",
        value: function () {
          var _saveSession = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee127(key, value) {
            var json;
            return regeneratorRuntime.wrap(function _callee127$(_context127) {
              while (1) {
                switch (_context127.prev = _context127.next) {
                  case 0:
                    _context127.next = 2;
                    return value.toJSON();

                  case 2:
                    json = _context127.sent;
                    _context127.next = 5;
                    return this.db.transaction(BrowserStorage.SESSION_STORAGE, "readwrite").objectStore(BrowserStorage.SESSION_STORAGE).put(json, key);

                  case 5:
                  case "end":
                    return _context127.stop();
                }
              }
            }, _callee127, this);
          }));

          function saveSession(_x166, _x167) {
            return _saveSession.apply(this, arguments);
          }

          return saveSession;
        }()
      }], [{
        key: "create",
        value: function () {
          var _create4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee128() {
            var _this82 = this;

            var db;
            return regeneratorRuntime.wrap(function _callee128$(_context128) {
              while (1) {
                switch (_context128.prev = _context128.next) {
                  case 0:
                    _context128.next = 2;
                    return node.open(this.STORAGE_NAME, 2, function (updater) {
                      if (updater.oldVersion === 1) {
                        updater.deleteObjectStore(_this82.SESSION_STORAGE);
                        updater.deleteObjectStore(_this82.IDENTITY_STORAGE);
                        updater.deleteObjectStore(_this82.REMOTE_STORAGE);
                      }

                      updater.createObjectStore(_this82.SESSION_STORAGE);
                      updater.createObjectStore(_this82.IDENTITY_STORAGE);
                      updater.createObjectStore(_this82.REMOTE_STORAGE);
                    });

                  case 2:
                    db = _context128.sent;
                    return _context128.abrupt("return", new BrowserStorage(db));

                  case 4:
                  case "end":
                    return _context128.stop();
                }
              }
            }, _callee128, this);
          }));

          function create() {
            return _create4.apply(this, arguments);
          }

          return create;
        }()
      }]);

      return BrowserStorage;
    }(RatchetStorage);

    BrowserStorage.STORAGE_NAME = "webcrypto-remote";
    BrowserStorage.IDENTITY_STORAGE = "identity";
    BrowserStorage.SESSION_STORAGE = "sessions";
    BrowserStorage.REMOTE_STORAGE = "remoteIdentity";
    BrowserStorage.WRAP_KEY = "wkey";
    BrowserStorage.IDENTITY = "identity";
    return BrowserStorage;
  }();

  var MemoryStorage = /*#__PURE__*/function (_RatchetStorage2) {
    _inherits(MemoryStorage, _RatchetStorage2);

    var _super141 = _createSuper(MemoryStorage);

    function MemoryStorage() {
      var _this83;

      _classCallCheck(this, MemoryStorage);

      _this83 = _super141.apply(this, arguments);
      _this83.remoteIdentities = {};
      _this83.sessions = {};
      return _this83;
    }

    _createClass(MemoryStorage, [{
      key: "loadIdentity",
      value: function () {
        var _loadIdentity2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee129() {
          return regeneratorRuntime.wrap(function _callee129$(_context129) {
            while (1) {
              switch (_context129.prev = _context129.next) {
                case 0:
                  return _context129.abrupt("return", this.identity || null);

                case 1:
                case "end":
                  return _context129.stop();
              }
            }
          }, _callee129, this);
        }));

        function loadIdentity() {
          return _loadIdentity2.apply(this, arguments);
        }

        return loadIdentity;
      }()
    }, {
      key: "saveIdentity",
      value: function () {
        var _saveIdentity2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee130(value) {
          return regeneratorRuntime.wrap(function _callee130$(_context130) {
            while (1) {
              switch (_context130.prev = _context130.next) {
                case 0:
                  this.identity = value;

                case 1:
                case "end":
                  return _context130.stop();
              }
            }
          }, _callee130, this);
        }));

        function saveIdentity(_x168) {
          return _saveIdentity2.apply(this, arguments);
        }

        return saveIdentity;
      }()
    }, {
      key: "loadRemoteIdentity",
      value: function () {
        var _loadRemoteIdentity2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee131(key) {
          return regeneratorRuntime.wrap(function _callee131$(_context131) {
            while (1) {
              switch (_context131.prev = _context131.next) {
                case 0:
                  return _context131.abrupt("return", this.remoteIdentities[key] || null);

                case 1:
                case "end":
                  return _context131.stop();
              }
            }
          }, _callee131, this);
        }));

        function loadRemoteIdentity(_x169) {
          return _loadRemoteIdentity2.apply(this, arguments);
        }

        return loadRemoteIdentity;
      }()
    }, {
      key: "saveRemoteIdentity",
      value: function () {
        var _saveRemoteIdentity2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee132(key, value) {
          return regeneratorRuntime.wrap(function _callee132$(_context132) {
            while (1) {
              switch (_context132.prev = _context132.next) {
                case 0:
                  this.remoteIdentities[key] = value;

                case 1:
                case "end":
                  return _context132.stop();
              }
            }
          }, _callee132, this);
        }));

        function saveRemoteIdentity(_x170, _x171) {
          return _saveRemoteIdentity2.apply(this, arguments);
        }

        return saveRemoteIdentity;
      }()
    }, {
      key: "loadSession",
      value: function () {
        var _loadSession2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee133(key) {
          return regeneratorRuntime.wrap(function _callee133$(_context133) {
            while (1) {
              switch (_context133.prev = _context133.next) {
                case 0:
                  return _context133.abrupt("return", this.sessions[key] || null);

                case 1:
                case "end":
                  return _context133.stop();
              }
            }
          }, _callee133, this);
        }));

        function loadSession(_x172) {
          return _loadSession2.apply(this, arguments);
        }

        return loadSession;
      }()
    }, {
      key: "saveSession",
      value: function () {
        var _saveSession2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee134(key, value) {
          return regeneratorRuntime.wrap(function _callee134$(_context134) {
            while (1) {
              switch (_context134.prev = _context134.next) {
                case 0:
                  this.sessions[key] = value;

                case 1:
                case "end":
                  return _context134.stop();
              }
            }
          }, _callee134, this);
        }));

        function saveSession(_x173, _x174) {
          return _saveSession2.apply(this, arguments);
        }

        return saveSession;
      }()
    }]);

    return MemoryStorage;
  }(RatchetStorage);

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