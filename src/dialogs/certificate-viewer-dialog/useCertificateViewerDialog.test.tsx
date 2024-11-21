import { renderHook, act } from "@testing";
import { useCertificateViewerDialog } from "./useCertificateViewerDialog";
import { CertificateProps } from "../../types";

import type { IProviderInfo } from "@peculiar/fortify-client-core";

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
  } as CertificateProps;

  const defaultOpenProps = {
    certificate,
    providerId: providers[0].id,
  };

  it("Should initialize, open & close dialog", () => {
    const { result } = renderHook(() =>
      useCertificateViewerDialog({
        providers,
      })
    );

    expect(result.current.dialog).toBeInstanceOf(Function);
    expect(result.current.open).toBeInstanceOf(Function);

    act(() => {
      result.current.open(defaultOpenProps);
    });

    const DialogComponent = result.current.dialog();

    expect(DialogComponent).not.toBeNull();
    expect(DialogComponent?.props.certificate).toBe(certificate);

    act(() => {
      DialogComponent?.props.onClose();
    });

    expect(result.current.dialog()).toBeNull();
  });

  it("Should close dialog if current provider is not found", async () => {
    const { result, rerender } = renderHook(
      (localProviders) =>
        useCertificateViewerDialog({
          providers: localProviders,
        }),
      { initialProps: providers }
    );

    act(() => {
      result.current.open(defaultOpenProps);
    });

    rerender([
      {
        id: "2",
      },
    ] as IProviderInfo[]);

    expect(result.current.dialog()).toBeNull();
  });
});
