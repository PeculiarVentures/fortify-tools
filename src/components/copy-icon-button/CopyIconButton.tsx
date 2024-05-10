import React from "react";
import {
  IconButton,
  IconButtonProps,
  useClipboard,
} from "@peculiar/react-components";

import CopyIcon from "../../icons/copy-20.svg?react";
import CheckIcon from "../../icons/check-20.svg?react";

interface CopyIconButtonProps extends IconButtonProps {
  value: string;
}

export const CopyIconButton: React.FunctionComponent<CopyIconButtonProps> = (
  props
) => {
  const { copy, isCopied } = useClipboard();
  const { value, size = "small", ...restProps } = props;

  return (
    <IconButton size={size} {...restProps} onClick={() => copy(value)}>
      {isCopied ? <CheckIcon /> : <CopyIcon />}
    </IconButton>
  );
};
