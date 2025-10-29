import { useUsersStore } from '@/entities/user';
import { userApi, type UserWithoutId } from '@/shared/api/user/userApi';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useCallback } from 'react';

export const useRegisterUser = () => {
  const addUserToStore = useUsersStore.use.addUser();
  const setCreationState = useUsersStore.use.setCreationState();
  const checkIfCreatingUser = useUsersStore.use.checkIfCreatingUser();

  const registerUser = useCallback(
    async (user: UserWithoutId, throwError?: boolean) => {
      if (checkIfCreatingUser()) {
        return;
      }

      setCreationState({ isLoading: true });

      try {
        const newUser = await userApi.registerUser(user, throwError);
        addUserToStore(newUser);
        setCreationState({ isLoading: false });
      } catch (e) {
        const error = getErrorMessage(e);
        setCreationState({ error });
        return { error };
      }
    },
    [addUserToStore, checkIfCreatingUser, setCreationState]
  );

  return { registerUser };
};
