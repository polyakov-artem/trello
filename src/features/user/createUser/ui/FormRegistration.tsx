import type { FC } from 'react';
import { Button, Input } from 'antd';
import type { PropsWithClassName } from '@/shared/types/types';
import { AvatarSelector } from '@/entities/user';
import clsx from 'clsx';
import { useFormRegistration } from '../model/useFormRegistration';

export const FormRegistration: FC<PropsWithClassName> = ({ className }) => {
  const {
    values,
    formError,
    isCreatingUser,
    nameError,
    avatarError,
    handleInputChange,
    handleSubmit,
    isGlobalDisabled,
  } = useFormRegistration();

  return (
    <form onSubmit={handleSubmit} className={clsx('flex gap-4 flex-col', className)}>
      {formError && <p className="text-red-500">{formError}</p>}
      <div>
        <label className="font-bold mb-2 block" htmlFor="name">
          Name
        </label>

        <Input
          id="name"
          name="name"
          placeholder="Name"
          disabled={isGlobalDisabled}
          onChange={handleInputChange}
          value={values.name}
        />
        {nameError && <p className="text-red-500">{nameError}</p>}
      </div>

      <div>
        <label className="font-bold mb-2 block">Avatar</label>
        <AvatarSelector
          name="avatarId"
          checkedValue={values.avatarId}
          onChange={handleInputChange}
          error={avatarError}
        />
      </div>

      <Button
        disabled={isGlobalDisabled}
        className="self-center"
        type="primary"
        htmlType="submit"
        loading={isCreatingUser}
        iconPosition={'end'}>
        Register
      </Button>
    </form>
  );
};
