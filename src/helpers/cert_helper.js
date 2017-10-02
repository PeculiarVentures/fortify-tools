import * as asn1js from 'asn1js';
import Certificate from 'pkijs/build/Certificate';
import CertificationRequest from 'pkijs/build/CertificationRequest';
import AttributeTypeAndValue from 'pkijs/build/AttributeTypeAndValue';
import moment from 'moment';
import UUID from 'uuid';
import { Convert } from 'pvtsutils';
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
  name2str: function name2str(name, splitter) {
    splitter = splitter || ',';
    const res = [];
    name.typesAndValues.forEach((typeValue) => {
      const type = typeValue.type;
      const oidValue = OID[type.toString()];
      const oidName = oidValue && oidValue.short ? oidValue.short : type.toString();
      res.push(`${oidName}=${typeValue.value.valueBlock.value}`);
    });
    return res.join(`${splitter} `);
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
    const x509 = new Certificate({ schema: asn1.result });
    const json = x509.toJSON();

    // Public Key
    const publicKey = {
      algorithm: {
        name: json.subjectPublicKeyInfo.kty,
      },
      value: this.addSpaceAfterSecondCharset(
        Convert.ToHex(x509.subjectPublicKeyInfo.subjectPublicKey.valueBeforeDecode),
      ),
    };

    const { modulus, publicExponent } = x509.subjectPublicKeyInfo.parsedKey;
    // Add params for Public key
    if (publicKey.algorithm.name === 'RSA') {
      publicKey.algorithm.modulusBits = modulus.valueBlock.valueHex.byteLength << 3;
      publicKey.algorithm.publicExponent = publicExponent.valueBlock.valueHex.byteLength === 3
        ? 65537
        : 3;
    } else if (publicKey.algorithm.name === 'EC') {
      publicKey.algorithm.namedCurve = json.subjectPublicKeyInfo.crv;
    }

    // Extensions
    const extensions = [];

    if (json.extensions) {
      for (const item of json.extensions) {
        const extension = {
          name: OIDS[item.extnID] || item.extnID,
          oid: item.extnID,
          critical: item.critical || false,
        };

        // parse extensions
        try {
          switch (item.extnID) {
            case '2.5.29.15': // key usage
              extension.value = CertHelper.Extensions.keyUsage(item);
              break;
            case '2.5.29.37': // Extended Key Usage
              extension.value = item.parsedValue.keyPurposes.map(oid => OIDS[oid] || oid);
              break;
            case '2.5.29.31': // CRL Distribution Points
              extension.value = item.parsedValue;
              break;
            case '2.5.29.17': // Subject Alternative Name
              extension.value = item.parsedValue.altNames.map(name => name.value);
              break;
            case '2.5.29.35': // Authority Key Identifier
              extension.value = {};
              if (item.parsedValue.keyIdentifier) {
                extension.value.keyIdentifier = item.parsedValue.keyIdentifier.valueBlock.valueHex.toUpperCase();
              }
              if (item.parsedValue.authorityCertSerialNumber) {
                extension.value.authorityCertSerialNumber = item.parsedValue.authorityCertSerialNumber.valueBlock.valueHex.toUpperCase();
              }
              if (item.parsedValue.authorityCertIssuer) {
                extension.value.authorityCertIssuer = this.name2str(item.parsedValue.authorityCertIssuer[0].value);
              }
              break;
            case '1.3.6.1.5.5.7.1.1': // Authority Info Access
              console.log(item);
              extension.value = item.parsedValue.accessDescriptions.map((desc) => {
                return {
                  location: desc.accessLocation.value,
                  method: OIDS[desc.accessMethod] || desc.accessMethod,
                };
              });
              break;
            default:
              extension.value = this.addSpaceAfterSecondCharset(item.extnValue.valueBlock.valueHex);
          }
        } catch (error) {
          console.error(error);
          extension.value = this.addSpaceAfterSecondCharset(item.extnValue.valueBlock.valueHex);
        }

        extensions.push(extension);
      }
    }

    return {
      version: x509.version,
      serialNumber: this.addSpaceAfterSecondCharset(json.serialNumber.valueBlock.valueHex),
      notBefore: x509.notBefore.value,
      notAfter: x509.notAfter.value,
      issuerName: this.name2str(x509.issuer),
      subjectName: this.name2str(x509.subject),
      publicKey,
      extensions,
      signature: {
        algorithm: this.prepareAlgorithm(json.signature),
        value: this.addSpaceAfterSecondCharset(json.signatureValue.valueBlock.valueHex),
      },
    };
  },

  prepareCertToImport: function prepareCertToImport(value) {
    let certBuf;

    if (regExps.base64.test(value)) { // pem
      certBuf = Convert.FromBinary(window.atob(value.replace(/(-----(BEGIN|END) CERTIFICATE-----|\r|\n)/g, '')));
    } else if (/[a-f\d]/ig.test(value)) { // hex
      certBuf = Convert.FromHex(value.replace(/(\r|\n|\s)/g, ''));
    } else { // der
      certBuf = Convert.FromBinary(value);
    }

    const asn1 = asn1js.fromBER(certBuf);
    if (asn1.offset > 0) {
      let cert = '';
      let type = '';

      try {
        cert = new Certificate({ schema: asn1.result });
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
        pkcs10.subject.typesAndValues.push(new AttributeTypeAndValue({
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
        certificate.issuer.typesAndValues.push(new AttributeTypeAndValue({
          type: subjectTypesAndValues[key],
          value: new asn1js.PrintableString({ value: data[key] }),
        }));
        certificate.subject.typesAndValues.push(new AttributeTypeAndValue({
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
    // console.log('sdsds', data);
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
        thumbprint: this.addSpaceAfterSecondCharset(Convert.ToHex(thumbprint)),
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
        value: this.addSpaceAfterSecondCharset(Convert.ToHex(raw)),
      },
      signature: {
        algorithm: algorithm.name,
        hash: algorithm.hash.name,
        value: this.addSpaceAfterSecondCharset(Convert.ToHex(algorithm.raw)),
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
      const valueHex = new Uint8Array(Convert.FromHex(extension.parsedValue.valueBlock.valueHex));
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
  },
};

export default CertHelper;
