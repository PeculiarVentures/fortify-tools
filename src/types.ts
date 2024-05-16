import { ICertificate } from "@peculiar/fortify-client-core";
export interface CertificateProps extends ICertificate {
  id?: string;
  label?: string;
}
export interface CertificateSubjectProps {
  commonName: string;
  emailAddress?: string;
  organizationName?: string;
  organizationalUnitName?: string;
  localityName?: string;
  stateOrProvinceName?: string;
  countryName?: string;
}

export type CertificateAlgorithmProps =
  | RsaHashedKeyGenParams
  | Partial<EcKeyGenParams>;

export type CertificateType = "x509" | "csr";
