import {
  Pkcs10CertificateRequest,
  X509Certificate,
  Name,
} from '@peculiar/x509';
import {
  ICertificateProps,
  ICertificateSubjectProps,
  TCertificateType,
} from '../types';

export function certificateRawToPem(raw: ArrayBuffer, type: TCertificateType) {
  let pem;

  switch (type) {
    case 'x509': {
      const cert = new X509Certificate(raw);

      pem = cert.toString('pem');

      break;
    }

    case 'csr': {
      const req = new Pkcs10CertificateRequest(raw);

      pem = req.toString('pem');

      break;
    }

    default:
      throw new Error(`Unsupported certificate type: ${type}`);
  }

  return pem;
}

export function certificateSubjectToString(
  attrs: ICertificateSubjectProps,
): string {
  const parts: string[] = [];

  for (const key in attrs) {
    const val = attrs[key as keyof ICertificateSubjectProps];

    if (val?.length) {
      parts.push(`${key}=${val}`);
    }
  }

  return parts.join(', ');
}

export function getCertificateSubject(subjectString: string) {
  const jsonName = new Name(subjectString).toJSON();

  return jsonName.reduce<Record<string, string[]>>((result, currentValue) => {
    Object.keys(currentValue).forEach((keyName) => {
      if (!result[keyName]) {
        result[keyName] = currentValue[keyName];
      } else {
        result[keyName].push(...currentValue[keyName]);
      }
    });

    return result;
  }, {});
}

export function getCertificateName(certificate: ICertificateProps) {
  if (!certificate.subject) {
    return certificate.subjectName;
  }

  const {
    G, CN, SN, E,
  } = certificate.subject;

  // Return Common Name if present.
  if (CN) {
    return CN[0];
  }

  // Return Given Name + Surname if both present.
  if (G && SN) {
    return `${G[0]} ${SN[0]}`;
  }

  // Return Email if none of the above present
  if (E) {
    return E[0];
  }

  return certificate.subjectName;
}
