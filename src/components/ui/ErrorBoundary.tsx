import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="container">
            <div className="error-content">
              <h1>Oops! Something went wrong</h1>
              <p>The quiz encountered an unexpected error. Please try refreshing the page.</p>
              <button
                className="btn"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              <p className="error-details">
                If this problem persists, please try again later.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}