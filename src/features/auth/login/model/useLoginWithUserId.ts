import { sessionRepository, useSessionStore } from '@/entities/session';
import { authApi } from '@/shared/api/auth/authApi';
import { useCallback } from 'react';

export const useLoginWithUserId = () => {
  const setSessionState = useSessionStore.use.setState();
  const checkIfLoadingSession = useSessionStore.use.checkIfLoading();
  const getSession = useSessionStore.use.getValue();

  const loginWithUserId = useCallback(
    async (userId: string) => {
      if (checkIfLoadingSession() || getSession()) {
        return;
      }

      setSessionState({ isLoading: true, error: undefined });

      const result = await authApi.loginWithUserId(userId);

      if (result.ok) {
        await sessionRepository.saveSession(result.data);
        setSessionState({ value: result.data });
      } else {
        setSessionState({ error: result.error });
      }

      setSessionState({ isLoading: false });
      return result;
    },
    [checkIfLoadingSession, getSession, setSessionState]
  );

  return loginWithUserId;
};
