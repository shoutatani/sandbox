import React from "react";
import { useFakeUsers } from "./viewModels/useFakeUsers";
import { useUsers } from "./viewModels/useUsers";

export const Users: React.FC = () => {
  const { loading, error, totalUsers, allUsers, refetchUsers } = useUsers();
  const { addFakeUsers } = useFakeUsers();

  if (loading || !allUsers) {
    return <p>loading users...</p>;
  }
  if (error) {
    return <p>{`Error ${error}`}</p>;
  }

  return (
    <div>
      <p>{totalUsers} users</p>
      <button onClick={() => refetchUsers()}>Refetch Users</button>
      <button onClick={() => addFakeUsers({ variables: { count: 1 } })}>
        Add Fake Users
      </button>
      <ul>
        {allUsers.map((user) => {
          return (
            <li key={user.githubLogin}>
              <img src={user.avatar} width={48} height={48} alt="" />
              {user.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
