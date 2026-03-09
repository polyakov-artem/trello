import { type FC } from 'react';
import { Button } from 'antd';
import type { BaseButtonProps } from 'antd/es/button/button';
import { useBtnDeleteTasksBase } from '../model/useBtnDeleteTasksBase';
import { useCanDeleteTask } from '../model/guards';

const useBtnDeleteTask = (taskId: string) => {
  const { isLoading, handleClick } = useBtnDeleteTasksBase(taskId);
  const isDisabled = !useCanDeleteTask();
  return { isLoading, handleClick, isDisabled };
};

export type BtnDeleteTaskProps = BaseButtonProps & {
  taskId: string;
};

export const BtnDeleteTask: FC<BtnDeleteTaskProps> = (props) => {
  const { taskId, ...restProps } = props;
  const { isLoading, handleClick, isDisabled } = useBtnDeleteTask(taskId);
  return (
    <Button
      color="red"
      variant="solid"
      iconPosition={'end'}
      {...restProps}
      onClick={handleClick}
      disabled={isDisabled}
      loading={isLoading}
    />
  );
};
