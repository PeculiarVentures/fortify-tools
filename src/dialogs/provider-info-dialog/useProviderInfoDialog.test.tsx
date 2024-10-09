import { renderHook, act } from "@testing";
import type { IProviderInfo } from "@peculiar/fortify-client-core";
import { useProviderInfoDialog } from "./useProviderInfoDialog";

describe("useProviderInfoDialog", () => {
  it("Should initialize", async () => {
    const { result } = renderHook(() => useProviderInfoDialog());

    expect(result.current.dialog).toBeInstanceOf(Function);
    expect(result.current.open).toBeInstanceOf(Function);
    expect(result.current.close).toBeInstanceOf(Function);

    const provider = {
      name: "name-text",
    } as IProviderInfo;

    act(() => {
      result.current.open(provider);
    });

    const DialogComponent = result.current.dialog();

    expect(DialogComponent).not.toBeNull();
    expect(DialogComponent?.props.data).toBe(provider);
  });
});
