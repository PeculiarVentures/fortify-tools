import React, { useEffect, useState } from "react";
import { CertificatesFetchingType } from "../certificates/types";
import {
  CircularProgress,
  Dialog,
  DialogContent,
} from "@peculiar/react-components";
import { ApproveConnection } from "../approve-connection";
import { ErrorConnection } from "../error-connection";
import { useTranslation } from "react-i18next";

export interface FetchingStatusOwerlayProps {
  fetching: CertificatesFetchingType;
  challenge: string | null;
}
export const FetchingStatusOwerlay: React.FunctionComponent<
  FetchingStatusOwerlayProps
> = ({ fetching, challenge }) => {
  const { t } = useTranslation();
  const [element, setElement] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (fetching.connectionClientUpdate === "rejected") {
      setElement(
        <ErrorConnection
          message={t("connection.error.update-client.message")}
        />,
      );
      return;
    }

    if (fetching.connectionSupport === "rejected") {
      setElement(
        <ErrorConnection
          message={t("connection.error.connection-not-supported.message")}
        />,
      );
      return;
    }

    if (fetching.connectionDetect === "rejected") {
      setElement(
        <ErrorConnection
          message={t("connection.error.connection-not-detect.message")}
          description={t("connection.error.connection-not-detect.description")}
        />,
      );
      return;
    }

    if (fetching.connectionApprove === "rejected") {
      setElement(
        <ErrorConnection
          message={t("connection.error.connection-not-approved.message")}
        />,
      );
      return;
    }

    if (fetching.connectionApprove === "pending" && !!challenge) {
      setElement(<ApproveConnection challenge={challenge} />);
      return;
    }

    if (fetching.certificates) {
      setElement(null);
      return;
    }

    if (
      fetching.connectionDetect === "pending" ||
      fetching.connectionSupport === "pending" ||
      fetching.connectionApprove === "pending" ||
      fetching.providers === "pending"
    ) {
      setElement(<CircularProgress />);
      return;
    }

    setElement(
      <ErrorConnection
        message={t("connection.error.unresolved-status.message")}
      />,
    );
  }, [
    fetching.connectionDetect,
    fetching.connectionSupport,
    fetching.connectionApprove,
    fetching.connectionClientUpdate,
    fetching.providers,
    fetching.certificates,
    challenge,
  ]);

  return (
    <Dialog
      open={!!element}
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
    >
      <DialogContent>{element}</DialogContent>
    </Dialog>
  );
};
