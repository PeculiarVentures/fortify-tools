import { renderHook, act } from "@testing";
import { useProviderInfoDialog } from "./useProviderInfoDialog";

import type { IProviderInfo } from "@peculiar/fortify-client-core";

describe("useProviderInfoDialog", () => {
  const providers = [
    {
      id: "1",
      name: "Provider 1",
    },
  ] as IProviderInfo[];

  it("Should initialize, open & close", async () => {
    const { result } = renderHook(() =>
      useProviderInfoDialog({
        providers,
      })
    );

    expect(result.current.dialog).toBeInstanceOf(Function);
    expect(result.current.open).toBeInstanceOf(Function);

    act(() => {
      result.current.open(providers[0]);
    });

    const DialogComponent = result.current.dialog();

    expect(DialogComponent).not.toBeNull();
    expect(DialogComponent?.props.data).toBe(providers[0]);

    act(() => {
      DialogComponent?.props.onDialogClose();
    });

    expect(result.current.dialog()).toBeNull();
  });

  it("Should close dialog if current provider is not found", async () => {
    const { result, rerender } = renderHook(
      (localProviders) =>
        useProviderInfoDialog({
          providers: localProviders,
        }),
      { initialProps: providers }
    );

    act(() => {
      result.current.open(providers[0]);
    });

    rerender([
      {
        id: "2",
      },
    ] as IProviderInfo[]);

    expect(result.current.dialog()).toBeNull();
  });
});
