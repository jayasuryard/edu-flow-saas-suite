
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryContextType {
  error: Error | null;
  resetError: () => void;
  setError: (error: Error) => void;
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextType | undefined>(undefined);

interface ErrorBoundaryProviderProps {
  children: ReactNode;
}

export const ErrorBoundaryProvider: React.FC<ErrorBoundaryProviderProps> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  const resetError = () => setError(null);

  return (
    <ErrorBoundaryContext.Provider value={{ error, resetError, setError }}>
      {error ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2">
              {error.message}
            </AlertDescription>
            <Button 
              onClick={resetError} 
              className="mt-4"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          </Alert>
        </div>
      ) : (
        children
      )}
    </ErrorBoundaryContext.Provider>
  );
};

export const useErrorBoundary = () => {
  const context = useContext(ErrorBoundaryContext);
  if (!context) {
    throw new Error('useErrorBoundary must be used within an ErrorBoundaryProvider');
  }
  return context;
};
