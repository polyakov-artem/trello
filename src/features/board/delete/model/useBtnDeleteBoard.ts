import { useCallback, useMemo, useState } from 'react';
import { useDeleteBoard } from './useDeleteBoard';
import { toast } from 'react-toastify';
import { useConfirmationContext } from '@/shared/ui/Confirmation/ConfirmationContext';

export const TITLE = 'Удаление доски';
export const TEXT = 'Вы действительно хотите удалить доску?';

export const useBtnDeleteBoard = (boardId: string) => {
  const deleteBoard = useDeleteBoard();
  const [isDeleting, setIsDeleting] = useState(false);
  const { getConfirmation } = useConfirmationContext();

  const handleClick = useCallback(() => {
    void getConfirmation({
      title: TITLE,
      body: TEXT,
    })
      .then((confirmed) => {
        if (!confirmed) {
          return;
        }

        setIsDeleting(true);
        return deleteBoard(boardId);
      })
      .then((result) => {
        if (result?.ok === false) {
          toast.error(result.error.message);
        }

        setIsDeleting(false);
      });
  }, [deleteBoard, boardId, getConfirmation]);

  return useMemo(() => ({ isDeleting, handleClick }), [isDeleting, handleClick]);
};
