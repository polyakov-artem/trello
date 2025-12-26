import { type FC } from 'react';

import { BtnCreateTask, CreateTaskProvider, ModalCreateTask } from '@/features/task/createTask';
import { useTasksStore } from '@/entities/task';
import { ModalUpdateTask, UpdateTaskProvider } from '@/features/task/updateTask';
import { TasksTable } from '@/widgets/TasksTable';
import { AuthProtected } from '@/widgets/AuthProtected';

const TITLE = 'Tasks';

export const TasksPage: FC = () => {
  const tasks = useTasksStore.use.value();
  const isLoadingTasks = useTasksStore.use.isLoading();
  const tasksError = useTasksStore.use.error();

  return (
    <CreateTaskProvider>
      <UpdateTaskProvider>
        <div className="container mx-auto p-4 grow flex">
          <div className="flex flex-col gap-6 grow">
            <h1 className="font-bold text-3xl text-center ">{TITLE}</h1>
            <AuthProtected className="grow">
              <BtnCreateTask className={'ml-auto'} />
              <TasksTable tasks={tasks} isLoading={isLoadingTasks} errorMsg={tasksError?.message} />
            </AuthProtected>
          </div>
        </div>

        <ModalCreateTask />
        <ModalUpdateTask />
      </UpdateTaskProvider>
    </CreateTaskProvider>
  );
};
