import type { Board } from '@/shared/api/board/boardApi';
import { useRef, type FC, type PropsWithChildren } from 'react';
import { TYPE_TASK, InsertionType, TYPE_COLUMN } from '../config/dndConstants';
import { DragDropProvider } from '@dnd-kit/react';
import { useCanMoveTaskOrColumnsFn } from './guards';
import { useMoveTask } from './useMoveTask';
import { toast } from 'react-toastify';
import { useMoveColumn } from './useMoveColumn';

type DnDProviderProps = {
  board: Board;
  updateBoard: (board: Board) => void;
} & PropsWithChildren;

type EventDetails = {
  columnIndex: number;
  columnId: string;
  insertionType: InsertionType;
};

type ColumnEventDetails = EventDetails & {
  subject: typeof TYPE_COLUMN;
};

type TaskEventDetails = EventDetails & {
  taskId?: string;
  taskIndex?: number;
  subject: typeof TYPE_TASK;
};

type ColumnEvent = {
  operation: {
    source: {
      data: ColumnEventDetails;
    } | null;
    target: {
      data: ColumnEventDetails;
    } | null;
  };
};

type TaskEvent = {
  operation: {
    source: { data: TaskEventDetails } | null;
    target: { data: TaskEventDetails } | null;
  };
};

type TaskEventData = {
  src: TaskEventDetails;
  target: TaskEventDetails;
  operationType: InsertionType;
  subject: typeof TYPE_TASK;
};

type ColumnEventData = {
  src: ColumnEventDetails;
  target: ColumnEventDetails;
  operationType: InsertionType;
  subject: typeof TYPE_COLUMN;
};

const hasTaskIdAndTaskIndex = (obj: {
  taskId?: string;
  taskIndex?: number;
}): obj is { taskId: string; taskIndex: number } =>
  obj.taskId !== undefined && obj.taskIndex !== undefined;

const getSrcAndTargetData = (event: TaskEvent | ColumnEvent) => {
  const { source, target } = event.operation;

  if (!source || !target) return;
  const subject = source.data.subject;

  const result = {
    subject,
    operationType: target.data.insertionType,
    src: source.data,
    target: target.data,
  };

  return subject === TYPE_COLUMN
    ? (result as ColumnEventData)
    : subject === TYPE_TASK
      ? (result as TaskEventData)
      : undefined;
};

type HandleTaskMovementProps = {
  eventData: TaskEventData;
  originalBoard: Board;
  updateBoard: (board: Board) => void;
  moveTask: ReturnType<typeof useMoveTask>;
};

const handleTaskMovement = ({
  updateBoard,
  eventData,
  originalBoard,
  moveTask,
}: HandleTaskMovementProps) => {
  const { src, target, operationType } = eventData;

  const nextBoard = structuredClone(originalBoard);

  const { columns } = nextBoard;
  const srcColumn = columns[src.columnIndex];
  const targetColumn = columns[target.columnIndex];
  const isSameColumn = src.columnId === target.columnId;

  if (!hasTaskIdAndTaskIndex(src)) return;

  switch (operationType) {
    case InsertionType.append: {
      srcColumn.tasksIds.splice(src.taskIndex, 1);
      targetColumn.tasksIds.push(src.taskId);
      break;
    }
    case InsertionType.swap: {
      if (!hasTaskIdAndTaskIndex(target)) return;
      if (isSameColumn) {
        const tmp = srcColumn.tasksIds[src.taskIndex];
        srcColumn.tasksIds[src.taskIndex] = srcColumn.tasksIds[target.taskIndex];
        srcColumn.tasksIds[target.taskIndex] = tmp;
      } else {
        targetColumn.tasksIds[target.taskIndex] = src.taskId;
        srcColumn.tasksIds[src.taskIndex] = target.taskId;
      }
      break;
    }
    case InsertionType.before: {
      if (!hasTaskIdAndTaskIndex(target)) return;
      srcColumn.tasksIds.splice(src.taskIndex, 1);

      const insertIndex =
        isSameColumn && src.taskIndex < target.taskIndex ? target.taskIndex - 1 : target.taskIndex;

      targetColumn.tasksIds.splice(insertIndex, 0, src.taskId);
    }
  }

  updateBoard(nextBoard);

  void moveTask({
    boardId: originalBoard.id,
    srcColumnId: srcColumn.id,
    targetColumnId: targetColumn.id,
    srcTaskId: src.taskId,
    targetTaskId: target.taskId,
    operationType,
  }).then((result) => {
    if (result?.ok !== true) {
      updateBoard(originalBoard);

      if (result?.error) {
        toast.error(result.error.message);
      }
    }
  });
};

type HandleColumnMovementProps = {
  eventData: ColumnEventData;
  originalBoard: Board;
  updateBoard: (board: Board) => void;
  moveColumn: ReturnType<typeof useMoveColumn>;
};

const handleColumnMovement = ({
  updateBoard,
  eventData,
  originalBoard,
  moveColumn,
}: HandleColumnMovementProps) => {
  const { src, target, operationType } = eventData;

  const nextBoard = structuredClone(originalBoard);

  const { columns } = nextBoard;
  const srcColumn = columns[src.columnIndex];
  const targetColumn = columns[target.columnIndex];

  switch (operationType) {
    case InsertionType.append: {
      columns.splice(src.columnIndex, 1);
      columns.push(srcColumn);
      break;
    }
    case InsertionType.swap: {
      [columns[target.columnIndex], columns[src.columnIndex]] = [
        columns[src.columnIndex],
        columns[target.columnIndex],
      ];

      break;
    }
    case InsertionType.before: {
      columns.splice(src.columnIndex, 1);

      const insertIndex =
        src.columnIndex < target.columnIndex ? target.columnIndex - 1 : target.columnIndex;

      columns.splice(insertIndex, 0, srcColumn);
    }
  }

  updateBoard(nextBoard);

  void moveColumn({
    boardId: originalBoard.id,
    srcColumnId: srcColumn.id,
    targetColumnId: targetColumn.id,
    operationType,
  }).then((result) => {
    if (result?.ok !== true) {
      updateBoard(originalBoard);

      if (result?.error) {
        toast.error(result.error.message);
      }
    }
  });
};

export const DnDProvider: FC<DnDProviderProps> = ({ children, updateBoard, board }) => {
  const canMoveTaskOrColumn = useCanMoveTaskOrColumnsFn();
  const boardSnapshot = useRef(structuredClone(board));
  const moveTask = useMoveTask();
  const moveColumn = useMoveColumn();

  return (
    <DragDropProvider
      onBeforeDragStart={(event) => {
        if (!canMoveTaskOrColumn()) {
          event.preventDefault();
        }
      }}
      onDragStart={() => {
        boardSnapshot.current = structuredClone(board);
      }}
      onDragEnd={(event) => {
        if (!canMoveTaskOrColumn() || event.canceled) return;

        const eventData = getSrcAndTargetData(event as TaskEvent);

        if (!eventData) return;

        if (eventData.subject === TYPE_TASK) {
          handleTaskMovement({
            updateBoard,
            eventData,
            originalBoard: boardSnapshot.current,
            moveTask,
          });

          return;
        }

        if (eventData.subject === TYPE_COLUMN) {
          handleColumnMovement({
            updateBoard,
            eventData,
            originalBoard: boardSnapshot.current,
            moveColumn,
          });
        }
      }}>
      {children}
    </DragDropProvider>
  );
};
