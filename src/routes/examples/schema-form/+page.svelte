<script lang="ts">
	/**
	 * Schema 配置渲染示例
	 * 演示：配置驱动表单、自定义输入组件注册、递归渲染
	 */
	import {
		useFormState,
		Form,
		Validators,
		type FormSchema,
		type FieldSchema
	} from '@packages/formstate/src';
	import ColorPicker from './components/ColorPicker.svelte';
	import TagsInput from './components/TagsInput.svelte';
	import RichTextEditor from './components/RichTextEditor.svelte';

	// 定义表单 Schema
	const profileSchema: FormSchema = {
		layout: 'vertical',
		fields: [
			// 基础信息组
			{
				name: 'profile',
				type: 'group',
				label: '基础信息',
				fields: [
					{
						name: 'profile.name',
						type: 'text',
						label: '姓名',
						required: true,
						validator: Validators.required('请输入姓名'),
						placeholder: '请输入您的姓名'
					},
					{
						name: 'profile.email',
						type: 'email',
						label: '邮箱',
						required: true,
						validator: Validators.compose(
							Validators.required('请输入邮箱'),
							Validators.email('请输入有效的邮箱地址')
						),
						placeholder: 'your@email.com'
					},
					{
						name: 'profile.bio',
						type: 'textarea',
						label: '个人简介',
						placeholder: '介绍一下你自己...',
						validator: Validators.maxLength(200, '简介不能超过 200 个字符')
					}
				]
			},

			// 自定义组件：颜色选择器
			{
				name: 'preferences.theme',
				type: 'custom',
				label: '主题颜色',
				component: ColorPicker,
				componentProps: {
					presetColors: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b']
				},
				defaultValue: '#667eea'
			},

			// 自定义组件：标签输入
			{
				name: 'profile.skills',
				type: 'custom',
				label: '技能标签',
				component: TagsInput,
				componentProps: {
					placeholder: '输入技能后按回车',
					suggestions: ['JavaScript', 'TypeScript', 'Svelte', 'React', 'Vue', 'Node.js']
				},
				defaultValue: []
			},

			// 自定义组件：富文本编辑器
			{
				name: 'profile.about',
				type: 'custom',
				label: '详细介绍',
				component: RichTextEditor,
				componentProps: {
					minHeight: '200px',
					placeholder: '详细介绍你的经历和成就...'
				},
				defaultValue: ''
			},

			// 选择类型字段
			{
				name: 'preferences.notifications',
				type: 'select',
				label: '通知设置',
				options: [
					{ label: '全部通知', value: 'all' },
					{ label: '仅重要通知', value: 'important' },
					{ label: '关闭通知', value: 'none' }
				],
				defaultValue: 'all'
			},

			// 多选框
			{
				name: 'preferences.interests',
				type: 'checkbox',
				label: '感兴趣的领域',
				options: [
					{ label: '前端开发', value: 'frontend' },
					{ label: '后端开发', value: 'backend' },
					{ label: '移动开发', value: 'mobile' },
					{ label: '数据科学', value: 'data-science' },
					{ label: '机器学习', value: 'ml' }
				],
				defaultValue: []
			},

			// 单选框
			{
				name: 'preferences.visibility',
				type: 'radio',
				label: '资料可见性',
				options: [
					{ label: '公开', value: 'public' },
					{ label: '仅好友', value: 'friends' },
					{ label: '私密', value: 'private' }
				],
				defaultValue: 'public'
			}
		]
	};

	const form = useFormState();

	async function handleSubmit(values: Record<string, unknown>) {
		console.log('提交数据:', values);
		alert('表单提交成功！\n请查看控制台输出。');
	}
</script>

<svelte:head>
	<title>Schema 配置渲染 | FormState</title>
</svelte:head>

