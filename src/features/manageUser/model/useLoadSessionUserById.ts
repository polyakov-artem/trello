import { useSessionStore } from '@/entities/session';
import { userApi } from '@/shared/api/user/userApi';
import { errors } from '@/shared/constants/errorMsgs';
import { useCallback } from 'react';

export const useLoadSessionUserById = () => {
  const setSessionUser = useSessionStore.use.setSessionUser();
  const setSessionUserState = useSessionStore.use.setSessionUserState();
  const checkIfLoadingSessionUser = useSessionStore.use.checkIfLoadingSessionUser();

  const loadSessionUserById = useCallback(
    async (userId: string, sessionId: string, signal?: AbortSignal) => {
      if (checkIfLoadingSessionUser()) {
        return;
      }

      setSessionUserState(true);

      const result = await userApi.getUserById(userId, sessionId, signal);

      if (result.ok) {
        setSessionUser(result.data);
      } else {
        if (result.error.name === errors.abortedByUser) {
          setSessionUserState(false);
          return;
        }

        setSessionUserState(result.error);
      }

      setSessionUserState(false);
      return result;
    },

    [checkIfLoadingSessionUser, setSessionUser, setSessionUserState]
  );

  return { loadSessionUserById };
};
