import clsx from "clsx";
import React, { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  IconButton,
  Menu,
  TextField,
  Tooltip,
} from "@peculiar/react-components";
import InfoIcon from "../../icons/info-20.svg?react";
import LoginIcon from "../../icons/login-20.svg?react";
import LogoutIcon from "../../icons/logout-20.svg?react";
import ReloadIcon from "../../icons/reload-20.svg?react";
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
  isDisabled: boolean;
  isLoggedIn: boolean;
  isReadOnly: boolean;
  onSearch: (value: string) => void;
  onImport: () => void;
  onCreate: (type: "csr" | "x509") => void;
  onReload: () => void;
  onInfo: () => void;
  onLoginLogout: (isLoggedin: boolean) => void;
}
export const CertificatesTopbar: React.FunctionComponent<
  CertificatesTopbarProps
> = (props) => {
  const {
    className,
    searchValue = "",
    isDisabled = true,
    isLoggedIn,
    isReadOnly = false,
    onSearch,
    onImport,
    onCreate,
    onReload,
    onInfo,
    onLoginLogout,
  } = props;

  const { t } = useTranslation();

  const renderCreateButton = () => {
    if (isReadOnly) {
      return null;
    }

    if (isDisabled || !isLoggedIn) {
      return (
        <Tooltip
          color="white"
          size="large"
          arrow={true}
          placement="bottom-end"
          offset={10}
          title={
            !isLoggedIn
              ? t("topbar.create-certificate-disabled-tooltip")
              : undefined
          }
        >
          <Button
            color="primary"
            variant="contained"
            size="large"
            startIcon={<PlusIcon />}
            disabled={true}
          >
            {t("topbar.create-certificate")}
          </Button>
        </Tooltip>
      );
    }

    return (
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
    );
  };

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
          disabled={isDisabled}
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
          data-testid="clear-search-button"
        >
          <CrossIcon className={styles.cross_icon} />
        </IconButton>
      </div>
      <div className={styles.topbar_divider}></div>
      <div className={styles.icon_button_group}>
        <IconButton
          size="small"
          onClick={onReload}
          title={t("topbar.reload-certificates")}
          tooltipProps={{
            color: "white",
            offset: 2,
            placement: "bottom-end",
            arrow: true,
            size: "large",
          }}
          className={styles.icon_button}
          disabled={isDisabled}
        >
          <ReloadIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={onInfo}
          title={t("topbar.provider-information")}
          tooltipProps={{
            color: "white",
            offset: 2,
            placement: "bottom-end",
            arrow: true,
            size: "large",
          }}
          className={styles.icon_button}
          disabled={isDisabled}
        >
          <InfoIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onLoginLogout(isLoggedIn)}
          title={t(`topbar.provider-${isLoggedIn ? "logout" : "login"}`)}
          tooltipProps={{
            color: "white",
            offset: 2,
            placement: "bottom-end",
            arrow: true,
            size: "large",
          }}
          className={isLoggedIn ? styles.icon_button_wrong : styles.icon_button}
          disabled={isDisabled}
        >
          {isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
        </IconButton>
      </div>
      {renderCreateButton()}
    </div>
  );
};
