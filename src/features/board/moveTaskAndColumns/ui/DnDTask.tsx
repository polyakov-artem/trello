import type { PropsWithClassName } from '@/shared/types/types';
import { useMemo, type FC, type ReactNode } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';
import { TYPE_TASK } from '../config/dndConstants';
import { BoardTask, useTasksMapContext } from '@/entities/task';
import { InsertionType } from '@/shared/api/board/boardApi';

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
  taskId: string;
  columnId: string;
  taskIndex: number;
  actionsBefore?: ReactNode;
  actionsAfter?: ReactNode;
} & PropsWithClassName;

export const DnDTask: FC<DnDTaskProps> = ({
  className,
  taskId,
  columnId,
  actionsAfter,
  actionsBefore,
  taskIndex,
}) => {
  const tasksMap = useTasksMapContext();
  const task = tasksMap[taskId];

  const { ref, isDropTarget, isDragging } = useSortable({
    id: taskId,
    type: TYPE_TASK,
    accept: (source) => {
      if (source.type === TYPE_TASK && source.id !== taskId) {
        return true;
      }

      return false;
    },
    index: taskIndex,
    data: {
      subject: TYPE_TASK,
      taskId,
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
