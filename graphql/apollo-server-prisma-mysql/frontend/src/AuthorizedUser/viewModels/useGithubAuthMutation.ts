import { gql, useMutation } from "@apollo/client";

const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) {
      token
    }
  }
`;

export const useGithubAuthMutation = ({
  onCompleted,
}: {
  onCompleted: (data: {
    githubAuth: {
      token: string;
    };
  }) => void;
}) => {
  const [githubAuthMutation] = useMutation(GITHUB_AUTH_MUTATION, {
    onCompleted,
  });

  return { githubAuthMutation };
};
