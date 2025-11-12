<script lang="ts">
	/**
	 * FormState 示例展示页面
	 * 展示各种表单使用场景
	 */
	import { base } from '$app/paths';

	interface Example {
		title: string;
		description: string;
		path: string;
		difficulty: 'beginner' | 'intermediate' | 'advanced';
		tags: string[];
	}

	const examples: Example[] = [
		{
			title: 'P0 Bug 修复验证',
			description: '⚠️ 验证5个致命Bug的修复：reset清理、依赖验证、路径设置、批量通知、并行验证',
			path: `${base}/examples/p0-bugfixes`,
			difficulty: 'advanced',
			tags: ['致命Bug', 'P0修复', '质量保证', '回归测试']
		},
		{
			title: 'Performance Test',
			description: '性能测试：批量更新、路径优化、循环依赖、异步验证竞态条件',
			path: `${base}/examples/performance-test`,
			difficulty: 'advanced',
			tags: ['性能', '优化', 'Bug修复', '测试']
		},
		{
			title: 'BigInt 序列化',
			description: '安全序列化：支持 BigInt、Date、Map、Set 等特殊类型的 JSON 序列化',
			path: `${base}/examples/bigint-serialization`,
			difficulty: 'intermediate',
			tags: ['序列化', 'BigInt', 'Web3', '类型安全']
		},
		{
			title: 'Bug Fixes Demo',
			description: '验证关键bug修复：FieldArray路径重映射、依赖字段onChange、动态字段注销',
			path: `${base}/examples/bug-fixes-demo`,
			difficulty: 'advanced',
			tags: ['Bug修复', '测试', 'FieldArray', '内存管理']
		},
		{
			title: '基础表单',
			description: '简单的登录表单，演示表单字段、验证和提交',
			path: `${base}/examples/basic-form`,
			difficulty: 'beginner',
			tags: ['验证', '基础用法']
		},
		{
			title: '动态数组',
			description: '动态添加/删除表单项，拖拽排序，如团队成员列表',
			path: `${base}/examples/dynamic-arrays`,
			difficulty: 'intermediate',
			tags: ['FieldArray', '动态字段', '拖拽排序']
		},
		{
			title: '字段依赖',
			description: '密码确认、折扣码验证等依赖其他字段的验证场景',
			path: `${base}/examples/field-dependencies`,
			difficulty: 'intermediate',
			tags: ['依赖', '级联验证', 'dependencies']
		},
		{
			title: '输入完成验证',
			description: '对比 validateOnComplete vs onChange vs onBlur 三种验证模式',
			path: `${base}/examples/complete-validation`,
			difficulty: 'intermediate',
			tags: ['验证时机', '防抖', 'UX']
		},
		{
			title: '表单持久化',
			description: '使用 localStorage 实现自动保存、恢复、导出/导入',
			path: `${base}/examples/form-persistence`,
			difficulty: 'intermediate',
			tags: ['localStorage', 'serialize', '自动保存']
		},
		{
			title: '值转换器',
			description: '使用内置和自定义 Transformers 格式化用户输入',
			path: `${base}/examples/transformers`,
			difficulty: 'beginner',
			tags: ['格式化', '转换器', 'Transformers']
		},
		{
			title: '多步表单',
			description: '分步验证、进度跟踪、步骤导航的注册表单',
			path: `${base}/examples/multi-step-form`,
			difficulty: 'advanced',
			tags: ['多步骤', 'validateFields', '向导']
		},
		{
			title: 'Solidity ABI 表单',
			description: 'Web3 场景：Solidity 函数参数输入，支持动态数组和结构体',
			path: `${base}/examples/abi-form`,
			difficulty: 'advanced',
			tags: ['Web3', 'ABI', '动态数组']
		},
		{
			title: '复杂嵌套 ABI',
			description: '递归渲染：tuple[]中嵌套tuple[]，支持无限深度',
			path: `${base}/examples/abi-form-nested`,
			difficulty: 'advanced',
			tags: ['Web3', '递归', '深度嵌套']
		},
		{
			title: '条件字段',
			description: '根据用户选择动态显示/隐藏字段',
			path: `${base}/examples/conditional-fields`,
			difficulty: 'intermediate',
			tags: ['条件渲染', '动态表单']
		},
		{
			title: 'Schema 表单',
			description: '通过 JSON Schema 自动生成表单',
			path: `${base}/examples/schema-form`,
			difficulty: 'advanced',
			tags: ['Schema', '自动生成']
		},
		{
			title: '异步验证',
			description: '实时验证用户名是否可用',
			path: `${base}/examples/async-validation`,
			difficulty: 'advanced',
			tags: ['异步', '验证']
		}
	];

	const difficultyColors = {
		beginner: 'bg-green-100 text-green-800',
		intermediate: 'bg-yellow-100 text-yellow-800',
		advanced: 'bg-red-100 text-red-800'
	};

	const difficultyLabels = {
		beginner: '初级',
		intermediate: '中级',
		advanced: '高级'
	};
