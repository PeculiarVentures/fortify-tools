import { Convert } from "pvtsutils";
import { Pkcs10CertificateRequest, X509Certificate } from "@peculiar/x509";
import { CertificateSubjectProps, CertificateType } from "../types";

export function certificateRawToPem(raw: ArrayBuffer, type: CertificateType) {
  let pem;
  switch (type) {
    case "x509": {
      const cert = new X509Certificate(Convert.ToBase64(raw));
      pem = cert.toString("pem");
      break;
    }
    case "csr": {
      const req = new Pkcs10CertificateRequest(Convert.ToBase64(raw));
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
