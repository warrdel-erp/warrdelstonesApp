import { useCallback, useState } from 'react';

function useAsyncLoader<T extends (...args: any[]) => Promise<any>>(asyncFn: T) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const run = useCallback(
    async (...args: Parameters<T>) => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFn(...args);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn],
  );

  return { loading, error, run };
}

export default useAsyncLoader;
