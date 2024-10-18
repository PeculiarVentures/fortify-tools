import React from "react";
import { useLockBodyScroll } from "react-use";
import type { IProviderInfo } from "@peculiar/fortify-client-core";
import { ProviderInfoDialog } from "../../components/provider-info-dialog";

type UseCertificateViewerInitialParams = {
  providers: IProviderInfo[];
};

export function useProviderInfoDialog(
  props: UseCertificateViewerInitialParams
) {
  const { providers } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const providerRef = React.useRef<IProviderInfo>();

  const handleOpen = (provider: IProviderInfo) => {
    providerRef.current = provider;
    setIsOpen(true);
  };

  const handleClose = () => {
    providerRef.current = undefined;
    setIsOpen(false);
  };

  useLockBodyScroll(isOpen);

  const currentProvider = providers.find(
    ({ id }) => providerRef.current?.id === id
  );

  if (isOpen && !currentProvider) {
    handleClose();
  }

  return {
    open: handleOpen,
    dialog: () =>
      isOpen && providerRef.current ? (
        <ProviderInfoDialog
          data={providerRef.current}
          onDialogClose={handleClose}
        />
      ) : null,
  };
}
