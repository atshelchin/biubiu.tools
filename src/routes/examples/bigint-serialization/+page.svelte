<script lang="ts">
	/**
	 * BigInt & 特殊类型序列化测试
	 * 验证 serialize/deserialize 可以正确处理 BigInt、Date、Map、Set 等
	 */
	import { useFormState, safeStringify, safeParse } from '@packages/formstate/src';
	import { onDestroy } from 'svelte';

	// 包含各种特殊类型的表单
	const form = useFormState({
		fields: {
			// BigInt - 典型的区块链应用场景
			tokenAmount: {
				defaultValue: 1234567890123456789012345678901234567890n
			},
			gasLimit: {
				defaultValue: 21000n
			},

			// Date
			createdAt: {
				defaultValue: new Date('2024-01-01')
			},

			// 普通值
			username: {
				defaultValue: 'alice'
			},
			balance: {
				defaultValue: 100.5
			}
		}
	});

	let serialized = $state('');
	let deserialized = $state('');
	let error = $state('');
	let testResult = $state('');

	function testSerialization() {
		try {
			error = '';

			// 1. 序列化
			serialized = form._manager.serialize();
			console.log('Serialized:', serialized);

			// 2. 反序列化
			const parsed = safeParse(serialized);
			deserialized = safeStringify(parsed, 2);
			console.log('Deserialized:', parsed);

			// 3. 验证 BigInt 是否正确还原
			const originalTokenAmount = form.getValue('tokenAmount');
			const parsedTokenAmount = parsed.values.tokenAmount;

			if (typeof parsedTokenAmount === 'bigint' && parsedTokenAmount === originalTokenAmount) {
				testResult = '✅ BigInt 序列化/反序列化成功！';
			} else {
				testResult = `❌ BigInt 丢失：原始=${originalTokenAmount}, 还原=${parsedTokenAmount}`;
			}
		} catch (err) {
			error = err instanceof Error ? err.message : String(err);
			testResult = `❌ 序列化失败`;
		}
	}

	function testNativeJSONStringify() {
		try {
			error = '';
			// 尝试使用原生 JSON.stringify（应该失败）
			const values = form._manager.getValues();
			JSON.stringify(values);
			testResult = '❌ 原生 JSON.stringify 应该失败但成功了';
		} catch (err) {
			testResult = '✅ 原生 JSON.stringify 正确抛出错误';
			error = err instanceof Error ? err.message : String(err);
		}
	}

	// 测试案例：复杂嵌套对象
	const complexData = {
		user: {
			id: 123n,
			name: 'Alice',
			balance: 1000000000000000000n, // 1 ETH in wei
			createdAt: new Date(),
			tags: new Set(['verified', 'premium']),
			metadata: new Map([
				['country', 'US'],
				['tier', 'gold']
			])
		},
		transactions: [
			{
				id: 1n,
				amount: 50000000000000000n, // 0.05 ETH
				timestamp: new Date('2024-01-15')
			},
			{
				id: 2n,
				amount: 100000000000000000n, // 0.1 ETH
				timestamp: new Date('2024-01-20')
			}
		]
	};

	let complexSerialized = $state('');
	let complexDeserialized = $state('');
	let complexTestResult = $state('');

	function testComplexSerialization() {
		try {
			// 序列化
			complexSerialized = safeStringify(complexData, 2);

			// 反序列化
			const restored = safeParse(complexSerialized);
			complexDeserialized = JSON.stringify(restored, null, 2);

			// 验证
			const checks = [
				typeof restored.user.id === 'bigint',
				restored.user.id === 123n,
				restored.user.balance === 1000000000000000000n,
				restored.user.createdAt instanceof Date,
				restored.user.tags instanceof Set,
				restored.user.metadata instanceof Map,
				restored.transactions[0].amount === 50000000000000000n
			];

			if (checks.every(Boolean)) {
				complexTestResult = '✅ 所有特殊类型都正确还原！';
			} else {
				complexTestResult = '❌ 部分类型还原失败';
			}
		} catch (err) {
			complexTestResult = `❌ 失败: ${err}`;
		}
	}

	onDestroy(() => {
		form.destroy();
	});
