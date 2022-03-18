import moment from 'moment';
import UUID from 'uuid';
import { regExps } from '../helpers';

const OID = {
  '2.5.4.3': {
    short: 'CN',
    long: 'CommonName',
  },
  '2.5.4.6': {
    short: 'C',
    long: 'Country',
  },
  '2.5.4.5': {
    long: 'DeviceSerialNumber',
  },
  '0.9.2342.19200300.100.1.25': {
    short: 'DC',
    long: 'DomainComponent',
  },
  '1.2.840.113549.1.9.1': {
    short: 'E',
    long: 'EMail',
  },
  '2.5.4.42': {
    short: 'G',
    long: 'GivenName',
  },
  '2.5.4.43': {
    short: 'I',
    long: 'Initials',
  },
  '2.5.4.7': {
    short: 'L',
    long: 'Locality',
  },
  '2.5.4.10': {
    short: 'O',
    long: 'Organization',
  },
  '2.5.4.11': {
    short: 'OU',
    long: 'OrganizationUnit',
  },
  '2.5.4.8': {
    short: 'ST',
    long: 'State',
  },
  '2.5.4.9': {
    short: 'Street',
    long: 'StreetAddress',
  },
  '2.5.4.4': {
    short: 'SN',
    long: 'SurName',
  },
  '2.5.4.12': {
    short: 'T',
    long: 'Title',
  },
  '1.2.840.113549.1.9.8': {
    long: 'UnstructuredAddress',
  },
  '1.2.840.113549.1.9.2': {
    long: 'UnstructuredName',
  },
};

function getAlgorithmByOID(oid) {
  switch (oid) {
    case '1.2.840.113549.1.1.1':
    case '1.2.840.113549.1.1.5':
      return {
        name: 'RSASSA-PKCS1-v1_5',
        hash: {
          name: 'SHA-1',
        },
      };
    case '1.2.840.113549.1.1.11':
      return {
        name: 'RSASSA-PKCS1-v1_5',
        hash: {
          name: 'SHA-256',
        },
      };
    case '1.2.840.113549.1.1.12':
      return {
        name: 'RSASSA-PKCS1-v1_5',
        hash: {
          name: 'SHA-384',
        },
      };
    case '1.2.840.113549.1.1.13':
      return {
        name: 'RSASSA-PKCS1-v1_5',
        hash: {
          name: 'SHA-512',
        },
      };
    case '1.2.840.113549.1.1.10':
      return {
        name: 'RSA-PSS',
      };
    case '1.2.840.113549.1.1.7':
      return {
        name: 'RSA-OAEP',
      };
    case '1.2.840.10045.2.1':
    case '1.2.840.10045.4.1':
      return {
        name: 'ECDSA',
        hash: {
          name: 'SHA-1',
        },
      };
    case '1.2.840.10045.4.3.2':
      return {
        name: 'ECDSA',
        hash: {
          name: 'SHA-256',
        },
      };
    case '1.2.840.10045.4.3.3':
      return {
        name: 'ECDSA',
        hash: {
          name: 'SHA-384',
        },
      };
    case '1.2.840.10045.4.3.4':
      return {
        name: 'ECDSA',
        hash: {
          name: 'SHA-512',
        },
      };
    case '1.3.133.16.840.63.0.2':
      return {
        name: 'ECDH',
        kdf: 'SHA-1',
      };
    case '1.3.132.1.11.1':
      return {
        name: 'ECDH',
        kdf: 'SHA-256',
      };
    case '1.3.132.1.11.2':
      return {
        name: 'ECDH',
        kdf: 'SHA-384',
      };
    case '1.3.132.1.11.3':
      return {
        name: 'ECDH',
        kdf: 'SHA-512',
      };
    case '2.16.840.1.101.3.4.1.2':
      return {
        name: 'AES-CBC',
        length: 128,
      };
    case '2.16.840.1.101.3.4.1.22':
      return {
        name: 'AES-CBC',
        length: 192,
      };
    case '2.16.840.1.101.3.4.1.42':
      return {
        name: 'AES-CBC',
        length: 256,
      };
    case '2.16.840.1.101.3.4.1.6':
      return {
        name: 'AES-GCM',
        length: 128,
      };
    case '2.16.840.1.101.3.4.1.26':
      return {
        name: 'AES-GCM',
        length: 192,
      };
    case '2.16.840.1.101.3.4.1.46':
      return {
        name: 'AES-GCM',
        length: 256,
      };
    case '2.16.840.1.101.3.4.1.4':
      return {
        name: 'AES-CFB',
        length: 128,
      };
    case '2.16.840.1.101.3.4.1.24':
      return {
        name: 'AES-CFB',
        length: 192,
      };
    case '2.16.840.1.101.3.4.1.44':
      return {
        name: 'AES-CFB',
        length: 256,
      };
    case '2.16.840.1.101.3.4.1.5':
      return {
        name: 'AES-KW',
        length: 128,
      };
    case '2.16.840.1.101.3.4.1.25':
      return {
        name: 'AES-KW',
        length: 192,
      };
    case '2.16.840.1.101.3.4.1.45':
      return {
        name: 'AES-KW',
        length: 256,
      };
    case '1.2.840.113549.2.7':
      return {
        name: 'HMAC',
        hash: {
          name: 'SHA-1',
        },
      };
    case '1.2.840.113549.2.9':
      return {
        name: 'HMAC',
        hash: {
          name: 'SHA-256',
        },
      };
    case '1.2.840.113549.2.10':
      return {
        name: 'HMAC',
        hash: {
          name: 'SHA-384',
        },
      };
    case '1.2.840.113549.2.11':
      return {
        name: 'HMAC',
        hash: {
          name: 'SHA-512',
        },
      };
    case '1.2.840.113549.1.9.16.3.5':
      return {
        name: 'DH',
      };
    case '1.3.14.3.2.26':
      return {
        name: 'SHA-1',
      };
    case '2.16.840.1.101.3.4.2.1':
      return {
        name: 'SHA-256',
      };
    case '2.16.840.1.101.3.4.2.2':
      return {
        name: 'SHA-384',
      };
    case '2.16.840.1.101.3.4.2.3':
      return {
        name: 'SHA-512',
      };
    case '1.2.840.113549.1.5.12':
      return {
        name: 'PBKDF2',
      };
    // region Special case - OIDs for ECC curves
    case '1.2.840.10045.3.1.7':
      return {
        name: 'P-256',
      };
    case '1.3.132.0.34':
      return {
        name: 'P-384',
      };
    case '1.3.132.0.35':
      return {
        name: 'P-521',
      };
    // endregion
    default:
  }

  return {};
}

