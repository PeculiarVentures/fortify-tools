import React from "react";
import { useDropzone } from "react-dropzone";
import { Trans, useTranslation } from "react-i18next";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import clsx from "clsx";
import {
  Dialog,
  ArrowRightIcon,
  IconButton,
  Typography,
  TextareaField,
  Button,
  CircularProgress,
} from "@peculiar/react-components";
import { CertificatesProvidersSelectList } from "../certificates-providers-select-list";

import CrossIcon from "../../icons/cross.svg?react";

import styles from "./styles/index.module.scss";

import {
  APP_CERTIFICATE_ALLOWED_MIMES,
  APP_CERTIFICATE_MAX_SIZE_BYTES,
} from "../../config";

interface CertificateImportDialogProps {
  currentProviderId?: string;
  providers: Pick<IProviderInfo, "id" | "name">[];
  loading?: boolean;
  certificate: string;
  isTextAreaError: boolean;
  onTextAreaChange: (certificate: string) => void;
  onTextAreaBlur: () => void;
  onProviderSelect: (id: string) => void;
  onDialogClose: () => void;
  onImportButtonClick: () => void;
  onDropError: (error?: unknown) => void;
  onDropRejected: (error: string) => void;
  onDropAccepted: (fileContent: string) => void;
  onClearButtonClick: () => void;
}

export const CertificateImportDialog: React.FunctionComponent<
  CertificateImportDialogProps
> = (props) => {
  const {
    loading,
    providers,
    currentProviderId,
    certificate,
    isTextAreaError,
    onTextAreaChange,
    onTextAreaBlur,
    onProviderSelect,
    onDialogClose,
    onImportButtonClick,
    onDropError,
    onDropRejected,
    onDropAccepted,
    onClearButtonClick,
  } = props;

  const { t } = useTranslation();

  const { getRootProps, isDragActive, isDragReject } = useDropzone({
    multiple: false,
    accept: APP_CERTIFICATE_ALLOWED_MIMES,
    maxSize: APP_CERTIFICATE_MAX_SIZE_BYTES,
    onDropRejected: ([file]) => {
      file.errors.forEach((err) => {
        let msg;
        if (err.code === "file-too-large") {
          msg = t("certificates.dialog.import.file.error.too-large", {
            size: APP_CERTIFICATE_MAX_SIZE_BYTES,
          });
        }
        if (err.code === "file-invalid-type") {
          msg = t("certificates.dialog.import.file.error.invalid-type");
        }

        if (msg) {
          onDropRejected(msg);
        }
      });
    },
    onDropAccepted: ([file]) => {
      if (!file) {
        return false;
      }
      const reader = new FileReader();

      reader.readAsText(file);

      reader.onload = (event) => {
        try {
          onDropAccepted(event.target?.result as string);
        } catch (error) {
          onDropError(error);
        }
      };

      reader.onerror = onDropError;
    },
    onError: onDropError,
  });

  return (
    <Dialog open fullScreen className={styles.dialog} onClose={onDialogClose}>
      <>
        <div className={styles.title}>
          <div className={styles.centered}>
            <div>
              <IconButton
                onClick={onDialogClose}
                className={styles.button_back}
                size="small"
              >
                <ArrowRightIcon className={styles.arrow_back} />
              </IconButton>
            </div>
            <div className={styles.title_label}>
              <Typography variant="h4" color="black">
                {t("certificates.dialog.import.title")}
              </Typography>
            </div>
            <div>
              <CertificatesProvidersSelectList
                providers={providers}
                currentProviderId={currentProviderId}
                onSelect={onProviderSelect}
                className={styles.provider_select}
                popoverClassName={styles.provider_select_popover}
              />
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={clsx(styles.centered, styles.content_box)}>
            <div
              {...getRootProps({
                className: clsx(styles.drop_zone, {
                  [styles.drop_zone_active]: isDragActive,
                  [styles.drop_zone_reject]: isDragReject,
                }),
              })}
            >
              <Typography variant="s2" color="gray-10">
                <Trans
                  i18nKey="certificates.dialog.import.drop-zone.title"
                  components={[
                    <Typography
                      className={styles.drop_zone_title_link}
                      color="primary"
                      variant="s2"
                      component="button"
                    >
                      {0}
                    </Typography>,
                  ]}
                />
              </Typography>
              <Typography variant="c2" color="gray-9">
                {t("certificates.dialog.import.drop-zone.description")}
              </Typography>
            </div>
            <div className={styles.divider_form}>
              <Typography
                variant="s2"
                className={styles.divider_form_inner}
                color="gray-10"
              >
                {t("certificates.dialog.import.divider-label")}
              </Typography>
            </div>
            <div>
              <TextareaField
                className={styles.text_area}
                value={certificate}
                onChange={(event) => onTextAreaChange(event.target.value)}
                size="large"
                onBlur={onTextAreaBlur}
                error={isTextAreaError}
                errorText={
                  isTextAreaError
                    ? t(
                        "certificates.dialog.import.certificate.error.invalid-data"
                      )
                    : undefined
                }
              />
            </div>
            <div className={styles.buttons_group}>
              <Button
                variant="outlined"
                startIcon={<CrossIcon />}
                disabled={!certificate?.length}
                onClick={onClearButtonClick}
                className={styles.cancel_button}
              >
                {t("button.clear")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!certificate?.length || isTextAreaError}
                onClick={onImportButtonClick}
              >
                {t("button.import-certificate")}
              </Button>
            </div>
          </div>
        </div>
        {loading ? (
          <div className={styles.loading}>
            <CircularProgress />
            <Typography variant="b2" color="gray-9">
              {t("certificates.dialog.import.loading-text")}
            </Typography>
          </div>
        ) : null}
      </>
    </Dialog>
  );
};
