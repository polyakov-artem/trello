import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, type FC } from 'react';
import { useAddBoardColumnContext } from '../model/AddBoardColumnContext';
import { useCanAddBoardColumn } from '../model/guards';

export type BtnAddBoardColumnProps = { boardId: string } & PropsWithClassName;

export const BtnAddBoardColumn: FC<BtnAddBoardColumnProps> = ({ className, boardId }) => {
  const { openModal } = useAddBoardColumnContext();
  const isBtnDisabled = !useCanAddBoardColumn();

  const handleClick = useCallback(() => {
    openModal({ boardId });
  }, [boardId, openModal]);

  return (
    <Button
      disabled={isBtnDisabled}
      onClick={handleClick}
      color="green"
      variant="solid"
      className={className}
      iconPosition={'end'}>
      Add column
    </Button>
  );
};
