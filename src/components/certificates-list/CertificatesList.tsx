import React, { ComponentProps, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import clsx from "clsx";
import {
  Button,
  IconButton,
  Skeleton,
  Typography,
} from "@peculiar/react-components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

import { CertificateTypeLabel } from "../certificate-type-label";
import { Date } from "../date";
import { CertificateName } from "../certificate-name";
import { CertificateSerialNumber } from "../certificate-serial-number";
import { downloadCertificate } from "../../utils/download-certificate";
import { CopyIconButton } from "../copy-icon-button";
import {
  certificateRawToPem,
  getCertificateName,
} from "../../utils/certificate";
import { SortButton } from "../sort-button";

import { CertificateProps } from "../../types";

import DeleteIcon from "../../icons/delete.svg?react";
import DownloadIcon from "../../icons/download-20.svg?react";
import CertificatesIcon from "../../icons/certificates.svg?react";
import SearchIcon from "../../icons/search-120.svg?react";

import styles from "./styles/index.module.scss";

type TSortColumnName = keyof Pick<
  CertificateProps,
  "label" | "serialNumber" | "notAfter" | "type"
>;
type TSortColumnDir = "asc" | "desc";

interface CertificatesListProps {
  certificates: CertificateProps[];
  currentSortName: TSortColumnName | string;
  currentSortDir: TSortColumnDir;
  onSort: (name: TSortColumnName, dir: TSortColumnDir) => void;
  onDelete: (params: {
    certificateIndex: string;
    providerId: string;
    label: string;
  }) => void;
  onViewDetails: (certificate: CertificateProps) => void;
  className?: ComponentProps<"table">["className"];
  highlightedText?: string;
  loading?: boolean;
  isLoggedIn: boolean;
}

export const CertificatesList: React.FunctionComponent<
  CertificatesListProps
> = (props) => {
  const {
    certificates,
    className,
    currentSortName,
    currentSortDir,
    highlightedText,
    loading,
    isLoggedIn,
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
        <Typography variant="b2" color="gray-9">
          <Trans
            i18nKey="certificates.list.empty-search-text"
            values={{ text: highlightedText }}
            components={[
              <Typography
                className={styles.empty_list_search_text}
                variant="b2"
                color="black"
                component="span"
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
        <Typography variant="b2" color="gray-9">
          {t("certificates.list.empty-text")}
        </Typography>
      </div>
    );
  }

  const renderSortTitle = (name: TSortColumnName, title: string) => (
    <SortButton
      active={currentSortName === name}
      order={currentSortName === name ? currentSortDir : "desc"}
      onClick={() =>
        onSort(
          name,
          currentSortName === name && currentSortDir === "asc" ? "desc" : "asc"
        )
      }
      disabled={loading}
    >
      {t(title)}
    </SortButton>
  );

  return (
    <div
      className={clsx(styles.table_wrapper, {
        [styles.table_wrapper_loading]: loading,
      })}
    >
      <Table className={clsx(styles.list_table, className)}>
        <TableHeader>
          <TableRow>
            <TableHead>
              {renderSortTitle("type", "certificates.list.header.type")}
            </TableHead>
            <TableHead>
              {renderSortTitle("label", "certificates.list.header.name")}
            </TableHead>
            <TableHead>
              {renderSortTitle(
                "serialNumber",
                "certificates.list.header.serial-number"
              )}
            </TableHead>
            <TableHead>
              {renderSortTitle("notAfter", "certificates.list.header.expires")}
            </TableHead>
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
                notAfter,
                raw,
                index,
              } = certificate;

              const certificateName = getCertificateName(certificate);

              return (
                <TableRow
                  tabIndex={0}
                  key={id}
                  onClick={() => onViewDetails(certificate)}
                  onFocus={() => setCurrentRow(id)}
                  onBlur={() => setCurrentRow(undefined)}
                  onKeyDown={(event) =>
                    ["Space", "Enter"].includes(event.code) &&
                    onViewDetails(certificate)
                  }
                  onMouseOver={() => currentRow && setCurrentRow(undefined)}
                  className={clsx({
                    ["current"]: currentRow === id,
                  })}
                >
                  <TableCell>
                    <CertificateTypeLabel type={type} />
                  </TableCell>
                  <TableCell>
                    <CertificateName
                      highlight={highlightedText}
                      name={certificateName}
                    />
                  </TableCell>
                  <TableCell>
                    <CertificateSerialNumber value={serialNumber} />
                  </TableCell>
                  <TableCell>
                    <Date date={notAfter} />
                    <div
                      className={styles.list_table_actions}
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                    >
                      <Button
                        tabIndex={0}
                        className={styles.view_details_button}
                        variant="outlined"
                        size="small"
                        onClick={() => onViewDetails(certificate)}
                      >
                        {t("certificates.list.action.view-details")}
                      </Button>
                      <CopyIconButton
                        value={
                          raw.byteLength
                            ? () => certificateRawToPem(raw, type)
                            : ""
                        }
                        className={styles.action_icon_button}
                      />
                      <IconButton
                        tabIndex={0}
                        title={t("certificates.list.action.download")}
                        onClick={() =>
                          raw.byteLength &&
                          downloadCertificate(certificateName, raw, type)
                        }
                        size="small"
                        className={styles.action_icon_button}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <IconButton
                        tabIndex={0}
                        title={t("certificates.list.action.delete")}
                        onClick={() =>
                          onDelete({
                            certificateIndex: index,
                            providerId: providerID,
                            label: certificateName,
                          })
                        }
                        size="small"
                        className={styles.action_icon_button}
                        disabled={!isLoggedIn}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
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
  return [...Array(12).keys()].map((index) => (
    <TableRow className={styles.skeleton_tr} key={`skel-row-${index}`}>
      {[...Array(4).keys()].map((index) => (
        <TableCell className={styles.skeleton_td} key={`skel-td-${index}`}>
          <Skeleton className={styles.skeleton_td_item} height={31} />
        </TableCell>
      ))}
    </TableRow>
  ));
}
