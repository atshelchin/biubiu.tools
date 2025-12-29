<script lang="ts">
	import { onMount } from 'svelte';
	import { StepToolApp } from '$lib/step-tool-system';
	import { tokenBalanceScannerTool } from '@/features/token-balance-scanner/tool';
	import SessionManagerModal from '@/features/token-balance-scanner/ui/components/session-manager-modal.svelte';
	import {
		getStorage,
		isIndexedDBAvailable,
		type ScanSession
	} from '$lib/services/balance-scanner/storage';
	import { step5State } from '@/features/token-balance-scanner/stores/step5-state.svelte';
	import type { StepManager } from '$lib/components/ui/step-indicator.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Session management state
	let showSessionModal = $state(false);
	let activeSessions = $state<ScanSession[]>([]);
	let initialStep = $state(1);
	let stepManager = $state<StepManager | null>(null);
	let isLoading = $state(true);

	// Check for active sessions on mount
	onMount(async () => {
		if (isIndexedDBAvailable()) {
			try {
				const storage = getStorage();
				// Clean up expired sessions first (30-day auto-cleanup)
				await storage.cleanupExpiredSessions();
				// Get active sessions
				const sessions = await storage.getActiveSessions();
				if (sessions.length > 0) {
					activeSessions = sessions;
					showSessionModal = true;
				}
			} catch (err) {
				console.error('Failed to check for active sessions:', err);
			}
		}
		isLoading = false;
	});

	function handleStepManagerReady(manager: StepManager) {
		stepManager = manager;
	}

	function handleResumeSession(session: ScanSession) {
		// Store the session to restore in step5State
		step5State.setSessionToRestore(session);
		// Navigate to step 5
		initialStep = 5;
		showSessionModal = false;
		// If step manager is already available, navigate directly
		if (stepManager) {
			stepManager.goTo(5);
		}
	}

	function handleStartNew() {
		// Reset step5State and start fresh
		step5State.reset();
		initialStep = 1;
		showSessionModal = false;
	}

	function handleCloseModal() {
		showSessionModal = false;
	}
</script>

<StepToolApp
	feature={tokenBalanceScannerTool}
	meta={data.meta}
	structuredData={data.structuredData}
	{initialStep}
	onStepManagerReady={handleStepManagerReady}
/>

{#if !isLoading && showSessionModal}
	<SessionManagerModal
		sessions={activeSessions}
		onClose={handleCloseModal}
		onResumeSession={handleResumeSession}
		onStartNew={handleStartNew}
	/>
{/if}
