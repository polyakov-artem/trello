import { useCallback, useMemo } from 'react';
import { type GetProp, type TableProps } from 'antd';
import type { Task } from '@/shared/types/types';
import { BtnDeleteTask } from '@/features/task/deleteTask';
import { BtnEditTask } from '@/features/task/EditTask';

export type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;

export type DataType = {
  index: number;
  key: string;
} & Task;

export const BTN_DELETE_TEXT = 'Delete';
export const BTN_EDIT_TEXT = 'Edit';

export const useTasksTable = (tasks?: Task[]) => {
  const dataSource = useMemo(() => {
    return (tasks || []).map((task, index) => ({
      ...task,
      key: task.id,
      index: index + 1,
    }));
  }, [tasks]);

  const renderActions = useCallback(
    (taskId: string) => (
      <div className="inline-flex flex-wrap gap-2 items-center">
        <BtnDeleteTask taskId={taskId}>{BTN_DELETE_TEXT}</BtnDeleteTask>
        <BtnEditTask taskId={taskId}>{BTN_EDIT_TEXT}</BtnEditTask>
      </div>
    ),
    []
  );

  const columns: ColumnsType<DataType> = useMemo(() => {
    return [
      {
        title: '№',
        dataIndex: 'index',
        sorter: (a, b) => a.index - b.index,
      },
      {
        title: 'Title',
        dataIndex: 'title',
        sorter: (a, b) => a.title.localeCompare(b.title, 'en'),
        filterSearch: true,
        onFilter: (value, record) => record.title.indexOf(value as string) === 0,
      },

      {
        title: 'Description',
        dataIndex: 'description',
      },
      {
        title: 'Completed',
        dataIndex: 'completed',
        render: (completed) => (completed ? 'Yes' : 'No'),
      },
      {
        title: '',
        dataIndex: 'id',
        render: renderActions,
        width: '200px',
      },
    ];
  }, [renderActions]);

  return useMemo(
    () => ({
      columns,
      dataSource,
    }),
    [columns, dataSource]
  );
};
