import { useUsersStore } from '@/entities/user';
import { userApi } from '@/shared/api/user/userApi';
import { useCallback } from 'react';

export const useLoadUsers = () => {
  const setUsers = useUsersStore.use.setUsers();
  const setUsersState = useUsersStore.use.setUsersState();
  const checkIfLoadingUsers = useUsersStore.use.checkIfLoadingUsers();

  const loadUsers = useCallback(async () => {
    if (checkIfLoadingUsers()) {
      return;
    }
    setUsersState({ isLoading: true });

    const { data, error } = await userApi.getUsers();

    if (error) {
      setUsersState({ error });
      return { error };
    }

    setUsers(data);
    setUsersState({ isLoading: false });
  }, [checkIfLoadingUsers, setUsers, setUsersState]);

  return { loadUsers };
};
