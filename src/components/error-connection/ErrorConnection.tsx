import React from "react";

interface ErrorConnectionProps {
  message: string;
  description?: string;
}
export const ErrorConnection: React.FunctionComponent<ErrorConnectionProps> = (
  props
) => {
  const { message, description } = props;

  return (
    <>
      <h1>{message}</h1>
      {description ? <p>{description}</p> : null}
    </>
  );
};
