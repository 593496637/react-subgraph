import { gql } from '@apollo/client';

/**
 * GraphQL查询：获取WETH代币转账记录
 * 
 * 查询最新的20条WETH转账事件，按时间戳降序排列
 * 包括普通转账、存入时的铸造和提取时的销毁事件
 */
export const GET_TRANSFERS = gql`
  query GetTransfers {
    # 查询transfers实体，按区块时间戳降序排列，获取最新20条记录
    transfers(orderBy: blockTimestamp, orderDirection: desc, first: 20) {
      id                    # 唯一标识符 (交易哈希 + 日志索引)
      from                  # 发送方地址 (0x0表示代币铸造)
      to                    # 接收方地址 (0x0表示代币销毁)
      amount                # 转账金额 (单位: wei)
      blockNumber           # 区块号
      blockTimestamp        # 区块时间戳
      transactionHash       # 交易哈希
      message              # 交易附言数据
    }
  }
`;

/**
 * GraphQL查询：获取ETH存入WETH合约记录
 * 
 * 查询最新的10条ETH存入事件，按时间戳降序排列
 * 记录用户将ETH存入WETH合约获得等量WETH代币的操作
 */
export const GET_DEPOSITS = gql`
  query GetDeposits {
    # 查询deposits实体，按区块时间戳降序排列，获取最新10条记录
    deposits(orderBy: blockTimestamp, orderDirection: desc, first: 10) {
      id                    # 唯一标识符 (交易哈希 + 日志索引)
      user                  # 接收WETH代币的用户地址
      amount                # 存入的ETH数量 (单位: wei)
      blockTimestamp        # 区块时间戳
      transactionHash       # 交易哈希
      message              # 交易附言数据
    }
  }
`;