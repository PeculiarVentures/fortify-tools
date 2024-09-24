import { renderHook, act } from "@testing";
import { vi } from "vitest";
import { useCertificateDeleteDialog } from "./useCertificateDeleteDialog";

import type { FortifyAPI } from "@peculiar/fortify-client-core";

vi.mock("@peculiar/react-components", async () => {
  const actual = await vi.importActual("@peculiar/react-components");
  return {
    ...actual,
    useToast: () => ({
      addToast: vi.fn(),
    }),
  };
});

describe("useCertificateDeleteDialog", () => {
  it("Should initialize and call onSuccess", async () => {
    const certificateIndex = "1";
    const providerId = "2";

    const mockFortifyClient: Partial<FortifyAPI> = {
      removeCertificateById: vi.fn().mockResolvedValue({}),
    };
    const onSuccessMock = vi.fn();

    const { result } = renderHook(() =>
      useCertificateDeleteDialog({
        onSuccess: onSuccessMock,
        fortifyClient: mockFortifyClient as FortifyAPI,
      })
    );

    expect(result.current.dialog).toBeInstanceOf(Function);
    expect(result.current.open).toBeInstanceOf(Function);
    expect(result.current.close).toBeInstanceOf(Function);

    act(() => {
      result.current.open({
        certificateIndex,
        providerId,
        label: "Message",
      });
    });

    await act(async () => {
      const DialogComponent = result.current.dialog();

      DialogComponent &&
        (await DialogComponent.props.onDeleteClick(certificateIndex));
    });

    expect(onSuccessMock).toHaveBeenCalledWith(providerId);
    expect(mockFortifyClient.removeCertificateById).toHaveBeenCalledWith(
      providerId,
      certificateIndex
    );
  });
});
