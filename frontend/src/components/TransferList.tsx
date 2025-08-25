import { useQuery } from "@apollo/client/react";
import { GET_TRANSFERS } from "../queries";
import { ethers } from "ethers";
import { parseHexMessage } from "../utils/hexUtils";

/**
 * Transfer实体的TypeScript接口定义
 * 对应subgraph中的Transfer实体类型
 */
interface Transfer {
  id: string;                  // 唯一标识符 (交易哈希 + 日志索引)
  from: string;                // 发送方地址 (0x0表示代币铸造)
  to: string;                  // 接收方地址 (0x0表示代币销毁)
  amount: string;              // 转账金额，The Graph返回BigInt作为字符串
  blockTimestamp: string;      // 区块时间戳
  transactionHash: string;     // 交易哈希
  message: string;             // 交易附言数据
}

/**
 * WETH转账列表组件
 * 
 * 显示最新的WETH代币转账事件，包括：
 * - 普通用户间转账
 * - 存入ETH时的代币铸造 (from: 0x0)
 * - 提取ETH时的代币销毁 (to: 0x0)
 */
export const TransferList = () => {
  // 使用Apollo Client的useQuery Hook获取转账数据
  // 自动处理加载状态、错误状态和数据缓存
  const { loading, error, data, refetch } = useQuery<{ transfers: Transfer[] }>(GET_TRANSFERS);

  // 刷新数据函数
  const handleRefresh = () => {
    refetch();
  };

  // 仅在初次加载且无数据时显示加载状态
  if (loading && !data?.transfers?.length) {
    return <div className="loading">正在加载转账数据...</div>;
  }

  // 错误状态显示
  if (error) return <div className="error">加载转账数据失败: {error.message}</div>;

  // 渲染转账数据表格
  return (
    <div className={`data-section ${loading ? 'refreshing' : ''}`}>
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-icon">🔄</span>
          最新转账记录
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
        <table className="transfers-table">
        <thead>
          <tr>
            <th>发送方</th>
            <th>接收方</th>
            <th>金额 (WETH)</th>
            <th>时间</th>
            <th>附言</th>
            <th>交易详情</th>
          </tr>
        </thead>
        <tbody>
          {/* 遍历转账数据数组，为每个转账事件渲染一行 */}
          {data?.transfers.map((transfer: Transfer) => (
            <tr key={transfer.id}>
              {/* 发送方地址 - 缩短显示，hover显示完整地址 */}
              <td>
                <span 
                  className="address" 
                  title={transfer.from}
                >
                  {transfer.from === '0x0000000000000000000000000000000000000000' 
                    ? '🏭 铸造' 
                    : `${transfer.from.substring(0, 6)}...${transfer.from.substring(transfer.from.length - 4)}`}
                </span>
              </td>
              {/* 接收方地址 - 缩短显示，hover显示完整地址 */}
              <td>
                <span 
                  className="address" 
                  title={transfer.to}
                >
                  {transfer.to === '0x0000000000000000000000000000000000000000' 
                    ? '🔥 销毁' 
                    : `${transfer.to.substring(0, 6)}...${transfer.to.substring(transfer.to.length - 4)}`}
                </span>
              </td>
              {/* 转账金额 - 从wei转换为WETH单位 (18位小数) */}
              <td className="amount">
                {parseFloat(ethers.formatUnits(transfer.amount, 18)).toFixed(4)} WETH
              </td>
              {/* 交易时间 - 将时间戳转换为本地时间格式 */}
              <td className="timestamp">
                {new Date(parseInt(transfer.blockTimestamp) * 1000).toLocaleDateString('zh-CN')} 
                <br />
                {new Date(parseInt(transfer.blockTimestamp) * 1000).toLocaleTimeString('zh-CN')}
              </td>
              {/* 交易附言 - 解析十六进制为可读文本 */}
              <td>
                <span className="message" title={transfer.message}>
                  {parseHexMessage(transfer.message)}
                </span>
              </td>
              {/* Etherscan链接 - 查看完整交易详情 */}
              <td>
                <a 
                  className="etherscan-link"
                  href={`https://sepolia.etherscan.io/tx/${transfer.transactionHash}`} 
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