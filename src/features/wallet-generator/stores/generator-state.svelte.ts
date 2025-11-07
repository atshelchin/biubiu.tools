/**
 * Wallet Generator Global State Store
 * Manages all state across the wallet generation workflow
 */

import type {
	InputSourceConfig,
	BlockchainType,
	WalletGeneratorConfig,
	GeneratedWallet,
	GenerationProgress
} from '../types/wallet';

// Create a reactive state class using Svelte 5 runes
class WalletGeneratorState {
	// Step 1: Input source configuration
	inputSource = $state<InputSourceConfig>({
		type: 'mnemonic',
		value: '',
		isValid: false
	});

	// Step 2: Blockchain and HD path configuration
	blockchain = $state<BlockchainType>('ethereum');
	hdPath = $state<string>("m/44'/60'/0'/0");
	customPath = $state<string>('');

	// Step 3: Generation configuration
	count = $state<number>(10);
	startIndex = $state<number>(0);
	useWorker = $state<boolean>(true);

	// Step 4: Generated wallets and progress
	generatedWallets = $state<GeneratedWallet[]>([]);
	progress = $state<GenerationProgress>({
		current: 0,
		total: 0,
		percentage: 0,
		isGenerating: false
	});

	// Derived states for validation
	isStep1Valid = $derived(this.inputSource.isValid && this.inputSource.value.length > 0);
	isStep2Valid = $derived(this.blockchain && this.hdPath.length > 0);
	isStep3Valid = $derived(this.count > 0 && this.count <= 1000);

	// Methods to update state
	setInputSource(config: Partial<InputSourceConfig>) {
		this.inputSource = { ...this.inputSource, ...config };
	}

	setBlockchain(blockchain: BlockchainType) {
		this.blockchain = blockchain;
	}

	setHDPath(path: string) {
		this.hdPath = path;
	}

	setCustomPath(path: string) {
		this.customPath = path;
	}

	setCount(count: number) {
		this.count = Math.max(1, Math.min(1000, count));
	}

	setStartIndex(index: number) {
		this.startIndex = Math.max(0, index);
	}

	setUseWorker(useWorker: boolean) {
		this.useWorker = useWorker;
	}

	setGeneratedWallets(wallets: GeneratedWallet[]) {
		this.generatedWallets = wallets;
	}

	addGeneratedWallet(wallet: GeneratedWallet) {
		this.generatedWallets.push(wallet);
	}

	updateProgress(progress: Partial<GenerationProgress>) {
		this.progress = { ...this.progress, ...progress };
	}

	startGeneration(total: number) {
		this.progress = {
			current: 0,
			total,
			percentage: 0,
			isGenerating: true
		};
		this.generatedWallets = [];
	}

	completeGeneration() {
		this.progress = {
			...this.progress,
			current: this.progress.total,
			percentage: 100,
			isGenerating: false
		};
	}

	// Get full configuration
	getConfig(): WalletGeneratorConfig {
		return {
			inputSource: this.inputSource,
			blockchain: this.blockchain,
			hdPath: this.hdPath || this.customPath,
			count: this.count,
			startIndex: this.startIndex,
			useWorker: this.useWorker
		};
	}

	// Reset state
	reset() {
		this.inputSource = {
			type: 'mnemonic',
			value: '',
			isValid: false
		};
		this.blockchain = 'ethereum';
		this.hdPath = "m/44'/60'/0'/0";
		this.customPath = '';
		this.count = 10;
		this.startIndex = 0;
		this.useWorker = true;
		this.generatedWallets = [];
		this.progress = {
			current: 0,
			total: 0,
			percentage: 0,
			isGenerating: false
		};
	}
}

// Singleton instance
let generatorStateInstance: WalletGeneratorState | null = null;

export function createGeneratorState(): WalletGeneratorState {
	if (!generatorStateInstance) {
		generatorStateInstance = new WalletGeneratorState();
	}
	return generatorStateInstance;
}

export function useGeneratorState(): WalletGeneratorState {
	if (!generatorStateInstance) {
		throw new Error('Generator state not initialized. Call createGeneratorState() first.');
	}
	return generatorStateInstance;
}
