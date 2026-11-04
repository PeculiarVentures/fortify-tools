import type { ComponentProps } from 'react';
import React from 'react';
import type { ICertificate, ICertificateRequest } from '@peculiar/fortify-client-core';
import { Typography } from '@peculiar/react-components';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import CertificateIcon from '../../icons/certificate-30.svg?react';
import CertificateRequestIcon from '../../icons/certificate-request-30.svg?react';
import CertificateWithKeyIcon from '../../icons/certificate-with-key-30.svg?react';
import styles from './styles/index.module.scss';

interface ICertificateTypeLabelProps {
  type: ICertificate['type'] | ICertificateRequest['type'];
  withPrivatKey: boolean;
  withoutIcon?: boolean;
  className?: ComponentProps<'div'>['className'];
}

export const CertificateTypeLabel: React.FunctionComponent<ICertificateTypeLabelProps> = (
  props,
) => {
  const { type, className, withPrivatKey, withoutIcon } = props;
  const { t } = useTranslation();
  const textVariant = withoutIcon ? 'b2' : 's2';

  const renderType = () => {
    if (type === 'x509') {
      return (
        <>
          {!withoutIcon ? (
            <span className={styles.icon_wrapper}>
              {withPrivatKey ? <CertificateWithKeyIcon /> : <CertificateIcon />}
            </span>
          ) : null}
          <span>
            <Typography
              variant={textVariant}
              color="black"
              className={styles.label_part}
            >
              {t('certificates.list.cell.certificate')}
            </Typography>
            {withPrivatKey ? (
              <Typography
                variant="b2"
                color="black"
                className={styles.label_part}
              >
                {' '}
                {t('certificates.list.cell.with-privat-key')}
              </Typography>
            ) : undefined}
          </span>
        </>
      );
    }

    if (type === 'request') {
      return (
        <>
          {!withoutIcon ? (
            <span className={styles.icon_wrapper}>
              <CertificateRequestIcon />
            </span>
          ) : null}
          <span>
            <Typography
              variant={textVariant}
              color="black"
              className={styles.label_part}
            >
              {t('certificates.list.cell.certificate-request')}
            </Typography>
          </span>
        </>
      );
    }

    return (
      <Typography
        variant={textVariant}
        color="black"
      >
        {type}
      </Typography>
    );
  };

  return <div className={clsx(className, styles.certificate_type_label)}>{renderType()}</div>;
};
