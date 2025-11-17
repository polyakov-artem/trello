import { useTasksStore } from '@/entities/task';
import type { PropsWithClassName } from '@/shared/types/types';
import { ErrorWithReloadBtn } from '@/shared/ui/ErrorWithReload/ErrorWithReloadBtn';
import { useMemo, type FC } from 'react';
import { Table, type GetProp, type TableProps } from 'antd';
import type { Task } from '@/shared/api/task/taskApi';
import { useUsersStore } from '@/entities/user';

export type TasksListProps = PropsWithClassName;

type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;

type DataType = {
  index: number;
  editors: string[];
} & Task;

export const EMPTY_TASKS_LIST = 'The list of tasks is empty';

const columns: ColumnsType<DataType> = [
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
  { title: 'Editors', dataIndex: 'editors', render: (editors: string[]) => editors.join(', ') },
  { title: 'Completed', dataIndex: 'completed', render: (completed) => (completed ? 'Yes' : 'No') },
];

export const TasksList: FC<TasksListProps> = ({ className }) => {
  const users = useUsersStore.use.value();
  const isLoadingUsers = useUsersStore.use.isLoading();
  const usersError = useUsersStore.use.error();

  const tasks = useTasksStore.use.value();
  const isLoadingTasks = useTasksStore.use.isLoading();
  const tasksError = useTasksStore.use.error();

  const isLoading = isLoadingTasks || isLoadingUsers;
  const error = usersError || tasksError;

  const data = useMemo(() => {
    return tasks.map((task, index) => ({
      ...task,
      index: index + 1,
      editors: users.filter((user) => task.editorsIds.includes(user.id)).map((user) => user.name),
    }));
  }, [tasks, users]);

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
