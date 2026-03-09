import type { Task } from '@/shared/types/types';
import type { PropsWithClassName } from '@/shared/types/types';
import { CheckOutlined, FieldTimeOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import { useMemo, type FC, type ReactNode } from 'react';

export type BoardTaskProps = {
  task: Task;
  actionsBefore?: ReactNode;
  actionsAfter?: ReactNode;
  ref: (element: Element | null) => void;
  style?: React.CSSProperties;
} & PropsWithClassName;

export const BoardTask: FC<BoardTaskProps> = ({
  className,
  task,
  actionsAfter,
  actionsBefore,
  ref,
  style,
}) => {
  const classes = useMemo(
    () => clsx('flex gap-2 p-2 border-1 border-gray-200 rounded-md', className),
    [className]
  );

  return (
    <li className={classes} ref={ref} style={style}>
      <div className="inline-flex flex-wrap gap-2 items-center">{actionsBefore}</div>
      <div className="flex gap-2 grow">
        {task.completed ? (
          <CheckOutlined style={{ color: 'green' }} />
        ) : (
          <FieldTimeOutlined style={{ color: 'orange' }} />
        )}
        {task.title}
      </div>
      <div className="inline-flex gap-2 items-center">{actionsAfter}</div>
    </li>
  );
};
