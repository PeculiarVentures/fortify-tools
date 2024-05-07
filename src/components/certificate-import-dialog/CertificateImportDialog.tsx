import React, { useState } from "react";
import { Convert } from "pvtsutils";
import { useDropzone } from "react-dropzone";
import { Trans, useTranslation } from "react-i18next";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import clsx from "clsx";
import {
  Dialog,
  ArrowRightIcon,
  LinearProgress,
  IconButton,
  Typography,
  useToast,
  TextareaField,
} from "@peculiar/react-components";
import { X509Certificate } from "@peculiar/x509";
import { CertificatesProvidersSelectList } from "../certificates-providers-select-list";
import { base64Clarify, certificateRawToBuffer } from "../../utils";

import styles from "./styles/index.module.scss";

import {
  APP_CERTIFICATE_ALLOWED_MIMES,
  APP_CERTIFICATE_MAX_SIZE_BYTES,
} from "../../config";

interface CertificateImportDialogProps {
  currentProviderId?: string;
  providers: Pick<IProviderInfo, "id" | "name">[];
  loading?: boolean;
  onProviderSelect: (id: string) => void;
  onDialogClose: () => void;
}

export const CertificateImportDialog: React.FunctionComponent<
  CertificateImportDialogProps
> = (props) => {
  const {
    loading,
    providers,
    currentProviderId,
    onProviderSelect,
    onDialogClose,
  } = props;

  const { addToast } = useToast();
  const { t } = useTranslation();

  const [certificate, setCertificate] = useState("");
  const [isTextAreaError, setIsTextAreaError] = useState(false);

  const { getRootProps, open, isFocused, isDragActive, isDragReject } =
    useDropzone({
      multiple: false,
      accept: APP_CERTIFICATE_ALLOWED_MIMES,
      maxSize: APP_CERTIFICATE_MAX_SIZE_BYTES,
      onDropRejected: (files) => {
        files.forEach((file) => {
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
              addToast({
                message: msg,
                variant: "wrong",
                disableIcon: true,
                isClosable: true,
              });
            }
          });
        });
      },
      onDropAccepted: (files) => {
        files.forEach(async (file) => {
          const fbuf = await file?.arrayBuffer();

          try {
            const rawClarified = base64Clarify(Convert.ToBase64(fbuf));
            const buffer = certificateRawToBuffer(rawClarified);
            const x509Cert = new X509Certificate(buffer);

            setCertificate(x509Cert.toString("pem"));
          } catch (error) {
            addToast({
              message: t(
                "certificates.dialog.import.certificate.error.invalid-data"
              ),
              variant: "wrong",
              disableIcon: true,
              isClosable: true,
            });
          }
        });
      },
      onError: (error) => {
        addToast({
          message: error?.message,
          variant: "wrong",
          disableIcon: true,
          isClosable: true,
        });
      },
    });

  return (
    <Dialog open fullScreen className={styles.dialog} onClose={onDialogClose}>
      <div className={styles.title}>
        <div className={styles.centered}>
          <div>
            <IconButton
              onClick={onDialogClose}
              className={styles.button_back}
              size="small"
            >
              <ArrowRightIcon className={styles.arrow_back} color="black" />
            </IconButton>
          </div>
          <div className={styles.title_label}>
            <Typography variant="h4" color="black">
              Import certificate
            </Typography>
          </div>
          <div>
            <CertificatesProvidersSelectList
              providers={providers}
              currentProviderId={currentProviderId}
              onSelect={onProviderSelect}
              className={styles.provider_select}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <LinearProgress color="primary" />
      ) : (
        <div className={styles.divider} />
      )}
      <div className={styles.content}>
        <div className={styles.centered}>
          <div
            {...getRootProps({
              className: clsx(styles.drop_zone, {
                [styles.drop_zone_focused]: isFocused,
                [styles.drop_zone_active]: isDragActive,
                [styles.drop_zone_reject]: isDragReject,
              }),
              onClick: (event) => event.stopPropagation(),
            })}
          >
            <Typography variant="s2" color="gray-9">
              <Trans
                i18nKey="certificates.dialog.import.drop-zone.title"
                components={[
                  <Typography
                    className={styles.drop_zone_title_link}
                    color="primary"
                    variant="s2"
                    component="a"
                    onClick={(event) => {
                      event.preventDefault();
                      open();
                    }}
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
          <div>
            <TextareaField
              value={certificate}
              onChange={(event) => {
                setCertificate(event.target.value);
                setIsTextAreaError(false);
              }}
              size="large"
              onBlur={() => {
                try {
                  certificate?.length && new X509Certificate(certificate);
                  setIsTextAreaError(false);
                } catch (error) {
                  setIsTextAreaError(true);
                }
              }}
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
        </div>
      </div>
    </Dialog>
  );
};
