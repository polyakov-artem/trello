import { useUserCreationStore } from '@/entities/user';
import { useCallback, useMemo } from 'react';

export type CanCreateUserGuardProps = {
  isCreatingUser: boolean;
};

export const canCreateUserGuard = ({ isCreatingUser }: CanCreateUserGuardProps) => {
  return !isCreatingUser;
};

export const useCanCreateUser = () => {
  const isCreatingUser = useUserCreationStore.use.isLoading();

  return useMemo(() => canCreateUserGuard({ isCreatingUser }), [isCreatingUser]);
};

export const useCanCreateUserFn = () => {
  const getCreationStoreState = useUserCreationStore.use.getState();

  return useCallback(
    () =>
      canCreateUserGuard({
        isCreatingUser: getCreationStoreState().isLoading,
      }),
    [getCreationStoreState]
  );
};
