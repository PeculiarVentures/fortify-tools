import React, { ComponentProps, PropsWithChildren } from 'react';
import {
  Button, TButtonProps, Typography,
} from '@peculiar/react-components';
import { clsx } from 'clsx';
import DownIcon from '../../icons/down-10.svg?react';
import styles from './styles/index.module.scss';

interface ISortButtonProps extends PropsWithChildren {
  className?: ComponentProps<'button'>['className'];
  active?: boolean;
  order?: 'asc' | 'desc';
  disabled?: boolean;
  onClick: TButtonProps['onClick'];
}

export const SortButton: React.FunctionComponent<ISortButtonProps> = (props) => {
  const {
    children,
    className,
    active,
    disabled,
    order = 'desc',
    onClick,
  } = props;

  return (
    <Button
      variant="text"
      withoutPadding
      className={clsx(styles.sort_button, className)}
      data-active={active}
      disabled={disabled}
      onClick={onClick}
    >
      <Typography
        component="span"
        variant="b3"
        color="gray-9"
        className={styles.sort_button_label}
      >
        {children}
      </Typography>
      <DownIcon
        className={clsx(styles.sort_button_icon, { [styles.sort_button_icon_asc]: order === 'asc' })}
      />
    </Button>
  );
};
