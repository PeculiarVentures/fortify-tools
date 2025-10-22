import React from 'react';
import { clsx } from 'clsx';
import styles from './styles/index.module.scss';

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>((props, ref) => {
  // eslint-disable-next-line react/prop-types
  const { className, ...restProps } = props;

  return (
    <th
      ref={ref}
      className={clsx(styles.table_head, className)}
      {...restProps}
    />
  );
});
TableHead.displayName = 'TableHead';

export default TableHead;
