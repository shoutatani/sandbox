import { gql, useQuery } from "@apollo/client";
import { ROOT_QUERY } from "../../App";

export type User = {
  name: string;
  avatar: string;
  githubLogin: string;
};

const LISTEN_FOR_USERS = gql`
  subscription {
    newUser {
      githubLogin
      name
      avatar
    }
  }
`;

export const useUsers = () => {
  const { loading, error, data, refetch, subscribeToMore } = useQuery<{
    totalUsers: number;
    allUsers: User[];
    me?: User;
  }>(ROOT_QUERY);

  const subscribeToNewUsers = () => {
    subscribeToMore({
      document: LISTEN_FOR_USERS,
      updateQuery: (
        prev,
        { subscriptionData }: { subscriptionData: { data: { newUser: User } } }
      ) => {
        if (!subscriptionData.data) {
          return prev;
        }
        const newUser = subscriptionData.data.newUser;

        return {
          ...prev,
          allUsers: [...prev.allUsers, newUser],
          totalUsers: prev.totalUsers + 1,
        };
      },
    });
  };

  return {
    loading,
    error,
    totalUsers: data?.totalUsers,
    allUsers: data?.allUsers,
    refetchUsers: refetch,
    me: data?.me,
    subscribeToNewUsers,
  };
};
