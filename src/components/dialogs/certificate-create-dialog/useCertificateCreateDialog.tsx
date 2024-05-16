import React, { useRef } from "react";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import { useToast } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import { CertificateCreateDialog } from "src/components/certificate-create-dialog";
import { CertificateType } from "../../../types";

export function useCertificateCreateDialog(props: {
  providers: IProviderInfo[];
  currentProviderId?: string;
  handleProviderChange: (certificate: string) => void;
}) {
  const { providers, currentProviderId, handleProviderChange } = props;
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const dialogType = useRef<CertificateType>("x509");

  // TODO: fix unknown
  const handleCertificateCreate = (data: unknown) => {
    // TODO: add logic
    console.log("Create", data);
    // temporary behaviour
    setIsLoading(true);
    setTimeout(function () {
      setIsLoading(false);
      addToast({
        message: t("certificates.dialog.create.failure-message"),
        variant: "wrong",
        disableIcon: true,
        isClosable: true,
      });
    }, 1000);
  };

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
          onProviderSelect={handleProviderChange}
          providers={providers}
          currentProviderId={currentProviderId}
          loading={isLoading}
        />
      ) : null,
  };
}
