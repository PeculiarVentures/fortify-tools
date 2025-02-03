import { render, screen, userEvent, waitFor } from "@testing";

import type { IProviderInfo } from "@peculiar/fortify-client-core";
import { FortifyAPI } from "@peculiar/fortify-client-core";
import { App } from "./app";

vi.mock("@peculiar/fortify-client-core");
vi.mock("@peculiar/certificates-viewer-react", () => ({
  PeculiarCertificateViewer: () => "x509 certificate viewer component",
  PeculiarCsrViewer: () => "CSR certificate viewer component",
}));

describe("<App />", () => {
  const providersMock = [
    {
      id: "provider1",
      name: "Provider 1",
    },
    {
      id: "provider2",
      name: "Provider 2",
    },
  ] as IProviderInfo[];

  const certificatesMock = [
    {
      id: "1",
      providerID: "provider1",
      subject: {
        CN: ["Certificate test 1"],
      },
      subjectName: "Certificate test 1",
      raw: new ArrayBuffer(1),
      type: "x509",
      serialNumber: "1",
      notAfter: new Date("2024-01-01"),
    },
    {
      id: "2",
      providerID: "provider1",
      subject: {
        CN: ["Certificate test 2"],
      },
      subjectName: "Certificate test 2",
      raw: new ArrayBuffer(0),
      type: "x509",
      serialNumber: "2",
      notAfter: new Date("2024-01-02"),
    },
  ];

  const certificateRequestsMock = [
    {
      id: "1",
      providerID: "provider1",
      subject: {
        CN: ["Certificate request test 1"],
      },
      raw: new ArrayBuffer(1),
      type: "request",
    },
  ];

  const mockFortifyAPIInstance: Partial<FortifyAPI> = {
    challenge: vi.fn().mockResolvedValue(""),
    login: vi.fn(),
    getProviders: vi.fn().mockResolvedValue(providersMock),
    isConnectionSupported: vi.fn().mockReturnValue(true),
    isConnectionDetected: vi.fn().mockResolvedValue(true),
    isConnectionDetectedAuto: vi.fn(),
    connect: vi.fn(),
    getProviderById: vi.fn().mockResolvedValue({
      id: providersMock[0].id,
      isLoggedIn: vi.fn().mockResolvedValue(true),
      reset: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
    }),
    getCertificatesByProviderId: vi.fn().mockResolvedValue(certificatesMock),
    getCertificateRequestsByProviderId: vi.fn().mockResolvedValue([]),
  };

  const mockFortifyAPIInstanceWithCertificateRequests = {
    ...mockFortifyAPIInstance,
    getCertificateRequestsByProviderId: vi
      .fn()
      .mockResolvedValue(certificateRequestsMock),
  } as unknown as FortifyAPI;

  it("Should render, show providers & certificates & certificate requests", async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstanceWithCertificateRequests
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Provider 1/)).toBeInTheDocument();
      expect(screen.getByText(/Provider 2/)).toBeInTheDocument();
      expect(screen.getByText(/Certificate test 1/)).toBeInTheDocument();
      expect(screen.getByText(/Certificate test 2/)).toBeInTheDocument();
      expect(
        screen.getByText(/Certificate request test 1/)
      ).toBeInTheDocument();
    });
  });

  it("Should open provider info dialog", async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstance as FortifyAPI
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Certificate test 1/)).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole("button", { name: /info/i }));

    await waitFor(() => {
      expect(screen.getByText(/Provider 1 information/)).toBeInTheDocument();
    });
  });

  it("Should open delete certificate dialog", async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstance as FortifyAPI
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Certificate test 1/)).toBeInTheDocument();
    });

    await userEvent.click(screen.getAllByLabelText(/Delete certificate/)[0]);

    await waitFor(() => {
      expect(screen.getByText(/Delete certificate/)).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Are you sure you want to delete “Certificate test 2”/)
    ).toBeInTheDocument();
  });

  it("Should open view certificate details dialog", async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstance as FortifyAPI
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Certificate test 1/)).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getAllByRole("button", { name: /View details/ })[0]
    );

    await waitFor(() => {
      expect(
        screen.getByText(/“Certificate test 2” details/)
      ).toBeInTheDocument();
    });
  });

  it("Should open view certificate request details dialog", async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstanceWithCertificateRequests as FortifyAPI
    );

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText(/Certificate request test 1/)
      ).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getAllByRole("button", { name: /View details/ })[0]
    );

    await waitFor(() => {
      expect(
        screen.getByText(/“Certificate request test 1” details/)
      ).toBeInTheDocument();
    });
  });

  it("Should open import certificate dialog", async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstance as FortifyAPI
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Certificate test 1/)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: "New" }));

    expect(screen.getByRole("presentation")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("menuitem", {
        name: /Import certificate/,
      })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Import certificate/ })
      ).toBeInTheDocument();
    });
  });

  it("Should open create certificate (x509) dialog", async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstance as FortifyAPI
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Certificate test 1/)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: "New" }));

    expect(screen.getByRole("presentation")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("menuitem", {
        name: /Create self-signed certificate/,
      })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Create Self-signed certificate/ })
      ).toBeInTheDocument();
    });
  });

  it("Should open create certificate (CSR) dialog", async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstance as FortifyAPI
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Certificate test 1/)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: "New" }));

    expect(screen.getByRole("presentation")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("menuitem", {
        name: /Create certificate signing request \(CSR\)/,
      })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /Create Certificate Signing Request \(CSR\)/,
        })
      ).toBeInTheDocument();
    });
  });

  it("Should handle search & clear search", async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstance as FortifyAPI
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Certificate test 1/)).toBeInTheDocument();
    });

    userEvent.type(screen.getByPlaceholderText("Search"), "test 1");

    await waitFor(() => {
      expect(screen.getAllByText("test 1")).toHaveLength(1);
    });

    await userEvent.click(screen.getByTestId("clear-search-button"));

    await waitFor(() => {
      expect(screen.queryByText("test 1")).not.toBeInTheDocument();
    });
  });

  it("Should handle sorting", async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstance as FortifyAPI
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Certificate test 1/)).toBeInTheDocument();
    });

    let cells = screen.getAllByRole("cell");
    expect(cells[1]).toHaveTextContent(/Certificate test 2/);
    expect(cells[5]).toHaveTextContent(/Certificate test 1/);

    await userEvent.click(screen.getByText(/Name/));
    expect(global.location.search).toMatch(/sort=label&order=asc/);

    cells = screen.getAllByRole("cell");
    expect(cells[1]).toHaveTextContent(/Certificate test 1/);
    expect(cells[5]).toHaveTextContent(/Certificate test 2/);

    await userEvent.click(screen.getByText(/Name/));
    expect(global.location.search).toMatch(/sort=label&order=desc/);
  });
});
