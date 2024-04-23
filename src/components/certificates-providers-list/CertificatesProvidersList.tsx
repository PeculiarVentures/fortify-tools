import React from "react";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import { CertificatesProvidersListItem } from "../certificates-providers-list-item";
import { useTranslation } from "react-i18next";
import AttentionCircleIcon from "../../icons/attention-circle.svg?react";

import styles from "./styles/index.module.scss";

interface CertificatesProvidersListProps {
  providers?: IProviderInfo[];
  currentProviderId?: string;
  onSelect?: (id: string) => void;
}

export const CertificatesProvidersList: React.FunctionComponent<
  CertificatesProvidersListProps
> = ({ providers, currentProviderId, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.list_wrapper}>
      <div className={styles.label}>{t("providers.list.label")}</div>

      {!providers?.length ? (
        <div className={styles.empty_list}>
          <div className={styles.empty_list_icon}>
            <AttentionCircleIcon />
          </div>
          <div className={styles.empty_list_text}>
            {t("providers.list.empty-text")}
          </div>
        </div>
      ) : (
        <ul className={styles.list}>
          {providers.map((provider) => (
            <CertificatesProvidersListItem
              isSelected={currentProviderId === provider.id}
              onClick={(id) => {
                onSelect && onSelect(id);
              }}
              key={provider.id}
              provider={provider}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
