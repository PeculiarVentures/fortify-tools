import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CertificateAlgorithmProps,
  CertificateSubjectProps,
  CertificateType,
} from "../../types";
import {
  Autocomplete,
  Button,
  TextField,
  Typography,
} from "@peculiar/react-components";
import { CertificateKeyPropertiesSelect } from "../certificate-key-properties-select";
import { Card } from "../card";
import { KeyUsagesCheckboxGroup } from "../key-usages-checkbox-group";

import { ICertificateKeyUsageExtensions } from "../../config/data";
import { countries } from "../../config/data";

import styles from "./styles/index.module.scss";

export interface ICertificateCreateByCustomData {
  subject: CertificateSubjectProps;
  algorithm?: CertificateAlgorithmProps;
  extensions: ICertificateKeyUsageExtensions[];
  type: CertificateType;
}

interface CertificateCreateByCustomProps {
  type: CertificateType;
  onCreateButtonClick: (data: ICertificateCreateByCustomData) => void;
}

export const CertificateCreateByCustom: React.FunctionComponent<
  CertificateCreateByCustomProps
> = (props) => {
  const { type = "x509", onCreateButtonClick } = props;

  const { t } = useTranslation();

  const [isFormValid, setIsFormValid] = useState(false);
  const [emailAddressErrorMessage, setEmailAddressErrorMessage] = useState<
    string | undefined
  >(undefined);

  const extendedKeyUsageExtension = useRef<ICertificateKeyUsageExtensions[]>(
    []
  );

  const validateEmailAddress = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    if (!event.currentTarget.checkValidity()) {
      setEmailAddressErrorMessage(
        t("certificates.subject.email-address.error.type")
      );
      return;
    }
    setEmailAddressErrorMessage(undefined);
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { hashAlgorithm, signatureAlgorithm, C, ...subject } =
      Object.fromEntries(formData);

    const hash = hashAlgorithm
      .toString()
      .replace(/"/g, "") as CertificateAlgorithmProps["hash"];
    const signature = signatureAlgorithm
      .toString()
      .replace(/"/g, "") as CertificateAlgorithmProps["signature"];

    const country = C ? JSON.parse(C as string)?.code : "";

    const submitedData: ICertificateCreateByCustomData = {
      subject: {
        ...(subject as unknown as ICertificateCreateByCustomData["subject"]),
        C: country,
      },
      extensions: extendedKeyUsageExtension.current,
      type,
      algorithm: {
        hash,
        signature,
      },
    };
    onCreateButtonClick(submitedData);
  };

  return (
    <form
      className={styles.form_box}
      onSubmit={handleSubmit}
      onChange={(event) => setIsFormValid(event.currentTarget.checkValidity())}
    >
      <Card className={styles.card}>
        <div className={styles.general_box}>
          <Typography variant="s2" color="black">
            {t("certificates.general.title")}
          </Typography>
          <div className={styles.general_fields}>
            <TextField
              label={t("certificates.general.friendly-name")}
              disabled
            />
            <TextField label={t("certificates.general.description")} disabled />
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.subject_box}>
          <Typography variant="s2" color="black">
            {t("certificates.subject.title")}
          </Typography>
          <div className={styles.subject_fields}>
            <TextField
              className="required_text_field"
              name="CN"
              label={t("certificates.subject.cname.label")}
              placeholder={t("certificates.subject.cname.placeholder-2")}
              required
            />
            <TextField
              className="required_text_field"
              name="E"
              onChange={validateEmailAddress}
              label={t("certificates.subject.email-address.label")}
              placeholder={t("certificates.subject.email-address.placeholder")}
              error={!!emailAddressErrorMessage}
              errorText={emailAddressErrorMessage}
              type="email"
              required
            />
            <TextField
              name="O"
              label={t("certificates.subject.organization-name.label")}
              placeholder={t(
                "certificates.subject.organization-name.placeholder"
              )}
            />
            <TextField
              name="OU"
              label={t("certificates.subject.organization-unit-name.label")}
            />
            <Autocomplete
              getOptionLabel={({ value }) => value}
              options={countries}
              name="C"
              placeholder={t("certificates.subject.country-name.placeholder")}
              label={t("certificates.subject.country-name.label")}
            />
            <TextField
              name="L"
              label={t("certificates.subject.locality-name.label")}
              placeholder={t("certificates.subject.locality-name.placeholder")}
            />
            <TextField
              name="ST"
              label={t("certificates.subject.state-or-province-name.label")}
              placeholder={t(
                "certificates.subject.state-or-province-name.placeholder"
              )}
            />
          </div>
        </div>
        <div className={styles.divider}></div>
        <KeyUsagesCheckboxGroup
          onChange={(val) => {
            extendedKeyUsageExtension.current = val;
          }}
        />
        <div className={styles.divider}></div>
        <CertificateKeyPropertiesSelect
          className={styles.key_properties_select}
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
