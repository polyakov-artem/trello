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

  const { unassignedTasksIds, tasksMap } = useMemo(() => {
    const tasksMap: Record<string, Task> = {};
    const unassignedTasksMap: Record<string, Task> = {};

    tasks?.forEach((task) => {
      tasksMap[task.id] = task;
      unassignedTasksMap[task.id] = task;
    });

    boards?.forEach((board) => {
      for (const column of board.columns) {
        for (const taskId of column.tasksIds) {
          delete unassignedTasksMap[taskId];
        }
      }
    });

    return {
      unassignedTasksIds: Object.keys(unassignedTasksMap),
      tasksMap,
    };
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
                isUpdating={isUpdating}
                tasksMap={tasksMap}
                unassignedTasksIds={unassignedTasksIds}
              />
            )}
          </AuthProtected>
        </div>
      </div>
    </AddBoardColumnProvider>
  );
};
