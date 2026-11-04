import React from 'react';
import type { FortifyAPI } from '@peculiar/fortify-client-core';
import { createDialog } from '@peculiar/react-components';
import { X509Certificate } from '@peculiar/x509';
import { cloneDeep } from 'lodash-es';
import { useLockBodyScroll } from 'react-use';
import type { ICertificateProps } from '../../types';
import { CertificateViewerDialog } from '../../components/certificate-viewer-dialog';
import { getCertificateSubject } from '../../utils/certificate';
import { useCloseOnProviderRemoved, useDialogsContext } from '../dialogs-context';

export interface ICertificateViewerDialogOpenParams {
  providerId: string;
  certificate: ICertificateProps;
}

/**
 * Returns the certificate with its chain when the provider can build one,
 * otherwise only the certificate.
 */
async function getCertificateWithChain(
  certificate: ICertificateProps,
  fortifyClient: FortifyAPI | null,
  currentProviderId?: string,
): Promise<ICertificateProps[]> {
  try {
    if (fortifyClient && currentProviderId && certificate.type === 'x509') {
      const localProvider = await fortifyClient.getProviderById(currentProviderId);

      const certificateCopy = cloneDeep(certificate);

      certificateCopy.raw = null as unknown as ArrayBuffer;

      const chain = await localProvider.certStorage.getChain(certificateCopy);

      if (chain.length > 1) {
        return chain.map((chainItem) => {
          const cert = new X509Certificate(chainItem.value);

          return {
            raw: cert.rawData,
            subjectName: cert.subject,
            subject: getCertificateSubject(cert.subject),
            type: 'x509',
            index: cert.serialNumber,
            issuerName: cert.issuer,
            notBefore: cert.notBefore,
            notAfter: cert.notAfter,
            serialNumber: cert.serialNumber,
            publicKey: cert.publicKey as unknown as CryptoKey,
            providerID: localProvider.id,
          };
        });
      }
    }
  } catch {
    //
  }

  return [certificate];
}

export const useCertificateViewerDialog = createDialog<ICertificateViewerDialogOpenParams>(
  ({ openParams, close }) => {
    const { certificate, providerId } = openParams;
    const { fortifyClient, currentProviderId } = useDialogsContext();
    const provider = useCloseOnProviderRemoved(providerId, close);
    // The dialog shows up once the chain is loaded, as before the createDialog refactor.
    const [certificates, setCertificates] = React.useState<ICertificateProps[] | null>(null);
    const isVisible = Boolean(provider && certificates);

    React.useEffect(() => {
      let isCurrent = true;

      void getCertificateWithChain(certificate, fortifyClient, currentProviderId).then((result) => {
        if (isCurrent) {
          setCertificates(result);
        }
      });

      return () => {
        isCurrent = false;
      };
    }, [certificate, fortifyClient, currentProviderId]);

    useLockBodyScroll(isVisible);

    if (!isVisible || !certificates) {
      return null;
    }

    return (
      <CertificateViewerDialog
        certificates={certificates}
        onClose={close}
      />
    );
  },
);
