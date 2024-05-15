import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../card";
import { Button, TextField, Typography } from "@peculiar/react-components";
import { validateEmail } from "src/utils/validators";

import styles from "./styles/index.module.scss";
import { certificateKeyProperties } from "src/config/data";

export interface ICertificateCreateByEmailData {
  subject: {
    emailAddress: string;
    commonName: string;
  };
  algorithm: {
    hash: string;
    name: string;
    modulusLength: string | number;
  };
}

interface CertificateCreateByEmailProps {
  type: "x509" | "csr";
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

  const algorithm = {
    hash: "SHA-256",
    name: certificateKeyProperties[0].name,
    modulusLength: certificateKeyProperties[0].modulusLength[0],
  };

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
        <div className={styles.algorithm}>
          <Typography variant="c1" color="gray-9">
            {t("certificates.key-algorithm")}: {algorithm.name}
          </Typography>
          <Typography variant="c1" color="gray-9">
            {t("certificates.key-size")}: {algorithm.modulusLength}
          </Typography>
        </div>
      </Card>

      <div className={styles.button_group}>
        <Button
          variant="contained"
          color="primary"
          disabled={!emailAddress.length || isError}
          onClick={() =>
            onCreateButtonClick({
              subject: {
                commonName: emailAddress,
                emailAddress,
              },
              algorithm,
            })
          }
        >
          {t(`certificates.button-create.${type}`)}
        </Button>
      </div>
    </div>
  );
};
