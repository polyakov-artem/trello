import { type FC } from 'react';
import { Button } from 'antd';
import type { BaseButtonProps } from 'antd/es/button/button';
import { useBtnDeleteTasksBase } from '../model/useBtnDeleteTasksBase';
import { useCanDeleteTask } from '../model/guards';

type UseBtnDeleteTaskProps = {
  taskId: string;
};

const useBtnDeleteTask = ({ taskId: tasksId }: UseBtnDeleteTaskProps) => {
  const { isLoading, handleClick } = useBtnDeleteTasksBase(tasksId);
  const isDisabled = !useCanDeleteTask();
  return { isLoading, handleClick, isDisabled };
};

export type BtnDeleteTaskProps = BaseButtonProps & UseBtnDeleteTaskProps;

export const BtnDeleteTask: FC<BtnDeleteTaskProps> = (props) => {
  const { isLoading, handleClick, isDisabled } = useBtnDeleteTask(props);
  return (
    <Button
      color="red"
      variant="solid"
      iconPosition={'end'}
      {...props}
      onClick={handleClick}
      disabled={isDisabled}
      loading={isLoading}
    />
  );
};
