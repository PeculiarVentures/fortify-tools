import { Convert } from "pvtsutils";
import { Pkcs10CertificateRequest, X509Certificate } from "@peculiar/x509";
import { Download } from "@peculiar/certificates-viewer";

export function downloadCertificate(
  label: string,
  certRaw: ArrayBuffer,
  type: "x509" | "csr"
) {
  switch (type) {
    case "x509": {
      const cert = new X509Certificate(Convert.ToBase64(certRaw));
      const pem = cert.toString("pem");

      Download.cert.asPEM(pem, label);
      break;
    }
    case "csr": {
      const req = new Pkcs10CertificateRequest(Convert.ToBase64(certRaw));
      const pem = req.toString("pem");

      Download.csr.asPEM(pem, label);
      break;
    }
    default:
      throw new Error(`Unsupported certificate type: ${type}`);
  }
}
