import { safeFetch } from '@/shared/lib/safeFetch';
import { API_URL } from '../constants';

export type Board = {
  id: string;
  authorId: string;
  title: string;
};

export type BoardDraft = Partial<Omit<Board, 'id' | 'authorId'>>;

export const boardApi = {
  async getBoards(sessionId: string, signal?: AbortSignal) {
    return await safeFetch<Board[]>(`${API_URL}/boards?sessionId=${sessionId}`, {
      signal,
    });
  },

  async createBoard(sessionId: string, board: BoardDraft, signal?: AbortSignal) {
    return await safeFetch<Board>(`${API_URL}/boards?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(board),
      signal,
    });
  },

  async updateBoard(sessionId: string, boardId: string, board: BoardDraft, signal?: AbortSignal) {
    return await safeFetch<Board>(`${API_URL}/boards/${boardId}?sessionId=${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(board),
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
