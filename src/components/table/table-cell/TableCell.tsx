import React from "react";
import clsx from "clsx";
import styles from "./styles/index.module.scss";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={clsx(styles.table_cell, className)} {...props} />
));
TableCell.displayName = "TableCell";

export default TableCell;
