import {
  createBaseInitialState,
  createCancelReqControls,
  createCustomStore,
  type SetCancelReqFn,
} from '@/shared/lib/zustandCustomStore';
import type { Board } from '@/shared/api/board/boardApi';
import { create } from 'zustand';
import type { FetchError } from '@/shared/lib/safeFetch';

export const useBoardDeletionStore = createCustomStore(undefined);
export const useBoardCreationStore = createCustomStore(undefined);
export const useBoardUpdateStore = createCustomStore(undefined);

export type BoardsValue = {
  entities: Record<string, Board>;
  ids: string[];
};

export const createEmptyBoardsValue = (): BoardsValue => ({
  entities: {},
  ids: [],
});

export type BoardsStoreState = {
  value: BoardsValue;
  isLoading: boolean;
  error: FetchError | undefined;

  actions: {
    setCancelReqFn: SetCancelReqFn;
    cancelRequest: () => void;
    reset: () => void;
    getState: () => BoardsStoreState;
    setState: {
      (
        partial:
          | BoardsStoreState
          | Partial<BoardsStoreState>
          | ((state: BoardsStoreState) => BoardsStoreState | Partial<BoardsStoreState>),
        replace?: false
      ): void;
      (
        state: BoardsStoreState | ((state: BoardsStoreState) => BoardsStoreState),
        replace: true
      ): void;
    };

    setBoards: (boards: Board[]) => void;
    upsertBoard: (board: Board) => void;
    updateBoard: (board: Board) => void;
    removeBoard: (id: string) => void;
  };
};

export const createBoardsStore = () => {
  const { setCancelReqFn, cancelRequest } = createCancelReqControls();

  return create<BoardsStoreState>((set, get) => ({
    ...createBaseInitialState<BoardsValue>(createEmptyBoardsValue()),

    actions: {
      setCancelReqFn,
      cancelRequest,
      getState: get,
      setState: set,

      reset: () => {
        get().actions.cancelRequest();
        set(createBaseInitialState(createEmptyBoardsValue()));
      },

      setBoards: (boards) =>
        set((state) => {
          const entities: Record<string, Board> = {};
          const ids: string[] = [];

          for (const board of boards) {
            entities[board.id] = board;
            ids.push(board.id);
          }

          return {
            ...state,
            value: { entities, ids },
          };
        }),

      upsertBoard: (board) => {
        const prevIds = get().value.ids;
        const prevEntities = get().value.entities;
        const exists = !!prevEntities[board.id];

        set({
          value: {
            entities: { ...prevEntities, [board.id]: board },
            ids: exists ? prevIds : [...prevIds, board.id],
          },
        });
      },

      updateBoard: (board) => {
        const exists = !!get().value.entities[board.id];

        if (!exists) return;

        set({
          value: {
            entities: { ...get().value.entities, [board.id]: board },
            ids: get().value.ids,
          },
        });
      },

      removeBoard: (id) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _, ...rest } = state.value.entities;

          return {
            ...state,
            value: {
              entities: rest,
              ids: state.value.ids.filter((x) => x !== id),
            },
          };
        }),
    },
  }));
};

export const useBoardsStore = createBoardsStore();
