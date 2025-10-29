import { useCanCreateTask } from '@/features/manageTasks';
import { type FC } from 'react';

export const MSG_NO_PERMISSION = `You don't have permission to create tasks`;

export const TasksPage: FC = () => {
  const canCreateTask = useCanCreateTask();

  let content;

  if (!canCreateTask) {
    content = <h1 className="font-bold">{MSG_NO_PERMISSION}</h1>;
  }

  return <div className="container mx-auto px-4 py-4 grow flex flex-col">{content}</div>;
};
