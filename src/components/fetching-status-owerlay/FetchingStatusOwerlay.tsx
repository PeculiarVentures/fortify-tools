import React from "react";
import { Dialog, DialogContent } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import { AppFetchingType } from "../../hooks/app";
import { ApproveConnection } from "../approve-connection";
import { ErrorConnection } from "../error-connection";

export interface FetchingStatusOwerlayProps {
  fetching: AppFetchingType;
  challenge: string | null;
}
export const FetchingStatusOwerlay: React.FunctionComponent<
  FetchingStatusOwerlayProps
> = (props) => {
  const { fetching, challenge } = props;
  const { t } = useTranslation();

  function dialogAttrs() {
    if (fetching.connectionClientUpdate === "rejected") {
      return {
        isShow: true,
        element: (
          <ErrorConnection
            message={t("connection.error.update-client.message")}
          />
        ),
      };
    }

    if (fetching.connectionSupport === "rejected") {
      return {
        isShow: true,
        element: (
          <ErrorConnection
            message={t("connection.error.connection-not-supported.message")}
          />
        ),
      };
    }

    if (fetching.connectionDetect === "rejected") {
      return {
        isShow: true,
        element: (
          <ErrorConnection
            message={t("connection.error.connection-not-detect.message")}
            description={t(
              "connection.error.connection-not-detect.description"
            )}
          />
        ),
      };
    }

    if (fetching.connectionApprove === "rejected") {
      return {
        isShow: true,
        element: (
          <ErrorConnection
            message={t("connection.error.connection-not-approved.message")}
          />
        ),
      };
    }

    if (fetching.connectionApprove === "pending" && !!challenge) {
      return {
        isShow: true,
        element: <ApproveConnection challenge={challenge} />,
      };
    }

    if (fetching.certificates) {
      return {
        isShow: false,
        element: null,
      };
    }

    if (
      fetching.connectionDetect === "pending" ||
      fetching.connectionSupport === "pending" ||
      fetching.connectionApprove === "pending" ||
      fetching.providers === "pending"
    ) {
      return {
        isShow: false,
        element: null,
      };
    }

    return {
      isShow: true,
      element: (
        <ErrorConnection
          message={t("connection.error.unresolved-status.message")}
        />
      ),
    };
  }

  const { isShow, element } = dialogAttrs();

  return (
    <Dialog
      open={isShow}
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
    >
      <DialogContent>{element}</DialogContent>
    </Dialog>
  );
};
