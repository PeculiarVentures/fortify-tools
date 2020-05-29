import moment from 'moment';
import UUID from 'uuid';
import { OIDS } from '../constants';
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

    // Extensions
    const extensions = [];

    if (x509.extensions) {
      for (const item of x509.extensions) {
        const oid = OIDS[item.extnID];
        const extension = {
          name: oid ? `${oid} (${item.extnID})` : item.extnID,
          oid: item.extnID,
          critical: item.critical || false,
        };

        // parse extensions
        try {
          switch (item.extnID) {
            case '2.5.29.15': // key usage
              extension.value = [{}];
              extension.value[0].Usages = CertHelper.Extensions.keyUsage(item).join(', ');
              break;
            case '2.5.29.37': // Extended Key Usage
              extension.value = item.parsedValue.keyPurposes.map((o) => {
                const _oid = OIDS[o];
                return {
                  Purpose: _oid ? `${_oid} (${o})` : o,
                };
              });
              break;
            case '2.5.29.31': // CRL Distribution Points
              extension.value = item.parsedValue.distributionPoints.map(dp => ({
                URl: dp.distributionPoint[0].value,
              }));
              break;
            case '2.5.29.17': // Subject Alternative Name
              extension.value = item.parsedValue.altNames.map((name) => {
                if (typeof name.value === 'string') {
                  return name.value;
                }

                return '';
              });
              break;
            case '2.5.29.14': // Subject Key Identifier
              extension.value = [{}];
              extension.value[0].KeyID =
                this.toHexAndFormat(item.parsedValue.valueBlock.valueHex);
              break;
            case '2.5.29.35': // Authority Key Identifier
              extension.value = [{}];
              if (item.parsedValue.keyIdentifier) {
                extension.value[0].KeyID = this.toHexAndFormat(item
                  .parsedValue
                  .keyIdentifier
                  .valueBlock
                  .valueHex,
                );
              }
              if (item.parsedValue.authorityCertSerialNumber) {
                extension.value[0].AuthorityCertSerialNumber = this.toHexAndFormat(item
                  .parsedValue
                  .authorityCertSerialNumber
                  .valueBlock
                  .valueHex,
                );
              }
              if (item.parsedValue.authorityCertIssuer) {
                extension.value[0].AuthorityCertIssuer =
                  this.name2str(item.parsedValue.authorityCertIssuer[0].value);
              }
              break;
            case '1.3.6.1.5.5.7.1.1': // Authority Info Access
              extension.value = item.parsedValue.accessDescriptions.map((desc) => {
                const _oid = OIDS[desc.accessMethod];
                return {
                  URl: desc.accessLocation.value,
                  Method: _oid ? `${_oid} (${desc.accessMethod})` : desc.accessMethod,
                };
              });
              break;
            case '2.16.840.1.113730.1.1': // Netscape Certificate Type
              extension.value = [{
                Type: CertHelper.Extensions.netscapeCertType(item).join(', '),
              }];
              break;
            default:
              extension.value = this.toHexAndFormat(item.extnValue.valueBlock.valueHex);
          }
        } catch (error) {
          console.error(error);
          extension.value = this.toHexAndFormat(item.extnValue.valueBlock.valueHex);
        }

        extensions.push(extension);
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
      extensions,
      signature: {
        algorithm: this.prepareAlgorithm(x509.signature),
        value: this.toHexAndFormat(x509.signatureValue.valueBlock.valueHex),
      },
    };
  },

  prepareCertToImport: function prepareCertToImport(value) {
    let certBuf;

    if (regExps.base64.test(value)) { // pem
      certBuf = pvtsutils.Convert.FromBinary(window.atob(value.replace(/(-----(BEGIN|END) CERTIFICATE-----|\r|\n)/g, '')));
    } else if (/[a-f\d]/ig.test(value)) { // hex
      certBuf = pvtsutils.Convert.FromHex(value.replace(/(\r|\n|\s)/g, ''));
    } else { // der
      certBuf = pvtsutils.Convert.FromBinary(value);
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

  decoratePkcs10Subject: function decoratePkcs10Subject(pkcs10, data) {
    Object.keys(data).map((key) => {
      if ({}.hasOwnProperty.call(subjectTypesAndValues, key) && data[key]) {
        pkcs10.subject.typesAndValues.push(new pkijs.AttributeTypeAndValue({
          type: subjectTypesAndValues[key],
          value: new asn1js.PrintableString({ value: data[key] }),
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
          value: new asn1js.PrintableString({ value: data[key] }),
        }));
        certificate.subject.typesAndValues.push(new pkijs.AttributeTypeAndValue({
          type: subjectTypesAndValues[key],
          value: new asn1js.PrintableString({ value: data[key] }),
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
        value: this.addSpaceAfterSecondCharset(pvtsutils.Convert.ToHex(algorithm.raw)),
      },
    };
  },

  decodeSubjectString: function decodeSubjectString(subjectString) {
    const subjectObj = {};
    const arrSubjects = subjectString.split(/, /g);

    arrSubjects.map((sbj) => {
      const arrSubject = sbj.split('=');
      const subjectName = subjectNames[arrSubject[0]] || OIDS[arrSubject[0]] || arrSubject[0];
      const subjectValue = arrSubject[1];
      subjectObj[subjectName] = subjectValue;
      if (subjectName === 'commonName') {
        subjectObj.name = subjectValue;
      }
      return true;
    });

    return subjectObj;
  },

  Extensions: {
    keyUsage: function keyUsage(extension) {
      const usages = [];
      // parse key usage BitString
      const valueHex = new Uint8Array(pvtsutils.Convert.FromHex(extension.parsedValue.valueBlock.valueHex));
      const unusedBits = extension.parsedValue.valueBlock.unusedBits;
      let keyUsageByte1 = valueHex[0];
      let keyUsageByte2 = valueHex.byteLength > 1 ? valueHex[1] : 0;
      if (valueHex.byteLength === 1) {
        keyUsageByte1 >>= unusedBits;
        keyUsageByte1 <<= unusedBits;
      }
      if (valueHex.byteLength === 2) {
        keyUsageByte2 >>= unusedBits;
        keyUsageByte2 <<= unusedBits;
      }
      if (keyUsageByte1 & 0x80) {
        usages.push('Digital Signature');
      }
      if (keyUsageByte1 & 0x40) {
        usages.push('Non Repudiation');
      }
      if (keyUsageByte1 & 0x20) {
        usages.push('Key Encipherment');
      }
      if (keyUsageByte1 & 0x10) {
        usages.push('Data Encipherment');
      }
      if (keyUsageByte1 & 0x08) {
        usages.push('Key Agreement');
      }
      if (keyUsageByte1 & 0x04) {
        usages.push('Key Cert Sign');
      }
      if (keyUsageByte1 & 0x02) {
        usages.push('cRL Sign');
      }
      if (keyUsageByte1 & 0x01) {
        usages.push('Encipher Only');
      }
      if (keyUsageByte2 & 0x80) {
        usages.push('Decipher Only');
      }
      return usages;
    },

    netscapeCertType: function netscapeCertType(extension) {
      const usages = [];
      // parse key usage BitString
      const valueHex = pvtsutils.Convert.FromHex(extension.extnValue.valueBlock.valueHex);
      const bitString = asn1js.fromBER(valueHex).result;
      const unusedBits = bitString.valueBlock.unusedBits;
      let byte = new Uint8Array(bitString.valueBlock.valueHex)[0];
      byte >>= unusedBits;
      byte <<= unusedBits;
      /**
       * bit-0 SSL client - this cert is certified for SSL client authentication use
       * bit-1 SSL server - this cert is certified for SSL server authentication use
       * bit-2 S/MIME - this cert is certified for use by clients (New in PR3)
       * bit-3 Object Signing - this cert is certified for signing objects such as Java applets and plugins(New in PR3)
       * bit-4 Reserved - this bit is reserved for future use
       * bit-5 SSL CA - this cert is certified for issuing certs for SSL use
       * bit-6 S/MIME CA - this cert is certified for issuing certs for S/MIME use (New in PR3)
       * bit-7 Object Signing CA - this cert is certified for issuing certs for Object Signing (New in PR3)
       */
      if (byte & 0x80) {
        usages.push('SSL client');
      }
      if (byte & 0x40) {
        usages.push('SSL server');
      }
      if (byte & 0x20) {
        usages.push('S/MIME');
      }
      if (byte & 0x10) {
        usages.push('Object Signing');
      }
      if (byte & 0x08) {
        usages.push('Reserved');
      }
      if (byte & 0x04) {
        usages.push('SSL CA');
      }
      if (byte & 0x02) {
        usages.push('S/MIME CA');
      }
      if (byte & 0x01) {
        usages.push('Object Signing CA');
      }
      return usages;
    },
  },
};

export default CertHelper;
