import { render } from "@testing";
import { ApproveConnection } from "./ApproveConnection";

describe("<ApproveConnection />", () => {
  it("Should render", async () => {
    const challenge = "12345";

    const { getByText, container } = render(
      <ApproveConnection challenge={challenge} />
    );

    expect(container.querySelector("svg")).toBeInTheDocument();

    expect(getByText(/Fortify authorization/)).toBeInTheDocument();

    const challengeEl = container.querySelector("[class*='challenge']");
    expect(challengeEl).toBeInTheDocument();
    expect(challengeEl?.children).toHaveLength(challenge.length);

    expect(
      getByText(
        /Compare this code to the one shown by your operating system for Fortify/
      )
    ).toBeInTheDocument();
  });
});
