import type { ComponentProps } from 'react';
import React, { useState } from 'react';
import { IconButton, Menu, Skeleton, Typography, useClipboard } from '@peculiar/react-components';
import { clsx } from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import type { ICertificateProps } from '../../types';
import CertificatesIcon from '../../icons/certificates.svg?react';
import CopyIcon from '../../icons/copy-20.svg?react';
import DeleteIcon from '../../icons/delete.svg?react';
import DownloadIcon from '../../icons/download-20.svg?react';
import InfoIcon from '../../icons/info-20.svg?react';
import MoreIcon from '../../icons/more-20.svg?react';
import SearchIcon from '../../icons/search-120.svg?react';
import { certificateRawToPem, getCertificateName } from '../../utils/certificate';
import { downloadCertificate } from '../../utils/download-certificate';
import { CertificateName } from '../certificate-name';
import { CertificateSerialNumber } from '../certificate-serial-number';
import { CertificateTypeLabel } from '../certificate-type-label';
import { Date } from '../date';
import { SortButton } from '../sort-button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import styles from './styles/index.module.scss';

type TSortColumnName = keyof Pick<
  ICertificateProps,
  'label' | 'serialNumber' | 'notBefore' | 'notAfter' | 'type'
>;
type TSortColumnDir = 'asc' | 'desc';

interface ICertificatesListProps {
  certificates: ICertificateProps[];
  // Any column name read from the URL (?sort=), not only TSortColumnName.
  currentSortName: string;
  currentSortDir: TSortColumnDir;
  onSort: (name: TSortColumnName, dir: TSortColumnDir) => void;
  onDelete: (params: { certificateIndex: string; providerId: string; label: string }) => void;
  onViewDetails: (params: { certificate: ICertificateProps; providerId: string }) => void;
  className?: ComponentProps<'table'>['className'];
  highlightedText?: string;
  loading?: boolean;
  isLoggedIn: boolean;
  isReadOnly: boolean;
}

interface ICertificateRowActionsProps {
  certificate: ICertificateProps;
  certificateName: string;
  isLoggedIn: boolean;
  isReadOnly: boolean;
  onDelete: ICertificatesListProps['onDelete'];
  onViewDetails: ICertificatesListProps['onViewDetails'];
}

const CertificateRowActions: React.FunctionComponent<ICertificateRowActionsProps> = (props) => {
  const { certificate, certificateName, isLoggedIn, isReadOnly, onDelete, onViewDetails } = props;
  const { providerID, raw, type, index } = certificate;
  const pemType = type === 'x509' ? 'x509' : 'csr';
  const { copy } = useClipboard();
  const { t } = useTranslation();

  const options = [
    {
      label: t('certificates.list.action.view-details'),
      startIcon: <InfoIcon className={styles.row_actions_menu_icon} />,
      onClick: () =>
        onViewDetails({
          certificate,
          providerId: providerID,
        }),
    },
    {
      label: t('certificates.list.action.copy'),
      startIcon: <CopyIcon className={styles.row_actions_menu_icon} />,
      disabled: !raw.byteLength,
      onClick: () => {
        if (raw.byteLength) {
          void copy(certificateRawToPem(raw, pemType));
        }
      },
    },
    {
      label: t('certificates.list.action.download'),
      startIcon: <DownloadIcon className={styles.row_actions_menu_icon} />,
      disabled: !raw.byteLength,
      onClick: () => {
        if (raw.byteLength) {
          downloadCertificate(certificateName, raw, pemType);
        }
      },
    },
    ...(isReadOnly
      ? []
      : [
          {
            label: t('certificates.list.action.delete'),
            startIcon: <DeleteIcon className={styles.row_actions_menu_icon} />,
            disabled: !isLoggedIn,
            onClick: () =>
              onDelete({
                certificateIndex: index,
                providerId: providerID,
                label: certificateName,
              }),
          },
        ]),
  ];

  return (
    <Menu
      popoverProps={{ placement: 'bottom-end' }}
      options={options}
    >
      <IconButton
        size="small"
        aria-label={t('certificates.list.action.menu')}
      >
        <MoreIcon className={styles.more_icon} />
      </IconButton>
    </Menu>
  );
};

