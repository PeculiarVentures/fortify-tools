import type { FortifyAPI, IProviderInfo } from '@peculiar/fortify-client-core';
import { act, fireEvent, screen, userEvent, within } from '@testing';
import { certificateCSRPem, certificateX509Pem } from '@testing/data';
import { renderDialog } from '../test-utils';
import { useCertificateImportDialog } from './useCertificateImportDialog';

describe('useCertificateImportDialog', () => {
  const providers = [
    {
      id: '1',
      name: 'Provider 1',
    },
    {
      id: '2',
      name: 'Provider 2',
    },
  ] as IProviderInfo[];

  const title = 'Import certificate';
  const invalidDataMessage = 'Certificate is invalid. Please check your data and try again.';

  function setup(certStorage = { importCert: vi.fn(), setItem: vi.fn() }) {
    const onSuccess = vi.fn();
    const fortifyClient = {
      getProviderById: vi.fn().mockResolvedValue({ certStorage }),
    };
    const utils = renderDialog(
      useCertificateImportDialog,
      { onSuccess },
      { fortifyClient: fortifyClient as unknown as FortifyAPI, providers, currentProviderId: '1' },
    );

    return { ...utils, onSuccess, fortifyClient, certStorage };
  }

  async function pasteCertificate(value: string) {
    // userEvent.type is slow for a whole PEM; paste the value instead.
    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.paste(value);
    await userEvent.tab();
  }

  async function dropFile(content: string, name: string) {
    const file = new File([content], name);
    const dropZone = screen.getByText(/Drag and drop certificate file here/).closest('div');

    await act(async () => {
      fireEvent.drop(dropZone as Element, {
        dataTransfer: {
          files: [file],
          items: [{ kind: 'file', type: file.type, getAsFile: () => file }],
          types: ['Files'],
        },
      });
    });
  }

  it('Should open & close the dialog', async () => {
    const { openDialog } = setup();

    await openDialog();

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();

    await userEvent.click(within(screen.getByRole('dialog')).getAllByRole('button')[0]);

    expect(screen.queryByRole('heading', { name: title })).not.toBeInTheDocument();
  });

  it.each([
    ['x509', certificateX509Pem, 'x509'],
    ['CSR', certificateCSRPem, 'request'],
  ])('Should import a pasted certificate into the selected provider (%s)', async (_, pem, kind) => {
    const { openDialog, onSuccess, fortifyClient, certStorage } = setup();

    await openDialog();
    await userEvent.click(screen.getAllByRole('combobox')[0]);
    await userEvent.click(screen.getByRole('option', { name: 'Provider 2' }));
    await pasteCertificate(pem);
    await userEvent.click(screen.getByRole('button', { name: 'Import certificate' }));

    expect(fortifyClient.getProviderById).toHaveBeenCalledWith('2');
    expect(certStorage.importCert).toHaveBeenCalledWith(
      kind,
      expect.any(ArrayBuffer),
      expect.any(Object),
      ['verify'],
    );
    expect(certStorage.setItem).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith('2');
    expect(await screen.findByText('Certificate imported.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: title })).not.toBeInTheDocument();
  });

  it.each([
    ['x509', certificateX509Pem, 'file.cer', 'x509'],
    ['CSR', certificateCSRPem, 'file.csr', 'request'],
  ])('Should import a dropped file (%s)', async (_, pem, fileName, kind) => {
    const { openDialog, onSuccess, certStorage } = setup();

    await openDialog();
    await dropFile(pem, fileName);
    await userEvent.click(screen.getByRole('button', { name: 'Import certificate' }));

    expect(certStorage.importCert).toHaveBeenCalledWith(
      kind,
      expect.any(ArrayBuffer),
      expect.any(Object),
      ['verify'],
    );
    expect(onSuccess).toHaveBeenCalledWith('1');
  });

  it('Should show the textarea error for empty or invalid data', async () => {
    const { openDialog } = setup();

    await openDialog();
    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.tab();

    expect(screen.getByText(invalidDataMessage)).toBeInTheDocument();

    await pasteCertificate('certificate');

    expect(screen.getByText(invalidDataMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Import certificate' })).toBeDisabled();
  });

  it('Should clear the certificate and the error with the Clear button', async () => {
    const { openDialog } = setup();

    await openDialog();
    await pasteCertificate('certificate');

    expect(screen.getByText(invalidDataMessage)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(screen.queryByText(invalidDataMessage)).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('Should show a toast for a dropped file with invalid data', async () => {
    const { openDialog } = setup();

    await openDialog();
    await dropFile('certificate', 'file.cer');

    expect(await screen.findByText(invalidDataMessage)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('Should show a toast for a rejected file', async () => {
    const { openDialog } = setup();

    await openDialog();
    await dropFile('certificate', 'file.exe');

    expect(
      await screen.findByText('Wrong file format. Use PEM or DER formats.'),
    ).toBeInTheDocument();
  });

  it('Should show an error toast & stay open if the import fails', async () => {
    const { openDialog, onSuccess } = setup({
      importCert: vi.fn().mockRejectedValue(new Error('Error')),
      setItem: vi.fn(),
    });

    await openDialog();
    await pasteCertificate(certificateX509Pem);
    await userEvent.click(screen.getByRole('button', { name: 'Import certificate' }));

    expect(onSuccess).not.toHaveBeenCalled();
    expect(
      await screen.findByText('Failed to import certificate because of error. Please try again.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  });
});
