import type { FortifyAPI, IProviderInfo } from '@peculiar/fortify-client-core';
import { screen, userEvent, waitFor } from '@testing';
import { renderDialog } from '../test-utils';
import { useCertificateDeleteDialog } from './useCertificateDeleteDialog';

describe('useCertificateDeleteDialog', () => {
  const providers = [
    {
      id: '1',
      name: 'Provider 1',
    },
  ] as IProviderInfo[];

  const confirmText = 'Are you sure you want to delete “Certificate Name”?';

  function setup({
    fortifyClient = { removeCertificateById: vi.fn().mockResolvedValue({}) },
  }: { fortifyClient?: Partial<FortifyAPI> | null } = {}) {
    const onSuccess = vi.fn();
    const utils = renderDialog(
      useCertificateDeleteDialog,
      {
        certificateIndex: 'cert-1',
        providerId: providers[0].id,
        label: 'Certificate Name',
        onSuccess,
      },
      { fortifyClient: fortifyClient as FortifyAPI | null, providers },
    );

    return { ...utils, onSuccess, fortifyClient };
  }

  it('Should open, delete the certificate, show a toast & close', async () => {
    const { openDialog, onSuccess, fortifyClient } = setup();

    expect(screen.queryByText(confirmText)).not.toBeInTheDocument();

    await openDialog();

    expect(screen.getByText(confirmText)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(fortifyClient?.removeCertificateById).toHaveBeenCalledWith('1', 'cert-1');
    expect(onSuccess).toHaveBeenCalledWith('1');
    expect(await screen.findByText('Certificate deleted.')).toBeInTheDocument();
    expect(screen.queryByText(confirmText)).not.toBeInTheDocument();
  });

  it('Should show the loading state while deleting', async () => {
    let resolveRemove: () => void = () => {};
    const { openDialog } = setup({
      fortifyClient: {
        removeCertificateById: vi.fn(
          () =>
            new Promise<void>((resolve) => {
              resolveRemove = resolve;
            }),
        ),
      },
    });

    await openDialog();
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.getByText('Deleting certificate...')).toBeInTheDocument();

    resolveRemove();

    await waitFor(() => {
      expect(screen.queryByText('Deleting certificate...')).not.toBeInTheDocument();
    });
  });

  it('Should close with the Cancel button and with Escape', async () => {
    const { openDialog, onSuccess } = setup();

    await openDialog();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByText(confirmText)).not.toBeInTheDocument();

    await openDialog();
    await userEvent.keyboard('{Escape}');

    expect(screen.queryByText(confirmText)).not.toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('Should close the dialog if its provider is removed', async () => {
    const { openDialog, setContext, fortifyClient } = setup();

    await openDialog();

    expect(screen.getByText(confirmText)).toBeInTheDocument();

    setContext({
      fortifyClient: fortifyClient as FortifyAPI,
      providers: [{ id: '2' }] as IProviderInfo[],
    });

    expect(screen.queryByText(confirmText)).not.toBeInTheDocument();

    // The dialog was closed, not hidden: it stays closed when the provider comes back.
    setContext({ fortifyClient: fortifyClient as FortifyAPI, providers });

    expect(screen.queryByText(confirmText)).not.toBeInTheDocument();
  });

  it('Should show an error toast & close if the deletion fails', async () => {
    const { openDialog, onSuccess } = setup({
      fortifyClient: { removeCertificateById: vi.fn().mockRejectedValue(new Error('Error')) },
    });

    await openDialog();
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onSuccess).not.toHaveBeenCalled();
    expect(
      await screen.findByText('Failed to delete certificate because of error. Please try again.'),
    ).toBeInTheDocument();
    expect(screen.queryByText(confirmText)).not.toBeInTheDocument();
  });

  it("Shouldn't render without a fortifyClient", async () => {
    const { openDialog } = setup({ fortifyClient: null });

    await openDialog();

    expect(screen.queryByText(confirmText)).not.toBeInTheDocument();
  });
});
