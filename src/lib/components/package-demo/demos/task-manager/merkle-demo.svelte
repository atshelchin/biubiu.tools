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
	import { Plus, Shield, CheckCircle2, XCircle, ChevronRight, Copy, Check } from '@lucide/svelte';
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

			// Check if nodes have empty hashes (old data before fix)
			// If so, delete and recreate to get proper hashes
			if (nodes.length > 0 && !nodes[0].hash) {
				await manager.delete(task.id);
				// Auto-create new task with proper hashes
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
			}
		}
		loading = false;
	});

	async function createTask() {
		// Delete existing task first to ensure fresh data
		if (task) {
			await manager.delete(task.id);
		}

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

	// Copy functionality
	let copiedField = $state<string | null>(null);

	async function copyToClipboard(value: string, field: string) {
		await navigator.clipboard.writeText(value);
		copiedField = field;
		setTimeout(() => {
			copiedField = null;
		}, 2000);
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
							<div class="hash-row">
								<code class="hash full">{task.merkleRoot}</code>
								<button
									class="copy-btn"
									onclick={() => copyToClipboard(task?.merkleRoot ?? '', 'root')}
									title="Copy"
								>
									{#if copiedField === 'root'}
										<Check size={14} />
									{:else}
										<Copy size={14} />
									{/if}
								</button>
							</div>
						</div>
					</div>

					<div class="merkle-leaves">
						{#each nodes as node, index (node.id)}
							<div
								class="merkle-leaf"
								class:selected={index === selectedLeafIndex}
								onclick={() => (selectedLeafIndex = index)}
							>
								<span class="leaf-name">{node.name}</span>
								<div class="hash-row">
									<code class="hash full">{node.hash}</code>
									<button
										class="copy-btn"
										onclick={(e) => {
											e.stopPropagation();
											copyToClipboard(node.hash, `leaf-${index}`);
										}}
										title="Copy"
									>
										{#if copiedField === `leaf-${index}`}
											<Check size={14} />
										{:else}
											<Copy size={14} />
										{/if}
									</button>
								</div>
							</div>
						{/each}
					</div>
				</div>

				{#if proof}
					<div class="proof-details">
						<div class="proof-section">
							<h4>{t('demo.merkle.leaf_hash')}</h4>
							<div class="hash-row">
								<code class="hash full">{proof.leaf}</code>
								<button
									class="copy-btn"
									onclick={() => copyToClipboard(proof?.leaf ?? '', 'proof-leaf')}
									title="Copy"
								>
									{#if copiedField === 'proof-leaf'}
										<Check size={14} />
									{:else}
										<Copy size={14} />
									{/if}
								</button>
							</div>
						</div>

						<div class="proof-section">
							<h4>{t('demo.merkle.proof_path')} ({proof.proof.length} steps)</h4>
							<div class="proof-path">
								{#each proof.proof as hash, i (i)}
									<div class="proof-step">
										<span class="step-index">{i + 1}</span>
										<code class="hash full">{hash}</code>
										<button
											class="copy-btn"
											onclick={() => copyToClipboard(hash, `proof-${i}`)}
											title="Copy"
										>
											{#if copiedField === `proof-${i}`}
												<Check size={14} />
											{:else}
												<Copy size={14} />
											{/if}
										</button>
									</div>
								{/each}
							</div>
						</div>

						<div class="proof-section">
							<h4>{t('demo.merkle.merkle_root')}</h4>
							<div class="hash-row">
								<code class="hash full">{proof.root}</code>
								<button
									class="copy-btn"
									onclick={() => copyToClipboard(proof?.root ?? '', 'proof-root')}
									title="Copy"
								>
									{#if copiedField === 'proof-root'}
										<Check size={14} />
									{:else}
										<Copy size={14} />
									{/if}
								</button>
							</div>
						</div>

						<div class="proof-section">
							<h4>Copy All (JSON)</h4>
							<button
								class="copy-all-btn"
								onclick={() => copyToClipboard(JSON.stringify(proof, null, 2), 'proof-all')}
							>
								{#if copiedField === 'proof-all'}
									<Check size={14} />
									<span>Copied!</span>
								{:else}
									<Copy size={14} />
									<span>Copy Proof JSON</span>
								{/if}
							</button>
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
		font-size: var(--text-xs);
		background: rgba(255, 255, 255, 0.2);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius);
	}

	.hash-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.hash.full {
		word-break: break-all;
		font-size: var(--text-xs);
	}

	.copy-btn {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-1);
		background: rgba(255, 255, 255, 0.2);
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		color: inherit;
		transition: background 0.2s;
	}

	.copy-btn:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.merkle-leaf .copy-btn {
		background: var(--color-panel-2);
		color: var(--color-muted-foreground);
	}

	.merkle-leaf .copy-btn:hover {
		background: var(--color-panel-1);
		color: var(--color-foreground);
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
		margin-bottom: var(--space-2);
	}

	.proof-section {
		margin-bottom: var(--space-4);
	}

	.proof-section .hash-row {
		padding: var(--space-2);
		background: var(--color-panel-1);
		border-radius: var(--radius);
	}

	.proof-section .copy-btn {
		background: var(--color-panel-2);
		color: var(--color-muted-foreground);
	}

	.proof-section .copy-btn:hover {
		background: var(--color-primary);
		color: white;
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

	.step-index {
		flex-shrink: 0;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-xs);
		font-weight: 600;
		background: var(--color-primary);
		color: white;
		border-radius: 50%;
	}

	.proof-step code {
		flex: 1;
		font-family: var(--font-family-mono);
		font-size: var(--text-xs);
		color: var(--color-foreground);
		word-break: break-all;
	}

	.proof-step .copy-btn {
		background: var(--color-panel-2);
		color: var(--color-muted-foreground);
	}

	.proof-step .copy-btn:hover {
		background: var(--color-primary);
		color: white;
	}

	.copy-all-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		cursor: pointer;
		color: var(--color-foreground);
		font-size: var(--text-sm);
		transition: all 0.2s;
	}

	.copy-all-btn:hover {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
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
