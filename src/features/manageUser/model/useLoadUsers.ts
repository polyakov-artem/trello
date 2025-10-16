import { useUsersStore } from '@/entities/user/model/usersStore';
import { userApi } from '@/shared/api/user/userApi';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useCallback } from 'react';

export const useLoadUsers = () => {
  const setUsers = useUsersStore.use.setUsers();
  const setUsersState = useUsersStore.use.setUsersState();
  const isLoadingUsers = useUsersStore.use.isLoadingUsersFn();

  const loadUsers = useCallback(
    async (throwError?: boolean) => {
      if (isLoadingUsers()) {
        return;
      }
      setUsersState({ isLoading: true });

      try {
        const users = await userApi.getUsers(throwError);
        setUsers(users);
      } catch (e) {
        const error = getErrorMessage(e);
        setUsersState({ error });
        return { error };
      } finally {
        setUsersState({ isLoading: false });
      }
    },

    [isLoadingUsers, setUsers, setUsersState]
  );

  return { loadUsers };
};
