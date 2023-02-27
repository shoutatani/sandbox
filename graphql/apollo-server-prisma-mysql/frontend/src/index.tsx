import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

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
