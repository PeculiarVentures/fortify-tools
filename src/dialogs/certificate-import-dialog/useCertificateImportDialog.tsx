import React from 'react';
import { createDialog, useToast } from '@peculiar/react-components';
import { Pkcs10CertificateRequest, X509Certificate } from '@peculiar/x509';
import { useTranslation } from 'react-i18next';
import { useLockBodyScroll } from 'react-use';
import type { TCertificateType } from '../../types';
import { CertificateImportDialog } from '../../components/certificate-import-dialog';
import { useDialogsContext } from '../dialogs-context';

export interface ICertificateImportDialogOpenParams {
  onSuccess: (providerId: string) => void;
}

export const useCertificateImportDialog = createDialog<ICertificateImportDialogOpenParams>(
  ({ openParams, close }) => {
    const { onSuccess } = openParams;
    const { fortifyClient, providers, currentProviderId } = useDialogsContext();
    const { addToast } = useToast();
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState(false);
    const [certificatePem, setCertificatePem] = React.useState('');
    const [isTextAreaError, setIsTextAreaError] = React.useState(false);
    const certificate = React.useRef<Pkcs10CertificateRequest | X509Certificate | null>(null);
    const certificateType = React.useRef<TCertificateType | undefined>(undefined);
    const selectedProviderId = React.useRef(currentProviderId);

    React.useEffect(() => {
      selectedProviderId.current = currentProviderId;
    }, [currentProviderId]);

    useLockBodyScroll(true);

    const showInvalidDataToast = () => {
      addToast({
        message: t('certificates.dialog.import.certificate.error.invalid-data'),
        variant: 'wrong',
        disableIcon: true,
        isClosable: true,
      });
    };

    const clearCertificate = () => {
      setCertificatePem('');
      certificate.current = null;
      certificateType.current = undefined;
    };

    const handleCertificateImport = async () => {
      if (!fortifyClient || !certificate.current) {
        return;
      }

      if (!selectedProviderId.current) {
        selectedProviderId.current = currentProviderId;
      }

      const providerId = selectedProviderId.current as string;

      setIsLoading(true);

      try {
        const provider = await fortifyClient.getProviderById(providerId);

        const cert = await provider.certStorage.importCert(
          certificateType.current === 'csr' ? 'request' : 'x509',
          certificate.current.rawData,
          {
            ...certificate.current.publicKey.algorithm,
            ...certificate.current.signatureAlgorithm,
          },
          ['verify'],
        );

        await provider.certStorage.setItem(cert);

        onSuccess(providerId);
        close();
        addToast({
          message: t('certificates.dialog.import.success-message'),
          variant: 'success',
          disableIcon: true,
          isClosable: true,
        });
      } catch {
        addToast({
          message: t('certificates.dialog.import.failure-message'),
          variant: 'wrong',
          disableIcon: true,
          isClosable: true,
        });
      }

      setIsLoading(false);
    };

    const handleDropAccepted = (fileContent: ArrayBuffer, extension: string, fileType: string) => {
      try {
        if (extension === 'csr' || fileType === 'application/pkcs10') {
          const certr = new Pkcs10CertificateRequest(fileContent);

          certificateType.current = 'csr';
          certificate.current = certr;
          setCertificatePem(certr.toString('pem'));
        } else {
          const cert = new X509Certificate(fileContent);

          certificateType.current = 'x509';
          certificate.current = cert;
          setCertificatePem(cert.toString('pem'));
        }
      } catch {
        showInvalidDataToast();
        clearCertificate();
      }

      setIsTextAreaError(false);
    };

    const handleTextAreaBlur = () => {
      if (!certificatePem?.length) {
        setIsTextAreaError(true);

        return;
      }

      try {
        const cert = new X509Certificate(certificatePem);

        certificateType.current = 'x509';
        certificate.current = cert;
        setCertificatePem(cert.toString('pem'));
        setIsTextAreaError(false);

        return;
      } catch {
        //
      }

      try {
        const certr = new Pkcs10CertificateRequest(certificatePem);

        certificateType.current = 'csr';
        certificate.current = certr;
        setCertificatePem(certr.toString('pem'));
        setIsTextAreaError(false);

        return;
      } catch {
        //
      }

      setIsTextAreaError(true);
    };

    if (!fortifyClient) {
      return null;
    }

    return (
      <CertificateImportDialog
        certificate={certificatePem}
        isTextAreaError={isTextAreaError}
        providers={providers}
        currentProviderId={currentProviderId}
        loading={isLoading}
        onTextAreaChange={(value) => {
          setCertificatePem(value);
          setIsTextAreaError(false);
        }}
        onTextAreaBlur={handleTextAreaBlur}
        onDropAccepted={handleDropAccepted}
        onDropError={showInvalidDataToast}
        onDropRejected={(msg) => {
          addToast({
            message: msg,
            variant: 'wrong',
            disableIcon: true,
            isClosable: true,
          });
          clearCertificate();
        }}
        onDialogClose={close}
        onProviderSelect={(id) => {
          selectedProviderId.current = id;
        }}
        onImportButtonClick={handleCertificateImport}
        onClearButtonClick={() => {
          setIsTextAreaError(false);
          clearCertificate();
        }}
      />
    );
  },
);
