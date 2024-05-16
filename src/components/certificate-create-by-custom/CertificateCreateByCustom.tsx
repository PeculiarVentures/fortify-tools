import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, TextField, Typography } from "@peculiar/react-components";
import { CertificateKeyPropertiesSelect } from "../certificate-key-properties-select";
import { Card } from "../card";
import { KeyUsagesCheckboxGroup } from "../key-usages-checkbox-group";

import { validateEmail } from "../../utils/validators";
import { ICertificateKeyUsageExtensions } from "../../config/data";

import styles from "./styles/index.module.scss";

export interface ICertificateCreateByCustomData {
  subject: {
    emailAddress: string;
    commonName: string;
  };
  algorithm?: RsaHashedKeyGenParams | Partial<EcKeyGenParams>;
  extendedKeyUsageExtension: ICertificateKeyUsageExtensions[];
}

interface CertificateCreateByCustomProps {
  type: "x509" | "csr";
  onCreateButtonClick: (data: ICertificateCreateByCustomData) => void;
}

export const CertificateCreateByCustom: React.FunctionComponent<
  CertificateCreateByCustomProps
> = (props) => {
  const { type = "x509", onCreateButtonClick } = props;

  const { t } = useTranslation();

  const [isDirty, setIsDirty] = useState<boolean>(false);

  const [cname, setCname] = useState<string>("");
  const [isCnameError, setIsCnameError] = useState<boolean>(false);

  const [emailAddress, setEmailAddress] = useState<string>("");
  const [isEmailAddressError, setIsEmailAddressError] =
    useState<boolean>(false);
  const [emailAddressErrorMessage, setEmailAddressErrorMessage] = useState<
    string | undefined
  >(undefined);

  const extendedKeyUsageExtension = useRef<ICertificateKeyUsageExtensions[]>(
    []
  );

  const algorithm = useRef<ICertificateCreateByCustomData["algorithm"]>();

  return (
    <div className={styles.form_box}>
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
              value={cname}
              onChange={(event) => {
                setCname(event.target.value);
                if (!isDirty) {
                  setIsDirty(true);
                }
              }}
              label={t("certificates.subject.cname.label")}
              placeholder={t("certificates.subject.cname.placeholder-2")}
              onBlur={() => isDirty && setIsCnameError(!cname.length)}
              error={isCnameError}
              errorText={t("certificates.subject.cname.error.required")}
            />
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
                    setIsEmailAddressError(true);
                    setEmailAddressErrorMessage(
                      t("certificates.subject.email-address.error.required")
                    );
                    return;
                  } else if (!validateEmail(emailAddress)) {
                    setIsEmailAddressError(true);
                    setEmailAddressErrorMessage(
                      t("certificates.subject.email-address.error.type")
                    );
                    return;
                  }
                  setIsEmailAddressError(false);
                }
              }}
              error={isEmailAddressError}
              errorText={emailAddressErrorMessage}
              type="email"
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
          onSelect={(val) => {
            algorithm.current = val;
          }}
        />
      </Card>

      <div className={styles.button_group}>
        <Button
          variant="contained"
          color="primary"
          disabled={
            !emailAddress.length ||
            isEmailAddressError ||
            !cname.length ||
            isCnameError
          }
          onClick={() =>
            onCreateButtonClick({
              subject: {
                commonName: cname,
                emailAddress,
              },
              algorithm: algorithm.current,
              extendedKeyUsageExtension: extendedKeyUsageExtension.current,
            })
          }
        >
          {t(`certificates.button-create.${type}`)}
        </Button>
      </div>
    </div>
  );
};
