import { type FC } from 'react';
import { FormRegistration } from '@/features/manageUser';
import { UsersList } from '@/widgets/UsersList';
import { BtnRemoveUser } from '@/widgets/BtnRemoveUser/ui/BtnRemoveUser';
import { BtnLogin } from '@/widgets/BtnLogin';
import { useSessionStore } from '@/entities/session';
import { BtnLogout } from '@/features/auth/ui/BtnLogout';

export const UsersPage: FC = () => {
  const session = useSessionStore.use.session();

  return (
    <div className="container mx-auto px-4 py-4 grow flex flex-col">
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
  );
};
