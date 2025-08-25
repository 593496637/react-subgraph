import './App.css'
import { TransferList } from './components/TransferList'
import { DepositList } from './components/DepositList' // 👈 1. 导入 DepositList

function App() {
  return (
    <>
      <TransferList />
      <DepositList /> {/* 👈 2. 在下面渲染 DepositList */}
    </>
  )
}

export default App