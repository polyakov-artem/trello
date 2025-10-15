import { useUsersStore } from '@/entities/user';
import { userApi } from '@/shared/api/user/userApi';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useConfirmation } from '@/shared/ui/Confirmation/useConfirmation';

export const TITLE = 'Удаление пользователя';
export const TEXT = 'Вы действительно хотите удалить пользователя?';

export const useRemoveUser = () => {
  const removeUserFromStore = useUsersStore.use.removeUser();
  const addToDeletionQueue = useUsersStore.use.addToDeletionQueue();
  const removeFromDeletionQueue = useUsersStore.use.removeFromDeletionQueue();
  const isRemovingUserWithId = useUsersStore.use.isRemovingUserWithId();
  const { getConfirmation } = useConfirmation();

  const removeUser = async (
    id: string,
    throwError: boolean = false
  ): Promise<{ error?: string } | undefined> => {
    if (isRemovingUserWithId(id)) {
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

      await userApi.removeUser(id, throwError);
      removeUserFromStore(id);
    } catch (error) {
      return { error: getErrorMessage(error) };
    } finally {
      removeFromDeletionQueue(id);
    }
  };

  return { removeUser };
};
