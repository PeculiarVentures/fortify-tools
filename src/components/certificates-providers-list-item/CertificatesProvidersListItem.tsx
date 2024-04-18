import React from "react";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import styles from "./styles/index.module.scss";
import clsx from "clsx";

interface CertificatesProvidersListItemProps {
  provider: IProviderInfo;
  isSelected?: boolean;
  onClick?: (id: string) => void;
}

export const CertificatesProvidersListItem: React.FunctionComponent<
  CertificatesProvidersListItemProps
> = ({ provider, isSelected, onClick }) => {
  return (
    <div
      className={clsx({
        [styles.current_list_item]: isSelected,
      })}
      onClick={() => {
        onClick && onClick(provider.id);
      }}
    >
      {provider.name}
    </div>
  );
};
