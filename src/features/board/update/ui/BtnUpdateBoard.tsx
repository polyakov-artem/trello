import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, type FC } from 'react';
import { useUpdateBoardContext } from '../model/updateBoardContext';

export type BtnUpdateBoardProps = PropsWithClassName & {
  boardId: string;
};

export const BtnUpdateBoard: FC<BtnUpdateBoardProps> = ({ className, boardId }) => {
  const { showModal } = useUpdateBoardContext();

  const handleClick = useCallback(() => {
    showModal({ boardId });
  }, [showModal, boardId]);

  return (
    <>
      <Button
        onClick={handleClick}
        color="green"
        variant="solid"
        className={className}
        iconPosition={'end'}>
        Edit
      </Button>
    </>
  );
};
