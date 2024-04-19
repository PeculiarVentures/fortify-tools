import React from "react";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import { CertificatesProvidersListItem } from "../certificates-providers-list-item";
import { useTranslation } from "react-i18next";

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
  if (!providers?.length) {
    //TODO: return some message
    return null;
  }

  return (
    <div className={styles.list_wrapper}>
      <div className={styles.label}>{t("providers.list.label")}</div>
      <div className={styles.list}>
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
      </div>
    </div>
  );
};
