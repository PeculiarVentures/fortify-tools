import React, { ComponentProps } from "react";
import clsx from "clsx";
import { Checkbox, Typography } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import { certificateKeyUsageExtensions } from "../../config/data";

import styles from "./styles/index.module.scss";

interface KeyUsagesCheckboxGroupProps {
  className?: ComponentProps<"div">["className"];
}

export const KeyUsagesCheckboxGroup: React.FunctionComponent<
  KeyUsagesCheckboxGroupProps
> = (props) => {
  const { className } = props;
  const { t } = useTranslation();

  return (
    <div className={clsx(styles.key_usages_checkbox_group_box, className)}>
      <Typography variant="s2" color="black">
        {t("certificates.extended-key-usages")}
      </Typography>
      <div className={styles.key_usages_checkbox_group}>
        {Object.entries(certificateKeyUsageExtensions).map(([key, value]) => (
          <label
            key={`key-usage-checkbox-${key}`}
            className={styles.key_usages_checkbox}
          >
            <Checkbox
              name="keyUsage"
              inputProps={{
                value,
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
