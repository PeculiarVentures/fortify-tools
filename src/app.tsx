import './global.scss';
import './i18n';
import { CertificatesList } from './components/certificates-list';
import { CertificatesProvidersList } from './components/certificates-providers-list';
import { CertificatesSidebar } from './components/certificates-sidebar';
import { CertificatesTopbar } from './components/certificates-topbar';
import { ConnectionNotSupported } from './components/connection-not-supported';
import { FetchingStatusOwerlay } from './components/fetching-status-owerlay';
import { useCertificateCreateDialog } from './dialogs/certificate-create-dialog';
import { useCertificateDeleteDialog } from './dialogs/certificate-delete-dialog';
import { useCertificateImportDialog } from './dialogs/certificate-import-dialog';
import { useCertificateViewerDialog } from './dialogs/certificate-viewer-dialog';
import { useProviderInfoDialog } from './dialogs/provider-info-dialog';
import { useApp } from './hooks/app';
import { useSearchList } from './hooks/search-list';
import { useSortList } from './hooks/sort-list';
import styles from './app.module.scss';

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

  const { searchedText, list: searchedCertificate, handleSearch } = useSearchList(certificates);

  const { open: handleCertificateDeleteDialogOpen, dialog: certificateDeleteDialog } =
    useCertificateDeleteDialog({
      providers,
      fortifyClient,
      onSuccess: (providerId) => {
        void handleCertificatesDataReload(providerId);
      },
    });

  const {
    list: sortedCertificates,
    name: currentSortName,
    derection: currentSortDir,
    handleSort,
  } = useSortList(searchedCertificate, 'notAfter');

  const { open: handleCertificateImportDialogOpen, dialog: certificateImportDialog } =
    useCertificateImportDialog({
      providers,
      currentProviderId,
      fortifyClient,
      onSuccess: (providerId) => {
        if (currentProviderId !== providerId) return;
        void handleCertificatesDataReload(providerId);
      },
    });

  const { open: handleCertificateCreateDialogOpen, dialog: certificateCreateDialog } =
    useCertificateCreateDialog({
      providers,
      currentProviderId,
      fortifyClient,
      onSuccess: (providerId) => {
        if (currentProviderId !== providerId) return;
        void handleCertificatesDataReload(providerId);
      },
    });

  const { open: handleCertificateViewerDialogOpen, dialog: certificateViewerDialog } =
    useCertificateViewerDialog({
      providers,
      currentProviderId,
      fortifyClient,
    });

  const { open: handleProviderInfoDialogOpen, dialog: providerInfoDialog } = useProviderInfoDialog({
    providers,
  });

  if (fetching.connectionSupport === 'rejected') {
    return <ConnectionNotSupported />;
  }

  return (
    <>
      <CertificatesSidebar className={styles.sidebar}>
        <CertificatesProvidersList
          providers={providers}
          currentProviderId={currentProviderId}
          loading={!fetching.providers || fetching.providers === 'pending'}
          onSelect={handleProviderChange}
        />
      </CertificatesSidebar>
      <CertificatesTopbar
        searchValue={searchedText}
        isDisabled={!currentProviderId}
        isReadOnly={isCurrentProviderReadOnly || fetching.certificates === 'rejected'}
        className={styles.top_bar}
        isLoggedIn={isCurrentProviderLogedin}
        onSearch={handleSearch}
        onImport={handleCertificateImportDialogOpen}
        onCreate={handleCertificateCreateDialogOpen}
        onReload={handleProviderResetAndRefreshList}
        onInfo={() => currentProvider && handleProviderInfoDialogOpen(currentProvider)}
        onLoginLogout={handleProviderLoginLogout}
      ></CertificatesTopbar>
      <CertificatesList
        currentSortName={currentSortName}
        currentSortDir={currentSortDir}
        className={styles.certificate_list}
        certificates={sortedCertificates}
        loading={!fetching.certificates || fetching.certificates === 'pending'}
        highlightedText={searchedText}
        isLoggedIn={isCurrentProviderLogedin}
        isReadOnly={isCurrentProviderReadOnly}
        onSort={handleSort}
        onDelete={handleCertificateDeleteDialogOpen}
        onViewDetails={handleCertificateViewerDialogOpen}
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
