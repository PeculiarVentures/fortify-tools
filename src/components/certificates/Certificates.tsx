import { Select } from "@peculiar/react-components";
import { PeculiarCertificatesViewer } from "@peculiar/certificates-viewer-react";
import { Convert } from "pvtsutils";
import "@peculiar/certificates-viewer/dist/peculiar/peculiar.css";
import { useCertificates } from "./useCertificates";
import { FetchingStatusOwerlay } from "../fetching-status-owerlay";

export const Certificates = () => {
  const {
    fetching,
    challenge,
    providers,
    certificates,
    getCertificatesByProviderId,
  } = useCertificates();

  // if (fetching.providers === "resolved" && !providers.length) {
  //   return <h1>Empty providers list</h1>;
  // }

  // if (fetching.providers === "pending" && !!providers.length) {
  //   return (
  //     <div>
  //       <Select
  //         options={providers.map((provider) => ({
  //           label: provider.name,
  //           value: provider.id,
  //         }))}
  //       />
  //       <CircularProgress />
  //     </div>
  //   );
  // }

  return (
    <div>
      {fetching.certificates ? (
        <>
          <Select
            options={providers.map((provider) => ({
              label: provider.name,
              value: provider.id,
            }))}
            onChange={async (event) => {
              getCertificatesByProviderId(event.target.value);
            }}
          />
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
