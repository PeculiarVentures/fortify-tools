import React, { ComponentProps } from "react";
import { Autocomplete, useControllableState } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import {
  ICertificateKeyUsageExtensions,
  certificateKeyUsageExtensions,
} from "../../config/data";
import { CertificateType } from "../../types";

import styles from "./styles/index.module.scss";

type IKeyUsageExtensions = ICertificateKeyUsageExtensions | "custom";

export type ICertificateTypeSelectValue = {
  value: IKeyUsageExtensions;
  label: string;
};

interface CertificateTypeSelectProps {
  className?: ComponentProps<"select">["className"];
  type: CertificateType;
  onChange: (data: ICertificateTypeSelectValue) => void;
}

export const CertificateTypeSelect: React.FunctionComponent<
  CertificateTypeSelectProps
> = (props) => {
  const { className, type = "csr", onChange } = props;

  const [currentValue, setCurrentValue] =
    useControllableState<ICertificateTypeSelectValue>({ onChange });

  const { t } = useTranslation();
  const list: ICertificateTypeSelectValue[] = [
    ...Object.keys(certificateKeyUsageExtensions).map((key) => ({
      value: key as IKeyUsageExtensions,
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
      value={currentValue}
      disableSearch={true}
      className={className}
      options={list}
      onChange={(_, value) =>
        setCurrentValue(value as ICertificateTypeSelectValue)
      }
      getOptionLabel={({ label }) => label}
      placeholder={t("certificates.select-type-placeholder")}
      popoverProps={{
        className: styles.certificate_type_select_popover,
      }}
    />
  );
};
