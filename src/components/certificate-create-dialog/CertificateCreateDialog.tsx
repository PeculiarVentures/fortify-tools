import React from "react";
import { useTranslation } from "react-i18next";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import clsx from "clsx";
import { CertificateTypeSelect } from "../certificate-type-select/CertificateTypeSelect";
import {
  Dialog,
  ArrowRightIcon,
  IconButton,
  Typography,
  CircularProgress,
} from "@peculiar/react-components";

import styles from "./styles/index.module.scss";

interface CertificateCreateDialogProps {
  type: "x509" | "csr";
  currentProviderId?: string;
  providers: Pick<IProviderInfo, "id" | "name">[];
  loading?: boolean;
  onProviderSelect: (id: string) => void;
  onDialogClose: () => void;
  onCreateClick: (certificate: string) => void;
}

export const CertificateCreateDialog: React.FunctionComponent<
  CertificateCreateDialogProps
> = (props) => {
  const {
    loading,
    type,
    // providers,
    // currentProviderId,
    // onProviderSelect,
    onDialogClose,
    // onCreateClick,
  } = props;

  const { t } = useTranslation();

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
                {t(
                  type === "csr"
                    ? "certificates.dialog.create.title.csr"
                    : "certificates.dialog.create.title.x509"
                )}
              </Typography>
            </div>
            <div>
              {
                // CertificatesProvidersSelectList
              }
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={clsx(styles.centered, styles.content_box)}>
            <div className={styles.card}>
              <CertificateTypeSelect
                type={type}
                onSelect={(alias) => console.log(alias)}
              />
            </div>
          </div>
        </div>
        {loading ? (
          <div className={styles.loading}>
            <CircularProgress />
            <Typography variant="b2" color="gray-9">
              {t("certificates.dialog.create.loading-text")}
            </Typography>
          </div>
        ) : null}
      </>
    </Dialog>
  );
};
