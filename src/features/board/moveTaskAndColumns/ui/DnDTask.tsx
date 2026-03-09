import type { Task } from '@/shared/types/types';
import type { PropsWithClassName } from '@/shared/types/types';
import { useMemo, type FC, type ReactNode } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';
import { InsertionType, TYPE_TASK } from '../config/dndConstants';
import { BoardTask } from '@/entities/task';

const colorGray = 'oklch(98.5% 0.002 247.839)';

const dragStyles = {
  padding: '0.5rem',
  border: `1px solid ${colorGray}`,
  backgroundColor: 'white',
  opacity: 0.8,
};

const dropStyles = {
  backgroundColor: colorGray,
};

export type DnDTaskProps = {
  task: Task;
  index: number;
  columnIndex: number;
  columnId: string;
  actionsBefore?: ReactNode;
  actionsAfter?: ReactNode;
} & PropsWithClassName;

export const DnDTask: FC<DnDTaskProps> = ({
  className,
  task,
  columnIndex,
  index,
  columnId,
  actionsAfter,
  actionsBefore,
}) => {
  const { ref, isDropTarget, isDragging } = useSortable({
    id: task.id,
    type: TYPE_TASK,
    accept: (source) => {
      if (source.type === TYPE_TASK && source.id !== task.id) {
        return true;
      }

      return false;
    },
    index,
    data: {
      subject: TYPE_TASK,
      taskId: task.id,
      taskIndex: index,
      columnIndex,
      columnId,
      insertionType: InsertionType.swap,
    },
  });

  const styles = useMemo(() => {
    return isDropTarget ? dropStyles : isDragging ? dragStyles : undefined;
  }, [isDragging, isDropTarget]);

  return (
    <BoardTask
      style={styles}
      task={task}
      actionsBefore={actionsBefore}
      actionsAfter={actionsAfter}
      ref={ref}
      className={className}
    />
  );
};
