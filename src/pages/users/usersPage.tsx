import { ScreenLoader } from '@/shared/ui/ScreenLoader/ScreenLoader';
import { useUsersStore } from '@/entities/user/model/usersStore';
import { ErrorWithReloadBtn } from '@/widgets/ErrorWithReload/ErrorWithReloadBtn';
import type { FC } from 'react';
import { FormRegistration } from '@/features/manageUser';
import { UsersList } from '@/widgets/UsersList/UsersList';
import { errorAdvices } from '@/shared/constants/errorMsgs';

export const UsersPage: FC = () => {
  const isLoadingUsers = useUsersStore.use.isLoadingUsers();
  const usersLoadingError = useUsersStore.use.usersLoadingError();

  let content;

  if (isLoadingUsers) {
    content = <ScreenLoader />;
  } else if (usersLoadingError) {
    content = <ErrorWithReloadBtn title={usersLoadingError} subtitle={errorAdvices.tryAgain} />;
  } else {
    content = (
      <>
        <div className="max-w-[500px] self-center w-full">
          <FormRegistration className="mb-8" />
          <UsersList />
        </div>
      </>
    );
  }

  return <div className="container mx-auto px-4 py-4 grow flex flex-col">{content}</div>;
};
