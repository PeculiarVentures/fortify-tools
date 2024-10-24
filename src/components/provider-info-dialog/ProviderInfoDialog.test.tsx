import { ComponentProps } from "react";
import { render, userEvent, screen } from "@testing";
import type { IProviderInfo } from "@peculiar/fortify-client-core";
import { ProviderInfoDialog } from "./ProviderInfoDialog";

describe("<ProviderInfoDialog />", () => {
  const defaultProps: ComponentProps<typeof ProviderInfoDialog> = {
    data: {
      name: "name-text",
      isHardware: false,
      isRemovable: false,
      token: {
        label: "label-text",
        serialNumber: "1",
        freePrivateMemory: 18446,
        hardwareVersion: {
          major: 1,
          minor: 1,
          version: 0,
        },
        firmwareVersion: {
          major: 1,
          minor: 2,
          version: 0,
        },
        model: "model-text",
      },
      algorithms: ["SHA-1", "SHA-256"],
    } as IProviderInfo,
    onDialogClose: vi.fn(),
  };

  it("Should render and handle click close", async () => {
    render(<ProviderInfoDialog {...defaultProps} />);

    expect(
      screen.getByText(`${defaultProps.data.name} information`)
    ).toBeInTheDocument();

    expect(screen.getByText(/Token name/).nextElementSibling).toHaveTextContent(
      defaultProps.data.token!.label
    );

    expect(
      screen.getByText(/Token category/).nextElementSibling
    ).toHaveTextContent(/Software/);

    expect(
      screen.getByText(/Extractable/).nextElementSibling
    ).toHaveTextContent(/No/);

    expect(
      screen.getByText(/Serial number/).nextElementSibling
    ).toHaveTextContent(defaultProps.data.token!.serialNumber);

    expect(screen.getByText(/Free space/).nextElementSibling).toHaveTextContent(
      defaultProps.data.token!.freePrivateMemory.toString()
    );

    expect(
      screen.getByText(/Hardware version/).nextElementSibling
    ).toHaveTextContent("1.1");

    expect(
      screen.getByText(/Firmware version/).nextElementSibling
    ).toHaveTextContent("1.2");

    expect(screen.getByText(/Model/).nextElementSibling).toHaveTextContent(
      defaultProps.data.token!.model
    );

    expect(screen.getByText(/Algorithms/).nextElementSibling).toHaveTextContent(
      "SHA-1, SHA-256"
    );

    await userEvent.click(screen.getByRole("button", { name: /Cancel/ }));

    expect(defaultProps.onDialogClose).toBeCalledTimes(1);
  });

  it("Should render as hardware", () => {
    const props: ComponentProps<typeof ProviderInfoDialog> = {
      ...defaultProps,
      data: { ...defaultProps.data, isHardware: true } as IProviderInfo,
    };
    render(<ProviderInfoDialog {...props} />);

    expect(
      screen.getByText(/Token category/).nextElementSibling
    ).toHaveTextContent(/Hardware/);
  });

  it("Should render as extractable", () => {
    const props: ComponentProps<typeof ProviderInfoDialog> = {
      ...defaultProps,
      data: { ...defaultProps.data, isRemovable: true } as IProviderInfo,
    };
    render(<ProviderInfoDialog {...props} />);

    expect(
      screen.getByText(/Extractable/).nextElementSibling
    ).toHaveTextContent(/Yes/);
  });

  it("Should render as free space is unavailable", () => {
    const props: ComponentProps<typeof ProviderInfoDialog> = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        token: {
          ...defaultProps.data.token,
          freePrivateMemory: 18446744073709552000,
        },
      } as IProviderInfo,
    };
    render(<ProviderInfoDialog {...props} />);

    expect(screen.getByText(/Free space/).nextElementSibling).toHaveTextContent(
      /Information is unavailable/
    );
  });
});
