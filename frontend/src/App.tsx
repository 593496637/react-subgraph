import './App.css'
import { TransferList } from './components/TransferList'
import { DepositList } from './components/DepositList'

/**
 * 主应用组件
 * 
 * 渲染WETH相关数据的展示界面:
 * - TransferList: 显示WETH代币转账事件
 * - DepositList: 显示ETH存入WETH合约事件
 */
function App() {
  return (
    <div className="app-container">
      {/* 页面头部 */}
      <div className="page-header">
        <h1 className="page-title">WETH Analytics</h1>
        <p className="page-subtitle">实时监控 Sepolia 测试网 WETH 合约活动</p>
      </div>
      
      {/* WETH转账事件列表 */}
      <TransferList />
      
      {/* ETH存入WETH合约事件列表 */}
      <DepositList />
    </div>
  )
}

export default App