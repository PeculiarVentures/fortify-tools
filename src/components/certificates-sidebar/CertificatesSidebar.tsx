import { clsx } from 'clsx';
import React, { ComponentProps, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@peculiar/react-components';
import { APP_CONTACT_SUPPORT_URL } from '../../config';
import styles from './styles/index.module.scss';

interface ICertificatesSidebarProps extends PropsWithChildren {
  className?: ComponentProps<'div'>['className'];
}

export const CertificatesSidebar: React.FunctionComponent<
  ICertificatesSidebarProps
> = (props) => {
  const { children, className } = props;
  const { t } = useTranslation();

  return (
    <div className={clsx(styles.sidebar_root, className)}>
      <div className={styles.header}>
        <img
          className={styles.logo}
          src="/images/logo.svg"
          alt={t('sidebar.logo-alt')}
        />
      </div>
      <div className={styles.content}>{children}</div>
      <div className={styles.footer}>
        <Typography variant="c1" color="gray-9">
          {t('sidebar.copyrigth')}
        </Typography>
        <div className={styles.footer_contact}>
          <Typography
            variant="c1"
            color="primary"
            component="a"
            href={APP_CONTACT_SUPPORT_URL}
          >
            {t('sidebar.contact-support')}
          </Typography>
        </div>
      </div>
    </div>
  );
};
