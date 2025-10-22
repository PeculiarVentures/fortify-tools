import React, { ComponentProps } from 'react';
import {
  ICertificate,
  ICertificateRequest,
} from '@peculiar/fortify-client-core';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { Typography } from '@peculiar/react-components';
import CertificateIcon from '../../icons/certificate-30.svg?react';
import CertificateWithKeyIcon from '../../icons/certificate-with-key-30.svg?react';
import CertificateRequestIcon from '../../icons/certificate-request-30.svg?react';
import styles from './styles/index.module.scss';

interface ICertificateTypeLabelProps {
  type: ICertificate['type'] | ICertificateRequest['type'];
  withPrivatKey: boolean;
  className?: ComponentProps<'div'>['className'];
}

export const CertificateTypeLabel: React.FunctionComponent<
  ICertificateTypeLabelProps
> = (props) => {
  const {
    type, className, withPrivatKey,
  } = props;
  const { t } = useTranslation();

  const renderType = () => {
    if (type === 'x509') {
      return (
        <>
          <span className={styles.icon_wrapper}>
            {withPrivatKey ? <CertificateWithKeyIcon /> : <CertificateIcon />}
          </span>
          <span>
            <Typography
              variant="s2"
              color="black"
              className={styles.label_part}
            >
              {t('certificates.list.cell.certificate')}
            </Typography>
            {withPrivatKey
              ? (
                  <Typography
                    variant="b2"
                    color="black"
                    className={styles.label_part}
                  >
                    {' '}
                    {t('certificates.list.cell.with-privat-key')}
                  </Typography>
                )
              : undefined}
          </span>
        </>
      );
    }

    if (type === 'request') {
      return (
        <>
          <span className={styles.icon_wrapper}>
            <CertificateRequestIcon />
          </span>
          <span>
            <Typography
              variant="s2"
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
      <Typography variant="s2" color="black">
        {type}
      </Typography>
    );
  };

  return (
    <div className={clsx(className, styles.certificate_type_label)}>
      {renderType()}
    </div>
  );
};
