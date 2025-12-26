import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { type FC } from 'react';
import { useCreateBoardContext } from '../model/CreateBoardContext';
import { useCanCreateBoard } from '../model/guards';

export type BtnCreateBoardProps = PropsWithClassName;

export const BtnCreateBoard: FC<BtnCreateBoardProps> = ({ className }) => {
  const isBtnDisabled = !useCanCreateBoard();
  const { openModal } = useCreateBoardContext();

  return (
    <>
      <Button
        disabled={isBtnDisabled}
        size="large"
        onClick={openModal}
        color="green"
        variant="solid"
        className={className}
        iconPosition={'end'}>
        Create board
      </Button>
    </>
  );
};
