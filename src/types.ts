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
  CN: string;
  E?: string;
  O?: string;
  OU?: string;
  L?: string;
  ST?: string;
  C?: string;
  G?: string;
  SN?: string;
}

export type CertificateAlgorithmProps = {
  signature: ESignatureAlgorithm;
  hash: EHashAlgorithm;
};

export type CertificateType = "x509" | "csr";
