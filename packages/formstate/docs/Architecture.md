# FormState 架构文档 📚

> **面向初级程序员**：通俗易懂地解释整个库的设计和工作原理

**适合人群**: 有基础 JavaScript/TypeScript 知识的开发者
**阅读时间**: 30-40 分钟
**学习目标**: 完全理解 FormState 的架构，能够独立维护和扩展

---

## 目录

1. [核心概念](#1-核心概念)
2. [整体架构](#2-整体架构)
3. [数据流程](#3-数据流程)
4. [关键组件详解](#4-关键组件详解)
5. [常见场景演示](#5-常见场景演示)
6. [调试技巧](#6-调试技巧)

---

## 1. 核心概念

### 1.1 FormState 是什么？

**简单类比**: 想象一个智能表单管家 🤖

```
用户填写表单
    ↓
FormState 管家帮你：
  - 记住每个字段的值 📝
  - 检查输入是否合法 ✅
  - 追踪哪些字段被修改了 🔄
  - 通知 UI 更新显示 📺
```

### 1.2 核心类型 (5个)

#### 类型 1: FieldPath (字段路径)

**作用**: 用字符串表示字段的位置

```typescript
type FieldPath = string;

// 示例：
('email'); // 简单字段
('user.profile.name'); // 嵌套对象
('items[0].title'); // 数组元素
('users[0].addresses[1]'); // 多层嵌套
```

**为什么需要**: 表单可以有复杂结构，用路径字符串定位任意字段。

---

#### 类型 2: FieldValue (字段值)

```typescript
type FieldValue = unknown;

// 可以是任何值：
const values = {
	email: 'test@example.com', // 字符串
	age: 25, // 数字
	isActive: true, // 布尔值
	tags: ['foo', 'bar'], // 数组
	user: { name: 'Alice' } // 对象
};
```

---

#### 类型 3: IFieldState (字段状态)

**作用**: 描述一个字段的完整状态

```typescript
interface IFieldState<T = FieldValue> {
	value: T; // 当前值
	error: string | null; // 错误消息（null = 没有错误）
	touched: boolean; // 用户是否访问过（点击/聚焦）
	dirty: boolean; // 值是否改变了（与初始值对比）
	validating: boolean; // 是否正在验证中
}

// 示例：
const emailState: IFieldState = {
	value: 'test@example.com',
	error: null, // ✅ 没有错误
	touched: true, // 用户点击过
	dirty: true, // 已修改
	validating: false // 验证完成
};
```

**5个状态的含义**:

- **value**: 用户输入了什么
- **error**: 验证器发现的问题（例如 "Email格式不正确"）
- **touched**: 用户是否"碰过"这个字段（用于显示错误提示）
- **dirty**: 值是否和初始值不同（用于 "有未保存的更改" 提示）
- **validating**: 是否在等待异步验证结果（显示加载动画）

---

#### 类型 4: IFieldConfig (字段配置)

**作用**: 告诉 FormState 如何处理一个字段

```typescript
interface IFieldConfig<T = FieldValue> {
	defaultValue?: T; // 初始值
	validator?: IValidator<T>; // 验证器
	transformer?: ITransformer<T>; // 值转换器（格式化）
	dependencies?: FieldPath[]; // 依赖哪些字段
	validateOnChange?: boolean; // 输入时立即验证？
	validateOnBlur?: boolean; // 失焦时验证？
	validateOnComplete?: boolean; // 输入完成时验证？（防抖）
	debounceMs?: number; // 防抖延迟
}

// 示例：
const emailConfig: IFieldConfig = {
	defaultValue: '',
	validator: Validators.email(), // 验证邮箱格式
	validateOnBlur: true // 用户输入完后验证
};

const passwordConfig: IFieldConfig = {
	defaultValue: '',
	transformer: Transformers.trim(), // 自动去空格
	dependencies: ['confirmPassword'] // 依赖确认密码字段
};
```

---

#### 类型 5: IValidator (验证器)

**作用**: 检查值是否合法

```typescript
interface IValidator<T = FieldValue> {
	validate(value: T, allValues: Record<string, FieldValue>): string | null | Promise<string | null>;
	//  ↑ 返回错误消息（null = 通过）
}

// 示例：必填验证器
const requiredValidator: IValidator = {
	validate(value) {
		if (!value) {
			return 'This field is required'; // ❌ 错误
		}
		return null; // ✅ 通过
	}
};

// 示例：异步验证（检查用户名是否可用）
const usernameValidator: IValidator = {
	async validate(value) {
		const response = await fetch(`/api/check-username?name=${value}`);
		const data = await response.json();

		if (data.taken) {
			return 'Username already taken'; // ❌
		}
		return null; // ✅
	}
};
```

---

## 2. 整体架构

### 2.1 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面 (UI)                         │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐              │
│   │ <input>  │   │ <select> │   │ <button> │              │
│   └────┬─────┘   └────┬─────┘   └────┬─────┘              │
│        │ 用户输入      │              │ 点击提交             │
└────────┼──────────────┼──────────────┼──────────────────────┘
         │              │              │
         ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│              Svelte 5 响应式层 (Adapter)                    │
│                                                             │
│  useFormState() ← 返回响应式状态                            │
│    ├── values ($state)   ← Svelte 5 响应式                 │
│    ├── errors ($state)                                      │
│    └── methods (setValue, submit, ...)                     │
│                                                             │
│  订阅 FormStateManager 的变化 → 自动更新 $state            │
└──────────────────────┬──────────────────────────────────────┘
                       │ 调用核心方法
                       ▼
┌─────────────────────────────────────────────────────────────┐
│            核心状态管理器 (FormStateManager)                 │
│                                                             │
│  职责：                                                      │
│    1️⃣ 管理所有字段的值 (values)                             │
│    2️⃣ 管理所有字段的状态 (fieldStates)                      │
│    3️⃣ 执行验证逻辑                                          │
│    4️⃣ 通知订阅者（观察者模式）                              │
│                                                             │
│  关键数据结构：                                              │
│    private values: Record<string, FieldValue> = {};        │
│    private fieldStates: Map<FieldPath, IFieldState> = ...  │
│    private fieldConfigs: Map<FieldPath, IFieldConfig> = ...│
│    private observers: Set<IFormObserver> = ...             │
└──────────────┬──────────────────────────────────────────────┘
               │ 使用工具函数
               ▼
┌─────────────────────────────────────────────────────────────┐
│                  工具模块 (Utils)                            │
│                                                             │
│  PathUtils    - 路径操作（get/set 嵌套值）                  │
│  Validators   - 内置验证器                                   │
│  Transformers - 内置转换器                                   │
│  serialize    - 序列化/反序列化                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 文件组织

```
packages/formstate/
├── src/
│   ├── core/                      ← 核心逻辑（不依赖 Svelte）
│   │   ├── FormStateManager.ts   ← 🔥 核心类（600+ 行）
│   │   ├── interfaces.ts         ← TypeScript 类型定义
│   │   ├── Validators.ts         ← 内置验证器
│   │   └── Transformers.ts       ← 内置转换器
│   │
│   ├── utils/                     ← 工具函数
│   │   ├── PathUtils.ts          ← 路径操作
│   │   ├── serialize.ts          ← JSON 序列化
│   │   └── debug.ts              ← 调试日志
│   │
│   ├── adapters/                  ← 框架适配器
│   │   └── svelte/
│   │       ├── useFormState.svelte.ts   ← Svelte 5 Hook
│   │       └── components/
│   │           ├── Form.svelte          ← 表单容器
│   │           ├── FormField.svelte     ← 字段组件
│   │           └── FieldArray.svelte    ← 动态数组
│   │
│   └── index.ts                   ← 导出所有公开 API
│
└── docs/                          ← 文档
    ├── Architecture.md            ← 📖 本文档
    ├── Maintainer-Guide.md        ← 维护者指南
    └── ultra-deep-analysis-v2.md  ← 深度分析报告
```

---

## 3. 数据流程

### 3.1 用户输入 → UI 更新流程

**场景**: 用户在 Email 输入框输入 "test@example.com"

```
┌──────────────────────────────────────────────────────────────┐
│ 步骤 1: 用户在 <input> 中输入                                  │
└──────────────────────────────────────────────────────────────┘
                    │
                    ▼
    <input oninput={e => form.setValue('email', e.target.value)} />
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│ 步骤 2: 调用 FormStateManager.setValue()                     │
│                                                              │
│  setValue(path: 'email', value: 'test@example.com') {       │
│    // 2.1 应用转换器（如果有）                                │
│    const transformed = transformer.transform(value);        │
│                                                              │
│    // 2.2 更新 values                                        │
│    this.values = { ...this.values, email: transformed };   │
│                                                              │
│    // 2.3 更新 fieldStates                                   │
│    this.fieldStates.set('email', {                          │
│      value: transformed,                                    │
│      dirty: true,  // ← 值改变了                            │
│      ...                                                    │
│    });                                                      │
│                                                              │
│    // 2.4 通知观察者（Svelte Adapter）                        │
│    this.observers.forEach(observer => {                    │
│      observer.onFieldChange?.('email', transformed);       │
│    });                                                      │
│                                                              │
│    // 2.5 触发验证                                           │
│    if (validateOnChange) {                                 │
│      this.validateField('email');                          │
│    }                                                        │
│  }                                                          │
└────────────────────┬─────────────────────────────────────────┘
                     │ 观察者通知
                     ▼
┌──────────────────────────────────────────────────────────────┐
│ 步骤 3: Svelte Adapter 收到通知                               │
│                                                              │
│  const unsubscribe = manager.subscribe({                    │
│    onFieldChange: (path, value) => {                        │
│      // 3.1 更新 $state                                      │
│      state.values = manager.getValues();  ← 触发 Svelte 响应 │
│      state.fieldStatesVersion++;                            │
│    }                                                        │
│  });                                                        │
└────────────────────┬─────────────────────────────────────────┘
                     │ $state 变化
                     ▼
┌──────────────────────────────────────────────────────────────┐
│ 步骤 4: Svelte 5 自动重新渲染                                 │
│                                                              │
│  <input type="email" value={form.values.email} />          │
│         ↑ Svelte 检测到 form.values 变化，自动更新 DOM        │
└──────────────────────────────────────────────────────────────┘
                     │
                     ▼
            用户看到屏幕更新 ✅
```

---

### 3.2 异步验证流程

**场景**: 检查用户名是否已存在（需要调用 API）

```
┌─────────────────────────────────────────────────────────────┐
│ 步骤 1: 用户输入 "alice"                                     │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ 步骤 2: FormStateManager.validateField('username')         │
│                                                             │
│  async validateField(path: 'username') {                   │
│    // 2.1 设置 validating = true                           │
│    this.fieldStates.set(path, {                            │
│      ...state,                                             │
│      validating: true  ← UI 显示加载动画                   │
│    });                                                     │
│                                                             │
│    // 2.2 取消之前的验证（防止旧请求覆盖新请求）            │
│    const oldController = this.validationAbortControllers.get(path); │
│    oldController?.abort();                                 │
│                                                             │
│    // 2.3 创建新的 AbortController                          │
│    const abortController = new AbortController();         │
│    this.validationAbortControllers.set(path, abortController); │
│                                                             │
│    // 2.4 获取当前值的快照（防止异步期间值改变）            │
│    const value = this.getValue(path);                      │
│    const valuesSnapshot = structuredClone(this.values);   │
│                                                             │
│    try {                                                   │
│      // 2.5 调用验证器                                      │
│      const error = await validator.validate(value, valuesSnapshot); │
│      //                    ↑ 异步操作：可能耗时 100-500ms    │
│                                                             │
│      // 2.6 验证完成，更新状态                              │
│      if (!abortController.signal.aborted) {                │
│        this.fieldStates.set(path, {                        │
│          ...state,                                         │
│          error: error,           ← "Username already taken" │
│          validating: false       ← 隐藏加载动画             │
│        });                                                 │
│                                                             │
│        // 2.7 通知观察者                                    │
│        this.observers.forEach(observer => {                │
│          observer.onFieldValidation?.(path, error);       │
│        });                                                 │
│      }                                                     │
│    } catch (err) {                                         │
│      // 处理错误...                                         │
│    }                                                       │
│  }                                                         │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
          UI 显示错误消息 ❌
```

**关键点**:

1. **AbortController**: 用户快速输入时，取消旧请求
2. **structuredClone**: 保存值的快照，防止异步期间值被修改
3. **validating 状态**: 让 UI 显示加载动画

---

## 4. 关键组件详解

### 4.1 FormStateManager - 核心类

**职责**: 管理表单的所有状态和逻辑

#### 关键属性

```typescript
export class FormStateManager {
	// 1️⃣ 值存储：扁平化的键值对
	private values: Record<string, FieldValue> = {
		email: 'test@example.com',
		'user.name': 'Alice',
		'items[0]': { title: 'Item 1' }
	};

	// 2️⃣ 初始值：用于计算 dirty 状态
	private initialValues: Record<string, FieldValue> = {
		email: '',
		'user.name': ''
		// ...
	};

	// 3️⃣ 字段状态：Map 结构，key 是路径
	private fieldStates: Map<FieldPath, IFieldState> = new Map([
		[
			'email',
			{
				value: 'test@example.com',
				error: null,
				touched: true,
				dirty: true,
				validating: false
			}
		]
		// ...
	]);

	// 4️⃣ 字段配置：每个字段的验证、转换等规则
	private fieldConfigs: Map<FieldPath, IFieldConfig> = new Map([
		[
			'email',
			{
				validator: Validators.email(),
				validateOnBlur: true
			}
		]
		// ...
	]);

	// 5️⃣ 观察者列表：订阅变化的组件/函数
	private observers: Set<IFormObserver> = new Set([
		{
			onFieldChange: (path, value) => {
				/* Svelte Adapter */
			}
		}
	]);

	// 6️⃣ 验证控制器：管理异步验证的取消
	private validationAbortControllers: Map<FieldPath, AbortController> = new Map();

	// 7️⃣ 防抖定时器：输入完成验证
	private debounceTimers: Map<FieldPath, ReturnType<typeof setTimeout>> = new Map();
}
```

#### 关键方法

##### 方法 1: registerField() - 注册字段

```typescript
/**
 * 注册一个新字段
 *
 * 何时调用？
 * - useFormState() 初始化时，批量注册所有字段
 * - FormField 组件挂载时，动态注册单个字段
 *
 * @param path 字段路径，如 'email' 或 'user.profile.name'
 * @param config 字段配置
 */
registerField(path: FieldPath, config: IFieldConfig = {}): void {
    // 步骤 1: 保存配置
    this.fieldConfigs.set(path, config);

    // 步骤 2: 初始化状态
    const defaultValue = config.defaultValue ?? PathUtils.get(this.initialValues, path);

    this.fieldStates.set(path, {
        value: defaultValue,
        error: null,
        touched: false,
        dirty: false,
        validating: false
    });

    // 步骤 3: 设置初始值
    if (defaultValue !== undefined) {
        this.values = PathUtils.set(this.values, path, defaultValue);
        this.initialValues = PathUtils.set(this.initialValues, path, defaultValue);
    }

    // 步骤 4: 如果配置了立即验证
    if (config.validateOnMount) {
        this.validateField(path);
    }
}
```

---

##### 方法 2: setValue() - 设置值

```typescript
/**
 * 设置字段的值
 *
 * 这是最常用的方法！用户每次输入都会调用它。
 *
 * @param path 字段路径
 * @param value 新值
 * @param shouldValidate 是否触发验证（默认 true）
 */
setValue(path: FieldPath, value: FieldValue, shouldValidate = true): void {
    const config = this.fieldConfigs.get(path);

    // 🔧 步骤 1: 应用转换器（格式化）
    let transformedValue = value;
    if (config?.transformer) {
        transformedValue = config.transformer.transform(value);
        // 例如：trim() 转换器会去掉首尾空格
        // 输入: "  hello  " → 转换后: "hello"
    }

    // 📦 步骤 2: 更新 values
    // 性能优化：简单路径（如 'email'）跳过 Immer，直接浅拷贝
    if (!path.includes('.') && !path.includes('[')) {
        this.values = { ...this.values, [path]: transformedValue };
    } else {
        // 复杂路径（如 'user.profile.name'）使用 Immer 确保不可变性
        this.values = produce(this.values, draft => {
            PathUtils.setMutable(draft, path, transformedValue);
        });
    }

    // 📊 步骤 3: 更新字段状态
    const fieldState = this.getFieldState(path);
    const initialValue = PathUtils.get(this.initialValues, path);

    this.fieldStates.set(path, {
        ...fieldState,
        value: transformedValue,
        dirty: transformedValue !== initialValue  // 是否改变了？
    });

    // 📢 步骤 4: 通知观察者（触发 UI 更新）
    this.observers.forEach(observer => {
        observer.onFieldChange?.(path, transformedValue);
    });

    // ✅ 步骤 5: 验证
    if (shouldValidate) {
        if (config?.validateOnComplete) {
            // 输入完成验证（防抖）
            this.handleCompleteValidation(path, transformedValue, config);
        } else if (this.config.validateOnChange) {
            // 立即验证
            this.validateField(path);
        }
    }

    // 🔗 步骤 6: 验证依赖字段
    // 例如：修改 minPrice 后，需要重新验证 maxPrice
    this.validateDependentFields(path);
}
```

---

##### 方法 3: validateField() - 验证字段

```typescript
/**
 * 验证单个字段
 *
 * @param path 字段路径
 * @returns 错误消息（null = 通过）
 */
async validateField(path: FieldPath): Promise<FieldError> {
    const config = this.fieldConfigs.get(path);

    // 步骤 1: 如果没有验证器，直接返回
    if (!config?.validator) {
        return null;
    }

    // 步骤 2: 设置 validating = true（显示加载动画）
    const currentState = this.getFieldState(path);
    this.fieldStates.set(path, {
        ...currentState,
        validating: true
    });

    // 步骤 3: 取消之前的验证（防止旧请求覆盖）
    const oldController = this.validationAbortControllers.get(path);
    if (oldController) {
        oldController.abort();  // 取消旧请求
    }

    // 步骤 4: 创建新的取消控制器
    const abortController = new AbortController();
    this.validationAbortControllers.set(path, abortController);

    // 步骤 5: 获取当前值和所有值的快照
    const value = this.getValue(path);
    const valuesSnapshot = structuredClone(this.values);  // 防止异步期间值改变

    try {
        // 步骤 6: 调用验证器
        const error = await Promise.resolve(
            config.validator.validate(value, valuesSnapshot)
        );

        // 步骤 7: 如果没有被取消，更新状态
        if (!abortController.signal.aborted) {
            this.fieldStates.set(path, {
                ...currentState,
                error: error,
                validating: false  // 验证完成
            });

            // 步骤 8: 通知观察者
            this.observers.forEach(observer => {
                observer.onFieldValidation?.(path, error);
            });
        }

        return error;
    } catch (err) {
        // 错误处理...
        return 'Validation error';
    } finally {
        // 步骤 9: 清理
        this.validationAbortControllers.delete(path);
    }
}
```

---

### 4.2 PathUtils - 路径工具

**作用**: 操作嵌套对象，支持点号和方括号语法

#### 示例 1: get() - 获取值

```typescript
const data = {
	user: {
		profile: {
			name: 'Alice'
		}
	},
	items: [{ title: 'Item 1' }, { title: 'Item 2' }]
};

PathUtils.get(data, 'user.profile.name'); // → 'Alice'
PathUtils.get(data, 'items[0].title'); // → 'Item 1'
PathUtils.get(data, 'items[1]'); // → { title: 'Item 2' }
PathUtils.get(data, 'nonexistent'); // → undefined
```

#### 示例 2: set() - 设置值

```typescript
const data = { user: { name: 'Alice' } };

// 修改现有值
const newData1 = PathUtils.set(data, 'user.name', 'Bob');
// → { user: { name: 'Bob' } }

// 创建新路径
const newData2 = PathUtils.set(data, 'user.age', 25);
// → { user: { name: 'Alice', age: 25 } }

// 数组元素
const newData3 = PathUtils.set({ items: [] }, 'items[0]', 'First');
// → { items: ['First'] }
```

**注意**: set() 是**不可变**操作，返回新对象，原对象不变！

---

### 4.3 观察者模式 (Observer Pattern)

**目的**: 当表单状态改变时，自动通知订阅者（UI 组件）

```typescript
// 接口定义
interface IFormObserver {
	onFieldChange?(path: FieldPath, value: FieldValue): void;
	onFieldBlur?(path: FieldPath): void;
	onFieldValidation?(path: FieldPath, error: FieldError): void;
	onFormValidation?(errors: Record<FieldPath, FieldError>): void;
	onSubmit?(values: Record<string, FieldValue>): void;
}

// 订阅示例（Svelte Adapter）
const unsubscribe = manager.subscribe({
	onFieldChange: (path, value) => {
		console.log(`字段 ${path} 改变了，新值:`, value);
		// 更新 Svelte $state
		state.values = manager.getValues();
	},

	onFieldValidation: (path, error) => {
		console.log(`字段 ${path} 验证完成，错误:`, error);
		// 更新错误显示
		state.errors = manager.getErrors();
	}
});

// 使用完毕后取消订阅（防止内存泄漏）
onDestroy(() => {
	unsubscribe();
});
```

**工作原理**:

1. 组件调用 `subscribe()` 注册观察者
2. FormStateManager 保存观察者到 `Set<IFormObserver>`
3. 状态改变时，遍历所有观察者，调用对应方法
4. 组件收到通知，更新 UI

---

## 5. 常见场景演示

### 场景 1: 简单登录表单

```typescript
// 步骤 1: 创建表单
const form = useFormState({
	fields: {
		email: {
			defaultValue: '',
			validator: Validators.compose(
				Validators.required('Email is required'),
				Validators.email('Invalid email format')
			)
		},
		password: {
			defaultValue: '',
			validator: Validators.required('Password is required')
		}
	}
});

// 步骤 2: 用户输入 email
form.setValue('email', 'test@example.com');

// 内部发生了什么？
// 1. values.email = 'test@example.com'
// 2. fieldStates.get('email').dirty = true
// 3. 触发验证 → error = null（邮箱格式正确）
// 4. 通知观察者 → Svelte 更新 UI

// 步骤 3: 提交表单
const success = await form.submit(async (values) => {
	// values = { email: '...', password: '...' }
	await fetch('/api/login', {
		method: 'POST',
		body: JSON.stringify(values)
	});
});

if (success) {
	alert('Login successful!');
} else {
	// 表单有错误，自动显示错误消息
}
```

---

### 场景 2: 字段依赖验证

```typescript
const form = useFormState({
	fields: {
		minPrice: {
			defaultValue: 0,
			validator: {
				validate: (value, allValues) => {
					if (value >= allValues.maxPrice) {
						return 'Min price must be less than max price';
					}
					return null;
				}
			},
			dependencies: ['maxPrice'] // ← 依赖 maxPrice
		},
		maxPrice: {
			defaultValue: 100,
			validator: {
				validate: (value, allValues) => {
					if (value <= allValues.minPrice) {
						return 'Max price must be greater than min price';
					}
					return null;
				}
			},
			dependencies: ['minPrice'] // ← 依赖 minPrice
		}
	}
});

// 用户修改 minPrice
form.setValue('minPrice', 50);

// 内部流程：
// 1. setValue() 更新 values.minPrice = 50
// 2. validateField('minPrice') 验证通过
// 3. validateDependentFields('minPrice') 发现 maxPrice 依赖它
// 4. 自动触发 validateField('maxPrice') ✅
```

---

### 场景 3: 动态数组 (FieldArray)

```typescript
const form = useFormState({
	fields: {
		'team[0].name': { defaultValue: '' },
		'team[0].email': { defaultValue: '' }
	}
});

// 添加新成员
function addMember() {
	const index = getCurrentTeamLength();

	// 动态注册新字段
	form.registerField(`team[${index}].name`, { defaultValue: '' });
	form.registerField(`team[${index}].email`, { defaultValue: '' });
}

// 删除成员
function removeMember(index: number) {
	form.unregisterField(`team[${index}].name`);
	form.unregisterField(`team[${index}].email`);
}
```

---

## 6. 调试技巧

### 6.1 启用调试日志

```typescript
// src/utils/debug.ts
export const debug = {
	enabled: true, // ← 设置为 true

	log(...args: unknown[]) {
		if (this.enabled) {
			console.log('[FormState]', ...args);
		}
	}
};
```

**输出示例**:

```
[FormState] [setValue] path: email
[FormState] [setValue] transformed value: test@example.com
[FormState] [validateField] Validating email
[FormState] [validateField] Result: null (valid)
```

---

### 6.2 检查表单状态

在浏览器控制台：

```javascript
// 获取所有值
console.log('values:', form._manager.getValues());

// 获取所有错误
console.log('errors:', form._manager.getErrors());

// 检查特定字段状态
console.log('email state:', form._manager.getFieldState('email'));

// 检查 dirty 字段
console.log('dirty fields:', form._manager.getDirtyFields());
```

---

### 6.3 常见问题排查

#### 问题 1: 值改变了，UI 没有更新

**原因**: 观察者没有订阅或订阅被取消

**排查**:

```typescript
// 检查观察者数量
console.log('observers count:', form._manager.observers.size);

// 确保 destroy() 没有被过早调用
onDestroy(() => {
	form.destroy(); // ← 只在组件销毁时调用
});
```

---

#### 问题 2: 验证没有触发

**原因**: 可能是配置问题

**排查**:

```typescript
// 检查字段配置
console.log('config:', form._manager.fieldConfigs.get('email'));

// 检查是否启用了验证
console.log('validateOnChange:', form._manager.config.validateOnChange);
```

---

#### 问题 3: 异步验证卡住

**原因**: AbortController 没有正确清理

**排查**:

```typescript
// 检查验证控制器
console.log('validation controllers:', form._manager.validationAbortControllers.size);

// 手动取消验证
const controller = form._manager.validationAbortControllers.get('email');
controller?.abort();
```

---

## 总结

### 🎯 核心要点

1. **FormStateManager** 是核心，管理所有状态
2. **观察者模式** 连接核心和 UI
3. **PathUtils** 处理嵌套对象
4. **异步验证** 需要特殊处理（AbortController、快照）
5. **Svelte Adapter** 提供响应式 API

### 📚 进一步学习

- [Maintainer-Guide.md](./Maintainer-Guide.md) - 如何修改和扩展代码
- [ultra-deep-analysis-v2.md](./ultra-deep-analysis-v2.md) - 已知问题和优化方案
- [examples/](../../src/routes/examples/) - 实际使用示例

### 💡 理解测试

完成以下任务，证明你已经理解：

1. 用自己的话解释 `setValue()` 的完整流程
2. 画出异步验证的流程图
3. 解释为什么需要 `structuredClone()`
4. 实现一个新的验证器：`phoneNumber()`
5. 修复一个 Bug（见 ultra-deep-analysis-v2.md）

---

**编写者**: Claude
**审核者**: [待填写]
**版本**: 1.0
**最后更新**: 2024-01-12
