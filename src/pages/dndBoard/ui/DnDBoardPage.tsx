import { type FC } from 'react';
import {
  useBoard,
  useBoardError,
  useBoardsStoreActions,
  useBoardUpdateStore,
} from '@/entities/board';
import { useParams } from 'react-router';
import { useTasksStore } from '@/entities/task';
import { ErrorBanner } from '@/shared/ui/ErrorBanner/ErrorBanner';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { AuthProtected } from '@/widgets/AuthProtected';
import { DnDBoard } from '@/widgets/DnDBoard';
import { AddBoardColumnProvider } from '@/features/board/addBoardColumn';

const TITLE = 'Board';

export const DnDBoardPage: FC = () => {
  const { boardId = '' } = useParams();
  const board = useBoard(boardId);
  const boardError = useBoardError(boardId);
  const tasks = useTasksStore.use.value();
  const tasksError = useTasksStore.use.error();
  const error = tasksError?.message || boardError?.message;
  const isUpdating = useBoardUpdateStore.use.isLoading();
  const title = board?.title ? `${TITLE}: ${board.title}` : TITLE;
  const { updateBoard } = useBoardsStoreActions();

  return (
    <AddBoardColumnProvider>
      <div className="container mx-auto p-4 grow flex">
        <div className="flex flex-col gap-6 grow">
          <h1 className="font-bold text-3xl text-center ">{title}</h1>
          <AuthProtected className="grow">
            {error ? (
              <ErrorBanner title={error} withDefaultIcon />
            ) : !board || !tasks ? (
              <Spinner withMsg />
            ) : (
              <DnDBoard
                tasks={tasks}
                board={board}
                isUpdating={isUpdating}
                updateBoard={updateBoard}
              />
            )}
          </AuthProtected>
        </div>
      </div>
    </AddBoardColumnProvider>
  );
};
