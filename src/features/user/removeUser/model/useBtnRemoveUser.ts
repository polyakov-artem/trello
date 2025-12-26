import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useRemoveUser } from './useRemoveUser';
import { useConfirmationContext } from '@/shared/ui/Confirmation/ConfirmationContext';
import { useCanRemoveUser } from './guards';

export const TITLE = 'Удаление пользователя';
export const TEXT = 'Вы действительно хотите удалить пользователя?';

export const useBtnRemoveUser = (userId: string) => {
  const removeUser = useRemoveUser();
  const [isRemoving, setIsRemoving] = useState(false);
  const { getConfirmation } = useConfirmationContext();
  const canRemoveUser = useCanRemoveUser();

  const removeHandler = useCallback(async () => {
    const confirmed = await getConfirmation({
      title: TITLE,
      body: TEXT,
    });

    if (!confirmed) {
      return;
    }

    const result = await removeUser(
      userId,
      () => setIsRemoving(true),
      () => setIsRemoving(false)
    );

    if (result?.ok === false) {
      toast.error(result.error.message);
    }
  }, [getConfirmation, removeUser, userId]);

  const handleClick = useCallback(() => {
    void removeHandler();
  }, [removeHandler]);

  return useMemo(
    () => ({
      isRemoving,
      handleClick,
      isBtnDisabled: !canRemoveUser,
    }),
    [isRemoving, handleClick, canRemoveUser]
  );
};
