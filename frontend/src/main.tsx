// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

// 👇👇👇 把你复制的 URL 粘贴到这里 👇👇👇
const SUBGRAPH_URL =
  "https://api.studio.thegraph.com/query/119398/subgraph/version/latest";

const httpLink = new HttpLink({
  uri: SUBGRAPH_URL,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
