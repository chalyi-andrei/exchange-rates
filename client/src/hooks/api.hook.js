import { useState, useCallback } from 'react';

const DEFAULT_ERROR = 'Something went wrong...';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cleanError = () => setError(null);

  const apiCall = useCallback(async (url, method = 'get', body = null, headers = {}) => {
    setLoading(true);
    if (body) {
      body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }

    try {
      const resp = await fetch(url, { method, body, headers });
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.message || DEFAULT_ERROR);
      }
      return data;
    } catch (err) {
      setError(err.message || DEFAULT_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  return { apiCall, loading, error, cleanError };
};
