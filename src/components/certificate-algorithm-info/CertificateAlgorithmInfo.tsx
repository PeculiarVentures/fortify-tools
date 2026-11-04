import type { ComponentProps } from 'react';
import React from 'react';
import type { EHashAlgorithm, ESignatureAlgorithm } from '@peculiar/fortify-client-core';
import { Typography } from '@peculiar/react-components';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import styles from './styles/index.module.scss';

interface ICertificateAlgorithmInfoProps {
  className?: ComponentProps<'div'>['className'];
  algorithmSignature: ESignatureAlgorithm;
  algorithmHash: EHashAlgorithm;
}

export const CertificateAlgorithmInfo: React.FunctionComponent<ICertificateAlgorithmInfoProps> = (
  props,
) => {
  const { className, algorithmSignature, algorithmHash } = props;
  const { t } = useTranslation();

  return (
    <div className={clsx(styles.algorithm_info, className)}>
      <Typography
        variant="c1"
        color="gray-9"
      >
        {t('certificates.signature-algorithm')}:{algorithmSignature}
      </Typography>
      <Typography
        variant="c1"
        color="gray-9"
      >
        {t('certificates.hash-algorithm')}:{algorithmHash}
      </Typography>
    </div>
  );
};
