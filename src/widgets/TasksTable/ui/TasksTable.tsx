import { type FC } from 'react';
import { Table } from 'antd';
import { useTasksTable, type DataType } from '../model/useTasksTable';
import type { PropsWithClassName } from '@/shared/types/types';
import { useTasksQuery } from '@/entities/task/';
import { useBoardsQuery } from '@/entities/board/';

export type TasksTableProps = PropsWithClassName;

export const TasksTable: FC<TasksTableProps> = ({ className }: TasksTableProps) => {
  const { tasks, isFetchingTasks } = useTasksQuery();
  const { isFetchingBoards } = useBoardsQuery();
  const { dataSource, columns } = useTasksTable(tasks);

  return (
    <Table<DataType>
      className={className}
      size="small"
      bordered={true}
      loading={isFetchingTasks || isFetchingBoards}
      showHeader={true}
      pagination={{ position: ['bottomCenter'] }}
      columns={columns}
      dataSource={dataSource}
    />
  );
};
