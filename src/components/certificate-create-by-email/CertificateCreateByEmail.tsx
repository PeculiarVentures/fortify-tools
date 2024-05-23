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

export interface ICertificateCreateByEmailData {
  subject: {
    E: string;
    CN: string;
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

  const [isEmailAddresValid, setIsEmailAddresValid] = useState(false);
  const [emailAddressErrorMessage, setEmailAddressErrorMessage] = useState<
    string | undefined
  >(undefined);

  const algorithm: CertificateAlgorithmProps = {
    hash: EHashAlgorithm.SHA_256,
    signature: ESignatureAlgorithm.RSA2048,
  };

  const isCreateButtonDisabled =
    !isEmailAddresValid || !!emailAddressErrorMessage;

  const validateEmailAddress = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    if (!event.currentTarget.checkValidity()) {
      setIsEmailAddresValid(false);
      setEmailAddressErrorMessage(
        t("certificates.subject.email-address.error.type")
      );
      return;
    }
    setIsEmailAddresValid(true);
    setEmailAddressErrorMessage(undefined);
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const emailAddress = formData.get("email") as string;

    onCreateButtonClick({
      subject: {
        CN: emailAddress,
        E: emailAddress,
      },
      algorithm,
      type,
    });
  };

  return (
    <form className={styles.form_box} onSubmit={handleSubmit}>
      <Card>
        <TextField
          className="required_text_field"
          onChange={validateEmailAddress}
          label={t("certificates.subject.email-address.label")}
          placeholder={t("certificates.subject.email-address.placeholder")}
          error={!!emailAddressErrorMessage}
          errorText={emailAddressErrorMessage}
          type="email"
          name="email"
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
          disabled={isCreateButtonDisabled}
          type="submit"
          title={
            isCreateButtonDisabled
              ? t("certificates.button-create.title")
              : undefined
          }
        >
          {t(`certificates.button-create.text.${type}`)}
        </Button>
      </div>
    </form>
  );
};
