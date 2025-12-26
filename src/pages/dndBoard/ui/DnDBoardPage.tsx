import { useMemo, type FC } from 'react';
import { useBoard, useBoardError, useBoardsArray, useBoardUpdateStore } from '@/entities/board';
import { useParams } from 'react-router';
import { useTasksStore } from '@/entities/task';
import { ErrorBanner } from '@/shared/ui/ErrorBanner/ErrorBanner';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { AuthProtected } from '@/widgets/AuthProtected';
import { DnDBoard } from '@/widgets/DnDBoard';
import type { Task } from '@/shared/types/types';
import { AddBoardColumnProvider } from '@/features/board/addBoardColumn';

const TITLE = 'DnD Board';

export const DnDBoardPage: FC = () => {
  const { boardId = '' } = useParams();
  const boards = useBoardsArray();
  const board = useBoard(boardId);
  const boardError = useBoardError(boardId);
  const tasks = useTasksStore.use.value();
  const tasksError = useTasksStore.use.error();
  const error = tasksError?.message || boardError?.message;
  const isUpdating = useBoardUpdateStore.use.isLoading();
  const unassignedTasks = useMemo(() => {
    const result: Task[] = [];

    tasks?.forEach((task) => {
      const found = boards?.some((board) => {
        return board.columns.some((column) => column.tasksIds.includes(task.id));
      });

      if (!found) {
        result.push(task);
      }
    });

    return result;
  }, [boards, tasks]);

  return (
    <AddBoardColumnProvider>
      <div className="container mx-auto p-4 grow flex">
        <div className="flex flex-col gap-6 grow">
          <h1 className="font-bold text-3xl text-center ">{TITLE}</h1>
          <AuthProtected className="grow">
            {error ? (
              <ErrorBanner title={error} withIcon />
            ) : !board || !tasks ? (
              <Spinner withMsg />
            ) : (
              <DnDBoard
                board={board}
                tasks={tasks}
                isUpdating={isUpdating}
                unassignedTasks={unassignedTasks}
              />
            )}
          </AuthProtected>
        </div>
      </div>
    </AddBoardColumnProvider>
  );
};
