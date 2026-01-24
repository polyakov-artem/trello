import { type FC } from 'react';
import { Table } from 'antd';
import { ErrorBanner } from '@/shared/ui/ErrorBanner/ErrorBanner';
import { useTasksTable, type DataType } from '../model/useTasksTable';
import { useTasksStore } from '@/entities/task';
import type { PropsWithClassName } from '@/shared/types/types';

export type TasksTableProps = PropsWithClassName;

export const TasksTable: FC<TasksTableProps> = ({ className }: TasksTableProps) => {
  const tasks = useTasksStore.use.value();
  const isLoadingTasks = useTasksStore.use.isLoading();
  const tasksError = useTasksStore.use.error();

  const { dataSource, columns } = useTasksTable(tasks);

  if (tasksError?.message) {
    return (
      <div className="border rounded-sm border-gray-200">
        <ErrorBanner title={tasksError?.message} withIcon inline />
      </div>
    );
  }

  return (
    <Table<DataType>
      className={className}
      size="small"
      bordered={true}
      loading={isLoadingTasks}
      showHeader={true}
      pagination={{ position: ['bottomCenter'] }}
      columns={columns}
      dataSource={dataSource}
    />
  );
};
