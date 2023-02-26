type Credentials = {
  client_id: string;
  client_secret: string;
  code: string;
};

type GitHubAuthResponse = {
  access_token: string;
};

const requestGitHubToken = async (credentials: Credentials) => {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  });
  try {
    return (await response.json()) as GitHubAuthResponse;
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};

type GitHubUser = {
  message?: string;
  access_token: string;
  avatar_url: string;
  login: string;
  name: string;
};

const reuquestGitHubUserAccount = async (token: string) => {
  const response = await fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  try {
    return (await response.json()) as GitHubUser;
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};

export const authorizeWithGitHub = async (credentials: Credentials) => {
  const { access_token } = await requestGitHubToken(credentials);
  const gitHubUser = await reuquestGitHubUserAccount(access_token);

  return { ...gitHubUser, access_token };
};
