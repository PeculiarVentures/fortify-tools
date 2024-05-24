import React from "react";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import { useTranslation } from "react-i18next";
import { CertificatesProvidersListItem } from "../certificates-providers-list-item";
import AttentionCircleIcon from "../../icons/attention-circle.svg?react";
import { Typography } from "@peculiar/react-components";
import styles from "./styles/index.module.scss";

interface CertificatesProvidersListProps {
  providers: Pick<IProviderInfo, "id" | "name" | "isRemovable" | "readOnly">[];
  currentProviderId?: string;
  onSelect?: (id: string) => void;
}

export const CertificatesProvidersList: React.FunctionComponent<
  CertificatesProvidersListProps
> = (props) => {
  const { providers, currentProviderId, onSelect } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.list_box_wrapper}>
      <Typography className={styles.label} variant="c1" color="gray-9">
        {t("providers.list.label")}
      </Typography>

      {!providers?.length ? (
        <div className={styles.empty_list}>
          <div className={styles.empty_list_icon}>
            <AttentionCircleIcon />
          </div>
          <Typography variant="s1" color="gray-8">
            {t("providers.list.empty-text")}
          </Typography>
        </div>
      ) : (
        <div className={styles.list_wrapper}>
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
        </div>
      )}
    </div>
  );
};