export const CertificatesList: React.FunctionComponent<ICertificatesListProps> = (props) => {
  const {
    certificates,
    className,
    currentSortName,
    currentSortDir,
    highlightedText,
    loading,
    isLoggedIn,
    isReadOnly = false,
    onSort,
    onViewDetails,
    onDelete,
  } = props;

  const { t } = useTranslation();

  const [currentRow, setCurrentRow] = useState<string>();

  if (highlightedText && !certificates?.length && !loading) {
    return (
      <div className={clsx(styles.empty_list, styles.empty_search_list)}>
        <div className={styles.empty_search_list_icon}>
          <SearchIcon />
        </div>
        <Typography
          variant="b2"
          color="gray-9"
        >
          <Trans
            i18nKey="certificates.list.empty-search-text"
            values={{ text: highlightedText }}
            components={[
              <Typography
                className={styles.empty_list_search_text}
                variant="b2"
                color="black"
                component="span"
                key="text"
              >
                {0}
              </Typography>,
            ]}
          />
        </Typography>
      </div>
    );
  }

  if (!certificates?.length && !loading) {
    return (
      <div className={styles.empty_list}>
        <div className={styles.empty_list_icon}>
          <CertificatesIcon />
        </div>
        <Typography
          variant="b2"
          color="gray-9"
        >
          {t('certificates.list.empty-text')}
        </Typography>
      </div>
    );
  }

  const renderSortTitle = (name: TSortColumnName, title: string) => (
    <SortButton
      active={currentSortName === name}
      order={currentSortName === name ? currentSortDir : 'desc'}
      disabled={loading}
      onClick={() =>
        onSort(name, currentSortName === name && currentSortDir === 'asc' ? 'desc' : 'asc')
      }
    >
      {t(title)}
    </SortButton>
  );

  return (
    <div className={clsx(styles.table_wrapper, { [styles.table_wrapper_loading]: loading })}>
      <Table className={clsx(styles.list_table, className)}>
        <TableHeader>
          <TableRow>
            <TableHead>{renderSortTitle('label', 'certificates.list.header.name')}</TableHead>
            <TableHead>{renderSortTitle('type', 'certificates.list.header.type')}</TableHead>
            <TableHead>
              {renderSortTitle('serialNumber', 'certificates.list.header.serial-number')}
            </TableHead>
            <TableHead>
              {renderSortTitle('notBefore', 'certificates.list.header.created-at')}
            </TableHead>
            <TableHead>{renderSortTitle('notAfter', 'certificates.list.header.expires')}</TableHead>
            <TableHead className={styles.list_table_actions_head} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <CertificatesListLoading />
          ) : (
            certificates.map((certificate) => {
              const {
                id,
                providerID,
                serialNumber,
                type,
                notBefore,
                notAfter,
                index,
                privateKeyId,
              } = certificate;

              const certificateName = getCertificateName(certificate);

              return (
                <TableRow
                  tabIndex={0}
                  key={id}
                  className={clsx({ ['current']: currentRow === id })}
                  onClick={() =>
                    onViewDetails({
                      certificate,
                      providerId: providerID,
                    })
                  }
                  onFocus={() => setCurrentRow(id)}
                  onBlur={() => setCurrentRow(undefined)}
                  onKeyDown={(event) =>
                    ['Space', 'Enter'].includes(event.code) &&
                    onViewDetails({
                      certificate,
                      providerId: providerID,
                    })
                  }
                  onMouseOver={() => currentRow && setCurrentRow(undefined)}
                >
                  <TableCell>
                    <CertificateName
                      className={styles.list_table_name}
                      highlight={highlightedText}
                      name={certificateName}
                    />
                  </TableCell>
                  <TableCell>
                    <CertificateTypeLabel
                      type={type}
                      withPrivatKey={Boolean(privateKeyId)}
                      withoutIcon
                    />
                  </TableCell>
                  <TableCell>
                    <CertificateSerialNumber value={serialNumber} />
                  </TableCell>
                  <TableCell>
                    <Date date={notBefore} />
                  </TableCell>
                  <TableCell>
                    <Date date={notAfter} />
                  </TableCell>
                  <TableCell
                    className={styles.list_table_actions_cell}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <CertificateRowActions
                      certificate={certificate}
                      certificateName={certificateName}
                      isLoggedIn={isLoggedIn}
                      isReadOnly={isReadOnly}
                      onDelete={onDelete}
                      onViewDetails={onViewDetails}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

function CertificatesListLoading() {
  return [...Array(12).keys()].map((rowIndex) => (
    <TableRow
      className={styles.skeleton_tr}
      key={`skel-row-${rowIndex}`}
    >
      {[...Array(6).keys()].map((cellIndex) => (
        <TableCell
          className={styles.skeleton_td}
          key={`skel-td-${cellIndex}`}
        >
          <Skeleton
            className={styles.skeleton_td_item}
            height={31}
          />
        </TableCell>
      ))}
    </TableRow>
  ));
}
