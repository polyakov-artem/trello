import { type FC } from 'react';
import { FormRegistration } from '@/features/user/create';
import { UsersList } from '@/widgets/UsersList';
import { BtnLogin } from '@/widgets/BtnLogin';
import { useSessionStore } from '@/entities/session';
import { BtnLogout } from '@/features/auth/logout';
import { BtnRemoveUser } from '@/features/user/remove';
import { RemoveUserDepsProvider } from './providers';

export const UsersPage: FC = () => {
  const session = useSessionStore.use.value();

  return (
    <RemoveUserDepsProvider>
      <div className="container mx-auto p-4 grow flex flex-col">
        <div className="max-w-[500px] self-center w-full">
          <FormRegistration className="mb-8" />
          <UsersList
            renderActions={(id) => (
              <>
                <BtnRemoveUser id={id} />
                {session?.userId === id ? <BtnLogout /> : <BtnLogin userId={id} />}
              </>
            )}
          />
        </div>
      </div>
    </RemoveUserDepsProvider>
  );
};
