(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.pvtsutils = global.pvtsutils || {})));
}(this, (function (exports) { 'use strict';

function PrepareBuffer(buffer) {
  if (typeof Buffer !== "undefined") {
      return new Uint8Array(buffer);
  }
  else {
      return new Uint8Array(buffer instanceof ArrayBuffer ? buffer : buffer.buffer);
  }
}
var Convert = (function () {
  function Convert() {
  }
  Convert.ToString = function (buffer, enc) {
      if (enc === void 0) { enc = "utf8"; }
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
              throw new Error("Unknown type of encoding '" + enc + "'");
      }
  };
  Convert.FromString = function (str, enc) {
      if (enc === void 0) { enc = "utf8"; }
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
              throw new Error("Unknown type of encoding '" + enc + "'");
      }
  };
  Convert.ToBase64 = function (buffer) {
      var buf = PrepareBuffer(buffer);
      if (typeof btoa !== "undefined") {
          var binary = this.ToString(buf, "binary");
          return btoa(binary);
      }
      else {
          return new Buffer(buf).toString("base64");
      }
  };
  Convert.FromBase64 = function (base64Text) {
      base64Text = base64Text.replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "").replace(/\s/g, "");
      if (typeof atob !== "undefined") {
          return this.FromBinary(atob(base64Text));
      }
      else {
          return new Uint8Array(new Buffer(base64Text, "base64")).buffer;
      }
  };
  Convert.FromBase64Url = function (base64url) {
      return this.FromBase64(this.Base64Padding(base64url.replace(/\-/g, "+").replace(/\_/g, "/")));
  };
  Convert.ToBase64Url = function (data) {
      return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
  };
  Convert.FromUtf8String = function (text) {
      var s = unescape(encodeURIComponent(text));
      var uintArray = new Uint8Array(s.length);
      for (var i = 0; i < s.length; i++) {
          uintArray[i] = s.charCodeAt(i);
      }
      return uintArray.buffer;
  };
  Convert.ToUtf8String = function (buffer) {
      var buf = PrepareBuffer(buffer);
      var encodedString = String.fromCharCode.apply(null, buf);
      var decodedString = decodeURIComponent(escape(encodedString));
      return decodedString;
  };
  Convert.FromBinary = function (text) {
      var stringLength = text.length;
      var resultView = new Uint8Array(stringLength);
      for (var i = 0; i < stringLength; i++) {
          resultView[i] = text.charCodeAt(i);
      }
      return resultView.buffer;
  };
  Convert.ToBinary = function (buffer) {
      var buf = PrepareBuffer(buffer);
      var resultString = "";
      var len = buf.length;
      for (var i = 0; i < len; i++) {
          resultString = resultString + String.fromCharCode(buf[i]);
      }
      return resultString;
  };
  Convert.ToHex = function (buffer) {
      var buf = PrepareBuffer(buffer);
      var splitter = "";
      var res = [];
      var len = buf.length;
      for (var i = 0; i < len; i++) {
          var char = buf[i].toString(16);
          res.push(char.length === 1 ? "0" + char : char);
      }
      return res.join(splitter);
  };
  Convert.FromHex = function (hexString) {
      var res = new Uint8Array(hexString.length / 2);
      for (var i = 0; i < hexString.length; i = i + 2) {
          var c = hexString.slice(i, i + 2);
          res[i / 2] = parseInt(c, 16);
      }
      return res.buffer;
  };
  Convert.Base64Padding = function (base64) {
      var padCount = 4 - (base64.length % 4);
      if (padCount < 4) {
          for (var i = 0; i < padCount; i++) {
              base64 += "=";
          }
      }
      return base64;
  };
  return Convert;
}());

function assign(target) {
  var sources = [];
  for (var _i = 1; _i < arguments.length; _i++) {
      sources[_i - 1] = arguments[_i];
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
  var buf = [];
  for (var _i = 0; _i < arguments.length; _i++) {
      buf[_i] = arguments[_i];
  }
  var totalByteLength = buf.map(function (item) { return item.byteLength; }).reduce(function (prev, cur) { return prev + cur; });
  var res = new Uint8Array(totalByteLength);
  var currentPos = 0;
  buf.map(function (item) { return new Uint8Array(item); }).forEach(function (arr) {
      for (var i = 0; i < arr.length; i++) {
          res[currentPos++] = arr[i];
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
  var b1 = new Uint8Array(bytes1);
  var b2 = new Uint8Array(bytes2);
  for (var i = 0; i < bytes1.byteLength; i++) {
      if (b1[i] !== b2[i]) {
          return false;
      }
  }
  return true;
}

exports.Convert = Convert;
exports.assign = assign;
exports.combine = combine;
exports.isEqual = isEqual;

Object.defineProperty(exports, '__esModule', { value: true });

})));