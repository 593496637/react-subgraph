# Web3数据索引与查询：基于The Graph的全栈应用实现

## 项目概述

今天我要分享的是一个完整的Web3数据索引和查询系统，它展示了如何使用The Graph Protocol来索引以太坊智能合约事件，并通过React前端进行数据可视化。

**核心技术栈：**
- 后端：The Graph Subgraph (AssemblyScript)
- 前端：React + TypeScript + Apollo Client
- 区块链：Sepolia测试网 WETH合约

## 一、架构设计思路

### 传统方式的问题
- 直接调用RPC节点效率低下
- 复杂查询需要多次API调用
- 历史数据查询困难

### The Graph解决方案
```
Smart Contract Events → Subgraph Indexing → GraphQL API → Frontend Query
```

## 二、Subgraph实现 - 数据索引层

### 2.1 数据模型设计 (schema.graphql)

```graphql
# 转账事件实体
type Transfer @entity(immutable: true) {
  id: Bytes!                    # 唯一标识符
  from: Bytes!                  # 发送方地址
  to: Bytes!                    # 接收方地址
  amount: BigInt!               # 转账金额
  blockNumber: BigInt!          # 区块号
  blockTimestamp: BigInt!       # 时间戳
  transactionHash: Bytes!       # 交易哈希
  message: Bytes!               # 交易附言
}

# 存入事件实体
type Deposit @entity(immutable: true) {
  id: Bytes!
  user: Bytes!                  # 存入用户
  amount: BigInt!               # 存入金额
  blockTimestamp: BigInt!
  transactionHash: Bytes!
  message: Bytes!
}
```

**设计要点：**
- 使用`@entity(immutable: true)`标记不可变实体
- `BigInt`类型处理大数运算
- 复合ID确保唯一性

### 2.2 事件映射配置 (subgraph.yaml)

```yaml
dataSources:
  - kind: ethereum
    name: SepoliaWeth
    network: sepolia
    source:
      address: "0xdd13E55209Fd76AfE204dBda4007C227904f0a81"
      abi: SepoliaWeth
      startBlock: 7193838
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - Transfer
        - Deposit
      eventHandlers:
        - event: Transfer(indexed address,indexed address,uint256)
          handler: handleTransfer
        - event: Deposit(indexed address,uint256)
          handler: handleDeposit
```

### 2.3 事件处理逻辑 (src/sepolia-weth.ts)

```typescript
import { Transfer, Deposit } from "../generated/schema"

export function handleTransfer(event: TransferEvent): void {
  // 创建唯一ID：交易哈希 + 日志索引
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  // 填充实体字段
  entity.from = event.params.from
  entity.to = event.params.to  
  entity.amount = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.message = event.transaction.input // 交易输入数据
  
  entity.save() // 保存到索引
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  entity.user = event.params.dst
  entity.amount = event.params.wad
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.message = event.transaction.input
  
  entity.save()
}
```

**核心处理逻辑：**
- 事件参数映射到实体字段
- 复合ID保证数据唯一性
- 自动索引区块和交易信息

## 三、前端实现 - 数据查询与展示

### 3.1 GraphQL查询定义 (queries.ts)

```typescript
export const GET_TRANSFERS = gql`
  query GetTransfers {
    transfers(orderBy: blockTimestamp, orderDirection: desc, first: 20) {
      id
      from
      to
      amount
      blockTimestamp
      transactionHash
      message
    }
  }
`

export const GET_DEPOSITS = gql`
  query GetDeposits {
    deposits(orderBy: blockTimestamp, orderDirection: desc, first: 10) {
      id
      user
      amount
      blockTimestamp
      transactionHash
      message
    }
  }
`
```

### 3.2 React组件实现 (TransferList.tsx)

```typescript
interface Transfer {
  id: string
  from: string
  to: string
  amount: string
  blockTimestamp: string
  transactionHash: string
  message: string
}

export const TransferList = () => {
  // Apollo Client Hook：自动处理加载、错误、缓存
  const { loading, error, data, refetch } = useQuery<{ transfers: Transfer[] }>(GET_TRANSFERS)

  if (loading && !data?.transfers?.length) {
    return <div>正在加载转账数据...</div>
  }

  if (error) return <div>加载失败: {error.message}</div>

  return (
    <div>
      {/* 数据展示表格 */}
      <table>
        <tbody>
          {data?.transfers.map((transfer: Transfer) => (
            <tr key={transfer.id}>
              <td>
                {/* 地址缩短显示 */}
                {transfer.from === '0x0000000000000000000000000000000000000000' 
                  ? '🏭 铸造' 
                  : `${transfer.from.substring(0, 6)}...${transfer.from.substring(transfer.from.length - 4)}`}
              </td>
              <td>
                {/* 金额单位转换：wei → WETH */}
                {parseFloat(ethers.formatUnits(transfer.amount, 18)).toFixed(4)} WETH
              </td>
              <td>
                {/* 时间戳格式化 */}
                {new Date(parseInt(transfer.blockTimestamp) * 1000).toLocaleDateString('zh-CN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

## 四、关键技术实现细节

### 4.1 数据类型处理

```typescript
// BigInt → 字符串 → 格式化显示
const formatAmount = (amount: string) => {
  return parseFloat(ethers.formatUnits(amount, 18)).toFixed(4)
}

// 十六进制附言数据解析
const parseHexMessage = (hexData: string) => {
  try {
    return ethers.toUtf8String(hexData) || '无附言'
  } catch {
    return hexData.substring(0, 20) + '...'
  }
}
```

### 4.2 实时数据刷新

```typescript
const handleRefresh = () => {
  refetch() // Apollo Client重新获取数据
}

// 乐观更新：显示加载状态但保留旧数据
const shouldShowLoading = loading && !data?.transfers?.length
```

### 4.3 错误处理与用户体验

```typescript
// 优雅的错误处理
if (error) {
  return <div className="error">加载转账数据失败: {error.message}</div>
}

// 条件加载状态
if (loading && !data?.transfers?.length) {
  return <div className="loading">正在加载转账数据...</div>
}
```

## 五、部署与调试流程

### 5.1 Subgraph部署

```bash
# 生成类型定义
yarn codegen

# 构建subgraph  
yarn build

# 部署到The Graph Studio
yarn deploy
```

### 5.2 前端开发调试

```bash
# 启动开发服务器
pnpm dev

# 类型检查
pnpm build
```

## 六、项目收获与思考

### 技术收获
1. **去中心化数据索引**：理解The Graph如何解决Web3数据查询难题
2. **事件驱动架构**：智能合约事件到结构化数据的转换
3. **GraphQL最佳实践**：类型安全的数据查询

### 架构优势
- **高效查询**：预索引数据，秒级响应
- **类型安全**：端到端TypeScript支持  
- **去中心化**：无需依赖中心化API服务

### 未来扩展
- 添加更多智能合约支持
- 实现复杂聚合查询
- 集成实时数据订阅

这个项目展示了如何构建现代Web3应用的数据层，通过The Graph实现了高效、可扩展的区块链数据查询方案。