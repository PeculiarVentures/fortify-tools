import React from "react";
import clsx from "clsx";
import styles from "./styles/index.module.scss";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>((props, ref) => {
  const { className, ...restProps } = props;

  return (
    <tbody ref={ref} className={clsx(styles.tbody, className)} {...restProps} />
  );
});
TableBody.displayName = "TableBody";

export default TableBody;
