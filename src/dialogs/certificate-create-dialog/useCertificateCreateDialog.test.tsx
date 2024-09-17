import { renderHook, act } from "@testing";
import { vi } from "vitest";
import { useCertificateCreateDialog } from "./useCertificateCreateDialog";

import type { IProviderInfo, FortifyAPI } from "@peculiar/fortify-client-core";

vi.mock("@peculiar/react-components", async () => {
  const actual = await vi.importActual("@peculiar/react-components");
  return {
    ...actual,
    useToast: () => ({
      addToast: vi.fn(),
    }),
  };
});

describe("useCertificateCreateDialog", () => {
  const algorithm = { hash: "SHA-256", signature: "RSASSA-PKCS1-v1_5" };

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

  it("Should open the dialog with x509 type", () => {
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

    await act(async () => {
      const DialogComponent = result.current.dialog();

      DialogComponent &&
        (await DialogComponent.props.onCreateButtonClick({
          subject: { commonName: "example.com" },
          type: "x509",
          algorithm,
        }));
    });

    expect(onSuccessMock).toHaveBeenCalledWith("1");
    expect(mockFortifyClient.createX509).toHaveBeenCalledWith("1", {
      hashAlgorithm: "SHA-256",
      signatureAlgorithm: "RSASSA-PKCS1-v1_5",
      subjectName: "commonName=example.com",
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
          subject: { commonName: "example.com" },
          type: "csr",
          algorithm,
        }));
    });

    expect(onSuccessMock).toHaveBeenCalledWith("1");
    expect(mockFortifyClient.createPKCS10).toHaveBeenCalledWith("1", {
      hashAlgorithm: "SHA-256",
      signatureAlgorithm: "RSASSA-PKCS1-v1_5",
      subjectName: "commonName=example.com",
    });
  });
});
