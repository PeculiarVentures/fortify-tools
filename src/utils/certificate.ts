import { Pkcs10CertificateRequest, X509Certificate } from "@peculiar/x509";

import {
  CertificateProps,
  CertificateSubjectProps,
  CertificateType,
} from "../types";

export function certificateRawToPem(raw: ArrayBuffer, type: CertificateType) {
  let pem;
  switch (type) {
    case "x509": {
      const cert = new X509Certificate(raw);
      pem = cert.toString("pem");
      break;
    }
    case "csr": {
      const req = new Pkcs10CertificateRequest(raw);
      pem = req.toString("pem");
      break;
    }
    default:
      throw new Error(`Unsupported certificate type: ${type}`);
  }
  return pem;
}

export function certificateSubjectToString(
  attrs: CertificateSubjectProps
): string {
  const parts: string[] = [];

  for (const key in attrs) {
    const val = attrs[key as keyof CertificateSubjectProps];
    val?.length && parts.push(`${key}=${val}`);
  }

  return parts.join(", ");
}

export function getCertificateName(certificate: CertificateProps) {
  if (!certificate.subject) {
    return certificate.subjectName;
  }
  const subject = Object.fromEntries(
    Object.entries(certificate.subject).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value, // Take the first element if value is an array
    ])
  );
  const { G, CN, SN, E } = subject as unknown as CertificateSubjectProps;

  // Return Common Name if present.
  if (CN) {
    return CN;
  }

  // Return Given Name + Surname if both present.
  if (G && SN) {
    return `${G} ${SN}`;
  }

  // Return Email if none of the above present
  if (E) {
    return E;
  }

  return certificate.subjectName;
}
