import React from "react";

interface ApproveConnectionProps {
  challenge: string | null;
}
export const ApproveConnection: React.FunctionComponent<
  ApproveConnectionProps
> = ({ challenge }) => {
  return (
    <h1>
      Approve connection:
      {challenge}
    </h1>
  );
};
