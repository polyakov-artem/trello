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

    setSessionState({ isLoading: true });

    const savedSession = await sessionRepository.loadSession();

    if (!savedSession) {
      setSessionState({ isLoading: false });
      return;
    }

    const { data, error } = await authApi.loginWithSessionId(savedSession.sessionId);

    if (error) {
      setSessionState({ error });
      return { error };
    }

    await sessionRepository.saveSession(data);
    setSession(data);
    setSessionState({ isLoading: false });
    return { data };
  }, [checkIfActiveSession, checkIfLoadingSession, setSession, setSessionState]);

  return {
    loginWithSavedSession,
  };
};
