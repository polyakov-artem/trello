import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import { useMemo, type FC, type ReactNode } from 'react';
import { DnDColumn } from '@/features/board/moveTaskAndColumns';
import { DnDBoardProviders } from './DnDBoardProviders';
import { useBoard } from '@/entities/board/model/useBoard';
import { BtnAddBoardColumn } from '@/features/board/addBoardColumn';
import { AllTasksSelector } from '@/features/task/selectTask';
import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons';
import { BtnDeleteColumnTasks } from '@/features/task/deleteTask';
import { BtnCreateColumnTask } from '@/features/board/createColumnTask';
import { BtnDeleteBoardColumn } from '@/features/board/deleteBoardColumn';

export type DnDBoardProps = PropsWithClassName & { isFetching: boolean };

const useDnDBoard = () => {
  const board = useBoard();

  return useMemo(() => {
    let unassignedTasksColumn: ReactNode;
    const columns: ReactNode[] = [];

    board.columns.forEach((column, index) => {
      const { id: columnId } = column;

      const bottomActions = (
        <>
          <AllTasksSelector columnId={columnId}>Select all</AllTasksSelector>
          <BtnDeleteColumnTasks columnId={columnId} size={'small'}>
            <DeleteOutlined /> Delete selected
          </BtnDeleteColumnTasks>
        </>
      );

      const topActions = (
        <>
          {index !== 0 && (
            <BtnDeleteBoardColumn columnId={columnId} size="small">
              <DeleteOutlined />
            </BtnDeleteBoardColumn>
          )}

          <BtnCreateColumnTask size="small" columnId={columnId}>
            <FileAddOutlined />
          </BtnCreateColumnTask>
        </>
      );

      if (index === 0) {
        unassignedTasksColumn = (
          <DnDColumn
            isSortable={false}
            columnIndex={index}
            key={column.id}
            title={column.title}
            columnId={column.id}
            bottomActions={bottomActions}
            topActions={topActions}
          />
        );
      } else {
        columns.push(
          <DnDColumn
            columnIndex={index}
            key={column.id}
            title={column.title}
            columnId={column.id}
            bottomActions={bottomActions}
            topActions={topActions}
          />
        );
      }
    });

    return {
      unassignedTasksColumn,
      columns,
    };
  }, [board.columns]);
};

export const DnDBoard: FC<DnDBoardProps> = ({ className }) => {
  const classes = useMemo(() => clsx('flex flex-col grow gap-4', className), [className]);
  const { unassignedTasksColumn, columns } = useDnDBoard();

  return (
    <DnDBoardProviders>
      <div className={classes}>
        <BtnAddBoardColumn className="self-end" />
        <div className="grow grid grid-cols-[300px_1fr] gap-2">
          <div className="bg-gray-100 rounded-md p-2 sticky top-0 self-start">
            {unassignedTasksColumn}
          </div>
          <div className="bg-gray-100 rounded-md p-2 grid gap-2 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {columns}
          </div>
        </div>
      </div>
    </DnDBoardProviders>
  );
};
