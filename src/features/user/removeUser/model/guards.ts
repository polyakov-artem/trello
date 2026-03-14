import { useSessionStore } from '@/entities/session';
import { useUserDeletionStore } from '@/entities/user';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanRemoveUserGuardProps = {
  session: Session | undefined;
  isRemovingUser: boolean;
};

export const canRemoveUserGuard = ({ session, isRemovingUser }: CanRemoveUserGuardProps) => {
  return !!session && !isRemovingUser;
};

export const useCanRemoveUserFn = () => {
  const getUserDeletionStoreState = useUserDeletionStore.use.getState();
  const getSessionState = useSessionStore.use.getState();

  return useCallback(
    () =>
      canRemoveUserGuard({
        session: getSessionState().value,
        isRemovingUser: getUserDeletionStoreState().isLoading,
      }),
    [getSessionState, getUserDeletionStoreState]
  );
};

export const useCanRemoveUser = () => {
  const session = useSessionStore.use.value();
  const isRemovingUser = useUserDeletionStore.use.isLoading();

  return useMemo(
    () =>
      canRemoveUserGuard({
        session,
        isRemovingUser,
      }),
    [session, isRemovingUser]
  );
};
