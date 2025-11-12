<script lang="ts">
	/**
	 * 复杂嵌套的 Solidity ABI 表单
	 * 展示：tuple 中有数组，数组中有 tuple，多层递归嵌套
	 */
	import { useFormState, Form, type FormState } from '@packages/formstate/src';
	import AbiParameterField from '../abi-form/AbiParameterField.svelte';

	// 复杂的 Solidity 函数 ABI - 包含多层嵌套
	const complexABI = {
		name: 'executeBatchTransactions',
		type: 'function',
		inputs: [
			{
				name: 'transactions',
				type: 'tuple[]',
				description: '交易数组 - tuple 数组',
				components: [
					{
						name: 'to',
						type: 'address',
						description: '目标地址'
					},
					{
						name: 'value',
						type: 'uint256',
						description: '转账金额'
					},
					{
						name: 'data',
						type: 'bytes',
						description: '调用数据'
					},
					{
						name: 'signatures',
						type: 'tuple[]',
						description: '签名数组 - 嵌套的 tuple 数组',
						components: [
							{
								name: 'signer',
								type: 'address',
								description: '签名者地址'
							},
							{
								name: 'v',
								type: 'uint8'
							},
							{
								name: 'r',
								type: 'bytes32'
							},
							{
								name: 's',
								type: 'bytes32'
							}
						]
					}
				]
			},
			{
				name: 'config',
				type: 'tuple',
				description: '配置参数 - tuple 中包含数组',
				components: [
					{
						name: 'enabled',
						type: 'bool',
						description: '是否启用'
					},
					{
						name: 'allowedTokens',
						type: 'address[]',
						description: '允许的代币地址数组'
					},
					{
						name: 'limits',
						type: 'tuple[]',
						description: 'Limits - tuple 中的 tuple 数组',
						components: [
							{
								name: 'token',
								type: 'address',
								description: '代币地址'
							},
							{
								name: 'maxAmount',
								type: 'uint256',
								description: '最大金额'
							}
						]
					},
					{
						name: 'metadata',
						type: 'tuple',
						description: '元数据 - 嵌套 tuple',
						components: [
							{
								name: 'version',
								type: 'uint256'
							},
							{
								name: 'tags',
								type: 'string[]',
								description: '标签数组'
							}
						]
					}
				]
			}
		]
	};

	// 创建表单状态 - 动态生成字段配置
	const form: FormState = useFormState({
		fields: {
			transactions: {
				defaultValue: [
					{
						to: '',
						value: '',
						data: '',
						signatures: [{ signer: '', v: '', r: '', s: '' }]
					}
				]
			},
			'config.enabled': {
				defaultValue: true
			},
			'config.allowedTokens': {
				defaultValue: ['']
			},
			'config.limits': {
				defaultValue: [{ token: '', maxAmount: '' }]
			},
			'config.metadata.version': {
				defaultValue: 1
			},
			'config.metadata.tags': {
				defaultValue: ['']
			}
		}
	});

	// 提交处理
	async function handleSubmit(values: Record<string, unknown>) {
		console.log('复杂嵌套参数：', values);

		alert(`函数调用准备完成\n\n${JSON.stringify(values, null, 2)}`);
	}
</script>

<svelte:head>
	<title>复杂嵌套 ABI 表单 | FormState</title>
</svelte:head>

