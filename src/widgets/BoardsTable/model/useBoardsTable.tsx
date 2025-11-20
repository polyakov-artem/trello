import { useMemo, type ReactNode } from 'react';
import { type GetProp, type TableProps } from 'antd';
import { useBoardsStore } from '@/entities/board';
import type { PropsWithClassName } from '@/shared/types/types';
import type { Board } from '@/shared/api/board/boardApi';
import { Link } from 'react-router';

export type BoardsTableProps = PropsWithClassName & {
  renderActions?: (boardId: string) => ReactNode;
};

export type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;

export type DataType = {
  index: number;
  key: string;
} & Board;

export const useBoardsTable = ({ renderActions }: BoardsTableProps) => {
  const boards = useBoardsStore.use.value();
  const isLoadingBoards = useBoardsStore.use.isLoading();
  const boardsError = useBoardsStore.use.error();

  const isLoading = isLoadingBoards;
  const error = boardsError;

  const data = useMemo(() => {
    return boards.map((board, index) => ({
      ...board,
      key: board.id,
      index: index + 1,
    }));
  }, [boards]);

  const columns: ColumnsType<DataType> = useMemo(() => {
    return [
      {
        title: '№',
        dataIndex: 'index',
        sorter: (a, b) => a.index - b.index,
        render: (index, data) => (
          <Link to={`${data.id}`} className="font-bold">
            {index}
          </Link>
        ),
      },
      {
        title: 'Title',
        dataIndex: 'title',
        sorter: (a, b) => a.title.localeCompare(b.title, 'en'),
        filterSearch: true,
        onFilter: (value, record) => record.title.indexOf(value as string) === 0,
      },
      {
        title: '',
        dataIndex: 'id',
        render: renderActions,
        width: '200px',
      },
    ];
  }, [renderActions]);

  return useMemo(() => {
    return {
      isLoading,
      error,
      data,
      columns,
    };
  }, [columns, data, error, isLoading]);
};
