import clsx from "clsx";
import React, { ComponentProps } from "react";

import styles from "./styles/index.module.scss";

interface CertificatesSidebarProps {
  className?: ComponentProps<"div">["className"];
}
export const CertificatesSidebar: React.FunctionComponent<
  CertificatesSidebarProps
> = ({ children, className }) => {
  return (
    <div className={clsx(styles.sidebar_root, className)}>
      <div>Logo</div>
      <div className={styles.content}>{children}</div>
      <div>Footer</div>
    </div>
  );
};
