import { sessionRepository, useSessionStore } from '@/entities/session';
import { authApi } from '@/shared/api/auth/authApi';
import { useCallback } from 'react';

export const useLogout = () => {
  const setSessionState = useSessionStore.use.setSessionState();
  const setSession = useSessionStore.use.setSession();
  const checkIfLoadingSession = useSessionStore.use.checkIfLoadingSession();
  const getSessionId = useSessionStore.use.getSessionId();

  const logout = useCallback(async () => {
    const sessionId = getSessionId();

    if (checkIfLoadingSession() || !sessionId) {
      return;
    }

    setSessionState(true);

    await authApi.logout(sessionId);
    setSession(undefined);

    await sessionRepository.removeSession();
    setSessionState(false);
    return { success: true };
  }, [checkIfLoadingSession, getSessionId, setSession, setSessionState]);

  return {
    logout,
  };
};
