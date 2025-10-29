import { useSessionStore } from '@/entities/session';
import { useUsersStore } from '@/entities/user';
import { userApi } from '@/shared/api/user/userApi';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useConfirmation } from '@/shared/ui/Confirmation/useConfirmation';

export const TITLE = 'Удаление пользователя';
export const TEXT = 'Вы действительно хотите удалить пользователя?';

export type LogOut = (throwError?: boolean) => Promise<void | { data: boolean }>;

export const useRemoveUser = () => {
  const removeUserFromStore = useUsersStore.use.removeUser();
  const addToDeletionQueue = useUsersStore.use.addToDeletionQueue();
  const removeFromDeletionQueue = useUsersStore.use.removeFromDeletionQueue();
  const checkIfRemovingUserWithId = useUsersStore.use.checkIfRemovingUserWithId();
  const checkIfLoadingSession = useSessionStore.use.checkIfLoadingSession();
  const { getConfirmation } = useConfirmation();

  const removeUser = async (id: string, logout: LogOut, throwError?: boolean) => {
    if (checkIfRemovingUserWithId(id) || checkIfLoadingSession()) {
      return;
    }

    try {
      const confirmed = await getConfirmation({
        title: TITLE,
        body: TEXT,
      });

      if (!confirmed) {
        return;
      }

      addToDeletionQueue(id);
      await logout();
      await userApi.removeUser(id, throwError);
      removeUserFromStore(id);
      return { data: true };
    } catch (error) {
      return { error: getErrorMessage(error) };
    } finally {
      removeFromDeletionQueue(id);
    }
  };

  return { removeUser };
};
