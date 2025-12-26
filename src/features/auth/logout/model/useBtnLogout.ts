import { useCallback, useMemo, useState } from 'react';
import { useLogout } from '../model/useLogout';
import { useCanLogout } from '../model/guards';

export const useBtnLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const canLogout = useCanLogout();

  const logout = useLogout();

  const logoutHandler = useCallback(async () => {
    await logout(
      () => setIsLoading(true),
      () => setIsLoading(false)
    );
  }, [logout]);

  const handleClick = useCallback(() => {
    void logoutHandler();
  }, [logoutHandler]);

  return useMemo(
    () => ({ isLoading, handleClick, isBtnDisabled: !canLogout }),
    [isLoading, handleClick, canLogout]
  );
};
