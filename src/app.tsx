import "./global.scss";
import "./i18n";
import { AppProviders } from "./components/app-providers";
import { useApp } from "./hooks/app";
import { FetchingStatusOwerlay } from "./components/fetching-status-owerlay";
import { CertificatesList } from "./components/certificates-list";
import { CertificatesSidebar } from "./components/certificates-sidebar";
import { CertificatesProvidersList } from "./components/certificates-providers-list";
import { CertificatesTopbar } from "./components/certificates-topbar";
import styles from "./app.module.scss";

export function App() {
  const {
    fetching,
    challenge,
    providers,
    currentProviderId,
    certificates,
    handleProviderChange,
    handleCertificatesSearch,
    handleCertificateImport,
    handleCertificateCreate,
  } = useApp();

  return (
    <AppProviders>
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
              handleProviderChange(id);
            }}
          />
        )}
      </CertificatesSidebar>
      <CertificatesTopbar
        className={styles.top_bar}
        onSearch={handleCertificatesSearch}
        onImport={handleCertificateImport}
        onCreate={handleCertificateCreate}
      ></CertificatesTopbar>
      {fetching.certificates ? (
        <CertificatesList certificates={certificates} />
      ) : null}
      <FetchingStatusOwerlay fetching={fetching} challenge={challenge} />
    </AppProviders>
  );
}
