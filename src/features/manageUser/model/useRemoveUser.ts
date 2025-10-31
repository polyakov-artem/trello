import { useSessionStore } from '@/entities/session';
import { useUsersStore } from '@/entities/user';
import { userApi } from '@/shared/api/user/userApi';
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

  const removeUser = async (id: string, logout: LogOut) => {
    if (checkIfRemovingUserWithId(id) || checkIfLoadingSession()) {
      return;
    }

    const confirmed = await getConfirmation({
      title: TITLE,
      body: TEXT,
    });

    if (!confirmed) {
      return;
    }

    addToDeletionQueue(id);
    const sessionId = useSessionStore.getState().getSessionId();
    const result = await userApi.removeUser(id, sessionId || '');

    if (result.ok) {
      await logout();
      removeUserFromStore(id);
    }

    removeFromDeletionQueue(id);
    return result;
  };

  return { removeUser };
};
