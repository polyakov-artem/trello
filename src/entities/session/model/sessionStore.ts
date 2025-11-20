import type { Session } from '@/shared/api/auth/authApi';
import { createCustomStore } from '@/shared/lib/zustandCustomStore';

export const useSessionStore = createCustomStore<Session | undefined>(undefined);
