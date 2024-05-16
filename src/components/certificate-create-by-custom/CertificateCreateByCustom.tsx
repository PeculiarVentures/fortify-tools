import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CertificateAlgorithmProps,
  CertificateSubjectProps,
  CertificateType,
} from "../../types";
import { Button, TextField, Typography } from "@peculiar/react-components";
import { CertificateKeyPropertiesSelect } from "../certificate-key-properties-select";
import { Card } from "../card";
import { KeyUsagesCheckboxGroup } from "../key-usages-checkbox-group";
import { CountrySelect } from "../country-select";

import { validateEmail } from "../../utils/validators";
import { ICertificateKeyUsageExtensions } from "../../config/data";

import styles from "./styles/index.module.scss";

export interface ICertificateCreateByCustomData {
  subject: CertificateSubjectProps;
  algorithm?: CertificateAlgorithmProps;
  extendedKeyUsageExtension: ICertificateKeyUsageExtensions[];
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
  const organizationName =
    useRef<CertificateSubjectProps["organizationName"]>();
  const organizationalUnitName =
    useRef<CertificateSubjectProps["organizationalUnitName"]>();
  const localityName = useRef<CertificateSubjectProps["localityName"]>();
  const stateOrProvinceName =
    useRef<CertificateSubjectProps["stateOrProvinceName"]>();
  const countryName = useRef<CertificateSubjectProps["countryName"]>();

  const isCreateButtonDisabled =
    !emailAddress.length ||
    isEmailAddressError ||
    !cname.length ||
    isCnameError;

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
            <TextField
              onChange={(event) => {
                organizationName.current = event.target.value;
              }}
              label={t("certificates.subject.organization-name.label")}
              placeholder={t(
                "certificates.subject.organization-name.placeholder"
              )}
            />
            <TextField
              onChange={(event) => {
                organizationalUnitName.current = event.target.value;
              }}
              label={t("certificates.subject.organization-unit-name.label")}
            />
            <CountrySelect
              label={t("certificates.subject.country-name.label")}
              placeholder={t("certificates.subject.country-name.placeholder")}
              onSelect={(code) => {
                countryName.current = code;
              }}
            />
            <TextField
              onChange={(event) => {
                localityName.current = event.target.value;
              }}
              label={t("certificates.subject.locality-name.label")}
              placeholder={t("certificates.subject.locality-name.placeholder")}
            />
            <TextField
              onChange={(event) => {
                stateOrProvinceName.current = event.target.value;
              }}
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
          onSelect={(val) => {
            algorithm.current = val;
          }}
        />
      </Card>

      <div className={styles.button_group}>
        <Button
          variant="contained"
          color="primary"
          disabled={isCreateButtonDisabled}
          onClick={() => {
            const data: ICertificateCreateByCustomData = {
              subject: {
                commonName: cname,
                emailAddress,
              },
              algorithm: algorithm.current,
              extendedKeyUsageExtension: extendedKeyUsageExtension.current,
            };
            if (organizationName?.current) {
              data.subject.organizationName = organizationName.current;
            }
            if (organizationalUnitName?.current) {
              data.subject.organizationalUnitName =
                organizationalUnitName.current;
            }
            if (localityName?.current) {
              data.subject.localityName = localityName.current;
            }
            if (stateOrProvinceName?.current) {
              data.subject.stateOrProvinceName = stateOrProvinceName.current;
            }
            if (countryName?.current) {
              data.subject.countryName = countryName.current;
            }
            onCreateButtonClick(data);
          }}
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
