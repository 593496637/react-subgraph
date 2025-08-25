import { gql } from '@apollo/client';

// 导出一个名为 GET_TRANSFERS 的 GraphQL 查询
export const GET_TRANSFERS = gql`
  # 定义查询的名称，方便调试
  query GetTransfers {
    # 'transfers' 是你在 schema.graphql 中定义的实体名称
    # (orderBy: ...) 会让最新的交易排在最前面
    # (first: 10) 会获取最新的 10 条记录
    transfers(orderBy: blockTimestamp, orderDirection: desc, first: 20) {
      # 这里列出你希望从每条 transfer 记录中获取的字段
      id
      src
      dst
      wad
      blockNumber
      blockTimestamp
      transactionHash
      inputData
    }
  }
`;

// 👇👇👇 新增下面的查询 👇👇👇
export const GET_DEPOSITS = gql`
  query GetDeposits {
    deposits(orderBy: blockTimestamp, orderDirection: desc, first: 10) {
      id
      dst
      wad
      blockTimestamp
      transactionHash
    }
  }
`;