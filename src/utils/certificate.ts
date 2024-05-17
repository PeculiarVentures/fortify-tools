import { Convert } from "pvtsutils";
import { Pkcs10CertificateRequest, X509Certificate } from "@peculiar/x509";

export function certificateRawToPem(raw: ArrayBuffer, type: "x509" | "csr") {
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