<div class="example-page">
	<div class="documentation">
		<h1>复杂嵌套 ABI 表单</h1>
		<p class="lead">递归渲染支持任意深度的嵌套结构</p>

		<section class="doc-section">
			<h2>嵌套结构类型</h2>
			<ul>
				<li>✅ <strong>tuple[]</strong> - 结构体数组</li>
				<li>✅ <strong>tuple 中有 array</strong> - 结构体包含数组字段</li>
				<li>✅ <strong>tuple 中有 tuple[]</strong> - 结构体包含结构体数组</li>
				<li>✅ <strong>tuple[] 中有 tuple[]</strong> - 结构体数组中嵌套结构体数组</li>
				<li>✅ <strong>无限递归深度</strong> - 支持任意层级嵌套</li>
			</ul>
		</section>

		<section class="doc-section">
			<h2>函数签名</h2>
			<pre><code
					>{`function executeBatchTransactions(
  (address to, uint256 value, bytes data, (address signer, uint8 v, bytes32 r, bytes32 s)[] signatures)[] transactions,
  (bool enabled, address[] allowedTokens, (address token, uint256 maxAmount)[] limits, (uint256 version, string[] tags) metadata) config
) external`}</code
				></pre>
		</section>

		<section class="doc-section">
			<h2>数据结构示例</h2>
			<pre><code
					>{`{
  transactions: [
    {
      to: "0x...",
      value: "1000000",
      data: "0x...",
      signatures: [
        { signer: "0x...", v: 27, r: "0x...", s: "0x..." }
      ]
    }
  ],
  config: {
    enabled: true,
    allowedTokens: ["0x..."],
    limits: [
      { token: "0x...", maxAmount: "1000000" }
    ],
    metadata: {
      version: 1,
      tags: ["batch", "transfer"]
    }
  }
}`}</code
				></pre>
		</section>
	</div>

	<div class="demo-container">
		<h2>交互演示</h2>

		<div class="form-card">
			<Form formState={form} onSubmit={handleSubmit}>
				<!-- 使用递归组件渲染所有参数 -->
				{#each complexABI.inputs as param}
					<AbiParameterField {param} path={param.name} formState={form} />
				{/each}

				<!-- 表单操作 -->
				<div class="form-actions">
					<button type="submit" class="btn-primary">生成 Calldata</button>
					<button type="button" class="btn-secondary" onclick={() => form.reset()}>重置</button>
				</div>
			</Form>
		</div>

		<!-- 数据预览 -->
		<div class="preview-card">
			<h3>表单数据预览</h3>
			<pre><code>{JSON.stringify(form.values, null, 2)}</code></pre>
		</div>
	</div>
</div>

<style>
	.example-page {
		display: grid;
		grid-template-columns: 600px 1fr;
		gap: 2rem;
		max-width: 1600px;
		margin: 0 auto;
		padding: 2rem;
		min-height: 100vh;
	}

	.documentation {
		position: sticky;
		top: 2rem;
		height: fit-content;
	}

	.documentation h1 {
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.lead {
		font-size: 1.125rem;
		color: #6b7280;
		margin-bottom: 2rem;
	}

	.doc-section {
		background: white;
		padding: 1.5rem;
		border-radius: 0.75rem;
		border: 1px solid #e5e7eb;
		margin-bottom: 1.5rem;
	}

	.doc-section h2 {
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.doc-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.doc-section li {
		padding: 0.5rem 0;
		color: #374151;
	}

	.doc-section pre {
		background: #1e293b;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin: 0;
	}

	.doc-section code {
		color: #e2e8f0;
		font-family: 'Fira Code', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
	}

	.demo-container {
		background: #f9fafb;
		padding: 2rem;
		border-radius: 1rem;
		height: fit-content;
	}

	.demo-container h2 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
	}

	.form-card {
		background: white;
		padding: 2rem;
		border-radius: 0.75rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 2px solid #e5e7eb;
	}

	.btn-primary {
		flex: 1;
		padding: 1rem 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
	}

	.btn-secondary {
		padding: 1rem 2rem;
		background: white;
		color: #374151;
		border: 2px solid #e5e7eb;
		border-radius: 0.5rem;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-secondary:hover {
		background: #f3f4f6;
	}

	.preview-card {
		background: white;
		padding: 1.5rem;
		border-radius: 0.75rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin-top: 1.5rem;
	}

	.preview-card h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #374151;
	}

	.preview-card pre {
		background: #1e293b;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin: 0;
		max-height: 400px;
		overflow-y: auto;
	}

	.preview-card code {
		color: #e2e8f0;
		font-family: 'Fira Code', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
	}

	@media (max-width: 1024px) {
		.example-page {
			grid-template-columns: 1fr;
		}

		.documentation {
			position: static;
		}
	}
</style>
