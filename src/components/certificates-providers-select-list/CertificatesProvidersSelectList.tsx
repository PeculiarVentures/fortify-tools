import React, { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import { Select } from "@peculiar/react-components";

interface CertificatesProvidersSelectListProps {
  className?: ComponentProps<"select">["className"];
  currentProviderId?: string;
  providers: Pick<IProviderInfo, "id" | "name">[];
  onSelect: (id: string) => void;
}

export const CertificatesProvidersSelectList: React.FunctionComponent<
  CertificatesProvidersSelectListProps
> = (props) => {
  const { className, providers, currentProviderId, onSelect } = props;
  const { t } = useTranslation();

  return (
    <Select
      className={className}
      defaultValue={currentProviderId}
      options={providers.map(({ id: value, name: label }) => ({
        value,
        label,
      }))}
      onChange={(event) => onSelect(event.target.value)}
      placeholder={
        !providers.length ? t("providers.list.empty-text") : undefined
      }
    />
  );
};
