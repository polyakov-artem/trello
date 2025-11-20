import { useUsersStore } from '@/entities/user';
import { userApi } from '@/shared/api/user/userApi';
import { useCallback } from 'react';

export const useLoadUsers = () => {
  const setUsersState = useUsersStore.use.setState();
  const checkIfLoadingUsers = useUsersStore.use.checkIfLoading();

  const loadUsers = useCallback(async () => {
    if (checkIfLoadingUsers()) {
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
  }, [checkIfLoadingUsers, setUsersState]);

  return loadUsers;
};
