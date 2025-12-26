import { BtnDeleteTask } from '@/features/task/deleteTask';
import { BtnEditTask } from '@/features/task/EditTask';
import type { Task } from '@/shared/types/types';
import type { PropsWithClassName } from '@/shared/types/types';
import { CheckOutlined, DeleteOutlined, EditOutlined, FieldTimeOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import { useMemo, type FC } from 'react';

export type DnDTaskProps = {
  task: Task;
} & PropsWithClassName;

export const DnDTask: FC<DnDTaskProps> = ({ className, task }) => {
  const classes = useMemo(
    () =>
      clsx('p-2 border-1 border-gray-200 rounded-md flex justify-between items-center', className),
    [className]
  );

  return (
    <li className={classes}>
      <div className="flex gap-2">
        {task.completed ? (
          <CheckOutlined style={{ color: 'green' }} />
        ) : (
          <FieldTimeOutlined style={{ color: 'orange' }} />
        )}
        {task.title}
      </div>
      <div className="inline-flex flex-wrap gap-2 items-center">
        <BtnDeleteTask taskId={task.id} size={'small'}>
          <DeleteOutlined />
        </BtnDeleteTask>
        <BtnEditTask taskId={task.id} size={'small'}>
          <EditOutlined />
        </BtnEditTask>
      </div>
    </li>
  );
};
