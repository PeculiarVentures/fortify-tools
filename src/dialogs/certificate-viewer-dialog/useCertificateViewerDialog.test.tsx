import type { FortifyAPI, IProviderInfo } from '@peculiar/fortify-client-core';
import { screen, userEvent } from '@testing';
import type { ICertificateProps } from '../../types';
import { renderDialog } from '../test-utils';
import { useCertificateViewerDialog } from './useCertificateViewerDialog';

vi.mock('@peculiar/certificates-viewer-react', () => ({
  PeculiarCertificateViewer: () => 'x509 certificate viewer component',
  PeculiarCsrViewer: () => 'CSR certificate viewer component',
}));

vi.mock('@peculiar/x509', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('@peculiar/x509')>();

  return {
    ...originalModule,
    X509Certificate: vi.fn().mockImplementation(function MockX509Certificate() {
      return {
        rawData: new ArrayBuffer(0),
        subject: 'CN=Chain certificate',
        serialNumber: '1',
        issuer: 'CN=Test Issuer',
        notBefore: new Date('2024-01-01'),
        notAfter: new Date('2025-01-01'),
        publicKey: {} as CryptoKey,
      };
    }),
  };
});

describe('useCertificateViewerDialog', () => {
  const providers = [
    {
      id: '1',
      name: 'Provider 1',
    },
  ] as IProviderInfo[];

  const certificate = {
    id: '1',
    raw: new ArrayBuffer(0),
    subject: { CN: ['Test certificate'] },
    type: 'x509',
  } as unknown as ICertificateProps;

  const title = '“Test certificate” details';

  it('Should open & close with the Close button and with Escape', async () => {
    const { openDialog } = renderDialog(
      useCertificateViewerDialog,
      { certificate, providerId: providers[0].id },
      { fortifyClient: null, providers, currentProviderId: providers[0].id },
    );

    await openDialog();

    expect(await screen.findByText(title)).toBeInTheDocument();
    expect(screen.getByText('x509 certificate viewer component')).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByText(title)).not.toBeInTheDocument();

    await openDialog();
    await screen.findByText(title);
    await userEvent.keyboard('{Escape}');

    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });

  it("Shouldn't open the dialog when its provider is not found", async () => {
    const { openDialog } = renderDialog(
      useCertificateViewerDialog,
      { certificate, providerId: '2' },
      { fortifyClient: null, providers, currentProviderId: providers[0].id },
    );

    await openDialog();

    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });

  it('Should close the dialog if its provider is removed', async () => {
    const { openDialog, setContext } = renderDialog(
      useCertificateViewerDialog,
      { certificate, providerId: providers[0].id },
      { fortifyClient: null, providers, currentProviderId: providers[0].id },
    );

    await openDialog();
    await screen.findByText(title);

    setContext({ fortifyClient: null, providers: [{ id: '2' }] as IProviderInfo[] });

    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });

  it('Should show the certificate chain in tabs', async () => {
    const fortifyClient: Partial<FortifyAPI> = {
      getProviderById: vi.fn().mockResolvedValue({
        id: providers[0].id,
        certStorage: {
          getChain: vi
            .fn()
            .mockResolvedValue([{ value: new ArrayBuffer(0) }, { value: new ArrayBuffer(0) }]),
        },
      }),
    };

    const { openDialog } = renderDialog(
      useCertificateViewerDialog,
      { certificate, providerId: providers[0].id },
      {
        fortifyClient: fortifyClient as FortifyAPI,
        providers,
        currentProviderId: providers[0].id,
      },
    );

    await openDialog();

    expect(await screen.findAllByRole('tab')).toHaveLength(2);
    expect(fortifyClient.getProviderById).toHaveBeenCalledWith(providers[0].id);
    // The mocked viewers render as adjacent text nodes, one per certificate.
    expect(
      screen.getByRole('dialog').textContent?.match(/x509 certificate viewer component/g),
    ).toHaveLength(2);
  });
});
