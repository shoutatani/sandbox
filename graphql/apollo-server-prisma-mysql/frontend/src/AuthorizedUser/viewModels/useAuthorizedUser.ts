import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useUsers } from "../../Users/viewModels/useUsers";
import { useGithubAuthMutation } from "./useGithubAuthMutation";

export const useAuthorizedUser = ({
  onAuthorizationComplete,
}: {
  onAuthorizationComplete: () => void;
}) => {
  const { loading, me, refetchUsers } = useUsers();
  const [signingIn, setSigningIn] = useState(false);

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

  return {
    loading,
    me,
    signingIn,
  };
};
