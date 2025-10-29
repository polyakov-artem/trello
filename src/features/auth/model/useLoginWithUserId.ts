import { sessionRepository, useSessionStore } from '@/entities/session';
import { authApi } from '@/shared/api/auth/authApi';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useCallback } from 'react';

export const useLoginWithUserId = () => {
  const setSessionState = useSessionStore.use.setSessionState();
  const setSession = useSessionStore.use.setSession();
  const checkIfLoadingSession = useSessionStore.use.checkIfLoadingSession();
  const checkIfActiveSession = useSessionStore.use.checkIfActiveSession();

  const loginWithUserId = useCallback(
    async (userId: string, throwError?: boolean) => {
      if (checkIfLoadingSession() || checkIfActiveSession()) {
        return;
      }

      setSessionState({ isLoading: true });

      try {
        const session = await authApi.loginWithUserId(userId, throwError);

        try {
          await sessionRepository.saveSession(session);
        } catch {
          // ignore
        }

        setSession(session);
        setSessionState({ isLoading: false });
        return { data: session };
      } catch (e) {
        const error = getErrorMessage(e);
        setSessionState({ error });
        return { error };
      }
    },
    [checkIfActiveSession, checkIfLoadingSession, setSession, setSessionState]
  );

  return {
    loginWithUserId,
  };
};
