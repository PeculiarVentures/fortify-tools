import { PeculiarCertificatesViewer } from "@peculiar/certificates-viewer-react";
import { Convert } from "pvtsutils";
import "@peculiar/certificates-viewer/dist/peculiar/peculiar.css";
import { useCertificates } from "./useCertificates";
import { FetchingStatusOwerlay } from "../fetching-status-owerlay";
import { CertificatesProvidersList } from "../certificates-providers-list";

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
    <div>
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
      {fetching.certificates ? (
        <>
          <PeculiarCertificatesViewer
            certificates={certificates.map((certificate) => ({
              value: Convert.ToBase64(certificate.raw),
            }))}
          />
        </>
      ) : null}
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
    </div>
  );
};
