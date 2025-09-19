import { ScreenLoader } from '@/shared/ui/ScreenLoader/ScreenLoader';
import { useUsersStore } from '@/entities/user/model/usersStore';
import { ErrorWithReloadBtn } from '@/widgets/ErrorWithReload/ErrorWithReloadBtn';
import { ERROR_SUBTITLES } from '@/shared/constants/errorMsgs';
import type { FC } from 'react';
import { FormRegistration } from '@/features/manageUser';

export const UsersPage: FC = () => {
  const isLoadingUsers = useUsersStore.use.isLoadingUsers();
  const usersLoadingError = useUsersStore.use.usersLoadingError();

  let content;

  if (isLoadingUsers) {
    content = <ScreenLoader />;
  } else if (usersLoadingError) {
    content = <ErrorWithReloadBtn title={usersLoadingError} subtitle={ERROR_SUBTITLES.DEFAULT} />;
  } else {
    content = <FormRegistration className={'max-w-[500px] self-center w-full'} />;
  }

  return <div className="container mx-auto px-4 py-4 grow flex flex-col">{content}</div>;
};
