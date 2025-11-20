import { type FC } from 'react';
import { Table } from 'antd';
import { ErrorWithReloadBtn } from '@/shared/ui/ErrorWithReload/ErrorWithReloadBtn';
import { useTasksTable, type DataType, type TasksTableProps } from '../model/useTasksTable';

export const TasksTable: FC<TasksTableProps> = (props: TasksTableProps) => {
  const { className } = props;
  const { isLoading, error, data, columns } = useTasksTable(props);

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
