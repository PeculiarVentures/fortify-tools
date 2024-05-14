export interface ICertificateKeyProperties {
  name: string;
  hash?: string[];
  modulusLength: string[] | number[];
  publicExponent?: number[];
}

export const certificateKeyProperties = [
  {
    name: "RSASSA-PKCS1-v1_5",
    hash: ["SHA-1", "SHA-512"],
    modulusLength: [2048, 3072, 4096],
    publicExponent: [3, 65537],
  },
  {
    name: "RSA-PSS",
    hash: ["SHA-1", "SHA-512"],
    modulusLength: [2048, 3072, 4096],
    publicExponent: [3, 65537],
  },
  {
    name: "ECDSA",
    modulusLength: ["P-256", "P-384", "P-521"],
  },
];
