import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { type FC, type PropsWithChildren } from 'react';
import { useBtnDeleteBoardColumn } from '../model/useBtnDeleteBoardColumn';
import type { BaseButtonProps } from 'antd/es/button/button';

export type BtnDeleteBoardColumnProps = {
  columnId: string;
  size?: BaseButtonProps['size'];
} & PropsWithClassName &
  PropsWithChildren;

export const BtnDeleteBoardColumn: FC<BtnDeleteBoardColumnProps> = ({
  className,
  columnId,
  size,
  children,
}) => {
  const { isDeletingBoardColumn, handleClick, isDisabled } = useBtnDeleteBoardColumn(columnId);

  return (
    <Button
      size={size}
      loading={isDeletingBoardColumn}
      disabled={isDisabled}
      onClick={handleClick}
      color="red"
      variant="solid"
      className={className}
      iconPosition={'end'}>
      {children}
    </Button>
  );
};
