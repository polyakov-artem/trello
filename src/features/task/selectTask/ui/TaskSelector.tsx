import { useCallback, type FC } from 'react';
import { Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';
import type { PropsWithClassName } from '@/shared/types/types';
import { useTasksSelectionContext } from '@/entities/task';

export type TaskSelectorProps = Omit<CheckboxProps, 'onChange' | 'checked'> & {
  columnId: string;
  taskId: string;
} & PropsWithClassName;

const useTaskSelector = ({ taskId, columnId }: TaskSelectorProps) => {
  const queryParamApi = useTasksSelectionContext();

  const handleChange = useCallback(() => {
    queryParamApi.toggleValues([columnId], [taskId], false);
  }, [columnId, queryParamApi, taskId]);

  const checked = queryParamApi.exists([columnId], [taskId]);

  return { handleChange, checked };
};

export const TaskSelector: FC<TaskSelectorProps> = (props) => {
  const { handleChange, checked } = useTaskSelector(props);

  return <Checkbox {...props} value={props.taskId} onChange={handleChange} checked={checked} />;
};
