import { renderHook, act } from '@testing';
import type { IProviderInfo, FortifyAPI } from '@peculiar/fortify-client-core';
import { useCertificateDeleteDialog } from './useCertificateDeleteDialog';

const addToastMock = vi.fn();

vi.mock('@peculiar/react-components', async () => {
  const actual = await vi.importActual('@peculiar/react-components');

  return {
    ...actual,
    useToast: () => ({ addToast: addToastMock }),
  };
});

describe('useCertificateDeleteDialog', () => {
  const providers = [
    {
      id: '1',
      name: 'Provider 1',
    },
  ] as IProviderInfo[];

  const defaultOpenProps = {
    certificateIndex: '1',
    providerId: providers[0].id,
    label: 'Certificate Name',
  };

  it('Should open dialog, handle onSuccess & close dialog', async () => {
    const mockFortifyClient: Partial<FortifyAPI> = {
      removeCertificateById: vi.fn()
        .mockResolvedValue({}),
    };
    const onSuccessMock = vi.fn();

    const { result } = renderHook(() =>
      useCertificateDeleteDialog({
        providers: providers,
        onSuccess: onSuccessMock,
        fortifyClient: mockFortifyClient as FortifyAPI,
      }),
    );

    expect(result.current.dialog).toBeInstanceOf(Function);
    expect(result.current.open).toBeInstanceOf(Function);

    act(() => {
      result.current.open(defaultOpenProps);
    });

    const DialogComponent = result.current.dialog();

    await act(async () => {
      if (DialogComponent) {
        await DialogComponent.props.onDeleteClick(defaultOpenProps.certificateIndex);
      }
    });

    expect(onSuccessMock).toHaveBeenCalledWith(defaultOpenProps.providerId);
    expect(mockFortifyClient.removeCertificateById).toHaveBeenCalledWith(
      defaultOpenProps.providerId,
      defaultOpenProps.certificateIndex,
    );
    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Certificate deleted.' }),
    );

    act(() => {
      DialogComponent?.props.onDialogClose();
    });

    expect(result.current.dialog()).toBeNull();
    addToastMock.mockClear();
  });

  it('Should close dialog if current provider is not found', async () => {
    const { result, rerender } = renderHook(
      (localProviders) =>
        useCertificateDeleteDialog({
          providers: localProviders,
          onSuccess: vi.fn(),
          fortifyClient: null,
        }),
      { initialProps: providers },
    );

    act(() => {
      result.current.open(defaultOpenProps);
    });

    rerender([
      { id: '2' },
    ] as IProviderInfo[]);

    expect(result.current.dialog()).toBeNull();
  });

  it('Should show error message if certificate deletion fails', async () => {
    const mockFortifyClient: Partial<FortifyAPI> = {
      removeCertificateById: vi.fn().mockImplementation(() => {
        throw new Error('Error');
      }),
    };
    const onSuccessMock = vi.fn();

    const { result } = renderHook(() =>
      useCertificateDeleteDialog({
        providers: providers,
        onSuccess: onSuccessMock,
        fortifyClient: mockFortifyClient as FortifyAPI,
      }),
    );

    act(() => {
      result.current.open(defaultOpenProps);
    });

    await act(async () => {
      const DialogComponent = result.current.dialog();

      if (DialogComponent) {
        await DialogComponent.props.onDeleteClick(defaultOpenProps.certificateIndex);
      }
    });

    expect(onSuccessMock).not.toHaveBeenCalled();
    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message:
          'Failed to delete certificate because of error. Please try again.',
      }),
    );
    addToastMock.mockClear();
  });

  it('Shouldn\'t call if no certificate id is provided', async () => {
    const mockFortifyClient: Partial<FortifyAPI> = {
      removeCertificateById: vi.fn()
        .mockResolvedValue({}),
    };
    const onSuccessMock = vi.fn();

    const { result } = renderHook(() =>
      useCertificateDeleteDialog({
        providers: providers,
        onSuccess: onSuccessMock,
        fortifyClient: mockFortifyClient as FortifyAPI,
      }),
    );

    act(() => {
      result.current.open(defaultOpenProps);
    });

    await act(async () => {
      const DialogComponent = result.current.dialog();

      if (DialogComponent) {
        await DialogComponent.props.onDeleteClick(undefined);
      }
    });

    expect(onSuccessMock).not.toHaveBeenCalled();
    expect(addToastMock).not.toHaveBeenCalled();
  });

  it('Shouldn\'t call if no fortifyClient is provided', async () => {
    const onSuccessMock = vi.fn();

    const { result } = renderHook(() =>
      useCertificateDeleteDialog({
        providers: providers,
        onSuccess: onSuccessMock,
        fortifyClient: null,
      }),
    );

    act(() => {
      result.current.open(defaultOpenProps);
    });

    await act(async () => {
      const DialogComponent = result.current.dialog();

      if (DialogComponent) {
        await DialogComponent.props.onDeleteClick(defaultOpenProps.certificateIndex);
      }
    });

    expect(onSuccessMock).not.toHaveBeenCalled();
    expect(addToastMock).not.toHaveBeenCalled();
  });
});
