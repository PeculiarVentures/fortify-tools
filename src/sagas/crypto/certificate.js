import { put } from 'redux-saga/effects';
import { ErrorActions } from '../../actions/state';
import { CertHelper } from '../../helpers';
import * as Key from './key';

export function* certificateGetIDs(crypto) {
  if (crypto) {
    return yield crypto.certStorage.keys();
  }
  return [];
}

export function* certificateSet(crypto, cert) {
  return yield crypto.certStorage.setItem(cert);
}

export function* certificateGet(crypto, id) {
  try {
    return yield crypto.certStorage.getItem(id);
  } catch (error) {
    console.error(`Cannot get certificate '${id}' from provider. ${error.message}`);
    // yield put(ErrorActions.error(error));
    return false;
  }
}

export function* certificateExport(crypto, cert, format = 'pem') {
  return yield crypto.certStorage.exportCert(format, cert);
}

function* certificateGatPrivateKeyID(crypto, cert) {
  const publicKeyIDsha1 = yield Key.publicKeyThumbprint(crypto, cert.publicKey, 'SHA-1');
  const publicKeyIDsha256 = yield Key.publicKeyThumbprint(crypto, cert.publicKey, 'SHA-256');
  const keyIDs = yield Key.keyGetIDs(crypto);
  for (const keyID of keyIDs) {
    const idPart = keyID.split('-')[2];
    if (publicKeyIDsha1 === idPart || publicKeyIDsha256 === idPart) {
      return keyID;
    }
  }
  return null;
}

export function* certificateHasPrivateKey(crypto, cert) {
  const keyID = yield certificateGatPrivateKeyID(crypto, cert);
  return !!keyID;
}

export function* certificateGetPrivateKey(crypto, cert) {
  const keyID = yield certificateGatPrivateKeyID(crypto, cert);
  return yield Key.keyGet(crypto, keyID);
}

export function* certificateImport(crypto, data) {
  const { raw, usages, type } = data;
  const algorithm = () => Object.assign({}, data.algorithm);
  let cert;

  switch (type) { // check certificate request data
    case 'request':
      cert = yield crypto.certStorage.importCert('request', raw, algorithm(), usages);
      break;
    case 'x509':
      cert = yield crypto.certStorage.importCert('x509', raw, algorithm(), usages);
      break;
    default:
      throw new Error(`Unsupported type '${type}' of certificate storage item`);
  }
  return cert;
}

export function* certificateCreate(crypto, data) {
  // const data = {
  //   commonName: 'My cert 6',
  //   hostName: 'domain',
  //   organization: 'OOO Name 4',
  //   organizationUnit: '123',
  //   locality: 'aa3',
  //   country: 'pd3',
  //   state: 'state 1',
  //   keyInfo: {
  //     extractable: false,
  //     algorithm: {
  //       name: 'RSASSA-PKCS1-v1_5',
  //       hash: 'SHA-256',
  //       modulusLength: 1024,
  //       publicExponent: new Uint8Array([1, 0, 1]),
  //     },
  //     usages: ['sign', 'verify'],
  //   },
  // };
  const { extractable, usages } = data.keyInfo;
  const algorithm = (() => Object.assign({
    publicExponent: new Uint8Array([1, 0, 1]),
  }, data.keyInfo.algorithm))();
  const algorithmHash = algorithm.hash;

  const {
    publicKey,
    privateKey,
  } = yield crypto.subtle.generateKey(algorithm, extractable, usages);

  pkijs.setEngine('Fortify', crypto, crypto.subtle);
  let pkcs10 = new pkijs.CertificationRequest();

  pkcs10.version = 0;
  pkcs10 = CertHelper.decoratePkcs10Subject(pkcs10, data);
  pkcs10.attributes = [];

  yield pkcs10.subjectPublicKeyInfo.importKey(publicKey);

  const hash = yield crypto.subtle.digest(
    { name: algorithmHash },
    pkcs10.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex,
  );
  const attribute = new pkijs.Attribute({
    type: '1.2.840.113549.1.9.14',
    values: [(new pkijs.Extensions({
      extensions: [
        new pkijs.Extension({
          extnID: '2.5.29.14',
          critical: false,
          extnValue: (new asn1js.OctetString({ valueHex: hash })).toBER(false),
        }),
      ],
    })).toSchema()],
  });

  pkcs10.attributes.push(attribute);
  // sign
  yield pkcs10.sign(privateKey, privateKey.algorithm.hash ? privateKey.algorithm.hash.name : 'SHA-1');

  // Fix parameters for algorithms
  if (!pkcs10.signatureAlgorithm.algorithmParams) {
    pkcs10.signatureAlgorithm.algorithmParams = new asn1js.Null();
  }

  const csrBuffer = pkcs10.toSchema().toBER(false);
  const importCert = yield crypto.certStorage.importCert('request', csrBuffer, algorithm, usages);
  const certId = yield certificateSet(crypto, importCert);

  yield Key.keySet(crypto, privateKey);
  yield Key.keySet(crypto, publicKey);

  return certId;
}

export function* CMSCreate(crypto, data) {
  const algorithm = (() => Object.assign({
    publicExponent: new Uint8Array([1, 0, 1]),
  }, data.keyInfo.algorithm))();
  const usages = ['sign', 'verify'];

  // Generate key
  const {
    publicKey,
    privateKey,
  } = yield crypto.subtle.generateKey(algorithm, false, usages);

  // Generate new certificate
  pkijs.setEngine('Fortify', crypto, crypto.subtle);

  let certificate = new pkijs.Certificate();
  certificate.version = 2;
  certificate.serialNumber = new asn1js.Integer({ value: 1 });

  certificate = CertHelper.decorateCertificateSubject(certificate, data);

  certificate.notBefore.value = new Date();
  certificate.notAfter.value = new Date();
  certificate.notAfter.value.setFullYear(certificate.notAfter.value.getFullYear() + 1);

  certificate.extensions = [];

  // "KeyUsage" extension
  const bitArray = new ArrayBuffer(1);
  const bitView = new Uint8Array(bitArray);
  bitView[0] |= 0x80; // digitalSignature
  const keyUsage = new asn1js.BitString({ valueHex: bitArray });

  certificate.extensions.push(
    new pkijs.Extension({
      extnID: '2.5.29.15',
      critical: false,
      extnValue: keyUsage.toBER(false),
      parsedValue: keyUsage, // Parsed value for well-known extensions
    }),
  );

  yield certificate.subjectPublicKeyInfo.importKey(publicKey);
  yield certificate.sign(privateKey, 'SHA-256');

  // Add null param for algorithms
  if (!certificate.signature.algorithmParams) {
    certificate.signature.algorithmParams = new asn1js.Null();
  }
  if (!certificate.signatureAlgorithm.algorithmParams) {
    certificate.signatureAlgorithm.algorithmParams = new asn1js.Null();
  }

  // Convert certificate to DER
  const derCert = certificate.toSchema(true).toBER(false);
  const importCert = yield crypto.certStorage.importCert('x509', derCert, algorithm, usages);
  const certId = yield certificateSet(crypto, importCert);

  yield Key.keySet(crypto, privateKey);
  yield Key.keySet(crypto, publicKey);

  return certId;
}

export function* certificateRemove(crypto, id) {
  yield crypto.certStorage.removeItem(id);
}

export function* certificateThumbprint(crypto, raw) {
  return yield crypto.subtle.digest('SHA-256', raw);
}
