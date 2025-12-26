import { useUsersStore } from '@/entities/user';
import { userApi } from '@/shared/api/user/userApi';
import { useCallback } from 'react';
import { useCanLoadUsersFn } from './guards';

export const useLoadUsers = () => {
  const setUsersState = useUsersStore.use.setState();
  const canLoadUsersFn = useCanLoadUsersFn();

  const loadUsers = useCallback(async () => {
    if (!canLoadUsersFn()) {
      return;
    }

    setUsersState({ isLoading: true, error: undefined });

    const result = await userApi.getUsers();

    if (result.ok) {
      setUsersState({ value: result.data });
    } else {
      setUsersState({ error: result.error });
    }

    setUsersState({ isLoading: false });
    return result;
  }, [canLoadUsersFn, setUsersState]);

  return loadUsers;
};
