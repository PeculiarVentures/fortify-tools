import React from "react";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import { CertificatesProvidersListItem } from "./CertificatesProvidersListItem";
interface CertificatesProvidersListProps {
  providers?: IProviderInfo[];
  currentProviderId?: string;
  onSelect?: (id: string) => void;
}

export const CertificatesProvidersList: React.FunctionComponent<
  CertificatesProvidersListProps
> = ({ providers, currentProviderId, onSelect }) => {
  if (!providers?.length) {
    //TODO: return some message
    return null;
  }

  return (
    <div>
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
  );
};
