import { gql } from "@apollo/client";
import React from "react";
import "./App.css";
import { AuthorizedUser } from "./AuthorizedUser";
import { Users } from "./Users";

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      ...userInfo
    }
    me {
      ...userInfo
    }
  }

  fragment userInfo on User {
    githubLogin
    name
    avatar
  }
`;

function App() {
  return (
    <div>
      <AuthorizedUser />
      <Users />;
    </div>
  );
}

export default App;
