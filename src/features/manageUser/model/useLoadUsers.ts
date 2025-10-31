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
    setUsersState(true);

    const result = await userApi.getUsers();

    if (result.ok) {
      setUsers(result.data);
      setUsersState(false);
    } else {
      setUsersState(result.error);
    }

    return result;
  }, [checkIfLoadingUsers, setUsers, setUsersState]);

  return { loadUsers };
};
