import React from "react";
import { useTranslation } from "react-i18next";
import {
  FortifyAPI,
  IProviderInfo,
  ICertificate,
} from "@peculiar/fortify-client-core";

import { useToast } from "@peculiar/react-components";

import { AppFetchingStatus, AppFetchingType } from "./types";

export function useApp() {
  /**
   * State.
   */
  const fortifyClient = React.useRef<FortifyAPI | null>(null);

  const [providers, setProviders] = React.useState<IProviderInfo[]>([]);
  const [currentProviderId, setCurrentProviderId] = React.useState<
    string | undefined
  >(undefined);
  const [certificates, setCertificates] = React.useState<ICertificate[]>([]);
  const [challenge, setChallenge] = React.useState<string | null>(null);
  const [fetching, setFetching] = React.useState<AppFetchingType>({
    connectionDetect: "pending",
  });

  const [currentCertificatDelete, setCurrentCetificateDelete] = React.useState<
    undefined | { id: string; name: string; loading?: boolean }
  >();
  const [isCertificatImporting, setIsCetificateImporting] =
    React.useState(false);

  const [currentCertificateViewerValue, setCurrentCertificateViewerValue] =
    React.useState<ICertificate | undefined>(undefined);

  const [isCertificateImportDialogShow, SetIsCertificateImportDialogShow] =
    React.useState(false);

  /**
   *
   */

  const { addToast } = useToast();
  const { t } = useTranslation();

  const setFetchingValue = (
    name: keyof AppFetchingType,
    value: AppFetchingStatus
  ) => {
    setFetching((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setProviders([]);
    setCertificates([]);
    setFetchingValue("connectionDetect", "rejected");
  };

  const tryLogin = async () => {
    if (!fortifyClient.current) {
      return undefined;
    }

    setFetchingValue("connectionApprove", "pending");
    setChallenge(null);

    try {
      const challengeLocal = await fortifyClient.current.challenge();

      if (challengeLocal) {
        setChallenge(challengeLocal);

        await fortifyClient.current.login();
      }

      setFetchingValue("connectionApprove", "resolved");
    } catch (error) {
      setFetchingValue("connectionApprove", "rejected");

      return undefined;
    }

    return true;
  };

  const tryGetData = async () => {
    if (!fortifyClient.current) {
      return;
    }

    let providersLocal: IProviderInfo[] = [];

    setFetchingValue("providers", "pending");
    setProviders([]);
    setCertificates([]);

    try {
      providersLocal = await fortifyClient.current.getProviders();

      setProviders(providersLocal);
      setFetchingValue("providers", "resolved");
    } catch (error) {
      setFetchingValue("providers", "rejected");

      return;
    }

    setFetchingValue("certificates", "pending");

    try {
      setCertificates(
        await fortifyClient.current.getCertificatesByProviderId(
          providersLocal[0].id
        )
      );
      setCurrentProviderId(providersLocal[0].id);
      setFetchingValue("certificates", "resolved");
    } catch (error) {
      setFetchingValue("certificates", "rejected");
    }
  };

  const start = async () => {
    if (!fortifyClient.current) {
      return;
    }

    setFetchingValue("connectionDetect", "pending");

    if (!fortifyClient.current.isConnectionSupported()) {
      setFetchingValue("connectionSupport", "rejected");

      return;
    }

    if (!(await fortifyClient.current.isConnectionDetected())) {
      setFetchingValue("connectionDetect", "rejected");
    }

    await fortifyClient.current.isConnectionDetectedAuto();

    setFetchingValue("connectionDetect", "pending");

    try {
      await fortifyClient.current.connect();
    } catch (error) {
      // console.error(error);

      if (error && error instanceof Error) {
        if (
          error.message.indexOf("update your client to the latest version") !==
          -1
        ) {
          setFetchingValue("connectionClientUpdate", "rejected");
        }
      }

      return;
    }

    const login = await tryLogin();

    if (!login) {
      return;
    }

    await tryGetData();
  };

  const handleProviderChange = async (id: string) => {
    if (currentProviderId === id || fetching.certificates === "pending") {
      return;
    }

    setFetchingValue("certificates", "pending");

    try {
      setCertificates(
        await fortifyClient.current!.getCertificatesByProviderId(id)
      );
      setCurrentProviderId(id);
      setFetchingValue("certificates", "resolved");
    } catch (error) {
      setFetchingValue("certificates", "rejected");
    }
  };

  React.useEffect(() => {
    fortifyClient.current = new FortifyAPI({
      onDebug: () => {},
      onClose: handleClose,
      onProvidersAdded: tryGetData,
      onProvidersRemoved: tryGetData,
      // filters: {
      //   onlyWithPrivateKey: true,
      // },
    });

    start();
  }, []);

  const handleCertificatesSearch = (value: string) => {
    // TODO: add logic
    console.log(value);
  };

  const handleCertificateImport = (certificate: string) => {
    // TODO: add logic
    console.log("Import", certificate);
    // temporary behaviour
    setIsCetificateImporting(true);
    setTimeout(function () {
      setIsCetificateImporting(false);
      addToast({
        message: t("certificates.dialog.import.failure-message"),
        variant: "wrong",
        disableIcon: true,
        isClosable: true,
      });
    }, 1000);
  };

  const handleCertificateCreate = () => {
    // TODO: add logic
    console.log("Create");
  };

  const handleCertificateDeleteDialogOpen = (id: string, name: string) => {
    setCurrentCetificateDelete({
      id,
      name,
    });
  };

  const handleCertificateDeleteDialogClose = () => {
    setCurrentCetificateDelete(undefined);
  };

  const handleCertificateDelete = (id: string) => {
    // TODO: add logic
    // temporary behaviour
    setCurrentCetificateDelete((prevState) =>
      prevState?.id === id ? { ...prevState, loading: true } : undefined
    );
    setTimeout(function () {
      setCurrentCetificateDelete(undefined);
      addToast({
        message: t("certificates.dialog.delete.failure-message"),
        variant: "wrong",
        disableIcon: true,
        isClosable: true,
      });
    }, 1000);
  };

  const handleCertificateViewerOpen = (certificate: ICertificate) => {
    setCurrentCertificateViewerValue(certificate);
  };

  const handleCertificateViewerClose = () => {
    setCurrentCertificateViewerValue(undefined);
  };

  const handleCertificateImportDialogOpen = () => {
    SetIsCertificateImportDialogShow(true);
  };

  const handleCertificateImportDialogClose = () => {
    SetIsCertificateImportDialogShow(false);
  };

  return {
    fetching,
    challenge,
    providers,
    currentProviderId,
    certificates,
    currentCertificatDelete,
    currentCertificateViewerValue,
    isCertificateImportDialogShow,
    isCertificatImporting,
    handleProviderChange,
    handleCertificatesSearch,
    handleCertificateImport,
    handleCertificateCreate,
    handleCertificateDeleteDialogOpen,
    handleCertificateDeleteDialogClose,
    handleCertificateDelete,
    handleCertificateViewerOpen,
    handleCertificateViewerClose,
    handleCertificateImportDialogOpen,
    handleCertificateImportDialogClose,
  };
}
