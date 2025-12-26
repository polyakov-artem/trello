import { sessionRepository, useSessionStore } from '@/entities/session';
import { authApi } from '@/shared/api/auth/authApi';
import { useCallback } from 'react';
import { useCanLoginFn } from './guards';

export const useLoginWithSavedSession = () => {
  const setSessionState = useSessionStore.use.setState();
  const canLoginFn = useCanLoginFn();

  const loginWithSavedSession = useCallback(async () => {
    if (!canLoginFn()) {
      return;
    }

    setSessionState({ isLoading: true, error: undefined });

    const savedSession = await sessionRepository.loadSession();
    console.log('savedSession', savedSession);

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
  }, [canLoginFn, setSessionState]);

  return loginWithSavedSession;
};
