import { useSessionStore } from '@/entities/session';
import { userApi } from '@/shared/api/user/userApi';
import { errors } from '@/shared/constants/errorMsgs';
import { useCallback } from 'react';

let abortController: AbortController | undefined;

export const cancelLoadSessionUserByIdRequest = () => {
  abortController?.abort();
  abortController = undefined;
};

export const useLoadSessionUserById = () => {
  const setSessionUser = useSessionStore.use.setSessionUser();
  const setSessionUserState = useSessionStore.use.setSessionUserState();
  const checkIfLoadingSessionUser = useSessionStore.use.checkIfLoadingSessionUser();

  const loadSessionUserById = useCallback(
    async (userId: string, sessionId: string, abortController: Promise<void>) => {
      if (checkIfLoadingSessionUser()) {
        return;
      }

      setSessionUserState({ isLoading: true });

      const { data, error } = await userApi.getUserById(userId, sessionId, abortController);

      if (error) {
        if (error.message === errors.abortedByUser) {
          setSessionUserState({ isLoading: false });
          return;
        }

        setSessionUserState({ error });
        return { error };
      }

      setSessionUser(data);
      setSessionUserState({ isLoading: false });
      return { data };
    },

    [checkIfLoadingSessionUser, setSessionUser, setSessionUserState]
  );

  return { loadSessionUserById };
};
