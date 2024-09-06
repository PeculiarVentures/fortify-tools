import React from "react";
import { useLockBodyScroll } from "react-use";
import { ProviderInfoDialog } from "../../components/provider-info-dialog";
import type { IProviderInfo } from "@peculiar/fortify-client-core";

export function useProviderInfoDialog() {
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
