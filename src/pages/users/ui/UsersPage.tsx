import { useEffect, type FC } from 'react';
import { FormRegistration } from '@/features/user/createUser';
import { RemoveUserProvider } from '../providers';
import { useLoadUsers } from '@/features/user/loadUsers';
import { useUsersStore } from '@/entities/user';
import { UsersList } from '@/widgets/UsersList';

export const UsersPage: FC = () => {
  const getUsersStoreState = useUsersStore.use.getState();
  const loadUsers = useLoadUsers();

  useEffect(() => {
    if (!getUsersStoreState().value) {
      void loadUsers();
    }
  }, [getUsersStoreState, loadUsers]);

  return (
    <RemoveUserProvider>
      <div className="container mx-auto p-4 grow flex flex-col">
        <div className="max-w-[500px] self-center w-full">
          <FormRegistration className="mb-8" />
          <UsersList />
        </div>
      </div>
    </RemoveUserProvider>
  );
};
