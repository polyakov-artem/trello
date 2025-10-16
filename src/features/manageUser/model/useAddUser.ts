import { useUsersStore } from '@/entities/user/model/usersStore';
import { userApi, type UserWithoutId } from '@/shared/api/user/userApi';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useCallback } from 'react';

export const useAddUser = () => {
  const addUserToStore = useUsersStore.use.addUser();
  const setAddingState = useUsersStore.use.setAddingState();
  const checkIfAddingUser = useUsersStore.use.checkIfAddingUser();

  const addUser = useCallback(
    async (user: UserWithoutId, throwError?: boolean) => {
      if (checkIfAddingUser()) {
        return;
      }

      setAddingState({ isLoading: true });

      try {
        const newUser = await userApi.addUser(user, throwError);
        addUserToStore(newUser);
        setAddingState({ isLoading: false });
      } catch (e) {
        const error = getErrorMessage(e);
        setAddingState({ error });
        return { error };
      }
    },
    [addUserToStore, checkIfAddingUser, setAddingState]
  );

  return { addUser };
};
