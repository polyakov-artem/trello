import type { Board } from '@/shared/api/board/boardApi';
import type { Task } from '@/shared/types/types';
import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import { useMemo, type FC, type ReactNode } from 'react';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons';
import { BtnDeleteBoardColumn } from '@/features/board/deleteBoardColumn';
import { BtnAddBoardColumn } from '@/features/board/addBoardColumn';
import { TasksSelectionProvider } from '@/entities/task';
import { DnDBoardProvidersWithModals } from './DnDBoardProvidersWithModals';
import { DnDColumn, DnDProvider } from '@/features/board/moveTaskAndColumns';
import { AllTasksSelector } from '@/features/task/selectTask';
import { BtnDeleteMultipleTasks } from '@/features/task/deleteTask';
import { BtnCreateColumnTask } from '@/features/board/createColumnTask';

export type DnDBoardProps = {
  board: Board;
  tasks: Task[];
  isUpdating: boolean;
  updateBoard: (board: Board) => void;
} & PropsWithClassName;

const useDnDBoard = (board: Board, tasks: Task[]) => {
  const tasksMap = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        acc[task.id] = task;

        return acc;
      },
      {} as Record<string, Task>
    );
  }, [tasks]);

  return useMemo(() => {
    let unassignedTasksColumn: ReactNode | undefined;
    const columns: ReactNode[] = [];
    const validValuesByPath: Record<string, string[]> = {};

    board.columns.forEach((column, index) => {
      const { id: columnId, tasksIds } = column;
      validValuesByPath[columnId] = tasksIds;

      const bottomActions = (
        <>
          <AllTasksSelector columnId={columnId} tasksIds={tasksIds}>
            Select all
          </AllTasksSelector>
          <BtnDeleteMultipleTasks columnId={columnId} tasksIds={tasksIds} size={'small'}>
            <DeleteOutlined /> Delete selected
          </BtnDeleteMultipleTasks>
        </>
      );

      const topActions = (
        <>
          {index !== 0 && (
            <BtnDeleteBoardColumn
              boardId={board.id}
              columnId={column.id}
              size="small"
              columnHasTasks={column.tasksIds.length > 0}>
              <DeleteOutlined />
            </BtnDeleteBoardColumn>
          )}
          <BtnCreateColumnTask size="small" columnId={column.id} boardId={board.id}>
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
            tasksIds={column.tasksIds}
            tasksMap={tasksMap}
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
            tasksIds={column.tasksIds}
            tasksMap={tasksMap}
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
      validValuesByPath,
    };
  }, [board.columns, board.id, tasksMap]);
};

export const DnDBoard: FC<DnDBoardProps> = ({
  className,
  board,
  tasks,
  updateBoard,
  isUpdating,
}) => {
  const classes = useMemo(() => clsx('flex flex-col grow gap-4', className), [className]);
  const { unassignedTasksColumn, columns, validValuesByPath } = useDnDBoard(board, tasks);

  return (
    <DnDProvider board={board} updateBoard={updateBoard}>
      <DnDBoardProvidersWithModals>
        <TasksSelectionProvider validValuesByPath={validValuesByPath}>
          <div className={classes}>
            <BtnAddBoardColumn className="self-end" boardId={board.id} />
            <div className="grow grid grid-cols-[300px_1fr] gap-2">
              <div className="bg-gray-100 rounded-md p-2 sticky top-0 self-start">
                {unassignedTasksColumn}
              </div>
              <div className="bg-gray-100 rounded-md p-2 grid gap-2 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                {columns}
              </div>
              {isUpdating && <Spinner onTopMode withOverlay whiteOverlay />}
            </div>
          </div>
        </TasksSelectionProvider>
      </DnDBoardProvidersWithModals>
    </DnDProvider>
  );
};
