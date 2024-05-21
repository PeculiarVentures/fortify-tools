import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, TextField } from "@peculiar/react-components";
import { CertificateAlgorithmInfo } from "../certificate-algorithm-info";
import { Card } from "../card";
import { validateEmail } from "../../utils/validators";
import {
  EHashAlgorithm,
  ESignatureAlgorithm,
} from "@peculiar/fortify-client-core";
import { CertificateAlgorithmProps, CertificateType } from "../../types";

import styles from "./styles/index.module.scss";

export interface ICertificateCreateByEmailData {
  subject: {
    emailAddress: string;
    commonName: string;
  };
  algorithm: CertificateAlgorithmProps;
  type: CertificateType;
}

interface CertificateCreateByEmailProps {
  type: CertificateType;
  onCreateButtonClick: (data: ICertificateCreateByEmailData) => void;
}

export const CertificateCreateByEmail: React.FunctionComponent<
  CertificateCreateByEmailProps
> = (props) => {
  const { type = "x509", onCreateButtonClick } = props;

  const { t } = useTranslation();
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const algorithm: CertificateAlgorithmProps = {
    hash: EHashAlgorithm.SHA_256,
    signature: ESignatureAlgorithm.RSA2048,
  };

  const isCreateButtonDisabled = !emailAddress.length || isError;

  return (
    <div className={styles.form_box}>
      <Card>
        <TextField
          className="required_text_field"
          value={emailAddress}
          onChange={(event) => {
            setEmailAddress(event.target.value);
            if (!isDirty) {
              setIsDirty(true);
            }
          }}
          label={t("certificates.subject.email-address.label")}
          placeholder={t("certificates.subject.email-address.placeholder")}
          onBlur={() => {
            if (isDirty) {
              if (!emailAddress.length) {
                setIsError(true);
                setErrorMessage(
                  t("certificates.subject.email-address.error.required")
                );
                return;
              } else if (!validateEmail(emailAddress)) {
                setIsError(true);
                setErrorMessage(
                  t("certificates.subject.email-address.error.type")
                );
                return;
              }
              setIsError(false);
            }
          }}
          error={isError}
          errorText={errorMessage}
          type="email"
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
                commonName: emailAddress,
                emailAddress,
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
