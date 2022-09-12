import React from 'react';
import {
  FortifyAPI,
  IProviderInfo,
  ICertificate,
} from '@peculiar/fortify-client-core';
import {
  Select,
  CircularProgress,
} from '@peculiar/react-components';
import { PeculiarCertificatesViewer } from '@peculiar/certificates-viewer-react';
import { Convert } from 'pvtsutils';
import '@peculiar/certificates-viewer/dist/peculiar/peculiar.css';

type FetchingStatus = 'pending' | 'resolved' | 'rejected';

interface FetchingType {
  connectionClientUpdate?: FetchingStatus;
  connectionDetect?: FetchingStatus;
  connectionSupport?: FetchingStatus;
  connectionApprove?: FetchingStatus;
  providers?: FetchingStatus;
  certificates?: FetchingStatus;
}

export function App() {
  /**
   * State.
   */
  const fortifyClient = React.useRef<FortifyAPI | null>(null);

  const [providers, setProviders] = React.useState<IProviderInfo[]>([]);
  const [certificates, setCertificates] = React.useState<ICertificate[]>([]);
  const [challenge, setChallenge] = React.useState<string | null>(null);
  const [fetching, setFetching] = React.useState<FetchingType>({
    connectionDetect: 'pending',
  });
  /**
   *
   */

  const setFetchingValue = (name: keyof FetchingType, value: FetchingStatus) => {
    setFetching((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setProviders([]);
    setCertificates([]);
    setFetchingValue('connectionDetect', 'rejected');
  };

  const tryLogin = async () => {
    if (!fortifyClient.current) {
      return undefined;
    }

    setFetchingValue('connectionApprove', 'pending');
    setChallenge(null);

    try {
      const challengeLocal = await fortifyClient.current.challenge();

      if (challengeLocal) {
        setChallenge(challengeLocal);

        await fortifyClient.current.login();
      }

      setFetchingValue('connectionApprove', 'resolved');
    } catch (error) {
      setFetchingValue('connectionApprove', 'rejected');

      return undefined;
    }

    return true;
  };

  const tryGetData = async () => {
    if (!fortifyClient.current) {
      return;
    }

    let providersLocal: IProviderInfo[] = [];

    setFetchingValue('providers', 'pending');
    setProviders([]);
    setCertificates([]);

    try {
      providersLocal = await fortifyClient.current.getProviders();

      setProviders(providersLocal);
      setFetchingValue('providers', 'resolved');
    } catch (error) {
      setFetchingValue('providers', 'rejected');

      return;
    }

    setFetchingValue('certificates', 'pending');

    try {
      setCertificates(
        await fortifyClient.current.getCertificatesByProviderId(providersLocal[0].id),
      );
      setFetchingValue('certificates', 'resolved');
    } catch (error) {
      setFetchingValue('certificates', 'rejected');
    }
  };

  const start = async () => {
    if (!fortifyClient.current) {
      return;
    }

    setFetchingValue('connectionDetect', 'pending');

    if (!fortifyClient.current.isConnectionSupported()) {
      setFetchingValue('connectionSupport', 'rejected');

      return;
    }

    if (!await fortifyClient.current.isConnectionDetected()) {
      setFetchingValue('connectionDetect', 'rejected');
    }

    await fortifyClient.current.isConnectionDetectedAuto();

    setFetchingValue('connectionDetect', 'pending');

    try {
      await fortifyClient.current.connect();
    } catch (error) {
      // console.error(error);

      if (error && error instanceof Error) {
        if (error.message.indexOf('update your client to the latest version') !== -1) {
          setFetchingValue('connectionClientUpdate', 'rejected');
        }
      }

      return;
    }

    const login = tryLogin();

    if (!login) {
      return;
    }

    await tryGetData();
  };

  React.useEffect(() => {
    fortifyClient.current = new FortifyAPI({
      onDebug: () => {},
      onClose: handleClose,
      onProvidersAdded: tryGetData,
      onProvidersRemoved: tryGetData,
      filters: {
        onlyWithPrivateKey: true,
      },
    });

    start();
  }, []);

  if (fetching.connectionClientUpdate === 'rejected') {
    return (
      <h1>
        Update client
      </h1>
    );
  }

  if (fetching.connectionSupport === 'rejected') {
    return (
      <h1>
        Connection not supported
      </h1>
    );
  }

  if (fetching.connectionDetect === 'rejected') {
    return (
      <h1>
        Connection not detected
      </h1>
    );
  }

  if (fetching.connectionApprove === 'rejected') {
    return (
      <h1>
        Connection not approved
      </h1>
    );
  }

  if (fetching.connectionApprove === 'pending' && !!challenge) {
    return (
      <h1>
        Approve connection:
        {challenge}
      </h1>
    );
  }

  if (fetching.providers === 'resolved' && !providers.length) {
    return (
      <h1>
        Empty providers list
      </h1>
    );
  }

  if (fetching.providers === 'pending' && !!providers.length) {
    return (
      <div>
        <Select
          options={providers.map((provider) => ({
            label: provider.name,
            value: provider.id,
          }))}
        />
        <CircularProgress />
      </div>
    );
  }

  if (fetching.certificates) {
    return (
      <div>
        <Select
          options={providers.map((provider) => ({
            label: provider.name,
            value: provider.id,
          }))}
          onChange={async (event) => {
            setFetchingValue('certificates', 'pending');

            try {
              setCertificates(
                await fortifyClient.current!.getCertificatesByProviderId(event.target.value),
              );
              setFetchingValue('certificates', 'resolved');
            } catch (error) {
              setFetchingValue('certificates', 'rejected');
            }
          }}
        />
        <PeculiarCertificatesViewer
          certificates={certificates.map((certificate) => ({
            value: Convert.ToBase64(certificate.raw),
          }))}
        />
      </div>
    );
  }

  if (fetching.connectionDetect === 'pending'
  || fetching.connectionSupport === 'pending'
  || fetching.connectionApprove === 'pending'
  || fetching.providers === 'pending'
  ) {
    return (
      <CircularProgress />
    );
  }

  return (
    <h1>
      Unresolved status
    </h1>
  );
}
