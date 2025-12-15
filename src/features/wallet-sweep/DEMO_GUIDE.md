# Token Sweep 功能演示指南 🚀

## 快速开始

**访问**: http://localhost:5174/apps/token-sweep

---

## 📝 演示数据

### 测试助记词（仅用于测试网！）

```
test test test test test test test test test test test junk
```

### 测试私钥（示例格式）

```
0x1234567890123456789012345678901234567890123456789012345678901234
0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd
```

### 测试目标地址

```
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0
```

---

## 🎬 完整演示流程

### Step 1: Connect Wallet ✅

1. 点击 "Connect Wallet"
2. 选择 MetaMask
3. 确认连接
4. **检查点**: 看到钱包地址和余额

---

### Step 2: Check Dependencies ✅

1. 自动检查 CREATE2 Proxy
2. 如果未部署，点击 "Deploy"
3. 按步骤完成部署
4. **检查点**: 所有依赖显示绿色 ✓

---

### Step 3: Select Tokens 🪙

#### 演示1: 选择预定义代币

1. 查看当前网络的代币列表
2. 点击 **ETH** 代币卡片（变绿色勾选）
3. 点击 **USDT** 代币卡片
4. **检查点**: Sidebar显示 "Selected Tokens: 2"

#### 演示2: 全选/取消全选

1. 点击 "Select All" 按钮
2. 观察所有代币都被选中
3. 点击 "Deselect All"
4. 观察所有选择被清除

#### 演示3: 添加自定义代币

1. 点击 "➕ Add Custom Token"
2. 填写信息：
   - Address: `0x6B175474E89094C44Da98b954EedeAC495271d0F` (DAI)
   - Symbol: `DAI`
   - Name: `Dai Stablecoin`
   - Decimals: `18`
3. 点击 "Add Token"
4. **检查点**: DAI出现在列表中，带 "CUSTOM" 标签

#### 演示4: 删除自定义代币

1. 找到刚添加的DAI代币
2. 点击 🗑️ 图标
3. 确认删除
4. **检查点**: DAI从列表中消失

#### 演示5: 持久化验证

1. 选择2-3个代币
2. 刷新页面（F5）
3. **检查点**: 选择被保留（包括自定义代币）

#### 完成Step 3

1. 确保至少选择了1个代币
2. 点击 "Continue →"
3. 进入 Step 4

---

### Step 4: Import Wallets 👛

#### 演示1: 助记词导入

1. 选择 "Mnemonic Phrase" 标签
2. 输入测试助记词：
   ```
   test test test test test test test test test test test junk
   ```
3. 选择 "Sequential" 派生
4. 设置范围：
   - Start Index: `0`
   - End Index: `9` (生成10个地址)
5. 点击 "Generate Addresses"
6. **检查点**:
   - 看到10个钱包地址
   - 每个显示派生路径（如 `m/44'/60'/0'/0/0`）
   - Sidebar显示 "Imported Wallets: 10"

#### 演示2: 私钥导入

1. 清空当前钱包（点击 "Clear All"）
2. 选择 "Private Keys" 标签
3. 粘贴测试私钥（一行一个）：
   ```
   0x1234567890123456789012345678901234567890123456789012345678901234
   0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd
   ```
4. 点击 "Import Private Keys"
5. **检查点**: 看到2个钱包地址

#### 演示3: 混合导入

1. 先导入助记词（5个地址）
2. 再导入私钥（2个地址）
3. **检查点**: 总共7个钱包，无重复

#### 演示4: 删除单个钱包

1. 点击某个钱包旁的 🗑️ 按钮
2. **检查点**: 该钱包被移除，计数减1

#### 演示5: 余额扫描UI

1. 确保有几个钱包已导入
2. 点击 "🔍 Scan Balances" 按钮
3. **检查点**:
   - 看到 "Scanning... 0%" 提示（当前版本）
   - 按钮变为禁用状态
   - （注：实际扫描功能待实现）

#### 完成Step 4

1. 确保至少有1个钱包
2. 点击 "Continue →"
3. 进入 Step 5

---

### Step 5: Confirm Sweep ✅

#### 演示1: 查看汇总信息

1. 查看 Sidebar：
   - Selected Tokens: X
   - Total Wallets: X
   - Batches: X
2. 查看选中的代币列表（带图标）

#### 演示2: 目标地址验证

1. 输入无效地址：`0x123`
2. 尝试执行
3. **检查点**: 看到错误提示 "Invalid target address"
4. 输入有效地址：`0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0`
5. 错误消失

