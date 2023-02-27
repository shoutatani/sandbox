import { gql, useMutation } from "@apollo/client";
import { ROOT_QUERY } from "../../App";

export const useFakeUsers = () => {
  const ADD_FAKE_USERS_MUTATION = gql`
    mutation addFakeUsers($count: Int!) {
      addFakeUsers(count: $count) {
        githubLogin
        name
        avatar
      }
    }
  `;

  const [addFakeUsers] = useMutation(ADD_FAKE_USERS_MUTATION, {
    refetchQueries: [{ query: ROOT_QUERY }],
  });

  return { addFakeUsers };
};
