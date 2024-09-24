import { renderHook, act } from "@testing";
import { useCertificateViewerDialog } from "./useCertificateViewerDialog";
import { CertificateProps } from "../../types";

describe("useCertificateViewerDialog", () => {
  it("Should initialize", () => {
    const { result } = renderHook(() => useCertificateViewerDialog());

    expect(result.current.dialog).toBeInstanceOf(Function);
    expect(result.current.open).toBeInstanceOf(Function);
    expect(result.current.close).toBeInstanceOf(Function);

    const certificate = {
      id: "1",
      label: "Certificate name",
    } as CertificateProps;

    act(() => {
      result.current.open(certificate);
    });

    const DialogComponent = result.current.dialog();

    expect(DialogComponent).not.toBeNull();
    expect(DialogComponent?.props.certificate).toBe(certificate);
  });
});
