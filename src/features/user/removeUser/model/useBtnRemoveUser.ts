import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useRemoveUser } from './useRemoveUser';
import { useConfirmationContext } from '@/shared/ui/Confirmation/ConfirmationContext';

export const TITLE = 'User Deletion';
export const TEXT = 'Do you really want to delete the user?';

export const useBtnRemoveUser = (userId: string) => {
  const { removeUser, isRemovingUser, canRemoveUser } = useRemoveUser(userId);
  const { getConfirmation } = useConfirmationContext();

  const removeHandler = useCallback(async () => {
    const confirmed = await getConfirmation({
      title: TITLE,
      body: TEXT,
    });

    if (!confirmed) {
      return;
    }

    try {
      await removeUser();
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      }
    }
  }, [getConfirmation, removeUser]);

  const handleClick = useCallback(() => {
    void removeHandler();
  }, [removeHandler]);

  return {
    isRemovingUser,
    handleClick,
    isBtnDisabled: !canRemoveUser,
  };
};
