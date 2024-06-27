import "./global.scss";
import "./i18n";
import { useApp } from "./hooks/app";
import { FetchingStatusOwerlay } from "./components/fetching-status-owerlay";
import { CertificatesList } from "./components/certificates-list";
import { CertificatesSidebar } from "./components/certificates-sidebar";
import { CertificatesProvidersList } from "./components/certificates-providers-list";
import { CertificatesTopbar } from "./components/certificates-topbar";
import { CertificateViewerDialog } from "./components/certificate-viewer-dialog";
import { useCertificateDeleteDialog } from "./dialogs/certificate-delete-dialog";
import { useSortList } from "./hooks/sort-list";
import { useCertificateImportDialog } from "./dialogs/certificate-import-dialog";
import { useCertificateCreateDialog } from "./dialogs/certificate-create-dialog";

import styles from "./app.module.scss";

export function App() {
  const {
    fortifyClient,
    fetching,
    challenge,
    providers,
    currentProviderId,
    certificates,
    currentCertificateViewerValue,
    handleCertificatesDataReload,
    handleProviderChange,
    handleCertificatesSearch,
    handleCertificateViewerOpen,
    handleCertificateViewerClose,
  } = useApp();

  const {
    open: handleCertificateDeleteDialogOpen,
    dialog: certificateDeleteDialog,
  } = useCertificateDeleteDialog({
    fortifyClient,
    onSuccess: (providerId) => {
      handleCertificatesDataReload(providerId);
    },
  });

  const {
    list: sortedCertificates,
    name: currentSortName,
    derection: currentSortDir,
    handleSort,
  } = useSortList(certificates, "notAfter");

  const {
    open: handleCertificateImportDialogOpen,
    dialog: certificateImportDialog,
  } = useCertificateImportDialog({
    providers,
    currentProviderId,
  });

  const {
    open: handleCertificateCreateDialogOpen,
    dialog: certificateCreateDialog,
  } = useCertificateCreateDialog({
    providers,
    currentProviderId,
    fortifyClient,
    onSuccess: (providerId) => {
      handleCertificatesDataReload(providerId);
    },
  });

  return (
    <>
      <CertificatesSidebar className={styles.sidebar}>
        <CertificatesProvidersList
          providers={providers}
          currentProviderId={currentProviderId}
          onSelect={handleProviderChange}
          loading={!fetching.providers || fetching.providers === "pending"}
        />
      </CertificatesSidebar>
      <CertificatesTopbar
        className={styles.top_bar}
        onSearch={handleCertificatesSearch}
        onImport={handleCertificateImportDialogOpen}
        onCreate={handleCertificateCreateDialogOpen}
      ></CertificatesTopbar>
      {fetching.certificates ? (
        <CertificatesList
          currentSortName={currentSortName}
          currentSortDir={currentSortDir}
          onSort={handleSort}
          className={styles.certificate_list}
          certificates={sortedCertificates}
          onDelete={handleCertificateDeleteDialogOpen}
          onViewDetails={handleCertificateViewerOpen}
        />
      ) : null}

      <FetchingStatusOwerlay fetching={fetching} challenge={challenge} />
      {currentCertificateViewerValue ? (
        <CertificateViewerDialog
          certificate={currentCertificateViewerValue}
          onClose={handleCertificateViewerClose}
        />
      ) : null}
      {certificateDeleteDialog()}
      {certificateImportDialog()}
      {certificateCreateDialog()}
    </>
  );
}
