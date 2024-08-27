import clsx from "clsx";
import React, { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  IconButton,
  Menu,
  TextField,
} from "@peculiar/react-components";
import ImportIcon from "../../icons/import-30.svg?react";
import SearchIcon from "../../icons/search.svg?react";
import PlusIcon from "../../icons/plus-20.svg?react";
import CertificatCSRIcon from "../../icons/csr-30.svg?react";
import CertificatSSCIcon from "../../icons/certificate-30.svg?react";
import CrossIcon from "../../icons/cross-30.svg?react";

import styles from "./styles/index.module.scss";

interface CertificatesTopbarProps {
  className?: ComponentProps<"div">["className"];
  searchValue?: string;
  onSearch: (value: string) => void;
  onImport: () => void;
  onCreate: (type: "csr" | "x509") => void;
}
export const CertificatesTopbar: React.FunctionComponent<
  CertificatesTopbarProps
> = (props) => {
  const { className, searchValue = "", onSearch, onImport, onCreate } = props;

  const { t } = useTranslation();

  return (
    <div className={clsx(styles.topbar_root, className)}>
      <div className={styles.search_field}>
        <TextField
          value={searchValue}
          placeholder={t("topbar.search-placeholder")}
          type="search"
          size="large"
          onChange={(event) => {
            onSearch(event.target.value);
          }}
        />
        <SearchIcon className={styles.search_icon} />
        <IconButton
          className={clsx(styles.clear_button, {
            ["hidden"]: !searchValue,
          })}
          size="small"
          onClick={() => {
            onSearch("");
          }}
        >
          <CrossIcon className={styles.cross_icon} />
        </IconButton>
      </div>
      <div className={styles.topbar_divider}></div>
      <div>
        <Menu
          popoverProps={{
            className: styles.creation_menu,
          }}
          options={[
            {
              label: t("topbar.create-certificate-scr"),
              startIcon: (
                <CertificatCSRIcon className={styles.creation_menu_icon} />
              ),
              onClick: () => onCreate("csr"),
            },
            {
              label: t("topbar.create-certificate-ssc"),
              startIcon: (
                <CertificatSSCIcon className={styles.creation_menu_icon} />
              ),
              onClick: () => onCreate("x509"),
            },
            {
              label: t("topbar.import-certificate"),
              startIcon: <ImportIcon className={styles.creation_menu_icon} />,
              onClick: onImport,
            },
          ]}
        >
          <Button
            color="primary"
            variant="contained"
            size="large"
            startIcon={<PlusIcon />}
          >
            {t("topbar.create-certificate")}
          </Button>
        </Menu>
      </div>
    </div>
  );
};
