import { useSessionUserStore } from '@/entities/user';
import { userApi } from '@/shared/api/user/userApi';
import { useCallback } from 'react';
import { useCanLoadSessionUserFn } from './guards';

export const useLoadSessionUser = () => {
  const setSessionUserState = useSessionUserStore.use.setState();
  const setCancelUserLoadingRef = useSessionUserStore.use.setCancelReqFn();

  const canLoadSessionUserFn = useCanLoadSessionUserFn();

  const loadSessionUser = useCallback(
    async (userId: string, sessionId: string) => {
      if (!canLoadSessionUserFn()) {
        return;
      }

      setSessionUserState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelUserLoadingRef(() => controller.abort());

      const result = await userApi.getUserById(userId, sessionId, controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setSessionUserState({ value: result.data });
        } else {
          setSessionUserState({ error: result.error });
        }
      }

      setSessionUserState({ isLoading: false });
      return isAborted ? undefined : result;
    },
    [canLoadSessionUserFn, setCancelUserLoadingRef, setSessionUserState]
  );

  return loadSessionUser;
};
