import { useCallback, useEffect, type FC } from 'react';
import { FormRegistration } from '@/features/user/createUser';
import { RemoveUserProvider } from '../providers';
import { useLoadUsers } from '@/features/user/loadUsers';
import { useUsersStore } from '@/entities/user';
import { useSessionStore } from '@/entities/session';
import { BtnRemoveUser } from '@/features/user/removeUser';
import { BtnLogin } from '@/features/auth/login';
import { BtnLogout } from '@/features/auth/logout';
import { UsersList } from '@/widgets/UsersList';

export const UsersPage: FC = () => {
  const users = useUsersStore.use.value();
  const isLoadingUsers = useUsersStore.use.isLoading();
  const getUsersStoreState = useUsersStore.use.getState();
  const usersError = useUsersStore.use.error();
  const sessionUserId = useSessionStore.use.value()?.userId;
  const loadUsers = useLoadUsers();

  useEffect(() => {
    if (!getUsersStoreState().value) {
      void loadUsers();
    }
  }, [getUsersStoreState, loadUsers]);

  const renderActions = useCallback(
    (userId: string) => (
      <>
        {userId === sessionUserId ? (
          <>
            <BtnRemoveUser id={userId} />
            <BtnLogout />
          </>
        ) : (
          <BtnLogin userId={userId} />
        )}
      </>
    ),
    [sessionUserId]
  );

  return (
    <RemoveUserProvider>
      <div className="container mx-auto p-4 grow flex flex-col">
        <div className="max-w-[500px] self-center w-full">
          <FormRegistration className="mb-8" />

          <UsersList
            users={users}
            isLoading={isLoadingUsers}
            errorMsg={usersError?.message}
            renderActions={renderActions}
          />
        </div>
      </div>
    </RemoveUserProvider>
  );
};
