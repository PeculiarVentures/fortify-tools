import React, { useRef } from 'react';
import { IProviderInfo, FortifyAPI } from '@peculiar/fortify-client-core';
import { Pkcs10CertificateRequest, X509Certificate } from '@peculiar/x509';
import { useToast } from '@peculiar/react-components';
import { useTranslation } from 'react-i18next';
import { useLockBodyScroll } from 'react-use';
import { CertificateImportDialog } from '../../components/certificate-import-dialog';
import { TCertificateType } from '../../types';

interface IUseCertificateImportDialogInitialParams {
  providers: IProviderInfo[];
  currentProviderId?: string;
  fortifyClient: FortifyAPI | null;
  onSuccess: (providerId: string) => void;
}

export function useCertificateImportDialog(
  props: IUseCertificateImportDialogInitialParams,
) {
  const {
    providers, currentProviderId, fortifyClient, onSuccess,
  } = props;
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const certificate = React.useRef<
    Pkcs10CertificateRequest | X509Certificate | null
  >(null);
  const certificateType = React.useRef<TCertificateType | undefined>(undefined);

  const [certificatePem, setCertificatePem] = React.useState('');
  const [isTextAreaError, setIsTextAreaError] = React.useState(false);

  const localCurrentProviderId = useRef(currentProviderId);

  React.useEffect(() => {
    localCurrentProviderId.current = currentProviderId;
  }, [currentProviderId]);

  const clearCertificate = () => {
    setCertificatePem('');
    certificate.current = null;
    certificateType.current = undefined;
  };

  const handleClose = () => {
    clearCertificate();
    setIsTextAreaError(false);
    setIsOpen(false);
  };

  const handleCertificateImport = async () => {
    if (!fortifyClient || !certificate.current) {
      return;
    }

    if (!localCurrentProviderId?.current) {
      localCurrentProviderId.current = currentProviderId;
    }

    setIsLoading(true);
    try {
      const provider = await fortifyClient.getProviderById(
        localCurrentProviderId.current as string,
      );

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

      onSuccess(localCurrentProviderId.current as string);
      handleClose();
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

  const onDropAccepted = (
    fileContent: ArrayBuffer,
    extension: string,
    fileType: string,
  ) => {
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
      addToast({
        message: t('certificates.dialog.import.certificate.error.invalid-data'),
        variant: 'wrong',
        disableIcon: true,
        isClosable: true,
      });

      clearCertificate();
    }

    setIsTextAreaError(false);
  };

  const handleTextAreaBlur = () => {
    if (!certificatePem?.length) {
      setIsTextAreaError(true);

      return;
    }

    let isInValid = false;

    try {
      const cert = new X509Certificate(certificatePem);

      certificateType.current = 'x509';
      certificate.current = cert;
      setCertificatePem(cert.toString('pem'));
      setIsTextAreaError(false);

      return;
    } catch {
      isInValid = true;
    }

    try {
      const certr = new Pkcs10CertificateRequest(certificatePem);

      certificateType.current = 'csr';
      certificate.current = certr;
      setCertificatePem(certr.toString('pem'));
      setIsTextAreaError(false);

      return;
    } catch {
      isInValid = true;
    }

    setIsTextAreaError(isInValid);
  };

  useLockBodyScroll(isOpen);

  return {
    open: () => setIsOpen(true),
    dialog: () =>
      fortifyClient && isOpen
        ? (
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
              onDropAccepted={onDropAccepted}
              onDropError={() => {
                addToast({
                  message: t(
                    'certificates.dialog.import.certificate.error.invalid-data',
                  ),
                  variant: 'wrong',
                  disableIcon: true,
                  isClosable: true,
                });
              }}
              onDropRejected={(msg) => {
                addToast({
                  message: msg,
                  variant: 'wrong',
                  disableIcon: true,
                  isClosable: true,
                });
                clearCertificate();
              }}
              onDialogClose={handleClose}
              onProviderSelect={(id) => {
                localCurrentProviderId.current = id;
              }}
              onImportButtonClick={handleCertificateImport}
              onClearButtonClick={() => {
                setIsTextAreaError(false);
                clearCertificate();
              }}
            />
          )
        : null,
  };
}
