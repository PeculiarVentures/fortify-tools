import React from "react";
import clsx from "clsx";
import styles from "./styles/index.module.scss";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>((props, ref) => {
  const { className, ...restProps } = props;

  return (
    <td
      ref={ref}
      className={clsx(styles.table_cell, className)}
      {...restProps}
    />
  );
});
TableCell.displayName = "TableCell";

export default TableCell;
