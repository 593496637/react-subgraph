# WETH Analytics 📊

一个基于 The Graph Protocol 的 WETH 合约数据分析应用，实时监控 Sepolia 测试网上的 WETH 代币活动。

## ✨ 功能特性

### 🔄 实时数据监控
- **转账记录追踪**: 监控 WETH 代币的所有转账活动
- **存入记录分析**: 跟踪用户将 ETH 存入 WETH 合约的操作
- **实时数据刷新**: 一键刷新获取最新区块链数据

### 🎨 现代化界面
- **响应式设计**: 完美适配桌面端、平板和移动设备
- **深色主题**: 专业的深色界面设计
- **玻璃质感**: 现代化的毛玻璃效果卡片
- **平滑动画**: 丰富的交互动画和过渡效果

### 🔧 智能数据解析
- **地址简化显示**: 自动缩短以太坊地址，悬浮显示完整地址
- **附言解析**: 智能解析交易附言，支持中文、emoji 等多字节字符
- **金额格式化**: 自动转换 wei 单位为可读的 ETH/WETH 格式
- **时间本地化**: 区块时间戳转换为本地时间格式

### 🚀 性能优化
- **缓存机制**: Apollo Client 自动缓存查询结果
- **增量刷新**: 刷新时保持现有数据显示，提升用户体验
- **固定表格布局**: 防止内容变化导致的布局抖动

## 🏗️ 项目架构

```
react-subgraph/
├── frontend/                 # React 前端应用
│   ├── src/
│   │   ├── components/       # React 组件
│   │   │   ├── TransferList.tsx    # 转账记录列表
│   │   │   └── DepositList.tsx     # 存入记录列表
│   │   ├── utils/           # 工具函数
│   │   │   └── hexUtils.ts  # 十六进制解析工具
│   │   ├── queries.ts       # GraphQL 查询定义
│   │   ├── App.tsx          # 主应用组件
│   │   └── main.tsx         # 应用入口
│   └── package.json
├── my-subgraph/             # The Graph 子图
│   ├── src/
│   │   └── sepolia-weth.ts  # 事件处理器
│   ├── schema.graphql       # GraphQL 模式定义
│   ├── subgraph.yaml       # 子图配置
│   └── package.json
└── CLAUDE.md               # AI 开发指南
```

### 技术栈

**前端**:
- ⚛️ React 19 + TypeScript
- 🏗️ Vite (构建工具)
- 🌐 Apollo Client (GraphQL 客户端)
- 🔗 Ethers.js (以太坊交互)

**后端 (Subgraph)**:
- 📈 The Graph Protocol
- 🔗 AssemblyScript (事件处理)
- 🗃️ GraphQL API

**目标合约**:
- 🔗 Sepolia WETH: `0xdd13E55209Fd76AfE204dBda4007C227904f0a81`

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm (推荐) 或 yarn/npm
- Git

### 1. 克隆项目
```bash
git clone <repository-url>
cd react-subgraph
```

### 2. 安装依赖

**前端**:
```bash
cd frontend
pnpm install
```

**子图**:
```bash
cd my-subgraph
yarn install
```

### 3. 启动开发环境

**启动前端** (在 `frontend` 目录):
```bash
pnpm dev
```
访问 http://localhost:5173

**子图开发** (在 `my-subgraph` 目录):
```bash
# 生成代码类型
yarn codegen

# 构建子图
yarn build

# 本地部署测试
yarn deploy-local
```

## 📦 部署指南

### 前端部署
```bash
cd frontend
pnpm build
```
将 `dist` 目录内容部署到任何静态托管服务。

### 子图部署
1. **准备子图**:
```bash
cd my-subgraph
yarn codegen
yarn build
```

2. **部署到 The Graph Studio**:
```bash
# 首次部署需要认证
graph auth --studio <deploy-key>

# 部署子图
yarn deploy
```

## 🔧 配置说明

### 环境变量
创建 `frontend/.env` 文件:
```env
VITE_SUBGRAPH_URL=https://api.studio.thegraph.com/query/<studio-id>/<subgraph-name>/version/latest
```

### 子图配置
编辑 `my-subgraph/subgraph.yaml`:
```yaml
specVersion: 1.3.0
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum
    name: SepoliaWETH
    network: sepolia
    source:
      address: "0xdd13E55209Fd76AfE204dBda4007C227904f0a81"
      startBlock: 9054641
```

## 🎯 使用指南

### 界面功能

1. **转账记录**: 
   - 查看最新 20 条 WETH 转账
   - 包括普通转账、铸造和销毁事件
   - 显示发送方、接收方、金额、时间和附言

2. **存入记录**:
   - 查看最新 10 条 ETH 存入记录
   - 用户存入 ETH 获得 WETH 的操作
   - 显示用户地址、金额、时间和附言

3. **刷新功能**:
   - 点击刷新按钮获取最新数据
   - 刷新时保持现有数据显示
   - 动画反馈刷新状态

### 数据解析

**地址显示**:
- 自动缩短为 `0x1234...5678` 格式
- 特殊地址显示: `0x0` → 🏭 铸造 / 🔥 销毁

**附言解析**:
- 自动解析十六进制为可读文本
- 支持中文、emoji 等多字节字符
- 解析失败时显示截断的十六进制

## 🛠️ 开发指南

### 添加新功能
1. **前端组件**: 在 `frontend/src/components/` 添加新组件
2. **GraphQL 查询**: 在 `frontend/src/queries.ts` 添加查询
3. **子图实体**: 在 `my-subgraph/schema.graphql` 定义新实体
4. **事件处理**: 在 `my-subgraph/src/sepolia-weth.ts` 添加处理器

### 代码风格
- 使用 TypeScript 严格模式
- 遵循 React Hooks 最佳实践
- 组件和函数添加详细注释
- 使用语义化的命名

### 测试
```bash
# 子图测试
cd my-subgraph
yarn test

# 前端测试 (如需要)
cd frontend
pnpm test
```

## 🔍 故障排除

### 常见问题

1. **GraphQL 查询失败**:
   - 检查子图是否成功部署
   - 确认 SUBGRAPH_URL 配置正确
   - 查看浏览器网络请求错误信息

2. **数据不更新**:
   - 点击刷新按钮手动更新
   - 检查区块链网络是否有新交易
   - 确认子图同步状态

3. **构建错误**:
   - 删除 `node_modules` 重新安装依赖
   - 检查 Node.js 版本兼容性
   - 查看具体错误日志

### 日志查看
```bash
# 前端开发服务器日志
pnpm dev

# 子图构建日志
yarn build

# 子图部署日志
yarn deploy
```

## 📋 待办功能

- [ ] 添加 Withdrawal (提取) 事件监控
- [ ] 实现数据筛选和排序功能
- [ ] 添加地址详情页面
- [ ] 实现数据导出功能
- [ ] 添加图表可视化
- [ ] 支持多网络切换

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -am 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 提交 Pull Request

## 📜 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [The Graph Protocol](https://thegraph.com/) - 去中心化索引协议
- [React](https://reactjs.org/) - 用户界面库
- [Apollo GraphQL](https://www.apollographql.com/) - GraphQL 客户端
- [Ethers.js](https://ethers.org/) - 以太坊库
- [Vite](https://vitejs.dev/) - 快速构建工具

---

**Made with ❤️ and powered by The Graph Protocol**