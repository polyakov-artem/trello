import { sessionRepository, useSessionStore } from '@/entities/session';
import { authApi } from '@/shared/api/auth/authApi';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useCallback } from 'react';

export const useLoginWithSavedSession = () => {
  const setSessionState = useSessionStore.use.setSessionState();
  const setSession = useSessionStore.use.setSession();
  const checkIfLoadingSession = useSessionStore.use.checkIfLoadingSession();
  const checkIfActiveSession = useSessionStore.use.checkIfActiveSession();

  const loginWithSavedSession = useCallback(
    async (throwError?: boolean) => {
      if (checkIfLoadingSession() || checkIfActiveSession()) {
        return;
      }

      setSessionState({ isLoading: true });

      const savedSession = await sessionRepository.loadSession();

      if (!savedSession) {
        setSessionState({ isLoading: false });
        return;
      }

      try {
        const session = await authApi.loginWithSessionId(savedSession.sessionId, throwError);

        try {
          await sessionRepository.saveSession(session);
        } catch {
          // ignore
        }

        setSession(session);
        setSessionState({ isLoading: false });
      } catch (e) {
        const error = getErrorMessage(e);
        setSessionState({ error });
        return { error };
      }
    },
    [checkIfActiveSession, checkIfLoadingSession, setSession, setSessionState]
  );

  return {
    loginWithSavedSession,
  };
};
