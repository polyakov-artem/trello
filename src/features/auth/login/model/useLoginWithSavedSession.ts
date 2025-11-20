import { sessionRepository, useSessionStore } from '@/entities/session';
import { authApi } from '@/shared/api/auth/authApi';
import { useCallback } from 'react';

export const useLoginWithSavedSession = () => {
  const setSessionState = useSessionStore.use.setState();
  const checkIfLoadingSession = useSessionStore.use.checkIfLoading();
  const getSession = useSessionStore.use.getValue();

  const loginWithSavedSession = useCallback(async () => {
    if (checkIfLoadingSession() || getSession()) {
      return;
    }

    setSessionState({ isLoading: true, error: undefined });

    const savedSession = await sessionRepository.loadSession();

    if (!savedSession) {
      setSessionState({ isLoading: false });
      return;
    }

    const result = await authApi.loginWithSessionId(savedSession.sessionId);

    if (result.ok) {
      await sessionRepository.saveSession(result.data);
      setSessionState({ value: result.data });
    } else {
      setSessionState({ error: result.error });
    }

    setSessionState({ isLoading: false });
    return result;
  }, [checkIfLoadingSession, getSession, setSessionState]);

  return loginWithSavedSession;
};
