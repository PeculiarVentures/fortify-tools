import "./global.scss";
import "./i18n";
import { useApp } from "./hooks/app";
import { FetchingStatusOwerlay } from "./components/fetching-status-owerlay";
import { CertificatesList } from "./components/certificates-list";
import { CertificatesSidebar } from "./components/certificates-sidebar";
import { CertificatesProvidersList } from "./components/certificates-providers-list";
import { CertificatesTopbar } from "./components/certificates-topbar";
import { CertificateDeleteDialog } from "./components/certificate-delete-dialog";
import { CertificateViewerDialog } from "./components/certificate-viewer-dialog";
import { useCertificateImportDialog } from "./dialogs/certificate-import-dialog";

import styles from "./app.module.scss";

export function App() {
  const {
    fetching,
    challenge,
    providers,
    currentProviderId,
    certificates,
    currentCertificatDelete,
    currentCertificateViewerValue,
    handleProviderChange,
    handleCertificatesSearch,
    handleCertificateCreate,
    handleCertificateDeleteDialogOpen,
    handleCertificateDeleteDialogClose,
    handleCertificateDelete,
    handleCertificateViewerOpen,
    handleCertificateViewerClose,
  } = useApp();

  const {
    open: handleCertificateImportDialogOpen,
    dialog: certificateImportDialog,
  } = useCertificateImportDialog({
    providers,
    handleProviderChange,
    currentProviderId,
  });

  return (
    <>
      <CertificatesSidebar className={styles.sidebar}>
        {fetching.providers === "pending" ? (
          // TODO: add loading skeleton
          "Loading providers list..."
        ) : (
          <CertificatesProvidersList
            providers={providers}
            currentProviderId={currentProviderId}
            onSelect={handleProviderChange}
          />
        )}
      </CertificatesSidebar>
      <CertificatesTopbar
        className={styles.top_bar}
        onSearch={handleCertificatesSearch}
        onImport={handleCertificateImportDialogOpen}
        onCreate={handleCertificateCreate}
      ></CertificatesTopbar>
      {fetching.certificates ? (
        <CertificatesList
          certificates={certificates}
          onDelete={handleCertificateDeleteDialogOpen}
          onViewDetails={handleCertificateViewerOpen}
        />
      ) : null}
      {currentCertificatDelete?.id ? (
        <CertificateDeleteDialog
          certificateId={currentCertificatDelete.id}
          certificateName={currentCertificatDelete.name}
          loading={currentCertificatDelete?.loading}
          onDialogClose={handleCertificateDeleteDialogClose}
          onDeleteClick={handleCertificateDelete}
        />
      ) : null}

      <FetchingStatusOwerlay fetching={fetching} challenge={challenge} />
      {currentCertificateViewerValue ? (
        <CertificateViewerDialog
          certificate={currentCertificateViewerValue}
          onClose={handleCertificateViewerClose}
        />
      ) : null}
      {certificateImportDialog()}
    </>
  );
}
