import React from "react";
import { useLockBodyScroll } from "react-use";
import { CertificateViewerDialog } from "../../components/certificate-viewer-dialog";
import { CertificateProps } from "../../types";

export function useCertificateViewerDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const certificateRef = React.useRef<CertificateProps>();

  const handleOpen = (certificaate: CertificateProps) => {
    certificateRef.current = certificaate;
    setIsOpen(true);
  };

  const handleClose = () => {
    certificateRef.current = undefined;
    setIsOpen(false);
  };

  useLockBodyScroll(isOpen);

  return {
    open: handleOpen,
    dialog: () =>
      isOpen && certificateRef.current ? (
        <CertificateViewerDialog
          certificate={certificateRef.current}
          onClose={handleClose}
        />
      ) : null,
  };
}
