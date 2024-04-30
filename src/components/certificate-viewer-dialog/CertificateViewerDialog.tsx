import React from "react";
import { Convert } from "pvtsutils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@peculiar/react-components";
import { PeculiarCertificateViewer } from "@peculiar/certificates-viewer-react";
import { useTranslation } from "react-i18next";
import { CertificateProps } from "../../types";

interface CertificateViewerDialogProps {
  certificate?: CertificateProps;
  onClose?: () => void;
}
export const CertificateViewerDialog: React.FunctionComponent<
  CertificateViewerDialogProps
> = (props) => {
  const { certificate, onClose } = props;
  const { t } = useTranslation();

  if (!certificate) {
    return null;
  }

  return (
    <Dialog open={true} onClose={onClose} style={{ maxWidth: "870px" }}>
      <DialogTitle>
        {t("certificate-viewer-dialog.title", { name: certificate.label })}
      </DialogTitle>
      <DialogContent>
        <PeculiarCertificateViewer
          certificate={Convert.ToBase64(certificate?.raw)}
          download={true}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t("button.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
