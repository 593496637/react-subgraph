import { useQuery } from "@apollo/client/react";
import { GET_DEPOSITS } from "../queries";
import { ethers } from "ethers";
import { parseHexMessage } from "../utils/hexUtils";

/**
 * Deposit实体的TypeScript接口定义
 * 对应subgraph中的Deposit实体类型
 */
interface Deposit {
  id: string;                  // 唯一标识符 (交易哈希 + 日志索引)
  user: string;                // 接收WETH代币的用户地址
  amount: string;              // 存入的ETH数量，从The Graph作为字符串返回
  blockTimestamp: string;      // 区块时间戳
  transactionHash: string;     // 交易哈希
  message: string;             // 交易附言数据
}

/**
 * GraphQL查询返回数据的TypeScript接口定义
 */
interface GetDepositsData {
  deposits: Deposit[];         // deposits字段包含Deposit对象数组
}

/**
 * WETH存入列表组件
 * 
 * 显示最新的ETH存入WETH合约事件
 * 用户向WETH合约发送ETH后会获得等量WETH代币
 */
export const DepositList = () => {
  // 使用Apollo Client的useQuery Hook获取存入数据
  const { loading, error, data, refetch } = useQuery<GetDepositsData>(GET_DEPOSITS);

  // 刷新数据函数
  const handleRefresh = () => {
    refetch();
  };

  // 仅在初次加载且无数据时显示加载状态
  if (loading && !data?.deposits?.length) {
    return <div className="loading">正在加载存入数据...</div>;
  }

  // 错误状态显示
  if (error) return <div className="error">加载存入数据失败: {error.message}</div>;

  return (
    <div className={`data-section ${loading ? 'refreshing' : ''}`}>
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-icon">💰</span>
          最新存入记录
        </h2>
        <button 
          className="refresh-button" 
          onClick={handleRefresh}
          disabled={loading}
        >
          <span className="refresh-icon">{loading ? '⏳' : '🔄'}</span>
          {loading ? '刷新中...' : '刷新'}
        </button>
      </div>
      <div className="table-container">
        <table className="deposits-table">
        <thead>
          <tr>
            <th>接收方</th>
            <th>金额 (WETH)</th>
            <th>时间</th>
            <th>附言</th>
            <th>交易详情</th>
          </tr>
        </thead>
        <tbody>
          {/* 遍历存入数据数组，为每个存入事件渲染一行 */}
          {data?.deposits?.map((deposit: Deposit) => (
            <tr key={deposit.id}>
              {/* 接收WETH的地址 - 缩短显示，hover显示完整地址 */}
              <td>
                <span 
                  className="address" 
                  title={deposit.user}
                >
                  {`${deposit.user.substring(0, 6)}...${deposit.user.substring(deposit.user.length - 4)}`}
                </span>
              </td>
              {/* 存入金额 - 从wei转换为ETH单位 (18位小数) */}
              <td className="amount">
                {parseFloat(ethers.formatUnits(deposit.amount, 18)).toFixed(4)} ETH
              </td>
              {/* 存入时间 - 将时间戳转换为本地时间格式 */}
              <td className="timestamp">
                {new Date(parseInt(deposit.blockTimestamp) * 1000).toLocaleDateString('zh-CN')} 
                <br />
                {new Date(parseInt(deposit.blockTimestamp) * 1000).toLocaleTimeString('zh-CN')}
              </td>
              {/* 交易附言 - 解析十六进制为可读文本 */}
              <td>
                <span className="message" title={deposit.message}>
                  {parseHexMessage(deposit.message)}
                </span>
              </td>
              {/* Etherscan链接 - 查看完整交易详情 */}
              <td>
                <a 
                  className="etherscan-link"
                  href={`https://sepolia.etherscan.io/tx/${deposit.transactionHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  📋 查看
                </a>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};