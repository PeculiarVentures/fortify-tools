import React, { ComponentProps } from "react";
import clsx from "clsx";
import {
  Checkbox,
  Typography,
  useControllableState,
} from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import {
  CertificateKeyUsageExtensions,
  ICertificateKeyUsageExtensions,
} from "../../config/data";

import styles from "./styles/index.module.scss";

interface KeyUsagesCheckboxGroupProps {
  onChange: (extensions: ICertificateKeyUsageExtensions[]) => void;
  className?: ComponentProps<"div">["className"];
}

export const KeyUsagesCheckboxGroup: React.FunctionComponent<
  KeyUsagesCheckboxGroupProps
> = (props) => {
  const { onChange, className } = props;
  const { t } = useTranslation();
  const [extensions, setExtensions] = useControllableState<
    ICertificateKeyUsageExtensions[]
  >({ defaultValue: [], onChange });

  return (
    <div className={clsx(styles.key_usages_checkbox_group_box, className)}>
      <Typography variant="s2" color="black">
        {t("certificates.extended-key-usages")}
      </Typography>
      <div className={styles.key_usages_checkbox_group}>
        {Object.entries(CertificateKeyUsageExtensions).map(([key, value]) => (
          <label
            key={`key-usage-checkbox-${key}`}
            className={styles.key_usages_checkbox}
          >
            <Checkbox
              onChange={(event) => {
                setExtensions(
                  event.target.checked &&
                    !extensions.includes(
                      value as ICertificateKeyUsageExtensions
                    )
                    ? [...extensions, value as ICertificateKeyUsageExtensions]
                    : extensions.filter((e) => e !== value)
                );
              }}
            />
            <Typography variant="b2" color="black">
              {t(`certificates.key-usage-extension.${key}`)}
            </Typography>
          </label>
        ))}
      </div>
    </div>
  );
};
