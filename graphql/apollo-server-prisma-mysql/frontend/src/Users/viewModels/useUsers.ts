import { useQuery } from "@apollo/client";
import { ROOT_QUERY } from "../../App";

export type User = {
  name: string;
  avatar: string;
  githubLogin: string;
};

export const useUsers = () => {
  const { loading, error, data, refetch } = useQuery<{
    totalUsers: number;
    allUsers: User[];
    me?: User;
  }>(ROOT_QUERY);

  return {
    loading,
    error,
    totalUsers: data?.totalUsers,
    allUsers: data?.allUsers,
    refetchUsers: refetch,
    me: data?.me,
  };
};
