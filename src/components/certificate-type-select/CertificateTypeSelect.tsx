import React, { ComponentProps } from 'react';
import { Select, useControllableState } from '@peculiar/react-components';
import { useTranslation } from 'react-i18next';
import {
  TCertificateExtendedKeyUsages,
  certificateKeyUsageExtensions,
} from '../../config/data';
import { TCertificateType } from '../../types';
import styles from './styles/index.module.scss';

type TExtendedKeyUsages = TCertificateExtendedKeyUsages | 'custom';

export interface ICertificateTypeSelectValue {
  value: TExtendedKeyUsages;
  label: string;
}

interface ICertificateTypeSelectProps {
  className?: ComponentProps<'select'>['className'];
  type: TCertificateType;
  onChange: (data: ICertificateTypeSelectValue) => void;
}

export const CertificateTypeSelect: React.FunctionComponent<
  ICertificateTypeSelectProps
> = (props) => {
  const {
    className, type = 'csr', onChange,
  } = props;

  const [currentValue, setCurrentValue]
    = useControllableState<ICertificateTypeSelectValue>({ onChange });

  const { t } = useTranslation();
  const list: ICertificateTypeSelectValue[] = [
    ...Object.keys(certificateKeyUsageExtensions).map((key) => ({
      value: key as TExtendedKeyUsages,
      label: t(`certificates.key-usage-extension.${key}`),
    })),
    {
      label: t(
        type === 'x509'
          ? 'certificates.custom-certificate-option'
          : 'certificates.custom-csr-option',
      ),
      value: 'custom',
    },
  ];

  return (
    <Select
      value={currentValue}
      disableSearch={true}
      className={className}
      options={list}
      getOptionLabel={({ label }) => label}
      placeholder={t('certificates.select-type-placeholder')}
      popoverProps={{ className: styles.certificate_type_select_popover }}
      onChange={(_, value) =>
        setCurrentValue(value as ICertificateTypeSelectValue)}
    />
  );
};
