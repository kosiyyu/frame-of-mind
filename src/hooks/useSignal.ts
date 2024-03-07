import { useState, useCallback } from 'react';

export function useSignal(): [boolean, () => void] {
  const [state, setState] = useState(true);

  const signal = useCallback(() => {
    setState(prevState => !prevState);
  }, []);

  return [state, signal];
}