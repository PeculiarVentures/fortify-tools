import React, { ComponentProps } from "react";
import { Typography } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import {
  EHashAlgorithm,
  ESignatureAlgorithm,
} from "@peculiar/fortify-client-core";

import styles from "./styles/index.module.scss";

interface CertificateAlgorithmInfoProps {
  className?: ComponentProps<"div">["className"];
  algorithmSignature: ESignatureAlgorithm;
  algorithmHash: EHashAlgorithm;
}

export const CertificateAlgorithmInfo: React.FunctionComponent<
  CertificateAlgorithmInfoProps
> = (props) => {
  const { className, algorithmSignature, algorithmHash } = props;
  const { t } = useTranslation();

  return (
    <div className={clsx(styles.algorithm_info, className)}>
      <Typography variant="c1" color="gray-9">
        {t("certificates.signature-algorithm")}: {algorithmSignature}
      </Typography>
      <Typography variant="c1" color="gray-9">
        {t("certificates.hash-algorithm")}: {algorithmHash}
      </Typography>
    </div>
  );
};
