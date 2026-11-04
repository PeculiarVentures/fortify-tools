import React from 'react';
import type { ExtendedKeyUsageType } from '@peculiar/x509';
import { createDialog, useToast } from '@peculiar/react-components';
import { useTranslation } from 'react-i18next';
import { useLockBodyScroll } from 'react-use';
import type { TCertificateCreateDataProps } from '../../components/certificate-create-dialog';
import type { TCertificateType } from '../../types';
import { CertificateCreateDialog } from '../../components/certificate-create-dialog';
import { certificateSubjectToString } from '../../utils/certificate';
import { useDialogsContext } from '../dialogs-context';

export interface ICertificateCreateDialogOpenParams {
  type: TCertificateType;
  onSuccess: (providerId: string) => void;
}

export const useCertificateCreateDialog = createDialog<ICertificateCreateDialogOpenParams>(
  ({ openParams, close }) => {
    const { type, onSuccess } = openParams;
    const { fortifyClient, providers, currentProviderId } = useDialogsContext();
    const { addToast } = useToast();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = React.useState(false);
    const selectedProviderId = React.useRef(currentProviderId);

    React.useEffect(() => {
      selectedProviderId.current = currentProviderId;
    }, [currentProviderId]);

    useLockBodyScroll(true);

    const handleCertificateCreate = async (
      data: TCertificateCreateDataProps & {
        extendedKeyUsages?: ExtendedKeyUsageType[];
      },
    ) => {
      if (!fortifyClient) {
        return;
      }

      if (!selectedProviderId.current) {
        selectedProviderId.current = currentProviderId;
      }

      const providerId = selectedProviderId.current as string;
      const subject = certificateSubjectToString(data.subject);
      const { algorithm } = data;

      setIsLoading(true);

      let isCreated = false;

      try {
        let newCert;

        if (data.type === 'x509') {
          newCert = await fortifyClient.createX509(providerId, {
            subjectName: subject,
            hashAlgorithm: algorithm.hash,
            signatureAlgorithm: algorithm.signature,
            extensions: data?.extendedKeyUsages?.length
              ? { extendedKeyUsage: data.extendedKeyUsages }
              : undefined,
          });
        } else if (data.type === 'csr') {
          newCert = await fortifyClient.createPKCS10(providerId, {
            subjectName: subject,
            hashAlgorithm: algorithm.hash,
            signatureAlgorithm: algorithm.signature,
          });
        }

        isCreated = Boolean(newCert);
      } catch {
        //
      }

      setIsLoading(false);

      if (!isCreated) {
        addToast({
          message: t('certificates.dialog.create.failure-message'),
          variant: 'wrong',
          disableIcon: true,
          isClosable: true,
        });

        return;
      }

      onSuccess(providerId);
      close();
      addToast({
        message: t('certificates.dialog.create.success-message'),
        variant: 'success',
        disableIcon: true,
        isClosable: true,
      });
    };

    return (
      <CertificateCreateDialog
        type={type}
        providers={providers}
        currentProviderId={currentProviderId}
        loading={isLoading}
        onCreateButtonClick={handleCertificateCreate}
        onDialogClose={close}
        onProviderSelect={(id) => {
          selectedProviderId.current = id;
        }}
      />
    );
  },
);
