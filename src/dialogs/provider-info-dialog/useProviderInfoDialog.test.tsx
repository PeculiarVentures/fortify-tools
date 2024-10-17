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

  it("Should initialize", async () => {
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
  });
});
