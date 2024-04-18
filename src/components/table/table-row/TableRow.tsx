import clsx from "clsx";
import React from "react";
import styles from "./styles/index.module.scss";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={clsx(styles.table_row, className)} {...props} />
));
TableRow.displayName = "TableRow";

export default TableRow;
