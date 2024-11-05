import { describe, it, expect, vi } from "vitest";
import { downloadCertificate } from "./download-certificate";
import { CertificateType } from "../types";
import { Download } from "@peculiar/certificates-viewer";

vi.mock("@peculiar/certificates-viewer", () => ({
  Download: {
    cert: {
      asPEM: vi.fn(),
    },
    csr: {
      asPEM: vi.fn(),
    },
  },
}));

vi.mock("@peculiar/x509", () => ({
  X509Certificate: vi.fn().mockImplementation(() => ({
    toString: vi.fn().mockReturnValue("mocked-pem-x509"),
  })),
  Pkcs10CertificateRequest: vi.fn().mockImplementation(() => ({
    toString: vi.fn().mockReturnValue("mocked-pem-csr"),
  })),
}));

describe("downloadCertificate", () => {
  const label = "test-label";
  const mockCertRaw = new ArrayBuffer(8);

  it("Should handle download x509 certificate as PEM", () => {
    downloadCertificate(label, mockCertRaw, "x509");

    expect(Download.cert.asPEM).toHaveBeenCalledWith("mocked-pem-x509", label);
  });

  it("Should handle download CSR as PEM", () => {
    downloadCertificate(label, mockCertRaw, "csr");

    expect(Download.csr.asPEM).toHaveBeenCalledWith("mocked-pem-csr", label);
  });

  it("Should throw an error for unsupported certificate type", () => {
    expect(() =>
      downloadCertificate(
        label,
        mockCertRaw,
        "unsupported-type" as CertificateType
      )
    ).toThrowError("Unsupported certificate type: unsupported-type");
  });
});
