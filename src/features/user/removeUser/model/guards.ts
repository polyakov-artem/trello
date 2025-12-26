import { useSessionStore } from '@/entities/session';
import { useUserDeletionStore } from '@/entities/user';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export const canRemoveUserGuard = (
  session: Session | undefined,
  isLoadingSession: boolean,
  isRemovingUser: boolean
) => {
  return !!session && !isLoadingSession && !isRemovingUser;
};

export const useCanRemoveUserFn = () => {
  const getUserDeletionStoreState = useUserDeletionStore.use.getState();
  const getSessionState = useSessionStore.use.getState();

  return useCallback(
    () =>
      canRemoveUserGuard(
        getSessionState().value,
        getSessionState().isLoading,
        getUserDeletionStoreState().isLoading
      ),
    [getSessionState, getUserDeletionStoreState]
  );
};

export const useCanRemoveUser = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isRemovingUser = useUserDeletionStore.use.isLoading();

  return useMemo(
    () => canRemoveUserGuard(session, isLoadingSession, isRemovingUser),
    [isRemovingUser, isLoadingSession, session]
  );
};
