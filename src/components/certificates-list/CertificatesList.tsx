import React from "react";
import { useTranslation } from "react-i18next";
import { CertificateProps } from "../../types";
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

import DeleteIcon from "../../icons/delete.svg?react";

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
            const { id, serialNumber, type, label, notAfter } = certificate;
            return (
              <TableRow key={id} onClick={() => onViewDetails(certificate)}>
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
                  <div className={styles.list_table_actions}>
                    <Button variant="outlined" size="small">
                      {t("certificates.list.action.view-details")}
                    </Button>
                    <IconButton
                      title={t("certificates.list.action.delete")}
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(id as string, label as string);
                      }}
                      size="small"
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
