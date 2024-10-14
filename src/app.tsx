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
import { useSearchList } from "./hooks/search-list";
import { useCertificateImportDialog } from "./dialogs/certificate-import-dialog";
import { useCertificateCreateDialog } from "./dialogs/certificate-create-dialog";
import { useProviderInfoDialog } from "./dialogs/provider-info-dialog";

import styles from "./app.module.scss";

export function App() {
  const {
    fortifyClient,
    fetching,
    challenge,
    providers,
    currentProvider,
    certificates,
    isCurrentProviderLogedin,
    handleCertificatesDataReload,
    handleProviderChange,
    handleRetryConection,
    handleProviderLoginLogout,
    handleProviderResetAndRefreshList,
  } = useApp();

  const currentProviderId = currentProvider?.id;
  const isCurrentProviderReadOnly = Boolean(currentProvider?.readOnly);

  const {
    searchedText,
    list: searchedCertificate,
    handleSearch,
  } = useSearchList(certificates);

  const {
    open: handleCertificateDeleteDialogOpen,
    dialog: certificateDeleteDialog,
  } = useCertificateDeleteDialog({
    providers,
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
  } = useSortList(searchedCertificate, "notAfter");

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
  } = useCertificateViewerDialog({
    providers,
  });

  const { open: handleProviderInfoDialogOpen, dialog: providerInfoDialog } =
    useProviderInfoDialog({ providers });

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
        searchValue={searchedText}
        isDisabled={!currentProviderId}
        isReadOnly={
          isCurrentProviderReadOnly || fetching.certificates === "rejected"
        }
        className={styles.top_bar}
        onSearch={handleSearch}
        onImport={handleCertificateImportDialogOpen}
        onCreate={handleCertificateCreateDialogOpen}
        onReload={handleProviderResetAndRefreshList}
        onInfo={() =>
          currentProvider && handleProviderInfoDialogOpen(currentProvider)
        }
        isLoggedIn={isCurrentProviderLogedin}
        onLoginLogout={handleProviderLoginLogout}
      ></CertificatesTopbar>
      <CertificatesList
        currentSortName={currentSortName}
        currentSortDir={currentSortDir}
        onSort={handleSort}
        className={styles.certificate_list}
        certificates={sortedCertificates}
        onDelete={handleCertificateDeleteDialogOpen}
        onViewDetails={handleCertificateViewerDialogOpen}
        loading={!fetching.certificates || fetching.certificates === "pending"}
        highlightedText={searchedText}
        isLoggedIn={isCurrentProviderLogedin}
        isReadOnly={isCurrentProviderReadOnly}
      />
      <FetchingStatusOwerlay
        fetching={fetching}
        challenge={challenge}
        onReload={handleRetryConection}
      />
      {providers.length ? (
        <>
          {certificateViewerDialog()}
          {certificateDeleteDialog()}
          {certificateImportDialog()}
          {certificateCreateDialog()}
          {providerInfoDialog()}
        </>
      ) : null}

      <div className={styles.certificate_list_corners_backdrop}></div>
    </>
  );
}
