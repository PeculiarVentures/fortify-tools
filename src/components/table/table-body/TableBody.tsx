import React from "react";
import clsx from "clsx";
import styles from "./styles/index.module.scss";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={clsx(styles.tbody, className)} {...props} />
));
TableBody.displayName = "TableBody";

export default TableBody;
