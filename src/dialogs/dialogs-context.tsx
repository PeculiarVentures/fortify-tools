import React from 'react';
import type { FortifyAPI, IProviderInfo } from '@peculiar/fortify-client-core';

export interface IDialogsContext {
  fortifyClient: FortifyAPI | null;
  providers: IProviderInfo[];
  currentProviderId?: string;
}

/**
 * App state the dialogs read while they are open. createDialog components only receive
 * `openParams` (fixed when the dialog opens), so values that change while a dialog is open,
 * such as the providers list, come from this context.
 */
export const DialogsContext = React.createContext<IDialogsContext>({
  fortifyClient: null,
  providers: [],
});

export function useDialogsContext() {
  return React.useContext(DialogsContext);
}

/**
 * Closes the dialog when its provider disappears (e.g. a smart card is removed).
 * Returns the provider, or `undefined` while the dialog is closing.
 */
export function useCloseOnProviderRemoved(providerId: string, close: () => void) {
  const { providers } = useDialogsContext();
  const provider = providers.find(({ id }) => id === providerId);

  React.useEffect(() => {
    if (!provider) {
      close();
    }
  }, [provider, close]);

  return provider;
}
