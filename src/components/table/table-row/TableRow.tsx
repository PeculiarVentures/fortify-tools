import clsx from "clsx";
import React from "react";
import styles from "./styles/index.module.scss";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>((props, ref) => {
  const { className, ...restProps } = props;

  return (
    <tr
      ref={ref}
      className={clsx(styles.table_row, className)}
      {...restProps}
    />
  );
});
TableRow.displayName = "TableRow";

export default TableRow;
