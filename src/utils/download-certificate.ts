import { Convert } from "pvtsutils";
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

async function base64ToPEM(base64: string) {
  const req = new Pkcs10CertificateRequest(base64);
  const thumbprintBuffer = await crypto.subtle.digest("SHA-1", req.rawData);
  const thumbprint = Convert.ToHex(thumbprintBuffer);
  const pem = req.toString("pem");

  return {
    thumbprint,
    pem,
  };
}

export async function downloadCertificate(
  certBase64: string,
  type: "x509" | "csr"
) {
  switch (type) {
    case "x509": {
      const cert = new X509Certificate(certBase64);
      const thumbprintBuffer = await cert.getThumbprint();
      const thumbprint = Convert.ToHex(thumbprintBuffer);
      const pem = cert.toString("pem");

      downloadFile(`${thumbprint}.cer`, pem);
      break;
    }
    case "csr": {
      const { thumbprint, pem } = await base64ToPEM(certBase64);

      downloadFile(`${thumbprint}.csr`, pem);
      break;
    }
    default:
      throw new Error(`Unsupported certificate type: ${type}`);
  }
}