<div class="example-page">
	<div class="documentation">
		<h1>Schema 配置渲染</h1>
		<p class="lead">使用配置自动生成表单，支持自定义输入组件。</p>

		<section class="doc-section">
			<h2>功能特性</h2>
			<ul>
				<li>✅ Schema 驱动的表单渲染</li>
				<li>✅ 自定义输入组件注册</li>
				<li>✅ 递归嵌套字段组</li>
				<li>✅ 内置多种输入类型</li>
				<li>✅ 灵活的布局控制</li>
			</ul>
		</section>

		<section class="doc-section">
			<h2>自定义输入组件</h2>
			<pre><code
					>{`// 1. 创建自定义组件
// ColorPicker.svelte
<script lang="ts">
  let { value, onInput } = $props();
</script>

<div class="color-picker">
  <input type="color" {value}
    oninput={e => onInput(e.target.value)} />
</div>

// 2. 在 Schema 中使用
const schema: FormSchema = {
  fields: [
    {
      name: 'themeColor',
      type: 'custom',
      label: '主题颜色',
      component: ColorPicker,
      componentProps: {
        presetColors: ['#667eea', '#764ba2']
      }
    }
  ]
};`}</code
				></pre>
		</section>

		<section class="doc-section">
			<h2>注册自定义组件类型</h2>
			<p>可以全局注册自定义组件类型：</p>
			<pre><code
					>{`// 创建组件注册表
const customComponents = {
  colorPicker: ColorPicker,
  tagsInput: TagsInput,
  richText: RichTextEditor
};

// 在 Schema 中使用字符串引用
{
  name: 'color',
  type: 'colorPicker', // 字符串类型
  label: '选择颜色'
}`}</code
				></pre>
		</section>
	</div>

	<div class="demo-container">
		<h2>交互演示</h2>

		<div class="form-card">
			<Form formState={form} schema={profileSchema} onSubmit={handleSubmit}>
				<!-- Schema 驱动，自动渲染 -->
			</Form>

			<div class="form-actions">
				<button type="button" class="btn-secondary" onclick={() => form.reset()}> 重置表单 </button>
			</div>
		</div>

		<div class="info-card">
			<h3>💡 Schema 配置</h3>
			<details>
				<summary>查看完整 Schema</summary>
				<pre class="schema-preview">{JSON.stringify(profileSchema, null, 2)}</pre>
			</details>
		</div>

		<div class="state-viewer">
			<h3>表单数据</h3>
			<details open>
				<summary>当前值</summary>
				<pre class="state-data">{JSON.stringify(form.values, null, 2)}</pre>
			</details>

			<details>
				<summary>错误信息</summary>
				<pre class="state-data">{JSON.stringify(form.errors, null, 2)}</pre>
			</details>
		</div>
	</div>
</div>

<style>
	.example-page {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		max-width: 1400px;
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
	}

	.lead {
		font-size: 1.125rem;
		color: #6b7280;
		margin-bottom: 2rem;
	}

	.doc-section {
		margin-bottom: 2rem;
	}

	.doc-section h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.doc-section ul {
		list-style: none;
		padding: 0;
	}

	.doc-section li {
		padding: 0.5rem 0;
		color: #374151;
	}

	.doc-section pre {
		background: #1e293b;
		color: #e2e8f0;
		padding: 1.5rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		font-family: 'Fira Code', 'Monaco', monospace;
		font-size: 0.875rem;
		line-height: 1.7;
	}

	.demo-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.demo-container h2 {
		font-size: 1.5rem;
		font-weight: 600;
	}

	.form-card,
	.info-card,
	.state-viewer {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		border: 1px solid #e5e7eb;
	}

	.form-actions {
		margin-top: 2rem;
		display: flex;
		justify-content: center;
	}

	.btn-secondary {
		padding: 0.75rem 2rem;
		background: #f3f4f6;
		color: #374151;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-secondary:hover {
		background: #e5e7eb;
	}

	.info-card h3,
	.state-viewer h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	details summary {
		cursor: pointer;
		font-weight: 500;
		color: #667eea;
		margin-bottom: 0.5rem;
	}

	.schema-preview,
	.state-data {
		margin-top: 0.5rem;
		padding: 1rem;
		background: #f9fafb;
		border-radius: 0.5rem;
		font-size: 0.75rem;
		overflow-x: auto;
		max-height: 400px;
		overflow-y: auto;
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
