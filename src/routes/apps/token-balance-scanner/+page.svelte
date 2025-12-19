<script lang="ts">
	import { onMount } from 'svelte';
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/token-balance-scanner/ui/steps';
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
	const i18n = useI18n();

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

	const faqs = $derived([
		{
			question: i18n.t('tools.token_balance_scanner.faqs.what_is_balance_checker'),
			answer: i18n.t('tools.token_balance_scanner.faqs.balance_checker_explanation')
		},
		{
			question: i18n.t('tools.token_balance_scanner.faqs.how_many_addresses'),
			answer: i18n.t('tools.token_balance_scanner.faqs.how_many_addresses_explanation')
		},
		{
			question: i18n.t('tools.token_balance_scanner.faqs.what_tokens_supported'),
			answer: i18n.t('tools.token_balance_scanner.faqs.what_tokens_supported_explanation')
		},
		{
			question: i18n.t('tools.token_balance_scanner.faqs.is_it_free'),
			answer: i18n.t('tools.token_balance_scanner.faqs.is_it_free_explanation')
		},
		{
			question: i18n.t('tools.token_balance_scanner.faqs.what_is_multicall'),
			answer: i18n.t('tools.token_balance_scanner.faqs.multicall_explanation')
		},
		{
			question: i18n.t('tools.token_balance_scanner.faqs.can_export_results'),
			answer: i18n.t('tools.token_balance_scanner.faqs.can_export_explanation')
		},
		{
			question: i18n.t('tools.token_balance_scanner.faqs.what_networks_supported'),
			answer: i18n.t('tools.token_balance_scanner.faqs.networks_supported_explanation')
		}
	]);
</script>

<StepBasedApp
	{initialStep}
	onStepManagerReady={handleStepManagerReady}
	config={{
		meta: data.meta,
		structuredData: data.structuredData,
		steps: [
			{
				label: 'tools.token_balance_scanner.seo.step_1_name',
				description: 'tools.token_balance_scanner.seo.step_1_description'
			},
			{
				label: 'tools.token_balance_scanner.seo.step_2_name',
				description: 'tools.token_balance_scanner.seo.step_2_description'
			},
			{
				label: 'tools.token_balance_scanner.seo.step_3_name',
				description: 'tools.token_balance_scanner.seo.step_3_description'
			},
			{
				label: 'tools.token_balance_scanner.seo.step_4_name',
				description: 'tools.token_balance_scanner.seo.step_4_description'
			},
			{
				label: 'tools.token_balance_scanner.seo.step_5_name',
				description: 'tools.token_balance_scanner.seo.step_5_description'
			}
		],
		useI18nKeys: true,
		appTitle: i18n.t('tools.token_balance_scanner.title'),
		appDescription: i18n.t('tools.token_balance_scanner.description'),
		faqs: {
			title: i18n.t('common.faqs'),
			items: faqs
		},
		walletConnect: {
			chains: [mainnet, base, bsc, polygon, arbitrum, optimism],
			storageKey: 'biubiu-tools-token-balance-scanner'
		},
		stepComponents
	}}
/>

{#if !isLoading && showSessionModal}
	<SessionManagerModal
		sessions={activeSessions}
		onClose={handleCloseModal}
		onResumeSession={handleResumeSession}
		onStartNew={handleStartNew}
	/>
{/if}
