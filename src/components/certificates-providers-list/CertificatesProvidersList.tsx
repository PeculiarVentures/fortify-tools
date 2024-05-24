import React from "react";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import { useTranslation } from "react-i18next";
import { CertificatesProvidersListItem } from "../certificates-providers-list-item";
import AttentionCircleIcon from "../../icons/attention-circle.svg?react";
import { Skeleton, Typography } from "@peculiar/react-components";
import styles from "./styles/index.module.scss";

interface CertificatesProvidersListProps {
  providers: Pick<IProviderInfo, "id" | "name" | "isRemovable" | "readOnly">[];
  currentProviderId?: string;
  onSelect?: (id: string) => void;
  loading?: boolean;
}

export const CertificatesProvidersList: React.FunctionComponent<
  CertificatesProvidersListProps
> = (props) => {
  const { providers, currentProviderId, loading, onSelect } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.list_box_wrapper}>
      <Typography className={styles.label} variant="c1" color="gray-9">
        {t("providers.list.label")}
      </Typography>

      {loading ? (
        <div>
          {[...Array(4).keys()].map((index) => (
            <Skeleton
              className={styles.loading_skeleton_item}
              key={`scel-itm-${index}`}
              height={50}
            />
          ))}
        </div>
      ) : !providers?.length ? (
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
