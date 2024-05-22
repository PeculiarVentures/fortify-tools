import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, TextField } from "@peculiar/react-components";
import { CertificateAlgorithmInfo } from "../certificate-algorithm-info";
import { Card } from "../card";
import {
  EHashAlgorithm,
  ESignatureAlgorithm,
} from "@peculiar/fortify-client-core";
import { CertificateAlgorithmProps, CertificateType } from "../../types";

import styles from "./styles/index.module.scss";

export interface ICertificateCreateByCnameData {
  subject: {
    CN: string;
  };
  algorithm: CertificateAlgorithmProps;
  type: CertificateType;
}

interface CertificateCreateByCnameProps {
  type: CertificateType;
  onCreateButtonClick: (data: ICertificateCreateByCnameData) => void;
}

export const CertificateCreateByCname: React.FunctionComponent<
  CertificateCreateByCnameProps
> = (props) => {
  const { type = "x509", onCreateButtonClick } = props;

  const { t } = useTranslation();
  const [cname, setCname] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const algorithm: CertificateAlgorithmProps = {
    hash: EHashAlgorithm.SHA_256,
    signature: ESignatureAlgorithm.RSA2048,
  };

  const isCreateButtonDisabled = !cname.length || isError;

  return (
    <div className={styles.form_box}>
      <Card>
        <TextField
          className="required_text_field"
          value={cname}
          onChange={(event) => {
            setCname(event.target.value);
            if (!isDirty) {
              setIsDirty(true);
            }
          }}
          label={t("certificates.subject.cname.label")}
          placeholder={t("certificates.subject.cname.placeholder")}
          onBlur={() => isDirty && setIsError(!cname.length)}
          error={isError}
          errorText={t("certificates.subject.cname.error.required")}
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
          disabled={isCreateButtonDisabled}
          onClick={() =>
            onCreateButtonClick({
              subject: {
                CN: cname,
              },
              algorithm,
              type,
            })
          }
          title={
            isCreateButtonDisabled
              ? t("certificates.button-create.title")
              : undefined
          }
        >
          {t(`certificates.button-create.text.${type}`)}
        </Button>
      </div>
    </div>
  );
};
