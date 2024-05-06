import React from "react";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import {
  Dialog,
  ArrowRightIcon,
  LinearProgress,
  IconButton,
  Typography,
} from "@peculiar/react-components";

import styles from "./styles/index.module.scss";
import { CertificatesProvidersSelectList } from "../certificates-providers-select-list";

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
        <div className={styles.centered}></div>
      </div>
    </Dialog>
  );
};
