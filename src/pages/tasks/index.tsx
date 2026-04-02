import { type FC } from 'react';
import { AuthProtected } from '@/widgets/AuthProtected';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { useTasksQuery } from '@/entities/task';
import { useBoardsQuery } from '@/entities/board';
import { TasksTableProviders } from '@/widgets/TasksTable';
import { ErrorBanner } from '@/shared/ui/ErrorBanner/ErrorBanner';
import { TasksTable } from '@/widgets/TasksTable/ui/TasksTable';

const TITLE = 'Tasks';

export const TasksPage: FC = () => {
  const { tasks, tasksError } = useTasksQuery();
  const { boards, boardsError } = useBoardsQuery();

  return (
    <div className="container mx-auto p-4 grow flex">
      <div className="flex flex-col gap-6 grow">
        <h1 className="font-bold text-3xl text-center ">{TITLE}</h1>
        <AuthProtected className="grow">
          {boardsError || tasksError ? (
            <ErrorBanner title={boardsError?.message || tasksError?.message} withDefaultIcon />
          ) : !boards || !tasks ? (
            <Spinner withMsg />
          ) : (
            <TasksTableProviders>
              <TasksTable />
            </TasksTableProviders>
          )}
        </AuthProtected>
      </div>
    </div>
  );
};
