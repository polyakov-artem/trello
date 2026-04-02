import { type FC } from 'react';
import { useParams } from 'react-router';
import { ErrorBanner } from '@/shared/ui/ErrorBanner/ErrorBanner';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { AuthProtected } from '@/widgets/AuthProtected';
import { DnDBoard } from '@/widgets/DnDBoard';
import { useBoardQuery } from '@/entities/board';
import { useTasksQuery } from '@/entities/task';

const TITLE = 'Board';

export const DnDBoardPage: FC = () => {
  const { boardId = '' } = useParams();
  const { board, boardError, isFetchingBoard } = useBoardQuery(boardId);
  const { tasks, tasksError, isFetchingTasks } = useTasksQuery();
  const title = board?.title ? `${TITLE} - ${board.title}` : TITLE;
  const isFetching = isFetchingBoard || isFetchingTasks;

  return (
    <div className="container mx-auto p-4 grow flex">
      <div className="flex flex-col gap-6 grow">
        <h1 className="font-bold text-3xl text-center ">{title}</h1>
        <AuthProtected className="grow">
          {boardError || tasksError ? (
            <ErrorBanner title={boardError?.message || tasksError?.message} withDefaultIcon />
          ) : !board || !tasks ? (
            <Spinner withMsg />
          ) : (
            <DnDBoard isFetching={isFetching} />
          )}
        </AuthProtected>
      </div>
    </div>
  );
};
