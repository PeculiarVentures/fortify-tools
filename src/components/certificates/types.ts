export type CertificatesFetchingStatus = "pending" | "resolved" | "rejected";

export interface CertificatesFetchingType {
  connectionClientUpdate?: CertificatesFetchingStatus;
  connectionDetect?: CertificatesFetchingStatus;
  connectionSupport?: CertificatesFetchingStatus;
  connectionApprove?: CertificatesFetchingStatus;
  providers?: CertificatesFetchingStatus;
  certificates?: CertificatesFetchingStatus;
}
