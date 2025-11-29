<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { step3NFTConfigState } from '../../stores/step3-nft-config-state.svelte';
	import { step4DeployState } from '../../stores/step4-deploy-state.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Loader2, CheckCircle, XCircle, ExternalLink } from '@lucide/svelte';
	import {
		createPublicClient,
		createWalletClient,
		custom,
		http,
		type Address,
		type Log
	} from 'viem';
	import { NFT_FACTORY_ABI } from '../../contracts/abis';
	import { KNOWN_CONTRACTS } from '$lib/utils/blockchain-checker';

	const i18n = useI18n();
	const connectStore = useConnectStore();

	let deploying = $state(false);

	const config = $derived(step3NFTConfigState.getConfig());
	const network = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);
	const address = $derived(connectStore.address);

	async function handleDeploy() {
		if (!network || !address) return;

		deploying = true;
		step4DeployState.setDeploying();

		try {
			const rpcUrl = network.rpcEndpoints[0].url;
			const chain = {
				id: network.chainId,
				name: network.name,
				nativeCurrency: { name: network.symbol, symbol: network.symbol, decimals: 18 },
				rpcUrls: { default: { http: [rpcUrl] } }
			} as const;

			const publicClient = createPublicClient({
				chain,
				transport: http(rpcUrl)
			});

			const walletClient = createWalletClient({
				chain,
				transport: custom(window.ethereum!)
			});

			// Call NFTFactory.createERC721
			const hash = await walletClient.writeContract({
				address: KNOWN_CONTRACTS.NFT_FACTORY as Address,
				abi: NFT_FACTORY_ABI,
				functionName: 'createERC721',
				args: [
					config.name,
					config.symbol,
					config.baseURI,
					config.publicMintEnabled,
					config.stakeToMintEnabled,
					config.stakeToken,
					config.stakeAmount
				],
				account: address as Address
			});

			// Wait for transaction confirmation
			const receipt = await publicClient.waitForTransactionReceipt({ hash });

			// Get NFT address from event logs
			const nftCreatedEvent = receipt.logs.find((log: Log) => {
				try {
					// Simple check for NFTCreated event signature
					return (
						log.topics[0] ===
						NFT_FACTORY_ABI.find((item) => item.type === 'event' && item.name === 'NFTCreated')
							?.name
					);
				} catch {
					return false;
				}
			});

			let nftAddress: Address | null = null;
			if (nftCreatedEvent && nftCreatedEvent.topics[1]) {
				// NFTCreated event: indexed nftAddress is in topics[1]
				nftAddress = ('0x' + nftCreatedEvent.topics[1].slice(-40)) as Address;
			}

			if (nftAddress) {
				step4DeployState.setCompleted(nftAddress, hash);
			} else {
				throw new Error('Failed to get NFT address from transaction receipt');
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			step4DeployState.setError(errorMessage);
		} finally {
			deploying = false;
		}
	}

	function getExplorerUrl(address: string): string {
		if (!network || !network.blockExplorer) return '';
		return `${network.blockExplorer}/address/${address}`;
	}

	function getTxExplorerUrl(hash: string): string {
		if (!network || !network.blockExplorer) return '';
		return `${network.blockExplorer}/tx/${hash}`;
	}
</script>

<div class="space-y-6">
	<!-- Configuration Review -->
	<Card>
		<CardHeader>
			<CardTitle>{i18n.t('tools.nft_deployer.step4.content.review.title')}</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<!-- Basic Info -->
			<div class="space-y-2">
				<h4 class="text-sm font-medium">
					{i18n.t('tools.nft_deployer.step4.content.review.basic_info')}
				</h4>
				<div class="grid grid-cols-2 gap-2 text-sm">
					<div class="text-muted-foreground">
						{i18n.t('tools.nft_deployer.step3.content.name.label')}:
					</div>
					<div class="font-medium">{config.name}</div>

					<div class="text-muted-foreground">
						{i18n.t('tools.nft_deployer.step3.content.symbol.label')}:
					</div>
					<div class="font-medium">{config.symbol}</div>

					<div class="text-muted-foreground">
						{i18n.t('tools.nft_deployer.step3.content.baseuri.label')}:
					</div>
					<div class="font-medium break-all">{config.baseURI}</div>
				</div>
			</div>

			<!-- Mint Settings -->
			<div class="space-y-2">
				<h4 class="text-sm font-medium">
					{i18n.t('tools.nft_deployer.step4.content.review.mint_settings')}
				</h4>
				<div class="grid grid-cols-2 gap-2 text-sm">
					<div class="text-muted-foreground">
						{i18n.t('tools.nft_deployer.step3.content.public_mint.label')}:
					</div>
					<div class="font-medium">
						{config.publicMintEnabled ? i18n.t('common.enabled') : i18n.t('common.disabled')}
					</div>

					<div class="text-muted-foreground">
						{i18n.t('tools.nft_deployer.step3.content.stake_to_mint.label')}:
					</div>
					<div class="font-medium">
						{config.stakeToMintEnabled ? i18n.t('common.enabled') : i18n.t('common.disabled')}
					</div>
				</div>
			</div>

			<!-- Stake-to-Mint Settings (if enabled) -->
			{#if config.stakeToMintEnabled}
				<div class="space-y-2">
					<h4 class="text-sm font-medium">
						{i18n.t('tools.nft_deployer.step4.content.review.stake_settings')}
					</h4>
					<div class="grid grid-cols-2 gap-2 text-sm">
						<div class="text-muted-foreground">
							{i18n.t('tools.nft_deployer.step3.content.stake_token.label')}:
						</div>
						<div class="font-medium break-all">{config.stakeToken}</div>

						<div class="text-muted-foreground">
							{i18n.t('tools.nft_deployer.step3.content.stake_amount.label')}:
						</div>
						<div class="font-medium">{config.stakeAmount.toString()}</div>
					</div>
				</div>
			{/if}
		</CardContent>
	</Card>

	<!-- Deployment Status -->
	<Card>
		<CardHeader>
			<CardTitle>{i18n.t('tools.nft_deployer.step4.content.deployment.title')}</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			{#if step4DeployState.deploymentStatus === 'idle'}
				<div class="text-center py-8">
					<Button onclick={handleDeploy} disabled={deploying} class="w-full sm:w-auto">
						{#if deploying}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							{i18n.t('tools.nft_deployer.step4.content.deployment.deploying')}
						{:else}
							{i18n.t('tools.nft_deployer.step4.content.deployment.deploy_button')}
						{/if}
					</Button>
				</div>
			{:else if step4DeployState.deploymentStatus === 'deploying'}
				<div class="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
					<Loader2 class="h-5 w-5 animate-spin text-blue-600" />
					<div>
						<p class="font-medium text-blue-900 dark:text-blue-100">
							{i18n.t('tools.nft_deployer.step4.content.deployment.deploying')}
						</p>
						<p class="text-sm text-blue-700 dark:text-blue-300">
							{i18n.t('tools.nft_deployer.step4.content.deployment.please_wait')}
						</p>
					</div>
				</div>
			{:else if step4DeployState.deploymentStatus === 'completed' && step4DeployState.deployedAddress}
				<div class="space-y-4">
					<div class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
						<CheckCircle class="h-5 w-5 text-green-600" />
						<div class="flex-1">
							<p class="font-medium text-green-900 dark:text-green-100">
								{i18n.t('tools.nft_deployer.step4.content.deployment.success')}
							</p>
							<p class="text-sm text-green-700 dark:text-green-300">
								{i18n.t('tools.nft_deployer.step4.content.deployment.nft_deployed')}
							</p>
						</div>
					</div>

					<div class="space-y-2">
						<div class="flex items-center justify-between gap-2 p-3 bg-muted rounded-lg">
							<span class="text-sm text-muted-foreground">
								{i18n.t('tools.nft_deployer.step4.content.deployment.contract_address')}:
							</span>
							<div class="flex items-center gap-2">
								<code class="text-sm font-mono">{step4DeployState.deployedAddress}</code>
								<a
									href={getExplorerUrl(step4DeployState.deployedAddress)}
									target="_blank"
									rel="noopener noreferrer"
									class="text-primary hover:text-primary/80"
								>
									<ExternalLink class="h-4 w-4" />
								</a>
							</div>
						</div>

						{#if step4DeployState.transactionHash}
							<div class="flex items-center justify-between gap-2 p-3 bg-muted rounded-lg">
								<span class="text-sm text-muted-foreground">
									{i18n.t('tools.nft_deployer.step4.content.deployment.transaction_hash')}:
								</span>
								<div class="flex items-center gap-2">
									<code class="text-sm font-mono"
										>{step4DeployState.transactionHash.slice(
											0,
											10
										)}...{step4DeployState.transactionHash.slice(-8)}</code
									>
									<a
										href={getTxExplorerUrl(step4DeployState.transactionHash)}
										target="_blank"
										rel="noopener noreferrer"
										class="text-primary hover:text-primary/80"
									>
										<ExternalLink class="h-4 w-4" />
									</a>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{:else if step4DeployState.deploymentStatus === 'error' && step4DeployState.error}
				<div class="space-y-4">
					<div class="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
						<XCircle class="h-5 w-5 text-red-600 mt-0.5" />
						<div class="flex-1">
							<p class="font-medium text-red-900 dark:text-red-100">
								{i18n.t('tools.nft_deployer.step4.content.deployment.error')}
							</p>
							<p class="text-sm text-red-700 dark:text-red-300 mt-1">
								{step4DeployState.error}
							</p>
						</div>
					</div>

					<Button onclick={handleDeploy} variant="outline" class="w-full sm:w-auto">
						{i18n.t('tools.nft_deployer.step4.content.deployment.retry')}
					</Button>
				</div>
			{/if}
		</CardContent>
	</Card>
</div>
