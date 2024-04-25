import React, { ComponentProps } from "react";
import clsx from "clsx";
import { Tooltip, Typography } from "@peculiar/react-components";
import { truncateStringMiddle } from "../../utils";

interface CertificateSerialNumberProps {
  value?: string;
  className?: ComponentProps<"div">["className"];
}

export const CertificateSerialNumber: React.FunctionComponent<
  CertificateSerialNumberProps
> = (props) => {
  const { className, value } = props;
  if (!value) {
    return null;
  }

  return (
    <Tooltip placement="bottom-start" offset={5} title={value}>
      <Typography className={clsx(className)} variant="b2" color="black">
        {truncateStringMiddle(value)}
      </Typography>
    </Tooltip>
  );
};
