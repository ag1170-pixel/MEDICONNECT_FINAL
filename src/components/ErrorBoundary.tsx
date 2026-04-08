import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  error: Error | null;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("React render error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-background text-foreground p-6">
          <div className="max-w-3xl mx-auto rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
            <h2 className="text-lg font-semibold text-red-400">Something crashed</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Error: <span className="text-red-300 break-all">{this.state.error.message}</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check the browser console for the full stack trace.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

