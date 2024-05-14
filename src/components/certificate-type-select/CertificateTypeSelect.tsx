import React, { ComponentProps } from "react";
import { Autocomplete, Typography } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import { certificateKeyUsageExtensions } from "../../config/data";

import styles from "./styles/index.module.scss";

interface CertificateTypeSelectProps {
  className?: ComponentProps<"select">["className"];
  type: "x509" | "csr";
  onSelect: (alias: string) => void;
}

export const CertificateTypeSelect: React.FunctionComponent<
  CertificateTypeSelectProps
> = (props) => {
  const { className, type = "csr", onSelect } = props;

  const { t } = useTranslation();
  const list = [
    ...Object.keys(certificateKeyUsageExtensions).map((key) => ({
      value: key,
      label: t(`certificates.key-usage-extension.${key}`),
    })),
    {
      label: t(
        type === "x509"
          ? "certificates.custom-certificate-option"
          : "certificates.custom-csr-option"
      ),
      value: "custom",
    },
  ];

  return (
    <Autocomplete
      disableSearch={true}
      className={className}
      options={list}
      onChange={(_, value) => onSelect(value?.value as string)}
      placeholder={t("certificates.select-type-placeholder")}
      popoverProps={{
        className: styles.certificate_type_select_popover,
      }}
      renderOption={(props, { label, value }) => (
        <>
          {value === "custom" ? (
            <div className={styles.certificate_type_select_divider} />
          ) : null}
          <li {...props} className={styles.certificate_type_select_option}>
            <Typography variant="b3" color="black">
              {label}
            </Typography>
          </li>
        </>
      )}
    />
  );
};
