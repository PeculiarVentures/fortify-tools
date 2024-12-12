import React, { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { IProviderInfo } from "@peculiar/fortify-client-core";
import { Select } from "@peculiar/react-components";

interface CertificatesProvidersSelectListProps {
  className?: ComponentProps<"div">["className"];
  popoverClassName?: ComponentProps<"div">["className"];
  currentProviderId?: string;
  providers: Pick<IProviderInfo, "id" | "name">[];
  onSelect: (id: string) => void;
}

export const CertificatesProvidersSelectList: React.FunctionComponent<
  CertificatesProvidersSelectListProps
> = (props) => {
  const {
    className,
    providers,
    currentProviderId,
    popoverClassName,
    onSelect,
  } = props;
  const { t } = useTranslation();
  const currProvider = providers.filter(
    ({ id }) => id === currentProviderId
  )[0];

  return (
    <Select
      className={className}
      disableSearch={true}
      defaultValue={currProvider}
      getOptionLabel={({ name }) => name}
      options={providers}
      onChange={(_, value) => onSelect(value?.id as string)}
      placeholder={
        !providers.length ? t("providers.list.empty-text") : undefined
      }
      popoverProps={{
        className: popoverClassName,
      }}
    />
  );
};
