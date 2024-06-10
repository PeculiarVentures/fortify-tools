import React from "react";
import { useToast } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import { useLockBodyScroll } from "react-use";
import { FortifyAPI } from "@peculiar/fortify-client-core";
import { CertificateDeleteDialog } from "../../components/certificate-delete-dialog";

export function useCertificateDeleteDialog(props: {
  fortifyClient?: FortifyAPI | null;
  onSuccess: (providerId: string) => void;
}) {
  const { fortifyClient, onSuccess } = props;
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = React.useState(false);
  const [currentCertificatDelete, setCurrentCetificateDelete] = React.useState<
    undefined | { certificateIndex: string; providerId: string; label: string }
  >();

  const handleOpen = (
    certificateIndex: string,
    providerId: string,
    label: string
  ) => {
    setCurrentCetificateDelete({
      certificateIndex,
      providerId,
      label,
    });
  };

  const handleClose = () => {
    setCurrentCetificateDelete(undefined);
  };

  const handleCertificateDelete = async (index: string) => {
    if (!fortifyClient || index !== currentCertificatDelete?.certificateIndex) {
      return;
    }
    setIsLoading(true);
    try {
      await fortifyClient.removeCertificateById(
        currentCertificatDelete.providerId,
        currentCertificatDelete.certificateIndex
      );
      onSuccess(currentCertificatDelete.providerId);
      addToast({
        message: t("certificates.dialog.delete.success-message"),
        variant: "success",
        disableIcon: true,
        isClosable: true,
      });
    } catch (error) {
      addToast({
        message: t("certificates.dialog.delete.failure-message"),
        variant: "wrong",
        disableIcon: true,
        isClosable: true,
      });
    }

    setIsLoading(false);
    handleClose();
  };

  const isOpen = !!currentCertificatDelete?.certificateIndex;

  useLockBodyScroll(isOpen);

  return {
    open: handleOpen,
    dialog: () =>
      isOpen ? (
        <CertificateDeleteDialog
          certificateId={currentCertificatDelete.certificateIndex}
          certificateName={currentCertificatDelete.label}
          loading={isLoading}
          onDialogClose={handleClose}
          onDeleteClick={handleCertificateDelete}
        />
      ) : null,
  };
}
