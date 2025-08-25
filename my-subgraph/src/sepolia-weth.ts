// 导入从智能合约生成的事件类型
import {
  Approval as ApprovalEvent,
  Transfer as TransferEvent,
  Deposit as DepositEvent,
  Withdrawal as WithdrawalEvent
} from "../generated/SepoliaWETH/SepoliaWETH"
// 导入GraphQL schema中定义的实体类型
import { Approval, Transfer, Deposit, Withdrawal } from "../generated/schema"

/**
 * 处理WETH代币授权事件
 * 当用户调用approve()函数授权其他地址使用其WETH代币时触发
 * @param event ApprovalEvent - 包含授权详情的区块链事件
 */
export function handleApproval(event: ApprovalEvent): void {
  // 创建唯一的实体ID：交易哈希 + 日志索引
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  // 填充事件数据
  entity.owner = event.params.src    // 授权人地址
  entity.spender = event.params.guy  // 被授权人地址
  entity.amount = event.params.wad   // 授权金额

  // 填充区块链元数据
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  // 保存实体到The Graph存储
  entity.save()
}

/**
 * 处理WETH代币转账事件
 * 当WETH代币在地址间转移时触发（包括存入和提取时的铸造/销毁）
 * @param event TransferEvent - 包含转账详情的区块链事件
 */
export function handleTransfer(event: TransferEvent): void {
  // 创建唯一的实体ID：交易哈希 + 日志索引
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  // 填充事件数据
  entity.from = event.params.src     // 发送方地址 (0x0表示铸造)
  entity.to = event.params.dst       // 接收方地址 (0x0表示销毁)
  entity.amount = event.params.wad   // 转账金额

  // 填充区块链元数据
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  // 保存交易附言数据，用于显示用户自定义消息
  entity.message = event.transaction.input

  // 保存实体到The Graph存储
  entity.save()
}

/**
 * 处理ETH存入WETH合约事件
 * 当用户向WETH合约发送ETH获得等量WETH代币时触发
 * @param event DepositEvent - 包含存入详情的区块链事件
 */
export function handleDeposit(event: DepositEvent): void {
  // 创建唯一的实体ID：交易哈希 + 日志索引
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  // 填充事件数据
  entity.user = event.params.dst     // 接收WETH的用户地址
  entity.amount = event.params.wad   // 存入的ETH数量

  // 填充区块链元数据
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  // 保存交易附言数据，用于显示用户自定义消息
  entity.message = event.transaction.input

  // 保存实体到The Graph存储
  entity.save()
}

/**
 * 处理WETH提取为ETH事件
 * 当用户销毁WETH代币提取等量ETH时触发
 * @param event WithdrawalEvent - 包含提取详情的区块链事件
 */
export function handleWithdrawal(event: WithdrawalEvent): void {
  // 创建唯一的实体ID：交易哈希 + 日志索引
  let entity = new Withdrawal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  // 填充事件数据
  entity.user = event.params.src     // 提取ETH的用户地址
  entity.amount = event.params.wad   // 提取的ETH数量

  // 填充区块链元数据
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  // 保存实体到The Graph存储
  entity.save()
}
