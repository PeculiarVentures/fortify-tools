import React, { ComponentProps, useEffect } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import {
  Autocomplete,
  Typography,
  useControllableState,
} from "@peculiar/react-components";
import {
  ICertificateKeyProperties,
  certificateKeyProperties,
} from "../../config/data";
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

  const [algorithm, setAlgorithm] =
    useControllableState<ICertificateKeyProperties>({
      defaultValue: certificateKeyProperties[0],
      onChange: (value) => {
        setSize(value.modulusLength[0]);
      },
    });
  const [size, setSize] = useControllableState<string | number>({
    defaultValue: certificateKeyProperties[0].modulusLength[0],
  });

  const isECType = algorithm.name.slice(0, 2) === "EC";

  useEffect(() => {
    const algorithmData: CertificateAlgorithmProps = {
      hash: "SHA-256",
      name: algorithm.name,
      namedCurve: isECType ? (size as string) : undefined,
      modulusLength: !isECType ? (size as number) : undefined,
    };
    onSelect(algorithmData);
  }, [algorithm, size, isECType]);

  return (
    <div className={clsx(styles.certificate_key_prop_select_box, className)}>
      <Typography variant="s2" color="black">
        {t("certificates.key-properties")}
      </Typography>
      <div className={styles.certificate_key_prop_selects}>
        <Autocomplete
          className={styles.certificate_key_prop_select}
          value={algorithm}
          disableSearch={true}
          getOptionLabel={({ name }) => name}
          options={certificateKeyProperties}
          onChange={(_, value) =>
            setAlgorithm(value as ICertificateKeyProperties)
          }
          label={t("certificates.key-algorithm")}
        />
        <Autocomplete
          className={styles.certificate_key_prop_select}
          value={size as string}
          disableSearch={true}
          getOptionLabel={(el) => el.toString()}
          options={algorithm.modulusLength as string[]}
          onChange={(_, value) => setSize(value as string)}
          label={t(
            isECType ? "certificates.key-named-curve" : "certificates.key-size"
          )}
        />
      </div>
    </div>
  );
};
