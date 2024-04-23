import React from "react";
import { useTranslation } from "react-i18next";

interface ApproveConnectionProps {
  challenge: string | null;
}
export const ApproveConnection: React.FunctionComponent<
  ApproveConnectionProps
> = (props) => {
  const { challenge } = props;
  const { t } = useTranslation();

  return (
    <h1>
      {t("connection.approve.title")}:{challenge}
    </h1>
  );
};
