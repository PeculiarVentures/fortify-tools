import {
  ICertificate,
  EHashAlgorithm,
  ESignatureAlgorithm,
} from "@peculiar/fortify-client-core";
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

export type CertificateAlgorithmProps = {
  signature: ESignatureAlgorithm;
  hash: EHashAlgorithm;
};

export type CertificateType = "x509" | "csr";