</script>

<div class="bigint-test">
	<h1>BigInt & 特殊类型序列化测试</h1>
	<p class="subtitle">验证 serialize/deserialize 可以正确处理 BigInt、Date、Map、Set 等特殊类型</p>

	<!-- 警告说明 -->
	<div class="warning">
		<h3>⚠️ 为什么需要安全序列化？</h3>
		<p>
			原生 <code>JSON.stringify()</code> 遇到 BigInt 会抛出错误：<br />
			<code>"TypeError: Do not know how to serialize a BigInt"</code>
		</p>
		<p>在区块链、金融应用中，BigInt 是常见类型（如 wei、satoshi 等），必须正确处理。</p>
	</div>

	<!-- Test 1: 表单序列化 -->
	<section class="test-section">
		<h2>测试 1: 表单序列化（包含 BigInt）</h2>

		<div class="form-display">
			<h4>当前表单值：</h4>
			<table>
				<tbody>
					<tr>
						<td>tokenAmount:</td>
						<td><code>{String(form.getValue('tokenAmount'))}</code></td>
						<td class="type-badge bigint">BigInt</td>
					</tr>
					<tr>
						<td>gasLimit:</td>
						<td><code>{String(form.getValue('gasLimit'))}</code></td>
						<td class="type-badge bigint">BigInt</td>
					</tr>
					<tr>
						<td>createdAt:</td>
						<td><code>{form.getValue('createdAt')?.toString()}</code></td>
						<td class="type-badge date">Date</td>
					</tr>
					<tr>
						<td>username:</td>
						<td><code>{form.getValue('username')}</code></td>
						<td class="type-badge string">String</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="buttons">
			<button onclick={testSerialization}>测试安全序列化</button>
			<button onclick={testNativeJSONStringify} class="danger">测试原生 JSON.stringify</button>
		</div>

		{#if testResult}
			<div class="test-result">
				<strong>结果：</strong>{testResult}
			</div>
		{/if}

		{#if error}
			<div class="error-box">
				<strong>错误：</strong>
				<code>{error}</code>
			</div>
		{/if}

		{#if serialized}
			<div class="code-display">
				<h4>序列化后（JSON 字符串）：</h4>
				<pre><code>{serialized}</code></pre>
			</div>
		{/if}

		{#if deserialized}
			<div class="code-display">
				<h4>反序列化后（还原对象）：</h4>
				<pre><code>{deserialized}</code></pre>
			</div>
		{/if}
	</section>

	<!-- Test 2: 复杂对象 -->
	<section class="test-section">
		<h2>测试 2: 复杂嵌套对象</h2>
		<p class="description">包含 BigInt、Date、Map、Set 的深层嵌套结构</p>

		<button onclick={testComplexSerialization}>测试复杂对象</button>

		{#if complexTestResult}
			<div class="test-result">
				<strong>结果：</strong>{complexTestResult}
			</div>
		{/if}

		{#if complexSerialized}
			<div class="code-display">
				<h4>原始对象（序列化后）：</h4>
				<pre><code>{complexSerialized}</code></pre>
			</div>
		{/if}

		{#if complexDeserialized}
			<div class="code-display">
				<h4>还原后：</h4>
				<pre><code>{complexDeserialized}</code></pre>
			</div>
		{/if}
	</section>

	<!-- 使用说明 -->
	<section class="usage-section">
		<h2>使用说明</h2>

		<div class="code-example">
			<h4>❌ 错误做法（会抛出错误）：</h4>
			<pre><code
					>{`const form = useFormState({
  fields: {
    tokenAmount: { defaultValue: 123456789n }
  }
});

// ❌ 会抛出 TypeError
const json = JSON.stringify(form._manager.getValues());`}</code
				></pre>
		</div>

		<div class="code-example">
			<h4>✅ 正确做法：</h4>
			<pre><code
					>{`import { useFormState, safeStringify, safeParse } from '@packages/formstate/src';

const form = useFormState({
  fields: {
    tokenAmount: { defaultValue: 123456789n }
  }
});

// ✅ 使用 safeStringify
const json = safeStringify(form._manager.getValues());

// ✅ 还原
const restored = safeParse(json);
console.log(typeof restored.tokenAmount); // 'bigint'

// ✅ 或直接使用 form.serialize()
const serialized = form._manager.serialize();`}</code
				></pre>
		</div>
	</section>
</div>

<style>
	.bigint-test {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #666;
		font-size: 1.1rem;
		margin-bottom: 2rem;
	}

	.warning {
		padding: 1.5rem;
		background: #fef3c7;
		border-left: 4px solid #f59e0b;
		border-radius: 6px;
		margin-bottom: 2rem;
	}

	.warning h3 {
		margin-top: 0;
		color: #92400e;
	}

	.warning code {
		background: #fbbf24;
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-family: 'Fira Code', Monaco, monospace;
	}

	.test-section {
		margin-bottom: 3rem;
		padding: 2rem;
		background: #f9f9f9;
		border-radius: 8px;
	}

	.test-section h2 {
		margin-top: 0;
	}

	.form-display table {
		width: 100%;
		border-collapse: collapse;
		background: white;
		margin-bottom: 1rem;
	}

	.form-display td {
		padding: 0.75rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.form-display td:first-child {
		font-weight: 500;
		width: 150px;
	}

	.form-display code {
		background: #f3f4f6;
		padding: 0.25rem 0.5rem;
		border-radius: 3px;
		font-family: 'Fira Code', Monaco, monospace;
	}

	.type-badge {
		text-align: center;
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		width: 80px;
	}

	.type-badge.bigint {
		background: #dbeafe;
		color: #1e40af;
	}

	.type-badge.date {
		background: #fce7f3;
		color: #9f1239;
	}

	.type-badge.string {
		background: #dcfce7;
		color: #166534;
	}

	.buttons {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	button {
		padding: 0.75rem 1.5rem;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
	}

	button:hover {
		background: #5568d3;
	}

	button.danger {
		background: #ef4444;
	}

	button.danger:hover {
		background: #dc2626;
	}

	.test-result {
		padding: 1rem;
		background: white;
		border-radius: 6px;
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.error-box {
		padding: 1rem;
		background: #fee2e2;
		border-left: 4px solid #dc2626;
		border-radius: 6px;
		margin-bottom: 1rem;
	}

	.error-box code {
		display: block;
		margin-top: 0.5rem;
		background: #fca5a5;
		padding: 0.5rem;
		border-radius: 3px;
		font-family: 'Fira Code', Monaco, monospace;
	}

	.code-display {
		background: #1e1e1e;
		color: #d4d4d4;
		padding: 1rem;
		border-radius: 6px;
		margin-bottom: 1rem;
	}

	.code-display h4 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		color: #d4d4d4;
	}

	.code-display pre {
		margin: 0;
		overflow-x: auto;
	}

	.code-display code {
		font-family: 'Fira Code', Monaco, monospace;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.usage-section {
		background: #f9f9f9;
		padding: 2rem;
		border-radius: 8px;
	}

	.code-example {
		margin-bottom: 2rem;
	}

	.code-example h4 {
		margin-bottom: 0.5rem;
	}

	.code-example pre {
		background: #1e1e1e;
		color: #d4d4d4;
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
	}

	.code-example code {
		font-family: 'Fira Code', Monaco, monospace;
		font-size: 0.9rem;
		line-height: 1.6;
	}

	.description {
		color: #666;
		margin-bottom: 1rem;
	}
</style>
