export const APP_CONTACT_SUPPORT_URL = "mailto:support@fortifyapp.com";
export const APP_FORTIFY_DOWLOAD_APP_URL = "https://fortifyapp.com";

// https://www.iana.org/assignments/media-types/media-types.xhtml
export const APP_CERTIFICATE_ALLOWED_MIMES = {
  "application/pem-certificate-chain": [".pem"],
  "application/pkix-cert": [".cer", ".der"],
  "application/x-x509-ca-cert": [".crt"],
  "application/pkcs10": [".csr"],
};

export const APP_CERTIFICATE_MAX_SIZE_BYTES = 5242880; // 5mb in bytes
