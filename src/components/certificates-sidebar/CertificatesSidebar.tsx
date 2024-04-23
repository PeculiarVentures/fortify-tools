import clsx from "clsx";
import React, { ComponentProps } from "react";

import styles from "./styles/index.module.scss";
import { useTranslation } from "react-i18next";
import { APP_CONTACT_SUPPORT_URL } from "../../config";

interface CertificatesSidebarProps {
  className?: ComponentProps<"div">["className"];
}
export const CertificatesSidebar: React.FunctionComponent<
  CertificatesSidebarProps
> = (props) => {
  const { children, className } = props;
  const { t } = useTranslation();

  return (
    <div className={clsx(styles.sidebar_root, className)}>
      <div className={styles.header}>
        <img
          className={styles.logo}
          src="/images/logo.svg"
          alt={t("sidebar.logo-alt")}
        />
      </div>
      <div className={styles.content}>{children}</div>
      <div className={styles.footer}>
        <div>{t("sidebar.copyrigth")}</div>
        <div>
          <a href={APP_CONTACT_SUPPORT_URL}>{t("sidebar.contact-support")}</a>
        </div>
      </div>
    </div>
  );
};
