import React, { useState } from "react";
import { Convert } from "pvtsutils";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Button, IconButton, Typography } from "@peculiar/react-components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import CertificatesIcon from "../../icons/certificates.svg?react";
import { CertificateTypeLabel } from "../certificate-type-label";
import { Date } from "../date";
import { CertificateName } from "../certificate-name";
import { CertificateSerialNumber } from "../certificate-serial-number";
import { downloadCertificate } from "../../utils/download-certificate";

import { CertificateProps } from "../../types";

import DeleteIcon from "../../icons/delete.svg?react";
import DownloadIcon from "../../icons/download-20.svg?react";

import styles from "./styles/index.module.scss";

interface CertificatesListProps {
  certificates: CertificateProps[];
  onDelete: (id: string, name: string) => void;
  onViewDetails: (certificate: CertificateProps) => void;
}

export const CertificatesList: React.FunctionComponent<
  CertificatesListProps
> = (props) => {
  const { certificates, onViewDetails, onDelete } = props;

  const { t } = useTranslation();

  const [currentRow, setCurrentRow] = useState<string>();

  if (!certificates?.length) {
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

  return (
    <div className={styles.table_wrapper}>
      <Table className={styles.list_table}>
        <TableHeader>
          <TableRow>
            <TableHead>{t("certificates.list.header.type")}</TableHead>
            <TableHead>{t("certificates.list.header.name")}</TableHead>
            <TableHead>{t("certificates.list.header.serial-number")}</TableHead>
            <TableHead>{t("certificates.list.header.expires")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.map((certificate) => {
            const { id, serialNumber, type, label, notAfter, raw } =
              certificate;
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
                {/* // TODO: not sure about label as name */}
                <TableCell>
                  <CertificateName name={label} />
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
                    <IconButton
                      tabIndex={0}
                      title={t("certificates.list.action.download")}
                      onClick={() =>
                        downloadCertificate(
                          label as string,
                          Convert.ToBase64(raw),
                          type
                        )
                      }
                      size="small"
                      className={styles.action_icon_button}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      tabIndex={0}
                      title={t("certificates.list.action.delete")}
                      onClick={() => onDelete(id as string, label as string)}
                      size="small"
                      className={styles.action_icon_button}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
