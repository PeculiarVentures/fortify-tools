import {
  Component,
  ComponentType,
  ErrorInfo,
  FunctionComponent,
  PropsWithChildren,
  ReactElement,
} from "react";

export type FallbackProps = {
  error: Error;
  resetErrorBoundary: (...args: unknown[]) => void;
};

type ErrorBoundarySharedProps = PropsWithChildren<{
  onError?: (error: Error, info: ErrorInfo) => void;
  onReset?: (
    details:
      | { reason: "imperative-api"; args: unknown[] }
      | {
          reason: "keys";
          prev: unknown[] | undefined;
          next: unknown[] | undefined;
        }
  ) => void;
  resetKeys?: unknown[];
}>;

export type ErrorBoundaryPropsWithComponent = ErrorBoundarySharedProps & {
  fallback?: never;
  fallbackComponent: ComponentType<FallbackProps>;
};

export type ErrorBoundaryPropsWithFallback = ErrorBoundarySharedProps & {
  fallback: ReactElement<
    unknown,
    string | FunctionComponent | typeof Component
  > | null;
  fallbackComponent?: never;
};

export type ErrorBoundaryProps =
  | ErrorBoundaryPropsWithFallback
  | ErrorBoundaryPropsWithComponent;
