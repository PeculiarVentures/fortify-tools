import React, { useRef } from "react";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import { X509Certificate } from "@peculiar/x509";
import { useToast } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import { CertificateImportDialog } from "../../components/certificate-import-dialog";

export function useCertificateImportDialog(props: {
  providers: IProviderInfo[];
  currentProviderId?: string;
}) {
  const { providers, currentProviderId } = props;
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [certificate, setCertificate] = React.useState("");
  const [isTextAreaError, setIsTextAreaError] = React.useState(false);

  const localCurrentProviderId = useRef(currentProviderId);

  const handleCertificateImport = () => {
    // Check provider
    if (!localCurrentProviderId?.current) {
      localCurrentProviderId.current = currentProviderId;
    }
    // TODO: add logic
    console.log("Import", certificate);
    console.log("localCurrentProviderId", localCurrentProviderId?.current);
    // temporary behaviour
    setIsLoading(true);
    setTimeout(function () {
      setIsLoading(false);
      addToast({
        message: t("certificates.dialog.import.failure-message"),
        variant: "wrong",
        disableIcon: true,
        isClosable: true,
      });
    }, 1000);
  };

  const onDropAccepted = (fileContent: ArrayBuffer) => {
    const x509Cert = new X509Certificate(fileContent);

    setCertificate(x509Cert.toString("pem"));
    setIsTextAreaError(false);
  };

  return {
    open: () => setIsOpen(true),
    dialog: () =>
      isOpen ? (
        <CertificateImportDialog
          certificate={certificate}
          isTextAreaError={isTextAreaError}
          onTextAreaChange={(value) => {
            setCertificate(value);
            setIsTextAreaError(false);
          }}
          onTextAreaBlur={() => {
            try {
              certificate?.length && new X509Certificate(certificate);

              setIsTextAreaError(false);
            } catch (error) {
              setIsTextAreaError(true);
            }
          }}
          onDropAccepted={onDropAccepted}
          onDropError={() => {
            addToast({
              message: t(
                "certificates.dialog.import.certificate.error.invalid-data"
              ),
              variant: "wrong",
              disableIcon: true,
              isClosable: true,
            });
          }}
          onDropRejected={(msg) => {
            addToast({
              message: msg,
              variant: "wrong",
              disableIcon: true,
              isClosable: true,
            });
          }}
          onDialogClose={() => setIsOpen(false)}
          onProviderSelect={(id) => {
            localCurrentProviderId.current = id;
          }}
          providers={providers}
          currentProviderId={currentProviderId}
          onImportButtonClick={handleCertificateImport}
          onClearButtonClick={() => {
            setCertificate("");
            setIsTextAreaError(false);
          }}
          loading={isLoading}
        />
      ) : null,
  };
}
