import { Component } from "react";

// Last line of defence: a render error in any page shows a recoverable
// screen instead of blanking the whole app.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info?.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="grid min-h-screen px-4 place-items-center bg-slate-900 text-slate-200 font-inter">
        <div className="max-w-md text-center">
          <h1 className="mb-3 text-2xl font-semibold text-teal-400">
            Something went wrong
          </h1>
          <p className="mb-6 text-slate-400">
            An unexpected error occurred while loading this page. Please try
            again.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 font-semibold rounded-md bg-teal-500 text-slate-900 hover:bg-cyan-500"
            >
              Reload
            </button>
            <a
              href="/"
              className="px-4 py-2 font-semibold rounded-md bg-slate-700 hover:bg-slate-600"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
