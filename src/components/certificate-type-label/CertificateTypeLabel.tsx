import React, { ComponentProps } from "react";
import { ICertificate } from "@peculiar/fortify-client-core";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Typography } from "@peculiar/react-components";
import CertificateIcon from "../../icons/certificate.svg?react";
import styles from "./styles/index.module.scss";

interface CertificateTypeLabelProps {
  type: ICertificate["type"];
  className?: ComponentProps<"div">["className"];
}

export const CertificateTypeLabel: React.FunctionComponent<
  CertificateTypeLabelProps
> = (props) => {
  const { type, className } = props;
  const { t } = useTranslation();

  return (
    <div className={clsx(className, styles.certificate_type_label)}>
      {type === "x509" ? (
        <>
          <span className={styles.icon_wrapper}>
            <CertificateIcon />
          </span>
          <Typography variant="s2" color="black">
            {t("certificates.list.cell.certificate")}
          </Typography>
        </>
      ) : (
        <Typography variant="s2" color="black">
          {type}
        </Typography>
      )}
    </div>
  );
};
