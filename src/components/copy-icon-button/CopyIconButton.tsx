import React from 'react';
import {
  IconButton,
  TIconButtonProps,
  useClipboard,
} from '@peculiar/react-components';
import CopyIcon from '../../icons/copy-20.svg?react';
import CheckIcon from '../../icons/check-20.svg?react';

interface ICopyIconButtonProps
  extends Omit<TIconButtonProps, 'children' | 'value'> {
  value: string | (() => string);
}

export const CopyIconButton: React.FunctionComponent<ICopyIconButtonProps> = (
  props,
) => {
  const { copy, isCopied } = useClipboard();
  const {
    value, size = 'small', ...restProps
  } = props;

  const handleClick = () => {
    if (typeof value === 'function') {
      copy(value());
    } else {
      copy(value);
    }
  };

  return (
    <IconButton
      size={size} {...restProps}
      onClick={handleClick}
    >
      {isCopied ? <CheckIcon /> : <CopyIcon />}
    </IconButton>
  );
};
