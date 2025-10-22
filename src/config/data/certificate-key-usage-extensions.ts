import { ExtendedKeyUsage } from '@peculiar/x509';

export const certificateKeyUsageExtensions = {
  emailProtection: ExtendedKeyUsage.emailProtection,
  codeSigning: ExtendedKeyUsage.codeSigning,
  // http://oid-info.com/get/1.3.6.1.5.5.7.3.36
  documentSigning: '1.3.6.1.5.5.7.3.36',
  clientAuth: ExtendedKeyUsage.clientAuth,
  serverAuth: ExtendedKeyUsage.serverAuth,
};

export type TCertificateExtendedKeyUsages
  = keyof typeof certificateKeyUsageExtensions;