#### 演示3: 智能过滤（需先扫描）

1. 如果在Step 4进行了余额扫描
2. 看到选项："Only sweep wallets with balance"
3. 勾选/取消勾选
4. **检查点**: 提示文本动态变化

#### 演示4: 批次信息

1. 查看 "Batch Processing" 卡片
2. 看到批次列表：
   - Batch 1: X wallet(s)
   - Batch 2: X wallet(s)
   - ...
3. **检查点**: 每批最多100个钱包

#### 演示5: 费用预估

1. 查看 "Estimated Costs" 卡片
2. 看到：
   - Transactions: X batch(es)
   - Estimated Gas: ~$XX.XX
   - Total Est. Cost: $XX.XX

#### 演示6: 执行预览

1. 确保所有信息正确：
   - ✓ 目标地址有效
   - ✓ 至少1个代币
   - ✓ 至少1个钱包
2. 点击 "Execute Sweep 🚀"
3. **检查点**: 看到执行预览弹窗
4. 预览内容：

   ```
   Ready to sweep:
   - X token(s)
   - From X wallet(s)
   - To 0x742d35...
   - In X batch(es)

   Execution will be implemented in the next phase
   ```

---

## 🎯 完整演示脚本（5分钟）

### 场景：归集10个钱包的ETH和USDT到目标地址

```
1. [Step 1] 连接钱包 (10秒)
   → 点击 Connect → 选择 MetaMask → 授权

2. [Step 2] 检查依赖 (5秒)
   → 自动检查 → 全部通过 ✓

3. [Step 3] 选择代币 (20秒)
   → 点击 ETH → 点击 USDT
   → Sidebar显示 "2 tokens"
   → Continue

4. [Step 4] 导入钱包 (30秒)
   → 选择 Mnemonic Phrase
   → 输入测试助记词
   → 范围: 0-9
   → Generate Addresses
   → 看到10个钱包
   → Continue

5. [Step 5] 确认执行 (60秒)
   → 输入目标地址: 0x742d35...
   → 查看代币列表（ETH, USDT）
   → 查看批次信息（Batch 1: 10 wallets）
   → 查看费用预估（~$10.00）
   → Execute Sweep
   → 查看预览信息
```

**总用时**: ~2分钟

---

## 🧪 测试场景

### 场景1: 最小配置

- 1个代币
- 1个钱包
- 结果: 1个批次

### 场景2: 中等配置

- 3个代币
- 50个钱包
- 结果: 1个批次

### 场景3: 大量钱包

- 2个代币
- 250个钱包（用助记词导入0-249）
- 结果: 3个批次（100+100+50）

### 场景4: 余额过滤

- 选择多个代币
- 导入20个钱包
- 扫描余额（假设10个有余额）
- 勾选"Only sweep wallets with balance"
- 结果: 仅处理10个钱包

---

## ✅ 检查清单

完成演示后，确认：

- [ ] 所有5步都能正常访问
- [ ] 代币选择功能正常
- [ ] 助记词导入功能正常
- [ ] 私钥导入功能正常
- [ ] 余额扫描按钮显示
- [ ] 目标地址验证正常
- [ ] 批次信息计算正确
- [ ] 执行预览显示正常
- [ ] 没有控制台错误
- [ ] UI响应流畅

---

## 🐛 常见问题

### Q: 导入后看不到钱包？

A: 检查控制台是否有错误，确保助记词格式正确

### Q: 扫描按钮点击没反应？

A: 正常，当前版本仅显示UI占位，实际功能待实现

### Q: 执行按钮是灰色的？

A: 检查：

1. 是否输入了有效的目标地址
2. 是否选择了至少1个代币
3. 是否导入了至少1个钱包

### Q: 刷新后选择丢失？

A: 自定义代币和代币选择应该保留，检查localStorage是否启用

---

## 📸 演示要点

**强调的功能**:

1. ✨ 简洁的5步流程
2. 🎨 美观的UI设计
3. 💾 智能的数据持久化
4. 🔄 响应式的状态更新
5. 📊 清晰的批次可视化
6. 🔒 安全的助记词处理

**当前限制**:

- ⏳ 余额扫描（UI完成，功能待实现）
- ⏳ 实际Sweep执行（待实现）
- ⏳ 交易监控（待实现）

---

## 🎉 演示结束

所有UI和交互功能都已完整实现！
准备好进行Web3集成开发。

**下一步**: 实现实际的区块链交互功能 🚀
