import { toast } from 'react-toastify';
import { useCallback, useMemo, useState } from 'react';
import { useCanLoginWithLogout } from './guards';
import { useLoginWithAutoLogout } from './useLoginWithAutoLogout';

export const useBtnLogin = (userId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const loginWithAutoLogout = useLoginWithAutoLogout();
  const canLoginWithLogout = useCanLoginWithLogout();
  const isBtnDisabled = !canLoginWithLogout;

  const loginWithLogoutHandler = useCallback(async () => {
    const result = await loginWithAutoLogout(
      userId,
      () => setIsLoading(true),
      () => setIsLoading(false)
    );

    if (result?.ok === false) {
      toast.error(result.error.message);
    }
  }, [loginWithAutoLogout, userId]);

  const handleClick = useCallback(() => {
    void loginWithLogoutHandler();
  }, [loginWithLogoutHandler]);

  return useMemo(
    () => ({ isLoading, handleClick, isBtnDisabled }),
    [isLoading, handleClick, isBtnDisabled]
  );
};
