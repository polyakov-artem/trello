import type { PropsWithClassName } from '@/shared/types/types';
import { useModal } from '@/shared/ui/Modal/useModal';
import { Button } from 'antd';
import { type FC } from 'react';
import { ModalCreateBoard } from './ModalCreateBoard';

export type BtnCreateBoardProps = PropsWithClassName;

export const BtnCreateBoard: FC<BtnCreateBoardProps> = ({ className }) => {
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
        Create board
      </Button>
      <ModalCreateBoard isOpen={isOpen} closeModal={closeModal} />
    </>
  );
};
