import React, { useRef } from "react";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import { Pkcs10CertificateRequest, X509Certificate } from "@peculiar/x509";
import { useToast } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import { useLockBodyScroll } from "react-use";
import { CertificateImportDialog } from "../../components/certificate-import-dialog";
import { certificateConvertRaw } from "../../utils/certificate";

export function useCertificateImportDialog(props: {
  providers: IProviderInfo[];
  currentProviderId?: string;
}) {
  const { providers, currentProviderId } = props;
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [certificatePem, setCertificatePem] = React.useState("");
  const [isTextAreaError, setIsTextAreaError] = React.useState(false);

  const localCurrentProviderId = useRef(currentProviderId);

  const handleCertificateImport = () => {
    // Check provider
    if (!localCurrentProviderId?.current) {
      localCurrentProviderId.current = currentProviderId;
    }
    // TODO: add logic
    console.log("Import", certificatePem);
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

  const onDropAccepted = (
    fileContent: ArrayBuffer,
    extension: string,
    fileType: string
  ) => {
    const buf = certificateConvertRaw(fileContent);

    try {
      if (extension === "csr" || fileType === "application/pkcs10") {
        const certr = new Pkcs10CertificateRequest(buf);
        setCertificatePem(certr.toString("pem"));
      } else {
        const cert = new X509Certificate(buf);
        setCertificatePem(cert.toString("pem"));
      }
    } catch (error) {
      addToast({
        message: t("certificates.dialog.import.certificate.error.invalid-data"),
        variant: "wrong",
        disableIcon: true,
        isClosable: true,
      });
    }

    setIsTextAreaError(false);
  };

  const handleTextAreaBlur = () => {
    if (!certificatePem?.length) {
      setIsTextAreaError(true);
      return;
    }

    const buf = certificateConvertRaw(certificatePem);
    let isInValid = false;

    try {
      const cert = new X509Certificate(buf);
      setCertificatePem(cert.toString("pem"));
      setIsTextAreaError(false);
      return;
    } catch (error) {
      isInValid = true;
    }

    try {
      const certr = new Pkcs10CertificateRequest(buf);
      setCertificatePem(certr.toString("pem"));
      setIsTextAreaError(false);
      return;
    } catch (error) {
      isInValid = true;
    }

    setIsTextAreaError(isInValid);
  };

  useLockBodyScroll(isOpen);

  return {
    open: () => setIsOpen(true),
    dialog: () =>
      isOpen ? (
        <CertificateImportDialog
          certificate={certificatePem}
          isTextAreaError={isTextAreaError}
          onTextAreaChange={(value) => {
            setCertificatePem(value);
            setIsTextAreaError(false);
          }}
          onTextAreaBlur={handleTextAreaBlur}
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
            setCertificatePem("");
            setIsTextAreaError(false);
          }}
          loading={isLoading}
        />
      ) : null,
  };
}
