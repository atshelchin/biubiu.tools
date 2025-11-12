<script lang="ts">
	/**
	 * 表单持久化示例 - Form Persistence
	 * 展示如何使用 serialize/deserialize 和 localStorage 实现表单自动保存与恢复
	 */
	import { useFormState, Form, FormField, Validators } from '@packages/formstate/src';
	import type { FormState } from '@packages/formstate/src';
	import { onMount } from 'svelte';

	const STORAGE_KEY = 'formstate-demo-data';
	const AUTO_SAVE_DELAY = 1000; // 自动保存延迟（毫秒）

	let autoSaveEnabled = $state(true);
	let lastSavedTime = $state<string | null>(null);
	let saveStatus = $state<'saved' | 'saving' | 'error' | null>(null);
	let saveTimer: ReturnType<typeof setTimeout> | null = null;

	// 创建表单
	const form: FormState = useFormState({
		fields: {
			name: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入姓名'),
					Validators.minLength(2, '姓名至少2个字符')
				)
			},
			email: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入邮箱'),
					Validators.email('邮箱格式不正确')
				)
			},
			phone: {
				defaultValue: '',
				validator: Validators.pattern(/^1[3-9]\d{9}$/, '请输入有效的手机号')
			},
			bio: {
				defaultValue: '',
				validator: Validators.maxLength(200, '简介不能超过200字')
			},
			newsletter: {
				defaultValue: false
			},
			interests: {
				defaultValue: [] as string[]
			}
		}
	});

	// 自动保存函数
	function scheduleSave() {
		if (!autoSaveEnabled) return;

		if (saveTimer) {
			clearTimeout(saveTimer);
		}

		saveStatus = 'saving';

		saveTimer = setTimeout(() => {
			saveToLocalStorage();
		}, AUTO_SAVE_DELAY);
	}

	// 保存到 localStorage
	function saveToLocalStorage() {
		try {
			const serialized = form._manager.serialize();
			localStorage.setItem(STORAGE_KEY, serialized);
			lastSavedTime = new Date().toLocaleTimeString();
			saveStatus = 'saved';

			// 3秒后清除状态
			setTimeout(() => {
				saveStatus = null;
			}, 3000);
		} catch (error) {
			console.error('保存失败:', error);
			saveStatus = 'error';
		}
	}

	// 从 localStorage 加载
	function loadFromLocalStorage() {
		try {
			const serialized = localStorage.getItem(STORAGE_KEY);
			if (!serialized) return false;

			const data = JSON.parse(serialized);

			// 恢复值
			if (data.values) {
				form._manager.setValues(data.values, false);
			}

			// 恢复初始值
			if (data.initialValues) {
				form._manager.setInitialValues(data.initialValues, false);
			}

			lastSavedTime = new Date().toLocaleTimeString();
			return true;
		} catch (error) {
			console.error('加载失败:', error);
			return false;
		}
	}

	// 清除保存的数据
	function clearSavedData() {
		if (confirm('确定要清除保存的数据吗？')) {
			localStorage.removeItem(STORAGE_KEY);
			form._manager.reset();
			lastSavedTime = null;
			saveStatus = null;
			alert('已清除保存的数据');
		}
	}

	// 导出数据为JSON文件
	function exportToFile() {
		const serialized = form._manager.serialize();
		const blob = new Blob([serialized], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `form-data-${new Date().toISOString().split('T')[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	// 从文件导入数据
	function importFromFile(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = JSON.parse(e.target?.result as string);
				if (data.values) {
					form._manager.setValues(data.values, false);
				}
				if (data.initialValues) {
					form._manager.setInitialValues(data.initialValues, false);
				}
				alert('导入成功！');
			} catch (error) {
				alert('导入失败：文件格式不正确');
			}
		};
		reader.readAsText(file);
	}

	// 监听表单变化，触发自动保存
	form._manager.subscribe({
		onFieldChange: () => {
			scheduleSave();
		}
	});

	// 组件挂载时加载数据
	onMount(() => {
		const loaded = loadFromLocalStorage();
		if (loaded) {
			console.log('已从本地存储恢复数据');
		}

		// 页面卸载时保存（防止数据丢失）
		const handleBeforeUnload = () => {
			if (form._manager.isDirty()) {
				saveToLocalStorage();
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			if (saveTimer) clearTimeout(saveTimer);
		};
	});

	async function handleSubmit(values: Record<string, unknown>) {
		console.log('提交数据:', values);
		alert('提交成功！\n\n' + JSON.stringify(values, null, 2));

		// 提交成功后清除本地存储
		localStorage.removeItem(STORAGE_KEY);
		lastSavedTime = null;
	}

	// 兴趣选项
	const interestOptions = [
		{ label: '编程', value: 'programming' },
		{ label: '设计', value: 'design' },
		{ label: '写作', value: 'writing' },
		{ label: '摄影', value: 'photography' },
		{ label: '音乐', value: 'music' }
	];

	// 切换兴趣选项
	function toggleInterest(value: string) {
		const current = form.getValue('interests') as string[];
		const newValue = current.includes(value)
			? current.filter((v) => v !== value)
			: [...current, value];
		form._manager.setValue('interests', newValue);
	}
</script>

<div class="example-page">
	<div class="header">
		<h1>表单持久化示例</h1>
		<p class="description">
			演示使用 serialize/deserialize 和 localStorage 实现表单自动保存、恢复、导出/导入
		</p>
	</div>

	<div class="content">
		<!-- 左侧：表单 -->
		<div class="form-section">
			<div class="section-header">
				<h2>用户信息表单</h2>
				<div class="auto-save-controls">
					<label class="toggle">
						<input type="checkbox" bind:checked={autoSaveEnabled} />
						<span>自动保存</span>
					</label>
					{#if saveStatus}
						<span
							class="save-status"
							class:saved={saveStatus === 'saved'}
							class:saving={saveStatus === 'saving'}
							class:error={saveStatus === 'error'}
						>
							{#if saveStatus === 'saving'}
								<span class="spinner"></span> 保存中...
							{:else if saveStatus === 'saved'}
								✓ 已保存
							{:else}
								✗ 保存失败
							{/if}
						</span>
					{/if}
					{#if lastSavedTime}
						<span class="last-saved">上次保存: {lastSavedTime}</span>
					{/if}
				</div>
			</div>

			<Form formState={form} onSubmit={handleSubmit} class="demo-form">
				<FormField name="name" label="姓名 *">
					{#snippet children({ value, onInput, onBlur })}
						<input
							type="text"
							{value}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
							placeholder="请输入姓名"
						/>
					{/snippet}
				</FormField>

				<FormField name="email" label="邮箱 *">
					{#snippet children({ value, onInput, onBlur })}
						<input
							type="email"
							{value}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
							placeholder="your@email.com"
						/>
					{/snippet}
				</FormField>

				<FormField name="phone" label="手机号">
					{#snippet children({ value, onInput, onBlur })}
						<input
							type="tel"
							{value}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
							placeholder="13812345678"
						/>
					{/snippet}
				</FormField>

				<FormField name="bio" label="个人简介">
					{#snippet children({ value, onInput, onBlur })}
						<textarea
							{value}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
							placeholder="介绍一下你自己..."
							rows="4"
						></textarea>
						<div class="char-count">
							{(value as string).length} / 200
						</div>
					{/snippet}
				</FormField>

				<div class="field-group">
					<label class="field-label">兴趣爱好</label>
					<div class="checkbox-group">
						{#each interestOptions as option}
							{@const isChecked = (form.getValue('interests') as string[]).includes(option.value)}
							<label class="checkbox-label">
								<input
									type="checkbox"
									checked={isChecked}
									onchange={() => toggleInterest(option.value)}
								/>
								<span>{option.label}</span>
							</label>
						{/each}
					</div>
				</div>

				<FormField name="newsletter" label="">
					{#snippet children({ value, onInput })}
						<label class="checkbox-label">
							<input
								type="checkbox"
								checked={value}
								onchange={(e) => onInput(e.currentTarget.checked)}
							/>
							<span>订阅新闻邮件</span>
						</label>
					{/snippet}
				</FormField>

				<div class="form-actions">
					<button type="submit" class="btn-primary" disabled={!form.isValid}> 提交表单 </button>
					<button type="button" class="btn-secondary" onclick={() => form._manager.reset()}>
						重置表单
					</button>
				</div>
			</Form>
		</div>

		<!-- 右侧：文档和控制 -->
		<div class="docs-section">
			<div class="control-panel">
				<h3>💾 数据管理</h3>

				<div class="control-group">
					<button class="btn-control" onclick={saveToLocalStorage}>
						<span class="icon">💾</span>
						<span>立即保存</span>
					</button>
					<button class="btn-control" onclick={loadFromLocalStorage}>
						<span class="icon">📥</span>
						<span>重新加载</span>
					</button>
					<button class="btn-control danger" onclick={clearSavedData}>
						<span class="icon">🗑️</span>
						<span>清除数据</span>
					</button>
				</div>

				<div class="divider"></div>

				<div class="control-group">
					<button class="btn-control" onclick={exportToFile}>
						<span class="icon">📤</span>
						<span>导出JSON</span>
					</button>
					<label class="btn-control" for="import-file">
						<span class="icon">📥</span>
						<span>导入JSON</span>
						<input
							id="import-file"
							type="file"
							accept=".json"
							onchange={importFromFile}
							style="display: none"
						/>
					</label>
				</div>
			</div>

			<div class="info-panel">
				<h3>📊 表单状态</h3>
				<div class="status-item">
					<span class="status-label">已修改:</span>
					<span class="status-value">{form.isDirty ? '是' : '否'}</span>
				</div>
				<div class="status-item">
					<span class="status-label">验证通过:</span>
					<span class="status-value">{form.isValid ? '是' : '否'}</span>
				</div>
				<div class="status-item">
					<span class="status-label">已修改字段:</span>
					<span class="status-value">{form._manager.getDirtyFields().length}</span>
				</div>
			</div>

			<div class="code-section">
				<h3>📖 实现代码</h3>

				<div class="code-block">
					<h4>1. 序列化与保存</h4>
					<pre><code
							>{`// 序列化表单状态
const serialized = form._manager.serialize();

// 保存到 localStorage
localStorage.setItem('form-data', serialized);`}</code
						></pre>
				</div>

				<div class="code-block">
					<h4>2. 加载与恢复</h4>
					<pre><code
							>{`// 从 localStorage 读取
const serialized = localStorage.getItem('form-data');
const data = JSON.parse(serialized);

// 恢复表单值
form._manager.setValues(data.values, false);

// 恢复初始值
form._manager.setInitialValues(data.initialValues, false);`}</code
						></pre>
				</div>

				<div class="code-block">
					<h4>3. 自动保存</h4>
					<pre><code
							>{`let saveTimer: ReturnType<typeof setTimeout>;

form._manager.subscribe({
  onFieldChange: () => {
    // 防抖：停止输入1秒后保存
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const serialized = form._manager.serialize();
      localStorage.setItem('form-data', serialized);
    }, 1000);
  }
});`}</code
						></pre>
				</div>

				<div class="code-block">
					<h4>4. 页面卸载时保存</h4>
					<pre><code
							>{`window.addEventListener('beforeunload', () => {
  if (form._manager.isDirty()) {
    const serialized = form._manager.serialize();
    localStorage.setItem('form-data', serialized);
  }
});`}</code
						></pre>
				</div>
			</div>

			<div class="features">
				<h3>✨ 功能亮点</h3>
				<ul>
					<li><strong>自动保存</strong>：停止输入1秒后自动保存（可开关）</li>
					<li><strong>页面刷新恢复</strong>：关闭页面后重新打开，数据不丢失</li>
					<li><strong>导出/导入</strong>：支持JSON文件导出导入</li>
					<li><strong>状态监控</strong>：实时显示保存状态和时间</li>
					<li><strong>防抖优化</strong>：避免频繁保存影响性能</li>
				</ul>
			</div>

			<div class="use-cases">
				<h3>🎯 适用场景</h3>
				<ul>
					<li>长表单填写（防止意外关闭丢失数据）</li>
					<li>草稿保存（文章编辑、问卷调查等）</li>
					<li>多设备同步（结合云端存储）</li>
					<li>离线表单（PWA 应用）</li>
					<li>数据导出备份</li>
				</ul>
			</div>

			<div class="tips">
				<h3>💡 使用提示</h3>
				<ul>
					<li>试试填写表单后刷新页面，数据会自动恢复</li>
					<li>关闭"自动保存"后手动点击"立即保存"</li>
					<li>导出JSON后修改表单，再导入之前的数据</li>
					<li>查看浏览器开发者工具 → Application → Local Storage</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<style>
	.example-page {
		max-width: 1600px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		margin-bottom: 2rem;
	}

	.header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.description {
		color: #666;
		font-size: 1.1rem;
	}

	.content {
		display: grid;
		grid-template-columns: 600px 1fr;
		gap: 2rem;
	}

	.form-section,
	.docs-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.section-header {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.section-header h2 {
		margin: 0 0 1rem 0;
	}

	.auto-save-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.save-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.save-status.saving {
		background: #fff3e0;
		color: #f57c00;
	}

	.save-status.saved {
		background: #e8f5e9;
		color: #2e7d32;
	}

	.save-status.error {
		background: #ffebee;
		color: #c62828;
	}

	.spinner {
		display: inline-block;
		width: 12px;
		height: 12px;
		border: 2px solid #f3f3f3;
		border-top: 2px solid #f57c00;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.last-saved {
		font-size: 0.85rem;
		color: #999;
	}

	.demo-form {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.field-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field-label {
		font-weight: 500;
		color: #333;
	}

	.checkbox-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.5rem 0;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.char-count {
		text-align: right;
		font-size: 0.85rem;
		color: #999;
		margin-top: 0.25rem;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		padding-top: 1rem;
	}

	.btn-primary,
	.btn-secondary {
		padding: 0.75rem 2rem;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background: #2196f3;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #1976d2;
	}

	.btn-primary:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: white;
		border: 1px solid #ddd;
		color: #666;
	}

	.btn-secondary:hover {
		background: #f5f5f5;
	}

	.control-panel,
	.info-panel,
	.code-section,
	.features,
	.use-cases,
	.tips {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.control-panel h3,
	.info-panel h3,
	.code-section h3,
	.features h3,
	.use-cases h3,
	.tips h3 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.btn-control {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: #f5f5f5;
		border: 1px solid #ddd;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 0.95rem;
	}

	.btn-control:hover {
		background: #e0e0e0;
	}

	.btn-control.danger:hover {
		background: #ffebee;
		border-color: #ef5350;
		color: #c62828;
	}

	.icon {
		font-size: 1.2rem;
	}

	.divider {
		height: 1px;
		background: #eee;
		margin: 0.5rem 0;
	}

	.status-item {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
		border-bottom: 1px solid #f0f0f0;
	}

	.status-item:last-child {
		border-bottom: none;
	}

	.status-label {
		color: #666;
	}

	.status-value {
		font-weight: 500;
	}

	.code-block {
		margin-bottom: 1.5rem;
	}

	.code-block h4 {
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
		color: #666;
	}

	.code-block pre {
		background: #282c34;
		color: #abb2bf;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 0;
	}

	.code-block code {
		font-family: 'Fira Code', monospace;
		font-size: 0.85rem;
		line-height: 1.5;
	}

	.features ul,
	.use-cases ul,
	.tips ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.features li,
	.use-cases li,
	.tips li {
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}

	@media (max-width: 1200px) {
		.content {
			grid-template-columns: 1fr;
		}
	}
</style>
