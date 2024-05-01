import { ICertificate } from "@peculiar/fortify-client-core";
export interface CertificateProps extends ICertificate {
  id?: string;
  label?: string;
}
