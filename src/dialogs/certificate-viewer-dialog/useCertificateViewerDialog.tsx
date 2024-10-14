import React from "react";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import { useLockBodyScroll } from "react-use";
import { CertificateViewerDialog } from "../../components/certificate-viewer-dialog";
import { CertificateProps } from "../../types";

type UseCertificateViewerDialogOpenParams = {
  providerId: string;
  certificate: CertificateProps;
};

type UseCertificateViewerInitialParams = {
  providers: IProviderInfo[];
};

export function useCertificateViewerDialog(
  props: UseCertificateViewerInitialParams
) {
  const { providers } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const openParamsRef = React.useRef<UseCertificateViewerDialogOpenParams>();

  const handleOpen = (params: UseCertificateViewerDialogOpenParams) => {
    openParamsRef.current = params;
    setIsOpen(true);
  };

  const handleClose = () => {
    openParamsRef.current = undefined;
    setIsOpen(false);
  };

  useLockBodyScroll(isOpen);

  const currentProvider = providers.find(
    ({ id }) => openParamsRef.current?.providerId === id
  );

  if (isOpen && !currentProvider) {
    handleClose();
  }

  return {
    open: handleOpen,
    dialog: () =>
      isOpen && openParamsRef.current ? (
        <CertificateViewerDialog
          certificate={openParamsRef.current.certificate}
          onClose={handleClose}
        />
      ) : null,
  };
}
