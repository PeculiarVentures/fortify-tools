import "./global.scss";
import "./i18n";
import { useApp } from "./hooks/app";
import { FetchingStatusOwerlay } from "./components/fetching-status-owerlay";
import { CertificatesList } from "./components/certificates-list";
import { CertificatesSidebar } from "./components/certificates-sidebar";
import { CertificatesProvidersList } from "./components/certificates-providers-list";
import { CertificatesTopbar } from "./components/certificates-topbar";
import { useCertificateViewerDialog } from "./dialogs/certificate-viewer-dialog";
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
    handleCertificatesDataReload,
    handleProviderChange,
    handleCertificatesSearch,
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
    fortifyClient,
    onSuccess: (providerId) => {
      handleCertificatesDataReload(providerId);
    },
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

  const {
    open: handleCertificateViewerDialogOpen,
    dialog: certificateViewerDialog,
  } = useCertificateViewerDialog();

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
          onViewDetails={handleCertificateViewerDialogOpen}
          loading={
            !fetching.certificates || fetching.certificates === "pending"
          }
        />
      ) : null}

      <FetchingStatusOwerlay fetching={fetching} challenge={challenge} />
      {certificateViewerDialog()}
      {certificateDeleteDialog()}
      {certificateImportDialog()}
      {certificateCreateDialog()}
    </>
  );
}
