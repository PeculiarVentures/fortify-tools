import './global.scss';
import './i18n';
import React from 'react';
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
import { DialogsContext } from './dialogs/dialogs-context';
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

  const certificateDeleteDialog = useCertificateDeleteDialog();
  const certificateImportDialog = useCertificateImportDialog();
  const certificateCreateDialog = useCertificateCreateDialog();
  const certificateViewerDialog = useCertificateViewerDialog();
  const providerInfoDialog = useProviderInfoDialog();

  const {
    list: sortedCertificates,
    name: currentSortName,
    derection: currentSortDir,
    handleSort,
  } = useSortList(searchedCertificate, 'notAfter');

  // Read when an import/create finishes, so the check uses the provider selected at that time.
  const currentProviderIdRef = React.useRef(currentProviderId);

  React.useEffect(() => {
    currentProviderIdRef.current = currentProviderId;
  }, [currentProviderId]);

  const handleCertificatesChange = (providerId: string) => {
    void handleCertificatesDataReload(providerId);
  };

  const handleCurrentProviderCertificatesChange = (providerId: string) => {
    if (currentProviderIdRef.current !== providerId) return;
    void handleCertificatesDataReload(providerId);
  };

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
        onImport={() =>
          certificateImportDialog.open({ onSuccess: handleCurrentProviderCertificatesChange })
        }
        onCreate={(type) =>
          certificateCreateDialog.open({ type, onSuccess: handleCurrentProviderCertificatesChange })
        }
        onReload={handleProviderResetAndRefreshList}
        onInfo={() => currentProvider && providerInfoDialog.open(currentProvider)}
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
        onDelete={(params) =>
          certificateDeleteDialog.open({ ...params, onSuccess: handleCertificatesChange })
        }
        onViewDetails={(params) => certificateViewerDialog.open(params)}
      />
      <FetchingStatusOwerlay
        fetching={fetching}
        challenge={challenge}
        onReload={handleRetryConection}
      />
      {providers.length ? (
        <DialogsContext value={{ fortifyClient, providers, currentProviderId }}>
          {certificateViewerDialog.dialog}
          {certificateDeleteDialog.dialog}
          {certificateImportDialog.dialog}
          {certificateCreateDialog.dialog}
          {providerInfoDialog.dialog}
        </DialogsContext>
      ) : null}

      <div className={styles.certificate_list_corners_backdrop}></div>
    </>
  );
}
