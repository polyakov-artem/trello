import { useCallback, useMemo } from 'react';
import { type GetProp, type TableProps } from 'antd';
import type { PropsWithClassName } from '@/shared/types/types';
import type { Board } from '@/shared/api/board/boardApi';
import { Link } from 'react-router';
import { BtnDeleteBoard } from '@/features/board/deleteBoard';
import { BtnEditBoardTitle } from '@/features/board/editBoardTitle';

export type BoardsTableProps = PropsWithClassName & {
  isLoading?: boolean;
  errorMsg?: string;
  boards?: Board[];
};

export type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;

export type DataType = {
  index: number;
  key: string;
} & Board;

export const useBoardsTable = ({ boards, className, isLoading, errorMsg }: BoardsTableProps) => {
  const dataSource = useMemo(() => {
    return (boards || []).map((board, index) => ({
      ...board,
      key: board.id,
      index: index + 1,
    }));
  }, [boards]);

  const renderActions = useCallback(
    (boardId: string) => (
      <div className="inline-flex flex-wrap gap-2 items-center">
        <BtnDeleteBoard boardId={boardId} />
        <BtnEditBoardTitle boardId={boardId} />
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
    return { dataSource, columns, className, isLoading, errorMsg };
  }, [className, columns, dataSource, errorMsg, isLoading]);
};
