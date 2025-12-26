import { createCustomStore } from '@/shared/lib/zustandCustomStore';
import type { Board } from '@/shared/api/board/boardApi';

export const useBoardsStore = createCustomStore<Board[] | undefined>(undefined);
export const useBoardDeletionStore = createCustomStore(undefined);
export const useBoardCreationStore = createCustomStore(undefined);
export const useBoardUpdateStore = createCustomStore(undefined);
