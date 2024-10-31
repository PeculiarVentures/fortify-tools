import { renderHook, act } from "@testing";
import { certificateCSRPem, certificateX509Pem } from "@testing/data";
import { useCertificateImportDialog } from "./useCertificateImportDialog";

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

describe("useCertificateImportDialog", () => {
  const providers = [
    {
      id: "1",
      name: "Provider 1",
    },
  ] as IProviderInfo[];

  const certStorageMock = {
    importCert: vi.fn(),
    setItem: vi.fn(),
  };

  const fortifyClientMock: Partial<FortifyAPI> = {
    getProviderById: vi.fn().mockResolvedValue({
      certStorage: certStorageMock,
    }),
  };

  const defaultProps = {
    providers,
    onSuccess: vi.fn(),
    fortifyClient: fortifyClientMock as FortifyAPI,
    currentProviderId: providers[0].id,
  };

  async function testFileUploadCertificate(
    certificate: string,
    extension: string
  ) {
    const onSuccessMock = vi.fn();

    const byteArray = new TextEncoder().encode(certificate);

    const { result } = renderHook(() =>
      useCertificateImportDialog({
        ...defaultProps,
        onSuccess: onSuccessMock,
      })
    );
    act(() => {
      result.current.open();
    });

    await act(async () => {
      const DialogComponent = result.current.dialog();
      if (DialogComponent) {
        DialogComponent.props.onDropAccepted(byteArray.buffer, extension, "");
        await DialogComponent.props.onImportButtonClick();
      }
    });

    expect(fortifyClientMock.getProviderById).toHaveBeenCalledWith(
      defaultProps.currentProviderId
    );
    expect(certStorageMock.importCert).toHaveBeenCalled();
    expect(certStorageMock.setItem).toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalledWith(defaultProps.currentProviderId);
  }

  async function testPasteCertificateBase64format(certificate: string) {
    const onSuccessMock = vi.fn();

    const { result } = renderHook(() =>
      useCertificateImportDialog({
        ...defaultProps,
        onSuccess: onSuccessMock,
      })
    );

    act(() => {
      result.current.open();
    });

    act(() => {
      result.current.dialog()?.props.onTextAreaChange(certificate);
    });

    await act(async () => {
      const DialogComponent = result.current.dialog();
      if (DialogComponent) {
        DialogComponent.props.onTextAreaBlur();
        DialogComponent?.props.onProviderSelect("2");
        await DialogComponent.props.onImportButtonClick();
      }
    });

    expect(fortifyClientMock.getProviderById).toHaveBeenCalledWith("2");
    expect(certStorageMock.importCert).toHaveBeenCalled();
    expect(certStorageMock.setItem).toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalledWith("2");
  }

  it("Should initialize, open & close the dialog", () => {
    const { result } = renderHook(() =>
      useCertificateImportDialog(defaultProps)
    );

    expect(result.current.dialog).toBeInstanceOf(Function);
    expect(result.current.open).toBeInstanceOf(Function);

    act(() => {
      result.current.open();
    });

    act(() => {
      result.current.dialog()?.props.onDialogClose();
    });

    expect(result.current.dialog()).toBeNull();
  });

  it("Should past certificate & call onSuccess (x509)", () =>
    testPasteCertificateBase64format(certificateX509Pem));

  it("Should past certificate & call onSuccess (CSR)", () =>
    testPasteCertificateBase64format(certificateCSRPem));

  it("Should upload file certificate & call onSuccess (x509)", () =>
    testFileUploadCertificate(certificateX509Pem, "cer"));

  it("Should upload file certificate & call onSuccess (CSR)", () =>
    testFileUploadCertificate(certificateCSRPem, "csr"));

  it("Should handle text area validation error", () => {
    const { result } = renderHook(() =>
      useCertificateImportDialog(defaultProps)
    );

    act(() => {
      result.current.open();
    });

    act(() => {
      result.current.dialog()?.props.onTextAreaChange("");
    });

    act(() => {
      result.current.dialog()?.props.onTextAreaBlur();
    });

    expect(result.current.dialog()?.props.isTextAreaError).toBeTruthy();

    act(() => {
      result.current.dialog()?.props.onTextAreaChange("certificate");
    });

    act(() => {
      result.current.dialog()?.props.onTextAreaBlur();
    });

    expect(result.current.dialog()?.props.isTextAreaError).toBeTruthy();
  });

  it("Should handle file rejection correctly", () => {
    const { result } = renderHook(() =>
      useCertificateImportDialog(defaultProps)
    );

    act(() => {
      result.current.open();
    });

    const errorMessage = "Error message";
    act(() => {
      result.current.dialog()?.props.onDropRejected(errorMessage);
    });

    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: errorMessage,
        variant: "wrong",
      })
    );
  });

  it("Should clear the certificate textarea and reset error on clear button click", async () => {
    const { result } = renderHook(() =>
      useCertificateImportDialog(defaultProps)
    );

    act(() => {
      result.current.open();
    });

    act(() => {
      result.current.dialog()?.props.onTextAreaChange("certificate");
    });

    act(() => {
      result.current.dialog()?.props.onTextAreaBlur();
    });

    expect(result.current.dialog()?.props.isTextAreaError).toBeTruthy();

    await act(async () => {
      const DialogComponent = result.current.dialog();
      if (DialogComponent) {
        DialogComponent.props.onTextAreaBlur();
        await DialogComponent.props.onClearButtonClick();
      }
    });

    expect(result.current.dialog()?.props.isTextAreaError).toBeFalsy();
    expect(result.current.dialog()?.props.certificate).toBe("");
  });

  it("Should handle the error when uploading an invalid certificate", async () => {
    const byteArray = new TextEncoder().encode("certificate");
    const { result } = renderHook(() =>
      useCertificateImportDialog(defaultProps)
    );

    act(() => {
      result.current.open();
    });

    await act(async () => {
      const DialogComponent = result.current.dialog();
      if (DialogComponent) {
        DialogComponent.props.onDropAccepted(byteArray.buffer, "cer", "");
        await DialogComponent.props.onImportButtonClick();
      }
    });

    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message:
          "Certificate is invalid. Please check your data and try again.",
        variant: "wrong",
      })
    );
  });

  it("Should handle the error when onDropError is triggered", () => {
    const { result } = renderHook(() =>
      useCertificateImportDialog(defaultProps)
    );

    act(() => {
      result.current.open();
    });

    act(() => {
      result.current.dialog()?.props.onDropError("Error");
    });

    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message:
          "Certificate is invalid. Please check your data and try again.",
        variant: "wrong",
      })
    );
  });

  it("Should handle the error when certificate is invalid", async () => {
    const importCertMock = vi.fn().mockImplementation(() => {
      throw new Error("Error");
    });
    const { result } = renderHook(() =>
      useCertificateImportDialog({
        ...defaultProps,
        fortifyClient: {
          getProviderById: vi.fn().mockResolvedValue({
            certStorage: {
              importCert: importCertMock,
              setItem: vi.fn(),
            },
          }),
        } as unknown as FortifyAPI,
      })
    );
    act(() => {
      result.current.open();
    });

    act(() => {
      result.current.dialog()?.props.onTextAreaChange(certificateX509Pem);
    });

    await act(async () => {
      const DialogComponent = result.current.dialog();
      if (DialogComponent) {
        DialogComponent.props.onTextAreaBlur();
        await DialogComponent.props.onImportButtonClick();
      }
    });

    expect(addToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message:
          "Failed to import certificate because of error. Please try again.",
        variant: "wrong",
      })
    );
  });
});
