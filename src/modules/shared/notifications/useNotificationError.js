import { useEffect, useRef } from 'react';
import { showError } from './notifications';

function useNotificationError(error) {
  const lastNotifiedErrorRef = useRef('');

  useEffect(() => {
    if (!error) {
      lastNotifiedErrorRef.current = '';

      return;
    }

    if (error === lastNotifiedErrorRef.current) {
      return;
    }

    lastNotifiedErrorRef.current = error;
    showError(error);
  }, [error]);
}

export default useNotificationError;
