import { useUserCreationStore } from '@/entities/user';
import { useCallback } from 'react';

export const canCreateUserGuard = (isCreatingUser: boolean) => {
  return !isCreatingUser;
};

export const useCanCreateUser = () => {
  const isLoading = useUserCreationStore.use.isLoading();

  return canCreateUserGuard(isLoading);
};

export const useCanCreateUserFn = () => {
  const getState = useUserCreationStore.use.getState();

  return useCallback(() => canCreateUserGuard(getState().isLoading), [getState]);
};
