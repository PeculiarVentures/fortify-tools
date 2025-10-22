import {
  ICertificate,
  EHashAlgorithm,
  ESignatureAlgorithm,
} from '@peculiar/fortify-client-core';

export interface ICertificateProps extends ICertificate {
  id?: string;
  label?: string;
}
export interface ICertificateSubjectProps {
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

export interface ICertificateAlgorithmProps {
  signature: ESignatureAlgorithm;
  hash: EHashAlgorithm;
}

export type TCertificateType = 'x509' | 'csr';
