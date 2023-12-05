import { useEffect } from 'react';

export const useDebounce = (callback: () => void, timer?: number) => {
  useEffect(() => {
    const debounce = setTimeout(() => callback(), timer || 100);
    return () => clearTimeout(debounce);
  }, [callback, timer]);
};