</script>

<svelte:head>
	<title>FormState Examples | BiuBiu.tools</title>
	<meta name="description" content="FormState 表单库使用示例" />
</svelte:head>

<div class="examples-page">
	<header class="page-header">
		<h1>FormState 使用示例</h1>
		<p class="subtitle">强大的表单状态管理库，支持嵌套、动态字段、异步验证</p>
	</header>

	<section class="features-overview">
		<h2>核心特性</h2>
		<div class="features-grid">
			<div class="feature-card">
				<div class="feature-icon">🎯</div>
				<h3>接口先行</h3>
				<p>面向接口编程，易于扩展和测试</p>
			</div>
			<div class="feature-card">
				<div class="feature-icon">⚡</div>
				<h3>Svelte 5 Runes</h3>
				<p>使用最新的响应式 API</p>
			</div>
			<div class="feature-card">
				<div class="feature-icon">🔄</div>
				<h3>递归嵌套</h3>
				<p>支持深层对象和数组路径</p>
			</div>
			<div class="feature-card">
				<div class="feature-icon">✅</div>
				<h3>异步验证</h3>
				<p>自动防抖和取消机制</p>
			</div>
			<div class="feature-card">
				<div class="feature-icon">🎨</div>
				<h3>Headless UI</h3>
				<p>完全自定义表单外观</p>
			</div>
			<div class="feature-card">
				<div class="feature-icon">📦</div>
				<h3>可组合</h3>
				<p>灵活的组件组合方式</p>
			</div>
		</div>
	</section>

	<section class="examples-section">
		<h2>示例列表</h2>
		<div class="examples-grid">
			{#each examples as example (example.path)}
				<a href={example.path} class="example-card">
					<div class="example-header">
						<h3>{example.title}</h3>
						<span class="difficulty-badge {difficultyColors[example.difficulty]}">
							{difficultyLabels[example.difficulty]}
						</span>
					</div>
					<p class="example-description">{example.description}</p>
					<div class="example-tags">
						{#each example.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
					<div class="example-cta">查看示例 →</div>
				</a>
			{/each}
		</div>
	</section>

	<section class="quick-start">
		<h2>快速开始</h2>
		<div class="code-block">
			<pre><code
					>{`import { useFormState, Form, FormField, Validators } from '@biubiu/formstate';

const form = useFormState({
  fields: {
    email: {
      validator: Validators.compose(
        Validators.required(),
        Validators.email()
      )
    }
  }
});

<Form {form} onSubmit={handleSubmit}>
  <FormField name="email" label="Email">
    {#snippet children({ value, onInput, onBlur })}
      <input type="email" {value} oninput={e => onInput(e.target.value)} onblur={onBlur} />
    {/snippet}
  </FormField>
</Form>`}</code
				></pre>
		</div>
	</section>
</div>

<style>
	.examples-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 3rem 1.5rem;
	}

	.page-header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.page-header h1 {
		font-size: 3rem;
		font-weight: 800;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.subtitle {
		font-size: 1.25rem;
		color: #6b7280;
	}

	.features-overview,
	.examples-section,
	.quick-start {
		margin-bottom: 4rem;
	}

	.features-overview h2,
	.examples-section h2,
	.quick-start h2 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 2rem;
		text-align: center;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.feature-card {
		padding: 2rem;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 1rem;
		text-align: center;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.feature-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
	}

	.feature-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.feature-card h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.feature-card p {
		color: #6b7280;
		font-size: 0.875rem;
	}

	.examples-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	.example-card {
		display: block;
		padding: 1.5rem;
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 0.75rem;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
	}

	.example-card:hover {
		border-color: #667eea;
		box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
		transform: translateY(-2px);
	}

	.example-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.75rem;
	}

	.example-card h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
	}

	.difficulty-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.bg-green-100 {
		background-color: #d1fae5;
	}
	.text-green-800 {
		color: #065f46;
	}
	.bg-yellow-100 {
		background-color: #fef3c7;
	}
	.text-yellow-800 {
		color: #92400e;
	}
	.bg-red-100 {
		background-color: #fee2e2;
	}
	.text-red-800 {
		color: #991b1b;
	}

	.example-description {
		color: #6b7280;
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	.example-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.tag {
		padding: 0.25rem 0.75rem;
		background: #f3f4f6;
		border-radius: 0.375rem;
		font-size: 0.75rem;
		color: #374151;
	}

	.example-cta {
		color: #667eea;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.code-block {
		background: #1e293b;
		border-radius: 0.75rem;
		padding: 1.5rem;
		overflow-x: auto;
	}

	.code-block pre {
		margin: 0;
	}

	.code-block code {
		color: #e2e8f0;
		font-family: 'Fira Code', 'Monaco', 'Courier New', monospace;
		font-size: 0.875rem;
		line-height: 1.7;
	}

	@media (max-width: 768px) {
		.page-header h1 {
			font-size: 2rem;
		}

		.subtitle {
			font-size: 1rem;
		}

		.examples-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
