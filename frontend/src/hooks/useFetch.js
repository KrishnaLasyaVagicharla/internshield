/**
 * Custom Hook: useFetch
 * Syllabus: Exp 7 (Encapsulated side-effect and asynchronous HTTP lifecycle in React)
 */
import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export function useFetch(url, params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const serializedParams = JSON.stringify(params);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url, { params: JSON.parse(serializedParams) });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [url, serializedParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
