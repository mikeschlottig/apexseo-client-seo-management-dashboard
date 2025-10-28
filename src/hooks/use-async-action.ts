import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
interface AsyncActionConfig<T> {
  action: () => Promise<T>;
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
}
interface AsyncActionState {
  isLoading: boolean;
  error: Error | null;
}
export function useAsyncAction<T>(config: AsyncActionConfig<T>) {
  const [state, setState] = useState<AsyncActionState>({
    isLoading: false,
    error: null,
  });
  const abortControllerRef = useRef<AbortController | null>(null);
  const toastIdRef = useRef<string | number | null>(null);
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  const execute = useCallback(async () => {
    setState({ isLoading: true, error: null });
    abortControllerRef.current = new AbortController();
    if (config.loadingMessage) {
      toastIdRef.current = toast.loading(config.loadingMessage);
    }
    try {
      const result = await config.action();
      if (abortControllerRef.current.signal.aborted) {
        return;
      }
      setState({ isLoading: false, error: null });
      if (config.successMessage) {
        if (toastIdRef.current) {
          toast.success(config.successMessage, { id: toastIdRef.current });
        } else {
          toast.success(config.successMessage);
        }
      } else if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      config.onSuccess?.(result);
    } catch (error) {
      if (abortControllerRef.current.signal.aborted) {
        return;
      }
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState({ isLoading: false, error: err });
      const errorMsg = config.errorMessage || err.message;
      if (toastIdRef.current) {
        toast.error(errorMsg, { id: toastIdRef.current });
      } else {
        toast.error(errorMsg);
      }
      config.onError?.(err);
    }
  }, [config]);
  const reset = useCallback(() => {
    setState({ isLoading: false, error: null });
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, []);
  return {
    execute,
    isLoading: state.isLoading,
    error: state.error,
    reset,
  };
}