import React from "react";
import clsx from "clsx";

import styles from "./styles/index.module.scss";

export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className={styles.table_wrapper}>
    <table ref={ref} className={clsx(styles.table, className)} {...props} />
  </div>
));
Table.displayName = "Table";

export default Table;
