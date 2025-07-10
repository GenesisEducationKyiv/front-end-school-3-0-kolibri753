import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div className="alert alert-error max-w-md">
      <AlertTriangle className="h-6 w-6" />
      <div className="flex-1">
        <h3 className="font-bold">Error</h3>
        <div className="text-xs">{message}</div>
      </div>
      {onRetry && (
        <button
          className="btn btn-sm btn-ghost"
          onClick={onRetry}
          data-testid="retry-button"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      )}
    </div>
  );
};
