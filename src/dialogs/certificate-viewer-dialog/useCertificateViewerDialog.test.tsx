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

  it("Should initialize", () => {
    const { result } = renderHook(() =>
      useCertificateViewerDialog({
        providers,
        fortifyClient: null,
        currentProviderId: providers[0].id,
      })
    );

    expect(result.current.dialog).toBeInstanceOf(Function);
    expect(result.current.open).toBeInstanceOf(Function);

    const certificate = {
      id: "1",
      label: "Certificate name",
    } as CertificateProps;

    act(() => {
      result.current.open({
        certificate,
        providerId: providers[0].id,
      });
    });

    const DialogComponent = result.current.dialog();

    expect(DialogComponent).not.toBeNull();
    expect(DialogComponent?.props.certificates).toStrictEqual([certificate]);
  });
});