const subjectTypesAndValues = {
  commonName: '2.5.4.3',
  hostName: '1.3.6.1.2.1.1.5',
  organization: '2.5.4.10',
  organizationUnit: '2.5.4.11',
  country: '2.5.4.6',
  locality: '2.5.4.7',
  state: '2.5.4.8',
};

const subjectNames = {
  O: 'Organization',
  CN: 'Common Name',
  C: 'Country',
  OU: 'Organization Unit',
  L: 'City',
  ST: 'Region',
  E: 'Email',
  G: 'Given Name',
  SN: 'Surname',
  '1.3.6.1.2.1.1.5': 'Host Name',
};

function fixName(name) {
  // TODO: must be removed if PKIjs fixed
  if (name.typesAndValues) {
    const schema = (new asn1js.Sequence({
      value: Array.from(name.typesAndValues, element => new asn1js.Set({
        value: [element.toSchema()],
      })),
    }));
    const der = schema.toBER();
    name.fromSchema(asn1js.fromBER(der).result);
  }
}

/**
 * Certificate decode/encode helper
 * @type {{
 *   name2str: CertHelper.name2str,
 *   formatDer: CertHelper.formatDer,
 *   getKeyType: CertHelper.getKeyType,
 *   prepareAlgorithm: CertHelper.prepareAlgorithm,
 *   addSpaceAfterSecondCharset: CertHelper.addSpaceAfterSecondCharset,
 *   certRawToJson: CertHelper.certRawToJson,
 *   prepareCertToImport: CertHelper.prepareCertToImport,
 *   decoratePkcs10Subject: CertHelper.decoratePkcs10Subject,
 *   decorateCertificateSubject: CertHelper.decorateCertificateSubject,
 *   keyDataHandler: CertHelper.keyDataHandler,
 *   certDataHandler: CertHelper.certDataHandler,
 *   requestDataHandler: CertHelper.requestDataHandler,
 *   decodeSubjectString: CertHelper.decodeSubjectString
 * }}
 */
