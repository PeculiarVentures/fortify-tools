import React, { ComponentProps } from "react";
import clsx from "clsx";
import { Tooltip, Typography } from "@peculiar/react-components";
import { truncateStringMiddle } from "../../utils";

import styles from "./styles/index.module.scss";

interface CertificateSerialNumberProps {
  value?: string;
  className?: ComponentProps<"div">["className"];
}

export const CertificateSerialNumber: React.FunctionComponent<
  CertificateSerialNumberProps
> = (props) => {
  const { className, value } = props;
  if (!value) {
    return (
      <Typography
        className={clsx(className, styles.certificate_serial_number)}
        variant="b2"
        color="black"
      >
        -
      </Typography>
    );
  }

  return (
    <Tooltip placement="bottom-start" offset={5} title={value}>
      <Typography
        className={clsx(className, styles.certificate_serial_number)}
        variant="b2"
        color="black"
      >
        {truncateStringMiddle(value)}
      </Typography>
    </Tooltip>
  );
};
