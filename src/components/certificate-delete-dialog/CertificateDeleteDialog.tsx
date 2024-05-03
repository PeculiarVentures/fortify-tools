import React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@peculiar/react-components";
import { useTranslation } from "react-i18next";

import styles from "./styles/index.module.scss";

interface CertificateDeleteDialogProps {
  certificateName: string;
  certificateId: string;
  onDeleteClick: (certificateId: string) => void;
  onDialogClose: () => void;
  loading?: boolean;
}

export const CertificateDeleteDialog: React.FunctionComponent<
  CertificateDeleteDialogProps
> = (props) => {
  const {
    onDialogClose,
    certificateName,
    certificateId,
    onDeleteClick,
    loading,
  } = props;
  const { t } = useTranslation();

  return (
    <Dialog open onClose={onDialogClose} className={styles.dialog}>
      {loading ? (
        <DialogContent className={styles.dialog_content_loading}>
          <div>
            <CircularProgress />
            <Typography variant="b2" color="gray-9">
              {t("certificates.dialog.delete.loading-message")}
            </Typography>
          </div>
        </DialogContent>
      ) : (
        <>
          <DialogTitle>{t("certificates.dialog.delete.title")}</DialogTitle>
          <DialogContent className={styles.dialog_content}>
            <Typography
              variant="b2"
              color="black"
              className={styles.dialog_message}
            >
              {t("certificates.dialog.delete.message", {
                name: certificateName,
              })}
            </Typography>
          </DialogContent>
          <DialogActions className={styles.dialog_footer}>
            <Button variant="outlined" onClick={onDialogClose}>
              {t("certificates.dialog.delete.button.cancel")}
            </Button>
            <Button
              color="wrong"
              variant="contained"
              onClick={() => onDeleteClick(certificateId)}
            >
              {t("certificates.dialog.delete.button.delete")}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
