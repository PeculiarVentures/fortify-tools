/**
 * Copyright (c) 2020, Peculiar Ventures, All rights reserved.
 */

var liner = (function (exports, asmcrypto_js, elliptic) {
  'use strict';

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

  let window = {};

  if (typeof self !== "undefined") {
    window = self;
  }

  exports.nativeCrypto = window["msCrypto"] || window.crypto || {};
  exports.nativeSubtle = null;

  try {
    exports.nativeSubtle = (exports.nativeCrypto === null || exports.nativeCrypto === void 0 ? void 0 : exports.nativeCrypto.subtle) || (exports.nativeCrypto === null || exports.nativeCrypto === void 0 ? void 0 : exports.nativeCrypto["webkitSubtle"]) || null;
  } catch (err) {
    console.warn("Cannot get subtle from crypto", err);
  }

  function setCrypto(crypto) {
    exports.nativeCrypto = crypto;
    exports.nativeSubtle = crypto.subtle;
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

  function __decorate(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function (resolve) {
        resolve(value);
      });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }

      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }

      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }

      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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

  var utils = Object.freeze({
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
  var asn1$2 = Object.freeze({
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
  var defaultConverters = Object.freeze({
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

  function isTypeOfArray(target) {
    var _a;

    if (target) {
      const proto = Object.getPrototypeOf(target);

      if (((_a = proto === null || proto === void 0 ? void 0 : proto.prototype) === null || _a === void 0 ? void 0 : _a.constructor) === Array) {
        return true;
      }

      return isTypeOfArray(proto);
    }

    return false;
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

  class AsnSchemaValidationError extends Error {
    constructor() {
      super(...arguments);
      this.schemas = [];
    }

  }

  class AsnParser {
    static parse(data, target) {
      let buf;

      if (data instanceof ArrayBuffer) {
        buf = data;
      } else if (typeof Buffer !== undefined && Buffer.isBuffer(data)) {
        buf = new Uint8Array(data).buffer;
      } else if (ArrayBuffer.isView(data)) {
        buf = data.buffer;
      } else {
        throw new TypeError("Wrong type of 'data' argument");
      }

      const asn1Parsed = asn1_1(buf);

      if (asn1Parsed.result.error) {
        throw new Error(asn1Parsed.result.error);
      }

      const res = this.fromASN(asn1Parsed.result, target);
      return res;
    }

    static fromASN(asn1Schema, target) {
      var _a;

      try {
        if (isConvertible(target)) {
          const value = new target();
          return value.fromASN(asn1Schema);
        }

        const schema = schemaStorage.get(target);
        schemaStorage.cache(target);
        let targetSchema = schema.schema;

        if (asn1Schema.constructor === asn1_39 && schema.type !== AsnTypeTypes.Choice) {
          targetSchema = new asn1_39({
            idBlock: {
              tagClass: 3,
              tagNumber: asn1Schema.idBlock.tagNumber
            },
            value: schema.schema.valueBlock.value
          });

          for (const key in schema.items) {
            delete asn1Schema[key];
          }
        }

        const asn1ComparedSchema = asn1_2(asn1Schema, asn1Schema, targetSchema);

        if (!asn1ComparedSchema.verified) {
          throw new AsnSchemaValidationError(`Data does not match to ${target.name} ASN1 schema. ${asn1ComparedSchema.result.error}`);
        }

        const res = new target();

        if (isTypeOfArray(target)) {
          return target.from(asn1Schema.valueBlock.value, element => this.fromASN(element, schema.itemType));
        }

        for (const key in schema.items) {
          if (!asn1Schema[key]) {
            continue;
          }

          const schemaItem = schema.items[key];

          if (typeof schemaItem.type === "number" || isConvertible(schemaItem.type)) {
            const converter = (_a = schemaItem.converter) !== null && _a !== void 0 ? _a : isConvertible(schemaItem.type) ? new schemaItem.type() : null;

            if (!converter) {
              throw new Error("Converter is empty");
            }

            if (schemaItem.repeated) {
              if (schemaItem.implicit) {
                const Container = schemaItem.repeated === "sequence" ? asn1_36 : asn1_35;
                const newItem = new Container();
                newItem.valueBlock = asn1Schema[key].valueBlock;
                const value = asn1_1(newItem.toBER(false)).result.valueBlock.value;
                res[key] = Array.from(value, element => converter.fromASN(element));
              } else {
                res[key] = Array.from(asn1Schema[key], element => converter.fromASN(element));
              }
            } else {
              let value = asn1Schema[key];

              if (schemaItem.implicit) {
                let newItem;

                if (isConvertible(schemaItem.type)) {
                  newItem = new schemaItem.type().toSchema("");
                } else {
                  const Asn1TypeName = AsnPropTypes[schemaItem.type];
                  const Asn1Type = asn1$2[Asn1TypeName];

                  if (!Asn1Type) {
                    throw new Error(`Cannot get '${Asn1TypeName}' class from asn1js module`);
                  }

                  newItem = new Asn1Type();
                }

                newItem.valueBlock = value.valueBlock;
                value = asn1_1(newItem.toBER(false)).result;
              }

              res[key] = converter.fromASN(value);
            }
          } else {
            if (schemaItem.repeated) {
              res[key] = Array.from(asn1Schema[key], element => this.fromASN(element, schemaItem.type));
            } else {
              res[key] = this.fromASN(asn1Schema[key], schemaItem.type);
            }
          }
        }

        return res;
      } catch (error) {
        if (error instanceof AsnSchemaValidationError) {
          error.schemas.push(target.name);
        }

        throw error;
      }
    }

  }

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

  class TransformError extends JsonError {
    constructor(schema, message, innerError) {
      super(message, innerError);
      this.schema = schema;
    }

  }

  class ParserError extends TransformError {
    constructor(schema, message, innerError) {
      super(schema, `JSON doesn't match to '${schema.target.name}' schema. ${message}`, innerError);
    }

  }

  class ValidationError extends JsonError {}

  class SerializerError extends JsonError {
    constructor(schemaName, message, innerError) {
      super(`Cannot serialize by '${schemaName}' schema. ${message}`, innerError);
      this.schemaName = schemaName;
    }

  }

  class KeyError extends ParserError {
    constructor(schema, keys, errors = {}) {
      super(schema, "Some keys doesn't match to schema");
      this.keys = keys;
      this.errors = errors;
    }

  }

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

  class JsonTransform {
    static checkValues(data, schemaItem) {
      const values = Array.isArray(data) ? data : [data];

      for (const value of values) {
        for (const validation of schemaItem.validations) {
          if (validation instanceof LengthValidation && schemaItem.repeated) {
            validation.validate(data);
          } else {
            validation.validate(value);
          }
        }
      }
    }

    static checkTypes(value, schemaItem) {
      if (schemaItem.repeated && !Array.isArray(value)) {
        throw new TypeError("Value must be Array");
      }

      if (typeof schemaItem.type === "number") {
        const values = Array.isArray(value) ? value : [value];

        for (const v of values) {
          throwIfTypeIsWrong(v, schemaItem.type);
        }
      }
    }

    static getSchemaByName(schema, name = DEFAULT_SCHEMA) {
      return _objectSpread2(_objectSpread2({}, schema.names[DEFAULT_SCHEMA]), schema.names[name]);
    }

  }

  class JsonSerializer extends JsonTransform {
    static serialize(obj, options, replacer, space) {
      const json = this.toJSON(obj, options);
      return JSON.stringify(json, replacer, space);
    }

    static toJSON(obj, options = {}) {
      let res;
      let targetSchema = options.targetSchema;
      const schemaName = options.schemaName || DEFAULT_SCHEMA;

      if (isConvertible$1(obj)) {
        return obj.toJSON();
      }

      if (Array.isArray(obj)) {
        res = [];

        for (const item of obj) {
          res.push(this.toJSON(item, options));
        }
      } else if (typeof obj === "object") {
        if (targetSchema && !schemaStorage$1.has(targetSchema)) {
          throw new JsonError("Cannot get schema for `targetSchema` param");
        }

        targetSchema = targetSchema || obj.constructor;

        if (schemaStorage$1.has(targetSchema)) {
          const schema = schemaStorage$1.get(targetSchema);
          res = {};
          const namedSchema = this.getSchemaByName(schema, schemaName);

          for (const key in namedSchema) {
            try {
              const item = namedSchema[key];
              const objItem = obj[key];
              let value;

              if (item.optional && objItem === undefined || item.defaultValue !== undefined && objItem === item.defaultValue) {
                continue;
              }

              if (!item.optional && objItem === undefined) {
                throw new SerializerError(targetSchema.name, `Property '${key}' is required.`);
              }

              if (typeof item.type === "number") {
                if (item.converter) {
                  if (item.repeated) {
                    value = objItem.map(el => item.converter.toJSON(el, obj));
                  } else {
                    value = item.converter.toJSON(objItem, obj);
                  }
                } else {
                  value = objItem;
                }
              } else {
                if (item.repeated) {
                  value = objItem.map(el => this.toJSON(el, {
                    schemaName
                  }));
                } else {
                  value = this.toJSON(objItem, {
                    schemaName
                  });
                }
              }

              this.checkTypes(value, item);
              this.checkValues(value, item);
              res[item.name || key] = value;
            } catch (e) {
              if (e instanceof SerializerError) {
                throw e;
              } else {
                throw new SerializerError(schema.target.name, `Property '${key}' is wrong. ${e.message}`, e);
              }
            }
          }
        } else {
          res = {};

          for (const key in obj) {
            res[key] = this.toJSON(obj[key], {
              schemaName
            });
          }
        }
      } else {
        res = obj;
      }

      return res;
    }

  }

  class JsonParser extends JsonTransform {
    static parse(data, options) {
      const obj = JSON.parse(data);
      return this.fromJSON(obj, options);
    }

    static fromJSON(target, options) {
      const targetSchema = options.targetSchema;
      const schemaName = options.schemaName || DEFAULT_SCHEMA;
      const obj = new targetSchema();

      if (isConvertible$1(obj)) {
        return obj.fromJSON(target);
      }

      const schema = schemaStorage$1.get(targetSchema);
      const namedSchema = this.getSchemaByName(schema, schemaName);
      const keyErrors = {};

      if (options.strictProperty && !Array.isArray(target)) {
        JsonParser.checkStrictProperty(target, namedSchema, schema);
      }

      for (const key in namedSchema) {
        try {
          const item = namedSchema[key];
          const name = item.name || key;
          const value = target[name];

          if (value === undefined && (item.optional || item.defaultValue !== undefined)) {
            continue;
          }

          if (!item.optional && value === undefined) {
            throw new ParserError(schema, `Property '${name}' is required.`);
          }

          this.checkTypes(value, item);
          this.checkValues(value, item);

          if (typeof item.type === "number") {
            if (item.converter) {
              if (item.repeated) {
                obj[key] = value.map(el => item.converter.fromJSON(el, obj));
              } else {
                obj[key] = item.converter.fromJSON(value, obj);
              }
            } else {
              obj[key] = value;
            }
          } else {
            const newOptions = _objectSpread2(_objectSpread2({}, options), {}, {
              targetSchema: item.type,
              schemaName
            });

            if (item.repeated) {
              obj[key] = value.map(el => this.fromJSON(el, newOptions));
            } else {
              obj[key] = this.fromJSON(value, newOptions);
            }
          }
        } catch (e) {
          if (!(e instanceof ParserError)) {
            e = new ParserError(schema, `Property '${key}' is wrong. ${e.message}`, e);
          }

          if (options.strictAllKeys) {
            keyErrors[key] = e;
          } else {
            throw e;
          }
        }
      }

      const keys = Object.keys(keyErrors);

      if (keys.length) {
        throw new KeyError(schema, keys, keyErrors);
      }

      return obj;
    }

    static checkStrictProperty(target, namedSchema, schema) {
      const jsonProps = Object.keys(target);
      const schemaProps = Object.keys(namedSchema);
      const keys = [];

      for (const key of jsonProps) {
        if (schemaProps.indexOf(key) === -1) {
          keys.push(key);
        }
      }

      if (keys.length) {
        throw new KeyError(schema, keys);
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

  class AlgorithmError extends CryptoError {}

  class UnsupportedOperationError extends CryptoError {
    constructor(methodName) {
      super(`Unsupported operation: ${methodName ? `${methodName}` : ""}`);
    }

  }

  class OperationError extends CryptoError {}

  class RequiredPropertyError extends CryptoError {
    constructor(propName) {
      super(`${propName}: Missing required property`);
    }

  }

  function isJWK(data) {
    return typeof data === "object" && "kty" in data;
  }

  class ProviderCrypto {
    async digest(algorithm, data) {
      this.checkDigest.apply(this, arguments);
      return this.onDigest.apply(this, arguments);
    }

    checkDigest(algorithm, data) {
      this.checkAlgorithmName(algorithm);
    }

    async onDigest(algorithm, data) {
      throw new UnsupportedOperationError("digest");
    }

    async generateKey(algorithm, extractable, keyUsages) {
      this.checkGenerateKey.apply(this, arguments);
      return this.onGenerateKey.apply(this, arguments);
    }

    checkGenerateKey(algorithm, extractable, keyUsages) {
      this.checkAlgorithmName(algorithm);
      this.checkGenerateKeyParams(algorithm);

      if (!(keyUsages && keyUsages.length)) {
        throw new TypeError(`Usages cannot be empty when creating a key.`);
      }

      let allowedUsages;

      if (Array.isArray(this.usages)) {
        allowedUsages = this.usages;
      } else {
        allowedUsages = this.usages.privateKey.concat(this.usages.publicKey);
      }

      this.checkKeyUsages(keyUsages, allowedUsages);
    }

    checkGenerateKeyParams(algorithm) {}

    async onGenerateKey(algorithm, extractable, keyUsages) {
      throw new UnsupportedOperationError("generateKey");
    }

    async sign(algorithm, key, data) {
      this.checkSign.apply(this, arguments);
      return this.onSign.apply(this, arguments);
    }

    checkSign(algorithm, key, data) {
      this.checkAlgorithmName(algorithm);
      this.checkAlgorithmParams(algorithm);
      this.checkCryptoKey(key, "sign");
    }

    async onSign(algorithm, key, data) {
      throw new UnsupportedOperationError("sign");
    }

    async verify(algorithm, key, signature, data) {
      this.checkVerify.apply(this, arguments);
      return this.onVerify.apply(this, arguments);
    }

    checkVerify(algorithm, key, signature, data) {
      this.checkAlgorithmName(algorithm);
      this.checkAlgorithmParams(algorithm);
      this.checkCryptoKey(key, "verify");
    }

    async onVerify(algorithm, key, signature, data) {
      throw new UnsupportedOperationError("verify");
    }

    async encrypt(algorithm, key, data, options) {
      this.checkEncrypt.apply(this, arguments);
      return this.onEncrypt.apply(this, arguments);
    }

    checkEncrypt(algorithm, key, data, options = {}) {
      this.checkAlgorithmName(algorithm);
      this.checkAlgorithmParams(algorithm);
      this.checkCryptoKey(key, options.keyUsage ? "encrypt" : void 0);
    }

    async onEncrypt(algorithm, key, data) {
      throw new UnsupportedOperationError("encrypt");
    }

    async decrypt(algorithm, key, data, options) {
      this.checkDecrypt.apply(this, arguments);
      return this.onDecrypt.apply(this, arguments);
    }

    checkDecrypt(algorithm, key, data, options = {}) {
      this.checkAlgorithmName(algorithm);
      this.checkAlgorithmParams(algorithm);
      this.checkCryptoKey(key, options.keyUsage ? "decrypt" : void 0);
    }

    async onDecrypt(algorithm, key, data) {
      throw new UnsupportedOperationError("decrypt");
    }

    async deriveBits(algorithm, baseKey, length, options) {
      this.checkDeriveBits.apply(this, arguments);
      return this.onDeriveBits.apply(this, arguments);
    }

    checkDeriveBits(algorithm, baseKey, length, options = {}) {
      this.checkAlgorithmName(algorithm);
      this.checkAlgorithmParams(algorithm);
      this.checkCryptoKey(baseKey, options.keyUsage ? "deriveBits" : void 0);

      if (length % 8 !== 0) {
        throw new OperationError("length: Is not multiple of 8");
      }
    }

    async onDeriveBits(algorithm, baseKey, length) {
      throw new UnsupportedOperationError("deriveBits");
    }

    async exportKey(format, key) {
      this.checkExportKey.apply(this, arguments);
      return this.onExportKey.apply(this, arguments);
    }

    checkExportKey(format, key) {
      this.checkKeyFormat(format);
      this.checkCryptoKey(key);

      if (!key.extractable) {
        throw new CryptoError("key: Is not extractable");
      }
    }

    async onExportKey(format, key) {
      throw new UnsupportedOperationError("exportKey");
    }

    async importKey(format, keyData, algorithm, extractable, keyUsages) {
      this.checkImportKey.apply(this, arguments);
      return this.onImportKey.apply(this, arguments);
    }

    checkImportKey(format, keyData, algorithm, extractable, keyUsages) {
      this.checkKeyFormat(format);
      this.checkKeyData(format, keyData);
      this.checkAlgorithmName(algorithm);
      this.checkImportParams(algorithm);

      if (Array.isArray(this.usages)) {
        this.checkKeyUsages(keyUsages, this.usages);
      }
    }

    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      throw new UnsupportedOperationError("importKey");
    }

    checkAlgorithmName(algorithm) {
      if (algorithm.name.toLowerCase() !== this.name.toLowerCase()) {
        throw new AlgorithmError("Unrecognized name");
      }
    }

    checkAlgorithmParams(algorithm) {}

    checkDerivedKeyParams(algorithm) {}

    checkKeyUsages(usages, allowed) {
      for (const usage of usages) {
        if (allowed.indexOf(usage) === -1) {
          throw new TypeError("Cannot create a key using the specified key usages");
        }
      }
    }

    checkCryptoKey(key, keyUsage) {
      this.checkAlgorithmName(key.algorithm);

      if (keyUsage && key.usages.indexOf(keyUsage) === -1) {
        throw new CryptoError(`key does not match that of operation`);
      }
    }

    checkRequiredProperty(data, propName) {
      if (!(propName in data)) {
        throw new RequiredPropertyError(propName);
      }
    }

    checkHashAlgorithm(algorithm, hashAlgorithms) {
      for (const item of hashAlgorithms) {
        if (item.toLowerCase() === algorithm.name.toLowerCase()) {
          return;
        }
      }

      throw new OperationError(`hash: Must be one of ${hashAlgorithms.join(", ")}`);
    }

    checkImportParams(algorithm) {}

    checkKeyFormat(format) {
      switch (format) {
        case "raw":
        case "pkcs8":
        case "spki":
        case "jwk":
          break;

        default:
          throw new TypeError("format: Is invalid value. Must be 'jwk', 'raw', 'spki', or 'pkcs8'");
      }
    }

    checkKeyData(format, keyData) {
      if (!keyData) {
        throw new TypeError("keyData: Cannot be empty on empty on key importing");
      }

      if (format === "jwk") {
        if (!isJWK(keyData)) {
          throw new TypeError("keyData: Is not JsonWebToken");
        }
      } else if (!BufferSourceConverter.isBufferSource(keyData)) {
        throw new TypeError("keyData: Is not ArrayBufferView or ArrayBuffer");
      }
    }

    prepareData(data) {
      return BufferSourceConverter.toArrayBuffer(data);
    }

  }

  class AesProvider extends ProviderCrypto {
    checkGenerateKeyParams(algorithm) {
      this.checkRequiredProperty(algorithm, "length");

      if (typeof algorithm.length !== "number") {
        throw new TypeError("length: Is not of type Number");
      }

      switch (algorithm.length) {
        case 128:
        case 192:
        case 256:
          break;

        default:
          throw new TypeError("length: Must be 128, 192, or 256");
      }
    }

    checkDerivedKeyParams(algorithm) {
      this.checkGenerateKeyParams(algorithm);
    }

  }

  class AesCbcProvider extends AesProvider {
    constructor() {
      super(...arguments);
      this.name = "AES-CBC";
      this.usages = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
    }

    checkAlgorithmParams(algorithm) {
      this.checkRequiredProperty(algorithm, "iv");

      if (!(algorithm.iv instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.iv))) {
        throw new TypeError("iv: Is not of type '(ArrayBuffer or ArrayBufferView)'");
      }

      if (algorithm.iv.byteLength !== 16) {
        throw new TypeError("iv: Must have length 16 bytes");
      }
    }

  }

  class AesCtrProvider extends AesProvider {
    constructor() {
      super(...arguments);
      this.name = "AES-CTR";
      this.usages = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
    }

    checkAlgorithmParams(algorithm) {
      this.checkRequiredProperty(algorithm, "counter");

      if (!(algorithm.counter instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.counter))) {
        throw new TypeError("counter: Is not of type '(ArrayBuffer or ArrayBufferView)'");
      }

      if (algorithm.counter.byteLength !== 16) {
        throw new TypeError("iv: Must have length 16 bytes");
      }

      this.checkRequiredProperty(algorithm, "length");

      if (typeof algorithm.length !== "number") {
        throw new TypeError("length: Is not a Number");
      }

      if (algorithm.length < 1) {
        throw new OperationError("length: Must be more than 0");
      }
    }

  }

  class AesEcbProvider extends AesProvider {
    constructor() {
      super(...arguments);
      this.name = "AES-ECB";
      this.usages = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
    }

  }

  class AesGcmProvider extends AesProvider {
    constructor() {
      super(...arguments);
      this.name = "AES-GCM";
      this.usages = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
    }

    checkAlgorithmParams(algorithm) {
      this.checkRequiredProperty(algorithm, "iv");

      if (!(algorithm.iv instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.iv))) {
        throw new TypeError("iv: Is not of type '(ArrayBuffer or ArrayBufferView)'");
      }

      if (algorithm.iv.byteLength < 1) {
        throw new OperationError("iv: Must have length more than 0 and less than 2^64 - 1");
      }

      if (!("tagLength" in algorithm)) {
        algorithm.tagLength = 128;
      }

      switch (algorithm.tagLength) {
        case 32:
        case 64:
        case 96:
        case 104:
        case 112:
        case 120:
        case 128:
          break;

        default:
          throw new OperationError("tagLength: Must be one of 32, 64, 96, 104, 112, 120 or 128");
      }
    }

  }

  class AesKwProvider extends AesProvider {
    constructor() {
      super(...arguments);
      this.name = "AES-KW";
      this.usages = ["wrapKey", "unwrapKey"];
    }

  }

  class DesProvider extends ProviderCrypto {
    constructor() {
      super(...arguments);
      this.usages = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
    }

    checkAlgorithmParams(algorithm) {
      if (this.ivSize) {
        this.checkRequiredProperty(algorithm, "iv");

        if (!(algorithm.iv instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.iv))) {
          throw new TypeError("iv: Is not of type '(ArrayBuffer or ArrayBufferView)'");
        }

        if (algorithm.iv.byteLength !== this.ivSize) {
          throw new TypeError(`iv: Must have length ${this.ivSize} bytes`);
        }
      }
    }

    checkGenerateKeyParams(algorithm) {
      this.checkRequiredProperty(algorithm, "length");

      if (typeof algorithm.length !== "number") {
        throw new TypeError("length: Is not of type Number");
      }

      if (algorithm.length !== this.keySizeBits) {
        throw new OperationError(`algorith.length: Must be ${this.keySizeBits}`);
      }
    }

    checkDerivedKeyParams(algorithm) {
      this.checkGenerateKeyParams(algorithm);
    }

  }

  class RsaProvider extends ProviderCrypto {
    constructor() {
      super(...arguments);
      this.hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
    }

    checkGenerateKeyParams(algorithm) {
      this.checkRequiredProperty(algorithm, "hash");
      this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
      this.checkRequiredProperty(algorithm, "publicExponent");

      if (!(algorithm.publicExponent && algorithm.publicExponent instanceof Uint8Array)) {
        throw new TypeError("publicExponent: Missing or not a Uint8Array");
      }

      const publicExponent = Convert.ToBase64(algorithm.publicExponent);

      if (!(publicExponent === "Aw==" || publicExponent === "AQAB")) {
        throw new TypeError("publicExponent: Must be [3] or [1,0,1]");
      }

      this.checkRequiredProperty(algorithm, "modulusLength");

      switch (algorithm.modulusLength) {
        case 1024:
        case 2048:
        case 4096:
          break;

        default:
          throw new TypeError("modulusLength: Must be 1024, 2048, or 4096");
      }
    }

    checkImportParams(algorithm) {
      this.checkRequiredProperty(algorithm, "hash");
      this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
    }

  }

  class RsaSsaProvider extends RsaProvider {
    constructor() {
      super(...arguments);
      this.name = "RSASSA-PKCS1-v1_5";
      this.usages = {
        privateKey: ["sign"],
        publicKey: ["verify"]
      };
    }

  }

  class RsaPssProvider extends RsaProvider {
    constructor() {
      super(...arguments);
      this.name = "RSA-PSS";
      this.usages = {
        privateKey: ["sign"],
        publicKey: ["verify"]
      };
    }

    checkAlgorithmParams(algorithm) {
      this.checkRequiredProperty(algorithm, "saltLength");

      if (typeof algorithm.saltLength !== "number") {
        throw new TypeError("saltLength: Is not a Number");
      }

      if (algorithm.saltLength < 1) {
        throw new RangeError("saltLength: Must be more than 0");
      }
    }

  }

  class RsaOaepProvider extends RsaProvider {
    constructor() {
      super(...arguments);
      this.name = "RSA-OAEP";
      this.usages = {
        privateKey: ["decrypt", "unwrapKey"],
        publicKey: ["encrypt", "wrapKey"]
      };
    }

    checkAlgorithmParams(algorithm) {
      if (algorithm.label && !(algorithm.label instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.label))) {
        throw new TypeError("label: Is not of type '(ArrayBuffer or ArrayBufferView)'");
      }
    }

  }

  class EllipticProvider extends ProviderCrypto {
    checkGenerateKeyParams(algorithm) {
      this.checkRequiredProperty(algorithm, "namedCurve");
      this.checkNamedCurve(algorithm.namedCurve);
    }

    checkNamedCurve(namedCurve) {
      for (const item of this.namedCurves) {
        if (item.toLowerCase() === namedCurve.toLowerCase()) {
          return;
        }
      }

      throw new OperationError(`namedCurve: Must be one of ${this.namedCurves.join(", ")}`);
    }

  }

  class EcdsaProvider extends EllipticProvider {
    constructor() {
      super(...arguments);
      this.name = "ECDSA";
      this.hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
      this.usages = {
        privateKey: ["sign"],
        publicKey: ["verify"]
      };
      this.namedCurves = ["P-256", "P-384", "P-521", "K-256"];
    }

    checkAlgorithmParams(algorithm) {
      this.checkRequiredProperty(algorithm, "hash");
      this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
    }

  }

  const KEY_TYPES = ["secret", "private", "public"];

  class CryptoKey {
    static create(algorithm, type, extractable, usages) {
      const key = new this();
      key.algorithm = algorithm;
      key.type = type;
      key.extractable = extractable;
      key.usages = usages;
      return key;
    }

    static isKeyType(data) {
      return KEY_TYPES.indexOf(data) !== -1;
    }

  }

  class EcdhProvider extends EllipticProvider {
    constructor() {
      super(...arguments);
      this.name = "ECDH";
      this.usages = {
        privateKey: ["deriveBits", "deriveKey"],
        publicKey: []
      };
      this.namedCurves = ["P-256", "P-384", "P-521", "K-256"];
    }

    checkAlgorithmParams(algorithm) {
      this.checkRequiredProperty(algorithm, "public");

      if (!(algorithm.public instanceof CryptoKey)) {
        throw new TypeError("public: Is not a CryptoKey");
      }

      if (algorithm.public.type !== "public") {
        throw new OperationError("public: Is not a public key");
      }

      if (algorithm.public.algorithm.name !== this.name) {
        throw new OperationError(`public: Is not ${this.name} key`);
      }
    }

  }

  class HmacProvider extends ProviderCrypto {
    constructor() {
      super(...arguments);
      this.name = "HMAC";
      this.hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
      this.usages = ["sign", "verify"];
    }

    getDefaultLength(algName) {
      switch (algName.toUpperCase()) {
        case "SHA-1":
        case "SHA-256":
        case "SHA-384":
        case "SHA-512":
          return 512;

        default:
          throw new Error(`Unknown algorithm name '${algName}'`);
      }
    }

    checkGenerateKeyParams(algorithm) {
      this.checkRequiredProperty(algorithm, "hash");
      this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);

      if ("length" in algorithm) {
        if (typeof algorithm.length !== "number") {
          throw new TypeError("length: Is not a Number");
        }

        if (algorithm.length < 1) {
          throw new RangeError("length: Number is out of range");
        }
      }
    }

    checkImportParams(algorithm) {
      this.checkRequiredProperty(algorithm, "hash");
      this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
    }

  }

  class Pbkdf2Provider extends ProviderCrypto {
    constructor() {
      super(...arguments);
      this.name = "PBKDF2";
      this.hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
      this.usages = ["deriveBits", "deriveKey"];
    }

    checkAlgorithmParams(algorithm) {
      this.checkRequiredProperty(algorithm, "hash");
      this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
      this.checkRequiredProperty(algorithm, "salt");

      if (!(algorithm.salt instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.salt))) {
        throw new TypeError("salt: Is not of type '(ArrayBuffer or ArrayBufferView)'");
      }

      this.checkRequiredProperty(algorithm, "iterations");

      if (typeof algorithm.iterations !== "number") {
        throw new TypeError("iterations: Is not a Number");
      }

      if (algorithm.iterations < 1) {
        throw new TypeError("iterations: Is less than 1");
      }
    }

    checkImportKey(format, keyData, algorithm, extractable, keyUsages) {
      super.checkImportKey(format, keyData, algorithm, extractable, keyUsages);

      if (extractable) {
        throw new SyntaxError("extractable: Must be False");
      }
    }

  }

  class Crypto {}

  class ProviderStorage {
    constructor() {
      this.items = {};
    }

    get(algorithmName) {
      return this.items[algorithmName.toLowerCase()] || null;
    }

    set(provider) {
      this.items[provider.name.toLowerCase()] = provider;
    }

    removeAt(algorithmName) {
      const provider = this.get(algorithmName.toLowerCase());

      if (provider) {
        delete this.items[algorithmName];
      }

      return provider;
    }

    has(name) {
      return !!this.get(name);
    }

    get length() {
      return Object.keys(this.items).length;
    }

    get algorithms() {
      const algorithms = [];

      for (const key in this.items) {
        const provider = this.items[key];
        algorithms.push(provider.name);
      }

      return algorithms.sort();
    }

  }

  class SubtleCrypto {
    constructor() {
      this.providers = new ProviderStorage();
    }

    static isHashedAlgorithm(data) {
      return data && typeof data === "object" && "name" in data && "hash" in data ? true : false;
    }

    async digest(algorithm, data) {
      this.checkRequiredArguments(arguments, 2, "digest");
      const preparedAlgorithm = this.prepareAlgorithm(algorithm);
      const preparedData = BufferSourceConverter.toArrayBuffer(data);
      const provider = this.getProvider(preparedAlgorithm.name);
      const result = await provider.digest(preparedAlgorithm, preparedData);
      return result;
    }

    async generateKey(algorithm, extractable, keyUsages) {
      this.checkRequiredArguments(arguments, 3, "generateKey");
      const preparedAlgorithm = this.prepareAlgorithm(algorithm);
      const provider = this.getProvider(preparedAlgorithm.name);
      const result = await provider.generateKey(_objectSpread2(_objectSpread2({}, preparedAlgorithm), {}, {
        name: provider.name
      }), extractable, keyUsages);
      return result;
    }

    async sign(algorithm, key, data) {
      this.checkRequiredArguments(arguments, 3, "sign");
      this.checkCryptoKey(key);
      const preparedAlgorithm = this.prepareAlgorithm(algorithm);
      const preparedData = BufferSourceConverter.toArrayBuffer(data);
      const provider = this.getProvider(preparedAlgorithm.name);
      const result = await provider.sign(_objectSpread2(_objectSpread2({}, preparedAlgorithm), {}, {
        name: provider.name
      }), key, preparedData);
      return result;
    }

    async verify(algorithm, key, signature, data) {
      this.checkRequiredArguments(arguments, 4, "verify");
      this.checkCryptoKey(key);
      const preparedAlgorithm = this.prepareAlgorithm(algorithm);
      const preparedData = BufferSourceConverter.toArrayBuffer(data);
      const preparedSignature = BufferSourceConverter.toArrayBuffer(signature);
      const provider = this.getProvider(preparedAlgorithm.name);
      const result = await provider.verify(_objectSpread2(_objectSpread2({}, preparedAlgorithm), {}, {
        name: provider.name
      }), key, preparedSignature, preparedData);
      return result;
    }

    async encrypt(algorithm, key, data) {
      this.checkRequiredArguments(arguments, 3, "encrypt");
      this.checkCryptoKey(key);
      const preparedAlgorithm = this.prepareAlgorithm(algorithm);
      const preparedData = BufferSourceConverter.toArrayBuffer(data);
      const provider = this.getProvider(preparedAlgorithm.name);
      const result = await provider.encrypt(_objectSpread2(_objectSpread2({}, preparedAlgorithm), {}, {
        name: provider.name
      }), key, preparedData, {
        keyUsage: true
      });
      return result;
    }

    async decrypt(algorithm, key, data) {
      this.checkRequiredArguments(arguments, 3, "decrypt");
      this.checkCryptoKey(key);
      const preparedAlgorithm = this.prepareAlgorithm(algorithm);
      const preparedData = BufferSourceConverter.toArrayBuffer(data);
      const provider = this.getProvider(preparedAlgorithm.name);
      const result = await provider.decrypt(_objectSpread2(_objectSpread2({}, preparedAlgorithm), {}, {
        name: provider.name
      }), key, preparedData, {
        keyUsage: true
      });
      return result;
    }

    async deriveBits(algorithm, baseKey, length) {
      this.checkRequiredArguments(arguments, 3, "deriveBits");
      this.checkCryptoKey(baseKey);
      const preparedAlgorithm = this.prepareAlgorithm(algorithm);
      const provider = this.getProvider(preparedAlgorithm.name);
      const result = await provider.deriveBits(_objectSpread2(_objectSpread2({}, preparedAlgorithm), {}, {
        name: provider.name
      }), baseKey, length, {
        keyUsage: true
      });
      return result;
    }

    async deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages) {
      this.checkRequiredArguments(arguments, 5, "deriveKey");
      const preparedDerivedKeyType = this.prepareAlgorithm(derivedKeyType);
      const importProvider = this.getProvider(preparedDerivedKeyType.name);
      importProvider.checkDerivedKeyParams(preparedDerivedKeyType);
      const preparedAlgorithm = this.prepareAlgorithm(algorithm);
      const provider = this.getProvider(preparedAlgorithm.name);
      provider.checkCryptoKey(baseKey, "deriveKey");
      const derivedBits = await provider.deriveBits(_objectSpread2(_objectSpread2({}, preparedAlgorithm), {}, {
        name: provider.name
      }), baseKey, derivedKeyType.length, {
        keyUsage: false
      });
      return this.importKey("raw", derivedBits, derivedKeyType, extractable, keyUsages);
    }

    async exportKey(format, key) {
      this.checkRequiredArguments(arguments, 2, "exportKey");
      this.checkCryptoKey(key);
      const provider = this.getProvider(key.algorithm.name);
      const result = await provider.exportKey(format, key);
      return result;
    }

    async importKey(format, keyData, algorithm, extractable, keyUsages) {
      this.checkRequiredArguments(arguments, 5, "importKey");
      const preparedAlgorithm = this.prepareAlgorithm(algorithm);
      const provider = this.getProvider(preparedAlgorithm.name);

      if (["pkcs8", "spki", "raw"].indexOf(format) !== -1) {
        const preparedData = BufferSourceConverter.toArrayBuffer(keyData);
        return provider.importKey(format, preparedData, _objectSpread2(_objectSpread2({}, preparedAlgorithm), {}, {
          name: provider.name
        }), extractable, keyUsages);
      } else {
        if (!keyData.kty) {
          throw new TypeError("keyData: Is not JSON");
        }
      }

      return provider.importKey(format, keyData, _objectSpread2(_objectSpread2({}, preparedAlgorithm), {}, {
        name: provider.name
      }), extractable, keyUsages);
    }

    async wrapKey(format, key, wrappingKey, wrapAlgorithm) {
      let keyData = await this.exportKey(format, key);

      if (format === "jwk") {
        const json = JSON.stringify(keyData);
        keyData = Convert.FromUtf8String(json);
      }

      const preparedAlgorithm = this.prepareAlgorithm(wrapAlgorithm);
      const preparedData = BufferSourceConverter.toArrayBuffer(keyData);
      const provider = this.getProvider(preparedAlgorithm.name);
      return provider.encrypt(_objectSpread2(_objectSpread2({}, preparedAlgorithm), {}, {
        name: provider.name
      }), wrappingKey, preparedData, {
        keyUsage: false
      });
    }

    async unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages) {
      const preparedAlgorithm = this.prepareAlgorithm(unwrapAlgorithm);
      const preparedData = BufferSourceConverter.toArrayBuffer(wrappedKey);
      const provider = this.getProvider(preparedAlgorithm.name);
      let keyData = await provider.decrypt(_objectSpread2(_objectSpread2({}, preparedAlgorithm), {}, {
        name: provider.name
      }), unwrappingKey, preparedData, {
        keyUsage: false
      });

      if (format === "jwk") {
        try {
          keyData = JSON.parse(Convert.ToUtf8String(keyData));
        } catch (e) {
          const error = new TypeError("wrappedKey: Is not a JSON");
          error.internal = e;
          throw error;
        }
      }

      return this.importKey(format, keyData, unwrappedKeyAlgorithm, extractable, keyUsages);
    }

    checkRequiredArguments(args, size, methodName) {
      if (args.length !== size) {
        throw new TypeError(`Failed to execute '${methodName}' on 'SubtleCrypto': ${size} arguments required, but only ${args.length} present`);
      }
    }

    prepareAlgorithm(algorithm) {
      if (typeof algorithm === "string") {
        return {
          name: algorithm
        };
      }

      if (SubtleCrypto.isHashedAlgorithm(algorithm)) {
        const preparedAlgorithm = _objectSpread2({}, algorithm);

        preparedAlgorithm.hash = this.prepareAlgorithm(algorithm.hash);
        return preparedAlgorithm;
      }

      return _objectSpread2({}, algorithm);
    }

    getProvider(name) {
      const provider = this.providers.get(name);

      if (!provider) {
        throw new AlgorithmError("Unrecognized name");
      }

      return provider;
    }

    checkCryptoKey(key) {
      if (!(key instanceof CryptoKey)) {
        throw new TypeError(`Key is not of type 'CryptoKey'`);
      }
    }

  }

  let ObjectIdentifier = class ObjectIdentifier {
    constructor(value) {
      if (value) {
        this.value = value;
      }
    }

  };

  __decorate([AsnProp({
    type: AsnPropTypes.ObjectIdentifier
  })], ObjectIdentifier.prototype, "value", void 0);

  ObjectIdentifier = __decorate([AsnType({
    type: AsnTypeTypes.Choice
  })], ObjectIdentifier);

  class AlgorithmIdentifier {
    constructor(params) {
      Object.assign(this, params);
    }

  }

  __decorate([AsnProp({
    type: AsnPropTypes.ObjectIdentifier
  })], AlgorithmIdentifier.prototype, "algorithm", void 0);

  __decorate([AsnProp({
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

  __decorate([AsnProp({
    type: AsnPropTypes.Integer
  })], PrivateKeyInfo.prototype, "version", void 0);

  __decorate([AsnProp({
    type: AlgorithmIdentifier
  })], PrivateKeyInfo.prototype, "privateKeyAlgorithm", void 0);

  __decorate([AsnProp({
    type: AsnPropTypes.OctetString
  })], PrivateKeyInfo.prototype, "privateKey", void 0);

  __decorate([AsnProp({
    type: AsnPropTypes.Any,
    optional: true
  })], PrivateKeyInfo.prototype, "attributes", void 0);

  class PublicKeyInfo {
    constructor() {
      this.publicKeyAlgorithm = new AlgorithmIdentifier();
      this.publicKey = new ArrayBuffer(0);
    }

  }

  __decorate([AsnProp({
    type: AlgorithmIdentifier
  })], PublicKeyInfo.prototype, "publicKeyAlgorithm", void 0);

  __decorate([AsnProp({
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

  __decorate([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerConverter
  })], RsaPrivateKey.prototype, "version", void 0);

  __decorate([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "n",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "modulus", void 0);

  __decorate([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "e",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "publicExponent", void 0);

  __decorate([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "d",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "privateExponent", void 0);

  __decorate([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "p",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "prime1", void 0);

  __decorate([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "q",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "prime2", void 0);

  __decorate([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "dp",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "exponent1", void 0);

  __decorate([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "dq",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "exponent2", void 0);

  __decorate([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "qi",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPrivateKey.prototype, "coefficient", void 0);

  __decorate([AsnProp({
    type: AsnPropTypes.Any,
    optional: true
  })], RsaPrivateKey.prototype, "otherPrimeInfos", void 0);

  class RsaPublicKey {
    constructor() {
      this.modulus = new ArrayBuffer(0);
      this.publicExponent = new ArrayBuffer(0);
    }

  }

  __decorate([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter$1
  }), JsonProp({
    name: "n",
    converter: JsonBase64UrlArrayBufferConverter
  })], RsaPublicKey.prototype, "modulus", void 0);

  __decorate([AsnProp({
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

  __decorate([AsnProp({
    type: AsnPropTypes.OctetString
  })], EcPublicKey.prototype, "value", void 0);

  EcPublicKey = __decorate([AsnType({
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

  __decorate([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerConverter
  })], EcPrivateKey.prototype, "version", void 0);

  __decorate([AsnProp({
    type: AsnPropTypes.OctetString
  })], EcPrivateKey.prototype, "privateKey", void 0);

  __decorate([AsnProp({
    context: 0,
    type: AsnPropTypes.Any,
    optional: true
  })], EcPrivateKey.prototype, "parameters", void 0);

  __decorate([AsnProp({
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

  __decorate([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerWithoutPaddingConverter
  })], EcDsaSignature.prototype, "r", void 0);

  __decorate([AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerWithoutPaddingConverter
  })], EcDsaSignature.prototype, "s", void 0);

  let ObjectIdentifier$1 = (() => {
    let ObjectIdentifier = class ObjectIdentifier {
      constructor(value) {
        if (value) {
          this.value = value;
        }
      }

    };

    __decorate([AsnProp({
      type: AsnPropTypes.ObjectIdentifier
    })], ObjectIdentifier.prototype, "value", void 0);

    ObjectIdentifier = __decorate([AsnType({
      type: AsnTypeTypes.Choice
    })], ObjectIdentifier);
    return ObjectIdentifier;
  })();

  let AlgorithmIdentifier$1 = (() => {
    class AlgorithmIdentifier {
      constructor(params) {
        Object.assign(this, params);
      }

    }

    __decorate([AsnProp({
      type: AsnPropTypes.ObjectIdentifier
    })], AlgorithmIdentifier.prototype, "algorithm", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.Any,
      optional: true
    })], AlgorithmIdentifier.prototype, "parameters", void 0);

    return AlgorithmIdentifier;
  })();

  let PrivateKeyInfo$1 = (() => {
    class PrivateKeyInfo {
      constructor() {
        this.version = 0;
        this.privateKeyAlgorithm = new AlgorithmIdentifier$1();
        this.privateKey = new ArrayBuffer(0);
      }

    }

    __decorate([AsnProp({
      type: AsnPropTypes.Integer
    })], PrivateKeyInfo.prototype, "version", void 0);

    __decorate([AsnProp({
      type: AlgorithmIdentifier$1
    })], PrivateKeyInfo.prototype, "privateKeyAlgorithm", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.OctetString
    })], PrivateKeyInfo.prototype, "privateKey", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.Any,
      optional: true
    })], PrivateKeyInfo.prototype, "attributes", void 0);

    return PrivateKeyInfo;
  })();

  let PublicKeyInfo$1 = (() => {
    class PublicKeyInfo {
      constructor() {
        this.publicKeyAlgorithm = new AlgorithmIdentifier$1();
        this.publicKey = new ArrayBuffer(0);
      }

    }

    __decorate([AsnProp({
      type: AlgorithmIdentifier$1
    })], PublicKeyInfo.prototype, "publicKeyAlgorithm", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.BitString
    })], PublicKeyInfo.prototype, "publicKey", void 0);

    return PublicKeyInfo;
  })();

  const JsonBase64UrlArrayBufferConverter$1 = {
    fromJSON: value => Convert.FromBase64Url(value),
    toJSON: value => Convert.ToBase64Url(new Uint8Array(value))
  };
  var Browser;

  (function (Browser) {
    Browser["Unknown"] = "Unknown";
    Browser["IE"] = "Internet Explorer";
    Browser["Safari"] = "Safari";
    Browser["Edge"] = "Edge";
    Browser["Chrome"] = "Chrome";
    Browser["Firefox"] = "Firefox Mozilla";
    Browser["Mobile"] = "Mobile";
  })(Browser || (Browser = {}));

  function BrowserInfo() {
    const res = {
      name: Browser.Unknown,
      version: "0"
    };

    if (typeof self === "undefined") {
      return res;
    }

    const userAgent = self.navigator.userAgent;
    let reg;

    if (reg = /edge\/([\d\.]+)/i.exec(userAgent)) {
      res.name = Browser.Edge;
      res.version = reg[1];
    } else if (/msie/i.test(userAgent)) {
      res.name = Browser.IE;
      res.version = /msie ([\d\.]+)/i.exec(userAgent)[1];
    } else if (/Trident/i.test(userAgent)) {
      res.name = Browser.IE;
      res.version = /rv:([\d\.]+)/i.exec(userAgent)[1];
    } else if (/chrome/i.test(userAgent)) {
      res.name = Browser.Chrome;
      res.version = /chrome\/([\d\.]+)/i.exec(userAgent)[1];
    } else if (/firefox/i.test(userAgent)) {
      res.name = Browser.Firefox;
      res.version = /firefox\/([\d\.]+)/i.exec(userAgent)[1];
    } else if (/mobile/i.test(userAgent)) {
      res.name = Browser.Mobile;
      res.version = /mobile\/([\w]+)/i.exec(userAgent)[1];
    } else if (/safari/i.test(userAgent)) {
      res.name = Browser.Safari;
      res.version = /version\/([\d\.]+)/i.exec(userAgent)[1];
    }

    return res;
  }

  function concat(...buf) {
    const res = new Uint8Array(buf.map(item => item.length).reduce((prev, cur) => prev + cur));
    let offset = 0;
    buf.forEach((item, index) => {
      for (let i = 0; i < item.length; i++) {
        res[offset + i] = item[i];
      }

      offset += item.length;
    });
    return res;
  }

  const AsnIntegerArrayBufferConverter$2 = {
    fromASN: value => {
      const valueHex = value.valueBlock.valueHex;
      return !new Uint8Array(valueHex)[0] ? value.valueBlock.valueHex.slice(1) : value.valueBlock.valueHex;
    },
    toASN: value => {
      const valueHex = new Uint8Array(value)[0] > 127 ? concat(new Uint8Array([0]), new Uint8Array(value)) : new Uint8Array(value);
      return new asn1_31({
        valueHex: new Uint8Array(valueHex).buffer
      });
    }
  };

  let RsaPrivateKey$1 = (() => {
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

    __decorate([AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerConverter
    })], RsaPrivateKey.prototype, "version", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter$2
    }), JsonProp({
      name: "n",
      converter: JsonBase64UrlArrayBufferConverter$1
    })], RsaPrivateKey.prototype, "modulus", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter$2
    }), JsonProp({
      name: "e",
      converter: JsonBase64UrlArrayBufferConverter$1
    })], RsaPrivateKey.prototype, "publicExponent", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter$2
    }), JsonProp({
      name: "d",
      converter: JsonBase64UrlArrayBufferConverter$1
    })], RsaPrivateKey.prototype, "privateExponent", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter$2
    }), JsonProp({
      name: "p",
      converter: JsonBase64UrlArrayBufferConverter$1
    })], RsaPrivateKey.prototype, "prime1", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter$2
    }), JsonProp({
      name: "q",
      converter: JsonBase64UrlArrayBufferConverter$1
    })], RsaPrivateKey.prototype, "prime2", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter$2
    }), JsonProp({
      name: "dp",
      converter: JsonBase64UrlArrayBufferConverter$1
    })], RsaPrivateKey.prototype, "exponent1", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter$2
    }), JsonProp({
      name: "dq",
      converter: JsonBase64UrlArrayBufferConverter$1
    })], RsaPrivateKey.prototype, "exponent2", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter$2
    }), JsonProp({
      name: "qi",
      converter: JsonBase64UrlArrayBufferConverter$1
    })], RsaPrivateKey.prototype, "coefficient", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.Any,
      optional: true
    })], RsaPrivateKey.prototype, "otherPrimeInfos", void 0);

    return RsaPrivateKey;
  })();

  let RsaPublicKey$1 = (() => {
    class RsaPublicKey {
      constructor() {
        this.modulus = new ArrayBuffer(0);
        this.publicExponent = new ArrayBuffer(0);
      }

    }

    __decorate([AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter$2
    }), JsonProp({
      name: "n",
      converter: JsonBase64UrlArrayBufferConverter$1
    })], RsaPublicKey.prototype, "modulus", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerArrayBufferConverter$2
    }), JsonProp({
      name: "e",
      converter: JsonBase64UrlArrayBufferConverter$1
    })], RsaPublicKey.prototype, "publicExponent", void 0);

    return RsaPublicKey;
  })();

  let EcPublicKey$1 = (() => {
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
        const value = concat(new Uint8Array([0x04]), new Uint8Array(x), new Uint8Array(y));
        this.value = new Uint8Array(value).buffer;
        return this;
      }

    };

    __decorate([AsnProp({
      type: AsnPropTypes.OctetString
    })], EcPublicKey.prototype, "value", void 0);

    EcPublicKey = __decorate([AsnType({
      type: AsnTypeTypes.Choice
    })], EcPublicKey);
    return EcPublicKey;
  })();

  let EcPrivateKey$1 = (() => {
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
          const publicKey = new EcPublicKey$1();
          publicKey.fromJSON(json);
          this.publicKey = AsnSerializer.toASN(publicKey).valueBlock.valueHex;
        }

        return this;
      }

      toJSON() {
        const jwk = {};
        jwk.d = Convert.ToBase64Url(this.privateKey);

        if (this.publicKey) {
          Object.assign(jwk, new EcPublicKey$1(this.publicKey).toJSON());
        }

        return jwk;
      }

    }

    __decorate([AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerConverter
    })], EcPrivateKey.prototype, "version", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.OctetString
    })], EcPrivateKey.prototype, "privateKey", void 0);

    __decorate([AsnProp({
      context: 0,
      type: AsnPropTypes.Any,
      optional: true
    })], EcPrivateKey.prototype, "parameters", void 0);

    __decorate([AsnProp({
      context: 1,
      type: AsnPropTypes.BitString,
      optional: true
    })], EcPrivateKey.prototype, "publicKey", void 0);

    return EcPrivateKey;
  })();

  const AsnIntegerWithoutPaddingConverter$1 = {
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
          valueHex: newValue
        });
      }

      return new asn1_31({
        valueHex: value
      });
    }
  };

  let EcDsaSignature$1 = (() => {
    class EcDsaSignature {
      constructor() {
        this.r = new ArrayBuffer(0);
        this.s = new ArrayBuffer(0);
      }

    }

    __decorate([AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerWithoutPaddingConverter$1
    })], EcDsaSignature.prototype, "r", void 0);

    __decorate([AsnProp({
      type: AsnPropTypes.Integer,
      converter: AsnIntegerWithoutPaddingConverter$1
    })], EcDsaSignature.prototype, "s", void 0);

    return EcDsaSignature;
  })();

  class Debug {
    static get enabled() {
      return typeof self !== "undefined" && self.PV_WEBCRYPTO_LINER_LOG;
    }

    static log(message, ...optionalParams) {
      if (this.enabled) {
        console.log.apply(console, arguments);
      }
    }

    static error(message, ...optionalParams) {
      if (this.enabled) {
        console.error.apply(console, arguments);
      }
    }

    static info(message, ...optionalParams) {
      if (this.enabled) {
        console.info.apply(console, arguments);
      }
    }

    static warn(message, ...optionalParams) {
      if (this.enabled) {
        console.warn.apply(console, arguments);
      }
    }

    static trace(message, ...optionalParams) {
      if (this.enabled) {
        console.trace.apply(console, arguments);
      }
    }

  }

  class CryptoKey$1 extends CryptoKey {
    constructor(algorithm, extractable, type, usages) {
      super();
      this.extractable = extractable;
      this.type = type;
      this.usages = usages;
      this.algorithm = Object.assign({}, algorithm);
    }

  }

  function isAlgorithm(algorithm, name) {
    return algorithm.name.toUpperCase() === name.toUpperCase();
  }

  class AesCryptoKey extends CryptoKey$1 {
    constructor(algorithm, extractable, usages, raw) {
      super(algorithm, extractable, "secret", usages);
      this.raw = raw;
    }

    toJSON() {
      const jwk = {
        kty: "oct",
        alg: this.getJwkAlgorithm(),
        k: Convert.ToBase64Url(this.raw),
        ext: this.extractable,
        key_ops: this.usages
      };
      return jwk;
    }

    getJwkAlgorithm() {
      switch (this.algorithm.name.toUpperCase()) {
        case "AES-CBC":
          return `A${this.algorithm.length}CBC`;

        case "AES-CTR":
          return `A${this.algorithm.length}CTR`;

        case "AES-GCM":
          return `A${this.algorithm.length}GCM`;

        case "AES-ECB":
          return `A${this.algorithm.length}ECB`;

        default:
          throw new AlgorithmError("Unsupported algorithm name");
      }
    }

  }

  let AesCrypto = (() => {
    class AesCrypto {
      static checkCryptoKey(key) {
        if (!(key instanceof AesCryptoKey)) {
          throw new TypeError("key: Is not AesCryptoKey");
        }
      }

      static generateKey(algorithm, extractable, usages) {
        return __awaiter(this, void 0, void 0, function* () {
          const raw = exports.nativeCrypto.getRandomValues(new Uint8Array(algorithm.length / 8));
          return new AesCryptoKey(algorithm, extractable, usages, raw);
        });
      }

      static encrypt(algorithm, key, data) {
        return __awaiter(this, void 0, void 0, function* () {
          return this.cipher(algorithm, key, BufferSourceConverter.toUint8Array(data), true);
        });
      }

      static decrypt(algorithm, key, data) {
        return __awaiter(this, void 0, void 0, function* () {
          return this.cipher(algorithm, key, BufferSourceConverter.toUint8Array(data), false);
        });
      }

      static exportKey(format, key) {
        return __awaiter(this, void 0, void 0, function* () {
          switch (format) {
            case "jwk":
              return key.toJSON();

            case "raw":
              return key.raw.buffer;

            default:
              throw new OperationError("format: Must be 'jwk' or 'raw'");
          }
        });
      }

      static importKey(format, keyData, algorithm, extractable, keyUsages) {
        return __awaiter(this, void 0, void 0, function* () {
          let raw;

          if (isJWK(keyData)) {
            raw = Convert.FromBase64Url(keyData.k);
          } else {
            raw = BufferSourceConverter.toArrayBuffer(keyData);
          }

          switch (raw.byteLength << 3) {
            case 128:
            case 192:
            case 256:
              break;

            default:
              throw new OperationError("keyData: Is wrong key length");
          }

          const key = new AesCryptoKey({
            name: algorithm.name,
            length: raw.byteLength << 3
          }, extractable, keyUsages, new Uint8Array(raw));
          return key;
        });
      }

      static cipher(algorithm, key, data, encrypt) {
        return __awaiter(this, void 0, void 0, function* () {
          const action = encrypt ? "encrypt" : "decrypt";
          let result;

          if (isAlgorithm(algorithm, AesCrypto.AesCBC)) {
            const iv = BufferSourceConverter.toUint8Array(algorithm.iv);
            result = asmcrypto_js.AES_CBC[action](data, key.raw, undefined, iv);
          } else if (isAlgorithm(algorithm, AesCrypto.AesGCM)) {
            const iv = BufferSourceConverter.toUint8Array(algorithm.iv);
            let additionalData;

            if (algorithm.additionalData) {
              additionalData = BufferSourceConverter.toArrayBuffer(algorithm.additionalData);
            }

            const tagLength = (algorithm.tagLength || 128) / 8;
            result = asmcrypto_js.AES_GCM[action](data, key.raw, iv, additionalData, tagLength);
          } else if (isAlgorithm(algorithm, AesCrypto.AesECB)) {
            result = asmcrypto_js.AES_ECB[action](data, key.raw, true);
          } else {
            throw new OperationError(`algorithm: Is not recognized`);
          }

          return BufferSourceConverter.toArrayBuffer(result);
        });
      }

    }

    AesCrypto.AesCBC = "AES-CBC";
    AesCrypto.AesECB = "AES-ECB";
    AesCrypto.AesGCM = "AES-GCM";
    return AesCrypto;
  })();

  class AesCbcProvider$1 extends AesCbcProvider {
    onGenerateKey(algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.generateKey(algorithm, extractable, keyUsages);
      });
    }

    onEncrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.encrypt(algorithm, key, data);
      });
    }

    onDecrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.decrypt(algorithm, key, data);
      });
    }

    onExportKey(format, key) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.exportKey(format, key);
      });
    }

    onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.importKey(format, keyData, algorithm, extractable, keyUsages);
      });
    }

    checkCryptoKey(key, keyUsage) {
      super.checkCryptoKey(key, keyUsage);
      AesCrypto.checkCryptoKey(key);
    }

  }

  class AesEcbProvider$1 extends AesEcbProvider {
    onGenerateKey(algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.generateKey(algorithm, extractable, keyUsages);
      });
    }

    onEncrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.encrypt(algorithm, key, data);
      });
    }

    onDecrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.decrypt(algorithm, key, data);
      });
    }

    onExportKey(format, key) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.exportKey(format, key);
      });
    }

    onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.importKey(format, keyData, algorithm, extractable, keyUsages);
      });
    }

    checkCryptoKey(key, keyUsage) {
      super.checkCryptoKey(key, keyUsage);
      AesCrypto.checkCryptoKey(key);
    }

  }

  class AesGcmProvider$1 extends AesGcmProvider {
    onGenerateKey(algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.generateKey(algorithm, extractable, keyUsages);
      });
    }

    onEncrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.encrypt(algorithm, key, data);
      });
    }

    onDecrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.decrypt(algorithm, key, data);
      });
    }

    onExportKey(format, key) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.exportKey(format, key);
      });
    }

    onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.importKey(format, keyData, algorithm, extractable, keyUsages);
      });
    }

    checkCryptoKey(key, keyUsage) {
      super.checkCryptoKey(key, keyUsage);
      AesCrypto.checkCryptoKey(key);
    }

  }

  class AesCtrProvider$1 extends AesCtrProvider {
    onEncrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        const result = new asmcrypto_js.AES_CTR(key.raw, BufferSourceConverter.toUint8Array(algorithm.counter)).encrypt(BufferSourceConverter.toUint8Array(data));
        return BufferSourceConverter.toArrayBuffer(result);
      });
    }

    onDecrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        const result = new asmcrypto_js.AES_CTR(key.raw, BufferSourceConverter.toUint8Array(algorithm.counter)).decrypt(BufferSourceConverter.toUint8Array(data));
        return BufferSourceConverter.toArrayBuffer(result);
      });
    }

    onGenerateKey(algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.generateKey(algorithm, extractable, keyUsages);
      });
    }

    onExportKey(format, key) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.exportKey(format, key);
      });
    }

    onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return AesCrypto.importKey(format, keyData, algorithm, extractable, keyUsages);
      });
    }

    checkCryptoKey(key, keyUsage) {
      super.checkCryptoKey(key, keyUsage);
      AesCrypto.checkCryptoKey(key);
    }

  }

  class AesKwProvider$1 extends AesKwProvider {
    onEncrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        throw new Error("Method not implemented.");
      });
    }

    onDecrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        throw new Error("Method not implemented.");
      });
    }

    onGenerateKey(algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        throw new Error("Method not implemented.");
      });
    }

    onExportKey(format, key) {
      return __awaiter(this, void 0, void 0, function* () {
        throw new Error("Method not implemented.");
      });
    }

    onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        throw new Error("Method not implemented.");
      });
    }

    checkCryptoKey(key, keyUsage) {
      super.checkCryptoKey(key, keyUsage);
      AesCrypto.checkCryptoKey(key);
    }

  }

  class RsaCryptoKey extends CryptoKey$1 {
    constructor(algorithm, extractable, type, usages, data) {
      super(algorithm, extractable, type, usages);
      this.data = data;
    }

  }

  let RsaCrypto = (() => {
    class RsaCrypto {
      static checkCryptoKey(key) {
        if (!(key instanceof RsaCryptoKey)) {
          throw new TypeError("key: Is not RsaCryptoKey");
        }
      }

      static generateKey(algorithm, extractable, keyUsages) {
        return __awaiter(this, void 0, void 0, function* () {
          const alg = {
            name: "RSA-PSS",
            hash: "SHA-256",
            publicExponent: algorithm.publicExponent,
            modulusLength: algorithm.modulusLength
          };
          const keys = yield exports.nativeSubtle.generateKey(alg, true, ["sign", "verify"]);
          const crypto = new Crypto$1();
          const pkcs8 = yield crypto.subtle.exportKey("pkcs8", keys.privateKey);
          const privateKey = yield crypto.subtle.importKey("pkcs8", pkcs8, algorithm, extractable, keyUsages.filter(o => this.privateUsages.includes(o)));
          const spki = yield crypto.subtle.exportKey("spki", keys.publicKey);
          const publicKey = yield crypto.subtle.importKey("spki", spki, algorithm, true, keyUsages.filter(o => this.publicUsages.includes(o)));
          return {
            privateKey,
            publicKey
          };
        });
      }

      static exportKey(format, key) {
        return __awaiter(this, void 0, void 0, function* () {
          switch (format) {
            case "pkcs8":
              return this.exportPkcs8Key(key);

            case "spki":
              return this.exportSpkiKey(key);

            case "jwk":
              return this.exportJwkKey(key);

            default:
              throw new OperationError("format: Must be 'jwk', 'pkcs8' or 'spki'");
          }
        });
      }

      static importKey(format, keyData, algorithm, extractable, keyUsages) {
        return __awaiter(this, void 0, void 0, function* () {
          let asmKey;

          switch (format) {
            case "pkcs8":
              asmKey = this.importPkcs8Key(keyData);
              break;

            case "spki":
              asmKey = this.importSpkiKey(keyData);
              break;

            case "jwk":
              asmKey = this.importJwkKey(keyData);
              break;

            default:
              throw new OperationError("format: Must be 'jwk', 'pkcs8' or 'spki'");
          }

          const key = new RsaCryptoKey(Object.assign({
            publicExponent: asmKey[1][1] === 1 ? asmKey[1].slice(1) : asmKey[1].slice(3),
            modulusLength: asmKey[0].byteLength << 3
          }, algorithm), extractable, asmKey.length === 2 ? "public" : "private", keyUsages, asmKey);
          return key;
        });
      }

      static randomNonZeroValues(data) {
        data = exports.nativeCrypto.getRandomValues(data);
        return data.map(n => {
          while (!n) {
            n = exports.nativeCrypto.getRandomValues(new Uint8Array(1))[0];
          }

          return n;
        });
      }

      static exportPkcs8Key(key) {
        const keyInfo = new PrivateKeyInfo$1();
        keyInfo.privateKeyAlgorithm.algorithm = "1.2.840.113549.1.1.1";
        keyInfo.privateKeyAlgorithm.parameters = null;
        keyInfo.privateKey = AsnSerializer.serialize(this.exportAsmKey(key.data));
        return AsnSerializer.serialize(keyInfo);
      }

      static importPkcs8Key(data) {
        const keyInfo = AsnParser.parse(data, PrivateKeyInfo$1);
        const privateKey = AsnParser.parse(keyInfo.privateKey, RsaPrivateKey$1);
        return this.importAsmKey(privateKey);
      }

      static importSpkiKey(data) {
        const keyInfo = AsnParser.parse(data, PublicKeyInfo$1);
        const publicKey = AsnParser.parse(keyInfo.publicKey, RsaPublicKey$1);
        return this.importAsmKey(publicKey);
      }

      static exportSpkiKey(key) {
        const publicKey = new RsaPublicKey$1();
        publicKey.modulus = key.data[0].buffer;
        publicKey.publicExponent = key.data[1][1] === 1 ? key.data[1].buffer.slice(1) : key.data[1].buffer.slice(3);
        const keyInfo = new PublicKeyInfo$1();
        keyInfo.publicKeyAlgorithm.algorithm = "1.2.840.113549.1.1.1";
        keyInfo.publicKeyAlgorithm.parameters = null;
        keyInfo.publicKey = AsnSerializer.serialize(publicKey);
        return AsnSerializer.serialize(keyInfo);
      }

      static importJwkKey(data) {
        let key;

        if (data.d) {
          key = JsonParser.fromJSON(data, {
            targetSchema: RsaPrivateKey$1
          });
        } else {
          key = JsonParser.fromJSON(data, {
            targetSchema: RsaPublicKey$1
          });
        }

        return this.importAsmKey(key);
      }

      static exportJwkKey(key) {
        const asnKey = this.exportAsmKey(key.data);
        const jwk = JsonSerializer.toJSON(asnKey);
        jwk.ext = true;
        jwk.key_ops = key.usages;
        jwk.kty = "RSA";
        jwk.alg = this.getJwkAlgorithm(key.algorithm);
        return jwk;
      }

      static getJwkAlgorithm(algorithm) {
        switch (algorithm.name.toUpperCase()) {
          case "RSA-OAEP":
            const mdSize = /(\d+)$/.exec(algorithm.hash.name)[1];
            return `RSA-OAEP${mdSize !== "1" ? `-${mdSize}` : ""}`;

          case "RSASSA-PKCS1-V1_5":
            return `RS${/(\d+)$/.exec(algorithm.hash.name)[1]}`;

          case "RSA-PSS":
            return `PS${/(\d+)$/.exec(algorithm.hash.name)[1]}`;

          case "RSAES-PKCS1-V1_5":
            return `PS1`;

          default:
            throw new OperationError("algorithm: Is not recognized");
        }
      }

      static exportAsmKey(asmKey) {
        let key;

        if (asmKey.length > 2) {
          const privateKey = new RsaPrivateKey$1();
          privateKey.privateExponent = asmKey[2].buffer;
          privateKey.prime1 = asmKey[3].buffer;
          privateKey.prime2 = asmKey[4].buffer;
          privateKey.exponent1 = asmKey[5].buffer;
          privateKey.exponent2 = asmKey[6].buffer;
          privateKey.coefficient = asmKey[7].buffer;
          key = privateKey;
        } else {
          key = new RsaPublicKey$1();
        }

        key.modulus = asmKey[0].buffer;
        key.publicExponent = asmKey[1][1] === 1 ? asmKey[1].buffer.slice(1) : asmKey[1].buffer.slice(3);
        return key;
      }

      static importAsmKey(key) {
        const expPadding = new Uint8Array(4 - key.publicExponent.byteLength);
        const asmKey = [new Uint8Array(key.modulus), concat(expPadding, new Uint8Array(key.publicExponent))];

        if (key instanceof RsaPrivateKey$1) {
          asmKey.push(new Uint8Array(key.privateExponent));
          asmKey.push(new Uint8Array(key.prime1));
          asmKey.push(new Uint8Array(key.prime2));
          asmKey.push(new Uint8Array(key.exponent1));
          asmKey.push(new Uint8Array(key.exponent2));
          asmKey.push(new Uint8Array(key.coefficient));
        }

        return asmKey;
      }

    }

    RsaCrypto.RsaSsa = "RSASSA-PKCS1-v1_5";
    RsaCrypto.RsaPss = "RSA-PSS";
    RsaCrypto.RsaOaep = "RSA-OAEP";
    RsaCrypto.privateUsages = ["sign", "decrypt", "unwrapKey"];
    RsaCrypto.publicUsages = ["verify", "encrypt", "wrapKey"];
    return RsaCrypto;
  })();

  class ShaCrypto {
    static getDigest(name) {
      switch (name) {
        case "SHA-1":
          return new asmcrypto_js.Sha1();

        case "SHA-256":
          return new asmcrypto_js.Sha256();

        case "SHA-512":
          return new asmcrypto_js.Sha512();

        default:
          throw new AlgorithmError("keyAlgorithm.hash: Is not recognized");
      }
    }

    static digest(algorithm, data) {
      return __awaiter(this, void 0, void 0, function* () {
        const mech = this.getDigest(algorithm.name);
        const result = mech.process(BufferSourceConverter.toUint8Array(data)).finish().result;
        return BufferSourceConverter.toArrayBuffer(result);
      });
    }

  }

  class RsaOaepProvider$1 extends RsaOaepProvider {
    onGenerateKey(algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return RsaCrypto.generateKey(algorithm, extractable, keyUsages);
      });
    }

    onExportKey(format, key) {
      return __awaiter(this, void 0, void 0, function* () {
        return RsaCrypto.exportKey(format, key);
      });
    }

    onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return RsaCrypto.importKey(format, keyData, algorithm, extractable, keyUsages);
      });
    }

    onEncrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return this.cipher(algorithm, key, data);
      });
    }

    onDecrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return this.cipher(algorithm, key, data);
      });
    }

    checkCryptoKey(key, keyUsage) {
      super.checkCryptoKey(key, keyUsage);
      RsaCrypto.checkCryptoKey(key);
    }

    cipher(algorithm, key, data) {
      const digest = ShaCrypto.getDigest(key.algorithm.hash.name);
      let label;

      if (algorithm.label) {
        label = BufferSourceConverter.toUint8Array(algorithm.label);
      }

      const cipher = new asmcrypto_js.RSA_OAEP(key.data, digest, label);
      let res;
      const u8Data = BufferSourceConverter.toUint8Array(data);

      if (key.type === "public") {
        res = cipher.encrypt(u8Data);
      } else {
        res = cipher.decrypt(u8Data);
      }

      return BufferSourceConverter.toArrayBuffer(res);
    }

  }

  class RsaPssProvider$1 extends RsaPssProvider {
    onGenerateKey(algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return RsaCrypto.generateKey(algorithm, extractable, keyUsages);
      });
    }

    onExportKey(format, key) {
      return __awaiter(this, void 0, void 0, function* () {
        return RsaCrypto.exportKey(format, key);
      });
    }

    onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return RsaCrypto.importKey(format, keyData, algorithm, extractable, keyUsages);
      });
    }

    onSign(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        const rsa = new asmcrypto_js.RSA_PSS(key.data, ShaCrypto.getDigest(key.algorithm.hash.name), algorithm.saltLength);
        const result = rsa.sign(BufferSourceConverter.toUint8Array(data));
        return BufferSourceConverter.toArrayBuffer(result);
      });
    }

    onVerify(algorithm, key, signature, data) {
      return __awaiter(this, void 0, void 0, function* () {
        const rsa = new asmcrypto_js.RSA_PSS(key.data, ShaCrypto.getDigest(key.algorithm.hash.name), algorithm.saltLength);

        try {
          rsa.verify(BufferSourceConverter.toUint8Array(signature), BufferSourceConverter.toUint8Array(data));
        } catch (_a) {
          return false;
        }

        return true;
      });
    }

    checkCryptoKey(key, keyUsage) {
      super.checkCryptoKey(key, keyUsage);
      RsaCrypto.checkCryptoKey(key);
    }

  }

  class RsaSsaProvider$1 extends RsaSsaProvider {
    onGenerateKey(algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return RsaCrypto.generateKey(algorithm, extractable, keyUsages);
      });
    }

    onExportKey(format, key) {
      return __awaiter(this, void 0, void 0, function* () {
        return RsaCrypto.exportKey(format, key);
      });
    }

    onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return RsaCrypto.importKey(format, keyData, algorithm, extractable, keyUsages);
      });
    }

    onSign(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        const rsa = new asmcrypto_js.RSA_PKCS1_v1_5(key.data, ShaCrypto.getDigest(key.algorithm.hash.name));
        const result = rsa.sign(BufferSourceConverter.toUint8Array(data));
        return BufferSourceConverter.toArrayBuffer(result);
      });
    }

    onVerify(algorithm, key, signature, data) {
      return __awaiter(this, void 0, void 0, function* () {
        const rsa = new asmcrypto_js.RSA_PKCS1_v1_5(key.data, ShaCrypto.getDigest(key.algorithm.hash.name));

        try {
          rsa.verify(BufferSourceConverter.toUint8Array(signature), BufferSourceConverter.toUint8Array(data));
        } catch (_a) {
          return false;
        }

        return true;
      });
    }

    checkCryptoKey(key, keyUsage) {
      super.checkCryptoKey(key, keyUsage);
      RsaCrypto.checkCryptoKey(key);
    }

  }

  class RsaEsProvider extends ProviderCrypto {
    constructor() {
      super(...arguments);
      this.name = "RSAES-PKCS1-v1_5";
      this.usages = {
        publicKey: ["encrypt", "wrapKey"],
        privateKey: ["decrypt", "unwrapKey"]
      };
      this.hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
    }

    onGenerateKey(algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return RsaCrypto.generateKey(algorithm, extractable, keyUsages);
      });
    }

    checkGenerateKeyParams(algorithm) {
      this.checkRequiredProperty(algorithm, "publicExponent");

      if (!(algorithm.publicExponent && algorithm.publicExponent instanceof Uint8Array)) {
        throw new TypeError("publicExponent: Missing or not a Uint8Array");
      }

      const publicExponent = Convert.ToBase64(algorithm.publicExponent);

      if (!(publicExponent === "Aw==" || publicExponent === "AQAB")) {
        throw new TypeError("publicExponent: Must be [3] or [1,0,1]");
      }

      this.checkRequiredProperty(algorithm, "modulusLength");

      switch (algorithm.modulusLength) {
        case 1024:
        case 2048:
        case 4096:
          break;

        default:
          throw new TypeError("modulusLength: Must be 1024, 2048, or 4096");
      }
    }

    onDecrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        const EM = new asmcrypto_js.RSA(key.data).decrypt(new asmcrypto_js.BigNumber(BufferSourceConverter.toUint8Array(data))).result;
        const k = key.algorithm.modulusLength >> 3;

        if (data.byteLength !== k) {
          throw new CryptoError("Decryption error. Encrypted message size doesn't match to key length");
        }

        let offset = 0;

        if (EM[offset++] || EM[offset++] !== 2) {
          throw new CryptoError("Decryption error");
        }

        do {
          if (EM[offset++] === 0) {
            break;
          }
        } while (offset < EM.length);

        if (offset < 11) {
          throw new CryptoError("Decryption error. PS is less than 8 octets.");
        }

        if (offset === EM.length) {
          throw new CryptoError("Decryption error. There is no octet with hexadecimal value 0x00 to separate PS from M");
        }

        return EM.buffer.slice(offset);
      });
    }

    onEncrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        const k = key.algorithm.modulusLength >> 3;

        if (data.byteLength > k - 11) {
          throw new CryptoError("Message too long");
        }

        const psLen = k - data.byteLength - 3;
        const PS = RsaCrypto.randomNonZeroValues(new Uint8Array(psLen));
        const EM = new Uint8Array(k);
        EM[0] = 0;
        EM[1] = 2;
        EM.set(PS, 2);
        EM[2 + psLen] = 0;
        EM.set(new Uint8Array(data), 3 + psLen);
        const result = new asmcrypto_js.RSA(key.data).encrypt(new asmcrypto_js.BigNumber(EM)).result;
        return BufferSourceConverter.toArrayBuffer(result);
      });
    }

    onExportKey(format, key) {
      return __awaiter(this, void 0, void 0, function* () {
        return RsaCrypto.exportKey(format, key);
      });
    }

    onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        const key = yield RsaCrypto.importKey(format, keyData, Object.assign(Object.assign({}, algorithm), {
          name: this.name
        }), extractable, keyUsages);
        return key;
      });
    }

    checkCryptoKey(key, keyUsage) {
      super.checkCryptoKey(key, keyUsage);
      RsaCrypto.checkCryptoKey(key);
    }

    prepareSignData(algorithm, data) {
      return __awaiter(this, void 0, void 0, function* () {
        const crypto = new Crypto$1();
        return crypto.subtle.digest(algorithm.hash, data);
      });
    }

  }

  const namedOIDs = {
    "1.2.840.10045.3.1.7": "P-256",
    "P-256": "1.2.840.10045.3.1.7",
    "1.3.132.0.34": "P-384",
    "P-384": "1.3.132.0.34",
    "1.3.132.0.35": "P-521",
    "P-521": "1.3.132.0.35",
    "1.3.132.0.10": "K-256",
    "K-256": "1.3.132.0.10"
  };

  function getOidByNamedCurve(namedCurve) {
    const oid = namedOIDs[namedCurve];

    if (!oid) {
      throw new OperationError(`Cannot convert WebCrypto named curve '${namedCurve}' to OID`);
    }

    return oid;
  }

  class EcCryptoKey extends CryptoKey$1 {
    constructor(algorithm, extractable, type, usages, data) {
      super(algorithm, extractable, type, usages);
      this.data = data;
    }

  }

  let EcCrypto = (() => {
    class EcCrypto {
      static checkLib() {
        if (typeof elliptic === "undefined") {
          throw new OperationError("Cannot implement EC mechanism. Add 'https://peculiarventures.github.io/pv-webcrypto-tests/src/elliptic.js' script to your project");
        }
      }

      static generateKey(algorithm, extractable, keyUsages) {
        return __awaiter(this, void 0, void 0, function* () {
          this.checkLib();
          const key = this.initEcKey(algorithm.namedCurve);
          const ecKey = key.genKeyPair();
          ecKey.getPublic();
          const prvKey = new EcCryptoKey(Object.assign({}, algorithm), extractable, "private", keyUsages.filter(usage => ~this.privateUsages.indexOf(usage)), ecKey);
          const pubKey = new EcCryptoKey(Object.assign({}, algorithm), true, "public", keyUsages.filter(usage => ~this.publicUsages.indexOf(usage)), ecKey);
          return {
            privateKey: prvKey,
            publicKey: pubKey
          };
        });
      }

      static checkCryptoKey(key) {
        if (!(key instanceof EcCryptoKey)) {
          throw new TypeError("key: Is not EcCryptoKey");
        }
      }

      static concat(...buf) {
        const res = new Uint8Array(buf.map(item => item.length).reduce((prev, cur) => prev + cur));
        let offset = 0;
        buf.forEach((item, index) => {
          for (let i = 0; i < item.length; i++) {
            res[offset + i] = item[i];
          }

          offset += item.length;
        });
        return res;
      }

      static exportKey(format, key) {
        return __awaiter(this, void 0, void 0, function* () {
          this.checkLib();

          switch (format) {
            case "pkcs8":
              return this.exportPkcs8Key(key);

            case "spki":
              return this.exportSpkiKey(key);

            case "jwk":
              return this.exportJwkKey(key);

            case "raw":
              return new Uint8Array(key.data.getPublic("der")).buffer;

            default:
              throw new OperationError("format: Must be 'jwk', 'raw, 'pkcs8' or 'spki'");
          }
        });
      }

      static importKey(format, keyData, algorithm, extractable, keyUsages) {
        return __awaiter(this, void 0, void 0, function* () {
          this.checkLib();
          let ecKey;

          switch (format) {
            case "pkcs8":
              ecKey = this.importPkcs8Key(keyData, algorithm.namedCurve);
              break;

            case "spki":
              ecKey = this.importSpkiKey(keyData, algorithm.namedCurve);
              break;

            case "raw":
              ecKey = this.importEcKey(new EcPublicKey$1(keyData), algorithm.namedCurve);
              break;

            case "jwk":
              ecKey = this.importJwkKey(keyData);
              break;

            default:
              throw new OperationError("format: Must be 'jwk', 'raw', 'pkcs8' or 'spki'");
          }

          const key = new EcCryptoKey(Object.assign({}, algorithm), extractable, ecKey.priv ? "private" : "public", keyUsages, ecKey);
          return key;
        });
      }

      static getNamedCurve(wcNamedCurve) {
        const crv = wcNamedCurve.toUpperCase();
        let res = "";

        if (["P-256", "P-384", "P-521"].indexOf(crv) > -1) {
          res = crv.replace("-", "").toLowerCase();
        } else if (crv === "K-256") {
          res = "secp256k1";
        } else {
          throw new OperationError(`Unsupported named curve '${wcNamedCurve}'`);
        }

        return res;
      }

      static initEcKey(namedCurve) {
        return elliptic.ec(this.getNamedCurve(namedCurve));
      }

      static exportPkcs8Key(key) {
        const keyInfo = new PrivateKeyInfo$1();
        keyInfo.privateKeyAlgorithm.algorithm = this.ASN_ALGORITHM;
        keyInfo.privateKeyAlgorithm.parameters = AsnSerializer.serialize(new ObjectIdentifier$1(getOidByNamedCurve(key.algorithm.namedCurve)));
        keyInfo.privateKey = AsnSerializer.serialize(this.exportEcKey(key));
        return AsnSerializer.serialize(keyInfo);
      }

      static importPkcs8Key(data, namedCurve) {
        const keyInfo = AsnParser.parse(data, PrivateKeyInfo$1);
        const privateKey = AsnParser.parse(keyInfo.privateKey, EcPrivateKey$1);
        return this.importEcKey(privateKey, namedCurve);
      }

      static importSpkiKey(data, namedCurve) {
        const keyInfo = AsnParser.parse(data, PublicKeyInfo$1);
        const publicKey = new EcPublicKey$1(keyInfo.publicKey);
        return this.importEcKey(publicKey, namedCurve);
      }

      static exportSpkiKey(key) {
        const publicKey = new EcPublicKey$1(new Uint8Array(key.data.getPublic("der")).buffer);
        const keyInfo = new PublicKeyInfo$1();
        keyInfo.publicKeyAlgorithm.algorithm = this.ASN_ALGORITHM;
        keyInfo.publicKeyAlgorithm.parameters = AsnSerializer.serialize(new ObjectIdentifier$1(getOidByNamedCurve(key.algorithm.namedCurve)));
        keyInfo.publicKey = publicKey.value;
        return AsnSerializer.serialize(keyInfo);
      }

      static importJwkKey(data) {
        let key;

        if (data.d) {
          key = JsonParser.fromJSON(data, {
            targetSchema: EcPrivateKey$1
          });
        } else {
          key = JsonParser.fromJSON(data, {
            targetSchema: EcPublicKey$1
          });
        }

        return this.importEcKey(key, data.crv);
      }

      static exportJwkKey(key) {
        const asnKey = this.exportEcKey(key);
        const jwk = JsonSerializer.toJSON(asnKey);
        jwk.ext = true;
        jwk.key_ops = key.usages;
        jwk.crv = key.algorithm.namedCurve;
        jwk.kty = "EC";
        return jwk;
      }

      static exportEcKey(ecKey) {
        if (ecKey.type === "private") {
          const privateKey = new EcPrivateKey$1();
          const point = new Uint8Array(ecKey.data.getPrivate("der").toArray());
          const pointPad = new Uint8Array(this.getPointSize(ecKey.algorithm.namedCurve) - point.length);
          privateKey.privateKey = concat(pointPad, point);
          privateKey.publicKey = new Uint8Array(ecKey.data.getPublic("der"));
          return privateKey;
        } else if (ecKey.data.pub) {
          return new EcPublicKey$1(new Uint8Array(ecKey.data.getPublic("der")).buffer);
        } else {
          throw new Error("Cannot get private or public key");
        }
      }

      static importEcKey(key, namedCurve) {
        const ecKey = this.initEcKey(namedCurve);

        if (key instanceof EcPublicKey$1) {
          return ecKey.keyFromPublic(new Uint8Array(key.value));
        }

        return ecKey.keyFromPrivate(new Uint8Array(key.privateKey));
      }

      static getPointSize(namedCurve) {
        switch (namedCurve) {
          case "P-256":
          case "K-256":
            return 32;

          case "P-384":
            return 48;

          case "P-521":
            return 66;
        }

        throw new Error("namedCurve: Is not recognized");
      }

    }

    EcCrypto.privateUsages = ["sign", "deriveKey", "deriveBits"];
    EcCrypto.publicUsages = ["verify"];
    EcCrypto.ASN_ALGORITHM = "1.2.840.10045.2.1";
    return EcCrypto;
  })();

  class EcdhProvider$1 extends EcdhProvider {
    onGenerateKey(algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return EcCrypto.generateKey(algorithm, extractable, keyUsages);
      });
    }

    onExportKey(format, key) {
      return __awaiter(this, void 0, void 0, function* () {
        return EcCrypto.exportKey(format, key);
      });
    }

    onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return EcCrypto.importKey(format, keyData, algorithm, extractable, keyUsages);
      });
    }

    onDeriveBits(algorithm, baseKey, length) {
      return __awaiter(this, void 0, void 0, function* () {
        EcCrypto.checkLib();
        const shared = baseKey.data.derive(algorithm.public.data.getPublic());
        let array = new Uint8Array(shared.toArray());
        let len = array.length;
        len = len > 32 ? len > 48 ? 66 : 48 : 32;

        if (array.length < len) {
          array = EcCrypto.concat(new Uint8Array(len - array.length), array);
        }

        const buf = array.slice(0, length / 8).buffer;
        return buf;
      });
    }

    checkCryptoKey(key, keyUsage) {
      super.checkCryptoKey(key, keyUsage);
      EcCrypto.checkCryptoKey(key);
    }

  }

  function b2a(buffer) {
    const buf = new Uint8Array(buffer);
    const res = [];

    for (let i = 0; i < buf.length; i++) {
      res.push(buf[i]);
    }

    return res;
  }

  function hex2buffer(hexString, padded) {
    if (hexString.length % 2) {
      hexString = "0" + hexString;
    }

    let res = new Uint8Array(hexString.length / 2);

    for (let i = 0; i < hexString.length; i++) {
      const c = hexString.slice(i, ++i + 1);
      res[(i - 1) / 2] = parseInt(c, 16);
    }

    if (padded) {
      let len = res.length;
      len = len > 32 ? len > 48 ? 66 : 48 : 32;

      if (res.length < len) {
        res = EcCrypto.concat(new Uint8Array(len - res.length), res);
      }
    }

    return res;
  }

  function buffer2hex(buffer, padded) {
    let res = "";

    for (let i = 0; i < buffer.length; i++) {
      const char = buffer[i].toString(16);
      res += char.length % 2 ? "0" + char : char;
    }

    if (padded) {
      let len = buffer.length;
      len = len > 32 ? len > 48 ? 66 : 48 : 32;

      if (res.length / 2 < len) {
        res = new Array(len * 2 - res.length + 1).join("0") + res;
      }
    }

    return res;
  }

  class EcdsaProvider$1 extends EcdsaProvider {
    onGenerateKey(algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return EcCrypto.generateKey(algorithm, extractable, keyUsages);
      });
    }

    onExportKey(format, key) {
      return __awaiter(this, void 0, void 0, function* () {
        return EcCrypto.exportKey(format, key);
      });
    }

    onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return EcCrypto.importKey(format, keyData, algorithm, extractable, keyUsages);
      });
    }

    onSign(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        EcCrypto.checkLib();
        const crypto = new Crypto$1();
        let array;
        const hash = yield crypto.subtle.digest(algorithm.hash, data);
        array = b2a(hash);
        const signature = yield key.data.sign(array);
        const hexSignature = buffer2hex(signature.r.toArray(), true) + buffer2hex(signature.s.toArray(), true);
        return hex2buffer(hexSignature).buffer;
      });
    }

    onVerify(algorithm, key, signature, data) {
      return __awaiter(this, void 0, void 0, function* () {
        EcCrypto.checkLib();
        const crypto = new Crypto$1();
        const sig = {
          r: new Uint8Array(signature.slice(0, signature.byteLength / 2)),
          s: new Uint8Array(signature.slice(signature.byteLength / 2))
        };
        const hashedData = yield crypto.subtle.digest(algorithm.hash, data);
        const array = b2a(hashedData);
        return key.data.verify(array, sig);
      });
    }

    checkCryptoKey(key, keyUsage) {
      super.checkCryptoKey(key, keyUsage);
      EcCrypto.checkCryptoKey(key);
    }

  }

  class Sha1Provider extends ProviderCrypto {
    constructor() {
      super(...arguments);
      this.name = "SHA-1";
      this.usages = [];
    }

    onDigest(algorithm, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return ShaCrypto.digest(algorithm, data);
      });
    }

  }

  class Sha256Provider extends Sha1Provider {
    constructor() {
      super(...arguments);
      this.name = "SHA-256";
    }

  }

  class Sha512Provider extends Sha1Provider {
    constructor() {
      super(...arguments);
      this.name = "SHA-512";
    }

  }

  class PbkdfCryptoKey extends CryptoKey$1 {
    constructor(algorithm, extractable, usages, raw) {
      super(algorithm, extractable, "secret", usages);
      this.raw = raw;
    }

  }

  class Pbkdf2Provider$1 extends Pbkdf2Provider {
    onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return new PbkdfCryptoKey(algorithm, extractable, keyUsages, BufferSourceConverter.toUint8Array(keyData));
      });
    }

    onDeriveBits(algorithm, baseKey, length) {
      return __awaiter(this, void 0, void 0, function* () {
        let result;
        const salt = BufferSourceConverter.toUint8Array(algorithm.salt);
        const password = baseKey.raw;

        switch (algorithm.hash.name.toUpperCase()) {
          case "SHA-1":
            result = asmcrypto_js.Pbkdf2HmacSha1(password, salt, algorithm.iterations, length >> 3);
            break;

          case "SHA-256":
            result = asmcrypto_js.Pbkdf2HmacSha256(password, salt, algorithm.iterations, length >> 3);
            break;

          case "SHA-512":
            result = asmcrypto_js.Pbkdf2HmacSha512(password, salt, algorithm.iterations, length >> 3);
            break;

          default:
            throw new OperationError(`algorithm.hash: '${algorithm.hash.name}' hash algorithm is not supported`);
        }

        return BufferSourceConverter.toArrayBuffer(result);
      });
    }

    checkCryptoKey(key, keyUsage) {
      super.checkCryptoKey(key, keyUsage);

      if (!(key instanceof PbkdfCryptoKey)) {
        throw new TypeError("key: Is not PbkdfCryptoKey");
      }
    }

  }

  var readUInt32BE = function readUInt32BE(bytes, off) {
    var res = bytes[0 + off] << 24 | bytes[1 + off] << 16 | bytes[2 + off] << 8 | bytes[3 + off];
    return res >>> 0;
  };

  var writeUInt32BE = function writeUInt32BE(bytes, value, off) {
    bytes[0 + off] = value >>> 24;
    bytes[1 + off] = value >>> 16 & 0xff;
    bytes[2 + off] = value >>> 8 & 0xff;
    bytes[3 + off] = value & 0xff;
  };

  var ip = function ip(inL, inR, out, off) {
    var outL = 0;
    var outR = 0;

    for (var i = 6; i >= 0; i -= 2) {
      for (var j = 0; j <= 24; j += 8) {
        outL <<= 1;
        outL |= inR >>> j + i & 1;
      }

      for (var j = 0; j <= 24; j += 8) {
        outL <<= 1;
        outL |= inL >>> j + i & 1;
      }
    }

    for (var i = 6; i >= 0; i -= 2) {
      for (var j = 1; j <= 25; j += 8) {
        outR <<= 1;
        outR |= inR >>> j + i & 1;
      }

      for (var j = 1; j <= 25; j += 8) {
        outR <<= 1;
        outR |= inL >>> j + i & 1;
      }
    }

    out[off + 0] = outL >>> 0;
    out[off + 1] = outR >>> 0;
  };

  var rip = function rip(inL, inR, out, off) {
    var outL = 0;
    var outR = 0;

    for (var i = 0; i < 4; i++) {
      for (var j = 24; j >= 0; j -= 8) {
        outL <<= 1;
        outL |= inR >>> j + i & 1;
        outL <<= 1;
        outL |= inL >>> j + i & 1;
      }
    }

    for (var i = 4; i < 8; i++) {
      for (var j = 24; j >= 0; j -= 8) {
        outR <<= 1;
        outR |= inR >>> j + i & 1;
        outR <<= 1;
        outR |= inL >>> j + i & 1;
      }
    }

    out[off + 0] = outL >>> 0;
    out[off + 1] = outR >>> 0;
  };

  var pc1 = function pc1(inL, inR, out, off) {
    var outL = 0;
    var outR = 0;

    for (var i = 7; i >= 5; i--) {
      for (var j = 0; j <= 24; j += 8) {
        outL <<= 1;
        outL |= inR >> j + i & 1;
      }

      for (var j = 0; j <= 24; j += 8) {
        outL <<= 1;
        outL |= inL >> j + i & 1;
      }
    }

    for (var j = 0; j <= 24; j += 8) {
      outL <<= 1;
      outL |= inR >> j + i & 1;
    }

    for (var i = 1; i <= 3; i++) {
      for (var j = 0; j <= 24; j += 8) {
        outR <<= 1;
        outR |= inR >> j + i & 1;
      }

      for (var j = 0; j <= 24; j += 8) {
        outR <<= 1;
        outR |= inL >> j + i & 1;
      }
    }

    for (var j = 0; j <= 24; j += 8) {
      outR <<= 1;
      outR |= inL >> j + i & 1;
    }

    out[off + 0] = outL >>> 0;
    out[off + 1] = outR >>> 0;
  };

  var r28shl = function r28shl(num, shift) {
    return num << shift & 0xfffffff | num >>> 28 - shift;
  };

  var pc2table = [14, 11, 17, 4, 27, 23, 25, 0, 13, 22, 7, 18, 5, 9, 16, 24, 2, 20, 12, 21, 1, 8, 15, 26, 15, 4, 25, 19, 9, 1, 26, 16, 5, 11, 23, 8, 12, 7, 17, 0, 22, 3, 10, 14, 6, 20, 27, 24];

  var pc2 = function pc2(inL, inR, out, off) {
    var outL = 0;
    var outR = 0;
    var len = pc2table.length >>> 1;

    for (var i = 0; i < len; i++) {
      outL <<= 1;
      outL |= inL >>> pc2table[i] & 0x1;
    }

    for (var i = len; i < pc2table.length; i++) {
      outR <<= 1;
      outR |= inR >>> pc2table[i] & 0x1;
    }

    out[off + 0] = outL >>> 0;
    out[off + 1] = outR >>> 0;
  };

  var expand = function expand(r, out, off) {
    var outL = 0;
    var outR = 0;
    outL = (r & 1) << 5 | r >>> 27;

    for (var i = 23; i >= 15; i -= 4) {
      outL <<= 6;
      outL |= r >>> i & 0x3f;
    }

    for (var i = 11; i >= 3; i -= 4) {
      outR |= r >>> i & 0x3f;
      outR <<= 6;
    }

    outR |= (r & 0x1f) << 1 | r >>> 31;
    out[off + 0] = outL >>> 0;
    out[off + 1] = outR >>> 0;
  };

  var sTable = [14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1, 3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8, 4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7, 15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13, 15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14, 9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5, 0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2, 5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9, 10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10, 1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1, 13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7, 11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12, 7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3, 1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9, 10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8, 15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14, 2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1, 8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6, 4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13, 15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3, 12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5, 0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8, 9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10, 7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13, 4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10, 3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6, 1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7, 10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12, 13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4, 10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2, 7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13, 0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11];

  var substitute = function substitute(inL, inR) {
    var out = 0;

    for (var i = 0; i < 4; i++) {
      var b = inL >>> 18 - i * 6 & 0x3f;
      var sb = sTable[i * 0x40 + b];
      out <<= 4;
      out |= sb;
    }

    for (var i = 0; i < 4; i++) {
      var b = inR >>> 18 - i * 6 & 0x3f;
      var sb = sTable[4 * 0x40 + i * 0x40 + b];
      out <<= 4;
      out |= sb;
    }

    return out >>> 0;
  };

  var permuteTable = [16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22, 30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7];

  var permute = function permute(num) {
    var out = 0;

    for (var i = 0; i < permuteTable.length; i++) {
      out <<= 1;
      out |= num >>> permuteTable[i] & 0x1;
    }

    return out >>> 0;
  };

  var padSplit = function padSplit(num, size, group) {
    var str = num.toString(2);

    while (str.length < size) str = '0' + str;

    var out = [];

    for (var i = 0; i < size; i += group) out.push(str.slice(i, i + group));

    return out.join(' ');
  };

  var utils$1 = {
    readUInt32BE: readUInt32BE,
    writeUInt32BE: writeUInt32BE,
    ip: ip,
    rip: rip,
    pc1: pc1,
    r28shl: r28shl,
    pc2: pc2,
    expand: expand,
    substitute: substitute,
    permute: permute,
    padSplit: padSplit
  };
  var minimalisticAssert = assert;

  function assert(val, msg) {
    if (!val) throw new Error(msg || 'Assertion failed');
  }

  assert.equal = function assertEqual(l, r, msg) {
    if (l != r) throw new Error(msg || 'Assertion failed: ' + l + ' != ' + r);
  };

  function Cipher(options) {
    this.options = options;
    this.type = this.options.type;
    this.blockSize = 8;

    this._init();

    this.buffer = new Array(this.blockSize);
    this.bufferOff = 0;
  }

  var cipher = Cipher;

  Cipher.prototype._init = function _init() {};

  Cipher.prototype.update = function update(data) {
    if (data.length === 0) return [];
    if (this.type === 'decrypt') return this._updateDecrypt(data);else return this._updateEncrypt(data);
  };

  Cipher.prototype._buffer = function _buffer(data, off) {
    var min = Math.min(this.buffer.length - this.bufferOff, data.length - off);

    for (var i = 0; i < min; i++) this.buffer[this.bufferOff + i] = data[off + i];

    this.bufferOff += min;
    return min;
  };

  Cipher.prototype._flushBuffer = function _flushBuffer(out, off) {
    this._update(this.buffer, 0, out, off);

    this.bufferOff = 0;
    return this.blockSize;
  };

  Cipher.prototype._updateEncrypt = function _updateEncrypt(data) {
    var inputOff = 0;
    var outputOff = 0;
    var count = (this.bufferOff + data.length) / this.blockSize | 0;
    var out = new Array(count * this.blockSize);

    if (this.bufferOff !== 0) {
      inputOff += this._buffer(data, inputOff);
      if (this.bufferOff === this.buffer.length) outputOff += this._flushBuffer(out, outputOff);
    }

    var max = data.length - (data.length - inputOff) % this.blockSize;

    for (; inputOff < max; inputOff += this.blockSize) {
      this._update(data, inputOff, out, outputOff);

      outputOff += this.blockSize;
    }

    for (; inputOff < data.length; inputOff++, this.bufferOff++) this.buffer[this.bufferOff] = data[inputOff];

    return out;
  };

  Cipher.prototype._updateDecrypt = function _updateDecrypt(data) {
    var inputOff = 0;
    var outputOff = 0;
    var count = Math.ceil((this.bufferOff + data.length) / this.blockSize) - 1;
    var out = new Array(count * this.blockSize);

    for (; count > 0; count--) {
      inputOff += this._buffer(data, inputOff);
      outputOff += this._flushBuffer(out, outputOff);
    }

    inputOff += this._buffer(data, inputOff);
    return out;
  };

  Cipher.prototype.final = function final(buffer) {
    var first;
    if (buffer) first = this.update(buffer);
    var last;
    if (this.type === 'encrypt') last = this._finalEncrypt();else last = this._finalDecrypt();
    if (first) return first.concat(last);else return last;
  };

  Cipher.prototype._pad = function _pad(buffer, off) {
    if (off === 0) return false;

    while (off < buffer.length) buffer[off++] = 0;

    return true;
  };

  Cipher.prototype._finalEncrypt = function _finalEncrypt() {
    if (!this._pad(this.buffer, this.bufferOff)) return [];
    var out = new Array(this.blockSize);

    this._update(this.buffer, 0, out, 0);

    return out;
  };

  Cipher.prototype._unpad = function _unpad(buffer) {
    return buffer;
  };

  Cipher.prototype._finalDecrypt = function _finalDecrypt() {
    minimalisticAssert.equal(this.bufferOff, this.blockSize, 'Not enough data to decrypt');
    var out = new Array(this.blockSize);

    this._flushBuffer(out, 0);

    return this._unpad(out);
  };

  var inherits;

  if (typeof Object.create === 'function') {
    inherits = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    };
  } else {
    inherits = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;

      var TempCtor = function () {};

      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    };
  }

  var inherits$1 = inherits;
  var formatRegExp = /%[sdj%]/g;

  function format(f) {
    if (!isString(f)) {
      var objects = [];

      for (var i = 0; i < arguments.length; i++) {
        objects.push(inspect(arguments[i]));
      }

      return objects.join(' ');
    }

    var i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(formatRegExp, function (x) {
      if (x === '%%') return '%';
      if (i >= len) return x;

      switch (x) {
        case '%s':
          return String(args[i++]);

        case '%d':
          return Number(args[i++]);

        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return '[Circular]';
          }

        default:
          return x;
      }
    });

    for (var x = args[i]; i < len; x = args[++i]) {
      if (isNull(x) || !isObject(x)) {
        str += ' ' + x;
      } else {
        str += ' ' + inspect(x);
      }
    }

    return str;
  }

  function deprecate(fn, msg) {
    if (isUndefined(global.process)) {
      return function () {
        return deprecate(fn, msg).apply(this, arguments);
      };
    }

    var warned = false;

    function deprecated() {
      if (!warned) {
        {
          console.error(msg);
        }
        warned = true;
      }

      return fn.apply(this, arguments);
    }

    return deprecated;
  }

  var debugs = {};
  var debugEnviron;

  function debuglog(set) {
    if (isUndefined(debugEnviron)) debugEnviron = '';
    set = set.toUpperCase();

    if (!debugs[set]) {
      if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
        var pid = 0;

        debugs[set] = function () {
          var msg = format.apply(null, arguments);
          console.error('%s %d: %s', set, pid, msg);
        };
      } else {
        debugs[set] = function () {};
      }
    }

    return debugs[set];
  }

  function inspect(obj, opts) {
    var ctx = {
      seen: [],
      stylize: stylizeNoColor
    };
    if (arguments.length >= 3) ctx.depth = arguments[2];
    if (arguments.length >= 4) ctx.colors = arguments[3];

    if (isBoolean(opts)) {
      ctx.showHidden = opts;
    } else if (opts) {
      _extend(ctx, opts);
    }

    if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
    if (isUndefined(ctx.depth)) ctx.depth = 2;
    if (isUndefined(ctx.colors)) ctx.colors = false;
    if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
    if (ctx.colors) ctx.stylize = stylizeWithColor;
    return formatValue(ctx, obj, ctx.depth);
  }

  inspect.colors = {
    'bold': [1, 22],
    'italic': [3, 23],
    'underline': [4, 24],
    'inverse': [7, 27],
    'white': [37, 39],
    'grey': [90, 39],
    'black': [30, 39],
    'blue': [34, 39],
    'cyan': [36, 39],
    'green': [32, 39],
    'magenta': [35, 39],
    'red': [31, 39],
    'yellow': [33, 39]
  };
  inspect.styles = {
    'special': 'cyan',
    'number': 'yellow',
    'boolean': 'yellow',
    'undefined': 'grey',
    'null': 'bold',
    'string': 'green',
    'date': 'magenta',
    'regexp': 'red'
  };

  function stylizeWithColor(str, styleType) {
    var style = inspect.styles[styleType];

    if (style) {
      return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
    } else {
      return str;
    }
  }

  function stylizeNoColor(str, styleType) {
    return str;
  }

  function arrayToHash(array) {
    var hash = {};
    array.forEach(function (val, idx) {
      hash[val] = true;
    });
    return hash;
  }

  function formatValue(ctx, value, recurseTimes) {
    if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== inspect && !(value.constructor && value.constructor.prototype === value)) {
      var ret = value.inspect(recurseTimes, ctx);

      if (!isString(ret)) {
        ret = formatValue(ctx, ret, recurseTimes);
      }

      return ret;
    }

    var primitive = formatPrimitive(ctx, value);

    if (primitive) {
      return primitive;
    }

    var keys = Object.keys(value);
    var visibleKeys = arrayToHash(keys);

    if (ctx.showHidden) {
      keys = Object.getOwnPropertyNames(value);
    }

    if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
      return formatError(value);
    }

    if (keys.length === 0) {
      if (isFunction(value)) {
        var name = value.name ? ': ' + value.name : '';
        return ctx.stylize('[Function' + name + ']', 'special');
      }

      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      }

      if (isDate(value)) {
        return ctx.stylize(Date.prototype.toString.call(value), 'date');
      }

      if (isError(value)) {
        return formatError(value);
      }
    }

    var base = '',
        array = false,
        braces = ['{', '}'];

    if (isArray(value)) {
      array = true;
      braces = ['[', ']'];
    }

    if (isFunction(value)) {
      var n = value.name ? ': ' + value.name : '';
      base = ' [Function' + n + ']';
    }

    if (isRegExp(value)) {
      base = ' ' + RegExp.prototype.toString.call(value);
    }

    if (isDate(value)) {
      base = ' ' + Date.prototype.toUTCString.call(value);
    }

    if (isError(value)) {
      base = ' ' + formatError(value);
    }

    if (keys.length === 0 && (!array || value.length == 0)) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      } else {
        return ctx.stylize('[Object]', 'special');
      }
    }

    ctx.seen.push(value);
    var output;

    if (array) {
      output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
    } else {
      output = keys.map(function (key) {
        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
      });
    }

    ctx.seen.pop();
    return reduceToSingleString(output, base, braces);
  }

  function formatPrimitive(ctx, value) {
    if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

    if (isString(value)) {
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');
    }

    if (isNumber(value)) return ctx.stylize('' + value, 'number');
    if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
    if (isNull(value)) return ctx.stylize('null', 'null');
  }

  function formatError(value) {
    return '[' + Error.prototype.toString.call(value) + ']';
  }

  function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];

    for (var i = 0, l = value.length; i < l; ++i) {
      if (hasOwnProperty(value, String(i))) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
      } else {
        output.push('');
      }
    }

    keys.forEach(function (key) {
      if (!key.match(/^\d+$/)) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
      }
    });
    return output;
  }

  function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
    var name, str, desc;
    desc = Object.getOwnPropertyDescriptor(value, key) || {
      value: value[key]
    };

    if (desc.get) {
      if (desc.set) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else {
      if (desc.set) {
        str = ctx.stylize('[Setter]', 'special');
      }
    }

    if (!hasOwnProperty(visibleKeys, key)) {
      name = '[' + key + ']';
    }

    if (!str) {
      if (ctx.seen.indexOf(desc.value) < 0) {
        if (isNull(recurseTimes)) {
          str = formatValue(ctx, desc.value, null);
        } else {
          str = formatValue(ctx, desc.value, recurseTimes - 1);
        }

        if (str.indexOf('\n') > -1) {
          if (array) {
            str = str.split('\n').map(function (line) {
              return '  ' + line;
            }).join('\n').substr(2);
          } else {
            str = '\n' + str.split('\n').map(function (line) {
              return '   ' + line;
            }).join('\n');
          }
        }
      } else {
        str = ctx.stylize('[Circular]', 'special');
      }
    }

    if (isUndefined(name)) {
      if (array && key.match(/^\d+$/)) {
        return str;
      }

      name = JSON.stringify('' + key);

      if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
        name = name.substr(1, name.length - 2);
        name = ctx.stylize(name, 'name');
      } else {
        name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
        name = ctx.stylize(name, 'string');
      }
    }

    return name + ': ' + str;
  }

  function reduceToSingleString(output, base, braces) {
    var length = output.reduce(function (prev, cur) {
      if (cur.indexOf('\n') >= 0) ;
      return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
    }, 0);

    if (length > 60) {
      return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
    }

    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
  }

  function isArray(ar) {
    return Array.isArray(ar);
  }

  function isBoolean(arg) {
    return typeof arg === 'boolean';
  }

  function isNull(arg) {
    return arg === null;
  }

  function isNullOrUndefined(arg) {
    return arg == null;
  }

  function isNumber(arg) {
    return typeof arg === 'number';
  }

  function isString(arg) {
    return typeof arg === 'string';
  }

  function isSymbol(arg) {
    return typeof arg === 'symbol';
  }

  function isUndefined(arg) {
    return arg === void 0;
  }

  function isRegExp(re) {
    return isObject(re) && objectToString(re) === '[object RegExp]';
  }

  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }

  function isDate(d) {
    return isObject(d) && objectToString(d) === '[object Date]';
  }

  function isError(e) {
    return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
  }

  function isFunction(arg) {
    return typeof arg === 'function';
  }

  function isPrimitive(arg) {
    return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || typeof arg === 'undefined';
  }

  function isBuffer(maybeBuf) {
    return Buffer.isBuffer(maybeBuf);
  }

  function objectToString(o) {
    return Object.prototype.toString.call(o);
  }

  function pad(n) {
    return n < 10 ? '0' + n.toString(10) : n.toString(10);
  }

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function timestamp() {
    var d = new Date();
    var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
    return [d.getDate(), months[d.getMonth()], time].join(' ');
  }

  function log() {
    console.log('%s - %s', timestamp(), format.apply(null, arguments));
  }

  function _extend(origin, add) {
    if (!add || !isObject(add)) return origin;
    var keys = Object.keys(add);
    var i = keys.length;

    while (i--) {
      origin[keys[i]] = add[keys[i]];
    }

    return origin;
  }

  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  var require$$0 = {
    inherits: inherits$1,
    _extend: _extend,
    log: log,
    isBuffer: isBuffer,
    isPrimitive: isPrimitive,
    isFunction: isFunction,
    isError: isError,
    isDate: isDate,
    isObject: isObject,
    isRegExp: isRegExp,
    isUndefined: isUndefined,
    isSymbol: isSymbol,
    isString: isString,
    isNumber: isNumber,
    isNullOrUndefined: isNullOrUndefined,
    isNull: isNull,
    isBoolean: isBoolean,
    isArray: isArray,
    inspect: inspect,
    deprecate: deprecate,
    format: format,
    debuglog: debuglog
  };
  var inherits_browser = createCommonjsModule(function (module) {
    if (typeof Object.create === 'function') {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;

          var TempCtor = function () {};

          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  });
  var inherits$2 = createCommonjsModule(function (module) {
    try {
      var util = require$$0;
      if (typeof util.inherits !== 'function') throw '';
      module.exports = util.inherits;
    } catch (e) {
      module.exports = inherits_browser;
    }
  });

  function DESState() {
    this.tmp = new Array(2);
    this.keys = null;
  }

  function DES(options) {
    cipher.call(this, options);
    var state = new DESState();
    this._desState = state;
    this.deriveKeys(state, options.key);
  }

  inherits$2(DES, cipher);
  var des = DES;

  DES.create = function create(options) {
    return new DES(options);
  };

  var shiftTable = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

  DES.prototype.deriveKeys = function deriveKeys(state, key) {
    state.keys = new Array(16 * 2);
    minimalisticAssert.equal(key.length, this.blockSize, 'Invalid key length');
    var kL = utils$1.readUInt32BE(key, 0);
    var kR = utils$1.readUInt32BE(key, 4);
    utils$1.pc1(kL, kR, state.tmp, 0);
    kL = state.tmp[0];
    kR = state.tmp[1];

    for (var i = 0; i < state.keys.length; i += 2) {
      var shift = shiftTable[i >>> 1];
      kL = utils$1.r28shl(kL, shift);
      kR = utils$1.r28shl(kR, shift);
      utils$1.pc2(kL, kR, state.keys, i);
    }
  };

  DES.prototype._update = function _update(inp, inOff, out, outOff) {
    var state = this._desState;
    var l = utils$1.readUInt32BE(inp, inOff);
    var r = utils$1.readUInt32BE(inp, inOff + 4);
    utils$1.ip(l, r, state.tmp, 0);
    l = state.tmp[0];
    r = state.tmp[1];
    if (this.type === 'encrypt') this._encrypt(state, l, r, state.tmp, 0);else this._decrypt(state, l, r, state.tmp, 0);
    l = state.tmp[0];
    r = state.tmp[1];
    utils$1.writeUInt32BE(out, l, outOff);
    utils$1.writeUInt32BE(out, r, outOff + 4);
  };

  DES.prototype._pad = function _pad(buffer, off) {
    var value = buffer.length - off;

    for (var i = off; i < buffer.length; i++) buffer[i] = value;

    return true;
  };

  DES.prototype._unpad = function _unpad(buffer) {
    var pad = buffer[buffer.length - 1];

    for (var i = buffer.length - pad; i < buffer.length; i++) minimalisticAssert.equal(buffer[i], pad);

    return buffer.slice(0, buffer.length - pad);
  };

  DES.prototype._encrypt = function _encrypt(state, lStart, rStart, out, off) {
    var l = lStart;
    var r = rStart;

    for (var i = 0; i < state.keys.length; i += 2) {
      var keyL = state.keys[i];
      var keyR = state.keys[i + 1];
      utils$1.expand(r, state.tmp, 0);
      keyL ^= state.tmp[0];
      keyR ^= state.tmp[1];
      var s = utils$1.substitute(keyL, keyR);
      var f = utils$1.permute(s);
      var t = r;
      r = (l ^ f) >>> 0;
      l = t;
    }

    utils$1.rip(r, l, out, off);
  };

  DES.prototype._decrypt = function _decrypt(state, lStart, rStart, out, off) {
    var l = rStart;
    var r = lStart;

    for (var i = state.keys.length - 2; i >= 0; i -= 2) {
      var keyL = state.keys[i];
      var keyR = state.keys[i + 1];
      utils$1.expand(l, state.tmp, 0);
      keyL ^= state.tmp[0];
      keyR ^= state.tmp[1];
      var s = utils$1.substitute(keyL, keyR);
      var f = utils$1.permute(s);
      var t = l;
      l = (r ^ f) >>> 0;
      r = t;
    }

    utils$1.rip(l, r, out, off);
  };

  var proto = {};

  function CBCState(iv) {
    minimalisticAssert.equal(iv.length, 8, 'Invalid IV length');
    this.iv = new Array(8);

    for (var i = 0; i < this.iv.length; i++) this.iv[i] = iv[i];
  }

  function instantiate(Base) {
    function CBC(options) {
      Base.call(this, options);

      this._cbcInit();
    }

    inherits$2(CBC, Base);
    var keys = Object.keys(proto);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      CBC.prototype[key] = proto[key];
    }

    CBC.create = function create(options) {
      return new CBC(options);
    };

    return CBC;
  }

  var instantiate_1 = instantiate;

  proto._cbcInit = function _cbcInit() {
    var state = new CBCState(this.options.iv);
    this._cbcState = state;
  };

  proto._update = function _update(inp, inOff, out, outOff) {
    var state = this._cbcState;
    var superProto = this.constructor.super_.prototype;
    var iv = state.iv;

    if (this.type === 'encrypt') {
      for (var i = 0; i < this.blockSize; i++) iv[i] ^= inp[inOff + i];

      superProto._update.call(this, iv, 0, out, outOff);

      for (var i = 0; i < this.blockSize; i++) iv[i] = out[outOff + i];
    } else {
      superProto._update.call(this, inp, inOff, out, outOff);

      for (var i = 0; i < this.blockSize; i++) out[outOff + i] ^= iv[i];

      for (var i = 0; i < this.blockSize; i++) iv[i] = inp[inOff + i];
    }
  };

  var cbc = {
    instantiate: instantiate_1
  };

  function EDEState(type, key) {
    minimalisticAssert.equal(key.length, 24, 'Invalid key length');
    var k1 = key.slice(0, 8);
    var k2 = key.slice(8, 16);
    var k3 = key.slice(16, 24);

    if (type === 'encrypt') {
      this.ciphers = [des.create({
        type: 'encrypt',
        key: k1
      }), des.create({
        type: 'decrypt',
        key: k2
      }), des.create({
        type: 'encrypt',
        key: k3
      })];
    } else {
      this.ciphers = [des.create({
        type: 'decrypt',
        key: k3
      }), des.create({
        type: 'encrypt',
        key: k2
      }), des.create({
        type: 'decrypt',
        key: k1
      })];
    }
  }

  function EDE(options) {
    cipher.call(this, options);
    var state = new EDEState(this.type, this.options.key);
    this._edeState = state;
  }

  inherits$2(EDE, cipher);
  var ede = EDE;

  EDE.create = function create(options) {
    return new EDE(options);
  };

  EDE.prototype._update = function _update(inp, inOff, out, outOff) {
    var state = this._edeState;

    state.ciphers[0]._update(inp, inOff, out, outOff);

    state.ciphers[1]._update(out, outOff, out, outOff);

    state.ciphers[2]._update(out, outOff, out, outOff);
  };

  EDE.prototype._pad = des.prototype._pad;
  EDE.prototype._unpad = des.prototype._unpad;
  var utils$2 = utils$1;
  var Cipher$1 = cipher;
  var DES$1 = des;
  var CBC = cbc;
  var EDE$1 = ede;
  var des$1 = {
    utils: utils$2,
    Cipher: Cipher$1,
    DES: DES$1,
    CBC: CBC,
    EDE: EDE$1
  };
  var des$2 = Object.freeze({
    __proto__: null,
    'default': des$1,
    __moduleExports: des$1,
    utils: utils$2,
    Cipher: Cipher$1,
    DES: DES$1,
    CBC: CBC,
    EDE: EDE$1
  });

  class DesCryptoKey extends CryptoKey$1 {
    constructor(algorithm, extractable, usages, raw) {
      super(algorithm, extractable, "secret", usages);
      this.raw = raw;
    }

    toJSON() {
      const jwk = {
        kty: "oct",
        alg: this.getJwkAlgorithm(),
        k: Convert.ToBase64Url(this.raw),
        ext: this.extractable,
        key_ops: this.usages
      };
      return jwk;
    }

    getJwkAlgorithm() {
      switch (this.algorithm.name.toUpperCase()) {
        case "DES-CBC":
          return `DES-CBC`;

        case "DES-EDE3-CBC":
          return `3DES-CBC`;

        default:
          throw new AlgorithmError("Unsupported algorithm name");
      }
    }

  }

  class DesCrypto {
    static checkLib() {
      if (typeof des$2 === "undefined") {
        throw new OperationError("Cannot implement DES mechanism. Add 'https://peculiarventures.github.io/pv-webcrypto-tests/src/des.js' script to your project");
      }
    }

    static checkCryptoKey(key) {
      if (!(key instanceof DesCryptoKey)) {
        throw new TypeError("key: Is not DesCryptoKey");
      }
    }

    static generateKey(algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        this.checkLib();
        const raw = exports.nativeCrypto.getRandomValues(new Uint8Array(algorithm.length / 8));
        return new DesCryptoKey(algorithm, extractable, keyUsages, raw);
      });
    }

    static exportKey(format, key) {
      return __awaiter(this, void 0, void 0, function* () {
        this.checkLib();

        switch (format) {
          case "jwk":
            return key.toJSON();

          case "raw":
            return key.raw.buffer;

          default:
            throw new OperationError("format: Must be 'jwk' or 'raw'");
        }
      });
    }

    static importKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        this.checkLib();
        let raw;

        if (isJWK(keyData)) {
          raw = Convert.FromBase64Url(keyData.k);
        } else {
          raw = BufferSourceConverter.toArrayBuffer(keyData);
        }

        if (algorithm.name === "DES-CBC" && raw.byteLength !== 8 || algorithm.name === "DES-EDE3-CBC" && raw.byteLength !== 24) {
          throw new OperationError("keyData: Is wrong key length");
        }

        const key = new DesCryptoKey({
          name: algorithm.name,
          length: raw.byteLength << 3
        }, extractable, keyUsages, new Uint8Array(raw));
        return key;
      });
    }

    static encrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return this.cipher(algorithm, key, data, true);
      });
    }

    static decrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return this.cipher(algorithm, key, data, false);
      });
    }

    static cipher(algorithm, key, data, encrypt) {
      return __awaiter(this, void 0, void 0, function* () {
        this.checkLib();
        const type = encrypt ? "encrypt" : "decrypt";
        let DesCipher;
        const iv = BufferSourceConverter.toUint8Array(algorithm.iv);

        switch (algorithm.name.toUpperCase()) {
          case "DES-CBC":
            DesCipher = CBC.instantiate(DES$1).create({
              key: key.raw,
              type,
              iv
            });
            break;

          case "DES-EDE3-CBC":
            DesCipher = CBC.instantiate(EDE$1).create({
              key: key.raw,
              type,
              iv
            });
            break;

          default:
            throw new OperationError("algorithm: Is not recognized");
        }

        const enc = DesCipher.update(new Uint8Array(data)).concat(DesCipher.final());
        return new Uint8Array(enc).buffer;
      });
    }

  }

  class DesCbcProvider extends DesProvider {
    constructor() {
      super(...arguments);
      this.keySizeBits = 64;
      this.ivSize = 8;
      this.name = "DES-CBC";
    }

    onGenerateKey(algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return DesCrypto.generateKey(algorithm, extractable, keyUsages);
      });
    }

    onExportKey(format, key) {
      return __awaiter(this, void 0, void 0, function* () {
        return DesCrypto.exportKey(format, key);
      });
    }

    onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return DesCrypto.importKey(format, keyData, algorithm, extractable, keyUsages);
      });
    }

    onEncrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return DesCrypto.encrypt(algorithm, key, data);
      });
    }

    onDecrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return DesCrypto.decrypt(algorithm, key, data);
      });
    }

    checkCryptoKey(key, keyUsage) {
      super.checkCryptoKey(key, keyUsage);
      DesCrypto.checkCryptoKey(key);
    }

  }

  class DesEde3CbcProvider extends DesProvider {
    constructor() {
      super(...arguments);
      this.keySizeBits = 192;
      this.ivSize = 8;
      this.name = "DES-EDE3-CBC";
    }

    onGenerateKey(algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return DesCrypto.generateKey(algorithm, extractable, keyUsages);
      });
    }

    onExportKey(format, key) {
      return __awaiter(this, void 0, void 0, function* () {
        return DesCrypto.exportKey(format, key);
      });
    }

    onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        return DesCrypto.importKey(format, keyData, algorithm, extractable, keyUsages);
      });
    }

    onEncrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return DesCrypto.encrypt(algorithm, key, data);
      });
    }

    onDecrypt(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return DesCrypto.decrypt(algorithm, key, data);
      });
    }

    checkCryptoKey(key, keyUsage) {
      super.checkCryptoKey(key, keyUsage);
      DesCrypto.checkCryptoKey(key);
    }

  }

  let HmacCryptoKey = (() => {
    class HmacCryptoKey extends CryptoKey$1 {
      constructor(algorithm = {
        name: "HMAC"
      }, extractable = false, usages = [], data = new Uint8Array(0)) {
        super(algorithm, extractable, "secret", usages);
        this.kty = "oct";
        this.data = data;
      }

      get alg() {
        const hash = this.algorithm.hash.name.toUpperCase();
        return `HS${hash.replace("SHA-", "")}`;
      }

      set alg(value) {}

    }

    __decorate([JsonProp({
      name: "ext",
      type: JsonPropTypes.Boolean,
      optional: true
    })], HmacCryptoKey.prototype, "extractable", void 0);

    __decorate([JsonProp({
      name: "key_ops",
      type: JsonPropTypes.String,
      repeated: true,
      optional: true
    })], HmacCryptoKey.prototype, "usages", void 0);

    __decorate([JsonProp({
      name: "k",
      converter: JsonBase64UrlArrayBufferConverter$1
    })], HmacCryptoKey.prototype, "data", void 0);

    __decorate([JsonProp({
      type: JsonPropTypes.String
    })], HmacCryptoKey.prototype, "kty", void 0);

    __decorate([JsonProp({
      type: JsonPropTypes.String
    })], HmacCryptoKey.prototype, "alg", null);

    return HmacCryptoKey;
  })();

  class HmacProvider$1 extends HmacProvider {
    onGenerateKey(algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        const length = algorithm.length || this.getDefaultLength(algorithm.hash.name);
        const raw = exports.nativeCrypto.getRandomValues(new Uint8Array(length >> 3));
        const key = new HmacCryptoKey(algorithm, extractable, keyUsages, raw);
        return key;
      });
    }

    onSign(algorithm, key, data) {
      return __awaiter(this, void 0, void 0, function* () {
        let fn;

        switch (key.algorithm.hash.name.toUpperCase()) {
          case "SHA-1":
            fn = asmcrypto_js.HmacSha1;
            break;

          case "SHA-256":
            fn = asmcrypto_js.HmacSha256;
            break;

          case "SHA-512":
            fn = asmcrypto_js.HmacSha512;
            break;

          default:
            throw new OperationError("key.algorithm.hash: Is not recognized");
        }

        const result = new fn(key.data).process(BufferSourceConverter.toUint8Array(data)).finish().result;
        return BufferSourceConverter.toArrayBuffer(result);
      });
    }

    onVerify(algorithm, key, signature, data) {
      return __awaiter(this, void 0, void 0, function* () {
        const signature2 = yield this.onSign(algorithm, key, data);
        return Convert.ToHex(signature2) === Convert.ToHex(signature);
      });
    }

    onImportKey(format, keyData, algorithm, extractable, keyUsages) {
      return __awaiter(this, void 0, void 0, function* () {
        let key;

        switch (format.toLowerCase()) {
          case "jwk":
            key = JsonParser.fromJSON(keyData, {
              targetSchema: HmacCryptoKey
            });
            break;

          case "raw":
            if (!BufferSourceConverter.isBufferSource(keyData)) {
              throw new TypeError("keyData: Is not ArrayBuffer or ArrayBufferView");
            }

            key = new HmacCryptoKey(algorithm, extractable, keyUsages, BufferSourceConverter.toUint8Array(keyData));
            break;

          default:
            throw new OperationError("format: Must be 'jwk' or 'raw'");
        }

        key.algorithm = {
          hash: {
            name: algorithm.hash.name
          },
          name: this.name,
          length: key.data.length << 3
        };
        key.extractable = extractable;
        key.usages = keyUsages;
        return key;
      });
    }

    onExportKey(format, key) {
      return __awaiter(this, void 0, void 0, function* () {
        switch (format.toLowerCase()) {
          case "jwk":
            const jwk = JsonSerializer.toJSON(key);
            return jwk;

          case "raw":
            return new Uint8Array(key.data).buffer;

          default:
            throw new OperationError("format: Must be 'jwk' or 'raw'");
        }
      });
    }

    checkCryptoKey(key, keyUsage) {
      super.checkCryptoKey(key, keyUsage);

      if (!(key instanceof HmacCryptoKey)) {
        throw new TypeError("key: Is not HMAC CryptoKey");
      }
    }

  }

  var __classPrivateFieldSet =  function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to set private field on non-instance");
    }

    privateMap.set(receiver, value);
    return value;
  };

  var __classPrivateFieldGet =  function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to get private field on non-instance");
    }

    return privateMap.get(receiver);
  };

  var _nativeKey;

  class WrappedNativeCryptoKey extends CryptoKey$1 {
    constructor(algorithm, extractable, type, usages, nativeKey) {
      super(algorithm, extractable, type, usages);

      _nativeKey.set(this, void 0);

      __classPrivateFieldSet(this, _nativeKey, nativeKey);
    }

    getNative() {
      return __classPrivateFieldGet(this, _nativeKey);
    }

  }

  _nativeKey = new WeakMap();

  let SubtleCrypto$1 = (() => {
    class SubtleCrypto$1 extends SubtleCrypto {
      constructor() {
        super();
        this.browserInfo = BrowserInfo();
        this.providers.set(new AesCbcProvider$1());
        this.providers.set(new AesCtrProvider$1());
        this.providers.set(new AesEcbProvider$1());
        this.providers.set(new AesGcmProvider$1());
        this.providers.set(new AesKwProvider$1());
        this.providers.set(new DesCbcProvider());
        this.providers.set(new DesEde3CbcProvider());
        this.providers.set(new RsaSsaProvider$1());
        this.providers.set(new RsaPssProvider$1());
        this.providers.set(new RsaOaepProvider$1());
        this.providers.set(new RsaEsProvider());
        this.providers.set(new EcdsaProvider$1());
        this.providers.set(new EcdhProvider$1());
        this.providers.set(new Sha1Provider());
        this.providers.set(new Sha256Provider());
        this.providers.set(new Sha512Provider());
        this.providers.set(new Pbkdf2Provider$1());
        this.providers.set(new HmacProvider$1());
      }

      static isAnotherKey(key) {
        if (typeof key === "object" && typeof key.type === "string" && typeof key.extractable === "boolean" && typeof key.algorithm === "object") {
          return !(key instanceof CryptoKey$1);
        }

        return false;
      }

      digest(...args) {
        return __awaiter(this, void 0, void 0, function* () {
          return this.wrapNative("digest", ...args);
        });
      }

      importKey(...args) {
        return __awaiter(this, void 0, void 0, function* () {
          this.fixFirefoxEcImportPkcs8(args);
          return this.wrapNative("importKey", ...args);
        });
      }

      exportKey(...args) {
        return __awaiter(this, void 0, void 0, function* () {
          return (yield this.fixFirefoxEcExportPkcs8(args)) || (yield this.wrapNative("exportKey", ...args));
        });
      }

      generateKey(...args) {
        return __awaiter(this, void 0, void 0, function* () {
          return this.wrapNative("generateKey", ...args);
        });
      }

      sign(...args) {
        return __awaiter(this, void 0, void 0, function* () {
          return this.wrapNative("sign", ...args);
        });
      }

      verify(...args) {
        return __awaiter(this, void 0, void 0, function* () {
          return this.wrapNative("verify", ...args);
        });
      }

      encrypt(...args) {
        return __awaiter(this, void 0, void 0, function* () {
          return this.wrapNative("encrypt", ...args);
        });
      }

      decrypt(...args) {
        return __awaiter(this, void 0, void 0, function* () {
          return this.wrapNative("decrypt", ...args);
        });
      }

      wrapKey(...args) {
        return __awaiter(this, void 0, void 0, function* () {
          return this.wrapNative("wrapKey", ...args);
        });
      }

      unwrapKey(...args) {
        return __awaiter(this, void 0, void 0, function* () {
          return this.wrapNative("unwrapKey", ...args);
        });
      }

      deriveBits(...args) {
        return __awaiter(this, void 0, void 0, function* () {
          return this.wrapNative("deriveBits", ...args);
        });
      }

      deriveKey(...args) {
        return __awaiter(this, void 0, void 0, function* () {
          return this.wrapNative("deriveKey", ...args);
        });
      }

      wrapNative(method, ...args) {
        const _superIndex = name => super[name];

        return __awaiter(this, void 0, void 0, function* () {
          if (~["generateKey", "unwrapKey", "deriveKey", "importKey"].indexOf(method)) {
            this.fixAlgorithmName(args);
          }

          try {
            if (method !== "digest" || !args.some(a => a instanceof CryptoKey$1)) {
              const nativeArgs = this.fixNativeArguments(method, args);
              Debug.info(`Call native '${method}' method`, nativeArgs);
              const res = yield exports.nativeSubtle[method].apply(exports.nativeSubtle, nativeArgs);
              return this.fixNativeResult(method, args, res);
            }
          } catch (e) {
            Debug.warn(`Error on native '${method}' calling. ${e.message}`, e);
          }

          if (method === "wrapKey") {
            try {
              Debug.info(`Trying to wrap key by using native functions`, args);
              const data = yield this.exportKey(args[0], args[1]);
              const keyData = args[0] === "jwk" ? Convert.FromUtf8String(JSON.stringify(data)) : data;
              const res = yield this.encrypt(args[3], args[2], keyData);
              return res;
            } catch (e) {
              Debug.warn(`Cannot wrap key by native functions. ${e.message}`, e);
            }
          }

          if (method === "unwrapKey") {
            try {
              Debug.info(`Trying to unwrap key by using native functions`, args);
              const data = yield this.decrypt(args[3], args[2], args[1]);
              const keyData = args[0] === "jwk" ? JSON.parse(Convert.ToUtf8String(data)) : data;
              const res = yield this.importKey(args[0], keyData, args[4], args[5], args[6]);
              return res;
            } catch (e) {
              Debug.warn(`Cannot unwrap key by native functions. ${e.message}`, e);
            }
          }

          if (method === "deriveKey") {
            try {
              Debug.info(`Trying to derive key by using native functions`, args);
              const data = yield this.deriveBits(args[0], args[1], args[2].length);
              const res = yield this.importKey("raw", data, args[2], args[3], args[4]);
              return res;
            } catch (e) {
              Debug.warn(`Cannot derive key by native functions. ${e.message}`, e);
            }
          }

          if (method === "deriveBits" || method === "deriveKey") {
            for (const arg of args) {
              if (typeof arg === "object" && arg.public && SubtleCrypto$1.isAnotherKey(arg.public)) {
                arg.public = yield this.castKey(arg.public);
              }
            }
          }

          for (let i = 0; i < args.length; i++) {
            const arg = args[i];

            if (SubtleCrypto$1.isAnotherKey(arg)) {
              args[i] = yield this.castKey(arg);
            }
          }

          return _superIndex(method).apply(this, args);
        });
      }

      fixNativeArguments(method, args) {
        var _a, _b, _c, _d, _e, _f, _g, _h;

        const res = [...args];

        if (method === "importKey") {
          if (this.browserInfo.name === Browser.IE && ((_b = (_a = res[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase) === null || _b === void 0 ? void 0 : _b.call(_a)) === "jwk" && !BufferSourceConverter.isBufferSource(res[1])) {
            res[1] = Convert.FromUtf8String(JSON.stringify(res[1]));
          }
        }

        if (this.browserInfo.name === Browser.IE && args[1] instanceof WrappedNativeCryptoKey) {
          switch (method) {
            case "sign":
            case "verify":
            case "encrypt":
            case "decrypt":
              res[0] = Object.assign(Object.assign({}, this.prepareAlgorithm(res[0])), {
                hash: (_e = (_d = (_c = res[1]) === null || _c === void 0 ? void 0 : _c.algorithm) === null || _d === void 0 ? void 0 : _d.hash) === null || _e === void 0 ? void 0 : _e.name
              });
              break;

            case "wrapKey":
            case "unwrapKey":
              res[4] = Object.assign(Object.assign({}, this.prepareAlgorithm(res[4])), {
                hash: (_h = (_g = (_f = res[3]) === null || _f === void 0 ? void 0 : _f.algorithm) === null || _g === void 0 ? void 0 : _g.hash) === null || _h === void 0 ? void 0 : _h.name
              });
              break;
          }
        }

        for (let i = 0; i < res.length; i++) {
          const arg = res[i];

          if (arg instanceof WrappedNativeCryptoKey) {
            res[i] = arg.getNative();
          }
        }

        return res;
      }

      fixNativeResult(method, args, res) {
        var _a, _b;

        if (this.browserInfo.name === Browser.IE) {
          if (method === "exportKey") {
            if (((_b = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase) === null || _b === void 0 ? void 0 : _b.call(_a)) === "jwk" && res instanceof ArrayBuffer) {
              return JSON.parse(Convert.ToUtf8String(res));
            }
          }

          if ("privateKey" in res) {
            const privateKeyUsages = ["sign", "decrypt", "unwrapKey", "deriveKey", "deriveBits"];
            const publicKeyUsages = ["verify", "encrypt", "wrapKey"];
            return {
              privateKey: this.wrapNativeKey(res.privateKey, args[0], args[1], args[2].filter(o => privateKeyUsages.includes(o))),
              publicKey: this.wrapNativeKey(res.publicKey, args[0], args[1], args[2].filter(o => publicKeyUsages.includes(o)))
            };
          } else if ("extractable" in res) {
            let algorithm;
            let usages;

            switch (method) {
              case "importKey":
                algorithm = args[2];
                usages = args[4];
                break;

              case "unwrapKey":
                algorithm = args[4];
                usages = args[6];
                break;

              case "generateKey":
                algorithm = args[0];
                usages = args[2];
                break;

              default:
                throw new OperationError("Cannot wrap native key. Unsupported method in use");
            }

            return this.wrapNativeKey(res, algorithm, res.extractable, usages);
          }
        }

        return res;
      }

      wrapNativeKey(key, algorithm, extractable, keyUsages) {
        if (this.browserInfo.name === Browser.IE) {
          const algs = ["RSASSA-PKCS1-v1_5", "RSA-PSS", "RSA-OAEP", "AES-CBC", "AES-CTR", "AES-KW", "HMAC"];
          const index = algs.map(o => o.toLowerCase()).indexOf(key.algorithm.name.toLowerCase());

          if (index !== -1) {
            const alg = this.prepareAlgorithm(algorithm);
            const newAlg = Object.assign(Object.assign({}, key.algorithm), {
              name: algs[index]
            });

            if (SubtleCrypto.isHashedAlgorithm(alg)) {
              newAlg.hash = {
                name: alg.hash.name.toUpperCase()
              };
            }

            Debug.info(`Wrapping ${algs[index]} crypto key to WrappedNativeCryptoKey`);
            return new WrappedNativeCryptoKey(newAlg, extractable, key.type, keyUsages, key);
          }
        }

        return key;
      }

      castKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
          Debug.info("Cast native CryptoKey to linter key.", key);

          if (!key.extractable) {
            throw new Error("Cannot cast unextractable crypto key");
          }

          const provider = this.getProvider(key.algorithm.name);
          const jwk = yield this.exportKey("jwk", key);
          return provider.importKey("jwk", jwk, key.algorithm, true, key.usages);
        });
      }

      fixAlgorithmName(args) {
        if (this.browserInfo.name === Browser.Edge) {
          for (let i = 0; i < args.length; i++) {
            const arg = args[0];

            if (typeof arg === "string") {
              for (const algorithm of this.providers.algorithms) {
                if (algorithm.toLowerCase() === arg.toLowerCase()) {
                  args[i] = algorithm;
                  break;
                }
              }
            } else if (typeof arg === "object" && typeof arg.name === "string") {
              for (const algorithm of this.providers.algorithms) {
                if (algorithm.toLowerCase() === arg.name.toLowerCase()) {
                  arg.name = algorithm;
                }

                if (typeof arg.hash === "string" && algorithm.toLowerCase() === arg.hash.toLowerCase() || typeof arg.hash === "object" && typeof arg.hash.name === "string" && algorithm.toLowerCase() === arg.hash.name.toLowerCase()) {
                  arg.hash = {
                    name: algorithm
                  };
                }
              }
            }
          }
        }
      }

      fixFirefoxEcImportPkcs8(args) {
        const preparedAlgorithm = this.prepareAlgorithm(args[2]);
        const algName = preparedAlgorithm.name.toUpperCase();

        if (this.browserInfo.name === Browser.Firefox && args[0] === "pkcs8" && ~["ECDSA", "ECDH"].indexOf(algName) && ~["P-256", "P-384", "P-521"].indexOf(preparedAlgorithm.namedCurve)) {
          if (!BufferSourceConverter.isBufferSource(args[1])) {
            throw new TypeError("data: Is not ArrayBuffer or ArrayBufferView");
          }

          const preparedData = BufferSourceConverter.toArrayBuffer(args[1]);
          const keyInfo = AsnParser.parse(preparedData, PrivateKeyInfo$1);
          const privateKey = AsnParser.parse(keyInfo.privateKey, EcPrivateKey$1);
          const jwk = JsonSerializer.toJSON(privateKey);
          jwk.ext = true;
          jwk.key_ops = args[4];
          jwk.crv = preparedAlgorithm.namedCurve;
          jwk.kty = "EC";
          args[0] = "jwk";
          args[1] = jwk;
        }
      }

      fixFirefoxEcExportPkcs8(args) {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            if (this.browserInfo.name === Browser.Firefox && args[0] === "pkcs8" && ~["ECDSA", "ECDH"].indexOf(args[1].algorithm.name) && ~["P-256", "P-384", "P-521"].indexOf(args[1].algorithm.namedCurve)) {
              const jwk = yield this.exportKey("jwk", args[1]);
              const ecKey = JsonParser.fromJSON(jwk, {
                targetSchema: EcPrivateKey$1
              });
              const keyInfo = new PrivateKeyInfo$1();
              keyInfo.privateKeyAlgorithm.algorithm = EcCrypto.ASN_ALGORITHM;
              keyInfo.privateKeyAlgorithm.parameters = AsnSerializer.serialize(new ObjectIdentifier$1(getOidByNamedCurve(args[1].algorithm.namedCurve)));
              keyInfo.privateKey = AsnSerializer.serialize(ecKey);
              return AsnSerializer.serialize(keyInfo);
            }
          } catch (err) {
            Debug.error(err);
            return null;
          }
        });
      }

    }

    SubtleCrypto$1.methods = ["digest", "importKey", "exportKey", "sign", "verify", "generateKey", "encrypt", "decrypt", "deriveBits", "deriveKey", "wrapKey", "unwrapKey"];
    return SubtleCrypto$1;
  })();

  class Crypto$1 extends Crypto {
    constructor() {
      super(...arguments);
      this.subtle = new SubtleCrypto$1();
    }

    get nativeCrypto() {
      return exports.nativeCrypto;
    }

    getRandomValues(array) {
      return exports.nativeCrypto.getRandomValues(array);
    }

  }

  function WrapFunction(subtle, name) {
    const fn = subtle[name];

    subtle[name] = function () {
      const args = arguments;
      return new Promise((resolve, reject) => {
        const op = fn.apply(subtle, args);

        op.oncomplete = e => {
          resolve(e.target.result);
        };

        op.onerror = e => {
          reject(`Error on running '${name}' function`);
        };
      });
    };
  }

  if (typeof self !== "undefined" && self["msCrypto"]) {
    WrapFunction(exports.nativeSubtle, "generateKey");
    WrapFunction(exports.nativeSubtle, "digest");
    WrapFunction(exports.nativeSubtle, "sign");
    WrapFunction(exports.nativeSubtle, "verify");
    WrapFunction(exports.nativeSubtle, "encrypt");
    WrapFunction(exports.nativeSubtle, "decrypt");
    WrapFunction(exports.nativeSubtle, "importKey");
    WrapFunction(exports.nativeSubtle, "exportKey");
    WrapFunction(exports.nativeSubtle, "wrapKey");
    WrapFunction(exports.nativeSubtle, "unwrapKey");
    WrapFunction(exports.nativeSubtle, "deriveKey");
    WrapFunction(exports.nativeSubtle, "deriveBits");
  }

  if (!Math.imul) {
    Math.imul = function imul(a, b) {
      const ah = a >>> 16 & 0xffff;
      const al = a & 0xffff;
      const bh = b >>> 16 & 0xffff;
      const bl = b & 0xffff;
      return al * bl + (ah * bl + al * bh << 16 >>> 0) | 0;
    };
  }

  const window$1 = self;

  if (exports.nativeCrypto) {
    Object.freeze(exports.nativeCrypto.getRandomValues);
  }

  try {
    delete self.crypto;
    window$1.crypto = new Crypto$1();
    Object.freeze(window$1.crypto);
  } catch (e) {
    Debug.error(e);
  }

  const crypto = window$1.crypto;

  exports.Crypto = Crypto$1;
  exports.CryptoKey = CryptoKey$1;
  exports.crypto = crypto;
  exports.setCrypto = setCrypto;

  return exports;

}({}, self.asmCrypto, self.elliptic));