/**
 * Custom Hook: useDebounce
 * Syllabus: Exp 7 (Advanced Hooks & Performance optimization)
 * Delays updating value until user stops typing for delay ms.
 */
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout on value or delay change
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
