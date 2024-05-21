import React, { ComponentProps, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import {
  EHashAlgorithm,
  ESignatureAlgorithm,
} from "@peculiar/fortify-client-core";
import { Autocomplete, Typography } from "@peculiar/react-components";

import { CertificateAlgorithmProps } from "../../types";

import styles from "./styles/index.module.scss";

interface CertificateKeyPropertiesSelectProps {
  className?: ComponentProps<"select">["className"];
  onSelect: (value: CertificateAlgorithmProps) => void;
}

export const CertificateKeyPropertiesSelect: React.FunctionComponent<
  CertificateKeyPropertiesSelectProps
> = (props) => {
  const { className, onSelect } = props;
  const { t } = useTranslation();

  const signatureAlgorithm = Object.values(ESignatureAlgorithm);
  const hashAlgorithm = Object.values(EHashAlgorithm);

  const [currentHashAlgorithm, setCurrentHashAlgorithm] = useState(
    hashAlgorithm[0] as string
  );
  const [currentSignatureAlgorithm, setCurrentSignatureAlgorithm] = useState(
    signatureAlgorithm[0] as string
  );

  useEffect(() => {
    const algorithmData: CertificateAlgorithmProps = {
      hash: currentHashAlgorithm as CertificateAlgorithmProps["hash"],
      signature:
        currentSignatureAlgorithm as CertificateAlgorithmProps["signature"],
    };
    onSelect(algorithmData);
  }, [currentSignatureAlgorithm, currentHashAlgorithm]);

  return (
    <div className={clsx(styles.certificate_key_prop_select_box, className)}>
      <Typography variant="s2" color="black">
        {t("certificates.key-properties")}
      </Typography>
      <div className={styles.certificate_key_prop_selects}>
        <Autocomplete
          className={styles.certificate_key_prop_select}
          value={currentSignatureAlgorithm}
          disableSearch={true}
          options={signatureAlgorithm}
          onChange={(_, value) => setCurrentSignatureAlgorithm(value as string)}
          label={t("certificates.signature-algorithm")}
        />
        <Autocomplete
          className={styles.certificate_key_prop_select}
          value={currentHashAlgorithm}
          disableSearch={true}
          options={hashAlgorithm}
          onChange={(_, value) => setCurrentHashAlgorithm(value as string)}
          label={t("certificates.hash-algorithm")}
        />
      </div>
    </div>
  );
};
