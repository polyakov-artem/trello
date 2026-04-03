import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/config/queries';
import { userApi } from '@/shared/api/user/userApi';

export const useUsersQuery = () => {
  const {
    data: users,
    isFetching: isFetchingUsers,
    isPending: isPendingUsers,
    error: usersError,
  } = useQuery({
    queryKey: queryKeys.users,
    queryFn: async ({ signal }) => (await userApi.getUsers({ signal })).data,
  });

  return {
    users,
    isFetchingUsers,
    isPendingUsers,
    usersError,
  };
};
