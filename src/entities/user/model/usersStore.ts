import type { User } from '@/shared/api/user/userApi';
import { createCustomStore } from '@/shared/lib/storeUtils';

export const useUsersStore = createCustomStore<User[]>([]);
export const useUserCreationStore = createCustomStore(undefined);
export const useUserDeletionStore = createCustomStore(undefined);
export const useSessionUserStore = createCustomStore<User | undefined>(undefined);
