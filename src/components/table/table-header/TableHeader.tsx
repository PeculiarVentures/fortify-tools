import React from "react";
import clsx from "clsx";
import styles from "./styles/index.module.scss";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={clsx(styles.table_header, className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export default TableHeader;
