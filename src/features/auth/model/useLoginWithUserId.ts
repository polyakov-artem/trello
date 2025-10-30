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

      setSessionState({ isLoading: true });
      const { data, error } = await authApi.loginWithUserId(userId);

      if (error) {
        setSessionState({ error });
        return { error };
      }

      await sessionRepository.saveSession(data);
      setSession(data);
      setSessionState({ isLoading: false });
      return { data };
    },
    [checkIfActiveSession, checkIfLoadingSession, setSession, setSessionState]
  );

  return {
    loginWithUserId,
  };
};
