import React from "react";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Typography } from "@peculiar/react-components";
import ProviderIcon from "../../icons/provider.svg?react";
import SmartcardIcon from "../../icons/smartcard.svg?react";
import styles from "./styles/index.module.scss";

interface CertificatesProvidersListItemProps {
  provider: Pick<IProviderInfo, "id" | "name" | "isRemovable" | "readOnly">;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export const CertificatesProvidersListItem: React.FunctionComponent<
  CertificatesProvidersListItemProps
> = (props) => {
  const { provider, isSelected, onClick } = props;
  const { t } = useTranslation();

  return (
    <li
      tabIndex={0}
      className={clsx(styles.list_item, {
        [styles.current_list_item]: isSelected,
      })}
      onClick={() => {
        onClick(provider.id);
      }}
      onKeyDown={(event) =>
        ["Enter"].includes(event.code) && onClick(provider.id)
      }
    >
      <div className={styles.list_item_icon_wrapper}>
        {provider.isRemovable ? <SmartcardIcon /> : <ProviderIcon />}
      </div>
      <div className={styles.list_item_name_wrapper}>
        <Typography
          title={provider.name}
          className={styles.list_item_name}
          variant="s1"
          color={isSelected ? "primary" : "gray-10"}
        >
          {provider.name}
        </Typography>
        {provider.readOnly ? (
          <Typography variant="c1">
            {t("providers.list.item.read-only")}
          </Typography>
        ) : null}
      </div>
    </li>
  );
};
