import type { User } from '@/shared/api/user/userApi';
import { createCustomStore } from '@/shared/lib/zustandCustomStore';

export const useUsersStore = createCustomStore<User[] | undefined>(undefined);
export const useUserCreationStore = createCustomStore(undefined);
export const useUserDeletionStore = createCustomStore(undefined);
export const useSessionUserStore = createCustomStore<User | undefined>(undefined);
