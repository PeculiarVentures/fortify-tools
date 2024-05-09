import clsx from "clsx";
import React, { ComponentProps, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Menu,
  TextField,
  useDebounceCallback,
} from "@peculiar/react-components";
import ImportIcon from "../../icons/import.svg?react";
import SearchIcon from "../../icons/search.svg?react";
import PlusIcon from "../../icons/plus-20.svg?react";
import CertificatCSRIcon from "../../icons/csr-30.svg?react";
import CertificatSSCIcon from "../../icons/certificate-30.svg?react";

import styles from "./styles/index.module.scss";

interface CertificatesTopbarProps {
  className?: ComponentProps<"div">["className"];
  onSearch: (value: string) => void;
  onImport: () => void;
  onCreate: (type: "csr" | "ssc") => void;
}
export const CertificatesTopbar: React.FunctionComponent<
  CertificatesTopbarProps
> = (props) => {
  const { className, onSearch, onImport, onCreate } = props;

  const { t } = useTranslation();
  const isFirst = useRef(true);
  const [searchValue, setSearchValue] = React.useState("");
  const setSearchValueDebounced = useDebounceCallback(setSearchValue, 300);

  useEffect(() => {
    if (isFirst?.current) {
      isFirst.current = false;
      return;
    }
    onSearch(searchValue);
  }, [searchValue]);

  return (
    <div className={clsx(styles.topbar_root, className)}>
      <div className={styles.search_field}>
        <SearchIcon />
        <TextField
          placeholder={t("topbar.search-placeholder")}
          type="search"
          size="large"
          onChange={(event) => {
            setSearchValueDebounced(event.target.value);
          }}
        />
      </div>
      <div className={styles.topbar_divider}></div>
      <div>
        <Button
          variant="outlined"
          size="large"
          startIcon={<ImportIcon />}
          onClick={onImport}
        >
          {t("topbar.import-certificate")}
        </Button>
      </div>
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
              onClick: () => onCreate("ssc"),
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
