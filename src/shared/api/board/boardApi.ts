import { safeFetch } from '@/shared/lib/safeFetch';
import { API_URL } from '../constants';
import type { Task, TaskDraft } from '@/shared/types/types';

export type Board = {
  id: string;
  authorId: string;
  title: string;
  columns: BoardColumn[];
};

export type BoardColumn = {
  id: string;
  title: string;
  tasksIds: string[];
};

export type GetBoardsProps = {
  sessionId: string;
  signal?: AbortSignal;
};

export type BoardDraft = {
  title?: string;
};

export type ColumnDraft = {
  title?: string;
};

export type CreateBoardProps = {
  sessionId: string;
  boardDraft: BoardDraft;
  signal?: AbortSignal;
};

export type ChangeBoardTitleProps = {
  sessionId: string;
  boardId: string;
  boardDraft: BoardDraft;
  signal?: AbortSignal;
};

export type DeleteBoardProps = {
  sessionId: string;
  boardId: string;
  signal?: AbortSignal;
};

export type AddBoardColumnProps = {
  sessionId: string;
  boardId: string;
  columnDraft: ColumnDraft;
  signal?: AbortSignal;
};

export type DeleteBoardColumnProps = {
  sessionId: string;
  boardId: string;
  columnId: string;
  deleteTasks?: boolean;
  signal?: AbortSignal;
};

export type ChangeBoardColumnTitleProps = {
  sessionId: string;
  boardId: string;
  columnId: string;
  columnDraft: ColumnDraft;
  signal?: AbortSignal;
};

export type CreateColumnTaskProps = {
  sessionId: string;
  boardId: string;
  columnId: string;
  taskDraft: TaskDraft;
  signal?: AbortSignal;
};

export enum InsertionType {
  swap = 'swap',
  before = 'before',
  append = 'append',
}

export type MoveBoardTaskBodyProps = {
  srcColumnId: string;
  targetColumnId: string;
  srcTaskId: string;
  targetTaskId?: string;
  operationType: InsertionType;
};

export type MoveBoardTaskProps = {
  boardId: string;
  sessionId: string;
  signal?: AbortSignal;
} & MoveBoardTaskBodyProps;

export type MoveBoardColumnBodyProps = {
  srcColumnId: string;
  targetColumnId: string;
  operationType: InsertionType;
};

export type MoveBoardColumnProps = {
  boardId: string;
  sessionId: string;
  signal?: AbortSignal;
} & MoveBoardColumnBodyProps;

export const boardApi = {
  async getBoards({ sessionId, signal }: GetBoardsProps) {
    return await safeFetch<Board[]>(`${API_URL}/boards?sessionId=${sessionId}`, {
      signal,
    });
  },

  async createBoard({ sessionId, boardDraft, signal }: CreateBoardProps) {
    return await safeFetch<Board>(`${API_URL}/boards?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boardDraft),
      signal,
    });
  },

  async changeBoardTitle({ sessionId, boardId, boardDraft, signal }: ChangeBoardTitleProps) {
    return await safeFetch<Board>(`${API_URL}/boards/${boardId}?sessionId=${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boardDraft),
      signal,
    });
  },

  async deleteBoard({ sessionId, boardId, signal }: DeleteBoardProps) {
    return await safeFetch<{ success: true }>(
      `${API_URL}/boards/${boardId}?sessionId=${sessionId}`,
      {
        method: 'DELETE',
        signal,
      }
    );
  },

  async createBoardColumn({ sessionId, boardId, columnDraft, signal }: AddBoardColumnProps) {
    return await safeFetch<Board>(`${API_URL}/boards/${boardId}/columns?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(columnDraft),
      signal,
    });
  },

  async deleteBoardColumn({
    sessionId,
    boardId,
    columnId,
    signal,
    deleteTasks,
  }: DeleteBoardColumnProps) {
    return await safeFetch<{ board: Board; tasks: Task[] }>(
      `${API_URL}/boards/${boardId}/columns/${columnId}?sessionId=${sessionId}${deleteTasks ? '&deleteTasks=true' : ''}`,
      {
        method: 'DELETE',
        signal,
      }
    );
  },

  async changeBoardColumnTitle({
    sessionId,
    boardId,
    columnId,
    columnDraft,
    signal,
  }: ChangeBoardColumnTitleProps) {
    return await safeFetch<Board>(
      `${API_URL}/boards/${boardId}/columns/${columnId}?sessionId=${sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(columnDraft),
        signal,
      }
    );
  },

  async createColumnTask({
    sessionId,
    boardId,
    columnId,
    taskDraft,
    signal,
  }: CreateColumnTaskProps) {
    return await safeFetch<{ board: Board; task: Task }>(
      `${API_URL}/boards/${boardId}/columns/${columnId}/tasks?sessionId=${sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(taskDraft),
        signal,
      }
    );
  },

  async moveBoardTask({ sessionId, signal, boardId, ...bodyProps }: MoveBoardTaskProps) {
    return await safeFetch<Board>(
      `${API_URL}/boards/${boardId}/move/tasks?sessionId=${sessionId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyProps),
        signal,
      }
    );
  },

  async moveBoardColumn({ sessionId, signal, boardId, ...bodyProps }: MoveBoardColumnProps) {
    return await safeFetch<Board>(
      `${API_URL}/boards/${boardId}/move/columns?sessionId=${sessionId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyProps),
        signal,
      }
    );
  },
};
