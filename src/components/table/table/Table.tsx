import React from 'react';
import { clsx } from 'clsx';
import styles from './styles/index.module.scss';

export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>((props, ref) => {
  const { className, ...restProps } = props;

  return (
    <table
      ref={ref} className={clsx(styles.table, className)}
      {...restProps}
    />
  );
});
Table.displayName = 'Table';

export default Table;
