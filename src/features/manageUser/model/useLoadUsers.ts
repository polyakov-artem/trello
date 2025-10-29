import { useUsersStore } from '@/entities/user';
import { userApi } from '@/shared/api/user/userApi';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useCallback } from 'react';

export const useLoadUsers = () => {
  const setUsers = useUsersStore.use.setUsers();
  const setUsersState = useUsersStore.use.setUsersState();
  const checkIfLoadingUsers = useUsersStore.use.checkIfLoadingUsers();

  const loadUsers = useCallback(
    async (throwError?: boolean) => {
      if (checkIfLoadingUsers()) {
        return;
      }
      setUsersState({ isLoading: true });

      try {
        const users = await userApi.getUsers(throwError);
        setUsers(users);
        setUsersState({ isLoading: false });
      } catch (e) {
        const error = getErrorMessage(e);
        setUsersState({ error });
        return { error };
      }
    },

    [checkIfLoadingUsers, setUsers, setUsersState]
  );

  return { loadUsers };
};
