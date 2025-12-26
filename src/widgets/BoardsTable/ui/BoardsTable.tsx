import { type FC } from 'react';
import { Table } from 'antd';
import { ErrorBanner } from '@/shared/ui/ErrorBanner/ErrorBanner';
import { useBoardsTable, type BoardsTableProps, type DataType } from '../model/useBoardsTable';

export const BoardsTable: FC<BoardsTableProps> = (props: BoardsTableProps) => {
  const { dataSource, columns, className, isLoading, errorMsg } = useBoardsTable(props);

  if (errorMsg) {
    return (
      <div className="border rounded-sm border-gray-200">
        <ErrorBanner title={errorMsg} withIcon inline />
      </div>
    );
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
      dataSource={dataSource}
    />
  );
};
