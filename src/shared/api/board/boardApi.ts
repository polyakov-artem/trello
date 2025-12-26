import { safeFetch } from '@/shared/lib/safeFetch';
import { API_URL } from '../constants';

export type Board = {
  id: string;
  authorId: string;
  title: string;
  columns: BoardColumn[];
};

export type BoardDraft = Omit<Board, 'id' | 'authorId' | 'columns'> & {
  columns: Array<BoardColumnDraft | BoardColumn>;
};

export type BoardColumn = {
  id: string;
  title: string;
  tasksIds: string[];
};

export type BoardColumnDraft = Omit<BoardColumn, 'id'>;

export const boardApi = {
  async getBoards(sessionId: string, signal?: AbortSignal) {
    return await safeFetch<Board[]>(`${API_URL}/boards?sessionId=${sessionId}`, {
      signal,
    });
  },

  async createBoard(sessionId: string, boardDraft: BoardDraft, signal?: AbortSignal) {
    return await safeFetch<Board>(`${API_URL}/boards?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boardDraft),
      signal,
    });
  },

  async updateBoard(
    sessionId: string,
    boardId: string,
    boardDraft: BoardDraft,
    signal?: AbortSignal
  ) {
    return await safeFetch<Board>(`${API_URL}/boards/${boardId}?sessionId=${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boardDraft),
      signal,
    });
  },

  async deleteBoard(sessionId: string, boardId: string, signal?: AbortSignal) {
    return await safeFetch<{ success: true }>(
      `${API_URL}/boards/${boardId}?sessionId=${sessionId}`,
      {
        method: 'DELETE',
        signal,
      }
    );
  },
};
