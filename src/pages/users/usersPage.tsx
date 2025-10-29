import { type FC } from 'react';
import { FormRegistration } from '@/features/manageUser';
import { UsersList } from '@/widgets/UsersList';
import { BtnRemoveUser } from '@/widgets/BtnRemoveUser/ui/BtnRemoveUser';
import { BtnSwitchUser } from '@/widgets/BtnSwitchUser/ui/BtnSwitchUser';

export const UsersPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-4 grow flex flex-col">
      <div className="max-w-[500px] self-center w-full">
        <FormRegistration className="mb-8" />
        <UsersList
          renderActions={(id) => (
            <>
              <BtnRemoveUser id={id} />
              <BtnSwitchUser id={id} />
            </>
          )}
        />
      </div>
    </div>
  );
};
