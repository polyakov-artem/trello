import { useSessionStore } from '@/entities/session';
import { userApi } from '@/shared/api/user/userApi';
import { errors } from '@/shared/constants/errorMsgs';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useCallback } from 'react';

export const useLoadSessionUserById = () => {
  const setSessionUser = useSessionStore.use.setSessionUser();
  const setSessionUserState = useSessionStore.use.setSessionUserState();
  const checkIfLoadingSessionUser = useSessionStore.use.checkIfLoadingSessionUser();

  const loadSessionUserById = useCallback(
    async (
      userId: string,
      sessionId: string,
      abortController: Promise<void>,
      throwError?: boolean
    ) => {
      if (checkIfLoadingSessionUser()) {
        return;
      }

      setSessionUserState({ isLoading: true });

      try {
        const user = await userApi.getUserById(userId, sessionId, abortController, throwError);
        setSessionUser(user);
        setSessionUserState({ isLoading: false });
      } catch (e) {
        const error = getErrorMessage(e);

        if (error === errors.abortedByUser) {
          setSessionUserState({ isLoading: false });
          return;
        }

        setSessionUserState({ error });
      }
    },

    [checkIfLoadingSessionUser, setSessionUser, setSessionUserState]
  );

  return { loadSessionUserById };
};
