import { useSessionStore } from '@/entities/session';
import { useUserDeletionStore, useUsersStore } from '@/entities/user';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanRemoveUserGuardProps = {
  session: Session | undefined;
  isLoadingSession: boolean;
  isRemovingUser: boolean;
  isLoadingUsers: boolean;
};

export const canRemoveUserGuard = ({
  session,
  isLoadingSession,
  isRemovingUser,
  isLoadingUsers,
}: CanRemoveUserGuardProps) => {
  return !!session && !isLoadingSession && !isRemovingUser && !isLoadingUsers;
};

export const useCanRemoveUserFn = () => {
  const getUserDeletionStoreState = useUserDeletionStore.use.getState();
  const getSessionState = useSessionStore.use.getState();
  const getUsersState = useUsersStore.use.getState();

  return useCallback(
    () =>
      canRemoveUserGuard({
        session: getSessionState().value,
        isLoadingSession: getSessionState().isLoading,
        isRemovingUser: getUserDeletionStoreState().isLoading,
        isLoadingUsers: getUsersState().isLoading,
      }),
    [getSessionState, getUserDeletionStoreState, getUsersState]
  );
};

export const useCanRemoveUser = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isRemovingUser = useUserDeletionStore.use.isLoading();
  const isLoadingUsers = useUsersStore.use.isLoading();

  return useMemo(
    () =>
      canRemoveUserGuard({
        session,
        isLoadingSession,
        isRemovingUser,
        isLoadingUsers,
      }),
    [session, isLoadingSession, isRemovingUser, isLoadingUsers]
  );
};
