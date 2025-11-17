import type { PropsWithClassName } from '@/shared/types/types';
import { useModal } from '@/shared/ui/Modal/useModal';
import { Button } from 'antd';
import { type FC } from 'react';
import { ModalCreateTask } from '@/features/manageTasks';

export type BtnCreateTaskProps = PropsWithClassName;

export const BtnCreateTask: FC<BtnCreateTaskProps> = ({ className }) => {
  const { openModal, closeModal, isOpen } = useModal();

  return (
    <>
      <Button
        size="large"
        onClick={openModal}
        color="green"
        variant="solid"
        className={className}
        iconPosition={'end'}>
        Create task
      </Button>
      <ModalCreateTask isOpen={isOpen} closeModal={closeModal} />
    </>
  );
};
