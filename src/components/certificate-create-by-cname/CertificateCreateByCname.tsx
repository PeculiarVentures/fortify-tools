import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, TextField } from "@peculiar/react-components";
import { CertificateAlgorithmInfo } from "../certificate-algorithm-info";
import { Card } from "../card";
import { certificateKeyProperties } from "../../config/data";
import { CertificateAlgorithmProps } from "../../types";

import styles from "./styles/index.module.scss";

export interface ICertificateCreateByCnameData {
  subject: {
    commonName: string;
  };
  algorithm: CertificateAlgorithmProps;
}

interface CertificateCreateByCnameProps {
  type: "x509" | "csr";
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

  const algorithm = {
    hash: "SHA-256",
    name: certificateKeyProperties[0].name,
    modulusLength: certificateKeyProperties[0].modulusLength[0],
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
          algorithmNname={algorithm.name}
          algorithmModulusLength={algorithm.modulusLength}
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
                commonName: cname,
              },
              algorithm,
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
