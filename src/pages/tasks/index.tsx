import { type FC } from 'react';
import { TasksTable } from '@/widgets/TasksTable';
import { AuthProtected } from '@/widgets/AuthProtected';
import { EditTaskProvider, ModalEditTask } from '@/features/task/EditTask';
import { ModalCreateTask } from '@/features/task/createTask';
import { BtnCreateTask, CreateTaskProvider } from '@/entities/task';

const TITLE = 'Tasks';

export const TasksPage: FC = () => {
  return (
    <CreateTaskProvider>
      <EditTaskProvider>
        <div className="container mx-auto p-4 grow flex">
          <div className="flex flex-col gap-6 grow">
            <h1 className="font-bold text-3xl text-center ">{TITLE}</h1>
            <AuthProtected className="grow">
              <BtnCreateTask className={'ml-auto'}>Create</BtnCreateTask>
              <TasksTable />
            </AuthProtected>
          </div>
        </div>

        <ModalCreateTask />
        <ModalEditTask />
      </EditTaskProvider>
    </CreateTaskProvider>
  );
};
