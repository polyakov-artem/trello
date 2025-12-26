import { useCallback } from 'react';
import { useUsersStore } from '../../../../entities/user/model/usersStore';

export const canLoadUsersGuard = (isLoadingUsers: boolean) => {
  return !isLoadingUsers;
};

export const useCanLoadUsersFn = () => {
  const getState = useUsersStore.use.getState();

  return useCallback(() => canLoadUsersGuard(getState().isLoading), [getState]);
};
