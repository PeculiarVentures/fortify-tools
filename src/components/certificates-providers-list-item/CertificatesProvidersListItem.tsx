import React from "react";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import styles from "./styles/index.module.scss";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import ProviderIcon from "../../icons/provider.svg?react";

interface CertificatesProvidersListItemProps {
  provider: IProviderInfo;
  isSelected?: boolean;
  onClick?: (id: string) => void;
}

export const CertificatesProvidersListItem: React.FunctionComponent<
  CertificatesProvidersListItemProps
> = ({ provider, isSelected, onClick }) => {
  const { t } = useTranslation();
  return (
    <div
      className={clsx(styles.list_item, {
        [styles.current_list_item]: isSelected,
      })}
      onClick={() => {
        onClick && onClick(provider.id);
      }}
    >
      <div className={styles.list_item_icon_wrapper}>
        <ProviderIcon />
      </div>
      <div className={styles.list_item_name_wrapper}>
        <div className={styles.list_item_name}>{provider.name}</div>
        {!provider.readOnly ? (
          <div className={styles.list_item_read_only}>
            {t("providers.list.item.read-only")}
          </div>
        ) : null}
      </div>
    </div>
  );
};
