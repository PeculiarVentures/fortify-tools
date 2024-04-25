import React, { ComponentProps } from "react";
import clsx from "clsx";
import { Tooltip, Typography } from "@peculiar/react-components";

import styles from "./styles/index.module.scss";

interface CertificateNameProps {
  name?: string;
  className?: ComponentProps<"div">["className"];
}

export const CertificateName: React.FunctionComponent<CertificateNameProps> = (
  props
) => {
  const { className, name } = props;
  if (!name) {
    return null;
  }

  return (
    <Tooltip placement="bottom-start" offset={5} title={name}>
      <Typography
        className={clsx(className, styles.certificate_name)}
        variant="b2"
        color="black"
      >
        {name}
      </Typography>
    </Tooltip>
  );
};
