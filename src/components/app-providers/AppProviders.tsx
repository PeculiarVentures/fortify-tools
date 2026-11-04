import React from 'react';
import { ThemeProvider, ToastProvider } from '@peculiar/react-components';
import { ErrorBoundary } from 'react-error-boundary';
import { theme } from '../../config/theme';
import { AppFallback } from '../app-fallback';

export const AppProviders: React.FunctionComponent<{
  children: React.ReactNode;
}> = (props) => {
  const { children } = props;

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary FallbackComponent={AppFallback}>
        <ToastProvider maxToasts={4}>{children}</ToastProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};
