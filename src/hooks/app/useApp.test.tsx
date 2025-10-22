import {
  act, renderHook, waitFor,
} from '@testing';
import type { IProviderInfo } from '@peculiar/fortify-client-core';
import { FortifyAPI } from '@peculiar/fortify-client-core';
import { useApp } from './useApp';

const addToastMock = vi.fn();

vi.mock('@peculiar/fortify-client-core');
vi.mock('@peculiar/react-components', async () => {
  const actual = await vi.importActual('@peculiar/react-components');

  return {
    ...actual,
    useToast: () => ({ addToast: addToastMock }),
  };
});

describe('useApp', () => {
  const providersMock = [
    {
      id: '1',
      name: 'Provider 1',
    },
    {
      id: '2',
      name: 'Provider 2',
    },
  ] as IProviderInfo[];

  const certificatesMock = [{
    id: '1', name: 'Certificate 1',
  }];

  const mockFortifyAPIInstance: Partial<FortifyAPI> = {
    challenge: vi.fn().mockResolvedValue(''),
    login: vi.fn(),
    getProviders: vi.fn().mockResolvedValue(providersMock),
    isConnectionSupported: vi.fn().mockReturnValue(true),
    isConnectionDetected: vi.fn().mockResolvedValue(true),
    isConnectionDetectedAuto: vi.fn(),
    connect: vi.fn(),
    getProviderById: vi.fn().mockResolvedValue({
      id: '1',
      isLoggedIn: vi.fn().mockResolvedValue(true),
      reset: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
    }),
    getCertificatesByProviderId: vi.fn().mockResolvedValue(certificatesMock),
    getCertificateRequestsByProviderId: vi.fn().mockResolvedValue([]),
  };

  it('Should initialize, get providers & certificates', async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstance as FortifyAPI,
    );
    const { result } = renderHook(() => useApp());

    await waitFor(() => {
      expect(result.current.currentProvider).toEqual(providersMock[0]);
    });
    expect(result.current.fortifyClient).toEqual(mockFortifyAPIInstance);
    expect(result.current.fetching).toEqual(
      expect.objectContaining({
        certificates: 'resolved',
        providers: 'resolved',
      }),
    );
    expect(result.current.providers).toEqual(providersMock);
    expect(result.current.certificates).toEqual(certificatesMock);
    expect(result.current.isCurrentProviderLogedin).toBe(true);
  });

  it('Should handle connection not supported', () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () =>
        ({
          ...mockFortifyAPIInstance,
          isConnectionSupported: vi.fn().mockReturnValue(false),
        }) as unknown as FortifyAPI,
    );
    const { result } = renderHook(() => useApp());

    expect(result.current.fetching.connectionSupport).toEqual('rejected');
  });

  it('Should handle connection not detected', () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () =>
        ({
          ...mockFortifyAPIInstance,
          isConnectionDetected: vi.fn().mockReturnValue(false),
        }) as unknown as FortifyAPI,
    );
    const { result } = renderHook(() => useApp());

    waitFor(() => {
      expect(result.current.fetching.connectionDetect).toEqual('rejected');
    });
  });

  it('Should handle client update', () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () =>
        ({
          ...mockFortifyAPIInstance,
          connect: vi.fn().mockImplementation(() => {
            throw new Error('update your client to the latest version');
          }),
        }) as unknown as FortifyAPI,
    );
    const { result } = renderHook(() => useApp());

    waitFor(() => {
      expect(result.current.fetching.connectionClientUpdate).toEqual(
        'rejected',
      );
    });
  });

  it('Should handle connectionApprove is resolved', async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () =>
        ({
          ...mockFortifyAPIInstance,
          challenge: vi.fn().mockReturnValue('12345'),
        }) as unknown as FortifyAPI,
    );
    const { result } = renderHook(() => useApp());

    await waitFor(() => {
      expect(result.current.challenge).toEqual('12345');
    });
    expect(result.current.fetching.connectionApprove).toEqual('resolved');
  });

  it('Should handle connectionApprove is rejected', async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () =>
        ({
          ...mockFortifyAPIInstance,
          challenge: vi.fn().mockRejectedValue(new Error('Error')),
        }) as unknown as FortifyAPI,
    );
    const { result } = renderHook(() => useApp());

    await waitFor(() => {
      expect(result.current.fetching.connectionApprove).toEqual('rejected');
    });
    expect(result.current.certificates).toEqual([]);
  });

  it('Should handle provider change', async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstance as FortifyAPI,
    );
    const { result } = renderHook(() => useApp());

    await waitFor(() => {
      expect(result.current.currentProvider).toEqual(providersMock[0]);
    });

    await act(async () => {
      await result.current.handleProviderChange(providersMock[1].id);
    });

    expect(result.current.currentProvider).toEqual(providersMock[1]);
  });

  it('Should handle reload certificates', async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstance as FortifyAPI,
    );
    const { result } = renderHook(() => useApp());

    await act(async () => {
      await result.current.handleCertificatesDataReload(providersMock[0].id);
    });

    expect(result.current.certificates).toEqual(certificatesMock);
  });

  it('Should handle reset provider & reload certificates', async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstance as FortifyAPI,
    );
    const { result } = renderHook(() => useApp());

    await act(async () => {
      await result.current.handleProviderResetAndRefreshList();
    });

    expect(result.current.currentProvider).toEqual(providersMock[0]);
    expect(result.current.certificates).toEqual(certificatesMock);
  });

  it('Should handle provider logout', async () => {
    const logoutMock = vi.fn();

    vi.mocked(FortifyAPI).mockImplementation(
      () =>
        ({
          ...mockFortifyAPIInstance,
          getProviderById: vi.fn().mockResolvedValue({
            id: '1',
            isLoggedIn: vi.fn().mockResolvedValue(false),
            logout: logoutMock,
          }),
        }) as unknown as FortifyAPI,
    );
    const { result } = renderHook(() => useApp());

    await waitFor(() => {
      expect(result.current.currentProvider).toEqual(providersMock[0]);
    });

    await act(async () => {
      await result.current.handleProviderLoginLogout(true);
    });

    expect(logoutMock).toHaveBeenCalled();
    expect(result.current.isCurrentProviderLogedin).toEqual(false);
  });

  it('Should handle provider login', async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstance as FortifyAPI,
    );
    const { result } = renderHook(() => useApp());

    await waitFor(() => {
      expect(result.current.currentProvider).toEqual(providersMock[0]);
    });

    await act(async () => {
      await result.current.handleProviderLoginLogout(false);
    });

    expect(
      mockFortifyAPIInstance.getProviderById
      && (await mockFortifyAPIInstance.getProviderById(providersMock[0].id))
        .login,
    ).toHaveBeenCalled();
    expect(result.current.isCurrentProviderLogedin).toEqual(true);
  });

  it('Should set login status to false when error occured during login', async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () =>
        ({
          ...mockFortifyAPIInstance,
          getProviderById: vi.fn().mockResolvedValue(new Error('Error')),
        }) as unknown as FortifyAPI,
    );
    const { result } = renderHook(() => useApp());

    await waitFor(() => {
      expect(result.current.currentProvider).toEqual(providersMock[0]);
    });

    await act(async () => {
      await result.current.handleProviderLoginLogout(false);
    });

    expect(result.current.isCurrentProviderLogedin).toEqual(false);
  });

  it('Should show error message if provider doesn\'t support signing in', async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () =>
        ({
          ...mockFortifyAPIInstance,
          getProviderById: vi.fn().mockResolvedValue({
            id: '1',
            isLoggedIn: vi.fn().mockResolvedValue(true),
            logout: vi.fn(),
          }),
        }) as unknown as FortifyAPI,
    );
    const { result } = renderHook(() => useApp());

    await waitFor(() => {
      expect(result.current.currentProvider).toEqual(providersMock[0]);
    });

    await act(async () => {
      await result.current.handleProviderLoginLogout(true);
    });

    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'This provider doesn’t support signing in.',
        variant: 'attention',
      }),
    );
    addToastMock.mockClear();
  });

  it('Should return early if no fortifyClient is present', async () => {
    const { result } = renderHook(() => useApp());

    result.current.fortifyClient = null;

    waitFor(async () => {
      expect(
        await result.current.handleCertificatesDataReload('1'),
      ).toReturnWith(undefined);
    });

    waitFor(async () => {
      expect(await result.current.handleProviderLoginLogout(true)).toReturnWith(
        undefined,
      );
    });

    waitFor(async () => {
      expect(
        await result.current.handleProviderResetAndRefreshList(),
      ).toReturnWith(undefined);
    });

    waitFor(async () => {
      expect(await result.current.handleProviderChange('1')).toReturnWith(
        undefined,
      );
    });
  });

  it('Should reload app on handleRetryConection', () => {
    const originalLocation = global.location;

    global.location = {
      ...originalLocation,
      reload: vi.fn(),
    };

    const { result } = renderHook(() => useApp());

    act(() => {
      result.current.handleRetryConection();
    });

    expect(global.location.reload).toHaveBeenCalled();

    global.location = originalLocation;
  });

  it('Should clear certificates when error occured during first load & reload', async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () =>
        ({
          ...mockFortifyAPIInstance,
          getCertificatesByProviderId: vi
            .fn()
            .mockRejectedValue(new Error('Error')),
        }) as unknown as FortifyAPI,
    );

    const { result } = renderHook(() => useApp());

    await waitFor(() => {
      expect(result.current.currentProvider).toEqual(providersMock[0]);
    });

    expect(result.current.certificates).toEqual([]);

    await act(async () => {
      await result.current.handleCertificatesDataReload(providersMock[0].id);
    });

    expect(result.current.certificates).toEqual([]);
  });
});
