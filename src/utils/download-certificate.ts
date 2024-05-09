import { Pkcs10CertificateRequest, X509Certificate } from "@peculiar/x509";

function downloadFile(name: string, data: string | ArrayBuffer) {
  const blob = new Blob([data], { type: "application/x-x509-ca-cert" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = name;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function downloadCertificate(
  label: string,
  certBase64: string,
  type: "x509" | "csr"
) {
  switch (type) {
    case "x509": {
      const cert = new X509Certificate(certBase64);
      const pem = cert.toString("pem");

      downloadFile(`${label}.cer`, pem);
      break;
    }
    case "csr": {
      const req = new Pkcs10CertificateRequest(certBase64);
      const pem = req.toString("pem");

      downloadFile(`${label}.csr`, pem);
      break;
    }
    default:
      throw new Error(`Unsupported certificate type: ${type}`);
  }
}
