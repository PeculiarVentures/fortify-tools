import React from "react";
import { IProviderInfo, FortifyAPI } from "@peculiar/fortify-client-core";
import { useLockBodyScroll } from "react-use";
import cloneDeep from "lodash/cloneDeep";
import { X509Certificate } from "@peculiar/x509";
import { getCertificateSubject } from "../../utils/certificate";
import { CertificateViewerDialog } from "../../components/certificate-viewer-dialog";
import { CertificateProps } from "../../types";

type UseCertificateViewerDialogOpenParams = {
  providerId: string;
  certificate: CertificateProps;
};

type UseCertificateViewerInitialParams = {
  providers: IProviderInfo[];
  currentProviderId?: string;
  fortifyClient: FortifyAPI | null;
};

export function useCertificateViewerDialog(
  props: UseCertificateViewerInitialParams
) {
  const { providers, currentProviderId, fortifyClient } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const openParamsRef = React.useRef<UseCertificateViewerDialogOpenParams>();
  const certificatesRef = React.useRef<CertificateProps[]>();

  const handleOpen = async (params: UseCertificateViewerDialogOpenParams) => {
    let currentCertificates: CertificateProps[] = [params.certificate];

    try {
      if (
        fortifyClient &&
        currentProviderId &&
        params.certificate.type === "x509"
      ) {
        const localProvider =
          await fortifyClient.getProviderById(currentProviderId);

        const certificateCopy = cloneDeep(params.certificate);
        certificateCopy.raw = null as unknown as ArrayBuffer;

        const chain = await localProvider.certStorage.getChain(certificateCopy);

        if (chain.length > 1) {
          currentCertificates = chain.map((chainItem) => {
            const cert = new X509Certificate(chainItem.value);
            return {
              ...cert,
              raw: cert.rawData,
              subjectName: cert.subject,
              subject: getCertificateSubject(cert.subject),
              type: "x509",
            } as unknown as CertificateProps;
          });
        }
      }
    } catch (error) {
      //
    }
    certificatesRef.current = currentCertificates;
    openParamsRef.current = params;
    setIsOpen(true);
  };

  const handleClose = () => {
    certificatesRef.current = undefined;
    openParamsRef.current = undefined;
    setIsOpen(false);
  };

  useLockBodyScroll(isOpen);

  const currentProvider = providers.find(
    ({ id }) => openParamsRef.current?.providerId === id
  );

  if (isOpen && !currentProvider) {
    handleClose();
  }

  return {
    open: handleOpen,
    dialog: () =>
      isOpen && openParamsRef.current && certificatesRef?.current ? (
        <CertificateViewerDialog
          certificates={certificatesRef.current}
          onClose={handleClose}
        />
      ) : null,
  };
}
