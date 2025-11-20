import { ModalUpdateBoard } from '@/features/board/update';
import { UpdateBoardContext, type ShowModalParams } from '@/features/board/update';
import { useModal } from '@/shared/ui/Modal/useModal';

import { useCallback, useMemo, useState, type FC, type PropsWithChildren } from 'react';

export const WindowUpdateBoard: FC<PropsWithChildren> = ({ children }) => {
  const { openModal, closeModal, isOpen } = useModal();
  const [params, setParams] = useState<ShowModalParams | null>(null);

  const showModal = useCallback(
    (params: ShowModalParams) => {
      setParams(params);
      openModal();
    },
    [openModal]
  );

  const handleClose = useCallback(() => {
    setParams(null);
  }, []);

  const contextValue = useMemo(() => ({ showModal }), [showModal]);

  return (
    <>
      <UpdateBoardContext value={contextValue}>{children}</UpdateBoardContext>
      <ModalUpdateBoard
        isOpen={isOpen}
        closeModal={closeModal}
        boardId={params?.boardId || ''}
        onCloseComplete={handleClose}
      />
    </>
  );
};
