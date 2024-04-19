import "./global.scss";
import "./i18n";
import { AppProviders } from "./components/app-providers";
import { useApp } from "./hooks/app";
import { FetchingStatusOwerlay } from "./components/fetching-status-owerlay";
import { CertificatesList } from "./components/certificates-list";
import { CertificatesSidebar } from "./components/certificates-sidebar";
import { CertificatesProvidersList } from "./components/certificates-providers-list";
import styles from "./app.module.scss";

export function App() {
  const {
    fetching,
    challenge,
    providers,
    currentProviderId,
    certificates,
    getCertificatesByProviderId,
  } = useApp();

  return (
    <AppProviders>
      <div className={styles.layout}>
        <div className={styles.sidebar_placeholder}>
          <CertificatesSidebar className={styles.sidebar}>
            {fetching.providers === "pending" ? (
              // TODO: add loading skeleton
              "Loading providers list..."
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
    </AppProviders>
  );
}
