import { renderHook, act } from "@testing";
import { useCertificateCreateDialog } from "./useCertificateCreateDialog";

import type { IProviderInfo, FortifyAPI } from "@peculiar/fortify-client-core";

const addToastMock = vi.fn();

vi.mock("@peculiar/react-components", async () => {
  const actual = await vi.importActual("@peculiar/react-components");
  return {
    ...actual,
    useToast: () => ({
      addToast: addToastMock,
    }),
  };
});

describe("useCertificateCreateDialog", () => {
  const algorithm = { hash: "SHA-256", signature: "RSASSA-PKCS1-v1_5" };

  const defaultCreateProps = {
    subject: { commonName: "example.com" },
    type: "x509",
    algorithm,
  };

  const defaultResultMock = {
    hashAlgorithm: "SHA-256",
    signatureAlgorithm: "RSASSA-PKCS1-v1_5",
    subjectName: "commonName=example.com",
  };

  const providers = [
    {
      id: "1",
      name: "Provider 1",
    },
  ] as IProviderInfo[];

  it("Should initialize", () => {
    const { result } = renderHook(() =>
      useCertificateCreateDialog({
        providers,
        onSuccess: vi.fn(),
      })
    );

    expect(result.current.dialog).toBeInstanceOf(Function);
    expect(result.current.open).toBeInstanceOf(Function);
  });

  it("Should open & close the dialog with x509 type", () => {
    const { result } = renderHook(() =>
      useCertificateCreateDialog({
        providers,
        onSuccess: vi.fn(),
      })
    );

    act(() => {
      result.current.open("x509");
    });

    const DialogComponent = result.current.dialog();

    expect(DialogComponent).not.toBeNull();
    expect(DialogComponent?.props.type).toBe("x509");

    act(() => {
      DialogComponent?.props.onDialogClose();
    });

    expect(result.current.dialog()).toBeNull();
  });

  it("Should open the dialog with csr type", () => {
    const { result } = renderHook(() =>
      useCertificateCreateDialog({
        providers,
        onSuccess: vi.fn(),
      })
    );

    act(() => {
      result.current.open("csr");
    });

    const DialogComponent = result.current.dialog();
    expect(DialogComponent?.props.type).toBe("csr");
  });

  it("Should call onSuccess (x509)", async () => {
    const onSuccessMock = vi.fn();
    const mockFortifyClient: Partial<FortifyAPI> = {
      createX509: vi.fn().mockResolvedValue({}),
    };

    const { result } = renderHook(() =>
      useCertificateCreateDialog({
        providers,
        onSuccess: onSuccessMock,
        fortifyClient: mockFortifyClient as FortifyAPI,
        currentProviderId: "1",
      })
    );

    act(() => {
      result.current.open("x509");
    });
    const DialogComponent = result.current.dialog();

    DialogComponent?.props.onProviderSelect("2");

    await act(async () => {
      DialogComponent &&
        (await DialogComponent.props.onCreateButtonClick({
          ...defaultCreateProps,
          extendedKeyUsages: ["serverAuth", "clientAuth"],
        }));
    });

    expect(onSuccessMock).toHaveBeenCalledWith("2");
    expect(mockFortifyClient.createX509).toHaveBeenCalledWith("2", {
      ...defaultResultMock,
      extensions: {
        extendedKeyUsage: ["serverAuth", "clientAuth"],
      },
    });
  });

  it("Should call onSuccess (csr)", async () => {
    const onSuccessMock = vi.fn();
    const mockFortifyClient: Partial<FortifyAPI> = {
      createPKCS10: vi.fn().mockResolvedValue({}),
    };

    const { result } = renderHook(() =>
      useCertificateCreateDialog({
        providers,
        onSuccess: onSuccessMock,
        fortifyClient: mockFortifyClient as FortifyAPI,
        currentProviderId: "1",
      })
    );

    act(() => {
      result.current.open("csr");
    });

    await act(async () => {
      const DialogComponent = result.current.dialog();

      DialogComponent &&
        (await DialogComponent.props.onCreateButtonClick({
          ...defaultCreateProps,
          type: "csr",
        }));
    });

    expect(onSuccessMock).toHaveBeenCalledWith("1");
    expect(mockFortifyClient.createPKCS10).toHaveBeenCalledWith(
      "1",
      defaultResultMock
    );
  });

  it("Should show error message if certificate creation fails", async () => {
    const onSuccessMock = vi.fn();
    const mockFortifyClient: Partial<FortifyAPI> = {
      createX509: vi.fn().mockImplementation(() => {
        throw new Error("Error");
      }),
    };

    const { result } = renderHook(() =>
      useCertificateCreateDialog({
        providers,
        onSuccess: onSuccessMock,
        fortifyClient: mockFortifyClient as FortifyAPI,
        currentProviderId: "1",
      })
    );

    act(() => {
      result.current.open("x509");
    });

    await act(async () => {
      const DialogComponent = result.current.dialog();

      DialogComponent &&
        (await DialogComponent.props.onCreateButtonClick(defaultCreateProps));
    });

    expect(onSuccessMock).not.toHaveBeenCalled();
    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Can't create certificate",
      })
    );
    addToastMock.mockClear();
  });

  it("Should show error message if pass invalid certificate type", async () => {
    const onSuccessMock = vi.fn();
    const typeMock = "unregisterd_type" as "x509";
    const mockFortifyClient: Partial<FortifyAPI> = {
      createX509: vi.fn().mockResolvedValue({}),
    };

    const { result } = renderHook(() =>
      useCertificateCreateDialog({
        providers,
        onSuccess: onSuccessMock,
        fortifyClient: mockFortifyClient as FortifyAPI,
        currentProviderId: "1",
      })
    );

    act(() => {
      result.current.open(typeMock);
    });

    await act(async () => {
      const DialogComponent = result.current.dialog();

      DialogComponent &&
        (await DialogComponent.props.onCreateButtonClick({
          ...defaultCreateProps,
          type: typeMock,
        }));
    });

    expect(onSuccessMock).not.toHaveBeenCalled();
    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Can't create certificate",
      })
    );
    addToastMock.mockClear();
  });

  it("Shouldn't call if fortifyClient not provided", async () => {
    const onSuccessMock = vi.fn();

    const { result } = renderHook(() =>
      useCertificateCreateDialog({
        providers,
        onSuccess: onSuccessMock,
        fortifyClient: null,
      })
    );

    act(() => {
      result.current.open("x509");
    });

    const DialogComponent = result.current.dialog();
    await act(async () => {
      DialogComponent &&
        (await DialogComponent.props.onCreateButtonClick(defaultCreateProps));
    });

    expect(onSuccessMock).not.toHaveBeenCalled();
    expect(addToastMock).not.toHaveBeenCalled();
  });
});
