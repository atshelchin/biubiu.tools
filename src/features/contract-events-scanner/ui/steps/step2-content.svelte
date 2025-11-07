<script lang="ts">
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { contractConfigState } from '../../stores/scanner-state.svelte';
	import { isAddress } from 'viem';
	import { AlertCircle, CheckCircle2 } from 'lucide-svelte';
	import type { Address } from 'viem';

	// Reactive validation
	const isValidAddress = $derived(isAddress(contractConfigState.contractAddress));
	const hasEvents = $derived(contractConfigState.parsedEvents.length > 0);
	const hasSelectedEvent = $derived(contractConfigState.selectedEvent !== null);
	const hasError = $derived(contractConfigState.error.length > 0);

	// Handle contract address input
	function handleAddressInput(e: Event) {
		const input = e.target as HTMLInputElement;
		contractConfigState.setContractAddress(input.value as Address | '');
	}

	// Handle ABI input
	function handleABIInput(e: Event) {
		const textarea = e.target as HTMLTextAreaElement;
		contractConfigState.setContractABI(textarea.value);
	}

	// Handle event selection
	function handleEventSelect(e: Event) {
		const select = e.target as HTMLSelectElement;
		const eventName = select.value;
		const event = contractConfigState.parsedEvents.find((e) => e.name === eventName);
		contractConfigState.selectEvent(event || null);
	}

	// Format event signature for display
	function formatEventSignature(event: (typeof contractConfigState.parsedEvents)[0]): string {
		const inputs = event.inputs.map((input) => `${input.type} ${input.name}`).join(', ');
		return `${event.name}(${inputs})`;
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Contract Configuration"
		description="Configure the smart contract and event to scan"
	/>

	<!-- Contract Address Input -->
	<div class="form-section">
		<label for="contract-address" class="form-label">
			Contract Address
			{#if isValidAddress}
				<CheckCircle2 size={16} class="valid-icon" />
			{:else if contractConfigState.contractAddress.length > 0}
				<AlertCircle size={16} class="invalid-icon" />
			{/if}
		</label>
		<input
			id="contract-address"
			type="text"
			class="address-input"
			class:valid={isValidAddress}
			class:invalid={contractConfigState.contractAddress.length > 0 && !isValidAddress}
			placeholder="0x..."
			value={contractConfigState.contractAddress}
			oninput={handleAddressInput}
		/>
		{#if contractConfigState.contractAddress.length > 0 && !isValidAddress}
			<p class="error-message">Invalid Ethereum address format</p>
		{/if}
	</div>

	<!-- Contract ABI Input -->
	<div class="form-section">
		<label for="contract-abi" class="form-label">
			Contract ABI (JSON)
			{#if hasEvents}
				<CheckCircle2 size={16} class="valid-icon" />
			{:else if hasError}
				<AlertCircle size={16} class="invalid-icon" />
			{/if}
		</label>
		<textarea
			id="contract-abi"
			class="abi-textarea"
			class:valid={hasEvents}
			class:invalid={hasError}
			placeholder={'[{"type":"event","name":"Transfer","inputs":[...]}]'}
			value={contractConfigState.contractABI}
			oninput={handleABIInput}
		></textarea>
		{#if hasError}
			<p class="error-message">{contractConfigState.error}</p>
		{:else if hasEvents}
			<p class="success-message">Found {contractConfigState.parsedEvents.length} events in ABI</p>
		{/if}
	</div>

	<!-- Event Selection -->
	{#if hasEvents}
		<div class="form-section">
			<label for="event-select" class="form-label">
				Select Event to Scan
				{#if hasSelectedEvent}
					<CheckCircle2 size={16} class="valid-icon" />
				{/if}
			</label>
			<select
				id="event-select"
				class="event-select"
				class:valid={hasSelectedEvent}
				value={contractConfigState.selectedEvent?.name || ''}
				onchange={handleEventSelect}
			>
				<option value="">-- Select an event --</option>
				{#each contractConfigState.parsedEvents as event (event.name)}
					<option value={event.name}>{event.name}</option>
				{/each}
			</select>

			{#if contractConfigState.selectedEvent}
				<div class="event-preview">
					<h4>Event Signature:</h4>
					<code>{formatEventSignature(contractConfigState.selectedEvent)}</code>

					<h4>Parameters:</h4>
					<ul class="params-list">
						{#each contractConfigState.selectedEvent.inputs as input (input.name)}
							<li>
								<span class="param-name">{input.name}</span>
								<span class="param-type">{input.type}</span>
								{#if input.indexed}
									<span class="param-indexed">indexed</span>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	/* Form Sections */
	.form-section {
		margin-bottom: var(--space-6);
	}

	.form-label {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		margin-bottom: var(--space-2);
	}

	:global([data-theme='dark']) .form-label {
		color: var(--gray-300);
	}

	:global(.valid-icon) {
		color: hsla(120, 60%, 50%, 1);
	}

	:global(.invalid-icon) {
		color: hsla(0, 80%, 50%, 1);
	}

	/* Address Input */
	.address-input {
		width: 100%;
		padding: var(--space-3);
		font-family: monospace;
		font-size: var(--text-sm);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-panel-0);
		color: var(--gray-900);
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .address-input {
		color: var(--gray-100);
	}

	.address-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.address-input.valid {
		border-color: hsla(120, 60%, 50%, 1);
	}

	.address-input.invalid {
		border-color: hsla(0, 80%, 50%, 1);
	}

	/* ABI Textarea */
	.abi-textarea {
		width: 100%;
		min-height: 200px;
		padding: var(--space-3);
		font-family: monospace;
		font-size: var(--text-xs);
		line-height: 1.5;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-panel-0);
		color: var(--gray-900);
		resize: vertical;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .abi-textarea {
		color: var(--gray-100);
	}

	.abi-textarea:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.abi-textarea.valid {
		border-color: hsla(120, 60%, 50%, 1);
	}

	.abi-textarea.invalid {
		border-color: hsla(0, 80%, 50%, 1);
	}

	/* Event Select */
	.event-select {
		width: 100%;
		padding: var(--space-3);
		font-size: var(--text-base);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-panel-0);
		color: var(--gray-900);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .event-select {
		color: var(--gray-100);
	}

	.event-select:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.event-select.valid {
		border-color: hsla(120, 60%, 50%, 1);
	}

	/* Messages */
	.error-message {
		margin: var(--space-2) 0 0 0;
		font-size: var(--text-sm);
		color: hsla(0, 80%, 50%, 1);
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.success-message {
		margin: var(--space-2) 0 0 0;
		font-size: var(--text-sm);
		color: hsla(120, 60%, 50%, 1);
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	/* Event Preview */
	.event-preview {
		margin-top: var(--space-4);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.event-preview h4 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .event-preview h4 {
		color: var(--gray-300);
	}

	.event-preview h4:not(:first-child) {
		margin-top: var(--space-3);
	}

	.event-preview code {
		display: block;
		padding: var(--space-2);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--gray-900);
		overflow-x: auto;
	}

	:global([data-theme='dark']) .event-preview code {
		color: var(--gray-100);
	}

	.params-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.params-list li {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
	}

	.param-name {
		font-family: monospace;
		font-weight: var(--font-medium);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .param-name {
		color: var(--gray-100);
	}

	.param-type {
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .param-type {
		color: var(--gray-400);
	}

	.param-indexed {
		margin-left: auto;
		padding: var(--space-1) var(--space-2);
		background: hsla(210, 100%, 95%, 1);
		color: hsla(210, 100%, 40%, 1);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		border-radius: var(--radius-sm);
	}

	:global([data-theme='dark']) .param-indexed {
		background: hsla(210, 100%, 20%, 1);
		color: hsla(210, 100%, 70%, 1);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}
	}
</style>
