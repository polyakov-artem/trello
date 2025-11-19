import { type FC } from 'react';

import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useBtnDeleteTask } from '../model/useBtnDeleteTask';

export type BtnDeleteTaskProps = {
  taskId: string;
} & PropsWithClassName;

export const TITLE = 'Delete';

export const BtnDeleteTask: FC<BtnDeleteTaskProps> = ({ taskId, className }) => {
  const { isDeleting, handleClick } = useBtnDeleteTask(taskId);

  return (
    <Button
      loading={isDeleting}
      onClick={handleClick}
      color="red"
      variant="solid"
      className={className}
      iconPosition={'end'}>
      {TITLE}
    </Button>
  );
};
