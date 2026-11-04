import type { FortifyAPI, IProviderInfo } from '@peculiar/fortify-client-core';
import { screen, userEvent, within } from '@testing';
import type { TCertificateType } from '../../types';
import { certificateSubjectToString } from '../../utils/certificate';
import { renderDialog } from '../test-utils';
import { useCertificateCreateDialog } from './useCertificateCreateDialog';

describe('useCertificateCreateDialog', () => {
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

  const expectedRequest = {
    subjectName: certificateSubjectToString({ CN: 'example.com' }),
    hashAlgorithm: 'SHA-256',
    signatureAlgorithm: 'EC-P256',
  };

  function setup(type: TCertificateType, fortifyClient: Partial<FortifyAPI> | null) {
    const onSuccess = vi.fn();
    const utils = renderDialog(
      useCertificateCreateDialog,
      { type, onSuccess },
      { fortifyClient: fortifyClient as FortifyAPI | null, providers, currentProviderId: '1' },
    );

    return { ...utils, onSuccess };
  }

  async function selectOption(comboboxIndex: number, optionName: string) {
    await userEvent.click(screen.getAllByRole('combobox')[comboboxIndex]);
    await userEvent.click(screen.getByRole('option', { name: optionName }));
  }

  const createButtonName = /^Create (certificate|CSR)/;

  // Fills the TLS Server Authentication form and submits it.
  async function submitServerAuthForm() {
    await selectOption(1, 'TLS Server Authentication');
    await userEvent.type(screen.getByRole('textbox', { name: 'Common name' }), 'example.com');
    await userEvent.click(screen.getByRole('button', { name: createButtonName }));
  }

  it('Should open & close the dialog', async () => {
    const { openDialog } = setup('x509', null);

    expect(screen.queryByText('Select type')).not.toBeInTheDocument();

    await openDialog();

    expect(screen.getByText('Select type')).toBeInTheDocument();

    await userEvent.click(within(screen.getByRole('dialog')).getAllByRole('button')[0]);

    expect(screen.queryByText('Select type')).not.toBeInTheDocument();
  });

  it('Should create a self-signed certificate, show a toast & close (x509)', async () => {
    const fortifyClient = { createX509: vi.fn().mockResolvedValue({}) };
    const { openDialog, onSuccess } = setup('x509', fortifyClient);

    await openDialog();
    await submitServerAuthForm();

    expect(fortifyClient.createX509).toHaveBeenCalledWith('1', {
      ...expectedRequest,
      extensions: { extendedKeyUsage: ['1.3.6.1.5.5.7.3.1'] },
    });
    expect(onSuccess).toHaveBeenCalledWith('1');
    expect(await screen.findByText('Certificate created.')).toBeInTheDocument();
    expect(screen.queryByText('Select type')).not.toBeInTheDocument();
  });

  it('Should create a CSR in the selected provider (csr)', async () => {
    const fortifyClient = { createPKCS10: vi.fn().mockResolvedValue({}) };
    const { openDialog, onSuccess } = setup('csr', fortifyClient);

    await openDialog();
    await selectOption(0, 'Provider 2');
    await submitServerAuthForm();

    expect(fortifyClient.createPKCS10).toHaveBeenCalledWith('2', expectedRequest);
    expect(onSuccess).toHaveBeenCalledWith('2');
  });

  it('Should show an error toast & stay open if the creation fails', async () => {
    const fortifyClient = { createX509: vi.fn().mockRejectedValue(new Error('Error')) };
    const { openDialog, onSuccess } = setup('x509', fortifyClient);

    await openDialog();
    await submitServerAuthForm();

    expect(onSuccess).not.toHaveBeenCalled();
    expect(await screen.findByText("Can't create certificate")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: createButtonName })).toBeInTheDocument();
  });

  it("Shouldn't create anything without a fortifyClient", async () => {
    const { openDialog, onSuccess } = setup('x509', null);

    await openDialog();
    await submitServerAuthForm();

    expect(onSuccess).not.toHaveBeenCalled();
    expect(screen.queryByText("Can't create certificate")).not.toBeInTheDocument();
  });
});
