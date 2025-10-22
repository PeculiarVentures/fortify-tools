import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExtendedKeyUsageType } from '@peculiar/x509';
import { Button, TextField } from '@peculiar/react-components';
import {
  EHashAlgorithm,
  ESignatureAlgorithm,
} from '@peculiar/fortify-client-core';
import { CertificateAlgorithmInfo } from '../certificate-algorithm-info';
import { Card } from '../card';
import { ICertificateAlgorithmProps, TCertificateType } from '../../types';
import styles from './styles/index.module.scss';

export interface ICertificateCreateByCnameData {
  subject: {
    CN: string;
  };
  algorithm: ICertificateAlgorithmProps;
  extendedKeyUsages?: ExtendedKeyUsageType[];
  type: TCertificateType;
}

interface ICertificateCreateByCnameProps {
  type: TCertificateType;
  extendedKeyUsages?: ExtendedKeyUsageType[];
  onCreateButtonClick: (data: ICertificateCreateByCnameData) => void;
}

export const CertificateCreateByCname: React.FunctionComponent<
  ICertificateCreateByCnameProps
> = (props) => {
  const {
    type = 'x509', extendedKeyUsages, onCreateButtonClick,
  } = props;

  const { t } = useTranslation();
  const [isFormValid, setIsFormValid] = useState(false);

  const algorithm: ICertificateAlgorithmProps = {
    hash: EHashAlgorithm.SHA_256,
    signature: ESignatureAlgorithm.ECp256,
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    onCreateButtonClick({
      subject: { CN: formData.get('CN') as string },
      algorithm,
      extendedKeyUsages,
      type,
    });
  };

  return (
    <form
      className={styles.form_box}
      onSubmit={handleSubmit}
      onChange={(event) => setIsFormValid(event.currentTarget.checkValidity())}
    >
      <Card>
        <TextField
          className="required_text_field"
          name="CN"
          label={t('certificates.subject.cname.label')}
          placeholder={t('certificates.subject.cname.placeholder')}
          required
        />
        <CertificateAlgorithmInfo
          algorithmSignature={algorithm.signature}
          algorithmHash={algorithm.hash}
        />
      </Card>

      <div className={styles.button_group}>
        <Button
          variant="contained"
          color="primary"
          disabled={!isFormValid}
          type="submit"
        >
          {t(`certificates.button-create.text.${type}`)}
        </Button>
      </div>
    </form>
  );
};
