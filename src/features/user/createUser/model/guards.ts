import { useUserCreationStore, useUsersStore } from '@/entities/user';
import { useCallback, useMemo } from 'react';

export type CanCreateUserGuardProps = {
  isCreatingUser: boolean;
  isLoadingUsers: boolean;
};

export const canCreateUserGuard = ({ isCreatingUser, isLoadingUsers }: CanCreateUserGuardProps) => {
  return !isCreatingUser && !isLoadingUsers;
};

export const useCanCreateUser = () => {
  const isCreatingUser = useUserCreationStore.use.isLoading();
  const isLoadingUsers = useUsersStore.use.isLoading();

  return useMemo(
    () => canCreateUserGuard({ isCreatingUser, isLoadingUsers }),
    [isCreatingUser, isLoadingUsers]
  );
};

export const useCanCreateUserFn = () => {
  const getCreationStoreState = useUserCreationStore.use.getState();
  const getUsersStoreState = useUsersStore.use.getState();

  return useCallback(
    () =>
      canCreateUserGuard({
        isCreatingUser: getCreationStoreState().isLoading,
        isLoadingUsers: getUsersStoreState().isLoading,
      }),
    [getCreationStoreState, getUsersStoreState]
  );
};
