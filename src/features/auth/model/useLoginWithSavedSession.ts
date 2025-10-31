import { sessionRepository, useSessionStore } from '@/entities/session';
import { authApi } from '@/shared/api/auth/authApi';
import { useCallback } from 'react';

export const useLoginWithSavedSession = () => {
  const setSessionState = useSessionStore.use.setSessionState();
  const setSession = useSessionStore.use.setSession();
  const checkIfLoadingSession = useSessionStore.use.checkIfLoadingSession();
  const checkIfActiveSession = useSessionStore.use.checkIfActiveSession();

  const loginWithSavedSession = useCallback(async () => {
    if (checkIfLoadingSession() || checkIfActiveSession()) {
      return;
    }

    setSessionState(true);

    const savedSession = await sessionRepository.loadSession();

    if (!savedSession) {
      setSessionState(false);
      return;
    }

    const result = await authApi.loginWithSessionId(savedSession.sessionId);

    if (result.ok) {
      await sessionRepository.saveSession(result.data);
      setSession(result.data);
    } else {
      setSessionState(result.error);
    }

    setSessionState(false);
    return result;
  }, [checkIfActiveSession, checkIfLoadingSession, setSession, setSessionState]);

  return {
    loginWithSavedSession,
  };
};
