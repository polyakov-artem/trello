import { useSessionStore } from '@/entities/session';
import { useSessionUserStore } from '@/entities/user';
import { userApi } from '@/shared/api/user/userApi';
import { useCallback } from 'react';

export const useLoadSessionUser = () => {
  const setSessionUserState = useSessionUserStore.use.setState();
  const checkIfLoadingSessionUser = useSessionUserStore.use.checkIfLoading();
  const setCancelUserLoadingRef = useSessionUserStore.use.setCancelRef();

  const getSession = useSessionStore.use.getValue();
  const checkIfLoadingSession = useSessionStore.use.checkIfLoading();

  const loadSessionUser = useCallback(async () => {
    const { userId, sessionId } = getSession() || {};

    if (checkIfLoadingSession() || checkIfLoadingSessionUser() || !userId || !sessionId) {
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
  }, [
    checkIfLoadingSession,
    checkIfLoadingSessionUser,
    getSession,
    setCancelUserLoadingRef,
    setSessionUserState,
  ]);

  return loadSessionUser;
};
