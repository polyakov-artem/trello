import { useMemo, type FC, type ReactNode } from 'react';
import { Table, type GetProp, type TableProps } from 'antd';
import { useTasksStore } from '@/entities/task';
import type { PropsWithClassName } from '@/shared/types/types';
import { ErrorWithReloadBtn } from '@/shared/ui/ErrorWithReload/ErrorWithReloadBtn';
import type { Task } from '@/entities/task';

export type TasksTableProps = PropsWithClassName & {
  renderActions?: (taskId: string) => ReactNode;
};

type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;

type DataType = {
  index: number;
  key: string;
} & Task;

export const TasksTable: FC<TasksTableProps> = ({ className, renderActions }) => {
  const tasks = useTasksStore.use.value();
  const isLoadingTasks = useTasksStore.use.isLoading();
  const tasksError = useTasksStore.use.error();

  const isLoading = isLoadingTasks;
  const error = tasksError;

  const data = useMemo(() => {
    return tasks.map((task, index) => ({
      ...task,
      key: task.id,
      index: index + 1,
    }));
  }, [tasks]);

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

  if (error) {
    return <ErrorWithReloadBtn title={error.message} />;
  }

  return (
    <Table<DataType>
      className={className}
      size="small"
      bordered={true}
      loading={isLoading}
      showHeader={true}
      pagination={{ position: ['bottomCenter'] }}
      columns={columns}
      dataSource={data}
    />
  );
};
