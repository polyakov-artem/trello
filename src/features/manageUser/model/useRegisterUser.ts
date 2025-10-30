import { useUsersStore } from '@/entities/user';
import { userApi, type UserWithoutId } from '@/shared/api/user/userApi';
import { useCallback } from 'react';

export const useRegisterUser = () => {
  const addUserToStore = useUsersStore.use.addUser();
  const setCreationState = useUsersStore.use.setCreationState();
  const checkIfCreatingUser = useUsersStore.use.checkIfCreatingUser();

  const registerUser = useCallback(
    async (user: UserWithoutId) => {
      if (checkIfCreatingUser()) {
        return;
      }

      setCreationState({ isLoading: true });
      const { data, error } = await userApi.registerUser(user);

      if (error) {
        setCreationState({ error });
        return { error };
      }

      addUserToStore(data);
      setCreationState({ isLoading: false });
      return { data };
    },
    [addUserToStore, checkIfCreatingUser, setCreationState]
  );

  return { registerUser };
};
