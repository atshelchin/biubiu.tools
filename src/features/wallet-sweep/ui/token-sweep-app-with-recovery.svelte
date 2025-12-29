<script lang="ts">
	/**
	 * Token Sweep App 包装组件 - 支持任务恢复
	 *
	 * 这是一个示例组件，展示如何在应用启动时检查和恢复未完成的任务
	 * 实际使用时需要根据您的应用状态管理方式进行调整
	 */
	import { onMount } from 'svelte';
	import StepBasedApp, { type StepBasedAppConfig } from '$lib/components/step-based-app.svelte';
	import TaskRecoveryModal from '@shelchin/task-manager/components/task-recovery-modal.svelte';
	import { taskStore, type Task } from '@shelchin/task-manager';

	interface Props {
		config: StepBasedAppConfig;
	}

	let { config }: Props = $props();

	let showRecoveryModal = $state(false);

	// 在组件挂载时检查未完成的任务
	onMount(async () => {
		// 初始化任务存储
		await taskStore.init();

		// 检查是否有可恢复的 Token Sweep 任务
		const recoverableTasks = taskStore.recoverableTasks.filter((t) => t.type === 'wallet-sweep');

		if (recoverableTasks.length > 0) {
			showRecoveryModal = true;
		}
	});

	/**
	 * 处理任务恢复
	 *
	 * TODO: 实现完整的恢复逻辑
	 * 1. 从 task.config 中恢复应用状态（网络、钱包、代币等）
	 * 2. 跳转到执行步骤
	 * 3. 继续执行未完成的任务
	 */
	function handleRecoverTask(task: Task) {
		console.log('恢复任务:', task);

		// TODO: 实现状态恢复逻辑
		// 参考集成指南: src/lib/task-manager/INTEGRATION_GUIDE.md

		// 关闭恢复模态框
		showRecoveryModal = false;
	}
</script>

<!-- 任务恢复模态框 -->
<TaskRecoveryModal
	isOpen={showRecoveryModal}
	onClose={() => (showRecoveryModal = false)}
	onRecover={handleRecoverTask}
/>

<!-- 原始的 StepBasedApp -->
<StepBasedApp {config} />
