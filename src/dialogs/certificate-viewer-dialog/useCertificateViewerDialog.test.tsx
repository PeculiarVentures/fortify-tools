import { renderHook, act } from "@testing";
import { vi } from "vitest";
import { useCertificateViewerDialog } from "./useCertificateViewerDialog";
import { CertificateProps } from "../../types";

import type { IProviderInfo, FortifyAPI } from "@peculiar/fortify-client-core";

vi.mock("@peculiar/x509", async (importOriginal) => {
  const originalModule =
    await importOriginal<typeof import("@peculiar/x509")>();

  return {
    ...originalModule,
    X509Certificate: vi.fn().mockImplementation(() => ({
      rawData: new ArrayBuffer(0),
      subject: "Test Subject",
      subjectName: "Rest Subject Name",
    })),
  };
});

describe("useCertificateViewerDialog", () => {
  const providers = [
    {
      id: "1",
      name: "Provider 1",
    },
  ] as IProviderInfo[];

  const certificate = {
    id: "1",
    label: "Certificate name",
    type: "x509",
  } as CertificateProps;

  const defaultProps = {
    providers,
    fortifyClient: null,
    currentProviderId: providers[0].id,
  };

  const defaultOpenProps = {
    certificate,
    providerId: providers[0].id,
  };

  it("Should initialize, open & close dialog", () => {
    const { result } = renderHook(() =>
      useCertificateViewerDialog(defaultProps)
    );

    expect(result.current.dialog).toBeInstanceOf(Function);
    expect(result.current.open).toBeInstanceOf(Function);

    act(() => {
      result.current.open(defaultOpenProps);
    });

    const DialogComponent = result.current.dialog();

    expect(DialogComponent).not.toBeNull();
    expect(DialogComponent?.props.certificates).toStrictEqual([certificate]);

    DialogComponent?.props.onClose();
    expect(result.current.dialog()).toBeNull();
  });

  it("Should close the dialog when the current provider is not found", () => {
    const { result } = renderHook(() =>
      useCertificateViewerDialog(defaultProps)
    );

    act(() => {
      result.current.open({
        ...defaultOpenProps,
        providerId: "2",
      });
    });

    const DialogComponent = result.current.dialog();
    expect(DialogComponent).toBeNull();
  });

  it("Should make a chain of certificates", async () => {
    const mockFortifyClient: Partial<FortifyAPI> = {
      getProviderById: vi.fn().mockResolvedValue({
        certStorage: {
          getChain: vi
            .fn()
            .mockResolvedValue([
              { value: new ArrayBuffer(0) },
              { value: new ArrayBuffer(0) },
            ]),
        },
      }),
    };

    const { result } = renderHook(() =>
      useCertificateViewerDialog({
        ...defaultProps,
        fortifyClient: mockFortifyClient as FortifyAPI,
      })
    );

    await act(async () => {
      await result.current.open(defaultOpenProps);
    });

    const DialogComponent = result.current.dialog();
    expect(mockFortifyClient.getProviderById).toHaveBeenCalled();
    expect(DialogComponent).not.toBeNull();
    expect(DialogComponent?.props.certificates.length).toBe(2);
  });
});
