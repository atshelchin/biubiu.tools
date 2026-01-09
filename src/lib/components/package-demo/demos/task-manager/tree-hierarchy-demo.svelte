<script lang="ts">
	/**
	 * Tree Hierarchy Demo
	 * Demonstrates multi-level nested task structure visualization.
	 */
	import { onMount } from 'svelte';
	import {
		createTaskManager,
		createMemoryStorage,
		type TaskRoot,
		type TaskNode,
		type TaskExecutor
	} from '@shelchin/task-manager';
	import { Play, RotateCcw, FolderTree, ChevronRight, ChevronDown } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		TaskStatusBadge,
		TaskStatusIcon,
		ProgressBar,
		DemoEmptyState,
		ActionButtons,
		DemoButton
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface TreeNode extends TaskNode {
		children: TreeNode[];
		expanded: boolean;
	}

	let task = $state<TaskRoot | null>(null);
	let nodes = $state<TaskNode[]>([]);
	let treeData = $state<TreeNode[]>([]);
	let executing = $state(false);
	let updateInterval: ReturnType<typeof setInterval> | null = null;

	const manager = createTaskManager<{ level: number; index: number }>({
		storage: createMemoryStorage()
	});

	// Build tree structure from flat nodes
	function buildTree(flatNodes: TaskNode[]): TreeNode[] {
		const nodeMap = new Map<string, TreeNode>();
		const roots: TreeNode[] = [];

		// First pass: create TreeNode wrappers
		flatNodes.forEach((node) => {
			nodeMap.set(node.id, { ...node, children: [], expanded: true });
		});

		// Second pass: build parent-child relationships
		flatNodes.forEach((node) => {
			const treeNode = nodeMap.get(node.id)!;
			if (node.parentId) {
				const parent = nodeMap.get(node.parentId);
				if (parent) {
					parent.children.push(treeNode);
				}
			} else {
				roots.push(treeNode);
			}
		});

		// Sort children by index
		const sortChildren = (nodes: TreeNode[]) => {
			nodes.sort((a, b) => a.index - b.index);
			nodes.forEach((node) => sortChildren(node.children));
		};
		sortChildren(roots);

		return roots;
	}

	function toggleExpand(nodeId: string) {
		const toggleInTree = (nodes: TreeNode[]): TreeNode[] => {
			return nodes.map((node) => {
				if (node.id === nodeId) {
					return { ...node, expanded: !node.expanded };
				}
				if (node.children.length > 0) {
					return { ...node, children: toggleInTree(node.children) };
				}
				return node;
			});
		};
		treeData = toggleInTree(treeData);
	}

	async function createAndExecute() {
		executing = true;

		// Create a deeply nested task structure
		task = await manager.create({
			name: 'Project Deployment',
			children: [
				{
					name: 'Build',
					data: { level: 1, index: 0 },
					children: [
						{
							name: 'Compile TypeScript',
							data: { level: 2, index: 0 },
							children: [
								{ name: 'Parse source files', data: { level: 3, index: 0 } },
								{ name: 'Type checking', data: { level: 3, index: 1 } },
								{ name: 'Emit JavaScript', data: { level: 3, index: 2 } }
							]
						},
						{
							name: 'Bundle Assets',
							data: { level: 2, index: 1 },
							children: [
								{ name: 'Process CSS', data: { level: 3, index: 0 } },
								{ name: 'Optimize images', data: { level: 3, index: 1 } }
							]
						}
					]
				},
				{
					name: 'Test',
					data: { level: 1, index: 1 },
					children: [
						{
							name: 'Unit Tests',
							data: { level: 2, index: 0 },
							children: [
								{ name: 'Component tests', data: { level: 3, index: 0 } },
								{ name: 'Service tests', data: { level: 3, index: 1 } }
							]
						},
						{ name: 'Integration Tests', data: { level: 2, index: 1 } }
					]
				},
				{
					name: 'Deploy',
					data: { level: 1, index: 2 },
					children: [
						{ name: 'Upload to CDN', data: { level: 2, index: 0 } },
						{ name: 'Update DNS', data: { level: 2, index: 1 } },
						{ name: 'Clear cache', data: { level: 2, index: 2 } }
					]
				}
			]
		});

		nodes = await manager.getNodes(task.id);
		treeData = buildTree(nodes);

		// Poll for updates
		updateInterval = setInterval(async () => {
			if (task) {
				const updated = await manager.getRoot(task.id);
				if (updated) task = updated;
				const newNodes = await manager.getNodes(task.id);
				// Preserve expanded state
				const expandedMap = new Map<string, boolean>();
				const collectExpanded = (nodes: TreeNode[]) => {
					nodes.forEach((n) => {
						expandedMap.set(n.id, n.expanded);
						collectExpanded(n.children);
					});
				};
				collectExpanded(treeData);
				nodes = newNodes;
				const newTree = buildTree(newNodes);
				const restoreExpanded = (nodes: TreeNode[]) => {
					nodes.forEach((n) => {
						const wasExpanded = expandedMap.get(n.id);
						if (wasExpanded !== undefined) {
							n.expanded = wasExpanded;
						}
						restoreExpanded(n.children);
					});
				};
				restoreExpanded(newTree);
				treeData = newTree;
			}
		}, 100);

		const executor: TaskExecutor<{ level: number; index: number }> = async (ctx) => {
			// Simulate work based on depth
			const duration = 200 + Math.random() * 400;
			for (let i = 0; i <= 100; i += 20) {
				await ctx.progress(i);
				await new Promise((r) => setTimeout(r, duration / 5));
			}
			await ctx.complete({ done: true });
		};

		try {
			task = await manager.execute(task.id, executor);
		} catch {
			// May fail
		}

		if (updateInterval) {
			clearInterval(updateInterval);
			updateInterval = null;
		}

		task = await manager.getRoot(task!.id);
		nodes = await manager.getNodes(task!.id);
		treeData = buildTree(nodes);
		executing = false;
	}

	async function resetDemo() {
		if (updateInterval) {
			clearInterval(updateInterval);
			updateInterval = null;
		}
		if (task) {
			await manager.delete(task.id);
		}
		task = null;
		nodes = [];
		treeData = [];
	}

	onMount(() => {
		return () => {
			if (updateInterval) {
				clearInterval(updateInterval);
			}
		};
	});

	const codeExample = `import { createTaskManager } from '@shelchin/task-manager';

const manager = createTaskManager();

// Create deeply nested task structure
const task = await manager.create({
  name: 'Project Deployment',
  children: [
    {
      name: 'Build',
      children: [
        {
          name: 'Compile TypeScript',
          children: [
            { name: 'Parse source files' },
            { name: 'Type checking' },
            { name: 'Emit JavaScript' }
          ]
        },
        {
          name: 'Bundle Assets',
          children: [
            { name: 'Process CSS' },
            { name: 'Optimize images' }
          ]
        }
      ]
    },
    {
      name: 'Test',
      children: [
        { name: 'Unit Tests' },
        { name: 'Integration Tests' }
      ]
    },
    {
      name: 'Deploy',
      children: [
        { name: 'Upload to CDN' },
        { name: 'Update DNS' }
      ]
    }
  ]
});

// Get nodes with hierarchy info
const nodes = await manager.getNodes(task.id);
nodes.forEach(node => {
  console.log(\`\${'  '.repeat(node.depth)}\${node.name} (depth: \${node.depth})\`);
});

// Execute - parent nodes complete when all children complete
await manager.execute(task.id, async (ctx) => {
  await doWork();
  await ctx.complete();
});`;
</script>

