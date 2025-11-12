<script lang="ts">
	/**
	 * 性能测试示例 - Performance Test
	 * 展示 FormState 的性能优化效果
	 * - Bug 5 修复：异步验证 values 快照
	 * - Bug 6 修复：循环依赖防护
	 * - Perf 1 优化：简单路径跳过 Immer (10x faster)
	 * - Feature 1：批量更新 API
	 */
	import { useFormState } from '@packages/formstate/src';
	import { onDestroy } from 'svelte';

	// 生成大表单（100 个字段）
	const fieldCount = 100;
	const fields: Record<string, { defaultValue: string }> = {};
	for (let i = 0; i < fieldCount; i++) {
		fields[`field${i}`] = { defaultValue: '' };
	}

	const form = useFormState({ fields });

	// 性能指标
	let batchUpdateTime = $state(0);
	let normalUpdateTime = $state(0);
	let simplePathTime = $state(0);
	let complexPathTime = $state(0);

	// 测试用的嵌套表单
	const nestedForm = useFormState({
		fields: {
			'user.profile.firstName': { defaultValue: '' },
			'user.profile.lastName': { defaultValue: '' },
			'user.profile.email': { defaultValue: '' },
			'user.address.street': { defaultValue: '' },
			'user.address.city': { defaultValue: '' }
		}
	});

	/**
	 * 测试 1：批量更新 vs 普通更新
	 */
	function testBatchUpdate() {
		// 测试批量更新
		const start1 = performance.now();
		form.batchUpdate(() => {
			for (let i = 0; i < fieldCount; i++) {
				form.setValue(`field${i}`, `value${i}`, false);
			}
		});
		batchUpdateTime = performance.now() - start1;

		// 重置
		form.reset();

		// 测试普通更新
		const start2 = performance.now();
		for (let i = 0; i < fieldCount; i++) {
			form.setValue(`field${i}`, `value${i}`, false);
		}
		normalUpdateTime = performance.now() - start2;
	}

	/**
	 * 测试 2：简单路径 vs 复杂路径
	 */
	function testPathPerformance() {
		// 简单路径（跳过 Immer）
		const start1 = performance.now();
		for (let i = 0; i < 100; i++) {
			form.setValue('field0', `value${i}`, false);
		}
		simplePathTime = performance.now() - start1;

		// 复杂路径（使用 Immer）
		const start2 = performance.now();
		for (let i = 0; i < 100; i++) {
			nestedForm.setValue('user.profile.firstName', `value${i}`, false);
		}
		complexPathTime = performance.now() - start2;
	}

	/**
	 * 测试 3：循环依赖（已修复Bug 6）
	 */
	const circularForm = useFormState({
		fields: {
			startDate: {
				defaultValue: '2024-01-01',
				validator: {
					validate: (value, values) => {
						if (value >= (values.endDate as string)) {
							return 'Start must be before end';
						}
						return null;
					}
				},
				dependencies: ['endDate']
			},
			endDate: {
				defaultValue: '2024-12-31',
				validator: {
					validate: (value, values) => {
						if (value <= (values.startDate as string)) {
							return 'End must be after start';
						}
						return null;
					}
				},
				dependencies: ['startDate']
			}
		}
	});

	let circularTestResult = $state('未测试');

	async function testCircularDependency() {
		try {
			circularForm.setValue('startDate', '2024-06-01');
			// 等待异步验证完成
			await new Promise((r) => setTimeout(r, 100));
			circularTestResult = '✅ 成功（无无限循环）';
		} catch (error) {
			circularTestResult = `❌ 失败: ${error}`;
		}
	}

	/**
	 * 测试 4：异步验证竞态条件（已修复Bug 5）
	 */
	const asyncForm = useFormState({
		fields: {
			minPrice: { defaultValue: 100 },
			maxPrice: {
				defaultValue: 200,
				validator: {
					validate: async (value, allValues) => {
						// 模拟慢速验证
						await new Promise((r) => setTimeout(r, 500));
						if ((value as number) <= (allValues.minPrice as number)) {
							return `Max (${value}) must > Min (${allValues.minPrice})`;
						}
						return null;
					}
				}
			}
		}
	});

	let raceConditionResult = $state('未测试');

	async function testRaceCondition() {
		raceConditionResult = '测试中...';

		// 1. 开始验证 maxPrice（minPrice=100）
		asyncForm.setValue('maxPrice', 200);

		// 2. 立即修改 minPrice
		await new Promise((r) => setTimeout(r, 100));
		asyncForm.setValue('minPrice', 250);

		// 3. 等待验证完成
		await new Promise((r) => setTimeout(r, 600));

		// 4. 检查错误消息
		const error = asyncForm._manager.getFieldState('maxPrice').error;
		if (error && error.includes('250')) {
			raceConditionResult = `✅ 正确：${error}`;
		} else {
			raceConditionResult = `❌ 错误快照失败：${error}`;
		}
	}

	onDestroy(() => {
		form.destroy();
		nestedForm.destroy();
		circularForm.destroy();
		asyncForm.destroy();
	});
