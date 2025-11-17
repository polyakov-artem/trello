import type { PropsWithChildren, ReactNode } from 'react';
import { Component, type ErrorInfo } from 'react';
import { errors } from '@/shared/constants/errorMsgs';
import { ErrorWithReloadBtn } from '../ErrorWithReload/ErrorWithReloadBtn';

export type ErrorBoundaryProps = PropsWithChildren & {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
};

export type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | undefined;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <main className="flex flex-col min-h-dvh">
          <ErrorWithReloadBtn title={this.state.error?.message || errors.unexpected} />
        </main>
      );
    }

    return this.props.children;
  }
}
