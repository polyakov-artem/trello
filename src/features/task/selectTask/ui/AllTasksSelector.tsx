import { useCallback, useMemo, type FC } from 'react';
import { Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';
import { useTasksSelectionContext } from '@/entities/task';

const useAllTaskSelector = (columnId: string, tasksIds: string[]) => {
  const queryParamApi = useTasksSelectionContext();

  const handleChange = useCallback(() => {
    queryParamApi.toggleValues([columnId], tasksIds, false);
  }, [columnId, queryParamApi, tasksIds]);

  const checked = useMemo(
    () => queryParamApi.exists([columnId], tasksIds) && tasksIds.length > 0,
    [queryParamApi, tasksIds, columnId]
  );
  const disabled = tasksIds.length === 0;

  return { handleChange, checked, disabled };
};

export type AllTaskSelectorProps = Omit<CheckboxProps, 'onChange' | 'checked' | 'disabled'> & {
  columnId: string;
  tasksIds: string[];
};

export const AllTasksSelector: FC<AllTaskSelectorProps> = (props) => {
  const { columnId, tasksIds, ...restProps } = props;
  const { handleChange, checked, disabled } = useAllTaskSelector(columnId, tasksIds);

  return <Checkbox {...restProps} onChange={handleChange} checked={checked} disabled={disabled} />;
};
