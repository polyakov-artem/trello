import { type FC, type PropsWithChildren } from 'react';
import { TaskLocationMapProvider } from '@/entities/task';
import { EditTaskProvider, ModalEditTask } from '@/features/task/EditTask';
import { BoardsMapProvider } from '@/entities/board';

export type TasksTableProvidersProps = PropsWithChildren;

export const TasksTableProviders: FC<TasksTableProvidersProps> = ({
  children,
}: TasksTableProvidersProps) => {
  return (
    <EditTaskProvider>
      <TaskLocationMapProvider>
        <BoardsMapProvider>
          <>{children}</>
        </BoardsMapProvider>
      </TaskLocationMapProvider>
      <ModalEditTask />
    </EditTaskProvider>
  );
};
