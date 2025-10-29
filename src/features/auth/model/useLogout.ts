import { sessionRepository, useSessionStore } from '@/entities/session';
import { authApi } from '@/shared/api/auth/authApi';
import { useCallback } from 'react';

export const useLogout = () => {
  const setSessionState = useSessionStore.use.setSessionState();
  const setSession = useSessionStore.use.setSession();
  const checkIfLoadingSession = useSessionStore.use.checkIfLoadingSession();
  const getSessionId = useSessionStore.use.getSessionId();

  const logout = useCallback(
    async (throwError?: boolean) => {
      const sessionId = getSessionId();

      if (checkIfLoadingSession() || !sessionId) {
        return;
      }

      setSessionState({ isLoading: true });
      setSession(undefined);

      try {
        await authApi.logout(sessionId, throwError);
      } catch {
        // ignore
      }

      await sessionRepository.removeSession();
      setSessionState({ isLoading: false });
      return { data: true };
    },
    [checkIfLoadingSession, getSessionId, setSession, setSessionState]
  );

  return {
    logout,
  };
};
