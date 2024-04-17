import React from "react";
import { IProviderInfo } from "@peculiar/fortify-client-core";
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
      style={isSelected ? { color: "blue" } : undefined}
      onClick={() => {
        onClick && onClick(provider.id);
      }}
    >
      {provider.name}
    </div>
  );
};
