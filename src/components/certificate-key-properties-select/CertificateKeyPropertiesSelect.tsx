import React, { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import {
  EHashAlgorithm,
  ESignatureAlgorithm,
} from "@peculiar/fortify-client-core";
import { Select, Typography } from "@peculiar/react-components";

import styles from "./styles/index.module.scss";

interface CertificateKeyPropertiesSelectProps {
  className?: ComponentProps<"select">["className"];
}

export const CertificateKeyPropertiesSelect: React.FunctionComponent<
  CertificateKeyPropertiesSelectProps
> = (props) => {
  const { className } = props;
  const { t } = useTranslation();

  const signatureAlgorithm = Object.values(ESignatureAlgorithm);
  const hashAlgorithm = Object.values(EHashAlgorithm);

  return (
    <div className={clsx(styles.certificate_key_prop_select_box, className)}>
      <Typography variant="s2" color="black">
        {t("certificates.key-properties")}
      </Typography>
      <div className={styles.certificate_key_prop_selects}>
        <Select
          className={styles.certificate_key_prop_select}
          name="signatureAlgorithm"
          defaultValue={signatureAlgorithm[2]}
          disableSearch={true}
          options={signatureAlgorithm}
          label={t("certificates.signature-algorithm")}
        />
        <Select
          className={styles.certificate_key_prop_select}
          defaultValue={hashAlgorithm[0]}
          name="hashAlgorithm"
          disableSearch={true}
          options={hashAlgorithm}
          label={t("certificates.hash-algorithm")}
        />
      </div>
    </div>
  );
};
