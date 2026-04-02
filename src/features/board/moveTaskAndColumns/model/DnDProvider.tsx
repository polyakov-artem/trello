import type { InsertionType } from '@/shared/api/board/boardApi';
import { TYPE_TASK, TYPE_COLUMN } from '../config/dndConstants';
import { DragDropProvider } from '@dnd-kit/react';
import { useMoveTask } from './useMoveTask';
import { toast } from 'react-toastify';
import { useMoveColumn } from './useMoveColumn';
import type { FC, PropsWithChildren } from 'react';
import { useCanMoveTaskOrColumn } from './guards';

type CommonData = {
  columnId: string;
  insertionType: InsertionType;
};

export type ColumnElData = CommonData & {
  subject: typeof TYPE_COLUMN;
};

export type TaskElData = CommonData & {
  taskId?: string;
  subject: typeof TYPE_TASK;
};

type ColumnEvent = {
  operation: {
    source: { data: ColumnElData } | null;
    target: { data: ColumnElData } | null;
  };
};

type TaskEvent = {
  operation: {
    source: { data: TaskElData } | null;
    target: { data: TaskElData } | null;
  };
};

export type TaskEventData = {
  src: TaskEventData;
  target: TaskEventData;
  insertionType: InsertionType;
  subject: typeof TYPE_TASK;
};

export type ColumnEventData = {
  src: ColumnEventData;
  target: ColumnEventData;
  insertionType: InsertionType;
  subject: typeof TYPE_COLUMN;
};

const handleError = (error: unknown) => {
  if (error instanceof Error) {
    toast.error(error.message);
  }
};

export const DnDProvider: FC<PropsWithChildren> = ({ children }) => {
  const canMoveTaskOrColumn = useCanMoveTaskOrColumn();
  const moveTask = useMoveTask();
  const moveColumn = useMoveColumn();

  return (
    <DragDropProvider
      onBeforeDragStart={(event) => {
        if (!canMoveTaskOrColumn) {
          event.preventDefault();
        }
      }}
      onDragEnd={(event) => {
        if (event.canceled) return;

        const { source, target } = (event as TaskEvent | ColumnEvent).operation;
        if (!source || !target) return;

        const srcColumnId = source.data.columnId;
        const targetColumnId = target.data.columnId;
        const insertionType = target.data.insertionType;

        if (source.data.subject === TYPE_TASK) {
          void moveTask({
            srcColumnId,
            targetColumnId,
            insertionType,
            srcTaskId: source.data.taskId || '',
            targetTaskId: (target.data as TaskElData).taskId,
          }).catch(handleError);
        } else if (source.data.subject === TYPE_COLUMN) {
          void moveColumn({
            srcColumnId,
            targetColumnId,
            insertionType,
          }).catch(handleError);
        }
      }}>
      {children}
    </DragDropProvider>
  );
};
