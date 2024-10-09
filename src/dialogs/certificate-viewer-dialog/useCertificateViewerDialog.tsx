import React from "react";
import { useLockBodyScroll } from "react-use";
import { FortifyAPI } from "@peculiar/fortify-client-core";
import cloneDeep from "lodash/cloneDeep";
import { X509Certificate } from "@peculiar/x509";
import { getCertificateSubject } from "../../utils/certificate";
import { CertificateViewerDialog } from "../../components/certificate-viewer-dialog";
import { CertificateProps } from "../../types";

type UseCertificateViewerInitialParams = {
  currentProviderId?: string;
  fortifyClient: FortifyAPI | null;
};

export function useCertificateViewerDialog(
  props: UseCertificateViewerInitialParams
) {
  const { currentProviderId, fortifyClient } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const certificatesRef = React.useRef<CertificateProps[]>();

  const handleOpen = async (certificate: CertificateProps) => {
    let currentCertificates: CertificateProps[] = [certificate];

    try {
      if (fortifyClient && currentProviderId && certificate.type === "x509") {
        const localProvider =
          await fortifyClient.getProviderById(currentProviderId);

        const certificateCopy = cloneDeep(certificate);
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
    setIsOpen(true);
  };

  const handleClose = () => {
    certificatesRef.current = undefined;
    setIsOpen(false);
  };

  useLockBodyScroll(isOpen);

  return {
    open: handleOpen,
    dialog: () =>
      isOpen && certificatesRef.current ? (
        <CertificateViewerDialog
          certificates={certificatesRef.current}
          onClose={handleClose}
        />
      ) : null,
  };
}
