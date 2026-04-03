import { useCallback, useMemo, type FC } from 'react';
import { Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';
import { useTasksByColumnIdMapContext, useTasksSelectionContext } from '@/entities/task';

const emptyTasksIds: string[] = [];

const useAllTaskSelector = (columnId: string) => {
  const queryParamApi = useTasksSelectionContext();
  const tasksIds = useTasksByColumnIdMapContext()[columnId] || emptyTasksIds;

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
};

export const AllTasksSelector: FC<AllTaskSelectorProps> = (props) => {
  const { columnId, ...restProps } = props;
  const { handleChange, checked, disabled } = useAllTaskSelector(columnId);

  return <Checkbox {...restProps} onChange={handleChange} checked={checked} disabled={disabled} />;
};
