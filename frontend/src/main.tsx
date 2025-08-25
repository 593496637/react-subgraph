import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

// The Graph Studio中部署的subgraph的GraphQL端点URL
// 用于查询Sepolia测试网上WETH合约的事件数据
const SUBGRAPH_URL =
  "https://api.studio.thegraph.com/query/119398/subgraph/version/latest";

// 配置HTTP链接，指向subgraph的GraphQL API
const httpLink = new HttpLink({
  uri: SUBGRAPH_URL,
});

// 创建Apollo Client实例
// 用于管理GraphQL查询、缓存和状态
const client = new ApolloClient({
  link: httpLink,                    // GraphQL端点链接
  cache: new InMemoryCache(),        // 内存缓存策略
});

// 渲染React应用到DOM
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 使用Apollo Provider包裹应用，使App组件树可以访问GraphQL客户端 */}
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
