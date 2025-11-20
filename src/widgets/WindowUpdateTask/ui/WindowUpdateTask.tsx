import { ModalUpdateTask } from '@/features/task/update';
import { UpdateTaskContext, type ShowModalParams } from '@/features/task/update';
import { useModal } from '@/shared/ui/Modal/useModal';

import { useCallback, useMemo, useState, type FC, type PropsWithChildren } from 'react';

export const WindowUpdateTask: FC<PropsWithChildren> = ({ children }) => {
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
      <UpdateTaskContext value={contextValue}>{children}</UpdateTaskContext>
      <ModalUpdateTask
        isOpen={isOpen}
        closeModal={closeModal}
        taskId={params?.taskId || ''}
        onCloseComplete={handleClose}
      />
    </>
  );
};
