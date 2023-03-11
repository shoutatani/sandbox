import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { ROOT_QUERY } from "../../App";
import { useUsers } from "../../Users/viewModels/useUsers";
import { useGithubAuthMutation } from "./useGithubAuthMutation";

export const useAuthorizedUser = ({
  onAuthorizationComplete,
}: {
  onAuthorizationComplete: () => void;
}) => {
  const { loading, me, refetchUsers } = useUsers();
  const [signingIn, setSigningIn] = useState(false);
  const client = useApolloClient();

  const authorizationComplete = (data: {
    githubAuth: {
      token: string;
    };
  }) => {
    localStorage.setItem("token", data.githubAuth.token);
    setSigningIn(false);
    refetchUsers();
    onAuthorizationComplete();
  };

  const { githubAuthMutation } = useGithubAuthMutation({
    onCompleted: authorizationComplete,
  });

  useEffect(() => {
    if (window.location.search.match(/code=/)) {
      setSigningIn(true);
      const code = window.location.search.replace("?code=", "");
      githubAuthMutation({ variables: { code } });
    }
  }, [githubAuthMutation]);

  const onLogout = () => {
    // localStorage.removeItem("token");
    // const data: any = client.cache.readQuery({ query: ROOT_QUERY });
    // const newData = { ...data, me: null };
    // client.cache.writeQuery({ query: ROOT_QUERY, data: newData });
    client.resetStore();
  };

  return {
    loading,
    me,
    signingIn,
    onLogout,
  };
};
