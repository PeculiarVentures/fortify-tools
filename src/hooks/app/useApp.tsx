import React from "react";
import {
  FortifyAPI,
  IProviderInfo,
  ICertificate,
  ICertificateRequest,
} from "@peculiar/fortify-client-core";
import { useTranslation } from "react-i18next";
import { useToast } from "@peculiar/react-components";

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
  const [certificates, setCertificates] = React.useState<
    (ICertificate | ICertificateRequest)[]
  >([]);
  const [challenge, setChallenge] = React.useState<string | null>(null);
  const [fetching, setFetching] = React.useState<AppFetchingType>({
    connectionDetect: "pending",
  });

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

    setFetchingValue("providers", "pending");

    try {
      const providersLocal = await fortifyClient.current.getProviders();
      setProviders(providersLocal);
      setFetchingValue("providers", "resolved");

      if (!providersLocal.length) {
        setCurrentProvider(undefined);
        setIsCurrentProviderLogedin(false);
        setCertificates([]);
        return;
      }

      const defaultProvider = providersLocal[0];

      if (!currentProvider) {
        setCurrentProvider(defaultProvider);
        handleProviderChange(defaultProvider.id);
        return;
      }
      const curProvider = providersLocal.find(
        ({ id }) => currentProvider.id === id
      );
      if (!curProvider) {
        setCurrentProvider(defaultProvider);
        handleProviderChange(defaultProvider.id);
      }
    } catch (error) {
      setProviders([]);
      setFetchingValue("providers", "rejected");

      setCurrentProvider(undefined);
      setIsCurrentProviderLogedin(false);
      setCertificates([]);
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
      const requests =
        await fortifyClient.current.getCertificateRequestsByProviderId(id);
      const certificates =
        await fortifyClient.current.getCertificatesByProviderId(id);
      setCertificates([...certificates, ...requests]);
      if (providers?.length) {
        setCurrentProvider(providers.find((provider) => provider.id === id));
      }
      setFetchingValue("certificates", "resolved");
    } catch (error) {
      setFetchingValue("certificates", "rejected");
      setCertificates([]);
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
      const requests =
        await fortifyClient.current.getCertificateRequestsByProviderId(
          providerId
        );
      const certificates =
        await fortifyClient.current.getCertificatesByProviderId(providerId);
      setCertificates([...certificates, ...requests]);
      setFetchingValue("certificates", "resolved");
    } catch (error) {
      setFetchingValue("certificates", "rejected");
      setCertificates([]);
    }
  };

  const handleRetryConection = () => {
    window.location.reload();
  };

  const handleProviderResetAndRefreshList = async () => {
    if (!fortifyClient.current || !currentProvider) {
      return;
    }

    try {
      const localProvider = await fortifyClient.current.getProviderById(
        currentProvider.id
      );
      await localProvider.reset();
    } catch (error) {
      //
    }
    handleCertificatesDataReload(currentProvider.id);
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
        } else {
          addToast({
            message: t("topbar.provider-doesnt-support-signing-in"),
            variant: "attention",
            disableIcon: true,
            isClosable: true,
            id: "provider-doesnt-support-signing-in",
          });
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
    handleProviderResetAndRefreshList,
  };
}
