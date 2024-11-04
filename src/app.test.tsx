import { render, screen, userEvent, waitFor } from "@testing";

import type { IProviderInfo } from "@peculiar/fortify-client-core";
import { FortifyAPI } from "@peculiar/fortify-client-core";
import { App } from "./app";

vi.mock("@peculiar/fortify-client-core");

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
  };

  it("Should render, show providers & certificates", async () => {
    vi.mocked(FortifyAPI).mockImplementation(
      () => mockFortifyAPIInstance as FortifyAPI
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Provider 1/)).toBeInTheDocument();
      expect(screen.getByText(/Provider 2/)).toBeInTheDocument();
      expect(screen.getByText(/Certificate test 1/)).toBeInTheDocument();
      expect(screen.getByText(/Certificate test 2/)).toBeInTheDocument();
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
});
