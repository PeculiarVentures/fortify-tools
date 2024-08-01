import { describe, it, render, vi, expect, userEvent } from "@testing";
import { CertificateCreateByCustom } from "./CertificateCreateByCustom";

describe("<CertificateCreateByCustom />", () => {
  it("Should render & submit", async () => {
    const handleCreate = vi.fn((data) => data);

    const { getByRole, getByText } = render(
      <CertificateCreateByCustom
        type="x509"
        onCreateButtonClick={handleCreate}
      />
    );

    // Subject section

    expect(getByText("Subject")).toBeInTheDocument();

    const button = getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    // Common name

    const cnFieldElement = getByRole("textbox", {
      name: "Common name",
    });
    expect(cnFieldElement).toBeInTheDocument();
    expect(cnFieldElement).toHaveAttribute("placeholder", "example.com");

    const cnFieldValue = "company.com";
    await userEvent.type(cnFieldElement, cnFieldValue);
    expect(cnFieldElement).toHaveValue(cnFieldValue);

    expect(button).toBeDisabled();

    // Email

    const emailFieldElement = getByRole("textbox", {
      name: "Email address",
    });
    expect(emailFieldElement).toBeInTheDocument();
    expect(emailFieldElement).toHaveAttribute(
      "placeholder",
      "company@example.com"
    );

    const emailFieldValue = "info@company.com";
    await userEvent.type(emailFieldElement, emailFieldValue);
    expect(emailFieldElement).toHaveValue(emailFieldValue);

    expect(button).toBeEnabled();

    // Organization

    const organizationFieldElement = getByRole("textbox", {
      name: "Organization",
    });
    expect(organizationFieldElement).toBeInTheDocument();
    expect(organizationFieldElement).toHaveAttribute(
      "placeholder",
      "Company name"
    );

    const organizationFieldValue = "Company";
    await userEvent.type(organizationFieldElement, organizationFieldValue);
    expect(organizationFieldElement).toHaveValue(organizationFieldValue);

    // Organization unit

    const organizationUnitFieldElement = getByRole("textbox", {
      name: "Organization unit",
    });
    expect(organizationUnitFieldElement).toBeInTheDocument();
    expect(organizationUnitFieldElement).not.toHaveAttribute("placeholder");

    const organizationUnitFieldValue = "Company unit";
    await userEvent.type(
      organizationUnitFieldElement,
      organizationUnitFieldValue
    );
    expect(organizationUnitFieldElement).toHaveValue(
      organizationUnitFieldValue
    );

    // Country

    const countryFieldElement = getByRole("combobox", {
      name: "Country",
    });
    expect(countryFieldElement).toBeInTheDocument();
    expect(countryFieldElement).toHaveTextContent("Select country");

    await userEvent.click(countryFieldElement);

    const countryFieldPopup = getByRole("presentation");
    expect(countryFieldPopup).toBeInTheDocument();

    const countryFieldOptionLabel = "United States";
    const countryFieldOptionValue = "US";
    const countryFieldOption = getByText(countryFieldOptionLabel);
    expect(countryFieldOption).toBeInTheDocument();

    await userEvent.click(countryFieldOption);

    expect(countryFieldPopup).not.toBeInTheDocument();

    // Locality

    const localityFieldElement = getByRole("textbox", {
      name: "Locality",
    });
    expect(localityFieldElement).toBeInTheDocument();
    expect(localityFieldElement).toHaveAttribute(
      "placeholder",
      "Town, city, village, etc."
    );

    const localityFieldValue = "New York";
    await userEvent.type(localityFieldElement, localityFieldValue);
    expect(localityFieldElement).toHaveValue(localityFieldValue);

    // State

    const stateFieldElement = getByRole("textbox", {
      name: "State",
    });
    expect(stateFieldElement).toBeInTheDocument();
    expect(stateFieldElement).toHaveAttribute(
      "placeholder",
      "Province, region, county or state"
    );

    const stateFieldValue = "Albany County";
    await userEvent.type(stateFieldElement, stateFieldValue);
    expect(stateFieldElement).toHaveValue(stateFieldValue);

    // Extended key usages section

    expect(getByText("Extended key usages")).toBeInTheDocument();

    const codeSigningElement = getByText("Code signing");
    const codeSigningValue = "1.3.6.1.5.5.7.3.3";
    expect(codeSigningElement).toBeInTheDocument();

    await userEvent.click(codeSigningElement);

    // Key properties

    expect(getByText("Key properties")).toBeInTheDocument();

    // Signature Algorithm

    const sAlgorithmFieldElement = getByRole("combobox", {
      name: "Signature Algorithm",
    });
    expect(sAlgorithmFieldElement).toBeInTheDocument();
    expect(sAlgorithmFieldElement).toHaveTextContent("RSA-2048");

    await userEvent.click(sAlgorithmFieldElement);

    const sAlgorithmFieldPopup = getByRole("presentation");
    expect(sAlgorithmFieldPopup).toBeInTheDocument();

    const sAlgorithmFieldOptionValue = "EC-P521";
    const sAlgorithmFieldOption = getByText(sAlgorithmFieldOptionValue);
    expect(sAlgorithmFieldOption).toBeInTheDocument();

    await userEvent.click(sAlgorithmFieldOption);

    expect(sAlgorithmFieldPopup).not.toBeInTheDocument();

    // Hash Algorithm

    const hAlgorithmFieldElement = getByRole("combobox", {
      name: "Hash Algorithm",
    });
    expect(hAlgorithmFieldElement).toBeInTheDocument();
    expect(hAlgorithmFieldElement).toHaveTextContent("SHA-256");

    await userEvent.click(hAlgorithmFieldElement);

    const hAlgorithmFieldPopup = getByRole("presentation");
    expect(hAlgorithmFieldPopup).toBeInTheDocument();

    const hAlgorithmFieldOptionValue = "SHA-512";
    const hAlgorithmFieldOption = getByText(hAlgorithmFieldOptionValue);
    expect(hAlgorithmFieldOption).toBeInTheDocument();

    await userEvent.click(hAlgorithmFieldOption);

    expect(hAlgorithmFieldPopup).not.toBeInTheDocument();

    await userEvent.click(button);

    expect(handleCreate).toBeCalledTimes(1);
    expect(handleCreate).toHaveReturnedWith({
      subject: {
        CN: cnFieldValue,
        E: emailFieldValue,
        O: organizationFieldValue,
        OU: organizationUnitFieldValue,
        L: localityFieldValue,
        ST: stateFieldValue,
        C: countryFieldOptionValue,
      },
      extendedKeyUsages: [codeSigningValue],
      algorithm: {
        hash: hAlgorithmFieldOptionValue,
        signature: sAlgorithmFieldOptionValue,
      },
      type: "x509",
    });
  });
});
