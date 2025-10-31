import { sessionRepository, useSessionStore } from '@/entities/session';
import { authApi } from '@/shared/api/auth/authApi';
import { useCallback } from 'react';

export const useLoginWithUserId = () => {
  const setSessionState = useSessionStore.use.setSessionState();
  const setSession = useSessionStore.use.setSession();
  const checkIfLoadingSession = useSessionStore.use.checkIfLoadingSession();
  const checkIfActiveSession = useSessionStore.use.checkIfActiveSession();

  const loginWithUserId = useCallback(
    async (userId: string) => {
      if (checkIfLoadingSession() || checkIfActiveSession()) {
        return;
      }

      setSessionState(true);

      const result = await authApi.loginWithUserId(userId);

      if (result.ok) {
        await sessionRepository.saveSession(result.data);
        setSession(result.data);
      } else {
        setSessionState(result.error);
      }

      setSessionState(false);
      return result;
    },
    [checkIfActiveSession, checkIfLoadingSession, setSession, setSessionState]
  );

  return {
    loginWithUserId,
  };
};
