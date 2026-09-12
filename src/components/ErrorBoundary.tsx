import { Component, type ErrorInfo, type ReactNode } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import Button from "@/components/generic/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught error in app:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F6F6F6] dark:bg-gray-950 px-4">
          <div className="flex flex-col items-center text-center gap-4 max-w-md">
            <span className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center text-red-500 dark:text-red-400">
              <FiAlertTriangle className="w-6 h-6" />
            </span>
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-brand-gray-dark dark:text-gray-100">
                Something went wrong
              </h1>
              <p className="text-sm text-brand-gray-light">
                An unexpected error occurred. You can try again or head back
                to the dashboard.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={this.handleReset}>Try again</Button>
              <Button
                bgColor="bg-brand-blue"
                textColor="text-white"
                borderColor="border-brand-blue"
                onClick={() => {
                  this.handleReset();
                  window.location.href = "/dashboard";
                }}
              >
                Go to dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
