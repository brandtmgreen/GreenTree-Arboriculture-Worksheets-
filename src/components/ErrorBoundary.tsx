import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'Something went wrong.';
      let detailedMessage = '';

      try {
        // Try to parse if it's a FirestoreErrorInfo JSON string
        const parsed = JSON.parse(this.state.error?.message || '');
        if (parsed.error) {
          errorMessage = 'Database permission error.';
          detailedMessage = parsed.error;
        }
      } catch (e) {
        errorMessage = this.state.error?.message || 'Something went wrong.';
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
            <p className="text-gray-700 mb-4">{errorMessage}</p>
            {detailedMessage && (
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40 mb-4">
                {detailedMessage}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
