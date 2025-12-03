import { useState, useEffect } from 'react';
import { API_KEY_STORAGE_KEY } from '../config/constants';

export const useApiKey = () => {
  const [hasKey, setHasKey] = useState(!!localStorage.getItem(API_KEY_STORAGE_KEY));

  useEffect(() => {
    const interval = setInterval(() => {
      setHasKey(!!localStorage.getItem(API_KEY_STORAGE_KEY));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return hasKey;
};
