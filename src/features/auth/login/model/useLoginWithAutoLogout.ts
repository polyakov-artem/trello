import { useCallback } from 'react';
import { useLoginWithAutoLogoutContext } from './LoginWithAutoLogoutContext';
import { useCanLoginWithLogoutFn } from './guards';
import { sessionRepository, useSessionStore } from '@/entities/session';
import { authApi } from '@/shared/api/auth/authApi';

export const useLoginWithAutoLogout = () => {
  const { logout } = useLoginWithAutoLogoutContext();
  const setSessionState = useSessionStore.use.setState();
  const getSessionState = useSessionStore.use.getState();
  const canLoginWithLogoutFn = useCanLoginWithLogoutFn();

  return useCallback(
    async (userId: string, onStart?: () => void, onEnd?: () => void) => {
      if (!canLoginWithLogoutFn()) {
        return;
      }

      onStart?.();

      if (getSessionState().value) {
        await logout();
      }

      setSessionState({ isLoading: true, error: undefined });

      const result = await authApi.loginWithUserId(userId);

      if (result.ok) {
        await sessionRepository.saveSession(result.data);
        setSessionState({ value: result.data });
      } else {
        setSessionState({ error: result.error });
      }

      setSessionState({ isLoading: false });

      onEnd?.();
      return result;
    },
    [canLoginWithLogoutFn, getSessionState, logout, setSessionState]
  );
};
