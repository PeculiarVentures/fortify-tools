import React from "react";
import clsx from "clsx";
import styles from "./styles/index.module.scss";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>((props, ref) => {
  const { className, ...restProps } = props;

  return (
    <thead
      ref={ref}
      className={clsx(styles.table_header, className)}
      {...restProps}
    />
  );
});
TableHeader.displayName = "TableHeader";

export default TableHeader;
