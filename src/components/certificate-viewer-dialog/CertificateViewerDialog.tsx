import React from "react";
import { Convert } from "pvtsutils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@peculiar/react-components";
import {
  PeculiarCertificateViewer,
  PeculiarCsrViewer,
} from "@peculiar/certificates-viewer-react";
import { useTranslation } from "react-i18next";
import { CertificateProps, CertificateType } from "../../types";

import styles from "./styles/index.module.scss";

interface CertificateViewerDialogProps {
  certificate: CertificateProps;
  onClose?: () => void;
}
export const CertificateViewerDialog: React.FunctionComponent<
  CertificateViewerDialogProps
> = (props) => {
  const { certificate, onClose } = props;
  const { t } = useTranslation();

  const certBase64 = Convert.ToBase64(certificate?.raw);

  return (
    <Dialog open={true} onClose={onClose} className={styles.dialog}>
      <DialogTitle>
        {t("certificate-viewer-dialog.title", { name: certificate.label })}
      </DialogTitle>
      <DialogContent className={styles.dialog_content}>
        {(certificate?.type as CertificateType) === "csr" ? (
          <PeculiarCsrViewer certificate={certBase64} download={true} />
        ) : (
          <PeculiarCertificateViewer certificate={certBase64} download={true} />
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t("button.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
