import { type FC } from 'react';
import { Table } from 'antd';
import { ErrorWithReloadBtn } from '@/shared/ui/ErrorWithReload/ErrorWithReloadBtn';
import { useBoardsTable, type BoardsTableProps, type DataType } from '../model/useBoardsTable';

export const BoardsTable: FC<BoardsTableProps> = (props: BoardsTableProps) => {
  const { isLoading, error, data, columns } = useBoardsTable(props);

  if (error) {
    return <ErrorWithReloadBtn title={error.message} />;
  }

  return (
    <Table<DataType>
      className={props.className}
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
