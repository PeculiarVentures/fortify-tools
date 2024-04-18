// import { PeculiarCertificatesViewer } from "@peculiar/certificates-viewer-react";
// import { Convert } from "pvtsutils";
import { useCertificates } from "./useCertificates";
import { FetchingStatusOwerlay } from "../fetching-status-owerlay";
import { CertificatesProvidersList } from "../certificates-providers-list";
import { CertificatesList } from "../certificates-list";
import { CertificatesSidebar } from "../certificates-sidebar";

import styles from "./styles/index.module.scss";

export const Certificates = () => {
  const {
    fetching,
    challenge,
    providers,
    currentProviderId,
    certificates,
    getCertificatesByProviderId,
  } = useCertificates();

  return (
    <>
      <div className={styles.layout}>
        <div className={styles.sidebar_placeholder}>
          <CertificatesSidebar className={styles.sidebar}>
            {fetching.providers === "pending" ? (
              // TODO: add loading sceleton
              "Loading providers..."
            ) : (
              <CertificatesProvidersList
                providers={providers}
                currentProviderId={currentProviderId}
                onSelect={(id) => {
                  if (
                    currentProviderId === id ||
                    fetching.certificates === "pending"
                  ) {
                    return;
                  }
                  getCertificatesByProviderId(id);
                }}
              />
            )}
          </CertificatesSidebar>
        </div>
        <div className={styles.content}>
          {fetching.certificates ? (
            <>
              <CertificatesList certificates={certificates} />
              {/* <PeculiarCertificatesViewer
            certificates={certificates.map((certificate) => ({
              value: Convert.ToBase64(certificate.raw),
            }))}
          /> */}
            </>
          ) : null}
        </div>
      </div>
      <FetchingStatusOwerlay fetching={fetching} challenge={challenge} />
      {/* {certificates.map((certificate) => {
          return (
            <PeculiarCertificateViewer
              key={certificate.index}
              certificate={Convert.ToBase64(certificate.raw)}
              download={true}
            />
          );
        })} */}
    </>
  );
};
