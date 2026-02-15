import { useCallback, useMemo, type FC } from 'react';
import { Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';
import type { PropsWithClassName } from '@/shared/types/types';
import { useTasksSelectionContext } from '@/entities/task';

export type AllTaskSelectorProps = Omit<CheckboxProps, 'onChange' | 'checked' | 'disabled'> & {
  columnId: string;
  tasksIds: string[];
} & PropsWithClassName;

const useAllTaskSelector = ({ tasksIds, columnId }: AllTaskSelectorProps) => {
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

export const AllTasksSelector: FC<AllTaskSelectorProps> = (props) => {
  const { handleChange, checked, disabled } = useAllTaskSelector(props);

  return <Checkbox {...props} onChange={handleChange} checked={checked} disabled={disabled} />;
};
