// src/components/DepositList.tsx

import { useQuery } from "@apollo/client/react";
import { GET_DEPOSITS } from "../queries"; // 导入我们新的查询
import { ethers } from "ethers";

interface Deposit {
  id: string;
  dst: string;
  wad: string;
  blockTimestamp: string;
  transactionHash: string;
}

interface GetDepositsData {
  deposits: Deposit[]; // 我们期望 data 对象里有一个 deposits 属性，它是一个 Deposit 对象的数组
}

export const DepositList = () => {
  const { loading, error, data } = useQuery<GetDepositsData>(GET_DEPOSITS);

  if (loading) return <p>Loading deposits...</p>;
  if (error) return <p>Error fetching deposits: {error.message}</p>;

  return (
    <div style={{ marginTop: '4rem' }}>
      <h1>Recent WETH Deposits (Sepolia)</h1>
      <table>
        <thead>
          <tr>
            <th>To</th>
            <th>Amount (WETH)</th>
            <th>Date</th>
            <th>Transaction</th>
          </tr>
        </thead>
        <tbody>
          {data?.deposits?.map((deposit: Deposit) => (
            <tr key={deposit.id}>
              <td title={deposit.dst}>
                {`${deposit.dst.substring(0, 6)}...${deposit.dst.substring(deposit.dst.length - 4)}`}
              </td>
              <td>
                {parseFloat(ethers.formatUnits(deposit.wad, 18)).toFixed(4)}
              </td>
              <td>
                {new Date(parseInt(deposit.blockTimestamp) * 1000).toLocaleString()}
              </td>
              <td>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${deposit.transactionHash}`} 
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