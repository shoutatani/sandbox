import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split,
} from "@apollo/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
    connectionParams: {
      authorization: localStorage.getItem("token") || "",
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token") || "";
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
}).then(() => {
  const client = new ApolloClient({
    link: authLink.concat(splitLink),
    cache,
  });

  client.onResetStore(async () => localStorage.removeItem("token"));

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
  ]);

  root.render(
    // <React.StrictMode> // NOTE: to use polling of apollo client's bug, disabled StrictMode, https://github.com/apollographql/apollo-client/issues/9819
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
    // </React.StrictMode>
  );
});
