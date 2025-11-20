import type { User } from '@/shared/api/user/userApi';
import type { PropsWithClassName } from '@/shared/types/types';
import { Select } from 'antd';
import clsx from 'clsx';
import { useCallback, useMemo, type FC } from 'react';
import { getAvatarURL } from '../getAvatarURL';

export type UserSelectProps = {
  users: User[];
  isLoading?: boolean;
  isDisabled?: boolean;
  onChange: (name: string, values: string[]) => void;
  name: string;
  id?: string;
  value: string[];
} & PropsWithClassName;

export const MSG_LOADING = 'Loading, please wait...';
export const MSG_PLACEHOLDER = 'Select a person';

export const UserSelect: FC<UserSelectProps> = ({
  className,
  users,
  isLoading,
  isDisabled,
  onChange,
  id,
  name,
  value,
}) => {
  const options = useMemo(
    () => users.map(({ id, name, avatarId }) => ({ value: id, label: name, avatarId })),
    [users]
  );
  const placeholder = isLoading ? MSG_LOADING : MSG_PLACEHOLDER;
  const classes = clsx(className, 'w-full');

  const handleChange = useCallback(
    (values: string[]) => {
      onChange(name, values);
    },
    [name, onChange]
  );

  return (
    <Select
      value={value}
      disabled={isDisabled}
      loading={isLoading}
      id={id}
      className={classes}
      mode="multiple"
      placeholder={placeholder}
      onChange={handleChange}
      options={options}
      optionRender={(option) => {
        const { label, avatarId } = option.data;
        return (
          <div className="flex items-center gap-2">
            <img className="w-10 h-10" src={getAvatarURL(avatarId)} alt="" />
            <p>{label}</p>
          </div>
        );
      }}
    />
  );
};
