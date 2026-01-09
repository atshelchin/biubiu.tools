<script lang="ts">
	/**
	 * Merkle Verification Demo
	 * Demonstrates Merkle tree proof generation and verification.
	 */
	import { onMount } from 'svelte';
	import {
		createTaskManager,
		createIndexedDBStorage,
		type TaskRoot,
		type TaskNode,
		type MerkleProof
	} from '@shelchin/task-manager';
	import { Plus, Shield, CheckCircle2, XCircle, ChevronRight } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		DemoEmptyState,
		InputGroup,
		ActionButtons,
		DemoButton
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	const STORAGE_NAME = 'task-manager-demo-merkle';
	let task = $state<TaskRoot | null>(null);
	let nodes = $state<TaskNode[]>([]);
	let proof = $state<MerkleProof | null>(null);
	let verified = $state<boolean | null>(null);
	let manager = createTaskManager<{ amount: number; to: string }>({
		storage: createIndexedDBStorage(STORAGE_NAME)
	});
	let selectedLeafIndex = $state(0);
	let loading = $state(true);

	// Restore task from storage on mount
	onMount(async () => {
		const roots = await manager.getAllRoots();
		if (roots.length > 0) {
			task = roots[0];
			nodes = await manager.getLeaves(task.id);
		}
		loading = false;
	});

	async function createTask() {
		task = await manager.create({
			name: 'Merkle Demo',
			children: [
				{ name: 'Transaction A', data: { amount: 100, to: '0xABC...' } },
				{ name: 'Transaction B', data: { amount: 200, to: '0xDEF...' } },
				{ name: 'Transaction C', data: { amount: 150, to: '0x123...' } },
				{ name: 'Transaction D', data: { amount: 300, to: '0x456...' } }
			]
		});
		nodes = await manager.getLeaves(task.id);
		proof = null;
		verified = null;
	}

	async function generateProof() {
		if (!task || nodes.length === 0) return;
		const leaf = nodes[selectedLeafIndex];
		proof = await manager.getMerkleProof(task.id, leaf.id);
		verified = null;
	}

	async function verifyProof() {
		if (!proof) return;
		verified = await manager.verifyProof(proof);
	}

	const codeExample = `// Get Merkle root
const merkleRoot = await manager.getMerkleRoot(task.id);

// Generate proof for a specific leaf
const leaves = await manager.getLeaves(task.id);
const proof = await manager.getMerkleProof(task.id, leaves[0].id);

// Verify the proof
const isValid = await manager.verifyProof(proof);
console.log('Proof valid:', isValid);`;
</script>

<DemoSection title={t('demo.merkle.title')} description={t('demo.merkle.description')}>
	<DemoContent>
		{#snippet panel()}
			<ActionButtons>
				<DemoButton icon={Plus} onclick={createTask}>
					{t('demo.basic.create_task')}
				</DemoButton>
			</ActionButtons>

			{#if task && nodes.length > 0}
				<InputGroup label="Select Leaf" id="merkle-leaf-select">
					<select id="merkle-leaf-select" bind:value={selectedLeafIndex}>
						{#each nodes as node, index (node.id)}
							<option value={index}>{node.name}</option>
						{/each}
					</select>
				</InputGroup>

				<ActionButtons>
					<DemoButton variant="secondary" icon={Shield} onclick={generateProof}>
						{t('demo.merkle.generate_proof')}
					</DemoButton>
					<DemoButton variant="success" icon={CheckCircle2} onclick={verifyProof} disabled={!proof}>
						{t('demo.merkle.verify_proof')}
					</DemoButton>
				</ActionButtons>
			{/if}
		{/snippet}

		{#snippet result()}
			{#if task}
				<div class="merkle-tree">
					<div class="merkle-root">
						<Shield size={24} />
						<div class="merkle-info">
							<span class="label">{t('demo.merkle.merkle_root')}</span>
							<code class="hash">{task.merkleRoot?.slice(0, 16)}...</code>
						</div>
					</div>

					<div class="merkle-leaves">
						{#each nodes as node, index (node.id)}
							<div class="merkle-leaf" class:selected={index === selectedLeafIndex}>
								<span class="leaf-name">{node.name}</span>
								<code class="hash">{node.hash.slice(0, 8)}...</code>
							</div>
						{/each}
					</div>
				</div>

				{#if proof}
					<div class="proof-details">
						<h4>{t('demo.merkle.proof_path')}</h4>
						<div class="proof-path">
							{#each proof.proof as hash, i (i)}
								<div class="proof-step">
									<ChevronRight size={14} />
									<code>{hash.slice(0, 16)}...</code>
								</div>
							{/each}
						</div>

						{#if verified !== null}
							<div class="verification-result" class:valid={verified}>
								{#if verified}
									<CheckCircle2 size={20} />
									<span>{t('demo.merkle.valid')}</span>
								{:else}
									<XCircle size={20} />
									<span>{t('demo.merkle.invalid')}</span>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			{:else}
				<DemoEmptyState icon={Shield} message={t('demo.merkle.description')} />
			{/if}
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.merkle_proof')} code={codeExample} />
</DemoSection>

<style>
	.merkle-tree {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.merkle-root {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		background: linear-gradient(135deg, var(--color-primary), var(--color-accent, #10b981));
		border-radius: var(--radius-lg);
		color: white;
	}

	.merkle-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.merkle-info .label {
		font-size: var(--text-xs);
		opacity: 0.8;
		text-transform: uppercase;
	}

	.merkle-info .hash {
		font-family: var(--font-family-mono);
		font-size: var(--text-sm);
		background: rgba(255, 255, 255, 0.2);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius);
	}

	.merkle-leaves {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-3);
	}

	.merkle-leaf {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-3);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		cursor: pointer;
		transition: all 0.2s;
	}

	.merkle-leaf:hover {
		border-color: var(--color-primary);
	}

	.merkle-leaf.selected {
		border-color: var(--color-primary);
		background: color-mix(in srgb, var(--color-primary) 5%, transparent);
	}

	.leaf-name {
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-foreground);
	}

	.hash {
		font-family: var(--font-family-mono);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.proof-details {
		margin-top: var(--space-6);
		padding: var(--space-4);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.proof-details h4 {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-3);
	}

	.proof-path {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.proof-step {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		background: var(--color-panel-1);
		border-radius: var(--radius);
	}

	.proof-step :global(svg) {
		color: var(--color-muted-foreground);
	}

	.proof-step code {
		font-family: var(--font-family-mono);
		font-size: var(--text-xs);
		color: var(--color-foreground);
	}

	.verification-result {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-danger);
		color: white;
		border-radius: var(--radius);
		font-weight: 500;
	}

	.verification-result.valid {
		background: var(--color-success);
	}

	@media (max-width: 768px) {
		.merkle-leaves {
			grid-template-columns: 1fr;
		}
	}
</style>
