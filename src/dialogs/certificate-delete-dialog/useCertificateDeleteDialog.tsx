import React from "react";
import { useToast } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import { useLockBodyScroll } from "react-use";
import { FortifyAPI } from "@peculiar/fortify-client-core";
import { CertificateDeleteDialog } from "../../components/certificate-delete-dialog";

type UseCertificateDeleteDialogOpenParams = {
  certificateIndex: string;
  providerId: string;
  label: string;
};

type UseCertificateDeleteDialogInitialParams = {
  fortifyClient: FortifyAPI | null;
  onSuccess: (providerId: string) => void;
};

export function useCertificateDeleteDialog(
  props: UseCertificateDeleteDialogInitialParams
) {
  const { fortifyClient, onSuccess } = props;
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const openParamsRef = React.useRef<UseCertificateDeleteDialogOpenParams>();

  const handleOpen = (params: UseCertificateDeleteDialogOpenParams) => {
    openParamsRef.current = params;
    setIsOpen(true);
  };

  const handleClose = () => {
    openParamsRef.current = undefined;
    setIsOpen(false);
  };

  const handleCertificateDelete = async (index: string) => {
    if (!fortifyClient || index !== openParamsRef.current?.certificateIndex) {
      return;
    }
    setIsLoading(true);
    try {
      await fortifyClient.removeCertificateById(
        openParamsRef.current.providerId,
        openParamsRef.current.certificateIndex
      );
      onSuccess(openParamsRef.current.providerId);
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

  useLockBodyScroll(isOpen);

  return {
    open: handleOpen,
    close: handleClose,
    dialog: () =>
      fortifyClient && isOpen && openParamsRef.current ? (
        <CertificateDeleteDialog
          certificateId={openParamsRef.current.certificateIndex}
          certificateName={openParamsRef.current.label}
          loading={isLoading}
          onDialogClose={handleClose}
          onDeleteClick={handleCertificateDelete}
        />
      ) : null,
  };
}
