export const CertificateKeyUsageExtensions = {
  // http://oid-info.com/get/1.3.6.1.5.5.7.3.4
  "id-kp-emailProtection": "1.3.6.1.5.5.7.3.4",
  // http://oid-info.com/get/1.3.6.1.5.5.7.3.3
  "id-kp-codeSigning": "1.3.6.1.5.5.7.3.3",
  // http://oid-info.com/get/1.3.6.1.5.5.7.3.36
  "id-kp-documentSigning": "1.3.6.1.5.5.7.3.36",
  // http://oid-info.com/get/1.3.6.1.5.5.7.3.2
  "id-kp-clientAuth": "1.3.6.1.5.5.7.3.2",
  // http://oid-info.com/get/1.3.6.1.5.5.7.3.1
  "id-kp-serverAuth": "1.3.6.1.5.5.7.3.1",
};

export type ICertificateKeyUsageExtensions =
  keyof typeof CertificateKeyUsageExtensions;
