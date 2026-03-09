import { useCallback, type FC } from 'react';
import { Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';
import { useTasksSelectionContext } from '@/entities/task';

const useTaskSelector = (columnId: string, taskId: string) => {
  const queryParamApi = useTasksSelectionContext();

  const handleChange = useCallback(() => {
    queryParamApi.toggleValues([columnId], [taskId], false);
  }, [columnId, queryParamApi, taskId]);

  const checked = queryParamApi.exists([columnId], [taskId]);

  return { handleChange, checked };
};

export type TaskSelectorProps = Omit<CheckboxProps, 'onChange' | 'checked'> & {
  columnId: string;
  taskId: string;
};

export const TaskSelector: FC<TaskSelectorProps> = (props) => {
  const { columnId, taskId, ...restProps } = props;
  const { handleChange, checked } = useTaskSelector(columnId, taskId);

  return <Checkbox {...restProps} value={props.taskId} onChange={handleChange} checked={checked} />;
};
