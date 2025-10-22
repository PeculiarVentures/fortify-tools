import React, { useState } from 'react';
import { Convert } from 'pvtsutils';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
} from '@peculiar/react-components';
import {
  PeculiarCertificateViewer,
  PeculiarCsrViewer,
} from '@peculiar/certificates-viewer-react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { getCertificateName } from '../../utils/certificate';
import { ICertificateProps } from '../../types';
import styles from './styles/index.module.scss';

interface ICertificateViewerDialogProps {
  certificates: ICertificateProps[];
  onClose?: () => void;
}

export const CertificateViewerDialog: React.FunctionComponent<
  ICertificateViewerDialogProps
> = (props) => {
  const { certificates, onClose } = props;
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState('0');

  const renderTabs = () =>
    certificates.length > 1
      ? (
          <div className={styles.dialog_title_tabs_wraper}>
            <Tabs
              value={tabIndex}
              className={styles.dialog_title_tabs}
              onChange={(_, value) => setTabIndex(value)}
            >
              {certificates.map((cert, index) => {
                const name = getCertificateName(cert);

                return (
                  <Tab key={`cert-tab-${name}-${index}`} id={index.toString()}>
                    {name}
                  </Tab>
                );
              })}
            </Tabs>
          </div>
        )
      : null;

  const renderContent = () =>
    certificates[0]?.type === 'x509'
      ? (
          certificates.map((cert, index) => (
            <PeculiarCertificateViewer
              key={`cert-tab-cont-${index}`}
              className={clsx(
                styles.dialog_tab_content,
                { [styles.dialog_tab_content_current]: tabIndex === index.toString() },
              )}
              certificate={Convert.ToBase64(cert?.raw)}
              download={true}
            />
          ))
        )
      : (
          <PeculiarCsrViewer
            certificate={Convert.ToBase64(certificates[0]?.raw)}
            download={true}
          />
        );

  return (
    <Dialog
      open={true} className={styles.dialog}
      onClose={onClose}
    >
      <DialogTitle className={styles.dialog_title}>
        <div className={styles.dialog_title_text}>
          {t('certificate-viewer-dialog.title', { name: getCertificateName(certificates[0]) })}
        </div>
        {renderTabs()}
      </DialogTitle>
      <DialogContent className={styles.dialog_content}>
        {renderContent()}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t('button.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
