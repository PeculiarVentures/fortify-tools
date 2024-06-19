import React, { useEffect, useRef } from "react";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import { Pkcs10CertificateRequest, X509Certificate } from "@peculiar/x509";
import { useToast } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import { useLockBodyScroll } from "react-use";
import { FortifyAPI } from "@peculiar/fortify-client-core";
import { CertificateImportDialog } from "../../components/certificate-import-dialog";
import { certificateConvertRaw } from "../../utils/certificate";
import { CertificateType } from "src/types";

export function useCertificateImportDialog(props: {
  providers: IProviderInfo[];
  currentProviderId?: string;
  fortifyClient?: FortifyAPI | null;
  onSuccess: (providerId: string) => void;
}) {
  const { providers, currentProviderId, fortifyClient, onSuccess } = props;
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [certificatePem, setCertificatePem] = React.useState("");
  const [certificateType, setCertificateType] =
    React.useState<CertificateType>();
  const [certificate, setCertificate] = React.useState<
    Pkcs10CertificateRequest | X509Certificate | null
  >(null);
  const [isTextAreaError, setIsTextAreaError] = React.useState(false);

  const localCurrentProviderId = useRef(currentProviderId);
  useEffect(() => {
    localCurrentProviderId.current = currentProviderId;
  }, [currentProviderId]);

  const handleClose = () => {
    setCertificate(null);
    setCertificatePem("");
    setCertificateType(undefined);
    setIsOpen(false);
  };

  const handleCertificateImport = async () => {
    if (!localCurrentProviderId?.current) {
      localCurrentProviderId.current = currentProviderId;
    }
    if (!fortifyClient || !localCurrentProviderId.current || !certificate) {
      return;
    }

    setIsLoading(true);

    try {
      const provider = await fortifyClient.getProviderById(
        localCurrentProviderId.current
      );

      const cert = await provider.certStorage.importCert(
        certificateType === "csr" ? "request" : "x509",
        certificate.rawData,
        certificate.signatureAlgorithm,
        []
      );

      await provider.certStorage.setItem(cert);

      onSuccess(localCurrentProviderId.current as string);
      handleClose();
      addToast({
        message: t("certificates.dialog.import.success-message"),
        variant: "success",
        disableIcon: true,
        isClosable: true,
      });
    } catch (error) {
      addToast({
        message: t("certificates.dialog.import.failure-message"),
        variant: "wrong",
        disableIcon: true,
        isClosable: true,
      });
    }
    setIsLoading(false);
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
        setCertificateType("csr");
        setCertificate(certr);
        setCertificatePem(certr.toString("pem"));
      } else {
        const cert = new X509Certificate(buf);
        setCertificateType("x509");
        setCertificate(cert);
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
      setCertificateType("x509");
      setCertificate(cert);
      setCertificatePem(cert.toString("pem"));
      setIsTextAreaError(false);
      return;
    } catch (error) {
      isInValid = true;
    }

    try {
      const certr = new Pkcs10CertificateRequest(buf);
      setCertificateType("csr");
      setCertificate(certr);
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
          onDialogClose={handleClose}
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
