import { Convert } from "pvtsutils";
import {
  Pkcs10CertificateRequest,
  X509Certificate,
  PemConverter,
} from "@peculiar/x509";

import { CertificateSubjectProps, CertificateType } from "../types";

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

export const isBase64 = (value: string) => {
  try {
    window.atob(value);
    return true;
  } catch (error) {
    return false;
  }
};

function base64Clarify(base64: string) {
  const base64Re =
    /-----BEGIN [^-]+-----([A-Za-z0-9+/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+/=\s]+)====/;
  const execArray = base64Re.exec(base64);

  return execArray ? execArray[1] || execArray[2] : base64;
}

export const isHex = (value: string) =>
  /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/.test(value);

export function certificateConvertRaw(cert: string | ArrayBuffer): ArrayBuffer {
  let certificate = cert;

  if (typeof certificate !== "string") {
    certificate = Convert.ToBinary(cert as BufferSource);
  }

  if (PemConverter.isPem(certificate)) {
    return PemConverter.decode(certificate)[0];
  }

  if (isHex(certificate)) {
    return Convert.FromHex(certificate);
  }

  const base64 = base64Clarify(certificate);

  if (isBase64(base64)) {
    return Convert.FromBase64(base64);
  }

  if (Convert.isBase64Url(certificate)) {
    return Convert.FromBase64Url(certificate);
  }

  return Convert.FromBinary(certificate);
}