const CertHelper = {
  name2str: function name2str(attributeTypeAndValue, splitter = ', ') {
    if (!attributeTypeAndValue) {
      return '';
    }

    if (Array.isArray(attributeTypeAndValue.typesAndValues)) {
      attributeTypeAndValue = attributeTypeAndValue.typesAndValues;
    }

    const result = [];

    attributeTypeAndValue.forEach((attr) => {
      let name = attr.type.toString();
      const type = OID[name];

      if (type) {
        name = type.short || type.long;
      }

      result.push([name, attr.value.valueBlock.value.toString()].join('='));
    });

    return result.join(splitter);
  },

  formatDer: function formatDer(string) {
    return string.replace(/(.{32})/g, '$1 \n').replace(/(.{4})/g, '$1 ').trim();
  },

  getKeyType: function getKeyType(algorithm) {
    if (algorithm.slice(0, 3) === 'RSA') {
      return 'RSA';
    }
    if (algorithm.slice(0, 2) === 'EC') {
      return 'EC';
    }
    return algorithm;
  },

  /**
   * Decode algorithm OID
   * @param {{
   *   algorithmId: string
   * }} pkiAlg
   * @returns {{
   *   name: string
   *   hash: string
   * }}
   */
  prepareAlgorithm: function prepareAlgorithm(pkiAlg) {
    switch (pkiAlg.algorithmId) {
      case '1.2.840.113549.1.1.5': {
        return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-1' };
      }
      case '1.2.840.113549.1.1.11': {
        return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' };
      }
      case '1.2.840.113549.1.1.12': {
        return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-384' };
      }
      case '1.2.840.113549.1.1.13': {
        return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-512' };
      }
      case '1.2.840.10045.4.3.2': {
        return { name: 'ECDSA', hash: 'SHA-256' };
      }
      case '1.2.840.10045.4.1': {
        return { name: 'ECDSA', hash: 'SHA-1' };
      }
      default: {
        return { name: pkiAlg.algorithmId };
      }
    }
  },

  /**
   * Add space symbol after all second charset
   * @param {string} string
   * @returns {string}
   */
  addSpaceAfterSecondCharset: function addSpaceAfterSecondCharset(string) {
    return string.replace(/(.{2})/g, '$1 ').trim().toUpperCase();
  },

  /**
   * Add space symbol after all second charset and convert ArrayBuffer to string
   * @param {array} arrayBuffer
   * @returns {string}
   */
  toHexAndFormat: function toHexAndFormat(arrayBuffer) {
    return this.addSpaceAfterSecondCharset(pvtsutils.Convert.ToHex(arrayBuffer)).toUpperCase();
  },

  /**
   * Decode certificate raw format
   * @param {string} raw
   * @returns {{
   *   version: number,
   *   serialNumber: *,
   *   notBefore: Date,
   *   notAfter: Date,
   *   issuerName: *,
   *   subjectName: *,
   *   publicKey: {
   *     algorithm: {name},
   *     value: *
   *   },
   *   extensions: Array,
   *   signature: {
   *    algorithm: *,
   *    value: *
   *   }
   * }}
   */
  certRawToJson: function certRawToJson(raw) {
    const asn1 = asn1js.fromBER(raw);
    const x509 = new pkijs.Certificate({ schema: asn1.result });
    let isCA = false;

    // Public Key
    const publicKey = {
      algorithm: {
        name: x509.subjectPublicKeyInfo.algorithm.algorithmId === '1.2.840.10045.2.1' ? 'EC' : 'RSA',
      },
      value: this.addSpaceAfterSecondCharset(
        pvtsutils.Convert.ToHex(x509.subjectPublicKeyInfo.subjectPublicKey.valueBeforeDecode),
      ),
    };

    // Add params for Public key
    if (publicKey.algorithm.name === 'RSA') {
      const { modulus, publicExponent } = x509.subjectPublicKeyInfo.parsedKey;

      publicKey.algorithm.modulusBits = modulus.valueBlock.valueHex.byteLength << 3;
      publicKey.algorithm.publicExponent = publicExponent.valueBlock.valueHex.byteLength === 3
        ? 65537
        : 3;
    } else if (publicKey.algorithm.name === 'EC') {
      publicKey.algorithm.namedCurve = getAlgorithmByOID(
        x509.subjectPublicKeyInfo.toJSON().algorithm.algorithmParams.valueBlock.value,
      ).name;
    }

    // Check if CA using `Basic Constraints` extension.
    if (x509.extensions && x509.extensions.length) {
      for (let i = 0; i < x509.extensions.length; i += 1) {
        const extension = x509.extensions[i];

        if (extension.extnID === '2.5.29.19') {
          isCA = extension.parsedValue.cA;
        }
      }
    }

    return {
      version: x509.version,
      serialNumber: this.toHexAndFormat(x509.serialNumber.valueBlock._valueHex),
      notBefore: x509.notBefore.value,
      notAfter: x509.notAfter.value,
      issuerName: this.name2str(x509.issuer),
      subjectName: this.name2str(x509.subject),
      publicKey,
      extensions: [],
      signature: {
        algorithm: this.prepareAlgorithm(x509.signature),
        value: this.toHexAndFormat(x509.signatureValue.valueBlock.valueHex),
      },
      isCA,
    };
  },

  prepareCertToImport: function prepareCertToImport(value) {
    let certBuf;

    try {
      if (regExps.base64.test(value)) { // pem
        certBuf = pvtsutils.Convert.FromBinary(window.atob(value.replace(/(-----(BEGIN|END) CERTIFICATE-----|\r|\n)/g, '')));
      } else if (/[a-f\d]/ig.test(value)) { // hex
        certBuf = pvtsutils.Convert.FromHex(value.replace(/(\r|\n|\s)/g, ''));
      } else { // der
        certBuf = pvtsutils.Convert.FromBinary(value);
      }
    } catch (error) {
      throw new Error('Can\'t parse X509 certificate, because the file has the wrong format');
    }

    const asn1 = asn1js.fromBER(certBuf);

    if (asn1.offset > 0) {
      let cert = '';
      let type = '';

      try {
        cert = new pkijs.Certificate({ schema: asn1.result });
        type = 'x509';
      } catch (error) {
        throw new Error('ASN1 schema is not match to X509 certificate schema');
      }

      const json = cert.toJSON();
      const algorithm = this.prepareAlgorithm(json.signature);
      const { modulus, publicExponent } = cert.subjectPublicKeyInfo.parsedKey;

      const algName = json.subjectPublicKeyInfo.kty;
      if (algName === 'RSA') {
        algorithm.name = 'RSASSA-PKCS1-v1_5';
        algorithm.modulusBits = modulus.valueBlock.valueHex.byteLength << 3;
        algorithm.publicExponent = publicExponent.valueBlock.valueHex;
      } else if (algName === 'EC') {
        algorithm.name = 'ECDSA';
        algorithm.namedCurve = json.subjectPublicKeyInfo.crv;
      }

      return {
        type,
        raw: certBuf,
        usages: ['verify'],
        algorithm: {
          ...algorithm,
        },
      };
    }

    throw new Error('Cannot parse ASN1 data');
  },

  getAttributeValueBasedOnStringCharCode(value) {
    return value.charCodeAt() > 0xFF
      ? new asn1js.Utf8String({ value })
      : new asn1js.PrintableString({ value });
  },

  decoratePkcs10Subject: function decoratePkcs10Subject(pkcs10, data) {
    Object.keys(data).map((key) => {
      if ({}.hasOwnProperty.call(subjectTypesAndValues, key) && data[key]) {
        pkcs10.subject.typesAndValues.push(new pkijs.AttributeTypeAndValue({
          type: subjectTypesAndValues[key],
          value: this.getAttributeValueBasedOnStringCharCode(data[key]),
        }));
      }
      return true;
    });

    fixName(pkcs10.subject);

    return pkcs10;
  },

  decorateCertificateSubject: function decorateCertificateSubject(certificate, data) {
    Object.keys(data).map((key) => {
      if ({}.hasOwnProperty.call(subjectTypesAndValues, key) && data[key]) {
        certificate.issuer.typesAndValues.push(new pkijs.AttributeTypeAndValue({
          type: subjectTypesAndValues[key],
          value: this.getAttributeValueBasedOnStringCharCode(data[key]),
        }));
        certificate.subject.typesAndValues.push(new pkijs.AttributeTypeAndValue({
          type: subjectTypesAndValues[key],
          value: this.getAttributeValueBasedOnStringCharCode(data[key]),
        }));
      }
      return true;
    });

    fixName(certificate.subject);
    fixName(certificate.issuer);

    return certificate;
  },

  keyDataHandler: function keyDataHandler(data) {
    const { _algorithm, _usages, id } = data;

    let publicExponent = '';

    if (_algorithm.publicExponent && _algorithm.publicExponent.byteLength) {
      publicExponent = _algorithm.publicExponent.byteLength === 3 ? 65537 : 3;
    }

    return {
      id: UUID(),
      _id: id,
      usages: _usages,
      name: '',
      type: 'key',
      publicExponent,
      algorithm: _algorithm.name,
      modulusLength: _algorithm.modulusLength,
      namedCurve: _algorithm.namedCurve,
    };
  },

  certDataHandler: function certDataHandler(data) {
    const lang = navigator.language;
    const {
      issuerName,
      subjectName,
      extensions,
      publicKey,
      version,
      signature,
      serialNumber,
      notBefore,
      notAfter,
      id,
      thumbprint,
      pem,
      addedId,
      privateKeyId,
    } = data;

    const decodedIssuer = this.decodeSubjectString(issuerName);
    const decodedSubject = this.decodeSubjectString(subjectName);
    const name = decodedSubject['Common Name']
      || decodedSubject.Email
      || decodedSubject.Surname
      || decodedSubject.Organization
      || decodedSubject['Organization Unit']
      || '';

    return {
      id: addedId || UUID(),
      _id: id,
      type: 'certificate',
      name,
      pem,
      general: {
        serialNumber,
        version,
        notBefore: notBefore ? moment(notBefore).locale(lang).format('LLLL') : '',
        notAfter: notAfter ? moment(notAfter).locale(lang).format('LLLL') : '',
        thumbprint: this.addSpaceAfterSecondCharset(pvtsutils.Convert.ToHex(thumbprint)),
        issuerDN: issuerName,
        subjectDN: subjectName,
      },
      issuer: decodedIssuer,
      subject: decodedSubject,
      publicKey: {
        publicExponent: publicKey.algorithm.publicExponent,
        value: publicKey.value,
        algorithm: publicKey.algorithm.name,
        modulusBits: publicKey.algorithm.modulusBits,
        namedCurve: publicKey.algorithm.namedCurve,
      },
      signature: {
        algorithm: signature.algorithm.name,
        hash: signature.algorithm.hash,
        value: signature.value,
      },
      extensions,
      privateKeyId,
    };
  },

  requestDataHandler: function requestDataHandler(data) {
    const { _publicKey, id, _subjectName, pem, addedId } = data;
    const { algorithm, raw } = _publicKey;

    const decodedSubject = this.decodeSubjectString(_subjectName);
    let publicExponent = '';

    if (algorithm.publicExponent && algorithm.publicExponent.byteLength) {
      publicExponent = algorithm.publicExponent.byteLength === 3 ? 65537 : 3;
    }
    const name = decodedSubject['Common Name']
      || decodedSubject.Email
      || decodedSubject.Surname
      || decodedSubject.Organization
      || decodedSubject['Organization Unit']
      || '';

    return {
      id: addedId || UUID(),
      _id: id,
      name,
      type: 'request',
      pem,
      subject: decodedSubject,
      publicKey: {
        modulusBits: algorithm.modulusLength,
        namedCurve: algorithm.namedCurve,
        publicExponent,
        algorithm: this.getKeyType(algorithm.name),
        value: this.addSpaceAfterSecondCharset(pvtsutils.Convert.ToHex(raw)),
      },
      signature: {
        algorithm: algorithm.name,
        hash: algorithm.hash.name,
      },
    };
  },

  decodeSubjectString: function decodeSubjectString(subjectString) {
    const subjectObj = {};
    const arrSubjects = subjectString.split(/, /g);

    arrSubjects.map((sbj) => {
      const arrSubject = sbj.split('=');
      const subjectName = subjectNames[arrSubject[0]] || arrSubject[0];
      const subjectValue = arrSubject[1];
      subjectObj[subjectName] = subjectValue;
      if (subjectName === 'commonName') {
        subjectObj.name = subjectValue;
      }
      return true;
    });

    return subjectObj;
  },
};

export default CertHelper;