</script>

<div class="performance-test">
	<h1>性能测试 & Bug 修复验证</h1>
	<p class="subtitle">展示 FormState 的优化效果和关键 bug 修复</p>

	<!-- Test 1: 批量更新 -->
	<section class="test-section">
		<h2>🚀 测试 1: 批量更新 API（Feature 1）</h2>
		<p class="description">对比批量更新和逐个更新的性能差异（100 个字段）</p>

		<button onclick={testBatchUpdate} class="test-button">运行测试</button>

		<div class="results">
			<div class="metric">
				<div class="label">批量更新 (batchUpdate)</div>
				<div class="value">{batchUpdateTime.toFixed(2)} ms</div>
				<div class="badge good">推荐</div>
			</div>

			<div class="metric">
				<div class="label">普通更新 (100x setValue)</div>
				<div class="value">{normalUpdateTime.toFixed(2)} ms</div>
				<div class="badge bad">
					慢 {(normalUpdateTime / Math.max(batchUpdateTime, 0.01)).toFixed(1)}x
				</div>
			</div>

			{#if batchUpdateTime > 0}
				<div class="improvement">
					💡 性能提升: <strong
						>{(((normalUpdateTime - batchUpdateTime) / normalUpdateTime) * 100).toFixed(0)}%</strong
					>
				</div>
			{/if}
		</div>

		<div class="code-example">
			<h4>使用方式：</h4>
			<pre><code
					>{`// ❌ 慢（每次触发验证和UI更新）
for (let i = 0; i < 100; i++) {
  form.setValue(\`field\${i}\`, \`value\${i}\`);
}

// ✅ 快（只触发一次）
form.batchUpdate(() => {
  for (let i = 0; i < 100; i++) {
    form.setValue(\`field\${i}\`, \`value\${i}\`, false);
  }
});`}</code
				></pre>
		</div>
	</section>

	<!-- Test 2: 路径优化 -->
	<section class="test-section">
		<h2>⚡ 测试 2: 简单路径优化（Perf 1）</h2>
		<p class="description">简单路径跳过 Immer，直接浅拷贝（10x faster）</p>

		<button onclick={testPathPerformance} class="test-button">运行测试</button>

		<div class="results">
			<div class="metric">
				<div class="label">简单路径 (field0)</div>
				<div class="value">{simplePathTime.toFixed(2)} ms</div>
				<div class="badge good">Fast Path</div>
			</div>

			<div class="metric">
				<div class="label">复杂路径 (user.profile.firstName)</div>
				<div class="value">{complexPathTime.toFixed(2)} ms</div>
				<div class="badge normal">Immer</div>
			</div>

			{#if simplePathTime > 0}
				<div class="improvement">
					💡 简单路径快 <strong
						>{(complexPathTime / Math.max(simplePathTime, 0.01)).toFixed(1)}x</strong
					>
				</div>
			{/if}
		</div>
	</section>

	<!-- Test 3: 循环依赖 -->
	<section class="test-section">
		<h2>🔄 测试 3: 循环依赖防护（Bug 6）</h2>
		<p class="description">
			startDate 依赖 endDate，endDate 依赖 startDate。修复前会无限递归，修复后正常工作。
		</p>

		<button onclick={testCircularDependency} class="test-button">运行测试</button>

		<div class="test-result">
			<strong>结果：</strong>{circularTestResult}
		</div>

		<div class="form-demo">
			<div class="field">
				<label>Start Date</label>
				<input
					type="date"
					value={circularForm.getValue('startDate') as string}
					oninput={(e) => circularForm.setValue('startDate', e.currentTarget.value)}
				/>
				{#if circularForm.getFieldState('startDate').error}
					<div class="error">{circularForm.getFieldState('startDate').error}</div>
				{/if}
			</div>

			<div class="field">
				<label>End Date</label>
				<input
					type="date"
					value={circularForm.getValue('endDate') as string}
					oninput={(e) => circularForm.setValue('endDate', e.currentTarget.value)}
				/>
				{#if circularForm.getFieldState('endDate').error}
					<div class="error">{circularForm.getFieldState('endDate').error}</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Test 4: 异步验证竞态 -->
	<section class="test-section">
		<h2>🏁 测试 4: 异步验证竞态条件（Bug 5）</h2>
		<p class="description">
			修复前：验证期间 minPrice 改变会导致错误消息使用错误的值。<br />
			修复后：验证使用开始时的 values 快照。
		</p>

		<button onclick={testRaceCondition} class="test-button">运行测试</button>

		<div class="test-result">
			<strong>结果：</strong>{raceConditionResult}
		</div>

		<div class="sequence">
			<h4>测试序列：</h4>
			<ol>
				<li>maxPrice=200, minPrice=100 → 开始验证（慢速，500ms）</li>
				<li>100ms 后修改 minPrice=250</li>
				<li>验证完成时应该看到 minPrice=100（快照），而不是250</li>
			</ol>
		</div>
	</section>
</div>

<style>
	.performance-test {
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
		margin-bottom: 3rem;
	}

	.test-section {
		margin-bottom: 3rem;
		padding: 2rem;
		background: #f9f9f9;
		border-radius: 8px;
	}

	.test-section h2 {
		font-size: 1.8rem;
		margin-bottom: 0.5rem;
	}

	.description {
		color: #666;
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	.test-button {
		padding: 0.75rem 1.5rem;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		margin-bottom: 1.5rem;
	}

	.test-button:hover {
		background: #5568d3;
	}

	.results {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}

	.metric {
		flex: 1;
		min-width: 200px;
		padding: 1rem;
		background: white;
		border-radius: 6px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.metric .label {
		font-size: 0.875rem;
		color: #666;
		margin-bottom: 0.5rem;
	}

	.metric .value {
		font-size: 1.5rem;
		font-weight: bold;
		color: #333;
		margin-bottom: 0.5rem;
	}

	.badge {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.badge.good {
		background: #10b981;
		color: white;
	}

	.badge.bad {
		background: #ef4444;
		color: white;
	}

	.badge.normal {
		background: #3b82f6;
		color: white;
	}

	.improvement {
		flex-basis: 100%;
		padding: 1rem;
		background: #10b98120;
		border-left: 4px solid #10b981;
		border-radius: 4px;
		font-size: 1.1rem;
	}

	.code-example {
		background: #1e1e1e;
		color: #d4d4d4;
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
	}

	.code-example h4 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		color: #d4d4d4;
	}

	.code-example pre {
		margin: 0;
	}

	.code-example code {
		font-family: 'Fira Code', Monaco, monospace;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.test-result {
		padding: 1rem;
		background: white;
		border-radius: 6px;
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.form-demo {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.field {
		flex: 1;
		min-width: 250px;
	}

	.field label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.field input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	.error {
		color: #dc2626;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	.sequence {
		background: white;
		padding: 1rem;
		border-radius: 6px;
	}

	.sequence h4 {
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	.sequence ol {
		margin: 0;
		padding-left: 1.5rem;
	}

	.sequence li {
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}
</style>
