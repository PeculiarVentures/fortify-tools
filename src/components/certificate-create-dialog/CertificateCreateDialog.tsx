import React from "react";
import { useTranslation } from "react-i18next";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import clsx from "clsx";
import {
  CertificateTypeSelect,
  ICertificateTypeSelectValue,
} from "../certificate-type-select";
import {
  Dialog,
  ArrowRightIcon,
  IconButton,
  Typography,
  CircularProgress,
} from "@peculiar/react-components";
import { Card } from "../card";
import { CertificateCreateByEmail } from "../certificate-create-by-email";
import { CertificateCreateByCname } from "../certificate-create-by-cname";

import styles from "./styles/index.module.scss";

interface CertificateCreateDialogProps {
  type: "x509" | "csr";
  currentProviderId?: string;
  providers: Pick<IProviderInfo, "id" | "name">[];
  loading?: boolean;
  onProviderSelect: (id: string) => void;
  onDialogClose: () => void;
  onCreateButtonClick: (data: unknown) => void;
}

export const CertificateCreateDialog: React.FunctionComponent<
  CertificateCreateDialogProps
> = (props) => {
  const {
    loading,
    type = "x509",
    // providers,
    // currentProviderId,
    // onProviderSelect,
    onDialogClose,
    onCreateButtonClick,
  } = props;

  const [currentTypeSelect, setCurrentTypeSelect] = React.useState<
    ICertificateTypeSelectValue | undefined
  >(undefined);

  const { t } = useTranslation();

  const renderContent = () => {
    if (currentTypeSelect) {
      if (
        [
          "id-kp-emailProtection",
          "id-kp-codeSigning",
          "id-kp-documentSigning",
        ].includes(currentTypeSelect.value)
      ) {
        return (
          <CertificateCreateByEmail
            type={type}
            onCreateButtonClick={onCreateButtonClick}
          />
        );
      }
      if (
        ["id-kp-clientAuth", "id-kp-serverAuth"].includes(
          currentTypeSelect.value
        )
      ) {
        return (
          <CertificateCreateByCname
            type={type}
            onCreateButtonClick={onCreateButtonClick}
          />
        );
      }
      if (currentTypeSelect.value) {
        return <>Custom</>;
      }
    }
  };

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
                {t(`certificates.dialog.create.title.${type}`)}
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
            <Card>
              <Typography variant="h5" color="black">
                {t(`certificates.dialog.create.select-type.${type}`)}
              </Typography>
              <CertificateTypeSelect
                type={type}
                onChange={setCurrentTypeSelect}
              />
            </Card>
            {renderContent()}
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
