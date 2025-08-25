import { useQuery } from "@apollo/client/react";
import { GET_TRANSFERS } from "../queries"; // 导入我们在第四步创建的查询
import { ethers } from "ethers";

// 为单条 transfer 数据定义 TypeScript 类型，可以获得更好的代码提示
interface Transfer {
  id: string;
  src: string;
  dst: string;
  wad: string; // The Graph 返回的 BigInt 类型通常在 JS/TS 中作为字符串处理
  blockTimestamp: string;
  transactionHash: string;
  inputData: string;
}

export const TransferList = () => {
  // useQuery 是 Apollo Client 提供的核心 Hook。
  // 它会自动处理数据获取、加载状态和错误状态。
  const { loading, error, data } = useQuery<{ transfers: Transfer[] }>(GET_TRANSFERS);

  // 1. 当数据正在加载时，显示提示信息
  if (loading) return <p>Loading transfers...</p>;

  // 2. 如果获取数据时发生错误，显示错误信息
  if (error) return <p>Error fetching transfers: {error.message}</p>;

  // 3. 成功获取数据后，渲染数据表格
  return (
    <div>
      <h1>Recent WETH Transfers (Sepolia)</h1>
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Amount (WETH)</th>
            <th>Date</th>
            <th>Transaction</th>
          </tr>
        </thead>
        <tbody>
          {/* 使用 map 函数遍历 data.transfers 数组来渲染每一行 */}
          {data?.transfers.map((transfer: Transfer) => (
            <tr key={transfer.id}>
              {/* 地址缩短显示，鼠标悬浮时显示完整地址 */}
              <td title={transfer.src}>
                {`${transfer.src.substring(0, 6)}...${transfer.src.substring(transfer.src.length - 4)}`}
              </td>
              <td title={transfer.dst}>
                {`${transfer.dst.substring(0, 6)}...${transfer.dst.substring(transfer.dst.length - 4)}`}
              </td>
              {/* WETH 有 18 位小数，使用 ethers.js 来格式化金额 */}
              <td>
                {parseFloat(ethers.formatUnits(transfer.wad, 18)).toFixed(4)}
              </td>
              {/* 时间戳是秒为单位的字符串，需要转换成日期对象来格式化 */}
              <td>
                {new Date(parseInt(transfer.blockTimestamp) * 1000).toLocaleString()}
              </td>
              <td title={transfer.inputData}>
                {/* 使用 <code> 标签更适合显示十六进制数据 */}
                <code>{`${transfer.inputData?.substring(0, 10)}...`}</code>
              </td>
              {/* 提供一个链接到 Sepolia Etherscan 查看交易详情 */}
              <td>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${transfer.transactionHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};