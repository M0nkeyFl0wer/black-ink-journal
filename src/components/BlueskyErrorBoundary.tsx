
import React from 'react';

interface BlueskyErrorBoundaryProps {
  children: React.ReactNode;
}

interface BlueskyErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class BlueskyErrorBoundary extends React.Component<BlueskyErrorBoundaryProps, BlueskyErrorBoundaryState> {
  constructor(props: BlueskyErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): BlueskyErrorBoundaryState {
    console.error('Bluesky component error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Bluesky Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-800 rounded-lg">
          <p className="text-red-400 text-sm mb-2">Error loading Bluesky feed</p>
          <p className="text-red-300 text-xs">
            {this.state.error?.message || 'Unknown error occurred'}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
