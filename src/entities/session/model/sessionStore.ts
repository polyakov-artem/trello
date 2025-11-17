import type { Session } from '@/shared/api/auth/authApi';
import { createCustomStore } from '@/shared/lib/storeUtils';

export const useSessionStore = createCustomStore<Session | undefined>(undefined);
