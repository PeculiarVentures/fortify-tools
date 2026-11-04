import React from 'react';
import { createDialog, useToast } from '@peculiar/react-components';
import { useTranslation } from 'react-i18next';
import { useLockBodyScroll } from 'react-use';
import { CertificateDeleteDialog } from '../../components/certificate-delete-dialog';
import { useCloseOnProviderRemoved, useDialogsContext } from '../dialogs-context';

export interface ICertificateDeleteDialogOpenParams {
  certificateIndex: string;
  providerId: string;
  label: string;
  onSuccess: (providerId: string) => void;
}

export const useCertificateDeleteDialog = createDialog<ICertificateDeleteDialogOpenParams>(
  ({ openParams, close }) => {
    const { certificateIndex, providerId, label, onSuccess } = openParams;
    const { fortifyClient } = useDialogsContext();
    const provider = useCloseOnProviderRemoved(providerId, close);
    const { addToast } = useToast();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = React.useState(false);

    useLockBodyScroll(true);

    const handleCertificateDelete = async (index: string) => {
      if (!fortifyClient || index !== certificateIndex) {
        return;
      }

      setIsLoading(true);

      try {
        await fortifyClient.removeCertificateById(providerId, certificateIndex);

        onSuccess(providerId);
        addToast({
          message: t('certificates.dialog.delete.success-message'),
          variant: 'success',
          disableIcon: true,
          isClosable: true,
        });
      } catch {
        addToast({
          message: t('certificates.dialog.delete.failure-message'),
          variant: 'wrong',
          disableIcon: true,
          isClosable: true,
        });
      }

      setIsLoading(false);
      close();
    };

    if (!fortifyClient || !provider) {
      return null;
    }

    return (
      <CertificateDeleteDialog
        certificateId={certificateIndex}
        certificateName={label}
        loading={isLoading}
        onDialogClose={close}
        onDeleteClick={handleCertificateDelete}
      />
    );
  },
);
