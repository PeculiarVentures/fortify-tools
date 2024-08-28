import React from "react";
import { Dialog, DialogContent } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import { AppFetchingType } from "../../hooks/app";
import { ApproveConnection } from "../approve-connection";
import { ErrorConnection } from "../error-connection";
import { UpdateClient } from "../update-client";
import { ConnectionNotDetected } from "../connection-not-detected";
import { ConnectionNotApproved } from "../connection-not-approved";

import styles from "./styles/index.module.scss";

export interface FetchingStatusOwerlayProps {
  fetching: AppFetchingType;
  challenge: string | null;
  onReload: () => void;
}
export const FetchingStatusOwerlay: React.FunctionComponent<
  FetchingStatusOwerlayProps
> = (props) => {
  const { fetching, challenge, onReload } = props;

  const { t } = useTranslation();

  function dialogAttrs() {
    if (fetching.connectionClientUpdate === "rejected") {
      return {
        isShow: true,
        element: <UpdateClient />,
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
        element: <ConnectionNotDetected onReload={onReload} />,
      };
    }

    if (fetching.connectionApprove === "rejected") {
      return {
        isShow: true,
        element: <ConnectionNotApproved />,
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
          description={t("connection.error.unresolved-status.description")}
        />
      ),
    };
  }

  const { isShow, element } = dialogAttrs();

  return (
    <Dialog
      className={styles.dialog}
      open={isShow}
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
    >
      <DialogContent className={styles.dialog_content}>{element}</DialogContent>
    </Dialog>
  );
};
