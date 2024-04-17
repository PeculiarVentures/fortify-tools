import { Select, CircularProgress } from "@peculiar/react-components";
import {
  PeculiarCertificatesViewer,
  // PeculiarCertificateViewer,
} from "@peculiar/certificates-viewer-react";
import { Convert } from "pvtsutils";
import "@peculiar/certificates-viewer/dist/peculiar/peculiar.css";
import { useCertificates } from "./useCertificates";

export const Certificates = () => {
  const {
    fetching,
    challenge,
    providers,
    certificates,
    getCertificatesByProviderId,
  } = useCertificates();

  if (fetching.connectionClientUpdate === "rejected") {
    return <h1>Update client</h1>;
  }

  if (fetching.connectionSupport === "rejected") {
    return <h1>Connection not supported</h1>;
  }

  if (fetching.connectionDetect === "rejected") {
    return <h1>Connection not detected</h1>;
  }

  if (fetching.connectionApprove === "rejected") {
    return <h1>Connection not approved</h1>;
  }

  if (fetching.connectionApprove === "pending" && !!challenge) {
    return (
      <h1>
        Approve connection:
        {challenge}
      </h1>
    );
  }

  if (fetching.providers === "resolved" && !providers.length) {
    return <h1>Empty providers list</h1>;
  }

  if (fetching.providers === "pending" && !!providers.length) {
    return (
      <div>
        <Select
          options={providers.map((provider) => ({
            label: provider.name,
            value: provider.id,
          }))}
        />
        <CircularProgress />
      </div>
    );
  }

  if (fetching.certificates) {
    return (
      <div>
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
  }

  if (
    fetching.connectionDetect === "pending" ||
    fetching.connectionSupport === "pending" ||
    fetching.connectionApprove === "pending" ||
    fetching.providers === "pending"
  ) {
    return <CircularProgress />;
  }

  return <h1>Unresolved status</h1>;
};
