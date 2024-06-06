import React from "react";
import { useToast } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import { useLockBodyScroll } from "react-use";
import { CertificateDeleteDialog } from "../../components/certificate-delete-dialog";

export function useCertificateDeleteDialog() {
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = React.useState(false);
  const [currentCertificatDelete, setCurrentCetificateDelete] = React.useState<
    undefined | { certificateId: string; providerId: string; label: string }
  >();

  const handleOpen = (
    certificateId: string,
    providerId: string,
    label: string
  ) => {
    setCurrentCetificateDelete({
      certificateId,
      providerId,
      label,
    });
  };

  const handleClose = () => {
    setCurrentCetificateDelete(undefined);
  };

  const handleCertificateDelete = (id: string) => {
    // TODO: add logic
    console.log("Delete certificate: ", id, currentCertificatDelete);
    // temporary behaviour
    setIsLoading(true);
    setTimeout(function () {
      setIsLoading(false);
      handleClose();
      addToast({
        message: t("certificates.dialog.delete.failure-message"),
        variant: "wrong",
        disableIcon: true,
        isClosable: true,
      });
    }, 1000);
  };

  const isOpen = !!currentCertificatDelete?.certificateId;

  useLockBodyScroll(isOpen);

  return {
    open: handleOpen,
    dialog: () =>
      isOpen ? (
        <CertificateDeleteDialog
          certificateId={currentCertificatDelete.certificateId}
          certificateName={currentCertificatDelete.label}
          loading={isLoading}
          onDialogClose={handleClose}
          onDeleteClick={handleCertificateDelete}
        />
      ) : null,
  };
}