<DemoSection title={t('demo.tree.title')} description={t('demo.tree.description')}>
	<DemoContent>
		{#snippet panel()}
			<div class="tree-info">
				<div class="info-item">
					<span class="info-label">{t('demo.tree.total_nodes')}:</span>
					<span class="info-value">{nodes.length}</span>
				</div>
				<div class="info-item">
					<span class="info-label">{t('demo.tree.leaf_nodes')}:</span>
					<span class="info-value">{nodes.filter((n) => n.isLeaf).length}</span>
				</div>
				<div class="info-item">
					<span class="info-label">{t('demo.tree.max_depth')}:</span>
					<span class="info-value">{Math.max(0, ...nodes.map((n) => n.depth))}</span>
				</div>
			</div>

			<ActionButtons>
				<DemoButton
					variant="success"
					icon={Play}
					loading={executing}
					onclick={createAndExecute}
					disabled={executing}
				>
					{t('demo.tree.run_demo')}
				</DemoButton>
				<DemoButton variant="outline" icon={RotateCcw} onclick={resetDemo} disabled={executing}>
					{t('demo.lifecycle.reset')}
				</DemoButton>
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			{#if task}
				<div class="tree-container">
					<div class="tree-header">
						<h4>{task.name}</h4>
						<TaskStatusBadge status={task.status} label={t(`status.${task.status}`)} />
					</div>

					<ProgressBar progress={task.progress} showLabel />

					<div class="tree-view">
						{#snippet renderNode(node: TreeNode, depth: number)}
							<div class="tree-node" style="--depth: {depth}">
								<div class="node-row">
									{#if node.children.length > 0}
										<button class="expand-btn" onclick={() => toggleExpand(node.id)}>
											{#if node.expanded}
												<ChevronDown size={14} />
											{:else}
												<ChevronRight size={14} />
											{/if}
										</button>
									{:else}
										<span class="expand-placeholder"></span>
									{/if}

									<TaskStatusIcon status={node.status} />
									<span class="node-name" class:is-leaf={node.isLeaf}>{node.name}</span>

									{#if node.isLeaf}
										<span class="node-progress">{node.progress}%</span>
									{:else}
										<span class="child-count">{node.childCount} items</span>
									{/if}
								</div>

								{#if node.expanded && node.children.length > 0}
									<div class="node-children">
										{#each node.children as child (child.id)}
											{@render renderNode(child, depth + 1)}
										{/each}
									</div>
								{/if}
							</div>
						{/snippet}

						{#each treeData as rootNode (rootNode.id)}
							{@render renderNode(rootNode, 0)}
						{/each}
					</div>
				</div>
			{:else}
				<DemoEmptyState icon={FolderTree} message={t('demo.tree.no_tree')} />
			{/if}
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.tree_hierarchy')} code={codeExample} />
</DemoSection>

<style>
	.tree-info {
		display: flex;
		gap: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.info-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
	}

	.info-label {
		color: var(--color-muted-foreground);
	}

	.info-value {
		font-weight: 600;
		color: var(--color-primary);
	}

	.tree-container {
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
	}

	.tree-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-4);
	}

	.tree-header h4 {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-foreground);
		margin: 0;
	}

	.tree-view {
		margin-top: var(--space-4);
		max-height: 400px;
		overflow-y: auto;
	}

	.tree-node {
		font-size: var(--text-sm);
	}

	.node-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-1) var(--space-2);
		padding-left: calc(var(--depth) * var(--space-5) + var(--space-2));
		border-radius: var(--radius);
		transition: background 0.15s;
	}

	.node-row:hover {
		background: var(--color-panel-1);
	}

	.expand-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--color-muted-foreground);
		cursor: pointer;
		border-radius: var(--radius);
		transition: all 0.15s;
	}

	.expand-btn:hover {
		background: var(--color-panel-2);
		color: var(--color-foreground);
	}

	.expand-placeholder {
		width: 20px;
	}

	.node-name {
		flex: 1;
		color: var(--color-foreground);
	}

	.node-name.is-leaf {
		color: var(--color-muted-foreground);
	}

	.node-progress {
		font-size: var(--text-xs);
		color: var(--color-primary);
		min-width: 35px;
		text-align: right;
	}

	.child-count {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		background: var(--color-panel-2);
		padding: 0 var(--space-2);
		border-radius: var(--radius-full);
	}

	.node-children {
		border-left: 1px dashed var(--color-border);
		margin-left: calc(var(--depth) * var(--space-5) + var(--space-4));
	}
</style>
