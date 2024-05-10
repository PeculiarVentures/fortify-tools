import { Pkcs10CertificateRequest, X509Certificate } from "@peculiar/x509";

export function copyCertificate(certBase64: string, type: "x509" | "csr") {
  let pem;
  switch (type) {
    case "x509": {
      const cert = new X509Certificate(certBase64);
      pem = cert.toString("pem");
      break;
    }
    case "csr": {
      const req = new Pkcs10CertificateRequest(certBase64);
      pem = req.toString("pem");
      break;
    }
    default:
      throw new Error(`Unsupported certificate type: ${type}`);
  }
  return pem;
}
