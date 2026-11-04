import type { IProviderInfo } from '@peculiar/fortify-client-core';
import { createDialog } from '@peculiar/react-components';
import { useLockBodyScroll } from 'react-use';
import { ProviderInfoDialog } from '../../components/provider-info-dialog';
import { useCloseOnProviderRemoved } from '../dialogs-context';

export const useProviderInfoDialog = createDialog<IProviderInfo>(({ openParams, close }) => {
  const provider = useCloseOnProviderRemoved(openParams.id, close);

  useLockBodyScroll(true);

  if (!provider) {
    return null;
  }

  return (
    <ProviderInfoDialog
      data={openParams}
      onDialogClose={close}
    />
  );
});
