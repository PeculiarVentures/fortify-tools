import React from "react";
import clsx from "clsx";
import styles from "./styles/index.module.scss";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th ref={ref} className={clsx(styles.table_head, className)} {...props} />
));
TableHead.displayName = "TableHead";

export default TableHead;
