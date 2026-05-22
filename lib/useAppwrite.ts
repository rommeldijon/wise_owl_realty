import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams: P) => Promise<void>;
}

export const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fn(fetchParams);
        setData(result);
      } catch (err: any) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An unknown error occurred";

        // Ignore guest/no-session errors
        if (
          errorMessage.includes("missing scopes") ||
          err?.code === 401
        ) {
          setData(null);
          return;
        }

        setError(errorMessage);

        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn] // Memorize the function to ensure stability unless
  );
 
  // Automatically fetch data on component mount unless skip is true
  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
  }, []);

  const refetch = async (newParams: P) => await fetchData(newParams);

  return { data, loading, error, refetch };
};