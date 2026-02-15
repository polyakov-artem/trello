import type { Task } from '@/shared/types/types';
import type { PropsWithClassName } from '@/shared/types/types';
import { CheckOutlined, FieldTimeOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import { useMemo, type FC, type ReactNode } from 'react';

export type DnDTaskProps = {
  task: Task;
  actions?: ReactNode;
} & PropsWithClassName;

export const DnDTask: FC<DnDTaskProps> = ({ className, task, actions }) => {
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
      <div className="inline-flex flex-wrap gap-2 items-center">{actions}</div>
    </li>
  );
};
