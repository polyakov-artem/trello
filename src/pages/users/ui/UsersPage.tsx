import { type FC } from 'react';
import { FormRegistration } from '@/features/user/createUser';
import { UsersList } from '@/widgets/UsersList';

export const UsersPage: FC = () => {
  return (
    <div className="container mx-auto p-4 grow flex flex-col">
      <div className="max-w-[500px] self-center w-full">
        <FormRegistration className="mb-8" />
        <UsersList />
      </div>
    </div>
  );
};
