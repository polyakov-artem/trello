import { ModalUpdateTask } from '@/features/task/update';
import { UpdateModalTaskContext, type ShowModalParams } from '@/shared/lib/updateModalContext';
import { useModal } from '@/shared/ui/Modal/useModal';

import { useCallback, useMemo, useState, type FC, type PropsWithChildren } from 'react';

export const TaskUpdateModalWindow: FC<PropsWithChildren> = ({ children }) => {
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
      <UpdateModalTaskContext value={contextValue}>{children}</UpdateModalTaskContext>
      <ModalUpdateTask
        isOpen={isOpen}
        closeModal={closeModal}
        taskId={params?.taskId || ''}
        onCloseComplete={handleClose}
      />
    </>
  );
};
