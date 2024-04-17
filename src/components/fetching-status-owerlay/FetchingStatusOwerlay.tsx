import React, { useEffect, useState } from "react";
import { CertificatesFetchingType } from "../certificates/types";
import {
  CircularProgress,
  Dialog,
  DialogContent,
} from "@peculiar/react-components";
import { ApproveConnection } from "./ApproveConnection";
import { ErrorConnection } from "./ErrorConnection";

export interface FetchingStatusOwerlayProps {
  fetching: CertificatesFetchingType;
  challenge: string | null;
}
export const FetchingStatusOwerlay: React.FunctionComponent<
  FetchingStatusOwerlayProps
> = ({ fetching, challenge }) => {
  const [element, setElement] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (fetching.connectionClientUpdate === "rejected") {
      setElement(<ErrorConnection message={"Update client"} />);
      return;
    }

    if (fetching.connectionSupport === "rejected") {
      setElement(<ErrorConnection message={"Connection not supported"} />);
      return;
    }

    if (fetching.connectionDetect === "rejected") {
      setElement(
        <ErrorConnection
          message={"Launch your local Fortify application"}
          description={
            "It seems Fortify application is turned off on your desktop. Please launch it to continue."
          }
        />,
      );
      return;
    }

    if (fetching.connectionApprove === "rejected") {
      setElement(<ErrorConnection message={"Connection not approved"} />);
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

    setElement(<ErrorConnection message={"Unresolved status"} />);
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
