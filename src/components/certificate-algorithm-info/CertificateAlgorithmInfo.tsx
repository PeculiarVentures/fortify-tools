import React, { ComponentProps } from "react";
import { Typography } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import styles from "./styles/index.module.scss";

interface CertificateAlgorithmInfoProps {
  className?: ComponentProps<"div">["className"];
  algorithmNname: string;
  algorithmModulusLength: string | number;
}

export const CertificateAlgorithmInfo: React.FunctionComponent<
  CertificateAlgorithmInfoProps
> = (props) => {
  const { className, algorithmNname, algorithmModulusLength } = props;
  const { t } = useTranslation();

  return (
    <div className={clsx(styles.algorithm_info, className)}>
      <Typography variant="c1" color="gray-9">
        {t("certificates.key-algorithm")}: {algorithmNname}
      </Typography>
      <Typography variant="c1" color="gray-9">
        {t("certificates.key-size")}: {algorithmModulusLength}
      </Typography>
    </div>
  );
};
