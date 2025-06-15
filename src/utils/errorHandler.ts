
import { toast } from 'sonner';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export const handleApiError = (error: any, context?: string) => {
  console.error('API Error:', error);
  
  let errorMessage = 'An unexpected error occurred';
  
  if (error?.message) {
    errorMessage = error.message;
  } else if (error?.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  // Add context if provided
  const fullMessage = context ? `${context}: ${errorMessage}` : errorMessage;
  
  toast.error(fullMessage);
  
  return {
    message: errorMessage,
    status: error?.response?.status || error?.status,
    code: error?.response?.data?.code || error?.code
  };
};

export const handleApiSuccess = (message: string) => {
  toast.success(message);
};

export const handleApiLoading = (message: string) => {
  return toast.loading(message);
};
