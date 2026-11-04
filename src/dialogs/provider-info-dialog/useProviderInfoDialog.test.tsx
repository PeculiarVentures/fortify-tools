import type { IProviderInfo } from '@peculiar/fortify-client-core';
import { screen, userEvent } from '@testing';
import { renderDialog } from '../test-utils';
import { useProviderInfoDialog } from './useProviderInfoDialog';

describe('useProviderInfoDialog', () => {
  const providers = [
    {
      id: '1',
      name: 'Provider 1',
    },
  ] as IProviderInfo[];

  const title = /Provider 1 information/;

  it('Should open & close with the Cancel button and with Escape', async () => {
    const { openDialog } = renderDialog(useProviderInfoDialog, providers[0], {
      fortifyClient: null,
      providers,
    });

    expect(screen.queryByText(title)).not.toBeInTheDocument();

    await openDialog();

    expect(screen.getByText(title)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByText(title)).not.toBeInTheDocument();

    await openDialog();
    await userEvent.keyboard('{Escape}');

    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });

  it('Should close the dialog if its provider is removed', async () => {
    const { openDialog, setContext } = renderDialog(useProviderInfoDialog, providers[0], {
      fortifyClient: null,
      providers,
    });

    await openDialog();

    expect(screen.getByText(title)).toBeInTheDocument();

    setContext({ fortifyClient: null, providers: [{ id: '2' }] as IProviderInfo[] });

    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });
});
