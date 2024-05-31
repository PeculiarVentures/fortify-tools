import React, { useRef } from "react";
import {
  IProviderInfo,
  FortifyAPI,
  EHashAlgorithm,
  ESignatureAlgorithm,
} from "@peculiar/fortify-client-core";
import { useToast } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import { useLockBodyScroll } from "react-use";
import { certificateSubjectToString } from "../../utils/certificate";
import {
  CertificateCreateDataProps,
  CertificateCreateDialog,
} from "../../components/certificate-create-dialog";
import { CertificateType } from "../../types";

export function useCertificateCreateDialog(props: {
  providers: IProviderInfo[];
  currentProviderId?: string;
  fortifyClient: FortifyAPI | null;
  onSuccess: (
    type: CertificateType,
    providerId: string,
    certRaw: ArrayBuffer,
    label: string
  ) => void;
}) {
  const { providers, currentProviderId, fortifyClient, onSuccess } = props;
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const localCurrentProviderId = useRef(currentProviderId);

  const dialogType = useRef<CertificateType>("x509");

  const handleCertificateCreate = async (data: CertificateCreateDataProps) => {
    if (!localCurrentProviderId?.current) {
      localCurrentProviderId.current = currentProviderId;
    }
    const subject = certificateSubjectToString(data.subject);
    const { type, algorithm } = data;
    setIsLoading(true);
    try {
      let newCert;
      if (type === "x509") {
        newCert = await fortifyClient?.createX509(
          localCurrentProviderId.current as string,
          {
            subjectName: subject,
            hashAlgorithm: algorithm?.hash as EHashAlgorithm,
            signatureAlgorithm: algorithm?.signature as ESignatureAlgorithm,
          }
        );
      } else if (type === "csr") {
        newCert = await fortifyClient?.createPKCS10(
          localCurrentProviderId.current as string,
          {
            subjectName: subject,
            hashAlgorithm: algorithm?.hash as EHashAlgorithm,
            signatureAlgorithm: algorithm?.signature as ESignatureAlgorithm,
          }
        );
      }
      if (newCert) {
        onSuccess(
          type,
          localCurrentProviderId.current as string,
          newCert.der,
          data.subject.CN
        );
        setIsOpen(false);
        addToast({
          message: t("certificates.dialog.create.success-message"),
          variant: "success",
          disableIcon: true,
          isClosable: true,
        });
      } else {
        addToast({
          message: t("certificates.dialog.create.failure-message"),
          variant: "wrong",
          disableIcon: true,
          isClosable: true,
        });
      }
    } catch (error) {
      addToast({
        message: t("certificates.dialog.create.failure-message"),
        variant: "wrong",
        disableIcon: true,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  useLockBodyScroll(isOpen);

  return {
    open: (type: CertificateType) => {
      dialogType.current = type;
      setIsOpen(true);
    },
    dialog: () =>
      isOpen ? (
        <CertificateCreateDialog
          onCreateButtonClick={handleCertificateCreate}
          type={dialogType.current}
          onDialogClose={() => setIsOpen(false)}
          onProviderSelect={(id) => {
            localCurrentProviderId.current = id;
          }}
          providers={providers}
          currentProviderId={currentProviderId}
          loading={isLoading}
        />
      ) : null,
  };
}
