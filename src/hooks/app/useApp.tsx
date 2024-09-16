import React from "react";
import {
  FortifyAPI,
  IProviderInfo,
  ICertificate,
} from "@peculiar/fortify-client-core";

import { AppFetchingStatus, AppFetchingType } from "./types";

export function useApp() {
  /**
   * State.
   */
  const fortifyClient = React.useRef<FortifyAPI | null>(null);

  const [providers, setProviders] = React.useState<IProviderInfo[]>([]);
  const [currentProvider, setCurrentProvider] = React.useState<
    IProviderInfo | undefined
  >(undefined);
  const [isCurrentProviderLogedin, setIsCurrentProviderLogedin] =
    React.useState(false);
  const [certificates, setCertificates] = React.useState<ICertificate[]>([]);
  const [challenge, setChallenge] = React.useState<string | null>(null);
  const [fetching, setFetching] = React.useState<AppFetchingType>({
    connectionDetect: "pending",
  });

  /**
   *
   */

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

    const curProvider = providersLocal.find(
      ({ id }) => currentProvider?.id === id
    );
    const curProviderId = curProvider?.id || providersLocal[0].id;

    try {
      const localProvider =
        await fortifyClient.current.getProviderById(curProviderId);
      const isLoggedIn = await localProvider.isLoggedIn();
      setIsCurrentProviderLogedin(isLoggedIn);
    } catch (error) {
      setIsCurrentProviderLogedin(false);
    }

    try {
      setCertificates(
        await fortifyClient.current.getCertificatesByProviderId(curProviderId)
      );
      setCurrentProvider(curProvider || providersLocal[0]);
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
    if (!fortifyClient.current) {
      return;
    }
    if (currentProvider?.id === id || fetching.certificates === "pending") {
      return;
    }

    setFetchingValue("certificates", "pending");

    try {
      const localProvider = await fortifyClient.current.getProviderById(id);
      const isLoggedIn = await localProvider.isLoggedIn();
      setIsCurrentProviderLogedin(isLoggedIn);
    } catch (error) {
      setIsCurrentProviderLogedin(false);
    }

    try {
      setCertificates(
        await fortifyClient.current!.getCertificatesByProviderId(id)
      );
      setCurrentProvider(providers.find((provider) => provider.id === id));
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

  const handleCertificatesDataReload = async (providerId: string) => {
    if (!fortifyClient.current) {
      return;
    }

    setFetchingValue("certificates", "pending");

    try {
      setCertificates(
        await fortifyClient.current.getCertificatesByProviderId(providerId)
      );
      setCurrentProvider(
        providers.find((provider) => provider.id === providerId)
      );
      setFetchingValue("certificates", "resolved");
    } catch (error) {
      setFetchingValue("certificates", "rejected");
    }
  };

  const handleRetryConection = () => {
    window.location.reload();
  };

  const handleProviderLoginLogout = async (isLogedin: boolean) => {
    if (!fortifyClient.current || !currentProvider) {
      return;
    }

    try {
      const localProvider = await fortifyClient.current.getProviderById(
        currentProvider.id
      );
      if (isLogedin) {
        await localProvider.logout();
        const isLoggedIn = await localProvider.isLoggedIn();
        if (!isLoggedIn) {
          setIsCurrentProviderLogedin(false);
          handleCertificatesDataReload(currentProvider.id);
        }
      } else {
        await localProvider.login();
        const isLoggedIn = await localProvider.isLoggedIn();
        if (isLoggedIn) {
          setIsCurrentProviderLogedin(true);
          handleCertificatesDataReload(currentProvider.id);
        }
      }
    } catch (error) {
      setIsCurrentProviderLogedin(false);
    }
  };

  return {
    fortifyClient: fortifyClient.current,
    fetching,
    challenge,
    providers,
    currentProvider,
    certificates,
    isCurrentProviderLogedin,
    handleCertificatesDataReload,
    handleProviderChange,
    handleRetryConection,
    handleProviderLoginLogout,
  };
}
