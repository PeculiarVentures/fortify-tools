import React from "react";
import { useTranslation } from "react-i18next";
import { ICertificate } from "@peculiar/fortify-client-core";
import { Button, Typography } from "@peculiar/react-components";
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
import styles from "./styles/index.module.scss";

interface CertificateProp extends ICertificate {
  id?: string;
  label?: string;
}

interface CertificatesListProps {
  certificates: CertificateProp[];
}

export const CertificatesList: React.FunctionComponent<
  CertificatesListProps
> = (props) => {
  const { certificates } = props;
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
          {certificates.map(({ id, serialNumber, type, label, notAfter }) => (
            <TableRow key={id}>
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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
