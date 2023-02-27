import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorizedUser } from "./viewModels/useAuthorizedUser";

export const AuthorizedUser: React.FC = () => {
  const navigate = useNavigate();

  const onAuthorizationComplete = useCallback(() => {
    navigate("/", { replace: true });
  }, []);

  const { loading, me, signingIn } = useAuthorizedUser({
    onAuthorizationComplete,
  });

  const requestCode = () => {
    const clientId = process.env.REACT_APP_GRAPHQL_LEARNING_GITHUB_CLIENT_ID;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user`;
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  }, []);

  if (me) {
    return (
      <div>
        <img src={me.avatar} width={48} height={48} alt="" />
        <h1>{me.name}</h1>
        <button onClick={logout}>logout</button>
      </div>
    );
  }

  if (loading) {
    return <p>loading...</p>;
  }

  return (
    <button onClick={requestCode} disabled={signingIn}>
      Sign In with GitHub
    </button>
  );
};
